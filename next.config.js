/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      // /sample-report was removed on 2026-10-04: it showed an invented report
      // (24 findings, "Compliance 78%", Risk Level) that the application does not
      // produce. A real, anonymized Security Audit export is linked from the
      // Security Audit module page, so the permanent redirect points there and
      // keeps whatever link equity and inbound links the old URL had.
      {
        source: '/sample-report',
        destination: '/docs/modules/security-audit',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/docs/:path*.html',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
      {
        source: '/docs/:path*.md',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
      {
        source: '/docs/:path*.csv',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
      {
        source: '/docs/:path*.json',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
      {
        source: '/docs/:path*.txt',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
