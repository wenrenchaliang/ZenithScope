import { expect, test } from '@playwright/test';

test('shows ZenithScope dashboard and core metrics', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/');

  await expect(page.getByRole('heading', { name: /ZenithScope 天顶之眼/ })).toBeVisible();
  await expect(page.getByLabel('核心指标区域')).toBeVisible();
  await expect(page.getByText('在线设备数')).toBeVisible();
  await expect(page.getByRole('heading', { name: '全域态势感知' })).toBeVisible();

  await page.mouse.move(960, 620);
  await page.waitForTimeout(200);

  expect(pageErrors).toEqual([]);
});
