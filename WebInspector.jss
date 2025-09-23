; WebInspector.jss
; Stellt gebündelte MSAA- und XML-Informationen über das aktuell fokussierte Webelement bereit.
; -----------------------------------------------------------------------------
; Skriptsprache: Englisch | Kommentare: Deutsch
; Ansatz: Kombiniert den stabilen MSAA-Ansatz mit der GetElementXML()-Methode.
; Ausgabe: Virtual Viewer (UserBuffer)
; -----------------------------------------------------------------------------
; Version: 12.0.0 (2025-09-26) - Zusammenführung von MSAA und XML-Inspektion
; Autor:   Projekt "JAWS: Webelemente"

Include "HjGlobal.jsh"
Include "HjConst.jsh"
Include "common.jsm"

ScriptFileVersion 2025
ScriptFile "JAWS Web Inspector (MSAA & XML)"

; =====================================================================
; Interne Hilfsfunktionen
; =====================================================================

; Fügt eine Zeile mit Titel und Wert zum UserBuffer hinzu, wenn der Wert nicht leer ist.
Void Function Inspector_AddInfo (string sTitle, string sValue)
    if !StringIsBlank(sValue) then
        UserBufferAddText ("- " + sTitle + ": " + sValue + cScBufferNewLine)
    endIf
EndFunction

; Extrahiert den Wert eines bestimmten Attributs aus einem XML-String.
string Function Inspector_ExtractXMLAttribute (string xml, string attributeName)
	var int startPos
	var int endPos
	var string tempString
	var string result
	
	startPos = StringContains(xml, " " + attributeName + "=\"")
	if startPos > 0 then
		tempString = Substring(xml, startPos + StringLength(attributeName) + 3, StringLength(xml))
		endPos = StringContains(tempString, "\"")
		if endPos > 1 then
			result = Substring(tempString, 1, endPos - 1)
		endif
	endif
	return result
EndFunction

; =====================================================================
; Hauptskript
; =====================================================================

; Sammelt MSAA- und XML-Informationen zum aktuellen Objekt und zeigt diese an.
Script Web_InspectCurrentElement ()
	; --- 1. ZUERST: Alle Variablen deklarieren ---
	var string msaaName
	var string msaaValue
	var int    msaaRoleCode
	var string msaaRoleText
	var string msaaStateText
	var string msaaDesc
	var string elementXml

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

	; Abschnitt 2: XML-Details
	if !StringIsBlank(elementXml) then
		UserBufferAddText (cScBufferNewLine + "----------------------------------------" + cScBufferNewLine)
		UserBufferAddText ("2. XML-Details" + cScBufferNewLine)
		Inspector_AddInfo("Tag", Inspector_ExtractXMLAttribute(elementXml, "fsTag"))
		Inspector_AddInfo("Text", "'" + Inspector_ExtractXMLAttribute(elementXml, "fsText") + "'")
		Inspector_AddInfo("Typ", Inspector_ExtractXMLAttribute(elementXml, "type"))
		Inspector_AddInfo("Name-Attribut", Inspector_ExtractXMLAttribute(elementXml, "name"))
		Inspector_AddInfo("Fokussierbar", Inspector_ExtractXMLAttribute(elementXml, "fsFocusable"))
		UserBufferAddText (cScBufferNewLine)
		UserBufferAddText ("Kompletter XML-Code:" + cScBufferNewLine)
		UserBufferAddText (elementXml)
	else
		UserBufferAddText (cScBufferNewLine + "(Keine XML-Informationen für dieses Element verfügbar.)")
	endif

	; --- Viewer aktivieren ---
	UserBufferAddText (cScBufferNewLine + "========================================" + cScBufferNewLine)
	UserBufferAddText (cmsgClose, "UserBufferDeactivate()", cmsgClose)
	UserBufferActivate ()
	JAWSTopOfFile ()
	SayLine ()
EndScript