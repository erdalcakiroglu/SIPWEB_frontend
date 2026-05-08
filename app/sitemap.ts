import type { MetadataRoute } from 'next'
import { gettingStartedPages, modulePages } from './docs/data'

const baseUrl = 'https://www.sqlperformance.ai'
const lastModified = new Date()

type SitemapEntry = MetadataRoute.Sitemap[number]

function createEntry(
  path: string,
  changeFrequency: SitemapEntry['changeFrequency'],
  priority: number,
): SitemapEntry {
  return {
    url: path ? `${baseUrl}${path}` : baseUrl,
    lastModified,
    changeFrequency,
    priority,
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const mainPages: MetadataRoute.Sitemap = [
    createEntry('', 'weekly', 1.0),
    createEntry('/download', 'monthly', 0.9),
    createEntry('/docs', 'weekly', 0.9),
    createEntry('/security', 'monthly', 0.8),
    createEntry('/features', 'monthly', 0.8),
    createEntry('/faq', 'monthly', 0.7),
    createEntry('/contact', 'monthly', 0.7),
    createEntry('/sample-report', 'monthly', 0.7),
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

  return [...mainPages, ...docsPages, ...docsModulePages]
}
