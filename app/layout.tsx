import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import CookieConsent from '@/components/CookieConsent'
import { GA_MEASUREMENT_ID } from '@/lib/analytics'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SQL Performance Intelligence™ — Offline, Read-Only SQL Server Performance Intelligence',
  description: 'Identify bottlenecks faster — often in minutes — with evidence-backed recommendations and audit-ready reports.',
  keywords: ['SQL Server', 'DBA', 'performance', 'AI', 'database optimization', 'index advisor'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SQL Performance Intelligence™',
    description: 'Offline, read-only SQL Server performance analysis platform with evidence-backed recommendations and audit-ready reports. Runs on Windows 10 and 11.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Windows',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '120',
    },
    author: {
      '@type': 'Organization',
      name: 'SQL Performance Intelligence™',
    },
    featureList: [
      'Blocking Analysis',
      'Index Advisor',
      'Query Statistics',
      'Wait Statistics',
      'Scheduled Jobs Analysis',
      'Security Audit',
      'Object Explorer',
    ],
  }

  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="I8x-Tnm1LPIDkVL17g3EE8ZIAax_aJn0cEHNJVBmf2c"
        />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                wait_for_update: 500
              });
              gtag('config', '${GA_MEASUREMENT_ID}');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${plusJakarta.className} bg-gray-50 text-gray-900 antialiased`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
