import { Metadata } from 'next'
import Link from 'next/link'
import PolicyPageShell from '@/components/PolicyPageShell'

export const metadata: Metadata = {
  title: 'Analytics Disclosure — SQLPerformance AI',
  description:
    'Analytics disclosure for the SQLPerformance AI website, including consent-based Google Analytics usage.',
  alternates: {
    canonical: '/analytics-disclosure',
  },
}

export default function AnalyticsDisclosurePage() {
  return (
    <PolicyPageShell
      eyebrow="Analytics"
      title="Analytics Disclosure"
      description="How website analytics are used, what they are intended to measure, and why consent is required first."
      lastUpdated="June 2026"
      summaryTitle="Analytics Scope"
      summaryItems={[
        'Applies to the public website',
        'Consent-based activation only',
        'Aggregate usage understanding',
        'Not intended for direct personal identification',
      ]}
      relatedLinks={[
        { href: '/cookie-policy', label: 'Cookie Policy' },
        { href: '/privacy', label: 'Privacy Policy' },
      ]}
    >
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-900">Summary</div>
        <p className="text-sm leading-relaxed text-blue-950">
          The website may use Google Analytics to understand page usage, navigation flow, and overall content
          effectiveness. Analytics are not enabled until the visitor has granted consent through the cookie controls.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">What Analytics Are Used For</div>
        <p className="text-sm leading-relaxed text-gray-700">
          Analytics help measure which pages are visited, how visitors move through the site, which documentation
          content is most used, and whether navigation or messaging needs improvement. This supports product marketing
          and documentation quality decisions rather than in-product database analysis.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Consent Requirement</div>
        <p className="text-sm leading-relaxed text-gray-700">
          Analytics storage is denied by default and is updated only after the visitor accepts the relevant cookie
          choice. If consent is not granted, optional analytics tracking should remain off.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Identification Boundary</div>
        <p className="text-sm leading-relaxed text-gray-700">
          Analytics are intended to be used in aggregate form to evaluate content and usage trends. This disclosure does
          not position analytics as a direct identity resolution mechanism for individual website visitors.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Related Policies</div>
        <p className="text-sm leading-relaxed text-gray-700">
          See the{' '}
          <Link href="/cookie-policy" className="font-semibold text-primary hover:text-primary-dark">
            Cookie Policy
          </Link>{' '}
          for consent and cookie category detail, and the{' '}
          <Link href="/privacy" className="font-semibold text-primary hover:text-primary-dark">
            Privacy Policy
          </Link>{' '}
          for the broader website and product data boundary.
        </p>
      </div>
    </PolicyPageShell>
  )
}
