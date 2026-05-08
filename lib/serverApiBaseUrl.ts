const productionDefaultBaseUrl = 'https://license.sqlperformance.ai'
const localDefaultBaseUrl = 'http://localhost:3001'

function normalizeBaseUrl(baseUrl?: string) {
  return baseUrl ? baseUrl.replace(/\/+$/, '') : null
}

export function getServerApiBaseUrl(serviceBaseUrl?: string) {
  const configuredBaseUrl = normalizeBaseUrl(serviceBaseUrl || process.env.API_BASE_URL)

  if (configuredBaseUrl) {
    return configuredBaseUrl
  }

  return process.env.NODE_ENV === 'production' ? productionDefaultBaseUrl : localDefaultBaseUrl
}

export function getClientApiBaseUrl() {
  const configuredBaseUrl = normalizeBaseUrl(
    process.env.NEXT_PUBLIC_DOWNLOAD_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL,
  )

  if (configuredBaseUrl) {
    return configuredBaseUrl
  }

  return process.env.NODE_ENV === 'production' ? productionDefaultBaseUrl : localDefaultBaseUrl
}
