include "HJConst.jsh"
include "HJGlobal.jsh"
include "Common.jsm"

const
;control ID's:
	id_SearchForDevicesResults_List = 1031

void function SayLVItemState(handle hWnd)
var
	int iSpeak
let iSpeak = GetJCFOption(opt_indicate_selected)
if !(lvGetItemState(hWnd,lvGetFocusItem(hWnd)) & LVIS_SELECTED) then
	if iSpeak & 0x002 then
		Say(cMsgDeselected,ot_item_state)
	EndIf
else
	if iSpeak & 0x001 then
		Say(cMsgSelected,ot_item_state)
	EndIf
EndIf
EndFunction

void function SayBlueToothListItem(int bEntireLVItemText, int bPosition)
var
	handle hWnd,
	string sText,
	int nCols,
	int i
let hWnd = GetFocus()
SayLVItemState(hWnd)
if !bEntireLVItemText then
	;Just say the name of the item and no status information:
	Say(LVGetItemText(hWnd,LVGetFocusItem(hWnd),1),ot_line)
else
	;Say the name along with the columns containing status information:
	let nCols = lvGetNumOfColumns(hWnd)
	let i = 1
	while i <= nCols
		let sText = LVGetItemText(hWnd,LVGetFocusItem(hWnd),i)
		if sText then
			Say(sText,ot_line)
		EndIf
		let i = i+1
	EndWhile
EndIf
if bPosition then
	Say(PositionInGroup(),ot_position)
EndIf
EndFunction

int function BrailleAddObjectValue(int nSubtype)
var
	string sText,
	handle hWnd,
	int nCols,
	int i
if nSubtype == wt_ListView then
	if GetControlID(GetFocus()) == id_SearchForDevicesResults_List then
		let hWnd = GetFocus()
		let nCols = lvGetNumOfColumns(hWnd)
		let i = 1
		while i <= nCols
			let sText = LVGetItemText(hWnd,LVGetFocusItem(hWnd),i)
			if sText then
				if i == 1 then
					BrailleAddString(sText,GetCursorCol(),GetCursorRow(),GetCharacterAttributes())
				else
					BrailleAddString(sText,0,0,0)
				EndIf
			EndIf
			let i = i+1
		EndWhile
		return true
	EndIf
EndIf
return BrailleAddObjectValue(nSubtype)
EndFunction

Script SayLine ()
var
	int CtrlID
if IsPCCursor()
&& !UserBufferIsActive()
&& !GlobalMenuMode then
	Let CtrlID = GetControlID(GetFocus())
	If CtrlID == id_SearchForDevicesResults_List then
		SayBlueToothListItem(true,true)
		Return
	EndIf
EndIf
PerformScript SayLine()
EndScript

void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
if !nSelectingText
&& !MenusActive()
&& GetControlID(curHwnd) == id_SearchForDevicesResults_List then
	SayBlueToothListItem(true,false)
	Return
endIf
ActiveItemChangedEvent(curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
EndFunction
