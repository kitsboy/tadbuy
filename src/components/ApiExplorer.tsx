import { Badge } from './ui/index';

const METHOD_VARIANT: Record<string, 'success' | 'info' | 'warning' | 'error'> = {
  GET: 'info',
  POST: 'success',
  PUT: 'warning',
  DELETE: 'error',
  PATCH: 'warning',
};

export function ApiExplorer({
  endpoint,
  label,
  method = 'GET',
}: {
  endpoint: string;
  label: string;
  method?: string;
}) {
  // Developer reference only. The platform has no backend on the static host, so no
  // "Try" affordance is offered — a button that fires a request that cannot succeed
  // is the exact API-shaped UI this build cuts.
  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={METHOD_VARIANT[method] ?? 'default'}>{method}</Badge>
        <code className="text-[10px] font-mono text-muted">{endpoint}</code>
        <Badge variant="default" className="ml-auto">Not live yet</Badge>
      </div>
      <p className="text-[10px] text-muted mt-2">
        {label} connects once the platform API is online — nothing is sent from this page.
      </p>
    </div>
  );
}