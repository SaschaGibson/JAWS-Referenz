;Copyright 2019, Freedom Scientific, Inc.
;Freedom Scientific script file for Ace

;AceHelpers
;Functions shared between Microsoft Edge and Kindle

Include "HjGlobal.jsh" ; default HJ global variables
Include "hjconst.jsh" ; default HJ constants
Include "common.jsm" ; message file

int function SayCellUnitEx(int UnitMovement, int wantErrors, int nextOrPriorCellShouldWrap)
	var
	int retVal=false
	if UnitMovement == UnitMove_Prior then
		if PriorCell(nextOrPriorCellShouldWrap) then
			retVal=true
		elif wantErrors then
			SayUsingVoice (VCTX_message, cMSGBeginningOfRow, OT_JAWS_message)
		endIf
	ElIf UnitMovement == UnitMove_Next then
		if NextCell(nextOrPriorCellShouldWrap) then
			retVal=true
		elif wantErrors then
			SayUsingVoice (VCTX_message, cMSGEndOfRow, OT_JAWS_message)
		endIf
	ElIf UnitMovement == UnitMove_First then
		if StartOfRow () then
			retVal=true
		elif wantErrors then
			SayUsingVoice (VCTX_message, cMsgStartOfRowFailed, OT_JAWS_message)
		endIf
	ElIf UnitMovement == UnitMove_Last then
		if EndOfRow() then
			retVal=true
		elif wantErrors then
			SayUsingVoice(VCTX_message, cMsgEndOfRowFailed, OT_JAWS_message)
		EndIf
	ElIf UnitMovement == UnitMove_Up then
		if UpCell() then
			retVal=true
		elif wantErrors then
			SayUsingVoice (VCTX_message, cMSGTopOfColumn, OT_JAWS_message)
		EndIf
	ElIf UnitMovement == UnitMove_Down then
		if DownCell() then
			retVal=true
		elif wantErrors then
			SayUsingVoice (VCTX_message, cMSGBottomOfColumn, OT_JAWS_message)
		EndIf
	ElIf UnitMovement == UnitMove_Top then
		if TopOfColumn () then
			retVal=true
		elif wantErrors then
			SayFormattedMessage(OT_error, cMsgTopOfColumnFailed, cMSGNotInTable_S) ; Could not move to Top of column
		EndIf
	ElIf UnitMovement == UnitMove_Bottom then
		if BottomOfColumn() then
			retVal=true
		elif wantErrors then
			SayFormattedMessage (OT_error, cMsgBottomOfColumnFailed, cMSGNotInTable_s) ; Could not move to Bottom of column
		EndIf
	ElIf UnitMovement == UnitMove_Start then
		if FirstCell () then
			retVal=true
		elif wantErrors then
			SayFormattedMessage (OT_ERROR, cMSGNotInTable_l, cMSGNotInTable_S)
		EndIf
	ElIf UnitMovement == UnitMove_End then
		if LastCell () then
			retVal=true
		elif wantErrors then
			SayFormattedMessage (OT_ERROR, cMSGNotInTable_L, cMSGNotInTable_S)
		EndIf
	endIf
	if !retVal then
		return retVal
	endIf
	SayCell()
	return retVal
EndFunction

int function IsQuickNavSupportedForAttribute(string attrib)
return false
EndFunction
