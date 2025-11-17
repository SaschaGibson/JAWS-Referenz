; *******************************************************************
; * Optimiertes Logging-System für JAWS                            *
; * Erstellt und schreibt Log-Datei mit Fehlerprüfung              *
; *******************************************************************

include "HJConst.jsh"
include "HJGlobal.jsh"
include "Common.jsm"

globals
    string g_sLogFilePath,
    string g_sLastSpeechEntry,
    int g_bLoggingActive

; ------------------------------------------------------------
; Funktion: Startet das automatische Logging
; ------------------------------------------------------------
void Function LoggingOn()
    ; Pfad setzen – falls in den Referenzdateien ein vordefinierter Konstante existiert, diese verwenden!
    let g_sLogFilePath = "C:\\JAWS_Analyse\\speech_log.ini"
    EnsureLogFileExists() ; Prüft und erstellt Datei
    let g_bLoggingActive = 1
    LogDebug("Logging gestartet.")
    PeriodicLogging() ; Startet den ersten Logging-Durchlauf
EndFunction

; ------------------------------------------------------------
; Funktion: Stoppt das Logging
; ------------------------------------------------------------
void Function LoggingStop()
    let g_bLoggingActive = 0
    LogDebug("Logging gestoppt.")
EndFunction

; ------------------------------------------------------------
; Funktion: Holt NEUE gesprochene JAWS-Meldungen
; ------------------------------------------------------------
void Function LogSpeechHistory()
    if g_bLoggingActive == 0 then
        return ; Logging ist deaktiviert
    endif

    var string sSpeechHistory, string sTimestamp, int nResult
    let sSpeechHistory = GetSpeechHistory() ; Holt die letzten Sprachausgaben
    let sTimestamp = SysGetTime() ; Korrekte Funktion!

    if StringLength(sSpeechHistory) > 0 && sSpeechHistory != g_sLastSpeechEntry then
        ; Schreibe die neue Sprachausgabe in die Log-Datei und prüfe den Rückgabewert
        let nResult = IniWriteString(g_sLogFilePath, "SPEECH_HISTORY", sTimestamp, sSpeechHistory)
        if nResult != 0 then
            MessageBox("Fehler: IniWriteString in LogSpeechHistory schlug fehl mit Code " + nResult)
        endif
        let nResult = IniFlush(g_sLogFilePath) ; Sichert die Änderungen in der Datei
        if nResult != 0 then
            MessageBox("Fehler: IniFlush in LogSpeechHistory schlug fehl mit Code " + nResult)
        endif
        let g_sLastSpeechEntry = sSpeechHistory ; Speichert die letzte geloggte Meldung
    endif
EndFunction

; ------------------------------------------------------------
; Funktion: Prüft, ob die Log-Datei existiert, und erstellt sie falls nötig
; ------------------------------------------------------------
void Function EnsureLogFileExists()
    var string sTestRead, int nResult
    let sTestRead = IniReadString(g_sLogFilePath, "DEBUG", "Test", "") ; Korrekte Parameter!

    if StringLength(sTestRead) == 0 then
        ; Erstelle initialen Log-Eintrag und prüfe Rückgabewerte
        let nResult = IniWriteString(g_sLogFilePath, "DEBUG", "System", "Log gestartet.")
        if nResult != 0 then
            MessageBox("Fehler: IniWriteString in EnsureLogFileExists schlug fehl mit Code " + nResult)
        endif
        let nResult = IniFlush(g_sLogFilePath) ; Erzwingt das Schreiben der Datei
        if nResult != 0 then
            MessageBox("Fehler: IniFlush in EnsureLogFileExists schlug fehl mit Code " + nResult)
        endif
    endif
EndFunction

; ------------------------------------------------------------
; Funktion: Schreibt eine Debugging-Meldung in die Datei
; ------------------------------------------------------------
void Function LogDebug(string sDebugMessage)
    if g_bLoggingActive == 0 then
        return ; Logging ist deaktiviert
    endif

    var string sTimestamp, int nResult
    let sTimestamp = SysGetTime() ; Korrekte Funktion!
    let nResult = IniWriteString(g_sLogFilePath, "DEBUG", sTimestamp, sDebugMessage)
    if nResult != 0 then
        MessageBox("Fehler: IniWriteString in LogDebug schlug fehl mit Code " + nResult)
    endif
    let nResult = IniFlush(g_sLogFilePath) ; Sichert die Änderungen
    if nResult != 0 then
        MessageBox("Fehler: IniFlush in LogDebug schlug fehl mit Code " + nResult)
    endif
EndFunction

; ------------------------------------------------------------
; Funktion: Periodische Überwachung des Loggings
; (Ruht 5 Sekunden, dann prüft sie erneut – Intervall kann ggf. durch vordefinierte Konstante ersetzt werden)
; ------------------------------------------------------------
void Function PeriodicLogging()
    if g_bLoggingActive == 1 then
        LogSpeechHistory()
        ScheduleFunction("PeriodicLogging", 5) ; Ruft sich selbst wieder auf
    endif
EndFunction

; ------------------------------------------------------------
; Test-Skript: Startet und stoppt das Logging nach kurzer Zeit
; ------------------------------------------------------------
Script TestLogging()
    LoggingOn() ; Logging starten
    Pause() ; Wartezeit für Demonstration

    Pause() ; Simulation einer weiteren Wartezeit

    LoggingStop() ; Logging beenden
EndScript
