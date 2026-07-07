import { expect, test } from '@playwright/test';

test('shows ZenithScope dashboard and core metrics', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      pageErrors.push(message.text());
    }
  });

  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'ZenithScope 天顶之眼' })).toBeVisible();
  await expect(page.getByLabel('核心指标区域')).toBeVisible();
  await expect(page.getByText('今日访问量')).toBeVisible();
  await expect(page.getByRole('heading', { name: '天顶数据中枢' })).toBeVisible();

  await page.mouse.move(960, 620);
  await page.waitForTimeout(2_500);
  await expect(page.getByText('实时动态')).toBeVisible();

  expect(pageErrors).toEqual([]);
});
