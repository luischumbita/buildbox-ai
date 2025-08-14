import { getPageGeneratorPrompt } from '~/lib/prompts/page-generator';
import { getApiKey } from '~/lib/config/api-keys';

export interface AIGenerationRequest {
    description: string;
    pageType?: 'landing' | 'dashboard' | 'ecommerce' | 'blog' | 'portfolio' | 'custom';
    style?: 'modern' | 'minimal' | 'corporate' | 'creative' | 'elegant';
    features?: string[];
}

export interface AIGenerationResponse {
    success: boolean;
    code?: string;
    components?: string[];
    error?: string;
    message?: string;
}

export class AIService {
    private static instance: AIService;

    private constructor() { }

    static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    // Get API key from configuration
    private getApiKey(): string {
        return getApiKey('GEMINI');
    }

    async generatePage(request: AIGenerationRequest): Promise<AIGenerationResponse> {
        try {
            const prompt = getPageGeneratorPrompt(request.description);

            // Call Gemini API
            const response = await this.callGeminiAPI(prompt, request);

            return {
                success: true,
                code: response.code,
                components: response.components,
                message: 'Page generated successfully!'
            };
        } catch (error) {
            console.error('AI Generation Error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    private async callGeminiAPI(prompt: string, request: AIGenerationRequest) {
        const apiKey = this.getApiKey();
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response from Gemini API');
        }

        const generatedText = data.candidates[0].content.parts[0].text;

        // Parse the generated code from the response
        return this.parseGeneratedCode(generatedText);
    }

    private parseGeneratedCode(generatedText: string) {
        // Extract code blocks from the generated text
        const codeBlockRegex = /```(?:tsx?|jsx?|ts|js)?\n([\s\S]*?)```/g;
        const codeBlocks: string[] = [];
        let match;

        while ((match = codeBlockRegex.exec(generatedText)) !== null) {
            codeBlocks.push(match[1].trim());
        }

        // If no code blocks found, try to extract the entire response as code
        if (codeBlocks.length === 0) {
            codeBlocks.push(generatedText.trim());
        }

        return {
            code: codeBlocks.join('\n\n'),
            components: codeBlocks
        };
    }
}
