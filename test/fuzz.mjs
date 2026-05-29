import assert from 'node:assert';
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

const args = parseArgs(process.argv.slice(2));
const cases = readPositiveInt(args.cases, 500);
let seed = readPositiveInt(args.seed, 0x7e57);
let checked = 0;

for (let i = 0; i < cases; i++) {
  const input = makeManifestInput(i);
  const manifest = createTestManifest(input);
  const compiled = compileTestManifest(manifest);
  const validation = validateTestManifest(manifest);
  assert.strictEqual(compiled.validation.valid, validation.valid);
  assert.strictEqual(compiled.manifest.specs.length, manifest.specs.length);

  const feature = 'feature-' + nextInt(input.featureCount);
  const featureSpecs = queryTestManifest(compiled, { features: [feature] }).specs;
  assert.ok(featureSpecs.every((spec) => spec.feature === feature));

  const action = 'action.feature-' + nextInt(input.featureCount) + '.op-' + nextInt(4);
  const impact = traceTestImpact(compiled, { changedActions: [action] });
  assert.ok(Array.isArray(impact.specIds));
  assert.ok(Array.isArray(impact.expectedPatches));

  const plan = planTestRun(compiled, { changedActions: [action], mode: 'fuzz', now: i + 1, shard: { index: i % 2, count: 2 } });
  assert.ok(plan.specIds.length <= impact.specIds.length);

  const run = recordTestRun(compiled, {
    id: 'run:' + i,
    startedAt: i,
    finishedAt: i + 10,
    results: plan.specIds.map((specId, index) => ({
      specId,
      status: index % 5 === 0 ? 'failed' : 'passed',
      durationMs: index + 1,
      artifacts: ['reports/' + specId + '.json']
    }))
  });
  const rerun = recordTestRun(compiled, {
    id: 'run:' + i + ':rerun',
    startedAt: i + 20,
    finishedAt: i + 30,
    results: run.results.map((result) => ({ specId: result.specId, status: 'passed', durationMs: result.durationMs }))
  });
  assert.ok(diffTestRuns(run, rerun).summary.changed >= 0);
  assert.ok(summarizeTestCoverage(compiled, { specIds: plan.specIds }).coverageRatio >= 0);
  assert.ok(createTestRegistryGraph(compiled).entries.length >= manifest.specs.length);
  assert.strictEqual(decodeTestTap(encodeTestTap(run)).results.length, run.results.length);
  assert.strictEqual(decodeTestJunitXml(encodeTestJunitXml(run)).results.length, run.results.length);
  assert.strictEqual(decodeTestJsonl(encodeTestJsonl([impact, plan, run])).length, 3);
  assert.notStrictEqual(createTestProof(manifest).hash.length, 0);
  checked++;
}

console.log('frontier-test fuzz ok: ' + checked + ' cases');

function makeManifestInput(index) {
  const featureCount = 2 + nextInt(6);
  const specsPerFeature = 4 + nextInt(8);
  const commands = [
    { id: 'cmd.unit', command: 'npm', args: ['test'], artifacts: ['reports/unit.json'] },
    { id: 'cmd.fuzz', command: 'node', args: ['test/fuzz.js'], kind: 'fuzz', artifacts: ['benchmarks/results/fuzz.json'] },
    { id: 'cmd.bench', command: 'node', args: ['benchmarks/pkg.js'], kind: 'benchmark', artifacts: ['benchmarks/results/pkg.json'] }
  ];
  const fixtures = Array.from({ length: featureCount }, (_, i) => ({
    id: 'fixture.feature-' + i,
    kind: 'state',
    source: 'fixtures/feature-' + i + '.json',
    data: { index, i }
  }));
  const specs = [];
  const coverageTargets = [];
  for (let feature = 0; feature < featureCount; feature++) {
    for (let j = 0; j < specsPerFeature; j++) {
      const action = 'action.feature-' + feature + '.op-' + (j % 4);
      const route = 'route:/feature-' + feature;
      coverageTargets.push(action, route, 'policy.feature-' + feature + '.write');
      specs.push({
        id: 'spec.feature-' + feature + '.' + j,
        kind: j % 7 === 0 ? 'benchmark' : j % 5 === 0 ? 'fuzz' : j % 3 === 0 ? 'playwright' : 'unit',
        feature: 'feature-' + feature,
        given: { stateFixture: 'fixture.feature-' + feature, route, capabilities: ['feature.write'] },
        when: { action, input: { id: j } },
        expect: {
          patches: ['/entities/feature-' + feature + '/' + j],
          route,
          policy: ['policy.feature-' + feature + '.write'],
          artifacts: j % 7 === 0 ? ['benchmarks/results/feature-' + feature + '.json'] : []
        },
        covers: [action, route, 'policy.feature-' + feature + '.write'],
        commands: [j % 7 === 0 ? 'cmd.bench' : j % 5 === 0 ? 'cmd.fuzz' : 'cmd.unit'],
        fuzzer: j % 5 === 0 ? 'feature-' + feature + '.fuzz' : undefined,
        benchmark: j % 7 === 0 ? 'feature-' + feature + '.bench' : undefined,
        tags: ['feature-' + feature, j % 2 === 0 ? 'even' : 'odd']
      });
    }
  }
  return { id: 'tests-' + index, featureCount, specs, fixtures, commands, coverageTargets };
}

function nextInt(max) {
  return next() % max;
}

function next() {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--cases') out.cases = argv[++i];
    else if (argv[i] === '--seed') out.seed = argv[++i];
  }
  return out;
}

function readPositiveInt(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}
