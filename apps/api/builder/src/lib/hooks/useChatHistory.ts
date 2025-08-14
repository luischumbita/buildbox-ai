import { useState, useEffect, useCallback } from 'react';
import { openDatabase, saveChat, getChat, getAllChats, deleteChat, savePage, generateChatId, generatePageId, type ChatSession, type ChatMessage, type GeneratedPage } from '../persistence/db';

export function useChatHistory() {
    const [db, setDb] = useState<IDBDatabase | null>(null);
    const [chats, setChats] = useState<ChatSession[]>([]);
    const [currentChat, setCurrentChat] = useState<ChatSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize database
    useEffect(() => {
        const initDB = async () => {
            try {
                const database = await openDatabase();
                if (database) {
                    setDb(database);
                    await loadChats(database);
                }
            } catch (error) {
                console.error('Failed to initialize database:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initDB();
    }, []);

    // Load all chats
    const loadChats = useCallback(async (database: IDBDatabase) => {
        try {
            const allChats = await getAllChats(database);
            setChats(allChats.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()));
        } catch (error) {
            console.error('Failed to load chats:', error);
        }
    }, []);

    // Create new chat
    const createNewChat = useCallback(async (title: string = 'Nueva conversación') => {
        if (!db) return null;

        try {
            const newChat: ChatSession = {
                id: await generateChatId(),
                title,
                messages: [],
                pages: [],
                timestamp: new Date().toISOString(),
                lastModified: new Date().toISOString()
            };

            await saveChat(db, newChat);
            setChats(prev => [newChat, ...prev]);
            setCurrentChat(newChat);
            return newChat;
        } catch (error) {
            console.error('Failed to create new chat:', error);
            return null;
        }
    }, [db]);

    // Load specific chat
    const loadChat = useCallback(async (chatId: string) => {
        if (!db) return null;

        try {
            const chat = await getChat(db, chatId);
            if (chat) {
                setCurrentChat(chat);
                return chat;
            }
        } catch (error) {
            console.error('Failed to load chat:', error);
        }
        return null;
    }, [db]);

    // Add message to current chat
    const addMessage = useCallback(async (role: 'user' | 'assistant', content: string) => {
        if (!db || !currentChat) return null;

        try {
            const newMessage: ChatMessage = {
                id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                role,
                content,
                timestamp: new Date().toISOString()
            };

            const updatedChat: ChatSession = {
                ...currentChat,
                messages: [...currentChat.messages, newMessage],
                lastModified: new Date().toISOString()
            };

            await saveChat(db, updatedChat);
            setCurrentChat(updatedChat);
            setChats(prev => prev.map(chat => chat.id === currentChat.id ? updatedChat : chat));

            return newMessage;
        } catch (error) {
            console.error('Failed to add message:', error);
            return null;
        }
    }, [db, currentChat]);

    // Save generated page
    const saveGeneratedPage = useCallback(async (prompt: string, html: string, css: string, javascript: string) => {
        if (!db || !currentChat) return null;

        try {
            const newPage: GeneratedPage = {
                id: await generatePageId(),
                prompt,
                html,
                css,
                javascript,
                timestamp: new Date().toISOString(),
                chatId: currentChat.id
            };

            await savePage(db, newPage);

            const updatedChat: ChatSession = {
                ...currentChat,
                pages: [...currentChat.pages, newPage],
                lastModified: new Date().toISOString()
            };

            await saveChat(db, updatedChat);
            setCurrentChat(updatedChat);
            setChats(prev => prev.map(chat => chat.id === currentChat.id ? updatedChat : chat));

            return newPage;
        } catch (error) {
            console.error('Failed to save page:', error);
            return null;
        }
    }, [db, currentChat]);

    // Delete chat
    const removeChat = useCallback(async (chatId: string) => {
        if (!db) return false;

        try {
            await deleteChat(db, chatId);
            setChats(prev => prev.filter(chat => chat.id !== chatId));

            if (currentChat?.id === chatId) {
                setCurrentChat(null);
            }

            return true;
        } catch (error) {
            console.error('Failed to delete chat:', error);
            return false;
        }
    }, [db, currentChat]);

    // Update chat title
    const updateChatTitle = useCallback(async (chatId: string, newTitle: string) => {
        if (!db) return false;

        try {
            const chat = chats.find(c => c.id === chatId);
            if (!chat) return false;

            const updatedChat: ChatSession = {
                ...chat,
                title: newTitle,
                lastModified: new Date().toISOString()
            };

            await saveChat(db, updatedChat);
            setChats(prev => prev.map(c => c.id === chatId ? updatedChat : c));

            if (currentChat?.id === chatId) {
                setCurrentChat(updatedChat);
            }

            return true;
        } catch (error) {
            console.error('Failed to update chat title:', error);
            return false;
        }
    }, [db, chats, currentChat]);

    return {
        db,
        chats,
        currentChat,
        isLoading,
        createNewChat,
        loadChat,
        addMessage,
        saveGeneratedPage,
        removeChat,
        updateChatTitle,
        loadChats
    };
}
