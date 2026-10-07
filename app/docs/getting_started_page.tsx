import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import PageHero from '@/components/PageHero'
import Footer from '@/components/Footer'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import TechArticleSchema from '@/components/TechArticleSchema'
import { gettingStartedPages } from './data'
import { gettingStartedTemplates } from './templates'
import DocsMobileMenu from './mobile-menu'
import DocsRightMenu from './right_menu'
import DocsNextStep from './next_step'

export type GettingStartedPageProps = {
  slug: string
}

export function getGettingStartedMetadata(slug: string) {
  const normalizedSlug = slug.replace(/_/g, '-')
  const page = gettingStartedPages.find((item) => item.slug === normalizedSlug)

  if (!page) {
    return {
      title: 'Docs — SQLPerformance AI',
      alternates: {
        canonical: '/docs',
      },
    }
  }

  return {
    title: `${page.title} — Docs — SQLPerformance AI`,
    description: page.summary,
    alternates: {
      canonical: `/docs/${page.slug}`,
    },
  }
}

export default function GettingStartedPage({ slug }: GettingStartedPageProps) {
  const normalizedSlug = slug.replace(/_/g, '-')
  const page = gettingStartedPages.find((item) => item.slug === normalizedSlug)
  if (!page) {
    notFound()
  }

  const Template =
    gettingStartedTemplates[page.slug] ?? gettingStartedTemplates[normalizedSlug] ?? DefaultGettingStartedTemplate

  return (
    <main>
      <BreadcrumbSchema
        items={[
          { name: 'Docs', path: '/docs' },
          { name: page.title },
        ]}
      />
      <TechArticleSchema
        headline={page.title}
        description={page.summary}
        path={`/docs/${page.slug}`}
      />
      <Header />

      <PageHero
        breadcrumb={
          <>
            <Link href="/docs" className="hover:text-white">
              Docs
            </Link>
            <span>/</span>
            <span className="font-semibold text-white">{page.title}</span>
          </>
        }
        title={page.title}
        description={page.summary}
      />

      <section className="py-10 px-6 lg:px-10 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <DocsMobileMenu />

          {/* md step added to match app/docs/page.tsx — see the note in
              app/docs/modules/module_page.tsx. Without it an iPad in portrait
              rendered the sidebar as a full-width card above the article. */}
          <div className="grid md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)] gap-8">
            <DocsRightMenu />

            {/* min-w-0 is load-bearing — see the note in app/docs/page.tsx. A grid
                item defaults to min-width:auto and will not shrink below its
                content's intrinsic minimum, so one <pre> with a long command line
                widened this column past the phone viewport and gave the whole page
                a horizontal scrollbar. break-words handles long bare identifiers
                like sys.query_store_runtime_stats_interval and inherits down. */}
            <div className="min-w-0 break-words space-y-10">
              <Template />

              <DocsNextStep slug={page.slug} />

              <div className="flex items-center justify-between text-sm text-gray-500">
                <Link href="/docs" className="hover:text-gray-900">
                  Back to Docs
                </Link>
                <Link href="/download" className="hover:text-gray-900">
                  Download
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function DefaultGettingStartedTemplate() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Overview</div>
        <p className="text-sm text-gray-700">
          Add a concise explanation, key steps, or prerequisites for this topic. Keep it short and action-focused.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Help Content</div>
        <p className="text-sm text-gray-700">
          Drop your help files, screenshots, or longer guides here. This section is intentionally flexible.
        </p>
      </div>
    </div>
  )
}
