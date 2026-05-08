import { NextRequest, NextResponse } from 'next/server'
import { getServerApiBaseUrl } from '@/lib/serverApiBaseUrl'

export const runtime = 'nodejs'

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

export async function POST(request: NextRequest) {
  const payload = await readRequestPayload(request)

  try {
    const response = await fetch(`${getServerApiBaseUrl(process.env.CONTACT_API_BASE_URL)}/api/contact`, {
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
    })

    const data = await response.json().catch(() => null)

    return NextResponse.json(
      data ?? {
        message: response.ok
          ? 'Your message has been received. We will reply within 1-2 business days.'
          : 'Unable to send your message right now.',
      },
      { status: response.status },
    )
  } catch {
    return NextResponse.json(
      {
        message: 'Unable to send your message right now. Please try again in a few minutes.',
      },
      { status: 502 },
    )
  }
}
