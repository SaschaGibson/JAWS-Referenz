;copyright 2020, Freedom Sientific, Inc.
;Eclipse IDE script file.

Include "HjGlobal.jsh"
Include "hjconst.jsh"
Include "common.jsm"

void function SayTreeViewItem()
var
	int bIsMSAAWindow = IsMSAAWindow(getFocus()),
	int nSubtype = GetObjectSubtypeCode()
if bIsMSAAWindow
&& (nSubtype == WT_CHECKBOX || nSubtype == WT_RADIOBUTTON)
	SayObjectActiveItem()
	return
endIf
var
	int nOutputType,
	int nState,
	string sValue
;Hj Dialogs  set options, so don't use line:
If InHjDialog () then
	nOutputType = OT_TEXT
Else
	nOutputType = OT_LINE
EndIf
if bIsMSAAWindow
&& nSubtype == WT_TREEVIEWITEM
	sValue = GetObjectName ()
	If !sValue
		sValue  = (tvGetFocusItemText (GetFocus ()))
	EndIf
	SayMessage (nOutputType, sValue)
	nState = GetTreeViewItemState()
	if (nState) IndicateControlState (nSubtype, nState) endIf
else
		sValue = (tvGetFocusItemText (GetFocus ()))
	;eclipse has treeviews with columns and these columns are in the AccDescription, so if this is a TreeviewWithColumns, append description
	if TreeWithColumns ()
		var string description = GetObjectDescription(SOURCE_CACHED_DATA, 0)
		if StringLength (description)
			sValue = sValue + cscSpace + description
		EndIf
	EndIf
	SayMessage (nOutputType, sValue)
	nState = GetTreeViewItemState()
	if (nState) IndicateControlState (nSubtype, nState) endIf
	;FlexibleWebNumberOfActiveRules already checks to ensure we're in in the right place to get any text, otherwise returns null:
	sayMessage (OT_SCREEN_MESSAGE, FlexibleWebNumberOfActiveRules ())
endIf
EndFunction
