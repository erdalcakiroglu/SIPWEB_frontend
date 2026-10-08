import Link from 'next/link'
import LightboxImage from './LightboxImage'

const linkClass = 'font-semibold text-primary hover:text-primary-dark'

const firstRunSteps = [
  'Run the Windows installer.',
  'Accept the license agreement on first launch.',
  'Create the local access profile with your name, company, email, and an application password.',
  'Let the 30-day full trial start automatically.',
  'Add, test, save, and connect a SQL Server connection in Settings > Database.',
  'If you want AI analysis, add and test an AI provider in Settings > AI / LLM.',
]

const prepChecklist = [
  'The SQL Server host or instance name, and the port if it is not the default',
  'A dedicated SQL login or an approved Windows account with the permissions listed below',
  'The database you want to analyze',
  'A DBA contact for permission grants and Query Store changes',
  'If you want AI analysis: a running Ollama model, or an API key for OpenAI, Anthropic, Azure OpenAI, or DeepSeek',
]

const modulePermissions = [
  {
    module: 'Overview',
    detail:
      'VIEW SERVER STATE for the live panels; a panel shows N/A when its data cannot be read. The Configuration Audit file growth check also needs VIEW ANY DEFINITION.',
  },
  {
    module: 'Query Statistics',
    detail:
      'VIEW SERVER STATE (or VIEW SERVER PERFORMANCE STATE on SQL Server 2022 and later), VIEW DATABASE STATE to read Query Store, and VIEW DEFINITION for object source code.',
  },
  {
    module: 'Object Explorer',
    detail:
      'VIEW DEFINITION to read object source code, VIEW DATABASE STATE for table statistics, and VIEW SERVER STATE for runtime statistics.',
  },
  {
    module: 'Wait Statistics',
    detail: 'VIEW SERVER STATE for wait counters and active waiters, and read access to Query Store for the trend and query context.',
  },
  {
    module: 'Index Advisor',
    detail:
      'VIEW SERVER STATE for index usage statistics and VIEW DATABASE STATE for physical statistics and Query Store evidence in the analyzed database.',
  },
  {
    module: 'Blocking',
    detail: 'VIEW SERVER STATE to read blocking sessions.',
  },
  {
    module: 'Jobs',
    detail: 'SELECT on the SQL Agent and Database Mail tables in msdb (see the script below).',
  },
  {
    module: 'Security',
    detail:
      'Runs with whatever the login can see and reports skipped checks. A sysadmin login gives the most complete result; without sysadmin or VIEW ANY DEFINITION, catalog views can hide principals and permissions.',
  },
]

const sqlUserScript = `-- Example: a dedicated login for SQLPerformance AI
CREATE LOGIN [SQLPerformanceApp] WITH PASSWORD = 'ChangeThisStrongPassword!';
GRANT VIEW SERVER STATE TO [SQLPerformanceApp];
GRANT VIEW ANY DEFINITION TO [SQLPerformanceApp];   -- Configuration Audit file growth, Security

-- Repeat for each database you want to analyze
USE [YourDatabase];
CREATE USER [SQLPerformanceApp] FOR LOGIN [SQLPerformanceApp];
GRANT VIEW DATABASE STATE TO [SQLPerformanceApp];
GRANT VIEW DEFINITION TO [SQLPerformanceApp];

-- Jobs module
USE [msdb];
CREATE USER [SQLPerformanceApp] FOR LOGIN [SQLPerformanceApp];
GRANT SELECT ON dbo.sysjobs TO [SQLPerformanceApp];
GRANT SELECT ON dbo.syscategories TO [SQLPerformanceApp];
GRANT SELECT ON dbo.sysjobactivity TO [SQLPerformanceApp];
GRANT SELECT ON dbo.sysjobhistory TO [SQLPerformanceApp];
GRANT SELECT ON dbo.sysjobservers TO [SQLPerformanceApp];
GRANT SELECT ON dbo.sysjobsteps TO [SQLPerformanceApp];
GRANT SELECT ON dbo.sysjobschedules TO [SQLPerformanceApp];
GRANT SELECT ON dbo.sysschedules TO [SQLPerformanceApp];
GRANT SELECT ON dbo.sysproxies TO [SQLPerformanceApp];
GRANT SELECT ON dbo.sysmail_profile TO [SQLPerformanceApp];
GRANT SELECT ON dbo.sysmail_principalprofile TO [SQLPerformanceApp];
GRANT SELECT ON dbo.sysmail_profileaccount TO [SQLPerformanceApp];
GRANT SELECT ON dbo.sysmail_account TO [SQLPerformanceApp];
GRANT SELECT ON dbo.sysmail_server TO [SQLPerformanceApp];
GRANT SELECT ON dbo.sysmail_unsentitems TO [SQLPerformanceApp];
GRANT SELECT ON dbo.sysmail_sentitems TO [SQLPerformanceApp];
GRANT SELECT ON dbo.sysmail_faileditems TO [SQLPerformanceApp];
GRANT SELECT ON dbo.sysmail_event_log TO [SQLPerformanceApp];`

const queryStoreScript = `ALTER DATABASE [YourDatabase] SET QUERY_STORE = ON;
ALTER DATABASE [YourDatabase] SET QUERY_STORE (
    OPERATION_MODE = READ_WRITE,
    QUERY_CAPTURE_MODE = AUTO,
    CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30),
    DATA_FLUSH_INTERVAL_SECONDS = 900,
    INTERVAL_LENGTH_MINUTES = 15,
    MAX_STORAGE_SIZE_MB = 2048,
    SIZE_BASED_CLEANUP_MODE = AUTO
);

-- SQL Server 2017 and later: also capture wait statistics
-- ALTER DATABASE [YourDatabase] SET QUERY_STORE (WAIT_STATS_CAPTURE_MODE = ON);`

const permissionMessages = [
  'Blocking: "The connected login needs the VIEW SERVER STATE permission to read blocking sessions. Ask your DBA to grant it, then refresh."',
  'Query Statistics: a "Query Store Health: RED | missing VIEW SERVER STATE permission …" notification.',
  'Object Explorer: "The definition is hidden from this login." in place of the source code.',
  'Overview: "Partial sample: … could not be read; those rows show N/A."',
  'Configuration Audit and Security: "Audit completed with skipped checks" with the names of the skipped checks.',
]

const setupIssues = [
  {
    issue: '"WebView2 Runtime Required" at startup',
    fix: 'The Microsoft Edge WebView2 Runtime is missing or older than 86.0.622.0. Choose Yes to open the Microsoft download page, install the runtime, and start the application again.',
  },
  {
    issue: 'Connection Failed',
    fix: 'Re-check the server name, port, authentication mode, and credentials, and confirm that an ODBC driver for SQL Server is installed. Review Encrypt Connection and Trust Server Certificate with your DBA.',
  },
  {
    issue: '"Trial has already been used on this machine."',
    fix: 'Each device gets one trial. Activate a license in Settings > License.',
  },
  {
    issue: 'Only Settings is visible in the sidebar',
    fix: 'No license or trial is active. Use Activate License in the banner or in Settings > License.',
  },
  {
    issue: 'AI provider test fails',
    fix: 'For Ollama, confirm the service is running and the model is installed. For cloud providers, re-check the API key and model name, and for Azure OpenAI the endpoint and deployment.',
  },
]

function StepCard({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{eyebrow}</div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-gray-700">{children}</div>
    </div>
  )
}

export default function InstallationTemplate() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Installation Path</h2>
        <p className="text-sm text-gray-700">
          SQLPerformance AI is ready to use when the desktop application is installed, the first-run setup is
          finished, and a SQL Server connection is active. An AI provider is needed only for the AI analyses.
        </p>
        <p className="mt-3 text-sm text-gray-700">
          For what the product does and what it sends where, read the{' '}
          <Link href="/docs/overview" className={linkClass}>
            overview
          </Link>
          . If installation is already done, continue with the{' '}
          <Link href="/docs/quickstart" className={linkClass}>
            quickstart guide
          </Link>
          .
        </p>
        <ol className="mt-4 list-decimal pl-5 text-sm text-gray-700 space-y-1">
          {firstRunSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Requirements</h2>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
          <li>
            <span className="font-semibold">Microsoft Edge WebView2 Runtime</span> 86.0.622.0 or later. When the
            runtime is missing, the installer downloads and installs it from Microsoft, which needs internet access.
            If it is still missing when the application starts, a &quot;WebView2 Runtime Required&quot; message offers
            to open the Microsoft download page.
          </li>
          <li>
            <span className="font-semibold">An ODBC driver for SQL Server.</span> With ODBC Driver set to Auto-select
            best available, the application uses ODBC Driver 18, 17, or 13 for SQL Server, then SQL Server Native
            Client 11.0, then the legacy SQL Server driver, whichever it finds first. The installer does not install
            an ODBC driver.
          </li>
          <li>
            <span className="font-semibold">Network access</span> to your SQL Server, and HTTPS access to the license
            server for trial registration and activation. If the license server cannot be reached at first launch,
            the trial still starts and is registered later.
          </li>
        </ul>
        <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Have These Ready</div>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          {prepChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <StepCard eyebrow="Step 1" title="Install the Application">
        <p>
          The installer is a Windows Installer (.msi) package with four pages: Welcome, License, Folder, and Ready. It
          installs for all users of the machine, by default into the SQLPerformance AI folder under Program Files
          (x86), and creates a SQLPerformance AI shortcut.
        </p>
        <pre className="rounded-xl bg-slate-900 p-4 text-xs text-slate-100 overflow-x-auto">
{`# Silent install for managed rollout (run from an elevated prompt;
# use the file name of the installer you downloaded)
msiexec /i "path\\to\\installer.msi" /quiet /norestart`}
        </pre>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Upgrade:</strong> installing a newer version replaces the old one and keeps your settings,
            connections, and license.
          </li>
          <li>
            <strong>Older version:</strong> the installer stops with &quot;A newer version of SQLPerformance AI is
            already installed.&quot;
          </li>
          <li>
            <strong>Same package again:</strong> Windows offers to repair or remove the installation.
          </li>
          <li>
            <strong>Uninstall:</strong> removes the program but leaves your data folder (see Where Data Is Stored)
            and the database\sqlperformanceai.sqlite file in the installation folder.
          </li>
        </ul>
      </StepCard>

      <StepCard eyebrow="Step 2" title="Accept the License Agreement">
        <p>
          The first launch opens the License Agreement page (&quot;Scroll through the terms and confirm your acceptance
          to continue.&quot;). Its side panel notes that acceptance is required once per installation and will not be
          shown again.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Jump to end:</strong> scrolls to the end of the terms.
          </li>
          <li>
            <strong>I have read and accept the license agreement:</strong> enables Accept &amp; Continue.
          </li>
          <li>
            <strong>Exit:</strong> closes the application without accepting.
          </li>
        </ul>
      </StepCard>

      <StepCard eyebrow="Step 3" title="Create the Local Access Profile">
        <p>
          Next, the FIRST-RUN SETUP page (&quot;Set up application access&quot;) creates the local identity that
          unlocks this installation. Fill in Full name, Company, Email address, Application password, and Confirm
          password, then click Create Profile.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Password:</strong> at least 6 characters, stored on this machine as a salted hash, never as plain
            text.
          </li>
          <li>
            <strong>Email:</strong> also used as the email for the trial and license.
          </li>
          <li>
            <strong>Later launches:</strong> the LOCAL APP LOCK page (&quot;Welcome back&quot;) asks for the email
            address and password, with a Remember me on this machine option.
          </li>
        </ul>
      </StepCard>

      <StepCard eyebrow="Step 4" title="The 30-Day Full Trial Starts">
        <p>
          After the profile is created, the application starts the 30-day full trial and registers it for this
          device. No activation code or form is needed. A Trial Started notification appears for 15 seconds and the
          main window opens on Settings &gt; Database.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Online:</strong> &quot;Your 30-day full trial is now active.&quot; followed by &quot;Next, add a
            database connection in Settings &gt; Database. After that, go to Settings &gt; AI / LLM and add your LLM
            configuration.&quot;
          </li>
          <li>
            <strong>Offline:</strong> &quot;Your 30-day full trial is active. It will be registered with the license
            server automatically when a connection is available.&quot;
          </li>
          <li>
            <strong>Trial not available:</strong> each device gets one trial. If the license server declines it, a
            &quot;Trial Not Started&quot; warning shows the reason, for example &quot;Trial has already been used on this
            machine.&quot;, and points you to Settings &gt; License to activate with a license.
          </li>
        </ul>
      </StepCard>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Step 5</div>
        <h2 className="text-2xl font-bold text-gray-900">Add Your First SQL Server Connection</h2>
        <div className="mt-3 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="space-y-3 text-sm leading-7 text-gray-700">
            <p>
              In Settings &gt; Database, click Add Connection. The dialog below is filled in for the WideWorldImporters
              demo database; the server name and username are blurred.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Connection:</strong> Connection Name WideWorldImporters, the Server / Instance field, and
                Environment PROD - Production with its red PROD badge.
              </li>
              <li>
                <strong>Port and database:</strong> Port left empty (Optional (e.g. 1433)) and Default Database
                WideWorldImporters.
              </li>
              <li>
                <strong>Sign-in:</strong> SQL Server Authentication with Username, an empty Domain (optional) field,
                and a masked Password.
              </li>
              <li>
                <strong>Driver and options:</strong> ODBC Driver on Auto-select best available, with Encrypt
                Connection and Trust Server Certificate both checked.
              </li>
              <li>
                <strong>Buttons:</strong> Test Connection, Cancel, and Save.
              </li>
            </ul>
          </div>
          <LightboxImage
            src="/docs/installation/001.png"
            alt="Add Connection dialog with connection name, blurred server instance, PROD environment badge, empty port, default database, SQL Server Authentication, blurred username, masked password, ODBC driver auto-select, Encrypt Connection and Trust Server Certificate options, and Test Connection, Cancel and Save buttons"
            width={564}
            height={782}
          />
        </div>
        <ul className="mt-4 list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Use the dedicated login or Windows account prepared by the DBA, not a personal admin account.</li>
          <li>Environment can be DEV, TEST, UAT, PROD, or OTHER; the badge marks the connection everywhere.</li>
          <li>Leave Default Database on master if you will pick the database later from the top bar.</li>
          <li>
            Windows Authentication uses the current Windows session. For SQL Server Authentication, a Domain value is
            sent as DOMAIN\user unless the username already contains \ or @.
          </li>
          <li>
            Encrypt Connection is on and Trust Server Certificate is off by default. Turn on Trust Server Certificate
            only when your environment requires it.
          </li>
          <li>
            Test Connection shows &quot;✅ Connection Successful!&quot; with the server, version, and edition. The
            test does not store the password; Save stores it in Windows Credential Manager.
          </li>
          <li>
            Click Connect on the saved connection. The application confirms with &quot;Successfully connected to
            &lt;name&gt;&quot;.
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Step 6 (Optional)</div>
        <h2 className="text-2xl font-bold text-gray-900">Add Your AI / LLM Provider</h2>
        <div className="mt-3 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="space-y-3 text-sm leading-7 text-gray-700">
            <p>
              In Settings &gt; AI / LLM &gt; Providers, click Add AI Model. This capture shows a DeepSeek provider
              after a successful Test.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Fields:</strong> Provider DeepSeek, Name DeepSeek API, and Model deepseek-v4-pro.
              </li>
              <li>
                <strong>API Key:</strong> masked, with a Show checkbox.
              </li>
              <li>
                <strong>Test result:</strong> &quot;DeepSeek API key valid.&quot; with the model and the available
                models deepseek-v4-flash and deepseek-v4-pro.
              </li>
              <li>
                <strong>Buttons:</strong> Test, Cancel, and Add.
              </li>
            </ul>
          </div>
          <LightboxImage
            src="/docs/installation/002.png"
            alt="Add AI Model dialog with provider DeepSeek, name, model deepseek-v4-pro, masked API key, a successful key validation result listing available models, and Test, Cancel and Add buttons"
            width={650}
            height={585}
          />
        </div>
        <ul className="mt-4 list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>
            Providers: Ollama (local, default host http://localhost:11434), OpenAI, Anthropic, Azure OpenAI, and
            DeepSeek. Azure OpenAI also needs the endpoint and deployment name.
          </li>
          <li>
            The dialog opens with Ollama and the model codellama. The model name stays when you change the provider,
            so enter the model your provider offers.
          </li>
          <li>Click Test, then Add. A provider that was only tested is not saved.</li>
          <li>
            The first provider becomes the default. With more than one, select a provider and click Set Default.
          </li>
          <li>API keys are stored in Windows Credential Manager and shown masked (••••••••) in the list.</li>
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Check That Setup Is Complete</h2>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>The analysis modules are visible in the sidebar (a license or trial is active).</li>
          <li>The connection dot in the sidebar footer shows &quot;Database connected&quot; when you hover over it.</li>
          <li>Overview shows live values in its five panels.</li>
          <li>If you added an AI provider, its Test succeeded and it is the default.</li>
        </ul>
        <p className="mt-4 text-sm text-gray-700">
          Then follow the{' '}
          <Link href="/docs/quickstart" className={linkClass}>
            quickstart guide
          </Link>{' '}
          for the first analysis.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Licensing</h2>
        <p className="text-sm text-gray-700">
          Settings &gt; License shows the current license state. Its main button reads Activate License when no license
          or trial is active and Change License otherwise. It opens a three-step wizard: Method, Details, and Result.
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>
            <strong>Online:</strong> activation code, or your website email and password. The password is used once
            and not saved.
          </li>
          <li>
            <strong>Manual (.lic file):</strong> for machines without internet access.
          </li>
          <li>
            <strong>Free trial:</strong> offered only while this device can still start a trial.
          </li>
          <li>
            <strong>Validation:</strong> the license is checked with the license server at application start once 24
            hours have passed, and whenever you click Check License Now.
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">SQL Server Permissions</h2>
        <p className="text-sm text-gray-700">
          Use a dedicated SQL login or an approved Windows account with only the visibility the modules need. The
          application reads metadata and statistics; it does not need data-changing rights.
        </p>
        <ul className="mt-4 list-disc pl-5 text-sm text-gray-700 space-y-1">
          {modulePermissions.map((item) => (
            <li key={item.module}>
              <span className="font-semibold">{item.module}:</span> {item.detail}
            </li>
          ))}
        </ul>
        <pre className="mt-4 rounded-xl bg-slate-900 p-4 text-xs text-slate-100 overflow-x-auto">{sqlUserScript}</pre>
        <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What Not To Grant</div>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>
            No <span className="font-mono">db_owner</span> and no INSERT, UPDATE, or DELETE rights.
          </li>
          <li>No rights to start, stop, or change SQL Agent jobs.</li>
          <li>No broad access to business tables unless your own policy requires it.</li>
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Query Store Preparation</h2>
        <p className="text-sm text-gray-700">
          Query Store is optional but recommended. Query Statistics uses it when it is enabled in READ_WRITE mode on
          SQL Server 2016 or later, Index Advisor uses it for usage trends and dependent queries, and Wait Statistics
          uses its wait history on SQL Server 2017 or later. The application only reads Query Store; it never changes
          its settings. A DBA can enable it per database:
        </p>
        <pre className="mt-4 rounded-xl bg-slate-900 p-4 text-xs text-slate-100 overflow-x-auto">{queryStoreScript}</pre>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          What Happens If Permissions Are Incomplete
        </h2>
        <p className="text-sm text-gray-700">
          The modules keep working with what the login can see and say what is missing, for example:
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm text-gray-700 space-y-1">
          {permissionMessages.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Where Data Is Stored</h2>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>
            <span className="font-mono">%LOCALAPPDATA%\SQLPerformance AI</span> holds the settings, connection
            profiles, license and trial state, and logs for your Windows user.
          </li>
          <li>
            SQL Server passwords and AI API keys are kept in Windows Credential Manager. Deleting the data folder does
            not remove them.
          </li>
          <li>
            If a previous version stored its data under the earlier product name, the first start copies it to the
            new folder and leaves the old folder in place.
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Common Installation Issues</h2>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
          {setupIssues.map((item) => (
            <li key={item.issue}>
              <span className="font-semibold">{item.issue}:</span> {item.fix}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
