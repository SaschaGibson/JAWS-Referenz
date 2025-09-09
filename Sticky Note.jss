include "HJConst.jsH"
include "HJGlobal.jsh"
include "common.jsm"
include "sticky note.jsm"

const
	wc_StickyNotesNoteWindow = "Sticky_Notes_Note_Window"
globals
	int giParentPrevObjSubtype

void function ProcessSayRealWindowOnFocusChange(handle AppWindow, handle RealWindow, string RealWindowName, handle FocusWindow)
var
	int iParentObjSubtype
let iParentObjSubtype = GetObjectSubtypeCode(True,1)
if GetWindowClass(RealWindow) == wc_StickyNotesNoteWindow then
	if (iParentObjSubtype != giParentPrevObjSubtype || GetFocusChangeDepth() >= 0)
	&& iParentObjSubtype == wt_toolbar then
		IndicateControlType(wt_toolbar,cmsgSilent,cmsgSilent)
	EndIf
EndIf
let giParentPrevObjSubtype = iParentObjSubtype
ProcessSayRealWindowOnFocusChange(AppWindow,RealWindow,RealWindowName,FocusWindow)
EndFunction

script Enter()
if GetObjectSubtypeCode(true,1) == wt_toolbar
&& GetObjectSubtypeCode(true) == wt_button then
	SayCurrentScriptKeyLabel ()
	TypeKey(cksSpace)
	return
EndIf
EnterKey()
EndScript

Script ScriptFileName ()
ScriptAndAppNames(msgStikyNotAppName)
EndScript
