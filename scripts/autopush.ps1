$pollSeconds = 20
$minIdleSeconds = 45
$maxPhaseSeconds = 300
$minFilesForImmediateCommit = 10
$lastCommitAt = Get-Date
$lastChangeAt = $null
$lastSnapshot = ""

function Get-TrackedChanges {
    git status --porcelain |
        Where-Object {
            $_ -and
            $_ -notmatch '^\?\? dist/' -and
            $_ -notmatch '^\?\? node_modules/' -and
            $_ -notmatch '^\?\? workspace_report.txt'
        }
}

function Get-PhaseLabel {
    param([string[]]$Changes)

    $paths = $Changes | ForEach-Object {
        if ($_ -match '^\S+\s+(.+)$') { $matches[1].Trim() }
    }

    $labels = @()

    if ($paths -match '^content/') { $labels += 'content' }
    if ($paths -match '^frontend/') { $labels += 'frontend' }
    if ($paths -match '^ai/') { $labels += 'ai' }
    if ($paths -match '^server/') { $labels += 'server' }
    if ($paths -match '^scripts/') { $labels += 'automation' }
    if ($paths -match '^worker/' -or $paths -match '^wrangler\.toml$') { $labels += 'cloudflare' }

    if (-not $labels) {
        $labels += 'workspace'
    }

    ($labels | Select-Object -Unique) -join ', '
}

while ($true) {
    $changes = Get-TrackedChanges

    if (-not $changes) {
        $lastChangeAt = $null
        $lastSnapshot = ""
        Start-Sleep -Seconds $pollSeconds
        continue
    }

    $snapshot = $changes -join "`n"

    if ($snapshot -ne $lastSnapshot) {
        $lastSnapshot = $snapshot
        $lastChangeAt = Get-Date
        Write-Host "Changes detected. Waiting for a stable phase before committing..."
    }

    $now = Get-Date
    $fileCount = ($changes | Measure-Object).Count
    $secondsSinceCommit = ($now - $lastCommitAt).TotalSeconds
    $secondsSinceLastChange = if ($lastChangeAt) { ($now - $lastChangeAt).TotalSeconds } else { 0 }

    $stablePhaseReady = $secondsSinceLastChange -ge $minIdleSeconds
    $phaseTimedOut = $secondsSinceCommit -ge $maxPhaseSeconds
    $batchLargeEnough = $fileCount -ge $minFilesForImmediateCommit

    if (-not ($batchLargeEnough -or $phaseTimedOut -or $stablePhaseReady)) {
        Start-Sleep -Seconds $pollSeconds
        continue
    }

    git add .
    git diff --cached --quiet

    if ($LASTEXITCODE -eq 0) {
        Start-Sleep -Seconds $pollSeconds
        continue
    }

    $time = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $phase = Get-PhaseLabel -Changes $changes
    $message = "system phase commit [$phase] $time"

    git commit -m $message

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Commit skipped. Git reported no commitable phase."
        Start-Sleep -Seconds $pollSeconds
        continue
    }

    git push

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Phase commit pushed [$phase] $time"
        $lastCommitAt = Get-Date
        $lastChangeAt = $null
        $lastSnapshot = ""
    } else {
        Write-Host "Push failed. Leaving changes staged for the next retry."
    }

    Start-Sleep -Seconds $pollSeconds
}
