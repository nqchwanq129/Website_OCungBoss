import { expect, test } from '@playwright/test';

test('opens the homepage and navigates to the fixture preview', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/OCungBoss/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Cùng bạn chăm boss');

  await page
    .getByRole('link', { name: /Preview Fixtures/ })
    .first()
    .click();

  await expect(page).toHaveURL(/\/preview$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Bộ điều khiển dữ liệu ảo');
  await expect(page.getByText('không cần API hay cơ sở dữ liệu thật')).toBeVisible();
});
