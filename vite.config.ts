import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/postcss'

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
})