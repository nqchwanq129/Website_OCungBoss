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

test('tokens keep controls readable, keyboard accessible and responsive', async ({ page }) => {
  function contrast(foreground: string, background: string) {
    function luminance(color: string) {
      const channels = color.match(/[\d.]+/g)?.map(Number);
      if (!channels || channels.length < 3) throw new Error('Expected an RGB color');
      if (channels.length === 4) expect(channels[3]).toBe(1);
      const linear = channels.slice(0, 3).map((value) => {
        const srgb = value / 255;
        return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
      });
      return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
    }
    const values = [luminance(foreground), luminance(background)].sort((a, b) => a - b);
    return (values[1] + 0.05) / (values[0] + 0.05);
  }

  expect(contrast('rgb(0, 0, 0)', 'rgb(255, 255, 255)')).toBe(21);
  expect(contrast('rgb(0, 0, 0)', 'rgb(0, 0, 0)')).toBe(1);
  await page.goto('/preview#design-tokens');
  const input = page.getByRole('textbox', { name: 'Tên hồ sơ mẫu' });
  await input.fill('Bơ thử bàn phím');
  await input.press('Tab');
  const link = page.getByRole('link', { name: 'Thử dữ liệu ảo', exact: true });
  await expect(link).toBeFocused();

  const measured = await page.evaluate(() => {
    const panel = document.querySelector('#design-tokens');
    const input = document.querySelector('#token-example');
    const heading = document.querySelector('#tokens-title');
    const label = document.querySelector('label[for="token-example"]');
    const link = document.querySelector('#design-tokens .btn-primary');
    if (!panel || !input || !heading || !label || !link) throw new Error('Missing token preview');
    const body = getComputedStyle(document.body);
    const panelStyle = getComputedStyle(panel);
    const field = getComputedStyle(input);
    const placeholder = getComputedStyle(input, '::placeholder');
    const action = getComputedStyle(link);
    return {
      placeholderOpacity: placeholder.opacity,
      controlOpacity: field.opacity,
      actionOpacity: action.opacity,
      outlineWidth: action.outlineWidth,
      pairs: [
        ['body/canvas', body.color, body.backgroundColor, 4.5],
        ['heading/surface', getComputedStyle(heading).color, panelStyle.backgroundColor, 4.5],
        ['label/surface', getComputedStyle(label).color, panelStyle.backgroundColor, 4.5],
        ['field/surface', field.color, field.backgroundColor, 4.5],
        ['placeholder/surface', placeholder.color, field.backgroundColor, 4.5],
        ['on-primary/primary', action.color, action.backgroundColor, 4.5],
        ['control-border/surface', field.borderTopColor, field.backgroundColor, 3],
        ['focus/surface', action.outlineColor, panelStyle.backgroundColor, 3],
        ['focus/canvas', action.outlineColor, body.backgroundColor, 3],
      ] as const,
    };
  });
  expect(measured.placeholderOpacity).toBe('1');
  expect(measured.controlOpacity).toBe('1');
  expect(measured.actionOpacity).toBe('1');
  expect(measured.outlineWidth).toBe('3px');
  for (const [name, foreground, background, minimum] of measured.pairs) {
    const ratio = contrast(foreground, background);
    expect(ratio, name).toBeGreaterThanOrEqual(minimum);
    console.log(`${name}: ${ratio.toFixed(4)}:1`);
  }

  for (const [width, columns] of [
    [360, 1],
    [639, 1],
    [640, 2],
    [767, 2],
    [768, 3],
    [1023, 3],
    [1024, 4],
    [1279, 4],
    [1280, 4],
  ]) {
    await page.setViewportSize({ width, height: 900 });
    const layout = await page.evaluate(() => ({
      columns: getComputedStyle(document.querySelector('#design-tokens .token-grid')!).gridTemplateColumns.split(' ')
        .length,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      breakpoints: ['sm', 'md', 'lg', 'xl'].map((name) =>
        getComputedStyle(document.documentElement).getPropertyValue(`--breakpoint-${name}`).trim(),
      ),
    }));
    expect(layout.columns, `columns at ${width}px`).toBe(columns);
    expect(layout.overflow, `overflow at ${width}px`).toBe(false);
    expect(layout.breakpoints).toEqual(['640px', '768px', '1024px', '1280px']);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  await link.click();
  await expect(page).toHaveURL(/#fixtures$/);
});
