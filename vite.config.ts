import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Set base to repo name for GitHub Pages deployment
  base: '/zarya/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
