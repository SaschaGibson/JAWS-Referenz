use "chrome.jss"

include "HjConst.jsh"
include "Slack.jsm"


void function AutoStartEvent()
ShowSoundMixerDiscoveryDialog()
EndFunction

Void Function GetTextInfoForControlBackSpace (string ByRef text)
text = GetPriorWord (FALSE)
EndFunction

Script ControlBackSpace ()
var	string sText
GetTextInfoForControlBackSpace(sText)
if sText
	SayMessage(ot_line,sText)
endIf
TypeCurrentScriptKey ()
EndScript

script ScriptFileName()
ScriptAndAppNames(msgConfigName)
EndScript

script WindowKeysHelp ()
Say (msgSlackWindowKeysHelp, OT_USER_REQUESTED_INFORMATION)
endScript
