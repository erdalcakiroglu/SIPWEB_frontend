import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Calendar,
  Check,
  Clock,
  Database,
  Gauge,
  Layers,
  Shield,
} from 'lucide-react'

/**
 * Long-form module descriptions for /features.
 *
 * Every claim here has to be traceable to the module's own documentation page
 * under app/docs/. The page previously carried only the eight short cards in
 * components/Features.tsx, which read as thin content: 478 impressions at an
 * average position of 57 with zero clicks. This section is what gives the page
 * something to rank with, and each entry links through to its docs page so the
 * commercial page passes authority into the docs tree rather than dead-ending.
 */
type ModuleDetail = {
  icon: typeof Gauge
  name: string
  href: string
  body: string[]
  signals: string[]
}

const moduleDetails: ModuleDetail[] = [
  {
    icon: Gauge,
    name: 'Dashboard',
    href: '/docs/modules/dashboard',
    body: [
      'Dashboard shows a snapshot of the active connection: CPU, memory, workload, storage I/O, and TempDB pressure, refreshed on demand or with optional auto-refresh. Key health metrics are rated against thresholds rather than left as raw numbers. It is built for the first minute of an investigation — read the current state, find the pressure area, then open the module that explains it.',
      'A read-only Configuration Audit compares server settings with operational best practices and shows the current value, the recommended value, and the evidence behind each finding.',
      'Nothing is collected while the desktop application is closed. Every figure on the screen was read from the server at the moment you asked for it.',
    ],
    signals: [
      'Server health and CPU pressure',
      'Memory health and buffer pool condition',
      'IO latency and TempDB contention',
      'Workload and active session pressure',
      'Configuration best-practice audit',
    ],
  },
  {
    icon: BarChart3,
    name: 'Query Statistics',
    href: '/docs/modules/query-statistics',
    body: [
      'Query Statistics is where query performance analysis starts: it ranks queries for the selected database by impact score (the default), average duration, total CPU, execution count, logical reads, or risk score, then lets you open the source and the execution plan from the same card. Each query carries a trend against the previous window and a plan-stability signal that reflects how many plans it has, so a query that got slower after a plan change is visible without hand-writing a DMV query. From the same card you can continue into Wait Statistics, Index Advisor, or Object Explorer with that query as context.',
      'Deterministic scoring comes first. AI interpretation is optional, runs against a single query or a selected batch of up to ten, and produces a tuning report you can export and hand to someone else.',
    ],
    signals: [
      'Ranking by impact, duration, CPU, reads, or risk',
      'Execution plan and source inspection',
      'Trend, risk score, and plan-stability signals',
      'Context links into waits, indexes, and objects',
      'Exportable AI tuning reports',
    ],
  },
  {
    icon: Layers,
    name: 'Index Advisor',
    href: '/docs/modules/index-advisor',
    body: [
      'Index Advisor is index review and maintenance planning, not a dump of the missing-index DMVs. It classifies each index deterministically, shows Query Store evidence for the index you select, and separates what should be kept, maintained, validated, or considered for removal.',
      'Drop safety is treated as a signal in its own right: before an index is put forward for removal, the usage evidence behind that suggestion is shown alongside it. Optional AI interpretation adds context; it never applies a change.',
    ],
    signals: [
      'Deterministic index classification',
      'Query Store evidence for the selected index',
      'Drop-safety assessment before removal advice',
      'Maintenance planning across the database',
    ],
  },
  {
    icon: AlertTriangle,
    name: 'Blocking Analysis',
    href: '/docs/modules/blocking-analysis',
    body: [
      'Blocking Analysis discovers the full blocking chain and ranks head blockers, so the session you act on is the actual root of the contention rather than the loudest victim. A live topology graph, session-level SQL, lock and impact detail, and a timeline captured by the application sit in the same view. The module is read-only: it never terminates a session.',
      'While you are connected, a background check keeps watching for new blocking and raises an in-app alert — optionally a webhook — even when another module is open. When the incident is over the evidence exports as a structured report and CSV snapshots, which is what matters when the question the next morning is what happened and who was affected.',
    ],
    signals: [
      'Blocking chain discovery and head-blocker ranking',
      'Live topology graph and session impact detail',
      'Background blocking alerts with optional webhook',
      'Application-captured incident timeline',
      'Exportable incident evidence',
    ],
  },
  {
    icon: Clock,
    name: 'Wait Statistics',
    href: '/docs/modules/wait-statistics',
    body: [
      'Wait Statistics shows the wait time accumulated since your previous refresh (or the cumulative counters when no recent snapshot exists) next to the sessions that are waiting right now, so a dominant wait category can be traced to real work instead of read as an abstract percentage. Each top wait carries its category, its signal and resource split, and a short next-step hint to help tell a symptom from a cause.',
      'A daily trend (from Query Store, or from local history when Query Store has no wait data) shows whether a pattern is new or growing, and a saved baseline or before/after snapshots measure the effect of a change. Opened from a query in Query Statistics, the module shows that query\’s own Query Store wait categories and correlates them with its execution plan.',
    ],
    signals: [
      'Wait categories (delta or cumulative) with active waiters',
      'Saved-baseline and before/after comparison',
      'Blocking-chain correlation',
      'Query-plan context for a single query\’s waits',
    ],
  },
  {
    icon: Shield,
    name: 'Security Audit',
    href: '/docs/modules/security-audit',
    body: [
      'Security Audit collects server-level and current-database security signals and turns them into structured findings with severity counts, a login inventory, patch status, and an overall maturity level and score. An Access Matrix lists direct permission assignments per user and exports to Excel.',
      'The whole review is read-only: it reports exposure, it does not remediate it. Findings export with CIS, ISO 27001, and NIST 800-53 references where they exist, which is usually what a remediation plan needs. The product reports exposure; it does not certify compliance with any framework.',
    ],
    signals: [
      'Risky permissions and login inventory',
      'Server and database configuration exposure',
      'Patch status and severity breakdown',
      'Maturity score with exportable findings',
      'Access Matrix of direct permissions (XLSX export)',
    ],
  },
  {
    icon: Calendar,
    name: 'Scheduled Jobs',
    href: '/docs/modules/scheduled-jobs',
    body: [
      'Scheduled Jobs is an interactive review surface for SQL Server Agent: job status, recent runs, step-level failures, failure groupings that make a repeating problem obvious, and Database Mail issues that would otherwise quietly hide a broken notification path.',
      'Jobs are never executed and SQL Agent configuration is never modified. You inspect the evidence and decide what to do with it.',
    ],
    signals: [
      'Job outcomes and recent run history',
      'Step-level failure evidence',
      'Alert-oriented failure grouping',
      'Database Mail delivery problems',
    ],
  },
  {
    icon: Database,
    name: 'Object Explorer',
    href: '/docs/modules/object-explorer',
    body: [
      'Object Explorer is the read-oriented browsing surface for the selected database. Locate a procedure, view, function, or table, inspect its definition, review cached execution statistics, and trace dependencies before anything is changed.',
      'Relations draws a primary key / foreign key diagram for tables, flagging foreign keys without a supporting index, and a dependency map for procedures, views, functions, and triggers showing what each object reads, writes, and is used by. Dynamic SQL and temp tables are not tracked, and the diagram says so.',
      'AI Tune can be launched from an object once the surrounding evidence is already in front of you, so interpretation follows inspection instead of standing in for it. A batch queue runs AI Tune over several selected objects in sequence and writes the reports to a folder you choose.',
    ],
    signals: [
      'Procedures, views, tables, and definitions',
      'Cached execution statistics per object',
      'PK/FK diagrams and dependency maps',
      'AI Tune per object or as a batch queue',
    ],
  },
]

/**
 * Problem list for the "What can you diagnose?" section. Labels lead with the
 * problem as a DBA would search for it; links go to the most specific page we
 * have for that problem — a real use-case write-up where one exists, the module
 * documentation otherwise. Kept deliberately un-linked where the natural target
 * is already linked from an adjacent entry, so the section reads as coverage,
 * not as a link farm.
 */
type DiagnosableProblem = {
  label: string
  href?: string
  linkText?: string
}

const diagnosableProblems: DiagnosableProblem[] = [
  {
    label: 'Slow or high-impact queries',
    href: '/docs/modules/query-statistics',
    linkText: 'query performance analysis',
  },
  {
    label: 'Query Store plan regressions',
    href: '/use-cases/query-regression-after-plan-change',
    linkText: 'a regression traced end to end',
  },
  {
    label: 'Blocking chains and head blockers',
    href: '/use-cases/blocking-storm-head-blocker',
    linkText: 'a blocking storm case',
  },
  {
    label: 'PAGEIOLATCH, CXPACKET, SOS_SCHEDULER_YIELD and other waits',
    href: '/guides/sql-server-wait-statistics',
    linkText: 'the wait statistics guide',
  },
  {
    label: 'Missing, redundant, or risky indexes',
    href: '/use-cases/pageiolatch-waits-missing-index',
    linkText: 'a missing-index case',
  },
  {
    label: 'Stored procedure performance problems',
    href: '/use-cases/optional-filter-non-sargable-procedure',
    linkText: 'a non-SARGable procedure case',
  },
  {
    label: 'Excessive CPU, logical reads, and TempDB pressure',
  },
  {
    label: 'SQL Agent job failures and broken notification paths',
  },
  {
    label: 'Security and configuration risks',
  },
]

export default function ModuleDetails() {
  return (
    <>
      <section className="border-y border-gray-200 bg-gray-50 px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Module by module</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              What each module analyzes
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              Eight investigation surfaces, all of them read-only. Each one links through to its full documentation,
              with screenshots of the real interface and the limits that apply to it.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {moduleDetails.map(({ icon: Icon, name, href, body, signals }) => (
              <article
                key={name}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8"
              >
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
                </div>

                {body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="mb-4 text-sm leading-6 text-gray-600">
                    {paragraph}
                  </p>
                ))}

                <ul className="mb-6 mt-2 space-y-2.5">
                  {signals.map((signal) => (
                    <li key={signal} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-light">
                        <Check className="h-3 w-3 text-primary-dark" strokeWidth={3} />
                      </span>
                      {signal}
                    </li>
                  ))}
                </ul>

                <Link
                  href={href}
                  className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
                >
                  Read the {name} documentation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Added 2026-09-15 (GSC-driven strengthening). Two goals: (1) support the
          "sql server performance diagnosis" query family with problem-oriented
          copy while pointing the HOW intent at the diagnose guide — /features
          says WHAT can be diagnosed, the guide says HOW, so the two do not
          cannibalize; (2) give every listed problem a contextual internal link
          into the guides/use-cases/docs tree. */}
      <section className="bg-white px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Problem coverage</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              What SQL Server performance problems can you diagnose?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              Each problem below maps to a module and, where one exists, to a written-up real investigation. For the
              method itself — the order to check things in and why — read{' '}
              <Link
                href="/guides/diagnose-sql-server-performance-problems"
                className="font-semibold text-primary hover:text-primary-dark"
              >
                how to diagnose SQL Server performance problems
              </Link>
              .
            </p>
          </div>

          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {diagnosableProblems.map(({ label, href, linkText }) => (
              <li key={label} className="flex items-start gap-3 text-sm leading-6 text-gray-700">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-light">
                  <Check className="h-3 w-3 text-primary-dark" strokeWidth={3} />
                </span>
                <span>
                  {label}
                  {href ? (
                    <>
                      {' — '}
                      <Link href={href} className="font-semibold text-primary hover:text-primary-dark">
                        {linkText}
                      </Link>
                    </>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50 px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">The category</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
            What is a SQL Server performance analyzer?
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-gray-600">
            <p>
              A SQL Server performance analyzer examines runtime evidence — query statistics, execution plans, wait
              statistics, blocking chains, index usage, and server conditions — to help determine why a workload is
              slow. It is an investigation tool: its output is a diagnosis backed by evidence, not a change applied
              to the server.
            </p>
            <p>
              SQLPerformance AI performs this analysis on demand over a read-only connection. There is no monitoring
              agent to install and nothing is collected while the application is closed; the eight modules above are the analyzer&apos;s
              investigation surfaces, and optional AI interpretation turns their evidence into an exportable report.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Where this fits</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
            An analyzer, not a monitoring agent
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-gray-600">
            <p>
              Most SQL Server performance products are collectors. They install an agent, poll the instance on a
              schedule, ship the results to a central store, and charge by instance. That design answers what happened
              at three in the morning last Tuesday, and wanting that answer is entirely reasonable.
            </p>
            <p>
              This is a different tool. It is a Windows desktop analyzer that reads what the server can tell it
              now, while you are connected. No agent is installed on the server, nothing runs after you close the
              application, it sends no usage telemetry, and no schema, index, job, or data change is ever applied for you.
            </p>
            <p>
              So the two are not really substitutes. If you need continuous alerting across an estate, keep your
              monitoring platform. This is what you open once the alert has fired and somebody has to work out why —
              and produce evidence the rest of the team can check.
            </p>
          </div>
          <Link
            href="/security"
            className="mt-8 inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            How the read-only guarantee works
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
