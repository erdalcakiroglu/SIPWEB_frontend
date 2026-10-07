import Link from 'next/link'
import Header from '@/components/Header'
import PageHero from '@/components/PageHero'
import Footer from '@/components/Footer'
import UseCasesSidebar from './sidebar'
import { caseStudies } from './data'

export const metadata = {
  title: 'Use Cases — SQLPerformance AI',
  description:
    'Real SQL Server problems analyzed step by step — how each issue was diagnosed with evidence and resolved with safe, read-only recommendations.',
  alternates: {
    canonical: '/use-cases',
  },
}

export default function UseCasesIndexPage() {
  return (
    <main>
      <Header />

      {/* Hero */}
      <PageHero
        title="How Real SQL Server Problems Get Solved"
        description="Each use case walks through a real performance problem the same way the application does: symptom, evidence-backed analysis, a safe recommendation, and the measured outcome — all read-only, with no automatic changes."
      />

      {/* Body */}
      <section className="bg-gray-50 px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
            <UseCasesSidebar />

            <div className="space-y-8">
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h2 className="mb-2 text-2xl font-bold">Every case follows the same path</h2>
                <p className="text-sm text-gray-700">
                  Scenario → Symptoms → How we analyzed → Evidence → Recommendation → Outcome. This
                  is the analysis discipline the product encourages: never guess, always tie a fix to
                  a signal.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {caseStudies.map((study) => (
                  <Link
                    key={study.slug}
                    href={`/use-cases/${study.slug}`}
                    className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-primary hover:shadow-md"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {study.category}
                      </span>
                      <span className="text-xs text-gray-400">{study.readingTime}</span>
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-gray-900">{study.title}</h3>
                    <p className="text-sm text-gray-600">{study.summary}</p>
                    <span className="mt-4 text-sm font-semibold text-primary hover:text-primary-dark">
                      Read the analysis →
                    </span>
                  </Link>
                ))}
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide">Note</div>
                Looking for setup and module reference instead?{' '}
                <Link className="font-semibold underline hover:text-blue-700" href="/docs">
                  Head to the documentation
                </Link>
                .
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
