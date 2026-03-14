while (\True) {

    git add .

    \ = git status --porcelain

    if (\) {

        \ = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'

        git commit -m "auto update \"
        git push

        Write-Host "Auto deploy triggered \"
    }

    Start-Sleep -Seconds 5
}
