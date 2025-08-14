import { GoogleGenerativeAI } from '@google/generative-ai';
import { GenerationOptions } from '../types';

class GeminiService {
    private genAI: GoogleGenerativeAI | null = null;
    private apiKey: string | null = null;

    initializeAPI(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.apiKey = apiKey;
    }

    async *generateLandingPage(prompt: string, options: GenerationOptions) {
        const response = await fetch('/api/builder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey || '', // Pass API key to your backend
            },
            body: JSON.stringify({ prompt, options }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error from builder backend: ${errorData.message || response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No se pudo obtener el lector de la respuesta.');
        }

        const decoder = new TextDecoder();
        let done = false;
        while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;
            yield decoder.decode(value);
        }
    }

    // Remove old image placeholder logic as it's now handled by the backend
    private async replaceImagePlaceholders(html: string): Promise<string> { return html; }
    private async generateImagesBatch(prompts: string[]): Promise<(string | null)[]> { return []; }
}

export const geminiService = new GeminiService();
