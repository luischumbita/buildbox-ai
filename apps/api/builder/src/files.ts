/** @satisfies {import('@webcontainer/api').FileSystemTree} */

export const files = {
    'index.ts': {
      file: {
        contents: `
import express from 'express';
const app = express();
const port = 3111;

// Middleware para parsear JSON
app.use(express.json());

// Middleware para CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Ruta principal
app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to a WebContainers app! 🥳',
      timestamp: new Date().toISOString(),
      status: 'running'
    });
});

// Ruta de health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', uptime: process.uptime() });
});

// Ruta para obtener información del sistema
app.get('/info', (req, res) => {
    res.json({
      nodeVersion: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    });
});

app.listen(port, () => {
    console.log(\`Server is running at http://localhost:\${port}\`);
});`,
      },
    },
    'package.json': {
      file: {
        contents: `{
  "name": "webcontainer-app",
  "version": "1.0.0",
  "type": "module",
  "description": "A WebContainer application with auto-start capabilities",
  "main": "index.ts",
  "scripts": {
  
    "start": "nodemon --watch . --ext ts,js --exec 'tsx index.ts'",
    "dev": "tsx watch index.ts",
    "build": "tsx build index.ts",
    "test": "echo 'No tests specified'",
    "install-deps": "npm install",
    "clean": "rm -rf node_modules package-lock.json"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "tsx": "^4.6.2",
    "@types/node": "^20.10.0",
    "@types/express": "^4.17.21"
  },
  "keywords": ["webcontainer", "express", "typescript"],
  "author": "Your Name",
  "license": "MIT"
}`,
      },
    },
    'tsconfig.json': {
      file: {
        contents: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./",
    "types": ["node"]
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}`,
      },
    },
    '.gitignore': {
      file: {
        contents: `node_modules/
dist/
.env
*.log
.DS_Store
`,
      },
    },
    'README.md': {
      file: {
        contents: `# WebContainer App

Esta es una aplicación de ejemplo que se ejecuta automáticamente en WebContainer.

## Características

- Inicio automático con npm install y npm start
- Servidor Express con TypeScript
- Hot reload con nodemon
- Endpoints de health check y system info

## Endpoints

- \`GET /\` - Página principal
- \`GET /health\` - Estado del servidor
- \`GET /info\` - Información del sistema

## Desarrollo

El servidor se inicia automáticamente cuando se carga la aplicación.
`,
      },
    },
  };