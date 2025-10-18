; JAWS Script File for Wordperfect 8, 9 and 10.
; Object Model interface functions and helper functions
; Copyright (C) 1999-2021 by Freedom Scientific BLV Group, LLC.
; Special thanks for reference information from Marco Zehe OmniPc Germany.
; Some original code taken from WPWin8.* by Sean Murphy.
; Special Thanks to Julie Westergren, www.wpmacros.com
;for the string descriptions corresponding to the int values returned by EnvRightCode for
;Reveal Codes support.

include "hjconst.jsh"
include "hjglobal.jsh"
include "common.jsm"
include "wpwinFunc.jsh"
include "wpwin.jsh"
include "wpwin.jsm"
 ;*** If WP8 constants are required, the function must be put in the wpwin8.jss file


int Function getWPVersion ()
return getProgramVersion(getAppFilePath())
EndFunction

Object Function GetWPObject ()
let oWP = CreateObjectEx(WPPerfectScriptObject,2)
return oWP
EndFunction

Void Function AutostartEvent ()
		let WPVersion=getWPVersion()
	; set default language
	let globalDefaultLanguage=WPUS ; American English
/*
if (GetWindowClass (GetFocus())==wc_MainDocumentWindow) Then
; Place any Object Function calls in this if test.
; Object calls should be only called when the focus is on the document area.
; check if reveal codes is active and set global used for efficiency when navigating
	isRevealCodesActive()
	If (WPVersion ==wpVersion10) Then
		PowerBar(OFF)
	EndIf
EndIf
*/
EndFunction

Void Function AutoFinishEvent ()
Var
Object null
if oWP then
	let oWP = null
EndIf
EndFunction

int Function WPVersionSupported ()
Var
	String sCurVer,
	string sVersionSubString
Let sCurVer = GetRegistryEntryString (0, "WordPerfect.PerfectScript\\CurVer", "")
Let sVersionSubString = "."+IntToString(wpVersion)
Return StringContains(sCurVer, sVersionSubString)
EndFunction

void Function RequestAppCloseEvent ()
	; A WM_CLOSE message has been sent to Wordperfect. Release the
	; application object, on the assumption that the close request
	; will succeed. If the user chooses to keep running WP, the
	; next call to GetWPObject will re-acquire the application object.
	var
		object null
let oWP = null;
EndFunction

Void Function PowerBar (int iState)
if !oWP then
	GetWPObject ()
EndIf

oWP.PowerBarShow (iState)
oWP.Quit ()
EndFunction

String Function getTextJustification (int justification)
Var
	string sBuffer
if justification==WPJustificationLeft then
	Let sBuffer = msgJustificationLeft1_L
elif justification==WPJustificationCenter then
	Let sBuffer = msgJustificationCenter1_L
elif justification==WPJustificationRight then
	let sBuffer = msgJustificationRight1_L
elif justification==WPJustificationFull then
	let sBuffer = msgJustificationFull1_L
endIf
return sBuffer
EndFunction

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
	return formatString(msgWPUToP1, intToString(points), intToString(decimalPlace))
else
	return formatString(msgWPUToP2, intToString(points))
endIf
EndFunction


String Function WpUnitsToInches (Int iUnit)
var
	int iInches,
	int iFraction,
	string SBuffer

let IUnit = (iUnit * 1000)/1200 ; round the number up to include all fractions.
let iInches = iUnit / 1000 ; return the whole part of the number.
let iFraction =  iUnit % 1000 ; return the fractional part of the value to three decimal places.
; the if test rounds the fractional part of the wp measurement to two decimal places, if required.
if ((iFraction % 10) > 4) Then
	Let iFraction  = (iFraction / 10) + 1 ; Round the fraction up to the next value.
Else
	let iFraction = iFraction / 10 ; return the fraction
EndIf
; Correctly format fractional part of inches, so they read correctly.
if (iFraction == 0) Then
	; if the fraction part is zero, then don't report it.
	let sBuffer = FormatString ("%1 inches", intToString (iInches))
Elif (iFraction < 10) Then
	; add zero before fractions that are less than ten.
	let sBuffer = FormatString ("%1.0%2 inches", intToString (iInches), IntToString (iFraction))
Else
	let sBuffer = FormatString ("%1.%2 inches", intToString (iInches), IntToString (iFraction))
EndIf
Return sBuffer
 EndFunction

string Function getUnderlineStyle (int style)
var
	string sBuffer

if style==WPUnderlineSingle then
	let sBuffer = msgUnderline2_L ; single
elif style==WPUnderlineDotted then
	let sBuffer = msgUnderline3_L ;Dotted
elif style==WPUnderlineDashed then
	let sBuffer = msgUnderline4_L ;Dashed
elif style==WPUnderlineDashDot then
	let sBuffer = msgUnderline5_L ;DashDot
elif style==WPUnderlineDashDotDot then
	let sBuffer = msgUnderline6_L ;DashDotDot
elif style==WPUnderlineWavy then
	let sBuffer = 	msgUnderline7_L ;Wavy
elif style==WPUnderlineThick then
	let sBuffer = msgUnderline8_L ;Thick
endIf
Return sBuffer
EndFunction

string Function getStyle ()
var
string currentStyle

if !oWP then
	GetWPObject ()
EndIf
let currentStyle=oWP.envCurrentStyle()
oWP.quit()
return currentStyle
EndFunction

int Function fontIsBold ()
var
int isBold

if !oWP then
	GetWPObject ()
EndIf
let isBold=oWP.envFontBold()
oWP.quit()
return isBold
EndFunction


int Function fontIsUnderlined ()
var
int isUnderline

if !oWP then
	GetWPObject ()
EndIf
let isUnderline=oWP.envFontUnderline()
oWP.quit()
return isUnderline
EndFunction

int Function fontIsItalic ()
var
int isItalic

if !oWP then
	GetWPObject ()
EndIf
let isItalic=oWP.envFontItalics()
oWP.quit()
return isItalic
EndFunction

Void Function justifyCenter ()
if !oWP then
	GetWPObject ()
EndIf
oWP.JustifyCenter()
oWP.quit()
EndFunction

Void Function justifyRight ()
if !oWP then
	GetWPObject ()
EndIf
oWP.JustifyRight
oWP.quit()
EndFunction

Void Function justifyLeft ()
if !oWP then
	GetWPObject ()
EndIf
oWP.JustifyLeft()
oWP.quit()
EndFunction

Void Function justifyFull ()
if !oWP then
	GetWPObject ()
EndIf
oWP.justifyFull()
oWP.quit()
EndFunction

Void Function centerLine ()
if !oWP then
	GetWPObject ()
EndIf
oWP.center()
oWP.quit()
EndFunction

Void Function flushRight ()
if !oWP then
	GetWPObject ()
EndIf
oWP.flushRight()
oWP.quit()
EndFunction

string Function getLanguageFullName (string language)
var
	string sBuffer

If Language == wpUS Then
	let sBuffer = eloqAmericanEnglish
elif language==WPUK then
	let sBuffer = eloqBritishEnglish
ElIf Language == WPES Then
	let sBuffer = eloqCastilianSpanish
ElIf Language == WPEA Then
	let sBuffer = eloqLatinAmericanSpanish
ElIf Language == WPFR Then
	let sBuffer = eloqFrench
ElIf Language == WPDE Then
	let sBuffer = eloqGerman
ElIf Language == WPIT Then
	let sBuffer = eloqItalian
else
	let sBuffer = language ; don't convert it
endIf
return sBuffer
EndFunction

Int Function inTable ()
var
	int iValue

; accessing the object model while in dlgs can cause focus losses.
if not inDocumentWindow() then
	let iValue = false
Else
	if !oWP then
		GetWPObject ()
	EndIf
	let iValue =oWP.envInTable()
	oWP.quit()
EndIf
return iValue
EndFunction

Int Function GetTableAlternateFill ()
Var
	int iFill

if !oWP then
	GetWPObject ()
EndIf
let iFill = oWP.EnvTableAlternateFill ()
oWP.Quit ()
return iFill
EndFunction

Int Function GetTableDefaultLine ()
Var
	Int iValue

if !oWP then
	GetWPObject ()
EndIf
let iValue = oWP.EnvTableDefaultLine
oWP.Quit ()
Return iValue
EndFunction

Void Function GetTableSecondFillStyle ()
Var
	int iValue

if !oWP then
	GetWPObject ()
EndIf
let iValue = oWP.EnvTableSecondFillStyle  ()
oWP.Quit ()
Return iValue
EndFunction

String Function GetTableSkewedInformation ()
var
	String sColumn,
	String sRow,
	String sTextColumnSkewed,
	String sTextRowSkewed,
	string sJoined,
string sSquaredRow

if !oWP then
	GetWPObject ()
EndIf
let sColumn = oWP.EnvTableSkewedColumnAngle ()
let sRow = oWP.EnvTableSkewedRowAngle ()
If oWP.EnvTableSkewedColumnText () Then
	let sTextColumnSkewed = formatString (WPMsgTextIsSkewed_L, scColumn)
else
	let sTextColumnSkewed = formatString (WPMsgTextNotSkewed_L, scColumn)
EndIf
If oWP.EnvTableSkewedJoinedCorners () Then
	let sJoined = WPMsgSkewedJoinedCorners_L
Else
	let sJoined = WPMsgNoSkewedJoinedCorners_L
EndIf
If oWP.EnvTableSkewedRowText () Then
	let sTextRowSkewed= formatString (WPMsgTextIsSkewed_L, scRow)
else
	let sTextRowSkewed = formatString (WPMsgTextNotSkewed_L, scRow)
EndIf
If  oWP.EnvTableSkewedSquareRow () Then
	let sSquaredRow  = WPMsgTableIsSquaredRow_L
else
	Let sSquaredRow = WPMsgTableIsNotSquaredRow_L
EndIf
oWP.Quit ()
Return formatString (wpMsgSkewedInformation_L, sColumn, sRow, sTextColumnSkewed, sTextRowSkewed, sJoined, sSquaredRow)
EndFunction

String Function getTableStyle ()
Var
	int iValue,
	String sBuffer

if !oWP then
	GetWPObject ()
EndIf
let iValue = oWP.envTableStyle ()
oWP.Quit ()
If (iValue == icWPStyle1) Then
	Let sBuffer = WPMsgTableStyle1_L
ElIf (iValue == icWPTableStyle2) Then
	Let sBuffer = WPMsgTableStyle2_L
ElIf (iValue == icWPTableStyle3) Then
	Let sBuffer = WPMsgTableStyle3_L
ElIf (iValue == icWPTableStyle4) Then
	Let sBuffer = WPMsgTableStyle4_L
ElIf (iValue == icWPTableStyle5) Then
	Let sBuffer = WPMsgTableStyle5_L
ElIf (iValue == icWPTableStyle6) Then
	Let sBuffer = WPMsgTableStyle6_L
ElIf (iValue == icWPTableStyle7) Then
	Let sBuffer = WPMsgTableStyle7_L
ElIf (iValue == icWPTableStyle8) Then
	Let sBuffer = WPMsgTableStyle8_L
ElIf (iValue == icWPTableStyle9) Then
	Let sBuffer = WPMsgTableStyle9_L
ElIf (iValue == icWPTableStyle10) Then
	Let sBuffer = WPMsgTableStyle10_L
ElIf (iValue == icWPTableStyle11) Then
	Let sBuffer = WPMsgTableStyle11_L
ElIf (iValue == icWPTableStyle12) Then
	Let sBuffer = WPMsgTableStyle12_L
ElIf (iValue == icWPTableStyle13) Then
	Let sBuffer = WPMsgTableStyle13_L
ElIf (iValue == icWPTableStyle14) Then
	Let sBuffer = WPMsgTableStyle14_L
ElIf (iValue == icWPTableStyle15) Then
	Let sBuffer = WPMsgTableStyle15_L
ElIf (iValue == icWPTableStyle16) Then
	Let sBuffer = WPMsgTableStyle16_L
ElIf (iValue == icWPTableStyle17) Then
	Let sBuffer = WPMsgTableStyle17_L
ElIf (iValue == icWPTableStyle18) Then
	Let sBuffer = WPMsgTableStyle18_L
ElIf (iValue == icWPTableStyle19) Then
	Let sBuffer = WPMsgTableStyle19_L
ElIf (iValue == icWPTableStyle20) Then
	Let sBuffer = WPMsgTableStyle20_L
ElIf (iValue == icWPTableStyle21) Then
	Let sBuffer = WPMsgTableStyle21_L
ElIf (iValue == icWPTableStyle22) Then
	Let sBuffer = WPMsgTableStyle22_L
ElIf (iValue == icWPTableStyle23) Then
	Let sBuffer = WPMsgTableStyle23_L
ElIf (iValue == icWPTableStyle24) Then
	Let sBuffer = WPMsgTableStyle24_L
ElIf (iValue == icWPTableStyle25) Then
	Let sBuffer = WPMsgTableStyle25_L
ElIf (iValue == icWPTableStyle26) Then
	Let sBuffer = WPMsgTableStyle26_L
ElIf (iValue == icWPTableStyle27) Then
	Let sBuffer = WPMsgTableStyle27_L
ElIf (iValue == icWPTableStyle28) Then
	Let sBuffer = WPMsgTableStyle28_L
ElIf (iValue == icWPTableStyle29) Then
	Let sBuffer = WPMsgTableStyle29_L
ElIf (iValue == icWPTableStyle30) Then
	Let sBuffer = WPMsgTableStyle30_L
ElIf (iValue == icWPTableStyle31) Then
	Let sBuffer = WPMsgTableStyle31_L
ElIf (iValue == icWPTableStyle32) Then
	Let sBuffer = WPMsgTableStyle32_L
ElIf (iValue == icWPTableStyle33) Then
	Let sBuffer = WPMsgTableStyle33_L
ElIf (iValue == icWPTableStyle34) Then
	Let sBuffer = WPMsgTableStyle34_L
ElIf (iValue == icWPTableStyle35) Then
	Let sBuffer = WPMsgTableStyle35_L
ElIf (iValue == icWPTableStyle36) Then
	Let sBuffer = WPMsgTableStyle36_L
ElIf (iValue == icWPTableStyle37) Then
	Let sBuffer = WPMsgTableStyle37_L
ElIf (iValue == icWPTableStyle38) Then
	Let sBuffer = WPMsgTableStyle38_L
ElIf (iValue == icWPTableStyle39) Then
	Let sBuffer = WPMsgTableStyle39_L
ElIf (iValue == icWPTableStyle40) Then
	Let sBuffer = WPMsgTableStyle40_L
ElIf (iValue == icWPTableStyle41) Then
	Let sBuffer = WPMsgTableStyle41_L
ElIf (iValue == icWPTableStyle42) Then
	Let sBuffer = WPMsgTableStyle42_L
ElIf (iValue == icWPNoTableStyle) Then
	Let sBuffer = WPMsgTableNoStyle_L
Else
	let sBuffer = IntToString (iValue)
EndIf
return sBuffer
EndFunction

string Function getTableCellCoordinates ()
var
string cell
if !oWP then
	GetWPObject ()
EndIf
let cell=oWP.envCell()
oWP.quit()
return cell
EndFunction

string Function getTableName ()
var
string tableName
if !oWP then
	GetWPObject ()
EndIf
let tableName=oWP.envCurrentTableName()
oWP.quit()
return tableName
EndFunction

string Function getCellVerticalAlignment (int alignment)
Var
	string sBuffer

if alignment==WPCellTop then
	let sBuffer = msgCellTop1_L
elif alignment==WPCellBottom then
	let sBuffer = msgCellBottom1_L
elif alignment==WPCellCenter then
	let sBuffer = msgCellCenter1_L
endIf
return sBuffer
EndFunction

string Function GetCellWidth ()
Var
	Int ICellWidth

if !oWP then
	GetWPObject ()
EndIf
Let iCellWidth = oWP.envCellWidth()
oWP.Quit ()
Return WPUnitsToInches (iCellWidth)
EndFunction

String Function GetColumnWidth ()
Var
	int iColumnWidth

if !oWP then
	GetWPObject ()
EndIf
Let iColumnWidth = oWP.EnvColumnWidth ()
oWP.Quit
Return WPUnitsToPoints (iColumnWidth)
EndFunction

String Function GetColumnDefinition ()
Var
	String sBuffer

if !oWP then
	GetWPObject ()
EndIf
		If (oWP.EnvColumnDefine () ==WPColumnNewspaper) Then
			Let sBuffer = "NewsPaper "
		ElIf (oWP.EnvColumnDefine () ==WPColumnNewspaperBalance) Then
			Let sBuffer = "Newspaper balanced "
		ElIf (oWP.EnvColumnDefine () ==WPColumnParallel) Then
			Let sBuffer = "Parallel "
		ElIf (oWP.EnvColumnDefine () ==WPColumnParallelBlockProtect) Then
			Let sBuffer = "Parallel block protect "
		EndIf
oWP.Quit ()
Return sBuffer
EndFunction

string Function GetRowWidth ()
Var
	int iRowWidth

if !oWP then
	GetWPObject ()
EndIf
Let iRowWidth = oWP.EnvRowWidth ()
oWP.Quit ()
Return WPUnitsToPoints (iRowWidth)
EndFunction

Void Function SayTableSize ()
Var
	string sCurrentCell,
	int iColumn,
	int iRow,
	string sBuffer


if !oWP then
	GetWPObject ()
EndIf
let sCurrentCell = getTableCellCoordinates  ()
oWP.PosTableEnd ()
let iColumn = oWP.EnvColumn ()
let iRow = oWp.EnvRow ()
oWP.PosTableCell (sCurrentCell)
oWP.Quit
let sBuffer = FormatString (WPmsgTableSize_L, IntToString (iColumn), IntToString (iRow))
SayFormattedMessageWithVoice (VCTX_MESSAGE, OT_HELP, sBuffer, cscNull)
EndFunction

string Function getRevealCodeDesc (int code)
; NOTE: This function is only valid when passed EnvRightCode values as
;envLeftCode values differ for some codes.
; need to fix following:
; code 722 which has two possible renderings
; code 9684 which has two possible renderings
Var
	String sBuffer,
	String sFontName,
	Int iPointSize

if !oWP then
	GetWPObject ()
EndIf
oWP.PosCharNext ()
let sFontName = oWP.EnvFont()
Let iPointSize = oWP.EnvFontSize()
oWP.PosCharPrevious ()
oWP.quit()
if code==0 then
	Let sBuffer = cscNull
elif code==WPRevealCode129 then
	Let sBuffer = WPRCMsg1_L
elif code==WPRevealCode130 then
	Let sBuffer = WPRCMsg2_L
elif code==WPRevealCode132 then
	Let sBuffer = WPRCMsg3_L
elif code==WPRevealCode134 then
	Let sBuffer = WPRCMsg4_L
elif code==WPRevealCode135 then
	Let sBuffer = WPRCMsg5_L
elif code==WPRevealCode137 then
	Let sBuffer = WPRCMsg6_L
elif code==WPRevealCode144 then
	Let sBuffer = WPRCMsg7_L
elif code==WPRevealCode183 then
	Let sBuffer = WPRCMsg8_L
elif code==WPRevealCode184 then
	Let sBuffer = WPRCMsg9_L
elif code==WPRevealCode185 then
	Let sBuffer = WPRCMsg10_L
elif code==WPRevealCode186 then
	Let sBuffer = WPRCMsg11_L
elif code==WPRevealCode187 then
	Let sBuffer = WPRCMsg12_L
elif code==WPRevealCode188 then
	Let sBuffer = WPRCMsg13_L
elif code==WPRevealCode189 then
	Let sBuffer = WPRCMsg14_L
elif code==WPRevealCode191 then
	Let sBuffer = WPRCMsg15_L
elif code==WPRevealCode192 then
	Let sBuffer = WPRCMsg16_L
elif code==WPRevealCode195 then
	Let sBuffer = WPRCMsg17_L
elif code==WPRevealCode196 then
	Let sBuffer = WPRCMsg18_L
elif code==WPRevealCode197 then
	Let sBuffer = WPRCMsg19_L
elif code==WPRevealCode198 then
	Let sBuffer = WPRCMsg20_L
elif code==WPRevealCode199 then
	Let sBuffer = WPRCMsg21_L
elif code==WPRevealCode200 then
	Let sBuffer = WPRCMsg22_L
elif code==WPRevealCode201 then
	Let sBuffer = WPRCMsg23_L
elif code==WPRevealCode202 then
	Let sBuffer = WPRCMsg24_L
elif code==WPRevealCode203 then
	Let sBuffer = WPRCMsg25_L
elif code==WPRevealCode204 then
	Let sBuffer = WPRCMsg26_L
elif code==WPRevealCode205 then
	Let sBuffer = WPRCMsg27_L
elif code==WPRevealCode206 then
	Let sBuffer = WPRCMsg28_L
elif code==WPRevealCode207 then
	Let sBuffer = WPRCMsg29_L
elif code==WPRevealCode209 then
	Let sBuffer = WPRCMsg30_L
elif code==WPRevealCode210 then
	Let sBuffer = WPRCMsg31_L
elif code==WPRevealCode211 then
	Let sBuffer = WPRCMsg32_L
elif code==WPRevealCode212 then
	Let sBuffer = WPRCMsg33_L
elif code==WPRevealCode213 then
	Let sBuffer = WPRCMsg34_L
elif code==WPRevealCode214 then
	Let sBuffer = WPRCMsg35_L
elif code==WPRevealCode215 then
	Let sBuffer = WPRCMsg36_L
elif code==WPRevealCode216 then
	Let sBuffer = WPRCMsg37_L
elif code==WPRevealCode217 then
	Let sBuffer = WPRCMsg38_L
elif code==WPRevealCode218 then
	Let sBuffer = WPRCMsg39_L
elif code==WPRevealCode219 then
	Let sBuffer = WPRCMsg40_L
elif code==WPRevealCode220 then
	Let sBuffer = WPRCMsg41_L
elif code==WPRevealCode221 then
	Let sBuffer = WPRCMsg42_L
elif code==WPRevealCode222 then
	Let sBuffer = WPRCMsg43_L
elif code==WPRevealCode223 then
	Let sBuffer = WPRCMsg44_L
elif code==WPRevealCode224 then
	Let sBuffer = WPRCMsg45_L
elif code==WPRevealCode242 then
	Let sBuffer = WPRCMsg46_L
elif code==WPRevealCode243 then
	Let sBuffer = WPRCMsg47_L
elif code==WPRevealCode465 then
	Let sBuffer = WPRCMsg48_L
elif code==WPRevealCode466 then
	Let sBuffer = WPRCMsg49_L
elif code==WPRevealCode467 then
	Let sBuffer = WPRCMsg50_L
elif code==WPRevealCode468 then
	Let sBuffer = WPRCMsg51_L
elif code==WPRevealCode470 then
	Let sBuffer = WPRCMsg52_L
elif code==WPRevealCode474 then
	Let sBuffer = WPRCMsg53_L
elif code==WPRevealCode478 then
	Let sBuffer = WPRCMsg54_L
elif code==WPRevealCode479 then
	Let sBuffer = WPRCMsg55_L
elif code==WPRevealCode498 then
	Let sBuffer = WPRCMsg56_L
elif code==WPRevealCode499 then
	Let sBuffer = WPRCMsg57_L
elif code==WPRevealCode721 then
	Let sBuffer = WPRCMsg58_L
elif code==WPRevealCode722 then
; two possible values
; need to distinguish but at the moment, just assume first
	Let sBuffer = WPRCMsg59_L
elif code==WPRevealCode723 then
	Let sBuffer = WPRCMsg60_L
elif code==WPRevealCode724 then
	Let sBuffer = WPRCMsg61_L
elif code==WPRevealCode725 then
	Let sBuffer = WPRCMsg62_L
elif code==WPRevealCode726 then
	Let sBuffer = WPRCMsg63_L
elif code==WPRevealCode727 then
	Let sBuffer = WPRCMsg64_L
elif code==WPRevealCode728 then
	Let sBuffer = WPRCMsg65_L
elif code==WPRevealCode731 then
	Let sBuffer = WPRCMsg66_L
elif code==WPRevealCode732 then
	Let sBuffer = WPRCMsg67_L
elif code==WPRevealCode734 then
	Let sBuffer = WPRCMsg68_L
elif code==WPRevealCode754 then
	Let sBuffer = WPRCMsg69_L
elif code==WPRevealCode755 then
	Let sBuffer = WPRCMsg70_L
elif code==WPRevealCode977 then
	Let sBuffer = WPRCMsg71_L
elif code==WPRevealCode978 then
	Let sBuffer = WPRCMsg72_L
elif code==WPRevealCode979 then
	Let sBuffer = WPRCMsg73_L
elif code==WPRevealCode980 then
	Let sBuffer = WPRCMsg74_L
elif code==WPRevealCode982 then
	Let sBuffer = WPRCMsg75_L
elif code==WPRevealCode984 then
	Let sBuffer = WPRCMsg76_L
elif code==WPRevealCode985 then
	Let sBuffer = WPRCMsg77_L
elif code==WPRevealCode987 then
	Let sBuffer = WPRCMsg78_L
elif code==WPRevealCode988 then
	Let sBuffer = WPRCMsg79_L
elif code==WPRevealCode990 then
	Let sBuffer = WPRCMsg80_L
elif code==WPRevealCode991 then
	Let sBuffer = WPRCMsg81_L
elif code==WPRevealCode1010 then
	Let sBuffer = WPRCMsg82_L
elif code==WPRevealCode1011 then
	Let sBuffer = WPRCMsg83_L
elif code==WPRevealCode1232 then
	Let sBuffer = WPRCMsg84_L
elif code==WPRevealCode1233 then
	Let sBuffer = WPRCMsg85_L
elif code==WPRevealCode1235 then
	Let sBuffer = WPRCMsg86_L
elif code==WPRevealCode1236 then
	Let sBuffer = WPRCMsg87_L
elif code==WPRevealCode1237 then
	Let sBuffer = WPRCMsg88_L
elif code==WPRevealCode1238 then
	Let sBuffer = WPRCMsg89_L
elif code==WPRevealCode1240 then
	Let sBuffer = WPRCMsg90_L
elif code==WPRevealCode1241 then
	Let sBuffer = WPRCMsg91_L
elif code==WPRevealCode1242 then
	Let sBuffer = WPRCMsg92_L
elif code==WPRevealCode1243 then
	Let sBuffer = WPRCMsg93_L
elif code==WPRevealCode1244 then
	Let sBuffer = WPRCMsg94_L
elif code==WPRevealCode1245 then
	Let sBuffer = WPRCMsg95_L
elif code==WPRevealCode1246 then
	Let sBuffer = WPRCMsg96_L
elif code==WPRevealCode1266 then
	Let sBuffer = WPRCMsg97_L
elif code==WPRevealCode1267 then
	Let sBuffer = WPRCMsg98_L
elif code==WPRevealCode1489 then
	Let sBuffer = WPRCMsg99_L
elif code==WPRevealCode1491 then
	Let sBuffer = WPRCMsg100_L
elif code==WPRevealCode1492 then
	Let sBuffer = WPRCMsg101_L
elif code==WPRevealCode1494 then
	Let sBuffer = WPRCMsg102_L
elif code==WPRevealCode1496 then
	Let sBuffer = WPRCMsg103_L
elif code==WPRevealCode1497 then
	Let sBuffer = WPRCMsg104_L
elif code==WPRevealCode1499 then
	Let sBuffer = WPRCMsg105_L
elif code==WPRevealCode1500 then
	Let sBuffer = WPRCMsg106_L
elif code==WPRevealCode1502 then
	Let sBuffer = WPRCMsg107_L
elif code==WPRevealCode1522 then
	Let sBuffer = WPRCMsg108_L
elif code==WPRevealCode1523 then
	Let sBuffer = WPRCMsg109_L
elif code==WPRevealCode1745 then
	Let sBuffer = WPRCMsg110_L
elif code==WPRevealCode1747 then
	Let sBuffer = WPRCMsg111_L
elif code==WPRevealCode1748 then
	Let sBuffer = WPRCMsg112_L
elif code==WPRevealCode1749 then
	Let sBuffer = WPRCMsg113_L
elif code==WPRevealCode1754 then
	Let sBuffer = WPRCMsg114_L
elif code==WPRevealCode1757 then
; this code has different values for EnvLeftCode and envRightCode
; We must append the name of the style to this code.
	Let sBuffer = WPRCMsg115_L+cscSpace+getStyle()
elif code==WPRevealCode1758 then
	Let sBuffer = WPRCMsg116_L
elif code==WPRevealCode1778 then
	Let sBuffer = WPRCMsg117_L
elif code==WPRevealCode1779 then
	Let sBuffer = WPRCMsg118_L
elif code==WPRevealCode2001 then
	Let sBuffer = WPRCMsg119_L
elif code==WPRevealCode2003 then
	Let sBuffer = WPRCMsg120_L
elif code==WPRevealCode2004 then
	Let sBuffer = WPRCMsg121_L
elif code==WPRevealCode2008 then
	Let sBuffer = WPRCMsg122_L
elif code==WPRevealCode2009 then
	Let sBuffer = WPRCMsg123_L
elif code==WPRevealCode2011 then
	Let sBuffer = WPRCMsg124_L
elif code==WPRevealCode2012 then
	Let sBuffer = WPRCMsg125_L
elif code==WPRevealCode2014 then
	Let sBuffer = WPRCMsg126_L
elif code==WPRevealCode2034 then
	Let sBuffer = WPRCMsg127_L
elif code==WPRevealCode2035 then
	Let sBuffer = WPRCMsg128_L
elif code==WPRevealCode2257 then
	Let sBuffer = WPRCMsg129_L
elif code==WPRevealCode2259 then
	Let sBuffer = WPRCMsg130_L
elif code==WPRevealCode2260 then
	Let sBuffer = WPRCMsg131_L
elif code==WPRevealCode2261 then
	Let sBuffer = WPRCMsg132_L
elif code==WPRevealCode2264 then
	Let sBuffer = WPRCMsg133_L
elif code==WPRevealCode2265 then
	Let sBuffer = WPRCMsg134_L
elif code==WPRevealCode2266 then
	Let sBuffer = WPRCMsg135_L
elif code==WPRevealCode2267 then
	Let sBuffer = WPRCMsg136_L
elif code==WPRevealCode2268 then
	Let sBuffer = WPRCMsg137_L
elif code==WPRevealCode2269 then
	Let sBuffer = WPRCMsg138_L
elif code==WPRevealCode2270 then
	Let sBuffer = WPRCMsg139_L
elif code==WPRevealCode2290 then
	Let sBuffer = WPRCMsg140_L
elif code==WPRevealCode2291 then
	Let sBuffer = WPRCMsg141_L
elif code==WPRevealCode2513 then
	Let sBuffer = WPRCMsg142_L
elif code==WPRevealCode2515 then
	Let sBuffer = WPRCMsg143_L
elif code==WPRevealCode2516 then
	Let sBuffer = WPRCMsg144_L
elif code==WPRevealCode2520 then
	Let sBuffer = WPRCMsg145_L
elif code==WPRevealCode2521 then
	Let sBuffer = WPRCMsg146_L
elif code==WPRevealCode2526 then
	Let sBuffer = WPRCMsg147_L
elif code==WPRevealCode2546 then
	Let sBuffer = WPRCMsg148_L
elif code==WPRevealCode2547 then
	Let sBuffer = WPRCMsg149_L
elif code==WPRevealCode2769 then
	Let sBuffer = WPRCMsg150_L
elif code==WPRevealCode2771 then
	Let sBuffer = WPRCMsg151_L
elif code==WPRevealCode2772 then
	Let sBuffer = WPRCMsg152_L
elif code==WPRevealCode2773 then
	Let sBuffer = WPRCMsg153_L
elif code==WPRevealCode2778 then
	Let sBuffer = WPRCMsg154_L
elif code==WPRevealCode2781 then
	Let sBuffer = WPRCMsg155_L
elif code==WPRevealCode2782 then
	Let sBuffer = WPRCMsg156_L
elif code==WPRevealCode2802 then
	Let sBuffer = WPRCMsg157_L
elif code==WPRevealCode2803 then
	Let sBuffer = WPRCMsg158_L
elif code==WPRevealCode3025 then
	Let sBuffer = WPRCMsg159_L
elif code==WPRevealCode3027 then
	Let sBuffer = WPRCMsg160_L
elif code==WPRevealCode3028 then
	Let sBuffer = WPRCMsg161_L
elif code==WPRevealCode3037 then
	Let sBuffer = WPRCMsg162_L
elif code==WPRevealCode3038 then
	Let sBuffer = WPRCMsg163_L
elif code==WPRevealCode3058 then
	Let sBuffer = WPRCMsg164_L
elif code==WPRevealCode3059 then
	Let sBuffer = WPRCMsg165_L
elif code==WPRevealCode3281 then
	Let sBuffer = WPRCMsg166_L
elif code==WPRevealCode3283 then
	Let sBuffer = WPRCMsg167_L
elif code==WPRevealCode3285 then
	Let sBuffer = WPRCMsg168_L
elif code==WPRevealCode3294 then
	Let sBuffer = WPRCMsg169_L
elif code==WPRevealCode3314 then
	Let sBuffer = WPRCMsg170_L
elif code==WPRevealCode3315 then
	Let sBuffer = WPRCMsg171_L
elif code==WPRevealCode3537 then
	Let sBuffer = WPRCMsg172_L
elif code==WPRevealCode3539 then
	Let sBuffer = WPRCMsg173_L
elif code==WPRevealCode3550 then
	Let sBuffer = WPRCMsg174_L
elif code==WPRevealCode3570 then
	Let sBuffer = WPRCMsg175_L
elif code==WPRevealCode3571 then
	Let sBuffer = WPRCMsg176_L
elif code==WPRevealCode3793 then
	Let sBuffer = WPRCMsg177_L
elif code==WPRevealCode3796 then
	Let sBuffer = WPRCMsg178_L
elif code==WPRevealCode3797 then
	Let sBuffer = WPRCMsg179_L
elif code==WPRevealCode3802 then
	Let sBuffer = WPRCMsg180_L
elif code==WPRevealCode3806 then
	Let sBuffer = WPRCMsg181_L
elif code==WPRevealCode3826 then
	Let sBuffer = WPRCMsg182_L
elif code==WPRevealCode3827 then
	Let sBuffer = WPRCMsg183_L
elif code==WPRevealCode4049 then
	Let sBuffer = WPRCMsg184_L
elif code==WPRevealCode4051 then
	Let sBuffer = WPRCMsg185_L
elif code==WPRevealCode4052 then
	Let sBuffer = WPRCMsg186_L
elif code==WPRevealCode4062 then
	Let sBuffer = WPRCMsg187_L
elif code==WPRevealCode4082 then
	Let sBuffer = WPRCMsg188_L
elif code==WPRevealCode4083 then
	Let sBuffer = WPRCMsg189_L
elif code==WPRevealCode4305 then
	Let sBuffer = WPRCMsg190_L
elif code==WPRevealCode4308 then
	Let sBuffer = WPRCMsg191_L
elif code==WPRevealCode4309 then
	Let sBuffer = WPRCMsg192_L
elif code==WPRevealCode4314 then
	Let sBuffer = WPRCMsg193_L
elif code==WPRevealCode4318 then
	Let sBuffer = WPRCMsg194_L
elif code==WPRevealCode4320 then
	Let sBuffer = WPRCMsg195_L
elif code==WPRevealCode4561 then
	Let sBuffer = WPRCMsg196_L
elif code==WPRevealCode4574 then
	Let sBuffer = WPRCMsg197_L
elif code==WPRevealCode4576 then
	Let sBuffer = WPRCMsg198_L
elif code==WPRevealCode4817 then
	Let sBuffer = WPRCMsg199_L
elif code==WPRevealCode4819 then
	Let sBuffer = WPRCMsg200_L
elif code==WPRevealCode4830 then
	Let sBuffer = WPRCMsg201_L
elif code==WPRevealCode4832 then
	Let sBuffer = WPRCMsg202_L
elif code==WPRevealCode5073 then
	Let sBuffer = WPRCMsg203_L
elif code==WPRevealCode5075 then
	Let sBuffer = WPRCMsg204_L
elif code==WPRevealCode5088 then
	Let sBuffer = WPRCMsg205_L
elif code==WPRevealCode5329 then
	Let sBuffer = WPRCMsg206_L
elif code==WPRevealCode5331 then
	Let sBuffer = WPRCMsg207_L
elif code==WPRevealCode5342 then
	Let sBuffer = WPRCMsg208_L
elif code==WPRevealCode5585 then
	Let sBuffer = WPRCMsg209_L
elif code==WPRevealCode5588 then
	Let sBuffer = WPRCMsg210_L
elif code==WPRevealCode5841 then
	Let sBuffer = WPRCMsg211_L
elif code==WPRevealCode5843 then
	Let sBuffer = WPRCMsg212_L
elif code==WPRevealCode5844 then
	Let sBuffer = WPRCMsg213_L
elif code==WPRevealCode5854 then
	Let sBuffer = WPRCMsg214_L
elif code==WPRevealCode6110 then
	Let sBuffer = WPRCMsg215_L
elif code==WPRevealCode6353 then
	Let sBuffer = WPRCMsg216_L
elif code==WPRevealCode6356 then
	Let sBuffer = WPRCMsg217_L
elif code==WPRevealCode6366 then
	Let sBuffer = WPRCMsg218_L
elif code==WPRevealCode6612 then
	Let sBuffer = WPRCMsg219_L
elif code==WPRevealCode6622 then
	Let sBuffer = WPRCMsg220_L
elif code==WPRevealCode6868 then
;	Let sBuffer = WPRCMsg221_L
	Let sBuffer = FormatString (WPRCMsg221_L, sFontName)
elif code==WPRevealCode6878 then
	Let sBuffer = WPRCMsg222_L
elif code==WPRevealCode7121 then
	Let sBuffer = WPRCMsg223_L
elif code==WPRevealCode7124 then
;Have to get the next character, before the next line will work.
	Let sBuffer = FormatString (WPRCMsg224_L, WPUnitsToPoints (iPointSize))
elif code==WPRevealCode7134 then
	Let sBuffer = WPRCMsg225_L
elif code==WPRevealCode7380 then
	Let sBuffer = WPRCMsg226_L
elif code==WPRevealCode7390 then
	Let sBuffer = WPRCMsg227_L
elif code==WPRevealCode7636 then
	Let sBuffer = WPRCMsg228_L
elif code==WPRevealCode7646 then
	Let sBuffer = WPRCMsg229_L
elif code==WPRevealCode7892 then
	Let sBuffer = WPRCMsg230_L
elif code==WPRevealCode8148 then
	Let sBuffer = WPRCMsg231_L
elif code==WPRevealCode8404 then
	Let sBuffer = WPRCMsg232_L
elif code==WPRevealCode8916 then
	Let sBuffer = WPRCMsg233_L
elif code==WPRevealCode9172 then
	Let sBuffer = WPRCMsg234_L
elif code==WPRevealCode9428 then
	Let sBuffer = WPRCMsg235_L
elif code==WPRevealCode9684 then
; two possible values, need to distinguish
; just return first at the moment
	Let sBuffer = WPRCMsg236_L
elif code==WPRevealCode9940 then
	Let sBuffer = WPRCMsg237_L
elif code==WPRevealCode10196 then
	Let sBuffer = WPRCMsg238_L
elif code==WPRevealCode10452 then
	Let sBuffer = WPRCMsg239_L
elif code==WPRevealCode10708 then
	Let sBuffer = WPRCMsg240_L
elif code==WPRevealCode10964 then
	Let sBuffer = WPRCMsg241_L
elif code==WPRevealCode11988 then
	Let sBuffer = WPRCMsg242_L
elif code==WPRevealCode12500 then
	Let sBuffer = WPRCMsg243_L
elif code==WPRevealCode12510 then
	Let sBuffer = WPRCMsg244_L
elif code==WPRevealCode12512 then
	Let sBuffer = WPRCMsg245_L
elif code==WPRevealCode12756 then
	Let sBuffer = WPRCMsg246_L
elif code==WPRevealCode12766 then
	Let sBuffer = WPRCMsg247_L
elif code==WPRevealCode13022 then
	Let sBuffer = WPRCMsg248_L
elif code==WPRevealCode13278 then
	Let sBuffer = WPRCMsg249_L
elif code==WPRevealCode13524 then
	Let sBuffer = WPRCMsg250_L
elif code==WPRevealCode13534 then
	Let sBuffer = WPRCMsg251_L
elif code==WPRevealCode13790 then
	Let sBuffer = WPRCMsg252_L
elif code==WPRevealCode14036 then
	Let sBuffer = WPRCMsg253_L
elif code==WPRevealCode14046 then
	Let sBuffer = WPRCMsg254_L
elif code==WPRevealCode14302 then
	Let sBuffer = WPRCMsg255_L
elif code==WPRevealCode14558 then
	Let sBuffer = WPRCMsg256_L
elif code==WPRevealCode14560 then
	Let sBuffer = WPRCMsg257_L
elif code==WPRevealCode14814 then
	Let sBuffer = WPRCMsg258_L
elif code==WPRevealCode15060 then
	Let sBuffer = WPRCMsg259_L
elif code==WPRevealCode15070 then
	Let sBuffer = WPRCMsg260_L
elif code==WPRevealCode15316 then
	Let sBuffer = WPRCMsg261_L
elif code==WPRevealCode15326 then
	Let sBuffer = WPRCMsg262_L
elif code==WPRevealCode16084 then
	Let sBuffer = WPRCMsg263_L
elif code==WPRevealCode16094 then
	Let sBuffer = WPRCMsg264_L
elif code==WPRevealCode16350 then
	Let sBuffer = WPRCMsg265_L
elif code==WPRevealCode16596 then
	Let sBuffer = WPRCMsg266_L
elif code==WPRevealCode16606 then
	Let sBuffer = WPRCMsg267_L
elif code==WPRevealCode17120 then
	Let sBuffer = WPRCMsg268_L
elif code==WPRevealCode16608 then
	Let sBuffer = WPRCMsg269_L
elif code==WPRevealCode16862 then
	Let sBuffer = WPRCMsg270_L
elif code==WPRevealCode17108 then
	Let sBuffer = WPRCMsg271_L
elif code==WPRevealCode17118 then
	Let sBuffer = WPRCMsg272_L
elif code==WPRevealCode17364 then
	Let sBuffer = WPRCMsg273_L
elif code==WPRevealCode17374 then
	Let sBuffer = WPRCMsg274_L
elif code==WPRevealCode17620 then
	Let sBuffer = WPRCMsg275_L
elif code==WPRevealCode17630 then
	Let sBuffer = WPRCMsg276_L
elif code==WPRevealCode17876 then
	Let sBuffer = WPRCMsg277_L
elif code==WPRevealCode17886 then
	Let sBuffer = WPRCMsg278_L
elif code==WPRevealCode18142 then
	Let sBuffer = WPRCMsg279_L
elif code==WPRevealCode18398 then
	Let sBuffer = WPRCMsg280_L
elif code==WPRevealCode18654 then
	Let sBuffer = WPRCMsg281_L
elif code==WPRevealCode18656 then
	Let sBuffer = WPRCMsg282_L
elif code==WPRevealCode18910 then
	Let sBuffer = WPRCMsg283_L
elif code==WPRevealCode19166 then
	Let sBuffer = WPRCMsg284_L
elif code==WPRevealCode19422 then
	Let sBuffer = WPRCMsg285_L
elif code==WPRevealCode19678 then
	Let sBuffer = WPRCMsg286_L
elif code==WPRevealCode19934 then
	Let sBuffer = WPRCMsg287_L
elif code==WPRevealCode20190 then
	Let sBuffer = WPRCMsg288_L
elif code==WPRevealCode20446 then
	Let sBuffer = WPRCMsg289_L
elif code==WPRevealCode20702 then
	Let sBuffer = WPRCMsg290_L
elif code==WPRevealCode20704 then
	Let sBuffer = WPRCMsg291_L
elif code==WPRevealCode20958 then
	Let sBuffer = WPRCMsg292_L
elif code==WPRevealCode20960 then
	Let sBuffer = WPRCMsg293_L
elif code==WPRevealCode21214 then
	Let sBuffer = WPRCMsg294_L
elif code==WPRevealCode21216 then
	Let sBuffer = WPRCMsg295_L
elif code==WPRevealCode21470 then
	Let sBuffer = WPRCMsg296_L
elif code==WPRevealCode21472 then
	Let sBuffer = WPRCMsg297_L
elif code==WPRevealCode21726 then
	Let sBuffer = WPRCMsg298_L
elif code==WPRevealCode21982 then
	Let sBuffer = WPRCMsg299_L
elif code==WPRevealCode22238 then
	Let sBuffer = WPRCMsg300_L
elif code==WPRevealCode22494 then
	Let sBuffer = WPRCMsg301_L
elif code==WPRevealCode22750 then
	Let sBuffer = WPRCMsg302_L
elif code==WPRevealCode23006 then
	Let sBuffer = WPRCMsg303_L
elif code==WPRevealCode23262 then
	Let sBuffer = WPRCMsg304_L
elif code==WPRevealCode23518 then
	Let sBuffer = WPRCMsg305_L
elif code==WPRevealCode23774 then
	Let sBuffer = WPRCMsg306_L
elif code==WPRevealCode24030 then
	Let sBuffer = WPRCMsg307_L
elif code==WPRevealCode24286 then
	Let sBuffer = WPRCMsg308_L
elif code==WPRevealCode24542 then
	Let sBuffer = WPRCMsg309_L
elif code==WPRevealCode24798 then
	Let sBuffer = WPRCMsg310_L
elif code==WPRevealCode25054 then
	Let sBuffer = WPRCMsg311_L
elif code==WPRevealCode25310 then
	Let sBuffer = WPRCMsg312_L
elif code==WPRevealCode25566 then
	Let sBuffer = WPRCMsg313_L
elif code==WPRevealCode25822 then
	Let sBuffer = WPRCMsg314_L
elif code==WPRevealCode26078 then
	Let sBuffer = WPRCMsg315_L
elif code==WPRevealCode26334 then
	Let sBuffer = WPRCMsg316_L
elif code==WPRevealCode26590 then
	Let sBuffer = WPRCMsg317_L
elif code==WPRevealCode26846 then
	Let sBuffer = WPRCMsg318_L
elif code==WPRevealCode27102 then
	Let sBuffer = WPRCMsg319_L
elif code==WPRevealCode27358 then
	Let sBuffer = WPRCMsg320_L
elif code==WPRevealCode27614 then
	Let sBuffer = WPRCMsg321_L
elif code==WPRevealCode27870 then
	Let sBuffer = WPRCMsg322_L
elif code==WPRevealCode28126 then
	Let sBuffer = WPRCMsg323_L
elif code==WPRevealCode28382 then
	Let sBuffer = WPRCMsg324_L
elif code==WPRevealCode28638 then
	Let sBuffer = WPRCMsg325_L
elif code==WPRevealCode28894 then
	Let sBuffer = WPRCMsg326_L
elif code==WPRevealCode29150 then
	Let sBuffer = WPRCMsg327_L
elif code==WPRevealCode29406 then
	Let sBuffer = WPRCMsg328_L
elif code==WPRevealCode29662 then
	Let sBuffer = WPRCMsg329_L
elif code==WPRevealCode29918 then
	Let sBuffer = WPRCMsg330_L
elif code==WPRevealCode30174 then
	Let sBuffer = WPRCMsg331_L
elif code==WPRevealCode30430 then
	Let sBuffer = WPRCMsg332_L
elif code==WPRevealCode30686 then
	Let sBuffer = WPRCMsg333_L
elif code==WPRevealCode30942 then
	Let sBuffer = WPRCMsg334_L
elif code==WPRevealCode31198 then
	Let sBuffer = WPRCMsg335_L
elif code==WPRevealCode31454 then
	Let sBuffer = WPRCMsg336_L
elif code==WPRevealCode31710 then
	Let sBuffer = WPRCMsg337_L
elif code==WPRevealCode31966 then
	Let sBuffer = WPRCMsg338_L
elif code==WPRevealCode32222 then
	Let sBuffer = WPRCMsg339_L
elif code==WPRevealCode32478 then
	Let sBuffer = WPRCMsg340_L
elif code==WPRevealCode32734 then
	Let sBuffer = WPRCMsg341_L
elif code==WPRevealCode32990 then
	Let sBuffer = WPRCMsg342_L
elif code==WPRevealCode32992 then
	Let sBuffer = WPRCMsg343_L
elif code==WPRevealCode33246 then
	Let sBuffer = WPRCMsg344_L
elif code==WPRevealCode33502 then
	Let sBuffer = WPRCMsg345_L
elif code==WPRevealCode33504 then
	Let sBuffer = WPRCMsg346_L
elif code==WPRevealCode33758 then
	Let sBuffer = WPRCMsg347_L
elif code==WPRevealCode34014 then
	Let sBuffer = WPRCMsg348_L
elif code==WPRevealCode34270 then
	Let sBuffer = WPRCMsg349_L
elif code==WPRevealCode34526 then
	Let sBuffer = WPRCMsg350_L
elif code==WPRevealCode34782 then
	Let sBuffer = WPRCMsg351_L
elif code==WPRevealCode35038 then
	Let sBuffer = WPRCMsg352_L
elif code==WPRevealCode35294 then
	Let sBuffer = WPRCMsg353_L
elif code==WPRevealCode35550 then
	Let sBuffer = WPRCMsg354_L
elif code==WPRevealCode35806 then
	Let sBuffer = WPRCMsg355_L
elif code==WPRevealCode36062 then
	Let sBuffer = WPRCMsg356_L
elif code==WPRevealCode36318 then
	Let sBuffer = WPRCMsg357_L
elif code==WPRevealCode36574 then
	Let sBuffer = WPRCMsg358_L
elif code==WPRevealCode36830 then
	Let sBuffer = WPRCMsg359_L
elif code==WPRevealCode37086 then
	Let sBuffer = WPRCMsg360_L
elif code==WPRevealCode37088 then
	Let sBuffer = WPRCMsg361_L
elif code==WPRevealCode37342 then
	Let sBuffer = WPRCMsg362_L
elif code==WPRevealCode37344 then
	Let sBuffer = WPRCMsg363_L
elif code==WPRevealCode37598 then
	Let sBuffer = WPRCMsg364_L
elif code==WPRevealCode37600 then
	Let sBuffer = WPRCMsg365_L
elif code==WPRevealCode37854 then
	Let sBuffer = WPRCMsg366_L
elif code==WPRevealCode37856 then
	Let sBuffer = WPRCMsg367_L
elif code==WPRevealCode38110 then
	Let sBuffer = WPRCMsg368_L
elif code==WPRevealCode38366 then
	Let sBuffer = WPRCMsg369_L
elif code==WPRevealCode53472 then
	Let sBuffer = WPRCMsg370_L
elif code==WPRevealCode53728 then
	Let sBuffer = WPRCMsg371_L
elif code==WPRevealCode53984 then
	Let sBuffer = WPRCMsg372_L
elif code==WPRevealCode54240 then
	Let sBuffer = WPRCMsg373_L
endIf
Return sBuffer
EndFunction

String Function GetBorderStyleName (int iBorderType)
Var
	string sStyle,
	int envBorderInt,
	string envBorderStr

; since envBorder can return both an int and a string, we need to
; handle both cases
; Different functions are required to gain the border style name for tables.  The constant wpBorderTable is not define by corel.
if !oWP then
	GetWPObject ()
EndIf
oWP.textBorderEdit(iBorderType)
let envBorderInt = oWP.envBorder()
Let envBorderStr = oWP.envBorder()
oWP.textBorderEnd(WPCancel) ; terminate the border edit and cancel without saving the edit
oWP.Quit
let sStyle = IntToString (envBorderInt)
If (sStyle == envBorderStr) &&
 (StringLength (sStyle) == StringLength (envBorderStr)) Then
	If (envBorderInt == WPBorderSpacingOnly ) Then
		let envBorderStr = WPMsgBorderSpacingOnly_L
	ElIf (envBorderInt == WPBorderSingle) Then
		let envBorderStr = WPMsgBorderSingle_L
	ElIf (envBorderInt ==WPBorderDouble) Then
		let envBorderStr = WPMsgBorderDouble_L
	ElIf (envBorderInt ==WPBorderDashed) Then
		let envBorderStr = WPMsgBorderDashed_L
	ElIf (envBorderInt ==WPBorderDotted) Then
		let envBorderStr = WPMsgBorderDotted_L
	ElIf (envBorderInt ==WPBorderThick) Then
		let envBorderStr = WPMsgBorderThick_L
	ElIf (envBorderInt ==WPBorderExtraThick1) Then
		let envBorderStr = WPMsgBorderExtraThick_L
	ElIf (envBorderInt ==WPBorderThinThick) Then
		let envBorderStr = WPMsgBorderThickThin_L
	ElIf (envBorderInt ==WPBorderThickThin1) Then
		let envBorderStr = WPMsgBorderThickThin_L
	ElIf (envBorderInt ==WPBorderThickTopBottom) Then
		let envBorderStr = WPMsgBorderThickTopBottom_L
	ElIf (envBorderInt ==WPBorderButton) Then
		let envBorderStr = WPMsgBorderButton_L
	ElIf (envBorderInt ==WPBorderColumnBorderBetween) Then
		let envBorderStr = WPMsgBorderColumnBorderBetween_L
	ElIf (envBorderInt ==WPBorderColumnBorderAll) Then
		let envBorderStr = WPMsgBorderColumnBorderAll_L
	ElIf (envBorderInt  == WPBorderHeavy) Then
			 let envBorderStr = WPMsgBorderHeavy_L
	ElIf (envBorderInt  == WPBorderHeavyDouble) Then
			 let envBorderStr = WPMsgBorderHeavyDouble_L
	ElIf (envBorderInt ==WPBorderNoBorder) Then
		let envBorderStr= WPMsgBorderNone_L
	EndIf
EndIf
return envBorderStr
EndFunction

String Function GetBorderLine (int iStyle, String sBorderName)
var
	string sStyle

let sStyle = IntToString (iStyle)
SayString (sBorderName)
If (StringContains (sStyle, sBorderName) == 1) && (StringLength (sStyle) == StringLength (sBorderName)) Then
If (iStyle == WPBorderSingleLine) Then
		let sBorderName = WPMsgBorderSingle_L
	ElIf (iStyle == WPBorderDoubleLine) Then
		let sBorderName = WPMsgBorderDouble_L
	ElIf (iStyle == WPBorderDashedLine) Then
		let sBorderName = WPMsgBorderDashed_L
	ElIf (iStyle == WPBorderDottedLine) Then
		let sBorderName = WPMsgBorderDotted_L
	ElIf (iStyle == WPBorderThickLine) Then
		let sBorderName =  WPMsgBorderThick_L
	ElIf (iStyle == WPBorderExtraThickLine) Then
		let sBorderName =  WPMsgBorderExtraThick_L
	ElIf (iStyle == WPBorderThinThickLine) Then
		let sBorderName =  WPMsgBorderThinThick_L
	ElIf (iStyle == WPBorderThickThinLine) Then
		let sBorderName =  WPMsgBorderThickThin_L
	ElIf (iStyle == WPBorderButtonTopLeftLine) Then
		let sBorderName =  WPMsgBorderButtonTopLeftLine_L
	ElIf (iStyle == WPBorderButtonBottomRightLine) Then
		let sBorderName = WPMsgBorderButtonBottomRightLine_L
	ElIf (iStyle == WPBorderTableDefaultLine) Then
		let sBorderName = WPMsgBorderTableDefaultLine
	ElIf (iStyle == WPBorderNoLine) Then
		let sBorderName = WPMsgBorderNone_L
	EndIf
EndIf
Return sBorderName
EndFunction

String Function getRevealCodeOrCharAtCursor (int iTextUnit)
var
int iCode,
string sBuffer

if !oWP then
	GetWPObject ()
EndIf
let iCode = oWP.EnvRightCode()

if iCode > 0 && GlobalRevealCodesActive then
	Let sBuffer = getRevealCodeDesc(iCode)
elIf (iTextUnit == WpUnitCharacter) Then
	Let sBuffer = oWP.envRightChar()
ElIf (iTextUnit == WpUnitWord) Then
		Let sBuffer = GetWord ()
endIf
oWP.quit()
Return sBuffer
EndFunction

int Function isBlockModeActive ()
var
int mode
if !oWP then
	GetWPObject ()
EndIf
let mode=oWP.envBlockActive()
oWP.quit()
return mode
EndFunction

Int Function isRevealCodesActive ()
	if not inDocumentWindow() then
	Let GlobalRevealCodesActive = false
Else
	if !oWP then
		GetWPObject ()
	EndIf
	let GlobalRevealCodesActive = oWP.envRevealCodesActive() * -1
	oWP.quit()
EndIf
return GlobalRevealCodesActive
EndFunction

int Function inDocumentWindow ()
; the control id is 0 if the menubar is active but is non-zero if the document window has focus.
return getWindowClass(globalFocusWindow)==wc_mainDocumentWindow && getCurrentControlId() !=0
EndFunction

int Function setEloqLanguage (string language)
If Language == wpUS ||
	language==WPOZ ||
	language==WPCE Then
	return SetSynthLanguage (eloqAmericanEnglish)
elif language==WPUK then
	return SetSynthLanguage (eloqBritishEnglish)
ElIf Language == WPES Then
	return SetSynthLanguage (eloqCastilianSpanish)
ElIf Language == WPEA Then
	return SetSynthLanguage (eloqLatinAmericanSpanish)
ElIf Language == WPFR ||
	language==WPCF Then
	return SetSynthLanguage (eloqFrench)
ElIf Language == WPDE ||
	language==WPSD Then
	return SetSynthLanguage (eloqGerman)
ElIf Language == WPIT Then
	return SetSynthLanguage (eloqItalian)
else
	return false
endIf
EndFunction

Int Function isDocumentReadOnly ()
var
int readOnly
if !oWP then
	GetWPObject ()
EndIf
let readOnly=oWP.envDocReadOnly()
oWP.quit()
return readOnly
EndFunction

int Function isRulerBarActive ()
var
int rulerBarActive
if !oWP then
	GetWPObject ()
EndIf
let rulerBarActive=oWP.envRulerBarActive()
oWP.quit()
return rulerBarActive
EndFunction

int Function isTypeOverActive ()
var
int typeoverActive
if !oWP then
	GetWPObject ()
EndIf
let typeoverActive=oWP.envTypeoverActive()
oWP.quit()
return typeoverActive
EndFunction

int Function getTextColumnCount ()
var
int NumberOfTextColumns

if !oWP then
	GetWPObject ()
EndIf
	let numberOfTextColumns=oWP.envTextColumns()
	oWP.quit()
return numberOfTextColumns
EndFunction

int Function getCurrentTextColumnIndex ()
var
int currentTextColumnNumber

if !oWP then
	GetWPObject ()
EndIf
	let currentTextColumnNumber=oWP.envTextColumnNumber()
oWP.quit()
return currentTextColumnNumber
EndFunction

int Function upCell ()
if !oWP then
	GetWPObject ()
EndIf
if oWP.envInTable() then
	oWP.posCellUp()
	oWP.quit()
	return true
else
	oWP.quit()
	return false
endIf
EndFunction

int Function downCell ()
if !oWP then
	GetWPObject ()
EndIf
if oWP.envInTable() then
oWP.posCellDown()
	oWP.quit()
	return true
else
	return false
endIf
EndFunction

int Function priorCell ()
if !oWP then
	GetWPObject ()
EndIf
if oWP.envInTable() then
oWP.posCellPrevious()
	oWP.quit()
	return true
else
	oWP.quit()
	return false
endIf
EndFunction

int Function nextCell ()
if !oWP then
	GetWPObject ()
EndIf
if oWP.envInTable() then
oWP.posCellNext()
	oWP.quit
	return true
else
	oWP.quit()
	return false
endIf
EndFunction

Void Function GetColumnNumber ()
if !oWP then
	GetWPObject ()
EndIf
let globalPriorTextColumnNumber = GlobalCurrentTextColumnNumber
let GlobalCurrentTextColumnNumber= oWP.envTextColumnNumber()
oWP.Quit
EndFunction

Void Function SayColumnNumber ()
If GlobalCurrentTextColumnNumber !=globalPriorTextColumnNumber then
	sayUsingVoice(vctx_message, formatString(msgTextColumn1_L, intToString(GlobalCurrentTextColumnNumber)),ot_item_number)
endIf
EndFunction

int Function IsMultipleColumns ()
Var
	int iResult

if !oWP then
	GetWPObject ()
EndIf
GetColumnNumber ()
Let GlobalNumberOfTextColumns= oWP.envTextColumns()
oWP.Quit ()
If (GlobalCurrentTextColumnNumber >  0) &&
(GlobalNumberOfTextColumns > 1) Then
	let iResult = TRUE
	Else
	let iResult = FALSE
	EndIf
return iResult
	EndFunction

Function detectContext ()
var
int currentPageNumber,
string sMessage,
string currentStyle,
string sCurrentBorder,
string CurrentLanguage,
string currentTableCoordinates,
int isLastTableCell,
int inTable,
int cellHasFormula,
int iRowHasHeader,
string currentTableName,
int paragraphHasBorder,
int pageHasBorder,
int ColumnHasBorder,
int quitRequired ; set to true if at least one object model call is performed

if !oWP then
	GetWPObject ()
EndIf
if globalDetectTables then
let InTable = InTable ()
	if inTable then
		let quitRequired=true
		let currentTableName=oWP.envCurrentTableName()
		let iRowHasHeader = oWP.EnvRowHeader ()
		let currentTableCoordinates=oWP.envCell()
		let isLastTableCell=oWP.envTableLastCell
		let cellHasFormula=oWP.envCellFormula()
		if not globalInTableFlag then ; report it
			sayUsingVoice(vctx_message, currentTableName,ot_control_group_name)
			If (GlobalPriorTableName != CurrentTableName) Then
				SayTableSize ()
				if globalDetectStyleChanges Then
					sayUsingVoice(vctx_message, FormatString (WPMsgTableStyle_L, getTableStyle ()), ot_screen_message)
				EndIf
				Let GlobalPriorTableName = CurrentTableName
			EndIf
			let globalInTableFlag=true
			let globalTablePriorCoordinates=cscNull
		ElIf (GlobalPriorTableName != CurrentTableName) Then
			sayUsingVoice(vctx_message, currentTableName,ot_control_group_name)
			SayTableSize ()
			if globalDetectStyleChanges Then
;				SayFormattedMessage (ot_help, WPMsgTableStyle_L, WPMsgTableStyle_S)
;				SayFormattedMessage (OT_Help, getTableStyle ())
				sayUsingVoice(vctx_message, FormatString (WPMsgTableStyle_L, getTableStyle ()), ot_screen_message)
			EndIf
			Let GlobalPriorTableName = CurrentTableName
		endIf
		let globalBrlTableCell=currentTableCoordinates
		if globalTablePriorCoordinates!=currentTableCoordinates then
			sayUsingVoice(vctx_message,currentTableCoordinates,ot_position)
			let globalTablePriorCoordinates=currentTableCoordinates
; check if current cell contains a formula
			if cellHasFormula then
				sayUsingVoice(vctx_message, msgHasFormula1_S,ot_screen_message)
			endIf
			If iRowHasHeader Then
				sayUsingVoice(vctx_message, msgRowHasHeader,ot_screen_message)
				endIf
; check and announce if we're in the last cell
			if isLastTableCell then
				SayFormattedMessageWithVoice (vctx_message, ot_screen_message, msgTableLastCell1_L, msgTableLastCell1_S)
				SayFormattedMessageWithVoice (VCTX_MESSAGE, OT_HELP, MsgWarningCreateCells1_L, MsgWarningCreateCells1_S)
			endIf
		endIf
	else ; not in a table, if previously in one, report that we've moved out of it
			if globalInTableFlag then
			sayUsingVoice(vctx_message,msgOutOfTable1_L,ot_screen_message)
			let globalInTableFlag=false
			Let GlobalPriorTableName = cscNull
		endIf
	endIf
endIf

; detects the style changes in the document
if globalDetectStyleChanges then
	let currentStyle=oWP.envCurrentStyle()
	let quitRequired=true
	if globalPriorStyle!=currentStyle then
		if currentStyle!=cscNull then
			sayUsingVoice(vctx_message,currentStyle,ot_screen_message)
		else
			sayUsingVoice(vctx_message,msgNone1_L,ot_screen_message)
		endIf
		let globalPriorStyle=currentStyle
	endIf
endIf

; Detects language changes
if globalDetectLanguages then
	let currentLanguage=oWP.envLanguage()
	let quitRequired=true
	if currentLanguage !=globalPriorLanguage then
		if not setEloqLanguage(currentLanguage) then
			sayUsingVoice(vctx_message, getLanguageFullName(currentLanguage), ot_screen_message)
		endIf
		let globalPriorLanguage=currentLanguage
	endIf
endIf

; Detects borders in document
if globalDetectBorders then
	let quitRequired=true
	let paragraphHasBorder=oWP.envParagraphBorder()
	let pageHasBorder=oWP.envPageBorder()
	Let ColumnHasBorder = oWP.EnvColumnBorder ()

	if ParagraphHasBorder then
		let sCurrentBorder = GetBorderStyleName (WpBorderParagraph)
		if not globalBorderedParagraph then
; announce it and set the global flag
			sayUsingVoice(vctx_message,msgBorderedParagraph1_L,ot_screen_message)
			SayFormattedMessage (ot_Help, sCurrentBorder)
			let globalBorderedParagraph=true
			let GlobalPriorParagraphBorderName = sCurrentBorder
		ElIf (GlobalPriorParagraphBorderName != sCurrentBorder) && (StringLength (GlobalPriorParagraphBorderName) != StringLength(sCurrentBorder)) Then
			let GlobalPriorParagraphBorderName = sCurrentBorder
			sayUsingVoice(vctx_message,msgBorderedParagraph1_L,ot_screen_message)
			SayFormattedMessage (ot_Help, sCurrentBorder)
		endIf
	else
		if globalBorderedParagraph then
; we've moved out of it so announce and reset flag
			sayUsingVoice(vctx_message,msgOutOfBorderedParagraph1_L,ot_screen_message)
			let globalBorderedParagraph=false
			let GlobalPriorParagraphBorderName = cscNull
		endIf
	endIf
	if pageHasBorder then
		let sCurrentBorder = GetBorderStyleName (WPBorderPage)
		if not globalBorderedPage then
			; announce the border name and set the global flag to prevent contiguous speaking of the border name.
			let globalBorderedPage=true
			let GlobalPriorPageBorderName = sCurrentBorder
			sayUsingVoice(vctx_message,msgBorderedPage1_L,ot_screen_message)
			SayFormattedMessageWithVoice  (VCTX_MESSAGE, ot_screen_message, sCurrentBorder, cscNull)
		ElIf (GlobalPriorPageBorderName != sCurrentBorder) && (StringLength (GlobalPriorPageBorderName) != StringLength(sCurrentBorder)) Then
			let GlobalPriorPageBorderName = sCurrentBorder
			sayUsingVoice(vctx_message,msgBorderedPage1_L,ot_screen_message)
			SayFormattedMessage (ot_Help, sCurrentBorder)
		endIf
	else
		if globalBorderedPage then
; we've moved out of it so announce and reset flag
			sayUsingVoice(vctx_message,msgOutOfBorderedPage1_L,ot_screen_message)
			let globalBorderedPage=false
			Let GlobalPriorPageBorderName = cscNull
		endIf
	endIf
	if ColumnHasBorder then
		let sCurrentBorder = GetBorderStyleName (WpBorderColumn)
		if not globalBorderedColumn then
; announce it and set the global flag
			let globalBorderedColumn=true
			let GlobalPriorColumnBorderName = sCurrentBorder
		ElIf (GlobalPriorColumnBorderName != sCurrentBorder) && (StringLength (GlobalPriorColumnBorderName) != StringLength(sCurrentBorder)) Then
			let GlobalPriorColumnBorderName = sCurrentBorder
			sayUsingVoice(vctx_message,msgBorderedColumn_L,ot_screen_message)
			SayFormattedMessage (ot_Help, sCurrentBorder)
		endIf
	else
		if globalBorderedColumn then
; we've moved out of it so announce and reset flag
;			sayUsingVoice(vctx_message,msgOutOfBorderedColumn_L,ot_screen_message)
			let globalBorderedColumn=false
			let GlobalPriorColumnBorderName = cscNull
		endIf
	endIf
endIf

; Detect change in text column when document contains
; newspaper style columns.
let globalMultipleColumns = IsMultipleColumns ()
if globalDetectPageAndColumnBreaks then
	let currentPageNumber=oWP.envPage()
	let quitRequired=true
	if currentPageNumber !=globalPriorPageNumber then
		sayUsingVoice(vctx_message, formatString(msgPage1_L, IntToString(currentPageNumber)),ot_screen_message)
		let globalPriorPageNumber=currentPageNumber
	endIf
	If globalMultipleColumns Then
	; document has multiple text columns, now inform the user of the fact.
		; Announce the text column type when entering for the first time.
	If Not GlobalEnteredColumns Then
		let sMessage = FormatString (msgTextColumn2_L, GetColumnDefinition (), IntToString (GlobalCurrentTextColumnNumber), IntToString (GlobalNumberOfTextColumns))
		SayFormattedMessage (ot_screen_message, sMessage)
		if globalDetectBorders then
			SayUsingVoice(vctx_message,msgBorderedColumn_L,ot_screen_message)
			SayFormattedMessage (ot_Help, sCurrentBorder)
		EndIf
		Let GlobalEnteredColumns = TRUE
	Else
		SayColumnNumber ()
	EndIf
	Else ; we have left the text columns
		; Announce the fact that we have just left the columns
		; and don't re-announce the column type until re-entering the columns.
		If GlobalEnteredColumns Then
			let sMessage = FormatString (msgLeavingTextColumns_l, GetColumnDefinition ())
			SayFormattedMessage (ot_screen_message, sMessage)
			if globalDetectBorders then
			    sayUsingVoice(vctx_message,msgOutOfBorderedColumn_L,ot_screen_message)
			EndIf
			Let GlobalEnteredColumns = FALSE
		EndIf
	EndIf
endIf
if quitRequired then
; note next line is extremely important to avoid a crash due to leaving WP in macro execution mode.
	oWP.quit()
endIf
/*
If (WPVersion == wpVersion10) Then
	While (GetWindowClass (GetWindowAtPoint (GetCursorCol (), GetCursorRow ())) == wc_mru10) && !IsKeyWaiting ()
			;delay (1)
	EndWhile
EndIf
*/
EndFunction

int function IsLastCellInTable ()
var
	int iResult
if !oWP then
	GetWPObject ()
EndIf
Let iResult = oWP.envTableLastCell()
oWP.Quit()
Return iResult
EndFunction

int function IsFirstCellInTable ()
var
	int iResult
Let iResult = (getTableCellCoordinates () == scFirstTableCellCoordinates)
Return iResult
EndFunction

Void Function SayFont ()
Var
String sFontName,
Int iFontSize

if isPcCursor() && inDocumentWindow() then
	if !oWP then
		GetWPObject ()
	EndIf
	let sFontName = oWP.EnvFont()
	let IFontSize = oWP.EnvFontSize()
oWP.Quit
	SayFormattedMessage(ot_help, formatString(msgFontIs1_L, sFontName, WPUnitsToPoints(iFontSize)), formatString(msgFontIs1_S, sFontName, WPUnitsToPoints(IFontSize)))
	if globalInTableFlag Then
		sayCellAttributes()
	Else
		DescribeAttributes  ()
	endIf
else ; do default
	sayFont()
endIf
EndFunction

void Function DescribeAttributes  ()
Var
int iIsBold,
int iIsUnderline,
int iUnderlineStyle,
int iIsDoubleUnderline,
int iIsVeryLarge,
int iIsExtraLarge,
int iIsFine,
int iIsItalic,
int iIsLarge,
int iIsOutline,
int iIsRedLine,
int iIsShadow,
int iIsSmall,
int iIsSmallCaps,
int iIsStrikeOut,
int iIsSubScript,
int iIsSuperscript,
string sCurrentStyle,
int iParagraphOutlineLevel,
int iInOutline,
int iJustification

if !oWP then
	GetWPObject ()
EndIf
	let iIsBold=oWP.envFontBold()
	let iIsDoubleUnderline=oWP.envFontDoubleUnderline()
	let iIsExtraLarge=oWP.envFontExtraLarge()
	let iIsFine=oWP.envFontFine()
	let iIsItalic=oWP.envFontItalics()
	let iIsLarge=oWP.envFontLarge()
	let iIsOutline=oWP.envFontOutline()
	let iIsRedLine=oWP.envFontRedline()
	let iIsShadow=oWP.envFontShadow()
	let iIsSmall=oWP.envFontSmall()
	let iIsSmallCaps=oWP.envFontSmallCaps()
	let iIsStrikeOut=oWP.envFontStrikeout()
	let iIsSubScript=oWP.envFontSubscript()
	let iIsSuperscript=oWP.envFontSuperscript()
	let iIsUnderline=oWP.envFontUnderline()
	let iUnderlineStyle=oWP.envUnderlineStyle()
	let iIsVeryLarge=oWP.envFontVeryLarge()
	let sCurrentStyle=oWP.envCurrentStyle()
	if sCurrentStyle==cscNull then
		let sCurrentStyle=msgNone1_L
	endIf
	let iJustification=oWP.envJustification()
	let iInOutline=oWP.envInOutline()
	let iParagraphOutlineLevel=oWP.envCurrentParagraphLevel()
	oWP.Quit()

	if iIsBold then
		say(sc_1,ot_screen_message)
	endIf
	if iIsExtraLarge then
		SayFormattedMessage (ot_screen_message, msgExtraLarge1_L)
	endIf
	if iIsFine then
		SayFormattedMessage (ot_screen_message, msgFine1_L)
	endIf
	if iIsItalic then
		SayFormattedMessage (ot_screen_message, msgItalic1_L)
	endIf
	if iIsLarge then
		SayFormattedMessage (ot_screen_message, msgLarge1_L)
	endIf
	if iIsOutline then
		SayFormattedMessage (ot_screen_message, msgOutline1_L)
	endIf
	if iIsRedLine then
		SayFormattedMessage (ot_screen_message, msgRedline1_L)
	endIf
	if iIsShadow then
		SayFormattedMessage (ot_screen_message, msgShaddow1_L)
	endIf
	if iIsSmall then
		SayFormattedMessage (ot_screen_message, msgSmall1_L)
	endIf
	if iIsSmallCaps then
		SayFormattedMessage (ot_screen_message, msgSmallCaps1_L)
	endIf
	if iIsStrikeOut then
		SayFormattedMessage (ot_screen_message, msgStrikeOut1_L)
	endIf
	if iIsSubScript then
		SayFormattedMessage (ot_screen_message, msgSubscript1_L)
	endIf
	if iIsSuperscript then
		SayFormattedMessage (ot_screen_message, msgSuperscript1_L)
	endIf
	if iIsDoubleUnderline then
			SayFormattedMessage (ot_screen_message, getUnderlineStyle(iUnderlineStyle)+cscSpace+msgDoubleUnderline1_L)
		elif iIsUnderline then
			SayFormattedMessage (ot_screen_message, formatString(msgUnderline1_L, getUnderlineStyle(iUnderlineStyle)))
		endIf
		if iIsVeryLarge then
			SayFormattedMessage (ot_screen_message, msgVeryLarge1_L)
		endIf
		say(getTextJustification(iJustification),ot_screen_message)
; say style information
	SayFormattedMessage (ot_screen_message, formatString(msgStyle1_L, sCurrentStyle))
	if iInOutline then
		SayFormattedMessage (ot_screen_message, formatString(msgParagraphOutlineLevel1_L, intToString(iParagraphOutlineLevel)), formatString(msgParagraphOutlineLevel1_S, intToString(iParagraphOutlineLevel)))
	endIf
EndFunction

Function sayCellAttributes ()
var
int CellAlignment,
int CellBold,
int CellDoubleUnderline,
int CellExtraLarge,
int CellFill,
int CellFine,
int CellFormula,
int IgnoreCellWhenCalculating,
int CellItalic,
int CellJustification,
int CellLarge,
int CellLocked,
int CellNormal,
int CellOutline,
int CellRedline,
int CellShadow,
int CellSmall,
int CellSmallCaps,
int CellSpecificAttribute,
int CellSpecificJustification,
int CellStrikeout,
int CellSubscript,
int CellSuperscript,
int CellUnderline,
int CellVeryLarge,
int CellWidth,
int iTableAlternateFill

if not (isPCCursor() || inTable()) then
	SayFormattedMessage (ot_error, msgNotInATable1_L)
	return
endIf
if !oWP then
	GetWPObject ()
EndIf
let cellAlignment=oWP.envCellAlignment()
let cellBold=oWP.envCellBold()
let cellDoubleUnderline=oWP.envCellDoubleUnderline()
let cellExtraLarge=oWP.envCellExtraLarge()
Let CellFill = oWP.EnvCellFill ()
let cellFine=oWP.envCellFine()
let cellFormula=oWP.envCellFormula()
let ignoreCellWhenCalculating=oWP.envCellIgnoreWhenCalculating()
let cellItalic=oWP.envCellItalics()
let cellJustification=oWP.envCellJustification()
let cellLarge=oWP.envCellLarge()
let cellLocked=oWP.envCellLocked()
let cellNormal=oWP.envCellNormal()
let cellOutline=oWP.envCellOutline()
let cellRedline=oWP.envCellRedline()
let cellShadow=oWP.envCellShadow()
let cellSmall=oWP.envCellSmall()
let cellSmallCaps=oWP.envCellSmallCaps()
let cellSpecificAttribute=oWP.envCellSpecificAttribute()
let cellSpecificJustification=oWP.envCellSpecificJustification()
let cellStrikeout=oWP.envCellStrikeout()
let cellSubscript=oWP.envCellSubscript()
let cellSuperscript=oWP.envCellSuperscript()
let cellUnderline=oWP.envCellUnderline()
let cellVeryLarge=oWP.envCellVeryLarge()
let cellWidth=oWP.envCellWidth()
oWP.quit()
if cellBold then
	SayFormattedMessage(ot_screen_message,msgBold1_L)
endIf
if cellDoubleUnderline then
	SayFormattedMessage (ot_screen_message, msgDoubleUnderline1_L)
endIf
if cellExtraLarge then
	SayFormattedMessage (ot_screen_message, msgExtraLarge1_L)
endIf
if cellFine then
	SayFormattedMessage (ot_screen_message, msgFine1_L)
endIf
if cellItalic then
	SayFormattedMessage (ot_screen_message, msgItalic1_L)
endIf
if cellLarge then
	SayFormattedMessage (ot_screen_message, msgLarge1_L)
endIf
if cellOutline then
	SayFormattedMessage (ot_screen_message, msgOutline1_L)
endIf
if cellRedLine then
	SayFormattedMessage (ot_screen_message, msgRedline1_L)
endIf
if cellShadow then
	SayFormattedMessage (ot_screen_message, msgShaddow1_L)
endIf
if cellSmall then
	SayFormattedMessage (ot_screen_message, msgSmall1_L)
endIf
if cellSmallCaps then
	SayFormattedMessage (ot_screen_message, msgSmallCaps1_L)
endIf
if cellStrikeOut then
	SayFormattedMessage (ot_screen_message, msgStrikeOut1_L)
endIf
if cellSubScript then
	SayFormattedMessage (ot_screen_message, msgSubscript1_L)
endIf
if cellSuperscript then
		SayFormattedMessage (ot_screen_message, msgSuperscript1_L)
endIf
if cellUnderline then
	SayFormattedMessage (ot_screen_message, msgUnderline1_L)
endIf
if cellVeryLarge then
	SayFormattedMessage (ot_screen_message, msgVeryLarge1_L)
endIf
if cellLocked then
	SayFormattedMessage (ot_screen_message, msgCellLocked1_L, msgCellLocked1_S)
endIf
if ignoreCellWhenCalculating then
	SayFormattedMessage (ot_screen_message, msgIgnored1_L, msgIgnored1_S)
endIf
if cellFormula then
	SayFormattedMessage (ot_screen_message, msgHasFormula1_L, msgHasFormula1_S)
endIf
SayFormattedMessage (ot_help, formatString(msgCellAlignment1_L, getCellVerticalAlignment(cellAlignment)), formatString(msgCellAlignment1_S, getCellVerticalAlignment(cellAlignment)))
SayFormattedMessage (ot_screen_message, formatString(msgCellJustification1_L, getTextJustification(celljustification)), formatString(msgCellJustification1_S, getTextJustification(celljustification)))
SayFormattedMessage (ot_help, FormatString (WPMsgCellStyle_L, getTableStyle ()),FormatString (msgStyle1_L, getTableStyle ()))
If (CellFill < WpFillButton) Then
	Let CellFill = (CellFill + 1) * 10
	SayFormattedMessage (OT_Help, FormatString (WPMsgCellFill_L, IntToSTring (CellFill)), FormatString (WPMsgCellFill_S, IntToSTring (CellFill)))
ElIf (CellFill == WpFillButton) Then
	SayFormattedMessage (OT_Help, FormatString (WPMsgCellFill_L, WpMsgFillButton_L), FormatString (WPMsgCellFill_S, WpMsgFillButton_L))
ElIf (CellFill == WpFillFive) Then
	SayFormattedMessage (OT_Help, FormatString (WPMsgCellFill_L, WpMSGFillFive_L), FormatString (WPMsgCellFill_S, WpMSGFillFive_L))
ElIf (CellFill == WpNoFill) Then
	SayFormattedMessage (OT_Help, FormatString (WPMsgCellFill_L, WPMsgNoFill_L), FormatString (WPMsgCellFill_S, WPMsgNoFill_L))
EndIf
;SayFormattedMessage (ot_help, WPMsgTableBorderStyle_L, WPMsgTableBorderStyle_S)
;SayFormattedMessage (ot_no_disable, GetBorderStyleName (WPBorderTable))
SayFormattedMessage (ot_screen_message, formatString(msgCellWidth1_L, WPUnitsToInches (cellWidth)))
EndFunction

Void Function sayTextWithLanguageDetection (int textUnit)
var
int oldStart,
string startLanguage,
int oldEnd,
int startPos,
int endPos,
int languageChanged,
string langSegment,
string word,
string language
if !oWP then
	GetWPObject ()
EndIf
let oldStart=oWP.envGetSelStartEx()
let startLanguage=oWP.envLanguage()
let oldEnd=oWP.envGetSelEndEx()
if textUnit==WPUnitLine then
	oWP.posLineEnd()
	let endPos=oWP.envGetSelStartEx()
	oWP.posLineBeg()
	let startPos=oWP.envGetSelStartEx()
elif textUnit==WPUnitSentence then
	oWP.selectSentence()
	let startPos=oWP.envGetSelStartEx()
	let endPos=oWP.envGetSelEndEx()
elif textUnit==WPUnitParagraph then
	oWP.posParagraphNext()
	let endPos=oWP.envGetSelStartEx()
	oWP.posParagraphPrevious()
	let startPos=oWP.envGetSelStartEx()
else
	oWP.quit()
	return ; undefined
endIf
if startPos==endPos then
	SayFormattedMessage (ot_no_disable, cmsgBlank1)
	oWP.setSelEx(oldStart,oldEnd)
	oWP.quit()
	return
endIf
oWP.setSelEx(startPos,startPos)
while oWP.envGetSelStartEx() < endPos
	let langSegment=cscNull
; locate end of language segment
	let language=oWP.envLanguage
	while oWP.envGetSelStartEx() < endPos && oWP.envLanguage==language
	let word=oWP.envCurrentWord()
		oWP.posWordNext()
		let langSegment=langSegment+word+cscSpace
		if language !=startLanguage then
			let languageChanged=true
		endIf
	endWhile
	if languageChanged then
		if not setEloqLanguage(language) then
			setEloqLanguage(globalDefaultLanguage)
			sayUsingVoice(vctx_message,getLanguageFullName(language),ot_no_disable)
		endIf
	endIf
	say(langSegment,ot_no_disable)
endWhile
oWP.setSelEx(oldStart,oldEnd)
oWP.quit()
setEloqLanguage(startLanguage)
EndFunction


Function sayColumnLineSegment ()
var
int oldStart,
int oldEnd,
string lineSegment
if !oWP then
	GetWPObject ()
EndIf
let oldStart=oWP.envGetSelStartEx()
let oldEnd=oWP.envGetSelEndEx()
oWP.posLineBeg()
oWp.selectLineEnd()
let lineSegment=oWP.envSelectedText()
oWP.setSelEx(oldStart,oldEnd)
oWP.quit()
if lineSegment!=cscNull then
	say(lineSegment,ot_no_disable)
else
	say(cmsgBlank1,ot_no_disable)
endIf
EndFunction

Function saySentence ()
if isPcCursor() && inDocumentWindow() && globalDetectLanguages && WPVersion>=WPVersion9 then
	sayTextWithLanguageDetection(WPUnitSentence)
	return
endIf
saySentence()
EndFunction


int Function sayParagraph ()
Var
	int iValue,
	int iCurrentStartPos,
	int iCurrentEndPos,
	int iNextEndPos,
	string sBuffer,
	int iBogusCharPos
	; check script
if globalDetectLanguages && WPVersion>=WPVersion9 then
	sayTextWithLanguageDetection(WPUnitParagraph)
	let iValue = true
ElIf (WPVersion >= wpVersion10) Then
	if !oWP then
		GetWPObject ()
	EndIf
	let iCurrentStartPos=oWP.envGetSelStartEx()
	let iCurrentEndPos=oWP.envGetSelEndEx()
	oWP.posParagraphNext()
	let iNextEndPos=oWP.envGetSelStartEx()
	oWP.posParagraphPrevious()
	oWP.setSelEx(iCurrentStartPos, iNextEndPos)
	let sBuffer = oWP.EnvGetSelTextEx ()
	Let iBogusCharPos = StringContains (sBuffer, scBogusChars)
	If iBogusCharPos Then
		Let sBuffer = SubString (sBuffer, 1, iBogusCharPos-1)
	EndIf
	If StringIsBlank (sBuffer) Then
		SayFormattedMessage (ot_no_disable, cmsgBlank1)
	Else
		Say (sBuffer, OT_NO_DISABLE)
	EndIf
	oWP.setSelEx(iCurrentStartPos, iCurrentEndPos)
	oWP.Quit ()
	let iValue = TRUE
else
	let iValue = SayParagraph () ; default
endIf
return IValue
EndFunction

Function moveToPriorParagraph ()
if !oWP then
	GetWPObject ()
EndIf
oWP.posParagraphPrevious()
oWP.quit()
EndFunction

Function moveToNextParagraph ()
if !oWP then
	GetWPObject ()
EndIf
oWP.posParagraphNext()
oWP.quit()
EndFunction


Void Function SelectNextParagraph ()
if !oWP then
	GetWPObject ()
EndIf
oWP.SelectParagraphNext ()
oWP.Quit ()
EndFunction


Void Function SelectPriorParagraph ()
if !oWP then
	GetWPObject ()
EndIf
oWP.SelectParagraphPrevious ()
oWP.Quit ()
EndFunction

Void Function sayCharacterPhonetic ()
var
string character,
int index,
int code

if Not (isPcCursor() && GlobalRevealCodesActive) then
	sayCharacterPhonetic() ; default
Else
	if !oWP then
		GetWPObject ()
	EndIf
	let character=stringLower(oWP.envRightChar())
	let code=oWP.envRightcode()
	oWP.quit()
	if code !=0 then
		say(getRevealCodeDesc(code),ot_no_disable)
		return
	endIf
	if character==cscSpace then
		SayFormattedMessage (ot_no_disable, msgSpace1_L)
	elif character==cscNull then
		SayFormattedMessage (ot_no_disable, cmsgBlank1)
	else
		let index=stringContains(alphabet,character)
		if index then
			say(StringSegment (phoneticDefinitions, sc_2, index),ot_no_disable)
		else
				say(character,ot_CHAR)
		endIf
	endIf
EndIf
EndFunction

; we will override and only call default function if not in main document window with PC cursor active.
Void Function SayCharacter ()
var
string sBuffer

if IsPCCursor() && inDocumentWindow() then
	If globalRevealCodesActive  Then
		let sBuffer =getRevealCodeOrCharAtCursor(WpUnitCharacter)
	else
		if !oWP then
	GetWPObject ()
EndIf
		let sBuffer = oWP.envRightChar()
		oWP.Quit ()
	endIf
	if sBuffer ==cscSpace then
		SayFormattedMessage (ot_no_disable, msgSpace1_L)
	elif sBuffer ==cscNull then
		SayFormattedMessage (ot_no_disable, cmsgBlank1)
	else
		say(sBuffer, OT_CHAR)
	endIf
else
SayCharacter () ; default
endIf
endFunction

Function sayCellLineSegment ()
var
string content
let content=getChunk()
if content!=cscNull then
	say(content,ot_string)
else
	SayFormattedMessage (ot_string, cmsgBlank1)
endIf
EndFunction

Void Function sayLine (int HighlightTracking, optional int bSayingLineAfterMovement)
var
	handle hwnd
if isPcCursor() && inDocumentWindow() then
	If globalDetectTables && globalInTableFlag Then
		sayCellLineSegment()
	elif WPVersion>=WPVersion9 Then
		if globalDetectLanguages then
			sayTextWithLanguageDetection(WPUnitLine)
		elif globalMultipleColumns then
			sayColumnLineSegment()
		else
			SayLine (HighlightTracking,bSayingLineAfterMovement)
		endIf
	else
		SayLine (HighlightTracking,bSayingLineAfterMovement)
	endIf
	Return
else
	if getWindowClass (globalFocusWindow)==wc_WPvscrollListBox Then
		; read certain controls in some dialogs which do not display text.
		; Paragraph, page or simular  Border/Fill dialog
		if GetControlID (GlobalFocusWindow)==cId_BorderStyleListBox then
			sayWindow(getNextWindow(globalFocusWindow),read_everything)
		endIf
		return
	ElIf (GetWindowClass (GlobalFocusWindow) == wc_WPPopOutWindow) Then
		SayWindow (GlobalFocusWindow, Read_Everything)
		Return
	ElIf StringContains (GetWindowName (FindDescendantWindow (GetAppMainWindow (GlobalFocusWindow), CID_dialoguePage)), wnWP3)  &&
	(GetWindowSubTypeCode (GlobalFocusWindow) == WT_TreeView) 	Then
		; focus is on the tree view and the default method of anouncing the treeview contents
		; says "....".  This fixes this problem.
		SayFormattedMessage (OT_LINE, GetWindowText (GlobalFocusWindow, TRUE))
		return
	EndIf
EndIf
sayLine(HighlightTracking,bSayingLineAfterMovement)
EndFunction

void Function spellWord ()
var
int code
;int revealCodesActive

if isPcCursor() && inDocumentWindow()  && GlobalRevealCodesActive then
;	let revealCodesActive=oWP.envRevealCodesActive()
	if !oWP then
		GetWPObject ()
	EndIf
	let code=oWP.envRightCode()
	oWP.quit()
	if Code !=0 then
		spellString(getRevealCodeDesc(Code))
		return
	endIf
endIf
spellWord() ; default
EndFunction

void Function sayWord ()
var
	int iCode,
	string sBuffer

If IsPcCursor() && inDocumentWindow() && globalRevealCodesActive  Then
;		let sBuffer = getRevealCodeOrCharAtCursor (WpUnitWord)
;		say(sBuffer, ot_no_disable)
	if !oWP then
		GetWPObject ()
	EndIf
	let iCode=oWP.envRightCode()
	oWP.quit()
/*
	If (WPVersion == wpVersion10) Then
		While (GetWindowClass (GetWindowAtPoint (GetCursorCol (), GetCursorRow ())) == wc_mru10) && !IsKeyWaiting ()
				;delay (1)
		EndWhile
	EndIf
 */
	if iCode !=0 then
		say(getRevealCodeDesc(iCODE),ot_no_disable)
	else
		sayWord()
	endIf
Else
sayWord () ; default
endIf
EndFunction


Void Function sayCurrentWord ()
var
string sWord
		if !oWP then
	GetWPObject ()
EndIf
let sWord=oWP.envCurrentWord
oWP.quit
if sWord!=cscNull then
	say(sWord,ot_no_disable)
else
	say(cmsgBlank1,ot_no_disable)
endIf
EndFunction

Void Function sayWindowPromptAndText ()
var
	handle hWnd,
	int iSubType,
	string CellCoordinates,
	int inTable,
	int numberOfTextColumns,
	int currentTextColumnNumber,
	int nMode
Let hWnd = GetCurrentWindow ()
Let iSubType = GetWindowSubTypeCode (hWnd)
If ! iSubType then
	Let iSubType = GetObjectSubTypeCode ()
EndIf
if not GetFocus() then
; focus is in la la land.
	resetFocusToGlobalFocus()
endIf
let nMode=smmTrainingModeActive()
smmToggleTrainingMode(TRUE)
if inTable() then
	let cellCoordinates=getTableCellCoordinates()
	say(getTableName(),ot_no_disable)
	say(cellCoordinates,ot_no_disable)
	sayCellLineSegment()
else
	if getWindowClass(getRealWindow(globalFocusWindow))==wc_Dialog1 then
		say(getGroupboxName(),ot_no_disable)
elif isPcCursor() && inDocumentWindow() then
			if !oWP then
		GetWPObject ()
	EndIf
	let numberOfTextColumns=oWP.envTextColumns()
	let currentTextColumnNumber=oWP.envTextColumnNumber()
	oWP.quit()
	if numberOfTextColumns > 1 then
; Doc contains multiple columns, announce this.
		SayFormattedMessage (ot_no_disable, formatString(msgTextColumn2_L, intToString(currentTextColumnNumber), IntToString(numberOfTextColumns)))
	endIf
endIf
	sayFocusedWindow()
endIf
SayTutorialHelp (iSubType, TRUE)
SayTutorialHelpHotKey (hWnd, TRUE)
smmToggleTrainingMode(nMode)
EndFunction

Function sayCellCoordinates ()
say(getTableCellCoordinates(),ot_position)
EndFunction

Function sayTableName ()
say(getTableName(),ot_no_disable)
EndFunction

Function sayCell ()
sayCellLineSegment()
EndFunction

/* old braille code
; RG keeping this for reference purposes
int Function BrailleBuildDialog (handle hwndReal)
var
	string Buffer,
	string CheckedUnchecked,
	int iWinSubtypeCode,
	string buffer2,
	string buffer3,
	string windowName,
	string theClass,
	int theControlId

let Buffer = GetWindowName (hwndReal) ; title of the dialog box
let windowName=buffer
let theClass=getWindowClass(globalFocusWindow)
let theControlId=getControlId(globalFocusWindow)
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

	let buffer = GetObjectName()
;*** added for custom controls
	if iWinSubtypeCode==wt_treeView && windowName==wnWP5 then
		let buffer=getWindowName(getPriorWindow(globalFocusWindow))
	elif (theControlId==cId_positionButton || theControlId==cId_relativeSizeButton) && windowName==wnWP5 then
		let buffer=getWindowName(getPriorWindow(globalFocusWindow))+cscSpace+getWindowName(globalFocusWindow)
	elif iWinSubtypeCode==wt_edit && getWindowClass(getParent(globalFocusWindow))==wc_spinEdit then
		if getWindowTypeCode(getPriorWindow(getParent(globalFocusWindow)))==wt_static then
			let buffer=getWindowName(getPriorWindow(getParent(globalFocusWindow)))
		endIf
		let buffer2=cVMsgSpinBox1_L
	elif getWindowTypeCode(globalFocusWindow)==wt_edit && getWindowClass(getParent(globalFocusWindow))==wc_PFPpreselComboBox then
		if getWindowTypeCode(getPriorWindow(getParent(globalFocusWindow)))==wt_static then
			let buffer=getWindowName(getPriorWindow(getParent(globalFocusWindow)))
		endIf
		let buffer2=cVMsgEditCombo1_L
	elif theClass==wc_outlineArray then
		let buffer=getWindowName(getPriorWindow(getPriorWindow(getPriorWindow(getPriorWindow(getPriorWindow(globalFocusWindow))))))
		let buffer2=WPMsgSelectionArray1
		let buffer3=getWindowName(getPriorWindow(getPriorWindow(getPriorWindow(getPriorWindow(getCurrentWindow())))))
	endIf
	if buffer2!=cscNull then
		brailleAddString(buffer,0,0,0)
		brailleAddString(buffer2,0,0,0)
		if buffer3!=cscNull then
			brailleAddString(buffer3,getCursorCol(),getCursorRow(),getCharacterAttributes())
		else
			brailleAddFocusItem()
		endIf
		return true
	endIf
;***
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
	let buffer = GetObjectName()
;*** added for custom controls
	if iWinSubtypeCode==wt_treeView && windowName==wnWP5 then
		let buffer=getWindowName(getPriorWindow(globalFocusWindow))
	elif (theControlId==cId_positionButton || theControlId==cId_relativeSizeButton) && windowName==wnWP5 then
		let buffer=getWindowName(getPriorWindow(globalFocusWindow))+cscSpace+getWindowName(globalFocusWindow)
	elif iWinSubtypeCode==wt_edit && getWindowClass(getParent(globalFocusWindow))==wc_spinEdit then
		if getWindowTypeCode(getPriorWindow(getParent(globalFocusWindow)))==wt_static then
			let buffer=getWindowName(getPriorWindow(getParent(globalFocusWindow)))
		endIf
		let buffer2=cVMsgSpinBox1_L
	elif getWindowTypeCode(globalFocusWindow)==wt_edit && getWindowClass(getParent(globalFocusWindow))==wc_PFPpreselComboBox then
		if getWindowTypeCode(getPriorWindow(getParent(globalFocusWindow)))==wt_static then
			let buffer=getWindowName(getPriorWindow(getParent(globalFocusWindow)))
		endIf
		let buffer2=cVMsgEditCombo1_L
	elif theClass==wc_outlineArray then
		let buffer=getWindowName(getPriorWindow(getPriorWindow(getPriorWindow(getPriorWindow(getPriorWindow(globalFocusWindow))))))
		let buffer2=WPMsgSelectionArray1
		let buffer3=getWindowName(getPriorWindow(getPriorWindow(getPriorWindow(getPriorWindow(getCurrentWindow())))))
	endIf
	if buffer2!=cscNull then
		brailleAddString(buffer,0,0,0)
		brailleAddString(buffer2,0,0,0)
		if buffer3!=cscNull then
			brailleAddString(buffer3,getCursorCol(),getCursorRow(),getCharacterAttributes())
		else
			brailleAddFocusItem()
		endIf
		return true
	endIf
;***
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
	let buffer = GetObjectName()
;*** added for custom controls
	if iWinSubtypeCode==wt_treeView && windowName==wnWP5 then
		let buffer=getWindowName(getPriorWindow(globalFocusWindow))
	elif (theControlId==cId_positionButton || theControlId==cId_relativeSizeButton) && windowName==wnWP5 then
		let buffer=getWindowName(getPriorWindow(globalFocusWindow))+cscSpace+getWindowName(globalFocusWindow)
	elif iWinSubtypeCode==wt_edit && getWindowClass(getParent(globalFocusWindow))==wc_spinEdit then
		if getWindowTypeCode(getPriorWindow(getParent(globalFocusWindow)))==wt_static then
			let buffer=getWindowName(getPriorWindow(getParent(globalFocusWindow)))
		endIf
		let buffer2=cVMsgSpinBox1_L
	elif getWindowTypeCode(globalFocusWindow)==wt_edit && getWindowClass(getParent(globalFocusWindow))==wc_PFPpreselComboBox then
		if getWindowTypeCode(getPriorWindow(getParent(globalFocusWindow)))==wt_static then
			let buffer=getWindowName(getPriorWindow(getParent(globalFocusWindow)))
		endIf
		let buffer2=cVMsgEditCombo1_L
	elif theClass==wc_outlineArray then
		let buffer=getWindowName(getPriorWindow(getPriorWindow(getPriorWindow(getPriorWindow(getPriorWindow(globalFocusWindow))))))
		let buffer2=WPMsgSelectionArray1
		let buffer3=getWindowName(getPriorWindow(getPriorWindow(getPriorWindow(getPriorWindow(getCurrentWindow())))))
	endIf
	if buffer2!=cscNull then
		brailleAddString(buffer,0,0,0)
		brailleAddString(buffer2,0,0,0)
		if buffer3!=cscNull then
			brailleAddString(buffer3,getCursorCol(),getCursorRow(),getCharacterAttributes())
		else
			brailleAddFocusItem()
		endIf
		return true
	endIf
;***
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

int Function BrailleBuildLine ()
var
	int iState
let iState=brailleBuildLine()
if iState then
	return true
endIf
if globalInTableFlag then
	BrailleAddString(globalBrlTableCell,0,0,0)
	brailleAddString(getChunk(),0,0,0)
	return true
endIf
return false
EndFunction
*/

; braille code for JAWS 7.0
int function BrailleCallBackObjectIdentify ()
var
	int nSubtypeCode,
	int iControl,
	string WindowName,
	string sClass
if IsTouchCursor() then
	return GetTouchNavElementBrlSubtype()
EndIf
	if DialogActive () then
		let nSubTypeCode = GetWindowSubTypeCode(GlobalFocusWindow)
		let iControl = GetControlId (GlobalFocusWindow)
		let WindowName = GetWindowName(GetRealWindow(GlobalFocusWindow))
		; RG Using the old logic to determine the name for these buttons since I have no idea which buttons they actually are
	if (iControl==cId_positionButton || iControl==cId_relativeSizeButton) && windowName==wnWP5 then
	return wt_button
	elif nSubtypeCode==wt_edit then
	let sClass = getWindowClass(getParent(globalFocusWindow))
	if (sClass ==wc_spinEdit9) && (sClass ==wc_spinEdit10) then
	return wt_edit_spinbox
	elif sClass == wc_PFPpreselComboBox then
	return wt_editcombo
		EndIf
	elif GetWindowClass(GlobalFocusWindow) ==wc_outlineArray then
	return wt_custom_selection_array+wt_custom_control_base
	endIf
	EndIf ; Dialog is active
	if globalInTableFlag then
		return wt_custom_table_cell+wt_custom_control_base
	endIf; table cell
	return wt_unknown
EndFunction

int function BrailleAddObjectName (int nSubTypeCode)
var
	string WindowName,
	int iControl
if IsTouchCursor() then
	return BrailleAddObjectName (nSubTypeCode)
endIf

		let WindowName = GetWindowName(GetRealWindow(GlobalFocusWindow))
		let iControl = GetControlID (GlobalFocusWindow)
	if nSubtypeCode==wt_treeView && windowName==wnWP5 then
		BrailleAddString (getWindowName(getPriorWindow(globalFocusWindow)), 0, 0, 0)
		return true
		elif nSubtypeCode == wt_button then
				if (iControl==cId_positionButton || iControl==cId_relativeSizeButton) && windowName==wnWP5 then
				BrailleAddString (getWindowName(getPriorWindow(globalFocusWindow))+cscSpace+
				getWindowName(globalFocusWindow), 0, 0, 0)
				return true
EndIf
ElIf nSubtypeCode == wt_edit_spinbox then
		if getWindowSubTypeCode(getPriorWindow(getParent(globalFocusWindow)))
		==wt_static then
			BrailleAddString (getWindowName(getPriorWindow(getParent(globalFocusWindow))), 0, 0, 0)
			return true
		endIf
		ElIf nSubtypeCode == wt_editcombo then
		if getWindowSubTypeCode(getPriorWindow(getParent(globalFocusWindow)))
		==wt_static then
			BrailleAddString (getWindowName(getPriorWindow(getParent(globalFocusWindow))), 0, 0, 0)
			return true
		endIf
	ElIf nSubTypeCode == wt_custom_selection_array+wt_custom_control_base then
			BrailleAddString (getWindowName(getPriorWindow(getPriorWindow(getPriorWindow(getPriorWindow(getPriorWindow(globalFocusWindow)))))), 0, 0, 0)
			return true
	EndIf
	return false
EndFunction

int function BrailleAddObjectValue (int nSubtypeCode)
var
	string sName
if IsTouchCursor() then
	return BrailleAddObjectValue (nSubtypeCode)
endIf
	if nSubTypeCode == wt_custom_selection_array+wt_custom_control_base then
		let sName =getWindowName(getPriorWindow(getPriorWindow(getPriorWindow(getPriorWindow(getCurrentWindow())))))
		if sName !=cscNull then
			brailleAddString(sName,getCursorCol(),getCursorRow(),getCharacterAttributes())
		else
			brailleAddFocusItem()
		endIf
		return true
	ElIf nSubTypeCode == wt_custom_table_cell+wt_custom_control_base then
		brailleAddString(getChunk(),0,0,0)
			return true
			ElIf StringContains (GetWindowName (FindDescendantWindow (GetAppMainWindow (GlobalFocusWindow), CID_dialoguePage)), wnWP3)  &&
			 (nSubTypeCode == WT_TreeView) 	Then
			; focus is on the tree view and the default method of displaying the treeview contents
			; displays "....".  This fixes this problem.
					brailleAddString (GetWindowText (GlobalFocusWindow, TRUE), 0, 0, 0)
						return TRUE
EndIf
return false
EndFunction

int function BrailleAddObjectCellCoordinates (int nSubtypeCode)
	BrailleAddString (GlobalBrlTableCell, 0, 0, 0)
	return true
EndFunction

Void Function SayFormattedMessageWithVoice  (string Voice, int iOutputType, string sLong, string sShort)
var
	int iSpeak
Let iSpeak = ShouldItemSpeak (iOutputType)

If (iSpeak == message_off) then
	return
EndIf
If (iSpeak == message_long ||
	sShort == cscNull) then
	SayUsingVoice (voice,sLong, iOutputType)
	return
ElIf (iSpeak == message_short) then
	SayUsingVoice (voice,sShort, iOutputType)
	return
EndIf
EndFunction

Function resetDetectionFlags ()
let globalInTableFlag=false
let globalTablePriorCoordinates=cscNull
let globalPriorStyle=cscNull
let globalPriorLanguage=globalDefaultLanguage
let globalBorderedParagraph=false
let globalBorderedPage=false
let globalPriorPageNumber=0
let globalPriorTextColumnNumber=0
let globalMultipleColumns=false
EndFunction

void function isObject ()
If (! oWP) Then
	SayString ("object not present ")
EndIf
EndFunction

void Function GetPositionInDocument (int byref iLine, int byref iColumn, int byref iPage)
if !oWP then
	GetWPObject ()
EndIf
Let iLine = oWP.EnvLine ()
Let iColumn = oWP.EnvPosition ()
Let iPage = oWP.EnvPage ()
oWP.Quit ()
EndFunction

int Function MoveToTable (int iDirection)
Var
	int iOldLine,
	int iOldColumn,
	int iOldPage,
	int iNewLine,
	int iNewColumn,
	int iNewPage
if !oWP then
	GetWPObject ()
EndIf
GetPositionInDocument (iOldLine, iOldColumn, iOldPage)
if iDirection == s_next Then
	oWP.TablePosNextTable ()
else
	oWP.TablePosPreviousTable ()
EndIf
Pause ()
GetPositionInDocument (iNewLine, iNewColumn, iNewPage)
If iNewLine != iOldLine
|| iNewPage != iOldPage
|| iNewColumn != iOldColumn Then
	return TRUE
else
	return FALSE
EndIf
EndFunction

int Function MoveToComment (int iDirection)
Var
	int iOldLine,
	int iOldColumn,
	int iOldPage,
	int iNewLine,
	int iNewColumn,
	int iNewPage
if !oWP then
	GetWPObject ()
EndIf
GetPositionInDocument (iOldLine, iOldColumn, iOldPage)
if iDirection == s_next Then
	oWP.PosNextComment ()
else
	oWP.PosPrevComment ()
EndIf
Pause ()
GetPositionInDocument (iNewLine, iNewColumn, iNewPage)
If iNewLine != iOldLine
|| iNewPage != iOldPage
|| iNewColumn != iOldColumn Then
	return TRUE
else
	return FALSE
EndIf
EndFunction

int Function MoveToCrossRef (int iDirection)
Var
	int iOldLine,
	int iOldColumn,
	int iOldPage,
	int iNewLine,
	int iNewColumn,
	int iNewPage
if !oWP then
	GetWPObject ()
EndIf
GetPositionInDocument (iOldLine, iOldColumn, iOldPage)
if iDirection == s_next Then
	oWP.PosNextCrossRef ()
else
	oWP.PosPrevCrossRef ()
EndIf
Pause ()
GetPositionInDocument (iNewLine, iNewColumn, iNewPage)
If iNewLine != iOldLine
|| iNewPage != iOldPage
|| iNewColumn != iOldColumn Then
	return TRUE
else
	return FALSE
EndIf
EndFunction

int Function MoveToEndnote (int iDirection)
Var
	int iOldLine,
	int iOldColumn,
	int iOldPage,
	int iNewLine,
	int iNewColumn,
	int iNewPage
if !oWP then
	GetWPObject ()
EndIf
GetPositionInDocument (iOldLine, iOldColumn, iOldPage)
if iDirection == s_next Then
	oWP.PosNextEndnote ()
else
	oWP.PosPrevEndnote ()
EndIf
Pause ()
GetPositionInDocument (iNewLine, iNewColumn, iNewPage)
If iNewLine != iOldLine
|| iNewPage != iOldPage
|| iNewColumn != iOldColumn Then
	return TRUE
else
	return FALSE
EndIf
EndFunction

int Function MoveToFootnote (int iDirection)
Var
	int iOldLine,
	int iOldColumn,
	int iOldPage,
	int iNewLine,
	int iNewColumn,
	int iNewPage
if !oWP then
	GetWPObject ()
EndIf
GetPositionInDocument (iOldLine, iOldColumn, iOldPage)
if iDirection == s_next Then
	oWP.PosNextFootnote ()
else
	oWP.PosPrevFootnote ()
EndIf
Pause ()
GetPositionInDocument (iNewLine, iNewColumn, iNewPage)
If iNewLine != iOldLine
|| iNewPage != iOldPage
|| iNewColumn != iOldColumn Then
	return TRUE
else
	return FALSE
EndIf
EndFunction

int Function MoveToHeading (int iDirection, int iLevel)
Var
	int iOldLine,
	int iOldColumn,
	int iOldPage,
	int iNewLine,
	int iNewColumn,
	int iNewPage
if !oWP then
	GetWPObject ()
EndIf
GetPositionInDocument (iOldLine, iOldColumn, iOldPage)
if iDirection == s_next Then
	oWP.PosNextHeading ()
else
	oWP.PosPrevHeading ()
EndIf
Pause ()
GetPositionInDocument (iNewLine, iNewColumn, iNewPage)
If iNewLine != iOldLine
|| iNewPage != iOldPage
|| iNewColumn != iOldColumn Then
	return TRUE
else
	return FALSE
EndIf
EndFunction

int Function MoveToIndex (int iDirection)
Var
	int iOldLine,
	int iOldColumn,
	int iOldPage,
	int iNewLine,
	int iNewColumn,
	int iNewPage
if !oWP then
	GetWPObject ()
EndIf
GetPositionInDocument (iOldLine, iOldColumn, iOldPage)
if iDirection == s_next Then
	oWP.PosNextIndex ()
else
	oWP.PosPrevIndex ()
EndIf
Pause ()
GetPositionInDocument (iNewLine, iNewColumn, iNewPage)
If iNewLine != iOldLine
|| iNewPage != iOldPage
|| iNewColumn != iOldColumn Then
	return TRUE
else
	return FALSE
EndIf
EndFunction

int Function MoveToList (int iDirection)
Var
	int iOldLine,
	int iOldColumn,
	int iOldPage,
	int iNewLine,
	int iNewColumn,
	int iNewPage
if !oWP then
	GetWPObject ()
EndIf
GetPositionInDocument (iOldLine, iOldColumn, iOldPage)
if iDirection == s_next Then
	oWP.PosNextList ()
else
	oWP.PosPrevList ()
EndIf
Pause ()
GetPositionInDocument (iNewLine, iNewColumn, iNewPage)
If iNewLine != iOldLine
|| iNewPage != iOldPage
|| iNewColumn != iOldColumn Then
	return TRUE
else
	return FALSE
EndIf
EndFunction

int Function MoveToTOA (int iDirection)
Var
	int iOldLine,
	int iOldColumn,
	int iOldPage,
	int iNewLine,
	int iNewColumn,
	int iNewPage
if !oWP then
	GetWPObject ()
EndIf
GetPositionInDocument (iOldLine, iOldColumn, iOldPage)
if iDirection == s_next Then
	oWP.PosNextTOA ()
else
	oWP.PosPrevTOA ()
EndIf
Pause ()
GetPositionInDocument (iNewLine, iNewColumn, iNewPage)
If iNewLine != iOldLine
|| iNewPage != iOldPage
|| iNewColumn != iOldColumn Then
	return TRUE
else
	return FALSE
EndIf
EndFunction

int Function MoveToTOC (int iDirection)
Var
	int iOldLine,
	int iOldColumn,
	int iOldPage,
	int iNewLine,
	int iNewColumn,
	int iNewPage
if !oWP then
	GetWPObject ()
EndIf
GetPositionInDocument (iOldLine, iOldColumn, iOldPage)
if iDirection == s_next Then
	oWP.PosNextTOC ()
else
	oWP.PosPrevTOC ()
EndIf
Pause ()
GetPositionInDocument (iNewLine, iNewColumn, iNewPage)
If iNewLine != iOldLine
|| iNewPage != iOldPage
|| iNewColumn != iOldColumn Then
	return TRUE
else
	return FALSE
EndIf
EndFunction

int Function MoveToPage (int iDirection)
Var
	int iOldLine,
	int iOldColumn,
	int iOldPage,
	int iNewLine,
	int iNewColumn,
	int iNewPage
if !oWP then
	GetWPObject ()
EndIf
GetPositionInDocument (iOldLine, iOldColumn, iOldPage)
if iDirection == s_next Then
	oWP.PosPageNext ()
else
	oWP.PosPagePrevious ()
EndIf
Pause ()
GetPositionInDocument (iNewLine, iNewColumn, iNewPage)
If iNewLine != iOldLine
|| iNewPage != iOldPage
|| iNewColumn != iOldColumn Then
	return TRUE
else
	return FALSE
EndIf
EndFunction

int Function MoveToParagraph (int iDirection)
Var
	int iOldLine,
	int iOldColumn,
	int iOldPage,
	int iNewLine,
	int iNewColumn,
	int iNewPage
if !oWP then
	GetWPObject ()
EndIf
GetPositionInDocument (iOldLine, iOldColumn, iOldPage)
if iDirection == s_next Then
	oWP.PosParagraphNext ()
else
	oWP.PosParagraphPrevious ()
EndIf
Pause ()
GetPositionInDocument (iNewLine, iNewColumn, iNewPage)
If iNewLine != iOldLine
|| iNewPage != iOldPage
|| iNewColumn != iOldColumn Then
	return TRUE
else
	return FALSE
EndIf
EndFunction

Void Function SayAllStoppedEvent ()
var
	int iQuickNavMode

let iQuickNavMode = GetJcfOption(opt_quick_key_navigation_mode)
if !iQuickNavMode
|| iQuickNavMode == 2 then
	if QuickNavState()
	&& giPriorQuickNavMode
	&& !QuickNavSayAllRestart() then
		sayMessage(ot_status,cmsgNavigationModeOn_L)
		SetJcfOption(opt_quick_key_navigation_mode,1)
		SetQuickKeyNavigationState(1)
	EndIf
	if !giPriorQuickNavMode
	&& iQuickNavMode==2
	&& !QuickNavSayAllRestart() then
		SetJcfOption(opt_quick_key_navigation_mode,0)
		SetQuickKeyNavigationState(0)
	EndIf
EndIf
if QuickNavSayAllRestart()>=1 then
	ClearQuickNavSayAllRestart()
	SetQuickKeyNavigationState(1)
	SayAll()
	return
EndIf
SayAllStoppedEvent () ; call default
EndFunction

int Function StepOutOfTable(int iForward)
Var
	int iOldLine,
	int iOldColumn,
	int iOldPage,
	int iNewLine,
	int iNewColumn,
	int iNewPage
if !oWP then
	GetWPObject ()
EndIf
GetPositionInDocument (iOldLine, iOldColumn, iOldPage)
if iForward == FALSE Then
	oWP.PosTableBegin()
else
	oWP.PosTableEnd()
EndIf
Pause ()
GetPositionInDocument (iNewLine, iNewColumn, iNewPage)
If iNewLine != iOldLine
|| iNewPage != iOldPage
|| iNewColumn != iOldColumn Then
	return TRUE
else
	return FALSE
EndIf
EndFunction
