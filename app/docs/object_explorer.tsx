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
  'Stored procedures, including CLR procedures',
  'Views',
  'Functions: scalar, inline and multi-statement table-valued, and CLR functions',
  'DML triggers, including CLR triggers',
  'User tables',
]

const collectionSteps = [
  'Source Code',
  'Execution Stats',
  'Missing Indexes',
  'Dependencies',
  'Query Store',
  'Execution Plan',
  'Plan Insights',
  'Existing Indexes',
  'View Metadata',
  'Parameter Sniffing',
  'Historical Trend',
  'Memory Grants',
  'Post-Collection Analysis',
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
          changes on SQL Server and never executes the objects it inspects: it reads metadata and statistics, and the
          only other text it sends to the server is AI-suggested SQL, submitted in parse-only mode to check syntax (see
          Interpretation Notes and Safety).
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
              <li>Search by object name with multi-word matching that ignores case and accents.</li>
              <li>Read the source code, or a generated <span className="font-mono">CREATE TABLE</span> script for tables.</li>
              <li>Check cached execution statistics, Query Store totals, or table size and usage metadata.</li>
              <li>Follow a table&apos;s primary key / foreign key diagram or a code object&apos;s dependency map.</li>
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
            <p className="mt-2">
              Objects shipped by Microsoft are left out, and the <span className="font-mono">model</span> and{' '}
              <span className="font-mono">tempdb</span> databases are not offered.
            </p>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mt-4 mb-2">Detail Tabs</div>
            <p>{detailTabs.join(' · ')}</p>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 1"
        title="Object Explorer Layout"
        body={
          <>
            <p>
              The left panel finds the object and the right panel shows it. In this capture the list is filtered to the
              stored procedures of the WideWorldImporters demo database, and one procedure is open in the Source Code tab.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Filters:</strong> the header shows 154 objects and a badge with the active database, next to the
                ↻ button that reloads the list.
              </li>
              <li>
                <strong>Object Type and Search:</strong> the type list is set to Stored Procedures, and the search box is
                empty.
              </li>
              <li>
                <strong>Objects:</strong> 154 shown and 0 selected, with the Select shown and Clear buttons. Each row
                carries a type symbol and the schema-qualified name.
              </li>
              <li>
                <strong>Detail tabs:</strong> Source Code, Statistics, Relations, AI Tune and Batch AI Tune, above a badge
                that names the object type (SQL STORED PROCEDURE).
              </li>
              <li>
                <strong>Source Code:</strong> the definition in a read-only editor with line numbers and syntax
                highlighting, the Save SQL and Copy Code buttons, and a status line reading 197 lines · SQL · Read only
                and UTF-8 · CRLF.
              </li>
            </ul>
          </>
        }
        image="/docs/object-explorer/001.png"
        alt="Object Explorer with the Filters panel set to Stored Procedures in the WideWorldImporters database, a list of 154 procedures, and a selected procedure's definition in the Source Code tab with Save SQL and Copy Code buttons"
        width={1652}
        height={923}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Left Panel Controls</div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1 text-gray-900">Database (Top Bar)</div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Object Explorer has no database list of its own; it follows the <span className="font-medium">Database</span> selector in the top bar.</li>
              <li>Changing the server or database reloads the list, clears the selection, and empties the Batch AI Tune queue.</li>
              <li>The <span className="font-medium">↻</span> button in the panel header reloads the list on demand. The header shows how many objects are loaded and which database they come from.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1 text-gray-900">Object Type Filter</div>
            <p className="text-sm text-gray-700">
              Narrow the list to <span className="font-medium">All Objects</span> (the default),{' '}
              <span className="font-medium">Stored Procedures</span>, <span className="font-medium">Views</span>,{' '}
              <span className="font-medium">Triggers</span>, <span className="font-medium">Functions</span>, or{' '}
              <span className="font-medium">Tables</span>. Changing the type reloads the list from the server.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1 text-gray-900">Search Box</div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Splits the text into words and keeps objects whose <span className="font-mono">schema.name</span> contains every word, in any order.</li>
              <li>Matching ignores case and accents.</li>
              <li>Filters as you type. With more than 500 objects loaded, it waits for a short pause in typing.</li>
              <li>When nothing matches, the list reads <span className="font-medium">No matching objects</span>.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1 text-gray-900">Object List and Multi-Select</div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Rows show a type symbol (◆ procedure, ▤ table, ◫ view, ƒ function, T trigger) and the <span className="font-mono">schema.name</span>.</li>
              <li>The list draws 500 rows at a time; <span className="font-medium">Show N more</span> adds the next batch.</li>
              <li>Click an object to open it. <span className="font-medium">Ctrl+click</span> toggles it in the selection without opening it, and <span className="font-medium">Shift+click</span> selects a range.</li>
              <li><span className="font-medium">Select shown</span> selects every object that matches the current filter, and <span className="font-medium">Clear</span> empties the selection.</li>
              <li>With the keyboard, ↑ and ↓ move the focus, Home and End jump to the first and last row, and Enter or Space act like a click.</li>
              <li>The selection feeds <span className="font-medium">Add Selected</span> in Batch AI Tune.</li>
            </ul>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 2"
        title="Statistics Tab"
        body={
          <>
            <p>
              The Statistics tab gives a quick runtime summary of the open object. This capture shows the same stored
              procedure after one execution.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Tiles:</strong> Executions 1, CPU Seconds 7.32 s, Duration Seconds 7.6 s, Logical Reads 5,787,483,
                Logical Writes 11,889, Physical Reads 384, Plans 1, and Plan Created and Last Execution both at 2026-10-07
                17:00:01.
              </li>
              <li>
                <strong>Source line:</strong> Source: Dm Exec Procedure Stats names the plan cache view the numbers came
                from. When the plan cache has nothing for the object and Query Store is on, the line reads Query Store
                instead.
              </li>
            </ul>
          </>
        }
        image="/docs/object-explorer/002.png"
        alt="Object Explorer Statistics tab for a stored procedure with tiles for executions, CPU and duration seconds, logical reads and writes, physical reads, plans, plan creation and last execution, and a Source line naming the plan cache view"
        width={1262}
        height={419}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Detail Tabs</div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Source Code</div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Reads procedure, view, function, and trigger definitions from <span className="font-mono">sys.sql_modules</span> and shows them in full.</li>
              <li>For tables, generates a best-effort <span className="font-mono">CREATE TABLE</span> script: columns, data types, NULL/NOT NULL, identity, defaults, computed columns, and the primary key. Its header says it is generated and that indexes, foreign keys, CHECK and UNIQUE constraints, collations, and NOT FOR REPLICATION are not included.</li>
              <li>When there is no definition to show, the editor says why: it is encrypted (WITH ENCRYPTION), it is hidden from this login (grant VIEW DEFINITION), or the object has no T-SQL definition, as with CLR objects.</li>
              <li><span className="font-medium">Save SQL</span> opens a save dialog in your home folder and writes a <span className="font-mono">.sql</span> file in UTF-8 with the line endings kept. <span className="font-medium">Copy Code</span> copies the text to the clipboard.</li>
              <li>The status line shows the line count, Read only, and whether the text uses LF or CRLF line endings.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Statistics</div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Procedures read <span className="font-mono">sys.dm_exec_procedure_stats</span>, functions <span className="font-mono">sys.dm_exec_function_stats</span>, and triggers <span className="font-mono">sys.dm_exec_trigger_stats</span>, with <span className="font-mono">sys.dm_exec_query_stats</span> as a further source. When the plan cache has no rows, Query Store is used if it is in read-write or read-only mode. The values are totals.</li>
              <li>Views and inline table-valued functions show <span className="font-medium">No plan of its own</span>: SQL Server expands them into the calling query and keeps no statistics for them.</li>
              <li>An object with no numbers shows <span className="font-medium">No recorded executions</span> when Query Store is on, or <span className="font-medium">No cached statistics</span> when it is off.</li>
              <li>Tables show Rows, Reserved MB, Used MB, Columns, Indexes, Created, Modified, Last Read, and Last Write, with size from <span className="font-mono">sys.dm_db_partition_stats</span> and last access from <span className="font-mono">sys.dm_db_index_usage_stats</span>.</li>
              <li>A missing permission shows <span className="font-medium">Table statistics not readable</span> (VIEW DATABASE STATE) or <span className="font-medium">Runtime statistics not readable</span> (VIEW SERVER STATE, or VIEW SERVER PERFORMANCE STATE on SQL Server 2022 and later, plus VIEW DATABASE STATE for Query Store). Other failures show <span className="font-medium">Statistics could not be read</span>.</li>
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
              <li>AI Tune analyzes the selected object with the AI provider selected in the app: Ollama, OpenAI, Anthropic, Azure OpenAI, or DeepSeek.</li>
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
        eyebrow="Screen 3"
        title="Relations Tab: Table Key Diagram"
        body={
          <>
            <p>
              For a table, Relations draws the primary key / foreign key diagram. This capture centers on
              Application.StateProvinces in the demo database.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Switch:</strong> Keys (PK/FK) with 3 foreign keys, and Code dependencies with 4 entries.
              </li>
              <li>
                <strong>Referenced by:</strong> Application.Cities, whose StateProvinceID foreign key points at this table.
              </li>
              <li>
                <strong>Selected table:</strong> the primary key PK_Application_StateProvinces and the key columns
                StateProvinceID (PK), CountryID and LastEditedBy (FK), with Show all 10 columns below them.
              </li>
              <li>
                <strong>References:</strong> Application.Countries and Application.People, each through one foreign key.
              </li>
              <li>
                <strong>no index:</strong> LastEditedBy is flagged because no index supports that foreign key, as the
                legend under the diagram explains.
              </li>
            </ul>
          </>
        }
        image="/docs/object-explorer/003.png"
        alt="Object Explorer Relations tab showing the key diagram for Application.StateProvinces, with Application.Cities under Referenced by, Application.Countries and Application.People under References, and a no index flag on the LastEditedBy foreign key"
        width={1254}
        height={506}
      />

      <ScreenshotCard
        eyebrow="Screen 4"
        title="Relations Tab: Code Dependency Map"
        body={
          <>
            <p>
              For a stored procedure, view, function, or trigger, Relations draws the code dependency map. This capture
              centers on DataLoadSimulation.AddSpecialDeals.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Used by:</strong> DataLoadSimulation.DailyProcessToCreateHistory, a procedure that calls it, drawn
                with a dashed line.
              </li>
              <li>
                <strong>Selected object:</strong> Stored procedure · 4 parameters, each tagged IN with its data type.
              </li>
              <li>
                <strong>Depends on:</strong> Sales.BuyingGroups and Warehouse.StockGroups, each read on 2 columns (R), and
                Sales.SpecialDeals, written on 13 columns (W). The first 8 columns are listed, and +5 columns shows the
                rest.
              </li>
              <li>
                <strong>Legend:</strong> reads, writes (INSERT, UPDATE, DELETE and MERGE are not told apart), calls /
                executes / fires, the R / W / RW column tags, and the note that dynamic SQL and temp tables are not
                tracked.
              </li>
            </ul>
          </>
        }
        image="/docs/object-explorer/004.png"
        alt="Object Explorer Relations tab showing the dependency map of a stored procedure, with its calling procedure on the left, four IN parameters in the center, and three tables on the right marked with the columns read or written"
        width={1253}
        height={821}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Relations Diagrams</div>
        <h2 className="text-2xl font-bold text-gray-900">Foreign Key Diagrams and Dependency Maps</h2>
        <p className="mt-3 text-sm text-gray-700">
          Relations turns SQL Server&apos;s own metadata into a one-hop diagram: the selected object sits in the
          center, related objects are drawn as cards on the left and right, and lines connect them. Hovering a card
          highlights its lines and fades the others, and hovering a line or row shows the details. Each side shows up
          to 12 cards, with a <span className="font-medium">+N more tables</span> or{' '}
          <span className="font-medium">+N more objects</span> button for the rest.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="font-semibold mb-1 text-gray-900">Tables: PK/FK Key Diagram</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Tables get a switch between <span className="font-medium">Keys (PK/FK)</span> and <span className="font-medium">Code dependencies</span>. The counts are the number of foreign key constraints and the number of code dependencies. The switch keeps the last view you chose, so the next table opens in the same view.</li>
              <li><span className="font-medium">Referenced by</span> (left) lists the tables whose foreign keys point to this table; <span className="font-medium">References</span> (right) lists the tables this table&apos;s foreign keys point to.</li>
              <li>The center card shows the primary key name and the key columns tagged PK, FK, or UQ with their data types. <span className="font-medium">Show all N columns</span> and <span className="font-medium">Show key columns only</span> switch between all columns and key columns.</li>
              <li>Lines use crow&apos;s-foot notation: the many end sits on the foreign key, the one end on the primary or unique key. A composite key is drawn as one line, and a self-referencing key as a loop.</li>
              <li>Only declared foreign keys are shown; nothing is guessed from column names. Hover text gives the constraint name, the column mapping, and the ON DELETE / ON UPDATE actions.</li>
              <li>Flags point out problems: <span className="font-medium">no index</span> (no index on the referencing table has the foreign key columns as its leading key columns), <span className="font-medium">untrusted</span> (created or re-enabled WITH NOCHECK, so the optimizer cannot rely on it; drawn dashed), <span className="font-medium">disabled</span> (drawn dotted), and <span className="font-medium">no primary key</span>.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="font-semibold mb-1 text-gray-900">Procedures, Views, Functions and Triggers: Dependency Map</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>The center card shows parameters (IN / OUT, and RET for a scalar function&apos;s return type), view and table-valued function columns, or a trigger&apos;s AFTER / INSTEAD OF events.</li>
              <li><span className="font-medium">Depends on</span> (right) lists referenced objects. Table and view cards list the columns read (R), written (W), or both (RW), eight at a time with a <span className="font-medium">+N columns</span> button, and flag <span className="font-mono">SELECT *</span> and <span className="font-medium">columns incomplete</span>.</li>
              <li><span className="font-medium">Used by</span> (left) lists referencing objects. For a trigger this column is <span className="font-medium">Fired by</span> and starts with the parent table and its events. When the subject is a table or view, read/write detail is checked for the first 40 referencing objects, and a <span className="font-medium">Read/write detail partial</span> note says so.</li>
              <li>Line styles tell reads, writes, calls, executes or fires, and plain references apart. Writes cover INSERT, UPDATE, DELETE, and MERGE without separating them.</li>
              <li>Objects flagged <span className="font-medium">linked server</span>, <span className="font-medium">other database</span>, <span className="font-medium">not found</span>, <span className="font-medium">caller dependent</span>, or <span className="font-medium">ambiguous</span> are drawn with dashed borders and cannot be opened.</li>
              <li>Dependencies come from <span className="font-mono">sys.dm_sql_referenced_entities</span> and <span className="font-mono">sys.dm_sql_referencing_entities</span>. If a module cannot be bound (usually because it references a missing object), the diagram falls back to <span className="font-mono">sys.sql_expression_dependencies</span> and shows a <span className="font-medium">Column detail unavailable</span> note.</li>
              <li>The legend states that <span className="font-medium">Dynamic SQL and temp tables are not tracked</span>. When the source contains <span className="font-mono">sp_executesql</span> or <span className="font-mono">EXEC(...)</span>, a <span className="font-medium">Dependencies may be incomplete</span> note appears.</li>
            </ul>
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h3 className="font-semibold mb-1 text-gray-900">Navigating Between Related Objects</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            <li>Click a card title (or focus it and press Enter) to open that object in Relations; the diagram re-centers on it.</li>
            <li>A breadcrumb trail with a <span className="font-medium">← Back</span> button appears above the diagram. Click any step in the trail to jump straight back to it.</li>
            <li><span className="font-medium">Alt+←</span>, or the mouse back button over the diagram, also goes back while the Relations tab is visible.</li>
            <li>Going back restores the Keys or Code view, expanded sections, and scroll position. The trail resets when you pick an object from the list, open one from Query Statistics, or change the database or connection.</li>
            <li>If the relations or foreign keys cannot be read, the tab shows <span className="font-medium">Relations unavailable</span> or <span className="font-medium">Key metadata unavailable</span> with the reason. A missing permission is named as such, with a request to have it granted.</li>
          </ul>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 5"
        title="AI Tune: Analysis in Progress"
        body={
          <>
            <p>
              AI Tune runs the analysis for the open object and shows its progress live. This capture was taken early in a
              run on DataLoadSimulation.AddSpecialDeals.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Heading and buttons:</strong> AI Performance Analysis: DataLoadSimulation.AddSpecialDeals, with
                Live Operation Log switched on and Cancel next to it.
              </li>
              <li>
                <strong>Options:</strong> Force Refresh and Use Tuning Memory are off and Remove SQL Comments is on, which
                are the defaults. They are greyed out while the run is in progress.
              </li>
              <li>
                <strong>Progress:</strong> the bar and the status line stand at 6% during evidence collection.
              </li>
              <li>
                <strong>Process Logs:</strong> each collection step is logged when it starts and when it finishes, here
                Dependencies and Query Store with their timings, followed by Execution Plan.
              </li>
              <li>
                <strong>Footer:</strong> Start Analysis on the left, and Save Report, Save Markdown, Save Contract, Save
                LLM Request and Copy Text on the right, all unavailable until the run ends.
              </li>
            </ul>
          </>
        }
        image="/docs/object-explorer/005.png"
        alt="Object Explorer AI Tune tab during an analysis at 6 percent, with the analysis options, the Live Operation Log and Cancel buttons, and a Process Logs panel listing the completed Dependencies and Query Store steps"
        width={1252}
        height={817}
      />

      <ScreenshotCard
        eyebrow="Screen 6"
        title="AI Tune: Completed Report"
        body={
          <>
            <p>
              When the run ends, the report opens inside the tab. This capture shows a completed analysis of
              Demo.usp_Test_04_ImplicitConversion, a test procedure in the demo database.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Status:</strong> Complete, with the progress bar full.
              </li>
              <li>
                <strong>Report header:</strong> SQLPerformance AI, Object Explorer · Object Analysis, with the HIGH risk
                level and the CPU BOUND bottleneck label.
              </li>
              <li>
                <strong>Report sections:</strong> a side menu with What&apos;s Wrong, Problems, Actions, Test Plan, and
                Confidence &amp; Plan under Technical. The main finding here is two correlated scalar subqueries that
                repeat an aggregation for every outer row.
              </li>
              <li>
                <strong>Process Logs:</strong> the last lines give the size of the AI response (12,290 characters) and
                end with Object analysis complete.
              </li>
              <li>
                <strong>Footer:</strong> Re-run Analysis, Save Report, Save Markdown, Save Contract, Save LLM Request, and
                Copy Text.
              </li>
            </ul>
          </>
        }
        image="/docs/object-explorer/006.png"
        alt="Object Explorer AI Tune tab after a completed analysis, showing a Complete status, the embedded report with HIGH and CPU BOUND labels and its section menu, the Process Logs panel, and the Re-run Analysis and save buttons"
        width={1258}
        height={824}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">AI Tune Workflow</div>
        <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700">
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Before and during analysis</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Select an object in the list and open the <span className="font-medium">AI Tune</span> tab. Only objects with a module definition can be analyzed: tables and CLR objects have none, and without VIEW DEFINITION the definition reads as empty. In those cases the app reports <span className="font-medium">Source code not found</span>.</li>
              <li><span className="font-medium">Force Refresh</span> bypasses the analysis cache. <span className="font-medium">Remove SQL Comments</span> (on by default) strips comments from a stored procedure&apos;s source before it is sent. <span className="font-medium">Use Tuning Memory</span> adds earlier tuning findings for the object to the prompt. Each completed run is recorded in the app&apos;s local database whether or not that option is on.</li>
              <li>
                Click <span className="font-medium">Start Analysis</span>. Evidence collection runs {collectionSteps.length} steps
                and fills about the first third of the progress bar; the AI answer fills the rest. The steps are{' '}
                {collectionSteps.join(', ')}.
              </li>
              <li>The status reads Ready, Collecting, a percentage, then Complete, Partial, Failed, or Cancelled; Stopping appears while a cancel takes effect. A partial result comes with a notice, which names the reason when one is known.</li>
              <li>Open <span className="font-medium">Live Operation Log</span> to follow each step in the Process Logs panel, which can be copied or cleared. <span className="font-medium">Cancel</span> stops the run.</li>
              <li>The wait for the AI answer is limited by the <span className="font-medium">AI Response Timeout (seconds)</span> setting: 900 by default, from 10 up to 1800.</li>
              <li>One single analysis runs at a time; starting another shows <span className="font-medium">AI analysis already in progress.</span> A Batch AI Tune run can go on alongside it.</li>
              <li>Leaving Object Explorer cancels a running single analysis. Selecting another object while it runs does not: the result still belongs to the object it started on.</li>
              <li>If the second-pass AI safety review cannot run, for example because the provider returns an error, a notice reads <span className="font-medium">AI safety review unavailable</span> and the report is shown without that review.</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">After analysis</div>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-medium">Save Report</span> saves the HTML report as <span className="font-mono">AI_Report_&lt;object&gt;_&lt;date&gt;_&lt;time&gt;.html</span>.</li>
              <li><span className="font-medium">Save Markdown</span> saves the same analysis as a <span className="font-mono">.md</span> file, and <span className="font-medium">Copy Text</span> copies it to the clipboard.</li>
              <li><span className="font-medium">Save Contract</span> saves the structured response contract as <span className="font-mono">Response_Contract_…json</span>.</li>
              <li><span className="font-medium">Save LLM Request</span> saves the request sent to the AI as <span className="font-mono">LLM_Request_…json</span>, for audit or debugging.</li>
              <li>Each save opens a save dialog in your home folder.</li>
              <li><span className="font-medium">Re-run Analysis</span> runs again and passes the previous result along as context. Returning to the same object shows <span className="font-medium">Showing the last analysis of &lt;name&gt;.</span></li>
              <li>Only the latest analysis is kept, and only in memory: it is gone after the app closes or the connection or database changes. If the kept analysis belongs to another object, the save buttons are disabled and the app asks you to run the analysis again.</li>
            </ul>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 7"
        title="Batch AI Tune: Queue Before a Run"
        body={
          <>
            <p>
              Batch AI Tune analyzes a queue of objects and writes the results to a report folder. This capture shows a
              queue of two test procedures before the run starts.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Header:</strong> Sequential Operations, Batch Analysis Queue, with the Idle badge and the Live
                Operation Log, Add Current, Add Selected (0) and Clear buttons.
              </li>
              <li>
                <strong>Run settings:</strong> the output folder C:\tmp with Browse, Pause (s) set to 10, Run Queue, and
                Stop.
              </li>
              <li>
                <strong>Options:</strong> Resume, Force Refresh and Remove SQL Comments on, Use Tuning Memory off, which
                are the batch defaults.
              </li>
              <li>
                <strong>Object queue:</strong> Demo.usp_Test_04_ImplicitConversion and Demo.usp_Test_07_ScalarUDF, each
                with a × button to remove it.
              </li>
              <li>
                <strong>Process Logs:</strong> Batch console ready.
              </li>
            </ul>
          </>
        }
        image="/docs/object-explorer/007.png"
        alt="Object Explorer Batch AI Tune tab with an idle Batch Analysis Queue holding two stored procedures, the output folder, pause, Run Queue and Stop controls, the Resume, Force Refresh, Remove SQL Comments and Use Tuning Memory options, and a Process Logs panel"
        width={1249}
        height={813}
      />

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
              <li><span className="font-medium">Add Current</span> adds the open object; <span className="font-medium">Add Selected (N)</span> adds every object selected with Ctrl+click or Shift+click. Objects already in the queue are skipped, with a notice.</li>
              <li>The queue holds objects from one database. Changing the server or database empties it, with a notice; during a run this happens after the run ends.</li>
              <li>Remove single entries with <span className="font-medium">×</span>, or empty the queue with <span className="font-medium">Clear</span>.</li>
              <li>Choose the output folder with <span className="font-medium">Browse</span>. By default it points to a batch reports folder in the app&apos;s per-user data folder.</li>
              <li><span className="font-medium">Pause (s)</span> sets the wait between analyses. It is prefilled from the <span className="font-medium">Batch Pause Between Analyses (seconds)</span> setting: 10 by default, from 0 up to 3600.</li>
              <li>Options: <span className="font-medium">Resume</span>, <span className="font-medium">Force Refresh</span>, and <span className="font-medium">Remove SQL Comments</span> (all on by default), and <span className="font-medium">Use Tuning Memory</span> (off by default).</li>
              <li><span className="font-medium">Resume</span> looks at the newest earlier run for the same database in the same output folder. If that run did not finish cleanly, the objects it completed are skipped and logged as skipped by resume; partial and failed objects run again. After a clean run, nothing is skipped.</li>
              <li><span className="font-medium">Run Queue</span> starts the run and <span className="font-medium">Stop</span> cancels it. The queue, folder, pause, and options are locked while it runs. Only one batch runs at a time.</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Progress and output</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>The status badge shows the current position and stage (for example <span className="font-mono">[2/5]</span> followed by the stage), next to a progress bar and a live operation log.</li>
              <li>A failed object raises a notification. The run ends as completed, partial, or cancelled, and if any objects failed or were only partly analyzed, a summary notice says how many and points to the batch log.</li>
              <li>Each run creates a <span className="font-mono">batch_object_analysis_&lt;date&gt;_&lt;time&gt;</span> folder with an <span className="font-mono">index.html</span> overview, <span className="font-mono">run_summary.json</span>, and <span className="font-mono">raw_plan_manifest.json</span>, plus one subfolder per object.</li>
              <li>An object folder holds a status file, its HTML report, response contract, LLM request, and LLM diagnostics, plus the raw execution plan XML when one was captured; a failed object also gets an <span className="font-mono">error.txt</span>.</li>
              <li>Leaving Object Explorer does not stop a running batch; when you come back, the live log is reattached. Closing the application cancels it.</li>
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
          <li>Object Explorer reads metadata and statistics and never executes or changes objects, and AI recommendations are never applied automatically. When an AI answer contains SQL code blocks, the app submits them to SQL Server in a session with <span className="font-mono">SET PARSEONLY ON</span>, so the server checks the syntax without running them. If parse-only mode cannot be turned on, the check is skipped.</li>
          <li>
            Before the request is built, a data guard masks credential values in the object&apos;s source code (values
            of keys such as password, pwd, secret, token, or API key, and Bearer or Basic tokens become{' '}
            <span className="font-mono">&lt;masked&gt;</span>) and cuts definitions longer than 200,000 characters at a
            line boundary. The log reports both on a <span className="font-medium">Data guard</span> line.
          </li>
          <li>
            Nothing else is masked and there is no option to hide names. The rest of the source code, object names, the
            execution plan XML (up to 100,000 characters), and plan parameter values (up to 15 per plan, compiled and
            runtime) are sent to the selected AI provider as they are, so choose a local model if they must not leave
            your environment. See{' '}
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
