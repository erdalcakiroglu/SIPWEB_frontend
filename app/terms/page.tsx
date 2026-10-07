import { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import PolicyPageShell from '@/components/PolicyPageShell'

export const metadata: Metadata = {
  title: 'Terms of Service — SQLPerformance AI',
  description:
    'Terms of Service covering use of SQLPerformance AI software, trial access, license restrictions, and liability terms.',
  alternates: {
    canonical: '/terms',
  },
}

const restrictions = [
  'Reverse engineer, decompile, or disassemble the software',
  'Sublicense, rent, lease, or redistribute the software except where a separate written agreement permits it',
  'Bypass license enforcement or access controls',
  'Use the software to build a directly competing product from proprietary materials',
  'Remove copyright, trademark, or other proprietary notices',
]

export default function TermsPage() {
  return (
    <PolicyPageShell
      eyebrow="Legal"
      title="Terms of Service"
      description="Core commercial and operational terms for trial, licensed, and ongoing use of SQLPerformance AI."
      lastUpdated="June 2026"
      summaryTitle="Terms Scope"
      summaryItems={[
        'License and permitted use',
        'Trial and subscription framing',
        'Read-only analysis expectations',
        'Warranty and liability limits',
      ]}
      relatedLinks={[
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/contact', label: 'Contact' },
      ]}
    >
      <Section
        title="1. Acceptance"
        body="By downloading, installing, subscribing to, or using SQLPerformance AI, you agree to these Terms of Service. If you do not agree, do not use the software or related services."
      />

      <Section
        title="2. License Grant"
        body="Subject to payment of applicable fees or the terms of an active trial, you receive a limited, non-exclusive, non-transferable, and non-sublicensable license to install and use the software for internal business evaluation or operational analysis."
      />

      <Section
        title="3. Trials, Subscriptions, And Renewals"
        body="Trial access may be time-limited and may end automatically unless converted to a paid plan. Paid access may be offered on recurring billing terms. Continued access to licensed features depends on an active entitlement unless a separate written commercial agreement states otherwise."
      />

      <Section title="4. Restrictions">
        <ul className="space-y-2 text-sm text-gray-700">
          {restrictions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section
        title="5. Product Boundary"
        body="The software is positioned as a read-only SQL Server diagnostics tool. It can surface findings, recommendations, scripts, and reports, but it does not auto-apply schema or data changes to target systems."
      />

      <Section
        title="6. AI-Assisted Output"
        body="AI-assisted findings and recommendations are advisory. You are responsible for validating any suggestion before using it in a production, pre-production, or regulated environment."
      />

      <Section
        title="7. Customer Responsibilities"
        body="You are responsible for database credentials, access control, change management, infrastructure security, and review of any scripts or recommendations produced by the software."
      />

      <Section
        title="8. Intellectual Property"
        body="All rights, title, and interest in the software, website materials, trademarks, and documentation remain with the owner and licensors except for the limited rights expressly granted in these terms."
      />

      <Section
        title="9. Warranty Disclaimer"
        body='The software is provided "as is" and "as available" without warranties of any kind, whether express, implied, or statutory, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement, to the maximum extent permitted by law.'
      />

      <Section
        title="10. Limitation Of Liability"
        body="To the maximum extent permitted by law, the provider is not liable for indirect, incidental, special, consequential, punitive, or lost-profit damages arising from or related to use of the software, website, or generated outputs."
      />

      <Section
        title="11. Termination"
        body="Rights granted under these terms may be suspended or terminated if you materially violate them. Upon termination, your right to use the software ends immediately unless otherwise required by law or a separate written agreement."
      />

      <Section
        title="12. Governing Law"
        body="These terms are governed by applicable law and subject to the jurisdiction identified in the controlling commercial relationship or the competent courts otherwise required by law."
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Questions</div>
        <p className="text-sm leading-relaxed text-gray-700">
          For questions about licensing, trials, or legal terms, use the{' '}
          <Link href="/contact" className="font-semibold text-primary hover:text-primary-dark">
            contact page
          </Link>
          .
        </p>
      </div>
    </PolicyPageShell>
  )
}

type SectionProps = {
  title: string
  body?: string
  children?: ReactNode
}

function Section({ title, body, children }: SectionProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</div>
      {body ? <p className="text-sm leading-relaxed text-gray-700">{body}</p> : null}
      {children}
    </div>
  )
}
