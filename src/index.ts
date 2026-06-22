import type { JsonObject, JsonValue } from '@shapeshift-labs/frontier';
import { cloneJson } from '@shapeshift-labs/frontier/clone';
import {
  createFrontierRegistryGraph,
  type FrontierRegistryEdge,
  type FrontierRegistryEntry,
  type FrontierRegistryGraph,
  type FrontierRegistryImpact,
  type FrontierRegistrySource
} from '@shapeshift-labs/frontier/registry';

export const FRONTIER_TEST_MANIFEST_KIND = 'frontier.test.manifest';
export const FRONTIER_TEST_MANIFEST_VERSION = 1;
export const FRONTIER_TEST_SPEC_KIND = 'frontier.test.spec';
export const FRONTIER_TEST_SPEC_VERSION = 1;
export const FRONTIER_TEST_RUN_PLAN_KIND = 'frontier.test.run-plan';
export const FRONTIER_TEST_RUN_PLAN_VERSION = 1;
export const FRONTIER_TEST_RUN_KIND = 'frontier.test.run';
export const FRONTIER_TEST_RUN_VERSION = 1;
export const FRONTIER_TEST_IMPACT_KIND = 'frontier.test.impact';
export const FRONTIER_TEST_IMPACT_VERSION = 1;
export const FRONTIER_TEST_PROOF_KIND = 'frontier.test.proof';
export const FRONTIER_TEST_PROOF_VERSION = 1;
export const FRONTIER_TEST_EVIDENCE_KIND = 'frontier.test.evidence';
export const FRONTIER_TEST_EVIDENCE_VERSION = 1;
export const FRONTIER_TEST_GATE_EVIDENCE_KIND = 'frontier.test.gate-evidence';
export const FRONTIER_TEST_GATE_EVIDENCE_VERSION = 1;
export const FRONTIER_TEST_GATE_EXECUTION_KIND = 'frontier.test.gate-execution';
export const FRONTIER_TEST_GATE_EXECUTION_VERSION = 1;
export const FRONTIER_TEST_PACKAGE_GATE_MATRIX_KIND = 'frontier.test.package-gate-matrix';
export const FRONTIER_TEST_PACKAGE_GATE_MATRIX_VERSION = 1;
export const FRONTIER_TEST_MODEL_ROUTING_ORACLE_KIND = 'frontier.test.model-routing-oracle';
export const FRONTIER_TEST_MODEL_ROUTING_ORACLE_VERSION = 1;

export type FrontierTestKind =
  | 'unit'
  | 'integration'
  | 'e2e'
  | 'playwright'
  | 'smoke'
  | 'fuzz'
  | 'benchmark'
  | 'typecheck'
  | 'boundary'
  | 'release'
  | 'migration'
  | 'policy'
  | 'workflow'
  | 'replay'
  | string;

export type FrontierTestStatus = 'passed' | 'failed' | 'skipped' | 'todo' | 'flaky' | 'blocked' | 'unknown';

export interface FrontierTestFixtureInput {
  id: string;
  kind?: string;
  source?: string | FrontierRegistrySource;
  stateFixture?: string;
  files?: readonly string[];
  data?: unknown;
  owners?: readonly string[];
  tags?: readonly string[];
  metadata?: unknown;
}

export interface FrontierTestFixture {
  id: string;
  kind: string;
  sourceFiles: string[];
  stateFixture?: string;
  data?: JsonObject;
  owners: string[];
  tags: string[];
  source?: FrontierRegistrySource;
  metadata?: JsonObject;
}

export interface FrontierTestCommandInput {
  id: string;
  command: string;
  args?: readonly string[];
  cwd?: string;
  env?: Record<string, string | number | boolean | undefined>;
  kind?: string;
  package?: string;
  source?: string | FrontierRegistrySource;
  timeoutMs?: number;
  artifacts?: readonly string[];
  tags?: readonly string[];
  metadata?: unknown;
}

export interface FrontierTestCommand {
  id: string;
  command: string;
  args: string[];
  cwd?: string;
  env?: JsonObject;
  kind: string;
  package?: string;
  sourceFiles: string[];
  timeoutMs?: number;
  artifacts: string[];
  tags: string[];
  source?: FrontierRegistrySource;
  metadata?: JsonObject;
}

export interface FrontierTestExpectationInput {
  patches?: readonly (string | { path?: string; op?: string })[];
  effects?: readonly string[];
  routes?: readonly string[];
  route?: string;
  policies?: readonly string[];
  policy?: readonly string[];
  traces?: readonly string[];
  artifacts?: readonly string[];
  assertions?: readonly string[];
  metadata?: unknown;
}

export interface FrontierTestExpectation {
  patches: string[];
  effects: string[];
  routes: string[];
  policies: string[];
  traces: string[];
  artifacts: string[];
  assertions: string[];
  metadata?: JsonObject;
}

export interface FrontierTestWhenInput {
  action?: string;
  tool?: string;
  workflow?: string;
  migration?: string;
  effect?: string;
  route?: string;
  input?: unknown;
  metadata?: unknown;
}

export interface FrontierTestWhen {
  action?: string;
  tool?: string;
  workflow?: string;
  migration?: string;
  effect?: string;
  route?: string;
  input?: JsonObject;
  metadata?: JsonObject;
}

export interface FrontierTestGivenInput {
  stateFixture?: string;
  fixtures?: readonly string[];
  route?: string;
  actor?: string;
  capabilities?: readonly string[];
  files?: readonly string[];
  metadata?: unknown;
}

export interface FrontierTestGiven {
  stateFixture?: string;
  fixtures: string[];
  route?: string;
  actor?: string;
  capabilities: string[];
  files: string[];
  metadata?: JsonObject;
}

export interface FrontierTestSpecInput {
  id: string;
  title?: string;
  description?: string;
  kind?: FrontierTestKind;
  feature?: string;
  given?: FrontierTestGivenInput;
  when?: FrontierTestWhenInput;
  expect?: FrontierTestExpectationInput;
  covers?: readonly string[];
  actions?: readonly string[];
  effects?: readonly string[];
  routes?: readonly string[];
  policies?: readonly string[];
  views?: readonly string[];
  workflows?: readonly string[];
  migrations?: readonly string[];
  statePaths?: readonly string[];
  resources?: readonly string[];
  fixtures?: readonly string[];
  commands?: readonly string[];
  gates?: readonly string[];
  artifacts?: readonly string[];
  replayOf?: string;
  fuzzer?: string;
  benchmark?: string;
  owners?: readonly string[];
  package?: string;
  source?: string | FrontierRegistrySource;
  sourceFiles?: readonly string[];
  tags?: readonly string[];
  priority?: number;
  timeoutMs?: number;
  retries?: number;
  metadata?: unknown;
}

export interface FrontierTestSpec {
  kind: typeof FRONTIER_TEST_SPEC_KIND;
  version: typeof FRONTIER_TEST_SPEC_VERSION;
  id: string;
  testKind: FrontierTestKind;
  title: string;
  description?: string;
  feature?: string;
  given: FrontierTestGiven;
  when: FrontierTestWhen;
  expect: FrontierTestExpectation;
  covers: string[];
  actions: string[];
  effects: string[];
  routes: string[];
  policies: string[];
  views: string[];
  workflows: string[];
  migrations: string[];
  statePaths: string[];
  resources: string[];
  fixtures: string[];
  commands: string[];
  gates: string[];
  artifacts: string[];
  replayOf?: string;
  fuzzer?: string;
  benchmark?: string;
  owners: string[];
  package?: string;
  sourceFiles: string[];
  tags: string[];
  priority: number;
  timeoutMs?: number;
  retries: number;
  source?: FrontierRegistrySource;
  metadata?: JsonObject;
}

export interface FrontierTestManifestInput {
  id?: string;
  title?: string;
  description?: string;
  package?: string;
  feature?: string;
  owner?: string;
  specs?: readonly FrontierTestSpecInput[];
  fixtures?: readonly FrontierTestFixtureInput[];
  commands?: readonly FrontierTestCommandInput[];
  coverageTargets?: readonly string[];
  artifacts?: readonly string[];
  tags?: readonly string[];
  source?: FrontierRegistrySource;
  generatedAt?: number;
  metadata?: unknown;
}

export interface FrontierTestSummary {
  specCount: number;
  fixtureCount: number;
  commandCount: number;
  featureCount: number;
  coverCount: number;
  actionCount: number;
  effectCount: number;
  routeCount: number;
  policyCount: number;
  workflowCount: number;
  migrationCount: number;
  statePathCount: number;
  artifactCount: number;
  fuzzSpecCount: number;
  benchmarkSpecCount: number;
  replaySpecCount: number;
}

export interface FrontierTestManifest {
  kind: typeof FRONTIER_TEST_MANIFEST_KIND;
  version: typeof FRONTIER_TEST_MANIFEST_VERSION;
  id: string;
  title?: string;
  description?: string;
  package?: string;
  feature?: string;
  owner?: string;
  specs: FrontierTestSpec[];
  fixtures: FrontierTestFixture[];
  commands: FrontierTestCommand[];
  coverageTargets: string[];
  artifacts: string[];
  tags: string[];
  source?: FrontierRegistrySource;
  generatedAt?: number;
  metadata?: JsonObject;
  summary: FrontierTestSummary;
}

export interface FrontierTestValidationIssue {
  code: string;
  message: string;
  specId?: string;
  targetId?: string;
  severity: 'error' | 'warning';
}

export interface FrontierTestValidation {
  valid: boolean;
  issues: FrontierTestValidationIssue[];
}

export interface FrontierCompiledTestManifest {
  kind: 'frontier.test.compiled';
  version: 1;
  manifest: FrontierTestManifest;
  specsById: ReadonlyMap<string, FrontierTestSpec>;
  fixturesById: ReadonlyMap<string, FrontierTestFixture>;
  commandsById: ReadonlyMap<string, FrontierTestCommand>;
  specsByCover: ReadonlyMap<string, readonly string[]>;
  specsByFeature: ReadonlyMap<string, readonly string[]>;
  specsByKind: ReadonlyMap<string, readonly string[]>;
  specsByCommand: ReadonlyMap<string, readonly string[]>;
  specsByFixture: ReadonlyMap<string, readonly string[]>;
  specsByFile: ReadonlyMap<string, readonly string[]>;
  specsByTag: ReadonlyMap<string, readonly string[]>;
  specsByOwner: ReadonlyMap<string, readonly string[]>;
  specsByPackage: ReadonlyMap<string, readonly string[]>;
  specsByAction: ReadonlyMap<string, readonly string[]>;
  specsByEffect: ReadonlyMap<string, readonly string[]>;
  specsByRoute: ReadonlyMap<string, readonly string[]>;
  specsByPolicy: ReadonlyMap<string, readonly string[]>;
  specsByWorkflow: ReadonlyMap<string, readonly string[]>;
  specsByMigration: ReadonlyMap<string, readonly string[]>;
  specsByStatePath: ReadonlyMap<string, readonly string[]>;
  specsByResource: ReadonlyMap<string, readonly string[]>;
  specsByArtifact: ReadonlyMap<string, readonly string[]>;
  validation: FrontierTestValidation;
  get(specId: string): FrontierTestSpec;
}

export interface FrontierTestQueryInput {
  ids?: readonly string[];
  kinds?: readonly string[];
  features?: readonly string[];
  covers?: readonly string[];
  actions?: readonly string[];
  effects?: readonly string[];
  routes?: readonly string[];
  policies?: readonly string[];
  views?: readonly string[];
  workflows?: readonly string[];
  migrations?: readonly string[];
  statePaths?: readonly string[];
  resources?: readonly string[];
  fixtures?: readonly string[];
  commands?: readonly string[];
  packages?: readonly string[];
  owners?: readonly string[];
  tags?: readonly string[];
  artifacts?: readonly string[];
  fuzzers?: readonly string[];
  benchmarks?: readonly string[];
  limit?: number;
}

export interface FrontierTestQueryResult {
  kind: 'frontier.test.query';
  version: 1;
  ids: string[];
  specs: FrontierTestSpec[];
}

export interface FrontierTestImpactInput extends FrontierTestQueryInput {
  changedFeatures?: readonly string[];
  changedCovers?: readonly string[];
  changedActions?: readonly string[];
  changedEffects?: readonly string[];
  changedRoutes?: readonly string[];
  changedPolicies?: readonly string[];
  changedViews?: readonly string[];
  changedWorkflows?: readonly string[];
  changedMigrations?: readonly string[];
  changedStatePaths?: readonly string[];
  changedResources?: readonly string[];
  changedFixtures?: readonly string[];
  changedCommands?: readonly string[];
  changedFiles?: readonly string[];
  changedArtifacts?: readonly string[];
  expectedCoverage?: readonly string[];
}

export interface FrontierTestImpactReason {
  specId: string;
  targetId?: string;
  reason: string;
}

export interface FrontierTestImpact extends Omit<FrontierRegistryImpact, 'kind' | 'version'> {
  kind: typeof FRONTIER_TEST_IMPACT_KIND;
  version: typeof FRONTIER_TEST_IMPACT_VERSION;
  manifestId: string;
  specIds: string[];
  features: string[];
  covers: string[];
  commands: string[];
  fixtures: string[];
  expectedPatches: string[];
  effects: string[];
  routes: string[];
  policies: string[];
  artifacts: string[];
  uncovered: string[];
  reasons: FrontierTestImpactReason[];
}

export interface FrontierTestRunPlanItem {
  specId: string;
  reason: string;
  commandIds: string[];
  fixtureIds: string[];
  artifacts: string[];
}

export interface FrontierTestRunPlan {
  kind: typeof FRONTIER_TEST_RUN_PLAN_KIND;
  version: typeof FRONTIER_TEST_RUN_PLAN_VERSION;
  id: string;
  manifestId: string;
  mode: string;
  createdAt: number;
  specIds: string[];
  commandIds: string[];
  fixtureIds: string[];
  artifacts: string[];
  items: FrontierTestRunPlanItem[];
  impact: FrontierTestImpact;
  summary: FrontierTestSummary;
  shard?: { index: number; count: number };
  metadata?: JsonObject;
}

export interface FrontierTestResultInput {
  specId: string;
  status: FrontierTestStatus;
  durationMs?: number;
  attempts?: number;
  patches?: readonly string[];
  effects?: readonly string[];
  route?: string;
  routes?: readonly string[];
  policies?: readonly string[];
  artifacts?: readonly string[];
  traceIds?: readonly string[];
  error?: string;
  metadata?: unknown;
}

export interface FrontierTestResult {
  specId: string;
  status: FrontierTestStatus;
  durationMs: number;
  attempts: number;
  patches: string[];
  effects: string[];
  routes: string[];
  policies: string[];
  artifacts: string[];
  traceIds: string[];
  error?: string;
  metadata?: JsonObject;
}

export interface FrontierTestRunInput {
  id?: string;
  planId?: string;
  mode?: string;
  status?: FrontierTestStatus;
  startedAt?: number;
  finishedAt?: number;
  commandIds?: readonly string[];
  results?: readonly FrontierTestResultInput[];
  artifacts?: readonly string[];
  traceIds?: readonly string[];
  metadata?: unknown;
}

export interface FrontierTestRunSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  todo: number;
  flaky: number;
  blocked: number;
  unknown: number;
  durationMs: number;
}

export interface FrontierTestCoverageSummary {
  kind: 'frontier.test.coverage';
  version: 1;
  manifestId: string;
  covered: string[];
  uncovered: string[];
  byKind: Record<string, string[]>;
  specIds: string[];
  coverageRatio: number;
}

export interface FrontierTestRunRecord {
  kind: typeof FRONTIER_TEST_RUN_KIND;
  version: typeof FRONTIER_TEST_RUN_VERSION;
  id: string;
  manifestId: string;
  planId?: string;
  mode: string;
  status: FrontierTestStatus;
  startedAt: number;
  finishedAt: number;
  durationMs: number;
  commandIds: string[];
  results: FrontierTestResult[];
  artifacts: string[];
  traceIds: string[];
  summary: FrontierTestRunSummary;
  coverage: FrontierTestCoverageSummary;
  metadata?: JsonObject;
}

export interface FrontierTestRunDiff {
  kind: 'frontier.test.run-diff';
  version: 1;
  leftRunId: string;
  rightRunId: string;
  added: string[];
  removed: string[];
  statusChanged: Array<{ specId: string; from: FrontierTestStatus; to: FrontierTestStatus }>;
  durationChanged: Array<{ specId: string; fromMs: number; toMs: number; deltaMs: number }>;
  artifactChanged: string[];
  summary: { changed: number; added: number; removed: number };
}

export interface FrontierTestProof {
  kind: typeof FRONTIER_TEST_PROOF_KIND;
  version: typeof FRONTIER_TEST_PROOF_VERSION;
  manifestId: string;
  generatedAt: number;
  hash: string;
  summary: FrontierTestSummary | FrontierTestRunSummary | FrontierTestCoverageSummary;
  validation?: FrontierTestValidation;
  metadata?: JsonObject;
}

export type FrontierTestEvidenceStatus = 'passed' | 'failed' | 'blocked' | 'unknown';

export interface FrontierTestEvidenceObservationInput {
  id?: string;
  kind?: string;
  source?: string;
  status?: string | boolean;
  target?: string;
  targets?: readonly string[];
  specId?: string;
  feature?: string;
  route?: string;
  routes?: readonly string[];
  action?: string;
  actions?: readonly string[];
  effect?: string;
  effects?: readonly string[];
  policy?: string;
  policies?: readonly string[];
  statePath?: string;
  statePaths?: readonly string[];
  artifact?: string;
  artifacts?: readonly string[];
  traceId?: string;
  traceIds?: readonly string[];
  required?: boolean;
  message?: string;
  tags?: readonly string[];
  metadata?: unknown;
}

export interface FrontierTestEvidenceObservation {
  id: string;
  kind: string;
  source: string;
  status: FrontierTestEvidenceStatus;
  rawStatus?: string;
  targets: string[];
  specId?: string;
  feature?: string;
  routes: string[];
  actions: string[];
  effects: string[];
  policies: string[];
  statePaths: string[];
  artifacts: string[];
  traceIds: string[];
  required: boolean;
  message?: string;
  tags: string[];
  metadata?: JsonObject;
}

export interface FrontierTestEvidenceSummary {
  total: number;
  passed: number;
  failed: number;
  blocked: number;
  unknown: number;
  required: number;
  sourceCount: number;
  artifactCount: number;
  targetCount: number;
}

export interface FrontierTestEvidenceRecord {
  kind: typeof FRONTIER_TEST_EVIDENCE_KIND;
  version: typeof FRONTIER_TEST_EVIDENCE_VERSION;
  generatedAt: number;
  runId?: string;
  observations: FrontierTestEvidenceObservation[];
  summary: FrontierTestEvidenceSummary;
}

export interface FrontierTestEvidenceRunInput extends Omit<FrontierTestRunInput, 'results'> {
  plan?: FrontierTestRunPlan;
  specIds?: readonly string[];
  results?: readonly FrontierTestResultInput[];
  evidence?: readonly FrontierTestEvidenceObservationInput[];
  playwrightReports?: readonly unknown[];
  inspectBundles?: readonly unknown[];
  surfaceCoverage?: unknown;
  traceRecords?: readonly unknown[];
  logRecords?: readonly unknown[];
  failOnMissing?: boolean;
  proofGeneratedAt?: number;
  proofMetadata?: unknown;
}

export interface FrontierTestEvidenceRunRecord {
  run: FrontierTestRunRecord;
  proof: FrontierTestProof;
  evidence: FrontierTestEvidenceRecord;
}

export type FrontierTestGateKind = 'test' | 'unit' | 'build' | 'fuzz' | 'smoke' | 'browser' | 'oracle' | string;

export type FrontierTestGateExecutionKind = 'test' | 'build' | 'fuzz' | 'browser' | 'oracle' | FrontierTestGateKind;

export type FrontierTestGateEvidenceStatus = 'passed' | 'failed' | 'skipped' | 'blocked' | 'unknown';

export interface FrontierTestGateEvidenceInput {
  id: string;
  kind: FrontierTestGateKind;
  status: FrontierTestGateEvidenceStatus | FrontierTestStatus | string | boolean;
  required?: boolean;
  durationMs?: number;
  failureTail?: string | readonly string[];
  artifacts?: readonly string[];
  package?: string;
  packageScope?: readonly string[];
  message?: string;
}

export interface FrontierTestGateEvidenceRecord {
  id: string;
  kind: FrontierTestGateKind;
  required: boolean;
  status: FrontierTestGateEvidenceStatus;
  durationMs: number;
  failureTail: string[];
  artifacts: string[];
  packageScope: string[];
  message?: string;
}

export interface FrontierTestGateEvidenceKindSummary {
  total: number;
  required: number;
  optional: number;
  passed: number;
  failed: number;
  skipped: number;
  blocked: number;
  unknown: number;
  durationMs: number;
  artifactCount: number;
  packageScope: string[];
}

export interface FrontierTestGateEvidenceSummaryInput {
  gates: readonly FrontierTestGateEvidenceInput[];
  packageScope?: readonly string[];
  artifacts?: readonly string[];
}

export interface FrontierTestGateEvidenceSummary {
  kind: typeof FRONTIER_TEST_GATE_EVIDENCE_KIND;
  version: typeof FRONTIER_TEST_GATE_EVIDENCE_VERSION;
  total: number;
  required: number;
  optional: number;
  passed: number;
  failed: number;
  skipped: number;
  blocked: number;
  unknown: number;
  durationMs: number;
  artifactCount: number;
  packageScope: string[];
  gates: FrontierTestGateEvidenceRecord[];
  byKind: Record<string, FrontierTestGateEvidenceKindSummary>;
}

export interface FrontierTestGateArtifactInput {
  path: string;
  kind?: string;
  role?: string;
  bytes?: number;
  sha256?: string;
  mimeType?: string;
  metadata?: unknown;
}

export interface FrontierTestGateArtifactRecord {
  path: string;
  kind?: string;
  role?: string;
  bytes?: number;
  sha256?: string;
  mimeType?: string;
  metadata?: JsonObject;
}

export interface FrontierTestGateReplayEvidenceInput {
  command?: string | readonly string[];
  args?: readonly string[];
  cwd?: string;
  envKeys?: readonly string[];
  seed?: string | number;
  sourceRefs?: readonly string[];
  jsonlPath?: string;
  proofPath?: string;
  tracePath?: string;
  metadata?: unknown;
}

export interface FrontierTestGateReplayEvidenceRecord {
  command: string[];
  cwd?: string;
  envKeys: string[];
  seed?: string | number;
  sourceRefs: string[];
  jsonlPath?: string;
  proofPath?: string;
  tracePath?: string;
  metadata?: JsonObject;
}

export interface FrontierTestGateOracleEvidenceInput {
  id: string;
  scenario?: string;
  expected?: unknown;
  actual?: unknown;
  matches?: boolean;
  mismatches?: readonly string[];
  comparisonArtifact?: string;
  metadata?: unknown;
}

export interface FrontierTestGateOracleEvidenceRecord {
  id: string;
  scenario?: string;
  expected?: JsonValue;
  actual?: JsonValue;
  matches: boolean;
  mismatches: string[];
  comparisonArtifact?: string;
  metadata?: JsonObject;
}

export interface FrontierTestGateExecutionInput {
  id: string;
  kind: FrontierTestGateExecutionKind;
  status: FrontierTestGateEvidenceStatus | FrontierTestStatus | string | boolean;
  rawStatus?: string;
  required?: boolean;
  startedAt?: number;
  finishedAt?: number;
  durationMs?: number;
  attempt?: number;
  maxAttempts?: number;
  command?: string | readonly string[];
  args?: readonly string[];
  cwd?: string;
  envKeys?: readonly string[];
  exitCode?: number;
  signal?: string;
  stdoutTail?: string | readonly string[];
  stderrTail?: string | readonly string[];
  failureTail?: string | readonly string[];
  artifacts?: readonly (string | FrontierTestGateArtifactInput)[];
  package?: string;
  packageScope?: readonly string[];
  message?: string;
  replay?: FrontierTestGateReplayEvidenceInput;
  oracle?: FrontierTestGateOracleEvidenceInput;
  metadata?: unknown;
}

export interface FrontierTestGateExecutionRecord {
  kind: typeof FRONTIER_TEST_GATE_EXECUTION_KIND;
  version: typeof FRONTIER_TEST_GATE_EXECUTION_VERSION;
  id: string;
  gateKind: FrontierTestGateExecutionKind;
  required: boolean;
  status: FrontierTestGateEvidenceStatus;
  rawStatus?: string;
  startedAt: number;
  finishedAt: number;
  durationMs: number;
  attempt: number;
  maxAttempts: number;
  command: string[];
  cwd?: string;
  envKeys: string[];
  exitCode?: number;
  signal?: string;
  stdoutTail: string[];
  stderrTail: string[];
  failureTail: string[];
  artifacts: FrontierTestGateArtifactRecord[];
  artifactPaths: string[];
  packageScope: string[];
  message?: string;
  replay?: FrontierTestGateReplayEvidenceRecord;
  oracle?: FrontierTestGateOracleEvidenceRecord;
  metadata?: JsonObject;
}

export interface FrontierTestGateExecutionSummaryInput {
  executions: readonly (FrontierTestGateExecutionInput | FrontierTestGateExecutionRecord)[];
  packageScope?: readonly string[];
  artifacts?: readonly string[];
}

export type FrontierTestPackageGateMatrixSelection = 'selected' | 'dependency-selected' | 'skipped';

export interface FrontierTestPackageGateMatrixInput {
  id: string;
  packageId: string;
  packagePath: string;
  packageName: string;
  selection: FrontierTestPackageGateMatrixSelection | boolean;
  dependencyOrder?: number;
  required?: boolean;
  durationMs?: number;
  failureTail?: string | readonly string[];
  artifacts?: readonly string[];
  packageScope?: readonly string[];
  status?: FrontierTestGateEvidenceStatus | FrontierTestStatus | string | boolean;
  message?: string;
}

export interface FrontierTestPackageGateMatrixRecord {
  id: string;
  packageId: string;
  packagePath: string;
  packageName: string;
  selection: FrontierTestPackageGateMatrixSelection;
  dependencyOrder?: number;
  required: boolean;
  status: FrontierTestGateEvidenceStatus;
  durationMs: number;
  failureTail: string[];
  artifacts: string[];
  packageScope: string[];
  message?: string;
}

export interface FrontierTestPackageGateMatrixSummaryInput {
  gates: readonly FrontierTestPackageGateMatrixInput[];
  packageScope?: readonly string[];
  artifacts?: readonly string[];
}

export interface FrontierTestPackageGateMatrixSummary {
  kind: typeof FRONTIER_TEST_PACKAGE_GATE_MATRIX_KIND;
  version: typeof FRONTIER_TEST_PACKAGE_GATE_MATRIX_VERSION;
  total: number;
  selected: number;
  dependencySelected: number;
  skipped: number;
  required: number;
  optional: number;
  passed: number;
  failed: number;
  blocked: number;
  unknown: number;
  durationMs: number;
  artifactCount: number;
  packageScope: string[];
  gates: FrontierTestPackageGateMatrixRecord[];
}

export type FrontierTestModelRoutingOracleDisposition = 'route' | 'downgrade' | 'escalate';

export type FrontierTestModelRoutingOracleScenario =
  | 'simple-docs'
  | 'isolated-package-code'
  | 'broad-semantic-merge'
  | 'repeated-failure'
  | 'human-ambiguity'
  | 'tournament-backed-downgrade'
  | string;

export interface FrontierTestModelRoutingOracleFixtureInput {
  id: string;
  label: string;
  description: string;
  scenario: FrontierTestModelRoutingOracleScenario;
  expectedRoute: string;
  expectedDisposition: FrontierTestModelRoutingOracleDisposition;
  signals?: unknown;
  tags?: readonly string[];
  metadata?: unknown;
}

export interface FrontierTestModelRoutingOracleFixture {
  id: string;
  label: string;
  description: string;
  scenario: FrontierTestModelRoutingOracleScenario;
  expectedRoute: string;
  expectedDisposition: FrontierTestModelRoutingOracleDisposition;
  signals?: JsonObject;
  tags: string[];
  metadata?: JsonObject;
}

export interface FrontierTestModelRoutingOracleCorpusInput {
  id?: string;
  title?: string;
  generatedAt?: number;
  fixtures?: readonly FrontierTestModelRoutingOracleFixtureInput[];
  metadata?: unknown;
}

export interface FrontierTestModelRoutingOracleCorpus {
  kind: typeof FRONTIER_TEST_MODEL_ROUTING_ORACLE_KIND;
  version: typeof FRONTIER_TEST_MODEL_ROUTING_ORACLE_VERSION;
  id: string;
  title: string;
  generatedAt: number;
  fixtures: FrontierTestModelRoutingOracleFixture[];
  byScenario: Record<string, string[]>;
  byExpectedRoute: Record<string, string[]>;
  byDisposition: Record<string, string[]>;
  summary: {
    fixtureCount: number;
    routeCount: number;
    dispositionCount: number;
    escalateCount: number;
    downgradeCount: number;
    humanCount: number;
  };
  metadata?: JsonObject;
}

export interface FrontierTestModelRoutingDecisionInput {
  id?: string;
  scenario?: string;
  label?: string;
  route?: string;
  model?: string;
  modelId?: string;
  selectedModel?: string;
  targetModel?: string;
  winnerModel?: string;
  fallbackModel?: string;
  destination?: string;
  nextModel?: string;
  decision?: string;
  outcome?: string;
  status?: string;
  action?: string;
  humanQuestion?: unknown;
  question?: unknown;
  needsHuman?: boolean;
  downgraded?: boolean;
  escalated?: boolean;
  tournament?: boolean;
  reason?: string;
  metadata?: unknown;
}

export type FrontierTestModelRoutingDecisionDisposition = FrontierTestModelRoutingOracleDisposition | 'unknown';

export interface FrontierTestModelRoutingOracleComparison {
  kind: 'frontier.test.model-routing-oracle-comparison';
  version: 1;
  oracleId: string;
  actualId?: string;
  scenario: string;
  label: string;
  expectedRoute: string;
  expectedDisposition: FrontierTestModelRoutingOracleDisposition;
  actualRoute: string;
  actualDisposition: FrontierTestModelRoutingDecisionDisposition;
  routeMatches: boolean;
  dispositionMatches: boolean;
  matches: boolean;
  mismatches: string[];
}

export function defineTestSpec(input: FrontierTestSpecInput): FrontierTestSpec {
  return normalizeSpec(input);
}

export function defineSpec(input: FrontierTestSpecInput): FrontierTestSpec {
  return defineTestSpec(input);
}

export function createTestManifest(input: FrontierTestManifestInput = {}): FrontierTestManifest {
  const specs = (input.specs ?? []).map(normalizeSpec);
  const fixtures = (input.fixtures ?? []).map(normalizeFixture);
  const commands = (input.commands ?? []).map(normalizeCommand);
  const coverageTargets = uniqueStrings((input.coverageTargets ?? []).concat(specs.flatMap(coverIdsOf)));
  const artifacts = uniqueStrings((input.artifacts ?? []).concat(specs.flatMap((spec) => spec.artifacts), commands.flatMap((command) => command.artifacts)));
  return {
    kind: FRONTIER_TEST_MANIFEST_KIND,
    version: FRONTIER_TEST_MANIFEST_VERSION,
    id: normalizeId(input.id ?? 'tests', 'test manifest id'),
    ...(input.title ? { title: input.title } : {}),
    ...(input.description ? { description: input.description } : {}),
    ...(input.package ? { package: input.package } : {}),
    ...(input.feature ? { feature: input.feature } : {}),
    ...(input.owner ? { owner: input.owner } : {}),
    specs,
    fixtures,
    commands,
    coverageTargets,
    artifacts,
    tags: uniqueStrings(input.tags),
    ...(input.source ? { source: input.source } : {}),
    ...(input.generatedAt !== undefined ? { generatedAt: input.generatedAt } : {}),
    ...optionalObject('metadata', input.metadata),
    summary: summarizeManifest(specs, fixtures, commands, coverageTargets, artifacts)
  };
}

export const createSpecManifest = createTestManifest;

export function compileTestManifest(manifestOrInput: FrontierTestManifest | FrontierTestManifestInput): FrontierCompiledTestManifest {
  const manifest = isTestManifest(manifestOrInput) ? cloneTestManifest(manifestOrInput) : createTestManifest(manifestOrInput);
  const specsById = new Map<string, FrontierTestSpec>();
  const fixturesById = new Map<string, FrontierTestFixture>();
  const commandsById = new Map<string, FrontierTestCommand>();
  const specsByCover = new Map<string, string[]>();
  const specsByFeature = new Map<string, string[]>();
  const specsByKind = new Map<string, string[]>();
  const specsByCommand = new Map<string, string[]>();
  const specsByFixture = new Map<string, string[]>();
  const specsByFile = new Map<string, string[]>();
  const specsByTag = new Map<string, string[]>();
  const specsByOwner = new Map<string, string[]>();
  const specsByPackage = new Map<string, string[]>();
  const specsByAction = new Map<string, string[]>();
  const specsByEffect = new Map<string, string[]>();
  const specsByRoute = new Map<string, string[]>();
  const specsByPolicy = new Map<string, string[]>();
  const specsByWorkflow = new Map<string, string[]>();
  const specsByMigration = new Map<string, string[]>();
  const specsByStatePath = new Map<string, string[]>();
  const specsByResource = new Map<string, string[]>();
  const specsByArtifact = new Map<string, string[]>();

  for (const fixture of manifest.fixtures) fixturesById.set(fixture.id, fixture);
  for (const command of manifest.commands) commandsById.set(command.id, command);
  for (const spec of manifest.specs) {
    specsById.set(spec.id, spec);
    pushMap(specsByKind, spec.testKind, spec.id);
    if (spec.feature) pushMap(specsByFeature, spec.feature, spec.id);
    if (spec.package) pushMap(specsByPackage, spec.package, spec.id);
    for (const cover of coverIdsOf(spec)) pushMap(specsByCover, cover, spec.id);
    for (const command of spec.commands) pushMap(specsByCommand, command, spec.id);
    for (const fixture of spec.fixtures.concat(spec.given.fixtures, spec.given.stateFixture ? [spec.given.stateFixture] : [])) pushMap(specsByFixture, fixture, spec.id);
    for (const file of spec.sourceFiles.concat(spec.given.files)) pushMap(specsByFile, file, spec.id);
    for (const tag of spec.tags) pushMap(specsByTag, tag, spec.id);
    for (const owner of spec.owners) pushMap(specsByOwner, owner, spec.id);
    for (const action of spec.actions) pushMap(specsByAction, action, spec.id);
    for (const effect of spec.effects.concat(spec.expect.effects)) pushMap(specsByEffect, effect, spec.id);
    for (const route of spec.routes.concat(spec.expect.routes)) pushMap(specsByRoute, route, spec.id);
    for (const policy of spec.policies.concat(spec.expect.policies)) pushMap(specsByPolicy, policy, spec.id);
    for (const workflow of spec.workflows) pushMap(specsByWorkflow, workflow, spec.id);
    for (const migration of spec.migrations) pushMap(specsByMigration, migration, spec.id);
    for (const statePath of spec.statePaths.concat(spec.expect.patches)) pushMap(specsByStatePath, statePath, spec.id);
    for (const resource of spec.resources) pushMap(specsByResource, resource, spec.id);
    for (const artifact of spec.artifacts.concat(spec.expect.artifacts)) pushMap(specsByArtifact, artifact, spec.id);
  }

  const validation = validateTestManifest(manifest);
  return {
    kind: 'frontier.test.compiled',
    version: 1,
    manifest,
    specsById,
    fixturesById,
    commandsById,
    specsByCover: freezeMapLists(specsByCover),
    specsByFeature: freezeMapLists(specsByFeature),
    specsByKind: freezeMapLists(specsByKind),
    specsByCommand: freezeMapLists(specsByCommand),
    specsByFixture: freezeMapLists(specsByFixture),
    specsByFile: freezeMapLists(specsByFile),
    specsByTag: freezeMapLists(specsByTag),
    specsByOwner: freezeMapLists(specsByOwner),
    specsByPackage: freezeMapLists(specsByPackage),
    specsByAction: freezeMapLists(specsByAction),
    specsByEffect: freezeMapLists(specsByEffect),
    specsByRoute: freezeMapLists(specsByRoute),
    specsByPolicy: freezeMapLists(specsByPolicy),
    specsByWorkflow: freezeMapLists(specsByWorkflow),
    specsByMigration: freezeMapLists(specsByMigration),
    specsByStatePath: freezeMapLists(specsByStatePath),
    specsByResource: freezeMapLists(specsByResource),
    specsByArtifact: freezeMapLists(specsByArtifact),
    validation,
    get(specId) {
      const id = normalizeId(specId, 'test spec id');
      const spec = specsById.get(id);
      if (!spec) throw new TypeError('unknown test spec: ' + specId);
      return spec;
    }
  };
}

export const compileTests = compileTestManifest;

export function validateTestManifest(manifestOrInput: FrontierTestManifest | FrontierTestManifestInput): FrontierTestValidation {
  const manifest = isTestManifest(manifestOrInput) ? manifestOrInput : createTestManifest(manifestOrInput);
  const issues: FrontierTestValidationIssue[] = [];
  const specIds = new Set<string>();
  const fixtureIds = new Set(manifest.fixtures.map((fixture) => fixture.id));
  const commandIds = new Set(manifest.commands.map((command) => command.id));
  const seenFixtures = new Set<string>();
  const seenCommands = new Set<string>();
  for (const fixture of manifest.fixtures) {
    if (seenFixtures.has(fixture.id)) issues.push({ code: 'duplicate-fixture', message: 'duplicate fixture id: ' + fixture.id, targetId: fixture.id, severity: 'error' });
    seenFixtures.add(fixture.id);
  }
  for (const command of manifest.commands) {
    if (seenCommands.has(command.id)) issues.push({ code: 'duplicate-command', message: 'duplicate command id: ' + command.id, targetId: command.id, severity: 'error' });
    seenCommands.add(command.id);
  }
  for (const spec of manifest.specs) {
    if (specIds.has(spec.id)) issues.push({ code: 'duplicate-spec', message: 'duplicate spec id: ' + spec.id, specId: spec.id, severity: 'error' });
    specIds.add(spec.id);
    if (coverIdsOf(spec).length === 0) issues.push({ code: 'missing-coverage', message: 'spec has no coverage declaration: ' + spec.id, specId: spec.id, severity: 'warning' });
    if (spec.expect.patches.length === 0 && spec.expect.effects.length === 0 && spec.expect.routes.length === 0 && spec.expect.policies.length === 0 && spec.expect.assertions.length === 0) {
      issues.push({ code: 'missing-expectation', message: 'spec has no observable expectation: ' + spec.id, specId: spec.id, severity: 'warning' });
    }
    for (const fixture of spec.fixtures.concat(spec.given.fixtures)) {
      if (!fixtureIds.has(fixture)) issues.push({ code: 'unknown-fixture', message: 'spec references unknown fixture: ' + fixture, specId: spec.id, targetId: fixture, severity: 'warning' });
    }
    if (spec.given.stateFixture && !fixtureIds.has(spec.given.stateFixture)) {
      issues.push({ code: 'unknown-state-fixture', message: 'spec references unknown state fixture: ' + spec.given.stateFixture, specId: spec.id, targetId: spec.given.stateFixture, severity: 'warning' });
    }
    for (const command of spec.commands) {
      if (!commandIds.has(command)) issues.push({ code: 'unknown-command', message: 'spec references unknown command: ' + command, specId: spec.id, targetId: command, severity: 'warning' });
    }
    for (const patch of spec.expect.patches) {
      if (!patch.startsWith('/')) issues.push({ code: 'non-pointer-patch', message: 'expected patch path should be a JSON Pointer: ' + patch, specId: spec.id, targetId: patch, severity: 'warning' });
    }
  }
  return { valid: !issues.some((issue) => issue.severity === 'error'), issues };
}

export function queryTestManifest(
  manifestOrCompiled: FrontierTestManifest | FrontierCompiledTestManifest,
  input: FrontierTestQueryInput = {}
): FrontierTestQueryResult {
  const compiled = isCompiledTestManifest(manifestOrCompiled) ? manifestOrCompiled : compileTestManifest(manifestOrCompiled);
  const ids = new Set<string>();
  const indexed = hasValues(input.ids) || hasValues(input.kinds) || hasValues(input.features) || hasValues(input.covers) || hasValues(input.actions) || hasValues(input.effects) || hasValues(input.routes) || hasValues(input.policies) || hasValues(input.workflows) || hasValues(input.migrations) || hasValues(input.statePaths) || hasValues(input.resources) || hasValues(input.fixtures) || hasValues(input.commands) || hasValues(input.packages) || hasValues(input.owners) || hasValues(input.tags) || hasValues(input.artifacts);
  for (const id of input.ids ?? []) if (compiled.specsById.has(id)) ids.add(id);
  for (const kind of input.kinds ?? []) pushSet(ids, compiled.specsByKind.get(kind) ?? []);
  for (const feature of input.features ?? []) pushSet(ids, compiled.specsByFeature.get(feature) ?? []);
  for (const cover of input.covers ?? []) pushSet(ids, compiled.specsByCover.get(cover) ?? []);
  for (const action of input.actions ?? []) pushSet(ids, compiled.specsByAction.get(action) ?? []);
  for (const effect of input.effects ?? []) pushSet(ids, compiled.specsByEffect.get(effect) ?? []);
  for (const route of input.routes ?? []) pushSet(ids, compiled.specsByRoute.get(route) ?? []);
  for (const policy of input.policies ?? []) pushSet(ids, compiled.specsByPolicy.get(policy) ?? []);
  for (const workflow of input.workflows ?? []) pushSet(ids, compiled.specsByWorkflow.get(workflow) ?? []);
  for (const migration of input.migrations ?? []) pushSet(ids, compiled.specsByMigration.get(migration) ?? []);
  for (const statePath of input.statePaths ?? []) pushSet(ids, compiled.specsByStatePath.get(statePath) ?? []);
  for (const resource of input.resources ?? []) pushSet(ids, compiled.specsByResource.get(resource) ?? []);
  for (const fixture of input.fixtures ?? []) pushSet(ids, compiled.specsByFixture.get(fixture) ?? []);
  for (const command of input.commands ?? []) pushSet(ids, compiled.specsByCommand.get(command) ?? []);
  for (const packageName of input.packages ?? []) pushSet(ids, compiled.specsByPackage.get(packageName) ?? []);
  for (const owner of input.owners ?? []) pushSet(ids, compiled.specsByOwner.get(owner) ?? []);
  for (const tag of input.tags ?? []) pushSet(ids, compiled.specsByTag.get(tag) ?? []);
  for (const artifact of input.artifacts ?? []) pushSet(ids, compiled.specsByArtifact.get(artifact) ?? []);
  let specs = indexed ? specsForIds(compiled.specsById, Array.from(ids)) : compiled.manifest.specs.slice();
  specs = specs.filter((spec) => matchesQuery(spec, input));
  specs.sort(compareSpecPriority);
  if (input.limit !== undefined) specs = specs.slice(0, Math.max(0, input.limit));
  return { kind: 'frontier.test.query', version: 1, ids: specs.map((spec) => spec.id), specs };
}

export function traceTestImpact(
  manifestOrCompiled: FrontierTestManifest | FrontierCompiledTestManifest,
  input: FrontierTestImpactInput = {}
): FrontierTestImpact {
  const compiled = isCompiledTestManifest(manifestOrCompiled) ? manifestOrCompiled : compileTestManifest(manifestOrCompiled);
  const touched = new Set<string>();
  const seeds = new Set<string>();
  const reasons: FrontierTestImpactReason[] = [];
  seedIndexed(compiled.specsById, input.ids, seeds, touched, reasons, 'spec');
  seedIndex(compiled.specsByKind, input.kinds, seeds, touched, reasons, 'kind');
  seedIndex(compiled.specsByFeature, input.features ?? input.changedFeatures, seeds, touched, reasons, 'feature');
  seedIndex(compiled.specsByCover, input.covers ?? input.changedCovers, seeds, touched, reasons, 'cover');
  seedIndex(compiled.specsByAction, input.actions ?? input.changedActions, seeds, touched, reasons, 'action');
  seedIndex(compiled.specsByEffect, input.effects ?? input.changedEffects, seeds, touched, reasons, 'effect');
  seedIndex(compiled.specsByRoute, input.routes ?? input.changedRoutes, seeds, touched, reasons, 'route');
  seedIndex(compiled.specsByPolicy, input.policies ?? input.changedPolicies, seeds, touched, reasons, 'policy');
  seedIndex(compiled.specsByWorkflow, input.workflows ?? input.changedWorkflows, seeds, touched, reasons, 'workflow');
  seedIndex(compiled.specsByMigration, input.migrations ?? input.changedMigrations, seeds, touched, reasons, 'migration');
  seedIndex(compiled.specsByStatePath, input.statePaths ?? input.changedStatePaths, seeds, touched, reasons, 'state-path');
  seedIndex(compiled.specsByResource, input.resources ?? input.changedResources, seeds, touched, reasons, 'resource');
  seedIndex(compiled.specsByFixture, input.fixtures ?? input.changedFixtures, seeds, touched, reasons, 'fixture');
  seedIndex(compiled.specsByCommand, input.commands ?? input.changedCommands, seeds, touched, reasons, 'command');
  seedIndex(compiled.specsByArtifact, input.artifacts ?? input.changedArtifacts, seeds, touched, reasons, 'artifact');
  for (const file of input.changedFiles ?? []) seedIndex(compiled.specsByFile, [normalizeFilePath(file)], seeds, touched, reasons, 'source-file');
  if (input.tags) seedIndex(compiled.specsByTag, input.tags, seeds, touched, reasons, 'tag');
  if (input.owners) seedIndex(compiled.specsByOwner, input.owners, seeds, touched, reasons, 'owner');
  if (input.packages) seedIndex(compiled.specsByPackage, input.packages, seeds, touched, reasons, 'package');
  if (input.fuzzers || input.benchmarks || input.views) {
    for (const spec of compiled.manifest.specs) {
      if (input.fuzzers?.includes(spec.fuzzer ?? '')) markTouched(touched, reasons, spec.id, spec.fuzzer, 'fuzzer');
      if (input.benchmarks?.includes(spec.benchmark ?? '')) markTouched(touched, reasons, spec.id, spec.benchmark, 'benchmark');
      if (input.views && overlaps(input.views, spec.views)) markTouched(touched, reasons, spec.id, input.views.join(','), 'view');
    }
  }
  if (touched.size === 0 && !hasImpactSelector(input)) {
    for (const spec of compiled.manifest.specs) markTouched(touched, reasons, spec.id, undefined, 'all');
  }

  const specs = specsForIds(compiled.specsById, Array.from(touched)).filter((spec) => matchesQuery(spec, input)).sort(compareSpecPriority);
  const specIds = specs.map((spec) => spec.id);
  const coverIds = uniqueStrings(specs.flatMap(coverIdsOf));
  const expectedCoverage = uniqueStrings(input.expectedCoverage ?? compiled.manifest.coverageTargets);
  const uncovered = expectedCoverage.filter((target) => !coverIds.includes(target));
  const entries = impactEntries(compiled.manifest, specs);
  const edges = impactEdges(specs);
  const nodes = new Set<string>(Array.from(seeds));
  for (const entry of entries) nodes.add(entry.id);
  for (const edge of edges) {
    nodes.add(edge.from);
    nodes.add(edge.to);
  }
  return {
    kind: FRONTIER_TEST_IMPACT_KIND,
    version: FRONTIER_TEST_IMPACT_VERSION,
    seeds: Array.from(seeds),
    nodes: Array.from(nodes),
    entries,
    records: [],
    edges,
    manifestId: compiled.manifest.id,
    specIds,
    features: uniqueStrings(specs.map((spec) => spec.feature)),
    covers: coverIds,
    commands: uniqueStrings(specs.flatMap((spec) => spec.commands)),
    fixtures: uniqueStrings(specs.flatMap((spec) => spec.fixtures.concat(spec.given.fixtures, spec.given.stateFixture ? [spec.given.stateFixture] : []))),
    expectedPatches: uniqueStrings(specs.flatMap((spec) => spec.expect.patches)),
    effects: uniqueStrings(specs.flatMap((spec) => spec.effects.concat(spec.expect.effects))),
    routes: uniqueStrings(specs.flatMap((spec) => spec.routes.concat(spec.expect.routes))),
    policies: uniqueStrings(specs.flatMap((spec) => spec.policies.concat(spec.expect.policies))),
    artifacts: uniqueStrings(specs.flatMap((spec) => spec.artifacts.concat(spec.expect.artifacts))),
    uncovered,
    reasons: uniqueReasons(reasons)
  };
}

export function planTestRun(
  manifestOrCompiled: FrontierTestManifest | FrontierCompiledTestManifest,
  input: FrontierTestImpactInput & { mode?: string; now?: number | (() => number); shard?: { index: number; count: number }; metadata?: unknown } = {}
): FrontierTestRunPlan {
  const compiled = isCompiledTestManifest(manifestOrCompiled) ? manifestOrCompiled : compileTestManifest(manifestOrCompiled);
  const impact = traceTestImpact(compiled, input);
  let specs = specsForIds(compiled.specsById, impact.specIds);
  if (input.shard) {
    const count = Math.max(1, Math.floor(input.shard.count));
    const index = Math.max(0, Math.min(count - 1, Math.floor(input.shard.index)));
    specs = specs.filter((_, specIndex) => specIndex % count === index);
  }
  const items = specs.map((spec): FrontierTestRunPlanItem => ({
    specId: spec.id,
    reason: reasonFor(impact.reasons, spec.id) ?? 'selected',
    commandIds: spec.commands,
    fixtureIds: uniqueStrings(spec.fixtures.concat(spec.given.fixtures, spec.given.stateFixture ? [spec.given.stateFixture] : [])),
    artifacts: uniqueStrings(spec.artifacts.concat(spec.expect.artifacts))
  }));
  const now = readNow(input.now);
  return {
    kind: FRONTIER_TEST_RUN_PLAN_KIND,
    version: FRONTIER_TEST_RUN_PLAN_VERSION,
    id: 'test-plan:' + stableHash([compiled.manifest.id, input.mode ?? 'selected', items.map((item) => item.specId), now]),
    manifestId: compiled.manifest.id,
    mode: input.mode ?? 'selected',
    createdAt: now,
    specIds: items.map((item) => item.specId),
    commandIds: uniqueStrings(items.flatMap((item) => item.commandIds)),
    fixtureIds: uniqueStrings(items.flatMap((item) => item.fixtureIds)),
    artifacts: uniqueStrings(items.flatMap((item) => item.artifacts)),
    items,
    impact,
    summary: summarizeManifest(specs, compiled.manifest.fixtures, compiled.manifest.commands, impact.covers, impact.artifacts),
    ...(input.shard ? { shard: { index: Math.max(0, Math.floor(input.shard.index)), count: Math.max(1, Math.floor(input.shard.count)) } } : {}),
    ...optionalObject('metadata', input.metadata)
  };
}

export function recordTestRun(
  manifestOrCompiled: FrontierTestManifest | FrontierCompiledTestManifest,
  input: FrontierTestRunInput = {}
): FrontierTestRunRecord {
  const compiled = isCompiledTestManifest(manifestOrCompiled) ? manifestOrCompiled : compileTestManifest(manifestOrCompiled);
  const results = (input.results ?? []).map(normalizeResult);
  const startedAt = input.startedAt ?? Date.now();
  const finishedAt = input.finishedAt ?? startedAt + results.reduce((sum, result) => sum + result.durationMs, 0);
  const summary = summarizeRun(results);
  const status = input.status ?? statusFromSummary(summary);
  const artifacts = uniqueStrings((input.artifacts ?? []).concat(results.flatMap((result) => result.artifacts)));
  const traceIds = uniqueStrings((input.traceIds ?? []).concat(results.flatMap((result) => result.traceIds)));
  return {
    kind: FRONTIER_TEST_RUN_KIND,
    version: FRONTIER_TEST_RUN_VERSION,
    id: input.id ?? 'test-run:' + stableHash([compiled.manifest.id, input.planId ?? '', startedAt, results.map((result) => [result.specId, result.status])]),
    manifestId: compiled.manifest.id,
    ...(input.planId ? { planId: input.planId } : {}),
    mode: input.mode ?? 'record',
    status,
    startedAt,
    finishedAt,
    durationMs: Math.max(0, finishedAt - startedAt),
    commandIds: uniqueStrings(input.commandIds),
    results,
    artifacts,
    traceIds,
    summary,
    coverage: summarizeTestCoverage(compiled, { specIds: results.map((result) => result.specId) }),
    ...optionalObject('metadata', input.metadata)
  };
}

export function collectTestEvidence(input: FrontierTestEvidenceRunInput = {}): FrontierTestEvidenceRecord {
  const generatedAt = input.startedAt ?? Date.now();
  const observations = normalizeEvidenceObservations(input);
  return {
    kind: FRONTIER_TEST_EVIDENCE_KIND,
    version: FRONTIER_TEST_EVIDENCE_VERSION,
    generatedAt,
    observations,
    summary: summarizeTestEvidence(observations)
  };
}

export function summarizeTestGateEvidence(input: FrontierTestGateEvidenceSummaryInput): FrontierTestGateEvidenceSummary {
  const gates = input.gates.map(normalizeGateEvidence).sort(compareGateEvidenceRecords);
  const packageScope = uniqueStrings((input.packageScope ?? []).concat(gates.flatMap((gate) => gate.packageScope)));
  const artifacts = uniqueStrings((input.artifacts ?? []).concat(gates.flatMap((gate) => gate.artifacts)));
  const kindArtifacts = new Map<string, Set<string>>();
  const summary: FrontierTestGateEvidenceSummary = {
    kind: FRONTIER_TEST_GATE_EVIDENCE_KIND,
    version: FRONTIER_TEST_GATE_EVIDENCE_VERSION,
    total: gates.length,
    required: 0,
    optional: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    blocked: 0,
    unknown: 0,
    durationMs: 0,
    artifactCount: artifacts.length,
    packageScope,
    gates,
    byKind: {}
  };

  for (const gate of gates) {
    summary.durationMs += gate.durationMs;
    summary[gate.status] += 1;
    if (gate.required) summary.required += 1;
    else summary.optional += 1;
    const artifactSet = kindArtifacts.get(gate.kind) ?? new Set<string>();
    for (const artifact of gate.artifacts) artifactSet.add(artifact);
    kindArtifacts.set(gate.kind, artifactSet);

    const bucket = summary.byKind[gate.kind] ?? {
      total: 0,
      required: 0,
      optional: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      blocked: 0,
      unknown: 0,
      durationMs: 0,
      artifactCount: 0,
      packageScope: []
    };
    bucket.total += 1;
    bucket.durationMs += gate.durationMs;
    bucket[gate.status] += 1;
    if (gate.required) bucket.required += 1;
    else bucket.optional += 1;
    bucket.packageScope = uniqueStrings(bucket.packageScope.concat(gate.packageScope));
    bucket.artifactCount = kindArtifacts.get(gate.kind)?.size ?? 0;
    summary.byKind[gate.kind] = bucket;
  }

  for (const bucket of Object.values(summary.byKind)) {
    bucket.optional = bucket.total - bucket.required;
  }

  return summary;
}

export function recordTestGateExecution(input: FrontierTestGateExecutionInput | FrontierTestGateExecutionRecord): FrontierTestGateExecutionRecord {
  if (isGateExecutionRecord(input)) return cloneJson(input as unknown as JsonValue) as unknown as FrontierTestGateExecutionRecord;
  const status = normalizeGateEvidenceStatus(input.status);
  const durationMs = Math.max(0, Math.floor(input.durationMs ?? ((input.finishedAt ?? input.startedAt ?? 0) - (input.startedAt ?? input.finishedAt ?? 0))));
  const startedAt = Math.max(0, Math.floor(input.startedAt ?? (input.finishedAt !== undefined ? input.finishedAt - durationMs : Date.now())));
  const finishedAt = Math.max(startedAt, Math.floor(input.finishedAt ?? (startedAt + durationMs)));
  const artifacts = normalizeGateArtifacts(input.artifacts);
  const command = normalizeGateCommand(input.command, input.args);
  const replay = normalizeGateReplayEvidence(input.replay ?? (command.length || input.cwd || input.envKeys?.length ? {
    command,
    cwd: input.cwd,
    envKeys: input.envKeys
  } : undefined));
  const oracle = input.oracle ? normalizeGateOracleEvidence(input.oracle) : undefined;
  return {
    kind: FRONTIER_TEST_GATE_EXECUTION_KIND,
    version: FRONTIER_TEST_GATE_EXECUTION_VERSION,
    id: normalizeId(input.id, 'test gate execution id'),
    gateKind: input.kind,
    required: input.required !== false,
    status,
    ...(input.rawStatus ? { rawStatus: String(input.rawStatus) } : {}),
    startedAt,
    finishedAt,
    durationMs: Math.max(0, finishedAt - startedAt, durationMs),
    attempt: Math.max(1, Math.floor(input.attempt ?? 1)),
    maxAttempts: Math.max(1, Math.floor(input.maxAttempts ?? input.attempt ?? 1)),
    command,
    ...(input.cwd ? { cwd: input.cwd } : {}),
    envKeys: uniqueStrings(input.envKeys),
    ...(input.exitCode !== undefined && Number.isFinite(input.exitCode) ? { exitCode: Math.floor(input.exitCode) } : {}),
    ...(input.signal ? { signal: String(input.signal) } : {}),
    stdoutTail: normalizeFailureTail(input.stdoutTail),
    stderrTail: normalizeFailureTail(input.stderrTail),
    failureTail: normalizeFailureTail(input.failureTail ?? (status === 'failed' || status === 'blocked' ? input.message : undefined)),
    artifacts,
    artifactPaths: artifacts.map((artifact) => artifact.path),
    packageScope: uniqueStrings((input.packageScope ?? []).concat(input.package ? [input.package] : [])),
    ...(input.message ? { message: input.message } : {}),
    ...(replay ? { replay } : {}),
    ...(oracle ? { oracle } : {}),
    ...optionalObject('metadata', input.metadata)
  };
}

export function summarizeTestGateExecutions(input: FrontierTestGateExecutionSummaryInput): FrontierTestGateEvidenceSummary {
  const executions = input.executions.map(recordTestGateExecution);
  return summarizeTestGateEvidence({
    packageScope: input.packageScope,
    artifacts: uniqueStrings((input.artifacts ?? []).concat(executions.flatMap((execution) => execution.artifactPaths))),
    gates: executions.map((execution) => ({
      id: execution.id,
      kind: execution.gateKind,
      required: execution.required,
      status: execution.status,
      durationMs: execution.durationMs,
      failureTail: execution.failureTail.length ? execution.failureTail : execution.stderrTail,
      artifacts: execution.artifactPaths,
      packageScope: execution.packageScope,
      message: execution.message
    }))
  });
}

export function summarizeTestPackageGateMatrix(input: FrontierTestPackageGateMatrixSummaryInput): FrontierTestPackageGateMatrixSummary {
  const gates = input.gates.map(normalizePackageGateMatrix).sort(comparePackageGateMatrixRecords);
  const packageScope = uniqueStrings((input.packageScope ?? []).concat(gates.flatMap((gate) => gate.packageScope), gates.map((gate) => gate.packagePath)));
  const artifacts = uniqueStrings((input.artifacts ?? []).concat(gates.flatMap((gate) => gate.artifacts)));
  const summary: FrontierTestPackageGateMatrixSummary = {
    kind: FRONTIER_TEST_PACKAGE_GATE_MATRIX_KIND,
    version: FRONTIER_TEST_PACKAGE_GATE_MATRIX_VERSION,
    total: gates.length,
    selected: 0,
    dependencySelected: 0,
    skipped: 0,
    required: 0,
    optional: 0,
    passed: 0,
    failed: 0,
    blocked: 0,
    unknown: 0,
    durationMs: 0,
    artifactCount: artifacts.length,
    packageScope,
    gates
  };

  for (const gate of gates) {
    summary.durationMs += gate.durationMs;
    if (gate.status !== 'skipped') summary[gate.status] += 1;
    if (gate.required) summary.required += 1;
    else summary.optional += 1;
    if (gate.selection === 'selected') summary.selected += 1;
    else if (gate.selection === 'dependency-selected') summary.dependencySelected += 1;
    else summary.skipped += 1;
  }

  return summary;
}

export function createTestModelRoutingOracleFixtures(input: FrontierTestModelRoutingOracleCorpusInput = {}): FrontierTestModelRoutingOracleFixture[] {
  const fixtures = defaultModelRoutingOracleFixtures().concat(input.fixtures ?? []);
  const normalized = fixtures.map(normalizeModelRoutingOracleFixture);
  const deduped = new Map<string, FrontierTestModelRoutingOracleFixture>();
  for (const fixture of normalized) deduped.set(fixture.id, fixture);
  return Array.from(deduped.values());
}

export function createTestModelRoutingOracleCorpus(input: FrontierTestModelRoutingOracleCorpusInput = {}): FrontierTestModelRoutingOracleCorpus {
  const generatedAt = input.generatedAt ?? Date.now();
  const fixtures = createTestModelRoutingOracleFixtures(input);
  const byScenario = new Map<string, string[]>();
  const byExpectedRoute = new Map<string, string[]>();
  const byDisposition = new Map<string, string[]>();
  for (const fixture of fixtures) {
    pushMap(byScenario, fixture.scenario, fixture.id);
    pushMap(byExpectedRoute, fixture.expectedRoute, fixture.id);
    pushMap(byDisposition, fixture.expectedDisposition, fixture.id);
  }
  const summary = {
    fixtureCount: fixtures.length,
    routeCount: byExpectedRoute.size,
    dispositionCount: byDisposition.size,
    escalateCount: byDisposition.get('escalate')?.length ?? 0,
    downgradeCount: byDisposition.get('downgrade')?.length ?? 0,
    humanCount: byExpectedRoute.get('human')?.length ?? 0
  };
  return {
    kind: FRONTIER_TEST_MODEL_ROUTING_ORACLE_KIND,
    version: FRONTIER_TEST_MODEL_ROUTING_ORACLE_VERSION,
    id: normalizeId(input.id ?? 'model-routing-oracles', 'test model routing oracle corpus id'),
    title: input.title ?? 'Model Routing Oracle Fixtures',
    generatedAt,
    fixtures,
    byScenario: Object.fromEntries(Array.from(byScenario, ([key, value]) => [key, uniqueStrings(value)])),
    byExpectedRoute: Object.fromEntries(Array.from(byExpectedRoute, ([key, value]) => [key, uniqueStrings(value)])),
    byDisposition: Object.fromEntries(Array.from(byDisposition, ([key, value]) => [key, uniqueStrings(value)])),
    summary,
    ...optionalObject('metadata', input.metadata)
  };
}

export function compareTestModelRoutingDecision(
  actual: FrontierTestModelRoutingDecisionInput | unknown,
  oracleInput: FrontierTestModelRoutingOracleFixture | FrontierTestModelRoutingOracleFixtureInput
): FrontierTestModelRoutingOracleComparison {
  const oracle = normalizeModelRoutingOracleFixture(oracleInput);
  const decision = normalizeModelRoutingDecision(actual);
  const routeMatches = decision.route === oracle.expectedRoute;
  const dispositionMatches = decision.disposition === oracle.expectedDisposition;
  const mismatches: string[] = [];
  if (!routeMatches) mismatches.push(`expected route ${oracle.expectedRoute}, received ${decision.route || 'unknown'}`);
  if (!dispositionMatches) mismatches.push(`expected disposition ${oracle.expectedDisposition}, received ${decision.disposition}`);
  if (decision.label && decision.label !== oracle.label) mismatches.push(`label mismatch: ${decision.label}`);
  if (decision.scenario && decision.scenario !== oracle.scenario) mismatches.push(`scenario mismatch: ${decision.scenario}`);
  return {
    kind: 'frontier.test.model-routing-oracle-comparison',
    version: 1,
    oracleId: oracle.id,
    ...(decision.id ? { actualId: decision.id } : {}),
    scenario: oracle.scenario,
    label: oracle.label,
    expectedRoute: oracle.expectedRoute,
    expectedDisposition: oracle.expectedDisposition,
    actualRoute: decision.route,
    actualDisposition: decision.disposition,
    routeMatches,
    dispositionMatches,
    matches: routeMatches && dispositionMatches && (decision.label ? decision.label === oracle.label : true) && (decision.scenario ? decision.scenario === oracle.scenario : true),
    mismatches
  };
}

export function recordEvidenceTestRun(
  manifestOrCompiled: FrontierTestManifest | FrontierCompiledTestManifest,
  input: FrontierTestEvidenceRunInput = {}
): FrontierTestEvidenceRunRecord {
  const compiled = isCompiledTestManifest(manifestOrCompiled) ? manifestOrCompiled : compileTestManifest(manifestOrCompiled);
  const collected = collectTestEvidence(input);
  const specs = selectEvidenceSpecs(compiled, input, collected.observations);
  const runObservations = collected.observations.filter((observation) => specs.some((spec) => evidenceMatchesSpec(observation, spec)));
  const explicitResults = new Map((input.results ?? []).map((result) => [normalizeId(result.specId, 'test result spec id'), result]));
  const generatedResults = specs.map((spec) => evidenceResultForSpec(spec, runObservations, input, explicitResults.get(spec.id)));
  const startedAt = input.startedAt ?? collected.generatedAt;
  const finishedAt = input.finishedAt ?? startedAt + generatedResults.reduce((sum, result) => sum + (result.durationMs ?? 0), 0);
  const evidenceSummary = summarizeTestEvidence(runObservations);
  const evidenceMetadata = {
    ...metadataObject(input.metadata),
    evidenceSummary
  };
  const run = recordTestRun(compiled, {
    ...input,
    startedAt,
    finishedAt,
    commandIds: uniqueStrings((input.commandIds ?? []).concat(input.plan?.commandIds ?? [])),
    results: generatedResults,
    artifacts: uniqueStrings((input.artifacts ?? []).concat(runObservations.flatMap((observation) => observation.artifacts))),
    traceIds: uniqueStrings((input.traceIds ?? []).concat(runObservations.flatMap((observation) => observation.traceIds))),
    metadata: evidenceMetadata
  });
  const evidence = {
    ...collected,
    runId: run.id,
    observations: runObservations,
    summary: evidenceSummary
  };
  const proof = createTestProof(run, {
    generatedAt: input.proofGeneratedAt ?? finishedAt,
    metadata: {
      evidenceSummary: evidence.summary,
      ...metadataObject(input.proofMetadata)
    }
  });
  return { run, proof, evidence };
}

export function summarizeTestCoverage(
  manifestOrCompiled: FrontierTestManifest | FrontierCompiledTestManifest,
  input: { specIds?: readonly string[]; targets?: readonly string[] } = {}
): FrontierTestCoverageSummary {
  const compiled = isCompiledTestManifest(manifestOrCompiled) ? manifestOrCompiled : compileTestManifest(manifestOrCompiled);
  const specs = input.specIds ? specsForIds(compiled.specsById, input.specIds) : compiled.manifest.specs;
  const covered = uniqueStrings(specs.flatMap(coverIdsOf));
  const targets = uniqueStrings(input.targets ?? compiled.manifest.coverageTargets);
  const uncovered = targets.filter((target) => !covered.includes(target));
  const byKind: Record<string, string[]> = {};
  for (const id of covered) {
    const kind = kindFromId(id);
    (byKind[kind] ??= []).push(id);
  }
  for (const key of Object.keys(byKind)) byKind[key] = uniqueStrings(byKind[key]).sort();
  return {
    kind: 'frontier.test.coverage',
    version: 1,
    manifestId: compiled.manifest.id,
    covered,
    uncovered,
    byKind,
    specIds: specs.map((spec) => spec.id),
    coverageRatio: targets.length === 0 ? 1 : (targets.length - uncovered.length) / targets.length
  };
}

export function diffTestRuns(left: FrontierTestRunRecord, right: FrontierTestRunRecord): FrontierTestRunDiff {
  const leftById = new Map(left.results.map((result) => [result.specId, result]));
  const rightById = new Map(right.results.map((result) => [result.specId, result]));
  const added: string[] = [];
  const removed: string[] = [];
  const statusChanged: Array<{ specId: string; from: FrontierTestStatus; to: FrontierTestStatus }> = [];
  const durationChanged: Array<{ specId: string; fromMs: number; toMs: number; deltaMs: number }> = [];
  const artifactChanged: string[] = [];
  for (const [id, result] of rightById) {
    const previous = leftById.get(id);
    if (!previous) {
      added.push(id);
      continue;
    }
    if (previous.status !== result.status) statusChanged.push({ specId: id, from: previous.status, to: result.status });
    const deltaMs = result.durationMs - previous.durationMs;
    if (Math.abs(deltaMs) > Math.max(5, previous.durationMs * 0.2)) durationChanged.push({ specId: id, fromMs: previous.durationMs, toMs: result.durationMs, deltaMs });
    if (previous.artifacts.join('\0') !== result.artifacts.join('\0')) artifactChanged.push(id);
  }
  for (const id of leftById.keys()) if (!rightById.has(id)) removed.push(id);
  return {
    kind: 'frontier.test.run-diff',
    version: 1,
    leftRunId: left.id,
    rightRunId: right.id,
    added,
    removed,
    statusChanged,
    durationChanged,
    artifactChanged,
    summary: { changed: statusChanged.length + durationChanged.length + artifactChanged.length, added: added.length, removed: removed.length }
  };
}

export function createTestRegistryGraph(
  manifestOrCompiled: FrontierTestManifest | FrontierCompiledTestManifest,
  options: { generatedAt?: number; package?: string; metadata?: JsonObject } = {}
): FrontierRegistryGraph {
  const manifest = isCompiledTestManifest(manifestOrCompiled) ? manifestOrCompiled.manifest : manifestOrCompiled;
  const entries: FrontierRegistryEntry[] = [{
    id: 'test-manifest:' + manifest.id,
    kind: 'test-manifest',
    description: manifest.description ?? manifest.title,
    package: options.package ?? manifest.package,
    feature: manifest.feature,
    owner: manifest.owner,
    source: manifest.source,
    reads: manifest.specs.flatMap((spec) => spec.sourceFiles),
    writes: manifest.artifacts,
    calls: manifest.specs.map((spec) => 'test-spec:' + spec.id),
    tags: manifest.tags,
    metadata: { summary: toJsonObject(manifest.summary) }
  }];
  const edges: FrontierRegistryEdge[] = [];
  for (const fixture of manifest.fixtures) {
    entries.push({ id: 'test-fixture:' + fixture.id, kind: 'test-fixture', owner: fixture.owners[0], reads: fixture.sourceFiles, writes: [], tags: fixture.tags });
    edges.push({ from: 'test-manifest:' + manifest.id, to: 'test-fixture:' + fixture.id, kind: 'declares-fixture' });
  }
  for (const command of manifest.commands) {
    entries.push({ id: 'test-command:' + command.id, kind: 'test-command', package: command.package ?? manifest.package, reads: command.sourceFiles, writes: command.artifacts, tags: command.tags });
    edges.push({ from: 'test-manifest:' + manifest.id, to: 'test-command:' + command.id, kind: 'declares-command' });
  }
  for (const spec of manifest.specs) {
    entries.push(registryEntryForSpec(manifest, spec));
    edges.push({ from: 'test-manifest:' + manifest.id, to: 'test-spec:' + spec.id, kind: 'owns' });
    for (const cover of coverIdsOf(spec)) edges.push({ from: 'test-spec:' + spec.id, to: cover, kind: 'covers' });
    for (const fixture of spec.fixtures.concat(spec.given.fixtures, spec.given.stateFixture ? [spec.given.stateFixture] : [])) edges.push({ from: 'test-spec:' + spec.id, to: 'test-fixture:' + fixture, kind: 'uses-fixture' });
    for (const command of spec.commands) edges.push({ from: 'test-spec:' + spec.id, to: 'test-command:' + command, kind: 'runs-command' });
    for (const patch of spec.expect.patches) edges.push({ from: 'test-spec:' + spec.id, to: patch, kind: 'expects-patch' });
    for (const artifact of spec.artifacts.concat(spec.expect.artifacts)) edges.push({ from: 'test-spec:' + spec.id, to: artifact, kind: 'produces-artifact' });
  }
  return createFrontierRegistryGraph({ generatedAt: options.generatedAt, entries, edges, metadata: options.metadata });
}

export function encodeTestJsonl(values: readonly unknown[]): string {
  return values.map((value) => JSON.stringify(value)).join('\n') + (values.length ? '\n' : '');
}

export function decodeTestJsonl(text: string): JsonValue[] {
  return text.split(/\r?\n/).filter((line) => line.trim().length !== 0).map((line) => JSON.parse(line) as JsonValue);
}

export function encodeTestTap(run: FrontierTestRunRecord): string {
  const lines = ['TAP version 13', '1..' + run.results.length];
  run.results.forEach((result, index) => {
    const ok = result.status === 'passed' || result.status === 'skipped' || result.status === 'todo';
    const directive = result.status === 'skipped' ? ' # SKIP' : result.status === 'todo' ? ' # TODO' : '';
    lines.push((ok ? 'ok ' : 'not ok ') + (index + 1) + ' - ' + escapeTapName(result.specId) + directive);
    if (result.error) lines.push('  ---', '  message: ' + JSON.stringify(result.error), '  ...');
  });
  return lines.join('\n') + '\n';
}

export function decodeTestTap(text: string, options: { manifestId?: string; now?: number } = {}): FrontierTestRunRecord {
  const results: FrontierTestResultInput[] = [];
  for (const line of text.split(/\r?\n/)) {
    const match = /^(not ok|ok)\s+\d+\s+-\s+(.+?)(?:\s+#\s+(SKIP|TODO).*)?$/i.exec(line.trim());
    if (!match) continue;
    const name = match[2] ?? 'tap-test';
    const directive = (match[3] ?? '').toUpperCase();
    results.push({
      specId: name,
      status: directive === 'SKIP' ? 'skipped' : directive === 'TODO' ? 'todo' : match[1] === 'ok' ? 'passed' : 'failed'
    });
  }
  return recordTestRun(createTestManifest({ id: options.manifestId ?? 'tap', specs: results.map((result) => ({ id: result.specId, expect: { assertions: ['tap'] } })) }), {
    id: 'tap-run:' + stableHash(text),
    startedAt: options.now ?? 0,
    finishedAt: options.now ?? 0,
    results
  });
}

export function encodeTestJunitXml(run: FrontierTestRunRecord): string {
  const attrs = 'tests="' + run.summary.total + '" failures="' + run.summary.failed + '" skipped="' + (run.summary.skipped + run.summary.todo) + '" time="' + (run.summary.durationMs / 1000).toFixed(3) + '"';
  const cases = run.results.map((result) => {
    const body = result.status === 'failed'
      ? '<failure message="' + xmlEscape(result.error ?? 'failed') + '"></failure>'
      : result.status === 'skipped' || result.status === 'todo'
        ? '<skipped></skipped>'
        : '';
    return '<testcase name="' + xmlEscape(result.specId) + '" time="' + (result.durationMs / 1000).toFixed(3) + '">' + body + '</testcase>';
  }).join('');
  return '<?xml version="1.0" encoding="UTF-8"?><testsuite name="' + xmlEscape(run.manifestId) + '" ' + attrs + '>' + cases + '</testsuite>';
}

export function decodeTestJunitXml(xml: string, options: { manifestId?: string; now?: number } = {}): FrontierTestRunRecord {
  const results: FrontierTestResultInput[] = [];
  const re = /<testcase\b([^>]*)>([\s\S]*?)<\/testcase>|<testcase\b([^>]*)\/>/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(xml)) !== null) {
    const attrs = parseXmlAttrs(match[1] ?? match[3] ?? '');
    const body = match[2] ?? '';
    const name = attrs.name ?? 'junit-test-' + results.length;
    results.push({
      specId: name,
      status: body.includes('<failure') || body.includes('<error') ? 'failed' : body.includes('<skipped') ? 'skipped' : 'passed',
      durationMs: Math.round(Number(attrs.time ?? 0) * 1000)
    });
  }
  return recordTestRun(createTestManifest({ id: options.manifestId ?? 'junit', specs: results.map((result) => ({ id: result.specId, expect: { assertions: ['junit'] } })) }), {
    id: 'junit-run:' + stableHash(xml),
    startedAt: options.now ?? 0,
    finishedAt: options.now ?? 0,
    results
  });
}

export function redactTestValue<T extends JsonValue | FrontierTestManifest | FrontierTestRunRecord | FrontierTestRunPlan>(
  value: T,
  redactions: readonly string[] = ['token', 'secret', 'password', 'authorization', 'cookie', 'credential', 'apiKey']
): T {
  return redactValue(value, redactions) as T;
}

export function createTestProof(
  value: FrontierTestManifest | FrontierTestRunRecord | FrontierTestCoverageSummary | FrontierTestRunPlan,
  options: { generatedAt?: number; metadata?: unknown } = {}
): FrontierTestProof {
  const generatedAt = options.generatedAt ?? Date.now();
  const manifestId = isTestManifest(value) ? value.id : 'manifestId' in value ? value.manifestId : 'tests';
  const summary = isTestManifest(value) || isTestRunRecord(value) || isRunPlan(value) ? value.summary : value;
  return {
    kind: FRONTIER_TEST_PROOF_KIND,
    version: FRONTIER_TEST_PROOF_VERSION,
    manifestId,
    generatedAt,
    hash: stableHash(redactTestValue(value as JsonValue | FrontierTestManifest | FrontierTestRunRecord | FrontierTestRunPlan)),
    summary,
    ...(isTestManifest(value) ? { validation: validateTestManifest(value) } : {}),
    ...optionalObject('metadata', options.metadata)
  };
}

function normalizeEvidenceObservations(input: FrontierTestEvidenceRunInput): FrontierTestEvidenceObservation[] {
  const raw = [
    ...(input.evidence ?? []),
    ...surfaceCoverageEvidence(input.surfaceCoverage),
    ...playwrightReportEvidence(input.playwrightReports),
    ...inspectBundleEvidence(input.inspectBundles),
    ...traceRecordEvidence(input.traceRecords),
    ...logRecordEvidence(input.logRecords)
  ];
  return raw.map((observation, index) => normalizeEvidenceObservation(observation, index));
}

function normalizeEvidenceObservation(input: FrontierTestEvidenceObservationInput, index: number): FrontierTestEvidenceObservation {
  const status = normalizeEvidenceStatus(input.status);
  const routes = uniqueStrings((input.routes ?? []).concat(input.route ? [input.route] : []));
  const actions = uniqueStrings((input.actions ?? []).concat(input.action ? [input.action] : []));
  const effects = uniqueStrings((input.effects ?? []).concat(input.effect ? [input.effect] : []));
  const policies = uniqueStrings((input.policies ?? []).concat(input.policy ? [input.policy] : []));
  const statePaths = uniqueStrings((input.statePaths ?? []).concat(input.statePath ? [input.statePath] : []));
  const artifacts = uniqueStrings((input.artifacts ?? []).concat(input.artifact ? [input.artifact] : [])).map(normalizeFilePath);
  const traceIds = uniqueStrings((input.traceIds ?? []).concat(input.traceId ? [input.traceId] : []));
  const targets = uniqueStrings([
    input.target,
    ...(input.targets ?? []),
    input.specId ? 'spec:' + input.specId : undefined,
    input.feature ? 'feature:' + input.feature : undefined,
    ...routes.map(routeTarget),
    ...actions.map((action) => 'action:' + action),
    ...effects.map((effect) => 'effect:' + effect),
    ...policies.map((policy) => 'policy:' + policy),
    ...statePaths.map((path) => 'path:' + path),
    ...artifacts.map((artifact) => 'artifact:' + artifact),
    ...traceIds.map((traceId) => 'trace:' + traceId)
  ]);
  const rawStatus = typeof input.status === 'string' ? input.status : undefined;
  return {
    id: input.id ?? 'evidence:' + (index + 1),
    kind: input.kind ?? kindFromId(input.id ?? input.target ?? 'evidence'),
    source: input.source ?? 'evidence',
    status,
    ...(rawStatus && rawStatus !== status ? { rawStatus } : {}),
    targets,
    ...(input.specId ? { specId: input.specId } : {}),
    ...(input.feature ? { feature: input.feature } : {}),
    routes,
    actions,
    effects,
    policies,
    statePaths,
    artifacts,
    traceIds,
    required: input.required !== false,
    ...(input.message ? { message: input.message } : {}),
    tags: uniqueStrings(input.tags),
    ...optionalObject('metadata', input.metadata)
  };
}

function surfaceCoverageEvidence(value: unknown): FrontierTestEvidenceObservationInput[] {
  const report = unknownRecord(value);
  const records = arrayFromUnknown(report.records);
  if (records.length === 0 && Object.keys(report).length === 0) return [];
  const out: FrontierTestEvidenceObservationInput[] = [{
    id: stringFrom(report.appId, 'app') + ':surface-coverage',
    kind: 'surface-coverage',
    source: 'surface-coverage',
    status: report.ok === false ? 'failed' : 'passed',
    target: 'surfaces:coverage',
    artifact: stringFrom(report.reportFile),
    required: true,
    message: report.ok === false ? 'Surface coverage has missing required probes or contracts.' : 'Surface coverage reports ok.',
    metadata: {
      kind: stringFrom(report.kind),
      summary: report.summary ?? null
    }
  }];
  for (const item of records) {
    const record = unknownRecord(item);
    const surface = unknownRecord(record.surface);
    const surfaceId = stringFrom(surface.id);
    const surfaceKind = stringFrom(surface.kind);
    const route = stringFrom(surface.route);
    const feature = stringFrom(surface.feature);
    const surfaceTargets = uniqueStrings([
      surfaceId,
      surfaceId ? 'surface:' + surfaceId : undefined,
      surfaceKind && surfaceId ? surfaceKind + ':' + surfaceId : undefined,
      route ? routeTarget(route) : undefined,
      feature ? 'feature:' + feature : undefined
    ]);
    out.push({
      id: (surfaceId || 'surface') + ':coverage',
      kind: surfaceKind || 'surface',
      source: 'surface-coverage',
      status: record.ok === false ? 'failed' : 'passed',
      target: surfaceId,
      targets: surfaceTargets,
      feature,
      route,
      required: arrayFromUnknown(record.required).length > 0,
      message: record.ok === false ? 'Surface coverage is missing required evidence.' : 'Surface coverage is complete.',
      tags: ['surface-coverage', surfaceKind, stringFrom(surface.status)],
      metadata: {
        required: record.required ?? [],
        covered: record.covered ?? [],
        missing: record.missing ?? []
      }
    });
    for (const probe of arrayFromUnknown(record.probes)) {
      const probeRecord = unknownRecord(probe);
      const probeKind = stringFrom(probeRecord.kind, 'probe');
      out.push({
        id: stringFrom(probeRecord.id, (surfaceId || 'surface') + ':' + probeKind + ':probe'),
        kind: probeKind,
        source: 'surface-coverage.probe',
        status: probeRecord.status === 'covered' ? 'passed' : probeRecord.status === 'planned' ? 'blocked' : stringFrom(probeRecord.status, 'unknown'),
        target: surfaceId,
        targets: surfaceTargets.concat(probeKind ? ['probe:' + probeKind] : []),
        feature,
        route,
        statePath: stringFrom(probeRecord.statePath),
        artifact: stringFrom(probeRecord.artifact),
        required: true,
        message: probeRecord.status === 'covered' ? 'Coverage probe is covered.' : 'Coverage probe is not covered.',
        tags: ['surface-coverage', 'probe', probeKind, ...stringArray(probeRecord.tags)],
        metadata: probeRecord
      });
    }
    for (const proof of arrayFromUnknown(record.contractProofs)) {
      const proofRecord = unknownRecord(proof);
      const proofKind = stringFrom(proofRecord.kind, 'contract');
      out.push({
        id: stringFrom(proofRecord.id, (surfaceId || 'surface') + ':' + proofKind + ':contract'),
        kind: 'contract:' + proofKind,
        source: 'surface-coverage.contract',
        status: proofRecord.status === 'passed' ? 'passed' : proofRecord.status === 'planned' ? 'blocked' : stringFrom(proofRecord.status, 'unknown'),
        target: surfaceId,
        targets: surfaceTargets.concat(['contract:' + proofKind]),
        feature,
        route: stringFrom(proofRecord.route, route),
        artifact: stringFrom(proofRecord.artifact),
        required: proofRecord.required !== false,
        message: stringFrom(proofRecord.message),
        tags: ['surface-coverage', 'contract', proofKind, ...stringArray(proofRecord.tags)],
        metadata: proofRecord
      });
    }
  }
  return out;
}

function playwrightReportEvidence(values: readonly unknown[] | undefined): FrontierTestEvidenceObservationInput[] {
  const reports: Record<string, unknown>[] = [];
  for (const value of values ?? []) collectPlaywrightReports(value, reports);
  const out: FrontierTestEvidenceObservationInput[] = [];
  for (const report of reports) {
    out.push({
      id: stringFrom(report.runId, 'playwright') + ':report',
      kind: 'playwright-report',
      source: 'playwright',
      status: report.ok === false ? 'failed' : 'passed',
      target: 'playwright:report',
      metadata: { summary: report.summary ?? null }
    });
    for (const query of arrayFromUnknown(report.queries)) {
      const queryRecord = unknownRecord(query);
      const queryInput = unknownRecord(queryRecord.query);
      const count = numberFrom(queryRecord.count, arrayFromUnknown(queryRecord.matches).length);
      const id = stringFrom(queryRecord.id, 'playwright-query');
      out.push({
        id: 'playwright:' + id,
        kind: 'playwright-query',
        source: 'playwright',
        status: count > 0 ? 'passed' : 'failed',
        target: id,
        targets: uniqueStrings([
          stringFrom(queryInput.registryEntryId),
          stringFrom(queryInput.registryKind),
          stringFrom(queryInput.selector),
          stringFrom(queryInput.id),
          stringFrom(queryInput.feature) ? 'feature:' + stringFrom(queryInput.feature) : undefined
        ]),
        feature: stringFrom(queryInput.feature),
        statePath: pathFromUnknown(queryInput.path),
        required: true,
        message: count > 0 ? 'Playwright evidence query matched.' : 'Playwright evidence query had no matches.',
        metadata: queryRecord
      });
    }
  }
  return out;
}

function inspectBundleEvidence(values: readonly unknown[] | undefined): FrontierTestEvidenceObservationInput[] {
  const out: FrontierTestEvidenceObservationInput[] = [];
  for (const value of values ?? []) {
    const bundle = unknownRecord(value);
    if (Object.keys(bundle).length === 0) continue;
    const summary = unknownRecord(bundle.summary);
    const errorCount = numberFrom(summary.errorCount, 0) + numberFrom(summary.errors, 0);
    out.push({
      id: stringFrom(bundle.id, 'inspect') + ':bundle',
      kind: 'inspect-bundle',
      source: 'inspect',
      status: bundle.ok === false || errorCount > 0 ? 'failed' : 'passed',
      target: 'inspect:bundle',
      message: errorCount > 0 ? 'Inspect bundle has error events.' : 'Inspect bundle is readable.',
      metadata: { summary }
    });
    for (const artifact of arrayFromUnknown(bundle.artifacts)) {
      const artifactRecord = unknownRecord(artifact);
      out.push({
        id: stringFrom(artifactRecord.id, 'inspect-artifact'),
        kind: stringFrom(artifactRecord.kind, 'inspect-artifact'),
        source: 'inspect.artifact',
        status: artifactRecord.status === 'error' ? 'failed' : 'passed',
        target: stringFrom(artifactRecord.id),
        feature: stringFrom(artifactRecord.feature),
        artifact: stringFrom(artifactRecord.path, stringFrom(artifactRecord.file, stringFrom(artifactRecord.source))),
        message: stringFrom(artifactRecord.message),
        metadata: artifactRecord
      });
    }
    for (const event of arrayFromUnknown(bundle.events)) {
      const eventRecord = unknownRecord(event);
      const severity = stringFrom(eventRecord.severity, stringFrom(eventRecord.level));
      out.push({
        id: stringFrom(eventRecord.id, 'inspect-event'),
        kind: stringFrom(eventRecord.kind, 'inspect-event'),
        source: 'inspect.event',
        status: severity === 'error' || eventRecord.status === 'error' ? 'failed' : 'passed',
        target: stringFrom(eventRecord.id),
        feature: stringFrom(eventRecord.feature),
        message: stringFrom(eventRecord.message),
        metadata: eventRecord
      });
    }
  }
  return out;
}

function traceRecordEvidence(values: readonly unknown[] | undefined): FrontierTestEvidenceObservationInput[] {
  const out: FrontierTestEvidenceObservationInput[] = [];
  for (const value of values ?? []) {
    const record = unknownRecord(value);
    if (Object.keys(record).length === 0) continue;
    const traceId = stringFrom(record.traceId, stringFrom(record.id));
    const status = record.error || record.status === 'error' || record.status === 'failed' ? 'failed' : stringFrom(record.status, 'passed');
    out.push({
      id: traceId || 'trace-record',
      kind: stringFrom(record.kind, 'trace'),
      source: 'trace',
      status,
      target: stringFrom(record.name, traceId),
      traceId,
      message: stringFrom(record.message),
      metadata: record
    });
  }
  return out;
}

function logRecordEvidence(values: readonly unknown[] | undefined): FrontierTestEvidenceObservationInput[] {
  const out: FrontierTestEvidenceObservationInput[] = [];
  for (const value of values ?? []) {
    const record = unknownRecord(value);
    if (Object.keys(record).length === 0) continue;
    const level = stringFrom(record.level, stringFrom(record.severity)).toLowerCase();
    out.push({
      id: stringFrom(record.id, stringFrom(record.traceId, 'log-record')),
      kind: stringFrom(record.kind, 'log'),
      source: 'log',
      status: level === 'error' ? 'failed' : 'passed',
      target: stringFrom(record.name, stringFrom(record.event)),
      traceId: stringFrom(record.traceId),
      message: stringFrom(record.message),
      metadata: record
    });
  }
  return out;
}

function collectPlaywrightReports(value: unknown, out: Record<string, unknown>[]): void {
  const record = unknownRecord(value);
  if (Object.keys(record).length === 0) return;
  if (Array.isArray(record.queries)) {
    out.push(record);
    return;
  }
  if (record.report) collectPlaywrightReports(record.report, out);
}

function summarizeTestEvidence(observations: readonly FrontierTestEvidenceObservation[]): FrontierTestEvidenceSummary {
  const summary: FrontierTestEvidenceSummary = { total: observations.length, passed: 0, failed: 0, blocked: 0, unknown: 0, required: 0, sourceCount: 0, artifactCount: 0, targetCount: 0 };
  const sources = new Set<string>();
  const artifacts = new Set<string>();
  const targets = new Set<string>();
  for (const observation of observations) {
    summary[observation.status] += 1;
    if (observation.required) summary.required += 1;
    sources.add(observation.source);
    for (const artifact of observation.artifacts) artifacts.add(artifact);
    for (const target of observation.targets) targets.add(target);
  }
  summary.sourceCount = sources.size;
  summary.artifactCount = artifacts.size;
  summary.targetCount = targets.size;
  return summary;
}

function normalizeGateEvidence(input: FrontierTestGateEvidenceInput): FrontierTestGateEvidenceRecord {
  const status = normalizeGateEvidenceStatus(input.status);
  const packageScope = uniqueStrings((input.packageScope ?? []).concat(input.package ? [input.package] : []));
  return {
    id: normalizeId(input.id, 'test gate evidence id'),
    kind: input.kind,
    required: input.required !== false,
    status,
    durationMs: Math.max(0, Math.floor(input.durationMs ?? 0)),
    failureTail: normalizeFailureTail(input.failureTail ?? (status === 'failed' || status === 'blocked' ? input.message : undefined)),
    artifacts: uniqueStrings((input.artifacts ?? []).map(normalizeFilePath)),
    packageScope,
    ...(input.message ? { message: input.message } : {})
  };
}

function isGateExecutionRecord(input: FrontierTestGateExecutionInput | FrontierTestGateExecutionRecord): input is FrontierTestGateExecutionRecord {
  return (input as { kind?: unknown; version?: unknown }).kind === FRONTIER_TEST_GATE_EXECUTION_KIND
    && (input as { version?: unknown }).version === FRONTIER_TEST_GATE_EXECUTION_VERSION;
}

function normalizeGateCommand(command: FrontierTestGateExecutionInput['command'], args?: readonly string[]): string[] {
  const commandParts = Array.isArray(command)
    ? command.map((part) => String(part)).filter(Boolean)
    : typeof command === 'string' && command.trim()
      ? command.trim().split(/\s+/g)
      : [];
  return commandParts.concat((args ?? []).map((part) => String(part)).filter(Boolean));
}

function normalizeGateArtifacts(input: FrontierTestGateExecutionInput['artifacts']): FrontierTestGateArtifactRecord[] {
  const out: FrontierTestGateArtifactRecord[] = [];
  const seen = new Set<string>();
  for (const artifact of input ?? []) {
    const record = typeof artifact === 'string'
      ? { path: normalizeFilePath(artifact) }
      : normalizeGateArtifact(artifact);
    if (seen.has(record.path)) continue;
    seen.add(record.path);
    out.push(record);
  }
  return out;
}

function normalizeGateArtifact(input: FrontierTestGateArtifactInput): FrontierTestGateArtifactRecord {
  return {
    path: normalizeFilePath(input.path),
    ...(input.kind ? { kind: String(input.kind) } : {}),
    ...(input.role ? { role: String(input.role) } : {}),
    ...(input.bytes !== undefined && Number.isFinite(input.bytes) ? { bytes: Math.max(0, Math.floor(input.bytes)) } : {}),
    ...(input.sha256 ? { sha256: String(input.sha256) } : {}),
    ...(input.mimeType ? { mimeType: String(input.mimeType) } : {}),
    ...optionalObject('metadata', input.metadata)
  };
}

function normalizeGateReplayEvidence(input: FrontierTestGateReplayEvidenceInput | undefined): FrontierTestGateReplayEvidenceRecord | undefined {
  if (!input) return undefined;
  const command = normalizeGateCommand(input.command, input.args);
  const record: FrontierTestGateReplayEvidenceRecord = {
    command,
    ...(input.cwd ? { cwd: input.cwd } : {}),
    envKeys: uniqueStrings(input.envKeys),
    ...(input.seed !== undefined ? { seed: typeof input.seed === 'number' ? input.seed : String(input.seed) } : {}),
    sourceRefs: uniqueStrings((input.sourceRefs ?? []).map(normalizeFilePath)),
    ...(input.jsonlPath ? { jsonlPath: normalizeFilePath(input.jsonlPath) } : {}),
    ...(input.proofPath ? { proofPath: normalizeFilePath(input.proofPath) } : {}),
    ...(input.tracePath ? { tracePath: normalizeFilePath(input.tracePath) } : {}),
    ...optionalObject('metadata', input.metadata)
  };
  return command.length || record.cwd || record.envKeys.length || record.seed !== undefined || record.sourceRefs.length || record.jsonlPath || record.proofPath || record.tracePath || record.metadata
    ? record
    : undefined;
}

function normalizeGateOracleEvidence(input: FrontierTestGateOracleEvidenceInput): FrontierTestGateOracleEvidenceRecord {
  return {
    id: normalizeId(input.id, 'test gate oracle evidence id'),
    ...(input.scenario ? { scenario: String(input.scenario) } : {}),
    ...(input.expected !== undefined ? { expected: toJsonValue(input.expected) } : {}),
    ...(input.actual !== undefined ? { actual: toJsonValue(input.actual) } : {}),
    matches: input.matches !== false,
    mismatches: uniqueStrings(input.mismatches),
    ...(input.comparisonArtifact ? { comparisonArtifact: normalizeFilePath(input.comparisonArtifact) } : {}),
    ...optionalObject('metadata', input.metadata)
  };
}

function normalizePackageGateMatrix(input: FrontierTestPackageGateMatrixInput): FrontierTestPackageGateMatrixRecord {
  const status = normalizeGateEvidenceStatus(input.status ?? 'unknown');
  const dependencyOrder = input.dependencyOrder === undefined || !Number.isFinite(input.dependencyOrder) ? undefined : Math.max(0, Math.floor(input.dependencyOrder));
  return {
    id: normalizeId(input.id, 'test package gate matrix id'),
    packageId: normalizeId(input.packageId, 'test package gate matrix package id'),
    packagePath: normalizeFilePath(input.packagePath),
    packageName: String(input.packageName),
    selection: normalizePackageGateMatrixSelection(input.selection),
    ...(dependencyOrder !== undefined ? { dependencyOrder } : {}),
    required: input.required !== false,
    status,
    durationMs: Math.max(0, Math.floor(input.durationMs ?? 0)),
    failureTail: normalizeFailureTail(input.failureTail ?? (status === 'failed' || status === 'blocked' ? input.message : undefined)),
    artifacts: uniqueStrings((input.artifacts ?? []).map(normalizeFilePath)),
    packageScope: uniqueStrings((input.packageScope ?? []).concat(input.packagePath)),
    ...(input.message ? { message: input.message } : {})
  };
}

function defaultModelRoutingOracleFixtures(): FrontierTestModelRoutingOracleFixtureInput[] {
  return [
    {
      id: 'model-routing-oracle:simple-docs',
      label: 'Simple docs stay on the compact model',
      description: 'A single-document documentation change should stay on the compact route and avoid escalation.',
      scenario: 'simple-docs',
      expectedRoute: 'gpt-5.4-mini',
      expectedDisposition: 'route',
      signals: {
        surface: 'documentation',
        changedFiles: 1,
        changedPackages: 0,
        semanticMergeCandidates: 0,
        repeatedFailures: 0,
        humanAmbiguity: false,
        tournamentBacked: false
      },
      tags: ['docs', 'compact', 'baseline']
    },
    {
      id: 'model-routing-oracle:isolated-package-code',
      label: 'Isolated package code stays on the compact model',
      description: 'A small, isolated package edit should stay on the compact route because the blast radius is narrow.',
      scenario: 'isolated-package-code',
      expectedRoute: 'gpt-5.4-mini',
      expectedDisposition: 'route',
      signals: {
        surface: 'package-code',
        changedFiles: 3,
        changedPackages: 1,
        semanticMergeCandidates: 1,
        repeatedFailures: 0,
        humanAmbiguity: false,
        tournamentBacked: false
      },
      tags: ['package', 'isolated', 'compact']
    },
    {
      id: 'model-routing-oracle:broad-semantic-merge',
      label: 'Broad semantic merges escalate to the stronger model',
      description: 'A wide semantic merge should escalate to the stronger model because breadth and coupling are high.',
      scenario: 'broad-semantic-merge',
      expectedRoute: 'gpt-5.5',
      expectedDisposition: 'escalate',
      signals: {
        surface: 'semantic-merge',
        changedFiles: 18,
        changedPackages: 5,
        semanticMergeCandidates: 12,
        repeatedFailures: 0,
        humanAmbiguity: false,
        tournamentBacked: false
      },
      tags: ['semantic-merge', 'broad', 'escalate']
    },
    {
      id: 'model-routing-oracle:repeated-failure',
      label: 'Repeated failures escalate rather than loop',
      description: 'A task that has failed repeatedly should escalate instead of being retried on the same narrow route.',
      scenario: 'repeated-failure',
      expectedRoute: 'gpt-5.5',
      expectedDisposition: 'escalate',
      signals: {
        surface: 'retry-loop',
        changedFiles: 4,
        changedPackages: 2,
        semanticMergeCandidates: 2,
        repeatedFailures: 3,
        humanAmbiguity: false,
        tournamentBacked: false
      },
      tags: ['retry', 'failure', 'escalate']
    },
    {
      id: 'model-routing-oracle:human-ambiguity',
      label: 'Human ambiguity escalates to a human question',
      description: 'When the decision needs missing authority or a policy call, the router should escalate to human review.',
      scenario: 'human-ambiguity',
      expectedRoute: 'human',
      expectedDisposition: 'escalate',
      signals: {
        surface: 'policy',
        changedFiles: 2,
        changedPackages: 1,
        semanticMergeCandidates: 0,
        repeatedFailures: 0,
        humanAmbiguity: true,
        missingAuthority: 'approval',
        tournamentBacked: false
      },
      tags: ['human', 'ambiguity', 'question']
    },
    {
      id: 'model-routing-oracle:tournament-backed-downgrade',
      label: 'Tournament-backed wins can downgrade to the cheaper model',
      description: 'When the tournament result is clear, the router should downgrade to the cheaper compact model.',
      scenario: 'tournament-backed-downgrade',
      expectedRoute: 'gpt-5.4-mini',
      expectedDisposition: 'downgrade',
      signals: {
        surface: 'tournament',
        changedFiles: 6,
        changedPackages: 2,
        semanticMergeCandidates: 3,
        repeatedFailures: 0,
        humanAmbiguity: false,
        tournamentBacked: true,
        tournamentWinner: 'gpt-5.4-mini',
        baselineModel: 'gpt-5.5'
      },
      tags: ['tournament', 'downgrade', 'compact']
    }
  ];
}

function normalizeModelRoutingOracleFixture(input: FrontierTestModelRoutingOracleFixture | FrontierTestModelRoutingOracleFixtureInput): FrontierTestModelRoutingOracleFixture {
  const record = unknownRecord(input);
  const scenario = stringFrom(record.scenario, stringFrom(record.id));
  const expectedRoute = normalizeModelRoutingRoute(record.expectedRoute);
  const expectedDisposition = normalizeModelRoutingDisposition(record.expectedDisposition ?? 'route', {
    route: expectedRoute,
    reason: stringFrom(record.description, stringFrom(record.label))
  }) as FrontierTestModelRoutingOracleDisposition;
  return {
    id: normalizeId(stringFrom(record.id, scenario), 'test model routing oracle fixture id'),
    label: stringFrom(record.label, titleFromId(scenario)),
    description: stringFrom(record.description, stringFrom(record.label, titleFromId(scenario))),
    scenario,
    expectedRoute,
    expectedDisposition,
    ...optionalObject('signals', record.signals),
    tags: uniqueStrings([
      ...stringArray(record.tags),
      'model-routing-oracle',
      scenario,
      expectedRoute,
      expectedDisposition
    ]),
    ...optionalObject('metadata', record.metadata)
  };
}

function normalizeModelRoutingDecision(input: FrontierTestModelRoutingDecisionInput | unknown): {
  id?: string;
  scenario: string;
  label: string;
  route: string;
  disposition: FrontierTestModelRoutingDecisionDisposition;
} {
  const record = unknownRecord(input);
  const route = normalizeModelRoutingRoute(
    record.route
    ?? record.model
    ?? record.modelId
    ?? record.selectedModel
    ?? record.targetModel
    ?? record.winnerModel
    ?? record.destination
    ?? record.nextModel
    ?? record.fallbackModel
    ?? (record.humanQuestion !== undefined || record.question !== undefined || record.needsHuman === true ? 'human' : '')
  );
  return {
    ...(record.id ? { id: normalizeId(String(record.id), 'test model routing decision id') } : {}),
    scenario: stringFrom(record.scenario),
    label: stringFrom(record.label, stringFrom(record.title)),
    route,
    disposition: normalizeModelRoutingDisposition(record.decision ?? record.outcome ?? record.status ?? record.action, {
      route,
      humanQuestion: record.humanQuestion ?? record.question,
      needsHuman: record.needsHuman === true,
      downgraded: record.downgraded === true,
      escalated: record.escalated === true,
      reason: stringFrom(record.reason)
    })
  };
}

function normalizeModelRoutingRoute(value: unknown): string {
  const text = stringFrom(value);
  if (!text) return 'unknown';
  const trimmed = text.trim();
  const prefixMatch = /^(route|model|destination|winner|selected-model|target-model|next-model|fallback-model)\s*:\s*/i.exec(trimmed);
  const route = prefixMatch ? trimmed.slice(prefixMatch[0].length).trim() : trimmed;
  if (!route) return 'unknown';
  const lower = route.toLowerCase();
  if (lower === 'human' || lower === 'human-question' || lower === 'question' || lower.startsWith('human:')) return 'human';
  return route;
}

function normalizeModelRoutingDisposition(
  value: unknown,
  context: {
    route: string;
    humanQuestion?: unknown;
    needsHuman?: boolean;
    downgraded?: boolean;
    escalated?: boolean;
    reason?: string;
  }
): FrontierTestModelRoutingDecisionDisposition {
  const text = [
    stringFrom(value),
    context.reason ?? '',
    context.route,
    context.needsHuman ? 'needs-human' : '',
    context.downgraded ? 'downgraded' : '',
    context.escalated ? 'escalated' : ''
  ].join(' ').toLowerCase();
  if (context.humanQuestion !== undefined || context.needsHuman || text.includes('human') || text.includes('question')) return 'escalate';
  if (context.downgraded || text.includes('downgrade') || text.includes('fallback') || text.includes('demote')) return 'downgrade';
  if (context.escalated || text.includes('escalate') || text.includes('promote')) return 'escalate';
  if (context.route === 'human') return 'escalate';
  return 'route';
}

function compareGateEvidenceRecords(left: FrontierTestGateEvidenceRecord, right: FrontierTestGateEvidenceRecord): number {
  return (
    Number(right.required) - Number(left.required) ||
    compareGateStatus(left.status, right.status) ||
    right.durationMs - left.durationMs ||
    left.kind.localeCompare(right.kind) ||
    left.id.localeCompare(right.id)
  );
}

function comparePackageGateMatrixRecords(left: FrontierTestPackageGateMatrixRecord, right: FrontierTestPackageGateMatrixRecord): number {
  return (
    packageGateMatrixSelectionGroup(left.selection) - packageGateMatrixSelectionGroup(right.selection) ||
    packageGateMatrixDependencyOrder(left) - packageGateMatrixDependencyOrder(right) ||
    packageGateMatrixSelectionRank(left.selection) - packageGateMatrixSelectionRank(right.selection) ||
    Number(right.required) - Number(left.required) ||
    compareGateStatus(left.status, right.status) ||
    left.packageId.localeCompare(right.packageId) ||
    left.packagePath.localeCompare(right.packagePath) ||
    left.packageName.localeCompare(right.packageName) ||
    left.id.localeCompare(right.id)
  );
}

function compareGateStatus(left: FrontierTestGateEvidenceStatus, right: FrontierTestGateEvidenceStatus): number {
  return gateStatusRank(right) - gateStatusRank(left);
}

function gateStatusRank(status: FrontierTestGateEvidenceStatus): number {
  if (status === 'failed') return 4;
  if (status === 'blocked') return 3;
  if (status === 'unknown') return 2;
  if (status === 'skipped') return 1;
  return 0;
}

function normalizeGateEvidenceStatus(status: FrontierTestGateEvidenceInput['status']): FrontierTestGateEvidenceStatus {
  if (status === true) return 'passed';
  if (status === false) return 'failed';
  const value = String(status ?? 'unknown').toLowerCase();
  if (['passed', 'pass', 'ok', 'covered', 'success', 'succeeded', 'true', 'verified'].includes(value)) return 'passed';
  if (['failed', 'fail', 'missing', 'error', 'errored', 'false', 'rejected'].includes(value)) return 'failed';
  if (['skipped', 'skip', 'omitted', 'ignored'].includes(value)) return 'skipped';
  if (['blocked', 'planned', 'pending', 'todo', 'waiting', 'flaky'].includes(value)) return 'blocked';
  return 'unknown';
}

function normalizePackageGateMatrixSelection(value: FrontierTestPackageGateMatrixInput['selection']): FrontierTestPackageGateMatrixSelection {
  if (value === true || value === undefined || value === null) return 'selected';
  if (value === false) return 'skipped';
  const normalized = String(value).toLowerCase().replace(/\s+/g, '-');
  if (normalized.startsWith('dependency')) return 'dependency-selected';
  if (['skipped', 'skip', 'unrelated', 'ignored'].includes(normalized)) return 'skipped';
  return 'selected';
}

function packageGateMatrixSelectionGroup(selection: FrontierTestPackageGateMatrixSelection): number {
  return selection === 'skipped' ? 1 : 0;
}

function packageGateMatrixSelectionRank(selection: FrontierTestPackageGateMatrixSelection): number {
  if (selection === 'selected') return 0;
  if (selection === 'dependency-selected') return 1;
  return 2;
}

function packageGateMatrixDependencyOrder(record: FrontierTestPackageGateMatrixRecord): number {
  return record.dependencyOrder ?? Number.MAX_SAFE_INTEGER;
}

function normalizeFailureTail(value: string | readonly string[] | undefined): string[] {
  if (value === undefined) return [];
  const lines = typeof value === 'string' ? splitFailureTail(value) : value.flatMap((entry) => splitFailureTail(entry));
  return uniqueStrings(lines).slice(-5);
}

function splitFailureTail(value: string): string[] {
  return String(value)
    .split(/\r?\n/g)
    .map((line) => line.replace(/\s+$/u, ''))
    .filter((line) => line.trim().length > 0);
}

function selectEvidenceSpecs(
  compiled: FrontierCompiledTestManifest,
  input: FrontierTestEvidenceRunInput,
  observations: readonly FrontierTestEvidenceObservation[]
): FrontierTestSpec[] {
  if (input.plan?.specIds.length) return specsForIds(compiled.specsById, input.plan.specIds);
  if (input.specIds?.length) return specsForIds(compiled.specsById, input.specIds);
  if (input.results?.length) return specsForIds(compiled.specsById, input.results.map((result) => result.specId));
  const matched = compiled.manifest.specs.filter((spec) => observations.some((observation) => evidenceMatchesSpec(observation, spec)));
  return matched.length > 0 ? matched : compiled.manifest.specs;
}

function evidenceResultForSpec(
  spec: FrontierTestSpec,
  observations: readonly FrontierTestEvidenceObservation[],
  input: FrontierTestEvidenceRunInput,
  direct?: FrontierTestResultInput
): FrontierTestResultInput {
  const matches = observations.filter((observation) => evidenceMatchesSpec(observation, spec));
  if (matches.length === 0 && direct) return direct;
  const requiredMatches = matches.filter((observation) => observation.required);
  const optionalPassedMatches = matches.filter((observation) => !observation.required && observation.status === 'passed');
  const statusMatches = requiredMatches.length > 0 ? requiredMatches : optionalPassedMatches;
  const statuses = statusMatches.map((observation) => observation.status);
  if (direct) statuses.push(evidenceStatusFromTestStatus(direct.status));
  if (matches.length === 0 && !direct) statuses.push(input.failOnMissing ? 'failed' : 'unknown');
  const status = testStatusFromEvidenceStatuses(statuses);
  const messages = uniqueStrings(matches.map((observation) => observation.message));
  const metadata = {
    ...metadataObject(direct?.metadata),
    evidenceObservationIds: matches.map((observation) => observation.id),
    evidenceSources: uniqueStrings(matches.map((observation) => observation.source)),
    evidenceTargets: uniqueStrings(matches.flatMap((observation) => observation.targets))
  };
  return {
    specId: spec.id,
    status,
    durationMs: direct?.durationMs ?? 0,
    attempts: direct?.attempts,
    patches: direct?.patches,
    effects: uniqueStrings((direct?.effects ?? []).concat(matches.flatMap((observation) => observation.effects))),
    routes: uniqueStrings((direct?.routes ?? []).concat(direct?.route ? [direct.route] : [], matches.flatMap((observation) => observation.routes))),
    policies: uniqueStrings((direct?.policies ?? []).concat(matches.flatMap((observation) => observation.policies))),
    artifacts: uniqueStrings((direct?.artifacts ?? []).concat(matches.flatMap((observation) => observation.artifacts))),
    traceIds: uniqueStrings((direct?.traceIds ?? []).concat(matches.flatMap((observation) => observation.traceIds))),
    error: direct?.error ?? (status === 'failed' || status === 'blocked' ? messages.join('; ') || 'Required evidence did not pass.' : undefined),
    metadata
  };
}

function evidenceMatchesSpec(observation: FrontierTestEvidenceObservation, spec: FrontierTestSpec): boolean {
  if (observation.specId) return observation.specId === spec.id;
  const specTargets = specEvidenceTargets(spec);
  if (overlaps(observation.targets, specTargets)) return true;
  if (observation.feature && spec.feature === observation.feature) return true;
  if (routeListsOverlap(observation.routes, specRoutes(spec))) return true;
  if (overlaps(observation.actions, spec.actions.concat(spec.covers))) return true;
  if (overlaps(observation.effects, spec.effects.concat(spec.expect.effects, spec.covers))) return true;
  if (overlaps(observation.policies, spec.policies.concat(spec.expect.policies, spec.covers))) return true;
  if (overlaps(observation.statePaths, spec.statePaths.concat(spec.expect.patches))) return true;
  if (overlaps(observation.artifacts, spec.artifacts.concat(spec.expect.artifacts))) return true;
  if (overlaps(observation.traceIds, spec.expect.traces)) return true;
  return false;
}

function specEvidenceTargets(spec: FrontierTestSpec): string[] {
  return uniqueStrings([
    spec.id,
    'spec:' + spec.id,
    spec.feature ? 'feature:' + spec.feature : undefined,
    ...spec.covers,
    ...spec.actions.map((action) => 'action:' + action),
    ...spec.effects.concat(spec.expect.effects).map((effect) => 'effect:' + effect),
    ...spec.policies.concat(spec.expect.policies).map((policy) => 'policy:' + policy),
    ...specRoutes(spec).map(routeTarget),
    ...spec.statePaths.concat(spec.expect.patches).map((path) => 'path:' + path),
    ...spec.artifacts.concat(spec.expect.artifacts).map((artifact) => 'artifact:' + normalizeFilePath(artifact)),
    ...spec.expect.traces.map((trace) => 'trace:' + trace)
  ]);
}

function specRoutes(spec: FrontierTestSpec): string[] {
  return uniqueStrings([
    ...spec.routes,
    ...spec.expect.routes,
    spec.given.route,
    spec.when.route
  ]);
}

function routeListsOverlap(left: readonly string[], right: readonly string[]): boolean {
  for (const leftRoute of left) {
    const normalizedLeft = comparableRoute(leftRoute);
    for (const rightRoute of right) {
      if (normalizedLeft === comparableRoute(rightRoute)) return true;
    }
  }
  return false;
}

function routeTarget(value: string): string {
  return 'route:' + comparableRoute(value);
}

function comparableRoute(value: string): string {
  let route = value.trim();
  if (route.startsWith('route:')) route = route.slice('route:'.length);
  route = route.split(/[?#]/, 1)[0] ?? route;
  if (!route) return '';
  return route.startsWith('/') ? route : '/' + route;
}

function normalizeEvidenceStatus(status: string | boolean | undefined): FrontierTestEvidenceStatus {
  if (status === true) return 'passed';
  if (status === false) return 'failed';
  const value = String(status ?? 'unknown').toLowerCase();
  if (['passed', 'pass', 'ok', 'covered', 'success', 'succeeded', 'true', 'verified'].includes(value)) return 'passed';
  if (['failed', 'fail', 'missing', 'error', 'errored', 'false', 'rejected'].includes(value)) return 'failed';
  if (['blocked', 'planned', 'pending', 'todo', 'skipped', 'waiting'].includes(value)) return 'blocked';
  return 'unknown';
}

function evidenceStatusFromTestStatus(status: FrontierTestStatus): FrontierTestEvidenceStatus {
  if (status === 'passed' || status === 'flaky') return 'passed';
  if (status === 'failed') return 'failed';
  if (status === 'blocked' || status === 'skipped' || status === 'todo') return 'blocked';
  return 'unknown';
}

function testStatusFromEvidenceStatuses(statuses: readonly FrontierTestEvidenceStatus[]): FrontierTestStatus {
  if (statuses.includes('failed')) return 'failed';
  if (statuses.includes('blocked')) return 'blocked';
  if (statuses.includes('unknown')) return 'unknown';
  return statuses.length > 0 ? 'passed' : 'unknown';
}

function metadataObject(value: unknown): JsonObject {
  if (value === undefined) return {};
  return toJsonObject(value);
}

function unknownRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function arrayFromUnknown(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? uniqueStrings(value.map((item) => String(item))) : [];
}

function stringFrom(value: unknown, fallback = ''): string {
  if (value === undefined || value === null) return fallback;
  const text = String(value).trim();
  return text || fallback;
}

function numberFrom(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function pathFromUnknown(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return '/' + value.map(String).join('/');
  return undefined;
}

function normalizeSpec(input: FrontierTestSpecInput): FrontierTestSpec {
  const id = normalizeId(input.id, 'test spec id');
  const when = normalizeWhen(input.when);
  const expect = normalizeExpectation(input.expect);
  const given = normalizeGiven(input.given);
  const sourceFile = typeof input.source === 'string' ? input.source : undefined;
  const sourceFiles = uniqueStrings([sourceFile, ...(input.sourceFiles ?? [])].filter((file): file is string => !!file).map(normalizeFilePath));
  const actions = uniqueStrings((input.actions ?? []).concat(when.action ? [when.action] : [], when.tool ? [when.tool] : []));
  const effects = uniqueStrings((input.effects ?? []).concat(when.effect ? [when.effect] : [], expect.effects));
  const routes = uniqueStrings((input.routes ?? []).concat(when.route ? [when.route] : [], given.route ? [given.route] : [], expect.routes));
  const policies = uniqueStrings((input.policies ?? []).concat(expect.policies));
  const workflows = uniqueStrings((input.workflows ?? []).concat(when.workflow ? [when.workflow] : []));
  const migrations = uniqueStrings((input.migrations ?? []).concat(when.migration ? [when.migration] : []));
  const fixtures = uniqueStrings((input.fixtures ?? []).concat(given.fixtures));
  return {
    kind: FRONTIER_TEST_SPEC_KIND,
    version: FRONTIER_TEST_SPEC_VERSION,
    id,
    testKind: input.kind ?? kindFromId(id),
    title: input.title ?? titleFromId(id),
    ...(input.description ? { description: input.description } : {}),
    ...(input.feature ? { feature: input.feature } : {}),
    given,
    when,
    expect,
    covers: uniqueStrings(input.covers),
    actions,
    effects,
    routes,
    policies,
    views: uniqueStrings(input.views),
    workflows,
    migrations,
    statePaths: uniqueStrings((input.statePaths ?? []).concat(expect.patches)),
    resources: uniqueStrings(input.resources),
    fixtures,
    commands: uniqueStrings(input.commands),
    gates: uniqueStrings(input.gates),
    artifacts: uniqueStrings((input.artifacts ?? []).concat(expect.artifacts)),
    ...(input.replayOf ? { replayOf: input.replayOf } : {}),
    ...(input.fuzzer ? { fuzzer: input.fuzzer } : {}),
    ...(input.benchmark ? { benchmark: input.benchmark } : {}),
    owners: uniqueStrings(input.owners),
    ...(input.package ? { package: input.package } : {}),
    sourceFiles,
    tags: uniqueStrings(input.tags),
    priority: input.priority ?? priorityForKind(input.kind ?? kindFromId(id)),
    ...(input.timeoutMs !== undefined ? { timeoutMs: Math.max(0, Math.floor(input.timeoutMs)) } : {}),
    retries: Math.max(0, Math.floor(input.retries ?? 0)),
    ...(typeof input.source === 'object' ? { source: input.source } : {}),
    ...optionalObject('metadata', input.metadata)
  };
}

function normalizeGiven(input: FrontierTestGivenInput = {}): FrontierTestGiven {
  return {
    ...(input.stateFixture ? { stateFixture: input.stateFixture } : {}),
    fixtures: uniqueStrings(input.fixtures),
    ...(input.route ? { route: input.route } : {}),
    ...(input.actor ? { actor: input.actor } : {}),
    capabilities: uniqueStrings(input.capabilities),
    files: uniqueStrings((input.files ?? []).map(normalizeFilePath)),
    ...optionalObject('metadata', input.metadata)
  };
}

function normalizeWhen(input: FrontierTestWhenInput = {}): FrontierTestWhen {
  return {
    ...(input.action ? { action: input.action } : {}),
    ...(input.tool ? { tool: input.tool } : {}),
    ...(input.workflow ? { workflow: input.workflow } : {}),
    ...(input.migration ? { migration: input.migration } : {}),
    ...(input.effect ? { effect: input.effect } : {}),
    ...(input.route ? { route: input.route } : {}),
    ...optionalObject('input', input.input),
    ...optionalObject('metadata', input.metadata)
  };
}

function normalizeExpectation(input: FrontierTestExpectationInput = {}): FrontierTestExpectation {
  return {
    patches: uniqueStrings((input.patches ?? []).map((patch) => typeof patch === 'string' ? patch : patch.path ?? patch.op ?? 'patch')),
    effects: uniqueStrings(input.effects),
    routes: uniqueStrings((input.routes ?? []).concat(input.route ? [input.route] : [])),
    policies: uniqueStrings((input.policies ?? []).concat(input.policy ?? [])),
    traces: uniqueStrings(input.traces),
    artifacts: uniqueStrings(input.artifacts),
    assertions: uniqueStrings(input.assertions),
    ...optionalObject('metadata', input.metadata)
  };
}

function normalizeFixture(input: FrontierTestFixtureInput): FrontierTestFixture {
  const sourceFile = typeof input.source === 'string' ? input.source : undefined;
  return {
    id: normalizeId(input.id, 'test fixture id'),
    kind: input.kind ?? kindFromId(input.id),
    sourceFiles: uniqueStrings([sourceFile, ...(input.files ?? [])].filter((file): file is string => !!file).map(normalizeFilePath)),
    ...(input.stateFixture ? { stateFixture: input.stateFixture } : {}),
    ...optionalObject('data', input.data),
    owners: uniqueStrings(input.owners),
    tags: uniqueStrings(input.tags),
    ...(typeof input.source === 'object' ? { source: input.source } : {}),
    ...optionalObject('metadata', input.metadata)
  };
}

function normalizeCommand(input: FrontierTestCommandInput): FrontierTestCommand {
  const sourceFile = typeof input.source === 'string' ? input.source : undefined;
  return {
    id: normalizeId(input.id, 'test command id'),
    command: normalizeId(input.command, 'test command'),
    args: (input.args ?? []).map(String),
    ...(input.cwd ? { cwd: normalizeFilePath(input.cwd) } : {}),
    ...(input.env ? { env: toJsonObject(input.env) } : {}),
    kind: input.kind ?? kindFromId(input.id),
    ...(input.package ? { package: input.package } : {}),
    sourceFiles: sourceFile ? [normalizeFilePath(sourceFile)] : [],
    ...(input.timeoutMs !== undefined ? { timeoutMs: Math.max(0, Math.floor(input.timeoutMs)) } : {}),
    artifacts: uniqueStrings((input.artifacts ?? []).map(normalizeFilePath)),
    tags: uniqueStrings(input.tags),
    ...(typeof input.source === 'object' ? { source: input.source } : {}),
    ...optionalObject('metadata', input.metadata)
  };
}

function normalizeResult(input: FrontierTestResultInput): FrontierTestResult {
  return {
    specId: normalizeId(input.specId, 'test result spec id'),
    status: input.status,
    durationMs: Math.max(0, Math.floor(input.durationMs ?? 0)),
    attempts: Math.max(1, Math.floor(input.attempts ?? 1)),
    patches: uniqueStrings(input.patches),
    effects: uniqueStrings(input.effects),
    routes: uniqueStrings((input.routes ?? []).concat(input.route ? [input.route] : [])),
    policies: uniqueStrings(input.policies),
    artifacts: uniqueStrings((input.artifacts ?? []).map(normalizeFilePath)),
    traceIds: uniqueStrings(input.traceIds),
    ...(input.error ? { error: input.error } : {}),
    ...optionalObject('metadata', input.metadata)
  };
}

function summarizeManifest(
  specs: readonly FrontierTestSpec[],
  fixtures: readonly FrontierTestFixture[],
  commands: readonly FrontierTestCommand[],
  coverageTargets: readonly string[],
  artifacts: readonly string[]
): FrontierTestSummary {
  return {
    specCount: specs.length,
    fixtureCount: fixtures.length,
    commandCount: commands.length,
    featureCount: uniqueStrings(specs.map((spec) => spec.feature)).length,
    coverCount: coverageTargets.length,
    actionCount: uniqueStrings(specs.flatMap((spec) => spec.actions)).length,
    effectCount: uniqueStrings(specs.flatMap((spec) => spec.effects.concat(spec.expect.effects))).length,
    routeCount: uniqueStrings(specs.flatMap((spec) => spec.routes.concat(spec.expect.routes))).length,
    policyCount: uniqueStrings(specs.flatMap((spec) => spec.policies.concat(spec.expect.policies))).length,
    workflowCount: uniqueStrings(specs.flatMap((spec) => spec.workflows)).length,
    migrationCount: uniqueStrings(specs.flatMap((spec) => spec.migrations)).length,
    statePathCount: uniqueStrings(specs.flatMap((spec) => spec.statePaths)).length,
    artifactCount: artifacts.length,
    fuzzSpecCount: specs.filter((spec) => spec.testKind === 'fuzz' || !!spec.fuzzer).length,
    benchmarkSpecCount: specs.filter((spec) => spec.testKind === 'benchmark' || !!spec.benchmark).length,
    replaySpecCount: specs.filter((spec) => spec.testKind === 'replay' || !!spec.replayOf).length
  };
}

function summarizeRun(results: readonly FrontierTestResult[]): FrontierTestRunSummary {
  const summary: FrontierTestRunSummary = { total: results.length, passed: 0, failed: 0, skipped: 0, todo: 0, flaky: 0, blocked: 0, unknown: 0, durationMs: 0 };
  for (const result of results) {
    summary.durationMs += result.durationMs;
    summary[result.status] += 1;
  }
  return summary;
}

function statusFromSummary(summary: FrontierTestRunSummary): FrontierTestStatus {
  if (summary.failed) return 'failed';
  if (summary.blocked) return 'blocked';
  if (summary.flaky) return 'flaky';
  if (summary.total === 0) return 'unknown';
  return 'passed';
}

function coverIdsOf(spec: FrontierTestSpec): string[] {
  return uniqueStrings(
    spec.covers
      .concat(spec.actions, spec.effects, spec.routes, spec.policies, spec.views, spec.workflows, spec.migrations, spec.resources)
      .concat(spec.statePaths.map((path) => 'path:' + path))
      .concat(spec.fuzzer ? ['fuzzer:' + spec.fuzzer] : [])
      .concat(spec.benchmark ? ['benchmark:' + spec.benchmark] : [])
  );
}

function matchesQuery(spec: FrontierTestSpec, input: FrontierTestQueryInput): boolean {
  if (input.ids && !input.ids.includes(spec.id)) return false;
  if (input.kinds && !input.kinds.includes(spec.testKind)) return false;
  if (input.covers && !overlaps(input.covers, coverIdsOf(spec))) return false;
  if (input.actions && !overlaps(input.actions, spec.actions)) return false;
  if (input.effects && !overlaps(input.effects, spec.effects.concat(spec.expect.effects))) return false;
  if (input.routes && !overlaps(input.routes, spec.routes.concat(spec.expect.routes))) return false;
  if (input.policies && !overlaps(input.policies, spec.policies.concat(spec.expect.policies))) return false;
  if (input.workflows && !overlaps(input.workflows, spec.workflows)) return false;
  if (input.migrations && !overlaps(input.migrations, spec.migrations)) return false;
  if (input.statePaths && !overlaps(input.statePaths, spec.statePaths)) return false;
  if (input.resources && !overlaps(input.resources, spec.resources)) return false;
  if (input.fixtures && !overlaps(input.fixtures, spec.fixtures.concat(spec.given.fixtures, spec.given.stateFixture ? [spec.given.stateFixture] : []))) return false;
  if (input.commands && !overlaps(input.commands, spec.commands)) return false;
  if (input.artifacts && !overlaps(input.artifacts, spec.artifacts.concat(spec.expect.artifacts))) return false;
  if (input.fuzzers && !input.fuzzers.includes(spec.fuzzer ?? '')) return false;
  if (input.benchmarks && !input.benchmarks.includes(spec.benchmark ?? '')) return false;
  if (input.views && !overlaps(input.views, spec.views)) return false;
  if (input.features && (!spec.feature || !input.features.includes(spec.feature))) return false;
  if (input.packages && (!spec.package || !input.packages.includes(spec.package))) return false;
  if (input.owners && !overlaps(input.owners, spec.owners)) return false;
  if (input.tags && !overlaps(input.tags, spec.tags)) return false;
  return true;
}

function registryEntryForSpec(manifest: FrontierTestManifest, spec: FrontierTestSpec): FrontierRegistryEntry {
  return {
    id: 'test-spec:' + spec.id,
    kind: spec.testKind,
    description: spec.description ?? spec.title,
    package: spec.package ?? manifest.package,
    feature: spec.feature ?? manifest.feature,
    owner: spec.owners[0] ?? manifest.owner,
    source: spec.source,
    reads: spec.sourceFiles.concat(spec.given.files, spec.fixtures, spec.statePaths, spec.resources),
    writes: spec.artifacts.concat(spec.expect.artifacts),
    calls: spec.commands.concat(spec.actions, spec.workflows, spec.migrations),
    dependsOn: spec.fixtures.concat(spec.commands),
    affects: coverIdsOf(spec),
    tags: spec.tags,
    metadata: {
      expectedPatches: spec.expect.patches,
      expectedEffects: spec.expect.effects,
      expectedRoutes: spec.expect.routes,
      expectedPolicies: spec.expect.policies
    }
  };
}

function impactEntries(manifest: FrontierTestManifest, specs: readonly FrontierTestSpec[]): FrontierRegistryEntry[] {
  const entries: FrontierRegistryEntry[] = [];
  if (specs.length) {
    entries.push({
      id: 'test-manifest:' + manifest.id,
      kind: 'test-manifest',
      package: manifest.package,
      feature: manifest.feature,
      owner: manifest.owner,
      reads: uniqueStrings(specs.flatMap((spec) => spec.sourceFiles)),
      writes: uniqueStrings(specs.flatMap((spec) => spec.artifacts.concat(spec.expect.artifacts))),
      tags: manifest.tags
    });
  }
  for (const spec of specs) entries.push(registryEntryForSpec(manifest, spec));
  return entries;
}

function impactEdges(specs: readonly FrontierTestSpec[]): FrontierRegistryEdge[] {
  const edges: FrontierRegistryEdge[] = [];
  for (const spec of specs) {
    for (const cover of coverIdsOf(spec)) edges.push({ from: 'test-spec:' + spec.id, to: cover, kind: 'covers' });
    for (const fixture of spec.fixtures.concat(spec.given.fixtures, spec.given.stateFixture ? [spec.given.stateFixture] : [])) edges.push({ from: 'test-spec:' + spec.id, to: 'test-fixture:' + fixture, kind: 'uses-fixture' });
    for (const command of spec.commands) edges.push({ from: 'test-spec:' + spec.id, to: 'test-command:' + command, kind: 'runs-command' });
  }
  return edges;
}

function seedIndexed(
  specsById: ReadonlyMap<string, FrontierTestSpec>,
  values: readonly string[] | undefined,
  seeds: Set<string>,
  touched: Set<string>,
  reasons: FrontierTestImpactReason[],
  reason: string
): void {
  for (const value of values ?? []) {
    seeds.add(value);
    if (specsById.has(value)) markTouched(touched, reasons, value, value, reason);
  }
}

function seedIndex(
  index: ReadonlyMap<string, readonly string[]>,
  values: readonly string[] | undefined,
  seeds: Set<string>,
  touched: Set<string>,
  reasons: FrontierTestImpactReason[],
  reason: string
): void {
  for (const value of values ?? []) {
    seeds.add(value);
    for (const specId of index.get(value) ?? []) markTouched(touched, reasons, specId, value, reason);
  }
}

function markTouched(touched: Set<string>, reasons: FrontierTestImpactReason[], specId: string, targetId: string | undefined, reason: string): void {
  touched.add(specId);
  reasons.push({ specId, ...(targetId ? { targetId } : {}), reason });
}

function hasImpactSelector(input: FrontierTestImpactInput): boolean {
  return Object.keys(input).some((key) => key !== 'expectedCoverage' && key !== 'limit' && key !== 'mode' && key !== 'now' && key !== 'metadata');
}

function specsForIds(specsById: ReadonlyMap<string, FrontierTestSpec>, ids: readonly string[]): FrontierTestSpec[] {
  const out: FrontierTestSpec[] = [];
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    const spec = specsById.get(id);
    if (spec) out.push(spec);
  }
  return out;
}

function compareSpecPriority(left: FrontierTestSpec, right: FrontierTestSpec): number {
  return right.priority - left.priority || left.id.localeCompare(right.id);
}

function priorityForKind(kind: string): number {
  if (kind === 'smoke' || kind === 'boundary' || kind === 'release') return 90;
  if (kind === 'fuzz' || kind === 'replay') return 80;
  if (kind === 'benchmark') return 70;
  return 50;
}

function reasonFor(reasons: readonly FrontierTestImpactReason[], id: string): string | undefined {
  return reasons.find((reason) => reason.specId === id)?.reason;
}

function uniqueReasons(reasons: readonly FrontierTestImpactReason[]): FrontierTestImpactReason[] {
  const seen = new Set<string>();
  const out: FrontierTestImpactReason[] = [];
  for (const reason of reasons) {
    const key = reason.specId + '\0' + (reason.targetId ?? '') + '\0' + reason.reason;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(reason);
  }
  return out;
}

function isTestManifest(value: unknown): value is FrontierTestManifest {
  return !!value && typeof value === 'object' && (value as { kind?: unknown }).kind === FRONTIER_TEST_MANIFEST_KIND;
}

function isCompiledTestManifest(value: unknown): value is FrontierCompiledTestManifest {
  return !!value && typeof value === 'object' && (value as { kind?: unknown }).kind === 'frontier.test.compiled';
}

function isRunPlan(value: unknown): value is FrontierTestRunPlan {
  return !!value && typeof value === 'object' && (value as { kind?: unknown }).kind === FRONTIER_TEST_RUN_PLAN_KIND;
}

function isTestRunRecord(value: unknown): value is FrontierTestRunRecord {
  return !!value && typeof value === 'object' && (value as { kind?: unknown }).kind === FRONTIER_TEST_RUN_KIND;
}

function cloneTestManifest(manifest: FrontierTestManifest): FrontierTestManifest {
  return cloneJson(manifest as unknown as JsonValue) as unknown as FrontierTestManifest;
}

function kindFromId(id: string): string {
  const index = id.indexOf(':');
  if (index > 0) return id.slice(0, index);
  const lower = id.toLowerCase();
  if (lower.includes('fuzz')) return 'fuzz';
  if (lower.includes('bench')) return 'benchmark';
  if (lower.includes('playwright') || lower.includes('e2e')) return 'playwright';
  if (lower.includes('policy')) return 'policy';
  if (lower.includes('workflow')) return 'workflow';
  if (lower.includes('migration')) return 'migration';
  if (lower.includes('boundary')) return 'boundary';
  return 'unit';
}

function titleFromId(id: string): string {
  const base = id.includes(':') ? id.slice(id.indexOf(':') + 1) : id;
  return base.split(/[._/-]+/g).filter(Boolean).map((part) => part.slice(0, 1).toUpperCase() + part.slice(1)).join(' ') || id;
}

function normalizeId(value: string, label: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) throw new TypeError(label + ' must be a non-empty string');
  return value.trim();
}

function normalizeFilePath(value: string): string {
  const trimmed = normalizeId(value, 'test file path').replace(/\\/g, '/');
  return trimmed.replace(/([^:])\/{2,}/g, '$1/').replace(/^\.\//, '');
}

function freezeMapLists(map: Map<string, string[]>): ReadonlyMap<string, readonly string[]> {
  for (const [key, value] of map) map.set(key, uniqueStrings(value));
  return map;
}

function pushMap(map: Map<string, string[]>, key: string, value: string): void {
  const list = map.get(key);
  if (list) {
    if (!list.includes(value)) list.push(value);
  } else {
    map.set(key, [value]);
  }
}

function pushSet(target: Set<string>, values: readonly string[]): void {
  for (const value of values) target.add(value);
}

function uniqueStrings(values: readonly (string | undefined)[] | undefined): string[] {
  const out: string[] = [];
  for (const value of values ?? []) {
    if (!value) continue;
    if (!out.includes(value)) out.push(value);
  }
  return out;
}

function overlaps(left: readonly string[], right: readonly string[]): boolean {
  for (const value of left) if (right.includes(value)) return true;
  return false;
}

function hasValues(value: readonly unknown[] | undefined): boolean {
  return Array.isArray(value) && value.length > 0;
}

function optionalObject(key: string, value: unknown): Record<string, JsonObject> {
  if (value === undefined) return {};
  const json = toJsonValue(value);
  return json && typeof json === 'object' && !Array.isArray(json) ? { [key]: json as JsonObject } : { [key]: { value: json } };
}

function toJsonObject(value: unknown): JsonObject {
  const json = toJsonValue(value);
  return json && typeof json === 'object' && !Array.isArray(json) ? json as JsonObject : { value: json };
}

function toJsonValue(value: unknown): JsonValue {
  if (value === undefined) return null;
  return JSON.parse(JSON.stringify(value)) as JsonValue;
}

function redactValue(value: unknown, redactions: readonly string[]): unknown {
  if (Array.isArray(value)) return value.map((item) => redactValue(item, redactions));
  if (!value || typeof value !== 'object') return value;
  const out: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    out[key] = redactions.some((pattern) => key.toLowerCase().includes(pattern.toLowerCase()))
      ? '[redacted]'
      : redactValue(entry, redactions);
  }
  return out;
}

function readNow(now?: number | (() => number)): number {
  return typeof now === 'function' ? now() : now ?? Date.now();
}

function escapeTapName(value: string): string {
  return value.replace(/\r?\n/g, ' ');
}

function xmlEscape(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function parseXmlAttrs(text: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /([A-Za-z_:][-A-Za-z0-9_:.]*)="([^"]*)"/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) attrs[match[1] ?? ''] = (match[2] ?? '').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  return attrs;
}

function stableHash(value: unknown): string {
  const text = stableStringify(value);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(stableStringify).join(',') + ']';
  const object = value as Record<string, unknown>;
  return '{' + Object.keys(object).sort().map((key) => JSON.stringify(key) + ':' + stableStringify(object[key])).join(',') + '}';
}
