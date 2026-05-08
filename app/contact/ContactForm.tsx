'use client'

import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'

const reasonCopy = {
  sales: {
    title: 'Sales / Licensing',
    helper: 'Pricing, trial, procurement, enterprise rollout',
  },
  technical: {
    title: 'Technical Support',
    helper: 'Installation, permissions, analysis issues, bug report',
  },
} as const

type ReasonKey = keyof typeof reasonCopy

type SubmissionState =
  | {
      tone: 'success' | 'error'
      message: string
    }
  | null

export default function ContactForm() {
  const [reason, setReason] = useState<ReasonKey>('sales')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionState, setSubmissionState] = useState<SubmissionState>(null)

  const copy = useMemo(() => reasonCopy[reason], [reason])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = Object.fromEntries(formData.entries())

    setIsSubmitting(true)
    setSubmissionState(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          source_page: window.location.href,
        }),
      })

      const data = (await response.json().catch(() => null)) as { message?: string } | null

      if (!response.ok) {
        throw new Error(
          data?.message || 'Unable to send your message right now. Please try again in a few minutes.',
        )
      }

      setSubmissionState({
        tone: 'success',
        message: data?.message || 'Your message has been received. We will reply within 1-2 business days.',
      })
      form.reset()
      setReason('sales')
    } catch (error) {
      setSubmissionState({
        tone: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Unable to send your message right now. Please try again in a few minutes.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200/70 rounded-xl p-5">
      <div className="text-sm font-semibold text-gray-900 mb-1">{copy.title}</div>
      <div className="text-xs text-gray-500 mb-4">{copy.helper}</div>

      {submissionState ? (
        <div
          className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
            submissionState.tone === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-red-200 bg-red-50 text-red-900'
          }`}
          aria-live="polite"
        >
          {submissionState.message}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4" aria-busy={isSubmitting}>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">Contact reason</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setReason('sales')}
              disabled={isSubmitting}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                reason === 'sales'
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              Sales / Licensing
            </button>
            <button
              type="button"
              onClick={() => setReason('technical')}
              disabled={isSubmitting}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                reason === 'technical'
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              Technical Support
            </button>
          </div>
          <input type="hidden" name="reason" value={reason} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Full name</label>
            <input
              type="text"
              name="full_name"
              required
              disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-cta/25"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Work email</label>
            <input
              type="email"
              name="work_email"
              required
              disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-cta/25"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Company <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              name="company"
              disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-cta/25"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              required
              disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-cta/25"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">Message</label>
          <textarea
            name="message"
            rows={5}
            required
            disabled={isSubmitting}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-cta/25"
          />
          <div className="text-xs text-gray-500 mt-2">Paste error snippet (no secrets).</div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Environment <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            name="environment"
            placeholder="SQL Server version / Edition"
            disabled={isSubmitting}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-cta/25"
          />
        </div>

        <div className="hidden">
          <label className="block text-xs font-semibold text-gray-600 mb-2">Website</label>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" disabled={isSubmitting} />
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Do not include passwords, API keys, or sensitive production data. Redact before sending.
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white bg-cta shadow-cta hover:bg-cta-hover hover:shadow-cta-hover hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-cta/35 transition-all"
          >
            {isSubmitting ? 'Sending...' : 'Send message'}
          </button>
          <div className="text-xs text-gray-500">We typically respond within 1-2 business days.</div>
        </div>
      </form>
    </div>
  )
}
