; ==========================================================
; Modul: OBJECTEXPLORER_ARIA_BUTTONS_XML_DOM_INT_HANDLES.JSS
; DOM-Traversierung nur mit int-basierten Handles – typkorrekt
; ==========================================================

Include "hjconst.jsh"
Include "hjglobal.jsh"
Include "common.jsm"
; 23.09.2025
Use "UIA.jsb"

globals
string gControlList,
string gIndexList

; -------------------------------------------------
; Ausgabe im virtuellen Betrachter mit Titel
; -------------------------------------------------
Void Function BETA_ShowVirtualOutput(string title, string content)
EnsureNoUserBufferActive()
SayMessage(OT_USER_BUFFER, title + ":\n\n" + content)
EndFunction

; -------------------------------------------------
; Rekursive DOM-Suche mit int-Handles
; -------------------------------------------------
Void Function RecurseDomAndCollectButtons(int hNode, int index)
var
    string nodeInfo,
    string nodeType,
    string nodeText,
    int hChild

;Let nodeInfo = GetXMLDomNodeTypeAndText(hNode)

If StringContains(nodeInfo, ":") > 0 then
    Let nodeType = StringSegment(nodeInfo, ":", 1)
    Let nodeText = StringSegment(nodeInfo, ":", 2)

    If nodeType == "Button" then
        If StringLeft(nodeText, 44) == "Verlaufs-Doku Dokumentation hinzufügen für" then
            Let gControlList = gControlList + nodeText + ";"
            Let gIndexList = gIndexList + IntToString(index) + ";"
        Else
            If StringLeft(nodeText, 44) == "Aufgabe für Arzt Dokumentation hinzufügen für" then
                Let gControlList = gControlList + nodeText + ";"
                Let gIndexList = gIndexList + IntToString(index) + ";"
            EndIf
        EndIf
    EndIf
EndIf

Let hChild = GetXMLDomFirstChild(hNode)
While hChild != 0
    RecurseDomAndCollectButtons(hChild, index)
    Let hChild = GetXMLDomNextSibling(hChild)
EndWhile
EndFunction

; -------------------------------------------------
; Hauptskript: Startet Traversierung über GetElementXMLHandle()
; -------------------------------------------------
Script BETA_SelectSpecialAriaButton_XML_DOM_IntHandles ()
var
    int i,
    int role,
    int result,
    int hRootNode
var
    string prompt,
    string selectedEntry

Let i = 0
Let gControlList = ""
Let gIndexList = ""
Let prompt = "Wähle eine Schaltfläche zum Ausführen"

Let role = GetObjectRole(i)
While role != 0
    If role == 43 then ; ROLE_SYSTEM_PUSHBUTTON
        Let hRootNode = GetElementXMLHandle(i)
        If hRootNode != 0 then
            RecurseDomAndCollectButtons(hRootNode, i)
        EndIf
    EndIf
    Let i = i + 1
    Let role = GetObjectRole(i)
EndWhile

BETA_ShowVirtualOutput(prompt, gControlList)

Let result = DlgSelectControls(gControlList, 0, prompt, bt_LeftSingleClick, bt_LeftSingleClick)

If result > -1 then
    Let selectedEntry = StringSegment(gIndexList, ";", result)
    Let i = StringToInt(selectedEntry)
    ActivateObject(i)
    SayString("Button wurde ausgeführt.")
Else
    SayString("Keine Auswahl getroffen.")
EndIf
EndScript

; -------------------------------------------------
; DOM-Traversierung über Objektindex i = 0..n
; Ausgabe aller gefundenen XML-Elemente
; -------------------------------------------------
Script BETA_DumpElementXMLs ()
var
    int i,
    int role,
    string name,
    string xml,
    string output

Let i = 0
Let output = ""

Let role = GetObjectRole(i)
While role != 0
    Let name = GetObjectName(i)
    Let xml = GetElementXML(i)

    If xml != "" then
        Let output = output + "Objekt " + IntToString(i) + ": " + name + "\n" + xml + "\n\n"
    EndIf

    Let i = i + 1
    Let role = GetObjectRole(i)
EndWhile

;BETA_ShowVirtualOutput( output)
EndScript

Script Neue_Sonstige_Verlaufdoku ()
var string sId 

	MoveToPlaceMarkerN(4) ; Schalter "neue Verlaufdoku/erstellen"
	enterkey()
	Delay(8,True)
;	MoveToPlaceMarkerN(5) ; Sonstige TherapieDoku
;	Delay(8,True)
;	MoveToPlaceMarkerN(5) ; Sonstige TherapieDoku - nötig wegen Verhalten der Webseite
	MovetoAnyLink(s_bottom)
	Delay(8,True)
	Enterkey()
	Delay(8,True)
; 	MoveToPlaceMarkerN(8)  ; Radioschalter Therapie - geht so nicht 
let sId = "5b79765487f94e6286926194ad618950#d340f5dbca024c1e8a56923777a22ea3$VALUE$2"
PerformActionOnElementWithTagAndAttribute(Action_leftMouseClick, "LABEL", "for", sId)
EndScript

Script label_suchen ()
var string sId 

let sId = "5b79765487f94e6286926194ad618950#d340f5dbca024c1e8a56923777a22ea3$VALUE$2"
PerformActionOnElementWithTagAndAttribute(Action_SETFocus, "LABEL", "for", sId)
EndScript

Script Neue_Arzt_Aufgabe ()
	GotoLineNumber (31)
	enterkey()
	Delay(10,True)
	GotoLineNumber (55)
	Tabkey()
	SayObjectActiveItem()

EndScript

Script Abbrechen ()
If IsPcCursor() && !IsVirtualPcCursor()
	then PerformScript VirtualPCCursorToggle()
EndIf
MoveToPlaceMarkerN(5) ; Schalter "Abbrechen"
	enterkey()
	Delay(8,True)
EndScript

Script Fertig ()
	MoveToPlaceMarkerN(6) ; Schalter "Fertig"
	enterkey()
	Delay(8,True)
EndScript

; VerlaufsdokuAnalyse.jss
; Analysiert die Verlaufsdokumentation und fasst die Termine zusammen.
; -----------------------------------------------------------------------------
; Skriptsprache: Englisch | Kommentare: Deutsch
; Ansatz: UIA, um alle Termine zu finden und die Inhalte zu extrahieren.
; Ausgabe: Virtual Viewer (UserBuffer)
; -----------------------------------------------------------------------------
; Version: 1.3.0 (2025-09-23) - Syntax-Korrekturen (Variablen, log. Operator)
; Autor:   Projekt "JAWS: Webelemente"

;Include "HjGlobal.jsh"
;Include "HjConst.jsh"
;Include "common.jsm"
Include "uia.jsh"
Use "UIA.jsb"

ScriptFileVersion 2025
ScriptFile "Verlaufsdoku-Analyse"

; =====================================================================
; Interne Hilfsfunktionen
; =====================================================================

; Extrahiert den Text aus einem Unter-Element anhand seines Klassennamens.
string Function GetSubElementTextByClass(object parentElement, object conditionFactory, string className)
	var object element
	var object condition
	
	condition = conditionFactory.CreatePropertyCondition(UIA_ClassNamePropertyId, className)
	element = parentElement.FindFirst(TreeScope_Descendants, condition)
	
	if element then
		return element.Name
	endif
	
	return ""
EndFunction


; =====================================================================
; Hauptskript
; =====================================================================

; Analysiert die Verlaufsdokumentation und erstellt eine Zusammenfassung.
Script GenerateDokuSummary ()
	; --- 1. ZUERST: Alle Variablen deklarieren (gemäß Regel #8) ---
	var object oUIA
	var object oElement
	var object oConditionFactory
	var object oCondition
	var object oElements
	var int i
	var int count
	var string summary
	var string sBehandlung
	var string sOrt
	var string sTherapeut
	var string sPatient
	var string sDiagnose
	var string sFortschritt

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
	
	; --- Schritt A: Finde alle Termin-Einträge (Elemente mit role="listitem") ---
	oConditionFactory = oUIA.CreateConditionFactory()
	oCondition = oConditionFactory.CreatePropertyCondition(UIA_ControlTypePropertyId, UIA_ListItemControlTypeId)
	oElements = oUIA.GetRootElement().FindAll(TreeScope_Descendants, oCondition)

	if !oElements || oElements.length == 0 then
		Say("Konnte keine Termin-Einträge auf der Seite finden.", OT_ERROR)
		return
	endif

	; --- Schritt B: Gehe jeden Termin durch und baue die Zusammenfassung ---
	UserBufferClear()
	UserBufferAddText ("Zusammenfassung der Verlaufsdokumentation")
	UserBufferAddText (cScBufferNewLine + "========================================" + cScBufferNewLine)
	
	count = oElements.length
	For i = 0 to count - 1
		oElement = oElements.GetElement(i)
		
		; Extrahiere die Einzelinformationen aus dem Termin-Block
		sBehandlung = GetSubElementTextByClass(oElement, oConditionFactory, "_description")
		sOrt = GetSubElementTextByClass(oElement, oConditionFactory, "_location")
		sTherapeut = GetSubElementTextByClass(oElement, oConditionFactory, "_user")
		sPatient = GetSubElementTextByClass(oElement, oConditionFactory, "_patient")
		sDiagnose = GetSubElementTextByClass(oElement, oConditionFactory, "_diagnosis")
		sFortschritt = GetSubElementTextByClass(oElement, oConditionFactory, "_progress")

		; Baue den zusammenfassenden Satz
		summary = FormatString("Termin %1: %2 in %3 bei %4. Patient: %5, Diagnose: %6 (%7).", IntToString(i+1), sBehandlung, sOrt, sTherapeut, sPatient, sDiagnose, sFortschritt)
		
		UserBufferAddText(summary)
		UserBufferAddText(cScBufferNewLine)
	EndFor

	; --- Viewer aktivieren ---
	UserBufferAddText (cScBufferNewLine + "========================================" + cScBufferNewLine)
	UserBufferAddText (cmsgClose, "UserBufferDeactivate()", cmsgClose)
	UserBufferActivate ()
	JAWSTopOfFile ()
	SayLine ()

EndScript