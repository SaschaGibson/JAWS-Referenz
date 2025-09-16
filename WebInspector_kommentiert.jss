; WebInspector.jss
; Stellt gebündelte Informationen über das aktuell fokussierte Webelement bereit.
; -----------------------------------------------------------------------------
; Skriptsprache: Englisch | Kommentare: Deutsch
; Ansatz: Direkter MSAA-Objektzugriff, um Compiler-Bugs im DOM-Handling zu umgehen.
; Ausgabe: Virtual Viewer (UserBuffer)
; -----------------------------------------------------------------------------
; Version: 11.0.0 (2025-09-12) - Finale Version mit korrekten MSAA-Datentypen
; Autor:   Projekt "JAWS: Webelemente"

Include "HjGlobal.jsh"
Include "HjConst.jsh"
Include "common.jsm"

ScriptFileVersion 2025
ScriptFile "Werkzeug zur Inspektion von Webelementen (MSAA-Modus)"

; =====================================================================
; Interne Hilfsfunktionen
; =====================================================================

; Fügt eine Zeile mit Titel und Wert zum UserBuffer hinzu, wenn der Wert nicht leer ist.
Void Function Inspector_AddInfo (string sTitle, string sValue)
    if !StringIsBlank(sValue) then
        UserBufferAddText ("- " + sTitle + ": " + sValue + cScBufferNewLine)
    endIf
EndFunction

; =====================================================================
; Hauptskript
; =====================================================================

; Sammelt MSAA-Informationen zum aktuellen Objekt und zeigt diese an.
Script Web_InspectCurrentElement ()
	; --- 1. ZUERST: Alle Variablen deklarieren ---
	var string msaaName
	var string msaaValue
	var int    msaaRoleCode     ; Variable für den numerischen Rollen-Code
	var string msaaRoleText     ; Variable für den lesbaren Rollen-Text
	var string msaaStateText    ; GetObjectState gibt direkt einen String zurück
	var string msaaDesc

	; --- 2. DANACH: Ausführbarer Code ---

	; Sicherheitsprüfung: Nur im virtuellen Modus ausführen
	if !IsVirtualPCCursor() then
		SayFormattedMessage(OT_ERROR, cmsgFeatureRequiresVirtualCursor_L, cmsgFeatureRequiresVirtualCursor_S)
		return
	endIf

	; --- Daten sammeln: MSAA-Informationen vom aktuellen Objekt ---
	msaaName = GetObjectName()
	msaaValue = GetObjectValue()
	msaaDesc = GetObjectDescription()
	
	; Holen des numerischen Codes für Rolle und Umwandlung in Text
	msaaRoleCode = GetObjectRole()
	msaaRoleText = GetRoleText(msaaRoleCode)
	
	; GetObjectState gibt direkt den fertigen Text zurück
	msaaStateText = GetObjectState()


	; --- Ausgabe im Virtual Viewer vorbereiten ---
	UserBufferClear()
	UserBufferAddText ("Web Element Inspector (MSAA-Modus)")
	UserBufferAddText (cScBufferNewLine + "================================" + cScBufferNewLine)

	Inspector_AddInfo("Name", msaaName)
	Inspector_AddInfo("Wert", msaaValue)
	Inspector_AddInfo("Rolle", msaaRoleText)
	Inspector_AddInfo("Status", msaaStateText)
	Inspector_AddInfo("Beschreibung", msaaDesc)

	; --- Viewer aktivieren und Fokus setzen ---
	UserBufferAddText (cScBufferNewLine + "================================" + cScBufferNewLine)
	UserBufferAddText (cmsgClose, "UserBufferDeactivate()", cmsgClose)
	UserBufferActivate ()
	JAWSTopOfFile ()
	SayLine ()

EndScript