# BuildBox RAG - Sistema de Análisis de Viabilidad de Negocios

## 🎯 Descripción

BuildBox RAG es un sistema inteligente que utiliza **Retrieval-Augmented Generation (RAG)** para analizar la viabilidad de ideas de negocio. El sistema combina una base de datos vectorial con el modelo Gemini de Google para proporcionar análisis detallados y motivadores sobre la viabilidad de emprendimientos.

## ✨ Características Principales

- 🧠 **Agente Especializado**: Consultor de negocios experto en análisis de viabilidad
- 🔍 **Búsqueda Semántica**: Recupera información relevante del mercado desde la base vectorial
- 📝 **Respuestas en Texto Libre**: Genera análisis persuasivos y motivadores (NO JSON)
- 🎯 **Recomendaciones Accionables**: Sugiere pasos concretos para el negocio
- 📈 **Insights del Mercado**: Identifica tendencias y oportunidades del sector
- ⚠️ **Análisis de Riesgos**: Evalúa factores de riesgo y amenazas potenciales

## 🚀 Inicio Rápido

### 1. Instalar Dependencias
```bash
cd apps/api/rag
pnpm install
```

### 2. Configurar Variables de Entorno
Crear archivo `.env`:
```bash
GOOGLE_API_KEY=tu_api_key_de_google
QDRANT_URL=http://localhost:6333
PORT=3001
```

### 3. Construir y Ejecutar
```bash
pnpm run build
pnpm start
```

### 4. Acceder a Swagger UI
Abrir: http://localhost:3001/api-docs

## 📱 Uso del API

### Endpoint Principal: Análisis de Viabilidad

```http
POST /api/rag/analyze
Content-Type: application/json

{
  "businessIdea": "Venta de bicicletas eléctricas",
  "location": "Madrid, España",
  "targetMarket": "Profesionales urbanos 25-45 años",
  "investmentAmount": 50000,
  "businessModel": "E-commerce + tienda física"
}
```

### Respuesta (Texto Libre - NO JSON)

```json
{
  "success": true,
  "data": {
    "analysis": "¡Excelente idea! Tu negocio de venta de bicicletas eléctricas en Madrid es VIABLE...",
    "businessIdea": "Venta de bicicletas eléctricas",
    "location": "Madrid, España",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Otros Endpoints

- `GET /api/rag/health` - Estado del sistema
- `GET /api/rag/stats` - Estadísticas del sistema
- `GET /api/rag/test` - Análisis de prueba
- `GET /api-docs` - Documentación Swagger

## 🔧 Desarrollo

### Scripts Disponibles
```bash
pnpm run dev          # Desarrollo con hot reload
pnpm run build        # Construir para producción
pnpm start            # Iniciar en producción
pnpm run test-rag     # Probar sistema RAG
```

### Estructura del Proyecto
```
src/
├── agents/
│   └── business-viability-agent.ts    # Agente de análisis
├── controllers/
│   └── rag-controller.ts              # Controlador de endpoints
├── routes/
│   └── rag-routes.ts                  # Definición de rutas
├── services/
│   └── rag-service.ts                 # Servicio RAG
├── types/
│   └── business.ts                    # Tipos TypeScript
└── index.ts                           # Servidor principal
```

## 🎨 Formato de Respuesta

El sistema ahora genera respuestas en **texto libre** en lugar de JSON estructurado:

- **Análisis de Viabilidad**: VIABLE, NO VIABLE, o necesita MEJORAS
- **Razonamiento Detallado**: Explicación completa del análisis
- **Recomendaciones Concretas**: Pasos específicos para el emprendedor
- **Insights del Mercado**: Tendencias y oportunidades relevantes
- **Próximos Pasos**: Acciones inmediatas a tomar

## 🌐 Swagger UI

Accede a la documentación interactiva en:
```
http://localhost:3001/api-docs
```

Desde ahí puedes:
- Probar todos los endpoints
- Ver ejemplos de requests/responses
- Ejecutar análisis de viabilidad
- Verificar el estado del sistema

## 🧪 Pruebas

### Script de Prueba
```bash
pnpm run test-rag
```

### Endpoint de Prueba
```bash
curl http://localhost:3001/api/rag/test
```

## 🐳 Docker

### Ejecutar con Docker Compose
```bash
docker-compose -f docker-compose.rag.yml up -d
```

### Servicios Incluidos
- **Qdrant**: Base de datos vectorial
- **RAG API**: Servidor principal
- **MinIO**: Almacenamiento de archivos (opcional)

## 📊 Monitoreo

- **Health Check**: `/api/rag/health`
- **Estadísticas**: `/api/rag/stats`
- **Logs**: Consola del servidor
- **Swagger**: Documentación y pruebas

## 🔒 Seguridad

- Validación de entrada en todos los endpoints
- Manejo seguro de errores
- CORS configurado
- Variables de entorno para credenciales

## 🚨 Solución de Problemas

### Error: "GOOGLE_API_KEY environment variable is required"
```bash
# Configurar en .env
GOOGLE_API_KEY=tu_api_key_aqui
```

### Error: "Cannot connect to Qdrant"
```bash
# Verificar que Qdrant esté ejecutándose
docker ps | grep qdrant
```

### Error: "Module not found"
```bash
# Recompilar el proyecto
pnpm run build
```

## 📝 Ejemplo de Uso Completo

1. **Iniciar el servidor**:
   ```bash
   pnpm start
   ```

2. **Abrir Swagger UI**:
   ```
   http://localhost:3001/api-docs
   ```

3. **Probar análisis**:
   - Ir a `POST /api/rag/analyze`
   - Hacer clic en "Try it out"
   - Ingresar datos del negocio
   - Ejecutar y ver la respuesta en texto

4. **Respuesta esperada**:
   ```
   "¡Excelente idea! Tu negocio de venta de bicicletas eléctricas en Madrid es VIABLE..."
   ```

## 🎉 ¡Listo!

Tu sistema RAG está funcionando y generando análisis de viabilidad en texto libre. Los emprendedores ahora reciben respuestas motivadoras y accionables en lugar de JSON estructurado.

---

**BuildBox RAG** - Transformando ideas en negocios viables con IA 🚀 