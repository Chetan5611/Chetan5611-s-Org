import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    // ADD THIS SECTION FOR CLOUD RUN
    preview: {
      port: 8080,
      host: '0.0.0.0',
      strictPort: true,
      allowedHosts: true // Changes this to 'true' to bypass host checking
    },
    server: {
      // Keep your existing HMR logic
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
