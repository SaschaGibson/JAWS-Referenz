; Copyright (C) 2022 Freedom Scientific Inc.
; Notification History script file

include "HJConst.jsh"
include "HJGlobal.jsh"
include "MSAAConst.jsh"
include "Common.jsm"
include "NotificationViewer.jsm"
import "uia.jsd"

const
	AutomationID_HistoryList = "HistoryList",
	AutomationID_EnableRulesCheckbox = "EnableRulesCheckbox",
	AutomationID_CreateRuleButton = "CreateRuleButton",
	AutomationID_ManageRulesButton = "ManageRulesButton",
	AutomationID_ClearHistoryButton = "ClearHistoryButton",
	AutomationID_RulesList = "RulesList",
	AutomationID_ModifyRuleButton = "ModifyRuleButton",
	AutomationID_DeleteRuleButton = "DeleteRuleButton",
	AutomationID_RenameRuleButton = "RenameRuleButton",
	AutomationID_ToggleRuleStateButton = "ToggleRuleStateButton",
	AutomationID_MoveRuleUpButton = "MoveRuleUpButton",
	AutomationID_MoveRuleDownButton = "MoveRuleDownButton",
	AutomationID_RuleTypeComboBox = "RuleTypeComboBox",
	AutomationID_ContainsTextbox = "ContainsTextBox",
	AutomationID_ApplicationSpecificCheckbox = "AppSpecificCheckBox",
	AutomationID_SpeechAndSoundsActionComboBox = "SpeechActionComboBox",
	AutomationID_SpeechShortenTextbox = "SpeechShortenTextBox",
	AutomationID_PreviewSpeechResultsButton = "SpeechPreviewResultsButton",
	AutomationID_SoundPathTextbox = "SoundPathTextBox",
	AutomationID_SelectSoundButton = "SelectSoundButton",
	AutomationID_PlaySoundButton = "PlaySoundButton",
	AutomationID_BrailleActionComboBox = "BrailleActionComboBox",
	AutomationID_BrailleShortenFlashTextBox = "BrailleShortenTextBox",
	AutomationID_PreviewBrailleResultsButton = "BraillePreviewResultsButton",
	AutomationID_ExampleNotificationTextBox = "ExampleNotificationTextBox",
	AutomationID_NotificationTextBox = "NotificationTextBox",
	AutomationID_ExcludeFromHistoryCheckbox = "ExcludeFromHistoryCheckBox",
	AutomationID_RuleNameTextBox = "RuleNameTextBox"
	
const
	; These keystrokes are the same for each locale, which is why the constants are located here.
	ksMoveItemDown = "Control+Shift+DownArrow",
	ksMoveItemUp = "Control+Shift+UpArrow"
	
globals
	; We need to know if we're moving a rule in the list, so we can announce the position as the rule gets moved
	int g_MovingRule
	
Void Function SayFocusedObject ()
if IsZoomTextRunning ()
&& getObjectRole () == ROLE_SYSTEM_WINDOW then
; Fusion is running and temporarily the top window has focus,
; causing its name to repeat multiple times.
	return
endIf
sayFocusedObject ()
endFunction

script ScriptFileName()
ScriptAndAppNames(msgNotificationViewerAppName)
EndScript

script ScreenSensitiveHelp()
var
	string currentObjectAutomationID = GetObjectAutomationID(),
	string parentObjectAutomationID = GetObjectAutomationID(1)
If UserBufferIsActive () || InHJDialog() || GlobalMenuMode then
	PerformScript ScreenSensitiveHelp()
	Return
EndIf
if currentObjectAutomationID == AutomationID_HistoryList
	|| parentObjectAutomationID == AutomationID_HistoryList then
	ShowScreenSensitiveHelp(msgNotificationViewer_HistoryListScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationId_EnableRulesCheckbox then
	ShowScreenSensitiveHelp(msgNotificationViewer_EnableRulesCheckboxScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_CreateRuleButton then
	ShowScreenSensitiveHelp(msgNotificationViewer_CreateRuleButtonScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_ManageRulesButton then 
	ShowScreenSensitiveHelp(msgNotificationViewer_ManageRulesButtonScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_ClearHistoryButton then
	ShowScreenSensitiveHelp(msgNotificationViewer_ClearHistoryButtonScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_RulesList
	|| parentObjectAutomationID == AutomationID_RulesList then
	ShowScreenSensitiveHelp(msgNotificationViewer_RulesListScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_ModifyRuleButton then
	ShowScreenSensitiveHelp(msgNotificationViewer_ModifyRuleButtonScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_DeleteRuleButton then
	ShowScreenSensitiveHelp(msgNotificationViewer_DeleteRuleButtonScreenSensitiveHelp)
elIf currentObjectAutomationID == AutomationID_RenameRuleButton then
	ShowScreenSensitiveHelp(msgNotificationViewer_RenameRuleButtonScreenSensitiveHelp)
elIf currentObjectAutomationID == AutomationID_ToggleRuleStateButton then
	ShowScreenSensitiveHelp(msgNotificationViewer_ToggleRuleStateButtonScreenSensitiveHelp)
elIf currentObjectAutomationID == AutomationID_MoveRuleUpButton then
	ShowScreenSensitiveHelp(msgNotificationViewer_MoveRuleUpButtonScreenSensitiveHelp)
elIf currentObjectAutomationID == AutomationID_MoveRuleDownButton then
	ShowScreenSensitiveHelp(msgNotificationViewer_MoveRuleDownButtonScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_RuleTypeComboBox then
	ShowScreenSensitiveHelp(msgNotificationViewer_RuleTypeComboBoxScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_ContainsTextbox then
	ShowScreenSensitiveHelp(msgNotificationViewer_ContainsTextboxScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_ApplicationSpecificCheckbox then
	ShowScreenSensitiveHelp(msgNotificationViewer_ApplicationSpecificCheckboxScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_SpeechAndSoundsActionComboBox then
	ShowScreenSensitiveHelp(msgNotificationViewer_SpeechAndSoundsActionComboBoxScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_SpeechShortenTextbox then
	ShowScreenSensitiveHelp(msgNotificationViewer_SpeechShortenTextboxScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_PreviewSpeechResultsButton then 
	ShowScreenSensitiveHelp(msgNotificationViewer_PreviewSpeechResultsButtonScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_SoundpathTextbox then
	ShowScreenSensitiveHelp(msgNotificationViewer_SoundPathTextboxScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_SelectSoundButton then
	ShowScreenSensitiveHelp(msgNotificationViewer_SelectSoundButtonScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_PlaySoundButton
	ShowScreenSensitiveHelp(msgNotificationViewer_PlaySoundButtonScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_BrailleActionComboBox then
	ShowScreenSensitiveHelp(msgNotificationViewer_BrailleActionComboBoxScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_BrailleShortenFlashTextbox then
	ShowScreenSensitiveHelp(msgNotificationViewer_BrailleShortenFlashTextboxScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_PreviewBrailleResultsButton then
	ShowScreenSensitiveHelp(msgNotificationViewer_PreviewBrailleResultsButton)
elif currentObjectAutomationID == AutomationID_ExampleNotificationTextBox
	ShowScreenSensitiveHelp(msgNotificationViewer_ExampleNotificationTextBoxScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_ExcludeFromHistoryCheckbox then
	ShowScreenSensitiveHelp(msgNotificationViewer_ExcludeFromHistoryCheckboxScreenSensitiveHelp)
elIf currentObjectAutomationID == AutomationID_RuleNameTextBox then
	ShowScreenSensitiveHelp(msgNotificationViewer_RenameRuleTextBoxScreenSensitiveHelp)
else
	PerformScript ScreenSensitiveHelp()
endIf

endScript

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName, int drawHighLight)
if nLevel == 0
&& GetObjectAutomationId (0) == AutomationID_NotificationTextBox
	IndicateControlType (WT_READONLYEDIT, GetObjectName (), FSUIAGetFocusedDocumentTextRangeText ())
	return
endIf
SayObjectTypeAndText(nLevel, includeContainerName, drawHighLight)
EndFunction

string function FindHotKey(optional string ByRef sPrompt)
var
	int iType,
	string sHotKey = FindHotKey(sPrompt)
if sHotKey
	return sHotKey
endIf
iType = GetObjectSubTypeCode(false, 0)
if iType == WT_COMBOBOX
	iType = GetObjectSubTypeCode(false, 1)
	if iType == WT_GROUPBOX
		sHotKey = FSUIAGetParentOfElement(FSUIAGetFocusedElement()).accessKey
	endIf
endIf
return sHotKey
EndFunction

script MoveCurrentItemUp()

g_MovingRule = 1
TypeKey(ksMoveItemUp)

EndScript

script MoveCurrentItemDown()

g_MovingRule = 1
TypeKey(ksMoveItemDown)

EndScript

script PressMoveUpButton()

g_MovingRule = 1
TypeKey(ksPressMoveUpButton)

EndScript

script PressMoveDownButton()

g_MovingRule = 1
TypeKey(ksPressMoveDownButton)

EndScript

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)	

var 
	string currentObjectAutomationID = GetObjectAutomationID(),
	string parentObjectAutomationID = GetObjectAutomationID(1)
if (currentObjectAutomationID == AutomationID_RulesList
	|| parentObjectAutomationID == AutomationID_RulesList)
	&& g_MovingRule == 1 then
	var string PositionInGroup = PositionInGroup()
	Say(positionInGroup, OT_Position)
	Say(GetObjectName(), OT_CONTROL_NAME)
	g_MovingRule = 0
	return
endIf
ActiveItemChangedEvent(curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
	
	EndFunction
