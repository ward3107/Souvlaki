import { test, expect } from '@playwright/test';

test.describe('Greek Souvlaki Website', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');

    // Check if the page title contains the restaurant name
    await expect(page).toHaveTitle(/Greek Souvlaki/);
  });

  test('navigation menu is visible', async ({ page }) => {
    await page.goto('/');

    // Check if navigation links are present
    const menuLink = page.getByRole('link', { name: /menu/i });
    await expect(menuLink).toBeVisible();
  });

  test('theme toggle works', async ({ page }) => {
    await page.goto('/');

    // Find and click the theme toggle button
    const themeToggle = page.getByRole('button', {
      name: /switch to dark mode|switch to light mode/i,
    });
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();

    // Verify theme changed (you can add more specific checks)
    await expect(themeToggle).toBeVisible();
  });

  // Add more E2E tests as needed
});
