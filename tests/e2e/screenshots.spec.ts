import { test } from '@playwright/test';
import path from 'path';

test.describe('Capture Verified Application Screenshots', () => {
  const screenshotsDir = path.resolve(process.cwd(), 'docs/screenshots');

  test('Capture Desktop Discover and Detail Views', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // Wait for jobs to load
    await page.waitForSelector('[role="feed"] [role="button"]');
    await page.waitForTimeout(500);

    // 1. Capture primary discovery view
    await page.screenshot({
      path: path.join(screenshotsDir, '01-desktop-discover.png'),
      fullPage: false,
    });

    // 2. Select a job card to show detail pane
    const firstCard = page.locator('[role="feed"] [role="button"]').first();
    await firstCard.click();
    await page.waitForTimeout(300);

    await page.screenshot({
      path: path.join(screenshotsDir, '02-desktop-job-detail.png'),
      fullPage: false,
    });

    // 3. Filter by "Remote"
    const remoteBtn = page.getByRole('button', { name: /^Remote$/i });
    await remoteBtn.click();
    await page.waitForTimeout(300);

    await page.screenshot({
      path: path.join(screenshotsDir, '03-desktop-filtered-remote.png'),
      fullPage: false,
    });
  });

  test('Capture Application Tracker View', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // Select first card and mark as "Applied"
    const firstCard = page.locator('[role="feed"] [role="button"]').first();
    await firstCard.click();
    const stageSelect = page.getByLabel('Change application status');
    await stageSelect.selectOption('applied');
    await page.waitForTimeout(400);

    // Navigate to Applications page
    await page.getByRole('link', { name: /Applications/i }).click();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(screenshotsDir, '04-desktop-applications-tracker.png'),
      fullPage: false,
    });
  });

  test('Capture Mobile Responsive Views', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await page.waitForSelector('[role="feed"] [role="button"]');
    await page.waitForTimeout(500);

    // Mobile discovery list
    await page.screenshot({
      path: path.join(screenshotsDir, '05-mobile-discover.png'),
      fullPage: false,
    });

    // Open detail drawer on mobile
    const firstCard = page.locator('[role="feed"] [role="button"]').first();
    await firstCard.click();
    await page.waitForSelector('[role="dialog"]');
    await page.waitForTimeout(400);

    await page.screenshot({
      path: path.join(screenshotsDir, '06-mobile-detail-drawer.png'),
      fullPage: false,
    });
  });
});
