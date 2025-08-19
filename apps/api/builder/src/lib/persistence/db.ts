export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export interface GeneratedPage {
    id: string;
    prompt: string;
    html: string;
    css: string;
    javascript: string;
    timestamp: string;
    chatId: string;
}

export interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    pages: GeneratedPage[];
    timestamp: string;
    lastModified: string;
}

export async function openDatabase(): Promise<IDBDatabase | undefined> {
    if (typeof indexedDB === 'undefined') {
        console.error('IndexedDB is not available in this environment.');
        return undefined;
    }

    return new Promise((resolve) => {
        const request = indexedDB.open('buildboxDB', 1);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;

            // Create chats store
            if (!db.objectStoreNames.contains('chats')) {
                const chatStore = db.createObjectStore('chats', { keyPath: 'id' });
                chatStore.createIndex('timestamp', 'timestamp', { unique: false });
                chatStore.createIndex('lastModified', 'lastModified', { unique: false });
            }

            // Create pages store
            if (!db.objectStoreNames.contains('pages')) {
                const pageStore = db.createObjectStore('pages', { keyPath: 'id' });
                pageStore.createIndex('chatId', 'chatId', { unique: false });
                pageStore.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };

        request.onsuccess = (event: Event) => {
            resolve((event.target as IDBOpenDBRequest).result);
        };

        request.onerror = (event: Event) => {
            console.error('Database error:', (event.target as IDBOpenDBRequest).error);
            resolve(undefined);
        };
    });
}

export async function getAllChats(db: IDBDatabase): Promise<ChatSession[]> {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('chats', 'readonly');
        const store = transaction.objectStore('chats');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result as ChatSession[]);
        request.onerror = () => reject(request.error);
    });
}

export async function getChat(db: IDBDatabase, id: string): Promise<ChatSession | undefined> {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('chats', 'readonly');
        const store = transaction.objectStore('chats');
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result as ChatSession);
        request.onerror = () => reject(request.error);
    });
}

export async function saveChat(db: IDBDatabase, chat: ChatSession): Promise<void> {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('chats', 'readwrite');
        const store = transaction.objectStore('chats');

        const chatToSave = {
            ...chat,
            lastModified: new Date().toISOString()
        };

        const request = store.put(chatToSave);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function deleteChat(db: IDBDatabase, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['chats', 'pages'], 'readwrite');
        const chatStore = transaction.objectStore('chats');
        const pageStore = transaction.objectStore('pages');

        // Delete chat
        const chatRequest = chatStore.delete(id);

        // Delete associated pages
        const pageIndex = pageStore.index('chatId');
        const pageRequest = pageIndex.getAll(id);

        pageRequest.onsuccess = () => {
            const pages = pageRequest.result as GeneratedPage[];
            pages.forEach(page => {
                pageStore.delete(page.id);
            });
        };

        chatRequest.onsuccess = () => resolve();
        chatRequest.onerror = () => reject(chatRequest.error);
    });
}

export async function savePage(db: IDBDatabase, page: GeneratedPage): Promise<void> {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('pages', 'readwrite');
        const store = transaction.objectStore('pages');

        const request = store.put(page);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function getPagesByChatId(db: IDBDatabase, chatId: string): Promise<GeneratedPage[]> {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('pages', 'readonly');
        const store = transaction.objectStore('pages');
        const index = store.index('chatId');
        const request = index.getAll(chatId);

        request.onsuccess = () => resolve(request.result as GeneratedPage[]);
        request.onerror = () => reject(request.error);
    });
}

export async function generateChatId(): Promise<string> {
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function generatePageId(): Promise<string> {
    return `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
