import { Request, Response } from 'express';
import { BusinessViabilityAgent } from '../agents/business-viability-agent';
import { RAGService } from '../services/rag-service';
import { PromptParserService } from '../services/prompt-parser-service';
import { BusinessAnalysisRequest, ExtractedBusinessInfo } from '../types/business';

export class RAGController {
  private businessAgent: BusinessViabilityAgent | null = null;
  private ragService: RAGService | null = null;
  private promptParser: PromptParserService | null = null;

  private async getBusinessAgent(): Promise<BusinessViabilityAgent> {
    if (!this.businessAgent) {
      this.businessAgent = new BusinessViabilityAgent();
    }
    return this.businessAgent;
  }

  private async getRAGService(): Promise<RAGService> {
    if (!this.ragService) {
      this.ragService = new RAGService();
    }
    return this.ragService;
  }

  private async getPromptParser(): Promise<PromptParserService> {
    if (!this.promptParser) {
      this.promptParser = new PromptParserService();
    }
    return this.promptParser;
  }

  /**
   * Analiza la viabilidad de un negocio
   */
  async analyzeBusinessViability(req: Request, res: Response): Promise<void> {
    try {
      const request: BusinessAnalysisRequest = req.body;
      
      // Validar la solicitud
      if (!request.prompt) {
        res.status(400).json({
          error: 'prompt is required',
          message: 'El prompt es obligatorio'
        });
        return;
      }

      console.log('Prompt recibido:', request.prompt);
      
      // Parsear el prompt para extraer información estructurada
      const promptParser = await this.getPromptParser();
      const extractedInfo: ExtractedBusinessInfo = await promptParser.parsePrompt(request);
      
      console.log('Información extraída:', extractedInfo);
      
      // Realizar el análisis usando la información extraída
      const businessAgent = await this.getBusinessAgent();
      const analysis: string = await businessAgent.analyzeBusinessViability(extractedInfo);
      
      res.status(200).json({
        success: true,
        data: {
          originalPrompt: request.prompt,
          extractedInfo: extractedInfo,
          analysis: analysis,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (error) {
      console.error('Error en análisis de viabilidad:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error al analizar la viabilidad del negocio',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Obtiene estadísticas del sistema RAG
   */
  async getRAGStats(req: Request, res: Response): Promise<void> {
    try {
      const businessAgent = await this.getBusinessAgent();
      const ragService = await this.getRAGService();
      
      const [agentStats, vectorStats] = await Promise.all([
        businessAgent.getAgentStats(),
        ragService.getVectorStoreStats()
      ]);
      
      res.status(200).json({
        success: true,
        data: {
          agent: agentStats,
          vectorStore: vectorStats,
          system: {
            status: 'operational',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
          }
        }
      });
      
    } catch (error) {
      console.error('Error obteniendo estadísticas RAG:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error al obtener estadísticas del sistema RAG',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Endpoint de salud del sistema
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      // Verificar conectividad con la base vectorial
      const ragService = await this.getRAGService();
      const vectorStats = await ragService.getVectorStoreStats();
      
      res.status(200).json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          rag: 'operational',
          vectorStore: vectorStats.error ? 'error' : 'operational',
          businessAgent: 'operational'
        },
        vectorStore: vectorStats.error ? { error: vectorStats.error } : vectorStats
      });
      
    } catch (error) {
      console.error('Error en health check:', error);
      res.status(503).json({
        success: false,
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Service unavailable',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Endpoint de prueba para validar el sistema
   */
  async testAnalysis(req: Request, res: Response): Promise<void> {
    try {
      const testRequest: BusinessAnalysisRequest = {
        prompt: "Quiero iniciar un negocio de venta de barcos en La Rioja, Argentina, para profesionales de 25-45 años, con una inversión de $50,000 ARS usando un modelo de e-commerce + tienda física"
      };

      console.log('Ejecutando análisis de prueba...');
      
      // Parsear el prompt de prueba
      const promptParser = await this.getPromptParser();
      const extractedInfo: ExtractedBusinessInfo = await promptParser.parsePrompt(testRequest);
      
      // Realizar el análisis
      const businessAgent = await this.getBusinessAgent();
      const analysis = await businessAgent.analyzeBusinessViability(extractedInfo);
      
      res.status(200).json({
        success: true,
        message: 'Análisis de prueba completado exitosamente',
        testRequest,
        result: {
          originalPrompt: testRequest.prompt,
          extractedInfo: extractedInfo,
          analysis: analysis
        },
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error en análisis de prueba:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error al ejecutar el análisis de prueba',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 