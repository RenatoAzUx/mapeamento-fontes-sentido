
import { GoogleGenAI } from "@google/genai";
import { AssessmentResult } from "../types";
import { DIMENSIONS_MAP } from "../constants";

export const generateFeedback = async (result: AssessmentResult): Promise<string> => {
  // A chave é provida via process.env.API_KEY injetado pelo define do Vite no build
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

    const systemInstruction = `Você é um Neurocientista do Comportamento e Psicoterapeuta de linha Estoica. 
Sua função é realizar uma análise clínica e existencial seca, objetiva e pragmática.

DIRETRIZES DE LINGUAGEM E TOM:
- Proibido o uso de adjetivos grandiloquentes ou "puxa-saquismo" (ex: magnífico, mandato estrutural, ser iluminado).
- Use terminologia técnica precisa: "tensões funcionais", "âncoras de execução", "desafios biopsicossociais", "homeostase existencial".
- O tom é de um diagnóstico técnico-existencial: frio, preciso e voltado para a eficácia da ação.

ESTRUTURA DA ANÁLISE:
1. MAPEAMENTO DE TENSÕES: Analise o conflito funcional entre as pontuações. (Ex: Criatividade alta + Ordem alta = Risco de paralisia analítica. Razão alta + Prazer baixo = Rigidez cognitiva e anedonia funcional).
2. ÂNCORAS DE EXECUÇÃO: Como as fontes dominantes devem ser usadas para estabilizar o sistema nervoso e garantir a execução diária.
3. TAREFAS DE SENTIDO (Viktor Frankl): Defina 3 ações concretas. "Quem o sujeito é" importa menos do que "o que este perfil exige que ele faça agora".
4. TRANSIÇÃO: Prepare o terreno para os próximos passos, explicando que a complexidade deste arranjo exige acompanhamento profissional ou inserção em comunidade para evitar que as tensões se tornem patológicas.

A análise deve ter entre 400 e 500 palavras. Não use listas ou bullet points.`;

    const inputData = `
PACIENTE: ${userInfo.name}
SCORE GLOBAL: ${scores.globalScore}/675
FONTES DOMINANTES: ${top3.join(', ')}
FONTES DE BAIXA ATIVAÇÃO: ${bottom3.join(', ')}
DIMENSÕES: Auto-Transcendência (${scores.dimensions['D1']}), Autoatualização (${scores.dimensions['D2']}), Ordem (${scores.dimensions['D3']}), Bem-estar (${scores.dimensions['D4']}).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analise clinicamente este perfil existencial de acordo com suas diretrizes:\n${inputData}`,
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
