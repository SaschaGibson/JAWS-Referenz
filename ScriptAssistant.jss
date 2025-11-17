; ScriptAssistant.jss 
; Generiert fertige Code-Schnipsel für Aktionen auf dem aktuell fokussierten Element.
; -----------------------------------------------------------------------------
; Skriptsprache: Englisch | Kommentare: Deutsch
; Ansatz: GetElementXML() mit robuster String-Manipulation zur fsID-Extraktion
;         und Fallback auf andere Attribute.
; Ausgabe: Virtual Viewer (UserBuffer)
; -----------------------------------------------------------------------------
; Version: 5.4.0 (2025-09-26) - Finale Version mit fsID und Fallbacks
; Autor:   Projekt "JAWS: Webelemente"

Include "HjGlobal.jsh"
Include "HjConst.jsh"
Include "common.jsm"

ScriptFileVersion 2025
ScriptFile "JAWS Script-Assistent (GetElementXML)"

; =====================================================================
; Interne Hilfsfunktionen
; =====================================================================

; Fügt eine Zeile mit Code zum UserBuffer hinzu, sauber eingerückt.
Void Function Assistant_AddCodeLine (string sCode)
    UserBufferAddText ("    " + sCode + cScBufferNewLine)
EndFunction

; Extrahiert den Wert eines bestimmten Attributs aus einem XML-String.
string Function Assistant_ExtractXMLAttribute (string xml, string attributeName)
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

; Analysiert das aktuelle Element mit GetElementXML() und generiert passende Code-Beispiele.
Script GenerateElementAction ()
	; --- 1. ZUERST: Alle Variablen deklarieren ---
	var string elementXml
	var string fsIdHex
	var int    fsIdDec
	var string tagName
	var string elementText
	var string elementName

	; --- 2. DANACH: Ausführbarer Code ---
	
	if !IsVirtualPCCursor() then
		SayFormattedMessage(OT_ERROR, cmsgFeatureRequiresVirtualCursor_L, cmsgFeatureRequiresVirtualCursor_S)
		return
	endIf
	
	elementXml = GetElementXML (0)

	if StringIsBlank(elementXml) then
		Say("Konnte mit GetElementXML keinen XML-Code für das aktuelle Element abrufen.", OT_ERROR)
		return
	endif
	
	; --- Schritt B: Alle relevanten Attribute extrahieren ---
	fsIdHex = Assistant_ExtractXMLAttribute(elementXml, "fsID")
	if !StringIsBlank(fsIdHex) then
		fsIdDec = HexToDec(fsIdHex)
	endif
	
	tagName = Assistant_ExtractXMLAttribute(elementXml, "fsTag")
	elementText = Assistant_ExtractXMLAttribute(elementXml, "fsText")
	elementName = Assistant_ExtractXMLAttribute(elementXml, "name")


	; --- Ausgabe vorbereiten ---
	UserBufferClear()
	UserBufferAddText ("Script-Assistent: Code-Vorschläge")
	UserBufferAddText (cScBufferNewLine + "========================================" + cScBufferNewLine)

	; --- Logik zur Code-Generierung ---
	if fsIdDec != 0 then
		UserBufferAddText ("Priorität 1: Aktion über fsID (stabilste Methode für diese Sitzung)" + cScBufferNewLine)
		Assistant_AddCodeLine ("; HINWEIS: Die fsID (" + fsIdHex + ") ist dynamisch!")
		Assistant_AddCodeLine ("PerformActionOnElementWithID (" + IntToString(fsIdDec) + ", Action_setFocus)")
		Assistant_AddCodeLine ("PerformActionOnElementWithID (" + IntToString(fsIdDec) + ", Action_doDefaultAction)")
	else
		UserBufferAddText ("Konnte keine dynamische fsID für dieses Element finden.")
	endif

	UserBufferAddText (cScBufferNewLine + "----------------------------------------" + cScBufferNewLine)
	UserBufferAddText ("Alternative Vorschläge (weniger stabil):" + cScBufferNewLine)

	if !StringIsBlank(elementName) then
		UserBufferAddText (cScBufferNewLine + "Vorschlag A: Aktion über Attribut 'name'" + cScBufferNewLine)
		Assistant_AddCodeLine ("PerformActionOnElementWithTagAndAttribute (Action_setFocus, \"" + tagName + "\", \"name\", \"" + elementName + "\", 1)")
		Assistant_AddCodeLine ("PerformActionOnElementWithTagAndAttribute (Action_doDefaultAction, \"" + tagName + "\", \"name\", \"" + elementName + "\", 1)")
	endif
	
	if !StringIsBlank(elementText) then
		UserBufferAddText (cScBufferNewLine + "Vorschlag B: Aktion über sichtbaren Text ('fsText')" + cScBufferNewLine)
		Assistant_AddCodeLine ("PerformActionOnElementWithTagAndAttribute (Action_setFocus, \"" + tagName + "\", \"fsText\", \"" + elementText + "\", 1)")
		Assistant_AddCodeLine ("PerformActionOnElementWithTagAndAttribute (Action_doDefaultAction, \"" + tagName + "\", \"fsText\", \"" + elementText + "\", 1)")
	endif

	if StringIsBlank(elementName) && StringIsBlank(elementText) then
		UserBufferAddText (cScBufferNewLine + "(Keine alternativen Attribute wie 'name' oder 'fsText' gefunden.)")
	endif

	; --- Kompletter XML-Code zur manuellen Prüfung ---
	UserBufferAddText (cScBufferNewLine + "----------------------------------------" + cScBufferNewLine)
	UserBufferAddText ("Kompletter XML-Code des Elements:" + cScBufferNewLine)
	UserBufferAddText (elementXml)


	; --- Viewer aktivieren ---
	UserBufferAddText (cScBufferNewLine + "========================================" + cScBufferNewLine)
	UserBufferAddText (cmsgClose, "UserBufferDeactivate()", cmsgClose)
	UserBufferActivate ()
	JAWSTopOfFile ()
	SayLine ()

EndScript