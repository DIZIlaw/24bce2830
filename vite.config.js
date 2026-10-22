import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/24bce2830/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
