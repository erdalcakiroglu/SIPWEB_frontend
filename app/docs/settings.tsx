import Link from 'next/link'
import LightboxImage from './LightboxImage'

const topLevelTabs = [
  'General',
  'AI / LLM',
  'Database',
  'Tuning Memory',
  'License',
  'Security',
  'Appearance',
]

const commonTasks = [
  'Add, test, connect, and edit SQL Server connection profiles',
  'Add and test an AI provider and choose the default model',
  'Tune generation temperatures, AI response timeout, and prompt rules',
  'Review tuning feedback memory from earlier AI-assisted actions',
  'Activate a license, start a trial, or check license status',
  'Maintain your identity details and the local app lock password',
  'Choose which modules appear in the sidebar and adjust analysis thresholds',
]

const generalAreas = [
  'Language (English only for now)',
  'Navigation Menu: choose which modules appear in the sidebar',
  'Query Analysis (Bottleneck Thresholds)',
  'Security Audit: inactive login and backup encryption windows',
  'Blocking Analysis (Severity Thresholds) and the default Auto-Refresh state',
  'Application Info: version, build, and local file locations',
]

const aiAreas = [
  'Providers',
  'Generation',
  'AI Prompt Rules',
]

const databaseAreas = [
  'Database Connections',
  'General Query Settings',
  'Cache Settings',
]

const tuningMemoryAreas = [
  'Search prior AI-generated actions by object name',
  'Review date, object, type, priority, outcome, block state, confidence, and fingerprint',
  'Mark Hard Block, Mark Improved, or Reset to Suggested',
]

const licenseAreas = [
  'License Status summary',
  'Activate License / Change License (guided wizard)',
  'Check License Now',
  'Expires, Last Validated, and Licenses / Devices',
  'Advanced: Device ID, server URL, installed license files, offline grace',
]

const securityAreas = [
  'Identity: Name Surname, Company Name, Email Address',
  'Local App Lock: enable or disable, new password, confirm password',
  'Update Password',
  'Automatic Sign-In status and Clear Remember Me',
]

const appearanceAreas = [
  'Theme',
  'Fonts',
]

const workflows = [
  'Use Settings > Database to add a connection, test it, save it, and click Connect before opening the analysis modules.',
  'Use Settings > AI / LLM > Providers to add and test one stable provider before changing prompt rules or advanced temperatures. The first provider you add becomes the default.',
  'Use Settings > License to check trial or licensed state, and open the activation wizard when you receive a license.',
  'Use Settings > Security to keep your identity details current and to change or disable the local app lock password.',
  'Use Settings > General after your first successful analysis if you need sidebar visibility changes or threshold tuning for Query Statistics, Security Audit, or Blocking Analysis.',
]

const bestPractices = [
  'Keep one stable default AI provider instead of rotating defaults frequently.',
  'Use descriptive connection names and set the Environment (DEV, TEST, UAT, PROD) so production servers are easy to recognise.',
  'Change Query Analysis and blocking thresholds gradually and validate the result on a known workload.',
  'Use Tuning Memory as an operator review log, not as an automatic truth source.',
  'Keep Encrypt Connection enabled for SQL connections unless your environment requires an exception.',
  'Treat the local app lock password as a real machine-level access control.',
  'Watch the save status line at the bottom of Settings; if it shows Not saved, correct the value or click Retry.',
]

function ScreenshotCard({
  eyebrow,
  title,
  body,
  image,
  alt,
  width = 1600,
  height = 900,
}: {
  eyebrow: string
  title: string
  body: string
  image: string
  alt: string
  width?: number
  height?: number
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{eyebrow}</div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm leading-7 text-gray-700">{body}</p>
        </div>
        <LightboxImage src={image} alt={alt} width={width} height={height} />
      </div>
    </div>
  )
}

export default function SettingsTemplate() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Overview</div>
        <p className="text-sm text-gray-700">
          Settings is the product-wide control surface for SQL Server connections, AI providers, generation behavior,
          prompt rules, tuning feedback memory, licensing, local app lock, analysis thresholds, and
          visual preferences. Open it from the gear icon in the top bar. Most users visit Settings during first-run
          setup and then return only when infrastructure, credentials, or workflow policies change. Settings is always
          reachable: until a license or trial is active, it is the only page available and the other modules stay
          hidden.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm text-gray-700">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What You Use It For</div>
            <ul className="list-disc pl-5 space-y-1">
              {commonTasks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Top-Level Tabs</div>
            <ol className="list-decimal pl-5 space-y-1">
              {topLevelTabs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 1"
        title="General Settings and Module Visibility"
        body="The General tab controls which modules appear in the sidebar and the thresholds used to interpret Query Statistics bottlenecks, Security Audit findings, and Blocking Analysis severity. This is the right place for UI simplification and interpretation tuning, not for SQL connectivity or AI credentials."
        image="/docs/settings/001.png"
        alt="Settings General tab showing navigation menu module checkboxes, query analysis bottleneck thresholds, security audit windows, and blocking severity thresholds"
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Settings Window Layout</div>
        <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Top-Level Tabs</div>
            <ol className="list-decimal pl-5 space-y-1">
              {topLevelTabs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">How Changes Are Saved</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Changes are <span className="font-medium">saved automatically</span>. Checkboxes and lists save as soon as
                you change them; text and number fields save when you leave the field. There is no Save Settings button.
              </li>
              <li>
                A status line at the bottom of Settings shows <span className="font-medium">Saving...</span>,{' '}
                <span className="font-medium">All changes saved</span>, or{' '}
                <span className="font-medium">Not saved</span> with the reason and a{' '}
                <span className="font-medium">Retry</span> button.
              </li>
              <li>
                Two areas keep an explicit button: <span className="font-medium">Save Prompt Rules</span> in AI / LLM and{' '}
                <span className="font-medium">Update Password</span> in Security.
              </li>
              <li>
                Connections and AI providers are saved from their own dialogs, and actions such as Test Connection or
                Check License Now run immediately.
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-700">
          The most common onboarding sequence after installation is to configure{' '}
          <Link href="/docs/installation" className="font-semibold text-primary hover:text-primary-dark">
            Database
          </Link>{' '}
          first, then add one provider in{' '}
          <Link href="/docs/quickstart" className="font-semibold text-primary hover:text-primary-dark">
            AI / LLM
          </Link>
          , and only after that revisit advanced thresholds or prompt rules.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">General Tab</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">General Areas</div>
            <ul className="list-disc pl-5 space-y-1">
              {generalAreas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Important Notes</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Interface language is currently fixed to English.</li>
              <li>Navigation Menu checkboxes hide modules from the sidebar; they do not uninstall anything.</li>
              <li>
                Query Analysis thresholds cover dominant and signal wait percentages, storage IO and log write latency
                (ms), and CPU and read counts used to classify queries. They affect interpretation inside Query
                Statistics, not SQL Server itself.
              </li>
              <li>
                Security Audit settings define the inactive login threshold (30 to 3650 days, default 90) and the backup
                encryption window (30 to 365 days, default 90).
              </li>
              <li>
                Blocking Analysis (Severity Thresholds) defines the Low, Medium, and High wait-time thresholds in
                seconds (defaults 5, 30, and 60; Low must not exceed Medium, and Medium must not exceed High) and the
                option Start Blocking Analysis with Auto-Refresh enabled by default (on by default).
              </li>
              <li>
                Application Info shows the version, build, app data folder, log file, and local database file, with
                View License Agreement and Show Application Logs buttons.
              </li>
              <li>Use threshold changes sparingly and validate on known workloads.</li>
            </ul>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 2"
        title="AI Provider Management"
        body="The Providers tab lists every configured AI model with its name, type, and model, and marks the default with a star. Use Add AI Model to configure Ollama, OpenAI, Anthropic, Azure OpenAI, or DeepSeek, click Test to confirm the model responds, then Add. Select a row and click Set Default to change the default, or Edit (double-click also works) to change or remove a provider. Provider changes are saved immediately."
        image="/docs/settings/002.png"
        alt="Settings AI / LLM Providers tab showing the LLM Providers list with default star and the Add AI Model dialog"
      />

      <ScreenshotCard
        eyebrow="Screen 3"
        title="Generation Temperature Controls"
        body="The Generation tab sets the temperature (0.00 to 2.00) for core analysis workflows (Default, Object Analysis, Query Analysis, Code Optimization) and advanced workflows such as Index Recommendation, Self-Reflection Refinement, and AI Safety Validation. Lower values produce more deterministic responses. The Runtime panel sets the AI Response Timeout (10 to 1800 seconds, default 900) and the Batch Pause Between Analyses (default 10 seconds, 0 disables it)."
        image="/docs/settings/003.png"
        alt="Settings AI / LLM Generation tab showing core and advanced workflow temperatures and runtime timeout settings"
      />

      <ScreenshotCard
        eyebrow="Screen 4"
        title="AI Prompt Rules"
        body="AI Prompt Rules expose the system and user prompt templates behind each workflow, such as Global, Query Analysis, SP Analysis, Index Recommendation, Object Analysis, and Self-Reflection. Unlike the rest of Settings, prompt edits are not auto-saved: click Save Prompt Rules to keep them, or Reset Prompt Rules to return to the built-in templates. This is an advanced area and should only be changed when a repeated quality problem justifies prompt-level intervention."
        image="/docs/settings/004.png"
        alt="Settings AI Prompt Rules tab showing workflow rule tabs, system and user prompt fields, and Save Prompt Rules button"
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">AI / LLM Tab</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">AI / LLM Areas</div>
            <ul className="list-disc pl-5 space-y-1">
              {aiAreas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Recommended Flow</div>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Click Add AI Model and choose the provider</li>
              <li>Enter a name, the model, and the host or API key fields</li>
              <li>Click Test, then Add</li>
              <li>Select the provider and click Set Default if it is not already the default</li>
            </ol>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 5"
        title="Database Connections and Query Settings"
        body="The Database tab manages saved connection profiles, the query timeout, Scheduled Jobs limits, and the local cache. Each saved connection shows its name, environment, server, and authentication type, with Connect or Disconnect, Edit, and Delete actions. This is the most important Settings tab during onboarding because every analysis module needs an active SQL Server connection."
        image="/docs/settings/005.png"
        alt="Settings Database tab showing saved SQL Server connections with environment badges and the Add Connection dialog"
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Database Tab</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Database Areas</div>
            <ul className="list-disc pl-5 space-y-1">
              {databaseAreas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Operational Notes</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Add Connection asks for a connection name, server or instance, environment, optional port, default
                database, authentication type, and ODBC driver (Auto-select best available by default).
              </li>
              <li>Test Connection validates the profile before saving and shows the server, version, and edition.</li>
              <li>Windows Authentication uses the current Windows session, so username and password are not needed.</li>
              <li>Encrypt Connection is on by default and should usually remain enabled.</li>
              <li>Trust Server Certificate should be used only when the environment requires it.</li>
              <li>
                General Query Settings include the Query Timeout (default 30 seconds), the Scheduled Jobs long-running
                threshold (default 30 minutes), and the failed-jobs export limit (default 200).
              </li>
              <li>
                Clear Cache in Cache Settings empties the local application cache folder. Use it for freshness
                troubleshooting, not routine cleanup.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 6"
        title="Tuning Feedback Memory"
        body="Tuning Feedback Memory stores the review history of AI-generated object and tuning actions locally on this machine. Search by object name, select an entry to see its details, and mark suggestions with Mark Hard Block, Mark Improved, or Reset to Suggested so prior decision context stays visible over time."
        image="/docs/settings/006.png"
        alt="Settings Tuning Memory tab showing the Tuning Feedback Memory table with outcome, block, confidence, and fingerprint columns"
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Tuning Memory Tab</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Tuning Memory Areas</div>
            <ul className="list-disc pl-5 space-y-1">
              {tuningMemoryAreas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Operational Notes</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>This tab is a review and feedback surface, not an automatic execution engine.</li>
              <li>Outcome, block state, and confidence should be treated as operator guidance, not as hard truth.</li>
              <li>Use it to retain human judgement across repeated AI-assisted analysis sessions.</li>
            </ul>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 7"
        title="License Status and Activation"
        body="The License tab shows the current license or trial status, the expiry date, when the license was last validated, and license and device counts. Activate License (Change License once licensed) opens a guided wizard, and Check License Now validates the installed license again. A collapsed Advanced section shows the Device ID and installed license details."
        image="/docs/settings/007.png"
        alt="Settings License tab showing license status, expiry and last validated cards, and the Activate License and Check License Now buttons"
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">License Tab</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">License Areas</div>
            <ul className="list-disc pl-5 space-y-1">
              {licenseAreas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Activation Wizard</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="font-medium">Online activation:</span> enter your email and activation code, or use
                your website account password to request a code for this device. The password is not saved.
              </li>
              <li>
                <span className="font-medium">Manual activation (.lic file):</span> copy the Device ID for the website,
                then Choose File &amp; Import the issued .lic file. A matching .pem file is requested only if needed.
              </li>
              <li>
                <span className="font-medium">Free trial:</span> offered only when a trial is still available; it lasts
                30 days and each machine can use it once.
              </li>
              <li>
                Remove License From This Device (under Advanced) clears the saved license token and state on this
                machine. The analysis modules stay locked until a license is activated again.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Security Tab</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Security Areas</div>
            <ul className="list-disc pl-5 space-y-1">
              {securityAreas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Operational Notes</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>The identity email is shared by the local app lock, the trial, and licensing.</li>
              <li>
                The local app lock asks for your email and password when the application starts. It is enabled by
                default after first-run setup.
              </li>
              <li>
                Password changes take effect only after you click Update Password. The password is stored locally as a
                salted hash, not as plain text.
              </li>
              <li>
                Clear Remember Me turns off automatic sign-in so the next start asks for the password again. If the
                password is forgotten, use Forgot Password on the sign-in screen.
              </li>
              <li>Treat the local app lock as real machine-level access control.</li>
            </ul>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 8"
        title="Appearance Preferences"
        body="Appearance holds visual preferences: the theme, UI Font Size and Code Font Size (10 to 24 px), and a Show line numbers in code editor option. These are usability settings rather than performance or connectivity settings."
        image="/docs/settings/008.png"
        alt="Settings Appearance tab showing the Theme selector, UI and code font size fields, and the line numbers option"
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Appearance Tab</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Appearance Areas</div>
            <ul className="list-disc pl-5 space-y-1">
              {appearanceAreas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Current Reality</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Only the light theme is available.</li>
              <li>
                In the current release, the font size and line-number preferences are saved with your settings but are
                not yet applied to the interface.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Typical Workflows</div>
        <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
          {workflows.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Best Practices</div>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          {bestPractices.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Related References</div>
        <p className="text-sm text-gray-700">
          Use{' '}
          <Link href="/docs/installation" className="font-semibold text-primary hover:text-primary-dark">
            Installation
          </Link>{' '}
          for first-run onboarding and SQL prerequisites,{' '}
          <Link href="/docs/quickstart" className="font-semibold text-primary hover:text-primary-dark">
            Quickstart
          </Link>{' '}
          for the shortest path to a working setup, and{' '}
          <Link href="/docs/overview" className="font-semibold text-primary hover:text-primary-dark">
            Overview
          </Link>{' '}
          for product positioning before making environment-specific configuration choices.
        </p>
      </div>
    </div>
  )
}
