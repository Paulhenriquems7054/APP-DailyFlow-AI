
import { GoogleGenAI, Type } from "@google/genai";
import { AppState, RoutineBlock, DailyCheckIn, Language, AIInsight } from "./types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Gets personalized routine mentorship based on the current user state and energy check-in.
 * Uses gemini-3-flash-preview for quick, structured JSON feedback.
 */
export const getRoutineMentorship = async (state: AppState, currentCheckIn?: DailyCheckIn, lang: Language = 'en') => {
  const tasksSummary = state.tasks.map(t => 
    `- [${t.block}] ${t.title} (Prioridade: ${t.priority || 'medium'})${t.notes ? ` (Notas: ${t.notes})` : ''} - ${t.completed ? 'Concluída' : 'Pendente'}`
  ).join('\n');

  const prompt = `
    Você é um mentor de produtividade e psicólogo comportamental. 
    Analise o estado atual do usuário e sugira ajustes dinâmicos na rotina.
    
    Energia do Usuário: ${currentCheckIn?.energy === 1 ? 'Baixa' : currentCheckIn?.energy === 2 ? 'Média' : 'Alta'}
    Humor: ${currentCheckIn?.mood === 1 ? 'Tenso/Triste' : currentCheckIn?.mood === 2 ? 'Neutro' : 'Excelente'}
    
    Tarefas de Hoje:
    ${tasksSummary}

    Regras de Negócio:
    1. Se a energia for BAIXA (1), sugira adiar tarefas de Alta Prioridade/Complexidade para amanhã ou movê-las para o período de maior disposição.
    2. Identifique oportunidades de "Habit Stacking" entre as tarefas listadas e os hábitos: ${JSON.stringify(state.habits)}.
    3. Responda em ${lang === 'pt' ? 'Português (Brasil)' : 'Inglês'}.

    Retorne um JSON válido.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING },
            adjustment: { type: Type.STRING },
            microHabit: { type: Type.STRING },
            suggestedDeferrals: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "IDs ou nomes de tarefas para adiar se a energia for baixa"
            }
          },
          required: ["message", "adjustment", "microHabit"]
        }
      }
    });

    // The .text property directly returns the string output. Do not use .text().
    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini API Error (Routine Mentorship):", error);
    return null;
  }
};

/**
 * Analyzes the user's weekly progress and returns a list of insights.
 * Uses gemini-3-flash-preview for structured data generation.
 */
export const getWeeklyReport = async (state: AppState, lang: Language = 'en'): Promise<AIInsight[]> => {
  const prompt = `
    Analise o progresso semanal do usuário com base nas tarefas, hábitos e check-ins recentes.
    Dados: ${JSON.stringify({ tasks: state.tasks, habits: state.habits, checkIns: state.checkIns })}
    
    Gere 3 insights valiosos em um array JSON:
    1. Motivacional: Baseado no progresso atual ou vitórias.
    2. Ajuste: Sugestão de melhoria ou simplificação na rotina.
    3. Progresso: Observação objetiva sobre consistência de hábitos.

    Responda em ${lang === 'pt' ? 'Português (Brasil)' : 'Inglês'}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              type: { 
                type: Type.STRING,
                enum: ['motivational', 'adjustment', 'progress']
              }
            },
            required: ["title", "content", "type"]
          }
        }
      }
    });

    const jsonStr = response.text?.trim() || "[]";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini API Error (Weekly Report):", error);
    return [];
  }
};

/**
 * Provides deep strategic advice using Gemini 3 Pro and Google Search grounding.
 */
export const getStrategicAdvice = async (state: AppState, lang: Language = 'en') => {
  const prompt = `
    Analise o sistema completo do usuário. Use Grounding para entender tendências de produtividade modernas aplicáveis a este perfil.
    Dados: ${JSON.stringify({ tasks: state.tasks, habits: state.habits, checkIns: state.checkIns })}
    
    Forneça uma análise estratégica profunda e personalizada sobre como otimizar o fluxo de trabalho e o bem-estar mental.
    Responda em ${lang === 'pt' ? 'Português (Brasil)' : 'Inglês'}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        // Thinking budget allows for more detailed reasoning on complex tasks.
        thinkingConfig: { thinkingBudget: 32768 },
        tools: [{ googleSearch: {} }]
      }
    });

    // Property .text directly returns the extracted string output.
    return response.text || (lang === 'pt' ? "Sem análise disponível no momento." : "No strategic analysis available at this time.");
  } catch (error) {
    console.error("Gemini Strategy Error:", error);
    return lang === 'pt' ? "Erro na análise profunda estratégica." : "Strategy analysis error.";
  }
};
