
import { test, expect } from '@playwright/test';
import { CreditPage } from '../pages/credit.page';
import { testData } from '../utils/test-data';

test.describe('Validation du formulaire de Crédit Izicarte', () => {

  let creditPage: CreditPage;

  // Timeout global : inclut beforeEach et le scénario.
  test.setTimeout(90000);

  test.beforeEach(async ({ page }) => {
    creditPage = new CreditPage(page);

    await creditPage.navigate();
    await creditPage.acceptCookies();
    await creditPage.openAccount();
  });

  // ============================================================
  // TC-01 : PARCOURS COMPLET
  // ============================================================

  test('TC-01 : devrait valider un parcours de souscription complet', async () => {

    await test.step('Saisir le code postal', async () => {
      await creditPage.fillPostalCode(
        testData.validUser.postalCode
      );
    });

    await test.step('Choisir une offre', async () => {
      await creditPage.chooseOffer();
    });

    await test.step("Passer l'étape d'éligibilité", async () => {
      await creditPage.eligibilityStep();
    });

    await test.step("Renseigner l'identité", async () => {
      await creditPage.fillIdentity(testData.validUser);
    });

    await test.step('Renseigner le contact', async () => {
      await creditPage.fillContact(testData.validUser);
    });

    await test.step("Vérifier la progression du parcours", async () => {
      await expect(
        creditPage.contactContinueBtn
      ).toBeHidden({ timeout: 20000 });
    });
  });

  // ============================================================
  // TC-02 : CODE POSTAL INVALIDE
  // ============================================================

  test('TC-02 : devrait afficher une erreur pour un code postal invalide', async () => {

    await creditPage.fillPostalCode(
      testData.invalidData.postalCode,
      false
    );

    await expect(creditPage.errorMessage).toBeVisible();

    await expect(creditPage.errorMessage).toHaveText(
      /Le code postal saisi est incorrect/i
    );

    await expect(creditPage.continueBtn).toBeDisabled();
  });

  // ============================================================
  // TC-03 : EMAIL INVALIDE
  // ============================================================

  test("TC-03 : devrait bloquer la validation si l'email est mal formé", async () => {

    await test.step('Saisir le code postal', async () => {
      await creditPage.fillPostalCode(
        testData.validUser.postalCode
      );
    });

    await test.step('Choisir une offre', async () => {
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

      await expect(
        creditPage.neoErrorMessage
      ).toBeVisible();

      await expect(
        creditPage.neoErrorMessage
      ).toHaveText(/Votre adresse email n.est pas valide/i);

      await expect(
        creditPage.contactContinueBtn
      ).toBeDisabled();
    });
  });

  // ============================================================
  // TC-04 : UTILISATEUR MINEUR
  // ============================================================

  test("TC-04 : devrait afficher une erreur si l'utilisateur est mineur", async () => {

    await test.step('Passer les étapes préalables', async () => {
      await creditPage.fillPostalCode(
        testData.validUser.postalCode
      );

      await creditPage.chooseOffer();

      await creditPage.eligibilityStep();
    });

    await test.step('Saisir une date de naissance de mineur', async () => {

      const minorData = {
        ...testData.validUser,
        birthDate: '09/09/2015',
      };

      await creditPage.fillIdentity(minorData, false);
    });

    await test.step("Vérifier l'erreur d'âge et le blocage UI", async () => {

      await expect(
        creditPage.ageErrorMessage
      ).toBeVisible();

      await expect(
        creditPage.ageErrorMessage
      ).toHaveText(
        /Vous devez avoir plus de 18 ans pour poursuivre/i
      );

      await expect(
        creditPage.profileContinueBtn
      ).toBeDisabled();
    });
  });

});