import test from 'node:test';
import assert from 'node:assert/strict';

import { resolveReadScenario, simulateInteractiveAction } from './fixtures.ts';

test("owner boundary hides another user's private pet data", () => {
  const owner = resolveReadScenario({ mode: 'normal', actorId: 'UA', targetKind: 'pet_PA' });
  const otherUser = resolveReadScenario({ mode: 'normal', actorId: 'UB', targetKind: 'pet_PA' });

  assert.equal(owner.status, 'ready');
  assert.equal(otherUser.status, 'not_found');
  assert.equal(otherUser.items.length, 0);
});

test('admin must complete MFA before reading admin modules', () => {
  assert.equal(resolveReadScenario({ mode: 'normal', actorId: 'AP', targetKind: 'admin_module' }).status, 'forbidden');
  assert.equal(resolveReadScenario({ mode: 'normal', actorId: 'AM', targetKind: 'admin_module' }).status, 'ready');
});

test('version conflict preserves the draft and advances the stale version', () => {
  const result = simulateInteractiveAction({
    action: 'update',
    actorId: 'UA',
    targetKind: 'pet_PA',
    baseVersion: 'V1',
    outcomeMode: 'success',
    draftValue: 'Bản nháp chưa lưu',
    committedValue: 'Giá trị V2 hiện tại',
  });

  assert.equal(result.state, 'conflict');
  assert.equal(result.preservedDraft, 'Bản nháp chưa lưu');
  assert.equal(result.committedValue, 'Giá trị V2 hiện tại');
  assert.equal(result.nextVersion, 'V2');
});

test('inactive accounts and users without content capability cannot mutate data', () => {
  const input = {
    action: 'save' as const,
    targetKind: 'public_content' as const,
    baseVersion: 'V2' as const,
    outcomeMode: 'success' as const,
    draftValue: 'Bản nháp mới',
    committedValue: 'Nội dung hiện tại',
  };

  assert.equal(simulateInteractiveAction({ ...input, actorId: 'UD' }).state, 'forbidden');
  assert.equal(simulateInteractiveAction({ ...input, actorId: 'UA' }).state, 'forbidden');
  assert.equal(simulateInteractiveAction({ ...input, actorId: 'AM' }).state, 'success');
});
