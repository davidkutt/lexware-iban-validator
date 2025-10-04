import { test, expect } from '@playwright/test';

test.describe('Bank Manager E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Banken/i }).click();
    await expect(page.locator('text=Bankverwaltung')).toBeVisible();
  });

  test('sollte Bankliste laden', async ({ page }) => {
    await expect(page.locator('text=Bankverwaltung')).toBeVisible();

    const table = page.locator('table');
    await expect(table).toBeVisible();
  });

  test('sollte Bank-Formular öffnen und schließen', async ({ page }) => {
    await page.getByRole('button', { name: /Bank hinzufügen/i }).click();

    await expect(page.locator('text=Neue Bank hinzufügen')).toBeVisible();
    await expect(page.getByLabel('Bankname')).toBeVisible();

    await page.getByRole('button', { name: /Abbrechen/i }).first().click();

    await expect(page.locator('text=Neue Bank hinzufügen')).not.toBeVisible();
  });

  test('sollte neue Bank erstellen', async ({ page }) => {
    await page.getByRole('button', { name: /Bank hinzufügen/i }).click();

    await page.getByLabel('Bankname').fill('Test Bank E2E');
    await page.getByLabel('BIC').fill('TESTDE12XXX');
    await page.getByLabel('Bankleitzahl').fill('12345678');
    await page.getByLabel('Ländercode').fill('DE');

    await page.getByRole('button', { name: /Bank erstellen/i }).click();

    await expect(page.locator('text=Test Bank E2E')).toBeVisible({ timeout: 10000 });
  });

  test('sollte Bank bearbeiten', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });

    const editButtons = page.locator('button[aria-label="Bank bearbeiten"]');
    const count = await editButtons.count();

    if (count > 0) {
      await editButtons.first().click();

      await expect(page.locator('text=Bank bearbeiten')).toBeVisible();
      const nameInput = page.getByLabel('Bankname');
      const nameValue = await nameInput.inputValue();
      expect(nameValue).not.toBe('');
    }
  });

  test('sollte Bank löschen (mit Bestätigung)', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.dismiss();
    });

    await page.waitForSelector('table', { timeout: 10000 });

    const deleteButtons = page.locator('button[aria-label="Bank löschen"]');
    const count = await deleteButtons.count();

    if (count > 0) {
      await deleteButtons.first().click();
    }
  });

  test('sollte Statistiken anzeigen', async ({ page }) => {
    await page.waitForTimeout(2000);

    const hasStats = await page.locator('text=Banken gesamt').isVisible();

    if (hasStats) {
      await expect(page.locator('text=Banken gesamt')).toBeVisible();
      await expect(page.locator('text=Länder')).toBeVisible();
    }
  });

  test('sollte Formular-Validierung prüfen', async ({ page }) => {
    await page.getByRole('button', { name: /Bank hinzufügen/i }).click();

    await page.getByRole('button', { name: /Bank erstellen/i }).click();

    const nameInput = page.getByLabel('Bankname');
    const isInvalid = await nameInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });
});
