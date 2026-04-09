param(
    [string]$TaskName = 'Remote JAWS Reconnect Recovery (FSAPI)',
    [ValidateSet('Exe','Python')]
    [string]$ActionMode = 'Exe',
    [string]$PythonScriptPath = 'C:\ProgramData\Beta\RemoteJawsRecovery\remote_jaws_reconnect.py',
    [string]$ExePath = 'C:\ProgramData\Beta\RemoteJawsRecovery\RemoteJawsReconnect\RemoteJawsReconnect.exe',
    [ValidateSet('OneDir','OneFile')]
    [string]$ExeDeploymentMode = 'OneDir',
    [string]$SourceExePath = '',
    [string]$SourceBundleDir = '',
    [ValidateSet('RemoteConnect','SessionUnlock')]
    [string]$TriggerMode = 'RemoteConnect',
    [int]$DelaySeconds = 7,
    [int]$CooldownSeconds = 60,
    [switch]$DryRun,
    [switch]$ForceLocal,
    [string]$FallbackFunctionName = '',
    [ValidateSet('Overwrite','Skip','Fail')]
    [string]$IfTaskExists = 'Overwrite'
)

# Sync marker: schtasks resolver active (2026-04-09)
$script:ScriptVersion = '2026-04-09-schtasks-sync'

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-SchtasksExecutable {
    $candidatePaths = @(
        (Join-Path $env:WINDIR 'System32\schtasks.exe'),
        (Join-Path $env:WINDIR 'Sysnative\schtasks.exe')
    )

    foreach ($p in $candidatePaths) {
        if (-not [string]::IsNullOrWhiteSpace($p) -and (Test-Path $p)) {
            return $p
        }
    }

    $cmd = Get-Command schtasks.exe -ErrorAction SilentlyContinue
    if ($null -ne $cmd -and -not [string]::IsNullOrWhiteSpace($cmd.Source)) {
        return $cmd.Source
    }

    throw 'schtasks.exe wurde nicht gefunden. Bitte prüfen Sie PATH bzw. %WINDIR%\\System32.'
}

$script:SchtasksExe = Get-SchtasksExecutable

$targetPath = if ($ActionMode -eq 'Exe') { $ExePath } else { $PythonScriptPath }
$targetDir = Split-Path -Path $targetPath -Parent
$null = New-Item -ItemType Directory -Path $targetDir -Force -ErrorAction SilentlyContinue

if ($ActionMode -eq 'Python') {
    $sourceScript = Join-Path $PSScriptRoot 'remote_jaws_reconnect.py'
    if (-not (Test-Path $sourceScript)) {
        throw "Python-Script nicht gefunden: $sourceScript"
    }
    Copy-Item -Path $sourceScript -Destination $PythonScriptPath -Force
} else {
    if ($ExeDeploymentMode -eq 'OneFile') {
        if ([string]::IsNullOrWhiteSpace($SourceExePath)) {
            $SourceExePath = Join-Path $PSScriptRoot 'dist\RemoteJawsReconnect.exe'
        }
        if (-not (Test-Path $SourceExePath)) {
            throw "EXE nicht gefunden: $SourceExePath. Bitte zuerst Build-RemoteJawsReconnectExe.ps1 -BundleMode OneFile ausführen."
        }
        Copy-Item -Path $SourceExePath -Destination $ExePath -Force
    } else {
        if ([string]::IsNullOrWhiteSpace($SourceBundleDir)) {
            $SourceBundleDir = Join-Path $PSScriptRoot 'dist\RemoteJawsReconnect'
        }
        if (-not (Test-Path $SourceBundleDir)) {
            throw "OneDir-Bundle nicht gefunden: $SourceBundleDir. Bitte zuerst Build-RemoteJawsReconnectExe.ps1 -BundleMode OneDir ausführen."
        }

        $targetBundleDir = Split-Path -Path $ExePath -Parent
        if (Test-Path $targetBundleDir) {
            Get-ChildItem -Path $targetBundleDir -Force -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
        } else {
            $null = New-Item -ItemType Directory -Path $targetBundleDir -Force -ErrorAction SilentlyContinue
        }
        Copy-Item -Path (Join-Path $SourceBundleDir '*') -Destination $targetBundleDir -Recurse -Force
    }
}

$userId = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
$command = ''
$arguments = @('--delay-seconds', $DelaySeconds, '--cooldown-seconds', $CooldownSeconds)
if ($ActionMode -eq 'Python') {
    $escapedPath = $PythonScriptPath.Replace('&','&amp;').Replace('<','&lt;').Replace('>','&gt;')
    $pyLauncher = (Get-Command py.exe -ErrorAction SilentlyContinue)
    $pythonCmd = if ($null -ne $pyLauncher) { 'py.exe' } else { 'python.exe' }
    $command = $pythonCmd
    if ($pythonCmd -eq 'py.exe') {
        $arguments = @('-3', '"' + $escapedPath + '"') + $arguments
    } else {
        $arguments = @('"' + $escapedPath + '"') + $arguments
    }
} else {
    $command = $ExePath.Replace('&','&amp;').Replace('<','&lt;').Replace('>','&gt;')
}

if ($DryRun) { $arguments += '--dry-run' }
if ($ForceLocal) { $arguments += '--force-local' }
if (-not [string]::IsNullOrWhiteSpace($FallbackFunctionName)) {
    $arguments += @('--fallback-function-name', $FallbackFunctionName)
}

$argString = ($arguments -join ' ')

function Test-TaskExists {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name
    )

    $oldEap = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        & $script:SchtasksExe /Query /TN $Name *> $null
        return ($LASTEXITCODE -eq 0)
    } finally {
        $ErrorActionPreference = $oldEap
    }
}

$triggerXml = switch ($TriggerMode) {
    'RemoteConnect' {
@"
    <SessionStateChangeTrigger>
      <Enabled>true</Enabled>
      <UserId>$userId</UserId>
      <Delay>PT${DelaySeconds}S</Delay>
      <StateChange>RemoteConnect</StateChange>
    </SessionStateChangeTrigger>
"@
    }
    'SessionUnlock' {
@"
    <SessionStateChangeTrigger>
      <Enabled>true</Enabled>
      <UserId>$userId</UserId>
      <Delay>PT${DelaySeconds}S</Delay>
      <StateChange>SessionUnlock</StateChange>
    </SessionStateChangeTrigger>
"@
    }
}

$xml = @"
<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.4" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Author>$userId</Author>
    <Description>Startet JAWS nach RDP-Reconnect/Unlock über FSAPI neu (RunScript RestartWithoutDump).</Description>
  </RegistrationInfo>
  <Triggers>
$triggerXml
  </Triggers>
  <Principals>
    <Principal id="Author">
      <UserId>$userId</UserId>
      <LogonType>InteractiveToken</LogonType>
      <RunLevel>HighestAvailable</RunLevel>
    </Principal>
  </Principals>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <AllowHardTerminate>true</AllowHardTerminate>
    <StartWhenAvailable>true</StartWhenAvailable>
    <RunOnlyIfNetworkAvailable>false</RunOnlyIfNetworkAvailable>
    <IdleSettings>
      <StopOnIdleEnd>false</StopOnIdleEnd>
      <RestartOnIdle>false</RestartOnIdle>
    </IdleSettings>
    <AllowStartOnDemand>true</AllowStartOnDemand>
    <Enabled>true</Enabled>
    <Hidden>true</Hidden>
    <RunOnlyIfIdle>false</RunOnlyIfIdle>
    <DisallowStartOnRemoteAppSession>false</DisallowStartOnRemoteAppSession>
    <UseUnifiedSchedulingEngine>true</UseUnifiedSchedulingEngine>
    <WakeToRun>false</WakeToRun>
    <ExecutionTimeLimit>PT5M</ExecutionTimeLimit>
    <Priority>6</Priority>
  </Settings>
  <Actions Context="Author">
    <Exec>
      <Command>$command</Command>
      <Arguments>$argString</Arguments>
    </Exec>
  </Actions>
</Task>
"@

$tmpXml = Join-Path $env:TEMP 'RemoteJawsReconnectRecovery-FSAPI.xml'
$xml | Set-Content -Path $tmpXml -Encoding Unicode

$taskExists = Test-TaskExists -Name $TaskName
if ($taskExists) {
    switch ($IfTaskExists) {
        'Skip' {
            Write-Host "Task existiert bereits. Registrierung übersprungen: $TaskName"
            Write-Host "IfTaskExists: $IfTaskExists"
            exit 0
        }
        'Fail' {
            throw "Task existiert bereits: $TaskName (IfTaskExists=Fail)"
        }
        default {
            Write-Host "Task existiert bereits und wird überschrieben: $TaskName"
        }
    }
}

$createArgs = @('/Create', '/TN', $TaskName, '/XML', $tmpXml)
if ($IfTaskExists -eq 'Overwrite') {
    $createArgs += '/F'
}

& $script:SchtasksExe @createArgs | Out-Host

Write-Host "Task registriert: $TaskName"
Write-Host "ScriptVersion: $script:ScriptVersion"
Write-Host "ActionMode: $ActionMode"
if ($ActionMode -eq 'Exe') {
    Write-Host "ExeDeploymentMode: $ExeDeploymentMode"
    Write-Host "ExePath: $ExePath"
} else {
    Write-Host "Python script: $PythonScriptPath"
}
Write-Host "TriggerMode: $TriggerMode"
Write-Host "DelaySeconds: $DelaySeconds"
Write-Host "CooldownSeconds: $CooldownSeconds"
Write-Host "DryRun: $DryRun"
Write-Host "ForceLocal: $ForceLocal"
Write-Host "FallbackFunctionName: $FallbackFunctionName"
