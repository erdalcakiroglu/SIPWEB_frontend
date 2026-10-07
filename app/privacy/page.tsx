import { Metadata } from 'next'
import Link from 'next/link'
import PolicyPageShell from '@/components/PolicyPageShell'

export const metadata: Metadata = {
  title: 'Privacy Policy — SQLPerformance AI',
  description:
    'Privacy Policy describing how SQLPerformance AI handles website data, optional analytics consent, and product data boundaries.',
  alternates: {
    canonical: '/privacy',
  },
}

const overviewItems = [
  'Local-first AI by default',
  'Optional and consent-based website analytics',
  'Read-only SQL diagnostics model',
  'User-controlled cloud AI usage',
]

export default function PrivacyPage() {
  return (
    <PolicyPageShell
      eyebrow="Privacy"
      title="Privacy Policy"
      description="How website data, product behavior, and optional cloud-connected actions are handled across SQLPerformance AI."
      lastUpdated="October 2026"
      summaryTitle="At A Glance"
      summaryItems={overviewItems}
      relatedLinks={[
        { href: '/cookie-policy', label: 'Cookie Policy' },
        { href: '/analytics-disclosure', label: 'Analytics Disclosure' },
        { href: '/contact', label: 'Contact' },
      ]}
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Overview</div>
        <p className="text-sm leading-relaxed text-gray-700">
          This policy covers the public website and the product posture described on the site. It does not expand your
          rights beyond any separately agreed commercial terms, but it explains the operating model clearly: the product
          is a read-only, local-first desktop application and is explicit about any optional cloud usage.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Website Data</div>
        <p className="text-sm leading-relaxed text-gray-700">
          When you browse the website, standard technical information such as request metadata, browser behavior, and
          page views can be processed to serve the site and keep it available. Optional analytics are separate from
          essential site delivery and are only enabled after consent through the cookie banner.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Product Data Boundary</div>
        <p className="text-sm leading-relaxed text-gray-700">
          SQLPerformance AI is a Windows desktop application for read-only SQL diagnostics. With the default local AI
          model, the context used for AI analysis stays inside the customer environment. The application does not
          change data or schema on target SQL Server systems and does not run the scripts it generates.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Optional Cloud Features</div>
        <p className="text-sm leading-relaxed text-gray-700">
          Cloud AI is optional and user-controlled. If a user selects a cloud provider and enters an API key, the
          context prepared for analysis, which can include query text, execution plans, parameter values and object
          names, is sent to that provider. Redaction and approval before sending exist only in some modules, as
          described on the{' '}
          <Link href="/security" className="font-semibold text-primary hover:text-primary-dark">
            Security page
          </Link>
          . No cloud transfer of this kind happens unless the user has chosen a provider.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Cookies And Analytics</div>
        <p className="text-sm leading-relaxed text-gray-700">
          Cookie consent choices are stored so the site can remember whether analytics were accepted or rejected.
          Details about those categories are documented in the{' '}
          <Link href="/cookie-policy" className="font-semibold text-primary hover:text-primary-dark">
            Cookie Policy
          </Link>{' '}
          and the{' '}
          <Link href="/analytics-disclosure" className="font-semibold text-primary hover:text-primary-dark">
            Analytics Disclosure
          </Link>
          .
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Your Choices</div>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>You can reject optional analytics cookies.</li>
          <li>You can revisit cookie choices from the cookie preferences link.</li>
          <li>You can avoid cloud AI usage by keeping analysis in the local path.</li>
          <li>You can contact us regarding privacy questions or correction requests.</li>
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Contact And Changes</div>
        <p className="text-sm leading-relaxed text-gray-700">
          For privacy-related questions, use the{' '}
          <Link href="/contact" className="font-semibold text-primary hover:text-primary-dark">
            contact page
          </Link>
          . If this policy changes materially, the revised version will be published here with an updated date.
        </p>
      </div>
    </PolicyPageShell>
  )
}
