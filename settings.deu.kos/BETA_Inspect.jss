; KOS_mobil.jss
; Skripte zur verbesserten Zugänglichkeit der KOSmobil-Anwendung,
; insbesondere zur Umgehung von aria-hidden="true".
; -----------------------------------------------------------------------------
; Skriptsprache: Englisch | Kommentare: Deutsch
; Ansatz: UI Automation (UIA) mit TreeWalker, um alle Elemente zu erfassen.
; Ausgabe: Virtual Viewer (UserBuffer)
; -----------------------------------------------------------------------------
; Version: 1.4.0 (2025-09-26) - Korrektur gemäß Regel #7 (Handle-Prinzip)
; Autor:   Projekt "JAWS: Webelemente"

Include "HjGlobal.jsh"
Include "HjConst.jsh"
Include "common.jsm"
Use "UIA.jsb"

ScriptFileVersion 2025
ScriptFile "KOSmobil Anpassungen"

; =====================================================================
; Interne Hilfsfunktionen
; =====================================================================

; Rekursive Funktion, die den UIA-Baum durchläuft und Elemente sammelt.
Void Function WalkUIATree (object walker, object element, int level, string sDelimiter, string ByRef out_list)
	; --- 1. ZUERST: Alle Variablen deklarieren ---
	var string indent
	var string currentLine
	var object child
	var int i

	; --- 2. DANACH: Ausführbarer Code ---
	
	; Endlosschleife verhindern
	if level > 50 then
		return
	endif

	; Einrückung erstellen
	indent = ""
	For i = 1 to level * 2
		indent = indent + " "
	EndFor
	
	; Sichere String-Formatierung gemäß Regel #9
	currentLine = FormatString("%1%2: %3", indent, IntToString(element.ControlType), element.Name)
	out_list = out_list + currentLine + sDelimiter

	; Kind-Elemente durchlaufen
	child = walker.GetFirstChildElement(element)
	while child
		WalkUIATree(walker, child, level + 1, sDelimiter, out_list)
		child = walker.GetNextSiblingElement(child)
	endwhile
EndFunction


; =====================================================================
; Hauptskript
; =====================================================================

; Listet alle UIA-Elemente des aktuellen Dokuments auf, auch die mit aria-hidden="true".
Script ListAllUIADocElements ()
	; --- 1. ZUERST: Alle Variablen deklarieren ---
	var int oUIA ; KORREKTUR: Muss ein int-Handle sein!
	var object rootElement
	var object walker
	var string elementList
	var string sDelimiter

	; --- 2. DANACH: Ausführbarer Code ---
	
	if !IsVirtualPCCursor() then
		SayFormattedMessage(OT_ERROR, cmsgFeatureRequiresVirtualCursor_L, cmsgFeatureRequiresVirtualCursor_S)
		return
	endIf
	
	oUIA = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest")
	if oUIA == 0 then
		Say("Konnte das UIA-Objekt nicht erstellen.", OT_ERROR)
		return
	endif
	
	; Das Wurzelelement des aktuellen Dokuments holen
	rootElement = FSUIAGetDocumentElement(oUIA)
	if !rootElement then
		Say("Konnte das UIA-Wurzelelement des Dokuments nicht finden.", OT_ERROR)
		return
	endif

	; --- Den UIA-Baum durchlaufen ---
	walker = oUIA.CreateTreeWalker()
	if walker then
		sDelimiter = "|"
		elementList = ""
		WalkUIATree(walker, rootElement, 0, sDelimiter, elementList)
	endif

	; --- Ausgabe vorbereiten und anzeigen ---
	if !StringIsBlank(elementList) then
		UserBufferClear()
		UserBufferAddText ("Vollständige UIA-Elementliste (inkl. aria-hidden)")
		UserBufferAddText (cScBufferNewLine + "========================================" + cScBufferNewLine)
		
		UserBufferAddText(StringReplaceSubstrings(elementList, sDelimiter, cScBufferNewLine))

		UserBufferAddText (cScBufferNewLine + "========================================" + cScBufferNewLine)
		UserBufferAddText (cmsgClose, "UserBufferDeactivate()", cmsgClose)
		UserBufferActivate ()
		JAWSTopOfFile ()
		SayLine ()
	else
		Say("Konnte keine UIA-Elemente zum Auflisten finden.", OT_ERROR)
	endif
EndScript