import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/OopsKart/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    host: true,
    open: false,
    allowedHosts: true,
  },
  preview: {
    port: 4174,
    host: true,
    allowedHosts: true,
  },
}))
