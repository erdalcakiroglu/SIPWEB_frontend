import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check, PlayCircle } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-gradientFrom via-primary to-primary-gradientTo px-6 pb-16 pt-32 lg:px-10 lg:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-60" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 right-[8%] h-96 w-96 rounded-full bg-cyan-200/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div>
          <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">
            Local-first · Read-only · Interactive
          </div>

          {/* The h1 once read "Find the root cause without sending production
              evidence to the cloud." — a good promise that named neither the product
              nor the problem. It was later reworded to keep "SQL Server" and
              "performance" in the line. On 2026-10-04 the cloud promise was dropped:
              AI analysis can run on a local Ollama model, but the user may also pick
              OpenAI, Anthropic, Azure OpenAI or DeepSeek, so "never sends evidence to
              the cloud" is not something the app guarantees. Keep "SQL Server" and
              "performance" in this line. */}
          <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
            Tune SQL Server performance with read-only, local-first analysis.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
            A read-only SQL Server performance tuning workbench for Windows. AI analysis defaults to your own local Ollama model; cloud AI providers are optional and chosen by you.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/download"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary-dark shadow-lg transition-all hover:-translate-y-0.5 hover:bg-cyan-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              Start 30-Day Free Trial
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <PlayCircle className="h-4 w-4" />
              Explore the modules
            </Link>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
            {['No credit card', 'No agents', 'No automatic changes'].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-cyan-200" strokeWidth={2.5} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="absolute -inset-5 rounded-[2rem] bg-white/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/25 bg-white p-2 shadow-[0_28px_70px_-22px_rgba(2,40,46,0.65)]">
            <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
              </div>
              <span className="text-[11px] font-medium text-gray-400">Dashboard · Overview</span>
            </div>
            <Image
              src="/docs/dashboard/003.png"
              alt="SQLPerformance AI Dashboard Overview with Server Health, Memory Health, Workload, Storage & I/O and TempDB panels for a SQL Server instance"
              width={1661}
              height={1001}
              priority
              sizes="(min-width: 1024px) 620px, 100vw"
              className="w-full rounded-b-xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
