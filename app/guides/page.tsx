import Link from 'next/link'
import Header from '@/components/Header'
import PageHero from '@/components/PageHero'
import Footer from '@/components/Footer'
import { guides } from './data'

export const metadata = {
  title: 'SQL Server Performance Guides — SQLPerformance AI',
  // Kept under 160 characters: the first render measured 165, which Google
  // truncates mid-sentence in the SERP.
  description:
    'Long-form technical guides to SQL Server performance: wait statistics, diagnosis methodology, and the DMVs and queries behind them. Vendor-neutral, free.',
  alternates: {
    canonical: '/guides',
  },
}

export default function GuidesIndexPage() {
  return (
    <main>
      <Header />

      <PageHero
        title="SQL Server Performance Guides"
        description="Complete, practical guides to the parts of SQL Server performance work that are the same whatever tooling you use — the DMVs, the queries, the methodology, and what to change once the evidence points somewhere."
      />

      <section className="bg-gray-50 px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">What these are, and what they are not</h2>
            <p className="mt-3 text-sm leading-7 text-gray-700">
              Guides are about SQL Server. They contain runnable T-SQL, they assume nothing is installed, and they are
              useful whether or not you ever open our application. If you are looking for how a particular screen in
              the product works, that is the{' '}
              <Link href="/docs" className="font-semibold text-primary hover:text-primary-dark">
                documentation
              </Link>
              ; if you want a worked example of a real problem being solved end to end, that is the{' '}
              <Link href="/use-cases" className="font-semibold text-primary hover:text-primary-dark">
                use cases
              </Link>
              .
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {guides.map((item) => (
              <Link
                key={item.slug}
                href={`/guides/${item.slug}`}
                className="flex min-w-0 flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-primary hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {item.topic}
                  </span>
                  <span className="whitespace-nowrap text-xs text-gray-400">{item.readingTime}</span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{item.h1}</h3>
                <p className="text-sm leading-6 text-gray-600">{item.summary}</p>
                <span className="mt-4 text-sm font-semibold text-primary">Read the guide →</span>
              </Link>
            ))}
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide">Where to start</div>
            If you are working an active problem, start with the diagnosis guide and let it send you into the wait
            statistics one when the evidence points that way. For how each analysis workflow looks inside the product,
            the{' '}
            <Link className="font-semibold underline hover:text-blue-700" href="/docs">
              module documentation
            </Link>{' '}
            covers it screen by screen.
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
