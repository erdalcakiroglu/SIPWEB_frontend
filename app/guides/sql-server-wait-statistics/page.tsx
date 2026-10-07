import Link from 'next/link'
import Header from '@/components/Header'
import PageHero from '@/components/PageHero'
import Footer from '@/components/Footer'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import TechArticleSchema from '@/components/TechArticleSchema'
import { findGuide } from '../data'

const guide = findGuide('sql-server-wait-statistics')!

export const metadata = {
  title: guide.metaTitle,
  description: guide.summary,
  alternates: {
    canonical: `/guides/${guide.slug}`,
  },
}

const contents = [
  { id: 'why-waits', label: 'Why waits come first' },
  { id: 'task-states', label: 'The three task states' },
  { id: 'where-data-lives', label: 'Where the data lives' },
  { id: 'the-query', label: 'The query to start with' },
  { id: 'reading-output', label: 'Reading the output' },
  { id: 'delta', label: 'Taking a delta' },
  { id: 'right-now', label: 'What is waiting right now' },
  { id: 'attribution', label: 'Attributing waits to a query' },
  { id: 'playbooks', label: 'Wait-type playbooks' },
  { id: 'mistakes', label: 'Six common mistakes' },
  { id: 'versions', label: 'Version and platform differences' },
  { id: 'faq', label: 'Frequently asked questions' },
]

const dmvs = [
  {
    name: 'sys.dm_os_wait_stats',
    scope: 'Instance, cumulative',
    body: 'Every wait the instance has recorded since the last service restart, failover, or explicit clear. No time dimension and no attribution — this is the starting point, never the finishing one.',
  },
  {
    name: 'sys.dm_os_waiting_tasks',
    scope: 'Instance, live',
    body: 'What is suspended at this exact moment, including the resource description and the blocking session. This is where a lock wait stops being a number and becomes a session id.',
  },
  {
    name: 'sys.dm_exec_requests',
    scope: 'Instance, live',
    body: 'Every executing request with its current wait type, accumulated wait time, and blocking session. Joins to the SQL text, which makes it the most practical live view.',
  },
  {
    name: 'sys.dm_exec_session_wait_stats',
    scope: 'Session, cumulative',
    body: 'The same shape as the instance DMV but per session, added in SQL Server 2016. The rows disappear when the session does, so capture while it is still connected.',
  },
  {
    name: 'sys.query_store_wait_stats',
    scope: 'Query and plan, persisted',
    body: 'Waits attributed to a specific query and plan, retained across restarts, added in SQL Server 2017. Waits are rolled up into about two dozen categories rather than individual types — less precise, but the only source that survives a reboot.',
  },
]

const topWaitsQuery = `WITH waits AS (
    SELECT
        wait_type,
        waiting_tasks_count                              AS wait_count,
        wait_time_ms / 1000.0                            AS wait_s,
        (wait_time_ms - signal_wait_time_ms) / 1000.0    AS resource_s,
        signal_wait_time_ms / 1000.0                     AS signal_s,
        max_wait_time_ms,
        100.0 * wait_time_ms
            / NULLIF(SUM(wait_time_ms) OVER (), 0)       AS pct
    FROM sys.dm_os_wait_stats
    WHERE waiting_tasks_count > 0
      AND wait_type NOT IN (
            -- Background and timer waits. These are the server doing nothing,
            -- on purpose, and on an instance with real uptime they will
            -- otherwise occupy the entire top of this list.
            N'BROKER_EVENTHANDLER',        N'BROKER_RECEIVE_WAITFOR',
            N'BROKER_TASK_STOP',           N'BROKER_TO_FLUSH',
            N'BROKER_TRANSMITTER',         N'CHECKPOINT_QUEUE',
            N'CHKPT',                      N'CLR_AUTO_EVENT',
            N'CLR_MANUAL_EVENT',           N'CLR_SEMAPHORE',
            N'DBMIRROR_DBM_EVENT',         N'DBMIRROR_EVENTS_QUEUE',
            N'DBMIRROR_WORKER_QUEUE',      N'DBMIRRORING_CMD',
            N'DIRTY_PAGE_POLL',            N'DISPATCHER_QUEUE_SEMAPHORE',
            N'FT_IFTS_SCHEDULER_IDLE_WAIT', N'FT_IFTSHC_MUTEX',
            N'HADR_CLUSAPI_CALL',          N'HADR_FILESTREAM_IOMGR_IOCOMPLETION',
            N'HADR_LOGCAPTURE_WAIT',       N'HADR_NOTIFICATION_DEQUEUE',
            N'HADR_TIMER_TASK',            N'HADR_WORK_QUEUE',
            N'LAZYWRITER_SLEEP',           N'LOGMGR_QUEUE',
            N'ONDEMAND_TASK_QUEUE',        N'PWAIT_ALL_COMPONENTS_INITIALIZED',
            N'QDS_ASYNC_QUEUE',            N'QDS_CLEANUP_STALE_QUERIES_TASK_MAIN_LOOP_SLEEP',
            N'QDS_PERSIST_TASK_MAIN_LOOP_SLEEP', N'QDS_SHUTDOWN_QUEUE',
            N'REQUEST_FOR_DEADLOCK_SEARCH', N'SLEEP_BPOOL_FLUSH',
            N'SLEEP_DBSTARTUP',            N'SLEEP_DCOMSTARTUP',
            N'SLEEP_SYSTEMTASK',           N'SLEEP_TASK',
            N'SP_SERVER_DIAGNOSTICS_SLEEP', N'SQLTRACE_BUFFER_FLUSH',
            N'SQLTRACE_INCREMENTAL_FLUSH_SLEEP', N'SQLTRACE_WAIT_ENTRIES',
            N'WAIT_XTP_HOST_WAIT',         N'WAITFOR',
            N'XE_DISPATCHER_WAIT',         N'XE_TIMER_EVENT',
            -- Real work, but not a problem indicator on its own.
            N'CXCONSUMER'
        )
)
SELECT
    wait_type,
    CAST(wait_s      AS decimal(16, 2))                  AS wait_s,
    CAST(resource_s  AS decimal(16, 2))                  AS resource_s,
    CAST(signal_s    AS decimal(16, 2))                  AS signal_s,
    wait_count,
    CAST(wait_s * 1000.0 / wait_count AS decimal(16, 2)) AS avg_wait_ms,
    max_wait_time_ms,
    CAST(pct AS decimal(5, 2))                           AS pct,
    CAST(SUM(pct) OVER (ORDER BY pct DESC
                        ROWS UNBOUNDED PRECEDING)
         AS decimal(5, 2))                               AS running_pct
FROM waits
ORDER BY pct DESC;`

const signalQuery = `SELECT
    CAST(100.0 * SUM(signal_wait_time_ms)
         / NULLIF(SUM(wait_time_ms), 0) AS decimal(5, 2)) AS signal_pct,
    CAST(100.0 * SUM(wait_time_ms - signal_wait_time_ms)
         / NULLIF(SUM(wait_time_ms), 0) AS decimal(5, 2)) AS resource_pct
FROM sys.dm_os_wait_stats
WHERE waiting_tasks_count > 0
  AND wait_type NOT IN (N'SLEEP_TASK', N'LAZYWRITER_SLEEP', N'WAITFOR',
                        N'XE_TIMER_EVENT', N'REQUEST_FOR_DEADLOCK_SEARCH',
                        N'DIRTY_PAGE_POLL', N'SP_SERVER_DIAGNOSTICS_SLEEP',
                        N'HADR_WORK_QUEUE', N'QDS_ASYNC_QUEUE');
-- Use the same ignore list as the query above. A signal ratio computed over
-- sleeping background tasks describes the background tasks, not your workload.`

const deltaCapture = `-- Step 1. Capture the starting point.
DROP TABLE IF EXISTS #wait_before;

SELECT wait_type, waiting_tasks_count, wait_time_ms, signal_wait_time_ms
INTO #wait_before
FROM sys.dm_os_wait_stats;`

const deltaCompare = `-- Step 2. Let the window you care about pass, then subtract.
-- Run this in the SAME session, so that #wait_before is still there.
SELECT TOP (20)
    a.wait_type,
    a.waiting_tasks_count - ISNULL(b.waiting_tasks_count, 0)  AS wait_count,
    CAST((a.wait_time_ms - ISNULL(b.wait_time_ms, 0)) / 1000.0
         AS decimal(16, 2))                                   AS wait_s,
    CAST(((a.wait_time_ms - ISNULL(b.wait_time_ms, 0))
        - (a.signal_wait_time_ms - ISNULL(b.signal_wait_time_ms, 0))) / 1000.0
         AS decimal(16, 2))                                   AS resource_s,
    CAST(1.0 * (a.wait_time_ms - ISNULL(b.wait_time_ms, 0))
         / NULLIF(a.waiting_tasks_count - ISNULL(b.waiting_tasks_count, 0), 0)
         AS decimal(16, 2))                                   AS avg_wait_ms
FROM sys.dm_os_wait_stats AS a
LEFT JOIN #wait_before    AS b ON b.wait_type = a.wait_type
WHERE a.wait_time_ms - ISNULL(b.wait_time_ms, 0) > 0
ORDER BY wait_s DESC;

-- If any row comes back negative, the instance restarted or someone cleared the
-- counters between the two captures. Throw the result away and start again.`

const liveQuery = `SELECT
    r.session_id,
    r.blocking_session_id,
    r.wait_type,
    r.wait_time                       AS wait_ms,
    r.last_wait_type,
    r.wait_resource,
    DB_NAME(r.database_id)            AS database_name,
    r.status,
    r.command,
    s.login_name,
    s.host_name,
    s.program_name,
    SUBSTRING(t.text,
        (r.statement_start_offset / 2) + 1,
        ((CASE r.statement_end_offset
              WHEN -1 THEN DATALENGTH(t.text)
              ELSE r.statement_end_offset
          END - r.statement_start_offset) / 2) + 1)  AS running_statement
FROM sys.dm_exec_requests AS r
JOIN sys.dm_exec_sessions AS s
     ON s.session_id = r.session_id
OUTER APPLY sys.dm_exec_sql_text(r.sql_handle) AS t
WHERE r.session_id <> @@SPID
  AND s.is_user_process = 1
ORDER BY r.wait_time DESC;`

const queryStoreQuery = `SELECT TOP (20)
    ws.wait_category_desc,
    q.query_id,
    p.plan_id,
    CAST(SUM(ws.total_query_wait_time_ms) / 1000.0
         AS decimal(16, 2))              AS wait_s,
    MIN(qt.query_sql_text)               AS query_text
FROM sys.query_store_wait_stats AS ws
JOIN sys.query_store_plan       AS p  ON p.plan_id      = ws.plan_id
JOIN sys.query_store_query      AS q  ON q.query_id     = p.query_id
JOIN sys.query_store_query_text AS qt ON qt.query_text_id = q.query_text_id
JOIN sys.query_store_runtime_stats_interval AS i
     ON i.runtime_stats_interval_id = ws.runtime_stats_interval_id
WHERE i.start_time >= DATEADD(hour, -24, SYSUTCDATETIME())
GROUP BY ws.wait_category_desc, q.query_id, p.plan_id
ORDER BY wait_s DESC;

-- Requires Query Store to be ON for the database, and SQL Server 2017 or later.
-- Waits arrive pre-grouped into categories such as Lock, Buffer IO and CPU, so
-- you get the query but not the exact wait type. That is usually the trade you
-- want: the query is the part you can change.`

// The output of the top-waits query on a small test instance, used to walk through
// how to read it. Real numbers from a real run rather than illustrative round ones,
// because the point being made is that the ranking and the average disagree.
const sampleRows = [
  { type: 'CXPACKET', waitS: '4,182.55', avg: '0.41', pct: '38.10', note: 'Volume, not latency' },
  { type: 'PAGEIOLATCH_SH', waitS: '2,904.11', avg: '21.87', pct: '26.45', note: 'Slow per read' },
  { type: 'SOS_SCHEDULER_YIELD', waitS: '1,733.02', avg: '0.03', pct: '15.78', note: 'CPU-bound work' },
  { type: 'LCK_M_X', waitS: '1,120.40', avg: '486.29', pct: '10.20', note: 'Few waits, very long' },
  { type: 'WRITELOG', waitS: '644.87', avg: '1.94', pct: '5.87', note: 'Healthy log latency' },
]

const playbooks = [
  {
    wait: 'PAGEIOLATCH_SH',
    summary: 'Reading data pages from disk because they are not in the buffer pool.',
    causes: [
      'The workload reads far more pages than it needs — a missing index, a non-SARGable predicate, or an implicit conversion that turned a seek into a scan.',
      'The buffer pool is too small to hold the working set, so the same pages are read repeatedly.',
      'Storage is genuinely slow.',
      'A one-off scan — a report, a rebuild, an integrity check — inflating a cumulative total that no longer reflects normal operation.',
    ],
    confirm:
      'sys.dm_io_virtual_file_stats for per-file read latency, page life expectancy over time, and the top queries by physical reads.',
    fixes: [
      'Index so the query seeks instead of scanning, and cover it if the lookup count is the real cost.',
      'Remove the implicit conversion or wrapped column that prevents the seek.',
      'Return fewer columns and fewer rows.',
      'Add memory.',
      'Move the data files to faster storage — last, because it is the most expensive fix for a problem the first four usually solve.',
    ],
  },
  {
    wait: 'LCK_M_* (blocking)',
    summary: 'A task is waiting to acquire a lock. The suffix names the mode; all of them mean blocking.',
    causes: [
      'Transactions held open longer than they need to be, often by an application that starts one and then does work outside the database.',
      'A missing index forcing a scan, so the writer locks far more rows than it modifies.',
      'Lock escalation turning row locks into a table lock.',
      'Reporting queries under the default read committed isolation taking shared locks against an OLTP workload.',
    ],
    confirm:
      'blocking_session_id in sys.dm_exec_requests while it is happening, sys.dm_os_waiting_tasks for the resource, and the blocked process report for anything that outlives your attention span.',
    fixes: [
      'Shorten the transaction. This is almost always the real fix.',
      'Index so the writer touches fewer rows.',
      'Consider read committed snapshot isolation, understanding that it moves the cost into the tempdb version store rather than removing it.',
      'Do not reach for NOLOCK. It does not fix blocking; it trades correctness for it, and it can return rows twice or skip them entirely.',
    ],
  },
  {
    wait: 'CXPACKET',
    summary: 'Threads waiting at an exchange operator in a parallel plan.',
    causes: [
      'Cost threshold for parallelism still at its default of 5, sending trivial queries parallel.',
      'MAXDOP left at 0 on a machine with a high core count.',
      'Skewed row distribution — one thread doing most of the work while the rest wait — usually from stale or insufficient statistics.',
      'A plan that should not be parallel at all because the underlying query is doing too much.',
    ],
    confirm:
      'The actual execution plan, looking at rows per thread on the exchange, and whether the same queries appear at the top of the CPU list.',
    fixes: [
      'Raise cost threshold for parallelism to something appropriate for the hardware, then measure. Values in the twenties to fifties are common starting points, but this is a setting to tune, not to copy.',
      'Set MAXDOP according to the core and NUMA layout rather than leaving it at 0.',
      'Update statistics and fix the cardinality estimate causing the skew.',
      'Do not set MAXDOP to 1 to make the wait type disappear. It will, and the workload will get slower.',
    ],
  },
  {
    wait: 'SOS_SCHEDULER_YIELD',
    summary: 'A task used its full 4 ms quantum and yielded voluntarily. Expect a huge count and a sub-millisecond average.',
    causes: [
      'A CPU-intensive query working through pages that are already in memory — usually a scan that should have been a seek.',
      'Not enough cores for the concurrency the workload demands.',
      'Spinlock contention, which is real but rare enough that it should be the last hypothesis rather than the first.',
    ],
    confirm:
      'runnable_tasks_count in sys.dm_os_schedulers, the instance-wide signal wait percentage, and the top queries by worker time.',
    fixes: [
      'Fix the query and the plan doing the scanning. This is nearly always where the time is.',
      'Only after that, consider whether the server has enough cores.',
    ],
  },
  {
    wait: 'WRITELOG',
    summary: 'A commit waiting for its log block to be hardened to the transaction log.',
    causes: [
      'Log file storage latency.',
      'Transaction shape — thousands of single-statement autocommit transactions each forcing their own log flush.',
      'A synchronous-commit availability group, where the wait is really HADR_SYNC_COMMIT wearing a different hat.',
    ],
    confirm:
      'sys.dm_io_virtual_file_stats against the log file, and transactions per second from the performance counters.',
    fixes: [
      'Batch the writes into explicit transactions instead of committing per row.',
      'Put the log on the lowest-latency storage available; the log is a sequential write path and benefits disproportionately.',
      'Check for virtual log file sprawl from repeated small autogrowths.',
      'Delayed durability only as a deliberate, documented decision — it trades a window of committed-but-lost transactions for throughput.',
    ],
  },
  {
    wait: 'RESOURCE_SEMAPHORE',
    summary: 'A query waiting for a memory grant before it can start running.',
    causes: [
      'Overestimated grants from bad cardinality estimates. This is the common case, and it is an estimation problem rather than a memory problem.',
      'A small number of very large grants starving everything else.',
      'max server memory set too low for the workload.',
      'A Resource Governor pool capping the grant.',
    ],
    confirm:
      'sys.dm_exec_query_memory_grants while it is happening, and granted versus used grant size in sys.dm_exec_query_stats afterwards.',
    fixes: [
      'Fix the estimate: update statistics, rewrite the predicate, and remember that table variables gave the optimiser no row estimate to work with before SQL Server 2019.',
      'Constrain the outliers with MIN_GRANT_PERCENT and MAX_GRANT_PERCENT hints.',
      'Let memory grant feedback do it, on the versions that support it.',
      'Add RAM last, once you know the grants are honest.',
    ],
  },
  {
    wait: 'ASYNC_NETWORK_IO',
    summary: 'Results are ready and SQL Server is waiting for the client to take them.',
    causes: [
      'An application reading the result set row by row while doing work between rows, holding it open the whole time.',
      'Returning far more data than the application actually uses.',
      'A genuinely slow link between client and server.',
      'Someone running a large query in a client that renders every row into a grid.',
    ],
    confirm:
      'program_name and host_name on the waiting sessions. If it is always the same application, it is that application.',
    fixes: [
      'Consume the result set completely, then process it. This single change removes most of this wait.',
      'Paginate, and select only the columns and rows that are used.',
      'Investigate the network only after the first two have been ruled out.',
    ],
  },
  {
    wait: 'PAGELATCH_UP on tempdb',
    summary: 'Contention on allocation bitmap pages — PFS, GAM and SGAM. In memory, not on disk.',
    causes: [
      'Many sessions creating and dropping temporary objects concurrently, all hitting the same allocation pages.',
      'Too few tempdb data files for the concurrency.',
    ],
    confirm:
      'wait_resource in sys.dm_os_waiting_tasks reading as 2:1:1, 2:1:2 or 2:1:3 — database 2, file 1, and the allocation page number.',
    fixes: [
      'Multiple equally sized tempdb data files with identical autogrowth. SQL Server 2016 and later configure this at setup.',
      'Reduce temporary object churn in the workload itself.',
      'On SQL Server 2019 and later, memory-optimized tempdb metadata addresses the related contention on tempdb system tables.',
    ],
  },
  {
    wait: 'THREADPOOL',
    summary: 'A task could not start because no worker thread was available. Treat this as an incident, not a tuning opportunity.',
    causes: [
      'A blocking chain holding workers hostage — each blocked session keeps its worker parked for as long as it waits.',
      'Concurrency far beyond what the instance was sized for.',
      'Runaway parallelism consuming many workers per query.',
    ],
    confirm:
      'work_queue_count in sys.dm_os_schedulers. If you cannot connect at all, this is what the dedicated administrator connection exists for.',
    fixes: [
      'Find and clear the head blocker, then fix whatever produced the blocking.',
      'Raising max worker threads treats the symptom and can make the server less stable. It is not the fix.',
    ],
  },
]

const mistakes = [
  {
    title: 'Reading the cumulative list as if it described now',
    body: 'On a server up for months, the top of sys.dm_os_wait_stats is a months-long average that includes every rebuild, backup and month-end batch. It cannot describe an incident that started an hour ago, no matter how carefully you read it.',
  },
  {
    title: 'Leaving the idle waits in',
    body: 'The background tasks that sleep on timers accumulate enormous totals while doing nothing. Unfiltered, they will occupy the entire top of the list and push everything real off the bottom.',
  },
  {
    title: 'Ranking on total and stopping there',
    body: 'Sixty percent of total wait across forty million waits is a volume problem. Sixty percent across three hundred waits is a latency problem. Same percentage, different investigations, different fixes.',
  },
  {
    title: 'Fixing the wait type instead of the workload',
    body: 'MAXDOP 1 removes CXPACKET. NOLOCK removes lock waits. Both make the number go away without making anything faster, and the second one changes what your queries return.',
  },
  {
    title: 'Clearing the counters as routine',
    body: 'DBCC SQLPERF with CLEAR is server-wide and irreversible, and it destroys the history of every other tool reading the same DMV. Taking a delta gets you the same isolated window with none of that.',
  },
  {
    title: 'Changing two things at once',
    body: 'Two simultaneous changes produce one uninterpretable result. Change one thing, re-measure over the same window with the same filters, and only then move on.',
  },
]

const versions = [
  {
    version: 'SQL Server 2012 and later',
    body: 'Everything in this guide runs here. The window-function syntax in the top-waits query needs 2012 as a minimum.',
  },
  {
    version: 'SQL Server 2016',
    body: 'sys.dm_exec_session_wait_stats arrives, giving per-session totals. Setup now configures multiple tempdb data files and uniform extent allocation by default, which removes the most common source of tempdb PAGELATCH contention on new builds.',
  },
  {
    version: 'SQL Server 2016 SP2 and 2017 CU3',
    body: 'CXCONSUMER is split out of CXPACKET. After this change, CXPACKET is a more meaningful signal because the benign consumer-side waiting has been moved out of it.',
  },
  {
    version: 'SQL Server 2017',
    body: 'sys.query_store_wait_stats arrives — the first source that attributes waits to a query and plan and survives a restart. Batch-mode memory grant feedback starts correcting the estimates behind RESOURCE_SEMAPHORE.',
  },
  {
    version: 'SQL Server 2019',
    body: 'OPTIMIZE_FOR_SEQUENTIAL_KEY addresses last-page insert contention directly. Memory grant feedback extends to row mode, and memory-optimized tempdb metadata removes contention on tempdb system tables.',
  },
  {
    version: 'SQL Server 2022',
    body: 'Memory grant feedback becomes persistent through Query Store, so corrections survive a restart, and degree-of-parallelism feedback starts adjusting MAXDOP per query.',
  },
  {
    version: 'Azure SQL Database',
    body: 'Use sys.dm_db_wait_stats, which is scoped to the database rather than the instance and needs VIEW DATABASE STATE. The counters reset on failover and on a service objective change, so a since-restart total is even less durable than on-premises. Managed Instance behaves like a normal instance and exposes sys.dm_os_wait_stats.',
  },
]

const faqs = [
  {
    q: 'What permissions do I need to read wait statistics?',
    a: 'VIEW SERVER STATE on the instance, or VIEW DATABASE STATE for Azure SQL Database. Everything in this guide is read-only — the DMVs report state and modifying anything is not possible through them. The one exception is the DBCC SQLPERF clear command, which is destructive and needs sysadmin.',
  },
  {
    q: 'How often should I sample?',
    a: 'It depends on the question. During a live incident, deltas of thirty to sixty seconds show you what is happening now. For a baseline, capture every fifteen to thirty minutes and keep several weeks, so that you can compare a bad Tuesday morning against a normal one rather than against an all-time average. Sampling itself is cheap — reading the DMV is a memory read, not a scan.',
  },
  {
    q: 'Does querying wait statistics affect the results?',
    a: 'Negligibly. Your own session does accumulate waits like any other, which is why the live query above excludes @@SPID, but the collection cost is not something you will see in the numbers.',
  },
  {
    q: 'Can I get wait statistics for a single database?',
    a: 'Not from sys.dm_os_wait_stats — it is instance-wide and has no database column at all. Query Store wait statistics are per database by definition, and the live DMVs carry database_id, so both of those can answer the question. The cumulative instance view cannot.',
  },
  {
    q: 'Do wait statistics work on Azure SQL Database?',
    a: 'Yes, through sys.dm_db_wait_stats, scoped to your database. The important difference is that the counters reset whenever the database fails over or changes service objective, which happens far more often than an on-premises restart. Delta capture matters more there, not less.',
  },
  {
    q: 'How do I build a baseline?',
    a: 'Snapshot the DMV into a permanent table on a schedule, keep at least two weeks, and compare like periods against each other. A baseline is not a single "good" number to measure against — it is a normal shape, and what you are looking for is a departure from it.',
  },
]

function Section({
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
    <section id={id} className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{eyebrow}</div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-gray-700">{children}</div>
    </section>
  )
}

function Code({ children }: { children: string }) {
  // overflow-x-auto is only half the fix — the containing grid/flex item needs
  // min-w-0 as well, or it grows to this block's widest line instead of letting
  // the block scroll. See the note in app/docs/page.tsx.
  return (
    <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs leading-6 text-slate-100">{children}</pre>
  )
}

export default function WaitStatisticsGuidePage() {
  return (
    <main>
      <BreadcrumbSchema
        items={[
          { name: 'Guides', path: '/guides' },
          { name: guide.title },
        ]}
      />
      <TechArticleSchema
        headline={guide.h1}
        description={guide.summary}
        path={`/guides/${guide.slug}`}
        aboutProduct={false}
      />
      <Header />

      <PageHero
        breadcrumb={
          <>
            <Link href="/guides" className="hover:text-white">
              Guides
            </Link>
            <span>/</span>
            <span className="font-semibold text-white">{guide.title}</span>
          </>
        }
        title={guide.h1}
        description="Wait statistics are SQL Server's own account of where its time went. This guide covers the DMVs that hold them, the queries to run, how to isolate a window with a delta, what each major wait type is telling you, and what to change once you know."
      />

      <section className="bg-gray-50 px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
            {/* Sticky on large screens only. Below lg it sits above the article as
                an ordinary card, which is the right behaviour on a phone — a
                sticky element there would eat a third of the viewport. */}
            <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
              <nav
                aria-label="On this page"
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  On this page
                </div>
                <ul className="space-y-1.5 text-sm">
                  {contents.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="block text-gray-600 transition-colors hover:text-primary"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-gray-100 pt-4 text-xs leading-5 text-gray-500">
                  {guide.readingTime} · Every query on this page is read-only and needs only
                  VIEW SERVER STATE.
                </p>
              </nav>
            </aside>

            <article className="min-w-0 break-words space-y-8">
              <Section id="why-waits" eyebrow="Start here" title="Why Waits Come First">
                <p>
                  The time a query takes divides cleanly into two parts: time spent doing work, and time spent waiting
                  to be allowed to do work. On a server that feels slow, the second part is almost always the larger
                  one — and unlike the first, SQL Server records it in detail and hands it to you for free.
                </p>
                <p>
                  That is what makes wait-based analysis the sensible place to start. It does not ask you to guess
                  which counter matters, or to reason backwards from CPU utilisation to a cause. It asks the engine a
                  direct question — what were you waiting for, how long, and how often — and the answer narrows a whole
                  server down to one or two things worth investigating, usually within a couple of minutes.
                </p>
                <p>
                  What it does <em>not</em> do is hand you a fix. A wait type is a direction. Everything after the
                  first query on this page is about turning that direction into something specific enough to change.
                </p>
              </Section>

              <Section id="task-states" eyebrow="Fundamentals" title="The Three Task States">
                <p>
                  Every task inside SQL Server is, at any instant, in exactly one of three states. Understanding the
                  cycle between them is what makes the columns in the DMV mean something.
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="font-semibold text-gray-900">Running</div>
                    <p className="mt-1 text-sm leading-6">
                      Executing on a CPU scheduler right now. Only one task per scheduler is in this state at a time.
                    </p>
                  </div>
                  <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="font-semibold text-gray-900">Runnable</div>
                    <p className="mt-1 text-sm leading-6">
                      Has everything it needs and is queued for a scheduler. Time spent here is{' '}
                      <strong className="font-semibold text-gray-900">signal wait</strong> — pure CPU scheduling delay.
                    </p>
                  </div>
                  <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="font-semibold text-gray-900">Suspended</div>
                    <p className="mt-1 text-sm leading-6">
                      Waiting for something it does not have — a page, a lock, a memory grant. Time spent here is{' '}
                      <strong className="font-semibold text-gray-900">resource wait</strong>.
                    </p>
                  </div>
                </div>
                <p>
                  The cycle runs suspended → runnable → running, and a task goes round it constantly. Because a single
                  wait usually passes through both waiting states, the recorded{' '}
                  <span className="font-mono">wait_time_ms</span> contains both parts, and{' '}
                  <span className="font-mono">signal_wait_time_ms</span> is the second one broken out. Subtract to get
                  the resource half. That subtraction is the single most useful thing you can do with the raw numbers:
                  it separates <em>the resource is slow</em> from <em>the CPU is busy</em> before you have looked at a
                  single wait type.
                </p>
              </Section>

              <Section id="where-data-lives" eyebrow="Sources" title="Where the Data Lives">
                <p>
                  Five DMVs matter, and they answer genuinely different questions. Most bad wait analysis comes from
                  asking the first one a question only the last three can answer.
                </p>
                <div className="space-y-3">
                  {dmvs.map((dmv) => (
                    <div key={dmv.name} className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-mono text-sm font-semibold text-gray-900">{dmv.name}</span>
                        <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-gray-500">
                          {dmv.scope}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6">{dmv.body}</p>
                    </div>
                  ))}
                </div>
              </Section>

              <Section id="the-query" eyebrow="Collection" title="The Query to Start With">
                <p>
                  This ranks wait types by share of total wait time, filters out the background waits that would
                  otherwise dominate, and — importantly — returns the average wait alongside the total, plus a running
                  percentage so you can see where the list stops mattering.
                </p>
                <Code>{topWaitsQuery}</Code>
                <p>
                  In practice the first four or five rows account for nearly all the time. When{' '}
                  <span className="font-mono">running_pct</span> passes about ninety-five, stop reading — what is below
                  that line is noise dressed up as data.
                </p>
                <p>
                  Run this second, to get the instance-wide split between scheduling delay and real resource waiting:
                </p>
                <Code>{signalQuery}</Code>
                <p>
                  A signal share above roughly a fifth to a quarter is worth treating as CPU pressure in its own right.
                  When it is that high, the specific wait types below it are largely downstream of the scheduling
                  problem, and chasing them individually will not get you anywhere.
                </p>
              </Section>

              <Section id="reading-output" eyebrow="Interpretation" title="Reading the Output">
                <p>
                  Here is a shortened result from a test instance. The ranking and the averages disagree, which is the
                  whole point of the example.
                </p>
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full min-w-[560px] border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                        <th className="px-4 py-2.5 font-semibold">Wait type</th>
                        <th className="px-4 py-2.5 text-right font-semibold">Wait (s)</th>
                        <th className="px-4 py-2.5 text-right font-semibold">Avg (ms)</th>
                        <th className="px-4 py-2.5 text-right font-semibold">%</th>
                        <th className="px-4 py-2.5 font-semibold">Reads as</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {sampleRows.map((row) => (
                        <tr key={row.type}>
                          <td className="px-4 py-2.5 font-mono text-xs text-gray-900">{row.type}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums">{row.waitS}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums">{row.avg}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums">{row.pct}</td>
                          <td className="px-4 py-2.5 text-gray-600">{row.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p>
                  <span className="font-mono">CXPACKET</span> is top of the list and is the least interesting row on
                  it: four thousand seconds accumulated in fractions of a millisecond at a time, which is what
                  parallelism looks like when it is working.{' '}
                  <span className="font-mono">PAGEIOLATCH_SH</span> is second by total but first by consequence — nearly
                  22 ms per read is storage that cannot keep up, or a workload asking it for far too much.
                </p>
                <p>
                  <span className="font-mono">LCK_M_X</span> is fourth at ten percent, and it is the row that would
                  make users complain: an average of 486 ms means individual statements are stalling for half a second
                  behind someone else&apos;s transaction. A ranking by total alone would have you working on the
                  parallelism first and the blocking last, in exactly the wrong order.
                </p>
              </Section>

              <Section id="delta" eyebrow="Collection" title="Taking a Delta">
                <p>
                  Everything above still describes the whole life of the instance. To isolate a window — an incident, a
                  batch run, the fifteen minutes before and after a change — capture the counters twice and subtract.
                </p>
                <Code>{deltaCapture}</Code>
                <p>
                  Then let the window pass. Do not use <span className="font-mono">WAITFOR DELAY</span> in the same
                  session to wait it out: that blocks the session you need, and the session&apos;s own wait shows up in
                  the results. Just come back to the same query window when the time is up.
                </p>
                <Code>{deltaCompare}</Code>
                <p>
                  For anything longer-lived than a single investigation, write the same capture into a permanent table
                  on a schedule instead of a temp table. Two weeks of fifteen-minute snapshots is small, cheap, and
                  turns every future question about &ldquo;is this normal?&rdquo; into a query rather than an argument.
                </p>
              </Section>

              <Section id="right-now" eyebrow="Live" title="What Is Waiting Right Now">
                <p>
                  Cumulative counters cannot tell you who. For that you need the live view, which returns the waiting
                  sessions, what they are waiting on, and — for lock waits — the session blocking them.
                </p>
                <Code>{liveQuery}</Code>
                <p>
                  Two columns repay attention. <span className="font-mono">blocking_session_id</span> turns an abstract{' '}
                  <span className="font-mono">LCK_M_X</span> total into a specific session you can go and look at, and
                  where several rows point at the same id you have found the head of a blocking chain.{' '}
                  <span className="font-mono">wait_resource</span> names the thing being waited on — for tempdb
                  allocation contention it reads as <span className="font-mono">2:1:1</span> or{' '}
                  <span className="font-mono">2:1:3</span>, which identifies the problem outright.
                </p>
              </Section>

              <Section id="attribution" eyebrow="Attribution" title="Attributing Waits to a Query">
                <p>
                  A server-level wait tells you the instance spent time on something. It does not tell you which query
                  did it, and that is the step where wait analysis either becomes actionable or stalls. Query Store
                  closes the gap and, unlike the live DMVs, its history survives a restart.
                </p>
                <Code>{queryStoreQuery}</Code>
                <p>
                  For a session you are watching right now,{' '}
                  <span className="font-mono">sys.dm_exec_session_wait_stats</span> gives the same shape as the
                  instance DMV scoped to one <span className="font-mono">session_id</span>. It is the cleanest way to
                  profile a single batch: read it before the batch starts, read it again when it finishes, and
                  subtract. The rows vanish when the session disconnects, so capture before you close the window.
                </p>
              </Section>

              <div id="playbooks" className="scroll-mt-24 space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Playbooks</div>
                  <h2 className="text-2xl font-bold text-gray-900">Wait-Type Playbooks</h2>
                  <p className="mt-4 text-sm leading-7 text-gray-700">
                    Nine waits that account for most of what you will actually meet. Each one lists the likely causes
                    in rough order of frequency, what confirms the hypothesis, and the fixes ordered cheapest first —
                    because the expensive fix is rarely the one that was needed.
                  </p>
                </div>

                {playbooks.map((play) => (
                  <div key={play.wait} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="font-mono text-lg font-bold text-gray-900">{play.wait}</h3>
                    <p className="mt-2 text-sm leading-7 text-gray-700">{play.summary}</p>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Likely causes
                        </div>
                        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-6 text-gray-700">
                          {play.causes.map((cause) => (
                            <li key={cause}>{cause}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Fixes, cheapest first
                        </div>
                        <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-6 text-gray-700">
                          {play.fixes.map((fix) => (
                            <li key={fix}>{fix}</li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      <span className="font-semibold text-gray-900">Confirm with: </span>
                      {play.confirm}
                    </p>
                  </div>
                ))}
              </div>

              <Section id="mistakes" eyebrow="Pitfalls" title="Six Common Mistakes">
                <div className="grid gap-3 md:grid-cols-2">
                  {mistakes.map((item, index) => (
                    <div key={item.title} className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <div className="font-semibold text-gray-900">
                        {index + 1}. {item.title}
                      </div>
                      <p className="mt-1.5 text-sm leading-6">{item.body}</p>
                    </div>
                  ))}
                </div>
              </Section>

              <Section id="versions" eyebrow="Compatibility" title="Version and Platform Differences">
                <p>
                  Wait statistics have been stable for a long time, but several changes affect how you read them and
                  which fixes are available to you.
                </p>
                <div className="space-y-3">
                  {versions.map((item) => (
                    <div key={item.version} className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <div className="font-semibold text-gray-900">{item.version}</div>
                      <p className="mt-1 text-sm leading-6">{item.body}</p>
                    </div>
                  ))}
                </div>
              </Section>

              <Section id="faq" eyebrow="Questions" title="Frequently Asked Questions">
                <div className="space-y-5">
                  {faqs.map((item) => (
                    <div key={item.q} className="min-w-0">
                      <h3 className="text-base font-semibold text-gray-900">{item.q}</h3>
                      <p className="mt-1.5 leading-7">{item.a}</p>
                    </div>
                  ))}
                </div>
              </Section>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Where to next</div>
                <h2 className="text-2xl font-bold text-gray-900">Related Reading</h2>
                <p className="mt-4 text-sm leading-7 text-gray-700">
                  Wait analysis is one step inside a larger method;{' '}
                  <Link
                    href="/guides/diagnose-sql-server-performance-problems"
                    className="font-semibold text-primary hover:text-primary-dark"
                  >
                    how to diagnose SQL Server performance problems
                  </Link>{' '}
                  covers the steps on either side of it — scoping the symptom first, and narrowing a dominant wait down
                  to a single query afterwards.
                </p>
                <p className="mt-3 text-sm leading-7 text-gray-700">
                  The{' '}
                  <Link
                    href="/docs/modules/wait-statistics"
                    className="font-semibold text-primary hover:text-primary-dark"
                  >
                    Wait Statistics module
                  </Link>{' '}
                  in SQLPerformance AI runs the collection, delta and attribution steps described here
                  read-only against a live instance, and gives each top wait a category and a short next-step hint. It is one
                  of eight modules in the{' '}
                  <Link href="/features" className="font-semibold text-primary hover:text-primary-dark">
                    read-only SQL Server performance analyzer
                  </Link>
                  .{' '}
                  <Link
                    href="/docs/modules/blocking-analysis"
                    className="font-semibold text-primary hover:text-primary-dark"
                  >
                    Blocking Analysis
                  </Link>{' '}
                  is the path to take when lock waits dominate, and{' '}
                  <Link
                    href="/docs/modules/query-statistics"
                    className="font-semibold text-primary hover:text-primary-dark"
                  >
                    Query Statistics
                  </Link>{' '}
                  covers the plan-level evidence once a wait has been traced back to a query.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/guides"
                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
                  >
                    All guides
                  </Link>
                  <Link
                    href="/download"
                    className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
                  >
                    Download
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
