[CmdletBinding(SupportsShouldProcess)]
param(
  [string[]]$WorkspaceRoots = @(
    'C:\Workspaces\myappai',
    'C:\Workspaces\OpenInt',
    'C:\projects\ai-builder'
  ),
  [switch]$PurgeTemp,
  [int]$TempAgeDays = 7
)

$ErrorActionPreference = 'Stop'

function Remove-GeneratedPath {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Label
  )

  if (-not (Test-Path -LiteralPath $Path)) {
    return $false
  }

  if ($PSCmdlet.ShouldProcess($Path, "Remove $Label")) {
    Remove-Item -LiteralPath $Path -Recurse -Force
    return $true
  }

  return $false
}

$removed = New-Object System.Collections.Generic.List[string]

foreach ($root in $WorkspaceRoots) {
  if (-not (Test-Path -LiteralPath $root)) {
    continue
  }

  $targets = @(
    @{ Path = Join-Path $root '.cache'; Label = '.cache' },
    @{ Path = Join-Path $root 'coverage'; Label = 'coverage' },
    @{ Path = Join-Path $root 'dist'; Label = 'dist' },
    @{ Path = Join-Path $root '__pycache__'; Label = '__pycache__' },
    @{ Path = Join-Path $root 'node_modules\.cache'; Label = 'node_modules cache' }
  )

  foreach ($target in $targets) {
    if (Remove-GeneratedPath -Path $target.Path -Label $target.Label) {
      $removed.Add($target.Path)
    }
  }

  $logFiles = Get-ChildItem -LiteralPath $root -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Extension -in '.log', '.tmp', '.bak' }
  foreach ($file in $logFiles) {
    if ($PSCmdlet.ShouldProcess($file.FullName, 'Remove stale log or temp file')) {
      Remove-Item -LiteralPath $file.FullName -Force
      $removed.Add($file.FullName)
    }
  }
}

if ($PurgeTemp) {
  $cutoff = (Get-Date).AddDays(-[math]::Abs($TempAgeDays))
  $tempRoots = @(
    $env:TEMP,
    $env:TMP
  ) | Where-Object { $_ -and (Test-Path -LiteralPath $_) } | Select-Object -Unique

  foreach ($tempRoot in $tempRoots) {
    Get-ChildItem -LiteralPath $tempRoot -File -Recurse -ErrorAction SilentlyContinue |
      Where-Object { $_.LastWriteTime -lt $cutoff } |
      ForEach-Object {
        if ($PSCmdlet.ShouldProcess($_.FullName, 'Remove aged temp file')) {
          Remove-Item -LiteralPath $_.FullName -Force
          $removed.Add($_.FullName)
        }
      }
  }
}

[pscustomobject]@{
  cleanedAt = (Get-Date).ToString('o')
  removedCount = $removed.Count
  removedPaths = $removed
  purgedTemp = [bool]$PurgeTemp
}
