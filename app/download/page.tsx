import Link from 'next/link'
import { ArrowUpRight, Check, ShieldCheck, Cpu, Database } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DownloadReleaseDetails from './DownloadReleaseDetails'
import fallbackRelease from './release.json'
import { getServerApiBaseUrl } from '@/lib/serverApiBaseUrl'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Download — SQL Performance Intelligence™',
  description: 'Download the Windows installer for SQL Performance Intelligence. 30-day full-feature trial. Offline-first and read-only by design.',
}

const downloadHighlights = [
  'Windows desktop app',
  'Read-only SQL analysis',
  'No agents',
  'No schema changes',
  'Local LLM supported',
  'No outbound telemetry',
]

type DownloadRelease = typeof fallbackRelease

type DownloadReleaseResult = {
  release: DownloadRelease
  source: 'api' | 'fallback'
}

async function getDownloadRelease(): Promise<DownloadReleaseResult> {
  try {
    const response = await fetch(`${getServerApiBaseUrl(process.env.DOWNLOAD_API_BASE_URL)}/api/download/release`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })

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
    console.error('Download release fetch failed during server render.', error)

    return {
      source: 'fallback',
      release: fallbackRelease,
    }
  }
}

export default async function DownloadPage() {
  const { release, source } = await getDownloadRelease()

  return (
    <main>
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-primary-gradientFrom via-primary to-primary-gradientTo px-6 py-16 pt-32 lg:px-10">
        <div className="absolute inset-0 pointer-events-none bg-grid-pattern opacity-60" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[12%] top-1/4 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-[10%] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-5">
            Download SQL Performance Intelligence™
          </h1>

          <div className="max-w-3xl space-y-3 text-lg leading-relaxed text-white/85">
            <p>Start a 30-day full-feature trial.</p>
            <p>
              Offline-first SQL Server performance diagnostics with AI-assisted analysis.
              No agents. No schema changes. No telemetry.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/downloads/SQL%20Performance%20Intelligence.msi"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cta text-white font-bold rounded-xl shadow-cta hover:bg-cta-hover hover:shadow-cta-hover hover:-translate-y-0.5 transition-all"
            >
              Download SQL Performance Intelligence.msi
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/20 hover:shadow-lg hover:shadow-white/10"
            >
              Installation Guide
            </Link>
          </div>

          <ul className="mt-8 space-y-3 text-white/90">
            {downloadHighlights.map((item) => (
              <li key={item} className="flex items-center gap-3 text-base font-medium">
                <Check className="h-5 w-5 flex-shrink-0 text-emerald-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12 px-6 lg:px-10 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mt-1" />
            <div>
              <div className="font-semibold text-gray-900">Read-Only by Design</div>
              <div className="text-gray-600">No automatic schema changes. No background agents.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Cpu className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <div className="font-semibold text-gray-900">Offline-First Architecture</div>
              <div className="text-gray-600">All analysis remains local unless cloud mode is enabled.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-purple-600 mt-1" />
            <div>
              <div className="font-semibold text-gray-900">Enterprise Compatible</div>
              <div className="text-gray-600">Digitally signed installer. Change-control friendly.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-10 bg-white">
        <div className="max-w-6xl mx-auto space-y-8">
          <DownloadReleaseDetails initialRelease={release} initialSource={source} />
        </div>
      </section>

      <Footer />
    </main>
  )
}
