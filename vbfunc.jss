; scripts for Microsoft Visual Basic 6.0 Environment
; Copyright (C) 2000-2015 by Freedom Scientific, Inc.
; Note this file contains object model related functions used by the Visual Basic 6 and Visual Basic Environment accessed from MSOffice 97/2000 applications.

include "hjconst.jsh"
include "hjglobal.jsh"
include "common.jsm"
include "vbfunc.jsh"
include "vb6.jsh"
include "vb6.jsm"

void function autoStartEvent()
var
object app
let oVB=GetObject(VBIDE)
if oVB then
; We've got the Visual Basic 6.0 IDE instance
	let isVB6Ide=true
	SayFormattedMessage (ot_app_start, msgVB1_L)
	return
endIf
; attempt to distinguish which instance of the VBE is running
; We can only check instances running under Microsoft Office.
if !app then
	let app=getObject(wordApp)
endIf
if !app then ; try Excel
	let app=getObject(excelApp)
endIf
if !app then
; try Powerpoint
	let app=getObject(powerpointApp)
endIf
if !app then
; Try Access
	let app=getObject(accessApp)
endIf
; Try MSProject
if !app then
	let app=getObject(projectApp)
endIf
if !app then
; try Outlook
	let app=getObject(outlookApp)
;	if app then
;		SayFormattedMessage(ot_error, msgOutlookWarning1_L, msgOutlookWarning1_S)
;		return
;	endIf
endIf

if app then ;
	SayFormattedMessage (ot_app_start, formatString(msgVBE1_L, app.name))
	let oVb=app.vbe
	let isVB6Ide=false ; this is an instance of an editor started from an MSOffice App
	endIf
endFunction


void function setAppObject ()
if !oVB then
	autoStartEvent()
endIf
EndFunction

void function autoFinishEvent()
let oVb=null
endFunction

string Function getVBWindowTypeDesc (object window)
var
int type
let type=window.type
if type==vbext_wt_CodeWindow then
	return msgWt1_L
elif type==vbext_wt_Designer then
	return msgWt2_L
elif type==vbext_wt_Browser then
	return msgWt3_L
elif type==vbext_wt_Watch then
	return msgWt4_L
elif type==vbext_wt_Locals then
	return msgWt5_L
elif type==vbext_wt_Immediate then
	return msgWt6_L
elif type==vbext_wt_ProjectWindow then
	return msgWt7_L
elif type==vbext_wt_PropertyWindow then
	return msgWt8_L
elif type==vbext_wt_Find then
	return msgWt9_L
elif type==vbext_wt_FindReplace then
	return msgWt10_L
elif type==vbext_wt_Toolbox then
	return msgWt11_L
elif type==vbext_wt_LinkedWindowFrame then
	return msgWt12_L
elif type==vbext_wt_MainWindow then
	return msgWt13_L
elif type==vbext_wt_Preview then
	return msgWt14_L
elif type==vbext_wt_ColorPalette then
	return msgWt15_L
elif type==vbext_wt_ToolWindow then
	return msgWt16_L
endIf
EndFunction

Void Function addMSFormControlToForm ()
var
string msFormsControls,
int choice,
string progId,
object selectedVBComponent,
object tmpControl

let selectedVBComponent=oVB.selectedVBComponent
if selectedVBComponent.type !=vbext_ct_MSForm then
	return
endIf
let msFormsControls=msFormsCheckBox+ list_item_separator + ; "CheckBox",
msFormsComboBox+ list_item_separator + ; "ComboBox",
msFormsCommandButton+ list_item_separator + ; "CommandButton",
msFormsFrame+ list_item_separator + ; "Frame",
msFormsImage+ list_item_separator + ; "Image",
msFormsLabel+ list_item_separator + ; "Label",
msFormsListBox+ list_item_separator + ; "ListBox",
msFormsMultiPage+ list_item_separator + ; "MultiPage",
msFormsOptionButton+ list_item_separator + ; "OptionButton",
msFormsScrollBar+ list_item_separator + ; "ScrollBar",
msFormsSpinButton+ list_item_separator + ; "SpinButton",
msFormsTabStrip+ list_item_separator + ; "TabStrip",
msFormsTextBox+ list_item_separator + ; "TextBox",
msFormsToggleButton ; "ToggleButton"

let choice=DlgSelectItemInList (msFormsControls, msgMSFormsControls1_L,false)
let progId=formatString(msFormsProgId, stringSegment (msFormsControls, list_item_separator, choice))
let tmpControl=selectedVBComponent.designer.controls.add(progId)
if tmpControl then
	SayFormattedMessage (ot_JAWS_message, formatString(msgAddedToForm1_L, tmpControl.name))
	tmpControl.setFocus
endIf
EndFunction
/* this doesn't work so we've rewritten it below using the toolbox graphics
Void Function addVBControlToForm ()
var
string VBCtrls,
int choice,
string progId,
object selectedVBComponent,
object tmpControl

let selectedVBComponent=oVB.selectedVBComponent
if selectedVBComponent.type !=vbext_ct_VBForm && selectedVBComponent.type!=vbext_ct_vbMdiForm then
	SayFormattedMessage (ot_no_disable, msgNotAVBFormDesigner1_L)
	return
endIf
let VBCtrls=VBCheckBox+list_item_separator+ ; "CheckBox",
VBComboBox+list_item_separator+ ; "ComboBox",
VBCommandButton+list_item_separator+ ; "CommandButton",
VBData+list_item_separator+ ; "Data",
VBDirListBox+list_item_separator+ ; "DirListBox",
VBDriveListBox+list_item_separator+ ; "DriveListBox",
VBFileListBox+list_item_separator+ ; "FileListBox",
VBFrame+list_item_separator+ ; "Frame",
VBHScrollBar+list_item_separator+ ; "HScrollBar",
VBImage+list_item_separator+ ; "Image",
VBLabel+list_item_separator+ ; "Label",
VBLine+list_item_separator+ ; "Line",
VBListBox+list_item_separator+ ; "ListBox",
VBOLE+list_item_separator+ ; "OLE",
VBOptionButton+list_item_separator+ ; "OptionButton",
VBPictureBox+list_item_separator+ ; "PictureBox",
VBPropertyPage+list_item_separator+ ; "PropertyPage",
VBShape+list_item_separator+ ; "Shape",
VBTextBox+list_item_separator+ ; "TextBox",
VBTimer+list_item_separator+ ; "Timer",
VBVScrollBar ; "VScrollBar"

let choice=DlgSelectItemInList (VBCtrls, msgVBControls1_L,false)
let progId=formatString(vbClassProgId,StringSegment (VBCtrls, list_item_separator, choice))
let tmpControl=selectedVBComponent.designer.VbControls.add(progId)
if tmpControl then
	SayFormattedMessage (ot_JAWS_message, formatString(msgAddedToForm1_L, tmpControl.controlObject.name))
	tmpControl.setFocus
endIf
EndFunction
*/


int Function toolboxHelper(int nLeft,int nTop,int nRight,int nBottom)
var
int iGraphicId,
string sToolName,
int iSafety

SaveCursor()
		InvisibleCursor()
MoveTo (nLeft,nBottom-1)
if getWord()==cscNull then
	refreshWindow(getCurrentWindow())
	delay(1)
endIf
if stringLeft(getWord(),stringLength(scToolUnlabeled))==scToolUnlabeled then
	let iGraphicId=getGraphicId()
	saveCursor()
	JAWSCursor()
	routeJAWSToInvisible()
	let iSafety=12
	while strLastTooltip==cscNull && iSafety
	delay(1)
	let iSafety=iSafety-1
		if getCursorCol() < nRight then
; slowly move mouse over tool
; if we don't do this the tooltip won't be triggered
			mouseRight(1)
		endIf
	endWhile
	let sToolName=strLastToolTip
	if sToolName!=cscNull then
		SetGraphicLabel(iGraphicId,strLastTooltip, TRUE)
		let gsToolsList=gsToolsList+list_item_separator+sToolName
	let gsToolsX=gsToolsX+list_item_separator+intToString(nLeft)
	let gsToolsY=gsToolsY+list_item_separator+intToString(nBottom-1)
		let strLastTooltip=cscNull
	endIf
	restoreCursor()
elif getWord()!=cscNull then
	let gsToolsList=gsToolsList+list_item_separator+getWord()
	let gsToolsX=gsToolsX+list_item_separator+intToString(nLeft)
	let gsToolsY=gsToolsY+list_item_separator+intToString(nBottom-1)
endIf
RestoreCursor()
return true
EndFunction

void function addVBControlToForm()
var
object windows,
int index,
int count,
int choice,
int iFoundIt,
string sTool,
int iX,
int iY,
int iProcessTooltips,
int iIncludeGraphics

let windows=oVB.windows
let index=1
let count=windows.count
while index <=count
	if windows(index).type==vbext_wt_toolWindow && windows(index).visible then
		windows(index).setFocus
		let iFoundIt=true
	endIf
	let index=index+1
endWhile
if not iFoundIt then
SayFormattedMessage (ot_error, msgToolboxNotVisible1_L)
	return
endIf
let strLastTooltip = cscNull
let iProcessTooltips= GetJcfOption (OPT_PROCESSTOOLTIPEVENT)
let iIncludeGraphics = GetJcfOption(OPT_INCLUDE_GRAPHICS)
SetJcfOption (OPT_PROCESSTOOLTIPEVENT, TRUE)
SetJcfOption (OPT_INCLUDE_GRAPHICS, 2) ; all
let gsToolsList=cscNull
let gsToolsX=cscNull
let gsToolsY=cscNull
JAWSCursor()
moveTo(1,1) ; get it out of the way
pcCursor()
refreshWindow(getCurrentWindow())
delay(1)
GraphicsEnumerate (getCurrentWindow(), scToolboxHelper)
SetJcfOption (OPT_PROCESSTOOLTIPEVENT, iProcessTooltips)
SetJcfOption (OPT_INCLUDE_GRAPHICS, iIncludeGraphics)
; remove leading delimiters from strings
let gsToolsList=stringChopLeft(gsToolsList,1)
let gsToolsX=stringChopLeft(gsToolsX,1)
let gsToolsY=stringChopLeft(gsToolsY,1)

let choice=DlgSelectItemInList (gsToolsList, msgVBControls1_L, true)
pause()
if choice then
	let sTool=stringSegment(gsToolsList,list_item_separator,choice)
	let iX=stringToInt(stringSegment(gsToolsX,list_item_separator,choice))
	let iY=stringToInt(stringSegment(gsToolsY,list_item_separator,choice))
	JAWSCursor()
	refreshWindow(getCurrentWindow())
	moveTo(iX,iY)
	leftMouseButton()
	leftMouseButton()
	pause()
	pcCursor()
	sayActiveFormName()
	sayActiveControl()
	testActiveControlOverlap()
endIf
endFunction

Void Function selectToolboxControl ()
var
object selectedVBComponent
let selectedVBComponent=oVB.selectedVBComponent
if selectedVBComponent.type==vbext_ct_MSForm then
	addMSFormControlToForm()
elif selectedVBComponent.type==vbext_ct_vbForm || selectedVBComponent.type==vbext_ct_VBMdiForm then
	addVBControlToForm()
endIf
EndFunction

Void Function sayMSFormControl (object control)
say(control.name,ot_no_disable)
 testControlOverlap(Control,control.parent.controls,globalDetectOverlappingControls)
EndFunction


Void Function sayVBFormControl (object vbControl)
say(vbControl.controlObject.name,ot_no_disable)
 testControlOverlap(VBControl.controlObject,VBControl.collection,globalDetectOverlappingControls)
EndFunction

Void Function setFocusToMSFormControl ()
var
int count,
int index,
int choice,
object form,
string formName,
string ctlList,
string ctlName
let form=oVB.selectedVBComponent.designer
let index=0
let count=form.controls.count
if count==0 then
	SayFormattedMessage (ot_error, msgNoControlsOnForm1_L)
	return
endIf
while index < count
	let ctlName=form.controls(index).name
	let ctlList=ctlList+list_item_separator+ctlName
	let index=index+1
endWhile
;remove leading delimiter
let ctlList=stringChopLeft(ctlList,1)
let formName=oVB.selectedVBComponent.name
let ctlList=ctlList+list_item_separator+formName
let choice=DlgSelectItemInList (ctlList, msgSelectControl1_L, false)
if choice==count+1 then
; the form was selected
	form.click()
else
	form.controls(choice-1).setFocus
endIf
EndFunction

Void Function setFocusToVBFormControl ()
var
int count,
int index,
int choice,
object form,
string formName,
string ctlList,
string ctlName
let form=oVB.selectedVBComponent.designer
let index=1
let count=form.VBControls.count
if count==0 then
	SayFormattedMessage (ot_error, msgNoControlsOnForm1_L)
	return
endIf
while index <=count
	let ctlName=form.vbControls(index).controlObject.name
	let ctlList=ctlList+list_item_separator+ctlName
	let index=index+1
endWhile
;remove leading delimiter
let ctlList=stringChopLeft(ctlList,1)
let formName=oVB.selectedVBComponent.name
let ctlList=ctlList+list_item_separator+formName
let choice=DlgSelectItemInList (ctlList, msgSelectControl1_L, false)
if choice==count+1 then
; the form was selected
	form.selectedVBControls.clear
	form.click()
else
	form.vbControls(choice).controlObject.setFocus()
endIf
EndFunction

Void Function setFocusToFormControl ()
if isMSFormDesigner() then
	setFocusToMSFormControl()
elif isVBFormDesigner() then
	setFocusToVBFormControl()
endIf
EndFunction

Void Function isMSFormDesigner ()
return oVB.activeWindow.type==vbext_wt_Designer && oVB.selectedVBComponent.type==vbext_ct_MSForm && isPcCursor() && not menusActive() && not dialogActive()
EndFunction

int Function isVBFormDesigner ()
var
int componentType
let componentType=oVB.selectedVBComponent.type

return oVB.activeWindow.type==vbext_wt_Designer && (componentType==vbext_ct_VBForm || componentType==vbext_ct_vbMdiForm) && isPcCursor() && not menusActive() && not dialogActive()
EndFunction

int function isInAccessibleDesigner()
var
int type

let type=oVB.selectedVBComponent.type
return oVB.activeWindow.type==vbext_wt_designer &&
(type==vbext_ct_userControl ||
type==vbext_ct_docObject) &&
isPcCursor() && not menusActive() && not dialogActive()
endFunction

int function isActiveXDesigner()
return oVB.activeWindow.type==vbext_wt_Designer && oVB.selectedVBComponent.type==vbext_ct_activeXDesigner && isPcCursor() && not menusActive() && not dialogActive()
endFunction
int function isAddinDesigner()
return oVB.selectedVBComponent.designerId==VBAddinDesigner
endFunction

int function isDataReportDesigner()
return oVB.selectedVBComponent.designerId==vbDataReportDesigner
endFunction

int function isProjectWindow()
return oVB.activeWindow.type==vbext_wt_projectWindow && isPcCursor() && not menusActive() && not dialogActive()
endFunction

int function isMainWindow()
return oVB.activeWindow.type==vbext_wt_mainWindow && isPcCursor() && not menusActive() && not dialogActive()
endFunction

Void Function moveMSFormControlRight (int pixels)
var
object activeControl,
object controls,
int left

if isMSFormDesigner () then
	let activeControl=oVB.selectedVBComponent.designer.activeControl
	let controls=oVB.SelectedVBComponent.designer.controls
	let left=activeControl.left
	if left+activeControl.width+pixels <= activeControl.parent.left+activeControl.parent.width then
		let left=left+pixels
	else
		let left=activeControl.parent.left+activeControl.parent.width-activeControl.width
	endIf
	activeControl.move(left)
	if shouldItemSpeak(ot_position) then
		sayInteger(activeControl.left)
	endIf
	testControlOverlap(activeControl,controls,globalDetectOverlappingControls)
endIf
EndFunction

Void Function moveMsFormControlLeft (int pixels)
var
object activeControl,
object controls,
int left
if isMSFormDesigner () then
	let activeControl=oVB.selectedVBComponent.designer.activeControl
	let controls=oVB.SelectedVBComponent.designer.controls
	let left=activeControl.left
	if left >=activeControl.parent.left+pixels then
		let left=left-pixels
	else
		let left=activeControl.parent.left
	endIf
	activeControl.move(left)
	if shouldItemSpeak(ot_position) then
		sayInteger(activeControl.left)
	endIf
	testControlOverlap(activeControl,controls,globalDetectOverlappingControls)
endIf
EndFunction

Void Function moveMsFormControlUp (int pixels)
var
object activeControl,
object controls,
int top

if isMSFormDesigner() then
	let activeControl=oVB.selectedVBComponent.designer.activeControl
	let controls=oVB.SelectedVBComponent.designer.controls
	let top=activeControl.top
	if top >=activeControl.parent.top+pixels then
		let top=top-pixels
	else
		let top=activeControl.parent.top
	endIf
	activeControl.move(activeControl.left,top)
	if shouldItemSpeak(ot_position) then
		sayInteger(activeControl.top)
	endIf
	testControlOverlap(activeControl,controls,globalDetectOverlappingControls)
endIf
EndFunction

Void Function moveMsFormControlDown (int pixels)
var
object activeControl,
object controls,
int top

if isMSFormDesigner() then
	let activeControl=oVB.selectedVBComponent.designer.activeControl
	let controls=oVB.SelectedVBComponent.designer.controls
	let top=activeControl.top
	if top+activeControl.height+pixels <=activeControl.parent.top+activeControl.parent.height then
		let top=top+pixels
	else
		let top=activeControl.parent.top+activeControl.parent.height-activeControl.height
	endIf
	activeControl.move(activeControl.left,top)
	if shouldItemSpeak(ot_position) then
		sayInteger(activeControl.top)
	endIf
	testControlOverlap(activeControl,controls,globalDetectOverlappingControls)
endIf
EndFunction

int Function isPointInRect (int pointX, int pointY, int topLeftX, int topLeftY, int bottomRightX, int bottomRightY)
return (topLeftX <=pointX && pointX <=bottomRightX) && (topLeftY <=pointY && pointY <=bottomRightY)
EndFunction

int Function testControlOverlap (object control, object oCollection, int DescribeOverlap)
var
int index,
int count,
string controlName,
string testControlName,
int controlTopLeftX,
int controlTopLeftY,
int controlBottomRightX,
int controlBottomRightY,
int testTopLeftX,
int testTopLeftY,
int testBottomRightX,
int testBottomRightY,
int overlapFlag,
int atLeastOneOverlap,
string message

let globalBrlControlOverlapDesc=cscNull
if !control then
	return false
endIf
let atLeastOneOverlap=false
let index=0
let count=oCollection.count
let controlName=control.name
let controlTopLeftX=control.left
let controlTopLeftY=control.top
let controlBottomRightX=controlTopLeftX+control.width
		let controlBottomRightY=controlTopLeftY+control.height

let message=controlName
while index < count
	if oCollection(index).name !=control.name then
		if atLeastOneOverlap then
			let message=msgAnd1_L ; rather than repeating the control name for each overlap
		endIf
		let testControlName=oCollection(index).name
		let testTopLeftX=oCollection(index).left
		let testTopLeftY=oCollection(index).top
		let testBottomRightX=testTopLeftX+oCollection(index).width
		let testBottomRightY=testTopLeftY+oCollection(index).height
		; now do the overlap test
; Clear the flag
		let overlapFlag=0
		if isPointInRect(ControlTopLeftX,ControlTopLeftY,testTopLeftX,testTopLeftY,testBottomRightX,testBottomRightY) then
			let overlapFlag=overlapFlag+ctlVertexTopLeft
		endIf
		if isPointInRect(ControlBottomRightX,ControlTopLeftY,testTopLeftX,testTopLeftY,testBottomRightX,testBottomRightY) then
			let overlapFlag=overlapFlag + ctlVertexTopRight
		endIf
		if			isPointInRect(ControlTopLeftX,ControlBottomRightY,testTopLeftX,testTopLeftY,testBottomRightX,testBottomRightY) then
			let overlapFlag=overlapFlag + ctlVertexBottomLeft
		endIf
		if isPointInRect(ControlBottomRightX,ControlBottomRightY,testTopLeftX,testTopLeftY,testBottomRightX,testBottomRightY) then
			let overlapFlag=overlapFlag + ctlVertexBottomRight
		endIf
		if	isPointInRect(testTopLeftX,testTopLeftY,ControlTopLeftX,ControlTopLeftY,ControlBottomRightX,ControlBottomRightY) &&
			isPointInRect(testBottomRightX,testTopLeftY,ControlTopLeftX,ControlTopLeftY,ControlBottomRightX,ControlBottomRightY) &&
			isPointInRect(testTopLeftX,testBottomRightY,ControlTopLeftX,ControlTopLeftY,ControlBottomRightX,ControlBottomRightY) &&
			isPointInRect(testBottomRightX,testBottomRightY,ControlTopLeftX,ControlTopLeftY,ControlBottomRightX,ControlBottomRightY) then
			let overlapFlag=ctlCovered
		endIf

		if describeOverlap && overlapFlag then
			if overlapFlag==ctlCovered then
				SayFormattedMessage (ot_no_disable, formatString(msgIsCoveredBy1_L, message, testControlName))
				let globalBrlControlOverlapDesc=globalBrlControlOverlapDesc+cscSpace+formatString(msgIsCoveredBy1_L, message, testControlName)
			elif overlapFlag==ctlVertexTopLeft+ctlVertexTopRight+ctlVertexBottomRight+ctlVertexBottomLeft then
; totally covers test control
				SayFormattedMessage (ot_no_disable, formatString(msgIsOntopOf1_L, message, testControlName))
				let globalBrlControlOverlapDesc=globalBrlControlOverlapDesc+cscSpace+formatString(msgIsOntopOf1_L, message, testControlName)
			elif overlapFlag==ctlVertexTopLeft+ctlVertexTopRight then
				SayFormattedMessage (ot_no_disable, formatString(msgBottomEdge1_L, message, testControlName))
				let globalBrlControlOverlapDesc=globalBrlControlOverlapDesc+cscSpace+formatString(msgBottomEdge1_L, message, testControlName)
			elif overlapFlag==ctlVertexTopRight+ctlVertexBottomRight then
				SayFormattedMessage (ot_no_disable, formatString(msgLeftEdge1_L, message, testControlName))
				let globalBrlControlOverlapDesc=globalBrlControlOverlapDesc+cscSpace+formatString(msgLeftEdge1_L, message, testControlName)
			elif overlapFlag==ctlVertexBottomRight+ctlVertexBottomLeft then
				SayFormattedMessage (ot_no_disable, formatString(msgTopEdge1_L, message, testControlName))
				let globalBrlControlOverlapDesc=globalBrlControlOverlapDesc+cscSpace+formatString(msgTopEdge1_L, message, testControlName)
			elif overlapFlag==ctlVertexBottomLeft+ctlVertexTopLeft then
				SayFormattedMessage (ot_no_disable, formatString(msgRightEdge1_L, message, testControlName))
				let globalBrlControlOverlapDesc=globalBrlControlOverlapDesc+cscSpace+formatString(msgRightEdge1_L, message, testControlName)
			elif overlapFlag==ctlVertexTopLeft then
				SayFormattedMessage (ot_no_disable, formatString(msgBottomRightCorner1_L, message, testControlName))
				let globalBrlControlOverlapDesc=globalBrlControlOverlapDesc+cscSpace+formatString(msgBottomRightCorner1_L, message, testControlName)
			elif overlapFlag==ctlVertexTopRight then
				SayFormattedMessage (ot_no_disable, formatString(msgBottomLeftCorner1_L, message, testControlName))
				let globalBrlControlOverlapDesc=globalBrlControlOverlapDesc+cscSpace+formatString(msgBottomLeftCorner1_L, message, testControlName)
			elif overlapFlag==ctlVertexBottomRight then
				SayFormattedMessage (ot_no_disable, formatString(msgTopLeftCorner1_L, message, testControlName))
				let globalBrlControlOverlapDesc=globalBrlControlOverlapDesc+cscSpace+formatString(msgTopLeftCorner1_L, message, testControlName)
			elif overlapFlag==ctlVertexBottomLeft then
				SayFormattedMessage (ot_no_disable, formatString(msgTopRightCorner1_L, message, testControlName))
				let globalBrlControlOverlapDesc=globalBrlControlOverlapDesc+cscSpace+formatString(msgTopRightCorner1_L, message, testControlName)
			endIf
			let atLeastOneOverlap=true
		endIf
	endIf
	let index=index+1
endWhile
return atLeastOneOverlap
EndFunction

int Function testVBControlOverlap (object VBControl, object vbControls, int DescribeOverlap)
var
int index,
int count,
string controlName,
string containerName,
string testControlName,
int controlTopLeftX,
int controlTopLeftY,
int controlBottomRightX,
int controlBottomRightY,
int testTopLeftX,
int testTopLeftY,
int testBottomRightX,
int testBottomRightY,
int overlapFlag,
int atLeastOneOverlap,
string message,
object control
let globalBrlControlOverlapDesc=cscNull
let control=vbControl.controlObject
if !control then
	return false
endIf
let containerName=control.container.name
let atLeastOneOverlap=false
; VBControls collection is 1 based.
let index=1
let count=vbControls.count
let controlName=control.name
let controlTopLeftX=control.left
let controlTopLeftY=control.top
let controlBottomRightX=controlTopLeftX+control.width
let controlBottomRightY=controlTopLeftY+control.height
if containerName!=oVB.SelectedVBComponent.name then
	SayFormattedMessage(ot_help, formatString(msgIsContainedWithin1_L, controlName, containerName, containerName), formatString(msgIsContainedWithin1_S, controlName, containerName))
let globalBrlControlOverlapDesc=cscSpace+formatString(msgIsContainedWithin1_S, controlName, containerName)
	let message=msgAnd1_L
else
	let message=controlName
endIf
while index <=count
; note we don't report when form controls overlap the menu items
	if (vbControls(index).controlObject.name !=control.name) && (vbControls(index).className!=vbMenuClass) && vbControls(index).controlObject.container.name==containerName then
		if atLeastOneOverlap then
			let message=msgAnd1_L ; rather than repeating the control name for each overlap
		endIf
		let testControlName=vbControls(index).controlObject.name
		let testTopLeftX=vbControls(index).controlObject.left
		let testTopLeftY=vbControls(index).controlObject.top
		let testBottomRightX=testTopLeftX+vbControls(index).controlObject.width
		let testBottomRightY=testTopLeftY+vbControls(index).controlObject.height

		; now do the overlap test
; Clear the flag
		let overlapFlag=0
		if isPointInRect(ControlTopLeftX,ControlTopLeftY,testTopLeftX,testTopLeftY,testBottomRightX,testBottomRightY) then
			let overlapFlag=overlapFlag+ctlVertexTopLeft
		endIf
		if isPointInRect(ControlBottomRightX,ControlTopLeftY,testTopLeftX,testTopLeftY,testBottomRightX,testBottomRightY) then
			let overlapFlag=overlapFlag + ctlVertexTopRight
		endIf
		if			isPointInRect(ControlTopLeftX,ControlBottomRightY,testTopLeftX,testTopLeftY,testBottomRightX,testBottomRightY) then
			let overlapFlag=overlapFlag + ctlVertexBottomLeft
		endIf
		if isPointInRect(ControlBottomRightX,ControlBottomRightY,testTopLeftX,testTopLeftY,testBottomRightX,testBottomRightY) then
			let overlapFlag=overlapFlag + ctlVertexBottomRight
		endIf
		if	isPointInRect(testTopLeftX,testTopLeftY,ControlTopLeftX,ControlTopLeftY,ControlBottomRightX,ControlBottomRightY) &&
			isPointInRect(testBottomRightX,testTopLeftY,ControlTopLeftX,ControlTopLeftY,ControlBottomRightX,ControlBottomRightY) &&
			isPointInRect(testTopLeftX,testBottomRightY,ControlTopLeftX,ControlTopLeftY,ControlBottomRightX,ControlBottomRightY) &&
			isPointInRect(testBottomRightX,testBottomRightY,ControlTopLeftX,ControlTopLeftY,ControlBottomRightX,ControlBottomRightY) then
			let overlapFlag=ctlCovered
		endIf

		if describeOverlap && overlapFlag then
			if overlapFlag==ctlCovered then
				SayFormattedMessage (ot_no_disable, formatString(msgIsCoveredBy1_L, message, testControlName))
let globalBrlControlOverlapDesc=globalBrlControlOverlapDesc+cscSpace+formatString(msgIsCoveredBy1_L, message, testControlName)
			elif overlapFlag==ctlVertexTopLeft+ctlVertexTopRight+ctlVertexBottomRight+ctlVertexBottomLeft then
; is on top of test control
				SayFormattedMessage (ot_no_disable, formatString(msgIsOntopOf1_L, message, testControlName))
let globalBrlControlOverlapDesc=globalBrlControlOverlapDesc+cscSpace+formatString(msgIsOntopOf1_L, message, testControlName)
			elif overlapFlag==ctlVertexTopLeft+ctlVertexTopRight then
				SayFormattedMessage (ot_no_disable, formatString(msgBottomEdge1_L, message, testControlName))
let globalBrlControlOverlapDesc=globalBrlControlOverlapDesc+cscSpace+formatString(msgBottomEdge1_L, message, testControlName)
			elif overlapFlag==ctlVertexTopRight+ctlVertexBottomRight then
				SayFormattedMessage (ot_no_disable, formatString(msgLeftEdge1_L, message, testControlName))
let globalBrlControlOverlapDesc=globalBrlControlOverlapDesc+cscSpace+formatString(msgLeftEdge1_L, message, testControlName)
			elif overlapFlag==ctlVertexBottomRight+ctlVertexBottomLeft then
				SayFormattedMessage (ot_no_disable, formatString(msgTopEdge1_L, message, testControlName))
let globalBrlControlOverlapDesc=globalBrlControlOverlapDesc+cscSpace+formatString(msgTopEdge1_L, message, testControlName)
			elif overlapFlag==ctlVertexBottomLeft+ctlVertexTopLeft then
				SayFormattedMessage (ot_no_disable, formatString(msgRightEdge1_L, message, testControlName))
let globalBrlControlOverlapDesc=globalBrlControlOverlapDesc+cscSpace+formatString(msgRightEdge1_L, message, testControlName)
			elif overlapFlag==ctlVertexTopLeft then
				SayFormattedMessage (ot_no_disable, formatString(msgBottomRightCorner1_L, message, testControlName))
let globalBrlControlOverlapDesc=globalBrlControlOverlapDesc+cscSpace+formatString(msgBottomRightCorner1_L, message, testControlName)
			elif overlapFlag==ctlVertexTopRight then
				SayFormattedMessage (ot_no_disable, formatString(msgBottomLeftCorner1_L, message, testControlName))
let globalBrlControlOverlapDesc=globalBrlControlOverlapDesc+cscSpace+formatString(msgBottomLeftCorner1_L, message, testControlName)
			elif overlapFlag==ctlVertexBottomRight then
				SayFormattedMessage (ot_no_disable, formatString(msgTopLeftCorner1_L, message, testControlName))
let globalBrlControlOverlapDesc=globalBrlControlOverlapDesc+cscSpace+formatString(msgTopLeftCorner1_L, message, testControlName)
			elif overlapFlag==ctlVertexBottomLeft then
				SayFormattedMessage (ot_no_disable, formatString(msgTopRightCorner1_L, message, testControlName))
let globalBrlControlOverlapDesc=globalBrlControlOverlapDesc+cscSpace+formatString(msgTopRightCorner1_L, message, testControlName)
			endIf
			let atLeastOneOverlap=true
		endIf
	endIf
	let index=index+1
endWhile
return atLeastOneOverlap
EndFunction

int Function testActiveControlOverlap ()
var
object designer
let designer=oVB.selectedVBComponent.designer
if isMsFormDesigner() then
	return testControlOverlap(designer.activeControl,designer.controls,globalDetectOverlappingControls)
elif isVBFormDesigner() then
	return testVBControlOverlap(designer.selectedVBControls(0),designer.vbControls, globalDetectOverlappingControls)
endIf
EndFunction

Void Function sayActiveControlDimensions ()
var
object activeControl,
object controls,
int width,
int height

if isMSFormDesigner() then
	let activeControl=oVB.selectedVBComponent.designer.activeControl

	if !activeControl then
		SayFormattedMessage (ot_error, msgNoControlSelected1_L)
		return
	endIf

	let controls=oVB.selectedVBComponent.designer.controls
	let width=activeControl.width
	let height=activeControl.height
	SayFormattedMessage(ot_no_disable, formatString(msgControlDimensions1, activeControl.name, intToString(width), intToString(height)))
elif isVBFormDesigner() then
	let activeControl=oVB.selectedVBComponent.designer.selectedVBControls(0)

	if !activeControl then
		SayFormattedMessage (ot_error, msgNoControlSelected1_L)
		return
	endIf

	let controls=oVB.selectedVBComponent.designer.VBControls
	let width=activeControl.controlObject.width
	let height=activeControl.controlObject.height
	SayFormattedMessage(ot_no_disable, formatString(msgControlDimensions1, activeControl.controlObject.name, intToString(width), intToString(height)))
else
	return
endIf
EndFunction

void function sayActiveControlWidth ()
var
object activeControl,
object controls,
int width

if isMSFormDesigner() then
	let activeControl=oVB.selectedVBComponent.designer.activeControl

	if !activeControl then
		SayFormattedMessage (ot_error, msgNoControlSelected1_L)
		return
	endIf

	let width=activeControl.width
	SayFormattedMessage (ot_no_disable, formatString(msgWide1_L, intToString(width)))
elif isVBFormDesigner() then
	let activeControl=oVB.selectedVBComponent.designer.selectedVBControls(0)

	if !activeControl then
		SayFormattedMessage (ot_error, msgNoControlSelected1_L)
		return
	endIf

	let width=activeControl.controlObject.width
	SayFormattedMessage (ot_no_disable, formatString(msgWide1_L, intToString(width)))
else
	return
endIf
EndFunction


void function sayActiveControlHeight ()
var
object activeControl,
int height

if isMSFormDesigner() then
	let activeControl=oVB.selectedVBComponent.designer.activeControl

	if !activeControl then
		SayFormattedMessage (ot_error, msgNoControlSelected1_L)
		return
	endIf

	let height=activeControl.height
	SayFormattedMessage (ot_no_disable, formatString(msgHigh1_L, intToString(height)))
elif isVBFormDesigner() then
	let activeControl=oVB.selectedVBComponent.designer.selectedVBControls(0)

	if !activeControl then
		SayFormattedMessage (ot_error, msgNoControlSelected1_L)
		return
	endIf

	let height=activeControl.controlObject.height
	SayFormattedMessage (ot_no_disable, formatString(msgHigh1_L, intToString(height)))
else
	return
endIf
EndFunction

int Function isToolboxVisible ()
return oVB.selectedVBComponent.designer.showToolbox
EndFunction

int Function isPropertyWindowVisible ()
var
int count,
int index,
object windows

let windows=oVB.windows
let count=windows.count
let index=1
while index <=count
	if windows(index).type==vbext_wt_propertyWindow && windows(index).visible then
		return true
	endIf
	let index=index+1
endWhile
return false
EndFunction

Int Function getControlTabIndex (object control)
return control.tabIndex
EndFunction

object Function getFirstControlInTabOrder (object oCollection)
var
int index,
int count,
object null

let index=0
let count=oCollection.count
while index < count
	if oCollection(index).tabIndex==0 then
		return oCollection(index)
	endIf
	let index=index+1
endWhile
; couldn't find the control, return null
return null
EndFunction

object Function getLastControlInTabOrder (object oCollection)
var
object lastControl,
int currentLastIndex,
int index,
int count,
object null

let count=oCollection.count
let index=0
let lastControl=null
let currentLastIndex=0
while index < count
	if oCollection(index).tabIndex >=currentLastIndex then
		let lastControl=oCollection(index)
		let currentLastIndex=lastControl.tabIndex
	endIf
	let index=index+1
endWhile
return lastControl
EndFunction

object Function getNextControlInTabOrder (object currentControl)
var
int currentTabIndex,
object controls,
object firstControl,
int index,
int count

let currentTabIndex=currentControl.tabIndex
let controls=currentControl.parent.controls
; find the control in the collection whose tab order is one more
let count=controls.count
let index=0
while index < count
	if controls(index).tabIndex==currentTabIndex+1 then
		return controls(index)
	elif controls(index).tabIndex==0 then
		let firstControl=controls(index)
	endIf
	let index=index+1
endWhile
return firstControl
EndFunction

object Function getPriorControlInTabOrder (object currentControl)
var
int currentTabIndex,
object controls,
object lastControl,
int index,
int count,
int currentLastTabIndex

let currentTabIndex=currentControl.tabIndex
let currentLastTabIndex=0
let controls=currentControl.parent.controls
; find the control in the collection whose tab order is one more
let count=controls.count
let index=0
while index < count
	if controls(index).tabIndex==currentTabIndex-1 then
		return controls(index)
	elif controls(index).tabIndex >=currentLastTabIndex then
		let lastControl=controls(index)
		let currentLastTabIndex=lastControl.tabIndex
	endIf
	let index=index+1
endWhile
return lastControl
EndFunction

Void Function setFocusToNextControl ()
var
object nextControl

if isMSFormDesigner() then
	let nextControl=getNextControlInTabOrder(oVB.selectedVBComponent.designer.activeControl)
	nextControl.setFocus()
	return
endIf
EndFunction

Void Function setFocusToPriorControl ()
var
object priorControl

if isMSFormDesigner() then
	let PriorControl=getPriorControlInTabOrder(oVB.selectedVBComponent.designer.activeControl)
	priorControl.setFocus()
	return
endIf
EndFunction

Void Function setFocusToFirstControl ()
var
object firstControl

if isMSFormDesigner() then
	SayFormattedMessage (ot_JAWS_message, msgFirstControl1_L)
	let firstControl=getFirstControlInTabOrder(oVB.selectedVBComponent.designer.controls)
	firstControl.setFocus()
	return
endIf
EndFunction

Void Function setFocusToLastControl ()
var
object lastControl

if isMSFormDesigner() then
	SayFormattedMessage (ot_JAWS_message, msgLastControl1_L)
	let lastControl=getLastControlInTabOrder(oVB.selectedVBComponent.designer.controls)
	lastControl.setFocus()
	return
endIf
EndFunction


int Function isCodeWindow ()
return oVB.selectedVBComponent && oVB.activeWindow.type==vbext_wt_CodeWindow && isPcCursor() && not menusActive() && getFocus() && not dialogActive()
 EndFunction

int Function isToolbox ()
return oVB.activeWindow.type==vbext_wt_toolbox && isPcCursor() && not menusActive() && not dialogActive()
EndFunction

int Function isPropertiesWindow ()
return oVB.activeWindow.type==vbext_wt_propertyWindow && isPcCursor() && not menusActive() && not dialogActive()
 EndFunction

Void Function sayActiveWindowTypeDesc ()
say(getVBWindowTypeDesc(oVB.activeWindow),ot_no_disable)
EndFunction

Void Function sayCurrentProcedureName ()
var
object activeCodePane,
int startLine,
int endLine,
int startCol,
int endCol,
int procBodyLine,
int procLineCount,
object CodeModule,
string procName

let activeCodePane=oVB.activeCodePane
let CodeModule=activeCodePane.codeModule
activeCodePane.getSelection(intRef(startLine),intRef(startCol),intRef(endLine),intRef(endCol))
let procName=codeModule.procOfLine(startLine,vbext_pk_Proc)
let procBodyLine=CodeModule.procBodyLine(procName,vbext_pk_proc)
let procLineCount=CodeModule.procCountLines(procName,vbext_pk_proc)
if procName !=cscNull && startLine >=procBodyLine && startLine <=(procBodyLine+procLineCount) then
	say(procName,ot_no_disable)
endIf
EndFunction

string Function getCurrentProcedureName ()
var
object activeCodePane,
int startLine,
int endLine,
int startCol,
int endCol,
int procBodyLine,
int procLineCount,
object CodeModule,
string procName

let activeCodePane=oVB.activeCodePane
let CodeModule=activeCodePane.codeModule
activeCodePane.getSelection(intRef(startLine),intRef(startCol),intRef(endLine),intRef(endCol))
let procName=codeModule.procOfLine(startLine,vbext_pk_Proc)
let procBodyLine=CodeModule.procBodyLine(procName,vbext_pk_proc)
let procLineCount=CodeModule.procCountLines(procName,vbext_pk_proc)
if procName !=cscNull && startLine >=procBodyLine && startLine <=(procBodyLine+procLineCount) then
	return procName
else
	return cscNull
endIf
EndFunction

void Function sayDeclarationLineCount ()
var
int count
if !oVB.activeCodePane.codeModule then
	return
endIf
let count=oVB.activeCodePane.codeModule.countOfDeclarationLines
SayFormattedMessage (ot_JAWS_message, formatString(msgDeclarationLines1_L, intToString(count)), formatString(msgDeclarationLines1_S, intToString(count)))
EndFunction

int Function isCursorInProcedure ()
var
object activeCodePane,
int procBodyLine,
int procLineCount,
int startLine,
int endLine,
int startCol,
int endCol,
object CodeModule,
string procName

let activeCodePane=oVB.activeCodePane
let CodeModule=activeCodePane.codeModule
activeCodePane.getSelection(intRef(startLine),intRef(startCol),intRef(endLine),intRef(endCol))
let procName=codeModule.procOfLine(startLine,vbext_pk_Proc)
let procBodyLine=CodeModule.procBodyLine(procName,vbext_pk_proc)
let procLineCount=CodeModule.procCountLines(procName,vbext_pk_proc)
if procName !=cscNull && startLine >=procBodyLine && startLine <=(procBodyLine+procLineCount) then
	return true
else
	return false
endIf
EndFunction

Void Function sayCodeCursorLocation ()
var
object activeCodePane,
int startLine,
int endLine,
int startCol,
int endCol

let activeCodePane=oVB.activeCodePane
activeCodePane.getSelection(intRef(startLine),intRef(startCol),intRef(endLine),intRef(endCol))
SayFormattedMessage (ot_no_disable, formatString(msgLineColumn1_L, intToString(startLine), intToString(startCol)), formatString(msgLineColumn1_S, intToString(startLine), intToString(startCol)))
EndFunction

int Function getVisibleCodeLineCount ()
var
int VisibleLines

return oVb.activeCodePane.countOfVisibleLines
EndFunction

void function readCurrentCodeLine ()
var
object activeCodePane,
object codeModule,
int startLine,
int endLine,
int startCol,
int endCol,
string codeText

let activeCodePane=oVB.activeCodePane
let CodeModule=activeCodePane.codeModule
activeCodePane.getSelection(intRef(startLine),intRef(startCol),intRef(endLine),intRef(endCol))
let codeText=codeModule.lines(startLine,1)
if not isBlank(codeText) then
	say(codeText,ot_text)
else
	sayLine()
endIf
EndFunction

int Function getCodeTopLine ()
var
int VisibleLines

return oVb.activeCodePane.topLine
EndFunction

Void Function sayActiveCodeWindowView ()
if isCodeWindow() then
	if oVB.activeCodePane.codePaneView==vbext_cv_FullModuleView then
		SayFormattedMessage (ot_no_disable, msgCV1_L)
	elif oVB.activeCodePane.codePaneView==vbext_cv_ProcedureView then
		SayFormattedMessage (ot_no_disable, msgCV2_L)
	endIf
endIf
EndFunction

 string Function getActiveCodeWindowView ()
if isCodeWindow() then
	if oVB.activeCodePane.codePaneView==vbext_cv_FullModuleView then
		return msgCV1_L
	elif oVB.activeCodePane.codePaneView==vbext_cv_ProcedureView then
		return msgCV2_L
	endIf
else
	return cscNull
endIf
EndFunction
int Function getFormControlCount ()
var
object designer,
int type,
int count,
int index,
int nonMenuItems

let type=oVB.selectedVBComponent.type
let designer=oVB.selectedVBComponent.designer

if type==vbext_ct_msForm then
	return designer.controls.count
elif type==vbext_ct_vbForm || type==vbext_ct_vbMdiForm then
; We need to distinguish between menu items and form controls.
	let count=designer.vbControls.count
	let index=1
	let nonMenuItems=0
	while index <=count
		if designer.vbControls(index).className !=VBMenuClass then
			let nonMenuItems=nonMenuItems+1
		endIf
		let index=index+1
	endWhile
	return nonMenuItems
endIf
EndFunction

int Function getFormMenuItemCount ()
var
object designer,
int type,
int count,
int index,
int MenuItems

let type=oVB.selectedVBComponent.type
let designer=oVB.selectedVBComponent.designer

if type==vbext_ct_vbForm || type==vbext_ct_vbMdiForm then
; We need to distinguish between menu items and form controls.
	let count=designer.vbControls.count
	let index=1
	let menuItems=0
	while index <=count
		if designer.vbControls(index).className ==VBMenuClass then
			let MenuItems=MenuItems+1
		endIf
		let index=index+1
	endWhile
	return MenuItems
endIf
EndFunction

int Function formContainsSelectedControls ()
var
object designer,
int type,
object ctl

let designer=oVB.selectedVBComponent.designer
let type=oVB.selectedVBComponent.type
if type==vbext_ct_msForm then
	let ctl=designer.activeControl
elif type==vbext_ct_vbForm || type==vbext_ct_vbMdiForm then
	let ctl=designer.selectedVBControls(0)
endIf
if !ctl then
	return false
else
	return true
endIf
EndFunction

Void Function sayActiveControl ()
var
object designer,
int componentType,
int count,
int index,
string ctlName,
string ctlType

let componentType=oVB.selectedVBComponent.type
let designer=oVB.selectedVBComponent.designer
if componentType==vbext_ct_msForm then
	if designer.activeControl then
		let ctlName=designer.activeControl.name
		let ctlType=getObjectType()
		SayFormattedMessage (ot_control_name, ctlName)
		;SayFormattedMessage(ot_control_type,ctlType)
		IndicateControlType (GetObjectTypeCode ())
		let globalBrlControl=formatString(cmsgBrailleStruc2, ctlName, ctlType)
	else
		SayFormattedMessage (ot_error, msgNoControlSelected1_L)
		let globalBrlControl=cscNull
	endIf
elif componentType==vbext_ct_vbForm || componentType==vbext_ct_vbMdiForm then
	let count=designer.selectedVBControls.count
	if count==0 then
		SayFormattedMessage (ot_error,msgNoControlSelected1_L)
		let globalBrlControl=cscNull
		return
	endIf
	let index=0
	let globalBrlControl=cscNull
	while index < count
		let ctlName=designer.selectedVBControls(index).controlObject.name
		let ctlType=designer.selectedVBControls(index).className
		say(ctlName,ot_control_name)
		say(ctlType,ot_control_type)
		if globalBrlControl !=cscNull then ; already has a control, add a comma space
			let globalBrlControl=globalBrlControl+scComma+cscSpace+formatString(cmsgBrailleStruc2, ctlName, ctlType)
		else
			let globalBrlControl=formatString(cmsgBrailleStruc2, ctlName, ctlType)
		endIf
		let index=index+1
	endWhile
endIf
EndFunction

Void Function closeActiveWindow ()
var
object window
let window=oVB.activeWindow
Window.close
if window.visible then
	SayFormattedMessage (ot_JAWS_message, formatString(msgWindowNotClosed1_L, window.caption))
else
	SayFormattedMessage (ot_JAWS_message, msgWindowClosed1_L)
endIf
EndFunction


string Function getProjectTypeDesc (int type)
if type==vbext_pt_StandardExe then
	return msgPT1_L
elif type==vbext_pt_ActiveXExe then
	return msgPT2_L
elif type==vbext_pt_ActiveXDll then
	return msgPT3_L
elif type==vbext_pt_ActiveXControl then
	return msgPT4_L
elif type==vbext_pt_HostProject then
	return msgPT5_L
elif type==vbext_pt_Standalone then
	return msgCT1_L
endIf
EndFunction


string Function getComponentTypeDesc (int type)
if type==vbext_ct_StdModule then
	return msgCT2_L
elif type==vbext_ct_ClassModule then
	return msgCT3_L
elif type==vbext_ct_MSForm then
	return msgCT4_L
elif type==vbext_ct_ResFile then
	return msgCT5_L
elif type==vbext_ct_VBForm then
	return msgCT6_L
elif type==vbext_ct_VBMDIForm then
	return msgCT7_L
elif type==vbext_ct_PropPage then
	return msgCT8_L
elif type==vbext_ct_UserControl then
	return msgCT9_L
elif type==vbext_ct_DocObject then
	return msgCT10_L
elif type==vbext_ct_RelatedDocument then
	return msgCT11_L
elif type==vbext_ct_ActiveXDesigner then
	return msgCT12_L
elif type==vbext_ct_Document then
	return msgCT13_L
endIf
EndFunction

void function sayModuleMemberCount()
var
string componentName,
object CodeModule,
int memberCount

let CodeModule=oVB.activeCodePane.codeModule
if !codeModule.members then
	return ; running VBA and not VB6 and no members collection
endIf
let memberCount=CodeModule.members.count
let componentName=oVB.selectedVBComponent.name
let componentName=componentName
SayFormattedMessage(ot_no_disable, formatString(msgMembers1_L, intToString(memberCount), componentName), formatString(msgMembers1_S, intToString(memberCount), componentName))
EndFunction

 int function getProcLineCount()
var
int startLine,
int endLine,
int startCol,
int endCol,
int procBodyLine,
int procLineCount,
int blankLineCount, ; attempt to subtract blank lines outside the proc which are included by VB
string procName,
object codeModule

let CodeModule=oVB.activeCodePane.codeModule
oVB.activeCodePane.getSelection(intRef(startLine),intRef(startCol),intRef(endLine),intRef(endCol))
let procName=CodeModule.procOfLine(startLine,vbext_pk_Proc)
let procLineCount=CodeModule.procCountLines(procName,vbext_pk_proc)
let procBodyLine=CodeModule.procBodyLine(procName,vbext_pk_proc)
let blankLineCount=procBodyLine-codeModule.procStartLine(procName,vbext_pk_proc)
if startLine < procBodyLine || startLine > procBodyLine+procLineCount then
	return 0
endIf
if procLineCount > 0 then
	return (procLineCount-blankLineCount)
else
	return 0
endIf
endFunction

void function sayCodeLineCount()
var
string componentName,
object CodeModule,
int CodeLineCount

let CodeModule=oVB.activeCodePane.codeModule
let codeLineCount=CodeModule.countOfLines
let componentName=oVB.selectedVBComponent.name
let componentName=componentName
SayFormattedMessage(ot_no_disable, formatString(msgLinesOfCodeInTotal1_L, intToString(codeLineCount)), formatString(msgLinesOfCodeInTotal1_S, intToString(codeLineCount)))
EndFunction

void Function summarizeProject ()
var
object currentProject,
object components,
object windows,
object references,
object addins,
string tmpStr,
int tmpInt,
int count,
int index
if isAppObjectInvalid() then
	SayFormattedMessage (ot_error, msgWarning1_L)
	return
endIf
let currentProject=oVB.activeVBProject
let components=currentProject.vbComponents
let references=currentProject.references
let addins=currentProject.addins
let windows=oVB.windows
say(currentProject.name,ot_help)
say(currentProject.description,ot_help)
say(getProjectTypeDesc(currentProject.type),ot_help)
if currentProject.isDirty then
	SayFormattedMessage (ot_help, formatString(msgHasBeenModified1_L, currentProject.name), formatString(msgHasBeenModified1_S, currentProject.name))
endIf
let count=windows.count
let index=1
let tmpInt=0
while index <=count
	if windows(index).visible then
		let tmpInt=tmpInt+1
	endIf
	let index=index+1
endWhile
SayFormattedMessage(ot_help, formatString(msgProjSummaryWindows1_L, intToString(tmpInt)), formatString(msgProjSummaryWindows1_S, intToString(tmpInt)))
let index=1
let tmpInt=1
while index <= count
	if windows(index).visible then
		let tmpStr=getVBWindowTypeDesc(windows(index))
		SayFormattedMessage (ot_help, formatString(msgIndexedItem1_L, intToString(tmpInt), tmpStr))
		if windows(index).type==vbext_wt_designer && windows(index).visible && isToolboxVisible() then
			SayFormattedMessage (ot_help, msgToolboxVisible1_L)
		endIf
		let tmpInt=tmpInt+1
	endIf
	let index=index+1
endWhile

let count=components.count
SayFormattedMessage(ot_help, formatString(msgProjSummaryComponents1_L, intToString(count)), formatString(msgProjSummaryComponents1_S, intToString(count)))
let index=1
while index <=count
	let tmpStr=components(index).name
	SayFormattedMessage (ot_help, formatString(msgIndexedItem1_L, intToString(index), tmpStr))
	say(components(index).description,ot_help)
	say(getComponentTypeDesc(components(index).type),ot_help)
	if components(index).isDirty then
		SayFormattedMessage (ot_help, formatString(msgHasBeenModified1_L, tmpStr), formatString(msgHasBeenModified1_S, tmpStr))
	endIf
	let index=index+1
endWhile
let count=references.count
SayFormattedMessage(ot_help, formatString(msgProjSummaryRefs1_L, intToString(count)), formatString(msgProjSummaryRefs1_S, intToString(count)))
let index=1
while index <=count
	let tmpStr=references(index).name
	SayFormattedMessage (ot_help, formatString(msgIndexedItem1_L, intToString(index), tmpStr))
	say(references(index).description,ot_help)
	let index=index+1
endWhile

let count=addins.count
SayFormattedMessage(ot_help, formatString(msgProjSummaryAddins1_L, intToString(count)), formatString(msgProjSummaryAddins1_S, intToString(count)))
let index=1
while index <=count
	let tmpStr=addins(index).name
	SayFormattedMessage (ot_help, formatString(msgIndexedItem1_L, intToString(index), tmpStr))
	say(addins(index).description,ot_help)
	let index=index+1
endWhile
EndFunction


Int Function isVBAModeRun ()
return oVB.activeVBProject.mode==vbext_VM_run
EndFunction

int Function isVBAModeDesign ()
return oVB.activeVBProject.mode==vbext_VM_design
EndFunction

int Function isVBAModeBreak ()
return oVB.activeVBProject.mode==vbext_VM_break
EndFunction


int Function isAppObjectInvalid ()
if oVB then false
else
	return true
endIf
EndFunction


Int Function setFocusOnSelectedWindow ()
var
	object windows,
	string descr,
	string caption,
	int index,
	int count,
	int tmpInt,
	string windowList,
	string windowIndexList,
	int choice

let windows=oVB.windows
let count=windows.count
let index=1
let tmpInt=1
while index <=count
	if windows(index).visible then
		let descr = getVBWindowTypeDesc(windows(index))
		let caption=windows(index).caption
		let windowList=windowList+list_item_separator+formatString(msgIndexedItem2_L, intToString(tmpInt), descr, caption)
		let windowIndexList=windowIndexList+list_item_separator+intToString(index) ; store the index of each visible window
		let tmpInt=tmpInt+1
	endIf
	let index=index+1
endWhile
;remove leading delimiters
		let windowList=stringChopLeft(windowList,1)
		let windowIndexList=stringChopLeft(windowIndexList,1)
	 let choice=DlgSelectItemInList (windowList, msgSelectWindow1_L, false)
if choice then
	let tmpInt=stringToInt(stringSegment(windowIndexList,list_item_separator,choice))
	windows(tmpInt).setFocus
endIf
EndFunction
void function sayActiveFormname ()
if oVB.activeWindow.type==vbext_wt_designer then
	say(oVB.selectedVBComponent.name,ot_no_disable)
endIf
EndFunction

Void Function sayActiveFormDimensions ()
var
int top,
int left,
int width,
int height,
object component,
object form
if oVB.activeWindow.type==vbext_wt_designer then
	let form=oVB.selectedVBComponent
	let width=form.properties(dpWidth).value
	let height=form.properties(dpHeight).value
	SayFormattedMessage (ot_no_disable, formatString(msgControlDimensions1, form.name, intToString(width), intToString(height)))
endIf
EndFunction

int Function areGridDotsVisible ()
return oVB.selectedVBComponent.showGridDots
EndFunction

   void function sayActiveControlLeft ()
if not shouldItemSpeak(ot_position) then
	return
endIf
if isMsFormDesigner() then
	say(intToString(oVB.selectedVBComponent.designer.activeControl.left),ot_no_disable)
elif isVBFormDesigner() then
	say(intToString(oVB.selectedVBComponent.designer.selectedVBControls(0).controlObject.left),ot_no_disable)
endIf
EndFunction

void function sayActiveControlTop ()
if not shouldItemSpeak(ot_position) then
	return
endIf
if isMsFormDesigner() then
	say(intToString(oVB.selectedVBComponent.designer.activeControl.top),ot_no_disable)
elif isVBFormDesigner() then
	say(intToString(oVB.selectedVBComponent.designer.selectedVBControls(0).controlObject.top),ot_no_disable)
endIf
EndFunction

int function isProjectActive()
if oVB.activeVBProject then
	return true
else
	return false
endIf
endFunction

void Function setFocusOnToolWindow ()
var
object windows,
int index,
int count
let windows=oVB.windows
let index=1
let count=windows.count
while index <=count
	if windows(index).type==vbext_wt_toolWindow && windows(index).visible then
		windows(index).setFocus
		 say(getVBWindowTypeDesc(windows(index)),ot_JAWS_message)
		return
	endIf
	let index=index+1
endWhile
SayFormattedMessage (ot_error, msgToolboxNotVisible1_L)
return
EndFunction

void function readComponentProperties()
var
int count,
int index,
string sValue,
int iValue,
object component,
object properties

let component=oVB.selectedVBComponent
if !component then
	SayFormattedMessage (ot_error, msgNoComponentProperties1_L, msgNoComponentProperties1_S)
	return
endIf
if component.hasOpenDesigner && component.designerId !=cscNull then
	SayFormattedMessage(ot_help, formatString(msgComponentDescription1_L, component.name, component.description, component.designerId), formatString(msgComponentDescription1_S, component.name, component.description, component.designerId))
endIf
let properties=component.properties
let count=properties.count
SayFormattedMessage (ot_help, formatString(msgComponentProperties1_L,intToString(count)), formatString(msgComponentProperties1_S, intToString(count)))
let index=1
while index <=count
	let sValue=properties(index).value
	if sValue==cscNull then
		let sValue=scZero
	endIf
	SayFormattedMessage(ot_no_disable, formatString(msgProperty1_L, properties(index).name, sValue))
	let index=index+1
endWhile
endFunction

void function sayActiveFormType ()
if !oVB.selectedVBComponent then
	SayFormattedMessage (ot_no_disable, msgForm1_L)
else
	say(getComponentTypeDesc(oVB.selectedVBComponent.type),ot_no_disable)
endIf
EndFunction

string Function getActiveFormType ()
if !oVB.selectedVBComponent then
	return msgForm1_L
else
	return getComponentTypeDesc(oVB.selectedVBComponent.type)
endIf
EndFunction

int Function isBlank (string str)
var
int len,
int index,
string chr

let len=stringLength(str)
if len==0 then
	return true
else
	let index=1
	while index <=len
		let chr=subString(str,index,1)
		if chr!=cscSpace && chr !=scTab then
			return false
		endIf
		let index=index+1
	endWhile
endIf
return true
EndFunction

