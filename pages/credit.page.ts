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
  private readonly continueBtn: Locator;

  private readonly offerBtn: Locator;
  private readonly notClientBtn: Locator;
  private readonly eligibleBtn: Locator;

  private readonly civilityMr: Locator;

  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly birthDateInput: Locator;

  private readonly phoneInput: Locator;
  private readonly emailInput: Locator;

  constructor(page: Page) {
    this.page = page;

    // ===== Init locators =====
    this.cookieBtn = page.getByRole('button', { name: 'Continuer sans accepter' });

    this.openAccountLink = page.getByRole('link', { name: 'Ouvrir un compte', exact: true });
    this.openAccountBtn = page.getByRole('button', { name: 'Ouvrir un compte bancaire en' });

    this.postalInput = page.getByRole('textbox', { name: 'code postal' });
    this.continueBtn = page.getByRole('button', { name: 'Continuer' });

    this.offerBtn = page
      .locator('app-card')
      .filter({ hasText: 'Contrôle de solde' })
      .getByRole('button');

    this.notClientBtn = page.getByRole('button', { name: 'Non, je ne suis pas encore' });
    this.eligibleBtn = page.getByRole('button', { name: 'Oui je suis éligible' });

    this.civilityMr = page.getByText('Monsieur');

    this.firstNameInput = page.getByRole('textbox', { name: 'Prénom' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Nom de naissance' });
    this.birthDateInput = page.getByRole('textbox', { name: 'Date de naissance (JJ/MM/AAAA)' });

    this.phoneInput = page.getByRole('textbox', { name: 'Numéro de mobile' });
    this.emailInput = page.getByRole('textbox', { name: 'Adresse email' });
  }

  // =========================
  // Navigation
  // =========================
  async navigate() {
    await this.page.goto(
      'https://www.caisse-epargne.fr/comptes-cartes/le-credit-renouvelable-izicarte/'
    );
  }

  // =========================
  // Helpers anti-flaky
  // =========================
  private async clickContinue() {
    await expect(this.continueBtn).toBeVisible();
    await expect(this.continueBtn).toBeEnabled();
    await this.continueBtn.click();
  }

  // =========================
  // Actions
  // =========================

  async acceptCookies() {
    await this.cookieBtn.click({ timeout: 3000 }).catch(() => {});
  }

  async openAccount() {
    await this.openAccountLink.click();
    await this.openAccountBtn.first().click();
  }

  async fillPostalCode(code: string) {
    await this.postalInput.fill(code);

    // plus stable que press('Tab')
    await this.postalInput.blur();

    await this.clickContinue();
  }

  async chooseOffer() {
    await expect(this.offerBtn).toBeVisible();
    await this.offerBtn.click();
  }

  async eligibilityStep() {
    await this.notClientBtn.click();
    await expect(this.eligibleBtn).toBeEnabled();
    await this.eligibleBtn.click();
  }

  async fillIdentity(data: IdentityData) {
    await this.firstNameInput.fill(data.firstName);

    await this.civilityMr.click();

    await this.lastNameInput.fill(data.lastName);
    await this.birthDateInput.fill(data.birthDate);

    await this.birthDateInput.blur();

    await this.clickContinue();
  }

  async fillContact(data: ContactData) {
    await this.phoneInput.fill(data.phone);
    await this.emailInput.fill(data.email);

    await this.emailInput.blur();

    await this.clickContinue();
  }
}