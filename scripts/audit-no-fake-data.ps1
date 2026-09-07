$srcPath = ".\src"
$searchPatterns = @(
    "Math\.random",
    "mock",
    "fake",
    "dummy",
    "test data",
    "simulated",
    "placeholder"
)

$stats = @{
    "Fake telemetry sources found" = 0
    "Random security metrics" = 0
    "Mock AI responses" = 0
    "Hardcoded threat statistics" = 0
}

Write-Host "Running Fake Data Audit on $srcPath..." -ForegroundColor Cyan

# We'll just do a basic text scan and count occurrences for a high-level report.
$files = Get-ChildItem -Path ".\src\app\api", ".\src\lib" -Recurse -Include *.ts,*.tsx -File

foreach ($file in $files) {
    $content = Get-Content $file.FullName
    foreach ($line in $content) {
        if ($line -match "Math\.random" -and $file.Name -notmatch "DigitResolver|ActionConfirmModal|ProgressiveSpikeGraph|TerminalFlow|ZeroTrustRulesFlow") {
            $stats["Random security metrics"]++
        }
        if ($line -match "(?i)mockReport|mock\b|fake\b|dummy\b") {
            $stats["Mock AI responses"]++
        }
        if ($line -match "(?i)simulated|test data") {
            $stats["Fake telemetry sources found"]++
        }
        if ($line -match "(?i)placeholder" -and $line -notmatch "placeholder=`"|placeholder='") {
            $stats["Hardcoded threat statistics"]++
        }
    }
}

Write-Host ""
Write-Host "=== AUDIT RESULTS ===" -ForegroundColor Yellow
$stats.GetEnumerator() | Sort-Object Name | ForEach-Object {
    $color = if ($_.Value -gt 0) { "Red" } else { "Green" }
    Write-Host "$($_.Name): $($_.Value)" -ForegroundColor $color
}

if (($stats.Values | Measure-Object -Sum).Sum -gt 0) {
    Write-Host ""
    Write-Host "WARNING: Fake data or placeholders were found!" -ForegroundColor Red
} else {
    Write-Host ""
    Write-Host "SUCCESS: Codebase appears free of obvious fake data." -ForegroundColor Green
}
