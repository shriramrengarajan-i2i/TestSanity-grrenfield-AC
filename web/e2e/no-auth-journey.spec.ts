import { test, expect } from '@playwright/test';

const TABS = ['Home', 'Varieties', 'Growing', 'Nutrition', 'Recipes', 'Safety'];

// Fresh, cookie-less browser context per test (Playwright default):
// proves a brand-new visitor never sees an auth prompt (REQ-120–REQ-123).
test('full browse + chat journey requires no login, registration or account step', async ({ page }) => {
  const requestsWithCredentials: string[] = [];
  page.on('request', (request) => {
    if (request.headers()['authorization'] || request.headers()['cookie']) {
      requestsWithCredentials.push(request.url());
    }
  });

  await page.goto('/');

  for (const tab of TABS) {
    await page.getByRole('link', { name: tab, exact: true }).click();
    await expect(page.getByRole('heading', { name: tab, exact: true })).toBeVisible();
  }

  await expect(
    page.getByRole('heading', { name: /sign in|log in|register|create an account/i }),
  ).toHaveCount(0);

  await page.getByRole('button', { name: 'Open chat' }).click();
  await page.getByLabel('Ask a question').fill('What is a microgreen?');
  await page.getByRole('button', { name: 'Send' }).click();

  await expect(page.getByText(/thanks for your message/i)).toBeVisible();

  expect(requestsWithCredentials).toEqual([]);
});
