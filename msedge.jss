;Copyright 2020-2022, Freedom Scientific, Inc.
;Scripts for Microsoft Edge with Chromium

include "HJConst.jsh"
include "MSAAConst.jsh"
include "HjHelp.jsh"; for help topic ID
include "chrome.jsm"
include "UIA.jsh"
include "ie.jsm"

import "UIA.jsd"
use "chrome.jsb"

const
	appBarClass = "ToolbarView"

messages
; anything goes here that should be filtered out of UIANotificationEvent, if the string is found in the Activity ID string parameter.
@NotificationsFilterByActivityID
ToolbarButtonRemoved
@@
endMessages

string function GetBrowserName()
return msgEdgeAppName
EndFunction

int Function HandleFocusInTreeview(handle currentWindow,int changeDepth)
; overwrite from IA2Browser, 
; tends to repeat too much when in the favorites (Control+Shift+O) tree view.
; This overwrite is a complete copy with modifications to the existing functionality.
if (changeDepth < 1) then
	return false
EndIf
if (!IsBrowserContentWindow(currentWindow)) then
	return false
EndIf
var
	int type
let type = GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0)
if (type != WT_TREEVIEWITEM) then
	return false
EndIf
var
	int treeLevel
let treeLevel = FindAncestorOfType (WT_TREEVIEW)
if (treeLevel > changeDepth) then
	return false
EndIf
var
	int role,
	int level
let level = changeDepth
while (level >= treeLevel)
	role = getObjectRole (level)
		if role != 1060
		&& role != ROLE_SYSTEM_WINDOW then
		SayObjectTypeAndText (level)
	endIf
	let level = level-1
EndWhile
SayObjectTypeAndText (0)
return true
EndFunction

void function UIANotificationEvent(int notificationKind, int notificationProcessing, string displayString, string activityId, string appName)
if stringContains (NotificationsFilterByActivityID, activityId) return endIf
UIANotificationEvent(notificationKind, notificationProcessing, displayString, activityId, appName)
endFunction

const 
scAdobeDLL = "AcroRd32.dll",
scAdobeClass = "AVL_AVView"

; Check if focus is in the adobe plugin 
Int Function inAdobeWindow ()
var
        string sOwner,
        string sClass,
handle hWnd

hWnd = GetCurrentWindow ()
sClass  = GetWindowClass(hWnd)

if StringCompare(sClass, scAdobeClass, False) != 0 then
	return false 
endIf

sOwner = GetWindowOwner(hWnd)

return StringCompare(sOwner, scAdobeDLL, FALSE) == 0
EndFunction

Void Function DocumentLoadedEvent ()
; Avoid Adobe plugin instability bug SSA
if (not inAdobeWindow ()) then
	AnnounceImmersiveReader()
EndIf

DocumentLoadedEvent()
EndFunction

object Function FindAppBar()
if inAdobeWindow () then return Null() EndIf
var object appElement = FSUIAGetElementFromHandle(GetAppMainWindow (GetCurrentWindow()))
if (!appElement)
	return Null()		
EndIf

var object typeCondition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_ToolbarControlTypeId)
var object landmarktypeCondition = FSUIACreateIntPropertyCondition(UIA_LandmarkTypePropertyId, UIA_NavigationLandmarkTypeId)
var object classNameCondition = FSUIACreateStringPropertyCondition(UIA_ClassNamePropertyId,appBarClass) 
var object andCondition = FSUIACreateAndCondition( typeCondition, landmarkTypeCondition)
var object combinedCondition = FSUIACreateAndCondition( andCondition, classNameCondition)
if (!typeCondition 
|| !LandmarkTypeCondition
|| !andCondition
|| !combinedCondition)
	return Null()		
EndIf
	
var object toolbar = appElement.FindFirst(TreeScope_Subtree, combinedCondition)
return toolbar
EndFunction

object Function FindImmersiveReaderButton()
var object appBarElement = FindAppBar()
if (!appBarElement)
	return Null()		
EndIf

var object typeCondition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_ButtonControlTypeId)
if (!typeCondition )
	return Null()		
EndIf
	
var object buttons = appBarElement.FindAll(TreeScope_Subtree, typeCondition)
if (!buttons || !buttons.count)
	return Null()		
EndIf

var int count = (buttons.count)-1
var string buttonName
var int i
var object immerssiveReaderButton = Null()		
for i = 0 to count
	buttonName = buttons(i).name
	buttonName = StringLower (buttonName)
	if (StringContains (buttonName, cEnterImmersiveReader))
		immerssiveReaderButton = buttons(i)
		return immerssiveReaderButton 
	EndIf
EndFor

return Null()		
EndFunction

Void Function AnnounceImmersiveReader()
if (!FindImmersiveReaderButton())
	return
EndIf
	
SayUsingVoice (VCTX_MESSAGE, msgImmersiveReader,ot_JAWS_message)
EndFunction

void function AnnounceNewTabOrPageFromBrowserTabChangedEvent(handle hWnd)
if NewBrowserTabIsNewPage(hWnd)
	;When Control+N is used, a new window opens and the focus change will speak the focused object.
	;Also, a UIA notification event will announce that a new page is opening.
	return
endIf
;When Control+T is used, a new tab is created but the focus does not change so we should announce the focused object.
SayFormattedMessage(ot_screen_message, msgNewTabPage)
SayObjectTypeAndText()
EndFunction

Script ScreenSensitiveHelp ()
if IsSameScript () 
	AppFileTopic (topic_MicrosoftEdge )
	return
endIf
PerformScript ScreenSensitiveHelp ()
EndScript
