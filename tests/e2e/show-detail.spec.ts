import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test('navigates to show detail and back', async ({ page }) => {
  await page.goto('/show/1');
  await expect(page.getByText('Back to shows')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 });
  await page.getByText('Back to shows').click();
  await expect(page).toHaveURL('/');
});

test('invalid show ID redirects to 404', async ({ page }) => {
  await page.goto('/show/3823482384238432');
  await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible({ timeout: 10000 });
});

test('non-numeric show path goes to 404', async ({ page }) => {
  await page.goto('/show/abc');
  await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
});

test('show detail page has no auto-detected accessibility violations', async ({ page }) => {
  await page.goto('/show/1');
  await page.getByRole('heading', { level: 1 }).waitFor({ timeout: 10000 });
  const results = await new AxeBuilder({ page })
    .exclude('.vue-devtools__anchor-btn')
    .analyze();
  const violations = results.violations.map(
    (v) => `[${v.impact}] ${v.id}: ${v.description}\n    ${v.nodes.map((n) => n.html).join('\n    ')}`
  );
  expect(violations).toEqual([]);
});
