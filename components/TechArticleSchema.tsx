import { SITE_URL, OG_IMAGE } from '@/lib/site'

export type TechArticleSchemaProps = {
  /** Must be the page's visible h1, verbatim. */
  headline: string
  description: string
  /** Site-relative path of the page, e.g. `/docs/modules/query-statistics`. */
  path: string
  /**
   * Whether the article is *about* this product. True for documentation, which
   * describes the software. False for the long-form guides under /guides, whose
   * subject is SQL Server itself — claiming otherwise would be a small lie in the
   * structured data and would blur the topical separation the guides exist to create.
   */
  aboutProduct?: boolean
}

/**
 * Emits TechArticle JSON-LD for a single documentation page.
 *
 * `author` and `publisher` are `@id` references into the Organization block the
 * root layout emits, so the entity is declared once and every docs page points
 * back at the same node rather than restating the brand.
 *
 * There is deliberately no `datePublished` or `dateModified`. The docs pages are
 * React templates with no authoring dates recorded anywhere, and neither the
 * repository nor the deployment history maps cleanly onto when a given page's
 * content was written. Google treats both as recommended, not required; a
 * missing field costs less than an invented one, which would show a false date
 * in search results. Add them only when real per-page dates exist to read from.
 */
export default function TechArticleSchema({
  headline,
  description,
  path,
  aboutProduct = true,
}: TechArticleSchemaProps) {
  const url = `${SITE_URL}${path}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${url}#article`,
    headline,
    description,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    // Same asset the page already declares as its Open Graph image, so the
    // structured data and the share card cannot disagree.
    image: `${SITE_URL}${OG_IMAGE.url}`,
    inLanguage: 'en',
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    ...(aboutProduct ? { about: { '@id': `${SITE_URL}/#software` } } : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  )
}
