import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import ragRoutes from './routes/rag-routes';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BuildBox RAG API',
      version: '1.0.0',
      description: 'API para análisis de viabilidad de negocios usando RAG (Retrieval-Augmented Generation)',
      contact: {
        name: 'BuildBox AI',
        email: 'support@buildbox.ai'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor de desarrollo'
      }
    ],
    tags: [
      {
        name: 'RAG',
        description: 'Endpoints del sistema RAG para análisis de negocios'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

const specs = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rutas del API
app.use('/api/rag', ragRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'BuildBox RAG API - Sistema de Análisis de Viabilidad de Negocios',
    version: '1.0.0',
    endpoints: {
      docs: '/api-docs',
      health: '/api/rag/health',
      stats: '/api/rag/stats',
      analyze: '/api/rag/analyze',
      test: '/api/rag/test'
    },
    description: 'API que utiliza RAG para analizar la viabilidad de ideas de negocio basándose en datos del mercado'
  });
});

// Middleware de manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error no manejado:', err);
  
  res.status(500).json({
    error: 'Internal server error',
    message: 'Ha ocurrido un error interno en el servidor',
    timestamp: new Date().toISOString()
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'La ruta solicitada no existe',
    availableRoutes: [
      'GET /',
      'GET /api-docs',
      'GET /api/rag/health',
      'GET /api/rag/stats',
      'POST /api/rag/analyze',
      'GET /api/rag/test'
    ]
  });
});

// Función para iniciar el servidor
async function startServer() {
  try {
    // Verificar variables de entorno requeridas
    const requiredEnvVars = ['GOOGLE_API_KEY', 'QDRANT_URL'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Variables de entorno faltantes: ${missingVars.join(', ')}`);
    }

    console.log('🚀 Iniciando BuildBox RAG API...');
    console.log(`📊 Puerto: ${PORT}`);
    console.log(`🔑 Google API Key: ${process.env.GOOGLE_API_KEY ? 'Configurada' : 'No configurada'}`);
    console.log(`🗄️  Qdrant URL: ${process.env.QDRANT_URL}`);
    
    app.listen(PORT, () => {
      console.log(`✅ Servidor iniciado exitosamente en http://localhost:${PORT}`);
      console.log(`📚 Documentación disponible en http://localhost:${PORT}/api-docs`);
      console.log(`🏥 Health check en http://localhost:${PORT}/api/rag/health`);
      console.log(`🧪 Test endpoint en http://localhost:${PORT}/api/rag/test`);
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de señales de terminación
process.on('SIGINT', () => {
  console.log('\n🛑 Recibida señal SIGINT, cerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Recibida señal SIGTERM, cerrando servidor...');
  process.exit(0);
});

// Iniciar servidor
startServer(); 