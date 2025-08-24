# BuildBox AI - Monorepo con Turborepo y Bun

## 🚀 Descripción

BuildBox AI es una plataforma de inteligencia artificial modular que combina múltiples servicios especializados para crear una solución completa de IA. El proyecto está diseñado con una arquitectura de microservicios utilizando Docker y Docker Compose, y ahora está organizado como un monorepo usando **Turborepo** y **Bun**.

## 🏗️ Arquitectura del Proyecto

El proyecto está organizado como un monorepo con las siguientes aplicaciones:

### 📁 Apps
- **`api/`** - Servicios backend y microservicios
- **`web/`** - Aplicación frontend

## 🛠️ Tecnologías del Monorepo

- **Turborepo** - Herramienta de build system para monorepos
- **Bun** - Runtime y gestor de paquetes ultra-rápido
- **Docker** - Contenedores para todos los servicios
- **Docker Compose** - Orquestación de servicios
- **TypeScript** - Tipado estático para mejor desarrollo
- **Qdrant** - Base de datos vectorial para RAG

## 🚀 Servicios Disponibles

### 🔧 Backend (`apps/api/`)
- **Backend** (`@buildbox/backend`) - Servicio principal de la API
- **Builder** (`@buildbox/builder`) - Servicio de construcción y generación
- **RAG** (`@buildbox/rag`) - Sistema de Recuperación Aumentada de Generación
- **Scraper** (`@buildbox/scraper`) - Servicio de extracción de datos web

### 🌐 Frontend (`apps/web/`)
- **Web** (`@buildbox/web`) - Interfaz de usuario web

## 📦 Instalación y Configuración

### Prerrequisitos
- **Bun** 1.0.0 o superior
- **Docker** y **Docker Compose**
- **Node.js** 18+ (para compatibilidad)

### Instalación de Bun

```bash
# Instalar Bun
curl -fsSL https://bun.sh/install | bash

# Verificar instalación
bun --version
```

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd buildbox-ai/apps
   ```

2. **Instalar dependencias del monorepo**
   ```bash
   bun install
   ```

3. **Ejecutar con Docker Compose**
   ```bash
   bun run docker:up
   ```

### Scripts Disponibles

```bash
# Desarrollo
bun run dev          # Ejecutar todos los servicios en modo desarrollo
bun run build        # Construir todos los servicios
bun run lint         # Ejecutar linting en todos los servicios
bun run type-check   # Verificar tipos TypeScript

# Docker
bun run docker:up    # Levantar servicios con Docker
bun run docker:down  # Detener servicios Docker
bun run docker:logs  # Ver logs de Docker

# Utilidades
bun run clean        # Limpiar builds
bun run setup        # Instalar dependencias y construir
```

## 🏃‍♂️ Desarrollo

### Desarrollo Local

Para desarrollo local sin Docker:

```bash
# Ejecutar un servicio específico
cd api/backend
bun run dev

cd api/builder
bun run dev

cd api/rag
bun run dev
```

### Estructura del Monorepo

```
apps/
├── package.json          # Configuración raíz del monorepo
├── turbo.json           # Configuración de Turborepo
├── bunfig.toml         # Configuración de Bun
├── api/
│   ├── backend/        # @buildbox/backend
│   ├── builder/        # @buildbox/builder
│   ├── rag/           # @buildbox/rag
│   └── scraper/       # @buildbox/scraper
└── web/
    └── package.json    # @buildbox/web
```

### Ventajas del Monorepo

- **Gestión centralizada** de dependencias
- **Builds paralelos** y cacheados con Turborepo
- **Instalación rápida** de paquetes con Bun
- **Consistencia** entre servicios
- **Desarrollo eficiente** con hot reloading

## 🔧 Configuración de Turborepo

El archivo `turbo.json` define los pipelines de build:

- **build**: Construcción de todos los servicios
- **dev**: Desarrollo con hot reloading
- **lint**: Verificación de código
- **type-check**: Verificación de tipos TypeScript
- **clean**: Limpieza de builds
- **test**: Ejecución de tests
- **docker:build**: Construcción de imágenes Docker

## 🐰 Configuración de Bun

Bun se configura a través de `bunfig.toml`:

- **Workspaces**: Habilitados para gestión de paquetes
- **Scopes**: Configurados para paquetes internos `@buildbox/*`
- **Scripts**: Automatización de instalación

## 🐳 Docker y Servicios

### Puertos de Acceso

Una vez ejecutado, los servicios estarán disponibles en:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **RAG Service**: http://localhost:3002
- **Builder Service**: http://localhost:3003
- **Scraper Service**: http://localhost:3004

### Servicios de Infraestructura

- **MinIO**: Almacenamiento de objetos (puerto 9000)
- **Qdrant**: Base de datos vectorial (puerto 6333)
- **PostgreSQL**: Base de datos relacional (puerto 5432)

## 🚀 Características Principales

### 🤖 Sistema RAG (Retrieval-Augmented Generation)
- Integración con base de datos vectorial Qdrant
- Búsqueda semántica avanzada
- Generación de respuestas basada en contexto

### 🔨 Builder Service
- Generación y construcción de contenido
- Procesamiento de datos en tiempo real
- Interfaz web interactiva

### 🕷️ Scraper Service
- Extracción automatizada de datos web
- Procesamiento de contenido dinámico

### 🌐 Frontend Moderno
- Interfaz de usuario reactiva
- Integración con todos los servicios backend
- Experiencia de usuario optimizada

## 🔄 Migración y Mejoras

### ✅ Completado
- [x] Configuración de Turborepo
- [x] Migración a Bun
- [x] Estructura de monorepo
- [x] Scripts unificados
- [x] Gestión de workspaces

### 🚧 En Progreso
- [ ] Configuración completa de TypeScript
- [ ] Linting y formateo unificado
- [ ] Tests automatizados
- [ ] CI/CD pipeline

### 📋 Próximos Pasos
- [ ] Configurar ESLint y Prettier
- [ ] Implementar tests unitarios
- [ ] Configurar GitHub Actions
- [ ] Optimizar builds de Docker

## 🆘 Troubleshooting

### Problemas Comunes

1. **Bun no encontrado**
   ```bash
   curl -fsSL https://bun.sh/install | bash
   source ~/.bashrc
   ```

2. **Dependencias no instaladas**
   ```bash
   bun install
   ```

3. **Cache de Turborepo corrupto**
   ```bash
   bun run clean
   rm -rf .turbo
   bun install
   ```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE).

## 📞 Contacto

Para preguntas o soporte, por favor contacta al equipo de desarrollo.

---

**Nota**: Este proyecto está en desarrollo activo. La migración a Turborepo y Bun está completa y funcional. 