import { modulePages } from '../../data'
import ModulePage, { getModuleMetadata } from '../module_page'

export const dynamicParams = true

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return modulePages.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params
  const rawSlug = typeof resolvedParams?.slug === 'string' ? resolvedParams.slug : ''
  return getModuleMetadata(rawSlug)
}

export default async function DocsModulePage({ params }: PageProps) {
  const resolvedParams = await params
  const rawSlug = typeof resolvedParams?.slug === 'string' ? resolvedParams.slug : ''
  return <ModulePage slug={rawSlug} />
}
