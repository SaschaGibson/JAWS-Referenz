; Copyright 2010-2015 Freedom Scientific, Inc.
; JAWS 13.0.xx
; Script file for Mozilla Thunderbird e-mail client... (including version 6)

Include "HJConst.jsh"
Include "HJGlobal.jsh"
include "UIA.jsh"
Include "MSAAConst.jsh"
Include "Common.jsm"
Include "Thunderbird.jsm"
Include "Thunderbird.jsh"

import "UIA.jsd"


Messages
@MSG_ReplaceFromTemplate

%1
@@
@msg_ReplaceToTemplate
 %1
@@
@MSG_ConcatenateSixStringsTemplate
%1%2%3%4%5%6
@@
@MSG_ConcatenateTwoObjectPaths
%1,%2
@@
EndMessages

GLOBALS
	int ThunderbirdVersion,
	int gbDeletingMessageFromPreviewPane

string function GetDialogStaticText ()
if getObjectSubtypeCode (TRUE) != WT_DIALOG 
&& GetWindowClass (GetFocus ()) != WC_Dialogue then
	return GetDialogStaticText ()
EndIf
var object o = GetUIAObjectTree (GetFocus ())
o = o.FindByRole(ROLE_SYSTEM_TEXT)
if o then return o.name endIf
return GetDialogStaticText ()
endFunction

int function BrailleAddObjectDlgText (int type)
if getObjectSubtypeCode (TRUE) != WT_DIALOG 
&& GetWindowClass (GetFocus ()) != WC_Dialogue then
	return BrailleAddObjectDlgText ( type )
EndIf
if type == WT_DIALOG then
	BrailleAddString (GetDialogStaticText (), 0,0,0)
	return TRUE
endIf
endFunction

Script ScriptFileName ()
  ScriptAndAppNames(GetActiveConfiguration ())
EndScript

void function loadNonJCFOptions ()
gcOptions.HeadersAnnouncement = getNonJCFOption (HKEY_ANNOUNCE_HEADERS)
gcOptions.AutoReadingMessages = getNonJCFOption (HKEY_AUTO_READ_MESSAGE)
loadNonJCFOptions ()
endFunction

Void Function AutoStartEvent ()
Var
	String sPersonalized = FindJAWSPersonalizedSettingsFile (FormatString (MSG_JSIExtentionTemplate, GetActiveConfiguration ()), TRUE),
	String sBraille = FormatString (MSG_JBSExtentionTemplate, GetActiveConfiguration ()),
	String sSectionName = FormatString (MSG_BrailleSectionTemplate, IntToString (WT_ROW)),
	String sSectionContents = IniReadSectionKeys (sSectionName, sBraille),
	String sKey,
	Int iKeyNum,
	Int iLoop
ThunderbirdVersion = GetProgramVersion (GetAppFilePath ())
If Not gcOptions
	gcOptions = New Collection
EndIf
loadNonJCFOptions (); for QuickSettings
;gcOptions.HeadersAnnouncement = IniReadInteger (SECTION_USER_OPTIONS, HKEY_ANNOUNCE_HEADERS, 1, sPersonalized)
;gcOptions.AutoReadingMessages = IniReadInteger (SECTION_USER_OPTIONS, HKEY_AUTO_READ_MESSAGE, 1, sPersonalized)
iKeyNum = StringSegmentCount (sSectionContents, cscListSeparator)
For iLoop = 1 to iKeyNum
	sKey = StringSegment (sSectionContents, cscListSeparator, iLoop)
	If StringContainsChars (sKey, cScColon)
		gsBrailleSection = FormatString (MSG_ConcatenateSixStringsTemplate, gsBrailleSection, sKey, SC_Equals, IniReadString (sSectionName, sKey, cScNull, sBraille), cScBufferNewLine)
	EndIf
EndFor
EndFunction

Void Function AutoFinishEvent ()
gsBrailleSection = cScNull
AutoFinishEvent ()
EndFunction

Int Function IsImMessageList ()
If GetWindowClass (GetFocus ()) == WC_Client
&& GetObjectSubTypeCode (TRUE) == WT_ROW
&& GetObjectSubTypeCode (TRUE, 1) == WT_TABLE
	Return (TRUE)
EndIf
Return (FALSE)
EndFunction

Int Function IsInSpellChecker ()
Var
	handle hwnd = getFocus (),
	String ID
if ! hwnd || ! IsWindowVisible (hwnd)
|| getWindowClass (hwnd) != WC_Dialogue
|| StringSegment (GetWindowOwner (hwnd), "\\", -1) != "xul.dll" then
; keep this running only when Thunderbird's dialog is alive:
	return (FALSE)
endIf
if getWindowName (hwnd) == wn_CheckSpelling then ; newer spell checker
	Return (TRUE)
endIf
; no longer use RetrieveMSAAObjectsRolesFromPath (hwnd, cScNull),
; This prevents crashes outside of spell checker.
Return (FALSE)
EndFunction

Int Function IsInReadOnlyMessageBody ()
Return (GetWindowClass (GetFocus ()) == WC_ReadOnlyMessageBody
&& IsVirtualPCCursor ())
EndFunction

Int Function NewTextEventShouldBeSilent (Handle hFocus, Handle hWnd, String Buffer, Int nAttributes, Int nTextColor, Int nBackgroundColor, Int nEcho, String sFrameName)
Var
	String sClass = GetWindowClass (hFocus)

If sClass == WC_Client
|| sClass == WC_Dialogue
	Return (TRUE)
EndIf
Return (NewTextEventShouldBeSilent (hFocus, hWnd, Buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName))
EndFunction

String Function FindHotKey (Optional String ByRef sPrompt)
var
	String sObjectName = GetObjectName (TRUE),
	Int iObjectType = GetObjectSubTypeCode (TRUE)

If GetObjectTypeCode (TRUE) == WT_EDIT
&& StringContains (sObjectName, cScLess)
&& (! StringCompare (StringRight (sObjectName, 1), cScGreater))
	sPrompt = StringTrimTrailingBlanks (StringSegment (sObjectName, cScLess, 1))
	Return (StringSegment (sObjectName, cScLess + cScGreater, 2))
EndIf
Return (FindHotKey (sPrompt))
EndFunction

void function ProcessEventOnFocusChangedEventEx (Handle hWndFocus, Int nObject, Int nChild, Handle hWndPrevFocus, Int nPrevObject, Int nPrevChild, Int nChangeDepth, String sClass, Int nType)
var
	Int iFocusItem,
	Int iLoop
; While deleting messages from within the preview pane, where current and previous windows are identical:
if gbDeletingMessageFromPreviewPane then
	gbDeletingMessageFromPreviewPane = FALSE
	; the window gets redrawn but we don't know if we're in a new message or not, 
	; the title would otherwise read over and over.
	; Known instances are TypeCode = 0, but the new message has a type code of Document.
	; Just preventing silent speech if there is a way to delete and immediately return to the list of messages.
	var int ObjectTypeCode = GetObjectSubtypeCode (TRUE)
	if ! ObjectTypeCode || ObjectTypeCode == WT_DOCUMENT then
		return TRUE
	endIf
endIf
If IsImMessageList ()
	If Not nChangeDepth
		Return ActiveItemChangedEvent(hWndFocus,nObject,nChild,hWndPrevFocus,nPrevObject,nPrevChild)
	EndIf
	Return (FocusChangedEvent(hwndFocus,hwndPrevFocus))
EndIf
If nType == WT_TREEVIEWITEM
	If GlobalPrevObjectType == WT_TREEVIEWITEM
		GlobalPrevObjectType = nType
		Return ActiveItemChangedEvent(hWndFocus,nObject,nChild,hWndPrevFocus,nPrevObject,nPrevChild)
	EndIf
	GlobalPrevObjectType = nType
	Return (FocusChangedEvent(hwndFocus,hwndPrevFocus))
EndIf
If nType == WT_LISTBOXITEM
	If GlobalPrevObjectType == WT_LISTBOXITEM
	|| GlobalPrevObjectType == WT_COMBOBOX
		GlobalPrevObjectType = nType
		Return ActiveItemChangedEvent(hWndFocus,nObject,nChild,hWndPrevFocus,nPrevObject,nPrevChild)
	EndIf
	GlobalPrevObjectType = nType
	Return (FocusChangedEvent(hwndFocus,hwndPrevFocus))
EndIf
if sClass == WC_Dialogue
	GlobalPrevObjectType = nType
	return SayObjectTypeAndText ()
endIf
GlobalPrevObjectType = nType
Return (ProcessEventOnFocusChangedEventEx (hWndFocus, nObject, nChild, hWndPrevFocus, nPrevObject, nPrevChild, nChangeDepth, sClass, nType))
EndFunction

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue,optional int bIsFocusObject)
if (bIsFocusObject && nObjType == WT_COMBOBOX && StringIsBlank (GetSelectedText ())) then
; for the combo box in message write area
	say (sObjValue, OT_LINE)
	return
endIf
return ValueChangedEvent (hwnd, objId, childId, nObjType, sObjName, sObjValue, bIsFocusObject)
endFunction

int function IsTRUEListView(Handle hWnd)
; was for legacy versions of Thunderbird where List View Customization could have worked.
;If IsImMessageList ()
;	Return (TRUE)
;EndIf
;Return (IsTRUEListView (hWnd))
return FALSE
EndFunction

Int Function lvGetNumOfColumns (Handle hWnd)
var
	object o,
	int role,
	Int iNum

If IsImMessageList () then
	if thunderbirdVersion <= 45 then
	; all of this code is technically legacy,
		; newer versions don't do clever parsing of list view items. 
		; instead, we need only one list item that takes the entire name.
		goListItem = goListItem.accParent.accChild (1)
		iNum = goListItem.accChildCount - 1
		If ThunderbirdVersion == 3
			iNum = iNum - 1
		EndIf
		;the role of the grandparent of the focused item is application in the password manager
		;we need to add 1 to the number of columns obtained in this case.
		let o = GetFocusObject (0)
		let o = o.accParent();
		let o = o.accParent();
		let role = o.accRole(0)
		if role==ROLE_SYSTEM_APPLICATION then
			iNum = iNum + 1
		EndIf
	else
		iNum = ! stringIsBlank (GetObjectName (TRUE)) ; compensate for possible empty list
	endIf
	Return (iNum)
EndIf
Return (lvGetNumOfColumns (hWnd))
EndFunction

Int Function lvGetFocusItem (Handle hWnd)
var
	Int iLoop,
	Int iFocusLeft,
	Int iFocusRight,
	Int iFocusTop,
	Int iFocusBottom,
	Int iTop,
	Int iLeft,
	Int iWidth,
	Int iHeight,
	Object oList = goListItem.accParent

If IsImMessageList ()
	If ThunderbirdVersion >= 5
		If GetObjectRect (iFocusLeft, iFocusRight, iFocusTop, iFocusBottom, TRUE)
			For iLoop = 2 to oList.accChildCount
				oList.accLocation (intRef (iLeft), intRef (iTop), intRef (iWidth), intRef (iHeight), iLoop)
				If abs (iFocusTop - iTop) < 3
				&& abs (iFocusBottom - iTop - iHeight) < 3 then
					Return (iLoop - 1)
				EndIf
			EndFor
		EndIf
	Else
		Return (StringToInt (StringSegment (GetObjectDescription (TRUE), cScSpace, 2)))
	EndIf
EndIf
Return (lvGetFocusItem (hWnd))
EndFunction

String Function lvGetColumnHeader (Handle hWnd, Int nCol)
var
	Int iLeft,
	Int iTop,
	Int iWidth,
	Int iHeight,
	Int iLoop,
	Int iHeaderNumber,
	Int iLastHeaderTaken,
	Int iTemp,
	String sTemp,
	StringArray sHeaders,
	IntArray iHeaders

If IsImMessageList ()
	goListItem = goListItem.accParent.accChild (1)
	iHeaderNumber = goListItem.accChildCount - 1
	sHeaders = New StringArray [iHeaderNumber]
	iHeaders = New IntArray [iHeaderNumber]
	For iLoop = 1 To iHeaderNumber
		If iLoop > iLastHeaderTaken
			sHeaders[iLoop] = goListItem.accName(iLoop)
			goListItem.accLocation (IntRef (iLeft), IntRef (iTop), IntRef (iWidth), IntRef (iHeight), iLoop)
			iHeaders[iLoop] = iLeft
			iLastHeaderTaken = iLoop
		EndIf
		If iHeaders[iLoop] < iHeaders[iLoop - 1]
			sTemp = sHeaders[iLoop]
			iTemp = iHeaders[iLoop]
			sHeaders[iLoop] = sHeaders[iLoop - 1]
			sHeaders[iLoop - 1] = sTemp
			iHeaders[iLoop] = iHeaders[iLoop - 1]
			iHeaders[iLoop - 1] = iTemp
			iLoop = 1
		EndIf
	EndFor
	Return (sHeaders[nCol])
EndIf
Return (lvGetColumnHeader(hWnd,nCol))
EndFunction

String Function lvGetItemText (Handle hWnd, Int nCurrent, Int nCol)
Var
	String sResult
If IsImMessageList ()
	goListItem = goListItem.accParent.accChild (nCurrent + 1)
	sResult = goListItem.accName (nCol)
	If sResult == SC_StatusJunkMarker
		sResult = MSG_JunkStatus
	ElIf sResult == SC_StatusNoJunkMarker
		sResult = cScNull
	EndIf
	Return (sResult)
EndIf
Return (lvGetItemText(hWnd, nCurrent, nCol))
EndFunction

StringArray Function lvGetAllColumnHeaders (handle hWnd)
var
	Int iLeft,
	Int iTop,
	Int iWidth,
	Int iHeight,
	Int iLoop,
	Int iHeaderNumber,
	Int iLastHeaderTaken,
	Int iTemp,
	String sTemp,
	StringArray sHeaders,
	IntArray iHeaders

If IsImMessageList ()
	goListItem = goListItem.accParent.accChild (1)
	iHeaderNumber = goListItem.accChildCount - 1
	sHeaders = New StringArray [iHeaderNumber]
	iHeaders = New IntArray [iHeaderNumber]
	For iLoop = 1 To iHeaderNumber
		If iLoop > iLastHeaderTaken
			sHeaders[iLoop] = goListItem.accName(iLoop)
			goListItem.accLocation (IntRef (iLeft), IntRef (iTop), IntRef (iWidth), IntRef (iHeight), iLoop)
			iHeaders[iLoop] = iLeft
			iLastHeaderTaken = iLoop
		EndIf
		If iHeaders[iLoop] < iHeaders[iLoop - 1]
			sTemp = sHeaders[iLoop]
			iTemp = iHeaders[iLoop]
			sHeaders[iLoop] = sHeaders[iLoop - 1]
			sHeaders[iLoop - 1] = sTemp
			iHeaders[iLoop] = iHeaders[iLoop - 1]
			iHeaders[iLoop - 1] = iTemp
			iLoop = 1
		EndIf
	EndFor
EndIf
Return (sHeaders)
EndFunction

StringArray Function lvGetLineText (handle hWnd, int nCurrent)
Var
	StringArray sResult,
	Object oItem,
	Int iColumns,
	Int iLoop,
	Int iLeft,
	Int iTop,
	Int iRight,
	Int iBottom

If IsImMessageList ()
	iColumns = lvGetNumOfColumns (hWnd)
	If nCurrent
		oItem = goListItem.accParent.accChild (nCurrent + 1)
	Else
		GetObjectRect (iLeft, iRight, iTop, iBottom, TRUE)
		oItem = GetObjectAtPoint (iLoop, iLeft + (iRight - iLeft) / 2, iTop + (iBottom - Itop) / 2).accParent
	EndIf
	sResult = New StringArray [iColumns]
	For iLoop = 1 to iColumns
		sResult [iLoop] = oItem.accName (iLoop)
	EndFor
EndIf
Return (sResult)
EndFunction

String Function CreateFolderLabel ()
Var
	String sRealName = GetWindowName (GetRealWindow (GetFocus ())),
	String sSegment,
	String sLabel,
	Int iSegments = StringSegmentCount (sRealName, cScSpace),
	Int iLoop

For iLoop = 1 to iSegments
	sSegment = StringSegment (sRealName, cScSpace, iLoop)
	If StringLength (sSegment) > 2
		sLabel = sLabel + StringLeft (sSegment, 1)
	EndIf
EndFor
Return (sLabel)
EndFunction

String Function StringFilterOutMessageInformation (Optional int iBrailleFlag)
var
	Handle hFocus = GetFocus (),
	Int iColumns,
	Int iLoop,
	Int iBehaviour,
	Int iPosition,
	String sSegment,
	String sHeader,
	String sVoiceName,
	String sBehaviour,
	String sFiltered = cScBufferNewLine,
	String sFilterString,
	String sLabel = CreateFolderLabel (),
	StringArray sLine,
	Int iChildID

If Not iBrailleFlag
	If StringIsBlank (gsSpeechFilter)
		gsSpeechFilter = IniReadString (section_CustomizeColumn_Options, sLabel, cScNull, GetActiveConfiguration () + cScPeriod + cScJcf)
	EndIf
	sFilterString = gsSpeechFilter
Else
	If StringIsBlank (gsBrailleFilter)
		gsBrailleFilter = IniReadString (section_CustomizeColumn_Options, sLabel, cScNull, GetActiveConfiguration () + cScPeriod + cScJBS)
	EndIf
	sFilterString = gsBrailleFilter
EndIf
goListItem = GetFocusObject (iChildId)
iColumns = lvGetNumOfColumns (hFocus)
sLine = new StringArray[iColumns]
If ThunderbirdVersion >= 5 && ThunderbirdVersion <= 45
	sLine = lvGetLineText (hFocus, 0)
elIf ThunderbirdVersion > 45
	sLine[1] = getObjectName (TRUE)
Else; legacy versions less than 5
	sLine = lvGetLineText (hFocus, lvGetFocusItem (hFocus))
EndIf
; taking the first segment representing the all columns wide settings...
If Not StringIsBlank (sFilterString)
	sSegment = StringSegment (sFilterString, cscListSeparator, 1)
	iBehaviour = StringToInt (sSegment)
	If StringContainsChars (sSegment, cScColon)
		sVoiceName = StringSegment (sSegment, cScColon, 2)
	EndIf
EndIf
For iLoop = 1 to iColumns
	sBehaviour = StringSegment (sFilterString, cscListSeparator, iLoop + 1)
	iPosition = StringToInt (sBehaviour)
	If Not Iposition
		iPosition = iLoop
	EndIf
	sSegment = sLine [iPosition]
	; Junk status replacement...
	If sSegment == SC_StatusJunkMarker
		sSegment = MSG_JunkStatus
	ElIf sSegment == SC_StatusNoJunkMarker
		sSegment = cScNull
	EndIf
	If Not StringIsBlank (sSegment)
		If iBehaviour
			If StringLeft (sBehaviour, 1) != SC_Dash	; dash in the first position means to suppress the announcement.
				If iBehaviour == 1	; header or text
					If StringContainsChars (sBehaviour, cScColon)
						sHeader = StringSegment (sBehaviour, cScColon, 2)
					Else
						sHeader = gsHeaders [iPosition]
					EndIf
				ElIf iBehaviour == 2	; Header and text
					sHeader = gsHeaders [iPosition]
					If StringContainsChars (sBehaviour, cScColon)
						sHeader = FormatString (MSG_ConcatenateStringsWithSpaceTemplate, sHeader, StringSegment (sBehaviour, cScColon, 2))
					EndIf
				ElIf iBehaviour == 3	; text only
					If StringContainsChars (sBehaviour, cScColon)
						sHeader = StringSegment (sBehaviour, cScColon, 2)
					EndIf
				EndIf	; end of behaviour selection...
			EndIf	; sBehaviour does not contain dash in the first position.
		EndIf
		If Not iBrailleFlag
			If Not StringIsBlank (sHeader)
				sHeader = smmReplaceSymbolsWithMarkup (sHeader)
				If Not StringIsBlank (sVoiceName)
					sHeader = FormatString (MSG_VoiceNameTemplate, sVoiceName, sHeader)
				EndIf
			EndIf
			sSegment = smmReplaceSymbolsWithMarkup (sSegment)
		EndIf
		sFiltered = FormatString (MSG_ConcatenateThreeStringsTemplate, sFiltered, sHeader, sSegment) + cScBufferNewLine
	EndIf
EndFor
Return (sFiltered)
EndFunction

Void Function ActiveItemChangedEvent (Handle hWnd, Int ObjectID, Int ChildID, Handle prevHWnd, Int prevObjectID, Int prevChildID)
var
	Int iLoop,
	String sStringRealWindowID = RetrieveMSAAObjectsRolesFromPath (hWnd, cScNull)

If IsImMessageList ()
	Return (ReadMessageInList ())
EndIf
; Are we in the Address Book...
If StringContains (sStringRealWindowID, AddressBookWindowIDStringStart)
&& StringContains (sStringRealWindowID, AddressBookWindowIDStringEnd)
	If getObjectSubTypeCode(true) == WT_TREEVIEWITEM
		If Not nSaySelectAfter
			If !(GetControlAttributes () & CTRL_SELECTED)
				Say (cMsgDeselected, OT_SELECTED)
			EndIf
		EndIf
		Say (GetObjectName (TRUE), OT_SELECTED_ITEM)
		If nSaySelectAfter
			If !(GetControlAttributes () & CTRL_SELECTED)
				Say (cMsgDeselected, OT_SELECTED)
			EndIf
		EndIf
	Endif
EndIf
If IsInSpellChecker ()
			Say (GetObjectName (), OT_SELECTED_ITEM)
			SpellString (GetObjectName ())
			Return
EndIf
Return (ActiveItemChangedEvent (hWnd, ObjectID, ChildID, prevHWnd, prevObjectID, prevChildID))
EndFunction

void function ObjStateChangedEvent(Handle hWnd,optional  int iObjectType, int nChangedState, int nState, int nOldState)
Var
	Int iSelected = nState & CTRL_SELECTED,
	String sStringRealWindowID = RetrieveMSAAObjectsRolesFromPath (hWnd, cScNull)

If IsImMessageList ()
	; we can not use this event because it stops firing on selecting more then one message.
	; so just return and let the SelectCurrentItem script do its job.
	Return
EndIf
If iObjectType == WT_LISTBOXITEM
	If Not nState
		Return
	EndIf
EndIf
; for tree views in the address book window
; Are we in the Address Book...
If StringContains (sStringRealWindowID, AddressBookWindowIDStringStart)
&& StringContains (sStringRealWindowID, AddressBookWindowIDStringEnd)
	If iObjectType == WT_TREEVIEWITEM
		If Not nSaySelectAfter
			IndicateControlState (WT_TREEVIEWITEM, iSelected)
			If not iSelected
				Say (cMsgDeselected, OT_SELECTED)
			EndIf
		EndIf
			Say (getObjectName (TRUE), OT_SELECTED_ITEM)
		If nSaySelectAfter
			IndicateControlState (WT_TREEVIEWITEM, iSelected)
			If not iSelected
				Say (cMsgDeselected, OT_SELECTED)
			EndIf
		EndIf
	EndIf
	Return	; we have totally handled the case of selection...
EndIf
Return (ObjStateChangedEvent (hWnd, iObjectType, nChangedState, nState, nOldState))
EndFunction

int Function HandleCustomRealWindows (handle hWnd)
var
	Int iChild,
	Object oDialogue = GetObjectFromEvent (hWnd, OBJID_CLIENT, 0, iChild)

If IsInSpellChecker ()
	IndicateControlType (WT_DIALOG, GetWindowName (hWnd), oDialogue.accName (1))
	SpellString (oDialogue.accName (2))
	Return (TRUE)
EndIf
Return (FALSE)
EndFunction

int Function HandleCustomWindows (handle hWnd)
var
	String sObjectName = GetObjectName (TRUE),
	String sFiltered,
	String ID = RetrieveMSAAObjectsRolesFromPath (hWnd, cScNull),
	Int iObjectType = GetObjectSubTypeCode (TRUE),
	Int iChild,
	Object oDialogue = GetObjectFromEvent (hWnd, OBJID_CLIENT, 0, iChild),
	object oFocus,
	Object oParent,
	int i = 1
if iObjectType == WT_DIALOG 
&& GetWindowClass (hwnd) == WC_Dialogue then
	SayMessage (OT_LINE, getDialogStaticText ())
	return TRUE
endIf
If iObjectType == WT_UNKNOWN
	oFocus = getFocusObject (iChild)
	If oFocus
	&& oFocus.accRole (iChild) == ROLE_SYSTEM_APPLICATION
		While (oFocus.accRole (i) != ROLE_SYSTEM_GROUPING
		|| ((oFocus.accState (i) & STATE_SYSTEM_INVISIBLE)
		&& oFocus.accRole (i) == ROLE_SYSTEM_GROUPING))
		&& i < 100
			i = i + 1
		EndWhile
		If oFocus.accRole (i) == ROLE_SYSTEM_GROUPING
		&& !(oFocus.accState (i) & STATE_SYSTEM_INVISIBLE)
			oFocus = oFocus.accChild (i).accChild (1)	; grouping > propertypane
			If Not oFocus
				Return
			EndIf
			While (oFocus.accRole (i) != ROLE_SYSTEM_PROPERTYPAGE
			|| ((oFocus.accState (i) & STATE_SYSTEM_INVISIBLE)
			&& oFocus.accRole (i) == ROLE_SYSTEM_PROPERTYPAGE))
			&& i < 100
				i = i + 1
			EndWhile
			If oFocus.accRole (i) == ROLE_SYSTEM_PROPERTYPAGE
			&& ! (oFocus.accState (i) & STATE_SYSTEM_INVISIBLE)
				oFocus = oFocus.accChild (i).accChild (1)	; propertypane > table
				If oFocus
				&& oFocus.accRole (childId_SELF) == ROLE_SYSTEM_TABLE
				&& ! (oFocus.accState (childId_SELF) & STATE_SYSTEM_INVISIBLE)
					oFocus.accSelect (SELFLAG_TAKEFOCUS, 0)
					ScheduleFunction ("readMessageInList", 5)
					Return (TRUE)
				EndIf
			EndIf
		EndIf
	EndIf
EndIf
If iObjectType == WT_TREEVIEWITEM
	IndicateControlType (WT_TREEVIEW, cScSpace, sObjectName)
	IndicateControlState (WT_TREEVIEW, GetControlAttributes () & (CTRL_OPENED | CTRL_CLOSED))
	Return (TRUE)
EndIf
If GetObjectTypeCode (TRUE) == WT_EDIT
&& StringContains (sObjectName, cScLess)
&& (! StringCompare (StringRight (sObjectName, 1), cScGreater))
	IndicateControlType (iObjectType, StringTrimTrailingBlanks (StringSegment (sObjectName, cScLess, 1)))
	Return (TRUE)
EndIf
If IsImMessageList ()
	gsSpeechFilter = cScNull
	gsBrailleFilter = cScNull
	gsHeaders = lvGetAllColumnHeaders (hWnd)
	Say (smmMarkupString (cScSpace, toTypeBefore, WT_LISTVIEW), OT_CONTROL_NAME, TRUE)
	ScheduleFunction ("ReadMessageInList", 1)
	Return (TRUE)
EndIf
If iObjectType == WT_EDITCOMBO
&& sObjectName == GetGroupBoxName ()
	; the edit combo name may be empty, and hence get the name of the parent combo box:
	if StringIsBlank (sObjectName) then
		if getObjectSubtypeCode (TRUE, 1) == WT_COMBOBOX then
			sObjectName = GetObjectName (TRUE, 1)
		endIf
	endIf
	IndicateControlType (iObjectType, sObjectName, GetObjectValue (TRUE))
	Return (TRUE)
EndIf
If IsInSpellChecker ()
&& iObjectType == WT_LISTBOXITEM
&& GetObjectSubTypeCode (TRUE, 1) == WT_LISTBOX
	Say (oDialogue.accName (1), OT_DIALOG_TEXT)
	SpellString (oDialogue.accName (2))
	SayObjectTypeAndText ()
	SpellLine ()
	Return (TRUE)
EndIf
If DialogActive ()
	oFocus = GetFocusObject (iChild)
	oParent = oFocus.accParent
	If oParent.accRole (CHILDID_SELF) == ROLE_SYSTEM_GROUPING
		Say (oParent.accName (CHILDID_SELF), OT_CONTROL_GROUP_NAME)
	EndIf
EndIf
Return (HandleCustomWindows (hWnd))
EndFunction

void function ProcessSayRealWindowOnFocusChange(handle AppWindow, handle RealWindow, string RealWindowName, handle FocusWindow)
var
	Handle hChild
If GlobalPrevRealName != RealWindowName
|| GlobalPrevReal != RealWindow
	If RealWindow == FocusWindow	; we shall handle this case ourselves
		If ProcessSayRealWindowOnFocusChangeFromHJDialog(AppWindow, RealWindow, RealWindowName, FocusWindow)
			Return
		EndIf
		If !HandleCustomRealWindows(RealWindow)
			if dialogActive() then
				if getWindowName(realWindow) == wn_SaveMessage then
					IndicateControlType (wt_dialog, getWindowName(realWindow),MSAAGetDialogStaticText () )
					return
				else
					IndicateControlType (wt_dialog, getWindowName(realWindow))
					return
			endif
			endif
			Return (SayWindowTypeAndText(RealWindow))
		EndIf
	EndIf
EndIf
ProcessSayRealWindowOnFocusChange(AppWindow,RealWindow,RealWindowName,FocusWindow)
EndFunction

Script SayWindowTitle()
var
	int numAncestors,
	int currentAncestor,
	int ancestorType,
	int dialogAncestor,
	string dialogName
let numAncestors = GetAncestorCount ()
let dialogAncestor = -1
for currentAncestor = 0 to numAncestors
	let ancestorType = GetObjectSubTypeCode (1, currentAncestor)
	if (ancestorType == WT_DIALOG) then
		let dialogAncestor = currentAncestor
	EndIf
EndFor

if (dialogAncestor > -1) then
	let dialogName = GetObjectName(1,dialogAncestor)
	Say (dialogName, ot_user_requested_information)
	IndicateControlType (WT_DIALOG)
else
	PerformScript SayWindowTitle()
EndIf
EndScript

int function sayBottomLineOfWindowUIA ()
var object UIA, object window, object statusBar, object condition, object treeWalker, string message
UIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if ! UIA return FALSE endIf
window = UIA.GetElementFromHandle(getAppMainWindow (getFocus ()))
if ! window return FALSE endIf
condition = UIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_StatusBarControlTypeId)
if ! condition return FALSE endIf
statusBar = window.FindFirst(TreeScope_subtree, condition )
if ! statusBar return FALSE endIf
treewalker = CreateUIATreeWalkerForFocusProcessId ()
if ! treewalker return FALSE endIf
treewalker.currentElement = statusBar
if ! treeWalker.GoToFirstChild() return FALSE endIf
message = treewalker.currentElement.name
var string tmp
while (treeWalker.GoToNextSibling())
	tmp = treewalker.currentElement.name
	message = message  + cscSpace + tmp
endWhile
message = stringTrimLeadingBlanks (stringTrimTrailingBlanks (message))
sayMessage (OT_USER_REQUESTED_INFORMATION, message)
endFunction

script SayBottomLineOfWindow()
var
	handle hWnd,
	object o,
	int iTemp,
	int iLoop,
	int iLoop2,
	variant vStatus
if SayBottomLineOfWindowUIA () return endIf
if DialogActive() then
	let hWnd = GetRealWindow(GetFocus())
else
	let hWnd = GetAppMainWindow(GetFocus())
EndIf

let o = GetObjectFromEvent (hWnd, objid_client, childid_self, iTemp)
let vStatus = Null()

if !o then
	return
Endif

For iLoop = 1 to o.accChildCount
	if o.accRole(iLoop) == role_system_statusbar then
		vStatus = o.accChild(iLoop)
		if vStatus && vStatus == 0 then
			for iLoop2 = 1 to vStatus.accChildCount
				say(vStatus.accName(iLoop2),ot_user_requested_information)
			endfor
		endif
	endif
EndFor

EndScript

Script CustomizeListView ()
Var
	String sLabel,
	String sColumnList,
	Handle hFocus = GetFocus (),
	Int iColumns,
	Int iLoop
/* old functionality that doesn't work anymore

If IsImMessageList ()
	sLabel = CreateFolderLabel ()
	iColumns = lvGetNumOfColumns (hFocus)
	For iLoop = 1 to iColumns
		sColumnList = FormatString (MSG_ColumnTemplate, sColumnList, lvGetColumnHeader (hFocus, iLoop))
	EndFor
	sColumnList = stringChopLeft (sColumnList, 1)
	DlgCustomizeColumns (sColumnList, sLabel, CustomizeMessageListDialogueTitle)
	Return
EndIf
*/
PerformScript CustomizeListView ()
EndScript

Object Function RetrieveMSAAObjectFromPath (handle hWnd, string sPath)
var
	Int iSegments = StringSegmentCount (sPath, SC_Comma),
	Int iLoop,
	Int iChildID,
	Object oReturn

oReturn = GetObjectFromEvent (hWnd, OBJID_CLIENT, 0, iChildID)
If not oReturn
	Return (Null ())
EndIf
For iLoop = 1 to iSegments
	oReturn = oReturn.accChild (StringToInt (StringSegment (sPath, SC_Comma, iLoop)))
EndFor
Return (oReturn)
EndFunction

String Function RetrieveMSAAObjectsRolesFromPath (handle hWnd, string sPath)
var
	Int iSegments = StringSegmentCount (sPath, SC_Comma),
	Int iLoop,
	Int iChildID,
	Int iNum,
	Object oReturn,
	String sResult

oReturn = GetObjectFromEvent (hWnd, OBJID_CLIENT, 0, iChildID)
If not oReturn
	Return (cScNull)
EndIf
For iLoop = 1 to iSegments
	oReturn = oReturn.accChild (StringToInt (StringSegment (sPath, SC_Comma, iLoop)))
EndFor
iNum = oReturn.accChildCount
For iLoop = 1 to iNum
	sResult = sResult + SC_Comma + IntToString (oReturn.accRole (iLoop))
EndFor
Return (stringStripAllBlanks (stringChopLeft (sResult, 1)))
EndFunction

Int Function ProcessEditableMessageFields (handle hWnd, int iField)
var
	Int iSame = IsSameScript (),
	Object oCurrent

; from field...
If iField == 1
	oCurrent = RetrieveMSAAObjectFromPath (hWnd, FromEditableMessage)
; subject field
ElIf iField == 5
	oCurrent = RetrieveMSAAObjectFromPath (hWnd, SubjectEditableMessage)
; all to and CC copies...
Else
	If iField > 1
	&& iField < 5
		oCurrent = RetrieveMSAAObjectFromPath (hWnd, FormatString (MSG_AddressEditableMessageTemplate, IntToString (iField - 1)))
	EndIf
EndIf
If oCurrent && oCurrent.accRole (0)
	If iSame
		oCurrent.accSelect (SELFLAG_TAKEFOCUS, 0)
	EndIf
	if oCurrent.accName (0) !=cscNull
		SayControlEx (hWnd, oCurrent.accName (0), getRoleText (oCurrent.accRole (0)), cScNull, cScNull, cScNull, oCurrent.accValue (0))
	else
		return (false)
	Endif
	If iSame
		Say (PositionInGroup (), OT_POSITION)
	EndIf
	Return (TRUE)
EndIf
Return (FALSE)
EndFunction

Int Function ProcessReadOnlyMessageFields (handle hWnd, int iField, int iWindowed)
var
	Handle hReal = GetRealWindow (hWnd),
	Object oCurrent,
	String sControlName,
	String sControlValue,
	Int iStart

If iWindowed
	iStart = WindowedReadOnlyMessageStart + iField * 2
	sControlName = IntToString (iStart)
	If iField != 2
		sControlValue = FormatString (MSG_WindowedAddressTemplate, sControlName)
	Else
		sControlValue = FormatString (MSG_TabbedSubjectTemplate, sControlName)
	EndIf
Else
	iStart = TabbedReadOnlyMessageStart + iField * 2
	sControlName = FormatString (MSG_TabbedNamePrefix, IntToString (iStart))
	If iField != 2
		sControlValue = FormatString (MSG_TabbedAddressTemplate, IntToString (iStart))
	Else
		sControlValue = FormatString (MSG_TabbedSubjectTemplate, IntToString (iStart))
	EndIf
EndIf
If iField < 1
&& iField >= 6
	Return (FALSE)
EndIf
oCurrent = RetrieveMSAAObjectFromPath (hReal, sControlName)
sControlName = oCurrent.accName (0)
oCurrent = RetrieveMSAAObjectFromPath (hReal, sControlValue)
sControlValue = StringSegment (oCurrent.accName (0), cSCColon,-1)
If oCurrent.accChildCount > 0
	oCurrent = oCurrent.accChild (1)
EndIf
If oCurrent.accRole (0)
	SayControlEx (hWnd, sControlName, getRoleText (oCurrent.accRole (0)), cScNull, cScNull, cScNull, sControlValue)
	Return (TRUE)
EndIf
Return (FALSE)
EndFunction

Script HandleMessageFields (int iField)
var
	Handle hReal = GetRealWindow (GetFocus ())

If Not iField
	iField = StringToInt (StringRight (GetCurrentScriptKeyName (), 1))
EndIf
If Not iField
	Return
EndIf
if StringContains(getWindowName(getAppMainWindow(getFocus())), wn_Write) && ProcessEditableMessageFields (hReal, iField)
	Return
EndIf
If ProcessReadOnlyMessageFields (hReal, iField, FALSE)
	Return
EndIf
If ProcessReadOnlyMessageFields (hReal, iField, TRUE)
	Return
EndIf
SayMessage (OT_ERROR, MSG_NotInThisDialogue_L, MSG_NotInThisDialogue_S)
EndScript

Script SayLine()
if IsPcCursor () && GetObjectSubtypeCode (TRUE) == WT_DIALOG 
&& GetWindowClass (GetFocus ()) == WC_Dialogue then
	SayMessage (OT_LINE, getDialogStaticText ())
	return TRUE
endIf
If (IsImMessageList () || getObjectSubTypeCode(true,0) == wt_treeviewitem)
&& (! IsSameScript ())
	If Not nSaySelectAfter
		If !(GetControlAttributes () & CTRL_SELECTED)
			Say (cMsgDeselected, OT_SELECTED)
		EndIf
	EndIf
	if IsImMessageList () then
		Say (StringFilterOutMessageInformation (), OT_SELECTED_ITEM, TRUE)
	elIf getObjectSubTypeCode(true,0) == WT_TREEVIEWITEM
		Say(getObjectName(true,0),ot_line)
		IndicateControlState (WT_TREEVIEW, GetControlAttributes () & (CTRL_OPENED | CTRL_CLOSED))
		Say(PositionInGroup (),ot_position)
	EndIf
	If nSaySelectAfter
		If !(GetControlAttributes () & CTRL_SELECTED)
			Say (cMsgDeselected, OT_SELECTED)
		EndIf
	EndIf
	Return
EndIf
PerformScript SayLine()
EndScript

; Braille support.

Int function BrailleAddObjectType (Int nSubtypeCode)
If IsImMessageList ()
	BrailleAddString (BrailleGetSubtypeString (WT_LISTVIEW), 0, 0, 0)
	Return (TRUE)
EndIf
If nSubtypeCode == WT_GROUPBOX
	; hopefully the 'to' field is the only place where group box name is the same as object name.
	If GetObjectName (TRUE) == GetGroupBoxName ()
	&& GetObjectSubTypeCode (TRUE) == WT_EDITCOMBO
		Return (TRUE)
	EndIf
EndIf
Return (BrailleAddObjectType (nSubtypeCode))
EndFunction

Int function BrailleAddObjectValue (int nSubtypeCode)
var
	int left,
	int right,
	int top,
	int bottom

if (FocusedOnComboInSearchWindow ()) then
Var
	String currentValue
	GetObjectRect (left, right, top, bottom, true, 0)
let currentValue = GetObjectValue (true, 0)
	BrailleAddString (currentValue, (left+right)/2, (top+bottom)/2, ATTRIB_HIGHLIGHT)
	Return TRUE
EndIf

Var
	Int iNumReplacements,
	Int iLoop,
	String sLine,
	String sKey
If IsImMessageList ()
	iNumReplacements = StringSegmentCount (gsBrailleSection, cScBufferNewLine)
	sLine = StringFilterOutMessageInformation (TRUE)
	For iLoop = 1 to iNumReplacements
		sKey = StringSegment (gsBrailleSection, cScBufferNewLine, iLoop)
		If StringContains (StringLower (sKey), SC_ValueComponent)
			sKey = StringSegment (sKey, cScColon, 2)
			sLine = StringReplaceSubstrings (sLine, FormatString(MSG_ReplaceFromTemplate, StringSegment (sKey, SC_Equals, 1)), FormatString (MSG_ReplaceToTemplate, StringSegment (sKey, SC_Equals, 2)))
		EndIf
	EndFor
	sLine = StringReplaceChars (sLine, cScBufferNewLine, cScSpace)
	GetObjectRect (left, right, top, bottom, true, 0)
	BrailleAddString (sLine, (left+right)/2, (top+bottom)/2, ATTRIB_HIGHLIGHT)
	Return (TRUE)
EndIf
if nSubtypeCode == WT_COMBOBOX && StringIsBlank (GetSelectedText ()) then
	BrailleAddString (GetObjectValue (TRUE), 0,0,0)
	return TRUE
endIf
Return (BrailleAddObjectValue (nSubtypeCode))
EndFunction

Int function BrailleAddObjectName (int nSubtypeCode)
If IsImMessageList ()
	Return (TRUE)
EndIf
If nSubtypeCode == WT_EDITCOMBO
&& StringIsBlank (getObjectName (TRUE)) then
; the edit combo name may be empty, and hence get the name of the parent combo box:
	if getObjectSubtypeCode (TRUE, 1) == WT_COMBOBOX then
		BrailleAddString (GetObjectName (TRUE, 1), 0,0,0)
		return TRUE
	endIf
EndIf
Return (BrailleAddObjectName (nSubtypeCode))
EndFunction

Int function BrailleAddObjectContainerName (int nSubtypeCode)
If nSubtypeCode == WT_GROUPBOX
	; hopefully the 'to' field is the only place where group box name is the same as object name.
	If GetObjectName (TRUE) == GetGroupBoxName ()
	&& GetObjectSubTypeCode (TRUE) == WT_EDITCOMBO
		Return (TRUE)
	EndIf
EndIf
Return (BrailleAddObjectContainerName (nSubtypeCode))
EndFunction

; User Options...

; this is used for old style of Adjust JAWS Verbosity, should be removed later...

string function HeadersAnnouncementToggle (Int iRetCurVal)
If Not iRetCurVal
	gcOptions.HeadersAnnouncement = Not gcOptions.HeadersAnnouncement
EndIf
If gcOptions.HeadersAnnouncement
	Return (cmsgOn)
Else
	Return (cmsgOff)
EndIf
EndFunction

string function HeadersAnnouncementToggleHlp ()
Return (MSG_HeadersAnnouncementHelp)
EndFunction

string function AutoReadMessageToggle (Int iRetCurVal)
If Not iRetCurVal
	gcOptions.AutoReadingMessages = Not gcOptions.AutoReadingMessages
EndIf
If gcOptions.AutoReadingMessages
	Return (cmsgOn)
Else
	Return (cmsgOff)
EndIf
EndFunction

string function AutoReadMessageToggleHlp ()
Return (MSG_AutoReadMessagesHelp)
EndFunction

Script AdjustJAWSOptions ()
Var
	String sPersonalized = FindJAWSPersonalizedSettingsFile (FormatString (MSG_JSIExtentionTemplate, GetActiveConfiguration ()), TRUE),
	String sAllNodes,
	Int iSaved

If InHJDialog ()
	SayFormattedMessage (OT_ERROR, cMSG337_L, cMSG337_S)
	Return
EndIf
sAllNodes = FormatString (MSG_SelectFunctionToRunItemTemplate, HeadersAnnouncementFunctionName, HeadersAnnouncementItemName)
sAllNodes = FormatString (MSG_SelectFunctionToRunItemsTemplate, sAllNodes, FormatString (MSG_SelectFunctionToRunItemTemplate, AutoReadMessageFunctionName, AutoReadMessageItemName))
ConvertListToNodeList (sAllNodes, FormatString (MSG_OptionsTemplate, GetActiveConfiguration ()))
OptionsTreeCore (sAllNodes, TRUE)
If gcOptions.HeadersAnnouncement != IniReadInteger (SECTION_USER_OPTIONS, HKEY_ANNOUNCE_HEADERS, 1, sPersonalized)
	iSaved = IniWriteInteger (SECTION_USER_OPTIONS, HKEY_ANNOUNCE_HEADERS, gcOptions.HeadersAnnouncement, sPersonalized)
EndIf
If gcOptions.AutoReadingMessages != IniReadInteger (SECTION_USER_OPTIONS, HKEY_AUTO_READ_MESSAGE, 1, sPersonalized)
	iSaved = iSaved | IniWriteInteger (SECTION_USER_OPTIONS, HKEY_AUTO_READ_MESSAGE, gcOptions.AutoReadingMessages, sPersonalized)
EndIf
If iSaved
	SayFormattedMessage (OT_JAWS_MESSAGE, cmsgSettingSaved1_L, cmsgSettingSaved1_S)
EndIf
EndScript

; End of old style Adjust JAWS Verbosity.

Void Function DocumentLoadedEvent ()
Var
	Int iLoop

If gcOptions.HeadersAnnouncement
&& ((! GetObjectSubTypeCode (TRUE))
|| GetObjectSubTypeCode (TRUE) == WT_STATIC)
	Pause ()
	For iLoop = 1 to 5
		ProcessReadOnlyMessageFields (GetRealWindow (GetFocus ()), iLoop, FALSE)
	EndFor
EndIf
If gcOptions.AutoReadingMessages
	DocumentLoadedEvent ()
EndIf
EndFunction

Void Function ReadMessageInList ()
Var
	String sFiltered

MSAARefresh ()
sFiltered = StringFilterOutMessageInformation (false)
If StringIsBlank (sFiltered)
	ScheduleFunction ("ReadMessageInList ", 1)
	Return
EndIf
If Not nSaySelectAfter
	If !(GetControlAttributes () & CTRL_SELECTED)
		Say (cMsgDeselected, OT_SELECTED)
	EndIf
EndIf
Say (sFiltered, OT_SELECTED_ITEM, true)
If nSaySelectAfter
	If !(GetControlAttributes () & CTRL_SELECTED)
		Say (cMsgDeselected, OT_SELECTED)
	EndIf
EndIf
EndFunction

Int Function DialogActive (optional int useTopWindowControlType)
If GetWindowClass (GetFocus ()) == WC_Dialogue
	Return (TRUE)
EndIf
Return (DialogActive (useTopWindowControlType))
EndFunction

Void Function DoDelete ()
If IsImMessageList ()
	TypeCurrentScriptKey ()
	; Used to schedule reading the message for older versions of Thunderbird,
	; new versions catch it on a subsequent FocusChangedEventEX call.
	Return
ElIf IsInReadOnlyMessageBody ()	; we are in a readonly message body...
	TypeCurrentScriptKey ()
	Return
EndIf
DoDelete ()
EndFunction

Void Function UnitMoveControlNav (Int UnitMovement)
Var
	Handle hFocus = GetFocus (),
	Int iObjectType = GetObjectSubTypeCode (TRUE)

If IsPCCursor ()
&& (! InHJDialog ())
&& (! UserBufferIsActive ())
	If IsImMessageList () || iObjectType == wt_treeviewitem then
		If UnitMovement == UnitMove_Next
			TypeKey (cksControlDownArrow) ; move without removing selection
		ElIf UnitMovement == UnitMove_Prior
			TypeKey (cksControlUpArrow) ; move without removing selection
		EndIf
		Return
	EndIf
EndIf
Return (UnitMoveControlNav (UnitMovement))
EndFunction

Script SelectCurrentItem ()
Var
	Int iAttributes,
	String sStringRealWindowID = RetrieveMSAAObjectsRolesFromPath (GetFocus (), cScNull)

PerformScript SelectCurrentItem ()
If IsImMessageList ()
	ScheduleFunction ("ReadMessageInList", 1)
	Return
EndIf
; for tree views in the address book window
; Are we in the Address Book...
If StringContains (sStringRealWindowID, AddressBookWindowIDStringStart)
&& StringContains (sStringRealWindowID, AddressBookWindowIDStringEnd)
	MSAARefresh ()
EndIf
/*
	iAttributes = GetControlAttributes (TRUE)
	If GetObjectSubTypeCode (TRUE) == WT_TREEVIEWITEM
		If Not nSaySelectAfter
			If Not (iAttributes & CTRL_SELECTED)
				Say (cMsgDeselected, OT_SELECTED)
			EndIf
		EndIf
		; only speak the item if it is now not selected.  When the item becomes selected it will automatically be announced by objStateChangedEvent...
		If Not (iAttributes & CTRL_SELECTED)
			Say (getObjectName (TRUE), OT_SELECTED_ITEM)
		Endif
		If nSaySelectAfter
			If Not (iAttributes & CTRL_SELECTED)
				Say (cMsgDeselected, OT_SELECTED)
			EndIf
		EndIf
	EndIf
	Return	; we have totally handled the case of non selection...
EndIf
*/
EndScript

Void Function SayHighLightedText (Handle hWnd, String buffer)
Var
	Handle hFocus = GetFocus (),
	Handle hParent = GetParent (hFocus)

If GetOwningAppName (hFocus) == "comctl32.dll"
&& GetWindowSubtypeCode (hFocus) == WT_EDITCOMBO
	Say (buffer, OT_SELECTED_ITEM)
	Return
EndIf
; I see no sence in this if operator, but now it is too late to remove it,
; so leaving till the next cycle of development.
;If hWnd == hFocus
;|| hWnd == hParent
;&& SupportsEditCallbacks ()
;	Return	; text will be spoken by SelectionChangedEvent
;EndIf
Return (SayHighLightedText (hWnd, buffer))
EndFunction

Script OpenListBox ()
if IsPcCursor () && GetWindowClass (getFocus ()) == WC_Dialogue 
&& getObjectSubtypeCode (TRUE) == WT_COMBOBOX then ; avoid problem with opening the list box
	SayMessage (ot_JAWS_message, cmsg41_L, cmsgSilent)  ;open list box
	TypeKey (cksAltDownArrow)
	return
endIf
PerformScript OpenListBox ()
endScript

/*
Script Test ()
Var
	Object o

; from: 13,1,3,1
; to: 13,1,7,1
o = RetrieveMSAAObjectFromPath (GetFocus (), "7,2")
;o = GetObjectFromEvent (GetFocus (), OBJID_CLIENT, 0, 0)
SayInteger (o.accChildCount)
;SayInteger (o.accSelection (1))
SayString (o.accName (0))
SayString (o.accValue (0))
EndScript

script test ()
SayMessage (OT_USER_BUFFER, RetrieveMSAAObjectsRolesFromPath (GetFocus (), cScNull))
endScript
*/

Int Function FindAncestorOfType (int type)
var
	int numAncestors,
	int currentAncestor,
	int ancestorType,
	int matchingAncestor
let numAncestors = GetAncestorCount ()
let matchingAncestor = -1
let currentAncestor = 0
while (currentAncestor <= numAncestors && matchingAncestor == -1)
	let ancestorType = GetObjectSubTypeCode (1, currentAncestor)
	if (ancestorType == type ) then
		let matchingAncestor = currentAncestor
	EndIf
	let currentAncestor = currentAncestor+1
EndWhile

return matchingAncestor
EndFunction

Int Function FocusedOnComboInSearchWindow ()
if (GetObjectSubTypeCode (true, 0) != WT_COMBOBOX) then
	return false
EndIf

return StringContains ( GetObjectNameUnfiltered (FindAncestorOfType(WT_UNKNOWN)), MSG_SearchMessagesWindowTitle)
EndFunction

Script ReadBoxInTabOrder()
if inHjDialog () then
	performScript ReadBoxInTabOrder ()
	return
endIf

var
	int dialogAncestorLevel

let dialogAncestorLevel = FindAncestorOfType (WT_DIALOG)
if dialogAncestorLevel != -1 then
	say(MSAAGetDialogStaticText (),OT_USER_REQUESTED_INFORMATION)
	return
EndIf

PerformScript ReadBoxInTabOrder()
EndScript

Script JAWSDelete ()
PerformScript JAWSDelete ()
gbDeletingMessageFromPreviewPane = IsInReadOnlyMessageBody ()
endScript

;Tables detection, from the OSM section of the JCF, is not directly settable without setting the JCF option.
int function TableDetection ()
return getJCFOption(optTableIndication)
endFunction

void function TableEnteredEvent(int columns, int rows, int nesting, int col, int row, int uniform, 
	int hasMarkedHeaders, int headersColumn, int headersRow )
var
	string message

if !TableDetection() then
	return
EndIf
message = FormatString( cmsgEnteringTable, IntToString ( columns ), IntToString ( rows ) )
SayMessage( ot_position, message );
endFunction

void function TableExitedEvent()
if !TableDetection() then
	return
EndIf

SayMessage( ot_position, cmsgLeavingTable);
endFunction

void function CellChangedEvent(int NewCol, int NewRow, int NewNesting, int NewRowColCount,
		string ColHeader, string RowHeader, int PrevCol, int PrevRow, int PrevNesting, int PrevRowColCount)
var
	string message
if ( TableDetection()
&& newRow != prevRow )
	SayMessage(ot_position,RowHeader);
	message = FormatString ( msg_row, IntToString ( newRow ) )
	SayMessage (ot_position, message )
EndIf

if ( TableDetection()
&& newCol != prevCol )
	SayMessage(ot_position,ColHeader);
	message = FormatString ( msg_column, IntToString ( newCol ) )
	SayMessage (ot_position, message )
EndIf
SayLine()
EndFunction

