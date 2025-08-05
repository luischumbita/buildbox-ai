# BuildBox AI

## Descripción

BuildBox AI es una plataforma de inteligencia artificial modular que combina múltiples servicios especializados para crear una solución completa de IA. El proyecto está diseñado con una arquitectura de microservicios utilizando Docker y Docker Compose.

## Arquitectura del Proyecto

El proyecto está organizado en dos aplicaciones principales:

### 📁 Apps
- **`api/`** - Servicios backend y microservicios
- **`web/`** - Aplicación frontend

## Servicios Disponibles

### 🔧 Backend (`apps/api/`)
- **Backend** (Puerto 3001) - Servicio principal de la API
- **Builder** (Puerto 3003) - Servicio de construcción y generación
- **RAG** (Puerto 3002) - Sistema de Recuperación Aumentada de Generación
- **Scraper** (Puerto 3004) - Servicio de extracción de datos web

### 🌐 Frontend (`apps/web/`)
- **Frontend** (Puerto 3000) - Interfaz de usuario web

## Tecnologías Utilizadas

- **Docker** - Contenedores para todos los servicios
- **Docker Compose** - Orquestación de servicios
- **Node.js** - Runtime para servicios backend
- **Qdrant** - Base de datos vectorial para RAG
- **pnpm** - Gestor de paquetes para el frontend

## Instalación y Configuración

### Prerrequisitos
- Docker
- Docker Compose
- Node.js 18+ (para desarrollo local)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd buildbox-ai
   ```

2. **Navegar al directorio de la API**
   ```bash
   cd apps/api
   ```

3. **Ejecutar con Docker Compose**
   ```bash
   docker-compose up --build
   ```

### Puertos de Acceso

Una vez ejecutado, los servicios estarán disponibles en:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **RAG Service**: http://localhost:3002
- **Builder Service**: http://localhost:3003
- **Scraper Service**: http://localhost:3004

## Estructura de Directorios

```
apps/
├── api/
│   ├── backend/          # Servicio principal de la API
│   ├── builder/          # Servicio de construcción
│   ├── rag/             # Sistema RAG
│   ├── scraper/         # Servicio de extracción
│   └── docker-compose.yaml
└── web/
    └── frontend/        # Aplicación web
```

## Desarrollo

### Desarrollo Local

Para desarrollo local sin Docker:

1. **Instalar dependencias del frontend**
   ```bash
   cd apps/web/frontend
   pnpm install
   pnpm dev
   ```

2. **Configurar servicios backend individualmente**
   - Cada servicio puede ejecutarse independientemente
   - Consultar la documentación específica de cada servicio

### Variables de Entorno

Asegúrate de configurar las siguientes variables de entorno según sea necesario:

- `DATABASE_URL` - URL de la base de datos Qdrant
- `DATABASE_PORT` - Puerto de la base de datos (6333 por defecto)

## Características Principales

### 🤖 Sistema RAG (Retrieval-Augmented Generation)
- Integración con base de datos vectorial Qdrant
- Búsqueda semántica avanzada
- Generación de respuestas basada en contexto

### 🔨 Builder Service
- Generación y construcción de contenido
- Procesamiento de datos en tiempo real

### 🕷️ Scraper Service
- Extracción automatizada de datos web
- Procesamiento de contenido dinámico

### 🌐 Frontend Moderno
- Interfaz de usuario reactiva
- Integración con todos los servicios backend
- Experiencia de usuario optimizada

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE).

## Contacto

Para preguntas o soporte, por favor contacta al equipo de desarrollo.

---

**Nota**: Este proyecto está en desarrollo activo. Algunos servicios pueden estar en fase de implementación. 