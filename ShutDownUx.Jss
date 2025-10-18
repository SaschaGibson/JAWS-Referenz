;Copyright 2016 Freedom Scientific, Inc.
;JAWS script file for Windows 10 ShutDown dialog

include "hjConst.jsh"
include "HJGlobal.jsh"
include "UIA.jsh"

import "touch.jsd"

int function TouchTapInvokeCurrentElement(optional int x, int y)
if g_UIATreeWalker.currentElement.GetInvokePattern()
&& g_UIATreeWalker.currentElement.controlType == UIA_ButtonControlTypeId
&& g_UIATreeWalker.currentElement.automationID == 1
&& !g_UIATreeWalker.currentElement.hasKeyboardFocus
	;This button does not respond to invoke unless it has focus,
	;so call doDefaultAction instead:
	if g_UIATreeWalker.currentElement.GetLegacyIAccessiblePattern().doDefaultAction()
		if x && y
			NotifyTouchInteraction(GetWindowAtPoint(x,y),x,y)
		endIf
		KillUIAObject()
		PlayTouchTapClickSound()
		return true
	endIf
EndIf
return TouchTapInvokeCurrentElement(x,y)
EndFunction
