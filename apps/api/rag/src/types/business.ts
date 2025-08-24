export interface BusinessAnalysisRequest {
  prompt: string;
}

export interface ExtractedBusinessInfo {
  businessIdea: string;
  location?: string;
  targetMarket?: string;
  investmentAmount?: number;
  businessModel?: string;
}

export interface BusinessAnalysisResponse {
  viability: 'VIABLE' | 'NOT_VIABLE' | 'NEEDS_IMPROVEMENT';
  confidence: number; // 0-100
  analysis: {
    marketOpportunity: number; // 0-100
    competition: number; // 0-100
    location: number; // 0-100
    financialFeasibility: number; // 0-100
    riskFactors: number; // 0-100
  };
  reasoning: string;
  recommendations: string[];
  marketInsights: string[];
  risks: string[];
  nextSteps: string[];
}

export interface ScrapedPage {
  url: string;
  title: string;
  content: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface MarketData {
  location: string;
  demographics: Record<string, any>;
  economicIndicators: Record<string, any>;
  competition: Record<string, any>;
  marketTrends: string[];
  content?: string;
  relevance?: number;
  source?: string;
}

export interface BusinessContext {
  businessIdea: string;
  location: string;
  marketData: MarketData[];
  competitorAnalysis: any[];
  industryTrends: string[];
} 