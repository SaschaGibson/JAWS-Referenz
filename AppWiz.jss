; JAWS script file for Vista Optional Windows Features
; Copyright 2010-2015 by Freedom Scientific Inc.


include "hjconst.jsh"
include "hjglobal.jsh"
include "common.jsm"
include "AppWiz.jsm"

script ScriptFileName()
ScriptAndAppNames(msgAppWizAppName)
EndScript

int Function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
If KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
	if GetObjectSubtypeCode() == wt_TreeView then
		if StringCompare(GetWindowName(GetRealWindow(GetFocus())),wn_WindowsFeatures) == 0 then
			Delay(1)
			IndicateControlState(wt_TreeViewItem,GetControlAttributes())
			Return true
		EndIf
	EndIf
EndIf
return ProcessSpaceBarKeyPressed(nKey,strKeyName,nIsBrailleKey,nIsScriptKey)
EndFunction
