import { useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const DRAFT_KEY = 'tadbuy_campaign_draft';

export interface CampaignDraft {
  campaignName: string;
  headline: string;
  description: string;
  url: string;
  selectedPlatforms: string[];
  btcAmount: number;
  paymentMethod: string;
  mode: 'simple' | 'complex';
  savedAt: string;
  marketplaceSlotId?: string;
}

export function useCampaignDraft() {
  const [draft, setDraft] = useLocalStorage<CampaignDraft | null>(DRAFT_KEY, null);

  const saveDraft = useCallback((partial: Omit<CampaignDraft, 'savedAt'>) => {
    setDraft({ ...partial, savedAt: new Date().toISOString() });
  }, [setDraft]);

  const clearDraft = useCallback(() => setDraft(null), [setDraft]);

  return { draft, saveDraft, clearDraft };
}

/** Auto-save draft when form fields change (debounced via effect deps) */
export function useAutoSaveDraft(
  data: Omit<CampaignDraft, 'savedAt'> | null,
  enabled: boolean,
) {
  const { saveDraft } = useCampaignDraft();

  useEffect(() => {
    if (!enabled || !data) return;
    const t = setTimeout(() => saveDraft(data), 800);
    return () => clearTimeout(t);
  }, [data, enabled, saveDraft]);
}