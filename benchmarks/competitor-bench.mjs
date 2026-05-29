import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import {
  compileTestManifest,
  createTestManifest,
  decodeTestJunitXml,
  decodeTestTap,
  encodeTestJunitXml,
  encodeTestTap,
  planTestRun,
  recordTestRun,
  traceTestImpact
} from '../dist/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const packageDir = path.resolve(__dirname, '..');
const repoRoot = path.basename(path.dirname(packageDir)) === 'packages'
  ? path.resolve(packageDir, '..', '..')
  : packageDir;
const args = parseArgs(process.argv.slice(2));
const specs = readPositiveInt(args.specs, 1000);
const rounds = readPositiveInt(args.rounds, 30);
const outPath = args.out ? path.resolve(repoRoot, args.out) : null;

const manifest = createTestManifest(makeManifestInput(specs));
const compiled = compileTestManifest(manifest);
const plan = planTestRun(compiled, { changedActions: ['action.feature-1.op-1'], now: 1 });
const run = recordTestRun(compiled, { results: plan.specIds.map((specId, i) => ({ specId, status: i % 9 === 0 ? 'failed' : 'passed', durationMs: i + 1 })) });
let junit = encodeTestJunitXml(run);
let tap = encodeTestTap(run);
let cursor = 0;
const coverageMap = new Map(Array.from({ length: specs }, (_, i) => ['action.feature-' + (i % 16) + '.op-' + (i % 8), i]));

const rows = [
  measure('frontier-test:trace-impact', 64, () => traceTestImpact(compiled, { changedActions: ['action.feature-' + (cursor++ % 16) + '.op-' + (cursor % 8)] }).specIds.length),
  measure('frontier-test:plan-run', 64, () => planTestRun(compiled, { changedActions: ['action.feature-' + (cursor++ % 16) + '.op-' + (cursor % 8)] }).specIds.length),
  measure('frontier-test:record-run', 16, () => recordTestRun(compiled, { results: plan.specIds.map((specId) => ({ specId, status: 'passed', durationMs: 1 })) }).summary.total),
  measure('junit-xml:encode', 32, () => {
    junit = encodeTestJunitXml(run);
    return junit.length;
  }),
  measure('junit-xml:decode', 32, () => decodeTestJunitXml(junit).results.length),
  measure('tap:encode', 32, () => {
    tap = encodeTestTap(run);
    return tap.length;
  }),
  measure('tap:decode', 32, () => decodeTestTap(tap).results.length),
  measure('cucumber-messages:envelope-shape', 64, () => createCucumberEnvelope(cursor++).testCaseStarted.attempt),
  measure('allure:result-shape', 64, () => createAllureResult(cursor++).labels.length),
  measure('plain-coverage-map:lookup', 256, () => plainCoverageLookup(cursor++))
];

const report = {
  package: '@shapeshift-labs/frontier-test',
  type: 'competitor-control',
  generatedAt: new Date().toISOString(),
  node: process.version,
  platform: process.platform + ' ' + process.arch,
  specs,
  rounds,
  competitors: {
    '@cucumber/messages': safeReadVersion('@cucumber/messages'),
    'junit-report-builder': safeReadVersion('junit-report-builder'),
    'tap-parser': safeReadVersion('tap-parser'),
    'fast-check': safeReadVersion('fast-check')
  },
  notes: [
    'JUnit XML and TAP rows use the package report adapters because those formats are file protocols, not queryable spec manifests.',
    'Cucumber and Allure rows are representative envelope/result object shapes; Frontier rows include coverage and impact indexes.'
  ],
  rows
};

if (outPath) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n');
}

console.log('frontier-test competitor/control benchmark');
console.log('Node ' + report.node + ' on ' + report.platform + ', specs=' + specs + ', rounds=' + rounds);
console.log('Fixture'.padEnd(38) + 'Median'.padStart(12) + 'p95'.padStart(12));
for (const row of rows) console.log(row.fixture.padEnd(38) + formatUs(row.medianUs).padStart(12) + formatUs(row.p95Us).padStart(12));
if (outPath) console.log('\nwrote ' + path.relative(repoRoot, outPath));

function plainCoverageLookup(i) {
  return coverageMap.get('action.feature-' + (i % 16) + '.op-' + (i % 8)) ?? 0;
}

function createCucumberEnvelope(i) {
  return {
    testCaseStarted: {
      id: 'case-' + i,
      testCaseId: 'spec-' + i,
      attempt: i % 3,
      timestamp: { seconds: Math.floor(Date.now() / 1000), nanos: 0 }
    }
  };
}

function createAllureResult(i) {
  return {
    uuid: 'result-' + i,
    name: 'spec-' + i,
    status: i % 11 === 0 ? 'failed' : 'passed',
    labels: [
      { name: 'feature', value: 'feature-' + (i % 16) },
      { name: 'owner', value: '@team/feature-' + (i % 16) }
    ],
    links: [{ type: 'issue', url: 'https://example.test/' + i }]
  };
}

function makeManifestInput(count) {
  const commands = [{ id: 'cmd.unit', command: 'npm', args: ['test'] }];
  const specs = [];
  for (let i = 0; i < count; i++) {
    const feature = i % 16;
    const op = i % 8;
    const action = 'action.feature-' + feature + '.op-' + op;
    specs.push({
      id: 'spec.feature-' + feature + '.' + i,
      feature: 'feature-' + feature,
      when: { action },
      expect: { patches: ['/entities/feature-' + feature + '/' + i] },
      covers: [action, 'route:/feature-' + feature],
      commands: ['cmd.unit']
    });
  }
  return { id: 'competitor.tests', specs, commands };
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

function safeReadVersion(name) {
  try {
    const resolved = require.resolve(name + '/package.json');
    return JSON.parse(fs.readFileSync(resolved, 'utf8')).version;
  } catch {
    return 'not-installed';
  }
}

function formatUs(value) {
  if (value >= 1000) return (value / 1000).toFixed(2) + ' ms';
  return value.toFixed(2) + ' us';
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--specs') out.specs = argv[++i];
    else if (arg === '--rounds') out.rounds = argv[++i];
    else if (arg === '--out') out.out = argv[++i];
  }
  return out;
}

function readPositiveInt(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}
