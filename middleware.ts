import { NextRequest, NextResponse } from 'next/server'

/**
 * Host canonicalization: www.sqlperformance.ai -> sqlperformance.ai (301).
 *
 * Why this exists in code even though a Cloudflare redirect rule may also be
 * configured: wrangler.jsonc routes `www.sqlperformance.ai/*` into this same
 * worker, so without this check the www host serves identical content and
 * splits ranking signals (GSC showed www and non-www URLs collecting
 * impressions separately through August 2026). A dashboard rule can be
 * deleted without a trace in the repo; this middleware is the guarantee.
 *
 * 301 (not 307/308) on purpose: search engines consolidate signals onto the
 * target only for permanent redirects. Path and query are preserved.
 */
const CANONICAL_HOST = 'sqlperformance.ai'

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') ?? '').toLowerCase()

  if (host === `www.${CANONICAL_HOST}`) {
    const url = new URL(request.url)
    url.protocol = 'https:'
    url.host = CANONICAL_HOST
    url.port = ''
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  // Run on every path: page routes, docs exports, feeds. Static assets that
  // Cloudflare serves directly from the assets layer bypass the worker (and
  // this middleware) entirely, which is fine - they are not indexable pages.
  matcher: '/:path*',
}
