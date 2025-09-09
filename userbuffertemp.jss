; JAWS v6.1
; Copyright 2002-2015 by Freedom Scientific BLV Group, LLC

; temporary functions for detecting which virtual buffer is available.

include "common.jsm"
include "hjConst.jsh"

globals
;If UserBufferIsActive, have stored previous value of isVirtualPcCursor ()
	int gbIsVirtualCursorEnvironment,
;info for UserBufferGet* functions
	string gs_VirtualWindowName,
	string gs_VirtualType,
	int gi_VirtualTypecode,
	int gi_VirtualControlId,
	string gs_PrevVirtualWindowName,
	string gs_PrevVirtualType,
	int gi_PrevVirtualTypecode,
	int gi_PrevVirtualControlId

string  Function UserBufferWindowName ()
return gs_VirtualWindowName
EndFunction

void function ClearUserBufferWindowName()
gs_VirtualWindowName = cscNull
EndFunction

string Function userBufferWindowType ()
return gs_VirtualType
EndFunction

int Function UserBufferWindowTypecode ()
return gi_VirtualTypecode
EndFunction

int Function UserBufferWindowControlId ()
return gi_VirtualControlId
EndFunction

string  Function UserBufferPrevWindowName ()
return gs_PrevVirtualWindowName
EndFunction

string Function userBufferPrevWindowType ()
return gs_PrevVirtualType
EndFunction

int Function UserBufferPrevWindowTypecode ()
return gi_PrevVirtualTypecode
EndFunction

int Function UserBufferPrevWindowControlId ()
return gi_PrevVirtualControlId
EndFunction

int Function UserBufferActivateEx (string sName, String sType, int iTypecode, int iControlId, optional int iAllowAllKeys)
;Save whether or not the Virtual PC Cursor was active, prior to Virtual Viewer:
Let gbIsVirtualCursorEnvironment = IsVirtualPCCursor ()
If (sName != CSCNull) Then
	let gs_VirtualWindowName = sName
EndIf
If (sType != CSCNull) Then
	let  gs_VirtualType = sType
EndIf
If ! iTypeCode Then
	let  gi_VirtualTypecode = iTypeCode
EndIf
If ! iControlId Then
	Let gi_VirtualControlId = iControlId
EndIf
return UserBufferActivate (!iAllowAllKeys)
EndFunction

int function UserBufferActivate (optional int iTrapKeys)
return UserBufferActivate (iTrapKeys)
endFunction

Int Function UserBufferDeactivate ()
;TuThis variable is only to remember the Virtual Cursor Setting before the buffer comes on, see use in OptionsTreeCorre and VerbosityCore for usage.
Let gbIsVirtualCursorEnvironment = FALSE
let gs_PrevVirtualWindowName  = gs_VirtualWindowName
let gs_VirtualWindowName = CSCNull
let  gs_PrevVirtualType  = gs_VirtualType
let  gs_VirtualType = CSCNull
let gi_PrevVirtualTypecode = gi_VirtualTypecode
let  gi_VirtualTypecode = 0
let gi_PrevVirtualControlId  = gi_VirtualControlId
Let gi_VirtualControlId = 0
return UserBufferDeactivate ()
EndFunction

Int Function UserBufferClearAll ()
; This clears everything possible about a user buffer.  Its main purpose is
; to make sure nothing is left in the PrevXXX variables that would make code
; try to restore an inappropriate virtual field after a subsequent help
; buffer has been displayed.  It executes UserBufferClear(), clears the
; current and previous variables such as gs_VirtualWindowName, and calls
; UserBufferDeactivate.  Since there is no way to force invocation of a
; built-in, we clear only the "current" variables and let this file's
; UserBufferDeactivate complete the process.

UserBufferClear()
let gs_VirtualWindowName = CSCNull
let  gs_VirtualType = CSCNull
let  gi_VirtualTypecode = 0
Let gi_VirtualControlId = 0
return UserBufferDeactivate ()
EndFunction

int Function UserBufferOverVirtualDocument ()
Return gbIsVirtualCursorEnvironment
endFunction

int function UserBufferAddLink(string bufferText, string functionToRun, optional string linkListText)
if !LinkListText
	linkListText = bufferText
endIf
return UserBufferAddText(bufferText, functionToRun, linkListText,
	cFont_Aerial, 12, ATTRIB_UNDERLINE, rgbStringToColor(cColor_BLUE), rgbStringToColor(cColor_White))
EndFunction
