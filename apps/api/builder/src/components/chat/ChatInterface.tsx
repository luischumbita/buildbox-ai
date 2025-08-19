import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, MessageSquare, Trash2, Edit3, Save, X } from 'lucide-react';
import { useChatHistory } from '../../lib/hooks/useChatHistory';
import { geminiService } from '../../services/geminiService';
import { GenerationOptions } from '../../types';
import './chat.css';

interface ChatInterfaceProps {
    onPageGenerated?: (html: string, css: string, javascript: string, prompt: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onPageGenerated }) => {
    const {
        chats,
        currentChat,
        isLoading,
        createNewChat,
        loadChat,
        addMessage,
        saveGeneratedPage,
        removeChat,
        updateChatTitle
    } = useChatHistory();

    const [input, setInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [editingTitle, setEditingTitle] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState('');
    const [showSidebar, setShowSidebar] = useState(true);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    // Create new chat on mount if none exists
    useEffect(() => {
        if (!isLoading && chats.length === 0) {
            createNewChat();
        }
    }, [isLoading, chats.length, createNewChat]);

    const handleSendMessage = async () => {
        if (!input.trim() || !currentChat) return;

        const userMessage = input.trim();
        setInput('');

        // Add user message
        await addMessage('user', userMessage);

        // Show typing indicator
        setIsGenerating(true);

        try {
            // Generate page with Gemini
            const options: GenerationOptions = {
                style: 'modern',
                colorScheme: 'blue',
                includeAnimations: true,
                responsive: true
            };

            const result = await geminiService.generateLandingPage(userMessage, options);

            // Add assistant message
            await addMessage('assistant', `He generado una landing page basada en tu descripción: "${userMessage}". La página incluye un slider accesible y está optimizada para móviles.`);

            // Save generated page
            await saveGeneratedPage(userMessage, result.html, result.css, result.javascript);

            // Notify parent component
            if (onPageGenerated) {
                onPageGenerated(result.html, result.css, result.javascript, userMessage);
            }

        } catch (error) {
            console.error('Error generating page:', error);
            await addMessage('assistant', `Lo siento, hubo un error al generar la página: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleNewChat = async () => {
        const chat = await createNewChat();
        if (chat) {
            setInput('');
        }
    };

    const handleChatSelect = async (chatId: string) => {
        await loadChat(chatId);
        setInput('');
    };

    const handleDeleteChat = async (chatId: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta conversación?')) {
            await removeChat(chatId);
        }
    };

    const startEditTitle = (chat: any) => {
        setEditingTitle(chat.id);
        setNewTitle(chat.title);
    };

    const saveTitle = async () => {
        if (editingTitle && newTitle.trim()) {
            await updateChatTitle(editingTitle, newTitle.trim());
            setEditingTitle(null);
            setNewTitle('');
        }
    };

    const cancelEditTitle = () => {
        setEditingTitle(null);
        setNewTitle('');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="flex h-full bg-gray-50">
            {/* Sidebar */}
            <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden`}>
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Conversaciones</h2>
                        <button
                            onClick={() => setShowSidebar(false)}
                            className="lg:hidden p-1 hover:bg-gray-100 rounded"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <button
                        onClick={handleNewChat}
                        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva conversación
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors group ${currentChat?.id === chat.id ? 'bg-blue-50 border-blue-200' : ''
                                }`}
                            onClick={() => handleChatSelect(chat.id)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    {editingTitle === chat.id ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={newTitle}
                                                onChange={(e) => setNewTitle(e.target.value)}
                                                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                autoFocus
                                            />
                                            <button
                                                onClick={saveTitle}
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                <Save className="w-3 h-3 text-green-600" />
                                            </button>
                                            <button
                                                onClick={cancelEditTitle}
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                <X className="w-3 h-3 text-red-600" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                {chat.title}
                                            </h3>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    startEditTitle(chat);
                                                }}
                                                className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Edit3 className="w-3 h-3 text-gray-500" />
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(chat.lastModified).toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {chat.messages.length} mensajes • {chat.pages.length} páginas
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteChat(chat.id);
                                    }}
                                    className="p-1 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main chat area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowSidebar(true)}
                                className="lg:hidden p-2 hover:bg-gray-100 rounded"
                            >
                                <MessageSquare className="w-5 h-5" />
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900">
                                {currentChat?.title || 'Nueva conversación'}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentChat?.messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-3xl px-4 py-2 rounded-lg ${message.role === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                    }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">
                                    {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isGenerating && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                    <span className="text-sm">Generando página...</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input area */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-end gap-3">
                        <div className="flex-1">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Describe la landing page que quieres crear..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={1}
                                style={{ minHeight: '44px', maxHeight: '120px' }}
                            />
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={!input.trim() || isGenerating}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
