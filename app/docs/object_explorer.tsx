import Link from 'next/link'
import LightboxImage from './LightboxImage'

const detailTabs = [
  'Source Code',
  'Statistics',
  'Relations',
  'AI Tune',
  'Batch AI Tune',
]

const supportedObjects = [
  'Stored Procedures',
  'Views',
  'Functions',
  'Triggers',
  'Tables',
]

const reportDownloads = [
  {
    name: 'AI Report 1: Key Lookup and plan variation',
    href: '/docs/object-explorer/AI_Report_Demo.usp_Test_01_ParameterSniffing_20261004_131853',
    summary:
      'Stored procedure from the WideWorldImporters demo database. Rated HIGH and CPU bound, with two actions (one critical): a covering index to remove Key Lookups on the order tables, and Query Store evidence of five plans for the same query.',
  },
  {
    name: 'AI Report 2: Optional search predicate',
    href: '/docs/object-explorer/AI_Report_Demo.usp_Test_13_PaginationOffsetFetch_20261004_130258',
    summary:
      'Stored procedure from the same demo database. Rated HIGH and CPU bound, with three actions (two critical): an optional-predicate pattern that blocks index seeks, a dynamic SQL rewrite flagged for semantic review, and a covering index.',
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

export default function ObjectExplorerTemplate() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Overview</div>
        <p className="text-sm text-gray-700">
          Object Explorer is the object-level inspection workspace for SQL Server. It lists the user objects of the
          database selected in the <span className="font-medium">Database</span> selector of the top bar, and lets you
          read an object&apos;s definition, check its runtime statistics, see its foreign key and dependency diagrams,
          and run an AI Tune analysis on it, one object at a time or as a batch queue. It makes no data or schema
          changes on SQL Server: it reads metadata and statistics, and the only other text it sends to the server is
          AI-suggested SQL, submitted in parse-only mode to check syntax (see Interpretation Notes and Safety).
        </p>
        <p className="mt-3 text-sm text-gray-700">
          Start here when you already know which procedure, view, function, trigger, or table you want to look at. From{' '}
          <Link href="/docs/modules/query-statistics" className="font-semibold text-primary hover:text-primary-dark">
            Query Statistics
          </Link>
          , the <span className="font-medium">[ Explorer ]</span> link on a query that belongs to a database object
          opens that object here, in the database the query ran in. When the source points toward an indexing change,
          continue in{' '}
          <Link href="/docs/modules/index-advisor" className="font-semibold text-primary hover:text-primary-dark">
            Index Advisor
          </Link>
          .
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm text-gray-700">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What You Can Do</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Browse user objects of the active database, filtered by object type.</li>
              <li>Search by object name with multi-word matching.</li>
              <li>Read the source code, or a generated <span className="font-mono">CREATE TABLE</span> script for tables.</li>
              <li>Check cached execution statistics, Query Store totals, or table size and usage metadata.</li>
              <li>Follow a table&apos;s primary key / foreign key diagram or a stored procedure&apos;s dependency map.</li>
              <li>Run AI Tune on one object, or queue many objects for a Batch AI Tune run.</li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Supported Objects</div>
            <ul className="list-disc pl-5 space-y-1">
              {supportedObjects.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mt-4 mb-2">Detail Tabs</div>
            <p>{detailTabs.join(' · ')}</p>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 1"
        title="Object Explorer Layout"
        body="The left panel holds the Object Type filter, the search box, and the object list with its shown count and the Select shown and Clear buttons. The five detail tabs sit on the right; until an object is selected, the Source Code tab shows a Select an object prompt. This capture lists the user objects of the WideWorldImporters demo database."
        image="/docs/object-explorer/001.png"
        alt="Object Explorer with the Object Type filter, search box and object list on the left, the five detail tabs on the right, and a Select an object prompt in the Source Code tab"
        width={1919}
        height={925}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Left Panel Controls</div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1 text-gray-900">Database (Top Bar)</div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Object Explorer has no database list of its own; it follows the <span className="font-medium">Database</span> selector in the top bar.</li>
              <li>Changing the database there, or pressing <span className="font-medium">Refresh</span>, reloads the object list.</li>
              <li>The <span className="font-medium">↻</span> button in the panel header reloads the list on demand.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1 text-gray-900">Object Type Filter</div>
            <p className="text-sm text-gray-700">
              Narrow the list to <span className="font-medium">All Objects</span>, <span className="font-medium">Stored Procedures</span>, <span className="font-medium">Views</span>, <span className="font-medium">Triggers</span>, <span className="font-medium">Functions</span>, or <span className="font-medium">Tables</span>. Only user objects are listed; objects shipped by Microsoft are excluded.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1 text-gray-900">Search Box</div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Filters the loaded list instantly as you type.</li>
              <li>Splits the text into words and keeps objects whose <span className="font-mono">schema.name</span> contains every word, in any order.</li>
              <li>Matching is case-insensitive.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1 text-gray-900">Object List and Multi-Select</div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Shows objects as <span className="font-mono">schema.object_name</span> with a type icon, plus how many are currently shown.</li>
              <li>Click an object to open it in the detail tabs.</li>
              <li><span className="font-medium">Ctrl+click</span> selects several objects and <span className="font-medium">Shift+click</span> selects a range; <span className="font-medium">Select shown</span> selects every object that matches the current filter and <span className="font-medium">Clear</span> empties the selection.</li>
              <li>The selection feeds <span className="font-medium">Add Selected</span> in Batch AI Tune.</li>
            </ul>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 2"
        title="Source Code Tab"
        body="For the selected object, the Source Code tab shows the definition in a read-only editor with SQL syntax highlighting and line numbers, under a badge that names the object type. Save SQL exports it as a .sql file and Copy Code copies it to the clipboard. The example is a stored procedure from the demo database."
        image="/docs/object-explorer/002.png"
        alt="Object Explorer Source Code tab showing a stored procedure definition with SQL syntax highlighting and line numbers, and the Save SQL and Copy Code buttons"
        width={1679}
        height={910}
      />

      <ScreenshotCard
        eyebrow="Screen 3"
        title="Relations Tab: Table Key Diagram"
        body="For a table, the Relations tab opens on the primary key / foreign key diagram. The selected table sits in the center with its primary key and key columns, the tables whose foreign keys point to it are listed under Referenced by on the left, and the tables it points to are listed under References on the right. In this example a demo table is referenced by 28 tables, each foreign key is flagged no index, and its own foreign key is drawn as a loop. A switch at the top changes to Code dependencies."
        image="/docs/object-explorer/003.png"
        alt="Object Explorer Relations tab showing a primary key and foreign key diagram for a table, with referencing tables on the left, the selected table in the center and a No referenced tables note on the right"
        width={1676}
        height={995}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Relations Diagrams</div>
        <h2 className="text-2xl font-bold text-gray-900">Foreign Key Diagrams and Dependency Maps</h2>
        <p className="mt-3 text-sm text-gray-700">
          Relations turns SQL Server&apos;s own metadata into a one-hop diagram: the selected object sits in the
          center, related objects are drawn as cards on the left and right, and lines connect them. Hovering a card
          highlights its lines, and hovering a line or row shows the details. Each side shows up to 12 cards, with
          a <span className="font-medium">+N more</span> button for the rest.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="font-semibold mb-1 text-gray-900">Tables: PK/FK Key Diagram</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>A switch at the top toggles between <span className="font-medium">Keys (PK/FK)</span> (the default) and <span className="font-medium">Code dependencies</span>, each with a count.</li>
              <li><span className="font-medium">Referenced by</span> (left) lists the tables whose foreign keys point to this table; <span className="font-medium">References</span> (right) lists the tables this table&apos;s foreign keys point to.</li>
              <li>The center card shows the primary key name and the key columns tagged PK, FK, or UQ. <span className="font-medium">Show all N columns</span> and <span className="font-medium">Show key columns only</span> switch between all columns and key columns.</li>
              <li>Lines use crow&apos;s-foot notation: the many end sits on the foreign key, the one end on the primary or unique key. A composite key is drawn as one line, and a self-referencing key as a loop.</li>
              <li>Only declared foreign keys are shown; nothing is guessed from column names. Hover text includes the column mapping and the ON DELETE / ON UPDATE actions.</li>
              <li>Flags point out problems: <span className="font-medium">no index</span> (no index starts with the foreign key columns, so deletes on the parent table and joins scan this table), <span className="font-medium">untrusted</span> (created WITH NOCHECK, so the optimizer cannot rely on it), <span className="font-medium">disabled</span>, and <span className="font-medium">no primary key</span>.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="font-semibold mb-1 text-gray-900">Procedures, Views, Functions and Triggers: Dependency Diagram</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>The center card shows parameters (IN / OUT, and RET for a scalar function&apos;s return type), view columns, or a trigger&apos;s AFTER / INSTEAD OF events.</li>
              <li><span className="font-medium">Depends on</span> (right) lists referenced objects. Table and view cards list the columns read (R), written (W), or both (RW), and flag <span className="font-mono">SELECT *</span>.</li>
              <li><span className="font-medium">Used by</span> (left) lists referencing objects; for a trigger this column is <span className="font-medium">Fired by</span> and shows the parent table and events. When the subject is a table or view, read/write detail is checked for the first 40 referencing objects.</li>
              <li>Line styles tell reads, writes, calls or executes, and plain references apart. Writes cover INSERT, UPDATE, DELETE, and MERGE without separating them.</li>
              <li>Objects in another database or on a linked server, names that do not exist, and caller-dependent or ambiguous names are flagged and cannot be opened.</li>
              <li>Dependencies come from <span className="font-mono">sys.dm_sql_referenced_entities</span> and <span className="font-mono">sys.dm_sql_referencing_entities</span>. If a module cannot be bound (usually because it references a missing object), the diagram falls back to <span className="font-mono">sys.sql_expression_dependencies</span> without column detail and says so.</li>
              <li>The legend states that <span className="font-medium">Dynamic SQL and temp tables are not tracked</span>. When the source contains <span className="font-mono">sp_executesql</span> or <span className="font-mono">EXEC(...)</span>, a note warns that dependencies may be incomplete.</li>
            </ul>
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h3 className="font-semibold mb-1 text-gray-900">Navigating Between Related Objects</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            <li>Click a card title (or focus it and press Enter) to open that object in Relations; the diagram re-centers on it.</li>
            <li>A breadcrumb trail with a <span className="font-medium">← Back</span> button appears above the diagram. Click any step in the trail to jump straight back to it.</li>
            <li><span className="font-medium">Alt+←</span> or the mouse back button also goes back while the Relations tab is visible.</li>
            <li>Going back restores the Keys or Code view, expanded sections, and scroll position. The trail resets when you pick an object from the list or change the database or connection.</li>
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Detail Tabs</div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Source Code</div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Reads procedure, view, function, and trigger definitions from <span className="font-mono">sys.sql_modules</span>.</li>
              <li>Generates a best-effort <span className="font-mono">CREATE TABLE</span> script for tables: columns, data types, NULL/NOT NULL, identity, defaults, computed columns, and the primary key.</li>
              <li>Read-only editor with syntax highlighting, line numbers, and a line count, plus <span className="font-medium">Save SQL</span> and <span className="font-medium">Copy Code</span>.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Statistics</div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Procedures, functions, and triggers: reads <span className="font-mono">sys.dm_exec_procedure_stats</span>, <span className="font-mono">sys.dm_exec_function_stats</span>, <span className="font-mono">sys.dm_exec_trigger_stats</span>, or <span className="font-mono">sys.dm_exec_query_stats</span>, and falls back to Query Store when the plan cache has no rows. The tab shows executions, CPU and duration seconds, logical reads and writes, physical reads, plan count, plan creation time, and last execution, with a Source line that names where the numbers came from.</li>
              <li>Views and inline table-valued functions have no plan of their own, so they show no runtime statistics.</li>
              <li>Tables: rows, reserved and used MB, column and index counts, and created and modified dates, with size from <span className="font-mono">sys.dm_db_partition_stats</span> and last read and write from <span className="font-mono">sys.dm_db_index_usage_stats</span>.</li>
              <li>It is a quick triage view, not a full performance history.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Relations</div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>PK/FK key diagram for tables, dependency diagram for code objects.</li>
              <li>Click a card to open the related object; use Back, the breadcrumb trail, or Alt+← to return.</li>
              <li>Dynamic SQL and temp tables are not tracked, so treat the diagram as SQL Server&apos;s recorded dependencies rather than a complete call graph.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">AI Tune and Batch AI Tune</div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>AI Tune analyzes the selected object with the LLM provider chosen in the top bar.</li>
              <li>Batch AI Tune runs the same analysis over a queue of objects, one after another, and writes a report folder per run.</li>
              <li>Both have a live operation log and a Cancel or Stop button.</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-700">
          The detail workflow is most effective when combined with{' '}
          <Link href="/docs/modules/query-statistics" className="font-semibold text-primary hover:text-primary-dark">
            Query Statistics
          </Link>{' '}
          for query-level evidence and{' '}
          <Link href="/docs/modules/index-advisor" className="font-semibold text-primary hover:text-primary-dark">
            Index Advisor
          </Link>{' '}
          when the inspected source points toward indexing changes.
        </p>
      </div>

      <ScreenshotCard
        eyebrow="Screen 4"
        title="AI Tune: Options, Live Log and Report"
        body="The AI Tune tab keeps the analysis options right above the report: Force Refresh bypasses the analysis cache, Remove SQL Comments (on by default) strips comments from a stored procedure's source before it is sent to the AI, and Use Tuning Memory includes earlier tuning findings for the object in the prompt. Each completed run is recorded in the app's local database whether or not that option is on. Live Operation Log shows the collection and analysis steps, and Cancel stops a running analysis. When the status reads Complete, the report is shown inside the tab with its risk level and bottleneck label, and the footer buttons re-run the analysis, save the report as HTML, Markdown, response contract, or LLM request, or copy its text."
        image="/docs/object-explorer/005.png"
        alt="Object Explorer AI Tune tab after a completed analysis, showing the Force Refresh, Remove SQL Comments and Use Tuning Memory options, a Complete status, the report header with HIGH and CPU BOUND labels, and the Re-run Analysis, Save Report, Save Markdown, Save Contract, Save LLM Request and Copy Text buttons"
        width={1673}
        height={994}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">AI Tune Workflow</div>
        <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700">
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Before and during analysis</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Select an object in the list and open the <span className="font-medium">AI Tune</span> tab.</li>
              <li>Set <span className="font-medium">Force Refresh</span>, <span className="font-medium">Remove SQL Comments</span>, and <span className="font-medium">Use Tuning Memory</span> as needed.</li>
              <li>Click <span className="font-medium">Start Analysis</span>. The collector gathers the evidence it can reach, such as source code, execution statistics, Query Store history, execution plans, existing and missing indexes, dependencies, and parameter sniffing signals.</li>
              <li>Open <span className="font-medium">Live Operation Log</span> to follow each step; the log can be copied or cleared. <span className="font-medium">Cancel</span> stops the run.</li>
              <li>If you select another object while an analysis is running, the result still belongs to the object it started on.</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">After analysis</div>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-medium">Save Report</span> saves the HTML report.</li>
              <li><span className="font-medium">Save Markdown</span> saves the analysis as a <span className="font-mono">.md</span> file, and <span className="font-medium">Copy Text</span> copies it to the clipboard.</li>
              <li><span className="font-medium">Save Contract</span> saves the structured response contract as JSON.</li>
              <li><span className="font-medium">Save LLM Request</span> saves the request sent to the AI as JSON, for audit or debugging.</li>
              <li><span className="font-medium">Re-run Analysis</span> runs again and passes the previous result along as context. Returning to the same object shows its last analysis.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Batch AI Tune</div>
        <h2 className="text-2xl font-bold text-gray-900">Batch Analysis Queue</h2>
        <p className="mt-3 text-sm text-gray-700">
          Batch AI Tune analyzes a queue of objects one after another and saves the results to disk, so you can review a
          set of stored procedures without starting each analysis by hand.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm text-gray-700">
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Building and running the queue</div>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-medium">Add Current</span> adds the open object; <span className="font-medium">Add Selected (N)</span> adds every object selected with Ctrl+click or Shift+click. Objects already in the queue are skipped.</li>
              <li>Remove single entries with <span className="font-medium">×</span>, or empty the queue with <span className="font-medium">Clear</span>.</li>
              <li>Choose the output folder with <span className="font-medium">Browse</span>. By default it points to a batch reports folder in the app&apos;s per-user data folder.</li>
              <li><span className="font-medium">Pause (s)</span> sets the wait between analyses. It is prefilled from Settings (10 seconds by default, up to 3600).</li>
              <li>Options: <span className="font-medium">Force Refresh</span> and <span className="font-medium">Remove SQL Comments</span> (both on by default), and <span className="font-medium">Use Tuning Memory</span> (off by default).</li>
              <li><span className="font-medium">Run Queue</span> starts the run and <span className="font-medium">Stop</span> cancels it. The queue and options are locked while it runs.</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Progress and output</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>The status badge shows the current position (for example <span className="font-mono">[3/12]</span>) and stage, next to a progress bar and a live operation log.</li>
              <li>A failed object raises a notification, and the run ends with a summary if any objects failed or were only partly analyzed.</li>
              <li>Each run creates a time-stamped folder with an <span className="font-mono">index.html</span> overview, <span className="font-mono">run_summary.json</span>, and <span className="font-mono">raw_plan_manifest.json</span>, plus one subfolder per object. An object folder holds its HTML report, response contract, LLM request, LLM diagnostics, a status file, and the raw execution plan XML when one was captured; a failed object also gets an <span className="font-mono">error.txt</span>.</li>
              <li>Leaving Object Explorer does not stop a running batch; the result is shown when you come back. Closing the application cancels it.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Example AI Report Downloads</div>
        <p className="text-sm text-gray-700">
          The examples below are standalone HTML reports of the kind that <span className="font-medium">Save Report</span>{' '}
          exports from AI Tune, for review, tuning discussions, or audit trails. Both were generated against the
          WideWorldImporters demo database, not a production system, so read them as examples of the format. Each
          report&apos;s own confidence and review sections say how much evidence was available.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
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
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Typical Workflow</div>
        <ol className="text-sm text-gray-700 list-decimal pl-5 space-y-1">
          <li>Pick the target database in the top bar.</li>
          <li>Filter by object type and search to find the object.</li>
          <li>Read the definition, or the generated table script, in Source Code.</li>
          <li>Check execution statistics or table metadata in Statistics.</li>
          <li>Check the foreign keys or dependencies in Relations, and click through to related objects.</li>
          <li>Run AI Tune and save the report, or queue several objects in Batch AI Tune.</li>
        </ol>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Interpretation Notes and Safety
        </div>
        <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
          <li>The generated table script is best-effort; it does not replace a full scripting tool.</li>
          <li>No execution data in Statistics does not mean the object is unused: the plan cache is cleared on restart and under memory pressure, and Query Store may be off.</li>
          <li>Relations shows what SQL Server records as dependencies. Dynamic SQL and temp tables are not tracked.</li>
          <li>AI Tune output depends on the evidence it could collect; check the report&apos;s confidence section before acting on a recommendation.</li>
          <li>Object Explorer reads metadata and statistics and does not change objects, and AI recommendations are never applied automatically. When an AI answer contains SQL code blocks, the app submits them to SQL Server in a session with <span className="font-mono">SET PARSEONLY ON</span>, so the server checks the syntax without running them. If parse-only mode cannot be turned on, the check is skipped.</li>
          <li>
            AI Tune has no masking and no approval step. The full source code, the execution plan XML, and plan
            parameter values are part of what is sent to the selected AI provider, so choose a local model if object
            names or literal values must not leave your environment. See{' '}
            <Link href="/security" className="font-semibold text-primary hover:text-primary-dark">
              Security
            </Link>{' '}
            for what each module sends.
          </li>
          <li>Remove SQL Comments applies to stored procedures only. For views, functions, and triggers, comments in the source are sent as they are.</li>
          <li>Saved files are plain text on your disk. LLM request files hold what was sent to the AI, including source code, execution plans, and parameter values, and the default batch folder sits under your Windows user profile.</li>
        </ul>
      </div>
    </div>
  )
}
