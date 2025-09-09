;Copyright 2018 Freedom Scientific, Inc.
;Freedom Scientific script file for Windows 10 People Hub

include "hjConst.jsh"
include "hjGlobal.jsh"
include "UIA.jsh"
include "common.jsm"
include "PeopleExperienceHost.jsm"

const
	AutomationID_learnMoreHyperLink = "learnMoreHyperLink"
globals
	object fsUIA_PeopleExperienceHost,
	object fsUIA_PeopleExperienceHost_Treewalker


void function AutoStartEvent()
InitPeopleExperienceHost()
EndFunction

void function AutoFinishEvent()
fsUIA_PeopleExperienceHost = Null()
fsUIA_PeopleExperienceHost_Treewalker = Null()
EndFunction

void function InitPeopleExperienceHost()
if (fsUIA_PeopleExperienceHost && fsUIA_PeopleExperienceHost_Treewalker) return endIf
fsUIA_PeopleExperienceHost = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !fsUIA_PeopleExperienceHost return endIf
fsUIA_PeopleExperienceHost_Treewalker = fsUIA_PeopleExperienceHost.RawViewWalker()
if !fsUIA_PeopleExperienceHost_Treewalker
	fsUIA_PeopleExperienceHost = Null()
endIf
EndFunction

int function IsGetStartedButton()
if UserBufferIsActive() return false endIf
SaveCursor()
PCCursor()
var int type = GetObjectSubtypeCode()
RestoreCursor()
if  (type != wt_button) return false endIf
var object element = fsUIA_PeopleExperienceHost.GetFocusedElement()
if !element return false endIf
fsUIA_PeopleExperienceHost_Treewalker.currentElement = element
fsUIA_PeopleExperienceHost_Treewalker.gotoNextSibling()
return fsUIA_PeopleExperienceHost_Treewalker.currentElement.automationID == AutomationID_learnMoreHyperLink
EndFunction

string function GetStaticTextPreceedingButton()
var object element = fsUIA_PeopleExperienceHost.GetFocusedElement()
if (element.controlType != UIA_ButtonControlTypeID) return endIf
fsUIA_PeopleExperienceHost_Treewalker.currentElement = element
var string sText, string s
while fsUIA_PeopleExperienceHost_Treewalker.gotoPriorSibling() && fsUIA_PeopleExperienceHost_Treewalker.currentElement.controlType == UIA_TextControlTypeID
	s = fsUIA_PeopleExperienceHost_Treewalker.currentElement.name
	sText = s+cscBufferNewLine+sText
endWhile
return sText
EndFunction

string function GetTabControlPositionInGroup()
if UserBufferIsActive() return cscNull endIf
SaveCursor()
PCCursor()
var int type = GetObjectSubtypeCode()
RestoreCursor()
if  (type != wt_TabControl) return false endIf
var object element = fsUIA_PeopleExperienceHost.GetFocusedElement()
if (element.controlType != UIA_TabItemControlTypeID) return endIf
var int x = element.positionInSet
var int y = element.sizeOfSet
if !x || !y return cscNull endIf
return FormatString(cmsgPosInGroup1, IntToString(x), IntToString(y))
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if nLevel == 0
	if IsGetStartedButton()
		Say(GetStaticTextPreceedingButton(),ot_dialog_text)
	endIf
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
if nLevel == 0
&& GetObjectSubtypeCode() == wt_TabControl
	var string posInfo = GetTabControlPositionInGroup()
	if posInfo
		Say(posInfo,ot_position)
	endIf
endIf
EndFunction

int function BrailleAddObjectPosition(int nSubtype)
if nSubtype == wt_TabControl
	var string posInfo = GetTabControlPositionInGroup()
	if posInfo
		BrailleAddString(posInfo,0,0,0)
		return true
	endIf
endIf
return BrailleAddObjectPosition(nSubtype)
EndFunction

int function BrailleAddObjectDescription(int nSubtype)
if nSubtype == wt_button
&& IsGetStartedButton()
	BrailleAddString(GetStaticTextPreceedingButton(),0,0,0)
	return true
endIf
return BrailleAddObjectDescription(nSubtype)
EndFunction

script ScriptFileName()
ScriptAndAppNames(msgPeopleExperienceHostAppName)
EndScript

int function SayByTypeForScriptSayLine()
if GetObjectSubtypeCode() == wt_TabControl
	SayObjectTypeAndText()
	return true
endIf
return SayByTypeForScriptSayLine()
EndFunction
