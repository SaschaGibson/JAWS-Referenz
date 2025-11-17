; JAWS script file for Theophilos version 2.6 and 3.0
; Copyright 1999-2015 by Freedom Scientific BLV Group, LLC

  include "hjHelp.jsh"
include "common.jsm"
include "theophil.jsm"
include "theophil.jsh"
include "hjconst.jsh"
include "hjglobal.jsh"

string Function getTheophilosVersion ()
return getVersionInfoString(getAppFilePath(), msg29_L)
EndFunction

Function AutoStartEvent ()
;* speaks intro message for Theophilos
let globalTheophilosVersion=getTheophilosVersion()
if not TheophilosRunOnce then
	let TheophilosRunOnce=true
	if not (globalTheophilosVersion==msg30_L || globalTheophilosVersion==msg31_L) then
		SayFormattedMessage (ot_error, msg28_L)
	endIf
	SayFormattedMessage (ot_app_start, msgAppStart1_L, msgAppStart1_S)
	endIf
EndFunction

string Function AddToString(String Base, String strNew)
	let Base = Base + strNew + cScBufferNewLine

	Return Base
EndFunction

Script screenSensitiveHelp ()
var
string sClass,
string sRealName
if menusActive() then
	performScript screenSensitiveHelp() ; default
	return
endIf
let sClass=getWindowClass(getFocus())
let sRealName=getWindowName(GetRealWindow(GetFocus()))

;* insert+f1 help for many of the screens in Theophilos
if (IsSameScript ()) then
	AppFileTopic(topic_Theophilos_Bible_Program)
	return
endIf
If UserBufferIsActive () then
	;Call Default to handle
	PerformScript ScreenSensitiveHelp()
	;UserBufferDeactivate ()
	;SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
if not (globalTheophilosVersion==msg30_L || globalTheophilosVersion==msg31_L) then
; warn that versions other than 2.6 and 3.0 have not been tested with JAWS 3.7
	SayFormattedMessage (ot_USER_BUFFER, msgHelp1_L, msgHelp1_S)
	AddHotKeyLinks ()
endIf
;wn1="Matthew Henry's Commentary"
if sRealName== wn1 then
	SayFormattedMessage (ot_USER_BUFFER, msgHelp2_L, msgHelp2_S)
	AddHotKeyLinks ()
Return
endIf
; wn2="Easton's Bible Dictionary"
if sRealName== wn2 then
	SayFormattedMessage (ot_USER_BUFFER, msgHelp3_L, msgHelp3_S)
	AddHotKeyLinks ()
Return
endIf
;wn3="Hitchcock's Bible Names Dictionary"
if sRealName== wn3 then
	SayFormattedMessage (ot_USER_BUFFER, msgHelp4_L, msgHelp4_S)
	AddHotKeyLinks ()
Return
endIf
;wn4="Copier"
if sRealName== wn4 then
	SayFormattedMessage (ot_USER_BUFFER, msgHelp5_L, msgHelp5_S)
	AddHotKeyLinks ()
Return
endIf
; wn5="Navigating"
if sRealName== wn5 then
	SayFormattedMessage (ot_USER_BUFFER, msgHelp6_L, msgHelp6_S)
	AddHotKeyLinks ()
Return
endIf
if sClass==wc_textWindow then
	SayFormattedMessage (ot_USER_BUFFER, msgHelp7_L, msgHelp7_S)
	AddHotKeyLinks ()
	return
elif sClass==wc_htmlViewer || sClass==wc_paintPanel then
	SayFormattedMessage (ot_USER_BUFFER, msgHelp8_L, msgHelp8_S)
	AddHotKeyLinks ()
	return
elif sClass==wc_jumpListGrid then
	SayFormattedMessage (ot_USER_BUFFER, msgHelp9_L, msgHelp9_S)
	AddHotKeyLinks ()
	return
elif sClass==wc_MDIClient then
	SayFormattedMessage (ot_USER_BUFFER, msgHelp10_L, msgHelp10_S)
	AddHotKeyLinks ()
elif sClass==wc_splash then
	SayFormattedMessage (ot_USER_BUFFER, msgHelp11_L, msgHelp11_S)
	AddHotKeyLinks ()
	return
endIf
performScript screenSensitiveHelp() ; default
EndScript

Script HotKeyHelp ()
if TouchNavigationHotKeys() then
	return
endIf
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
;* insert+h help for many of the screens in Theophilos
	SayFormattedMessage (ot_USER_BUFFER, msgHelp12_L, msgHelp12_S)
EndScript

Script WindowsHelp ()
var
	string sTemp_L,
	string sTemp_S
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
;* insert+w help, announces some windows short cut keys for Theophilos
	let sTemp_L = msgHelp13_L + cScBufferNewLine
	let sTemp_S = msgHelp13_S + cScBufferNewLine
if globalTheophilosVersion==msg30_L then
; v2.6
	let sTemp_L = AddToString(sTemp_L,msgHelp14_L)
	let sTemp_S = AddToString(sTemp_S,msgHelp14_S)
elif globalTheophilosVersion==msg31_L then
	let sTemp_L = AddToString(sTemp_L,msgHelp15_L)
	let sTemp_S = AddToString(sTemp_S,msgHelp15_S)
endIf
	let sTemp_L = AddToString(sTemp_L, msgHelp16_L)
	let sTemp_S = AddToString(sTemp_S, msgHelp16_L)
	SayFormattedMessage(OT_USER_BUFFER, sTemp_L, sTemp_S)
EndScript
;bor
Function GraphicsListHelper(int nLeft,int nTop,int nRight,int nBottom)
SaveCursor()
		InvisibleCursor()
		MoveTo (nLeft,nBottom-1)
				if (GetControlAttributes() &
CTRL_GRAYED) then
;skip this graphic
return TRUE
endIf
let g_strGraphicsList = g_strGraphicsList+list_item_separator+GetWord()
let g_strGraphicsListX = g_strGraphicsListX + list_item_separator+
IntToString(GetCursorRow())
let g_strGraphicsListY = g_strGraphicsListY + list_item_separator+
IntToString(GetCursorCol())
RestoreCursor()
return true
EndFunction

Script ToolbarButtonList ()
var
	int nIncludeGraphics,
int nIndex,
int nRowToClick,
int nColToClick
if InHJDialog () then
	SayFormattedMessage (OT_error, cMsg337_L, cMsg337_S)
	return
endIf
Refresh()
Delay(10)
SaveCursor()
let nIncludeGraphics = GetJcfOption(OPT_INCLUDE_GRAPHICS)
SetJcfOption (OPT_INCLUDE_GRAPHICS, 1) ; labeled graphics only
GraphicsEnumerate(GetAppMainWindow(GetFocus()),sc_1)
SetJcfOption (OPT_INCLUDE_GRAPHICS, nIncludeGraphics)
if  (g_strGraphicsList) then
; remove delimiters from lists
	let g_strGraphicsList=stringChopLeft(g_strGraphicsList,1)
	let g_strGraphicsListX=stringChopLeft(g_strGraphicsListX,1)
let g_strGraphicsListY=stringChopLeft(g_strGraphicsListY,1)

let nIndex = DlgSelectItemInList (g_strGraphicsList,msg1_L, FALSE);
let nRowToClick =
StringToInt(StringSegment(g_strGraphicsListX,list_item_separator,nIndex))
let nColToClick =
StringToInt(StringSegment(g_strGraphicsListY,list_item_separator,nIndex))
SaveCursor()
JAWSCursor()
MoveTo(nColToClick,nRowToClick)
Delay(10)
LeftMouseButton()
endIf
endScript

Script SetOptions ()
;* speaks the key stroke.
PcCursor ()
SayFormattedMessage (ot_JAWS_message, msg3_L) ; "SetOptions"
TypeKey (ks1)
EndScript

Script Copier ()
;* speaks the key stroke.
PcCursor ()
SayFormattedMessage (ot_JAWS_message, msg4_L) ; "Copier"
TypeKey (ks2)
EndScript

Script Navigator ()
;* speaks the key stroke.
PcCursor ()
SayFormattedMessage (ot_JAWS_message, msg5_L) ; "Navigator"
TypeKey (ks3)
EndScript

Script Finder ()
;* speaks the key stroke.
PcCursor ()
SayFormattedMessage (ot_JAWS_message, msg6_L) ; "Finder"
TypeKey (ks4)
EndScript

Script NewNoteSet ()
;* sppeaks the key stroke.
PcCursor ()
SayFormattedMessage (ot_JAWS_message, msg7_L) ; "NewNoteSet"
TypeKey (ks5)
EndScript

Script NewJumpList ()
;* speaks the key stroke.
PcCursor ()
SayFormattedMessage (ot_JAWS_message, msg8_L) ; "NewJumpList"
TypeKey (ks6)
EndScript

Script AttachMedia ()
;* speaks the key stroke.
PcCursor ()
SayFormattedMessage (ot_JAWS_message, msg9_L) ; "AttachMedia"
TypeKey (ks7)
EndScript

Script NewTopicsBook ()
;* speaks the key stroke
PcCursor ()
SayFormattedMessage (ot_JAWS_message, msg10_L) ; "NewTopicsBook"
TypeKey (ks8)
EndScript

Script PreviousWindow ()
;* speaks the key stroke
SayFormattedMessage (ot_JAWS_message, msg11_L) ; "PreviousWindow"
TypeKey (ks9)
EndScript

Script NextWindow ()
;* speaks the key stroke
SayFormattedMessage (ot_JAWS_message, msg12_L) ; "NextWindow"

TypeKey (ks10)
EndScript

Script FirstBookMark ()
;* speaks the key stroke
PcCursor ()
SayFormattedMessage (ot_JAWS_message, msg13_L) ; "FirstBookMark"
TypeKey (ks11)
Pause ()
SayLine()
EndScript

Script SecondBookMark ()
;* speaks the key stroke
PcCursor ()
SayFormattedMessage (ot_JAWS_message, msg14_L) ; "SecondBookMark"
TypeKey (ks12)
Pause ()
SayLine()
EndScript

Script ThirdBookMark ()
;* speaks the key stroke
PcCursor ()
SayFormattedMessage (ot_JAWS_message, msg15_L) ; "ThirdBookMark"
TypeKey (ks13)
Pause ()
SayLine()
EndScript

Script ForthBookMark ()
;* speaks the key stroke
PcCursor ()
SayFormattedMessage (ot_JAWS_message, msg16_L) ; "ForthBookMark"
TypeKey (ks14)
Pause ()
SayLine()
EndScript

Script FifthBookMark ()
;* speaks the key stroke
PcCursor ()
SayFormattedMessage (ot_JAWS_message, msg17_L) ; "FifthBookMark"
TypeKey (ks15)
Pause ()
SayLine()
EndScript

Script SixthBookMark ()
;* speaks the key stroke
PcCursor ()
SayFormattedMessage (ot_JAWS_message, msg18_L) ; "SixthBookMark"
TypeKey (ks16)
Pause ()
SayLine()
EndScript

Script SeventhBookMark ()
;* speaks the key stroke
PcCursor ()
SayFormattedMessage (ot_JAWS_message, msg19_L) ; "SeventhBookMark"
TypeKey (ks17)
Pause ()
SayLine()
EndScript

Script eighthBookMark ()
;* speaks the key stroke
PcCursor ()
SayFormattedMessage (ot_JAWS_message, msg20_L) ; "EighthBookMark"
TypeKey (ks18)
Pause ()
sayLine()
EndScript

Script NinthBookMark ()
;* speaks the key stroke
PcCursor ()
SayFormattedMessage (ot_JAWS_message, msg21_L) ; "NinthBookMark"
TypeKey (ks19)
Pause ()
SayLine()
EndScript

Script ZeroBookMark ()
;* speaks the key stroke
PcCursor ()
SayFormattedMessage (ot_JAWS_message, msg22_L) ; "ZeroBookMark"
TypeKey (ks20)
Pause ()
sayLine()
EndScript

Script SetFirstBookMark ()
;* speaks the key stroke and assigns the current verse to the first bookmark
SayFormattedMessage (ot_JAWS_message, formatString(msg23_L, msg13_L)) ; "SetFirstBookMark"
TypeKey (ks21)
EndScript

Script SetSecondBookMark ()
;* speaks the key stroke and assigns the current verse to the second bookmark
PcCursor ()
SayFormattedMessage (ot_JAWS_message, formatString(msg23_L, msg14_L)) ; "SetSecondBookMark"
TypeKey (ks22)
EndScript

Script SetThirdBookMark ()
;* speaks the key stroke and assigns the current verse to the third bookmark
PcCursor ()
SayFormattedMessage (ot_JAWS_message, formatString(msg23_L, msg15_L)) ; "SetThirdBookMark"
TypeKey (ks23)
EndScript

Script SetForthBookMark ()
;* speaks the key stroke and assigns the current verse to the forth bookmark
PcCursor ()
SayFormattedMessage (ot_JAWS_message, formatString(msg23_L, msg16_L)) ; "SetForthBookMark"
TypeKey (ks24)
EndScript

Script SetFifthBookMark ()
;* speaks the key stroke and assigns the current verse to the fifth bookmark
PcCursor ()
SayFormattedMessage (ot_JAWS_message, formatString(msg23_L, msg17_L)) ; "SetFifthBookMark"
TypeKey (ks25)
EndScript

Script SetSixthBookMark ()
;* speaks the key stroke and assigns the current verse to the sixth bookmark
PcCursor ()
SayFormattedMessage (ot_JAWS_message, formatString(msg23_L, msg18_L)) ; "SetSixthBookMark"
TypeKey (ks26)
EndScript

Script SetSeventhBookMark ()
;* speaks the key stroke and assigns the current verse to the seventh bookmark
PcCursor ()
SayFormattedMessage (ot_JAWS_message, formatString(msg23_L, msg19_L)) ; "SetSeventhBookMark"
TypeKey (ks27)
EndScript

Script SetEighthBookMark ()
;* speaks the key stroke and assigns the current verse to the eighth bookmark
PcCursor ()
SayFormattedMessage (ot_JAWS_message, formatString(msg23_L, msg20_L)) ; "SetEighthBookMark"
TypeKey (ks28)
EndScript

Script SetNinthBookMark ()
;* speaks the key stroke and assigns the current verse to the ninth bookmark
PcCursor ()
SayFormattedMessage (ot_JAWS_message, formatString(msg23_L, msg21_L)) ; "SetNinthBookMark"
TypeKey (ks29)
EndScript

Script SetZeroBookMark ()
;* speaks the key stroke and assigns the current verse to the zero bookmark
PcCursor ()
SayFormattedMessage (ot_JAWS_message, formatString(msg23_L, msg22_L)) ; "SetTenthBookMark"
TypeKey (ks30)
EndScript

Script FindNext ()
;* Speaks the key stroke
SayFormattedMessage (ot_JAWS_message, msg25_L) ;"Find Next"
TypeKey (ks31)
EndScript

Script SearchDocument ()
;* Speaks the key stroke
SayFormattedMessage (ot_JAWS_message, msg26_L) ; "Search Document"
TypeKey (ks32)
EndScript

Script ActiveVerse ()
;* uses the invisible cursor to read the active verse
;* found at the bottom of the screen
SaveCursor ()
InvisibleCursor ()
RouteInvisibleToPc ()
JAWSPageDown ()
FindString (GetCurrentWindow (), scStatusVerse, S_BOTTOM, S_UNRESTRICTED)
NextWord ()
SayFormattedMessage (ot_JAWS_message, msg24_L)
SayWord ()
NextWord ()
SayWord ()
RestoreCursor ()
EndScript

Script  ScriptFileName()
;announces the name of the application and currently executing scriptfile.
ScriptAndAppNames (msg27_L)
EndScript

int function SelectALinkDialog()
var
string linksList,
string selectedLink,
int index,
int buttonChosen,
string theClass,
int oldRestriction

let theClass=getWindowClass(getFocus())
if theClass !=wc_textWindow && theClass!=wc_htmlViewer then
	SayFormattedMessage (ot_error, msg33_L)
	return true
endIf
if InHJDialog () then
	SayFormattedMessage (OT_error, cMsg337_L, cMsg337_S)
	return true
endIf

saveCursor()
invisibleCursor()
routeInvisibleToPc()
let oldRestriction=getRestriction()
setRestriction(restrictWindow)
JAWSPageUp()
JAWSHome()
while findNextAttribute(attrib_underline)
	let linksList=linksList+list_item_separator+getChunk()
endWhile
let linksList=stringChopLeft(linksList,1)
restoreCursor()
setRestriction(oldRestriction)
if stringLength(linksList)==0 then
	SayFormattedMessage (ot_error, msg34_L)
	return true
endIf
let buttonChosen=DlgSelectControls (LinksList, index, msg32_L, bt_moveTo|bt_leftSingleClick, bt_leftSingleClick)
if buttonChosen==idcancel then
	return true
endIf
let selectedLink=stringSegment(linksList,list_item_separator,index)
delay(4)
JAWSCursor()
if findString(getFocus(),SelectedLink,s_top,s_unrestricted) && (getCharacterAttributes() & attrib_underline) then
	if buttonChosen==id_leftSingleClick then
		leftMouseButton()
		pcCursor()
		delay(5)
		let globalNewPage=true
		let globalLinkFound=false
		sayWindow(getFocus(),read_everything)
	endIf
else
	pcCursor()
	SayFormattedMessage (ot_JAWS_message, selectedLink+msg2_L)
endIf
return true
EndFunction

Script listLinks ()
SelectALinkDialog()
EndScript

script JAWSPageDown()
var
string sClass,
handle hNull

let ghContext=hNull
let sClass=getWindowClass(getFocus())
performScript JAWSPageDown()
if isPcCursor() && (sClass==wc_textWindow || sClass==wc_HTMLViewer) then
	processNewText()
	if ghContext then
		sayWindow(getFocus(),read_everything)
	endIf
	let globalNewPage=true
	let globalLinkFound=false
endIf
endScript

script JAWSPageUp()
var
string sClass,
handle hNull

let sClass=getWindowClass(getFocus())
let ghContext=hNull
performScript JAWSPageUp()
if isPcCursor() && (sClass==wc_textWindow || sClass==wc_HTMLViewer) then
	processNewText()
	if ghContext then
		sayWindow(getFocus(),read_everything)
	endIf
	let globalNewPage=true
	let globalLinkFound=false
endIf
endScript

int Function isTextOrHTMLWindow ()
var
string sClass

let sClass=getWindowClass(getCurrentWindow())
return (sClass==wc_textWindow || sClass==wc_paintPanel || sClass==wc_htmlViewer) && not menusActive()
EndFunction


int Function isHTMLView ()
var
string sClass
let sClass=getWindowClass(getCurrentWindow())
return (sClass==wc_paintPanel || sClass==wc_htmlViewer) && not menusActive()
EndFunction

Int Function MoveToLink (int direction)
var
	int LinkFound
if not IsJAWSCursor() then
	JAWSCursor()
endIf
if getWindowClass(getCurrentWindow())==wc_HTMLViewer then
	setFocus(getFirstChild(getCurrentWindow()))
endIf
if not isTextOrHTMLWindow() then
	routeJAWSToPc()
endIf
if (direction == first_link) then
	JAWSPageUp()
	let LinkFound = FindNextAttribute (ATTRIB_UNDERLINE)  * isTextOrHTMLWindow()
endIf
if (direction == next_link) then
	let LinkFound = FindNextAttribute (ATTRIB_UNDERLINE) * isTextOrHTMLWindow()
endIf
if (direction == prior_link) then
	let LinkFound = FindPriorAttribute (ATTRIB_UNDERLINE) * isTextOrHTMLWindow()
endIf
if (direction == Last_link) then
	JAWSPageDown()
	let LinkFound = FindPriorAttribute (ATTRIB_UNDERLINE) * isTextOrHTMLWindow()
endIf
return LinkFound
EndFunction

Function SayNextLink ()
if globalNewPage then
; speak the first anchor on this screen
	let globalNewPage= FALSE
	if MoveToLink (first_link) then
		SayCurrentLink()
		let globalLinkFound=true
		return
	endIf
else
	if MoveToLink (next_link) then
		SayCurrentLink()
		let globalLinkFound=true
		return
	endIf
endIf
PcCursor()
If (globalLinkFound == TRUE) then
	SayFormattedMessage (ot_error, msg35_L) ;"No more hyper links found on this screen"
	Else
	SayFormattedMessage (ot_error, msg34_L) ;"No hyper links found on this screen"
endIf ; LinkFound == TRUE
EndFunction

Function SayPriorLink ()
if (globalNewPage) then
; find the last anchor on this page
	let globalNewPage = FALSE
	if MoveToLink (last_link) then
		sayCurrentLink()
		let globalLinkFound = true
		return
	endIf
else
	if MoveToLink (prior_link) then
		SayCurrentLink()
		let globalLinkFound = true
		return
	endIf
endIf
PcCursor()
If (globalLinkFound == TRUE) then
	SayFormattedMessage (ot_error, msg35_L) ;"No more hyper links found on this screen"
Else
	SayFormattedMessage (ot_error, msg34_L) ;"No hyper links found on this screen"
endIf ; LinkFound = TRUE
EndFunction

Script nextLink ()
var
int OldRestriction
if isTextOrHTMLWindow() then
	let oldRestriction=getRestriction()
	setRestriction(restrictWindow)
	sayNextLink()
	setRestriction(oldRestriction)
else
	sayCurrentScriptKeyLabel()
	typeCurrentScriptKey()
endIf
EndScript

Script priorLink ()
var
int oldRestriction

if isTextOrHTMLWindow() then
	let oldRestriction=getRestriction()
	setRestriction(restrictWindow)
	sayPriorLink()
	setRestriction(oldRestriction)
else
	sayCurrentScriptKeyLabel()
	typeCurrentScriptKey()
endIf
EndScript

function sayFocusedWindow()
if isTextOrHTMLWindow() then
	if getCharacterAttributes() & attrib_underline then
		sayCurrentLink()
	endIf
	sayObjectTypeAndText()
else
	sayFocusedObject()
endIf
endFunction
script sayWindowPromptAndText()
var
	handle hWnd,
	int iSubType,
	int nMode
Let hWnd = GetCurrentWindow ()
Let iSubType = GetWindowSubTypeCode (hWnd)
If ! iSubType then
	Let iSubType = GetObjectSubTypeCode ()
EndIf
let nMode=smmTrainingModeActive()
smmToggleTrainingMode(TRUE)
sayFocusedWindow()
SayTutorialHelp (iSubType, TRUE)
SayTutorialHelpHotKey (hWnd, TRUE)
IndicateComputerBraille (hwnd)
smmToggleTrainingMode(nMode)
endScript

script enter()
if isHTMLView() then
	let globalInLink=false
	if isJAWSCursor() && getCharacterAttributes() & attrib_underline then
		leftMouseButton()
		delay(5)
		pcCursor()
		let globalNewPage=true
		let globalLinkFound=false
		sayWindow(getFocus(),read_everything)
		return
	else
		SayFormattedMessage(ot_error,msg37_L,msg37_S)
	endIf
	return
endIf
; html view is handled above so this will only be true if in a text window
if isTextOrHTMLWindow() && (getCharacterAttributes() & attrib_underline) then
	let globalInLink=false
	if isPcCursor() then
		routeJAWSToPc()
	elif isInvisibleCursor() then
		routeJAWSToInvisible()
	endIf
	leftMouseButton() ; activate the link
	delay(5)
	pcCursor()
	let globalNewPage=true
	let globalLinkFound=false
	sayWindow(getFocus(),read_everything)
else
	performScript enter() ;default
endIf
	endScript

Void Function FocusPointMovedEvent (int nX, int nY, int nOldX, int nOldY, int nUnit, int nDir, int nTimeElapsed)
; this is here to ensure that links get announced when navigating a text
;or HTML window with the pc cursor
if isTextOrHTMLWindow() then
	if getCharacterAttributes() & attrib_underline then
		if not globalInLink then
			sayUsingVoice(vctx_message,cVMsgLink1_L,ot_JAWS_message)
		endIf
		let globalInLink=true
	else
	if globalInLink then
		sayUsingVoice(vctx_message,msg36_L,ot_JAWS_message)
	endIf
		let globalInLink=false
	endIf
endIf
EndFunction

Function MouseMovedEvent (int x, int y)
; this is here to ensure that links get announced when the JAWS cursor
;is used to navigate a text or HTML window
if isTextOrHTMLWindow() then
	if getCharacterAttributes() & attrib_underline then
		if not globalInLink then
			sayUsingVoice(vctx_message,cVMsgLink1_L,ot_JAWS_message)
		endIf
		let globalInLink=true
	else
	if globalInLink then
		sayUsingVoice(vctx_message,msg36_L,ot_JAWS_message)
	endIf
		let globalInLink=false
	endIf
endIf
EndFunction

Function sayCurrentLink ()
sayChunk()
sayUsingVoice(vctx_message,cVMsgLink1_L,ot_JAWS_message)
EndFunction

Void Function ProcessKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
if stringContains(strKeyName,key_page) then
	; note this is only true if a modifier key has been pressed with the
	;page up/down keys
	if GetWindowClass(getFocus())==wc_textWindow then
		delay(3)
		sayLine()
		return
	endIf
EndIf
ProcessKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

void function sayNonHighlightedText(handle hWnd, string sBuffer)
Var
	String TheClass

	Let TheClass = GetWindowClass(hWnd)
	let ghContext=hWnd
sayNonHighlightedText(hWnd,sBuffer)
endFunction

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int ObjType, string ObjName, string ObjValue, optional int IsFocusObject)
if ObjType == WT_COMBOBOX && IsFocusObject then
	say (ObjValue, OT_LINE)
	return
endIf
return ValueChangedEvent (hwnd, objId, childId, ObjType, ObjName, ObjValue, IsFocusObject)
endFunction

