import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import {
  compileTestManifest,
  createTestManifest,
  createTestProof,
  createTestRegistryGraph,
  decodeTestJsonl,
  decodeTestJunitXml,
  decodeTestTap,
  diffTestRuns,
  encodeTestJsonl,
  encodeTestJunitXml,
  encodeTestTap,
  planTestRun,
  queryTestManifest,
  recordTestRun,
  summarizeTestCoverage,
  traceTestImpact,
  validateTestManifest
} from '../dist/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(__dirname, '..');
const repoRoot = path.basename(path.dirname(packageDir)) === 'packages'
  ? path.resolve(packageDir, '..', '..')
  : packageDir;
const args = parseArgs(process.argv.slice(2));
const specCount = readPositiveInt(args.specs, 1000);
const rounds = readPositiveInt(args.rounds, 30);
const outPath = args.out ? path.resolve(repoRoot, args.out) : null;

const input = makeManifestInput(specCount);
let manifest = createTestManifest(input);
let compiled = compileTestManifest(manifest);
let impact = traceTestImpact(compiled, { changedActions: ['action.feature-1.op-1'] });
let plan = planTestRun(compiled, { changedActions: ['action.feature-1.op-1'] });
let run = recordTestRun(compiled, { results: plan.specIds.map((specId) => ({ specId, status: 'passed', durationMs: 1 })) });
let run2 = recordTestRun(compiled, { results: plan.specIds.map((specId, i) => ({ specId, status: i === 0 ? 'failed' : 'passed', durationMs: 2 })) });
let tap = encodeTestTap(run);
let junit = encodeTestJunitXml(run);
let jsonl = encodeTestJsonl([impact, plan, run]);
let cursor = 0;

const rows = [
  measure('create-manifest-' + specCount, 8, () => {
    manifest = createTestManifest(input);
    return manifest.specs.length;
  }),
  measure('compile-manifest-' + specCount, 8, () => {
    compiled = compileTestManifest(manifest);
    return compiled.specsById.size;
  }),
  measure('validate-manifest-' + specCount, 8, () => validateTestManifest(manifest).issues.length),
  measure('query-action', 64, () => queryTestManifest(compiled, { actions: ['action.feature-' + (cursor++ % 16) + '.op-' + (cursor % 8)] }).specs.length),
  measure('query-feature', 64, () => queryTestManifest(compiled, { features: ['feature-' + (cursor++ % 16)] }).specs.length),
  measure('trace-action-impact', 32, () => {
    impact = traceTestImpact(compiled, { changedActions: ['action.feature-' + (cursor++ % 16) + '.op-' + (cursor % 8)] });
    return impact.specIds.length + impact.expectedPatches.length;
  }),
  measure('plan-run', 32, () => {
    plan = planTestRun(compiled, { changedActions: ['action.feature-' + (cursor++ % 16) + '.op-' + (cursor % 8)], now: cursor });
    return plan.specIds.length + plan.commandIds.length;
  }),
  measure('record-run', 16, () => {
    run = recordTestRun(compiled, { results: plan.specIds.map((specId, i) => ({ specId, status: i % 17 === 0 ? 'failed' : 'passed', durationMs: i + 1 })) });
    return run.summary.total;
  }),
  measure('diff-runs', 16, () => diffTestRuns(run, run2).summary.changed),
  measure('coverage-summary', 32, () => summarizeTestCoverage(compiled, { specIds: plan.specIds }).covered.length),
  measure('registry-graph', 4, () => {
    const graph = createTestRegistryGraph(compiled, { package: '@shapeshift-labs/frontier-test' });
    return graph.entries.length + graph.edges.length;
  }),
  measure('tap-encode', 32, () => {
    tap = encodeTestTap(run);
    return tap.length;
  }),
  measure('tap-decode', 32, () => decodeTestTap(tap).results.length),
  measure('junit-encode', 32, () => {
    junit = encodeTestJunitXml(run);
    return junit.length;
  }),
  measure('junit-decode', 32, () => decodeTestJunitXml(junit).results.length),
  measure('jsonl-encode', 32, () => {
    jsonl = encodeTestJsonl([impact, plan, run]);
    return jsonl.length;
  }),
  measure('jsonl-decode', 32, () => decodeTestJsonl(jsonl).length),
  measure('proof', 8, () => createTestProof(manifest).hash.length)
];

const report = {
  package: '@shapeshift-labs/frontier-test',
  version: readPackageVersion(),
  generatedAt: new Date().toISOString(),
  node: process.version,
  platform: process.platform + ' ' + process.arch,
  specCount,
  rounds,
  rows
};

if (outPath) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n');
}

console.log(report.package + ' package benchmark');
console.log('Node ' + report.node + ' on ' + report.platform + ', specs=' + specCount + ', rounds=' + rounds);
console.log('These are Frontier-only package measurements, not competitor comparisons.');
console.log('');
console.log(padRight('Fixture', 30) + padLeft('Median', 12) + padLeft('p95', 12));
for (const row of rows) {
  console.log(padRight(row.fixture, 30) + padLeft(formatUs(row.medianUs), 12) + padLeft(formatUs(row.p95Us), 12));
}
if (outPath) console.log('\nwrote ' + path.relative(repoRoot, outPath));

function makeManifestInput(count) {
  const featureCount = 16;
  const commands = [
    { id: 'cmd.unit', command: 'npm', args: ['test'], artifacts: ['reports/unit.json'] },
    { id: 'cmd.playwright', command: 'npx', args: ['playwright', 'test'], kind: 'playwright', artifacts: ['playwright-report/index.html'] },
    { id: 'cmd.fuzz', command: 'node', args: ['test/fuzz.js'], kind: 'fuzz', artifacts: ['benchmarks/results/fuzz.json'] },
    { id: 'cmd.bench', command: 'node', args: ['benchmarks/pkg.js'], kind: 'benchmark', artifacts: ['benchmarks/results/pkg.json'] }
  ];
  const fixtures = Array.from({ length: featureCount }, (_, i) => ({
    id: 'fixture.feature-' + i,
    kind: 'state',
    source: 'fixtures/feature-' + i + '.json',
    data: { ready: true }
  }));
  const specs = [];
  const coverageTargets = [];
  for (let i = 0; i < count; i++) {
    const feature = i % featureCount;
    const op = i % 8;
    const action = 'action.feature-' + feature + '.op-' + op;
    const route = 'route:/feature-' + feature;
    const policy = 'policy.feature-' + feature + '.write';
    coverageTargets.push(action, route, policy);
    const isFuzz = i % 11 === 0;
    const isBenchmark = i % 17 === 0;
    specs.push({
      id: 'spec.feature-' + feature + '.' + i,
      kind: isBenchmark ? 'benchmark' : isFuzz ? 'fuzz' : i % 5 === 0 ? 'playwright' : 'unit',
      feature: 'feature-' + feature,
      given: { stateFixture: 'fixture.feature-' + feature, route, capabilities: ['feature.write'] },
      when: { action, input: { id: i } },
      expect: { patches: ['/entities/feature-' + feature + '/' + i], route, policy: [policy], artifacts: isBenchmark ? ['benchmarks/results/feature-' + feature + '.json'] : [] },
      covers: [action, route, policy],
      commands: [isBenchmark ? 'cmd.bench' : isFuzz ? 'cmd.fuzz' : i % 5 === 0 ? 'cmd.playwright' : 'cmd.unit'],
      fuzzer: isFuzz ? 'feature-' + feature + '.fuzz' : undefined,
      benchmark: isBenchmark ? 'feature-' + feature + '.bench' : undefined,
      source: 'tests/feature-' + feature + '.test.ts',
      owners: ['@team/feature-' + feature],
      tags: ['feature-' + feature, isFuzz ? 'fuzz' : isBenchmark ? 'benchmark' : 'test']
    });
  }
  return { id: 'bench.tests', specs, fixtures, commands, coverageTargets, metadata: { token: 'bench-secret' } };
}

function measure(fixture, batchSize, fn) {
  const values = [];
  let sink = 0;
  for (let round = 0; round < rounds; round++) {
    const started = performance.now();
    for (let i = 0; i < batchSize; i++) sink += fn();
    values[values.length] = ((performance.now() - started) * 1000) / batchSize;
  }
  if (sink === -1) console.log('sink=' + sink);
  values.sort((left, right) => left - right);
  return { fixture, medianUs: percentile(values, 0.5), p95Us: percentile(values, 0.95) };
}

function percentile(values, p) {
  return values[Math.min(values.length - 1, Math.floor((values.length - 1) * p))] ?? 0;
}

function formatUs(value) {
  if (value >= 1000) return (value / 1000).toFixed(2) + ' ms';
  return value.toFixed(2) + ' us';
}

function padRight(value, width) {
  return String(value).padEnd(width, ' ');
}

function padLeft(value, width) {
  return String(value).padStart(width, ' ');
}

function readPackageVersion() {
  return JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8')).version;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--specs') out.specs = argv[++i];
    else if (arg === '--rounds') out.rounds = argv[++i];
    else if (arg === '--out') out.out = argv[++i];
    else if (arg === '--help' || arg === '-h') {
      console.log('Usage: npm run bench -- [--specs 1000] [--rounds 30] [--out benchmarks/results/frontier-test-package-bench-latest.json]');
      process.exit(0);
    }
  }
  return out;
}

function readPositiveInt(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}
