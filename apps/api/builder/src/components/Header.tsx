import React from 'react';
import { Sparkles, Settings } from 'lucide-react';

interface HeaderProps {
    onOpenSettings: () => void;
    hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, hasApiKey }) => {
    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">AI Landing Builder</h1>
                            <p className="text-sm text-gray-500">Powered by Gemini</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-green-400' : 'bg-red-400'}`} />
                            <span className="text-sm text-gray-600">
                                {hasApiKey ? 'API Configurada' : 'API No Configurada'}
                            </span>
                        </div>

                        <button
                            onClick={onOpenSettings}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            Configurar
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};