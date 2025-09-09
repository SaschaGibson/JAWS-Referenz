;Copyright 1995-2016 Freedom Scientific, Inc.
; Skype For Business default companion header file

CONST
; Window Classes:
	wcLyncMainWindow = "CommunicatorMainWindow",
	wcLyncConversationWindow = "LyncConversationWindowClass",
	UIA_EventsHookObjectClass = "NetUIRicherLabel",
; Function prefix for event functions:	
	fn_prefix = "LyncWatchUIA_"

GLOBALS
	collection LyncConversationWindows,
	collection LyncConversationObjects,
	handle LyncUIAMainWindow,
	object LyncUIAMainWindowObject
