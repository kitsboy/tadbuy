import type { ReactNode } from 'react';
import { Scale } from 'lucide-react';
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

export default function Terms() {
  usePageTitle('Terms of Service');

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
      <div className="flex items-center gap-3">
        <Scale className="w-8 h-8 text-accent shrink-0" />
        <div>
          <h1 className="text-3xl font-bold text-text">Terms of Service</h1>
          <p className="text-muted text-sm mt-1">Last updated: May 6, 2026</p>
        </div>
      </div>

      <div className="bg-card border border-accent/20 rounded-xl p-4 text-sm text-muted leading-relaxed">
        <strong className="text-accent">Important:</strong> Please read these Terms of Service
        carefully before using Tadbuy. By accessing or using the platform you agree to be bound by
        these terms. If you do not agree, do not use Tadbuy.
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-8">
        <Section title="1. Service Description">
          <p>
            Tadbuy is a Bitcoin-native advertising marketplace operated by GiveaBit Inc.
            ("Company", "we", "us") that connects advertisers seeking exposure with publishers who
            monetize their digital properties. All transactions on the platform are denominated and
            settled exclusively in Bitcoin (BTC) and/or Bitcoin Lightning Network payments.
          </p>
          <p>
            Tadbuy provides: (a) a self-serve ad campaign management interface; (b) a publisher
            portal for monetising traffic; (c) real-time analytics and reporting; (d) Lightning
            Network settlement infrastructure; and (e) related APIs and developer tools.
          </p>
        </Section>

        <Section title="2. User Eligibility">
          <p>
            You must meet all of the following criteria to create an account and use Tadbuy:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>
              You are at least <strong className="text-text">18 years of age</strong> (or the age
              of majority in your jurisdiction, whichever is higher).
            </li>
            <li>
              You are not located in, ordinarily resident in, or acting on behalf of any person
              or entity located in a country subject to comprehensive{' '}
              <strong className="text-text">OFAC sanctions</strong> or equivalent sanctions
              programmes (including but not limited to Cuba, Iran, North Korea, Russia, Syria,
              and the Crimea, Donetsk, and Luhansk regions of Ukraine).
            </li>
            <li>
              You have the legal authority to enter into a binding agreement, and if acting on
              behalf of a company, you have authority to bind that company.
            </li>
            <li>
              You have not previously been suspended or removed from Tadbuy for a violation of
              these Terms.
            </li>
          </ul>
        </Section>

        <Section title="3. Account Registration">
          <p>
            You may register using an email address and password or via a supported OAuth provider.
            You are responsible for maintaining the confidentiality of your credentials. You agree
            to notify us immediately at{' '}
            <a href="mailto:Kimi@giveabit.io" className="text-accent hover:underline">
              Kimi@giveabit.io
            </a>{' '}
            of any unauthorised access. We reserve the right to suspend accounts that exhibit
            suspicious activity.
          </p>
        </Section>

        <Section title="4. Payment Terms">
          <Sub title="4.1 Currency">
            <p>
              All payments on Tadbuy are made exclusively in Bitcoin (BTC) via on-chain transactions
              or Lightning Network invoices. We do not accept fiat currency, stablecoins, or other
              cryptocurrencies.
            </p>
          </Sub>
          <Sub title="4.2 Campaign Funding">
            <p>
              Advertisers must fund their campaign balance before ads begin serving. Funds are held
              by the Company and debited as impressions and clicks are delivered. Campaign budgets
              are expressed in satoshis (sats).
            </p>
          </Sub>
          <Sub title="4.3 Refund Policy">
            <p>
              <strong className="text-text">Once a campaign has commenced serving,</strong> ad
              spend is non-refundable. Unfunded portions of a cancelled campaign (balance remaining
              at cancellation) will be returned to the wallet address on file within 5 business
              days, minus a 1 % network fee.
            </p>
          </Sub>
          <Sub title="4.4 Publisher Settlements">
            <p>
              Publisher earnings are settled weekly via Lightning Network or on-chain Bitcoin to
              the address or LNURL provided in your publisher profile. Minimum payout threshold is
              10,000 sats. Earnings forfeit if an account remains inactive for 24 consecutive
              months.
            </p>
          </Sub>
          <Sub title="4.5 Taxes">
            <p>
              You are solely responsible for determining and paying any taxes arising from your use
              of Tadbuy. The Company does not withhold or remit taxes on your behalf.
            </p>
          </Sub>
        </Section>

        <Section title="5. Advertiser Responsibilities">
          <p>As an advertiser, you represent and warrant that:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>All ad creatives and landing pages comply with applicable law.</li>
            <li>You hold all rights, licences, and permissions for content you submit.</li>
            <li>Your ads are not misleading, deceptive, or fraudulent.</li>
            <li>You will not engage in click fraud, impression fraud, or bot traffic.</li>
            <li>
              Your campaigns target only audiences legally permitted to receive the advertised
              content in their jurisdiction.
            </li>
            <li>
              You will promptly update or remove any ad creative that becomes inaccurate or
              non-compliant.
            </li>
          </ul>
        </Section>

        <Section title="6. Publisher Responsibilities">
          <p>As a publisher, you represent and warrant that:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>You own or control all properties registered in your publisher account.</li>
            <li>
              Your properties do not host prohibited content as defined in Section 7 below.
            </li>
            <li>You will not artificially inflate impressions, clicks, or conversion events.</li>
            <li>
              You will display the Tadbuy ad unit code without modification in a visible,
              non-deceptive manner.
            </li>
            <li>Your traffic is genuine human traffic and not generated by bots or scripts.</li>
          </ul>
        </Section>

        <Section title="7. Prohibited Content">
          <p>
            The following content categories are strictly prohibited on Tadbuy, whether in ad
            creatives, landing pages, or publisher properties:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Illegal goods or services (drugs, weapons, counterfeit items)</li>
            <li>Hate speech, discrimination, or content targeting protected characteristics</li>
            <li>Scams, Ponzi schemes, rug-pulls, or unregistered securities offerings</li>
            <li>Malware, spyware, phishing, or other malicious software distribution</li>
            <li>Non-consensual intimate imagery or child sexual abuse material (CSAM)</li>
            <li>Violent, graphic, or gore content</li>
            <li>Gambling services (unless licensed in the relevant jurisdiction and pre-approved)</li>
            <li>
              Unregistered financial instruments, investment contracts, or token sales targeting
              US residents
            </li>
            <li>
              Content that infringes third-party intellectual property or privacy rights
            </li>
          </ul>
          <p>
            We reserve the right to reject, suspend, or remove any ad or publisher property at our
            sole discretion, with or without notice, if we determine it violates these standards.
          </p>
        </Section>

        <Section title="8. Intellectual Property">
          <Sub title="8.1 Tadbuy IP">
            <p>
              The Tadbuy platform, brand, software, and all related materials are owned by GiveaBit
              Inc. and protected by copyright, trademark, and other intellectual property laws. You
              may not copy, modify, distribute, or create derivative works without prior written
              consent.
            </p>
          </Sub>
          <Sub title="8.2 Your Content">
            <p>
              You retain ownership of ad creatives you submit. By uploading content, you grant
              Tadbuy a worldwide, royalty-free, non-exclusive licence to display, reproduce, and
              distribute your content solely for the purposes of delivering your campaigns.
            </p>
          </Sub>
        </Section>

        <Section title="9. Privacy">
          <p>
            Our collection and use of personal information is governed by our{' '}
            <a href="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </a>
            , which is incorporated into these Terms by reference.
          </p>
        </Section>

        <Section title="10. Disclaimers">
          <p>
            THE PLATFORM IS PROVIDED{' '}
            <strong className="text-text">"AS IS"</strong> AND{' '}
            <strong className="text-text">"AS AVAILABLE"</strong> WITHOUT ANY WARRANTY OF ANY KIND,
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS
            FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR UNINTERRUPTED OPERATION. WE DO NOT
            GUARANTEE THAT CAMPAIGNS WILL ACHIEVE ANY PARTICULAR RESULTS, REACH, OR RETURN ON
            INVESTMENT.
          </p>
          <p>
            Bitcoin and Lightning Network payments carry inherent risks including price volatility,
            network failures, and irreversibility. You accept full responsibility for all
            transaction risks.
          </p>
        </Section>

        <Section title="11. Limitation of Liability">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL GIVEA BIT INC.,
            ITS DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
            CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF TADBUY, EVEN IF ADVISED
            OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
          <p>
            OUR AGGREGATE LIABILITY TO YOU FOR ANY CLAIM ARISING FROM THESE TERMS SHALL NOT EXCEED
            THE GREATER OF (A) THE TOTAL SATS YOU PAID TO TADBUY IN THE 90 DAYS PRECEDING THE
            CLAIM, CONVERTED TO CAD AT THE PREVAILING RATE, OR (B) CAD $100.
          </p>
        </Section>

        <Section title="12. Indemnification">
          <p>
            You agree to defend, indemnify, and hold harmless GiveaBit Inc. and its affiliates
            from any claims, damages, and expenses (including reasonable legal fees) arising from:
            (a) your use of the platform in violation of these Terms; (b) your ad content or
            publisher properties; or (c) your violation of any third-party right.
          </p>
        </Section>

        <Section title="13. Governing Law & Dispute Resolution">
          <p>
            These Terms are governed by the laws of the{' '}
            <strong className="text-text">Province of British Columbia, Canada</strong> and the
            federal laws of Canada applicable therein, without regard to conflict-of-law principles.
          </p>
          <p>
            Any dispute arising from these Terms shall first be submitted to good-faith
            negotiation. If unresolved within 30 days, disputes shall be resolved by binding
            arbitration administered by the British Columbia International Commercial Arbitration
            Centre (BCICAC), conducted in Vancouver, BC. The arbitration shall be conducted in
            English.
          </p>
          <p>
            Notwithstanding the above, either party may seek injunctive or other equitable relief
            from a court of competent jurisdiction in Vancouver, BC to prevent irreparable harm.
          </p>
        </Section>

        <Section title="14. Changes to Terms">
          <p>
            We may update these Terms at any time. When we do, we will revise the "Last updated"
            date at the top of this page and, for material changes, notify you via email or an
            in-app notice. Continued use of Tadbuy after the effective date of any change
            constitutes your acceptance of the new Terms.
          </p>
        </Section>

        <Section title="15. Termination">
          <p>
            Either party may terminate your account at any time. We may suspend or terminate
            your access immediately, without liability, if we determine you have violated these
            Terms. Upon termination, unpaid publisher earnings above the minimum threshold will
            be disbursed within 30 days; unused advertiser balance will be refunded per Section
            4.3.
          </p>
        </Section>

        <Section title="16. Contact">
          <p>
            For questions about these Terms, please contact:
          </p>
          <div className="mt-2 bg-surface border border-border rounded-lg p-4 space-y-1 text-xs font-mono">
            <div>GiveaBit Inc.</div>
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
