import { defineConfig } from 'vite';

export default defineConfig({
  // Configuración optimizada para TypeScript
  esbuild: {
    target: 'es2020',
  },
  
  // Optimizaciones de build
  build: {
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: true,
  },
  
  // Configuración del servidor de desarrollo
  server: {
    port: 3000,
    open: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  
  // Configuración de preview
  preview: {
    port: 4173,
    open: true,
  },
  
  // Optimizaciones para WebContainer
  optimizeDeps: {
    include: ['@webcontainer/api', 'xterm', 'xterm-addon-fit'],
  },
}); 