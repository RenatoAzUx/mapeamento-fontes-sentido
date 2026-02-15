
import { GoogleGenAI } from "@google/genai";
import { AssessmentResult } from "../types";
import { DIMENSIONS_MAP } from "../constants";

export const generateFeedback = async (result: AssessmentResult): Promise<string> => {
  // O Vite substituirá 'process.env.API_KEY' pelo valor configurado no vite.config.ts
  if (!process.env.API_KEY || process.env.API_KEY === "" || process.env.API_KEY === "undefined") {
    return "ERRO_API: Chave de acesso não detectada. Verifique se 'VITE_API_KEY' está configurada no painel da Vercel e realize um novo deploy.";
  }

  try {
    // Fix: Always use process.env.API_KEY directly when initializing the GoogleGenAI instance.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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

    // Fix: Use ai.models.generateContent directly to query GenAI with model and prompt.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
      }
    });

    // Fix: Use the .text property to access generated content (not a method).
    return response.text || "Erro: Conteúdo não gerado.";

  } catch (error: any) {
    console.error("DEBUG GEMINI ERROR:", error);
    
    if (error.message?.includes("API Key") || error.message?.includes("key")) {
      return "ERRO_API: Chave inválida ou erro de cota. Verifique as configurações no Google AI Studio.";
    }

    return `ERRO_API: ${error.message || "Falha na conexão com a inteligência artificial."}`;
  }
};
