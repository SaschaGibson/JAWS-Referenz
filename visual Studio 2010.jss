;Copyright 2011-2017 Freedom Scientific, Inc.
include "hjconst.jsh"
include "hjglobal.jsh"
include "Visual Studio 2010.jsm"
include "Visual Studio 2010.jsh"
use "Visual Studio Internal.jsb"
globals
	int g_vsInCompletionsList,
	int g_vsDontSpeakNextFocusChange,

	; We track based on a concatenation of VSEdition and major version
collection g_vsScriptsHaveAlreadyLoadedThisJawsSession


Script ScriptFileName()
ScriptAndAppNames(FormatString(cmsgVisualStudioAppName,IntToString(GetProgramVersion(GetAppFilePath()))))
EndScript
; This function will only return true the first time it is called for a specific visual studio edition and version.
; It won't return true again for that edition/version untill JAWS is restarted
int function IsThisFirstLoadOfScriptsThisJawsSession()
	if (!g_vsScriptsHaveAlreadyLoadedThisJawsSession) then
		let g_vsScriptsHaveAlreadyLoadedThisJawsSession  = new collection
	EndIf
	var string key = GetHandleIncomingCallRegistrySubKey()
	if !key
		return false
	EndIf
	if (!CollectionItemExists(g_vsScriptsHaveAlreadyLoadedThisJawsSession,key)) then
		g_vsScriptsHaveAlreadyLoadedThisJawsSession[key] = 1
		return TRUE
	EndIf
	return FALSE
EndFunction
function AutoStartEvent()
	if (IsThisFirstLoadOfScriptsThisJawsSession())
		EnableJawsAccessToVSWizards()
	EndIf
	let g_vsdteAtachAttempts = 0
	AttachToObjectModel()
	ReportIfBreakPointJustHit()
EndFunction

function AutoFinishEvent()
	var
		object oNull
	let g_vsdteAddin = oNull
	let g_vsdte = oNull
	let g_vsDebuggerEvents = onull
	let g_vsBuildEvents = onull
EndFunction

object function BuildAccessibleTree(optional handle window)
	if (!Window) then
		let window = GetAppMainWindow(GetFocus())
	EndIf
	var object treeBuilder = createobjectEx("FreedomSci.AccessibleTree",0,"AccessibleObjectTools.x.manifest")
	if (treeBuilder) then
		return TreeBuilder.Build(window)
	EndIf
	return 0
EndFunction

script SayBottomLineOfWindow()
	var object accessibleTree = BuildAccessibleTree()
	if (!accessibleTree) then
		return
	EndIf
	var object statusBar = accessibleTree.findByAutomationId("StatusBarContainer")
	if (StatusBar)
		Say(StatusBar.name,ot_user_requested_information)
	EndIf
EndScript

int function InDesignerWithCoordinates()
	var int mode = ComputeActiveMode()
	return (mode == modeWinformsDesigner || mode == modeCppResourceEditor)
EndFunction

handle function GetActiveCppResourceEditorControl(handle hwnd)
	if (substring(getWindowClass(hwnd),1,4) != "Afx:") then
		return 0
	EndIf
	var
		int left,
		int top,
		int right,
		int bottom
	if (!GetFocusRect(hwnd,left,right,top,bottom)) then
		return FALSE
	EndIf
	var handle hwndControl = GetWindowAtPoint(left+5,top+5)
	if (!hwndControl || hwndControl == hwnd) then
		return 0
	EndIf
	var handle hwndTest = hwndControl
	while ( hwndTest && hwndTest != hwnd)
		if (getWindowClass(hwndTest) == "#32770") then
			return hwndControl
		EndIf
		hwndTest = GetParent(hwndTest)
	EndWhile
	return 0
EndFunction

int function ComputeActiveMode()
	var handle hwnd = GetFocus(),
		string name
	if (GetActiveCppResourceEditorControl (hwnd))
		return modeCppResourceEditor
	EndIf
	while (hwnd)
		let name = GetWindowName(hwnd)
		if (name == "DesignerFrame") then
			return modeWinformsDesigner
		EndIf
		let hwnd = GetParent(hwnd)
	EndWhile
	return modeUnknown
EndFunction

int function ShouldDeferToDefaultFunction()
	return (GetMenuMode() != MENU_INACTIVE ||
	!IsPcCursor() ||
	InHomeRowMode() ||
	UserBufferIsActive())
EndFunction

int function GetControlCoordinates(int byref x, int byref y,int byref width,int byref height)
	var
		object accessibleTree = BuildAccessibleTree()
	if (!accessibleTree) then
		return
	EndIf
	var object item = accessibleTree.findByAutomationId("XYWidthHeightCompartment")
	if (!item) then
		return FALSE
	EndIf
	var string text = item.name
	x = StringToInt(StringSegment(text," ",1))
	y = StringToInt(StringSegment(text," ",2))
	width = StringToInt(StringSegment(text," ",3))
	height = StringToInt(StringSegment(text," ",4))
	return TRUE
EndFunction

int function SayControlCoordinate(int what)
	var
		int x,
		int y,
		int width,
		int height
	if (!GetControlCoordinates(x,y,width,height)) then
		return FALSE
	EndIf
	if (what == coordX)
		SayFormattedMessage(ot_user_requested_information,cmsgLeftCoordinate_l,cmsgLeftCoordinate_s,x)
		return
	EndIf
	if (what == coordY)
		SayFormattedMessage(ot_user_requested_information,cmsgTopCoordinate_l,cmsgTopCoordinate_s,y)
		return
	EndIf
	if (what == coordXAndY)
		SayFormattedMessage(ot_user_requested_information,cmsgTopCoordinate_l,cmsgTopCoordinate_s,x,y)
		return
	EndIf
	if (what == coordRight)
		SayFormattedMessage(ot_user_requested_information,cmsgRightCoordinate_l,cmsgRightCoordinate_s,x+width)
		return
	EndIf
	if (what == coordBottom)
		SayFormattedMessage(ot_user_requested_information,cmsgBottomCoordinate_l,cmsgBottomCoordinate_s,y+height)
		return
	EndIf

	if (what == coordWidth)
		SayFormattedMessage(ot_user_requested_information,cmsgWidth_l,cmsgWidth_s,width)
		return
	EndIf
	if (what == coordHeight)
		SayFormattedMessage(ot_user_requested_information,cmsgHeight_l,cmsgHeight_s,height)
		return
	EndIf
	if (what == coordWidthAndHeight)
		SayFormattedMessage(ot_user_requested_information,cmsgWidthHeight_l,cmsgWidthHeight_s,width,height)
		return
	EndIf
	if (what == coordAll)
		SayFormattedMessage(ot_user_requested_information,cmsgLeftTopCoordinate_l,cmsgLeftTopCoordinate_s,x,y)
		SayFormattedMessage(ot_user_requested_information,cmsgWidthHeight_l,cmsgWidthHeight_s,width,height)
		return
	EndIf
	if (what == coordRect)
		SayFormattedMessage(ot_user_requested_information,cmsgLeftTopCoordinate_l,cmsgLeftTopCoordinate_s,x,y)
		SayFormattedMessage(ot_user_requested_information,cmsgRightBottomCoordinate_l,cmsgRightBottomCoordinate_s,x+width,y+height)
		return
	EndIf

EndFunction

void function SayCharacterUnit(int UnitMovement)
	if (ShouldDeferToDefaultFunction() )  then
		SayCharacterUnit(UnitMovement)
		return
	EndIf
	if (InDataGrid())
		; the newly focused cell will be announced via
		;FocusChangedEvent
		; we don't want to say anything here
		return
	EndIf
	if (InDesignerWithCoordinates()) then
		SayControlCoordinate(coordX)
	else
		SayCharacterUnit(UnitMovement)
	EndIf
EndFunction

void function SayLineUnit(int UnitMovement)
	if (ShouldDeferToDefaultFunction() )  then
		SayLineUnit(UnitMovement)
		return
	EndIf
	if (InDataGrid())
		; Datagrids will announce the newly focused cell
		; via FocusChangedEvent when arrowing around
		;Allowing SayLine to speak here will  actually speak whatever
		;	happens to be on the same line in a window next to the
		;	datagrid.
		; This clearly is undesirable, so we say nothing.
		return
	EndIf
	if (InDesignerWithCoordinates()) then
		SayControlCoordinate(coordY)
	else
		SayLineUnit(UnitMovement)
	EndIf
EndFunction

void function SayWordUnit(int UnitMovement)
	if (ShouldDeferToDefaultFunction() )  then
		SayWordUnit(UnitMovement)
		return
	EndIf
	if (InDataGrid())
		; the newly focused cell will be announced via
		;FocusChangedEvent
		; we don't want to say anything here
		return
	EndIf
	if (InDesignerWithCoordinates()) then
		SayControlCoordinate(coordX)
	else
		SayWordUnit(UnitMovement)
	EndIf
EndFunction

Script SayCharacter()
	if (ShouldDeferToDefaultFunction() )  then
		PerformScript SayCharacter()
		return
	EndIf
	if (InDesignerWithCoordinates()) then
		SayControlCoordinate(coordRect)
	else
		PerformScript SayCharacter()
	EndIf
EndScript
Script SayLine()
	if (ShouldDeferToDefaultFunction() )  then
		PerformScript SayLine()
		return
	EndIf
	if (InDataGrid()) then
		sayObjectTypeAndText()
	else
		PerformScript SayLine()
	EndIf
EndScript

Script SelectNextLine()
	if (ShouldDeferToDefaultFunction() )  then
		PerformScript SelectNextLine()
		return
	EndIf
	if (InDesignerWithCoordinates()) then
		SelectNextLine()
		SayControlCoordinate(coordBottom)
	else
		PerformScript SelectNextLine()
	EndIf
EndScript

Script SelectPriorLine()
	if (ShouldDeferToDefaultFunction() )  then
		PerformScript SelectPriorLine()
		return
	EndIf
	if (InDesignerWithCoordinates()) then
		SelectPriorLine()
		SayControlCoordinate(coordBottom)
	else
		PerformScript SelectPriorLine()
	EndIf
EndScript

Script SelectNextCharacter()
	if (ShouldDeferToDefaultFunction() )  then
		PerformScript SelectNextCharacter()
		return
	EndIf
	if (InDesignerWithCoordinates()) then
		SelectNextCharacter()
		SayControlCoordinate(coordRight)
	else
		PerformScript SelectNextCharacter()
	EndIf
EndScript

Script SelectPriorCharacter()
	if (ShouldDeferToDefaultFunction() )  then
		PerformScript SelectPriorCharacter()
		return
	EndIf
	if (InDesignerWithCoordinates()) then
		SelectPriorCharacter()
		SayControlCoordinate(coordRight)
	else
		PerformScript SelectPriorCharacter()
	EndIf
EndScript

Script Tab ()
	if (ShouldDeferToDefaultFunction()) then
		PerformScript Tab()
		return
	EndIf
	var handle hwndCppPriorControl = GetActiveCppResourceEditorControl(GetFocus())
	if (!hwndCppPriorControl) then
		PerformScript Tab()
		return
	EndIf
	SayCurrentScriptKeyLabel ()
	TabKey ()
	var handle hwndCppControl = GetActiveCppResourceEditorControl(GetFocus())
	;if (hwndCppControl == hwndCppPriorControl) then
	delay(2)
	hwndCppControl = GetActiveCppResourceEditorControl(GetFocus())
	;EndIf
	SayWindowTypeAndText(hwndCppControl)
	;Say(FormatString("%1 %2",GetWindowName(hwndCppControl),GetWindowType(hwndCppControl)),OT_CONTROL_NAME)
EndScript

Script ShiftTab ()
	if (ShouldDeferToDefaultFunction()) then
		PerformScript ShiftTab()
		return
	EndIf
	var handle hwndCppPriorControl = GetActiveCppResourceEditorControl(GetFocus())
	if (!hwndCppPriorControl) then
		PerformScript ShiftTab()
		return
	EndIf
	SayCurrentScriptKeyLabel ()
	ShiftTabKey ()
	var handle hwndCppControl = GetActiveCppResourceEditorControl(GetFocus())
	;if (hwndCppControl == hwndCppPriorControl) then
	delay(2)
	hwndCppControl = GetActiveCppResourceEditorControl(GetFocus())
	;EndIf
	;Say(FormatString("%1 %2",GetWindowName(hwndCppControl),GetWindowType(hwndCppControl)),OT_CONTROL_NAME)
	SayWindowTypeAndText(hwndCppControl)
EndScript
string function GetCurrentLineFromObjectModel()
	var object doc = g_vsdte.ActiveDocument
	if (!doc)
		return 0
	EndIf
	var object selection = doc.selection
	if (!selection)
		return 0
	EndIf
	var object ep = selection.activepoint.createeditpoint()
	if (!ep)
		return 0
	EndIf
	var int line = ep.line
	return ep.GetLines(line,line+1)
EndFunction
Script DeleteCurrentLine()
	g_vsdte.ExecuteCommand("Edit.LineCut")
	SayLine()
EndScript
Script DeletePriorWord()
	g_vsdte.ExecuteCommand("Edit.WordDeleteToStart")
	SayWord()
EndScript
Script DeleteCurrentWord()
	g_vsdte.ExecuteCommand("Edit.WordDeleteToEnd")
	SayWord()
EndScript
Script SayVariableValue()
	var
		object addin,
		object AddinInfo
	if (g_vsdteDebugMode != dbgBreakMode) then
		Say(cmsgOnlyWorksAtBreakPoint,OT_error)
		return
	EndIf
	let AddinInfo = g_VSDTE.Addins("VisualStudioJawsAddin.Connect")
	if (!AddinInfo) then
		Say(cmsgCouldNotLoadAddin,OT_error)
		return
	EndIf
	let addin = VisualStudioGetAddinObject(AddinInfo)
	if (!Addin) then
		Say(cmsgCouldNotAttachToAddin,OT_error)
		return
	EndIf

	if (IsSameScript()) then
		RedirectToUserBuffer(addin.GetVariableValue())
	else
		Say(addin.GetVariableValue(),ot_user_requested_information)
	EndIf
EndScript
function vsOnEnterBreakMode(int reason)
	g_vsdteDebugMode = dbgBreakMode
	if (reason == dbgEventReasonBreakpoint)
		say(g_vsdte.Debugger.BreakpointLastHit.Name,ot_user_requested_information)
	EndIf
	saystring(GetCurrentLineFromObjectModel())
EndFunction

void function vsOnEnterRunMode()
	g_vsdteDebugMode = dbgRunMode
EndFunction

void function vsOnEnterDesignMode()
	if (g_vsdteDebugMode == dbgRunMode ||
		g_vsdteDebugMode == dbgBreakMode) then
		SayString("Debugging Finished")
	EndIf
	g_vsdteDebugMode = dbgDesignMode
EndFunction

function ReportIfBreakPointJustHit()
	if (g_vsdteDebugMode != dbgBreakMode &&
		g_vsdte.debugger.CurrentMode == dbgBreakMode &&
		g_vsdte.debugger.LastBreakReason == dbgEventReasonBreakpoint) then
		vsOnEnterBreakMode(dbgEventReasonBreakpoint)
	EndIf
EndFunction
void function vsOnBuildDone()
	Say(g_vsdte.StatusBar.text,ot_user_requested_information)
EndFunction
int function MenuProcessedOnFocusChangedEventEx(
	handle hwndFocus, handle hwndPrevFocus,
	int nType, optional int nChangeDepth)
	if (!g_vsInCompletionsList && GetObjectClassName(0) == "IntellisenseMenuItem" ) then
		g_vsInCompletionsList = true
		let GlobalPrevMenuMode = MENU_INACTIVE
		let GlobalMenuMode = MENU_INACTIVE
		return FALSE
	EndIf
	return MenuProcessedOnFocusChangedEventEx(hwndFocus,hwndPrevFocus,
	nType,nChangeDepth)
EndFunction



Function FocusChangedEventProcessAncestors (handle FocusWindow, handle PrevWindow)
	if (GetObjectClassName(0) == "IntellisenseMenuItem" ) then
		g_vsInCompletionsList = true
		let GlobalPrevMenuMode = MENU_INACTIVE
		let GlobalMenuMode = MENU_INACTIVE
	EndIf
	if (g_vsDontSpeakNextFocusChange) then
		let g_vsDontSpeakNextFocusChange = FALSE
		return
	EndIf
	var
		int iType,
		int nLevel,
		int nDepth
	let nDepth = GetFocusChangeDepth()
	let nLevel = nDepth
	while (nLevel >= 0)
		iType = GetObjectSubtypecode(true,nLevel)
		if nLevel < 2
			&& iType == WT_TABLECELL then
			if globalSpeakHeaderOnCellChange == TABLE_NAV_HORIZONTAL then
				Say(GetColumnHeader(TRUE),OT_SCREEN_MESSAGE)
			elif globalSpeakHeaderOnCellChange == TABLE_NAV_VERTICAL then
				Say(GetRowHeader(TRUE),OT_SCREEN_MESSAGE)
			EndIf
		EndIf
		if (ObjectWorthIncluding(iType,nLevel,nDepth)) then
			sayObjectTypeAndText(nLevel)
		EndIf
		let nLevel= nLevel-1
	EndWhile
EndFunction
int Function ObjectWorthIncluding(int type,int level,int totalLevels)

	if (level > 0 &&
		type == wt_button &&
		GetObjectSubtypecode(true,level-1) ==	WT_COMBOBOX) then
		return FALSE
	EndIf
	if ((type == WT_DIALOG_PAGE && !DialogActive()))
		return FALSE
	EndIf
	if (GetObjectClassName(level) == "GenericPane") then
		return FALSE
	EndIf
	return true
EndFunction
Void Function MenuModeEvent (handle WinHandle, int mode)
	if (mode == Menu_Active && GetObjectClassName(0) == "IntellisenseMenuItem" ) then
		g_vsInCompletionsList = true
		return
	EndIf
	if (mode == MENU_INACTIVE && g_vsInCompletionsList) then
		let g_vsInCompletionsList = FALSE
		let g_vsDontSpeakNextFocusChange = TRUE
		return
	EndIf
	MenuModeEvent(WinHandle,mode)

EndFunction
void function FocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
	FocusChangedEventEx (hwndFocus, nObject, nChild,hwndPrevFocus, nPrevObject, nPrevChild,nChangeDepth)
	if (GetObjectTypeCode() == WT_DIALOG &&
		GetObjectName() == "Output" ) then
		; when the Output pane first opens after starting Visual
		; studio, focus is moved to the pane itself rather than to the
		; edit hosted therein because the edit hasn't yet been created.
		; Unfortunately, VS doesn't bother to automatically fire an
		; event when focus moves to the edit, but we can detect this
		; change and make note of it by telling UIA to refresh itself.
		; But we need to wait a little while to ensure that the edit has
		; sprung to life.
		Delay(2,TRUE)
		UIARefresh()
		return
	EndIf
EndFunction
int function InDataGrid()
	return (GetObjectSubtypecode(FALSE,1) == WT_TABLE &&
	GetObjectName(FALSE,1) == "DataGridView")
EndFunction
