export type DocsPage = {
  slug: string
  /**
   * Short name. Used in the sidebar, the breadcrumb and the "next step" panels,
   * where a long heading would wrap badly, and as the default `h1`.
   */
  title: string
  summary: string
  /**
   * Overrides the visible `<h1>` when the module's own name is not what people
   * search for. "Wait Statistics" is what the tab is called inside the product;
   * "SQL Server Wait Statistics" is what a DBA types into Google. The TechArticle
   * `headline` follows this value, because Google requires marked-up content to
   * match what is visible on the page.
   */
  h1?: string
  /**
   * Complete `<title>` override. The default pattern appends
   * "— Modules — Docs — SQLPerformance AI", which pushes these pages
   * well past the ~60 characters Google renders; on a page written to answer an
   * informational query the words after the truncation point are wasted.
   */
  metaTitle?: string
  /** Short label shown next to the title in the docs sidebar, e.g. "New". */
  badge?: string
}

export const gettingStartedPages: DocsPage[] = [
  {
    // Listed above Overview on purpose: it is the "why" page a first-time visitor
    // reads before the "what it needs" page. The h1 carries the search phrase;
    // the sidebar keeps the short title.
    slug: 'discover',
    title: 'Discover',
    h1: 'SQL Server Performance Tuning for DBAs and Developers',
    metaTitle: 'SQL Server Performance Tuning for DBAs & Developers — SQLPerformance AI',
    summary:
      'What SQLPerformance AI does for a DBA and for a developer, one finding traced from evidence to action, and real analysis reports exported from the app.',
    badge: 'New',
  },
  {
    slug: 'overview',
    title: 'Overview',
    summary:
      'A high-level look at what SQLPerformance AI does, what it needs from SQL Server, where AI is used, and what leaves your machine.',
  },
  {
    slug: 'installation',
    title: 'Installation',
    summary:
      'Install the Windows desktop app, complete first-run onboarding, prepare SQL Server permissions, enable Query Store, and configure Database plus AI / LLM settings.',
  },
  {
    slug: 'quickstart',
    title: 'Quickstart',
    summary:
      'Move from first launch to Database setup, AI / LLM configuration, Dashboard validation, and the first evidence-backed SQL Server analysis.',
  },
  {
    slug: 'settings',
    title: 'Settings',
    summary:
      'Configure SQL Server connections, AI providers and prompt rules, tuning memory, licensing, the local app lock, and analysis thresholds; changes save automatically.',
  },
]

export const modulePages: DocsPage[] = [
  {
    slug: 'dashboard',
    title: 'Dashboard',
    summary:
      'Watch server health, memory, workload, storage I/O, and TempDB for the active connection with manual or automatic refresh, and run a read-only configuration best-practice audit.',
  },
  {
    slug: 'query-statistics',
    title: 'Query Statistics',
    summary:
      'Analyze SQL Server Query Store regressions, execution plans, top-impact queries, and exportable AI tuning reports from one workflow.',
  },
  {
    slug: 'index-advisor',
    title: 'Index Advisor',
    summary:
      'Review SQL Server index health, drop safety, Query Store evidence, and AI-backed maintenance recommendations from one analysis workflow.',
  },
  {
    slug: 'blocking-analysis',
    title: 'Blocking Analysis',
    summary:
      'Trace SQL Server blocking chains, inspect head blockers, review live session impact, and export evidence-backed incident reports from one workflow.',
  },
  {
    slug: 'wait-statistics',
    // This page was briefly titled "SQL Server Wait Statistics — Wait Types
    // Explained", which was the right call on August 15, 2026 *while it was the
    // only page we had on the subject*. It stopped being right the moment
    // /guides/sql-server-wait-statistics went live: two pages opening with the
    // same phrase, on a domain with almost no authority, split one weak signal in
    // half instead of concentrating it. The guide is the designated winner for the
    // subject query — it is vendor-neutral, so it is the one that can attract
    // links — and this page is scoped back to the module it documents. The body
    // text is deliberately left long; depth here does no harm once the titles are
    // no longer competing. Canonicals stay self-referencing: these are two
    // different pages, not duplicates.
    title: 'Wait Statistics',
    h1: 'Wait Statistics Module',
    metaTitle: 'Wait Statistics Module — SQLPerformance AI',
    summary:
      'How the Wait Statistics module collects, filters, baselines and reports SQL Server wait evidence read-only, with a reference for every control on the screen.',
  },
  {
    slug: 'security-audit',
    title: 'Security Audit',
    summary:
      'Audit SQL Server security posture, risky permissions, login inventory, patch status, and exportable compliance-ready findings from one read-only review workflow.',
  },
  {
    slug: 'scheduled-jobs',
    title: 'Scheduled Jobs',
    summary:
      'Review SQL Server Agent jobs, recent failures, schedules, Database Mail issues, and read-only remediation evidence on demand.',
  },
  {
    slug: 'object-explorer',
    title: 'Object Explorer',
    summary:
      'Browse SQL Server procedures, views, functions, and tables, inspect source and cached execution stats, follow PK/FK diagrams and dependency maps, and run AI Tune per object or as a batch.',
  },
]
