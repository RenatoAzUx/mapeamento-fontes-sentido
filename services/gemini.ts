
import {GoogleGenAI} from "@google/genai";
import { AssessmentResult } from "../types";
import { DIMENSIONS_MAP } from "../constants";

// Fix: Access API key exclusively through process.env.API_KEY as per SDK guidelines.
// This resolves the TypeScript error related to import.meta.env not existing on ImportMeta.
export const generateFeedback = async (result: AssessmentResult): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return "ERRO_API: Chave de acesso não detectada. Verifique se a variável 'API_KEY' está configurada.";
  }

  try {
    // Fix: Always initialize with a named parameter: new GoogleGenAI({ apiKey: process.env.API_KEY })
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

    // Fix: Use 'gemini-3-pro-preview' for advanced reasoning and complex text generation tasks.
    // Prohibited models like 'gemini-1.5-flash' must not be used.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
      }
    });

    // Fix: Access generated text via the .text property (not a method call).
    return response.text || "Erro: Conteúdo não gerado pela inteligência artificial.";

  } catch (error: any) {
    console.error("DEBUG GEMINI ERROR:", error);
    
    if (error.message?.includes("API key not valid")) {
      return "ERRO_API: A chave de API fornecida é inválida.";
    }

    return `ERRO_API: ${error.message || "Falha na conexão com o servidor de análise."}`;
  }
};
