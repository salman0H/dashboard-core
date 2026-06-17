import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Load environment variables from .env files
  const env = loadEnv(mode, process.cwd(), '')
  const targetApi = env.TARGET_API || "http://localhost:3002"

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
    },
    server: {
      port: 5173,
      proxy: {
        '/api/flow': {
          target: targetApi,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/flow/, ''),
        },
        '/api/tree': {
          target: targetApi,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/tree/, ''),
        },
        '/api/substation': {
          target: targetApi,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/substation/, ''),
        },
        '/api': {
          target: targetApi,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ''),
        },
      },
    },
    optimizeDeps: { include: ['elkjs'] },
  }
})