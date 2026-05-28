import { test, expect } from '@playwright/test';

test('changing sort reorders shows within a genre', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('heading', { level: 2 }).first().waitFor();
  const firstCardBefore = await page.getByRole('listitem').first().textContent();
  await page.getByRole('combobox').selectOption('rating-asc');
  const firstCardAfter = await page.getByRole('listitem').first().textContent();
  expect(firstCardBefore).not.toEqual(firstCardAfter);
});
