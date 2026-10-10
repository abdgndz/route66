import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/lessons', '/privacy', '/terms'];

for (const path of pages) {
  test(`${path}: no horizontal scroll, one h1, no serious a11y issues`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`)).toEqual([]);
  });
}

test('every WhatsApp link has a UK number and a prefilled message', async ({ page }) => {
  await page.goto('/');
  const hrefs = await page.locator('a[href^="https://wa.me/"]').evaluateAll((els) => els.map((e) => e.getAttribute('href')!));
  expect(hrefs.length).toBeGreaterThan(4);
  for (const href of hrefs) {
    expect(href).toMatch(/^https:\/\/wa\.me\/44\d{9,10}\?text=.+/);
    expect(decodeURIComponent(href.split('text=')[1])).toContain('route66drivingschool.co.uk');
  }
});

test('phone links use international format', async ({ page }) => {
  await page.goto('/');
  const tels = await page.locator('a[href^="tel:"]').evaluateAll((els) => els.map((e) => e.getAttribute('href')!));
  expect(tels.length).toBeGreaterThan(2);
  for (const t of tels) expect(t).toMatch(/^tel:\+44\d{9,10}$/);
});

test('WhatsApp button opens the instructor chooser', async ({ page }) => {
  await page.goto('/');
  await page.locator('.hero [data-wa-chooser]').click();
  const dialog = page.locator('#wa-chooser');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('a[href^="https://wa.me/"]')).toHaveCount(2);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('sticky contact bar appears only after the hero', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only');
  await page.goto('/');
  const bar = page.locator('[data-sticky]');
  await expect(bar).not.toHaveClass(/is-visible/);
  await page.locator('#faq').scrollIntoViewIfNeeded();
  await expect(bar).toHaveClass(/is-visible/);
});

test('home page JSON-LD is valid and has no review markup', async ({ page }) => {
  await page.goto('/');
  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  const data = JSON.parse(raw!);
  expect(data['@type']).toEqual(['LocalBusiness', 'EducationalOrganization']);
  expect(data.areaServed.length).toBeGreaterThan(10);
  expect(raw).not.toContain('aggregateRating');
  expect(raw).not.toContain('"review"');
});

test('banned marketing claims are absent', async ({ page }) => {
  for (const path of pages) {
    await page.goto(path);
    const text = (await page.locator('body').innerText()).toLowerCase();
    for (const banned of ['pass rate', 'guaranteed', 'the best', 'no.1', 'dvsa approved instructors']) {
      expect(text, `${path} contains "${banned}"`).not.toContain(banned);
    }
  }
});

test('live site is open to search engines, with no draft leftovers', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  await expect(page.locator('.draft-banner')).toHaveCount(0);
  await expect(page.locator('mark.ph')).toHaveCount(0);
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Allow: /');
  expect(robots).toContain('Sitemap: https://route66drivingschool.co.uk/sitemap-index.xml');
  const res = await request.get('/');
  expect(res.headers()['x-robots-tag']).toBeUndefined();
  const body = (await page.locator('body').innerText()).toLowerCase();
  for (const leftover of ['sample', 'placeholder', 'owner\'s full name', 'tn11 0xx']) expect(body).not.toContain(leftover);
});

test('sitemap and 404 work', async ({ request, page }) => {
  expect((await request.get('/sitemap-index.xml')).status()).toBe(200);
  await page.goto('/does-not-exist');
  await expect(page.locator('h1')).toHaveText('Wrong turn');
});

test('analytics only loads after consent', async ({ page }) => {
  const gaRequests: string[] = [];
  page.on('request', (r) => {
    if (r.url().includes('googletagmanager.com')) gaRequests.push(r.url());
  });
  await page.route('**/googletagmanager.com/**', (r) => r.fulfill({ status: 200, body: '' }));
  await page.goto('/');
  const banner = page.locator('#cookie-banner');
  await expect(banner).toBeVisible();
  await page.waitForTimeout(300);
  expect(gaRequests).toHaveLength(0);

  await banner.getByRole('button', { name: 'No thanks' }).click();
  await expect(banner).toBeHidden();
  await page.reload();
  await expect(banner).toBeHidden();
  expect(gaRequests).toHaveLength(0);

  await page.getByRole('link', { name: 'Cookie settings' }).click();
  await banner.getByRole('button', { name: 'Accept' }).click();
  await expect.poll(() => gaRequests.length).toBeGreaterThan(0);
  expect(gaRequests[0]).toContain('G-1KLBW6DXVR');
});
