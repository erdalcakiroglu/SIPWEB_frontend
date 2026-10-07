import Link from 'next/link'
import LightboxImage from './LightboxImage'

const mainAreas = [
  'Status line and optional focus banner',
  'Filter bar with Search, Show, Rows per Page, and risk-pool option',
  'Paginated, sortable index table with the AI dock underneath',
  'Index Details panel with Overview and Script tabs',
]

const classifications = [
  'Effective',
  'Effective Mandatory',
  'Weak',
  'Weak But Necessary FK',
  'Needs Maintenance',
  'Unnecessary',
]

const dropSafetyStates = [
  {
    name: 'Do Not Drop',
    detail:
      'The index backs a primary key or unique constraint, supports a foreign key, or its dependent queries carry too much estimated impact (high or critical risk, 10% or more estimated workload impact, or three or more affected queries).',
  },
  {
    name: 'Validate Before Drop',
    detail:
      'The drop-impact estimate is unavailable (for example without Query Store evidence) or the signals are mixed, so a controlled test such as disable-and-monitor comes first.',
  },
  {
    name: 'Safe Drop Candidate',
    detail:
      'The index overlaps another one (duplicate, leftmost prefix, or subset) with an estimated impact of 5% or less, or it shows no reads and no dependent queries with an impact of 2% or less. The observation window must also be long enough: at least 7 days with reads in the 30-day trend, or a table at least 30 days old.',
  },
]

const actionLabels = [
  'Drop candidate',
  'Rebuild needed',
  'Reorganize needed',
  'Update statistics',
  'Maintenance review',
  'Review',
  'Keep (FK support)',
  'Healthy',
]

const showOptions = [
  { name: 'All', detail: 'Every analyzed index.' },
  {
    name: 'Needs Attention',
    detail:
      'Unnecessary or Needs Maintenance classes, scores below 50, or rows with fragmentation, stale statistics, fill factor, or deltastore signals.',
  },
  { name: 'Drop Candidates', detail: 'Indexes classified as Unnecessary.' },
  { name: 'Maintenance', detail: 'Rows with a maintenance need or the Needs Maintenance class.' },
]

const reportDownloads = [
  {
    name: 'AI Report 1: Mandatory primary key',
    href: '/docs/index-advisor/index_advisor_ai_analysis_01',
    summary:
      'PK_Sales_Customers on the WideWorldImporters demo database. Classified Effective Mandatory (score 100) with a keep decision: drop safety is Do Not Drop, and the only maintenance the contract authorizes is a statistics refresh because the statistics are 107 days old. It also lists the five dependent Query Store queries behind the drop-impact estimate.',
  },
  {
    name: 'AI Report 2: Unused index behind the validation gate',
    href: '/docs/index-advisor/index_advisor_ai_analysis_02',
    summary:
      'ix_Cities_Archive on a 28-row table in the same demo database. Classified Unnecessary (score 41) because no reads were recorded, but drop safety is Validate Before Drop: with no Query Store context and under 14 days of usage baseline, the report suppresses executable DDL and proposes only a statistics refresh and 14 days of monitoring.',
  },
  {
    name: 'AI Report 3: Fragmented primary key',
    href: '/docs/index-advisor/index_advisor_ai_analysis_03',
    summary:
      'PK_Sales_Invoices on the demo database. Effective Mandatory and Do Not Drop, but 94% fragmented across about 2.6 million pages. The contract authorizes ALTER INDEX REBUILD; the report proposes monitoring the fragmentation trend first and lists the rebuild command with a maintenance-window and edition caveat.',
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
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm leading-7 text-gray-700">{body}</p>
        </div>
        <LightboxImage src={image} alt={alt} width={width} height={height} />
      </div>
    </div>
  )
}

export default function IndexAdvisorTemplate() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Overview</div>
        <p className="text-sm text-gray-700">
          Index Advisor is the SQL Server index review and maintenance planning module. It classifies the indexes of
          the active database with a deterministic scoring model, adds Query Store evidence such as a 30-day usage
          trend and dependent queries, and assesses drop safety before you consider removing an index. An optional AI
          analysis can then explain the decision for a single index.
        </p>
        <p className="mt-3 text-sm text-gray-700">
          In a typical SQL Server tuning workflow, this page is most valuable after{' '}
          <Link href="/docs/modules/query-statistics" className="font-semibold text-primary hover:text-primary-dark">
            Query Statistics
          </Link>{' '}
          surfaces a query pattern worth investigating (its <strong>[ Indexes ]</strong> link opens Index Advisor
          focused on that query&apos;s tables) or after{' '}
          <Link href="/docs/modules/dashboard" className="font-semibold text-primary hover:text-primary-dark">
            Dashboard
          </Link>{' '}
          points to workload pressure that might be index-related.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm text-gray-700">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What You Can Do</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Collect index metadata, usage, physical, and statistics signals for the active database.</li>
              <li>Classify indexes with a deterministic 0-100 score and a single recommended action.</li>
              <li>Find unused, write-heavy, duplicate, fragmented, or stale-statistics indexes.</li>
              <li>Check drop safety against Query Store dependent queries and constraint guardrails.</li>
              <li>Generate maintenance scripts, export a Markdown report, and run AI analysis for one index.</li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Main Screen Areas</div>
            <ol className="list-decimal pl-5 space-y-1">
              {mainAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 1"
        title="Index Analysis Workspace"
        body="The main screen puts a status line, the filter bar, the sortable index table, and the Index Details panel together. Each row has a checkbox, the table, the index, a color-coded recommended action, reads, and writes. Hovering a cell adds context, such as seeks, scans, lookups, and the read/write ratio on the reads cell. In this capture of the WideWorldImporters demo database, PK_Sales_Customers is selected: its Overview tab lists the score and band, classification, role, type, protection, maintenance need, last use, reads, writes, statistics health, fragmentation, size, data confidence, and key columns, and shows an infinity sign for the read/write ratio because the index has reads but no writes."
        image="/docs/index-advisor/001.png"
        alt="Index Advisor main screen with the filter bar, a sortable index table with recommended action badges, and the Index Details Overview tab for PK_Sales_Customers"
        width={1917}
        height={981}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Analysis Model and Data Sources
        </div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Base Collection</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Collects index metadata, usage DMVs, fragmentation, size, and statistics freshness.</li>
              <li>By default analyzes the top 200 usage-ranked indexes of the active database.</li>
              <li>
                If the primary query fails, a compatibility query is used; under server memory pressure a lightweight
                mode runs without fragmentation and page count data.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Query Store Enrichment</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Loads a 30-day usage trend for the selected index.</li>
              <li>Lists up to five dependent queries whose plans referenced the index in the last 30 days.</li>
              <li>Uses that evidence to estimate drop impact and drop safety.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Deterministic Classes</div>
            <ul className="list-disc pl-5 space-y-1">
              {classifications.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-2">
              Scores map to bands A (90+), B (75+), C (50+), D (25+), and E. Primary key and unique constraint indexes
              are Effective Mandatory with a fixed score of 100. An index that supports a foreign key but has no
              seeks is Weak But Necessary FK, with a score of at least 50. Unnecessary covers exact or leftmost-prefix
              duplicates, indexes with no reads over a counter window longer than 90 days, and write-heavy indexes
              with almost no reads. Needs Maintenance applies when a maintenance signal is present or the score falls
              between 25 and 49. Small non-clustered indexes (under 1,000 rows) lose 10 score points.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Drop Safety States</div>
            <ul className="list-disc pl-5 space-y-1">
              {dropSafetyStates.map((state) => (
                <li key={state.name}>
                  <span className="font-semibold">{state.name}:</span> {state.detail}
                </li>
              ))}
              <li>Each state carries a HIGH, MEDIUM, or LOW confidence and a short reason.</li>
              <li>Safe Drop Candidate still means review first, not immediate removal.</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-700">
          <div className="font-semibold mb-1">Recommended action labels</div>
          <p>
            The Action column reduces classification and maintenance signals to one label, from most to least urgent:{' '}
            {actionLabels.join(', ')}.
          </p>
        </div>
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="font-semibold mb-1">Operational interpretation</div>
          <p>
            Index Advisor is a decision-support surface, not an automatic tuner. The module generates evidence-backed
            recommendations and scripts, but it does not execute the scripts it generates: you copy them and run them
            yourself. Besides reading metadata and usage statistics, the only text it sends to the server is the SQL
            code in an AI answer, which is submitted in parse-only mode to check syntax (see Workflow and Safety).
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Controls and Filters</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Filter Bar</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Search matches table or index names.</li>
              <li>Show selects which rows are listed (see below); the default is All.</li>
              <li>Rows per Page sets 10, 20, 30, or 50 rows per page (default 10).</li>
              <li>Include low-usage risk pool is off by default.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Show Options</div>
            <ul className="list-disc pl-5 space-y-1">
              {showOptions.map((option) => (
                <li key={option.name}>
                  <span className="font-semibold">{option.name}:</span> {option.detail}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Buttons</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>The Refresh button in the top bar reloads the analysis; the module also loads when opened.</li>
              <li>Export Report saves a Markdown (.md) report of the checked rows, or of every row in the current filtered list, not only the current page.</li>
              <li>The info (ⓘ) button shows telemetry for the last refresh.</li>
              <li>Clear Focus appears when the page was opened from Query Statistics.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Table and Selection</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Click the Table, Index, Action, Reads, or Writes header to sort; click again to reverse.</li>
              <li>Clicking a row opens it in Index Details and loads its Query Store activity.</li>
              <li>Row checkboxes build a selection for Export Report, Generate Action Script, and AI analysis.</li>
              <li>Hover a cell for a tooltip: key columns on the table, classification, operational posture, maintenance advisory, reason, and fragmentation on the action, seeks, scans, lookups, and read/write ratio on reads, and updates on writes.</li>
              <li>Pagination shows the visible range and total result count.</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Low-usage risk pool</div>
            <p>
              Off, the analysis covers the top 200 usage-ranked indexes. On, it also adds up to 80 indexes from a
              risk pool that favors large indexes with little read activity and indexes with many updates but few
              reads, so risky indexes are not hidden by the usage ranking. The change applies on the next refresh.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Refresh telemetry</div>
            <p>
              The Last Refresh dialog reports load duration, rows collected and analyzed, whether the fallback or
              lightweight mode was used, context matches, and duplicate-detection and classification timings.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Focus Context from Query Statistics
        </div>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            When you open Index Advisor from a query in{' '}
            <Link href="/docs/modules/query-statistics" className="font-semibold text-primary hover:text-primary-dark">
              Query Statistics
            </Link>
            , the list is narrowed to indexes on the tables referenced by that query&apos;s Query Store plan. If no
            referenced tables are found, the object name is used instead. A banner shows the focus context, and the
            status line reports how many indexes matched.
          </p>
          <p>
            If the query belongs to a different database than the active connection, the banner says so and no
            indexes are matched. Use <strong>Clear Focus</strong> to return to the full list.
          </p>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 2"
        title="Script Tab and Pagination"
        body="The Script tab shows a best-effort CREATE INDEX statement rebuilt from index metadata: uniqueness, type, key and included columns, filter, fill factor, and an ONLINE option that follows the connected edition (ON for Enterprise, Developer, Evaluation, and Azure, otherwise OFF). Even for a primary key it is a CREATE INDEX statement, not the constraint definition, so use it as a reference for the index shape. Copy Script puts it on the clipboard and Generate Action Script replaces it with a batch maintenance script. This capture also shows Rows per Page set to 10 with the page controls, and the Analyze with AI dock below the table."
        image="/docs/index-advisor/002.png"
        alt="Index Advisor with 10 rows per page, the Script tab showing a CREATE UNIQUE CLUSTERED INDEX statement with Copy Script and Generate Action Script buttons, and the Analyze with AI button below the table"
        width={1632}
        height={805}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Index Details Panel</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Overview</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Recommended Action with the deterministic facts behind it.</li>
              <li>Warnings and Recommendations in plain language.</li>
              <li>Usage Trend (30d) from Query Store: total reads, latest sample, change, and executions.</li>
              <li>Drop Safety with its decision, confidence, and reason.</li>
              <li>Dependent Queries with executions, average duration, and logical reads. If Query Store has no matching plans or collection fails, a message says so.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Script</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Shows the reconstructed CREATE INDEX statement for the selected index.</li>
              <li>Copy Script copies the current script to the clipboard.</li>
              <li>Generate Action Script replaces it with a batch maintenance script (see Action script below).</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-700">
          In practice, the best companion modules are{' '}
          <Link href="/docs/modules/query-statistics" className="font-semibold text-primary hover:text-primary-dark">
            Query Statistics
          </Link>{' '}
          for query-level evidence and{' '}
          <Link href="/docs/modules/wait-statistics" className="font-semibold text-primary hover:text-primary-dark">
            Wait Statistics
          </Link>{' '}
          when you need broader workload correlation before taking index action.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">AI Workflow and Exports</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Single-index AI analysis</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Analyze with AI in the dock below the table runs for the selected row, or for one checked row; only
                one index is analyzed at a time.
              </li>
              <li>
                The index is packaged with its deterministic evidence, and the AI provider from{' '}
                <Link href="/docs/settings" className="font-semibold text-primary hover:text-primary-dark">
                  Settings
                </Link>{' '}
                explains the decision. Every run is a fresh analysis; cached results are not reused.
              </li>
              <li>A progress bar and status line track the run, and Cancel stops it.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Decision Cockpit</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>The result opens as an HTML report in the Decision Cockpit window.</li>
              <li>A notice marks partial results (fallback report used) or failed analyses.</li>
              <li>
                Save HTML saves the report; Save LLM JSON saves the request that was sent to the model, for auditing.
                Both open a native Save dialog and write plain-text files.
              </li>
              <li>Re-analyze runs the analysis again for the same index.</li>
              <li>The app keeps only the most recent result, in memory, so save it if you want to keep it.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">What the AI provider receives</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Table and index names as they are, the deterministic evidence (score, classification, usage counters,
                fragmentation, statistics health), the 30-day usage trend, the drop-impact and drop-safety
                assessments, the CREATE INDEX script, and the decision contract.
              </li>
              <li>
                Up to five dependent Query Store statements from the last 30 days, each with the first 400
                characters of its text (which can contain literal values) plus execution count, duration, CPU, and
                logical reads. Execution plan XML is not sent.
              </li>
              <li>
                There is no masking and no approval step. Choose a local model if names or statement text must not
                leave your environment. See{' '}
                <Link href="/security" className="font-semibold text-primary hover:text-primary-dark">
                  Security
                </Link>
                .
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Action script</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Check the rows you want, or leave all unchecked to cover every Needs Attention row in the current
                filtered list, including rows on other pages.
              </li>
              <li>
                The script opens with an Index Action Batch header (time, number of indexes) and a USE statement.
                Per index it can contain UPDATE STATISTICS WITH FULLSCAN, ALTER INDEX REBUILD (ONLINE = ON for
                Enterprise, Developer, Evaluation, and Azure, otherwise OFF), ALTER INDEX REORGANIZE, and fill-factor
                review notes as comments.
              </li>
              <li>
                DROP INDEX is written only when the index&apos;s action policy allows it and its drop safety is Safe
                Drop Candidate. Indexes under a validate or keep policy appear as comment lines only. If nothing
                qualifies, the script says that no direct maintenance or drop action was generated.
              </li>
              <li>The app never runs the script. Copy Script and review it before running anything.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 md:col-span-2">
            <div className="font-semibold mb-1">Markdown report</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Export Report covers the checked rows, or every row in the current filtered list when none are
                checked, and saves a Markdown file through a native Save dialog (default name{' '}
                <span className="font-mono">index_advisor_report_&lt;timestamp&gt;.md</span>).
              </li>
              <li>
                It holds a table of table, index, classification, action policy, maintenance policy, score,
                read/write ratio, and fragmentation, followed by any index consolidation opportunities (a message and
                the estimated space in MB).
              </li>
              <li>Useful as a compact audit or DBA handoff document.</li>
            </ul>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 3"
        title="Decision Cockpit"
        body="Analyze with AI opens its result in the Decision Cockpit window. The report is scrolled here to Telemetry Quality, which states what evidence the analysis actually had, and to the Evidence table, where each signal lists its value, weight, what it supports, and a caveat. The footer offers Re-analyze, Save LLM JSON, Save HTML, and Close. The capture comes from the demo database; complete example reports are linked below."
        image="/docs/index-advisor/003.png"
        alt="Index Advisor Decision Cockpit window for Sales.Customers PK_Sales_Customers, showing the Telemetry Quality section, the Evidence table, and the Re-analyze, Save LLM JSON, Save HTML and Close buttons"
        width={1118}
        height={818}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Example AI Report Downloads</div>
        <p className="text-sm text-gray-700">
          The examples below are standalone HTML reports of the kind that <span className="font-medium">Save HTML</span>{' '}
          exports from the Decision Cockpit, for review, approval, or change planning. All three were generated
          against the WideWorldImporters demo database, not a production system, so read them as examples of the
          format. Each report&apos;s own Telemetry Quality and Decision Contract Guardrails sections say how much
          evidence was available.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {reportDownloads.map((report) => (
            <div key={report.href} className="flex h-full flex-col rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="font-semibold mb-2 text-gray-900">{report.name}</div>
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
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Workflow and Safety</div>
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Typical workflow</div>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Open Index Advisor for the active database, or refresh it from the top bar.</li>
              <li>Narrow the list with Search and Show, and sort by Action, Reads, or Writes.</li>
              <li>Select an index and review Overview, Usage Trend, Drop Safety, and Dependent Queries.</li>
              <li>Run Analyze with AI when you want a written explanation for a single index.</li>
              <li>Check rows and use Generate Action Script or Export Report for multi-index work.</li>
              <li>Validate any drop candidate before making production changes.</li>
            </ol>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Interpretation notes</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>The module does not execute the scripts it generates. When an AI answer contains SQL code blocks, the app submits them to SQL Server in a session with <span className="font-mono">SET PARSEONLY ON</span>, so the server checks the syntax without running them. If parse-only mode cannot be turned on, the check is skipped.</li>
              <li>
                AI analysis has no masking and no approval step. Table and index names, and up to five dependent Query
                Store statement excerpts (up to 400 characters each, possibly with literal values), are sent to the
                selected AI provider. Choose a local model if they must not leave your environment. See{' '}
                <Link href="/security" className="font-semibold text-primary hover:text-primary-dark">
                  Security
                </Link>{' '}
                for what each module sends.
              </li>
              <li>Saved files are plain text on your disk. The LLM JSON file holds the full request that was sent to the model, including the statement excerpts.</li>
              <li>Safe Drop Candidate is a recommendation category, not a production guarantee.</li>
              <li>Query Store-dependent sections are only as good as the available workload evidence.</li>
              <li>Usage DMV counters reset when SQL Server restarts, so a short uptime weakens unused-index evidence.</li>
              <li>Include low-usage risk pool changes the candidate set only after the next refresh.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
