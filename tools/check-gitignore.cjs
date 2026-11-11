const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');

const mustIgnore = [
  '.tools/serena-runtime/python.exe',
  '.serena/cache/symbols.db',
  '.serena/logs/mcp.log',
  '.solidlsp/index.json',
  'docs/TASKS.md',
  'design/stitch/01-home.html',
  'node_modules/next/package.json',
  'apps/web/node_modules/',
  '.pnpm-store/v3/files/00/deadbeef',
  '.next/server/app/page.js',
  'apps/web/.next/static/chunks/main.js',
  'apps/web/out/index.html',
  'dist/main.js',
  'apps/api/dist/main.js',
  'build/output.js',
  'coverage/lcov.info',
  'apps/web/tsconfig.tsbuildinfo',
  '.turbo/cache/meta.json',
  '.eslintcache',
  '.cache/probe.bin',
  'playwright-report/index.html',
  'test-results/smoke-retry1/trace.zip',
  'blob-report/report.zip',
  'playwright/.cache/metainfo.json',
  'playwright/.auth/admin.json',
  'apps/web/AGENTS.md',
  '.env',
  '.env.local',
  '.env.development.local',
  '.env.production',
  '.env.test',
  'apps/web/.env',
  'apps/web/.env.local',
  'apps/api/.env.production',
  'auth.json',
  'apps/web/auth.json',
  'credentials.json',
  'gcp-service-account.json',
  'config/firebase-service-account-prod.json',
  '.npmrc',
  'apps/web/.npmrc',
  'certs/server.pem',
  'certs/private.key',
  'certs/client.p12',
  'certs/identity.pfx',
  'certs/ca.crt',
  'certs/leaf.cer',
  'certs/cert.der',
  'certs/request.csr',
  'certs/keystore.jks',
  'certs/prod.keystore',
  'id_rsa',
  'id_rsa.pub',
  'id_ed25519',
  'keys/id_ecdsa',
  'keys/id_dsa',
  'backup.sql',
  'db/ocungboss.sql.gz',
  'db/ocungboss.sql.bz2',
  'db/ocungboss.sql.xz',
  'db/ocungboss.sql.zst',
  'db/prod.dump',
  'db/users.bak',
  'local.sqlite',
  'local.sqlite3',
  'dev.db',
  'dev.db-shm',
  'dev.db-wal',
  'dumps/user-dump-2026.json',
  'backups/mysql-20261110.tar',
  'logs/app.txt',
  'error.log',
  'apps/api/debug.log',
  'npm-debug.log.0',
  'pnpm-debug.log',
  'yarn-debug.log',
  'yarn-error.log',
  'uploads/pets/avatar-user-1.jpg',
  'apps/api/uploads/medical/record.pdf',
  'storage/private/vet-note.pdf',
  'private-media/pet-1/vaccine.png',
  '.DS_Store',
  'Thumbs.db',
  'Desktop.ini',
];

const mustTrack = [
  'README.md',
  'AGENTS.md',
  '.gitignore',
  '.editorconfig',
  '.gitattributes',
  '.githooks/pre-commit',
  '.githooks/pre-push',
  '.env.example',
  '.env.sample',
  '.env.template',
  'apps/web/.env.example',
  'apps/web/.env.sample',
  'apps/web/.env.template',
  'apps/api/.env.example',
  'package.json',
  'pnpm-workspace.yaml',
  'pnpm-lock.yaml',
  'apps/web/package.json',
  'apps/web/tsconfig.json',
  'apps/web/next.config.ts',
  'apps/web/app/layout.tsx',
  'apps/web/app/page.tsx',
  'apps/web/components/Button.tsx',
  'apps/web/lib/fixtures/pets.ts',
  'apps/api/package.json',
  'apps/api/src/main.ts',
  'apps/api/prisma/schema.prisma',
  'tools/check-gitignore.cjs',
  'tools/check-local-only-hooks.cjs',
  'tools/check_serena.py',
  'tools/serena_mcp.py',
  'tools/serena.mcp.json',
  '.serena/project.yml',
];

const allProbes = [...mustIgnore, ...mustTrack];
const res = spawnSync('git', ['check-ignore', '--no-index', '--stdin'], {
  cwd: root,
  input: `${allProbes.join('\n')}\n`,
  encoding: 'utf8',
});
if (res.error) throw res.error;
assert(res.status === 0 || res.status === 1, `git check-ignore failed (${res.status}): ${res.stderr}`);

const ignoredSet = new Set(
  res.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean),
);

for (const candidate of mustIgnore) {
  assert(ignoredSet.has(candidate), `Expected path to be ignored by .gitignore: ${candidate}`);
}

for (const candidate of mustTrack) {
  assert(!ignoredSet.has(candidate), `Expected path NOT to be ignored by .gitignore: ${candidate}`);
}

console.log(
  `PASS: ${mustIgnore.length} sensitive/build/local-only probe paths ignored; ${mustTrack.length} source/config/env-template probe paths remain trackable.`,
);
