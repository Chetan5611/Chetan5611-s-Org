import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // This line pulls variables from the Cloud Run environment
  const env = loadEnv(mode, process.cwd(), ''); 

  return {
    plugins: [react(), tailwindcss()],
    define: {
      // This maps BOTH possible names to the code, just to be safe
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GOOGLE_API_KEY || env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    preview: {
      port: 8080,
      host: '0.0.0.0',
      strictPort: true,
      allowedHosts: true
    },
    base: './', 
  };
});
