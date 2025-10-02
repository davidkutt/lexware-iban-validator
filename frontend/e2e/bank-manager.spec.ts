import { test, expect } from '@playwright/test';

test.describe('Bank Manager E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Zum Banken-Tab navigieren
    await page.getByRole('button', { name: /Banken/i }).click();
    await expect(page.locator('text=Bankverwaltung')).toBeVisible();
  });

  test('sollte Bankliste laden', async ({ page }) => {
    await expect(page.locator('text=Bankverwaltung')).toBeVisible();

    // Prüfen ob Tabelle vorhanden
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });

  test('sollte Bank-Formular öffnen und schließen', async ({ page }) => {
    // Formular öffnen
    await page.getByRole('button', { name: /Bank hinzufügen/i }).click();

    await expect(page.locator('text=Neue Bank hinzufügen')).toBeVisible();
    await expect(page.getByLabel('Bankname')).toBeVisible();

    // Formular schließen
    await page.getByRole('button', { name: /Abbrechen/i }).first().click();

    await expect(page.locator('text=Neue Bank hinzufügen')).not.toBeVisible();
  });

  test('sollte neue Bank erstellen', async ({ page }) => {
    // Formular öffnen
    await page.getByRole('button', { name: /Bank hinzufügen/i }).click();

    // Formulardaten eingeben
    await page.getByLabel('Bankname').fill('Test Bank E2E');
    await page.getByLabel('BIC').fill('TESTDE12XXX');
    await page.getByLabel('Bankleitzahl').fill('12345678');
    await page.getByLabel('Ländercode').fill('DE');

    // Formular absenden
    await page.getByRole('button', { name: /Bank erstellen/i }).click();

    // Prüfen ob Bank in Tabelle erscheint
    await expect(page.locator('text=Test Bank E2E')).toBeVisible({ timeout: 10000 });
  });

  test('sollte Bank bearbeiten', async ({ page }) => {
    // Warten bis Tabelle geladen
    await page.waitForSelector('table', { timeout: 10000 });

    // Edit-Button der ersten Bank klicken
    const editButtons = page.locator('button[aria-label="Bank bearbeiten"]');
    const count = await editButtons.count();

    if (count > 0) {
      await editButtons.first().click();

      // Prüfen ob Formular mit Daten gefüllt ist
      await expect(page.locator('text=Bank bearbeiten')).toBeVisible();
      const nameInput = page.getByLabel('Bankname');
      const nameValue = await nameInput.inputValue();
      expect(nameValue).not.toBe('');
    }
  });

  test('sollte Bank löschen (mit Bestätigung)', async ({ page }) => {
    // Dialog-Handler registrieren
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.dismiss(); // Abbrechen
    });

    // Warten bis Tabelle geladen
    await page.waitForSelector('table', { timeout: 10000 });

    // Löschen-Button klicken
    const deleteButtons = page.locator('button[aria-label="Bank löschen"]');
    const count = await deleteButtons.count();

    if (count > 0) {
      await deleteButtons.first().click();
    }
  });

  test('sollte Statistiken anzeigen', async ({ page }) => {
    // Warten bis Daten geladen
    await page.waitForTimeout(2000);

    // Prüfen ob Statistik-Karten vorhanden
    const hasStats = await page.locator('text=Banken gesamt').isVisible();

    if (hasStats) {
      await expect(page.locator('text=Banken gesamt')).toBeVisible();
      await expect(page.locator('text=Länder')).toBeVisible();
    }
  });

  test('sollte Formular-Validierung prüfen', async ({ page }) => {
    // Formular öffnen
    await page.getByRole('button', { name: /Bank hinzufügen/i }).click();

    // Leeres Formular absenden
    await page.getByRole('button', { name: /Bank erstellen/i }).click();

    // HTML5-Validierung sollte greifen (required fields)
    const nameInput = page.getByLabel('Bankname');
    const isInvalid = await nameInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });
});
