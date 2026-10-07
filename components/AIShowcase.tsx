import Link from 'next/link'
import Image from 'next/image'
import { Check } from 'lucide-react'

const aiFeatures = [
  { title: 'Executive summary for fast production decisions', description: 'Clear overview of impact' },
  { title: 'Deterministic confidence scoring for safe prioritization', description: 'Know reliability per recommendation' },
  { title: 'Evidence pointers for traceability', description: 'Trace every claim to evidence' },
  { title: 'Copy-paste scripts', description: 'You review. You execute. We never auto-deploy.' },
]

export default function AIShowcase() {
  return (
    <section className="bg-white px-6 py-24 lg:px-10">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Content */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            AI Analysis
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Deterministic, evidence-backed SQL recommendations
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            We analyze execution plans, Query Store, and wait signals to generate AI-assisted, audit-ready tuning
            recommendations.
          </p>

          <ul className="mt-8 space-y-4">
            {aiFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-light">
                  <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                </span>
                <span className="text-sm leading-relaxed text-gray-700">
                  <strong className="font-semibold text-gray-900">{feature.title}</strong> — {feature.description}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/download"
            className="mt-9 inline-flex items-center rounded-full bg-cta px-6 py-3 text-sm font-semibold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:bg-cta-hover hover:shadow-cta-hover focus:outline-none focus-visible:ring-4 focus-visible:ring-cta/30"
          >
            Start 30-Day Free Trial
          </Link>
        </div>

        {/* Real AI report screenshot — refined frame */}
        <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.2)] ring-1 ring-black/[0.02]">
          <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50/80 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
            <span className="ml-2 text-[11px] font-medium text-gray-400">AI Performance Analysis Report</span>
          </div>
          <Image
            src="/main/0006a-AI_Report-01.png"
            alt="AI performance analysis report highlighting the primary query-design problem with diagnosis confidence"
            width={1538}
            height={736}
            sizes="(min-width: 1024px) 520px, 100vw"
            className="w-full"
          />
        </div>
      </div>
    </section>
  )
}
