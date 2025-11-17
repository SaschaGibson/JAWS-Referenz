;Copyright 1995-2018 Freedom Scientific, Inc.
; JAWS script file  for Microsoft Outlook Message support in office versions 2016 and O365

include "HjConst.jsh"
Include "MSAAConst.jsh"
include "HjGlobal.jsh"
include "HjHelp.jsh"
include "common.jsm"
Include "IE.jsm"
Include "Office.jsh"
Include "Outlook Message.jsh"
Include "Outlook Message.jsm"
include "msOffice.jsm"

;information for determining outlook email versions
const
	OutlookEmail2003 = 11,
	OutlookEmail2007 = 12,
	OutlookEmail2010 = 14,
	wc_Rctrl_RenWnd32="Rctrl_RenWnd32",
	WC_CommandBarDock = "MsoCommandBarDock"
globals
	int OutlookEmailVersion

void function AutoStartEvent()
let OutlookEmailVersion = GetProgramVersion (GetAppFilePath ())
EndFunction

int function OutlookIsActive ()
return (StringContains (OUTLOOK_OWNERS_LIST, GetAppFileName ())
|| StringContains (OUTLOOK_OWNERS_LIST, GetWindowOwner (GetFocus ())))
endFunction

Int Function IsEMailMessage ()
return OutlookIsActive()
		&& GetWindowCategory() == wCat_document
EndFunction

Void Function ControlNotFound (Int iControlID)
If iControlID == ID_From_1
	SayFormattedMessage (OT_ERROR, MSG_FromFieldNotFound_L, MSG_FromFieldNotFound_S)
ElIf iControlID == ID_Sent_1
	SayFormattedMessage (OT_ERROR, MSG_SentFieldNotFound_L, MSG_SentFieldNotFound_S)
ElIf iControlID == ID_To_1
	SayFormattedMessage (OT_ERROR, MSG_ToFieldNotFound_L, MSG_ToFieldNotFound_S)
ElIf iControlID == ID_CC_2
	SayFormattedMessage (OT_ERROR, MSG_CCFieldNotFound_L, MSG_CCFieldNotFound_S)
EndIf
EndFunction

Handle Function GetMessageHeader (Int iField)
Var
	Handle hFound

If iField == 3	; To field if present...
	hFound = FindWindowWithClassAndId (GetParent (GetFocus ()), cwc_RichEdit20WPT, ID_To_2)
	If Not (hFound
	|| IsWindowVisible (hFound))
		hFound = FindWindowWithClassAndId (GetParent (GetFocus ()), cwc_RichEdit20WPT, ID_To_1)
	EndIf
	Return (hFound)
ElIf iField == 4	; CC field if present...
	hFound = FindWindowWithClassAndId (GetParent (GetFocus ()), cwc_RichEdit20WPT, ID_CC_2)
	If Not (hFound
	|| IsWindowVisible (hFound))
		hFound = FindWindowWithClassAndId (GetParent (GetFocus ()), cwc_RichEdit20WPT, ID_CC_1)
	EndIf
	Return (hFound)
ElIf iField == 5	; Subject field if present...
	hFound = FindWindowWithClassAndId (GetParent (GetFocus ()), cwc_RichEdit20WPT, ID_Subject_2)
	If Not (hFound
	|| IsWindowVisible (hFound))
		hFound = FindWindowWithClassAndId (GetParent (GetFocus ()), cwc_RichEdit20WPT, ID_Subject_1)
	EndIf
	Return (hFound)
EndIf
Return (Null ())
EndFunction

Void Function ReadMessageHeader (Int iField)
; reads headers in the message windows...
Var
	Handle hHeader = GetMessageHeader (iField),
	Object oFound,
	Int iFound

If iField == 1	; From field if present...
	ControlNotFound (ID_From_1)
ElIf iField == 2	; Sent field if present...
	ControlNotFound (ID_Sent_1)
ElIf iField == 3	; To field if present...
	If hHeader
		oFound = GetObjectFromEvent (hHeader, OBJID_CLIENT, 0, iFound)
		IndicateControlType (GetWindowSubtypeCode (hHeader), oFound.accName (CHILDID_SELF), oFound.accValue (CHILDID_SELF))
	Else
		SayFormattedMessage (OT_ERROR, MSG_ToFieldNotFound_L, MSG_ToFieldNotFound_S)
	EndIf
ElIf iField == 4	; CC field if present...
	If hHeader
		oFound = GetObjectFromEvent (hHeader, OBJID_CLIENT, 0, iFound)
		IndicateControlType (GetWindowSubtypeCode (hHeader), oFound.accName (CHILDID_SELF), oFound.accValue (CHILDID_SELF))
	Else
		SayFormattedMessage (OT_ERROR, MSG_CCFieldNotFound_L, MSG_CCFieldNotFound_S)
	EndIf
ElIf iField == 5	; Subject field if present...
	If hHeader
		oFound = GetObjectFromEvent (hHeader, OBJID_CLIENT, 0, iFound)
		IndicateControlType (GetWindowSubtypeCode (hHeader), oFound.accName (CHILDID_SELF), oFound.accValue (CHILDID_SELF))
	Else
		SayFormattedMessage (OT_ERROR, MSG_SubjectFieldNotFound_L, MSG_SubjectFieldNotFound_S)
	EndIf
EndIf
EndFunction

Int Function ShouldMessageTypeSpeak ()
Return GetNonJCFOption ("MessageTypeVerbosity")
endFunction

Script ReadOutlookHeader (Optional Int iField)
Var
	Handle hHeader
If (! InHJDialog ())
&& (! UserBufferIsActive ())
	If Not iField
		iField = StringToInt (StringRight (GetCurrentScriptKeyName (), 1))
	EndIf
	hHeader = GetMessageHeader (iField)
	If IsSameScript ()
	&& hHeader
		SetFocus (hHeader)
		Return
	EndIf
	ReadMessageHeader (iField)
	Return
EndIf
SayCurrentScriptKeyLabel ()
TypeCurrentScriptKey ()
EndScript

Script SayNextParagraph ()
If IsEMailMessage ()
&& IsVirtualPCCursor ()
	NextParagraph ()
	If SayAllInProgress ()
		Return
	EndIf
	IndicateInconsistenciesInRange (CheckParagraph)
	If Not SayParagraph ()
		SayMessage (OT_ERROR, cMSG276_L)
		SayMessage (OT_ERROR, cMSG277_L, cmsgSilent)
	EndIf
	Return
EndIf
PerformScript SayNextParagraph ()
EndScript

Script SayPriorParagraph ()
If IsEMailMessage ()
&& IsVirtualPCCursor ()
	PriorParagraph ()
	If SayAllInProgress ()
		Return
	EndIf
	IndicateInconsistenciesInRange (CheckParagraph)
	If Not SayParagraph ()
		SayMessage (OT_ERROR, cMSG276_L)
		SayMessage (OT_ERROR, cMSG277_L, cmsgSilent)
	EndIf
	Return
EndIf
PerformScript SayPriorParagraph ()
EndScript
