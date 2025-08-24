export const WEBCONTAINER_CONFIG = {
    // Default project structure
    defaultFiles: {
        'src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,

        'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;`,

        'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,

        'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

        'tsconfig.node.json': `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`
    },

    // Package.json template
    packageJsonTemplate: (projectName: string = 'generated-page') => `{
  "name": "${projectName}",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}`,

    // Vite config template
    viteConfigTemplate: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
})`,

    // Index.html template
    indexHtmlTemplate: (title: string = 'Generated Page') => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

    // TypeScript config template
    tsConfigTemplate: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`
};

// Utility functions for WebContainer operations
export const webcontainerUtils = {
    // Parse generated code to extract file information
    parseCodeToFiles: (generatedCode: string): Array<{ path: string; content: string }> => {
        const files: Array<{ path: string; content: string }> = [];

        // Look for file markers in the generated code
        const fileRegex = /\/\/\s*File:\s*(.+?)(?:\n|$)/g;
        let match;

        while ((match = fileRegex.exec(generatedCode)) !== null) {
            const filePath = match[1].trim();
            const nextFileMatch = fileRegex.exec(generatedCode);

            if (nextFileMatch) {
                // Extract content between current file and next file
                const startIndex = match.index + match[0].length;
                const endIndex = nextFileMatch.index;
                const content = generatedCode.substring(startIndex, endIndex).trim();

                if (content) {
                    files.push({ path: filePath, content });
                }
            } else {
                // Last file - extract content to end
                const startIndex = match.index + match[0].length;
                const content = generatedCode.substring(startIndex).trim();

                if (content) {
                    files.push({ path: filePath, content });
                }
            }
        }

        // If no file markers found, treat the entire code as a single component
        if (files.length === 0 && generatedCode.trim()) {
            files.push({
                path: 'src/GeneratedPage.tsx',
                content: generatedCode.trim()
            });
        }

        return files;
    },

    // Generate a complete project structure
    generateProjectStructure: (mainComponent: string, projectName?: string) => {
        const files = [
            {
                path: 'src/App.tsx',
                content: mainComponent
            },
            {
                path: 'src/main.tsx',
                content: WEBCONTAINER_CONFIG.defaultFiles['src/main.tsx']
            },
            {
                path: 'src/index.css',
                content: WEBCONTAINER_CONFIG.defaultFiles['src/index.css']
            },
            {
                path: 'package.json',
                content: WEBCONTAINER_CONFIG.packageJsonTemplate(projectName)
            },
            {
                path: 'vite.config.ts',
                content: WEBCONTAINER_CONFIG.viteConfigTemplate
            },
            {
                path: 'index.html',
                content: WEBCONTAINER_CONFIG.indexHtmlTemplate(projectName)
            },
            {
                path: 'tsconfig.json',
                content: WEBCONTAINER_CONFIG.tsConfigTemplate
            },
            {
                path: 'tailwind.config.js',
                content: WEBCONTAINER_CONFIG.defaultFiles['tailwind.config.js']
            },
            {
                path: 'postcss.config.js',
                content: WEBCONTAINER_CONFIG.defaultFiles['postcss.config.js']
            },
            {
                path: 'tsconfig.node.json',
                content: WEBCONTAINER_CONFIG.defaultFiles['tsconfig.node.json']
            }
        ];

        return files;
    }
};
