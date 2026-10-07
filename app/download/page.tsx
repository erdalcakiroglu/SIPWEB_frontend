import Link from 'next/link'
import { ArrowUpRight, Download, Monitor, Database, Ban, Lock, Cpu, CloudOff } from 'lucide-react'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import Header from '@/components/Header'
import PageHero from '@/components/PageHero'
import Footer from '@/components/Footer'
import DownloadReleaseDetails from './DownloadReleaseDetails'
import fallbackRelease from './release.json'
import { getServerApiBaseUrl, productionDownloadsBaseUrl } from '@/lib/serverApiBaseUrl'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Download — SQLPerformance AI',
  description: 'Download the Windows installer for SQLPerformance AI. 30-day full-feature trial. Read-only by design, with local AI support and no agents.',
  alternates: {
    canonical: '/download',
  },
}

const downloadFeatures = [
  { icon: Monitor, title: 'Windows desktop app' },
  { icon: Database, title: 'Read-only SQL analysis' },
  { icon: Ban, title: 'No agents' },
  { icon: Lock, title: 'No schema changes' },
  { icon: Cpu, title: 'Local LLM supported' },
  { icon: CloudOff, title: 'No usage telemetry' },
]

type DownloadRelease = typeof fallbackRelease

type DownloadReleaseResult = {
  release: DownloadRelease
  source: 'api' | 'fallback'
}

// In production the website Worker cannot reliably fetch the API over its public
// hostname (same-zone subrequests loop back), so we call the API Worker directly
// through the SQLPERFORMANCE_API service binding. Local dev falls back to a plain
// HTTP fetch against the configured/base API URL.
async function fetchReleaseViaServiceBinding(): Promise<Response | null> {
  const { env } = await getCloudflareContext({ async: true })
  const service = env.SQLPERFORMANCE_API

  if (!service) {
    return null
  }

  return service.fetch(new Request('https://sqlperformance-api/api/download/release'))
}

async function getDownloadRelease(): Promise<DownloadReleaseResult> {
  try {
    const response =
      (process.env.NODE_ENV === 'production' ? await fetchReleaseViaServiceBinding() : null) ||
      (await fetch(`${getServerApiBaseUrl(process.env.DOWNLOAD_API_BASE_URL, productionDownloadsBaseUrl)}/api/download/release`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(10_000),
      }))

    if (!response.ok) {
      throw new Error(`Download release request failed with ${response.status}`)
    }

    const payload = await response.json()
    const downloadRelease = payload?.downloadRelease

    if (!downloadRelease?.version || !downloadRelease?.released) {
      throw new Error('Download release payload is incomplete.')
    }

    return {
      source: 'api',
      release: {
        version: String(downloadRelease.version),
        released: String(downloadRelease.released),
        sha256: typeof downloadRelease.sha256 === 'string' ? downloadRelease.sha256 : '',
      },
    }
  } catch (error) {
    // Expected when the download API is unreachable (e.g. local dev without the
    // backend running). The page still renders with the bundled fallback release,
    // so this is a warning, not a hard error.
    console.warn('Download release fetch failed during server render; using fallback.', error)

    return {
      source: 'fallback',
      release: fallbackRelease,
    }
  }
}

export default async function DownloadPage() {
  const { release } = await getDownloadRelease()

  return (
    <main>
      <Header />

      <PageHero
        title="Download SQLPerformance AI"
        description="Start a 30-day full-feature trial. Read-only SQL Server diagnostics with AI-assisted analysis — local AI supported, no agents, no schema changes, no usage telemetry."
      />

      <section className="bg-white px-6 pt-12 pb-4 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-x-auto rounded-2xl border border-gray-200/80 shadow-sm">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-3 font-semibold">Application</th>
                  <th className="px-5 py-3 font-semibold">Version</th>
                  <th className="px-5 py-3 font-semibold">Download</th>
                  <th className="px-5 py-3 font-semibold">Installation Guide</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-5 py-4 align-middle">
                    <div className="font-semibold text-gray-900">SQLPerformance AI</div>
                    <div className="mt-0.5 text-xs text-gray-500">Windows 10 (1909+) / 11 · .msi</div>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <div className="font-semibold text-gray-900">{release.version}</div>
                    <div className="mt-0.5 text-xs text-gray-500">Released {release.released}</div>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <Link
                      href="https://downloads.sqlperformance.ai/SQLPerformance-AI.msi"
                      className="inline-flex items-center gap-1.5 font-semibold text-primary transition-colors hover:text-primary-dark"
                    >
                      <Download className="h-4 w-4" />
                      Download .msi
                    </Link>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <Link
                      href="/docs"
                      className="inline-flex items-center gap-1.5 font-semibold text-primary transition-colors hover:text-primary-dark"
                    >
                      Installation Guide
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="pt-4 pb-16 px-6 lg:px-10 bg-white">
        <div className="max-w-6xl mx-auto space-y-8">
          <DownloadReleaseDetails initialRelease={release} />
        </div>
      </section>

      <section className="bg-white px-6 pb-16 lg:px-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {downloadFeatures.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-5"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <div className="font-semibold text-gray-900">{item.title}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
