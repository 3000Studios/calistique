$lastCommit = Get-Date

while ($true) {

    $changes = git status --porcelain

    if ($changes) {

        $elapsed = (Get-Date) - $lastCommit

        # Only commit if 2 minutes passed or 10+ files changed
        $fileCount = ($changes | Measure-Object).Count

        if ($elapsed.TotalSeconds -gt 120 -or $fileCount -ge 10) {

            git add .

            $time = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

            git commit -m "system phase commit $time"
            git push

            Write-Host "Phase commit pushed $time"

            $lastCommit = Get-Date
        }
    }

    Start-Sleep -Seconds 20
}
