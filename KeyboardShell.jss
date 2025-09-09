; Copyright (c) 2015 - 2016 elita group ltd.
; Scripts written by Serge Tumanyan

Include "HJConst.jsh"
Include "MSAAConst.jsh"
Include "UIA.jsh"
Include "Common.jsm"
Include "keyboardShell.jsm"

Const
	HKEY_KEYS_LISTVIEW = "LISTVIEW",
	CATEGORY_KEYS_LISTVIEW = 100,
	ListViewItemClassName = "ListViewItem",
	TextBlockClassName = "TextBlock"

Messages
@MSG_Behaviour0
%1 %2
@@
@MSG_Behaviour13
%1 <voice name="%2">%3</voice> %4
@@
@MSG_Behaviour13NoVoice
%1 %2 %3
@@
@MSG_ListViewTemplate
%1|%2|%3
@@
EndMessages

Globals
	Object goUIA

Int Function GetObjectCategory ()
Var
	Object oFocus = goUIA.GetFocusedElement ()

If IsVirtualPCCursor ()
	Return (FALSE)
EndIf
If oFocus.ClassName == ListViewItemClassName
	Return (CATEGORY_KEYS_LISTVIEW)
EndIf
Return (FALSE)
EndFunction

String Function ReadListViewSettings (String sName, Optional Int iVoice)
Var
	Handle hFocus = GetFocus (),
	String sSequence = ReadSettingString (section_CustomizeColumn_Options, HKEY_KEYS_LISTVIEW, cScNull, FT_CURRENT_JCF, rsStandardLayering, sName),
	String sItem,
	String sHeader,
	String sBehaviour,
	String sVoice,
	String sText,
	String sLine,
	Int i,
	Int iItem,
	Int iBehaviour

If StringIsBlank (sSequence)
	Return (GetObjectName (TRUE))
EndIf
sBehaviour = StringSegment (sSequence, cscListSeparator, 1)
For i = 1 To 3
	sItem = StringSegment (sSequence, cscListSeparator, i + 1)
	sText = StringSegment (sItem, cScColon, 2)
	iItem = StringToInt (sItem)
	If iItem > 0
		sItem = lvGetItemText (hFocus, -1, iItem)
		sHeader = lvGetColumnHeader (hFocus, iItem)
		sVoice = StringSegment (sBehaviour, cScColon, 2)
		iBehaviour = StringToInt (sBehaviour)
		If Not iBehaviour	; no headers
			sLine = FormatString (MSG_Behaviour0, sLine, sItem)
		ElIf iBehaviour == 1	; headers or text
			If Not StringIsBlank (sText)
				sHeader = sText
			EndIf
			If StringIsBlank (sVoice) || (! iVoice)
				sLine = FormatString (MSG_Behaviour13NoVoice, sLine, sHeader, sItem)
			Else
				sLine = FormatString (MSG_Behaviour13, sLine, sVoice, sHeader, sItem)
			EndIf
		ElIf iBehaviour == 2	; headers and text
			If Not StringIsBlank (sText)
				sHeader = FormatString (MSG_Behaviour0, sHeader, sText)
			EndIf
			If StringIsBlank (sVoice) || (! iVoice)
				sLine = FormatString (MSG_Behaviour13NoVoice, sLine, sHeader, sItem)
			Else
				sLine = FormatString (MSG_Behaviour13, sLine, sVoice, sHeader, sItem)
			EndIf
		ElIf iBehaviour == 3	; text
			If Not StringIsBlank (sText)
				If StringIsBlank (sVoice) || (! iVoice)
					sLine = FormatString (MSG_Behaviour13NoVoice, sLine, sText, sItem)
				Else
					sLine = FormatString (MSG_Behaviour13, sLine, sVoice, sText, sItem)
				EndIf
			Else
				sLine = FormatString (MSG_Behaviour0, sLine, sItem)
			EndIf
		EndIf
	EndIf
EndFor
Return (sLine)
EndFunction

Void Function AutoStartEvent ()
;AutoStartEvent ()
If Not goUIA
	goUIA = CreateObjectEx ("FreedomSci.UIA", FALSE, "UIAScriptAPI.x.manifest")
EndIf
EndFunction

Int Function IsTrueListView (Handle hWnd)
If GetObjectCategory () == CATEGORY_KEYS_LISTVIEW
	Return (TRUE)
EndIf

; Call default...
Return (IsTrueListView (hWnd))
EndFunction

Int Function lvGetNumOfColumns (Handle hWnd)
If GetObjectCategory () == CATEGORY_KEYS_LISTVIEW
	Return (3)
EndIf

; Call default...
Return (lvGetNumOfColumns (hWnd))
EndFunction

String Function lvGetItemText (Handle hWnd,Int nCurrent, Int nCol)
Var
	Object oCells = goUIA.GetFocusedElement ().FindAll (TreeScope_Descendants, goUIA.CreateStringPropertyCondition (UIA_ClassNamePropertyId, TextBlockClassName))

If GetObjectCategory () == CATEGORY_KEYS_LISTVIEW
	Return (oCells (nCol - 1).Name)
EndIf

; Call default...
Return (lvGetItemText (hWnd, nCurrent, nCol))
EndFunction

String Function lvGetColumnHeader (Handle hWnd, Int nCol)
Var
	Object oRow = goUIA.GetFocusedElement (),
	Object oWalker = goUIA.ContentViewWalker,
	Object oCells

If GetObjectCategory () == CATEGORY_KEYS_LISTVIEW
	oWalker.CurrentElement = oRow
	oWalker.GoToParent ()
	oRow = oWalker.CurrentElement
	oCells = oRow.FindAll (TreeScope_Descendants, goUIA.CreateStringPropertyCondition (UIA_ClassNamePropertyId, TextBlockClassName))
	Return (oCells (nCol - 1).Name)
EndIf

; Call default...
Return (lvGetColumnHeader (hWnd, nCol))
EndFunction

Void Function FocusChangedEventProcessAncestors (Handle hFocus, Handle hPrev)
If GetObjectCategory () == CATEGORY_KEYS_LISTVIEW
	If GetFocusChangeDepth()
		IndicateControlType (WT_LISTVIEW, StringSegment (GetObjectName (TRUE, 1), ".", 1), ReadListViewSettings ("KeyboardWPF.jcf,TRUE"))
		Say (PositionInGroup (), OT_POSITION)
	Else
		Say (ReadListViewSettings ("keyboardWPF.jcf", TRUE), OT_SELECTED_ITEM, TRUE)
	EndIf
	Return
EndIf

; Call default...
Return (FocusChangedEventProcessAncestors (hFocus, hPrev))
EndFunction

Int Function BrailleCallbackObjectIdentify()
If GetObjectCategory () == CATEGORY_KEYS_LISTVIEW
	Return (WT_LISTVIEW)
EndIf

; Call default...
Return (BrailleCallbackObjectIdentify ())
EndFunction

Int Function BrailleAddObjectName (int iType)
If iType == WT_LISTVIEW
	BrailleAddString (StringSegment (GetObjectName (TRUE, 1), cScPeriod,1), FALSE, FALSE, 0)
	Return (TRUE)
EndIf

; Call default...
Return (BrailleAddObjectName (iType))
EndFunction

Int Function BrailleAddObjectValue (int iType)
If iType == WT_LISTVIEW
	BrailleAddString (ReadListViewSettings ("keyboardWPF.jbs", FALSE), FALSE, FALSE, 0)
	Return (TRUE)
EndIf

; Call default...
Return (BrailleAddObjectValue (iType))
EndFunction

Void Function SayLine ()
If GetObjectCategory () == CATEGORY_KEYS_LISTVIEW
	Say (ReadListViewSettings ("keyboardWPF.jcf", TRUE), OT_LINE)
	Say (PositionInGroup (), OT_POSITION)
	Return
EndIf

; Call default...
Return (SayLine ())
EndFunction

Script ScriptFileName ()
ScriptAndAppNames (GetActiveConfiguration ())
EndScript

Script CustomizeListView()
Var
	Handle hFocus = GetFocus (),
	String sInfo,
	String sBraille,
	String sItems,
	Object oRow = goUIA.GetFocusedElement (),
	Object oWalker = goUIA.ContentViewWalker,
	Object oCells

If Not IsTrueListView(hFocus)
	SayMessage(OT_ERROR,cmsgNotInAListview_L,cmsgNotInAListview_S)
	Return
EndIf
If GetObjectCategory () == CATEGORY_KEYS_LISTVIEW
	oWalker.CurrentElement = oRow
	oWalker.GoToParent ()
	oRow = oWalker.CurrentElement
	oCells = oRow.FindAll (TreeScope_Descendants, goUIA.CreateStringPropertyCondition (UIA_ClassNamePropertyId, TextBlockClassName))
	sItems = FormatString (MSG_ListViewTemplate, oCells (0).Name, oCells (1).Name, oCells (2).Name)
DlgCustomizeColumns (sItems, HKEY_KEYS_LISTVIEW, MSG_CustomiseListView, sInfo, sBraille)
	Return
EndIf

; Call default...
PerformScript CustomizeListView ()
EndScript
