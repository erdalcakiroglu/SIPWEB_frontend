import Link from 'next/link'
import LightboxImage from './LightboxImage'

const mainAreas = [
  'Header row: status line, freshness text (No snapshot yet, Updated HH:MM:SS, or Stale), the AUTO badge, the severity badge, and the Brief, Export, and Refresh Now buttons',
  'Summary tiles: Blocking Chains, Blocked Sessions, Maximum Depth, Total Wait, and Critical Blockers',
  'Workspace tabs for Graph, Tree, Sessions, and Timeline with a shared filter bar above the first three',
  'Blocking Context panel with an Overview tab (Quick Action, Alerts, Rule-Based Summary, Active Alerts) and a Session tab (SQL, Locks, Impact, History)',
]

const requirements = [
  'An active database connection. Without one the module shows "Please connect to a database first."',
  'The connected login needs VIEW SERVER STATE. If it is missing, the app says so and asks you to have a DBA grant it, then refresh.',
  'The module only reads session, request, lock, transaction, and plan information. It has no KILL button and never changes a session.',
  'The graph draws at most 300 sessions (head blockers first, then the longest waiters); the Sessions tab lists the rest.',
  'The Locks tab reads at most 500 lock groups per session.',
  'The Timeline covers the last 24 hours and shows at most 240 chart points and 180 table rows.',
  'Blocking history is stored on this computer, per server, for 30 days and at most 50,000 rows per server. Old rows are removed only by this age and size limit.',
  'The execution plan is available only while SQL Server still has a plan for the session.',
]

const topActions = [
  'The status line starts as "Ready." and then reads "N active blocking session(s)." or "No active blocking detected."',
  'AUTO badge shows the monitor interval from Settings (for example AUTO 5s), AUTO OFF when automatic refresh is disabled, or "AUTO 5s · FAILING" after three failed refreshes in a row',
  'Severity badge summarizes the latest snapshot: STANDBY (nothing loaded yet), CLEAR (no blocking), or the highest severity found: LOW, MEDIUM, HIGH, or CRITICAL',
  'Brief opens the "Blocking Brief" dialog with a rule-based recommendation for the current situation',
  'Export menu: Snapshot CSV (current sessions), Report (Markdown), and History CSV (recorded history, up to 30 days)',
  'Refresh Now captures an immediate snapshot and shows "Refreshing..." while it runs',
]

const filterControls = [
  'Search matches session ID, database, login, host, wait type, or program; in the Tree view the ancestors of a match are kept so the chain stays readable',
  'Severity limits the view to Critical, High, Medium, or Low sessions ("All severities" by default)',
  'Minimum wait (seconds) hides sessions that have waited less than this',
  'Apply runs the filter and Clear resets it; when nothing matches, the views show "No matching sessions" or "No sessions match the active filters"',
  'The filter bar applies to Graph, Tree, and Sessions; Timeline is not filtered',
]

const graphControls = [
  'The toolbar reads "Live Blocking Topology" with the number of sessions and blocking links; above 300 sessions it also says how many are only visible in the Sessions view',
  'The legend separates "Head blocker" from "Waiting session"; each card shows HEAD BLOCKER, EXTERNAL WAIT, or the severity, the SPID, database, login, program, and a depth marker such as D0',
  'Arrows point from the blocker to the blocked session and are labelled with the wait',
  'Use −, +, and Fit to zoom, drag the canvas to pan, scroll to zoom, and click a card to open it in the Blocking Context panel',
  'Export PNG saves the graph as an image; images larger than 20 MB are refused with "Graph image is too large to save. Filter the sessions or zoom in and try again."',
  'With no blocking the graph shows "No active blocking" and "SQL Server is not reporting a blocking chain."',
]

const alertRules = [
  { name: 'Blocked Session Count High', raised: '3 or more blocked sessions', level: 'always critical' },
  { name: 'Blocking Chain Depth High', raised: 'chain depth of 3 or more', level: 'warning; critical at depth 6 or more' },
  { name: 'Total Blocking Wait High', raised: 'total wait of 120,000 ms or more', level: 'warning; critical at 300,000 ms or more' },
  { name: 'Longest Blocked Session Wait High', raised: 'longest wait of 60,000 ms or more', level: 'warning; critical at 120,000 ms or more' },
  { name: 'Critical Blocker Count High', raised: '1 or more critical blockers', level: 'always critical' },
]

const webhookControls = [
  'Webhook Enabled turns delivery on or off; turning it on without an address shows "Enter the webhook address before turning alerts on."',
  'URL is the webhook address. It must start with http:// or https://, contain a host, contain no spaces, user name, or password, and be at most 2,048 characters. The app warns when the address uses http:// or points to an internal host.',
  'Channel is an optional channel name such as #dba-alerts',
  'Save Webhook validates and saves ("Webhook settings saved."); Test Webhook saves first and then posts the current alerts (or a synthetic test alert) to the address; Remove Address deletes the saved address and appears only when one is saved',
  'The address is kept in the operating system credential store and shown only masked ("Saved address: ..."); the dialog also shows the last delivery result ("Last delivery: sent at ..." or "failed at ..." with a reason such as timed out, TLS error, invalid URL, connection failed, or HTTP <code>)',
]

const smartAlertControls = [
  'DB contains: comma-separated database name parts such as prod, prd, live. Only alerts that involve a visible session in a matching database notify; matching is case-insensitive and an empty value means all databases.',
  'Min Severity: critical (only critical alerts), warning (critical and warning), or info (all alerts)',
  'Min Chain: minimum number of chains (1 to 100) before a notification is sent',
  'Cooldown (s): minimum seconds (10 to 3600, default 60) before the same alert notifies again',
  'Sound plays a short beep with the notification; Save Rules stores the rules on this computer ("Notification rules saved.")',
]

const reportDownloads = [
  {
    name: 'Sample Blocking Report (Markdown)',
    href: '/docs/blocking-analysis/blocking_report_20261004_155136.md',
    summary:
      'Markdown report produced by Export > Report in version 1.1.0 against a WideWorldImporters test chain (one head blocker, three blocked sessions). It contains the summary metrics, the head blocker line, the Blocking Sessions table (Session, Blocked By, Wait Type, Wait, Severity, Safe Kill) and a Lock Summary section. In reports saved from the app the Lock Summary reads "No lock details available."; use the Locks tab for lock evidence.',
  },
]

const interpretationGuide = [
  'One head blocker with many affected sessions usually means the incident is concentrated: resolving the root transaction relieves the whole backlog.',
  'A high Total Wait with a modest Maximum Depth points to a wide fan-out under one blocker; rising depth points to cascading contention rather than a simple two-session block.',
  'A head blocker that is idle with open transactions is usually an application that did not commit or roll back, not a slow query. The SQL tab shows its last batch for exactly this case.',
  'Session IDs are reused by SQL Server. The History tab says whether it matched the session by identity (login, program, host) or only by session ID; trust the identity match.',
  'The Impact tab estimates blast radius and the History tab shows recurrence; read both before escalating to the application owner.',
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
      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm leading-7 text-gray-700">{body}</p>
        </div>
        <LightboxImage
          src={image}
          alt={alt}
          width={width}
          height={height}
          className="mx-auto max-w-6xl"
          imageClassName="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-[1.01]"
        />
      </div>
    </div>
  )
}

export default function BlockingAnalysisTemplate() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Overview</div>
        <p className="text-sm text-gray-700">
          Blocking Analysis, shown as <strong>Blocking</strong> in the sidebar (&quot;Blocking chains and sessions&quot;),
          opens the <strong>Blocking Operations Center</strong>. It shows which sessions on the connected SQL Server are
          blocked, who is blocking them, and how long they have been waiting. It draws the blocking chains as a graph, a
          tree, and a table, keeps a local history of past blocking, and can send alerts to a webhook. The module only
          reads information about sessions: it does not end sessions or run any command that changes the server.
        </p>
        <p className="mt-3 text-sm text-gray-700">
          It works best beside{' '}
          <Link href="/docs/modules/wait-statistics" className="font-semibold text-primary hover:text-primary-dark">
            Wait Statistics
          </Link>{' '}
          when waits suggest lock pressure, and{' '}
          <Link href="/docs/modules/query-statistics" className="font-semibold text-primary hover:text-primary-dark">
            Query Statistics
          </Link>{' '}
          when you need plan and query evidence behind the blocking session.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm text-gray-700">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What You Can Do</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>See every blocking chain, its head blocker, depth, and total wait at a glance.</li>
              <li>Inspect a session: the statement it is running, the locks it holds, the sessions it affects, and its recent blocking history.</li>
              <li>Open the execution plan of a session when SQL Server still has one.</li>
              <li>Review the last 24 hours of blocking on a timeline.</li>
              <li>Export the current snapshot, a Markdown report, the history, or the graph image.</li>
              <li>Get in-app alerts and optional webhook messages (for example to Slack) when blocking crosses the alert rules.</li>
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

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Requirements and Limits</div>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          {requirements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">How To Read The Screen</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Start With Severity and the Tiles</div>
            <p>
              The severity badge reports the worst session in the latest snapshot. STANDBY means nothing is loaded yet
              and CLEAR means no blocking. LOW, MEDIUM, HIGH, or CRITICAL means blocking is active. The tiles add the
              number of chains, blocked sessions, maximum chain depth, total wait in seconds, and how many head blockers
              are themselves critical.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Use Graph For Shape</div>
            <p>
              The graph answers who is blocking whom, how deep the chain goes, and whether a single root session is
              creating a broad outage. Each arrow carries the wait of the blocked session.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Use Tree and Sessions For Exact Rows</div>
            <p>
              Tree nests blocked sessions under their blockers; Sessions lists the same rows flat. Both show Session ID,
              Wait Type, Wait Time, Depth, Database, Login, and Host.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Use Blocking Context For Decisions</div>
            <p>
              Select a session to enable the Session tab. SQL text, on-demand lock details, impact estimates, recurrence
              history, and the execution plan together show whether an issue is a blocking writer, a long open
              transaction, or a downstream victim.
            </p>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 1"
        title="Blocking Operations Center: Live Blocking Topology and Session SQL"
        body="The fastest triage view. The header shows the status line, the AUTO 5s badge, and the HIGH severity badge; the tiles size the incident (one chain, three blocked sessions, depth 3). The Graph tab draws the live blocking topology: the head blocker SPID 112 at depth D0 and the waiting sessions below it, each arrow labelled with the wait. The selected head blocker is open in the Blocking Context panel on the SQL tab, which shows Blocked By, Severity, Depth, Program, CPU, Command, Longest Blocked Wait, Resource, and Open Transactions, followed by the last batch the idle session sent and the note that the lock may come from an earlier statement in the same transaction."
        image="/docs/blocking-analysis/001.png"
        alt="SQLPerformance AI Blocking Operations Center showing the header with AUTO and severity badges, summary tiles, the Live Blocking Topology graph with a head blocker and three waiting sessions, and the Blocking Context panel on the SQL tab for the selected head blocker"
        width={1913}
        height={946}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Summary Tiles and Severity</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Tiles</div>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Blocking Chains</strong>: number of separate blocking chains.</li>
              <li><strong>Blocked Sessions</strong>: sessions that are currently blocked.</li>
              <li>
                <strong>Maximum Depth</strong>: number of levels in the longest chain, head blocker included; a head
                blocker with one waiting session is depth 2. The D markers in the graph start at D0 for the head
                blocker, so the deepest marker is one lower than this tile.
              </li>
              <li><strong>Total Wait</strong>: combined wait time of the blocked sessions, in seconds.</li>
              <li>
                <strong>Critical Blockers</strong>: head blockers whose severity is Critical. A head blocker takes the
                longest wait among the sessions it blocks, so it is Critical when one of them has waited 60 seconds or
                more (default limit).
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Severity Model</div>
            <p className="mb-2">A session&apos;s severity comes from how long it has waited. Default limits:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>LOW: under 5 seconds</li>
              <li>MEDIUM: 5 to under 30 seconds</li>
              <li>HIGH: 30 to under 60 seconds</li>
              <li>CRITICAL: 60 seconds or more</li>
            </ul>
            <p className="mt-2">
              The Low, Medium, and High limits (0 to 3600 seconds, Low ≤ Medium ≤ High) are changed under Blocking
              Analysis (Monitor and Severity Thresholds) in{' '}
              <Link href="/docs/settings" className="font-semibold text-primary hover:text-primary-dark">
                Settings
              </Link>{' '}
              &gt; General.
            </p>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 2"
        title="Graph Tab: A Four-Level Chain"
        body="The Graph tab on a deeper incident. The page header reads Blocking with the subtitle Blocking chains and sessions; the status line says 5 active blocking session(s) with the AUTO 5s and HIGH badges, and the tiles show one chain, five blocked sessions, Maximum Depth 4, Total Wait 187.5s, and no critical blocker. Live Blocking Topology (6 sessions · 5 blocking links) draws the head blocker SPID 125 at D0, SPID 97 at D1, SPID 105 and SPID 114 at D2, and SPID 106 and SPID 119 at D3, each arrow labelled with the wait of the session below it. Card colours follow the wait of each session, so one chain mixes HIGH cards (30 seconds or more) with a MEDIUM card (24.1 s)."
        image="/docs/blocking-analysis/002.png"
        alt="Blocking Analysis Graph tab showing a chain with the head blocker SPID 125 and five waiting sessions across four levels, with depth markers D0 to D3 and wait labels on each arrow"
        width={1083}
        height={911}
      />

      <ScreenshotCard
        eyebrow="Screen 3"
        title="Tree View and the SQL Tab of an Idle Head Blocker"
        body="Tree lays the incident out as an indented hierarchy under each head blocker. The badge is now CRITICAL and the Critical Blockers tile reads 1 because the longest wait has passed 60 seconds. The head row is marked HEAD · 125 and shows HEAD BLOCKER in the Wait Type column; below it SPID 97 (LCK_M_X, depth 1), SPID 105 (LCK_M_U, depth 2), SPID 106 and SPID 119 (depth 3), and SPID 114 (depth 2) carry their wait time, database, login, and host (login and host are blurred in this screenshot). The filter bar above the table is shared with Graph and Sessions. On the right, the head blocker is open in Blocking Context on the SQL tab: SPID 125 · WideWorldImporters, status sleeping, the Open Plan button, and the tiles Blocked By Head blocker, Severity CRITICAL, Depth 0, Program, CPU 0.0 s, Command, Longest Blocked Wait 1m 53s, Resource, and Open Transactions 1 · oldest 2m 7s. Because the session is idle, the panel shows the last batch it sent with the note that the lock may come from an earlier statement in the same transaction."
        image="/docs/blocking-analysis/003.png"
        alt="Blocking Analysis Tree tab with a CRITICAL badge, the head blocker row HEAD · 125 and five indented blocked sessions, and the Blocking Context panel on the SQL tab showing the idle head blocker tiles and its last batch"
        width={1622}
        height={908}
      />

      <ScreenshotCard
        eyebrow="Screen 4"
        title="Sessions List and the Waiting Statement"
        body="Sessions lists the blocked sessions as a flat table with the same columns as Tree: Session ID, Wait Type, Wait Time, Depth, Database, Login, and Host (login and host blurred here). Use it to scan or search a large incident quickly, and to find the sessions the graph leaves out when more than 300 are blocked. The selected row, SPID 97, is open on the SQL tab: Blocked By SPID 125, Severity CRITICAL, Depth 1, Command UPDATE, Wait LCK_M_X · 3m 18s, Resource WideWorldImporters.Sales.Orders (index PK_Sales_Orders), Open Transactions 2, and under Statement that is waiting. the UPDATE statement itself. The header status reads suspended, the normal state of a session waiting for a lock."
        image="/docs/blocking-analysis/004.png"
        alt="Blocking Analysis Sessions tab listing five blocked sessions, with the Blocking Context panel on the SQL tab showing the waiting session SPID 97, its lock resource, and the statement that is waiting"
        width={1616}
        height={695}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Controls and Filters</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Header Row</div>
            <ul className="list-disc pl-5 space-y-1">
              {topActions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Filter Bar</div>
            <ul className="list-disc pl-5 space-y-1">
              {filterControls.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 md:col-span-2">
            <div className="font-semibold mb-1">Graph Toolbar</div>
            <ul className="list-disc pl-5 space-y-1">
              {graphControls.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-2">
              An <strong>external wait</strong> is a session that waits for something that is not another session: an
              orphaned distributed transaction or a deferred recovery transaction.
            </p>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 5"
        title="Timeline View for Recurrence and Trend Direction"
        body="Timeline loads the last 24 hours of samples recorded by the desktop app for the active server; it is not a built-in SQL Server blocking history. The summary line lists samples, average system wait load, peak chain wait, peak depth, and the latest wait (here 1024 samples and peak_depth=4). Tiles show Current, Peak, Average, and Samples for blocked sessions (5, 6, 1.1, and 1024 in the screenshot). The chart plots blocked sessions over time with at most 240 points; hover a point for details, and read the covered period in the footer line. The table lists the last 180 snapshots with Captured At, Chains, Depth, and Total Wait (ms). With nothing recorded it shows No timeline data; if loading fails it shows Timeline unavailable."
        image="/docs/blocking-analysis/006.png"
        alt="Blocking Analysis Timeline tab showing the 24-hour summary line, the Current, Peak, Average, and Samples tiles, a chart of blocked sessions over time, and the captured snapshot table"
        width={1085}
        height={810}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Blocking Context: Overview Tab</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Quick Action</div>
            <p>
              Investigate picks the blocker with the most blocked sessions (then the largest total wait) and opens that
              session&apos;s Impact tab. The card reads, for example, &quot;Session 112 blocks 3 session(s), total
              impacted wait 95,100 ms.&quot; Without a connection it shows &quot;No connection: quick actions
              disabled.&quot;
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Alerts and Rule-Based Summary</div>
            <p>
              ALERTS summarizes the active alerts (&quot;Alerts: none&quot; when there are none). RULE-BASED SUMMARY is
              a plain-language summary built from fixed rules; it does not call an AI service. Active Alerts lists each
              alert with its severity (empty state: &quot;No active alerts&quot;) and holds the Notification Settings
              button.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 md:col-span-2">
            <div className="font-semibold mb-1">Alert Rules (fixed)</div>
            <ul className="list-disc pl-5 space-y-1">
              {alertRules.map((rule) => (
                <li key={rule.name}>
                  <strong>{rule.name}</strong>: raised at {rule.raised}; level: {rule.level}.
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 6"
        title="CLEAR State and the Overview Tab"
        body="With no blocking the status line reads No active blocking detected., the badge is CLEAR, every tile is 0, and the Graph tab shows No active blocking with SQL Server is not reporting a blocking chain. Blocking Context is on the Overview tab: QUICK ACTION reads No blocker recommendation yet. with Investigate disabled, ALERTS reads Alerts: none, RULE-BASED SUMMARY reads Summary: no active blocking sessions, and Active Alerts shows No active alerts with No blocking threshold violations were detected. beside the Notification Settings button. This is the screen to expect most of the time; while AUTO is on, the monitor keeps checking in the background."
        image="/docs/blocking-analysis/008.png"
        alt="Blocking Analysis in the CLEAR state: zero tiles, the No active blocking message in the Graph tab, and the Blocking Context Overview tab with Quick Action, Alerts, Rule-Based Summary, and the Active Alerts panel with the Notification Settings button"
        width={1613}
        height={673}
      />

      <div className="grid gap-8 xl:grid-cols-2">
        <ScreenshotCard
          eyebrow="Screen 7"
          title="Blocking Brief"
          body="Brief opens the Blocking Brief dialog: a rule-based summary of the current snapshot with profile, confidence, priority and risk, primary bottleneck, chain count, sessions in chains, max depth, total wait, chain peak wait total, evidence gaps, and the reason the summary was chosen. Top Recommendations lists CRITICAL, WARNING, and INFO items with suggested actions, and Top Wait Types explains the dominant wait. It is produced by fixed rules, not by a language model. When no rule applies it shows No recommendation available."
          image="/docs/blocking-analysis/007.png"
          alt="Blocking Brief dialog showing the rule-based summary with confidence, priority, primary bottleneck, chain metrics, top recommendations, and top wait types"
          width={456}
          height={738}
        />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Session Tab</div>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="font-semibold mb-1">SQL</div>
              <p>
                The header shows SPID and database, the login, host, and status, and the Open Plan button. The SQL tab
                lists Blocked By, Severity, Depth, Program, CPU, Command, Wait (Longest Blocked Wait for a head
                blocker), Resource, and Open Transactions with the age of the oldest. A waiting session shows the
                statement that is waiting; a running head blocker shows its batch or procedure; an idle head blocker
                shows its last batch with the note that the lock may come from an earlier statement. Long text is cut
                and marked &quot;Showing the first X of Y characters&quot;; missing text reads &quot;-- SQL text is
                unavailable.&quot;
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="font-semibold mb-1">Locks</div>
              <p>
                Reads the locks the session holds from sys.dm_tran_locks on demand and groups them (fine-grained key,
                page, row, and extent locks are grouped; names are resolved without taking locks of their own). Each
                row shows the resource with its request mode, request status, and lock count, under a &quot;Locks read
                at HH:MM:SS.&quot; line. Above 500 groups it says &quot;Showing the top 500 lock groups by lock count.
                This session holds more.&quot; Empty state: &quot;No lock details&quot;.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="font-semibold mb-1">Impact</div>
              <p>
                Tiles: Directly Blocked, Affected Sessions, Levels Below, Peak Wait, Total Wait, Risk, Current Wait, and
                Kill Safety (advisory only), followed by the list of blocked session IDs. Risk is HIGH when 8 or more
                sessions are affected or the peak wait is 120,000 ms or more, MEDIUM at 4 or more sessions or 60,000 ms,
                otherwise LOW; a system session is rated CRITICAL. Kill Safety shows Eligible or Not recommended with a
                reason (system session, non-user process, replication session, backup or restore in progress, or a
                protected command). It is advice only: the module cannot end the session.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="font-semibold mb-1">History</div>
              <p>
                Shows whether the session was matched by identity (login, program, and host) or only by session ID,
                and the scope: the last 7 days or the shorter period actually covered.
                Rows show the number of incidents, first and last seen, the peak wait, and the average number of blocked
                sessions. Empty state: &quot;No recurring history&quot;.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ScreenshotCard
        eyebrow="Screen 8"
        title="Impact Tab for Blast Radius"
        body="Impact for SPID 97, a session that is itself blocked by the head blocker and blocks two more. Tiles: Directly Blocked 2, Affected Sessions 4, Levels Below 2, Peak Wait 267,913 ms, Total Wait 1,035,663 ms, Risk HIGH (the peak wait is above 120,000 ms), Current Wait 4m 38s, and Kill Safety (advisory only) Eligible, followed by the blocked sessions SPID 105 and SPID 114 with their database and current wait. Kill Safety is advice for the DBA; the module cannot end a session."
        image="/docs/blocking-analysis/005.png"
        alt="Blocking Context Impact tab for session 97 showing Directly Blocked, Affected Sessions, Levels Below, Peak Wait, Total Wait, Risk HIGH, Current Wait, and Kill Safety tiles, followed by the list of blocked sessions"
        width={1618}
        height={561}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Execution Plan</div>
        <p className="text-sm text-gray-700">
          Open Plan in the Session tab reads the cached plan of the session&apos;s running request from
          sys.dm_exec_query_plan and opens the Execution Plan dialog. It shows a status line such as &quot;Plan captured
          successfully | N operator(s) | No warnings&quot;, the operator tree with details, and a collapsible &quot;Plan
          XML (N characters)&quot; section with Copy XML and Close buttons. If SQL Server has no plan for the session,
          which is the normal case for an idle head blocker, the dialog reports that no execution plan is currently
          available for this session.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Data Sources and Monitoring</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Live SQL Sources</div>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-mono">sys.dm_exec_requests</span> and <span className="font-mono">sys.dm_os_waiting_tasks</span></li>
              <li><span className="font-mono">sys.dm_exec_sessions</span> and <span className="font-mono">sys.dm_exec_connections</span></li>
              <li><span className="font-mono">sys.dm_tran_locks</span></li>
              <li><span className="font-mono">sys.dm_tran_session_transactions</span> and <span className="font-mono">sys.dm_tran_active_transactions</span></li>
              <li><span className="font-mono">sys.dm_exec_sql_text(...)</span></li>
              <li><span className="font-mono">sys.dm_exec_query_plan(...)</span></li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Background Blocking Monitor</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                While a database is connected, the app checks blocking in the background whichever page is open. The
                interval comes from Settings (Monitor Refresh Interval, default 5 seconds, allowed 2 to 300).
              </li>
              <li>
                Polling slows down automatically while refreshes fail or the window is hidden (to at most five
                minutes) and returns to the normal interval when they recover. After three failed refreshes in a row the
                app shows &quot;Blocking monitor is failing&quot; and the badge &quot;AUTO 5s · FAILING&quot;, then
                &quot;Blocking monitor recovered&quot;.
              </li>
              <li>
                When an incident starts, a notification titled &quot;Blocking detected&quot; appears inside the app
                window; when a further session joins the incident, &quot;New blocked session detected&quot; names it.
                Both summarize chains, blocked sessions, head blockers, and the longest wait.
              </li>
              <li>
                Turn off &quot;Start Blocking Analysis with Auto-Refresh enabled by default&quot; in Settings &gt;
                General to stop the monitor. The module then shows AUTO OFF and refreshes only on Refresh Now. A second
                option, &quot;Automatically run blocking check after a database connection is established&quot;,
                controls the first check after connecting.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Snapshot History</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                History is recorded only while the app is open and Blocking is being refreshed by the monitor or by
                Refresh Now. Samples taken during blocking are stored on every refresh; samples with no blocking at most
                once per minute.
              </li>
              <li>
                Snapshots are kept on this computer, per server, for 30 days and at most 50,000 rows per server; the
                oldest rows are trimmed automatically.
              </li>
              <li>Timeline, History, and History CSV depend on these snapshots, not on anything stored by SQL Server.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Which View Answers What</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Graph and Tree answer chain structure.</li>
              <li>The Session tab answers who the blocker is and what it holds.</li>
              <li>Timeline and History answer recurrence and trend.</li>
              <li>Notifications and the webhook answer visibility outside the module.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Notifications and Webhook</div>
        <p className="text-sm text-gray-700">
          Notification Settings, opened from the Overview tab, is titled &quot;Webhook fanout and smart alert rules for
          blocking incidents.&quot; Alerts are evaluated from the automatic checks, so keep the app connected with the
          monitor on. When a notification fires, the app shows a &quot;Blocking Alert&quot; notification inside its
          window with a status message such as &quot;N blocking alert(s) active (critical=N, chain_count=N).&quot;; if the
          webhook is enabled and configured, the same alerts are posted to the webhook in the background. This is not a
          server-side alerting service.
        </p>
        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Screen 9</div>
          <div className="font-semibold mb-1">Incident Notification</div>
          <p className="mb-3">
            Incident notifications are separate from the alert rules and need no setup. When blocking starts, a
            notification titled &quot;Blocking detected&quot; appears in the corner of the app window; when another
            session joins the incident, &quot;New blocked session detected&quot; lists the new SPID, the chain and
            blocked session counts, the head blocker, and the longest wait. Each stays for about ten seconds.
          </p>
          <LightboxImage
            src="/docs/blocking-analysis/009.png"
            alt="In-app notification titled New blocked session detected, listing the new SPID, one chain, five blocked sessions, the head blocker SPID 125, and the longest wait"
            width={340}
            height={80}
            sizes="340px"
            className="max-w-[340px]"
            imageClassName="h-auto w-full"
          />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Webhook</div>
            <ul className="list-disc pl-5 space-y-1">
              {webhookControls.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="font-semibold mb-1">Smart Alerts</div>
            <ul className="list-disc pl-5 space-y-1">
              {smartAlertControls.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 md:col-span-2">
            <div className="font-semibold mb-1">What a Webhook Message Contains</div>
            <p>
              A JSON post with a text body: a header line (&quot;Blocking alerts: total=N, critical=N, chains=N,
              depth=N&quot;), up to 8 alert lines in the form &quot;[SEVERITY] title: message&quot;, and optionally a
              mention line and the channel. The message contains alert text, not session SQL. A 2xx response counts as
              success; redirects are not followed and are reported as &quot;HTTP &lt;code&gt; redirect&quot;. Delivery
              works only while this computer can reach the webhook address.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Exports and Example Report</div>
        <p className="text-sm text-gray-700">
          All exports open a file save dialog. <strong>Snapshot CSV</strong> exports the current sessions and needs a
          recent analysis (otherwise: &quot;Refresh blocking analysis before exporting.&quot;). <strong>Report</strong>{' '}
          saves a Markdown file of the current analysis, named like{' '}
          <span className="font-mono">blocking_report_YYYYMMDD_HHMMSS.md</span>. <strong>History CSV</strong> exports
          the recorded history (up to 30 days), and <strong>Export PNG</strong> in the Graph toolbar saves the graph
          image. Export files can contain login, host, and database names and SQL text; check the content before
          sharing.
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
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Recommended Workflow</div>
        <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
          <li>Open Blocking and read the severity badge and the tiles before filtering anything. If nothing loads, click Refresh Now.</li>
          <li>Use Graph to understand the chain shape, then Tree or Sessions to validate the exact root and downstream sessions.</li>
          <li>Press Investigate in Quick Action, or select the card or row marked HEAD BLOCKER, and read the SQL tab: the batch or last batch and the Open Transactions value.</li>
          <li>Open Locks to see what the session holds and Impact to see how many sessions wait behind it.</li>
          <li>Use Open Plan when the session is running a statement and you need its plan.</li>
          <li>Check History and Timeline to decide whether the blocker is a one-off or recurring; use History CSV to take the longer record to another tool.</li>
          <li>Export the Markdown report, Snapshot CSV, or the graph PNG if the incident needs handoff or an audit trail.</li>
        </ol>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Interpretation Guide</div>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          {interpretationGuide.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Troubleshooting</div>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>&quot;Please connect to a database first.&quot; means no active connection. Connect and refresh.</li>
          <li>&quot;The connected login needs the VIEW SERVER STATE permission...&quot; means the login cannot read blocking sessions. Ask a DBA to grant it.</li>
          <li>A lock wait timeout message (&quot;SQL Server reported a lock wait timeout while ... Refresh to try again.&quot;) means the read itself timed out. Refresh.</li>
          <li>&quot;Stale · last update HH:MM:SS&quot; means the last refresh failed or is old. Click Refresh Now; if another refresh is already running, the app waits for it for up to five minutes before reporting that it is busy.</li>
          <li>AUTO OFF means automatic refresh is disabled in Settings.</li>
          <li>The Timeline is empty if the app was not running and refreshing during the period. History is not collected while the app is closed.</li>
          <li>If a webhook test fails, read the reason in the Last delivery line: TLS error means the certificate was not accepted; HTTP &lt;code&gt; redirect means the address redirects, which the app does not follow.</li>
        </ul>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-amber-900 mb-2">Safety Notes</div>
        <ul className="list-disc pl-5 text-sm text-amber-950 space-y-1">
          <li>
            The module is read-only investigation. It does not terminate sessions or change anything on the server.
          </li>
          <li>
            The Kill Safety (advisory only) tile in the Impact tab and the Safe Kill column in the Markdown report are
            advisory flags only. They mark system sessions, non-user processes, replication, backup or restore work, and
            protected commands. Any intervention stays with the DBA, outside the app.
          </li>
          <li>Severity, risk, and the rule-based summaries are heuristics and still require operator judgment.</li>
          <li>History quality depends on whether the desktop app was connected and capturing snapshots during the incident window.</li>
          <li>Exports and webhook messages leave the app: reports can contain login, host, and database names and SQL text.</li>
        </ul>
      </div>
    </div>
  )
}
