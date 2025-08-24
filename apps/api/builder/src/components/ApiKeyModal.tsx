import React, { useState } from 'react';
import { Key, X } from 'lucide-react';

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (apiKey: string) => void;
    currentApiKey: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
    isOpen,
    onClose,
    onSave,
    currentApiKey
}) => {
    const [apiKey, setApiKey] = useState(currentApiKey);

    if (!isOpen) return null;

    const handleSave = () => {
        if (apiKey.trim()) {
            onSave(apiKey.trim());
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        Configurar API Key de Gemini
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-3">
                        Para usar esta aplicación, necesitas una API key de Google Gemini.
                    </p>
                    <p className="text-xs text-blue-600 mb-4">
                        Obtén tu API key gratis en: <br />
                        <a
                            href="https://makersuite.google.com/app/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                        >
                            https://makersuite.google.com/app/apikey
                        </a>
                    </p>
                    <input
                        type="password"
                        placeholder="Ingresa tu API key de Gemini"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={!apiKey.trim()}
                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        Guardar
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};