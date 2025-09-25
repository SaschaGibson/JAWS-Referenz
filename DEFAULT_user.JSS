
use "default.jsb"
use "bx.jsb"  ; 5

void function filler()
; Filler to make some JAWS versions compile this file successfully.
return
endFunction


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

; ScriptAssistant.jss
; Generiert fertige Code-Schnipsel für Aktionen auf dem aktuell fokussierten Element.
; -----------------------------------------------------------------------------
; Skriptsprache: Englisch | Kommentare: Deutsch
; Ansatz: Direkter Test der GetElementXML() Funktion.
; Ausgabe: Virtual Viewer (UserBuffer)
; -----------------------------------------------------------------------------
; Version: 4.0.1 (2025-10-01) - Korrigierte fsID-Prüfung
; Autor:   Projekt "JAWS: Webelemente"

;Include "HjGlobal.jsh"
;Include "HjConst.jsh"
;Include "common.jsm"

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

; BETA_Inspect.jss
; Ein kombiniertes Werkzeug zur Analyse von Webelementen und zur Generierung von Script-Code.
; -----------------------------------------------------------------------------
; Skriptsprache: Englisch | Kommentare: Deutsch
; Ansatz: Kombiniert MSAA, GetElementXML, GetElementDescription und Code-Generierung.
; Ausgabe: Virtual Viewer (UserBuffer)
; -----------------------------------------------------------------------------
; Version: 1.0.1 (2025-10-02) - Syntaxprüfung nach Regel #8
; Autor:   Projekt "JAWS: Webelemente"

;Include "HjGlobal.jsh"
;Include "HjConst.jsh"
;Include "common.jsm"

ScriptFileVersion 2025
ScriptFile "BETA Inspector und Assistent"

; =====================================================================
; Interne Hilfsfunktionen
; =====================================================================

; Fügt eine Zeile mit Titel und Wert zum UserBuffer hinzu.
Void Function Inspector_AddInfo (string sTitle, string sValue)
    if !StringIsBlank(sValue) then
        UserBufferAddText ("- " + sTitle + ": " + sValue + cScBufferNewLine)
    endif
EndFunction

; Fügt eine Zeile mit Code zum UserBuffer hinzu, sauber eingerückt.
Void Function Inspector_AddCodeLine (string sCode)
    UserBufferAddText ("    " + sCode + cScBufferNewLine)
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

; Sammelt alle Informationen und generiert Code-Vorschläge.
Script InspectAndAssist ()
	; --- 1. ZUERST: Alle Variablen deklarieren ---
	var string msaaName
	var string msaaValue
	var string msaaRoleText
	var string msaaStateText
	var string msaaDesc
	var int    msaaRoleCode
	var string elementXml
	var string htmlDescription
	var string fsIdHex
	var int    fsIdDec
	var string tagName
	var string elementName
	var string elementText

	; --- 2. DANACH: Ausführbarer Code ---

	if !IsVirtualPCCursor() then
		SayFormattedMessage(OT_ERROR, cmsgFeatureRequiresVirtualCursor_L, cmsgFeatureRequiresVirtualCursor_S)
		return
	endIf

	; --- Schritt A: Alle Daten sammeln ---
	msaaName = GetObjectName()
	msaaValue = GetObjectValue()
	msaaDesc = GetObjectDescription()
	msaaRoleCode = GetObjectRole()
	msaaRoleText = GetRoleText(msaaRoleCode)
	msaaStateText = GetObjectState()
	elementXml = GetElementXML (0)
	htmlDescription = GetElementDescription(0, 0)

	; --- Schritt B: fsID und andere Attribute aus XML extrahieren ---
	if !StringIsBlank(elementXml) then
		fsIdHex = Inspector_ExtractXMLAttribute(elementXml, "fsID")
		if !StringIsBlank(fsIdHex) then
			fsIdDec = HexToDec(fsIdHex)
		endif
		tagName = Inspector_ExtractXMLAttribute(elementXml, "fsTag")
		elementName = Inspector_ExtractXMLAttribute(elementXml, "name")
		elementText = Inspector_ExtractXMLAttribute(elementXml, "fsText")
	endif

	; --- Ausgabe vorbereiten ---
	UserBufferClear()
	UserBufferAddText ("BETA Inspector & Assistent")
	UserBufferAddText (cScBufferNewLine + "========================================" + cScBufferNewLine)

	; Abschnitt 1: Code-Vorschläge
	UserBufferAddText ("1. Code-Vorschläge" + cScBufferNewLine)
	if fsIdDec != 0 then
		Inspector_AddCodeLine ("; -- Aktion über fsID (stabilste Methode) --")
		Inspector_AddCodeLine ("PerformActionOnElementWithID (" + IntToString(fsIdDec) + ", Action_setFocus)")
		Inspector_AddCodeLine ("PerformActionOnElementWithID (" + IntToString(fsIdDec) + ", Action_doDefaultAction)")
	else
		UserBufferAddText ("(Keine fsID gefunden, keine primären Vorschläge verfügbar.)")
	endif

	if !StringIsBlank(elementName) then
		UserBufferAddText (cScBufferNewLine)
		Inspector_AddCodeLine ("; -- Alternative über 'name'-Attribut --")
		Inspector_AddCodeLine ("PerformActionOnElementWithTagAndAttribute (Action_setFocus, \"" + tagName + "\", \"name\", \"" + elementName + "\", 1)")
	endif
	
	if !StringIsBlank(elementText) then
		UserBufferAddText (cScBufferNewLine)
		Inspector_AddCodeLine ("; -- Alternative über sichtbaren Text --")
		Inspector_AddCodeLine ("PerformActionOnElementWithTagAndAttribute (Action_setFocus, \"" + tagName + "\", \"fsText\", \"" + elementText + "\", 1)")
	endif
	
	; Abschnitt 2: MSAA-Eigenschaften
	UserBufferAddText (cScBufferNewLine + "----------------------------------------" + cScBufferNewLine)
	UserBufferAddText ("2. MSAA-Eigenschaften" + cScBufferNewLine)
	Inspector_AddInfo("Name", msaaName)
	Inspector_AddInfo("Rolle", msaaRoleText)
	Inspector_AddInfo("Status", msaaStateText)

	; Abschnitt 3: HTML-Elementbeschreibung
	UserBufferAddText (cScBufferNewLine + "----------------------------------------" + cScBufferNewLine)
	UserBufferAddText ("3. HTML-Elementbeschreibung (via GetElementDescription)" + cScBufferNewLine)
	if !StringIsBlank(htmlDescription) then
		UserBufferAddText(htmlDescription)
	else
		UserBufferAddText ("(Keine HTML-Beschreibung verfügbar.)")
	endif
	
	; Abschnitt 4: Rohes XML
	UserBufferAddText (cScBufferNewLine + "----------------------------------------" + cScBufferNewLine)
	UserBufferAddText ("4. XML-Details (via GetElementXML)" + cScBufferNewLine)
	if !StringIsBlank(elementXml) then
		UserBufferAddText (elementXml)
	else
		UserBufferAddText ("(Keine XML-Informationen verfügbar.)")
	endif

	; --- Viewer aktivieren ---
	UserBufferAddText (cScBufferNewLine + "========================================" + cScBufferNewLine)
	UserBufferAddText (cmsgClose, "UserBufferDeactivate()", cmsgClose)
	UserBufferActivate ()
	JAWSTopOfFile ()
	SayLine ()

EndScript