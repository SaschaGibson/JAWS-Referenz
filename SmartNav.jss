;Copyright (C) 2015-2022 Freedom Scientific

include "hjconst.jsh"
include "HjGlobal.jsh"
include "common.jsm"
globals
int g_smartNavMax, ; The maximum level we are allowed to increment to, (i.e. the on disk value).
int priorSmartNavInTableCell,
int priorSmartNavTableNestingLevel,
int g_smartNavHookInstalled

const
c_smartNavSection = "html",
c_smartNavKey="SmartNavigation"

void function SmartNavStart()
g_smartNavMax=GetSmartNavMaxOnJCFLoad()

if !g_smartNavHookInstalled then
		addHook(HK_SCRIPT, "smartNavHook")
	g_smartNavHookInstalled=true
	endIf
endFunction

void function autoStartEvent()
SmartNavStart()
endFunction


;This needs to be read from disk because QuickSettings writes the setting to disk directly.
void function SmartNavSettingsReloadFromQuickSettings ()
g_smartNavMax = readSettingInteger (SECTION_HTML, hKey_Smart_navigation, getDefaultJCFOption (optSmartNavigation), FT_CURRENT_JCF, rsStandardLayering)
if g_smartNavMax then
	if !g_smartNavHookInstalled then
		addHook(HK_SCRIPT, "smartNavHook")
		g_smartNavHookInstalled=true
	endIf
endIf
endFunction

void function autoFinishEvent()
removeHook(HK_SCRIPT, "smartNavHook")
g_smartNavHookInstalled=false
endFunction

Script SayCharacter()
if DecrementSmartNavOnDoublePress() then
	sayCharacter()
	return
endIf
performScript sayCharacter()
endScript

; Regardless of the JCF value, if the current control treats single characters as single characters, we do not want to go through the Smart Nav logic
;This is so SayChar twice in a paragraph will spell the character on the first double press.
Int Function ControlIsTreatedAsSingleChar ()
return StringLength(getCharacter()) > 1
EndFunction

Script SayWord()
if DecrementSmartNavOnDoublePress() then
	sayWord()
	return
endIf
performScript sayWord()
EndScript

Script SayLine()
if DecrementSmartNavOnDoublePress() then
	sayLine()
	return
endIf
performScript sayLine()
endScript

Int Function DecrementSmartNavOnDoublePress ()
if !ControlIsTreatedAsSingleChar() then
	return false
endIf
if IsVirtualPCCursor() && getJCFOption(optSmartNavigation) > 0 && isSameScript() > 0 then
	decrementSmartNavLevel();
	return true
endIf
return false
EndFunction

Void Function DecrementSmartNavLevel ()
var
int l
l=GetJCFOption(optSmartNavigation)
if (l==smartNavOff)
	return
endIf
if builtin::inTableCell() && (L&smartNavTables)then
	l=(l&~smartNavTables) ; set to prior level if in a table
else
	l=smartNavOff ; set to off if not in a table
endIf
setJCFOption(optSmartNavigation,l)
EndFunction

void function RestoreSmartNavLevel()
setJCFOption(optSmartNavigation,g_smartNavMax)
endFunction

Void Function IncrementSmartNavLevel ()
var
int l
l=GetJCFOption(optSmartNavigation)
if (l==g_smartNavMax)
	return
endIf
if (builtin::inTableCell() && (g_smartNavMax & smartNavTables)) then 
	l=(l|smartNavTables) ; set to next level up
else
	l=g_smartNavMax ; Set back to maximum allowed if not in a table
endIf
setJCFOption(optSmartNavigation,l)
EndFunction

void function SpeakSmartNavLevelSetting ()
var 
	int level = GetJCFOption (optSmartNavigation),
	string message
; if the actual setting is OFF, speaking the smart nav level as words and characters would be inaccurate.
if ! giSpeakSmartNavLevel then return endIf
giSpeakSmartNavLevel = FALSE
if level == smartNavOff then
; reading by word and character.
	message = cmsgSmartNavWordAndCharacter
elif level == smartNavControls then
	message = cmsgSmartNavControls
elif level == smartNavControlsAndTables then
	message = cmsgSmartNavControlsAndTables
endIf   
message = formatString (cmsgSmartNavigationSetting, message)
SayMessage (OT_USER_REQUESTED_INFORMATION, message)
endFunction

; The scripts which should be allowed to run but not change the Smart Nav level.
int function AllowedToRunWithoutChangingSmartNavLevel(string scriptName)
if ScriptName == "SayCharacter"
	|| ScriptName == "SayWord"
	|| ScriptName == "SayLine" 
	; sentence and paragraph movement:
	|| StringContains (ScriptName, "Sentence")
	|| StringContains (ScriptName, "Paragraph")
	|| StringContains (ScriptName, "ListBox")
	|| ScriptName == "ControlDownArrow"
	|| ScriptName == "ControlUpArrow"
	|| scriptName=="SayFont" 
	|| scriptName=="SayColor"
	|| ScriptName == "SayWindowPromptAndText"
	|| ScriptName == "SaySelectedLink"
	|| ScriptName == "SayActiveCursor"
	|| ScriptName == "SayFromCursor"
	|| ScriptName == "SayToCursor"
	|| stringContains(scriptName, "Select")
	|| scriptName=="BrailleRouting" || stringContains(scriptName, "BraillePan") then
	return true
endIf
return false
endFunction

; The scripts which will navigate differently depending on the context
; Some of these may change the Smart Nav level under certain circumstances.
; But generally the level won't be changed
int function ShouldNavigateAndAdjustSmartNavLevelIfNeeded(string scriptName)
if gbKeyboardHelp then return FALSE endIf
if (ScriptName == "SayNextCharacter" 
	|| ScriptName == "SayPriorCharacter"
	|| scriptName=="JAWSHome"
	|| scriptName=="JAWSEnd" 
	|| ScriptName == "SayNextWord"
	|| ScriptName == "SayPriorWord"
	|| scriptName == "SayNextLine" 
	|| ScriptName == "SayPriorLine") then
return true
endIf
return false
endFunction

int function HandleNavByLineAndAdjustSmartNavLevelAsNeeded(int navForward)
var int currentSmartNavLevel=GetJCFOption(optSmartNavigation)

; We are navigating by line, only increment the Smart Nav Level if at character level so we still allow hearing of entire table row.
;(I.e. If at character level, will increment to Control level but will not increment to Control and Tables level until table status changes.)
if currentSmartNavLevel==smartNavOff then 
	incrementSmartNavLevel()
elif (currentSmartNavLevel&smartNavTables) && (IsVirtualPCCursor() && builtin::inTableCell()) then
; Table navigation failed, table status didn't change, and we're stuck in the first or last row of the table
; because the cell spanned more than one line.
	var int row=getCursorRow()
	stepOutOfCurrentElement(navForward)
	if getCursorRow()!=row then
		sayLine() ; speak the line we land on.
		return false; the above step will have moved us to the start or end string of the table.
	endIf
	return true; step failed, just allow line nav through.
endIf
return true
endFunction

void function IncrementSmartNavLevelOnTableStatusChange()
if tableStatusChanged() then
	RestoreSmartNavLevel() ; User navigated into or out of a nested table, restore the Smart Nav Level. 
endIf
endFunction

int function DoSmartNavigation(string scriptName)
if DoSmartTableNavIfNeeded(ScriptName) then
	IncrementSmartNavLevelOnTableStatusChange()
	return false ; table nav has already occurred, do not allow script to run.
endIf
; Table navigation failed.
; We are either arrowing into or out of a table or from one table into a child or parent table.
IncrementSmartNavLevelOnTableStatusChange()

if (scriptName=="sayPriorLine" || scriptName=="sayNextLine") then
	return HandleNavByLineAndAdjustSmartNavLevelAsNeeded(scriptName == "sayNextLine")
endIf
return true
endFunction

int function IsSmartNavActive()
return IsVirtualPCCursor()
	&& !UserBufferIsActive()
	&& g_smartNavMax > 0
EndFunction

Void Function SmartNavHook (string ScriptName)
if g_smartNavMax==smartNavOff then
	return true
endIf
if AllowedToRunWithoutChangingSmartNavLevel(scriptName) then
	if ScriptName == "SayWindowPromptAndText" 
	|| ScriptName == "SaySelectedLink" ; from windows help scripts
	|| ScriptName == "SayActiveCursor" then
	; speak the level and then
	;continue reading prompt and text info.
	; This script also has a secondary hook applied,
	; VirtualPromptAndTextHelper.
	; This causes the function to run multiple times, and so the following global keeps the smart level from being spoken multiple times on first key press of this script. 
	; Subsequent presses of the key run only VirtualPromptAndTextHelper like they did in prior versions of JAWS,
	; which clears when any other key gets pressed.
		giSpeakSmartNavLevel = (g_smartNavMax > 0)
	endIf
	return true ; don't change the Smart Nav Level but allow to run.
elif ShouldNavigateAndAdjustSmartNavLevelIfNeeded(scriptName) then
	return DoSmartNavigation(scriptName)
else
; the following should probably be moved to the beginning of this hook function
; but those of us unfamiliar with the intricacies of the code
; Aren't comfortable making that decision at this time
; Calling the built-in functions inside tableStatusChanged()
; cause sluggish keyboard response in certain windows
; that use NavAreaClassic

if ( ! IsVirtualPCCursor()
|| getJCFOption( optSmartNavigation ) <= 0 )
return true;
EndIf

	if tableStatusChanged() then
		RestoreSmartNavLevel()
	else
		IncrementSmartNavLevel()
	endIf
	return True
endIf
EndFunction

Int Function DoSmartTableNavIfNeeded (string ScriptName)
var
int navType=0
if (GetJCFOption(optSmartNavigation) &smartNavTables)==0 then
	return false
endIf
if !IsVirtualPCCursor() then
	return false
endIf
if !builtin::inTableCell() then
	return false
endIf
if scriptName=="sayPriorCharacter" then
	navType=UnitMove_prior
elif scriptName=="sayNextCharacter" then
	navType=UnitMove_Next
elif scriptName=="sayNextLine" then
	navType=UnitMove_down
elif scriptName=="sayPriorLine" then
	navType=UnitMove_up
elif scriptName=="JAWSHome" then
	navType=UnitMove_First 
elif scriptName=="JAWSEnd" then
	navType=UnitMove_Last
endIf
if navType then
	return SayCellUnitEx(navType, false, true)
endIf
return false
EndFunction


Void Function ClearPriorCellData ()
priorSmartNavInTableCell=0
priorSmartNavTableNestingLevel=0
EndFunction

Int Function tableStatusChanged ()
var
int inTableCell=builtin::InTableCell(),
int tableNestingLevel =GetTableNestingLevel()
if priorSmartNavInTableCell !=inTableCell || priorSmartNavTableNestingLevel != tableNestingLevel then 
	priorSmartNavInTableCell=inTableCell
	priorSmartNavTableNestingLevel=tableNestingLevel
return true
endIf
return false
EndFunction

Script SetSmartNavLevel ()
var
int level=GetJCFOption(optSmartNavigation)

if level==smartNavControlsAndTables then
	level=smartNavOff
else
	level=level+1
endIf
g_smartNavMax = level
setJCFOption(optSmartNavigation, level)
if level==smartNavOff then
	SayMessage(OT_JAWS_MESSAGE, cmsgSmartNavOff)
elif level==smartNavControls then
	SayMessage(OT_JAWS_MeSSAGE, cmsgSmartNavControls)
	elif level==smartNavTables then
	SayMessage(OT_JAWS_MeSSAGE, cVMSGTable)
elif level==smartNavControlsAndTables then
	SayMessage(OT_JAWS_MESSAGE, cmsgSmartNavControlsAndTables)
endIf   
EndScript

; Return the on disk rather than in memory setting
; That way, we know what the limit should be when adjusting it 
; Note! This should only be called immediately after a JCF is loaded from disk.
; Currently it is called on configuration change and in autostart.
int function GetSmartNavMaxOnJCFLoad()
return getJCFOption(optSmartNavigation) 
endFunction


void function ToggleSmartNavLevelAndResetDocPresentation()
var
	int level=GetJCFOption(optSmartNavigation),
	int DefaultLevel = GetDefaultJCFOption(optSmartNavigation),
	string message = null ()
if ! defaultLevel then
	defaultLevel = smartNavControlsAndTables
endIf
if level != smartNavOff then
	level = smartNavigationReset ; Special value for internal use to reset Doc Presentation to user's preference.
	g_smartNavMax = smartNavOff ; Do not need to use special value in scripts. 
	message = cmsgSmartNavOff
else
	level = defaultLevel
	if level == smartNavControlsAndTables then
		message = cmsgSmartNavControlsAndTables
	elif level==smartNavTables then
	message = cVMSGTable
	else
		message = cmsgSmartNavControls
	endIf
	g_smartNavMax = level 
endIf
setJCFOption(optSmartNavigation, level)
giSpeakSmartNavLevel = true
message = formatString (cmsgSmartNavigationSetting, message)
SayMessage (OT_USER_REQUESTED_INFORMATION, message)
EndFunction

