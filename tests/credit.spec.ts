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

  test('TC-01 : devrait valider un parcours de souscription complet', async () => {
    test.setTimeout(90_000); // Tunnel long + runner CI plus lent

    await test.step('Saisir le code postal', async () => {
      await creditPage.fillPostalCode(testData.validUser.postalCode);
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

    await test.step("Vérifier que l'étape contact est quittée", async () => {
      await expect(creditPage.contactContinueBtn).toBeHidden({ timeout: 15000 });
      // Idéal : remplacer par un élément propre à l'étape suivante
      // await expect(page.getByRole('heading', { name: '...' })).toBeVisible();
    });
  });

  test('TC-02 : devrait afficher une erreur pour un code postal invalide', async () => {
    await creditPage.fillPostalCode(testData.invalidData.postalCode, false);

    await expect(creditPage.errorMessage).toBeVisible();
    await expect(creditPage.errorMessage).toHaveText(/Le code postal saisi est incorrect/i);

    // Vérification du blocage UI (étape code postal)
    await expect(creditPage.continueBtn).toBeDisabled();
  });

  test("TC-03 : devrait bloquer la validation si l'email est mal formé", async () => {
    test.setTimeout(90_000);

    await test.step('Saisir le code postal', async () => {
      await creditPage.fillPostalCode(testData.validUser.postalCode);
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
      await expect(creditPage.neoErrorMessage).toBeVisible();
      await expect(creditPage.neoErrorMessage).toHaveText(
        /Votre adresse email n.est pas valide/i
      );
      await expect(creditPage.contactContinueBtn).toBeDisabled();
    });
  });

  test("TC-04 : devrait afficher une erreur si l'utilisateur est mineur", async () => {
    test.setTimeout(90_000);

    await test.step('Passer les étapes préalables', async () => {
      await creditPage.fillPostalCode(testData.validUser.postalCode);
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
      await expect(creditPage.ageErrorMessage).toBeVisible();
      await expect(creditPage.ageErrorMessage).toHaveText(
        /Vous devez avoir plus de 18 ans pour poursuivre/i
      );
      await expect(creditPage.profileContinueBtn).toBeDisabled();
    });
  });
});