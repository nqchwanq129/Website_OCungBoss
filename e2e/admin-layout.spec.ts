import { expect, test } from '@playwright/test';

test('admin preview uses one shell and capability-filtered routes with deny by default', async ({ page }) => {
  await page.goto('/preview#public-layout');
  await page.getByRole('link', { name: 'Xem Admin layout · capability và menu mẫu' }).click();
  const nav = page.getByRole('navigation', { name: 'Điều hướng quản trị', exact: true });
  const preset = page.getByLabel('Vai trò / capability mẫu');
  await expect(page).toHaveURL(/\/preview\/admin$/);
  for (const role of ['banner', 'main', 'contentinfo'] as const) await expect(page.getByRole(role)).toHaveCount(1);
  await expect(page.locator('.public-header')).toHaveCount(0);
  await expect(nav.getByRole('link')).toHaveCount(2);
  await preset.selectOption('editor');
  await expect(nav.getByRole('link')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bài viết & nội dung (mẫu)');
  await preset.selectOption('reviewer');
  await expect(page.getByRole('main').getByRole('alert')).toContainText('Truy cập bị từ chối');
  await expect(page.getByRole('table')).toHaveCount(0);
  await nav.getByRole('link').click();
  await expect(page).toHaveURL(/\/preview\/admin\/review$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Kiểm duyệt nội dung (mẫu)');
  await expect(preset).toHaveValue('reviewer');
  await expect(nav.locator('[aria-current="page"]')).toContainText('Kiểm duyệt');
  await preset.selectOption('editor');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Không có quyền truy cập mẫu');
  await preset.selectOption('full');
  await page.getByRole('searchbox').fill('không khớp');
  await expect(nav.getByRole('link')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Kiểm duyệt nội dung (mẫu)');
  await page.getByRole('searchbox').fill('');
  for (const id of ['pending', 'user', 'locked']) {
    await preset.selectOption(id);
    await expect(nav.getByRole('link')).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Không có quyền truy cập mẫu');
  }
  await preset.selectOption('full');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Kiểm duyệt nội dung (mẫu)');
});

test('admin sidebar is 256px on desktop and an inline keyboard disclosure on mobile', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/preview/admin');
  const menu = page.getByRole('button', { name: 'Menu quản trị', exact: true });
  const panel = page.locator('#admin-navigation');
  const nav = page.getByRole('navigation', { name: 'Điều hướng quản trị', exact: true });
  for (const width of [1024, 1279, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect((await page.locator('.admin-sidebar').boundingBox())!.width).toBe(256);
    expect((await page.getByRole('main').boundingBox())!.x).toBe(256);
    await expect(menu).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.locator('.admin-shell').screenshot({ path: 'test-results/task36-admin-desktop.png' });
  await page.setViewportSize({ width: 360, height: 900 });
  expect((await page.getByRole('main').boundingBox())!.x).toBe(0);
  await expect(panel).toBeHidden();
  await menu.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await menu.press('Tab');
  await expect(nav.getByRole('link').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(panel).toBeHidden();
  await menu.click();
  await nav.getByRole('link').last().click();
  await expect(page).toHaveURL(/\/review$/);
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.focus();
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(nav.getByRole('link').first()).toBeFocused();
  await page.setViewportSize({ width: 1023, height: 900 });
  await expect(menu).toBeFocused();
  await expect(panel).toBeHidden();
  await menu.click();
  await nav.getByRole('link').first().click();
  const table = page.getByRole('region', { name: 'Bảng nội dung mẫu có thể cuộn ngang' });
  await page.setViewportSize({ width: 320, height: 900 });
  await table.focus();
  await table.press('ArrowRight');
  await expect.poll(() => table.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('.admin-shell').screenshot({ path: 'test-results/task36-admin-mobile.png' });
  await page.setViewportSize({ width: 640, height: 900 });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
