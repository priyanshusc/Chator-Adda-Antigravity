import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This tells Vite: "Any request starting with /api, send it to the backend"
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      // This bridges your Socket.io connection
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
      },
    },
  },
});