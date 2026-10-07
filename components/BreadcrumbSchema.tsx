import { SITE_URL } from '@/lib/site'

export type BreadcrumbItem = {
  name: string
  /**
   * Site-relative path, e.g. `/docs`. Omit on the final crumb — schema.org
   * treats a trailing ListItem without `item` as the current page.
   */
  path?: string
}

/**
 * Emits BreadcrumbList JSON-LD.
 *
 * The items passed here must mirror the breadcrumb the user actually sees in
 * `PageHero`. Google's structured data guidelines forbid marking up content
 * that is not visible on the page, so these trails deliberately start at the
 * section (Docs, Use Cases) rather than at a Home crumb that no page renders.
 * Search results show the domain as the root of the trail regardless.
 */
export default function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: `${SITE_URL}${item.path}` } : {}),
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  )
}
