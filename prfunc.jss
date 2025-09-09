;Script files for Corel Presentations 9 (Service Pack 4)
; Copyright 2010-2015 by Freedom Scientific, Inc.
;Accompanying executables to this application are:
; prwin9.exe, prlmen.dll
; This file contains Object Model interface code which is not public source.
include "hjconst.jsh"
include "hjglobal.jsh"
include "prFunc.jsh" ; Presentations hidden source header file
include "common.jsm"
include "prWin9.jsm" ; Presentations 9 messages
include "prWin9.jsh" ; Presentations 9 public source header

void function autoStartEvent()
let oPres=createObject(PresentationsPerfectScriptObject)
let gsBRLObjectName=cscNull
let gsBRLObjectText=cscNull
let gsBRLSlideInfo=cscNull
let giPriorTool=INVALID_TOOL
let giBrlVerbosity=getJCFOption(opt_brl_verbosity)
endFunction

void function autoFinishEvent()
let oPres=oNull
endFunction

string Function WPUnitsToPoints (int wpUnitsValue)
var
	int points,
	int tenTimesPoints,
	int decimalPlace
; work out 10 times points value so value is not rounded
let tenTimespoints=WPUnitsValue*720/1200
let points=tenTimesPoints/10 ; this will round
let decimalPlace=tenTimesPoints-points*10 ; this will be original value including decimal - rounded value
if decimalPlace <=3 then
	let decimalPlace=0
elif decimalPlace <=5 then
	let decimalPlace=5
elif decimalPlace <=9 then
	let points=points+1
	let decimalPlace=0
endIf
if decimalPlace !=0 then
	return formatString(PRMsgDecimalNumber1, intToString(points), intToString(decimalPlace))
else
	return intToString(points)
endIf
EndFunction


Void Function sayFocusedObjectDimensions ()
if gsUnitsOfMeasure==PRMeasurePoints then
	say(formatString(PRMsgObjectWidth, wpUnitsToPoints(getObjectWidth()), gsUnitsOfMeasure),ot_help)
	say(formatString(PRMsgObjectHeight,WPUnitsToPoints(getObjectHeight()), gsUnitsOfMeasure),ot_help)
else
	say(formatString(PRMsgObjectWidth, intToString(getObjectWidth()), gsUnitsOfMeasure),ot_help)
	say(formatString(PRMsgObjectHeight,intToString(getObjectHeight()), gsUnitsOfMeasure),ot_help)
endIf
EndFunction

void function sayFocusedObjectTopLeft ()
if gsUnitsOfMeasure==PRMeasurePoints then
	say(formatString(PRMsgObjectTopLeftX, wpUnitsToPoints(getObjectX()), gsUnitsOfMeasure),ot_help)
	say(formatString(PRMsgObjectTopLeftY, wpUnitsToPoints(getObjectY()), gsUnitsOfMeasure),ot_help)
else
	say(formatString(PRMsgObjectTopLeftX, intToString(getObjectX()), gsUnitsOfMeasure),ot_help)
	say(formatString(PRMsgObjectTopLeftY, intToString(getObjectY()), gsUnitsOfMeasure),ot_help)
endIf
EndFunction

void function sayFocusedObjectName ()
var
string sName

let sName=oPres.envGetObjectName
oPres.quit
say(sName,ot_control_type)
EndFunction

void function sayFocusedSlideObject ()
var
string sName,
string sText

let sName=oPres.envGetObjectName
let sText=oPres.envGetObjectText
oPres.quit
say(sName,ot_control_type)
say(sText,ot_no_disable)
let gsBRLObjectName=sName
let gsBRLObjectText=sText
EndFunction

void function saySlideText ()
var
string sText
let sText=oPres.envGetSlideText
oPres.quit
say(sText,ot_no_disable)
EndFunction

                                            int Function getSlideObjectCount ()
var
int iCount
let iCount=oPres.EnvGetSlideObjectCount
oPres.quit
return iCount
EndFunction

                                            int Function isLayoutLayer ()
if dialogActive() || menusActive() then
	return false
else
	return getCurrentMode() & LAYOUT_EDIT_MODE
endIf
EndFunction

int Function isSlideLayer ()
if dialogActive() || menusActive() then
	return false
else
	return getCurrentMode() & SLIDE_EDIT_MODE
endIf
EndFunction

                                            int Function isSlideSorter ()
if dialogActive() || menusActive() then
	return false
else
	return getCurrentMode() & SLIDE_SORT_MODE
endIf
EndFunction

int Function getPointerX ()
var
int iPX
let iPX=oPres.EnvGetPointerPositionX
oPres.quit
return iPX
EndFunction

                                            int Function getPointerY ()
var
int iPY
let iPY=oPres.EnvGetPointerPositionY
oPres.quit
return iPY
EndFunction

Int Function isTextEditMode ()
var
int iMode
if dialogActive() || menusActive() then
	return false
else
	return getCurrentMode() & TEXT_EDIT_MODE
endIf
EndFunction

int Function getCurrentMode ()
var
int iMode
if dialogActive() || menusActive() then
	return false
endIf
let iMode=oPres.EnvCurrentMode
oPres.quit
return iMode
EndFunction

int Function getObjectHeight ()
var
int iHeight
let iHeight=oPres.EnvGetObjectHeight
oPres.quit
return iHeight
EndFunction

                                            int Function getObjectWidth ()
var
int iWidth
let iWidth=oPres.EnvGetObjectWidth
oPres.quit
return iWidth
EndFunction

                                            int Function getObjectX ()
var
int iX
let iX=oPres.EnvGetObjectXPos
oPres.quit
return iX
EndFunction

                                            int Function getObjectY ()
var
int iY
let iY=oPres.EnvGetObjectYPos
oPres.quit
return iY
EndFunction

                                            Void Function saySlideLayoutTitle ()
var
string sLayout
let sLayout=oPres.EnvLayoutTitle
oPres.quit
say(sLayout,ot_no_disable)
EndFunction

                                            int Function getSlideCount ()
var
int iSlideCount
let iSlideCount=oPres.EnvNumberOfSlides
oPres.quit
return iSlideCount
EndFunction

                                            Function saySlideTitle ()
var
string sName
let sName=oPres.EnvSlideTitle
oPres.quit
say(sName,ot_no_disable)
EndFunction

                                            string Function getSlideTitle ()
var
string sName
let sName=oPres.EnvSlideTitle
oPres.quit
return sName
EndFunction

void function setBrlSlideInfo ()
var
string sName,
int iIndex,
string sNotes

let iIndex=oPres.EnvCurrentSlideNumber
let sName=oPres.envSlideTitle
let sNotes=oPres.envSpeakerNotes
oPres.quit
if iIndex > 0 then
	let gsBrlSlideInfo=formatString(PRMsgSlide, intToString(iIndex))+scColon+cscSpace+sName+cscSpace+stringLeft(sNotes,BrlMaxNoteLength)
else
	let gsBrlSlideInfo=cscNull
endIf
EndFunction

void function readSpeakerNotes ()
var
string sNotes
let sNotes=oPres.EnvSpeakerNotes
oPres.quit
if sNotes!=cscNull then
	say(sNotes,ot_no_disable)
else
	SayFormattedMessage(ot_error, PRMsgNoNotes_L, PRMsgNoNotes_S)
endIf
EndFunction


void function sayCurrentView ()
var
int iMode,
string sModeDesc

if dialogActive() || menusActive() then
	return
endIf
let iMode=getCurrentMode()
if iMode & DRAWING_MODE then
	let sModeDesc=PRMsgDRAWING_MODE
endIf
if iMode & SLIDE_EDIT_MODE then
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgSLIDE_EDIT_MODE
endIf
if iMode & SLIDE_OUTL_MODE then
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgSLIDE_OUTL_MODE
endIf
if iMode & SLIDE_SORT_MODE then
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgSLIDE_SORT_MODE
endIf
if iMode & BCKGND_EDIT_MODE then
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgBCKGND_EDIT_MODE
endIf
if iMode & LAYOUT_EDIT_MODE then
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgLAYOUT_EDIT_MODE
endIf
if iMode & DATA_CHART_MODE then
	if isChartDatasheetVisible() then
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgChartDataSheet
	else
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgDATA_CHART_MODE
	endIf
endIf
if iMode & ORG_CHART_MODE then
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgORG_CHART_MODE
endIf
if iMode & TEXT_EDIT_MODE then
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgTEXT_EDIT_MODE
endIf
if iMode & PAINT_MODE then
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgPAINT_MODE
endIf
if iMode & OLE_DRAWING_MODE then
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgOLE_DRAWING_MODE
endIf
if iMode & OLE_DATA_CHART_MODE then
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgOLE_DATA_CHART_MODE
endIf
if stringLeft(sModeDesc,stringLength(scCommaSpace))==scCommaSpace then
	let sModeDesc=stringRight(sModeDesc,stringLength(sModeDesc)-stringLength(scCommaSpace))
endIf
say(sModeDesc,ot_no_disable)
let gsBRLCurrentMode=sModeDesc+scColon
EndFunction

string Function getCurrentView ()
var
int iMode,
string sModeDesc

if dialogActive() || menusActive() then
	return cscNull
endIf
let iMode=getCurrentMode()
if iMode & DRAWING_MODE then
	let sModeDesc=PRMsgDRAWING_MODE
endIf
if iMode & SLIDE_EDIT_MODE then
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgSLIDE_EDIT_MODE
endIf
if iMode & SLIDE_OUTL_MODE then
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgSLIDE_OUTL_MODE
endIf
if iMode & SLIDE_SORT_MODE then
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgSLIDE_SORT_MODE
endIf
if iMode & BCKGND_EDIT_MODE then
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgBCKGND_EDIT_MODE
endIf
if iMode & LAYOUT_EDIT_MODE then
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgLAYOUT_EDIT_MODE
endIf
if iMode & DATA_CHART_MODE then
	if isChartDatasheetVisible() then
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgChartDataSheet
	else
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgDATA_CHART_MODE
	endIf
endIf
if iMode & ORG_CHART_MODE then
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgORG_CHART_MODE
endIf
if iMode & TEXT_EDIT_MODE then
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgTEXT_EDIT_MODE
endIf
if iMode & PAINT_MODE then
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgPAINT_MODE
endIf
if iMode & OLE_DRAWING_MODE then
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgOLE_DRAWING_MODE
endIf
if iMode & OLE_DATA_CHART_MODE then
	let sModeDesc=sModeDesc+scCommaSpace+PRMsgOLE_DATA_CHART_MODE
endIf
if stringLeft(sModeDesc,stringLength(scCommaSpace))==scCommaSpace then
	let sModeDesc=stringRight(sModeDesc,stringLength(sModeDesc)-stringLength(scCommaSpace))
endIf
return sModeDesc
EndFunction

int Function getSlideNumber ()
var
int iNumber
let iNumber=oPres.EnvCurrentSlideNumber
oPres.quit
return iNumber
EndFunction

void function saySlideBackgroundTitle ()
var
string sName
let sName=oPres.EnvBackgroundTitle
oPres.quit
say(sName,ot_no_disable)
EndFunction


void function sayCursorPos ()
if isSlideLayer() && isPcCursor() then
	if gsUnitsOfMeasure==PRMeasurePoints then
		say(formatString(PRMsgPointerX,WPUnitsToPoints(getpointerX()), gsUnitsOfMeasure),ot_no_disable)
		say(formatString(PRMsgPointerY,WPUnitsToPoints(getpointerY()), gsUnitsOfMeasure),ot_no_disable)
	else
		say(formatString(PRMsgPointerX,intToString(getpointerX()), gsUnitsOfMeasure),ot_no_disable)
		say(formatString(PRMsgPointerY,intToString(getpointerY()), gsUnitsOfMeasure),ot_no_disable)
	endIf
	sayCurrentDrawingTool()
else
	sayCursorPos() ; default
endIf
EndFunction


int Function getMarqueeX ()
var
int iX
let iX=oPres.EnvGetMarqueeXPos
oPres.quit
return iX
EndFunction


int Function getMarqueeY ()
var
int iY
let iY=oPres.EnvGetMarqueeYPos
oPres.quit
return iY
EndFunction


int Function getMarqueeWidth ()
var
int iWidth
let iWidth=oPres.EnvGetMarqueeWidth
oPres.quit
return iWidth
EndFunction


int Function getMarqueeHeight ()

var
int iHeight
let iHeight=oPres.EnvGetMarqueeHeight
oPres.quit
return iHeight
EndFunction


int Function isChartDataSheetVisible ()
var
int iState
let iState=oPres.EnvChartDataWin
oPres.quit
return iState
EndFunction

int Function isSlideSkipped ()
var
int iStatus
let iStatus=oPres.EnvIsSlideSkipped
oPres.quit
return iStatus
EndFunction


int Function doesSlideHaveSpeakerNotes ()
var
string sNotes
let sNotes=oPres.EnvSpeakerNotes
oPres.quit
return sNotes!=cscNull
EndFunction


void function saySlideObjectCount ()
SayFormattedMessage(ot_help, formatString(PRMsgSlideContains_L,intToString(getSlideObjectCount())), formatString(PRMsgSlideContains_S, intToString(getSlideObjectCount())))
EndFunction

int Function isNavigationMode ()
var
int iMode,
int iTool

if menusActive() || dialogActive() || not isPcCursor() then
	return false
else
	let iMode=oPres.envCurrentMode
	let iTool=oPres.envCurrentTool
	oPres.quit
	return iTool==SELECT_OBJECTS &&
	(iMode==SLIDE_EDIT_MODE || iMode==LAYOUT_EDIT_MODE)
endIf
EndFunction

void function setGlobalMode ()
let giCurrentMode=getCurrentMode()
EndFunction

    int Function brailleBuildCustomControl ()
var
int iCol,
int iRow,
int iAttr,
handle hParent,
handle hParentPrior,
handle hPrior,
handle hNext,
int iNextType,
int iPriorType,
	int iType,
int iParentType,
int iParentPriorType,
string sParentClass,
int iControl,
string sClass,
string sRealName,
string sName,
handle hwnd

let hwnd=globalFocusWindow
let iType = GetWindowSubTypeCode (hWnd)
let hPrior=getPriorWindow(hwnd)
let hNext=getNextWindow(hwnd)
let iNextType=getWindowSubtypeCode(hNext)
let iPriorType=getWindowSubtypeCode(hPrior)
let hParent=getParent(hwnd)
let hParentPrior=getPriorWindow(hParent)
let sParentClass=getWindowClass(hParent)
let iParentType=getWindowSubtypeCode(hParent)
let iParentPriorType=getWindowSubtypeCode(hParentPrior)
let iControl = GetControlID (hwnd)
let sName= GetObjectName ()
let sClass=getWindowClass(hwnd)
let sRealName=getWindowName(getRealWindow(hwnd))
let iCol=getCursorCol()
let iRow=getCursorRow()
let iAttr=getCharacterAttributes()
if sClass==wc_bitmapButton then
	brailleAddString(getWindowName(hwnd),iCol,iRow,iAttr)
	brailleAddString(PRMsgBitmapButton,iCol,iRow,iAttr)
	if controlIsChecked() then
		brailleAddString(PRMsgPressed,iCol,iRow,iAttr)
	endIf
	return true
elIf (iType==wt_edit || iType==wt_editCombo) && (iParentType==wt_comboBox || iParentType==wt_editCombo) then
; Braille the prompt
		if iParentPriorType==wt_static then
		brailleAddString(getWindowName(hParentPrior),0,0,0)
	endIf
	; Braille the type
	brailleAddString(cVMsgEditCombo1_L,0,0,0)
; Braille the contents
	BrailleAddFocusItem ()
	return true
elif iType==wt_edit && sParentClass==wc_spinEdit then
	if iParentPriorType==wt_static || iParentPriortype==wt_radioButton then
; Braille the prompt
		brailleAddString(getWindowName(hParentPrior),0,0,0)
	elif getWindowClass(hParentPrior)==wc_prglb && getWindowTypeCode(getPriorWindow(hParentPrior))==wt_static then
; use the button's label
		brailleAddString(getWindowName(getPriorWindow(hParentPrior)),0,0,0)
	endIf
; Braille the type
	brailleAddString(cVMsgSpinBox1_L, 0,0,0)
	; Braille the contents
	BrailleAddFocusItem ()
	return true
elif iType==wt_edit && sParentClass==wc_buttonEdit then
	if iParentPriorType==wt_static then
		brailleAddString(getWindowName(hParentPrior),0,0,0)
	endIf
	brailleAddString(getWindowType(hwnd),0,0,0)
	BrailleAddFocusItem ()
	return true
elif iType==wt_treeView && iPriorType==wt_static then
; Braille the prompt
	brailleAddString(getWindowName(hPrior),0,0,0)
	BrailleAddFocusItem ()
	return true
elif sClass==wc_GLB then
; Braille the prompt:
	if iPriorType==wt_static then
		brailleAddString(getWindowName(hPrior),0,0,0)
	elif sParentClass==wc_PRGLB && iParentPriorType==wt_static then
		brailleAddString(getWindowName(hParentPrior),0,0,0)
	endIf
	brailleAddString(PRMsgGLB,0,0,0)
; Braille the description
	brailleAddString(getWindowName(hwnd),iCol,iRow,iAttr)
	return true
elif sClass==wc_PRArray then
; Braille the prompt:
	if iPriorType==wt_static then
		brailleAddString(getWindowName(hPrior),0,0,0)
	endIf
	brailleAddString(PRMsgPRArray,0,0,0)
; Braille the description
	brailleAddString(getWindowName(hwnd),iCol,iRow,iAttr)
	return true
elif sClass==wc_charMapGrid then
	if iPriorType==wt_static then
		brailleAddString(getWindowName(hPrior),0,0,0)
	endIf
	brailleAddString(PRMsgCharGrid,0,0,0)
	brailleAddString(getCharacter(),iCol,iRow,iAttr)
	return true
elif sClass==wc_slideShowRunning then
	brailleAddString(PRMsgSlideShowRunning_L,0,0,0)
	return true
else
	return false
endIf
EndFunction

int Function BrailleBuildDialog (handle hwndReal)
var
	string Buffer,
	string CheckedUnchecked,
int iWinSubtypeCode
let Buffer = GetWindowName (hwndReal) ; title of the dialog box
let iWinSubtypeCode=getWindowSubtypeCode(globalFocusWindow)
if ControlCanBeChecked () then
	if (ControlIsChecked ()) then
		let CheckedUnchecked = cmsgBrailleChecked1_L
	else
		let CheckedUnchecked = cmsgBrailleUnchecked1_L
	endIf
endIf

if GetJcfOption (OPT_BRL_Verbosity)==beginner  then
	if (buffer != cscNull) then ; there is a title
		BrailleAddString(formatString(cmsg229_L, buffer),0,0,0)
	endIf
	let buffer = GetDialogPageName()
	if (buffer != cscNull) && iWinSubtypeCode!=wt_tabControl then ; there is a page name
		BrailleAddString(formatString(cmsg230_L, buffer),0,0,0)
	endIf
	let buffer = GetDialogStaticText()
	if (buffer != cscNull) then ; there is static text in dialog
		BrailleAddString(buffer,0,0,0)
	endIf
	let buffer = GetGroupBoxName()
	if (buffer != cscNull) then ; there is a GroupBox name
		BrailleAddString(formatString(cmsg231_L, buffer),0,0,0)
	endIf

	if brailleBuildCustomControl() then
		return true
	endIf

	let buffer = GetObjectName()
	if (buffer != cscNull) &
		(iWinSubtypeCode == WT_RADIOBUTTON ||
		iWinSubtypeCode == WT_CHECKBOX ||
		iWinSubtypeCode==wt_3state) then
		BrailleAddString (formatString(cmsgBrailleStruc1, CheckedUnchecked, buffer, GetWindowType(GetFocus())), getCursorCol (), getCursorRow (), 32)
	elif  iWinSubtypeCode==wt_upDownSlider then
		BrailleAddString(formatString(cMsgBrailleStruc4, buffer, cMsgBrlSliderUD, getObjectValue()),getCursorCol(), getCursorRow(), 0)
		return true
	elif iWinSubtypeCode==wt_leftRightSlider then
		BrailleAddString(formatString(cMsgBrailleStruc4, buffer, cMsgBrlSliderLR, getObjectValue()),getCursorCol(), getCursorRow(), 0)
		return true
	elif iWinSubtypeCode==wt_edit_spinBox then
		BrailleAddString(formatString(cmsgBrailleStruc2, buffer, cMsgBrlEditSpinbox),0,0,0)
		BrailleAddFocusItem()
		return true
	elif iWinSubtypeCode==wt_spinbox then
		BrailleAddString(formatString(cmsgBrailleStruc2, buffer, cMsgBrlSpinbox), 0,0,0)
		BrailleAddFocusItem()
		return true
	elif iWinSubtypeCode==wt_editCombo then
		BrailleAddString(formatString(cMsgBrailleStruc2, buffer, cMsgBrlEditCombo),0,0,0)
		BrailleAddFocusItem()
		return true
	elif iWinSubtypeCode ==WT_BUTTON then
		BrailleAddString (formatString(cmsg232_L, buffer), getCursorCol (), getCursorRow (), 0) ; note msg496_L has a leading space
		Return TRUE
	elif iWinSubTypeCode == WT_TREEVIEW then
		BrailleAddString(formatString(cMsgBrailleStruc5, buffer, getObjectType(), intToString(getTreeViewLevel())),0,0,0)
		BrailleAddFocusItem()
		return true
				elif iWinSubtypeCode==WT_EXTENDEDSELECT_LISTBOX then
		BrailleAddString(formatString(cMsgBrailleStruc2, buffer, cMsgBrlExtSelListbox),0,0,0)
		BrailleAddFocusItem()
		return true
	elif iWinSubtypeCode==wt_multiSelect_Listbox then
		BrailleAddString(formatString(cMsgBrailleStruc2, buffer, cMsgbrlMultiSelListbox),0,0,0)
		BrailleAddFocusItem()
		return true
	elif iWinSubtypeCode==wt_tabControl then
		BrailleAddString(cMsgBrlTabControl,0,0,0)
		BrailleAddFocusLine()
		return true
	elif iWinSubtypeCode==wt_static then
		BrailleAddString(getObjectName(),getCursorCol(), getCursorRow(), 0)
		return true ; Braille what's at the cursor
	elif iWinSubtypeCode !=wt_unknown then
		BrailleAddString (formatString(cMsgBrailleStruc2, buffer, GetWindowType (GetFocus ())), 0, 0, 0)
		BrailleAddFocusItem()
		Return TRUE
	endIf
; end beginner verbosity
elif  GetJcfOption (OPT_BRL_Verbosity)==intermediate then
	if (buffer != cscNull) then ; there is a title
		BrailleAddString(buffer,0,0,0)
	endIf
	let buffer = GetDialogPageName()
	if (buffer != cscNull) && iWinSubtypeCode!=wt_tabControl then ; there is a page name
		BrailleAddString(buffer,0,0,0)
	endIf
	let buffer = GetDialogStaticText()
	if (buffer != cscNull) then ; there is static text in dialog
		BrailleAddString(buffer, 0,0,0)
	endIf
	let buffer = GetGroupBoxName()
	if (buffer != cscNull) then ; there is a GroupBox name
		BrailleAddString(buffer,0,0,0)
	endIf

	if brailleBuildCustomControl() then
		return true
	endIf

	let buffer = GetObjectName()
	if (buffer != cscNull) &
		(iWinSubtypeCode == WT_RADIOBUTTON ||
		iWinSubtypeCode == WT_CHECKBOX ||
		iWinSubtypeCode==wt_3state) then
		BrailleAddString (formatString(cmsgBrailleStruc1, CheckedUnchecked, buffer, GetWindowType(GetFocus())), getCursorCol (), getCursorRow (), 32)
	elif  iWinSubtypeCode==wt_upDownSlider then
		BrailleAddString(formatString(cMsgBrailleStruc4, buffer, cMsgBrlSliderUD, getObjectValue()),getCursorCol(), getCursorRow(), 0)
		return true
	elif iWinSubtypeCode==wt_leftRightSlider then
		BrailleAddString(formatString(cMsgBrailleStruc4, buffer, cMsgBrlSliderLR, getObjectValue()),getCursorCol(), getCursorRow(), 0)
		return true
	elif iWinSubtypeCode==wt_edit_spinBox then
		BrailleAddString(formatString(cmsgBrailleStruc2, buffer, cMsgBrlEditSpinbox),0,0,0)
		BrailleAddFocusItem()
		return true
	elif iWinSubtypeCode==wt_spinbox then
		BrailleAddString(formatString(cmsgBrailleStruc2, buffer, cMsgBrlSpinbox), 0,0,0)
		BrailleAddFocusItem()
		return true
	elif iWinSubtypeCode==wt_editCombo then
		BrailleAddString(formatString(cMsgBrailleStruc2, buffer, cMsgBrlEditCombo),0,0,0)
		BrailleAddFocusItem()
		return true
	elif iWinSubtypeCode ==WT_BUTTON then
		BrailleAddString (formatString(cmsg232_L, buffer), getCursorCol (), getCursorRow (), 0) ; note msg496_L has a leading space
		Return TRUE
	elif iWinSubTypeCode == WT_TREEVIEW then
		BrailleAddString(formatString(cMsgBrailleStruc5, buffer, getObjectType(), intToString(getTreeViewLevel())),0,0,0)
		BrailleAddFocusItem()
		return true
				elif iWinSubtypeCode==WT_EXTENDEDSELECT_LISTBOX then
		BrailleAddString(formatString(cMsgBrailleStruc2, buffer, cMsgBrlExtSelListbox),0,0,0)
		BrailleAddFocusItem()
		return true
	elif iWinSubtypeCode==wt_multiSelect_Listbox then
		BrailleAddString(formatString(cMsgBrailleStruc2, buffer, cMsgbrlMultiSelListbox),0,0,0)
		BrailleAddFocusItem()
		return true
	elif iWinSubtypeCode==wt_tabControl then
		BrailleAddString(cMsgBrlTabControl,0,0,0)
		BrailleAddFocusLine()
		return true
	elif iWinSubtypeCode==wt_static then
		BrailleAddString(getObjectName(),getCursorCol(), getCursorRow(), 0)
		return true ; Braille what's at the cursor
	elif iWinSubtypeCode !=wt_unknown then
		BrailleAddString (formatString(cMsgBrailleStruc2, buffer, GetWindowType (GetFocus ())), 0, 0, 0)
		BrailleAddFocusItem()
		Return TRUE
	endIf
; end intermediate verbosity
elif GetJcfOption (OPT_BRL_verbosity)==advanced  then
	if brailleBuildCustomControl() then
		return true
	endIf

	let buffer = GetObjectName()
	if (buffer != cscNull) &
		(iWinSubtypeCode == WT_RADIOBUTTON ||
		iWinSubtypeCode == WT_CHECKBOX ||
		iWinSubtypeCode==wt_3state) then
		BrailleAddString (formatString(cmsgBrailleStruc1, CheckedUnchecked, buffer, GetWindowType(GetFocus())), getCursorCol (), getCursorRow (), 32)
	elif  iWinSubtypeCode==wt_upDownSlider then
		BrailleAddString(formatString(cMsgBrailleStruc4, buffer, cMsgBrlSliderUD, getObjectValue()),getCursorCol(), getCursorRow(), 0)
		return true
	elif iWinSubtypeCode==wt_leftRightSlider then
		BrailleAddString(formatString(cMsgBrailleStruc4, buffer, cMsgBrlSliderLR, getObjectValue()),getCursorCol(), getCursorRow(), 0)
		return true
	elif iWinSubtypeCode==wt_edit_spinBox then
		BrailleAddString(formatString(cmsgBrailleStruc2, buffer, cMsgBrlEditSpinbox),0,0,0)
		BrailleAddFocusItem()
		return true
	elif iWinSubtypeCode==wt_spinbox then
		BrailleAddString(formatString(cmsgBrailleStruc2, buffer, cMsgBrlSpinbox), 0,0,0)
		BrailleAddFocusItem()
		return true
	elif iWinSubtypeCode==wt_editCombo then
		BrailleAddString(formatString(cMsgBrailleStruc2, buffer, cMsgBrlEditCombo),0,0,0)
		BrailleAddFocusItem()
		return true
	elif iWinSubtypeCode ==WT_BUTTON then
		BrailleAddString (formatString(cmsg232_L, buffer), getCursorCol (), getCursorRow (), 0) ; note msg496_L has a leading space
		Return TRUE
	elif iWinSubTypeCode == WT_TREEVIEW then
		BrailleAddString(formatString(cMsgBrailleStruc5, buffer, getObjectType(), intToString(getTreeViewLevel())),0,0,0)
		BrailleAddFocusItem()
		return true
				elif iWinSubtypeCode==WT_EXTENDEDSELECT_LISTBOX then
		BrailleAddString(formatString(cMsgBrailleStruc2, buffer, cMsgBrlExtSelListbox),0,0,0)
		BrailleAddFocusItem()
		return true
	elif iWinSubtypeCode==wt_multiSelect_Listbox then
		BrailleAddString(formatString(cMsgBrailleStruc2, buffer, cMsgbrlMultiSelListbox),0,0,0)
		BrailleAddFocusItem()
		return true
	elif iWinSubtypeCode==wt_tabControl then
		BrailleAddString(cMsgBrlTabControl,0,0,0)
		BrailleAddFocusLine()
		return true
	elif iWinSubtypeCode==wt_static then
		BrailleAddString(getObjectName(),getCursorCol(), getCursorRow(), 0)
		return true ; Braille what's at the cursor
	elif iWinSubtypeCode !=wt_unknown then
		BrailleAddString (formatString(cMsgBrailleStruc2, buffer, GetWindowType (GetFocus ())), 0, 0, 0)
		BrailleAddFocusItem()
		Return TRUE
	endIf
endIf
EndFunction

int function brailleBuildLine()
var
int iState
let iState=brailleBuildLine()
if iState then
	return true
endIf
if giCurrentMode & SLIDE_EDIT_MODE || giCurrentMode & LAYOUT_EDIT_MODE then
	if giBrlVerbosity==beginner then
		brailleAddString(gsBRLCurrentMode,0,0,0)
	endIf
	brailleAddString(gsBRLObjectName,0,0,0)
	brailleAddString(gsBRLObjectText,0,0,0)
	return true
elif giCurrentMode & SLIDE_SORT_MODE then
	if giBrlVerbosity==beginner then
		brailleAddString(gsBRLCurrentMode,0,0,0)
	endIf
	brailleAddString(gsBRLSlideInfo,0,0,0)
	return true
elif giCurrentMode then
	brailleAddString(gsBRLCurrentMode,0,0,0)
	brailleAddFocusLine()
	return true
else
	return false
endIf
endFunction

string Function getCurrentDrawingToolDesc ()
var
int iTool
let iTool=oPres.envCurrentTool
oPres.quit

if iTool==INVALID_TOOL  then
	return cscNull
elif iTool==SELECT_OBJECTS then
	return PRMsgSELECT_OBJECTS
elif iTool==CREATE_CHART then
	return PRMsgCREATE_CHART
elif iTool==CREATE_ORG_CHART then
	return PRMsgCREATE_ORG_CHART
elif iTool==CREATE_BULLET_CHART then
	return PRMsgCREATE_BULLET_CHART
elif iTool==CREATE_FIGURE then
	return PRMsgCREATE_FIGURE
elif iTool==CREATE_TEXT_LINE then
	return PRMsgCREATE_TEXT_LINE
elif iTool==DRAW_POLYLINE then
	return PRMsgDRAW_POLYLINE
elif iTool==DRAW_CURVE then
	return PRMsgDRAW_CURVE
elif iTool==DRAW_CLOSED_CURVE then
	return PRMsgDRAW_CLOSED_CURVE
elif iTool==DRAW_POLYGON then
	return PRMsgDRAW_POLYGON
elif iTool==DRAW_REGULAR_POLYGON then
	return PRMsgDRAW_REGULAR_POLYGON
elif iTool==DRAW_RECTANGLE then
	return PRMsgDRAW_RECTANGLE
elif iTool==DRAW_ROUNDED_RECTANGLE then
	return PRMsgDRAW_ROUNDED_RECTANGLE
elif iTool==DRAW_ELLIPSE then
	return PRMsgDRAW_ELLIPSE
elif iTool==DRAW_ELLIPTICAL_ARC then
	return PRMsgDRAW_ELLIPTICAL_ARC
elif iTool==DRAW_CIRCLE then
	return PRMsgDRAW_CIRCLE
elif iTool==DRAW_CIRCULAR_ARC then
	return PRMsgDRAW_CIRCULAR_ARC
elif iTool==DRAW_ARROW then
	return PRMsgDRAW_ARROW
elif iTool==DRAW_BEZIER then
	return PRMsgDRAW_BEZIER
elif iTool==DRAW_FREEHAND then
	return PRMsgDRAW_FREEHAND
elif iTool==CREATE_BITMAP then
	return PRMsgCREATE_BITMAP
elif iTool==BTMP_PAINTBRUSH then
	return PRMsgBTMP_PAINTBRUSH
elif iTool==BTMP_AIRBRUSH then
	return PRMsgBTMP_AIRBRUSH
elif iTool==BTMP_FLOOD_FILL then
	return PRMsgBTMP_FLOOD_FILL
elif iTool==BTMP_DROPPER then
	return PRMsgBTMP_DROPPER
elif iTool==BTMP_PIXEL_REPLACE then
	return PRMsgBTMP_PIXEL_REPLACE
elif iTool==BTMP_ERASER then
	return PRMsgBTMP_ERASER
elif iTool==BTMP_SELECT_AREA then
	return PRMsgBTMP_SELECT_AREA
elif iTool==BTMP_EDIT_FATBITS then
	return PRMsgBTMP_EDIT_FATBITS
elif iTool==BTMP_ACQUIRE_IMAGE then
	return PRMsgBTMP_ACQUIRE_IMAGE
elif iTool==CREATE_TEXT_BOX then
	return PRMsgCREATE_TEXT_BOX
elif iTool==DRAW_LINE then
	return PRMsgDRAW_LINE
elif iTool==SELECT_POINT then
	return PRMsgSELECT_POINT
elif iTool==SELECT_ZOOM_AREA then
	return PRMsgSELECT_ZOOM_AREA
elif iTool==DRAW_SMARTSHAPE then
	return PRMsgDRAW_SMARTSHAPE
endIf
EndFunction

void function sayCurrentDrawingTool ()
var
	string descr
let descr = getCurrentDrawingToolDesc()
if descr != cscNull then
	SayFormattedMessage(ot_no_disable, formatString(PRMsgToolIs_L,descr), formatString(PRMsgToolIs_S,descr))
endIf
EndFunction

int Function setPointerPosition (int iX, int iY)
var
int iNewX,
int iNewY
oPres.SetPointerPosition(iX,iY)
let iNewX=oPres.EnvGetPointerPositionX
let iNewY=oPres.EnvGetPointerPositionY
oPres.quit
return iNewX==iX && iNewY==iY
EndFunction

int Function isCreaterTool ()
var
int iTool,
int iMode

if dialogActive() || menusActive() then
	return false
else
	let iTool=oPres.envCurrentTool
	let iMode=oPres.envCurrentMode
	oPres.quit
return ( !(iMode & (DATA_CHART_MODE | ORG_CHART_MODE | TEXT_EDIT_MODE)) &&
	((iTool >=CREATE_CHART &&
	iTool <=CREATE_BITMAP) ||
	iTool==CREATE_TEXT_BOX ||
	iTool==DRAW_LINE ||
	iTool==DRAW_SMARTSHAPE))
endIf
EndFunction


Void Function sayPointerX ()
if gsUnitsOfMeasure==PRMeasurePoints then
say(WPUnitsToPoints(getPointerX()), ot_position)
else
say(intToString(getPointerX()), ot_position)
endIf
EndFunction

void function sayPointerY ()
if gsUnitsOfMeasure==PRMeasurePoints then
	say(WPUnitsToPoints(getPointerY()), ot_position)
else
	say(intToString(getPointerY()), ot_position)
endIf
EndFunction

int Function hasDrawingToolChanged ()
var
int iCurrentTool

let iCurrentTool=oPres.envCurrentTool
oPres.quit
if iCurrentTool!=giPriorTool then
	let giPriorTool=iCurrentTool
	return true
else
	return false
endIf
EndFunction
