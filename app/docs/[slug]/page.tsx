import { gettingStartedPages } from '../data'
import GettingStartedPage, { getGettingStartedMetadata } from '../getting_started_page'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return gettingStartedPages.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params
  const rawSlug = typeof resolvedParams?.slug === 'string' ? resolvedParams.slug : ''
  return getGettingStartedMetadata(rawSlug)
}

export default async function DocsGettingStartedPage({ params }: PageProps) {
  const resolvedParams = await params
  const rawSlug = typeof resolvedParams?.slug === 'string' ? resolvedParams.slug : ''
  return <GettingStartedPage slug={rawSlug} />
}
