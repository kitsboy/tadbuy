import { GoogleGenAI, Type } from "@google/genai";
import { Campaign } from "@/data/campaigns";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface OptimizationSuggestion {
  headline?: string;
  description?: string;
  bgHue?: number;
  bgLightness?: number;
  textColor?: string;
  reasoning: string;
}

export async function getOptimizationSuggestions(campaign: Campaign): Promise<OptimizationSuggestion> {
  const prompt = `
    Analyze the following ad campaign and suggest improvements to increase CTR and performance.
    Campaign Data: ${JSON.stringify(campaign)}
    
    Provide suggestions for headline, description, background color (hue/lightness), and text color.
    Also provide a brief reasoning for the suggestions.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          description: { type: Type.STRING },
          bgHue: { type: Type.NUMBER },
          bgLightness: { type: Type.NUMBER },
          textColor: { type: Type.STRING },
          reasoning: { type: Type.STRING },
        },
        required: ["reasoning"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}
