// Use Cases — structured, evidence-driven case studies.
//
// Every article follows the same shape so each one reads as a consistent
// narrative: Scenario → Symptoms → How we analyzed → Evidence →
// Recommendation → Outcome. Add a new case study by appending an object to
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
    metrics: OutcomeMetric[]
  }
  /** Cross-links into the relevant docs modules. */
  relatedModules: { label: string; href: string }[]
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'blocking-storm-head-blocker',
    title: 'Tracing a Blocking Storm Back to a Single Head Blocker',
    metaTitle: 'SQL Server Blocking Storm: Finding the Head Blocker',
    category: 'Blocking',
    summary:
      'An OLTP system froze for seconds at a time during peak hours. We followed the blocking chain to one long-running transaction and resolved the contention without touching the schema.',
    readingTime: '6 min read',
    environment: ['SQL Server 2019', 'OLTP workload', 'Query Store ON', 'Read Committed'],
    scenario:
      'During the morning peak, order entry would intermittently freeze for 5–15 seconds. Users saw timeouts on checkout, but CPU and memory looked healthy on the host, so the on-call DBA could not explain the stalls from infrastructure metrics alone.',
    symptoms: [
      'Application timeouts clustered between 09:00 and 10:30 local time.',
      'No sustained CPU, memory, or disk pressure on the instance.',
      'Wait time spiked even though throughput dropped — a classic contention signature.',
    ],
    analysis: [
      {
        module: 'Dashboard',
        action: 'Confirmed the host was not resource-bound during the stalls.',
        signal: 'CPU, memory, and storage I/O stayed within normal ranges during the stalls.',
      },
      {
        module: 'Blocking Analysis',
        action: 'Captured a live snapshot during a stall and expanded the blocking chain.',
        signal: 'A single head blocker holding key locks while 40+ sessions queued behind it.',
        // PLACEHOLDER image (reused from /docs) — replace with a real case screenshot.
        // Illustrative screenshot from the WideWorldImporters demo database, not data from this scenario.
        image: {
          src: '/docs/blocking-analysis/001.png',
          alt: 'Blocking Analysis main screen with the live blocking topology graph and the session SQL panel (placeholder image from a demo database, not this case)',
          width: 1913,
          height: 946,
          caption: 'Blocking Analysis: live blocking topology graph with the session SQL panel. (Placeholder image from a demo database, not this case.)',
        },
      },
      {
        module: 'Query Statistics',
        action: 'Looked up the head blocker statement in Query Store.',
        signal: 'A reporting query running inside the same transaction as a small update.',
      },
    ],
    evidence: [
      {
        kind: 'evidence',
        title: 'Head blocker',
        body: 'One session (SPID 73) held LCK_M_X on the orders clustered index for ~12 seconds inside an explicit transaction that also ran an ad-hoc report.',
      },
      {
        kind: 'evidence',
        title: 'Blast radius',
        body: 'The blocking snapshot showed 41 dependent sessions, all waiting on the same key range — confirming a single root cause rather than general overload.',
      },
      {
        kind: 'note',
        body: 'Because the analysis is read-only, the snapshot was safe to capture against production during the incident.',
      },
    ],
    // PLACEHOLDER gallery (reused from /docs) — swap for real case screenshots in
    // web/public/use-cases/blocking-storm-head-blocker/ when available.
    screenshots: [
      {
        src: '/docs/blocking-analysis/002.png',
        alt: 'Blocking Analysis Tree view listing blocked sessions under their head blocker (placeholder image from a demo database, not this case)',
        width: 1084,
        height: 576,
        caption: 'Tree view: blocked sessions grouped under their head blocker. (Placeholder image from a demo database, not this case.)',
      },
    ],
    recommendation: {
      summary:
        'Split the long-lived reporting read out of the write transaction and shorten the transaction scope so locks release immediately after the update.',
      actions: [
        'Move the ad-hoc report read outside the explicit transaction (separate connection / after COMMIT).',
        'Wrap only the update in the transaction so exclusive locks are held for milliseconds, not seconds.',
        'For the report path, evaluate READ COMMITTED SNAPSHOT to remove reader/writer blocking entirely.',
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
      summary:
        'After scoping the transaction and moving the report read out, the morning stalls disappeared. Follow-up reviews over the next two weeks found no recurrence of the blocking chain.',
      metrics: [
        { label: 'Peak blocking chain depth', before: '41 sessions', after: '0–2 sessions' },
        { label: 'Max lock hold time', before: '~12 s', after: '< 50 ms' },
        { label: 'Checkout timeouts / day', before: '~120', after: '0' },
      ],
    },
    relatedModules: [
      { label: 'Blocking Analysis', href: '/docs/modules/blocking-analysis' },
      { label: 'Query Statistics', href: '/docs/modules/query-statistics' },
      { label: 'Dashboard', href: '/docs/modules/dashboard' },
    ],
  },
  {
    slug: 'query-regression-after-plan-change',
    title: 'Diagnosing a Sudden Query Regression After a Plan Change',
    metaTitle: 'Diagnosing a SQL Server Query Regression After a Plan Change',
    category: 'Query Tuning',
    summary:
      'A nightly report that always finished in under a minute started running for 20+ minutes. Query Store evidence showed a plan flip — and the fix did not require rewriting the query.',
    readingTime: '7 min read',
    environment: ['SQL Server 2022', 'Mixed OLTP + reporting', 'Query Store ON', 'Auto-update stats ON'],
    scenario:
      'A finance reporting procedure that had run for months in ~45 seconds suddenly began taking 20–30 minutes, delaying the morning numbers. No deployment had changed the procedure, and the data volume had grown only modestly.',
    symptoms: [
      'Same procedure, same parameters, dramatically longer runtime starting one specific night.',
      'No code change in source control for the affected object.',
      'Duration variance was bimodal: fast on some runs, very slow on others.',
    ],
    analysis: [
      {
        module: 'Query Statistics',
        action: 'Opened the query in Query Statistics, then confirmed its plan history in Query Store.',
        signal: 'The card flagged multiple plans and a sharply worse trend; Query Store held a fast seek plan and a slow scan plan for the same query_id.',
        // Illustrative screenshot from the WideWorldImporters demo database, not data from this scenario.
        image: {
          src: '/docs/querystatistics/002.png',
          alt: 'Query Statistics detail view showing the Problem badge, 2 execution plans detected, and Plan Stability marked Problem',
          width: 1682,
          height: 915,
          caption: 'Query Statistics detail view for a query with two execution plans. Screenshot from the demo database, not from this scenario.',
        },
      },
      {
        module: 'Statistics check (SSMS, read-only)',
        action: 'Correlated the plan flip timestamp with STATS_DATE on the tables involved.',
        signal: 'The slow plan first appeared right after an auto-stats update on a skewed column.',
      },
      {
        module: 'Index Advisor',
        action: 'Checked whether a supporting index would make the good plan stable.',
        signal: 'An existing index was usable but not chosen under the new cardinality estimate.',
      },
    ],
    evidence: [
      {
        kind: 'evidence',
        title: 'Plan flip',
        body: 'Query Store recorded plan_id 7 (45s, index seek) and plan_id 19 (24 min, full scan with a large hash spill) for the same query_id.',
      },
      {
        kind: 'evidence',
        title: 'Trigger',
        body: 'The regression timestamp lined up with an auto-stats update on a heavily skewed status column, which pushed the optimizer toward the scan plan.',
      },
      {
        kind: 'tip',
        body: 'When two plans exist for one query, the fastest non-destructive fix is often forcing the known-good plan while you address the root cause.',
      },
    ],
    // Illustrative screenshot from the WideWorldImporters demo database, not data from this scenario.
    screenshots: [
      {
        src: '/docs/querystatistics/003.png',
        alt: 'Query Statistics Execution Plan tab showing the Multiple plans detected - possible parameter sniffing notice',
        width: 1678,
        height: 914,
        caption: 'Execution Plan tab with the multiple-plans notice. Screenshot from the demo database, not from this scenario.',
      },
    ],
    recommendation: {
      summary:
        'Force the known-good plan from Query Store to stop the bleeding immediately, then address the cardinality misestimate so the good plan wins on its own.',
      actions: [
        'Force the fast plan (plan_id 7) for the affected query via Query Store.',
        'Refresh statistics on the skewed column with a fuller sample so estimates improve.',
        'Re-evaluate after the next data cycle and unforce once the optimizer reliably picks the seek plan.',
      ],
      script: `-- Stop-the-bleeding: force the known-good plan (review IDs from Query Store first).
EXEC sp_query_store_force_plan @query_id = 42, @plan_id = 7;

-- Root cause: improve estimates on the skewed column.
UPDATE STATISTICS dbo.Invoices (IX_Invoices_Status) WITH FULLSCAN;

-- Later, once the good plan is chosen naturally:
-- EXEC sp_query_store_unforce_plan @query_id = 42, @plan_id = 7;`,
    },
    outcome: {
      summary:
        'Forcing the plan restored runtime within minutes of being applied. After refreshing statistics, the optimizer chose the seek plan on its own and the forced plan was removed.',
      metrics: [
        { label: 'Report runtime', before: '20–30 min', after: '~45 s' },
        { label: 'Hash spills to tempdb', before: 'Large', after: 'None' },
        { label: 'Time to mitigate', before: '—', after: '< 10 min (plan force)' },
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
    summary:
      'A growing dashboard query pushed IO waits to the top of the instance. Wait analysis pointed at storage reads, and the query’s missing-index evidence, checked against existing indexes in Index Advisor, turned that signal into one focused, low-risk index.',
    readingTime: '6 min read',
    environment: ['SQL Server 2019', 'Reporting-heavy workload', 'Query Store ON', 'SSD storage'],
    scenario:
      'A customer-facing dashboard got slower every week as data grew. The instance was not CPU-bound, but query latency kept climbing and users complained the dashboard "felt heavy" by mid-quarter.',
    symptoms: [
      'Dashboard latency rising steadily with data volume, not with user count.',
      'CPU comfortable; the bottleneck was clearly elsewhere.',
      'A handful of read-heavy queries dominated logical and physical reads.',
    ],
    analysis: [
      {
        module: 'Wait Statistics',
        action: 'Set a baseline and reviewed the daily wait trend over the last 30 days.',
        signal: 'PAGEIOLATCH_SH dominated total wait time and was trending upward.',
        // PLACEHOLDER image (reused from /docs) — replace with a real case screenshot.
        image: {
          src: '/docs/wait-statistics/001.png',
          alt: 'Wait Statistics main screen from a demo database (placeholder image, not this case)',
          width: 1616,
          height: 917,
          caption: 'Wait Statistics main screen. (Placeholder image from a demo database, not this case.)',
        },
      },
      {
        module: 'Query Statistics',
        action: 'Ordered queries by Logical Reads to find the statements reading the most pages.',
        signal: 'One dashboard aggregation query scanned a large fact table on every load.',
      },
      {
        module: 'Index Advisor',
        action: 'Took the covering index suggested in the query’s Missing Indexes view and reviewed the existing indexes on the table for duplicates and overlap.',
        signal: 'No existing index covered the predicate, so a narrow covering index would turn the scan into a seek without duplicating an index.',
        // PLACEHOLDER image (reused from /docs) — replace with a real case screenshot.
        image: {
          src: '/docs/index-advisor/001.png',
          alt: 'Index Advisor reviewing existing indexes on a table with duplicate and drop-safety signals',
          width: 1917,
          height: 981,
          caption: 'Index Advisor: existing indexes reviewed before adding a covering index. (Placeholder image.)',
        },
      },
    ],
    evidence: [
      {
        kind: 'evidence',
        title: 'Dominant wait',
        body: 'PAGEIOLATCH_SH accounted for the majority of accumulated wait time and grew ~18% week over week — pointing at data-page reads from storage, not locking or CPU.',
      },
      {
        kind: 'evidence',
        title: 'Hot statement',
        body: 'A single aggregation query produced the bulk of physical reads, repeatedly scanning the fact table because no supporting index covered its predicate and output columns.',
      },
      {
        kind: 'warning',
        body: 'Index Advisor flags overlap and write-amplification risk before you add an index — review the impact on insert-heavy tables.',
      },
    ],
    recommendation: {
      summary:
        'Add one narrow covering index that matches the dashboard query predicate and included columns, eliminating the repeated table scan and the IO waits it generated.',
      actions: [
        'Create the covering index suggested in the query’s Missing Indexes view (predicate keys + included output columns) after confirming in Index Advisor that it duplicates no existing index.',
        'Validate the new seek plan in Query Statistics after the next dashboard load.',
        'Re-baseline Wait Statistics to confirm PAGEIOLATCH falls and stays down.',
      ],
      script: `-- Review Index Advisor output before applying; size and write impact matter.
CREATE NONCLUSTERED INDEX IX_FactSales_DashboardCover
ON dbo.FactSales (ProductKey, OrderDateKey)
INCLUDE (SalesAmount, Quantity)
WITH (ONLINE = ON, DATA_COMPRESSION = PAGE);`,
    },
    outcome: {
      summary:
        'The covering index turned the scan into a seek. PAGEIOLATCH waits dropped sharply and dashboard latency stabilized even as data kept growing.',
      metrics: [
        { label: 'PAGEIOLATCH_SH share of waits', before: 'Top wait', after: 'Negligible' },
        { label: 'Dashboard query logical reads', before: '~2.1 M', after: '~3.4 K' },
        { label: 'p95 dashboard load', before: '8.4 s', after: '1.1 s' },
      ],
    },
    relatedModules: [
      { label: 'Wait Statistics', href: '/docs/modules/wait-statistics' },
      { label: 'Index Advisor', href: '/docs/modules/index-advisor' },
      { label: 'Query Statistics', href: '/docs/modules/query-statistics' },
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
        image: {
          src: '/use-cases/optional-filter-non-sargable-procedure/01-sqlquerystress-window.png',
          alt: 'SQLQueryStress window running Demo.usp_test_0004 at 1000 iterations × 32 threads',
          width: 1289,
          height: 533,
          caption: 'SQLQueryStress — 1000 iterations × 32 threads; avg logical reads / CPU sec / client sec per iteration.',
        },
      },
      {
        module: 'AI Tune (Object Analysis)',
        action: 'Ran AI Performance Analysis on Demo.usp_test_0004 directly from Object Explorer.',
        signal:
          'Baseline 102.8 ms avg, 19.5 ms CPU, 8,392 logical reads across 32,000 executions. Canonical: POOR_QUERY_DESIGN, OVER_INDEXED, risk HIGH, CPU_BOUND. Primary pathology COMPUTED_PREDICATE_NON_SARGABLE, with warnings for an implicit conversion and a key lookup. Parameter-sniffing rated LOW from a single compiled-plan snapshot.',
        image: {
          src: '/use-cases/optional-filter-non-sargable-procedure/02-ai-tune-report-header.png',
          alt: 'AI Tune object analysis report header for Demo.usp_test_0004, risk HIGH / CPU bound',
          width: 1464,
          height: 697,
          caption: 'AI Tune report header — risk HIGH / CPU bound, 1 Critical / 3 Total Actions, diagnosis confidence 99%.',
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
        module: 'AI Tune (re-analysis)',
        action: "Applied the tool's P1 (OPTION RECOMPILE) unchanged, re-ran the workload, and re-ran AI Performance Analysis to validate before/after.",
        signal:
          'Workload avg logical reads fell from 8,392 to 415 (60,004 executions), but avg duration rose 102.8 → 144.9 ms and CPU 19.5 → 27.5 ms from per-call recompile cost. Risk stayed HIGH, pathology unchanged, and plan-variance signals climbed (plan count 3 → 10, reads-ratio 0.6 → 188.8).',
        image: {
          src: '/use-cases/optional-filter-non-sargable-procedure/04-ai-tune-recompile-actions.png',
          alt: 'AI Tune actions panel on the OPTION (RECOMPILE) version showing root cause and baseline metrics',
          width: 1159,
          height: 530,
          caption: 'AI Tune Actions (P1) on the RECOMPILE version — root cause (Key Lookup + CONVERT_IMPLICIT), baseline avg 415 reads / 145 ms.',
        },
      },
      {
        module: 'Sargability rewrite + AI re-analysis',
        action:
          "Implemented the tool's deeper P1 option as usp_test_0004_v2: parameterized dynamic SQL that adds the @CustomerID predicate only when supplied and skips the LineAmount filter when @MinLineAmount = 0, removing the CAST wrapper from the predicate.",
        signal:
          'Reads stayed low (420), but every instability signal collapsed — duration/CPU variance 126% → 0%, plan-count variance 10 → 0, implicit-conversion signal gone, index health OVER_INDEXED → BALANCED. Warmed plans reused with 0 ms compile. Risk stayed HIGH / POOR_QUERY_DESIGN — the broad scan-and-sort cost is structural.',
        image: {
          src: '/use-cases/optional-filter-non-sargable-procedure/05-ai-tune-v2-test-plan.png',
          alt: 'AI Tune test plan baseline for the v2 sargable rewrite showing stable reads and duration',
          width: 1449,
          height: 694,
          caption: 'AI Tune v2 — Test Plan baseline 130.5 ms / 420 reads / 60,006 executions, plans reused with 0 ms compile.',
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
        kind: 'warning',
        body: 'The tool’s maintenance DDL had a bug — it emitted ALTER INDEX [...] ON [Sales.Customers] (schema and table in one bracket pair), which SQL Server rejects. The index choices were sound once corrected to [Sales].[Customers].',
      },
    ],
    screenshots: [
      {
        src: '/use-cases/optional-filter-non-sargable-procedure/06-ai-tune-v2-canonical.png',
        alt: 'AI Tune v2 canonical classification showing index health BALANCED and risk HIGH',
        width: 1169,
        height: 260,
        caption: 'AI Tune v2 — Canonical Classification: Index Health BALANCED, Stability STABLE, Risk HIGH.',
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
