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
  public readonly continueBtn: Locator; 
  private readonly notClientBtn: Locator;
  private readonly eligibleBtn: Locator;
  private readonly civilityMr: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly birthDateInput: Locator;
  private readonly phoneInput: Locator;
  private readonly emailInput: Locator;
  
  public readonly errorMessage: Locator; 
  public readonly neoErrorMessage: Locator;
  public readonly ageErrorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cookieBtn = page.getByRole('button', { name: 'Continuer sans accepter' });
    this.openAccountLink = page.getByRole('link', { name: 'Ouvrir un compte', exact: true });
    this.openAccountBtn = page.getByRole('button', { name: 'Ouvrir un compte bancaire en' });
    this.postalInput = page.getByRole('textbox', { name: 'code postal' });
    this.continueBtn = page.getByRole('button', { name: 'Continuer' });

    this.notClientBtn = page.getByRole('button', { name: 'Non, je ne suis pas encore' });
    this.eligibleBtn = page.getByRole('button', { name: 'Oui je suis éligible' });
    this.civilityMr = page.getByText('Monsieur');
    this.firstNameInput = page.getByRole('textbox', { name: 'Prénom' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Nom de naissance' });
    this.birthDateInput = page.getByRole('textbox', { name: 'Date de naissance (JJ/MM/AAAA)' });
    this.phoneInput = page.getByRole('textbox', { name: 'Numéro de mobile' });
    this.emailInput = page.getByRole('textbox', { name: 'Adresse email' });
    
    this.errorMessage = page.locator('.bpce-input-error-msg');
    this.neoErrorMessage = page.locator('.neo-text-helper-error .neo-text-helper-text');
    this.ageErrorMessage = page.locator('.neo-text-helper-error .neo-text-helper-text'); 
  }

  async navigate() {
    const url = process.env.BASE_URL_UI;
    if (!url) throw new Error("ERREUR: BASE_URL_UI n'est pas définie");
    await this.page.goto(url);
  }

  private async clickContinue() {
    await this.continueBtn.scrollIntoViewIfNeeded();
    await expect(this.continueBtn).toBeVisible();
    await expect(this.continueBtn).toBeEnabled();
    await this.continueBtn.click();
  }

  async acceptCookies() {
    await this.cookieBtn.click({ timeout: 5000 }).catch(() => {});
  }

  async openAccount() {
    await this.openAccountLink.click();
    await this.openAccountBtn.first().click();
  }

  async fillPostalCode(code: string, shouldClickContinue = true) {
    await this.postalInput.fill(code);
    await this.postalInput.blur();
    if (shouldClickContinue) {
      await this.clickContinue();
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  /**
   * MODIFICATION : Application de la SOLUTION 1
   * Plus robuste face aux variations de texte de la carte d'offre
   */
  async chooseOffer() {
    // 1. Attendre que les cartes soient attachées au DOM
   // await this.page.waitForSelector('app-card', { state: 'attached', timeout: 15000 });
   // await this.page.waitForSelector('app-card', { state: 'attached', timeout: 30000 });
    await this.page.locator('app-card').first().waitFor({ state: 'visible', timeout: 30000 });
    // 2. Filtrer la carte par un mot-clé unique ("solde")
    // et cibler le premier bouton trouvé à l'intérieur
    const specificOffer = this.page
      .locator('app-card')
      .filter({ hasText: /solde/i })
      .locator('button, [role="button"]')
      .first();

    // 3. Scroll et vérification avant le clic
    await specificOffer.scrollIntoViewIfNeeded();
    await expect(specificOffer).toBeVisible({ timeout: 15000 });
    await specificOffer.click();
  }

  async eligibilityStep() {
    await this.notClientBtn.click();
    await expect(this.eligibleBtn).toBeEnabled();
    await this.eligibleBtn.click();
  }

  async fillIdentity(data: IdentityData, shouldClickContinue = true) {
    await this.firstNameInput.fill(data.firstName);
    await this.civilityMr.click();
    await this.lastNameInput.fill(data.lastName);
    await this.birthDateInput.fill(data.birthDate);
    await this.birthDateInput.blur();
    
    if (shouldClickContinue) {
      await this.clickContinue();
    }
  }

  async fillContact(data: ContactData, shouldClickContinue = true) {
    await this.phoneInput.fill(data.phone);
    await this.emailInput.fill(data.email);
    await this.emailInput.blur();
    
    if (shouldClickContinue) {
      await this.clickContinue();
    }
  }
}