import React from 'react';
import { Settings, MessageSquare, Eye } from 'lucide-react';

interface HeaderProps {
    onSettingsClick: () => void;
    onChatClick: () => void;
    onPreviewClick: () => void;
    activeTab: 'chat' | 'preview';
}

export const Header: React.FC<HeaderProps> = ({
    onSettingsClick,
    onChatClick,
    onPreviewClick,
    activeTab
}) => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            BuildBox
                        </h1>

                        {/* Navigation Tabs */}
                        <nav className="flex items-center gap-1">
                            <button
                                onClick={onChatClick}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'chat'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <MessageSquare className="w-4 h-4" />
                                Chat
                            </button>
                            <button
                                onClick={onPreviewClick}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'preview'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <Eye className="w-4 h-4" />
                                Preview
                            </button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onSettingsClick}
                            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            Configuración
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};