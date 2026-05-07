import type { ReactNode } from 'react';
import { Cookie } from 'lucide-react';
import { usePageTitle } from '../../hooks/usePageTitle';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-bold text-text mb-3 pb-2 border-b border-border">{title}</h2>
      <div className="space-y-3 text-sm text-muted leading-relaxed">{children}</div>
    </section>
  );
}

interface CookieRow {
  name: string;
  type: string;
  purpose: string;
  duration: string;
}

function CookieTable({ rows }: { rows: CookieRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border mt-3">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-surface/50">
            <th className="px-3 py-2 text-left font-bold text-text">Name</th>
            <th className="px-3 py-2 text-left font-bold text-text">Type</th>
            <th className="px-3 py-2 text-left font-bold text-text">Purpose</th>
            <th className="px-3 py-2 text-left font-bold text-text">Duration</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map(row => (
            <tr key={row.name} className="hover:bg-surface/30 transition-colors">
              <td className="px-3 py-2 font-mono text-accent">{row.name}</td>
              <td className="px-3 py-2 text-muted">{row.type}</td>
              <td className="px-3 py-2 text-muted">{row.purpose}</td>
              <td className="px-3 py-2 text-muted font-mono">{row.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Cookies() {
  usePageTitle('Cookie Policy');

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
      <div className="flex items-center gap-3">
        <Cookie className="w-8 h-8 text-accent shrink-0" />
        <div>
          <h1 className="text-3xl font-bold text-text">Cookie Policy</h1>
          <p className="text-muted text-sm mt-1">Last updated: May 6, 2026</p>
        </div>
      </div>

      <div className="bg-card border border-accent/20 rounded-xl p-4 text-sm text-muted leading-relaxed">
        <strong className="text-accent">Short version:</strong> Tadbuy uses only essential session
        cookies and localStorage for preferences. We do not use third-party tracking cookies or
        advertising cookies.
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-8">
        <Section title="1. What Are Cookies?">
          <p>
            Cookies are small text files that a website stores on your device when you visit.
            They are widely used to make websites work correctly, remember your preferences, and
            provide analytics to site owners.
          </p>
          <p>
            Tadbuy also makes use of{' '}
            <strong className="text-text">localStorage</strong> — a browser storage mechanism
            that persists data beyond a single session without using traditional cookies. The same
            rules apply.
          </p>
        </Section>

        <Section title="2. Cookies We Use">
          <p>
            We use a minimal set of cookies. We do{' '}
            <strong className="text-text">not</strong> use advertising cookies, third-party
            tracking pixels, or cross-site tracking of any kind.
          </p>

          <CookieTable
            rows={[
              {
                name: '__session',
                type: 'Essential / Session',
                purpose: 'Firebase Authentication — maintains your login session.',
                duration: 'Session (expires on browser close)',
              },
              {
                name: 'tadbuy_currency',
                type: 'Preference / localStorage',
                purpose:
                  'Remembers your selected display currency (USD, CAD, EUR, GBP) across visits.',
                duration: 'Persistent until cleared',
              },
              {
                name: 'tadbuy_language',
                type: 'Preference / localStorage',
                purpose: 'Stores your preferred interface language.',
                duration: 'Persistent until cleared',
              },
              {
                name: 'tadbuy_theme',
                type: 'Preference / localStorage',
                purpose: 'Stores UI theme preference (dark mode).',
                duration: 'Persistent until cleared',
              },
              {
                name: 'sentry-sc',
                type: 'Functional',
                purpose:
                  'Sentry error tracking — helps us diagnose application errors. No personal data.',
                duration: 'Session',
              },
            ]}
          />
        </Section>

        <Section title="3. Cookies We Do NOT Use">
          <p>The following categories of cookies are absent from Tadbuy:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>
              <strong className="text-text">Advertising / tracking cookies</strong> — we do not
              load Meta Pixel, Google Ads, TikTok Pixel, or any equivalent.
            </li>
            <li>
              <strong className="text-text">Cross-site fingerprinting</strong> — we do not
              fingerprint your browser or track you across other websites.
            </li>
            <li>
              <strong className="text-text">Analytics SDKs with personal identifiers</strong> —
              we do not use Google Analytics, Mixpanel, Amplitude, or similar services that build
              persistent user profiles.
            </li>
          </ul>
        </Section>

        <Section title="4. localStorage Usage">
          <p>
            Several user preferences are stored in your browser's localStorage rather than as
            cookies. This data never leaves your device and is not transmitted to our servers
            unless you explicitly update your account settings. Stored items include:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>
              <code className="text-accent font-mono text-xs">tadbuy_currency</code> — display
              currency selection
            </li>
            <li>
              <code className="text-accent font-mono text-xs">tadbuy_language</code> — interface
              language
            </li>
            <li>
              <code className="text-accent font-mono text-xs">tadbuy_theme</code> — theme
              preference
            </li>
          </ul>
        </Section>

        <Section title="5. Managing Cookies">
          <p>
            You can control cookies through your browser settings. Most browsers allow you to:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>View and delete individual cookies</li>
            <li>Block cookies from specific sites</li>
            <li>Block all third-party cookies</li>
            <li>Clear all cookies when you close the browser</li>
          </ul>
          <p>
            Note that disabling essential session cookies will prevent you from staying logged in
            to Tadbuy. Clearing localStorage will reset your currency and language preferences.
          </p>
          <p>
            Browser-specific instructions:{' '}
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline"
            >
              Chrome
            </a>
            {' · '}
            <a
              href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox"
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline"
            >
              Firefox
            </a>
            {' · '}
            <a
              href="https://support.apple.com/en-ca/guide/safari/sfri11471/mac"
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline"
            >
              Safari
            </a>
            {' · '}
            <a
              href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy"
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline"
            >
              Edge
            </a>
          </p>
        </Section>

        <Section title="6. Changes to This Policy">
          <p>
            We may update this Cookie Policy when we add or remove cookies. Check the "Last
            updated" date at the top of this page for the most recent version.
          </p>
        </Section>

        <Section title="7. Contact">
          <p>
            Questions about our cookie practices? Email us at{' '}
            <a href="mailto:Kimi@giveabit.io" className="text-accent hover:underline">
              Kimi@giveabit.io
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}
