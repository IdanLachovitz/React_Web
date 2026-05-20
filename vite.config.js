import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/recommendations': 'http://localhost:8000',
      '/search': 'http://localhost:8000',
      '/category': 'http://localhost:8000',
      '/library': 'http://localhost:8000',
      '/login': 'http://localhost:8000',
      '/register': 'http://localhost:8000',
    }
  }
})
