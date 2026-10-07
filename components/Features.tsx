import Link from 'next/link'
import { Database, BarChart3, Layers, Shield, AlertTriangle, Clock, Calendar, Gauge, ArrowRight } from 'lucide-react'

// `href` points at the module's own documentation page: every card maps to a
// /docs/modules/<slug> route. The former "Evidence Report" card (cross-module
// export, linked to the fabricated /sample-report page) was replaced by a
// Dashboard card on 2026-10-04; Dashboard is a real module that had no card.
const features = [
  {
    icon: Database,
    title: 'Object Explorer',
    description: 'Inspect stored procedures, definitions, dependencies, and available execution evidence before requesting optional AI interpretation.',
    tag: 'Object Investigation',
    category: 'developer',
    href: '/docs/modules/object-explorer',
  },
  {
    icon: BarChart3,
    title: 'Query Statistics',
    description: 'Rank Query Store queries by impact, duration, CPU, reads or risk, and see plan changes and AI tuning reports in one place.',
    tag: 'Context-Aware',
    category: 'developer',
    href: '/docs/modules/query-statistics',
  },
  {
    icon: Layers,
    title: 'Index Advisor',
    description: 'Context-aware review of your existing indexes: duplicates, overlaps, and how safe each one is to drop.',
    tag: 'Evidence-Based',
    category: 'developer',
    href: '/docs/modules/index-advisor',
  },
  {
    icon: Gauge,
    title: 'Dashboard',
    description: 'Refresh a snapshot of CPU, memory, workload, storage I/O, and TempDB pressure on demand or with optional auto-refresh, with key health metrics rated against thresholds.',
    tag: 'Health Snapshot',
    category: 'developer',
    href: '/docs/modules/dashboard',
  },
  {
    icon: Clock,
    title: 'Wait Statistics',
    description: 'Analyze wait types (PAGEIOLATCH, CXPACKET, SOS_SCHEDULER_YIELD) and compare trends with baseline snapshots.',
    tag: 'Baseline Tracking',
    category: 'ops',
    href: '/docs/modules/wait-statistics',
  },
  {
    icon: AlertTriangle,
    title: 'Blocking Analysis',
    description: 'Identify root blocking sessions and reduce production impact.',
    tag: 'Timeline View',
    category: 'ops',
    href: '/docs/modules/blocking-analysis',
  },
  {
    icon: Shield,
    title: 'Security Audit',
    description: 'Review SQL Server configuration risks and permission exposure. Findings carry CIS, ISO 27001, and NIST 800-53 references.',
    tag: 'Framework References',
    category: 'ops',
    href: '/docs/modules/security-audit',
  },
  {
    icon: Calendar,
    title: 'Scheduled Jobs',
    description: 'Inspect SQL Agent job outcomes, recent failures, runtimes, step evidence, and Database Mail signals on demand.',
    tag: 'Interactive Triage',
    category: 'ops',
    href: '/docs/modules/scheduled-jobs',
  },
]

function FeatureCard({ feature }: { feature: (typeof features)[number] }) {
  return (
    <Link
      href={feature.href}
      className="group flex h-full flex-col rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg"
    >
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
        <feature.icon className="h-5 w-5" />
      </div>
      <h3 className="mb-2 text-base font-semibold text-gray-900">{feature.title}</h3>
      <p className="mb-4 flex-grow text-sm leading-relaxed text-gray-600">{feature.description}</p>
      <span className="mt-auto flex items-center justify-between gap-3">
        <span className="inline-block rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
          {feature.tag}
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
      </span>
    </Link>
  )
}

export default function Features() {
  const developerFeatures = features.filter((feature) => feature.category === 'developer')
  const opsFeatures = features.filter((feature) => feature.category === 'ops')

  return (
    <section id="features" className="relative overflow-hidden bg-white px-6 pt-12 pb-20 lg:px-10">
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Developer Toolkit */}
        <div>
          <div className="mb-6">
            {/* h2/h3, not h3/h4: the page goes h1 -> these section headings -> the
                cards, and skipping a level breaks the outline for screen readers
                and for how search engines read page structure. Styling lives in
                the classes, so the tag change is visually inert. */}
            <h2 className="text-lg font-bold text-gray-900">
              Core Performance Toolkit <span className="font-medium text-gray-400">· Developer-first</span>
            </h2>
          </div>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-gray-600">
            Everything you need to tune stored procedures and analyze query performance.
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {developerFeatures.map((feature, index) => (
              <FeatureCard key={`dev-${index}`} feature={feature} />
            ))}
          </div>
        </div>

        {/* Ops & Compliance */}
        <div className="mt-16">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Interactive Production Triage <span className="font-medium text-gray-400">· DBA-ready</span>
            </h2>
          </div>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-gray-600">
            On-demand investigation workflows for DBA and operations teams. The desktop app analyzes the active connection;
            it is not a monitoring service or a centralized alerting platform, and nothing runs once you close it.
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {opsFeatures.map((feature, index) => (
              <FeatureCard key={`ops-${index}`} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
