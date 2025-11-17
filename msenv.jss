; JAWS Script file for Microsoft Visual Studio.NET
; Copyright 2005-2015 by Freedom Scientific BLV Group, LLC

Include "HjGlobal.jsh" ; default HJ global variables
Include "hjconst.jsh" ; default HJ constants
Include "HjHelp.jsh" ; Help Topic Constants
Include "common.jsm" ; message file
Include "magic.jsh"
Include "magcodes.jsh"
include "WinStyles.jsh" ; Constants used by the GetWindowStyleBits function
;Newly added constants
include "msenv.jsh"
include "msenv.jsm"
use "braille.jsb"


Globals
	Object DTE, ;application object
	Object JFWAddin, ;JFWControl addin
	Object NULL, ;used to dereference objects in the scripts
	int gErrorLevel,  ;The error level to be announced
	int gUserBuffer,
	int gEditorFocusTime, ;time the editor last got focus
	int gReadTooltip, ;specifies whether or not to read tooltip
	int gVPCSetting, ;holds the user's VPC option,
	int gSayAll, ; Is a SayAll in progress
	int giPriorIndent ;the previous indentation level
;includes the ToggleErrorAnnounce in list
Script AdjustJAWSVerbosity ()
var
	string strList
let strList = vsmsgToggle ;|ToggleErrorAnnounce:Announce errors
JAWSVerbosityCore (strList)
EndScript

;function to control speaking of different error levels in code editor
String Function ToggleErrorAnnounce (int iRetCurVal)
var
	int iErrorLevel
let iErrorLevel = IniReadInteger ("Toggles", "ErrorLevel", -1, "msenv.ini")
if not iRetCurVal then ; update error level
	let iErrorLevel = iErrorLevel + 1
	if iErrorLevel == 4 then ;error level needs to be set to 0
		let iErrorLevel = 0
	EndIf ;error level needs to be set to 0
	IniWriteInteger ("Toggles", "ErrorLevel", iErrorLevel, "msenv.ini")
EndIf ; update error level
let gErrorLevel = iErrorLevel
;now return the value
if gErrorLevel==0 then ;errors off
	return vsmsgErrorLevelOff
EndIf ;errors off
if gErrorLevel==vsTaskPriorityLow then ;errors low
	return vsmsgErrorLevelLow
EndIf ;errors low
if gErrorLevel==vsTaskPriorityMedium then ;errors medium
	return vsmsgErrorLevelMedium
EndIf ;errors medium
if gErrorLevel==vsTaskPriorityHigh then ;errors high
	return vsmsgErrorLevelHigh
EndIf ;errors high
EndFunction


;function sets objects to null upon exitting vs.net
Void Function AutoFinishEvent ()
let DTE = NULL
let JFWAddin = NULL
EndFunction

;function initializes add-in and application objects
Void Function AutoStartEvent ()
if (GetProgramVersion (GetAppFilePath ()) == 8)then ;we are in VS.NET 2005
	SwitchToConfiguration ("msenv2005")
	return
EndIf
let giPriorIndent = 0
let gSayAll = false ;no sayall is in progress
;place saved VPC option in a variable
let gVPCSetting = GetJCFOption (OPT_VIRTUAL_PC_CURSOR)
;set initial error announcement level
ToggleErrorAnnounce (TRUE)
;make sure first tooltip for QuickInfo is not announced
let gReadTooltip = FALSE
;activate MSAA option
SetJCFOption (OPT_MSAA_MODE, 2)
;check to see if JFWControl.dll is in the windows system directory
if !FindWindowsSystemFile ("JFWControl.dll") then ;JFWControl.dll is not found
	ExMessageBox (FormatString(vsmsgStartupText), FormatString(vsmsgStartupTitle),
		MB_OK | MB_ICONERROR | MB_SYSTEMMODAL)
EndIf ;JFWControl.dll is not found
ScheduleFunction ("InitializeGlobals", 20)
EndFunction


;announces the location and overlapping status of a control in the HTML and Window Forms designers
Script ReadControl ()
if ! DialogActive ()
&& JFWAddin.IsFormDesigner()
&& not IsTextDocument() then ;in a windows forms window
	Say(JFWAddin.GetLocation(), OT_USER_REQUESTED_INFORMATION)
ElIf ! DialogActive ()
&& JFWAddin.IsHTMLDesigner()
&& ! IsHTMLDocument() then ;in an HTML designer window
	Say(JFWAddin.GetHTMLInfo(), OT_USER_REQUESTED_INFORMATION)
EndIf ;in an HTML designer window
EndScript


;function keeps calling itself until application and add-in objects are initialized
Void Function InitializeGlobals ()
var
	object objAddin, ;holds reference to add-in objects
	int i

;try to get application object for vs.net
let DTE = GetObject("VisualStudio.DTE")
if ! DTE then ;could not get VS.NET application
	;try to get object appending 7 (needed when using two versions of VS.NET on same machine)
	let DTE = GetObject("VisualStudio.DTE.7.1")
EndIf ;could not get VS.NET application
;If not updated to 7.1, revert to 7.0 object
if ! DTE then ;could not get VS.NET application
	let DTE = GetObject("VisualStudio.DTE.7")
EndIf ;could not get VS.NET application

;loop through all add-ins to find JFWControl
let i = 1
While (i <= DTE.Addins.Count)
	let objAddin = DTE.Addins.Item(i)
	let i = i + 1
	if StringLower (objAddin.Name) == "jfwcontrol" then ;JFWControl found
		let JFWAddin = objAddin.Object
	EndIf ;JFWControl found
EndWhile
let objAddin = NULL
if Not JFWAddin.Loaded  then ;in case JFWControl not found
	ScheduleFunction ("InitializeGlobals", 30)
else ;initialize other globals once addin loaded
	FocusChangedEvent (GetCurrentWindow (), 0)
EndIf ;in case JFWControl not found
EndFunction



;display help
Script HotKeyHelp()
var
	string strHelp
if TouchNavigationHotKeys() then
	return
endIf
let strHelp = vsmsg1_H
if (UserBufferIsActive ()) then ;virtual buffer in use
	UserBufferDeactivate ()
EndIf ;virtual buffer in use
SayFormattedMessage (OT_USER_Buffer, strHelp)
UserBufferAddText (cScBufferNewLine, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
EndScript

;function tests for code editor being active
Int Function IsTextDocument ()
var
	int bolReturn,
	string strWindowType
 let bolReturn = FALSE
if ! DialogActive ()
	&& IsReadableWindow () then ;not a dialog and GetLine will work
	if IsPCCursor ()
	&& GetWindowClass (GetFocus ()) == strEditorClass then ;PCCursor active and not a form designer
		if ! GlobalMenuMode then ;menu inactive
			if ! UserBufferIsActive () then ;user buffer not active
				let bolReturn = TRUE
			endIf ;user buffer not active
		EndIf ;menu inactive
	EndIf ;PCCursor active and not a form designer
EndIf ;dialog inactive and a code editor/form active
return bolReturn
EndFunction

;script to close all but the currently active window
Script CloseNonactiveWindows ()
if UserBufferIsActive () then ;user buffer active
	UserBufferDeactivate ()
EndIf ;user buffer active
SayMessage (OT_JAWS_MESSAGE, vsmsg1_L, vsmsg1_S) ;Closin nonactive windows
JFWAddin.CloseNonActiveWindows()
EndScript

;gets a list of CodeElements at module level and moves to selection
Script MoveToCode ()
var
	int i,
	string sList
if IsTextDocument() then ;in a code editor
	let i = 0
	let sList = JFWAddin.GetCodeList() ;get list of code elements
	if sList == C_UNABLE_TO_GET_CLASS then ;can't get list of code elements
		MessageBox (sList)
	else
		let i = DlgSelectItemInList (sList, vsmsg13, False) ;Select Function to Move to
		if i > 0 then ;user selected an element
			JFWAddin.MoveToCodeElement(i)
		EndIf ;user selected an element
	EndIf ;can't get list of code elements
EndIf ;in a code editor
EndScript

;make all currently open windows floating
Script MakeWindowsFloating ()
JFWAddin.MakeWindowsFloating()
SayMessage (OT_JAWS_MESSAGE, vsmsg2_L, vsmsg2_S) ;make windows floating
EndScript

;list all currently open windows and move to selection
Script ListWindows ()
var
	int iSelected,
	string strCaption,
	string strList,
	int i,
	string sWindowList
let i = 1
;loop through all visible windows and add to list
while (i <= DTE.Windows.Count)
	if DTE.Windows.Item(i).Visible then ;window visible
		let strCaption = DTE.Windows.Item(i).Caption
		if not StringIsBlank (strList) then ;is the list empty
			let strList = strList + "|" + strCaption
		else
			let strList = strCaption
		EndIf ;is the list empty
		;construct list of windows #s
	let sWindowList = sWindowList + IntToString(i) + "|"
	EndIf ;window visible
	let i = i + 1
EndWhile
let iSelected = DlgSelectItemInList (strList, vsmsg12, FALSE)
let iSelected = StringToInt(StringSegment (sWindowList, "|", iSelected))
DTE.Windows.Item(iSelected).Activate
EndScript


Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId, handle prevHwnd, int prevObjectId, int prevChildId)
var
	string strLine,
	int TheTypeCode
;statement completion window
if (GetWindowClass (curHwnd) == strCompletionClass) then
	return
EndIf

;close dynamic help if in the object browser
if JFWAddin.gActiveWindow == vsWindowKindObjectBrowser then
	DTE.Windows.item(vsWindowKindDynamicHelp).Close
EndIf
;handle overspeaking of treeview in solution explorer
let TheTypeCode = GetWindowSubTypeCode (GetCurrentWindow ())
If ! TheTypeCode then ;TypeCode not set
	Let TheTypeCode = GetObjectSubTypeCode ()
EndIf ;TypeCode not set
If ((TheTypeCode == WT_TREEVIEW) ||
		(TheTypeCode==WT_TREEVIEWITEM)) then ;in a treeview
	SayTreeViewLevel ()
	return
EndIf ;in a treeview
If (TheTypeCode == WT_EXTENDEDSELECT_LISTBOX) then ;in a WT_EXTENDEDSELECT_LISTBOX
	SayChunk()
	Say (PositionInGroup (), OT_POSITION, FALSE)
	return
EndIf ;in a WT_EXTENDEDSELECT_LISTBOX
ActiveItemChangedEvent (curHwnd,curObjectId, curChildId,prevHwnd, prevObjectId, prevChildId)
EndFunction


Script SayBottomLineOfWindow ()
var
	handle hStatusbar
If IsTextDocument () Then ;in a textdocument
	let hStatusbar = FindWindow (GetAppMainWindow (GetCurrentWindow()), "msctls_statusbar32", "")
	Say (GetWindowText (hStatusbar, FALSE),OT_SCREEN_MESSAGE, FALSE)
Else
	Say (DTE.Statusbar.Text, OT_SCREEN_MESSAGE)
EndIf
EndScript


Script SayWindowTitle ()
var
	string strTitle
if handleNoCurrentWindow() then
	return
endIf
let strTitle = DTE.ActiveWindow.Caption
if JFWAddin.gActiveWindow == vsWindowKindToolbox then ;in a toolbox window
	let strTitle = strTitle + FormatStringWithEmbeddedFunctions (vsmsg5)
EndIf ;in a toolbox window
Say(strTitle,OT_DOCUMENT_NAME)
EndScript


Int Function HandleCustomWindows (handle hWnd)
var
	object objWin
if (GetWindowClass (GetFocus ())==strEditorClass) then
	return true
EndIf
;code to handle HTML designer
if ! DialogActive ()
&& JFWAddin.IsHTMLDesigner()
&& ! IsHTMLDocument () then ;HTML designer window active
	if ! GlobalMenuMode then ;menu not active
		SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 0)
		PerformScript ReadControl()
		return TRUE
	EndIf ;menu not active
EndIf ;HTML designer window active
;turn on virtual cursor because we are not in html designer
SetJCFOption (OPT_VIRTUAL_PC_CURSOR, gVPCSetting)
;code to handle Win Forms designer
if ! DialogActive () then
	if JFWAddin.IsFormDesigner() then
		if ! IsTextDocument() then ;in a windows forms designer
				if ! GlobalMenuMode then ;not in a menu
					PerformScript ReadControl()				EndIf ;not in a menu
					return TRUE
		EndIf ;in a windows forms designer
	endif
endif
Return FALSE
EndFunction


Script ReadControlSize ()
if ! DialogActive ()
&& JFWAddin.IsFormDesigner()
&& ! IsTextDocument() then ;in a windows forms designer
	Say(JFWAddin.GetSize(), OT_USER_REQUESTED_INFORMATION)
ElIf ! DialogActive ()
&& JFWAddin.IsHTMLDesigner()
&& ! IsHTMLDocument() then ;in an HTML designer
	Say(JFWAddin.GetHTMLSize(), OT_USER_REQUESTED_INFORMATION)
EndIf ;in an HTML designer
EndScript



Int Function IsHTMLDocument ()
var
	int bolReturn
let bolReturn = FALSE
if ! DialogActive ()
&& JFWAddin.gActiveWindow == vsDocumentKindHTML then ;dialog not active and window is HTML
	if IsPCCursor ()
	&& GetWindowClass (GetFocus ()) == strEditorClass then ;PCCursor and edit window
		if ! GlobalMenuMode then ;menu not active
			let bolReturn = TRUE
		EndIf ;menu not active
	EndIf ;PCCursor and edit window
EndIf ;dialog not active and window is HTML
return bolReturn
EndFunction


Script ScriptFileName ()
ScriptAndAppNames(vsmsg3_L) ;Visual Studio .NET
EndScript


Script MoveToComponent ()
if ! DialogActive ()
&& JFWAddin.IsFormDesigner()
&& ! IsTextDocument() then ;in a windows forms window
	WindowComponents ()
Else
	SayMessage (OT_JAWS_MESSAGE, vsmsg6_L, vsmsg6_S) ;Not currently in a windows form
EndIf ;in a windows forms window
EndScript


Void Function WindowComponents ()
var
	int iSelected,
	string strList
let strList = JFWAddin.GetComponentList()
let iSelected = DlgSelectItemInList (strList, vsmsg14, FALSE) ;Select the control to move to:
if iSelected then ;user selected a component
	JFWAddin.MoveToComponent(iSelected)
EndIf ;user selected a component
EndFunction

String Function AnnounceActiveTab ()
var
	object win,
	object objToolbox,
	string strReturn
let win = DTE.Windows.Item(vsWindowKindToolbox)
let objToolbox = win.Object
let strReturn = objToolbox.ActiveTab.Name
;dereference objects
let win = NULL
let objToolbox = NULL
return strReturn
EndFunction




;code editor functions


Script SayNextLine ()
SayNextLine()



EndScript

Int Function SayNextLine ()
var
	string strLine,
	string strError,
	int TheTypeCode,
	int iOutputType
if gSayAll then
	let iOutputType=OT_SAYALL
else
	let iOutputType=OT_line
endIf
If ! IsPCCursor () Then
	PerformScript SayNextLine()
	Return saSayAllUnsupported
EndIf
if IsTextDocument()
|| IsHTMLDocument () then ;in a code editor window
	if JFWAddin.CurrentLineNum == JFWAddin.NumLines() then
		Return saSayAllEndOfDocument
	EndIf
	NextLine()
	Pause ()
	;get the line of text
	let strLine = JFWAddin.GetLine()
	;announce indentation if it has changed
	AnnounceIndentation(strLine)
	;markup string with characteristics
	let strLine = smmMarkupString (strLine, smmGetSpeechMarkupTextOptions (iOutputType), 0, GetControlAttributes (), GetCharacterAttributes (), GetFont (), GetCharacterPoints (), GetColorText (), GetColorBackground (), GetJFWLang ())
	say(strLine,iOutputType,TRUE)
	;announce errors on a line
	let strError = JFWAddin.GetTaskAtLine(gErrorLevel)
	if (strError) then
		Say(JFWAddin.GetTaskAtLine(gErrorLevel),OT_USER_REQUESTED_INFORMATION)
	EndIf
	Return saSayAllUnitSpoken
EndIf ;in a code editor window

;handle overspeaking of treeview in solution explorer
let TheTypeCode = GetWindowSubTypeCode (GetCurrentWindow ())
If ! TheTypeCode then ;TypeCode not set
	Let TheTypeCode = GetObjectSubTypeCode ()
EndIf ;TypeCode not set
If ((TheTypeCode == WT_TREEVIEW) ||
		(TheTypeCode==WT_TREEVIEWITEM)) then ;in a treeview
	NextLine ()
	return saSayAllUnsupported
ElIf (TheTypeCode == WT_EXTENDEDSELECT_LISTBOX) then ;in a WT_EXTENDEDSELECT_LISTBOX
	NextLine ()
	return saSayAllUnsupported
Else
	PerformScript SayNextLine()
EndIf ; Not a tree view or List view item

EndFunction


Script SayPriorLine ()
var
	int TheTypeCode,
	string strLine,
	string strError
If ! IsPCCursor () Then
	PerformScript SayPriorLine()
	Return
EndIf
if IsTextDocument()
|| IsHTMLDocument () then ;in a code editor window
	PriorLine()
	;get the line of text
	let strLine = JFWAddin.GetLine()
	;announce indentation if it has changed
	AnnounceIndentation(strLine)
	;markup string with characteristics
	let strLine = smmMarkupString (strLine, smmGetSpeechMarkupTextOptions (OT_LINE), 0, GetControlAttributes (), GetCharacterAttributes (), GetFont (), GetCharacterPoints (), GetColorText (), GetColorBackground (), GetJFWLang ())
	say(strLine,OT_LINE,TRUE)
	;announce errors on a line
	let strError = JFWAddin.GetTaskAtLine(gErrorLevel)
	if (strError) then
		Say(JFWAddin.GetTaskAtLine(gErrorLevel),OT_USER_REQUESTED_INFORMATION)
	EndIf
	Return
EndIf ;in a code editor window
;handle overspeaking of treeview in solution explorer
let TheTypeCode = GetWindowSubTypeCode (GetCurrentWindow ())
If ! TheTypeCode then ;TypeCode not set
	Let TheTypeCode = GetObjectSubTypeCode ()
EndIf ;TypeCode not set
If ((TheTypeCode == WT_TREEVIEW) ||
		(TheTypeCode==WT_TREEVIEWITEM)) then ;in a treeview
	PriorLine ()
	return
ElIf (TheTypeCode == WT_EXTENDEDSELECT_LISTBOX) then ;in a WT_EXTENDEDSELECT_LISTBOX
	PriorLine ()
	return
Else
	PerformScript SayPriorLine()
EndIf
EndScript


Script SayLine ()
if handleNoCurrentWindow() then
	return
endIf
SayLine()
EndScript

Int Function SayLine (optional Int iDrawHighlights, optional int bSayingLineAfterMovement)
var
	string strLine,
	int TheTypeCode,
	int iOutputType
if gSayAll then
	let iOutputType=OT_SAYALL
else
	let iOutputType=OT_line
endIf
If ! IsPCCursor () Then
	PerformScript SayLine()
	Return saSayAllUnsupported
EndIf
if IsTextDocument()
|| IsHTMLDocument () then ;in a code editor window
	;get the line of text
	let strLine = JFWAddin.GetLine()
	If IsSameScript () then
		SpellString (strLine)
	Else
		;announce indentation if it has changed
		AnnounceIndentation(strLine)
		;markup string with characteristics
		let strLine = smmMarkupString (strLine, smmGetSpeechMarkupTextOptions (iOutputType), 0, GetControlAttributes (), GetCharacterAttributes (), GetFont (), GetCharacterPoints (), GetColorText (), GetColorBackground (), GetJFWLang ())
		say(strLine,iOutputType,TRUE)
		;announce errors on a line
		Say(JFWAddin.GetTaskAtLine(gErrorLevel),OT_USER_REQUESTED_INFORMATION)
	EndIf
	return saSayAllUnitSpoken
EndIf ;in a code editor window
If GlobalMenuMode then
	SayObjectActiveItem()
	Return saSayAllUnsupported
EndIf
;handle overspeaking of treeview in solution explorer
let TheTypeCode = GetWindowSubTypeCode (GetCurrentWindow ())
If ! TheTypeCode then ;TypeCode not set
	Let TheTypeCode = GetObjectSubTypeCode ()
EndIf ;TypeCode not set
If (TheTypeCode == WT_TREEVIEW) then ;in a treeview
	SayTreeViewLevel ()
	return saSayAllUnsupported
ElIf (TheTypeCode == WT_EXTENDEDSELECT_LISTBOX) then ;in a WT_EXTENDEDSELECT_LISTBOX
	SayObjectActiveItem()
	return saSayAllUnsupported
Else
	PerformScript SayLine()
EndIf
Return saSayAllUnsupported
EndFunction


Script SayNextCharacter ()
var
	string strChar,
	int TheTypeCode
If ! IsPCCursor () Then
	PerformScript SayNextCharacter()
	Return
EndIf
if IsTextDocument()
|| IsHTMLDocument () then ;in a code editor window
	NextCharacter ()
	;get the current character
	let strChar = JFWAddin.GetCharacter()
	;markup the character
	let strChar = smmMarkupString (strChar, smmGetSpeechMarkupTextOptions (OT_CHAR), 0, GetControlAttributes (), GetCharacterAttributes (), GetFont (), GetCharacterPoints (), GetColorText (), GetColorBackground (), GetJFWLang ())
	say(strChar,OT_CHAR,TRUE)
	Return
EndIf ;in a code editor window
;handle overspeaking of treeview in solution explorer
let TheTypeCode = GetWindowSubTypeCode (GetCurrentWindow ())
If ! TheTypeCode then ;TypeCode not set
	Let TheTypeCode = GetObjectSubTypeCode ()
EndIf ;TypeCode not set
If ((TheTypeCode == WT_TREEVIEW) ||
		(TheTypeCode==WT_TREEVIEWITEM)) then ;in a treeview
	NextCharacter ()
	SayTreeViewLevel ()
	return
Else
	PerformScript SayNextCharacter()
EndIf
EndScript

Script SayPriorCharacter ()
var
	string strChar,
	int TheTypeCode
If ! IsPCCursor () Then
	PerformScript SayPriorCharacter()
	Return
EndIf
if IsTextDocument()
|| IsHTMLDocument () then ;in a code editor window
	PriorCharacter ()
	;get current character
	let strChar = JFWAddin.GetCharacter()
	;markup current character
	let strChar = smmMarkupString (strChar, smmGetSpeechMarkupTextOptions (OT_CHAR), 0, GetControlAttributes (), GetCharacterAttributes (), GetFont (), GetCharacterPoints (), GetColorText (), GetColorBackground (), GetJFWLang ())
	say(strChar,OT_CHAR,TRUE)
	Return
EndIf ;in a code editor window
;handle overspeaking of treeview in solution explorer
let TheTypeCode = GetWindowSubTypeCode (GetCurrentWindow ())
If ! TheTypeCode then ;TypeCode not set
	Let TheTypeCode = GetObjectSubTypeCode ()
EndIf ;TypeCode not set
If ((TheTypeCode == WT_TREEVIEW) ||
		(TheTypeCode==WT_TREEVIEWITEM)) then ;in a treeview
	PriorCharacter ()
	return
Else
	PerformScript SayPriorCharacter()
EndIf
EndScript

Script SayNextWord ()
var
	string strWord
If ! IsPCCursor () Then
	PerformScript SayNextWord()
	Return
EndIf
if IsTextDocument()
|| IsHTMLDocument () then ;in a code editor window
	;get next word
	let strWord = JFWAddin.MoveByWord(C_RIGHT)
	;markup word
	let strWord = smmMarkupString (strWord, smmGetSpeechMarkupTextOptions (OT_WORD), 0, 0, 0, GetCharacterFont (), GetCharacterPoints (), GetColorText (), GetColorBackground (), GetJFWLang ())
	Say(strWord,OT_WORD,TRUE)
	return
EndIf ;in a code editor window
;check to see if we are in the forms designer
if (! DialogActive ()&& JFWAddin.IsFormDesigner()) then
	TypeCurrentScriptKey ()
	PerformScript ReadControl()
	return
EndIf
PerformScript SayNextWord()
EndScript

Script SayPriorWord ()
var
	string strWord
If ! IsPCCursor () Then
	PerformScript SayPriorWord()
	Return
EndIf
if IsTextDocument()
|| IsHTMLDocument () then ;in a code editor
	;move to prior word and retrieve it
	let strWord = JFWAddin.MoveByWord(C_LEFT)
	;markup word
	let strWord = smmMarkupString (strWord, smmGetSpeechMarkupTextOptions (OT_WORD), 0, 0, 0, GetCharacterFont (), GetCharacterPoints (), GetColorText (), GetColorBackground (), GetJFWLang ())
	Say(strWord,OT_WORD,TRUE)
	Return
EndIf ;in a code editor
;check to see if we are in the forms designer
if (! DialogActive ()&& JFWAddin.IsFormDesigner()) then
	TypeCurrentScriptKey ()
	PerformScript ReadControl()
	return
EndIf
PerformScript SayPriorWord()
EndScript

Script TopOfFile ()
If ! IsPCCursor () Then
	PerformScript TopOfFile()
	Return
EndIf
if IsTextDocument()
|| IsHTMLDocument () then ;in a code editor
	SayFormattedMessage (ot_JAWS_message, cmsg36_L, cmsg36_S) ;top of file
	JFWAddin.TopOfFile()
	PerformScript SayLine()
	Return
EndIf ;in a code editor
PerformScript TopOfFile()
EndScript

Script BottomOfFile ()
If ! IsPCCursor () Then
	PerformScript BottomOfFile()
	Return
EndIf
if IsTextDocument()
|| IsHTMLDocument () then ;in a code editor window
	SayFormattedMessage (ot_JAWS_message, cmsg37_L, cmsg37_S) ;bottom of file
	JFWAddin.BottomOfFile()
	PerformScript SayLine()
	Return
EndIf ;in a code editor window
PerformScript BottomOfFile()
EndScript

Script SelectNextWord ()
if IsTextDocument ()
|| IsHTMLDocument () then
	let nSelectingText = true
	say (cmsg215_L, OT_SELECTED) ;Selected
	Say (JFWAddin.SelectWord(C_RIGHT), OT_WORD)
	return
EndIf
;check to see if we are in the forms designer
if (! DialogActive ()&& JFWAddin.IsFormDesigner()) then
	TypeKey(cksSelectNextWord)
	PerformScript ReadControlSize()
	return
EndIf
PerformScript SelectNextWord()
EndScript

Script SelectPriorWord ()
if IsTextDocument()
|| IsHTMLDocument () then ;in a code editor
	let nSelectingText = true
	say (cmsg215_L, OT_SELECTED) ;Selected
	Say (JFWAddin.SelectWord(C_LEFT), OT_WORD)
	Return
EndIf
;check to see if we are in the forms designer
if (! DialogActive ()&& JFWAddin.IsFormDesigner()) then
	TypeKey(cksSelectPriorWord)
	PerformScript ReadControlSize()
	return
EndIf
PerformScript SelectPriorWord()
EndScript

Script SelectNextLine ()
if IsTextDocument()
|| IsHTMLDocument () then ;in a code editor
	let nSelectingText = true
	say (cMsgSelected, OT_SELECTED) ;Selected
	say(JFWAddin.SelectLine(C_DOWN),OT_STRING)
	Return
EndIf
;check to see if we are in the forms designer
if (! DialogActive ()&& JFWAddin.IsFormDesigner()) then
	TypeKey(cksSelectNextLine)
	PerformScript ReadControlSize()
	return
EndIf
PerformScript SelectNextLine()
EndScript

Script SelectPriorLine ()
if IsTextDocument()
|| IsHTMLDocument () then ;in a code editor
	let nSelectingText = true
	say (cMsgSelected,OT_SELECTED) ;Selected
	say(JFWAddin.SelectLine(C_UP),OT_STRING)
	Return
EndIf
;check to see if we are in the forms designer
if (! DialogActive ()&& JFWAddin.IsFormDesigner()) then
	TypeKey(cksSelectPriorLine)
	PerformScript ReadControlSize()
	return
EndIf
PerformScript SelectPriorLine()
EndScript

Script JAWSDelete ()
var
	string strChar
if IsTextDocument()
|| IsHTMLDocument () then ;in a code editor
	TypeCurrentScriptKey ()
	;get current character
	let strChar = JFWAddin.GetCharacter()
	;markup current character
	let strChar = smmMarkupString (strChar, smmGetSpeechMarkupTextOptions (OT_CHAR), 0, GetControlAttributes (), GetCharacterAttributes (), GetFont (), GetCharacterPoints (), GetColorText (), GetColorBackground (), GetJFWLang ())
	say(strChar,OT_CHAR,TRUE)
	Return
Else
	PerformScript JAWSDelete()
EndIf ;in a code editor
EndScript

Script JAWSBackspace ()
var
	string strChar
if IsTextDocument()
|| IsHTMLDocument () then ;in a code editor window
	;perform backspace
	let strChar = JFWAddin.DeleteCharacter(C_LEFT)
	;markup deleted character
	let strChar = smmMarkupString (strChar, smmGetSpeechMarkupTextOptions (OT_CHAR), 0, GetControlAttributes (), GetCharacterAttributes (), GetFont (), GetCharacterPoints (), GetColorText (), GetColorBackground (), GetJFWLang ())
	say(strChar,OT_CHAR,TRUE)
	Return
Else
	PerformScript JAWSBackspace()
EndIf ;in a code editor window
EndScript

Script SayCharacter ()
var
	int nTimesPressed,
	string strChar
if handleNoCurrentWindow() then
	return
endIf
If ! IsPCCursor () Then
	PerformScript SayCharacter()
	Return
EndIf
if IsTextDocument()
|| IsHTMLDocument () then ;in a code editor
	;get current character
	let strChar = JFWAddin.GetCharacter()
	;markup character
	let strChar = smmMarkupString (strChar, smmGetSpeechMarkupTextOptions (OT_CHAR), 0, GetControlAttributes (), GetCharacterAttributes (), GetFont (), GetCharacterPoints (), GetColorText (), GetColorBackground (), GetJFWLang ())
	let nTimesPressed=IsSameScript ()
	if (nTimesPressed==2) then
		SayCharacterValue()
		AddHook (HK_SCRIPT, "CharacterValueHook")
	elif nTimesPressed then
		SayCharacterPhonetic ()
		AddHook (HK_SCRIPT, "PhoneticSpellHook")
	else
		say(strChar,OT_CHAR,TRUE)
		Return
EndIf
Else
	PerformScript SayCharacter()
EndIf 	;in a code editor
EndScript



Script StatementCompletion ()
var
	string strKey
let strKey = JFWAddin.GetKey("Edit.CompleteWord")
let strKey = stringChopLeft (strKey,StringLength (StringSegment (strKey, "::", 1))+2)
SayMessage (OT_JAWS_MESSAGE, vsmsg9_L, vsmsg9_S) ;Statement Completion
TypeKey (strKey)
Pause()
Refresh ()
EndScript

Script IsAddinLoaded ()
if JFWAddin.Loaded  then ;JFWControl loaded
	Say (vsmsg10, OT_JAWS_MESSAGE, FALSE)
else
	Say (vsmsg11, OT_JAWS_MESSAGE, FALSE)
EndIf ;JFWControl loaded
EndScript


Script QuickInfo ()
var
	int iLen,
	string strKeys,
	string strKey1,
	string strKey2

;function assumes a two key combination is assigned to QuickInfo
let strKeys = JFWAddin.GetKey("Edit.QuickInfo")
let strKeys = stringChopLeft (strKeys,StringLength (StringSegment (strKeys, "::", 1))+2)
let strKey1 = StringSegment (strKeys, ",", 1)
let strKey2 = StringSegment (strKeys, ",", 2)
TypeKey (strKey1)
TypeKey (strKey2)
let gReadTooltip = true
EndScript

int function NewTextEventShouldBeSilent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
Var
	int iWinType
Let iWinType = GetWindowSubTypeCode (hWnd)
if iWinType == WT_TREEVIEW
|| iWinType ==WT_EXTENDEDSELECT_LISTBOX then
	return true
EndIf
return NewTextEventShouldBeSilent(hFocus, hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
EndFunction

Void Function ProcessSpeechOnNewTextEvent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
;reading tooltips:
if GetWindowClass(hwnd) == "VsTipWindow" then
	 ;debugging, read variable value
	if DTE.Mode == vsIDEModeDebug then
		Say (buffer, OT_HELP_BALLOON)
		Return
	;reading quick info tooltip
	elif gReadTooltip then
		Say (buffer, OT_HELP_BALLOON)
		let gReadTooltip = FALSE
		Return
	EndIf
EndIf
ProcessSpeechOnNewTextEvent(hFocus, hwnd, buffer, nAttributes,nTextColor, nBackgroundColor, nEcho, sFrameName)
EndFunction

Int Function IsPropertyWindow (int nX, int nY)
var
	int bolReturn
let bolReturn = FALSE
if ! DialogActive ()
&& JFWAddin.gActiveWindow == vsWindowKindProperties then ;check for property window
	if IsPCCursor ()
	&& GetWindowClass (GetWindowAtPoint (nX, nY)) == "WindowsForms10.EDIT.app1" then ;check if PCCursor and window at point is edit
		if ! GlobalMenuMode then
			if ! UserBufferIsActive () then
				let bolReturn = TRUE
			endIf ;User buffer is active
		EndIf ;in a menu
	EndIf ;check if PCCursor and window at point is edit
EndIf ;check for property window
Return bolReturn
EndFunction

Script UpALevel ()
;Check for output window being active
if JFWAddin.gActiveWindow == vsWindowKindOutput then ;output window active
	if UserBufferIsActive () then ;user buffer already active
		UserBufferDeactivate ()
	EndIf ;user buffer already active
	DTE.ActiveWindow.Close
	Return
EndIf ;output window active
PerformScript UpALevel()
EndScript


Void Function SayTreeviewLevel ()
var
	string sMessage,
	int iLevel,
	string sLevel
If (GetTreeViewLevel() != PreviousTreeviewLevel) then
	let iLevel = GetTreeviewLevel()
	let sLevel = IntToString (iLevel)
	let sMessage = FormatString (cmsg233_L, sLevel)
	SayFormattedMessage (OT_POSITION, sMessage, sLevel) ; "level "
	let PreviousTreeViewLevel= iLevel
endIf
If ! IsPcCursor () then
	SayLine()
	Return
EndIf
SayFormattedMessage (OT_LINE, GetObjectName() + cscSpace + GetObjectState ())
SayFormattedMessage (OT_POSITION, PositionInGroup ())
EndFunction

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue, int bIsFocusObject)
Var
	int TheTypeCode
let TheTypeCode = GetWindowSubtypeCode (hWnd)
ValueChangedEvent (hwnd, objId, childId, nObjType, sObjName, sObjValue, bIsFocusObject)
EndFunction

Script VirtualPCCursorToggle ()
PerformScript VirtualPCCursorToggle()
let gVPCSetting = GetJCFOption (OPT_VIRTUAL_PC_CURSOR)
EndScript

/* SayAll functions */
Script SayAll ()
SetJCFOption (opt_Say_All_Mode, saSayAllByLine)
PerformScript SayAll()
EndScript

int function SayAllSpeakUnit(int iSayAllMode, int iSpeakNext)
if !IsTextDocument ()then
	; let internal code handle the SayAll
	return SASayAllUnsupported
endIf
if !iSpeakNext then
	let gSayAll=true
endIf
if iSpeakNext then
	return SayNextLine() ; this will return saSayAllUnitSpoken or saSayAllEndOfDocument
else
	return SayLine() ; this will return saSayAllUnitSpoken or saSayAllEndOfDocument
EndIf

endFunction

void function SayAllRelocateCursor(int iSayAllMode,int iUnitsToRetreat,int iWordsSpokenInCurrentUnit)
if iUnitsToRetreat then
; negate it so we move backward
	let iUnitsToRetreat=(-1)*iUnitsToRetreat
	if iSayAllMode==1 then
		; move back by sentences
	Elif iSayAllMode==2 then
		;move back by paragraphs
	endIf
endIf
if (iWordsSpokenInCurrentUnit > 0) then
;	oWord.selection.move(wdWord,iWordsSpokenInCurrentUnit)
endIf
SayWord() ; speak word on which cursor lands when SayAll is stopped by user.
let gSayAll=false
endFunction


Int Function IsReadableWindow ()
var
	string strWindowType,
	int bolReturn
let bolReturn = false
let strWindowType = JFWAddin.gActiveWindow
if (strWindowType== vsDocumentKindText ||
	strWindowType==vsWindowKindFindResults1 ||
	strWindowType == vsWindowKindOutput) then  ;dialog inactive and a code editor/form/results/output active
	let bolReturn = true
EndIf
return bolReturn


EndFunction

;announces the indentation if the scheme supports it.
Void Function AnnounceIndentation (string strLine)
var
	int iCurrentIndent
let iCurrentIndent = StringLength (strLine)-StringLength (StringTrimLeadingBlanks (strLine))
If ((smmGetSpeechMarkupTextOptions (OT_LINE)&ToIndent) && (iCurrentIndent!=giPriorIndent)) then
	Say(IntToString (iCurrentIndent),OT_JAWS_MESSAGE,TRUE)
	let giPriorIndent = iCurrentIndent
EndIf



EndFunction
Void Function SayHighLightedText (handle hwnd, string buffer)
var
	int TheTypeCode
let TheTypeCode = GetWindowSubtypeCode (hWnd)
if (!TheTypeCode) then
	let TheTypeCode = GetObjectSubTypeCode ()
EndIf
if ((TheTypeCode==WT_TREEVIEW) ||
		(TheTypeCode==WT_TREEVIEWITEM)) then
	return
EndIf

if (GetWindowClass (hwnd) == strCompletionClass) then
	SayChunk ()
	return
EndIf
SayHighLightedText (hwnd, buffer)

EndFunction


Void Function SayFocusedWindow()
var
	int TheTypeCode
let TheTypeCode = GetObjectSubTypeCode ()
if (TheTypeCode==WT_MENUBAR) then
	SayObjectTypeAndText ()
	Return
EndIf
SayFocusedWindow ()
EndFunction


Script ControlDownArrow ()
;check to see if we are in the forms designer
if (! DialogActive ()&& JFWAddin.IsFormDesigner()) then
	TypeCurrentScriptKey ()
	PerformScript ReadControl()
	return
EndIf
PerformScript ControlDownArrow()
EndScript

Script ControlUpArrow ()
;check to see if we are in the forms designer
if (! DialogActive ()&& JFWAddin.IsFormDesigner()) then
	TypeCurrentScriptKey ()
	PerformScript ReadControl()
	return
EndIf
PerformScript ControlUpArrow()
EndScript

Script SelectNextCharacter ()
;check to see if we are in the forms designer
if (! DialogActive ()&& JFWAddin.IsFormDesigner()) then
	TypeKey(cksSelectNextCharacter)
	PerformScript ReadControlSize()
	return
EndIf
PerformScript SelectNextCharacter()
EndScript

Script SelectPriorCharacter ()
;check to see if we are in the forms designer
if (! DialogActive ()&& JFWAddin.IsFormDesigner()) then
	TypeKey(cksSelectPriorCharacter)
	PerformScript ReadControlSize()
	return
EndIf
PerformScript SelectPriorCharacter()
EndScript

Script ControlShiftDownArrow ()
TypeKey(cksSelectNextParagraph)
;check to see if we are in the forms designer
if (! DialogActive ()&& JFWAddin.IsFormDesigner()) then
	PerformScript ReadControlSize()
	return
EndIf
EndScript

Script ControlShiftUpArrow ()
TypeKey(cksSelectPriorParagraph)
;check to see if we are in the forms designer
if (! DialogActive ()&& JFWAddin.IsFormDesigner()) then
	PerformScript ReadControlSize()
	return
EndIf
EndScript

Int Function DialogActive (optional int useTopWindowControlType)
var
	object objTest,
	int iRetVal,
	int iRole
let iRetVal = DialogActive (useTopWindowControlType)
let objTest = GetCurrentObject (0)
let objTest = objtest.accParent()
let iRole = objTest.accRole(0)
if (iRole==0) then
	let iRetVal = ACTIVE
EndIf
return iRetVal
EndFunction
