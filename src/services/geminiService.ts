import { Campaign } from "@/lib/db/types";

export interface OptimizationSuggestion {
  headline?: string;
  description?: string;
  bgHue?: number;
  bgLightness?: number;
  textColor?: string;
  reasoning: string;
}

export async function generateAdCreative(campaign: Campaign): Promise<OptimizationSuggestion> {
  const response = await fetch('/api/ai/optimize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ campaign }),
  });
  if (!response.ok) throw new Error('AI optimization failed');
  return response.json();
}
