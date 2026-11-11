import { expect, test } from '@playwright/test';

test('account pet selection stays within its owner and clears content on empty, error and account changes', async ({
  page,
}) => {
  await page.goto('/preview/account');
  const actor = page.getByLabel('Tài khoản mẫu', { exact: true });
  const pet = page.getByLabel('Chọn thú cưng mẫu', { exact: true });
  const mode = page.getByLabel('Dữ liệu hồ sơ mẫu', { exact: true });
  const actions = page.getByRole('navigation', { name: 'Hành động nhanh', exact: true });
  const noteA = page.getByText(/Dị ứng nhẹ với thịt gà khô/);
  const noteB = page.getByText(/Hồ sơ theo dõi búi lông/);
  await expect(pet.locator('option')).toHaveText(['Chưa chọn thú cưng', 'Mỡ (PA)']);
  await expect(pet).toHaveValue('PA');
  await expect(noteA).toBeVisible();
  await expect(noteB).toHaveCount(0);
  await pet.selectOption('');
  await expect(page.getByRole('heading', { name: 'Chưa có hồ sơ để hiển thị' })).toBeVisible();
  await expect(noteA).toHaveCount(0);
  await expect(actions).toHaveCount(0);
  await pet.selectOption('PA');
  await expect(noteA).toBeVisible();
  await mode.selectOption('empty');
  await expect(noteA).toHaveCount(0);
  await expect(actions).toHaveCount(0);
  await mode.selectOption('error');
  await expect(page.locator('.account-content').getByRole('alert')).toContainText('Không tải được hồ sơ mẫu');
  await expect(noteA).toHaveCount(0);
  await expect(actions).toHaveCount(0);
  await page.getByRole('button', { name: 'Thử tải lại hồ sơ mẫu' }).click();
  await expect(noteA).toBeVisible();
  await expect(pet).toHaveValue('PA');
  await mode.selectOption('error');
  await actor.selectOption('UB');
  await expect(mode).toHaveValue('normal');
  await expect(pet).toHaveValue('PB');
  await expect(pet.locator('option')).toHaveText(['Chưa chọn thú cưng', 'Mây (PB)']);
  await expect(noteB).toBeVisible();
  await expect(noteA).toHaveCount(0);
  await expect(actions).toContainText('Mây');
  await pet.evaluate((element) => {
    if (!(element instanceof HTMLSelectElement)) throw new Error('Expected native pet selector');
    element.add(new Option('Ngoài phạm vi (mẫu)', 'PA'));
    element.value = 'PA';
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(pet).toHaveValue('');
  await expect(noteA).toHaveCount(0);
  await expect(noteB).toHaveCount(0);
  await expect(actions).toHaveCount(0);
  await page.reload();
  for (const id of ['G', 'U0', 'UL', 'UD', 'AP', 'AM']) {
    await actor.selectOption(id);
    await expect(pet.locator('option')).toHaveCount(1);
    await expect(pet).toHaveValue('');
    await expect(noteA).toHaveCount(0);
    await expect(noteB).toHaveCount(0);
    await expect(actions).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Chưa có hồ sơ để hiển thị' })).toBeVisible();
  }
  await actor.selectOption('UA');
  await expect(noteA).toBeVisible();
  await expect(noteB).toHaveCount(0);
});

test('account layout reflows profile and quick actions with keyboard links to the current pet context', async ({
  page,
  browser,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/preview#public-layout');
  await page.getByRole('link', { name: 'Xem Account layout · hồ sơ và hành động nhanh mẫu' }).click();
  await expect(page).toHaveURL(/\/preview\/account$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hồ sơ thú cưng');
  for (const role of ['banner', 'main', 'contentinfo'] as const) await expect(page.getByRole(role)).toHaveCount(1);
  const profile = page.locator('.account-profile-column');
  const content = page.locator('.account-content');
  const actions = page.getByRole('navigation', { name: 'Hành động nhanh', exact: true });
  expect(
    await profile.evaluate(
      (element) =>
        !!(
          element.compareDocumentPosition(document.querySelector('.account-content')!) &
          Node.DOCUMENT_POSITION_FOLLOWING
        ),
    ),
  ).toBe(true);
  for (const width of [320, 360, 768, 1023, 1024, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const profileBox = await profile.boundingBox();
    const contentBox = await content.boundingBox();
    if (width < 1024) expect(profileBox!.y + profileBox!.height).toBeLessThan(contentBox!.y);
    else {
      expect(profileBox!.x + profileBox!.width).toBeLessThan(contentBox!.x);
      expect(Math.abs(profileBox!.y - contentBox!.y)).toBeLessThan(1);
    }
    if (width === 360 || width === 1280)
      await page.locator('.account-layout').screenshot({ path: `test-results/task35-layout-${width}.png` });
  }
  await page.getByLabel('Tên và hành động dài (mẫu)').check();
  await page.setViewportSize({ width: 360, height: 900 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByLabel('Chọn thú cưng mẫu').focus();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Dữ liệu hồ sơ mẫu')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Tên và hành động dài (mẫu)')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(actions.getByRole('link').first()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(actions.getByRole('link').nth(1)).toBeFocused();
  await expect(actions.getByRole('link')).toHaveCount(3);
  for (const [index, link] of (await actions.getByRole('link').all()).entries()) {
    const hash = ['#account-journal', '#account-calendar', '#account-ration'][index];
    await expect(link).toHaveAttribute('href', hash);
    await link.press('Enter');
    await expect(page).toHaveURL(new RegExp(`${hash}$`));
    const target = page.locator(hash);
    await expect(target).toBeFocused();
    await expect(target).toContainText('PA');
    await expect(target.getByRole('heading')).toContainText('Mỡ');
    expect(await target.evaluate((element) => getComputedStyle(element).outlineWidth)).toBe('3px');
  }
  await page.locator('.account-layout').screenshot({ path: 'test-results/task35-long-360.png' });
  await page.setViewportSize({ width: 640, height: 900 });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByLabel('Dữ liệu hồ sơ mẫu').selectOption('error');
  await expect(profile).toHaveCount(0);
  expect(
    await page
      .locator('.account-grid')
      .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length),
  ).toBe(1);

  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const ssr = await context.newPage();
    await ssr.goto('http://127.0.0.1:3000/preview/account');
    await expect(ssr.getByRole('heading', { level: 1 })).toHaveText('Hồ sơ thú cưng');
    await expect(ssr.getByRole('navigation', { name: 'Hành động nhanh' }).getByRole('link')).toHaveCount(3);
    await expect(ssr.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  } finally {
    await context.close();
  }
});
