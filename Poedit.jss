; Copyright 2015 Freedom Scientific, Inc.
; Freedom Scientific script file for PoEdit

include "hjConst.jsh"
include "hjGlobal.jsh"
Include "common.jsm" ; message file

int Function IsMainWindow()
var
	HANDLE foregroundWindow,
	HANDLE firstChildWindow,
	string firstChildWindowClass
foregroundWindow = GetForegroundWindow()
firstChildWindow = GetFirstChild(foregroundWindow)
firstChildWindowClass = GetWindowClass(firstChildWindow)
If (firstChildWindowClass == cWc_Toolbar)
	return True
EndIf
return False
EndFunction

void function UnitMoveControlNav(int UnitMovement)
var
	int TheTypeCode,
	int MenuMode
MenuMode = GlobalMenuMode
If (!IsPCCursor() || IsTouchCursor() || UserBufferIsActive() || MenuMode)
	UnitMoveControlNav(UnitMovement)
	return
EndIf
TheTypeCode = GetObjectSubTypeCode()
if ((TheTypeCode != WT_READONLYEDIT && TheTypeCode != WT_MULTILINE_EDIT) || !IsMainWindow())
	UnitMoveControlNav(UnitMovement)
	return
EndIf
if UnitMovement == UnitMove_Next then
	TypeKey(cksControlDownArrow)
ElIf UnitMovement == UnitMove_Prior then
	TypeKey(cksControlUpArrow)
EndIf
SayLine()
return
EndFunction
