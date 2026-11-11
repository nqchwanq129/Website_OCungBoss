const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const publicDirectories = ['apps/web', 'e2e'];
const publicFiles = [
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'playwright.config.ts',
  'tools/check-frontend-secrets.cjs',
];
const extensions = new Set(['.cjs', '.css', '.js', '.json', '.mjs', '.ts', '.tsx', '.yaml', '.yml']);
const excludedDirectories = new Set(['.next', 'node_modules']);
const excludedFiles = new Set(['tsconfig.tsbuildinfo']);
const rules = [
  ['private-key', /-----BEGIN (?:[A-Z]+ )?PRIVATE KEY-----/g],
  ['github-token', /\bgh[pousr]_[A-Za-z0-9]{30,}\b/g],
  ['aws-access-key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
  ['google-api-key', /\bAIza[0-9A-Za-z_-]{35}\b/g],
  ['slack-token', /\bxox[baprs]-[0-9A-Za-z-]{10,}\b/g],
  [
    'assigned-secret',
    /\b(?:api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret|password|secret)\b\s*[:=]\s*["'][^\s"']{8,}["']/gi,
  ],
];

function findSecrets(content) {
  const findings = [];

  for (const [rule, pattern] of rules) {
    pattern.lastIndex = 0;
    for (const match of content.matchAll(pattern)) {
      findings.push({
        line: content.slice(0, match.index).split('\n').length,
        rule,
      });
    }
  }

  return findings;
}

function collectFiles(relativePath) {
  const absolutePath = path.join(root, relativePath);
  const stat = fs.lstatSync(absolutePath);

  if (stat.isSymbolicLink()) return [];
  if (stat.isFile()) {
    return extensions.has(path.extname(relativePath)) && !excludedFiles.has(path.basename(relativePath))
      ? [relativePath]
      : [];
  }

  return fs
    .readdirSync(absolutePath, { withFileTypes: true })
    .filter((entry) => !excludedDirectories.has(entry.name))
    .flatMap((entry) => collectFiles(path.join(relativePath, entry.name)));
}

function runSelfTest() {
  const fake = ['ghp', '_abcdefghijklmnopqrstuvwxyz1234567890'].join('');
  const findings = findSecrets(`const credential = "${fake}";`);
  assert.equal(
    findings.some(({ rule }) => rule === 'github-token'),
    true,
  );
  const output = findings.map(({ rule }) => rule).join('\n');
  assert.equal(output.includes(fake), false);
  console.log('Secret scan self-test PASS: finding detected and value masked.');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
  process.exit(0);
}

const files = [...publicDirectories, ...publicFiles].flatMap(collectFiles).sort();
const findings = files.flatMap((file) =>
  findSecrets(fs.readFileSync(path.join(root, file), 'utf8')).map((finding) => ({
    ...finding,
    file: file.replaceAll(path.sep, '/'),
  })),
);

if (findings.length > 0) {
  for (const { file, line, rule } of findings) {
    console.error(`${file}:${line} [${rule}] possible secret (value masked)`);
  }
  console.error(`Secret scan FAIL: ${findings.length} finding(s).`);
  process.exit(1);
}

console.log(`Secret scan PASS: ${files.length} public frontend file(s), 0 findings.`);
