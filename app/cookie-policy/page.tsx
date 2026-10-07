import { Metadata } from 'next'
import Link from 'next/link'
import CookiePreferencesLink from '@/components/CookiePreferencesLink'
import PolicyPageShell from '@/components/PolicyPageShell'

export const metadata: Metadata = {
  title: 'Cookie Policy — SQLPerformance AI',
  description:
    'Cookie Policy for the SQLPerformance AI website, including consent storage and optional analytics cookies.',
  alternates: {
    canonical: '/cookie-policy',
  },
}

export default function CookiePolicyPage() {
  return (
    <PolicyPageShell
      eyebrow="Cookies"
      title="Cookie Policy"
      description="Which website cookies are used, why they exist, and how consent choices control optional analytics."
      lastUpdated="June 2026"
      summaryTitle="Cookie Scope"
      summaryItems={[
        'Consent preference storage',
        'Optional analytics cookies only after consent',
        'No analytics cookies before acceptance',
        'Cookie choices can be reopened and changed',
      ]}
      relatedLinks={[
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/analytics-disclosure', label: 'Analytics Disclosure' },
      ]}
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">What Cookies Mean Here</div>
        <p className="text-sm leading-relaxed text-gray-700">
          Cookies are small browser-side data records used to remember state across visits. On this website, they are
          used narrowly: to remember your consent decision and, only if consent is granted, to support anonymous usage
          analytics.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Cookie Categories</div>
        <ul className="space-y-3 text-sm text-gray-700">
          <li>
            <span className="font-semibold text-gray-900">Strictly necessary:</span> used to store your cookie consent
            choice so the site does not prompt you on every page load.
          </li>
          <li>
            <span className="font-semibold text-gray-900">Analytics:</span> used only after consent to understand
            website usage patterns in aggregate form. More detail is available in the{' '}
            <Link href="/analytics-disclosure" className="font-semibold text-primary hover:text-primary-dark">
              Analytics Disclosure
            </Link>
            .
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Consent Behavior</div>
        <p className="text-sm leading-relaxed text-gray-700">
          Analytics are disabled by default. They become active only when a visitor explicitly accepts the relevant
          cookie option. Rejecting optional cookies does not block access to the public website.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Change Your Preference</div>
        <p className="mb-4 text-sm leading-relaxed text-gray-700">
          You can reopen the consent controls at any time and update the decision that governs optional analytics
          cookies.
        </p>
        <CookiePreferencesLink />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Related Privacy Terms</div>
        <p className="text-sm leading-relaxed text-gray-700">
          This page should be read together with the{' '}
          <Link href="/privacy" className="font-semibold text-primary hover:text-primary-dark">
            Privacy Policy
          </Link>
          , which explains the broader website and product data boundary.
        </p>
      </div>
    </PolicyPageShell>
  )
}
