; JAWS 6.0 script file for JAWS Taks LIst used by MSN Instant Messenger
; version 6.x
; Copyright 2010-2015 by Freedom Scientific BLV Group, LLC
include "common.jsm"
include "hjconst.jsh"
include "jtl.jsh"
include "jtl.jsm"


Void Function AutoStartEvent ()
if TaskCommand then
	if TaskCommand == 1 then
		SwitchToTask (TaskName1)
	ElIf TaskCommand == 2 then
		SwitchToTask (TaskName2)
	ElIf TaskCommand == 3 then
		SwitchToTask (TaskName3)
	ElIf  TaskCommand == 4 then
		SwitchToTask (TaskName4)
	ElIf  TaskCommand == 5 then
		SwitchToTask (TaskName5)
	ElIf TaskCommand == 6 then
		SwitchToTask (TaskName6)
	EndIf
	Let TaskCommand = 0
EndIf
EndFunction

String Function TrimTaskName (string strIn)
var
	int i
if StringLength (strIn) > 0 then
	Let i = StringContains (strIn, "  ")
	if i > 0 then
		; spaces found
		Let strIn = SubString (strIn, 1, i-1)
	EndIf
EndIf
return strIn
EndFunction

Function SwitchToTask (string name)
var
	string CurName
if StringLength (name) > 0 then
	SpeechOff()
	TypeString (name)
	Delay(3)
	Let CurName = TrimTaskName (GetLine ())
	if name == SubString (CurName, 1, StringLength (name)) then
	SpeechOn ()
	Pause ()
	SpeechOff ()
		; match found
		TypeKey (cksTab); Tab
		Pause()
		SpeechOn ()
		EnterKey ()
		return
	else
		TypeKey (cksEscape); esc
		SpeechOn ()
	EndIf
else
	SayMessage (OT_ERROR,MsgNoTaskAssigned)
	EndIf
EndFunction

Script AssignTask1 ()
Var
	string sMsg
Let TaskName1 = TrimTaskName (GetLine())
let sMsg = FormatString (MsgTaskAssigned,TaskName1 , "1")
SayFormattedMessage (OT_JAWS_MESSAGE, sMsg)
EndScript

Script AssignTask2 ()
Var
	string sMsg
Let TaskName2 = TrimTaskName (GetLine())
let sMsg = FormatString (MsgTaskAssigned, TaskName2 ,"2")
SayFormattedMessage (OT_JAWS_MESSAGE, sMsg)
EndScript

Script AssignTask3 ()
Var
	string sMsg
Let TaskName3 = TrimTaskName (GetLine())
let sMsg = FormatString (MsgTaskAssigned, TaskName3, "3")
SayFormattedMessage (OT_JAWS_MESSAGE, sMsg)
EndScript

Script AssignTask4 ()
Var
	string sMsg
Let TaskName4 = TrimTaskName (GetLine())
let sMsg = FormatString (MsgTaskAssigned, TaskName4, "4")
SayFormattedMessage (OT_JAWS_MESSAGE, sMsg)
EndScript







Script test ()
var
	string name

SwitchToTask (TaskName1)
EndScript
