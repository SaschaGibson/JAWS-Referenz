;Copyright 1997-2015 by Freedom Scientific Inc.
; JAWS script file for Dictionary Manager

include "hjconst.jsh"
include "common.jsm"
include "jdiction.jsm"

globals
	int JDictFirsttime ; to say auto start message only first time

Function AutoStartEvent ()
if !JDictFirstTime Then
let JDictFirstTime = 1
if getObjectClassName () == "Edit" then
; entered dictionary manager with no file, e.g. new file,
; control shift d doesn't work here but escape does.
	SayFormattedMessage (ot_app_start, msg1_NewFile_L, msg1_NewFile_S) ;"press control plus shift plus d to modify the default dictionary file"
else
	SayFormattedMessage (ot_app_start, msg1_L, msg1_S) ;"press control plus shift plus d to modify the default dictionary file"
endIf
EndIf ; first time
EndFunction

Script ScriptFileName ()
ScriptAndAppNames (MsgDictionaryManager)
EndScript

Script  HotKeyHelp()
var
	string RealWindowName
if TouchNavigationHotKeys() then
	return
endIf
let RealWindowName = GetWindowName (GetRealWindow(GetCurrentWindow()))
SaveCursor()
InvisibleCursor()
;fs1="Search for Entries"
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
If FindDescendantWindow (GetParent (GetFocus ()), 1003) Then
;if FindString (GetFocus (), fs1, S_TOP, S_UNRESTRICTED) then
;Main Screen
	SayFormattedMessage (OT_USER_BUFFER, msgHotKeyHelp1_L, msgHotKeyHelp1_S)
	UserBufferAddText (cScBufferNewLine, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
	UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
	RestoreCursor ()
	return
EndIf
if StringCompare(RealWindowName,wn_ChangeDictionaryDefinition) == 0 then
	SayFormattedMessage (OT_USER_BUFFER, msgHotKeyHelp2_L, msgHotKeyHelp2_S)
	UserBufferAddText (cScBufferNewLine, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
	UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
	RestoreCursor ()
	return
EndIf
if StringCompare(RealWindowName,wn_CorrectDictionaryDefinition) == 0 then
	SayFormattedMessage (OT_USER_BUFFER, msgHotKeyHelp3_L, msgHotKeyHelp3_S)
	UserBufferAddText (cScBufferNewLine, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
	UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
	RestoreCursor ()
	return
EndIf
if StringCompare(RealWindowName,wn_AddDictionaryDefinition) == 0 then
	SayFormattedMessage (OT_USER_BUFFER, msgHotKeyHelp4_L, msgHotKeyHelp4_S)
	UserBufferAddText (cScBufferNewLine, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
	UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
	RestoreCursor ()
	return
EndIf
GeneralJAWSHotKeys ()
EndScript

Script  SayActualWord()
var
	handle RealWindowHandle,
	string RealWindowName
let RealWindowHandle = GetRealWindow (GetFocus())
let RealWindowName = GetWindowName (RealWindowHandle)
if StringCompare(RealWindowName,wn_ChangeDictionaryDefinition) == 0 then
	SaveCursor()
	InvisibleCursor()
	MoveToControl (RealWindowHandle, 1027)
	SayFormattedMessage (OT_USER_REQUESTED_INFORMATION, msg2_L, msgSilent1) ;"Actual word"
	SayControl(GetCurrentWindow())
else
	TypeKey (ks1)
EndIf
EndScript

Script  SayCurrentRule()
var
	handle RealWindowHandle,
	string RealWindowName
let RealWindowHandle = GetRealWindow (GetFocus())
let RealWindowName = GetWindowName (RealWindowHandle)
if StringCompare(RealWindowName,wn_CorrectDictionaryDefinition) == 0 then
	SaveCursor()
	InvisibleCursor()
	MoveToControl (RealWindowHandle, 1030)
	SayFormattedMessage (OT_USER_REQUESTED_INFORMATION, msg3_L, msgSilent1) ;"Current Rule"
	SayControl(GetCurrentWindow())
	RestoreCursor()
else
	TypeKey (ks2)
EndIf
EndScript

int function SSHelpMainScreen(int ID)
if ID == 1000 then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp1_L, msgScreenSensitiveHelp1_S)
elif ID == 1001 then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp2_L, msgScreenSensitiveHelp2_S)
elif ID == 1002 then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp3_L, msgScreenSensitiveHelp3_S)
elif ID == 1003 then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp4_L, msgScreenSensitiveHelp4_S)
elif ID == 1004 then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp5_L, msgScreenSensitiveHelp5_S)
elif ID == 6 then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp24_L)
elif ID == 7 then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp25_L)
elif ID == 1044 then
	SayMessage (ot_user_buffer,sshmsg_DictionaryTreeView)
else
	return false
EndIf
AddHotKeyLinks ()
return true
EndFunction

int function SSHelpChangeDictionaryDefinition(int ID)
if ID == 1035 Then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp6_L, msgScreenSensitiveHelp6_S)
elif ID == 1024 Then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp7_L, msgScreenSensitiveHelp7_S)
elif ID == 1038 Then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp13_L, msgScreenSensitiveHelp13_S)
elif ID == 1040 Then
	SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelp16_L)
elif ID == 1041 Then
	SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelp17_L)
elif ID == 1043 Then
	SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelp18_L)
elif ID == 1036 Then
	SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelp19_L)
elif ID == 1045 then
	SayMessage (OT_USER_BUFFER,sshmsg_LanguageRuleComboBox)
elif ID == 1046 then
	SayMessage (OT_USER_BUFFER,sshmsg_SynthesizerRuleComboBox)
elif ID == 1047 then
	SayMessage (OT_USER_BUFFER,sshmsg_VoiceRuleComboBox)
elif ID == 1048 then
	SayFormattedMessage (OT_USER_BUFFER,sshmsg_CaseSensitiveCheckBox)
else
	return false
EndIf
AddHotKeyLinks ()
return true
EndFunction

int function SSHelpAddDictionaryDefinition(int ID)
if ID == 1007 then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp6_L, msgScreenSensitiveHelp6_S)
elif ID == 1008 then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp7_L, msgScreenSensitiveHelp7_S)
;elif ID == 1034 Then
elif ID == 1036 Then
	SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelp19_L)
elif ID == 1037 then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp13_L, msgScreenSensitiveHelp13_S)
elif ID == 1040 Then
	SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelp16_L)
elif ID == 1041 Then
	SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelp17_L)
elif ID == 1043 Then
	SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelp18_L)
elif ID == 1045 then
	SayMessage (OT_USER_BUFFER,sshmsg_LanguageRuleComboBox)
elif ID == 1046 then
	SayMessage (OT_USER_BUFFER,sshmsg_SynthesizerRuleComboBox)
elif ID == 1047 then
	SayMessage (OT_USER_BUFFER,sshmsg_VoiceRuleComboBox)
elif ID == 1048 then
	SayFormattedMessage (OT_USER_BUFFER,sshmsg_CaseSensitiveCheckBox)
else
	return false
EndIf
AddHotKeyLinks ()
return true
EndFunction

int function SSHelpCorrectDictionaryDefinition(int ID)
if ID == 1028 then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp9_L, msgScreenSensitiveHelp9_S)
elif ID == 1029 then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp10_L, msgScreenSensitiveHelp10_S)
else
	return false
EndIf
AddHotKeyLinks ()
return true
EndFunction

int function SSHelpAdvancedSettings(int ID)
if ID == 1546 Then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp14_L, msgScreenSensitiveHelp14_S)
elif ID == 1036 Then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp15_L, msgScreenSensitiveHelp15_S)
else
	return false
EndIf
AddHotKeyLinks ()
return true
EndFunction

int function SSHelpOpenSound(int ID)
if ID == 1002 Then
	SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelp20_L)
elif ID == 2039 Then
	SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelp21_L)
else
	return false
EndIf
AddHotKeyLinks ()
return true
EndFunction

int function SSHelpConfirmDictionaryEntriesDelete(int ID)
if ID == 6 then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp22_L)
elif ID == 7 then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp23_L)
else
	return false
EndIf
AddHotKeyLinks ()
return true
EndFunction

int function SSHelpOpenDictionary(int ID)
if id == 2039 then
	SayFormattedMessage (OT_USER_BUFFER,sshmsg_ImportButton)
else
	return false
EndIf
AddHotKeyLinks ()
return true
EndFunction

Script ScreenSensitiveHelp ()
var
	int ID,
	int iSubType,
	string RealWindowName
If UserBufferIsActive () then
	PerformScript ScreenSensitiveHelp()
	Return
EndIf
let ID = GetControlID (GetFocus())
let RealWindowName = GetWindowName (GetRealWindow(GetCurrentWindow()))
if StringCompare(StringRight(RealWindowName,StringLength(wn_MainScreen)),wn_MainScreen) == 0 then
	if SSHelpMainScreen(ID) then
		return
	EndIf
elif StringCompare(RealWindowName,wn_ChangeDictionaryDefinition) == 0 then
	if SSHelpChangeDictionaryDefinition(ID) then
		return
	EndIf
elif StringCompare(RealWindowName,wn_AddDictionaryDefinition) == 0 then
	if SSHelpAddDictionaryDefinition(ID) then
		return
	EndIf
elif StringCompare(RealWindowName,wn_CorrectDictionaryDefinition) == 0 then
	if SSHelpCorrectDictionaryDefinition(ID) then
		return
	EndIf
elif StringCompare(RealWindowName,wn_AdvancedSettings) == 0 then
	if SSHelpAdvancedSettings(ID) then
		return
	EndIf
elif StringCompare(RealWindowName,wn_OpenSound) == 0 then
	if SSHelpOpenSound(ID) then
		return
	EndIf
elif StringContains (RealWindowName,wn_ConfirmDictionaryEntriesDelete) Then
	if SSHelpConfirmDictionaryEntriesDelete(ID) then
		return
	EndIf
elif StringCompare(RealWindowName,wn_OpenDictionary) == 0 then
	if SSHelpOpenDictionary(ID) then
		return
	EndIf
EndIf
if ID == 1 then
	let iSubType = GetWindowSubTypeCode (GetFocus ())
	If iSubType == WT_BUTTON Then
		SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp11_L, msgScreenSensitiveHelp11_S)
		AddHotKeyLinks ()
		return
	ElIf iSubType == WT_LISTVIEW Then
		SayFormattedMessage (OT_USER_BUFFER, cmsgScreenSensitiveHelp40_L, cmsgScreenSensitiveHelp40_S)
		AddHotKeyLinks ()
		return
	EndIf
elif ID == 2 then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp12_L, msgScreenSensitiveHelp12_S)
	AddHotKeyLinks ()
	return
EndIf
PerformScript ScreenSensitiveHelp ()
EndScript

Script OpenDefaultFile ()
TypeKey (ks3)
pause()
Say(GetWindowName (GetAppMainWindow(GetFocus())), OT_DOCUMENT_NAME)
EndScript