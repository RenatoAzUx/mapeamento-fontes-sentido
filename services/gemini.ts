
import { GoogleGenAI } from "@google/genai";
import { AssessmentResult } from "../types";
import { DIMENSIONS_MAP } from "../constants";

export const generateFeedback = async (result: AssessmentResult): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    return "ERRO_CONFIG: Chave de API não encontrada no ambiente de execução.";
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
    
    const top3 = sortedSources.slice(0, 3).map(([code, score]) => `${sourceNameMap[code]} (${score}/25)`);
    const bottom3 = sortedSources.slice(-3).map(([code, score]) => `${sourceNameMap[code]} (${score}/25)`);

    const systemInstruction = `Você é um Neurocientista do Comportamento e Psicoterapeuta de linha Estoica, especialista no framework da Dra. Tatjana Schnell (Sources of Meaning).

DIRETRIZES DE ANÁLISE:
1. ANÁLISE DE CONTRASTE: Identifique as tensões entre suas fontes mais fortes (ex: Autoatualização) e as mais baixas (ex: Ordem ou Bem-estar). Não descreva o sujeito, descreva o conflito funcional do sistema.
2. LINGUAGEM TÉCNICA: Use termos como "viés de hiper-foco", "regulação comportamental", "clareza executiva", "homeostase existencial" e "âncoras de execução".
3. PRAGMATISMO: Menos "você é" e mais "seu perfil exige estas ações/ajustes". Foque na 'Tarefa de Sentido' de Viktor Frankl.
4. PROIBIÇÕES: Proibido o uso de adjetivos grandiloquentes, elogios ou links internos.

ESTRUTURA OBRIGATÓRIA:
- PARÁGRAFO 1: Diagnóstico de Contraste (Tensões entre pontos altos e baixos).
- PARÁGRAFO 2: Riscos de Regulação (O que acontece se o sistema não for equilibrado).
- PARÁGRAFO 3: Tarefas de Execução (Ações práticas imediatas).
- CONCLUSÃO: Uma frase final seca afirmando que, devido à complexidade das tensões identificadas, o próximo passo exige o alinhamento profissional e a inserção em comunidade através dos botões de ação logo abaixo.

Tamanho: 400 a 500 palavras. Texto corrido sem bullet points.`;

    const inputData = `
PACIENTE: ${userInfo.name}
SCORE GLOBAL: ${scores.globalScore}/675
FONTES DOMINANTES: ${top3.join(', ')}
FONTES DE BAIXA ATIVAÇÃO: ${bottom3.join(', ')}
DIMENSÕES: Auto-Transcendência (${scores.dimensions['D1']}), Autoatualização (${scores.dimensions['D2']}), Ordem (${scores.dimensions['D3']}), Bem-estar (${scores.dimensions['D4']}).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analise clinicamente este perfil existencial sob o framework da Dra. Tatjana Schnell:\n${inputData}`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "Erro: O motor de análise não retornou dados.";

  } catch (error: any) {
    console.error("DEBUG GEMINI ERROR:", error);
    return `ERRO_SISTEMA: ${error.message || "Falha na modulação do feedback clínico."}`;
  }
};
