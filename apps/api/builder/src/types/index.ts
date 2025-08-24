export interface GeneratedLanding {
    id: string;
    prompt: string;
    html: string;
    css: string;
    javascript: string;
    timestamp: Date;
}

export interface ApiKeyConfig {
    geminiApiKey: string;
}

export interface GenerationOptions {
    style: 'modern' | 'minimal' | 'creative' | 'corporate';
    colorScheme: 'blue' | 'green' | 'purple' | 'orange' | 'custom';
    includeAnimations: boolean;
    responsive: boolean;
}

export interface ImageGenerationRequestBody {
    prompts: string[];
}

export interface ImageGenerationResponseBody {
    images: (string | null)[]; // data URIs o URLs
}