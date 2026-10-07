import Link from 'next/link'
import LightboxImage from './LightboxImage'

const mainAreas = [
  'Command bar (SQL Agent Control Room header, auto refresh, Alerts, Export, Refresh)',
  'Jobs list with filters, summary line, and sortable columns',
  'Operations Context panel (Job Detail and Alerts)',
]

const topTabs = [
  'Job Detail',
  'Alerts',
]

const jobDetailTabs = [
  'Overview',
  'Outcomes',
  'Steps',
  'Schedules',
]

const alertInboxTabs = [
  'Running',
  'Failures',
  'Mail Health',
]

const keyButtons = [
  'Pause / Resume (auto refresh)',
  'Alerts',
  'Export > CSV / Excel',
  'Refresh',
  'Reset (filters)',
  'Copy > Job Name / Job ID / Latest Outcome',
  'Open in SSMS',
  'Copy Command / Copy Message (per step)',
  'Show all / Show fewer',
  'Open Job',
  'Copy Remediation SQL',
  'Copy Incident Note',
  'Copy Error',
  'Copy msdb Refs',
  'Open Docs',
  'Mail Checks',
  'Failures Export > CSV / JSON / Excel',
  'Copy Checks SQL',
]

const keyCheckboxes = [
  'Failed in (24h or 7d window)',
  'Only long running (>30 m by default)',
]

const keyComboboxes = [
  'Auto refresh interval: 10s, 30s (default), 60s, Off',
  'Category: All Categories or a job category',
  'Status: All Statuses, Running, Failed, Succeeded, Retry, Canceled, Never run, Disabled, Needs Attention',
  'Failure window: 24h or 7d',
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
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm leading-7 text-gray-700">{body}</p>
        </div>
        <LightboxImage src={image} alt={alt} width={width} height={height} />
      </div>
    </div>
  )
}

export default function ScheduledJobsTemplate() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Overview</div>
        <p className="text-sm text-gray-700">
          Scheduled Jobs (shown as <span className="font-semibold">Jobs</span> in the sidebar) is a read-only review
          surface for SQL Server Agent jobs. It lists every job on the connected instance with its status, last run,
          7-day success rate, and next run, and lets you drill into job history, steps, and schedules, triage grouped
          SQL Agent job failures from the last 24 hours, and check Database Mail health. It never starts, stops,
          enables, or edits jobs.
        </p>
        <p className="mt-3 text-sm text-gray-700">
          This module is the operational companion to performance analysis pages such as{' '}
          <Link href="/docs/modules/dashboard" className="font-semibold text-primary hover:text-primary-dark">
            Dashboard
          </Link>{' '}
          and{' '}
          <Link href="/docs/modules/query-statistics" className="font-semibold text-primary hover:text-primary-dark">
            Query Statistics
          </Link>
          . It is designed for failure review and handoff preparation while the screen is open, rather than for
          continuous background collection, centralized alerting, or job control. Automatic refresh runs only while
          the Scheduled Jobs screen is open.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm text-gray-700">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What You Can Do</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>List SQL Agent jobs for the active instance and sort them by job, status, last run, 7d success, or next run.</li>
              <li>Spot failed, retrying, canceled, disabled, never-run, and long-running jobs.</li>
              <li>Inspect job outcomes, steps, and schedules for the selected job.</li>
              <li>Review failed job steps grouped by job, step, and error, with a heuristic root-cause label.</li>
              <li>Check Database Mail health for mail-related failures.</li>
              <li>Export the filtered job list or the failure evidence, and copy read-only remediation SQL.</li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Main Screen Areas</div>
            <ol className="list-decimal pl-5 space-y-1">
              {mainAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 1"
        title="SQL Agent Job List and Operations Context"
        body="The main Scheduled Jobs screen opens with the SQL Agent Control Room command bar, the filterable jobs list on the left, and the Operations Context panel on the right. The summary line above the list shows total, running, failed, disabled, and attention counts, and selecting a job opens its Job Detail with Overview, Outcomes, Steps, and Schedules tabs."
        image="/docs/scheduled-jobs/001.png"
        alt="Scheduled Jobs screen showing the SQL Agent Control Room command bar, SQL Server Agent jobs list with status, last run, 7d success and next run columns, and the Operations Context panel with job detail"
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Data Sources and Refresh Model</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Main Job Data</div>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-mono">msdb.dbo.sysjobs</span> and <span className="font-mono">msdb.dbo.syscategories</span></li>
              <li><span className="font-mono">msdb.dbo.sysjobactivity</span> for live running state</li>
              <li><span className="font-mono">msdb.dbo.sysjobhistory</span> for outcomes and failures</li>
              <li><span className="font-mono">msdb.dbo.sysjobsteps</span>, <span className="font-mono">sysjobschedules</span>, <span className="font-mono">sysschedules</span>, and <span className="font-mono">sysproxies</span></li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Mail Diagnostics</div>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-mono">sys.configurations</span> (Database Mail XPs)</li>
              <li><span className="font-mono">msdb.dbo.sysmail_profile</span> and <span className="font-mono">sysmail_principalprofile</span></li>
              <li><span className="font-mono">msdb.dbo.sysmail_unsentitems</span>, <span className="font-mono">sysmail_sentitems</span>, and <span className="font-mono">sysmail_faileditems</span></li>
              <li><span className="font-mono">msdb.dbo.sysmail_event_log</span></li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Refresh Behavior</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Auto refresh runs every 10s, 30s (default), or 60s, or is turned Off; Pause and Resume suspend it.</li>
              <li>Each automatic cycle reads live running state; the full job list is re-read at most every two minutes and the failure inbox at most every minute.</li>
              <li>Refresh re-reads everything immediately, including Database Mail health.</li>
              <li>Leaving the screen stops auto refresh; the status line shows the last refresh time.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Permission Fallback</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>If SELECT on <span className="font-mono">msdb.dbo.sysjobactivity</span> is denied, jobs still load without live running state.</li>
              <li>The status line then reports partial data and names the missing source.</li>
              <li>If individual job history, steps, or schedules cannot be read, Job Detail shows the evidence that was available with a warning.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Command Bar, Filters, and Job List</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Command Bar</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Status line with the last refresh time and load progress</li>
              <li>Auto: 10s, 30s, 60s, or Off, plus Pause / Resume</li>
              <li>Alerts, with the number of failure groups when there are any</li>
              <li>Export: CSV or Excel of the currently filtered job list</li>
              <li>Refresh</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Filters</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Search across name, owner, category, status, outcome, run context, schedule, and outcome message</li>
              <li>Category</li>
              <li>Status list</li>
              <li>Failed in 24h or 7d: jobs whose latest run failed inside that window</li>
              <li>Only long running (&gt;30 m): currently running jobs flagged as long running</li>
              <li>An active-filter count and Reset</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Status Filter Options</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>All Statuses</li>
              <li>Running, Failed, Succeeded, Retry, Canceled</li>
              <li>Never run</li>
              <li>Disabled</li>
              <li>Needs Attention: failed, retrying, canceled, or never-run jobs, plus long-running jobs</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Job Table</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Columns: Job, Status, Last Run, 7d Success, and Next Run; click a header to sort.</li>
              <li>Each row also shows category, enabled state, and a long-running or needs-attention marker.</li>
              <li>A summary line shows total, running, failed, disabled, and attention counts.</li>
              <li>Jobs that never ran show Never; jobs without a schedule show On demand.</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-700">
          The long-running threshold defaults to 30 minutes and can be changed in Settings &gt; Database with{' '}
          <span className="font-medium">Jobs Long Running Threshold (minutes)</span>. A running job is flagged as
          long running only after it has exceeded both that threshold and twice its 7-day average duration, which
          avoids false alarms for jobs that are normally slow.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Operations Context and Job Detail</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Operations Context Tabs</div>
            <ol className="list-decimal pl-5 space-y-1">
              {topTabs.map((tab) => (
                <li key={tab}>{tab}</li>
              ))}
            </ol>
            <p className="mt-3">
              Selecting a job in the list opens Job Detail. Alerts shows running jobs, grouped failures, and Database
              Mail health.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Job Detail Tabs</div>
            <ol className="list-decimal pl-5 space-y-1">
              {jobDetailTabs.map((tab) => (
                <li key={tab}>{tab}</li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Overview</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Job description plus Status, Owner, Run Context, Last Duration, 7d Average, and Schedule.</li>
              <li>The latest outcome message with its outcome code.</li>
              <li>Copy menu for the job name, job ID, or latest outcome.</li>
              <li>
                Open in SSMS writes a read-only lookup query for the job, its steps, and its schedules to a temporary
                .sql file and opens it with the application Windows associates with .sql files (usually SSMS). If the
                file cannot be opened, the query is copied to the clipboard instead.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Outcomes, Steps, and Schedules</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Outcomes shows last 24h and last 7d success rates, then recent history rows with status, duration, retries, and message.</li>
              <li>Steps shows each step&apos;s subsystem, database, command, and latest history message, and highlights the last failed step.</li>
              <li>Passwords, tokens, and similar secrets in step commands are masked before display.</li>
              <li>Schedules shows each schedule&apos;s enabled state, frequency, and next run.</li>
              <li>Long lists show the first 25 rows with Show all.</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-700">
          The best companion references are{' '}
          <Link href="/docs/modules/dashboard" className="font-semibold text-primary hover:text-primary-dark">
            Dashboard
          </Link>{' '}
          for instance-level signals and{' '}
          <Link href="/docs/modules/security-audit" className="font-semibold text-primary hover:text-primary-dark">
            Security Audit
          </Link>{' '}
          when job failures intersect with mail, proxy, or permission posture.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Alerts and Failure Triage</div>
        <div className="mb-3 text-sm text-gray-700">
          <div className="font-semibold mb-1">Alerts Tabs</div>
          <ol className="list-decimal pl-5 space-y-1">
            {alertInboxTabs.map((tab) => (
              <li key={tab}>{tab}</li>
            ))}
          </ol>
        </div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Running</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Lists currently executing jobs with elapsed time, last completed step, start time, and ETA.</li>
              <li>ETA is the start time plus the job&apos;s 7-day average duration and is blank when there is no history.</li>
              <li>The tab is informational only and has no stop action.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Failures</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Groups failed job steps from the last 24 hours by job, step, and normalized error message.</li>
              <li>Each group shows its repeat count, root cause, step, last seen time, and error text.</li>
              <li>A Top root causes line summarizes the most frequent causes.</li>
              <li>Export saves the failure rows as CSV, JSON, or Excel.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Root-Cause Heuristics</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Database Mail failure</li>
              <li>Proxy permission</li>
              <li>Timeout</li>
              <li>Login failed</li>
              <li>Disk / Storage</li>
              <li>Network</li>
              <li>SSIS Package</li>
              <li>Memory / Resource</li>
              <li>Other</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Failure Tools</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Open Job jumps to the failing job&apos;s Job Detail.</li>
              <li>Copy Remediation SQL copies a read-only diagnostic script tailored to the root cause.</li>
              <li>Copy Incident Note copies a summary with job, step, repeat count, root cause, error, and a suggested action.</li>
              <li>Copy Error and Copy msdb Refs copy the error text and the matching <span className="font-mono">sysjobhistory</span> keys.</li>
              <li>Open Docs opens the related Microsoft Learn article in your browser.</li>
              <li>Mail Checks appears on mail-related failures and opens Mail Health for that classification.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Mail Health, Exports, and Limits</div>
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Mail Health</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Shows whether Database Mail is enabled, profile and default-profile counts, pending mail, and the last success and last error times.</li>
              <li>Shows the latest Database Mail error event text.</li>
              <li>Mail-related failures are classified as SMTP, Profile, Permission, or Database Mail; Mail Checks adds checks for that classification.</li>
              <li>Copy Checks SQL copies a read-only T-SQL script for repeating the DB Mail checks in SSMS.</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Export Behavior</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>The command bar Export saves the currently filtered job list as CSV or Excel.</li>
              <li>The Failures tab Export saves failure rows as CSV, JSON, or Excel.</li>
              <li>Failure exports are capped by Jobs Failed Export Limit in Settings &gt; Database (200 rows by default).</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Operator Notes</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>The module is read-only and does not run, stop, enable, or edit jobs; copied SQL is for manual review.</li>
              <li><span className="font-medium">Failed in</span> is based on each job&apos;s latest outcome, not on every failure in the window.</li>
              <li>Root-cause labels and mail classifications are heuristic and may require manual confirmation.</li>
              <li>Running-job visibility and ETA depend on msdb activity data and job history.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Detailed Control Reference</div>
        <div className="grid gap-3 md:grid-cols-3 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Buttons</div>
            <ul className="list-disc pl-5 space-y-1">
              {keyButtons.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Checkboxes</div>
            <ul className="list-disc pl-5 space-y-1">
              {keyCheckboxes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Dropdowns</div>
            <ul className="list-disc pl-5 space-y-1">
              {keyComboboxes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Typical Workflow</div>
        <ol className="text-sm text-gray-700 list-decimal pl-5 space-y-1">
          <li>Open Scheduled Jobs and check the summary line for failed and attention counts.</li>
          <li>Narrow the list with search, category, status, or the Failed in and long-running filters.</li>
          <li>Select a job and review its Overview, Outcomes, Steps, and Schedules.</li>
          <li>Open Alerts &gt; Failures to see repeated step failures grouped by root cause.</li>
          <li>Copy remediation SQL, an incident note, or msdb references, or export the evidence for deeper triage.</li>
          <li>Check Mail Health when the failure looks Database Mail-related.</li>
        </ol>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Related References</div>
        <p className="text-sm text-gray-700">
          Scheduled Jobs correlates well with{' '}
          <Link href="/docs/modules/dashboard" className="font-semibold text-primary hover:text-primary-dark">
            Dashboard
          </Link>{' '}
          for instance-level pressure signals,{' '}
          <Link href="/docs/modules/query-statistics" className="font-semibold text-primary hover:text-primary-dark">
            Query Statistics
          </Link>{' '}
          for workload regressions that overlap with job windows, and{' '}
          <Link href="/docs/modules/security-audit" className="font-semibold text-primary hover:text-primary-dark">
            Security Audit
          </Link>{' '}
          when failures involve mail, proxy, login, or permission posture.
        </p>
      </div>
    </div>
  )
}
