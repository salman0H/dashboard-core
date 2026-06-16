import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    port: 5173,
    proxy: {
      // Each namespace strips its own prefix so json-server sees flat keys.
      // /api/flow/nodes  → strips /api/flow → json-server: /nodes
      // /api/tree/treeData → strips /api/tree → json-server: /treeData
      // /api/substation/diagram → strips /api/substation → json-server: /diagram
      // /api/menus → strips /api → json-server: /menus
      '/api/flow': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/flow/, ''),
      },
      '/api/tree': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/tree/, ''),
      },
      '/api/substation': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/substation/, ''),
      },
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
    },
  },
  optimizeDeps: { include: ['elkjs'] },
})
