import Link from 'next/link'
import LightboxImage from './LightboxImage'

const mainAreas = [
  'Filter panel: Duration, Order By, Search, Show System Queries, Show Sensitive Data, and Reset to Defaults',
  'Batch toolbar: Batch Operations, Select Top 10 on Page by Avg CPU, Clear Selection, and the Selected counter',
  'Warning line above the list (only when the module reports runtime warnings); Query Store health arrives as a notification when the list loads',
  'Paged list of query cards, 15 per page, with a results counter and page navigation',
  'Selected Query inspector panel on the right',
]

const detailTabs = ['Source Code', 'Execution Plan', 'AI Analysis']

const durationOptions = [
  'Last 3 Hours',
  'Last 24 Hours',
  'Last 7 Days (default)',
  'Last 14 Days',
  'Last 30 Days',
  'Last 90 Days',
]

const orderOptions = [
  'Impact Score (default)',
  'Average Duration',
  'Total CPU',
  'Execution Count',
  'Logical Reads',
  'Risk Score',
]

const batchActions = ['Analyze Selected with AI', 'Export Selected to CSV', 'Compare Selected Queries']

const aiBadges = [
  '○ AI: Ready',
  '◔ AI: Running',
  '◔ AI: Streaming',
  '✓ AI: Completed',
  '✕ AI: Failed',
  '⚠ AI: Attention',
  '■ AI: Cancelled',
]

const aiStages = [
  'Context (12%) — "Preparing query context..."',
  'Connect (28%) — "Connecting to AI service..."',
  'Analyze (56%) — "Analyzing query..."',
  'Metrics (72%) — "Evaluating metrics..."',
  'Optimize (86%) — "Preparing optimization recommendations..."',
  'Format (96%) — "Formatting results..."',
  'Complete (100%) — "Analysis completed successfully."',
]

const reportSections = [
  'Executive Summary',
  'Primary Bottleneck',
  'Detailed Findings (with a "Checked and cleared (non-issues)" list when something was ruled out)',
  'Prioritized Recommendations',
  'Verification Plan',
  'Risks And Caveats',
  'Canonical Classification (Deterministic Candidate, Evidence-Reconciled)',
  'Plan Stability Action Table (only when the query has at least two plans)',
  'Evidence Appendix',
]

const reportDownloads = [
  {
    name: 'Plan regression and row-by-row cursor',
    meta: 'DataLoadSimulation.InvoicePickedOrders · Medium risk · P1',
    href: '/docs/querystatistics/AI_Report_20261004_125431',
    summary:
      'Two plans, a fast one averaging 0.08 ms and a slow one averaging about 7 s, plus a cursor-driven procedure. Two recommendations, both approved by the independent critic.',
  },
  {
    name: 'Missing-index review and plan instability',
    meta: 'Demo.usp_Test_05_MissingIndex · Medium risk · P1',
    href: '/docs/querystatistics/AI_Report_20261004_143729',
    summary:
      'Nine plans in seven days, an implicit conversion in an access predicate, and a missing-index candidate that the report checks against the query predicates and sets aside as unrelated. Four recommendations: 2 approved, 2 revised.',
  },
  {
    name: 'Scalar functions and plan instability',
    meta: 'Demo.usp_Test_07_ScalarUDF · High risk · P1',
    href: '/docs/querystatistics/AI_Report_20261004_144059',
    summary:
      'Scalar user-defined functions in the SELECT list, eleven plans in seven days, and a missing-index signal. Three recommendations: 2 approved, 1 revised.',
  },
]

function ScreenshotCard({
  eyebrow,
  title,
  body,
  image,
  alt,
  width = 1600,
  height = 900,
  maxWidthClass = 'max-w-6xl',
  sizes,
}: {
  eyebrow: string
  title: string
  body: React.ReactNode
  image: string
  alt: string
  width?: number
  height?: number
  maxWidthClass?: string
  sizes?: string
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{eyebrow}</div>
      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <div className="space-y-3 text-sm leading-7 text-gray-700">{body}</div>
        </div>
        <LightboxImage
          src={image}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          className={`mx-auto ${maxWidthClass}`}
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
          Query Statistics is the query-centric performance review module. It ranks the queries of the current
          database by impact, risk, duration, CPU, reads, or executions, shows deterministic trend and plan-stability
          signals on every card, and opens any query in a full-page detail view with its source code, execution plans,
          and AI analysis.
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
          are complete. Query Store is the preferred data source. When Query Store is not usable, the module reads the
          plan cache DMVs instead and says so in its health notification and warning line.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm text-gray-700">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What You Can Do</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Rank queries over a window from the last 3 hours to the last 90 days by impact, duration, CPU, executions, reads, or risk.</li>
              <li>Inspect source code and execution plans with missing-index and warning details, and choose which of a query&apos;s plans to view.</li>
              <li>Review plan stability, the trend against the previous window, and parameter-sniffing signals.</li>
              <li>Run AI analysis for one query, or for up to 10 selected queries in a batch, and save the results as HTML.</li>
              <li>Export selected queries to CSV, compare them side by side, and jump with context into Wait Statistics, Index Advisor, or Object Explorer.</li>
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
          The three detail tabs ({detailTabs.join(', ')}) appear only after you open a query, which replaces the list
          with a full-page query detail view.
        </p>
        <ol className="mt-4 list-decimal pl-5 text-sm text-gray-700 space-y-1">
          {mainAreas.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ol>
      </div>

      <ScreenshotCard
        eyebrow="Screenshot 1"
        title="Filters, Batch Toolbar, and Query List"
        body={
          <>
            <p>
              The list screen in version 1.1.0 against a test database built on the WideWorldImporters sample. Duration
              is Last 24 Hours, Order By is Impact Score, Show System Queries is on, and Show Sensitive Data is off.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Filter panel:</strong> the Duration and Order By drop-downs, the search box, the two visibility
                checkboxes, and Reset to Defaults.
              </li>
              <li>
                <strong>Batch toolbar:</strong> Batch Operations, Select Top 10 on Page by Avg CPU, Clear Selection,
                and the Selected: 0 counter.
              </li>
              <li>
                <strong>Query cards:</strong> each card shows the object name, a 🔥 CPU or 💽 I/O tag, the avg / P95≈ /
                cpu latency line, executions, plan count, and last execution, and on the right the impact score, the
                trend arrow, the stability label, and Risk N. The first card, DataLoadSimulation.RecordInvoiceDeliveries,
                scores 942.8 with a +21% trend, one plan, Stable, and Risk 14. The second, Demo.usp_Test_05_MissingIndex,
                carries the notice &quot;⚠ 8 execution plans detected — possible parameter sniffing&quot; with Problem
                and Risk 61.
              </li>
              <li>
                <strong>Card links:</strong> [ View ], [ Plan ], [ AI ], [ Waits ], [ Indexes ], and [ Explorer ] under
                each card.
              </li>
              <li>
                <strong>Selected Query inspector:</strong> the first card is selected automatically after a load. The
                panel shows the RISK dial (14), the Stable label with the first risk factor &quot;Very high execution
                volume (≥100K)&quot;, the Resource profile bars for CPU, Duration, and Reads, the &quot;Why it
                matters&quot; sentence, and the Open analysis and View plan buttons.
              </li>
            </ul>
          </>
        }
        image="/docs/querystatistics/001.png"
        alt="Query Statistics list screen with the filter panel, batch toolbar, ranked query cards for the last 24 hours, and the Selected Query inspector"
        width={1633}
        height={930}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="data-source" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Data Source and Health Model
        </h2>
        <p className="text-sm text-gray-700">
          The module is read-only. It never changes Query Store settings, forces plans, or runs tuning statements. Which
          source it reads from decides how much of the card data is available, so the health notification is the first
          thing to check after a load.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">Preferred: Query Store</div>
            <p>
              Query Store is used when it is enabled, in READ_WRITE state, and the server is SQL Server 2016 or later.
              The module reads the Query Store catalog views for queries, query text, plans, runtime statistics,
              runtime intervals, and wait statistics. Impact, trend, P95≈, and plan counts are computed from the
              interval statistics inside the selected Duration window.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">Fallback: plan cache DMVs</div>
            <p>
              If Query Store is disabled, not in READ_WRITE state, or its query fails, the list is built from
              sys.dm_exec_query_stats and the related procedure, trigger, function, plan, and text DMVs. If the Query
              Store query times out, the module first retries a simplified Query Store query and only then falls back
              to the DMVs. Both paths are reported in the warning line. In plan cache mode the trend column shows n/a
              and the warning reads: &quot;Plan cache mode: the counters are cumulative since each plan was cached; the
              time window only keeps plans that last ran inside it, and there is no per-interval history.&quot;
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">Query Store Health notification</div>
            <p>
              Shown once per connection (server, database, and profile) for 12 seconds after the first load, and again
              after you switch connection:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>&quot;Query Store Health: GREEN | recent data | queries=N&quot;</li>
              <li>&quot;Query Store Health: YELLOW | stale data | queries=N&quot; or &quot;… | partial issues | queries=N&quot;</li>
              <li>&quot;Query Store Health: RED | disabled/non-operational -&gt; using DMV fallback.&quot;</li>
              <li>
                &quot;Query Store Health: RED | missing VIEW SERVER STATE permission (VIEW SERVER PERFORMANCE STATE on
                SQL Server 2022+).&quot;
              </li>
            </ul>
            <p className="mt-2">
              A &quot;| Guidance: …&quot; suffix carries the first guidance item, for example &quot;Enable Query Store
              for richer and more accurate analysis results.&quot; or &quot;Run recent workload queries to refresh
              Query Store statistics.&quot;. A &quot;| Source code view limited (missing VIEW DEFINITION/sys.sql_modules
              access).&quot; suffix is added when the source permission is missing. Data counts as stale when the
              newest execution is older than 24 hours.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">Warning line and blocking messages</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                The warning line above the list starts with &quot;Warning:&quot; and shows the first two warnings; its
                &quot;Runtime warnings&quot; tooltip lists all of them. The same text is also shown as a 12-second
                &quot;Query Statistics warning&quot; notification. Query Store findings arrive here as well, for example
                &quot;Query Store is disabled. Recommendation: enable Query Store for this database (ALTER DATABASE
                [db] SET QUERY_STORE = ON).&quot; or &quot;Query Store data is stale (last execution ~Nh ago).&quot;
              </li>
              <li>
                When system queries are hidden, a warning counts them and tells you to enable Show System Queries to
                include them.
              </li>
              <li>Without a connection the module shows &quot;Please connect to a database first.&quot;</li>
              <li>
                Without the server permission it shows &quot;Query Statistics requires VIEW SERVER STATE permission
                (VIEW SERVER PERFORMANCE STATE on SQL Server 2022 and later). Grant permission and retry.&quot;
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="filters" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Filters, Batch Controls, and Indicators
        </h2>
        <div className="grid gap-4 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">Filter panel</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Duration:</strong> {durationOptions.join(', ')}. The filter is remembered per server, database,
                and connection profile.
              </li>
              <li>
                <strong>Order By:</strong> {orderOptions.join(', ')}.
              </li>
              <li>
                <strong>Search:</strong> the box reads &quot;Search query name (3+ chars searches server)...&quot;. It
                filters the loaded list by display name, object name, schema.object, or query text. From three
                characters it also runs a server-side search over all queries by display name or query text, and the
                results counter adds &quot;(N hidden by search)&quot;.
              </li>
              <li>
                <strong>Show System Queries:</strong> off by default. When off, the list hides Microsoft-shipped
                objects, queries against sys. and information_schema. views, objects in master, model, msdb, and
                tempdb, xp_* procedures, msdb job procedures, backup and restore, UPDATE STATISTICS, sp_updatestats,
                DBCC, and the optimizer&apos;s StatMan queries.
              </li>
              <li>
                <strong>Show Sensitive Data:</strong> off by default, which masks literals in SQL text and plan XML:
                string literals become &apos;[REDACTED]&apos;, hex values 0x[REDACTED], numbers of four or more digits
                [NUM], and GUIDs [GUID]; parameter and constant values inside plan XML are masked as well. Turning it
                on asks &quot;Sensitive data visibility is currently OFF by default. Enabling this may expose literals
                (PII/secrets) in SQL text and plan XML. Do you want to enable it for this session?&quot;; a No leaves
                the list untouched, a Yes reloads it with raw text. Turning it off again revokes any cloud AI consent
                given in the session and reloads.
              </li>
              <li>
                <strong>Reset to Defaults:</strong> restores Last 7 Days, Impact Score, hidden system queries, clears
                the search text and the remembered filter, and reloads. It does not change Show Sensitive Data.
              </li>
              <li>
                <strong>Loading and paging:</strong> the progress bar runs from &quot;Connecting to database...
                (0/4)&quot; to &quot;Complete! Loaded N queries. (4/4)&quot; and can be cancelled (&quot;Loading
                cancelled by user.&quot;). Empty results read &quot;No queries matched this filter.&quot; or &quot;No
                non-system queries matched this filter.&quot;. The list shows 15 cards per page with a &quot;Showing
                X–Y of N results&quot; footer and is capped at the first 5,000 queries; when the cap is hit a warning
                asks you to narrow the time range or filters, and with Risk Score ordering it adds that the risk order
                only covers the top 5,000 queries by impact score.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">Batch toolbar</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Batch Operations:</strong> opens a menu with {batchActions.join(', ')}. Each action is described
                under AI Workflow and Exports below.
              </li>
              <li>
                <strong>Select Top 10 on Page by Avg CPU:</strong> adds the ten cards with the highest average CPU time
                among the cards visible on the current page to the selection.
              </li>
              <li>
                <strong>Clear Selection</strong> and the <strong>Selected: N</strong> counter, which adds &quot;(M not
                visible)&quot; when selected cards are on another page or hidden by the search. The selection survives
                paging and is cleared when the filter changes or the list is fully refreshed. Space toggles the checkbox
                of the focused card.
              </li>
              <li>
                <strong>Scope dialog:</strong> when some selected queries are not visible, a batch action asks whether
                to continue with &quot;Include all N&quot; or &quot;Visible only&quot;.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">Card indicators</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>🔥 CPU / 💽 I/O tag:</strong> CPU when the average CPU time is at least 70% of the average
                duration, I/O when the average logical reads are 10,000 or more. The list works from these thresholds
                only; the wait profile is loaded in the detail view.
              </li>
              <li>
                <strong>Latency line:</strong> &quot;⏱ avg&quot; is the average duration, &quot;P95≈&quot; the
                estimated 95th percentile (mean + 1.645 × standard deviation, capped at the observed maximum, because
                Query Store keeps no per-execution samples), and &quot;🧠 cpu&quot; the average CPU time, which can
                exceed the duration on parallel plans.
              </li>
              <li>
                <strong>Workload line:</strong> total executions in the window, distinct execution plans, and the last
                execution time.
              </li>
              <li>
                <strong>Impact score:</strong> average duration × executions / 1000, which is the total elapsed time
                in seconds; the tooltip adds the percentile among all loaded queries.
              </li>
              <li>
                <strong>Trend arrow:</strong> compares the average duration with the previous window of the same
                length. ↗ when the change is more than +10%, ↘ when it is below −10%, → otherwise; the threshold
                tightens to ±5% when the risk score is 55 or higher. &quot;n/a&quot; means the previous window had no
                executions or the data comes from the plan cache.
              </li>
              <li>
                <strong>Plan stability:</strong> Stable, Attention, or Problem. Problem when the query has four or more
                plans or a latency stability score below 0.30; Attention with two or three plans or a score below 0.70;
                Stable otherwise. The score only counts when the average duration is at least 1 ms, so sub-millisecond
                queries are not escalated by timer noise. Problem cards add the notice &quot;⚠ N execution plans
                detected — possible parameter sniffing&quot;.
              </li>
              <li>
                <strong>Risk N:</strong> a deterministic 0–100 score from P95 latency, volume, CPU, I/O, plan count, and
                trend. Levels: CRITICAL from 75, HIGH from 55, MEDIUM from 35, LOW from 15, otherwise INFO. The tooltip
                lists up to four contributing factors or &quot;No specific risk factors.&quot;
              </li>
              <li>
                <strong>Priority colour:</strong> the dot and left border follow the card&apos;s priority: critical
                when the risk is 75 or higher or the query has more than four plans, high from risk 55 or a change above
                50%, medium from risk 35 or two to three plans, low for any other query with executions, and INFO without data.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screenshot 2"
        title="Last 7 Days with System Queries Shown"
        body={
          <>
            <p>
              The same list with Duration set to Last 7 Days and Show System Queries on, so an ad hoc system query
              appears among the stored procedures.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Trend column:</strong> every card shows &quot;n/a&quot; because the previous 7-day window has no
                executions on this test instance, so there is nothing to compare against.
              </li>
              <li>
                <strong>Plan stability:</strong> Demo.usp_Test_05_MissingIndex now reports &quot;⚠ 9 execution plans
                detected — possible parameter sniffing&quot; with Problem and Risk 50, DataLoadSimulation.InvoicePickedOrders
                has two plans and Problem, and Demo.usp_Test_06_TempTableSpill is Attention with a single plan because
                its latency variance (avg 2360 ms, P95≈ 7628 ms) lowers the stability score.
              </li>
              <li>
                <strong>System query card:</strong> the ad hoc statement is named by its parameter list, &quot;(@days_back
                int, @schema_name nvarchar(256), …&quot;, and shows avg 37425 ms over 26 executions with two plans,
                Attention, and Risk 49.
              </li>
              <li>
                <strong>Priority colours:</strong> the green, yellow, and red dots and left borders mark the priority
                level of each card.
              </li>
              <li>
                <strong>Inspector:</strong> the first card is selected; &quot;Why it matters&quot; reads &quot;Impact
                score 2,413.2 across 1.2M executions. Single execution plan. Latency variance is within normal
                range.&quot;
              </li>
            </ul>
          </>
        }
        image="/docs/querystatistics/004.png"
        alt="Query Statistics list over the last 7 days with system queries shown, every trend marked n/a, and an ad hoc system query card among the stored procedures"
        width={1615}
        height={881}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="detail-flow" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Quick Actions and Detail Flow
        </h2>
        <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">Card links and keyboard</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>[ View ], [ Plan ], and [ AI ] open the detail view on the Source Code, Execution Plan, or AI Analysis tab.</li>
              <li>[ Waits ] and [ Indexes ] open Wait Statistics or Index Advisor with the query, database, and object as context.</li>
              <li>[ Explorer ] opens the query&apos;s object in Object Explorer.</li>
              <li>A click selects a card for the inspector; a double-click or Enter opens the detail on Source Code; Space toggles the checkbox.</li>
              <li>Esc or Ctrl+W closes the detail view (an open dialog is closed first). Closing it also cancels a running AI analysis.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">Selected Query inspector</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>The query name, a RISK dial, the stability label, and either the first risk factor or the stability detail.</li>
              <li>Resource profile bars for CPU, Duration, and Reads, each with its percentile among all loaded queries.</li>
              <li>&quot;Why it matters&quot;: the impact score across N executions followed by the stability detail, for example &quot;Single execution plan. Latency variance is within normal range.&quot;</li>
              <li>Open analysis jumps to the AI Analysis tab, View plan to the Execution Plan tab.</li>
              <li>Before a selection the panel reads &quot;No query selected&quot; with &quot;Choose a result to inspect its workload profile.&quot;</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">Detail header and summary strip</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>A &quot;← Query Statistics&quot; back button, the query name, and a badge with the stability label.</li>
              <li>A meta line: &quot;Query ID: N • Object: schema.object • Last captured YYYY-MM-DD HH:MM&quot; (the Object part only for object-bound queries).</li>
              <li>The AI badge, the Deep Analysis toggle, and the Analyze with AI and Cancel buttons.</li>
              <li>A summary strip with the number of execution plans detected, the selected time window, and &quot;Risk Score N · level&quot;.</li>
              <li>A footer line: &quot;Avg Duration | P95≈ | CPU | Reads | Exec | Plans | Risk: N (LEVEL)&quot;.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">Query Metrics sidebar</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>RISK SCORE dial with the level.</li>
              <li>DURATION with P95≈ underneath; coloured critical above 1000 ms, high above 200 ms, medium above 50 ms.</li>
              <li>CPU TIME with &quot;Ratio: N%&quot; (CPU / Duration); critical above 80%, high above 50%.</li>
              <li>LOGICAL READS with &quot;Writes: N&quot;; critical above 100,000, high above 10,000, medium above 1,000.</li>
              <li>EXECUTIONS with &quot;Impact: N&quot;, and &quot;Plan Stability: label&quot; with &quot;N plan(s) detected&quot;.</li>
            </ul>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screenshot 3"
        title="Query Detail: Source Code Tab"
        body={
          <>
            <p>
              DataLoadSimulation.RecordInvoiceDeliveries opened from the list. The header shows the Stable badge, the meta
              line &quot;Query ID: 88 • Object: DataLoadSimulation.RecordInvoiceDeliveries • Last captured 2026-10-07
              11:30&quot;, the &quot;○ AI: Ready&quot; badge, Deep Analysis: OFF, and the Analyze with AI and Cancel
              buttons.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Summary strip:</strong> one execution plan detected, the selected time window, and Risk Score
                14 · Info.
              </li>
              <li>
                <strong>Source Code tab:</strong> PROCEDURE and Read only badges, Copy SQL and Export .sql, and the
                numbered, syntax-highlighted procedure body. Because Show Sensitive Data is off, the string literal in
                the PRINT statement appears as N&apos;[REDACTED]&apos;.
              </li>
              <li>
                <strong>Query Metrics sidebar:</strong> RISK SCORE 14 INFO, DURATION 2.1 ms (P95≈ 4.6 ms), CPU TIME 2.0
                ms (Ratio: 98%), LOGICAL READS 206 (Writes: 6), EXECUTIONS 1,167,103 (Impact: 2,413.2), and Plan
                Stability: Stable with 1 plan detected.
              </li>
            </ul>
          </>
        }
        image="/docs/querystatistics/005.png"
        alt="Query detail view on the Source Code tab with the procedure body, a redacted string literal, and the Query Metrics sidebar"
        width={1618}
        height={925}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="source-code" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Source Code Tab Behavior
        </h2>
        <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">What is shown</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>For object-bound queries the module definition from sys.sql_modules; otherwise the captured query text, or the text fetched by query id.</li>
              <li>A PROCEDURE badge for object-bound queries and a QUERY badge for ad hoc statements, plus a Read only badge; the text has line numbers and syntax highlighting.</li>
              <li>When nothing is available the editor shows a comment block such as &quot;-- Definition not available (permissions or encrypted object).&quot; or &quot;-- Source code not available&quot; with the query id. Placeholders are never copied or exported.</li>
              <li>Without VIEW DEFINITION or SELECT on sys.sql_modules the tab stays open but shows &quot;-- Source code view is disabled for this connection.&quot; and the list page warns &quot;Source code view is disabled (missing VIEW DEFINITION / sys.sql_modules access).&quot;</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">Copy SQL and Export .sql</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Copy SQL confirms with &quot;SQL source code copied to clipboard.&quot; and, while literals are masked, adds &quot;Literals are masked (Show Sensitive Data is OFF): the text is not runnable as-is.&quot;</li>
              <li>Export .sql saves the text under the object name (dots and spaces become underscores, brackets are removed) or Query_N, for example dbo_usp_Report.sql, and confirms with &quot;SQL source exported successfully.&quot;</li>
              <li>A masked export starts with the header &quot;-- Masked: literals were replaced, so this script is not runnable as-is (Show Sensitive Data was OFF).&quot;</li>
              <li>Without source the actions report &quot;No source code available to copy.&quot; or &quot;No source code available to export.&quot;</li>
            </ul>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screenshot 4"
        title="Query Detail: Execution Plan Tab"
        body={
          <>
            <p>
              The Execution Plan tab for the same procedure after the plan loaded (&quot;Loaded 13 operators&quot;).
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Plan bar:</strong> &quot;Plan: id 89 (1,167,103 executions, last: 2026-10-07 11:30) · avg 2.1
                ms&quot;. With a single plan there is no drop-down; Export HTML sits at the right end of the bar.
              </li>
              <li>
                <strong>Sub-tabs and summary:</strong> Execution Plan, Missing Indexes, and Warnings, then the summary
                line &quot;Operators: 13 | Cost: 0.0266 | Single Thread&quot;.
              </li>
              <li>
                <strong>Operator table:</strong> OPERATOR, COST %, EST. ROWS, and OBJECT columns; the Clustered Index
                Update row (50.0%) is selected.
              </li>
              <li>
                <strong>Detail pane:</strong> METRICS (Cost 49.99%, Subtree 0.013284, Estimated Rows 1, Row Size 4051
                bytes), PLAN STABILITY &quot;Stable - single plan detected&quot;, OBJECT INFO (WideWorldImporters,
                Sales, Invoices, PK_Sales_Invoices), PREDICATES with the Seek Predicate, and the WARNINGS status.
              </li>
            </ul>
          </>
        }
        image="/docs/querystatistics/006.png"
        alt="Query detail view on the Execution Plan tab with the plan bar, the operator table, and the detail pane for the selected Clustered Index Update operator"
        width={1623}
        height={917}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="execution-plan" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Execution Plan Behavior
        </h2>
        <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">Loading and layout</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Status text runs from &quot;Loading execution plan...&quot; to &quot;Loaded N operators&quot;, &quot;No execution plan available&quot;, or &quot;Execution plan load failed&quot;; the tab title shows ⏳ while loading and ⚠️ when the plan has warnings or missing indexes.</li>
              <li>When no plan exists the tab explains that none was found for the query (it may not have run yet, or its plan was evicted from the cache).</li>
              <li>The summary line reads &quot;📊 Operators: N | 💰 Cost: X | ⚡ Parallel&quot; or &quot;Single Thread&quot;; the sub-tabs are &quot;📊 Execution Plan&quot;, &quot;📈 Missing Indexes (n)&quot;, and &quot;⚠️ Warnings (n)&quot; with counts when they are above zero.</li>
              <li>The table lists every operator with its cost share, estimated rows, and object. In the detail pane the Cost, I/O, Estimated Rows, and Memory Grant metrics are highlighted when they exceed 20%, 0.1, 100,000 rows, or 10,000 KB.</li>
              <li>Until you click a row the detail pane shows &quot;📌 Select an operator&quot;. The pane then has Metrics (with &quot;Parallel: Yes (DOP: n)&quot; and Memory Grant when present), Plan Stability, Object Info, Predicates (&quot;🎯 Seek Predicate&quot;, &quot;🔍 Filter Predicate&quot;, or &quot;No Predicate&quot;), and Warnings (a &quot;✅ Status&quot; entry reading &quot;No warnings&quot; when clean).</li>
              <li>Plan Stability reads &quot;✅ Stable - single plan detected&quot;, &quot;🟡 Attention (N plans) - Plan changes detected&quot;, or &quot;🔴 Problem (N plans) - Multiple plans detected - possible parameter sniffing&quot;.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">Missing Indexes, Warnings, and Export HTML</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Missing Indexes lists cards &quot;#n - schema.table&quot; with an Impact bar, the Equality, Inequality, and Include columns, the CREATE INDEX statement, and a Copy button (&quot;CREATE INDEX statement copied to clipboard.&quot;). The app never runs these statements. The empty state is &quot;✅ No missing index recommendations&quot;.</li>
              <li>Warnings lists &quot;⚠️ Plan Warnings&quot; with 🔴 or 🟡 items, or &quot;✅ No plan warnings&quot; when the plan is clean.</li>
              <li>Export HTML writes a standalone file named object_ExecutionPlan_YYYYMMDD_HHMMSS.html with a header (title, Query ID, Object, Database, Generated), Plan Summary KPIs (Operators, Total Cost, DOP, Warnings, Missing Indexes, Plan Stability), the Statement Text, the Operator Tree, Warnings, Missing Index Recommendations, and a collapsible Raw Plan XML section. It exports the plan currently on screen, with the XML masked when Show Sensitive Data was off at load time.</li>
              <li>The button is disabled until a plan is loaded (&quot;Load an execution plan first.&quot;) and confirms with &quot;Execution plan exported successfully.&quot;</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="plan-selector" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Plan Selector
        </h2>
        <p className="text-sm text-gray-700">
          Version 1.1.0 adds a plan selector above the operator table, so a query with several plans can be inspected
          plan by plan instead of only through its most executed plan.
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>
            The bar reads &quot;Plan: id N (X executions, last: T) · avg Y ms&quot; for the plan on screen. A drop-down
            appears only when the selected Duration window holds more than one plan; its tooltip is &quot;Choose which
            execution plan of this query to show.&quot;
          </li>
          <li>
            The drop-down starts with &quot;Show most executed plan&quot;, &quot;Show slowest plan&quot;, and &quot;Show
            newest plan&quot;, followed by one entry per plan: &quot;id N · X executions · last T · avg Y ms&quot; with
            &quot;most executed&quot;, &quot;slowest&quot;, or &quot;newest&quot; tags where they apply.
          </li>
          <li>
            Candidates come from the Query Store runtime intervals inside the selected Duration (Last 3 Hours is widened
            to one day), ordered by executions, up to 20 plans. The first entry is loaded first.
          </li>
          <li>
            When the window holds no plan entries the bar is hidden and the default plan is shown: in Query Store mode
            the most executed plan over the whole history, in plan cache mode the most recently executed cached plan.
          </li>
          <li>
            Choosing another plan re-renders the operator table, the Missing Indexes and Warnings sub-tabs, the tab
            title, and what Export HTML writes. It does not change the AI analysis, which always works from the default
            plan. The drop-down is disabled while a plan loads and reverts to the previous choice on an error.
          </li>
        </ul>
      </div>

      <ScreenshotCard
        eyebrow="Screenshot 5"
        title="AI Analysis: Completed Run"
        body={
          <>
            <p>
              The AI Analysis tab after a standard run (Deep Analysis: OFF) on the same procedure. The badge reads
              &quot;✓ AI: Completed&quot; and the progress line &quot;Complete (100%)&quot; with &quot;Analysis completed
              successfully.&quot;
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Status line:</strong> &quot;Context Quality: 100/100 (High) | Self-critique: ON&quot; and
                &quot;Bottleneck: CPU BOUND&quot;. The Profile and Evidence Gaps fields show N/A.
              </li>
              <li>
                <strong>Analysis Output:</strong> marked &quot;✓ Completed&quot;. The Executive Summary notes a
                missing-index candidate on Sales.Invoices and then explains that the deterministic materiality gate
                classified the query as immaterial (performance class FAST, risk LOW, severity 53 below the threshold
                of 70), so the recommendation and critic stages were skipped.
              </li>
              <li>
                <strong>Primary Bottleneck:</strong> the section that follows the summary; it reads MIXED for this run.
              </li>
            </ul>
          </>
        }
        image="/docs/querystatistics/007.png"
        alt="AI Analysis tab after a completed run with the status line, the Executive Summary explaining the materiality gate, and the Primary Bottleneck section"
        width={1615}
        height={753}
      />

      <ScreenshotCard
        eyebrow="Screenshot 6"
        title="AI Analysis: Verification, Classification, and Save Buttons"
        body={
          <>
            <p>The lower half of the same output, scrolled to the end.</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Verification Plan and Risks And Caveats:</strong> the two closing narrative sections of the
                report.
              </li>
              <li>
                <strong>Canonical Classification table:</strong> &quot;Canonical Classification (Deterministic Candidate,
                Evidence-Reconciled)&quot; with Candidate Pathology NONE, Final Classification NONE, Classification
                Status INSUFFICIENT_DATA, and Evidence Strength DERIVED_HEURISTIC.
              </li>
              <li>
                <strong>Buttons:</strong> Copy Text, Save Report, and Save LLM Request under the output. The red frame
                around them was drawn on the screenshot to point them out; it is not part of the app.
              </li>
            </ul>
          </>
        }
        image="/docs/querystatistics/008.png"
        alt="End of the AI analysis output with the Verification Plan, Risks And Caveats, the Canonical Classification table, and the Copy Text, Save Report, and Save LLM Request buttons"
        width={1336}
        height={861}
        maxWidthClass="max-w-5xl"
        sizes="(min-width: 1024px) 1024px, 100vw"
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="ai-analysis" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          AI Workflow and Exports
        </h2>
        <div className="grid gap-4 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">Starting a run</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Analyze with AI in the detail header, the [ AI ] card link, or Open analysis in the inspector. The empty
                tab reads &quot;AI analysis is ready&quot; with &quot;Click &apos;Analyze with AI&apos; to generate
                deterministic + LLM insights. Enable &apos;Deep Analysis&apos; for a fuller breakdown (larger budget,
                lower temperature).&quot;
              </li>
              <li>
                Deep Analysis starts OFF every time a detail view opens. Its tooltip: &quot;Deep Analysis: more
                thorough AI examination. Uses a larger response budget and a lower, more deterministic temperature for
                a fuller breakdown (slower, more tokens).&quot; With the default settings the budget doubles from 4,096
                to 8,192 tokens and the temperature drops from 0.1 to 0.02.
              </li>
              <li>
                The analysis always uses the query&apos;s default (most executed) plan and a fixed 7-day evidence
                window, independent of the Duration filter and of the plan chosen in the plan selector. Up to ten plans
                are included as context.
              </li>
              <li>
                The badge moves through the states {aiBadges.join(', ')}. Cancel reports &quot;Cancel requested. Stopping
                AI analysis...&quot; and then &quot;Analysis cancelled by user.&quot;; a failure shows &quot;❌ Error:
                …&quot; in the output and a notification.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">Stages and status line</div>
            <ul className="list-disc pl-5 space-y-1">
              {aiStages.map((stage) => (
                <li key={stage}>{stage}</li>
              ))}
            </ul>
            <p className="mt-2">
              After the run the status line shows &quot;Context Quality: N/100 (High, Medium, or Low) | Self-critique:
              ON or OFF&quot; and &quot;Bottleneck: …&quot; from the deterministic classification. Context Quality
              measures how complete the collected evidence is; self-critique is on when the score is 70 or higher.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">What the pipeline does</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Deterministic metrics, plan stability, and the bottleneck classification are computed first, then the
                LLM diagnosis, then the materiality gate, then the recommendations, and finally an independent critic
                pass.
              </li>
              <li>
                The materiality gate skips the recommendation and critic stages when the query is in the FAST
                performance class with risk LOW or INFO and a severity score below 70. The report then says &quot;No
                action is recommended&quot; with the reason, and adds a scale note when the per-execution cost is small
                but the daily total is not.
              </li>
              <li>
                The critic is a separate LLM call that tries to refute each recommendation; the report counts approved,
                revised, and rejected items. If the critic call fails, the recommendations are published with the note
                that they are unverified.
              </li>
              <li>
                Verification and rollback SQL in a recommendation is rejected if it contains DROP, TRUNCATE, or DELETE.
                The app never executes any of the suggested statements.
              </li>
              <li>
                If a stage fails or the response is truncated twice, the output starts with an &quot;AI Analysis
                Incomplete&quot; notice and the deterministic sections are still appended.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">Sensitive data and cloud providers</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>With Show Sensitive Data off, the masked query text and plan XML are what the provider receives.</li>
              <li>
                With Show Sensitive Data on and a provider other than a local Ollama server, the run first asks for
                consent: &quot;Sensitive Data Consent&quot;, &quot;Cloud AI provider detected: provider.&quot;, &quot;Raw
                query text and plan literals may include sensitive data. Do you want to allow sending unredacted data for
                this session?&quot;. Declining runs the analysis with masked text.
              </li>
              <li>
                Consent lasts for the session and is bound to the provider, model, endpoint, and connection. Turning
                Show Sensitive Data off revokes it.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">Outputs</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Copy Text copies the output (&quot;Result copied to clipboard.&quot;).</li>
              <li>
                Save Report writes AI_Report_YYYYMMDD_HHMMSS.html (&quot;Report saved successfully.&quot;). The report
                opens with a QUERY ANALYSIS header, the Query ID and analysis time, tiles for BOTTLENECK, PRIORITY,
                RISK, PLAN STABILITY, CONFIDENCE, and RISK SCORE, and a NEXT ACTION line when there are actions. Its
                sections: {reportSections.join('; ')}.
              </li>
              <li>
                Save LLM Request writes LLM_Request_YYYYMMDD_HHMMSS.json with the exact request that was sent to the
                provider (&quot;LLM request saved successfully.&quot;).
              </li>
              <li>
                When the run used unredacted data both file names get an _unredacted suffix and the save asks
                &quot;This file contains unmasked query text (literals, object names). Save it anyway?&quot;
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">Batch Operations</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Analyze Selected with AI:</strong> at most 10 queries per run, three analysed at a time, always
                without Deep Analysis. With more than 10 selected the dialog lists the first ten in selection order and
                asks whether to continue. Progress runs from &quot;Preparing batch AI analysis for N queries...&quot;
                and &quot;Building AI contexts...&quot; through &quot;Preparing context: name (i/N)&quot; and &quot;AI
                analyzing: name [stage] (i/N)&quot;. Cancel keeps what has finished (&quot;Cancelled by user. N
                finished result(s) kept.&quot;). The same consent dialog applies for cloud providers, and a batch is
                cancelled when you change connection or leave the module.
              </li>
              <li>
                <strong>Batch results:</strong> a &quot;Batch AI Analysis Results&quot; dialog with Total, Success,
                Failed, and Avg Duration, a table with Query, Status, Duration (ms), Quality, Confidence, and Error, and
                Export CSV (batch_ai_report.csv) and Export HTML (batch_ai_report.html) buttons. The HTML holds the
                summary table and each query&apos;s raw analysis text, not the formatted single-query reports.
              </li>
              <li>
                <strong>Export Selected to CSV:</strong> needs at least one selected query (&quot;Select one or more
                queries first.&quot;), saves query_stats_selected_YYYYMMDD_HHMMSS.csv, and confirms with &quot;Exported
                N queries to CSV.&quot;
              </li>
              <li>
                <strong>Compare Selected Queries:</strong> needs at least two (&quot;Select at least 2 queries to
                compare.&quot;) and opens a &quot;Query Comparison Summary&quot; table with Query, Avg Duration (ms), P95
                Duration (ms), Avg CPU (ms), Avg Reads, Executions, Plans, Impact, and Risk.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="sample-reports" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Sample Reports
        </h2>
        <p className="text-sm text-gray-700">
          Three reports saved with Save Report on October 4, 2026, from the same WideWorldImporters-based test database
          with Show Sensitive Data off. Each one reports Context Quality: High with self-critique on, uses the 7-day
          evidence window, and ends with the Canonical Classification table and the Evidence Appendix. They are served
          with a noindex header and contain no customer data.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {reportDownloads.map((report) => (
            <div key={report.href} className="flex h-full flex-col rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
              <p className="mt-1 text-xs text-gray-500">{report.meta}</p>
              <p className="mb-4 mt-2 text-sm text-gray-700">{report.summary}</p>
              <div className="mt-auto flex flex-wrap items-stretch gap-2">
                <a
                  href={report.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-800 transition hover:border-primary hover:text-primary"
                >
                  Preview
                </a>
                <a
                  href={report.href}
                  download
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-cta px-4 py-2 text-center text-sm font-semibold text-white shadow-cta transition hover:bg-cta-hover hover:shadow-cta-hover"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="permissions" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Permissions, Security, and Practical Use
        </h2>
        <div className="grid gap-4 text-sm text-gray-700">
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Minimum Permissions</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>VIEW SERVER STATE on the instance (VIEW SERVER PERFORMANCE STATE on SQL Server 2022 and later) for the query list, plans, and waits.</li>
              <li>VIEW DEFINITION on the objects, or SELECT on sys.sql_modules, for the Source Code tab.</li>
              <li>Query Store must be enabled and in READ_WRITE state on the database for trend, P95≈, and plan history; otherwise the module works from the plan cache.</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Graceful Degradation</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>If Query Store is unavailable or its query fails or times out, the module falls back to DMV data and says so in the health notification and warning line.</li>
              <li>If the source permission is missing, metrics and plans still load and the Source Code tab shows a limited-access message.</li>
              <li>The module only reads: it never enables Query Store, forces a plan, creates an index, or runs a recommendation.</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Typical Workflow</div>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Check the Query Store Health notification and any warning line first.</li>
              <li>Adjust Duration, Order By, and the visibility settings.</li>
              <li>Search for the target query, object, or workload pattern.</li>
              <li>Click cards to compare them in the inspector, then open Source Code, Execution Plan, or AI Analysis.</li>
              <li>On a multi-plan query, step through the plans with the plan selector before reading the AI output.</li>
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
