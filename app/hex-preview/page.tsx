import type { Metadata } from 'next'
import HexModuleShowcase from '@/components/HexModuleShowcase'

export const metadata: Metadata = {
  title: 'Hex Preview - SQLPerformance AI',
  description: 'Local preview route for the experimental hex module showcase.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/hex-preview',
  },
}

export default function HexPreviewPage() {
  return (
    <main>
      <HexModuleShowcase />
    </main>
  )
}
