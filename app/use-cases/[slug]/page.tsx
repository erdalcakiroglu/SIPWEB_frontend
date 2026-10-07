import { caseStudies } from '../data'
import CaseStudyPage, { getCaseStudyMetadata } from '../case_study_page'

export const dynamicParams = true

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params
  const rawSlug = typeof resolvedParams?.slug === 'string' ? resolvedParams.slug : ''
  return getCaseStudyMetadata(rawSlug)
}

export default async function UseCaseDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const rawSlug = typeof resolvedParams?.slug === 'string' ? resolvedParams.slug : ''
  return <CaseStudyPage slug={rawSlug} />
}
