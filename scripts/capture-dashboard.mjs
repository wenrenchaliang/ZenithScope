import { chromium } from '@playwright/test';
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const dashboardUrl = process.env.DASHBOARD_URL ?? 'http://127.0.0.1:10001/';
const screenshotPath = path.join(
  projectRoot,
  'docs',
  'screenshots',
  'dashboard-1920x1080.png',
);

const viewport = {
  width: 1920,
  height: 1080,
};

const startupHint =
  'Please start the dev server first: npm run dev -- --host 127.0.0.1 --port 10001';

function formatError(error) {
  if (!error) return 'Unknown error';
  if (typeof error === 'string') return error;
  return error.stack || error.message || String(error);
}

async function waitForDashboard(page) {
  await page.getByRole('heading', { name: /ZenithScope/i, level: 1 }).waitFor({
    state: 'visible',
    timeout: 15_000,
  });

  await page.locator('.dashboard-page').waitFor({
    state: 'visible',
    timeout: 15_000,
  });

  await page.locator('.dashboard-page__metrics > *').first().waitFor({
    state: 'visible',
    timeout: 15_000,
  });

  await page.locator('.dashboard-page__grid').waitFor({
    state: 'visible',
    timeout: 15_000,
  });

  await page.waitForFunction(
    () => {
      const charts = Array.from(
        document.querySelectorAll('.trend-chart canvas, .region-map__chart canvas'),
      );

      return (
        charts.length >= 2 &&
        charts.every((chart) => {
          const box = chart.getBoundingClientRect();
          return box.width > 0 && box.height > 0;
        })
      );
    },
    undefined,
    { timeout: 15_000 },
  );
}

async function assertScreenshotWritten(filePath) {
  const file = await stat(filePath);
  if (!file.isFile() || file.size <= 0) {
    throw new Error(`Screenshot file is empty: ${filePath}`);
  }

  return file.size;
}

async function main() {
  const consoleErrors = [];
  let browser;

  try {
    await mkdir(path.dirname(screenshotPath), { recursive: true });

    browser = await chromium.launch();
    const page = await browser.newPage({
      viewport,
      deviceScaleFactor: 1,
    });

    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    page.on('pageerror', (error) => {
      consoleErrors.push(formatError(error));
    });

    try {
      await page.goto(dashboardUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 30_000,
      });
    } catch (error) {
      throw new Error(`${formatError(error)}\n${startupHint}`, { cause: error });
    }

    await waitForDashboard(page);

    const loadingOrFailure = page.locator('.dashboard-page__fallback');
    if ((await loadingOrFailure.count()) > 0) {
      throw new Error('Dashboard is still showing a loading or failure fallback.');
    }

    await page.waitForTimeout(3_500);

    await page.screenshot({
      path: screenshotPath,
      fullPage: false,
    });

    const size = await assertScreenshotWritten(screenshotPath);
    const relativePath = path.relative(projectRoot, screenshotPath);

    console.log(`Dashboard screenshot saved: ${relativePath}`);
    console.log(`Viewport: ${viewport.width}x${viewport.height}`);
    console.log(`URL: ${dashboardUrl}`);
    console.log(`File size: ${size} bytes`);

    if (consoleErrors.length > 0) {
      console.error('Console errors detected during screenshot capture:');
      for (const [index, error] of consoleErrors.entries()) {
        console.error(`${index + 1}. ${error}`);
      }
      process.exitCode = 1;
      return;
    }

    console.log('Dashboard screenshot captured without console errors.');
  } catch (error) {
    console.error('Dashboard screenshot capture failed.');
    console.error(formatError(error));
    process.exitCode = 1;
  } finally {
    await browser?.close();
  }
}

await main();
