const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const hooks = path.resolve(__dirname, '../.githooks').replaceAll('\\', '/');
const tempRoot = fs.realpathSync(os.tmpdir());
const sandbox = fs.mkdtempSync(path.join(tempRoot, 'ocungboss-git-guard-'));
function git(cwd, args, blocked = false) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (result.error) throw result.error;
  if (blocked) {
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Blocked:/);
  } else {
    assert.equal(result.status, 0, result.stderr);
  }
}
function init(name) {
  const repo = path.join(sandbox, name);
  fs.mkdirSync(repo);
  git(repo, ['init', '--initial-branch=main', '--template=']);
  git(repo, ['config', 'user.name', 'Local Guard Test']);
  git(repo, ['config', 'user.email', 'test@example.invalid']);
  return repo;
}
try {
  const remote = path.join(sandbox, 'remote.git');
  git(sandbox, ['init', '--bare', '--template=', remote]);
  const repo = init('safe');
  git(repo, ['config', 'core.hooksPath', hooks]);
  fs.writeFileSync(path.join(repo, 'README.md'), 'Public test\n');
  fs.writeFileSync(path.join(repo, '.gitignore'), '/docs/\n/design/\n');
  git(repo, ['add', 'README.md', '.gitignore']);
  git(repo, ['commit', '-m', 'Public test']);
  git(repo, ['push', remote, 'main']);
  for (const [index, file] of [
    'docs/probe.txt',
    'design/stitch/assets/probe.txt',
    'DOCS/upper.txt',
    'DESIGN/stitch/assets/upper.txt',
  ].entries()) {
    fs.mkdirSync(path.dirname(path.join(repo, file)), { recursive: true });
    fs.writeFileSync(path.join(repo, file), 'Fake local-only data\n');
    git(repo, ['add', '--force', '--', file]);
    git(repo, ['commit', '-m', 'Must be blocked'], true);
    git(repo, ['restore', '--staged', '--', file]);

    // Build old history before installing hooks, including a later deletion.
    const old = init('old-' + index);
    fs.mkdirSync(path.dirname(path.join(old, file)), { recursive: true });
    fs.writeFileSync(path.join(old, file), 'Fake historical data\n');
    git(old, ['add', '--', file]);
    git(old, ['commit', '-m', 'Old local-only data']);
    git(old, ['rm', '--', file]);
    git(old, ['commit', '-m', 'Remove local-only data']);
    git(old, ['config', 'core.hooksPath', hooks]);
    git(old, ['push', remote, 'main:refs/heads/' + path.basename(old)], true);
  }
  console.log('PASS: public commit/push allowed; forced docs/assets commits and historical uploads blocked.');
} finally {
  const resolved = fs.realpathSync(sandbox);
  assert.equal(path.dirname(resolved), tempRoot);
  assert.ok(path.basename(resolved).startsWith('ocungboss-git-guard-'));
  fs.rmSync(resolved, { recursive: true, force: true });
}
