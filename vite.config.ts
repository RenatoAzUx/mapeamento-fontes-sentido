
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente do diretório raiz
  // Fix: Cast process to any to access cwd() which is available in Node.js during config execution
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Mapeia a chave de ambiente para o código do cliente
      // Prioriza VITE_API_KEY conforme padrão Vite, mas aceita API_KEY para compatibilidade Vercel
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY || "")
    },
    build: {
      target: 'esnext'
    }
  };
});
