; ElPhone script file

Include "HJConst.jsh"
Include "UIA.jsh"
Include "MSAAConst.jsh"
Include "Common.jsm"
Include "elPhone.jsm"

Const
	TextBlockClassName = "TextBlock",
	cgiVersion = 1
	
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
@MSG_AddDotAndExtension
%1.%2
@@
@MSG_AddExtension
%1%2
@@
EndMessages

Globals
	Object goUIA,
	Object goMainWindow,
	Object goFocus,
	Int giItemStateFirst,
	Int giLink,
	Int PreviousTreeviewLevel,
	String gsTVPrevPositionInGroup

Script ScriptFileName ()
ScriptAndAppNames (GetActiveConfiguration ())
EndScript

Void Function AutoStartEvent ()
If Not goUIA
	goUIA = CreateObjectEx ("FreedomSci.UIA", FALSE, "UIAScriptAPI.x.manifest")
EndIf
goMainWindow = goUIA.GetElementFromHandle (GetAppMainWindow (GetFocus ()))
giItemStateFirst = ReadSettingInteger (Section_Options, hKey_SaySelectedFirst, 1, FT_CURRENT_JCF, rsStandardLayering)

EndFunction

Void Function AutoFinishEvent ()
ComRelease (goMainWindow, TRUE)
EndFunction

String Function SelectConfigurationFile (string sExtension)
If Not StringCompare (StringLeft (sExtension, 1), ".")
	Return (FormatString (MSG_AddExtension, GetActiveConfiguration (), sExtension))
Else
	Return (FormatString (MSG_AddDotAndExtension, GetActiveConfiguration (), sExtension))
EndIf
EndFunction

String Function lvGetCRC (Handle hWnd)
Var
		Object oWalker = goUIA.ContentViewWalker

oWalker.CurrentElement = goUIA.GetFocusedElement ()
oWalker.GoToParent ()
Return (oWalker.CurrentElement.AutomationId)
EndFunction

String Function ReadListViewSettings (String sName, Optional Int iVoice)
Var
	Handle hFocus = GetFocus (),
	String sSequence = ReadSettingString (section_CustomizeColumn_Options, lvGetCRC (hFocus), cScNull, FT_CURRENT_JCF, rsStandardLayering, sName),
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

Int Function IsTrueListView (Handle hWnd)
var
	Object oFocus = goUIA.GetFocusedElement ()

If oFocus.ControlType == UIA_DataItemControlTypeId
	Return (TRUE)
EndIf

; Call default...
Return (IsTrueListView (hWnd))
EndFunction

Int Function lvGetNumOfColumns (Handle hWnd)
var
	Object oFocus = goUIA.GetFocusedElement ()

If oFocus.ControlType == UIA_DataItemControlTypeId
Var
	Object oGridItemPattern = oFocus.FindFirst (TreeScope_Children, goUIA.CreateStringPropertyCondition(UIA_ClassNamePropertyId, "TextBlock")).GetGridItemPattern (),
	Object oGridPattern = oGridItemPattern.ContainingGrid.GetGridPattern ()

	Return (oGridPattern.ColumnCount)
EndIf

; Call default...
Return (lvGetNumOfColumns (hWnd))
EndFunction

String Function lvGetItemText (Handle hWnd, Int nCurrent, Int nCol)
Var
	Object oFocus = goUIA.GetFocusedElement ()

If oFocus.ControlType == UIA_DataItemControlTypeId
Var
	Object oGridItemPattern = oFocus.FindFirst (TreeScope_Children, goUIA.CreateStringPropertyCondition(UIA_ClassNamePropertyId, "TextBlock")).GetGridItemPattern (),
	Object oGridPattern = oGridItemPattern.ContainingGrid.GetGridPattern (),
	Object oCells

	If nCurrent > 0
		Return (oGridPattern.GetItem (nCurrent - 1, nCol - 1).Name)
	Else
		oCells = oFocus.FindAll (TreeScope_Children, goUIA.CreateStringPropertyCondition(UIA_ClassNamePropertyId, "TextBlock"))
		Return (oCells (nCol - 1).Name)
	EndIf
EndIf

; Call default...
Return (lvGetItemText (hWnd, nCurrent, nCol))
EndFunction

Int Function lvGetFocusItem (Handle hWnd)
var
	Object oFocus = goUIA.GetFocusedElement ()

If oFocus.ControlType == UIA_DataItemControlTypeId
Var
	Object oGridItemPattern = oFocus.FindFirst (TreeScope_Children, goUIA.CreateStringPropertyCondition(UIA_ClassNamePropertyId, "TextBlock")).GetGridItemPattern ()

	Return (oGridItemPattern.Row + 1)
EndIf

; Call default...
Return (lvGetFocusItem (hWnd))
EndFunction

String Function lvGetColumnHeader (Handle hWnd, Int nCol)
Var
	Object oFocus = goUIA.GetFocusedElement ()

If oFocus.ControlType == UIA_DataItemControlTypeId
Var
	Object oGridItemPattern = oFocus.FindFirst (TreeScope_Children, goUIA.CreateStringPropertyCondition(UIA_ClassNamePropertyId, "TextBlock")).GetGridItemPattern (),
	Object oGrid = oGridItemPattern.ContainingGrid,
	Object oCells = oGrid.FindAll (TreeScope_Descendants, goUIA.CreateStringPropertyCondition(UIA_ClassNamePropertyId, "GridViewColumnHeader"))

	Return (oCells (nCol - 1).Name)
EndIf

; Call default...
Return (lvGetColumnHeader (hWnd, nCol))
EndFunction

String Function PositionInGroup (Optional Handle hWnd)
Var
	Object oFocus = goUIA.GetFocusedElement ()

If oFocus.ControlType == UIA_DataItemControlTypeId
Var
	Object oGridItemPattern = oFocus.FindFirst (TreeScope_Children, goUIA.CreateStringPropertyCondition(UIA_ClassNamePropertyId, "TextBlock")).GetGridItemPattern (),
	Object oWalker = goUIA.ContentViewWalker

	oWalker.CurrentElement = oFocus
	oWalker.GoToParent ()
	If oGridItemPattern
		Return (FormatString (cmsgPosInGroup1, oGridItemPattern.Row + 1, oWalker.CurrentElement.GetPropertyValue(UIA_GridRowCountPropertyId)))
	EndIf
EndIf

; Call default
Return (PositionInGroup (hWnd))
EndFunction

Int Function BrailleCallbackObjectIdentify ()
If IsTrueListView (GetFocus ())
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
	BrailleAddString (ReadListViewSettings (SelectConfigurationFile (".jbs"), FALSE), FALSE, FALSE, 0)
	Return (TRUE)
EndIf

; Call default... 
Return (BrailleAddObjectValue (iType))
EndFunction

Int Function BrailleAddObjectPosition (int iType)
If iType == WT_LISTVIEW
	BrailleAddString (PositionInGroup (), FALSE, FALSE, 0)
	Return (TRUE)
EndIf

; Call default...
Return (BrailleAddObjectPosition (iType))
EndFunction


Int Function BrailleAddObjectDescription (Int iType)
Var
	Handle hReal = GetRealWindow (GetFocus ()),
	Object oReal = goUIA.GetElementFromHandle (hReal),
	Object oStatic

If oReal.AutomationId == "MBWin"
	oStatic = oReal.FindFirst (TreeScope_Descendants, goUIA.CreateStringPropertyCondition (UIA_AutomationIdPropertyId, "TextTB"))
	If oStatic
		BrailleAddString(oStatic.Name,0,0,0)
		Return true
	EndIf
EndIf

; Call default...
Return (BrailleAddObjectDescription (iType))
EndFunction

Void Function FocusChangedEvent (Handle FocusWindow, Handle PrevWindow)
Var
	Object oReal = goUIA.GetElementFromHandle (FocusWindow),
	Object oStatic

If FocusWindow != PrevWindow
&& oReal.AutomationId == "MBWin"
	Say (GetWindowName (FocusWindow), OT_DIALOG_NAME)
	oStatic = oReal.FindFirst (TreeScope_Descendants, goUIA.CreateStringPropertyCondition (UIA_AutomationIdPropertyId, "TextTB"))
	If oStatic
		Say (oStatic.Name, OT_DIALOG_TEXT)
		SayObjectTypeAndText ()


		Return
	EndIf
EndIf

; Call default...
Return (FocusChangedEvent (FocusWindow, PrevWindow))
EndFunction

Void Function FocusChangedEventProcessAncestors (Handle hFocus, Handle hPrev)

goFocus = goUIA.GetFocusedElement ()
If IsTrueListView(GetFocus ())
	If GetFocusChangeDepth()
		IndicateControlType (WT_LISTVIEW, GetObjectName (TRUE, 1), ReadListViewSettings (SelectConfigurationFile (jcfFileExt),TRUE))
		Say (PositionInGroup (), OT_POSITION)
	Else
		Say (ReadListViewSettings (SelectConfigurationFile (jcfFileExt), TRUE), OT_SELECTED_ITEM, TRUE)
	EndIf
	Return
EndIf

If goFocus.AutomationId == "MyRTB"
	If Not giLink
		SayObjectTypeAndText (0)
		AnnounceDocumentElements()
	EndIf
	LoadKeymapSection ("Quick Navigation")
	giLink = FALSE
	Return
Else
	UnloadKeymapSection ("Quick Navigation")
	If GetObjectSubTypeCode (TRUE) == WT_LINK giLink = TRUE EndIf
EndIf

; Call default...
Return (FocusChangedEventProcessAncestors (hFocus, hPrev))
EndFunction

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
Else
	oWalker.CurrentElement = oRow
	oWalker.GoToParent ()
	oRow = oWalker.CurrentElement
	oCells = oRow.FindAll (TreeScope_Descendants, goUIA.CreateStringPropertyCondition (UIA_ClassNamePropertyId, TextBlockClassName))
	sItems = FormatString (MSG_ListViewTemplate, oCells (0).Name, oCells (1).Name, oCells (2).Name)
DlgCustomizeColumns (sItems, lvGetCRC (hFocus), MSG_CustomiseListView, sInfo, sBraille)
	Return
EndIf

; Call default...
PerformScript CustomizeListView ()
EndScript

Void Function IsVirtualPCCursor ()
If goFocus.AutomationId == "MyRTB"
|| goFocus.ClassName == "Hyperlink"
	Return (TRUE)
EndIf

Return (IsVirtualPCCursor ())
EndFunction

Int Function GetHeadingCount (Int iLevel)
If goFocus.AutomationId == "MyRTB"
	Return (StringToInt (StringSegment (goFocus.HelpText, cScColon, 2)))
EndIf

; Call default....
GetHeadingCount (iLevel)
EndFunction

Int Function GetLinkCount ()
If goFocus.AutomationId == "MyRTB"
	Return (StringToInt (StringSegment (goFocus.HelpText, cScColon, 3)))
EndIf

; Call default....
Return (GetLinkCount())
EndFunction

Int Function MoveToHeading (Int iDirection, Int nLevel)
Var
	Object oText = goFocus.GetTextPattern (),
	Object oLine = oText.GetSelection (0),
	Object oStop = oText.DocumentRange.Clone (),
	Int iSize,
	Int i

If goFocus.AutomationId == "MyRTB"
	oLine.ExpandToEnclosingUnit (TextUnit_Paragraph)
	If iDirection == s_Next
		oStop.MoveEndpointByRange (TextPatternRangeEndpoint_Start, oStop, TextPatternRangeEndpoint_End)
		iDirection = 1
	ElIf iDirection == s_Prior
		oStop.MoveEndpointByRange (TextPatternRangeEndpoint_End, oStop, TextPatternRangeEndpoint_Start)
		iDirection = -1
	EndIf
	oStop.ExpandToEnclosingUnit (TextUnit_Paragraph)
	For i = 1 to 2
		While Not oLine.Compare (oStop)
			If Not oLine.CompareEndPoints(TextPatternRangeEndpoint_Start, oLine, TextPatternRangeEndpoint_End)
				oLine.ExpandToEnclosingUnit (TextUnit_Paragraph)
			Else
				oLine.Move (TextUnit_Paragraph, iDirection)
			EndIf
			iSize = oLine.GetAttributeValue (UIA_FontSizeAttributeId)
			If iSize != 9
				oLine.ScrollIntoView (TRUE)
				oLine.MoveEndpointByRange (TextPatternRangeEndpoint_End, oLine, TextPatternRangeEndpoint_Start); 
				oLine.Select ()
				Return (TRUE)
			EndIf
		EndWhile
		oLine = oText.DocumentRange.Clone ()
		If iDirection == 1
			oLine.MoveEndpointByRange (TextPatternRangeEndpoint_End, oLine, TextPatternRangeEndpoint_Start)
		ElIf iDirection == -1
			oLine.MoveEndpointByRange (TextPatternRangeEndpoint_Start, oLine, TextPatternRangeEndpoint_End)
		EndIf
		Beep ()
	EndFor
	Return (FALSE)
EndIf

; Call default...
Return (MoveToHeading (iDirection, nLevel))
EndFunction

Int Function MoveToUnvisitedLink (Int iDirection)
Var
	Object oText = goFocus.GetTextPattern (),
	Object oLine = oText.GetSelection (0),
	Object oStop = oText.DocumentRange.Clone (),
	Int i

If goFocus.AutomationId == "MyRTB"
	oLine.ExpandToEnclosingUnit (TextUnit_Paragraph)
	If iDirection == s_Next
		oStop.MoveEndpointByRange (TextPatternRangeEndpoint_Start, oStop, TextPatternRangeEndpoint_End)
		iDirection = 1
	ElIf iDirection == s_Prior
		oStop.MoveEndpointByRange (TextPatternRangeEndpoint_End, oStop, TextPatternRangeEndpoint_Start)
		iDirection = -1
	EndIf
	oStop.ExpandToEnclosingUnit (TextUnit_Paragraph)
	For i = 1 to 2
		While Not oLine.Compare (oStop)
			If Not oLine.CompareEndPoints(TextPatternRangeEndpoint_Start, oLine, TextPatternRangeEndpoint_End)
				oLine.ExpandToEnclosingUnit (TextUnit_Paragraph)
			Else
				oLine.Move (TextUnit_Paragraph, iDirection)
			EndIf
			If oLine.GetChildren ().Count
				oLine.ScrollIntoView (TRUE)
				oLine.MoveEndpointByRange (TextPatternRangeEndpoint_End, oLine, TextPatternRangeEndpoint_Start); 
				oLine.Select ()
				Return (TRUE)
			EndIf
		EndWhile
		oLine = oText.DocumentRange.Clone ()
		If iDirection == 1
			oLine.MoveEndpointByRange (TextPatternRangeEndpoint_End, oLine, TextPatternRangeEndpoint_Start)
		ElIf iDirection == -1
			oLine.MoveEndpointByRange (TextPatternRangeEndpoint_Start, oLine, TextPatternRangeEndpoint_End)
		EndIf
		Beep ()
	EndFor
	Return (FALSE)
EndIf

; Call default...
Return (MoveToUnvisitedLink (iDirection))
EndFunction

Void Function sayCurrentHeading ()
SayLine ()
EndFunction

Int Function ShouldNotifyIfContextHelp()
If goFocus.AutomationId == "MyRTB"
	Return (FALSE)
EndIf

Return (ShouldNotifyIfContextHelp())
EndFunction

Script Tab ()
If (InHomeRowMode ())
	PerformScript UtilityMoveToNextWindow ()
	Return
EndIf
If UserBufferIsActive ()
		PerformScript Tab ()
	Return
EndIf
TabKey ()
SayCurrentScriptKeyLabel ()
Pause ()
If IsVirtualPcCursor ()
&& !IsJavaWindow(GetCurrentWindow ())
	NotifyIfContextHelp ()
EndIf
EndScript

Script ShiftTab ()
If (InHomeRowMode())
	PerformScript UtilityMoveToPriorWindow ()
	Return
EndIf
If UserBufferIsActive ()
	PerformScript ShiftTab ()
	Return
EndIf
ShiftTabKey ()
SayCurrentScriptKeyLabel ()
Pause ()
If IsVirtualPcCursor ()
&& !IsJavaWindow (GetCurrentWindow ())
	NotifyIfContextHelp ()
EndIf
EndScript

Script Debug ()
var
	Object oFocus = goUIA.GetFocusedElement ()

SayString (oFocus.HelpText)

EndScript
