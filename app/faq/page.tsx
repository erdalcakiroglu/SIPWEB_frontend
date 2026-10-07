import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Download, MessageCircle, ShieldCheck } from 'lucide-react'
import Header from '@/components/Header'
import PageHero from '@/components/PageHero'
import Footer from '@/components/Footer'
import FAQExplorer, { type FAQItem } from './FAQExplorer'

export const metadata: Metadata = {
  title: 'FAQ — SQLPerformance AI',
  description:
    'Answers about SQLPerformance AI installation, SQL Server permissions, local and cloud AI, security, trials, licensing, and product workflows.',
  alternates: { canonical: '/faq' },
}

const faqs: FAQItem[] = [
  {
    category: 'Product',
    question: 'What is SQLPerformance AI?',
    answer:
      'SQLPerformance AI is a Windows desktop application for read-only SQL Server diagnostics. It combines deterministic analysis, runtime signals, Query Store evidence, execution plans, and optional AI interpretation to help DBAs investigate performance issues and export evidence-backed reports.',
  },
  {
    category: 'Product',
    question: 'Who is the product designed for?',
    answer:
      'It is designed for DBAs, database developers, engineering teams, and consultants who need to diagnose SQL Server performance, review security signals, or communicate evidence-backed recommendations without deploying an agent or automatically changing production systems.',
  },
  {
    category: 'Product',
    question: 'Which SQL Server workflows are supported?',
    answer:
      'The application includes Dashboard, Query Statistics, Index Advisor, Blocking Analysis, Wait Statistics, Security Audit, Scheduled Jobs, and Object Explorer workflows. Each module focuses on a specific operational question and can export evidence for review.',
  },
  {
    category: 'Product',
    question: 'Does it replace a DBA or automatically tune the database?',
    answer:
      'No. The product is a decision-support and investigation tool. It surfaces evidence, recommendations, and scripts for review; a qualified operator remains responsible for validating and applying any change.',
  },
  {
    category: 'Product',
    question: 'Is this a 24/7 SQL Server monitoring platform?',
    answer:
      'No. SQLPerformance AI is an interactive diagnostic workbench, not a persistent monitoring service. It does not collect data while the desktop application is closed, provide a centralized multi-server operations console, measure SLA or uptime, or replace an enterprise alerting platform. While the application is open and connected, Blocking Analysis can run a periodic check and raise an in-app alert (and an optional webhook). Historical investigation can use evidence already retained by SQL Server Query Store and snapshots created during product use.',
  },
  {
    category: 'Installation',
    question: 'Which operating systems and databases are supported?',
    answer:
      'The desktop application runs on Windows 10 and Windows 11 and targets Microsoft SQL Server environments. See the installation guide for current prerequisites, connection preparation, and first-run setup.',
    link: { href: '/docs/installation', label: 'View installation requirements' },
  },
  {
    category: 'Installation',
    question: 'What SQL Server permissions are required?',
    answer:
      'Use a dedicated diagnostic account with no write access. VIEW SERVER STATE covers core diagnostics. Security Audit also needs VIEW ANY DEFINITION and msdb access, and reading the SQL Server error log works for logins with VIEW SERVER STATE or securityadmin membership, with permission to run sp_readerrorlog. Missing permissions can leave a module’s results incomplete. The installation guide includes a permission script; have your DBA review it before production use.',
    link: { href: '/docs/installation', label: 'Review database permissions' },
  },
  {
    category: 'Installation',
    question: 'Is Query Store required?',
    answer:
      'Query Store is strongly recommended because it provides richer historical evidence, plan history, and workload trends. Some workflows can fall back to live DMV data when Query Store is unavailable, but historical depth and confidence may be more limited.',
  },
  {
    category: 'Installation',
    question: 'Where should I start after installation?',
    answer:
      'Follow Quickstart to configure a SQL connection and AI provider, confirm the active server, database, and LLM in the top bar, then open Dashboard to check that top-level health metrics load correctly. From there, choose the module that matches the issue you are investigating.',
    link: { href: '/docs/quickstart', label: 'Open the quickstart guide' },
  },
  {
    category: 'Security & AI',
    question: 'Does the product change my database?',
    answer:
      'No. The application does not change your user data, schema, indexes, jobs, or server settings, and it does not execute the scripts it generates; those stay under operator control. When an AI answer contains SQL code blocks, the application can send them to SQL Server in parse-only mode (SET PARSEONLY ON) so the server checks the syntax without running them. For its own working data it uses session-scoped temporary tables in tempdb.',
  },
  {
    category: 'Security & AI',
    question: 'Can I keep analysis entirely local?',
    answer:
      'Yes. Local AI through Ollama is the default path and can run without sending prompts or database context to a cloud model. Core analysis, filtering, refresh, and export workflows do not depend on a cloud AI provider. Ollama is installed separately; it is not bundled with the application. The license server is still contacted for trial registration and validation unless you use an offline license file.',
    link: { href: '/security', label: 'Explore the security model' },
  },
  {
    category: 'Security & AI',
    question: 'Which AI providers can I use?',
    answer:
      'You can configure local Ollama or supported hosted providers such as OpenAI, Anthropic, Azure OpenAI, and DeepSeek. Provider availability and settings are managed in the application, and cloud use is optional.',
    link: { href: '/docs/settings', label: 'Configure AI providers' },
  },
  {
    category: 'Security & AI',
    question: 'What happens when I use a cloud AI provider?',
    answer:
      'Cloud AI is used only after you select a provider and add your own API key. In Query Statistics, literal values are redacted by default; if you turn on Show Sensitive Data while a cloud provider is active, the application asks for your approval for the session before sending unredacted text, and the redacted context is sent without a separate prompt. Other modules have no such approval step: Object Explorer only offers comment removal, and Index Advisor has no redaction. There is no automatic PII masking or payload preview, so review your organization’s data policy before enabling a hosted model, or use the local model.',
    link: { href: '/security', label: 'Review data boundaries' },
  },
  {
    category: 'Security & AI',
    question: 'Does the application install agents or persistent collectors?',
    answer:
      'No. SQLPerformance AI is a desktop application. Nothing is installed on your SQL Server hosts, and there is no background service or persistent server-side collector. It reads diagnostic signals when you connect and run or refresh a workflow.',
  },
  {
    category: 'Licensing',
    question: 'How does the free trial work?',
    answer:
      'Every plan includes a 30-day full-feature trial, and no credit card is required to start. Download the application and complete first-run setup; the trial normally registers with your email address, which contacts the license server online and sends a device identifier with it. If the license server cannot be reached, the trial starts locally and is registered when a connection is available.',
    link: { href: '/download', label: 'Download the trial' },
  },
  {
    category: 'Licensing',
    question: 'How are licenses counted?',
    answer:
      'Licensing is per user, not per SQL Server. A licensed user can connect to multiple SQL Server environments. Team and enterprise options provide multiple user licenses for broader rollout.',
    link: { href: '/pricing', label: 'Compare plans' },
  },
  {
    category: 'Licensing',
    question: 'Can I evaluate the product for an enterprise rollout?',
    answer:
      'Yes. Use the trial for technical validation and contact us for procurement, multi-user rollout, or enterprise requirements. We recommend validating permissions, AI policy, and representative workloads as part of the evaluation.',
    link: { href: '/contact', label: 'Discuss an evaluation' },
  },
  {
    category: 'Troubleshooting',
    question: 'Why do I see limited or no historical query data?',
    answer:
      'First check the Query Store Health notification and the warning line above the list, your permissions, the selected server and database, and whether the workload has executed during the available retention period. If Query Store is unavailable, the module may use live DMV data with less historical depth.',
  },
  {
    category: 'Troubleshooting',
    question: 'Why is my local AI model unavailable?',
    answer:
      'Confirm that Ollama is running, the selected model is installed, and the configured host URL is reachable from the desktop application. Then use the provider test in Settings before retrying the analysis.',
    link: { href: '/docs/settings', label: 'Troubleshoot provider settings' },
  },
  {
    category: 'Troubleshooting',
    question: 'Where can I get more help?',
    answer:
      'Use the documentation for setup and workflow guidance. If the issue is not covered, contact us with the product version, affected module, and a concise description of what you expected and observed. Avoid including credentials or sensitive database content.',
    link: { href: '/contact', label: 'Contact support' },
  },
]

export default function FAQPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }

  return (
    <main className="bg-gray-50">
      <Header />
      <PageHero
        title="Answers before you install"
        description="Clear guidance on setup, SQL Server access, security, AI providers, licensing, and day-to-day use."
      >
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/90">
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">Read-only by design</span>
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">Local AI available</span>
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">30-day full trial</span>
        </div>
      </PageHero>

      <section className="px-6 py-12 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: '/docs/quickstart', label: 'Get started', text: 'Install, connect, analyze', icon: BookOpen },
              { href: '/security', label: 'Review security', text: 'Understand data boundaries', icon: ShieldCheck },
              { href: '/download', label: 'Start a trial', text: '30 days, full features', icon: Download },
              { href: '/contact', label: 'Talk to us', text: 'Sales and technical help', icon: MessageCircle },
            ].map(({ href, label, text, icon: Icon }) => (
              <Link key={href} href={href} className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary-dark"><Icon className="h-5 w-5" /></div>
                <div className="flex items-center gap-1 font-semibold text-gray-900">{label}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></div>
                <p className="mt-1 text-sm text-gray-600">{text}</p>
              </Link>
            ))}
          </div>

          <FAQExplorer faqs={faqs} />
        </div>
      </section>

      <section className="border-t border-gray-200 bg-white px-6 py-14 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-3xl bg-slate-900 p-8 text-white shadow-xl md:flex-row md:items-center lg:p-10">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">Still have a question?</p>
            <h2 className="text-2xl font-bold md:text-3xl">Tell us what you are evaluating.</h2>
            <p className="mt-2 max-w-2xl text-slate-300">We can help with installation, security review, licensing, or choosing the right workflow.</p>
          </div>
          <Link href="/contact" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 transition-colors hover:bg-cyan-50">
            Contact us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <Footer />
    </main>
  )
}
