import Link from 'next/link'
import LightboxImage from './LightboxImage'

const screenAreas = [
  'Filter panel, with the query-context bar and the Refresh / Set Baseline / Export row',
  'Wait Analysis panel with the Top Waits and Trend & Blocking tabs',
  'Summary panel',
  'Insights panel',
  'Wait Categories panel (shown with Show Details)',
]

const mainTabs = [
  'Top Waits',
  'Trend & Blocking',
  'Automation',
]

const insightBlocks = [
  'Alerts',
  'Primary Finding',
  'Before / After (Show Details)',
  'Next Action (Show Details)',
  'Custom Categories (Show Details)',
  'Wait / Plan (Show Details)',
  'Outbound target status',
]

const buttons = [
  'Refresh',
  'Set Baseline',
  'Export',
  'Apply Filter',
  'Clear Context',
  'Show Details / Hide Details',
  'Save Before',
  'Save After',
  'Compare',
  'Add Custom',
  'Remove Custom',
  'Save Schedule',
  'Save Thresholds',
  'Add Category',
  'Remove Category',
  'Clear Wait Stats (Manual Admin)',
  'Add Server Target',
  'Remove Target',
  'Push Metrics Now',
]

const checkboxes = [
  'Scheduled Snapshot Enabled',
  'Enable 5s Monitor (while view is visible)',
  'Enable Admin Tools for this session',
]

const comboboxes = [
  'Trend Window: 7, 30 or 90 Days',
  'Database: type a name or pick a suggestion',
  'Application: type a name or pick a suggestion',
  'Minimum Wait: None, >100 ms, >1 sec, >5 sec, >30 sec, >1 min',
  'Display: Daily Summary, Dominant Category, Category Breakdown',
]

const reportHref = '/docs/wait-statistics/wait_stats_export_20261004_155427'

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
        <div className="min-w-0 space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <p className="text-sm leading-7 text-gray-700">{body}</p>
        </div>
        <LightboxImage src={image} alt={alt} width={width} height={height} />
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
          excludes the benign idle waits before it computes anything, reports Total Wait, Signal Wait and Resource Wait
          side by side in its Summary panel, and drives its health line from the signal-wait share: a warning from 20%
          and critical from 35%, both labelled as CPU pressure.
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
          The Wait Statistics module is the wait-centric diagnostics surface. It combines SQL Server wait counters
          (as a delta since the previous refresh where possible, otherwise cumulative), active waiting sessions,
          blocking chains, a 7-, 30- or 90-day wait trend, optional query-level wait correlation, and threshold alerts
          so you can identify the dominant source of performance pressure quickly. Every query it runs against SQL
          Server is read-only.
        </p>
        <p className="mt-3 text-sm leading-7 text-gray-700">
          This module is most valuable alongside{' '}
          <Link href="/docs/modules/query-statistics" className="font-semibold text-primary hover:text-primary-dark">
            Query Statistics
          </Link>{' '}
          when you need wait-to-plan correlation, and{' '}
          <Link href="/docs/modules/blocking-analysis" className="font-semibold text-primary hover:text-primary-dark">
            Blocking Analysis
          </Link>{' '}
          when waits point to live blockers and chain depth.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm text-gray-700">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What You Can Do</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Inspect dominant wait types and wait-category pressure.</li>
              <li>Review active waiting sessions and blocking chains.</li>
              <li>Compare against a saved baseline or explicit before/after snapshots.</li>
              <li>Configure current-session threshold signals, refresh-driven snapshots, and custom regex categories.</li>
              <li>Export the current analysis to HTML, JSON, or Markdown.</li>
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
        title="Main Wait Diagnostics Layout"
        body="The opening view puts the filter panel (Trend Window, Database, Application, Minimum Wait) and the Refresh, Set Baseline and Export actions above the Wait Analysis panel, with the Summary and Insights panels alongside. On the Top Waits tab each card shows the wait type, its category, wait time, task count, share and longest wait, a trend line for its category, and a detail line with an impact score, the signal/resource split and a short next-step hint. A badge tells you whether you are looking at a delta since the last refresh, cumulative counters, filtered active waiters, or query waits. In this capture of the WideWorldImporters demo database the badge reads DELTA for a 10,198-second window, lock waits (LCK_M_X, LCK_M_U, LCK_M_S) lead the list, and five alerts are active. The health line still reads HEALTHY because it looks only at the signal-wait percentage (1.6% here), not at which waits dominate. This is the primary screen for deciding whether the dominant pressure is CPU, I/O, lock, latch, memory, or network related."
        image="/docs/wait-statistics/001.png"
        alt="Wait Statistics main screen with the filter panel, Top Waits cards led by LCK_M_X, and the Summary and Insights panels"
        width={1919}
        height={969}
      />

      <ScreenshotCard
        eyebrow="Screen 2"
        title="Trend View for Historical Wait Direction"
        body="The Trend & Blocking tab helps determine whether the dominant wait pattern is new, recurring, or gradually increasing — the question cumulative counters cannot answer on their own. The Display selector switches the chart and the daily table between Daily Summary, Dominant Category (with its share of the day) and Category Breakdown; a chart needs at least two data points. A line above the table names the window and the source. Here it reads Window: 7 days and Source: query store, and total wait per day climbs from under a second on 09-29 to about 750,000 ms on 10-03. When the source is Query Store the trend reflects query-level wait categories, so it can emphasize a different category than the server-wide Top Waits tab. The module prefers Query Store wait history when available and falls back to the aggregate snapshots it stores locally on each refresh when Query Store wait history is missing. The Blocking Chains table is on this tab too (not shown in the capture)."
        image="/docs/wait-statistics/002.png"
        alt="Wait Statistics Trend & Blocking tab showing the Daily Summary chart and table for a 7-day window with Source query store"
        width={1642}
        height={924}
      />

      <ScreenshotCard
        eyebrow="Screen 3"
        title="Insights Panel with Show Details Expanded"
        body="The Insights panel turns the current evidence into an operational narrative. Alerts and the Primary Finding are always visible; Show Details expands the Before / After comparison, a Next Action plan, Custom Categories, and Wait / Plan correlation, and also reveals the Wait Categories panel. In this capture five alerts are active and the first three are listed (lock wait share 90.4% against a 15.0% threshold, three blocked sessions, blocking chain depth 3), followed by +2 more alert(s). The Primary Finding is Lock Contention at 95% confidence, with its evidence and the baseline status. Before / After reads Insufficient Data until both a Before and an After snapshot are saved. Next Action opens with an alert-detail line and then lists possible root causes, recommended checks and quick fix actions. It is built from its own rules, separate from the Primary Finding, so it can point at a different area: here it suggests checking transaction-log latency because WRITELOG is among the top waits, while the finding is lock contention. Custom Categories reads 0 configured until you add a regex rule."
        image="/docs/wait-statistics/003.png"
        alt="Wait Statistics Insights panel expanded with Show Details, showing alerts, primary finding, before-after comparison, next action, and custom categories"
        width={521}
        height={894}
      />

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-amber-900 mb-2">Automation Screen Note</div>
        <h3 className="text-2xl font-bold text-amber-950">Current-Session Refresh and Admin Controls</h3>
        <p className="mt-3 text-sm leading-7 text-amber-950">
          The current public asset set does not include a clean standalone screenshot for the Automation tab, so this
          page describes those controls in text instead of showing a mismatched image. The available controls still
          include refresh-driven snapshots, a 5-second visible-view refresh option, custom wait categories, outbound
          targets, and the guarded admin-only wait reset flow. These controls do not run as a background service when
          the application or view is closed.
        </p>
      </div>

      <RefSection eyebrow="Data Sources and Analysis Model">
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Core Wait Data</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Uses SQL Server DMVs such as <span className="font-mono">sys.dm_os_wait_stats</span>, <span className="font-mono">sys.dm_exec_requests</span>, and <span className="font-mono">sys.dm_exec_sessions</span>.</li>
              <li>Excludes benign idle and background waits before ranking anything.</li>
              <li>Shows the delta since the previous refresh when one is available and less than six hours old. Otherwise it shows cumulative counters, flagged POST-RESET when the counters went down and CUMULATIVE (STALE) when the previous snapshot is older than six hours.</li>
              <li>Keeps only the latest previous snapshot, separately per server and database, in a local file that is overwritten on every refresh.</li>
              <li>Separates total wait, signal wait, resource wait, and active waiting-session evidence.</li>
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Historical Trend Source</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Prefers Query Store wait history through <span className="font-mono">sys.query_store_wait_stats</span>.</li>
              <li>Query Store wait history requires SQL Server 2017 or later, Azure SQL Database, or Azure SQL Managed Instance.</li>
              <li>Falls back to local history: one aggregate row per successful refresh, kept separately per server and database in a local file. The file is trimmed to the newest 4,000 rows, and rows older than 30 days are compacted to hourly. The trend is the per-day growth of the cumulative counters, with counter-reset detection.</li>
              <li>The first source that works is pinned for that server and database, so the chart does not flip between sources on every refresh; it is re-pinned when Query Store stops answering.</li>
              <li>The trend panel names its source: query store, local history, or an unavailable note when neither has data.</li>
              <li>Local history holds aggregate wait figures only: no query text and no logins.</li>
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Blocking and Live Chains</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Uses the same blocking-chain analysis as the Blocking Analysis module to explain active contention.</li>
              <li>Shows root blockers and blocked sessions with session, wait, wait ms, database, and login columns.</li>
              <li>Database, Application, and Minimum Wait filters apply to the chains as well.</li>
              <li>Reads the chains for display only: viewing them here does not add entries to the Blocking Analysis history.</li>
              <li>With no active chain the table reads No active blocking chains. A circular chain is flagged, and a very large chain is cut off at 600 nodes.</li>
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Query Context Mode</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Opened from the [ Waits ] link on a query in Query Statistics, Top Waits switches to that query’s Query Store wait categories (when Query Store holds wait data for it) and the badge reads QUERY WAITS.</li>
              <li>A context bar names the query; Clear Context returns to server-level waits.</li>
              <li>Wait / Plan correlation, which reads the query’s execution plan, is available only in this mode.</li>
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
              <li>Refresh</li>
              <li>Set Baseline — saves the current result as the baseline and refreshes</li>
              <li>Export — saves the current result as HTML, JSON, or Markdown</li>
              <li>Data badge: DELTA, CUMULATIVE, POST-RESET, CUMULATIVE (STALE), ACTIVE (FILTERED), or QUERY WAITS</li>
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Filter Panel</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Trend Window: 7, 30, or 90 Days (changing it refreshes immediately)</li>
              <li>Database and Application: free-text fields with suggestions from current waiters; partial names match, and Enter applies</li>
              <li>Minimum Wait: None, &gt;100 ms, &gt;1 sec, &gt;5 sec, &gt;30 sec, or &gt;1 min</li>
              <li>Apply Filter; refresh progress appears on the status line in the Summary panel</li>
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Main Tabs</div>
            <ol className="list-decimal pl-5 space-y-1">
              {mainTabs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Top Waits Behavior</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Cards show wait type, category, Wait, Tasks, Share, and Max, a trend sparkline for the whole category, and a detail line with an impact score, the signal/resource split, and, once a baseline is set, the category’s change against it.</li>
              <li>Up to 10 server-level wait types; with any filter active, up to 15 wait types grouped from the matching active waiters; from Query Statistics, the query’s Query Store wait categories.</li>
              <li>Each card ends with a heuristic hint such as Check disk latency, Inspect blockers, Review MAXDOP, Check hot pages/TempDB, Review memory grants, or Correlate with query plan.</li>
            </ul>
          </div>
        </div>
      </RefSection>

      <RefSection eyebrow="Automation and Admin Controls">
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Scheduled Snapshot</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Supports periodic snapshot and report generation.</li>
              <li>Current UI exposes enabled state, interval, and Save Schedule.</li>
              <li>Snapshot generation runs when refresh occurs and the configured interval is due.</li>
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">5s Visible-View Refresh</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Refreshes every 5 seconds only while this view remains open and visible.</li>
              <li>It is not a background collector and stops when the view or desktop application is closed.</li>
              <li>Exposes visible thresholds for total wait, lock wait, and blocked sessions.</li>
              <li>The underlying service supports more alert fields than the main UI currently edits.</li>
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Custom Categories</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Supports operator-defined regex-based wait groups.</li>
              <li>Only enabled rules contribute to current custom-category totals.</li>
              <li>Rules can be added or removed from both the Automation tab and the Actions panel.</li>
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Admin Clear Safety</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Clear Wait Stats is the only destructive action in the module.</li>
              <li>It requires an armed admin session, active connection, warning confirmation, and exact phrase entry.</li>
              <li>The action runs server-wide counter reset behavior and is audit-logged.</li>
            </ul>
          </div>
        </div>
      </RefSection>

      <RefSection eyebrow="Right-Side Insights">
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Summary and Categories</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Summary shows Total Wait (with a ms-per-second rate in delta mode), Signal Wait, Resource Wait, and Current Waits.</li>
              <li>The health line is driven by signal-wait percentage: HEALTHY below 20%, WARNING from 20%, CRITICAL from 35%.</li>
              <li>A status line reports refresh time, mode (server, filtered, or query), the data basis, and wait and alert counts.</li>
              <li>Wait Categories, revealed by Show Details, shows share bars for CPU, I/O, Lock, Latch, Memory, Network, Buffer, CLR, and Other — only categories with wait time appear.</li>
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Insight Blocks</div>
            <ul className="list-disc pl-5 space-y-1">
              {insightBlocks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Alerts and Primary Finding</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Alerts are sorted by severity and the panel lists up to three, followed by +N more alert(s). They cover total wait time or growth, lock and I/O wait share, signal-wait ratio, PAGEIOLATCH dominance, backup I/O spikes, parallelism combined with latch waits, blocked sessions, chain depth, and long individual waits. Each alert names the threshold it crossed. With none active, the thresholds in effect are shown.</li>
              <li>Primary Finding names the dominant wait signature with a confidence percentage, its evidence, and the baseline status.</li>
              <li>Signature families include CPU pressure, I/O bottleneck, lock contention, latch contention, memory grant pressure, network throughput, buffer pool, CLR execution, and a balanced profile.</li>
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Details: Next Action, Custom Categories, Wait / Plan</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Before / After captures snapshots with Save Before and Save After and runs the comparison automatically once both exist; Compare re-runs it. The result is Improved, Degraded, Stable, or Insufficient Data, which is also reported when the two snapshots use different bases, such as delta against cumulative.</li>
              <li>Next Action opens with an alert-detail line (active and critical alert counts), then lists up to five possible root causes, five numbered recommended checks, and five quick fix actions. It is driven by its own rules for I/O share, backup waits, WRITELOG, parallelism with page latches, baseline degradation or reset, and trend direction, with generic fallbacks, and it is separate from the Primary Finding, so the two can point at different areas.</li>
              <li>Custom Categories groups waits by your own regex rules (Add Custom, Remove Custom) and shows current wait time per rule, with an active-rule counter.</li>
              <li>Wait / Plan explains correlations such as lock waits with scans or I/O waits with spills and lookups, and needs query context from Query Statistics. Its profile line shows the analysis profile, the bottleneck, and a confidence level; hover it for the reasoning, priority, risk, and evidence gaps.</li>
              <li>Outbound target status summarizes configured destinations; delivery depends on the active desktop session.</li>
            </ul>
          </div>
        </div>
      </RefSection>

      <RefSection eyebrow="Sample Exported Report">
        <p className="text-sm text-gray-700">
          This sample is a Wait Statistics report saved with the Export button in HTML format, taken from the
          WideWorldImporters demo database with a 7-day trend window. Lock contention is its primary bottleneck. The
          report includes Summary, Analysis Transparency, Top Waits, Signatures, Alerts, Trend, Baseline, Before / After,
          Alert Thresholds, and Filters sections. Plan correlation is marked unavailable because it was exported
          without query context. Export can also save the same analysis as JSON or Markdown, chosen by the file
          extension. Open it in the browser or download it for offline review, handoff, or ticket attachment.
        </p>
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
              <li>Database, Application, and Minimum Wait filters switch Top Waits to currently waiting sessions and filter the blocking chains; server-level summary percentages are not recalculated for the filter.</li>
              <li>Set Baseline is separate from explicit Save Before / Save After comparison.</li>
              <li>Trend source can switch between Query Store, local history, and none.</li>
              <li>Some alert and schedule fields exist in the service model but are not fully editable in the visible UI.</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Typical Workflow</div>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Click Refresh and review Summary, Alerts, and Primary Finding; use Show Details for Wait Categories and Next Action.</li>
              <li>Inspect Top Waits to identify the dominant wait profile and the hint on each card.</li>
              <li>Use Trend &amp; Blocking to determine whether the issue is persistent or tied to live blockers.</li>
              <li>Capture a baseline or explicit before/after snapshots when measuring change impact.</li>
              <li>Use Automation for current-session thresholds, refresh-driven snapshots, and outbound targets.</li>
              <li>When opened from the [ Waits ] link in Query Statistics, use Wait / Plan to connect waits with a specific plan shape.</li>
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
