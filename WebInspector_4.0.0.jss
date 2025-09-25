; ScriptAssistant.jss
; Generiert fertige Code-Schnipsel für Aktionen auf dem aktuell fokussierten Element.
; -----------------------------------------------------------------------------
; Skriptsprache: Englisch | Kommentare: Deutsch
; Ansatz: Direkter Test der GetElementXML() Funktion.
; Ausgabe: Virtual Viewer (UserBuffer)
; -----------------------------------------------------------------------------
; Version: 4.0.1 (2025-10-01) - Korrigierte fsID-Prüfung
; Autor:   Projekt "JAWS: Webelemente"

Include "HjGlobal.jsh"
Include "HjConst.jsh"
Include "common.jsm"

ScriptFileVersion 2025
ScriptFile "JAWS Script-Assistent (GetElementXML Test)"

; =====================================================================
; Interne Hilfsfunktionen
; =====================================================================

; Fügt eine Zeile mit Code zum UserBuffer hinzu, sauber eingerückt.
Void Function Assistant_AddCodeLine (string sCode)
    UserBufferAddText ("    " + sCode + cScBufferNewLine)
EndFunction

; =====================================================================
; Hauptskript
; =====================================================================

; Analysiert das aktuelle Element mit GetElementXML() und generiert passende Code-Beispiele.
Script GenerateElementAction ()
	; --- 1. ZUERST: Alle Variablen deklarieren ---
	var object xmlDoc
	var object xmlNode
	var string elementXml
	var string fsIdHex
	var int    fsIdDec
	var string errorMessage

	; --- 2. DANACH: Ausführbarer Code ---
	
	if !IsVirtualPCCursor() then
		SayFormattedMessage(OT_ERROR, cmsgFeatureRequiresVirtualCursor_L, cmsgFeatureRequiresVirtualCursor_S)
		return
	endIf
	
	; --- Schritt A: XML des Elements am virtuellen Cursor direkt abrufen ---
	elementXml = GetElementXML (0)

	if StringIsBlank(elementXml) then
		Say("Konnte mit GetElementXML keinen XML-Code für das aktuelle Element abrufen.", OT_ERROR)
		return
	endif
	
	; --- Schritt B: fsID extrahieren ---
	xmlDoc = CreateObject("msxml2.DOMDocument.6.0")
	if !xmlDoc then
		Say("Konnte das MSXML-Objekt nicht erstellen.", OT_ERROR)
		return
	endif
	
	xmlDoc.loadXML(elementXml)
	if xmlDoc.parseError.errorCode != 0 then
		errorMessage = FormatString("Fehler beim Parsen des Element-XML: %1", xmlDoc.parseError.reason)
		Say(errorMessage, OT_ERROR)
		return
	endif

	xmlNode = xmlDoc.documentElement
	if xmlNode then
		fsIdHex = xmlNode.getAttribute("fsID")
		if !StringIsBlank(fsIdHex) then
			fsIdDec = HexToDec(fsIdHex)
		endif
	endif

	; --- Ausgabe vorbereiten ---
	UserBufferClear()
	UserBufferAddText ("Script-Assistent: Code-Vorschläge (via GetElementXML)")
	UserBufferAddText (cScBufferNewLine + "========================================" + cScBufferNewLine)

	; --- Logik zur Code-Generierung ---
	if fsIdDec != 0 then ; KORREKTUR: Prüfung auf ungleich Null
		UserBufferAddText ("Erfolg! fsID gefunden: " + fsIdHex + cScBufferNewLine)
		Assistant_AddCodeLine ("; HINWEIS: Die fsID ist dynamisch und nur für die aktuelle Seitenladung gültig!")
		Assistant_AddCodeLine ("; Element mit der fsID " + IntToString(fsIdDec) + " fokussieren:")
		Assistant_AddCodeLine ("PerformActionOnElementWithID (" + IntToString(fsIdDec) + ", Action_setFocus)")
		UserBufferAddText (cScBufferNewLine)
		Assistant_AddCodeLine ("; Standard-Aktion für fsID " + IntToString(fsIdDec) + " ausführen (z.B. Klick):")
		Assistant_AddCodeLine ("PerformActionOnElementWithID (" + IntToString(fsIdDec) + ", Action_doDefaultAction)")
	else
		UserBufferAddText ("Konnte keine dynamische fsID für dieses Element finden.")
		UserBufferAddText (cScBufferNewLine)
		UserBufferAddText ("XML des Elements:" + cScBufferNewLine)
		UserBufferAddText (elementXml)
	endif

	; --- Viewer aktivieren ---
	UserBufferAddText (cScBufferNewLine + "========================================" + cScBufferNewLine)
	UserBufferAddText (cmsgClose, "UserBufferDeactivate()", cmsgClose)
	UserBufferActivate ()
	JAWSTopOfFile ()
	SayLine ()

EndScript