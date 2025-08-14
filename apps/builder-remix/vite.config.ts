import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [remix(), tsconfigPaths()],
  server: {
    port: 3000,
    headers: {
      // Required for WebContainer (SharedArrayBuffer)
      'Cross-Origin-Opener-Policy': 'same-origin',
      // strict isolation for SharedArrayBuffer
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Origin-Agent-Cluster': '?1',
    },
    // Disable HMR scripts that might break COEP/COOP; Remix already handles reloads
    hmr: { overlay: false },
  },
  optimizeDeps: {
    include: [
      "nanostores",
      "@nanostores/react",
      "isomorphic-git",
      "jszip",
      "file-saver",
      "shiki",
      "path-browserify",
      "buffer",
      "process",
      "util",
      "stream"
    ],
    exclude: [
      // Do not prebundle the WebContainer client; it must be loaded at runtime in the browser
      "@webcontainer/api"
    ]
  },
});
