import { Metadata } from 'next'
import Link from 'next/link'
import PolicyPageShell from '@/components/PolicyPageShell'

export const metadata: Metadata = {
  title: 'Privacy Policy — SQLPerformance AI',
  description:
    'How SQLPerformance AI handles website, contact form, customer portal and license data, what the desktop application sends over the network, and optional analytics consent.',
  alternates: {
    canonical: '/privacy',
  },
}

// Every statement below was checked against the v1.1.0 desktop app, the license
// and portal API, and the website code on 2026-10-08. The app has no telemetry,
// usage analytics, crash reporting or update check; its only fixed outbound calls
// are the license server and the public Microsoft SQL Server update list. The
// device identifier is a SHA-256 hash computed on the machine. Recheck the app
// before adding any new network behavior here.
const overviewItems = [
  'No telemetry or usage analytics in the desktop app',
  'Local-first AI by default; cloud AI only if you choose it',
  'License checks send an email address and a device hash',
  'Website analytics only after consent',
]

export default function PrivacyPage() {
  return (
    <PolicyPageShell
      eyebrow="Privacy"
      title="Privacy Policy"
      description="What the website, the customer portal, the license server and the desktop application collect, and what the application sends over the network."
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
          This policy covers the public website, the contact form, the customer portal, the license server, and the
          network behavior of the SQLPerformance AI desktop application. It does not expand your rights beyond any
          separately agreed commercial terms, but it explains the operating model: the product is a read-only,
          local-first Windows application, and any cloud use is optional and chosen by you.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Website Data</div>
        <p className="text-sm leading-relaxed text-gray-700">
          The website is hosted on Cloudflare. When you browse it, standard request data such as your IP address,
          browser type and the pages you request is processed to serve the site and protect it from abuse. Google
          Analytics cookies are set only after you accept them in the cookie banner.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Contact Form</div>
        <p className="text-sm leading-relaxed text-gray-700">
          When you send the contact form, we store the reason you choose, your name, work email, company, subject,
          message, the optional
          environment details you add, the page you sent it from, and your browser&apos;s user agent and IP address. We
          use them to reply to you and to block spam and abuse.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Customer Portal And Payments</div>
        <p className="text-sm leading-relaxed text-gray-700">
          A customer portal account stores your name, surname, job title, email address, phone number, company name,
          and a hash of your password, never the password itself. Account emails such as activation and password reset
          are sent through Resend, an email delivery service. Paid subscriptions are billed through Stripe; card details
          are entered with Stripe and are not stored by us.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">What The Desktop App Sends</div>
        <p className="mb-3 text-sm leading-relaxed text-gray-700">
          Apart from your SQL Server and the AI provider you choose, the application connects to the following, and
          nothing else:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-700">
          <li>
            <span className="font-semibold text-gray-900">License server:</span> trial registration sends your email
            address, a device identifier and the Windows version. The device identifier is a one-way hash computed on
            your machine; the computer name, network adapter address and Windows machine ID used to compute it are not
            sent. Requesting an activation code also sends your portal email and password over HTTPS (the application
            does not store that password), and activation sends the activation code. License validation sends the
            license token and the device identifier, at most about once a day when the application starts. The license
            server keeps your email and the device identifier and, for activated licenses, the Windows version and IP
            address of the last check. An offline license file avoids these calls.
          </li>
          <li>
            <span className="font-semibold text-gray-900">Microsoft SQL Server update list:</span> Security Audit
            downloads Microsoft&apos;s public list of SQL Server updates from learn.microsoft.com, at most once every 24
            hours, to compare build numbers. Nothing about your server is sent with this request.
          </li>
          <li>
            <span className="font-semibold text-gray-900">Blocking alert webhook:</span> off by default. If you turn it
            on, the alert summary is sent to the URL you enter: alert counts and up to eight alert titles, each with
            its measured value (session count, chain depth or wait time) and threshold. Server names, logins and SQL text are not sent.
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          The application has no telemetry, usage analytics, crash reporting or automatic update check. Links to
          Microsoft documentation open in your browser only when you click them.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Product Data Boundary</div>
        <p className="text-sm leading-relaxed text-gray-700">
          SQLPerformance AI is a Windows desktop application for read-only SQL diagnostics. With the default local
          Ollama model, the context used for AI analysis stays inside your environment. The application does not change
          data or schema on target SQL Server systems and does not run the scripts it generates. Its settings, your
          first-run profile (name, company, email and a hash of the application password), connection profiles, logs
          and license data are stored on your machine under %LOCALAPPDATA%\SQLPerformance AI; SQL Server passwords,
          AI provider API keys and the webhook URL are kept in Windows Credential Manager.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Optional Cloud AI</div>
        <p className="text-sm leading-relaxed text-gray-700">
          Cloud AI is optional and user-controlled. If you select a cloud provider and enter an API key, the context
          prepared for analysis, which can include query text, execution plans, parameter values and object names, is
          sent to that provider. Redaction and approval before sending exist only in some modules, as described on the{' '}
          <Link href="/security" className="font-semibold text-primary hover:text-primary-dark">
            Security page
          </Link>
          . No cloud transfer of this kind happens unless you have chosen a provider.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Cookies And Analytics</div>
        <p className="text-sm leading-relaxed text-gray-700">
          Your cookie choice is stored in your browser&apos;s local storage so the site remembers whether analytics were
          accepted or rejected. Details are in the{' '}
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
          <li>You can use an offline license file instead of online license checks.</li>
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
