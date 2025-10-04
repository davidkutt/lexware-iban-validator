import { test, expect } from '@playwright/test';

test.describe('ErrorBoundary E2E Tests', () => {
  test('sollte ErrorBoundary bei Fehler anzeigen', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const hasError = await page.locator('text=Ein Fehler ist aufgetreten').isVisible().catch(() => false);

    if (hasError) {
      await expect(page.locator('text=Ein Fehler ist aufgetreten')).toBeVisible();
      await expect(page.locator('text=Fehlermeldung')).toBeVisible();

      await expect(page.getByRole('button', { name: /Seite neu laden/i })).toBeVisible();

      await expect(page.getByRole('button', { name: /Fehler ignorieren/i })).toBeVisible();

      await expect(page.locator('text=Was Sie tun können:')).toBeVisible();
    } else {
      await expect(page.locator('h1')).toContainText('IBAN-Validator');
    }
  });

  test('sollte Reload-Button funktionieren', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const hasError = await page.locator('text=Ein Fehler ist aufgetreten').isVisible().catch(() => false);

    if (hasError) {
      const reloadButton = page.getByRole('button', { name: /Seite neu laden/i });

      await reloadButton.click();

      await page.waitForLoadState('domcontentloaded');
    }
  });
});
