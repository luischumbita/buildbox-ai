import { GoogleGenerativeAI } from "@google/generative-ai";
import { ExtractedBusinessInfo, BusinessContext, ScrapedPage } from "../types/business";
import { RAGService } from "../services/rag-service";

export class BusinessViabilityAgent {
  private llm: GoogleGenerativeAI;
  private ragService: RAGService;
  private model: any;

  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY environment variable is required');
    }

    this.llm = new GoogleGenerativeAI(apiKey);
    this.model = this.llm.getGenerativeModel({
      model: "gemini-2.0-flash",
    });
    this.ragService = new RAGService();
  }

  /**
   * Analiza la viabilidad de un negocio basándose en el contexto RAG
   */
  async analyzeBusinessViability(request: ExtractedBusinessInfo): Promise<string> {
    try {
      // Obtener contexto relevante de la base vectorial
      const businessContext = await this.ragService.searchRelevantContext(request);
      
      // Generar el prompt para el análisis
      const prompt = this.buildAnalysisPrompt(request, businessContext);
      
      // Obtener respuesta del modelo
      const response = await this.model.generateContent(prompt);
      const responseText = response.response.text();
      
      return responseText;
    } catch (error) {
      console.error('Error analyzing business viability:', error);
      throw new Error('Failed to analyze business viability');
    }
  }

  /**
   * Construye el prompt para el análisis de viabilidad
   */
  private buildAnalysisPrompt(request: ExtractedBusinessInfo, context: BusinessContext): string {
    return `
Eres un experto consultor de negocios especializado en análisis de viabilidad de emprendimientos. 
Tu tarea es evaluar si un negocio es viable basándote en la información del mercado disponible.

IDEA DE NEGOCIO: ${request.businessIdea}
UBICACIÓN: ${request.location || 'No especificada'}
MERCADO OBJETIVO: ${request.targetMarket || 'No especificado'}
INVERSIÓN: ${request.investmentAmount ? `$${request.investmentAmount}` : 'No especificada'}
MODELO DE NEGOCIO: ${request.businessModel || 'No especificado'}

CONTEXTO DEL MERCADO DISPONIBLE:
${this.formatMarketContext(context)}

INSTRUCCIONES:
Analiza la viabilidad del negocio basándote en el contexto del mercado disponible y proporciona:

1. **ANÁLISIS DE VIABILIDAD**: Evalúa si el negocio es VIABLE, NO VIABLE, o necesita MEJORAS
2. **RAZONAMIENTO DETALLADO**: Explica tu análisis considerando:
   - Oportunidad de mercado
   - Nivel de competencia
   - Factores de ubicación
   - Viabilidad financiera
   - Factores de riesgo
3. **RECOMENDACIONES CONCRETAS**: Sugiere pasos específicos para el emprendedor
4. **INSIGHTS DEL MERCADO**: Identifica tendencias y oportunidades relevantes
5. **PRÓXIMOS PASOS**: Define acciones inmediatas que debe tomar

RESPONDE EN UN FORMATO PERSUASIVO Y ENTRETENIDO:
Tu tarea es darle una visión realista pero motivadora al emprendedor, basándote en el análisis realizado. 
Explica si su negocio es viable, no viable, o si necesita algunos ajustes o consejos adicionales. 
Una vez hecho esto, devuélvele un mensaje detallado para que el emprendedor sepa si es conveniente proceder.

IMPORTANTE: Responde en texto libre, de manera clara y motivadora, sin formato JSON.
`;
  }

  /**
   * Formatea el contexto del mercado para el prompt
   */
  private formatMarketContext(context: BusinessContext): string {
    let formatted = '';
    
    if (context.marketData.length > 0) {
      formatted += 'DATOS DEL MERCADO:\n';
      context.marketData.forEach((data, index) => {
        formatted += `${index + 1}. Ubicación: ${data.location}\n`;
        formatted += `   Relevancia: ${data.relevance}%\n`;
        formatted += `   Contenido: ${(data.content ?? '').substring(0, 200)}...\n\n`;
      });
    }
    
    if (context.competitorAnalysis.length > 0) {
      formatted += 'ANÁLISIS DE COMPETENCIA:\n';
      context.competitorAnalysis.forEach((analysis, index) => {
        formatted += `${index + 1}. Relevancia: ${analysis.relevance}%\n`;
        formatted += `   Contenido: ${analysis.content.substring(0, 200)}...\n\n`;
      });
    }
    
    if (context.industryTrends.length > 0) {
      formatted += 'TENDENCIAS DE LA INDUSTRIA:\n';
      context.industryTrends.forEach((trend, index) => {
        formatted += `${index + 1}. ${trend.substring(0, 200)}...\n\n`;
      });
    }
    
    if (!formatted) {
      formatted = 'No hay información específica del mercado disponible para esta ubicación o industria.';
    }
    
    return formatted;
  }



  /**
   * Obtiene estadísticas del agente y la base vectorial
   */
  async getAgentStats(): Promise<any> {
    try {
      const vectorStats = await this.ragService.getVectorStoreStats();
      
      return {
        agent: 'BusinessViabilityAgent',
        model: 'gemini-2.0-flash',
        vectorStore: vectorStats,
        status: 'active'
      };
    } catch (error) {
      console.error('Error getting agent stats:', error);
      return { error: 'Failed to get agent statistics' };
    }
  }
} 