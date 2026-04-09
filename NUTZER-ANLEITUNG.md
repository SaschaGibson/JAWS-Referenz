# JAWS Reconnect Recovery – Nutzer-Anleitung

## Zweck
Dieses Tool startet JAWS nach RDP-Reconnect automatisch über die JAWS-eigene API neu.

## Was der Nutzer merkt
- Keine sichtbare Konsole (die EXE ist ohne Konsolenfenster gebaut).
- Im Fehlerfall keine UI-Meldung, stattdessen Logdatei.

## Logdatei
- `C:\ProgramData\Beta\RemoteJawsRecovery\restart-log.txt`

## Schnelltest (manuell)
In einer Eingabeaufforderung/PowerShell:

```powershell
"C:\ProgramData\Beta\RemoteJawsRecovery\RemoteJawsReconnect\RemoteJawsReconnect.exe" --force-local --cooldown-seconds 0 --delay-seconds 0
```

## Häufige Fragen
- **Warum passiert manchmal nichts?**
  - Cooldown aktiv
  - JAWS lief nicht
  - API-Aufruf fehlgeschlagen (siehe Log)

- **Wo sehe ich Details?**
  - Immer in `restart-log.txt`.
