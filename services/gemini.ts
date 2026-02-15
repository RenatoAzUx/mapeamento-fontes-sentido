
import { GoogleGenAI } from "@google/genai";
import { AssessmentResult } from "../types";
import { DIMENSIONS_MAP } from "../constants";

export const generateFeedback = async (result: AssessmentResult): Promise<string> => {
  // A chave é injetada globalmente pelo Vite durante o build
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    return "ERRO_API: Chave de acesso não detectada. Verifique se a variável 'VITE_API_KEY' foi adicionada nas configurações da Vercel.";
  }

  try {
    // Inicialização do SDK utilizando o padrão process.env.API_KEY
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

    // Utilizando gemini-3-flash-preview para máxima compatibilidade e performance
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
      }
    });

    // Acessa a propriedade .text da resposta
    return response.text || "Erro: Conteúdo não gerado.";

  } catch (error: any) {
    console.error("DEBUG GEMINI ERROR:", error);
    
    // Captura erro específico de chave inválida retornado pela API
    if (error.message?.includes("API key not valid") || error.status === "INVALID_ARGUMENT") {
      return "ERRO_API: A chave de API no painel da Vercel é inválida ou contém caracteres extras. Por favor, gere uma nova chave no Google AI Studio e atualize as variáveis de ambiente.";
    }

    return `ERRO_API: ${error.message || "Falha na conexão com o motor existencial."}`;
  }
};
