import { test, expect } from '@playwright/test';

test('typing triggers search and shows results', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('searchbox').fill('Breaking Bad');
  await expect(page.getByRole('heading', { level: 2 })).not.toBeVisible();
  await expect(page.getByText('Breaking Bad').first()).toBeVisible({ timeout: 5000 });
});

test('handles no search results gracefully', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Search for TV shows...').fill('tdfgdfgdfgdfg');
  await page.getByRole('search').click();
  await expect(page.getByText('No shows found')).toBeVisible();
});

test('clearing search restores catalog', async ({ page }) => {
  await page.goto('/');
  const input = page.getByRole('searchbox');
  await input.fill('Breaking Bad');
  await page.getByText('Breaking Bad').first().waitFor({ timeout: 5000 });
  await input.clear();
  await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible({ timeout: 10000 });
});

test('shows "no results" for a wrong search term', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('searchbox').fill('dfgddfgdfgdfgdfdfgdfg');
  await expect(page.getByText(/no shows found matching "dfgddfgdfgdfgdfdfgdfg"/i)).toBeVisible({ timeout: 5000 });
});
