;Copyright 2005-2022 by Freedom Scientific, Inc.
;Freedom Scientific script file for Firefox

include "HJConst.jsh"
include "HJGlobal.jsh"
include "HJHelp.jsh"
include "common.jsm"
include "FireFox.jsh"
include "FireFox.jsm"
include "MSAAConst.jsh"
include "IAccessible2.jsh"
include "UIA.jsh"

use "IA2Browser.jsb"
import "UIA.jsd"

;gbIsBrowserUIDialog accesses the global from IA2Browser:
globals	int gbIsBrowserUIDialog


int function IsBrowserContentWindow(handle hwnd)
var string class = getWindowClass(hwnd)
return ( class == wc_MozillaWindowClass
	|| class == wc_MozillaWindowClass4 )
endFunction

int function IsFirefoxWindow(handle hwnd)
return IsBrowserContentWindow( hwnd )
	|| getWindowClass(hwnd) == wc_MozillaDialogClass
endFunction

int function ShouldUseDoSayObjectFromLevel( handle focusWindow, handle prevWindow )
if gbIsBrowserUIDialog return false endIf
var
	string focusWindowClass,
	string prevWindowClass
focusWindowClass = GetWindowClass(FocusWindow)
prevWindowClass =GetWindowClass(PrevWindow)
if prevWindowClass == wc_MozillaMenuClass
&& focusWindowClass == wc_MozillaDialogClass
	return true
EndIf
return isFirefoxWindow(FocusWindow)
	&& (isFirefoxWindow(prevWindow) || GetWindowClass(GetRealWindow(FocusWindow)) == wc_MozillaUIWindowClass)
EndFunction

Int Function ShouldSpeakItemAtLevel(int level, int type, int parentType, int focusRole, int focusType)
var
	int ancestorRole = GetObjectRole(level),
	int ancestorCount = GetAncestorCount(),
	int dialogAncestorLevel = FindAncestorOfType(wt_dialog)
if (
	ancestorRole == IA2_ROLE_FRAME || ancestorRole == ROLE_SYSTEM_GROUPING
	|| ancestorRole == ROLE_SYSTEM_PROPERTYPAGE
	)
	if (dialogAncestorLevel != -1 && level > dialogAncestorLevel)
		return false
	endIf
	return true
EndIf
return ShouldSpeakItemAtLevel(level, type, parentType, focusRole, focusType)
EndFunction

string function GetDocumentNameFromRealWindow()
var
	string name
;No dom, so must get document name via RealWindowName (MSAA gets it)
name = GetWindowName(GetRealWindow(GetFocus()))
if StringContains(name,scTrimName_FirefoxTitleBar)
	return StringChopRight(name,StringLength(scTrimName_FirefoxTitleBar))
endIf
Return cscNull
EndFunction

string function GetBrowserName(optional int includeMaker)
if includeMaker
	return msgMozillaFirefoxAppName
else
	return msgFirefoxAppName
endIf
EndFunction

void function MSAAAlertEvent(handle hwnd, int nTime, string sText, int nAlertLevel, string appName)
If nAlertLevel == 1
	If GetWindowName(GetParent(GetFocus())) == wn_Custom
		;Found in "Custom..." dialog in File -> Page Setup
		;Any drop down menu in Header/Footer group.
		;Stops dialog from saying an alert each time a character is entered
		return
	EndIf
EndIf
MSAAAlertEvent(hwnd, nTime, sText, nAlertLevel, appName)
EndFunction


void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
if GlobalWasHjDialog && ! InHjDialog () then
; make sure TypeAndText info gets spoken just like  in iE.
	return FocusChangedEvent (hwndFocus, hwndPrevFocus)
endIf
return ProcessEventOnFocusChangedEventEx (hwndFocus, nObject, nChild, 
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth, sClass, nType)
endFunction

void function ProcessSayRealWindowOnFocusChange(
	 handle AppWindow, handle RealWindow, string RealWindowName, handle FocusWindow)
if GetWindowClass(GlobalPrevFocus) !=wc_MozillaWindowClass
	if gbIsBrowserUIDialog
		;A dialog from the browser UI has just gained focus.
		SayAndCacheBrailleForBrowserUIDialogNameAndText()
		return
	endIf
endIf
ProcessSayRealWindowOnFocusChange(AppWindow, RealWindow, RealWindowName, FocusWindow)
EndFunction

int Function HandleCustomWindows (HANDLE hWnd)
If GetObjectSubTypeCode(SOURCE_CACHED_DATA,0) == WT_BUTTON
&& GetWindowName (GetRealWindow (hWnd)) == WN_Installation
&& GetObjectName() == Obj_Install
	IndicateControlType(WT_BUTTON, Obj_InstallReplacement)
	Return TRUE
EndIf
return HandleCustomWindows(hWnd)
EndFunction

Script ScreenSensitiveHelp ()
if IsSameScript () then
	AppFileTopic(TOPIC_MOZILLA_FIREFOX)
	return
endIf
PerformScript ScreenSensitiveHelp()
EndScript

void function TurnOffFormsMode(optional int bFormsModeEventSpeechSilent)
if (IsComboExpanded()) then
	DoCloseListBoxKeyStroke ()
	Delay (3, true)
EndIf

TurnOffFormsMode(bFormsModeEventSpeechSilent)
EndFunction
script MoveToNextInconsistency()
var
	int iSavedOption,
	int nFlags=0xffff,
	int nPairedSymbolCategories=0xff,
	int nType=0,
	string sChars,
	int nOffset=0,
	collection cFont
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
;if off, turn it on temporarily.
let iSavedOption=getJCFOption(OPT_TEXT_ANALYSER)
if !iSavedOption then
	setJCFOption(OPT_TEXT_ANALYSER,TextAnalyserDescribeAllInconsistencies)
endIf
let nFlags = GetJCFOption(OPT_TEXT_ANALYSER_TYPE_FLAGS)
let nPairedSymbolCategories=GetJCFOption(OPT_TEXT_ANALYSER_SYMBOL_FLAGS)
if nFlags & IndicateFontChanges
|| nFlags & (IndicateFontName|IndicateFontSize|IndicateTextAttributes|IndicateColorChanges) then
	let cFont = GetCurrentFontData(nFlags)
endIf
;Check inconsistency by line as paragraph is not supported by Firefox and is flaky in Chrome.
if MoveToRangeInconsistency(CheckLine,s_next,nFlags, nPairedSymbolCategories, nType, sChars, nOffset) then
	if nType == FontChange
	&& (nFlags & IndicateFontChanges
	|| nFlags & (IndicateFontName|IndicateFontSize|IndicateTextAttributes|IndicateColorChanges)) then
		IndicateInconsistency(nType, sChars, nOffset, cFont)
	else
		IndicateInconsistency(nType, sChars, nOffset)
	EndIf
else
	SayMessage(OT_ERROR, cmsgNoNextInconsistency_L, cmsgNoNextInconsistency_S)
endIf
if iSavedOption<TextAnalyserDescribeAllInconsistencies then
	setJCFOption(OPT_TEXT_ANALYSER,iSavedOption)
endIf
endScript
script MoveToPriorInconsistency()
var
	int iSavedOption,
	int nFlags=0xffff,
	int nPairedSymbolCategories=0xff,
	int nType=0,
	string sChars,
	int nOffset=0,
	collection cFont
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
;if off, turn it on temporarily.
let iSavedOption=getJCFOption(OPT_TEXT_ANALYSER)
if !iSavedOption then
	setJCFOption(OPT_TEXT_ANALYSER,TextAnalyserDescribeAllInconsistencies)
endIf
let nFlags=GetJCFOption(OPT_TEXT_ANALYSER_TYPE_FLAGS)
let nPairedSymbolCategories=GetJCFOption(OPT_TEXT_ANALYSER_SYMBOL_FLAGS)
if nFlags & IndicateFontChanges
|| nFlags & (IndicateFontName|IndicateFontSize|IndicateTextAttributes|IndicateColorChanges) then
	let cFont = GetCurrentFontData(nFlags)
endIf
;Check inconsistency by line as paragraph is not supported by Firefox and is flaky in Chrome.
if MoveToRangeInconsistency(CheckLine,s_prior, nFlags, nPairedSymbolCategories, nType, sChars, nOffset) then
	if nType == FontChange
	&& (nFlags & IndicateFontChanges
	|| nFlags & (IndicateFontName|IndicateFontSize|IndicateTextAttributes|IndicateColorChanges)) then
		IndicateInconsistency(nType, sChars, nOffset, cFont)
	else
		IndicateInconsistency(nType, sChars, nOffset)
	EndIf
else
	SayMessage(OT_ERROR, cmsgNoPriorInconsistency_L, cmsgNoPriorInconsistency_S)
endIf
if iSavedOption<TextAnalyserDescribeAllInconsistencies then
	setJCFOption(OPT_TEXT_ANALYSER,iSavedOption)
endIf
endScript

int function IsInsideComboBox()
if (FindAncestorOfType (WT_COMBOBOX) == -1)
	return false
EndIf

return true
EndFunction

int function ClosingFormsModeComboBox()
if !gbShouldExitFormsModeOnComboBoxClose then
	return false
EndIf

if (GetProgramVersion (GetAppFilePath ()) >= 60
&& IsInsideComboBox())
	gbShouldExitFormsModeOnComboBoxClose = false
	DoCloseListBoxKeyStroke()
	SayMessage(ot_JAWS_message, cmsg42_L, cmsgSilent) ;close listbox
	ScheduleFunction ("TurnOffFormsMode", 5)
	return true
EndIf

return ClosingFormsModeComboBox()
EndFunction

Void Function HandleUnknownAncestor (int level, int focusType, int pageIsChanging)
if (level > 2 
&&  GetObjectSubTypeCode(SOURCE_CACHED_DATA, level-1) == WT_COMBOBOX)
	return
endif

HandleUnknownAncestor (level, focusType, pageIsChanging)
EndFunction

void function SayLineUnit(int unitMovement, optional int bMoved)
if (IsFormsModeActive ()
&& GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0) == WT_COMBOBOX)
	return
EndIf

SayLineUnit(unitMovement, bMoved)
EndFunction

Script PictureSmartWithControl (optional int serviceOptions)
return PictureSmartWithControlShared (PSServiceOptions_Single | serviceOptions)
EndScript

Script PictureSmartWithControlMultiService (optional int serviceOptions)
return PictureSmartWithControlShared (PSServiceOptions_Multi | serviceOptions)
EndScript

int function IsBrowserUIDialog()
return !UserBufferIsActive()
	&& !IsVirtualPCCursor()
	&& !IsFormsModeActive()
	&& GetWindowClass(getFocus()) == wc_MozillaWindowClass
	&& FindAncestorOfType(wt_dialog)
EndFunction

int function IsFocusBrowserUIDialogAlertText()
return gbIsBrowserUIDialog 
	&& GetObjectSubtypeCode() == wt_unknown
	&& GetObjectRole() & ROLE_SYSTEM_ALERT | ROLE_SYSTEM_PANE
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName, int drawHighLight)
if nLevel == 0
	if IsFocusBrowserUIDialogAlertText()
		;SayObjectTypeAndText may cause double announcement of this control,
		;probably because it has a child element with the same text as the focus element.
		Say(GetObjectname(),ot_line)
		return
	endIf
endIf
SayObjectTypeAndText(nLevel, includeContainerName, drawHighLight)
EndFunction

int function BrailleCallbackObjectIdentify()
if IsFocusBrowserUIDialogAlertText()
	return WT_READONLYEDIT
endIf
return BrailleCallbackObjectIdentify()
EndFunction

int function IsValidForTraverseBrowserUIDialogAndReadControls(string dlgName, object element)
if element.name == dlgName return false endIf
;Firefox tends to have children which are of type editable but are not focusable
;and they appear to duplicate something else in the hierarchy:
if element.controltype == UIA_EditControlTypeID
&& !element.isKeyboardFocusable
	return false
endIf
return true
EndFunction

script readBoxInTabOrder()
if gbIsBrowserUIDialog 
	;GetTypeAndTextStringsForWindow often retrieves text with duplications,
	;so we first try to use UIA to traverse and read the elements.
	if !ReadBrowserUIDialogBox()
		Say(GetTypeAndTextStringsForWindow(getFocus()), ot_USER_REQUESTED_INFORMATION)
	endIf
	return
endIf
performScript ReadBoxInTabOrder()
endScript
