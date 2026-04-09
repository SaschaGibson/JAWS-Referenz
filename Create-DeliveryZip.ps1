param(
    [string]$OutputDir = '.\release',
    [string]$ZipName = 'JAWS-RDP-Reconnect-FSAPI-Deliverable.zip',
    [string]$ExePath = '.\dist\RemoteJawsReconnect.exe',
    [string]$BundleDir = '.\dist\RemoteJawsReconnect',
    [ValidateSet('OneDir','OneFile')]
    [string]$PackageMode = 'OneDir',
    [ValidateSet('Auto','Required','Skip')]
    [string]$IncludeExe = 'Auto'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$files = New-Object System.Collections.Generic.List[string]

$baseFiles = @(
    'remote_jaws_reconnect.py',
    'Build-RemoteJawsReconnectExe.ps1',
    'Register-RemoteJawsReconnectTask-FSAPI.ps1',
    'JAWS-RDP-Reconnect-FSAPI-README.md',
    'ADMIN-ANLEITUNG.md',
    'NUTZER-ANLEITUNG.md',
    'LIEFERPAKET-HINWEIS.md'
)

foreach ($f in $baseFiles) {
    if (-not (Test-Path $f)) {
        throw "Datei fehlt: $f"
    }
    $files.Add($f)
}

if ($IncludeExe -ne 'Skip') {
    if ($PackageMode -eq 'OneFile') {
        if (Test-Path $ExePath) {
            $files.Add($ExePath)
        } elseif ($IncludeExe -eq 'Required') {
            throw "OneFile-EXE wurde angefordert, aber nicht gefunden: $ExePath"
        } else {
            Write-Warning "OneFile-EXE nicht gefunden und wird nicht ins ZIP aufgenommen: $ExePath"
        }
    } else {
        if (Test-Path $BundleDir) {
            $files.Add($BundleDir)
        } elseif ($IncludeExe -eq 'Required') {
            throw "OneDir-Bundle wurde angefordert, aber nicht gefunden: $BundleDir"
        } else {
            Write-Warning "OneDir-Bundle nicht gefunden und wird nicht ins ZIP aufgenommen: $BundleDir"
        }
    }
}

$null = New-Item -ItemType Directory -Path $OutputDir -Force -ErrorAction SilentlyContinue
$zipPath = Join-Path $OutputDir $ZipName
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Compress-Archive -Path @($files) -DestinationPath $zipPath -CompressionLevel Optimal
Write-Host "ZIP erstellt: $zipPath"
