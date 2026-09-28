🎭 Mini Projet Playwright - Automatisation UI & API

Projet d'automatisation de tests UI et API réalisé avec Playwright et TypeScript.

L'objectif de ce projet est de mettre en place une architecture d'automatisation maintenable, avec Page Object Model, gestion des données de test, rapports Playwright et exécution automatisée avec GitHub Actions.

📋 Sommaire

Présentation

Technologies

Architecture du projet

Tests UI

Tests API

Page Object Model

Configuration

Installation

Exécution des tests

Rapport Playwright

CI/CD avec GitHub Actions

GitHub Pages

Notifications e-mail

Variables d'environnement

Bonnes pratiques

Auteur

📌 Présentation

Ce projet automatise différents scénarios de test autour d'un parcours de souscription.

Les tests couvrent notamment :

UI

Navigation sur le parcours de souscription

Gestion du bandeau cookies

Saisie du code postal

Sélection d'une offre

Vérification de l'éligibilité

Saisie des informations personnelles

Saisie des coordonnées

Validation des champs

Gestion des erreurs

Vérification des étapes du parcours

API

Exécution de tests API avec Playwright

Vérification des réponses HTTP

Vérification des données retournées

Validation des comportements attendus des endpoints

🛠 Technologies
Technologie	Utilisation
Playwright	Automatisation UI et API
TypeScript	Langage principal
Node.js	Environnement d'exécution
GitHub Actions	CI/CD
GitHub Pages	Publication du rapport
SMTP	Notifications e-mail
Git	Gestion de versions
📁 Architecture du projet
mini_projet_playwright_automatisation/
│
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── api/
│   └── ...
│
├── pages/
│   └── credit.page.ts
│
├── tests/
│   ├── api/
│   │   └── api-credit.spec.ts
│   │
│   └── ui/
│       └── credit.spec.ts
│
├── utils/
│   └── test-data.ts
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
└── README.md

🧪 Tests UI

Les tests UI utilisent le modèle Page Object Model (POM).

Le scénario de test reste simple et lisible :

const creditPage = new CreditPage(page);

await creditPage.navigate();
await creditPage.acceptCookies();
await creditPage.openAccount();

await creditPage.fillPostalCode(userData.postalCode);
await creditPage.chooseOffer();
await creditPage.eligibilityStep();

await creditPage.fillIdentity(userData);
await creditPage.fillContact(userData);


Les locators et les actions de la page sont centralisés dans :

pages/credit.page.ts


Cela permet de limiter la duplication de code et de faciliter la maintenance des tests.

🔌 Tests API

Les tests API sont exécutés avec les fonctionnalités API de Playwright.

Exemple :

npx playwright test tests/api/api-credit.spec.ts


Les tests API permettent de vérifier les réponses des services indépendamment de l'interface utilisateur.

🧱 Page Object Model

Le projet utilise le pattern Page Object Model.

Exemple :

export class CreditPage {
  private readonly page: Page;

  private readonly postalInput: Locator;
  private readonly continueBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.postalInput = page.getByRole('textbox', {
      name: 'code postal'
    });

    this.continueBtn = page.getByRole('button', {
      name: 'Continuer'
    });
  }
}

Avantages

Locators centralisés

Réutilisation des actions

Tests plus lisibles

Maintenance facilitée

Réduction de la duplication

⚙️ Configuration

Le projet utilise un fichier :

playwright.config.ts


La configuration permet notamment de gérer :

Navigateurs

Base URL

Timeout

Reports

Screenshots

Traces

Vidéos

Exécution CI

📦 Installation

Cloner le projet :

git clone https://github.com/NoureddineTaher/mini_projet_playwright_automatisation.git


Entrer dans le projet :

cd mini_projet_playwright_automatisation


Installer les dépendances :

npm ci


Installer les navigateurs Playwright :

npx playwright install --with-deps

▶️ Exécution des tests
Tous les tests
npx playwright test

Tests UI
npx playwright test tests/ui

Tests API
npx playwright test tests/api

Mode headed
npx playwright test --headed

Mode debug
npx playwright test --debug

Un test spécifique
npx playwright test tests/ui/credit.spec.ts

📊 Rapport Playwright

Après l'exécution des tests, le rapport HTML peut être ouvert avec :

npx playwright show-report


Le rapport permet notamment de consulter :

Tests réussis

Tests échoués

Durée des tests

Erreurs

Screenshots

Traces

Informations d'exécution

🚀 CI/CD avec GitHub Actions

Le projet utilise GitHub Actions pour automatiser l'exécution des tests.

Workflow :

             Git Push
                │
                ▼
        GitHub Actions
                │
        ┌───────┴───────┐
        │               │
        ▼               ▼
    Tests API        Tests UI
        │               │
        └───────┬───────┘
                │
                ▼
        Playwright Report
                │
                ▼
          GitHub Pages
                │
                ▼
         Email notification


Le workflow est disponible dans :

.github/workflows/playwright.yml

⏰ Exécution automatique

Le workflow peut être déclenché :

Push

À chaque push sur main.

on:
  push:
    branches: [ main ]

Pull Request

Lorsqu'une Pull Request cible main.

pull_request:
  branches: [ main ]

Exécution planifiée

Les tests peuvent également être exécutés automatiquement chaque nuit.

schedule:
  - cron: '0 0 * * *'

Exécution manuelle

Le workflow peut être lancé manuellement depuis GitHub Actions :

workflow_dispatch:

🌐 GitHub Pages

Le rapport Playwright est publié automatiquement sur GitHub Pages.

Rapport :

https://NoureddineTaher.github.io/mini_projet_playwright_automatisation/

Le rapport permet de consulter les résultats des tests sans avoir besoin de lancer Playwright localement.

📧 Notifications e-mail

Le pipeline peut envoyer automatiquement une notification par e-mail après l'exécution.

En cas de succès

Le message contient notamment :

✅ Pipeline Playwright terminé avec succès.

Tous les tests automatisés sont passés avec succès.

Rapport :
https://NoureddineTaher.github.io/mini_projet_playwright_automatisation/

En cas d'échec

Le message contient :

❌ Le pipeline Playwright a rencontré une erreur.

Consultez le rapport pour identifier les tests en échec.


Les notifications sont configurées dans GitHub Actions à l'aide de secrets.

🔐 Variables d'environnement

Les informations sensibles ne doivent pas être stockées directement dans le code source.

Exemple de fichier :

.env.example

BASE_URL_UI=https://example.com

TEST_FIRST_NAME=John
TEST_LAST_NAME=Doe
TEST_BIRTH_DATE=01/01/1990
TEST_PHONE=0600000000
TEST_EMAIL=test@example.com
TEST_POSTAL_CODE=75000


Le fichier .env réel est ignoré par Git :

.env
.env.*
!.env.example


Les secrets utilisés par GitHub Actions sont stockés dans :

GitHub
→ Settings
→ Secrets and variables
→ Actions

🧹 Bonnes pratiques

Le projet applique plusieurs bonnes pratiques d'automatisation :

Utilisation de TypeScript

Page Object Model

Locators basés sur les rôles et labels

Séparation UI / API

Données de test séparées du scénario

Variables d'environnement

Gestion des rapports

Screenshots et traces en cas d'échec

Exécution CI/CD

Publication du rapport

Notifications automatiques

Aucun secret sensible dans le repository

🎯 Objectifs du projet

Ce projet a pour objectif de démontrer la mise en place d'une solution d'automatisation complète :

Tests UI
   +
Tests API
   +
Page Object Model
   +
TypeScript
   +
Playwright
   +
CI/CD
   +
Reporting
   +
GitHub Pages
   +
Notifications e-mail

👤 Auteur

Noureddine Taher

Projet GitHub :

https://github.com/NoureddineTaher/mini_projet_playwright_automatisation

📄 Licence

Projet réalisé dans le cadre d'un projet personnel d'apprentissage et de démonstration de compétences en automatisation de tests.

