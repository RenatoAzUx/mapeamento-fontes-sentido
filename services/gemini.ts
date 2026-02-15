
import { GoogleGenAI } from "@google/genai";
import { AssessmentResult } from "../types";
import { DIMENSIONS_MAP } from "../constants";

export const generateFeedback = async (result: AssessmentResult): Promise<string> => {
  // O Vite substituirá 'process.env.API_KEY' pelo valor real durante o build na Vercel.
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    return "ERRO_API: Chave de acesso não detectada. Certifique-se de que a variável 'API_KEY' ou 'VITE_API_KEY' foi adicionada nas configurações da Vercel e que o deploy foi concluído.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const { userInfo, scores } = result;

    const sourceNameMap = DIMENSIONS_MAP.reduce((acc, dim) => {
      dim.sources.forEach(s => acc[s.code] = s.name);
      return acc;
    }, {} as Record<string, string>);

    const sortedSources = Object.entries(scores.sources)
      .sort((a, b) => (b[1] as number) - (a[1] as number));

    const top3 = sortedSources.slice(0, 3).map(([code, score]) => `${sourceNameMap[code]} (${score} pts)`);

    const systemInstruction = `Você é um analista existencial. Gere uma devolutiva rápida e impactante.
Regras:
- Tamanho: 400 a 500 palavras.
- Tom: Profundo, elegante e transformador.
- Sem introduções genéricas. Vá direto ao ponto.
- Proibido usar listas ou bullet points.
- Terminar obrigatoriamente com os links de contato fornecidos.`;

    const inputData = `Nome: ${userInfo.name} | Score: ${scores.globalScore} | Top 3: ${top3.join(', ')}`;

    const userPrompt = `${inputData}

Gere agora a análise existencial (400-500 palavras).

Finalize com:
📩 Newsletter: https://mestresdamente.beehiiv.com
🧠 Consultoria: https://wa.me/5511998920790?text=Fiz%20meu%20mapeamento.%20Quero%20aplicar.
🔎 Instagram: https://instagram.com/renatoli.on`;

    // Alterado para 'gemini-flash-latest' para garantir compatibilidade total e evitar erro 400.
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
      }
    });

    return response.text || "Erro: Conteúdo não gerado.";

  } catch (error: any) {
    console.error("DEBUG GEMINI ERROR:", error);
    
    if (error.message?.includes("API Key") || error.message?.includes("key")) {
      return "ERRO_API: Chave inválida ou erro de autenticação. Verifique suas credenciais no Google AI Studio.";
    }

    return `ERRO_API: ${error.message || "Falha na conexão com o motor existencial."}`;
  }
};
