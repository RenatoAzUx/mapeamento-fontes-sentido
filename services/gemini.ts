
// Fix: Corrected property access from scores.scores to scores.sources to match the Scores type.
import { GoogleGenAI } from "@google/genai";
import { AssessmentResult } from "../types";
import { DIMENSIONS_MAP } from "../constants";

export const generateFeedback = async (result: AssessmentResult): Promise<string> => {
  // Inicialização usando process.env.API_KEY conforme diretrizes
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const { userInfo, scores } = result;

  const sourceNameMap = DIMENSIONS_MAP.reduce((acc, dim) => {
    dim.sources.forEach(s => acc[s.code] = s.name);
    return acc;
  }, {} as Record<string, string>);

  // FIX: scores.scores does not exist on type Scores, should be scores.sources
  const sortedSources = Object.entries(scores.sources)
    .sort((a, b) => (b[1] as number) - (a[1] as number));

  const top3 = sortedSources.slice(0, 3).map(([code, score]) => `${sourceNameMap[code]} (${score} pts)`);
  const bottom3 = sortedSources.slice(-3).map(([code, score]) => `${sourceNameMap[code]} (${score} pts)`);

  const systemInstruction = `Você é um assistente especializado em análise psicológica existencial. Sua função é gerar uma devolutiva profunda, focada em impacto e transformação.

Regras obrigatórias:
- Modelo: Foco total em impacto existencial, denso e sem rodeios.
- Extensão: Entre 600 e 800 palavras.
- Tom: Profundo, elegante, provocativo e direto ao ponto.
- Estrutura: 5 a 7 parágrafos em prosa fluida (sem listas).
- Conteúdo: Inicie pelo score, classifique a faixa, analise as dimensões e âncoras dominantes.
- Proibido: Menção a códigos técnicos (D1, S01, etc.) ou dizer que é IA.
- Recomendação: Refazer o mapeamento a cada 30-90 dias.
- CTAs: Incluir exatamente os blocos de links fornecidos ao final.

CLASSIFICAÇÃO DO SCORE TOTAL:
0–135 → Vazio existencial severo
136–270 → Grande vazio existencial
271–405 → Sentido moderadamente frágil
406–560 → Sentido moderadamente fortalecido
561–675 → Sentido profundamente consolidado`;

  const inputData = `
DADOS DO USUÁRIO:
- Nome: ${userInfo.name}
- Score Total: ${scores.globalScore}
- Auto-Transcendência: ${scores.dimensions['D1'] || 0}
- Autoatualização: ${scores.dimensions['D2'] || 0}
- Ordem: ${scores.dimensions['D3'] || 0}
- Bem-Estar e Prazer: ${scores.dimensions['D4'] || 0}
- Principais Fontes: ${top3.join(', ')}
- Fontes Menores: ${bottom3.join(', ')}
`;

  const userPrompt = `${inputData}

Gere a análise existencial focada em impacto agora (600-800 palavras).

Finalize com:
📩 Quer continuar aprofundando seu autoconhecimento?
👉 https://mestresdamente.beehiiv.com

🧠 Se você deseja alinhar esses resultados com sua vida real, envie:
👉 https://wa.me/5511998920790?text=Fiz%20meu%20teste%20de%20fontes%20de%20sentido%20de%20vida%20completo.%20Quero%20saber%20como%20aplicar%20para%20melhorar%20minha%20vida

🔎 Conteúdos diários:
👉 https://instagram.com/renatoli.on`;

  // Timeout de 40 segundos para maior resiliência conforme solicitado
  const fetchWithTimeout = async () => {
    const timeoutPromise = new Promise<any>((_, reject) => {
      setTimeout(() => reject(new Error("TIMEOUT_ERROR")), 40000);
    });

    const apiCall = ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return Promise.race([apiCall, timeoutPromise]);
  };

  try {
    const response = await fetchWithTimeout();
    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error: any) {
    // Log detalhado do erro para depuração no navegador
    console.log("DETALHES DO ERRO API GEMINI:", error);
    
    if (error.message === "TIMEOUT_ERROR") {
      return "TIMEOUT: A análise está demorando mais do que o esperado.";
    }
    
    return `ERRO_API: ${error.message || "Erro desconhecido na conexão com a IA."}`;
  }
};
