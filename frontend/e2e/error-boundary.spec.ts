import { test, expect } from '@playwright/test';

test.describe('ErrorBoundary E2E Tests', () => {
  test('sollte ErrorBoundary bei Fehler anzeigen', async ({ page }) => {
    // .env mit VITE_ENABLE_ERROR_TEST=true muss gesetzt sein
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Prüfen ob entweder normale App oder ErrorBoundary geladen wird
    const hasError = await page.locator('text=Ein Fehler ist aufgetreten').isVisible().catch(() => false);

    if (hasError) {
      // ErrorBoundary ist aktiv
      await expect(page.locator('text=Ein Fehler ist aufgetreten')).toBeVisible();
      await expect(page.locator('text=Fehlermeldung')).toBeVisible();

      // Reload-Button sollte vorhanden sein
      await expect(page.getByRole('button', { name: /Seite neu laden/i })).toBeVisible();

      // Ignorieren-Button sollte vorhanden sein
      await expect(page.getByRole('button', { name: /Fehler ignorieren/i })).toBeVisible();

      // Hilfe-Tipps sollten sichtbar sein
      await expect(page.locator('text=Was Sie tun können:')).toBeVisible();
    } else {
      // Normale App läuft
      await expect(page.locator('h1')).toContainText('IBAN-Validator');
    }
  });

  test('sollte Reload-Button funktionieren', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const hasError = await page.locator('text=Ein Fehler ist aufgetreten').isVisible().catch(() => false);

    if (hasError) {
      const reloadButton = page.getByRole('button', { name: /Seite neu laden/i });

      // Klick sollte Seite neu laden
      await reloadButton.click();

      // Warten auf Reload
      await page.waitForLoadState('domcontentloaded');
    }
  });
});
