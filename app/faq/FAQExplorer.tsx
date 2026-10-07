'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, ChevronDown, Search, X } from 'lucide-react'

export type FAQCategory = 'Product' | 'Installation' | 'Security & AI' | 'Licensing' | 'Troubleshooting'

export type FAQItem = {
  category: FAQCategory
  question: string
  answer: string
  link?: { href: string; label: string }
}

type FAQExplorerProps = { faqs: FAQItem[] }

const categories: Array<'All' | FAQCategory> = ['All', 'Product', 'Installation', 'Security & AI', 'Licensing', 'Troubleshooting']

export default function FAQExplorer({ faqs }: FAQExplorerProps) {
  const [category, setCategory] = useState<(typeof categories)[number]>('All')
  const [query, setQuery] = useState('')

  const visibleFaqs = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('en')
    return faqs.filter((faq) => {
      const inCategory = category === 'All' || faq.category === category
      const matchesQuery = !normalizedQuery || `${faq.question} ${faq.answer}`.toLocaleLowerCase('en').includes(normalizedQuery)
      return inCategory && matchesQuery
    })
  }, [category, faqs, query])

  return (
    <div>
      <div className="mb-8">
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary">FAQ</p>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">Find the answer you need</h2>
          </div>
          <p aria-live="polite" className="text-sm text-gray-500">{visibleFaqs.length} {visibleFaqs.length === 1 ? 'answer' : 'answers'}</p>
        </div>

        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search permissions, Query Store, licensing..."
            aria-label="Search frequently asked questions"
            className="w-full rounded-2xl border border-gray-300 bg-white py-4 pl-12 pr-12 text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
          {query ? (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2" aria-label="FAQ categories">
          {categories.map((item) => {
            const active = category === item
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={active}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${active ? 'bg-primary text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-600 hover:border-primary/40 hover:text-primary-dark'}`}
              >
                {item}
              </button>
            )
          })}
        </div>
      </div>

      {visibleFaqs.length ? (
        <div className="grid items-start gap-4 lg:grid-cols-2">
          {visibleFaqs.map((faq) => (
            <details key={faq.question} className="group rounded-2xl border border-gray-200 bg-white shadow-sm transition-all open:border-primary/30 open:shadow-md">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 font-semibold text-gray-900 marker:content-none md:p-6">
                <span>
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-primary">{faq.category}</span>
                  {faq.question}
                </span>
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition group-open:rotate-180 group-open:bg-primary-light group-open:text-primary-dark">
                  <ChevronDown className="h-4 w-4" />
                </span>
              </summary>
              <div className="border-t border-gray-100 px-5 pb-5 pt-4 text-sm leading-7 text-gray-600 md:px-6 md:pb-6">
                <p>{faq.answer}</p>
                {faq.link ? (
                  <Link href={faq.link.href} className="mt-4 inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:text-primary-dark">
                    {faq.link.label} <ArrowUpRight className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <h3 className="font-semibold text-gray-900">No matching answer found</h3>
          <p className="mt-2 text-sm text-gray-600">Try a broader search or choose a different category.</p>
          <button type="button" onClick={() => { setQuery(''); setCategory('All') }} className="mt-5 rounded-xl bg-primary-light px-4 py-2 text-sm font-semibold text-primary-dark transition hover:bg-cyan-100">Clear filters</button>
        </div>
      )}
    </div>
  )
}
