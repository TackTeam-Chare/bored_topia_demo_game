import { defineConfig } from 'vite';

export default defineConfig({
  preview: {
    allowedHosts: ['boredtopiademogame-production.up.railway.app']
  },
  server: {
    host: true,
    port: process.env.PORT || 4173
  }
});
