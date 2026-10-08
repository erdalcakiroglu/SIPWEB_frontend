import { Metadata } from 'next'
import Link from 'next/link'
import CookiePreferencesLink from '@/components/CookiePreferencesLink'
import PolicyPageShell from '@/components/PolicyPageShell'

export const metadata: Metadata = {
  title: 'Cookie Policy — SQLPerformance AI',
  description:
    'Cookie Policy for the SQLPerformance AI website: how your consent choice is stored and when Google Analytics cookies are set.',
  alternates: {
    canonical: '/cookie-policy',
  },
}

// Checked against components/CookieConsent.tsx and app/layout.tsx on 2026-10-08.
// The consent choice lives in localStorage (key cookie_consent), not in a cookie.
// The Google tag loads on every page with all storage denied; Accept grants
// analytics_storage only, and the ad signals stay denied in both choices.
export default function CookiePolicyPage() {
  return (
    <PolicyPageShell
      eyebrow="Cookies"
      title="Cookie Policy"
      description="Which cookies the website sets, when it sets them, and how your choice controls them."
      lastUpdated="October 2026"
      summaryTitle="Cookie Scope"
      summaryItems={[
        'Google Analytics cookies only after you accept',
        'No advertising cookies',
        'Your choice is kept in local storage, not a cookie',
        'You can change your choice at any time',
      ]}
      relatedLinks={[
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/analytics-disclosure', label: 'Analytics Disclosure' },
      ]}
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">What Cookies Mean Here</div>
        <p className="text-sm leading-relaxed text-gray-700">
          Cookies are small records a website stores in your browser to remember information between visits. This
          website sets cookies for one purpose only: Google Analytics, and only after you accept it in the cookie
          banner.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">What The Site Stores</div>
        <ul className="space-y-3 text-sm text-gray-700">
          <li>
            <span className="font-semibold text-gray-900">Your consent choice:</span> stored in your browser&apos;s
            local storage, not in a cookie, so the banner does not appear on every page. It stays on your device and is
            not sent to us.
          </li>
          <li>
            <span className="font-semibold text-gray-900">Google Analytics cookies:</span> _ga and _ga_*, set only
            after you choose Accept, to tell visits and returning visitors apart in usage reports. More detail is in
            the{' '}
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
          Until you choose, analytics storage is denied and no analytics cookies are set. Accept allows Google
          Analytics cookies; Reject keeps them off. Advertising storage and advertising signals stay denied whichever
          you choose, because the site runs no ads. Rejecting does not limit access to any part of the website.
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
