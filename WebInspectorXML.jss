; WebInspectorXML.jss
; Stellt gebündelte XML/DOM-Informationen über das aktuell fokussierte Webelement bereit.
; -----------------------------------------------------------------------------
; Skriptsprache: Englisch | Kommentare: Deutsch
; Ansatz: Reiner GetScreenXML() + MSXML COM Object Ansatz.
; Ausgabe: Virtual Viewer (UserBuffer)
; -----------------------------------------------------------------------------
; Version: 2.1.0 (2025-09-17) - Sichere String-Formatierung für Attribute
; Autor:   Projekt "JAWS: Webelemente"

Include "HjGlobal.jsh"
Include "HjConst.jsh"
Include "common.jsm"

ScriptFileVersion 2025
ScriptFile "Werkzeug zur Inspektion von Webelementen (Reiner XML/DOM-Modus)"

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

; Sammelt XML/DOM-Informationen zum Element unter dem virtuellen Cursor
; und zeigt diese im Virtual Viewer an.
Script Web_InspectCurrentElement_XML ()
	; --- 1. ZUERST: Alle Variablen deklarieren ---
	var object xmlDoc
	var object focusedNode
	var object attributes
	var object attr
	var string screenXml
	var string xPathQuery
	var string errorMessage
	var string attrValueString ; Neue Variable für sichere String-Formatierung
	var int i
	var int attrCount

	; --- 2. DANACH: Ausführbarer Code ---

	; Sicherheitsprüfung
	if !IsVirtualPCCursor() then
		SayFormattedMessage(OT_ERROR, cmsgFeatureRequiresVirtualCursor_L, cmsgFeatureRequiresVirtualCursor_S)
		return
	endIf

	; --- Schritt A: Gesamten Bildschirminhalt als XML-String abrufen ---
	screenXml = GetScreenXML ()
	if StringIsBlank(screenXml) then
		Say("Konnte keinen XML-Code vom Bildschirm abrufen.", OT_ERROR)
		return
	endif

	; --- Schritt B: Microsoft XML DOM-Objekt erstellen und XML laden ---
	xmlDoc = CreateObject("msxml2.DOMDocument.6.0")
	if !xmlDoc then
		Say("Konnte das MSXML-Objekt nicht erstellen. Ist es auf dem System installiert?", OT_ERROR)
		return
	endif
	
	xmlDoc.loadXML(screenXml)
	
	; Prüfen, ob das Laden erfolgreich war
	if xmlDoc.parseError.errorCode != 0 then
		errorMessage = FormatString("Fehler beim Parsen des XML: %1", xmlDoc.parseError.reason)
		Say(errorMessage, OT_ERROR)
		return
	endif

	; --- Schritt C: Knoten mit virtuellem Fokus direkt im XML finden ---
	xPathQuery = "//*[@hasVirtualFocus='true']"
	focusedNode = xmlDoc.selectSingleNode(xPathQuery)

	if !focusedNode then
		Say("Konnte keinen Knoten mit virtuellem Fokus im XML-Dokument finden.", OT_ERROR)
		return
	endif

	; --- Schritt D: Informationen aus dem gefundenen Knoten extrahieren ---
	attributes = focusedNode.attributes
	attrCount = attributes.length

	; --- Ausgabe vorbereiten ---
	UserBufferClear()
	UserBufferAddText ("Web Element Inspector (Reiner XML/DOM-Modus)")
	UserBufferAddText (cScBufferNewLine + "================================" + cScBufferNewLine)

	; Allgemeine Infos
	UserBufferAddText ("1. Allgemeine Infos" + cScBufferNewLine)
	Inspector_AddInfo("Tag-Name", focusedNode.nodeName)
	Inspector_AddInfo("Sichtbarer Text", focusedNode.text)
	UserBufferAddText (cScBufferNewLine)

	; Attribute
	UserBufferAddText ("2. Attribute (" + IntToString(attrCount) + ")" + cScBufferNewLine)
	if attrCount > 0 then
		For i = 0 to attrCount - 1
			attr = attributes.item(i)
			if attr then
				; --- Korrektur gemäß Regel #9 ---
				attrValueString = FormatString("'%1'", attr.nodeValue)
				Inspector_AddInfo(attr.nodeName, attrValueString)
			endIf
		EndFor
	else
		UserBufferAddText("- (keine)" + cScBufferNewLine)
	endIf
	UserBufferAddText (cScBufferNewLine)

	; XML-Code des Knotens
	UserBufferAddText ("3. Knoten XML" + cScBufferNewLine)
	UserBufferAddText (focusedNode.xml)
	UserBufferAddText (cScBufferNewLine)


	; --- Viewer aktivieren ---
	UserBufferAddText (cScBufferNewLine + "================================" + cScBufferNewLine)
	UserBufferAddText (cmsgClose, "UserBufferDeactivate()", cmsgClose)
	UserBufferActivate ()
	JAWSTopOfFile ()
	SayLine ()

EndScript