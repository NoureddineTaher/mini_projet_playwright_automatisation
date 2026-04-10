import { test } from '@playwright/test';
import { CreditPage } from '../pages/credit.page';
import { userData } from '../utils/test-data';

test('parcours souscription credit', async ({ page }) => {

  const creditPage = new CreditPage(page);

  await creditPage.navigate();
  await creditPage.acceptCookies();
  await creditPage.openAccount();

  await creditPage.fillPostalCode(userData.postalCode);
  await creditPage.chooseOffer();
  await creditPage.eligibilityStep();

  await creditPage.fillIdentity(userData);
  await creditPage.fillContact(userData);
});
























