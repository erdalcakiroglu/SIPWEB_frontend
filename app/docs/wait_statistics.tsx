import Link from 'next/link'
import LightboxImage from './LightboxImage'

const screenAreas = [
  'Filter panel (Trend Window, Database, Application, Minimum Wait, Apply Filter) with the action row under it: ↻ Refresh, Set Baseline, Export, the Mask names and statements checkbox, and the data badge',
  'Wait Analysis panel with the Top Waits and Trend & Blocking tabs',
  'Summary panel with the health line, four figures, and the status line',
  'Insights panel with Alerts and Primary Finding, expanded by Show Details',
  'Wait Categories panel (shown only after Show Details)',
]

const mainTabs = ['Top Waits', 'Trend & Blocking']

const insightBlocks = [
  'Alerts',
  'Primary Finding',
  'Before / After (Show Details)',
  'Next Action (Show Details)',
  'Custom Categories (Show Details)',
  'Wait / Plan (Show Details)',
]

const buttons = [
  '↻ Refresh',
  'Set Baseline',
  'Export',
  'Apply Filter',
  'Clear Context (on the query-context bar only)',
  'Show Details / Hide Details',
  'Save Before',
  'Save After',
  'Compare',
  'Add Custom (opens the Add Custom Wait Category dialog with Save and Cancel)',
  'Remove Custom (opens the Remove Custom Wait Category dialog with Remove and Cancel)',
]

const checkboxes = [
  'Mask names and statements (checked by default): replaces login, host and application names with aliases and redacts literals in the statements of the exported blocking chain',
]

const comboboxes = [
  'Trend Window: 7 Days, 30 Days, or 90 Days',
  'Database: free text, placeholder All Databases, with suggestions from the sessions currently waiting',
  'Application: free text, placeholder All Applications, with suggestions from the sessions currently waiting',
  'Minimum Wait: None, >100 ms, >1 sec, >5 sec, >30 sec, or >1 min',
  'Display (Trend & Blocking tab): Daily Summary, Dominant Category, or Category Breakdown',
  'Rule (Remove Custom Wait Category dialog): one entry per saved rule, written as name :: pattern',
]

const reportHref = '/docs/wait-statistics/wait_stats_export_20261007_151552'

// The four columns of sys.dm_os_wait_stats that carry the actual diagnostic signal.
// Average wait is not a column — it has to be derived — which is exactly why it gets
// skipped, and why so many wait analyses conflate "a lot of waiting" with "slow waits".
const waitColumns = [
  {
    name: 'wait_time_ms',
    label: 'Total wait',
    body: 'Every millisecond spent waiting on this type, signal time included. This is the number that decides the ranking, and on its own it is the least informative of the four.',
  },
  {
    name: 'signal_wait_time_ms',
    label: 'Signal wait',
    body: 'The tail end of the wait: the resource has already arrived and the task is sitting in the runnable queue waiting for a CPU scheduler. This is pure scheduling delay, not resource delay.',
  },
  {
    name: 'waiting_tasks_count',
    label: 'Number of waits',
    body: 'How many times a task entered this wait. Divide total wait by this and you get the average wait — the difference between one forty-second stall and eight hundred thousand instant ones.',
  },
  {
    name: 'max_wait_time_ms',
    label: 'Worst single wait',
    body: 'The longest individual wait recorded for this type since the counters were last reset. A small total with a large maximum usually means a rare but severe event worth chasing.',
  },
]

// Grouped rather than ranked, because a global ranking of wait types is exactly the
// kind of thing that gets copied out of context. Which wait matters depends entirely
// on the workload; what does not change is what each one means.
const waitGroups = [
  {
    id: 'cpu-waits',
    category: 'CPU and scheduling',
    waits: [
      {
        name: 'SOS_SCHEDULER_YIELD',
        meaning:
          'A task exhausted its 4 ms scheduling quantum and yielded the CPU voluntarily so other tasks on the same scheduler could run. It is not a task being denied CPU — it is a task that had plenty and used all of it.',
        next: 'Expect a huge count with a tiny average. The usual source is a query burning through pages that are already in memory: large scans, nested loops over too many rows, a missing index that turned a seek into a scan. Chase the query, not the CPU.',
      },
      {
        name: 'CXPACKET',
        meaning:
          'A thread in a parallel plan waited at an exchange operator. On SQL Server 2016 SP2 and 2017 onward the benign half of this — a consumer thread waiting for rows that have not been produced yet — was split out into CXCONSUMER, so what remains under CXPACKET is the more meaningful signal.',
        next: 'Parallelism is not a defect, and setting MAXDOP to 1 to make this number go away usually trades one problem for a slower one. Look at cost threshold for parallelism first, which still defaults to 5 and sends trivial queries parallel, then at row-distribution skew and stale statistics.',
      },
      {
        name: 'CXCONSUMER',
        meaning:
          'The consumer side of a parallel exchange, waiting on its producer. On its own this is normal behavior of any parallel plan and carries almost no diagnostic weight.',
        next: 'Most analyses filter it out alongside the idle waits. If you are on a version that predates the split, the same traffic is folded into CXPACKET.',
      },
      {
        name: 'THREADPOOL',
        meaning:
          'A task could not start because no worker thread was free. This is a symptom rather than a cause, and it is a severe one: with every worker consumed, new connections — including yours — may not get one either.',
        next: 'Look for what is holding the workers rather than for a way to raise max worker threads. A long blocking chain is the usual answer, since each blocked session keeps its worker parked for the duration.',
      },
    ],
  },
  {
    id: 'io-waits',
    category: 'Storage and I/O',
    waits: [
      {
        name: 'PAGEIOLATCH_SH',
        meaning:
          'A task is holding a latch on a buffer-pool page while the page is read in from disk, because the data it needs is not in memory. The SH variant is a read; PAGEIOLATCH_EX is the same wait during a write path.',
        next: 'Average wait is the number to read here. Sustained double-digit milliseconds points at storage latency, but the more common and far cheaper fix is to read fewer pages — indexing, plan shape, or a buffer pool too small to hold the working set.',
      },
      {
        name: 'WRITELOG',
        meaning:
          'A commit is waiting for its log block to be hardened to the transaction log file. Nothing commits until this completes, so it sits directly in the path of write throughput.',
        next: 'Two independent causes. Log file latency is one. The other is transaction shape: ten thousand autocommit statements in a loop force ten thousand log flushes where one explicit transaction would force one.',
      },
      {
        name: 'IO_COMPLETION',
        meaning:
          'I/O that is not a data-page read — reading the transaction log, and sort or hash operators spilling to tempdb when their memory grant proved too small.',
        next: 'When it climbs alongside memory-grant symptoms, treat it as evidence of spills rather than of a slow disk, and go look at cardinality estimates.',
      },
      {
        name: 'BACKUPIO',
        meaning:
          'A backup task waiting on its backup device. Entirely expected while a backup is running, and meaningless outside that window.',
        next: 'Only worth investigating if backups are overrunning. Check the backup target throughput, buffer count, and whether compression is on.',
      },
    ],
  },
  {
    id: 'lock-waits',
    category: 'Locking and latching',
    waits: [
      {
        name: 'LCK_M_*',
        meaning:
          'Waiting to acquire a lock, with the suffix naming the mode: LCK_M_S shared, LCK_M_X exclusive, LCK_M_U update, LCK_M_IX intent exclusive, LCK_M_SCH_M a schema modification queued behind readers. Whatever the suffix, this is blocking.',
        next: 'Cumulative lock waits tell you blocking happened, never who caused it. That answer only exists live, in the blocking chain, which is why this module pairs the counters with a chain view.',
      },
      {
        name: 'PAGELATCH_UP',
        meaning:
          'Contention on a page that is already in memory — no disk is involved, despite how similar the name looks to PAGEIOLATCH. The UP mode on allocation pages is the classic tempdb signature: PFS, GAM and SGAM pages, addressed as 2:1:1, 2:1:2 and 2:1:3.',
        next: 'For tempdb allocation contention, the answer is multiple equally sized tempdb data files. SQL Server 2016 and later configure this at setup and enable uniform extent allocation by default.',
      },
      {
        name: 'PAGELATCH_EX',
        meaning:
          'Exclusive in-memory page contention. On a user table this is usually last-page insert contention: many sessions inserting into a clustered index on an ever-increasing key all target the same trailing page.',
        next: 'On SQL Server 2019 and later, OPTIMIZE_FOR_SEQUENTIAL_KEY addresses this directly. Otherwise the fix is an index design that spreads inserts across more pages.',
      },
      {
        name: 'LATCH_EX',
        meaning:
          'A latch that is not on a buffer page — an internal structure of some kind. The wait type alone does not say which.',
        next: 'The meaning lives in latch_class in sys.dm_os_latch_stats. Without that breakdown this wait type is not actionable.',
      },
    ],
  },
  {
    id: 'memory-waits',
    category: 'Memory',
    waits: [
      {
        name: 'RESOURCE_SEMAPHORE',
        meaning:
          'A query is waiting for a memory grant before it can begin executing. The grant is sized at compile time from estimated row counts, so this is usually a cardinality-estimation problem wearing a memory costume.',
        next: 'A handful of queries with wildly overestimated grants can starve an otherwise healthy server. Find the largest grants and check their estimates against actuals before concluding the server needs more RAM.',
      },
      {
        name: 'RESOURCE_SEMAPHORE_QUERY_COMPILE',
        meaning:
          'Waiting for memory in which to compile a plan, rather than to run one. It points at a workload that compiles constantly instead of reusing plans.',
        next: 'Look at ad-hoc statement volume, parameterisation, and whether optimize for ad hoc workloads is enabled.',
      },
      {
        name: 'CMEMTHREAD',
        meaning:
          'Contention on a thread-safe internal memory object. It commonly accompanies heavy plan-cache churn on servers running large volumes of unparameterised ad-hoc SQL.',
        next: 'Usually resolves as a side effect of fixing the compilation volume rather than as a problem in its own right.',
      },
    ],
  },
  {
    id: 'other-waits',
    category: 'Network, replicas and external calls',
    waits: [
      {
        name: 'ASYNC_NETWORK_IO',
        meaning:
          'SQL Server has results ready and is waiting for the client to consume them. The name blames the network; the cause almost never is. It usually means an application is processing a result set row by row while holding it open, or running on a slow link.',
        next: 'This one is fixed in application code, not on the server. Consume the result set fully before processing it, and stop returning columns and rows nobody reads.',
      },
      {
        name: 'HADR_SYNC_COMMIT',
        meaning:
          'A commit on the primary waiting for a synchronous-commit availability group secondary to harden the log record. By design, this ties your commit latency to the secondary’s log disk and the network between them.',
        next: 'Measure the secondary the way you would measure the primary. A slow log disk on a replica nobody looks at will show up as slow writes on the server everybody looks at.',
      },
      {
        name: 'OLEDB',
        meaning:
          'SQL Server called out through an OLE DB provider. Linked server queries are the obvious source; DBCC CHECKDB is the non-obvious one, and its appearance during a scheduled integrity check is expected.',
        next: 'Correlate against the maintenance window before treating it as a linked-server problem.',
      },
      {
        name: 'PREEMPTIVE_OS_*',
        meaning:
          'A worker left the SQL Server scheduler to make a Windows API call and ran preemptively while outside. Authentication, file system operations and extended stored procedures all produce these.',
        next: 'The suffix names the call. PREEMPTIVE_OS_AUTHENTICATIONOPS climbing, for instance, points at domain controller latency rather than anything inside the database engine.',
      },
    ],
  },
]

// Everything SQL Server records while it has nothing to do. These are not "low
// priority" waits to look at later — they are background and timer tasks sleeping on
// purpose, and on any server with meaningful uptime they will occupy the entire top
// of an unfiltered list. The list is not exhaustive; treat anything containing SLEEP,
// QUEUE, IDLE or TIMER as suspect until proven otherwise.
const benignWaits = [
  'SLEEP_TASK',
  'SLEEP_SYSTEMTASK',
  'SLEEP_BPOOL_FLUSH',
  'LAZYWRITER_SLEEP',
  'WAITFOR',
  'XE_TIMER_EVENT',
  'XE_DISPATCHER_WAIT',
  'REQUEST_FOR_DEADLOCK_SEARCH',
  'SQLTRACE_INCREMENTAL_FLUSH_SLEEP',
  'CHECKPOINT_QUEUE',
  'DIRTY_PAGE_POLL',
  'BROKER_TASK_STOP',
  'BROKER_TO_FLUSH',
  'BROKER_EVENTHANDLER',
  'CLR_AUTO_EVENT',
  'CLR_MANUAL_EVENT',
  'DISPATCHER_QUEUE_SEMAPHORE',
  'FT_IFTS_SCHEDULER_IDLE_WAIT',
  'SP_SERVER_DIAGNOSTICS_SLEEP',
  'QDS_ASYNC_QUEUE',
  'QDS_SHUTDOWN_QUEUE',
  'QDS_PERSIST_TASK_MAIN_LOOP_SLEEP',
  'HADR_WORK_QUEUE',
  'HADR_CLUSAPI_CALL',
  'HADR_FILESTREAM_IOMGR_IOCOMPLETION',
  'ONDEMAND_TASK_QUEUE',
  'PWAIT_ALL_COMPONENTS_INITIALIZED',
]

// Deliberately not marked up as FAQPage. Google restricted FAQ rich results to
// authoritative government and health sites in 2023, so the schema buys nothing here
// while still being something to keep in sync. The questions earn their place as
// content: they are what people actually ask about wait stats.
const faqs = [
  {
    q: 'What is a good wait statistics result?',
    a: 'There isn’t one. A server doing work always waits for something, so there is no threshold that separates healthy from unhealthy, and no wait type that is universally bad. What carries meaning is comparison: this window against a baseline window, this average wait against the same average last week, this wait’s share against what it was before you changed something.',
  },
  {
    q: 'Should I clear wait statistics?',
    a: 'Rarely, and never casually. DBCC SQLPERF(\'sys.dm_os_wait_stats\', CLEAR) resets the counters server-wide and irreversibly, which also destroys the history of any monitoring tool reading the same DMV. Capturing two snapshots and subtracting gives you the same isolated window without the side effects. The honest use case is a controlled test where you want a clean starting point and know what else is collecting.',
  },
  {
    q: 'Is CXPACKET a problem?',
    a: 'It means parallelism happened, which is what parallelism is supposed to do on a large query. Treat it as a prompt to check two settings — cost threshold for parallelism, which still ships at a 1995-era default of 5, and MAXDOP — and to look for row-distribution skew, where one thread does most of the work while the others wait. Forcing MAXDOP to 1 removes the wait type and often makes the workload slower.',
  },
  {
    q: 'Does high PAGEIOLATCH_SH mean I need faster storage?',
    a: 'Sometimes, and it is worth checking the average wait per read before deciding. More often it means the workload is reading pages it should not need to read, or that the buffer pool cannot hold the working set. An index that turns a scan into a seek removes far more I/O wait than a faster disk does, and costs less.',
  },
  {
    q: 'How much history do the wait statistics DMVs keep?',
    a: 'None. sys.dm_os_wait_stats is a running total since the last service restart, failover, or explicit clear — there is no time dimension in it at all. History has to come from somewhere else: sys.query_store_wait_stats on SQL Server 2017 and later, which additionally attributes waits to a query and plan, or your own periodic snapshots.',
  },
  {
    q: 'Which wait types should I ignore?',
    a: 'The background and timer waits that accumulate while the server is idle — SLEEP_TASK, LAZYWRITER_SLEEP, XE_TIMER_EVENT, REQUEST_FOR_DEADLOCK_SEARCH, the QDS_ and BROKER_ queues, and their relatives. On a server with real uptime these will otherwise occupy the entire top of the list and hide everything that matters.',
  },
]

const contents = [
  { id: 'how-waits-work', label: 'How wait statistics work' },
  { id: 'signal-vs-resource', label: 'Signal vs resource wait' },
  { id: 'wait-types', label: 'Wait types that matter' },
  { id: 'ignore-list', label: 'Waits worth ignoring' },
  { id: 'cumulative-trap', label: 'Why cumulative totals mislead' },
  { id: 'workflow', label: 'From dominant wait to fix' },
  { id: 'module', label: 'The Wait Statistics module' },
  { id: 'faq', label: 'Common questions' },
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

/**
 * Section wrapper for the product reference blocks. The eyebrow was a <div> until
 * August 2026, which left a 3000-word page with almost no heading structure: the only
 * <h2> elements on it belonged to screenshot cards. The eyebrow *is* the section
 * title, so it renders as one now — the styling is unchanged.
 */
function RefSection({ id, eyebrow, children }: { id?: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <section id={id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm scroll-mt-24">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{eyebrow}</h2>
      {children}
    </section>
  )
}

/** Section wrapper for the explanatory content, where the heading is doing real work. */
function GuideSection({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm scroll-mt-24">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{eyebrow}</div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-gray-700">{children}</div>
    </section>
  )
}

export default function WaitStatisticsTemplate() {
  return (
    <div className="space-y-8">
      {/* First element on the page, above the overview prose, and deliberately so.
          The guide is the page we want ranking for the subject query; this panel is
          the strongest of the several links pointing at it from here, and it makes
          the hierarchy explicit to a reader who landed on the wrong one of the two. */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-900">
          Looking for the subject, not the module?
        </div>
        <p className="text-sm leading-7 text-blue-900">
          This page documents the Wait Statistics module in SQLPerformance AI. For the conceptual
          explanation of wait statistics themselves — the DMVs, the runnable T-SQL, delta capture, and a playbook per
          wait type — read{' '}
          <Link
            href="/guides/sql-server-wait-statistics"
            className="font-semibold underline hover:text-blue-700"
          >
            SQL Server Wait Statistics: The Complete Guide
          </Link>
          .
        </p>
      </div>

      <RefSection eyebrow="Overview">
        <p className="text-sm leading-7 text-gray-700">
          Wait statistics are SQL Server’s own record of where its time went. Rather than inferring a bottleneck from
          counters and guesswork, you ask the engine directly: over this period, what were tasks waiting for, for how
          long, and how often? That record is the shortest path from “the database is slow” to a specific, testable
          cause — which is why wait-based analysis has been the default starting point for SQL Server performance
          troubleshooting for the better part of two decades.
        </p>
        <p className="mt-3 text-sm leading-7 text-gray-700">
          This page covers both halves of the subject. The first half explains how the wait data itself works: what the
          columns mean, which wait types are worth your attention and what each one is telling you, which ones are pure
          noise, and why the cumulative totals in <span className="font-mono">sys.dm_os_wait_stats</span> mislead more
          often than they help. The second half documents the Wait Statistics module in SQLPerformance AI,
          which collects and presents that evidence read-only.
        </p>
        <p className="mt-3 text-sm leading-7 text-gray-700">
          If you want the runnable T-SQL — the collection query with the idle-wait filter, the delta capture, the Query
          Store attribution join, and a per-wait-type playbook of causes and fixes — that is in the companion guide,{' '}
          <Link
            href="/guides/sql-server-wait-statistics"
            className="font-semibold text-primary hover:text-primary-dark"
          >
            SQL Server Wait Statistics: The Complete Guide
          </Link>
          .
        </p>

        <nav aria-label="On this page" className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">On this page</div>
          <ul className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
            {contents.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-primary hover:text-primary-dark hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </RefSection>

      <GuideSection
        id="how-waits-work"
        eyebrow="Fundamentals"
        title="How SQL Server Wait Statistics Work"
      >
        <p>
          Every task inside SQL Server is, at any given instant, in one of three states. It is{' '}
          <strong className="font-semibold text-gray-900">running</strong> on a CPU scheduler; it is{' '}
          <strong className="font-semibold text-gray-900">runnable</strong>, meaning it has everything it needs and is
          queued for a core; or it is <strong className="font-semibold text-gray-900">suspended</strong>, waiting on
          something it does not yet have — a page from disk, a lock, a memory grant, a client to read the results
          already sitting in the output buffer.
        </p>
        <p>
          Whenever a task leaves the running state, SQL Server records how long it was away and tags that time with a
          reason. Those tagged accumulations are the wait statistics, and they are exposed through{' '}
          <span className="font-mono">sys.dm_os_wait_stats</span>. There are several hundred wait types; a working
          server exercises perhaps a few dozen, and a handful will account for almost all of the time.
        </p>
        <p>
          The useful signal is spread across four columns, and analyses that read only the first one routinely reach the
          wrong conclusion:
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {waitColumns.map((col) => (
            <div key={col.name} className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="font-mono text-xs text-gray-500">{col.name}</div>
              <div className="mt-0.5 font-semibold text-gray-900">{col.label}</div>
              <p className="mt-1 text-sm leading-6 text-gray-700">{col.body}</p>
            </div>
          ))}
        </div>
        <p>
          One caveat that gets lost surprisingly often: waits tell you where time was spent, not that anything is
          wrong. An idle server accumulates waits happily, and a busy healthy server accumulates a great many. Every
          percentage you read is relative to the rest of the list, which is precisely why the filtering and baselining
          described further down matter more than the ranking itself.
        </p>
      </GuideSection>

      <GuideSection
        id="signal-vs-resource"
        eyebrow="Fundamentals"
        title="Signal Wait vs Resource Wait"
      >
        <p>
          A single wait usually has two parts. First the task waits for the thing it asked for. Then, once that thing
          arrives, it waits again — this time only for a free CPU scheduler to put it back on. SQL Server times both,
          and separating them is the fastest way to tell a resource problem from a CPU problem.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold text-gray-900">Resource wait</div>
            <div className="mt-0.5 font-mono text-xs text-gray-500">wait_time_ms − signal_wait_time_ms</div>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              Time spent genuinely waiting on the resource: the disk read, the lock, the memory grant. When this
              dominates, the wait type at the top of your list is naming a real constraint and is worth chasing on its
              own terms.
            </p>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold text-gray-900">Signal wait</div>
            <div className="mt-0.5 font-mono text-xs text-gray-500">signal_wait_time_ms</div>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              Time spent in the runnable queue after the resource was already available. This is scheduling delay and
              nothing else. A high share across the whole instance means tasks are queueing for CPU, and the individual
              wait types are secondary to that.
            </p>
          </div>
        </div>
        <p>
          As a rule of thumb, a signal share above roughly a fifth to a quarter of total wait time is worth
          investigating as CPU pressure — but only once the idle waits have been filtered out. Leave them in and the
          ratio is computed largely over background tasks that sleep on timers, which makes it meaningless. The module
          excludes the benign idle waits before it computes anything and reports Total Wait, Signal Wait and Resource
          Wait side by side in its Summary panel. The Signal Wait row turns amber from 25% and red from 40%, and the
          same levels raise the Signal Wait Ratio High (CPU Pressure) alert. The health line above the panel carries
          the most severe active alert; with no alert it reads HEALTHY together with the signal-wait share.
        </p>
      </GuideSection>

      <section id="wait-types" className="scroll-mt-24 space-y-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Reference</div>
          <h2 className="text-2xl font-bold text-gray-900">SQL Server Wait Types That Matter</h2>
          <p className="mt-4 text-sm leading-7 text-gray-700">
            These are grouped by what they point at rather than ranked, because which wait matters depends entirely on
            the workload — a data warehouse and an OLTP order system have almost nothing in common at the top of the
            list. What does not change is what each type means and where to look once you see it.
          </p>
        </div>

        {waitGroups.map((group) => (
          <div key={group.id} id={group.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm scroll-mt-24">
            <h3 className="text-lg font-bold text-gray-900">{group.category}</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {group.waits.map((wait) => (
                <div key={wait.name} className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="font-mono text-sm font-semibold text-gray-900">{wait.name}</div>
                  <p className="mt-2 text-sm leading-6 text-gray-700">{wait.meaning}</p>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    <span className="font-semibold text-gray-900">Where to look next: </span>
                    {wait.next}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <GuideSection
        id="ignore-list"
        eyebrow="Reference"
        title="Waits Worth Ignoring"
      >
        <p>
          SQL Server records background and timer tasks sleeping with the same diligence it records a query stalled on a
          lock. On an instance that has been up for months, these idle waits will occupy the entire top of an unfiltered
          list — a deadlock monitor that wakes every five seconds accumulates an enormous total while doing nothing at
          all. Filtering them out is not an optimization; it is the difference between a list that means something and
          a list that does not.
        </p>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
            Commonly filtered idle and background waits
          </div>
          <ul className="grid gap-x-6 gap-y-1 text-sm text-gray-700 sm:grid-cols-2 lg:grid-cols-3">
            {benignWaits.map((wait) => (
              <li key={wait} className="min-w-0 font-mono text-xs">
                {wait}
              </li>
            ))}
          </ul>
        </div>
        <p>
          The list is not exhaustive and never will be — each major version adds wait types. Treat anything whose name
          contains <span className="font-mono">SLEEP</span>, <span className="font-mono">QUEUE</span>,{' '}
          <span className="font-mono">IDLE</span> or <span className="font-mono">TIMER</span> as suspect until you have
          a reason to believe otherwise. Many wait lists filter <span className="font-mono">CXCONSUMER</span> too, for
          a different reason: it is real work, just not work that indicates a problem. SQLPerformance AI does not
          filter it, so it can appear among the Top Waits, as it does in the sample report further down.
        </p>
      </GuideSection>

      <GuideSection
        id="cumulative-trap"
        eyebrow="Methodology"
        title="Why Cumulative Wait Totals Mislead"
      >
        <p>
          <span className="font-mono">sys.dm_os_wait_stats</span> is cumulative since the last service restart,
          failover, or explicit <span className="font-mono">DBCC SQLPERF(&#39;sys.dm_os_wait_stats&#39;, CLEAR)</span>.
          There is no time dimension in it whatsoever. On a server that has been up for three hundred days, the top of
          that list is a three-hundred-day average — it includes every index rebuild, every full backup, every month-end
          batch run, and every quiet Sunday. It cannot, even in principle, tell you anything about the slowdown that
          started an hour ago.
        </p>
        <p>Two adjustments fix this, and they compose:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-gray-900">Take a delta.</strong> Capture the counters, wait out the
            window you care about, capture them again, and subtract. What is left describes that window and nothing
            else. The module does this between refreshes automatically — when an earlier refresh of the same target
            exists and is less than six hours old, it shows only the waits accumulated since then, badged DELTA with
            the window length, and falls back to cumulative figures after a counter reset — and its Set Baseline and
            explicit Save Before / Save After comparison apply the same idea to a window you choose. It is why
            measuring a change means comparing two snapshots rather than reading one.
          </li>
          <li>
            <strong className="font-semibold text-gray-900">Normalise against uptime.</strong> Dividing total wait by
            seconds since the counters were reset gives you wait-seconds per second of server time, which is comparable
            between servers of different uptimes and, once you also divide by core count, between servers of different
            sizes. Raw millisecond totals are comparable to nothing.
          </li>
        </ul>
        <p>
          The other structural limit is attribution. A server-level wait tells you the instance spent time on{' '}
          <span className="font-mono">PAGEIOLATCH_SH</span>; it does not tell you which query did it. Three sources
          close that gap: <span className="font-mono">sys.dm_exec_requests</span> for what is waiting right now,{' '}
          <span className="font-mono">sys.dm_exec_session_wait_stats</span> for per-session totals on SQL Server 2016
          and later, and <span className="font-mono">sys.query_store_wait_stats</span> on 2017 and later, which
          attributes waits to a specific query and plan and is the only one of the three that retains history.
        </p>
      </GuideSection>

      <GuideSection
        id="workflow"
        eyebrow="Methodology"
        title="From Dominant Wait to Actual Fix"
      >
        <p>
          A wait type is a direction, not a diagnosis. The sequence below is what turns one into the other, and skipping
          a step is how wait analysis acquires its reputation for producing confident wrong answers.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-gray-900">Filter the idle waits first.</strong> Everything downstream
            is computed over what is left, including the signal-wait ratio.
          </li>
          <li>
            <strong className="font-semibold text-gray-900">Read total and average together.</strong> A type holding
            sixty percent of total wait across forty million waits averaging a fifth of a millisecond is a completely
            different problem from sixty percent across three hundred waits averaging four hundred milliseconds. The
            first is volume; the second is latency. They have different fixes.
          </li>
          <li>
            <strong className="font-semibold text-gray-900">Reduce to a window.</strong> Delta against a baseline, or
            against a before-snapshot, so that what you are looking at is the period in question rather than the
            server’s entire life.
          </li>
          <li>
            <strong className="font-semibold text-gray-900">Check the signal share.</strong> If scheduling delay
            dominates, the specific wait types below it are largely downstream of CPU pressure and chasing them
            individually will waste your time.
          </li>
          <li>
            <strong className="font-semibold text-gray-900">Attribute the wait to a query.</strong> Query Store wait
            stats, session wait stats, or live requests. Without this step you are tuning a server rather than a
            workload.
          </li>
          <li>
            <strong className="font-semibold text-gray-900">Change one thing and re-measure.</strong> Same window, same
            filters, same comparison. Two simultaneous changes produce one uninterpretable result.
          </li>
        </ol>
        <p>
          Where the wait profile points at live lock contention, cumulative counters have nothing more to give you and
          the investigation moves to the blocking chain —{' '}
          <Link href="/docs/modules/blocking-analysis" className="font-semibold text-primary hover:text-primary-dark">
            Blocking Analysis
          </Link>{' '}
          covers that path. Where it points at a specific plan shape,{' '}
          <Link href="/docs/modules/query-statistics" className="font-semibold text-primary hover:text-primary-dark">
            Query Statistics
          </Link>{' '}
          carries the query-level regression and plan evidence.
        </p>
      </GuideSection>

      <RefSection id="module" eyebrow="The Module">
        <h3 className="text-2xl font-bold text-gray-900">Wait Statistics in SQLPerformance AI</h3>
        <p className="mt-3 text-sm leading-7 text-gray-700">
          The Wait Statistics module is the wait-centric diagnostics surface of version 1.1.0. One refresh reads the
          wait counters of the instance (as a delta since the previous refresh where possible, otherwise cumulative),
          the sessions currently waiting, the live blocking chains, and a 7-, 30- or 90-day daily trend, and turns them
          into ranked wait cards, a Summary, alerts, a Primary Finding, and a Next Action plan. Everything it runs
          against SQL Server is read-only; the module cannot clear wait statistics, has no scheduler, and sends
          nothing anywhere.
        </p>
        <p className="mt-3 text-sm leading-7 text-gray-700">
          It is most useful next to{' '}
          <Link href="/docs/modules/query-statistics" className="font-semibold text-primary hover:text-primary-dark">
            Query Statistics
          </Link>
          , which can open this page with the waits of a single query, and{' '}
          <Link href="/docs/modules/blocking-analysis" className="font-semibold text-primary hover:text-primary-dark">
            Blocking Analysis
          </Link>
          , which is where lock waits lead when a live chain is involved.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm text-gray-700">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What You Can Do</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Rank the non-idle wait types of the instance with their category, share, task count, and longest single wait.</li>
              <li>Narrow the list and the blocking chains to one database or application, or hide small waits with Minimum Wait.</li>
              <li>Follow the daily wait trend over 7, 30, or 90 days from Query Store or from the module’s own local history.</li>
              <li>Read fixed-rule alerts, a Primary Finding with a confidence figure, and a Next Action plan.</li>
              <li>Compare against a saved baseline or against explicit Before / After snapshots.</li>
              <li>Group wait types with your own regular-expression categories.</li>
              <li>Open the Query Store waits of one query from Query Statistics and correlate them with its plan.</li>
              <li>Export the current result as HTML, JSON, or Markdown, with names masked by default.</li>
            </ul>
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Main Screen Areas</div>
            <ol className="list-decimal pl-5 space-y-1">
              {screenAreas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        </div>
      </RefSection>

      <ScreenshotCard
        eyebrow="Screen 1"
        title="Main Layout on the Top Waits Tab"
        body={
          <>
            <p>
              The whole page as it opens in version 1.1.0 on a SQL Server test instance, captured without the
              application top bar. The badge at the right of the action row reads CUMULATIVE (STALE): the previous
              sample for this server was more than six hours old, so the counters are shown as cumulative totals since
              the last restart or reset rather than as a delta.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Heading:</strong> the eyebrow SQL PERFORMANCE AI, the title Wait Statistics, and the subtitle
                Where the server spends its time.
              </li>
              <li>
                <strong>Filter panel and action row:</strong> Trend Window 7 Days, empty Database and Application fields
                with the placeholders All Databases and All Applications, Minimum Wait None, and Apply Filter. Below
                them ↻ Refresh, Set Baseline, Export, and the checked Mask names and statements box.
              </li>
              <li>
                <strong>Top Waits:</strong> nine of the ten cards fit in the capture. LCK_M_X (Lock) leads with Wait
                2.5h, Tasks 31,233, Share 34.5%, and Max 16.3m, followed by LCK_M_S, WRITELOG (I/O), CXPACKET (CPU),
                LCK_M_U, SOS_SCHEDULER_YIELD, PREEMPTIVE_OS_AUTHZINITIALIZECONTEXTFROMSID (Other),
                RESERVED_MEMORY_ALLOCATION_EXT (Memory), and LCK_M_SCH_M. Each detail line gives the Signal/Resource
                split and a hint: Inspect blockers on the four LCK_ cards, Check disk latency on WRITELOG, Review MAXDOP
                on CXPACKET, and Correlate with query plan on the rest. SOS_SCHEDULER_YIELD shows the split the guide
                above describes: 99.1% signal, 0.9% resource.
              </li>
              <li>
                <strong>Category sparklines:</strong> at the right of every card, Lock trend, I/O trend, CPU trend,
                Other trend, and Memory trend, each marked up. The line is the daily trend of the whole category over
                the trend window, not of that single wait type.
              </li>
              <li>
                <strong>Summary:</strong> the red health line CRITICAL: Lock Wait Pressure, then Total Wait 7.4 hours,
                Signal Wait 10.7 %, Resource Wait 89.3 %, Current Waits 0, and the status line Updated in 735 ms |
                mode=server | basis=cumulative (prior sample too old for delta) | waits=10 | alerts=1.
              </li>
              <li>
                <strong>Insights, collapsed:</strong> Alerts reads 1 active alert(s) and [CRITICAL] Lock Wait Pressure:
                Lock wait share is 56.7% (threshold 15.0%). Primary Finding reads Lock Contention (92% confidence),
                Evidence: Lock waits share: 56.7%; Top waits include LCK_* patterns, and Baseline: No baseline
                configured. Show Details has not been pressed.
              </li>
            </ul>
          </>
        }
        image="/docs/wait-statistics/001.png"
        alt="Wait Statistics main screen in version 1.1.0 with the filter panel, Top Waits cards led by LCK_M_X, the Summary panel reading CRITICAL: Lock Wait Pressure, and the collapsed Insights panel"
        width={1616}
        height={917}
      />

      <ScreenshotCard
        eyebrow="Screen 2"
        title="Filter Panel and Action Row"
        body={
          <>
            <p>
              The filter strip on its own, with the Application field focused and still empty. The badge again reads
              CUMULATIVE (STALE).
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Trend Window:</strong> 7 Days is selected; the other choices are 30 Days and 90 Days. Changing
                it refreshes at once, and the same window is used for the trend tab and for query-context waits.
              </li>
              <li>
                <strong>Database and Application:</strong> free-text fields with the placeholders All Databases and
                All Applications. While you type, suggestions come from the sessions currently waiting (the connected
                database is always offered); a partial name matches, case does not matter, and Enter applies. Either
                field switches Top Waits to the matching active waiters and filters the blocking chains.
              </li>
              <li>
                <strong>Minimum Wait:</strong> None here; the options are &gt;100 ms, &gt;1 sec, &gt;5 sec, &gt;30 sec,
                and &gt;1 min. It only hides cards below the limit from the displayed list and adds view=min-wait&gt;=N
                ms to the status line; the data source does not change.
              </li>
              <li>
                <strong>Apply Filter:</strong> runs a refresh with the current fields. Filters and the trend window are
                not remembered between visits.
              </li>
              <li>
                <strong>Action row:</strong> ↻ Refresh, Set Baseline, Export, and the Mask names and statements
                checkbox, which is checked by default.
              </li>
            </ul>
          </>
        }
        image="/docs/wait-statistics/002.png"
        alt="Wait Statistics filter panel with Trend Window 7 Days, the focused Application field, Minimum Wait None, the Apply Filter button, and the action row with the CUMULATIVE (STALE) badge"
        width={1620}
        height={235}
      />

      <ScreenshotCard
        eyebrow="Screen 3"
        title="Export and Masking"
        body={
          <>
            <p>
              The same strip a few minutes later, after a second refresh: the badge now reads DELTA ⏱ 176s, so the
              cards show the growth of the counters over a 176-second window. The red frame around Export and the Mask
              names and statements checkbox was drawn by the product owner to point at the two controls this screen is
              about; it is not part of the application.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Export:</strong> opens a save dialog in your home folder with a name made of wait_stats_export_
                and the date and time of the collection, for example wait_stats_export_20261007_151552.html, and the
                types HTML, JSON, and Markdown. The extension decides the format; any other extension becomes .html.
                The file holds the result of the last completed refresh, so before the first refresh, or after a failed
                one, the button answers No data to export. Refresh first.
              </li>
              <li>
                <strong>Mask names and statements:</strong> in the exported blocking chain it replaces login, host, and
                application names with aliases such as user_1, host_1, and app_1 (the same value always gets the same
                alias) and replaces string, numeric, and binary literals in the captured statements with [REDACTED]
                tokens. Database names and wait types are written as they are, and the Blocking Chains table on screen
                is never masked. Clear the box only when the raw names are needed.
              </li>
              <li>
                <strong>Delta badge:</strong> hover it for the window length. Max on the cards is still the longest
                single wait since instance start or the last counter reset, because the DMV does not expose a
                per-window maximum; in delta mode the pill says so in its tooltip.
              </li>
            </ul>
          </>
        }
        image="/docs/wait-statistics/003.png"
        alt="Wait Statistics action row with a red frame drawn around the Export button and the Mask names and statements checkbox, and the DELTA 176s badge on the right"
        width={1624}
        height={153}
      />

      <ScreenshotCard
        eyebrow="Screen 4"
        title="Trend & Blocking Tab"
        body={
          <>
            <p>
              The Wait Analysis panel on its second tab, with Display set to Daily Summary and a seven-day window read
              from the Query Store of the connected database.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Chart:</strong> one Total Wait line with a point per day from 09-30 to 10-07, peaking on 10-04
                and 10-07 at about 1.6 million ms; the axis is labelled 0, 410k, 819k, 1.2m, and 1.6m.
              </li>
              <li>
                <strong>Meta line and table:</strong> Window: 7 days and Source: query store, then Date and Total Wait
                rows from 110 ms on 2026-09-30 through 1,601,592 ms on 2026-10-04 to 1,638,472 ms on 2026-10-07. Eight
                dates appear because the window reaches back seven days from the moment of the refresh and so touches
                eight calendar days.
              </li>
              <li>
                <strong>Display:</strong> Dominant Category replaces the table columns with Date, Dominant Category,
                Share %, and Wait; Category Breakdown draws the six largest categories as separate lines and lists
                share / wait per category. A chart needs at least two days with data; hovering a point shows date,
                series, and ms.
              </li>
              <li>
                <strong>Blocking Chains:</strong> No active blocking chains at the time of the capture. With live
                blocking the table lists Session, Wait, Wait ms, Database, and Login per node, marks root blockers as
                (root), and flags a cycle with Cycle detected.
              </li>
            </ul>
          </>
        }
        image="/docs/wait-statistics/004.png"
        alt="Wait Statistics Trend & Blocking tab with the Daily Summary chart and table for a 7-day window from Query Store, and the Blocking Chains section reading No active blocking chains"
        width={1097}
        height={878}
        maxWidthClass="max-w-4xl"
        sizes="(min-width: 1024px) 896px, 100vw"
      />

      <ScreenshotCard
        eyebrow="Screen 5"
        title="Insights Panel with Show Details"
        body={
          <>
            <p>
              The Insights panel after Show Details (the button now reads Hide Details), from the same cumulative
              refresh as the main layout. The Wait / Plan block, the Add Custom and Remove Custom buttons, and the
              Wait Categories panel that open with it sit below the captured area.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Alerts and Primary Finding:</strong> unchanged from Screen 1: one critical Lock Wait Pressure
                alert at a 56.7% lock share against the 15.0% threshold, and Lock Contention at 92% confidence with
                no baseline configured.
              </li>
              <li>
                <strong>Before / After:</strong> Status: Insufficient Data and Capture both BEFORE and AFTER snapshots to
                compare change impact, with Save Before, Save After, and Compare under it.
              </li>
              <li>
                <strong>Next Action:</strong> [Alert Detail] Active Alerts: 1 (critical=1). [Possible Root Cause] names
                lock contention (Lock share 56.7%), WRITELOG pressure as a transaction-log latency risk, and a rising
                trend over the selected window. [Recommended Checks] runs from 1. Open Blocking to see head blockers
                and the blocking chain through DBCC OPENTRAN, missing indexes on the blocked objects, log-file latency
                and queue depth, to 5. Check VLF count (DBCC LOGINFO / dm_db_log_info). [Quick Fix Actions] lists
                short transactions without user input inside them, READ_COMMITTED_SNAPSHOT where readers block
                writers, and a faster log file or better growth increments.
              </li>
              <li>
                <strong>Custom Categories:</strong> the pill 0 configured, Custom Category Rules: - No custom categories
                configured, and Current Wait Time by Custom Category: - No waits matched custom categories.
              </li>
            </ul>
          </>
        }
        image="/docs/wait-statistics/005.png"
        alt="Wait Statistics Insights panel expanded with Hide Details, showing the alert, the Lock Contention primary finding, the Before / After block with Save Before, Save After and Compare, the lock-specific Next Action plan, and Custom Categories with 0 configured"
        width={504}
        height={883}
        maxWidthClass="max-w-xl"
        sizes="(min-width: 1024px) 576px, 100vw"
      />

      <RefSection eyebrow="Data Sources and Analysis Model">
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Core Wait Data</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Reads SQL Server DMVs such as <span className="font-mono">sys.dm_os_wait_stats</span>, <span className="font-mono">sys.dm_exec_requests</span>, and <span className="font-mono">sys.dm_exec_sessions</span>, plus Query Store for the trend and for query context.</li>
              <li>Excludes 96 benign idle and background wait types (SLEEP_TASK, LAZYWRITER_SLEEP, CHECKPOINT_QUEUE, XE_TIMER_EVENT, WAITFOR, and their relatives) before anything is ranked. CXPACKET and CXCONSUMER are not excluded.</li>
              <li>Shows the delta since the previous refresh of the same server and database when that sample is less than six hours old. The first refresh after opening the application is CUMULATIVE; a previous sample older than six hours gives CUMULATIVE (STALE); counters that went down since the previous sample (restart or clear) give POST-RESET.</li>
              <li>Keeps only the latest previous sample, separately per server and database, in a local file that is overwritten on every refresh.</li>
              <li>Separates total wait, signal wait, resource wait, and the sessions currently waiting.</li>
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Historical Trend Source</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Prefers Query Store wait history through <span className="font-mono">sys.query_store_wait_stats</span> on SQL Server 2017 or later, Azure SQL Database, and Azure SQL Managed Instance. This source is the Query Store of the connected database, so it is database-scoped.</li>
              <li>Falls back to local history: one aggregate row per successful refresh, kept per server and database in a local file trimmed to the newest 4,000 rows, with rows older than 30 days compacted to hourly. The trend is then the per-day growth of the instance-wide counters, with reset detection, so a day gets a point only after two refreshes with growth between them.</li>
              <li>The first source that answers is pinned for that server and database and is only re-chosen when it stops returning data; the two sources have different magnitudes, so switching silently would create false jumps.</li>
              <li>The meta line names the source as query store, local history, local history unavailable, query store unavailable, or none, and the empty state reads No historical trend data for N days.</li>
              <li>Local history holds aggregate wait figures only: no query text and no logins.</li>
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Blocking and Live Chains</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Uses the same chain analysis as the Blocking Analysis module to explain active contention, read for display only: viewing chains here adds nothing to the Blocking Analysis history and never triggers its webhook.</li>
              <li>Lists Session, Wait, Wait ms, Database, and Login per node. Roots are written as SPID n (root); a root outside any session appears as SPID n (Orphaned distributed transaction) or (Deferred recovery transaction).</li>
              <li>A Database or Application filter re-derives the chains, the blocked-session count, and the chain depth for the matching sessions only.</li>
              <li>Cycle detected marks a circular chain; a chain over 600 nodes is cut with Truncated view at N nodes for responsiveness; otherwise No active blocking chains.</li>
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Query Context Mode</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>The [ Waits ] button on a query in Query Statistics opens this page with that query. A bar reads Query context: database.schema.object (query_id N) — top waits show this query’s Query Store wait categories, with a Clear Context button; ad-hoc query stands in for an unnamed statement.</li>
              <li>Top Waits then lists up to ten Query Store wait categories of that query over the trend window and the badge reads QUERY WAITS. Query Store carries no task count, maximum, or signal split per category, so those pills read 0 in this mode.</li>
              <li>Needs SQL Server 2017 or later with Query Store wait data for the query; when Query Store returns nothing, the bar stays but the list shows the server-wide waits with the normal badge.</li>
              <li>Wait / Plan correlation reads the query’s plan XML and is available only in this mode. The context is dropped when you leave the page.</li>
            </ul>
          </div>
        </div>
      </RefSection>

      <RefSection eyebrow="Header, Filters, and Main Tabs">
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Actions and Context</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Query-context bar with Clear Context, shown only when you arrive from Query Statistics</li>
              <li>↻ Refresh — the only way to collect new data; there is no timer</li>
              <li>Set Baseline — saves the last completed result as the baseline for this server and database and refreshes; answers Refresh wait statistics before setting baseline. when there is none</li>
              <li>Export — saves the last completed result as HTML, JSON, or Markdown; Mask names and statements decides whether the exported blocking chain is aliased</li>
              <li>Set Baseline, Export, Save Before, Save After, and Compare are disabled while a refresh runs</li>
              <li>Data badge: DELTA ⏱ Ns, CUMULATIVE, CUMULATIVE (STALE), POST-RESET, ACTIVE (FILTERED), or QUERY WAITS, each with a tooltip; NO DATA before the first refresh</li>
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Filter Panel</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Trend Window: 7, 30, or 90 Days; changing it refreshes immediately</li>
              <li>Database and Application: free text with suggestions from the sessions currently waiting; partial, case-insensitive match; Enter applies. Either one switches Top Waits to the matching active waiters, grouped into up to 15 wait types, and the badge to ACTIVE (FILTERED)</li>
              <li>Summary shares, Wait Categories, Primary Finding, and the trend stay instance-wide under a filter and say so with an (instance-wide) note; Current Waits and the session-based alerts (blocked sessions, chain depth, long individual wait) follow the filtered sessions</li>
              <li>Minimum Wait: None, &gt;100 ms, &gt;1 sec, &gt;5 sec, &gt;30 sec, or &gt;1 min; a view filter on the displayed list only</li>
              <li>Apply Filter; refresh progress appears as NN% · message on the status line of the Summary panel</li>
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Main Tabs</div>
            <ol className="list-decimal pl-5 space-y-1">
              {mainTabs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <p className="mt-2">Top Waits is the default tab. Trend &amp; Blocking holds the Display selector, the chart, the daily table, and the Blocking Chains table.</p>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Top Waits Behavior</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Each card shows the wait type, its category, the pills Wait, Tasks, Share, and Max in compact form (2.5h, 49.4m, 3.1s, 74ms), a sparkline of the whole category’s daily trend (last eight points, [n/a] under two, ending in up, down, or flat), and a detail line with the Signal/Resource split and a hint.</li>
              <li>Up to 10 server-level wait types; up to 15 with a Database or Application filter; up to 10 Query Store categories in query context.</li>
              <li>Hints by wait-type prefix: Check disk latency (PAGEIOLATCH, WRITELOG, IO_COMPLETION, BACKUP, ASYNC_IO_COMPLETION), Inspect blockers (LCK_), Review MAXDOP (CXPACKET, CXCONSUMER, CXSYNC), Check hot pages/TempDB (PAGELATCH, LATCH_), Review memory grants (RESOURCE_SEMAPHORE, CMEMTHREAD), otherwise Correlate with query plan.</li>
              <li>With nothing to show the tab reads No significant waits detected and suggests a wider trend window, a lower minimum wait, or relaxed database and application filters.</li>
            </ul>
          </div>
        </div>
      </RefSection>

      <RefSection eyebrow="Right-Side Insights">
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Summary and Categories</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Total Wait is written in days, hours, min, sec, or ms. In delta mode without a filter it adds the rate in ms per second, coloured amber from 1,000 and red from 5,000 ms/s.</li>
              <li>Signal Wait is coloured from 25% (amber) and 40% (red); Current Waits from 5 and 12 sessions; Resource Wait is never coloured.</li>
              <li>The health line shows the title of the most severe active alert as CRITICAL: … or WARNING: …; with no alert it reads HEALTHY: Signal Wait x.x%.</li>
              <li>The status line reads Updated in N ms | mode=server, filtered, or query | basis=delta/Ns, cumulative warm-up, since-reset cumulative, cumulative (prior sample too old for delta), or point-in-time active waiters | waits=N | alerts=N.</li>
              <li>Wait Categories, revealed by Show Details, shows share tiles for CPU, I/O, Lock, Latch, Memory, Network, Buffer, CLR, and Other; tiles with no wait time are hidden. Amber and red start at 15/30% for CPU, 20/40% for I/O, 12/25% for Lock and Latch, 10/20% for Memory and Other, 25/50% for Network, 15/30% for Buffer, and 20/40% for CLR.</li>
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Insight Blocks</div>
            <ul className="list-disc pl-5 space-y-1">
              {insightBlocks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-2">Show Details also reveals the Wait Categories panel below the Insights panel.</p>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Alerts and Primary Finding</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ten fixed rules: Total Wait Rate High (1,000 ms/s, critical from 5,000; needs a delta window of at least 10 seconds, or growth since a saved baseline in cumulative mode), Lock Wait Pressure (15% of wait time, critical from 25%), I/O Wait Pressure (30%, critical from 54%), Signal Wait Ratio High (CPU Pressure) (25%, critical from 40%), PAGEIOLATCH Dominance (30%), ASYNC/BACKUP I/O Spike (20%), Parallelism + Latch Combo (both at least 10%), Blocked Session Count High (3), Blocking Chain Depth High (3), and Long Individual Wait Detected (60,000 ms). The share rules need at least 10,000 ms of wait in the window.</li>
              <li>The panel lists up to three alerts sorted by severity, then +N more alert(s); each message names the value and the threshold. With none active it reads No active wait alerts. and prints the thresholds in effect.</li>
              <li>There is no threshold editor in the module. The defaults above apply unless a wait_stats_alert_thresholds.json file in the application’s data folder overrides them.</li>
              <li>Primary Finding names the strongest wait signature with a confidence from 30% to 95%, its evidence, and the baseline status. The signatures are CPU Pressure, I/O Bottleneck, Lock Contention, Memory Grant Pressure, Latch Contention, Network Throughput Pressure, Buffer Pool Pressure, and CLR Execution Pressure; each fires on a category share or on a matching top wait type, and when none crosses its line the finding is Balanced Wait Profile at 60%.</li>
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Details: Before / After, Next Action, Custom Categories, Wait / Plan</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Before / After: Save Before and Save After capture the last completed result and run the comparison as soon as both exist; Compare re-runs it. The result is Improved, Degraded, Stable (a change under 10% or under 50,000 ms), or Insufficient Data, which is also the answer when the two snapshots have different bases, such as delta against cumulative.</li>
              <li>Baseline: in delta mode the comparison is rate-normalized and reports Degraded above +10% and Improved below −5%, withholding the verdict when either window is shorter than 60 seconds; in cumulative mode it reports the growth since capture and judges by a shift of five points in the signal share. A restart or a counter clear after the capture is reported as Baseline reset with a request to re-capture.</li>
              <li>Next Action opens with [Alert Detail] and the active and critical alert counts, then up to five [Possible Root Cause] lines, five numbered [Recommended Checks], and five [Quick Fix Actions]. Its rules cover I/O share, backup waits, lock waits (Open Blocking to see head blockers and the blocking chain, READ_COMMITTED_SNAPSHOT), WRITELOG, parallelism with page latches, baseline degradation or reset, and trend direction, with generic fallbacks. It is separate from the Primary Finding, so the two can point at different areas.</li>
              <li>Custom Categories: Add Custom opens the Add Custom Wait Category dialog with Name and Pattern; the pattern is a case-insensitive regular expression, the first matching rule wins, an invalid pattern is refused with Failed to save custom category rule (check regex)., and the block opens on its own after a save. The list reads Custom Category Rules: with - name [ON] =&gt; /pattern/ lines and Current Wait Time by Custom Category: with - name: N ms, and the pill counts active rules. Remove Custom picks a rule from a list. Rules are stored locally and never change the built-in category tiles.</li>
              <li>Wait / Plan reads Wait/Plan correlation requires query context. Navigate from Query Statistics. until a query is opened from there; then it shows Query N (confidence), its wait categories, findings such as lock waits with a table scan or I/O waits with a key lookup or a spill, and one action. Its meta line gives the analysis profile, the bottleneck, and the confidence level; hover it for the reasoning, priority, risk, and evidence gaps.</li>
            </ul>
          </div>
        </div>
      </RefSection>

      <RefSection eyebrow="Sample Exported Report">
        <p className="text-sm leading-7 text-gray-700">
          A report saved with Export in HTML format in version 1.1.0 on October 7, 2026, from the same SQL Server test
          instance as the screenshots, with the 7-day trend window and no filter. The file name carries the collection
          time (15:15:52) and the Generated at line the time of the save (15:17:15). It is published exactly as the
          application wrote it: a wait-statistics export contains no server, database, login, or host names unless a
          blocking chain or a filter is present, and this one has neither.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-7 text-gray-700">
          <li>
            <strong>Summary and Analysis Transparency:</strong> 33 wait types, 226,515 waiting tasks, and 6,647 ms of wait
            in the window, 10.23% of it signal wait; the deterministic analysis names PARALLELISM as the primary
            bottleneck at priority P2, risk MEDIUM, and confidence low, with Query context, Plan XML, and Plan insights
            listed as evidence gaps because no query was attached.
          </li>
          <li>
            <strong>Category Wait Time, Top Waits, and Signatures:</strong> CPU holds 5,441 of the 6,647 ms; CXPACKET leads
            the ten top waits with 65.97%, followed by CXCONSUMER and RESERVED_MEMORY_ALLOCATION_EXT; CPU Pressure is
            the signature at 0.95 confidence, with I/O Bottleneck, Latch Contention, and Network Throughput Pressure at
            the 0.3 floor.
          </li>
          <li>
            <strong>Trend:</strong> eight days from 2026-09-30 with total wait, dominant category, and dominant wait per
            day; CPU dominates every day except 2026-10-04, where Lock leads.
          </li>
          <li>
            <strong>Baseline, Before / After, Wait Chain Summary, Alert Thresholds, Plan Correlation, Filters:</strong>
            no-baseline, insufficient-data, No active blocking chains., the ten thresholds in effect (including the
            legacy total_wait_time_ms value that is still written but no longer decides an alert), query_id 0 with
            plan_available False, and the empty filter set.
          </li>
          <li>
            <strong>Not in this file:</strong> the HTML writer drops empty sections, so there is no Alerts, Custom
            Category, Plan Findings, or Plan Recommendations section here; they appear when the refresh had alerts,
            rules, or a query plan. Only the JSON format carries the blocking-chain nodes and edges, and with them the
            masked flag.
          </li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={reportHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Open Preview
          </a>
          <a
            href={reportHref}
            download
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
          >
            Download HTML Report
          </a>
        </div>
      </RefSection>

      <RefSection eyebrow="Refresh Behavior, Messages, and Local Files">
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">When a Refresh Runs</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>On opening the page while connected, on ↻ Refresh, Apply Filter, or Enter in the Database or Application field, on a Trend Window change, on Clear Context, after Set Baseline, after adding or removing a custom rule, and when the application connects or switches server or database.</li>
              <li>There is no timer and no background collection: nothing is read while the page or the application is closed.</li>
              <li>Leaving the page cancels a running refresh at its next checkpoint; a statement already executing on the server runs to completion.</li>
              <li>A refresh started on another server or database does not feed Set Baseline, Save Before / After, or Export; those answer Refresh … first until the current target has a completed result.</li>
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Status and Error Messages</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Progress on the status line: Preparing background refresh..., Loading wait snapshot..., Loading active waiters..., Wait data collected; running analysis..., Analyzing wait signatures..., Comparing against baseline..., Analyzing wait chains..., Evaluating alert thresholds..., Loading N-day trend..., Refresh completed.</li>
              <li>When the counters were read but a later step failed: Completed with partial data in N ms (rows=N). Failed step: …</li>
              <li>Failures: Please connect to a database first., Refresh already in progress... (retried after 0.7 s), Database connection lost during wait stats refresh., Wait stats refresh timed out. Please try again., Insufficient permission to read wait statistics., Wait counters could not be read: …, Wait statistics could not be collected: …, and Unexpected error while refreshing wait statistics.; the page then shows Wait statistics unavailable with the reason.</li>
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Permissions</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>The wait counters and the active waiters need VIEW SERVER STATE; the trend and query context need read access to the Query Store of the connected database.</li>
              <li>Every statement is a SELECT against DMVs or Query Store views. The module never issues DBCC SQLPERF, and there is no reset control in the user interface.</li>
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Local Files</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>In the application’s data folder: the last sample per target (wait_stats_last_snapshot.json), the baseline (wait_stats_baseline.json), the Before / After snapshots (wait_stats_before_after.json), the custom categories (wait_stats_custom_categories.json), the alert thresholds (wait_stats_alert_thresholds.json), and the alert cooldown state (wait_stats_alert_state.json).</li>
              <li>In the logs folder: the local trend history (wait_stats_history.jsonl) and a refresh log (wait_stats_telemetry.jsonl) with timings and errors for one refresh in ten and for every failed one, trimmed above 8 MB. The same line is written once to the application log.</li>
              <li>All of these stay on the machine; the module has no outbound target.</li>
            </ul>
          </div>
        </div>
      </RefSection>

      <RefSection eyebrow="Detailed Control Reference">
        <div className="grid gap-3 md:grid-cols-3 text-sm text-gray-700">
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Buttons</div>
            <ul className="list-disc pl-5 space-y-1">
              {buttons.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Checkboxes</div>
            <ul className="list-disc pl-5 space-y-1">
              {checkboxes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Dropdowns and Filter Fields</div>
            <ul className="list-disc pl-5 space-y-1">
              {comboboxes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </RefSection>

      <RefSection eyebrow="Behavior Notes and Typical Workflow">
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Important Behavior Notes</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Database and Application switch Top Waits to the sessions currently waiting and filter the blocking chains; Summary shares, categories, the Primary Finding, and the trend stay instance-wide. Minimum Wait only hides cards.</li>
              <li>A delta needs two refreshes of the same server and database less than six hours apart; the first refresh, a stale previous sample, or reset counters give cumulative totals, and the badge says which.</li>
              <li>Set Baseline is separate from the explicit Save Before / Save After comparison, and both need a completed refresh on the current target.</li>
              <li>The Primary Finding and the Next Action plan use different rule sets and can point at different areas; the Lock Wait Pressure alert and the Lock Contention signature are also computed separately, so one can appear without the other.</li>
              <li>The trend source is pinned per server and database after the first successful refresh and can read query store, local history, local history unavailable, query store unavailable, or none.</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Typical Workflow</div>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Click ↻ Refresh twice a few minutes apart so the badge reads DELTA, then read the health line, Alerts, and Primary Finding.</li>
              <li>Inspect Top Waits for the dominant category and the hint on each card; press Show Details for Wait Categories and Next Action.</li>
              <li>Use Trend &amp; Blocking to see whether the pattern is new or recurring and whether live blockers are involved.</li>
              <li>Narrow with a Database or Application filter when one workload is suspected.</li>
              <li>Set a baseline or save Before / After snapshots around a change to measure its effect.</li>
              <li>When the question is one query, open it from the [ Waits ] button in Query Statistics and read Wait / Plan.</li>
              <li>Export the result as HTML for a hand-over, keeping Mask names and statements checked.</li>
            </ol>
          </div>
        </div>
      </RefSection>

      <section id="faq" className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm scroll-mt-24">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Common Questions</div>
        <h2 className="text-2xl font-bold text-gray-900">SQL Server Wait Statistics FAQ</h2>
        <div className="mt-5 space-y-5">
          {faqs.map((item) => (
            <div key={item.q} className="min-w-0">
              <h3 className="text-base font-semibold text-gray-900">{item.q}</h3>
              <p className="mt-1.5 text-sm leading-7 text-gray-700">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <RefSection eyebrow="Related References">
        <p className="text-sm leading-7 text-gray-700">
          For deeper SQL Server investigation, pair this module with{' '}
          <Link href="/docs/modules/query-statistics" className="font-semibold text-primary hover:text-primary-dark">
            Query Statistics
          </Link>{' '}
          for query-level regression analysis,{' '}
          <Link href="/docs/modules/blocking-analysis" className="font-semibold text-primary hover:text-primary-dark">
            Blocking Analysis
          </Link>{' '}
          for chain-first lock investigation, and{' '}
          <Link href="/docs/modules/dashboard" className="font-semibold text-primary hover:text-primary-dark">
            Dashboard
          </Link>{' '}
          for broader CPU, I/O, memory, and workload pressure context. For the SQL Server side of the subject rather
          than the module — the DMVs, the queries, delta capture and per-wait playbooks —{' '}
          <Link
            href="/guides/sql-server-wait-statistics"
            className="font-semibold text-primary hover:text-primary-dark"
          >
            the complete wait statistics guide
          </Link>{' '}
          goes considerably deeper.
        </p>
      </RefSection>
    </div>
  )
}
