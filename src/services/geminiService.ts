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

export async function generateAdCreative(campaign: Campaign): Promise<OptimizationSuggestion> {
  const prompt = `
    Generate a new ad creative for the following campaign:
    Campaign Data: ${JSON.stringify(campaign)}
    
    Provide a compelling headline, description, and suggested design elements (bgHue, bgLightness, textColor).
    Also provide a brief reasoning for the creative direction.
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
        required: ["headline", "description", "reasoning"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}
