/**
 * Long-form technical guides.
 *
 * These are deliberately *not* docs pages. A docs page documents this product: what
 * a module shows, which control does what. A guide answers a SQL Server question
 * that is true whether or not you ever install anything, and stands on its own for
 * a reader who arrived from a search engine and has never heard of us.
 *
 * Keeping them apart also keeps them from competing for the same query. Where a
 * guide and a docs page cover adjacent ground, the guide owns the methodology and
 * the T-SQL, the docs page owns the module, and each links to the other.
 */
export type Guide = {
  slug: string
  /** Short name for cards, the index, and cross-links. */
  title: string
  /** The page's visible h1 and TechArticle headline. */
  h1: string
  /** Complete <title>. Keep under about 60 characters. */
  metaTitle: string
  /** Meta description and the card blurb. Aim for 150–160 characters. */
  summary: string
  /** Rough reading time, shown on the index card. */
  readingTime: string
  topic: string
}

/**
 * Order is reading order, not publication order — the index renders this array
 * directly, and the diagnosis guide is the entry point that sends readers into
 * the others.
 */
export const guides: Guide[] = [
  {
    slug: 'diagnose-sql-server-performance-problems',
    title: 'SQL Server Performance Diagnosis',
    h1: 'How to Diagnose SQL Server Performance Problems',
    metaTitle: 'How to Diagnose SQL Server Performance Problems',
    summary:
      'A repeatable method for diagnosing SQL Server performance problems: scope the symptom, triage in five minutes, then follow CPU, memory, I/O or lock evidence.',
    readingTime: '22 min read',
    topic: 'Diagnostic method',
  },
  {
    slug: 'sql-server-wait-statistics',
    title: 'SQL Server Wait Statistics',
    h1: 'SQL Server Wait Statistics: The Complete Guide',
    metaTitle: 'SQL Server Wait Statistics: The Complete Guide',
    summary:
      'A complete guide to SQL Server wait statistics — the DMVs, the queries to run, how to take a delta, what each major wait type means, and how to act on it.',
    readingTime: '18 min read',
    topic: 'Performance methodology',
  },
]

export function findGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug)
}
