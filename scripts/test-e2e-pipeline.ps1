$baseUrl = "http://localhost:3000"

Write-Host "Running End-to-End Pipeline Test (Test A: Integration)" -ForegroundColor Cyan
Write-Host "--------------------------------------------------------" -ForegroundColor Cyan

# 1. Provide an EML payload with a known hash
$emlPath = "C:\Users\bawan\cybershield\scripts\test.eml"

Write-Host "1. Submitting parsed EML logic to /api/email/analyze (simulating email parser layer)"
# We will use Invoke-WebRequest for multipart form data in PowerShell
$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"
$bodyBytes = [System.Collections.Generic.List[byte]]::new()

$header = "--$boundary$LF" +
          "Content-Disposition: form-data; name=`"file`"; filename=`"test.eml`"$LF" +
          "Content-Type: message/rfc822$LF$LF"
$bodyBytes.AddRange([System.Text.Encoding]::UTF8.GetBytes($header))
$bodyBytes.AddRange([System.IO.File]::ReadAllBytes($emlPath))
$footer = "$LF--$boundary--$LF"
$bodyBytes.AddRange([System.Text.Encoding]::UTF8.GetBytes($footer))

$vtResponse = Invoke-RestMethod -Uri "$baseUrl/api/email/analyze" -Method Post -Body $bodyBytes.ToArray() -ContentType "multipart/form-data; boundary=$boundary" -ErrorAction Stop

$incidentId = $vtResponse.incidentId
$hash = $vtResponse.analysis.attachments[0].sha256

Write-Host "   Email Analysis Incident ID created: $incidentId" -ForegroundColor Green
Write-Host "   Computed SHA256 of Attachment: $hash" -ForegroundColor Green

# 2. Simulate the Windows Endpoint sending a telemetry event with the exact same hash
$telemetryPayload = @{
    eventType = "PROCESS_CREATION"
    timestamp = (Get-Date).ToString("o")
    processId = 4012
    processName = "invoice.exe"
    processPath = "C:\Users\User\Downloads\invoice.exe"
    commandLine = "invoice.exe"
    hashSha256 = $hash
    action = "BLOCKED"
    agentId = "win-agent-001"
}

Write-Host "2. Submitting Endpoint Telemetry Event to /api/telemetry/security-events"
$telemetryResponse = Invoke-RestMethod -Uri "$baseUrl/api/telemetry/security-events" -Method Post -Body ($telemetryPayload | ConvertTo-Json -Depth 10) -ContentType "application/json" -Headers @{ "Authorization" = "Bearer CS-AGENT-SECRET-2026" } -ErrorAction Stop

Write-Host "   Event processed. Correlation matched: $($telemetryResponse.correlationMatched)" -ForegroundColor Green
if ($telemetryResponse.correlationMatched) {
    Write-Host "   Correlated to Incident ID: $($telemetryResponse.incidentId)" -ForegroundColor Green
} else {
    Write-Host "   ERROR: Correlation did not match!" -ForegroundColor Red
    exit 1
}

# 3. Request AI Forensics
Write-Host "3. Triggering AI Forensics for Incident $($telemetryResponse.incidentId)"
$aiPayload = @{
    incidentDetails = @{
        id = $telemetryResponse.incidentId
        hash = $telemetryPayload.hashSha256
        process = $telemetryPayload.processName
    }
}
try {
    $aiResponse = Invoke-RestMethod -Uri "$baseUrl/api/ai/forensics" -Method Post -Body ($aiPayload | ConvertTo-Json -Depth 10) -ContentType "application/json" -ErrorAction Stop
    Write-Host "   AI Forensics Generated Successfully." -ForegroundColor Green
    Write-Host "   Confidence: $($aiResponse.report.confidenceScore)%"
    Write-Host "   Summary: $($aiResponse.report.executiveSummary)"
} catch {
    Write-Host "   AI Forensics Failed: $_" -ForegroundColor Red
}

Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
Write-Host "End-to-End Pipeline Test Complete." -ForegroundColor Cyan
