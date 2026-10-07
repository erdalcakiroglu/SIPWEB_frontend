'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Callout = { x: number; y: number; text: string }

type Slide = {
  tab: string
  eyebrow: string
  title: string
  description: string
  evidence: string[]
  outcome: string
  image: string
  width: number
  height: number
  alt: string
  callouts: Callout[]
}

const slides: Slide[] = [
  {
    tab: 'Procedure AI',
    eyebrow: 'Step 04 · Object Explorer / AI Tune',
    title: 'Go from stored procedure to root cause.',
    description:
      'Analyze a selected procedure with execution evidence, plan signals, Query Store metrics and AI-assisted classification.',
    evidence: ['AI Tune', 'Memory grant analysis', 'Confidence score', 'Process log'],
    outcome: 'Turn a selected procedure into a structured diagnosis with reason, bottleneck and confidence.',
    image: '/main/carousel/object-explorer-ai.png',
    width: 1610,
    height: 931,
    alt: 'Object Explorer AI Tune screen showing selected stored procedure, executive summary, classification table and confidence score.',
    callouts: [
      { x: 20, y: 49, text: 'Selected procedure' },
      { x: 55, y: 24, text: 'Executive summary' },
      { x: 63, y: 51, text: 'Classification' },
    ],
  },
  {
    tab: 'Report',
    eyebrow: 'Step 06 · Audit-ready report',
    title: 'Generate structured tuning reports.',
    description:
      'Turn technical findings into an audit-ready report with problem summary, evidence, actions, confidence and test plan.',
    evidence: ['What’s wrong', 'Problem details', 'Actions', 'Test plan'],
    outcome: 'Give DBAs, developers and managers the same evidence-backed tuning narrative.',
    image: '/main/carousel/ai-report.png',
    width: 1456,
    height: 906,
    alt: 'AI report page showing what is wrong, problem details, actions and test plan navigation.',
    callouts: [
      { x: 47, y: 31, text: 'What’s wrong' },
      { x: 58, y: 74, text: 'Evidence' },
      { x: 45, y: 94, text: 'Prioritized actions' },
    ],
  },
  {
    tab: 'Health',
    eyebrow: 'Step 01 · Server health',
    title: 'Start with server health, not assumptions.',
    description:
      'See CPU, memory, workload, IO and TempDB signals before diving into individual queries. This gives the DBA a safe first read of the environment.',
    evidence: ['CPU / SQL CPU', 'Memory / PLE', 'IO latency', 'TempDB'],
    outcome: 'Confirm whether the issue is system-wide or query-specific before tuning anything.',
    image: '/main/carousel/health-dashboard.png',
    width: 1595,
    height: 635,
    alt: 'SQLPerformance AI server health dashboard showing CPU, memory, workload, IO and TempDB status.',
    callouts: [
      { x: 62, y: 20, text: 'Runnable queue signal' },
      { x: 43, y: 41, text: 'Memory health' },
      { x: 69, y: 78, text: 'TempDB status' },
    ],
  },
  {
    tab: 'Queries',
    eyebrow: 'Step 02 · Query statistics',
    title: 'Find the queries that actually matter.',
    description:
      'Rank procedures by impact, detect plan variance, and identify parameter sniffing candidates from Query Store evidence.',
    evidence: ['Impact score', 'Query Store', 'Plan count', 'Parameter sniffing'],
    outcome: 'Prioritize the first investigation target using impact, not guesswork.',
    image: '/main/carousel/query-statistics.png',
    width: 1614,
    height: 921,
    alt: 'Query Statistics screen showing high impact procedures, plan counts, and parameter sniffing warnings.',
    callouts: [
      { x: 16, y: 34, text: 'High-impact procedure' },
      { x: 78, y: 31, text: 'Impact score' },
      { x: 18, y: 44, text: 'Plan variance warning' },
    ],
  },
  {
    tab: 'Waits',
    eyebrow: 'Step 03 · Wait statistics',
    title: 'Understand workload pressure before changing code.',
    description:
      'Correlate CPU, memory, IO and lock waits with workload trends, baseline movement and current active alerts.',
    evidence: ['CXPACKET', 'RESOURCE_SEMAPHORE', 'WRITELOG', 'Baseline delta'],
    outcome: 'Separate query symptoms from platform pressure such as CPU, memory grants, IO or blocking.',
    image: '/main/carousel/wait-statistics.png',
    width: 1597,
    height: 915,
    alt: 'Wait Statistics screen with top waits, resource wait summary, alerts, and primary finding.',
    callouts: [
      { x: 14, y: 30, text: 'Top waits by share' },
      { x: 70, y: 68, text: 'Primary finding' },
      { x: 72, y: 50, text: 'Critical alert' },
    ],
  },
  {
    tab: 'Indexes',
    eyebrow: 'Step 05 · Deterministic Index Advisor',
    title: 'Index recommendations with deterministic guardrails.',
    description:
      'Separate unused, risky, duplicate and high-write indexes with drop safety, read/write evidence and review-only actions.',
    evidence: ['Drop safety', 'Deterministic score', 'Read / write ratio', 'Validate only'],
    outcome: 'Review index risk without allowing AI to blindly drop or create indexes.',
    image: '/main/carousel/index-advisor.png',
    width: 1630,
    height: 871,
    alt: 'Index Advisor screen showing deterministic index analysis, drop safety, score, read/write metrics and AI analysis.',
    callouts: [
      { x: 25, y: 33, text: 'Risk-ranked indexes' },
      { x: 76, y: 27, text: 'AI analysis panel' },
      { x: 78, y: 64, text: 'Validate-only action' },
    ],
  },
]

const DURATION = 6500

export default function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const pausedRef = useRef(false)
  const startedRef = useRef<number>(Date.now())
  const rootRef = useRef<HTMLElement>(null)

  const goTo = useCallback((i: number) => {
    setIndex((i + slides.length) % slides.length)
    startedRef.current = Date.now()
    setProgress(0)
  }, [])

  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  // Auto-advance with progress bar; pauses on hover/focus.
  useEffect(() => {
    startedRef.current = Date.now()
    setProgress(0)
    let raf: number
    const tick = () => {
      if (!pausedRef.current) {
        const elapsed = Date.now() - startedRef.current
        const pct = Math.min(100, (elapsed / DURATION) * 100)
        setProgress(pct)
        if (elapsed >= DURATION) {
          setIndex((i) => (i + 1) % slides.length)
          startedRef.current = Date.now()
          setProgress(0)
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      next()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    }
  }

  const slide = slides[index]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1aa4b4] via-[#0e8a9d] to-[#0a5f6f] px-6 pt-28 pb-20 lg:px-10">
      {/* Tiled grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '68px 68px',
        }}
      />
      {/* Soft depth highlight */}
      <div className="pointer-events-none absolute -left-24 -top-24 -z-0 h-[30rem] w-[30rem] rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Product walkthrough carousel */}
        <section
          ref={rootRef}
          aria-roledescription="carousel"
          aria-label="SQLPerformance AI product walkthrough"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseEnter={() => {
            pausedRef.current = true
          }}
          onMouseLeave={() => {
            pausedRef.current = false
            startedRef.current = Date.now() - (progress / 100) * DURATION
          }}
          onFocus={() => {
            pausedRef.current = true
          }}
          onBlur={() => {
            pausedRef.current = false
            startedRef.current = Date.now() - (progress / 100) * DURATION
          }}
          className="overflow-hidden rounded-3xl border border-white/40 bg-white shadow-[0_30px_80px_-24px_rgba(2,40,46,0.55)] ring-1 ring-black/5 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
        >
          {/* Tabs */}
          <div role="tablist" aria-label="Walkthrough steps" className="grid grid-cols-3 border-b border-gray-200 bg-gray-50/70 sm:grid-cols-6">
            {slides.map((s, i) => (
              <button
                key={s.tab}
                role="tab"
                type="button"
                aria-selected={i === index}
                onClick={() => goTo(i)}
                className={`relative px-3 py-4 text-sm font-semibold transition-colors ${
                  i === index ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {s.tab}
                {i === index && (
                  <span className="absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-primary-gradientFrom to-primary-gradientTo" />
                )}
              </button>
            ))}
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-gray-100" aria-hidden="true">
            <div
              className="h-full bg-gradient-to-r from-primary-gradientFrom to-primary-gradientTo"
              style={{ width: `${progress}%`, transition: 'width 80ms linear' }}
            />
          </div>

          {/* Body */}
          <div className="grid items-start gap-7 p-6 sm:p-8 lg:grid-cols-[.8fr_1.2fr]">
            {/* Copy */}
            <div className="flex min-h-[24rem] flex-col justify-start">
              <span className="text-xs font-bold uppercase tracking-[0.11em] text-primary">{slide.eyebrow}</span>
              <h3 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl">
                {slide.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-600">{slide.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {slide.evidence.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-primary/20 bg-primary-light px-3 py-1.5 text-xs font-semibold text-primary-dark"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-gray-200 border-l-4 border-l-primary bg-white px-4 py-3 text-sm leading-relaxed text-gray-700">
                {slide.outcome}
              </div>
            </div>

            {/* Image stage */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-3">
              <div className="flex items-center justify-between px-1 pb-2 text-[11px] text-gray-400">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-gray-300" />
                  <span className="h-2 w-2 rounded-full bg-gray-300" />
                  <span className="h-2 w-2 rounded-full bg-gray-300" />
                </div>
                <span className="font-medium">{slide.tab} · sqlperformance.ai</span>
              </div>
              <div className="relative h-[18rem] overflow-hidden rounded-xl border border-gray-200 bg-white sm:h-[22rem] lg:h-[26rem]">
                <Image
                  key={slide.image}
                  src={slide.image}
                  alt={slide.alt}
                  width={slide.width}
                  height={slide.height}
                  priority={index === 0}
                  sizes="(min-width: 1024px) 700px, 100vw"
                  className="block h-full w-full object-contain"
                />
                {slide.callouts.map((c) => (
                  <div
                    key={c.text}
                    className="pointer-events-none absolute z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/20 bg-gray-900/90 px-2.5 py-1.5 text-xs font-semibold text-white shadow-lg sm:flex"
                    style={{ left: `${c.x}%`, top: `${c.y}%` }}
                  >
                    <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_0_4px_rgba(14,138,157,0.25)]" />
                    {c.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-3 gap-2.5 border-t border-gray-100 p-4 sm:grid-cols-6 sm:px-8 sm:pb-7">
            {slides.map((s, i) => (
              <button
                key={s.tab}
                type="button"
                aria-current={i === index}
                onClick={() => goTo(i)}
                className={`grid gap-1.5 rounded-xl border bg-white p-2 text-left text-xs font-semibold transition-all ${
                  i === index
                    ? 'border-primary text-gray-900 ring-2 ring-primary/20'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <span className="relative block aspect-[16/9] overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                  <Image src={s.image} alt="" fill sizes="180px" className="object-cover" />
                </span>
                <span className="truncate">
                  {String(i + 1).padStart(2, '0')} · {s.tab}
                </span>
              </button>
            ))}
          </div>

          {/* Navigation controls */}
          <div className="flex items-center justify-center gap-3 border-t border-gray-100 px-4 pb-6 pt-5 sm:px-8">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold text-gray-500">
              {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          </div>
        </section>

        <p className="mt-6 text-center text-xs font-medium text-white/85">
          Evidence used: Query Store + Execution Plan + Wait Statistics + Metadata
        </p>
      </div>
    </section>
  )
}
