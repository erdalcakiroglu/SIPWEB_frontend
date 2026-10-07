import Link from 'next/link'
import LightboxImage from './LightboxImage'

const linkClass = 'font-semibold text-primary hover:text-primary-dark'

const modules = [
  {
    name: 'Overview',
    href: '/docs/modules/dashboard',
    detail:
      'Live server health in five panels (Server Health, Memory Health, Workload, Storage & I/O, TempDB) plus a Configuration Audit that runs when you start it.',
  },
  {
    name: 'Query Statistics',
    href: '/docs/modules/query-statistics',
    detail: 'Ranks queries from Query Store, or from the plan cache when Query Store is not usable.',
  },
  {
    name: 'Object Explorer',
    href: '/docs/modules/object-explorer',
    detail: 'Browse database objects with their source code, statistics, and dependencies.',
  },
  {
    name: 'Wait Statistics',
    href: '/docs/modules/wait-statistics',
    detail: 'Groups server waits into categories and adds Query Store wait history where it is available.',
  },
  {
    name: 'Index Advisor',
    href: '/docs/modules/index-advisor',
    detail: 'Scores the indexes of the active database, checks drop safety, and generates scripts for review.',
  },
  {
    name: 'Blocking',
    href: '/docs/modules/blocking-analysis',
    detail: 'Shows live blocking chains, head blockers, and blocked sessions.',
  },
  {
    name: 'Jobs',
    href: '/docs/modules/scheduled-jobs',
    detail: 'SQL Agent job health, failures, schedules, and Database Mail state from msdb.',
  },
  {
    name: 'Security',
    href: '/docs/modules/security-audit',
    detail: 'A security audit of logins, permissions, configuration, and patch level that runs when you start it.',
  },
]

const aiUsage = [
  {
    module: 'Query Statistics',
    detail:
      'Analyze with AI for one query and Analyze Selected with AI for several. Query literals are redacted by default. If you turn on Show Sensitive Data and the provider is not Ollama, the app first asks for consent in a Sensitive Data Consent dialog.',
  },
  {
    module: 'Object Explorer',
    detail: 'AI Performance Analysis for the selected object.',
  },
  {
    module: 'Index Advisor',
    detail:
      'AI analysis for one selected index. Mask names is on by default and masks database, schema, table, and index names; column names and query literals are still sent.',
  },
]

const outbound = [
  {
    name: 'License server',
    detail:
      'https://license.sqlperformance.ai/api, for trial registration, activation, and license validation. Requests carry your email, a device ID (a SHA-256 hash derived from machine identifiers), and platform details. Activation also sends the activation code or your website password, and validation sends the saved license token. The website password is used once and not stored.',
  },
  {
    name: 'Your AI provider',
    detail:
      'Only the provider you configure: Ollama at the host you enter, or the OpenAI, Anthropic, Azure OpenAI, or DeepSeek endpoint. Requests are made when you run an AI analysis or test a provider in Settings.',
  },
  {
    name: 'Blocking webhook',
    detail: 'Only when you turn on Webhook Enabled and save a webhook address in the Blocking module.',
  },
  {
    name: 'Microsoft Learn',
    detail:
      'Security reads the public SQL Server build list from learn.microsoft.com to check the patch level. The result is cached for 24 hours; without access, the app uses the last cached copy or its built-in build catalog.',
  },
  {
    name: 'Help links',
    detail:
      'Some Jobs and Security findings link to Microsoft documentation. These open in your browser only when you click them.',
  },
]

export default function OverviewTemplate() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What This Product Is</h2>
        <p className="text-sm text-gray-700">
          SQLPerformance AI is a Windows desktop application for SQL Server performance and health analysis. It reads
          dynamic management views, catalog views, Query Store, and the SQL Agent tables in msdb, and turns them into
          findings. You can add an AI provider for deeper explanations in three modules. The application does not run
          the scripts it generates and never applies AI recommendations automatically: you review, copy, and run them
          yourself.
        </p>
        <p className="mt-3 text-sm text-gray-700">
          The sidebar lists eight analysis modules and Settings. Each one has its own documentation page:
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm text-gray-700 space-y-1">
          {modules.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className={linkClass}>
                {item.name}
              </Link>
              : {item.detail}
            </li>
          ))}
          <li>
            <Link href="/docs/settings" className={linkClass}>
              Settings
            </Link>
            : database connections, AI / LLM providers, the license, and application preferences.
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Screen Layout</h2>
        <div className="space-y-3 text-sm leading-7 text-gray-700">
          <p>The main window after connecting, with the Overview module open and automatic refresh running.</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Sidebar:</strong> the ANALYSIS caption with Overview, Query Statistics, Object Explorer, Wait
              Statistics, Index Advisor, Blocking, Jobs, Security, and Settings. Overview is highlighted.
            </li>
            <li>
              <strong>Top bar:</strong> the application title, the Server selector (SqlPerformanceAI), the Database
              selector (WideWorldImporters), the Refresh button for the active module, and, cut off at the right edge,
              the gear button that opens Settings.
            </li>
            <li>
              <strong>Module heading:</strong> the Overview title with its one-line description, and the
              module&apos;s own controls: Configuration Audit, the Refresh interval (15 sec), Refresh, and Stop.
            </li>
            <li>
              <strong>Status strip:</strong> Live metrics with the time of the last sample.
            </li>
            <li>
              <strong>Panels:</strong> Server Health, Memory Health (with a 1 critical badge), Workload, Storage &amp;
              I/O, and TempDB.
            </li>
          </ul>
        </div>
        <LightboxImage
          src="/docs/overview/001.png"
          alt="SQLPerformance AI main window with the sidebar module list, the top bar Server and Database selectors, and the Overview module showing Server Health, Memory Health, Workload, Storage and I/O, and TempDB panels"
          width={1890}
          height={947}
          className="mx-auto mt-6 max-w-6xl"
          imageClassName="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-[1.01]"
        />
        <p className="mt-4 text-sm text-gray-700">
          The bottom of the sidebar, not visible in this capture, shows the connection state (a dot whose tooltip
          reads &quot;Database connected&quot; or &quot;Database not connected&quot;), your profile name, and the
          application version. Which modules appear in the sidebar can be changed in Settings &gt; General &gt;
          Navigation Menu.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Before You Start</h2>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">A License or Trial</div>
            <p>
              The first launch starts a 30-day full trial automatically after the license agreement and the local
              access profile. Without an active license or trial, the analysis modules are hidden and only Settings
              remains in the sidebar, with the message &quot;A license is required to use the analysis modules.&quot;
              and an Activate License button.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">A SQL Server Connection</div>
            <p>
              The application does not connect automatically at startup. Connect with the Server selector in the top
              bar or with Connect in Settings &gt; Database. Without a connection, opening a module other than
              Overview or Settings shows &quot;Please connect to a database first.&quot;
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">SQL Server Permissions</div>
            <p>
              Most modules need <span className="font-mono">VIEW SERVER STATE</span>. Per-database analysis needs{' '}
              <span className="font-mono">VIEW DATABASE STATE</span> and{' '}
              <span className="font-mono">VIEW DEFINITION</span>, and Jobs reads msdb. The{' '}
              <Link href="/docs/installation" className={linkClass}>
                installation guide
              </Link>{' '}
              lists the grants per module.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Query Store (Recommended)</div>
            <p>
              Query Statistics prefers Query Store when it is enabled in READ_WRITE mode on SQL Server 2016 or later,
              and falls back to the plan cache otherwise. Index Advisor uses it for the 30-day usage trend and
              dependent queries, and Wait Statistics for wait history on SQL Server 2017 or later.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Where AI Is Used</h2>
        <p className="text-sm text-gray-700">
          AI is optional. Three modules can send analysis context to the provider you configure, and only when you
          start an AI analysis:
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm text-gray-700 space-y-1">
          {aiUsage.map((item) => (
            <li key={item.module}>
              <span className="font-semibold">{item.module}:</span> {item.detail}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-gray-700">
          Overview, Wait Statistics, Blocking, Jobs, and Security do not use an AI provider. Wait Statistics has a
          separate Mask names and statements option, on by default, that applies to its file export. When an AI
          answer contains SQL code, the application submits it to SQL Server with{' '}
          <span className="font-mono">SET PARSEONLY ON</span>, so the server checks the syntax without running it.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Local (Ollama)</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Model requests go only to the Ollama host you enter (default http://localhost:11434).</li>
              <li>Requires a running Ollama service and an installed model.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Cloud (OpenAI, Anthropic, Azure OpenAI, DeepSeek)</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Requires an API key; Azure OpenAI also needs an endpoint and a deployment name.</li>
              <li>Analysis context is sent to that provider when you run an AI analysis.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What Leaves Your Machine</h2>
        <p className="text-sm text-gray-700">
          Apart from the SQL Server connections you make, the application contacts only these destinations:
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm text-gray-700 space-y-1">
          {outbound.map((item) => (
            <li key={item.name}>
              <span className="font-semibold">{item.name}:</span> {item.detail}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-gray-700">
          There is no usage telemetry and no automatic update check. SQL Server passwords and AI API keys are stored
          in Windows Credential Manager, not in the settings files, and API keys are shown masked. The local access
          password is stored as a salted hash.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Recommended First Module Order
        </h2>
        <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
          <li>
            Open{' '}
            <Link href="/docs/modules/dashboard" className={linkClass}>
              Overview
            </Link>{' '}
            to see whether CPU, memory, I/O, or TempDB pressure is already obvious.
          </li>
          <li>
            Open{' '}
            <Link href="/docs/modules/query-statistics" className={linkClass}>
              Query Statistics
            </Link>{' '}
            if the problem looks query-driven.
          </li>
          <li>
            Open{' '}
            <Link href="/docs/modules/object-explorer" className={linkClass}>
              Object Explorer
            </Link>{' '}
            or{' '}
            <Link href="/docs/modules/index-advisor" className={linkClass}>
              Index Advisor
            </Link>{' '}
            when you need one object&apos;s source and statistics or the index picture of a database.
          </li>
          <li>
            Open{' '}
            <Link href="/docs/modules/wait-statistics" className={linkClass}>
              Wait Statistics
            </Link>{' '}
            or{' '}
            <Link href="/docs/modules/blocking-analysis" className={linkClass}>
              Blocking
            </Link>{' '}
            when contention is the main symptom.
          </li>
        </ol>
        <p className="mt-4 text-sm text-gray-700">
          To set the product up, continue with the{' '}
          <Link href="/docs/installation" className={linkClass}>
            installation guide
          </Link>
          , then the{' '}
          <Link href="/docs/quickstart" className={linkClass}>
            quickstart workflow
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
