# CyberShield EDR - One-Click Windows Installer
# Run as Administrator: irm https://raw.githubusercontent.com/Detox10/cybershield/main/install.ps1 | iex

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host " ██████╗██╗   ██╗██████╗ ███████╗██████╗ ███████╗██╗  ██╗██╗███████╗██╗     ██████╗ " -ForegroundColor Cyan
Write-Host "██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔════╝██║  ██║██║██╔════╝██║     ██╔══██╗" -ForegroundColor Cyan
Write-Host "██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝███████╗███████║██║█████╗  ██║     ██║  ██║" -ForegroundColor Cyan
Write-Host "╚██████╗   ██║   ██████╔╝███████╗██║  ██║███████║██║  ██║██║███████╗███████╗██████╔╝" -ForegroundColor Cyan
Write-Host " ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "  CyberShield EDR - Endpoint Agent Installer" -ForegroundColor Yellow
Write-Host "  by Himanshu Bawane (github.com/Detox10)" -ForegroundColor DarkGray
Write-Host ""

# Check for Admin
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "[ERROR] Please run this script as Administrator!" -ForegroundColor Red
    Write-Host "  Right-click PowerShell -> Run as Administrator" -ForegroundColor Yellow
    exit 1
}

# Config
$installDir = "$env:ProgramFiles\CyberShield"
$agentUrl   = "https://github.com/Detox10/cybershield/releases/latest/download/cybershield-agent.exe"
$agentExe   = "$installDir\cybershield-agent.exe"

Write-Host "[1/4] Creating install directory..." -ForegroundColor Green
New-Item -ItemType Directory -Force -Path $installDir | Out-Null
Write-Host "      $installDir" -ForegroundColor DarkGray

Write-Host "[2/4] Downloading CyberShield Agent..." -ForegroundColor Green
try {
    Invoke-WebRequest -Uri $agentUrl -OutFile $agentExe -UseBasicParsing
    Write-Host "      Downloaded successfully!" -ForegroundColor DarkGray
} catch {
    Write-Host "[ERROR] Download failed. Check your internet connection." -ForegroundColor Red
    Write-Host "        You can manually download from:" -ForegroundColor Yellow
    Write-Host "        https://github.com/Detox10/cybershield/releases" -ForegroundColor Cyan
    exit 1
}

Write-Host "[3/4] Installing as a Windows Startup Task..." -ForegroundColor Green
# Register as a Scheduled Task so it auto-starts on boot
$action  = New-ScheduledTaskAction  -Execute $agentExe
$trigger = New-ScheduledTaskTrigger -AtStartup
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit 0 -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1)

Register-ScheduledTask -TaskName "CyberShieldAgent" `
    -Action $action `
    -Trigger $trigger `
    -Principal $principal `
    -Settings $settings `
    -Force | Out-Null

Write-Host "      Registered as 'CyberShieldAgent' startup task!" -ForegroundColor DarkGray

Write-Host "[4/4] Starting CyberShield Agent now..." -ForegroundColor Green
Start-ScheduledTask -TaskName "CyberShieldAgent"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  CyberShield Agent Installed Successfully!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Your system telemetry is now streaming to:" -ForegroundColor White
Write-Host "  https://cybershield.vercel.app" -ForegroundColor Cyan
Write-Host ""
Write-Host "  The agent starts automatically on every reboot." -ForegroundColor DarkGray
Write-Host "  To uninstall: Unregister-ScheduledTask -TaskName CyberShieldAgent -Confirm:`$false" -ForegroundColor DarkGray
Write-Host ""
