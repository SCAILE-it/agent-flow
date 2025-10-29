// ABOUTME: Screenshot capture for UX/UI analysis
// ABOUTME: Takes screenshots of different app states for design review

import { test, expect, type Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3012';

test.describe('UX/UI Analysis Screenshots', () => {
  test('Capture main app state', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);

    // Full page screenshot
    await page.screenshot({
      path: 'test-results/ux-analysis/01-main-view.png',
      fullPage: true
    });
  });

  test('Capture workflow timeline', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);

    // Screenshot of workflow panel
    const workflowPanel = page.locator('[data-panel-id*="workflow"]').first();
    await workflowPanel.screenshot({
      path: 'test-results/ux-analysis/02-workflow-timeline.png'
    });
  });

  test('Capture agent configuration panel', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);

    // Click on a node
    await page.getByRole('heading', { name: 'Blog Writer' }).click();
    await page.waitForTimeout(500);

    // Screenshot of agent config
    await page.screenshot({
      path: 'test-results/ux-analysis/03-agent-config.png',
      fullPage: true
    });
  });

  test('Capture JSON view', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);

    // Switch to JSON view
    const jsonButton = page.getByRole('button', { name: /JSON View/i }).first();
    await jsonButton.click();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'test-results/ux-analysis/04-json-view.png',
      fullPage: true
    });
  });

  test('Capture sidebar expanded', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);

    // Click workflows section
    await page.getByText('WORKFLOWS').first().click();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'test-results/ux-analysis/05-sidebar-expanded.png',
      fullPage: true
    });
  });

  test('Capture during execution', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);

    // Click Run
    const runButton = page.getByRole('button', { name: /Run Workflow/i });
    await runButton.click();

    // Wait a bit to capture "running" state
    await page.waitForTimeout(5000);

    await page.screenshot({
      path: 'test-results/ux-analysis/06-execution-running.png',
      fullPage: true
    });
  });

  test('Capture toolbar closeup', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);

    // Screenshot toolbar area
    const toolbar = page.locator('.flex.items-center.justify-between.h-12').first();
    await toolbar.screenshot({
      path: 'test-results/ux-analysis/07-toolbar.png'
    });
  });

  test('Capture global config panel', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);

    // Scroll to global config
    const globalConfig = page.getByText('Global Configuration').first();
    await globalConfig.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'test-results/ux-analysis/08-global-config.png',
      fullPage: true
    });
  });

  test('Capture status bar', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);

    // Screenshot bottom status bar
    const statusBar = page.locator('.flex.items-center.h-10').last();
    await statusBar.screenshot({
      path: 'test-results/ux-analysis/09-status-bar.png'
    });
  });

  test('Capture mobile view (responsive)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: 'test-results/ux-analysis/10-mobile-view.png',
      fullPage: true
    });
  });
});
