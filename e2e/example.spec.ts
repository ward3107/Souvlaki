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

  test('mobile customer can build an order and hand it off without losing the cart', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('language', 'en');
      Object.defineProperty(window, 'open', {
        configurable: true,
        value: (url: string) => {
          (window as typeof window & { openedWhatsAppUrl?: string }).openedWhatsAppUrl = url;
          return null;
        },
      });
    });
    await page.goto('/menu');

    await page.getByRole('button', { name: 'Sides', exact: true }).click();
    await page.getByRole('button', { name: /Fries — Tap for details/ }).click();
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('Added to your order');

    await page.getByText('View order', { exact: true }).click();
    const sendButton = page.getByRole('button', { name: 'Send via WhatsApp' });
    await expect(sendButton).toBeEnabled();
    await sendButton.click();
    await expect(page.getByRole('alert')).toContainText('Enter your name');

    await page.getByRole('textbox', { name: 'Name' }).fill('Sam');
    await page.getByRole('textbox', { name: 'Order note' }).fill('No onions');
    await sendButton.click();

    const openedUrl = await page.evaluate(
      () => (window as typeof window & { openedWhatsAppUrl?: string }).openedWhatsAppUrl
    );
    expect(openedUrl).toContain('https://wa.me/');
    expect(decodeURIComponent(openedUrl ?? '')).toContain('No onions');
    await expect(page.getByText('View order', { exact: true })).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => JSON.parse(localStorage.getItem('souvlaki-cart-v1') ?? '[]').length)
      )
      .toBe(1);
  });

  // Add more E2E tests as needed
});
