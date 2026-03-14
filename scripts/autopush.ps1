while ($true) {

    git add .

    $changes = git status --porcelain

    if ($changes) {
        $time = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

        git commit -m "auto update $time"
        git push

        Write-Host "Auto deploy triggered $time"
    }

    Start-Sleep -Seconds 5
}
