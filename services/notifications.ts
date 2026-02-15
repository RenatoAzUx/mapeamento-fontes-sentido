
import { AssessmentResult } from "../types";

const ADMIN_EMAIL = "suporte@renatoazarias.com.br";

/**
 * Serviço para enviar os resultados da avaliação para o administrador.
 * Em um cenário real, isso faria um POST para um backend ou serviço de email (como EmailJS ou SendGrid).
 */
export const sendResultToAdmin = async (result: AssessmentResult): Promise<boolean> => {
  console.log(`[Notificação] Enviando resultados de ${result.userInfo.name} para ${ADMIN_EMAIL}...`);
  
  const payload = {
    to: ADMIN_EMAIL,
    subject: `Nova Avaliação: Portal de Sentido de Vida - ${result.userInfo.name}`,
    user: result.userInfo,
    scores: result.scores,
    timestamp: new Date().toISOString()
  };

  try {
    // Simulação de chamada de API (Substitua por seu endpoint real de backend ou Webhook)
    // Exemplo: await fetch('https://seu-backend.com/api/notify', { method: 'POST', body: JSON.stringify(payload) });
    
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simula latência de rede
    
    console.log("[Notificação] Dados enviados com sucesso!");
    return true;
  } catch (error) {
    console.error("[Notificação] Erro ao enviar dados:", error);
    return false;
  }
};
