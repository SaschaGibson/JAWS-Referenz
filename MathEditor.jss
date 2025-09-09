; JAWS script file for the FS Braille Math Editor

include "HjConst.jsh"
include "HjGlobal.jsh"
include "common.jsm"
include "MathEditor.jsh"
include "MathEditor.jsm"

globals
	int gSavedOptBrailleInputAsUnicodeBraille,
	int gIsBrailleMathEnabled

script ScriptFileName()
ScriptAndAppNames(msgMathEditorAppFileName)
EndScript

void function AutoStartEvent()
gSavedOptBrailleInputAsUnicodeBraille = GetJCFOption(OPT_BRL_INPUT_AS_UNICODE_BRAILLE)
gIsBrailleMathEnabled = false
EndFunction

void function AutoFinishEvent()
DisableBrailleMathSettings()
EndFunction

void function PreProcessFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
if (IsFocusInBrailleMathEquationEdit())
	gIsBrailleMathEnabled = true
	EnableBrailleMathSettings()
elif (gIsBrailleMathEnabled == true)
	gIsBrailleMathEnabled = false
	DisableBrailleMathSettings()
endIf
PreProcessFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction

void function EnableBrailleMathSettings()
SetJCFOption(OPT_BRL_INPUT_AS_UNICODE_BRAILLE, 1)
EndFunction

void function DisableBrailleMathSettings()
SetJCFOption(OPT_BRL_INPUT_AS_UNICODE_BRAILLE, gSavedOptBrailleInputAsUnicodeBraille)
EndFunction

int function BrailleCallbackObjectIdentify()
; Force JAWS to identify the Equation Edit field as single line
if (IsFocusInBrailleMathEquationEdit())
	return WT_EDIT
endIf
return BrailleCallbackObjectIdentify()
endFunction

Script ScreenSensitiveHelp()
if (IsFocusInBrailleMathEquationEdit())
	ShowScreenSensitiveHelp(msgScreenSensitiveHelp_MathEditor_EquationEdit)
elif (IsFocusOnAcceptButton())
	ShowScreenSensitiveHelp(msgScreenSensitiveHelp_MathEditor_AcceptButton)
else
	PerformScript ScreenSensitiveHelp()
endIf
EndScript

string function GetCustomTutorMessage()
if (IsFocusInBrailleMathEquationEdit())
	return msgTutorHelp_MathEditor_EquationEdit;
else
	return GetCustomTutorMessage()
endIf
EndFunction

int function IsFocusInBrailleMathEquationEdit()
var
	string automationId
Let automationId = getObjectAutomationID()
if (automationId == EquationEditAutomationId)
	return true
endIf
return false
endFunction

int function IsFocusOnAcceptButton()
var
	string automationId
Let automationId = getObjectAutomationID()
if (automationId == AcceptButtonAutomationId)
	return true
endIf
return false
endFunction
