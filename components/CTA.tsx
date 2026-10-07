import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="border-t border-gray-200 bg-gray-50 px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-6xl rounded-3xl bg-slate-900 px-6 py-12 text-center text-white shadow-xl sm:px-10 lg:py-14">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">Start with your own workload</p>
        <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">Investigate SQL Server performance without handing over control.</h2>

        <p className="mx-auto mb-9 mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
          Full features for 30 days. No credit card required. You review every recommendation and decide what happens next.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/download"
            className="rounded-xl bg-white px-7 py-3.5 font-semibold text-slate-900 transition-all hover:-translate-y-0.5 hover:bg-cyan-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
          >
            Start 30-Day Free Trial
          </Link>
          <Link
            href="/features"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-7 py-3.5 font-semibold text-white transition-colors hover:border-slate-400 hover:bg-slate-800"
          >
            Explore the modules
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-xs leading-relaxed text-slate-400">Recommendations are guidance only. Performance outcomes vary by workload. With the default local Ollama setup, AI analysis stays on your machine; cloud AI is optional and only used if you choose a provider.</p>
      </div>
    </section>
  )
}
