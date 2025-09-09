;Script file for installer IUser.dll

Include "HJGlobal.JSH"
Include "HJConst.JSH"
Include "Common.JSM"
Include "iuser.jsm"


Script ScriptFileName ()
ScriptAndAppNames (msgScriptKeyHelp1)
EndScript

int Function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
Var
	Int iState
if UserBufferIsActive() then
	return ProcessSpaceBarKeyPressed(nKey,strKeyName,nIsBrailleKey,nIsScriptKey) ; default
endIf
If KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
	If GetWindowClass(GetFocus()) == cwc_SysTreeView32
	&& !InHJDialog() then
		Pause ()
		let iState = GetControlAttributes()
		if iState == CTRL_PARTIALLY_CHECKED then
			Say(cMSG_PartiallyChecked,ot_line)
		ElIf iState == CTRL_CHECKED then
			Say(cMSG_checked,ot_line)
		ElIf iState == CTRL_UNCHECKED then
			Say(cmsg_notchecked,ot_line)
		EndIf
		return true
	EndIf
EndIf
return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey) ;default
EndFunction
