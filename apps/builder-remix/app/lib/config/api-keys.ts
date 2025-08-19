// API Keys Configuration
export const API_KEYS = {
    GEMINI: 'AIzaSyBOl7D3e1aNq5Zzicg-9XkAB5NVJMNLLt0'
};

// Environment-based configuration
export const getApiKey = (key: keyof typeof API_KEYS): string => {
    // Try to get from environment variable first
    const envKey = import.meta.env[`VITE_${key}_API_KEY`];
    if (envKey) {
        return envKey;
    }

    // Fallback to hardcoded key (for development)
    return API_KEYS[key];
};
