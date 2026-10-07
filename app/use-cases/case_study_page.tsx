import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import UseCasesSidebar from './sidebar'
import LightboxImage from '../docs/LightboxImage'
import { getCaseStudy, type Callout, type Screenshot } from './data'

export function getCaseStudyMetadata(slug: string) {
  const study = getCaseStudy(slug)

  if (!study) {
    return {
      title: 'Use Cases — SQLPerformance AI',
      alternates: { canonical: '/use-cases' },
    }
  }

  return {
    // metaTitle (short, ≤70) when set; otherwise the long headline + suffix.
    title: study.metaTitle ?? `${study.title} — Use Cases — SQLPerformance AI`,
    description: study.summary,
    alternates: { canonical: `/use-cases/${study.slug}` },
  }
}

const calloutStyles: Record<Callout['kind'], { box: string; label: string; text: string }> = {
  evidence: {
    box: 'border-slate-200 bg-slate-50',
    label: 'text-slate-500',
    text: 'text-slate-800',
  },
  note: {
    box: 'border-blue-200 bg-blue-50',
    label: 'text-blue-700',
    text: 'text-blue-900',
  },
  tip: {
    box: 'border-emerald-200 bg-emerald-50',
    label: 'text-emerald-700',
    text: 'text-emerald-900',
  },
  warning: {
    box: 'border-amber-200 bg-amber-50',
    label: 'text-amber-700',
    text: 'text-amber-900',
  },
}

const calloutLabel: Record<Callout['kind'], string> = {
  evidence: 'Evidence',
  note: 'Note',
  tip: 'Tip',
  warning: 'Watch out',
}

function ScreenshotFigure({ shot }: { shot: Screenshot }) {
  return (
    <figure className="space-y-2">
      <LightboxImage src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} />
      {shot.caption && (
        <figcaption className="text-xs text-gray-500">{shot.caption}</figcaption>
      )}
    </figure>
  )
}

function CalloutCard({ item }: { item: Callout }) {
  const style = calloutStyles[item.kind]
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${style.box} ${style.text}`}>
      <div className={`mb-1 text-xs font-semibold uppercase tracking-wide ${style.label}`}>
        {item.title ? `${calloutLabel[item.kind]} — ${item.title}` : calloutLabel[item.kind]}
      </div>
      {item.body}
    </div>
  )
}

export default function CaseStudyPage({ slug }: { slug: string }) {
  const study = getCaseStudy(slug)
  if (!study) {
    notFound()
  }

  return (
    <main>
      {/* Mirrors the visible hero breadcrumb, which ends on the category rather
          than the study title. */}
      <BreadcrumbSchema
        items={[
          { name: 'Use Cases', path: '/use-cases' },
          { name: study.category },
        ]}
      />
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-gradientFrom via-primary to-primary-gradientTo px-6 py-12 pt-32 lg:px-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/5 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/5 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-white/75">
            <Link href="/use-cases" className="hover:text-white">
              Use Cases
            </Link>
            <span>/</span>
            <span className="font-semibold text-white">{study.category}</span>
          </div>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            {study.title}
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-white/85">{study.summary}</p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
              {study.readingTime}
            </span>
            {study.environment.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/25 px-3 py-1 text-xs font-medium text-white/85"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-gray-50 px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
            <UseCasesSidebar activeSlug={study.slug} />

            {/* min-w-0 is load-bearing — see the note in app/docs/page.tsx. Without
                it this grid item kept its default min-width:auto and grew to fit the
                widest line of the <pre> below (766px on a 390px phone), dragging the
                whole page into horizontal scroll and leaving the <pre>'s own
                overflow-x-auto with nothing to scroll against. */}
            <article className="min-w-0 break-words space-y-10">
              {/* Scenario */}
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-3 text-2xl font-bold">Scenario</h2>
                <p className="text-sm leading-relaxed text-gray-700">{study.scenario}</p>
              </section>

              {/* Symptoms */}
              <section className="space-y-3">
                <h2 className="text-2xl font-bold">Symptoms</h2>
                <ul className="list-disc space-y-2 rounded-2xl border border-gray-200 bg-white p-6 pl-10 text-sm text-gray-700">
                  {study.symptoms.map((symptom) => (
                    <li key={symptom}>{symptom}</li>
                  ))}
                </ul>
              </section>

              {/* How we analyzed */}
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">How We Analyzed It</h2>
                <p className="text-sm text-gray-600">
                  Each step maps a concrete question to the module and signal used to answer it —
                  all read-only against production.
                </p>
                <ol className="space-y-4">
                  {study.analysis.map((step, index) => (
                    <li
                      key={`${step.module}-${index}`}
                      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {index + 1}
                        </span>
                        {/* Flex items get min-width:auto too, same trap as grid —
                            this column sat next to a 32px step badge and still
                            refused to go below its longest module name, so at 360px
                            it ran 21px past the card. */}
                        <div className="min-w-0 space-y-2">
                          <div className="text-xs font-semibold uppercase tracking-wide text-primary">
                            {step.module}
                          </div>
                          <p className="text-sm font-medium text-gray-900">{step.action}</p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold text-gray-700">Signal: </span>
                            {step.signal}
                          </p>
                          {step.image && (
                            <div className="pt-2">
                              <ScreenshotFigure shot={step.image} />
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Evidence */}
              <section className="space-y-3">
                <h2 className="text-2xl font-bold">Evidence</h2>
                <div className="space-y-3">
                  {study.evidence.map((item, index) => (
                    <CalloutCard key={index} item={item} />
                  ))}
                </div>
                {study.screenshots && study.screenshots.length > 0 && (
                  <div className="grid gap-4 pt-2 md:grid-cols-2">
                    {study.screenshots.map((shot) => (
                      <ScreenshotFigure key={shot.src} shot={shot} />
                    ))}
                  </div>
                )}
              </section>

              {/* Recommendation */}
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Recommendation</h2>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm leading-relaxed text-gray-700">
                    {study.recommendation.summary}
                  </p>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700">
                    {study.recommendation.actions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                  {study.recommendation.script && (
                    <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-100">
                      {study.recommendation.script}
                    </pre>
                  )}
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide">Note</div>
                  The application never applies changes automatically. Every script above is an
                  example to review and run under your own change-control process.
                </div>
              </section>

              {/* Outcome */}
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Outcome</h2>
                <p className="text-sm leading-relaxed text-gray-700">{study.outcome.summary}</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {study.outcome.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                    >
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {metric.label}
                      </div>
                      <div className="mt-3 flex items-baseline gap-2 text-sm">
                        <span className="text-gray-400 line-through">{metric.before}</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-base font-bold text-emerald-600">{metric.after}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Related modules */}
              <section className="space-y-3">
                <h2 className="text-xl font-bold">Modules used in this case</h2>
                <div className="flex flex-wrap gap-2">
                  {study.relatedModules.map((module) => (
                    <Link
                      key={module.href}
                      href={module.href}
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-primary hover:text-primary hover:shadow-md"
                    >
                      {module.label}
                    </Link>
                  ))}
                </div>
              </section>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <Link href="/use-cases" className="hover:text-gray-900">
                  Back to Use Cases
                </Link>
                <Link href="/download" className="hover:text-gray-900">
                  Download
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
