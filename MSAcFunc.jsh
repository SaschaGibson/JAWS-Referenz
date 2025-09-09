; JAWS 7.0 Microsoft Access Script Header File
; Copyright 2010-2015 by Freedom Scientific, Inc.
; Originally written by Joseph K Stephen.
; Build 7.00.001   04/19/05 DBrown

; constants and globals applicable to Microsoft Access 97, 2000, XP, and 2003

Globals
; next two globals used for position of radio buttons on forms in import wizard:
Int giPos,
int giCount,
object OAccess,
; next globals used to save inefficient recalculation of form control details
object GlobalControl, ; used for Braille support
object GlobalPriorControl,
int onMainForm ; used when detecting transition from form to subform and vice versa

const
MSAccessIde="{73A4C9C1-D68D-11D0-98BF-00A0C90DC8D9}",
AccessAppObj="access.application",
kiMacroPropertyVertDist=80,
kiTblPropertyVertDist=100,
; currentView property of form object:
formDesignView=0,
formFormView=1,
formDatasheetView=2,
;Constant offset for BrailleCallbackObjectIdentify and Braille related functions
CtlOffset=99, ; subtract 99 from activeControl.controlType to get Custom Control lookup
; constants for control types from object browser
acLabel=100, ;	Label
acRectangle=101, ;	Rectangle
acLine=102, ;	Line
acImage=103, ;	Image
acCommandButton=104, ;	Command button
acOptionButton=105, ;	Option button
acCheckBox=106, ;	Check box
acOptionGroup=107, ;	Option group
acBoundObjectFrame=108, ;	Bound object frame
acTextBox=109, ;	Text box
acListBox=110, ;	List box
acComboBox=111, ;	Combo box
acSubform=112, ;	Subform/subreport
acObjectFrame=114, ;	Unbound object frame or chart
acPageBreak=118, ;	Page break
acPage=124, ;	Page
acCustomControl=119, ;	ActiveX (custom) control
acToggleButton=122, ;	Toggle button
acTabCtl=123, ;	Tab
; constants for DB object types from object browser
acForm = 2,
acMacro = 4,
acModule = 5,
acQuery = 1,
acReport = 3,
acTable = 0,
; section constants from object browser
acDetail=0,
acHeader=1,
acFooter=2,
acPageHeader=3,
AcPageFooter=4,
AcGroupLevel1Header=5,
AcGroupLevel1Footer=6,
AcGroupLevel2Header=7,
AcGroupLevel2Footer=8,
; Field Type constants from Object browser
dbAutoNumber=0, ; "Auto number", ; not in object browser
dbBigInt=16, ; "Big integer",
DbBinary=9, ; "Binary",
DbBoolean=1, ; "Boolean",
dbByte=2, ; "Byte",
dbChar=18, ; "Char",
dbCurrency=5, ; "Currency",
dbDate=8, ; "Date/Time",
dbDecimal=20, ; "Decimal",
dbDouble=7, ; "Double",
dbFloat=21, ; "Float",
dbGid=15, ; "Gid",
dbInteger=3, ; "integer",
dbLong=4, ; "Long",
dbLongBinary=11, ; "Long Binary",
dbMemo=12, ; "Memo",
dbNumeric=19, ; "Numeric",
dbSingle=6, ; "Single",
dbText=10, ; "Text",
dbTime=22, ; "Time",
dbTimeStamp=23, ; "Time Stamp",
dbVarBinary=17 ; "Var Binary"
