param(
    [string]$TaskName = 'Remote JAWS Reconnect Recovery (FSAPI)',
    [string]$PythonScriptPath = 'C:\ProgramData\Beta\RemoteJawsRecovery\remote_jaws_reconnect.py',
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

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$targetDir = Split-Path -Path $PythonScriptPath -Parent
$null = New-Item -ItemType Directory -Path $targetDir -Force -ErrorAction SilentlyContinue

$sourceScript = Join-Path $PSScriptRoot 'remote_jaws_reconnect.py'
if (-not (Test-Path $sourceScript)) {
    throw "Python-Script nicht gefunden: $sourceScript"
}
Copy-Item -Path $sourceScript -Destination $PythonScriptPath -Force

$userId = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
$escapedPath = $PythonScriptPath.Replace('&','&amp;').Replace('<','&lt;').Replace('>','&gt;')

$pyLauncher = (Get-Command py.exe -ErrorAction SilentlyContinue)
$pythonCmd = if ($null -ne $pyLauncher) { 'py.exe' } else { 'python.exe' }

$arguments = @('-3', '"' + $escapedPath + '"', '--delay-seconds', $DelaySeconds, '--cooldown-seconds', $CooldownSeconds)
if ($DryRun) { $arguments += '--dry-run' }
if ($ForceLocal) { $arguments += '--force-local' }
if (-not [string]::IsNullOrWhiteSpace($FallbackFunctionName)) {
    $arguments += @('--fallback-function-name', $FallbackFunctionName)
}

if ($pythonCmd -eq 'python.exe') {
    $arguments = @('"' + $escapedPath + '"', '--delay-seconds', $DelaySeconds, '--cooldown-seconds', $CooldownSeconds)
    if ($DryRun) { $arguments += '--dry-run' }
    if ($ForceLocal) { $arguments += '--force-local' }
    if (-not [string]::IsNullOrWhiteSpace($FallbackFunctionName)) {
        $arguments += @('--fallback-function-name', $FallbackFunctionName)
    }
}

$argString = ($arguments -join ' ')

function Test-TaskExists {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name
    )

    $null = & schtasks.exe /Query /TN $Name 2>$null
    return ($LASTEXITCODE -eq 0)
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
    <Hidden>false</Hidden>
    <RunOnlyIfIdle>false</RunOnlyIfIdle>
    <DisallowStartOnRemoteAppSession>false</DisallowStartOnRemoteAppSession>
    <UseUnifiedSchedulingEngine>true</UseUnifiedSchedulingEngine>
    <WakeToRun>false</WakeToRun>
    <ExecutionTimeLimit>PT5M</ExecutionTimeLimit>
    <Priority>6</Priority>
  </Settings>
  <Actions Context="Author">
    <Exec>
      <Command>$pythonCmd</Command>
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

& schtasks.exe @createArgs | Out-Host

Write-Host "Task registriert: $TaskName"
Write-Host "Python script: $PythonScriptPath"
Write-Host "TriggerMode: $TriggerMode"
Write-Host "DelaySeconds: $DelaySeconds"
Write-Host "CooldownSeconds: $CooldownSeconds"
Write-Host "DryRun: $DryRun"
Write-Host "ForceLocal: $ForceLocal"
Write-Host "FallbackFunctionName: $FallbackFunctionName"
