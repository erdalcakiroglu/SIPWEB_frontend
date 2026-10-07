import LightboxImage from './LightboxImage'

type DashboardMetric = {
  name: string
  meaning: string
  interpretation: string
}

type DashboardMetricSection = {
  id: string
  title: string
  description: string
  metrics: DashboardMetric[]
}

type AuditCheckGroup = {
  category: string
  checks: string[]
}

const metricSections: DashboardMetricSection[] = [
  {
    id: 'server-health',
    title: 'Server Health',
    description:
      'Scheduler and worker utilization. These rows tell you whether the host or the SQL Server process is under CPU, scheduler, or worker thread pressure.',
    metrics: [
      {
        name: 'CPU %',
        meaning:
          'Overall operating system CPU utilization across all cores, read from the SQL Server scheduler monitor ring buffer. Use it to see whether the host itself is CPU-bound, including pressure from non-SQL processes.',
        interpretation: 'Below 70% is normal, 70% up to 90% is warning, and 90% or higher is critical.',
      },
      {
        name: 'SQL CPU %',
        meaning:
          'CPU utilization of the SQL Server process, from the same ring buffer sample. Compare it with CPU %: sustained high SQL CPU usually points to CPU-heavy queries, excessive parallelism, or high compilation.',
        interpretation: 'Below 70% is normal, 70% up to 90% is warning, and 90% or higher is critical.',
      },
      {
        name: 'Active Sessions',
        meaning:
          'Counts user sessions that are currently running or runnable. System sessions, SQL Server Agent, Database Mail, and Report Server connections, and the session Dashboard itself uses are excluded. The tile caption shows how many user sessions are connected in total (for example "of 42 connected").',
        interpretation:
          'Informational only: there is no universal warning threshold. Compare it with the normal workload pattern of this server and move to Query Statistics or Blocking Analysis when it changes unexpectedly.',
      },
      {
        name: 'Runnable / CPU',
        meaning:
          'Scheduler queue pressure: tasks waiting on the visible online schedulers, divided by the logical CPU count. The small caption under the bar shows the raw total and the CPU count. A value near 1 means roughly one waiting task per logical CPU, which is a stronger CPU pressure signal than an unscaled queue length.',
        interpretation:
          'Below 0.10 is good, 0.10 up to 1.00 is warning, and 1.00 or higher is critical. Shows N/A when the CPU count cannot be read.',
      },
      {
        name: 'Workers',
        meaning:
          'Total worker threads across all visible online schedulers. The bar shows current workers as a percentage of the instance maximum worker thread count.',
        interpretation:
          'Below 80% of the maximum is normal, 80% up to 95% is warning, and 95% or higher is critical. Correlate sustained high usage with THREADPOOL waits in Wait Statistics.',
      },
    ],
  },
  {
    id: 'memory-health',
    title: 'Memory Health',
    description:
      'Buffer pool and memory pressure. These rows show SQL Server memory against its target and configured cap, host memory headroom, and buffer pool behavior.',
    metrics: [
      {
        name: 'SQL Memory Used',
        meaning:
          'Total Server Memory: how much memory SQL Server has currently committed for its memory manager. In a steady state it usually approaches SQL Memory Target. If it stays well below the target, look for external memory pressure or a restrictive max server memory setting.',
        interpretation:
          'Rated by its ratio to SQL Memory Target: above 90% is good, above 75% up to 90% is warning, and 75% or lower is critical. The bar shows the percentage of target.',
      },
      {
        name: 'SQL Memory Target',
        meaning:
          'Target Server Memory: how much memory SQL Server wants to use under current conditions. Read it together with SQL Memory Used, Max Server Memory, and PLE rather than on its own.',
        interpretation: 'No alert threshold. It is the reference value for the SQL Memory Used ratio.',
      },
      {
        name: 'Max Server Memory',
        meaning:
          'The configured max server memory (MB) value. "Unlimited" means the default 2,147,483,647 MB setting is still active; it does not mean SQL Server has that much RAM. Otherwise the caption shows the cap as a percentage of host RAM.',
        interpretation:
          'Shown as a warning when the default unlimited setting is still in place, because nothing then reserves memory for Windows and other processes. A configured cap is shown as neutral.',
      },
      {
        name: 'Host Physical RAM',
        meaning:
          'Total physical memory visible to the SQL Server host. It is context for the memory cap and OS headroom, not memory allocated by SQL Server.',
        interpretation: 'No alert threshold.',
      },
      {
        name: 'OS Available Memory',
        meaning:
          'Physical memory currently available to Windows. The bar shows the percentage of host RAM that is still free. Low values can indicate external memory pressure on the SQL Server host.',
        interpretation:
          'Above 20% free is good, above 10% up to 20% is warning, and 10% or lower is critical.',
      },
      {
        name: 'PLE',
        meaning:
          'Page Life Expectancy: approximately how long a data page stays in the buffer pool, in seconds. The target is not a fixed 300 seconds: it scales at 300 seconds per 4 GB of SQL Memory Used, with a 300-second minimum, and the caption shows the target in use. Sharp drops usually indicate buffer churn from large scans, memory grants, or external pressure.',
        interpretation:
          'Above the target is good. The critical line is 25% of the target (never below 60 seconds): values above it but not above the target are warning, and values at or below it are critical. Example: with 32 GB in use the target is 2,400 seconds and 600 seconds or lower is critical.',
      },
      {
        name: 'Buffer Cache Health',
        meaning:
          'A composite buffer cache signal led by Buffer Cache Hit Ratio (%). A low hit ratio alone does not raise an alert: it must be corroborated by low PLE, physical page reads, or rising read latency. The caption shows the PLE and read latency used for the decision.',
        interpretation:
          'Critical when the hit ratio is below 90% and either PLE is below its critical line or read latency is 20 ms or higher. Warning when the hit ratio is below 95% and at least one of these is true: PLE is below its target, read latency is 5 ms or higher, or physical page reads occurred in the interval. Otherwise good.',
      },
      {
        name: 'Page Reads/sec',
        meaning:
          'Physical database page reads per second during the current refresh interval. Shown as workload context. It becomes actionable when Buffer Cache Hit Ratio or PLE falls and read latency rises at the same time.',
        interpretation:
          'No fixed threshold. The bar is relative to the recent peak, which decays gradually. The first refresh shows "awaiting baseline".',
      },
    ],
  },
  {
    id: 'workload',
    title: 'Workload',
    description:
      'Throughput and compilation activity. Rates are averaged over the current refresh interval, and compile activity is expressed as ratios so it can be read the same way on busy and quiet servers.',
    metrics: [
      {
        name: 'Batch/sec',
        meaning:
          'Batch Requests/sec, computed from the change in the cumulative performance counter over the refresh interval. A high-level workload intensity signal: sudden spikes often correlate with CPU and IO increases.',
        interpretation: 'No fixed threshold. The bar and caption compare the current rate with the recent peak.',
      },
      {
        name: 'Transactions/sec',
        meaning:
          'Transactional throughput over the refresh interval. Comparing it with Batch/sec shows how much of the request volume is truly transactional.',
        interpretation: 'No fixed threshold. The bar and caption compare the current rate with the recent peak.',
      },
      {
        name: 'Compile / Batch',
        meaning:
          'SQL compilations as a percentage of batch requests in the interval; the caption shows the raw compilations/sec and batches/sec. A high ratio can indicate ad hoc queries, missing parameterization, or plan cache churn that drives CPU without increasing throughput.',
        interpretation:
          'Below 10% is normal, 10% up to 20% is warning, and 20% or higher is critical. Shows N/A when there were no batches in the interval.',
      },
      {
        name: 'Recompile / Compile',
        meaning:
          'SQL recompilations as a percentage of compilations in the interval. Recompiles can come from statistics changes, temp table usage, schema changes, or RECOMPILE hints, and add CPU overhead.',
        interpretation:
          'Below 10% is normal, 10% up to 25% is warning, and 25% or higher is critical. Shows N/A when there were no compilations in the interval.',
      },
    ],
  },
  {
    id: 'storage-io',
    title: 'Storage & I/O',
    description:
      'Latency and disk queue pressure. Latencies are interval values calculated from the change in sys.dm_io_virtual_file_stats between refreshes, not lifetime averages since startup.',
    metrics: [
      {
        name: 'IO Read Latency',
        meaning:
          'Average read latency in milliseconds, weighted across database files. The first refresh, or an interval with no reads, falls back to the lifetime average until an interval baseline exists.',
        interpretation:
          'Below 5 ms is normal, 5 ms up to 20 ms is warning, and 20 ms or higher is critical. Shows N/A when no value is available.',
      },
      {
        name: 'IO Write Latency',
        meaning:
          'Average write latency in milliseconds, weighted across database files, with the same lifetime fallback on the first sample. Sustained high write latency can affect checkpoints, TempDB activity, and throughput.',
        interpretation: 'Below 5 ms is normal, 5 ms up to 20 ms is warning, and 20 ms or higher is critical.',
      },
      {
        name: 'Log Write Latency',
        meaning:
          'Average write latency for transaction log files only. High values often show up as WRITELOG waits and directly affect commit latency.',
        interpretation: 'Below 5 ms is normal, 5 ms up to 20 ms is warning, and 20 ms or higher is critical.',
      },
      {
        name: 'Disk Queue Length',
        meaning:
          'A best-effort proxy for backed-up storage: the number of pending IO requests in sys.dm_io_pending_io_requests. Because a single sample is noisy, the caption counts consecutive pressure samples (a value of 2 or more).',
        interpretation:
          'Rated only after three consecutive refreshes at 2 or more; until then the row stays neutral. Once sustained, 2 up to 10 is warning and 10 or more is critical.',
      },
    ],
  },
  {
    id: 'tempdb',
    title: 'TempDB',
    description:
      'Allocation pressure and contention. These rows cover TempDB space and log usage, data file layout, autogrowth settings, and allocation page contention. If the TempDB snapshot cannot be read, every TempDB row shows N/A instead of misleading zeros.',
    metrics: [
      {
        name: 'TempDB Usage',
        meaning:
          'Percentage of TempDB data file space in use. High values may be caused by temp tables, sort and hash spills, version store growth, or large index operations.',
        interpretation: 'Below 50% is good, 50% up to 80% is warning, and 80% or higher is critical.',
      },
      {
        name: 'TempDB Log Used',
        meaning:
          'Percentage of the TempDB transaction log in use. Rapid growth can point to long-running transactions, heavy version store activity, or large TempDB writes that keep the log active.',
        interpretation: 'Below 15% is good, 15% up to 30% is warning, and 30% or higher is critical.',
      },
      {
        name: 'Data Used',
        meaning:
          'Allocated space across TempDB data files in MB. The caption shows the current total data file capacity.',
        interpretation: 'Follows the TempDB Usage status.',
      },
      {
        name: 'Data Free',
        meaning:
          'Currently unallocated space inside TempDB data files in MB. This is reusable file space, not free disk capacity.',
        interpretation: 'No alert threshold. The caption shows the free percentage.',
      },
      {
        name: 'Data Files',
        meaning:
          'Number of TempDB data files. The caption shows the size spread between the largest and smallest file; equally sized files let proportional fill distribute allocations predictably.',
        interpretation: 'Warning when there is more than one data file and the size spread is above 20%.',
      },
      {
        name: 'File Growth',
        meaning:
          'TempDB data file autogrowth configuration: a fixed MB increment (or range), "Percent" when files use percentage growth, or "Disabled".',
        interpretation:
          'Percentage growth is shown as warning. Any data file with autogrowth disabled is shown as critical, because full files can then cause allocation failures.',
      },
      {
        name: 'PFS/GAM Waits',
        meaning:
          'A best-effort TempDB allocation contention signal: current PAGELATCH waits on TempDB PFS, GAM, and SGAM allocation pages, from sys.dm_os_waiting_tasks. The caption shows the trend versus the previous refresh and the data file count.',
        interpretation: '0 is good, 1 to 9 is warning, and 10 or more is critical.',
      },
    ],
  },
]

const panelBadges = [
  { label: 'Healthy', text: 'Every rated row in the panel is good or normal.' },
  { label: 'N warning', text: 'At least one row is in warning and none are critical.' },
  { label: 'N critical', text: 'At least one row is critical. Critical takes precedence over warnings.' },
  {
    label: 'Learning baseline',
    text: 'No warnings, but a rate-based row is still waiting for its second sample (shown as "awaiting baseline").',
  },
  { label: 'No data', text: 'No metrics have been loaded yet, or the connection was closed.' },
]

const auditCheckGroups: AuditCheckGroup[] = [
  {
    category: 'Instance',
    checks: [
      'Max server memory left at the unlimited default, or set to the host RAM or higher (Warning). A value above host RAM minus the larger of 4 GB or 10% is reported as Info, with a suggested cap that leaves that much for the OS.',
      'MAXDOP left at 0 (Warning), or set above a topology-based upper bound (Info). On a single NUMA node the bound is the smaller of 8 and the logical cores; on multi-node servers it is the logical cores per node, halved above 16 per node and never above 16.',
      'Cost threshold for parallelism at the default of 5 or lower (Warning); the suggested starting point is 50.',
      'Optimize for ad hoc workloads, backup compression default, and remote dedicated admin connection (DAC) disabled (Info).',
      'Lock Pages in Memory not in use (Info) and Instant File Initialization disabled (Warning, SQL Server 2016 and later).',
    ],
  },
  {
    category: 'Database',
    checks: [
      'Checked across online, read-write user databases (snapshots excluded).',
      'Query Store disabled (Warning, SQL Server 2016 and later) and Read Committed Snapshot Isolation disabled (Info).',
      'Query Store switched on but not capturing (Warning), or at 90% or more of its size limit (Info). A database-scoped MAXDOP above the topology-based bound is reported as Info (SQL Server 2016 and later).',
      'AUTO_CREATE_STATISTICS or AUTO_UPDATE_STATISTICS disabled (Warning).',
      'PAGE_VERIFY set to NONE on any checked database (Critical); any other setting that is not CHECKSUM (Warning).',
      'Accelerated Database Recovery disabled (Info, SQL Server 2019 and later) and a recovery model overview to compare with your RPO (Info).',
    ],
  },
  {
    category: 'Storage',
    checks: [
      'TempDB with a single data file on a multi-core server (Warning) or fewer data files than min(8, cores) (Info).',
      'TempDB data files of unequal size (Warning above a 20% spread, otherwise Info), with autogrowth disabled (Warning), or with percentage autogrowth (Warning).',
      'TempDB log with autogrowth disabled or percentage growth (Warning), or fixed growth smaller than 64 MB (Info).',
      'User database files with percentage autogrowth (Warning), fixed growth smaller than 64 MB (Info), or autogrowth disabled (Info).',
      'An Info item listing host-level settings that cannot be read through T-SQL and must be verified manually: power plan and volume allocation unit size.',
    ],
  },
  {
    category: 'Monitoring',
    checks: ['The system_health Extended Events session, which captures deadlock graphs by default, is not running (Warning).'],
  },
]

const auditFindingFields = [
  'Severity badge (Critical, Warning, Info, or Pass) and category (Instance, Database, Storage, or Monitoring).',
  'Finding title and a short explanation of why the setting matters.',
  'Current value and Recommended value, when the check has them.',
  'Recommendation: the suggested action.',
  'Evidence: the affected databases or files behind the finding (the first 12 are listed, with a count of the rest).',
  'Copy button that puts the finding on the clipboard as plain text for a ticket or change request.',
]

const interpretationGuide = [
  'If CPU % is high but SQL CPU % is low, pressure is more likely coming from a non-SQL process on the host.',
  'If SQL CPU % and Runnable / CPU are both high, SQL Server CPU pressure is more likely to be real; check Workers as well if THREADPOOL waits are suspected.',
  'If PLE falls below its target, Buffer Cache Health turns warning, and Page Reads/sec rises, investigate memory pressure and large scans first.',
  'If OS Available Memory is low while SQL Memory Used stays well below SQL Memory Target, look for external memory pressure and review Max Server Memory.',
  'If Compile / Batch or Recompile / Compile is high, review plan cache behavior, parameterization, and query design in Query Statistics.',
  'If IO read, write, and log latency and a sustained disk queue rise together, storage latency is a likely factor.',
  'If TempDB Usage, TempDB Log Used, and PFS/GAM Waits rise together, review TempDB sizing, file layout, and spill-heavy workloads.',
]

const workflowSteps = [
  'Open Dashboard (Overview in the sidebar) after connecting to confirm the current operating picture.',
  'Scan the panel badges to find the panel that is in warning or critical state.',
  'Compare abnormal rows across CPU, memory, workload, storage, and TempDB instead of reading one metric in isolation. Start auto refresh if you need to watch the direction over several samples.',
  'Use the combined pattern to decide whether the likely problem area is CPU, memory, storage, TempDB, or workload shape.',
  'Run the Configuration Audit when the pattern suggests a configuration cause, such as unlimited max server memory, MAXDOP at 0, or a single TempDB data file.',
  'Then move to Query Statistics, Wait Statistics, Blocking Analysis, Object Explorer, or another deeper module.',
]

const behaviorNotes = [
  'Metrics refresh when Dashboard opens, when the active connection changes, when you click Refresh, and on the selected interval while auto refresh is running.',
  'Only one refresh runs at a time. A refresh requested while another is in flight is queued and runs as soon as the first one finishes.',
  'Batch/sec, Transactions/sec, Compile / Batch, Recompile / Compile, and Page Reads/sec are rate metrics averaged over the current refresh interval. On the first refresh they show "awaiting baseline" until a prior sample exists.',
  'IO latencies use the lifetime average on the first refresh and interval values from the second refresh onward.',
  'When the active connection changes, rate baselines, latency baselines, and peak references are reset so counters from different servers are not mixed together.',
  'If a refresh fails, a short "Refresh error" message appears in the status strip and the last good values stay on screen.',
  'Dashboard and the Configuration Audit are read-only and do not change any server setting.',
]

const limitations = [
  'Dashboard is designed for fast triage, not full root-cause analysis.',
  'It samples only while the desktop application is open. It does not keep a metric history, run in the background, or send alerts.',
  'Some signals depend on SQL Server visibility and can be partial if permissions are limited. Configuration Audit checks that cannot run are reported as skipped.',
  'Rate-based counters are more meaningful from the second refresh onward, and Disk Queue Length needs three consecutive pressure samples before it is rated.',
  'Thresholds are general guidance. Use trend and correlation across panels rather than treating one metric as conclusive on its own.',
]

export default function DashboardTemplate() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="overview" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Overview
        </h2>
        <p className="text-sm text-gray-700">
          Dashboard, shown as <span className="font-medium">Overview</span> in the application sidebar, is an
          on-demand SQL Server health snapshot for the active connection. It groups CPU, scheduler, memory, workload,
          storage latency, and TempDB signals into five panels with status colors and threshold-based badges, and it
          includes a read-only Configuration Audit that checks instance, database, and TempDB settings against common
          best practices. Refresh the current evidence, identify the pressure area, then move to a deeper module for
          investigation. It does not collect data while the desktop application is closed.
        </p>
        <div className="mt-4 grid gap-4 text-sm text-gray-700 md:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What It Tells You</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Whether the host or SQL Server process is under CPU, scheduler, or worker thread pressure.</li>
              <li>Whether SQL Server memory, OS memory headroom, or the buffer pool is under pressure.</li>
              <li>Whether workload volume or the compile and recompile ratio has shifted.</li>
              <li>Whether storage latency or TempDB allocation contention is becoming a bottleneck.</li>
              <li>Which server and database settings deviate from common configuration best practices.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What It Is Not</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Not a query-level tuning screen.</li>
              <li>Not a blocking chain analysis screen.</li>
              <li>Not a replacement for wait analysis or plan review.</li>
              <li>Not a 24/7 collector, SLA dashboard, alerting system, or centralized operations console.</li>
              <li>Not an automatic remediation tool: it never changes server settings.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="dashboard-layout" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Dashboard Layout
        </h2>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              The screen groups live instance health into five panels: <span className="font-medium">Server Health</span>,{' '}
              <span className="font-medium">Memory Health</span>, <span className="font-medium">Workload</span>,{' '}
              <span className="font-medium">Storage &amp; I/O</span>, and <span className="font-medium">TempDB</span>.
              Each metric row shows its current value, a bar, and a short caption with the context behind the status
              (for example the target in use or the raw counts). Rows are colored as good, normal, warning, or critical,
              and each panel header carries a status badge that summarizes its rows.
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
              <li>
                The header holds the <span className="font-medium">Configuration Audit</span> button and the refresh
                controls.
              </li>
              <li>
                The status strip under the header shows <span className="font-medium">Live metrics</span> and the time of
                the <span className="font-medium">Last sample</span>, plus a short error message if a refresh fails.
              </li>
              <li>Hover over a metric row to read its built-in explanation.</li>
              <li>Start with the most visibly degraded panel, then validate with adjacent metrics.</li>
              <li>Use status colors as guidance, not as the final diagnosis.</li>
            </ul>
          </div>
          <LightboxImage
            src="/docs/dashboard/001.png"
            alt="Overview screen of SQLPerformance AI showing the Server Health, Memory Health, and Workload panels with status badges, the Configuration Audit button, and the Refresh and Start controls"
            width={1483}
            height={741}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="refresh-controls" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Refresh Controls
        </h2>
        <p className="mb-4 text-sm text-gray-700">
          Dashboard samples only when asked. Auto refresh is off by default, so opening the screen loads one snapshot and
          then waits for you.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
          <li>
            <span className="font-medium">Refresh</span> interval: 5 sec, 15 sec (default), 30 sec, or 1 min. The
            interval is used only while auto refresh is running.
          </li>
          <li>
            <span className="font-medium">Refresh</span> button: takes a new sample immediately.
          </li>
          <li>
            <span className="font-medium">Start</span> / <span className="font-medium">Stop</span>: turns auto refresh on
            or off. Starting it also takes a sample right away. The setting is kept while you switch to other modules
            during the session; the timer pauses while another module is open and resumes when you return.
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="panel-status-badges" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Panel Status Badges
        </h2>
        <p className="mb-4 text-sm text-gray-700">
          Each panel badge is derived from the status of its rows, so a panel turns warning or critical only when one of
          its thresholds is actually crossed. Informational rows without thresholds never raise a badge.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {panelBadges.map((badge) => (
            <div key={badge.label} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="mb-1 font-semibold text-gray-900">{badge.label}</div>
              <p className="text-sm text-gray-700">{badge.text}</p>
            </div>
          ))}
        </div>
      </div>

      {metricSections.map((section) => (
        <div key={section.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 id={section.id} className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            {section.title}
          </h2>
          <p className="mb-4 text-sm text-gray-700">{section.description}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {section.metrics.map((metric) => (
              <div key={metric.name} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <h3 className="mb-2 font-semibold text-gray-900">{metric.name}</h3>
                <p className="text-sm text-gray-700">{metric.meaning}</p>
                <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">How To Read It</div>
                <p className="mt-1 text-sm text-gray-700">{metric.interpretation}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="configuration-audit" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Configuration Audit
        </h2>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              The <span className="font-medium">Configuration Audit</span> button opens a SQL Server configuration best
              practices review for the active connection. The audit starts as soon as the window opens, shows a progress
              bar with the current step, and then lists findings with a summary of Critical, Warning, Info, and Pass
              counts. An environment line shows the server name, SQL Server version and edition, core count, NUMA nodes,
              host RAM, and the collection time. The checks only read configuration and system views; no server or
              database setting is changed.
            </p>

            <div className="grid gap-4 text-sm text-gray-700">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Filtering Findings</h3>
                <p>
                  <span className="font-medium">Show findings</span> offers Actionable (default), All, Critical, Warning,
                  Info, and Pass. Actionable shows the Critical, Warning, and Info findings and hides the passed checks
                  and the always-present overview items (the recovery model summary and the manual host checklist). Info
                  and All still list them.
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Run Audit and Export HTML</h3>
                <p>
                  <span className="font-medium">Run Audit</span> runs the checks again, for example after you change a
                  setting. <span className="font-medium">Export HTML</span> saves the latest audit as a standalone HTML
                  report (severity, category, finding, current value, recommended value, and action) to a location you
                  choose. Export is available after an audit with findings has completed for the current connection.
                </p>
              </div>
            </div>
          </div>
          <LightboxImage
            src="/docs/dashboard/002.png"
            alt="Configuration Audit window with the Show findings filter set to Actionable, an environment line, Critical, Warning, Info, and Pass counts, a completed progress bar, finding cards with current and recommended values and a recommendation, and Export HTML, Run Audit, and Close buttons"
            width={959}
            height={849}
          />
        </div>

        <h3 className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">What Each Finding Shows</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
          {auditFindingFields.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3 className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">What It Checks</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {auditCheckGroups.map((group) => (
            <div key={group.category} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="mb-2 font-semibold text-gray-900">{group.category}</div>
              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                {group.checks.map((check) => (
                  <li key={check}>{check}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-700">
          Settings that meet the recommendation are listed as Pass. If a check cannot run because of permissions or the
          SQL Server version, the audit still completes and shows a notice that the results may be incomplete, listing
          the skipped checks.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="interpretation-guide" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Quick Interpretation Guide
        </h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
          {interpretationGuide.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="typical-workflow" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Typical Workflow
        </h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-gray-700">
          {workflowSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="behavior-notes" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Behavior Notes
        </h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
          {behaviorNotes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="limitations" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Limitations
        </h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
          {limitations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
