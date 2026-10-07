import { Metadata } from 'next'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import TrustBar from '@/components/TrustBar'
import HomeOverview from '@/components/HomeOverview'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import { SITE_URL, SITE_NAME, OG_IMAGE } from '@/lib/site'

export const metadata: Metadata = {
  // Brand leads, because the homepage's job is to win the "sqlperformance" query
  // (position 11.2, losing to sqlperformance.com). Title tokens are weighted by
  // position, and the brand used to sit last behind a five-word phrase.
  //
  // "Analyzer" is deliberately left to /features. That page owns the
  // "sql server performance analyzer" cluster (~400 impressions across ten
  // queries); the homepage owns the brand plus the bare "sql performance" head
  // term. The product was renamed from "SQL Performance Intelligence" on
  // 2026-10-04: "SQLPerformance" is now one token, so the spaced head term
  // "sql performance" is carried by the description and h1 instead of the brand.
  // Splitting the clusters keeps the two pages from competing for the same term.
  title: 'SQLPerformance AI — Read-Only SQL Server Analyzer',
  description: 'Find the root cause of SQL Server performance problems with interactive, read-only diagnostics for Windows. Local-first analysis; cloud AI is optional.',
  keywords: 'SQL Server, MS SQL Server, Performance Analysis, Query Optimization, Database Tools, Windows',
  alternates: {
    canonical: '/',
  },
  // This replaces the root layout's openGraph outright (Next merges metadata
  // shallowly), so siteName/url/images have to be repeated here.
  openGraph: {
    title: 'SQLPerformance AI',
    description: 'Read-only SQL Server performance investigation for Windows. Local AI by default; cloud AI providers are optional and chosen by you.',
    type: 'website',
    locale: 'en_US',
    siteName: SITE_NAME,
    url: SITE_URL,
    images: [OG_IMAGE],
  },
}

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <TrustBar />
      <HomeOverview />
      <CTA />
      <Footer />
    </main>
  )
}
