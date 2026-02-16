
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

    const systemInstruction = `Você é um Psicoterapeuta e Neurocientista Comportamental de linha Estoica e Logoterapêutica (Frankl), especialista no framework da Dra. Tatjana Schnell.

DIRETRIZES DE ANÁLISE:
1. PERSONALIZAÇÃO: Use o nome do paciente (${userInfo.name}) para estabelecer o vínculo clínico.
2. DIAGNÓSTICO DE ASSIMETRIAS: Analise as disparidades entre as 4 dimensões. Identifique onde há "hiperativação" de uma área em detrimento de outra (Ex: Alta Autoatualização vs Baixa Ordem). Explique como isso gera disfunção prática (hiper-foco vs negligência).
3. VIESES E RISCOS: Identifique vieses cognitivos baseados nos scores baixos. Proponha uma "arquitetura de restrições" para converter inércia em atuação.
4. LINGUAGEM TÉCNICA: Use termos como "clareza executiva", "homeostase existencial", "âncoras de execução" e "regulação comportamental".

ESTRUTURA OBRIGATÓRIA:
- TÍTULO: Análise de Viabilidade Existencial para ${userInfo.name}
- SEÇÃO 1: Diagnóstico de Assimetrias (Contraste funcional entre dimensões).
- SEÇÃO 2: Riscos de Regulação e Vieses (Onde o sistema falha por negligência).
- SEÇÃO 3: Tarefas de Sentido (3 ações concretas e pragmáticas para os pontos cegos).
- CONCLUSÃO: Um parágrafo final convidando o paciente para a "Consulta de Alinhamento" direta, o acesso à "Comunidade Mestres da Mente" e a conexão no Instagram através dos cards de ação disponíveis abaixo deste texto.

RESTRIÇÕES: Proibido adjetivos vazios ou tons motivacionais genéricos. Mantenha o tom de um laudo técnico-terapêutico.`;

    const inputData = `
PACIENTE: ${userInfo.name}
SCORE GLOBAL: ${scores.globalScore}/675
DIMENSÕES: Auto-Transcendência (${scores.dimensions['D1']}), Autoatualização (${scores.dimensions['D2']}), Ordem (${scores.dimensions['D3']}), Bem-estar (${scores.dimensions['D4']}).
FONTES MAIS ATIVAS: ${top3.join(', ')}
FONTES EM NEGLIGÊNCIA: ${bottom3.join(', ')}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Gere o laudo clínico baseado nos dados:\n${inputData}`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "Erro: Falha na síntese do diagnóstico.";

  } catch (error: any) {
    console.error("DEBUG GEMINI ERROR:", error);
    return `ERRO_SISTEMA: ${error.message || "Falha na modulação do feedback clínico."}`;
  }
};
