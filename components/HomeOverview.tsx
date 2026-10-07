import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Check,
  FileCheck2,
  Gauge,
  LockKeyhole,
  SearchCheck,
  ShieldCheck,
} from 'lucide-react'

const workflow = [
  {
    icon: Gauge,
    number: '01',
    title: 'See the workload clearly',
    description: 'Start with server health, Query Store, waits, blocking, and high-impact query signals.',
  },
  {
    icon: SearchCheck,
    number: '02',
    title: 'Investigate with evidence',
    description: 'Connect execution plans, runtime history, metadata, and deterministic findings in one review.',
  },
  {
    icon: FileCheck2,
    number: '03',
    title: 'Share a review-ready result',
    description: 'Export AI analysis reports as HTML with findings, recommendations, confidence, and a validation plan for your team.',
  },
]

const safeguards = [
  {
    icon: ShieldCheck,
    title: 'Read-only by design',
    description: 'The application investigates and recommends. It does not automatically apply schema, index, job, or data changes.',
    href: '/security',
    link: 'Review security',
  },
  {
    icon: LockKeyhole,
    title: 'Local-first AI',
    description: 'Use a local Ollama model, or explicitly configure a supported cloud provider under your own data policy.',
    href: '/docs/settings',
    link: 'Explore AI settings',
  },
  {
    icon: BarChart3,
    title: 'Evidence before advice',
    description: 'Recommendations are supported by the diagnostic signals available for the selected server, database, and workload.',
    href: '/features',
    link: 'See all capabilities',
  },
]

export default function HomeOverview() {
  return (
    <>
      <section className="bg-white px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">A clearer diagnostic workflow</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">From symptom to evidence-backed action</h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">A focused workflow for DBAs and engineering teams—without turning the database into another automation target.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {workflow.map(({ icon: Icon, number, title, description }) => (
              <article key={number} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary-dark"><Icon className="h-5 w-5" /></div>
                  <span className="text-sm font-bold text-gray-300">{number}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50 px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-xl shadow-slate-200/60">
            <div className="flex items-center gap-1.5 border-b border-gray-100 px-3 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
              <span className="ml-2 text-[11px] font-medium text-gray-400">AI Performance Analysis Report</span>
            </div>
            <Image src="/main/0006a-AI_Report-01.png" alt="Exported AI performance analysis report with prioritized findings" width={1538} height={736} sizes="(min-width: 1024px) 560px, 100vw" className="w-full rounded-b-xl" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Built for review</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">Recommendations your team can inspect.</h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">Move beyond isolated metrics. Bring the problem, supporting evidence, recommended action, confidence, and test plan into the same report.</p>
            <ul className="mt-7 space-y-4">
              {['Prioritized findings with operational context', 'Evidence and confidence shown with each recommendation', 'Review-only scripts and validation guidance', 'HTML exports you can share with your team'].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-light"><Check className="h-3 w-3 text-primary-dark" strokeWidth={3} /></span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/docs/modules/query-statistics" className="mt-8 inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-primary-dark">See how Query Statistics works <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Controlled by the operator</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">Designed for production-conscious teams.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {safeguards.map(({ icon: Icon, title, description, href, link }) => (
              <article key={title} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary-dark"><Icon className="h-5 w-5" /></div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">{description}</p>
                <Link href={href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark">{link} <ArrowRight className="h-4 w-4" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
