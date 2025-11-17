;Script file for Acrobat Reader, same as full Acrobat product

function AutoStartEvent()
If GetProgramVersion (GetAppFilePath ()) >= 5 then
	SwitchToConfiguration ("Adobe Acrobat")
	Return
EndIf
EndFunction

