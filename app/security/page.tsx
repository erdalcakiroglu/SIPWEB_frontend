import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'
import Header from '@/components/Header'
import PageHero from '@/components/PageHero'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Trust & Security - SQLPerformance AI',
  description:
    'How SQLPerformance AI handles data: what it reads from SQL Server, what stays on your machine, what leaves it when you choose a cloud AI model, and what it contacts for licensing.',
  alternates: {
    canonical: '/security',
  },
}

// Every line here has been checked against the shipping application. Keep it that way:
// if a claim cannot be traced to code, it does not belong on this page. Items that were
// removed because the app does not do them: Send Policy levels, PII masking, payload
// preview, a user audit log, Active Directory / Entra sign-in, "SELECT-only".
const securityControls = [
  'Does not change your user data, schema, jobs or server settings',
  'Generated scripts are never executed by the application',
  'Nothing is installed on your SQL Server hosts',
  'No usage telemetry',
  'Local AI by default; cloud AI is optional and your choice',
  'Saved SQL passwords and AI API keys go to Windows Credential Manager',
  'Scratch data only in session-scoped tempdb tables',
  'Signed offline license files (.lic) are supported',
]

const evidencePoints = [
  'A 77-entry Security Audit control catalog, each entry with a Control ID',
  'Security Audit findings as HTML, Access Matrix as XLSX',
  'CIS, ISO 27001 and NIST 800-53 references',
  'A local-AI option for strict data policies',
]

export default function SecurityPage() {
  return (
    <main className="bg-white">
      <Header />

      <PageHero
        title="Security & Data Handling by Design"
        description="Plain answers to common security-review questions for SQL Server environments: what the application reads, what it writes, what stays on your machine, and what can leave it if you choose a cloud AI model."
      />

      <section className="bg-gray-50 px-6 pb-4 pt-12 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-6xl text-center">
            <h2 className="mb-5 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:whitespace-nowrap">
              Trust posture and data-handling model at a glance
            </h2>
            <p className="text-lg leading-relaxed text-gray-600">
              What the application reads, what it writes, and what can leave your machine.
            </p>
          </div>

          {/* min-w-0 on the cards: a grid item defaults to min-width:auto and will
              not shrink below its content's intrinsic minimum. At 360px these cards
              measured 363px against 312px of available width and pushed the whole
              page into horizontal scroll. Zeroing the minimum lets them wrap; the
              nested grids inside need no change (verified at 360 and 390). */}
          <div className="grid items-stretch gap-6 md:grid-cols-2">
            <div className="flex h-full min-w-0 flex-col rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm">
              <h3 className="mb-5 text-xl font-bold tracking-tight text-gray-900">How data moves</h3>
              <div className="grid flex-grow gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200/80 bg-gray-50/60 p-5">
                  <h4 className="mb-2 text-base font-bold text-gray-900">Local AI (default)</h4>
                  <ul className="space-y-2 text-sm leading-relaxed text-gray-600">
                    <li>The default provider is Ollama, running on a machine you control.</li>
                    <li>With a local model, AI context stays on that machine or network.</li>
                    <li>Ollama is installed separately; it is not bundled with the application.</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-gray-200/80 bg-gray-50/60 p-5">
                  <h4 className="mb-2 text-base font-bold text-gray-900">Cloud AI (optional)</h4>
                  <ul className="space-y-2 text-sm leading-relaxed text-gray-600">
                    <li>Off until you pick a provider and enter your own API key.</li>
                    <li>Providers: OpenAI, Anthropic, Azure OpenAI and DeepSeek.</li>
                    <li>
                      Depending on the module, the context can include query or procedure text, execution plans,
                      parameter values and object names.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex h-full min-w-0 flex-col rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm">
              <h3 className="mb-5 text-xl font-bold tracking-tight text-gray-900">
                What it reads and what it keeps
              </h3>
              <div className="grid flex-grow gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">Reads from SQL Server</h4>
                  <ul className="space-y-2 text-sm leading-relaxed text-gray-600">
                    <li>Query text, execution plans and Query Store metrics.</li>
                    <li>Server and database metadata, jobs, and security configuration.</li>
                    <li>Signals such as waits, IO, CPU, memory grants and blocking.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">Keeps on your machine</h4>
                  <ul className="space-y-2 text-sm leading-relaxed text-gray-600">
                    <li>Connection profiles; passwords and API keys in Windows Credential Manager.</li>
                    <li>Log files and AI request and response files, in plain text.</li>
                    <li>Reports and exports that you create.</li>
                  </ul>
                </div>
              </div>
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
                The collectors query system views, Query Store and metadata, not your tables. Values can still appear
                inside query text, plan XML and parameter values, and those can reach a cloud provider if you choose
                one.
              </div>
            </div>

            <div className="min-w-0 rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm md:col-span-2">
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Security Posture &amp; Design Principles
              </div>
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {Array.from({ length: Math.ceil(securityControls.length / 2) }).map((_, row) => (
                    <tr key={row} className="border-t border-gray-100 first:border-t-0">
                      {securityControls.slice(row * 2, row * 2 + 2).map((item) => (
                        <td key={item} className="w-1/2 py-3 pr-6 align-middle">
                          <span className="inline-flex items-center gap-2.5 text-gray-700">
                            <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                            {item}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-6 pb-4 pt-4 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-5 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Deep-dive controls for security reviews and procurement checks
            </h2>
            <p className="text-lg leading-relaxed text-gray-600">
              The questions that usually come up in a security review, answered in detail.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm md:p-6">
            <div className="divide-y divide-slate-200/80">
              <details open className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-semibold text-gray-900 md:text-lg">
                  <span>LLM Mode Comparison</span>
                  <span className="text-gray-400 transition-transform group-open:rotate-180">▾</span>
                </summary>
                <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Feature</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Local LLM (Ollama)</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Cloud LLM</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="px-4 py-3 font-semibold text-gray-900">Internet needed for AI analysis</td>
                        <td className="px-4 py-3 text-gray-700">No</td>
                        <td className="px-4 py-3 text-gray-700">Yes</td>
                      </tr>
                      <tr className="bg-slate-50/70">
                        <td className="px-4 py-3 font-semibold text-gray-900">Where AI context goes</td>
                        <td className="px-4 py-3 text-gray-700">To the machine or network running Ollama</td>
                        <td className="px-4 py-3 text-gray-700">To the provider you selected</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-gray-900">Fit for strict data policies</td>
                        <td className="px-4 py-3 text-gray-700">AI context stays inside your environment</td>
                        <td className="px-4 py-3 text-gray-700">Depends on your policy and the provider&apos;s terms</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </details>

              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-semibold text-gray-900 md:text-lg">
                  <span>Controls</span>
                  <span className="text-gray-400 transition-transform group-open:rotate-180">▾</span>
                </summary>
                <div className="mt-5 space-y-4">
                  <p className="text-sm leading-relaxed text-gray-600">
                    Redaction and approval before cloud AI are not uniform across the application. This is what each
                    module does today.
                  </p>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200/70 bg-white p-5">
                      <h3 className="mb-2 text-sm font-bold text-gray-900">Query Statistics</h3>
                      <p className="text-sm leading-relaxed text-gray-600">
                        Literal values in query text and plans are redacted by default, and showing sensitive data is
                        off by default. If you turn it on while a cloud provider is active, the application asks for
                        your approval for that session before sending unredacted text. The redacted context goes to
                        the cloud provider without a separate prompt.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/70 bg-white p-5">
                      <h3 className="mb-2 text-sm font-bold text-gray-900">Object Explorer</h3>
                      <p className="text-sm leading-relaxed text-gray-600">
                        Credential values in the source code, such as passwords, tokens and API keys, are masked, and
                        definitions longer than 200,000 characters are cut. The rest of the source, object names, the
                        execution plan and parameter values go as they are, with no approval step. The only option is
                        removing SQL comments, which applies to stored procedures.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/70 bg-white p-5">
                      <h3 className="mb-2 text-sm font-bold text-gray-900">Index Advisor</h3>
                      <p className="text-sm leading-relaxed text-gray-600">
                        Mask names is on by default: database, schema, table and index names are replaced with
                        aliases before sending and restored in the answer. Column names and literal values in up to
                        five dependent Query Store statement excerpts (up to 400 characters each) still go as they
                        are, with no approval step, and turning masking off sends real names. Execution plan XML is
                        not sent. The saved LLM JSON is the masked request; the saved HTML report uses real names.
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">
                    There is no automatic PII masking and no payload preview. If your data policy does not allow a
                    third party to see query text or object names, choose the local model.
                  </p>
                </div>
              </details>

              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-semibold text-gray-900 md:text-lg">
                  <span>Encryption, Network, and Deployment</span>
                  <span className="text-gray-400 transition-transform group-open:rotate-180">▾</span>
                </summary>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200/70 bg-white p-5">
                    <h3 className="mb-2 text-sm font-bold text-gray-900">Encryption</h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      Requests to cloud AI providers and to the license server use HTTPS. SQL Server connection
                      encryption follows the connection profile (Encrypt on, Trust server certificate off by default)
                      and your server&apos;s configuration. With ODBC Driver 18 the client requests encryption as
                      &ldquo;optional&rdquo;, so enable Force Encryption on the server if you need it guaranteed.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200/70 bg-white p-5">
                    <h3 className="mb-2 text-sm font-bold text-gray-900">Network Requirements</h3>
                    <p className="mb-2 text-sm leading-relaxed text-gray-600">
                      Analysis with a local model needs no internet. The application does contact:
                    </p>
                    <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-600">
                      <li>
                        The license server (license.sqlperformance.ai): trial registration with your email address and
                        a device identifier, then validation about every 24 hours.
                      </li>
                      <li>Microsoft Learn (learn.microsoft.com) for SQL Server build information, cached for 24 hours.</li>
                      <li>Your cloud AI provider, only if you enable one.</li>
                      <li>
                        A webhook URL, only if you configure one for blocking alerts. The message carries alert titles,
                        counts and thresholds, not query text or login names.
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-slate-200/70 bg-white p-5">
                    <h3 className="mb-2 text-sm font-bold text-gray-900">Deployment Model</h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      A Windows desktop application. Nothing is installed on your SQL Server hosts. A signed offline
                      license file (.lic) lets it run without contacting the license server. The 30-day trial normally
                      registers online (email address and a device identifier); if the license server cannot be
                      reached, the trial starts locally and is registered when a connection is available. See the{' '}
                      <Link href="/download" className="font-semibold text-primary hover:underline">
                        download page
                      </Link>{' '}
                      for the installer checksum and signing status.
                    </p>
                  </div>
                </div>
              </details>

              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-semibold text-gray-900 md:text-lg">
                  <span>Access, Permissions, and Logs</span>
                  <span className="text-gray-400 transition-transform group-open:rotate-180">▾</span>
                </summary>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200/70 bg-white p-5">
                    <h3 className="mb-2 text-sm font-bold text-gray-900">Minimum permissions</h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      <span className="font-mono">VIEW SERVER STATE</span> covers core diagnostics. Security Audit also
                      needs <span className="font-mono">VIEW ANY DEFINITION</span> and msdb access. Reading the SQL
                      Server error log works for logins with <span className="font-mono">VIEW SERVER STATE</span> or
                      securityadmin membership, with permission to run <span className="font-mono">sp_readerrorlog</span>.
                      Missing permissions can leave a module&apos;s results incomplete.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200/70 bg-white p-5">
                    <h3 className="mb-2 text-sm font-bold text-gray-900">Supported authentication</h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      Windows Authentication (integrated) and SQL Server login. Microsoft Entra ID sign-in and MFA are
                      not supported.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200/70 bg-white p-5">
                    <h3 className="mb-2 text-sm font-bold text-gray-900">Logs on your machine</h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      The application writes ordinary log files and keeps no user-activity audit trail. AI request and
                      response files are stored in plain text under the logs folder and are not cleaned up
                      automatically. They can contain query text, plan XML and parameter values. Blocking Analysis also
                      keeps a local history of blocking snapshots in the same folder (
                      <span className="font-mono">blocking_history.jsonl</span>, kept for 30 days and at most 50,000
                      rows per server), which includes the login, host and program names of head blockers. Protect
                      that folder accordingly.
                    </p>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-6 pb-24 pt-4 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-5 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Evidence you can attach to your own security review
          </h2>
          <p className="mb-10 text-lg leading-relaxed text-gray-600">
            Reports export as HTML, Markdown, CSV, XLSX or JSON, depending on the module. Security Audit findings carry
            framework references for orientation; they are not a certification, and the application is not represented
            as a certified compliance system.
          </p>

          <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {evidencePoints.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200/70 bg-white px-4 py-4 text-sm font-semibold text-gray-800 shadow-sm shadow-slate-200/50"
              >
                {item}
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-600">
            Have a security question this page does not answer?{' '}
            <Link href="/contact" className="font-semibold text-primary hover:underline">
              Contact us
            </Link>
            .
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
