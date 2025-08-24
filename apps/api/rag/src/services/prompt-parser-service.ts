import { GoogleGenerativeAI } from "@google/generative-ai";
import { BusinessAnalysisRequest, ExtractedBusinessInfo } from "../types/business";

export class PromptParserService {
  private llm: GoogleGenerativeAI;
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
  }

  /**
   * Extrae información estructurada del prompt de texto libre del usuario
   */
  async parsePrompt(request: BusinessAnalysisRequest): Promise<ExtractedBusinessInfo> {
    try {
      const prompt = this.buildParsingPrompt(request.prompt);
      
      const response = await this.model.generateContent(prompt);
      const responseText = response.response.text();
      
      return this.parseExtractedInfo(responseText);
    } catch (error) {
      console.error('Error parsing prompt:', error);
      // Fallback: extraer información básica del prompt
      return this.fallbackExtraction(request.prompt);
    }
  }

  /**
   * Construye el prompt para extraer información del texto del usuario
   */
  private buildParsingPrompt(userPrompt: string): string {
    return `
Eres un experto en análisis de negocios. Tu tarea es extraer información estructurada del siguiente prompt de un emprendedor:

PROMPT DEL USUARIO:
"${userPrompt}"

INSTRUCCIONES:
Extrae y estructura la siguiente información del prompt:

1. **IDEA DE NEGOCIO**: ¿Qué tipo de negocio quiere iniciar?
2. **UBICACIÓN**: ¿En qué lugar/ciudad/país?
3. **MERCADO OBJETIVO**: ¿A quién va dirigido? (opcional)
4. **INVERSIÓN**: ¿Menciona algún monto de inversión? (opcional)
5. **MODELO DE NEGOCIO**: ¿Describe algún modelo específico? (opcional)

RESPONDE EN FORMATO JSON:
{
  "businessIdea": "Descripción clara de la idea de negocio",
  "location": "Ubicación si se menciona, null si no",
  "targetMarket": "Mercado objetivo si se menciona, null si no",
  "investmentAmount": número si se menciona, null si no,
  "businessModel": "Modelo de negocio si se menciona, null si no"
}

IMPORTANTE: 
- Si no se menciona algo, usa null
- businessIdea es obligatorio, los demás son opcionales
- Responde ÚNICAMENTE con el JSON válido
`;
  }

  /**
   * Parsea la respuesta del modelo a la estructura esperada
   */
  private parseExtractedInfo(responseText: string): ExtractedBusinessInfo {
    try {
      // Limpiar la respuesta para extraer solo el JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No se encontró JSON válido en la respuesta');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validar que tenga al menos businessIdea
      if (!parsed.businessIdea) {
        throw new Error('businessIdea es obligatorio');
      }
      
      return {
        businessIdea: parsed.businessIdea,
        location: parsed.location || undefined,
        targetMarket: parsed.targetMarket || undefined,
        investmentAmount: parsed.investmentAmount || undefined,
        businessModel: parsed.businessModel || undefined
      };
    } catch (error) {
      console.error('Error parsing extracted info:', error);
      // Fallback a extracción básica
      return this.fallbackExtraction(responseText);
    }
  }

  /**
   * Extracción de fallback en caso de error del modelo
   */
  private fallbackExtraction(prompt: string): ExtractedBusinessInfo {
    const promptLower = prompt.toLowerCase();
    
    // Extraer idea de negocio básica
    let businessIdea = prompt;
    
    // Intentar extraer ubicación
    let location: string | undefined;
    const locationPatterns = [
      /en\s+([^,]+)/i,
      /de\s+([^,]+)/i,
      /para\s+([^,]+)/i
    ];
    
    for (const pattern of locationPatterns) {
      const match = prompt.match(pattern);
      if (match) {
        location = match[1].trim();
        break;
      }
    }
    
    // Intentar extraer inversión
    let investmentAmount: number | undefined;
    const investmentMatch = prompt.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    if (investmentMatch) {
      investmentAmount = parseFloat(investmentMatch[1].replace(/,/g, ''));
    }
    
    return {
      businessIdea,
      location,
      investmentAmount
    };
  }
} 