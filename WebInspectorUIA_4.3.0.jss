; WebInspectorUIA.jss
; Stellt gebündelte DOM/UIA-Informationen über das aktuell fokussierte Webelement bereit.
; -----------------------------------------------------------------------------
; Skriptsprache: Englisch | Kommentare: Deutsch
; Ansatz: Korrekte UIA-Initialisierung mit CreateObjectEx und Helferfunktionen.
; Ausgabe: Virtual Viewer (UserBuffer)
; -----------------------------------------------------------------------------
; Version: 4.3.0 (2025-09-18) - Übersetzung für ControlType hinzugefügt
; Autor:   Projekt "JAWS: Webelemente"

Include "HjGlobal.jsh"
Include "HjConst.jsh"
Include "common.jsm"
Use "UIA.jsb"

ScriptFileVersion 2025
ScriptFile "Werkzeug zur Inspektion von Webelementen (UIA-Modus)"

; =====================================================================
; Interne Hilfsfunktionen
; =====================================================================

; Fügt eine Zeile mit Titel und Wert zum UserBuffer hinzu, wenn der Wert nicht leer ist.
Void Function Inspector_AddInfo (string sTitle, string sValue)
    if !StringIsBlank(sValue) then
        UserBufferAddText ("- " + sTitle + ": " + sValue + cScBufferNewLine)
    endIf
EndFunction

; Wandelt einen numerischen UIA Control Type in einen lesbaren String um.
string Function GetUIAControlTypeString(int typeId)
	Select typeId
		case UIA_HyperlinkControlTypeId:
			return "Hyperlink"
		case UIA_ButtonControlTypeId:
			return "Schaltfläche"
		case UIA_EditControlTypeId:
			return "Eingabefeld"
		case UIA_DocumentControlTypeId:
			return "Dokument"
		case UIA_TextControlTypeId:
			return "Text"
		case UIA_TreeItemControlTypeId:
			return "Strukturansicht-Eintrag"
		default:
			return IntToString(typeId)
	endSelect
EndFunction

; =====================================================================
; Hauptskript
; =====================================================================

; Sammelt UIA-Informationen zum Element unter dem virtuellen Cursor
; und zeigt diese im Virtual Viewer an.
Script Web_InspectCurrentElement_UIA ()
	; --- 1. ZUERST: Alle Variablen deklarieren ---
	var object oUIA
	var object oElement
	var string controlTypeString

	; --- 2. DANACH: Ausführbarer Code ---
	
	; Sicherheitsprüfung
	if !IsVirtualPCCursor() then
		SayFormattedMessage(OT_ERROR, cmsgFeatureRequiresVirtualCursor_L, cmsgFeatureRequiresVirtualCursor_S)
		return
	endIf
	
	; --- Schritt A: UIA-Hauptobjekt korrekt mit CreateObjectEx und Manifest erstellen ---
	oUIA = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest")

	if !oUIA then
		Say("Konnte das UIA-Objekt mit CreateObjectEx nicht erstellen. Prüfen Sie die JAWS-Installation.", OT_ERROR)
		return
	endif
	
	; --- Schritt B: Das fokussierte Element mit der robusten Helferfunktion finden ---
	oElement = FSUIAGetFocusedElement (1)

	if !oElement then
		Say("Konnte kein fokussiertes UIA-Element finden.", OT_ERROR)
		return
	endif

	; --- Schritt C: Informationen aus dem UIA-Element extrahieren ---
	controlTypeString = GetUIAControlTypeString(oElement.ControlType)

	UserBufferClear()
	UserBufferAddText ("Web Element Inspector (UIA-Modus)")
	UserBufferAddText (cScBufferNewLine + "================================" + cScBufferNewLine)

	; Allgemeine Infos
	UserBufferAddText ("1. Allgemeine Infos" + cScBufferNewLine)
	Inspector_AddInfo("Name", oElement.Name)
	Inspector_AddInfo("Control Type", controlTypeString)
	Inspector_AddInfo("Class Name", oElement.ClassName)
	Inspector_AddInfo("Automation Id", oElement.AutomationId)
	UserBufferAddText (cScBufferNewLine)

	; XML-Code des Knotens
	UserBufferAddText ("2. Knoten XML" + cScBufferNewLine)
	UserBufferAddText (oElement.GetXML())
	UserBufferAddText (cScBufferNewLine)

	; --- Viewer aktivieren ---
	UserBufferAddText (cScBufferNewLine + "================================" + cScBufferNewLine)
	UserBufferAddText (cmsgClose, "UserBufferDeactivate()", cmsgClose)
	UserBufferActivate ()
	JAWSTopOfFile ()
	SayLine ()

EndScript