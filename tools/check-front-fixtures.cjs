'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('../apps/web/node_modules/typescript');

const repoRoot = path.resolve(__dirname, '..');
const fixturesPath = path.join(repoRoot, 'apps', 'web', 'lib', 'fixtures.ts');
const playgroundPath = path.join(repoRoot, 'apps', 'web', 'app', 'preview', 'FixturePlayground.tsx');
const previewPagePath = path.join(repoRoot, 'apps', 'web', 'app', 'preview', 'page.tsx');
const fixturesSource = fs.readFileSync(fixturesPath, 'utf8');

function loadFixturesModule() {
  const transpiled = ts.transpileModule(fixturesSource, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      strict: true,
    },
    fileName: fixturesPath,
  });

  const mod = { exports: {} };
  const context = vm.createContext({
    exports: mod.exports,
    module: mod,
    require,
  });
  new vm.Script(transpiled.outputText, { filename: fixturesPath }).runInContext(context);
  return mod.exports;
}

const fixtures = loadFixturesModule();

// 1. Kiểm tra đủ 8 actors và tên miền .test giả, không lộ mật khẩu/token/secret
const expectedActors = ['G', 'U0', 'UA', 'UB', 'AP', 'AM', 'UL', 'UD'];
assert.deepEqual(Object.keys(fixtures.FIXTURE_ACTORS), expectedActors);
for (const id of expectedActors) {
  const actor = fixtures.FIXTURE_ACTORS[id];
  if (actor.email !== null) {
    assert.match(actor.email, /@ocungboss\.test$/);
  }
  assert.equal('password' in actor, false);
  assert.equal('token' in actor, false);
  assert.equal('mfaSecret' in actor, false);
}

// 2. Kiểm tra 12 capabilities, pet PA/PB, nội dung PUB/DRAFT/HID, version V1/V2
assert.equal(fixtures.ALL_UI_CAPABILITIES.length, 12);
assert.equal(fixtures.FIXTURE_ACTORS.AM.capabilities.length, 12);
assert.equal(fixtures.FIXTURE_ACTORS.AP.capabilities.length, 0);
assert.equal(fixtures.FIXTURE_PETS.PA.ownerId, 'UA');
assert.equal(fixtures.FIXTURE_PETS.PB.ownerId, 'UB');
assert.equal(fixtures.FIXTURE_ARTICLES.PUB.status, 'published');
assert.equal(fixtures.FIXTURE_ARTICLES.DRAFT.status, 'draft');
assert.equal(fixtures.FIXTURE_ARTICLES.HID.status, 'archived');
assert.equal(fixtures.FIXTURE_VERSIONS.V1.isStale, true);
assert.equal(fixtures.FIXTURE_VERSIONS.V2.isStale, false);

// 3. Kiểm tra ranh giới quyền đọc (State S) và chống IDOR / leo thang đặc quyền
assert.equal(
  fixtures.resolveReadScenario({ mode: 'normal', actorId: 'G', targetKind: 'public_content' }).status,
  'ready',
);
assert.equal(
  fixtures.resolveReadScenario({ mode: 'normal', actorId: 'G', targetKind: 'draft_content' }).status,
  'not_found',
);
assert.equal(
  fixtures.resolveReadScenario({ mode: 'normal', actorId: 'G', targetKind: 'hidden_content' }).status,
  'removed',
);
assert.equal(fixtures.resolveReadScenario({ mode: 'normal', actorId: 'UA', targetKind: 'pet_PA' }).status, 'ready');
assert.equal(fixtures.resolveReadScenario({ mode: 'normal', actorId: 'UB', targetKind: 'pet_PA' }).status, 'not_found');
assert.equal(
  fixtures.resolveReadScenario({ mode: 'normal', actorId: 'AM', targetKind: 'pet_PA' }).status,
  'not_found',
  'ADMIN (AM) không được tự đọc hồ sơ thú cưng riêng PA của UA',
);
assert.equal(
  fixtures.resolveReadScenario({ mode: 'normal', actorId: 'AP', targetKind: 'admin_module' }).status,
  'forbidden',
  'ADMIN mới qua bước 1 (AP) chưa qua MFA phải bị chặn khỏi /admin/*',
);
assert.equal(
  fixtures.resolveReadScenario({ mode: 'normal', actorId: 'AM', targetKind: 'admin_module' }).status,
  'ready',
);

// 4. Kiểm tra các chế độ dữ liệu đọc: normal, empty, long, slow, error
assert.equal(fixtures.resolveReadScenario({ mode: 'empty', actorId: 'UA', targetKind: 'pet_PA' }).status, 'empty');
const longScenario = fixtures.resolveReadScenario({ mode: 'long', actorId: 'UA', targetKind: 'pet_PA' });
assert.equal(longScenario.status, 'ready');
assert.equal(longScenario.wideTableHeaders.length, 8);
const slowScenario = fixtures.resolveReadScenario({ mode: 'slow', actorId: 'UA', targetKind: 'pet_PA' });
assert.equal(slowScenario.status, 'loading');
assert.equal(slowScenario.simulatedDelayMs > 0, true);
const errorScenario = fixtures.resolveReadScenario({ mode: 'error', actorId: 'UA', targetKind: 'pet_PA' });
assert.equal(errorScenario.status, 'error');
assert.equal(errorScenario.canRetry, true);

// 5. Kiểm tra 7 thao tác tương tác (State M): thêm, sửa, xóa, lưu, chat, upload, export
const allActions = ['create', 'update', 'delete', 'save', 'chat', 'upload', 'export'];
assert.deepEqual(Object.keys(fixtures.INTERACTIVE_ACTION_LABELS), allActions);

for (const action of allActions) {
  const okResult = fixtures.simulateInteractiveAction({
    action,
    actorId: 'UA',
    targetKind: 'pet_PA',
    baseVersion: 'V2',
    outcomeMode: 'success',
    draftValue: 'Bản nháp kiểm thử',
    committedValue: 'Giá trị cũ',
  });
  assert.equal(okResult.state, 'success', `Action ${action} phải trả success với chủ sở hữu hợp lệ`);
}

// Kiểm tra lỗi giữ nguyên bản nháp và không ghi đè dữ liệu cũ
const errorMutation = fixtures.simulateInteractiveAction({
  action: 'save',
  actorId: 'UA',
  targetKind: 'pet_PA',
  baseVersion: 'V2',
  outcomeMode: 'error',
  draftValue: 'Nháp quan trọng không được mất',
  committedValue: 'Giá trị đã lưu V2',
});
assert.equal(errorMutation.state, 'error');
assert.equal(errorMutation.preservedDraft, 'Nháp quan trọng không được mất');
assert.equal(errorMutation.committedValue, 'Giá trị đã lưu V2');

// Kiểm tra xung đột V1 -> V2 giữ nguyên bản nháp
const conflictMutation = fixtures.simulateInteractiveAction({
  action: 'update',
  actorId: 'UA',
  targetKind: 'pet_PA',
  baseVersion: 'V1',
  outcomeMode: 'success',
  draftValue: 'Nháp đang sửa trên V1',
  committedValue: 'Giá trị V2 mới hơn',
});
assert.equal(conflictMutation.state, 'conflict');
assert.equal(conflictMutation.preservedDraft, 'Nháp đang sửa trên V1');
assert.equal(conflictMutation.nextVersion, 'V2');

// Kiểm tra xóa pet mặc định tự gỡ defaultPetId
const deletePetResult = fixtures.simulateInteractiveAction({
  action: 'delete',
  actorId: 'UA',
  targetKind: 'pet_PA',
  baseVersion: 'V2',
  outcomeMode: 'success',
  draftValue: '',
  committedValue: 'PA',
});
assert.equal(deletePetResult.state, 'success');
assert.equal(deletePetResult.nextDefaultPetId, null);

// Kiểm tra chặn upload tệp sai MIME và kill-switch AI
const badUpload = fixtures.simulateInteractiveAction({
  action: 'upload',
  actorId: 'UA',
  targetKind: 'pet_PA',
  baseVersion: 'V2',
  outcomeMode: 'success',
  draftValue: 'Ghi chú đính kèm',
  committedValue: 'Chưa có tệp',
  uploadFile: {
    fileName: 'malware.exe',
    mimeType: 'application/x-msdownload',
    sizeBytes: 1024,
    kind: 'private-document',
  },
});
assert.equal(badUpload.state, 'error');
assert.equal(badUpload.businessState, 'quarantined');

const killedChat = fixtures.simulateInteractiveAction({
  action: 'chat',
  actorId: 'UA',
  targetKind: 'pet_PA',
  baseVersion: 'V2',
  outcomeMode: 'success',
  draftValue: 'Chó bỏ ăn phải làm sao?',
  committedValue: '',
  aiKillSwitchEnabled: true,
});
assert.equal(killedChat.state, 'error');
assert.equal(killedChat.businessState, 'disabled');
assert.equal(killedChat.preservedDraft, 'Chó bỏ ăn phải làm sao?');

// 6. Kiểm tra đủ 74 mã ca P01–Q01 và cấu trúc UI/a11y của trang /preview
assert.equal(fixtures.FRONTEND_CASE_FIXTURES.length, 74);
assert.equal(fixtures.FRONTEND_CASE_FIXTURES[0].code, 'P01');
assert.equal(fixtures.FRONTEND_CASE_FIXTURES[73].code, 'Q01');
assert.equal(fs.existsSync(playgroundPath), true);
assert.equal(fs.existsSync(previewPagePath), true);

const playgroundSource = fs.readFileSync(playgroundPath, 'utf8');
const previewPageSource = fs.readFileSync(previewPagePath, 'utf8');

// Đảm bảo có đủ label htmlFor khớp id cho các control tương tác trên /preview
for (const controlId of [
  'actor-select',
  'target-select',
  'read-mode-select',
  'capability-select',
  'version-select',
  'outcome-select',
  'upload-preset-select',
  'export-status-select',
  'ai-kill-switch',
  'draft-input',
  'case-area-filter',
]) {
  assert.match(playgroundSource, new RegExp(`htmlFor="${controlId}"`), `Thiếu label htmlFor cho ${controlId}`);
  assert.match(playgroundSource, new RegExp(`id="${controlId}"`), `Thiếu id="${controlId}"`);
}

// Đảm bảo landmark semantic và cảnh báo dữ liệu minh họa + miễn trừ thú y
assert.match(previewPageSource, /<header className="shell-header">/);
assert.match(previewPageSource, /<main id="main-content"/);
assert.match(previewPageSource, /<footer className="shell-footer">/);
assert.match(previewPageSource, /Miễn trừ trách nhiệm thú y/);
assert.match(playgroundSource, /Chế độ Preview Dữ liệu ảo \(Local Fixture\):/);

// Đảm bảo không dùng localStorage để lưu mật khẩu/token/dữ liệu nhạy cảm
assert.equal(playgroundSource.includes('localStorage'), false);
assert.equal(fixturesSource.includes('localStorage'), false);

console.log('FRONT_FIXTURES_CHECK_OK: actors=8 capabilities=12 cases=74 actions=7 states=verified a11y_controls=11');
