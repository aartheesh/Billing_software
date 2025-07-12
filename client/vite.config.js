import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './', // 👈 this is essential for Electron loadFile to work
  plugins: [react()],
  define: {
    'process.env': {}, // For better-sqlite3 compatibility
  },
})
