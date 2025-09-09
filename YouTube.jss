; Copyright 2024 by Freedom Scientific, Inc.
; Script file for www.youtube.com

include "HjConst.jsh"
include "HjGlobal.jsh"
include "YouTube.jsm"
import "FSXMLDomFunctions.jsd"

const
	YouTubeSliderValueChangeTimeout = 250,
	VideoSpec = "//*[@tag='video']"

Script ScriptFileName()
ScriptAndAppNames(msgYouTubeConfigName)
EndScript

int function ShouldIgnoreYouTubeSliderValueChange()
var
int type=GetObjectTypeCode()
if type!=WT_SLIDER then
	return false;
endIf
return GetTickCount()-GetLastKeyPressTime() > YouTubeSliderValueChangeTimeout
endFunction

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue,int bIsFocusObject)
if bIsFocusObject
	var int type = GetObjectSubTypeCode(2, 0 )
	if (IsFormsModeActive() || !IsVirtualPCCursor())
	&& IsFormControl(type)
	&& ShouldIgnoreYouTubeSliderValueChange()
		return
	endIf
endIf
ValueChangedEvent (hwnd, objId, childId, nObjType, sObjName, sObjValue, bIsFocusObject)
endFunction

int function SetCustomBackgroundOCRRect()
var
	object oVideoNode = GetXMLDomDocItem(VideoSpec),
	int iLeft, int iRight, int iTop, int iBottom,
	int fsID
if !oVideoNode
	return false
endIf
fsID = hexToDec(oVideoNode.attributes.GetNamedItem("fsID").nodeValue)
if !fsID
	return false
endIf
if !IsBackgroundOCREnabled()
	if !PerformActionOnElementWithID(Action_makeVisible, fsID)
		return false
	endIf
	Pause()
endIf
if !GetElementRect(fsID, iLeft, iTop, iRight, iBottom)
	return false
endIf
return UpdateBackgroundOCRRectCollection(iLeft, iTop, iRight, iBottom)
endFunction

script PictureSmartAllInOne (optional int serviceOptions)
var
	object node,
	int fsID, int top, int bottom, int left, int right

node = GetXMLDomDocItem(VideoSpec)
if node
	fsID = hexToDec(node.attributes.GetNamedItem("fsID").nodeValue)
	PerformActionOnElementWithID(Action_makeVisible,fsID)
	Pause()
	if GetElementRect(fsID, left, top, right, bottom)
		PictureSmartWithAreaShared(serviceOptions, left, top, right, bottom)
		return
	endIf
endIf
PerformScript PictureSmartAllInOne(serviceOptions)
endScript
