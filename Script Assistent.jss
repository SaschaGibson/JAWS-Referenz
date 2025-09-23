; ScriptAssistant.jss
; Generiert fertige Code-Schnipsel für Aktionen auf dem aktuell fokussierten Element.
; -----------------------------------------------------------------------------
; Skriptsprache: Englisch | Kommentare: Deutsch
; Ansatz: UIA, um robuste Informationen zu sammeln und Code zu generieren.
; Ausgabe: Virtual Viewer (UserBuffer)
; -----------------------------------------------------------------------------
; Version: 1.1.0 (2025-09-19) - Korrekte Action-Konstanten verwendet
; Autor:   Projekt "JAWS: Webelemente"

Include "HjGlobal.jsh"
Include "HjConst.jsh"
Include "common.jsm"
Use "UIA.jsb"

ScriptFileVersion 2025
ScriptFile "JAWS Script-Assistent"

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

; Analysiert das aktuelle Element und generiert passende Code-Beispiele.
Script GenerateElementAction ()
	; --- 1. ZUERST: Alle Variablen deklarieren ---
	var object oUIA
	var object oElement
	var string automationId
	var string elementName
	var string controlType

	; --- 2. DANACH: Ausführbarer Code ---
	
	if !IsVirtualPCCursor() then
		SayFormattedMessage(OT_ERROR, cmsgFeatureRequiresVirtualCursor_L, cmsgFeatureRequiresVirtualCursor_S)
		return
	endIf
	
	oUIA = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest")
	if !oUIA then
		Say("Konnte das UIA-Objekt nicht erstellen.", OT_ERROR)
		return
	endif
	
	oElement = FSUIAGetFocusedElement (1)
	if !oElement then
		Say("Konnte kein fokussiertes UIA-Element finden.", OT_ERROR)
		return
	endif

	; --- Schritt C: Informationen für die Code-Generierung extrahieren ---
	automationId = oElement.AutomationId
	elementName = oElement.Name
	controlType = oElement.GetRuntimeId()

	; --- Ausgabe vorbereiten ---
	UserBufferClear()
	UserBufferAddText ("Script-Assistent: Code-Vorschläge")
	UserBufferAddText (cScBufferNewLine + "========================================" + cScBufferNewLine)

	; --- Logik zur Code-Generierung ---
	if !StringIsBlank(automationId) then
		UserBufferAddText ("Priorität 1: Aktion über AutomationID (stabilste Methode)" + cScBufferNewLine)
		Assistant_AddCodeLine ("; Element mit der ID '" + automationId + "' fokussieren:")
		Assistant_AddCodeLine ("PerformActionOnElementWithID (\"" + automationId + "\", Action_setFocus)")
		UserBufferAddText (cScBufferNewLine)
		Assistant_AddCodeLine ("; Standard-Aktion für ID '" + automationId + "' ausführen (z.B. Klick):")
		Assistant_AddCodeLine ("PerformActionOnElementWithID (\"" + automationId + "\", Action_doDefaultAction)")
	else
		UserBufferAddText ("Keine AutomationID gefunden. Alternative Vorschläge:" + cScBufferNewLine)
	endif

	if !StringIsBlank(elementName) then
		UserBufferAddText (cScBufferNewLine + "Priorität 2: Aktion über Tag-Namen und Attribut (weniger stabil)" + cScBufferNewLine)
		Assistant_AddCodeLine ("; Annahme: Tag-Name könnte '" + controlType + "' sein, Name ist '" + elementName + "'")
		Assistant_AddCodeLine ("; Element fokussieren:")
		Assistant_AddCodeLine ("PerformActionOnElementWithTagAndAttribute (\"" + controlType + "\", \"Name\", \"" + elementName + "\", Action_setFocus, 1)")
		UserBufferAddText (cScBufferNewLine)
		Assistant_AddCodeLine ("; Standard-Aktion ausführen (z.B. Klick):")
		Assistant_AddCodeLine ("PerformActionOnElementWithTagAndAttribute (\"" + controlType + "\", \"Name\", \"" + elementName + "\", Action_doDefaultAction, 1)")
	endif

	if StringIsBlank(automationId) && StringIsBlank(elementName) then
		UserBufferAddText ("Konnte keine eindeutigen Identifikatoren (ID oder Name) finden, um Code zu generieren.")
	endif

	; --- Viewer aktivieren ---
	UserBufferAddText (cScBufferNewLine + "========================================" + cScBufferNewLine)
	UserBufferAddText (cmsgClose, "UserBufferDeactivate()", cmsgClose)
	UserBufferActivate ()
	JAWSTopOfFile ()
	SayLine ()

EndScript