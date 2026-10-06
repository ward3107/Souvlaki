import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

for (const language of ['en', 'he', 'ar', 'ru', 'el']) {
  test(`the ${language} homepage fits a 320px screen with accessible signature links`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 667 });
    await page.addInitScript(() => {
      localStorage.setItem('cookieConsent', 'essential');
      Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 2 });
    });
    await page.goto(language === 'en' ? '/' : `/${language}/`);
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await expect(page.locator('h1')).toBeVisible();
    const signature = page.locator('[data-builder-signature]');
    await signature.scrollIntoViewIfNeeded();
    await expect(signature.getByRole('navigation')).toBeVisible();
    await expect(
      signature.getByRole('link', { name: 'VASIA Facebook', exact: true })
    ).toHaveAttribute('href', 'https://www.facebook.com/profile.php?id=61594997720112');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true
    );
  });
}

test('limited devices retain the full story without downloading decorative videos', async ({
  page,
  browserName,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem('cookieConsent', 'essential');
    Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, get: () => 2 });
    Object.defineProperty(navigator, 'deviceMemory', { configurable: true, get: () => 2 });
  });
  if (browserName === 'chromium') {
    const session = await page.context().newCDPSession(page);
    await session.send('Emulation.setCPUThrottlingRate', { rate: 6 });
  }
  const videos: string[] = [];
  const errors: string[] = [];
  page.on('request', (request) => {
    if (/\.mp4(?:\?|$)/.test(request.url())) videos.push(request.url());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/he/');
  await expect(page.locator('html')).toHaveAttribute('data-effects', 'lite');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  const story = page.locator('[data-journey="static"]');
  await story.scrollIntoViewIfNeeded();
  await expect(story.locator('figcaption')).toHaveCount(4);
  for (const caption of await story.locator('figcaption').all())
    await expect(caption).toBeVisible();
  await page.locator('[data-builder-signature]').scrollIntoViewIfNeeded();
  await expect(page.getByRole('link', { name: 'VASIA WhatsApp', exact: true })).toHaveAttribute(
    'href',
    'https://wa.me/972534260632'
  );
  await expect(page.locator('[data-builder-signature] nav a')).toHaveCount(8);
  expect(videos).toEqual([]);
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  );
});

test('reduced-motion visitors keep a complete static composition', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('[data-journey="static"]')).toBeAttached();
  await expect(page.locator('video[src]')).toHaveCount(0);
  await page.getByRole('button', { name: 'View Menu', exact: true }).click();
  await expect(page).toHaveURL(/\/menu$/);
  await expect(page.getByRole('heading', { name: 'Our Menu', exact: true })).toBeVisible();
});

test('section navigation from the menu aligns contact below the sticky header', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem('language', 'en');
    localStorage.setItem('cookieConsent', 'essential');
  });
  await page.goto('/menu');
  if ((page.viewportSize()?.width ?? 1024) < 768) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  await page.getByRole('button', { name: 'Contact', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect
    .poll(
      async () =>
        page
          .locator('#contact')
          .evaluate((element) => Math.abs(element.getBoundingClientRect().top - 80)),
      { timeout: 10000 }
    )
    .toBeLessThan(8);
});

test('capable desktops retain cinematic video and can switch to reduced motion', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Touch devices intentionally use the static composition.');
  await page.addInitScript(() => {
    localStorage.setItem('cookieConsent', 'essential');
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });
    Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 });
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-effects', 'full');
  const hero = page.locator('#home video');
  await expect(hero).toHaveAttribute('src', '/gallery/hero-bg.mp4');
  await page.locator('footer').scrollIntoViewIfNeeded();
  await expect.poll(() => hero.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('[data-journey="static"]')).toBeAttached();
  await expect(page.locator('video')).toHaveCount(0);
});
