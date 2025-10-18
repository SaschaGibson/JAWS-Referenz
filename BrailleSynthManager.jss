Include "HjConst.jsh";HjConstants
Include "HjGlobal.jsh";common global variables.
Include "common.jsm";Common string literals

int Function HandleCustomWindows (handle hWnd)
var
	int iType,
	string sWinName
If GlobalMenuMode ||
UserBufferIsActive () ||
IsVirtualPcCursor () then
	Return HandleCustomWindows (hWnd)
EndIf
Let iType = GetWindowSubtypeCode (hWnd)
If (! InHjDialog () &&
iType == WT_READONLYEDIT) then
	;This ensures that name doesn't speak twice.
	;Actually, it ensures that Group box name does not speak as window name.
	Let sWinName = GetWindowName (hWnd)
	If GetWindowSubtypeCode (GetPriorWindow (hWnd)) == WT_GROUPBOX then
		IndicateControlType (iType, sWinName)
		Return TRUE
	EndIf
EndIf
Return HandleCustomWindows (hWnd)
EndFunction
