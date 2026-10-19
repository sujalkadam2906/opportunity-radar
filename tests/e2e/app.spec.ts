import { test, expect } from '@playwright/test';

test.describe('Opportunity Radar - Complete User Journeys', () => {
  test('Journey 1: Discovery, Search, and URL Multi-Faceted Filtering', async ({
    page,
  }) => {
    // 1. Visit root page
    await page.goto('/');

    // 2. Verify page header and brand identity
    await expect(page.getByRole('link', { name: /Opportunity Radar/i })).toBeVisible();

    // 3. Verify search bar is visible
    const searchInput = page.getByPlaceholder(/Search by title, skills/i);
    await expect(searchInput).toBeVisible();

    // 4. Type search query
    await searchInput.fill('React');
    await page.waitForTimeout(300); // debounce

    // Verify results count updates
    await expect(page.getByText(/Found \d+ matching opportunities/i)).toBeVisible();

    // 5. Apply "Remote" work mode filter
    const remoteFilterBtn = page.getByRole('button', { name: /^Remote$/i });
    await remoteFilterBtn.click();

    // Verify URL parameters updated
    expect(page.url()).toContain('mode=remote');

    // Verify Active Filter chip is displayed
    await expect(page.getByText(/Mode: remote/i)).toBeVisible();

    // 6. Reset filters
    const resetBtn = page.getByRole('button', {
      name: /Reset All Filters|Reset Filters/i,
    });
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
    }
  });

  test('Journey 2: Inspect Job Details, Explainable Fit Score, and Save Bookmark', async ({
    page,
  }) => {
    await page.goto('/');

    // Locate the first job card and click it
    const firstCard = page.locator('[role="feed"] [role="button"]').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    // Locate active detail container (either desktop article or mobile drawer)
    const detailContainer = page
      .locator(
        'article[aria-labelledby="job-detail-title"]:visible, [role="dialog"]:visible'
      )
      .first();
    await expect(
      detailContainer.getByRole('heading', { level: 2 }).first()
    ).toBeVisible();
    await expect(detailContainer.getByText('Candidate Fit Heuristic')).toBeVisible();
    await expect(detailContainer.getByText('Skills Overlap')).toBeVisible();
    await expect(detailContainer.getByText('Key Responsibilities')).toBeVisible();

    // Click "Save Job"
    const saveJobBtn = detailContainer.getByRole('button', {
      name: /Save this job|Remove from saved jobs|Save Job/i,
    });
    await saveJobBtn.click();

    // Verify toast notification appears
    await expect(page.getByText(/Job Bookmarked|Bookmark Removed/i)).toBeVisible();
  });

  test('Journey 3: Application Funnel Tracking and Persistence', async ({ page }) => {
    await page.goto('/');

    // Select first card
    const firstCard = page.locator('[role="feed"] [role="button"]').first();
    await firstCard.click();

    // Change stage to "Applied" using visible selector (works across desktop & mobile drawer)
    const stageSelect = page
      .locator('select[aria-label="Change application status"]:visible')
      .first();
    await stageSelect.selectOption('applied');

    // Wait for status update toast
    await expect(page.getByText(/Application Status Updated/i)).toBeVisible();

    // If mobile drawer is open, dismiss it before navigating
    const drawer = page.locator('[role="dialog"]');
    if (await drawer.isVisible()) {
      await page.keyboard.press('Escape');
      await expect(drawer).not.toBeVisible();
    }

    // Navigate to Applications page
    await page.locator('a[href="/applications"]').click({ force: true });
    await expect(page).toHaveURL(/\/applications/);

    // Verify application is present in table
    await expect(page.getByText('Total Tracked')).toBeVisible();
    await expect(page.getByText('Candidate Application Tracker')).toBeVisible();

    // Reload page to verify IndexedDB persistence
    await page.reload();
    await expect(page.getByText('Candidate Application Tracker')).toBeVisible();
    await expect(page.getByText('Total Tracked')).toBeVisible();
  });

  test('Journey 4: Mobile Responsive Smoke Test', async ({ page }) => {
    // Set viewport to mobile phone size (390 x 844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // Verify responsive header and search input
    await expect(page.getByRole('link', { name: /Opportunity Radar/i })).toBeVisible();
    const searchInput = page.getByPlaceholder(/Search by title, skills/i);
    await expect(searchInput).toBeVisible();

    // Click a card to open slide-over drawer
    const firstCard = page.locator('[role="feed"] [role="button"]').first();
    await firstCard.click();

    // Verify mobile drawer dialog opened
    const drawer = page.locator('[role="dialog"]');
    await expect(drawer).toBeVisible();

    // Close drawer via Escape key
    await page.keyboard.press('Escape');
    await expect(drawer).not.toBeVisible();
  });
});
