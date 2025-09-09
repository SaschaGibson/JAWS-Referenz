; Copyright 2023 by Freedom Scientific, Inc.
; Discord script file

include "HjConst.jsh"
include "common.jsm"
include "Discord.jsm"


script scriptFileName ()
scriptAndAppNames (msgConfigName)
endScript

script WindowKeysHelp ()
If UserBufferIsActive ()
	UserBufferDeactivate ()
EndIf
SayFormattedMessage (OT_USER_BUFFER, msgDiscordWindowKeysHelp, msgDiscordWindowKeysHelp)
endScript

Script DownCell ()
if !InTable ()
&& !inTableCell ()
&& GetCurrentScriptKeyName () == ksAltCtrlDownArrow
	TypeCurrentScriptKey ()
	return
endIf
PerformScript DownCell()
EndScript

Script UpCell ()
if !InTable ()
&& !inTableCell ()
&& GetCurrentScriptKeyName () == ksAltCtrlDownArrow
	TypeCurrentScriptKey ()
	return
endIf
PerformScript UpCell()
EndScript

script MoveToTopOfColumn ()
if !InTable ()
&& !inTableCell ()
&& GetCurrentScriptKeyName () == ksShiftAltCtrlUpArrow
	TypeCurrentScriptKey ()
	return
endIf
PerformScript MoveToTopOfColumn()
EndScript

script MoveToBottomOfColumn ()
if !InTable ()
&& !inTableCell ()
&& GetCurrentScriptKeyName () == ksShiftAltCtrlDownArrow
	TypeCurrentScriptKey ()
	return
endIf
PerformScript MoveToBottomOfColumn()
EndScript
