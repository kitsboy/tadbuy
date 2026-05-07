import type { ReactNode } from 'react';
import { Shield } from 'lucide-react';
import { usePageTitle } from '../../hooks/usePageTitle';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-bold text-text mb-3 pb-2 border-b border-border">{title}</h2>
      <div className="space-y-3 text-sm text-muted leading-relaxed">{children}</div>
    </section>
  );
}

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-text/80 uppercase tracking-wide mb-1">{title}</h3>
      <div>{children}</div>
    </div>
  );
}

export default function Privacy() {
  usePageTitle('Privacy Policy');

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-accent shrink-0" />
        <div>
          <h1 className="text-3xl font-bold text-text">Privacy Policy</h1>
          <p className="text-muted text-sm mt-1">Last updated: May 6, 2026</p>
        </div>
      </div>

      <div className="bg-card border border-accent/20 rounded-xl p-4 text-sm text-muted leading-relaxed">
        <strong className="text-accent">Your privacy matters.</strong> Tadbuy collects only what
        we need to operate the platform. We do not sell your personal data — ever. This policy
        explains what we collect, why, and how you can exercise your rights.
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-8">
        <Section title="1. Who We Are">
          <p>
            GiveaBit Inc. ("Tadbuy", "we", "us", "our") operates the Tadbuy advertising platform
            at tadbuy.com. We are the data controller for personal information collected through
            the platform. Our primary point of contact for privacy matters is{' '}
            <a href="mailto:Kimi@giveabit.io" className="text-accent hover:underline">
              Kimi@giveabit.io
            </a>
            .
          </p>
        </Section>

        <Section title="2. Data We Collect">
          <Sub title="2.1 Account Information">
            <p>
              When you register, we collect your email address, display name, and (if applicable)
              OAuth provider identifier. We do not collect your legal name, phone number, or
              government ID unless required by law.
            </p>
          </Sub>
          <Sub title="2.2 Bitcoin & Lightning Addresses">
            <p>
              To facilitate payments and settlements, we store the Bitcoin on-chain addresses and
              Lightning Network node IDs / payment addresses you provide. Note that Bitcoin
              addresses and transactions are recorded on a{' '}
              <strong className="text-text">public blockchain</strong> and are permanently visible
              to anyone. We have no ability to make on-chain transactions private.
            </p>
          </Sub>
          <Sub title="2.3 Campaign & Ad Data">
            <p>
              We store campaign configurations, ad creatives (images, copy, URLs), targeting
              parameters, budget settings, and performance data (impressions, clicks, CTR) you
              create on the platform.
            </p>
          </Sub>
          <Sub title="2.4 Usage & Analytics Data">
            <p>
              We collect technical data when you use the platform: IP address, browser type and
              version, device type, operating system, pages visited, timestamps, and referrer URLs.
              This data is used for security, debugging, and service improvement.
            </p>
          </Sub>
          <Sub title="2.5 Communications">
            <p>
              If you contact us by email or submit a support request, we retain that correspondence
              to resolve your issue and improve our support quality.
            </p>
          </Sub>
        </Section>

        <Section title="3. How We Use Your Data">
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>
              <strong className="text-text">Service delivery:</strong> Authenticating your account,
              serving campaigns, processing payments, and calculating publisher settlements.
            </li>
            <li>
              <strong className="text-text">Communication:</strong> Sending transactional emails
              (invoices, settlement confirmations, security alerts) and, with your consent,
              product updates.
            </li>
            <li>
              <strong className="text-text">Security &amp; fraud prevention:</strong> Detecting
              click fraud, bot traffic, account takeovers, and sanctions-list screening.
            </li>
            <li>
              <strong className="text-text">Legal compliance:</strong> Complying with applicable
              law, court orders, and law enforcement requests.
            </li>
            <li>
              <strong className="text-text">Product improvement:</strong> Analysing aggregated,
              anonymised usage patterns to improve the platform.
            </li>
          </ul>
        </Section>

        <Section title="4. Third-Party Services">
          <Sub title="4.1 Firebase / Google Cloud">
            <p>
              We use Firebase (Google LLC) for authentication, Firestore database, and Cloud
              Functions. Your data is stored in Google Cloud data centres. Google's privacy policy
              applies to data processed through Firebase:{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline"
              >
                policies.google.com/privacy
              </a>
              .
            </p>
          </Sub>
          <Sub title="4.2 Sentry (Error Tracking)">
            <p>
              We use Sentry (Functional Software Inc.) to capture application errors and
              performance traces. Sentry may receive your IP address and browser information when
              an error occurs. Error payloads are scrubbed to remove passwords and payment data
              before transmission. Sentry's privacy policy:{' '}
              <a
                href="https://sentry.io/privacy/"
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline"
              >
                sentry.io/privacy
              </a>
              .
            </p>
          </Sub>
          <Sub title="4.3 No Third-Party Ad Tracking">
            <p>
              Tadbuy does not load Meta Pixel, Google Ads tags, or any other third-party
              behavioural tracking scripts. We do not share your personal data with advertising
              networks.
            </p>
          </Sub>
        </Section>

        <Section title="5. Bitcoin Transaction Transparency">
          <p>
            Bitcoin is a public, permissionless ledger. Any on-chain transaction made to or from
            Tadbuy is visible on the blockchain and can be linked to your account by anyone who
            knows your Bitcoin address. We recommend using a fresh address for each interaction if
            on-chain privacy is important to you. Lightning Network payments offer significantly
            improved payment privacy.
          </p>
        </Section>

        <Section title="6. Data Sharing">
          <p>
            We do <strong className="text-text">not sell</strong> your personal data. We may share
            data with:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>
              <strong className="text-text">Service providers</strong> (Firebase, Sentry) under
              data processing agreements, only as necessary to deliver the service.
            </li>
            <li>
              <strong className="text-text">Law enforcement or regulators</strong> when legally
              compelled to do so.
            </li>
            <li>
              <strong className="text-text">Acquirers</strong> in the event of a merger,
              acquisition, or asset sale, subject to standard confidentiality protections.
            </li>
          </ul>
        </Section>

        <Section title="7. Your Rights">
          <p>
            Depending on your jurisdiction, you may have the following rights with respect to
            your personal data:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>
              <strong className="text-text">Access:</strong> Request a copy of the personal data
              we hold about you.
            </li>
            <li>
              <strong className="text-text">Rectification:</strong> Ask us to correct inaccurate
              data.
            </li>
            <li>
              <strong className="text-text">Erasure ("right to be forgotten"):</strong> Request
              deletion of your data (subject to legal retention obligations).
            </li>
            <li>
              <strong className="text-text">Portability:</strong> Receive your data in a
              structured, machine-readable format.
            </li>
            <li>
              <strong className="text-text">Objection / restriction:</strong> Object to or
              restrict certain processing activities.
            </li>
            <li>
              <strong className="text-text">CCPA rights</strong> (California residents): Right to
              know, delete, and opt-out of sale (we do not sell data).
            </li>
          </ul>
          <p>
            To exercise any right, email{' '}
            <a href="mailto:Kimi@giveabit.io" className="text-accent hover:underline">
              Kimi@giveabit.io
            </a>{' '}
            with the subject line "Privacy Request". We will respond within 30 days.
          </p>
        </Section>

        <Section title="8. Data Retention">
          <p>
            We retain your personal data for as long as your account is active or as needed to
            provide services. Specifically:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Account data: retained until account deletion + 90 days for backup.</li>
            <li>
              Campaign &amp; financial records: 7 years to satisfy accounting and tax obligations.
            </li>
            <li>Error logs (Sentry): 90 days rolling.</li>
            <li>Email correspondence: 3 years.</li>
          </ul>
        </Section>

        <Section title="9. Security">
          <p>
            We implement industry-standard safeguards: TLS encryption in transit, Firebase
            security rules, server-side environment variables for secrets, and regular dependency
            audits. However, no system is 100 % secure — we cannot guarantee absolute security.
            Please use a strong, unique password and enable two-factor authentication.
          </p>
        </Section>

        <Section title="10. Children's Privacy">
          <p>
            Tadbuy is not directed to individuals under 18. We do not knowingly collect personal
            data from minors. If you believe a minor has provided us with data, please contact us
            immediately and we will delete it.
          </p>
        </Section>

        <Section title="11. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will post the revised policy
            with an updated date. For material changes, we will notify you by email or in-app
            notice.
          </p>
        </Section>

        <Section title="12. Contact">
          <p>Privacy questions, requests, or complaints:</p>
          <div className="mt-2 bg-surface border border-border rounded-lg p-4 space-y-1 text-xs font-mono">
            <div>GiveaBit Inc. — Privacy Office</div>
            <div>British Columbia, Canada</div>
            <div>
              Email:{' '}
              <a href="mailto:Kimi@giveabit.io" className="text-accent hover:underline">
                Kimi@giveabit.io
              </a>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
