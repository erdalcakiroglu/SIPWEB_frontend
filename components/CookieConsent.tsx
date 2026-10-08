'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { GA_MEASUREMENT_ID } from '@/lib/analytics'

export const COOKIE_CONSENT_STORAGE_KEY = 'cookie_consent'
const STORAGE_KEY = COOKIE_CONSENT_STORAGE_KEY

type ConsentStatus = 'granted' | 'denied' | null

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

// Accepting grants analytics storage only. The site runs no ads, and the banner
// promises analytics cookies only, so the ad signals stay denied either way.
function updateConsent(analyticsStorage: 'granted' | 'denied') {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('consent', 'update', {
    analytics_storage: analyticsStorage,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
  window.gtag('config', GA_MEASUREMENT_ID)
}

function getStoredConsent(): ConsentStatus {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'granted' || stored === 'denied' ? stored : null
}

function subscribeHydration() {
  return () => {}
}

export default function CookieConsent() {
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false)
  const [statusOverride, setStatusOverride] = useState<ConsentStatus>(null)
  const status = statusOverride ?? (hydrated ? getStoredConsent() : null)

  useEffect(() => {
    if (status === 'granted') {
      updateConsent('granted')
    }
  }, [status])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'granted')
    setStatusOverride('granted')
    updateConsent('granted')
  }

  const reject = () => {
    localStorage.setItem(STORAGE_KEY, 'denied')
    setStatusOverride('denied')
    updateConsent('denied')
  }

  if (!hydrated || status !== null) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-gray-200 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:p-5"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-700">
          This website uses Google Analytics to see which pages are used. Its cookies are set only if you choose Accept; Reject keeps them off. Details are in our{' '}
          <Link href="/cookie-policy" className="font-medium text-primary underline hover:text-primary-dark">
            Cookie Policy
          </Link>
          {' '}and{' '}
          <Link href="/privacy" className="font-medium text-primary underline hover:text-primary-dark">
            Privacy Policy
          </Link>.
        </p>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={reject}
            className="rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-xl bg-cta px-4 py-2.5 text-sm font-semibold text-white shadow-cta transition-colors hover:bg-cta-hover hover:shadow-cta-hover"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

/** Call to reset stored consent and reload so the banner shows again (e.g. "Cookie preferences" in footer). */
export function resetCookieConsentAndReload() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
  window.location.reload()
}
