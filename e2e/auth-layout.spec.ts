import { expect, test } from '@playwright/test';

test('auth layout keeps one public shell, form-first DOM and responsive two-column presentation', async ({
  page,
  browser,
}) => {
  await page.goto('/preview#public-layout');
  await page.getByRole('link', { name: 'Xem Auth layout · sáu ngữ cảnh form mẫu' }).click();
  await expect(page).toHaveURL(/\/preview\/auth$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Không gian tài khoản');
  for (const role of ['banner', 'main', 'contentinfo'] as const) await expect(page.getByRole(role)).toHaveCount(1);
  const panel = page.getByRole('region', { name: 'Không gian tài khoản', exact: true });
  const intro = page.getByRole('complementary', { name: 'Một tài khoản, cả hành trình chăm boss' });
  expect(
    await panel.evaluate(
      (element) =>
        !!(element.compareDocumentPosition(document.querySelector('.auth-intro')!) & Node.DOCUMENT_POSITION_FOLLOWING),
    ),
  ).toBe(true);
  for (const width of [320, 360, 768, 1023, 1024, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const formBox = await panel.boundingBox();
    const introBox = await intro.boundingBox();
    if (width < 1024) expect(formBox!.y + formBox!.height).toBeLessThan(introBox!.y);
    else {
      expect(introBox!.x + introBox!.width).toBeLessThan(formBox!.x);
      expect(Math.abs(formBox!.y - introBox!.y)).toBeLessThan(1);
    }
    if (width === 360 || width === 1280)
      await page.locator('.auth-shell').screenshot({ path: `test-results/task34-layout-${width}.png` });
  }
  await panel.getByLabel('Mật khẩu', { exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(panel.getByRole('button', { name: 'Đăng nhập (mẫu)' })).toBeFocused();
  expect(
    await panel
      .getByRole('button', { name: 'Đăng nhập (mẫu)' })
      .evaluate((element) => getComputedStyle(element).outlineWidth),
  ).toBe('3px');
  await panel.getByLabel('Ngữ cảnh form mẫu').selectOption('reset');
  await page.setViewportSize({ width: 360, height: 320 });
  const confirm = panel.getByLabel('Xác nhận mật khẩu', { exact: true });
  await confirm.focus();
  const inputBox = await confirm.boundingBox();
  expect(inputBox!.y).toBeGreaterThanOrEqual(0);
  expect(inputBox!.y + inputBox!.height).toBeLessThanOrEqual(320);
  await page.keyboard.press('Tab');
  const reset = panel.getByRole('button', { name: 'Đặt lại mật khẩu (mẫu)' });
  await expect(reset).toBeFocused();
  const buttonBox = await reset.boundingBox();
  expect(buttonBox!.y + buttonBox!.height).toBeLessThanOrEqual(320);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 640, height: 900 });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeVisible();
  await expect(panel.getByText(/Google|gói trả phí/i)).toHaveCount(0);

  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const ssr = await context.newPage();
    await ssr.goto('http://127.0.0.1:3000/preview/auth');
    await expect(ssr.getByRole('heading', { level: 1 })).toHaveText('Không gian tài khoản');
    await expect(ssr.getByLabel('Email', { exact: true })).toBeVisible();
    await expect(ssr.getByLabel('Mật khẩu', { exact: true })).toBeVisible();
    await expect(ssr.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(ssr.locator('meta[name="referrer"]')).toHaveAttribute('content', 'no-referrer');
  } finally {
    await context.close();
  }
});

test('all six auth mock contexts retain inputs through long errors and pending without submitting credentials', async ({
  page,
}) => {
  let submitRequests = 0;
  page.on('request', (request) => {
    if (request.method() !== 'GET') submitRequests++;
  });
  await page.clock.install({ time: new Date('2026-11-11T00:00:00Z') });
  await page.goto('/preview/auth');
  await page.setViewportSize({ width: 360, height: 800 });
  await page.clock.pauseAt(new Date('2026-11-11T01:00:00Z'));
  const panel = page.getByRole('region', { name: 'Không gian tài khoản', exact: true });
  const form = panel.getByRole('form');
  const selector = panel.getByLabel('Ngữ cảnh form mẫu');
  const errorOption = panel.getByLabel('Mô phỏng lỗi dài sau khi gửi');
  for (const [mode, fields] of [
    ['login', 2],
    ['register', 3],
    ['verify', 1],
    ['forgot', 1],
    ['reset', 2],
    ['mfa', 1],
  ] as const) {
    await selector.selectOption(mode);
    await expect(form.locator('input')).toHaveCount(fields);
    for (const input of await form.locator('input').all()) {
      const type = await input.getAttribute('type');
      await input.fill(
        type === 'email' ? 'layout.fake@ocungboss.test' : type === 'password' ? 'layout-only-example' : '123456',
      );
    }
    await errorOption.check();
    const first = form.locator('input').first();
    const entered = await first.inputValue();
    await form.getByRole('button').click();
    await expect(form).toHaveAttribute('aria-busy', 'true');
    await expect(form.getByRole('button')).toBeDisabled();
    await expect(selector).toBeDisabled();
    await expect(first).toHaveAttribute('readonly', '');
    await expect(panel.getByRole('status')).toContainText('Đang mô phỏng phản hồi');
    await form.evaluate((element) => {
      (element as HTMLFormElement).requestSubmit();
      (element as HTMLFormElement).requestSubmit();
    });
    await page.clock.runFor(1000);
    await expect(form).toHaveAttribute('aria-busy', 'false');
    await expect(form.getByRole('alert')).toContainText('Phản hồi lỗi mẫu đủ dài');
    await expect(first).toBeFocused();
    await expect(first).toHaveValue(entered);
    await expect(first).toHaveAttribute('aria-invalid', 'true');
    await expect(first).toHaveAttribute('aria-describedby', `${await first.getAttribute('id')}-error`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (mode === 'register') await panel.screenshot({ path: 'test-results/task34-error-360.png' });
    await errorOption.uncheck();
    await form.getByRole('button').click();
    await expect(form).toHaveAttribute('aria-busy', 'true');
    await page.clock.runFor(1000);
    await expect(form.getByRole('status')).toContainText('Đã hoàn tất mô phỏng');
    await expect(form.getByRole('button')).toBeFocused();
    await expect(first).toHaveValue(entered);
    await expect(form.getByRole('alert')).toHaveCount(0);
  }
  expect(submitRequests).toBe(0);
});
