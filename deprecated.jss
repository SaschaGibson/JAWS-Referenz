; Copyright 1995-2015 by Freedom Scientific, Inc.
; Freedom Scientific deprecated script file

Include "hjconst.jsh" ; default HJ constants
Include "common.jsm" ; message file

globals
	collection functions

Void Function AutoStartEvent ()
let functions = new collection
let functions["IsApplicationModeAvailable"] = 0
let functions["IsApplicationModeOn"] = 0
let functions["IsInsideEmbeddedARIAApplication"] = 0
let functions["SetUseApplicationMode"] = 0
EndFunction

Void Function AutoFinishEvent ()
CollectionRemoveAll (functions)
EndFunction

Int Function HandleDeprecatedFunction (string scriptName)
if (!CollectionItemExists (functions, ScriptName)) then
	return false
EndIf

if (functions[scriptName]==1) then
	return true
EndIf

let functions[scriptName] = 1
var
	string message
let message = FormatString (cmsgDeprecatedFunctionV14, scriptName)
SayMessage(OT_ERROR,message)
BrailleMessage (message, 0, 5000)
return true
EndFunction
