import LightboxImage from './LightboxImage'
import Link from 'next/link'

const quickstartFlow = [
  'Complete the first-run onboarding and let the 30-day full trial start automatically.',
  'Add one saved SQL Server connection in Settings > Database.',
  'Test the connection, save it, then click Connect in the connection list.',
  'Open Dashboard (shown as Overview in the sidebar) to confirm the instance is reachable and metrics are loading. It works with the connection alone.',
  'Add one AI / LLM provider in Settings > AI / LLM and test it before you use AI-assisted analysis. The first provider becomes the default.',
  'Move to Query Statistics or Object Explorer for your first deeper analysis.',
]

const localOllamaSteps = [
  'Open Settings > AI / LLM > Providers.',
  'Click Add AI Model.',
  'Choose Provider = Ollama.',
  'Enter a clear Name such as Local Ollama - SQL.',
  'Enter Host as your Ollama URL, usually http://localhost:11434.',
  'Enter the exact installed model name, for example codellama.',
  'Click Test. If the test succeeds, click Add. The provider is saved immediately.',
  'If this is not your first provider, select it in the list and click Set Default.',
]

const cloudSteps = [
  'Open Settings > AI / LLM > Providers and click Add AI Model.',
  'Choose a cloud provider such as OpenAI, Azure OpenAI, Anthropic, or DeepSeek.',
  'Enter a clear Name so you can distinguish production and test providers later.',
  'Enter the target Model value exactly as required by that provider.',
  'Enter the API key.',
  'If you use Azure OpenAI, also fill in Endpoint and Deployment.',
  'Click Test. If the test succeeds, click Add. The provider is saved immediately.',
  'If this is not your first provider, select it in the list and click Set Default.',
]

const connectionSteps = [
  'Open Settings > Database.',
  'Click Add Connection.',
  'Enter a clear Connection Name.',
  'Enter Server / Instance, and a Port only if the instance does not use the default.',
  'Choose the Environment (DEV, TEST, UAT, PROD, or OTHER) so the profile shows the right badge.',
  'Choose the Default Database you want the profile to open first.',
  'Select SQL Server Authentication or Windows Authentication.',
  'If you chose SQL authentication, enter Username and Password.',
  'Leave ODBC Driver on auto-select unless your DBA requires a specific driver.',
  'Keep Encrypt Connection enabled unless you have a documented reason not to.',
  'Enable Trust Server Certificate only when your environment explicitly requires it.',
  'Click Test Connection.',
  'If the test succeeds, click Save, then click Connect on that profile in the connection list.',
]

export default function QuickstartTemplate() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">First 15 Minutes</div>
        <p className="text-sm text-gray-700">
          If you want the shortest successful first run, follow this order. It avoids the most common beginner mistake:
          trying to analyze before the app has a working SQL connection and a database with the right visibility
          settings. Dashboard needs only the connection; add an AI / LLM provider before you use AI-assisted analysis.
        </p>
        <p className="mt-3 text-sm text-gray-700">
          If you have not completed onboarding, SQL permissions, or Query Store preparation yet, go back to the{' '}
          <Link href="/docs/installation" className="font-semibold text-primary hover:text-primary-dark">
            installation guide
          </Link>{' '}
          first.
        </p>
        <ol className="mt-4 list-decimal pl-5 text-sm text-gray-700 space-y-1">
          {quickstartFlow.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-blue-900 mb-2">What The Trial Message Means</div>
        <p className="text-sm text-blue-950">
          After first-run setup, a Trial Started message confirms that the 30-day full trial is active and directs
          you to add a database connection in <span className="font-medium">Settings &gt; Database</span>, then an AI
          model in <span className="font-medium">Settings &gt; AI / LLM</span>. The app opens Settings &gt; Database
          for you. Add the connection first: Dashboard already works with it, and the AI model is needed once you start
          AI-assisted analysis.
        </p>
        <p className="mt-3 text-sm text-blue-950">
          For the full first-run screens and setup sequence, see the{' '}
          <Link href="/docs/installation" className="font-semibold text-primary hover:text-primary-dark">
            installation walkthrough
          </Link>
          .
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Add A New Database Connection
        </div>
        <p className="text-sm text-gray-700">
          In this product, <span className="font-semibold">Add Connection</span> means add a saved connection profile.
          It does not create a new SQL database on the server.
        </p>
        <div className="mt-4">
          <LightboxImage
            src="/docs/installation/database-connection-settings.png"
            alt="Add Connection dialog in Settings Database for configuring the first SQL Server connection profile"
            width={1128}
            height={1564}
            imageClassName="mx-auto h-auto max-h-[760px] w-auto transition-transform duration-300 group-hover:scale-[1.01]"
          />
        </div>
        <ol className="mt-4 list-decimal pl-5 text-sm text-gray-700 space-y-1">
          {connectionSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          <div className="text-xs font-semibold uppercase tracking-wide mb-1">Tip</div>
          If you use Windows Authentication, run the app with the Windows account that already has the required SQL
          permissions. The Username and Password fields are disabled for Windows Authentication because the current
          Windows session is used.
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Add Local AI With Ollama
        </div>
        <p className="text-sm text-gray-700">
          Choose this path if you want model traffic to stay local. Make sure Ollama is already running and the model
          is already installed before you test it inside the app.
        </p>
        <pre className="mt-4 rounded-xl bg-slate-900 p-4 text-xs text-slate-100 overflow-x-auto">
{`ollama serve
ollama pull codellama`}
        </pre>
        <ol className="mt-4 list-decimal pl-5 text-sm text-gray-700 space-y-1">
          {localOllamaSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Add A Cloud LLM
        </div>
        <p className="text-sm text-gray-700">
          Choose this path if your team already uses a managed provider or if you want a centralized model backend.
          The exact fields vary by provider, but the workflow stays almost the same.
        </p>
        <div className="mt-4">
          <LightboxImage
            src="/docs/installation/ai-model-provider-settings.png"
            alt="Add AI Model dialog in Settings AI / LLM used to test and add a cloud LLM provider"
            width={1300}
            height={978}
          />
        </div>
        <ol className="mt-4 list-decimal pl-5 text-sm text-gray-700 space-y-1">
          {cloudSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Typical OpenAI Style Fields</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>API Key</li>
              <li>Model</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Typical Azure OpenAI Style Fields</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>API Key</li>
              <li>Endpoint</li>
              <li>Deployment</li>
              <li>Model</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
          <div className="font-semibold mb-1">DeepSeek API Key</div>
          <p>
            If you want to use DeepSeek, first create an account in the DeepSeek platform, generate an API key, and
            then paste that key into the provider form inside the app.
          </p>
          <ol className="mt-3 list-decimal pl-5 space-y-1">
            <li>
              Open{' '}
              <a
                href="https://platform.deepseek.com/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-primary hover:text-primary-dark"
              >
                DeepSeek Platform
              </a>{' '}
              and sign in.
            </li>
            <li>Create an API key from the platform account console.</li>
            <li>
              If you need request format details, use the official{' '}
              <a
                href="https://api-docs.deepseek.com/api/deepseek-api"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-primary hover:text-primary-dark"
              >
                DeepSeek API documentation
              </a>
              .
            </li>
          </ol>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Your First Real Check
        </div>
        <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
          <li>After you connect, open Dashboard first. The Server, Database, and LLM selectors in the top bar show the active context and let you switch it.</li>
          <li>Confirm that CPU, memory, IO, and TempDB metrics are populated.</li>
          <li>Then open Query Statistics for query-level evidence.</li>
          <li>If you want to inspect one procedure, function, or table, open Object Explorer.</li>
        </ol>
        <p className="mt-4 text-sm text-gray-700">
          If you want the product-level explanation for why this module order works, read the{' '}
          <Link href="/docs/overview" className="font-semibold text-primary hover:text-primary-dark">
            overview
          </Link>
          .
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Common First-Run Problems</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Connection Test Fails</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Re-check server name, port, and authentication mode.</li>
              <li>Confirm the account has the expected SQL permissions.</li>
              <li>Review encryption and certificate settings with your DBA.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">AI Provider Test Fails</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>For Ollama, confirm the service is running and the model is installed.</li>
              <li>For cloud providers, re-check the API key, model, endpoint, or deployment fields.</li>
              <li>Make sure you clicked Add after a successful Test; a provider that was only tested is not saved.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Query Statistics Looks Too Empty</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Check whether Query Store is enabled for the target database.</li>
              <li>Ask the DBA to enable Query Store with READ_WRITE and QUERY_CAPTURE_MODE = AUTO if it is off.</li>
              <li>Remember that DMV fallback has less historical depth.</li>
              <li>Ask the DBA to enable Query Store if the database is new to the platform.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">You Changed Settings But Nothing Happened</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Settings save automatically. Check the status line at the bottom of Settings: if it shows Not saved,
                correct the value or click Retry.
              </li>
              <li>Text and number fields save when you leave the field, so click or tab out of the field first.</li>
              <li>Prompt rule edits need Save Prompt Rules, and a new app lock password needs Update Password.</li>
              <li>Some settings affect only future connections or future analyses; rerun the analysis or click Refresh.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
