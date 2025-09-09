;Copyright 2023 Freedom Scientific, Inc.
; These are gutted versions of Word.jss. Those scripts had so much
;  that was Window class and Window name centric that they broke in
;  numerous ways.  when running in Windows device Application guard,
;  since when when in WDAG all we get is UIA info.  These scripts
;  currently do nothing other than identify themselves with JawsKey+q,
;  and stub out GetFrameTutorMessage.

include "HJConst.jsh"
include "common.jsm"
include "word.jsm"

Script ScriptFileName ()
ScriptAndAppNames(msgWordForWindowsWDAGAppName)
endScript

;This function isn't needed for Word, and in WDAG scenarios is costly
;because it requires getting the current cursor location which involves
;a cross-process call.
; This is a stub version that does nothing.
string function GetFrameTutorMessage(string frameName)
return cscNull
EndFunction
