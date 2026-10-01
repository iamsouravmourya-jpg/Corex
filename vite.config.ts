import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/fabric')) return 'lernex-quantum-stage'
          if (id.includes('framer-motion')) return 'lernex-kinetic-motion'
          if (id.includes('pako')) return 'lernex-binary-ledger'
          if (id.includes('lucide-react')) return 'lernex-vector-icons'
        },
      },
    },
  },
})
