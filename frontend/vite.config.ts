import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },  
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Keep for local development
        changeOrigin: true,
      },
    },
  },
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
      process.env.NODE_ENV === 'production'
        ? 'https://budget-app-tolz.onrender.com/api' // Use backend in production
        : 'http://localhost:3000/api' // Use localhost in dev
    ),
  },
  build: {
    chunkSizeWarningLimit: 1000,
  }
});
