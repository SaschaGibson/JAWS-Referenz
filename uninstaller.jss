; AOL Uninstaller Scripts
; Needed to properly navigate in a custom ListBox that doesn't
; support MSAA.

include "hjconst.jsh"
include "hjglobal.jsh"

script ScriptFileName()
	ScriptAndAppNames("AOL Uninstaller")
EndScript
int function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
if !nIsScriptKey
&& KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey)
&& GetWindowClass(getfocus()) == "AolGridCtrl" then
	delay(1)
	SayLine()
EndIf
return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

void function SayLineUnit(int unitMovement, int bMoved)
	if (bMoved && GetWindowClass(getfocus()) == "AolGridCtrl") then
		SayLine()
		return
	else
		return SayLineUnit(unitMovement,bMoved)
	EndIf
EndFunction
