import { expect, test } from '@playwright/test';

test('breadcrumbs expose hierarchy, hide separators and keep public account admin links usable without JavaScript', async ({
  page,
  browser,
}) => {
  await page.goto('/preview#breadcrumbs');
  const examples = page.locator('#breadcrumbs');
  const names = ['Đường dẫn công khai mẫu', 'Đường dẫn tài khoản mẫu', 'Đường dẫn quản trị mẫu'];
  for (const [index, name] of names.entries()) {
    const nav = examples.getByRole('navigation', { name, exact: true });
    await expect(nav.getByRole('list')).toHaveJSProperty('tagName', 'OL');
    await expect(nav.getByRole('listitem')).toHaveCount(3);
    await expect(nav.getByRole('link')).toHaveCount(2);
    const current = nav.locator('[aria-current="page"]');
    await expect(current).toHaveCount(1);
    expect(await current.evaluate((element) => element.closest('a'))).toBeNull();
    await expect(nav.locator('li').last()).toContainText(await current.innerText());
    await expect(nav.locator('.breadcrumb-separator[aria-hidden="true"]')).toHaveCount(2);
    for (const link of await nav.getByRole('link').all()) {
      const href = await link.getAttribute('href');
      const target = new URL(href!, page.url());
      expect(target.origin).toBe(new URL(page.url()).origin);
      expect(['/', '/preview']).toContain(target.pathname);
      if (target.hash) await expect(page.locator(target.hash)).toHaveCount(1);
    }
    await nav.getByRole('link').last().press('Tab');
    expect(await nav.locator('[aria-current="page"]').evaluate((element) => element === document.activeElement)).toBe(
      false,
    );
    await nav.getByRole('link').last().press('Enter');
    await expect(page).toHaveURL(index === 0 ? /\/preview#cards$/ : /\/preview#fixtures$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/preview#breadcrumbs$/);
  }
  for (const width of [360, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await examples.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const nav of await examples.getByRole('navigation').all()) {
      expect(await nav.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    }
    await examples.screenshot({ path: `test-results/task29-breadcrumbs-${width}.png` });
  }

  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const ssr = await context.newPage();
    await ssr.goto('http://127.0.0.1:3000/preview#breadcrumbs');
    for (const name of names) {
      const nav = ssr.getByRole('navigation', { name, exact: true });
      await expect(nav).toBeVisible();
      await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
    }
    await ssr
      .getByRole('navigation', { name: names[0], exact: true })
      .getByRole('link', { name: 'Trang chủ' })
      .press('Enter');
    await expect(ssr.getByRole('heading', { level: 1 })).toContainText('Cùng bạn chăm boss');
  } finally {
    await context.close();
  }
});

test('pagination keeps filters and repeated query values through links, forms and browser history', async ({
  page,
}) => {
  await page.goto('/preview?loai=public-content-search&sapXep=ma-giam&tag=a&tag=b&trang=1#pagination');
  const section = page.locator('#pagination');
  const nav = section.getByRole('navigation', { name: 'Phân trang ca mẫu' });
  const items = section.getByRole('list', { name: 'Danh sách ca mẫu' }).locator('li');
  const search = section.getByRole('searchbox', { name: 'Tìm ca mẫu' });
  const area = section.getByRole('combobox', { name: 'Nhóm luồng mẫu' });
  const sort = section.getByRole('combobox', { name: 'Sắp xếp ca mẫu' });
  const apply = section.getByRole('button', { name: 'Áp dụng bộ lọc' });
  await expect(items).toHaveCount(12);
  await expect(items.first().locator('.pagination-code')).toHaveText('P24');
  await expect(nav.getByRole('link', { name: 'Trang trước', exact: true })).toHaveCount(0);
  const href = await nav.getByRole('link', { name: 'Trang sau', exact: true }).getAttribute('href');
  const next = new URL(href!, page.url());
  expect(next.searchParams.get('loai')).toBe('public-content-search');
  expect(next.searchParams.get('sapXep')).toBe('ma-giam');
  expect(next.searchParams.getAll('tag')).toEqual(['a', 'b']);
  await nav.getByRole('link', { name: 'Trang sau', exact: true }).click();
  await expect(nav.locator('[aria-current="page"]')).toHaveText('2');
  await expect(items.first().locator('.pagination-code')).toHaveText('P12');
  await expect(nav.getByRole('link', { name: 'Trang sau', exact: true })).toHaveCount(0);
  await page.goBack();
  await expect(nav.locator('[aria-current="page"]')).toHaveText('1');
  await page.goForward();
  await expect(nav.locator('[aria-current="page"]')).toHaveText('2');
  await page.reload();
  await expect(area).toHaveValue('public-content-search');
  await expect(sort).toHaveValue('ma-giam');
  await expect(nav.locator('[aria-current="page"]')).toHaveText('2');

  await search.fill('P01');
  await sort.selectOption('ma-tang');
  await apply.click();
  await expect(nav.locator('[aria-current="page"]')).toHaveText('1');
  await expect(items).toHaveCount(1);
  await expect(items.first().locator('.pagination-code')).toHaveText('P01');
  await expect(nav.getByRole('link')).toHaveCount(0);
  expect(new URL(page.url()).searchParams.get('trang')).toBe('1');
  expect(new URL(page.url()).searchParams.getAll('tag')).toEqual(['a', 'b']);
  await page.goBack();
  await expect(search).toHaveValue('');
  await expect(sort).toHaveValue('ma-giam');
  await expect(nav.locator('[aria-current="page"]')).toHaveText('2');
  await page.goForward();
  await expect(search).toHaveValue('P01');
  await page.reload();
  await expect(search).toHaveValue('P01');

  await search.fill('khong-co-ca-mau-987');
  await apply.click();
  await expect(section.getByRole('heading', { name: 'Không tìm thấy ca mẫu' })).toBeVisible();
  await expect(nav).toHaveCount(0);
  await section.getByRole('button', { name: 'Xóa bộ lọc mẫu' }).click();
  await expect(items).toHaveCount(12);
  await expect(area).toHaveValue('all');
  expect(new URL(page.url()).searchParams.getAll('tag')).toEqual(['a', 'b']);
  await nav.getByRole('link', { name: 'Trang 2', exact: true }).press('Enter');
  await expect(nav.locator('[aria-current="page"]')).toHaveText('2');
  for (const width of [360, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await section.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await section.screenshot({ path: `test-results/task28-pagination-${width}.png` });
  }
});

test('pagination normalizes strange queries without losing unrelated or repeated filters', async ({ page }) => {
  const section = page.locator('#pagination');
  const nav = section.getByRole('navigation', { name: 'Phân trang ca mẫu' });
  for (const [input, expected] of [
    ['-1', '1'],
    ['1.5', '1'],
    ['999', '7'],
    ['9007199254740992', '1'],
  ]) {
    await page.goto(`/preview?trang=${input}&tag=a&tag=b#pagination`);
    await expect(nav.locator('[aria-current="page"]')).toHaveText(expected);
    await expect(section.getByText('Đã điều chỉnh lựa chọn không hợp lệ')).toBeVisible();
    const href = await section.getByRole('link', { name: 'Dùng địa chỉ hợp lệ' }).getAttribute('href');
    const normalized = new URL(href!, page.url());
    expect(normalized.searchParams.get('trang')).toBe(expected);
    expect(normalized.searchParams.getAll('tag')).toEqual(['a', 'b']);
  }
  await page.goto('/preview?trang=2&trang=3&loai=bad&sapXep=bad&tag=a&tag=b#pagination');
  await expect(nav.locator('[aria-current="page"]')).toHaveText('2');
  await expect(section.getByRole('combobox', { name: 'Nhóm luồng mẫu' })).toHaveValue('all');
  await expect(section.getByRole('combobox', { name: 'Sắp xếp ca mẫu' })).toHaveValue('ma-tang');
  await section.getByRole('link', { name: 'Dùng địa chỉ hợp lệ' }).click();
  await expect(section.getByText('Đã điều chỉnh lựa chọn không hợp lệ')).toHaveCount(0);
  expect(new URL(page.url()).searchParams.getAll('trang')).toEqual(['2']);
  await page.goto(`/preview?q=${'x'.repeat(201)}&trang=999&tag=a&tag=b#pagination`);
  await expect(section.getByRole('searchbox', { name: 'Tìm ca mẫu' })).toHaveValue('x'.repeat(200));
  await expect(nav).toHaveCount(0);
  await section.getByRole('link', { name: 'Dùng địa chỉ hợp lệ' }).click();
  await expect(section.getByText('Đã điều chỉnh lựa chọn không hợp lệ')).toHaveCount(0);
  expect(new URL(page.url()).searchParams.get('q')).toHaveLength(200);
  expect(new URL(page.url()).searchParams.get('trang')).toBe('1');
  expect(new URL(page.url()).searchParams.getAll('tag')).toEqual(['a', 'b']);
});

test('confirmation preserves context, traps focus and prevents duplicate destructive actions', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-11-11T00:00:00Z') });
  await page.goto('/preview#confirm-dialog');
  const preview = page.locator('#confirm-dialog');
  const trigger = page.locator('#confirm-trigger');
  const dialog = page.getByRole('dialog', { name: 'Xóa ghi chú này?' });
  const cancel = dialog.getByRole('button', { name: 'Hủy', exact: true });
  const confirm = dialog.getByRole('button', { name: 'Xác nhận xóa', exact: true });

  await trigger.focus();
  await trigger.press('Enter');
  await expect(cancel).toBeFocused();
  await expect(dialog).toHaveAccessibleDescription(/Bạn sắp xóa.*Ghi chú chăm sóc Bơ/);
  await cancel.press('Tab');
  await expect(confirm).toBeFocused();
  await confirm.press('Tab');
  await expect.poll(() => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await cancel.focus();
  await cancel.press('Shift+Tab');
  await expect.poll(() => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(preview).toContainText('Lần thử mô phỏng: 0');

  await trigger.click();
  await cancel.click();
  await expect(trigger).toBeFocused();
  await expect(preview).toContainText('Ghi chú mẫu vẫn được giữ.');
  await expect(preview).toContainText('Lần thử mô phỏng: 0');

  await preview.getByRole('checkbox', { name: 'Mô phỏng lỗi lần thử đầu' }).check();
  await trigger.click();
  for (const width of [1280, 360, 320]) {
    await page.setViewportSize({ width, height: width === 320 ? 450 : 800 });
    const bounds = await dialog.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  }
  await page.mouse.click(1, 1);
  await expect(dialog).toBeVisible();
  await page.clock.pauseAt(new Date('2026-11-11T01:00:00Z'));
  await confirm.click();
  await expect(dialog.getByRole('button', { name: 'Đang xử lý…', exact: true })).toBeDisabled();
  await expect(cancel).toHaveAttribute('aria-disabled', 'true');
  await cancel.focus();
  await cancel.press('Tab');
  await expect(cancel).toBeFocused();
  await cancel.click({ force: true });
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  await expect(preview).toContainText('Lần thử mô phỏng: 1');
  await page.clock.runFor(1200);
  await expect(dialog.getByRole('alert')).toContainText('Nội dung vẫn được giữ nguyên.');
  await expect(dialog).toContainText('Ghi chú chăm sóc Bơ');
  await expect(cancel).toBeFocused();
  await expect(preview.locator('.confirm-note')).toHaveCount(1);

  await page.setViewportSize({ width: 360, height: 800 });
  await dialog.screenshot({ path: 'test-results/task27-confirm-dialog-mobile.png' });
  await page.setViewportSize({ width: 1280, height: 900 });
  await dialog.screenshot({ path: 'test-results/task27-confirm-dialog-desktop.png' });
  await confirm.dblclick();
  await expect(preview).toContainText('Lần thử mô phỏng: 2');
  await page.clock.runFor(1200);
  await expect(dialog).toHaveCount(0);
  await expect(preview).toContainText('Đã xóa ghi chú mẫu.');
  await expect(preview.locator('.confirm-note')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(preview.locator('.confirm-note')).toHaveCount(1);
});

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

test('Button forwards native props and ref, prevents pending repeats and supports keyboard', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-11-11T00:00:00Z') });
  await page.goto('/preview#buttons');
  const demo = page.getByRole('region', { name: 'Button · primary / secondary' });
  const form = demo.getByRole('form', { name: 'Thử Button' });
  const status = demo.getByRole('status');
  const submit = form.locator('button[name="intent"]');
  const counter = form.getByRole('button', { name: 'Đếm click', exact: true });
  await expect(counter).toHaveAttribute('type', 'button');
  await counter.click();
  await expect(status).toContainText('Số click: 1. Số lần gửi: 0.');
  await expect(submit).toHaveAttribute('type', 'submit');
  await expect(submit).toHaveAttribute('value', 'sample');

  await form.getByRole('button', { name: 'Focus nút gửi', exact: true }).click();
  await expect(submit).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(submit).toBeFocused();
  const focus = await submit.evaluate((button) => {
    const style = getComputedStyle(button);
    return {
      outline: style.outlineWidth,
      color: style.outlineColor,
      shadow: style.boxShadow,
      height: button.getBoundingClientRect().height,
    };
  });
  expect(focus.outline).toBe('3px');
  expect(focus.color).toBe('rgb(88, 59, 43)');
  expect(focus.shadow).toContain('rgb(255, 255, 255)');
  expect(focus.height).toBeGreaterThanOrEqual(44);

  await page.clock.pauseAt(new Date('2026-11-11T01:00:00Z'));
  await page.keyboard.press('Enter');
  await expect(submit).toHaveText('Đang xử lý…');
  await expect(submit).toHaveAttribute('aria-busy', 'true');
  await expect(submit).toBeDisabled();
  await submit.evaluate((button) => {
    if (!(button instanceof HTMLButtonElement)) throw new Error('Expected native button');
    button.click();
    button.click();
  });
  await expect(status).toContainText('Số lần gửi: 1.');
  await page.clock.runFor(1000);
  await expect(submit).toBeEnabled();
  await expect(submit).toHaveText('Gửi mẫu');
  await expect(submit).not.toHaveAttribute('aria-busy', 'true');
  await expect(status).toContainText('Số lần gửi: 1. Đã hoàn tất mẫu.');

  const disabled = form.getByRole('button', { name: 'Chưa khả dụng', exact: true });
  await expect(disabled).toBeDisabled();
  await disabled.evaluate((button) => {
    if (button instanceof HTMLButtonElement) button.click();
  });
  await expect(status).toContainText('Số click: 1. Số lần gửi: 1.');
  const secondary = form.getByRole('button', { name: 'Focus nút gửi', exact: true });
  await page.mouse.move(0, 0);
  await expect(secondary).toHaveCSS('background-color', 'rgb(234, 216, 194)');
  const colors = await secondary.evaluate((button) => ({
    color: getComputedStyle(button).color,
    background: getComputedStyle(button).backgroundColor,
  }));
  expect(colors).toEqual({ color: 'rgb(88, 59, 43)', background: 'rgb(234, 216, 194)' });

  await page.setViewportSize({ width: 360, height: 900 });
  const longLabel = form.getByRole('button', { name: /^Nhãn dài để thử xuống dòng/ });
  const size = await longLabel.evaluate((button) => ({
    height: button.getBoundingClientRect().height,
    clipped: button.scrollWidth > button.clientWidth,
  }));
  expect(size.height).toBeGreaterThan(44);
  expect(size.clipped).toBe(false);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await counter.hover();
  await page.mouse.down();
  const motion = await counter.evaluate((button) => ({
    transition: getComputedStyle(button).transitionDuration,
    transform: getComputedStyle(button).transform,
  }));
  expect(motion).toEqual({ transition: '0s', transform: 'none' });
  await page.mouse.up();

  await page.locator('#outcome-select').selectOption('pending');
  const actions = page.getByRole('group', { name: 'Các nút thao tác tương tác mô phỏng' });
  await actions.getByRole('button').first().click();
  await expect(actions.locator('button[disabled][aria-busy="true"]')).toHaveCount(7);
  await page.getByRole('button', { name: 'Khôi phục fixture gốc', exact: true }).click();
  await expect(actions.locator('button[disabled]')).toHaveCount(0);
});

test('Field renders accessible SSR errors and preserves native input behavior', async ({ page, browser }) => {
  await page.goto('/preview#fields');
  const ssr = await browser.newPage({ javaScriptEnabled: false });
  try {
    await ssr.goto(page.url());
    const email = ssr.getByRole('textbox', { name: 'Email mẫu', exact: true });
    await expect(email).toHaveValue('chua-hop-le');
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toHaveAttribute('aria-describedby', 'field-email-help field-email-error');
    await expect(ssr.locator('#field-email-error')).toHaveText('Email mẫu chưa hợp lệ.');
    await ssr.locator('label[for="field-email"]').click();
    await expect(email).toBeFocused();
  } finally {
    await ssr.close();
  }

  const demo = page.getByRole('region', { name: 'Field · label và lỗi accessible' });
  const name = demo.getByRole('textbox', { name: 'Biệt danh mẫu', exact: true });
  const email = demo.getByRole('textbox', { name: 'Email mẫu', exact: true });
  await expect(name).toHaveAttribute('name', 'sampleName');
  await expect(name).toHaveAttribute('autocomplete', 'nickname');
  await expect(email).toHaveAttribute('type', 'email');
  await expect(email).toHaveAttribute('autocomplete', 'email');
  await expect(email).toHaveAttribute('required', '');
  await demo.locator('label[for="field-name"]').click();
  await expect(name).toBeFocused();
  await expect(name).toHaveCSS('outline-width', '3px');
  await name.fill('   ');
  await email.fill('sai-email.test');
  await demo.getByRole('button', { name: 'Focus email', exact: true }).click();
  await expect(email).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(demo.getByRole('button', { name: 'Kiểm tra mẫu', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(demo.getByRole('alert')).toHaveCount(2);
  await expect(name).toHaveValue('   ');
  await expect(email).toHaveValue('sai-email.test');
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await expect(name).toHaveAttribute('aria-describedby', 'field-name-help field-name-error');
  await expect(email).toHaveAttribute('aria-describedby', 'field-email-help field-email-error');
  await expect(email).toHaveAccessibleDescription(/Dùng địa chỉ giả.*Nhập email mẫu hợp lệ/);
  await expect(email).toHaveCSS('border-top-color', 'rgb(186, 26, 26)');
  const ids = await page.locator('[id]').evaluateAll((nodes) => nodes.map((node) => node.id));
  expect(new Set(ids).size).toBe(ids.length);

  await page.setViewportSize({ width: 360, height: 900 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await name.fill('Bơ mẫu');
  await email.fill('sen@ocungboss.test');
  await demo.getByRole('button', { name: 'Kiểm tra mẫu', exact: true }).click();
  await expect(demo.getByRole('status')).toHaveText('Mẫu hợp lệ; không gửi dữ liệu.');
  await expect(demo.getByRole('alert')).toHaveCount(0);
  await expect(name).not.toHaveAttribute('aria-invalid', 'true');
  await expect(email).not.toHaveAttribute('aria-invalid', 'true');
  await expect(name).toHaveAttribute('aria-describedby', 'field-name-help');
  await expect(email).toHaveAttribute('aria-describedby', 'field-email-help');
  await expect(name).toHaveValue('Bơ mẫu');
  await expect(email).toHaveValue('sen@ocungboss.test');
});

test('Select keeps native placeholder validity, keyboard access and selections after errors', async ({
  page,
  browser,
}) => {
  await page.goto('/preview#selects');
  const ssr = await browser.newPage({ javaScriptEnabled: false });
  try {
    await ssr.goto(page.url());
    const select = ssr.getByLabel('Thú cưng mẫu', { exact: true });
    await expect(select).toHaveValue('');
    await expect(select).toHaveAttribute('aria-invalid', 'true');
    await expect(select).toHaveAccessibleDescription(/Chọn hồ sơ giả.*Chọn thú cưng mẫu/);
    await ssr.locator('label[for="select-pet"]').click();
    await expect(select).toBeFocused();
  } finally {
    await ssr.close();
  }

  const demo = page.getByRole('region', { name: 'Select · lựa chọn native' });
  const pet = demo.getByRole('combobox', { name: 'Thú cưng mẫu', exact: true });
  const frequency = demo.getByLabel('Tần suất mẫu', { exact: true });
  const disabled = demo.getByLabel('Lựa chọn chưa khả dụng', { exact: true });
  const submit = demo.getByRole('button', { name: 'Kiểm tra lựa chọn', exact: true });
  await expect(pet).toHaveAttribute('name', 'samplePet');
  await expect(pet.locator('option').first()).toHaveAttribute('value', '');
  await expect(pet.locator('option').first()).toBeDisabled();
  expect(await pet.evaluate((node) => node instanceof HTMLSelectElement && node.validity.valueMissing)).toBe(true);
  await expect(frequency).toHaveValue('weekly');
  await expect(disabled).toBeDisabled();
  await submit.click();
  await expect(demo.getByRole('alert')).toHaveCount(2);
  await expect(pet).toHaveAttribute('aria-describedby', 'select-pet-help select-pet-error');
  await expect(pet).toHaveCSS('border-top-color', 'rgb(186, 26, 26)');
  await demo.getByRole('button', { name: 'Focus lựa chọn', exact: true }).click();
  await expect(pet).toBeFocused();
  await expect(pet).toHaveCSS('outline-width', '3px');
  await page.keyboard.press('ArrowDown');
  await expect(pet).toHaveValue('PA');
  await page.keyboard.press('Tab');
  await expect(frequency).toBeFocused();
  await page.keyboard.press('Home');
  await expect(frequency).toHaveValue('daily');
  await page.keyboard.press('Tab');
  await expect(demo.getByLabel('Ghi chú mẫu', { exact: true })).toBeFocused();
  await pet.selectOption('PB');
  await submit.click();
  await expect(demo.getByRole('status')).toHaveText('Mẫu còn lỗi; lựa chọn được giữ nguyên.');
  await expect(pet).toHaveValue('PB');
  await expect(frequency).toHaveValue('daily');
  await expect(pet).not.toHaveAttribute('aria-invalid', 'true');
  await expect(pet).toHaveAttribute('aria-describedby', 'select-pet-help');
  await expect(demo.locator('#select-pet-error')).toHaveCount(0);
  await expect(demo.getByRole('alert')).toHaveCount(1);
  for (const width of [360, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    const bounds = await pet.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
  }
  await demo.getByLabel('Ghi chú mẫu', { exact: true }).fill('Mẫu giả');
  await submit.click();
  await expect(demo.getByRole('status')).toHaveText('Mẫu hợp lệ; không gửi dữ liệu.');
  const formValues = await demo.locator('form').evaluate((form) => Object.fromEntries(new FormData(form)));
  expect(formValues).toEqual({ samplePet: 'PB', sampleFrequency: 'daily', sampleNote: 'Mẫu giả' });
  await expect(demo.getByRole('alert')).toHaveCount(0);
  const ids = await page.locator('[id]').evaluateAll((nodes) => nodes.map((node) => node.id));
  expect(new Set(ids).size).toBe(ids.length);
});

test('Content cards keep image ratio, separate links from save actions and show missing-image fallback', async ({
  page,
}) => {
  await page.goto('/preview#cards');
  const demo = page.getByRole('region', { name: 'Card nội dung' });
  const cards = demo.getByRole('article');
  await expect(cards).toHaveCount(2);

  const illustrated = cards.nth(0);
  const link = illustrated.getByRole('link', { name: /Lịch chăm sóc chó con/ });
  const image = illustrated.getByRole('img', { name: 'Minh họa chú chó con nâu trên nền màu ấm' });
  await expect(link).toHaveAttribute('href', '/preview#fixtures');
  await expect(image).toBeVisible();
  await expect(image).toHaveJSProperty('complete', true);
  expect(await image.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  const ratio = await illustrated.locator('.content-card-media').evaluate((node) => {
    const { width, height } = node.getBoundingClientRect();
    return width / height;
  });
  expect(ratio).toBeCloseTo(4 / 3, 1);
  await expect(illustrated.locator('button')).toHaveCount(1);
  await expect(link.locator('button')).toHaveCount(0);

  const save = illustrated.getByRole('button', {
    name: 'Lưu bài viết: Lịch chăm sóc chó con 8 tuần tuổi khi mới đón về nhà',
  });
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(save).toBeFocused();
  await expect(save).toHaveAttribute('aria-pressed', 'false');
  await expect(save).toHaveCSS('outline-width', '3px');
  await page.keyboard.press('Space');
  await expect(illustrated.getByRole('button', { name: /^Bỏ lưu bài viết:/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/\/preview#cards$/);

  const missing = cards.nth(1);
  await expect(missing.getByRole('img', { name: 'Bài viết chưa có ảnh minh họa' })).toBeVisible();
  await expect(missing.getByRole('heading')).toContainText('Tiêu đề mẫu dài');
  for (const width of [360, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    const bounds = await illustrated.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
  }
});

test('Alerts announce one appropriate state and empty views offer relevant actions', async ({ page }) => {
  await page.goto('/preview#alerts');
  const demo = page.getByRole('region', { name: 'Alert và empty state' });
  const liveRegions = demo.locator('[role="alert"], [role="status"]');
  await expect(liveRegions).toHaveCount(1);
  await expect(demo.getByRole('status')).toContainText('Thông tin');
  await expect(demo.locator('[role="status"]')).not.toHaveAttribute('aria-live');

  await demo.getByRole('button', { name: 'Lỗi', exact: true }).click();
  const alert = demo.getByRole('alert');
  await expect(alert).toContainText('Lỗi');
  await expect(alert).toContainText('Chưa tải được nội dung mẫu');
  await expect(liveRegions).toHaveCount(1);
  const errorChoice = demo.getByRole('button', { name: 'Lỗi', exact: true });
  await errorChoice.focus();
  await page.keyboard.press('Tab');
  const retry = demo.getByRole('button', { name: 'Thử lại dữ liệu mẫu', exact: true });
  await expect(retry).toBeFocused();
  await expect(retry).toHaveCSS('outline-width', '3px');
  await page.keyboard.press('Enter');
  await expect(alert).toContainText('Thử lại lần 1 vẫn gặp lỗi.');
  await expect(demo.getByRole('status')).toHaveCount(0);
  await expect(liveRegions).toHaveCount(1);

  await demo.getByRole('button', { name: 'Thành công', exact: true }).click();
  await expect(demo.getByRole('status')).toContainText('Thành công');
  await expect(demo.getByRole('status')).toContainText('thay đổi trong bộ nhớ preview');
  await expect(demo.getByRole('alert')).toHaveCount(0);
  await expect(liveRegions).toHaveCount(1);

  const empty = demo.getByRole('region', { name: 'Chưa có bài viết đã lưu' });
  await expect(empty).toContainText('Lưu một bài viết');
  const suggestions = empty.getByRole('link', { name: 'Xem bài viết gợi ý' });
  await expect(suggestions).toHaveAttribute('href', '/preview#cards');
  await demo.getByRole('button', { name: 'Chưa có dữ liệu', exact: true }).focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(suggestions).toBeFocused();
  await expect(suggestions).toHaveCSS('outline-width', '3px');

  await demo.getByRole('button', { name: 'Không có kết quả', exact: true }).click();
  const noResults = demo.getByRole('region', { name: 'Không tìm thấy bài viết phù hợp' });
  await expect(noResults).toContainText('Không có kết quả cho bộ lọc');
  await noResults.getByRole('button', { name: 'Xóa bộ lọc' }).click();
  await expect(demo.locator('.empty-state-result')).toContainText('Danh sách gợi ý mẫu đang hiển thị.');
  await expect(noResults).toHaveCount(0);
  await page.setViewportSize({ width: 360, height: 900 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  const ids = await page.locator('[id]').evaluateAll((nodes) => nodes.map((node) => node.id));
  expect(new Set(ids).size).toBe(ids.length);
});

test('Loading skeleton stays hidden from assistive tech and resolves to each selected state', async ({ page }) => {
  await page.goto('/preview#loading');
  const demo = page.getByRole('region', { name: 'Skeleton và trạng thái tải' });
  const outcome = demo.getByLabel('Kết quả tải mẫu', { exact: true });
  const start = demo.getByRole('button', { name: 'Tải dữ liệu giả', exact: true });

  await outcome.selectOption('success');
  await start.focus();
  await page.keyboard.press('Enter');
  const busy = demo.getByRole('region', { name: 'Nội dung mẫu đang tải' });
  await expect(busy).toHaveAttribute('aria-busy', 'true');
  const status = demo.getByRole('status');
  await expect(status).toBeVisible();
  await expect(demo.locator('[role="status"], [role="alert"]')).toHaveCount(1);
  const skeleton = busy.locator('[aria-hidden="true"]');
  await expect(skeleton.locator('.skeleton-bar')).toHaveCount(2);
  await expect(skeleton.locator('a, button, input, select, [tabindex]')).toHaveCount(0);
  await expect(busy).not.toContainText('Lorem');
  expect(
    await skeleton
      .locator('.skeleton-bar')
      .first()
      .evaluate((bar) => getComputedStyle(bar).animationDuration),
  ).toBe('1.2s');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await skeleton
      .locator('.skeleton-bar')
      .first()
      .evaluate((bar) => getComputedStyle(bar).animationDuration),
  ).toBe('0s');
  await expect(demo.getByRole('status')).toContainText('Bài viết đã sẵn sàng');
  await expect(demo.getByRole('region', { name: 'Nội dung mẫu đang tải' })).toHaveCount(0);
  await expect(demo.locator('[aria-busy="true"]')).toHaveCount(0);

  await outcome.selectOption('empty');
  await demo.getByRole('button', { name: 'Tải dữ liệu giả', exact: true }).click();
  await expect(demo.getByRole('region', { name: 'Chưa có gợi ý phù hợp' })).toBeVisible();
  await expect(demo.locator('.skeleton-bar')).toHaveCount(0);

  await outcome.selectOption('error');
  await demo.getByRole('button', { name: 'Tải dữ liệu giả', exact: true }).click();
  const error = demo.getByRole('alert');
  await expect(error).toContainText('Lỗi mô phỏng');
  await expect(demo.getByRole('status')).toHaveCount(0);
  await demo.getByRole('button', { name: 'Thử tải lại' }).click();
  await expect(demo.getByRole('region', { name: 'Nội dung mẫu đang tải' })).toHaveAttribute('aria-busy', 'true');
  await expect(demo.getByRole('alert')).toContainText('Lỗi mô phỏng');
  await expect(demo.getByRole('region', { name: 'Nội dung mẫu đang tải' })).toHaveCount(0);

  await page.setViewportSize({ width: 360, height: 900 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  const fixtureMode = page.locator('#read-mode-select');
  await fixtureMode.selectOption('slow');
  const fixtureLoading = page.getByRole('region', { name: 'Kết quả dữ liệu đọc đang tải' });
  await expect(fixtureLoading).toHaveAttribute('aria-busy', 'true');
  await expect(page.locator('.loading-status')).toContainText('900ms');
  await expect(page.locator('#read-state-heading')).toContainText('ready');
  await expect(fixtureLoading).toHaveCount(0);
  const ids = await page.locator('[id]').evaluateAll((nodes) => nodes.map((node) => node.id));
  expect(new Set(ids).size).toBe(ids.length);
});
