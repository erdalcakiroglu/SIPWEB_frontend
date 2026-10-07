import type { ReactNode } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type PolicyPageShellProps = {
  eyebrow: string
  title: string
  description: string
  lastUpdated: string
  summaryTitle: string
  summaryItems: string[]
  relatedLinks?: Array<{ href: string; label: string }>
  children: ReactNode
}

export default function PolicyPageShell({
  eyebrow,
  title,
  description,
  lastUpdated,
  summaryTitle,
  summaryItems,
  relatedLinks = [],
  children,
}: PolicyPageShellProps) {
  return (
    <main>
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-primary-gradientFrom via-primary to-primary-gradientTo px-6 py-12 pt-32 lg:px-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/5 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/5 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">{eyebrow}</div>
          <h1 className="mb-4 max-w-4xl text-3xl font-extrabold tracking-tight text-white md:text-5xl">{title}</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-white/85">{description}</p>
          <div className="mt-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm">
            Last updated: {lastUpdated}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-10 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{summaryTitle}</div>
              <ul className="space-y-2 text-sm text-gray-700">
                {summaryItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {relatedLinks.length > 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Related Pages</div>
                <div className="space-y-2 text-sm">
                  {relatedLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block font-medium text-primary transition-colors hover:text-primary-dark"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>

          <div className="space-y-6">{children}</div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
