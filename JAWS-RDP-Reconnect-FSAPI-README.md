# JAWS RDP Reconnect (FSAPI-Variante)

Diese Variante beendet **keine** Prozesse mit `taskkill`, sondern nutzt die JAWS-eigene COM-API (FSAPI):

- `RunScript("RestartWithoutDump")`
- optionaler Fallback: `RunFunction("...")`

Dadurch entfallen viele Rechteprobleme beim gewaltsamen Prozessbeenden.

## Dateien

- `remote_jaws_reconnect.py` (Aktionsskript mit Logging, Cooldown, DryRun)
- `Register-RemoteJawsReconnectTask-FSAPI.ps1` (registriert die geplante Aufgabe)

## Logging

Standard-Logdatei:

- `C:\ProgramData\Beta\RemoteJawsRecovery\restart-log.txt`

## Schnelltests

1) Aktionsskript (ohne FSAPI-Aufruf):

```powershell
python .\remote_jaws_reconnect.py --dry-run --force-local
```

2) Task registrieren:

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\Register-RemoteJawsReconnectTask-FSAPI.ps1 -DryRun
```

### Verhalten bei bereits vorhandener Task

Über `-IfTaskExists` steuerbar:

- `Overwrite` (Default): vorhandene Task wird aktualisiert/überschrieben
- `Skip`: Registrierung wird ohne Fehler beendet, falls Task schon existiert
- `Fail`: Registrierung bricht mit Fehler ab, falls Task schon existiert

## Hinweis zu Python-Abhängigkeiten

- Primär wird `win32com.client` (pywin32) genutzt.
- Wenn `pywin32` fehlt, versucht das Skript automatisch einen Fallback über `powershell.exe` und `New-Object -ComObject freedomsci.jawsapi`.
