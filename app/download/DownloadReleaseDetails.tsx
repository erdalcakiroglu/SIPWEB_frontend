'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import CopyButton from './CopyButton'
import { getClientApiBaseUrl } from '@/lib/serverApiBaseUrl'

type DownloadRelease = {
  version: string
  released: string
  sha256: string
}

type Props = {
  initialRelease: DownloadRelease
  initialSource: 'api' | 'fallback'
}

function readDownloadRelease(payload: unknown): DownloadRelease | null {
  const candidate = (payload as { downloadRelease?: Record<string, unknown> } | null)?.downloadRelease

  if (!candidate?.version || !candidate?.released) {
    return null
  }

  return {
    version: String(candidate.version),
    released: String(candidate.released),
    sha256: typeof candidate.sha256 === 'string' ? candidate.sha256 : '',
  }
}

export default function DownloadReleaseDetails({ initialRelease, initialSource }: Props) {
  const [release, setRelease] = useState(initialRelease)
  const [source, setSource] = useState<'api' | 'fallback'>(initialSource)
  const [liveFetchFailed, setLiveFetchFailed] = useState(false)

  useEffect(() => {
    let isCancelled = false

    async function loadLiveRelease() {
      try {
        const response = await fetch(`${getClientApiBaseUrl()}/api/download/release`, {
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error(`Download release request failed with ${response.status}`)
        }

        const payload = await response.json()
        const liveRelease = readDownloadRelease(payload)

        if (!liveRelease) {
          throw new Error('Download release payload is incomplete.')
        }

        if (isCancelled) {
          return
        }

        setRelease(liveRelease)
        setSource('api')
        setLiveFetchFailed(false)
      } catch (error) {
        console.error('Live download release fetch failed.', error)

        if (!isCancelled) {
          setLiveFetchFailed(true)
        }
      }
    }

    loadLiveRelease().catch(() => undefined)

    return () => {
      isCancelled = true
    }
  }, [])

  return (
    <>
      {source === 'fallback' && liveFetchFailed ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Live release metadata is temporarily unavailable. The values below may be stale.
        </div>
      ) : null}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Latest Release</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Version</div>
            <div className="text-2xl font-bold text-gray-900">{release.version}</div>
            <div className="text-sm text-gray-500 mt-1">Released: {release.released}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">System Requirements</div>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>✓ Windows 10 (Build 1909+) or Windows 11</li>
              <li>✓ 4GB RAM minimum, 8GB recommended</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">SHA-256 Verification</h3>
        {release.sha256 ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex-1 min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-xs text-gray-700 break-all">
                {release.sha256}
              </div>
              <CopyButton text={release.sha256} label="Copy hash" />
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Compare this hash with the one from your downloaded file to ensure integrity.
            </p>
          </>
        ) : (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            Hash not yet generated. After placing the installer in{' '}
            <code className="bg-amber-100 px-1 rounded">public/downloads/</code>, run{' '}
            <code className="bg-amber-100 px-1 rounded">npm run download:hash</code> and rebuild.
          </p>
        )}

        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">How to verify (Windows)</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>
              Download the installer and note the folder (e.g.{' '}
              <code className="bg-gray-100 px-1 rounded">Downloads</code>).
            </li>
            <li>
              Open Command Prompt or PowerShell and go to that folder, e.g.{' '}
              <code className="bg-gray-100 px-1 rounded">cd %USERPROFILE%\Downloads</code>.
            </li>
            <li>
              Run:{' '}
              <code className="bg-gray-100 px-1 rounded">
                certUtil -hashfile &quot;SQL Performance Intelligence.msi&quot; SHA256
              </code>
              .
            </li>
            <li>The output hash must match the SHA-256 value shown above exactly.</li>
          </ol>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <code className="flex-1 min-w-0 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs">
              certUtil -hashfile &quot;SQL Performance Intelligence.msi&quot; SHA256
            </code>
            <CopyButton
              text='certUtil -hashfile "SQL Performance Intelligence.msi" SHA256'
              label="Copy command"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 text-sm text-gray-700">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          Installer is digitally signed.
        </div>
      </div>
    </>
  )
}
