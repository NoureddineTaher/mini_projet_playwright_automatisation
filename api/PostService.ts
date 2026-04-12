import { APIRequestContext } from '@playwright/test';


export class PostService {
    // On utilise BASE_URL_API définie dans le fichier .env
    private readonly baseUrl = process.env.BASE_URL_API;

    async getPosts(request: APIRequestContext) {
        return await request.get(`${this.baseUrl}/posts`);
    }

    async createPost(request: APIRequestContext, data: any) {
        return await request.post(`${this.baseUrl}/posts`, {
            data: data
        });
    }
}