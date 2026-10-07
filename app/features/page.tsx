import type { Metadata } from 'next'
import Header from '@/components/Header'
import PageHero from '@/components/PageHero'
import Features from '@/components/Features'
import ModuleDetails from './module_details'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

// This page owns the "sql server performance analyzer" query cluster — roughly
// ten variants and ~400 impressions, all assigned here rather than to the
// homepage so the two do not compete for the same term. "Analyzer" is used
// throughout instead of "monitoring": the product is not a collector, and the
// monitoring audience it would attract is one it cannot serve.
export const metadata: Metadata = {
  title: 'SQL Server Performance Analyzer — 8 Read-Only Modules',
  // Kept under ~160 characters so Google does not truncate it in the result.
  description:
    'Analyze SQL Server queries, plans, waits, blocking, indexes, and security from one Windows desktop app. Read-only, no agents, no mandatory cloud service.',
  alternates: {
    canonical: '/features',
  },
}

export default function FeaturesPage() {
  return (
    <main>
      <Header />
      <PageHero
        title="A read-only SQL Server performance analyzer"
        description="One workbench for query, plan, wait, blocking, index, job, and security evidence—without installing a collector or handing production context to a mandatory cloud service."
      />
      {/* Lead paragraph added 2026-09-15. GSC (Sep 1-14) showed the page being
          tested broadly on the analyzer/analysis cluster at positions 57-84:
          Google accepts the page's relevance but not its depth. This block puts
          the page's core terminology into the first visible copy. Title, H1 and
          meta are deliberately unchanged — content-only strengthening. */}
      <section className="bg-white px-6 pt-16 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-8 text-gray-700">
            SQLPerformance AI is a read-only SQL Server performance analyzer for DBAs and developers. It brings
            query performance analysis, execution plans, wait statistics, blocking analysis, index diagnostics,
            SQL Agent job review, and security evidence into one investigation workflow. Instead of continuously
            monitoring your servers, it helps you diagnose why SQL Server performance is slow — and shows the
            evidence behind the answer.
          </p>
        </div>
      </section>
      <Features />
      <ModuleDetails />
      <CTA />
      <Footer />
    </main>
  )
}
