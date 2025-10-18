;Copyright 1995-2022 Freedom Scientific, Inc.
; Settings functions for Microsoft Excel versions later 2016 and O365.

;#pragma StringComparison partial

include "hjglobal.jsh"
Include "hjconst.jsh"
include "common.jsm"
include "office.jsh"
include "Excel.jsh"
include "Excel.jsm"
include "xlUO.jsm"
include "excelSettings.jsh"

import "excelFunc.jsd"
import "FileIO.jsd"
import "quickset.jsd"


CONST
; for XML ampersand replacement:
	ampersand = "&",
	RANGE_SEPARATOR = ":"

GLOBALS ;///// Private:
	int GIBrlTBLZoom, ; for linking xlUser.app.BrailleMode to global setting
	int gbReturningFromOptionsDialog,
	collection xlDefault,
	collection xlUser,
	collection xlWorkbook,
	collection xlActiveSheet,
	collection xlActiveRegion,
; A place to put Quick Settings option arrays. Get/Set...Info() functions can use this.
	collection xlSettingsMap,
	string xmc_address, ; Used for communication with monitorCellsDependee:
	variantArray xmc_options,  ; Array of arrays of monitor cell options
	int globalNoSave, ; true if clear definitions has been selected and a section deleted from a jsi to avoid an empty section being rewritten.
	string GlobalBestMatch  ;todo: see if we'll still need it.

;So that looping does not happen continuously when braille is running,
;totals row and column settings may be set in memory--even though the setting is auto.
;The following constants and globals are used to know how to treat the totals settings:
const
	TotalsSettingOff = 0,
	TotalsSettingAuto = 1,
	totalsSettingDefined = 2
globals
	int gbTotalsColumnSettingType,
	int gbTotalsRowSettingType


;***********************************
;Quickset XML Overrides Start
; Override of QuickSettings List creator,
; where ampersand gets substituted for word ' and ' in the list of items.
; Replacement of symbols with whole entities breaks such symbols as the apostrophe.
Messages
@ListReadResponseStart
<ReadResponse ID="ListItems">
@@
@DisabledListReadResponseStart
<ReadResponse ID="ListItems" Enabled="False">
@@
@ListValuesStart
	<ListValues SettingsID="%1" SelectIndex="%2">
@@
@ListValue
		<ListValue Text="%1"/>
@@
@ListValuesEnd
	</ListValues>
@@
@ListReadResponseEnd
</ReadResponse>
@@
EndMessages


void function AutoFinishEvent()
gbTotalsColumnSettingType = TotalsSettingOff
gbTotalsRowSettingType = TotalsSettingOff
EndFunction

string function QsxmlMakeList (string settingID, int nSelectIndex, stringArray listItems, int nArraySize, int bDisabledSetting)
var
	string sTab = "\t",
	int i=1,
	string sList,
	string sItem
;As JAWS script arrays, like Python, are 1-based, and internsal xml indeces, like PERL, are 0-based,
;we need to round down to ensure that selection indeces fall within range.
if (nSelectIndex >= nArraySize)
	nSelectIndex = nArraySize-1 ;
elIf (nSelectIndex < 0)
	nSelectIndex = 0; lower bound for array of indeces.
endIf
if bDisabledSetting then
	sList = DisabledListReadResponseStart
else
	sList = ListReadResponseStart
endIf
sList = sList+cscBufferNewLine+sTab
	+formatString (ListValuesStart, settingID, nSelectIndex)+cscBufferNewLine
for i=1 to nArraySize
	if ! stringIsBlank (listItems[i])then
		sItem = StringReplaceSubStrings (listItems[i], ampersand, XmlAmpersandReplacement)
		sItem = formatString (ListValue, sItem)
	endIf
	sItem = sTab+sTab+sItem
	sList = sList+sItem+cscBufferNewLine
endFor
sList = sList+sTab+ListValuesEnd+cscBufferNewLine+ListReadResponseEnd
return sList
endFunction
;Quickset XML Overrides End
; *****************************************

void function CollectionUpdateBooleanItem (collection byRef items, string sKey)
;Keeps file-specific collections clean.
if (CollectionItemExists (items, sKey))
	CollectionRemoveItem (items, sKey)
else
	items[sKey] = 1
endIf
endFunction

int function getExcelNamesCeiling ()
return xlUser.app.ExcelNamesCeiling
endFunction

string Function getWorkbookJSIName ()
var
	string sWorkbookName
;let sWorkbookName=getActiveWorkbookName ()
let sWorkbookName = getActiveWorkbookNameFromCollection (); for QuickSettings
if sWorkbookName!=cscNull then
	return formatString(jsiWorkbookFile,sWorkbookName)
else
	return cscNull
endIf
EndFunction

string function xmlEscapeAmpersand (string strData)
var
	string strResult
strResult = StringReplaceSubstrings(strData, "&", "&amp;")
return strResult
endFunction

string function matchNameToFileName (string sName)
var
	string strFile
if (xlUser.app.SettingsFileAssoc != ASSOC_EXACT_MATCH)
	strFile = FilenameGetNearestMatch (FindJAWSPersonalizedSettingsFile(sName, TRUE), 11, TRUE)
	if (stringSegmentCount (strFile, cscDoubleBackslash))
		strFile = stringSegment (strFile, cscDoubleBackSlash, -1)
	endIf
	if (stringIsBlank (strFile))
		strFile = sName
	endIf
else
	strFile = sName
endIf
strFile = xmlEscapeAmpersand(strFile)
return (strFile)
endFunction

string function xmlGetActiveWorkbook (string settingID)
return qsxmlMakeVariable (settingID, matchNameToFileName (getWorkbookJSIName ()))
endFunction

string function xmlGetActiveSheetName (string settingID)
return qsxmlMakeVariable (settingID, getActiveSheetName ())
endFunction

string function xmlGetActiveRegionName (string settingID)
return qsxmlMakeVariable (settingID, getRegionSectionName ())
endFunction

void function UpdateTotalsTypes(optional collection region)
if !region
	gbTotalsColumnSettingType = TotalsSettingOff
	gbTotalsRowSettingType = TotalsSettingOff
	return
endIf
if region.TotalsColumn == -1
	gbTotalsColumnSettingType = TotalsSettingAuto
elif region.TotalsColumn > 0
	gbTotalsColumnSettingType = TotalsSettingDefined
else
	gbTotalsColumnSettingType = TotalsSettingOff
endIf
if region.TotalsRow == -1
	gbTotalsRowSettingType = TotalsSettingAuto
elif region.TotalsRow > 0
	gbTotalsRowSettingType = TotalsSettingDefined
else
	gbTotalsRowSettingType = TotalsSettingOff
endIf
EndFunction

void function UpdateWorkbookPointer (optional int nptrSetting)
;No reason at all to update when returning from JAWS Options.
;This causes failures especially in nOverride settings changes.
if (gbReturningFromOptionsDialog)
	gbReturningFromOptionsDialog = OFF;
	return
endIf
;default is just move if available.
;1 = explicitly create if none exists,
;2 = explicitly delete.
var
	collection settings,
	collection doc,
	collection cellMarkers,
	int iLocationCode,
	string sName,
	string strFile
if (nptrSetting == POINTER_DELETE)
	CollectionRemoveAll (xlWorkbook)
	xlWorkbook = null()
	return
endIf
sName = getWorkbookJSIName ()
strFile = matchNameToFileName (sName)
settings = settingReadToCollection (strFile, FT_JSI)
if (collectionItemsCount (settings))
	xlWorkbook = settings
else
	xlWorkbook = new collection
	;add 'doc' member.
	doc = new collection
	xlWorkbook.doc = doc
endIf
; if workbook had sheet members but no doc
if (!collectionItemExists (xlWorkbook, "doc"))
	doc = new collection
	xlWorkbook.doc = doc
endIf
if (!collectionItemExists (xlWorkbook, section_cellMarkers))
	cellMarkers = new collection
	xlWorkbook[section_cellMarkers] = cellMarkers;
endIf
;The default assumption for resource intensive features is to allow them.
;however, we only want to have the setting in the JSI file when it is set to the non-default value.
;To accomodate this,
;We may be reading in a true value for an option called DisallowPerformanceImpactingFeatures from the file,
;but inverting its meaning and calling it AllowPerformanceImpactingFeatures in the code.
if xlWorkbook.doc.DisallowPerformanceImpactingFeatures
	;clear out the setting by its name read from the file:
	collectionRemoveItem(xlWorkbook.doc,"DisallowPerformanceImpactingFeatures")
	;Since Allow is not a collection member, it is false, which is equivalent to disallow being true.
else
	;since we are not disallowing, we must set an allow member to true:
	var collection c = xlWorkbook.doc
	c.AllowPerformanceImpactingFeatures = 1
endIf
endFunction

void function UpdateWorksheetPointer (optional int nptrSetting)
;No reason at all to update when returning from JAWS Options.
;This causes failures especially in nOverride settings changes.
if (gbReturningFromOptionsDialog)
	gbReturningFromOptionsDialog = OFF;
	return
endIf
var
	string sheetName,
	string item
xlActiveSheet = null () ; protect against using previous sheet settings by mistake.
xlActiveSheet = new collection
sheetName = getActiveSheetName ()
if (nptrSetting == POINTER_REPLACE)
	;clear previous instance completely before replace:
	collectionRemoveAll (xlWorkbook[sheetName])
	xlWorkbook[sheetName] = null ()
	collectionRemoveItem (xlWorkbook, SheetName)
	;add new:
	xlWorkbook[sheetName] = xlActiveSheet
	UpdateTotalsTypes()
	return
elIf (nptrSetting == POINTER_DELETE)
	;parent item should know longer exist so setting file won't grow.
	CollectionRemoveItem (xlWorkbook, SheetName)
	CollectionRemoveAll (xlActiveSheet)
	xlActiveSheet = null()
	UpdateTotalsTypes()
	return
endIf
;default:
if (collectionItemExists (xlWorkbook, sheetName))
	xlActiveSheet = xlWorkbook[sheetName]
else
	xlActiveSheet = new collection
	xlWorkbook[sheetName] = xlActiveSheet
endIf
UpdateTotalsTypes(xlActiveSheet)
endFunction

void function updateRegionPointer (optional int nPTRSetting)
;No reason at all to update when returning from JAWS Options.
;This causes failures especially in nOverride settings changes.
if (gbReturningFromOptionsDialog)
	gbReturningFromOptionsDialog = OFF;
	return
endIf
var
	string item,
	string sRegionName
sRegionName = getRegionSectionName ()
if (nptrSetting == POINTER_REPLACE)
	;clear previous instance completely before replace:
	collectionRemoveAll (xlWorkbook[sRegionName])
	xlWorkbook[sRegionName] = null ()
	collectionRemoveItem (xlWorkbook, sRegionName)
	;add new:
	xlActiveRegion = new collection
	xlWorkbook[sRegionName] = xlActiveRegion
	UpdateTotalsTypes()
	return
elIf (nptrSetting == POINTER_DELETE)
	CollectionRemoveAll (xlActiveRegion)
	xlActiveRegion = null()
	;parent item should know longer exist so setting file won't grow.
	CollectionRemoveItem (xlWorkbook, sRegionName)
	UpdateTotalsTypes()
	return
endIf
xlActiveRegion = new collection
if (! MultipleRegionSupport ())
	xlActiveRegion = xlActiveSheet
	return
elIf (collectionItemExists (xlWorkbook, sRegionName))
	xlActiveRegion = xlWorkbook[sRegionName]
else
	xlWorkbook[sRegionName] = xlActiveRegion
endIf
UpdateTotalsTypes(xlActiveRegion)
endFunction

void function QuickSettingsLoadDocumentSettings ()
UpdateWorkbookPointer ()
UpdateWorksheetPointer ()
UpdateRegionPointer ()
QuickSettingsLoadDocumentSettings ()
endFunction

int function obliterateSheetDataFromCurrentWorkbook  (string sheetName)
;assumes we're talking about a sheet who isn't, or should not be, xlActiveSheet.
;This sheet and it's regions just got deleted from the workbook.
var
	int bRemoved,
	int nLength,
	string strFile,
	string section
nLength = stringLength (sheetName)
strFile = getWorkbookJSIName ()
if (! strFile || ! xlWorkbook)
	return FALSE
endIf
forEach section in xlWorkbook
	If (stringCompare (section, sheetName) == 0
	;also get multiple regions for the sheet, same level in collection as sheet:
	|| stringCompare (stringLeft (section, nLength), sheetName) == 0)
		CollectionRemoveAll (xlWorkbook[section])
		xlWorkbook[section] = null ()
		CollectionRemoveItem (xlWorkbook, section)
		bRemoved = bRemoved || IniRemoveSectionEx(section, FLOC_USER_PERSONALIZED_SETTINGS, strFile)
	endIf
endForEach
;remove any cellMarkers that belong to this worksheet:
CollectionRemoveItem (xlWorkbook[section_cellMarkers], sheetName)
bRemoved = bRemoved || IniRemoveKeyEx(section_cellMarkers, sheetName, FLOC_USER_PERSONALIZED_SETTINGS, strFile)
return bRemoved
endFunction

void Function UpdateSettingsCollections ()
UpdateWorkbookPointer ()
updateWorksheetPointer ()
updateRegionPointer ()
endFunction

void function InitializeSettings ()
xlDefault = new collection;
xlUser = new collection;
xlWorkbook = new collection;
xlActiveSheet = new collection;
xlActiveRegion = new collection;
LoadNonJCFOptions()
endFunction

collection function findSettingLocation (string setting)
;for now does not handle dependencies, that must be done individually:
;setting must only appear once.
;Also assumes active collections are alive and / or referenced properly, this does not set or scrub:
If (stringContains (RegionSettings, setting))
	return xlActiveRegion; same as sheet when multiple region support is off.
elIf (stringContains (SheetSettings, setting))
	return xlActiveSheet
elIf (stringContains (BookSettings, setting))
	if collectionItemExists (xlActiveSheet, setting)
		return xlActiveSheet
	else
		return xlWorkbook.doc ; sheet member collections of workbook handled separately.
	endIf
elIf (stringContains (AppSettings, setting))
	if (collectionItemExists (xlActiveSheet, setting))
		return xlActiveSheet
	else
		return xlUser.app
	endIf
endIf
endFunction

collection function UpdateSettingLocation (string setting)
var
	collection app
app = new collection;
app = xlUser.app
;where defaults are in .app, we want to update the sheet,
;example formulas,
;item will exist as 0, so user can turn it off for a worksheet.
if (collectionItemExists (xlActiveSheet, setting))
	collectionRemoveItem (xlActiveSheet, setting)
	return app
else
	xlActiveSheet[setting] = 0
	return xlActiveSheet
endIf
endFunction

int function DisplayChartInVirtualViewer ()
return xlUser.app.DisplayChartInVirtualViewer
endFunction

int function CellReadingVerbosity ()
return findSettingLocation (hKey_CellReadingVerbosity).CellReadingVerbosity
endFunction

string function ToggleCellReadingVerbosity (int iRetCurVal)
var
	collection location
location = new collection
location = findSettingLocation (hKey_CellReadingVerbosity)
if ! iRetCurVal then
	;update the value
	location.CellReadingVerbosity = !location.CellReadingVerbosity
endIf
if location.CellReadingVerbosity ==readCellContentsOnly then
	return msg248_L
else
	return msg249_L
endIf
EndFunction

int function OverrideDocNamedTitles ()
;OVERRIDE_TITLES_OFF, OVERRIDE_TITLES_ALL, OVERRIDE_TITLES_FILE
if (xlWorkbook.doc.NamedTitles)
	return 2
else
return xlUser.app.NamedTitles
endIf
endFunction

string function ToggleOverrideDocNamedTitles (int iRetCurVal)
var
	int nSetting,
	collection app, collection doc;
app = new collection
doc = new collection;
app = xlUser.app
if (! xlWorkbook)
	xlWorkbook = new collection;
endIf
if (! collectionItemExists (xlWorkbook, "doc"))
	xlWorkbook.doc = doc
else
	doc = xlWorkbook.doc
endIf
if ! iRetCurVal then
	;update the value
	if (collectionItemExists (app, hKey_NamedTitlesApp)); on for all files
		collectionRemoveItem (app, hKey_NamedTitlesApp)
		doc[hKey_NamedTitlesApp] = 2
	elIf (collectionItemExists (doc, hKey_NamedTitlesApp)); on for the current file
		collectionRemoveItem (doc, hKey_NamedTitlesApp)
		collectionRemoveItem (app, hKey_NamedTitlesApp)
	else
		collectionRemoveItem (doc, hKey_NamedTitlesApp)
		app[hKey_NamedTitlesApp] = 1
	endIf
endIf
nSetting = app[hKey_NamedTitlesApp] + doc[hKey_NamedTitlesApp]
if (nSetting == 2)
	return msgNamedTitlesFile
elIf (nSetting == 1)
	return msgNamedTitlesApp
Else
	return cmsg_off
endIf
EndFunction

string function getOverrideDocNamedTitlesInfo (string settingID)
var
	int nSetting,
	collection app, collection doc,
	int nSelectIndex,
	stringArray szListItems,
	int nSize = 3
szListItems = new stringArray[nSize]
app = new collection
doc = new collection;
app = xlUser.app
if (! xlWorkbook)
	xlWorkbook = new collection;
endIf
if (! collectionItemExists (xlWorkbook, "doc"))
	xlWorkbook.doc = doc
else
	doc = xlWorkbook.doc
endIf
szListItems[1] = cmsg_off
szListItems[2] = msgNamedTitlesApp
szListItems[3] = msgNamedTitlesFile
nSelectIndex = app[hKey_NamedTitlesApp] + doc[hKey_NamedTitlesApp]
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize, !AllowPerformanceImpactingFeatures())
endFunction

void function setOverrideDocNamedTitlesInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	int nSetting,
	collection app, collection doc,
	string strFile = matchNameToFileName (getWorkbookJSIName ()),
	string sSheet = getActiveSheetName (),
	string sRegion = getRegionSectionName ()
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
app = new collection
doc = new collection;
app = xlUser.app
if (! xlWorkbook)
	xlWorkbook = new collection;
endIf
if (! collectionItemExists (xlWorkbook, "doc"))
	xlWorkbook.doc = doc
else
	doc = xlWorkbook.doc
EndIf
if iSelection == 0 then ; Off
	collectionRemoveItem (doc, hKey_NamedTitlesApp)
	collectionRemoveItem (xlActiveRegion, hKey_TitleReadingVerbosity)
	collectionRemoveItem (xlActiveRegion, hKey_TitleColStart)
	collectionRemoveItem (xlActiveRegion, hKey_TitleColEnd)
	collectionRemoveItem (xlActiveRegion, hKey_TitleRowStart)
	collectionRemoveItem (xlActiveRegion, hKey_TitleRowEnd)
	collectionRemoveItem (xlActiveSheet, hKey_MultipleRegionSupport)
	iniRemoveKeyEX ("doc", hKey_NamedTitlesApp, FLOC_USER_PERSONALIZED_SETTINGS, strFile)
	iniRemoveKeyEX (sRegion, hKey_TitleReadingVerbosity, FLOC_USER_PERSONALIZED_SETTINGS, strFile)
	;iniRemoveKeyEX (sRegion, hKey_TitleColStart, FLOC_USER_PERSONALIZED_SETTINGS, strFile)
	;iniRemoveKeyEX (sRegion, hKey_TitleColEnd, FLOC_USER_PERSONALIZED_SETTINGS, strFile)
	;iniRemoveKeyEX (sRegion, hKey_TitleRowStart, FLOC_USER_PERSONALIZED_SETTINGS, strFile)
	;iniRemoveKeyEX (sRegion, hKey_TitleRowEnd, FLOC_USER_PERSONALIZED_SETTINGS, strFile)
	iniRemoveKeyEX (sSheet, hKey_MultipleRegionSupport, FLOC_USER_PERSONALIZED_SETTINGS, strFile)
	iniFlushEX (FLOC_USER_PERSONALIZED_SETTINGS, strFile)
	collectionRemoveItem (app, hKey_NamedTitlesApp)
	WriteSettingInteger (SECTION_NONJCF_OPTIONS, hKey_NamedTitlesApp, 0, FT_CURRENT_JCF, nWriteDestination)
elIf iSelection == 1 then ; On for All Files
	collectionRemoveItem (doc, hKey_NamedTitlesApp)
	iniRemoveKeyEX ("doc", hKey_NamedTitlesApp, FLOC_USER_PERSONALIZED_SETTINGS, matchNameToFileName (getWorkbookJSIName ()))
	iniFlushEX (FLOC_USER_PERSONALIZED_SETTINGS, matchNameToFileName (getWorkbookJSIName ()))
	app[hKey_NamedTitlesApp] = 1
	WriteSettingInteger (SECTION_NonJCFOptions, hKey_NamedTitlesApp, 1, FT_CURRENT_JCF, wdUser)
elIf iSelection == 2 then ; current file
	collectionRemoveItem (app, hKey_NamedTitlesApp)
	WriteSettingInteger (SECTION_NonJCFOptions, hKey_NamedTitlesApp, 0, FT_CURRENT_JCF, wdUser)
	doc[hKey_NamedTitlesApp] = 2
	writeSettingInteger ("doc", hKey_NamedTitlesApp, 2, ft_jsi, wdUser, matchNameToFileName (getWorkbookJSIName ()))
endIf
endFunction

int function TitleReadingVerbosity  ()
return xlActiveRegion.TitleReadingVerbosity
endFunction

string function toggleTitleReadingVerbosity (int iRetCurVal)
var
	int nOverride,
	int nStart, int nEnd,
	string sColData,
	string sRowData,
	string sNamedRegionTitles,
	int iSetting
nOverride = OverrideDocNamedTitles ()
if ! iRetCurVal && nOverride then
	;update the value
	if (xlActiveRegion.TitleReadingVerbosity ==readBothTitles)
		collectionRemoveItem (xlActiveRegion, hKey_TitleReadingVerbosity)
		collectionRemoveItem (xlActiveRegion, hKey_TitleColStart)
		collectionRemoveItem (xlActiveRegion, hKey_TitleColEnd)
		collectionRemoveItem (xlActiveRegion, hKey_TitleRowStart)
		collectionRemoveItem (xlActiveRegion, hKey_TitleRowEnd)
	else
		xlActiveRegion.TitleReadingVerbosity =xlActiveRegion.TitleReadingVerbosity+1
		GetDefaultValueToSetTitleRow (nStart, nEnd)
		xlActiveRegion.TitleRowStart = nStart
		xlActiveRegion.TitleRowEnd = nEnd
		GetDefaultValueToSetTitleColumn (nStart, nEnd)
		xlActiveRegion.TitleColStart = nStart
		xlActiveRegion.TitleColEnd = nEnd
	endIf
endIf
;get string data no matter what the value of iRetCurVal is,
;catches things on double refresh:
if ( nOverride <= 0)
	iSetting = DocNamedTitleReadingVerbosity()
	sNamedRegionTitles = getNamedRegionTitleSettings (DocNamedTitleReadingVerbosity ())
else
	iSetting = xlActiveRegion.TitleReadingVerbosity
	if (xlActiveRegion.TitleReadingVerbosity & readColumnTitles)
		if xlActiveRegion.TitleRowStart == xlActiveRegion.TitleRowEnd then
			sRowData = cscSpace+intToString (xlActiveRegion.TitleRowStart)
		else
			sRowData = cscSpace+formatString (msgRangeMultipleCells1_L,
				intToString (xlActiveRegion.TitleRowStart), intToString (xlActiveRegion.TitleRowEnd))
		EndIf
	EndIf
	if (xlActiveRegion.TitleReadingVerbosity & readRowTitles)
		if xlActiveRegion.TitleColStart == xlActiveRegion.TitleColEnd then
			sColData = ColumnNumberToLetter (xlActiveRegion.TitleColStart)
		else
			sColData = formatString (msgRangeMultipleCells1_L,
				ColumnNumberToLetter (xlActiveRegion.TitleColStart), ColumnNumberToLetter (xlActiveRegion.TitleColEnd))
		EndIf
	endIf
EndIf
if (iSetting == readNoTitles)
	if (! OverrideDocNamedTitles ())
		return msg252_L+cscSpace+msgDefineNameTitlesError
	else
		return msg252_L
	endIf
elif (iSetting == readColumnTitles)
	if (!nOverride)
		return msg253_L+cscSpace+msgDefineNameTitlesError
	else
		return msg253_L+sRowData
	EndIf
elif (iSetting == readRowTitles)
	if (!nOverride)
		return msg254_L+cscSpace+msgDefineNameTitlesError
	else
		return msg254_L+sColData
	EndIf
elif (iSetting == readBothTitles)
	if (!nOverride)
		return msg255_L+cscSpace+msgDefineNameTitlesError
	else
		return msg255_L+sColData+sRowData
	EndIf
endIf
EndFunction

string function GetTitleReadingVerbosityInfo (string settingID)
var
	int nStart, int nEnd,
	int nSelectIndex = TitleReadingVerbosity  (),
	stringArray szListItems,
	int nSize = 4,
	int nOverride,
	string sColData,
	string sRowData,
	string sNamedRegionTitles,
	int iSetting
GetDefaultValueToSetTitleColumn (nStart, nEnd)
szListItems = new stringArray[nSize]
nOverride = OverrideDocNamedTitles ()
iSetting = DocNamedTitleReadingVerbosity()
;nSelectIndex = iSetting
sNamedRegionTitles = getNamedRegionTitleSettings (DocNamedTitleReadingVerbosity ())
if nStart == nEnd then
	sRowData = cscSpace+intToString (nStart)
else
	sRowData = cscSpace+formatString (msgRangeMultipleCells1_L,
		intToString (nStart), intToString (nEnd))
EndIf
if nStart == nEnd then
	sColData = ColumnNumberToLetter (nStart)
else
	sColData = formatString (msgRangeMultipleCells1_L,
		ColumnNumberToLetter (nStart), ColumnNumberToLetter (nEnd))
EndIf
szListItems[1] = msg252_L; OFF
szListItems[readColumnTitles+1] = msg253_L+sRowData
szListItems[readRowTitles+1] = msg254_L+sColData
szListItems[readBothTitles+1] = msg255_L+sColData+sRowData
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize, !nOverride)
endFunction

void function SetTitleReadingVerbosityInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
return TitleReadingVerbosityDependee (iSelection)
endFunction

void function TitleReadingVerbosityDependee (int iSelection)
var
	int nOverride,
	int nStart, int nEnd,
	string sColData,
	string sRowData,
	string sNamedRegionTitles,
	string strFile = matchNameToFileName (GetWorkbookJSIName ()),
	string sectionName = getRegionSectionName (),
	int iSetting
nOverride = OverrideDocNamedTitles ()
if iSelection == 0 then; OFF
	collectionRemoveItem (xlActiveRegion, hKey_TitleReadingVerbosity)
	WriteSettingInteger (sectionName, hKey_TitleReadingVerbosity, 0, FT_JSI, wdUser, strFile)
else
	xlActiveRegion.TitleReadingVerbosity =iSelection
	WriteSettingInteger (sectionName, hKey_TitleReadingVerbosity, xlActiveRegion.TitleReadingVerbosity, FT_JSI, wdUser, strFile)
endIf
return TRUE
endFunction

string function getAssignedMonitorCells()
var
	int i ,
	string sMonitor,
	string sAssignedNumbers
let sAssignedNumbers=cscNull
for i=1 to maxMonitorCells
	sMonitor = formatString (hKey_MonitorCell, intToString(i))
	if (collectionItemExists (xlActiveSheet, sMonitor))
		let sAssignedNumbers=sAssignedNumbers+intToString(i)+cscSpace
	endIf
endFor
if sAssignedNumbers!=cscNull then
	return formatString(msgAssignedMonitorCells1_L, sAssignedNumbers)
else
	return msgAssignedMonitorCells2_L
endIf
endFunction


string function getMonitorCell (int number)
var
	string sMonitor = formatString (hKey_MonitorCell, intToString(number))
return xlActiveSheet[sMonitor]
endFunction

string function getListOfMonitorCells ()
var
	string stmp,
	string strcmp = formatString (hKey_MonitorCell, cscNull),
	string item, string strList
forEach item in xlActiveSheet
	if (stringCompare (stringLeft (item, stringLength (strcmp)), strcmp) == 0)
		stmp = xlActiveSheet[item]
		strList = strList+stmp+LIST_ITEM_SEPARATOR
	endIf
endForEach
return StringChopRight(strList,1)
endFunction

string function getActiveSelectionRange ()
var
	string sStart,
	string sEnd
GetSelectionAddressRange (sStart, sEnd)
if (sStart != sEnd)
	return sStart+RANGE_SEPARATOR+sEnd
else
	return sStart
endIf
endFunction

int function setMonitorCell (int number, optional int nWriteDestination, string address)
var
	string section,
	string sKey
section = getActiveSheetName ()
sKey = formatString (hKey_MonitorCell, intToString(number))
if !address then
	address = getActiveSelectionRange ()
endIf
xlActiveSheet[sKey] = address
return WriteSettingString (section, sKey, address, FT_JSI, nWriteDestination, matchNameToFileName (getWorkbookJSIName ()))
endFunction

int function removeMonitorCell (int number, optional int nWriteDestination)
var
	string section,
	string sKey
section = getActiveSheetName ()
sKey = formatString (hKey_MonitorCell, intToString(number))
CollectionRemoveItem (xlActiveSheet, sKey)
IniRemoveKeyEx (section, sKey, FLOC_USER_PERSONALIZED_SETTINGS, matchNameToFileName (getWorkbookJSIName ()))
iniFlushEX (FLOC_USER_PERSONALIZED_SETTINGS, matchNameToFileName (getWorkbookJSIName ()))
return True
endFunction

; not sure if this is used with quick settings
string function setNextAvailableMonitorCell (int iRetCurVal)
var
	int index,
	string cellCoordinates,
	string sMonitor,
	int monitorCellNumber
if not iRetCurVal then
	;update the value
	monitorCellNumber = 0
	for index = 1 to maxMonitorCells
		sMonitor = formatString (hKey_MonitorCell, intToString (index))
		if (! collectionItemExists (xlActiveSheet, sMonitor)
		;and we haven't yet defined a cell
		&& ! monitorCellNumber)
			; this is a blank monitor cell
			let monitorCellNumber=index
		endIf
	endFor
	if monitorCellNumber==0 then
		; none undefined
		return msgNoMonitorCellsAvailable1_L
	endIf
	cellCoordinates = getActiveSelectionRange ()
	sMonitor = formatString (hKey_MonitorCell, intToString (monitorCellNumber))
	xlActiveSheet[sMonitor] = cellCoordinates
endIf
return getAssignedMonitorCells()
EndFunction

string function getMonitorCellsInfo (string settingID)
var
	stringArray szListItems,
	stringArray szValues,
	int nSize,
	int index,
	int nSelectIndex,
	string sTmp,
	string sMonitor,
	string sAddress = getActiveSelectionRange ()
sTmp = stringSegment(settingID, ".", -1)
index = stringToInt(sTmp)
sMonitor = formatString (hKey_MonitorCell, intToString (index))
;Size is at least 2, if assigned we add a third for reassignment purposes.
nSize = 2+collectionItemExists (xlActiveSheet, sMonitor) 
szListItems = new StringArray[nSize]  ; max count of items possible
szValues = new StringArray[nSize]
if ! collectionItemExists (xlActiveSheet, sMonitor) then
	; No assignment yet.
	szListItems[1] = msgQSUnassigned
	szValues[1] = ""
	szListItems[2] = formatString(msgQSAssigned, sAddress)
	szValues[2] = sAddress
	nSelectIndex = 0 ; selection is 0-based.
elif sAddress == xlActiveSheet[sMonitor] then
	; Already assigned to current cell.
	szListItems[1] = formatString(msgQSAssigned, xlActiveSheet[sMonitor])
	szValues[1] = xlActiveSheet[sMonitor]
	szListItems[2] = msgQSUnassigned
	szValues[2] = ""
	nSelectIndex = 0 ; selection is 0-based.
else
	; Already assigned to a different cell than the one now selected.
	szListItems[1] = formatString(msgQSAssigned, xlActiveSheet[sMonitor])
	szValues[1] = xlActiveSheet[sMonitor]
	szListItems[2] = formatString(msgQSReassigned, sAddress)
	szValues[2] = sAddress
	szListItems[3] = msgQSUnassigned
	szValues[3] = ""
	nSelectIndex = 0 ; selection is 0-based.
endIf
if !xmc_options then
	xmc_options = new variantArray[maxMonitorCells]
endIf
xmc_options[index] = szValues
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
endFunction

int function setMonitorCellsInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	int index,
	stringArray values
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
iSelection = iSelection +1
index = stringToInt(stringSegment(settingID, ".", -1))
values = xmc_options[index]
xmc_address = values[iSelection]
if !stringIsBlank(xmc_address) then
	; When setting to a non-empty address, block duplicate assignments.
	var int i, string sMonitor
	for i=1 to maxMonitorCells
		sMonitor = formatString (hKey_MonitorCell, intToString (i))
		if i != index && stringCompare(xlActiveSheet[sMonitor], xmc_address, False) == 0 then
			sayMessage(OT_Error, formatString(msgQSDuplicateCell,
				xmc_address, intToString(i)
			))
			return False
		endIf
	endFor
endIf
return MonitorCellsDependee (index)
endFunction

void function MonitorCellsDependee (int index)
if index >= 1 then 
	if xmc_address then
		setMonitorCell (index, wdUser, xmc_address)
	else
		removeMonitorCell (index, wdUser)
	endIf
endIf
return True
endFunction

string function getCellMarker (string sheetName)
var
	collection markerList
markerList = xlWorkbook[section_cellMarkers]
return markerList[sheetName]
endFunction

string function getActiveCellMarker ()
var
	collection markerList
markerList = xlWorkbook[section_cellMarkers]
return markerList[getActiveSheetName ()]
endFunction

int function setCellMarker (string sheetName, string address)
var
	string sKey,
	collection markerList
sKey = sheetName
markerList = xlWorkbook[section_cellMarkers]
markerList[sKey] = address
return WriteSettingString (section_cellMarkers, sKey, address, FT_JSI, wdUser, matchNameToFileName (getWorkbookJSIName ()))
endFunction

int function setActiveCellMarker ()
return setCellMarker (getActiveSheetName (), getActiveCellAddress ())
endFunction

void function DeleteCellMarker (string sheetName)
var
	string sKey,
	collection markerList
sKey = sheetName
markerList = xlWorkbook[section_cellMarkers]
collectionRemoveItem (markerList, sKey)
return iniRemoveKeyEX (section_cellMarkers, sKey, FLOC_USER_PERSONALIZED_SETTINGS, getWorkbookJSIName ())
endFunction

void function DeleteActiveCellMarker ()
DeleteCellMarker (getActiveSheetName ())
endFunction

string function getListOfCellMarkers ()
var
	collection markersList,
	string key, string item,
	string strList;
markersList = xlWorkbook[section_cellMarkers]
forEach item in markersList
	strList = strList + formatString (msgCellMarkerListItem, item, markersList[item]) + LIST_ITEM_SEPARATOR
endForEach
return StringChopRight(strList,1)
endFunction

string function getListOfSheetsWithCellMarkers ()
var
	collection markersList,
	string item,
	string strList;
markersList = xlWorkbook[section_cellMarkers]
forEach item in markersList
	strList = strList + item + LIST_ITEM_SEPARATOR
endForEach
return StringChopRight(strList,1)
endFunction

int function GetNumberOfCellMarkers ()
var
	collection markersList,
	string item,
	int NumOfMarkers
markersList = xlWorkbook[section_cellMarkers]
forEach item in markersList
	NumOfMarkers = NumOfMarkers+1
endForEach
return NumOfMarkers
EndFunction

string function clearRegionDefinitions (int iRetCurVal)
var
	string key
if ! iRetCurVal then
	globalNoSave = TRUE
	collectionRemoveItem (xlActiveRegion, 	hKey_TitleReadingVerbosity)
	collectionRemoveItem (xlActiveRegion,	hKey_TitleColStart)
	collectionRemoveItem (xlActiveRegion,	hKey_TitleColEnd)
	collectionRemoveItem (xlActiveRegion,	hKey_TitleRowStart)
	collectionRemoveItem (xlActiveRegion,	hKey_TitleRowEnd)
	collectionRemoveItem (xlActiveRegion,	hKey_TotalsColumn)
	collectionRemoveItem (xlActiveRegion,	hKey_TotalsRow)
EndIf
If globalNoSave then
	return msg258_l
Else
	return cscNull
EndIf
EndFunction

int function TitleOrTotalDefinitionsExist ()
var
	int bItemsExist,
	string sItem;
forEach sItem in xlActiveSheet
	bItemsExist = (stringContains (sItem, "title") || stringContains (sItem, "total")
	|| stringContains (sItem, "Title") || stringContains (sItem, "Total") || bItemsExist)
endForEach
return bItemsExist
endFunction

string function getClearRegionDefinitionsInfo (string settingID, int nReadSource)
var
	int nState, int nSelectIndex,
	int bDisabled = !OverrideDocNamedTitles ()
nState = ! TitleOrTotalDefinitionsExist () ; not checked = check it to clear setting.
;disable if no settings actually exist:
;sort of a double negative but not exist would mean the state is actually checked:
;bDisabled = bDisabled || nState ; we may or may not actually want to disable that.
return qsxmlMakeBoolean (settingID, qsxmlMakeBooleanState (nState), bDisabled)
endFunction

void function setClearRegionDefinitionsInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int nState,
	string sFileName, string SectionName
parseXMLBooleanWriteRequest (sxmlWriteRequest, nState)
if nState == 0 then
	Return
endIf	
sFileName = matchNameToFileName (getWorkbookJSIName ())
sectionName = getRegionSectionName ()
IniRemoveKey (sectionName, hKey_TitleReadingVerbosity, sFileName, FALSE)
collectionRemoveItem (xlActiveRegion, 	hKey_TitleReadingVerbosity)
IniRemoveKey (sectionName, hKey_TitleColStart, sFileName, FALSE)
collectionRemoveItem (xlActiveRegion,	hKey_TitleColStart)
IniRemoveKey (sectionName, hKey_TitleColEnd, sFileName, FALSE)
collectionRemoveItem (xlActiveRegion,	hKey_TitleColEnd)
IniRemoveKey (sectionName, hKey_TitleRowStart, sFileName, FALSE)
collectionRemoveItem (xlActiveRegion,	hKey_TitleRowStart)
IniRemoveKey (sectionName, hKey_TitleRowEnd, sFileName, FALSE)
collectionRemoveItem (xlActiveRegion,	hKey_TitleRowEnd)
IniRemoveKey (sectionName, hKey_TotalsColumn, sFileName, FALSE)
collectionRemoveItem (xlActiveRegion,	hKey_TotalsColumn)
IniRemoveKey (sectionName, hKey_TotalsRow, sFileName, FALSE)
collectionRemoveItem (xlActiveRegion,	hKey_TotalsRow)
iniFlush (sFileName)
UpdateCXLActiveCellTitles()
endFunction

int function SelectionReadingVerbosity ()
return findSettingLocation(hKey_SelectionReadingVerbosity).SelectionReadingVerbosity
endFunction

string function toggleSelectionReadingVerbosity (int iRetCurVal)
var
	collection location
location = new collection
location = findSettingLocation (hKey_SelectionReadingVerbosity)
if ! iRetCurVal then
	;update the value
	location.SelectionReadingVerbosity = ! location.SelectionReadingVerbosity
endIf
if location.SelectionReadingVerbosity  == readSelectedRange then
	return msgReadSelectedRange1_L
else
	return msgReadFirstAndLastCellInSelection1_L
endIf
endFunction

int function NumberFormatVerbosity ()
return findSettingLocation(hKey_DetectCellNumberFormatChange).DetectCellNumberFormatChange
endFunction

string function toggleNumberFormatVerbosity (int iRetCurVal)
var
	collection location
location = new collection
location = findSettingLocation(hKey_DetectCellNumberFormatChange)
if ! iRetCurVal then
	;update the value
	CollectionUpdateBooleanItem (location, hKey_DetectCellNumberFormatChange)
endIf
if (location.DetectCellNumberFormatChange)
	return msgDetectCellNumberFormatChangeOn1_L
else
	return msgDetectCellNumberFormatChangeOff1_L
endIf
EndFunction

int function CellBorderVerbosity ()
return findSettingLocation (hKey_DetectCellBorderChange).DetectCellBorderChange
endFunction

string function toggleCellBorderVerbosity (int iRetCurVal)
var
	collection location
location = new collection
location = findSettingLocation (hKey_DetectCellBorderChange)
if ! iRetCurVal then
	;update the value
	CollectionUpdateBooleanItem (location, hKey_DetectCellBorderChange)
endIf
if location.DetectCellBorderChange then
	return msgDetectCellBorderChangeOn1_L
else
	return msgDetectCellBorderChangeOff1_L
endIf
EndFunction

int function MonitorCellTitles ()
return findSettingLocation (hKey_MonitorCellTitles).MonitorCellTitles
endFunction

string function toggleMonitorCellTitles (int iRetCurVal)
var
	collection location
location = new collection
location = findSettingLocation (hKey_MonitorCellTitles)
if ! iRetCurVal then
	;update the value
	location.MonitorCellTitles = ! location.MonitorCellTitles
endIf
if location.MonitorCellTitles then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

string function clearMonitorCells (int iRetCurVal)
var
	string item
If ! iRetCurVal then
	forEach item in xlActiveSheet
		if (stringContains (item, formatString (hKey_MonitorCell)))
			collectionRemoveItem (xlActiveSheet, item)
		endIf
	endForEach
EndIf
return GetAssignedMonitorCells()
EndFunction

string function getClearedMonitorCellInfo (string SettingID, int nReadSource)
var
	string item,
	int bItemsExist,
	int nState
forEach item in xlActiveSheet
	if (stringContains (item, formatString (hKey_MonitorCell)))
		bItemsExist = TRUE
	endIf
endForEach
nState = ! bItemsExist
return qsxmlMakeBoolean (settingID, qsxmlMakeBooleanState (nState))
endFunction

void function setClearedMonitorCellInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int nState,
	int bRemoved,
	string section = getActiveSheetName (),
	string strFile = matchNameToFileName (GetWorkbookJSIName ()),
	string item
parseXMLBooleanWriteRequest (sxmlWriteRequest, nState)
if (! nState) return endIf; act on check
forEach item in xlActiveSheet
	if (stringContains (item, formatString (hKey_MonitorCell)))
		collectionRemoveItem (xlActiveSheet, item)
		iniRemoveKeyEx (section, item, FLOC_USER_PERSONALIZED_SETTINGS, strFile)
		bRemoved = TRUE;
	endIf
endForEach
;flush if removed
if (bRemoved) iniFlushEX (FLOC_USER_PERSONALIZED_SETTINGS, strFile) endIf
endFunction

int Function MultipleRegionSupport ()
return findSettingLocation(hKey_MultipleRegionSupport).MultipleRegionSupport
endFunction

string function toggleMultipleRegionSupport (int iRetCurVal)
var
	string sMsg
if ! iRetCurVal then
	;update it
	CollectionUpdateBooleanItem (xlActiveSheet, hKey_MultipleRegionSupport)
	updateRegionPointer ()
	UpdateCXLCurrentRegion()
endIf
if !OverrideDocNamedTitles()
	if DocNamedMultipleRegionSupport() then
		let smsg = formatString (msg251_L,
			formatString (msgXThroughY1, getCurrentRegionTopLeft (), getCurrentRegionBottomRight ()))
	else
		let sMsg = formatString(msg250_L, getActiveSheetName())
	endIf
	let sMsg = smsg+cscSpace+msgDefineNameTitlesError
else
	if xlActiveSheet.MultipleRegionSupport then
		let smsg = formatString(msg251_l,getCurrentRegionName())
	else
		let sMsg = formatString(msg250_L, getActiveSheetName())
	EndIf
endIf
; cannot have period as part of string.
; so we change to underline char.
let smsg = stringReplaceChars(smsg,sc_period,sc_underlineChar)
return smsg
EndFunction

string function getMultipleRegionSupportInfo (string settingID)
var
	int nSelectIndex = xlActiveSheet[hKey_MultipleRegionSupport],
	stringArray szListItems,
	string sMsg,
	int nSize = 2
szListItems = new stringArray[nSize]
nSelectIndex = MultipleRegionSupport ()
let szListItems[2] = formatString (msg251_L,
	formatString (msgXThroughY1, getRealCurrentRegionTopLeft (), getRealCurrentRegionBottomRight ()))
let szListItems[1] = formatString(msg250_L, getActiveSheetName())
; cannot have period as part of string.
; so we change to underline char.
let szListItems[2] = stringReplaceChars(szListItems[2], sc_period, sc_underlineChar)
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize, (!OverrideDocNamedTitles() || !AllowPerformanceImpactingFeatures()))
endFunction

void function setMultipleRegionSupportInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
return MultipleRegionSupportDependee (iSelection)
endFunction

void function MultipleRegionSupportDependee (int iSelection)
xlActiveSheet[hKey_MultipleRegionSupport] = iSelection
updateRegionPointer ()
UpdateCXLCurrentRegion()
WriteSettingInteger (getActiveSheetName (), hKey_MultipleRegionSupport, xlActiveSheet[hKey_MultipleRegionSupport], FT_JSI, wdUser, matchNameToFileName (GetWorkbookJSIName ()))
UpdateRegionPointer ()
UpdateCXLCurrentRegion ()
endFunction

void function BrailleToggleTableReading ()
;override to link up global Braille zoom with xlUser.app.BrailleMode
var collection location
location = new collection
location = findSettingLocation (hKey_BrailleMode)
GIBrlTBLZoom = BrlStructuredMode ()
BrailleToggleTableReading ()
location.BrailleMode = GIBrlTBLZoom 
endFunction

int function BrlStructuredMode ()
return findSettingLocation (hKey_BrailleMode).BrailleMode
endFunction

string function ToggleBrlStructuredMode (int iRetCurVal)
var
	collection location,
		int max= XL_COL_VIEW

if IsVerticalAlignmentRelevant() then
	max = XL_PRIOR_AND_CUR_ROW_VIEW
endIf
	
location = new collection
location = findSettingLocation (hKey_BrailleMode)
if not iRetCurVal then
	
;update the value
	if location.BrailleMode < max then
		location.BrailleMode = location.BrailleMode +1
	else
		collectionRemoveItem (location, hKey_BrailleMode) ; set to XL_CELL_VIEW
	endIf
endIf
; now return the value
if location.BrailleMode == XL_CELL_VIEW then
	return msgBrlModeCell
elif location.BrailleMode == XL_ROW_VIEW then
	return msgBrlModeRow
elif location.BrailleMode == XL_COL_VIEW then
	return msgBrlModeColumn
elif location.BrailleMode == XL_ROW_WITH_COLTITLES_VIEW
return cMSGBrlZoomToRowPlusColTitles
elif location.BrailleMode == XL_PRIOR_AND_CUR_ROW_VIEW
return cMSGBrlZoomToCurAndPriorRow
endIf
EndFunction

string function GetBrlStructuredModeInfo (string settingID, int nReadSource)
var
	int nSelectIndex = ReadSettingInteger (SECTION_NonJCF_Options, hKey_BrailleMode, GIBrlTBLZoom, FT_CURRENT_JCF, nReadSource),
	stringArray szListItems,
	int nSize = 3

if IsVerticalAlignmentRelevant() then
	nSize = 5
endIf
	
szListItems = new stringArray[nSize]
szListItems[1] = msgBrlModeCell
szListItems[2] = msgBrlModeRow
szListItems[3] = msgBrlModeColumn
if nSize == 5 then
	szListItems[4] = cMSGBrlZoomToRowPlusColTitles
	szListItems[5] = cMSGBrlZoomToCurAndPriorRow
endIf

return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
endFunction

void function SetBrlStructuredModeInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int iSelection
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
let GIBrlTBLZoom = iSelection
writeSettingInteger (SECTION_NonJCF_Options, hKey_BrailleMode, GIBrlTBLZoom, FT_CURRENT_JCF, nWriteDestination)
endFunction

; This is to help with connecting the default Braille Zoom with Excel's Braille Mode feature.
string function GetTableDisplayBrailleZoomInfo (string settingID, int nReadSource)
var
	int nSelectIndex = ReadSettingInteger (SECTION_NonJCF_Options, hKey_BrailleMode, GIBrlTBLZoom, FT_CURRENT_JCF, nReadSource),
	stringArray szListItems,
	int nSize = 3

if IsVerticalAlignmentRelevant() then
	nSize = 5
endIf

szListItems = new stringArray[nSize]
szListItems[1] = cMsgBRLZoomToCell
szListItems[2] = cmsgBRLZoomToRow
szListItems[3] = cMsgBrlZoomToCol
if nSize == 5 then
	szListItems[4] = cMSGBrlZoomToRowPlusColTitles
	szListItems[5] = cMSGBrlZoomToCurAndPriorRow
endIf
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
endFunction

void function SetTableDisplayBrailleZoomInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int iSelection
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
let GIBrlTBLZoom = iSelection
writeSettingInteger (SECTION_NonJCF_Options, hKey_BrlTBLZoom, GIBrlTBLZoom, FT_CURRENT_JCF, nWriteDestination)
; now update the proper key name for Excel itself:
writeSettingInteger (SECTION_NonJCF_Options, hKey_BrailleMode, GIBrlTBLZoom, FT_CURRENT_JCF, nWriteDestination)
endFunction

int function DocSettingsAssoc ()
return findSettingLocation(hKey_SettingsFileAssoc).SettingsFileAssoc
endFunction

string function ToggleDocSettingsAssoc (int iRetCurVal)
var
	collection location,
	string sJSIName
location = new collection
location = findSettingLocation (hKey_SettingsFileAssoc)
if ! iRetCurVal then
	;update the value
	if location.SettingsFileAssoc == ASSOC_EXACT_MATCH then
		location.SettingsFileAssoc = ASSOC_BEST_MATCH
	ElIf location.SettingsFileAssoc == ASSOC_BEST_MATCH
	&& !fileExists( FindJAWSPersonalizedSettingsFile(GetWorkbookJSIName(),true)) then
		location.SettingsFileAssoc  = ASSOC_NEW_MATCH
	else
		location.SettingsFileAssoc = ASSOC_EXACT_MATCH
	endIf
	;updateWorkBookPointer (); don't update workbook, just apply existing settings to new file
endIf
; now repopulate the list and return the value
if location.SettingsFileAssoc  == ASSOC_EXACT_MATCH then
	let sJSIName=FindJAWSPersonalizedSettingsFile(GetWorkbookJSIName(),true)
	if !fileExists( FindJAWSPersonalizedSettingsFile(sJSIName,true)) then
		let sJSIName=msgNOSettings
	endIf
	return formatString(msgFileAssocExact,sJSIName)
ElIf location.SettingsFileAssoc  == ASSOC_BEST_MATCH then
	sJSIName = matchNameToFileName (GetWorkbookJSIName())
	;repopulate the list if settings was toggled:
	return formatString(msgAssocBestMatch,sJSIName)
else ;new match, create new JSI file if it does not exist
	return msgAssocNewMatch
endIf
EndFunction

string function getDocSettingsAssocInfo (string settingID)
var
	int nSelectIndex,
	stringArray szListItems,
	int nSize = 2,
	collection location,
	string sJSIName
szListItems = new stringArray[nSize]
location = new collection
location = findSettingLocation (hKey_SettingsFileAssoc)
nSelectIndex = location.SettingsFileAssoc
let sJSIName=FindJAWSPersonalizedSettingsFile(GetWorkbookJSIName(),true)
if !fileExists( FindJAWSPersonalizedSettingsFile(sJSIName,true)) then
	let sJSIName=msgNOSettings
endIf
szListItems[1] = formatString (msgFileAssocExact, sJSIName)
sJSIName = matchNameToFileName (GetWorkbookJSIName())
szListItems[2] = formatString(msgAssocBestMatch,sJSIName)
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setDocSettingsAssocInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	collection location,
	string sJSIName
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
; 0 = exact match, 1 = Best (closest) match.
location = new collection
location = findSettingLocation (hKey_SettingsFileAssoc)
location.SettingsFileAssoc = iSelection
;updateWorkBookPointer (); don't update workbook, just apply existing settings to new file
writeSettingInteger (SECTION_NonJCFOptions, "SettingsFileAssoc", location.SettingsFileAssoc, FT_CURRENT_JCF, nWriteDestination)
endFunction

int function TitleSpeaksForCells ()
;even though this is a title setting, it belongs to the sheet.
;otherwise you would set a region-specific setting that would potentially use cells outside the region.
return findSettingLocation (hKey_TitleSpeaksForCells).TitleSpeaksForCells
endFunction

string function ToggleTitleSpeaksForCells (int IRetCurVal)
;even though this is a title setting, it belongs to the sheet.
;otherwise you would set a region-specific setting that would potentially use cells outside the region.
var
	collection location
location = new collection
location = findSettingLocation(hKey_TitleSpeaksForCells	)
if ! iRetCurVal then
	;update the value
	CollectionUpdateBooleanItem (location, hKey_TitleSpeaksForCells)
endIf
if location.TitleSpeaksForCells == TitleForCellsAny then
	return msgTitleRestrictionOff
else
	return msgTitleRestrictionOn
endIf
endFunction

int function AllowPerformanceImpactingFeatures()
return xlWorkbook.doc.AllowPerformanceImpactingFeatures
endFunction

string function getAllowPerformanceImpactingFeaturesInfo(string settingID)
;This function only receives and sends the value of the option to Quick Settings,
;which means we do not need to perform any reinterpretation of the value for reading to and writing to file.
var int nState = xlWorkbook.doc.AllowPerformanceImpactingFeatures
return qsxmlMakeBoolean (settingID, qsxmlMakeBooleanState (nState), false)
EndFunction

void function setAllowPerformanceImpactingFeaturesInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
;This function manages writing to file the option's value received from Quick Settings.
;Because we show the setting as "Allow" in Quick Settings, and that is the default,
;the setting will be stored in the JSI file as "Disallow", with true meaning that allow is false.
;This way the absence of a JSI file, or the absence of the "Disallow" key in the JSI file means that "allow" is true.
;the key name in the ini file is DisallowPerformanceImpactingFeatures, whereas the collection item is called AllowPerformanceImpactingFeatures.
var int nState
parseXMLBooleanWriteRequest (sxmlWriteRequest, nState)
var string sFileName = matchNameToFileName (getWorkbookJSIName ())
;In the normal case where a value in memory matches the value saved to file,
;an option is removed from the collection and from the file when it is the default,
;and added to the collection and written to file when it is not the default.
;Note that here, the value written to file has the opposite meaning of the value stored in memory.
if !nState
	CollectionRemoveItem(xlWorkbook.doc,"AllowPerformanceImpactingFeatures")
	writeSettingInteger ("doc", hKey_DisallowPerformanceImpactingFeatures, 1, ft_jsi, wdUser, sFilename)
else
	var collection c
	c = xlWorkbook.doc
	c.AllowPerformanceImpactingFeatures = 1
	iniRemoveKeyEX ("doc", hKey_DisallowPerformanceImpactingFeatures, FLOC_USER_PERSONALIZED_SETTINGS, sFileName)
endIf
iniFlushEX (FLOC_USER_PERSONALIZED_SETTINGS, sFileName)
EndFunction

int function AnnounceTextVisible ()
return findSettingLocation(hKey_CelltextVisibility).CellTextVisibility
endFunction

string function toggleAnnounceTextVisible (int iRetCurVal)
var
	collection location
location = new collection
location = findSettingLocation (hKey_CelltextVisibility)
if ! iRetCurVal then
	;update the value
	CollectionUpdateBooleanItem (location, hKey_CelltextVisibility)
endIf
if location.CellTextVisibility then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

int function FormulasAnnounce ()
return findSettingLocation (hKey_Formulas).Formulas
endFunction

string function toggleFormulas (int iRetCurVal)
var
	collection location
location = new collection
location = findSettingLocation (hKey_Formulas)
if ! iRetCurVal then
	;update the value
	location = UpdateSettingLocation (hKey_Formulas)
else
	location = findSettingLocation (hKey_Formulas)
endIf
if location.Formulas then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

int function CommentsAnnounce ()
return findSettingLocation (hKey_Comments).Comments
endFunction

string function toggleComments (int iRetCurVal)
var
	collection location
location = new collection
if ! iRetCurVal then
	;update the value
	location = UpdateSettingLocation (hKey_Comments)
else
	location = findSettingLocation (hKey_Comments)
endIf
if location.Comments then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

int function CellShadingChangesAnnounce ()
return findSettingLocation (hKey_ShadingChanges).ShadingChanges
endFunction

string function toggleCellShadingChanges (int iRetCurVal)
var
	collection location
location = new collection
location = findSettingLocation (hKey_ShadingChanges)
if ! iRetCurVal then
	;update the value
	CollectionUpdateBooleanItem (location, hKey_ShadingChanges)
endIf
if location.ShadingChanges then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

int function FontChangesAnnounce ()
return findSettingLocation(hKey_FontChanges).FontChanges
endFunction

string function toggleFontChanges (int iRetCurVal)
var
	collection location
location = new collection
location = findSettingLocation (hKey_FontChanges)
if ! iRetCurVal then
	;update the value
	CollectionUpdateBooleanItem (location, hKey_FontChanges)
endIf
if location.FontChanges  then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

int function MergedCellsAnnounce ()
return findSettingLocation (hKey_mergedCells).MergedCells
endFunction

string function toggleMergedCells (int iRetCurVal)
var
	collection location
location = new collection
if ! iRetCurVal then
	;update the value
	location = updateSettingLocation (hKey_mergedCells)
else
	location = findSettingLocation (hKey_mergedCells)
endIf
if location.MergedCells then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

int function DetectFormatConditions ()
return findSettingLocation (hKey_FormatConditionsDetection).FormatConditionsDetection
endFunction

string function toggleDetectFormatConditions (int iRetCurVal)
var
	collection location
location = new collection
location = findSettingLocation (hKey_FormatConditionsDetection)
if ! iRetCurVal then
	;update the value
	CollectionUpdateBooleanItem (location, hKey_FormatConditionsDetection)
endIf
if location.FormatConditionsDetection then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

int function SmartTagsIndication ()
;return findSettingLocation (HKEY_SMART_TAGS).DetectSmartTags
return globalDetectSmartTags
endFunction

string function ToggleSmartTagsIndication (int iRetCurVal)
if ! iRetCurVal then
	;update the value
	let globalDetectSmartTags = !globalDetectSmartTags
EndIf
if globalDetectSmartTags then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

int function ObjectCountDetection ()
return FindSettingLocation (HKEY_OBJECTS_COUNT).DetectObjectCount
endFunction

string function ToggleObjectCountDetection (int iRetCurVal)
var
	collection location
location = new collection
location = FindSettingLocation (HKEY_OBJECTS_COUNT)
if ! iRetCurVal then
	; update it
	location.DetectObjectCount = ! location.DetectObjectCount
EndIf
;now return the value
if location.DetectObjectCount then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

int function FormControlsDetection ()
return findSettingLocation (hKey_FormControlsDetection).DetectFormControls
endFunction

string function ToggleFormControlsDetection (int iRetCurVal)
var
	collection location
location = new collection
location = findSettingLocation (hKey_FormControlsDetection)
if ! iRetCurVal then
	; update it
	CollectionUpdateBooleanItem (location, hKey_FormControlsDetection)
EndIf
;now return the value
if location.DetectFormControls  then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

int function PagebreaksDetection ()
return findSettingLocation (hKey_PagebreaksDetection).DetectPagebreaks
endFunction

string function TogglePagebreaksDetection (int iRetCurVal)
var
	collection location
location = new collection
location = findSettingLocation (hKey_PagebreaksDetection)
if ! iRetCurVal then
	; update it
	CollectionUpdateBooleanItem (location, hKey_PagebreaksDetection)
EndIf
;now return the value
if location.DetectPagebreaks then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

int function FilteredColumnsAndRowsDetection ()
return findSettingLocation (hKey_DetectFilters).DetectFilters
endFunction

string Function ToggleFilterDetection (int iRetCurVal)
var
	collection location
location = new collection
location = findSettingLocation (hKey_DetectFilters)
if ! iRetCurVal then
	;update the value
	CollectionUpdateBooleanItem (location, hKey_DetectFilters)
endIf
if location.DetectFilters then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

int function HyperlinkAddressAnnouncement ()
return findSettingLocation (hKey_HyperlinkAddressAnnouncement).HyperlinkAddressAnnouncement
endFunction

string Function ToggleHyperlinkAddressAnnouncement (int iRetCurVal)
var
	collection location
location = new collection
location = findSettingLocation (hKey_HyperlinkAddressAnnouncement)
if ! iRetCurVal then
	;update the value
	CollectionUpdateBooleanItem (location, hKey_HyperlinkAddressAnnouncement)
endIf
if location.HyperlinkAddressAnnouncement then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

int function OrientationIndication ()
return findSettingLocation (hKey_OrientationIndication).OrientationIndication
endFunction

String Function ToggleOrientationIndication (int iRetCurVal)
var
	collection location
location = new collection
location = findSettingLocation (hKey_OrientationIndication)
if ! iRetCurVal then
	;update the value
	CollectionUpdateBooleanItem (location, hKey_OrientationIndication)
endIf
if location.OrientationIndication  then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

int function TitleCellFontAndFormattingIndication ()
return findSettingLocation (hKey_TitleCellFontAndFormattingIndication).TitleCellFontAndFormattingIndication
endFunction

string Function ToggleTitleCellFontAndFormattingIndication (int iRetCurVal)
var
	collection location
location = new collection
location = findSettingLocation (hKey_TitleCellFontAndFormattingIndication)
if ! iRetCurVal then
	;update the value
	CollectionUpdateBooleanItem (location, hKey_TitleCellFontAndFormattingIndication)
endIf
if location.TitleCellFontAndFormattingIndication then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

string function getNamedRegionTitleSettings (optional int nTitlesFilter)
var
	int nStart, int nEnd,
	string sColData,
	string sRowData,
	int nTitleSettings = DocNamedTitleReadingVerbosity ()
if (nTitleSettings & readColumnTitles)
	getActiveRowTitleLocation ( nStart, nEnd)
	;msgRangeMultipleCells1_L
	if (nStart == nEnd)
		sRowData = cscSpace+intToString (nStart)
	else
		sRowData = cscSpace +formatString (msgRangeMultipleCells1_L, intToString (nStart), intToString (nEnd))
	endIf
	if (! nTitlesFilter)
		;apply bits only if user wants defaults
		nTitlesFilter = nTitlesFilter + readColumnTitles
	endIf
EndIf
if (nTitleSettings & readRowTitles)
	getActiveColumnTitleLocation (nStart, nEnd)
	if (nStart == nEnd)
		sColData = ColumnNumberToLetter (nStart)
	else
		sColData = formatString (msgRangeMultipleCells1_L, ColumnNumberToLetter (nStart), ColumnNumberToLetter (nEnd))
	endIf
	if (! nTitlesFilter)
		;apply bits only if user wants defaults
		nTitlesFilter = nTitlesFilter + readRowTitles
	endIf
endIf
if (nTitlesFilter == readColumnTitles)
	if (nTitlesFilter & readColumnTitles)
		return sRowData
	endIf
elif (nTitlesFilter == readRowTitles)
	if (nTitlesFilter & readRowTitles)
		return sColData
	endIf
elif (nTitlesFilter == readBothTitles)
	return sColData+sRowData
endIf
endFunction

void function OnDependeeInfoChange (string settingID, string xmlWriteRequest)
var
	int iSelection,
	int nTitleReading = TitleReadingVerbosity (),
	string sDependent,
	string sDependee
ParseXMLDependenceEvent (xmlWriteRequest, iSelection, sDependent)
sDependent = stringSegment (sDependent, ".", -1)
if sDependent == "OverrideDocNamedTitles" 
|| sDependent == "ClearDefinitions"
|| sDependent == "AllowPerformanceImpactingFeatures"
	return null()
endIf
sDependee = stringSegment (settingID, ".", -1)
;for Clear definitions and Multiple region support, we want to read but not write:
;if sDependee  == "ClearDefinitions" 
if sDependent == "MultipleRegionSupport" then
	return
elIf sDependee == "ColTitlesToRowRange" then
	return ColTitlesToRowRangeDependee (iSelection)
elIf sDependee == "RowTitlesToColumnRange" then
	return RowTitlesToColumnRangeDependee (iSelection)
elIf sDependee == "TitleReadingVerbosity" then
	;customize iSelection so it will properly set the title reading.
	if sDependent == "RowTitlesToColumnRange" && iSelection then
		iSelection = nTitleReading | readRowTitles
	elIf sDependent == "ColTitlesToRowRange" && iSelection then
		iSelection = nTitleReading | readColumnTitles
	endIf
	return TitleReadingVerbosityDependee (iSelection)
endIf
var string sDependee1 = stringSegment (settingID, ".", -2)
if stringStartsWith(sDependee1, "MonitorCell") then
	; The only thing listing these as dependents is Clear Monitor Cells,
	; so we use an empty address value for the dependents.
	xmc_address = ""
	return MonitorCellsDependee (stringToInt(sDependee))
endIf
endFunction

int function getColTitleSettings (int byRef nStart, int byRef nEnd)
;title rows for column
if !OverrideDocNamedTitles()
|| !(TitleReadingVerbosity () & readColumnTitles)
|| !xlActiveRegion
	return FALSE
endIf
nStart = xlActiveRegion.TitleRowStart
nEnd = xlActiveRegion.TitleRowEnd
if (nStart > 0 && nEnd > 0)
	return TRUE
else
	return FALSE
endIf
endFunction

void function setColumnTitles (int byRef nStart, int byRef nEnd)
var
	collection location,
	string strFile = matchNameToFileName (getWorkbookJSIName ()),
	string section
location = new collection;
location = findSettingLocation("NamedTitles")
if (nStart == 0 || nEnd == 0 || ! xlActiveRegion)
	return FALSE
endIf
if (multipleRegionSupport ())
	section = getRegionSectionName ()
else
	section = getActiveSheetName ()
endIf
if (! OverrideDocNamedTitles ())
	location.NamedTitles = 2;Current file
	WriteSettingInteger (SECTION_NonJCFOptions, "NamedTitles", 2, FT_CURRENT_JCF, wdUser)
endIf
xlActiveRegion.TitleReadingVerbosity = xlActiveRegion.TitleReadingVerbosity | ReadColumnTitles
WriteSettingInteger (section, "TitleReadingVerbosity", xlActiveRegion.TitleReadingVerbosity, FT_JSI, wdUser, strFile)
xlActiveRegion.TitleRowStart = nStart
xlActiveRegion.TitleRowEnd = nEnd
WriteSettingInteger (section, "TitleRowStart", nStart, FT_JSI, wdUser, strFile)
WriteSettingInteger (section, "TitleRowEnd", nEnd, FT_JSI, wdUser, strFile)
UpdateCXLActiveCellTitles ()
return TRUE
endFunction

string function setColTitlesToRowRange (int iRetCurVal)
var
	int bAlreadyDefined,
	int nOverride,
	int nStart, int nEnd,
	string sNamedRegionTitleSettings
bAlreadyDefined = (collectionItemExists (xlActiveRegion, "TitleRowStart")
	&& collectionItemExists (xlActiveRegion, "TitleRowEnd"))
nOverride = OverrideDocNamedTitles ()
if ! iRetCurVal then
	if nOverride >0 then
		;update the value
		GetValueToSetTitleRow (nStart, nEnd)
		if (nStart && nEnd)
			xlActiveRegion.TitleRowStart = nStart
			xlActiveRegion.TitleRowEnd = nEnd
		endIf
	endIf
	xlActiveRegion.TitleReadingVerbosity = xlActiveRegion.TitleReadingVerbosity | ReadColumnTitles
	UpdateCXLActiveCellTitles ()
endIf
;now return the value
if (nOverride)
	if xlActiveRegion.TitleRowStart then
		;something defined
		if (xlActiveRegion.TitleRowStart == xlActiveRegion.TitleRowEnd)
			;one row
			if nOverride && bAlreadyDefined && ! iRetCurVal then
				return formatString (msgRangeOneCell1_L, intToString (xlActiveRegion.TitleRowStart))+cscSpace
					+msgAlreadyDefinedTitlesError
			endIf
			return formatString (msgRangeOneCell1_L, intToString (xlActiveRegion.TitleRowStart))
		else
			;multiple rows
			if nOverride && bAlreadyDefined && ! iRetCurVal then
				return formatString (msgRangeMultipleCells1_L,
					intToString (xlActiveRegion.TitleRowStart), intToString (xlActiveRegion.TitleRowEnd))+cscSpace
					+msgAlreadyDefinedTitlesError
			endIf
			return formatString (msgRangeMultipleCells1_L,
				intToString (xlActiveRegion.TitleRowStart), intToString (xlActiveRegion.TitleRowEnd))
		endIf
	else
		return msgUndefined1_L
	EndIf
else
	sNamedRegionTitleSettings = getNamedRegionTitleSettings (ReadColumnTitles)
	if sNamedRegionTitleSettings then
		return sNamedRegionTitleSettings+msgDefineNameTitlesError
	else
		return msgUndefined1_L+cscSpace+msgDefineNameTitlesError
	endIf
endIf
EndFunction

string function getColTitlesToRowRangeInfo (string settingID)
var
	int nStart, int nEnd,
	int nSelectIndex,
	stringArray szListItems,
	string sMsg1, string sMsg2,
	int nSize = 2,
	int bAlreadyDefined,
	int nOverride,
	string sNamedRegionTitleSettings
szListItems = new stringArray[nSize]
bAlreadyDefined = (collectionItemExists (xlActiveRegion, "TitleRowStart")
	|| collectionItemExists (xlActiveRegion, "TitleRowEnd"))
nOverride = OverrideDocNamedTitles ()
if bAlreadyDefined then
	;something defined
	;first index item is 'no change' optionally ddon't act.
	sMsg1 = uoSayAllSchemeNoChange
	nSelectIndex = 1 ; The one it's on.
	if (xlActiveRegion.TitleRowStart == xlActiveRegion.TitleRowEnd)
		;one row
		sMsg2 = formatString (msgRangeOneCell1_L, intToString (xlActiveRegion.TitleRowStart))
	else
		;multiple rows
		sMsg2 = formatString (msgRangeMultipleCells1_L,
			intToString (xlActiveRegion.TitleRowStart), intToString (xlActiveRegion.TitleRowEnd))
	endIf
else
	GetValueToSetTitleRow (nStart, nEnd)
	;In case end is 0, makes it one cell:
	if (nEnd == 0) nEnd = nStart endIf
	if (nStart == 0) nStart = nEnd endIf ; rare event but technically possible.
	if (nStart == nEnd)
		;one row
		sMsg2 = formatString (msgRangeOneCell1_L, intToString (nStart))
	else
		;multiple rows
		sMsg2 = formatString (msgRangeMultipleCells1_L,
			IntToString (nStart), IntToString (nEnd))
	endIf
	sMsg1 = msgUndefined1_L
EndIf
szListItems[1] = sMsg1
szListItems[2] = sMsg2
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize, ! nOverride)
endFunction

void function setColTitlesToRowRangeInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
return ColTitlesToRowRangeDependee (iSelection)
endFunction

void function ColTitlesToRowRangeDependee (int iSelection)
var
	int bAlreadyDefined,
	int nOverride,
	int nStart, int nEnd,
	string strFile = matchNameToFileName (GetWorkbookJSIName ()),
	string sectionName = getRegionSectionName ()
if ! iSelection   then
	collectionRemoveItem (xlActiveRegion,hKey_TitleRowStart)
	collectionRemoveItem (xlActiveRegion,hKey_TitleRowEnd)
	iniRemoveKeyEx (sectionName, hKey_TitleRowStart, FLOC_USER_PERSONALIZED_SETTINGS, strFile)
	iniRemoveKeyEx (sectionName, hKey_TitleRowEnd, FLOC_USER_PERSONALIZED_SETTINGS, strFile)
	return TRUE
endIf
bAlreadyDefined = (collectionItemExists (xlActiveRegion, "TitleRowStart")
	|| collectionItemExists (xlActiveRegion, "TitleRowEnd"))
nOverride = OverrideDocNamedTitles ()
if nOverride >0 then
	;update the value
	GetValueToSetTitleRow (nStart, nEnd)
	if (nEnd == 0) nEnd = nStart endIf; likely scenario for one cell.
	if (nStart == 0) nStart = nEnd endIf ; unlikely scenario but still possible for one cell.
	if (nStart && nEnd)
		xlActiveRegion.TitleRowStart = nStart
		xlActiveRegion.TitleRowEnd = nEnd
		WriteSettingInteger (sectionName, "TitleRowStart", nStart, FT_JSI, wdUser, strFile)
		WriteSettingInteger (sectionName, "TitleRowEnd", nEnd, FT_JSI, wdUser, strFile)
	endIf
endIf
;UpdateCXLActiveCellTitles ()
endFunction

int function getRowTitleSettings (int byRef nStart, int byRef nEnd)
;title columns for row
if !OverrideDocNamedTitles()
|| !(TitleReadingVerbosity () & readRowTitles)
|| !xlActiveRegion
	return FALSE
endIf
nStart = xlActiveRegion.TitleColStart
nEnd = xlActiveRegion.TitleColEnd
if (nStart > 0 && nEnd > 0)
	return TRUE
else
	return FALSE
endIf
endFunction

void function setRowTitles (int byRef nStart, int byRef nEnd)
var
	collection location,
	string strFile = matchNameToFileName (getWorkbookJSIName ()),
	string section
location = new collection;
location = findSettingLocation("NamedTitles")
if (nStart == 0 || nEnd == 0 || ! xlActiveRegion)
	return FALSE
endIf
if (multipleRegionSupport ())
	section = getRegionSectionName ()
else
	section = getActiveSheetName ()
endIf
if (! OverrideDocNamedTitles ())
	location.NamedTitles = 2;Current file
	WriteSettingInteger (SECTION_NonJCFOptions, "NamedTitles", 2, FT_CURRENT_JCF, wdUser)
endIf
xlActiveRegion.TitleReadingVerbosity = xlActiveRegion.TitleReadingVerbosity | ReadRowTitles
WriteSettingInteger (section, "TitleReadingVerbosity", xlActiveRegion.TitleReadingVerbosity, FT_JSI, wdUser, strFile)
xlActiveRegion.TitleColStart = nStart
xlActiveRegion.TitleColEnd = nEnd
WriteSettingInteger (section, "TitleColStart", nStart, FT_JSI, wdUser, strFile)
WriteSettingInteger (section, "TitleColEnd", nEnd, FT_JSI, wdUser, strFile)
UpdateCXLActiveCellTitles ()
return TRUE
endFunction

string function setRowTitlesToColumnRange (int iRetCurVal)
var
	int bAlreadyDefined,
	int nOverride,
	int nStart, int nEnd,
	string sNamedRegionTitleSettings
bAlreadyDefined = (collectionItemExists (xlActiveRegion, "TitleColStart")
	&& collectionItemExists (xlActiveRegion, "TitleColEnd"))
nOverride = OverrideDocNamedTitles ()
if ! iRetCurVal then
	if nOverride >0 then
		; update the value
		GetValueToSetTitleColumn (nStart, nEnd)
		if (nStart && nEnd)
			xlActiveRegion.TitleColStart = nStart
			xlActiveRegion.TitleColEnd = nEnd
		endIf
	endIf
	xlActiveRegion.TitleReadingVerbosity = xlActiveRegion.TitleReadingVerbosity | ReadRowTitles
	UpdateCXLActiveCellTitles ()
endIf
;now return the value
if (nOverride)
	if xlActiveRegion.TitleColStart then
		;something defined
		if (xlActiveRegion.TitleColStart == xlActiveRegion.TitleColEnd)
			;one column
			if nOverride && bAlreadyDefined && !iRetCurVal then
				return formatString(msgRangeOneCell1_L,
					columnNumberToLetter (xlActiveRegion.TitleColStart))+cscSpace+msgAlreadyDefinedTitlesError
			EndIf
			return formatString(msgRangeOneCell1_L, columnNumberToLetter(xlActiveRegion.TitleColStart))
		else
			;multiple columns
			if nOverride && bAlreadyDefined && !iRetCurVal then
				return formatString(msgRangeMultipleCells1_L,
					columnNumberToLetter (xlActiveRegion.TitleColStart), columnNumberToLetter(xlActiveRegion.TitleColEnd))+cscSpace+msgAlreadyDefinedTitlesError
			EndIf
			return formatString(msgRangeMultipleCells1_L,
				columnNumberToLetter(xlActiveRegion.TitleColStart), columnNumberToLetter(xlActiveRegion.TitleColEnd))
		endIf
	else
		return msgUndefined1_L
	EndIf
else
	sNamedRegionTitleSettings = getNamedRegionTitleSettings (ReadRowTitles)
	if sNamedRegionTitleSettings then
		return sNamedRegionTitleSettings+msgDefineNameTitlesError
	else
		return msgUndefined1_L+cscSpace+msgDefineNameTitlesError
	endIf
endIf
EndFunction

string function getRowTitlesToColumnRangeInfo (string settingID)
var
	int nStart, int nEnd,
	int nSelectIndex,
	stringArray szListItems,
	string sMsg1, string sMsg2,
	int nSize = 2,
	int bAlreadyDefined,
	int nOverride,
	string sNamedRegionTitleSettings
szListItems = new stringArray[nSize]
bAlreadyDefined = (collectionItemExists (xlActiveRegion, hKey_TitleColStart)
	|| collectionItemExists (xlActiveRegion, hKey_TitleColEnd))
nOverride = OverrideDocNamedTitles ()
if xlActiveRegion[hKey_TitleColStart] then
	;something defined
	;first index item is 'no change' optionally ddon't act.
	sMsg1 = uoSayAllSchemeNoChange
	nSelectIndex = 1 ; The one it's on.
	if (xlActiveRegion[hKey_TitleColStart] == xlActiveRegion[hKey_TitleColEnd])
		;one Column
		sMsg2 = formatString (msgRangeOneCell1_L, ColumnNumberToLetter (xlActiveRegion[hKey_TitleColStart]))
	else
		;multiple Columns
		sMsg2 = formatString (msgRangeMultipleCells1_L,
			ColumnNumberToLetter (xlActiveRegion[hKey_TitleColStart]), ColumnNumberToLetter (xlActiveRegion[hKey_TitleColEnd]))
	endIf
else
	GetValueToSetTitleColumn (nStart, nEnd)
	;In case end is 0, makes it one cell:
	if (nEnd == 0) nEnd = nStart endIf
	if (nStart == 0) nStart = nEnd endIf ; rare event but technically possible.
	if (nStart == nEnd)
		;one Column
		sMsg2 = formatString (msgRangeOneCell1_L, ColumnNumberToLetter (nStart))
	else
		;multiple Columns
		sMsg2 = formatString (msgRangeMultipleCells1_L,
			ColumnNumberToLetter (nStart), ColumnNumberToLetter (nEnd))
	endIf
	sMsg1 = msgUndefined1_L
EndIf
szListItems[1] = sMsg1
szListItems[2] = sMsg2
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize, ! nOverride)
endFunction

void function setRowTitlesToColumnRangeInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection

parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
return RowTitlesToColumnRangeDependee (iSelection)
endFunction

void function RowTitlesToColumnRangeDependee (int iSelection)
var
	int bAlreadyDefined,
	int nOverride,
	int nStart, int nEnd,
	string strFile = matchNameToFileName (GetWorkbookJSIName ()),
	string sectionName = getRegionSectionName ()
bAlreadyDefined = (collectionItemExists (xlActiveRegion, "TitleColStart")
	|| collectionItemExists (xlActiveRegion, "TitleColEnd"))
nOverride = OverrideDocNamedTitles ()
if ! iSelection  then
	collectionRemoveItem (xlActiveRegion, hKey_TitleColStart)
	collectionRemoveItem (xlActiveRegion, hKey_TitleColEnd)
	iniRemoveKeyEx (sectionName, hKey_TitleColStart, FLOC_USER_PERSONALIZED_SETTINGS, strFile)
	iniRemoveKeyEx (sectionName, hKey_TitleColEnd, FLOC_USER_PERSONALIZED_SETTINGS, strFile)
	return TRUE
endIf
if nOverride >0 then
	;update the value
	GetValueToSetTitleColumn (nStart, nEnd)
	;In case end is 0, makes it one cell:
	if (nEnd == 0) nEnd = nStart endIf
	if (nStart == 0) nStart = nEnd endIf ; rare event but technically possible.
	if (nStart && nEnd)
		xlActiveRegion.TitleColStart = nStart
		xlActiveRegion.TitleColEnd = nEnd
		WriteSettingInteger (sectionName, "TitleColStart", nStart, FT_JSI, wdUser, strFile)
		WriteSettingInteger (sectionName, "TitleColEnd", nEnd, FT_JSI, wdUser, strFile)
	endIf
endIf
;UpdateCXLActiveCellTitles ()
return TRUE
endFunction

int function TotalsColumnIsOff()
return gbTotalsColumnSettingType == TotalsSettingOff
	|| !xlActiveRegion.TotalsColumn
EndFunction

int function TotalsRowIsOff()
return gbTotalsRowSettingType == TotalsSettingOff
	|| !xlActiveRegion.TotalsRow
endFunction

int function getTotalsColumnSetting()
if gbTotalsColumnSettingType == TotalsSettingOff
|| !xlActiveRegion.TotalsColumn
|| xlActiveRegion.TotalsColumn == -1
	;Setting is off,
	;or it is stored only in memory
	;to keep braille from looping through object model calls
	;to find the auto total several times a second.
	return 0
else
	return xlActiveRegion.TotalsColumn
EndIf
endFunction

void function SetTotalsColumnSetting(int iTotalLocation, optional int bIsAuto)
;Since this is called to set a totals column,
;the setting is not being turned off, it is auto or defined.
xlActiveRegion.TotalsColumn = iTotalLocation
if bIsAuto
	;gbTotalsColumnSettingIsAuto  is used to indicate whether or not setting is only in memory
	;to keep braille from looping through object model calls
	;to find the auto total several times a second.
	gbTotalsColumnSettingType = TotalsSettingAuto
	writeSettingInteger (getRegionSectionName(), "TotalsColumn", -1, ft_jsi, wdUser, matchNameToFileName (getWorkbookJSIName ()))
else
	gbTotalsColumnSettingType = TotalsSettingDefined
	WriteSettingInteger (getRegionSectionName (), "TotalsColumn", iTotalLocation, FT_JSI, wdUser, matchNameToFileName (GetWorkbookJSIName ()))
EndIf
updateRowTotalText(iTotalLocation)
endFunction

string function getTotalsInfo (string settingID, string rowOrColumn)
; Make the option list for row or column totals.
; Called by getTotalsColumn/RowInfo functions.
var
	int nSetting,
	int nCurrent,
	int nSelectIndex,
	stringArray szListItems,
	intArray szValues,
	int nSize
szListItems = new StringArray[4]  ; max count of items possible
szValues = new intArray[4]
szListItems[1] = cmsgOff
szValues[1] = 0
szListItems[2] = msgAuto1_L
szValues[2] = -1
if rowOrColumn == "Column"
	if gbTotalsColumnSettingType == TotalsSettingOff
		nSelectIndex = 1
	elif gbTotalsColumnSettingType == TotalsSettingDefined && xlActiveRegion.TotalsColumn
		nSelectIndex = 3
	else ;auto
		nSelectIndex = 2
	endIf
else
	if gbTotalsRowSettingType == TotalsSettingOff
		nSelectIndex = 1
	elif gbTotalsRowSettingType == TotalsSettingDefined && xlActiveRegion.TotalsRow
		nSelectIndex = 3
	else ;auto
		nSelectIndex = 2
	endIf
endIf
; Option for currently active cell's row or column
if rowOrColumn == "Column"
	GetValueToSetTitleColumn (nCurrent, 0)
	szListItems[3] = formatString(msgTotalRowColumn, columnNumberToLetter(nCurrent))
else
	GetValueToSetTitleRow (nCurrent, 0)
	szListItems[3] = formatString(msgTotalColumnRow, intToString (nCurrent))
endIf
szValues[3] = nCurrent
nSize = 3
; Option for currently assigned value if different than above.
if rowOrColumn == "Column"
&& gbTotalsColumnSettingType == TotalsSettingDefined
	nSetting = xlActiveRegion.TotalsColumn
	if nSetting && nSetting != nCurrent
		szListItems[4] = formatString(msgTotalRowColumn, columnNumberToLetter(nSetting))
		szValues[4] = nSetting
		nSize = 4
		nSelectIndex = 4
	endIf
elif rowOrColumn == "Row"
&& gbTotalsRowSettingType == TotalsSettingDefined
	nSetting = xlActiveRegion.TotalsRow
	if nSetting && nSetting != nCurrent
		szListItems[4] = formatString(msgTotalColumnRow, intToString (nSetting))
		szValues[4] = nSetting
		nSize = 4
		nSelectIndex = 4
	endIf
endIf
if !xlSettingsMap then
	xlSettingsMap = new collection
endIf
xlSettingsMap["totals"+rowOrColumn] = szValues
var int i, string item
for i = 1 to nSize
	item = szListItems[i]
	if i == nSelectIndex
		szListItems[i] = formatString(msgQSNoChange, item)
	endIf
endFor
return QsxmlMakeList (settingID, nSelectIndex-1, szListItems, nSize)
endFunction

string function getTotalsColumnInfo (string settingID)
return getTotalsInfo(settingID, "Column")
endFunction

void function setTotalsColumnInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	int nSetting
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
iSelection = iSelection +1
var intArray szValues = xlSettingsMap["totalsColumn"]
nSetting = szValues[iSelection]
if nSetting == 0
	gbTotalsColumnSettingType = TotalsSettingOff
	CollectionRemoveItem (xlActiveRegion, "TotalsColumn")
	iniRemoveKey (getRegionSectionName (), "TotalsColumn", matchNameToFileName (GetWorkbookJSIName ()))
elif nSetting == -1
	;the setting will now be in memory only:
	gbTotalsColumnSettingType = TotalsSettingAuto
	xlActiveRegion.TotalsColumn = -1
	WriteSettingInteger (getRegionSectionName(), "TotalsColumn", -1, FT_JSI, nWriteDestination, matchNameToFileName (GetWorkbookJSIName ()))
else
	gbTotalsColumnSettingType = TotalsSettingDefined
	xlActiveRegion.TotalsColumn = nSetting
	WriteSettingInteger (getRegionSectionName (), "TotalsColumn", nSetting, FT_JSI, nWriteDestination, matchNameToFileName (GetWorkbookJSIName ()))
endIf
endFunction

int function getTotalsRowSetting ()
if gbTotalsRowSettingType == TotalsSettingOff
|| !xlActiveRegion.TotalsRow
|| xlActiveRegion.TotalsRow == -1
	;Setting is stored only in memory
	;to keep braille from looping through object model calls
	;to find the auto total several times a second.
	return 0
else
	return xlActiveRegion.TotalsRow
EndIf
endFunction

int function SetTotalsRowSetting(int iTotalLocation, int bIsAuto)
;Since this is called to set a totals row,
;the setting is not being turned off, it is auto or defined.
xlActiveRegion.TotalsRow = iTotalLocation
if bIsAuto
	;gbTotalsRowSettingIsAuto is used to indicate whether or not setting is only in memory
	;to keep braille from looping through object model calls
	;to find the auto total several times a second.
	gbTotalsRowSettingType = TotalsSettingAuto
	writeSettingInteger (getRegionSectionName (), "TotalsRow", -1, ft_jsi, wdUser, matchNameToFileName (getWorkbookJSIName ()))
else
	gbTotalsRowSettingType = TotalsSettingDefined
	WriteSettingInteger (getRegionSectionName (), "TotalsRow", iTotalLocation, FT_JSI, wdUser, matchNameToFileName (GetWorkbookJSIName ()))
EndIf
updateColumnTotalText(iTotalLocation)
endFunction

string function getTotalsRowInfo (string settingID)
return getTotalsInfo(settingID, "Row")
endFunction

void function setTotalsRowInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	int nSetting
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
iSelection = iSelection +1
var intArray szValues = xlSettingsMap["totalsRow"]
nSetting = szValues[iSelection]
if nSetting == 0
	gbTotalsRowSettingType = TotalsSettingOff
	CollectionRemoveItem (xlActiveRegion, "TotalsRow")
	iniRemoveKey (getRegionSectionName(), "TotalsRow", matchNameToFileName (GetWorkbookJSIName ()))
elif nSetting == 0
	;the setting will now be in memory only:
	gbTotalsRowSettingType = TotalsSettingAuto
	xlActiveRegion.TotalsRow = -1
	WriteSettingInteger (getRegionSectionName (), "TotalsRow", 0, FT_JSI, nWriteDestination, matchNameToFileName (GetWorkbookJSIName ()))
else
	gbTotalsRowSettingType = TotalsSettingDefined
	xlActiveRegion.TotalsRow = nSetting
	WriteSettingInteger (getRegionSectionName (), "TotalsRow", nSetting, FT_JSI, nWriteDestination, matchNameToFileName (GetWorkbookJSIName ()))
endIf
endFunction

string Function getDefaultOptionsLists()
;this list will also include the default Braille List.
var
	string sList,
	string sSegment,
	string sListItem,
	string sTemp,
	int index,
	int iCount

let sList=cStrDefaultList()
if BrailleInUse() then
	let sList=sList+
		cStrBrailleList()+
		cstrBrailleMarkingList()+
		cStrDefaultHTMLList()+
		cStrTableBrailleList()
endIf
let iCount=stringSegmentCount(sList,csList_delim)
let index=2
while index<=iCount
	let sSegment=stringSegment(sList,csList_delim,index)
	let sListItem=subString(sSegment,stringContains(sSegment,RANGE_SEPARATOR)+1,stringLength(sSegment))
	let sTemp=sTemp+csList_delim+sListItem
	let index=index+1
endWhile
return sTemp
endFunction

int Function IsDefaultOption(handle hwnd)
var
	string sText
let sText=tvGetFocusItemText(hwnd)
let sText=stringLeft(sText,stringContains(sText," - ")-1)
if !stringSegmentIndex(GetDefaultOptionsLists(),list_item_separator,sText,false) then
	return false
endIf
return true
endFunction

int Function UserBufferOverVirtualDocument ()
Return (! isChartActive ()
&& UserBufferOverVirtualDocument ())
endFunction

string Function NodeHlp (string sNodeName)
If sNodeName==Node_Formatting then
	return FormattingHlp()
elIf sNodeName==node_CellAppearance then
	return CellAppearanceHlp()
ElIf sNodeName==NODE_TitleReading then
	return TitleReadingHlp()
ElIf sNodeName==NODE_MonitoringCells then
	return MonitoringCellsHlp()
elIf sNodeName==node_PropertiesOfCells then
	return PropertiesOfCellsHlp()
ElIf sNodeName==NODE_WorkbookSettings then
	return WorkbookSettingsHlp()
ElIf sNodeName==NODE_reading then
	return ReadingOptionsHlp()
else
	Return NodeHlp (sNodeName);Default
EndIf
EndFunction

String Function FormattingHlp()
Return msgUO_FormattingHlp
EndFunction

String Function CellAppearanceHlp()
Return msgUO_CellAppearanceHlp
EndFunction

String Function TitleReadingHlp()
Return msgUO_TitleReadingHlp
EndFunction

String Function MonitoringCellsHlp()
return msgUO_MonitoringCellsHlp
EndFunction

String Function PropertiesOfCellsHlp()
return msgUO_PropertiesOfCellsHlp
EndFunction

String Function WorkbookSettingsHlp()
return msgUO_WorkbookSettingsHlp
EndFunction

String function ToggleNumberFormatVerbosityHLP (int iRetCurVal)
return formatString(msgUO_ToggleNumberFormatVerbosityHlp,msgDefaultSettingIsOff)
EndFunction

String function ToggleFormulasHlp (int iRetCurVal)
return formatString(msgUO_ToggleFormulasHlp,msgDefaultSettingIsOn)
EndFunction

String function ToggleCommentsHlp (int iRetCurVal)
return formatString(msgUO_ToggleCommentsHlp,msgDefaultSettingIsOn)
EndFunction

String function toggleMergedCellsHlp (int iRetCurVal)
return formatString(msgUO_toggleMergedCellsHlp,msgDefaultSettingIsOn)
EndFunction

String function ToggleCellBorderVerbosityHlp(int iRegCurVal)
return formatString(msgUO_ToggleCellBorderVerbosityHlp,msgDefaultSettingIsOff)
EndFunction

String function ToggleCellshadingChangesHlp (int iRetCurVal)
return formatString(msgUO_ToggleCellshadingChangesHlp,msgDefaultSettingIsOff)
EndFunction

String function ToggleFontChangesHlp (int iRetCurVal)
return formatString(msgUO_ToggleFontChangesHlp,msgDefaultSettingIsOff)
EndFunction

String function ToggleMultipleRegionSupportHlp (int iRetCurVal)
return msgUO_ToggleMultipleRegionSupportHlp
EndFunction

String function ToggleTitleReadingVerbosityHlp (int iRetCurVal)
return formatString(msgUO_ToggleTitleReadingVerbosityHlp,msgDefaultSettingIsOff)
EndFunction

String function ToggleTitleSpeaksForCellsHlp (int iRetCurVal)
return msgUO_ToggleTitleSpeaksForCellsHlp
EndFunction

String function SetColTitlesToRowRangeHlp (int iRetCurVal)
return FormatString(msgUO_SetColTitlesToRowRangeHlp)
EndFunction

String function SetRowTitlesToColumnRangeHlp (int iRetCurVal)
return FormatString(msgUO_SetRowTitlesToColumnRangeHlp)
EndFunction

String function SetNextAvailableMonitorCellHlp (int iRetCurVal)
return msgUO_SetNextAvailableMonitorCellHlp
EndFunction

String function ToggleMonitorCellTitlesHlp (int iRetCurVal)
return formatString(msgUO_ToggleMonitorCellTitlesHlp,msgDefaultSettingIsOn)
EndFunction

String function ClearMonitorCellsHlp (int iRetCurVal)
return msgUO_ClearMonitorCellsHlp
EndFunction

String function ClearRegionDefinitionsHlp (int iRetCurVal)
return msgUO_ClearRegionDefinitionsHlp
EndFunction

String function ToggleDocSettingsAssocHlp (int iRetCurVal)
return msgUO_ToggleDocSettingsAssocHlp
EndFunction

String function ToggleOverrideDocNamedTitlesHlp (int iRetCurVal)
return FormatString(msgUO_ToggleOverrideDocNamedTitlesHlp)
EndFunction

String function ToggleAnnounceTextVisibleHlp (int iRetCurVal)
return formatString(msgUO_ToggleAnnounceTextVisibleHlp,msgDefaultSettingIsOff)
EndFunction

String function ToggleDetectFormatConditionsHlp (int iRetCurVal)
return formatString(msgUO_ToggleDetectFormatConditionsHlp,msgDefaultSettingIsOff)
EndFunction

String Function ToggleCellReadingVerbosityHlp (int iRetCurVal)
return msgUO_ToggleCellReadingVerbosityHlp
EndFunction

String Function toggleSelectionReadingVerbosityHlp (int iRetCurVal)
return 	msgUO_SelectionReadingVerbosityFirstAndLastHlp
EndFunction

String Function ReadingOptionsHlp ()
Return FormatString(msgUO_ExcelReadingOptionsHlp)
EndFunction

String Function BrailleOptionsHlp ()
Return msgUO_ExcelBrailleOptionsHlp
EndFunction

String Function ToggleBrlStructuredModeHlp (int iRetCurVal)
return msgUO_ToggleBrlStructuredModeHlp
EndFunction

String Function ToggleSmartTagsIndicationHlp (int iRetCurVal)
return formatString(msgUO_ToggleSmartTagsIndicationHlp,msgDefaultSettingIsOff)
EndFunction

String function ExcelCustomLabelsSet (int iRetCurVal)
var
	int iSetting
Let iSetting = GetJcfOption(OPT_USE_CUSTOM_LABELS)
If !iRetCurVal then
	Let iSetting = !iSetting
	SetJcfOption(OPT_USE_CUSTOM_LABELS,iSetting)
EndIf
If !iSetting then
	return msgUO_Off
else
	return msgUO_On
EndIf
EndFunction

String function ExcelCustomLabelsSetHlp (int iRetCurVal)
Return FormatString(msgUO_ExcelCustomLabelsSetHlp,GetScriptKeyName(sn_CreatePrompt),msgDefaultSettingIsOn)
EndFunction

String Function LanguageDetectChangeHlp (int iRetCurVal)
Return formatString(msgUO_ExcelLanguageDetectChangeHlp,msgDefaultSettingIsOn)
EndFunction

String Function ToggleObjectCountDetectionHlp (int iRetCurVal)
return formatString(msgUO_ToggleObjectCountDetectionHlp,msgDefaultSettingIsOn)
EndFunction

String Function ToggleFormControlsDetectionHlp (int iRetCurVal)
return formatString(msgUO_ToggleFormControlsDetectionHlp,msgDefaultSettingIsOff)
EndFunction

string Function TogglePagebreaksDetectionHlp (int iRetCurVal)
return formatString(msgUO_TogglePagebreaksDetectionHlp,msgDefaultSettingIsOff)
EndFunction

string Function ToggleFilterDetectionHlp (int iRetCurVal)
return formatString(msgUO_ToggleFilterDetectionHlp,msgDefaultSettingIsOff)
EndFunction

string Function ToggleHyperlinkAddressAnnouncementHlp (int iRetCurVal)
return formatString(msgUO_ToggleHyperlinkAddressAnnouncementHlp,msgDefaultSettingIsOff)
EndFunction

string Function ToggleOrientationIndicationHlp (int iRetCurVal)
return formatString(msgUO_ToggleOrientationIndicationHlp,msgDefaultSettingIsOff)
EndFunction

string function TreeCoreGetDefaultBrailleOptions (optional int DiscardRootNode)
var
	string sList,
	string sRootName
if !DiscardRootNode then
	let sRootName = NODE_BRL_
EndIf
let sList =
	UO_ToggleBrlStructuredMode+_dlg_separator
ConvertListToNodeList(sList,sRootName)
return sList+TreeCoreGetDefaultBrailleOptions(DiscardRootNode)
EndFunction

String function TreeCoreGetDefaultReadingOptions ()
;overwritten here to prevent wrong Custom Labels option from displaying.
var
	string sBranch
Let sBranch =
	UO_SmartWordReadingSet+_dlg_separator+
	UO_LanguageDetectChange+_dlg_separator+
	UO_ExcelCustomLabelsSet+_dlg_separator+
	UO_StopWordsExceptionDictionaryToggle+_dlg_separator
ConvertListToNodeList(sBranch,NODE_READING)
return sBranch
EndFunction

string Function TreeCoreGetDefaultOptions ()
var
	;	string sNodeName,; the branch or group of application-speicific options.
	string sList,; the list of options in a particular branch or group.
	string sXLList ;the master list that comprises all the items in the main application branch,
		;all its children branches, and leaves.

;set up each branch or group of application-speicific options.
;Formatting Options:
	Let sList=
		UO_ToggleNumberFormatVerbosity+_dlg_separator+
		UO_ToggleFontChanges+_dlg_separator+
		UO_ToggleTitleCellFontAndFormattingIndication+_dlg_separator+
		UO_ToggleDetectFormatConditions+_Dlg_separator
	ConvertListToNodeList (sList,node_Formatting+NODE_PATH_DELIMITER)
	let sXLList=sXLList+sList

;Cell Appearance:
	Let sList=
		UO_ToggleCellBorderVerbosity+_Dlg_separator+
		UO_ToggleAnnounceTextVisible+_Dlg_separator+
		UO_ToggleOrientationIndication+_dlg_separator+
		UO_ToggleCellshadingChanges+_Dlg_separator
	ConvertListToNodeList (sList,node_CellAppearance+NODE_PATH_DELIMITER)
	let sXLList=sXLList+sList

;Title Reading:
	Let sList=
		UO_ToggleOverrideDocNamedTitles+_dlg_separator+
		UO_ToggleMultipleRegionSupport+_dlg_separator+
		UO_ToggleTitleReadingVerbosity+_dlg_separator+
		UO_ToggleTitleRestriction+_dlg_separator+
		UO_SetColTitlesToRowRange+_dlg_separator+
		UO_SetRowTitlesToColumnRange+_dlg_separator+
		UO_ClearRegionDefinitions+_dlg_separator
	ConvertListToNodeList (sList,node_TitleReading+NODE_PATH_DELIMITER)
	let sXLList=sXLList+sList

;Monitoring Cells:
	Let sList=
		UO_SetNextAvailableMonitorCell+_dlg_separator+
		UO_ToggleMonitorCellTitles+_dlg_separator+
		UO_ClearMonitorCells+_dlg_separator
	ConvertListToNodeList (sList,node_MonitoringCells+NODE_PATH_DELIMITER)
	let sXLList=sXLList+sList

;Properties of Cells:
	Let sList=
		UO_ToggleFormulas+_dlg_separator+
		UO_ToggleComments+_dlg_separator+
		UO_toggleMergedCells+_dlg_separator
	ConvertListToNodeList (sList,node_PropertiesOfCells+NODE_PATH_DELIMITER)
	let sXLList=sXLList+sList

;Workbook Settings:
	Let sList=
		UO_ToggleDocSettingsAssoc+_dlg_separator
	ConvertListToNodeList (sList,node_WorkbookSettings+NODE_PATH_DELIMITER)
	let sXLList=sXLList+sList

; add to existing nodes:
;Reading Options (modified default):
	let sList=InsertCustomNodesInBranch(TreeCoreGetDefaultReadingOptions(),
		UO_ToggleCellReadingVerbosity+_dlg_separator+
		UO_SelectionReadingVerbosity+_dlg_separator+
		UO_ToggleFilterDetection+_dlg_separator+
		UO_ToggleFormControlsDetection+_dlg_separator+
		UO_ToggleHyperlinkAddressAnnouncement+_dlg_separator+
		UO_ToggleObjectCountDetection+_dlg_separator+
		UO_TogglePagebreaksDetection+_dlg_separator)
		;UO_ToggleSmartTagsIndication+_dlg_separator
	let sXLList=sXLList+sList
return sxlList
	+TreeCoreGetDefaultGeneralOptions()
	+TreeCoreGetDefaultSayAllOptions()
	+TreeCoreGetDefaultEditingOptions()
	+TreeCoreGetDefaultSpellingOptions()
	+TreeCoreGetDefaultNumbersOptions()
EndFunction

string Function ToggleTitleCellFontAndFormattingIndicationHlp (int iRetCurVal)
return formatString(msgUO_ToggleTitleCellFontAndFormattingIndicationHlp ,msgDefaultSettingIsOff)
EndFunction

void function PurgeAutoSettings()
if gbTotalsColumnSettingType != TotalsSettingDefined
	xlActiveRegion.TotalsColumn = 0
EndIf
if gbTotalsRowSettingType != TotalsSettingDefined
	xlActiveRegion.TotalsRow = 0
EndIf
EndFunction

int function saveApplicationSettings ()
var
	int bSettingsSaved,
	int bRemovedItems,
	collection default, collection local, ; for temp storage
	collection user, ; for writing only those settings to file which aren't in Default.
	string section,
	string item
user = new collection
default = new collection
local = new collection;
user  = CollectionCopy (xlUser)
forEach section in user
	;assumes all members of User are sections, parent collection
	local = user[section]
	default = xlDefault[section]
	forEach item in local
		if (local[item] == default[item])
		; remove duplicates / keep user files clean
			CollectionRemoveItem (local, item)
			bRemovedItems = TRUE
		endIf
	endForEach
endForEach
if (collectionItemsCount (user.app))
	bSettingsSaved = iniWriteFromCollection (user, jsiUserFileName, FLOC_USER_PERSONALIZED_SETTINGS)
	if (bSettingsSaved)
		;deliberately manage flushing to disk to ensure all settings changed in dialog make it.
		iniFlushEX (FLOC_USER_PERSONALIZED_SETTINGS, jsiUserFileName)
	endIf
	return bSettingsSaved && bRemovedItems
else
	return TRUE;stuff got removed
endIf
endFunction

Script AdjustBrailleOptions (int index)
var
	int iUserMode,
	int bPriorUserBufferState,
	int bPriorTrapKeys,
	int bSettingsSaved,
	collection prevXlUser,
	string strFile,
	string smsg
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
iUserMode = getJCFOption(opt_user_mode)
bPriorUserBufferState = UserBufferIsActive()
bPriorTrapKeys = UserBufferIsTrappingKeys()
; store prior settings to determine if any change
if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
;sWorkbookJSI =  getWorkbookJSIName (); do this after dialog runs, in case filename match setting has been changed.
prevXlUser = new collection
prevXlUser = CollectionCopy (xlUser)
globalNoSave = FALSE
; Since Excel can be in virtual state while custom summary is active, we need the below test.
If UserBufferOverVirtualDocument ()
|| isChartActive () then
	performScript AdjustBrailleOptions () ;default
else
	OptionsTreeCorePreProcess()
	DlgSelectTreeFunctionToRun(TreeCoreGetDefaultBrailleOptions (1), cStrBrailleDlgName, false)
	OptionsTreeCorePostProcess()
EndIf
;must test here for whether to save application or document settings
;since Excel can be in virtual state.
;if it is, we don't want to save application or document settings.
if !bPriorUserBufferState then
	; see if any have changed and save if they have
	if (! CollectionCompare (xlUser, prevXlUser))
		strFile = FindJAWSPersonalizedSettingsFile (jsiUserFileName, TRUE)
		if (fileExists (strFile))
			iniDeleteFile (strFile)
			iniFlushEX (FLOC_UNKNOWN, strFile)
		endIf
		if (saveApplicationSettings ()
		;or settings were removed from the collection, e.g. set back to their defaults:
		|| collectionItemsCount (prevXlUser.app) != collectionItemsCount (xlUser.app) )
			SayMessage(ot_status,msgAppSettingsSaved1_L, cMsgSilent)
		else
			SayMessage (ot_error, msgAppSettingsNotSaved1_L)
		endIf
	;else; not necessary, user made no changes
		;SayMessage (ot_error, msgAppSettingsNotSaved1_L)
	endIf
EndIf
pause()
; if Excel was in a virtual state before the dialog was launched, return to that state.
if bPriorUserBufferState then
	UserBufferActivate(bPriorTrapKeys)
endIf
globalNoSave = FALSE
EndScript

Script AdjustJAWSOptions ()
var
	int iUserMode,
	int bPriorUserBufferState,
	int bPriorTrapKeys,
	int bSettingsSaved,
	collection prevXlUser,
	collection prevXlWorkbook,
	collection prevXLActiveSheet,
	collection PrevXlActiveRegion,
	string strFile,
	string sWorkbookJSI,
	string smsg
iUserMode = getJCFOption(opt_user_mode)
bPriorUserBufferState = UserBufferIsActive()
bPriorTrapKeys = UserBufferIsTrappingKeys()
; store prior settings to determine if any change
if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
;sWorkbookJSI =  getWorkbookJSIName (); do this after dialog runs, in case filename match setting has been changed.
PurgeAutoSettings()
prevXlUser = new collection
prevXlUser = CollectionCopy (xlUser)
prevXlWorkbook = new collection
prevXlWorkbook = CollectionCopy (xlWorkbook)
prevXLActiveSheet = new collection
prevXLActiveSheet = CollectionCopy (xlActiveSheet)
prevXLActiveRegion = new collection
prevXLActiveRegion = CollectionCopy (xlActiveRegion)
globalNoSave = FALSE
; Since Excel can be in virtual state while custom summary is active, we need the below test.
;Turn off update*Pointers, interferes when trying to load and save settings:
gbReturningFromOptionsDialog = ON
If UserBufferOverVirtualDocument ()
|| isChartActive () then
	performScript AdjustJAWSOptions() ;default
else
	OptionsTreeCore(cscNull,false,cscNull)
EndIf
;UpdateWorksheetPointer ()
;UpdateRegionPointer ()
;UpdateCXLCurrentRegion()
;UpdateCXLActiveCellTitles ()
sWorkbookJSI =  matchNameToFileName (getWorkbookJSIName ())
;must test here for whether to save application or document settings
;since Excel can be in virtual state.
;if it is, we don't want to save application or document settings.
if !bPriorUserBufferState then
	; see if any have changed and save if they have
	if (! CollectionCompare (xlUser, prevXlUser))
		strFile = FindJAWSPersonalizedSettingsFile (jsiUserFileName, TRUE)
		if (fileExists (strFile))
			iniDeleteFile (strFile)
			iniFlushEX (FLOC_UNKNOWN, strFile)
		endIf
		if (saveApplicationSettings ()
		;or settings were removed from the collection, e.g. set back to their defaults:
		|| collectionItemsCount (prevXlUser.app) != collectionItemsCount (xlUser.app) )
			SayMessage(ot_status,msgAppSettingsSaved1_L, cMsgSilent)
		else
			SayMessage (ot_error, msgAppSettingsNotSaved1_L)
		endIf
	;else; not necessary, user made no changes
		;SayMessage (ot_error, msgAppSettingsNotSaved1_L)
	endIf
	if (! CollectionCompare (xlWorkbook, prevXlWorkbook) || stringCompare (sWorkbookJSI, matchNameToFileName (sWorkbookJSI)) != 0)
		;write the workbook which will include all child collections including sheets / regions:
		strFile = FindJAWSPersonalizedSettingsFile (sWorkbookJSI, TRUE)
		if (fileExists (strFile))
			iniDeleteFile (strFile)
			iniFlushEX (FLOC_USER_PERSONALIZED_SETTINGS, sWorkbookJSI)
		Delay(2)
		endIf
		bSettingsSaved = iniWriteFromCollection (xlWorkbook, sWorkbookJSI, FLOC_USER_PERSONALIZED_SETTINGS)
		if (bSettingsSaved)
			;deliberately manage flushing to disk to ensure all settings changed in dialog make it.
			iniFlushEX (FLOC_USER_PERSONALIZED_SETTINGS, sWorkbookJSI)
		endIf
		; check first the workbook-specific settings, as all worksheets settings are stored in the current workbook:
		if (! CollectionCompare (xlWorkbook.doc, prevXlWorkbook.doc))
			if (bSettingsSaved
			;or settings were removed from the collection, e.g. set back to their defaults:
			|| CollectionItemsCount (prevXlWorkbook.doc) != CollectionItemsCount (xlWorkbook.doc))
				if iUserMode != 1 then
					let sMsg = msgDocSettingsSaved1_S
				Else
					let smsg = msgDocSettingsSaved1_L
				EndIf
				SayUsingVoice (vctx_message, smsg,ot_JAWS_message)
			else
				SayMessage (ot_error, msgDocSettingsNotSaved1_L, msgDocSettingsNotSaved1_S)
			endIf
		else; workbook settings did not change.
			;SayMessage (ot_error, msgDocSettingsNotSaved1_L, msgDocSettingsNotSaved1_S); too much verbiage
		endIf
	;else; complete workbook collections are identical, e.g. user entered and exited dialog without changing any settings.
		;SayMessage (ot_error, msgDocSettingsNotSaved1_L, msgDocSettingsNotSaved1_S)
	endIf
	if (! CollectionCompare (xlActiveSheet, prevXlActiveSheet))
		if (bSettingsSaved
		;or settings were removed from the collection, e.g. set back to their defaults:
		||  CollectionItemsCount (prevXlActiveSheet) != CollectionItemsCount (xlActiveSheet))
			SayUsingVoice(vctx_message,msgSheetSettingsSaved,ot_JAWS_message)
		else
			sayMessage (OT_ERROR, msgSheetSettingsNotSaved)
		endIf
	endIf
	if (MultipleRegionSupport () && ! CollectionCompare (xlActiveRegion, prevXlActiveRegion))
		if (bSettingsSaved
		;or settings were removed from the collection, e.g. set back to their defaults:
		|| CollectionItemsCount (prevXlActiveRegion) != CollectionItemsCount (xlActiveRegion))
			SayUsingVoice(vctx_message,msgRegionSettingsSaved,ot_JAWS_message)
		else
			sayMessage (OT_ERROR, msgRegionSettingsNotSaved)
		endIf
	endIf
	if (xlActiveRegion.TotalsColumn != prevXlActiveRegion.TotalsColumn
	|| xlActiveRegion.TotalsRow != prevXlActiveRegion.TotalsRow)
		if bSettingsSaved then
			SayUsingVoice(vctx_message,msgTotalColumnAndRowSettingsSaved,ot_JAWS_message)
		else
			sayMessage(ot_error,msgTotalColumnAndRowSettingsNotSaved)
		endIf
	endIf
EndIf
pause()
; if Excel was in a virtual state before the dialog was launched, return to that state.
if bPriorUserBufferState then
	UserBufferActivate(bPriorTrapKeys)
endIf
gbReturningFromOptionsDialog = OFF; normal updates again.
UpdateWorkbookPointer ()
UpdateWorksheetPointer ()
UpdateRegionPointer ()
UpdateCXLCurrentRegion()
UpdateCXLActiveCellTitles ()
globalNoSave = FALSE
EndScript


;For new Quick Settings:

void function loadNonJCFOptions ()
var collection Master, collection settings
master = new collection
settings = new collection
master = settingReadToCollection ("Excel.jcf", FT_CURRENT_JCF, rsStandardLayering) ;will capture all entries in either local or shared if local not written.
if (collectionItemsCount (master.NonJCFOptions))
	xlUser.app = master.NonJCFOptions
endIf
loadNonJCFOptions ()
settings = xlUser.app
GIBrlTBLZoom = settings.BrailleMode
settings .BrailleMode = GIBrlTBLZoom
; so that ghosted Braille content is no longer on the display from prior representations:
BrailleRefresh ()
endFunction

int function shouldReadBlankCells ()
return xlUser.app.CellReadingBlank 
endFunction

string function QuickSettingDisabledEvent (string settingID)
if settingID == "ExcelOptions.DocumentSettings.TitleReading.AllowPerformanceImpactingFeatures"
	;This option applies only to Excel, not ExcelClassic.
	return qsxmlMakeDisabledSetting (SettingID, true);
elif settingID == "ExcelOptions.DocumentSettings.PropertiesOfCells.Comments"
|| settingID == "ExcelOptions.DocumentSettings.PropertiesOfCells.Formulas"
|| settingID == "ExcelOptions.ReadingOptions.FilterDetection"
|| settingID == "ExcelOptions.DocumentSettings.Formatting.DetectFormatConditions"
	;These options do not apply to Excel O365.
	return qsxmlMakeDisabledSetting (SettingID, false);
elif settingID == "ExcelOptions.ReadingOptions.HeaderAndContentOrder"
	return qsxmlMakeDisabledSetting(settingID, TRUE)
endIf
return QuickSettingDisabledEvent (settingID)
endFunction

void function UpdateCustomLabelsCollectionsFromFile (string strFile, collection byRef workbook)
;Rather than use the collection read from file functions, we only want the sections who have actual labels:
var
	collection labels,
	string orderedKeys,
	int i, int nSectionSize, int j, int nKeySize,
	int iLength,
	int nAdded,
	string strSectionsList, string strKeysList,
	string sSecName,
	string strKey,
	string strValue
strSectionsList =  iniReadSectionNamesEX (FLOC_USER_PERSONALIZED_SETTINGS, strFile)
nSectionSize = stringSegmentCount (strSectionsList, cscListSeparator)
for i = 1 to nSectionSize
	sSecName = stringSegment (strSectionsList, cscListSeparator, i)
	iLength = stringLength (Section_customSummary)
	if (stringCompare (stringRight (sSecName, iLength), Section_customSummary) == 0
	&& stringLength (sSecName) > iLength)
		strKeysList = iniReadSectionKeysEX (sSecName, FLOC_USER_PERSONALIZED_SETTINGS, strFile)
		nKeySize = stringSegmentCount (strKeysList, cscListSeparator)
		if (nKeySize >= 1)
			labels = new collection
			nAdded = 0
			orderedKeys = ""
			for j = 1 to nKeySize
				strKey = stringSegment (strKeysList, cscListSeparator, j)
				strValue = iniReadStringEX (sSecName, strKey, null(), FLOC_USER_PERSONALIZED_SETTINGS, strFile)
				if (! stringIsBlank (strKey) && ! stringIsBlank (strValue))
					labels[strKey] = strValue
					nAdded = nAdded+1
					orderedKeys = orderedKeys +"\7" +strKey
				endIf
			endFor
			if (nAdded > 0)
				labels["_orderedKeys"] = orderedKeys
				workbook[sSecName+cscSpace+Section_customSummary] = labels
			endIf
		endIf
	endIf
	;next
endFor
endFunction

int function HasCustomLabels(string sSheetName)
return collectionItemExists (xlWorkbook, sSheetName + cscSpace + Section_customSummary)
EndFunction

globals
; Only used by GetCustomLabelCollection() below.
	int giGclc_tick

int function GetCustomLabelCollection (string sSheetName, collection byRef labels)
var
	string strLabelSection,
	string section,
	string key,
	int items
if !giGclc_tick || getTickCount() - giGclc_tick > 1000 then
	UpdateCustomLabelsCollectionsFromFile (getWorkbookJSIName(), xlWorkbook)
	giGclc_tick = getTickCount()
endIf
strLabelSection = sSheetName + cscSpace + Section_customSummary
; UpdateCustomLabelsCollectionsFromFile doubles this suffix, so we do it here too.
strLabelSection = strLabelSection + cscSpace + Section_customSummary
if (collectionItemExists (xlWorkbook, strLabelSection))
	labels = new Collection
	labels = CollectionCopy (xlWorkbook[strLabelSection])
	items = collectionItemsCount (labels)
endIf
return (items > 0)
endFunction

void function manageCustomLabels ()
var
	string sSectionName, string sAddress, string sDefaultValue, string strFile
strFile = getWorkbookJSIName ()
sSectionName = (getActiveSheetName () + cscSpace + Section_customSummary)
if (collectionItemExists (xlWorkbook, sSectionName))
	collectionRemoveAll (xlWorkbook[sSectionName])
	collectionRemoveItem (xlWorkbook, sSectionName)
endIf
sAddress = getSelectionAddress ()
sDefaultValue = getDefaultCustomSummaryLabel ()
dlgGetCustomSummaryInfo (sSectionName, sAddress, sDefaultValue, strFile)
delay (2) ;time for dialog to dismiss:
UpdateCustomLabelsCollectionsFromFile (strFile, xlWorkbook)
endFunction

script SettingsTest ()
; debugging code used to analyze settings collections:
;force call an update to all collection pointers:
UpdateSettingsCollections ()
var string key, string value
forEach key in xlWorkbook
endForEach
forEach key in xlActiveSheet
	value = xlActiveSheet[key]
endForEach
forEach key in xlUser
	sayString (key)
	var string tmp=""
	var collection c
	c = new collection
	c = xlUser[key]
	forEach tmp in c
		value = c[tmp]
	endForEach
endForEach
endScript
