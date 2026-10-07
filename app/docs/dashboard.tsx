import Link from 'next/link'
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
      'Scheduler and worker utilization. These five rows tell you whether the host or the SQL Server process is under CPU, scheduler, or worker thread pressure.',
    metrics: [
      {
        name: 'CPU %',
        meaning:
          'Overall CPU utilization of the host across all cores, taken from the newest SQL Server scheduler monitor ring buffer record. The gauge text adds the age of that record, for example "8.0% · 49s old". Use it to see whether the host itself is CPU-bound, including pressure from non-SQL processes.',
        interpretation: 'Below 70% is normal, 70% up to 90% is warning, and 90% or higher is critical.',
      },
      {
        name: 'SQL CPU %',
        meaning:
          'CPU utilization of the SQL Server process from the same record. When the server does not report it, the row shows N/A with "not reported"; the host value is not substituted. Compare it with CPU %: sustained high SQL CPU usually points to CPU-heavy queries, excessive parallelism, or high compilation.',
        interpretation: 'Below 70% is normal, 70% up to 90% is warning, and 90% or higher is critical.',
      },
      {
        name: 'Active Sessions',
        meaning:
          'User sessions that are currently running or runnable. System sessions, SQL Server Agent, Database Mail, and Report Server connections, and the sessions the application opens itself, are excluded. The bar shows active sessions as a share of all connected user sessions and the gauge text reads "of N connected".',
        interpretation:
          'Not judged: there is no universal threshold. Compare it with the normal pattern of this server and move to Query Statistics or Blocking Analysis when it changes unexpectedly.',
      },
      {
        name: 'Runnable / CPU',
        meaning:
          'Tasks waiting for a CPU (the runnable tasks summed over the online schedulers) divided by the number of logical CPUs, shown with two decimals. The gauge text reads "N total · M CPU". It is a point-in-time value, so judge it over several refreshes.',
        interpretation:
          'Below 0.10 is good, 0.10 up to 1.00 is warning, and 1.00 or higher is critical. Shows N/A when the CPU count cannot be read.',
      },
      {
        name: 'Workers',
        meaning:
          'Total worker threads across the online schedulers. The bar and the gauge text show the share of the maximum worker count of the instance, for example "17% of 512".',
        interpretation:
          'Below 80% of the maximum is normal, 80% up to 95% is warning, and 95% or higher is critical. Correlate sustained high usage with THREADPOOL waits in Wait Statistics.',
      },
    ],
  },
  {
    id: 'memory-health',
    title: 'Memory Health',
    description:
      'Buffer pool and memory pressure. These eight rows show SQL Server memory against its target and configured cap, host memory headroom, and buffer pool behavior.',
    metrics: [
      {
        name: 'SQL Memory Used',
        meaning:
          'Total Server Memory in MB. The gauge text shows the percentage of the target ("N% tgt"). In a steady state it usually approaches SQL Memory Target; if it stays well below the target, look for external memory pressure or a restrictive max server memory setting.',
        interpretation:
          'Rated by its ratio to SQL Memory Target: above 90% is good, above 75% up to 90% is warning, and 75% or lower is critical.',
      },
      {
        name: 'SQL Memory Target',
        meaning:
          'Target Server Memory in MB: how much memory SQL Server wants to use under current conditions. Read it together with SQL Memory Used, Max Server Memory, and PLE rather than on its own.',
        interpretation: 'Not judged. It is the reference value for the SQL Memory Used ratio.',
      },
      {
        name: 'Max Server Memory',
        meaning:
          'The configured max server memory in MB. The row reads "Unlimited" with the gauge text "default unlimited" while the default 2,147,483,647 MB setting is still active; it does not mean SQL Server has that much RAM. Otherwise the gauge text shows the cap as a share of host RAM ("N% host").',
        interpretation:
          'Warning while the default unlimited setting is in place, because nothing then reserves memory for Windows and other processes. A configured cap is not judged.',
      },
      {
        name: 'Host Physical RAM',
        meaning:
          'Total physical memory of the host in MB, with the gauge text "host RAM". It is context for the memory cap and the OS headroom, not memory allocated by SQL Server.',
        interpretation: 'Not judged.',
      },
      {
        name: 'OS Available Memory',
        meaning:
          'Physical memory currently available to Windows in MB. The bar and the gauge text ("N% free") show the share of host RAM that is still free. Low values can indicate external memory pressure on the host.',
        interpretation: 'More than 20% free is good, more than 10% up to 20% is warning, and 10% or lower is critical.',
      },
      {
        name: 'PLE',
        meaning:
          'Page Life Expectancy in seconds. The target is not a fixed 300 seconds: it is 300 seconds per 4 GB of SQL Memory Used (memory below 4 GB counts as 4 GB, so the minimum is 300 seconds), the gauge text shows it ("target 747s"), and the bar fills as the share of that target. Sharp drops usually indicate buffer churn from large scans, memory grants, or external pressure.',
        interpretation:
          'Above the target is good. The critical line is 25% of the target, never below 60 seconds: values above it but not above the target are warning, and values at or below it are critical. Example: with 32 GB in use the target is 2,400 seconds and 600 seconds or lower is critical.',
      },
      {
        name: 'Buffer Cache Health',
        meaning:
          'Buffer Cache Hit Ratio in percent, judged together with other signals. A low hit ratio alone does not raise an alert: it must be corroborated by low PLE, physical page reads, or rising read latency. The gauge text shows the PLE and read latency used for the decision ("PLE 2445s · IO 1ms").',
        interpretation:
          'Critical when the hit ratio is below 90% and either PLE is below its critical line or read latency is 20 ms or higher. Warning when the hit ratio is below 95% and at least one of these is true: PLE is below its target, read latency is 5 ms or higher, or physical page reads occurred in the interval. Otherwise good.',
      },
      {
        name: 'Page Reads/sec',
        meaning:
          'Physical database page reads per second over the last refresh interval. It becomes actionable when the hit ratio or PLE falls and read latency rises at the same time.',
        interpretation:
          'Not judged. The bar is relative to a recent peak that rises at once and decays gradually; the gauge text reads "current/peak" followed by "pk". The first sample shows "—" with "awaiting baseline".',
      },
    ],
  },
  {
    id: 'workload',
    title: 'Workload',
    description:
      'Throughput and compilation activity. Rates are averaged over the last refresh interval, and compile activity is expressed as ratios so it can be read the same way on busy and quiet servers.',
    metrics: [
      {
        name: 'Batch/sec',
        meaning:
          'Batch requests per second over the last refresh interval, computed from the change in the cumulative performance counter. A high-level workload intensity signal: sudden spikes often correlate with CPU and I/O increases.',
        interpretation:
          'Not judged. The bar and the gauge text ("45/45pk") compare the current rate with the recent peak. The first sample shows "—" with "awaiting baseline".',
      },
      {
        name: 'Transactions/sec',
        meaning:
          'Transactions per second over the last refresh interval. Comparing it with Batch/sec shows how much of the request volume is truly transactional.',
        interpretation: 'Not judged. Peak bar and "awaiting baseline" behave as for Batch/sec.',
      },
      {
        name: 'Compile / Batch',
        meaning:
          'SQL compilations as a percentage of batch requests in the interval. The gauge text shows the counts it was computed from ("32 c · 689 batch / interval"). A high ratio can indicate ad hoc queries, missing parameterization, or plan cache churn that drives CPU without increasing throughput.',
        interpretation:
          'Below 10% is normal, 10% up to 20% is warning, and 20% or higher is critical. The ratio needs at least 50 batches in the interval; below that the row shows N/A with "low volume · N batch (min 50)". It also shows N/A with "no activity" when there were no batches, and with "no interval yet" when the sample came less than half a second after the previous one.',
      },
      {
        name: 'Recompile / Compile',
        meaning:
          'SQL recompilations as a percentage of compilations in the interval, with the same kind of gauge text ("N rc · M c / interval"). Recompiles can come from statistics changes, temp table usage, schema changes, or RECOMPILE hints, and add CPU overhead.',
        interpretation:
          'Below 10% is normal, 10% up to 25% is warning, and 25% or higher is critical. The ratio needs at least 50 compilations in the interval; below that the row shows N/A with "low volume · N c (min 50)".',
      },
    ],
  },
  {
    id: 'storage-io',
    title: 'Storage & I/O',
    description:
      'Latency and pending I/O. Latencies are interval values calculated from the change in sys.dm_io_virtual_file_stats between refreshes, not lifetime averages since startup.',
    metrics: [
      {
        name: 'IO Read Latency',
        meaning:
          'Average read latency in milliseconds, weighted across the data files of all databases (log files are not included). The first sample, or an interval with no reads, falls back to the lifetime average.',
        interpretation:
          'Below 5 ms is normal, 5 ms up to 20 ms is warning, and 20 ms or higher is critical. The bar is scaled to 20 ms and the gauge text reads "1/20ms". Shows N/A when no value is available.',
      },
      {
        name: 'IO Write Latency',
        meaning:
          'Average write latency in milliseconds across the same data files, calculated the same way. Sustained high write latency can affect checkpoints, TempDB activity, and throughput.',
        interpretation: 'Same thresholds, bar, and gauge text as IO Read Latency.',
      },
      {
        name: 'Log Write Latency',
        meaning:
          'Average write latency for transaction log files only. High values often show up as WRITELOG waits and directly affect commit latency.',
        interpretation: 'Same thresholds, bar, and gauge text as IO Read Latency.',
      },
      {
        name: 'Pending I/O',
        meaning:
          'The number of pending I/O requests SQL Server reports at the time of the sample (sys.dm_io_pending_io_requests). It is not the Windows Disk Queue Length counter. Because a single sample is noisy, the app counts consecutive pressure samples, meaning samples with 2 or more pending requests; a sample below 2 resets the count.',
        interpretation:
          'Not judged until three consecutive pressure samples have been seen; until then the gauge text reads "N/3 pressure samples". After that the gauge text reads "sustained · N samples", 2 up to 10 is warning, and 10 or more is critical.',
      },
    ],
  },
  {
    id: 'tempdb',
    title: 'TempDB',
    description:
      'Allocation pressure and contention. These seven rows cover TempDB space and log usage, data file layout, autogrowth settings, and allocation page contention. If the TempDB group cannot be read, all seven rows show N/A instead of misleading zeros.',
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
          'Allocated space across the TempDB data files in MB. The gauge text shows the current total data file capacity ("of 4096.0 MB").',
        interpretation: 'Takes the same status as TempDB Usage.',
      },
      {
        name: 'Data Free',
        meaning:
          'Unallocated space inside the TempDB data files in MB. This is reusable file space, not free disk capacity. The gauge text shows the percentage free.',
        interpretation: 'Not judged.',
      },
      {
        name: 'Data Files',
        meaning:
          'Number of TempDB data files. The gauge text shows the size spread between the largest and the smallest file ("size spread 0%"); equally sized files let proportional fill distribute allocations predictably.',
        interpretation: 'Warning when there is more than one data file and the size spread is above 20%.',
      },
      {
        name: 'File Growth',
        meaning:
          'Autogrowth setting of the TempDB data files: "Percent" if any file grows by percentage, a fixed size such as "512 MB" or a range such as "64–256 MB" if files grow by fixed amounts, "Disabled" if growth is off, otherwise N/A. The gauge text reads "fixed growth", "N of M files" for percentage growth, or "N disabled".',
        interpretation:
          'Percentage growth is warning. Any data file with autogrowth disabled makes the row critical, even when the value still reads a fixed size or "Percent", because a full file can then cause allocation failures.',
      },
      {
        name: 'PFS/GAM Waits',
        meaning:
          'Current PAGELATCH waits on the TempDB PFS, GAM, and SGAM allocation pages, a sign of allocation contention. The gauge text shows the change since the previous refresh ("rising", "falling", or "steady" with the difference) and the data file count, for example "steady +0 · 4 files".',
        interpretation: '0 is good, 1 to 9 is warning, and 10 or more is critical.',
      },
    ],
  },
]

const panelBadges = [
  { label: 'N critical', text: 'N rows are critical (red). Takes priority over everything else.' },
  { label: 'N warning', text: 'N rows are warning (amber) and none are critical.' },
  {
    label: 'N unavailable',
    text: 'N rows belong to a metric group that could not be read, and no row is warning or critical. Shown in amber; for example "7 unavailable" when the TempDB group fails.',
  },
  {
    label: 'Learning baseline',
    text: 'No warning, critical, or unavailable row, but at least one rate row still shows "—" while it waits for its second sample. Shown in blue.',
  },
  {
    label: 'No data',
    text: 'Nothing has been loaded yet, you are not connected, or every row in the panel is N/A without being flagged unavailable. Shown in gray.',
  },
  {
    label: 'Healthy',
    text: 'Every row that could be evaluated is below its warning threshold. If some rows are N/A, hover the badge: the tooltip reads "N/A ×2", for example.',
  },
]

const auditCheckGroups: AuditCheckGroup[] = [
  {
    category: 'Instance',
    checks: [
      'Max server memory left at the unlimited default, or set to the host RAM or higher (Warning). A value that leaves less than the larger of 4 GB or 10% of RAM for the OS is reported as Info with a suggested cap. Not checked on Azure SQL Managed Instance.',
      'MAXDOP left at 0 (Warning), or set above a topology-based upper bound (Info). On a single NUMA node the bound is the smaller of 8 and the logical cores; on multi-node servers it is the cores per node, halved above 16 per node and never above 16. When only one scheduler is visible, or the topology could not be read, MAXDOP passes as not applicable.',
      'Cost threshold for parallelism at the default of 5 or lower (Warning); the suggested starting point is about 50.',
      'Optimize for ad hoc workloads, backup compression default, and remote dedicated admin connection (DAC) disabled (Info); Pass when enabled.',
      'Lock Pages in Memory not in use (Info) and Instant File Initialization disabled (Warning). Both checks run on SQL Server 2016 and later.',
    ],
  },
  {
    category: 'Database',
    checks: [
      'Checked across user databases that are online, read-write, and not snapshots. On Azure SQL Database only the connected database is audited.',
      'Query Store disabled on some databases (Warning, SQL Server 2016 and later) and Read Committed Snapshot Isolation disabled (Info).',
      'Query Store switched on but not capturing, for example in an error state or read-only after reaching its size limit (Warning), or at 90% or more of its maximum size (Info). A database-scoped MAXDOP above the topology-based bound is Info; overrides within the bound pass (SQL Server 2016 and later).',
      'AUTO_CREATE_STATISTICS or AUTO_UPDATE_STATISTICS disabled (Warning).',
      'PAGE_VERIFY set to NONE on any checked database (Critical); any other setting that is not CHECKSUM (Warning); otherwise Pass.',
      'Accelerated Database Recovery disabled (Info, SQL Server 2019 and later), and a recovery model overview grouped by model (Info) once the database options were read. The overview is one of the items the Actionable filter hides.',
    ],
  },
  {
    category: 'Storage',
    checks: [
      'TempDB with a single data file on a multi-core server (Warning) or fewer data files than the smaller of 8 and the core count (Info).',
      'TempDB data files of unequal size (Warning above a 20% spread, otherwise Info), with autogrowth disabled (Warning), or with percentage autogrowth (Warning).',
      'TempDB log with autogrowth disabled or percentage growth (Warning), or fixed growth smaller than 64 MB (Info).',
      'User database files with percentage autogrowth (Warning), fixed growth smaller than 64 MB (Info), or autogrowth disabled (Info); Pass when none apply.',
      'A manual checklist (Info) of host-level settings that cannot be read through T-SQL: power plan and volume allocation unit size. It is hidden by the Actionable filter and replaced by the platform notice on Azure.',
    ],
  },
  {
    category: 'Monitoring',
    checks: [
      'The system_health Extended Events session, which captures deadlock graphs by default, is not running (Warning); Pass when it is.',
    ],
  },
]

const auditStages = [
  'Collecting server topology...',
  'Checking instance configuration...',
  'Checking memory & file initialization...',
  'Checking database options...',
  'Checking TempDB configuration...',
  'Checking file growth settings...',
  'Checking deadlock monitoring...',
]

const auditFindingFields = [
  'Severity badge (Critical, Warning, Info, or Pass) and category (Instance, Database, Storage, or Monitoring), with the Copy button on the right of the same row.',
  'Finding title and a short explanation of why the setting matters.',
  'Current value and Recommended value, when the check has them.',
  'Recommendation: the suggested action.',
  'Evidence: the affected databases or files behind the finding. The first 12 are listed, followed by "(+N more)".',
]

const reportDownloads = [
  {
    name: 'Sample Configuration Audit Report (HTML)',
    href: '/docs/dashboard/config_audit_20261007_143414.html',
    summary:
      'Saved with Export HTML in version 1.1.0 from a run on the same SQL Server 2019 Standard Edition test instance as the screenshots: the heading SQL Server Configuration Audit, the environment line, the Generated time (2026-10-07 14:33:37), the counters 0 Critical, 1 Warning, 8 Info and 11 Pass, and a 20-row table with Severity, Category, Finding, Current, Recommended and Action. Server and database names are fictional.',
  },
]

const interpretationGuide = [
  'If CPU % is high but SQL CPU % is low, pressure is more likely coming from a non-SQL process on the host.',
  'If SQL CPU % and Runnable / CPU are both high, SQL Server CPU pressure is more likely to be real; check Workers as well if THREADPOOL waits are suspected.',
  'If PLE falls below its target, Buffer Cache Health turns warning, and Page Reads/sec rises, investigate memory pressure and large scans first.',
  'If OS Available Memory is low while SQL Memory Used stays well below SQL Memory Target, look for external memory pressure and review Max Server Memory.',
  'If Compile / Batch or Recompile / Compile is high, review plan cache behavior, parameterization, and query design in Query Statistics.',
  'If the read, write, and log latencies rise together and Pending I/O becomes sustained, storage latency is a likely factor.',
  'If TempDB Usage, TempDB Log Used, and PFS/GAM Waits rise together, review TempDB sizing, file layout, and spill-heavy workloads.',
]

const limitations = [
  'Dashboard is designed for fast triage, not full root-cause analysis.',
  'It samples only while the desktop application is open and the Overview is the active screen. It does not keep a metric history, run in the background, or send alerts.',
  'A metric group the login cannot read shows N/A rows and an "N unavailable" badge. Configuration Audit checks that cannot run are reported as skipped.',
  'Rate rows need two samples, the compile ratios need 50 batches or compilations in the interval, and Pending I/O needs three consecutive pressure samples before it is rated.',
  'Thresholds are general guidance. Use trend and correlation across panels rather than treating one metric as conclusive on its own.',
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

export default function DashboardTemplate() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="overview" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Overview
        </h2>
        <p className="text-sm text-gray-700">
          Dashboard, shown as <span className="font-semibold">Overview</span> in the application sidebar with the
          subtitle Server health at a glance, is a live health picture of the SQL Server instance behind the active
          connection. It shows 28 metrics in five panels (Server Health, Memory Health, Workload, Storage &amp; I/O,
          and TempDB), refreshes them on demand or on a timer, and colors each judged row green, amber, or red against
          thresholds the app defines. A separate Configuration Audit window checks instance, database, storage, and
          monitoring settings against operational best practices and lets you copy a finding or export the whole result
          as an HTML report.
        </p>
        <p className="mt-3 text-sm text-gray-700">
          The screen opens without a connection, but live metrics and the audit need one. Everything it runs is a
          read-only query against system views; the only file it writes is the HTML report you choose to export. It
          samples only while the Overview is the active screen and keeps no history, so use it to confirm the current
          operating picture and then move to{' '}
          <Link href="/docs/modules/query-statistics" className="font-semibold text-primary hover:text-primary-dark">
            Query Statistics
          </Link>
          ,{' '}
          <Link href="/docs/modules/wait-statistics" className="font-semibold text-primary hover:text-primary-dark">
            Wait Statistics
          </Link>
          , or{' '}
          <Link href="/docs/modules/blocking-analysis" className="font-semibold text-primary hover:text-primary-dark">
            Blocking Analysis
          </Link>{' '}
          for the deeper investigation.
        </p>
        <div className="mt-4 grid gap-4 text-sm text-gray-700 md:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What You Can Do</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Watch CPU, memory, workload, I/O, and TempDB metrics for the connected server with status colors where a threshold is defined.</li>
              <li>Refresh once, or start automatic refresh at 5 seconds, 15 seconds, 30 seconds, or 1 minute.</li>
              <li>Hover any metric row to read what it measures and how to interpret it.</li>
              <li>Run a Configuration Audit, filter the findings by severity, copy a finding as plain text, and export the result as an HTML file.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What It Is Not</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Not a query-level tuning screen or a blocking chain analysis screen.</li>
              <li>Not a replacement for wait analysis or plan review.</li>
              <li>Not a 24/7 collector, SLA dashboard, alerting system, or centralized operations console.</li>
              <li>Not an automatic remediation tool: neither the metrics nor the audit change a server setting.</li>
            </ul>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Overview Screen"
        title="The Overview After the First Samples"
        body={
          <>
            <p>
              The Overview in version 1.1.0 on a SQL Server 2019 test instance, shortly after connecting and before
              automatic refresh was started. The application top bar with the server and database selectors is visible
              above the screen.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Heading and controls:</strong> the caption LIVE SERVER COMMAND CENTER, the title Overview, and the
                subtitle High-level overview of server health, workload, memory, storage and TempDB. On the right sit
                the ◈ Configuration Audit button, the Refresh drop-down at 15 sec, ↻ Refresh, and ▶ Start.
              </li>
              <li>
                <strong>Status strip:</strong> a gray dot because automatic refresh is stopped, the label Live metrics,
                and Last sample 14:25:53 on the right.
              </li>
              <li>
                <strong>Server Health, Healthy:</strong> CPU % 8% with the gauge text 8.0% · 49s old, SQL CPU % 0%,
                Active Sessions 0 of 38 connected, Runnable / CPU 0.00 from 0 total · 4 CPU, and Workers 87 at 17% of
                512.
              </li>
              <li>
                <strong>Memory Health, 1 warning:</strong> OS Available Memory 1764 MB at 11% free is amber. SQL Memory
                Used 10209 MB stands at 100% tgt, Max Server Memory 10240 MB at 63% host, PLE 2445 sec against target
                747s, and Buffer Cache Health 100% with PLE 2445s · IO 1ms.
              </li>
              <li>
                <strong>Workload, Healthy:</strong> Batch/sec and Transactions/sec read 0. Compile / Batch and Recompile
                / Compile read N/A with no interval yet: this sample came less than half a second after the previous
                one, so no interval could be measured.
              </li>
              <li>
                <strong>Storage &amp; I/O, Healthy:</strong> IO Read Latency 1 ms shown as 1/20ms, write and log latency
                0 ms, and Pending I/O 1 with 0/3 pressure samples, because a single pending request is below the
                pressure level of 2.
              </li>
              <li>
                <strong>TempDB, Healthy:</strong> TempDB Usage 0%, TempDB Log Used 10%, Data Used 13.8 MB of 4096.0 MB,
                Data Free 4082.3 MB at 100% free, Data Files 4 with size spread 0%, and File Growth 512 MB with fixed
                growth. The seventh row, PFS/GAM Waits, is below the captured area.
              </li>
            </ul>
          </>
        }
        image="/docs/dashboard/003.png"
        alt="Overview screen of SQLPerformance AI with the heading, the Configuration Audit, Refresh, and Start controls, the status strip, and the Server Health, Memory Health, Workload, Storage and I/O, and TempDB panels filled with live values"
        width={1661}
        height={1001}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="refresh-controls" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Refresh Model
        </h2>
        <p className="mb-4 text-sm text-gray-700">
          The Overview samples only when asked. Opening it takes one sample; automatic refresh is off until you start
          it, and it runs only while the Overview is the active screen.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
          <li>
            <span className="font-medium">↻ Refresh</span> takes a new sample immediately. The ⟳ Refresh button in the
            application top bar does the same while the Overview is the active screen.
          </li>
          <li>
            <span className="font-medium">▶ Start</span> begins automatic refresh at the interval chosen in the Refresh
            drop-down (5 sec, 15 sec by default, 30 sec, or 1 min) and takes a sample right away. While it runs the
            button reads ■ Stop. Changing the interval while it runs restarts the timer with the new interval.
          </li>
          <li>
            Only one refresh runs at a time. Requests made while one is in flight collapse into a single follow-up that
            runs as soon as the first finishes.
          </li>
          <li>
            Switching to another screen pauses the timer. When you return, the Start/Stop choice and the interval are
            as you left them, and a fresh sample is taken.
          </li>
          <li>
            When you connect, or change the active server or database, a fresh sample is taken for the new connection.
            Switching to a different profile, server, or database also resets the rate baselines, the peak references,
            the latency baselines, and the Pending I/O counter, so rate rows show &quot;—&quot; with awaiting baseline
            until the next sample. Reconnecting to the same target keeps the old baselines.
          </li>
          <li>
            If the connection is lost or none exists, the rows reset to &quot;—&quot;, the panel badges read No data,
            Last sample reads &quot;—&quot;, the dot turns red, and the banner Not connected. Connect to a SQL Server
            instance to see live metrics. appears.
          </li>
        </ul>
        <div className="mt-4 grid gap-4 text-sm text-gray-700 md:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Status Strip</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Green dot: automatic refresh is running. Gray dot: it is stopped. Red dot: the connection is down, which wins over the other two.</li>
              <li>Messages that need your attention appear next to Live metrics; the Tips and Troubleshooting card lists them.</li>
              <li>Last sample shows the local time of the last successful refresh as HH:MM:SS, followed by · partial when a metric group could not be read.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Reading a Metric Row</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Value: the current value with its unit. &quot;—&quot; means the row is waiting for a baseline; N/A means no value was available (not reported, a failed group, a compile ratio below its minimum volume, or an unknown CPU count).</li>
              <li>Bar: for threshold rows it shows how close the value is to the limit, for OS Available Memory, PLE, SQL Memory Used, and Buffer Cache Health the share of a target, and for Batch/sec, Transactions/sec, and Page Reads/sec the share of a recent peak.</li>
              <li>Color: green is good, amber is warning, red is critical. Rows without a rule, or in the lowest band of a rule, use the default blue.</li>
              <li>Gauge text: the short context to the right of the bar, such as of 38 connected or target 747s.</li>
              <li>Tooltip: hover a row to read the description of the metric under its label.</li>
            </ul>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Workload Sample"
        title="Lower Panels While a Workload Runs"
        body={
          <>
            <p>
              The lower four panels of the same instance a few minutes later, while a small test workload was running.
              The heading and the Server Health panel are outside the capture.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Memory Health, 1 warning:</strong> OS Available Memory 1761 MB at 11% free is still amber, PLE
                has risen to 2561 sec, and Buffer Cache Health 100% shows PLE 2561s · IO 1.04354ms.
              </li>
              <li>
                <strong>Workload, Healthy:</strong> Batch/sec 45 req/s with 45/45pk and Transactions/sec 50 tx/s with
                50/50pk, so the current value is also the recent peak. Compile / Batch 4.6% was computed from 32 c · 689
                batch / interval. Recompile / Compile reads N/A with low volume · 32 c (min 50), because fewer than 50
                compilations happened in the interval.
              </li>
              <li>
                <strong>Storage &amp; I/O, Healthy:</strong> Pending I/O 1 with 0/3 pressure samples; the row is not judged
                yet.
              </li>
              <li>
                <strong>TempDB, Healthy:</strong> all seven rows, ending with PFS/GAM Waits 0 and the gauge text steady +0
                · 4 files.
              </li>
            </ul>
          </>
        }
        image="/docs/dashboard/004.png"
        alt="Memory Health, Workload, Storage and I/O, and TempDB panels of the Overview during a test workload, with Batch/sec at 45, Transactions/sec at 50, Compile / Batch at 4.6 percent, and Recompile / Compile showing N/A with a low volume note"
        width={1616}
        height={673}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="panel-status-badges" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Panel Status Badges
        </h2>
        <p className="mb-4 text-sm text-gray-700">
          Each panel header carries one badge derived from the rows in that panel, in this order of priority. The badge
          is a visual summary only: rows without a threshold never raise it, and the details are in the rows.
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

      <ScreenshotCard
        eyebrow="No Connection"
        title="The Overview Without a Connection"
        body={
          <>
            <p>The same screen with no active connection.</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Top bar:</strong> the server selector is empty and the database selector reads No databases.
              </li>
              <li>
                <strong>Status strip:</strong> a red dot, the banner Not connected. Connect to a SQL Server instance to see
                live metrics. next to Live metrics, and Last sample &quot;—&quot;.
              </li>
              <li>
                <strong>Panels:</strong> every badge reads No data, every value reads &quot;—&quot;, and the bars are empty.
              </li>
              <li>
                <strong>Controls:</strong> they stay in place. Opening the Configuration Audit in this state shows
                Configuration audit unavailable until you connect.
              </li>
            </ul>
          </>
        }
        image="/docs/dashboard/005.png"
        alt="Overview screen without a connection: a red status dot, the Not connected banner, No data badges on all five panels, and dashes instead of values"
        width={1661}
        height={997}
      />

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
        <p className="text-sm text-gray-700">
          The <span className="font-medium">◈ Configuration Audit</span> button opens a window titled Configuration
          Audit with the subtitle Review SQL Server settings against operational best practices. The audit does not
          start by itself: the window first looks for a previous result for the current connection, and if there is
          none it shows the empty state No audit result yet with the text Press Run Audit to check this server. It runs
          about ten read-only queries.
        </p>
        <div className="mt-4 grid gap-4 text-sm text-gray-700 md:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Running the Audit</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Run Audit changes to Running..., and the Show findings filter and Export HTML are disabled for the duration.</li>
              <li>The progress bar shows the current stage with its percentage, for example Checking database options... (60%). The stages are:</li>
            </ul>
            <ol className="mt-2 list-decimal space-y-1 pl-10">
              {auditStages.map((stage) => (
                <li key={stage}>{stage}</li>
              ))}
            </ol>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>When the run finishes the bar reads Configuration audit completed. (100%), and the environment line, the four counters, and the finding cards appear.</li>
              <li>Closing the window while an audit runs does not stop it. Reopen the window to watch it continue and to get the result. Close with ×, Close, or the Escape key.</li>
              <li>Only one audit runs at a time; a second Run Audit does not start another run.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Result and Lifetime</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>The environment line reads server • version • edition, then the cores, NUMA nodes, and RAM when they are known, then the date and time of the run, for example (4 cores, 1 NUMA, 16 GB RAM) — 2026-10-07 14:29:27.</li>
              <li>Four counters follow: N Critical, N Warning, N Info, N Pass.</li>
              <li>The result is kept in memory while the application is open, for the profile, server, and database it was run on. Switching to another server or database hides it, and disconnecting clears it; run the audit again for the new connection.</li>
              <li>On Azure SQL Database and Azure SQL Managed Instance the host-level checks the platform manages are left out, and an Info item titled Azure SQL Database: host-level checks not applicable (or the Managed Instance variant) lists what was skipped.</li>
            </ul>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Configuration Audit"
        title="Before the First Run"
        body={
          <>
            <p>
              The Configuration Audit window right after opening it on a connected server, with no earlier result in
              this session.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Header:</strong> the title Configuration Audit, the subtitle Review SQL Server settings against
                operational best practices., and the × close button.
              </li>
              <li>
                <strong>Show findings:</strong> the drop-down at its default, Actionable.
              </li>
              <li>
                <strong>Progress bar:</strong> empty, with no stage message.
              </li>
              <li>
                <strong>Empty state:</strong> the ◈ icon, No audit result yet, and Press Run Audit to check this server. It
                runs about ten read-only queries.
              </li>
              <li>
                <strong>Footer:</strong> Export HTML disabled, Run Audit as the primary button, and Close.
              </li>
            </ul>
          </>
        }
        image="/docs/dashboard/006.png"
        alt="Configuration Audit window before the first run, with the Show findings filter at Actionable, an empty progress bar, the No audit result yet message, a disabled Export HTML button, and the Run Audit and Close buttons"
        width={964}
        height={526}
        maxWidthClass="max-w-[964px]"
        sizes="(min-width: 640px) 964px, 100vw"
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="audit-findings" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Reading, Filtering, and Copying Findings
        </h2>
        <p className="mb-4 text-sm text-gray-700">
          Findings are sorted by severity (Critical, Warning, Info, Pass), then by category in alphabetical order, then
          by title. Each finding card shows, from top to bottom:
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
          {auditFindingFields.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="mt-4 grid gap-4 text-sm text-gray-700 md:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Show Findings</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>The options are Actionable (default), All, Critical, Warning, Info, and Pass. The filter is disabled while an audit runs.</li>
              <li>Actionable shows the Critical, Warning, and Info findings and hides the passed checks and the overview items (the recovery model overview, the manual OS checklist, and the Azure platform notice). All and Info still list them.</li>
              <li>When the selected filter has nothing to show, the window says Nothing to fix (with None of the N checks needs action. Choose All to review them.), No matching findings (Choose another severity filter.), or No configuration findings when the completed checks returned nothing at all.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Copy</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Copy puts the finding on the clipboard as plain text: [Severity] Title on the first line, then Category, Current, Recommended, Why, Action, and Details, each on its own line and only when the field has a value. Details lists every evidence entry, without the 12-item cap of the card.</li>
              <li>The button reads Copied for a moment. If the clipboard is refused, a warning Copy unavailable asks you to select and copy the text manually.</li>
            </ul>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Audit Results"
        title="Findings With the Actionable Filter"
        body={
          <>
            <p>
              A completed audit of the SQL Server 2019 Standard Edition test instance, captured on October 4, 2026 with
              the default Actionable filter.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Environment line and counters:</strong> SQL Server 2019 RTM • Standard Edition (64-bit) (4 cores, 1
                NUMA, 16 GB RAM) — 2026-10-04 14:24:27, then 0 Critical, 1 Warning, 8 Info, 11 Pass, and the full progress
                bar with Configuration audit completed. (100%).
              </li>
              <li>
                <strong>First card, Warning / Database:</strong> Query Store disabled on some databases, with Current value
                16 of 21 database(s) affected, Recommended value Enabled, the explanation that Query Store is essential
                for performance troubleshooting and regression analysis, the Recommendation Enable Query Store on
                production databases (READ_WRITE)., and the Evidence DBA_DB.
              </li>
              <li>
                <strong>Second card, Info / Database:</strong> ADR disabled on some databases, with 21 of 21 database(s)
                affected, Recommended value Enabled, a note that ADR changes version-store behavior, the Recommendation
                Evaluate and test before enabling, especially on large databases., and an empty Evidence line.
              </li>
              <li>
                <strong>Below:</strong> a third Info card begins, each card carries its Copy button, and the footer shows
                Export HTML enabled, Run Audit, and Close.
              </li>
            </ul>
          </>
        }
        image="/docs/dashboard/002.png"
        alt="Configuration Audit window with the Show findings filter set to Actionable, an environment line, the counters 0 Critical, 1 Warning, 8 Info, and 11 Pass, a completed progress bar, and finding cards for Query Store and Accelerated Database Recovery with current and recommended values, a recommendation, and evidence"
        width={959}
        height={849}
        maxWidthClass="max-w-[959px]"
        sizes="(min-width: 640px) 959px, 100vw"
      />

      <ScreenshotCard
        eyebrow="Severity Filter"
        title="Only the Warning Findings"
        body={
          <>
            <p>
              The same window on October 7, 2026 after a new run on the same instance, with Show findings set to
              Warning. The server name at the start of the environment line and the database names in the Evidence line
              were pixelated before publishing.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Environment line:</strong> the pixelated server name, then SQL Server 2019 RTM • Standard Edition
                (64-bit) (4 cores, 1 NUMA, 16 GB RAM) — 2026-10-07 14:29:27.
              </li>
              <li>
                <strong>Counters:</strong> unchanged since October 4: 0 Critical, 1 Warning, 8 Info, 11 Pass, with
                Configuration audit completed. (100%) next to the full bar.
              </li>
              <li>
                <strong>The only Warning card:</strong> Query Store disabled on some databases, 16 of 21 database(s)
                affected against the Recommended value Enabled, the Recommendation Enable Query Store on production
                databases (READ_WRITE)., and the Evidence line, pixelated here, which lists the first 12 affected
                databases and ends with (+4 more).
              </li>
              <li>
                <strong>Footer:</strong> Export HTML enabled, Run Audit, and Close.
              </li>
            </ul>
          </>
        }
        image="/docs/dashboard/007.png"
        alt="Configuration Audit window filtered to Warning, showing the single Query Store finding with a pixelated server name in the environment line and a pixelated Evidence list"
        width={961}
        height={545}
        maxWidthClass="max-w-[961px]"
        sizes="(min-width: 640px) 961px, 100vw"
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="audit-export" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Export HTML and Partial Audits
        </h2>
        <div className="grid gap-4 text-sm text-gray-700 md:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Export HTML</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Enabled once an audit with at least one finding has completed for the current connection, including a previous result the window loads when it opens.</li>
              <li>Opens a save dialog with the file type HTML Files (*.html), the default name config_audit_&lt;date&gt;_&lt;time&gt;.html, and your home folder as the starting location. Cancelling the dialog does nothing.</li>
              <li>The report carries the heading SQL Server Configuration Audit, the environment line, a Generated line with the time of the run, the four counters, and a table with the columns Severity, Category, Finding, Current, Recommended, and Action. The Finding column also holds the description, and the Action column lists every evidence entry.</li>
              <li>The export always contains all findings, whatever filter is selected on screen. When the file is saved, the message Export Complete shows the path.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Partial Audits</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>A check the login cannot run is recorded as skipped instead of failing the audit, and the result is marked partial.</li>
              <li>The window then shows the notice Audit completed with skipped checks. Results may be incomplete. Skipped: followed by the check names, for example Server Topology, Instance Configuration, Database Options, TempDB Configuration, or Deadlock Monitoring.</li>
              <li>Two skip entries name the cause: File Growth Settings (sys.master_files not visible to this login - needs VIEW ANY DEFINITION), and Query Store state / database-scoped MAXDOP (N of M database(s) not readable by this login). The other entries carry only the check name.</li>
              <li>The exported report opens with Partial audit. Some checks did not complete, so this report may be incomplete. and the same Skipped list.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="audit-checks" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          What the Audit Checks
        </h2>
        <p className="mb-4 text-sm text-gray-700">
          Settings that meet the recommendation are listed as Pass. The version gates compare the major version only:
          Lock Pages in Memory, Instant File Initialization, the Query Store checks, and the database-scoped MAXDOP check
          run on SQL Server 2016 and later, and the Accelerated Database Recovery check on SQL Server 2019 and later. On
          older versions these checks are left out without a skip entry.
        </p>
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
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Sample Report</div>
        <p className="text-sm text-gray-700">
          A report saved with Export HTML in version 1.1.0 on October 7, 2026, from a run on the same test instance a
          few minutes after the Warning-filter screenshot above, so the counts match it. The file name carries the
          time of the save (14:34:14) and the Generated line the time of the run (14:33:37). The server and database
          names in the file were replaced with fictional ones; apart from those names, the content is as the app wrote
          it.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {reportDownloads.map((report) => (
            <div key={report.href} className="flex h-full flex-col rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
              <p className="mb-4 mt-2 text-sm text-gray-700">{report.summary}</p>
              <div className="mt-auto flex flex-wrap items-stretch gap-2">
                <a
                  href={report.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-800 transition hover:border-primary hover:text-primary"
                >
                  Preview
                </a>
                <a
                  href={report.href}
                  download
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-cta px-4 py-2 text-center text-sm font-semibold text-white shadow-cta transition hover:bg-cta-hover hover:shadow-cta-hover"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
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
          Typical Workflows
        </h2>
        <div className="grid gap-4 text-sm text-gray-700 md:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold text-gray-900">Check whether the server is under pressure right now</h3>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Open the Overview and connect to the server if needed.</li>
              <li>Press ▶ Start with 5 sec or 15 sec selected in the Refresh drop-down.</li>
              <li>Wait for the second sample: the Learning baseline badges change to Healthy, N warning, or N critical.</li>
              <li>In any panel with a warning, find the amber or red rows and hover them to read what they mean. Use the gauge text for context, for example the PLE next to Buffer Cache Health.</li>
              <li>Press ■ Stop when you are done, then move to Query Statistics, Wait Statistics, or Blocking Analysis for the cause.</li>
            </ol>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold text-gray-900">Judge a short load test</h3>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Start automatic refresh at 5 sec.</li>
              <li>Run your workload and watch Batch/sec, Transactions/sec, Compile / Batch, and IO Read Latency.</li>
              <li>Remember that Pending I/O only turns amber or red after three consecutive refreshes with pressure, so a single spike does not trigger it.</li>
              <li>Compare the Last sample times with your test window.</li>
            </ol>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold text-gray-900">Audit a server you have just inherited</h3>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Connect to the server and open ◈ Configuration Audit.</li>
              <li>Press Run Audit and wait for Configuration audit completed. (100%).</li>
              <li>Review the Actionable findings, starting with Critical and Warning, and use Evidence to see which databases or files are affected.</li>
              <li>Choose All in Show findings to also see what passed.</li>
              <li>Press Copy on a finding to paste it into a ticket, or Export HTML to save the whole report.</li>
            </ol>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold text-gray-900">Check what is missing from a partial audit</h3>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Run the audit with the login you normally use.</li>
              <li>If the notice Audit completed with skipped checks appears, read the list after Skipped:.</li>
              <li>Where the entry names a cause (for example VIEW ANY DEFINITION for the file growth check, or databases the login cannot read), grant it or use a login that has it, then press Run Audit again.</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 id="troubleshooting" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Tips and Troubleshooting
        </h2>
        <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
          <li><span className="font-medium">Not connected. Connect to a SQL Server instance to see live metrics.:</span> there is no active connection. Connect, and a fresh sample is taken on its own.</li>
          <li><span className="font-medium">Rows show &quot;—&quot; with awaiting baseline, and the panel badge reads Learning baseline:</span> rate rows need two samples. Wait for the next refresh.</li>
          <li><span className="font-medium">Compile / Batch or Recompile / Compile shows N/A with low volume:</span> fewer than 50 batches or compilations happened in the interval, so a percentage would not be reliable. Use a longer interval such as 1 min.</li>
          <li><span className="font-medium">N/A with no interval yet:</span> the sample came less than half a second after the previous one, for example when two refreshes ran back to back after a connection change. The next refresh fills the row.</li>
          <li><span className="font-medium">⚠ Partial sample: ... could not be read; those rows show N/A.:</span> one or more metric groups failed, and the banner names them: Server Health, CPU, Memory &amp; Workload, Storage &amp; I/O, or TempDB. Last sample is followed by · partial, the affected panel reads N unavailable, and the other rows are valid. Check the permissions of the login.</li>
          <li><span className="font-medium">⚠ Nothing could be read from the server (...); all rows show N/A.:</span> no group could be read. Last sample does not advance, so it still shows the time of the last real reading.</li>
          <li><span className="font-medium">⚠ Refresh error: ...:</span> the refresh call itself failed. The message is shortened on screen; the full text is in the tooltip of the banner.</li>
          <li><span className="font-medium">SQL CPU % shows N/A with not reported:</span> the server did not return the SQL Server process CPU value.</li>
          <li><span className="font-medium">Pending I/O shows N/3 pressure samples:</span> the row is not judged yet; a status is assigned only after three consecutive refreshes with 2 or more pending requests.</li>
          <li><span className="font-medium">Max Server Memory is amber and reads Unlimited:</span> the default setting is still in use. The Configuration Audit explains the recommended cap.</li>
          <li><span className="font-medium">Configuration audit unavailable:</span> you are not connected.</li>
          <li><span className="font-medium">Configuration audit failed with an Audit Failed message:</span> the audit could not complete; the message contains the reason.</li>
          <li><span className="font-medium">Export Failed with Run the audit again for the current database connection.:</span> there is no result for the current connection: no audit has run yet, the connection was lost, or you changed the server or database after running it.</li>
          <li><span className="font-medium">Export Failed with No findings to export. or Window is not ready.:</span> the audit returned no findings, or the application window was not ready for the save dialog.</li>
          <li><span className="font-medium">Dashboard unavailable:</span> the screen layout could not be loaded; the message gives the reason.</li>
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

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Related References</div>
        <p className="text-sm text-gray-700">
          Dashboard is the entry point for triage. Continue in{' '}
          <Link href="/docs/modules/query-statistics" className="font-semibold text-primary hover:text-primary-dark">
            Query Statistics
          </Link>{' '}
          when the Workload panel or the compile ratios shift,{' '}
          <Link href="/docs/modules/wait-statistics" className="font-semibold text-primary hover:text-primary-dark">
            Wait Statistics
          </Link>{' '}
          when Workers, latency, or PFS/GAM Waits point to a wait pattern,{' '}
          <Link href="/docs/modules/blocking-analysis" className="font-semibold text-primary hover:text-primary-dark">
            Blocking Analysis
          </Link>{' '}
          when Active Sessions or Runnable / CPU change unexpectedly, and{' '}
          <Link href="/docs/modules/scheduled-jobs" className="font-semibold text-primary hover:text-primary-dark">
            Scheduled Jobs
          </Link>{' '}
          when the pressure lines up with a job window.
        </p>
      </div>
    </div>
  )
}
