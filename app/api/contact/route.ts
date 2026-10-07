import { getCloudflareContext } from '@opennextjs/cloudflare'
import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs'

const fallbackMessage = 'Unable to send your message right now. Please try again in a few minutes.'
const productionContactApiBaseUrl = 'https://admin.sqlperformance.ai'
const localContactApiBaseUrl = 'http://localhost:3001'

function normalizeContactApiBaseUrl(value: string) {
  return value.replace(/\/+$/, '').replace(/\/api$/, '')
}

async function readRequestPayload(request: NextRequest) {
  const contentType = request.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return request.json()
  }

  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    const formData = await request.formData()
    return Object.fromEntries(formData.entries())
  }

  return {}
}

async function readResponsePayload(response: Response) {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return response.json().catch(() => null)
  }

  const text = await response.text().catch(() => '')
  return text ? { message: text } : null
}

async function submitViaServiceBinding(payload: unknown, request: NextRequest) {
  const { env } = await getCloudflareContext({ async: true })
  const service = env.SQLPERFORMANCE_API

  if (!service) {
    return null
  }

  return service.fetch(
    new Request('https://sqlperformance-api/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-contact-forwarded-for': request.headers.get('x-forwarded-for') || '',
        'x-contact-origin': request.headers.get('origin') || '',
        'x-contact-referer': request.headers.get('referer') || '',
        'x-contact-user-agent': request.headers.get('user-agent') || '',
      },
      body: JSON.stringify(payload),
    }),
  )
}

export async function POST(request: NextRequest) {
  const payload = await readRequestPayload(request)
  const contactApiBaseUrl = normalizeContactApiBaseUrl((
    process.env.CONTACT_API_BASE_URL ||
    (process.env.NODE_ENV === 'production' ? productionContactApiBaseUrl : localContactApiBaseUrl)
  ))

  try {
    const response =
      (process.env.NODE_ENV === 'production' ? await submitViaServiceBinding(payload, request) : null) ||
      (await fetch(`${contactApiBaseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-contact-forwarded-for': request.headers.get('x-forwarded-for') || '',
          'x-contact-origin': request.headers.get('origin') || '',
          'x-contact-referer': request.headers.get('referer') || '',
          'x-contact-user-agent': request.headers.get('user-agent') || '',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
        signal: AbortSignal.timeout(10_000),
      }))

    const data = (await readResponsePayload(response)) as { message?: string } | null

    return NextResponse.json(
      data ?? {
        message: response.ok
          ? 'Your message has been received. We will reply within 1-2 business days.'
          : fallbackMessage,
      },
      { status: response.status },
    )
  } catch {
    return NextResponse.json(
      {
        message: fallbackMessage,
      },
      { status: 502 },
    )
  }
}
