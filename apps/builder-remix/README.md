# Builder Remix - Generador de Páginas con IA

Una aplicación web moderna construida con Remix, React, TypeScript y Tailwind CSS que permite generar páginas completas usando inteligencia artificial.

## 🚀 Características

- **Generación con IA**: Integración con Google Gemini para crear páginas automáticamente
- **WebContainer**: Ejecución de código generado en un entorno aislado
- **Diseño Responsivo**: Interfaz moderna y accesible
- **Tiempo Real**: Generación y preview instantáneo de páginas

## 🛠️ Tecnologías

- **Frontend**: Remix, React, TypeScript
- **Styling**: Tailwind CSS
- **IA**: Google Gemini API
- **Runtime**: WebContainer
- **Build Tool**: Vite

## 📋 Requisitos Previos

- Node.js 18+ 
- pnpm (recomendado) o npm
- API key de Google Gemini

## 🔧 Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <repository-url>
   cd builder-remix
   ```

2. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

3. **Configurar API Key:**
   
   La API key de Gemini ya está configurada en el código para desarrollo.
   
   Para producción, crea un archivo `.env` en la raíz del proyecto:
   ```bash
   VITE_GEMINI_API_KEY=tu_api_key_aqui
   ```

4. **Ejecutar en desarrollo:**
   ```bash
   pnpm dev
   ```

5. **Abrir en el navegador:**
   ```
   http://localhost:3000
   ```

## 🎯 Uso

### Generador de Páginas

1. Ve a `/generator` en la aplicación
2. Selecciona el tipo de página (landing, dashboard, ecommerce, etc.)
3. Elige el estilo visual (moderno, minimalista, corporativo, etc.)
4. Describe detalladamente la página que quieres crear
5. Haz clic en "Generar Página con IA"
6. La IA generará el código y lo ejecutará en WebContainer
7. Accede a la página generada usando el enlace proporcionado

### Ejemplo de Descripción

```
"Una landing page para una empresa de software con hero section, 
características principales, testimonios de clientes, y formulario 
de contacto. Debe ser moderna, profesional y responsive."
```

## 🏗️ Estructura del Proyecto

```
app/
├── components/          # Componentes React reutilizables
│   ├── Header.tsx      # Navegación principal
│   ├── Hero.tsx        # Sección hero de la página principal
│   ├── Features.tsx    # Características del producto
│   └── PageGenerator.tsx # Generador de páginas con IA
├── hooks/              # Hooks personalizados
│   └── usePageGeneration.ts # Hook para generación de páginas
├── lib/                # Utilidades y servicios
│   ├── config/         # Configuración de la aplicación
│   │   └── api-keys.ts # Configuración de API keys
│   ├── prompts/        # Prompts para IA
│   │   └── page-generator.ts # Prompt para generación de páginas
│   ├── services/       # Servicios de la aplicación
│   │   ├── ai-service.ts # Servicio de IA con Gemini
│   │   ├── webcontainer-service.ts # Servicio de WebContainer
│   │   └── webcontainer-config.ts # Configuración de WebContainer
│   └── runtime/        # Runtime y utilidades
├── routes/             # Rutas de Remix
│   ├── _index.tsx      # Página principal
│   ├── features.tsx    # Página de características
│   ├── generator.tsx   # Generador de páginas
│   └── contact.tsx     # Página de contacto
└── styles/             # Estilos globales
    └── tailwind.css    # Configuración de Tailwind CSS
```

## 🔐 Configuración de API Keys

### Google Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crea una nueva API key
3. Copia la API key generada
4. Para desarrollo: La key ya está configurada en el código
5. Para producción: Agrega `VITE_GEMINI_API_KEY=tu_key` en tu archivo `.env`

## 🚀 Despliegue

### Netlify

1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno:
   - `VITE_GEMINI_API_KEY`: Tu API key de Gemini
3. Deploy automático en cada push

### Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard
3. Deploy automático en cada push

## 🐛 Solución de Problemas

### Error de API Key

Si recibes un error de API key inválida:
1. Verifica que la key esté correctamente configurada
2. Asegúrate de que la key tenga permisos para Gemini
3. Verifica que no haya espacios extra en la key

### Error de WebContainer

Si el WebContainer falla:
1. Verifica que estés usando un navegador moderno
2. Asegúrate de que JavaScript esté habilitado
3. Intenta recargar la página

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [Remix](https://remix.run/) - Framework web
- [Google Gemini](https://ai.google.dev/) - API de IA
- [WebContainer](https://webcontainers.io/) - Runtime de Node.js en el navegador
- [Tailwind CSS](https://tailwindcss.com/) - Framework de CSS
