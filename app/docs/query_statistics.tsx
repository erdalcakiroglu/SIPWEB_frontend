import Link from 'next/link'
import LightboxImage from './LightboxImage'

const mainAreas = [
  'Filter panel: Duration, Order By, Search, Show System Queries, Show Sensitive Data, and Reset to Defaults',
  'Batch toolbar: Batch Operations, Select Top 10 by Avg CPU, Clear Selection, and the Selected counter',
  'Runtime warning line above the list (shown only when there are warnings); Query Store health is reported as a notification',
  'Paged list of query cards with a results counter and page navigation',
  'Selected Query inspector panel on the right',
]

const detailTabs = [
  'Source Code',
  'Execution Plan',
  'AI Analysis',
]

const filters = [
  'Duration: Last 3 Hours, Last 24 Hours, Last 7 Days (default), Last 14 Days, Last 30 Days, or Last 90 Days',
  'Order By: Impact Score (default), Average Duration, Total CPU, Execution Count, Logical Reads, or Risk Score',
  'Search: filters the loaded page by query name, object name, schema.object, or query text; typing 3 or more characters also searches all queries on the server',
]

const batchActions = [
  'Analyze Selected with AI',
  'Export Selected to CSV',
  'Compare Selected Queries',
]

const reportDownloads = [
  {
    name: 'Plan regression and row-by-row cursor',
    meta: 'DataLoadSimulation.InvoicePickedOrders · Medium risk · P1',
    href: '/docs/querystatistics/AI_Report_20261004_125431',
    summary: 'Two plans, a fast one averaging 0.08 ms and a slow one averaging about 7 s, plus a cursor-driven procedure. Two recommendations, both approved by the independent critic.',
  },
  {
    name: 'Missing-index review and plan instability',
    meta: 'Demo.usp_Test_05_MissingIndex · Medium risk · P1',
    href: '/docs/querystatistics/AI_Report_20261004_143729',
    summary: 'Nine plans in seven days, an implicit conversion in an access predicate, and a missing-index candidate that the report checks against the query predicates and sets aside as unrelated. Four recommendations: 2 approved, 2 revised.',
  },
  {
    name: 'Scalar functions and plan instability',
    meta: 'Demo.usp_Test_07_ScalarUDF · High risk · P1',
    href: '/docs/querystatistics/AI_Report_20261004_144059',
    summary: 'Scalar user-defined functions in the SELECT list, eleven plans in seven days, and a missing-index signal. Three recommendations: 2 approved, 1 revised.',
  },
]

function ScreenshotCard({
  eyebrow,
  title,
  body,
  image,
  alt,
  width = 1440,
  height = 900,
}: {
  eyebrow: string
  title: string
  body: string
  image: string
  alt: string
  width?: number
  height?: number
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{eyebrow}</div>
      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm leading-7 text-gray-700">{body}</p>
        </div>
        <LightboxImage
          src={image}
          alt={alt}
          width={width}
          height={height}
          className="mx-auto max-w-6xl"
          imageClassName="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-[1.01]"
        />
      </div>
    </div>
  )
}

export default function QueryStatisticsTemplate() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Overview</div>
        <p className="text-sm text-gray-700">
          Query Statistics is the query-centric performance review module. It ranks the top queries for the current
          database from Query Store, shows deterministic impact, risk, trend, and plan-stability signals for each one,
          and lets you open any query to inspect its source code, execution plan, and AI-assisted analysis.
        </p>
        <p className="mt-3 text-sm text-gray-700">
          For SQL Server performance tuning, this is usually the best starting point after{' '}
          <Link href="/docs/installation" className="font-semibold text-primary hover:text-primary-dark">
            installation
          </Link>{' '}
          and{' '}
          <Link href="/docs/quickstart" className="font-semibold text-primary hover:text-primary-dark">
            first-time setup
          </Link>{' '}
          are complete. The module combines Query Store evidence, DMV fallback when Query Store is not usable,
          execution-plan inspection, and exportable AI analysis in a single workflow.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm text-gray-700">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What You Can Do</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Rank Query Store top queries by impact, duration, CPU, reads, executions, or risk.</li>
              <li>Inspect source code, query text, and execution plans with missing-index and warning details.</li>
              <li>Review plan stability, trend versus the previous window, and parameter-sniffing signals.</li>
              <li>Run AI analysis for one query, or for up to 10 selected queries in a batch.</li>
              <li>Export and compare queries, and jump with context into Wait Statistics, Index Advisor, or Object Explorer.</li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Best Companion Pages</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Start with{' '}
                <Link href="/docs/modules/dashboard" className="font-semibold text-primary hover:text-primary-dark">
                  Dashboard
                </Link>{' '}
                when you need fast instance-level triage.
              </li>
              <li>
                Use{' '}
                <Link href="/docs/modules/wait-statistics" className="font-semibold text-primary hover:text-primary-dark">
                  Wait Statistics
                </Link>{' '}
                for contention or wait correlation.
              </li>
              <li>
                Use{' '}
                <Link href="/docs/modules/index-advisor" className="font-semibold text-primary hover:text-primary-dark">
                  Index Advisor
                </Link>{' '}
                when a query points to indexing problems.
              </li>
              <li>
                Refer back to{' '}
                <Link href="/docs/overview" className="font-semibold text-primary hover:text-primary-dark">
                  product overview
                </Link>{' '}
                for the broader workflow across modules.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Main Screen Layout</div>
        <p className="text-sm text-gray-700">
          The main Query Statistics screen is not tab-based. It is a working list surface built around the areas below.
          The detail tabs appear only after you open a query, which replaces the list with a full-page query detail
          view.
        </p>
        <ol className="mt-4 list-decimal pl-5 text-sm text-gray-700 space-y-1">
          {mainAreas.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ol>
      </div>

      <ScreenshotCard
        eyebrow="Screen 1"
        title="Filters, Batch Toolbar, and Query List"
        body="The main screen shows the filter panel, the batch toolbar, the ranked query cards, and the Selected Query inspector. A Query Store Health notification appears when the list loads, and a warning line appears above the list when the module reports runtime warnings. Check them first to confirm whether results come from healthy Query Store data or from a degraded or DMV fallback path before interpreting the top-query ranking."
        image="/docs/querystatistics/001.png"
        alt="Query Statistics main screen showing the filter panel, batch toolbar, ranked query cards, and the Selected Query inspector"
        width={1919}
        height={863}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Data Source and Health Model</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Preferred Source</div>
            <p className="mb-3">
              The module prefers Query Store because it provides the historical depth needed for impact ranking, trend
              comparisons, plan counts, and regression signals.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-mono">sys.query_store_query</span></li>
              <li><span className="font-mono">sys.query_store_plan</span></li>
              <li><span className="font-mono">sys.query_store_runtime_stats</span></li>
              <li><span className="font-mono">sys.query_store_runtime_stats_interval</span></li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Fallback Source</div>
            <p className="mb-3">
              If Query Store is disabled, not in READ_WRITE state, not supported by the SQL Server version, or its
              queries fail or time out, the module falls back to DMV-based data with lower historical depth.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-mono">sys.dm_exec_query_stats</span></li>
              <li><span className="font-mono">sys.dm_exec_sql_text</span></li>
              <li><span className="font-mono">sys.dm_exec_query_plan</span></li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Health States</div>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-medium">GREEN</span>: Query Store has recent data; the notification includes the number of queries found.</li>
              <li><span className="font-medium">YELLOW</span>: Query Store is available but the data is stale or has partial issues.</li>
              <li><span className="font-medium">RED</span>: Query Store is disabled or non-operational (DMV fallback is used), <span className="font-mono">VIEW SERVER STATE</span> is missing, or there is no connection.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Why It Matters</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fallback mode reduces historical confidence.</li>
              <li>Missing permissions can limit source-code access or block the module entirely.</li>
              <li>A Query Store Health notification (visible for about 12 seconds) appears once per connection and database, and again after you switch connections. A warning line above the list shows the first two runtime warnings, with the full list in its tooltip.</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="font-semibold mb-1">Interpret degraded states carefully</div>
          <p>
            When the health notification or the warning line reports stale Query Store data, missing permissions, or
            DMV fallback, the module can still be useful, but historical confidence and source-code coverage may be
            lower than normal. The minimum permissions the module needs are listed at the end of this page.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Filters, Batch Controls, and Indicators</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Filter Panel</div>
            <ul className="list-disc pl-5 space-y-1">
              {filters.map((filter) => (
                <li key={filter}>{filter}</li>
              ))}
              <li><span className="font-medium">Reset to Defaults</span>: clears the saved filters for the current database, restores the defaults, and reloads the list</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Visibility Controls</div>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-medium">Show System Queries</span> is off by default, which hides system-object and catalog queries.</li>
              <li><span className="font-medium">Show Sensitive Data</span> is off by default and asks for confirmation before it is enabled for the session.</li>
              <li>Filter settings are remembered per connection and database.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Batch Toolbar</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="font-medium">Batch Operations</span> menu:{' '}
                {batchActions.map((action, index) => (
                  <span key={action}>
                    {action}
                    {index < batchActions.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </li>
              <li>Select Top 10 by Avg CPU (from the queries on the current page)</li>
              <li>Clear Selection</li>
              <li>Selected: N counter, driven by the card checkboxes</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Main Indicators</div>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-medium">Impact Score</span> is total elapsed time in seconds (average duration in ms × executions / 1000), so it reflects workload footprint, not just latency.</li>
              <li><span className="font-medium">Trend</span> compares average duration with the previous window of the same length and shows a signed percentage (positive means slower), or n/a when there is no earlier data. The arrow points up or down only beyond a 10% change (5% for queries scoring 55 or more on risk).</li>
              <li><span className="font-medium">Risk Score</span> is a deterministic 0-100 signal built from p95 latency, execution volume, CPU, reads, writes, plan instability, regression trend, and wait dominance. Levels: Critical (75+), High (55+), Medium (35+), Low (15+), Info. The tooltip lists up to four key factors.</li>
              <li><span className="font-medium">Plan Stability</span> is Stable, Attention, or Problem. List cards use a quick check on the plan count and a stability score; the detail view compares the slowest and fastest plan by average duration (3x or more is Problem, 1.5x or more is Attention). Problem cards warn about possible parameter sniffing.</li>
              <li><span className="font-medium">P95</span> is an estimate (shown as P95≈), capped at the maximum observed duration.</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Selection and Batch Rules</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Batch actions use the checkbox selection, which is kept while you move between pages.</li>
              <li>Batch AI analyzes at most 10 queries per run; if more are selected, it asks before analyzing only the first 10.</li>
              <li>Compare Selected Queries requires at least two selected queries.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Paging</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>The list shows 15 queries per page, from a ranked set of up to 5,000 queries.</li>
              <li>First, previous, numbered, next, and last page buttons sit next to the Showing X-Y of N results counter.</li>
              <li>A long load shows progress and a Cancel button.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Quick Actions and Detail Flow</div>
        <p className="mb-4 text-sm text-gray-700">
          Each result in the list on Screen 1 is a query card rather than a plain grid row. The card shows a priority
          marker, CPU or I/O tags when the query is CPU-bound or I/O-bound, average duration, estimated P95, CPU,
          executions, plan count, last execution time, impact score, trend, plan stability, and risk. Link buttons on
          the card open the query detail or jump into another module with the query as context.
        </p>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Query Card Links</div>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-medium">View</span> opens the detail view on Source Code.</li>
              <li><span className="font-medium">Plan</span> opens it on Execution Plan.</li>
              <li><span className="font-medium">AI</span> opens it on AI Analysis.</li>
              <li><span className="font-medium">Waits</span> opens Wait Statistics focused on this query&apos;s Query Store wait categories.</li>
              <li><span className="font-medium">Indexes</span> opens Index Advisor narrowed to the tables this query uses.</li>
              <li><span className="font-medium">Explorer</span> (only for queries that belong to a stored object) opens that object in Object Explorer.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Selected Query Inspector</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>A single click on a card shows it in the inspector; the first card on each page is selected automatically.</li>
              <li>The inspector shows a RISK dial, the plan-stability state, and the top risk factor.</li>
              <li>Resource profile bars show CPU, Duration, and Reads, and <span className="font-medium">Why it matters</span> summarizes impact, executions, and plan stability.</li>
              <li><span className="font-medium">Open analysis</span> opens AI Analysis; <span className="font-medium">View plan</span> opens Execution Plan.</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-700">
          Double-click a card, or press Enter on a focused card, to open the query detail on Source Code. The detail
          view shows a header with the query name, stability badge, and AI controls (AI status, Deep Analysis, Analyze
          with AI, Cancel), a summary strip (data source status, detected plan count, time window, and Risk Score), the tabs{' '}
          {detailTabs.map((tab, index) => (
            <span key={tab}>
              <span className="font-medium">{tab}</span>
              {index < detailTabs.length - 1 ? ', ' : ''}
            </span>
          ))}
          , a Query Metrics sidebar (Risk Score, Duration with P95 estimate, CPU Time, Logical Reads, Executions, and
          Plan Stability), and a one-line statistics footer. Use the Query Statistics back button, Esc, or Ctrl+W to
          return to the list.
        </p>
      </div>

      <ScreenshotCard
        eyebrow="Screen 2"
        title="Query Detail: Source Code Tab"
        body="Opening a query replaces the list with the detail view. The header carries the query name, a stability badge, and the AI controls; the summary strip shows the data source status, the number of plans detected, and the risk score; and the Query Metrics sidebar summarizes risk, duration, CPU, reads, executions, and plan stability. The Source Code tab shows the object definition in a read-only, syntax-highlighted editor with Copy SQL and Export .sql."
        image="/docs/querystatistics/002.png"
        alt="Query Statistics detail view on the Source Code tab showing the header with AI controls, the summary strip, the read-only SQL editor, and the Query Metrics sidebar"
        width={1682}
        height={915}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Source Code Tab Behavior</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">How source is loaded</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>If the query belongs to a SQL object, the module first loads the object definition.</li>
              <li>If no definition is available, it falls back to the captured query text.</li>
              <li>If neither is available, the tab shows an explanatory message instead of blocking the module.</li>
              <li>The read-only, syntax-highlighted editor offers Copy SQL and Export .sql.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Sensitive data behavior</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>With Show Sensitive Data off, literals are redacted in SQL text.</li>
              <li>With it on, raw text is shown for local inspection in this session.</li>
              <li>The same setting controls whether unredacted data can be included in AI analysis.</li>
            </ul>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 3"
        title="Execution Plan Tab"
        body="The Execution Plan tab has three sub-tabs (Execution Plan, Missing Indexes, and Warnings, which show a count when they have entries), a plan summary (operator count, total cost, parallel or single thread), an operator tree with cost percentage, estimated rows, and object, and a detail panel for the selected operator. Use it to validate plan shape, row estimates, missing indexes, and operator-level warnings before taking action."
        image="/docs/querystatistics/003.png"
        alt="Query Statistics Execution Plan tab showing the Execution Plan, Missing Indexes, and Warnings sub-tabs, the plan summary, the operator tree, and the operator detail panel"
        width={1678}
        height={914}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Execution Plan Behavior</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">What The Tab Does</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Loads the execution plan for the selected query.</li>
              <li>Provides three sub-tabs: Execution Plan, Missing Indexes, and Warnings. The Missing Indexes and Warnings labels show a count when they have at least one entry.</li>
              <li>Missing Indexes lists each candidate with its estimated impact, its equality, inequality, and include columns, and a CREATE INDEX statement with a Copy button; it reports that there are no recommendations when the plan has none. The app only displays and copies this SQL; it never runs it.</li>
              <li>Warnings lists the warnings SQL Server recorded in the plan.</li>
              <li>Shows Metrics, Plan Stability, Object Info, Predicates, and Warnings for the selected operator.</li>
              <li>Flags the Execution Plan tab when warnings or missing indexes exist.</li>
              <li>Export HTML saves the current execution plan as a standalone HTML file.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Sensitive Data Rules</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>When sensitive data is hidden, literals are redacted in execution plans.</li>
              <li>When sensitive data is shown, raw values can be visible in plan details.</li>
              <li>Use raw mode carefully because plan XML can expose literals, PII, or environment-specific values.</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-700">
          When a query has more than one plan, the Plan Stability details help you judge whether a parameter-sniffing
          or plan-regression pattern deserves follow-up. The operator details and missing-index list then point to
          whether the next step belongs in{' '}
          <Link href="/docs/modules/wait-statistics" className="font-semibold text-primary hover:text-primary-dark">
            Wait Statistics
          </Link>{' '}
          or{' '}
          <Link href="/docs/modules/index-advisor" className="font-semibold text-primary hover:text-primary-dark">
            Index Advisor
          </Link>
          .
        </p>
      </div>

      <ScreenshotCard
        eyebrow="Screen 4"
        title="AI Analysis Tab: Running"
        body="The AI Analysis tab combines deterministic context with LLM-assisted interpretation. Its status line shows Context Quality (a score out of 100), whether Self-critique is on, and the deterministic Bottleneck classification, followed by a progress bar for the running stage. The output panel fills in when the analysis completes, and Cancel stops a running analysis."
        image="/docs/querystatistics/004.png"
        alt="Query Statistics AI Analysis tab while an analysis is running, showing Context Quality, Self-critique, Bottleneck, a progress bar at 56 percent, and the Running AI analysis message"
        width={1678}
        height={876}
      />

      <ScreenshotCard
        eyebrow="Screen 5"
        title="AI Analysis Tab: Completed Report"
        body="When the analysis completes, the report appears in the output panel with a header (bottleneck, priority, risk, plan stability, confidence, and risk score), a next action, a validate-before-applying notice, and the report sections. Copy Text, Save Report, and Save LLM Request sit under the output. This is where you move from raw evidence to structured recommendations and saved reports."
        image="/docs/querystatistics/006.png"
        alt="Query Statistics AI Analysis tab with a completed analysis showing the report header, next action, executive summary, and the Copy Text, Save Report, and Save LLM Request buttons"
        width={1671}
        height={985}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">AI Workflow and Exports</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Single-query analysis</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Start with Analyze with AI in the detail header; Cancel stops a running analysis.</li>
              <li>Deep Analysis (off by default) uses a larger response budget and a lower temperature for a fuller breakdown; it is slower and uses more tokens.</li>
              <li>The tab shows Context Quality (score out of 100) with the Self-critique state, the Bottleneck classification, and progress before the final output; a Confidence badge appears when the analysis returns one.</li>
              <li>Copy Text, Save Report (HTML, Markdown, or text), and Save LLM Request (JSON, when a request payload is available).</li>
              <li>If Show Sensitive Data is on and a cloud AI provider is configured, the app asks for consent before sending unredacted data.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Batch analysis</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Analyze Selected with AI analyzes up to 10 of the selected queries in one run, with progress and Cancel; if more are selected, it asks before analyzing the first 10 in list order.</li>
              <li>The results dialog shows totals, a per-query table (status, duration, quality, confidence, error), and a combined report.</li>
              <li>Results can be exported to CSV or HTML for a DBA or developer review.</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">How the analysis is built</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Deterministic diagnostics (classification, risk, plan stability, wait profile, and missing-index signals) are computed from your data first; the AI adds interpretation and recommendations on top.</li>
              <li>By default the AI works in two stages: a diagnosis pass, then a recommendation pass.</li>
              <li>With Self-critique on (the default), an independent critic reviews the recommendations. Approved ones are kept, revised ones are replaced with the critic&apos;s version, and rejected ones are left out. The Executive Summary states the approved, revised, and rejected counts, or says the recommendations were published unverified when the critic could not complete.</li>
              <li>Fast, low-risk queries with only minor findings get a short monitor recommendation instead of a tuning plan.</li>
              <li>Verification and rollback SQL is screened, and DROP, TRUNCATE, and DELETE statements are rejected. The app only displays and copies SQL; it never applies tuning changes to your server.</li>
              <li>If the AI step fails or returns incomplete output, the report shows an AI Analysis Unavailable or AI Analysis Incomplete notice and the deterministic diagnostics are still published.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">What the report contains</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Executive Summary and Primary Bottleneck.</li>
              <li>Detailed Findings, each labeled as observed from the plan or inferred from metrics, plus a Checked and cleared list of non-issues.</li>
              <li>Prioritized Recommendations with priority, risk, expected effect, and the findings and evidence they address.</li>
              <li>A Verification Plan with queries you can run to check each recommendation, and Risks And Caveats with confidence, evidence gaps, regression risk, and rollback SQL where relevant.</li>
              <li>Deterministic sections: a Canonical Classification, plan-stability details (a per-plan table for queries with several plans), and an Evidence Appendix that the [E#] references link to.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Example AI Report Downloads</div>
        <p className="text-sm text-gray-700">
          Save Report in the AI Analysis tab can produce an HTML report. The three examples below were generated against
          the WideWorldImporters sample database on a demonstration instance. They show the report structure and how
          evidence, risk, and recommendations are framed; names, plan IDs, and numbers will differ on your server, and
          each report asks you to validate before applying anything.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {reportDownloads.map((report) => (
            <div key={report.href} className="flex h-full flex-col rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="font-semibold text-gray-900">{report.name}</div>
              <div className="mb-2 mt-1 text-xs text-gray-500">{report.meta}</div>
              <p className="mb-4 text-sm text-gray-700">{report.summary}</p>
              <div className="mt-auto flex flex-wrap items-stretch gap-2">
                <a
                  href={report.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-800 transition hover:border-primary hover:text-primary"
                >
                  Open Preview
                </a>
                <a
                  href={report.href}
                  download
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-cta px-4 py-2 text-center text-sm font-semibold text-white shadow-cta transition hover:bg-cta-hover hover:shadow-cta-hover"
                >
                  Download HTML Report
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Permissions, Security, and Practical Use</div>
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Minimum Permissions</div>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-mono">VIEW SERVER STATE</span> is required; without it the module does not load queries.</li>
              <li><span className="font-mono">VIEW DEFINITION</span> (or <span className="font-mono">SELECT</span> on <span className="font-mono">sys.sql_modules</span>) for the Source Code view.</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Graceful Degradation</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>If Query Store is unavailable or its queries fail, the module falls back to DMV-based data.</li>
              <li>If source permissions are missing, query metrics still load and the Source Code view shows a limited-access message.</li>
              <li>The Query Store Health notification and the warning line explain these degraded states explicitly.</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Typical Workflow</div>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Check the Query Store Health notification and any warning line first.</li>
              <li>Adjust Duration, Order By, and the visibility settings.</li>
              <li>Search for the target query, object, or workload pattern.</li>
              <li>Click cards to compare them in the inspector, then open Source Code, Execution Plan, or AI Analysis.</li>
              <li>Use Waits, Indexes, or Explorer to continue in Wait Statistics, Index Advisor, or Object Explorer.</li>
              <li>Export CSV, plan HTML, or AI reports for tuning review, audits, or developer handoff.</li>
            </ol>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Related documentation</div>
            <p>
              Use{' '}
              <Link href="/docs/modules/dashboard" className="font-semibold text-primary hover:text-primary-dark">
                Dashboard
              </Link>{' '}
              for instance-level triage,{' '}
              <Link href="/docs/modules/wait-statistics" className="font-semibold text-primary hover:text-primary-dark">
                Wait Statistics
              </Link>{' '}
              for query-correlated wait evidence, and{' '}
              <Link href="/docs/modules/index-advisor" className="font-semibold text-primary hover:text-primary-dark">
                Index Advisor
              </Link>{' '}
              for missing-index follow-up after plan inspection.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
