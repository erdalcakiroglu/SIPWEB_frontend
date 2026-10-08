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
  // 2026-10-08: home AI report image replaced (old one showed the former name), local-AI and report claims re-verified.
  '': '2026-10-08',
  '/download': '2026-10-08', // 2026-10-08: Edge/SmartScreen steps for the unsigned MSI, guide link to /docs/installation.
  '/docs': '2026-10-08', // 2026-10-08: top-bar text names only the server and database selectors.
  '/pricing': '2026-10-08', // 2026-10-08: per-device licensing, Enterprise extras on request.
  '/use-cases': '2026-10-08', // 2026-10-08: example scenarios labeled, "measured outcome" claim removed.
  '/guides': '2026-08-15',
  // 2026-10-07: blocking-history retention corrected (30 days / 50,000 rows per server).
  // 2026-10-08: offline .lic line no longer says "signed"; Wait Statistics export-masking card added.
  '/security': '2026-10-08',
  // 2026-09-28: module details re-verified against the v1.1.0 desktop UI.
  '/features': '2026-10-04',
  // 2026-10-07: AI data-handling answer updated for Object Explorer and Index Advisor masking.
  '/faq': '2026-10-08', // 2026-10-08: license counting answer is per device; module list, first steps, trial registration and troubleshooting re-checked against v1.1.0.
  '/contact': '2026-06-01',
  // 2026-10-04: product statements corrected (local-first, no send-policy levels).
  // 2026-10-08: website, contact, portal, payment and license-server data added; desktop network calls listed.
  '/privacy': '2026-10-08',
  '/terms': '2026-06-01',
  // 2026-10-08: consent choice is in localStorage, not a cookie; ad signals always denied.
  '/cookie-policy': '2026-10-08',
  // 2026-10-08: Consent Mode cookieless signals before a choice described.
  '/analytics-disclosure': '2026-10-08',
  // 2026-09-28: all docs pages rewritten for the v1.1.0 desktop UI.
  // 2026-10-07: Getting Started pages (overview, installation, quickstart) re-verified against v1.1.0.
  // 2026-10-08: Installation trial-refusal note matches the rebuilt 1.1.0 MSI.
  '/docs/overview': '2026-10-07',
  '/docs/installation': '2026-10-08',
  '/docs/quickstart': '2026-10-07',
  // 2026-10-08: Settings page rewritten against the v1.1.0 settings tree (auto-save, General thresholds,
  // AI / LLM, Tuning Memory, License wizard, Security) with the new screenshot set.
  '/docs/settings': '2026-10-08',
  // 2026-10-07: Dashboard page rewritten against the v1.1.0 Overview screen (28 metrics, refresh
  // model, panel badges, Run Audit flow) with the new screenshot set and a sanitized sample report.
  '/docs/modules/dashboard': '2026-10-07',
  // 2026-10-07: Query Statistics page revisited against the v1.1.0 module (plan selector, batch
  // operations, Query Metrics sidebar, AI analysis limits) with the new cropped screenshot set.
  '/docs/modules/query-statistics': '2026-10-07',
  // 2026-10-07: Index Advisor page rewritten against the v1.1.0 module (action labels, Mask names,
  // action script header and DROP guard, Decision Cockpit) with the new screenshot set.
  '/docs/modules/index-advisor': '2026-10-07',
  '/docs/modules/blocking-analysis': '2026-10-07',
  '/docs/modules/wait-statistics': '2026-10-07',
  // 2026-10-07: Security Audit page rewritten against the v1.1.0 audit engine (scoring caps,
  // measurability, patch status sources, access matrix reload behaviour).
  '/docs/modules/security-audit': '2026-10-07',
  // 2026-10-07: Scheduled Jobs page rewritten against the v1.1.0 Jobs module (refresh model,
  // status and next-run values, failure grouping, mail health) with the new screenshot set.
  '/docs/modules/scheduled-jobs': '2026-10-07',
  '/docs/modules/object-explorer': '2026-10-07',
  // 2026-10-08: cases 1-3 rewritten as labeled example scenarios (no invented numbers, What to Verify,
  // current v1.1.0 screenshots); case 4 images/captions re-checked against the June 26 report files.
  '/use-cases/blocking-storm-head-blocker': '2026-10-08',
  '/use-cases/query-regression-after-plan-change': '2026-10-08',
  '/use-cases/pageiolatch-waits-missing-index': '2026-10-08',
  '/use-cases/optional-filter-non-sargable-procedure': '2026-10-08',
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
