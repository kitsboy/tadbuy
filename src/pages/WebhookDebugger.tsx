import { useEffect, useState, useRef } from 'react';
import { PageShell, StatusPill } from '@/components/PageShell';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Button, Card, Input, Textarea } from '@/components/ui';
import { Play, Send, Save, Copy, Trash2, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Webhook {
  id: string;
  url: string;
  events: string[];
  secret: string;
  createdAt: string;
  status: 'active' | 'paused';
}

interface WebhookLog {
  id: string;
  webhookId: string;
  event: string;
  payload: string;
  response: string;
  status: 'success' | 'failure' | 'pending';
  latency: number;
  timestamp: string;
}

interface RetryQueueItem {
  id: string;
  webhookId: string;
  event: string;
  payload: any;
  attempts: number;
  lastAttempt: string;
  nextRetry: string;
}

// Mock data for demonstration
const MOCK_WEBHOOKS: Webhook[] = [
  {
    id: 'wh_1',
    url: 'https://my-shop.myshopify.com/webhooks/tadbuy/payments',
    events: ['payment.confirmed', 'payment.failed'],
    secret: 'whsec_••••••••••••••••••',
    createdAt: '2025-05-18T10:30:00Z',
    status: 'active',
  },
  {
    id: 'wh_2',
    url: 'https://my-blog.com/tadbuy-webhook',
    events: ['campaign.live', 'campaign.ended'],
    secret: 'whsec_••••••••••••••••••',
    createdAt: '2025-05-10T14:22:00Z',
    status: 'active',
  },
];

const MOCK_LOGS: WebhookLog[] = [
  {
    id: 'log_1',
    webhookId: 'wh_1',
    event: 'payment.confirmed',
    payload: JSON.stringify({ amount_sats: 5000, campaign_id: 'camp_abc', user_id: 'user_123' }),
    response: 'HTTP 200 OK',
    status: 'success',
    latency: 142,
    timestamp: '2025-05-19T09:15:00Z',
  },
  {
    id: 'log_2',
    webhookId: 'wh_2',
    event: 'campaign.ended',
    payload: JSON.stringify({ campaign_id: 'camp_xyz', spend_sats: 12500, impressions: 4200 }),
    response: 'HTTP 500 Internal Server Error',
    status: 'failure',
    latency: 5340,
    timestamp: '2025-05-19T08:45:00Z',
  },
];

const MOCK_RETRIES: RetryQueueItem[] = [
  {
    id: 'retry_1',
    webhookId: 'wh_2',
    event: 'campaign.ended',
    payload: { campaign_id: 'camp_xyz', spend_sats: 12500, impressions: 4200 },
    attempts: 3,
    lastAttempt: '2025-05-19T08:45:00Z',
    nextRetry: '2025-05-19T09:45:00Z',
  },
];

export default function WebhookDebugger() {
  usePageMeta('Webhook Debugger', 'Test and debug Tadbuy webhooks. List registered webhooks, test-ping, view raw responses.');

  const [webhooks] = useState<Webhook[]>(MOCK_WEBHOOKS);
  const [logs, setLogs] = useState<WebhookLog[]>(MOCK_LOGS);
  const [retryQueue, setRetryQueue] = useState<RetryQueueItem[]>(MOCK_RETRIES);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ status: 'success' | 'failure' | null; response: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'webhooks' | 'logs' | 'retries'>('webhooks');

  const handleTestPing = async (webhookId: string, event: string) => {
    setTestingId(webhookId);
    setTestResult(null);

    const webhook = webhooks.find(w => w.id === webhookId);
    if (!webhook) return;

    const mockResponse = {
      'payment.confirmed': { status: 'success', response: 'HTTP 200 OK — Payment processed' },
      'payment.failed': { status: 'failure', response: 'HTTP 502 Bad Gateway — Payment gateway unreachable' },
      'campaign.live': { status: 'success', response: 'HTTP 200 OK — Campaign activated' },
      'campaign.ended': { status: 'success', response: 'HTTP 200 OK — Campaign completed and settled' },
    };

    const result = mockResponse[event] || { status: 'success', response: 'HTTP 200 OK' };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    const newLog: WebhookLog = {
      id: `log_${Date.now()}`,
      webhookId,
      event,
      payload: JSON.stringify({
        amount_sats: 5000,
        campaign_id: 'camp_test',
        timestamp: new Date().toISOString(),
      }),
      response: result.response,
      status: result.status as any,
      latency: Math.floor(120 + Math.random() * 80),
      timestamp: new Date().toISOString(),
    };

    setLogs(prev => [newLog, ...prev]);
    setTestResult(result);
    setTestingId(null);
  };

  const handleRetry = (retryId: string) => {
    const retry = retryQueue.find(r => r.id === retryId);
    if (!retry) return;

    handleTestPing(retry.webhookId, retry.event);
    setRetryQueue(prev => prev.filter(r => r.id !== retryId));
  };

  const copyPayload = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      prompt('Copy payload:', text);
    }
  };

  const getEventColor = (event: string) => {
    if (event.includes('payment')) return 'text-blue';
    if (event.includes('campaign')) return 'text-purple';
    if (event.includes('impression')) return 'text-green';
    return 'text-muted';
  };

  const renderWebhooks = () => (
    <div className="space-y-4">
      {webhooks.map(wh => {
        const webhookLogs = logs.filter(l => l.webhookId === wh.id);
        const successRate = webhookLogs.length > 0
          ? (webhookLogs.filter(l => l.status === 'success').length / webhookLogs.length) * 100
          : 0;

        return (
          <Card key={wh.id} className="glass-panel">
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-xs bg-surface px-2 py-1 rounded font-mono break-all">
                    {wh.id}
                  </code>
                  <StatusPill status={wh.status === 'active' ? 'beta' : 'manual'} />
                </div>
                <div className="text-sm font-mono break-all pr-4">{wh.url}</div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTestPing(wh.id, wh.events[0])}
                  disabled={testingId === wh.id}
                  className="gap-1"
                >
                  {testingId === wh.id ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5" />
                  )}
                  Test Ping
                </Button>
                <Button variant="ghost" size="sm" onClick={() => copyPayload(wh.url)} className="gap-1">
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {wh.events.map(evt => (
                <span
                  key={evt}
                  className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', getEventColor(evt))}
                >
                  {evt}
                </span>
              ))}
            </div>

            {testResult && testingId === wh.id ? (
              <div className={cn('p-3 rounded-lg border text-xs font-mono',
                testResult.status === 'success'
                  ? 'bg-green/10 border-green/30 text-green'
                  : 'bg-red/10 border-red/30 text-red'
              )}>
                {testResult.response}
              </div>
            ) : null}

            <div className="flex items-center gap-4 mt-3 text-[10px] text-muted">
              <span>Success: {successRate.toFixed(0)}%</span>
              <span>•</span>
              <span>Created: {new Date(wh.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span className="font-mono">{wh.secret}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-2">
      {logs.length === 0 ? (
        <Card className="glass-panel text-center py-8">
          <Clock className="w-8 h-8 mx-auto text-muted mb-2" />
          <p className="text-sm text-muted">No webhook logs yet.</p>
          <p className="text-[10px] text-muted mt-1">Logs will appear here when webhooks are triggered.</p>
        </Card>
      ) : (
        logs.map(log => (
          <Card key={log.id} className="glass-panel">
            <div className="flex items-start justify-between mb-2">
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn('text-xs font-bold',
                    log.status === 'success' ? 'text-green' :
                    log.status === 'failure' ? 'text-red' : 'text-yellow'
                  )}>
                    {log.status === 'success' ? <CheckCircle className="w-3.5 h-3.5 inline mr-1" /> :
                     log.status === 'failure' ? <XCircle className="w-3.5 h-3.5 inline mr-1" /> :
                     <Clock className="w-3.5 h-3.5 inline mr-1" />}
                    {log.response}
                  </span>
                  <span className={cn('text-[10px] px-1.5 py-0.25 rounded', getEventColor(log.event))}>
                    {log.event}
                  </span>
                  <span className="text-[10px] text-muted">• {log.latency}ms</span>
                </div>
                <div className="text-[10px] text-muted">
                  {new Date(log.timestamp).toLocaleString()} — {log.webhookId}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyPayload(log.payload)}
                className="gap-1 shrink-0"
              >
                <Copy className="w-3 h-3" /> Copy
              </Button>
            </div>

            <div className="mt-2">
              <details className="text-xs">
                <summary className="text-muted cursor-pointer text-[10px] font-bold uppercase">Raw Payload</summary>
                <pre className="mt-1 p-2 bg-surface rounded text-[9px] font-mono whitespace-pre-wrap break-all overflow-x-auto">
                  {log.payload}
                </pre>
              </details>
            </div>
          </Card>
        ))
      )}
    </div>
  );

  const renderRetries = () => (
    <div className="space-y-3">
      {retryQueue.length === 0 ? (
        <Card className="glass-panel text-center py-8">
          <CheckCircle className="w-8 h-8 mx-auto text-muted mb-2" />
          <p className="text-sm text-muted">Retry queue is empty. No pending retries.</p>
        </Card>
      ) : (
        retryQueue.map(item => {
          const webhook = webhooks.find(w => w.id === item.webhookId);
          return (
            <Card key={item.id} className="glass-panel">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-yellow">Retry #{item.attempts}</span>
                    <span className={cn('text-[10px] px-1.5 py-0.25 rounded', getEventColor(item.event))}>
                      {item.event}
                    </span>
                  </div>
                  <div className="text-xs text-muted">
                    {webhook ? webhook.url : item.webhookId}
                  </div>
                  <div className="text-[10px] text-muted font-mono">
                    Payload: {JSON.stringify(item.payload).slice(0, 80)}...
                  </div>
                  <div className="text-[10px] text-muted">
                    Next retry: {new Date(item.nextRetry).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => handleRetry(item.id)}>
                    Retry Now
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setRetryQueue(q => q.filter(r => r.id !== item.id))}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );

  return (
    <PageShell
      title="Webhook Debugger"
      description="List registered webhooks, test-ping, view raw responses, and manage retry queue."
      badge={<StatusPill status="beta" />}
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Integrations', href: '/integrations' }, { label: 'Webhook Debugger' }]}
      maxWidth="max-w-4xl"
    >
      <div className="flex border-b border-border mb-4">
        <button
          onClick={() => setActiveTab('webhooks')}
          className={cn(
            'px-4 py-2 text-xs font-bold transition-colors',
            activeTab === 'webhooks'
              ? 'text-accent border-b-2 border-accent'
              : 'text-muted hover:text-text'
          )}
        >
          Webhooks
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={cn(
            'px-4 py-2 text-xs font-bold transition-colors',
            activeTab === 'logs'
              ? 'text-accent border-b-2 border-accent'
              : 'text-muted hover:text-text'
          )}
        >
          Logs
        </button>
        <button
          onClick={() => setActiveTab('retries')}
          className={cn(
            'px-4 py-2 text-xs font-bold transition-colors',
            activeTab === 'retries'
              ? 'text-accent border-b-2 border-accent'
              : 'text-muted hover:text-text'
          )}
        >
          Retry Queue
          {retryQueue.length > 0 && (
            <span className="ml-1.5 w-2 h-2 rounded-full bg-yellow animate-pulse" />
          )}
        </button>
      </div>

      {activeTab === 'webhooks' && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
              Registered Webhooks ({webhooks.length})
            </h2>
            <Button variant="outline" size="sm" className="gap-1">
              <Save className="w-3.5 h-3.5" /> Register New
            </Button>
          </div>
          {renderWebhooks()}
        </>
      )}

      {activeTab === 'logs' && renderLogs()}
      {activeTab === 'retries' && renderRetries()}
    </PageShell>
  );
}
