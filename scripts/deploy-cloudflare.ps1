[CmdletBinding()]
param(
  [string]$ProjectRoot,
  [switch]$SkipLint,
  [switch]$SkipPreviewReminder,
  [switch]$SkipSmokeCheck,
  [switch]$KillLocalNodeProcesses,
  [string]$ExpectedWorkerName = "dbperfstudio-website",
  [string]$ExpectedApexDomain = "sqlperformance.ai",
  [string]$ExpectedRoute = "www.sqlperformance.ai/*"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptDirectory = Split-Path -Parent $PSCommandPath
if ([string]::IsNullOrWhiteSpace($ProjectRoot)) {
  $ProjectRoot = Join-Path $scriptDirectory ".."
}

$resolvedProjectRoot = (Resolve-Path -Path $ProjectRoot).Path

function Assert-CommandExists {
  param([Parameter(Mandatory = $true)][string]$Name)

  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required command '$Name' was not found in PATH."
  }
}

function Invoke-ExternalCommand {
  param(
    [Parameter(Mandatory = $true)][string]$FilePath,
    [Parameter(Mandatory = $true)][string[]]$Arguments,
    [Parameter(Mandatory = $true)][string]$WorkingDirectory
  )

  Write-Host ">> $FilePath $($Arguments -join ' ')" -ForegroundColor Cyan
  Push-Location $WorkingDirectory
  try {
    & $FilePath @Arguments
    if ($LASTEXITCODE -ne 0) {
      throw "Command failed with exit code ${LASTEXITCODE}: $FilePath $($Arguments -join ' ')"
    }
  }
  finally {
    Pop-Location
  }
}

function Read-JsonFile {
  param([Parameter(Mandatory = $true)][string]$Path)

  return Get-Content -LiteralPath $Path -Raw | ConvertFrom-Json
}

function Stop-FrontendNodeProcesses {
  param([Parameter(Mandatory = $true)][string]$WorkingDirectory)

  $processes = Get-CimInstance Win32_Process |
    Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -like "*$WorkingDirectory*" }

  if (-not $processes) {
    Write-Host "No local Node processes matched the frontend working directory." -ForegroundColor DarkYellow
    return
  }

  $pids = @($processes | Select-Object -ExpandProperty ProcessId)
  Write-Host "Stopping local Node processes: $($pids -join ', ')" -ForegroundColor Yellow
  Stop-Process -Id $pids -Force
}

function Remove-OpenNextDirectoryIfPresent {
  param([Parameter(Mandatory = $true)][string]$WorkingDirectory)

  $openNextPath = Join-Path $WorkingDirectory ".open-next"
  if (Test-Path -LiteralPath $openNextPath) {
    Write-Host "Removing stale .open-next build output..." -ForegroundColor Yellow
    Remove-Item -LiteralPath $openNextPath -Recurse -Force
  }
}

function Invoke-SmokeCheck {
  param([Parameter(Mandatory = $true)][string[]]$Urls)

  Add-Type -AssemblyName System.Net.Http
  $client = [System.Net.Http.HttpClient]::new()

  try {
    foreach ($url in $Urls) {
      Write-Host "Checking $url" -ForegroundColor Cyan
      $response = $client.GetAsync($url).GetAwaiter().GetResult()
      if (-not $response.IsSuccessStatusCode) {
        throw "Smoke check failed for $url with HTTP status $([int]$response.StatusCode)."
      }
    }
  }
  finally {
    $client.Dispose()
  }
}

function Assert-CanonicalRedirect {
  param(
    [Parameter(Mandatory = $true)][string]$FromUrl,
    [Parameter(Mandatory = $true)][string]$ExpectedLocation
  )

  Add-Type -AssemblyName System.Net.Http
  $handler = [System.Net.Http.HttpClientHandler]::new()
  $handler.AllowAutoRedirect = $false
  $client = [System.Net.Http.HttpClient]::new($handler)

  try {
    Write-Host "Checking canonical redirect $FromUrl" -ForegroundColor Cyan
    $response = $client.GetAsync($FromUrl).GetAwaiter().GetResult()
    $status = [int]$response.StatusCode
    if ($status -ne 301) {
      throw "Canonical redirect broken: $FromUrl returned HTTP $status, expected 301. SEO icin www -> apex 301 zorunlu."
    }

    $location = $response.Headers.Location
    if ($null -eq $location -or $location.AbsoluteUri.TrimEnd('/') -ne $ExpectedLocation.TrimEnd('/')) {
      throw "Canonical redirect target wrong: $FromUrl -> '$location', expected '$ExpectedLocation'."
    }
  }
  finally {
    $client.Dispose()
    $handler.Dispose()
  }
}

Assert-CommandExists -Name "npm"
Assert-CommandExists -Name "npx"

$wranglerConfigPath = Join-Path $resolvedProjectRoot "wrangler.jsonc"
$packageJsonPath = Join-Path $resolvedProjectRoot "package.json"

if (-not (Test-Path -LiteralPath $wranglerConfigPath)) {
  throw "wrangler.jsonc not found: $wranglerConfigPath"
}
if (-not (Test-Path -LiteralPath $packageJsonPath)) {
  throw "package.json not found: $packageJsonPath"
}

$wranglerConfig = Read-JsonFile -Path $wranglerConfigPath
$packageJson = Read-JsonFile -Path $packageJsonPath

if ($wranglerConfig.name -ne $ExpectedWorkerName) {
  throw "Unexpected Worker name '$($wranglerConfig.name)'. Expected '$ExpectedWorkerName'."
}

$serviceReference = $wranglerConfig.services | Where-Object { $_.binding -eq 'WORKER_SELF_REFERENCE' } | Select-Object -First 1
if (-not $serviceReference) {
  throw "WORKER_SELF_REFERENCE service binding is missing from wrangler.jsonc."
}
if ($serviceReference.service -ne $ExpectedWorkerName) {
  throw "Unexpected self-reference Worker '$($serviceReference.service)'. Expected '$ExpectedWorkerName'."
}

function Test-IsCustomDomainEntry {
  param([Parameter(Mandatory = $true)]$Entry)

  $property = $Entry.PSObject.Properties['custom_domain']
  return ($null -ne $property -and $property.Value -eq $true)
}

# Apex, Worker'a Custom Domain olarak bagli (zone route degil). Config'de custom_domain
# olarak yazilmazsa `wrangler deploy` apex'i tetikleyicilerden dusurebilir ve site kirilir.
$apexEntry = $wranglerConfig.routes |
  Where-Object { $_.pattern -eq $ExpectedApexDomain -and (Test-IsCustomDomainEntry -Entry $_) } |
  Select-Object -First 1
if (-not $apexEntry) {
  throw "Expected custom domain '$ExpectedApexDomain' (custom_domain: true) was not found in wrangler.jsonc."
}

$route = $wranglerConfig.routes | Where-Object { $_.pattern -eq $ExpectedRoute } | Select-Object -First 1
if (-not $route) {
  throw "Expected route '$ExpectedRoute' was not found in wrangler.jsonc."
}

$buildScript = $packageJson.scripts.build
if ($buildScript -ne "next build") {
  throw "Unexpected build script '$buildScript'. Expected 'next build'."
}

Write-Host "ProjectRoot : $resolvedProjectRoot" -ForegroundColor Yellow
Write-Host "Worker      : $ExpectedWorkerName" -ForegroundColor Yellow
Write-Host "Apex domain : $ExpectedApexDomain (custom domain)" -ForegroundColor Yellow
Write-Host "Route       : $ExpectedRoute" -ForegroundColor Yellow
Write-Host "Build       : $buildScript" -ForegroundColor Yellow

if ($KillLocalNodeProcesses) {
  Stop-FrontendNodeProcesses -WorkingDirectory $resolvedProjectRoot
  Remove-OpenNextDirectoryIfPresent -WorkingDirectory $resolvedProjectRoot
}

if (-not $SkipLint) {
  Invoke-ExternalCommand -FilePath "npm" -Arguments @("run", "lint") -WorkingDirectory $resolvedProjectRoot
}
else {
  Write-Host "Skipping lint check." -ForegroundColor DarkYellow
}

if (-not $SkipPreviewReminder) {
  Write-Host ""
  Write-Host "Reminder: run 'npm run preview' for local validation before production deploy when the change is significant." -ForegroundColor DarkYellow
}

Invoke-ExternalCommand -FilePath "npm" -Arguments @("run", "deploy") -WorkingDirectory $resolvedProjectRoot
Invoke-ExternalCommand -FilePath "npx" -Arguments @("wrangler", "deployments", "status", "--name", $ExpectedWorkerName) -WorkingDirectory $resolvedProjectRoot

if (-not $SkipSmokeCheck) {
  # Kanonik host apex; www yalnizca 301 kaynagi oldugu icin smoke testi apex uzerinden yapilir.
  Invoke-SmokeCheck -Urls @(
    "https://$ExpectedApexDomain/",
    "https://$ExpectedApexDomain/docs",
    "https://$ExpectedApexDomain/docs/installation",
    "https://$ExpectedApexDomain/docs/quickstart"
  )

  Assert-CanonicalRedirect -FromUrl "https://www.$ExpectedApexDomain/" -ExpectedLocation "https://$ExpectedApexDomain/"
}
else {
  Write-Host "Skipping production smoke check." -ForegroundColor DarkYellow
}

Write-Host ""
Write-Host "Cloudflare deploy completed successfully." -ForegroundColor Green
