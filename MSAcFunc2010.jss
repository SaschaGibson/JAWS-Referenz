;Copyright 1995-2015 Freedom Scientific, Inc.
;JAWS script file for Microsoft Access 2007.

;This file contains Object Model interface code and helper functions.


include "msaccess2010.jsh"
include "common.jsm"
include "msaccess2007.jsm"
include "hjconst.jsh"
include "hjglobal.jsh"
include "MSAcFunc2010.jsh"
include "MsOffice2010.jsh"
use "officeClassic.jsb"

Globals
	object goAccessControlObj ; derived by object at point when pointer to the application fails through the DOM.

function InitializeAccessObject ()
let oAccess=GetNativeOMFromMSAA().application
if !oAccess then ; try again the old way.
	let OAccess = MSOGetMenuBarObject ()
	let oAccess = oAccess.Application ; init pointer to access app object		if !oAccess then ; try one last time.			let OAccess = MSOGetMenuBarObject ()
	if !oAccess then
		let OAccess = MSOGetMenuBarObject ()
		let oAccess = oAccess.Application ; init pointer to access app object
		if !oAccess then
			; try one last time.
			let OAccess = MSOGetMenuBarObject ()
			let oAccess = oAccess.Application ; init pointer to access app object
		endIf
	endIf
endIf
EndFunction

Void Function AutoStartEvent()
InitializeAccessObject ()
if !oAccess then
	delay(20,true)
	InitializeAccessObject ()
	if !oAccess then
		delay(20)
		InitializeAccessObject ()
	endIf
endIf
EndFunction

Void Function AutoFinishEvent()
ComRelease(oAccess,true)
ComRelease(goAccessControlObj,true)
EndFunction

int function IsAppObjInvalid()
if !oAccess then
	return true
else
	return false
endIf
EndFunction

int Function getCurrentView ()
var
	object oMenuItem,
	int iView
let oMenuItem=oAccess.CommandBars(scMnuView).controls
if isFormView() then
	if oMenuItem(scOptFormView).state==-1 then
		let iView=acFormDS
	elIf oMenuItem(scOptPivotTableView).state==-1 then
		let iView=acFormPivotTableview
	elIf oMenuItem(scOptPivotChartView).state==-1 then
		let iView=acFormPivotChartview
	endIf
elIf oMenuItem(scOptDesignView).state==-1 then
	let iView=acDesignView
elIf oMenuItem(scOptDatasheetView).state==0 then
	let iView=acNormal
elIf oMenuItem(scOptSQLView).state==-1 then
	let iView=isSQLView()
elIf oMenuItem(scOptPivotTableView).state==-1 then
	let iView=acviewPivotTable
elIf oMenuItem(scOptPivotChartView).state==-1 then
	let iView=acViewPivotChart
elIf oMenuItem(scOptPreviewView).state==-1 then
	let iView=AcViewPreview
elIf oMenuItem(scOptReportView).state==-1 then
	let iView=AcviewReport
elIf oMenuItem(scOptLayoutView).state==-1 then
	let iView=acViewLayout
endIf
return iView
/*
var
	object oForm,
	HANDLE HWND,
int iAccessControl ; Is Access control through DOM or MSAA?

;Reason: code -1 = no object, no screen, no form.
;means we could be in dialog or elsewhere.
let iAccessControl=IsAccessControl()
if !goAccessControlObj
&& iAccessControl then
	let hwnd=GetFocus()
	if GetWindowClass(hwnd)==wc_OTable
	|| GetWindowClass(GetParent(GetParent(hwnd)))==wc_OTable then
		return FormDataSheetView
	else
		return -1
	endIf
endIf
Let oForm = oAccess.Screen.activeControl.ActiveForm
return oAccess.Screen.ActiveForm.CurrentView
*/
endFunction

string function getViewName (int nView)
if nView == -1 then
	return cscNull
elIf nView == acDesignView then
	return wn_DesignView
elIf nView==acNormal then
	return wn_DataSheetView
elif nView == acFormDS then
	return wn_FormView
elIf nView==acDesignView then
	return wn_DesignView
elIf nView == isDatasheetView() then
	return wn_DataSheetView
elif nView == acFormPivotTableView then
	return wn_PivotTableView
elif nView == acFormPivotChartView then
	return wn_PivotChartView
elif nView == acViewPreview then
	return wn_PreviewView
elif nView == acviewReport then
	return wn_ReportView
elIf nView == acViewLayout then
	return wn_LayoutView
endIf
endFunction

Int Function InPropertiesSheet()
var
	handle hwnd,
	string sClass,
	string sParentClass,
	string sGrandparentClass
let hwnd=GetFocus()
let sClass=GetWindowClass(hwnd)
let sParentClass=GetWindowClass(getParent(hwnd))
let sGrandparentClass=GetWindowClass(GetParent(GetParent(hwnd)))
If sClass==wc_ReComboBox20W Then
	If sParentClass == wc_OArgDlg Then
		Return TRUE
	EndIf
ElIf sClass==cwcSysTabCtrl32 Then
	If sParentClass == wc_OArgDlg Then
		Return TRUE
	EndIf
ElIf sClass == wc_OGrid Then
	If sParentClass == wc_OArgDlg Then
		Return TRUE
	EndIf
ElIf sClass == wc_OKttbx Then
	If sGrandparentClass == wc_OArgDlg Then
		Return TRUE
	EndIf
EndIf
Return FALSE
EndFunction

Int Function IsFormDesignView()
Return (oAccess.Screen.ActiveForm.CurrentView == acDesignView)
EndFunction

Int Function IsFormActive()
Return oAccess.Screen.ActiveForm
EndFunction

Int Function IsReportActive()
Return oAccess.Screen.ActiveReport
EndFunction

Int Function IsFormFormView()
Return (oAccess.Screen.ActiveForm.CurrentView == acNormal)
EndFunction

Int Function IsFormDatasheetView()
Return (oAccess.Screen.ActiveForm.CurrentView == acFormDS)
EndFunction

Int Function IsAccessControl()
var
	object oAccessControl,
	int iRefData
let oAccessControl=oAccess.screen.ActiveControl()
if oAccessControl then
	return true
else
	let oAccessControl=GetObjectAtPoint(iRefData,GetCursorCol(),GetCursorRow())
	if oAccessControl then
		let goAccessControlObj=oAccessControl
		return true
	endIf
endIf
let goAccessControlObj=Null()
Return false
EndFunction

String Function getFormName()
Return oAccess.Screen.ActiveForm.caption()
EndFunction

string function getReportName ()
return oAccess.Screen.ActiveReport.name
endFunction

string function getDataSheetName ()
return oAccess.screen.ActiveDatasheet.name
endFunction

String Function GetFieldName()
Return oAccess.Screen.ActiveControl.Name
EndFunction

String Function GetFieldCaption()
Return oAccess.Screen.ActiveControl.caption()
EndFunction

string function GetFieldText()
;For table cells, get the correct value:
Return oAccess.Screen.ActiveControl.text
endFunction

Int Function IsAccessCheckbox()
Return (oAccess.Screen.ActiveControl.controlType == acCheckbox)
EndFunction

String Function GetParentControlName()
Return oAccess.Screen.ActiveControl.parent.name
EndFunction

Int Function isDatasheetView()
return (oAccess.screen.currentView==oAccess.screen.ActiveDatasheet)
EndFunction

int Function AccessGetControlType ()
var
	int iType
Let iType = oAccess.Screen.ActiveControl.controlType
if iType == acCheckbox then
	return WT_CHECKBOX
elif iType == acImage then
	Return WT_BITMAP
elIf iType == acCommandButton
|| iType == acToggleButton then; standard button
	return WT_BUTTON
elif iType == acOptionButton then
	return WT_RADIOBUTTON
elif iType == acOptionGroup then
	return WT_GROUPBOX
elif iType == acTextBox then
	return WT_EDIT;Todo: figure out if we can differentiate multiline
elif iType == acListBox then
	return WT_LISTBOX
elif iType == acComboBox then
	return WT_COMBOBOX
elif iType == acTabCtl then
	return WT_TABCONTROL
endIf
endFunction

Void Function DataSheetCoordinates(int byRef nCol, int byRef nRow )
Var
	object oCell,
	int Top,
	int Left,
	string sCellArray,
	string sCol,
	string sRow,
	int iRefData,
	object oAccessObj
Let oCell = oAccess.screen.ActiveDatasheet
if ! oCell
|| oCell == null () then
	Let oCell = oAccess.screen.ActiveForm
endIf
if (! oCell
|| oCell == null ())
&& !isFormview() then
	;handle by MSAA:
	let oAccessObj=GetObjectAtPoint(IRefData,GetCursorCol(),GetCursorRow())
	let sCellArray=oAccessObj.accparent.accname(iRefData)
	let sRow = stringSegment (sCellArray,scComma,1)
	let sCol = stringSegment (sCellArray,scComma,2)
	Let nRow = stringToInt (stringSegment (sRow,cscSpace,1))
	if ! nRow then
		Let nRow = stringToInt (stringSegment (sRow,cscSpace,2))
	endIf
	Let nCol = stringToInt (stringSegment (sCol,cscSpace,1))
	if ! nCol then
		Let nCol = stringToInt (stringSegment (sCol,cscSpace,-1))
	endIf
	return
endIf
;must check for form view as this is different from datasheet to determine row/column info:
if isFormview() then
	Let oCell= oAccess.screen.activeForm.activeControl.form
endIf
Let Top = oCell.SelTop
Let Left = oCell.SelLeft-1
Let nCol = left
Let nRow = top
EndFunction

Int Function IsFormDataEntryMode()
Return oAccess.Screen.ActiveForm.AllowEdits
EndFunction

Int Function IsTripleStateCheckBox ()
If oAccess.Screen.ActiveControl.TripleState == -1 Then
	Return TRUE
EndIf
Return FALSE
EndFunction

Int Function BrailleAddObjectContainerName(int nType)
; must overwrite here to avoid group information to be double-Brailled when in structured mode for lower ribbons.
If inRibbons () then
	Return true
Else
	Return BrailleAddObjectContainerName(nType)
EndIf
EndFunction

;Legacy functions necessary to run scripts, do not remove:
void function ReadFormInControlOrder()
var
	object form,
	object control,
	int iType,
	int index,
	int count
let form=OAccess.screen.activeForm
let count=form.controls.count
sayFormattedMessage (OT_DIALOG_NAME, form.caption())
let index=0
while index < count
	let Control=form.controls(index)
	if control.visible then
		let iType=control.controlType
		if iType==acSubForm then
			ReadSubForm(control,false)
		elif iType==acOptionGroup then
			sayFormattedMessage (OT_CONTROL_GROUP_NAME, GetControlLabel(Form, control))
			sayFormattedMessage (ot_screen_message, GetControlTypeAndState(control, false))
			ReadOptionGroupActiveItem(control,false)
			; skip over controls in OptionGroup as they will be handled in readOptionGroupActiveItem
			let index=index+control.controls.count
		elif iType==acLabel then
			if controlIsDetachedLabel(form,control) then
				sayFormattedMessage (ot_dialog_text, control.caption())
			endIf
		elif iType!= acLine
		&& iType!= acImage
		&& iType!=acRectangle
		&& iType!= AcLine then
			sayFormattedMessage (OT_CONTROL_NAME, GetControlLabel(form, control))
			sayFormattedMessage (ot_screen_message, GetControlTypeAndState(control, false))
		endIf
	endIf
	let index=index+1
endWhile
EndFunction

String Function getSubformLabel (object subform)
var
	string hotKey,
	int HotKeyPos,
	string subformLabel, ; try and determine
	object Form, ; parent form of subform
	object thisControl, ; used when looping through controls on parent form
	object parentControl, ; the parent of the control being investigated in the loop body
	int count,
	int index
if giLabelSearch then
	; try and guess using a known method
	; if the control is a label then its parent property should point to the control it labels
	let form=subform.parent.form
	let count=form.controls.count
 let index=0
	while index < count
		let thisControl=form.controls(index)
		if thisControl.controlType==acLabel then ; it is a label
			let parentControl=thisControl.parent
			if stringsEqual(parentControl.name,subform.name) then
				; the parent of this label control is the subform control passed as a parameter
				; whose label we are looking for
				; we now have two choices, use the label.caption() or the label.name
				; both can sometimes be wrong.
				; Caption should be the one we use though
				let subformLabel=thisControl.caption()
				let index=count
			endIf
		endIf
		let index=index+1
	endWhile
endIf
if subformLabel ==cscNull then
	; use its caption property second as this is generally not displayed
	if subform.caption() != cscNull then
		let subformLabel=subform.caption()
	endIf
endIf
if subformLabel!=cscNull then
 ;scHotkeyMarker = "&"
	let HotKeyPos=stringContains(subformLabel,scHotkeyMarker)
	if HotKeyPos then ; has a shortcut or hot key
		let HotKey=substring(subformLabel,hotKeyPos+1,1)
		let subformLabel=stripHKMarker(subformLabel)
	endIf
endIf
return subformLabel
EndFunction

String Function GetControlLabel (object form, object control)
var
	string ControlLabel, ; try and determine
	string ControlName, ; internal name used by programmer
	string namePrefix, ; grp, cbo, txt, etc, will eliminate common prefixes for sake of verbosity
	object parentControl,
	object thisControl,
	int count,
	int index
let controlName=control.name
if giInWizard then
	; table wizard controls
 ;msg506 = "TbTableName"
 if controlname==scLblCtl6 then
  ;scLblCtl34 = "text517"
  let ControlLabel=form.controls(scLblCtl34).caption()
 ;msg500 = "GrpPk"
 elif controlname==scLblCtl0 then
  ;scLblCtl1 = "text531"
  let ControlLabel=form.controls(scLblCtl1).caption()
 ;msg502 = "GrpRelType"
 elif controlname==scLblCtl2 then
  ;scLblCtl3 = "LblRelTbl"
  let ControlLabel=form.controls(scLblCtl3).caption()
 ;msg504 = "GrpFinishView"
 elif Controlname==scLblCtl4 then
		; scLblCtl33="label1"
  let ControlLabel=form.controls(scLblCtl33).caption()
	; Simple query wizard controls
 ;msg505 = "GrpQrySummarize"
 elif controlname==scLblCtl5 then
  ;scLblCtl21 = "Label179"
  let ControlLabel=form.controls(scLblCtl21).caption()
 ;scLblCtl7 = "TbPane0"
 elif controlname==scLblCtl7 then
		; scLblCtl8="lblfr0"
  let controlLabel=form.controls(scLblCtl8).caption()
	; scLblCtl9="GrpOpenMode"
 elif controlname==scLblCtl9 then
		; scLblCtl10="lblfr8"
  let controlLabel=form.controls(scLblCtl10).caption()
	; scLblCtl11="CBHelpCard"
 elif controlname==scLblCtl11 then
	; scLblCtl12="lblfr6"
  let controlLabel=form.controls(scLblCtl12).caption()
	; crosstab query wizard controls
	;scLblCtl13="LstRecSrcs"
 elif controlname==scLblCtl13 then
		; scLblCtl14="Text162"
  let ControlLabel=form.parent.controls(scLblCtl14).caption()
	; scLblCtl15="LstColHdrs"
 elif controlname==scLblCtl15 then
		;scLblCtl16="text164"
  let ControlLabel=form.controls(scLblCtl16).caption()
	;scLblCtl17="TbQryName"
 elif Controlname==scLblCtl17 then
	;scLblCtl18="text161"
  let ControlLabel=form.controls(scLblCtl18).caption()
	;scLblCtl19="OgOpenMode"
 elif controlname==scLblCtl19 then
		; scLblCtl20="text507"
   let ControlLabel=form.controls(scLblCtl20).caption()
	; report wizard
	;scLblCtl23="cboSortExpr"
 elif stringContains(controlname,scLblCtl23) then
  let controlLabel=IntToString(StringToInt(subString(controlname,StringLength(controlname),1))+1)
	;scLblCtl24="btnSortDesc"
 elif StringContains(controlname,scLblCtl24) then
  let controlLabel=IntToString(StringToInt(subString(controlname,StringLength(controlname),1))+1)
	;scLblCtl25="LstStyles"
 elif controlname==scLblCtl25 then
		;scLblCtl26="Frui_FrmPageStyles"
  if form.parent.name==scLblCtl26 then
			; report wizard style list
			;scLblCtl27="lblStylePrompt"
   let ControlLabel=form.parent.controls(scLblCtl27).caption()
  else
			; database wizard style list for print and screen
			;scLblCtl28="LblLstStyles"
   let ControlLabel=form.parent.controls(scLblCtl28).caption()
  endIf
	; form wizard controls
	; scLblCtl29="grpPaneContent0"
 elif controlname==scLblCtl29 then
		;scLblCtl22="layout"
	 let controlLabel=scLblCtl22 ; layout
 endIf
endIf
if controlLabel !=cscNull then
 let ControlLabel=stripHKMarker(ControlLabel)
 return ControlLabel
	; note that LstStyles is also a control in the Database Wizard
	; but since it would be used less than the report wizard,
	; it is not hardwired due to complexity to discern the difference.
endIf

if control.caption() != cscNull then
 let ControlLabel=Control.caption()
elif control.controlTipText != cscNull then
 let ControlLabel=Control.ControlTipText
else
 if !giLabelSearch then
  return ControlName
 endIf
; try and guess using a known method
; if the control is a label then its parent property should point to the control it labels
let count=form.controls.count
let index=0
while index < count
	let thisControl=form.controls(index)
	if thisControl.controlType==acLabel
	&& thisControl.visible then ; it is a visible label
			let parentControl=thisControl.parent
			if stringsEqual(parentControl.name,controlname) then
				; the parent of this label control is the control passed as a parameter
				; whose label we are looking for
				; we now have two choices, use the label.caption() or the label.name
				; both can sometimes be wrong.
				; Caption should be the one we use though
				let controlLabel=thisControl.caption()
				let index=count
			endIf
		endIf
		let index=index+1
	endWhile
endIf
if ControlLabel!=cscNull then
 let ControlLabel=stripHKMarker(ControlLabel)
 return controlLabel
else
	let namePrefix=stringLeft(controlname,3)
	if stringContains(scCommon3CharPrefixes,namePrefix) then
		return substring(controlname,4,stringLength(controlname))
	else
		return ControlName
	endIf
endIf
EndFunction

string Function GetListBoxColumnText (object Control)
Var
	int iColumnCount ,
	int iCounter,
	int Index,
	string sColumnText,
	string sListBoxText,
	int iListIndex
let iColumnCount = Control.ColumnCount
; account for column headers in list boxes
; failure to do so causes our count to be off by 1 and does not allow
; for the last listbox item to be spoken
If Control.ColumnHeads == -1 Then
	let iListIndex = Control.ListIndex + 1
Else
	let iListIndex = Control.ListIndex
EndIf
If iColumnCount  > 1 Then
	let iCounter = 1
	While iCounter <= iColumnCount
		;let sColumnText = Control.Column (iCounter,control.ListIndex)
		let sColumnText = Control.Column (iCounter, iListIndex)
		let sListBoxText = sListBoxText + cscSpace + sColumnText
		let iCounter = iCounter + 1
	EndWhile
Else
	let sListBoxText = Control.Column (1,control.ListIndex)
EndIf
return sListBoxText
EndFunction

String Function GetControlState (object control, int InOptionGroup)
var
	int type,
	int index,
	int iColumnCount ,
	int iCounter,
	int UBound,
	string CtlState, ; used for checkboxes etc
	string sColumnText,
	int iHasColumnHeads
let type=control.controlType()
let CtlState=cscNull
if type==acOptionButton then
	if InOptionGroup then
		if control.parent.value==control.OptionValue then
			;msg56_L = "Selected"
			let CtlState=msg56_L
		else
			;msg57_L = "Not selected"
			let CtlState=msg57_L
		endIf
	else
		if control.value then
			;msg56_L = "Selected"
			let CtlState=msg56_L
		else
			;msg57_L = "Not selected"
			let CtlState=msg57_L
		endIf
	endIf
elif type==acCheckBox then
	if InOptionGroup then
		if control.parent.value==control.OptionValue then
			;cmsg_checked = "Checked"
			let CtlState=cmsg_checked
		else
			;cmsg_notChecked =  "Unchecked"
			let CtlState=cmsg_notChecked
		endIf
	else
		if control.value then
			;cmsg_checked = "Checked"
			let CtlState=cmsg_checked
		else
			;cmsg_notChecked = "Unchecked"
			let CtlState=cmsg_notChecked
		endIf
	endIf
elif type==acTextBox then
	let CtlState=control.text()
elif type==acListBox then
	let index=control.ListIndex+1
	let UBound=control.listCount
	if UBound then
		; account for column headers as they are a part of the total number of items
		; in  a  list box
		If Control.ColumnHeads == -1 Then
			let uBound = uBound - 1
		EndIf
		; note had to use following lines to get listbox selection
		; because itemData property was returning an integer rather than the data.
		;msg491_L = "lstSelFlds"
		if control.name==scLblCtl35 then
			; this listbox is odd
			let ctlState=control.column(2,control.ListIndex)
		else
			let iColumnCount = Control.ColumnCount
			If iColumnCount  > 1 Then
				let CtlState = GetListBoxColumnText (Control)
			Else
				let ctlState=control.column(1,control.ListIndex)
			EndIf
		endIf
		;msg492_L = " of "
		let ctlState=CtlState+cscSpace+formatString(msgItemNumber1, intToString(index), intToString(uBound))
	else
		;msg54_L = "zero item
		let CtlState=msg54_L
	endIf
elif type==acComboBox then
	let CtlState=control.text()
elif type==acToggleButton then
	if InOptionGroup then
		if control.parent.value==control.OptionValue then
			;msg55_L = "Pressed"
			let CtlState=msg55_L
		endIf
	else
		if control.value then
			;msg55_L = "Pressed"
			let CtlState=msg55_L
		endIf
	endIf
elif type==acCommandButton then
	let ctlState=control.caption()
endIf
if !control.enabled  then
	let ctlState=ctlState+cscSpace
endIf
return CtlState
EndFunction

Void Function ReadSubForm (object subForm,int iFlag)
var
	object control,
	int index,
	int count,
	int iType
; If iFlag is true, text is to be added to user buffer.
; Otherwise, output type is determined by type of text to be spoken.
If iFlag then
	UserBufferAddText(formatString(msgSubform1,getSubformLabel(subform)))
Else
	sayFormattedMessage (OT_DIALOG_NAME, formatString(msgSubform1, getSubformLabel(subform)))
EndIf
let count=subForm.controls.count
let index=0
while index < count
	let Control=subForm.controls(index)
	if control.visible then
		let iType=control.controlType
		if iType==acSubForm then
			If iFlag then
				readSubSubForm(control,true)
			Else
				readSubSubForm(control,false)
			EndIf
		elif iType==acOptionGroup then
			If iFlag then
				UserBufferAddText(GetControlLabel(SubForm, control))
				UserBufferAddText(GetControlTypeAndState(control, false))
				ReadOptionGroupActiveItem(control,true)
			Else
				sayFormattedMessage (OT_CONTROL_GROUP_NAME,GetControlLabel(SubForm, control))
				say(GetControlTypeAndState(control, false),ot_line)
				ReadOptionGroupActiveItem(control,false)
			EndIf
			let index=index+count
		elif iType==acLabel then
			if controlIsDetachedLabel(subform,control) then
				If iFlag then
					userBufferAddText(control.caption())
				Else
					sayMessage (ot_dialog_text, control.caption())
				EndIf
			endIf
		elif iType !=acLabel
		&& iType!=acRectangle
		&& iType!=acImage
		&& iType!=acLine then
			If iFlag then
				UserBufferAddText(GetControlLabel(SubForm, control))
				UserBufferAddText(GetControlTypeAndState(control, false))
			Else
				sayMessage (OT_CONTROL_NAME,GetControlLabel(SubForm, control))
				say(GetControlTypeAndState(control, false),ot_line)
			EndIf
		endIf
	endIf
	let index=index+1
endWhile
EndFunction

String Function GetControlTypeAndState (object control, int InOptionGroup)
; avoid error if control's parent is a form and attempt to look at ControlType property
; by passing InOptionGroup as int parameter,
; set to true if called from ReadOptionGroupActiveItem,
; set to false if called elseware.
var
	int type,
	int index,
	int UBound,
	string ctlInformation,
	string ctlType,
	string CtlState, ; used for checkboxes etc
	string ctlValue, ; text of control
	string ctlItemNumber, ; eg listbox items, 1 of 3, etc
	int MSAAControlType
let type =control.controlType
let ctlType=cscNull
let CtlState=cscNull
let ctlValue=cscNull
let ctlItemNumber=cscNull
if type == 115 then
	SaveCursor()
	JawsCursor()
	RouteJawsToPC()
	let MSAAControlType = GetObjectSubTypeCode(TRUE)
	if MSAAControlType == WT_COMBOBOX then
		let type =  acComboBox
	elif MSAAControlType == WT_EDIT then
		let type = acTextBox
	EndIf
	restoreCursor()
EndIf
if type==acLabel	then
 let ctlType=msgTxtAcLabel1
elif type==acRectangle then
 let ctlType=msgTxtAcRectangle1
elif type==acLine then
 let ctlType=msgTxtAcLine1
elif type==acImage then
 let ctlType=msgTxtAcImage1
 let CtlState=control.picture
elif type==acCommandButton then
 let ctlType=msgTxtAcCommandButtonSpeech1
elif type==acOptionButton then
 if InOptionGroup then
 	if control.parent.Value==control.OptionValue then
 		;let CtlState=msg56_L "selected"
   let CtlState=cMsg_checked
  else
			let CtlState=cMsg_notChecked
 	endIf
 else
  if control.value==1 then
	 	;let CtlState=msg56_L
			let CtlState=cMsg_checked
  else
   let CtlState=cMsg_notChecked
  endIf
 endIf
 let ctlType=msgTxtAcOptionButtonSpeech1
elif type==acCheckBox then
 if InOptionGroup then
  if control.parent.value==control.OptionValue then
   let CtlState=cMsg_checked
  else
   let CtlState=cMsg_notChecked
  endIf
 else
  if control.value then
   let CtlState=cmsg_checked
  else
   let CtlState=cMsg_notChecked
  endIf
 endIf
 let ctlType=msgTxtAcCheckBox1
elif type==acOptionGroup then
 let ctlType=msgTxtAcOptionGroupSpeech1
elif type==acBoundObjectFrame then
 let ctlType=msgTxtAcBoundObjectFrame1
elif type==acTextBox then
 let ctlType=msgTxtAcTextboxSpeech1
 let CtlValue=control.text()
elif type==acListBox then
 let index=control.ListIndex+1
 let UBound=control.listCount
 if UBound then
		; note had to use following lines to get listbox selection
		; because itemData property was returning an integer rather than the data.
  ;msg491_L = "lstSelFlds"
  if control.name==scLblCtl35 then
			; this listbox is odd
   let ctlValue=control.column(2,control.ListIndex)
  else
   let ctlValue=control.column(1,control.ListIndex)
  endIf
		If ctlValue == cscNULL Then
			let 	ctlValue = GetObjectValue ()
		EndIf
		;msg492_L = " of "
	 let ctlItemNumber=formatString(msgItemNumber1, intToString(index), intToString(uBound))
 else
  let CtlValue=msg54_L ; "zero items"
 endIf
 let ctlType=msgTxtAcListBox1
elif type==acComboBox then
 let ctlType=msgTxtAcComboBox1
 let ctlValue=control.text
elif type==acSubform then
 let ctlType=msgTxtAcSubform1
elif type==acObjectFrame then
 let ctlType=msgTxtAcObjectFrame1
elif type==acPageBreak then
 let ctlType=msgTxtAcPageBreak1
elif type==acPage then
 let ctlType=msgTxtAcPage1
elif type==acCustomControl then
 let ctlType=msgTxtAcCustomControl1
elif type==acToggleButton then
 if InOptionGroup then
  if control.parent.value==control.OptionValue then
   ;msg55_L = "Pressed"
   let CtlState=msg55_L
  endIf
 else
  if control.value then
   ;msg55_L = "Pressed"
   let CtlState=msg55_L
  endIf
 endIf
 let ctlType=msgTxtAcToggleButton1
elif type==acTabCtl then
 let ctlType=msgTxtAcTabCtl1
endIf
if shouldItemSpeak(ot_control_type) then
	let ctlInformation=ctlType
endIf
if shouldItemSpeak(ot_item_state)
&& ctlState !=cscNull then
	if ctlInformation !=cscNull then
		let ctlInformation=ctlInformation+cscSpace+ctlState
	else
		let ctlInformation=ctlState
	endIf
endIf
if shouldItemSpeak(ot_selected_item)
&& ctlValue!=cscNull then
	if ctlInformation !=cscNull then
		let ctlInformation=ctlInformation+cscSpace+ctlValue
	else
		let ctlInformation=ctlValue
	endIf
endIf
if shouldItemSpeak(ot_item_number)
&& ctlItemNumber!=cscNull then
	if ctlInformation !=cscNull then
		let ctlInformation=ctlInformation+cscSpace+ctlItemNumber
	else
		let ctlInformation=ctlItemNumber
	endIf
endIf
if shouldItemSpeak(ot_item_state)
&& !control.enabled then
	let ctlInformation=ctlInformation+cscSpace
endIf
return ctlInformation
EndFunction

String Function GetControlPositionInGroup (object control, int InOptionGroup)
Var
	int iCount,
	int iPos,
	object oCtrl,
	int iIndex,
	int iCountCtls,
	int iType,
	object oChild
let oCtrl=oAccess.screen.activeControl
let iCount=oCtrl.controls.count
let iIndex=0
while iIndex < iCount
	let oChild=oCtrl.controls(iIndex)
	let iType=oChild.controlType
	if iType==acCheckbox
	|| iType==acOptionButton
	|| iType==acToggleButton then
		let iCountCtls = iCountCtls + 1
		let giCount=iCountCtls
		if oChild.OptionValue==oCtrl.value then
			let iPos = iCountCtls
			let giPos=iPos
		endIf
	endIf
	let iIndex=iIndex+1
endWhile
if iCountCtls
&& iIndex then
	return formatString (msgItemNumber1, intToString (iPos), intToString (iCountCtls))
Else
	return cscNull
EndIf
EndFunction

string function PositionInGroup (optional handle hWnd)
var
	int iType
if !hWnd
|| hWnd != GetFocus() then
	if ! getWindowSubtypeCode (getCurrentWindow ())
	&& IsAccessControl () then
		Let iType = getObjectSubtypeCode (TRUE)
		if iType == WT_RADIOBUTTON then
		;|| iType == WT_CHECKBOX then
			Return GetControlPositionInGroup (oAccess.Screen.ActiveControl, TRUE);If in radio button, this should speak / get by group.
		endIf
	endIf
EndIf
return PositionInGroup (hWnd)
endFunction

Void Function ReadOptionGroupActiveItem (object gb,int iFlag)
var
	object control,
	int index,
	int count,
	string state,
	string tmpLbl
; If iFlag is true, text is added to user buffer.
; Otherwise, output type is determined by type of text to be spoken.
let count=gb.controls.count
; initialize gsOptionGroup to name and type
let gsOptionGroup=GetControlLabel(gb.parent, gb)+cscSpace+msgBrlAcOptionGroup1+cscSpace
let index=0
while index < count
	let Control=gb.controls(index)
	if control.controlType() !=acLabel
	&& control.OptionValue==gb.Value then
		; only want to announce the selected radio button or checked checkbox.
		let TmpLbl=GetControlLabel(gb, control)
		If iFlag then
			UserBufferAddText(TmpLbl)
		Else
			sayMessage(OT_control_name,TmpLbl)
		EndIf
		; build gsOptionGroup
		let gsOptionGroup=gsOptionGroup+TmpLbl
		; output types for type and state handled by getControlTypeAndState
		If iFlag then
			UserBufferAddText(GetControlTypeAndState(control, true))
		Else
			say (GetControlTypeAndState(control, true),ot_line)
		EndIf
		let state=GetBrlControlTypeAndState(control, true)
		If iFlag then
			UserBufferAddText(formatString(msgItemNumber1, intToString(giPos),intToString(giCount)))
		Else
			;SayFormattedMessage(ot_help,formatString(msgItemNumber1, intToString(giPos),intToString(giCount)))
			SayFormattedMessage (OT_HELP, GetControlPositionInGroup (Control, TRUE))
		EndIf
		let gsOptionGroup=gsOptionGroup+cscSpace+state+cscSpace
	endIf
	let index=index+1
endWhile
EndFunction

void function ReadActiveReport ()
var
	object oNull,
	object report,
	object control,
	int bReport, int bControl, ; bools verif obj / ctrl before adding text:
	int index,
	int count,
	int nControlType,
	int bControlVisible,
	string stmp,
	string sObjInfo,
	string sBuffer;
UserBufferDeactivate ()
UserBufferClear ()
let report=OAccess.screen.activeReport
Let bReport = (report != oNull)
Let sTmp = report.caption();name / title:
if ! stringIsBlank (stmp) then
	Let sBuffer = sTmp
	UserBufferAddText (stmp)
endIf
let count = report.controls.count
let index = 0
while index < count
 let control = report.controls(index)
 Let bControl = (control != oNull)
 Let nControlType = control.controlType
 Let bControlVisible = control.visible()
 if nControlType == acSubForm
 && bControlVisible then
 	ReadSubForm(control,true)
 elif nControlType == acOptionGroup then
  if bControlVisible then
			UserBufferAddText(GetControlLabel(report,control))
	  Let stmp = (GetControlTypeAndState(control,false))
  	if stmp then
	  	UserBufferAddText (stmp)
  	endIf
	 	ReadOptionGroupActiveItem(control,true)
 	endIf
 	let index=index+count
 Elif bControlVisible
  && nControlType != AcLabel
  && nControlType != AcLine
  && nControlType != acRectangle
  && nControlType != acImage then
  	Let sTmp = (GetControlLabel(report,control))
  	if ! StringIsBlank (stmp) then
  		UserBufferAddText (sTmp)
  	endIf
		Let stmp = (GetControlState(control,false))
		if sTmp then
			UserBufferAddText (stmp)
		endIf
 endIf
 let index=index+1
EndWhile
UserBufferAddText(cscBufferNewLine+cMsgBuffExit)
UserBufferActivate()
JAWSTopOfFile()
SayAll()
EndFunction

void function SelectFormControl ()
var
	object form,
	object control,
	int index,
	int selectedControlIndex,
	int count,
	string CtlList,
	string CtlName,
	string ctlCaption,
	string ctlState
let form=OAccess.screen.activeForm
if !form then
 sayFormattedMessage (ot_error, msg18_L) ;"Not on a form.",
 return
endIf
if ! isFormView() then
	sayFormattedMessage (ot_error, msg12_L)
	return
endIf
let count=form.controls.count
let index=0
while Index < count
	let control=form.controls(index)
 let CtlName=control.name
 if control.caption() !=cscNull then
  let ctlCaption=stripHKMarker(control.caption())
 endIf
	; note still need to list invisible controls because of the indexing.
 if !control.enabled
	|| !control.visible then
  let CtlState=msg15_L ; disabled
 endIf
 let CtlList=ctlList+list_item_separator+formatString(msgListItem1, ctlName, ctlCaption, ctlState)
 let index=index+1
EndWhile
; remove leading delimiter
let CtlList=stringChopLeft(CtlList,1)
let SelectedControlIndex=DlgSelectItemInList (CtlList, msg11_L, false)
if SelectedControlIndex then
	let control=form.controls(SelectedControlIndex-1)
	if control.enabled then
		if control.controlType==AcSubForm then ; allow selection from subform
			selectSubformControl(control)
	 	return
		else
	 	control.SetFocus
		endIf
	else ; not able to receive focus
		sayFormattedMessage (ot_error, formatString(msgCantFocus1_L, control.name), formatString(msgCantFocus1_S, control.name))
		return
 endIf
	sayFormattedMessage (OT_CONTROL_NAME, GetControlLabel(form, control))
	sayFormattedMessage (ot_screen_message, GetControlTypeAndState(control,false))
endIf
EndFunction

Void Function RefreshDatabases ()
oAccess.CurrentDb.tableDefs.refresh
pause()
oAccess.CurrentDb.containers.refresh
pause()
EndFunction

void function SpeakDatabaseSummary ()
var
	object db,
	object Doc,
	object container,
	int ContainerIndex,
	int ContainerCount,
	int docCount,
	int DocIndex,
	int UserObjects,
	string tmpStr ; used for saystrings to avoid multiple lines in speechbox mode
if !oAccess.currentDb then
 sayFormattedMessage (ot_error, msg26_L, msg26_S) ; No database information available.
 return
endIf
RefreshDatabases()
let db=oAccess.currentDb
let tmpStr=db.name
sayFormattedMessage (ot_help, formatString(msg21_L, tmpStr), formatString(msg21_S, tmpStr))
let ContainerCount=db.containers.count
let ContainerIndex=1 ; skip the databases container
while ContainerIndex < ContainerCount
 let Container=db.containers(ContainerIndex)
 if ! StringContains(scIgnoredContainers,container.name) then
  let DocCount=container.documents.count
  if DocCount > 0 then
   let DocIndex=0
   let UserObjects=0 ; only count user defined objects
   while DocIndex < DocCount
    let doc=container.documents(DocIndex)
			 ; only want to speak and count user defined objects
    if doc.owner !=scEngine
    && (!StringContains(doc.name, scMSys)
    && !StringContains(doc.name,scTilde)) then
    	let UserObjects=UserObjects+1
					; only want to say container name if at least one user object
					; this cannot be predetermined.
     if userObjects==1 then
      let tmpStr=container.name
      sayFormattedMessage (ot_help, formatString(msg22_L, tmpStr), formatString(msg22_S, tmpStr))
     endIf
     sayMessage(ot_document_name, Doc.name)
    endIf
    let DocIndex=DocIndex+1
   EndWhile
   if userObjects  then
    sayFormattedMessage (ot_help, formatString(msg25_L, IntToString(UserObjects)), formatString(msg25_S, intToString(userObjects)))
   endIf
  endIf
 endIf
 let ContainerIndex=ContainerIndex+1
endWhile
; now speak table and query summary
let DocCount=db.TableDefs.count
let docIndex=0
let userObjects=0
while docIndex < DocCount
 let doc=db.tableDefs(docIndex)
 if doc.owner !=scEngine
 && (! StringContains(doc.name, scMSys)
 && ! StringContains(doc.name,scTilde)) then
  let UserObjects=UserObjects+1
		; only want to say table name if at least one user object
		; this cannot be predetermined.
  if UserObjects==1 then
   sayMessage (ot_help, msg23_L, msg23_S)
	 endIf
  sayMessage(ot_document_name, Doc.name)
 endIf
 let DocIndex=DocIndex+1
endWhile
if userObjects > 0 then
 sayFormattedMessage (ot_help, formatString(msg25_L, IntToString(UserObjects)), formatString(msg25_S, intToString(userObjects)))
endIf
let DocIndex=0
let docCount=db.QueryDefs.count
let userObjects=0
while docIndex < DocCount
 let doc=db.queryDefs(docIndex)
 if doc.owner !=scEngine
 && (! StringContains(doc.name, scMSys)
 && ! StringContains(doc.name,scTilde)) then
  let UserObjects=UserObjects+1
		; only want to say query name if at least one user object
		; this cannot be predetermined.
  if UserObjects==1 then
   sayMessage (ot_help, msg24_L, msg24_S)
  endIf
	 sayMessage(ot_document_name,Doc.name)
 endIf
 let DocIndex=DocIndex+1
endWhile
if userObjects  then
 sayMessage (ot_help, formatString(msg25_L, IntToString(UserObjects)), formatString(msg25_S, intToString(userObjects)))
endIf
EndFunction

String Function GetFieldType (int Type)
if giTableDesignView then
	if type==iDsgnFieldName then
		return msgDsgnFieldName
	elIf type==iDsgnDataType then
		return msgDsgnDataType
	elIf type==iDsgnDescription then
		return msgDsgnDescription
	endIf
endIf
if type==dbBigInt then
 return msgDbBigInt1 ; =16, ; "Big integer",
elif type==DbBinary then
 return msgDbBinary1 ; =9, ; "Binary",
elif type==DbBoolean then
 return msgDbBoolean1 ; =1, ; "Boolean",
elif type==dbByte then
 return msgDbByte1 ; =2, ; "Byte",
elif type==dbChar then
 return msgDbChar1 ; =18, ; "Char",
elif type==dbCurrency then
 return msgDbCurrency1 ; =5, ; "Currency",
elif type==dbDate then
 return msgDbDate1 ; =8, ; "Date/Time",
elif type==dbDecimal then
 return msgDbDecimal1 ; =20, ; "Decimal",
elif type==dbDouble then
 return msgDbDouble1 ; =7, ; "Double",
elif type==dbFloat then
 return msgDbFloat1 ; =21, ; "Float",
elif type==dbGid then
 return msgDbGid1 ; =15, ; "Gid",
elif type==dbInteger then
 return msgDbInteger1 ; =3, ; "integer",
elif type==dbLong then
 return msgDbLong1 ; =4, ; "Long",
elif type==dbLongBinary then
 return msgDbLongBinary1 ; =11, ; "Long Binary",
elif type==dbMemo then
 return msgDbMemo1 ; =12, ; "Memo",
elif type==dbNumeric then
 return msgDbNumeric1 ; =19, ; "Numeric",
elif type==dbSingle then
 return msgDbSingle1 ; =6, ; "Single",
elif type==dbText then
 return msgDbText1 ; =10, ; "Text",
elif type==dbTime then
 return msgDbTime1 ; =22, ; "Time",
elif type==dbTimeStamp then
 return msgDbTimeStamp1 ; =23, ; "Time Stamp",
elif type==dbVarBinary then
 return msgDbVarBinary1 ; =17, ; "Var Binary",
elif type==dbAutoNumber then
 return msgDbAutoNumber1 ; ="Auto number"
else
 return msgDbUnknown1
endIf
EndFunction

Void Function SpeakFieldInfo ()
var
	object db,
	object table,
	object fields,
	string TableName,
	string FieldName,
	string FieldSize,
	string fieldType,
	string fieldOrdinal,
	string fieldCount,
	string fieldOptional,
	int iUserBuffer,
	int iOutputType
let iUserBuffer=false
if UserBufferIsActive() then
	let iOutputType=ot_user_buffer
	let iUserBuffer=true
else
	let iOutputType=OT_USER_REQUESTED_INFORMATION
endIf
if GetWindowClass(GetRealWindow(GetFocus()))!=wc_OTable then
	if !iUserBuffer then
		sayFormattedMessage (ot_error, msg31_L, msg31_S) ; no table information available
	endIf
	return
endIf
if !oAccess.currentDb then
	if !iUserBuffer then
		sayFormattedMessage (ot_error, msg26_L, msg26_S) ; No database information available.
	endIf
	return
endIf
refreshDatabases()
let TableName=OAccess.screen.activeControl.parent.name
let db=oAccess.currentDb
let table=Db.tableDefs(TableName)
let fields=table.fields
if !fields.Count then
	if !iUserBuffer then
		sayFormattedMessage (ot_error, msg31_L, msg31_S) ; no table info available
	endIf
	return
endIf
let TableName=OAccess.screen.activeControl.parent.name
let FieldName=OAccess.screen.activeControl.name
if fields(FieldName).name !=cscNull then
	let fieldName=fields(fieldName).name
else
	let fieldName=formatString(msg30_L, TableName)
endIf
if !fields(fieldName).size then
	let fieldSize=formatString(msg33_L, IntToString(fields(fieldName).size))
else
	let fieldSize=msg32_L ; dynamic ;(memo fields etc.
endIf
if fields(FieldName).required then
	let fieldOptional=msg34_L
else
	let fieldOptional=msg35_L ; Optional
endIf
let fieldType=GetFieldType(fields(fieldName).type)
let fieldOrdinal=intToString(fields(FieldName).ordinalPosition)
let fieldCount=intToString(fields.count)
sayFormattedMessage(iOutputType,
	formatString(msg27_L, fieldName, tableName, fieldType, fieldSize, fieldOrdinal, fieldCount, fieldOptional),
	formatString(msg27_S, fieldName, tableName, fieldType, fieldSize, fieldOrdinal, fieldCount, fieldOptional))
endFunction

void function SpeakTableSummary ()
var
	object db,
	object table,
	object fields,
	object oField,
	string TableName,
	string sCurTableName,
	string fieldName,
	string fieldType,
	string fieldSize,
	int FieldCount,
	int FieldIndex,
	int iUserBuffer,
	int iOutputType
let iUserBuffer=false
if UserBufferIsActive() then
	let iOutputType=ot_user_buffer
	let iUserBuffer=true
else
	let iOutputType=ot_help
endIf
if GetWindowClass(GetRealWindow(GetFocus()))!=wc_OTable then
	if !iUserBuffer then
 	sayFormattedMessage (ot_error, msg31_L, msg31_S) ; no table information available
 endIf
 return
endIf
if !oAccess.CurrentDb then
	if iUserBuffer then
 	sayFormattedMessage (ot_error, msg26_L, msg26_S) ; No database information available.
 endIf
 return
endIf
refreshDatabases()
let TableName=OAccess.screen.activeControl.parent.name
let db=OAccess.currentDb
let table=db.tableDefs(TableName)
let sCurTableName=table.name
let fields=table.fields
fields.refresh
pause()
if !fields.Count then
	if iUserBuffer then
	 sayFormattedMessage (ot_error, msg31_L, msg31_S) ; no table info available
	endIf
 return
endIf
let fieldcount=fields.count
sayFormattedMessage (ot_help,
	formatString(msg28_L,sCurTablename,intToString(fieldCount)),
	formatString(msg28_S,sCurTableName, intToString(fieldCount))) ; table x has y fields.
let fieldIndex=0
while fieldIndex < FieldCount
	let oField=fields(FieldIndex)
	if oField.name !=cscNull then
		let fieldName=oField.name
	else
		let fieldName=formatString(msg30_L, TableName)
	endIf
	let fieldType=GetFieldType(oField.type)
	if fields(fieldName).size > 0 then
 	let fieldSize=formatString(msg33_L, IntToString(fields(fieldName).size))
	else
		let fieldSize=msg32_L ; dynamic ;(memo fields etc.
	endIf
	sayFormattedMessage(iOutputType,
		formatString(msg29_L, fieldName, fieldType, fieldSize),
		formatString(msg29_S, fieldName, fieldtype, fieldSize))
	let fieldIndex=FieldIndex+1
endWhile
EndFunction

String Function GetSectionName (int Section)
if section==AcDetail then
 return scAcDetail
elif section==AcHeader then
 return scAcHeader
elif section==AcFooter then
 return scAcFooter
elif section==AcPageHeader then
 return scAcPageHeader
elif section==AcPageFooter then
 return scAcPageFooter
elif section==AcGroupLevel1Header then
 return scAcGrpLvl1hdr
elif section==AcGroupLevel2Header then
 return scAcGrpLvl2Hdr
elif section==AcGroupLevel1Footer then
 return scAcGrpLvl1Ftr
elif section==AcGroupLevel2Footer then
 return scAcGrpLvl2Ftr
endIf
EndFunction

Int Function GetSection ()
var
	string sField,
	string sClass,
	handle hCurrent
let hCurrent=GetCurrentWindow()
SaveCursor()
invisibleCursor()
MoveToWindow(GetRealWindow(GetFocus()))
FindFirstAttribute (attrib_highlight)
let sClass=getWindowClass(hCurrent)
while sClass!=wc_OFormSub
&& FindNextAttribute (attrib_highlight)
 let sClass=GetWindowClass(hCurrent)
endWhile
let sField=stringLower(GetField())
restoreCursor()
if sField==scAcDetail then
 return acDetail
elif sField==scAcPageHeader then
 return AcPageHeader
elif sField==scAcPageFooter then
 return acPageFooter
elif sField==scAcGrpLvl1Hdr then
 return acGroupLevel1header
elif sField==scAcGrpLvl2Hdr then
 return acGroupLevel2Header
elif sField==scAcGrpLvl1Ftr then
 return AcGroupLevel1Footer
elif sField==scAcGrpLvl2Ftr then
 return acGroupLevel2Footer
; could be form or report header so put these tests last since could also be
;page header/footer whose test must be before this one
elif stringContains(sField,scAcHeader) then
 return acHeader
elif stringContains(sField,scAcFooter) then
 return acFooter
endIf
EndFunction

string Function GetParentName (int HostType)
var
	object form,
	object control,
	int index,
	int selectedControlIndex,
	int count,
	string CtlList,
	string CtlName,
	string ParentName
let parentName=cscNull
if hostType==acForm then
 let form=oAccess.screen.activeForm
elif hostType==acReport then
 let form=oAccess.screen.activeReport
else
 return parentName
endIf
let count=form.controls.count
if !count  then
 return parentName
endIf
let index=0
while Index < count
	let control=form.controls(index)
 let CtlName=control.name
 let CtlList=ctlList+list_item_separator+CtlName
 let index=index+1
EndWhile
let CtlList=CtlList+list_item_separator+msgNoParentOption1
sayFormattedMessage (ot_smart_help, msg8_L) ; Select No Parent if you do not want to select a parent control
; remove leading delimiter
let CtlList=stringChopLeft(CtlList,1)
let SelectedControlIndex=0
; avoid dlg appearing and disappearing without allowing selection
while ! selectedControlIndex
 delay(1)
 let SelectedControlIndex=DlgSelectItemInList (CtlList, msg9_L, false)
EndWhile
; check exit condition: NoParentOption selected
if SelectedControlIndex==(count+1) then
 return cscNull
endIf
if SelectedControlIndex then
 let ParentName= form.controls(SelectedControlIndex-1).name
endIf
return parentName
EndFunction

void function SelectToolboxControl ()
var
	int HostType, ; set to acForm or AcReport
	int index,
	string formName,
	object host, ; either form or report
	int ControlType,
	object createdControl,
	object createdLabel,
	int autoCreateLabel,
	int section,
	string parent, ; parent's name
	string tools
let Tools=msgTxtAcLabel1+list_item_separator+
	msgTxtAcRectangle1+list_item_separator+
	msgTxtAcLine1+list_item_separator+
	msgTxtAcImage1+list_item_separator+
	msgTxtAcCommandButton1+list_item_separator+
	msgTxtAcOptionButton1+list_item_separator+
	msgTxtAcCheckBox1+list_item_separator+
	msgTxtAcOptionGroup1+list_item_separator+
	msgTxtAcBoundObjectFrame1+list_item_separator+
	msgTxtAcTextBox1+list_item_separator+
	msgTxtAcListBox1+list_item_separator+
	msgTxtAcComboBox1+list_item_separator+
	msgTxtAcSubform1+list_item_separator+
	msgTxtAcObjectFrame1+list_item_separator+
	msgTxtAcPageBreak1+list_item_separator+
	msgTxtAcPage1+list_item_separator+
	msgTxtAcCustomControl1+list_item_separator+
	msgTxtAcToggleButton1+list_item_separator+
	msgTxtAcTabCtl1
if !isDesignView() then
	sayFormattedMessage (ot_help, msg40_L) ; not in report or form design view
	return
endIf
if OAccess.screen.activeReport then
	let hostType=acReport
	let host=oAccess.screen.activeReport
elif GetWindowClass(globalFocusWindow)==wc_OForm
&& !OAccess.screen.activeForm.currentView then
	let hostType=acForm
	let host=oAccess.screen.activeForm
else
	sayFormattedMessage (ot_error, msg40_L) ; not in report or form design view
	return
endIf
let index=DlgSelectItemInList (Tools, msg39_L, false)
if index==1 then
	let ControlType=acLabel
elif index==2 then
	let ControlType=acRectangle
elif index==3 then
	let ControlType=acLine
elif index==4 then
	let ControlType=acImage
elif index==5 then
	let ControlType=acCommandButton
elif index==6 then
	let ControlType=acOptionButton
elif index==7 then
	let controlType=acCheckBox
elif index==8 then
	let ControlType=acOptionGroup
elif index==9 then
	let ControlType=acBoundObjectFrame
elif index==10 then
	let ControlType=acTextBox
elif index==11 then
	let ControlType=acListBox
elif index==12 then
	let controlType=acComboBox
elif index==13 then
	let ControlType=acSubform
elif index==14 then
	let ControlType=acObjectFrame
elif index==15 then
	let controlType=acPageBreak
elif index==16 then
	let ControlType=acPage
elif index==17 then
	let controlType=acCustomControl
elif index==18 then
	let controlType=acToggleButton
elif index==19 then
	let controlType=acTabCtl
endIf
if ControlType then
	; get section to place control in
	let section=GetSection()
	let FormName=host.name
	if controlType==acLabel
	|| ControlType==acCheckbox
	|| ControlType==acOptionButton
	|| ControlType==acToggleButton then
		let parent=GetParentName(hostType)
		let autoCreateLabel=false
	else ; we will create a label control and automatically assign its parent property to the chosen control just created
		let parent=cscNull
		let autoCreateLabel=true
	endIf
	pause() ; give computer time to refocus on Access from Listbox DLG
	if HostType==acForm then
		let createdControl=OAccess.CreateControl(formname, controlType, section, parent)
		; create a label if necessary
		if autoCreateLabel then
			let createdLabel=OAccess.CreateControl(formname, acLabel, section, createdControl.name)
		endIf
		Pause()
		if ! createdControl then
			sayFormattedMessage (ot_error, msg38_L) ; no control created
			return
		endIf
	elif hostType==acReport then
		let createdControl=OAccess.CreateReportControl(formname, controltype, section, parent)
		if autoCreateLabel then
			let createdLabel=OAccess.CreateReportControl(formname, acLabel, section, createdControl.name)
		endIf
		pause()
		if ! createdControl then
			sayFormattedMessage (ot_error, msg38_L) ; no control created
			return
		endIf
	endIf
	if autoCreateLabel
	&& createdLabel then
		sayFormattedMessage (ot_smart_help, formatString(msg36_L, createdControl.name, createdLabel.name, GetSectionName(host.controls(host.controls.count()-1).section)), formatString(msg36_S, createdControl.name, createdLabel.name, GetSectionName(host.controls(host.controls.count-1).section)))
	elif createdControl then
		sayFormattedMessage (ot_smart_help, formatString(msg37_L, createdControl.name, GetSectionName(host.controls(host.controls.count-1).section)), formatString(msg37_S, createdControl.name, GetSectionName(host.controls(host.controls.count-1).section)))
	endIf
endIf
EndFunction

Void Function SpeakRelationship ()
var
	handle hWnd,
	int RelFound,
	object db,
	object relations,
	object rel,
	object fields,
	int fieldCount,
	int fieldIndex,
	int count,
	int index,
	string tmpStr,
	string TableName,
	string FieldName
let hWnd=GetFocus()
if GetWindowClass(GetParent(GetParent(GetParent(hWnd)))) !=wc_OSysRel then
	return
endIf
if !OAccess.currentDb then
	; this speech is now irrelevant:
	;sayFormattedMessage (ot_error, msg46_L, msg46_S) ; "Not on relationships screen."
	return
endIf
let db=OAccess.currentDb
let relations=db.relations
let count=relations.count
;AddToScriptCallStackLogEX ("count is "+intToString (count))
let index=0
; getChunk and GetLine fail on some video cards on the first item in a listbox.
; so use getWindowText.
;let FieldName=GetWindowText (hWnd, true)
;OSM is useless: use MSAA here
let FieldName=GetObjectName (true)
let TableName=GetWindowName(GetRealWindow(hWnd))
while index < count
	let RelFound=false
	let rel=relations(index)
	if tableName==rel.table() then
		let fieldCount=rel.fields.count
		let fieldIndex=0
		while fieldIndex < fieldCount
			if rel.fields(FieldIndex).name==FieldName then
				let relFound=true
				let FieldIndex=FieldCount
			endIf
			let FieldIndex=FieldIndex+1
		endWhile
		if relFound then
			let TmpStr=rel.foreignTable
			if shouldItemSpeak(ot_help)==message_long then
				SayUsingVoice(vctx_message, formatString(msg44_L, fieldName, tablename, tmpStr), ot_help)
			elif shouldItemSpeak(ot_help)==message_short then
				SayUsingVoice(vctx_message, formatString(msg44_S, fieldName, tmpStr), ot_help)
			endIf
		endIf
	elif TableName==rel.foreignTable then
		let fieldCount=rel.fields.count
		let fieldIndex=0
		while fieldIndex < fieldCount
			if rel.fields(FieldIndex).foreignName==FieldName then
				let relFound=true
				let FieldIndex=FieldCount
			endIf
			let FieldIndex=FieldIndex+1
		endWhile
		if relFound then
			let tmpstr=rel.Table
if shouldItemSpeak(ot_help)==message_long then
				SayUsingVoice(vctx_message, formatString(msg45_L, fieldName, tablename, tmpStr), ot_help)
			elif shouldItemSpeak(ot_help)==message_short then
				SayUsingVoice(vctx_message, formatString(msg45_S, fieldName, tmpStr), ot_help)
			endIf
		endIf
	endIf
	let index=index+1
endWhile
EndFunction

int Function InTblProperties ()
var
	int vertDistance,
	handle hWnd
let hWnd=GetFocus()
let VertDistance=GetWindowTop(GetParent(hWnd))-getWindowTop(GetRealWindow(hWnd))
; only reliable way of determining if in properties panel of table design view
return VertDistance > kiTblPropertyVertDist
EndFunction

int Function isFormView()
var
	object MenuItem
let MenuItem=oAccess.CommandBars(scMnuView).controls(scOptFormView)
if MenuItem.state==-1 then
	return true
else
	return false
EndIf
EndFunction

int Function IsDesignView()
var
	object MenuItem
let MenuItem=oAccess.CommandBars(scMnuView).controls(scOptDesignView)
if MenuItem.state==-1 then
	Let giTableDesignView = true
	return true
else
	Let giTableDesignView = false
	return false
EndIf
EndFunction

int Function IsSQLView()
var
	object MenuItem
let MenuItem=oAccess.CommandBars(scMnuView).controls(scOptSQLView)
if MenuItem.state==-1 then
	return true
else
	return false
EndIf
EndFunction

Int Function ControlIsDetachedLabel (object form, object label)
; this function is used to determine which labels on a form
; are not associated with other controls but just
; provide descriptive or helpful information
var
	int index,
	int result,
	string compare
let result = true ; set to false is we know for sure that a label is associated with a control
let compare=label.name
; check known labels
; hardcoded in GetControlLabel
; only relevant in wizard screens
if giInWizard then
 if stringsEqual(compare,scLblCtl34)  ; "text517"
 || stringsEqual(compare,scLblCtl1) ; "text531"
 || stringsEqual(compare,scLblCtl3) ; "LblRelTbl"
 || stringsEqual(compare,scLblCtl8)  ; "lblfr0"
 || stringsEqual(compare,scLblCtl10) ; "lblfr8"
 || stringsEqual(compare,scLblCtl12)  ; "lblfr6"
 || stringsEqual(compare,scLblCtl30)  ; "Text150"
 || stringsEqual(compare,scLblCtl14)  ; "Text162"
 || stringsEqual(compare,scLblCtl16)  ; "text164"
 || stringsEqual(compare,scLblCtl18)  ; "text161"
 || stringsEqual(compare,scLblCtl20)  ; "text507"
 || stringsEqual(compare,scLblCtl21)  ; "Label179"
 || stringsEqual(compare,scLblCtl33) ; "Label1"
 || stringsEqual(compare,scLblCtl27)  ; "lblStylePrompt"
 || stringsEqual(compare,scLblCtl28) ; "LblLstStyles"
 || stringContains(compare, scLblCtl31)  ; scLblCtl31= "lblRowHdr"
 || StringContains(compare, scLblCtl32) then ; scLblCtl32="lblColHdr"
  let result=false ; these are all associated with known controls
 endIf
endIf
; this next test assumes a label control whose parent's name contains the letters frm
; indicating form, is a detached label,
;otherwise the label's parent would point to a non form control.
;msg486 = "frm"
if result
&& StringContains(stringLower(label.parent.name),scFormPrefix) then
 let result=true
; a label's parent property should always point to the control it is labelling.
; so if it points to the parent form, then it is detached.
elif label.parent.name==form.name then
	let result=true
else
	let result=false
endIf
return result
EndFunction

String Function stripHKMarker (string caption)
var
	int markerPos,
	int captionLength
; scHotkeyMarker="&"
let MarkerPos=stringContains(caption, scHotkeyMarker)
let captionLength=stringLength(caption)
if markerPos then
	return subString(caption,1,markerpos-1)+substring(caption,markerPos+1,captionLength)
else
	return caption
endIf
EndFunction

int function DesignFieldType()
var
	handle hwnd,
	int iResult

if giInTable
&& giTableDesignview then
	SaveCursor()
	InvisibleCursor()
	RouteInvisibleToPC()
	let hwnd=GetCurrentWindow()
	if FindString(hwnd,scDsgnFieldName,s_Bottom,s_unrestricted) then
		let iResult=iDsgnFieldName
	elif FindString(hwnd,scDsgnDataType,s_Bottom,s_unrestricted) then
		let iResult=iDsgnDataType
	elif FindString(hwnd,scDsgnDescription,s_Bottom,s_unrestricted) then
		let iResult=iDsgnDescription
	else
		let iResult=false
	endIf
endIf
restoreCursor()
PCCursor()
return iResult
EndFunction