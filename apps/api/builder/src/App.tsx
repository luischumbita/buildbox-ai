import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ApiKeyModal } from './components/ApiKeyModal';
import { PromptForm } from './components/PromptForm';
import { PreviewPanel } from './components/PreviewPanel';
import { CodeViewer } from './components/CodeViewer';
import { geminiService } from './services/geminiService';
import { useLocalStorage } from './hooks/useLocalStorage';
import { GeneratedLanding, GenerationOptions } from './types';
import { AlertCircle, Sparkles } from 'lucide-react';

function App() {
    const [apiKey, setApiKey] = useLocalStorage('gemini-api-key', '');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [currentLanding, setCurrentLanding] = useState<GeneratedLanding | null>(null);
    const [activeView, setActiveView] = useState<'preview' | 'code'>('preview');

    useEffect(() => {
        if (apiKey) {
            geminiService.initializeAPI(apiKey);
        }
    }, [apiKey]);

    useEffect(() => {
        if (!apiKey) {
            setIsSettingsOpen(true);
        }
    }, []);

    const handleGenerate = async (prompt: string, options: GenerationOptions) => {
        if (!apiKey) {
            setIsSettingsOpen(true);
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const result = await geminiService.generateLandingPage(prompt, options);

            const newLanding: GeneratedLanding = {
                id: Date.now().toString(),
                prompt,
                html: result.html,
                css: result.css,
                javascript: result.javascript,
                timestamp: new Date()
            };

            setCurrentLanding(newLanding);
            setActiveView('preview');

        } catch (err) {
            console.error('Generation error:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido al generar la landing page');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveApiKey = (newApiKey: string) => {
        setApiKey(newApiKey);
        geminiService.initializeAPI(newApiKey);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                onOpenSettings={() => setIsSettingsOpen(true)}
                hasApiKey={!!apiKey}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel - Prompt Form */}
                    <div className="lg:col-span-1">
                        <PromptForm
                            onGenerate={handleGenerate}
                            isLoading={isLoading}
                        />

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-medium text-red-800 mb-1">Error</h4>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Panel - Preview/Code */}
                    <div className="lg:col-span-2">
                        {currentLanding ? (
                            <div>
                                {/* Tab Navigation */}
                                <div className="mb-4">
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => setActiveView('preview')}
                                            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeView === 'preview'
                                                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                                                    : 'bg-gray-100 text-gray-600 hover:text-gray-800'
                                                }`}
                                        >
                                            Vista Previa
                                        </button>
                                        <button
                                            onClick={() => setActiveView('code')}
                                            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeView === 'code'
                                                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                                                    : 'bg-gray-100 text-gray-600 hover:text-gray-800'
                                                }`}
                                        >
                                            Código
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                {activeView === 'preview' ? (
                                    <PreviewPanel
                                        html={currentLanding.html}
                                        css={currentLanding.css}
                                        javascript={currentLanding.javascript}
                                    />
                                ) : (
                                    <CodeViewer
                                        html={currentLanding.html}
                                        css={currentLanding.css}
                                        javascript={currentLanding.javascript}
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-lg h-96 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Sparkles className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        ¡Genera tu primera Landing Page!
                                    </h3>
                                    <p className="text-gray-500">
                                        Describe qué tipo de landing page quieres crear y la IA la generará por ti.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <ApiKeyModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onSave={handleSaveApiKey}
                currentApiKey={apiKey}
            />
        </div>
    );
}

export default App;