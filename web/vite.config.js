import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    // allow access via the cloudflare tunnel hostname + LAN dev
    allowedHosts: ['lab.remaker.work', 'localhost', '127.0.0.1', '192.168.1.194'],
  },
})
