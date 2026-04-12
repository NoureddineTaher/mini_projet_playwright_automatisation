import { test, expect } from '@playwright/test';
import { PostService } from '../api/PostService'; // Import de ton service

test.describe('POC - Validation API REST avec Architecture Service', () => {
    let postService: PostService;

    test.beforeAll(async () => {
        postService = new PostService();
    });

    test('devrait récupérer la liste des posts et valider le format', async ({ request }) => {
        // Utilisation du service
        const response = await postService.getPosts(request);
        
        expect(response.ok()).toBeTruthy();
        const posts = await response.json();

        expect(posts.length).toBeGreaterThan(0);
        expect(posts[0]).toHaveProperty('title');
        expect(posts[0].userId).toBe(1);
    });

    test('devrait simuler la création d’un nouveau dossier (POST)', async ({ request }) => {
        const payload = {
            title: 'Nouveau Dossier Crédit',
            body: 'Contenu du test pour Izivente',
            userId: 1993,
        };

        // Utilisation du service
        const response = await postService.createPost(request, payload);

        expect(response.status()).toBe(201);
        const result = await response.json();
        expect(result.title).toBe(payload.title);
    });
});