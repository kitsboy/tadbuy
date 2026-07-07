import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const DRAFTS_KEY = 'tadbuy_named_drafts';

export interface NamedDraft {
  id: string;
  name: string;
  savedAt: string;
  data: Record<string, unknown>;
}

export function useNamedDrafts() {
  const [drafts, setDrafts] = useLocalStorage<NamedDraft[]>(DRAFTS_KEY, []);

  const saveDraft = useCallback((name: string, data: Record<string, unknown>) => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const entry: NamedDraft = {
      id: `draft_${Date.now()}`,
      name: trimmed,
      savedAt: new Date().toISOString(),
      data,
    };
    const withoutDup = drafts.filter(d => d.name.toLowerCase() !== trimmed.toLowerCase());
    setDrafts([entry, ...withoutDup].slice(0, 20));
    return entry;
  }, [setDrafts, drafts]);

  const loadDraft = useCallback((id: string) => {
    return drafts.find(d => d.id === id) ?? null;
  }, [drafts]);

  const deleteDraft = useCallback((id: string) => {
    setDrafts(drafts.filter(d => d.id !== id));
  }, [setDrafts, drafts]);

  const renameDraft = useCallback((id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setDrafts(drafts.map(d => (d.id === id ? { ...d, name: trimmed } : d)));
  }, [setDrafts, drafts]);

  return { drafts, saveDraft, loadDraft, deleteDraft, renameDraft };
}