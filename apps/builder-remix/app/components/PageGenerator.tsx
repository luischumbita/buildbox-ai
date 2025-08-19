import { useState } from 'react';
import { type AIGenerationRequest } from '~/lib/services/ai-service';
import { usePageGeneration } from '~/hooks/usePageGeneration';

export default function PageGenerator() {
    const [description, setDescription] = useState('');
    const [pageType, setPageType] = useState<'landing' | 'dashboard' | 'ecommerce' | 'blog' | 'portfolio' | 'custom'>('custom');
    const [style, setStyle] = useState<'modern' | 'minimal' | 'corporate' | 'creative' | 'elegant'>('modern');

    const { state, generatePage, cleanup, reset } = usePageGeneration();

    const handleGenerate = async () => {
        try {
            const request: AIGenerationRequest = {
                description: description.trim(),
                pageType,
                style,
                features: []
            };

            await generatePage(request);
        } catch (error) {
            console.error('Generation error:', error);
        }
    };

    const handleCleanup = async () => {
        await cleanup();
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Generador de Páginas con IA
                    </h2>
                    <p className="text-lg text-gray-600">
                        Describe la página que quieres crear y la IA la generará automáticamente
                    </p>
                </div>

                {/* API Key Status */}
                <div className="mb-6">
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">
                                    API Key Configurada
                                </h3>
                                <div className="mt-2 text-sm text-green-700">
                                    <p>Tu API key de Gemini está configurada y lista para usar.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Type Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label htmlFor="pageType" className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Página
                        </label>
                        <select
                            id="pageType"
                            value={pageType}
                            onChange={(e) => setPageType(e.target.value as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="landing">Landing Page</option>
                            <option value="dashboard">Dashboard</option>
                            <option value="ecommerce">E-commerce</option>
                            <option value="blog">Blog</option>
                            <option value="portfolio">Portfolio</option>
                            <option value="custom">Personalizada</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-2">
                            Estilo Visual
                        </label>
                        <select
                            id="style"
                            value={style}
                            onChange={(e) => setStyle(e.target.value as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="modern">Moderno</option>
                            <option value="minimal">Minimalista</option>
                            <option value="corporate">Corporativo</option>
                            <option value="creative">Creativo</option>
                            <option value="elegant">Elegante</option>
                        </select>
                    </div>
                </div>

                {/* Description Input */}
                <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción de la Página *
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        placeholder="Describe detalladamente la página que quieres crear. Por ejemplo: 'Una landing page para una empresa de software con hero section, características, testimonios, y formulario de contacto. Debe ser moderna y profesional.'"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                {/* Progress Display */}
                <div className="mb-6">
                    <div className="bg-gray-50 rounded-md p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                {state.progress.step === 'complete' ? (
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : state.progress.step === 'idle' ? (
                                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                    {state.progress.message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Generate Button */}
                <div className="text-center mb-6">
                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={state.isGenerating || !description.trim()}
                        className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                    >
                        {state.isGenerating ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generando...
                            </>
                        ) : (
                            'Generar Página con IA'
                        )}
                    </button>
                </div>

                {/* Result Display */}
                {state.result && (
                    <div className={`p-4 rounded-md ${state.result.success
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                        }`}>
                        <div className="flex">
                            <div className="flex-shrink-0">
                                {state.result.success ? (
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-3">
                                <h3 className={`text-sm font-medium ${state.result.success ? 'text-green-800' : 'text-red-800'
                                    }`}>
                                    {state.result.success ? '¡Éxito!' : 'Error'}
                                </h3>
                                <div className={`mt-2 text-sm ${state.result.success ? 'text-green-700' : 'text-red-700'
                                    }`}>
                                    <p>{state.result.message || state.result.error}</p>
                                    {(state.result.previewUrl || state.result.zipUrl) && (
                                        <div className="mt-3">
                                            {state.result.previewUrl ? (
                                                <a
                                                    href={state.result.previewUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                                                >
                                                    Ver Página Generada
                                                </a>
                                            ) : (
                                                <a
                                                    href={state.result.zipUrl}
                                                    download="generated-page.zip"
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                                >
                                                    Descargar Proyecto (ZIP)
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cleanup Button */}
                {state.result?.success && (
                    <div className="text-center mt-4">
                        <button
                            onClick={handleCleanup}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Limpiar WebContainer
                        </button>
                    </div>
                )}

                {/* Instructions */}
                <div className="mt-8 p-4 bg-gray-50 rounded-md">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Instrucciones:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• ✅ Tu API key de Gemini ya está configurada</li>
                        <li>• Describe la página con el mayor detalle posible</li>
                        <li>• La IA generará código React con TypeScript y Tailwind CSS</li>
                        <li>• El código se ejecutará en un WebContainer aislado</li>
                        <li>• Podrás ver la página generada en tiempo real</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
