import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';

interface AdPolicy {
  prohibited: string[];
  reviewProcess: string;
}

export function AdPolicyNotice() {
  const [policy, setPolicy] = useState<AdPolicy | null>(null);

  useEffect(() => {
    fetch('/api/trust/ad-policy')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setPolicy(data); })
      .catch(() => {
        setPolicy({
          prohibited: ['Scams', 'Malware', 'Adult content', 'Misleading investment claims'],
          reviewProcess: 'All campaigns reviewed within 24 hours.',
        });
      });
  }, []);

  if (!policy) return null;

  return (
    <Alert variant="info" title="Advertising policy">
      <p className="mb-2">
        Prohibited content includes scams, malware, adult content, hate speech, and misleading
        Bitcoin investment claims. Campaigns are reviewed within 24 hours.
      </p>
      <details className="text-[11px]">
        <summary className="cursor-pointer font-semibold flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> View prohibited categories
        </summary>
        <ul className="mt-2 space-y-1 list-disc list-inside opacity-90">
          {policy.prohibited.slice(0, 5).map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>
      <p className="mt-2 text-[10px]">
        Full policy: <Link to="/terms" className="text-accent hover:underline">Terms of Service</Link>
      </p>
    </Alert>
  );
}