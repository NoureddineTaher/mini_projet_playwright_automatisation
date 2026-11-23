
import { Page, expect, Locator } from '@playwright/test';

interface IdentityData {
  firstName: string;
  lastName: string;
  birthDate: string;
}

interface ContactData {
  phone: string;
  email: string;
}

export class CreditPage {
  private readonly page: Page;

  // ===== Locators =====
  private readonly cookieBtn: Locator;
  private readonly openAccountLink: Locator;
  private readonly openAccountBtn: Locator;
  private readonly postalInput: Locator;
  private readonly notClientBtn: Locator;
  private readonly eligibleBtn: Locator;
  private readonly civilityMr: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly birthDateInput: Locator;
  private readonly phoneInput: Locator;
  private readonly emailInput: Locator;

  // Boutons Continuer
  public readonly continueBtn: Locator;
  public readonly profileContinueBtn: Locator;
  public readonly contactContinueBtn: Locator;

  // Messages d'erreur
  public readonly errorMessage: Locator;
  public readonly neoErrorMessage: Locator;
  public readonly ageErrorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cookieBtn = page.getByRole('button', {
      name: 'Continuer sans accepter'
    });

    this.openAccountLink = page.getByRole('link', {
      name: 'Ouvrir un compte',
      exact: true
    });

    this.openAccountBtn = page.getByRole('button', {
      name: 'Ouvrir un compte bancaire en'
    });

    this.postalInput = page.getByRole('textbox', {
      name: 'code postal'
    });

    this.continueBtn = page.getByRole('button', {
      name: 'Continuer'
    });

    this.profileContinueBtn = page
      .locator('app-profile')
      .getByRole('button', { name: 'Continuer' });

    this.contactContinueBtn = page
      .locator('app-contact')
      .getByRole('button', { name: 'Continuer' });

    this.notClientBtn = page.getByRole('button', {
      name: 'Non, je ne suis pas encore'
    });

    this.eligibleBtn = page.getByRole('button', {
      name: 'Oui je suis éligible'
    });

    this.civilityMr = page.getByText('Monsieur');

    this.firstNameInput = page.getByRole('textbox', {
      name: 'Prénom'
    });

    this.lastNameInput = page.getByRole('textbox', {
      name: 'Nom de naissance'
    });

    this.birthDateInput = page.getByRole('textbox', {
      name: 'Date de naissance (JJ/MM/AAAA)'
    });

    this.phoneInput = page.getByRole('textbox', {
      name: 'Numéro de mobile'
    });

    this.emailInput = page.getByRole('textbox', {
      name: 'Adresse email'
    });

    this.errorMessage = page.locator('.bpce-input-error-msg');

    this.neoErrorMessage = page
      .locator('app-contact')
      .locator('.neo-text-helper-error .neo-text-helper-text');

    this.ageErrorMessage = page
      .locator('app-profile')
      .locator('.neo-text-helper-error .neo-text-helper-text');
  }

  // ===== Navigation =====

  async navigate() {
    const url = process.env.BASE_URL_UI;

    if (!url) {
      throw new Error('BASE_URL_UI est absente de la configuration.');
    }

    await this.page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
  }

  // ===== Actions communes =====

  private async clickContinue(btn: Locator = this.continueBtn) {
    await expect(btn).toBeVisible({ timeout: 20000 });
    await expect(btn).toBeEnabled({ timeout: 20000 });

    await btn.scrollIntoViewIfNeeded();
    await btn.click({ timeout: 20000 });
  }

  async acceptCookies() {
    // La bannière peut être absente ou déjà acceptée.
    try {
      await this.cookieBtn.waitFor({
        state: 'visible',
        timeout: 5000
      });

      await this.cookieBtn.click({ timeout: 10000 });
    } catch (error) {
      // On tolère uniquement l'absence de la bannière.
      // Les autres erreurs ne doivent pas être masquées.
      if (
        !(error instanceof Error) ||
        !/Timeout/i.test(error.message)
      ) {
        throw error;
      }
    }
  }

  async openAccount() {
    await expect(this.openAccountLink).toBeVisible({
      timeout: 30000
    });

    await this.openAccountLink.click();

    await expect(this.openAccountBtn.first()).toBeVisible({
      timeout: 30000
    });

    await this.openAccountBtn.first().click();

    await expect(this.postalInput).toBeVisible({
      timeout: 30000
    });
  }

  // ===== Étape code postal =====

  async fillPostalCode(
    code: string,
    shouldClickContinue = true
  ) {
    await expect(this.postalInput).toBeVisible({
      timeout: 30000
    });

    await this.postalInput.fill(code);
    await this.postalInput.blur();

    if (shouldClickContinue) {
      await this.clickContinue(this.continueBtn);
    }
  }

  // ===== Étape choix de l'offre =====

  async chooseOffer() {
    const cards = this.page.locator('app-card');

    await expect(cards.first()).toBeVisible({
      timeout: 30000
    });

    const specificOffer = cards
      .filter({ hasText: /solde/i })
      .locator('button, [role="button"]')
      .first();

    await expect(specificOffer).toBeVisible({
      timeout: 20000
    });

    await expect(specificOffer).toBeEnabled();

    await specificOffer.scrollIntoViewIfNeeded();
    await specificOffer.click();
  }

  // ===== Étape éligibilité =====

  async eligibilityStep() {
    await expect(this.notClientBtn).toBeVisible({
      timeout: 20000
    });

    await this.notClientBtn.click();

    await expect(this.eligibleBtn).toBeVisible({
      timeout: 20000
    });

    await expect(this.eligibleBtn).toBeEnabled();

    await this.eligibleBtn.click();
  }

  // ===== Étape identité =====

  async fillIdentity(
    data: IdentityData,
    shouldClickContinue = true
  ) {
    await expect(this.firstNameInput).toBeVisible({
      timeout: 20000
    });

    await this.firstNameInput.fill(data.firstName);

    await this.civilityMr.click();

    await this.lastNameInput.fill(data.lastName);

    await this.birthDateInput.fill(data.birthDate);
    await this.birthDateInput.blur();

    if (shouldClickContinue) {
      await this.clickContinue(this.profileContinueBtn);

      // Vérifier l'affichage de l'étape contact.
      await expect(this.phoneInput).toBeVisible({
        timeout: 20000
      });
    }
  }

  // ===== Étape contact =====

  async fillContact(
    data: ContactData,
    shouldClickContinue = true
  ) {
    await expect(this.phoneInput).toBeVisible({
      timeout: 20000
    });

    await this.phoneInput.fill(data.phone);
    await this.emailInput.fill(data.email);
    await this.emailInput.blur();

    if (shouldClickContinue) {
      await this.clickContinue(this.contactContinueBtn);
    }
  }
}