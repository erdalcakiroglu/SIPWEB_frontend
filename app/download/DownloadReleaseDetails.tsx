'use client'

import { useEffect, useState } from 'react'
import { Info } from 'lucide-react'
import CopyButton from './CopyButton'
import { getClientApiBaseUrl, productionDownloadsBaseUrl } from '@/lib/serverApiBaseUrl'

type DownloadRelease = {
  version: string
  released: string
  sha256: string
}

type Props = {
  initialRelease: DownloadRelease
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

export default function DownloadReleaseDetails({ initialRelease }: Props) {
  const [release, setRelease] = useState(initialRelease)

  useEffect(() => {
    let isCancelled = false

    async function loadLiveRelease() {
      try {
        const response = await fetch(`${getClientApiBaseUrl(productionDownloadsBaseUrl)}/api/download/release`, {
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
      } catch (error) {
        // Expected when the download API is unreachable (e.g. local dev without the
        // backend running). We keep the server-provided release, so this is a
        // warning rather than a hard error.
        console.warn('Live download release fetch failed; keeping initial release.', error)
      }
    }

    loadLiveRelease().catch(() => undefined)

    return () => {
      isCancelled = true
    }
  }, [])

  return (
    <>
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
                certUtil -hashfile &quot;SQL-Performance-Intelligence.msi&quot; SHA256
              </code>
              .
            </li>
            <li>The output hash must match the SHA-256 value shown above exactly.</li>
          </ol>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <code className="flex-1 min-w-0 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs">
              certUtil -hashfile &quot;SQL-Performance-Intelligence.msi&quot; SHA256
            </code>
            <CopyButton
              text='certUtil -hashfile "SQL-Performance-Intelligence.msi" SHA256'
              label="Copy command"
            />
          </div>
        </div>

        {/* "Installer is digitally signed." stood here until 2026-10-04. Both MSIs
            are Authenticode "NotSigned" (verified with Get-AuthenticodeSignature),
            so the claim was false and Windows SmartScreen shows an unknown-publisher
            prompt. Do not restore it unless the installer is actually signed. */}
        <div className="flex items-start gap-2 mt-4 text-sm text-gray-700">
          <Info className="w-5 h-5 text-gray-500 shrink-0" />
          <span>
            The installer is not code-signed, so Windows SmartScreen may show an &quot;unknown publisher&quot; prompt.
            Compare the SHA-256 hash above with your download before you run it.
          </span>
        </div>
      </div>
    </>
  )
}
