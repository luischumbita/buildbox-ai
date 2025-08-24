import { Router } from 'express';
import { RAGController } from '../controllers/rag-controller';

const router = Router();
const ragController = new RAGController();

/**
 * @swagger
 * /api/rag/health:
 *   get:
 *     summary: Verificar el estado de salud del sistema RAG
 *     tags: [RAG]
 *     responses:
 *       200:
 *         description: Sistema operativo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 status:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *       503:
 *         description: Sistema no disponible
 */
router.get('/health', (req, res) => ragController.healthCheck(req, res));

/**
 * @swagger
 * /api/rag/stats:
 *   get:
 *     summary: Obtener estadísticas del sistema RAG
 *     tags: [RAG]
 *     responses:
 *       200:
 *         description: Estadísticas del sistema
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */
router.get('/stats', (req, res) => ragController.getRAGStats(req, res));

/**
 * @swagger
 * /api/rag/analyze:
 *   post:
 *     summary: Analizar la viabilidad de un negocio
 *     tags: [RAG]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *         schema:
 *           type: object
 *           required:
 *             - prompt
 *           properties:
 *             prompt:
 *               type: string
 *               description: Prompt de texto libre describiendo la idea de negocio
 *               example: "Quiero iniciar un negocio de bicicletas eléctricas en Madrid, España"
 *     responses:
 *       200:
 *         description: Análisis completado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     originalPrompt:
 *                       type: string
 *                       description: Prompt original del usuario
 *                       example: "Quiero iniciar un negocio de bicicletas eléctricas en Madrid, España"
 *                     extractedInfo:
 *                       type: object
 *                       description: Información extraída del prompt
 *                       properties:
 *                         businessIdea:
 *                           type: string
 *                           description: Idea de negocio extraída
 *                         location:
 *                           type: string
 *                           description: Ubicación extraída (opcional)
 *                         targetMarket:
 *                           type: string
 *                           description: Mercado objetivo extraído (opcional)
 *                         investmentAmount:
 *                           type: number
 *                           description: Monto de inversión extraído (opcional)
 *                         businessModel:
 *                           type: string
 *                           description: Modelo de negocio extraído (opcional)
 *                     analysis:
 *                       type: string
 *                       description: Análisis detallado de viabilidad del negocio en formato texto
 *                       example: "Tu idea de negocio de venta de bicicletas eléctricas en Madrid es VIABLE..."
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Solicitud inválida
 *       500:
 *         description: Error interno del servidor
 */
router.post('/analyze', (req, res) => ragController.analyzeBusinessViability(req, res));

/**
 * @swagger
 * /api/rag/test:
 *   get:
 *     summary: Ejecutar análisis de prueba
 *     tags: [RAG]
 *     responses:
 *       200:
 *         description: Análisis de prueba completado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 testRequest:
 *                   type: object
 *                 result:
 *                   type: object
 *       500:
 *         description: Error interno del servidor
 */
router.get('/test', (req, res) => ragController.testAnalysis(req, res));

export default router; 