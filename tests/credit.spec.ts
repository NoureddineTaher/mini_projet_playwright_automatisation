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
test("TC-03 : devrait bloquer la validation si l'email est mal formé", async () => {
  // Timeout explicite pour tout le parcours (5 étapes + chargement des offres)
  test.setTimeout(90_000);

  await test.step('Saisir le code postal', async () => {
    await creditPage.fillPostalCode(testData.validUser.postalCode);
  });

  await test.step("Choisir une offre", async () => {
    await creditPage.chooseOffer();
  });

  await test.step("Passer l'étape d'éligibilité", async () => {
    await creditPage.eligibilityStep();
  });

  await test.step("Renseigner l'identité", async () => {
    await creditPage.fillIdentity(testData.validUser);
  });

  await test.step('Saisir un email mal formé', async () => {
    await creditPage.fillContact(
      {
        phone: testData.validUser.phone,
        email: testData.invalidData.badEmail,
      },
      false
    );
  });

  await test.step("Vérifier l'erreur et le blocage UI", async () => {
    await expect(creditPage.neoErrorMessage).toBeVisible();
    await expect(creditPage.neoErrorMessage).toHaveText(
      /Votre adresse email n.est pas valide/i
    );
    await expect(creditPage.continueBtn).toBeDisabled();
  });
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