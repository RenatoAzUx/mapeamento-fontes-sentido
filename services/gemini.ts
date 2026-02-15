
import { GoogleGenAI } from "@google/genai";
import { AssessmentResult } from "../types";
import { DIMENSIONS_MAP } from "../constants";

export const generateFeedback = async (result: AssessmentResult): Promise<string> => {
  // Em produção (Vercel/Netlify), a chave virá de process.env.API_KEY configurada no painel da plataforma.
  // Em desenvolvimento local, ele tentará usar a chave disponível no contexto.
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("API_KEY não encontrada. Certifique-se de configurá-la nas variáveis de ambiente.");
    return "Erro de configuração: Chave de API não encontrada. Se você for o administrador, configure a API_KEY nas variáveis de ambiente.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const { userInfo, scores } = result;

  const sourceNameMap = DIMENSIONS_MAP.reduce((acc, dim) => {
    dim.sources.forEach(s => acc[s.code] = s.name);
    return acc;
  }, {} as Record<string, string>);

  const sortedSources = Object.entries(scores.sources)
    .sort((a, b) => (b[1] as number) - (a[1] as number));

  const top3 = sortedSources.slice(0, 3).map(([code, score]) => `${sourceNameMap[code]} (${score} pts)`);
  const bottom3 = sortedSources.slice(-3).map(([code, score]) => `${sourceNameMap[code]} (${score} pts)`);

  const systemInstruction = `Você é um assistente especializado em análise psicológica existencial e interpretação de sentido de vida. Sua função é gerar uma devolutiva profunda, reflexiva e estruturada para um teste autoral de 135 perguntas baseado em 27 fontes de sentido organizadas em 4 dimensões.

Regras obrigatórias:
- Nunca utilizar códigos técnicos como D1, D2, S01 etc.
- Utilizar exclusivamente os nomes completos das dimensões: Auto-Transcendência, Autoatualização, Ordem, Bem-Estar e Prazer.
- Sempre iniciar a devolutiva pelo score total.
- Classificar o resultado dentro das 5 faixas definidas.
- Não realizar diagnóstico clínico.
- Não usar linguagem alarmista.
- Linguagem profunda, clara, elegante, provocativa e esperançosa.
- Produzir entre 600 e 800 palavras.
- Estruturar em 7 a 10 parágrafos organizados em formato narrativo fluido.
- Não utilizar listas com marcadores; escrever em prosa contínua.
- Recomende explicitamente que o usuário refaça este mapeamento a cada 30 ou 90 dias.
- Não mencionar que é uma inteligência artificial.
- Encerrar com os três CTAs fornecidos.

CLASSIFICAÇÃO DO SCORE TOTAL:
0–135 → Vazio existencial severo
136–270 → Grande vazio existencial
271–405 → Sentido moderadamente frágil
406–560 → Sentido moderadamente fortalecido
561–675 → Sentido profundamente consolidado`;

  const inputData = `
INPUT RECEBIDO:
- score_total: ${scores.globalScore}
- score_auto_transcendencia: ${scores.dimensions['D1'] || 0}
- score_autoatualizacao: ${scores.dimensions['D2'] || 0}
- score_ordem: ${scores.dimensions['D3'] || 0}
- score_bem_estar_prazer: ${scores.dimensions['D4'] || 0}
- top_3_fontes: ${top3.join(', ')}
- bottom_3_fontes: ${bottom3.join(', ')}
- nome_usuario: ${userInfo.name}
`;

  const userPrompt = `${inputData}

Gere a devolutiva completa seguindo as regras de estilo narrativo.

Finalize EXATAMENTE com este bloco de CTAs:

📩 Quer continuar aprofundando seu autoconhecimento?
Entre gratuitamente para a comunidade Mestres da Mente e receba reflexões semanais sobre sentido, clareza mental e performance:
👉 https://mestresdamente.beehiiv.com

🧠 Se você deseja alinhar esses resultados com sua vida real, posso te ajudar pessoalmente.
Envie a mensagem abaixo no WhatsApp:
👉 https://wa.me/5511998920790?text=Fiz%20meu%20teste%20de%20fontes%20de%20sentido%20de%20vida%20completo.%20Quero%20saber%20como%20aplicar%20para%20melhorar%20minha%20vida

🔎 Quer acompanhar conteúdos diários sobre mente, comportamento e performance?
👉 https://instagram.com/renatoli.on`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
      }
    });

    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error: any) {
    console.error("Erro na geração de devolutiva:", error);
    return "Ocorreu um erro ao processar sua análise existencial profunda. Por favor, tente novamente.";
  }
};
