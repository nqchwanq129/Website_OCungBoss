import { expect, test } from '@playwright/test';

test('production 404 keeps a safe public shell with keyboard recovery on missing root and nested routes', async ({
  page,
}) => {
  for (const path of ['/trang-khong-ton-tai', '/preview/khong-ton-tai', '/preview/admin/khong-ton-tai']) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    const heading = page.getByRole('heading', { level: 1, name: 'Không tìm thấy trang' });
    await expect(heading).toBeFocused();
    for (const role of ['banner', 'main', 'contentinfo'] as const) await expect(page.getByRole(role)).toHaveCount(1);
    await page.setViewportSize({ width: 360, height: 800 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const home = page.getByRole('link', { name: 'Về trang chủ', exact: true });
    await heading.press('Tab');
    await expect(home).toBeFocused();
    await home.press('Enter');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Cùng bạn chăm boss');
  }
  await page.goto('/trang-khong-ton-tai');
  await page.screenshot({ path: 'test-results/task37-production-404.png' });
});

test('production boundary catches a real render failure, retries safely and recovers after clearing the fixture fault', async ({
  page,
}) => {
  await page.goto('/preview/error');
  await page.getByRole('button', { name: 'Gây lỗi render mẫu' }).click();
  const heading = page.getByRole('heading', { level: 1, name: 'Không thể hiển thị trang' });
  await expect(heading).toBeFocused();
  for (const role of ['banner', 'main', 'contentinfo'] as const) await expect(page.getByRole(role)).toHaveCount(1);
  const retry = page.getByRole('button', { name: 'Thử lại trang', exact: true });
  await expect(page.getByRole('main').getByRole('alert')).toContainText('Có lỗi khi hiển thị nội dung');
  for (const width of [360, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const copy = await page.getByRole('main').innerText();
    expect(copy).not.toMatch(/SIMULATED_RENDER_FAILURE|Error:|at .*\(|\.tsx|stack|thành công/i);
    await heading.press('Tab');
    await expect(retry).toBeFocused();
    await retry.press('Enter');
    await expect(heading).toBeVisible();
    await expect(page.getByRole('main').getByRole('alert')).toContainText('Có lỗi');
    await page.screenshot({ path: `test-results/task37-production-error-${width}.png` });
  }
  await page.evaluate(() => {
    history.replaceState(null, '', location.pathname);
  });
  await retry.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Thử lỗi render mẫu');
  await expect(page.getByRole('main').getByRole('alert')).toHaveCount(0);
  await page.getByRole('button', { name: 'Gây lỗi render mẫu' }).click();
  await page.getByRole('link', { name: 'Về trang chủ', exact: true }).press('Enter');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Cùng bạn chăm boss');
});
