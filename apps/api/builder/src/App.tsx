import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ChatInterface } from './components/chat/ChatInterface';
import { PreviewPanel } from './components/PreviewPanel';
import { CodeViewer } from './components/CodeViewer';
import { geminiService } from './services/geminiService';
import { useLocalStorage } from './hooks/useLocalStorage';
import { GeneratedLanding, GenerationOptions } from './types';
import { AlertCircle, Sparkles, MessageSquare, Eye, Code, MessageCircle } from 'lucide-react';

function App() {
    const [apiKey, setApiKey] = useLocalStorage('gemini-api-key', '');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [currentLanding, setCurrentLanding] = useState<GeneratedLanding | null>(null);
    const [activeView, setActiveView] = useState<'preview' | 'code'>('preview');
    const [activeTab, setActiveTab] = useState<'chat' | 'preview'>('chat');

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

    const handlePageGenerated = (html: string, css: string, javascript: string, prompt: string) => {
        const newLanding: GeneratedLanding = {
            id: Date.now().toString(),
            prompt,
            html,
            css,
            javascript,
            timestamp: new Date()
        };

        setCurrentLanding(newLanding);
        setActiveTab('preview');
        setActiveView('preview');
    };

    const handleSaveApiKey = (newApiKey: string) => {
        setApiKey(newApiKey);
        geminiService.initializeAPI(newApiKey);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                onSettingsClick={() => setIsSettingsOpen(true)}
                onChatClick={() => setActiveTab('chat')}
                onPreviewClick={() => setActiveTab('preview')}
                activeTab={activeTab}
            />

            <main className="container mx-auto px-4 py-6">
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-red-800">
                            <AlertCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {activeTab === 'chat' ? (
                    <div className="h-[calc(100vh-200px)]">
                        <ChatInterface onPageGenerated={handlePageGenerated} />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Tab Navigation */}
                        <div className="flex items-center gap-4 border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('chat')}
                                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${activeTab === 'chat'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <MessageCircle className="w-4 h-4" />
                                Chat
                            </button>
                            <button
                                onClick={() => setActiveTab('preview')}
                                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${activeTab === 'preview'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Eye className="w-4 h-4" />
                                Preview
                            </button>
                        </div>

                        {/* Content */}
                        {currentLanding ? (
                            <div className="space-y-6">
                                {/* Page Info */}
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Página Generada
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setActiveView('preview')}
                                                className={`px-3 py-2 rounded-lg transition-colors ${activeView === 'preview'
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setActiveView('code')}
                                                className={`px-3 py-2 rounded-lg transition-colors ${activeView === 'code'
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                <Code className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-2">
                                        <strong>Prompt:</strong> {currentLanding.prompt}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Generado el {currentLanding.timestamp.toLocaleDateString('es-ES')} a las {currentLanding.timestamp.toLocaleTimeString('es-ES')}
                                    </p>
                                </div>

                                {/* Preview or Code */}
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
                                        <MessageCircle className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        ¡Usa el Chat para generar páginas!
                                    </h3>
                                    <p className="text-gray-500">
                                        Ve al tab de Chat y describe qué tipo de landing page quieres crear.
                                    </p>
                                    <button
                                        onClick={() => setActiveTab('chat')}
                                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Ir al Chat
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
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