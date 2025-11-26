import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Ensure it falls back to empty string so 'process' is not accessed in browser
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
    },
  };
});