
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Use '.' instead of process.cwd() to avoid TypeScript errors regarding the Process type 
  // while still correctly targeting the project root for loading environment variables.
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    build: {
      target: 'esnext'
    },
    define: {
      // Mapeia a API_KEY do sistema para process.env.API_KEY no código do cliente
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY)
    }
  };
});
