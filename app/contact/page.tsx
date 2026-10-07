import { Metadata } from 'next'
import PolicyPageShell from '@/components/PolicyPageShell'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact — SQLPerformance AI',
  description:
    'Contact SQLPerformance AI for licensing, evaluation planning, rollout questions, or technical product support.',
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactPage() {
  return (
    <PolicyPageShell
      eyebrow="Contact"
      title="Talk To Sales Or Product Support"
      description="Use the contact form for licensing, procurement, rollout planning, installation questions, or technical issues that need a direct response."
      lastUpdated="June 2026"
      summaryTitle="Best For"
      summaryItems={[
        'Licensing, pricing, and procurement questions',
        'Evaluation planning and enterprise rollout',
        'Installation, permissions, and product troubleshooting',
        'Follow-up requests that need a direct reply',
      ]}
      relatedLinks={[
        { href: '/download', label: 'Download' },
        { href: '/faq', label: 'FAQ' },
        { href: '/docs', label: 'Documentation' },
      ]}
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Before You Send</div>
        <p className="text-sm leading-relaxed text-gray-700">
          Include the business context, the environment you are working in, and the shortest reproducible description
          of the issue. If you are contacting support, redact secrets and attach only the details required to
          understand the problem.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-2 text-sm font-semibold text-gray-900">Sales / Licensing</div>
            <p className="text-sm leading-relaxed text-gray-600">
              Use this path for pricing, evaluation scope, rollout planning, trial questions, purchasing, or vendor
              review.
            </p>
            <div className="mt-3 text-xs text-gray-500">Examples: pricing, procurement, rollout, commercial terms</div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-2 text-sm font-semibold text-gray-900">Technical Support</div>
            <p className="text-sm leading-relaxed text-gray-600">
              Use this path for installation, SQL connectivity, permissions, report exports, analysis findings, or bug
              reports.
            </p>
            <div className="mt-3 text-xs text-gray-500">Examples: setup, auth, report issues, unexpected results</div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-900">Response Window</div>
            <p className="text-sm leading-relaxed text-blue-950">
              Most requests receive a reply within 1-2 business days. More complete context usually shortens the first
              response cycle.
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </PolicyPageShell>
  )
}
