import { test, expect } from '@playwright/test';

test.describe('Greek Souvlaki Website', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');

    // Check if the page title contains the restaurant name
    await expect(page).toHaveTitle(/Greek Souvlaki/);
  });

  test('navigation menu is visible', async ({ page }) => {
    // Force English so the test is deterministic across runners regardless
    // of browser locale.
    await page.addInitScript(() => {
      window.localStorage.setItem('language', 'en');
    });
    await page.goto('/');

    // On mobile viewports the desktop nav is hidden behind a burger button.
    // Open it first if needed.
    const burger = page.getByRole('button', { name: 'Open menu' });
    if (await burger.isVisible().catch(() => false)) {
      await burger.click();
    }

    // Nav items are <button> (they trigger smooth-scroll, not real navigation).
    // Match by exact name to avoid catching "Open menu", "View Menu" CTA, etc.
    const menuButton = page.getByRole('button', { name: 'Menu', exact: true }).first();
    await expect(menuButton).toBeVisible();
  });

  test('theme toggle works', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('language', 'en');
    });
    await page.goto('/');

    const themeToggle = page.getByRole('button', {
      name: /switch to dark mode|switch to light mode/i,
    });
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();
    await expect(themeToggle).toBeVisible();
  });

  // Add more E2E tests as needed
});
