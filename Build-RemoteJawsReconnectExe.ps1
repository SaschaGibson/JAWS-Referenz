param(
    [string]$EntryScript = '.\remote_jaws_reconnect.py',
    [string]$AppName = 'RemoteJawsReconnect',
    [string]$RuntimeTmpDir = 'C:\ProgramData\Beta\RemoteJawsRecovery\_runtime',
    [switch]$Clean
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path $EntryScript)) {
    throw "Entry-Script nicht gefunden: $EntryScript"
}

$py = Get-Command py.exe -ErrorAction SilentlyContinue
if ($null -eq $py) {
    throw 'py.exe wurde nicht gefunden. Bitte Python Launcher installieren.'
}

$null = New-Item -ItemType Directory -Path $RuntimeTmpDir -Force -ErrorAction SilentlyContinue

$arguments = @(
    '-3', '-m', 'PyInstaller',
    '--noconfirm',
    '--onefile',
    '--noconsole',
    '--name', $AppName,
    '--collect-submodules', 'win32com',
    '--hidden-import', 'pythoncom',
    '--hidden-import', 'pywintypes',
    '--runtime-tmpdir', $RuntimeTmpDir,
    '--distpath', '.\dist',
    '--workpath', '.\build',
    '--specpath', '.\build'
)

if ($Clean) {
    $arguments += '--clean'
}

$arguments += $EntryScript

Write-Host "Starte Build: py.exe $($arguments -join ' ')"
& py.exe @arguments
if ($LASTEXITCODE -ne 0) {
    throw "PyInstaller fehlgeschlagen mit ExitCode $LASTEXITCODE"
}

$exePath = Join-Path (Resolve-Path '.\dist').Path ($AppName + '.exe')
if (-not (Test-Path $exePath)) {
    throw "EXE wurde nicht erzeugt: $exePath"
}

Write-Host "Build erfolgreich: $exePath"
