import Link from 'next/link'
import LightboxImage from './LightboxImage'

const mainAreas = [
  'Status line, with a focus banner and Clear Focus when the page was opened from Query Statistics',
  'Filter bar: Search, Show, Rows per Page, Include low-usage risk pool, Export Report, and the ⓘ Last Refresh button',
  'Paginated, sortable index table with a selection counter and page controls',
  'AI dock under the table: Analyze with AI, Mask names, Cancel, Open last report, Save LLM JSON, and Save HTML',
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
      'The index overlaps another one (duplicate, leftmost prefix, or subset) with an estimated impact of 5% or less, or it shows no reads and no dependent queries with an impact of 2% or less. The observation window must also be long enough: at least 7 days with reads in the 30-day trend, or an index proven to be at least 30 days old.',
  },
]

const actionLabels = [
  { name: 'Drop candidate', detail: 'An Unnecessary index with none of the protections below.' },
  {
    name: 'Review (short window)',
    detail: 'An Unnecessary index while the usage counters cover less than 90 days since the SQL Server start.',
  },
  {
    name: 'Review (replica workload not visible)',
    detail: 'An Unnecessary index on a database with more than one Always On replica, whose reads on other replicas are not visible.',
  },
  { name: 'Rebuild needed / Reorganize needed', detail: 'A rebuild or reorganize recommendation (thresholds below).' },
  { name: 'Update statistics', detail: 'A statistics freshness advisory.' },
  { name: 'Maintenance review', detail: 'Another maintenance advisory, or the Needs Maintenance class.' },
  { name: 'Review', detail: 'A Weak index.' },
  {
    name: 'Keep (unique) / Keep (FK support)',
    detail:
      'An index that backs a unique constraint or primary key, or supports a foreign key, so low usage alone does not make it removable.',
  },
  { name: 'Healthy', detail: 'Effective or Effective Mandatory with no maintenance signal.' },
]

const showOptions = [
  { name: 'All', detail: 'Every analyzed index (the default).' },
  {
    name: 'Needs Attention',
    detail:
      'Unnecessary or Needs Maintenance classes, scores below 50, or rows with a maintenance flag, warning, or recommendation such as fragmentation or stale statistics.',
  },
  { name: 'Drop Candidates', detail: 'Rows whose Action badge is Drop candidate.' },
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

export default function IndexAdvisorTemplate() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Overview</div>
        <p className="text-sm text-gray-700">
          Index Advisor is the SQL Server index review and maintenance planning module. It classifies the indexes of
          the active database with a deterministic scoring model, adds Query Store evidence such as a 30-day usage
          trend and dependent queries, and assesses drop safety before you consider removing an index. An optional AI
          analysis can then explain the decision for a single index, with database, schema, table, and index names
          masked by default.
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
              <li>Generate an action script for review, export a Markdown report, and run AI analysis for one index.</li>
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
        body={
          <>
            <p>The main screen after a refresh of the WideWorldImporters demo database, with no index selected yet.</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Status line:</strong> how many indexes were analyzed, the load time, and the candidate pool
                (usage-ranked here), then how many days the usage counters cover since the SQL Server start. This
                capture shows 7.8 days, so the line adds the short-window warning that unused-index findings may be
                incomplete.
              </li>
              <li>
                <strong>Filter bar:</strong> Search table or index, Show (All), Rows per Page (10), Include low-usage
                risk pool (off), Export Report, and the ⓘ Last Refresh button.
              </li>
              <li>
                <strong>Index table:</strong> a checkbox, Table, Index, the color-coded Action badge (Update
                statistics, Healthy, and Reorganize needed on this page), Reads, and Writes, with page 8 active in the
                page controls.
              </li>
              <li>
                <strong>AI dock:</strong> Analyze with AI, Mask names (checked, its default), Open last report, Save
                LLM JSON, and Save HTML, with the status &quot;Select an index to analyze.&quot;
              </li>
              <li>
                <strong>Index Details:</strong> empty until a row is clicked.
              </li>
            </ul>
          </>
        }
        image="/docs/index-advisor/001.png"
        alt="Index Advisor main screen with the status line, the filter bar, a page of indexes with Update statistics, Healthy and Reorganize needed badges, the AI dock with Mask names checked, and an empty Index Details panel"
        width={1632}
        height={807}
      />

      <ScreenshotCard
        eyebrow="Screen 2"
        title="Index Details Overview"
        body={
          <>
            <p>
              Clicking a row opens it in Index Details. Here Sales.InvoiceLines.FK_Sales_InvoiceLines_InvoiceID is
              selected and checked.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Decision:</strong> Recommended Action Healthy, Score 91 [A], Classification EFFECTIVE with its
                reason, and Index Role Foreign Key Support.
              </li>
              <li>
                <strong>Protection:</strong> &quot;Review dependencies before removal; this index supports a foreign
                key.&quot;
              </li>
              <li>
                <strong>Usage and physical state:</strong> last use, 22,317 seeks with no scans or lookups, 7,439
                writes, a read/write ratio of 3.00, statistics updated three days earlier with 13,581 modifications,
                6.37% fragmentation over 3,420 pages, and 26.72 MB.
              </li>
              <li>
                <strong>Data Confidence:</strong> Full, which means usage, statistics, and fragmentation metrics were
                all available. Key column InvoiceID, no included columns.
              </li>
              <li>
                <strong>Recommendations:</strong> &quot;Keep the index and continue monitoring workload usage.&quot;
                Below it, the Query Store usage trend and dependent queries are still loading.
              </li>
              <li>
                <strong>Selection:</strong> the table footer reads &quot;1 selected&quot; with a Clear selection
                button.
              </li>
            </ul>
          </>
        }
        image="/docs/index-advisor/002.png"
        alt="Index Advisor with FK_Sales_InvoiceLines_InvoiceID checked and its Index Details Overview showing Healthy, score 91 [A], EFFECTIVE classification, foreign key support, usage, statistics, fragmentation and data confidence"
        width={1613}
        height={939}
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
              <li>
                Analyzes up to 200 indexes of the active database, ranked by usage. The low-usage risk pool can add up
                to 80 more (see Controls and Filters).
              </li>
              <li>
                If the collection times out or the server is short of memory, a lightweight mode runs without
                fragmentation and page count data. Other failures fall back to a compatibility query (without index
                selectivity data) and then to lightweight mode. The status line names the mode that was used.
              </li>
              <li>
                Each index gets a Data Confidence of Full, Partial, or Limited, depending on which of these metrics
                were available.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Usage Window and Query Store</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Usage counters reset when SQL Server restarts. The status line reports how many days they cover and
                warns when that is under 90 days.
              </li>
              <li>
                When Always On is detected with more than one replica, the status line says so, because reads on
                other replicas are not visible here.
              </li>
              <li>Query Store adds a 30-day usage trend for the selected index.</li>
              <li>
                It also lists up to five dependent queries whose plans referenced the index in the last 30 days, and
                uses that evidence to estimate drop impact and drop safety.
              </li>
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
              duplicates, indexes with no reads over a counter window longer than 90 days, write-heavy indexes with
              almost no reads, and scores below 25. Needs Maintenance applies when a maintenance signal is present or
              the score falls between 25 and 49. Small non-clustered indexes (under 1,000 rows) lose 10 score points.
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
          <p className="mb-2">
            The Action column reduces classification and maintenance signals to one label. Sorted by Action, the most
            urgent labels come first:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            {actionLabels.map((label) => (
              <li key={label.name}>
                <span className="font-semibold">{label.name}:</span> {label.detail}
              </li>
            ))}
          </ul>
          <p className="mt-2">
            Rebuild needed and Reorganize needed follow the analyzer&apos;s recommendation. Without one, an index
            needs at least 10% fragmentation on at least 1,000 pages: under 5,000 pages it gets Reorganize needed,
            larger indexes get Rebuild needed from 30% fragmentation and Reorganize needed below that.
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
              <li>Show selects which rows are listed (see below).</li>
              <li>Rows per Page sets 10, 20, 30, or 50 rows per page (default 10).</li>
              <li>Include low-usage risk pool is off by default; your choice is kept when you leave and return to the screen while the app runs.</li>
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
              <li>
                Export Report saves a Markdown (.md) report of the checked rows, or of every row that matches the
                current filter across all pages.
              </li>
              <li>
                The ⓘ button opens the Last Refresh telemetry. It stays disabled until a refresh has completed.
              </li>
              <li>Clear Focus appears when the page was opened from Query Statistics.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Table and Selection</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Click the Table, Index, Action, Reads, or Writes header to sort (▲/▼); click again to reverse.
              </li>
              <li>
                Clicking a row, or pressing Enter or Space on it, opens it in Index Details and loads its Query Store
                activity.
              </li>
              <li>
                Row checkboxes build a selection for Export Report, Generate Action Script, and AI analysis. The header
                checkbox selects the current page.
              </li>
              <li>
                The footer shows the visible range (&quot;Showing 1–10 of N results&quot;), the selection count with
                Clear selection, and page controls. Checked rows that the current filter hides stay selected and are
                counted as hidden by filter.
              </li>
              <li>
                Hover a cell for details: key columns on the table, the reasons behind the action, seeks, scans, and
                lookups on reads, and user updates on writes.
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Low-usage risk pool</div>
            <p>
              Off, the analysis covers the top 200 usage-ranked indexes. On, it also adds up to 80 indexes from a
              risk pool that favors large indexes with little read activity and indexes with many updates but few
              reads, so risky indexes are not hidden by the usage ranking. Toggling it updates the status line with a
              reminder; the change applies on the next refresh.
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

      <ScreenshotCard
        eyebrow="Screen 3"
        title="Narrowed List and Selection"
        body={
          <>
            <p>
              A narrowed list of six Application.People and Application.People_Archive indexes. The filter bar is
              outside this crop.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Action badges:</strong> Update statistics for three indexes with reads, and Review (short
                window) for three Unnecessary indexes with no reads, because the usage counters cover less than 90
                days.
              </li>
              <li>
                <strong>Selection:</strong> PK_Application_People is checked, and the footer reads &quot;2 selected (1
                hidden by filter)&quot;: a row checked earlier stays selected even though the current filter hides it.
              </li>
              <li>
                <strong>Footer:</strong> &quot;Showing 1–6 of 6 results&quot;, Clear selection, and a single page.
              </li>
            </ul>
          </>
        }
        image="/docs/index-advisor/006.png"
        alt="Index Advisor table narrowed to six Application.People indexes with Update statistics and Review (short window) badges, one row checked, and the footer showing 2 selected (1 hidden by filter)"
        width={1265}
        height={751}
        maxWidthClass="max-w-5xl"
        sizes="(min-width: 1024px) 1024px, 100vw"
      />

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
            , the list is narrowed to indexes on the tables referenced by that query&apos;s Query Store plan,
            matched with their schema. If no referenced tables are found, the object name is used instead. A banner
            names the focus tables (the first three, then a count of the rest) and the query they came from.
          </p>
          <p>
            If the query belongs to a different database than the active connection, the banner says so and no
            indexes are matched. If the tables cannot be determined at all, the banner says the list is not filtered.
            Use <strong>Clear Focus</strong> to return to the full list.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Index Details Panel</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Overview</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Recommended Action with the deterministic facts behind it (see Screen 2).</li>
              <li>Warnings and Recommendations in plain language.</li>
              <li>
                Usage Trend (30d) from Query Store: Total Reads, Latest Sample, Change, and Executions. Without
                matching plans, a message says that no Query Store plan referenced the index in the last 30 days.
              </li>
              <li>Drop Safety with its decision, confidence, and reason.</li>
              <li>
                Dependent Queries (up to five, from the last 30 days) with executions, average duration, and logical reads. The statement
                text is shown on one line and shortened to 240 characters.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Script</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Shows a CREATE INDEX statement rebuilt from index metadata: uniqueness, type, key and included
                columns, filter, fill factor, and an ONLINE option that follows the connected edition (ON for Azure,
                Enterprise, Developer, and Evaluation, otherwise OFF).
              </li>
              <li>
                It starts with a comment marking it as a re-creation draft: compression, partitioning, filegroup, and
                sort direction are not included, so review it before use. Even for a primary key it is a CREATE INDEX
                statement, not the constraint definition.
              </li>
              <li>Copy Script copies the current script to the clipboard.</li>
              <li>Generate Action Script replaces it with a batch action script (see Screen 4).</li>
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

      <ScreenshotCard
        eyebrow="Screen 4"
        title="Action Script"
        body={
          <>
            <p>
              Generate Action Script replaced the Script tab content with a batch script for the single checked row
              from Screen 2. The server line is blurred in this capture.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Header:</strong> Index Action Batch, Generated, Server, Database (WideWorldImporters), and
                Selected Indexes, followed by a USE statement and GO.
              </li>
              <li>
                <strong>Maintenance note:</strong> the keep/drop policy is separate from the maintenance policy, so a
                mandatory index may still need statistics maintenance.
              </li>
              <li>
                <strong>Keep line:</strong> the index supports referential integrity, and its drop safety is
                DO_NOT_DROP because it is constraint-backed or supports referential integrity.
              </li>
              <li>
                <strong>Closing note:</strong> no direct maintenance or drop action was generated for the selected
                rows, so the script contains only comments.
              </li>
            </ul>
          </>
        }
        image="/docs/index-advisor/003.png"
        alt="Index Advisor Script tab showing an Index Action Batch for FK_Sales_InvoiceLines_InvoiceID with a blurred server line, a maintenance note, a keep line with DO_NOT_DROP drop safety, and the Copy Script and Generate Action Script buttons"
        width={352}
        height={622}
        maxWidthClass="max-w-xs"
        sizes="320px"
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">AI Workflow and Exports</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Single-index AI analysis</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Analyze with AI runs for the selected row, or for one checked row. With several rows checked the app
                asks you to select a single index; if the checked row differs from the row open in Index Details, it
                asks whether to analyze the checked one.
              </li>
              <li>
                The index is packaged with its deterministic evidence, and the AI provider configured in{' '}
                <Link href="/docs/settings" className="font-semibold text-primary hover:text-primary-dark">
                  Settings
                </Link>{' '}
                explains the decision. Every run is a fresh analysis; cached results are not reused.
              </li>
              <li>
                A progress bar and status line track the run. Cancel appears only while it runs. When it finishes,
                the status names the index, the provider and model, and the duration.
              </li>
              <li>
                Leaving the screen cancels a running analysis and clears the last result, so save a report before you
                move on.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Mask names</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Checked by default every time the screen opens, and locked while an analysis runs. Database, schema,
                table, and index names are replaced with aliases such as TBL_001 throughout the request, including the
                statement text, and put back in the answer you see.
              </li>
              <li>
                Common schema and system names (such as dbo and sys), names shorter than three characters, and names
                with unusual characters are not aliased; the status line warns when some names could not be masked.
              </li>
              <li>Column names and literal values in statement text are not masked.</li>
              <li>Unchecked, real names are sent. Turn it off only for a local model or a provider you trust.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">What the AI provider receives</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                The deterministic evidence (score, classification, usage counters, fragmentation, statistics health),
                the 30-day usage trend, the drop-impact and drop-safety assessments, the decision contract, and the
                CREATE INDEX script.
              </li>
              <li>
                Context from the same table: its other indexes, missing-index suggestions from the DMVs, and a column
                usage heatmap.
              </li>
              <li>
                Up to five dependent Query Store statements from the last 30 days, each with the first 400
                characters of its text (which can contain literal values) plus execution count, duration, CPU, logical
                reads, and last execution time. Execution plan XML is not sent.
              </li>
              <li>
                There is no approval step before sending. See{' '}
                <Link href="/security" className="font-semibold text-primary hover:text-primary-dark">
                  Security
                </Link>{' '}
                for what each module sends.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Decision Cockpit</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                The result opens as an HTML report in the Decision Cockpit window. The report is shown without running
                scripts.
              </li>
              <li>A notice marks partial results (fallback report used) or failed analyses.</li>
              <li>
                Re-analyze runs the analysis again for the same index. Copy SQL copies the SQL blocks in the report,
                or says that there are none.
              </li>
              <li>
                Save LLM JSON saves the request that was sent to the model, for auditing; with Mask names on, this is
                the masked copy. Save HTML saves the report with real names. Both open a native Save dialog.
              </li>
              <li>Close, the × button, or Esc closes the window; Open last report reopens it.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Action script</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Check the rows you want, or leave all unchecked to cover every Needs Attention row that matches the
                current filter, including rows on other pages.
              </li>
              <li>
                The script opens with an Index Action Batch header (generated time, server, database, number of
                selected indexes) and a USE statement.
              </li>
              <li>
                Per index it can contain UPDATE STATISTICS WITH FULLSCAN, ALTER INDEX REBUILD with the edition&apos;s
                ONLINE option, ALTER INDEX REORGANIZE, and maintenance notes as comments. Rebuild and reorganize need
                at least 1,000 pages; disabled indexes get neither, and columnstore indexes get only REORGANIZE and no
                statistics update.
              </li>
              <li>
                DROP INDEX IF EXISTS is written only when the index&apos;s action policy allows it and its drop safety
                is Safe Drop Candidate, preceded by a rollback comment to script the CREATE INDEX definition first.
                Indexes under a validate or keep policy appear as comment lines only.
              </li>
              <li>The app never runs the script. Copy Script and review it before running anything.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Markdown report</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Export Report covers the checked rows, or every row that matches the current filter when none are
                checked, and saves a Markdown file through a native Save dialog (default name{' '}
                <span className="font-mono">index_advisor_report_&lt;timestamp&gt;.md</span>).
              </li>
              <li>
                It starts with the generation time, server, database, and row count, followed by a table of table,
                index, classification, action policy, maintenance policy, score, read/write ratio, and fragmentation,
                with index consolidation opportunities (a message and the estimated space in MB) where found.
              </li>
              <li>Useful as a compact audit or DBA handoff document.</li>
            </ul>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 5"
        title="AI Dock After an Analysis"
        body={
          <>
            <p>
              The AI dock after an analysis of FK_Sales_InvoiceLines_InvoiceID finished. The red frame is an
              annotation in the original capture, not part of the app.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Status:</strong> &quot;AI analysis ready for&quot; the index key, followed by the provider
                profile, the model, and the run time (103.2 s here).
              </li>
              <li>
                <strong>Mask names:</strong> unchecked in this capture. It is checked again by default the next time
                the screen opens.
              </li>
              <li>
                <strong>Buttons:</strong> Analyze with AI, Open last report, Save LLM JSON, and Save HTML. Cancel is
                hidden because no analysis is running.
              </li>
              <li>
                <strong>Table:</strong> page 9 of the list, with Update statistics, Reorganize needed, and Keep (FK
                support) badges, and one row selected.
              </li>
            </ul>
          </>
        }
        image="/docs/index-advisor/004.png"
        alt="Index Advisor AI dock framed in red with Analyze with AI, an unchecked Mask names box, Open last report, Save LLM JSON and Save HTML, and a status line reporting that the AI analysis is ready"
        width={1279}
        height={812}
        maxWidthClass="max-w-5xl"
        sizes="(min-width: 1024px) 1024px, 100vw"
      />

      <ScreenshotCard
        eyebrow="Screen 6"
        title="Decision Cockpit"
        body={
          <>
            <p>
              The result of that analysis in the Decision Cockpit window, titled with the index key and scrolled to
              the Evidence table. The capture comes from the demo database; complete example reports are linked
              below.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Telemetry note:</strong> Query Store dependent queries are present (21 trend points), but they
                are not a full runtime baseline, so exact duration or CPU deltas should not be extrapolated.
              </li>
              <li>
                <strong>Evidence table:</strong> each signal with its value, weight, what it supports, and a caveat,
                for example native_classification EFFECTIVE, drop_safety_decision DO_NOT_DROP, telemetry_quality
                Partially supported, and computed_recommendations MONITOR_AND_KEEP.
              </li>
              <li>
                <strong>Footer:</strong> Re-analyze, Copy SQL, Save LLM JSON, Save HTML, and Close.
              </li>
            </ul>
          </>
        }
        image="/docs/index-advisor/005.png"
        alt="Index Advisor Decision Cockpit for Sales.InvoiceLines.FK_Sales_InvoiceLines_InvoiceID showing a telemetry note, the Evidence table, and the Re-analyze, Copy SQL, Save LLM JSON, Save HTML and Close buttons"
        width={1118}
        height={819}
        maxWidthClass="max-w-4xl"
        sizes="(min-width: 1024px) 896px, 100vw"
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Example AI Report Downloads</div>
        <p className="text-sm text-gray-700">
          The examples below are standalone HTML reports of the kind that <span className="font-medium">Save HTML</span>{' '}
          exports from the Decision Cockpit, for review, approval, or change planning. All three were generated
          against the WideWorldImporters demo database with an earlier version of the app, not a production system,
          so read them as examples of the format. Each report&apos;s own Telemetry Quality and Decision Contract
          Guardrails sections say how much evidence was available.
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
              <li>Check the status line for the counter window, Always On, and fallback notes.</li>
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
              <li>
                The module does not execute the scripts it generates. When an AI answer contains SQL code blocks, the
                app submits them to SQL Server in a separate batch with{' '}
                <span className="font-mono">SET PARSEONLY ON</span>, so the server checks the syntax without running
                them. If parse-only mode cannot be turned on, the check is skipped.
              </li>
              <li>
                Mask names hides database, schema, table, and index names, but column names and literal values in the
                dependent statement excerpts (up to 400 characters each) are still sent to the selected AI provider.
                Choose a local model if they must not leave your environment.
              </li>
              <li>
                Saved files are plain text on your disk. The LLM JSON file holds the request that was sent to the
                model, including the statement excerpts; the HTML report uses real names.
              </li>
              <li>Safe Drop Candidate is a recommendation category, not a production guarantee.</li>
              <li>Query Store-dependent sections are only as good as the available workload evidence.</li>
              <li>
                Usage DMV counters reset when SQL Server restarts, so a short uptime weakens unused-index evidence;
                that is why such indexes show Review (short window) instead of Drop candidate.
              </li>
              <li>Include low-usage risk pool changes the candidate set only after the next refresh.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
