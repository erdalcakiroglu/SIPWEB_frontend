import Link from 'next/link'
import { Github, Linkedin } from 'lucide-react'
import CookiePreferencesLink from './CookiePreferencesLink'

// Verified live on August 15, 2026: the GitHub account returns 200 and resolves to
// user id 317333740. LinkedIn answers automated requests with HTTP 999 regardless
// of whether a profile exists, so that one could not be machine-verified — check it
// in a browser if it ever looks wrong.
//
// `rel="me"` is what marks these as the same entity's other profiles; it is the
// link-level counterpart to the Organization `sameAs` in app/layout.tsx. Only the
// GitHub URL appears in `sameAs`, because that property must identify the
// organization itself and the LinkedIn URL is a personal profile.
const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/sqlperformanceai', Icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/adam-smith-67402b42a', Icon: Linkedin },
]

const footerLinks = {
  product: [
    { label: 'Features', href: '/features' },
    { label: 'Security', href: '/security' },
    // Was `/#pricing`, which pointed at a homepage section that does not exist —
    // the homepage renders Hero/TrustBar/HomeOverview/CTA and no pricing block,
    // so the link landed at the top of the homepage and did nothing. Pricing
    // lives on its own route, which is where the header nav already points.
    { label: 'Pricing', href: '/pricing' },
    { label: 'Download', href: '/download' },
  ],
  resources: [
    { label: 'Documentation', href: '/docs' },
    // The pillar guides live here rather than in the header nav on purpose. The
    // header already needs about 1000px for six links and only just fits at the lg
    // breakpoint; a seventh would push it over again. The footer is on every page,
    // so the sitewide internal link is there either way.
    { label: 'Guides', href: '/guides' },
    { label: 'Use Cases', href: '/use-cases' },
    { label: 'FAQ', href: '/faq' },
  ],
  company: [
    { label: 'Contact', href: '/contact' },
    { label: 'Terms of Service', href: '/terms' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
    { label: 'Analytics disclosure', href: '/analytics-disclosure' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 px-6 py-14 text-white lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-10 border-b border-slate-800 pb-8 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
          {/* Brand Section */}
          <div className="max-w-xs">
            <div className="mb-3">
              <h3 className="text-base font-bold leading-tight">SQLPerformance AI</h3>
              <p className="text-xs text-slate-400 mt-1">Local-First, Read-Only SQL Server Investigation</p>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Interactive SQL Server diagnostics for Windows, with local AI by default and optional cloud AI.
            </p>

            {/* 40x40 hit areas with a 8px gap — comfortably above the 24px the icon
                itself occupies, so these stay usable on a phone. */}
            <ul className="mt-5 flex items-center gap-2">
              {socialLinks.map(({ label, href, Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="me noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-300">Product</h4>
            <ul className="space-y-2.5">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-300">Resources</h4>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-300">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookiePreferencesLink />
              </li>
            </ul>
          </div>

          {/* Legal & Privacy */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-300">Legal &amp; Privacy</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-4 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-center text-sm text-slate-500 md:text-left">
            © 2026 SQLPerformance AI. All rights reserved.
          </p>

          <p className="text-center text-xs text-slate-500 leading-relaxed">
            Interactive desktop diagnostics, not a 24/7 monitoring service. Cloud LLM is optional and user-controlled. This website uses anonymous analytics.{' '}
            <Link href="/analytics-disclosure" className="text-slate-400 underline hover:text-white">
              Analytics disclosure
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}
