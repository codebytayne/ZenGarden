
import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getLanguageName = (lang: Language) => {
  switch(lang) {
    case 'pt': return 'Portuguese';
    case 'es': return 'Spanish';
    default: return 'English';
  }
};

export const generatePlantLore = async (plantName: string, rarity: string, lang: Language): Promise<string> => {
  try {
    const languageName = getLanguageName(lang);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, mystical 2-sentence lore description for a plant named '${plantName}' which has a rarity of '${rarity}'. The description MUST be in ${languageName}. Make it sound like a peaceful gardening quest game.`,
      config: {
        maxOutputTokens: 150,
        temperature: 0.8,
      }
    });
    return response.text || (lang === 'pt' ? "Uma planta misteriosa que prospera em pura concentração." : "A mysterious plant that thrives on pure concentration.");
  } catch (error) {
    console.error("Lore generation failed", error);
    return lang === 'pt' ? "Uma planta resiliente nascida de momentos de silêncio profundo." : "A resilient plant born from moments of deep silence.";
  }
};

export const getCoachMessage = async (focusTime: number, totalTime: number, lang: Language): Promise<string> => {
  try {
    const languageName = getLanguageName(lang);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user just finished a ${focusTime} minute focus session. Their total garden growth time is ${totalTime} minutes. Give a very short, encouraging sentence as a Zen Master gardener. The message MUST be in ${languageName}.`,
      config: {
        maxOutputTokens: 100,
        temperature: 0.9,
      }
    });
    return response.text || (lang === 'pt' ? "Seu jardim floresce com sua paciência." : "Your garden flourishes with your patience.");
  } catch (error) {
    return lang === 'pt' ? "A semente da disciplina cresce na floresta do sucesso." : "The seed of discipline grows into the forest of success.";
  }
};
