import { APIRequestContext } from '@playwright/test';

export class PostService {

    private readonly baseUrl: string;

    constructor() {
        const url = process.env.BASE_URL_API;

        if (!url) {
            throw new Error('BASE_URL_API est absente du fichier .env ou de GitHub Actions.');
        }

        this.baseUrl = url.replace(/\/$/, '');
    }

    async getPosts(request: APIRequestContext) {
        return await request.get(`${this.baseUrl}/posts`);
    }

    async createPost(request: APIRequestContext, data: any) {
        return await request.post(`${this.baseUrl}/posts`, {
            data
        });
    }
}
