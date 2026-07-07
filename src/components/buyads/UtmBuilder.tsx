import { useMemo } from 'react';
import { Card, CardTitle, Input, FormGroup, Label } from '@/components/ui';
import { Link2 } from 'lucide-react';

export interface UtmParams {
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
}

interface UtmBuilderProps {
  baseUrl: string;
  params: UtmParams;
  onChange: (params: UtmParams) => void;
  onUrlChange?: (url: string) => void;
}

function buildUtmUrl(base: string, params: UtmParams): string {
  if (!base.trim()) return '';
  try {
    const url = new URL(base.includes('://') ? base : `https://${base}`);
    if (params.source) url.searchParams.set('utm_source', params.source);
    if (params.medium) url.searchParams.set('utm_medium', params.medium);
    if (params.campaign) url.searchParams.set('utm_campaign', params.campaign);
    if (params.term) url.searchParams.set('utm_term', params.term);
    if (params.content) url.searchParams.set('utm_content', params.content);
    return url.toString();
  } catch {
    return base;
  }
}

export function UtmBuilder({ baseUrl, params, onChange, onUrlChange }: UtmBuilderProps) {
  const previewUrl = useMemo(() => buildUtmUrl(baseUrl, params), [baseUrl, params]);

  const update = (key: keyof UtmParams, value: string) => {
    const next = { ...params, [key]: value };
    onChange(next);
    onUrlChange?.(buildUtmUrl(baseUrl, next));
  };

  return (
    <Card className="glass-panel">
      <div className="flex items-center gap-2 mb-3">
        <Link2 className="w-4 h-4 text-accent" />
        <CardTitle className="mb-0">UTM tracking</CardTitle>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormGroup className="mb-0">
          <Label>Source</Label>
          <Input value={params.source} onChange={e => update('source', e.target.value)} placeholder="tadbuy" />
        </FormGroup>
        <FormGroup className="mb-0">
          <Label>Medium</Label>
          <Input value={params.medium} onChange={e => update('medium', e.target.value)} placeholder="cpc" />
        </FormGroup>
        <FormGroup className="mb-0">
          <Label>Campaign</Label>
          <Input value={params.campaign} onChange={e => update('campaign', e.target.value)} placeholder="summer_push" />
        </FormGroup>
        <FormGroup className="mb-0">
          <Label>Term</Label>
          <Input value={params.term} onChange={e => update('term', e.target.value)} placeholder="bitcoin ads" />
        </FormGroup>
        <FormGroup className="mb-0 sm:col-span-2">
          <Label>Content</Label>
          <Input value={params.content} onChange={e => update('content', e.target.value)} placeholder="variant_a" />
        </FormGroup>
      </div>
      {previewUrl && (
        <div className="mt-3 p-3 bg-bg border border-border rounded-lg">
          <div className="text-[10px] font-bold text-muted uppercase mb-1">Preview URL</div>
          <div className="text-[11px] font-mono text-accent break-all">{previewUrl}</div>
        </div>
      )}
    </Card>
  );
}

export { buildUtmUrl };