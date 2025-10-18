; Copyright 2017 by Freedom Scientific, Inc.
; Freedomscientific scripts for the Windows 10 Microsoft Account sign in popup

include "hjConst.jsh"
include "hjGlobal.jsh"
include "UIA.jsh"
include "common.jsm"
import "UIA.jsd"

;Some functions for speaking customized announcements of specific fields optionally take one of the following SayEditableField constants:
const
	SayEditableFieldLine = 0,
	SayEditableFieldWord = 1,
	SayEditableFieldChar = 2

const
	automationID_UserName = "idUsernameTxt",
	automationID_Password = "idPasswordTxt"

const
	UIA_CloudExperienceHost_Prefix = "CloudExperienceHost"
globals
	object UIA_CloudExperienceHost,
	object UIA_CloudExperienceHost_Treewalker,
	object UIA_Focus


void function AutoStartEvent()
InitMicrosoftWindowsCloudExperienceHost()
EndFunction

void function AutoFinishEvent()
UIA_CloudExperienceHost = Null()
UIA_CloudExperienceHost_Treewalker = Null()
UIA_Focus = Null()
EndFunction

void function InitMicrosoftWindowsCloudExperienceHost()
UIA_CloudExperienceHost = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !ComAttachEvents(UIA_CloudExperienceHost,UIA_CloudExperienceHost_Prefix)
	UIA_CloudExperienceHost = Null()
	return
endIf
if !UIA_CloudExperienceHost.AddFocusChangedEventHandler()
	UIA_CloudExperienceHost = Null()
	return
endIf
UIA_Focus = UIA_CloudExperienceHost.GetFocusedElement().BuildUpdatedCache()
var object processCondition = UIA_CloudExperienceHost.CreateIntPropertyCondition(UIA_ProcessIdPropertyId, UIA_Focus.processID)
UIA_CloudExperienceHost_Treewalker = UIA_CloudExperienceHost.CreateTreeWalker(processCondition)
if !UIA_CloudExperienceHost_Treewalker
	UIA_CloudExperienceHost = Null()
	UIA_Focus = Null()
	return
endIf
SetCurrentElementToDeepestFocusElement(UIA_CloudExperienceHost,UIA_CloudExperienceHost_Treewalker)
if UIA_Focus != UIA_CloudExperienceHost_Treewalker.currentElement
	UIA_Focus = UIA_CloudExperienceHost_Treewalker.currentElement
endIf
EndFunction

void function CloudExperienceHostFocusChangedEvent(object element)
UIA_Focus = element
EndFunction

int function IsUserNameOrPasswordEditField()
var int type = GetObjectSubtypecode()
return (type == wt_edit && UIA_Focus.automationID == automationID_UserName)
	|| (type == wt_passwordEdit && UIA_Focus.automationID == automationID_Password)
EndFunction

string function GetDialogTextForFocusLink()
if (GetObjectSubtypeCode() != wt_link) return cscNull endIf
UIA_CloudExperienceHost_Treewalker.currentElement = UIA_Focus
if (!UIA_CloudExperienceHost_Treewalker.GotoPriorSibling() ) return cscNull endIf
if (UIA_CloudExperienceHost_Treewalker.currentElement.controlType != UIA_TextControlTypeId) return cscNull endIf
return UIA_CloudExperienceHost_Treewalker.currentElement.name
EndFunction

int function SayUserNameEditField(optional int SayType)
if UIA_Focus.automationID != automationID_UserName return false endIf
;Since MSAA will show the name string in the value if no text is in the field,
;or it may not yet be populated with the actual value,
;use UIA instead of MSAA to test if there really is a value:
UIA_Focus = UIA_Focus.buildUpdatedCache()
var string value = UIA_Focus.GetValuePattern().value
if !value
	if SayType == SayEditableFieldChar 
	|| SayType == SayEditableFieldWord
		Say(cmsgBlank1,ot_word)
	else ;SayEditableFieldLine:
		IndicateControlType(wt_edit,GetObjectName(),cmsgSilent)
	endIf
else
	if SayType == SayEditableFieldChar 
		SayCharacter()
	elif SayType == SayEditableFieldWord
		SayWord()
	else ;SayEditableFieldLine:
		IndicateControlType(wt_edit,GetObjectName(),value)
	endIf
endIf
return true
EndFunction

string function GetPasswordEditFieldValue()
if (GetObjectSubtypeCode() != wt_PasswordEdit) return cscNull endIf
;The only way to determine if anything has been entered into the password edit field is to look at the text range:
var object textPattern = UIA_Focus.GetTextPattern()
if (!textPattern) return cscNull endIf
var object range = textPattern.documentRange
if (!range) return cscNull endIf
var string value = range.getText(TextRange_NoMaxLength)
if value == UIA_Focus.name
	;Nothing is actually in the password edit field:
	return cscNull
endIf
;Since there is no reliable standard for what gets shown for hidden characters,
;JAWS reports all hidden characters as "*".
;We will do the same here for the sake of consistency.
;When password has text, there is one extra character in the value, so remove it.
return StringChopLeft(StringReplaceChars(value,value,"*"),1)
EndFunction

int function SayPasswordEditField(optional int SayType)
if (UIA_Focus.automationID != automationID_Password) return false endIf
;Don't announce the MSAA value if the field is empty,
;since the value is "Password" and this will sound like a duplication:
UIA_Focus = UIA_Focus.buildUpdatedCache()
var string value = GetPasswordEditFieldValue()
if !value
	if SayType == SayEditableFieldChar 
	|| SayType == SayEditableFieldWord
		Say(cmsgBlank1,ot_word)
	else ;SayEditableFieldLine:
		IndicateControlType(wt_passwordEdit,GetObjectName(),cmsgSilent)
	endIf
else
	if SayType == SayEditableFieldChar 
		SayCharacter()
	elif SayType == SayEditableFieldWord
		SayWord()
	else ;SayEditableFieldLine
		IndicateControlType(wt_passwordEdit,GetObjectName(),value)
	endIf
endIf
return true
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
if GetWindowClass(GetFocus()) != cwc_Windows_UI_Core_CoreComponentInputSource
	SayObjectTypeAndText(nLevel,includeContainerName)
	return
endIf
if (!UIA_Focus) InitMicrosoftWindowsCloudExperienceHost() endIf
var
	int levelType = GetObjectSubtypeCode(SOURCE_CACHED_DATA,nLevel),
	string levelValue = GetObjectValue(SOURCE_CACHED_DATA,nLevel),
	string levelName = GetObjectName(SOURCE_CACHED_DATA,nLevel),
	string name = GetObjectName(),
	string value = GetObjectValue()
if nLevel > 0
	if levelType == wt_dialog_page
		if !StringStartsWith(levelName,"https")
			;Only announce the page if the name isn't a URL string:
			Say(levelName,ot_dialog_text)
		endIf
		return
	elif (!levelName && (levelValue == name || levelValue == value))
	|| (!levelValue && levelName == name)
		;All of these conditions occur,
		;and will cause duplicated announcement if not suppressed:
		return
	endIf
elif nLevel == 0
	if levelType == wt_link
		;suppress the value, we don't want to speak the URL.
		;But if there is dialog text for the link, speak it.
		var string text = GetDialogTextForFocusLink()
		if text
			Say(text,ot_dialog_text)
		endIf
		IndicateControlType(wt_link,name,cmsgSilent)
		return
	elif levelType == wt_edit
	&& SayUserNameEditField()
		return
	elif levelType == wt_passwordEdit
	&& SayPasswordEditField()
		return
	endIf
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

script SayLine()
if isPCCursor()
&& GetWindowClass(GetFocus()) == cwc_Windows_UI_Core_CoreComponentInputSource
	SayObjectTypeAndText()
	return
endIf
PerformScript SayLine()
EndScript

script SayWord()
if isPCCursor()
&& GetWindowClass(GetFocus()) == Cwc_Windows_UI_Core_CoreComponentInputSource
	if SayUserNameEditField(SayEditableFieldWord)
	|| SayPasswordEditField(SayEditableFieldWord)
		return
	endIf
	SayObjectTypeAndText()
	return
endIf
PerformScript SayWord()
EndScript

script SayCharacter()
if isPCCursor()
&& GetWindowClass(GetFocus()) == cwc_Windows_UI_Core_CoreComponentInputSource
	if SayUserNameEditField(SayEditableFieldChar)
	|| SayPasswordEditField(SayEditableFieldChar)
		return
	endIf
	SayObjectTypeAndText()
	return
endIf
PerformScript SayCharacter()
EndScript

void function DoDelete()
if (!IsUserNameOrPasswordEditField()) return DoDelete() endIf
TypeKey(cksDelete)
delay (1)
var int type = GetObjectSubtypeCode()
if type == wt_edit
	;SayUserNameEditField allows us to report when the field becomes blank,
	;rather than reporting that the cursor is now on the first character of the field name:
	SayUserNameEditField(SayEditableFieldChar)
else
	;SayPasswordEditField allows us to report when the field becomes blank,
	;rather than reporting that it dyill contains hidden characters:
	SayPasswordEditField(SayEditableFieldChar)
endIf
EndFunction

void function DoBackSpace()
if (GetObjectSubtypeCode() != wt_PasswordEdit) return DoBackSpace() endIf
TypeKey(cksBackspace)
delay (1)
;SayPasswordEditField allows us to report when the field becomes blank,
;rather than reporting that it still contains hidden characters:
SayPasswordEditField(SayEditableFieldChar)
EndFunction

void function SayCharacterUnit(int UnitMovement)
if (!IsUserNameOrPasswordEditField()) return SayCharacterUnit(UnitMovement) endIf
var int type = GetObjectSubtypecode()
if type == wt_edit
	;Do special case handling of the user name edit field only if it is empty,
	;to prevent reporting that the field contains the first character of the field name:
	UIA_Focus = UIA_Focus.buildUpdatedCache()
	var string value = UIA_Focus.GetValuePattern().value
	if !value
		Say(cmsgBlank1,ot_word)
	else
		SayCharacterUnit(UnitMovement)
	endIf
	return
endIf
;SayPasswordEditField allows us to report when the field is blank,
;rather than reporting that it contains hidden characters:
SayPasswordEditField(SayEditableFieldChar)
EndFunction

script ScriptFileName()
var string appName = GetWin8AppWindowTitle()
if (!appName) appName = GetMetroAppName() endIf
ScriptAndAppNames(appName)
EndScript
