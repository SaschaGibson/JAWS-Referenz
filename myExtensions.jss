;Additional use statements for your custom files go here:
;This will allow you to benefit from automatic updates to Default,
;without having to reinstall your script add-ons.

include "hjConst.jsh"
include "hjGlobal.jsh"
include "common.jsm"

;use "myfiles.jsb";would be your use statement, subst myfiles for your filename
;By default, JAWS 13 and later will process a literal full string match when the == operator is used on strings.
;The pragma line can allow the == operator to work as it used to, e.g. partial comparison
;remove the first semicolon on next line
;;#pragma StringComparison partial


void function AutostartEvent ()
;every file gets loaded runs autostart,
;constructor / object pointers or whatever goes here
endFunction

void function autoFinishEvent ()
;every file gets unloaded runs autofinish,
;Destructor / unload your objects here
endFunction
