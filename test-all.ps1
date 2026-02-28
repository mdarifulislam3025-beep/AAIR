$base = "http://localhost:3001"
$pass = 0
$fail = 0
$testEntryId = $null

function Test-Endpoint {
    param($name, $scriptBlock)
    Write-Host ""
    Write-Host "--- $name ---" -ForegroundColor Cyan
    try {
        & $scriptBlock
        Write-Host "PASS" -ForegroundColor Green
        $script:pass++
    } catch {
        Write-Host "FAIL: $_" -ForegroundColor Red
        $script:fail++
    }
}

# ── 1. GET /api/knowledge (seed fix) ──────────────────────────────────────────
Test-Endpoint "GET /api/knowledge (seed.ts fix)" {
    $r = Invoke-RestMethod -Uri "$base/api/knowledge" -Method GET -UseBasicParsing
    $count = $r.entries.Count
    Write-Host "  Entries returned: $count"
    if ($count -eq 0) { throw "No entries returned - seed may have failed" }
    Write-Host "  First entry: $($r.entries[0].title)"
}

# ── 2. GET /api/knowledge?q=baggage ───────────────────────────────────────────
Test-Endpoint "GET /api/knowledge?q=baggage (search)" {
    $r = Invoke-RestMethod -Uri "$base/api/knowledge?q=baggage" -Method GET -UseBasicParsing
    $count = $r.entries.Count
    Write-Host "  Search results: $count"
    if ($count -eq 0) { throw "Search returned no results" }
}

# ── 3. POST /api/knowledge (create entry) ─────────────────────────────────────
Test-Endpoint "POST /api/knowledge (create entry)" {
    $body = @{
        title    = "Test Entry AAIR"
        content  = "This is a test knowledge entry for AAIR testing purposes."
        category = "general"
        tags     = "test,aair"
    } | ConvertTo-Json
    $r = Invoke-RestMethod -Uri "$base/api/knowledge" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
    Write-Host "  Created entry ID: $($r.entry.id)"
    if (-not $r.entry.id) { throw "No entry ID returned" }
    $script:testEntryId = $r.entry.id
}

# ── 4. PUT /api/knowledge (update entry) ──────────────────────────────────────
Test-Endpoint "PUT /api/knowledge (update entry)" {
    $body = @{
        id      = $script:testEntryId
        title   = "Updated Test Entry AAIR"
        content = "Updated content for testing."
        category = "general"
    } | ConvertTo-Json
    $r = Invoke-RestMethod -Uri "$base/api/knowledge" -Method PUT -ContentType "application/json" -Body $body -UseBasicParsing
    Write-Host "  Update success: $($r.success)"
}

# ── 5. POST /api/chat ──────────────────────────────────────────────────────────
Test-Endpoint "POST /api/chat (chat message)" {
    $body = @{
        message   = "What are the IATA baggage rules?"
        sessionId = "test-session-001"
    } | ConvertTo-Json
    $r = Invoke-RestMethod -Uri "$base/api/chat" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
    Write-Host "  Session ID: $($r.sessionId)"
    $len = $r.response.Length
    Write-Host "  Response length: $len chars"
    if (-not $r.response) { throw "No response returned" }
    $preview = $r.response.Substring(0, [Math]::Min(120, $len))
    Write-Host "  Preview: $preview"
}

# ── 6. POST /api/upload (.txt file) ───────────────────────────────────────────
Test-Endpoint "POST /api/upload (.txt file)" {
    $tmpFile = "$env:TEMP\aair_test.txt"
    $content = "IATA Baggage Policy Test Document`n`nThis document covers airline baggage policies.`nPassengers are allowed 23kg of checked baggage.`n`nCarry-on baggage must not exceed 7kg in weight."
    Set-Content -Path $tmpFile -Value $content -Encoding UTF8

    $boundary = "----FormBoundary" + [System.Guid]::NewGuid().ToString("N")
    $fileBytes = [System.IO.File]::ReadAllBytes($tmpFile)
    $fileText = [System.Text.Encoding]::UTF8.GetString($fileBytes)

    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append("--$boundary`r`n")
    [void]$sb.Append("Content-Disposition: form-data; name=`"file`"; filename=`"aair_test.txt`"`r`n")
    [void]$sb.Append("Content-Type: text/plain`r`n`r`n")
    [void]$sb.Append($fileText)
    [void]$sb.Append("`r`n--$boundary--`r`n")
    $bodyContent = $sb.ToString()

    $r = Invoke-RestMethod -Uri "$base/api/upload" -Method POST -ContentType "multipart/form-data; boundary=$boundary" -Body $bodyContent -UseBasicParsing
    Write-Host "  Entries created: $($r.entriesCreated)"
    Write-Host "  Message: $($r.message)"
    if (-not $r.success) { throw "Upload failed: $($r.error)" }
    Remove-Item $tmpFile -ErrorAction SilentlyContinue
}

# ── 7. POST /api/upload (.json file) ──────────────────────────────────────────
Test-Endpoint "POST /api/upload (.json file)" {
    $tmpFile = "$env:TEMP\aair_test.json"
    $jsonContent = '[{"title":"JSON Upload Test","content":"This is JSON content uploaded for testing the AAIR system.","category":"general","tags":"json,test"}]'
    Set-Content -Path $tmpFile -Value $jsonContent -Encoding UTF8

    $boundary = "----FormBoundary" + [System.Guid]::NewGuid().ToString("N")
    $fileBytes = [System.IO.File]::ReadAllBytes($tmpFile)
    $fileText = [System.Text.Encoding]::UTF8.GetString($fileBytes)

    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append("--$boundary`r`n")
    [void]$sb.Append("Content-Disposition: form-data; name=`"file`"; filename=`"aair_test.json`"`r`n")
    [void]$sb.Append("Content-Type: application/json`r`n`r`n")
    [void]$sb.Append($fileText)
    [void]$sb.Append("`r`n--$boundary--`r`n")
    $bodyContent = $sb.ToString()

    $r = Invoke-RestMethod -Uri "$base/api/upload" -Method POST -ContentType "multipart/form-data; boundary=$boundary" -Body $bodyContent -UseBasicParsing
    Write-Host "  Entries created: $($r.entriesCreated)"
    if (-not $r.success) { throw "Upload failed: $($r.error)" }
    Remove-Item $tmpFile -ErrorAction SilentlyContinue
}

# ── 8. POST /api/upload (.csv file) ───────────────────────────────────────────
Test-Endpoint "POST /api/upload (.csv file)" {
    $tmpFile = "$env:TEMP\aair_test.csv"
    $csvContent = "title,content,category,tags`nCSV Row 1,Content for row one about baggage.,baggage,csv`nCSV Row 2,Content for row two about ticketing.,ticketing,csv"
    Set-Content -Path $tmpFile -Value $csvContent -Encoding UTF8

    $boundary = "----FormBoundary" + [System.Guid]::NewGuid().ToString("N")
    $fileBytes = [System.IO.File]::ReadAllBytes($tmpFile)
    $fileText = [System.Text.Encoding]::UTF8.GetString($fileBytes)

    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append("--$boundary`r`n")
    [void]$sb.Append("Content-Disposition: form-data; name=`"file`"; filename=`"aair_test.csv`"`r`n")
    [void]$sb.Append("Content-Type: text/csv`r`n`r`n")
    [void]$sb.Append($fileText)
    [void]$sb.Append("`r`n--$boundary--`r`n")
    $bodyContent = $sb.ToString()

    $r = Invoke-RestMethod -Uri "$base/api/upload" -Method POST -ContentType "multipart/form-data; boundary=$boundary" -Body $bodyContent -UseBasicParsing
    Write-Host "  Entries created: $($r.entriesCreated)"
    if (-not $r.success) { throw "Upload failed: $($r.error)" }
    Remove-Item $tmpFile -ErrorAction SilentlyContinue
}

# ── 9. POST /api/upload (unsupported .exe - should reject) ────────────────────
Test-Endpoint "POST /api/upload (unsupported .exe - should reject)" {
    $boundary = "----FormBoundary" + [System.Guid]::NewGuid().ToString("N")
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append("--$boundary`r`n")
    [void]$sb.Append("Content-Disposition: form-data; name=`"file`"; filename=`"malware.exe`"`r`n")
    [void]$sb.Append("Content-Type: application/octet-stream`r`n`r`n")
    [void]$sb.Append("fake binary content")
    [void]$sb.Append("`r`n--$boundary--`r`n")
    $bodyContent = $sb.ToString()

    try {
        Invoke-RestMethod -Uri "$base/api/upload" -Method POST -ContentType "multipart/form-data; boundary=$boundary" -Body $bodyContent -UseBasicParsing
        throw "Should have rejected .exe file"
    } catch {
        if ($_.ToString() -match "Should have rejected") { throw $_ }
        Write-Host "  Correctly rejected unsupported file type"
    }
}

# ── 10. POST /api/scrape (valid URL) ──────────────────────────────────────────
Test-Endpoint "POST /api/scrape (valid URL - example.com)" {
    $body = @{
        url      = "https://example.com"
        category = "general"
        tags     = "test,scrape"
    } | ConvertTo-Json
    $r = Invoke-RestMethod -Uri "$base/api/scrape" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
    Write-Host "  Page title: $($r.pageTitle)"
    Write-Host "  Entries created: $($r.entriesCreated)"
    if (-not $r.success) { throw "Scrape failed: $($r.error)" }
}

# ── 11. POST /api/scrape (invalid URL - should reject) ────────────────────────
Test-Endpoint "POST /api/scrape (invalid URL - should reject)" {
    $body = @{ url = "not-a-valid-url" } | ConvertTo-Json
    try {
        Invoke-RestMethod -Uri "$base/api/scrape" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
        throw "Should have rejected invalid URL"
    } catch {
        if ($_.ToString() -match "Should have rejected") { throw $_ }
        Write-Host "  Correctly rejected invalid URL"
    }
}

# ── 12. POST /api/scrape (missing URL - should reject) ────────────────────────
Test-Endpoint "POST /api/scrape (missing URL - should reject)" {
    $body = @{ category = "general" } | ConvertTo-Json
    try {
        Invoke-RestMethod -Uri "$base/api/scrape" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
        throw "Should have rejected missing URL"
    } catch {
        if ($_.ToString() -match "Should have rejected") { throw $_ }
        Write-Host "  Correctly rejected missing URL"
    }
}

# ── 13. GET /api/settings ─────────────────────────────────────────────────────
Test-Endpoint "GET /api/settings (dashboard stats)" {
    $r = Invoke-RestMethod -Uri "$base/api/settings" -Method GET -UseBasicParsing
    Write-Host "  Total entries: $($r.stats.totalEntries)"
    Write-Host "  Total documents: $($r.stats.totalDocuments)"
    Write-Host "  Total chats: $($r.stats.totalChats)"
    Write-Host "  Categories: $($r.stats.categories.Count)"
    if ($r.stats.totalEntries -eq 0) { throw "No entries in stats" }
}

# ── 14. Data persistence check ────────────────────────────────────────────────
Test-Endpoint "Data persistence (data/aair.json)" {
    $dbPath = "h:/CODE/AI AGENT/AI AGENT/AAIR/data/aair.json"
    if (-not (Test-Path $dbPath)) { throw "data/aair.json not found!" }
    $db = Get-Content $dbPath -Raw | ConvertFrom-Json
    $entryCount = $db.knowledge_entries.Count
    $docCount   = $db.uploaded_documents.Count
    $chatCount  = $db.chat_history.Count
    Write-Host "  Knowledge entries in DB: $entryCount"
    Write-Host "  Documents in DB: $docCount"
    Write-Host "  Chat messages in DB: $chatCount"
    if ($entryCount -eq 0) { throw "No entries in database!" }
    if ($docCount -eq 0)   { throw "No documents in database!" }
    if ($chatCount -eq 0)  { throw "No chat history in database!" }
}

# ── 15. DELETE /api/knowledge (cleanup test entry) ────────────────────────────
Test-Endpoint "DELETE /api/knowledge (cleanup test entry)" {
    if ($script:testEntryId) {
        $r = Invoke-RestMethod -Uri "$base/api/knowledge?id=$($script:testEntryId)" -Method DELETE -UseBasicParsing
        Write-Host "  Deleted entry ID: $($script:testEntryId), success: $($r.success)"
    } else {
        Write-Host "  No test entry to clean up"
    }
}

# ── Summary ───────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "========================================" -ForegroundColor White
if ($fail -eq 0) {
    Write-Host "ALL TESTS PASSED: $pass/$($pass+$fail)" -ForegroundColor Green
} else {
    Write-Host "RESULTS: $pass passed, $fail failed" -ForegroundColor Yellow
}
Write-Host "========================================" -ForegroundColor White
