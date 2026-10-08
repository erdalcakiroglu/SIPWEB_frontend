import type { Metadata } from 'next'
import Header from '@/components/Header'
import PageHero from '@/components/PageHero'
import Pricing from '@/components/Pricing'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Pricing - SQLPerformance AI',
  description:
    'SQLPerformance AI pricing for individual DBAs, teams and enterprises. Each license activates on one device, with no limit on SQL Servers. 30-day free trial.',
  alternates: {
    canonical: '/pricing',
  },
}

export default function PricingPage() {
  return (
    <main className="bg-gray-50">
      <Header />
      <PageHero
        title="Simple Per-Device Pricing. No Server Limits."
        description="Each license activates on one device and connects to as many SQL Servers as you need. Every plan starts with a 30-day free trial with full features."
      />
      <Pricing />
      <Footer />
    </main>
  )
}
