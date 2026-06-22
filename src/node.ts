/// <reference types="node" />

import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { JsonObject } from '@shapeshift-labs/frontier';
import {
  recordTestGateExecution,
  summarizeTestGateExecutions,
  type FrontierTestGateArtifactInput,
  type FrontierTestGateArtifactRecord,
  type FrontierTestGateEvidenceSummary,
  type FrontierTestGateExecutionKind,
  type FrontierTestGateExecutionRecord
} from './index.js';

export const FRONTIER_TEST_NODE_GATE_EXECUTIONS_FILE = 'gate-executions.jsonl';
export const FRONTIER_TEST_NODE_GATE_SUMMARY_FILE = 'gate-summary.json';

export interface FrontierTestNodeGateInput {
  id: string;
  kind?: FrontierTestGateExecutionKind;
  command: string | readonly string[];
  args?: readonly string[];
  cwd?: string;
  env?: Record<string, string | number | boolean | null | undefined>;
  envKeys?: readonly string[];
  required?: boolean;
  timeoutMs?: number;
  maxOutputBytes?: number;
  tailLines?: number;
  artifacts?: readonly (string | FrontierTestGateArtifactInput)[];
  package?: string;
  packageScope?: readonly string[];
  attempt?: number;
  maxAttempts?: number;
  shell?: boolean;
  metadata?: unknown;
}

export interface FrontierTestNodeGateResult {
  ok: boolean;
  timedOut: boolean;
  execution: FrontierTestGateExecutionRecord;
}

export interface FrontierTestNodeGateSuiteInput {
  gates: readonly FrontierTestNodeGateInput[];
  outDir?: string;
  stopOnRequiredFailure?: boolean;
  packageScope?: readonly string[];
  artifacts?: readonly string[];
}

export interface FrontierTestNodeGateSuiteFiles {
  gateExecutionsPath: string;
  gateSummaryPath: string;
}

export interface FrontierTestNodeGateSuiteResult {
  ok: boolean;
  executions: FrontierTestGateExecutionRecord[];
  summary: FrontierTestGateEvidenceSummary;
  files?: FrontierTestNodeGateSuiteFiles;
}

export async function runTestGateCommand(input: FrontierTestNodeGateInput): Promise<FrontierTestNodeGateResult> {
  const startedAt = Date.now();
  const cwd = path.resolve(input.cwd ?? process.cwd());
  const command = normalizeNodeGateCommand(input.command, input.args);
  if (!command.length) throw new TypeError('frontier-test node gate command is empty');
  const timeoutMs = input.timeoutMs !== undefined ? Math.max(1, Math.floor(input.timeoutMs)) : undefined;
  const maxOutputBytes = Math.max(1024, Math.floor(input.maxOutputBytes ?? 64 * 1024));
  const tailLines = Math.max(1, Math.floor(input.tailLines ?? 80));
  const env = createGateEnv(input.env);
  const envKeys = uniqueStrings([...(input.envKeys ?? []), ...Object.keys(input.env ?? {})].filter((key) => input.env?.[key] !== undefined && input.env?.[key] !== null));
  const stdout = new BoundedText(maxOutputBytes);
  const stderr = new BoundedText(maxOutputBytes);
  let timedOut = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const result = await new Promise<{ code?: number | null; signal?: string | null; error?: Error }>((resolve) => {
    let settled = false;
    const finish = (value: { code?: number | null; signal?: string | null; error?: Error }): void => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      resolve(value);
    };
    const child = input.shell
      ? spawn(command.join(' '), { cwd, env, shell: true })
      : spawn(command[0] ?? '', command.slice(1), { cwd, env, shell: false });
    child.stdout?.on('data', (chunk: Buffer) => stdout.push(chunk));
    child.stderr?.on('data', (chunk: Buffer) => stderr.push(chunk));
    child.once('error', (error) => finish({ error }));
    child.once('close', (code, signal) => finish({ code, signal }));
    if (timeoutMs !== undefined) {
      timer = setTimeout(() => {
        timedOut = true;
        child.kill('SIGTERM');
      }, timeoutMs);
    }
  });
  const finishedAt = Date.now();
  const stdoutTail = tailText(stdout.text(), tailLines);
  const stderrTail = tailText(stderr.text(), tailLines);
  const status = result.error || timedOut ? 'blocked' : result.code === 0 ? 'passed' : 'failed';
  const message = gateMessage({ id: input.id, status, code: result.code, signal: result.signal, error: result.error, timedOut, timeoutMs });
  const artifacts = await normalizeNodeGateArtifacts(input.artifacts, cwd);
  const execution = recordTestGateExecution({
    id: input.id,
    kind: input.kind ?? inferNodeGateKind(command),
    status,
    rawStatus: rawGateStatus({ code: result.code, signal: result.signal, error: result.error, timedOut }),
    required: input.required,
    startedAt,
    finishedAt,
    attempt: input.attempt,
    maxAttempts: input.maxAttempts,
    command,
    cwd,
    envKeys,
    ...(typeof result.code === 'number' ? { exitCode: result.code } : {}),
    ...(result.signal ? { signal: result.signal } : {}),
    stdoutTail,
    stderrTail,
    failureTail: status === 'passed' ? [] : (stderrTail.length ? stderrTail : stdoutTail.concat(message)),
    artifacts,
    package: input.package,
    packageScope: input.packageScope,
    message,
    replay: {
      command,
      cwd,
      envKeys,
      metadata: {
        source: 'frontier-test.node-gate-runner',
        shell: input.shell === true,
        ...(timeoutMs !== undefined ? { timeoutMs } : {})
      }
    },
    metadata: mergeMetadata({
      source: 'frontier-test.node-gate-runner',
      shell: input.shell === true,
      timedOut,
      ...(timeoutMs !== undefined ? { timeoutMs } : {})
    }, input.metadata)
  });
  return { ok: execution.status === 'passed' || (!execution.required && execution.status !== 'blocked'), timedOut, execution };
}

export async function runTestGateSuite(input: FrontierTestNodeGateSuiteInput): Promise<FrontierTestNodeGateSuiteResult> {
  const executions: FrontierTestGateExecutionRecord[] = [];
  for (const gate of input.gates) {
    const result = await runTestGateCommand(gate);
    executions.push(result.execution);
    if (input.stopOnRequiredFailure && result.execution.required && result.execution.status !== 'passed') break;
  }
  const summary = summarizeTestGateExecutions({
    executions,
    packageScope: input.packageScope,
    artifacts: input.artifacts
  });
  const requiredFailures = executions.filter((execution) => execution.required && (execution.status === 'failed' || execution.status === 'blocked' || execution.status === 'unknown'));
  const result: FrontierTestNodeGateSuiteResult = {
    ok: requiredFailures.length === 0,
    executions,
    summary
  };
  if (input.outDir) result.files = await writeTestGateSuiteEvidence(input.outDir, result);
  return result;
}

export async function writeTestGateSuiteEvidence(outDir: string, result: Pick<FrontierTestNodeGateSuiteResult, 'executions' | 'summary'>): Promise<FrontierTestNodeGateSuiteFiles> {
  const root = path.resolve(outDir);
  await fs.mkdir(root, { recursive: true });
  const gateExecutionsPath = path.join(root, FRONTIER_TEST_NODE_GATE_EXECUTIONS_FILE);
  const gateSummaryPath = path.join(root, FRONTIER_TEST_NODE_GATE_SUMMARY_FILE);
  await fs.writeFile(gateExecutionsPath, result.executions.map((execution) => JSON.stringify(execution)).join('\n') + (result.executions.length ? '\n' : ''));
  await fs.writeFile(gateSummaryPath, JSON.stringify(result.summary, null, 2) + '\n');
  return { gateExecutionsPath, gateSummaryPath };
}

function normalizeNodeGateCommand(command: string | readonly string[], args?: readonly string[]): string[] {
  const parts = typeof command === 'string'
    ? splitCommand(command)
    : command.map((part) => String(part)).filter(Boolean);
  return parts.concat((args ?? []).map((part) => String(part)).filter(Boolean));
}

function splitCommand(command: string): string[] {
  return command.trim().split(/\s+/g).filter(Boolean);
}

function inferNodeGateKind(command: readonly string[]): FrontierTestGateExecutionKind {
  const text = command.join(' ').toLowerCase();
  if (text.includes('playwright') || text.includes('browser')) return 'browser';
  if (text.includes('fuzz')) return 'fuzz';
  if (text.includes('oracle')) return 'oracle';
  if (text.includes('smoke')) return 'smoke';
  if (text.includes('build') || text.includes('typecheck')) return 'build';
  if (text.includes('test')) return 'test';
  return 'test';
}

function createGateEnv(env: FrontierTestNodeGateInput['env']): NodeJS.ProcessEnv {
  const next: NodeJS.ProcessEnv = { ...process.env };
  for (const [key, value] of Object.entries(env ?? {})) {
    if (value === undefined || value === null) continue;
    next[key] = String(value);
  }
  return next;
}

async function normalizeNodeGateArtifacts(input: FrontierTestNodeGateInput['artifacts'], cwd: string): Promise<FrontierTestGateArtifactRecord[]> {
  const artifacts: FrontierTestGateArtifactRecord[] = [];
  const seen = new Set<string>();
  for (const artifact of input ?? []) {
    const record = typeof artifact === 'string'
      ? { path: artifact }
      : { ...artifact };
    if (!record.path || seen.has(record.path)) continue;
    seen.add(record.path);
    const withStats = await addArtifactStats(record, cwd);
    artifacts.push(withStats);
  }
  return artifacts;
}

async function addArtifactStats(input: FrontierTestGateArtifactInput, cwd: string): Promise<FrontierTestGateArtifactRecord> {
  const record: FrontierTestGateArtifactRecord = {
    path: input.path,
    ...(input.kind ? { kind: input.kind } : {}),
    ...(input.role ? { role: input.role } : {}),
    ...(input.bytes !== undefined ? { bytes: input.bytes } : {}),
    ...(input.sha256 ? { sha256: input.sha256 } : {}),
    ...(input.mimeType ? { mimeType: input.mimeType } : {}),
    ...(input.metadata ? { metadata: jsonObject(input.metadata) } : {})
  };
  if (record.bytes !== undefined) return record;
  try {
    const stat = await fs.stat(path.isAbsolute(record.path) ? record.path : path.join(cwd, record.path));
    if (stat.isFile()) record.bytes = stat.size;
  } catch {
    // Missing artifacts are still useful evidence paths; the gate status carries pass/fail.
  }
  return record;
}

function gateMessage(input: { id: string; status: string; code?: number | null; signal?: string | null; error?: Error; timedOut: boolean; timeoutMs?: number }): string {
  if (input.error) return `gate ${input.id} could not start: ${input.error.message}`;
  if (input.timedOut) return `gate ${input.id} timed out after ${input.timeoutMs ?? 0}ms`;
  if (input.status === 'passed') return `gate ${input.id} passed`;
  if (input.signal) return `gate ${input.id} ended with signal ${input.signal}`;
  return `gate ${input.id} exited with code ${input.code ?? 'unknown'}`;
}

function rawGateStatus(input: { code?: number | null; signal?: string | null; error?: Error; timedOut: boolean }): string {
  if (input.error) return 'spawn-error';
  if (input.timedOut) return 'timeout';
  if (input.signal) return `signal:${input.signal}`;
  return `exit:${input.code ?? 'unknown'}`;
}

function tailText(text: string, lines: number): string[] {
  if (!text) return [];
  const parts = text.replace(/\r\n/g, '\n').split('\n');
  while (parts.length && parts[parts.length - 1] === '') parts.pop();
  return parts.slice(-lines);
}

function uniqueStrings(values: readonly unknown[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    const text = String(value ?? '').trim();
    if (!text || seen.has(text)) continue;
    seen.add(text);
    out.push(text);
  }
  return out;
}

function jsonObject(value: unknown): JsonObject {
  const json = JSON.parse(JSON.stringify(value ?? {}));
  return json && typeof json === 'object' && !Array.isArray(json) ? json as JsonObject : { value: json };
}

function mergeMetadata(base: JsonObject, extra: unknown): JsonObject {
  const normalized = jsonObject(extra);
  return Object.keys(normalized).length ? { ...base, ...normalized } : base;
}

class BoundedText {
  private value = '';

  constructor(private readonly maxBytes: number) {}

  push(chunk: Buffer): void {
    this.value += chunk.toString('utf8');
    if (this.value.length > this.maxBytes) this.value = this.value.slice(-this.maxBytes);
  }

  text(): string {
    return this.value;
  }
}
