import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import PageHero from '@/components/PageHero'
import Footer from '@/components/Footer'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import TechArticleSchema from '@/components/TechArticleSchema'
import { modulePages } from '../data'
import { moduleTemplates } from '../templates'
import DocsRightMenu from '../right_menu'
import DocsMobileMenu from '../mobile-menu'
import DocsNextStep from '../next_step'

export type ModulePageProps = {
  slug: string
}

export function getModuleMetadata(slug: string) {
  const normalizedSlug = slug.replace(/_/g, '-')
  const page = modulePages.find((item) => item.slug === normalizedSlug)

  if (!page) {
    return {
      title: 'Modules — Docs — SQLPerformance AI',
      alternates: {
        canonical: '/docs',
      },
    }
  }

  return {
    title: page.metaTitle ?? `${page.title} — Modules — Docs — SQLPerformance AI`,
    description: page.summary,
    alternates: {
      canonical: `/docs/modules/${page.slug}`,
    },
  }
}

export default function ModulePage({ slug }: ModulePageProps) {
  const normalizedSlug = slug.replace(/_/g, '-')
  const page = modulePages.find((item) => item.slug === normalizedSlug)
  if (!page) {
    notFound()
  }

  const Template = moduleTemplates[page.slug] ?? moduleTemplates[normalizedSlug] ?? DefaultModuleTemplate

  // One value for the visible <h1> and for the TechArticle headline. Google treats
  // structured data that does not appear on the page as a violation, so these must
  // never be allowed to drift apart. The breadcrumb and the sidebar deliberately
  // keep the short `title` — a descriptive heading reads badly in a nav list.
  const heading = page.h1 ?? page.title

  return (
    <main>
      <BreadcrumbSchema
        items={[
          { name: 'Docs', path: '/docs' },
          { name: 'Modules', path: '/docs#modules' },
          { name: page.title },
        ]}
      />
      <TechArticleSchema
        headline={heading}
        description={page.summary}
        path={`/docs/modules/${page.slug}`}
      />
      <Header />

      <PageHero
        breadcrumb={
          <>
            <Link href="/docs" className="hover:text-white">
              Docs
            </Link>
            <span>/</span>
            <Link href="/docs#modules" className="hover:text-white">
              Modules
            </Link>
            <span>/</span>
            <span className="font-semibold text-white">{page.title}</span>
          </>
        }
        title={heading}
        description={page.summary}
      />

      <section className="py-10 px-6 lg:px-10 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* The module pages were the only docs pages with no navigation on a
              phone: DocsRightMenu is hidden below md, and unlike /docs and the
              getting-started pages this one never rendered the collapsible menu,
              so the only way out of an 8-page section was "Back to Docs". */}
          <DocsMobileMenu />

          {/* md step added to match app/docs/page.tsx. With only the lg step, an
              iPad in portrait (820px) fell back to one column and rendered the
              sidebar as a full-width card that pushed the article ~330px down the
              page — the width was there for two columns, the layout just never
              asked for them. */}
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

function DefaultModuleTemplate() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Module Summary</div>
        <p className="text-sm text-gray-700">
          Add a short description of what this module analyzes, the inputs it needs, and the outputs it produces.
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
