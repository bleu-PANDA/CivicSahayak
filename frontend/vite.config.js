import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backendPort = process.env.BACKEND_PORT || 8090;
const frontendPort = process.env.PORT || 5173;

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(frontendPort),
    proxy: {
      '/api': {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true
      }
    }
  }
});

