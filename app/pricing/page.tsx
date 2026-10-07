import type { Metadata } from 'next'
import Header from '@/components/Header'
import PageHero from '@/components/PageHero'
import Pricing from '@/components/Pricing'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Pricing - SQLPerformance AI',
  description:
    'View SQLPerformance AI pricing plans for individual DBAs, teams, and enterprise SQL Server environments.',
  alternates: {
    canonical: '/pricing',
  },
}

export default function PricingPage() {
  return (
    <main className="bg-gray-50">
      <Header />
      <PageHero
        title="Simple Per-User Pricing. No Server Limits."
        description="One license per user. Connect to multiple SQL Servers per user license — every plan includes a 30-day free trial with full features."
      />
      <Pricing />
      <Footer />
    </main>
  )
}
