
// Digest works as a vector DB emptier
import { QdrantClient } from "@qdrant/js-client-rest";

// Validacion de variables de entorno
const validateEnvironment = (): void => {
    if (!process.env.QDRANT_URL) {
        throw new Error('QDRANT_URL environment variable is required');
    }
    if (!process.env.QDRANT_API_KEY) {
        throw new Error('QDRANT_API_KEY environment variable is required');
    }
};

// Configuracion de Qdrant
const getQdrantConfig = () => ({
    url: process.env.QDRANT_URL!,
    apiKey: process.env.QDRANT_API_KEY!,
});

// Inicializacion del cliente de Qdrant
const createQdrantClient = (config: ReturnType<typeof getQdrantConfig>): QdrantClient => {
    return new QdrantClient({
        port: 80,
        url: config.url,
        apiKey: config.apiKey,
        checkCompatibility: false,
    });
};

const COLLECTION_NAME = "buildBox-rag";

// Funcion de limpieza de colección
async function clearCollection(): Promise<void> {
    try {
        validateEnvironment();
        
        const config = getQdrantConfig();
        const client = createQdrantClient(config);
        
        console.log(`Iniciando limpieza de la colección: ${COLLECTION_NAME}`);
        
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
        await clearCollection();
        console.log('Proceso completado exitosamente');
    } catch (error) {
        console.error('Error en el proceso principal:', error);
        process.exit(1);
    }
};
