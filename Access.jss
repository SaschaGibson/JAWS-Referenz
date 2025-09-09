; Copyright 1995-2021 Freedom Scientific, Inc.
; Script file for Microsoft Access 2013 and later

include "hjconst.jsh"
include "hjglobal.jsh"
include "common.jsm"
include "hjHelp.jsh"
include "msaccess2010.jsh"
include "msaccess2007.jsm"
include "MSOffice2007.jsm"
include "MSOffice2010.jsh"
import "OfficeClassic.jsd"
use "MSAcFunc.jsb"
Use "MSAcTables.jsb"

CONST
;For EnumerateTypeAndTextStringsForWindow function:
	ABORT		0,
	CONTINUE		1,
;Access Current View info:
	formDesignView = 0,
	formFormView = 1,
	formDatasheetView = 2,
	PivotTableView = 3,
	PivotChartView = 4,
	PreviewView = 5,
	ReportView = 6,
	LayoutView = 7

GLOBALS
;These are TypeAndText info for MSAA controls:
	string gstrOFormTabName,
	String gstrMSAADlgName,
	string gstrTempData,
	int gbMSaaDialog,
	int gStaticTextCounter,
	int giAlreadySpoken,
	int globalInSpellchecker ,
	INT GlobalPerformedReadMistakeAndSuggestion ,
	int giDesignFieldType


void Function AutoStartEvent ()
Let giFormView = -1;No object:
endFunction

void Function AutoFinishEvent ()
Let giFormView = -1;No object:
Let giPane = PANE_UNKNOWN
let gstrMSAADlgName = cscNull
Let gstrMSAADlgText = cscNull
let gstrPrevMSAADlgName = cscNull
Let gbMSAADialog = FALSE
Let gstrPrevMSAADlgText = cscNull
endFunction

void Function SayWindowTypeAndText (handle hwnd)
;Even though RELittBox20W is classed,
;it still sometimes fails here and getWindowSubtypeCode
if gbMSAADialog
&& hwnd == getRealWindow (getFocus ())
&& ! stringIsBlank (gstrMSAADlgName)
&& gstrMSAADlgName != gstrPrevMSAADLGName then
	indicateControlType (WT_DIALOG, gstrMSAADlgName, gstrMSAADlgText)
	return
elIf getWindowClass (hwnd) == wc_CustomListbox then
	SayControlEXWithMarkup (hwnd, cscNull, msgCustomListboxTypeInfo)
	Return
endIf
SayWindowTypeAndText (hwnd)
endFunction

int function getWindowSubtypeCode (handle hWnd)
;helps enum child windows on insert b.
;Many cases we want enum to pass when no type code exists.
;This is for a specific window that has been classed that should have been subtyped:
if getWindowClass (hwnd) == wc_CustomListbox then
	Return WT_LISTBOX
endIf
return getWindowSubtypeCode (hWnd)
endFunction

int function MSAATabNameToGlobal (int iType, int nState, string sName, string sValue, string sDescription)
;state bits to get is 256
If iType != WT_TABCONTROL
|| ! (nState & CTRL_SELECTED) then
	Return TRUE
endIf
Let gstrOFormTabName = sName
Return TRUE
endFunction

int Function MSAADlgNameToGlobal(int iType, int nState, string sName, string sValue, string sDescription)
if iType != WT_DIALOG then
	Return CONTINUE
endIf
if StringIsBlank (sName) then
	Return CONTINUE
endIf
Let gstrMSAADlgName = StringTrimLeadingBlanks (StringTrimTrailingBlanks (sName))
Return ABORT;First valid name = name of dialog:
endFunction

int Function MSAAStaticTextToGlobal (int iType, int nState, string sName, string sValue, string sDescription)
if iType != WT_STATIC then
	Return CONTINUE
endIf
if ! nState then
	Return CONTINUE
endIf
if StringIsBlank (sName) then
	Return CONTINUE
endIf
Let gstrMSAADlgText = (gstrMSAADlgText+cscSpace
+StringTrimLeadingBlanks (StringTrimTrailingBlanks (sName)))
Return CONTINUE
endFunction

int Function MSAAStaticTextToGlobalForWizards (int iType, int nState, string sName, string sValue, string sDescription)
;This is specifying exactly which objects to read in these dialogs
Let gStaticTextCounter = gStaticTextCounter + 1
If gStaticTextCounter == 4
|| gStaticTextCounter == 5
|| gStaticTextCounter == 14
|| gStaticTextCounter == 21
|| gStaticTextCounter == 22 Then
	If iType == WT_STATIC Then
		Let gstrMSAADlgText = (gstrMSAADlgText+cscSpace
		+StringTrimLeadingBlanks (StringTrimTrailingBlanks (sName)))
	EndIf
EndIf
Return CONTINUE
endFunction

Script ScriptFileName()  ;JAWSKey+Q
ScriptAndAppNames(msgAccess2013Plus)
EndScript

Script ReadDataSheetCoordinates()  ;JAWSKey+C
var
	string sCol,
	string sRow
DataSheetCoordinates (giCurrentCol, giCurrentRow)
Let sRow = formatString (cmsgRowHeader, intToString (giCurrentRow))
Let sCol = formatString (cmsgColumnHeader, intToString (giCurrentCol))
sayMessage (OT_POSITION, sRow)
sayMessage (OT_POSITION, sCol)
;SayMessage(OT_ERROR, msg3_L, msg3_S)
EndScript

void function ReadToolbarObjects(handle hWnd)
var
	string sObjList,
	int iObjCount,
	int i,
	string sName,
	string sPrevName,
	int iType
if GetWindowSubtypeCode(hWnd) != wt_toolbar then
	return
EndIf
let sObjList = GetListOfObjects(hWnd)
If StringLength(sObjList) <= 2 Then
	return
EndIf
let iObjCount = StringSegmentCount(sObjList,LIST_ITEM_SEPARATOR)
let i = 1
while i <= iObjCount
	let sName = StringSegment(sObjList,LIST_ITEM_SEPARATOR,i)
	If StringCompare (sName, sPrevName) != 0 then
		GetObjectInfoByName(hWnd,sName,1,iType)
		IndicateControlType(iType,sName,cscSpace)
	endIf
	Let sPrevName = sName
	let i = i+1
EndWhile
EndFunction

int Function DoChildWindows (handle hWnd)
VAR
	int iType
Let iType = getWindowSubtypeCode (hwnd)
if ! iType
|| iType == WT_DIALOG || iType == WT_TOOLBAR || iType == WT_BUTTONLISTBOX then
	return TRUE
endIf
return DoChildWindows (hWnd)
endFunction

Script ReadBoxInTabOrder()  ;JAWSKey+B
If DialogActive ()
|| getWindowClass (getRealWindow (getFocus ())) == cWc_dlg32770 Then
	PerformScript ReadBoxInTabOrder() ; default
ElIf IsFormActive() Then
	ReadFormInControlOrder()
ElIf IsReportActive() Then
	ReadActiveReport()
Else
	PerformScript ReadBoxInTabOrder()
endIf
endScript

Script SayRecordNumber () ;Control+JAWSKey+Rs
SayMessage(OT_USER_REQUESTED_INFORMATION,GetRecordNumber())
EndScript

function IndicateViewInfo ()
var
	string sViewName,
	string sActiveName, ;Active form, report or data sheet
	string sMsgLong,
	string sMsgShort,
	handle hwnd,
	string sStatusBar
;check status line first:
InvisibleCursor()
routeInvisibleToPC()
JAWSPageDown()
JAWSHome()
if GetObjectSubtypeCode()==wt_button then
	let hwnd=GEtCurrentWindow()
	let sStatusBar=GetWindowTextEx(hwnd,false,true)
	let sStatusBar=StringLeft(sStatusBar,StringContains(stringLower(sStatusBar),scView)-1)
	if sStatusBar!=cscNull then
		let sViewName=sStatusBar
	endIf
endIf
PCCursor()

if sViewName==cscNull then
	let giFormview=GetCurrentView()
	Let sViewName = getViewName (giFormView)
	if giFormView == -1 then;Unknown:
		let hwnd=GetFocus()
		if GetWindowClass(hwnd)==wc_OTable
		|| GetWindowClass(GetParent(GetParent(hwnd)))==wc_OTable then
			let giFormView = FormDataSheetView
		endIf
	endIf
	if giFormView == FormFormView
	|| giFormView == FormDesignView then
		Let sActiveName = getFormName ()
	elIf giFormView == ReportView then
		Let sActiveName = getReportName ()
	elIf giFormView == FormDataSheetView then
		Let sActiveName = getDataSheetName ()
		if StringIsBlank (sActiveName) then
			Let sActiveName = getFormName ()
		endIf
	else
		Let sActiveName = getFormName ()
	endIf
endIf
Let sMsgLong = formatString (msgViewInfo_L, sActiveName, sViewName)
Let sMsgShort = formatString (msgViewInfo_S, sActiveName, sViewName)
sayMessage (OT_JAWS_Message, sMsgLong, sMsgShort);So it gets optionally Brailled as well as spoken.
endFunction

Int Function isSDMDlg ()
if StringContains (GetWindowClass(GlobalRealWindow),wc_SDM)
|| StringContains (GetWindowClass (GetParent(GlobalRealWindow)) ,wc_SDM)
|| StringContains (GetWindowClass (GetParent(GetParent(GlobalRealWindow))),wc_SDM)
|| StringContains (GetWindowClass (GetParent(GetParent(GlobalFocusWindow))), wc_SDM)
|| StringContains (GetWindowClass (GetParent(GetParent(GetParent(GlobalFocusWindow)))), wc_SDM)
|| StringContains (GetWindowClass(GlobalFocusWindow),wc_SDM) then
	Return True
EndIf
EndFunction

int Function GetCurrentPane ()
var
	handle hWnd,
	handle hParent,
	string sClass,
	string sParentClass
if MenusActive ()
|| DialogActive ()
|| UserBufferIsActive () then
	Return PANE_UNKNOWN
endIf
Let hwnd = getFocus ()
Let hParent = getParent (hwnd)
Let sClass = getWindowClass (hwnd)
Let sParentClass = getWindowClass (hParent)
if sParentClass == wc_NetUIParent then
	Return PANE_NAVIGATION
elIf ! getObjectSubtypeCode (TRUE);Otherwise, login's, etc. get confused.
&& sClass == wc_OForm
&& getWindowClass (getFirstChild(hwnd)) == wc_OFormSub then
	Return PANE_STARTUP
elIf sClass == wcNetUIHwnd
&& sParentClass == wc_Pane then
	;One of the button bar panes.
	;Message bar only shows up if the windows's text contains 'Security Warning'
	;Since this is only to run a database in Protected Mode.
	if StringContains (getWindowText (hwnd, READ_EVERYTHING), sc_Security) then
		return PANE_MESSAGEBAR
	else
		return PANE_BUTTONBAR
	endIf
Elif isAccessControl ()
|| InTable()
|| getCurrentView ()
|| IsReportActive()
|| sClass == wcNetUIHwnd then
	return PANE_CLIENT
Else
	return PANE_UNKNOWN
endIf
endFunction

function IndicatePane (int nPane)
if ! nPane then
	return
endIf
if nPane == PANE_NAVIGATION then
	SayMessage (OT_NO_DISABLE, msgNavigationPane)
elif nPane == PANE_STARTUP then
	SayMessage (OT_NO_DISABLE, msgStartupPane)
elif nPane == PANE_CLIENT then
	SayMessage (OT_NO_DISABLE, msgClientPane)
elIf nPane == PANE_BUTTONBAR then
	SayMessage (OT_NO_DISABLE, msgButtonBar)
elif nPane == PANE_MESSAGEBAR then
	SayMessage (OT_NO_DISABLE, msgMessageBar)
	ReadMessageBarInfo ()
else
	return
endIf
endFunction

Void Function IndicateMSAADialogChange ()
var
	string sdlgName,
	string sDlgText;
if gstrMSAADLGName != gstrPrevMSAADLGName then
	Let sdlgName = gstrMSAADLGName
endIf
if gstrMSAADLGText != gstrPrevMSAADLGText then
	Let sDlgText = gstrMSAADLGText
endIf
;Account fordialog name and static text separately.
;If dialog name changes, read the text out as expected in sayWindowTypeAndText.
;Else just do new wizard text, e.g. same dialog:
if ! stringIsBlank (sdlgName) then
	indicateControlType (WT_DIALOG, sdlgName, gstrMSAADlgText)
elif ! stringIsBlank (sdlgText) then
	SayMessage (OT_DIALOG_TEXT, sDlgText)
endIf
EndFunction

Int function InViewMode(handle hwnd,string sClass)
if UserBufferIsActive()
|| (getWindowClass (getRealWindow (hwnd)) != wcNUIDialog
&& InRibbons())
;|| InOptionsDialog (hwndFocus) ; Let Access handle this instead of MsOffice2007
|| IsCommonAlertDlg ()
|| StringContains(sClass,wc_sdm)
|| GetMenuMode()>0
|| IsStatusBarToolbar(hwnd)
|| DialogActive()
|| sClass==wc_netUIHwnd then
	return false ; not in view mode
endIf
return true
EndFunction

void function FocusChangedEventEx (handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
/*////THIS IS NOT NORMAL WAY TO DO THIS EVENT!
We do this because Access is primarily made up of MSAA children within
;NetUIHwnd, oForm, NUIDiabog and other controls, into which traditional FocusChange separation is not valid
**********************************/
var
	handle RealWindow,
	string RealWindowName,
	handle AppWindow,
	string sClass
;Alt+tab or 'Task Switching' list box:
if GetWindowClass(hwndFocus) == cwc_dlg32771
&& GetObjectTypeCode(hwndFocus)== WT_LISTBOXITEM then
	; We're alt-tabbing between apps
	Say(GetObjectName (), OT_WINDOW_NAME)
	return
EndIf
if FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth) then
	return
endIf	
Let RealWindow = getRealWindow (hwndFocus)
let RealWindowName = GetWindowName (RealWindow)
Let AppWindow = getAppMainWindow (hwndFocus)
let GlobalFocusWindow = hwndFocus

if inHjDialog ()
&& getWindowName (getRealWindow (hwndFocus)) != cwnQuickSettings then
	return default::focusChangedEventEX (hwndFocus,  nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
endIf

let globalInSpellchecker=false

if StringContains(GetWindowName(GetRealWindow(hwndfocus)),wn_Spelling) then
	let globalInSpellchecker=true
endIf

Let sClass = getWindowClass (hwndFocus)
;Must ensure objects become valid
;This is not Word or Excel, so the object only becomes valid if actually
;focused on a database.
if IsAppObjInvalid() then
	if sClass == wc_ODb
	|| sClass == wc_oStatBar
	|| sClass == wc_OFormChild
	|| sClass == wc_OArgDlg
	|| sClass == wc_OKttbx
	|| sClass == wc_OGrid
	|| sClass == wcGridEdit
	|| stringContains (sClass, wc_OForm)
	|| sClass == wc_OScript
	|| sClass == wc_OTable
	|| sClass == wc_OQry then
		InitializeAccessObject ()
	endIf
endIf
if !inViewMode(hwndFocus,sClass) then
	Office::FocusChangedEventEx (hwndFocus, nObject,nChild,hwndPrevFocus,nPrevObject, nPrevChild,nChangeDepth)
	self::SpeakRelationship ()
	return
EndIf
if appWindow != globalPrevApp
&& appWindow != realWindow
&& getWindowName (appWindow) != getWindowName (GlobalPrevApp) then
	ProcessSayAppWindowOnFocusChange(AppWindow,hwndFocus)
	Let globalPrevApp= appWindow
endIf
if realWindow != globalPrevReal
&& realWindow != hwndFocus
&& getWindowName (realWindow) != getWindowName (globalPrevReal) then
	ProcessSayRealWindowOnFocusChange(AppWindow,RealWindow,RealWindowName,hwndFocus)
	let globalPrevReal = RealWindow
endIf
let giPrevFormView = giFormView
Let giFormView = getCurrentView ()
if appWindow!=GetAppMainWindow(hwndPrevFocus)
|| RealWindow!=getRealWindow(hwndPrevFocus) then
	IndicateViewInfo()
endIf
if IsAppObjInvalid() then
	InitializeAccessObject ()
endIf
Let giInTable=MSAcTables::InTable()
Let giPrevTable = giInTable
if giInTable
&& ! menusActive () then
	Let giLastCol = giCurrentCol
	let giLastRow = giCurrentRow
	DataSheetCoordinates (giCurrentCol, giCurrentRow)
EndIf

If InPropertiesSheet() Then
	SayRowHeader()
EndIf
if hwndFocus != hwndPrevFocus then
	Let giPrevPane = giPane
	Let giPane = GetCurrentPane ()
	If giPane != giPrevPane then
		IndicatePane (giPane)
		;Keep "Startup Screen" from reading multiple times:
		if giPane == PANE_STARTUP then
		endIf
	endIf
endIf
If !InOptionsDialog(hwndFocus) Then
	;The following may need to be placed in condition, but wizards / dialogs are unique in that the window may not change while the objectsactually do:
	Let gstrPrevMSAADLGName = gstrMSAADLGName
	Let gstrPrevMSAADLGText = gstrMSAADLGText
	Let gstrMSAADLGName = cscNull
	Let gstrMSAADLGText = cscNull
	Let gbMSAADialog = GetMSAADialogInfo (hwndFocus, gstrMSAADLGName, gstrMSAADLGText)
	IndicateMSAADialogChange ()
EndIf
;If the change depth is off, give to ActiveItemChanged to stop extra speech
if nChangeDepth < 0 then
	ActiveItemChangedEvent (hwndFocus,  nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild)
else
	processSayFocusWindowOnFocusChange (RealWindowName,hwndFocus)
endIf
SpeakRelationship ()
SetFocusGlobals (hwndFocus)
let GlobalPrevReal = RealWindow
let GlobalPrevRealName = RealWindowName
let GlobalPrevApp = AppWindow
let GlobalPrevFocus = hwndFocus
Let GlobalWasHjDialog = InHjDialog ()
GlobalPrevDialogIdentifier = GetDialogIdentifier()
endFunction

void Function SetFocusGlobals (handle FocusWindow)
var
	handle RealWindow,
	handle AppWindow,
	string RealWindowName
let RealWindow = GetRealWindow(FocusWindow)
let RealWindowName = GetWindowName (RealWindow)
let AppWindow = GetAppMainWindow(FocusWindow)
let GlobalCurrentControl=GetControlID (FocusWindow)
let GlobalWindowClass=GetWindowClass (FocusWindow)
let GlobalRealWindow = RealWindow
let GlobalRealWindowName = RealWindowName
let GlobalFocusWindow = FocusWindow
let GlobalAppWindow = AppWindow
Let GlobalFocusChanged=true
endFunction

Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
;Override only to set globals, then call down:
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
SetFocusGlobals (FocusWindow) ; Not  standard FocusChange globals, legacy from older Access
FocusChangedEvent(FocusWindow, PrevWindow)
EndFunction

Void Function ProcessSayFocusWindowOnFocusChange(string RealWindowName, handle FocusWindow)
;try to prevent extra call to speak cell info.
if giInTable then
	if IsDesignView()   then
	let giDesignFieldtype=DesignFieldtype()
		sayMessage(ot_control_name,GetFieldType(giDesignFieldtype))
	endIf
	SpeakCellInfo ()
	Return
endIf
if ! handleCustomWindows (FocusWindow) then
	ProcessSayFocusWindowOnFocusChange(RealWindowName, FocusWindow)
endIf
EndFunction

void Function SayFocusedWindow ()
var
	handle hReal,
	handle hPrevReal
If GetWindowClass(GetFocus()) == wc_OForm
&& GetObjectSubtypeCode(TRUE) == WT_BUTTON Then
	If GetFieldCaption() == cscNULL Then
		Say(GetLine(), OT_CONTROL_NAME)
	EndIf
EndIf
	let globalPerformedReadMistakeAndSuggestion=false

let hReal=GetRealWindow(GetFocus())
let hPrevReal=GetRealWindow(globalPrevFocus)
if (hReal!=hPrevReal
&& StringContains(GetWindowName(hReal),wn_Spelling)
&& GetObjectSubtypeCode()==wt_edit) then
	performScript spellcheck()
	let globalPerformedReadMistakeAndSuggestion=true
	return
endIf
SayFocusedWindow()
EndFunction

Void Function SayRowHeader()
var
	int nRow,
	int nCol,
	string sTitle
;Say First Column in Properties Sheet
EndFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId,
	int curChildId, handle prevHwnd, int prevObjectId, int prevChildId)
if giInTable then
	SpeakCellInfo ()
	Return
endIf
if getWindowClass (CurHwnd) == wc_OFormPopup
&& getObjectSubtypeCode (TRUE) == WT_TABCONTROL then
	SayControlEXWithMarkup (CurHwnd, getWindowName (CurHwnd), getObjectType ())
	Return
endIf
if getWindowName (getRealWindow (getFocus ())) != cwnQuickSettings then
	default::ActiveItemChangedEvent (curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
else
	ActiveItemChangedEvent (curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
endIf
EndFunction

int Function BrailleCallbackObjectIdentify ()
if IsTouchCursor() then
	return GetTouchNavElementBrlSubtype()
EndIf
if giInTable then
	return WT_TABLECELL
endIf
return BrailleCallbackObjectIdentify ()
endFunction

int Function BrailleAddObjectName (int iType)
if IsTouchCursor() then
	return BrailleAddObjectName (iType)
endIf
if iType == WT_TABCONTROL
&& getWindowClass (getFocus ()) == wc_OFormPopup
&& gstrOFormTabName then
	BrailleAddString (gstrOFormTabName, GetCursorCol (), GetCursorRow (), 0 ); Add cursorto fixpanning where you might only  see part of the name.
	Return TRUE
elif iType == WT_DIALOG
&& gbMSAADialog
&& ! StringIsBlank (gstrMSAADlgName) then
	BrailleAddString (gstrMSAADlgName,0,0,0)
	Return TRUE;
endIf
return BrailleAddObjectName (iType)
endFunction

int Function BrailleAddObjectdlgText (int iType)
if gbMSAADialog
&& ! StringIsBlank (gstrMSAADlgText) then
	BrailleAddString (gstrMSAADlgText,0,0,0)
	Return TRUE;
endIf
return BrailleAddObjectdlgText (iType)
endFunction

int function PreProcessKeyPressedEvent(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
;when pressing accellerator keys in the spell checker
if GlobalInSpellChecker then
	let GlobalPerformedReadMistakeAndSuggestion = false
EndIf
return PreProcessKeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

Void Function ProcessKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
var
	int iWinSubtype
let iWinSubtype=GetWindowSubtypeCode(GetFocus())
;This will guard against MSAA checkboxes,
;which do not refresh MSAA:
if KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey)
|| (nIsBrailleKey
&& strKeyName == ksBrailleRouting
&& !BrailleIsMessageBeingShown ()) then
	if ! iWinSubtype
	&& getObjectSubtypeCode (TRUE) == WT_CHECKBOX then
		;The MSAA Refresh makes checkboxes work right.
		MSAARefresh ()
	endIf
	if GlobalInSpellChecker then
		if iWinSubtype==wt_button then
			let GlobalPerformedReadMistakeAndSuggestion = false
		EndIf
	endIf
endIf
ProcessKeyPressed(nKey,strKeyName,nIsBrailleKey,nIsScriptKey) ; default
EndFunction

int function HandleCustomRealWindows (handle hwnd)
var
	string sDlgName
if gbMSAADialog then
	if ! stringIsBlank (gstrMSAADlgName) then
		Let sDlgName = gstrMSAADlgName
	else
		Let sDlgName= getWindowName (hwnd)
	endIf
	SayControlEXWithMarkup (hwnd, sdlgName, msgWizardDlgTypeInfo, cscNull, cscNull, ;state,
		cscNull, cscNull,;container name, type
		gstrMSAADlgText)
	Return TRUE
endIf
Return HandleCustomRealWindows (hwnd)
endFunction

int function HandleCustomWindows (handle hwnd)
var
	handle htmp;
Let gstrOFormTabName = cscNull
if giPane == PANE_STARTUP then
	sayWindow (hwnd, READ_EVERYTHING)
	Return TRUE
endIf
if getWindowClass (hwnd) == wc_OFormPopup
&& getObjectSubtypeCode (TRUE) == WT_TABCONTROL then
	Let htmp = FindWindow (hwnd,wc_OTabControl)
	if ! htmp then
		return handleCustomWindows (hwnd)
	endIf
	EnumerateTypeAndTextStringsForWindow (htmp,fn_MSAATabNameToGlobal)
	if BrailleInUse() then
		BrailleRefresh (); Ensure tab name is updated in Braille.
	endIf
	SayControlEXWithMarkup (hwnd, gstrOFormTabName, getObjectType ())
	Return TRUE
endIf
Let gstrOFormTabName = cscNull
return HandleCustomWindows (hwnd)
endFunction

Void Function SayObjectTypeAndText (optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
if ! HandleCustomWindows (getFocus ()) then
	SayObjectTypeAndText (nLevel,includeContainerName)
endIf
SpeakRelationship ()
endFunction

void Function SayHighlightedText (handle hWnd, string buffer)
if IsDesignView()
&& DesignFieldtype()>0
&& GetFocus()==hwnd then
	; buffer does not get entire text in rect.
	say(GetTextInRect(GetWindowLeft(hwnd),GetLineTop(),GetWindowRight(hwnd),GetLineBottom(),0),ot_highlighted_screen_text)
	return
endIf

if giInTable
|| getWindowClass (hWnd) == wc_OGrid
|| hWnd != getFocus () then
	Return
endIf
sayHighlightedText (hWnd, buffer)
endFunction

int Function GetMSAADialogInfo (handle hWnd, string byRef sdlgName, string byRef  sInfo)
var
	handle htmp,
	int iType,
	int i,
	int iMax,
	string sName,
	string sObjList,
	string sClass
;The following probably needs tweaking, but at minimum we now keep from being slow in oForm* controls.
If StringCompare(GetWindowClass(hwnd), wc_OFormSub) == 0 Then
	Let htmp = GetParent (hwnd)
ElIf StringCompare(GetWindowClass(hwnd), wc_OFormChild) == 0 Then
	Let htmp = GetParent(GetParent(hwnd))
Else
	Let htmp = hwnd
EndIf
let sClass=getWindowClass (htmp)
If StringCompare (sClass, wc_OForm) != 0
&& StringCompare (sClass, wc_OFormPopup) != 0
&& StringCompare (sClass, wcNUIDialog) != 0
&& StringCompare (sClass, wcNetUIHwnd) != 0 Then
	Let sInfo = cscNull
	Let sDlgName = cscNull
	return FALSE
EndIf
EnumerateTypeAndTextStringsForWindow (htmp,fn_MSAADlgNameToGlobal)
;Exception code for wizards to eliminate extra speaking from prior pages of the dialog
Let gStaticTextCounter = 0
If GetWindowName(GetRealWindow(GetFocus())) == wn_ReportWizard Then
	EnumerateTypeAndTextStringsForWindow (htmp,fn_MSAAStaticTextToGlobalForWizards)
Else
	EnumerateTypeAndTextStringsForWindow (htmp,fn_MSAAStaticTextToGlobal)
EndIf
return (!stringIsBlank (gstrMSAAdlgName)
	|| ! stringIsBlank (gstrMSAADlgText))
EndFunction

void Function ReadMessageBarInfo ()
var
	handle hWnd,
	string sText
if giPane != PANE_MESSAGEBAR then
	Return
endIf
let hWnd = GetParent (getFocus ())
GetMSAADialogInfo (hwnd, gstrMSAADlgName, gstrMSAADlgText)
Let sText = gstrMSAADlgText
SayMessage (OT_DIALOG_TEXT, sText)
endFunction

Script SayWindowPromptAndText ()
var
	handle hwnd,
	int nMode,
	int iObjType
let nMode=smmTrainingModeActive()

if giInTable then
	Let giLastCol = 0
	Let giLastRow = 0
	SpeakFieldHeader()
endIf

let hwnd=GetFocus()
let iObjType=GetObjectSubtypeCode()
if GetWindowClass(hwnd)==wc_OFormChild
&& iObjType==wt_edit then ; use GetTextInRect as default action does not properly refresh in wizards.
	Say(GetTextInRect(GetWindowLeft(hwnd),GetLineTop(),GetWindowRight(hwnd),GetLineBottom(),0),ot_line,true)
	SayTutorialHelp (iObjtype, TRUE)
	SayTutorialHelpHotKey (hWnd, TRUE)
IndicateComputerBraille (hwnd)
	SpeakProgressBarInfo(TRUE)
	smmToggleTrainingMode(nMode)
	return
endIf
PerformScript SayWindowPromptAndText ()
endScript

Script ScreenSensitiveHelp()
var
	string sTblName,
	string sRealClass,
	string sWinName,
	Int iSubtype,
	Int iObjSubtype
if IsSameScript () then
	AppFileTopic(topic_Access)
	return
endIf
If UserBufferIsActive () then
	UserBufferDeactivate ()
	SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
let sRealClass = GetWindowClass(GlobalRealWindow)
If GlobalMenuMode == MENUBAR_ACTIVE then
	if IsVirtualRibbonActive() then
	 	ShowScreenSensitiveHelpForVirtualRibbon(true)
	else
		ScreenSensitiveHelpForKnownClasses (WT_COMMANDBAR)
	EndIf
	return
ElIf (GlobalMenuMode == MENU_ACTIVE) then
	if IsVirtualRibbonActive() then
		ShowScreenSensitiveHelpForVirtualRibbon(false)
	else
		ScreenSensitiveHelpForKnownClasses (wt_menu)
	EndIf
	return
EndIf
if getWindowClass (getFocus ()) == wc_OForm then
	;This  means you're on a startup or other splash screen.
	SayFormattedMessage (ot_user_buffer, FormatString (msgFormGeneric, getObjectName (TRUE)))
	AddHotKeyLinks ()
	return
ElIf sRealClass == wc_ODb Then
	If GlobalWindowClass ==WC_ToolBarWindow32 then
		If GlobalCurrentControl == cId_databaseObjectsToolbar then
			SayFormattedMessage (OT_USER_BUFFER, msgHlp1_L, msgHlp1_S)
			AddHotKeyLinks ()
			return
		ElIf GlobalCurrentControl == cId_groupsToolbar then
			SayFormattedMessage (OT_USER_BUFFER, msgHlp2_L, msgHlp2_S)
			AddHotKeyLinks ()
			return
		Else
			PerformScript ScreenSensitiveHelp()
			return
		EndIf
	Else
		SayFormattedMessage (OT_USER_BUFFER, msgHlp3_L, msgHlp3_S)
		AddHotKeyLinks ()
		return
	EndIf
ElIf StringContains(GlobalRealWindowName, wn_Wizard) then
	SayFormattedMessage (OT_USER_BUFFER, FormatString(msgHlp4_L, GetFormName()),
		FormatString(msgHlp4_S, GetFormName()))
	AddHotKeyLinks ()
	return
ElIf giTableDesignView then
	SayFormattedMessage (OT_USER_BUFFER, msgHlp5_L, msgHlp5_S)
	if giDesignFieldType==iDsgnDataType then
		sayFormattedMessage(OT_USER_BUFFER,formatString(msgDsgnDataTypeScreenSensitiveHlp,GetScriptKeyName(skn_OpenListbox)))
	endIf
	AddHotKeyLinks ()
	return
ElIf giQueryDesignView then
	SayFormattedMessage (OT_USER_BUFFER, msgHlp6_L, msgHlp6_S)
	AddHotKeyLinks ()
	return
ElIf sRealClass == wc_OQry then
	If IsDatasheetView() then
		SayFormattedMessage (OT_USER_BUFFER,
			FormatString(msgHlp7_L, GetWindowName(GetRealWindow(GetFocus()))),
			FormatString(msgHlp7_S, GetWindowName(GetRealWindow(GetFocus()))))
		AddHotKeyLinks ()
		return
	ElIf IsSQLView() Then
		SayFormattedMessage (OT_USER_BUFFER, msgHlp8_L, msgHlp8_S)
		AddHotKeyLinks ()
		return
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf
ElIf StringContains(sRealClass,wc_OForm) Then
	If IsFormDesignView() then
		SayFormattedMessage (ot_user_buffer, msgHlp9_L, msgHlp9_S)
		AddHotKeyLinks ()
		return
	ElIf IsFormFormView() then
		SayFormattedMessage (ot_user_buffer, msgHlp10_L, msgHlp10_S)
		AddHotKeyLinks ()
		return
	ElIf IsFormDatasheetView() then
		SayFormattedMessage (ot_user_buffer, msgHlp11_L, msgHlp11_S)
		AddHotKeyLinks ()
		return
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf
	SayFormattedMessage (ot_user_buffer, msgHlp12_L, msgHlp12_S)
	AddHotKeyLinks ()
	return
ElIf StringContains(sRealClass,wc_OReport) Then
	If IsDesignView() Then
		SayFormattedMessage (OT_USER_BUFFER, msgHlp13_L, msgHlp13_S)
		AddHotKeyLinks ()
		return
	Else
		SayFormattedMessage (OT_USER_BUFFER, msgHlp14_L, msgHlp14_S)
		AddHotKeyLinks ()
		return
	EndIf
ElIf sRealClass == wc_OTable Then
	let sTblName=getParentControlName()
	SayFormattedMessage (ot_user_buffer, formatString(msgHlp15_L, sTblName),
		formatString(msgHlp15_S, sTblName))
	SpeakFieldInfo()
	return
ElIf GetWindowClass(GetParent(GetParent(GetParent(GlobalFocusWindow)))) == wc_OSysRel Then
	SayFormattedMessage (ot_user_buffer, msgHlp17_L, msgHlp17_S)
	AddHotKeyLinks ()
	return
ElIf StringContains (GetWindowClass(GetParent(GlobalFocusWindow)),cwc_Dlg32770) Then
	Let iSubtype = GetWindowSubtypeCode (GlobalFocusWindow)
	Let iObjSubtype = GetObjectSubtypeCode ()
	If (iSubtype == wt_button
		|| iObjSubtype == WT_BUTTON) then
		Let iSubtype = WT_BUTTON
	ElIf iObjSubtype == WT_RADIOBUTTON then
		Let iSubtype = WT_RADIOBUTTON
	ElIf iObjSubtype == WT_LISTBOXITEM then
		Let iSubtype = WT_LISTBOX
	EndIF
	If iSubtype == wt_button then
		SayFormattedMessage(ot_user_buffer,cmsgScreenSensitiveHelp14_l,cMsgScreenSensitiveHelp14_s)
		AddHotKeyLinks()
	ElIf iSubtype == wt_radiobutton then
		SayFormattedMessage(ot_user_buffer,cmsgScreenSensitiveHelp3_l,cMsgScreenSensitiveHelp3_s)
		AddHotKeyLinks()
	ElIf iSubtype == wt_listbox then
		SayFormattedMessage(ot_user_buffer,cmsgScreenSensitiveHelp19_l,cMsgScreenSensitiveHelp19_s)
		AddHotKeyLinks()
	ElIf iSubtype == wt_edit then
		SayFormattedMessage(ot_user_buffer,cmsgScreenSensitiveHelp16_l,cMsgScreenSensitiveHelp16_s)
		AddHotKeyLinks()
	EndIf
	Return
else
	Let iObjSubtype = getObjectSubtypeCode ()
	if iObjSubtype then
		ScreenSensitiveHelpForKnownClasses (iObjSubtype)
		Return
	endIf
	PerformScript ScreenSensitiveHelp ()
endIf
EndScript

Script HotkeyHelp ()
var
	String sClassName
if TouchNavigationHotKeys() then
	return
endIf
If UserBufferIsActive() Then
	UserBufferDeactivate()
EndIf
let sClassName = GetWindowClass(GlobalRealWindow)
If GlobalRealWindowName == wn_open Then
	SayFormattedMessage  (OT_USER_BUFFER, msgHotkeyHlp1_L, msgHotkeyHlp1_S)
	SayFormattedMessage  (OT_USER_BUFFER, msgHotkeyHlp2_L, msgHotkeyHlp2_S)
	UserBufferAddText (cScBufferNewLine)
	UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
	return
ElIf stringContains (sClassName,wc_SDM)
&& (GlobalRealWindowName==wn_saveAs) Then
	SayFormattedMessage  (OT_USER_BUFFER, msgHotkeyHlp3_L, msgHotkeyHlp3_S)
	SayFormattedMessage  (OT_USER_BUFFER, msgHotkeyHlp2_L, msgHotkeyHlp2_S)
	UserBufferAddText (cScBufferNewLine)
	UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
	return
ElIf DialogActive() then
	PerformScript HotKeyHelp()
	return
EndIf
SayFormattedMessage(OT_USER_BUFFER, msgHotkeyHlp5_L, msgHotkeyHlp5_S)
UserBufferAddText (cScBufferNewLine)
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
EndScript

;Legacy Functions do not remove unless you rewrite or call new version from script
String function GetRecordNumber()
Var
	Int i,
	String sText
;because MSAA is most frequently used,
;validate MSAA first, as its use is more relevant in Access 2007 than in prior versions:
if inTable () && giCurrentRow then
	return intToString (giCurrentRow)
elIf IsDataSheetView()
|| IsFormView() then
	SaveCursor ()
	InvisibleCursor ()
	MoveToWindow (FindWindow (GetTopLevelWindow (GlobalFocusWindow),wc_osui))
	JAWSHome()
	Let i = 4
	While i > 0
		If GetCharacterValue (GetCharacter()) != ciScrollSymbol then
			NextWord ()
			Let i = i-1
			Let sText = sText +cscSpace+GetWord()
		Else
			Let i = 0
		EndIf
	EndWhile
	RestoreCursor()
	return sText
Else
	return cscNull
EndIf
EndFunction

Script SpellCheck ()
var
	handle hwnd,
	string sText
if StringContains(GetWindowName(GetRealWindow(GetFocus())),wn_Spelling) then
	if GetObjectSubtypeCode()==wt_edit then
		let sText=GetObjectValue(true)
		indicateControlType(wt_edit,GetObjectName(),sText)
		spellstring(sText)
	else
		InvisibleCursor()
		JAWSPageUp()
		let hwnd=FindWindowWithClassAndId(GetCurrentWindow(),cwc_RichEdit20w,cId_NotINDictionaryEditBox)
		if hwnd then
			MoveToWindow(hwnd)
			let sText=getWindowText(hwnd,false)
			sayMessage(ot_control_name,GetObjectName(true))
			say(sText,ot_line,true)
			spellString(sText)
		endIf
	endIf
	;check for suggestions list:
	if IsPCCursor() then
		InvisibleCursor()
		RouteInvisibleToPC()
	endIf
	let hwnd=GetTopLevelWindow(getCurrentWindow())
	let hwnd=FindDescendantWindow(hwnd,cID_SuggestionsListName)
	if hwnd then
		sayMessage(ot_control_name,getWindowName(hwnd))
		MoveToWindow(GetNextWindow(hwnd))
		let sText=GetObjectName(true)
		say(sText,ot_line,true)
		if !stringContains(sText,scNoSuggestions) then
			spellstring(sText)
		endIf
	endIf
PCCursor()
Else
	sayFormattedMessage (ot_error, msg1_L) ;"Not in spell checker"
endIf
EndScript

Script ToggleLabelSearch ()
;To do: See how relevant this is in Access 2007 - what labels to get,etc. if any.
;Since muchof this is automatic or via objects it's faster than former Access code.
if giLabelSearch then
	sayFormattedMessage (OT_STATUS, msg16_L, msg16_S) ; search off
	let giLabelSearch=false
else
	sayFormattedMessage (OT_STATUS, msg17_L, msg17_S) ; search on
	let giLabelSearch=true
endIf
EndScript

Script SayLine ()
var
	handle hwnd,
	int iSubtype,
	string sClass

if !isPCCursor()
|| UserBufferIsActive() then
	PerformScript SayLine()
	return
endIf
If IsPcCursor()  then
	Let hwnd = getFocus ()
	let iSubtype=GetSubtypeCode(hwnd)
	let sClass=getWindowClass(hwnd)
	if !iSubtype then
		if sClass == wc_OFormPopupNC Then
			SayControlExWithMarkup(hwnd, cscNull, cscNull, cscNull, cscNull, cscNull, GetLine())
			Return
		elIf sClass == wc_OFormPopup
		&& GetObjectSubtypeCode(TRUE) == WT_TABCONTROL Then
			SayObjectActiveItem()
			return
		endIf
	EndIf
EndIf
if sClass==wc_OFormChild
&& GetObjectSubtypeCode()==wt_edit then ; use GetTextInRect as default action does not properly refresh in wizards.
	Say(GetTextInRect(GetWindowLeft(hwnd),GetLineTop(),GetWindowRight(hwnd),GetLineBottom(),0),ot_line,true)
	return
endIf
performScript SayLine()
endScript

Script SayWord ()
var
	handle hwnd
if !IsPCCursor()
|| UserBufferIsActive() then
	PerformScript SayWord ()
	return
endIf
If IsPcCursor() then
	let hwnd = getFocus ()
	if !GetWindowSubtypeCode(hwnd)
	&& GetWindowClass(hwnd) == wc_OFormPopup
	&& GetObjectSubtypeCode(TRUE) == WT_TABCONTROL Then
		SayObjectActiveItem()
		Return
	endIf
EndIf
PerformScript SayWord()
EndScript

string Function TreeCoreGetDefaultOptions ()
;overwritten here to remove custom label feature not available in Microsoft Access.
var
	string sMiniList,;For node sections, add to strList:
	string sNodeName,
	string cStrDefaultList;
;General Options:
Let sNodeName = NODE_GENERAL;
Let sMiniList =
	UO_VerbositySetLevel+_dlg_separator+
	UO_ProgressBarSetAnnouncement+_dlg_separator+
	UO_TopAndBottomEdgeIndicate+_dlg_separator+
	UO_GraphicsShow+_dlg_separator+
	UO_ScreenEchoSet+_dlg_separator
ConvertListToNodeList (sMiniList, sNodeName)
Let cstrDefaultList = cstrDefaultList+sMiniList;
Let sMiniList = Null()
Let sNodeName = Null()
;Reading Options:
Let sNodeName = NODE_READING
Let sMinilist =
	UO_SmartWordReadingSet+_dlg_separator+
	UO_LanguageDetectChange+_dlg_separator
ConvertListToNodeList (sMiniList, sNodeName)
Let cstrDefaultList = cstrDefaultList+sMiniList;
Let sMiniList = Null()
Let sNodeName = Null()
;Reading Options.SayAll Options:
Let sNodeName = sNodeName+NODE_PATH_DELIMITER+NODE_SAYALL;
Let sMiniList =
	UO_SayAllReadsBy+_dlg_separator+
	UO_CapsIndicateDuringSayAll+_dlg_separator
ConvertListToNodeList (sMiniList, sNodeName)
Let cstrDefaultList = cstrDefaultList+sMiniList;
Let sMiniList = Null()
Let sNodeName = Null()
;Editing Options:
Let sNodeName = NODE_EDITING;
Let sMiniList =
	UO_TypingEchoSet+_dlg_separator+
	UO_CapsIndicate+_dlg_separator+
	UO_PunctuationSetLevel+_dlg_separator+
	UO_IndentationIndicate+_dlg_separator
ConvertListToNodeList (sMiniList, sNodeName)
Let cstrDefaultList = cstrDefaultList+sMiniList;
Let sMiniList = Null()
Let sNodeName = Null()
;Editing Options.Spelling Options:
Let sNodeName = sNodeName+NODE_PATH_DELIMITER+NODE_SPELLING
Let sMiniList =
	UO_SpellModeSet+_dlg_separator+
	UO_AlphaNumCombinations+_dlg_separator
;Default, add Mute as 0-level object:
;Let cstrDefaultList = cStrDefaultList+UO_SynthesizerMute
return cStrDefaultList
EndFunction

string Function LanguageDetectChangeHlp (int iRetCurVal)
Return formatString(msgUO_AccessLanguageDetectChangeHlp,msgDefaultSettingIsOn)
EndFunction

Void function SayLineUnit(int unitMovement, int bMoved)
var
	handle hCurrentWindow,
	int TheTypeCode,
	string sClass
If isPCCursor()
&& !UserBufferIsActive() then
	let hCurrentWindow = GetFocus()
	let TheTypeCode = GetWindowSubTypeCode (hCurrentWindow)
	If ! TheTypeCode then
		Let TheTypeCode = GetObjectSubTypeCode ()
	EndIf
	let sClass=GetWindowClass(hCurrentWindow)
	if sClass==wc_oFormPopup
	|| sClass==wc_OKttbx then
		;prevent extra chatter, handled by ProcessSayFocusWindowOnFocusChange.
		return
	endIf
endIf
SayLineUnit(unitMovement, bMoved)
EndFunction

Void Function SayObjectActiveItem(optional Int AnnouncePosition )
if giInTable then
	SpeakCellInfo ()
	Return
endIf
SayObjectActiveItem(AnnouncePosition )

EndFunction


void Function ScreenStabilizedEvent(handle hwndLastWrite)
if globalInSpellchecker
&& !globalPerformedReadMistakeAndSuggestion then
	performScript Spellcheck()
	let globalPerformedReadMistakeAndSuggestion =true
	return
endIf
ScreenStabilizedEvent(hwndLastWrite)
endFunction

String Function GetVersionInfoString (string appFilePath, string requestedInfo)
if requestedInfo == cmsg282_L;ProductName
	var
		string appName = scMicrosoft + cScSpace + GetActiveConfiguration ()
	return GetOfficePurchaseInfo (appName)
endIf
return GetVersionInfoString (appFilePath, requestedInfo)
EndFunction

Script SayAppVersion ()
if IsSameScript() then
	PerformScript ShowVersionDetails ()
	return
endIf
var string message = GetFocusedApplicationVersionInfo ()
SayFormattedMessage (ot_help, message)
EndScript

Script OpenListbox()
If isDesignView()
&& DesignFieldType()==iDsgnDataType then
	TypeKey(	cksAltDownArrow )
	SayLine()
	return
endIf
if (isPcCursor () && ! isVirtualPcCursor ())
	TypeKey(	cksAltDownArrow )
	SayLine()
	return
endIf
performScript OpenListbox()
EndScript
