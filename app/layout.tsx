import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import CookieConsent from '@/components/CookieConsent'
import { GA_MEASUREMENT_ID } from '@/lib/analytics'
import { SITE_URL, SITE_NAME, OG_IMAGE } from '@/lib/site'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SQLPerformance AI — Read-Only SQL Server Investigation',
  description: 'Read-only SQL Server performance analyzer for Windows: queries, indexes, blocking, waits, security and Agent jobs. Local AI by default, cloud AI optional.',
  keywords: ['SQL Server', 'DBA', 'performance investigation', 'read-only diagnostics', 'query tuning', 'index advisor'],
  // Deliberately no `alternates.canonical` here. Root metadata is inherited by any page
  // that does not set its own, so a canonical on the layout would point every such page
  // at the homepage. Each route declares its own canonical instead.
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo.png', type: 'image/png', sizes: '256x256' },
    ],
    shortcut: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/logo.png', type: 'image/png', sizes: '256x256' }],
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE_NAME,
    url: SITE_URL,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_IMAGE.url],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // NOTE: aggregateRating was removed on 2026-08-15. It claimed 4.8 from 120 ratings,
  // but no review data exists anywhere in the product or on this site. Google requires
  // rating markup to be backed by real user reviews; unbacked ratings get the whole
  // block ignored and risk a spammy-structured-markup manual action. Do not add it back
  // until there is a real source (in-product reviews, G2, Capterra) to cite.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'SQLPerformance AI',
        // The brand query "sqlperformance" collides with sqlperformance.com, an
        // established SQL Server publication, so the schema `name` is the one
        // spelling used everywhere. The product was renamed from "SQL Performance
        // Intelligence" on 2026-10-04; alternateName keeps the former name tied to
        // this entity so existing search history and inbound links still resolve to
        // it. Do not put the old name back into titles.
        alternateName: ['SQL Performance Intelligence', 'SQL Performance AI'],
        url: SITE_URL,
        // 256x256 as of August 15, 2026. The previous 128px file was the largest
        // PNG we had; the 256px frame was recovered from the desktop app's
        // favicon.ico, which carries nine sizes up to 256. No vector source
        // exists anywhere in the project, so 256 is the honest ceiling — if a
        // larger asset is ever needed, redraw the mark as SVG rather than upscale
        // this one. Keep these numbers in step with the actual file.
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/logo.png`,
          width: 256,
          height: 256,
        },
        // dbperfstudio.com was published here and on the Enterprise CTA until
        // August 15, 2026, when a DNS check showed it is not a registered domain
        // at all — NXDOMAIN on two resolvers and absent from the .com registry.
        // Every Enterprise enquiry sent to it bounced, and anyone could have
        // registered it and started receiving them. The contact address must stay
        // on a domain we actually control.
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'sales',
          email: 'sales@sqlperformance.ai',
          url: `${SITE_URL}/contact`,
        },
        // sameAs is how Google connects this site to the same entity elsewhere, and
        // it is the property the Knowledge Panel reads. Only profiles that identify
        // the *organization* belong here — the LinkedIn link in the footer is a
        // personal profile, so it is deliberately not listed. Add the AlternativeTo
        // and SourceForge listings here once those are live.
        sameAs: ['https://github.com/sqlperformanceai'],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${SITE_URL}/#software`,
        name: 'SQLPerformance AI',
        alternateName: ['SQL Performance Intelligence', 'SQL Performance AI'],
        description: 'Read-only SQL Server performance investigation software with local-first AI analysis and optional cloud AI providers. Runs on Windows 10 and 11.',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Windows 10, Windows 11',
        url: SITE_URL,
        downloadUrl: `${SITE_URL}/download`,
        publisher: { '@id': `${SITE_URL}/#organization` },
        author: { '@id': `${SITE_URL}/#organization` },
        // Subscription licensed per device. Enterprise is quote-only, so it carries no price here.
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: '39',
          highPrice: '119',
          // Two priced plans are listed below. Enterprise is quote-only and has no price to publish.
          offerCount: '2',
          url: `${SITE_URL}/pricing`,
          offers: [
            {
              '@type': 'Offer',
              name: 'Developer',
              url: `${SITE_URL}/pricing`,
              priceCurrency: 'USD',
              price: '39',
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: '39',
                priceCurrency: 'USD',
                referenceQuantity: {
                  '@type': 'QuantitativeValue',
                  value: 1,
                  unitCode: 'MON',
                },
              },
            },
            {
              '@type': 'Offer',
              name: 'Team',
              url: `${SITE_URL}/pricing`,
              priceCurrency: 'USD',
              price: '119',
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: '119',
                priceCurrency: 'USD',
                referenceQuantity: {
                  '@type': 'QuantitativeValue',
                  value: 1,
                  unitCode: 'MON',
                },
              },
            },
          ],
        },
        featureList: [
          'Dashboard',
          'Blocking Analysis',
          'Index Advisor',
          'Query Statistics',
          'Wait Statistics',
          'Scheduled Jobs',
          'Security Audit',
          'Object Explorer',
        ],
      },
    ],
  }

  return (
    <html lang="en" data-scroll-behavior="smooth">
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
