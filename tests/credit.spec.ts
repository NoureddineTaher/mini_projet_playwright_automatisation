import { test, expect } from '@playwright/test';
import { CreditPage } from '../pages/credit.page';
import { testData } from '../utils/test-data';

test.describe('Validation du formulaire de Crédit Izicarte', () => {
  let creditPage: CreditPage;

  test.beforeEach(async ({ page }) => {
    creditPage = new CreditPage(page);
    await creditPage.navigate();
    await creditPage.acceptCookies();
    await creditPage.openAccount();
  });

  test('TC-01 : devrait valider un parcours de souscription complet', async ({ page }) => {
    test.setTimeout(60000); // Tunnel long, on augmente le temps
    await creditPage.fillPostalCode(testData.validUser.postalCode);
    await creditPage.chooseOffer();
    await creditPage.eligibilityStep();
    await creditPage.fillIdentity(testData.validUser);
    await creditPage.fillContact(testData.validUser);

    // Vérification : on a dépassé l'étape de contact (ex: l'URL contient 'recapitulatif' ou change)
    await expect(page).not.toHaveURL(/.*profil/); 
  });

  test('TC-02 : devrait afficher une erreur pour un code postal invalide', async ({ page }) => {
    await creditPage.fillPostalCode(testData.invalidData.postalCode, false);
    
    await expect(creditPage.errorMessage).toBeVisible();
    await expect(creditPage.errorMessage).toHaveText(/Le code postal saisi est incorrect/i);

    // Vérification du blocage UI
    await expect(creditPage.continueBtn).toBeDisabled();
  });

 test('TC-03 : devrait bloquer la validation si l\'email est mal formé', async ({ page }) => {
  // Option A : Indique à Playwright que ce test est normalement lent (triple le timeout)
  test.slow(); 
  
  // OU Option B : Fixe un timeout précis de 60 secondes pour ce test
  // test.setTimeout(60000);

  await creditPage.fillPostalCode(testData.validUser.postalCode);
  await creditPage.chooseOffer();
  await creditPage.eligibilityStep();
  await creditPage.fillIdentity(testData.validUser); 

  await creditPage.fillContact({
    phone: testData.validUser.phone,
    email: testData.invalidData.badEmail
  }, false); 
  
  await expect(creditPage.neoErrorMessage).toBeVisible();
  await expect(creditPage.neoErrorMessage).toHaveText(/Votre adresse email n.est pas valide/i);
  await expect(creditPage.continueBtn).toBeDisabled();
});

  test('TC-04 : devrait afficher une erreur si l\'utilisateur est mineur', async ({ page }) => {
    await creditPage.fillPostalCode(testData.validUser.postalCode);
    await creditPage.chooseOffer();
    await creditPage.eligibilityStep();

    const minorData = {
      ...testData.validUser,
      birthDate: '09/09/2015' // Date vue sur votre capture
    };

    await creditPage.fillIdentity(minorData, false);

    // Assertion sur le message d'erreur d'âge
    await expect(creditPage.ageErrorMessage).toBeVisible();
    await expect(creditPage.ageErrorMessage).toHaveText(/Vous devez avoir plus de 18 ans pour poursuivre/i);
    await expect(creditPage.continueBtn).toBeDisabled();
  });
});