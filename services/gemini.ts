
import { GoogleGenAI } from "@google/genai";
import { AssessmentResult } from "../types";
import { DIMENSIONS_MAP } from "../constants";

export const generateFeedback = async (result: AssessmentResult): Promise<string> => {
  // Use process.env.API_KEY directly as required by the Google GenAI SDK guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const { userInfo, scores } = result;

  const sourceNameMap = DIMENSIONS_MAP.reduce((acc, dim) => {
    dim.sources.forEach(s => acc[s.code] = s.name);
    return acc;
  }, {} as Record<string, string>);

  const sortedSources = Object.entries(scores.sources)
    .sort((a, b) => (b[1] as number) - (a[1] as number));

  const top3 = sortedSources.slice(0, 3).map(([code, score]) => `${sourceNameMap[code]} (${score} pts)`);
  const bottom3 = sortedSources.slice(-3).map(([code, score]) => `${sourceNameMap[code]} (${score} pts)`);

  const systemInstruction = `Você é um assistente especializado em análise psicológica existencial. Sua função é gerar uma devolutiva profunda, focada em impacto e transformação.

Regras obrigatórias:
- Modelo: Foco total em impacto existencial, sem rodeios ou introduções genéricas.
- Extensão: Entre 500 e 700 palavras.
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

Gere a análise existencial focada em impacto agora.

Finalize com:
📩 Quer continuar aprofundando seu autoconhecimento?
👉 https://mestresdamente.beehiiv.com

🧠 Se você deseja alinhar esses resultados com sua vida real, envie:
👉 https://wa.me/5511998920790?text=Fiz%20meu%20teste%20de%20fontes%20de%20sentido%20de%20vida%20completo.%20Quero%20saber%20como%20aplicar%20para%20melhorar%20minha%20vida

🔎 Conteúdos diários:
👉 https://instagram.com/renatoli.on`;

  // Implementação de Timeout de 60 segundos
  const fetchWithTimeout = async () => {
    const timeoutPromise = new Promise<any>((_, reject) => {
      setTimeout(() => reject(new Error("TIMEOUT_ERROR")), 60000);
    });

    // Use ai.models.generateContent to query GenAI with model name and prompt directly.
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
    // Access the .text property directly (not as a function).
    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error: any) {
    if (error.message === "TIMEOUT_ERROR") {
      return "OCORREU UM TEMPO LIMITE: A análise profunda está levando mais tempo do que o esperado devido à alta demanda. Por favor, clique no botão 'Reiniciar' ou tente novamente em alguns instantes para processar seus dados.";
    }
    console.error("Erro na geração de devolutiva:", error);
    return "ERRO DE CONEXÃO: Não conseguimos conectar com o motor de análise existencial. Por favor, verifique sua conexão e tente novamente.";
  }
};
