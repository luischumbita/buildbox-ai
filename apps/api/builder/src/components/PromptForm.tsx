import React, { useState } from 'react';
import { Wand2, Settings, Send } from 'lucide-react';
import { GenerationOptions } from '../types';

interface PromptFormProps {
    onGenerate: (prompt: string, options: GenerationOptions) => void;
    isLoading: boolean;
}

export const PromptForm: React.FC<PromptFormProps> = ({ onGenerate, isLoading }) => {
    const [prompt, setPrompt] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [options, setOptions] = useState<GenerationOptions>({
        style: 'modern',
        colorScheme: 'blue',
        includeAnimations: true,
        responsive: true
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            onGenerate(prompt.trim(), options);
        }
    };

    const examplePrompts = [
        "Una landing page para una app de fitness con diseño moderno",
        "Página de producto para una startup de IA con estilo minimalista",
        "Landing para un restaurante gourmet con diseño elegante",
        "Página de servicios para una agencia de marketing digital"
    ];

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-blue-500" />
                Describe tu Landing Page
            </h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe la landing page que quieres crear. Por ejemplo: 'Una landing page para una app de fitness con colores azules, sección hero, testimoniales y llamada a la acción'"
                        className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        disabled={isLoading}
                    />
                </div>

                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Ejemplos de prompts:</p>
                    <div className="flex flex-wrap gap-2">
                        {examplePrompts.map((example, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setPrompt(example)}
                                className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                                disabled={isLoading}
                            >
                                {example}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <button
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        disabled={isLoading}
                    >
                        <Settings className="w-4 h-4" />
                        Opciones Avanzadas
                    </button>

                    {showAdvanced && (
                        <div className="mt-3 grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Estilo
                                </label>
                                <select
                                    value={options.style}
                                    onChange={(e) => setOptions({ ...options, style: e.target.value as GenerationOptions['style'] })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isLoading}
                                >
                                    <option value="modern">Moderno</option>
                                    <option value="minimal">Minimalista</option>
                                    <option value="creative">Creativo</option>
                                    <option value="corporate">Corporativo</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Esquema de Color
                                </label>
                                <select
                                    value={options.colorScheme}
                                    onChange={(e) => setOptions({ ...options, colorScheme: e.target.value as GenerationOptions['colorScheme'] })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isLoading}
                                >
                                    <option value="blue">Azul</option>
                                    <option value="green">Verde</option>
                                    <option value="purple">Púrpura</option>
                                    <option value="orange">Naranja</option>
                                </select>
                            </div>

                            <div className="col-span-2 flex gap-4">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={options.includeAnimations}
                                        onChange={(e) => setOptions({ ...options, includeAnimations: e.target.checked })}
                                        className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                                        disabled={isLoading}
                                    />
                                    Incluir Animaciones
                                </label>

                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={options.responsive}
                                        onChange={(e) => setOptions({ ...options, responsive: e.target.checked })}
                                        className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                                        disabled={isLoading}
                                    />
                                    Diseño Responsive
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={!prompt.trim() || isLoading}
                    className="w-full bg-blue-500 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                    {isLoading ? 'Generando...' : 'Generar Landing Page'}
                </button>
            </form>
        </div>
    );
};