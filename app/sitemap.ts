import type { MetadataRoute } from 'next'
import { gettingStartedPages, modulePages } from './docs/data'
import { caseStudies } from './use-cases/data'
import { guides } from './guides/data'

const baseUrl = 'https://sqlperformance.ai'
type SitemapEntry = MetadataRoute.Sitemap[number]

/**
 * lastmod dates, maintained BY HAND and only for meaningful CONTENT changes.
 *
 * Google ignores changefreq/priority but does read lastmod — as long as it
 * stays honest. Two failure modes to avoid: (1) stamping every page with the
 * build date on each deploy, which claims everything changed always and
 * teaches Google to distrust the field; (2) letting these dates rot after a
 * real edit, which quietly tells Google not to bother recrawling.
 *
 * Rule: when you materially change a page's visible content, update its date
 * here in the same commit. A redesign of shared chrome (header/footer) does
 * not count; new sections, rewritten copy, or corrected facts do.
 *
 * Initial values were derived from each route's source-file mtime on
 * 2026-09-16. DEFAULT_LASTMOD covers any route added later without a date —
 * set to the site-wide content rewrite of 2026-08-15.
 */
const DEFAULT_LASTMOD = '2026-08-15'

const lastModified: Record<string, string> = {
  // 2026-10-04: product renamed to SQLPerformance AI; home, download, features, pricing,
  // FAQ and security copy corrected against the shipping v1.1.0 application.
  '': '2026-10-04',
  '/download': '2026-10-04',
  '/docs': '2026-10-04',
  '/pricing': '2026-10-04',
  '/use-cases': '2026-09-28',
  '/guides': '2026-08-15',
  // 2026-10-07: blocking-history retention corrected (30 days / 50,000 rows per server).
  '/security': '2026-10-07',
  // 2026-09-28: module details re-verified against the v1.1.0 desktop UI.
  '/features': '2026-10-04',
  '/faq': '2026-10-04',
  '/contact': '2026-06-01',
  // 2026-10-04: product statements corrected (local-first, no send-policy levels).
  '/privacy': '2026-10-04',
  '/terms': '2026-06-01',
  '/cookie-policy': '2026-06-01',
  '/analytics-disclosure': '2026-06-01',
  // 2026-09-28: all docs pages rewritten for the v1.1.0 desktop UI.
  '/docs/overview': '2026-09-28',
  '/docs/installation': '2026-09-28',
  '/docs/quickstart': '2026-10-04',
  '/docs/settings': '2026-09-28',
  // 2026-10-07: Dashboard page rewritten against the v1.1.0 Overview screen (28 metrics, refresh
  // model, panel badges, Run Audit flow) with the new screenshot set and a sanitized sample report.
  '/docs/modules/dashboard': '2026-10-07',
  // 2026-10-07: Query Statistics page revisited against the v1.1.0 module (plan selector, batch
  // operations, Query Metrics sidebar, AI analysis limits) with the new cropped screenshot set.
  '/docs/modules/query-statistics': '2026-10-07',
  '/docs/modules/index-advisor': '2026-10-04',
  '/docs/modules/blocking-analysis': '2026-10-07',
  '/docs/modules/wait-statistics': '2026-10-07',
  // 2026-10-07: Security Audit page rewritten against the v1.1.0 audit engine (scoring caps,
  // measurability, patch status sources, access matrix reload behaviour).
  '/docs/modules/security-audit': '2026-10-07',
  // 2026-10-07: Scheduled Jobs page rewritten against the v1.1.0 Jobs module (refresh model,
  // status and next-run values, failure grouping, mail health) with the new screenshot set.
  '/docs/modules/scheduled-jobs': '2026-10-07',
  '/docs/modules/object-explorer': '2026-10-07',
  // 2026-09-28: analysis steps corrected to match what the v1.1.0 app shows.
  '/use-cases/blocking-storm-head-blocker': '2026-09-28',
  '/use-cases/query-regression-after-plan-change': '2026-09-28',
  '/use-cases/pageiolatch-waits-missing-index': '2026-09-28',
  '/use-cases/optional-filter-non-sargable-procedure': '2026-08-26',
  // 2026-09-15: /features backlink added to both guides' Related Reading.
  '/guides/diagnose-sql-server-performance-problems': '2026-09-15',
  '/guides/sql-server-wait-statistics': '2026-09-15',
}

function createEntry(
  path: string,
  changeFrequency: SitemapEntry['changeFrequency'],
  priority: number,
): SitemapEntry {
  return {
    url: path ? `${baseUrl}${path}` : baseUrl,
    lastModified: lastModified[path] ?? DEFAULT_LASTMOD,
    changeFrequency,
    priority,
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const mainPages: MetadataRoute.Sitemap = [
    createEntry('', 'weekly', 1.0),
    createEntry('/download', 'monthly', 0.9),
    createEntry('/docs', 'weekly', 0.9),
    // /pricing was missing here until August 15, 2026 even though it is a real
    // indexable route linked from the header nav, and the AggregateOffer in the
    // root layout names it as the offer URL. Commercial-intent page — keep it high.
    createEntry('/pricing', 'monthly', 0.9),
    createEntry('/use-cases', 'weekly', 0.8),
    // Pillar content. These target informational queries the product pages cannot
    // reach, so they carry the same weight as the docs hub rather than less.
    createEntry('/guides', 'weekly', 0.8),
    createEntry('/security', 'monthly', 0.8),
    createEntry('/features', 'monthly', 0.8),
    createEntry('/faq', 'monthly', 0.7),
    createEntry('/contact', 'monthly', 0.7),
    // /sample-report was removed on 2026-10-04 and now 301-redirects to the Security Audit
    // module page (next.config.js). Do not list it here.
    createEntry('/privacy', 'yearly', 0.5),
    createEntry('/terms', 'yearly', 0.5),
    createEntry('/cookie-policy', 'yearly', 0.5),
    createEntry('/analytics-disclosure', 'yearly', 0.4),
  ]

  const docsPages: MetadataRoute.Sitemap = gettingStartedPages.map(({ slug }) =>
    createEntry(`/docs/${slug}`, 'weekly', 0.8),
  )

  const docsModulePages: MetadataRoute.Sitemap = modulePages.map(({ slug }) =>
    createEntry(`/docs/modules/${slug}`, 'weekly', 0.8),
  )

  const useCasePages: MetadataRoute.Sitemap = caseStudies.map(({ slug }) =>
    createEntry(`/use-cases/${slug}`, 'monthly', 0.7),
  )

  const guidePages: MetadataRoute.Sitemap = guides.map(({ slug }) =>
    createEntry(`/guides/${slug}`, 'monthly', 0.9),
  )

  return [...mainPages, ...docsPages, ...docsModulePages, ...useCasePages, ...guidePages]
}
