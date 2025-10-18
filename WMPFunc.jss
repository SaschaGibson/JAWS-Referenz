; Copyright 1995-2015 Freedom Scientific, Inc.
include "HJConst.jsh"
include "HJGlobal.jsh"
include "WMPFunc.jsh"
include "WMPFunc.jsm"
include "windows media player 11.jsm"


Void Function AutoStartEvent ()
if !oWMP then
; We must create the object in the context of the foreground process
; when running as a service on XP or when running Vista.
; The 2nd parameter of CreateObjectEx is now a combination of flags
; This is intentionally undocumented but is backward compatible with
;the old behavior
;1 will Create the object in the context of the foreground process if
;JAWS is running as a service and in the JAWS context otherwise.
;2 will Create the object in the context of the foreground process if
;JAWS is running on Vista and in the JAWS context otherwise.
;These flags can be or'ed together.

	let oWMP = CreateObjectEx("freedomsci.WMPWrapper",3,"WMPSupport.x.manifest")
EndIf
if oWMP then
	ComAttachEvents(oWMP,"WMP_")
EndIf
EndFunction

void function WMP_ModeChange(string ModeName, int NewValue)
; Announce Shuffle and Repeat button name changes when the button is not in focus.
; The name of the button is the opposite of the current mode.
var
	string sObjName,
	int iType
let iType = getObjectSubTypeCode()
let sObjName = GetObjectName()
if ModeName == mode_Shuffle then
	if iType != wt_button
	|| (iType == wt_button 
	&& sObjName != objn_TurnShuffleOn
	&& sObjName != objn_TurnShuffleOff) then
		if NewValue == VBTrue then
			SayUsingVoice(vctx_message,objn_TurnShuffleOff,ot_status)
		else
			SayUsingVoice(vctx_message,objn_TurnShuffleOn,ot_status)
		EndIf
	EndIf
ElIf ModeName == mode_Loop then
	if iType != wt_button
	|| (iType == wt_button 
	&& sObjName != objn_TurnRepeatOn
	&& sObjName != objn_TurnRepeatOff) then
		if NewValue == VBTrue then
			SayUsingVoice(vctx_message,objn_TurnRepeatOff,ot_status)
		else
			SayUsingVoice(vctx_message,objn_TurnRepeatOn,ot_status)
		EndIf
	EndIf
EndIf
EndFunction

void function AutoFinishEvent()
var
	object oNull
; First force the Windows Media Control to disconnect from
; Media Player itself
CloseOleObject(oWmp)
let oWmp = oNull
EndFunction

string function GetCurrentlyPlayingTrackName()
return oWMP.Controls.CurrentItem.Name
EndFunction

string function GetCurrentPlaylistName()
return oWMP.CurrentPlayList.name
EndFunction

object function NowPlayingFocusItemMedia()
var
	handle hWnd,
	int i
let hWnd = GetFocus()
if GetWindowName(hWnd) != wn_BasketListView
|| !GetObjectSubtypeCode() then
	return false
EndIf
let i = lvGetFocusItem(GetFocus())
if !i then
	return false
EndIf
return oWMP.CurrentPlayList.Item(i-1)
EndFunction

int function IsListItemCurrentlyPlayingMedia()
var
	object oMedia
let oMedia = NowPlayingFocusItemMedia()
if !oMedia then
	return false
EndIf
return oWMP.currentMedia.isIdentical(oMedia) == VBTrue
EndFunction

int function IsMediaPlaying()
return oWMP.PlayState == PlayState_Playing
EndFunction

int function GetStarRating(object oMedia)
var
	int iRating
if !oMedia then
	return 0
EndIf
let iRating = oMedia.GetItemInfo(wmpAttribName_UserRating)
if iRating == 0
|| iRating == 1 then
	return iRating
ElIf iRating == 99 then
	return 5
else
	return (iRating/25)+1
EndIf
EndFunction

int function NowPlayingFocusItemStarRating()
return GetStarRating(NowPlayingFocusItemMedia())
EndFunction
