# JAWS Reconnect Recovery – Admin-Anleitung

## Lieferumfang
- `RemoteJawsReconnect.exe` (Onefile, noconsole)
- `Register-RemoteJawsReconnectTask-FSAPI.ps1`
- `remote_jaws_reconnect.py` (Quelle)
- `Build-RemoteJawsReconnectExe.ps1` (Build-Skript)

## 1) EXE bauen (auf Windows)
```powershell
powershell.exe -ExecutionPolicy Bypass -File .\Build-RemoteJawsReconnectExe.ps1 -Clean
```

## 2) Task registrieren (EXE-Modus, Standard)
```powershell
powershell.exe -ExecutionPolicy Bypass -File .\Register-RemoteJawsReconnectTask-FSAPI.ps1 `
  -ActionMode Exe `
  -TriggerMode RemoteConnect `
  -DelaySeconds 7 `
  -CooldownSeconds 60 `
  -IfTaskExists Overwrite
```

## 3) Task registrieren (Python-Modus, optional)
```powershell
powershell.exe -ExecutionPolicy Bypass -File .\Register-RemoteJawsReconnectTask-FSAPI.ps1 `
  -ActionMode Python `
  -TriggerMode RemoteConnect
```

## 4) Ausliefer-ZIP lokal erzeugen
```powershell
powershell.exe -ExecutionPolicy Bypass -File .\Create-DeliveryZip.ps1
```

## Betriebsparameter
- `-IfTaskExists Overwrite|Skip|Fail`
- `-TriggerMode RemoteConnect|SessionUnlock`
- `-DryRun` (nur Log, kein API-Aufruf)
- `-ForceLocal` (Remote-Check ignorieren)

## Betriebshinweise
- Task ist im XML auf `Hidden=true` gesetzt.
- EXE wird ohne Konsolenfenster erstellt (`--noconsole`).
- Standardpfad für Logs/State: `C:\ProgramData\Beta\RemoteJawsRecovery`.

## Fehleranalyse
- Logdatei prüfen: `restart-log.txt`
- Testlauf erzwingen:
```powershell
"C:\ProgramData\Beta\RemoteJawsRecovery\RemoteJawsReconnect.exe" --force-local --cooldown-seconds 0 --delay-seconds 0
```
