import {
  compileTestManifest,
  createTestManifest,
  createTestProof,
  createTestRegistryGraph,
  decodeTestJunitXml,
  decodeTestTap,
  diffTestRuns,
  encodeTestJunitXml,
  encodeTestTap,
  planTestRun,
  queryTestManifest,
  recordEvidenceTestRun,
  recordTestGateExecution,
  recordTestRun,
  summarizeTestGateExecutions,
  summarizeTestCoverage,
  traceTestImpact,
  type FrontierTestEvidenceRecord,
  type FrontierTestEvidenceRunRecord,
  type FrontierTestGateExecutionRecord,
  type FrontierTestManifest,
  type FrontierTestRunRecord,
  type FrontierTestSpec
} from '../src/index.ts';
import {
  runTestGateCommand,
  runTestGateSuite,
  type FrontierTestNodeGateInput,
  type FrontierTestNodeGateResult,
  type FrontierTestNodeGateSuiteResult
} from '../src/node.ts';

const spec: FrontierTestSpec = {
  kind: 'frontier.test.spec',
  version: 1,
  id: 'spec.type',
  testKind: 'unit',
  title: 'Type Spec',
  given: { fixtures: [], capabilities: [], files: [] },
  when: {},
  expect: { patches: ['/x'], effects: [], routes: [], policies: [], traces: [], artifacts: [], assertions: [] },
  covers: ['action.type'],
  actions: ['action.type'],
  effects: [],
  routes: [],
  policies: [],
  views: [],
  workflows: [],
  migrations: [],
  statePaths: ['/x'],
  resources: [],
  fixtures: [],
  commands: [],
  gates: [],
  artifacts: [],
  owners: [],
  sourceFiles: [],
  tags: [],
  priority: 50,
  retries: 0
};

const manifest: FrontierTestManifest = createTestManifest({ id: 'types', specs: [spec] });
const compiled = compileTestManifest(manifest);
const query = queryTestManifest(compiled, { actions: ['action.type'] });
const impact = traceTestImpact(compiled, { changedActions: ['action.type'] });
const plan = planTestRun(compiled, { changedActions: ['action.type'], now: 1 });
const run: FrontierTestRunRecord = recordTestRun(compiled, {
  id: 'run:type',
  startedAt: 1,
  finishedAt: 2,
  results: [{ specId: 'spec.type', status: 'passed', patches: ['/x'] }]
});
const evidenceRun: FrontierTestEvidenceRunRecord = recordEvidenceTestRun(compiled, {
  specIds: ['spec.type'],
  evidence: [{ target: 'action.type', status: 'passed', source: 'type-test' }]
});
const evidence: FrontierTestEvidenceRecord = evidenceRun.evidence;
const gateExecution: FrontierTestGateExecutionRecord = recordTestGateExecution({
  id: 'gate.type',
  kind: 'test',
  status: 'passed',
  command: 'npm',
  args: ['test'],
  replay: { sourceRefs: ['test/types.ts'] },
  oracle: { id: 'oracle.type', matches: true }
});
const gateExecutionSummary = summarizeTestGateExecutions({ executions: [gateExecution] });
const nodeGateInput: FrontierTestNodeGateInput = {
  id: 'gate.node.type',
  command: 'node',
  args: ['--version'],
  kind: 'smoke',
  artifacts: ['reports/node-version.txt'],
  timeoutMs: 1000
};
const nodeGatePromise: Promise<FrontierTestNodeGateResult> = runTestGateCommand(nodeGateInput);
const nodeGateSuitePromise: Promise<FrontierTestNodeGateSuiteResult> = runTestGateSuite({ gates: [nodeGateInput] });
const tap = encodeTestTap(run);
const junit = encodeTestJunitXml(run);

createTestRegistryGraph(manifest);
summarizeTestCoverage(compiled);
diffTestRuns(run, decodeTestTap(tap));
diffTestRuns(run, decodeTestJunitXml(junit));
createTestProof(manifest);
createTestProof(run);

query.ids satisfies string[];
impact.specIds satisfies string[];
plan.commandIds satisfies string[];
evidence.observations satisfies readonly unknown[];
gateExecution.artifactPaths satisfies string[];
gateExecutionSummary.gates satisfies readonly unknown[];
void nodeGatePromise;
void nodeGateSuitePromise;
