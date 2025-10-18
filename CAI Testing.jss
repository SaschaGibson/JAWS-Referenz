;Copyright 2020-2021  by Cambium Assessment Inc
; Copyright 1995-2020 by Freedom Scientific, Inc.
; Domain Script file for CAI testing.
; ; 1. Prevent loading of utility programs.
; 2. Provide Braille info on first launch
; 3. When executable is secure browser enable secure mode and use Firefox configuration.
; 4.   SB  == Firefox 60 
; 5. Clear JAWS history on exit.
include"HJConst.jsh"
include "HJGlobal.jsh"
include "common.jsm"
include "CAI Testing.jsh"
include "CAI Testing.jsm"



void function autoStartEvent()
var
  int InSecureBrowser = CheckForCAISecureBrowser() ,
  int EnvChange =   (giCAIBrowserRun   != inSecureBrowser ),
  string sMessage 


if ( 2 == inSecureBrowser ) then  ; Generic browser mode switch to Firefox 
	switchToConfiguration ("firefox")
	return ; We will be right back after loading Firefox settings.
elif ( 3 == inSecureBrowser ) then ; Fully in Secure browser mode 
	sMessage = SecureWelcomeMessage
elif ( 1 == inSecureBrowser ) then  ; Non CAI Browser running 
	sMessage =  Welcome
	if ( 1 == CAIBrowserExit   )  then 
		envChange = 0 ; prevent speaking while exiting 
		CAIBrowserExit   = 0
	EndIf
EndIf

if ( true == EnvChange) then ; Speak announcement   
	say(sMessage,OT_APP_START) 
	SpeakBraileInfo ()
	EndIf
	
giCAIBrowserRun   = inSecureBrowser ; save browser type 
endFunction 

void function autoFinishEvent()
 CAIBrowserExit  = 1 
ClearSpeechHistory ()
endFunction

int function AreUtilitiesAllowed()
if ( 
  3!= CheckForCAISecureBrowser () ||
  QuickVerbosityKey ==  GetCurrentScriptKeyName ()
  ) Then
	return  true
EndIf 
	Say( UtilForbidden, OT_ERROR, false)
	return false 
EndFunction

; CheckForSecureBrowser () 
; This functions looks at the program name and determines if a CAI Secure Browser is running.
; It returns 1 if a standard browser is running
; 2 if the Secure browser is running, but the config is not firefox 
; 3 if config is firefox and we are running a secure browser. 
Int Function CheckForCAISecureBrowser ()
var 
  string    sAppName = StringLower (GetAppFileName ()),
  int isSecureBrowser = StringContains (sAppName, mCAISB) > 2, ;example: "casecurebrowser14.exe" 
  int isSecureTest = StringCompare (sAppName, mCAISTest, true) == 0,  ; securetest.exe 
  int FFConfig = 0 == StringCompare ( GetActiveConfiguration ( False ), "firefox" )

if ( isSecureTest || isSecureBrowser ) then 
	return FFConfig + 2 
else
	return 1
EndIf
EndFunction

string function GetBrowserName(optional int includeMaker)
var string sBrowserName =   GetBrowserName (includeMaker )
if ( 3 != giCAIBrowserRun    ) then 
	sBrowserName = sBrowserName + MSGCAIName 
else 
 	sBrowserName =   msgSecureTestAppName
EndIf
return sBrowserName 
EndFunction

Void Function SpeakBraileInfo ()
var int iBrailleActive = BrailleInUse ()

if iBrailleActive then
	Say ("You are working with a " + IntToString (BrailleGetCellCount ())+ " cell display", OT_APP_START)
	; below function seems to get UEB and EBAE reversed so comment out.
;Say ( BrailleGetTranslatorModeName (BrailleGetCurrentTranslatorMode ()), OT_APP_START , false)
EndIf
EndFunction
; Include several scripts that we want to block in secure browser 
Script PictureSmartWithControl ()
if (AreUtilitiesAllowed()) then 
PerformScript  PictureSmartWithControl ()
EndIF
EndScript

script ResearchItDefaultLookup ()
if (AreUtilitiesAllowed()) then 
PerformScript ResearchItDefaultLookup()
EndIF
EndScript

Script ResearchItByEnteringTerm ()
if (AreUtilitiesAllowed()) then 
PerformScript ResearchItByEnteringTerm()
EndIf
EndScript

Script ResearchIt ()
if (AreUtilitiesAllowed()) then 
PerformScript ResearchIt()
EndIf
EndScript


Script AbortFunction ()
beep()
EndScript

Script CopySpeechHistoryToClipboard()
if (AreUtilitiesAllowed()) then 
;PerformScript CopySpeechHistoryToClipboard)
EndIF
endScript

script ShowSpeechHistory()
if (AreUtilitiesAllowed()) then
PerformScript ShowSpeechHistory()
EndIf
EndScript
