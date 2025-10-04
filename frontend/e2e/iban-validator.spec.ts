import { test, expect } from '@playwright/test';

test.describe('IBAN Validator E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('sollte Startseite laden', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('IBAN-Validator');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('sollte IBAN validieren - erfolgreicher Flow', async ({ page }) => {
    const ibanInput = page.getByLabel('IBAN-Nummer');
    await ibanInput.fill('DE89370400440532013000');

    await page.getByRole('button', { name: /IBAN Validieren/i }).click();

    await expect(page.locator('text=Gültige IBAN')).toBeVisible({ timeout: 10000 });

    await expect(page.locator('text=DE')).toBeVisible();
    await expect(page.locator('text=89')).toBeVisible();
  });

  test('sollte Formatierung während Eingabe anwenden', async ({ page }) => {
    const ibanInput = page.getByLabel('IBAN-Nummer');

    await ibanInput.fill('DE89370400440532013000');

    const value = await ibanInput.inputValue();
    expect(value).toContain(' ');
  });

  test('sollte Beispiel-IBAN verwenden können', async ({ page }) => {
    await page.locator('text=DE89 3704 0044 0532 0130 00').first().click();

    const ibanInput = page.getByLabel('IBAN-Nummer');
    const value = await ibanInput.inputValue();
    expect(value).toBe('DE89 3704 0044 0532 0130 00');
  });

  test('sollte Eingabe löschen können', async ({ page }) => {
    const ibanInput = page.getByLabel('IBAN-Nummer');
    await ibanInput.fill('DE89370400440532013000');

    await page.getByLabel('Eingabe löschen').click();

    const value = await ibanInput.inputValue();
    expect(value).toBe('');
  });

  test('sollte Button bei leerem Input deaktivieren', async ({ page }) => {
    const button = page.getByRole('button', { name: /IBAN Validieren/i });
    await expect(button).toBeDisabled();

    const ibanInput = page.getByLabel('IBAN-Nummer');
    await ibanInput.fill('DE89370400440532013000');

    await expect(button).toBeEnabled();
  });

  test('sollte Navigation zwischen Tabs funktionieren', async ({ page }) => {
    await page.getByRole('button', { name: /Banken/i }).click();

    await expect(page.locator('text=Bankverwaltung')).toBeVisible();

    await page.getByRole('button', { name: /Validator/i }).click();
    await expect(page.locator('text=IBAN-Validator')).toBeVisible();
  });

  test('sollte responsive sein (Mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByLabel('IBAN-Nummer')).toBeVisible();
  });
});
