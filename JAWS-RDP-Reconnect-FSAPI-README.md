# JAWS RDP Reconnect (FSAPI-Variante)

Diese Variante beendet **keine** Prozesse mit `taskkill`, sondern nutzt die JAWS-eigene COM-API (FSAPI):

- `RunScript("RestartWithoutDump")`
- optionaler Fallback: `RunFunction("...")`

Dadurch entfallen viele Rechteprobleme beim gewaltsamen Prozessbeenden.

## Dateien

- `remote_jaws_reconnect.py` (Aktionsskript mit Logging, Cooldown, DryRun)
- `Build-RemoteJawsReconnectExe.ps1` (erzeugt eine EXE via PyInstaller, ohne sichtbares Konsolenfenster)
- `Register-RemoteJawsReconnectTask-FSAPI.ps1` (registriert die geplante Aufgabe; EXE- oder Python-Modus)
- `Create-DeliveryZip.ps1` (erstellt das auslieferfertige ZIP lokal)
- `NUTZER-ANLEITUNG.md` (Kurzinfo für Endanwender)
- `ADMIN-ANLEITUNG.md` (Deployment- und Betriebsanleitung)

## Logging

Standard-Logdatei:

- `C:\ProgramData\Beta\RemoteJawsRecovery\restart-log.txt`

## Schnelltests

1) Aktionsskript (ohne FSAPI-Aufruf):

```powershell
python .\remote_jaws_reconnect.py --dry-run --force-local
```

2) EXE bauen:

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\Build-RemoteJawsReconnectExe.ps1 -BundleMode OneDir -Clean
```

3) Task registrieren:

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\Register-RemoteJawsReconnectTask-FSAPI.ps1 -ActionMode Exe -DryRun
```

4) Liefer-ZIP lokal erzeugen:

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\Create-DeliveryZip.ps1 -PackageMode OneDir -IncludeExe Required
```

Damit ist garantiert, dass das gebaute OneDir-Bundle (`dist\RemoteJawsReconnect`) im ZIP enthalten ist.

### Verhalten bei bereits vorhandener Task

Über `-IfTaskExists` steuerbar:

- `Overwrite` (Default): vorhandene Task wird aktualisiert/überschrieben
- `Skip`: Registrierung wird ohne Fehler beendet, falls Task schon existiert
- `Fail`: Registrierung bricht mit Fehler ab, falls Task schon existiert

### Ohne sichtbares Fenster/Kommandozeile

- Build erfolgt mit PyInstaller `--noconsole` (siehe Build-Skript).
- Für stabilen Betrieb ohne _MEI-Löschwarnung wird `-BundleMode OneDir` empfohlen.
- Der Scheduled Task wird mit `Hidden=true` angelegt.

## Hinweis zu Python-Abhängigkeiten

- Primär wird `win32com.client` (pywin32) genutzt.
- Wenn `pywin32` fehlt, versucht das Skript automatisch einen Fallback über `powershell.exe` und `New-Object -ComObject freedomsci.jawsapi`.
