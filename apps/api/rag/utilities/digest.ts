
// Digest works as a vector DB emptier
import { QdrantClient } from "@qdrant/js-client-rest";
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Validacion de variables de entorno
const validateEnvironment = (): void => {
    if (!process.env.QDRANT_URL && !process.env.QDRANT_HOST) {
        throw new Error('QDRANT_URL or QDRANT_HOST environment variable is required');
    }
};

// Configuracion de Qdrant
const getQdrantConfig = () => ({
    url: process.env.QDRANT_URL || `http://${process.env.QDRANT_HOST || 'localhost:6333'}`,
    apiKey: process.env.QDRANT_API_KEY || undefined,
});

// Inicializacion del cliente de Qdrant
const createQdrantClient = (config: ReturnType<typeof getQdrantConfig>): QdrantClient => {
    const clientConfig: any = {
        port: 80,
        url: config.url,
        checkCompatibility: false,
    };
    
    // Solo agregar apiKey si está definido
    if (config.apiKey) {
        clientConfig.apiKey = config.apiKey;
    }
    
    return new QdrantClient(clientConfig);
};

const COLLECTION_NAME = "buildBox-rag";

// Funcion de limpieza de colección
async function clearCollection(): Promise<void> {
    try {
        validateEnvironment();
        
        const config = getQdrantConfig();
        console.log(`Conectando a Qdrant en: ${config.url}`);
        
        const client = createQdrantClient(config);
        
        console.log(`Iniciando limpieza de la colección: ${COLLECTION_NAME}`);
        
        // Primero verificar si la colección existe
        try {
            const collectionInfo = await client.getCollection(COLLECTION_NAME);
            console.log(`Colección ${COLLECTION_NAME} encontrada, procediendo a limpiar...`);
        } catch (error) {
            console.log(`Colección ${COLLECTION_NAME} no existe, no hay nada que limpiar`);
            return;
        }
        
        // Eliminar todos los puntos de la colección usando un filtro vacío
        console.log('Eliminando todos los puntos de la colección...');
        await client.delete(COLLECTION_NAME, {
            filter: {} // Sin filtro, elimina todos los puntos
        });
        
        console.log(`Colección ${COLLECTION_NAME} limpiada exitosamente`);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error al limpiar la colección ${COLLECTION_NAME}:`, errorMessage);
        throw error;
    }
}

// Ejecucion principal
const main = async (): Promise<void> => {
    try {
        // Agregar timeout de 30 segundos
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout: El proceso tardó más de 30 segundos')), 30000);
        });
        
        const clearPromise = clearCollection();
        
        await Promise.race([clearPromise, timeoutPromise]);
        console.log('Proceso completado exitosamente');
    } catch (error) {
        console.error('Error en el proceso principal:', error);
        process.exit(1);
    }
};

// Ejecutar la función principal
main().catch((error) => {
    console.error('Error no manejado:', error);
    process.exit(1);
});
