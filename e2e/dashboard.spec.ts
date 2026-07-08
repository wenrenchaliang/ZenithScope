import { expect, test } from '@playwright/test';

test('shows ZenithScope monitor dashboard and core metrics', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      pageErrors.push(message.text());
    }
  });

  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'ZenithScope 主机监控大屏' })).toBeVisible();
  await expect(page.getByLabel('核心监控指标')).toBeVisible();
  await expect(page.getByText('监控主机')).toBeVisible();
  await expect(page.getByRole('heading', { name: '机房主机态势' })).toBeVisible();

  await page.mouse.move(960, 620);
  await page.waitForTimeout(2_500);
  await expect(page.getByText('最新采样动态')).toBeVisible();

  expect(pageErrors).toEqual([]);
});
