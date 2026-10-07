import Link from 'next/link'
import Header from '@/components/Header'
import PageHero from '@/components/PageHero'
import Footer from '@/components/Footer'
import DocsRightMenu from './right_menu'
import DocsMobileMenu from './mobile-menu'

export const metadata = {
  title: 'Docs — SQLPerformance AI',
  description: 'Install, connect, and run your first analysis with SQLPerformance AI.',
  alternates: {
    canonical: '/docs',
  },
}

export default function DocsPage() {
  return (
    <main>
      <Header />

      <PageHero
        title="Documentation"
        description="Practical setup and module usage guide for SQLPerformance AI — install, connect, and run your first evidence-backed analysis."
      />

      {/* Docs Layout */}
      <section className="py-12 px-6 lg:px-10 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Mobile Menu */}
          <DocsMobileMenu />

          <div className="grid md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)] gap-8">
            <DocsRightMenu />

            {/* min-w-0 is load-bearing. A grid item defaults to min-width:auto, so
                it refuses to shrink below its content's intrinsic minimum — one
                <pre> with a long unwrappable command line was widening this column
                past the viewport and giving the whole page a horizontal scrollbar
                on phones (473px of content in a 390px window). Zeroing the minimum
                lets the column stay at the viewport width and hands the overflow
                back to the <pre>, which already has overflow-x-auto and scrolls on
                its own. break-words does the same job for long bare identifiers
                like sys.query_store_runtime_stats_interval; it inherits, so it
                covers the whole subtree. */}
            <article className="min-w-0 break-words space-y-12">
              {/* Getting Started */}
              <section id="getting-started" className="space-y-6">
                <div id="before-you-begin" className="rounded-xl border border-gray-200 bg-white p-5">
                  <h2 className="text-2xl font-bold mb-3">Before You Begin</h2>
                  <p className="text-sm text-gray-700">
                    Use this page as the navigation hub. For the best user and SEO structure, each guide below has a
                    distinct job:{' '}
                    <Link className="font-semibold text-primary hover:text-primary-dark" href="/docs/overview">
                      Overview
                    </Link>{' '}
                    explains the product,{' '}
                    <Link className="font-semibold text-primary hover:text-primary-dark" href="/docs/installation">
                      Installation
                    </Link>{' '}
                    covers setup and prerequisites, and{' '}
                    <Link className="font-semibold text-primary hover:text-primary-dark" href="/docs/quickstart">
                      Quickstart
                    </Link>{' '}
                    walks through the first working analysis, while{' '}
                    <Link className="font-semibold text-primary hover:text-primary-dark" href="/docs/settings">
                      Settings
                    </Link>{' '}
                    documents the configuration surface that controls SQL, AI, license, and appearance behavior.
                  </p>
                </div>

                <div id="overview" className="space-y-3">
                  <h3 className="text-xl font-semibold">Overview</h3>
                  <p className="text-sm text-gray-700">
                    Read this first if you want to understand what the product does, why Query Store matters, which AI
                    path to choose, and which modules to open first.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                        What it does
                      </div>
                      <ul className="space-y-2">
                        <li>Analyzes SQL Server objects, plans, and query signals.</li>
                        <li>Generates evidence-backed, audit-ready reports.</li>
                        <li>Runs offline by default with Local LLM support.</li>
                      </ul>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                        What it doesn&apos;t do
                      </div>
                      <ul className="space-y-2">
                        <li>No automatic schema changes or auto-apply actions.</li>
                        <li>No agents or collectors on your SQL Server hosts. The app polls only while it is open and connected.</li>
                        <li>No table/row data extraction as a collection step.</li>
                      </ul>
                    </div>
                  </div>
                  <Link className="text-sm font-semibold text-primary hover:text-primary-dark" href="/docs/overview">
                    Read the Overview
                  </Link>
                </div>

                <div id="installation" className="space-y-3">
                  <h3 className="text-xl font-semibold">Installation</h3>
                  <p className="text-sm text-gray-700">
                    Use this guide for Windows installation, first-run onboarding, SQL login preparation, Query Store
                    enablement, and the initial Database plus AI / LLM setup.
                  </p>
                  <pre className="rounded-xl bg-slate-900 text-slate-100 text-xs p-4 overflow-x-auto">
{`# Example silent install (elevated prompt; use your installer's file name)
msiexec /i "path\\to\\installer.msi" /quiet /norestart`}
                  </pre>
                  <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                    <div className="text-xs font-semibold uppercase tracking-wide mb-1">Note</div>
                    The installer is not code-signed. Compare its SHA-256 hash with the value on the Download page before you install.
                  </div>
                  <Link
                    className="text-sm font-semibold text-primary hover:text-primary-dark"
                    href="/docs/installation"
                  >
                    View installation details
                  </Link>
                </div>

                <div id="database-permissions" className="space-y-3">
                  <h3 className="text-xl font-semibold">Database User Permissions</h3>
                  <p className="text-sm text-gray-700">
                    The application operates in <span className="font-semibold">read-only</span> mode. Minimum required
                    permissions may vary by environment; for the exact setup sequence and DBA examples, use the{' '}
                    <Link className="font-semibold text-primary hover:text-primary-dark" href="/docs/installation">
                      installation guide
                    </Link>
                    .
                  </p>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    <div className="text-xs font-semibold uppercase tracking-wide mb-1">Note</div>
                    Grant only required permissions and remove unnecessary privileges.
                  </div>
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                    <li>CONNECT (connection to target database)</li>
                    <li>VIEW SERVER STATE (instance-level performance metrics)</li>
                    <li>VIEW DATABASE STATE (database-level performance metrics)</li>
                    <li>VIEW DEFINITION (procedure/view/function definitions)</li>
                    <li>SELECT on system catalog views (system metadata access)</li>
                  </ul>
                </div>

                <div id="quickstart" className="space-y-3">
                  <h3 className="text-xl font-semibold">Quickstart</h3>
                  <p className="text-sm text-gray-700">
                    Use Quickstart after installation when you want the shortest path to a working SQL connection, a
                    first Dashboard check, and a tested AI provider for AI-assisted analysis.
                  </p>
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                    <div className="text-xs font-semibold uppercase tracking-wide mb-1">Tip</div>
                    Start with Local mode (default). No prompts or context leave your network.
                  </div>
                  <Link className="text-sm font-semibold text-primary hover:text-primary-dark" href="/docs/quickstart">
                    Open the quickstart guide
                  </Link>
                </div>

                <div id="settings" className="space-y-3">
                  <h3 className="text-xl font-semibold">Settings</h3>
                  <p className="text-sm text-gray-700">
                    Use this guide when you need a full explanation of the Settings screen, including SQL connections,
                    AI providers, prompt rules, licensing, local app lock, analysis thresholds, and appearance preferences.
                  </p>
                  <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900">
                    <div className="text-xs font-semibold uppercase tracking-wide mb-1">Best Use</div>
                    Read this after installation if you want to understand what each tab changes before editing
                    advanced options.
                  </div>
                  <Link className="text-sm font-semibold text-primary hover:text-primary-dark" href="/docs/settings">
                    Open the settings guide
                  </Link>
                </div>
              </section>

              {/* Modules */}
              <section id="modules" className="space-y-4">
                <h2 className="text-2xl font-bold">Modules</h2>
                <p className="text-sm text-gray-600">
                  Each module is designed for a specific operational question. Start with the module that matches your immediate need.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-700">
                  <Link
                    href="/docs/modules/dashboard"
                    className="rounded-lg border border-gray-200 bg-white p-4 hover:border-primary hover:shadow-md transition-all"
                  >
                    <div className="font-semibold mb-1">Dashboard</div>
                    <p>Refresh a current snapshot of server health, memory, storage I/O, TempDB, and workload pressure, and audit server configuration against best practices.</p>
                  </Link>
                  <Link
                    href="/docs/modules/query-statistics"
                    className="rounded-lg border border-gray-200 bg-white p-4 hover:border-primary hover:shadow-md transition-all"
                  >
                    <div className="font-semibold mb-1">Query Statistics</div>
                    <p>Analyze high-impact queries with trend, risk, and plan stability indicators.</p>
                  </Link>
                  <Link
                    href="/docs/modules/index-advisor"
                    className="rounded-lg border border-gray-200 bg-white p-4 hover:border-primary hover:shadow-md transition-all"
                  >
                    <div className="font-semibold mb-1">Index Advisor</div>
                    <p>Prioritize index actions, generate maintenance scripts, and export reports.</p>
                  </Link>
                  <Link
                    href="/docs/modules/blocking-analysis"
                    className="rounded-lg border border-gray-200 bg-white p-4 hover:border-primary hover:shadow-md transition-all"
                  >
                    <div className="font-semibold mb-1">Blocking Analysis</div>
                    <p>Visualize blocking chains, identify head blockers, get background blocking alerts, and export incident evidence.</p>
                  </Link>
                  <Link
                    href="/docs/modules/wait-statistics"
                    className="rounded-lg border border-gray-200 bg-white p-4 hover:border-primary hover:shadow-md transition-all"
                  >
                    <div className="font-semibold mb-1">Wait Statistics</div>
                    <p>Categorize waits, set baselines, compare snapshots, and export findings.</p>
                  </Link>
                  <Link
                    href="/docs/modules/security-audit"
                    className="rounded-lg border border-gray-200 bg-white p-4 hover:border-primary hover:shadow-md transition-all"
                  >
                    <div className="font-semibold mb-1">Security Audit</div>
                    <p>Run read-only security checks, review logins and direct permissions, and export HTML and Excel outputs.</p>
                  </Link>
                  <Link
                    href="/docs/modules/scheduled-jobs"
                    className="rounded-lg border border-gray-200 bg-white p-4 hover:border-primary hover:shadow-md transition-all"
                  >
                    <div className="font-semibold mb-1">Scheduled Jobs</div>
                    <p>Track SQL Agent job health, failures, and runtime behavior.</p>
                  </Link>
                  <Link
                    href="/docs/modules/object-explorer"
                    className="rounded-lg border border-gray-200 bg-white p-4 hover:border-primary hover:shadow-md transition-all"
                  >
                    <div className="font-semibold mb-1">Object Explorer</div>
                    <p>Browse procedures, views, functions, and tables, follow PK/FK and dependency diagrams, and run AI Tune per object or as a batch.</p>
                  </Link>
                  <Link
                    href="/docs/settings"
                    className="rounded-lg border border-gray-200 bg-white p-4 hover:border-primary hover:shadow-md transition-all"
                  >
                    <div className="font-semibold mb-1">Settings &amp; Top Bar</div>
                    <p>Manage database, AI / LLM, and license settings, and switch the active server, database, and LLM from the top bar.</p>
                  </Link>
                </div>
              </section>

              <section id="workflow" className="space-y-3">
                <h2 className="text-2xl font-bold">Standard Analysis Workflow</h2>
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                    <li>Connect and verify the active server, database, and LLM in the top bar.</li>
                    <li>Run module-specific analysis (query, index, blocking, waits, or security).</li>
                    <li>Validate evidence and confidence before applying changes.</li>
                    <li>Export report/script outputs for review and audit traceability.</li>
                  </ol>
                </div>
              </section>
            </article>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
