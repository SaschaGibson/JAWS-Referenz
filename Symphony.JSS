; Scripts for IBM Lotus Symphony
; Copyright 2010-2015 by Freedom Scientific BLV Group LLC

include "hjconst.jsh"
include "hjglobal.jsh"
include "MSAAConst.jsh"
include "common.jsm"
include "Symphony.jsm"
use "SymphonyQuickNav.jsb"

globals
int gSODCPrevSubtypeCode,
int gSODCPrevSubtypeCode1, ; represents the immediate parent
int gSODCPrevTableRow,
int gSODCPrevTableCol,
string gSODCTableName,
int gSODCTableRowHeader,
int gSODCTableColHeader,
int gSODCTableTitleReading,
int gSODCMaySpeakTutorHelp,
string gSODCDocTitle,
string gSODCSectionName,
string gSODCPreviousLinkText

const
calledFromSayLine = 1

void function AutoStartEvent()
smmSetDesiredUnitsOfMeasure (smmInches)
let gSODCPrevTableRow = 0;
let gSODCPrevTableCol = 0;
let gSODCDocTitle = "";
let gSODCTableName = "";
AutoStartEvent();
EndFunction

string function GetDocTitle()
var
	object o,
	int child,
	int role,
	int ancestors,
	int count,
	int type

let ancestors = GetAncestorCount()

while ( count < ancestors )
let type = GetObjectSubTypeCode(SOURCE_CACHED_DATA, count );

if ( type == WT_DOCUMENT ) then
return GetObjectName(SOURCE_CACHED_DATA, count );
EndIf

let count = count + 1;
EndWhile

if ( IsVirtualPCCursor () ) then
let o = GetFocusObject (child);
let role = o.accRole( child );
if ( role == 15 ) then ; document
return o.accName( child )
EndIf
EndIf

;When creating a new presentation, focus goes to a parent of the new document.
;Try to retrieve here.
let o = GetFocusObject (child);
let role = o.accRole( child );
if ( role == 10 && type == 0) then
	var
		object childObject

	let childObject = o.accChild( 1 );
	if (childObject) then
		return childObject.accName(0)
	EndIf
EndIf

return "";
EndFunction

string function GetDocSpecificSettingsFile()
var
	string file,
	string path

let file = GetDocTitle();

if ( file ) then
let path = FindJAWSPersonalizedSettingsFile (file, true)
return path;
EndIf

return "";
EndFunction

void function LoadDocumentSpecificSettings()
var
	string path,
	string table

let path = GetDocSpecificSettingsFile();

if ( ! path ) then
SayUsingVoice( VCTX_MESSAGE, msg_ErrorDocSettingsLoad, OT_JAWS_MESSAGE );
	return;
EndIf

let table = GetTableName()

if ( table ) then
let gSODCTableRowHeader = IniReadInteger( table, "RowHeader", 0, path )
let gSODCTableColHeader = IniReadInteger( table, "ColHeader", 0, path )
let gSODCTableTitleReading = IniReadInteger( table, "ReadTableHeaders", 0, path )
EndIf
EndFunction

void function SaveDocumentSpecificSettings( string path, string table )
if ( ! path ) then
	let path = GetDocSpecificSettingsFile();
EndIf

if ( ! path ) then
SayUsingVoice( VCTX_MESSAGE, msg_ErrorDocSettingsSave, OT_JAWS_MESSAGE );
return;
EndIf

if ( ! table ) then
let table = GetTableName()
EndIf

if ( table ) then
IniWriteInteger( table, "RowHeader", gSODCTableRowHeader, path )
IniWriteInteger( table, "ColHeader", gSODCTableColHeader, path )
IniWriteInteger( table, "ReadTableHeaders", gSODCTableTitleReading, path )
EndIf
EndFunction

void function SayCell( int bSayDetails )
if ( IsTableCell() == 1  ) then
; we call say paragraph because we want to use the same code
; to speak the text attributes for cell text as we do for the text in the word processor
SayParagraph( TRUE )
else
SayLine()
EndIf

if ( ! bSayDetails ) then
return
EndIf

var string name
if ( GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0) == WT_MULTILINE_EDIT ) then
let name = GetObjectName(SOURCE_CACHED_DATA, 1 );
else
let name = GetObjectName();
EndIf

SayUsingVoice ( VCTX_MESSAGE, name, OT_CONTROL_NAME )

var string text, int rows, int columns
GetCellSpan( rows, columns );

if ( rows > 1 && columns > 1 ) then
let text = FormatString (msg10_L, IntToString (rows), IntToString (columns))
ElIf ( rows > 1 ) then
let text = FormatString (msg8_L, IntToString (rows))
ElIf ( columns > 1 ) then
let text = FormatString (msg9_L, IntToString (columns))
EndIf

if ( text ) then
SayUsingVoice ( VCTX_MESSAGE, text, OT_CONTROL_NAME )
EndIf

Say ( GetObjectState(), 	OT_ITEM_STATE, false )

	var string formula;
	Let formula = GetCellFormula()
	If (StringLength(formula) > 0) Then
		SayString(msg11_L)
	EndIf

	var string note;
	Let note = GetCellNote()
	If (StringLength(note) > 0) Then
		SayString(msg12_L)
	EndIf

EndFunction

int function HandleTableCellFocus(optional  int calledFrom )
;SayString("table cell")
var
	int type;

SetColumnHeader ( gSODCTableColHeader - 1 )
SetRowHeader ( gSODCTableRowHeader - 1 )

let type = GetObjectSubTypeCode(SOURCE_CACHED_DATA)

If ( IsTableCell() ) then
If ( type == WT_EDIT
|| type == WT_MULTILINE_EDIT ) then
if ( gSODCPrevTableCol == 0
&& gSODCPrevTableRow == 0 ) then
var int cols, int rows, string name, string msg
let cols = GetTableColumnCount();
let rows = GetTableRowCount();
let name = GetTableName();
let msg = FormatString ( msg3_l, name, IntToString (cols), IntToString (rows) );
SayUsingVoice (	VCTX_MESSAGE, msg, ot_JAWS_MESSAGE )
EndIf ; moving into a table
EndIf ; table in a word processor

var int col, int row
GetCellCoordinates (col, row)

if ( ( gSODCTableTitleReading == 1
|| gSODCTableTitleReading == 3 )
&& row != gSODCPrevTableRow
&& col > gSODCTableRowHeader ) then
SayRowHeader();
EndIf

if (  gSODCTableTitleReading >= 2
&& gSODCPrevTableCol != col
&& row > gSODCTableColHeader ) then
SayColumnHeader();
EndIf

var int bSayCellDetails
if ( gSODCPrevTableRow == row
&& gSODCPrevTableCol == col ) then
let bSayCellDetails = false
else
let bSayCellDetails = true
EndIf

let gSODCPrevTableRow = row;
let gSODCPrevTableCol = col;

SayCell( bSayCellDetails )
return 1;
else ; not in a table
if not ( InHJDialog () ) then
if ( gSODCPrevTableRow != 0 && gSODCPrevTableCol != 0  ) then
SayUsingVoice (vctx_message, msgLeavingTable, ot_control_name )
if ( calledFrom == calledFromSayLine ) then
PerformScript SayLine()
EndIf
EndIf

let gSODCPrevTableRow = 0;
let gSODCPrevTableCol = 0;
EndIf
EndIf ; Is table cell

return 0
EndFunction

int Function HandleCustomWindows (handle hWnd)
var
	int type,
int nLevel;

let type = GetObjectSubTypeCode(SOURCE_CACHED_DATA)

if ( HandleTableCellFocus( 0 ) ) then
return 1;
EndIf

if ( hwnd == GlobalPrevFocus
&& gSODCPrevSubtypeCode == type ) then
let nLevel = GetFocusChangeDepth()
if ( type == WT_MULTILINE_EDIT
&& ( nLevel == 0
|| ( nLevel == 1 && GetObjectSubTypeCode(SOURCE_CACHED_DATA, 1 ) == WT_FOOTNOTE ) ) ) then
let gSODCMaySpeakTutorHelp= 0;
return 1;
EndIf
EndIf ; same handle and subtype

let gSODCPrevSubtypeCode = type;
let GlobalPrevFocus = hwnd
let gSODCMaySpeakTutorHelp= 1;

if ( type == WT_SHAPE
&& DoesSelectedShapeOverlap() ) then
sayobjectTypeAndText()
SayUsingVoice ( VCTX_MESSAGE, MSG_LAYERED, OT_ITEM_STATE )
return 1;
EndIf

if ( type == WT_DOCUMENT ) then
IndicateControlType (type, GetObjectName() )
SayDocumentPageName()
return 1;
EndIf

if ( IsVirtualPCCursor () ) then
var
Object o,
int child

let o = GetFocusObject (child);
if ( o.accDescription(child) == "com.sun.star.presentation.SlidesView" ) then
IndicateControlType( 0, msgPresentationView )
else
IndicateControlType( 0, msgDocView )
EndIf
return 1;
EndIf

return HandleCustomWindows (hWnd)
EndFunction

void function DoSayObjectTypeAndTextFromLevel( int level )
;SayInteger(level)
var
int type

while ( level > 0)
let type = GetObjectSubtypeCode(SOURCE_CACHED_DATA, level)
if ( type == WT_TABLE
&& GetObjectSubtypeCode(SOURCE_CACHED_DATA, 0 ) == WT_MULTILINE_EDIT  ) then
; the following causes table row and column headers to speak with insert + tab
; if we move directly from one table to another
let gSODCPrevTableRow = 0;
let gSODCPrevTableCol = 0;
elif ( type == WT_TABLECELL
|| type == WT_COMBOBOX
|| type == WT_DOCUMENT ) then
ElIf ( type == WT_SEPARATOR ) then
Say (GetObjectName(SOURCE_CACHED_DATA, level ), OT_CONTROL_NAME, false)
elif ( type == WT_DIALOG ) then
sayobjectTypeAndText( level )
Say( MSAAGetDialogStaticText (), OT_DIALOG_TEXT )

	if ( InNamedDialog( wnSpellcheck, false ) ) then
		PerformScript ReadMisspelledWordAndSuggestion()
	EndIf
Elif ( level == 1
&& type == WT_FOOTNOTE
&& gSODCPrevSubtypeCode1 == type) then
elif ( type > 0 ) then
sayobjectTypeAndText( level )
EndIf

if ( level == 1 ) then
let gSODCPrevSubtypeCode1 = type
EndIf

let level = level - 1;
EndWhile

; the following should be the object with focus (0)
if ( HandleCustomWindows( GetCurrentWindow() ) == false ) then
;SayInteger( GetObjectSubtypeCode(SOURCE_CACHED_DATA, level) )
let type = GetObjectSubtypeCode(SOURCE_CACHED_DATA, level)
if ( type != WT_DIALOG ) then
sayobjectTypeAndText( level )

if ( type == WT_MULTILINE_EDIT ) then
Say ( GetSelectedText (TRUE), OT_SELECT, TRUE)
EndIf; is multiline edit
EndIf ; excluding types
EndIf
EndFunction

; this function returns 1 if the focus object is a cell proper
; and 2 if the object is a cell within a word processing document.
int function IsTableCell()
var
	int type, int ParentType;

let type = GetObjectSubTypeCode(SOURCE_CACHED_DATA)
;SayCachedMSAAFocusInfo();
if ( type == WT_TABLECELL ) then
return 1;
ElIf ( type == WT_MULTILINE_EDIT ) then
let ParentType = GetObjectSubTypeCode(SOURCE_CACHED_DATA, 1 )
if ( ParentType == WT_TABLECELL ) then
return 2;
EndIf
EndIf ; testing types

return 0;
EndFunction

int function IsSpinBox()
var
	int type;

let type = GetObjectSubTypeCode(SOURCE_CACHED_DATA)
if  ( type == wt_edit_spinbox
|| type == wt_spinbox ) then
return 1;
EndIf

return 0;
EndFunction

int function IsTreeItem()
; RG commenting out while tree view still broken by MSAA
if ( 1 ) then return 0 EndIf

var
	int type;

let type = GetObjectSubTypeCode(SOURCE_CACHED_DATA)
if  ( type == WT_TREEVIEWITEM ) then
return 1;
EndIf

return 0;
EndFunction

int function ISEditControl( int type )
return ( type == WT_EDIT
	|| type == WT_READONLYEDIT
	|| type == WT_MULTILINE_EDIT );
EndFunction

int function IsVirtualCursorReallyActive()
var
	string cursorName
let cursorName = GetActiveCursorName()
return ( StringCompare (cursorName, "FSDom cursor", false ) == 0 );
EndFunction

Script SayNextCharacter ()
var
int type

let type = GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0 );

if ( IsTableCell() == 1
|| type == WT_TABCONTROL ) then
TypeCurrentScriptKey ()
return;
ElIf ( IsTreeItem() ) then
TypeCurrentScriptKey ()
SayObjectActiveItem ()
return
EndIf
nextCharacter ()
SayCharacterUnit(UnitMove_Next)
EndScript

Script SayPriorCharacter ()
var
int type

let type = GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0 );

if ( IsTableCell() == 1
|| type == WT_TABCONTROL ) then
TypeCurrentScriptKey ()
return;
ElIf ( IsTreeItem() ) then
TypeCurrentScriptKey ()
SayObjectActiveItem ()
return
EndIf
priorCharacter ()
SayCharacterUnit(UnitMove_Prior)
EndScript

Script SayNextWord()
var
int type

let type = GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0 );

if ( IsTableCell() == 1
|| type == WT_TABCONTROL ) then
TypeCurrentScriptKey ()

if ( type == WT_TABLECELL ) then
pause()
	SayMessage(ot_smart_help,msgEdgeOfCurrentDataRegion,cmsgSilent)
EndIf

return;
EndIf
NextWord ()
SayWordUnit(UnitMove_Next)
EndScript

Script SayPriorWord()
var
int type

let type = GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0 );

if ( IsTableCell() == 1
|| type == WT_TABCONTROL ) then
TypeCurrentScriptKey ()

if ( type == WT_TABLECELL ) then
pause()
	SayMessage(ot_smart_help,msgEdgeOfCurrentDataRegion,cmsgSilent)
EndIf

return;
EndIf
PriorWord ()
SayWordUnit(UnitMove_Prior)
EndScript


Void Function SayWordUnit (int UnitMovement)
AnnounceLink(false)

SayWordUnit(UnitMovement)
EndFunction

void function SayLineUnit( int movementUnit, int bMoved )
var
	int type
let type = GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0 );
if ( IsTableCell() > 0) then
	return;
EndIf

if (WT_COMBOBOX == type) then
	return
EndIf

if (type==WT_SHAPE) then
	return
EndIf
if (AnnounceLink(false)) then
	return
EndIf

if !IsKeyWaiting () then
	PauseFor(20)
EndIf
SayLineUnit( movementUnit, bMoved )
EndFunction

Script SayNextLine()
var
	int bMoved

let bMoved = NextLine()
SayLineUnit(UnitMove_Next,bMoved)
EndScript

Script SayPriorLine ()
var
	int bMoved

let bMoved = PriorLine()
SayLineUnit(UnitMove_Prior,bMoved)
EndScript

void function SayNextOrPriorParagraph()
TypeCurrentScriptKey ()
Delay(1)
If SayAllInProgress() then
	Return
EndIf
if !SayParagraph() then
	SayMessage(OT_error, cMSG276_L)
	SayMessage(OT_error, cMSG277_L, cmsgSilent)
endIf
EndFunction

Script SayNextParagraph()
var
int type

let type = GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0 );

if ( type == WT_TABLECELL ) then
TypeCurrentScriptKey ()
pause()
	SayMessage(ot_smart_help,msgEdgeOfCurrentDataRegion,cmsgSilent)
return;
EndIf

if ( IsPCCursor ()
&& type == WT_MULTILINE_EDIT ) then
SayNextOrPriorParagraph()
return
EndIf

PerformScript SayNextParagraph()
EndScript

Script SayPriorParagraph()
var
int type

let type = GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0 );

if ( type == WT_TABLECELL ) then
TypeCurrentScriptKey ()
pause()
	SayMessage(ot_smart_help,msgEdgeOfCurrentDataRegion,cmsgSilent)
return;
EndIf

if ( IsPCCursor ()
&& type == WT_MULTILINE_EDIT ) then
SayNextOrPriorParagraph()
return
EndIf

PerformScript SayPriorParagraph()
EndScript

Script SayCharacter()
if handleNoCurrentWindow() then
	return
endIf
if ( IsTableCell() == 1 ) then
	SayCell( true );
	return;
EndIf
var
int nTimesPressed
if IsPCCursor() then
	if (GetObjectTypeCode() == WT_SLIDER) then
		SayWord() ; says the current setting
		return
	endIf
endIf
let nTimesPressed=IsSameScript ()
if (nTimesPressed>=2) then
	SayCharacterValue()
	AddHook (HK_SCRIPT, "CharacterValueHook")
elif nTimesPressed == 1 then
	SayCharacterPhonetic ()
	AddHook (HK_SCRIPT, "PhoneticSpellHook")
else
	let globalSayingCurrentItem = 1
	SayCharacter(true)
	let globalSayingCurrentItem = 0
endIf
EndScript

Script SayWord()
var
	int type
if handleNoCurrentWindow() then
	return
endIf
let type = GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0 );

if ( IsTableCell() == 1 ) then
SayCell( true );
return;
elif ( type == WT_TABCONTROL ) then
SayObjectTypeAndText (0)
return
EndIf

PerformScript SayWord()
EndScript

Script SayLine()
var
	int type
if handleNoCurrentWindow() then
	return
endIf
let type = GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0 );

if ( IsTableCell() == 1 ) then
SayCell( true );
return;
ElIf ( IsSpinBox()
|| type == WT_TABCONTROL
|| type == WT_SHAPE ) then
	DoSayObjectTypeAndTextFromLevel ( 0 )
	return;
EndIf

if (AnnounceLink (true)) then
	return
EndIf

PerformScript SayLine()
EndScript

Script SelectNextCharacter()
if ( IsTableCell() == 1 ) then
	TypeKey(cksSelectNextCharacter)
	;SayCell();
	return;
EndIf
PerformScript SelectNextCharacter()
EndScript

Script SelectPriorCharacter()
if ( IsTableCell() == 1 ) then
	TypeKey(cksSelectPriorCharacter)
	;SayCell();
	return;
EndIf
PerformScript SelectPriorCharacter()
EndScript

Script SelectNextWord()
if ( IsTableCell() == 1 ) then
	TypeKey(cksSelectNextWord)
	;SayCell();
	return;
EndIf
PerformScript SelectNextWord()
EndScript

Script SelectPriorWord()
if ( IsTableCell() == 1 ) then
	TypeKey(cksSelectPriorWord)
	;SayCell();
	return;
EndIf
PerformScript SelectPriorWord()
EndScript

Script SelectNextLine()
if ( IsTableCell() == 1 ) then
	TypeKey(cksSelectNextLine)
	;SayCell();
	return;
EndIf
PerformScript SelectNextLine()
EndScript

Script SelectPriorLine()
if ( IsTableCell() == 1 ) then
	TypeKey(cksSelectPriorLine)
	;SayCell();
	return;
EndIf
PerformScript SelectPriorLine()
EndScript

Script ScriptFileName()
ScriptAndAppNames( msg1_l ) ;"IBM Workplace"
EndScript

Script SayWindowPromptAndText()
if handleNoCurrentWindow() then
	return
endIf
; the following causes table row and column headers to speak with insert + tab
let gSODCPrevTableRow = 0;
let gSODCPrevTableCol = 0;
let gSODCPrevSubtypeCode = 0;
let gSODCPrevSubtypeCode1 = 0;
let gSODCMaySpeakTutorHelp = 1;

var
int type0,
int type1,
int type2,
int nLevel

let nLevel = 0

if ( GetAncestorCount() > 0 ) then
let type0 = GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0 )
let type1 = GetObjectSubTypeCode(SOURCE_CACHED_DATA, 1 )
let type2 = GetObjectSubTypeCode(SOURCE_CACHED_DATA, 2 )
;SayInteger (type0)
;SayInteger (type1)
;SayInteger (type2)

if ( type0 == WT_TABLECELL ) then
if ( type1 == WT_TABLE ) then
let nLevel = 1
elif ( type2 == WT_TABLE ) then
let nLevel = 2
EndIf
EndIf ; table cell

if ( type0 == WT_MULTILINE_EDIT ) then
if ( type1 == WT_TABLECELL
&& type2 == WT_TABLE ) then
let nLevel = 2;
elif ( type1 == WT_FRAME
|| type1 == WT_FOOTNOTE
|| type1 == WT_PAGEHEADER
|| type1 == WT_PAGEFOOTER ) then
let nLevel = 1;
EndIf
EndIf ; multiline edit

if ( type0 == WT_LISTVIEWITEM
|| type0 == WT_LISTBOXITEM
|| type0 == WT_TREEVIEWITEM ) then
let nLevel = 1;
EndIf ; list or tree

if ( type1 == WT_SEPARATOR ) then
let nLevel = 1;
elif ( type2 == WT_SEPARATOR ) then
let nLevel = 2;
EndIf
EndIf

DoSayObjectTypeAndTextFromLevel( nLevel)

;don't speak tutorial help for paragraphs
if ( type0 == WT_MULTILINE_EDIT ) then
	return;
EndIf

; speak tutorial help
var
	int nMode
let nMode=smmTrainingModeActive()

;Any code in HandleCustomWindows should make both
;SayFocusedWindow and insert tab speak consistently.
smmToggleTrainingMode(TRUE)
	SayTutorialHelp (type0, TRUE)
	SayTutorialHelpHotKey (GetCurrentWindow(), TRUE)
	IndicateComputerBraille (getCurrentWindow ())
	SpeakProgressBarInfo(TRUE)
	smmToggleTrainingMode(nMode)

;performScript SayWindowPromptAndText();
EndScript

String Function SetTableHeaderReading(int iRetCurVal)
if not ( iRetCurVal ) then
let gSODCTableTitleReading = gSODCTableTitleReading + 1;

if ( gSODCTableTitleReading > 3 ) then
let gSODCTableTitleReading = 0;
EndIf
EndIf

var
string sValue

if (  gSODCTableTitleReading == 3 ) then
let sValue = msg4_l
Elif (  gSODCTableTitleReading == 2 ) then
let sValue = msg5_l
Elif (  gSODCTableTitleReading == 1 ) then
let sValue = msg6_l
else
let sValue = msg7_l
EndIf

return sValue;
EndFunction

String Function SetTableHeaderReadingHlp()
return msgSetTableHeaderReadingHlp
EndFunction

string function getTableHeaderReadingInfo (string settingID)
var
	int nSelectIndex = gSODCTableTitleReading,
	stringArray szListItems,
	int nSize = 4
szListItems = new stringArray[nSize]
szListItems[1] = msg7_l; OFF
szListItems[2] = msg6_l ; rows
szListItems[3] = msg5_l ; columns
szListItems[4] = msg4_l; both
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setTableHeaderReadingInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int iSelection
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
if iSelection >= 0 then ;off or greater
	gSODCTableTitleReading = iSelection
	return iniWriteInteger (GetTableName (), "ReadTableHeaders", gSODCTableTitleReading, GetDocTitle ()+".jsi")
endIf
endFunction

String Function SetColumnHeadersToRow (int iRetCurVal)
if not ( iRetCurVal ) then
let gSODCTableColHeader = gSODCPrevTableRow;
if ( gSODCTableTitleReading <= 1 ) then
let gSODCTableTitleReading = gSODCTableTitleReading + 2
EndIf
EndIf

if ( gSODCTableColHeader == 0 ) then
return msg2_l;
EndIf

return IntToString ( gSODCTableColHeader )
EndFunction

String Function SetColumnHeadersToRowHlp()
return msgSetColumnHeadersToRowHlp
EndFunction

string function getColumnHeadersToRowInfo (string settingID)
var
	int nSelectIndex,
	stringArray szListItems,
	int nSize = 2
szListItems = new stringArray[nSize]
nSelectIndex = gSODCPrevTableRow
szListItems[1] = msg2_l
szListItems[2] = IntToString ( gSODCPrevTableRow)
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setColumnHeadersToRowInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	string sTable = getTableName (),
	string sDocName = GetDocTitle ()+".jsi"
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
if iSelection == 1 then
	let gSODCTableColHeader = gSODCPrevTableRow;
	if ( gSODCTableTitleReading <= 1 ) then
		let gSODCTableTitleReading = gSODCTableTitleReading + 2
	EndIf
	IniWriteInteger(sTable, "ReadTableHeaders", gSODCTableTitleReading, sDocName)
	IniWriteInteger(sTable, "ColHeader", gSODCTableColHeader, sDocName)
EndIf
endFunction

String Function SetRowHeadersToColumn (int iRetCurVal)
if not ( iRetCurVal ) then
let gSODCTableRowHeader = gSODCPrevTableCol;
if ( gSODCTableTitleReading == 0
|| gSODCTableTitleReading  == 2 ) then
let gSODCTableTitleReading = gSODCTableTitleReading + 1
EndIf
EndIf

if ( gSODCTableRowHeader == 0 ) then
return msg2_l;
EndIf

return IntToString ( gSODCTableRowHeader )
EndFunction

String Function SetRowHeadersToColumnHlp()
return msgSetRowHeadersToColumnHlp
EndFunction

string function getRowHeadersToColumnInfo (string settingID)
var
	int nSelectIndex,
	stringArray szListItems,
	int nSize = 2
szListItems = new stringArray[nSize]
nSelectIndex = gSODCPrevTableCol
szListItems[1] = msg2_l
szListItems[2] = IntToString ( gSODCPrevTableCol)
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setRowHeadersToColumnInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	string sTable = getTableName (),
	string sDocName = GetDocTitle ()+".jsi"
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
if iSelection == 1 then
	let gSODCTableRowHeader = gSODCPrevTableCol;
	if ( gSODCTableTitleReading <= 1 ) then
		let gSODCTableTitleReading = gSODCTableTitleReading + 1
	EndIf
	IniWriteInteger(sTable, "ReadTableHeaders", gSODCTableTitleReading, sDocName)
	IniWriteInteger(sTable, "RowHeader", gSODCTableColHeader, sDocName)
EndIf
endFunction

String Function ClearTableHeaders(int iRetCurVal)
if ( iRetCurVal ) then
return ""
EndIf

let gSODCTableTitleReading = 3;
let gSODCTableColHeader = 0;
let gSODCTableRowHeader = 0;
return ""
EndFunction

String Function ClearTableHeadersHlp()
return msgClearTableHeadersHlp
EndFunction

string function getClearTableHeadersInfo (string settingID, int nReadSource)
var
	int nSelectIndex = 0,
	stringArray szListItems,
	int nSize = 2
szListItems = new stringArray[nSize]
szListItems[1] = msgClearNoChange
szListItems[2] = msgClearAll
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setClearTableHeadersInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	string sTable = getTableName (),
	string sDocName = GetDocTitle ()
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
if iSelection == 1 then
	let gSODCTableTitleReading = 3;
	let gSODCTableColHeader = 0;
	let gSODCTableRowHeader = 0;
	IniWriteInteger(sTable, "ReadTableHeaders", gSODCTableTitleReading, sDocName)
	IniWriteInteger(sTable, "ColHeader", gSODCTableColHeader, sDocName)
	IniWriteInteger(sTable, "RowHeader", gSODCTableColHeader, sDocName)
endIf
endFunction

Script AdjustJAWSOptions()
var
	string FuncNames,
	string path,
	string table
let path = GetDocSpecificSettingsFile()
let table = GetTableName()
if ( IsTableCell() ) then
	let FuncNames = cstrVerbosityFuncNames
	ConvertListToNodeList(FuncNames,msg1_l)
EndIf
OptionsTreeCore(FuncNames)
SaveDocumentSpecificSettings( path, table )
EndScript

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue,int bIsFocusObject)
;SayString("valueChange " + sObjValue )
if ( nObjType == WT_STATIC
&& InNamedDialog( wnSpellcheck, false ) ) then
var object o, int child
let o = GetObjectFromEvent ( hwnd, ObjID, ChildID, child)
let o = o.accParent();
if (  o.accRole( 0 ) == 10 ) then
PerformScript ReadMisspelledWordAndSuggestion()
return
EndIf
EndIf

if ( IsSpinBox()
		|| nObjType == WT_DATETIME ) then
	Say ( GetObjectValue(), OT_SELECTED_ITEM, false )
	return;
EndIf

if (WT_COMBOBOX == nObjType
		&& GetObjectSubTypeCode(SOURCE_CACHED_DATA) == WT_EDITCOMBO) then
	Say(sObjValue,ot_line)
	return
EndIf


if ( bIsFocusObject == 2 ; from parent
&& nObjType ==	WT_EDITCOMBO ) then
	Say(sObjValue,ot_line)
	return
EndIf

;SayString("value change")
ValueChangedEvent ( hwnd, objId, childId, nObjType, sObjName, sObjValue, bIsFocusObject );
EndFunction

void function ObjStateChangedEvent(handle hObj, int iObjType, int nChangedState, int nState, int nOldState)
;SayString("state change")

if ( nChangedState == CTRL_SELECTED
&& GetObjectSubTypeCode(SOURCE_CACHED_DATA) == WT_MULTILINE_Edit ) then
return
EndIf

ObjStateChangedEvent( hObj, iObjType, nChangedState, nState, nOldState );
EndFunction

Void Function NameChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sOldName, string sNewName)
;SayString("name change");
NameChangedEvent ( hwnd, objId, childId, nObjType, sOldName, sNewName );
EndFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
;SayString("Active item changed")

if ( HandleTableCellFocus( 0 ) ) then
return;
EndIf

ActiveItemChangedEvent (curHwnd, curObjectId, curChildId,
	prevHwnd, prevObjectId, prevChildId)
EndFunction

Void Function DescriptionChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sOldDescription, string sNewDescription)
EndFunction

void function SayObjectDetail( object o )
if ( ! o ) then
SayString( "no object" )
return
EndIf

SayInteger( o.accRole( 0 ) )
SayString( o.accName( 0 ) )
SayString( o.accValue( 0 ) )
SayString( o.accDescription( 0 ) )
SayInteger( o.accState( 0 ), 16 )
EndFunction

void function FocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
;SayInteger(nChangeDepth)
;SayString("FocusChangeEx")
if FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth) then
	return
endIf	
;this is to handle the use of IE to display help in symphony
if StringCompare (GetWindowClass (GetFocus()), cwcIEServer ) == 0 then ;we found an IE window, switch config
	SwitchToConfiguration ("Internet Explorer")
	return
EndIf

var
	object o,
	int child,
	int type,
	int role,
	object childObject
let o = GetObjectFromEvent (hwndFocus, nObject, nChild, child)
;SayObjectDetail( o )
let type = GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0)
let role = o.accRole( child )
if ( role == 10 ; client
&& type == 0 ) then
	var
		string docName

	let gSODCDocTitle = ""
	let childObject = o.accChild( 1 );
	if (childObject) then
		let docName = childObject.accName(0)
		FocusChangedEventEx (hwndFocus, nObject, nChild,
		hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
	EndIf
	return
elif ( type == WT_EDIT
&& role != 42 ; editable text
&& role != 18 ; dialog
&& InNamedDialog( wnSpellcheck, false ) ) then
; sometimes happens in the spell check dialog
return
EndIf

FocusChangedEventEx (
	hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)

if ( type != WT_MULTILINE_EDIT ) then
NavigationModeToggle( false, false )
EndIf
EndFunction

function FocusChangedEvent()
;SayString( "FocusChange" );
var
int nLevel,
	string DocTitle,
	string tableName

if ReturningFromResearchItDialog () then
	return ; default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
let nLevel = GetFocusChangeDepth()

;load docspecific settings
if ( GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0 ) > 0
|| ! delay(2)
|| IsVirtualPCCursor () ) then
let DocTitle = GetDocTitle()
let tableName = GetTableName()

if ( DocTitle  ) then
var int LoadNewSettings
if ( gSODCDocTitle != DocTitle ) then
IndicateControlType( WT_DOCUMENT, DocTitle )
let gSODCDocTitle = DocTitle;
let LoadNewSettings = true;
EndIf

if ( TableName && tableName != gSODCTableName ) then
let gSODCTableName = TableName
let LoadNewSettings = true;
EndIf

if ( LoadNewSettings ) then
LoadDocumentSpecificSettings()
EndIf
EndIf ; DocTitle
EndIf ; a valid control

DoSayObjectTypeAndTextFromLevel( nLevel )
EndFunction

void function tutorMessageEvent(handle hwndFocus, int nMenuMode)
;SayString("tutor message")
var
	int type

let type = GetObjectSubTypeCode();

;don't speak tutorial help for paragraphs
if ( type == WT_MULTILINE_EDIT ) then
	return;
EndIf

if ( gSODCMaySpeakTutorHelp || nMenuMode ) then
tutorMessageEvent( hwndFocus, nMenuMode )
EndIf

let gSODCMaySpeakTutorHelp= 0;
EndFunction

Script SayWindowTitle()
var
	int iTypeCode,
	string sMessageLong,
	string sPageLong
if handleNoCurrentWindow() then
	return
endIf
If UserBufferIsActive () then
	If IsVirtualPcCursor () then
		PerformScript SayWindowTitle()
		Return
	EndIf
EndIf

PerformScript SayWindowTitle()

var int level
let level = GetAncestorCount()

while ( level >= 0 )
let iTypeCode=getObjectSubtypeCode(SOURCE_CACHED_DATA, level )
;SayString( GetObjectName(SOURCE_CACHED_DATA, level ) )

if ( iTypeCode == WT_DIALOG ) then
let sMessageLong = FormatString( cmsg33_L, GetObjectName(SOURCE_CACHED_DATA, level ) )
ElIf ( iTypeCode == WT_TABCONTROL ) then
let sPageLong = FormatString ( cmsg230_L, GetObjectName(SOURCE_CACHED_DATA, level ) )
EndIf

let level = level - 1;
EndWhile

if ( sMessageLong ) then
SayFormattedMessage(ot_user_requested_information, sMessageLong )
if ( sPageLong ) then
SayFormattedMessage(ot_user_requested_information, sPageLong )
EndIf
EndIf
EndScript

Script ReadCellComment ()
	var string note;
	Let note = GetCellNote()

	If (IsSameScript ()) then
		SayMessage(OT_USER_BUFFER, note)
	Else
		SayString(note)
	EndIf
EndScript

Void Function SpeakTableCells (int tableNavDir, int nPrevNumOfCols)
var object o, int child, int role
let o = GetFocusObject (child);
let role = o.accRole( child );
if ( role != 15 ) then ; document
return
EndIf
SpeakTableCells (tableNavDir, nPrevNumOfCols)
EndFunction

void function SayDocumentPageName()
var
	string message,
	string title,
	string PageName

if ( GetDocumentProperties( title, PageName ) ) then
let message = FormatString ( msg_PageName, PageName )
SayUsingVoice ( VCTX_MESSAGE, message, OT_SCREEN_MESSAGE )
EndIf
EndFunction

void function DocumentPageChangedEvent()
SayDocumentPageName()

if ( IsVirtualPCCursor () ) then
Refresh (1)
JAWSTopOfFile ()
SayLine()
NextLine()
SayAll()
return
EndIf
EndFunction

void function DocumentTextColumnChangedEvent()
var
	string title,
	string PageName,
	string PageNumber,
	string TotalPages,
	string LineNumber,
	string CharacterPosition,
	string ColumnNumber,
	string TotalColumns,
	string message

if ( GetDocumentProperties( title, PageName, PageNumber, TotalPages,
LineNumber, CharacterPosition, ColumnNumber, TotalColumns ) ) then
let message = FormatString ( msg_Column, ColumnNumber )
SayUsingVoice ( VCTX_MESSAGE, message, OT_SCREEN_MESSAGE )
EndIf
EndFunction

void function DocumentTextSectionChangedEvent()
var
	string title,
	string PageName,
	string PageNumber,
	string TotalPages,
	string LineNumber,
	string CharacterPosition,
	string ColumnNumber,
	string TotalColumns,
	string SectionName,
	string message

if ( GetDocumentProperties( title, PageName, PageNumber, TotalPages,
LineNumber, CharacterPosition, ColumnNumber, TotalColumns, SectionName ) ) then
if ( sectionName == gSODCSectionName ) then
	return;
EndIf

if ( sectionName ) then
let message = FormatString ( msg_section, SectionName )
else
let message = msg_OutOfSection
EndIf

let gSODCSectionName = sectionName

SayUsingVoice ( VCTX_MESSAGE, message, OT_SCREEN_MESSAGE )
EndIf
EndFunction

Script SayDocumentPosition ()
var
	string title,
	string PageName,
	string PageNumber,
	string TotalPages,
	string LineNumber,
	string CharacterPosition,
	string ColumnNumber,
	string TotalColumns,
	string SectionName,
	string PageMsg,
	string LineMsg,
	string ColumnMsg,
	string SectionMsg

if ( ! GetDocumentProperties( title, PageName, PageNumber, TotalPages,
LineNumber, CharacterPosition, ColumnNumber, TotalColumns, SectionName ) ) then
	SayUsingVoice ( VCTX_MESSAGE, msg_DocPropError, OT_SCREEN_MESSAGE )
	return;
EndIf

if ( PageName ) then
	let PageMsg = FormatString ( msg_PageInfo, PageName, PageNumber, TotalPages )
SayUsingVoice ( VCTX_PCCURSOR, PageMsg, OT_NO_DISABLE )
EndIf

if ( LineNumber ) then
	let LineMsg = FormatString ( msg_LineInfo, LineNumber, CharacterPosition )
SayUsingVoice ( VCTX_PCCURSOR, LineMsg, OT_NO_DISABLE )
EndIf

if ( SectionName ) then
	let SectionMsg = FormatString ( msg_section, SectionName )
	SayUsingVoice ( VCTX_PCCURSOR, SectionMsg, OT_NO_DISABLE )
EndIf

if ( ColumnNumber ) then
	let ColumnMsg = FormatString ( msg_ColumnInfo, ColumnNumber, TotalColumns )
	SayUsingVoice ( VCTX_PCCURSOR, ColumnMsg, OT_NO_DISABLE )
EndIf
EndScript

Script SayObjectDescription ()
var
string descr,
	int type

let type = GetObjectSubTypeCode(SOURCE_CACHED_DATA)

if ( type == WT_TABLECELL ) then
TypeCurrentScriptKey ()
return;
EndIf

if ( type == WT_MULTILINE_EDIT) then
	let descr = GetEmbeddedObjectDescription()
else
	let descr = GetObjectDescription(SOURCE_CACHED_DATA)
EndIf

if ( descr ) then
SayMessage( OT_NO_DISABLE, descr )
else
SayUsingVoice ( VCTX_MESSAGE, msg_ObjDescError, OT_NO_DISABLE )
EndIf
EndScript

Script DisplayLayerInfo ()
DisplayShapeOverlapInfo()
EndScript

Script SayActiveCursor()
var
	int nPercent,
	string sMessageShort,
	string sMessageLong,
	string sCursorInfoShort,
	string sCursorInfoLong,
	string sRestrictionLong,
	string sRestrictionShort,
	string sPercent,
	int nRestriction,
	string sActiveCursorName,
	string title,
	string PageName,
	string PageNumber,
	string TotalPages,
	string LineNumber,
	string CharacterPosition,
	string ColumnNumber,
	string TotalColumns,
	string PageMsg,
	string LineMsg,
	string ColumnMsg
if ( GetActiveCursor () != CURSOR_PC
|| IsObjectNavigationActive()
|| IsVirtualPCCursor () ) then
	PerformScript SayActiveCursor()
	return
EndIf
if ( ! GetDocumentProperties( title, PageName, PageNumber, TotalPages,
		LineNumber, CharacterPosition, ColumnNumber, TotalColumns ) ) then
	SayUsingVoice ( VCTX_MESSAGE, msg_DocPropError, OT_SCREEN_MESSAGE )
	return;
EndIf
let sActiveCursorName = GetActiveCursorName()
if StringContains(sActiveCursorName,cscFSDomCursorName) then
	if !IsSameScript() then
		let sActiveCursorName = cmsgVirtualPCCursorActive
	else
		PerformScript SayActiveCursor()
		return;
	EndIf
else
	PerformScript SayActiveCursor()
	return;
EndIf
let sCursorInfoLong =
	formatString(cmsgActiveCursorInfo_L,
		sActiveCursorName,
		CharacterPosition,
		LineNumber,
		sRestrictionLong,
		sPercent)
let sCursorInfoShort =
	formatString(cmsgActiveCursorInfo_S,
		sActiveCursorName,
		CharacterPosition,
		LineNumber,
		sRestrictionShort,
		sPercent)
let sMessageShort = sMessageShort+sCursorInfoShort
let sMessageLong = sMessageLong+sCursorInfoLong
sayMessage(OT_USER_REQUESTED_INFORMATION,sMessageLong,sMessageShort)
SayUsingVoice( VCTX_MESSAGE, MSG_ACTIVECURSORHELP, OT_USER_REQUESTED_INFORMATION );
EndScript

Script ReadWordInContext ()
var
	string text
let text = GetWordInContext()

if ( text == "" ) then
SayFormattedMessage (ot_error, cmsg216_L, cmsg216_S) ; "Word in context not found "
return
EndIf

SayMessage (OT_NO_DISABLE, text, text)
EndScript

Void Function DocumentLoadedEvent ()
;SayString("DocumentLoadedEvent")
Refresh ()
SayAll()
EndFunction

Script JAWSPageUp()
if ( IsVirtualPCCursor () ) then
TypeKey (cksPageUp)
return
EndIf

PerformScript JAWSPageUp()
EndScript

Script JAWSPageDown()
if ( IsVirtualPCCursor () ) then
TypeKey (cksPageDown)
return
EndIf

PerformScript JAWSPageDown()
EndScript

int function InNamedDialog( string DlgName, int bExact )
var
int ancestors,
int count,
int continue

let ancestors = GetAncestorCount()
let continue = true
while( count <= ancestors && continue == true )
;SayInteger( GetObjectSubTypeCode(SOURCE_CACHED_DATA, count ) )
if ( GetObjectSubTypeCode(SOURCE_CACHED_DATA, count ) == WT_DIALOG ) then
let continue = false
else
let count = count + 1
EndIf
EndWhile

if ( count > ancestors ) then
return 0
EndIf

if ( bExact ) then
if ( GetObjectName(SOURCE_CACHED_DATA, count ) == DlgName ) then
return count
EndIf
else
if ( StringContains( GetObjectName(SOURCE_CACHED_DATA, count ), DlgName ) ) then
return count
EndIf
EndIf

return 0
EndFunction

int function SayWordInContext()
if ( ! InNamedDialog( wnFindReplace, true ) ) then
return 0
EndIf

var
	string text
let text = GetWordInContext()

if ( text == "" ) then
return 0
EndIf

SayMessage (OT_NO_DISABLE, text, text)
return 1
EndFunction

Script Enter ()
if ( QuickNavKeysOn() ) then
return
EndIf

SayCurrentScriptKeyLabel ()
enterKey()

if ( InNamedDialog( wnFindReplace, True ) ) then
SayWordInContext()
EndIf
EndScript

Script PressFindButton()
SayCurrentScriptKeyLabel ()
TypeCurrentScriptKey ()
SayWordInContext()
EndScript

Script SayAll()
var
	int saved

if ( IsVirtualPCCursor () ) then
let saved = GetJCFOption (OPT_LINE_PAUSES)
SetJCFOption (OPT_LINE_PAUSES, 1)
EndIf

PerformScript SayAll()

if ( IsVirtualPCCursor () ) then
SetJCFOption (OPT_LINE_PAUSES, Saved)
EndIf
EndScript

object function GetSelectedChild( object parent )
if ( ! parent ) then
return 0
EndIf

var
	object o,
	object ret,
	int children,
	int count,
	int continue

let children = parent.accChildCount();
let continue = true

while ( count <= children && continue )
let o = parent.accChild( count );

; if the object has the selected state bit set
if ( o.accState( 0 ) & 2 ) then
let ret = o
let continue = false
EndIf

let count = count + 1
EndWhile

if ( ! ret && children > 0 ) then
let ret = parent.accChild( 1 )
EndIf

return ret
EndFunction

Script ReadMisspelledWordAndSuggestion ()
var
	int DlgAncestor,
	Object o,
object parent,
	int child,
int count,
	string text,
	string word

let dlgAncestor = InNamedDialog( wnSpellcheck, false )
if ( ! dlgAncestor ) then
PerformScript SelectALink()
return
EndIf

let o = GetFocusObject (child);

; we subtract 1 from the dialog ancestor
; so that we end up with the option pane
; which is beneath the dialog
while ( count < dlgAncestor - 1
&& count < 100 )
let o = o.accParent();
let count = count + 1
EndWhile

if ( ! o ) then
SayUsingVoice( VCTX_MESSAGE, msgNotInSpellchecker, OT_JAWS_MESSAGE );
return
EndIf

let parent = o

; find the original word
let o = parent.accChild( 2 )
let o = o.accChild( 1 )

if ( ! o ) then
SayUsingVoice( VCTX_MESSAGE, msgNotInSpellchecker, OT_JAWS_MESSAGE );
return
EndIf

let word = o.accName( 0 )
let text = FormatString ( msgOriginal, word )
Say (text, OT_NO_DISABLE)
SpellString ( word )

; find the child that is the list
let o = parent.accChild( 8 )
let o = o.accChild( 1 )
let o = GetSelectedChild( o )

if ( ! o ) then
SayUsingVoice( VCTX_MESSAGE, msgNoSuggestions, OT_JAWS_MESSAGE );
return
EndIf

; speak the suggestion from the list
let word = o.accName( 0 )
if ( ! word ) then
SayUsingVoice( VCTX_MESSAGE, msgNoSuggestions, OT_JAWS_MESSAGE );
return
EndIf

let text = FormatString( msgSuggestion, word )
Say (text, OT_NO_DISABLE)
SpellString ( word )
EndScript

Script ReadBoxInTabOrder()
var string text, handle hwnd
let hwnd = GetRealWindow (GetFocus())
let text = GetTypeAndTextStringsForWindow( hwnd )
SayMessage ( OT_NO_DISABLE, text )
EndScript

void function SayNextOrPriorSentence()
if IsFormsModeActive()
&& isPcCursor() then
	if getObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_EDIT then
		TurnOffFormsMode ()
	EndIf
endIf
TypeCurrentScriptKey ()
delay(1)
SaySentence ()
EndFunction

int function ShouldMoveBySentence(int moveDir)
if ( ! IsPCCursor ()
|| GetObjectSubtypeCode(SOURCE_CACHED_DATA, 0 ) != WT_MULTILINE_EDIT ) then
	return ShouldMoveBySentence( moveDir )
EndIf

SayNextOrPriorSentence()
return true
EndFunction

Script SayAppVersion ()
var
	object o,
	string sProduct,
	string sVersion,
	string sMessage,
	string sNavModule

let o = GetObject ( "FSDomNodeSymphony.Script" )

if ( ! o ) then
	PerformScript SayAppVersion()
	return;
EndIf

	let sProduct = o.GetAppName
	let sVersion = o.GetAppVersion()
	let sMessage = FormatString (cmsg239_L, sProduct, sVersion)
	let sNavModule = GetNavModuleVersionInfo(GetCurrentWindow())

	; May need to work on some translation here.  Presently,
	; the string is passed back by the actual NavModule and is
	; not subject to translation.
	if (sNavModule != "") then
		let sMessage = sMessage + "\n"
		let sMessage = sMessage + GetNavModuleVersionInfo ((GetCurrentWindow()))
	endif

	if (IsSameScript()) then
		if (UserBufferIsActive()) then
			UserBufferDeactivate()
		endif
		SayFormattedMessage(OT_USER_BUFFER, sMessage)
	else
		SayFormattedMessage(ot_help, sMessage)
	endif
EndScript

Script SayColor()
var object o, int type
let o = GetObject ("FSDomNodeSymphony.Script")
let type = GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0 )

if ( ! IsPCCursor()
|| ! o
|| type != WT_MULTILINE_EDIT ) then
performScript SayColor()
return
EndIf

var int foreground, int background, int i

if ( o.GetTextColor( intref( foreground), intref( background  ) ) ) then
;SayInteger(color)
;SayInteger(background)

var
int bSpeakRGB,
string textColorName,
string backgroundColorName,
string sMessage

if IsSameScript() then
	let bSpeakRGB=TRUE
else
	let bSpeakRGB=FALSE
endIf

if bSpeakRGB then
	let textColorName=ColorToRGBString( foreground )
	let backgroundColorName=ColorToRGBString( background )
else
	let textColorName=StringMixedCaseToMultiword(GetColorName( foreground ))
let backgroundColorName=StringMixedCaseToMultiword(GetColorName( background ))
endIf

let sMessage=FormatString(cmsgColorInfo,textColorName,backgroundColorName)
SayMessage(OT_USER_REQUESTED_INFORMATION,sMessage)
return
Endif

performScript SayColor()
EndScript

Void Function listHeadings()
if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf

If !dlgListOfHeadings() then
 SayMessage(ot_error,msgNoHeadings_l,msgNoHeadings_s)
EndIf
EndFunction

Script JawsBackspace()
if ( QuickNavKeysOn() ) then
return
EndIf

PerformScript JawsBackspace()
EndScript

Script JawsDelete()
if ( QuickNavKeysOn() ) then
return
EndIf

PerformScript JawsDelete()
EndScript

Script Tab()
if ( QuickNavKeysOn() ) then
return
EndIf

PerformScript Tab()
EndScript

Script ShiftTab()
if ( QuickNavKeysOn() ) then
return
EndIf

PerformScript ShiftTab()
EndScript

Void Function SayCharacterUnit (int UnitMovement)
var
	int TheTypeCode,
	handle hCurrentWindow,
	string sClass,
	string sMessage,
	int ioSubType
if IsLeftButtonDown()
|| IsRightButtonDown() then
	SelectingText(TRUE)
	pause ()
	SelectingText(false)
	return
endIf

if !IsPCCursor() then
	SayCharacter(true)
	return
endIf
let hCurrentWindow = GetCurrentWindow()
let TheTypeCode = GetWindowSubTypeCode (hCurrentWindow)
If !TheTypeCode then
	Let TheTypeCode = GetObjectSubTypeCode ()
EndIf
let ioSubType = GetObjectSubTypeCode(SOURCE_CACHED_DATA)
if (TheTypeCode == WT_TASKBAR && ioSubType == WT_TABCONTROL) ; windows 2000 task bar
|| TheTypeCode == WT_UPDOWNSLIDER
|| TheTypeCode == WT_LEFTRIGHTSLIDER then
	SayWord()
	return
endIf
if CaretVisible() then
	if (theTypeCode==WT_SHAPE) then
		return
	EndIf
	AnnounceLink(false)
	SayCharacter(true)
	Return
EndIf
;For ARIA grids in Forms or Application Mode when no caret visible:
if ioSubType == WT_TABLECELL
|| ioSubType == WT_ROWHEADER then
	;ActiveItemChangedEvent will speak the cell.
	;set whether the header should be spoken by ActiveItemChangedEvent:
	if GetJCFOption (optTableIndication)
	&& (GITblHeaders == TBL_HEADER_COL || GITblHeaders == TBL_HEADER_BOTH) then
		let globalSpeakHeaderOnCellChange = TABLE_NAV_HORIZONTAL
	EndIf
endIf
EndFunction

Script ReadCurrentRow ()
say(GetRowText (cscSpace, cscNull, cscNull),OT_LINE)
EndScript

Script ReadCurrentColumn ()
say(GetColumnText (cscSpace, cscNull, cscNull),OT_LINE)
EndScript


Script DeleteWord ()
if QuickNavKeysOn() then
	return
EndIf
; delete current word and speak the word the PC cursor lands on.
TypeKey (ksDeleteWord) ; CtrlDel in English
PCCursor ()
SayWord ()
EndScript


Script SelectPriorParagraph ()
if ( IsTableCell() == 1 ) then
	TypeKey(cksSelectPriorParagraph)
	;SayCell();
	return;
EndIf
Let nSaySelectAfter = TRUE
SelectingTextByParagraph(TRUE)
TypeKey(cksSelectPriorParagraph)
SelectingTextByParagraph(FALSE)
Let nSaySelectAfter = FALSE
EndScript

Script SelectNextParagraph ()
if ( IsTableCell() == 1 ) then
	TypeKey(cksSelectNextParagraph)
	;SayCell();
	return;
EndIf
Let nSaySelectAfter = TRUE
SelectingTextByParagraph(TRUE)
TypeKey(cksSelectNextParagraph)
SelectingTextByParagraph(FALSE)
Let nSaySelectAfter = FALSE
EndScript

Void Function SelectingTextByParagraph (int nMode)
; handles setting up for and finishing the process of selecting text
; called by each of the scripts which does text selection
var
	string strHighlightAfterSelect,
	string strUnselected,
	string strNewlySelected,
	int nChanged,
	int nStart,
	int nChars,
	int nLen,
	int OT,
	int nLeft,
	int nTop,
	int nRight,
	int nBottom
;OT should be Word unless selecting by char so that each unit selected doesn't have its case indicated unless the
;user has requested the indication for Words
let OT=OT_WORD
if nMode then
	let g_strHighlightBeforeSelect = GetSelectedText()
	let nSelectingText = nMode
else
	delay(1)
	ProcessNewText()
	let nSelectingText = 0
	if IsVirtualPCCursor()
	&& IsJavaWindow (GetFocus ()) == FALSE then
		return
	endIf
	let strHighlightAfterSelect = GetSelectedText()
	let	strUnselected = StringDiff(g_strHighlightBeforeSelect,strHighlightAfterSelect)
	if strUnselected then
		; if there's highlighted text prior to the selection command that
		; doesn't exist after the command, this is either because the command
		; deselected the text or the text scrolled off of the screen.
		; We assume that if the text was at the beginning of the old buffer
		; and it isn't in the new buffer, then it scrolled off.
		; This should be true except when selecting text from bottom to top,
		; and deselecting from top to bottom,
		;something that most people probably don't do
		if ! StringsOverlap(g_strHighlightBeforeSelect,strHighlightAfterSelect,nStart,nChars)
		|| nStart<2 then
			if stringLength(strUnSelected)==1 then
			;use OT_CHAR for single characters so case is indicated
				let OT=OT_CHAR
			endIf
			If nSaySelectAfter then
				SayMessage(OT,strUnSelected)
				SayMessage(OT_SELECT, cmsg214_L)
			Else
				SayMessage(OT_SELECT, cmsg214_L)
				SayMessage(OT, strUnSelected)
			EndIf
			let nChanged = nChanged+1
		endIf
	endIf
	let strNewlySelected = StringDiff(strHighlightAfterSelect,g_strHighlightBeforeSelect)
	if (strNewlySelected) then
		if stringLength(strNewlySelected)==1
			|| (stringLength(strNewlySelected)<=3 && stringContains(strNewlySelected,"\r")) then
			;use OT_CHAR for single characters so case is indicated
			let OT=OT_CHAR
		endIf
		If nSaySelectAfter then
			SayMessage (OT, strNewlySelected)
			SayMessage (OT_SELECT, cmsg215_L)
		Else
			SayMessage (OT_SELECT, cmsg215_L)
			SayMessage (OT, strNewlySelected)
		EndIf
		let nChanged = nChanged+1
	endIf
	if (!nChanged) then
		;screen probably scrolled
		let nLen=stringLength(strHighlightAfterSelect)
		if (StringsOverlap(g_strHighlightBeforeSelect,strHighlightAfterSelect,nStart,nChars))then
			let strNewlySelected =  stringRight(strHighlightAfterSelect,nLen-nChars)
			let nLen=stringLength(strNewlySelected)
			; Fixes track defect 20059 and related entries
			; string contained a newline char causing the word blank or a newline to be
			;indicated prior to speaking the newly selected text
			if stringLeft(strNewlySelected,1)==cScBufferNewLine && nLen > 1 && substring(strNewlySelected,2,1) !=cScBufferNewLine then
				let strNewlySelected=stringChopLeft(strNewlySelected,1)
				let nLen=nLen-1;
			endIf
			if nLen==1 then
				;use OT_CHAR for single characters so case is indicated
				let OT=OT_CHAR
			endIf
			If nSaySelectAfter then
				SayMessage (OT, strNewlySelected)
				SayMessage (OT_SELECT, cmsg215_L)
			Else
				SayMessage (OT_SELECT, cmsg215_L)
				SayMessage (OT, strNewlySelected)
			EndIf
		else
		; strings didn't overlap, just speak the current line as being selected
			if GetItemRect (GetCursorCol(), GetCursorRow(), nLeft, nRight, nTop, nBottom, it_Line) then
				let strNewlySelected=GetTextInRect (nLeft, nTop, nRight, nBottom, attrib_Highlight, ignoreColor, ignoreColor, FALSE, FALSE)
			else
				let strNewlySelected=getLine()
			endIf
			let OT=OT_WORD
			if stringLength(strNewlySelected)==1 then
				let OT=OT_CHAR
			endIf
			If nSaySelectAfter then
				SayMessage (OT, strNewlySelected)
				SayMessage (OT_SELECT, cmsg215_L)
			Else
				SayMessage (OT_SELECT, cmsg215_L)
				SayMessage (OT, strNewlySelected)
			EndIf
		endIf
	endIf
endIf
EndFunction


Int Function AnnounceLink (int forceAnnouncement)
var
	int type,
	object o,
	int announcedLink
let announcedLink = false

;in documents we want to announce the link type and name when moving from link to link
let type = GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0 );
let o = GetCurrentObject (0)
if (type==WT_MULTILINE_EDIT && o.accstate(0)&STATE_SYSTEM_LINKED ) then ; currently in a link
	var
		string linkText
	let linkText = o.AccValue(0)
	if (forceAnnouncement || (StringIsBlank (gSODCPreviousLinkText ) == false && StringCompare (gSODCPreviousLinkText , linkText, true) != 0)) then ;previously in a different link
		let announcedLink = true
		IndicateControlType (WT_LINK, linkText," ")
	EndIf
	let gSODCPreviousLinkText = linkText
else
	let gSODCPreviousLinkText = ""
EndIf
return announcedLink
EndFunction

Script SaySelectedText()
var
	int StartRow,
	int StartCol,
	int EndRow,
	int EndCol,
	string StartName,
	string EndName,
	string sMessageLong

if ( GetTableSelectionRange( StartRow, StartCol, StartName, EndRow, EndCol, EndName )
	&& !(StringIsBlank (startName) && StringIsBlank (endName))) then
	let sMessageLong = FormatString( cmsgSelectedCells_L, StartName, EndName )
	sayFormattedMessage( ot_user_requested_information,sMessageLong )
	return
EndIf

PerformScript SaySelectedText()
EndScript


Int Function BrailleAddObjectValue (int subtypeCode)
if (subtypeCode==WT_SHAPE) then
	BrailleAddString (GetObjectValue(SOURCE_CACHED_DATA, 0), 0, 0, 0, true)
	return true
EndIf

return BrailleAddObjectValue (subtypeCode)
EndFunction


int Function BrailleBuildLine()
var
	int subtype,
	int state,
	object o

let subtype = GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0 );
let o = GetCurrentObject (0)
let state = o.accstate(0)
if (subtype==WT_MULTILINE_EDIT && state&STATE_SYSTEM_LINKED ) then ; currently in a link
	var
		string linkText
	let linkText = o.accvalue( 0)
	BrailleAddString (linkText, 0, 0, 0, false)
	BrailleAddString (BrailleGetSubtypeString (WT_LINK), 0, 0, 0, false)
	return true
EndIf
return BrailleBuildLine ()
EndFunction
