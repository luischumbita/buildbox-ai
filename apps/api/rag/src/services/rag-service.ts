import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document } from "@langchain/core/documents";
import { ExtractedBusinessInfo, BusinessContext, ScrapedPage } from "../types/business";

export class RAGService {
  private vectorStore: QdrantVectorStore;
  private embeddings: GoogleGenerativeAIEmbeddings;
  private client: QdrantClient;

  constructor() {
    this.embeddings = new GoogleGenerativeAIEmbeddings({
      model: "models/embedding-001",
    });

    this.client = new QdrantClient({
      port: 80,
      url: process.env.QDRANT_URL || 'http://localhost:6333',
      apiKey: process.env.QDRANT_API_KEY,
      checkCompatibility: false,
    });

    this.vectorStore = new QdrantVectorStore(this.embeddings, {
      client: this.client,
      collectionName: "buildBox-rag",
    });
  }

  /**
   * Busca información relevante en la base vectorial basada en la consulta del negocio
   */
  async searchRelevantContext(businessRequest: ExtractedBusinessInfo): Promise<BusinessContext> {
    try {
      // Crear una consulta semántica basada en la idea de negocio
      const query = this.buildSearchQuery(businessRequest);
      
      // Buscar documentos relevantes
      const relevantDocs = await this.vectorStore.similaritySearch(query, 10);
      
      // Extraer y estructurar la información del contexto
      const businessContext = this.extractBusinessContext(relevantDocs, businessRequest);
      
      return businessContext;
    } catch (error) {
      console.error('Error searching relevant context:', error);
      throw new Error('Failed to retrieve business context from vector database');
    }
  }

  /**
   * Construye una consulta de búsqueda semántica basada en la solicitud de negocio
   */
  private buildSearchQuery(request: ExtractedBusinessInfo): string {
    const { businessIdea, location, targetMarket, businessModel } = request;
    
    let query = `Análisis de viabilidad de negocio: ${businessIdea}`;
    
    if (location) {
      query += ` en ${location}`;
    }
    
    if (targetMarket) {
      query += ` mercado objetivo: ${targetMarket}`;
    }
    
    if (businessModel) {
      query += ` modelo de negocio: ${businessModel}`;
    }
    
    // Agregar términos relacionados con análisis de mercado
    query += ` análisis de mercado competencia demografía economía tendencias industria`;
    
    return query;
  }

  /**
   * Extrae y estructura el contexto de negocio de los documentos encontrados
   */
  private extractBusinessContext(docs: Document[], request: ExtractedBusinessInfo): BusinessContext {
    const marketData: any[] = [];
    const competitorAnalysis: any[] = [];
    const industryTrends: string[] = [];
    
    // Procesar cada documento para extraer información relevante
    docs.forEach(doc => {
      const content = doc.pageContent;
      const metadata = doc.metadata;
      
      // Extraer información de ubicación si está disponible
      if (request.location && content.toLowerCase().includes(request.location.toLowerCase())) {
        marketData.push({
          location: request.location,
          content: content,
          relevance: this.calculateRelevance(content, request.businessIdea),
          source: metadata.source || 'unknown'
        });
      }
      
      // Extraer análisis de competencia
      if (this.containsCompetitionInfo(content)) {
        competitorAnalysis.push({
          content: content,
          relevance: this.calculateRelevance(content, request.businessIdea),
          source: metadata.source || 'unknown'
        });
      }
      
      // Extraer tendencias de la industria
      if (this.containsIndustryTrends(content)) {
        industryTrends.push(content);
      }
    });
    
    return {
      businessIdea: request.businessIdea,
      location: request.location || 'No especificada',
      marketData,
      competitorAnalysis,
      industryTrends
    };
  }

  /**
   * Calcula la relevancia de un documento para la idea de negocio
   */
  private calculateRelevance(content: string, businessIdea: string): number {
    const businessKeywords = businessIdea.toLowerCase().split(' ');
    const contentLower = content.toLowerCase();
    
    let relevance = 0;
    businessKeywords.forEach(keyword => {
      if (contentLower.includes(keyword)) {
        relevance += 1;
      }
    });
    
    return Math.min(relevance / businessKeywords.length * 100, 100);
  }

  /**
   * Verifica si el contenido contiene información sobre competencia
   */
  private containsCompetitionInfo(content: string): boolean {
    const competitionKeywords = [
      'competencia', 'competidor', 'rival', 'mercado', 'oferta', 'demanda',
      'competition', 'competitor', 'rival', 'market', 'supply', 'demand'
    ];
    
    return competitionKeywords.some(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  /**
   * Verifica si el contenido contiene tendencias de la industria
   */
  private containsIndustryTrends(content: string): boolean {
    const trendKeywords = [
      'tendencia', 'crecimiento', 'evolución', 'futuro', 'innovación',
      'trend', 'growth', 'evolution', 'future', 'innovation'
    ];
    
    return trendKeywords.some(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  /**
   * Obtiene estadísticas de la base vectorial
   */
  async getVectorStoreStats(): Promise<any> {
    try {
      const collectionInfo = await this.client.getCollection("buildBox-rag");
      return {
        collectionName: "buildBox-rag",
        vectorCount: collectionInfo.vectors_count,
        status: collectionInfo.status
      };
    } catch (error) {
      console.error('Error getting vector store stats:', error);
      return { error: 'Failed to get vector store statistics' };
    }
  }
} 