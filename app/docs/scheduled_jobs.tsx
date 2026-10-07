import Link from 'next/link'
import LightboxImage from './LightboxImage'

const mainAreas = [
  'Header: the caption SQL AGENT CONTROL ROOM, the title Scheduled Jobs, and a status line that starts as Ready. and later shows the last refresh time or a warning.',
  'Command bar: the Auto interval (10s, 30s, 60s, Off), Pause / Resume, Alerts, Export (CSV, Excel), and Refresh.',
  'Jobs panel: Search, Category, Status, Failed in, Only long running, Reset, the summary line, and the sortable job table.',
  'Operations Context panel: the Job Detail tab (Overview, Outcomes, Steps, Schedules) and the Alerts tab (Running, Failures, Mail Health).',
]

const statusValues = [
  'Running: an open activity row shows the job is executing now.',
  'Failed, Succeeded, Retry, Canceled: the outcome of the latest run.',
  'Never run: no history row and no last run date exist.',
  'Unknown: a history row exists but its outcome code is not one of the above.',
]

const nextRunValues = [
  'A timestamp: the next run time SQL Agent published to msdb.',
  'Disabled: the job is disabled.',
  'Agent stopped: SQL Server Agent is not running, so no schedule fires until the service is started.',
  'On demand: the job has no schedule.',
  'Schedule disabled: the job has schedules, but none is enabled.',
  'On Agent start or On CPU idle: an event-triggered schedule with no clock time.',
  'After current run: the job is running and msdb holds no later time yet.',
  'Not reported: msdb holds no upcoming run time; the schedule may have ended or SQL Agent may be stopped.',
]

const rootCauses = [
  'Database Mail failure',
  'Job owner access',
  'Deadlock',
  'Proxy permission',
  'Permission denied',
  'Login failed',
  'Memory / Resource',
  'Disk / Storage',
  'Network',
  'Timeout',
  'SSIS Package',
  'Other',
]

const keyButtons = [
  'Pause / Resume (auto refresh)',
  'Alerts / Alerts (N)',
  'Export > CSV / Excel (filtered job list)',
  'Refresh',
  'Reset (filters)',
  'Copy > Job Name / Job ID / Latest Outcome',
  'Open in SSMS',
  'Copy Command / Copy Message (per step)',
  'Show all N / Show fewer',
  'Open Job',
  'Copy Remediation SQL',
  'Copy Incident Note',
  'Copy Error',
  'Copy msdb Refs',
  'Open Docs',
  'Mail Checks (mail-related groups only)',
  'Failures Export > Groups / All runs (CSV, JSON, Excel)',
  'Copy Checks SQL (Mail Health)',
]

const keyCheckboxes = [
  'Failed in (24h or 7d window)',
  'Only long running (>N m, N from Settings, 30 by default)',
]

const keyComboboxes = [
  'Auto refresh interval: 10s, 30s (default), 60s, Off',
  'Category: All Categories or a job category',
  'Status: All Statuses, Running, Failed, Succeeded, Retry, Canceled, Never run, Disabled, Needs Attention',
  'Failed in window: 24h or 7d',
]

function ScreenshotCard({
  eyebrow,
  title,
  body,
  image,
  alt,
  width = 1600,
  height = 900,
  maxWidthClass = 'max-w-6xl',
  sizes,
}: {
  eyebrow: string
  title: string
  body: React.ReactNode
  image: string
  alt: string
  width?: number
  height?: number
  maxWidthClass?: string
  sizes?: string
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
          sizes={sizes}
          className={`mx-auto ${maxWidthClass}`}
          imageClassName="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-[1.01]"
        />
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
          Scheduled Jobs (shown as <span className="font-semibold">Jobs</span> in the sidebar, with the subtitle SQL
          Agent job health) is a read-only review surface for SQL Server Agent jobs on the connected instance. It lists
          every job with its status, last run, 7-day success rate, and next run, opens the history, steps, and schedules
          of the selected job, groups the failed runs of the last 24 hours by a heuristic root cause, and shows Database
          Mail health. It never starts, stops, enables, disables, edits, or deletes a job. The only files it writes are
          the exports and the lookup file you ask for.
        </p>
        <p className="mt-3 text-sm text-gray-700">
          The screen needs an active connection; without one it shows Please connect to a database first. Automatic
          refresh runs only while the screen is open and visible. This module is the operational companion to{' '}
          <Link href="/docs/modules/dashboard" className="font-semibold text-primary hover:text-primary-dark">
            Dashboard
          </Link>{' '}
          and{' '}
          <Link href="/docs/modules/query-statistics" className="font-semibold text-primary hover:text-primary-dark">
            Query Statistics
          </Link>
          : it is built for failure review and handoff preparation while the screen is open, not for background
          collection, centralized alerting, or job control.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm text-gray-700">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What You Can Do</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>List the SQL Agent jobs of the active instance and sort them by job, status, last run, 7d success, or next run.</li>
              <li>Spot failed, retrying, canceled, never-run, disabled, and long-running jobs with the summary line and filters.</li>
              <li>Inspect the outcomes, steps, and schedules of the selected job, with secrets in step commands masked.</li>
              <li>Review the failed step runs of the last 24 hours grouped by job, step, and error, each with a heuristic root cause.</li>
              <li>Copy read-only remediation SQL, an incident note, the error text, or the msdb history keys for a failure group.</li>
              <li>Check Database Mail health and copy the read-only T-SQL that repeats those checks in SSMS.</li>
              <li>Export the filtered job list or the failure evidence as CSV, JSON, or Excel files.</li>
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
        title="Job List and Operations Context After the First Load"
        body={
          <>
            <p>
              The screen a few seconds after opening the module on a lab instance with eight jobs. The status line reads
              Last refresh 13:49:22, the Auto interval is 30s, and the command bar shows Pause, Alerts (3), Export, and
              Refresh.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Filters:</strong> the Search box with the placeholder Name, owner, status, schedule or outcome;
                Category set to All Categories; Status set to All Statuses; the Failed in checkbox with 24h; Only long
                running (&gt;30 m); the No filters chip and the Reset button.
              </li>
              <li>
                <strong>Summary line:</strong> Jobs 8 total · 0 running · 1 failed · 3 disabled · 1 attention, with
                Showing 8 of 8 on the right. The failed count covers enabled jobs only, so the disabled
                DataLoadSimulation job appears with a Failed badge but is counted under disabled.
              </li>
              <li>
                <strong>Table:</strong> the columns Job, Status, Last Run, 7d Success, and Next Run, sorted by Job
                ascending. Each name has a second line with the category and enabled state, such as Database
                Maintenance · Enabled or [Uncategorized (Local)] · Disabled.
              </li>
              <li>
                <strong>Status and figures:</strong> Failed badges for DataLoadSimulation and FullBackup.Subplan_1 and
                Succeeded for the rest. 7d Success shows values such as 0.0%, 1.2%, 87.5% · 2.0 h, 98.0% · 24.8 h, and
                100.0%, or -- when no run finished in the window; the span after the dot says how much history msdb
                still holds when it is shorter than seven days.
              </li>
              <li>
                <strong>Next Run:</strong> a timestamp for the enabled scheduled jobs and Disabled for the three disabled
                jobs.
              </li>
              <li>
                <strong>Operations Context:</strong> opened on Alerts (3) with the Running (0), Failures (3), and Mail
                Health sub-tabs; the Running sub-tab reads No jobs are currently running.
              </li>
            </ul>
          </>
        }
        image="/docs/scheduled-jobs/001.png"
        alt="Scheduled Jobs screen with the SQL Agent Control Room command bar, the filter row, the summary line 8 total 0 running 1 failed 3 disabled 1 attention, eight job rows with status, last run, 7d success and next run, and the Operations Context panel open on Alerts with Running (0), Failures (3) and Mail Health"
        width={1628}
        height={712}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Data Sources and Refresh Model</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Job Data</div>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-mono">msdb.dbo.sysjobs</span> and <span className="font-mono">syscategories</span> for the job list; owner names come from <span className="font-mono">sys.server_principals</span> and <span className="font-mono">SUSER_SNAME</span>.</li>
              <li><span className="font-mono">msdb.dbo.sysjobactivity</span> for the live running state.</li>
              <li><span className="font-mono">msdb.dbo.sysjobhistory</span> for outcomes, 24h and 7d counts, and failures; <span className="font-mono">sysjobservers</span> supplies the last outcome when the history was purged.</li>
              <li><span className="font-mono">msdb.dbo.sysjobsteps</span>, <span className="font-mono">sysjobschedules</span>, <span className="font-mono">sysschedules</span>, and <span className="font-mono">sysproxies</span> for steps, schedules, and run context.</li>
              <li><span className="font-mono">sys.dm_server_services</span> for the SQL Server Agent service state. It needs VIEW SERVER STATE; without it the Agent state is unknown.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Mail Diagnostics</div>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-mono">sys.configurations</span> (Database Mail XPs)</li>
              <li><span className="font-mono">msdb.dbo.sysmail_profile</span> and <span className="font-mono">sysmail_principalprofile</span></li>
              <li><span className="font-mono">msdb.dbo.sysmail_unsentitems</span>, <span className="font-mono">sysmail_sentitems</span>, and <span className="font-mono">sysmail_faileditems</span></li>
              <li><span className="font-mono">msdb.dbo.sysmail_event_log</span></li>
              <li>The module reads these tables only; it never sends a test mail.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Refresh Behavior</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Auto refresh runs every 10s, 30s (default), or 60s, or is turned Off; Pause and Resume suspend it.</li>
              <li>Each cycle reads the running state and the Agent state live. The job list is served from a cache for up to 120 seconds and the failure groups for up to 60 seconds; Refresh bypasses both and also re-reads Database Mail health.</li>
              <li>The job list is re-read early when a cached enabled job reaches its next run time (once the snapshot is at least 60 seconds old) or when a running job finishes.</li>
              <li>After a failed job-list read the next automatic attempt waits 30, then 60, then 120 seconds; a manual Refresh skips the wait.</li>
              <li>When the window is hidden the timer stops. On return the screen refreshes once if a full interval has passed, unless the interval is Off or refresh is paused.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Permissions and Partial Data</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>If the job tables cannot be read, the error reads SQL Agent jobs could not be read: followed by the reason and a hint. For a permission failure the hint asks you to grant the monitoring login SELECT on the msdb tables and refresh. The tables are listed in the example script on the Installation page.</li>
              <li>If SELECT on <span className="font-mono">msdb.dbo.sysjobactivity</span> is denied, the jobs still load without the live running state, and the status line explains that the running state and SQL Agent&apos;s own next run times are unavailable because access to that table was denied.</li>
              <li>If a secondary read fails (for example the failure groups), the status line shows Partial data and names what is missing, such as failures unavailable.</li>
              <li>If individual job history, steps, or schedules cannot be read, Job Detail shows the evidence that was available with the warning Some job evidence could not be read. Check msdb permissions.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Command Bar, Filters, and Job List</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Command Bar and Status Line</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Auto with 10s, 30s, 60s, or Off, then Pause / Resume.</li>
              <li>Alerts, shown as Alerts (N) when there are N failure groups.</li>
              <li>Export with CSV or Excel for the currently filtered job list, and Refresh.</li>
              <li>During a load the status line reads Refreshing SQL Agent jobs..., then the progress texts Reading SQL Agent job health... (20%), Classifying failures and running jobs... (70%), and SQL Agent workspace ready. (100%).</li>
              <li>Afterwards it reads Last refresh HH:MM:SS. A warning replaces that text in the same line: a stopped Agent note (SQL Server Agent is not running, schedules will not fire), a Partial data note, or a stale note of the form Last refresh failed at HH:MM:SS: reason · showing data from HH:MM:SS.</li>
              <li>If no snapshot can be loaded at all, the list area shows SQL Agent unavailable with the reason.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Filters</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Search matches the job name, owner, category, status, latest outcome, run context, schedule text, and outcome message.</li>
              <li>Category lists the categories present in the snapshot.</li>
              <li>Status: All Statuses, Running, Failed, Succeeded, Retry, Canceled, Never run, Disabled, or Needs Attention.</li>
              <li>Failed in 24h or 7d keeps the jobs whose latest run failed inside that window; it does not look at every failure in the window.</li>
              <li>Only long running (&gt;N m) keeps the running jobs flagged as long running; N is the threshold from Settings.</li>
              <li>Reset clears everything; the chip beside it reads No filters or N active.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Status Values</div>
            <ul className="list-disc pl-5 space-y-1">
              {statusValues.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-3">
              Needs Attention and the attention count mean: enabled jobs that failed, are retrying, were canceled, or
              never ran, plus running jobs past both the long-running threshold and twice their 7-day average. Failed
              counts enabled jobs only; a disabled job is counted under disabled.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Job Table</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Columns: Job, Status, Last Run, 7d Success, and Next Run. Click a header to sort; empty values sort last; the arrow keys move the selection.</li>
              <li>The second line of each row shows category · Enabled or Disabled, followed by Long running for a flagged running job, or Needs attention for an attention job that is not long running and whose status is not Failed.</li>
              <li>The summary line reads N total · N running · N failed · N disabled · N attention, and Showing X of Y counts the filtered rows. No matching jobs appears when the filters exclude everything.</li>
              <li>7d Success is the share of finished runs in the last seven days that succeeded, or -- when none finished. When msdb holds less than seven days of history, the covered span follows the value, as in 98.0% · 24.8 h, and the tooltip names the first counted run.</li>
              <li>Schedule text is built from the msdb schedule rows, for example Daily at 02:00, Every 5 min, or Every 30 min. With several schedules the leading one is shown plus (+N more); a job without a schedule shows On demand.</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
          <div className="font-semibold mb-1">Next Run Values</div>
          <ul className="list-disc pl-5 space-y-1">
            {nextRunValues.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-sm text-gray-700">
          The long-running threshold defaults to 30 minutes and is set in Settings &gt; Database &gt; General Query
          Settings with <span className="font-medium">Jobs Long Running Threshold (minutes)</span> (1 to 1440). A
          running job is flagged as long running only after it has exceeded both that threshold and twice its 7-day
          average duration, which avoids false alarms for jobs that are normally slow.
        </p>
      </div>

      <ScreenshotCard
        eyebrow="Screen 2"
        title="Job Detail Overview for a Disabled Job"
        body={
          <>
            <p>
              The Job Detail tab after selecting PerfLab - WWI Workload Driver in the list. The detail tabs read
              Overview, Outcomes (100), Steps (1), and Schedules (1).
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Header:</strong> the job name, the Copy menu (Job Name, Job ID, Latest Outcome), and the Open in
                SSMS button.
              </li>
              <li>
                <strong>Description line:</strong> No description available., which is the description text stored for
                this job in msdb; SQL Server Management Studio writes it when a job is created without a description.
                A job with an empty description shows No description. instead.
              </li>
              <li>
                <strong>Fact tiles:</strong> Status Succeeded, Owner, Run Context --, Last Duration 1m 36s, 7d Average
                --, and Schedule Every 30 min. The dashes mean no value is available: the job has not run in the last
                seven days, and its first step records no run-as user or proxy.
              </li>
              <li>
                <strong>Latest outcome:</strong> The job succeeded. The Job was invoked by Schedule 14 (PerfLab Every 2
                Minutes). The last step to run was step 1 (Run PerfLab driver).
              </li>
              <li>
                <strong>List state:</strong> the selected row is highlighted with Last Run 2026-04-17 23:30:00, 7d
                Success --, and Next Run Disabled, because the job is disabled.
              </li>
              <li>
                <strong>Blurred in this screenshot:</strong> the owner login in the Owner tile.
              </li>
            </ul>
          </>
        }
        image="/docs/scheduled-jobs/002.png"
        alt="Scheduled Jobs with the PerfLab - WWI Workload Driver job selected and the Job Detail Overview tab showing the Copy and Open in SSMS buttons, the description line, fact tiles for status, owner, run context, last duration, 7d average and schedule, and the latest outcome message"
        width={1633}
        height={724}
      />

      <ScreenshotCard
        eyebrow="Screen 3"
        title="Steps Tab With the Last Failed Step Flagged"
        body={
          <>
            <p>
              The Steps (12) tab of WWI_Workload_Stress_Job_1-9, a twelve-step T-SQL workload job. The detail tabs read
              Overview, Outcomes (100), Steps (12), and Schedules (1).
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Header lines:</strong> Last failed step: 12 - Faz 2 - Benchmark Expansion in red, then the
                section title Job Steps (12).
              </li>
              <li>
                <strong>Step rows:</strong> Step 1 · Step 00 - Setup, Step 2 · Test 01 - ParameterSniffing, and Step 3
                · Test 02 - CursorRBAR, each followed by the subsystem and database, TSQL · WideWorldImporters.
              </li>
              <li>
                <strong>Command block:</strong> the step&apos;s T-SQL in a dark code box; the first step ends with ALTER
                DATABASE SCOPED CONFIGURATION SET LAST_QUERY_PLAN_STATS = ON; and longer commands scroll inside the
                box.
              </li>
              <li>
                <strong>Latest history message:</strong> Executed as user: NT SERVICE\SQLAgent$TEST. The step succeeded.
                for step 1, and the longer Test 01 - ParameterSniffing message with its parameter values for step 2.
              </li>
              <li>
                <strong>Buttons:</strong> Copy Command and Copy Message under each step.
              </li>
              <li>
                <strong>List state:</strong> the selected row shows Succeeded, 7d Success 87.5% · 2.1 h, and Next Run
                2026-10-07 14:00:00.
              </li>
            </ul>
          </>
        }
        image="/docs/scheduled-jobs/003.png"
        alt="Scheduled Jobs with the WWI_Workload_Stress_Job_1-9 job selected and the Steps (12) tab showing Last failed step 12, the Job Steps list with step names, subsystem and database, T-SQL command boxes, latest history messages and Copy Command and Copy Message buttons"
        width={1633}
        height={900}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Operations Context and Job Detail</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Panel Behavior</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>The panel is titled Operations Context and has the tabs Job Detail and Alerts (shown as Alerts (N) with the failure-group count). It opens on Alerts; selecting a job switches to Job Detail.</li>
              <li>Below about 1050 px of width a Jobs / Context switch shows one panel at a time.</li>
              <li>While a job loads the panel reads Loading job evidence. If the selected job is no longer in the snapshot it reads Job unavailable with the hint Select a job from the list.</li>
              <li>Job Detail is re-read when the list renders (a refresh or auto-refresh cycle) and the loaded detail is about two minutes old while Job Detail is the active view, or when you switch back to Job Detail. With Auto set to Off or refresh paused it does not reload on its own.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Overview</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>The job description (or No description.) and the facts Status, Owner, Run Context, Last Duration, 7d Average, and Schedule. Run Context is the run-as user of the first step plus its proxy. When the history covers less than seven days the average label becomes Average · last span.</li>
              <li>The Latest outcome box with the message of the latest run.</li>
              <li>The Copy menu with Job Name, Job ID, and Latest Outcome.</li>
              <li>Open in SSMS writes a read-only lookup SELECT for the job, its steps, and its schedules to a temporary .sql file and opens it with the program Windows associates with .sql files, without a confirmation. The toast reads The lookup query was handed to your .sql file handler. If the file cannot be opened, the query goes to the clipboard or a dialog instead. Lookup files older than 24 hours are removed the next time Open in SSMS is used.</li>
              <li>The warning Some job evidence could not be read. Check msdb permissions. appears on this tab when parts of the evidence failed to load.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Outcomes and Steps</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Outcomes shows the last 24h and last 7d success rates, then Recent Outcomes (n) with status, duration, retries, and message per run. At most the newest 200 history rows are read; when more exist the tab reads Outcomes (200+) and a note says that older rows exist.</li>
              <li>Steps starts with Last failed step: N - name (or none), adding in the latest 200 history rows when the history was cut, then Job Steps (n).</li>
              <li>Each step shows its subsystem and database (or Subsystem unavailable), the command, the Latest history message, and the Copy Command and Copy Message buttons; the failed step carries a Last failed badge.</li>
              <li>Passwords, tokens, connection strings, and similar secrets in step commands are replaced with ***REDACTED*** before display, copy, and export.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Schedules and Long Lists</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Schedules shows each schedule with an Enabled or Disabled badge, its name, the frequency text, and its next run (a timestamp, Agent stopped, an event trigger, Not reported, or Not scheduled).</li>
              <li>Outcomes, Steps, and Schedules show 25 rows first, then Show all N and Show fewer.</li>
              <li>An empty section reads No evidence returned.</li>
            </ul>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 4"
        title="Alerts: Grouped Failures From the Last 24 Hours"
        body={
          <>
            <p>
              The Failures (3) sub-tab of the Operations Context panel, cropped to the panel. The caption reads Grouped
              failures from the last 24 hours, with the Export menu on the right and the line Top root causes: Other
              (2), Job owner access (1) below it.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Group header:</strong> the repeat badge 1×, the job name, and the line root cause · step · last
                seen, for example Other · Step 1 · 2026-10-07 12:30:00 for SIM_SalesCycle and Job owner access · Job
                level · 2026-10-07 04:00:00 for FullBackup.Subplan_1.
              </li>
              <li>
                <strong>Error text:</strong> the step message as msdb recorded it. The two Other groups show the same
                killed-session error (Unspecified error occurred on SQL Server … Cannot continue the execution because
                the session is in the kill state … The step failed.) for different jobs, so they stay separate groups.
              </li>
              <li>
                <strong>Buttons:</strong> Open Job, Copy Remediation SQL, Copy Incident Note, Copy Error, Copy msdb
                Refs, and Open Docs. Mail Checks is absent because none of these failures is mail-related.
              </li>
              <li>
                <strong>Other sub-tabs:</strong> Running (0) and Mail Health.
              </li>
              <li>
                <strong>Blurred in this screenshot:</strong> the job owner&apos;s domain account, which appears twice in
                the FullBackup.Subplan_1 error text.
              </li>
            </ul>
          </>
        }
        image="/docs/scheduled-jobs/004.png"
        alt="Operations Context panel on the Failures (3) sub-tab listing three grouped failures with repeat badges, root cause, step and last seen lines, error text and the buttons Open Job, Copy Remediation SQL, Copy Incident Note, Copy Error, Copy msdb Refs and Open Docs"
        width={530}
        height={808}
        maxWidthClass="max-w-[530px]"
        sizes="(min-width: 640px) 530px, 100vw"
      />

      <ScreenshotCard
        eyebrow="Screen 5"
        title="A Running Job in the List While Failures Stay Open"
        body={
          <>
            <p>
              The same instance a few minutes later, while WWI_Workload_Stress_Job_1-9 is executing. Its badge reads
              Running, the summary line reads 8 total · 1 running · 1 failed · 3 disabled · 1 attention, and the
              sub-tab label reads Running (1).
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Running row:</strong> Last Run 2026-10-07 13:45:00 is the start of the current run; 7d Success
                87.5% · 2.1 h and Next Run 2026-10-07 14:00:00 are unchanged. The second line carries no Long running
                marker because the run has not passed the 30-minute threshold.
              </li>
              <li>
                <strong>Right panel:</strong> Failures (3) stays selected with the same three groups and their buttons.
                Alerts (3) counts failure groups, not running jobs.
              </li>
              <li>
                <strong>Attention count:</strong> still 1, because FullBackup.Subplan_1 is the only enabled job whose
                latest outcome is a failure.
              </li>
              <li>
                <strong>Blurred in this screenshot:</strong> the job owner&apos;s domain account in the
                FullBackup.Subplan_1 error text.
              </li>
            </ul>
          </>
        }
        image="/docs/scheduled-jobs/005.png"
        alt="Scheduled Jobs with WWI_Workload_Stress_Job_1-9 showing the Running badge, the summary line with 1 running, the Running (1) sub-tab label, and the Failures (3) sub-tab still open with three grouped failures"
        width={1629}
        height={910}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Alerts and Failure Triage</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Running</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Each running job is a card with a RUN badge, the job name, Last completed: step (or No completed step yet) with the elapsed time, and Started time · ETA time.</li>
              <li>ETA is the start time plus the job&apos;s 7-day average duration; without an average it shows a dash.</li>
              <li>Empty states: No jobs are currently running., or SQL Server Agent is stopped, so no job is running. when the Agent service is down. Activity rows the stopped Agent left open are not counted as runs.</li>
              <li>The tab is informational only; there is no stop action.</li>
              <li>The Running and Failures counts show ? before the first load and after a failed read.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Failures</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Failed step runs from the last 24 hours are grouped by job, step, and normalized error text (timestamps, identifiers, numbers, and quoted object names are ignored, so a rerun of the same failure joins the same group).</li>
              <li>At most the newest 50 failed runs per step are read. The badge reads N× for a full count and N+× when more runs exist; its tooltip gives the real number of failed runs of that step in the window.</li>
              <li>The line Top root causes: lists the four most frequent causes with their counts, or none.</li>
              <li>Each group shows root cause · step (or Job level) · last seen and the error text.</li>
              <li>Export offers Groups (CSV), Groups (JSON), Groups (Excel), All runs (CSV), All runs (JSON), and All runs (Excel).</li>
              <li>A button used after a refresh removed its group answers Failure group is no longer available.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Root-Cause Heuristics</div>
            <p className="mb-2">
              The error text is matched against these rules in order; the first match wins, and anything else is Other.
              The label is a heuristic for triage, not a verified diagnosis, and the exports call the column Root Cause
              (heuristic).
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              {rootCauses.map((cause) => (
                <li key={cause}>{cause}</li>
              ))}
            </ol>
            <p className="mt-2">
              Mail-related errors are additionally classified as Permission, Profile, SMTP, or Database Mail; everything
              else is Not mail-related.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Failure Tools</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Open Job selects the failing job and opens its Job Detail.</li>
              <li>Copy Remediation SQL copies a diagnostic script that starts with Read-only remediation helper. Execute manually in SSMS after review., lists the last 20 history rows of the step, and adds cause-specific lookups (proxy and credential rows for Proxy permission and Permission denied, Database Mail profile, unsent, failed, and event-log rows for mail failures). For Job owner access the only change statement, <span className="font-mono">sp_update_job</span>, is included as a comment; nothing is executed.</li>
              <li>Copy Incident Note copies a plain-text Incident Summary with the job, step, last seen time, repeat count, heuristic root cause, the error text (cut at 400 characters), and a suggested action.</li>
              <li>Copy Error copies the error text. Copy msdb Refs copies a header naming the job and step plus up to 20 <span className="font-mono">sysjobhistory</span> keys, with ... and N more when the group has more rows.</li>
              <li>Open Docs opens the matching Microsoft Learn page, or a Learn search, in your default browser; only http and https links are opened.</li>
              <li>Mail Checks appears on mail-related groups only and opens Mail Health with the line Mail classification: kind at the top.</li>
            </ul>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 6"
        title="Mail Health on an Instance Without Database Mail"
        body={
          <>
            <p>
              The Mail Health sub-tab on the lab instance, where Database Mail has never been configured. Every tile has
              a value, so the picture is complete rather than empty.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Tiles:</strong> Database Mail Disabled, Profiles 0, Default Profiles 0, Pending Mail 0, Last
                Success —, and Last Error None logged.
              </li>
              <li>
                <strong>Event box:</strong> the heading Latest Database Mail event and the text The Database Mail event
                log is empty.
              </li>
              <li>
                <strong>Footer:</strong> the sentence Read-only T-SQL for repeating these checks in SSMS. next to the
                Copy Checks SQL button.
              </li>
              <li>
                <strong>Other sub-tabs:</strong> Running (1) and Failures (3), the same state as the previous screen.
              </li>
            </ul>
          </>
        }
        image="/docs/scheduled-jobs/006.png"
        alt="Operations Context panel on the Mail Health sub-tab showing the tiles Database Mail Disabled, Profiles 0, Default Profiles 0, Pending Mail 0, Last Success and Last Error None logged, the Latest Database Mail event box reading The Database Mail event log is empty, and the Copy Checks SQL button"
        width={532}
        height={807}
        maxWidthClass="max-w-[532px]"
        sizes="(min-width: 640px) 532px, 100vw"
      />

      <ScreenshotCard
        eyebrow="Screen 7"
        title="A Canceled Run Marked Needs Attention, With the Schedules Tab"
        body={
          <>
            <p>
              After the running WWI_Workload_Stress_Job_1-9 run was stopped (the application itself cannot stop a job),
              the row shows the Canceled badge, Last Run 2026-10-07 13:53:34, 7d Success 85.7% · 1.9 h, and the second
              line [Uncategorized (Local)] · Enabled · Needs attention.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Summary line:</strong> 8 total · 0 running · 1 failed · 3 disabled · 2 attention. The canceled
                job now counts toward attention alongside the failed FullBackup.Subplan_1.
              </li>
              <li>
                <strong>Schedules (1) tab:</strong> an Enabled badge, the schedule name Every 15 minutes, the frequency
                Every 15 min, and next run 2026-10-07 14:00:00.
              </li>
              <li>
                <strong>Detail tabs:</strong> Overview, Outcomes (100), Steps (12), and Schedules (1); Alerts (3) is
                unchanged because a canceled run is not a failure group.
              </li>
            </ul>
          </>
        }
        image="/docs/scheduled-jobs/007.png"
        alt="Scheduled Jobs with WWI_Workload_Stress_Job_1-9 showing the Canceled badge and the Needs attention marker, the summary line with 2 attention, and the Job Detail Schedules (1) tab with an Enabled schedule named Every 15 minutes, frequency Every 15 min and next run 2026-10-07 14:00:00"
        width={1620}
        height={706}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Mail Health, Exports, and Settings</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Mail Health</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Tiles: Database Mail (Enabled, Disabled, or Unknown), Profiles, Default Profiles, Pending Mail, Last Success, and Last Error or Last Warning (a timestamp, None logged, or Unknown).</li>
              <li>Below the tiles: Latest Database Mail error, Latest Database Mail warning, or Latest Database Mail event with the event text, or The Database Mail event log is empty. or The Database Mail event log could not be read.</li>
              <li>Copy Checks SQL copies the read-only T-SQL that repeats these checks in SSMS; it is offered even when the health read failed and the tab shows Mail health unavailable.</li>
              <li>The result is cached for two minutes, or 15 seconds after an error; Refresh re-reads it.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Exports</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>The command bar Export saves the currently filtered job list as CSV or Excel; the save dialog opens in your home folder with a name such as scheduled_jobs_YYYYMMDD_HHMMSS.</li>
              <li>The Failures Export saves the groups (failed_job_groups_…) or all failed runs (failed_jobs_…) as CSV, JSON, or Excel. JSON files use the raw field names rather than the column labels.</li>
              <li>CSV files are UTF-8 with a byte order mark; Excel files use the sheets Jobs and Failures. Cell values that a spreadsheet would treat as formulas are neutralized in both formats.</li>
              <li>Failure exports stop at Jobs Failed Export Limit (200 by default). The toast then reads Exported N of M group(s), or row(s), to the file name (limit L; raise Jobs Failed Export Limit in Settings).</li>
              <li>Empty exports answer No filtered jobs to export. or No failed jobs to export.; cancelling the dialog is silent.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Settings</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Settings &gt; Database &gt; General Query Settings holds <span className="font-medium">Jobs Long Running Threshold (minutes)</span>, 1 to 1440, default 30.</li>
              <li><span className="font-medium">Jobs Failed Export Limit</span>, 1 to 100000, default 200, caps the failure exports.</li>
              <li><span className="font-medium">Query Timeout (seconds)</span> applies to the msdb queries as well.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Operator Notes</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>The module is read-only. Copied SQL is for manual review in SSMS; nothing is executed from this screen.</li>
              <li><span className="font-medium">Failed in</span> is based on each job&apos;s latest outcome, not on every failure in the window.</li>
              <li>Root-cause labels and mail classifications are heuristic and may need manual confirmation.</li>
              <li>Running-job visibility needs SELECT on <span className="font-mono">sysjobactivity</span>; ETA needs 7-day history.</li>
              <li>When SQL Server Agent is stopped, Next Run shows Agent stopped for scheduled jobs and the status line says so; the application cannot start the service.</li>
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
          <li>Open Scheduled Jobs and read the summary line for the failed and attention counts.</li>
          <li>Narrow the list with Search, Category, Status, or the Failed in and Only long running filters.</li>
          <li>Select a job and review its Overview, Outcomes, Steps, and Schedules.</li>
          <li>Open Alerts &gt; Failures to see the repeated step failures grouped by root cause.</li>
          <li>Copy the remediation SQL, an incident note, or the msdb references, or export the groups for deeper triage.</li>
          <li>Check Mail Health when the failure is mail-related, and use Open in SSMS when you want to continue in SSMS.</li>
        </ol>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Troubleshooting</div>
        <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
          <li><span className="font-medium">SQL Agent jobs could not be read:</span> grant the monitoring login SELECT on the msdb job tables, then press Refresh; a busy msdb (lock wait or timeout) only needs another Refresh.</li>
          <li><span className="font-medium">Partial data in the status line:</span> the named source (for example sysjobactivity or failures) could not be read; the rest of the screen is current.</li>
          <li><span className="font-medium">Next Run shows Agent stopped:</span> the SQL Server Agent service is not running. Start it from the server side; the application only reports it.</li>
          <li><span className="font-medium">Next Run shows Not reported:</span> msdb holds no upcoming run time for the job; the schedule may have ended or the Agent may be stopped.</li>
          <li><span className="font-medium">Open in SSMS copies to the clipboard instead:</span> Windows could not open the .sql file, usually because no program is registered for .sql files.</li>
          <li><span className="font-medium">Job unavailable in Job Detail:</span> the job left the snapshot; select a job from the list again.</li>
          <li><span className="font-medium">Alerts counts show ?:</span> the first load has not finished or the last read failed; press Refresh.</li>
        </ul>
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
