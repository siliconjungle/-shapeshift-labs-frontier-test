import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readmePath = path.join(packageDir, 'README.md');
const check = process.argv.includes('--check');
const text = fs.readFileSync(readmePath, 'utf8');
const required = [
  '# @shapeshift-labs/frontier-test',
  '## Related Packages',
  '## Install',
  '## Example',
  '## Surface',
  '## Test Evidence Boundary',
  '## Benchmarks',
  'npm run bench',
  'Frontier-only package measurements',
  '@shapeshift-labs/frontier-test',
  '@shapeshift-labs/frontier-playwright',
  '@shapeshift-labs/frontier-tools',
  '@shapeshift-labs/frontier-workflow',
  '@shapeshift-labs/frontier-policy',
  '@shapeshift-labs/frontier-manifest'
];

const missing = required.filter((entry) => !text.includes(entry));
if (missing.length) {
  console.error('README missing required text:');
  for (const entry of missing) console.error('- ' + entry);
  process.exit(1);
}

if (!check) console.log('frontier-test README sections ok');
