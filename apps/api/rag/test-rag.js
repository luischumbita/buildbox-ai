#!/usr/bin/env node

/**
 * Script de prueba para validar el sistema RAG
 * Ejecutar con: node test-rag.js
 */

require('dotenv').config();

async function testRAGSystem() {
  console.log('🧪 Iniciando pruebas del sistema RAG...\n');

  try {
    // Importar las clases del sistema
    const { RAGService } = require('./dist/src/services/rag-service');
    const { BusinessViabilityAgent } = require('./dist/src/agents/business-viability-agent');

    console.log('✅ Módulos importados correctamente');

    // Crear instancias
    const ragService = new RAGService();
    const businessAgent = new BusinessViabilityAgent();

    console.log('✅ Servicios inicializados correctamente');

    // Probar conexión con la base vectorial
    console.log('\n🔍 Probando conexión con base vectorial...');
    const vectorStats = await ragService.getVectorStoreStats();
    console.log('📊 Estadísticas de la base vectorial:', vectorStats);

    // Probar búsqueda de contexto
    console.log('\n🔍 Probando búsqueda de contexto...');
    const testRequest = {
      businessIdea: "Venta de bicicletas eléctricas",
      location: "Madrid, España",
      targetMarket: "Profesionales urbanos 25-45 años",
      investmentAmount: 50000,
      businessModel: "E-commerce + tienda física"
    };

    const context = await ragService.searchRelevantContext(testRequest);
    console.log('📋 Contexto encontrado:', {
      businessIdea: context.businessIdea,
      location: context.location,
      marketDataCount: context.marketData.length,
      competitorAnalysisCount: context.competitorAnalysis.length,
      industryTrendsCount: context.industryTrends.length
    });

    // Probar análisis de viabilidad
    console.log('\n🧠 Probando análisis de viabilidad...');
    const analysis = await businessAgent.analyzeBusinessViability(testRequest);
    
    console.log('📊 Resultado del análisis:');
    console.log(`   Viabilidad: ${analysis.viability}`);
    console.log(`   Confianza: ${analysis.confidence}%`);
    console.log(`   Oportunidad de mercado: ${analysis.analysis.marketOpportunity}/100`);
    console.log(`   Competencia: ${analysis.analysis.competition}/100`);
    console.log(`   Ubicación: ${analysis.analysis.location}/100`);
    console.log(`   Viabilidad financiera: ${analysis.analysis.financialFeasibility}/100`);
    console.log(`   Factores de riesgo: ${analysis.analysis.riskFactors}/100`);
    
    console.log('\n💡 Razonamiento:', analysis.reasoning);
    console.log('\n🎯 Recomendaciones:', analysis.recommendations);
    console.log('\n📈 Insights del mercado:', analysis.marketInsights);
    console.log('\n⚠️  Riesgos:', analysis.risks);
    console.log('\n🚀 Próximos pasos:', analysis.nextSteps);

    // Probar estadísticas del agente
    console.log('\n📊 Probando estadísticas del agente...');
    const agentStats = await businessAgent.getAgentStats();
    console.log('📈 Estadísticas del agente:', agentStats);

    console.log('\n🎉 ¡Todas las pruebas completadas exitosamente!');
    console.log('\n📝 Resumen:');
    console.log('   ✅ Conexión con base vectorial');
    console.log('   ✅ Búsqueda de contexto RAG');
    console.log('   ✅ Análisis de viabilidad con Gemini');
    console.log('   ✅ Generación de recomendaciones');
    console.log('   ✅ Estadísticas del sistema');

  } catch (error) {
    console.error('\n❌ Error durante las pruebas:', error.message);
    console.error('\n🔍 Detalles del error:', error);
    
    if (error.message.includes('GOOGLE_API_KEY')) {
      console.log('\n💡 Solución: Configura la variable de entorno GOOGLE_API_KEY');
    }
    
    if (error.message.includes('QDRANT_URL')) {
      console.log('\n💡 Solución: Configura la variable de entorno QDRANT_URL');
    }
    
    if (error.message.includes('Cannot find module')) {
      console.log('\n💡 Solución: Ejecuta "pnpm run build" antes de las pruebas');
    }
    
    process.exit(1);
  }
}

// Ejecutar pruebas
testRAGSystem().catch(console.error); 