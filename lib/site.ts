/**
 * Canonical origin for the public site.
 *
 * Non-www is authoritative; www 301s to it at the Cloudflare edge, and every
 * route declares a self-referencing canonical against this origin. Use this
 * constant anywhere an absolute URL is needed (structured data, feeds) so the
 * host can never drift back to www.
 */
export const SITE_URL = 'https://sqlperformance.ai'

export const SITE_NAME = 'SQLPerformance AI'

/**
 * Share card used for Open Graph and Twitter.
 *
 * `public/og-image.png` is generated from the site's own brand tokens (the
 * PageHero gradient and grid), so it stays 1200x630 — the size every scraper
 * expects. Resolved against `metadataBase`, so the relative URL is fine.
 *
 * Next merges metadata shallowly: a page that declares its own `openGraph`
 * REPLACES the one from the root layout rather than extending it. Any such page
 * must spread this image in explicitly or it will ship with no share image.
 */
export const OG_IMAGE = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'SQLPerformance AI — private, read-only SQL Server investigation',
}
