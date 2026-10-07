import Link from 'next/link'
import Header from '@/components/Header'
import PageHero from '@/components/PageHero'
import Footer from '@/components/Footer'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import TechArticleSchema from '@/components/TechArticleSchema'
import { findGuide } from '../data'

const guide = findGuide('diagnose-sql-server-performance-problems')!

export const metadata = {
  title: guide.metaTitle,
  description: guide.summary,
  alternates: {
    canonical: `/guides/${guide.slug}`,
  },
}

const contents = [
  { id: 'method', label: 'A method, not a checklist' },
  { id: 'define', label: 'Define the problem first' },
  { id: 'symptom-map', label: 'Symptom to starting point' },
  { id: 'first-five', label: 'The first five minutes' },
  { id: 'evidence', label: 'Where the evidence lives' },
  { id: 'blocking', label: 'Blocking and the head blocker' },
  { id: 'cpu', label: 'CPU pressure' },
  { id: 'memory', label: 'Memory pressure' },
  { id: 'io', label: 'Storage latency' },
  { id: 'tempdb', label: 'tempdb' },
  { id: 'regression', label: 'It was fast last week' },
  { id: 'narrowing', label: 'Narrowing to one query' },
  { id: 'proving', label: 'Proving the fix' },
  { id: 'mistakes', label: 'Six diagnostic mistakes' },
  { id: 'faq', label: 'Frequently asked questions' },
]

/**
 * The symptom is the only thing you reliably have at the start of a diagnosis,
 * and it is far more discriminating than people expect — "slow since Tuesday"
 * and "slow every morning at nine" lead to different DMVs on the first query.
 */
const symptomMap = [
  {
    symptom: 'Everything is slow, right now',
    start: 'Live triage, then the blocking chain',
    why: 'A server-wide slowdown is usually one of three things: a blocking chain, a resource the whole instance shares, or a workload spike. All three are visible within a minute of live evidence.',
  },
  {
    symptom: 'One query is slow, and always has been',
    start: 'Execution plan and query statistics',
    why: 'Nothing about the instance changed, so instance-level counters have nothing to tell you. This is a plan, an index or a predicate problem.',
  },
  {
    symptom: 'One query was fast last week',
    start: 'Query Store regression comparison',
    why: 'A query that changed speed without changing text changed plan, data volume, or parameters. Query Store is the only source that keeps the before.',
  },
  {
    symptom: 'Slow every morning, fine by ten',
    start: 'A delta over the bad window, compared with a good one',
    why: 'A cumulative total spanning weeks cannot see a ninety-minute pattern. Two comparable windows can.',
  },
  {
    symptom: 'Slow since the release',
    start: 'Plan changes and new statements in Query Store',
    why: 'The change is known and dated. Look for statements that are new, and for plans that changed on the deployment date.',
  },
  {
    symptom: 'Timeouts, but CPU is near idle',
    start: 'Blocking chain, then worker threads',
    why: 'Idle CPU with queuing work means the work is waiting on something other than CPU — a lock, a latch, a memory grant, or a free worker.',
  },
  {
    symptom: 'Slow only from one application',
    start: 'Session settings and result consumption',
    why: 'Same query, different speed by client, is almost always different SET options producing a different plan, or an application reading the result set slowly.',
  },
  {
    symptom: 'Slow right after a restart or failover',
    start: 'Nothing, for the first fifteen minutes',
    why: 'Cold buffer pool and empty plan cache. Some of this is expected and will resolve itself. Measure once it has.',
  },
]

const sources = [
  {
    name: 'Live DMVs',
    examples: 'sys.dm_exec_requests, sys.dm_os_waiting_tasks, sys.dm_exec_sessions',
    answers: 'What is happening at this instant, with session ids you can act on.',
    limits: 'Gone the moment it stops. Useless for anything that finished before you connected.',
  },
  {
    name: 'Cumulative DMVs',
    examples: 'sys.dm_os_wait_stats, sys.dm_io_virtual_file_stats, sys.dm_exec_query_stats',
    answers: 'Totals since the last restart, or since the plan left the cache.',
    limits: 'No time dimension. Take two snapshots and subtract, or you are reading an average of every hour the server has been up.',
  },
  {
    name: 'Query Store',
    examples: 'sys.query_store_runtime_stats, sys.query_store_plan, sys.query_store_wait_stats',
    answers: 'Per-query history that survives restarts, evictions and recompiles — including the plan a query used last week.',
    limits: 'Only for databases where it is enabled, and only back to its retention limit. Off by default before SQL Server 2022.',
  },
  {
    name: 'Plan cache',
    examples: 'sys.dm_exec_query_stats with sys.dm_exec_query_plan',
    answers: 'Aggregate cost and the current plan for anything still cached.',
    limits: 'Memory pressure, recompiles and restarts evict entries silently, so absence proves nothing.',
  },
  {
    name: 'Extended Events',
    examples: 'the system_health session, or a targeted session you create',
    answers: 'Individual events with full context — deadlock graphs, timeouts, long-running statements.',
    limits: 'You have to be capturing before the problem happens. system_health is always running and already holds the last deadlocks.',
  },
  {
    name: 'Error log and Windows event log',
    examples: 'sp_readerrorlog, the system event log',
    answers: 'Failovers, memory dumps, long I/O warnings, autogrowth events, and exactly when the service last started.',
    limits: 'Easy to forget, and it is often the fastest way to learn that the instance restarted three hours ago.',
  },
]

const triageQuery = `/* First query of any live incident: everything a user is running, worst first.
   Read blocking_session_id before anything else — a long list of slow requests
   that all point at one session is a blocking problem, not a slow-server one. */
SELECT
    r.session_id,
    r.blocking_session_id,
    r.status,
    r.wait_type,
    r.wait_time                                  AS current_wait_ms,
    r.wait_resource,
    r.cpu_time                                   AS cpu_ms,
    r.total_elapsed_time                         AS elapsed_ms,
    r.logical_reads,
    r.granted_query_memory * 8                   AS granted_memory_kb,
    r.open_transaction_count,
    DB_NAME(r.database_id)                       AS [database],
    s.login_name,
    s.host_name,
    s.program_name,
    SUBSTRING(t.text, (r.statement_start_offset / 2) + 1,
        ((CASE r.statement_end_offset
              WHEN -1 THEN DATALENGTH(t.text)
              ELSE r.statement_end_offset
          END - r.statement_start_offset) / 2) + 1) AS running_statement
FROM sys.dm_exec_requests AS r
JOIN sys.dm_exec_sessions AS s
    ON s.session_id = r.session_id
CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) AS t
WHERE r.session_id <> @@SPID
  AND s.is_user_process = 1
ORDER BY r.total_elapsed_time DESC;`

const blockingQuery = `/* Every blocked session, walked back to the one at the head of its chain.
   The head is not itself blocked, which is exactly what makes it the head —
   and it is the only session in the list worth doing anything about. */
WITH blocked AS (
    SELECT r.session_id, r.blocking_session_id, r.wait_type, r.wait_time, r.wait_resource
    FROM sys.dm_exec_requests AS r
    WHERE r.blocking_session_id <> 0
),
chain AS (
    SELECT b.session_id, b.blocking_session_id, b.wait_type, b.wait_time, b.wait_resource,
           1 AS depth, b.blocking_session_id AS head_session_id
    FROM blocked AS b
    WHERE NOT EXISTS (SELECT 1 FROM blocked AS p WHERE p.session_id = b.blocking_session_id)
    UNION ALL
    SELECT b.session_id, b.blocking_session_id, b.wait_type, b.wait_time, b.wait_resource,
           c.depth + 1, c.head_session_id
    FROM blocked AS b
    JOIN chain AS c ON b.blocking_session_id = c.session_id
)
SELECT
    c.head_session_id,
    c.depth,
    c.session_id            AS blocked_session_id,
    c.wait_type,
    c.wait_time             AS blocked_for_ms,
    c.wait_resource,
    h.status                AS head_status,
    h.last_request_start_time,
    h.last_request_end_time,
    h.host_name             AS head_host,
    h.program_name          AS head_program,
    ht.text                 AS head_last_statement
FROM chain AS c
JOIN sys.dm_exec_sessions AS h
    ON h.session_id = c.head_session_id
OUTER APPLY (
    SELECT t.text
    FROM sys.dm_exec_connections AS cn
    CROSS APPLY sys.dm_exec_sql_text(cn.most_recent_sql_handle) AS t
    WHERE cn.session_id = c.head_session_id
) AS ht
ORDER BY c.head_session_id, c.depth;`

const cpuHistoryQuery = `/* SQL Server's CPU against everything else on the machine, one row per minute
   for roughly the last four hours. Run this before tuning anything: if the other
   process column is the large one, the query you were about to rewrite is a
   victim rather than a cause. */
DECLARE @ts_now BIGINT = (SELECT cpu_ticks / (cpu_ticks / ms_ticks) FROM sys.dm_os_sys_info);

SELECT TOP (240)
    DATEADD(ms, -1 * (@ts_now - [timestamp]), GETDATE()) AS event_time,
    record.value('(./Record/SchedulerMonitorEvent/SystemHealth/ProcessUtilization)[1]', 'int')
        AS sql_server_cpu_pct,
    record.value('(./Record/SchedulerMonitorEvent/SystemHealth/SystemIdle)[1]', 'int')
        AS idle_pct,
    100
      - record.value('(./Record/SchedulerMonitorEvent/SystemHealth/SystemIdle)[1]', 'int')
      - record.value('(./Record/SchedulerMonitorEvent/SystemHealth/ProcessUtilization)[1]', 'int')
        AS other_process_cpu_pct
FROM (
    SELECT [timestamp], CONVERT(xml, record) AS record
    FROM sys.dm_os_ring_buffers
    WHERE ring_buffer_type = 'RING_BUFFER_SCHEDULER_MONITOR'
      AND record LIKE '%<SystemHealth>%'
) AS rb
ORDER BY event_time DESC;`

const topCpuQuery = `/* The heaviest CPU consumers still in the plan cache.
   Read the two averages together with execution_count: 400 ms of CPU per call is
   one problem, 0.4 ms across a million calls is a completely different one, and
   they have opposite fixes. */
SELECT TOP (20)
    qs.execution_count,
    qs.total_worker_time / 1000                           AS total_cpu_ms,
    qs.total_worker_time / qs.execution_count / 1000.0    AS avg_cpu_ms,
    qs.total_elapsed_time / qs.execution_count / 1000.0   AS avg_elapsed_ms,
    qs.total_logical_reads / qs.execution_count           AS avg_logical_reads,
    qs.creation_time,
    qs.last_execution_time,
    DB_NAME(t.dbid)                                       AS [database],
    SUBSTRING(t.text, (qs.statement_start_offset / 2) + 1,
        ((CASE qs.statement_end_offset
              WHEN -1 THEN DATALENGTH(t.text)
              ELSE qs.statement_end_offset
          END - qs.statement_start_offset) / 2) + 1)      AS statement_text
FROM sys.dm_exec_query_stats AS qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) AS t
ORDER BY qs.total_worker_time DESC;`

const memoryQuery = `/* 1. Page life expectancy per NUMA node. The instance-wide figure averages the
      nodes together and can hide one node that is thrashing. */
SELECT
    instance_name AS numa_node,
    cntr_value    AS page_life_expectancy_sec
FROM sys.dm_os_performance_counters
WHERE counter_name = 'Page life expectancy'
  AND object_name LIKE '%Buffer Node%';

/* 2. Where the memory went. On a healthy instance the buffer pool clerk is at
      the top by a wide margin; anything else in first place needs explaining. */
SELECT TOP (10)
    type                 AS memory_clerk,
    SUM(pages_kb) / 1024 AS mb
FROM sys.dm_os_memory_clerks
GROUP BY type
ORDER BY mb DESC;

/* 3. Memory grants right now, including any queued behind RESOURCE_SEMAPHORE.
      Compare requested against used: a query that asked for 4 GB and used 40 MB
      is holding the queue up on the strength of a bad estimate. */
SELECT
    session_id,
    requested_memory_kb,
    granted_memory_kb,
    required_memory_kb,
    used_memory_kb,
    max_used_memory_kb,
    queue_id,
    wait_time_ms,
    dop
FROM sys.dm_exec_query_memory_grants
ORDER BY requested_memory_kb DESC;`

const ioQuery = `/* Average read and write latency per database file, accumulated since the last
   restart. As a rough guide, data files above 20 ms or a log file above 5 ms is
   worth explaining. Storage is often blamed for latency that is really a query
   reading far more pages than it needs to — check the volume column too. */
SELECT
    DB_NAME(vfs.database_id)                                AS [database],
    mf.name                                                 AS logical_name,
    mf.type_desc                                            AS file_type,
    vfs.num_of_reads,
    vfs.io_stall_read_ms  / NULLIF(vfs.num_of_reads, 0)     AS avg_read_latency_ms,
    vfs.num_of_writes,
    vfs.io_stall_write_ms / NULLIF(vfs.num_of_writes, 0)    AS avg_write_latency_ms,
    (vfs.num_of_bytes_read + vfs.num_of_bytes_written) / 1048576 AS total_mb,
    mf.physical_name
FROM sys.dm_io_virtual_file_stats(NULL, NULL) AS vfs
JOIN sys.master_files AS mf
    ON mf.database_id = vfs.database_id
   AND mf.file_id     = vfs.file_id
WHERE vfs.num_of_reads + vfs.num_of_writes > 0
ORDER BY avg_read_latency_ms DESC;`

const tempdbQuery = `/* Who is consuming tempdb right now. The two columns answer different questions:
   user objects are temp tables and table variables the code created on purpose,
   internal objects are sorts, hashes and spools the engine could not keep in
   memory — a large internal figure is a memory-grant or estimate problem
   wearing a tempdb costume. */
SELECT
    su.session_id,
    (su.user_objects_alloc_page_count - su.user_objects_dealloc_page_count) * 8 / 1024
        AS user_objects_mb,
    (su.internal_objects_alloc_page_count - su.internal_objects_dealloc_page_count) * 8 / 1024
        AS internal_objects_mb,
    r.command,
    r.wait_type,
    s.host_name,
    s.program_name,
    t.text AS running_batch
FROM sys.dm_db_session_space_usage AS su
JOIN sys.dm_exec_sessions AS s
    ON s.session_id = su.session_id
LEFT JOIN sys.dm_exec_requests AS r
    ON r.session_id = su.session_id
OUTER APPLY sys.dm_exec_sql_text(r.sql_handle) AS t
WHERE su.session_id > 50
  AND su.user_objects_alloc_page_count + su.internal_objects_alloc_page_count > 0
ORDER BY internal_objects_mb DESC;

/* And what is holding tempdb overall. A large version store means an open
   transaction somewhere is preventing row versions from being cleaned up. */
SELECT
    SUM(unallocated_extent_page_count)       * 8 / 1024 AS free_mb,
    SUM(user_object_reserved_page_count)     * 8 / 1024 AS user_objects_mb,
    SUM(internal_object_reserved_page_count) * 8 / 1024 AS internal_objects_mb,
    SUM(version_store_reserved_page_count)   * 8 / 1024 AS version_store_mb
FROM tempdb.sys.dm_db_file_space_usage;`

const regressionQuery = `/* Queries that got slower in the last 24 hours compared with the seven days
   before. Run this in the user database, with Query Store enabled.
   The sort is by total time added, not by the ratio — a query that doubled from
   4 ms but runs two million times a day matters more than one that went from
   200 ms to 3 seconds and runs twice. */
WITH raw_stats AS (
    SELECT
        p.query_id,
        p.plan_id,
        rs.avg_duration,
        rs.count_executions,
        CASE WHEN i.start_time >= DATEADD(day, -1, SYSUTCDATETIME())
             THEN 'recent' ELSE 'baseline' END AS window_name
    FROM sys.query_store_runtime_stats AS rs
    JOIN sys.query_store_runtime_stats_interval AS i
        ON i.runtime_stats_interval_id = rs.runtime_stats_interval_id
    JOIN sys.query_store_plan AS p
        ON p.plan_id = rs.plan_id
    WHERE i.start_time >= DATEADD(day, -8, SYSUTCDATETIME())
),
agg AS (
    SELECT
        query_id,
        window_name,
        SUM(avg_duration * count_executions) / NULLIF(SUM(count_executions), 0) / 1000.0 AS avg_ms,
        SUM(count_executions)  AS executions,
        COUNT(DISTINCT plan_id) AS plan_count
    FROM raw_stats
    GROUP BY query_id, window_name
)
SELECT TOP (20)
    r.query_id,
    b.avg_ms                            AS baseline_avg_ms,
    r.avg_ms                            AS recent_avg_ms,
    r.avg_ms / NULLIF(b.avg_ms, 0)      AS times_slower,
    b.executions                        AS baseline_executions,
    r.executions                        AS recent_executions,
    r.plan_count                        AS plans_in_recent_window,
    CAST((r.avg_ms - b.avg_ms) * r.executions / 1000.0 AS decimal(18,1)) AS extra_seconds_per_day,
    qt.query_sql_text
FROM agg AS r
JOIN agg AS b
    ON b.query_id = r.query_id
   AND b.window_name = 'baseline'
JOIN sys.query_store_query AS q
    ON q.query_id = r.query_id
JOIN sys.query_store_query_text AS qt
    ON qt.query_text_id = q.query_text_id
WHERE r.window_name = 'recent'
  AND r.executions >= 10
  AND r.avg_ms > b.avg_ms * 1.5
ORDER BY extra_seconds_per_day DESC;`

const narrowingQuery = `/* Rank by total elapsed time, not by average. This is the list of queries that
   consume the most of the server's day, which is the list worth spending your
   own day on. Add the plan handle when you want to pull the plan itself. */
SELECT TOP (20)
    qs.execution_count,
    qs.total_elapsed_time / 1000                          AS total_elapsed_ms,
    qs.total_elapsed_time / qs.execution_count / 1000.0   AS avg_elapsed_ms,
    qs.total_worker_time  / qs.execution_count / 1000.0   AS avg_cpu_ms,
    (qs.total_elapsed_time - qs.total_worker_time)
        / qs.execution_count / 1000.0                     AS avg_waiting_ms,
    qs.total_logical_reads / qs.execution_count           AS avg_logical_reads,
    qs.total_rows / qs.execution_count                    AS avg_rows,
    DB_NAME(t.dbid)                                       AS [database],
    SUBSTRING(t.text, (qs.statement_start_offset / 2) + 1,
        ((CASE qs.statement_end_offset
              WHEN -1 THEN DATALENGTH(t.text)
              ELSE qs.statement_end_offset
          END - qs.statement_start_offset) / 2) + 1)      AS statement_text,
    qs.plan_handle
FROM sys.dm_exec_query_stats AS qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) AS t
WHERE qs.execution_count > 1
ORDER BY qs.total_elapsed_time DESC;`

const provingQuery = `/* Measure the statement the way the application actually sends it — same
   parameters, same data volume, same SET options. Running it as ad-hoc text in a
   query window can produce a different plan from the one the application gets. */
SET STATISTICS IO, TIME ON;
GO
EXEC dbo.usp_TheStatement @CustomerId = 4127, @FromDate = '2026-01-01';
GO
SET STATISTICS IO, TIME OFF;

/* Then take the numbers that matter and write them down before changing
   anything: logical reads, CPU time, elapsed time, and the row count.
   Logical reads is the most stable of the four — it barely moves with server
   load, which makes it the honest measure of whether a change did anything. */`

const mistakes = [
  {
    title: 'Starting from a counter instead of the complaint',
    body: 'A dashboard full of amber gauges will always give you something to fix. It will not tell you whether that something is what the user noticed. Start from the report — which operation, for whom, since when — and let it choose the counter.',
  },
  {
    title: 'Restarting the instance to "clear something up"',
    body: 'A restart destroys the plan cache, every cumulative DMV, and the entire evidence trail, then hides the problem behind fifteen minutes of cold-cache slowness. If it comes back afterwards you have lost the only record of what it looked like the first time.',
  },
  {
    title: 'Treating a wait type as a diagnosis',
    body: 'PAGEIOLATCH_SH is not "slow storage". It is a query waiting for a data page, which may be a missing index reading ten million pages to return four rows. The wait names the queue, not the cause.',
  },
  {
    title: 'Using threshold numbers from a decade ago',
    body: 'Page life expectancy above 300 came from servers with 4 GB of RAM. On a machine with 512 GB it means nothing at all. Compare against this instance’s own normal, not against a number from an old blog post.',
  },
  {
    title: 'Reproducing on data that is not the production data',
    body: 'A plan is chosen from statistics, and statistics come from the data. Ten thousand rows in test and forty million in production is not the same query in any sense that matters, and the plan you tuned is not the plan that runs.',
  },
  {
    title: 'Changing several things at once',
    body: 'An index, a MAXDOP setting and a rewritten predicate deployed together produce one result you cannot attribute, and two changes you now cannot justify keeping. Change one, re-measure the same way, then move on.',
  },
]

const faqs = [
  {
    q: 'Where do I start when users only say "the database is slow"?',
    a: 'Turn it into three facts before you connect: which operation, for how many people, and since when. Those three answers pick your first query — a single slow screen for one user is a query problem, everything slow since nine this morning is an instance problem, and everything slow since the weekend release is a plan problem. The live triage query below is the right first step for the second case only.',
  },
  {
    q: 'How do I tell whether the problem is SQL Server or the machine underneath it?',
    a: 'The scheduler-monitor ring buffer gives you SQL Server CPU against other-process CPU on the same box, which settles the CPU half immediately. For storage, compare the latency in sys.dm_io_virtual_file_stats against what the storage team believes it is delivering; a large gap is a conversation about the platform, not about indexes. On a VM, also check whether the host is overcommitted — SQL Server cannot see that, and it shows up as unexplained scheduler delay.',
  },
  {
    q: 'Is it safe to run these diagnostics against a production instance?',
    a: 'Every query on this page is read-only and reads from memory rather than user tables, so the collection cost is not something you will see. Two cautions: SET STATISTICS IO, TIME adds measurable overhead and belongs in your own session rather than in a monitoring loop, and anything that clears a cache or a counter is not a diagnostic at all — it destroys evidence other people are using.',
  },
  {
    q: 'The instance restarted. What can I still use?',
    a: 'Every cumulative DMV has been reset to zero, and the plan cache is empty, so the usual "top queries since restart" lists describe only the last few minutes. Query Store survives a restart and is the main thing that will still answer questions about last week. The error log will tell you exactly when the service started, which is worth checking before you trust any total.',
  },
  {
    q: 'How long should I collect before concluding anything?',
    a: 'Long enough to contain the problem and nothing else. For a live incident, a delta of thirty to sixty seconds is enough and is far more precise than an hour. For a recurring pattern, capture the bad window and an equivalent good window on a comparable day, and compare the two. Conclusions drawn from a window that spans both are the most common way a diagnosis goes wrong.',
  },
  {
    q: 'Do I need Query Store enabled, and what does it cost?',
    a: 'You need it for anything historical about a specific query, which includes most of the interesting questions. It is on by default for new databases from SQL Server 2022 and on Azure SQL Database, and off by default before that. Overhead is small but not zero; the settings that matter are the capture mode, so that ad-hoc noise is not retained, and the retention and size limits, so that it never silently flips to read-only.',
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

export default function DiagnosePerformanceGuidePage() {
  return (
    <main>
      <BreadcrumbSchema items={[{ name: 'Guides', path: '/guides' }, { name: guide.title }]} />
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
        description="Most SQL Server performance problems are not hard to find once you stop guessing and start narrowing. This guide is the order to do it in — define the symptom, triage what is live, follow the evidence into CPU, memory, storage, locking or a plan change, and prove the fix before you keep it."
      />

      <section className="bg-gray-50 px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
            {/* Sticky on large screens only. Below lg it sits above the article as
                an ordinary card, which is the right behaviour on a phone — a
                sticky element there would eat a third of the viewport. */}
            <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
              <nav aria-label="On this page" className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">On this page</div>
                <ul className="space-y-1.5 text-sm">
                  {contents.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="block text-gray-600 transition-colors hover:text-primary">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-gray-100 pt-4 text-xs leading-5 text-gray-500">
                  {guide.readingTime} · Every diagnostic query here is read-only and needs only VIEW SERVER STATE.
                </p>
              </nav>
            </aside>

            <article className="min-w-0 break-words space-y-8">
              <Section id="method" eyebrow="Start here" title="A Method, Not a Checklist">
                <p>
                  Diagnosing a SQL Server performance problem is not a matter of knowing more counters than the next
                  person. Almost every bad diagnosis comes from the same two habits: starting from whatever metric
                  happened to be on screen, and changing something before the evidence was in.
                </p>
                <p>
                  The method here is deliberately narrow. Each step either eliminates a whole class of cause or hands
                  you the next question, and you stop the moment the evidence points somewhere specific enough to
                  change. It looks like this:
                </p>
                <ol className="list-decimal space-y-2 pl-5">
                  <li>
                    <strong className="font-semibold text-gray-900">Define the problem</strong> — which operation, for
                    whom, since when. Three facts, before you connect to anything.
                  </li>
                  <li>
                    <strong className="font-semibold text-gray-900">Scope it</strong> — is this the whole instance, one
                    database, or one query? The three lead to different first queries and share almost no evidence.
                  </li>
                  <li>
                    <strong className="font-semibold text-gray-900">Look at what is live</strong> — five minutes of
                    requests, blocking and waits will resolve a surprising share of incidents on their own.
                  </li>
                  <li>
                    <strong className="font-semibold text-gray-900">Follow the evidence</strong> into exactly one of
                    CPU, memory, storage, locking, tempdb or a plan change. Not all six in parallel.
                  </li>
                  <li>
                    <strong className="font-semibold text-gray-900">Narrow to a query</strong>, because that is the
                    level at which almost every fix is actually applied.
                  </li>
                  <li>
                    <strong className="font-semibold text-gray-900">Prove it</strong> — one change, re-measured the
                    same way, over a comparable window.
                  </li>
                </ol>
                <p>
                  Steps three and four rest on wait statistics, which are SQL Server&rsquo;s own account of what its
                  time was spent waiting for. This guide uses them as a signpost and keeps moving; if you want the
                  subject properly — every DMV, the delta technique, and a playbook per wait type — that is the{' '}
                  <Link
                    href="/guides/sql-server-wait-statistics"
                    className="font-semibold text-primary hover:text-primary-dark"
                  >
                    complete guide to SQL Server wait statistics
                  </Link>
                  .
                </p>
              </Section>

              <Section id="define" eyebrow="Step one" title="Define the Problem First">
                <p>
                  &ldquo;The database is slow&rdquo; is not a problem statement. It cannot be measured, so it cannot be
                  confirmed fixed, and it fits every possible cause equally well. Three questions turn it into
                  something a query can answer.
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="font-semibold text-gray-900">What, exactly?</div>
                    <p className="mt-1 text-sm leading-6">
                      A named screen, report or job. &ldquo;The order search takes forty seconds&rdquo; identifies a
                      statement. &ldquo;Everything&rdquo; identifies nothing.
                    </p>
                  </div>
                  <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="font-semibold text-gray-900">For whom?</div>
                    <p className="mt-1 text-sm leading-6">
                      One user, one office, one application, or everyone. This single answer separates a plan or
                      parameter problem from an instance-wide one.
                    </p>
                  </div>
                  <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="font-semibold text-gray-900">Since when?</div>
                    <p className="mt-1 text-sm leading-6">
                      A date is a suspect list. Since Tuesday points at what changed on Tuesday; every morning at nine
                      points at concurrency or a job.
                    </p>
                  </div>
                </div>
                <p>
                  It is worth pushing for a number as well, even a rough one. &ldquo;It used to take two seconds and
                  now takes thirty&rdquo; gives you a target and, just as importantly, a way to know when to stop. A
                  diagnosis with no target ends when someone gets tired rather than when the problem is solved.
                </p>
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide">Check this before anything</div>
                  Find out when the instance last started, and whether anything was deployed, patched, failed over or
                  restored recently. Both facts change how you read every cumulative number that follows, and both take
                  under a minute to establish.
                </div>
              </Section>

              <Section id="symptom-map" eyebrow="Step two" title="Symptom to Starting Point">
                <p>
                  The symptom is more discriminating than it looks. These eight cover most of what gets reported, and
                  each one has a different sensible first move.
                </p>
                <div className="space-y-3">
                  {symptomMap.map((row) => (
                    <div key={row.symptom} className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-semibold text-gray-900">{row.symptom}</span>
                        <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-primary">
                          {row.start}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6">{row.why}</p>
                    </div>
                  ))}
                </div>
              </Section>

              <Section id="first-five" eyebrow="Step three" title="The First Five Minutes">
                <p>
                  When the problem is happening right now, live evidence beats every historical source, because it
                  comes with session ids you can actually act on. Start with everything a user is running.
                </p>
                <Code>{triageQuery}</Code>
                <p>Read the output in this order, and stop as soon as one of them answers the question.</p>
                <ol className="list-decimal space-y-2 pl-5">
                  <li>
                    <strong className="font-semibold text-gray-900">
                      Does anything have a non-zero blocking_session_id?
                    </strong>{' '}
                    If a dozen requests all point at one session, you have a blocking problem and the other columns are
                    describing its victims. Go straight to the next section.
                  </li>
                  <li>
                    <strong className="font-semibold text-gray-900">What is the dominant wait_type?</strong> One wait
                    type across most of the list is a strong signal. A spread of unrelated types usually means the
                    instance is simply saturated.
                  </li>
                  <li>
                    <strong className="font-semibold text-gray-900">Is cpu_ms close to elapsed_ms?</strong> When they
                    are close, the work is running and the query itself is expensive. When elapsed is far larger, the
                    time is being spent waiting and the wait type is where to look.
                  </li>
                  <li>
                    <strong className="font-semibold text-gray-900">How many rows are there at all?</strong> Thirty
                    concurrent requests where there are normally three is a workload problem. Three requests that are
                    all slow is a query problem.
                  </li>
                  <li>
                    <strong className="font-semibold text-gray-900">Is one program_name responsible?</strong> If every
                    slow request comes from the same application or host, the investigation just narrowed considerably.
                  </li>
                </ol>
                <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide">Run it twice</div>
                  Run the query again thirty seconds later. Requests that are still there with a higher elapsed time
                  are genuinely stuck; a completely different set of rows means the workload is churning normally and
                  what you are seeing is volume, not a stall.
                </div>
              </Section>

              <Section id="evidence" eyebrow="Reference" title="Where the Evidence Lives">
                <p>
                  Six sources, each answering a genuinely different question. Most wasted diagnostic time comes from
                  asking one of them something only another can answer — typically asking a cumulative DMV about the
                  last twenty minutes.
                </p>
                <div className="space-y-3">
                  {sources.map((source) => (
                    <div key={source.name} className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <div className="font-semibold text-gray-900">{source.name}</div>
                      <div className="mt-1 font-mono text-xs text-gray-500">{source.examples}</div>
                      <p className="mt-2 text-sm leading-6">{source.answers}</p>
                      <p className="mt-1.5 text-sm leading-6 text-gray-600">
                        <span className="font-semibold text-gray-900">Limits: </span>
                        {source.limits}
                      </p>
                    </div>
                  ))}
                </div>
                <p>
                  On Azure SQL Database the live DMVs behave the same way, but the instance-scoped cumulative ones are
                  replaced by database-scoped equivalents, and every counter resets on failover or a service objective
                  change — which happens far more often than an on-premises restart. Query Store is on by default
                  there, which makes it the most reliable of the six rather than the most optional.
                </p>
              </Section>

              <Section id="blocking" eyebrow="Branch one" title="Blocking and the Head Blocker">
                <p>
                  Blocking is worth checking first because it produces the most dramatic symptoms for the least
                  interesting reason, and because it is the one cause where fixing a single session fixes everyone at
                  once. A blocking chain makes an entire instance look broken while its CPU sits at four percent.
                </p>
                <Code>{blockingQuery}</Code>
                <p>
                  The session at the head of the chain is not itself waiting on a lock — that is precisely what makes
                  it the head, and it is the only session in the output worth acting on. What you usually find is
                  something dull: an open transaction in an application that opened it and then went to do something
                  else, a session sitting in <span className="font-mono">sleeping</span> status with{' '}
                  <span className="font-mono">open_transaction_count</span> above zero, or a large batch update running
                  in one transaction during business hours.
                </p>
                <p>
                  Killing the head clears the symptom and tells you nothing about the cause. Before you do, record its
                  last statement, its host and its program name, because after the kill that evidence is gone and the
                  same thing will happen again next week. Lock waits that keep returning are almost always a
                  transaction held open across an application round trip, a missing index forcing a scan to take far
                  more locks than the statement needs, or an isolation level nobody chose deliberately.
                </p>
                <p>
                  For deadlocks specifically, the evidence already exists: the always-on{' '}
                  <span className="font-mono">system_health</span> Extended Events session retains recent deadlock
                  graphs, so you can read one after the fact without having set anything up in advance. In the product,{' '}
                  <Link
                    href="/docs/modules/blocking-analysis"
                    className="font-semibold text-primary hover:text-primary-dark"
                  >
                    Blocking Analysis
                  </Link>{' '}
                  runs this chain resolution against a live instance and presents the head blocker directly.
                </p>
              </Section>

              <Section id="cpu" eyebrow="Branch two" title="CPU Pressure">
                <p>
                  Before tuning a single query for CPU, establish that SQL Server is the process using it. This is a
                  two-minute check that regularly redirects an entire investigation — anti-virus scanning data files, a
                  backup agent, or another instance on the same box.
                </p>
                <Code>{cpuHistoryQuery}</Code>
                <p>
                  If SQL Server&rsquo;s share is genuinely high, the question becomes which queries are spending it.
                  Rank by total CPU, then read the averages next to the execution count.
                </p>
                <Code>{topCpuQuery}</Code>
                <p>
                  That distinction decides the fix. A high average with few executions is a single expensive
                  statement — look at the plan for scans, spills, or a bad estimate driving a nested loop. A low
                  average with an enormous execution count is a workload shape problem, and the fix is upstream:
                  caching, batching, or a chattier application than anyone realised. Rewriting the query in the second
                  case saves a fraction of a millisecond a million times, which is real, but the call count is usually
                  the larger lever.
                </p>
                <p>
                  Two CPU-shaped signals are worth naming because they are so often misread. Sustained{' '}
                  <span className="font-mono">SOS_SCHEDULER_YIELD</span> with tiny average waits means tasks are
                  yielding constantly after using their full quantum — genuine CPU saturation, not a scheduler bug. And
                  a high signal-wait ratio across the instance means tasks are ready to run and queuing for a CPU,
                  which points at the same place. Both are covered in detail in the{' '}
                  <Link
                    href="/guides/sql-server-wait-statistics"
                    className="font-semibold text-primary hover:text-primary-dark"
                  >
                    wait statistics guide
                  </Link>
                  .
                </p>
              </Section>

              <Section id="memory" eyebrow="Branch three" title="Memory Pressure">
                <p>
                  Memory problems rarely announce themselves as memory problems. They arrive disguised as storage
                  latency, because a buffer pool under pressure evicts pages that then have to be read again from
                  disk. Three queries separate the two.
                </p>
                <Code>{memoryQuery}</Code>
                <p>
                  Page life expectancy is the number most often misused in SQL Server diagnostics. The famous threshold
                  of 300 seconds comes from an era of 4 GB servers; on a machine with half a terabyte of RAM it is
                  meaningless as an absolute. What matters is the shape over time. A PLE that climbs steadily and drops
                  off a cliff every morning is telling you that something reads the entire buffer pool out from under
                  the workload at that hour, and that something is usually a job.
                </p>
                <p>
                  The memory grants query is the one that finds the problem people do not expect. A query whose
                  estimate is far too high reserves memory it never uses, and while it holds that grant other queries
                  queue behind it on <span className="font-mono">RESOURCE_SEMAPHORE</span> — a server that appears to
                  be out of memory while most of the memory it granted sits idle. Compare{' '}
                  <span className="font-mono">requested_memory_kb</span> against{' '}
                  <span className="font-mono">used_memory_kb</span>: a large gap is a cardinality estimate problem, and
                  the fix is usually a statistics update or a rewrite rather than more RAM.
                </p>
                <p>
                  If the buffer pool clerk is not comfortably at the top of the clerk list, find out what is. A plan
                  cache that has grown large from unparameterised ad-hoc queries is a common and fixable answer.
                </p>
              </Section>

              <Section id="io" eyebrow="Branch four" title="Storage Latency">
                <p>
                  Storage is blamed for a great deal of latency it did not cause. The measurement is easy; the
                  interpretation is where diagnoses go wrong.
                </p>
                <Code>{ioQuery}</Code>
                <p>
                  As a rough guide, data files consistently above about 20 ms per read, or a log file above about 5 ms
                  per write, are worth explaining. But note the two caveats built into this data. It accumulates from
                  the last restart, so a bad hour last month is still in the average — if you need to know about now,
                  capture the DMV twice and subtract, exactly as you would with wait statistics. And latency is a
                  function of what you ask for: a missing index that turns a four-row lookup into a ten-million-page
                  scan produces storage latency that is entirely the query&rsquo;s fault.
                </p>
                <p>
                  So read the volume column alongside the latency. Low latency with an enormous read volume is a query
                  problem the storage is coping with admirably. High latency with modest volume is a platform
                  conversation. High on both means you have two problems, and the query is still the cheaper one to
                  fix — an index that removes ninety percent of the reads improves the situation immediately, while
                  the storage change is scheduled for a quarter from now.
                </p>
                <p>
                  Log file latency deserves separate attention because it is synchronous: every commit waits for it.
                  Sustained <span className="font-mono">WRITELOG</span> waits with a slow log file affect every write
                  in the system at once, and are frequently caused by the log sharing a volume with something else, or
                  by thousands of tiny autocommit transactions where a batch was intended.
                </p>
              </Section>

              <Section id="tempdb" eyebrow="Branch five" title="tempdb">
                <p>
                  tempdb is shared by every database on the instance, which is why a single badly estimated query can
                  make everything else slow simultaneously. Two figures separate the causes.
                </p>
                <Code>{tempdbQuery}</Code>
                <p>
                  A large <span className="font-mono">user_objects</span> figure means code is creating temporary
                  tables and table variables deliberately — that is a design conversation. A large{' '}
                  <span className="font-mono">internal_objects</span> figure means the engine is spilling sorts and
                  hash joins to disk because the memory grant was too small, which loops straight back to the
                  cardinality estimate problem in the memory section. It is a query problem wearing a tempdb costume,
                  and adding tempdb files will not touch it.
                </p>
                <p>
                  A large version store, by contrast, means an open transaction somewhere is preventing row versions
                  from being cleaned up. Read committed snapshot isolation and long-running reporting transactions are
                  the usual pair. The fix is the transaction, not the file.
                </p>
                <p>
                  Only one tempdb problem is genuinely a configuration issue:{' '}
                  <span className="font-mono">PAGELATCH_UP</span> contention on allocation pages, visible as{' '}
                  <span className="font-mono">wait_resource</span> values like{' '}
                  <span className="font-mono">2:1:1</span> or <span className="font-mono">2:1:3</span>. That one is
                  solved with multiple equally sized data files, and SQL Server 2016 and later configure it correctly
                  at setup.
                </p>
              </Section>

              <Section id="regression" eyebrow="Branch six" title="It Was Fast Last Week">
                <p>
                  When the query text has not changed but its speed has, three things can have changed underneath it:
                  the plan, the data volume, or the parameter values it was compiled for. Query Store is the only
                  source that keeps enough history to tell them apart.
                </p>
                <Code>{regressionQuery}</Code>
                <p>
                  Look at <span className="font-mono">plans_in_recent_window</span> first. More than one plan for the
                  same query in the recent window, with the average time changing at the same moment, is a plan
                  regression — and Query Store can force the previous plan while you work out why the optimizer chose
                  differently. That is the clean case.
                </p>
                <p>
                  If the plan count is one and the query is still slower, the plan did not change but its inputs did.
                  A plan compiled for a customer with four orders being reused for one with four hundred thousand is
                  the classic parameter sniffing case; a table that has doubled in size since the plan was chosen is
                  the classic statistics case. The distinguishing question is whether it is slow for everyone or only
                  for particular inputs.
                </p>
                <p>
                  Forcing a plan is a legitimate move and it is also a debt. It is the right thing to do at nine on a
                  Monday morning, and the wrong thing to still be true in six months, because a forced plan silently
                  stops the optimizer from adapting as the data changes. Record why you forced it and when it will be
                  reviewed. The{' '}
                  <Link
                    href="/docs/modules/query-statistics"
                    className="font-semibold text-primary hover:text-primary-dark"
                  >
                    Query Statistics module
                  </Link>{' '}
                  surfaces this comparison, and{' '}
                  <Link
                    href="/use-cases/query-regression-after-plan-change"
                    className="font-semibold text-primary hover:text-primary-dark"
                  >
                    this worked example
                  </Link>{' '}
                  follows a real regression from symptom to resolution.
                </p>
              </Section>

              <Section id="narrowing" eyebrow="Step five" title="Narrowing to One Query">
                <p>
                  Whichever branch you took, the destination is the same: a specific statement, with a specific plan,
                  that you can change. Rank by total elapsed time — the queries that consume most of the
                  server&rsquo;s day are the ones worth spending yours on.
                </p>
                <Code>{narrowingQuery}</Code>
                <p>
                  The <span className="font-mono">avg_waiting_ms</span> column is the useful one here, because it is
                  elapsed time minus CPU time — how long the statement spent not running. A query whose time is almost
                  all CPU needs a cheaper plan. A query whose time is almost all waiting needs whatever it is waiting
                  for, and the branches above tell you which.
                </p>
                <p>
                  Then read the plan, in this order: the operator with the highest actual cost, the largest gap between
                  estimated and actual rows, any scan where a seek was possible, and any spill warning. Estimated
                  against actual rows is the single most informative comparison in an execution plan; a large
                  divergence explains bad join choices, undersized memory grants and spills all at once, and usually
                  traces back to stale statistics, a non-sargable predicate, or a parameter the plan was not compiled
                  for.
                </p>
                <p>
                  Resist the temptation to accept every missing-index suggestion the plan offers. They are generated
                  for one statement in isolation, with no knowledge of the write cost or of the indexes that already
                  exist, and applied uncritically they produce ten overlapping indexes that slow every insert on the
                  table. Consolidate them against what is already there — which is what the{' '}
                  <Link
                    href="/docs/modules/index-advisor"
                    className="font-semibold text-primary hover:text-primary-dark"
                  >
                    Index Advisor
                  </Link>{' '}
                  exists to do.
                </p>
              </Section>

              <Section id="proving" eyebrow="Step six" title="Proving the Fix">
                <p>
                  A change that was not measured before and after is a belief, not a fix. Measure the statement the way
                  the application sends it, with the same parameters and the same SET options — an ad-hoc run in a
                  query window can compile a different plan from the one the application receives.
                </p>
                <Code>{provingQuery}</Code>
                <p>
                  Of the four numbers, logical reads is the most trustworthy. CPU and elapsed time move with whatever
                  else the server is doing; logical reads barely move at all, which makes them an honest answer to
                  &ldquo;did this change do anything&rdquo;. A rewrite that takes logical reads from 480,000 to 12 has
                  worked, whatever the clock says on a busy afternoon.
                </p>
                <p>Three rules make the result mean something.</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <strong className="font-semibold text-gray-900">Change one thing.</strong> An index, a setting and
                    a rewrite deployed together give you one result you cannot attribute and two changes you cannot
                    justify keeping.
                  </li>
                  <li>
                    <strong className="font-semibold text-gray-900">Re-measure over a comparable window.</strong> A
                    quiet Friday afternoon is not evidence about Monday morning. Compare like with like, using the same
                    filters as the original measurement.
                  </li>
                  <li>
                    <strong className="font-semibold text-gray-900">Check what else moved.</strong> An index that fixed
                    a report can slow every insert on the table. Look at the write side before declaring victory.
                  </li>
                </ul>
                <p>
                  Then write down what you changed, what the numbers were before and after, and why. The next person to
                  see this symptom is usually you, several months later, with no memory of any of it.
                </p>
              </Section>

              <Section id="mistakes" eyebrow="Pitfalls" title="Six Diagnostic Mistakes">
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
                  The{' '}
                  <Link
                    href="/guides/sql-server-wait-statistics"
                    className="font-semibold text-primary hover:text-primary-dark"
                  >
                    wait statistics guide
                  </Link>{' '}
                  goes properly into the step this one keeps deliberately short — the DMVs, delta capture, per-wait
                  playbooks. For worked examples of the whole method applied to a real problem, the{' '}
                  <Link href="/use-cases" className="font-semibold text-primary hover:text-primary-dark">
                    use cases
                  </Link>{' '}
                  follow individual incidents end to end. And SQLPerformance AI runs these steps read-only
                  against a live instance:{' '}
                  <Link href="/docs/modules/dashboard" className="font-semibold text-primary hover:text-primary-dark">
                    Dashboard
                  </Link>{' '}
                  for triage,{' '}
                  <Link
                    href="/docs/modules/wait-statistics"
                    className="font-semibold text-primary hover:text-primary-dark"
                  >
                    Wait Statistics
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/docs/modules/blocking-analysis"
                    className="font-semibold text-primary hover:text-primary-dark"
                  >
                    Blocking Analysis
                  </Link>{' '}
                  for the branches, and{' '}
                  <Link
                    href="/docs/modules/query-statistics"
                    className="font-semibold text-primary hover:text-primary-dark"
                  >
                    Query Statistics
                  </Link>{' '}
                  for the narrowing step. All of them are modules of the same{' '}
                  <Link href="/features" className="font-semibold text-primary hover:text-primary-dark">
                    SQL Server performance analyzer
                  </Link>
                  , which runs this whole workflow over a read-only connection.
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
