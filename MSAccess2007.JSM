;Copyright 1995-2015 Freedom Scientific, Inc.
;JAWS 11.00.xx
;Microsoft Access 2007 Script Message file

const
;script key name:
		skn_OpenListbox="OpenListbox",
;string compares:
	scDsgnFieldName="names",
	scDsgnDataType="data types",
	scDsgnDescription="field description",
	scView="view", ; for checking status bar for view type.
;spellchecker:
	scNoSuggestions="No Suggestions",
;String constant for Security warning:
;See this in Access 2007 | Northwind 2007 database,
;On Message bar where presented with the Options ...button, in which you can enable content.
	sc_Security = "Security Warning",
; Window Names
wn_ReportWizard = "Report Wizard",
wn_Spelling = "Spelling:",
wn_Wizard = "Wizard",
;The following View Names are strings for JAWS,
;Names  given by us, do not appear on screen:
	wn_DesignView = "Design",
	wn_FormView = "Form",
	wn_DataSheetView = "Data sheet",
	wn_PivotTableView = "Pivot Table",
	wn_PivotChartView = "Pivot Chart",
	wn_PreviewView = "Preview",
	wn_ReportView = "Report",
	wn_LayoutView = "Layout",
scHotkeyMarker="&",
scTilde= "~",
scFormPrefix= "frm",
scMSys= "MSys",
scEngine= "engine",
; section names corresponding to relevant constants eg acDetail, etc
scAcDetail="detail",
scAcHeader="header",
scAcFooter="footer",
scAcPageHeader="page header",
scAcPageFooter="page footer",
scAcGrpLvl1hdr="group level 1 header",
scAcGrpLvl2hdr="group level 2 header",
scAcGrpLvl1ftr="group level 1 footer",
scAcGrpLvl2ftr="group level 2 footer",
; Menu options required for Commandbar searching.
scMnuView="View",
scOptDesignView="Design View",
scOptDatasheetView="Datasheet View",
scOptSQLView="SQL View",
scOptFormView="Form View",
scOptPivotTableview="Pivot Table View",
scOptPivotChartView="Pivot Chart View ",
scOptPreviewView ="Preview View",
scOptReportView="Report View ",
scOptLayoutView="Layout View",
; label control identifiers for Wizards and other controls for which correct labels are not found
scLblCtl0 = "GrpPk",
scLblCtl1="text531",
scLblCtl2 = "GrpRelType",
scLblCtl3="LblRelTbl",
scLblCtl4 = "GrpFinishView",
scLblCtl5 = "GrpQrySummarize",
scLblCtl6 = "TbTableName",
scLblCtl7 = "TbPane0",
scLblCtl8="lblfr0",
scLblCtl9 = "GrpOpenMode",
scLblCtl10="lblfr8",
scLblCtl11 = "CBHelpCard",
scLblCtl12="lblfr6",
scLblCtl13 = "LstRecSrcs",
scLblCtl14="Text162",
scLblCtl15 = "LstColHdrs",
scLblCtl16="text164",
scLblCtl17 = "TbQryName",
scLblCtl18="text161",
scLblCtl19 = "OgOpenMode",
scLblCtl20="text507",
scLblCtl21="Label179",
scLblCtl22="layout",
scLblCtl23 = "cboSortExpr",
scLblCtl24 = "btnSortDesc",
scLblCtl25 = "LstStyles",
scLblCtl26 = "Frui_FrmPageStyles",
scLblCtl27="lblStylePrompt",
scLblCtl28="LblLstStyles",
scLblCtl29 = "grpPaneContent0",
scLblCtl30="text150",
scLblCtl31 = "lblRowHdr",
scLblCtl32 = "lblColHdr",
scLblCtl33="label1",
scLblCtl34="text517",
scLblCtl35 = "lstSelFlds",
; tables and queries gotten from TableDefs and queryDefs collections
scIgnoredContainers="Tables SysRel",
scCommon3CharPrefixes="lstcbotxtgrplblfrmbtn" ,; used to eliminate prefixes when control name is used as control label.




;UNUSED_VARIABLES

;Keystrokes
	ksDeleteRelationship="Control+Delete",
	ksPriorCell="Alt+Control+LeftArrow",
	ksNextCell="Alt+Control+RightArrow",
	ksFirstCell="Alt+Control+Home",
	ksLastCell="Alt+Control+End",
	ksUpCell="Alt+Control+UpArrow",
	ksDownCell="Alt+Control+DownArrow",
wn_MemoForm="memo : Form",
wn_ExpressionBuilder="Expression Builder",
wn_MSAccess="Microsoft Access",
wn_import = "Import",
wn_link = "Link",
wn_new = "File New Database",
wn_convert = "Convert Database Into",
wn_save_mde = "Save MDE As",
wn_export = "Export",
wn_encrypt = "Encrypt/Decrypt Database",
wn_customise = "Customize",
wn_query="Query",
wn_ShowTable = "ShowTable",
wn_AvailableFields = "Available Fields",
wn_SelectedFields = "Selected Fields",
wn_EnterParameterEdit = "Dal=on",
wn_SubPage = "subPAGE",
scMag1 = "magsetfocus",
scMag2 = "getlinerect",
scSection="Section:",
scFormat="Format",
scForm = "Form",
scQuery = "Query",
scReport = "Report",
scTable = "Table",
scAvail = "Avail",
scSel = "Sel",
scMnuDbObj="Database Objects",
scOptClose="Close",
scOptFile="File",
scNotSelected="not selected" ; used to test result of getObjectValue in open/save as listview

;END_OF_UNUSED_VARIABLES

messages
@msgHlp1_L
This is the Database Window.
You are focused on the Database Objects toolbar.
To select a button, use the arrow keys and then press Enter.
You will then be focused on a listview of options relevant to the toolbar button selected.
@@
@msgHlp1_S
Database Window
Database Objects toolbar
select a button, use arrow keys and press Enter
@@
@msgHlp2_L
This is the Database Window.
You are focused on the Groups toolbar
To select a button, use the arrow keys and then press Enter.
You will then be focused on a listview of options relevant to the toolbar button selected.
@@
@msgHlp2_S
Database Window
Groups toolbar
select a button, use arrow keys and press Enter
@@
;for msgHlp3_L/S, %1=dialog page title, eg tables page, queries page, etc.
;This is obtained from the commandbar option called View Database Objects, The checked option was
;deemed to be the active page in Access 97 but is no longer the case.
;(note that we no longer include this: the word page is returned as part of the page name, eg Tables page).
@msgHlp3_L
This is the Database Window.
Move to the Database Objects toolbar TO see WHICH BUTTON IS SELECTED.
You may need to use the arrow keys to determine which button is checked.
@@
@msgHlp3_S
Database Window.
Move to the Database Objects toolbar
You may need to use arrow keysTo determine which is checked.
@@
;for msgHlp4_L/S, %1=Wizard Form title, eg Tables Wizard etc.
@msgHlp4_L
This is the  %1.
To move from control to control, use Tab and Shift Tab.
To Read the Wizard form use  %KeyFor(readBoxInTabOrder).
You may also use form hotkeys to select options directly.
@@
@msgHlp4_S
%1.
move from control to control, Tab and Shift Tab
Read Wizard form %KeyFor(readBoxInTabOrder)
@@
@msgHlp5_L
This is the Table Design View.
To switch between the definition and properties panels use f6.
@@
@msgHlp5_S
Table Design View
switch between definition and properties panels f6
@@
@msgHlp6_L
This is the Query Design View.
To place the selected listbox item on the grid press Enter.
To switch between the listboxes and the grid use f6.
To move between the listboxes or between fields on the grid use Tab and Shift Tab.
Ensure the application window is maximised so that field prompts are read in the grid.
To begin creating a join use %KeyFor(CreateJoin).
Press this key combination again once on the destination field to create the join.
To cancel a join initialization use %KeyFor(RelAndJoinClearValues).
@@
@msgHlp6_S
Query Design View
place selected listbox item on grid press Enter
switch between listboxes and the grid f6
move between listboxes or between fields on grid Tab and Shift Tab
begin creating join %KeyFor(CreateJoin)
Press key combination again once on destination field to create join
To cancel join initialization %KeyFor(RelAndJoinClearValues)
@@
;for msgHlp7_L/S, %1=query title (obtained from the real window name, eg Sales Query)
@msgHlp7_L
This is the Query Datasheet View.
It contains the results of the %1.
To review the data, use arrow keys or Tab and Shift Tab.
@@
@msgHlp7_S
Query Datasheet View
%1
review data, arrow keys or Tab and Shift Tab
@@
@msgHlp8_L
This is the Query SQL View.
This is an edit field which contains the text of the SQL code.
You may enter or edit the code using standard editing keys.
@@
@msgHlp8_S
Query SQL View
edit field contains text of SQL code
enter or edit code using standard editing keys.
@@
@msgHlp9_L
This is the Form Design view.
Tab to the section you wish to add controls to.
To select a toolbox control to add to this section use %KeyFor(SelectToolboxControl).
To set properties for a control, ensure that the format (form/report) toolbar is visible
by selecting it from the View/Toolbars menu.
Then, press alt to activate the menuBar and control+tab to the toolbars.
if there are more than one toolbars visible then you may have to press control+tab several times.
Once you have found the object combo on the format (form/report) toolbar,
select the control whose properties you want to set.
Finally, choose properties from the View Menu.
You can also press Enter and a multiPage dialog will appear where you can set section properties.
@@
@msgHlp9_S
Form Design view
Tab to section you wish to add controls to
select toolbox control to add to section %KeyFor(SelectToolboxControl)
set properties for control, ensure that format (form/report) toolbar is visible
by selecting it from the View/Toolbars menu.
press alt to activate menu and control+tab to the toolbars.
Once you have found the object combo on the format (form/report) toolbar,
select control whose properties you want to set
choose properties from the View Menu
You can also press Enter and a multiPage dialog will appear where you can set section properties
@@
@msgHlp10_L
This is the Form View
To move from control to control use Tab and Shift Tab.
To switch panels (where appropriate) use f6.
To close this form use control+f4.
@@
@msgHlp10_S
Form View
move from control to control Tab and Shift Tab
switch panels F6
close form control+f4
@@
@msgHlp11_L
This is the Form Datasheet View.
To move from control to control use Tab and Shift Tab.
To close this form use control+f4.
@@
@msgHlp11_S
Form Datasheet View
move from control to control Tab and Shift Tab
close form control+f4
@@
@msgHlp12_L
To read form in control order use %KeyFor(ReadBoxInTabOrder)
To set focus on a particular control use %KeyFor(SelectFormControl).
to toggle label search on and off use %KeyFor(ToggleLabelSearch).
@@
@msgHlp12_S
read form in control order %KeyFor(ReadBoxInTabOrder)
set focus on control %KeyFor(SelectFormControl)
toggle label search %KeyFor(ToggleLabelSearch)
@@
@msgHlp13_L
This is the Report Design View.
Tab to the section you wish to add controls to.
To select a toolbox control to add to this section use %KeyFor(SelectToolboxControl).
To set properties for a control, ensure that the format (form/report) toolbar is visible
by selecting it from the View/Toolbars menu.
Then, press alt to activate the menuBar and control+tab to the toolbars.
if there are more than one toolbars visible then you may have to press control+tab several times.
Once you have found the object combo on the format (form/report) toolbar,
select the control whose properties you want to set.
Finally, choose properties from the View Menu.
You can also press Enter and a multiPage dialog will appear where you can set section properties.
@@
@msgHlp13_S
Report Design view
Tab to section you wish to add controls to
select toolbox control to add to section %KeyFor(SelectToolboxControl)
set properties for control, ensure that format (form/report) toolbar is visible
by selecting it from the View/Toolbars menu.
press alt to activate menu and control+tab to the toolbars.
Once you have found the object combo on the format (form/report) toolbar,
select control whose properties you want to set
choose properties from the View Menu
You can also press Enter and a multiPage dialog will appear where you can set section properties
@@
@msgHlp14_L
This is a report.
To read the active report use %KeyFor(ReadActiveReport).
@@
@msgHlp14_S
read active report %KeyFor(ReadActiveReport)
@@
;for msgHlp15_L/S, %1=table name, eg Contacts Table
@msgHlp15_L
This is the %1 Datasheet view.
To hear dataSheet coordinates use %KeyFor(readDatasheetCoordinates).
To move from field to field use Tab and Shift Tab.
@@
@msgHlp15_S
%1 Datasheet view
dataSheet coordinates %KeyFor(readDatasheetCoordinates)
move from field to field Tab and Shift Tab
@@
@msgHlp17_L
This is the Relationships Window.
It contains a listbox of fields for each table displayed.
To move between the listboxes use Tab and Shift Tab.
If a field references or is referenced by another table, you will hear the relationship when the field is selected.
To act upon any field, such as to create a relationship, etc., use the Context menu or ribbons. There are no %product%-specific special keystrokes for these functions as they are readily available in Access 2007 and above.
@@
@msgHlp17_S
Relationships Window
It contains a listbox of fields for each table displayed.
move between listboxes Tab and Shift Tab
begin creating relationship %KeyFor(CreateRelationship)
Press key combination again once located in destination table on destination field to create relationship
cancel relationship initialization %KeyFor(relAndJoinClearValues)
delete selected relationship %KeyFor(deleteRelationship)
Note: If you delete a relationship you will need to close and reopen the Relationships window.
The screen is not updated by this keystroke.
@@
@msgHotkeyHlp1_L
Hot Keys are as follows:
File Name use Alt n
Files of Type use Alt t
Look In use Alt i
Open use alt o
@@
@msgHotkeyHlp1_S
File Name Alt n
Files of Type Alt t
Look In Alt i
Open alt o
@@
@msgHotkeyHlp2_L
Back use Alt 1
Up One Level use Alt 2
Search The Web use Alt 3
Create A New Folder use Alt 5
Cancel use Escape
Tools use Alt L
@@
@msgHotkeyHlp2_S
Back Alt 1
Up One Level Alt 2
Search The Web Alt 3
Create A New Folder Alt 5
Cancel Escape
Tools Alt L
@@
@msgHotkeyHlp3_L
Hot Keys are as follows:
Save in use Alt i
Save use Alt s
File Name use Alt n
Save AS Type use Alt t
@@
@msgHotkeyHlp3_S
Save in Alt i
Save Alt s
File Name Alt n
Save AS Type Alt t
@@
@msgHotkeyHlp5_L
To read data sheet coordinates, press %KeyFor(ReadDataSheetCoordinates).
To say a record number, press %KeyFor(SayRecordNumber).
To say the current Access version number, press %KeyFor(SayAppVersion).
@@
@msgHotkeyHlp5_S
Data sheet coordinates, %KeyFor(ReadDataSheetCoordinates).
Record number, press %KeyFor(SayRecordNumber).
Access version number, press %KeyFor(SayAppVersion).
@@
; for msgItemNumber, %1=current index, %2=item count, eg 1 of 3.
@msgItemNumber1
%1 of %2
@@
; for msgDialogPage, %1=dialog page name (extracted from the commandbar controls collection for the Database Objects menu.
;for msgSubform1/msgForm1, %1=name of form or subform
@msgSubform1
%1 subform
@@
; for msgListItem1, %1, %2 and %3 are three optional parts of each list item to display.
;This is used for listing controls on a form.
;eg controlName, controlCaption, controlText
@msgListItem1
%1 %2 %3
@@
;for msgCantFocus1_L/S, %1=control name which is disabled and hence can't have focus set to it.
@msgCantFocus1_L
cannot set focus to %1 as it is either disabled or invisible.
@@
@msgCantFocus1_S
cannot set focus to %1 as it is either disabled or invisible.
@@
@msg1_L
Not in spell checker
@@
@msg8_L
Select no parent if you do not want to select a parent control.
@@
@msg9_L
Select Parent Control
@@
@msgNoParentOption1
no parent
@@
@msg11_L
Select a form control
@@
@msg12_L
not in form view
@@
@msg15_L
 (disabled)
@@
@msg16_L
Label search off
@@
@msg16_S
off
@@
@msg17_L
Label search on
@@
@msg17_S
on
@@
@msg18_L
Not on a form.
@@
;for msg21_L/S, %1=database name, eg NWind.mdb
@msg21_L
The database name is %1
@@
@msg21_S
database %1
@@
;for msg22_L/S, %1=container name, eg databases, forms, relationships, etc.
@msg22_L
The %1 defined are:
@@
@msg22_S
%1 defined:
@@
@msg23_L
The tables defined are:
@@
@msg23_S
tables defined:
@@
@msg24_L
The queries defined are:
@@
@msg24_S
queries defined:
@@
;for msg25_L/S, %1=number of modules defined, eg 3 in total.
@msg25_L
%1 in total.
@@
@msg25_S
%1 in total.
@@
@msg26_L
There is no database information available.
@@
@msg26_S
no database information available
@@
;for msg27_L/S, %1=field name, %2=table name, %3=data type,
;%4=field size (eg 25 characters or dynamic),
;%5=ordinal position, %6=field count in table definition,
;%7=optional or required (depending on whether data in this field is optional or required).
@msg27_L
This is the %1 field in the %2 table.
The datatype is %3.
Its size is %4.
				  The ordinal position is %5 out of a total of %6 fields.
Data in this field is %7.
@@
@msg27_S
%1 field in %2 table
datatype %3
size %4
%5 of %6 fields.
%7.
@@
;for msg28_L/S, %1=table name, %2=number of fields in each table record
@msg28_L
Table %1 has %2 fields.
@@
@msg28_S
%1 has %2 fields
@@
;for msg29_L/S, %1=field name, %2=field data type, %3=field size
;for %3, size can be either X characters or dynamic.
@msg29_L
Name %1, Type %2, size %3
@@
@msg29_S
%1, %2, %3
@@
;for msg30_L, %1=table name, this is used to name the id field of a table which by default isn't given a name
@msg30_L
%1 ID
@@
@msg31_L
No table information available.
@@
@msg31_S
No table information available.
@@
@msg32_L
dynamic
@@
;for msg33_L, %1=number of characters in field ie field size
@msg33_L
%1 characters
@@
@msg34_L
required
@@
@msg35_L
optional
@@
;for msg36_L/S, %1=control programmatic name, %2=label programmatic name,
;%3=section name where control and optional label were created.
;This is used when adding controls to a form or report when a label is created
;along with the control.
@msg36_L
%1 control and %2 label created in section %3.
@@
@msg36_S
%1 and %2 created in %3
@@
;for msg37_L/S, %1=control programmatic name, %2=section where control was created.
;This is used when adding controls to a form or report when a label is not
;created for the control.
@msg37_L
%1 control created in section %2.
@@
@msg37_S
%1 created in %2
@@
@msg38_L
no control created.
@@
@msg39_L
Select a Toolbox Control
@@
@msg40_L
Not in report or form design view.
@@
;for msg44_L, %1=referenced field name, %2=referenced table name, %3=referencing table name
@msg44_L
%1 in table %2 is referenced by the %3 table.
@@
;for msg44_S, %1=referenced field name, %2=referencing table name
@msg44_S
%1 is referenced by %2 table
@@
;for msg45_L, %1=referencing field name, %2=referencing table name, %3=referenced table name
@msg45_L
%1 in table %2 references the %3 table.
@@
;for msg45_S, %1=referencing field name, %2=referenced table name
@msg45_S
%1 references %2 table
@@
@msg53_L
Microsoft Access 2007
@@
@msgAccess2010
Microsoft Access 2010
@@
@msgAccess2013
Microsoft Access 2013
@@
@msgAccess2013Plus
Microsoft Access
@@
@msg54_L
zero items
@@
; button and other ole control states
@msg55_L
Pressed
@@
@msg56_L
Selected
@@
@msg57_L
Not selected
@@
; Field DataType descriptions
@msgDbBigInt1
Big integer
@@
@msgDbBinary1
Binary
@@
@msgDbBoolean1
Boolean
@@
@msgDbByte1
Byte
@@
@msgDbChar1
Char
@@
@msgDbCurrency1
Currency
@@
@msgDbDate1
Date/Time
@@
@msgDbDecimal1
Decimal
@@
@msgDbDouble1
Double
@@
@msgDbFloat1
Float
@@
@msgDbGid1
Gid
@@
@msgDbInteger1
integer
@@
@msgDbLong1
Long
@@
@msgDbLongBinary1
Long Binary
@@
@msgDbMemo1
Memo
@@
@msgDbNumeric1
Numeric
@@
@msgDbSingle1
Single
@@
@msgDbText1
Text
@@
@msgDbTime1
Time
@@
@msgDbTimeStamp1
Time Stamp
@@
@msgDbVarBinary1
Var Binary
@@
; unknown made up by me, not in object browser of VBA
@msgDbUnknown1
unknown
@@
; msgDbAutonumber made up by me, not in object browser
@msgDbAutoNumber1
Auto number
@@
; control types corresponding to acControlType constants
@msgTxtAcLabel1
Label
@@
@msgTxtAcRectangle1
Rectangle
@@
@msgTxtAcLine1
Line
@@
@msgTxtAcImage1
Image
@@
@msgTxtAcCommandButton1
Command Button
@@
@msgTxtAcCommandButtonSpeech1
Button
@@
@msgTxtAcOptionButton1
Option Button
@@
@msgTxtAcOptionButtonSpeech1
Radio Button
@@
@msgTxtAcCheckBox1
Check box
@@
@msgTxtAcOptionGroup1
Option Group
@@
@msgTxtAcOptionGroupSpeech1
Group Box
@@
@msgTxtAcBoundObjectFrame1
Bound object frame
@@
@msgTxtAcTextBox1
Text box
@@
@msgTxtAcTextboxSpeech1
Edit
@@
@msgTxtAcListBox1
List box
@@
@msgTxtAcComboBox1
Combo box
@@
@msgTxtAcSubform1
SubForm
@@
@msgTxtAcObjectFrame1
Unbound object frame or chart
@@
@msgTxtAcPageBreak1
Page break
@@
@msgTxtAcPage1
Page
@@
@msgTxtAcCustomControl1
ActiveX (custom) control
@@
@msgTxtAcToggleButton1
Toggle button
@@
@msgTxtAcTabCtl1
Tab Control
@@
; Braille strings for above constants
@msgBrlAcOptionGroup1
GB
@@
;Foh msgViewInfo, %1 = name, %2 = view.
@msgViewInfo_L
%1 %2 View
@@
@msgViewInfo_S
%1 %2
@@
;For msgFormGeneric, %1 = the name of the screen if it is available via getObjectName, meaning the splash screen has a registered name.
;An example would be Northwind 2007 database:
@msgFormGeneric
Use F6 to navigate between the panes and button bars on this %1 splash screen.
The items available depend on the design of the database and your security settings.
@@
@msgNavigationPane
Navigation pane
@@
@msgStartupPane
Startup pane
@@
@msgClientPane
Workspace
@@
@msgMessageBar
Message bar
@@
@msgButtonBar
ButtonBar
@@
@msgWizardDlgTypeInfo
Dialog
@@
@msgCustomListboxTypeInfo
list box
@@
@msgUO_AccessLanguageDetectChangeHlp
This option controls whether %product% detects changes in language within databases which support language tags. %1

This detection only affects those synthesizers, such as Eloquence, that support multiple languages.
@@
@msgDefaultSettingIsOn
The default setting is On.
@@
@msgDsgnFieldName
Field Name
@@
@msgDsgnDataType
Data Type
@@
@msgDsgnDescription
Description
@@
; for msgDsgnDataTypeScreenSensitiveHlp, %1 is the script key to open the menu of data types.
@msgDsgnDataTypeScreenSensitiveHlp
This is the data type field. Press %1Arrow to choose a data type.
@@


;UNUSED_VARIABLES

@msgAppStart1_L
For %product% Hotkey Help with Microsoft Access use %keyFor(hotkeyHelp).
For a list of MSAccess short cut keys use  %KeyFor(WindowKeysHelp).
To hear the %product% help topic for Microsoft Access press %keyFor(screenSensitiveHelp) twice quickly.
@@
@msgAppStart1_S
hotkey help use %KeyFor(hotkeyHelp).
MSAccess shortcut keys use  %KeyFor(WindowKeysHelp).
%product% help topic for MSAccess %keyFor(screenSensitiveHelp) twice quickly.
@@
@msgHlp16_L
To hear dataSheet coordinates use %KeyFor(readDatasheetCoordinates).
To move from field to field use Tab and Shift Tab.
@@
@msgHlp16_S
dataSheet coordinates %KeyFor(readDatasheetCoordinates)
move from field to field Tab and Shift Tab
@@
@msgHlp18_L
This is the Open button. Press Enter to open the selected file or
Press down arrow to access the context menu containing alternative options for opening the file.
Press tab to move to the next control.
@@
@msgHlp18_S
Open button.
Enter to open the selected file
down arrow to access the context menu
tab to move to the next control.
@@
@msgHotkeyHlp4_L
Options use Alt p
Save Version use Alt v
@@
@msgHotkeyHlp4_S
Options Alt p
Save Version Alt v
@@
@msgDialogPage1
%1 page
@@
@msgForm1
%1 form
@@
; for msg2_L/S, %1=column number, %2=row number
@msg2_L
Column %1 row %2
@@
@msg2_S
Col %1 row %2
@@
@msg3_L
Not in a datasheet
@@
@msg3_S
not in datasheet
@@
;for msg4/5_L/S, %1=relationship name, eg categoryProducts
@msg4_L
The %1 relationship was deleted successfully.
You will have to close and reopen the Relationships window in order to refresh the screen and show the deletion.
@@
@msg4_S
%1 deleted
close and reopen Relationships window in order to refresh screen and show deletion
@@
@msg5_L
The %1 relationship could not be deleted.
@@
@msg5_S
%1 could not be deleted
@@
@msg6_L
no controls on subform
@@
@msg7_L
select x to exit.
@@
@msgExitOption1
x - exit
@@
@msg10_L
Select a subform control
@@
@msg13_L
Form hotkeys are as follows:
@@
@msg14_L
SubForm hotkeys are as follows:
@@
;for msg19_L/S, %1=field name to be placed on the Query Design view grid.
@msg19_L
placing %1 on grid
@@
@msg19_S
placing %1 on grid
@@
@msg20_L
Unable to focus on tab Control.
@@
@msg20_S
Unable to focus on tab Control.
@@
@msg41_L
Canceling Relationship or Join initialization.
@@
@msg41_S
Canceling Relationship or Join initialization.
@@
;for msg42_L/S, %1=source table name, %2=source field name.
@msg42_L
Setting source Table to %1 and source field to %2.
Press this key combination again once located in the destination table and on the destination field to create the relationship.
To cancel a relationship initialization use %keyFor(relAndJoinClearValues).
@@
@msg42_S
Setting source Table to %1 and source field to %2.
Press key combination again once located in destination table on destination field to create relationship
cancel relationship initialization %keyFor(relAndJoinClearValues)
@@
;for msg43_L/S, %1=source field name, %2=source table name, %3=destination field name,
;%4=destination table name. This is used when creating a relationship between two tables.
@msg43_L
Creating relationship between %1 in table %2 and %3 in table %4.
@@
@msg43_S
Creating relationship between %1 in %2 and %3 in %4.
@@
@msg46_L
Not on relationships screen.
@@
@msg46_S
Not on relationships screen.
@@
;for msg47_L/S, %1=source field name, %2=destination field name
@msg47_L
 creating join between %1 and %2.
@@
@msg47_S
 creating join between %1 and %2.
@@
@msg48_L
Press this key combination again once on the destination field to create the join.
To cancel a join initialization use %keyFor(relAndJoinClearValues).
@@
@msg48_S
Press key combination again once on destination field to create join
cancel join initialization %keyFor(relAndJoinClearValues)
@@
@msg49_L
Not in query design view field lists.
@@
; Ofice Assistant msgs
@msg49_S
Not in field lists
@@
; Ofice Assistant msgs_S
@msg50_L
Office Assistant not visible
@@
@msg50_S
not visible
@@
@msg51_L
Office Assistant closed
@@
@msg51_S
closed
@@
@msg52_L
office assistant couldn't be closed
@@
@msg52_S
couldn't close
@@
@msg58_L
 disabled
@@
@msgBack1_L
Back
@@
@msgUpOneLevel1_L
Up one level
@@
; for msgDestination/SourceFolder1_L/S, %1=folder name
@msgDestinationFolder1_L
The selected destination folder is %1
@@
@msgDestinationFolder1_S
destination folder %1
@@
@msgSourceFolder1_L
The selected source folder is %1
@@
@msgSourceFolder1_S
source folder %1
@@
@msgBrlAcLabel1
Label
@@
@msgBrlAcRectangle1
Rectangle
@@
@msgBrlAcLine1
Line
@@
@msgBrlAcImage1
Image
@@
@msgBrlAcCommandButton1
Button
@@
@msgBrlAcOptionButton1
Radio Button
@@
@msgBrlAcCheckBox1
Check box
@@
@msgBrlAcBoundObjectFrame1
Bound object frame
@@
@msgBrlAcTextBox1
Edit
@@
@msgBrlAcListBox1
List box
@@
@msgBrlAcComboBox1
Combo box
@@
@msgBrlAcSubform1
Subform/subreport
@@
@msgBrlAcObjectFrame1
Unbound object frame or chart
@@
@msgBrlAcPageBreak1
Page break
@@
@msgBrlAcPage1
Page
@@
@msgBrlAcCustomControl1
ActiveX (custom) control
@@
@msgBrlAcToggleButton1
Toggle button
@@
@msgBrlAcTabCtl1
Tab Control
@@
@msgBrlDialog1_L
%1 dlg
@@
@msgBrlDialogPage1_L
%1 page
@@
@msgBrlDialogGroupbox1_L
%1 gb
@@
@msgInitMessageBoxTitle
Microsoft Access Initialization
@@
@msgInitMessageBoxText
gathering required information
@@
@msgListBox
To move through the items, press alt down arrow.
To close the list press alt up arrow.
@@
@msgButton
Button
@@
@MsgSdmToolbar
To change the selection use the Arrow keys.
@@
@msgListboxitem
ListboxItem
@@
@msgTreeviewItem
To move through or expand items use the Arrow keys.
@@
@MsgShowTable
show table
@@
@MsgAvailableFields
Available Fields:
@@
@MsgSelectedFields
Selected Fields:
@@
;The following two strings correspond to the Pos1 and Pos2 compenents in Microsoft Access 2007.jbs,
;Read there and localize accordingly.
;These strings ensure we display 'r' before row and 'c' before column.
;You will know how to localize what by looking at the jbs file, search for 64]
;For each, %1 is the int value.
@msgBrlPos1
r%1
@@
@msgBrlPos2
c%1
@@
@msgTableEntering
Table
@@
@msgTableExiting
Out of table
@@
@msgNoReportActive_L
No report is active
@@
@msgNoReportActive_S
No report
@@
@msgJAWSDlgCoversReport_L
A %product% dialog is covering the report, push escape
@@
@msgJAWSDlgCoversReport_S
%product% dialog covering report
@@
@msgDefaultSettingIsOff
The default setting is Off.
@@

;END_OF_UNUSED_VARIABLES

endMessages