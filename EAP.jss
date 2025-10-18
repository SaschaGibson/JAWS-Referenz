; Copyright 2023 by Freedom Scientific, Inc.
; Early Adopter Program script file

include "HjConst.jsh"
include "EAP.jsm"
include "common.jsm"
import "UIA.jsd"


Function AutoStartEvent ()
UIARefresh (false)
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName, int drawHighLight)
var
	string sValue,
	string sName,
	int iType
if nLevel == 0
&& GetObjectSubTypeCode () == WT_EDIT
	sName = GetObjectName ()
	sValue = FSUIAGetFocusedElement ().GetValuePattern().value
	if IsReadOnlyEditObject ()
		iType = WT_ReadOnlyEdit
	else
		iType = WT_Edit
	endIf
	IndicateControlType (iType, sName, sValue)
	return
endIf
SayObjectTypeAndText(nLevel, includeContainerName, drawHighLight)
EndFunction

script scriptFileName ()
scriptAndAppNames (msgConfigName)
endScript
