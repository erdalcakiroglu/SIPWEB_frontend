import { Metadata } from 'next'
import Link from 'next/link'
import PolicyPageShell from '@/components/PolicyPageShell'

export const metadata: Metadata = {
  title: 'Analytics Disclosure — SQLPerformance AI',
  description:
    'How the SQLPerformance AI website uses Google Analytics, what is measured, and how Consent Mode works before and after your choice.',
  alternates: {
    canonical: '/analytics-disclosure',
  },
}

// Checked against app/layout.tsx and components/CookieConsent.tsx on 2026-10-08.
// The Google tag loads on every page in Consent Mode with all storage denied, so
// Google can receive cookieless signals before a choice; do not write that no data
// reaches Google before consent. Accept grants analytics_storage only.
export default function AnalyticsDisclosurePage() {
  return (
    <PolicyPageShell
      eyebrow="Analytics"
      title="Analytics Disclosure"
      description="How the website uses Google Analytics, what it measures, and what your cookie choice changes."
      lastUpdated="October 2026"
      summaryTitle="Analytics Scope"
      summaryItems={[
        'Applies to the public website only',
        'Analytics cookies only after you accept',
        'Used for aggregate page usage',
        'No advertising features',
      ]}
      relatedLinks={[
        { href: '/cookie-policy', label: 'Cookie Policy' },
        { href: '/privacy', label: 'Privacy Policy' },
      ]}
    >
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-900">Summary</div>
        <p className="text-sm leading-relaxed text-blue-950">
          The website uses Google Analytics to understand page usage, navigation flow and which content is useful.
          Analytics cookies are set only after you choose Accept in the cookie banner. The desktop application does not
          use Google Analytics or any other analytics.
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
          The Google tag loads on every page using Google Consent Mode, with analytics and advertising storage denied by
          default. Before you choose, and if you choose Reject, no analytics cookies are set, but Google may still
          receive cookieless signals, such as a page view and basic browser details, without an identifier that links
          your visits together. Accept allows analytics cookies so that visits can be measured over time. Advertising
          storage, ad user data and ad personalization stay denied in every case.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Identification Boundary</div>
        <p className="text-sm leading-relaxed text-gray-700">
          We look at analytics as aggregate reports on pages and usage trends. We do not use them to identify
          individual visitors, and we do not combine them with contact form or customer portal data.
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
