import Link from 'next/link'
import LightboxImage from './LightboxImage'

// Checked 2026-10-08 against SPStudioPro-v2 1.1.0: webui/assets/js/modules/settings.js (NAV_PAGES,
// DESCRIPTIONS, PROVIDER_TYPES, TEMP_GROUPS, PROMPT_TABS), webui/bridge/settings_api.py (save
// validation and clamps), core/config.py, core/constants.py, services/credential_store.py.
// The Chat navigation item is locked and never rendered; its temperature row and prompt rule are
// cropped out of the screenshots and not described here.

const settingsTree = [
  { page: 'General', parts: 'Navigation Menu, Query Analysis, Security Audit, Blocking Analysis, Application Info' },
  { page: 'Appearance', parts: 'Theme' },
  { page: 'Database', parts: 'Connections, Query Settings, Cache' },
  { page: 'AI / LLM', parts: 'Providers, Generation, Prompt Rules' },
  { page: 'Tuning Memory', parts: 'Tuning Feedback Memory' },
  { page: 'License', parts: 'License Status, Advanced' },
  { page: 'Security', parts: 'Identity, Local App Lock' },
]

const commonTasks = [
  'Add, test, connect, and edit SQL Server connection profiles',
  'Add and test an AI provider and choose the default model',
  'Tune generation temperatures, the AI response timeout, and prompt rules',
  'Review tuning feedback memory from earlier AI-generated actions',
  'Activate a license, start a trial, or check license status',
  'Maintain your identity details and the local app lock password',
  'Choose which modules appear in the sidebar and adjust analysis thresholds',
]

const queryThresholds = [
  'Dominant Wait Threshold (%): 40',
  'Signal Wait Threshold (%): 15',
  'Storage IO Latency (ms): 15',
  'Log Write Latency (ms): 10',
  'CPU High (per exec, ms): 50',
  'CPU Low Reads (reads): 5,000',
  'IO High Reads (reads): 20,000',
]

const workflows = [
  'Use Settings > Database to add a connection, test it, save it, and click Connect before opening the analysis modules.',
  'Use Settings > AI / LLM > Providers to add and test one stable provider before changing prompt rules or temperatures.',
  'Use Settings > License to check trial or licensed state, and open the activation wizard when you receive a license.',
  'Use Settings > Security to keep your identity details current and to change or disable the local app lock password.',
  'Use Settings > General after your first successful analysis if you need sidebar visibility changes or threshold tuning for Query Statistics, Security Audit, or Blocking Analysis.',
]

const bestPractices = [
  'Keep one stable default AI provider instead of rotating defaults frequently.',
  'Use descriptive connection names and set the Environment so production servers are easy to recognise.',
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
  width,
  height,
  maxWidthClass = 'max-w-6xl',
}: {
  eyebrow: string
  title: string
  body: React.ReactNode
  image: string
  alt: string
  width: number
  height: number
  maxWidthClass?: string
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{eyebrow}</div>
      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <div className="space-y-3 text-sm leading-7 text-gray-700">{body}</div>
        </div>
        <LightboxImage
          src={image}
          alt={alt}
          width={width}
          height={height}
          className={`mx-auto ${maxWidthClass}`}
          imageClassName="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-[1.01]"
        />
      </div>
    </div>
  )
}

function InfoCard({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{eyebrow}</div>
      {children}
    </div>
  )
}

export default function SettingsTemplate() {
  return (
    <div className="space-y-8">
      <InfoCard eyebrow="Overview">
        <p className="text-sm text-gray-700">
          Settings is the product-wide control surface for SQL Server connections, AI providers, generation behavior,
          prompt rules, tuning feedback memory, licensing, the local app lock, and analysis thresholds. Open it from
          the Settings item in the sidebar or from the gear icon in the top bar. Most users visit Settings during
          first-run setup and then return only when infrastructure, credentials, or workflow policies change. Settings
          is always reachable: until a license or trial is active, it is the only page available and the other modules
          stay hidden.
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
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Settings Pages</div>
            <ol className="list-decimal pl-5 space-y-1">
              {settingsTree.map((item) => (
                <li key={item.page}>
                  <span className="font-medium">{item.page}:</span> {item.parts}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </InfoCard>

      <InfoCard eyebrow="Settings Window Layout">
        <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Navigating</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                A page tree on the left lists the pages above. Expand a page to jump to one of its parts; General opens
                first.
              </li>
              <li>
                The <span className="font-medium">Search settings...</span> box above the tree filters pages and parts
                by name and related keywords, and shows No matching settings when nothing fits.
              </li>
              <li>Most rows carry a one-line description under the label that says what the value controls.</li>
            </ul>
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
          The most common onboarding sequence after installation is to configure Database first, then add one
          provider in AI / LLM, and only after that revisit thresholds or prompt rules. The{' '}
          <Link href="/docs/quickstart" className="font-semibold text-primary hover:text-primary-dark">
            Quickstart
          </Link>{' '}
          walks through that sequence.
        </p>
      </InfoCard>

      <ScreenshotCard
        eyebrow="General"
        title="Thresholds and Application Info"
        body={
          <>
            <p>
              The lower half of the General page in version 1.1.0, with every value at its default. Navigation Menu and
              Query Analysis sit above this part; the local folder paths are blurred.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Backup Encryption Window:</strong> the last Security Audit field, 90 days of backup history
                checked for unencrypted backups.
              </li>
              <li>
                <strong>Blocking Analysis (Monitor and Severity Thresholds):</strong> both switches are on, so one
                blocking check runs in the background right after you connect and Blocking Analysis opens with its
                monitor refreshing. Monitor Refresh Interval is 5 s; the Low, Medium, and High thresholds are 5, 30, and
                60 s of blocked wait time.
              </li>
              <li>
                <strong>Application Info:</strong> Version 1.1.0, Build, Author, App Data Folder, Log File, and Database
                File, with View License Agreement and Show Application Logs.
              </li>
              <li>
                <strong>Status line:</strong> Changes are saved automatically.
              </li>
            </ul>
          </>
        }
        image="/docs/settings/general.png"
        alt="Settings General page showing Backup Encryption Window, the Blocking Analysis monitor switches and severity thresholds, and Application Info with blurred local paths"
        width={1214}
        height={897}
      />

      <InfoCard eyebrow="General Page">
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Navigation Menu and Query Analysis</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Navigation Menu has a Main Menu group (Overview, Object Explorer, Query Statistics, Index Advisor) and a
                Tools group (Blocking Analysis, Security Audit, Scheduled Jobs, Wait Statistics). Clearing a box hides
                the module from the sidebar; it does not uninstall anything. At least one item must stay enabled.
              </li>
              <li>
                Query Analysis (Bottleneck Thresholds) sets how Query Statistics classifies queries. Defaults:
                <ul className="mt-1 list-[circle] pl-5 space-y-0.5">
                  {queryThresholds.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
              <li>
                CPU Low Reads must not exceed IO High Reads, otherwise the CPU-bound and IO-bound bands would overlap.
                These values affect interpretation inside the application, not SQL Server itself.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Security Audit, Blocking, Application Info</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Security Audit: Inactive Login Threshold (30 to 3650 days, default 90) and Backup Encryption Window (30
                to 365 days, default 90).
              </li>
              <li>
                Blocking Analysis: Monitor Refresh Interval 2 to 300 seconds (default 5). Low, Medium, and High are 0 to
                3600 seconds (defaults 5, 30, 60) and must satisfy Low ≤ Medium ≤ High; otherwise the value is not
                saved.
              </li>
              <li>
                Application Info shows where the application keeps its data, log file, and local database on this
                machine. Show Application Logs opens the latest log lines; see{' '}
                <span className="font-medium">Where Secrets Are Kept</span> below for what is masked there.
              </li>
              <li>Use threshold changes sparingly and validate on known workloads.</li>
            </ul>
          </div>
        </div>
      </InfoCard>

      <ScreenshotCard
        eyebrow="Appearance"
        title="Theme"
        body={
          <>
            <p>The Appearance page has one setting.</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Theme:</strong> Light, the only theme available in this release.
              </li>
            </ul>
          </>
        }
        image="/docs/settings/appearance.png"
        alt="Settings Appearance page with the Theme selector set to Light"
        width={1327}
        height={247}
      />

      <ScreenshotCard
        eyebrow="Database"
        title="Adding a SQL Server Connection"
        body={
          <>
            <p>
              The Add Connection dialog, opened from Database Connections, after a successful Test Connection. The
              profile is a demo entry.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Profile:</strong> Connection Name, Server / Instance, Environment (here PROD - Production, shown
                with a red PROD badge), optional Port, and Default Database.
              </li>
              <li>
                <strong>Authentication:</strong> SQL Server Authentication with Username, an optional Domain, and
                Password. With Windows Authentication the current Windows session is used and no password is stored.
              </li>
              <li>
                <strong>ODBC Driver:</strong> Auto-select best available.
              </li>
              <li>
                <strong>Options:</strong> Encrypt Connection and Trust Server Certificate are both checked, so the
                connection stays encrypted but the server certificate is not validated.
              </li>
              <li>
                <strong>Result:</strong> Connection Successful! at the bottom, with Test Connection, Cancel, and Save.
              </li>
            </ul>
          </>
        }
        image="/docs/settings/add-connection.png"
        alt="Add Connection dialog with a demo production profile, SQL Server Authentication, ODBC driver auto-select, encryption options, and a successful test result"
        width={545}
        height={850}
        maxWidthClass="max-w-md"
      />

      <InfoCard eyebrow="Database Page">
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          <li>
            Database Connections lists the saved profiles by environment, then name, with Connect or Disconnect, Edit,
            and Delete.
          </li>
          <li>
            Test Connection uses the values in the dialog without saving them, gives up after at most 15 seconds, and
            shows the server, version, and edition on success. A typed password is used for the test only; Save stores
            it.
          </li>
          <li>
            Editing a connected profile in a way that changes how it connects (server, port, database, authentication,
            username, domain, driver, or the encryption options) disconnects the live session.
          </li>
          <li>
            General Query Settings: Query Timeout (1 to 600 seconds, default 30), Jobs Long Running Threshold (1 to
            1440 minutes, default 30), and Jobs Failed Export Limit (default 200).
          </li>
          <li>
            Cache: Clear Cache empties the local application cache, and Cache Info shows what it holds. Use it for
            freshness troubleshooting, not routine cleanup.
          </li>
        </ul>
      </InfoCard>

      <ScreenshotCard
        eyebrow="AI / LLM › Providers"
        title="AI Provider Management"
        body={
          <>
            <p>The Providers page with two configured models.</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Default Ollama:</strong> type Ollama, model codellama. This entry is added automatically if the
                last provider is removed.
              </li>
              <li>
                <strong>DeepSeek:</strong> type Deepseek, model deepseek-v4-pro, marked with the star as the default.
              </li>
              <li>
                <strong>Actions:</strong> Add AI Model at the top; Set Default and Edit below the list. Double-clicking
                a row also opens Edit, where a provider can be removed.
              </li>
            </ul>
          </>
        }
        image="/docs/settings/ai-providers.png"
        alt="Settings AI / LLM Providers page listing Default Ollama and a DeepSeek model marked as default, with Add AI Model, Set Default, and Edit buttons"
        width={1215}
        height={380}
      />

      <ScreenshotCard
        eyebrow="AI / LLM › Add AI Model"
        title="Adding and Testing a Model"
        body={
          <>
            <p>The Add AI Model dialog after Test.</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Provider:</strong> one of Ollama, OpenAI, Anthropic, Azure OpenAI, or DeepSeek. Choosing a type
                suggests a model name.
              </li>
              <li>
                <strong>Name, Model, API Key:</strong> the key is masked and can be revealed with Show. Ollama asks for
                a host instead of a key.
              </li>
              <li>
                <strong>Test result:</strong> DeepSeek API key valid, the model that was tested, and the models the key
                can use.
              </li>
            </ul>
            <p>
              API keys are not written to the settings files; they are kept in Windows Credential Manager. Provider
              changes are saved when you click Add or close Edit.
            </p>
          </>
        }
        image="/docs/settings/add-ai-model.png"
        alt="Add AI Model dialog with DeepSeek selected, a masked API key, and a successful key test listing the available models"
        width={537}
        height={461}
        maxWidthClass="max-w-xl"
      />

      <ScreenshotCard
        eyebrow="AI / LLM › Generation"
        title="Generation Temperatures"
        body={
          <>
            <p>
              The Generation page with the default temperatures. Each value is 0.00 to 2.00; lower values give more
              deterministic output. The capture leaves out the first row, Default (0.10), which applies to workflows
              without their own setting.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Core Analysis Temperatures:</strong> Object Analysis 0.02, Query Analysis 0.10, Code
                Optimization 0.10.
              </li>
              <li>
                <strong>Advanced Workflow Temperatures:</strong> Index Advisor (Preclassified) 0.10, Self-Reflection
                Refinement 0.05, AI Safety Validation 0.00, SQL Continuation 0.10, Report Continuation 0.10.
              </li>
              <li>
                <strong>Runtime</strong> (below the capture): AI Response Timeout, 10 to 1800 seconds, default 900, is
                the upper bound for one AI analysis; raise it if analyses finish as partial. Batch Pause Between
                Analyses, 0 to 3600 seconds, default 10, is the wait between two object analyses in a batch run and can
                be overridden per run.
              </li>
            </ul>
          </>
        }
        image="/docs/settings/generation.png"
        alt="Settings AI / LLM Generation page with core analysis and advanced workflow temperature fields"
        width={1219}
        height={762}
      />

      <ScreenshotCard
        eyebrow="AI / LLM › Prompt Rules"
        title="Prompt Rules"
        body={
          <>
            <p>
              The Prompt Rules page with the Global rule open. Prompt rules shape the AI analysis output; this is an
              advanced area for repeated quality problems that justify a prompt-level change.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Rule list:</strong> Global, Query Analysis, SP Analysis, SP Code Only, Index Preclassified,
                Object Analysis, and Self-Reflection.
              </li>
              <li>
                <strong>Editor:</strong> Global holds shared instructions inserted wherever another rule uses{' '}
                {'{global_instructions}'}. Other rules have system and user prompt fields.
              </li>
              <li>
                <strong>Placeholders:</strong> the values a rule can use, shown under the editor; None for this rule
                here.
              </li>
              <li>
                <strong>Saving:</strong> not automatic. Edits are kept while you move around Settings and apply only
                after Save Prompt Rules; Reset Prompt Rules returns to the built-in templates.
              </li>
            </ul>
          </>
        }
        image="/docs/settings/prompt-rules.png"
        alt="Settings AI / LLM Prompt Rules page with the rule list, the Global prompt editor, and Save and Reset Prompt Rules buttons"
        width={1247}
        height={656}
      />

      <ScreenshotCard
        eyebrow="Tuning Memory"
        title="Tuning Feedback Memory"
        body={
          <>
            <p>
              Tuning Memory before any action was recorded. It keeps the review history of AI-generated Object Explorer
              actions in the local database on this machine.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Object Name:</strong> searches by object name, schema, or database.
              </li>
              <li>
                <strong>Columns:</strong> Date, Object, Type, Priority, Outcome, Block, Confidence, Fingerprint, and
                Action.
              </li>
              <li>
                <strong>Buttons:</strong> Mark Hard Block, Mark Improved, and Reset to Suggested for the selected entry,
                with its details in the panel below.
              </li>
            </ul>
            <p>
              It is a review surface, not an execution engine: outcome, block state, and confidence are operator
              guidance that keeps earlier decisions visible.
            </p>
          </>
        }
        image="/docs/settings/tuning-memory.png"
        alt="Settings Tuning Memory page with the object name search, the empty tuning feedback table, and the Mark Hard Block, Mark Improved, and Reset to Suggested buttons"
        width={1632}
        height={558}
      />

      <ScreenshotCard
        eyebrow="License"
        title="License Status and Advanced Details"
        body={
          <>
            <p>
              The License page on an activated machine with Advanced expanded. Device ID, Server URL, and the
              configuration folder are blurred.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>License Status:</strong> Active, with Change License (Activate License before activation) and
                Check License Now.
              </li>
              <li>
                <strong>Cards:</strong> Expires, Last Validated, and Licenses / Devices 1 / 1.
              </li>
              <li>
                <strong>Advanced:</strong> Device ID with Copy ID, Server URL, Installed License, Imported .lic File,
                Installed PEM File, App Config Folder, Refresh After, and Offline Grace Until.
              </li>
              <li>
                <strong>Buttons:</strong> View License Agreement and Remove License From This Device.
              </li>
            </ul>
            <p>
              Server URL is the only field on this page that saves itself, when you leave it; change it only if support
              asks you to.
            </p>
          </>
        }
        image="/docs/settings/license.png"
        alt="Settings License page showing an active license with expiry, last validated, and device count cards, and the Advanced section with blurred device and folder details"
        width={1211}
        height={668}
      />

      <ScreenshotCard
        eyebrow="License › Activate"
        title="Choosing How to Activate"
        body={
          <>
            <p>The first step of the Activate License wizard: Method, then Details, then Result.</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Online:</strong> enter the activation code from your website account, or sign in with your
                website password and let the application fetch one for this device.
              </li>
              <li>
                <strong>Manual (.lic file):</strong> for offline installations, import a .lic file issued for this
                device. A .pem key file is requested only if the file needs it.
              </li>
            </ul>
          </>
        }
        image="/docs/settings/license-wizard-method.png"
        alt="Activate License wizard Method step offering Online activation and Manual .lic file import"
        width={760}
        height={342}
        maxWidthClass="max-w-3xl"
      />

      <ScreenshotCard
        eyebrow="License › Online Activation"
        title="Entering the Activation Code"
        body={
          <>
            <p>The Details step for online activation; the email address and code are blurred.</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Email address and Activation code:</strong> use the email of the website account that owns the
                code, then press Activate.
              </li>
              <li>
                <strong>No code yet? Get one with my website account:</strong> asks for the website account password and
                requests a code for this device. The password is not saved.
              </li>
            </ul>
          </>
        }
        image="/docs/settings/license-wizard-online.png"
        alt="Activate License wizard Details step for online activation with blurred email address and activation code"
        width={760}
        height={418}
        maxWidthClass="max-w-3xl"
      />

      <InfoCard eyebrow="License Notes">
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          <li>
            <span className="font-medium">Free trial:</span> the wizard offers it only while a trial is still available
            on this machine. It lasts 30 days and each machine can use it once.
          </li>
          <li>
            If activation fails, the Result step shows Activation could not be completed with the reason.
          </li>
          <li>
            Remove License From This Device clears the saved license on this machine; trial dates are kept.
          </li>
          <li>
            Licenses are counted per device: see{' '}
            <Link href="/pricing" className="font-semibold text-primary hover:text-primary-dark">
              Pricing
            </Link>
            .
          </li>
        </ul>
      </InfoCard>

      <ScreenshotCard
        eyebrow="Security"
        title="Identity and Local App Lock"
        body={
          <>
            <p>The Security page with the app lock on; the email address is blurred.</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Identity:</strong> Name Surname, Company Name, and Email Address. These fields are shared by the
                local app lock, trial activation, device ID generation, and online license activation.
              </li>
              <li>
                <strong>Local App Lock:</strong> Enable local app lock asks for the local password when the application
                starts; Configured shows Yes once a password is set.
              </li>
              <li>
                <strong>New Password and Confirm Password:</strong> take effect only after Update Password; everything
                else on the page saves when you change it.
              </li>
              <li>
                <strong>Automatic Sign-In:</strong> Disabled here. Clear Remember Me turns it off so the next start asks
                for the password again.
              </li>
            </ul>
            <p>
              An email address is required while the app lock is on, and the password must be at least 6 characters. If
              the local password is forgotten, use Forgot Password on the sign-in screen and verify the website account.
            </p>
          </>
        }
        image="/docs/settings/security.png"
        alt="Settings Security page with identity fields, the local app lock switch, password fields, Update Password, and Automatic Sign-In with Clear Remember Me"
        width={1215}
        height={907}
      />

      <InfoCard eyebrow="Where Secrets Are Kept">
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          <li>SQL Server passwords and AI provider API keys are kept in Windows Credential Manager, not in the settings files.</li>
          <li>The local app lock password is stored as a salted PBKDF2 hash, not as plain text.</li>
          <li>
            Show Application Logs displays the latest 100 log lines with user names, passwords, tokens, and API keys
            masked. Server names and SQL text are not masked, and the log file on disk is not changed.
          </li>
        </ul>
      </InfoCard>

      <InfoCard eyebrow="Typical Workflows">
        <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
          {workflows.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </InfoCard>

      <InfoCard eyebrow="Best Practices">
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          {bestPractices.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </InfoCard>

      <InfoCard eyebrow="Related References">
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
          <Link href="/security" className="font-semibold text-primary hover:text-primary-dark">
            Security
          </Link>{' '}
          for what each module sends to an AI provider.
        </p>
      </InfoCard>
    </div>
  )
}
