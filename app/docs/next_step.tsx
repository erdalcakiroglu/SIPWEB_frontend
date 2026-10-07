import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Contextual outbound links from a docs page to /features and /download.
 *
 * The docs tree is the best-ranking part of the site but it used to dead-end:
 * the only route out was a bare "Download" link in the footer row, which passes
 * almost nothing because the anchor text carries no context.
 *
 * The copy is written per slug on purpose. A single block repeated across all
 * twelve pages would read as boilerplate and be discounted accordingly, so each
 * page gets a sentence about its own subject and its own anchor text.
 */
const featureLink = (label: string) => (
  <Link href="/features" className="font-medium text-primary underline-offset-2 hover:underline">
    {label}
  </Link>
)

const downloadLink = (label: string) => (
  <Link href="/download" className="font-medium text-primary underline-offset-2 hover:underline">
    {label}
  </Link>
)

const nextSteps: Record<string, ReactNode> = {
  // Modules
  dashboard: (
    <>
      Dashboard tells you where the pressure is; the other seven modules explain why. See{' '}
      {featureLink('how the investigation modules fit together')}, or {downloadLink('run them against your own instance')}{' '}
      on a 30-day trial.
    </>
  ),
  'query-statistics': (
    <>
      Query tuning is one of eight read-only workflows in the desktop app. Compare it with{' '}
      {featureLink('the index, wait, and blocking modules')}, or {downloadLink('install the Windows app')} and score your
      own queries.
    </>
  ),
  'index-advisor': (
    <>
      Index decisions are safer with query and wait evidence beside them. See{' '}
      {featureLink('what the other modules contribute')}, or {downloadLink('try it on your own database')} for 30 days.
    </>
  ),
  'blocking-analysis': (
    <>
      Blocking is usually a symptom of something else. Review{' '}
      {featureLink('the wait and query modules that explain it')}, or {downloadLink('download the Windows app')} and
      trace a live chain yourself.
    </>
  ),
  'wait-statistics': (
    <>
      Wait analysis is strongest when paired with query and index evidence. See{' '}
      {featureLink('all eight analysis modules')}, or {downloadLink('start a 30-day trial')} and take a baseline of your
      own workload.
    </>
  ),
  'security-audit': (
    <>
      Security Audit is read-only, and so is every other module. See{' '}
      {featureLink('the full read-only feature set')}, or {downloadLink('get the Windows desktop app')} and produce
      evidence from your own server.
    </>
  ),
  'scheduled-jobs': (
    <>
      A failing Agent job often shows up in the workload evidence too. See{' '}
      {featureLink('how the modules cross-reference each other')}, or {downloadLink('install the app')} and review your
      own job history.
    </>
  ),
  'object-explorer': (
    <>
      Object inspection feeds the tuning workflows that follow it. See{' '}
      {featureLink('what each module analyzes')}, or {downloadLink('get the Windows desktop app')} and explore your own
      schema.
    </>
  ),

  // Getting started
  overview: (
    <>
      This page covers the approach; the {featureLink('feature overview')} covers what each of the eight modules
      actually analyzes. When you are ready, {downloadLink('download the Windows desktop app')} and connect a server.
    </>
  ),
  installation: (
    <>
      Installed already? {featureLink('See what each module analyzes')} before your first session, or{' '}
      {downloadLink('get the current build')} if you still need the installer.
    </>
  ),
  quickstart: (
    <>
      After the first analysis, {featureLink('the module overview')} shows which surface to open next. Need the app
      itself? {downloadLink('Download the Windows build')}.
    </>
  ),
  settings: (
    <>
      These settings apply across every module. See {featureLink('what the modules do with them')}, or{' '}
      {downloadLink('install the Windows app')} and configure your own connection.
    </>
  ),
}

export default function DocsNextStep({ slug }: { slug: string }) {
  const copy = nextSteps[slug]
  if (!copy) {
    return null
  }

  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Next step</p>
      <p className="text-sm leading-6 text-gray-700">{copy}</p>
    </aside>
  )
}
