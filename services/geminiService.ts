import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL, SYSTEM_PROMPT_GLOSS } from '../constants';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateGlossFromText = async (text: string): Promise<string> => {
  if (!text || !text.trim()) return "";

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: text,
      config: {
        systemInstruction: SYSTEM_PROMPT_GLOSS,
        temperature: 0.2, // Low temperature for deterministic gloss conversion
      },
    });

    return response.text ? response.text.trim() : "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "ERROR_CONVERTING_TO_SIGN";
  }
};
