import type { ReactNode } from 'react'

type PageHeroProps = {
  breadcrumb?: ReactNode
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
}

/**
 * Shared page header panel — the teal gradient banner used across
 * Use Cases, Features, Security, Pricing, Download, and Docs.
 *
 * Fixed minimum height keeps every panel visually identical regardless of
 * content length. Pass `breadcrumb` for nested pages.
 */
export default function PageHero({ breadcrumb, title, description, children }: PageHeroProps) {
  return (
    <section className="relative min-h-[291px] overflow-hidden bg-gradient-to-br from-primary-gradientFrom via-primary to-primary-gradientTo px-6 pt-28 pb-2 lg:px-10">
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/5 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/5 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {breadcrumb ? (
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-white/75">{breadcrumb}</div>
        ) : null}
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white md:text-5xl">{title}</h1>
        {description ? (
          <p className="max-w-3xl text-lg leading-relaxed text-white/85">{description}</p>
        ) : null}
        {children}
      </div>
    </section>
  )
}
