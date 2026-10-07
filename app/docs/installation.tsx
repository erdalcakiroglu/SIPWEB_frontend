import Link from 'next/link'
import LightboxImage from './LightboxImage'

const firstRunSteps = [
  'Install the Windows desktop application.',
  'Accept the license agreement on first launch.',
  'Create the local application access profile with name, company, email, and password.',
  'Let the 30-day full trial start automatically.',
  'Add, test, save, and connect a database connection in Settings > Database.',
  'Add and test an AI model in Settings > AI / LLM.',
]

const prepChecklist = [
  'A reachable SQL Server host or instance name',
  'The correct SQL port if it is not 1433',
  'A dedicated application SQL login or approved Windows account',
  'A target database name',
  'A DBA contact for permissions or Query Store changes',
  'A decision on local or cloud AI / LLM usage',
]

const validationChecklist = [
  'Application launches successfully',
  'License agreement and first-run access setup complete successfully',
  'Trial Started message appears and the app opens Settings > Database',
  'At least one saved connection exists and Test Connection passes',
  'The connection is active (Connect in Settings > Database, or the Server selector in the top bar)',
  'One AI model passes Test and appears as the default provider',
  'Dashboard loads data and the top bar Refresh button updates it',
]

const incompletePermissionExamples = [
  'Query Statistics may fall back from Query Store to DMV-based analysis.',
  'Scheduled Jobs can lose some live running-job visibility if msdb access is limited.',
  'Security Audit can return partial findings when server-level visibility is restricted.',
  'Execution-plan and object-definition workflows can be limited if metadata access is incomplete.',
]

const setupIssues = [
  'SQL Server host or instance is unreachable',
  'Login fails because authentication mode or credentials are incorrect',
  'Target database is not visible or not online',
  'Query Store is disabled for the database you expect to analyze',
  'The dedicated application login is missing required permissions',
  'Cloud provider API key, endpoint, or deployment name is incorrect',
]

const onboardingScreens = [
  {
    eyebrow: 'Step 1',
    title: 'Accept the License Agreement',
    body:
      'On the first launch, a separate startup window opens the License Agreement with a table of contents and a Jump to end shortcut. Review the terms, check "I have read and accept the license agreement", and click Accept & Continue (Exit closes the application). Acceptance is required once per installation and is not shown again afterwards.',
    image: '/docs/installation/license-agreement-first-run.png',
    alt: 'First-launch License Agreement window with table of contents, acceptance checkbox, and Accept & Continue button',
    caption: 'The first-run flow begins with the License Agreement in its own startup window.',
  },
  {
    eyebrow: 'Step 2',
    title: 'Create the Initial Access Profile',
    body:
      'After accepting the license, the Set up application access screen asks for Full name, Company, Email address, an Application password of at least 6 characters, and Confirm password. Click Create Profile. The password is stored on this machine as a salted hash, never as plain text, and unlocks the application on later launches through the Welcome back sign-in screen, which also offers Remember me on this machine. Keep the password with the user or admin who owns the installation.',
    image: '/docs/installation/initial-access-setup.png',
    alt: 'Set up application access screen asking for full name, company, email address, application password, and confirm password',
    caption: 'First-run setup creates the local identity and app lock password.',
  },
  {
    eyebrow: 'Step 3',
    title: 'Start the 30-Day Full Trial',
    body:
      'Once the profile is created, the application starts the 30-day full trial automatically and registers it for this machine with your email. No activation code or registration form is required. If the license server cannot be reached, the trial still starts and registration is completed later. A Trial Started message points to the next steps, and the main window opens on Settings > Database.',
    image: '/docs/installation/trial-started-next-steps.png',
    alt: 'Trial Started message showing that the 30-day full trial is active, with next steps for Settings Database and Settings AI / LLM',
    caption: 'The trial starts automatically and the app opens Settings > Database.',
  },
]

const sqlUserScript = `-- Example: create a dedicated application login
CREATE LOGIN [SQLPerformanceApp] WITH PASSWORD = 'ChangeThisStrongPassword!';
GRANT VIEW SERVER STATE TO [SQLPerformanceApp];

USE [YourDatabase];
CREATE USER [SQLPerformanceApp] FOR LOGIN [SQLPerformanceApp];
GRANT CONNECT TO [SQLPerformanceApp];
GRANT VIEW DATABASE STATE TO [SQLPerformanceApp];
GRANT VIEW DEFINITION TO [SQLPerformanceApp];

USE [msdb];
CREATE USER [SQLPerformanceApp] FOR LOGIN [SQLPerformanceApp];
GRANT SELECT ON dbo.sysjobs TO [SQLPerformanceApp];
GRANT SELECT ON dbo.sysjobactivity TO [SQLPerformanceApp];
GRANT SELECT ON dbo.sysjobhistory TO [SQLPerformanceApp];`

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

-- Optional on supported SQL Server versions:
-- ALTER DATABASE [YourDatabase] SET QUERY_STORE (WAIT_STATS_CAPTURE_MODE = ON);`

function ScreenshotCard({
  eyebrow,
  title,
  body,
  image,
  alt,
  caption,
}: {
  eyebrow: string
  title: string
  body: string
  image: string
  alt: string
  caption: string
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{eyebrow}</div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm leading-7 text-gray-700">{body}</p>
          <p className="text-sm font-medium text-gray-600">{caption}</p>
        </div>
        <LightboxImage src={image} alt={alt} width={1280} height={900} />
      </div>
    </div>
  )
}

export default function InstallationTemplate() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Installation Path</div>
        <p className="text-sm text-gray-700">
          SQLPerformance AI installation is complete only when the desktop app launches, the first-run
          onboarding finishes, the SQL connection succeeds, and the AI / LLM provider is ready for use.
        </p>
        <p className="mt-3 text-sm text-gray-700">
          If you want the product overview before setup, read the{' '}
          <Link href="/docs/overview" className="font-semibold text-primary hover:text-primary-dark">
            overview
          </Link>
          . If installation is already done and you only need the first working usage flow, jump to the{' '}
          <Link href="/docs/quickstart" className="font-semibold text-primary hover:text-primary-dark">
            quickstart guide
          </Link>
          .
        </p>
        <ol className="mt-4 list-decimal pl-5 text-sm text-gray-700 space-y-1">
          {firstRunSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <pre className="mt-4 rounded-xl bg-slate-900 p-4 text-xs text-slate-100 overflow-x-auto">
{`# Example silent install
msiexec /i "SQL Performance Intelligence.msi" /quiet /norestart`}
        </pre>
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          Use silent installation for managed enterprise rollout. Most users should use the normal interactive Windows
          installer.
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-emerald-800 mb-2">Search Summary</div>
        <p className="text-sm text-emerald-950">
          This installation guide covers SQLPerformance AI first-run onboarding, SQL Server application
          login requirements, Query Store enablement, database connection setup, and AI / LLM configuration.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Before You Install</div>
        <p className="text-sm text-gray-700">
          Gather the environment details first. Most failed onboarding attempts come from incomplete connection inputs,
          not from the installer itself.
        </p>
        <ul className="mt-4 list-disc pl-5 text-sm text-gray-700 space-y-1">
          {prepChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {onboardingScreens.map((screen) => (
        <ScreenshotCard key={screen.title} {...screen} />
      ))}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Step 4: Add Your First SQL Server Connection
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              After onboarding, the application opens <span className="font-medium">Settings &gt; Database</span>.
              Click <span className="font-medium">Add Connection</span> to create the first saved SQL Server
              connection profile. Use the dedicated application login or approved Windows account prepared by the DBA,
              not a personal elevated admin account.
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Enter a Connection Name and the SQL Server host or instance name.</li>
              <li>Choose the Environment (DEV, TEST, UAT, PROD, or OTHER) so the connection is clearly labelled.</li>
              <li>Set the port only if your environment does not use the default.</li>
              <li>Enter the Default Database (master is used if you leave the default).</li>
              <li>
                Choose SQL Server Authentication (username and password) or Windows Authentication (uses the current
                Windows session).
              </li>
              <li>Keep Encrypt Connection enabled; use Trust Server Certificate only when your environment requires it.</li>
              <li>Click Test Connection, then Save, then Connect in the connection list.</li>
              <li>Prefer development, sandbox, or staging before production review.</li>
            </ul>
          </div>
          <LightboxImage
            src="/docs/installation/database-connection-settings.png"
            alt="Add Connection dialog in Settings Database showing connection name, server instance, environment, port, default database, authentication, ODBC driver, encryption options, and Test Connection and Save buttons"
            width={1128}
            height={1564}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Step 5: Add Your AI / LLM Provider
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Next, open <span className="font-medium">Settings &gt; AI / LLM</span> and click{' '}
              <span className="font-medium">Add AI Model</span>. The application supports local and cloud-backed
              configurations. For a simple first run, add one stable model and test it. The first provider you add
              becomes the default automatically, and provider changes are saved immediately.
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Use Ollama for local-only model traffic (default host http://localhost:11434).</li>
              <li>Use OpenAI, Azure OpenAI, Anthropic, or DeepSeek for managed cloud access.</li>
              <li>Enter a name, the model, and the provider-specific API key, endpoint, or deployment fields exactly.</li>
              <li>Click Test before Add.</li>
              <li>If you add more than one provider, select one and click Set Default.</li>
            </ul>
          </div>
          <LightboxImage
            src="/docs/installation/ai-model-provider-settings.png"
            alt="Add AI Model dialog in Settings AI / LLM showing provider, name, model, API key fields, test result, and Add button"
            width={1300}
            height={978}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Step 6: Validate That Installation Is Complete
        </div>
        <p className="text-sm text-gray-700">
          The installation is operational when the onboarding flow is finished, the SQL connection is active, the AI
          model test succeeds, and at least one real analysis screen refreshes successfully. Until a license or trial
          is active, only Settings is available and the analysis modules stay hidden. After that, continue with the{' '}
          <Link href="/docs/quickstart" className="font-semibold text-primary hover:text-primary-dark">
            Quickstart guide
          </Link>{' '}
          for the first investigation workflow.
        </p>
        <ul className="mt-4 list-disc pl-5 text-sm text-gray-700 space-y-1">
          {validationChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Recommended SQL Server Permissions
        </div>
        <p className="text-sm text-gray-700">
          Create a dedicated application SQL login or use an approved mapped Windows account with only the visibility
          required by the product. Exact requirements vary by module, but this read-only baseline gives the best
          first-run experience without granting data-changing rights.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm text-gray-700">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What The DBA Should Grant</div>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-mono">CONNECT</span></li>
              <li><span className="font-mono">VIEW SERVER STATE</span></li>
              <li><span className="font-mono">VIEW DATABASE STATE</span></li>
              <li><span className="font-mono">VIEW DEFINITION</span></li>
              <li>Relevant system DMV and catalog visibility</li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What Not To Grant</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>No <span className="font-mono">db_owner</span></li>
              <li>No INSERT, UPDATE, or DELETE</li>
              <li>No SQL Agent start or stop rights for onboarding</li>
              <li>No broad business-table access unless your policy explicitly requires it</li>
            </ul>
          </div>
        </div>
        <pre className="mt-4 rounded-xl bg-slate-900 p-4 text-xs text-slate-100 overflow-x-auto">{sqlUserScript}</pre>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Query Store Preparation
        </div>
        <p className="text-sm text-gray-700">
          Query Store is not mandatory for basic use, but it materially improves historical analysis quality for Query
          Statistics, Index Advisor, and regression-oriented workflows.
        </p>
        <ul className="mt-4 list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Check the target database first and enable Query Store if it is currently off.</li>
          <li>Enable it per database, not once for the entire instance.</li>
          <li>Use <span className="font-mono">READ_WRITE</span> mode so history continues to accumulate.</li>
          <li>Keep <span className="font-mono">QUERY_CAPTURE_MODE = AUTO</span> as the practical default starting point.</li>
          <li>Enable wait-stat capture too if your SQL Server version supports it.</li>
        </ul>
        <pre className="mt-4 rounded-xl bg-slate-900 p-4 text-xs text-slate-100 overflow-x-auto">{queryStoreScript}</pre>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          What Happens If Permissions Are Incomplete
        </div>
        <p className="text-sm text-gray-700">
          The application degrades gracefully where possible, but some modules will return partial visibility when the
          SQL login cannot see the required metadata.
        </p>
        <ul className="mt-4 list-disc pl-5 text-sm text-gray-700 space-y-1">
          {incompletePermissionExamples.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Common Installation Issues
        </div>
        <p className="text-sm text-gray-700">
          Most installation problems come from environment readiness, connection details, or provider configuration, not
          from the application binary itself.
        </p>
        <ul className="mt-4 list-disc pl-5 text-sm text-gray-700 space-y-1">
          {setupIssues.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
