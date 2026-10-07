const productionDefaultBaseUrl = 'https://sqlperformance.ai'
const productionDownloadsBaseUrl = 'https://downloads.sqlperformance.ai'
const localDefaultBaseUrl = 'http://localhost:3001'

function normalizeBaseUrl(baseUrl?: string) {
  return baseUrl ? baseUrl.replace(/\/+$/, '') : null
}

export function getServerApiBaseUrl(serviceBaseUrl?: string, fallbackBaseUrl?: string) {
  const configuredBaseUrl = normalizeBaseUrl(serviceBaseUrl || process.env.API_BASE_URL)

  if (configuredBaseUrl) {
    return configuredBaseUrl
  }

  const productionBaseUrl = normalizeBaseUrl(fallbackBaseUrl) || productionDefaultBaseUrl

  return process.env.NODE_ENV === 'production' ? productionBaseUrl : localDefaultBaseUrl
}

export function getClientApiBaseUrl(fallbackBaseUrl?: string) {
  const configuredBaseUrl = normalizeBaseUrl(
    process.env.NEXT_PUBLIC_DOWNLOAD_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL,
  )

  if (configuredBaseUrl) {
    return configuredBaseUrl
  }

  const productionBaseUrl = normalizeBaseUrl(fallbackBaseUrl) || productionDefaultBaseUrl

  return process.env.NODE_ENV === 'production' ? productionBaseUrl : localDefaultBaseUrl
}

export { productionDownloadsBaseUrl }
