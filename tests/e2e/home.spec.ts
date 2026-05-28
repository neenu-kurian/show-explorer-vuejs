import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test('loads home page and renders genre sections', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('TV Maze');
  await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible({ timeout: 10000 });
});

test('show cards are clickable and navigate to detail', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('heading', { level: 2 }).first().waitFor();
  await page.getByRole('link').first().click();
  await expect(page).toHaveURL(/\/show\/\d+/);
  await expect(page.getByText('Back to shows')).toBeVisible();
});

test('navigates back to home from show detail', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('heading', { level: 2 }).first().waitFor();
  await page.getByRole('link').first().click();
  await expect(page).toHaveURL(/\/show\/\d+/);
  await page.getByText('Back to shows').click();
  await expect(page).toHaveURL('/');
});

test('renders show details correctly', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('heading', { level: 2 }).first().waitFor();
  await page.getByRole('link').first().click();
  await expect(page).toHaveURL(/\/show\/\d+/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 });
  const chips = page.locator('.rounded-full');
  await expect(chips.first()).toBeVisible();
  const description = page.locator('div.whitespace-pre-line');
  await expect(description).toBeVisible();
});

test('home page has no auto-detected accessibility violations', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('heading', { level: 2 }).first().waitFor({ timeout: 10000 });
  const results = await new AxeBuilder({ page })
    .exclude('.vue-devtools__anchor-btn')
    .analyze();
  const violations = results.violations.map(
    (v) => `[${v.impact}] ${v.id}: ${v.description}\n    ${v.nodes.map((n) => n.html).join('\n    ')}`
  );
  expect(violations).toEqual([]);
});
