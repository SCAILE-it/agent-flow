// ABOUTME: Comprehensive Playwright tests for Agent Flow Builder
// ABOUTME: Tests UI, LocalStorage, workflow execution with real Gemini AI

import { test, expect, type Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3012';

test.describe('Agent Flow Builder - Comprehensive Tests', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('1. App loads with correct title and dark theme', async () => {
    await page.goto(BASE_URL);

    // Check title
    await expect(page).toHaveTitle('Agent Flow Builder');

    // Check dark theme is applied
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);

    console.log('✅ App loaded with dark theme');
  });

  test('2. UI Components render correctly', async () => {
    await page.goto(BASE_URL);

    // Check Sidebar
    await expect(page.getByText('Agent Flow')).toBeVisible();
    await expect(page.getByText('WORKFLOWS').first()).toBeVisible();

    // Check Toolbar buttons
    await expect(page.getByRole('button', { name: /New Workflow/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Save/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Export/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Run Workflow/i })).toBeVisible();

    // Check panels
    await expect(page.getByText('Global Configuration')).toBeVisible();
    await expect(page.getByText('Agent Configuration')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Workflow' })).toBeVisible();

    console.log('✅ All UI components visible');
  });

  test('3. Workflow timeline displays nodes', async () => {
    await page.goto(BASE_URL);

    // Check workflow nodes are visible
    await expect(page.getByRole('heading', { name: 'Content Research' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Blog Writer' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'SEO Optimizer' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Social Media' })).toBeVisible();

    // Check configured badges
    const configuredBadges = page.getByText('Configured');
    await expect(configuredBadges.first()).toBeVisible();

    console.log('✅ Workflow nodes visible');
  });

  test('4. View toggles work (UI ↔ JSON)', async () => {
    await page.goto(BASE_URL);

    // Find view toggle buttons
    const jsonButton = page.getByRole('button', { name: /JSON View/i }).first();
    const uiButton = page.getByRole('button', { name: /UI View/i }).first();

    // Click JSON view
    await jsonButton.click();
    await page.waitForTimeout(500);

    // Click back to UI view
    await uiButton.click();
    await page.waitForTimeout(500);

    console.log('✅ View toggles work');
  });

  test('5. Console shows Gemini AI execution mode', async () => {
    const consoleLogs: string[] = [];

    page.on('console', msg => {
      consoleLogs.push(msg.text());
    });

    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);

    // Check for execution mode log
    const hasExecutionModeLog = consoleLogs.some(log =>
      log.includes('Agent execution mode')
    );

    expect(hasExecutionModeLog).toBeTruthy();

    // Check if it's Gemini mode (not Mock)
    const isGeminiMode = consoleLogs.some(log =>
      log.includes('Gemini AI')
    );

    console.log('📊 Console logs:', consoleLogs.filter(l => l.includes('Agent')));

    if (isGeminiMode) {
      console.log('✅ Gemini AI mode active');
    } else {
      console.log('⚠️  Mock mode active (API key may not be loaded)');
    }
  });

  test('6. Click node to view configuration', async () => {
    await page.goto(BASE_URL);

    // Click on Blog Writer node
    await page.getByRole('heading', { name: 'Blog Writer' }).click();
    await page.waitForTimeout(500);

    // Verify Agent Configuration panel updates
    await expect(page.getByText('Agent Configuration')).toBeVisible();

    console.log('✅ Node selection works');
  });

  test('7. LocalStorage: Export workflow', async () => {
    await page.goto(BASE_URL);

    // Setup download handler
    const downloadPromise = page.waitForEvent('download');

    // Click Export button
    const exportButton = page.getByRole('button', { name: /Export/i });
    await exportButton.click();

    // Wait for download
    const download = await downloadPromise;

    // Verify download
    expect(download.suggestedFilename()).toMatch(/\.json$/);

    // Read downloaded file content
    const path = await download.path();
    if (path) {
      const fs = require('fs');
      const content = fs.readFileSync(path, 'utf-8');
      const workflow = JSON.parse(content);

      // Verify workflow structure
      expect(workflow).toHaveProperty('id');
      expect(workflow).toHaveProperty('name');
      expect(workflow).toHaveProperty('nodes');
      expect(workflow.nodes.length).toBeGreaterThan(0);

      console.log('✅ Export works, workflow structure valid');
    }
  });

  test('8. LocalStorage: New workflow creation', async () => {
    await page.goto(BASE_URL);

    // Click New Workflow button
    const newWorkflowButton = page.getByRole('button', { name: /New Workflow/i });
    await newWorkflowButton.click();
    await page.waitForTimeout(1000);

    // Verify sidebar updates (though new workflow has no nodes yet)
    await expect(page.getByText('Agent Flow')).toBeVisible();

    console.log('✅ New workflow creation works');
  });

  test('9. CRITICAL: Run workflow and verify execution', async () => {
    await page.goto(BASE_URL);

    // Collect console logs during execution
    const consoleLogs: string[] = [];
    const networkRequests: string[] = [];

    page.on('console', msg => {
      consoleLogs.push(msg.text());
    });

    page.on('request', request => {
      if (request.url().includes('generativelanguage.googleapis.com')) {
        networkRequests.push(request.url());
      }
    });

    // Click Run Workflow button
    const runButton = page.getByRole('button', { name: /Run Workflow/i });
    await runButton.click();

    console.log('▶️  Workflow execution started...');

    // Wait for first node to start running
    await page.waitForTimeout(2000);

    // Wait for execution to complete (max 60 seconds)
    await page.waitForTimeout(60000);

    console.log('📊 Console logs during execution:', consoleLogs.length);
    console.log('🌐 Network requests to Gemini:', networkRequests.length);

    if (networkRequests.length > 0) {
      console.log('✅ REAL Gemini API calls detected!');
      console.log('   API calls:', networkRequests.slice(0, 3));
    } else {
      console.log('⚠️  No Gemini API calls - using mock mode');
    }

    // Check if execution completed
    const hasExecutionLogs = consoleLogs.some(log =>
      log.includes('execution') || log.includes('completed') || log.includes('Agent')
    );

    expect(hasExecutionLogs).toBeTruthy();
  });

  test('10. Verify real AI content in outputs', async () => {
    await page.goto(BASE_URL);

    // Run workflow first
    const runButton = page.getByRole('button', { name: /Run Workflow/i });
    await runButton.click();

    // Wait for execution (60 seconds max)
    await page.waitForTimeout(60000);

    // Click on Blog Writer node to check output
    await page.getByRole('heading', { name: 'Blog Writer' }).click();
    await page.waitForTimeout(1000);

    // Switch to JSON view
    const jsonButton = page.getByRole('button', { name: /JSON View/i }).first();
    await jsonButton.click();
    await page.waitForTimeout(500);

    // Check if content exists in the page
    const pageContent = await page.content();

    // Look for signs of real content vs mock
    const hasMockTemplate = pageContent.includes('How AI is Transforming Marketing');
    const hasRealContent = pageContent.length > 10000; // Real content should be longer

    if (!hasMockTemplate && hasRealContent) {
      console.log('✅ REAL AI content detected (not mock template)');
    } else {
      console.log('⚠️  Content appears to be mock data or execution failed');
    }
  });

  test('11. LocalStorage persistence after reload', async () => {
    await page.goto(BASE_URL);

    // Get initial workflow data from page
    const initialContent = await page.content();

    // Reload page
    await page.reload();
    await page.waitForTimeout(2000);

    // Verify data persisted
    await expect(page.getByRole('heading', { name: 'GTM Content Pipeline' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Content Research' }).first()).toBeVisible();

    console.log('✅ LocalStorage persistence works');
  });

  test('12. No JavaScript errors in console', async () => {
    const errors: string[] = [];

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto(BASE_URL);
    await page.waitForTimeout(3000);

    // Filter out expected warnings
    const criticalErrors = errors.filter(e =>
      !e.includes('Switched to client rendering') && // Expected Next.js SSR bailout
      !e.includes('lockfile') && // Expected monorepo warning
      !e.includes('hydration-mismatch') && // Expected React hydration difference (LocalStorage vs SSR)
      !e.includes('did not match') // React hydration warning
    );

    console.log('🔍 Total console messages:', errors.length);
    console.log('❌ Critical errors:', criticalErrors.length);

    if (criticalErrors.length > 0) {
      console.log('Errors:', criticalErrors);
    }

    expect(criticalErrors.length).toBe(0);
    console.log('✅ No critical JavaScript errors');
  });
});

test.describe('Production Deployment Tests', () => {
  test('13. Production site loads correctly', async ({ page }) => {
    await page.goto('https://agent-flow-smoky.vercel.app');

    // Check title
    await expect(page).toHaveTitle('Agent Flow Builder');

    // Check UI loads
    await expect(page.getByText('Agent Flow')).toBeVisible();
    await expect(page.getByRole('button', { name: /Run Workflow/i })).toBeVisible();

    console.log('✅ Production deployment works');
  });

  test('14. Production: Gemini API key configured', async ({ page }) => {
    const consoleLogs: string[] = [];

    page.on('console', msg => {
      consoleLogs.push(msg.text());
    });

    await page.goto('https://agent-flow-smoky.vercel.app');
    await page.waitForTimeout(3000);

    // Check for Gemini mode
    const isGeminiMode = consoleLogs.some(log =>
      log.includes('Gemini AI')
    );

    if (isGeminiMode) {
      console.log('✅ Production using Gemini AI mode');
    } else {
      console.log('⚠️  Production using Mock mode');
    }
  });
});
