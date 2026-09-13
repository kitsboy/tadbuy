import type { ReactNode } from 'react';
import { Cookie } from 'lucide-react';
import { usePageTitle } from '../../hooks/usePageTitle';
import { SafeLink } from '@/components/SafeLink';

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
          <p className="text-muted text-sm mt-1">Last updated: September 13, 2026</p>
        </div>
      </div>

      <div className="bg-card border border-accent/20 rounded-xl p-4 text-sm text-muted leading-relaxed">
        <strong className="text-accent">Short version:</strong> Tadbuy sets no cookies of its own.
        Preferences and your sign-in session live in your browser's own storage. We do not use
        third-party tracking cookies or advertising cookies.
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
            We set no cookies of our own. We do{' '}
            <strong className="text-text">not</strong> use advertising cookies, third-party
            tracking pixels, or cross-site tracking of any kind.
          </p>
          <p>
            Cloudflare, our host and edge provider, may set a strictly necessary security cookie
            (<code className="text-accent font-mono text-xs">cf_clearance</code>) while it screens a
            request for bot traffic. That cookie is not ours, it is not used for advertising or
            analytics, and it cannot follow you to another website.
          </p>

          <CookieTable
            rows={[
              {
                name: 'tadbuy_currency',
                type: 'Preference / browser storage',
                purpose:
                  'Remembers your selected display currency (USD, CAD, EUR, GBP) across visits.',
                duration: 'Persistent until cleared',
              },
              {
                name: 'tadbuy_language',
                type: 'Preference / browser storage',
                purpose: 'Stores your preferred interface language.',
                duration: 'Persistent until cleared',
              },
              {
                name: 'tadbuy_theme',
                type: 'Preference / browser storage',
                purpose: 'Stores UI theme preference (dark mode).',
                duration: 'Persistent until cleared',
              },
              {
                name: 'Firebase Auth session',
                type: 'Sign-in / browser storage',
                purpose:
                  'Firebase Authentication — keeps you signed in. Stored in your browser’s own storage, not in a cookie.',
                duration: 'Until you sign out or clear browsing data',
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
            Blocking cookies in your browser does not break Tadbuy, because we set none of our own.
            Clearing your browser storage will reset your currency and language preferences and sign
            you out.
          </p>
          <p>
            Browser-specific instructions:{' '}
            <SafeLink
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              showIcon
              className="text-accent hover:underline"
            >
              Chrome
            </SafeLink>
            {' · '}
            <SafeLink
              href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox"
              target="_blank"
              showIcon
              className="text-accent hover:underline"
            >
              Firefox
            </SafeLink>
            {' · '}
            <SafeLink
              href="https://support.apple.com/en-ca/guide/safari/sfri11471/mac"
              target="_blank"
              showIcon
              className="text-accent hover:underline"
            >
              Safari
            </SafeLink>
            {' · '}
            <SafeLink
              href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy"
              target="_blank"
              showIcon
              className="text-accent hover:underline"
            >
              Edge
            </SafeLink>
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
            <a href="mailto:hello@giveabit.io" className="text-accent hover:underline">
              hello@giveabit.io
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}
