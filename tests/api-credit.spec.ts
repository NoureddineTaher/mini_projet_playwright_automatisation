import { test, expect } from '@playwright/test';

test.describe('POC - Validation API REST (Standard JSONPlaceholder)', () => {

  const BASE_URL = 'https://jsonplaceholder.typicode.com';

  test('devrait récupérer la liste des posts et valider le format', async ({ request }) => {
    // 1. Appel de l'API (Simule l'appel au backend Spring Boot)
    const response = await request.get(`${BASE_URL}/posts`);
    
    // 2. Vérification du statut HTTP (200 OK)
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const posts = await response.json();

    // 3. Assertions sur les données (Niveau N3)
    expect(posts.length).toBeGreaterThan(0); // Vérifie qu'on a des données
    expect(posts[0]).toHaveProperty('title'); // Vérifie la structure
    
    // Test spécifique sur le premier élément de ta liste
    expect(posts[0].userId).toBe(1);
    console.log('Premier titre du post :', posts[0].title);
  });

  test('devrait simuler la création d’un nouveau dossier (POST)', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/posts`, {
      data: {
        title: 'Nouveau Dossier Crédit',
        body: 'Contenu du test pour Izivente',
        userId: 1993,
      }
    });

    // Le standard REST pour une création réussie est 201 Created
    expect(response.status()).toBe(201);
    const result = await response.json();
    expect(result.title).toBe('Nouveau Dossier Crédit');
  });
});