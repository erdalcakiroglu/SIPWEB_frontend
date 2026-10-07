import Link from 'next/link'
import { caseStudies, type CaseStudyCategory } from './data'

const categoryOrder: CaseStudyCategory[] = [
  'Blocking',
  'Query Tuning',
  'Indexing',
  'Waits',
  'Security',
]

export default function UseCasesSidebar({ activeSlug }: { activeSlug?: string }) {
  const grouped = categoryOrder
    .map((category) => ({
      category,
      items: caseStudies.filter((item) => item.category === category),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <aside className="hidden md:block">
      <div className="sticky top-24 rounded-xl border border-gray-200/70 bg-white p-4">
        <Link
          href="/use-cases"
          className="block text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-gray-900"
        >
          All Use Cases
        </Link>

        {grouped.map((group) => (
          <div key={group.category} className="mt-6">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {group.category}
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              {group.items.map((item) => (
                <li key={item.slug}>
                  <Link
                    className={
                      item.slug === activeSlug
                        ? 'font-semibold text-primary'
                        : 'hover:text-gray-900'
                    }
                    href={`/use-cases/${item.slug}`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  )
}
