// Use Cases — structured, evidence-driven case studies.
//
// Every article follows the same shape so each one reads as a consistent
// narrative: Scenario → Symptoms → How we analyzed → Evidence →
// Recommendation → Outcome (or, for an example scenario, What to Verify).
// A study marked `isExample` is illustrative: it must not quote invented
// measurements, so its outcome lists checks instead of before/after metrics. Add a new case study by appending an object to
// `caseStudies`; routing, the sidebar, and the sitemap pick it up automatically.

export type CaseStudyCategory =
  | 'Blocking'
  | 'Query Tuning'
  | 'Indexing'
  | 'Waits'
  | 'Security'

export type Screenshot = {
  /** Path under /public, e.g. "/use-cases/blocking-storm-head-blocker/blocking-chain.png". */
  src: string
  /** Required alt text for accessibility and SEO. */
  alt: string
  /** Intrinsic image width in px (used by next/image). */
  width: number
  /** Intrinsic image height in px. */
  height: number
  /** Optional caption shown under the image. */
  caption?: string
}

export type AnalysisStep = {
  /** Which application module was used for this step. */
  module: string
  /** What we did in that module. */
  action: string
  /** The signal, metric, or evidence we looked at. */
  signal: string
  /** Optional screenshot shown inline with this step. */
  image?: Screenshot
}

export type Callout = {
  kind: 'evidence' | 'note' | 'tip' | 'warning'
  title?: string
  body: string
}

export type OutcomeMetric = {
  label: string
  before: string
  after: string
}

export type CaseStudy = {
  slug: string
  title: string
  /**
   * Optional concise <title> for search engines. The on-page `title` is a long
   * case-study headline; appended with the " — Use Cases — …" suffix it exceeds
   * the ~70-char limit search engines truncate at, so give each study a short,
   * keyword-relevant meta title used verbatim (no suffix).
   */
  metaTitle?: string
  category: CaseStudyCategory
  /**
   * True for an illustrative walkthrough rather than a measured case. The page
   * then shows an "Example scenario" label and a "What to Verify" section.
   */
  isExample?: boolean
  /** Short list-card / hero summary. */
  summary: string
  /** Rough reading time, e.g. "6 min read". */
  readingTime: string
  /** Hero meta chips: environment / workload context. */
  environment: string[]
  /** The business-visible problem. */
  scenario: string
  /** Observable symptoms the user reported. */
  symptoms: string[]
  /** Step-by-step analysis, each tied to a module + signal. */
  analysis: AnalysisStep[]
  /** Evidence callouts gathered during analysis. */
  evidence: Callout[]
  /**
   * Optional screenshot gallery shown in the Evidence section.
   * Drop files under web/public/use-cases/<slug>/ and reference them here.
   */
  screenshots?: Screenshot[]
  recommendation: {
    summary: string
    actions: string[]
    /** Optional read-only / example script shown in a code block. */
    script?: string
  }
  outcome: {
    summary: string
    /** Measured before/after values. Only for real, measured cases. */
    metrics?: OutcomeMetric[]
    /** What to check after the fix. Used by example scenarios. */
    checks?: string[]
  }
  /** Cross-links into the relevant docs modules. */
  relatedModules: { label: string; href: string }[]
}

export const caseStudies: CaseStudy[] = [
  // Cases 1-3 are example scenarios (owner decision, 2026-10-08): the situation
  // is illustrative, no numbers are invented, and every module step uses the
  // exact v1.1.0 labels (checked in SPStudioPro-v2 app/webui). Screenshots are
  // the current docs captures from the WideWorldImporters demo database.
  {
    slug: 'blocking-storm-head-blocker',
    title: 'Tracing a Blocking Storm Back to a Single Head Blocker',
    metaTitle: 'SQL Server Blocking Storm: Finding the Head Blocker',
    category: 'Blocking',
    isExample: true,
    summary:
      'Example scenario: an OLTP system freezes for seconds at a time during peak hours. This walkthrough shows how to follow the blocking chain to one idle session holding an open transaction, using the Blocking module of SQLPerformance AI.',
    readingTime: '6 min read',
    environment: ['OLTP workload', 'Read Committed'],
    scenario:
      'A common pattern: during the morning peak, order entry freezes for several seconds at a time. Users see timeouts at checkout, but CPU and memory look healthy on the host, so infrastructure metrics alone do not explain the stalls.',
    symptoms: [
      'Application timeouts cluster in the busiest hours of the day.',
      'No sustained CPU, memory, or disk pressure on the instance.',
      'Wait time rises while throughput falls, a typical contention signature.',
    ],
    analysis: [
      {
        module: 'Overview',
        action: 'Opened the Overview screen while a stall was happening and read the Server Health, Memory Health, and Storage & I/O panels.',
        signal:
          'CPU, memory, and I/O latency look normal. The Overview shows live values for the current refresh interval, not history, so it has to be open during the stall.',
        image: {
          src: '/docs/dashboard/003.png',
          alt: 'Overview screen with the Server Health, Memory Health, Workload, Storage and I/O, and TempDB panels filled with live values (demo database)',
          width: 1661,
          height: 1001,
          caption: 'Overview: live Server Health, Memory Health, Workload, Storage & I/O, and TempDB panels. Screenshot from the WideWorldImporters demo database, not from this scenario.',
        },
      },
      {
        module: 'Blocking',
        action: 'Opened Blocking during a stall, pressed Refresh Now (or left AUTO 5s on), and switched to the Tree tab.',
        signal:
          'One HEAD row with many sessions indented beneath it, each waiting on a lock (LCK_M_X, LCK_M_U, LCK_M_S). The Blocked Sessions and Maximum Depth tiles show how wide and deep the chain is.',
        image: {
          src: '/docs/blocking-analysis/003.png',
          alt: 'Blocking Tree tab with the head blocker row HEAD · 125 and five indented blocked sessions, and the Blocking Context panel on the SQL tab for the idle head blocker (demo database)',
          width: 1622,
          height: 908,
          caption: 'Tree tab: one head blocker with five blocked sessions, and the SQL tab of the idle head blocker. Screenshot from the WideWorldImporters demo database, not from this scenario.',
        },
      },
      {
        module: 'Blocking · SQL and Locks tabs',
        action: 'Selected the head blocker and read the SQL tab of the Blocking Context panel, then the Locks tab.',
        signal:
          'The head blocker is idle, yet Open Transactions reads 1 with an oldest age that keeps growing. Its last batch is a report query sent on the same connection after a small update, so the exclusive locks come from a transaction the application never committed.',
      },
      {
        module: 'Blocking · Timeline',
        action: 'Checked the Timeline tab after several stalls.',
        signal:
          'The blocked-sessions chart spikes in the same hours every day. Blocking records this history only while the application is open and connected; nothing is collected on the server.',
      },
    ],
    evidence: [
      {
        kind: 'evidence',
        title: 'Head blocker',
        body: 'The Tree tab shows a single HEAD row. Every other session in the chain waits on a lock behind it, which points at one root cause rather than general overload.',
      },
      {
        kind: 'evidence',
        title: 'Idle session, open transaction',
        body: 'The SQL tab shows the head blocker idle with an open transaction whose age keeps growing. No query is running; the locks are held by a transaction left open.',
      },
      {
        kind: 'note',
        body: 'Blocking only reads. It never kills a session; the Kill Safety section on the Impact tab is advice only.',
      },
    ],
    screenshots: [
      {
        src: '/docs/blocking-analysis/004.png',
        alt: 'Blocking Sessions tab listing five blocked sessions, with the Blocking Context panel showing a waiting session, its lock resource, and the statement that is waiting (demo database)',
        width: 1616,
        height: 695,
        caption: 'Sessions tab: a waiting session with its lock resource and the statement that is waiting. Screenshot from the WideWorldImporters demo database, not from this scenario.',
      },
    ],
    recommendation: {
      summary:
        'Move the long-running report read out of the write transaction and shorten the transaction so locks are released right after the update.',
      actions: [
        'Move the report read outside the explicit transaction (separate connection, or after COMMIT).',
        'Wrap only the update in the transaction so exclusive locks are held for milliseconds, not seconds.',
        'For the report path, evaluate READ COMMITTED SNAPSHOT to remove reader/writer blocking.',
      ],
      script: `-- Investigation only — review before applying any isolation change.
-- 1) Confirm the head blocker pattern (read-only):
SELECT  blocking_session_id, session_id, wait_type, wait_time, status
FROM    sys.dm_exec_requests
WHERE   blocking_session_id <> 0;

-- 2) Optional: evaluate RCSI in a non-production copy first.
-- ALTER DATABASE [Sales] SET READ_COMMITTED_SNAPSHOT ON;`,
    },
    outcome: {
      summary: 'After the transaction is shortened, check the result with the same modules:',
      checks: [
        'Blocking › Tree during the next peak: no long chain under a single head blocker, and the Blocked Sessions tile stays low.',
        'Blocking › SQL tab: no idle head blocker with a growing open-transaction age.',
        'Blocking › Timeline: the blocked-sessions chart stays flat through the busy hours (keep the application open and connected so it records).',
        'Your application logs: checkout timeouts drop.',
      ],
    },
    relatedModules: [
      { label: 'Blocking Analysis', href: '/docs/modules/blocking-analysis' },
      { label: 'Dashboard', href: '/docs/modules/dashboard' },
    ],
  },
  {
    slug: 'query-regression-after-plan-change',
    title: 'Diagnosing a Sudden Query Regression After a Plan Change',
    metaTitle: 'Diagnosing a SQL Server Query Regression After a Plan Change',
    category: 'Query Tuning',
    isExample: true,
    summary:
      'Example scenario: a nightly report that used to finish quickly suddenly runs many times longer, with no code change. This walkthrough shows how Query Statistics surfaces the plan change and how to confirm the trigger before you fix it.',
    readingTime: '7 min read',
    environment: ['Mixed OLTP + reporting', 'Query Store ON', 'Auto-update stats ON'],
    scenario:
      'A finance reporting procedure has run in well under a minute for months. One night it starts taking many times longer and delays the morning numbers. No deployment changed the procedure, and the data volume grew only modestly.',
    symptoms: [
      'Same procedure, same parameters, much longer runtime starting on one specific night.',
      'No code change in source control for the affected object.',
      'Durations are bimodal: some runs are fast, others very slow.',
    ],
    analysis: [
      {
        module: 'Query Statistics',
        action: 'Set Duration to Last 7 Days and Order By to Average Duration, then opened the procedure.',
        signal:
          'The header counts the execution plans detected. With more than one plan, Plan Stability changes from Stable to Attention (plan changes detected) or, with many plans, Problem (possible parameter sniffing).',
        image: {
          src: '/docs/querystatistics/006.png',
          alt: 'Query Statistics detail view on the Execution Plan tab with the plans-detected count in the header, the Missing Indexes and Warnings sub-tabs, and the Plan Stability panel (demo database)',
          width: 1623,
          height: 917,
          caption: 'Execution Plan tab: the header counts the plans detected and the Plan Stability panel rates them. This demo query has one plan, so it reads Stable. Screenshot from the WideWorldImporters demo database, not from this scenario.',
        },
      },
      {
        module: 'Query Statistics · Execution Plan',
        action: 'Switched between the plans with the plan picker (most executed, slowest, newest) and compared the operators.',
        signal:
          'The fast plan seeks on a supporting index. The slow plan scans the table with a hash join, and the Warnings sub-tab lists its operator warnings.',
      },
      {
        module: 'Statistics check (SSMS, read-only)',
        action: 'Compared the time the slow plan first appeared with STATS_DATE on the tables involved.',
        signal: 'The slow plan first appeared right after an automatic statistics update on a skewed column.',
      },
      {
        module: 'Index Advisor',
        action: 'Opened Index Details for the supporting index the fast plan used.',
        signal:
          'The index exists and has reads (seeks + scans + lookups). It is usable; the optimizer stopped choosing it under the new cardinality estimate.',
      },
    ],
    evidence: [
      {
        kind: 'evidence',
        title: 'Plan change',
        body: 'Query Store holds two plans for the same query: a fast seek plan and a slow scan plan. The slow one appears from the night the runtime jumped.',
      },
      {
        kind: 'evidence',
        title: 'Trigger',
        body: 'The time of the change matches an automatic statistics update on a skewed status column, which pushed the optimizer toward the scan plan.',
      },
      {
        kind: 'tip',
        body: 'When one query has two plans, forcing the known-good plan is often the quickest non-destructive mitigation while you fix the root cause. You force it yourself in SSMS or with T-SQL; SQLPerformance AI does not force or unforce plans.',
      },
    ],
    recommendation: {
      summary:
        'Force the known-good plan from Query Store to stop the slowdown, then fix the cardinality misestimate so the good plan wins on its own.',
      actions: [
        'Force the fast plan for the affected query through Query Store (in SSMS or with T-SQL).',
        'Update statistics on the skewed column with a fuller sample so the estimates improve.',
        'Re-check after the next data cycle and unforce the plan once the optimizer picks the seek plan reliably.',
      ],
      script: `-- Example IDs — take the real query_id and plan_id from Query Store first.
EXEC sp_query_store_force_plan @query_id = 42, @plan_id = 7;

-- Root cause: improve estimates on the skewed column.
UPDATE STATISTICS dbo.Invoices (IX_Invoices_Status) WITH FULLSCAN;

-- Later, once the good plan is chosen naturally:
-- EXEC sp_query_store_unforce_plan @query_id = 42, @plan_id = 7;`,
    },
    outcome: {
      summary: 'After forcing the plan and updating statistics, check the result with the same modules:',
      checks: [
        'Query Statistics › Last 24 Hours: the average duration of the procedure is back to its usual level.',
        'Query Statistics › Execution Plan: the most executed plan is the seek plan.',
        'After you unforce the plan, the slow plan does not come back over the next data cycles.',
      ],
    },
    relatedModules: [
      { label: 'Query Statistics', href: '/docs/modules/query-statistics' },
      { label: 'Index Advisor', href: '/docs/modules/index-advisor' },
    ],
  },
  {
    slug: 'pageiolatch-waits-missing-index',
    title: 'From PAGEIOLATCH Waits to a Targeted Index Fix',
    metaTitle: 'From PAGEIOLATCH Waits to a Targeted SQL Server Index Fix',
    category: 'Waits',
    isExample: true,
    summary:
      'Example scenario: a growing dashboard query pushes I/O waits to the top of the instance. This walkthrough goes from Wait Statistics to the query’s missing-index evidence, checked against the existing indexes in Index Advisor, to one focused index.',
    readingTime: '6 min read',
    environment: ['Reporting-heavy workload', 'Query Store ON'],
    scenario:
      'A customer-facing dashboard gets slower every week as data grows. The instance is not CPU-bound, but query latency keeps climbing and users complain that the dashboard feels heavy.',
    symptoms: [
      'Dashboard latency rises with data volume, not with user count.',
      'CPU is comfortable; the bottleneck is elsewhere.',
      'A handful of read-heavy queries dominate logical and physical reads.',
    ],
    analysis: [
      {
        module: 'Wait Statistics',
        action: 'Pressed Set Baseline, then opened the Trend & Blocking tab with Trend Window 30 Days and Display set to Daily Summary.',
        signal:
          'PAGEIOLATCH_SH leads the Top Waits cards and rises in the daily trend. The Source line shows where the trend comes from: Query Store, or the application’s own history when Query Store wait data is not available.',
        image: {
          src: '/docs/wait-statistics/004.png',
          alt: 'Wait Statistics Trend & Blocking tab with the Daily Summary chart and table for a 7-day window from Query Store (demo database)',
          width: 1097,
          height: 878,
          caption: 'Trend & Blocking tab: Daily Summary with its window and source. Screenshot from the WideWorldImporters demo database, not from this scenario.',
        },
      },
      {
        module: 'Query Statistics',
        action: 'Set Order By to Logical Reads, which ranks queries by average reads per execution.',
        signal: 'One dashboard aggregation query reads far more pages per run than anything else and scans a large fact table on every load.',
        image: {
          src: '/docs/querystatistics/001.png',
          alt: 'Query Statistics list screen with the filter panel, ranked query cards, and the Selected Query inspector (demo database)',
          width: 1633,
          height: 930,
          caption: 'Query Statistics: ranked query cards with the Order By filter. Screenshot from the WideWorldImporters demo database, not from this scenario.',
        },
      },
      {
        module: 'Query Statistics · Missing Indexes',
        action: 'Opened the query, went to the Execution Plan tab, and read the Missing Indexes sub-tab.',
        signal:
          'The plan carries a missing-index hint: the card lists its impact, the equality, inequality, and include columns, and a CREATE INDEX statement to copy.',
      },
      {
        module: 'Index Advisor',
        action: 'Reviewed the existing indexes on the same table: key and include columns, reads, writes, and the read/write ratio in Index Details.',
        signal:
          'No existing index covers the predicate, so the suggested index would not duplicate one. Index Advisor reviews existing indexes; it does not list missing ones in its grid.',
        image: {
          src: '/docs/index-advisor/002.png',
          alt: 'Index Advisor with one index checked and its Index Details Overview showing usage, statistics, fragmentation, and data confidence (demo database)',
          width: 1613,
          height: 939,
          caption: 'Index Advisor: Index Details for an existing index. Screenshot from the WideWorldImporters demo database, not from this scenario.',
        },
      },
    ],
    evidence: [
      {
        kind: 'evidence',
        title: 'Dominant wait',
        body: 'PAGEIOLATCH_SH holds the largest share of wait time and keeps growing, which points at data-page reads from storage, not at locking or CPU.',
      },
      {
        kind: 'evidence',
        title: 'Hot statement',
        body: 'One aggregation query causes most of the reads. It scans the fact table on every run because no index covers its predicate and output columns.',
      },
      {
        kind: 'warning',
        body: 'Check the write side before adding an index: Index Advisor shows the writes and read/write ratio of each existing index on the table. On insert-heavy tables, one more index has a cost.',
      },
    ],
    recommendation: {
      summary:
        'Add one narrow covering index that matches the dashboard query’s predicate and output columns, removing the repeated table scan and the I/O waits it causes.',
      actions: [
        'Create the index from the query’s Missing Indexes card (predicate keys + included output columns) after confirming in Index Advisor that it duplicates no existing index.',
        'Check the new seek plan in Query Statistics after the next dashboard load.',
        'Compare Wait Statistics with the baseline to confirm PAGEIOLATCH falls and stays down.',
      ],
      script: `-- Review the Missing Indexes card and Index Advisor before applying; size and write cost matter.
CREATE NONCLUSTERED INDEX IX_FactSales_DashboardCover
ON dbo.FactSales (ProductKey, OrderDateKey)
INCLUDE (SalesAmount, Quantity)
WITH (ONLINE = ON, DATA_COMPRESSION = PAGE);`,
    },
    outcome: {
      summary: 'After the index is in place, check the result with the same modules:',
      checks: [
        'Query Statistics: the average logical reads of the dashboard query drop, and its Execution Plan shows a seek instead of the scan.',
        'Query Statistics › Missing Indexes: the new plan no longer carries the hint.',
        'Wait Statistics: PAGEIOLATCH_SH falls back in the Top Waits cards and in the daily trend. For a direct comparison, press Save Before before the change and Save After and Compare after it.',
      ],
    },
    relatedModules: [
      { label: 'Wait Statistics', href: '/docs/modules/wait-statistics' },
      { label: 'Query Statistics', href: '/docs/modules/query-statistics' },
      { label: 'Index Advisor', href: '/docs/modules/index-advisor' },
    ],
  },
  {
    slug: 'optional-filter-non-sargable-procedure',
    title: 'RECOMPILE Cut Reads 95% — Then the Re-Analysis Told the Real Story',
    metaTitle: 'RECOMPILE Cut SQL Server Reads 95% — A Re-Analysis Story',
    category: 'Query Tuning',
    summary:
      'A reporting procedure looked cheap for one customer but exploded to 306K logical reads for all customers. AI analysis flagged a non-SARGable computed predicate and an implicit conversion; empirical testing confirmed it and a sargability rewrite stabilized plans (variance 126% → 0%) — yet the verdict stayed POOR_QUERY_DESIGN, because the cost is the design, not a missing hint.',
    readingTime: '7 min read',
    environment: [
      'SQL Server 2019',
      'WideWorldImporters',
      'OLTP + ad-hoc reporting',
      'Columnstore on Sales.OrderLines',
      'SQLQueryStress load test',
    ],
    scenario:
      'Demo.usp_test_0004 returns order-line detail filtered by an optional customer, a date range, and a minimum line amount. It is called constantly from a reporting screen with wildly different parameter shapes — sometimes a single customer over a few weeks, sometimes every customer over a full year. Under mixed load it burned far more CPU and I/O than its result sizes suggested, and the team could not point to a single "slow query" because the same procedure was sometimes fast and sometimes catastrophic.',
    symptoms: [
      'Single-customer calls were cheap (~149 logical reads, tens of ms), but "all customers" calls blew up to 306,471 logical reads on OrderLines and 1.64 s elapsed for one execution.',
      'Execution time was highly unstable: duration CV ~126% and CPU CV ~146%, with the worst execution ~15× slower than the best.',
      'AI analysis classified the object as POOR_QUERY_DESIGN, OVER_INDEXED, CPU-bound, overall risk HIGH.',
    ],
    analysis: [
      {
        module: 'SQLQueryStress',
        action:
          'Ran the procedure with randomized parameters (~25% NULL @CustomerID to exercise the "all customers" path) at 1000 iterations × 4/8/16/32 threads, capturing STATISTICS IO/TIME for a selective and a NULL call.',
        signal:
          'Selective path ~149 logical reads, tens of ms. NULL path: OrderLines scan count 23,347, 306,471 logical reads, 1,542 physical reads; Customers 46,694 reads; 625 ms CPU / 1,640 ms elapsed. The optional filter, not data volume, drove the blowup.',
        // The captured window is the later v2 run (same harness, same parameter
        // generator); the counters in it belong to v2, not to the baseline above.
        image: {
          src: '/use-cases/optional-filter-non-sargable-procedure/01-sqlquerystress-window.png',
          alt: 'SQLQueryStress window running Demo.usp_test_0004_v2 with randomized parameters at 1000 iterations × 32 threads',
          width: 1289,
          height: 533,
          caption: 'SQLQueryStress harness with the randomized parameter generator, 1000 iterations × 32 threads. This capture is from the later v2 run; the same harness drove every measurement.',
        },
      },
      {
        module: 'Object Explorer · AI Tune',
        action: 'Selected Demo.usp_test_0004 in Object Explorer and ran Start Analysis on the AI Tune tab (AI Performance Analysis).',
        signal:
          'Baseline 102.8 ms avg, 19.5 ms CPU, 8,392 logical reads across 32,000 executions. Canonical: POOR_QUERY_DESIGN, OVER_INDEXED, risk HIGH, CPU_BOUND. Primary pathology COMPUTED_PREDICATE_NON_SARGABLE, with warnings for an implicit conversion and a key lookup. Parameter-sniffing rated LOW from a single compiled-plan snapshot.',
        image: {
          src: '/use-cases/optional-filter-non-sargable-procedure/02-report-header-v1.png',
          alt: 'Object analysis report for Demo.usp_test_0004 with 1 Critical · 3 Total Actions and the What’s Wrong summary naming COMPUTED PREDICATE NON SARGABLE at 99% diagnosis confidence',
          width: 1464,
          height: 645,
          caption: 'Object analysis report: 1 Critical · 3 Total Actions, and What’s Wrong naming the primary pathology at 99% diagnosis confidence.',
        },
      },
      {
        module: 'Plan verification (SSMS, read-only)',
        action: 'Re-compiled the cached plan and scanned its XML to confirm each AI claim rather than trusting the report alone.',
        signal:
          'Implicit conversion confirmed — CONVERT_IMPLICIT(decimal(10,0), ol.Quantity) inside LineAmount. Non-SARGable predicate confirmed — a Compute Scalar builds LineAmount and a Filter applies >= @MinLineAmount on top of a full columnstore scan of all 1.5M OrderLines rows. The key lookup the report cited was NOT in this compile (columnstore + hash joins) — the cost is plan-dependent.',
        image: {
          src: '/use-cases/optional-filter-non-sargable-procedure/03-ssms-execution-plan.png',
          alt: 'SSMS execution plan showing a columnstore scan, compute scalar, filter, hash joins and a sort',
          width: 1426,
          height: 529,
          caption: 'SSMS execution plan — Columnstore Index Scan → Compute Scalar → Filter, then Hash Match joins and a Sort (40% of cost).',
        },
      },
      {
        module: 'Index verification (SSMS, read-only)',
        action: 'Counted indexes and measured fragmentation/usage on the three driving tables to test the OVER_INDEXED claim.',
        signal:
          'OrderLines 13 indexes, Customers 10, Orders 8. Several never serve reads but carry heavy write cost. Average fragmentation 28.65% matched the tool — but inflated by tiny 2-page indexes; the genuinely fragmented object is PK_Sales_Orders (92.8% over 13,734 pages).',
      },
      {
        module: 'AI Tune (Re-run Analysis)',
        action: "Applied the tool's P1 (OPTION RECOMPILE) unchanged, re-ran the workload, and re-ran AI Performance Analysis to validate before/after.",
        signal:
          'Workload avg logical reads fell from 8,392 to 415 (60,004 executions), but avg duration rose 102.8 → 144.9 ms and CPU 19.5 → 27.5 ms from per-call recompile cost. Risk stayed HIGH, pathology unchanged, and plan-variance signals climbed (plan count 3 → 10, reads-ratio 0.6 → 188.8).',
        image: {
          src: '/use-cases/optional-filter-non-sargable-procedure/04-report-actions-recompile.png',
          alt: 'Actions (P1) card on the OPTION (RECOMPILE) version with Root Cause, Change and Expected Impact quoting the current baseline',
          width: 1159,
          height: 530,
          caption: 'Actions (P1) on the RECOMPILE version: Root Cause names the key lookup and CONVERT_IMPLICIT; Expected Impact quotes the current baseline of 415 reads / 145 ms per execution.',
        },
      },
      {
        module: 'Sargability rewrite + AI re-analysis',
        action:
          "Implemented the tool's deeper P1 option as usp_test_0004_v2: parameterized dynamic SQL that adds the @CustomerID predicate only when supplied and skips the LineAmount filter when @MinLineAmount = 0, removing the CAST wrapper from the predicate.",
        signal:
          'Reads stayed low (420), but every instability signal collapsed — duration/CPU variance 126% → 0%, plan-count variance 10 → 0, implicit-conversion signal gone, index health OVER_INDEXED → BALANCED. In SSMS (STATISTICS TIME), warmed plans were reused with 0 ms compile. Risk stayed HIGH / POOR_QUERY_DESIGN — the broad scan-and-sort cost is structural.',
        image: {
          src: '/use-cases/optional-filter-non-sargable-procedure/06-report-test-plan-v2.png',
          alt: 'Test Plan section of the v2 report with the current baseline snapshot of 130.53 ms duration, 27.77 ms CPU, 420 reads and 60006 executions',
          width: 1169,
          height: 260,
          caption: 'Test Plan for v2: current baseline snapshot of 130.53 ms, 27.77 ms CPU, 420 reads, 60,006 executions.',
        },
      },
    ],
    evidence: [
      {
        kind: 'evidence',
        title: 'Non-SARGable computed predicate',
        body: 'CAST(ol.Quantity * ol.UnitPrice AS DECIMAL(18,2)) >= @MinLineAmount is evaluated per row in a Filter above a full columnstore scan of 1.5M rows. The optimizer cannot seek on a computed expression. This is the tool’s authoritative primary pathology (diagnosis confidence 99%), confirmed in the plan XML.',
      },
      {
        kind: 'evidence',
        title: 'Implicit conversion',
        body: 'The plan contains CONVERT_IMPLICIT(decimal(10,0), ol.Quantity) before the multiply, exactly as the tool warned, degrading cardinality estimation around LineAmount.',
      },
      {
        kind: 'evidence',
        title: 'Plan instability is the real pain',
        body: 'The same NULL call produced two completely different plans: a row-mode nested-loop + key-lookup plan at 306,471 reads (the baseline, and source of the key-lookup signal), versus a batch-mode columnstore + hash-join plan at ~436 reads on a fresh compile.',
      },
      {
        kind: 'evidence',
        title: 'OVER_INDEXED confirmed',
        body: '13 indexes on OrderLines, several with zero seeks/scans but millions of updates (pure write overhead). Average fragmentation 28.65% matched the tool, but its REBUILD list omitted the largest fragmented index — PK_Sales_Orders (92.8% / 13,734 pages). Rank maintenance by page_count, not percent.',
      },
      {
        kind: 'note',
        body: 'The tool rated parameter sniffing LOW because it saw a single compiled snapshot — its own report flags the caveat. Empirically the risk was real: the heavy path was trapped on a sniffing-victim plan.',
      },
      {
        kind: 'note',
        title: 'Which build',
        body: 'These analyses were run on June 26, 2026 with an earlier build of SQLPerformance AI against a WideWorldImporters demo database. Object analysis reports in v1.1.0 have the same sections (What’s Wrong, Canonical Classification, Actions, Test Plan); a re-run today can produce different numbers and wording.',
      },
      {
        kind: 'warning',
        body: 'The tool’s maintenance DDL had a bug — it emitted ALTER INDEX [...] ON [Sales.Customers] (schema and table in one bracket pair), which SQL Server rejects. The index choices were sound once corrected to [Sales].[Customers].',
      },
    ],
    screenshots: [
      {
        src: '/use-cases/optional-filter-non-sargable-procedure/05-report-header-v2.png',
        alt: 'Object analysis report for Demo.usp_test_0004_v2 with 1 Critical · 2 Total Actions, DMV Available and Query Store Missing badges, and the same primary pathology at 88% diagnosis confidence',
        width: 1449,
        height: 644,
        caption: 'Re-analysis of v2: 1 Critical · 2 Total Actions, and the same primary pathology, now at 88% diagnosis confidence.',
      },
    ],
    recommendation: {
      summary:
        "Apply the tool's P1 fix to stabilize the plan, then go further on sargability for the residual scan cost; treat index changes as advisory until a usage baseline exists, and refine the maintenance list by page count.",
      actions: [
        'Apply the lowest-risk P1 unchanged: append OPTION (RECOMPILE) so each call compiles for its own parameters (workload reads −95%, but avg CPU/duration +41% — a stabilizer, not ideal to leave permanently on a hot path).',
        'Prefer the sargability rewrite: parameterized dynamic SQL that adds @CustomerID only when supplied, skips the LineAmount filter when @MinLineAmount = 0, and drops the CAST wrapper — matched the read reduction, removed the implicit conversion, and reused one stable plan per shape (variance 126% → 0%).',
        'Treat the remaining cost as a design problem: paginate (OFFSET/FETCH or keyset), pre-aggregate the LineAmount reporting, or add a persisted computed-column index once a usage gate clears.',
        'Align Quantity’s data type to remove the implicit conversion in the LineAmount calculation.',
        'Run index maintenance, but prioritize by page count — PK_Sales_Orders (92.8% / 13,734 pages) outranks the tiny 50%-fragmented Customers indexes the tool listed.',
        'Capture a 14-day Query Store / usage baseline before creating or dropping any index (several indexes are write-only overhead and are drop candidates).',
      ],
      script: `-- Tool's P1 (applied, unchanged): keep the existing SELECT / FROM / WHERE / ORDER BY exactly as-is.
ORDER BY o.OrderDate DESC, LineAmount DESC
OPTION (RECOMPILE);`,
    },
    outcome: {
      summary:
        'Two fixes were applied and measured. The quick OPTION (RECOMPILE) collapsed logical reads but added a per-call compile tax. The dynamic-SQL sargability rewrite (v2) kept the I/O win, removed the implicit conversion, and stabilized plans completely without recompile churn — and the tool re-rated index health to BALANCED. The verdict that did not move: across all fixes the AI held risk HIGH / POOR_QUERY_DESIGN, because the dominant cost is scanning and sorting all order lines for broad parameter shapes — a query-design problem, not anything a plan or index hint can resolve.',
      metrics: [
        { label: 'Workload avg logical reads / exec', before: '8,392', after: '420 (−95%)' },
        { label: 'Plan stability (duration variance)', before: '126% / 3 plans', after: '0% / 1 reused plan' },
        { label: 'Implicit-conversion signal', before: 'Present', after: 'Removed' },
        { label: 'Index health classification (AI)', before: 'OVER_INDEXED', after: 'BALANCED' },
        { label: 'NULL-path OrderLines reads (1 exec)', before: '306,471', after: '~455 (+~1,000 lob)' },
        { label: 'Overall risk (AI)', before: 'HIGH', after: 'HIGH (design cost remains)' },
      ],
    },
    relatedModules: [
      { label: 'Object Explorer', href: '/docs/modules/object-explorer' },
      { label: 'Query Statistics', href: '/docs/modules/query-statistics' },
      { label: 'Index Advisor', href: '/docs/modules/index-advisor' },
    ],
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  const normalized = slug.replace(/_/g, '-')
  return caseStudies.find((item) => item.slug === normalized)
}
