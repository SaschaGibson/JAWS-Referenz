;Copyright 1995-2023 Freedom Scientific, Inc.
; Script file for Microsoft PowerPoint O365

; note the term shape is synonymous with object. Powerpoint refers to shapes but a shape is a particular class of object.

Include "HJConst.jsh"
include "HJGlobal.jsh"
include "Common.jsm"
include "HJHelp.jsh"
include "Locale.jsh"
include "MSAAConst.jsh"
include "MSOffice2010.jsh"
include "MSOffice2007.jsm"
include "UIA.jsh"
include "powerPntCommon.jsh"
include "powerPnt2007.jsm"

use "PPFunc.jsb"
use "ppUserOptions.jsb"

import "UIA.jsd"
import "touch.jsd"
import "officeClassic.jsd"
import "ppFuncCommon.jsd"

CONST
	UNITS_CM		  0,
	UNITS_INCHES	1

GLOBALS
	int VirtualPcCursorApplicationSetting,
	string lastKeyPressed,
	int globalEnteringNewSlideNumber,
	int globalNewSlideAdded, ; set by Control+EnterKey (InsertSlide) script.
	int SpellCheckFunctionID, ; private for PowerPoint spellcheck accelerators
	int gbSupportsMAGicOptions,
	int gbMayInitializeObject,
int gShowSpeakersNotesDuringPresentation,
	string gLastSpeakersNotesRetrieved,
	int giPowerpointSplitModeValue

int function IsKeystrokeReserved (string keyName)
if stringLength (keyName) != 1
|| ! stringContains ("1234567890", keyName)
|| ! IsSlideShowWithUIA () then
	; so user may type a slide number, then press ENTER to move directly to that slide.
	return IsKeystrokeReserved (keyName)
endIf
return TRUE
endFunction

int function ProcessKeystrokeAsReserved (string Keystroke)
if IsKeystrokeReserved (Keystroke) then
; formattedSayString ("%1 is reserved", getCurrentScriptKeyName ()); debug
	SayCurrentScriptKeyLabel ()
	;TypeKey (Keystroke)
	typeCurrentScriptKey ()
	globalEnteringNewSlideNumber = TRUE
	return TRUE
else
	globalEnteringNewSlideNumber = FALSE; used by Enter key 
	return FALSE
endIf
endFunction

void function NotifyIfContextHelp()
; don't notify context help when in the virtual cursor, every single object has a help tag that duplicates the name.
if IsSlideShowWithUIA () then return endIf
NotifyIfContextHelp()
endFunction

int function BrailleCallbackObjectIdentify ()
If dialogActive () && GetObjectIsEditable () && stringContains (getWindowClass (globalFocusWindow), wc_bosa_sdmGeneral)
&& getObjectRole () == ROLE_SYSTEM_GRAPHIC
	return WT_BITMAP
endIf
return BrailleCallbackObjectIdentify ()
endFunction

int function BrailleAddObjectContextHelp(int nSubtypeCode)
; don't notify context help when in the virtual cursor, every single object has a help tag that duplicates the name.
if IsSlideShowWithUIA () then
; suppress Braille symbol for useless object help.
	return TRUE
endIf
return BrailleAddObjectContextHelp(nSubtypeCode)
endFunction

int function BrailleAddObjectName (int type)
if type == WT_EDIT then
; where on a text box whose type is image, the name becomes irrelevant.
	if getObjectSubtypeCode(FALSE, 0) == WT_BITMAP then return TRUE endIf
elIf type == WT_BITMAP then
	If dialogActive () && GetObjectIsEditable () && stringContains (getWindowClass (globalFocusWindow), wc_bosa_sdmGeneral)
	&& getObjectRole () == ROLE_SYSTEM_GRAPHIC
		BrailleAddString (GetObjectName(SOURCE_CACHED_DATA), 0,0,0)
		return TRUE
	endIf
endIf
If type == WT_BUTTON
	var
		string sName = GetObjectName(SOURCE_CACHED_DATA),
		string sHelp = GetObjectHelp(true),
		string sValue = GetObjectValue(SOURCE_CACHED_DATA)
	if StringIsBlank(sName)
	&& !StringIsBlank(sHelp)
		sName = sHelp
	endIf
	if !StringIsBlank(sValue)
	&& sName != sValue
		sName = sName + cscSpace + sValue
	endIf
	BrailleAddString(sName, GetCursorCol (), GetCursorRow (), getCharacterAttributes())
	Return TRUE
endIf
return BrailleAddObjectName (type)
endFunction

void function SayObjectTypeAndText (optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var string sClass = getWindowClass (GetFocus ())
if sClass == cwc_Richedit60W then
	Office::SayObjectTypeAndText (nLevel,includeContainerName)
	return
endIf
SayObjectTypeAndText (nLevel,includeContainerName)
endFunction

int function IsStatusBarToolBar(handle hWnd)
var
	handle hTemp
if GetMenuMode()>0 then
	return false
endIf
if GetWindowClass(hWnd) != wc_NetUIHwnd then
	return false
EndIf
let hTemp = hWnd
while hTemp
&& GetWindowClass(hTemp) != wc_MSOWorkPane
	let hTemp = GetParent(hTemp)
EndWhile
if hTemp then
	if stringCompare(GetWindowName(hTemp),wn_StatusBar)==0 then
		return true
	EndIf
EndIf
return false
EndFunction

void function SpeakStatusBarToolBarItem(optional int nLevel)
var
	int iLevelType,
	handle hwnd,
	string sObjName,
	int iState,
	string sValue

while (nLevel >= 0)
	let iLevelType = GetObjectSubTypeCode(FALSE,nLevel)
	if iLevelType == wt_ToolBar
	|| nLevel == 0 then
		sayobjectTypeAndText(nLevel)
	EndIf
	let nLevel= nLevel-1
EndWhile
; the following test is necessary for when tutor mode is off in Microsoft Word 2010.
if ShouldItemSpeak(ot_tutor)!=tutor_all && getRunningFSProducts () & product_JAWS then
	let hwnd=GetFocus()
	let sObjName=GetObjectName()
	if StringContains(stringLower(GetAppFileName()),sc_Word2010) then
		if sObjName==wn_PageNumber then
			GetObjectInfoByName (hWnd,sObjName,1,iLevelType,iState,sValue)
			SayMessage(ot_screen_message,sValue)
		elif sObjName==WN_WordCount then
			GetObjectInfoByName (hWnd,sObjName,1,iLevelType,iState,sValue)
			SayMessage(ot_screen_message,sValue)
		endIf
	endIf
	;Office 2010 in general:
	if sObjName==wn_zoom then
		GetObjectInfoByName (hWnd,sObjName,1,iLevelType,iState,sValue)
		SayMessage(ot_screen_message,sValue)
	endIf
EndIf
EndFunction

void Function AutoStartEvent ()
globalEnteringNewSlideNumber = FALSE
if !PPTHasRunBefore then
	let PPTHasRunBefore = true
endIf
if giFN_ShapeNavCallback then
	unScheduleFunction (giFN_ShapeNavCallback)
	let giFN_ShapeNavCallback = 0
endIf
;This ensures objects only get loaded after AutoStart, prevent Unknown Function Calls
Let gbMayInitializeObject = TRUE
let switchingPanes=false
let pptVersion=getPptVersion()
loadApplicationSettings()
let gbActiveItemChanged=false
if gbSwitchingConfiguration then
	let gbSwitchingConfiguration=false
	FocusChangedEvent(GetFocus(),globalPrevFocus)
EndIf
; turn on options dialog support:
gbSupportsMAGicOptions = TRUE
giInitialSplitModeValue=BrailleGetSplitMode()
if AppAllowedToChangeSplitMode() then
	BrailleSplitMode(giPowerpointSplitModeValue)
endIf
endFunction

void Function AutoFinishEvent ()
if giFN_ShapeNavCallback then
	unScheduleFunction (giFN_ShapeNavCallback)
	let giFN_ShapeNavCallback = 0
endIf
let gbActiveItemChanged=false
Let gbMayInitializeObject = FALSE
let gbSupportsMAGicOptions = FALSE ; prevent unnecessary running of adjustMAGicOptions
globalEnteringNewSlideNumber = FALSE
if AppAllowedToChangeSplitMode() then
	BrailleSplitMode(giInitialSplitModeValue)
endIf
endFunction

Int Function GetPptVersion ()
return GetProgramVersion (GetAppFilePath ())
EndFunction

void Function SpeakSlideChangeInfo (int bShouldSpeakFocusedObject)
; keep Thumbnails view from speaking as it's already accounted for from SayFocusedWindow 
If IsSlideShow() then ; Let User Buffer handleit:
	Return
endIf
saySlideTitleOrIndexNumber(bShouldSpeakFocusedObject); this will keep them from spelling if it got scheduled.
SaySlidePosition ()
if ! bShouldSpeakFocusedObject then;never gets set on Schedule
	Return
endIf
if GetActivePaneView() != ppViewThumbnails
|| isOutlineView () then
	performScript saySelectedObject()
endIf
endFunction

Void Function initializeApplicationSettingsLegacy ()
let globalTableReadingMethod = tableRowByRow
let globalDetectOverlappingShapes = true ; detect when shapes on a slide overlap
let globalDetectTextOverflow = true ; detect when text place holders become full
let giSlideTransitions = false ; off by default
let giDescribeObjects = true ; on by default
EndFunction

void function loadNonJCFOptions ()
globalTableReadingMethod = GetNonJCFOption ("TableReadingMethod")
globalDetectOverlappingShapes = GetNonJCFOption ("DetectOverlappingShapes")
globalDetectTextOverflow = GetNonJCFOption ("DetectTextOverflow")
giSlideTransitions = GetNonJCFOption ("AnnounceSlideTransitions")
giDescribeObjects = GetNonJCFOption ("DescribeObjectTypes")
loadNonJCFOptions ()
endFunction

Void Function initializeApplicationSettings ()
loadNonJCFOptions ()
endFunction

Void Function SayNewSlideType ()
; assumes we are in the new slide dialog and focus is on the control with class UserControl
var
	int OldGraphicVerbosity,
	handle hwnd
; don't want to speak graphics, just text description.
let OldGraphicVerbosity = GetJcfOption (opt_Include_Graphics)
setJcfOption (opt_include_Graphics, 0)
let hwnd = GetRealWindow (GetFocus ())
let hwnd = FindDescendantWindow (hwnd, NewSlideTypeId)
if hwnd Then
	if globalPrevFocus != globalFocusWindow then
		say (getWindowName (getFirstChild (getRealWindow (hwnd))), ot_control_name)
		IndicateControlType (GetWindowSubtypeCode (GetFocus ()), msgLayoutSelector1)
	endIf
	SayWindow (hwnd, Read_Everything)
EndIf
setJcfOption (opt_Include_Graphics, oldGraphicVerbosity)
EndFunction

string Function getDialogPageName ()
var
	handle nodeStaticHandle,
	int oldGraphicVerbosity,
	int nodeLabelsId,
	string realName
let realName = getWindowName (getRealWindow (getFocus ()))
if stringContains (realName, wn_AutoContentWizDlgTitle) then
	let nodeLabelsId = cId_autoContentWizNodeLabels
elif stringContains (realName, wn_PackAndGoDlgTitle) then
	let nodeLabelsId = cId_packAndGoNodeLabels
else
	let nodeLabelsId = 0
endIf
if nodeLabelsId then
	let oldGraphicVerbosity = getJCFOption (opt_include_graphics)
	setJCFOption (opt_include_graphics, graphicVerbosityAll)
	saveCursor ()
	invisibleCursor ()
	let nodeStaticHandle = FindDescendantWindow (getRealWindow (getFocus ()), nodeLabelsId)
	if nodeStaticHandle then
		if FindGraphic (nodeStaticHandle, graphicActiveTab, s_top, s_restricted) then
			nextChunk ()
			if getChunk () then
				return getChunk ()
			else
				return getDialogPageName ()
			endIf
		endIf
	endIf
	restoreCursor ()
	setJCFOption (opt_include_graphics, oldGraphicVerbosity)
else
	if getDialogPageName () then
		return getDialogPageName () ; default
	else
		return getWindowName (findWindow (getRealWindow (getFocus ()), cwcSysTabCtrl32))
	endIf
endIf
EndFunction

int Function isMultipageDialog ()
var
	string realName
let realName = getWindowName (getRealWindow (getFocus ()))
if stringContains (realName, wn_AutoContentWizDlgTitle)
|| stringContains (realName, wn_PackAndGoDLGTitle) then
	return true
else
	return isMultipageDialog () || (! stringIsBlank (getDialogPageName ()))
endIf
EndFunction

void function SayWindowTypeAndText (handle hwnd)
if getWindowSubtypeCode (hWnd) != WT_DIALOG then
	return sayWindowTypeAndText (hwnd)
endIf
sayWindowTypeAndText (hwnd)
if self::getDialogPageName () && ! default::getDialogPageName () then
	sayMessage (OT_DIALOG_TEXT, formatString (cmsg230_L, getDialogPageName ()))
endIf
endFunction

void function MenuModeEvent (handle WinHandle, int mode)
; we override here so that when the context menu in slide show view is dismissed,
; the User Buffer is correctly reloaded and reactivated.
; we can't rely on sayFocusedWindow to do this since it is not reliably called,
; i.e., focus change doesn't always occur
; first call default
MenuModeEvent (winHandle, mode)
if mode == menu_Inactive then
	if isSlideShow () then
		UserBufferActivate (false)
	endIf
endIf
endFunction

string function ToggleTableReadingMethod (int iRetCurVal)
if ! iRetCurVal then
	;update the value
	if globalTableReadingMethod == tableIgnore then
		let globalTableReadingMethod = tableRowByRow
	elif globalTableReadingMethod == tableRowByRow then
		let globalTableReadingMethod = tableColByCol
	elif globalTableReadingMethod == tableColByCol then
		let globalTableReadingMethod = tableDimensionsOnly
	else
		let globalTableReadingMethod = tableIgnore
	EndIf
EndIf
;now return the value
if globalTableReadingMethod == tableIgnore then
	return msg57_S ; ignore tables altogether
elif globalTableReadingMethod == tableRowByRow then
	return msg55_S ; read row by row
elif globalTableReadingMethod == tableColByCol then
	return msg56_S ; read column by column
else
	return msg54_S ; say table dimensions.
endIf
EndFunction

string function toggleOverlapAlert (int iRetCurVal)
if ! iRetCurVal then
	;update the value
	let globalDetectOverlappingShapes = !globalDetectOverlappingShapes
EndIf
if globalDetectOverlappingShapes then
	return msgAlertOverlapOn1_S
else
	return msgAlertOverlapOff1_S
endIf
endFunction

string function toggleOverflowAlert (int iRetCurVal)
if ! iRetCurVal then
	;update the value
	let globalDetectTextOverflow = !globalDetectTextOverflow
EndIf
if globalDetectTextOverflow then
	return msgOverflowAlertOn1_S
else
	return msgOverflowAlertOff1_S
endIf
EndFunction

int Function saveApplicationSettings ()
var
	int iResult
let iResult = iniWriteInteger (Section_applicationVerbositySettings, hKey_TableReadingMethod, globalTableReadingMethod, jsiFileName)
iniWriteInteger (Section_ApplicationVerbositySettings, hKey_DetectOverlappingShapes, globalDetectOverlappingShapes, jsiFileName)
iniWriteInteger (Section_ApplicationVerbositySettings, hKey_DetectTextOverflow, globalDetectTextOverflow, jsiFileName)
iniWriteInteger (Section_ApplicationVerbositySettings, hKey_announceSlideTransitions, giSlideTransitions, jsiFileName)
iniWriteInteger (Section_ApplicationVerbositySettings, hKey_DescribeObjects, giDescribeObjects, jsiFileName)
return iResult
EndFunction

void Function loadApplicationSettings ()
initializeApplicationSettings ()
let globalTableReadingMethod = iniReadInteger (Section_applicationVerbositySettings, hKey_TableReadingMethod, globalTableReadingMethod, jsiFileName)
let globalDetectOverlappingShapes = iniReadInteger (Section_ApplicationVerbositySettings, hKey_DetectOverlappingShapes, globalDetectOverlappingShapes, jsiFileName)
let globalDetectTextOverflow = iniReadInteger (Section_ApplicationVerbositySettings, hKey_DetectTextOverflow, globalDetectTextOverflow, jsiFileName)
let giSlideTransitions = iniReadInteger (Section_ApplicationVerbositySettings, hKey_announceSlideTransitions, giSlideTransitions, jsiFileName)
let giDescribeObjects = iniReadInteger (Section_ApplicationVerbositySettings, hKey_DescribeObjects, giDescribeObjects, jsiFileName)
VirtualPcCursorApplicationSetting = getJCFOption (OPT_VIRTUAL_PC_CURSOR)
EndFunction

/*****Legacy****
Hid function load order problems, exposed by the Make Common project for PowerPoint.
Only the unknown event function is commented out.
Function Unknown (string TheName, int IsScript)
TheName = StringLower (TheName)
if StringContains (stringLower theName, scInitPPTAppObj) then
	return
EndIf
If StringContains (TheName, scSaySelectedShape) then
	Return
Else
	Unknown (theName, isScript)
EndIf
EndFunction
endComment********/

Void Function SaySymbolPrompt ()
SaveCursor ()
InvisibleCursor ()
JAWSPageDown ()
PriorLine ()
JAWSHome ()
Delay (1)
Say (GetObjectName (), ot_control_name)
RestoreCursor ()
EndFunction

Int Function InTextWindow ()
If isPPTEditMode () then
	return true
Else
	return inTextWindow () ;default
EndIf
EndFunction

String function ToggleSlideTransitions (int iRetCurVal)
if ! iRetCurVal then
	;update the value
	let giSlideTransitions = ! giSlideTransitions
EndIf
;now return the value
if giSlideTransitions then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

String function ToggleDescribeObjects (int iRetCurVal)
if ! iRetCurVal then
	;update the value
	let giDescribeObjects=!giDescribeObjects
EndIf
;now return the value
if giDescribeObjects then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

void Function WindowDestroyedEvent (handle hWindow)
if ghSlideShowApp == hWindow then
	UserBufferClear ()
	UserBufferDeactivate ()
EndIf
WindowDestroyedEvent (hWindow)
EndFunction

void Function sayCellLineSegment ()
var
string segment
let segment=getChunk()
if segment !=cscNull then
	Say(segment,ot_line)
else
	SayMessage(ot_word,cmsgBlank1) ;blank
endIf
EndFunction

void Function sayObjectDimensionsAndLocationHelper ()
Var
	object null,
	int iUnits, ; This is for CM or Inches
	int iLeft,
	int iTop,
	int iRight,
	int iBottom,
;The following two vars account for the dimensions of full document (slide) not implied by shape dims:
	int iSlideRight,
	int iSlideBottom,
 	int iWidth,
	int iHeight,
	String sLeft,
	String sTop,
	string sWidth,
	string sHeight,
	string sRight,
	string sBottom,
	string sLeftUnits,
	string sTopUnits,
	string sWidthUnits,
	string sHeightUnits,
	string sRightUnits,
	string sBottomUnits,
	string sUnitUsed;
let iUnits = stringToInt (GetUserLocaleInfo (LOCALE_IMEASURE))
if iUnits == UNITS_INCHES then
	let sUnitUsed = msgInches
elif iUnits == UNITS_CM then
	let sUnitUsed = msgCentimeters
endIf
if noSelectedShape () then
	SayFormattedMessage (ot_error, msg87_L)
	return
endIf
let iWidth = getSelectedShapeWidth ()
let iHeight = getSelectedShapeHeight ()
let iSlideRight = getSelectedSlideBottomRightX ()
let iSlideBottom = getSelectedSlideBottomRightY ()
let sWidth = intToString (iWidth)
let sHeight = intToString (iHeight)
if iUnits == UNITS_INCHES then
	let sWidthUnits = GetInchesFromPoints (iWidth)
	let sHeightUnits = GetInchesFromPoints (iHeight)
elif iUnits == UNITS_CM then
	let sWidthUnits = GetCentimetersFromPoints (iWidth)
	let sHeightUnits = GetCentimetersFromPoints (iHeight)
endIf
If UserBufferIsActive () then
	UserBufferDeactivate()
EndIf
UserBufferClear()
; Display info:
;UserBufferAddText(getSelectedShapeDescription()+cscBufferNewLine)
userBufferAddText (formatString (msgShapeDims, getSelectedShapeDescription (),
sWidth, sHeight, sWidthUnits, sHeightUnits, sUnitUsed))
userBufferAddText (cscBufferNewLine+msgShapeDimsInSlide)
let iLeft = getSelectedShapeTopLeftX ()
if iLeft < 0 then ; out of bounds
	let sLeft = intToString (iLeft*-1)
	if iUnits == UNITS_INCHES then
		let sLeftUnits = GetInchesFromPoints (iLeft*-1)
	elif iUnits == UNITS_CM then
		let sLeftUnits = GetCentimetersFromPoints (iLeft*-1)
	endIf
	userBufferAddText (formatString (msgShapeDimOutOfBounds, msgLeft, sLeft, sLeftUnits, sUnitUsed))
elIf iLeft == 0 then;at edge
	userBufferAddText  (formatString (msgShapeDimAtSlideBoundary, msgLeft))
else
	let sLeft = intToString (iLeft)
	if iUnits == UNITS_INCHES then
		let sLeftUnits = GetInchesFromPoints (iLeft)
	elif iUnits == UNITS_CM then
		let sLeftUnits = GetCentimetersFromPoints (iLeft)
	endIf
	userBufferAddText (formatString (msgShapeDimInfo, msgLeft, sLeft, sLeftUnits, sUnitUsed))
endIf
let iTop = getSelectedShapeTopLeftY ()
if iTop < 0 then
	let sTop = intToString (iTop*-1)
	if iUnits == UNITS_INCHES then
		let sTopUnits = GetInchesFromPoints (iTop*-1)
	elif iUnits == UNITS_CM then
		let sTopUnits = GetCentimetersFromPoints (iTop*-1)
	endIf
	userBufferAddText (formatString (msgShapeDimOutOfBounds, msgTop, sTop, sTopUnits, sUnitUsed))
elIf iTop == 0 then
	userBufferAddText (formatString (msgShapeDimAtSlideBoundary, msgTop))
else
	let sTop = intToString (iTop)
	if iUnits == UNITS_INCHES then
		let sTopUnits = GetInchesFromPoints (iTop)
	elif iUnits == UNITS_CM then
		let sTopUnits = GetCentimetersFromPoints (iTop)
	endIf
	userBufferAddText (formatString (msgShapeDimInfo, msgTop, sTop, sTopUnits, sUnitUsed))
endIf
let iRight = (iLeft+iWidth)
if iRight > iSlideRight then
	let iRight = (iRight - iSlideRight)
	let sRight = intToString (iRight)
	if iUnits == UNITS_INCHES then
		let sRightUnits = GetInchesFromPoints (iRight)
	elif iUnits == UNITS_CM then
		let sRightUnits = GetCentimetersFromPoints (iRight)
	endIf
	userBufferAddText (formatString (msgShapeDimOutOfBounds, msgRight, sRight, sRightUnits, sUnitUsed))
elif iRight == iSlideRight then
	userBufferAddText (formatString (msgShapeDimAtSlideBoundary, msgRight))
else
	let iRight = (iSlideRight-iRight)
	let sRight = intToString (iRight)
	if iUnits == UNITS_INCHES then
		let sRightUnits = GetInchesFromPoints (iRight)
	elif iUnits == UNITS_CM then
		let sRightUnits = GetCentimetersFromPoints (iRight)
	endIf
	userBufferAddText (formatString (msgShapeDimInfo, msgRight, sRight, sRightUnits, sUnitUsed))
endIf
let iBottom = (iTop+iHeight)
if iBottom > iSlideBottom then
	let iBottom = (iBottom - iSlideBottom)
	let sBottom = intToString (iBottom)
	if iUnits == UNITS_INCHES then
		let sBottomUnits = GetInchesFromPoints (iBottom)
	elif iUnits == UNITS_CM then
		let sBottomUnits = GetCentimetersFromPoints (iBottom)
	endIf
	userBufferAddText (formatString (msgShapeDimOutOfBounds, msgBottom, sBottom, sBottomUnits, sUnitUsed)+cscBufferNewLine)
elIf iBottom == iSlideBottom then
	UserBufferAddText (formatString (msgShapeDimAtSlideBoundary, msgBottom))
else
	let iBottom = (iSlideBottom - iBottom)
	let sBottom = intToString (iBottom)
	if iUnits == UNITS_INCHES then
		let sBottomUnits = GetInchesFromPoints (iBottom)
	elif iUnits == UNITS_CM then
		let sBottomUnits = GetCentimetersFromPoints (iBottom)
	endIf
	userBufferAddText (formatString (msgShapeDimInfo, msgBottom, sBottom, sBottomUnits, sUnitUsed)+cscBufferNewLine)
endIf
;User buffer must be activated prior to doing overlap test and detectTooMuchInfo, so data is entered into buffer:
UserBufferActivate()
if globalDetectOverlappingShapes then
	doShapeOverlapTest()
	detectTooMuchInfo (TRUE, TRUE)
	userBufferAddText (cscBufferNewLine);overflow and overlap info doesn't have a trailing blank line.
endIf
UserBufferAddText(cmsgBuffExit)
JAWSTopOfFile()
SayAll()
EndFunction

void Function ShapeNavCallback ()
var
	int nLeft, int nTop, int nRight, int nBottom,
	int nInfoBits,
	int nExceedSlideBounds,
	string sMsg;
let nInfoBits = getShapeNavInfoBitsAndCoords (nLeft, nTop, nRight, nBottom, nExceedSlideBounds)
Let sMsg = getShapeNavInfoString (nInfoBits, nLeft, nTop, nRight, nBottom, nExceedSlideBounds);
if nInfoBits
&& ! stringIsBlank (sMsg) then
	Say (sMsg, OT_SCREEN_MESSAGE)
	;ensure this gets placed on display, e.g. BrailleCallBackObjectIdentify and helpers are gone:
	delay (2, TRUE)
	brailleMessage (sMsg)
	;The shape overlap test is expensive, walking the entire collection.
	if ! isKeyWaiting () then
		DoShapeOverlapTest ()
		;detectTooMuchInfo (FALSE, TRUE);Shape remains fixed in size, only moves.
	endIf
	;Since info was spoken, empty globals so relevant info is properly updated.
	dumpNavigationGlobals ()
	;Ensures that measurements are taken against new (spoken) position.
	;This way, the user can press a navigation key x times quickly, giving feedback on info from before sequence started.
	updateNavigationGlobals ()
endIf
endFunction

Function MouseButtonEvent (int eventID, int x, int y)
if IsSlideShow() then
	if eventID==wm_lButtonDown then
		;readSlideShowSlide(true,true)
		delay(2); Ensure JAWS can catch up to the slide transition, getting incoming bullets.
		advanceSlideShow ()
		If IsSlideshowDone() then
			EnsureNoUserBufferActive(false)
			SayMessage(ot_status,msgExitSlideshow_l,msgExitSlideshow_s)
		else
			delay(5,true)
			performscript nextObject()
		endIf
		return
	EndIf
endIf
MouseButtonEvent(eventID,x,y)
EndFunction

Script ControlBackSpace ()
var
	string sText1,
	string sText2
If IsVirtualPcCursor () then
	If UserBufferIsActive () then
		Return; Do not process unless so directed in app-specific script file
	EndIf
EndIf
if ! isPPTEditMode () then
	InvisibleCursor ()
	RouteInvisibleToPc ()
	PriorWord ()
endIf
;If the user was at the top of the window,
;let the keystroke through so that the default sound may be heard,
;but don't try to report on the deletion since none occurred:
if GetCurrentWindow() != GetFocus() then
	PCCursor()
	TypeCurrentScriptKey ()
	return
EndIf
PCCursor()
let sText1=GetPriorWord()
SayMessage(ot_line,sText1)
TypeCurrentScriptKey ()
EndScript

void function BrailleRoutingButton(int nCell)
if IsSlideShowWithUIA () then
	return BrailleRoutingButton (nCell)
endIf
If IsSlideShow() then ; Let User Buffer handleit:
	performScript VirtualSpaceBar ()
	return
endIf
return BrailleRoutingButton(nCell)
endFunction

int function ShouldAddVirtualRibbonsOption()
return GetProgramVersion (getAppFilePath ()) >= 12
EndFunction

script ReadCurrentRow()
if TableErrorEncountered(TABLE_NAV_SAY_ROW) then
	return
endIf
Say(GetRowText(cscSpace,cscNull,cmsgBlank1), ot_line)
endScript

int function InProofingPaneSpellCheck ()
var string sName = GetObjectNameUnfiltered(1)
If StringIsBlank (sName)	; may be in a list of suggestions...
	sName = GetObjectNameUnfiltered(2)
EndIf
If StringIsBlank (sName)	; may be in a list of languages...
	sName = GetObjectNameUnfiltered(5)
EndIf
return sName == wn_spelling
;|| sName == wn_Proofing_Pane_Grammar
; || sName == SomethingElse
endFunction

void function ScheduleSpellCheckReadingIfAppropriate  ()
;Override from PowerPoint Common.jss,
; which is not used by this file but only works on 2003 / 2007 / 2010:
;Not using window names for this anymore:
if InProofingPaneSpellCheck () then
	UnscheduleFunction (SpellCheckFunctionID)
	SpellCheckFunctionID = ScheduleFunction ("ReadMistakeAndSuggestion", 2)
EndIf
endFunction

void function FocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
if giFN_ShapeNavCallback then
	unScheduleFunction (giFN_ShapeNavCallback)
	let giFN_ShapeNavCallback = 0
endIf
if FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth) then
	return
endIf	
if inRibbons () || IsVirtualRibbonActive() then
	return Office::FocusChangedEventEx (hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild,nChangeDepth)
elIf IsStatusBarToolbar (hwndFocus) then
	let GlobalFocusWindow = hwndFocus
	SpeakStatusBarToolBarItem(nChangeDepth)
	return
endIf
if nChangeDepth == 0
&& giFocusChangeTriggeredByDOMCall
	var int iType = GetObjectSubTypeCode()
	if iType == WT_BITMAP
	|| iType == WT_UNKNOWN
		;Some DOM calls in the braille update code result in an infinite cycle of focus change events and braille updates.
		;This global is set to true in the braille update code and is used here to return early.
		giFocusChangeTriggeredByDOMCall = false
		return
	endIf
endIf
if DialogActive ()
&& getWindowName (getRealWindow (hwndFocus)) != cwnQuickSettings
&& getWindowName (getRealWindow (hwndFocus)) != wn_Spelling 
; NUIDialogs need classic sayWindowTypeAndText, not ProcessAncestors, which misses the static text.
&& getWindowClass (getRealWindow (hwndFocus)) != wc_NuiDialog then
	return office::FocusChangedEventEx (hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild,nChangeDepth)
else
	return FocusChangedEventEx (hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild,nChangeDepth)
endIf
endFunction

int function InThumbnailsPane()
var
	int iAncestorCount = GetAncestorCount (),
	int i
for i = 1 to iAncestorCount
	if GetObjectAutomationId (i) == "ThumbnailsPane"
		return true
	elIf GetObjectRole (i) == ROLE_SYSTEM_PANE
		return false
	endIf
endFor
return false
endFunction

Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
if InThumbnailsPane()
	return office::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
var
	HANDLE RealWindow,
	string RealWindowName,
	HANDLE AppWindow
; turn off virtual PC cursor in dialogs,
; preventing empty virtual buffers and user can use the dialog controls with classic functionality instead.
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
let RealWindow = GetRealWindow(FocusWindow)
let RealWindowName = GetWindowName (RealWindow)
let AppWindow = GetAppMainWindow(FocusWindow)
let GlobalRealWindow = RealWindow
let GlobalRealWindowName = RealWindowName
let GlobalFocusWindow = FocusWindow ; used by sdm routine
If StringContains (GetWindowClass (FocusWindow),wc_SDM) then
	SaySDMFocusedWindow ()
Else
	if GlobalPrevApp!=AppWindow
	&& AppWindow!=FocusWindow then
		; we've switched to a different app main window,
		; and it does not have the focus, so announce it
		If !GlobalWasHjDialog then
			SayWindowTypeAndText (AppWindow)
		EndIf
		if ! dialogActive () then
			if IsFullpageUIHostVisible() then
				Say(sc_BackStageView,ot_dialog_name)
			EndIf
		endIf
	endIf
	If GlobalPrevRealName != RealWindowName
	|| GlobalPrevReal != RealWindow then
		;if highlight was suppressed in an SDM dialog due to pressing Enter in an OpenListView, clear the global variable:
		if GlobalSayStabilizedOpenListViewItem then
			let GlobalSayStabilizedOpenListViewItem = false
		EndIf
		If RealWindow!=AppWindow
		&& RealWindow != FocusWindow then
			SayWindowTypeAndText (RealWindow)
		endIf
	endIf
	; All instances when slide should be spoken
	; no longer try to handle case by case.
	; will cause slide to speak as it changes or gains focus, 
	; but not repeatedly as user navigates through the objects.
	if getWindowClass (prevWindow) != wcPowerpointClient
	&& getWindowClass (focusWindow) == wcPowerpointClient then
		if GetActivePaneView() != ppViewThumbnails then
			saySlideTitleOrIndexNumber ()
			saySlidePosition ()
		endIf
	endIf
	;now say the window with focus
	if ! HandleCustomWindows (FocusWindow) then SayFocusedWindow () endIf
EndIf
;now set all the global variables for next time.
let GlobalPrevReal = RealWindow
let GlobalPrevRealName = RealWindowName
let GlobalPrevApp = AppWindow
let GlobalPrevFocus = FocusWindow
Let GlobalWasHjDialog = InHjDialog ()
GlobalPrevDialogIdentifier = GetDialogIdentifier()
EndFunction

int function IsFullpageUIHostVisible()
var
	handle hWnd
let hWnd = GetFirstChild(GetAppMainWindow(GetFocus()))
return IsWindowVisible(hWnd)
	&& GetWindowClass(hWnd) == "FullpageUIHost"
EndFunction

Void Function SayNonHighlightedText (handle hwnd, string buffer)
var
	int TheControlId,
	string TheClass,
	string realName
let theControlId=GetControlId(hwnd)
let TheClass = GetWindowClass(hwnd)
let realName=getWindowName(getRealWindow(hwnd))
if TheControlId==cId_MisspelledWord
&& RealName==wn_SpellingDlgTitle then
	Return
endIf
;if we are changing levels in an OpenListView window class
;then the variable GlobalSayOpenListViewItem is true,
;so announce the change and clear the global variable
if GlobalSayOpenListViewItem then
	if TheClass==wc_OpenListView then
		SayObjectTypeAndText()
		let GlobalSayOpenListViewItem = false
	EndIf
EndIf
if GetScreenEcho() > 1
|| TheClass==cwc_dlg32771
|| (theClass==wc_STATIC
&& RealName==wn_AutoContentWizDlgTitle ;wn_AutoContentWizDlgTitle="AutoContent Wizard"
&& theControlId!=cId_autoContentWizNodeLabels)
|| ((theClass==wc_STATIC
|| theClass==wc_msoBalloonChild)
&& realName==wn_PackAndGoDlgTitle
&& theControlId!=cId_packAndGoNodeLabels) then
		Say(buffer,OT_NONHIGHLIGHTED_SCREEN_TEXT)
EndIf
If ! giDiagramGalleryListbox then
	return
Else
	Say(MSAAGetDialogStaticText(),ot_nonhighlighted_screen_text)
	let giDiagramGalleryListbox=false
EndIf
EndFunction

Void Function SayHighLightedText (handle hwnd, string buffer)
Var
	handle hFocus,
	String RealName, ; of window with highlight
	string sRealName, ; of window with focus
	int iType,
	int iObjType
if GlobalSayStabilizedOpenListViewItem then
	return
EndIf
let hFocus=GetFocus()
let iType=GetWindowSubtypeCode(hFocus)
let iObjType=GetObjectSubtypeCode()
let RealName=GetWindowName(GetRealWindow(hwnd))
let sRealName=GetWindowName(GetRealWindow(hFocus))
If ! iType then
	let iType=GetObjectSubtypeCode()
EndIf
if (GlobalMenuMode
&& (iObjType==wt_edit
|| iObjType==wt_ComboBox))
|| iObjType==wt_treeviewItem then
	return
EndIf
if RealName==wn_SpellingDlgTitle
|| GetWindowName(GetRealWindow(GetCurrentWindow()))==wn_SpellingDlgTitle then
	Return
EndIf
if iType == WT_TREEVIEW  then
	Return
endIf
;For Symbol dialog off Bullets and Numbering dialog:
If StringContains(globalRealWindowName,wn_Symbol)
&& (globalCurrentControl==cId_SymbolChar
|| globalCurrentControl==cId_SymbolChar2003) then
	SaySymbolPrompt()
endIf
if PptSuppressEcho then
	let PptSuppressEcho=false
	return
endIf
if sRealName==wn_Font then
	if iType==wt_Edit then
		; ValueChangedEvent handles it.
		return
	EndIf
EndIf
; avoid speaking highlighted text when not in the focused control,
; when in the Custom Animation dialog
if RealName==wn_customAnimationDlgTitle then
	if hwnd!=getFocus()
	&& (getControlId(hwnd)==cId_animationOrderList
	|| getControlId(hwnd) ==cId_animatedShapeList) then
		return
	endIf
endIf
if IsPPTEditMode() then
	return
EndIf
if GetScreenEcho() > 0 Then
	Say(buffer,OT_HIGHLIGHTED_SCREEN_TEXT)
EndIf
EndFunction

Script Spellcheck ()
;Uses UIA to handle Spell Check:
var
	OBJECT TREEWALKER,
	object pointer,
	object suggestionsList,
	object TextElement,
	object element = FSUIAGetFocusedElement(),
	object ParentElement = FSUIAGetParentOfElement (element),
	string BrailleText, string suggestion, string tmp
if ! element then return endIf
;The text object for not in dictionary is usually the first sibling
TextElement = FindUIAElementOfType (UIA_TextControlTypeId, ParentElement)
SuggestionsList =FindUIAElementOfType (UIA_ListControlTypeId, ParentElement)
if SuggestionsList then
	Treewalker = FSUIARawViewWalker ()
	Treewalker.CurrentElement = SuggestionsList
	;pointer = SuggestionsList
	;pointer = UIAGetFirstChild(pointer)
	if Treewalker.GoToFirstChild() then
		pointer = TreeWalker.CurrentElement
	else
		pointer = null()endIf
	var object pattern = pointer.GetSelectionItemPattern();
	var int break = pattern && pattern.isSelected
	while (! break )
		if treeWalker.GoToNextSibling() then
			pointer = TreeWalker.CurrentElement
			pattern = pointer.GetSelectionItemPattern();
			break = pattern && pattern.isSelected
		else
			break = ON ; ent of elements list
		endIf
	endWhile
endIf
if pointer.GetSelectionItemPattern().isSelected then Suggestion = pointer.Name EndIf
if TextElement then
	SayMessage (OT_CONTROL_NAME, msgNotInDictionary)
	BrailleText = msgNotInDictionary + cscSpace
	tmp = TextElement.name
	SayMessage (OT_LINE, tmp)
	SpellString (tmp)
	BrailleText = BrailleText + tmp+cscSpace
endIf
if ! stringIsBlank (suggestion) then
	SayMessage (OT_CONTROL_NAME, msgSuggestion)
	BrailleText = BrailleText + msgSuggestion + cscSpace
	tmp = Suggestion
	SayMessage (OT_LINE, tmp)
	SpellString (tmp)
	BrailleText = BrailleText + tmp
else
	SayMessage (OT_CONTROL_NAME, msgNoSuggestion)
	BrailleText = BrailleText + msgNoSuggestion
endIf
if ! stringIsBlank (BrailleText) then BrailleMessage (BrailleText) endIf
EndScript

script  ScriptFileName()
ScriptAndAppNames(msgMSPowerpointClassicPlus)
EndScript

void Function SayUserControl ()
var
	handle hWnd,
	int CId,
	string Name,
	string class
let hWnd = GetFocus ()
let class=GetWindowClass (hWnd)
let name=getWindowName (getParent (hWnd))
let CId=getControlId (hWnd)
if ! isPcCursor() then
	sayWord()
	return
endIf
if class!=wcUserControl then
	return
endIf
if name==wn_NewSlideDlgTitle
|| name==wn_SlideLayoutDlgTitle then
	sayNewSlideType()
elif name==wn_BulletDlgTitle then
	if CId==BulletColorMenuId
	|| cId==BulletColorMenu then
		IndicateControlType (wt_buttonMenu,msg92_L)
	elif CId==BulletTypeId then
		SayMessage(ot_control_name, msg94_L) ; bullet type
		SayWord()
	ElIf cId==cIdBulletButton
	|| cId==cIdNumberButton then
	 	Pause()
		IndicateControlType(wt_button)
	endIf
elif name==wn_BackgroundDlgTitle then
	if CId==FillTypeMenuId then
		IndicateControlType (wt_buttonMenu,msg93_L)
	EndIf
elif name==wn_ColorSchemeDlgTitle then
	SayMessage(ot_control_name, msg96_L)
elif name==wn_SetupShowDlgTitle
&& cId==PenId then
	IndicateControlType (wt_buttonMenu,msg91_L)
elif name==wn_customAnimationDlgTitle
&& cId==cId_animationAfterEffect then
	SayMessage (ot_control_name, msgCustomAnimationAfterEffect1_L)
	routeJAWSToPc()
	leftMouseButton()
	if getVerbosity()==beginner then
		; ensure the first menu item is selected
		if getWindowText (hWnd,read_highlighted)==cscNull then
			NextLine()
		endIf
	endIf
	pcCursor()
elif getDialogPageName()==wn_findPresentation then
	if cId==cId_slideMiniatureDisplay then
		SayMessage (ot_control_name, msgSlideMiniatureDisplay1_L)
	endIf
Elif GlobalRealWindowName==wn_Font then
	If cId==cIdEffectsColorGroupbox then
		IndicateControlType(wt_buttonmenu,GetObjectName())
	EndIf
else
	SayFocusedObject()
	SayMessage(ot_screen_message,GetWindowTextEx(hwnd,false,true))
endIf
EndFunction

void Function SayFocusedWindow ()
var
	handle hwnd,
	int iWnd,
	handle hTmpWnd,
	int FocusId,
	handle parent,
	int bShapeSpoken,
	string ParentName,
	string focusClass,
	string parentClass,
	handle hWinSwitch,
	int iType,
	int iObjType,
	string sOwner
If SayFocusedHJDialogWindow(GlobalFocusWindow) then
	return
EndIf
if HandleCustomSpellCheckWindows (globalFocusWindow) then return EndIf
iObjType = getObjectSubtypeCode ()
handleSlideShowBrailleView()
if IsSlideShowWithUIA () then
; We've either entered a slide show or the slide just transitioned.
; FocusChangedEvent fires just once here, while DocumentUpdated fires multiple times, so we'll read this like we would DocumentLoadedEvent:
	if iObjType == wt_link
	|| iObjType == WT_BUTTON 
	|| iObjType == WT_CHECKBOX 
	|| iObjType == WT_RADIOBUTTON then
		sayObjectTypeAndText()
	endIf
	return
endIf
let PptFocusChangeCalled=true
;Keepp alt+tab from over-talking
let hWinSwitch=findTopLevelWindow(cwc_Dlg32771,cscNull)
if hWinSwitch
&& isWindowVisible(hWinSwitch) then
	Return
EndIf
if switchingPanes then
	return
endIf
; Check for Outlook 2010 to be the application when sending an eMail directly from Powerpoint 2010:
let sOwner=GetWindowOwner(GetFocus())
if StringContains(sOwner,sc_outllibr) then
	let gbSwitchingConfiguration=true
	SwitchToConfiguration(an_MSOutlook)
	return
EndIf
; wrap the test for slideshow in an if testing for menus and dialogs so don't get dinging from pc
; when object model calls fail.
if ! dialogActive()
&& !menusActive() then
	; get the app object
	if gbMayInitializeObject && !PowerPointIsInitialized()
	&& getWindowClass (globalFocusWindow) == wcPowerpointClient then
		initPPTAppObj()
	EndIf
	if detectSlideShowStart() then
		pause()
		UserBufferClear()
		UserBufferActivate(false)
		readSlideShowSlide(true,true)
		JAWSTopOfFile()
		SayAll()
		return
	elif isSlideShow() then
		if ! UserBufferIsActive() then
			; this will occur when switching back to PP from elsewhere.
			UserBufferClear()
			pause()
			UserBufferActivate(false)
			ReloadSlideShowScreen()
		endIf
		readSlideShowSlide(true,true)
		SayLine()
		return
	endIf
endIf
if UserBufferIsActive() then
	sayLine()
	return
endIf
let hwnd=GetFocus()
let FocusId=GetControlId(hwnd)
let parent=GetParent(hwnd)
let focusClass=getWindowClass(hwnd)
let parentClass=getWindowClass(parent)
let ParentName=getWindowName(parent)
let iType=GetWindowSubtypeCode(hwnd)
If !iType then
	let iType=GetObjectSubtypeCode()
EndIf
let iObjType=GetObjectSubtypeCode()
if focusClass==wcUserControl then
	SayUserControl()
; check if in Powerpoint object, Excel worksheet, MSWord document
elif focusClass==wcPowerpointClient
|| focusClass==wcExcel7
|| focusClass==wc_wordMainDocumentWindow then
	if isPptEditMode() then
		IndicateControlType (wt_edit,cscSpace,cscSpace)
			return
	else
		if GlobalPrevApp!=GetAppMainWindow(GlobalFocusWindow) then
			let GlobalSayStabilizedShape=true
		else
			if globalNewSlideAdded then ; set by ControlEnterKey (InsertSlide) script.
				saySlideTitleOrIndexNumber(TRUE); this will keep them from spelling if it got scheduled.
				SaySlidePosition ()
				globalNewSlideAdded = FALSE
			endIf
			let bShapeSpoken = SaySelectedShape()
			if !bShapeSpoken && ! OnThumbnailsView () then
				Return
			EndIf
		EndIf
	endIf
	if isCaretInTable() then
		say(getCellContents(),ot_line)
		say(getCellCoordinateString(), ot_position)
	else
		;sayLine()
		if ! bShapeSpoken then
			performScript saySelectedObject()
		endIf
		Return;
	endIf
elif isMultipageDialog()
&& getDialogPageName()==sc_DesignTemplate
&& getCurrentControlId()==TemplateListview then
	sayObjectTypeAndText()
	saveCursor()
	invisibleCursor()
	; look for the first 20 chars of the "Click OK to install additional templates", tab,
	; This will determine if the currently selected template is installed or not
	if FindString (getRealWindow(getFocus()), subString(scTemplateInstallationStr,1,20), s_bottom, s_unrestricted) then
		SayMessage (ot_item_state, MSG84_L)
		SayMessage (ot_smart_help, scTemplateInstallationStr)
	endIf
	restoreCursor()
elif globalRealWindowName==wn_PackAndGoDlgTitle then
	if focusId==cId_helpButton then
		SayFormattedMessage (ot_control_name,
			FormatString(msgHelp1_L,GetObjectType()))
		return
	elif focusId==cId_chooseDestination then
		SayMessage (ot_control_name, msgChooseDestination1_L)
		IndicateControlType(iObjType)
		return
	endIf
	sayObjectTypeAndText()
elif globalRealWindowName==wn_SpellingDlgTitle  then
	If iType==wt_button
	|| iType==wt_combobox then
		SayFocusedObject()
		Return
	EndIf
	If getControlId(globalFocusWindow)==cId_changeToEdit  then
		PerformScript Spellcheck()
		Return
	EndIf
elif globalRealWindowName==wn_customAnimationDlgTitle then
	if focusId==cId_animatedShapeList then
		SayMessage (ot_control_name,
			getWindowText(getPriorWindow(globalFocusWindow),read_everything))
		sayChunk()
		IndicateControlType(iObjType)
		return
	endIf
	if getDialogPageName()==wn_OrderAndTimingPageTitle then
		if focusId==cId_moveBack then
			SayMessage (ot_control_name, msgMoveBack1_L)
			IndicateControlType(iObjType)
			return
		elif focusId==cId_moveAhead then
			SayMessage (ot_control_name, msgMoveAhead1_L)
			IndicateControlType(iObjType)
			return
		endIf
	elif getDialogPageName()==wn_EffectsPageTitle then
		; we need to handle the prompt, type and value differently from the way sayObjectTypeAndText would handle these combos as an inappropriate control name is used.
		if focusId==cId_EntryEffectCombo then
			SayMessage (ot_control_name, msgCustomEntryEffect1_L)
			IndicateControlType(iObjType)
			SayMessage (ot_item_state, getObjectValue())
			return
		elif focusId==cId_animationEffectCombo then
			SayMessage (ot_control_name, msgCustomAnimationEffect1_L)
			IndicateControlType(iObjType)
			SayMessage (ot_item_state, getObjectValue())
			return
		elif focusId==cId_soundEffectCombo then
			SayMessage (ot_control_name, msgCustomSoundEffect1_L)
			IndicateControlType(iObjType)
			SayMessage (ot_item_state, getObjectValue())
			return
		elif focusId==cId_paraLevel then
			SayMessage (ot_control_name, msgCustomAnimationParaLevel1_L)
			IndicateControlType(iObjType)
			SayMessage (ot_item_state, getObjectValue())
			return
		endIf
	endIf
	sayObjectTypeAndText()
elif getDialogPageName()==wn_findPresentation then
	if focusId==cId_slideMiniatures  then
		SayMessage (ot_control_name, msgSlideMiniatures1_L)
		IndicateControlType(iObjType)
	elif focusId==cId_slideTitles  then
		SayMessage (ot_control_name, msgSlideTitles1_L)
		IndicateControlType(iObjType)
	else
		sayObjectTypeAndText()
	endIf
elif stringContains(globalRealWindowName,wn_AutoContentWizDlgTitle) then
	if focusId==cId_helpButtonAutoContentWiz then
		SayMessage (ot_control_name, msgHelp1_L)
	elif focusId==cId_PresTypeListbox then
		SayMessage (ot_control_name, msgPresentationType1_L)
		IndicateControlType(iObjType)
		SayMessage (ot_item_state, getObjectValue())
		return
	endIf
	sayObjectTypeAndText()
ElIf StringContains(ParentName,wn_About)
&& !StringContains(GetWindowName(GetParent(GlobalPrevFocus)),wn_About) then
	; standard dialog
	let iWnd = 1
	let hTmpWnd = GetFirstWindow(globalFocusWindow)
	;Say each static or RichEdit20W window, starting at window 2
	while iWnd < 12
		let hTmpWnd = GetNextWindow(hTmpWnd)
		SayWindow(hTmpWnd,false)
		let iWnd = iWnd+1
	EndWhile
	SayObjectTypeAndText()
ElIf StringContains(GetWindowName(globalFocusWindow),wn_about)
|| (StringContains(FocusClass,wc_SDM) ; sdm dialog
&& iType==wt_toolbar)	then
	SaySdmFocusedWindow()
ElIf FocusClass==cwcListview then
	SayObjectActiveItem()
ElIf FocusClass==cwc_sysTreeview32 then
	if InHJDialog()
	&& iObjType==wt_treeview then
		SayFocusedObject()
		return
	EndIf
	SayLine()
ElIf StringContains(globalRealWindowName,wn_autocorrect)
&& iType==wt_listbox
&& (iObjType==wt_listboxItem
|| iObjType==wt_listbox) then
	indicateControlType(wt_listbox,cscSpace,cscSpace)
	SayFromCursor()
else
	SayObjectTypeAndText()
endIf
EndFunction

void Function SaySDMFocusedWindow ()
var
	handle hwnd,
	string windowName,
	string prompt,
	string sStaticText,
	int iWinSubtype,
	Int iObjType,
	string sObjName
let hwnd=globalFocusWindow
let GlobalCurrentControl = SdmGetFocus (hwnd)
if switchingPanes  then
	let switchingPanes=false
Elif giEnterKey then
	let giEnterKey=false
EndIf
let iWinSubtype=GetWindowSubtypeCode(hwnd)
let iObjType=GetObjectSubtypeCode()
let sObjName=GetObjectName()
let windowName=getWindowName(getRealWindow(hwnd))
;Speak the static text when the About dialog first gains focus:
If GlobalPrevReal != GlobalRealWindow
|| GlobalRealWindowName != GlobalPrevRealName then
	SayWindowTypeAndText (hwnd) ; dialog box name
	let sStaticText=MSAAGetDialogStaticText()
	if stringContains(sStaticText,scDocumentRecovery) then
		Say(sStaticText,ot_screen_message)
	EndIf
endIf ; new real window handle or name
; Speak the static text when we first enter the About dialog
if StringContains(WindowName,wn_About)
&& !StringContains(GetWindowName(GlobalPrevFocus),wn_About) then
	SDMSayStaticText(hwnd)
EndIf

;For Symbol dialog off Bullets and Numbering dialog:
If StringContains(WindowName,wn_Symbol)
&& (globalCurrentControl==cId_SymbolChar
|| globalCurrentControl==cId_SymbolChar2003) then
	Delay(1)
	SaySymbolPrompt()
 indicateControlType(wt_edit);,cscSpace,cscSpace)
 	let GlobalPrevCurrentControl = GlobalCurrentControl
	Return
EndIf

;for Diagram Gallery dialog off Slide Layout dialog:
If StringContains(globalRealWindowName,wn_DiagramGallery)
&& iWinSubtype==wt_listbox then
	let giDiagramGalleryListbox=true
	indicateControlType(wt_listbox,msgDiagramGalleryListbox,cscSpace)
	let GlobalPrevCurrentControl = GlobalCurrentControl
	return
EndIf

if iObjType==wt_groupbox then
	sayMessage(ot_screen_message,MSAAGetDialogStaticText())
	indicateControlType(wt_groupbox,GetObjectName(SOURCE_CACHED_DATA),cscSpace)
	let GlobalPrevCurrentControl = GlobalCurrentControl
	return
EndIf

If StringContains(globalRealWindowName,wn_customize)
&& iWinSubtype==wt_listbox
&& (iObjType==wt_listbox
|| iObjType==wt_checkbox
|| (iObjType==wt_listboxItem
&& ((GetControlAttributes(true)&ctrl_checked)
|| (GetControlAttributes(true)&ctrl_unchecked)))) then
	indicateControlType(wt_listbox,cscSpace,cscSpace)
	SayLine()
	let GlobalPrevCurrentControl = GlobalCurrentControl
	return
EndIf
; now say the focused control
SayFocusedObject()
let GlobalPrevCurrentControl = GlobalCurrentControl
EndFunction

Script SayWindowPromptAndText ()
var
	handle hWnd,
	int iSubType,
	int nMode
if (DialogActive () || isVirtualPcCursor () || IsVirtualRibbonActive() || ! isPcCursor ())
	performScript SayWindowPromptAndText ()
	return
endIf
let nMode=smmTrainingModeActive()
Let hWnd = GetCurrentWindow ()
Let iSubType = GetWindowSubTypeCode (hWnd)
If ! iSubType then
	Let iSubType = GetObjectSubTypeCode()
EndIf
smmToggleTrainingMode(TRUE)
if UserBufferIsActive() then
	if isSlideShow() then
		if giSpeakersNotesActive then
			SayMessage(ot_control_name, msgUserBufferSpeakersNotes)
		else
		sayMessage(ot_control_name, msgUserBufferSlideShow)
		endIf
	elif giReadingUserBufferChart then
		sayMessage(ot_control_name, msgUserBufferChart)
	else
		; a help screen
		sayMessage(ot_control_name, msgUserBufferHelpScreen)
	endIf
	SayTutorialHelp (iSubType, TRUE)
	IndicateComputerBraille (hwnd)
	SayTutorialHelpHotKey (hWnd, TRUE)
	SpeakProgressBarInfo(TRUE)
	smmToggleTrainingMode(nMode)
	return
endIf
; for symbols dialog off Bullets and Numbering dialog:
If StringContains(globalRealWindowName,wn_Symbol)
&& (globalCurrentControl==cId_SymbolChar
|| globalCurrentControl==cId_SymbolChar2003) then
	SaySymbolPrompt()
	GetCustomTutorMessage()
	SayTutorialHelp (iSubType, TRUE)
	SayTutorialHelpHotKey (hWnd, TRUE)
	IndicateComputerBraille (hwnd)
	SpeakProgressBarInfo(TRUE)
	smmToggleTrainingMode(nMode)
	Return
EndIf
If StringContains(globalRealWindowName,wn_font)
&& (iSubtype==wt_listboxItem
|| iSubtype==wt_ComboBox) then
	sayObjectTypeAndText ()
	GetCustomTutorMessage()
	SayTutorialHelp (iSubType, TRUE)
	SayTutorialHelpHotKey (hWnd, TRUE)
	IndicateComputerBraille (hwnd)
	SpeakProgressBarInfo(TRUE)
	smmToggleTrainingMode(nMode)
	return
EndIf
If GetObjectSubtypeCode()==wt_groupbox then
	let iSubtype=wt_groupbox
	SaySDMFocusedWindow()
Else
	if noSelectedShape () then
		saySlideTitleOrIndexNumber ()
	endIf
	sayFocusedWindow()
	If StringContains(getWindowName(GetRealWindow(hwnd)),wn_options)
	&& GetObjectSubtypeCode()==wt_listBoxItem then
		SayUsingVoice(vctx_message,msgOptionsDlgCategoriesTutorHelp,ot_line)
	endIf
EndIf
if inRibbons()
&& iSubtype==wt_tabControl then
	say::SayObjectTypeAndText()
endIf
SayTutorialHelp (iSubType, TRUE)
SayTutorialHelpHotKey (hWnd, TRUE)
IndicateComputerBraille (hwnd)
SpeakProgressBarInfo(TRUE)
smmToggleTrainingMode(nMode)
EndScript

Script sayPriorLine ()
var
	int iSubType,
	int iObjType,
	string sClass,
	string sObjName,
	handle hwnd = GetFocus(),
	string sRealName,
	string priorChunk,
	string focusChunk
let sClass = getWindowClass(hWnd)
if !isPcCursor()
|| IsVirtualRibbonActive()
|| inribbons ()
|| stringContains (sClass, cwc_Richedit60W)
|| sClass == cwc_NetUIHwnd
|| menusActive()
|| UserBufferIsActive() || isVirtualPcCursor () then
	performScript sayPriorLine() ; default
	return
endIf
let iSubType = GetWindowSubtypeCode(hWnd)
if !iSubtype then
	let iSubtype=GetObjectSubtypeCode()
EndIf
let iObjType=GetObjectSubtypeCode()
let sRealName=GetWindowName(getRealWindow(hwnd))
if sClass==wcUserControl then
	priorLine()
	sayUserControl()
elif sClass==wcExcel7 then
	priorLine()
	; excel worksheet
	SaySelectedShape()
elif sClass==wcPowerpointClient then
	priorLine()
	;if	caretVisible() ; Always comes true with FSDOM active:
	if IsPPTEditMode ()
	|| (getCharacterAttributes() & attrib_highlight) then
		if GetObjectIsEditable () then return endIf ; new CaretMovedEvent handles this correctly.
		sayLine()
	else
		if noSelectedShape () then
		;bump up navigation:
			UnscheduleFunction (giFN_SpeakSlideChangeInfo)
			if ! OnThumbnailsView () then
			; thumbnails would otherwise be repeating because SayFocusedWindow already got it.
				Let giFN_SpeakSlideChangeInfo = ScheduleFunction (fn_SpeakSlideChangeInfo,2)
			endIf
		else; a shape is being moved / resized
			unscheduleFunction (giFN_ShapeNavCallback)
			let giFN_ShapeNavCallback = scheduleFunction ("ShapeNavCallback", 2)
		endIf
	endIf
elif isMultipageDialog()
&& getDialogPageName()==wn_DesignTemplateDlgTitle
&& getCurrentControlId()==TemplateListview then
	let priorChunk=getChunk()
	priorLine()
	processNewText() ; announce the selected template
	let focusChunk=getChunk()
	saveCursor()
	invisibleCursor()
	; look for the first 20 chars of the "Click OK to install additional templates", tab,
	; This will determine if the currently selected template is installed or not
	if priorChunk !=focusChunk
	&& FindString (getRealWindow(getFocus()), subString(scTemplateInstallationStr,1,20), s_bottom, s_unrestricted) then
		SayMessage (ot_help, MSG84_L)
	endIf
	restoreCursor()
; avoid hearing erroneous chatter when trying to arrow in the Choose Destination edit in the Pack and Go Wizard
elif sRealName==wn_PackAndGoDlgTitle
&& getCurrentControlId()==cId_chooseDestination
&& iSubtype==wt_edit then
	priorLine()
	pause()
	sayWindow(getCurrentWindow(),read_everything)
elif sRealName==wn_customAnimationDlgTitle
&& getCurrentControlId()==cId_animatedShapeList then
	let pptSuppressEcho=true ; don't want sayHighlighted text to also be triggered
	priorLine()
	sayChunk()
ElIf sRealName==wn_Font then
	if iSubtype==wt_Edit then
		PriorLine()
		if GetControlID(GlobalFocusWindow)==cID_EffectsOffset then
			Say(GetObjectValue(),ot_line)
			return
		else ;SayHighlightedText will speak the value
			return
		EndIf
	EndIf
;For Symbol dialog off Bullets and Numbering dialog:
ElIf StringContains(sRealName,wn_Symbol)
&& (globalCurrentControl==cId_SymbolChar
|| globalCurrentControl==cId_SymbolChar2003) then
	let PPTSuppressEcho=true
	PriorLine()
ElIf StringContains(sRealName,wn_DiagramGallery)
&& iSubtype==wt_listbox then
	PriorLine()
	let giDiagramGalleryListbox=true
ElIf iSubtype==wt_tabControl then
	PriorLine()
	let giTabControl=true
ElIf StringContains(sRealName,wn_Spelling)
&& iSubtype==wt_edit
&& iObjType==wt_listboxItem then
	PriorLine()
	SayObjectActiveItem()
	SpellString(GetObjectName(SOURCE_CACHED_DATA))
else
	performScript sayPriorLine() ; default
endIf
EndScript

Script sayNextLine ()
var
	int iSubType,
	int iObjType,
	string sClass,
	string sObjName,
	handle hwnd =GetFocus(),
	string sRealName,
	string priorChunk,
	string focusChunk
let sClass = getWindowClass(hWnd)
if !isPcCursor()
|| menusActive()
|| IsVirtualRibbonActive()
|| inribbons ()
|| stringContains (sClass, cwc_Richedit60W)
|| sClass == cwc_NetUIHwnd
|| UserBufferIsActive() || isVirtualPcCursor () then
	performScript sayNextLine() ; default
	return
endIf
let iSubType = GetWindowSubtypeCode(hWnd)
if !iSubtype then
	let iSubtype=GetObjectSubtypeCode()
EndIf
let iObjType=GetObjectSubtypeCode()
let sRealName=GetWindowName(getRealWindow(hwnd))
if sClass==wcUserControl then
	nextLine()
	sayUserControl()
elif sClass==wcExcel7 then
	nextLine()
	; excel worksheet
	SaySelectedShape()
elif sClass==wcPowerpointClient then
	nextLine ()
	;if  caretVisible(); Always comes true with FSDom active:
	if IsPPTEditMode ()
	|| (getCharacterAttributes() & attrib_highlight) then
		if GetObjectIsEditable () then return endIf ; new CaretMovedEvent handles this correctly.
		sayLine()
	else
		if noSelectedShape () then
		;bump up navigation:
			UnscheduleFunction (giFN_SpeakSlideChangeInfo)
			if ! OnThumbnailsView () then
			; thumbnails would otherwise be repeating because SayFocusedWindow already got it.
				Let giFN_SpeakSlideChangeInfo = ScheduleFunction (fn_SpeakSlideChangeInfo,2)
			endIf
		else; a shape is being moved / resized
			unscheduleFunction (giFN_ShapeNavCallback)
			let giFN_ShapeNavCallback = scheduleFunction ("ShapeNavCallback", 2)
		endIf
	endIf
elif isMultipageDialog()
&& getDialogPageName()==wn_DesignTemplateDlgTitle
&& getCurrentControlId()==TemplateListview then
	let priorChunk=getChunk()
	nextLine()
	processNewText() ; announce the selected template
	let focusChunk=getChunk()
	saveCursor()
	invisibleCursor()
	; look for the first 20 chars of the "Click OK to install additional templates", tab,
	; This will determine if the currently selected template is installed or not
	if priorChunk !=focusChunk && FindString (getRealWindow(getFocus()), subString(scTemplateInstallationStr,1,20), s_bottom, s_unrestricted) then
		SayMessage (ot_help, MSG84_L)
	endIf
	restoreCursor()
; avoid hearing erroneous chatter when trying to arrow in the Choose Destination edit in the Pack and Go Wizard
elif sRealName==wn_PackAndGoDlgTitle
&& ((getCurrentControlId()==cId_chooseDestination
&& isubtype==wt_edit)
|| (getCurrentControlId()==35
&& isubtype==wt_radioButton)) then
	nextLine()
	pause()
	sayWindow(getCurrentWindow(),read_everything)
elif sRealName==wn_customAnimationDlgTitle
&& getCurrentControlId()==cId_animatedShapeList then
	let pptSuppressEcho=true ; don't want sayHighlighted text to also be triggered
	nextLine()
	sayChunk()
ElIf sRealName==wn_Font then
	if iSubtype==wt_Edit then
		NextLine()
		if GetControlID(GlobalFocusWindow)==cID_EffectsOffset then
			Say(GetObjectValue(),ot_line)
			return
		else ;SayHighlightedText will speak the value
			return
		EndIf
	EndIf
;For Symbol dialog off Bullets and Numbering dialog:
ElIf StringContains(sRealName,wn_Symbol)
&& (globalCurrentControl==cId_SymbolChar
|| globalCurrentControl==cId_SymbolChar2003) then
	let PPTSuppressEcho=true
	NextLine()
ElIf StringContains(sRealName,wn_DiagramGallery)
&& iSubtype==wt_listbox then
	NextLine()
	let giDiagramGalleryListbox=true
ElIf iSubtype==wt_tabControl then
	NextLine()
	let giTabControl=true
ElIf StringContains(sRealName,wn_Spelling)
&& iSubtype==wt_edit
&& iObjType==wt_listboxItem then
	NextLine()
	SayObjectActiveItem()
	SpellString(GetObjectName(SOURCE_CACHED_DATA))
Else
	performScript sayNextLine() ; default
endIf
EndScript

Script sayLine ()
var
	string sClass,
	handle hFocus,
	int iSubtype,
	int iObjType,
	int iState
if inHJDialog() || InRibbons () then
	performScript SayLine()
	return
EndIf
let hFocus=GetFocus()
let iSubtype=GetWindowSubtypeCode(hFocus)
If !iSubtype then
	Let iSubtype=GetObjectSubtypeCode()
EndIf
let iObjType=GetObjectSubtypeCode()
if inRibbons() then
	if iObjType==wt_tabControl then
		say::SayObjectTypeAndText()
	else
		office::SayObjectTypeAndText()
	endIf
	return
endIf
let sClass=GetWindowClass(hFocus)
If IsPcCursor () && DialogActive () && GetObjectIsEditable () && stringContains (sClass, wc_bosa_sdmGeneral)
&& getObjectRole () == ROLE_SYSTEM_GRAPHIC
; older SDM Insert Symbol dialogs where it otherwise reads just the edit control
; These are insert graphics or symbols, PowerPoint still uses this.
	var string symbolName = getObjectName(SOURCE_CACHED_DATA)
	if ! stringIsBlank (symbolName) then
		if isSameScript () then
			spellString (symbolName)
		else
			Say(symbolName,ot_control_Name)
		endIf
		return
	endIf
endIf

	If StringContains(globalRealWindowName,wn_Spelling)
&& iSubtype==wt_edit
&& iObjType==wt_listboxItem then
	If isSameScript() then
		SpellString(GetObjectName(SOURCE_CACHED_DATA))
	Else
		SayObjectActiveItem()
	EndIf
	return
EndIf
; for listboxes in SDM dialogs not on toolbar controls:
If iSubtype==wt_listbox
&& !inHJDialog()
&& sClass!=wc_MSOCommandBar then
	If iObjType==wt_checkbox then
		if StringContains(globalRealWindowName,wn_autoCorrect) then
			SayFromCursor()
		Else
			SayMessage(ot_line,GetObjectName(SOURCE_CACHED_DATA))
			SayMessage(ot_item_state,GetObjectState())
		EndIf
	ElIf iObjtype==wt_static then
		IndicateControlType(wt_static,cscSpace,cscSpace)
		PerformScript SayLine()
	Else
		performScript SayLine()
 	EndIf
 	return
EndIf

if sClass==wc_msoCommandBar then
	SayObjectActiveItem()
	Return
EndIf
If sClass==wc_wwn then
	SayLine()
	return
EndIf
if !isPcCursor()
|| menusActive()
|| UserBufferIsActive() then
	performScript sayLine() ; default
	return
endIf
if sClass==wcUserControl then
	sayUserControl()
elif sClass==wcExcel7 then
	; excel worksheet
	SaySelectedShape()
elif sClass==wcPowerpointClient && !isVirtualPcCursor () then
	if isOutlineView () then
		PerformScript SayLine ()
		return
	endIf
	if (caretVisible()
	&& IsPPTEditMode ())
	|| (getCharacterAttributes() & attrib_highlight) then
	if stringIsBlank (getLine ()) then
	; cases where you press enter, there's a selection but JAWS internally doesn't see the line:
		var string selection = getSelectedTextFromObject ()
		if ! stringIsBlank (selection) then
			if isSameScript () then
				spellString (selection)
			else
				say (selection, OT_LINE)
			endIf
			return
		endIf
	endIf
		if IsSameScript() then
			SpellLine()
		Else
			sayLine()
		EndIf
	else
		;Say Slide info first, then focused object description.
		SpeakSlideChangeInfo (TRUE);Read focused object on SayLine
	endIf
elif globalRealWindowName==wn_PackAndGoDlgTitle
&& getCurrentControlId()==cId_chooseDestination
&& iSubtype==wt_edit then
	if getWindowText(getCurrentWindow(),read_everything)!=cscNull then
		sayWindow(getCurrentWindow(),read_everything)
	else
		SayMessage(ot_word,cmsgBlank1)
	endIf
ElIf giDiagramGalleryListbox then
	Say(MSAAGetDialogStaticText(),ot_line)
ElIf iObjType==wt_groupbox then
	SayMessage(ot_line,GetObjectName(SOURCE_CACHED_DATA))
else
	performScript sayLine() ; default
endIf
EndScript

Script sayWord ()
Var
	handle hwnd,
	string sClass
let hwnd=GetCurrentWindow()
If (GetMenuMode()>0
|| InRibbons()
|| IsVirtualRibbonActive()
|| IsStatusBarToolBar(hwnd))
&& isPCCursor() then
	if IsSameScript() then
		SpellString(getWord())
		AddHook (HK_SCRIPT, "SpellWordHook")
	Else
		performscript SayLine()
	EndIf
	Return
EndIf
if !isPcCursor()
|| menusActive() || UserBufferIsActive() then
	if GlobalMenuMode==MenuBar_Active
	&& IsPCCursor()
	&& GetObjectSubtypeCode()==wt_button then
		IndicateControlType(wt_button,GetObjectName(),cscSpace)
		SayMessage(ot_item_state,GetObjectState())
	else
		performScript sayWord() ; default
	EndIf
	return
endIf
let sClass=GetWindowClass(GetFocus())
if sClass==wcExcel7 then
	SaySelectedShape()
elif sClass==wcUserControl then
	SayUserControl()
elif sClass==wcPowerpointClient && !isVirtualPcCursor () then
	if isPPTEditMode ()
	|| isOutlineView ()
	|| (GetCharacterAttributes() & attrib_highlight) then
		if GetObjectIsEditable () then
			PerformScript SayWord ()
			return
		endIf
	elIf  isOutlineView ()
	|| (GetCharacterAttributes() & attrib_highlight) then
		If IsSameScript () Then
			SpellWord()
			AddHook (HK_SCRIPT, sc_SpellwordHook)
			return
		else
			sayWord() ; default
		endIf
	else
		performScript saySelectedObject()
	endIf
else
	performScript sayWord() ; default
endIf
EndScript

Script SayPriorCharacter ()
var
	int iType,
	string priorChunk, ; used for determining if we have changed selected item in the design template page of the new presentation dialog
	string focusChunk,
	string sClass ,
	handle hwnd
let hwnd=GetFocus()
let sClass=GetWindowClass(hwnd)
let iType=GetWindowSubtypeCode(hwnd)
If !iType then
	Let iType=GetObjectSubtypeCode()
EndIf
if !isPcCursor()
|| menusActive()
|| IsVirtualRibbonActive()
|| inribbons ()
|| stringContains (sClass, cwc_Richedit60W)
|| sClass == cwc_NetUIHwnd
|| UserBufferIsActive() || isVirtualPcCursor () then
	performScript sayPriorCharacter() ; default
	return
endIf
if sClass==wcExcel7 then
	priorCharacter()
	SaySelectedShape()
elif sClass==wcUserControl then
	priorCharacter()
	SayUserControl()
; wcPowerpointClient="PaneClassDC"
elif sClass==wcPowerpointClient then
	priorCharacter()
	if isPPTEditMode ()
	|| isOutlineView ()
	|| (GetCharacterAttributes() & attrib_highlight) then
		if GetObjectIsEditable () then
			return
		endIf ; new CaretMovedEvent handles this correctly.
		sayCharacter() ; default
	else
		;nav info update
		if ! noSelectedShape () then
			unscheduleFunction (giFN_ShapeNavCallback)
			let giFN_ShapeNavCallback = scheduleFunction ("ShapeNavCallback", 2)
		else
			performScript saySelectedObject()
		endIf
	endIf
elif isMultipageDialog()
&& getDialogPageName()==wn_DesignTemplateDlgTitle
&& globalCurrentControl==TemplateListview then
	let priorChunk=getChunk()
	priorCharacter()
	processNewText() ; announce the selected template
	let focusChunk=getChunk()
	saveCursor()
	invisibleCursor()
; look for the first 20 chars of the "Click OK to install additional templates", tab,
; This will determine if the currently selected template is installed or not
	if priorChunk !=focusChunk && FindString (getRealWindow(getFocus()), subString(scTemplateInstallationStr,1,20), s_bottom, s_unrestricted) then
		SayMessage (ot_help, MSG84_L)
	endIf
	restoreCursor()
;For Symbol dialog off Bullets and Numbering dialog:
ElIf StringContains(getWindowName(getRealWindow(hwnd)),wn_Symbol)
&& (globalCurrentControl==cId_SymbolChar
|| globalCurrentControl==cId_SymbolChar2003) then
	let PPTSuppressEcho=true ; cleared in SayHighlightedText
	PriorCharacter()
ElIf StringContains(globalRealWindowName,wn_DiagramGallery)
&& iType==wt_listbox then
	PriorCharacter()
	let giDiagramGalleryListbox=true
;elIf iType==wt_tabControl  then
	;PriorCharacter()
	;let giTabControl=true
;	return
else
	performScript sayPriorCharacter()
endIf
EndScript

Script sayCharacter ()
Var
	String sClass
if !isPcCursor()
|| IsVirtualRibbonActive()
|| menusActive() || UserBufferIsActive() then
	if GlobalMenuMode==MenuBar_Active
	&& IsPCCursor()
	&& GetObjectSubtypeCode()==wt_button then
		IndicateControlType(wt_button,GetObjectName(),cscSpace)
		SayMessage(ot_item_state,GetObjectState())
	else
		performScript sayCharacter() ; default
	EndIf
	return
endIf
if IsSameScript () then
	PerformScript SayCharacter()
	return
EndIf

let sClass=GetWindowClass(GetFocus())
if sClass==wcExcel7 then
	SaySelectedShape()
elif sClass==wcUserControl then
	SayUserControl()
; wcPowerpointClient="PaneClassDC"
elif sClass==wcPowerpointClient then
	if caretVisible()
	|| (GetCharacterAttributes() & attrib_highlight)
	|| isOutlineView () then
		sayCharacter() ; default
	else
		performScript saySelectedObject()
	endIf

;For Symbol dialog off Bullets and Numbering dialog:
ElIf StringContains(getWindowName(getRealWindow(globalFocusWindow)),wn_Symbol)
&& (globalCurrentControl==cId_SymbolChar
|| globalCurrentControl==cId_SymbolChar2003) then
	Delay(1)
	SaySymbolPrompt()
else
	performScript sayCharacter() ; default
endIf
EndScript

script SayNextCharacter ()
var
	int iType,
	string priorChunk,
	string focusChunk,
	string sClass,
	handle hwnd
let hwnd=GetFocus()
let sClass=GetWindowClass(hwnd)
let iType=GetWindowSubtypeCode(hwnd)
If !iType then
	Let iType=GetObjectSubtypeCode()
EndIf
if !isPcCursor()
|| menusActive()
|| IsVirtualRibbonActive()
|| inribbons ()
|| stringContains (sClass, cwc_Richedit60W)
|| sClass == cwc_NetUIHwnd
|| UserBufferIsActive() || isVirtualPcCursor () then
	performScript sayNextCharacter() ; default
	return
endIf
if sClass==wcExcel7 then
	nextCharacter()
	SaySelectedShape()
elif sClass==wcUserControl then
	nextCharacter()
	SayUserControl()
; wcPowerpointClient="PaneClassDC"
elif sClass==wcPowerpointClient then
	nextCharacter()
	if isOutlineView ()
	|| isPPTEditMode ()
	|| (GetCharacterAttributes() & attrib_highlight) then
		if GetObjectIsEditable () then
			return
		endIf ; new CaretMovedEvent handles this correctly.
		sayCharacter() ; legacy
	else
		;nav info update
		if ! noSelectedShape () then
			unscheduleFunction (giFN_ShapeNavCallback)
			let giFN_ShapeNavCallback = scheduleFunction ("ShapeNavCallback", 2)
		else
			performScript saySelectedObject()
		endIf
	endIf
elif isMultipageDialog()
&& getDialogPageName()==wn_DesignTemplateDlgTitle
&& globalCurrentControl==TemplateListview then
	let priorChunk=getChunk()
	nextCharacter()
	processNewText() ; announce the selected template
	let focusChunk=getChunk()
	saveCursor()
	invisibleCursor()
	; look for the first 20 chars of the "Click OK to install additional templates", tab,
	; This will determine if the currently selected template is installed or not
	if priorChunk !=focusChunk && FindString (getRealWindow(getFocus()), subString(scTemplateInstallationStr,1,20), s_bottom, s_unrestricted) then
		SayMessage (ot_help, MSG84_L)
	endIf
	restoreCursor()
;	Symbol dialog off Bullets and Numbering dialog:
ElIf StringContains(getWindowName(getRealWindow(hwnd)),wn_Symbol)
&& (globalCurrentControl==cId_SymbolChar
|| globalCurrentControl==cId_SymbolChar2003) then
	let PPTSuppressEcho=true ; cleared in SayHighlightedText
	NextCharacter()
ElIf StringContains(globalRealWindowName,wn_DiagramGallery)
&& iType==wt_listbox then
	NextCharacter()
	let giDiagramGalleryListbox=true
;ElIf iType==wt_tabControl  then
	;NextCharacter()
	;let giTabControl=true
;	return
else
	performScript sayNextCharacter()
endIf
endScript

Script readTableRowByRow ()
readTableRowByRow ()
EndScript

Script readTableColumnByColumn ()
readTableColumnByColumn ()
EndScript

script SetTableReadingMethod ()
SayMessage (OT_STATUS, ToggleTableReadingMethod(FALSE))
EndScript

Script ReadCurrentSlide ()
ReadCurrentSlide ()
EndScript

Script SaySelectedObject ()
if getWindowClass(getFocus())!=wcPowerpointClient
&& getWindowClass(getFocus()) !=wcExcel7 || UserBufferIsActive() then
	performScript saySelectedText() ; default
	return
endIf
SaySelectedObject ()
EndScript

Script selectShape ()
if InHJDialog () then
	SayFormattedMessage (ot_error, cMSG337_L, cMsg337_S)
return
endIf
selectShape ()
EndScript

int function SelectALinkDialog()
if InHJDialog () then
	SayFormattedMessage (ot_error, cMSG337_L, cMsg337_S)
	return true
endIf
if IsSlideShowWithUIA () then
; SelectALink now works the way other virtual environments work.
	return SelectALinkDialog ()
endIf
selectHyperlink ()
return true
EndFunction

Script SelectHyperlink ()
Var
	handle hwnd
let hwnd=GetFocus()
if InProofingPaneSpellCheck () then
	performScript spellcheck()
	return
endIf
SelectALinkDialog()
EndScript

Script FollowSelectedHyperlink ()
FollowSelectedHyperlink()
EndScript

Script NextObject ()
var
	int iObjType,
	handle hwnd,
	string sClass
let PptFocusChangeCalled=false
let PptSuppressEcho=true
let hwnd=GetFocus()
let sClass=GetWindowClass(hwnd)
if (UserBufferIsActive()
&& !isSlideshow())
|| IsSlideShowWithUIA ()
|| InRibbons ()
|| isStatusBarToolbar(hwnd)
|| sClass==wc_netUiHwnd
|| sClass==cwc_RichEdit20w
|| InOptionsDialog(hwnd) then
	PerformScript Tab()
	Return
EndIf
if GetLastMouseMovementTime () <= GetLastKeyPressTime () then
	sayCurrentScriptKeyLabel()
endIf
TabKey()
delay(1)
let iObjType=GetObjectSubtypeCode()
; need next three lines to avoid speaking selected shape while in SDM dialogs,
; menus and the ribbon
if DialogActive()
|| iObjType==wt_tabControl
|| GetMenuMode()>0 then
	if iObjtype==wt_tabcontrol then
		SayObjectTypeAndText()
	endIf
  return
endIf
pause()
if !PptFocusChangeCalled then
	SaySelectedShape()
endIf
EndScript

Script PriorObject ()
var
	int iObjType,
	handle hwnd,
	string sClass
let PptFocusChangeCalled=false
let PptSuppressEcho=true
let hwnd=GetFocus()
let sClass=GetWindowClass(hwnd)
if (UserBufferIsActive()
&& !isSlideshow())
|| IsSlideShowWithUIA ()
|| InRibbons ()
|| isStatusBarToolbar(hwnd)
|| sClass==wc_netUiHwnd
|| sClass==cwc_RichEdit20w
|| InOptionsDialog(hwnd) then
	PerformScript ShiftTab()
	Return
EndIf
if GetLastMouseMovementTime () <= GetLastKeyPressTime () then
	sayCurrentScriptKeyLabel()
endIf
ShiftTabKey()
delay(1)
let iObjtype=GetObjectSubtypeCode()
; need next three lines to avoid speaking selected shape while in SDM dialogs,
; menus and the ribbon
if DialogActive()
|| iObjType==wt_tabControl
|| GetMenuMode()>0 then
	if iObjtype==wt_tabcontrol then
		SayObjectTypeAndText()
	endIf
  return
EndIf
pause()
if !PptFocusChangeCalled then
	SaySelectedShape()
endIf
EndScript

Script PriorSlide ()
sayCurrentScriptKeyLabel()
If SayAllInProgress() then
	PerformScript JAWSPageUp()
	return
EndIf
JAWSPageUp()
if IsSlideShowWithUIA () then
	typeKey (cksPageUp)
	return
endIf ; internals are handling it.
if !IsPCCursor() then
	sayLine()
	return
endIf
if GlobalRealWindowName==wn_Font then
	if GetWindowSubtypeCode(GlobalFocusWindow)==wt_Edit then
		if GetControlID(GlobalFocusWindow)==cID_EffectsOffset then
			Say(GetObjectValue(),ot_line)
			return
		else ;SayHighlightedText will speak the value
			return
		EndIf
	EndIf
EndIf
If GetWindowTypeCode(GetCurrentWindow()) == WT_TABCONTROL
|| GetWindowTypeCode(GetCurrentWindow()) == WT_SLIDER then
	delay(2)
	SayWord()
	return
endIf
; only want to do this if viewing a slide
if GetWindowClass(GetFocus())==wcPowerpointClient
|| GetWindowClass (GetFocus ()) == wcPowerpointSlideShow then
	If IsSlideShow ()
		UserBufferDeactivate()
		UserBufferClear ()
		JAWSPageUp()
		saySlideTitleOrIndexNumber()
		SaySlidePosition ()
		If giSlideTransitions then
			SayCurrentSlideTransition()
		endIf
		BrailleClearMessage ()
		pause()
		UserBufferActivate(false)
		ReloadSlideShowScreen()
	Else
	BeginFlashMessage()
		UnscheduleFunction (giFN_SpeakSlideChangeInfo)
		Let giFN_SpeakSlideChangeInfo = 0
		saySlideTitleOrIndexNumber()
		SaySlidePosition ()
		if isSlideHidden() then
			SayFormattedMessageWithVoice(vctx_message,ot_help,msgSlideHidden_l,msgSlideHidden_s)
		EndIf
		If giDescribeObjects then
			SayObjectDescription()
		EndIf
	EndIf
else
	sayLine()
endIf
 EndScript

Script NextSlide ()
sayCurrentScriptKeyLabel()
If SayAllInProgress() then
	PerformScript JAWSPageDown()
	return
EndIf
if IsSlideShowWithUIA () then
	typeKey (cksPageDown)
	return
endIf ; internals are handling it.
JAWSPageDown()
if !IsPCCursor() then
	sayLine()
	return
endIf
if GlobalRealWindowName==wn_Font then
	if GetWindowSubtypeCode(GlobalFocusWindow)==wt_Edit then
		if GetControlID(GlobalFocusWindow)==cID_EffectsOffset then
			Say(GetObjectValue(),ot_line)
			return
		else ;SayHighlightedText will speak the value
			return
		EndIf
	EndIf
EndIf
if GetWindowTypeCode(GetCurrentWindow()) == WT_TABCONTROL
|| GetWindowTypeCode(GetCurrentWindow()) == WT_SLIDER then
	delay(2)
  SayWord()
  return
endIf
; only want to do this if viewing a slide
if GetWindowClass(GetFocus())==wcPowerpointClient
|| GetWindowClass (GetFocus ()) == wcPowerpointSlideShow then
	If IsSlideShow()
		UserBufferDeactivate()
		UserBufferClear ()
		JAWSPageDown()
		saySlideTitleOrIndexNumber()
		SaySlidePosition ()
		if giSlideTransitions then
			SayCurrentSlideTransition()
		endIf
		BrailleClearMessage ()
		pause()
		UserBufferActivate(false)
		ReloadSlideShowScreen()
	Else
		UnscheduleFunction (giFN_SpeakSlideChangeInfo)
		Let giFN_SpeakSlideChangeInfo = 0
		saySlideTitleOrIndexNumber()
		SaySlidePosition ()
		if isSlideHidden() then
			SayFormattedMessageWithVoice(vctx_message,ot_help,msgSlideHidden_l,msgSlideHidden_s)
		EndIf
		if giDescribeObjects then
			SayObjectDescription()
		endIf
	EndIf
Else
	sayLine()
endIf
EndScript

Script SayFont ()
if ! IsPCCursor ()
|| UserBufferIsActive() || IsVirtualPCCursor() then
	PerformScript SayFont ()
	return
EndIf
if GetWindowClass (GetCurrentWindow ()) != wcPowerpointClient then
	PerformScript SayFont ()
	return
EndIf
sayPPTFont()
EndScript

Script BoldText ()
TypeKey (ksBold)
ReportFont (btnBold)
EndScript

Script ItalicText ()
TypeKey (ksItalic)
ReportFont (btnItalic)
EndScript

Script UnderlineText ()
TypeKey (ksUnderline)
ReportFont (btnUnderline)
EndScript

Script CenterText ()
TypeKey (ksCenterText) ; Ctrl+e
if ! getRunningFSProducts () & product_JAWS then
	return sayCurrentScriptKeyLabel ()
endIf
pause()
SayMessage(ot_status,msgCentered)
EndScript

Script  LeftJustify()
TypeKey (ksLeftJustify) ; Ctrl+l
if ! getRunningFSProducts () & product_JAWS then
	return sayCurrentScriptKeyLabel ()
endIf
Pause()
SayMessage(ot_status,msgAlignedLeft)
EndScript

Script rightJustify ()
TypeKey (ksRightJustify) ; Ctrl+R
if ! getRunningFSProducts () & product_JAWS then
	return sayCurrentScriptKeyLabel ()
endIf
Pause()
SayMessage(ot_status,msgAlignedRight)
EndScript

Script ScreenSensitiveHelp ()
var
	handle realWindow,
	handle focus,
	string focusClass,
	string realName,
	string realClass,
	int FocusId
if ! getRunningFSProducts () & product_JAWS then
	return
endIf
if IsSameScript () then
	AppFileTopic(topic_PowerPoint)
	return
EndIf
; Temporarily allow virtual viewer to display on-screen
SetJCFOption(OPT_VIRT_VIEWER,1)
UserBufferClear ()
If UserBufferIsActive () then
 	UserBufferDeactivate ()
 	SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
if IsVirtualRibbonActive() then
	If GlobalMenuMode == MENUBAR_ACTIVE then
	 	ShowScreenSensitiveHelpForVirtualRibbon(true)
	ElIf GlobalMenuMode == MENU_ACTIVE then
		ShowScreenSensitiveHelpForVirtualRibbon(false)
	EndIf
	SetJcfOption(opt_virt_viewer,0)
	Return
EndIf
if IsSlideShowWithUIA () then
	sayMessage (OT_USER_BUFFER, msgScreenSensitiveHelpPowerPointSlideShowUIA)
	sayMessage (OT_USER_BUFFER, cscBufferNewLine+cscBufferNewLine+cMsgBuffExit)
	return
endIf
let focus=getFocus()
let focusClass=getWindowClass(focus)
let FocusId=GetControlId(focus)
let realWindow=getRealWindow(focus)
let realClass=getWindowClass(realWindow)
let realName=getWindowName(realWindow)
if inRibbons()
|| isStatusBarToolbar(focus)
|| FocusClass==wc_NETUIHwnd then
	ScreenSensitiveHelpForKnownClasses(GetObjectSubtypeCode())
	SetJcfOption(opt_virt_viewer,0)
	return
Elif realName==wn_open
&& globalCurrentControl==cId_OpenButton then
	SayFormattedMessage(OT_USER_BUFFER, msg1_L, msg1_S)
	SetJcfOption(opt_virt_viewer,0)
	return
elif focusClass==wcUserControl
&& realName==wn_NewSlideDlgTitle then
	SayFormattedMessage (OT_USER_BUFFER, msg2_L, msg2_S)
	SetJcfOption(opt_virt_viewer,0)
	return
elif realName==wn_SpellingDlgTitle then
	SayFormattedMessage (OT_USER_BUFFER, msg3_L, msg3_S)
	SetJcfOption(opt_virt_viewer,0)
	return
elif realName==wn_BulletDlgTitle then
	SayFormattedMessage(OT_USER_BUFFER,msg4_L,msg4_S)
	if FocusId==BulletTypeId then
		SayFormattedMessage(OT_USER_BUFFER,msg5_L,msg5_S)
	elif focusClass==wcUserControl then
		SayFormattedMessage(OT_USER_BUFFER,msg6_L,msg6_S)
	else
		PerformScript ScreenSensitiveHelp()
	endIf
elif realName==wn_BackgroundDlgTitle then
	SayFormattedMessage(OT_USER_BUFFER,msg7_L,msg7_S)
	if focusClass==wcUserControl then
		SayFormattedMessage(OT_USER_BUFFER,msg8_L,msg8_S)
	else
		PerformScript ScreenSensitiveHelp()
	endIf
elif realName==wn_ColorSchemeDlgTitle then
	SayFormattedMessage(OT_USER_BUFFER,msg9_L,msg9_S)
	if focusClass==wcUserControl then
		SayFormattedMessage(OT_USER_BUFFER,msg10_L,msg10_S)
	else
		PerformScript ScreenSensitiveHelp()
	EndIf
elif realName==wn_SetUpShowDlgTitle then
	SayFormattedMessage(OT_USER_BUFFER,msg11_L,msg11_S)
	if focusClass==wcUserControl then
		SayFormattedMessage(OT_USER_BUFFER,msg12_L,msg12_S)
	else
		PerformScript ScreenSensitiveHelp()
	EndIf
elif focusClass==wcPowerpointClient
|| focusClass==wcExcel7 then
	PPTScreenSensitiveHelp()
	return
elif focusClass==wc_wordMainDocumentWindow then
	SayFormattedMessage(OT_USER_BUFFER,msg13_L,msg13_S)
	if isCaretInTable() then
		SayFormattedMessage(OT_USER_BUFFER,msg15_L,msg15_S)
		SayFormattedMessage(OT_USER_BUFFER,GetCellCoordinateString())
		SayFormattedMessage(OT_USER_BUFFER,msg16_L,msg16_S)
	endIf
elif focusClass==wc_MsoCommandBarPopup then
	SayFormattedMessage (OT_USER_BUFFER, msg18_L, msg18_S)
	SetJcfOption(opt_virt_viewer,0)
	return
elif getDialogPageName()==wn_findPresentation
&& getCurrentControlId()==cId_slideMiniatureDisplay then
	SayFormattedMessage (OT_USER_BUFFER, msg19_L, msg19_S)
	SetJcfOption(opt_virt_viewer,0)
	return
else
	performScript screenSensitiveHelp() ; default
endIf
JAWSTopOfFile()
SayAll()
SetJcfOption(opt_virt_viewer,0)
EndScript

Script HotkeyHelp ()
var
	handle realWindow,
	handle focus,
	int CId,
	string realName,
	string focusClass,
	string realClass,
	string slideName,
	int pptVersion
if TouchNavigationHotKeys() then
	return
endIf
if ! getRunningFSProducts () & product_JAWS then
	return
endIf
; Temporarily allow virtual viewer to display on-screen
SetJCFOption(OPT_VIRT_VIEWER,1)
sayFormattedMessage (OT_USER_BUFFER, MsgHotKeyHelpO365)
AddAskFSCompanionHotKeyLink()
SayMessage(OT_USER_BUFFER, cScBufferNewLine+cmsgBuffexit)
EndScript

script WindowKeysHelp ()
; Temporarily allow virtual viewer to display on-screen
SetJCFOption(OPT_VIRT_VIEWER,1)
sayMessage (OT_USER_BUFFER, cmsgWindowKeysHelpOfficeQuickSearch+cscBufferNewLine+msgWindowKeysHelpO365)
endScript

string Function GetStatusLineText ()
var
	handle StatusLineHandle,
	handle hwnd,
	string StatusLineText
statusLineText = GetUIAStatusBarText()
if ! StringIsBlank (StatusLineText) then return StatusLineText endIf
saveCursor()
invisibleCursor()
JAWSHome()
JAWSPageDown()
let hwnd=GetCurrentWindow()
restorecursor()
PCCursor()

if GetWindowName(GetParent(GetParent(hwnd)))==wn_StatusBar then
	let StatusLineHandle=hwnd
endIf
if statusLineHandle then
	let statusLineText=GetWindowText(statusLineHandle,false)
	return statusLineText
else
	return cscNull
endIf
EndFunction

Script speakStatusLine ()
SayUsingVoice(vctx_pcCursor,getStatusLineText(),ot_user_requested_information)
EndScript

Script SayBottomLineOfWindow ()
var string statusLineText = GetUIAStatusBarText()
if ! StringIsBlank (statusLineText) then
	SayUsingVoice (VCTX_PcCursor, statusLineText, OT_USER_REQUESTED_INFORMATION)
	return
endIf
PerformScript SayBottomLineOfWindow ()
endScript

script SaySlideInfo ()
var
	int ViewType
if DialogActive()
|| MenusActive() then
  return
endIf
if !isSlideActive() then
	if isSlideShowDone() then
		saySlideShowState()
	else
		SayMessage (ot_error, msg88_L)
	endIf
	return
endIf
if UserBufferIsActive () && ! isSlideShow () then
	;fix so HotKeyHelp will work:
	UserBufferDeactivate ()
endIf
BeginFlashMessage()
if isValidView() then
	sayCurrentSlideLayout(OT_USER_REQUESTED_INFORMATION)
	if isSlideHidden() then
		SayFormattedMessageWithVoice(vctx_message,ot_help,msgSlideHidden_l,msgSlideHidden_s)
	EndIf
else
	saySlideShowState()
	if isSlideShowFullScreen() then
		SayMessage (ot_help, msg30_L,msg30_S) ; full screen mode
	else
		SayMessage(ot_error, msg31_L,msg31_S) ; not in full screen mode.
	endIf
	SayFormattedMessage(ot_help, formatString(msg110_L, getSlideShowPointerType()), formatString(msg110_S, getSlideShowPointerType()))
	sayCurrentSlideTransition()
	SayFormattedMessage (ot_help, formatString(msg89_L, intToString(getShowElapsedTime())), formatString(msg89_S, intToString(getShowElapsedTime())))
endIf
EndFlashMessage()
EndScript

int Function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
var
	handle hwnd,
	int iWinSubtype,
	int iObjSubtype
if !(UserBufferIsActive() && UserBufferIsTrappingKeys())
&& KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
	let hwnd=GetFocus()
	let iWinSubtype=GetWindowSubtypeCode(hwnd)
	let iObjSubtype=GetObjectSubtypeCode()
	If UserBufferIsActive()
	&& IsSlideshowDone() then
		UserBufferClear()
		SayMessage(ot_status,msgExitSlideshow_l,msgExitSlideshow_s)
		return true
	EndIf
	if !shouldItemSpeak(ot_item_state) then
		return true
	endIf
	;for checkable listboxes:
	if !StringContains(globalRealWindowName,wn_autoCorrect) then
		if (iWinSubType==wt_ListBox
		&& (iObjSubtype==wt_checkbox
		|| iObjSubtype==wt_listbox
		|| iObjSubType==wt_listboxItem))
		|| (iWinSubtype==wt_checkbox
		&& !iObjSubtype) then
			delay(3)
			If (getControlAttributes(true)&ctrl_checked) then
	 			IndicateControlState(wt_checkbox,ctrl_checked)
			Elif (getControlAttributes(true)&ctrl_unchecked) then
				IndicateControlState(wt_checkbox,ctrl_unchecked)
			EndIf
			Return true
		EndIf
	EndIf
	;??? The following block is never reached, is the global variable clear needed?
	if InHJDialog() then
		let gbActiveItemChanged=true
		return true
	EndIf
EndIf
return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

void function ProcessKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
var
	handle hwnd,
	string sParentName
if isKeyWaiting() then
	return
endIf
let hwnd=GetFocus()
if globalDetectTextOverflow
&& !nIsScriptKey then
	; test only if within the app:
	if globalAppWindow==globalPrevApp then
		; detect place holder full
		if isPptEditMode() then
			delay(1)
			detectTooMuchInfo(false,true)
		endIf
	endIf
endIf
if nKey==key_Enter
|| nKey==key_Backspace then
	if getWindowClass(hwnd)==wc_openListView then
		let sParentName=GetWindowName(GetParent(hwnd))
		if sParentName==wn_SaveAs then
			let GlobalSayOpenListViewItem=true ;cleared in SayNonHighlightedText
		ElIf sParentName==wn_Open
		|| sParentName==wn_InsertMovie
		|| sParentName==wn_InsertPicture
		|| sParentName==wn_LinkToFile
		|| sParentName==wn_Browse then
			let GlobalSayStabilizedOpenListViewItem=true ;cleared in ScreenStabilizedEvent
		EndIf
	EndIf
EndIf
ProcessKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

Script RetreatSlideShow ()
var int SlideshowUsingUIASupport = IsSlideShowWithUIA ()
if ! SlideshowUsingUIASupport 
&& ! isSlideShow()
&& ! isSlideShowDone() then
	performScript JAWSBackspace()
	return
EndIf
sayCurrentScriptKeyLabel()
TypeKey(ksBackspace)
Pause()
if slideShowUsingUIASupport then return endIf
processSlideshowRetreat()
EndScript

Script SlideShowPrevious ()
if ! isSlideShow()
&& ! isSlideShowDone() then
	TypeCurrentScriptKey ()
	return
EndIf
UserBufferDeactivate()
UserBufferClear ()
TypeCurrentScriptKey ()
Pause()
UserBufferActivate(false)
ReloadSlideShowScreen()
endScript

Script SlideShowNext ()
if ! isSlideShow()
&& ! isSlideShowDone() then
	TypeCurrentScriptKey ()
	return
EndIf
UserBufferDeactivate()
UserBufferClear ()
TypeCurrentScriptKey ()
Pause()
UserBufferActivate(false)
ReloadSlideShowScreen()
endScript

Script  SayAll()
if ! isPCCursor() then
	sayToBottom()
elif caretVisible()
|| UserBufferIsActive() then
	SayAll()
elif isSlideActive() then
	PPTSayAll()
else
	performScript sayAll()
endIf
EndScript

Script SayAllFromLocation ()
if ! isPCCursor() then
	sayToBottom()
elif caretVisible()
|| UserBufferIsActive() then
	PerformScript SayAll()
elif isSlideActive() then
	PPTSayAll()
else
	performScript SayAllFromLocation ()
endIf
EndScript

Script enter()
if inHjDialog () then performScript Enter () return endIf
if (UserBufferIsActive ()
&& ! isSlideShow ())
|| IsVirtualRibbonActive() then
	performScript Enter ()
	Return
endIf
if globalEnteringNewSlideNumber then 
	sayCurrentScriptKeyLabel ()
	typeCurrentScriptKey ()
	return
endIf
if IsSlideShowWithUIA  () then performScript Enter () return endIf
if globalRealWindowName==wn_SpellingDlgTitle  then
	sayCurrentScriptKeyLabel()
	EnterKey()
	PerformScript Spellcheck()
	Return
EndIf
If DialogActive()
|| GetMenuMode()>0 then
	sayCurrentScriptKeyLabel()
	builtin::enterKey()
Else
	sayCurrentScriptKeyLabel()
	ppFunc::enterKey()
	if ! BrailleInUse () then
		;BrailleAddObjectShapeText () already gets this for Braille:
		UpdateFocusWhenEditable ()
	endIf
EndIf
let giEnterKey=true
EndScript

Script upALevel ()
Var
	string sClass
if UserBufferIsActive ()
&& ! IsSlideShow () then
	SayCurrentScriptKeyLabel()
 	UserBufferDeactivate ()
	if inRibbons () then
 		SayObjectActiveItem ()
 	else
 		SayFocusedWindow ()
 	endIf
 	Return
endIf
if dialogActive () then
	performScript upALevel ()
	return
endIf
SayCurrentScriptKeyLabel()
EscapeKey()
globalNewSlideAdded = FALSE
pause()
if globalMenuMode then
	if !GlobalMenuMode
	&& IsSlideShow() then
		UserBufferClear()
		UserBufferActivate(false)
		ReloadSlideShowScreen()
	endIf
endIf
if UserBufferIsActive() then
	if isSlideShow() then
		if giSpeakersNotesActive then
			; need to restore to slide show content
			let giSpeakersNotesActive=false
			UserBufferClear()
			ReloadSlideShowScreen()
			sayLine()
		endIf
	elif giReadingUserBufferChart then
		; don't want to return, we want to pass the keystroke on to deactivate the
		;chart and announce Object Level if the chart has been deactivated
		let giReadingUserBufferChart=false
	else
		; slide show not active, just a help screen or an Excel/MSGraph chart
		giSlideShowActive = FALSE
		UserBufferDeactivate()
		userBufferClear()
		; Toggle off virtual viewer display on-screen
		SetJCFOption(OPT_VIRT_VIEWER,0)
	endIf
endIf
let giSlideShowActive = FALSE ; default use case for escape from slide show.
let sClass=getWindowClass(GetFocus())
if sClass==wcPowerpointClient
|| sClass==wcExcel7 then
	; check if at object level
	if isObjectLevel() then
		SayMessage(ot_status,msg24_L) ; object level
		PerformScript SayLine()
		if globalDetectTextOverflow then
			detectTooMuchInfo(false,true)
		endIf
	endIf
ElIf sClass==wc_netUIHwnd && !IsVirtualRibbonActive() then
	; it may be stuck on a ribbon control.
	SetFocus(FindWindow(GetAppMainWindow(GetFocus()),wc_PaneClassDCParentClass))
EndIf
If BrailleInUse() then
	BrailleRefresh()
EndIf
EndScript

Script sayObjectDimensionsAndLocation ()
sayObjectDimensionsAndLocationHelper ()
endScript

Script sayShapeAnimationInfo ()
if noSelectedShape() then
		SayFormattedMessage(ot_error,msg87_L) ; no shape selected.
	return
endIf
if isSelectedShapeAnimated() then
	SayFormattedMessage(ot_user_requested_information, formatString(msg33_L, getSelectedShapeDescription())) ; this shape is animated
	if isAnimationTriggeredOnMouseClick() then
		SayMessage(ot_user_requested_information, msg44_L, msg44_S) ; "Advances on mouse click",
	elif isAnimationTriggeredOnTime() then
		SayFormattedMessage(ot_user_requested_information, formatString(msg45_L, intToString(getSelectedShapeAnimationTime())), formatString(msg45_S, intToString(getSelectedShapeAnimationTime())))
	endIf
		SayFormattedMessage(ot_user_requested_information, formatString(msg35_L, GetSelectedShapeEntryEffect()), formatString(msg35_S, GetSelectedShapeEntryEffect()))
	SayFormattedMessage(ot_user_requested_information, formatString(msg36_L, getSelectedShapeTextUnit()), formatString(msg36_S, getSelectedShapeTextUnit()))
		SayFormattedMessage(ot_user_requested_information,formatString(msg38_L, getSelectedShapeTextLevelEffect()), formatString(msg38_S, getSelectedShapeTextLevelEffect()))
	if isShapeAnimatedInReverse() then
		SayMessage(ot_user_requested_information, msg39_L, msg39_S) ; text will be animated in reverse.
	endIf
		SayFormattedMessage(ot_user_requested_information, formatString(msg37_L, getSelectedShapeAfterEffect()), formatString(msg37_S, getSelectedShapeAfterEffect()))
else
	SayMessage(ot_user_requested_information,msg34_L) ; this shape is not animated
endIf
EndScript

void function UIASetFocusToInputTextBoxSwitchingPanes ()
; Used from SwitchPanes and SwitchPanesReverse scripts 
; check to see Notes Pane is active before calling this function,
; which places focus into the proper text box, a graphic with text range.
; The first one that takes focus is not the correct item, but its sibling.
if ! OnNotesPane () then return endIf
if ! FocusWindowSupportsUIA () then return endIf
var int type = getObjectSubtypeCode ()
if type != WT_BITMAP && type != WT_DIALOG_PAGE then
; WT_DIALOG_PAGE is the same here as UIA_PaneControlTypeId
	return
endIf
var object element = FSUIAGetFocusedElement() ; updated faster function
if ! element then return endIf
var object TextBox
if element.controltype == UIA_ImageControlTypeId then
	if ! element.GetTextPattern() then return endIf
	var object treewalker = FSUIARawViewWalker ()
	; create a local treewalker and move so as not to use function that calls createObjectEX:
	if ! treewalker then return endIf
	treewalker.currentElement = element
	if ! treewalker.gotoNextSibling() then return FALSE endIf
	TextBox = treewalker.currentElement
elif element.controltype == UIA_PaneControlTypeId then
	if element.AutomationID != "SlideNotesPane" then return endIf
	TextBox = FindUIAElementOfProperty (UIA_ControlTypePropertyId, UIA_ImageControlTypeId, TreeScope_Subtree, element)
endIf
if ! TextBox then return endIf
if TextBox.controltype != UIA_ImageControlTypeId then return endIf
if ! TextBox.GetTextPattern() then return endIf
; invoke pattern works where .setFocus does not.
if  TextBox.GetInvokePattern().Invoke() then
	SaveCursor ()
	PcCursor ()
	JAWSTopOfFile ()
endIf
endFunction

int function OnFakeNotesTextBox ()
if ! OnNotesPane () then return FALSE endIf
if ! FocusWindowSupportsUIA () then return FALSE endIf
; pane in this case is dialog page in JFW subtype Code.
RETURN (getObjectSubtypeCode () == WT_DIALOG_PAGE
&& getObjectAutomationID () != "SlideNotesPane")
endFunction

Script SwitchPanes ()
Var
	string sPaneView
sayCurrentScriptKeyLabel()
TypeKey (ksSwitchPanes) ; F6 in English
let switchingPanes=GetObjectSubtypeCode () == WT_UNKNOWN
delay (1, TRUE)
; rectify where UIA focus modifies the standard focus order:
if OnFakeNotesTextBox () then
	TypeKey (ksSwitchPanes)
	delay (1, TRUE)
endIf
if GetWindowClass(GetFocus())==wcPowerpointClient
&& isNormalView() then
	if shouldItemSpeak(ot_JAWS_message) then
		sayActivePaneView()
	endIf
	UIASetFocusToInputTextBoxSwitchingPanes ()
endIf
if sPaneView==ppViewThumbnails then
	performScript SaySelectedObject()
EndIf
if sPaneView==ppViewNotesPage
|| sPaneView==ppViewOutline then
	SayLine()
EndIf
let switchingPanes=false
EndScript

Script switchPanesReverse ()
Var
	string sPaneView
sayCurrentScriptKeyLabel()
let switchingPanes=GetObjectSubtypeCode () == WT_UNKNOWN
TypeKey (ksSwitchPanesReverse) ; ShiftF6 in English
delay (1, TRUE)
; rectify where UIA focus modifies the standard focus order:
if OnFakeNotesTextBox () then
	TypeKey (ksSwitchPanesReverse)
	delay (1, TRUE)
endIf
if GetWindowClass(GetFocus())==wcPowerpointClient
&& isNormalView() then
	if shouldItemSpeak(ot_JAWS_message) then
		sayActivePaneView()
	endIf
	UIASetFocusToInputTextBoxSwitchingPanes () 
endIf
if sPaneView==ppViewThumbnails then
	performScript SaySelectedObject()
EndIf
if sPaneView==ppViewNotesPage
|| sPaneView==ppViewOutline then
	SayLine()
EndIf
let switchingPanes=false
EndScript

Script upCell ()
var
	int col,
	int row
if IsSlideShowWithUIA  () then
; default table support
	PerformScript UpCell ()
	return
endIf
if !TableErrorEncountered() then
	getCellCoordinates (col, row, 1)
	priorLine()
	pause()
	getCellCoordinates (col, row, 1)
	if col > 1 then
		SayUsingVoice (vctx_message, GetRowHeader(),OT_SCREEN_MESSAGE)
	endIf
	say(getCellContents(),ot_line)
	let PptSuppressEcho=true ; avoid double speaking
	say(getCellCoordinateString(), ot_position)
endIf
EndScript

Script downCell ()
var
	int col,
	int row
if IsSlideShowWithUIA  () then
; default table support
	PerformScript DownCell ()
	return
endIf
if !TableErrorEncountered() then
	getCellCoordinates (col, row, 1)
	nextLine()
	pause()
	getCellCoordinates (col, row, 1)
	if col > 1 then
		SayUsingVoice  (vctx_message, GetRowHeader(),OT_SCREEN_MESSAGE)
	endIf
	say(getCellContents(),ot_line)
	let PptSuppressEcho=true ; avoid double speaking
	say(getCellCoordinateString(), ot_position)
endIf
EndScript

Script priorCell ()
var int col, int row;
if IsSlideShowWithUIA  () then
; default table support
	PerformScript PriorCell ()
	return
endIf
if !TableErrorEncountered() then
	shiftTabKey()
	pause()
	getCellCoordinates (col, row, 1)
	if row > 1 then
		SayUsingVoice (vctx_message, GetColumnHeader(),OT_SCREEN_MESSAGE)
	endIf
	say(getCellContents(),ot_line)
	let PptSuppressEcho=true ; avoid double speaking
	say(getCellCoordinateString(),ot_position)
else
endIf
EndScript

Script nextCell ()
var int col, int row;
if IsSlideShowWithUIA  () then
; default table support
	PerformScript NextCell ()
	return
endIf
if !TableErrorEncountered() then
	tabKey()
	pause()
	getCellCoordinates (col, row, 1)
	if row > 1 then
		SayUsingVoice (vctx_message, GetColumnHeader(),OT_SCREEN_MESSAGE)
	endIf
	say(getCellContents(),ot_line)
	let PptSuppressEcho=true ; avoid double speaking
	say(getCellCoordinateString(), ot_position)
endIf
EndScript

Script FirstCellInTable()
var
	int col,
	int row
if IsSlideShowWithUIA  () then
; default table support
	PerformScript FirstCellInTable ()
	return
endIf
if !TableErrorEncountered() then
	getCellCoordinates (col, row, 1)
	TypeKey("control+Home")
	pause()
	getCellCoordinates (col, row, 1)
	say(getCellContents(),ot_line)
	let PptSuppressEcho=true ; avoid double speaking
	say(getCellCoordinateString(), ot_position)
endIf
EndScript

Script LastCellInTable()
var
	int col,
	int row
if IsSlideShowWithUIA  () then
; default table support
	PerformScript LastCellInTable ()
	return
endIf
if !TableErrorEncountered() then
	getCellCoordinates (col, row, 1)
	TypeKey("control+End")
	pause()
	getCellCoordinates (col, row, 1)
	if row > 1 then
		SayUsingVoice (vctx_message, GetColumnHeader(),OT_SCREEN_MESSAGE)
	endIf
	if col > 1 then
		SayUsingVoice (vctx_message, GetRowHeader(),OT_SCREEN_MESSAGE)
	endIf
	say(getCellContents(),ot_line)
	let PptSuppressEcho=true ; avoid double speaking
	say(getCellCoordinateString(), ot_position)
endIf
EndScript

Script sayCell ()
if IsSlideShowWithUIA  () then
; default table support
	PerformScript SayCell ()
	return
endIf
if !TableErrorEncountered() then
	SayUsingVoice (vctx_message, GetColumnHeader(),OT_SCREEN_MESSAGE)
	SayUsingVoice (vctx_message, GetRowHeader(),OT_SCREEN_MESSAGE)
	say(getCellContents(),ot_line)
	say(getCellCoordinateString(),ot_position)
endIf
EndScript

Script sayLookInOrSaveInFolderName ()
var
string windowName,
string theClass,
string folderName

let windowName=getWindowName(getRealWindow(getFocus()))
let theClass=getWindowClass(getFocus())
if windowName==wn_saveAs
|| windowName==wn_open
|| theClass==wc_openListView then
	; in the save as, open or list view for either dialog
	saveCursor()
	invisibleCursor()
	if moveToControl(getRealWindow(globalFocusWindow),cId_folderCombo) then
		let folderName=getChunk()
	; else we might be in the open List view so need to get to the sdm dialog first
	elif moveToControl(globalPrevReal, cId_folderCombo) then
		let folderName=getChunk()
	endIf
	restoreCursor()
endIf
if windowName==wn_saveAs then
	SayFormattedMessage (ot_help, formatString(msgDestinationFolder1_L, folderName), formatString(msgDestinationFolder1_S, folderName))
elif windowName==wn_open then
	SayFormattedMessage (ot_help, formatString(msgSourceFolder1_L, folderName), formatString(msgSourceFolder1_S, folderName))
endIf
EndScript

Script toggleExpandOrCollapseAll ()
TypeKey (ksToggleExpandCollapse)
if !isOutlineView() then
	return
endIf
pause()
if getExpandAllState()
&& ! getCollapseAllState() then
; Expand All
	SayMessage(ot_item_state,msgExpandAll1_L)
elif getCollapseAllState()
&& ! getExpandAllState() then
; Collapse all
	SayMessage(ot_item_state,msgCollapseAll1_L)
endIf
	SayMessage(ot_item_number,getSlideTitleOrIndexNumber(getSlideWithFocus()))
EndScript

Script PromoteParagraph ()
if isPcCursor() then
	TypeKey (ksAltShiftLeftArrow)
	pause()
 	SayFormattedMessage (ot_position, formatString (msg69_L, intToString(getParagraphIndentLevel())))
else
	performScript mouseLeft()
endIf
EndScript

Script demoteParagraph ()
if isPcCursor() then
	TypeKey (ksAltShiftRightArrow)
	pause()
	SayFormattedMessage (ot_position, formatString (msg69_L, intToString(getParagraphIndentLevel())))
else
	performScript mouseRight()
endIf
EndScript

Script SelectToEndOfLine()
SelectingText(TRUE)
SelectToEndOfLine ()
SelectingText(FALSE)
if isSlideSorterView()then
	delay(1)
	performScript saySelectedObject()
	return
endIf
EndScript

Script SelectFromStartOfLine()
SelectingText(TRUE)
SelectFromStartOfLine ()
SelectingText(FALSE)
if isSlideSorterView()then
	delay(1)
	performScript saySelectedObject()
	return
endIf
EndScript

Script SelectNextLine()
SelectingText(TRUE)
SelectNextLine ()
SelectingText(FALSE)
if isSlideSorterView()then
	delay(1)
	performScript saySelectedObject()
	return
endIf
EndScript

Script SelectPriorLine()
SelectingText(TRUE)
SelectPriorLine ()
SelectingText(FALSE)
if isSlideSorterView()then
	delay(1)
	performScript saySelectedObject()
	return
endIf
EndScript

Script SelectNextCharacter()
SelectingText(TRUE)
SelectNextCharacter ()
SelectingText(FALSE)
if isSlideSorterView()then
	delay(1)
	performScript saySelectedObject()
	return
endIf
EndScript

Script SelectPriorCharacter()
SelectingText(TRUE)
SelectPriorCharacter ()
SelectingText(FALSE)
if isSlideSorterView()then
	delay(1)
	performScript saySelectedObject()
	return
endIf
EndScript

Script SelectNextWord()
SelectingText(TRUE)
SelectNextWord ()
SelectingText(FALSE)
if isSlideSorterView()then
	delay(1)
	performScript saySelectedObject()
	return
endIf
EndScript

Script SelectPriorWord()
SelectingText(TRUE)
SelectPriorWord ()
SelectingText(FALSE)
if isSlideSorterView()then
	delay(1)
	performScript saySelectedObject()
	return
endIf
EndScript

Script SelectNextScreen()
SelectingText(TRUE)
SelectNextScreen ()
SelectingText(FALSE)
if isSlideSorterView()then
	delay(1)
	performScript saySelectedObject()
	return
endIf
EndScript

Script  SelectPriorScreen()
SelectingText(TRUE)
SelectPriorScreen ()
SelectingText(FALSE)
if isSlideSorterView()then
	delay(1)
	performScript saySelectedObject()
	return
endIf
EndScript

Script  SelectToBottom()
SelectingText(TRUE)
SelectToBottom ()
SelectingText(FALSE)
if isSlideSorterView()then
	delay(1)
	performScript saySelectedObject()
	return
endIf
EndScript

Script  SelectFromTop()
SelectingText(TRUE)
SelectFromTop ()
SelectingText(FALSE)
if isSlideSorterView()then
	delay(1)
	performScript saySelectedObject()
	return
endIf
EndScript

Script readSpeakersNotes ()
if isSlideShow() then
	if giSpeakersNotesActive then
		let giSpeakersNotesActive=false
		UserBufferClear()
		SayMessage(ot_smart_help, msgUserBufferSlideShow)
		ReloadSlideShowScreen()
	else
		let giSpeakersNotesActive=true
		UserBufferClear()
		SayMessage(ot_smart_help, msgUserBufferSpeakersNotes)
		ReadSpeakersNotes()
	endIf
elIf IsSlideShowWithUIA ()
	if UserBufferIsActive () then
		UserBufferDeactivate ()
		sayLine ()
	else
		ReadSpeakersNotes()
	endIf
else
	SayFormattedMessage(ot_error,msgSwitchToSpeakerNotes_l,msgSwitchToSpeakerNotes_s)
endIf
EndScript

void Function ScreenStabilizedEvent(handle hwndLastWrite)
var
	string sWindowName
if GlobalSayStabilizedOpenListViewItem then
	let sWindowName=GetWindowName(hwndLastWrite)
	if StringContains(sWindowName,wn_Open)
	|| StringContains(sWindowName,wn_InsertMovie)
	|| StringContains(sWindowName,wn_InsertPicture)
	|| StringContains(sWindowName,wn_LinkToFile)
	|| StringContains(sWindowName,wn_Browse) then
		SayObjectTypeAndText()
		let GlobalSayStabilizedOpenListViewItem=false
		return
	EndIf
EndIf
if GlobalSayStabilizedShape then
	if GetWindowClass(hWndLastWrite)==cwcSysTabCtrl32 then
		let GlobalSayStabilizedShape=false
		SaySelectedShape() ; if one exists.
	EndIf
EndIf
ScreenStabilizedEvent(hwndLastWrite)
EndFunction

script VirtualBackSpace()
var int SlideshowUsingUIASupport = IsSlideShowWithUIA ()
if isSlideShow()
|| SlideshowUsingUIASupport
|| isSlideShowDone() then
	TypeKey (ksBackspace)
	if IsSlideShowWithUIA () then return endIf ; internals are handling it.
	processSlideshowRetreat()
EndIf
EndScript

script VirtualSpaceBar()
if GetWindowClass(getFocus())==wcPowerpointClient
|| GetWindowClass(getFocus()) == wcPowerpointSlideShow then
	; users want to press space on buttons when in the virtual cursor:
	var int subtypeCode = getObjectSubtypeCode ()
	if subtypeCode == WT_BUTTON 
	|| subtypeCode == WT_CHECKBOX
	|| subtypeCode == WT_RADIOBUTTON then
		performScript VirtualSpaceBar ()
		return
	endIf
	TypeKey (ksSpaceBar)
	
	
	if IsSlideShowWithUIA () then return endIf ; internals are handling it.
	advanceSlideShow()
else
	performScript VirtualSpaceBar ()
EndIf
EndScript

script VirtualContextKey()
UserBufferDeactivate ()
sayCurrentScriptKeyLabel()
TypeKey (ksVirtualContextKey) ; ShiftF10 in English
endScript

Script IgnoreButton()
TypeCurrentScriptKey ()
ScheduleSpellCheckReadingIfAppropriate  ()
EndScript

Script IgnoreAllButton ()
TypeCurrentScriptKey ()
ScheduleSpellCheckReadingIfAppropriate  ()
EndScript

Script ChangeButton ()
TypeCurrentScriptKey ()
ScheduleSpellCheckReadingIfAppropriate  ()
EndScript

Script ChangeAllButton ()
TypeCurrentScriptKey ()
ScheduleSpellCheckReadingIfAppropriate  ()
EndScript

Script SuggestButton ()
TypeCurrentScriptKey ()
ScheduleSpellCheckReadingIfAppropriate  ()
EndScript

Script AddToDictionaryButton ()
TypeCurrentScriptKey ()
ScheduleSpellCheckReadingIfAppropriate  ()
EndScript

Script AutoCorrectButton ()
TypeCurrentScriptKey ()
ScheduleSpellCheckReadingIfAppropriate  ()
EndScript

String Function GetCustomTutorMessage()
Var
	int iType
let iType=GetWindowSubtypeCode (GlobalFocusWindow)
If !iType then
	let iType=getObjectSubtypeCode()
EndIf
If iType==wt_toolbar then
	; we are on a toolbar control within an sdm dialog.
	; these controls are activated by down-arrow, not spacebar.
	; so we have to force a custom message.
	return FormatString(cmsgScreenSensitiveHelp23_L)
ElIf GETWindowClass(globalFocusWindow)==wcUserControl then
	If globalCurrentControl==BulletColorMenu
	|| globalCurrentControl==cId_BulletColorMenu
	|| globalCurrentControl==FillTypeMenuId then
		return FormatString(cmsgScreenSensitiveHelp23_L)
	EndIf
; for symbols dialog off Bullets and Numbering dialog:
ElIf StringContains(globalRealWindowName,wn_Symbol)
&& (globalCurrentControl==cId_SymbolChar
|| globalCurrentControl==cId_SymbolChar2003) then
	return msgScreenSensitiveHelp_SymbolPrompt
ElIf StringContains(globalRealWindowName,wn_font)
&& (iType==wt_listboxItem
|| iType==wt_ComboBox) then
	return msgComboBoxTutorHelp
EndIf
	return GetCustomTutorMessage ()
EndFunction

void function tutorMessageEvent(handle hwndFocus, int nMenuMode)
if nMenuMode || inHjDialog () then return tutorMessageEvent(hwndFocus, nMenuMode) endIf
if GetActivePaneView() == ppViewThumbnails 
&& getObjectSubtypeCode () == WT_LISTBOXITEM then
; user is navigating with arrow keys already and the item they're on is now a list box item.
	return 
elIf dialogActive () && GetObjectIsEditable () && stringContains (getWindowClass (hwndFocus), wc_bosa_sdmGeneral)
&& getObjectRole () == ROLE_SYSTEM_GRAPHIC
	sayMessage (OT_TUTOR, GetCustomTutorMessage ())
	return ; don't speak "computer Braille"
endIf
if getObjectRole () == ROLE_SYSTEM_GRAPHIC
&& getWindowClass (globalPrevFocus) == wcPowerpointClient
&& getWindowClass (hwndFocus) == wcPowerpointClient then
	; don't repeat tutor messages all the time ...
		return
endIf
return tutorMessageEvent(hwndFocus, nMenuMode)
endFunction

void function ObjStateChangedEvent (handle hObj,int iObjType,int nChangedState,int nState, int nOldState)
Var
	handle hwnd,
	string sObjName
let hwnd=GetFocus()
if ! nChangedState && ! nState
&& GetWindowClass(hwnd)==cscListviewClass then
	let sObjName=GetObjectName(SOURCE_CACHED_DATA)
	if GetObjectState(true)==sc_selected then
		Say(sObjName,ot_line)
	Else
		sayMessage(ot_item_state,cmsgDeselected)
		Say(sObjName,ot_line)
	EndIf
	return
EndIf
if !StringContains(globalRealWindowName,wn_autoCorrect)
&& !InHJDialog() then
	If GetWindowSubtypeCode(GetFocus())==wt_listbox
	&& (iObjtype==wt_checkbox
	|| iObjType==wt_listboxItem) then
		return
	EndIf
EndIf
If iObjType == WT_TREEVIEW
|| iObjType == WT_TREEVIEWITEM then
	SayLine()
	return
EndIf
ObjStateChangedEvent (hObj,iObjType,nChangedState,nState,nOldState)
EndFunction

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue, int bIsFocusObject)
Var
	handle hFocus,
	string sClass,
	int iWinType
let hFocus=GetFocus()
let sClass=GetWindowClass(hFocus)
let iWinType=GetWindowSubtypeCode(hFocus)
if sClass==wc_officeDropdown then
	If !iWintype
	&& !nObjType then
		say(sObjValue,ot_line)
	EndIf
	return
EndIf
If iWinType==wt_editCombo then
	if !PPTSuppressEcho then
		SayLine()
		let pptSuppressEcho=true
	Else
		let pptSuppressEcho=true
	EndIf
	return
EndIf
ValueChangedEvent (hwnd,objId,childId,nObjType,sObjName,sObjValue, bIsFocusObject)
if getWindowName(getRealWindow(hwnd))==wn_font
&& iWintype==wt_edit then
	sayMessage(ot_highlighted_screen_text,sObjValue)
EndIf
EndFunction

Script PreviousDocumentWindow()
Var
	string sPaneView

let sPaneView=GetActivePaneView()
If sPaneView==ppViewOutline
|| sPaneView==ppViewThumbnails then
	TypeKey(cksControlShiftTab)
	pause()
	SayActivePaneView()
	PerformScript SaySelectedObject()
	return
EndIf
performScript previousDocumentWindow()
EndScript

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
Var
	int iObjType

If InHJDialog()  then
	if gbActiveItemChanged  then ; space was pressed.
		let gbActiveItemChanged=false
		Say(GetObjectName(SOURCE_CACHED_DATA),ot_line)
		return
	Else
		ActiveItemChangedEvent (curHwnd,curObjectId,curChildId,prevHwnd,prevObjectId,prevChildId)
		return
	EndIf
EndIf
let gbActiveItemChanged=false
if getWindowClass (GetFocus ()) == cwc_NetUIHwnd then
	PptSuppressEcho = OFF
		return ActiveItemChangedEvent (curHwnd,curObjectId,curChildId,prevHwnd,prevObjectId,prevChildId)
endIf
; for inside tables when navigating:
; the object name for a table cell in this environment is completely bogus, containing coordinates where the column is 0-based.
; and the state code shows the control as unavailable:
if PptSuppressEcho then
	let PptSuppressEcho = OFF
	return
endIf

if GetObjectSubTypeCode()==wt_treeviewItem then
	SayLine()
	Return
EndIf
; call msoffice hidden function before default.
ActiveItemChangedEvent (curHwnd,curObjectId,curChildId,prevHwnd,prevObjectId,prevChildId)
EndFunction

Script ControlDownArrow()
PerformScript ControlDownArrow()
If GetWindowClass(GetFocus())==cscListviewClass then
	delay(1,true)
	if GetObjectState(true)==sc_selected then
		SayMessage(ot_item_state,cmsg215_l) ; selected
	Else
		sayMessage(ot_item_state,cmsg214_l) ; unselected
	EndIf
EndIf
EndScript

Script ControlUpArrow()
PerformScript ControlUpArrow()
If GetWindowClass(GetFocus())==cscListviewClass then
	delay(1,true)
	if GetObjectState(true)==sc_selected then
		SayMessage(ot_item_state,cmsg215_l) ; selected
	Else
		sayMessage(ot_item_state,cmsg214_l) ; unselected
	EndIf
EndIf
EndScript

Script NewSlide()
If GetWindowClass(GetFocus())==wcPowerpointClient then
	TypeKey(ksNewSlide)
 	SayMessage(ot_help,GetCurrentSlideTitleOrNumber())
 	if BrailleInUse() then
 		BrailleMessageRepeatLast()
 	EndIf
else
	TypeKey(ksNewSlide) ;default action
EndIf
EndScript

Script ListComments()
if InHJDialog () then
	SayFormattedMessage (ot_error, cMSG337_L, cMsg337_S)
	return
endIf
SelectComment()
EndScript

Script JAWSHome()
performScript JAWSHome()
if GetActivePaneView()==ppViewThumbnails then
	performScript SayLine()
endIf
EndScript

script home ()
performScript JAWSHome()
endScript

Script JAWSEnd()
performScript JAWSEnd()
if GetActivePaneView()==ppViewThumbnails then
	performScript SayLine()
endIf
EndScript

script end ()
performScript JAWSEnd()
endScript

Script SayWindowTitle()
;Override which ensures we don't say "Virtual Viewer" when a slide show is running:
var
	string sAppName,
	string sMessageLong,
	string sMessageShort;
if IsSlideShowWithUIA () then
	PerformScript SayWindowTitle ()
	return
endIf
if UserBufferIsActive ()
&& IsSlideShow() then
	let sAppName = getWindowName (getAppMainWindow (getFocus ()))
	Let sMessageLong = formatString (cmsg27_L, sAppName)
	let sMessageShort = formatString (cmsg27_S, sAppName)
	SayMessage (OT_STATUS, sMessageLong, sMessageShort)
	return;
endIf
PerformScript SayWindowTitle()
endScript

Script SayTopLineOfWindow()
;overwritten here as percentage appears at very top of window instead of document and application name as it does in most other applications.
if GetWindowClass(GetFocus())==wcPowerpointClient
&& isPCCursor() then
	SaveCursor()
	InvisibleCursor()
	RouteInvisibleToPC()
	JAWSPageUp()
	;must move to next line here to obtain correct information at top of application window.
	nextLine()
	Say (GetLine(), ot_user_requested_information);Ignore all attributes and font
	RestoreCursor()
	return
endIf
performscript SayTopLineOfWindow()
EndScript

void function CellChangedEvent(int NewCol, int NewRow, int NewNesting, int NewRowColCount,
		string ColHeader, string RowHeader, int PrevCol, int PrevRow, int PrevNesting, int PrevRowColCount)
;This event function is triggered when the cursor moves from one cell in a table to a new cell in either the same table or
;a nested table or parent table.
return
endFunction

Script AltF4 ()
giSlideShowActive = FALSE; so slide show objects can null.
ppFunc::AutoFinishEvent ()
TypeCurrentScriptKey ()
SayCurrentScriptKeyLabel ()
EndScript

script insertSlide ()
TypeKey ("Control+Enter")
SayCurrentScriptKeyLabel ()
if IsSlideShow() then return endIf
globalNewSlideAdded = TRUE
endScript

int function PreProcessKeyPressedEvent(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
lastKeyPressed = strKeyName
PreProcessKeyPressedEvent (nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
endFunction

void function DoDefaultDocumentLoadActions()
var
	int ignoreComments = TRUE,
	string ContainsNotes
if IsSlideShowWithUIA () then
; We've either entered a slide show or the slide just transitioned.
	ContainsNotes = GetCurrentSlideNotesAndCommentsInfo (ignoreComments)
	if ! stringIsBlank (ContainsNotes) then
		SayMessage (OT_JAWS_MESSAGE, ContainsNotes)
	endIf
	if gbDefaultSayAllOnDocumentLoad then
		SayAll ()
	else
		sayLine ()
	endIf
else
	default::DoDefaultDocumentLoadActions()
endIf
endFunction

int function ShouldProcessLiveRegion(string text, string attribs)
var int ignoreComments, string containsNotes, string lastScriptKeyPrefix
lastScriptKeyPrefix= stringLower (stringSegment (lastKeyPressed, "+", 1))
if ! stringContains (lastScriptKeyPrefix, "alt")
&& isSlideShowWithUIA () then
	ContainsNotes = GetCurrentSlideNotesAndCommentsInfo (ignoreComments)
	if ! stringIsBlank (ContainsNotes) then
		SayMessage (OT_JAWS_MESSAGE, ContainsNotes)
	endIf
endIf
return ShouldProcessLiveRegion (text, attribs)
endFunction

Script RouteJAWSCursorToPc ()
if IsSlideShowWithUIA () then
; we want to let the user move the pointer so they can point at the bullet point like a sighted person does:
	sayMessage (OT_STATUS, msgMovePointerToCurrentLocation_L, msgMovePointerToCurrentLocation_S)
	RouteJAWSToPC ()
	return
endIf
performScript RouteJAWSCursorToPc ()
endScript

Script MoveToNextNonLinkText ()
if IsSlideShowWithUIA () && stringLength (GetCurrentScriptKeyName ()) == 1 then
	typeCurrentScriptKey ()
	return
endIf
PerformScript MoveToNextNonLinkText ()
endScript

Script SayNextParagraph ()
if IsSlideShowWithUIA () && stringLength (GetCurrentScriptKeyName ()) == 1 then
	typeCurrentScriptKey ()
	return
endIf
performScript SayNextParagraph ()
endScript

script VirtualPcCursorToggle ()
PerformScript VirtualPcCursorToggle () ; default
; update global variable so we're not out of sync:
VirtualPcCursorApplicationSetting = getJCFOption (OPT_VIRTUAL_PC_CURSOR)
endScript

int function ShouldIncludeView(string viewName)
; In Powerpoint, if not using the classic scripts, i.e. the base name is Powerpoint, ignore Powerpoint Classic, 2007 and 2010 views. 
;Note if this file is executing then this is already true.
if viewName == cPowerpointClassicJBSBase then
	return false
endIf
if viewName == cPowerpoint2007JBSBase then
	return false
endIf
if viewName == cPowerpoint2010JBSBase then
	return false
endIf
return true
endFunction

string function GetSlideText(object slide)
var
	int iShapeIndex,
	int iShapeCount,
	object oShapes,
	object oShape,
	object oTextRange,
	object oFont,
	string sText,
	string sAccumulatedText
	oShapes=slide.shapes
let iShapeCount = oShapes.count
let iShapeIndex = 1
while (iShapeIndex <= iShapeCount)
	let oShape=oShapes(iShapeIndex)
	if oShape.hasTextFrame && oShape.textFrame.hasText then
		let oTextRange = oShape.textFrame.textRange
		let sText=oTextRange.text
		let sText=sText+cscBufferNewline
		let sText = stringReplaceSubstrings (sText, "\r", "\n")
		let sAccumulatedText=sAccumulatedText+sText
	endIf
	let iShapeIndex = (iShapeIndex+1)
endwhile
return sAccumulatedText
endFunction

string function GetSlideShowText()
var
	object slide,
	object notesPages,
	int index,
	int count,
	string text
	slide= getSlideWithFocus ()
	if !slide then
		return cscNull
	endIf
let notesPages = slide.notesPage
if !notesPages then
	return cscNull
endIf
let count = notesPages.count
if count==0 then
	return cscNull
endIf
let index = 1
for index=1 to count
	let text=text+GetSlideText(notesPages(index))
	let index = (index+1)
endFor
return text
endFunction

void function handleSlideShowBrailleView()
var int gotNotes=false
if gShowSpeakersNotesDuringPresentation && IsSlideShowWithUIA() then
	gLastSpeakersNotesRetrieved=GetSlideShowText()
	if stringLength(gLastSpeakersNotesRetrieved) > 2 then ; if only a page number, there are no notes.
		gotNotes=true
		BrailleSplitMode(brlSplitScriptDefined)
		endIf
endIf
if gShowSpeakersNotesDuringPresentation && !gotNotes then
	BrailleSplitMode(brlSplitOff)
	gLastSpeakersNotesRetrieved=cscNull
endIf
endFunction

string function BrailleGetTextForSplitMode()
return gLastSpeakersNotesRetrieved
endFunction
					
int function SwitchToScriptedAppView(int scriptedAppViewIndex)
; This function should be overridden in an app's script set to control a scripted Braille view.
var int changed=scriptedAppViewIndex!=gShowSpeakersNotesDuringPresentation
gShowSpeakersNotesDuringPresentation=!gShowSpeakersNotesDuringPresentation
return changed
endFunction

int function GetScriptedAppViewIndex()
; return a 1-based index of the active scripted view.
; If no active scripted view, return 0 so it is no longer highlighted.
if gShowSpeakersNotesDuringPresentation then
	return 1
else
	return 0
endIf
endFunction

string function GetScriptedAppViews()
;Override this in an app's script set to return a delimited list of scripted views. e.g. "Message list + message preview|..."
; In our case we'll just have one view but change it from on to off.
if gShowSpeakersNotesDuringPresentation then
	return FormatString(msgShowSpeakersNotesDuringPresentation, cmsgOn)
else
	return FormatString(msgShowSpeakersNotesDuringPresentation, cmsgOff)
endIf
endFunction

void function BrailleSplitModeChangedEvent()
giPowerpointSplitModeValue=BrailleGetSplitMode()
; update the giInitialSplitModeValue since we're changing views, but only if not changing to an app specific view.
if !gShowSpeakersNotesDuringPresentation then
	giInitialSplitModeValue=giPowerpointSplitModeValue
endIf
endFunction

script PictureSmartAllInOne (optional int serviceOptions)
var
	object oSlideShowIdCondition = FSUIACreateStringPropertyCondition (UIA_AutomationIDPropertyID, "SlideShowPane"),
	object oRoot = FSUIAGetElementFromHandle(GetFocus()),
	object oSlideshow = oRoot.findFirst(TreeScope_Descendants, oSlideShowIdCondition)
if IsSlideActive() then 
	if oSlideshow then
		PerformScript PictureSmartWithWindow(serviceOptions)
		return
	endIf
	
	var object oSlideIdCondition = FSUIACreateStringPropertyCondition (UIA_AutomationIDPropertyID, "SlidePane")
	var object oSlide = oRoot.findFirst(TreeScope_Descendants, oSlideIdCondition)
	if oSlide then
		var int left = oSlide.BoundingRectangle.left
		var int top = oSlide.BoundingRectangle.top
		var int right = oSlide.BoundingRectangle.right
		var int bottom = oSlide.BoundingRectangle.bottom
		PictureSmartWithAreaShared(serviceOptions, left, top, right, bottom)
		return
	endIf
endIf
PerformScript PictureSmartWithControl(serviceOptions)
endScript

script PictureSmartAllInOneAskPrelim ()
PerformScript PictureSmartAllInOne(PSServiceOptions_AskPrelim)
endScript

script PictureSmartAllInOneMultiService (optional int serviceOptions)
PerformScript PictureSmartAllInOne(PSServiceOptions_Multi | serviceOptions)
endScript

script PictureSmartAllInOneMultiServiceAskPrelim ()
PerformScript PictureSmartAllInOneMultiService(PSServiceOptions_AskPrelim)
endScript

