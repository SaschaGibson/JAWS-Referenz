param(
    [string]$OutputDir = '.\release',
    [string]$ZipName = 'JAWS-RDP-Reconnect-FSAPI-Deliverable.zip'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$files = @(
    'remote_jaws_reconnect.py',
    'Build-RemoteJawsReconnectExe.ps1',
    'Register-RemoteJawsReconnectTask-FSAPI.ps1',
    'JAWS-RDP-Reconnect-FSAPI-README.md',
    'ADMIN-ANLEITUNG.md',
    'NUTZER-ANLEITUNG.md',
    'LIEFERPAKET-HINWEIS.md'
)

foreach ($f in $files) {
    if (-not (Test-Path $f)) {
        throw "Datei fehlt: $f"
    }
}

$null = New-Item -ItemType Directory -Path $OutputDir -Force -ErrorAction SilentlyContinue
$zipPath = Join-Path $OutputDir $ZipName
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Compress-Archive -Path $files -DestinationPath $zipPath -CompressionLevel Optimal
Write-Host "ZIP erstellt: $zipPath"
