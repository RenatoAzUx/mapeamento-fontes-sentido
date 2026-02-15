
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente do processo de build (Vercel)
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Remove espaços em branco ou quebras de linha acidentais
  const rawKey = env.VITE_API_KEY || env.API_KEY || "";
  const cleanKey = rawKey.trim();

  return {
    plugins: [react()],
    define: {
      // O SDK espera encontrar a chave em process.env.API_KEY
      'process.env.API_KEY': JSON.stringify(cleanKey)
    },
    build: {
      target: 'esnext'
    }
  };
});
