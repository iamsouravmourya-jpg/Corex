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
          if (id.includes('node_modules/fabric')) return 'corex-scene-engine'
          if (id.includes('@dnd-kit')) return 'corex-hierarchy-dnd'
          if (id.includes('framer-motion')) return 'corex-kinetic-engine'
          if (id.includes('@radix-ui')) return 'corex-ui-primitives'
          if (id.includes('pako')) return 'corex-binary-ledger'
        },
      },
    },
  },
})
