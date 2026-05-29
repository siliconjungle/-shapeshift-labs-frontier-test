import assert from 'node:assert';
import {
  compileTestManifest,
  createTestManifest,
  createTestProof,
  createTestRegistryGraph,
  decodeTestJsonl,
  decodeTestJunitXml,
  decodeTestTap,
  defineSpec,
  diffTestRuns,
  encodeTestJsonl,
  encodeTestJunitXml,
  encodeTestTap,
  planTestRun,
  queryTestManifest,
  recordTestRun,
  redactTestValue,
  summarizeTestCoverage,
  traceTestImpact,
  validateTestManifest
} from '../dist/index.js';

const manifest = createTestManifest({
  id: 'app.tests',
  package: '@app/web',
  feature: 'todos',
  owner: '@team/app',
  metadata: { apiKey: 'secret' },
  fixtures: [
    { id: 'todos.open', kind: 'state', source: 'fixtures/todos-open.json', data: { todos: [{ id: 't1', done: false }] } },
    { id: 'policy.todo.write', kind: 'policy', data: { capabilities: ['todo.write'] } }
  ],
  commands: [
    { id: 'cmd.unit', command: 'npm', args: ['run', 'test:todos'], artifacts: ['reports/unit.json'] },
    { id: 'cmd.playwright', command: 'npx', args: ['playwright', 'test'], artifacts: ['playwright-report/index.html'] },
    { id: 'cmd.fuzz', command: 'node', args: ['test/todos-fuzz.js'], kind: 'fuzz', artifacts: ['benchmarks/results/todos-fuzz-latest.json'] },
    { id: 'cmd.bench', command: 'node', args: ['benchmarks/todos.js'], kind: 'benchmark', artifacts: ['benchmarks/results/todos-bench-latest.json'] }
  ],
  specs: [
    {
      id: 'spec.todos.complete',
      kind: 'unit',
      feature: 'todos',
      given: { stateFixture: 'todos.open', fixtures: ['policy.todo.write'], route: 'route:/todos', capabilities: ['todo.write'] },
      when: { action: 'action.todos.complete', input: { id: 't1' } },
      expect: {
        patches: ['/entities/todos/t1/done'],
        effects: [],
        route: 'route:/todos',
        policy: ['policy.todo.write'],
        assertions: ['todo done is true']
      },
      covers: ['action.todos.complete', 'view.todos.list', 'policy.todo.write'],
      commands: ['cmd.unit'],
      owners: ['@team/app'],
      source: 'test/todos.test.ts',
      tags: ['smoke']
    },
    {
      id: 'spec.todos.complete.e2e',
      kind: 'playwright',
      feature: 'todos',
      given: { route: 'route:/todos' },
      when: { action: 'action.todos.complete' },
      expect: { route: 'route:/todos', artifacts: ['playwright-report/index.html'] },
      covers: ['route:/todos', 'view.todos.list'],
      commands: ['cmd.playwright'],
      source: 'tests/todos.spec.ts',
      artifacts: ['trace:todos-complete']
    },
    {
      id: 'spec.todos.complete.fuzz',
      kind: 'fuzz',
      feature: 'todos',
      when: { action: 'action.todos.complete' },
      expect: { patches: ['/entities/todos/:id/done'] },
      covers: ['action.todos.complete'],
      commands: ['cmd.fuzz'],
      fuzzer: 'todos.complete.fuzz',
      tags: ['fuzz']
    },
    {
      id: 'spec.todos.complete.benchmark',
      kind: 'benchmark',
      feature: 'todos',
      when: { action: 'action.todos.complete' },
      expect: { artifacts: ['benchmarks/results/todos-bench-latest.json'] },
      covers: ['benchmark:todos.complete'],
      commands: ['cmd.bench'],
      benchmark: 'todos.complete'
    },
    {
      id: 'spec.migration.todos.v2',
      kind: 'migration',
      feature: 'todos',
      when: { migration: 'migration.todos.v2' },
      expect: { patches: ['/entities/todos'], assertions: ['shape is current'] },
      covers: ['migration.todos.v2'],
      commands: ['cmd.unit']
    }
  ],
  coverageTargets: ['action.todos.complete', 'view.todos.list', 'policy.todo.write', 'route:/todos', 'migration.todos.v2', 'effect.todos.sync']
});

assert.strictEqual(defineSpec({ id: 'spec.empty', expect: { assertions: ['ok'] } }).testKind, 'unit');
assert.strictEqual(manifest.summary.specCount, 5);
assert.strictEqual(manifest.summary.fuzzSpecCount, 1);
assert.strictEqual(manifest.summary.benchmarkSpecCount, 1);
assert.strictEqual(validateTestManifest(manifest).valid, true);

const invalid = validateTestManifest({ specs: [{ id: 'spec.same', expect: { assertions: ['a'] } }, { id: 'spec.same', expect: { assertions: ['b'] } }] });
assert.strictEqual(invalid.valid, false);

const compiled = compileTestManifest(manifest);
assert.strictEqual(compiled.get('spec.todos.complete').expect.patches[0], '/entities/todos/t1/done');
assert.deepStrictEqual(queryTestManifest(compiled, { actions: ['action.todos.complete'], kinds: ['unit'] }).ids, ['spec.todos.complete']);
assert.ok(queryTestManifest(compiled, { fixtures: ['todos.open'] }).ids.includes('spec.todos.complete'));
assert.ok(queryTestManifest(compiled, { benchmarks: ['todos.complete'] }).ids.includes('spec.todos.complete.benchmark'));

const impact = traceTestImpact(compiled, { changedActions: ['action.todos.complete'], expectedCoverage: ['action.todos.complete', 'effect.todos.sync'] });
assert.ok(impact.specIds.includes('spec.todos.complete'));
assert.ok(impact.specIds.includes('spec.todos.complete.fuzz'));
assert.ok(impact.expectedPatches.includes('/entities/todos/t1/done'));
assert.ok(impact.uncovered.includes('effect.todos.sync'));

const plan = planTestRun(compiled, { changedActions: ['action.todos.complete'], mode: 'agent-change', now: 1000 });
assert.strictEqual(plan.createdAt, 1000);
assert.ok(plan.commandIds.includes('cmd.unit'));
assert.ok(plan.commandIds.includes('cmd.fuzz'));

const run = recordTestRun(compiled, {
  id: 'run:1',
  planId: plan.id,
  startedAt: 1000,
  finishedAt: 1100,
  commandIds: plan.commandIds,
  results: plan.specIds.map((specId, index) => ({
    specId,
    status: index === 0 ? 'failed' : 'passed',
    durationMs: 10 + index,
    patches: specId === 'spec.todos.complete' ? ['/entities/todos/t1/done'] : [],
    artifacts: ['reports/' + specId + '.json'],
    error: index === 0 ? 'expected false to be true' : undefined
  }))
});
assert.strictEqual(run.status, 'failed');
assert.strictEqual(run.summary.failed, 1);
assert.ok(run.coverage.covered.includes('action.todos.complete'));

const run2 = recordTestRun(compiled, {
  id: 'run:2',
  startedAt: 1200,
  finishedAt: 1220,
  results: run.results.map((result) => ({ specId: result.specId, status: 'passed', durationMs: result.durationMs }))
});
const diff = diffTestRuns(run, run2);
assert.strictEqual(diff.statusChanged.length, 1);

const coverage = summarizeTestCoverage(compiled, { specIds: ['spec.todos.complete'] });
assert.ok(coverage.uncovered.includes('effect.todos.sync'));

const graph = createTestRegistryGraph(manifest, { generatedAt: 1300 });
assert.ok(graph.entries.some((entry) => entry.id === 'test-spec:spec.todos.complete'));
assert.ok(graph.edges.some((edge) => edge.kind === 'covers' && edge.to.endsWith('action.todos.complete')));
assert.ok(graph.edges.some((edge) => edge.kind === 'runs-command' && edge.to === 'test-command:cmd.unit'));

const tap = encodeTestTap(run);
assert.strictEqual(decodeTestTap(tap).results.length, run.results.length);
const junit = encodeTestJunitXml(run);
assert.strictEqual(decodeTestJunitXml(junit).results.length, run.results.length);
const jsonl = encodeTestJsonl([impact, plan, run]);
assert.strictEqual(decodeTestJsonl(jsonl).length, 3);
assert.strictEqual(JSON.stringify(redactTestValue(manifest)).includes('secret'), false);
assert.notStrictEqual(createTestProof(manifest, { generatedAt: 1 }).hash.length, 0);
assert.notStrictEqual(createTestProof(run, { generatedAt: 1 }).hash.length, 0);
