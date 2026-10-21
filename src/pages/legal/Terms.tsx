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
          <p className="text-muted text-sm mt-1">Last updated: September 13, 2026</p>
        </div>
      </div>

      <div className="bg-card border border-accent/20 rounded-xl p-4 text-sm text-muted leading-relaxed">
        <strong className="text-accent">Preview notice:</strong> This public demo does not accept
        campaign funds, create live orders, activate ad delivery, or owe publisher payouts. The
        terms for a future transacting product are not yet finalized or active.
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-8">
        <Section title="1. Service Description">
          <p>
            Tadbuy is an early-stage product preview operated by the Give A Bit family
            ("Give A Bit", "we", "us") — an independent project, not a registered company.
            This build provides local campaign planning, illustrative marketplace and platform
            examples, and readiness information. It does not connect advertisers to approved live
            publisher inventory, accept campaign funds, initiate provider ad buys, activate delivery,
            or verify campaign results.
          </p>
          <p>
            Some public pages describe intended Bitcoin and Lightning product direction. No Tadbuy
            campaign payment, invoice, publisher payout, or settlement service is connected in this
            preview. These pages are product-planning material, not an offer to transact.
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
            <a href="mailto:hello@giveabit.io" className="text-accent hover:underline">
              hello@giveabit.io
            </a>{' '}
            of any unauthorised access. We reserve the right to suspend accounts that exhibit
            suspicious activity.
          </p>
        </Section>

        <Section title="4. Payment Terms">
          <p>
            No campaign payment or settlement is available in this preview. Do not send funds,
            expect campaign credit, or treat any example budget or fee as a quote. Payment, refund,
            custody, and publisher settlement terms for a future transacting service are not active
            and require separate review and explicit release approval before launch.
          </p>
          <Sub title="4.1 No payment acceptance">
            <p>
              This preview does not create Bitcoin, Lightning, or other payment requests for
              campaign funding. Wallet and network information shown elsewhere is not a Tadbuy
              campaign payment instruction.
            </p>
          </Sub>
          <Sub title="4.2 Future commercial terms">
            <p>
              A future paid service would require approved pricing, funding and custody design,
              cancellation/refund/dispute policy, settlement verification, accounting, and user
              support terms. None are established by sample budgets, example fees, or these preview
              pages.
            </p>
          </Sub>
          <Sub title="4.3 Taxes">
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
          <p>
            Publisher onboarding, listing publication, tracking code, live inventory, and publisher
            payment are not available in this preview. Any profile or inventory form is preparation
            only and does not create a placement contract, delivery obligation, or payout entitlement.
          </p>
          <p>For any future approved publisher service, expected responsibilities may include:</p>
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
              The Tadbuy platform, brand, software, and all related materials are owned by Give A Bit
              and protected by copyright, trademark, and other intellectual property laws. You
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
            THE PREVIEW IS PROVIDED{' '}
            <strong className="text-text">"AS IS"</strong> AND{' '}
            <strong className="text-text">"AS AVAILABLE"</strong> WITHOUT ANY WARRANTY OF ANY KIND,
            EXPRESS OR IMPLIED. Illustrative budgets, market data, platform descriptions, and seed
            campaign metrics are not quotes, provider offers, live inventory, or measured results.
          </p>
          <p>
            No campaign payment, placement, delivery, result, or payout is promised or created by
            using this preview. Bitcoin or Lightning payment terms and risks will require separate
            review before any future transacting release.
          </p>
        </Section>

        <Section title="11. Limitation of Liability">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL GIVE A BIT, ITS
            MAINTAINERS, CONTRIBUTORS, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
            CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF TADBUY, EVEN IF ADVISED
            OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
          <p>
            OUR AGGREGATE LIABILITY TO YOU FOR ANY CLAIM ARISING FROM THESE TERMS SHALL NOT EXCEED
            CAD $100, except where applicable law requires otherwise. This preview does not accept
            campaign payments.
          </p>
        </Section>

        <Section title="12. Indemnification">
          <p>
            You agree to defend, indemnify, and hold harmless Give A Bit and its contributors
            from any claims, damages, and expenses (including reasonable legal fees) arising from:
            (a) your use of the platform in violation of these Terms; (b) your ad content or
            publisher properties; or (c) your violation of any third-party right.
          </p>
        </Section>

        <Section title="13. Governing Law & Dispute Resolution">
          <p>
            These Terms are governed by the laws of{' '}
            <strong className="text-text">
              [GOVERNING LAW: TBD — pending naming of a legal entity]
            </strong>
            .
          </p>
          <p>
            Until a governing law and forum are named, any dispute under these Terms will first be
            raised with us in writing at{' '}
            <a href="mailto:hello@giveabit.io" className="text-accent hover:underline">
              hello@giveabit.io
            </a>
            , and we will try in good faith to resolve it within 30 days.
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
            Terms. As this preview does not accept campaign balances or create publisher earnings,
            no funds are payable or refundable through this service.
          </p>
        </Section>

        <Section title="16. Contact">
          <p>
            Give A Bit (Tadbuy) —{' '}
            <a href="mailto:hello@giveabit.io" className="text-accent hover:underline">
              hello@giveabit.io
            </a>
          </p>
          <p>No office and no postal address; email is our only contact route.</p>
        </Section>
      </div>
    </div>
  );
}
