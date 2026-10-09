import Link from 'next/link'
import { ArrowRight, Check, ExternalLink, X } from 'lucide-react'

/**
 * /docs/discover: why a DBA or developer would use the product, shown through
 * role scenarios and the real reports the app exports.
 *
 * Kept deliberately apart from its neighbours so the pages do not compete:
 * /docs/overview owns prerequisites, Query Store, AI setup and what leaves the
 * machine; /features owns the module list; /security owns data handling;
 * /use-cases owns long scenarios. Sections 01, 03 and 05 therefore stay short
 * and link out, and the weight of the page is on 02 (role scenarios) and 04
 * (report gallery), which no other page has.
 *
 * Every number below is quoted from the linked sample report or from a module
 * page that was verified against the v1.1.0 application. Do not add a claim
 * here without checking it in the app code or in the report it cites.
 */

const linkClass = 'font-semibold text-primary hover:text-primary-dark'

const sections = [
  { id: 'why', number: '01', title: 'Why SQLPerformance AI?' },
  { id: 'roles', number: '02', title: 'Built for DBAs and Developers' },
  { id: 'evidence', number: '03', title: 'From Evidence to Action' },
  { id: 'reports', number: '04', title: 'Explore Real Analysis Reports' },
  { id: 'production', number: '05', title: 'Designed for Production Servers' },
]

const sqlServerGives = [
  'Query Store: plans and runtime history per query.',
  'Dynamic management views: waits, sessions, locks, index usage.',
  'Graphical execution plans in SSMS.',
  'SQL Agent job history in msdb.',
]

const productAdds = [
  {
    label: 'Ranking',
    text: 'Queries ordered by Impact Score (total elapsed time), with a 0-100 risk score, a trend, and the ratio between the slowest and fastest plan.',
  },
  {
    label: 'Stated rules',
    text: 'Index drop-safety states, blocking severity bands, and a scored security audit, each with documented thresholds.',
  },
  {
    label: 'Cross-checks',
    text: 'Reports list the signals they checked and set aside, for example a missing-index suggestion that does not match the query.',
  },
  {
    label: 'Reports',
    text: 'HTML and Markdown exports with evidence tables and read-only verification queries your team can review.',
  },
  {
    label: 'Optional AI',
    text: 'An AI explanation in three modules, built on top of the rule-based result rather than replacing it.',
  },
]

type Scenario = {
  question: string
  module: string
  href: string
  answer: string
}

const dbaScenarios: Scenario[] = [
  {
    question: 'Which queries cost the most, and which ones got worse?',
    module: 'Query Statistics',
    href: '/docs/modules/query-statistics',
    answer:
      'Ranks queries from Query Store, or from the plan cache when Query Store is not usable, and shows the trend and plan stability of each one.',
  },
  {
    question: 'Users say the application is frozen.',
    module: 'Blocking Analysis',
    href: '/docs/modules/blocking-analysis',
    answer:
      'Shows live blocking chains as a graph and a tree, the head blocker and its statement, and a severity based on wait time. It does not kill sessions.',
  },
  {
    question: 'The server is slow and nothing stands out.',
    module: 'Wait Statistics',
    href: '/docs/modules/wait-statistics',
    answer:
      'Groups waits into categories, measures them as the difference between two snapshots, and adds Query Store wait history where it is available.',
  },
  {
    question: 'Can I drop this index?',
    module: 'Index Advisor',
    href: '/docs/modules/index-advisor',
    answer:
      'Gives each index a class, a score, and a drop-safety state: Do Not Drop, Validate Before Drop, or Safe Drop Candidate. A DROP script is never generated for the first two.',
  },
  {
    question: 'An auditor asks for evidence.',
    module: 'Security Audit',
    href: '/docs/modules/security-audit',
    answer:
      'Scores logins, permissions, configuration, and patch level, lists findings by severity, and saves the result as an HTML report.',
  },
  {
    question: 'A job failed overnight.',
    module: 'Scheduled Jobs',
    href: '/docs/modules/scheduled-jobs',
    answer:
      'Groups SQL Agent failures from the last 24 hours by root cause and shows schedules and Database Mail health from msdb.',
  },
]

const developerScenarios: Scenario[] = [
  {
    question: 'Fast in my tests, slow in production.',
    module: 'Query Statistics',
    href: '/docs/modules/query-statistics',
    answer:
      'Compares the plans Query Store kept for one query. In a sample report, one procedure had a plan averaging 0.08 ms and another averaging 6.95 s.',
  },
  {
    question: 'What is this execution plan telling me?',
    module: 'Query Statistics',
    href: '/docs/modules/query-statistics',
    answer:
      'The Execution Plan tab lists operators, plan warnings, and missing-index suggestions. AI reports check a suggestion against the query before recommending it.',
  },
  {
    question: 'Review a stored procedure before release.',
    module: 'Object Explorer',
    href: '/docs/modules/object-explorer',
    answer:
      'Shows source code, statistics, and dependencies. AI Tune sends the source and its plan to the AI provider you configure and returns a report.',
  },
  {
    question: 'Did my fix actually help?',
    module: 'Use case',
    href: '/use-cases/optional-filter-non-sargable-procedure',
    answer:
      'Run the analysis again after the change. In this use case RECOMPILE cut reads by 95%, and the re-analysis still showed that the design was the real cost.',
  },
]

const traceSteps = [
  {
    step: 'Evidence',
    source: 'Read from SQL Server',
    text: 'sys.dm_db_index_usage_stats shows 0 seeks, 0 scans, 0 lookups, and 0 updates for ix_Cities_Archive. The table has 28 rows on one page, the statistics are 3,772 days old, and there is no Query Store context.',
  },
  {
    step: 'Rule-based result',
    source: 'Computed by the app',
    text: 'Classification UNNECESSARY, score 41/100. Drop safety VALIDATE_BEFORE_DROP. Because there is no 14-day usage baseline, the validation gate suppresses executable index DDL.',
  },
  {
    step: 'AI explanation',
    source: 'Optional, your provider',
    text: 'Explains the result and its caveats: DMV counters reset after a restart or failover, so zero reads over a short window can be a false negative. The report states that the rule-based classification is explained, not overridden.',
  },
  {
    step: 'Independent review',
    source: 'Second AI pass',
    text: 'A critic pass reviews the proposed actions before they reach the report. Here: 2 approved, 0 revised, 0 rejected.',
  },
  {
    step: 'Your decision',
    source: 'You run it, or not',
    text: 'Two next steps: refresh the statistics with one UPDATE STATISTICS command, and monitor usage for 14 days before any drop decision. The report adds read-only verification queries. The app does not run any of them.',
  },
]

type Report = {
  module: string
  title: string
  href: string
  points: string[]
  source: string
}

const reports: Report[] = [
  {
    module: 'Query Statistics',
    title: 'Plan regression and row-by-row cursor',
    href: '/docs/querystatistics/AI_Report_20261004_125431',
    points: [
      'Two Query Store plans for one procedure: 0.08 ms and 2 logical reads versus 6.95 s and 5.72 million.',
      'A missing-index candidate checked against the query and cleared as unrelated.',
      'Server-level pressure ruled out with CPU, page life expectancy, and buffer cache figures.',
    ],
    source: 'AI report · WideWorldImporters demo · earlier build, 2026-10-04',
  },
  {
    module: 'Object Explorer',
    title: 'Key Lookups in a stored procedure',
    href: '/docs/object-explorer/AI_Report_Demo.usp_Test_01_ParameterSniffing_20261004_131853',
    points: [
      'Key Lookups on two order tables traced to columns the index does not cover.',
      'A covering index proposal with a verification script and its rollback statement.',
      'The safety review marks the CREATE INDEX as a write action that needs DBA review.',
    ],
    source: 'AI report · WideWorldImporters demo · earlier build, 2026-10-04',
  },
  {
    module: 'Index Advisor',
    title: 'Unused index behind the validation gate',
    href: '/docs/index-advisor/index_advisor_ai_analysis_02',
    points: [
      'Zero reads, but drop safety stays at Validate Before Drop.',
      'Executable DDL suppressed; only a statistics refresh and 14 days of monitoring.',
      'An evidence table with the weight and caveat of each signal.',
    ],
    source: 'AI report · WideWorldImporters demo · earlier build, 2026-10-04',
  },
  {
    module: 'Security Audit',
    title: 'Scored security audit',
    href: '/docs/security-audit/security_audit_20261007_131752.html',
    points: [
      'Maturity level L3 / 5 and score 71 / 100 with a per-category breakdown.',
      '22 issues by severity, patch status (558 days behind), surface area, and the login list.',
      'Rule-based: no AI provider is involved.',
    ],
    source: 'HTML export · v1.1.0 · server, login, and database names are fictional',
  },
  {
    module: 'Dashboard',
    title: 'Configuration audit',
    href: '/docs/dashboard/config_audit_20261007_143414.html',
    points: [
      'Twenty checks with Severity, Category, Finding, Current, Recommended, and Action.',
      'Counters: 0 Critical, 1 Warning, 8 Info, 11 Pass.',
      'Read-only: it reads configuration and system views.',
    ],
    source: 'HTML export · v1.1.0 · server and database names are fictional',
  },
  {
    module: 'Wait Statistics',
    title: 'Wait statistics export',
    href: '/docs/wait-statistics/wait_stats_export_20261007_151552',
    points: [
      'Wait time by category: CPU holds 5,441 of the 6,647 ms, and CXPACKET leads the top waits.',
      'Signatures with a confidence: CPU Pressure at 0.95.',
      'An eight-day trend with the dominant category per day. No AI provider is involved.',
    ],
    source: 'HTML export · v1.1.0 · test instance',
  },
]

const doesList = [
  'Reads dynamic management views, catalog views, Query Store, and msdb.',
  'Generates scripts for you to review, copy, and run yourself.',
  'Checks AI-suggested SQL with SET PARSEONLY ON, so SQL Server checks the syntax without running it.',
  'Uses a local Ollama model by default; a cloud provider is used only if you configure one.',
]

const doesNotList = [
  'Run the scripts it generates or apply AI recommendations.',
  'Kill sessions. Blocking Analysis shows the head blocker; you decide what to do.',
  'Install agents or collectors on your SQL Server hosts.',
  'Send anything to an AI provider before you start an AI analysis.',
]

function SectionHeading({ id, number, title, lead }: { id: string; number: string; title: string; lead: string }) {
  return (
    <div className="mb-5">
      <div className="text-xs font-semibold uppercase tracking-wide text-primary">{number}</div>
      <h2 id={id} className="mt-1 scroll-mt-28 text-2xl font-bold tracking-tight text-gray-900">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-gray-700">{lead}</p>
    </div>
  )
}

function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm font-semibold text-gray-900">&ldquo;{scenario.question}&rdquo;</p>
      <p className="mt-2 flex-1 text-sm leading-6 text-gray-700">{scenario.answer}</p>
      <Link
        href={scenario.href}
        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark"
      >
        {scenario.module}
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  )
}

export default function DiscoverTemplate() {
  return (
    <div className="space-y-12">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm leading-6 text-gray-700">
          SQLPerformance AI is a read-only Windows desktop app for SQL Server performance analysis. This page shows
          what it does for a DBA and for a developer, and what its output looks like. For prerequisites, permissions,
          and AI setup, read the{' '}
          <Link href="/docs/overview" className={linkClass}>
            Overview
          </Link>
          .
        </p>
        <nav aria-label="On this page" className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition-colors hover:border-primary hover:text-gray-900"
            >
              <span className="font-mono text-xs font-semibold text-primary">{section.number}</span>
              <span>{section.title}</span>
            </a>
          ))}
        </nav>
      </div>

      <section>
        <SectionHeading
          id="why"
          number="01"
          title="Why SQLPerformance AI?"
          lead="SQL Server already records most of what you need to diagnose a slow server, and SSMS gives you direct access to it. What it leaves to you is the reading: which of hundreds of queries matters, whether two plans for one query are a problem, whether an index with no reads is safe to drop. The app reads the same sources and does that first pass for you."
        />
        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">SQL Server and SSMS give you</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {sqlServerGives.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-gray-400" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-primary/30 bg-primary-light/40 p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary-dark">SQLPerformance AI adds</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {productAdds.map((item) => (
                <li key={item.label}>
                  <strong className="text-gray-900">{item.label}:</strong> {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-gray-700">
          It does not replace SSMS. You still make every change yourself, in SSMS or through your deployment process.
          The{' '}
          <Link href="/features" className={linkClass}>
            feature overview
          </Link>{' '}
          lists what each of the eight modules analyzes.
        </p>
      </section>

      <section>
        <SectionHeading
          id="roles"
          number="02"
          title="Built for DBAs and Developers"
          lead="The same modules answer different questions depending on who is asking. Each card names the module to open and links to its documentation."
        />
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">For DBAs</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dbaScenarios.map((scenario) => (
                <ScenarioCard key={scenario.question} scenario={scenario} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">For developers</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {developerScenarios.map((scenario) => (
                <ScenarioCard key={scenario.question} scenario={scenario} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionHeading
          id="evidence"
          number="03"
          title="From Evidence to Action"
          lead="One finding from a real Index Advisor report, traced from the raw counters to the decision left to you. AI is optional: without a provider, the rule-based result in step 2 is what you get."
        />
        <ol className="relative space-y-4 border-l-2 border-primary/30 pl-6">
          {traceSteps.map((item, index) => (
            <li key={item.step} className="relative">
              <span
                className="absolute -left-[37px] top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">{item.step}</h3>
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-500">{item.source}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-700">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm leading-6 text-gray-700">
          The full report is the third card in the gallery below. The{' '}
          <Link href="/docs/modules/index-advisor" className={linkClass}>
            Index Advisor documentation
          </Link>{' '}
          lists the drop-safety criteria behind step 2.
        </p>
      </section>

      <section>
        <SectionHeading
          id="reports"
          number="04"
          title="Explore Real Analysis Reports"
          lead="These files were exported from the app. Judge the output yourself: each report opens in a new tab, and the line under it says which build produced it."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {reports.map((report) => (
            <a
              key={report.href}
              href={report.href}
              target="_blank"
              rel="noopener"
              className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-primary"
            >
              <span className="w-fit rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary-dark">
                {report.module}
              </span>
              <span className="mt-3 flex items-start justify-between gap-2 text-base font-semibold text-gray-900">
                {report.title}
                <ExternalLink
                  className="mt-1 h-4 w-4 flex-none text-gray-400 group-hover:text-primary"
                  aria-hidden="true"
                />
              </span>
              <ul className="mt-3 flex-1 list-disc space-y-1 pl-5 text-sm text-gray-700">
                {report.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <span className="mt-4 text-xs text-gray-500">{report.source}</span>
            </a>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-gray-700">
          The three AI reports were generated on 2026-10-04 with a build before 1.1.0 against a test database built on
          the WideWorldImporters sample. Each module page has more examples:{' '}
          <Link href="/docs/modules/query-statistics" className={linkClass}>
            Query Statistics
          </Link>
          ,{' '}
          <Link href="/docs/modules/object-explorer" className={linkClass}>
            Object Explorer
          </Link>
          ,{' '}
          <Link href="/docs/modules/index-advisor" className={linkClass}>
            Index Advisor
          </Link>
          , and{' '}
          <Link href="/docs/modules/blocking-analysis" className={linkClass}>
            Blocking Analysis
          </Link>
          .
        </p>
      </section>

      <section>
        <SectionHeading
          id="production"
          number="05"
          title="Designed for Production Servers"
          lead="The app is built to be safe to point at a production instance. What it does and what it does not do:"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">It does</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {doesList.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">It does not</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {doesNotList.map((item) => (
                <li key={item} className="flex gap-2">
                  <X className="mt-0.5 h-4 w-4 flex-none text-gray-400" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-gray-700">
          What each AI-enabled module sends, and to whom, is on the{' '}
          <Link href="/security" className={linkClass}>
            Trust &amp; Security page
          </Link>
          . The minimum SQL Server permissions are in the{' '}
          <Link href="/docs/overview" className={linkClass}>
            Overview
          </Link>
          .
        </p>
      </section>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Where to go next</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            { href: '/docs/overview', title: 'Overview', text: 'Prerequisites, Query Store, AI providers.' },
            { href: '/docs/installation', title: 'Installation', text: 'Install the app and connect a server.' },
            { href: '/use-cases', title: 'Use cases', text: 'Longer walkthroughs of real problems.' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-primary"
            >
              <span className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                {item.title}
                <ArrowRight className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              </span>
              <span className="mt-1 block text-sm text-gray-600">{item.text}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
