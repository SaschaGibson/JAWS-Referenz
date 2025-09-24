; WebInspector.jss
; Stellt gebündelte MSAA-, XML- und HTML-Informationen über das aktuell fokussierte Webelement bereit.
; -----------------------------------------------------------------------------
; Skriptsprache: Englisch | Kommentare: Deutsch
; Ansatz: Kombiniert MSAA, GetElementXML() und GetElementDescription().
; Ausgabe: Virtual Viewer (UserBuffer)
; -----------------------------------------------------------------------------
; Version: 13.2.0 (2025-09-29) - Alle drei Analyse-Methoden integriert
; Autor:   Projekt "JAWS: Webelemente"

Include "HjGlobal.jsh"
Include "HjConst.jsh"
Include "common.jsm"

ScriptFileVersion 2025
ScriptFile "JAWS Web Inspector (MSAA, XML & HTML)"

; =====================================================================
; Interne Hilfsfunktionen
; =====================================================================

; Fügt eine Zeile mit Titel und Wert zum UserBuffer hinzu, wenn der Wert nicht leer ist.
Void Function Inspector_AddInfo (string sTitle, string sValue)
    if !StringIsBlank(sValue) then
        UserBufferAddText ("- " + sTitle + ": " + sValue + cScBufferNewLine)
    endif
EndFunction

; =====================================================================
; Hauptskript
; =====================================================================

; Sammelt MSAA-, XML- und HTML-Informationen zum aktuellen Objekt und zeigt diese an.
Script Web_InspectCurrentElement ()
	; --- 1. ZUERST: Alle Variablen deklarieren ---
	var string msaaName
	var string msaaValue
	var int    msaaRoleCode
	var string msaaRoleText
	var string msaaStateText
	var string msaaDesc
	var string elementXml
	var string htmlDescription

	; --- 2. DANACH: Ausführbarer Code ---

	if !IsVirtualPCCursor() then
		SayFormattedMessage(OT_ERROR, cmsgFeatureRequiresVirtualCursor_L, cmsgFeatureRequiresVirtualCursor_S)
		return
	endIf

	; --- Schritt A: MSAA-Informationen sammeln ---
	msaaName = GetObjectName()
	msaaValue = GetObjectValue()
	msaaDesc = GetObjectDescription()
	msaaRoleCode = GetObjectRole()
	msaaRoleText = GetRoleText(msaaRoleCode)
	msaaStateText = GetObjectState()

	; --- Schritt B: XML-Informationen sammeln ---
	elementXml = GetElementXML (0)

	; --- Schritt C: HTML-Beschreibung sammeln ---
	htmlDescription = GetElementDescription(0, 0)

	; --- Ausgabe vorbereiten ---
	UserBufferClear()
	UserBufferAddText ("JAWS Web Inspector")
	UserBufferAddText (cScBufferNewLine + "========================================" + cScBufferNewLine)

	; Abschnitt 1: MSAA-Eigenschaften
	UserBufferAddText ("1. MSAA-Eigenschaften" + cScBufferNewLine)
	Inspector_AddInfo("Name", msaaName)
	Inspector_AddInfo("Wert", msaaValue)
	Inspector_AddInfo("Rolle", msaaRoleText)
	Inspector_AddInfo("Status", msaaStateText)
	Inspector_AddInfo("Beschreibung", msaaDesc)

	; Abschnitt 2: XML-Details (interne JAWS-Sicht)
	UserBufferAddText (cScBufferNewLine + "----------------------------------------" + cScBufferNewLine)
	UserBufferAddText ("2. XML-Details (via GetElementXML)" + cScBufferNewLine)
	if !StringIsBlank(elementXml) then
		UserBufferAddText (elementXml)
	else
		UserBufferAddText ("(Keine XML-Informationen für dieses Element verfügbar.)")
	endif

	; Abschnitt 3: HTML-Elementbeschreibung
	UserBufferAddText (cScBufferNewLine + "----------------------------------------" + cScBufferNewLine)
	UserBufferAddText ("3. HTML-Elementbeschreibung (via GetElementDescription)" + cScBufferNewLine)
	if !StringIsBlank(htmlDescription) then
		UserBufferAddText(htmlDescription)
	else
		UserBufferAddText ("(Keine HTML-Beschreibung für dieses Element verfügbar.)")
	endif

	; --- Viewer aktivieren ---
	UserBufferAddText (cScBufferNewLine + "========================================" + cScBufferNewLine)
	UserBufferAddText (cmsgClose, "UserBufferDeactivate()", cmsgClose)
	UserBufferActivate ()
	JAWSTopOfFile ()
	SayLine ()

EndScript