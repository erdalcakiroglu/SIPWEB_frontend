import Link from 'next/link'

const mainAreas = [
  'Header: the caption SECURITY POSTURE WORKBENCH, the title SQL Server Security Audit, and a status line that starts as "Ready to audit."',
  'Command bar: the Extended Instance Scan checkbox, Save HTML, the primary Run Audit button (it reads "Running..." while busy), and a progress bar with the current step',
  'Left panel with three tabs: Findings, Logins, and Access Matrix. The heading follows the tab (Security Findings, Login Inventory, Access Matrix); each tab has a search box, filters, and a counter. Export XLSX appears only in the Access Matrix view.',
  'Right panel "Security Context" with an Overview tab and a Finding Detail tab; Finding Detail stays disabled until you select a finding. On narrow windows a Results / Context switch toggles between the two panels.',
]

const requirements = [
  'An active database connection. Without one the module shows "Please connect to a database first."',
  'The audit runs with the permissions of the connected login and does not stop when permissions are missing. It measures what the login can do and adapts; see "Permissions and What the Audit Can Measure" below. A sysadmin login gives the most complete result.',
  'Several checks look only at the database of your current connection: object and schema permissions, impersonation grants, CLR assemblies, database audit specifications, the TRUSTWORTHY privilege-escalation pattern, and database scoped credentials. Connect to the database you want examined.',
  'Extended Instance Scan widens cross-database coverage (guest access and public role permissions across all databases, and the cross-database login mapping used by the inactive login review). It does not bypass permission or edition limits. When it is off, the scope notes say: "Extended instance scan is off. Cross-database guest/public checks and login-mapping enrichment were skipped."',
  'The audit is long and cannot be canceled. While it runs, Run Audit, Save HTML, Export XLSX, the checkbox, and the Access Matrix are disabled. Starting an audit while the access matrix is loading (or the other way around) is refused with "Another security operation is already in progress..."',
  'The checks read catalog views, system views, and functions. Some checks create and drop temporary tables in tempdb (error log and per-database scans), run dynamic SQL per database, and read registry values through an extended procedure. The audit does not change server configuration or data.',
  'The patch status card needs outbound HTTPS: it refreshes its catalog from Microsoft Learn with an 8-second timeout and keeps a cached copy for 24 hours. If the refresh fails, the card says so in its Source line and the report context carries a warning.',
  'Error log findings use a 7-day window and have read limits; see "Error Log Findings" below.',
  'Results are cached per connection. Changing the connection clears the cached audit, and a change of connection while an audit runs discards that run ("The connection changed while the audit was running. Run the audit again.").',
  'The audit is a fixed set of rule-based T-SQL checks plus scoring inside the application. It does not send anything to an AI provider; a Refresh of the application shell re-runs the audit, except when the refresh was caused by changing the LLM provider ("The audit does not use the LLM").',
]

const capabilityChecks = [
  'If the login has neither sysadmin nor VIEW ANY DEFINITION, the audit notes that catalog views may hide principals, permissions, and object definitions, so counts can be lower than the real values.',
  'The empty-password and weak-password checks need visible password hashes. If hashes are visible for only some SQL logins, the checks cover only those logins and the audit says so. If they are visible for none, the checks are listed as not measurable.',
  'The locked-account review is listed as not measurable when the lock status of the SQL logins cannot be read.',
  'Reading the SQL Server error log needs EXECUTE on the log procedure together with VIEW SERVER STATE or securityadmin membership. If the login cannot read the log, the server critical event review is recorded as skipped and a scope note explains the required permissions.',
  'SQL Agent job checks read the msdb job tables. A failed query is reported as a skipped check; the hint says such checks often fail because of missing SQL permissions, msdb or SQL Agent access, or edition limits.',
]

const progressSteps = [
  'Collecting server security summary...',
  'Collecting database security summary...',
  'Measuring audit login capabilities...',
  'Loading server logins...',
  'Loading sysadmin memberships...',
  'Loading database owner memberships...',
  'Loading orphaned users...',
  'Running security checks: <group> (i/10)...',
  'Finalizing security findings...',
  'Computing maturity score...',
  'Collecting report context...',
]

const checkGroups = [
  'Authentication and server permissions',
  'Surface area and execution',
  'Object permissions and impersonation',
  'Network and linked server posture',
  'Database authorization and agent posture',
  'Patch and login hygiene',
  'Database configuration posture',
  'Locked account review',
  'Server critical event review',
  'Monitoring and encryption posture',
]

const completionStatuses = [
  '"Audit completed" followed by the collection time',
  '"Audit completed with skipped checks" when at least one check failed at run time',
  '"Audit completed with limited context" when the report context (server facts, patch catalog) was only partly collected',
  '"Audit completed, N check(s) not measurable" when checks were excluded because of the auditing login’s permissions',
]

const failureMessages = [
  'The security audit could not be completed. Check the database connection and your SQL permissions, then try again.',
  'The audit did not receive any data from the server. Check the connection and your SQL permissions, then run it again.',
  'The connection changed while the audit was running. Run the audit again.',
]

const patchFacts = [
  'Current',
  'Recommended',
  'Latest CU',
  'Latest GDR',
  'Latest CU + GDR',
  'Lag ("N CU behind, N days behind", or "None" when up to date)',
  'Source',
  'Catalog date (with "(today)" or "(n days old)")',
]

const patchSources = [
  'Microsoft Learn, just refreshed',
  'Microsoft Learn, cached copy under 24 hours old',
  'cached copy of Microsoft Learn, refresh failed',
  'built-in offline catalog, refresh failed',
]

const identityTiles = [
  'SQL Logins',
  'Windows Logins',
  'Additional Sysadmins',
  'Disabled',
  'DB Users',
  'DB Owners',
  'Orphaned',
  '"<sa name> login" with Disabled or Enabled',
]

const severityWeights = [
  { severity: 'Critical', weight: '25' },
  { severity: 'High', weight: '10' },
  { severity: 'Medium', weight: '5' },
  { severity: 'Low', weight: '1' },
  { severity: 'Info', weight: '0' },
]

const maturityLevels = [
  { score: '0 to 30', level: 'Level 1', label: 'Initial / Uncontrolled' },
  { score: '31 to 55', level: 'Level 2', label: 'Reactive' },
  { score: '56 to 72', level: 'Level 3', label: 'Defined' },
  { score: '73 to 88', level: 'Level 4', label: 'Managed' },
  { score: '89 to 100', level: 'Level 5', label: 'Optimized / Hardened' },
]

const scoreCaps = [
  'Any Critical finding limits the level to 2 and the score to 40.',
  'Otherwise, any High finding limits the level to 4 and the score to 80.',
  'If one of the findings Force Encryption Disabled, SQL Server Audit Not Enabled, or Login Auditing Disabled is present, the level is limited to 3. Level 3 then caps the score at 72, and level 2 caps it at 55.',
  'If the audit is incomplete (a check was skipped), the score is not shown and the level label carries the suffix "(Partial Audit)".',
]

const categoryGroups = [
  { group: 'Access Control', categories: 'Authentication, Authorization, Server Permissions, User Management' },
  { group: 'Surface Area', categories: 'Surface Area, Execution, SQL Agent, Credentials' },
  { group: 'Network', categories: 'Network/Endpoints, Linked Servers, Network/Authentication, Network/Encryption' },
  { group: 'Audit & Monitoring', categories: 'Monitoring & Audit, Server Critical Events' },
  { group: 'Encryption', categories: 'Encryption' },
  { group: 'Patch', categories: 'Patch Management' },
  { group: 'Database Config', categories: 'Database Configuration' },
  { group: 'Other', categories: 'everything else' },
]

const findingDetailParts = [
  'Copy Issue copies the finding as text (toast "Finding copied to the clipboard."); Copy Query copies the verification query and is shown only when the finding has one (toast "Verification query copied to the clipboard.").',
  'The description, followed by "Why it matters", "Attack scenario", and "Recommendation".',
  '"Compliance": control ID, compliance reference, CIS, ISO 27001 Annex A, and NIST 800-53 references.',
  '"Evidence (n)": the first 10 items with "Show more (n more)" / "Show less". The evidence a finding collects is itself capped, usually at 10 to 12 items followed by "... (+N more)".',
  'A "Verification Query" block with T-SQL you can run yourself to confirm the finding.',
]

const findingEmptyStates = [
  '"No audit yet" with "Run Audit to collect security findings for the connected instance." before the first run',
  '"No matching findings" when the search or filters exclude everything',
  '"No security issues found!" with "Completed checks did not return any findings." when a complete audit found nothing',
  '"No security issues found in completed checks" (with "Audit skipped N check(s), so results may be incomplete.") or "No security issues found in measurable checks" when checks were skipped or not measurable, because a clean result is not proven in that case',
]

type Finding = { name: string; severity: string }

const authenticationFindings: Finding[] = [
  { name: 'Mixed Mode Authentication Enabled', severity: 'High; Medium if the sa login is disabled' },
  { name: 'Built-in SA Login Not Renamed', severity: 'Medium; Low if sa is disabled' },
  { name: 'SA Account Enabled', severity: 'High' },
  { name: 'CONTROL SERVER Granted to Non-Sysadmin', severity: 'Critical' },
  { name: 'High-Risk Server Permissions Granted', severity: 'High' },
  { name: 'Wide-Read / Recon Server Permissions Granted', severity: 'Medium' },
  { name: 'Explicit Server DENY Permissions Present', severity: 'Info' },
  { name: 'Excessive Sysadmin Members', severity: 'Medium (more than 5 additional sysadmin members)' },
  { name: 'Orphaned Database Users', severity: 'Medium' },
  { name: 'Logins with Empty Passwords', severity: 'Critical' },
  { name: 'Disabled Logins with Empty Passwords', severity: 'Info' },
  { name: 'Logins with Weak Passwords', severity: 'Critical (password hash compared with a built-in list of weak passwords)' },
  { name: 'Weak Password Policies', severity: 'Medium' },
  { name: 'Locked Login Accounts', severity: 'High if a locked login is a sysadmin, Medium if a lockout occurred in the last 24 hours, otherwise Info' },
  { name: 'Inactive Logins', severity: 'Low (threshold from Settings, default 90 days)' },
]

const surfaceAreaFindings: Finding[] = [
  { name: 'Risky Server Features Enabled', severity: 'High if xp_cmdshell, Ole Automation Procedures, Ad Hoc Distributed Queries, external scripts, or CLR is enabled; otherwise Medium' },
  { name: 'CLR Enabled Without Strict Security', severity: 'High' },
  { name: 'Potentially Unsafe CLR Assemblies', severity: 'High (current database)' },
  { name: 'External Scripts Enabled', severity: 'Medium' },
  { name: 'Risky Extended Procedures Accessible', severity: 'High' },
  { name: 'xp_cmdshell Accessible to Non-Sysadmin', severity: 'Critical; High when a proxy account exists' },
  { name: 'xp_cmdshell Proxy Account Configured', severity: 'Medium' },
]

const objectPermissionFindings: Finding[] = [
  { name: 'Public Has Object/Schema Permissions', severity: 'Medium' },
  { name: 'Schema Control Granted', severity: 'High' },
  { name: 'High Object/Schema Permission Volume', severity: 'Low (1,000 or more permissions)' },
  { name: 'Explicit Database DENY Permissions Present', severity: 'Info' },
  { name: 'IMPERSONATE LOGIN Grants', severity: 'High' },
  { name: 'IMPERSONATE USER Grants (DB)', severity: 'Medium' },
  { name: 'Modules Using EXECUTE AS', severity: 'Low' },
  { name: 'Public EXECUTE on EXECUTE AS Modules', severity: 'High' },
]

const networkFindings: Finding[] = [
  { name: 'Extra Endpoints Enabled', severity: 'Medium' },
  { name: 'Public CONNECT on Endpoints', severity: 'High' },
  { name: 'Force Encryption Disabled', severity: 'Medium' },
  { name: 'Force Encryption Enabled Without Certificate Thumbprint', severity: 'Medium' },
  { name: 'NTLM Authentication Detected (Kerberos Fallback)', severity: 'Medium' },
  { name: 'No Kerberos Connections Observed', severity: 'Low' },
  { name: 'Unencrypted TCP Connections Detected', severity: 'Medium; High if Force Encryption is enabled' },
  { name: 'Linked Servers Present', severity: 'Low' },
  { name: 'Linked Servers with RPC OUT Enabled', severity: 'High' },
  { name: 'Linked Server Uses Fixed High-Value Credentials', severity: 'Critical' },
  { name: 'Linked Server Impersonation for All Logins', severity: 'High' },
]

const databaseFindings: Finding[] = [
  { name: 'Non-Standard Database Owners', severity: 'Medium' },
  { name: 'Custom Roles with Excessive Privileges', severity: 'High' },
  { name: 'Trustworthy Databases', severity: 'High' },
  { name: 'High-Risk PrivEsc Pattern (TRUSTWORTHY + CLR + db_owner)', severity: 'Critical (current database)' },
  { name: 'Cross-DB Chaining + TRUSTWORTHY Enabled', severity: 'High' },
  { name: 'Cross-Database Ownership Chaining', severity: 'Medium' },
  { name: 'Guest Access Enabled', severity: 'Medium (all databases with Extended Instance Scan, otherwise the current database only)' },
  { name: 'Public Role Has Extra Permissions', severity: 'With Extended Instance Scan: High if any CONTROL or ALTER, Medium if any EXECUTE, otherwise Low. Without it: Low, current database only' },
  { name: 'Contained Database Users Present', severity: 'Low' },
  { name: 'Database Scoped Credentials Present', severity: 'Low (current database)' },
]

const agentFindings: Finding[] = [
  { name: 'Agent Jobs Owned by Non-Sysadmin', severity: 'Low' },
  { name: 'Frequently Scheduled Agent Jobs', severity: 'Low' },
  { name: 'Non-Sysadmin Owned CmdExec/PowerShell Jobs', severity: 'High' },
  { name: 'Sysadmin-Owned CmdExec/PowerShell Jobs (RunAs SQL Agent Service Account)', severity: 'High' },
  { name: 'Sysadmin-Owned CmdExec/PowerShell Jobs (RunAs Proxy)', severity: 'Medium' },
  { name: 'Server Credentials Present', severity: 'Info' },
  { name: 'Stale Server Credentials', severity: 'Low (unchanged for 365 days or more)' },
  { name: 'Credentials Mapped to SQL Agent Proxies', severity: 'Medium' },
  { name: 'Proxy Credentials Used by CmdExec/PowerShell Jobs', severity: 'High' },
]

const auditingFindings: Finding[] = [
  { name: 'SQL Server Audit Not Enabled', severity: 'Medium' },
  { name: 'Server Audit Specifications Not Enabled', severity: 'Medium' },
  { name: 'Database Audit Specifications Not Enabled (Current DB)', severity: 'Low' },
  { name: 'Default Trace Disabled', severity: 'Info' },
  { name: 'SQL Server Audit Continues On Failure', severity: 'Medium' },
  { name: 'Login Auditing Disabled', severity: 'Medium' },
  { name: 'Login Auditing Not Comprehensive', severity: 'Low' },
  { name: 'No TDE-Encrypted User Databases Detected', severity: 'Low' },
  { name: 'Backups Not Encrypted (Last N Days)', severity: 'Medium (N is the Backup Encryption Window, default 90 days)' },
  { name: 'Always Encrypted Not Configured (Current DB)', severity: 'Info' },
]

const patchFindings: Finding[] = [
  { name: 'Missing Cumulative Update Level', severity: 'Medium (reported when the server reports no update level)' },
  { name: 'Patch Level Summary', severity: 'Info (otherwise)' },
]

const errorLogFindings: Finding[] = [
  { name: 'Critical SQL Server Error Log Events', severity: 'Critical' },
  { name: 'High Failed Login Volume in Error Log', severity: 'High with 100 or more failed-login events, Medium with 20 to 99; not reported below 20' },
  { name: 'Repeated Server Restart or Failover Signals', severity: 'Medium (2 or more startup events, or 2 or more availability/failover events)' },
]

const errorLogLimits = [
  'The audit reads the current error log for a 7-day window.',
  'Each query reads at most 200 rows per group (failed logins, other events) per log file. If that cap is reached, counts are shown as lower bounds ("at least N") and a scope note says so.',
  'If the current log starts inside the 7-day window, older archived logs are read, newest first, until one starts before the window. The archives share a budget of 64 MB; an archive larger than the remaining budget ends the walk. A scope note says what was and was not reviewed.',
  'If reading the current log exceeds the query timeout, the audit records a warning that names the log size. A longer Query Timeout in Settings gives the read more time, and cycling the error log (sp_cycle_errorlog) starts a new, smaller file.',
  'Connection and handshake noise (errors 17806, 17828, 17832, 17835, 17836, and 18056) is excluded. The details list at most 8 sample messages, each shortened to 220 characters.',
]

const loginRowParts = [
  'Each row shows the login name, "type · default database" (or "No default database") "· created <date>", one status badge (LOCKED, DISABLED, EXPIRED, or ACTIVE, in that order of precedence) and, when applicable, an "N failed" badge whose tooltip gives the failed password attempt count and the time of the last failed attempt.',
  'The search box ("Search logins...") filters the list; the counter reads "X of Y login(s)".',
  'The list shows at most 2,000 logins; above that it says "Showing first N of M logins (truncated for performance)."',
  'Built-in service accounts whose names start with NT AUTHORITY\\ or NT SERVICE\\ are not listed, on the screen or in the report.',
  'Empty states: "Login inventory unavailable" ("Run an audit to collect login data.") and "No matching logins" ("Try a different search term.").',
]

const accessMatrixControls = [
  'Search ("Search principals, roles, and permissions...")',
  'Sort by Principal, Database, Scope, Principal type, Login, Sysadmin, Authentication, Orphaned, or Mapping state, Ascending or Descending',
  'Page size 25, 50 (default), 100, or 200 per page, with Previous, "Page x of y", and Next',
  'Reload (tooltip "Re-read users, roles and permissions from the server") reads the matrix again; the status line then reads "Access matrix loaded · N record(s)"',
  'Export XLSX saves the full loaded inventory (see "Exporting the Access Matrix")',
]

const accessMatrixRows = [
  'The principal name',
  '"database or scope · type · authentication" (or "Unknown auth")',
  'A SYSADMIN badge or the scope badge, and a mapping badge: SERVER LOGIN, ORPHANED, CONTAINED, MAPPED, or NO SERVER LOGIN',
  '"Direct roles: ..." and "Explicit permissions: ..."',
  '"Partial database coverage: names (+N more)." when some databases could not be scanned; the Server scope is listed first, then databases and their principals',
]

const reportSummaryParts = [
  'Nine cards: Critical, High, Medium, Low, Info, Total Logins ("Unavailable" when logins could not be measured), Additional Sysadmins, Maturity Level ("L<n> / 5" or "Unavailable"), and Maturity Score ("<n> / 100" or "Unavailable (partial audit)").',
  'Server and instance facts: server, machine, instance, database, edition, engine edition, version, product level, update level and reference, collation, clustered and HADR flags, authentication mode, Force Encryption, connection authentication, port, driver, client encryption and certificate trust, maturity level, score and profile, and the collection time.',
  'The SQL Server patch status, a Surface Area table with ON/OFF values, and a Maturity Breakdown table (Category, Category Score, Penalty Impact, plus an Overall row). The breakdown notes that category scores are independent per-control-area scores and that the overall score comes from the total weighted penalty, not from their average.',
  'An Audit Health section: the audit status text, skipped checks, checks "Not measured (permissions)", audit scope notes, whether the report context is incomplete, and the auditing login’s capabilities (sysadmin, CONTROL SERVER, VIEW SERVER STATE, VIEW ANY DEFINITION, and how many password hashes were visible). It also notes that Extended Instance Scan expands cross-database checks only and does not fix permission or environment errors.',
]

const reportOtherTabs = [
  'Issues: every finding with risk, category, description, why it matters, attack scenario, verification query (when set), control ID, compliance and CIS references, evidence (10 items with "Show more (n more)"), and the recommendation.',
  'Cross-Mapping: a table of Issue, Control ID, CIS, ISO 27001 Annex A, and NIST 800-53.',
  'Logins: Login, Type, Status, Password Last Set, Bad PW, and Bad PW Time, with the same exclusions as the screen (NT AUTHORITY and NT SERVICE accounts are not listed).',
]

const xlsxParts = [
  'Default file name db_user_permissions_<server>_YYYYMMDD_HHMM.xlsx; the app confirms with "Inventory saved" and "Access inventory saved to <file>".',
  'One sheet, "User Permissions", with a header block (Server, IP Address, Machine, Instance, Edition, Version, Generated, Collected, Total Records) and the columns Scope, Database, Principal, Type, Login, Sysadmin, Auth, Orphaned, Roles, and Permissions.',
  'The export contains the full loaded inventory, not only the current page or the filtered rows.',
  'Without a loaded matrix the app answers "Load the access inventory before exporting." (toast "Export unavailable").',
]

const troubleshooting = [
  { symptom: '"Please connect to a database first."', fix: 'Connect to an instance before opening the module.' },
  {
    symptom: '"Another security operation is already in progress..."',
    fix: 'The audit and the access matrix load do not run at the same time. Wait for the first to finish. A second Run Audit while one is running joins the running audit.',
  },
  {
    symptom: 'The score shows "—" and "Score unavailable · audit is incomplete".',
    fix: 'At least one check failed at run time. The scope notice names the skipped checks; they usually fail because of missing SQL permissions, msdb or SQL Agent access, or edition limits. Extended Instance Scan does not bypass permission or environment errors.',
  },
  {
    symptom: 'A check is listed as not measurable.',
    fix: 'Checks that could not be measured with the auditing login’s permissions are excluded from the score. Run the audit with a more privileged login to include them.',
  },
  {
    symptom: 'Error log findings are missing.',
    fix: 'The login cannot read the error log, or the read timed out. Check the scope notes, raise Query Timeout, or cycle the log; the audit’s own warning suggests both.',
  },
  {
    symptom: 'Empty-password and weak-password checks are missing.',
    fix: 'The login cannot see password hashes for all SQL logins. Use a sysadmin login.',
  },
  {
    symptom: '"The security audit is still running. Try again in a moment." / "The security audit did not return a result. Run it again."',
    fix: 'The result is not ready yet, or the run ended without a result; run the audit again.',
  },
  {
    symptom: 'Links in the patch card do not open.',
    fix: 'The app opens web links in your default browser only: "Only web links can be opened." or "No browser is available to open the link."',
  },
  {
    symptom: 'Save fails.',
    fix: '"Native window is unavailable.", "The security report could not be saved. Check the selected location and try again." (report), or "The access inventory could not be saved. Check the selected location and try again." (export).',
  },
  {
    symptom: '"Server details are incomplete: ..." / "Report context is incomplete: ..."',
    fix: 'Core audit results are still available. Only the report context (server facts, patch catalog) is partial.',
  },
  {
    symptom: '"Patch catalog could not be refreshed from Microsoft Learn; ..."',
    fix: 'The outbound HTTPS request failed. The card uses a cached or built-in catalog and says so in its Source line.',
  },
]

function Panel({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-gray-100 bg-gray-50 p-4 ${className}`}>
      <div className="font-semibold mb-1">{title}</div>
      {children}
    </div>
  )
}

function FindingList({ title, note, findings }: { title: string; note?: string; findings: Finding[] }) {
  return (
    <Panel title={title}>
      <ul className="space-y-1">
        {findings.map((finding) => (
          <li key={finding.name} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
            <span className="font-medium text-gray-900 sm:w-1/2 sm:shrink-0">{finding.name}</span>
            <span className="text-gray-600">{finding.severity}</span>
          </li>
        ))}
      </ul>
      {note ? <p className="mt-3 text-gray-600">{note}</p> : null}
    </Panel>
  )
}

export default function SecurityAuditTemplate() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Overview</div>
        <p className="text-sm text-gray-700">
          Security Audit, shown as <strong>Security</strong> in the sidebar (&quot;Permissions and audit signals&quot;),
          opens the <strong>SQL Server Security Audit</strong> workbench. One click on Run Audit runs a fixed set of
          security checks against the connected instance, lists the findings with a severity, evidence, a recommendation,
          and a verification query, and computes a maturity score from 0 to 100. The module also shows a login
          inventory and an access matrix of database users, direct roles, and explicit permissions, and can save the
          audit as an HTML report.
        </p>
        <p className="mt-3 text-sm text-gray-700">
          The audit is rule-based T-SQL plus scoring inside the application; no AI provider is involved. Findings carry
          CIS, ISO 27001 Annex A, and NIST 800-53 references for your own mapping work. The module is not a
          certification and does not replace a formal assessment. Agent job findings pair well with{' '}
          <Link href="/docs/modules/scheduled-jobs" className="font-semibold text-primary hover:text-primary-dark">
            Scheduled Jobs
          </Link>
          , and the two thresholds the audit uses are set in{' '}
          <Link href="/docs/settings" className="font-semibold text-primary hover:text-primary-dark">
            Settings
          </Link>
          .
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm text-gray-700">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What You Can Do</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Run a security audit of the connected instance and review findings by severity and category.</li>
              <li>Read the maturity score, the level, and the readiness of each category group.</li>
              <li>Check the SQL Server patch status against the Microsoft update catalog.</li>
              <li>Browse the login inventory and the access matrix (database users, direct roles, explicit permissions).</li>
              <li>Copy a finding or its verification query to the clipboard.</li>
              <li>Save the audit as an HTML report and export the access matrix to an Excel (.xlsx) file.</li>
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
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Permissions and What the Audit Can Measure
        </div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <Panel title="Capability Measurement">
            <p className="mb-2">
              Before the checks run, the audit measures the connected login: sysadmin membership, CONTROL SERVER, VIEW
              SERVER STATE, VIEW ANY DEFINITION, and how many SQL logins have a visible password hash. The result
              shapes the checks:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              {capabilityChecks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Panel>
          <Panel title="Skipped Versus Not Measurable">
            <p className="mb-2">The two situations are treated differently:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                A <strong>skipped check</strong> is a check whose query failed at run time. Any skipped check marks the
                audit as incomplete, and the maturity score is then not shown (&quot;Score unavailable · audit is
                incomplete&quot;).
              </li>
              <li>
                A <strong>check that could not be measured with the auditing login&apos;s permissions</strong> is
                excluded from the score and listed separately. The score is still shown, and it does not cover those
                checks.
              </li>
            </ul>
            <p className="mt-2">
              Checks that could not be measured are named one by one under the score: &quot;N check(s) could not be
              measured with the auditing login&apos;s permissions; the maturity score does not cover them:&quot;
              followed by &quot;• name: reason&quot;.
            </p>
          </Panel>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Running an Audit</div>
        <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
          <li>Connect to a SQL Server instance and open Security in the left navigation.</li>
          <li>
            The module does not start an audit on its own. If a result for the current connection is already cached it
            is shown; if an audit is already running you join it.
          </li>
          <li>Optional: select Extended Instance Scan.</li>
          <li>
            Select Run Audit. The status line and the progress bar show the current step; the security checks run in
            10 groups.
          </li>
          <li>When the audit ends, the status line reads &quot;Audit completed&quot; or one of its variants.</li>
        </ol>
        <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm text-gray-700">
          <Panel title="Progress Steps">
            <ul className="list-disc pl-5 space-y-1">
              {progressSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </Panel>
          <Panel title="The 10 Check Groups">
            <ol className="list-decimal pl-5 space-y-1">
              {checkGroups.map((group) => (
                <li key={group}>{group}</li>
              ))}
            </ol>
          </Panel>
          <Panel title="Status After the Audit">
            <ul className="list-disc pl-5 space-y-1">
              {completionStatuses.map((status) => (
                <li key={status}>{status}</li>
              ))}
            </ul>
            <p className="mt-3 font-semibold">If the audit fails, you see one of:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              {failureMessages.map((message) => (
                <li key={message}>&quot;{message}&quot;</li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Security Context: Overview Tab</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <Panel title="Score Card">
            <p>
              The caption reads STANDARD MATURITY PROFILE. Below it are the score (or &quot;—&quot;) and a line
              &quot;Level N · label&quot;, or &quot;Score unavailable · audit is incomplete&quot;. The score color
              follows the value: 89 and above green, 73 and above blue, 56 and above yellow, 31 and above orange,
              otherwise red. A strip of buttons CRITICAL n, HIGH n, MEDIUM n, LOW n, and INFO n filters the findings
              list by severity.
            </p>
          </Panel>
          <Panel title="Scope Notices">
            <p className="mb-2">When the audit was incomplete or limited, lines under the score explain why:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>&quot;Audit completed with N skipped check(s): ...&quot; followed by a hint about the usual causes</li>
              <li>Scope notes, for example about hidden catalog rows or Extended Instance Scan being off</li>
              <li>The list of checks that could not be measured with the auditing login&apos;s permissions</li>
              <li>Warnings, for example about the error log read or the patch catalog refresh</li>
            </ul>
          </Panel>
          <Panel title="SQL Server Patch Status">
            <p className="mb-2">
              The heading reads &quot;SQL Server Patch Status · Up to date&quot;, &quot;· Up to date, catalog not
              refreshed&quot;, &quot;· Update available&quot;, or &quot;· Unknown&quot;. The card lists:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              {patchFacts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
            <p className="mt-2">Source reads one of:</p>
            <ul className="list-disc pl-5 space-y-1">
              {patchSources.map((source) => (
                <li key={source}>&quot;{source}&quot;</li>
              ))}
            </ul>
            <p className="mt-2">
              Link buttons (&quot;Microsoft SQL Server update history&quot; and the KB articles) open in your default
              browser; a failure shows an &quot;Open link&quot; dialog.
            </p>
          </Panel>
          <Panel title="Category Readiness and Identity Surface">
            <p className="mb-2">
              Category Readiness shows one bar per category group (see Scoring). If the score is unavailable, the bars
              are replaced by &quot;Category scores are hidden because one or more checks did not complete.&quot;; with
              no scores at all it reads &quot;No category scores available.&quot;
            </p>
            <p className="mb-2">Identity Surface shows count tiles; a tile reads &quot;Unknown&quot; when it could not be measured:</p>
            <ul className="list-disc pl-5 space-y-1">
              {identityTiles.map((tile) => (
                <li key={tile}>{tile}</li>
              ))}
            </ul>
          </Panel>
          <Panel title="Access Matrix Context" className="md:col-span-2">
            <p>
              While the Access Matrix tab is active, the Overview adds an Access Matrix Context card with the server
              name, &quot;Endpoint ip:port&quot;, Machine, Instance, edition and version, the line &quot;N principal
              access record(s) · M database(s) scanned · Collected &lt;time&gt;.&quot;, and the note &quot;Roles and
              permissions shown here are direct/explicit assignments; they are not an effective-permission
              calculation.&quot;
            </p>
          </Panel>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Scoring</div>
        <p className="text-sm text-gray-700 mb-4">
          The score is calculated from the findings&apos; severities, not from the category scores. For each severity
          with at least one finding, the penalty is <span className="font-mono">weight × (1 + ln(count))</span>. The
          score is 100 minus the whole-number part of the total penalty, kept between 0 and 100, and the level follows
          the score. Caps are applied afterwards.
        </p>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <Panel title="Severity Weights">
            <ul className="space-y-1">
              {severityWeights.map((row) => (
                <li key={row.severity} className="flex gap-3">
                  <span className="w-24 shrink-0 font-medium text-gray-900">{row.severity}</span>
                  <span>{row.weight}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Score to Level">
            <ul className="space-y-1">
              {maturityLevels.map((row) => (
                <li key={row.level} className="flex gap-3">
                  <span className="w-24 shrink-0 font-medium text-gray-900">{row.score}</span>
                  <span>
                    {row.level} · {row.label}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Caps">
            <ul className="list-disc pl-5 space-y-1">
              {scoreCaps.map((cap) => (
                <li key={cap}>{cap}</li>
              ))}
            </ul>
          </Panel>
          <Panel title="Category Groups and Category Scores">
            <p className="mb-2">
              Each group scores 100 with no findings, 96 with only informational findings (the report shows
              &quot;Informational only&quot;), and otherwise 100 minus the penalty of that group&apos;s findings.
            </p>
            <ul className="space-y-1">
              {categoryGroups.map((row) => (
                <li key={row.group} className="flex flex-col sm:flex-row sm:gap-3">
                  <span className="font-medium text-gray-900 sm:w-40 sm:shrink-0">{row.group}</span>
                  <span className="text-gray-600">{row.categories}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Findings Tab and Finding Detail</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <Panel title="Findings List">
            <p className="mb-2">
              Each row shows a risk badge, the finding title, &quot;category · control ID&quot; (or &quot;Unmapped
              control&quot;), and a short description. The counter reads &quot;X of Y finding(s)&quot;. Filters:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Search (&quot;Search findings and evidence...&quot;) matches the title, description, category,
                recommendation, control ID, compliance references, why it matters, attack scenario, and evidence
              </li>
              <li>Risk select: All Risks, Critical, High, Medium, Low, Info, each with its count</li>
              <li>Category select (&quot;All Categories (n)&quot;)</li>
              <li>The CRITICAL to INFO buttons on the score card set the same risk filter</li>
            </ul>
            <p className="mt-2 font-semibold">Empty states</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              {findingEmptyStates.map((state) => (
                <li key={state}>{state}</li>
              ))}
            </ul>
          </Panel>
          <Panel title="Finding Detail">
            <p className="mb-2">Select a row to enable the Finding Detail tab. It contains:</p>
            <ul className="list-disc pl-5 space-y-1">
              {findingDetailParts.map((part) => (
                <li key={part}>{part}</li>
              ))}
            </ul>
            <p className="mt-2">
              Every finding is mapped to a control ID, a compliance reference (default &quot;PCI-DSS; ISO 27001; SOC2;
              HIPAA&quot;), a CIS reference chosen by the SQL Server major version, an ISO 27001 Annex A reference, and
              a NIST 800-53 reference from the control catalog shipped with the app. If the catalog cannot be read, a
              scope note says so and findings show &quot;Unmapped control&quot;.
            </p>
          </Panel>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What the Audit Checks</div>
        <p className="text-sm text-gray-700 mb-4">
          The severity is the one the audit assigns; where it depends on a condition, the condition is given. Checks
          marked &quot;current database&quot; look only at the database of your connection.
        </p>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <FindingList
            title="Authentication and Server Permissions"
            findings={authenticationFindings}
            note="The inactive login check uses the login's modify date, not a true last-login date, and skips logins with active sessions. With Extended Instance Scan it also lists remove candidates (inactive 365 days or more with no database user mapping), logins for manual review (inactive 180 days or more and mapped to two or more databases), and logins never modified since creation. Without it, the details state that the cross-database dependency mapping was not included."
          />
          <div className="space-y-3">
            <FindingList title="Surface Area and Execution" findings={surfaceAreaFindings} />
            <FindingList title="Object Permissions and Impersonation (Current Database)" findings={objectPermissionFindings} />
          </div>
          <FindingList title="Network and Linked Servers" findings={networkFindings} />
          <FindingList title="Database Authorization and Configuration" findings={databaseFindings} />
          <FindingList
            title="SQL Agent and Credentials"
            findings={agentFindings}
            note="Frequently Scheduled Agent Jobs counts enabled schedules that repeat every 1 to 300 seconds, every 1 to 5 minutes, or hourly when the job runs as the SQL Agent service account."
          />
          <div className="space-y-3">
            <FindingList
              title="Auditing and Encryption"
              findings={auditingFindings}
              note="If the login auditing level cannot be read, the audit records that the login auditing checks were skipped."
            />
            <FindingList title="Patch Level" findings={patchFindings} />
          </div>
          <FindingList
            title="Error Log Events (Category Server Critical Events)"
            findings={errorLogFindings}
            note="Critical SQL Server Error Log Events groups events into I/O or corruption signals (errors 823, 824, and 825, I/O errors, torn pages, checksum errors), scheduler or worker stalls (non-yielding scheduler, errors 17883, 17884, 17887, 17888, and 17890), dumps or engine exceptions (stack dump, assertion, access violation, exception), and high-severity errors (severity 17 to 25)."
          />
          <Panel title="Error Log Findings: Read Limits">
            <ul className="list-disc pl-5 space-y-1">
              {errorLogLimits.map((limit) => (
                <li key={limit}>{limit}</li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Logins Tab</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <Panel title="Login Inventory">
            <p className="mb-2">Lists the server logins collected by the audit.</p>
            <ul className="list-disc pl-5 space-y-1">
              {loginRowParts.map((part) => (
                <li key={part}>{part}</li>
              ))}
            </ul>
          </Panel>
          <Panel title="Additional Sysadmins Is Not a Full Sysadmin List">
            <p>
              The Identity Surface tile and the report card count only <em>additional</em> sysadmin members. The audit
              does not count the sa login (identified by its SID, so a renamed sa is excluded too), NT AUTHORITY\SYSTEM,
              NT SERVICE\MSSQLSERVER, NT SERVICE\SQLServerAgent, NT SERVICE\SQLWriter, NT SERVICE\Winmgmt, or the
              instance-named service accounts NT SERVICE\MSSQL$*, NT SERVICE\SQLAgent$*, and NT SERVICE\ReportServer$*.
              To list every sysadmin, query the sysadmin role directly.
            </p>
          </Panel>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Access Matrix Tab</div>
        <p className="text-sm text-gray-700 mb-4">
          The access matrix lists database users and server-level principals with their direct roles and explicit
          permissions. It is read from the server when you open the tab, independently of Run Audit. A new audit
          discards the cached matrix and switches the left panel back to Findings; the matrix is read again the next
          time you open the Access Matrix tab, or when you select Reload. While it loads, the panel reads &quot;Loading
          access matrix&quot; / &quot;Reading database users, roles, and explicit permissions.&quot;; the counter reads
          &quot;N matching · M total&quot;.
        </p>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <Panel title="Controls">
            <ul className="list-disc pl-5 space-y-1">
              {accessMatrixControls.map((control) => (
                <li key={control}>{control}</li>
              ))}
            </ul>
          </Panel>
          <Panel title="Rows">
            <ul className="list-disc pl-5 space-y-1">
              {accessMatrixRows.map((row) => (
                <li key={row}>{row}</li>
              ))}
            </ul>
            <p className="mt-2">
              Roles and permissions are direct and explicit assignments, not an effective-permission calculation. If
              databases could not be scanned, a message reads &quot;N database(s) could not be scanned: names (+N
              more).&quot;; if the load fails: &quot;The access matrix could not be loaded. Check the database
              connection and your SQL permissions, then try again.&quot;
            </p>
          </Panel>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Saving the HTML Report</div>
        <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
          <li>Run an audit; otherwise the app answers &quot;Run a security audit first.&quot;</li>
          <li>
            Select Save HTML and choose a location. The default name is{' '}
            <span className="font-mono">security_audit_YYYYMMDD_HHMMSS.html</span>.
          </li>
          <li>The app confirms with &quot;Report saved&quot; and &quot;Security audit report saved to &lt;file&gt;&quot;.</li>
        </ol>
        <p className="mt-3 text-sm text-gray-700">
          The report is titled &quot;Security Audit Report&quot;, shows &quot;Generated: &lt;time&gt;&quot;, and has
          four tabs: Summary, Issues, Cross-Mapping, and Logins. It is one HTML file you can open in a browser and
          hand over as is.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <Panel title="Summary Tab">
            <ul className="list-disc pl-5 space-y-1">
              {reportSummaryParts.map((part) => (
                <li key={part}>{part}</li>
              ))}
            </ul>
          </Panel>
          <Panel title="Issues, Cross-Mapping, and Logins Tabs">
            <ul className="list-disc pl-5 space-y-1">
              {reportOtherTabs.map((part) => (
                <li key={part}>{part}</li>
              ))}
            </ul>
            <p className="mt-2">
              When no findings exist the Issues tab reads &quot;No security issues found.&quot; (with a partial-audit
              variant). If the report context was only partly collected, the audit status is partial and the report
              says &quot;Report context is incomplete&quot;.
            </p>
          </Panel>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Exporting the Access Matrix</div>
        <p className="text-sm text-gray-700 mb-3">
          Load the Access Matrix, then select Export XLSX and choose a location.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          {xlsxParts.map((part) => (
            <li key={part}>{part}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Settings That Affect the Audit</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <Panel title="Security Audit Panel (Settings &gt; General)">
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Inactive Login Threshold</strong>: 30 to 3650 days, default 90. Days of inactivity after which a
                login is reported by the Inactive Logins check.
              </li>
              <li>
                <strong>Backup Encryption Window</strong>: 30 to 365 days, default 90. Look-back period for the Backups
                Not Encrypted check; the value appears in the finding title.
              </li>
            </ul>
          </Panel>
          <Panel title="Query Timeout">
            <p>
              The Query Timeout (seconds) setting applies to audit queries as well. It matters most for the error log
              read on servers with a large current log; see the read limits above. Settings are described in{' '}
              <Link href="/docs/settings" className="font-semibold text-primary hover:text-primary-dark">
                Settings
              </Link>
              .
            </p>
          </Panel>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Typical Workflows</div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-700">
          <Panel title="Get a First Security Baseline">
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                Connect with a login that has sysadmin (or at least VIEW ANY DEFINITION and VIEW SERVER STATE) and
                open Security.
              </li>
              <li>Select Run Audit and wait until the status line reads &quot;Audit completed&quot;.</li>
              <li>
                On the Overview tab, read the score and the lines under it. If you see &quot;Score unavailable · audit
                is incomplete&quot;, read the skipped checks, fix the cause (permissions, msdb access), and run the
                audit again.
              </li>
              <li>Select CRITICAL and HIGH in the risk strip and work through the findings with their recommendations.</li>
            </ol>
          </Panel>
          <Panel title="Verify a Single Finding Yourself">
            <ol className="list-decimal pl-5 space-y-1">
              <li>On the Findings tab, select the finding.</li>
              <li>In Finding Detail, read Evidence and Recommendation.</li>
              <li>Select Copy Query and run the verification query in your SQL client.</li>
            </ol>
          </Panel>
          <Panel title="Review Who Has Access to Which Database">
            <ol className="list-decimal pl-5 space-y-1">
              <li>Open the Access Matrix tab.</li>
              <li>Search for a principal, role, or permission, or sort by Orphaned or Sysadmin.</li>
              <li>Select Reload after you change permissions on the server.</li>
              <li>Select Export XLSX to hand the inventory to an auditor.</li>
            </ol>
          </Panel>
          <Panel title="Create an Audit Report">
            <ol className="list-decimal pl-5 space-y-1">
              <li>Run an audit.</li>
              <li>Select Save HTML and send the file. It opens in any browser.</li>
            </ol>
          </Panel>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Tips and Troubleshooting</div>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
          {troubleshooting.map((item) => (
            <li key={item.symptom}>
              <strong>{item.symptom}</strong> {item.fix}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
