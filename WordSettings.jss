; Copyright 1995-2021 Freedom Scientific, Inc.
;  Settings functions for Microsoft Word versions later 2016 and O365.

include "common.jsm"
include "hjConst.jsh"
include "word.jsh"
include "Office.jsh"
include "msOffice.jsm"
include "word.jsm"
include "wdUO.jsm"

import "FileIO.jsd" ; File to Collection and Collection to File code
import "WordFunc.jsd" ; core object functions
import "QuickSet.jsd"

CONST
	scColon = ":",
	WordInitialSelCtxFlags = 0x22008C,
	Outlook2007InitialSelCtxFlags = 0x2228364,
	Outlook2007SelCtxWithMarkupFlags = 0x20008B,
	WordSelCtxWithMarkupFlags = 0x4020008F

GLOBALS
	int SetWordSelectionBitsTimer,
; set to false in classic, TRUE in Office365 so right settings are included:
	int includeOffice365Settings,
;todo: the following are here expressly to make this compile right now, will change later.
	int gbOutlookIsActive,
;endTodo
	collection wdDefault,
	collection WordUser,
	collection wdDocument,
	collection wdActiveTable

void function GetSectionAndKeyNamesForSelectionContextFlags(string byRef section, string ByRef Key)
section = SECTION_RichEditAndEditControlOptions
key = hKey_SelectionContextFlags
endFunction

void Function Unknown(string TheName, int IsScript, optional int IsDueToRecursion)
if IsDueToRecursion
	;recursive calls may happen if a function is running,
	;and the Word event fires and calls the function that is already running.
	return
endIf
TheName = StringLower (TheName)
; because in QuickSettings the same function is called for multiple calls:
;and because of the JSB linkage,
;unknown function calls to the following must be manually suppressed:
if TheName == "allowoffice365settings" return endIf
return Unknown(TheName, IsScript, IsDueToRecursion)
endFunction

void Function saveJCFOptions()
iniWriteIntegerEx(section_options, hKey_LanguageDetection,getJCFOption(OPT_LANGUAGE_DETECTION), FLOC_USER_SETTINGS, WordJCFFileName, OFF)
iniWriteIntegerEx(section_options, hKey_Indentation, GetJCFOption(OPT_INDICATE_INDENTATION), FLOC_USER_SETTINGS, WordJCFFileName, OFF)
iniWriteIntegerEX(Section_options, hKey_generalizeBullets, getJCFOption(OPT_GENERALIZE_BULLETS), FLOC_USER_SETTINGS, WordJCFFileName, OFF)
iniWriteIntegerEx(section_RichEditAndOSMOptions, hKey_ExpandAnnotationsInline, getJCfOption(OPT_EXPAND_ANNOTATIONS_INLINE), FLOC_USER_SETTINGS, WordJCFFileName, OFF)
iniWriteIntegerEx(Section_braille, hKey_generalizeBullets, getJCfOption(OPT_BRL_GENERALIZE_BULLETS), FLOC_USER_SETTINGS, WordJCFFileName, OFF)
iniWriteIntegerEx(section_OSM, hKey_jcfTableIndication, getJCfOption(optTableDetection),  FLOC_USER_SETTINGS, WordJCFFileName, OFF)
iniWriteIntegerEx(Section_OSM,hKey_UnderlineProofreadingErrors,getJCfOption(OPT_UNDERLINE_PROOFREADING_ERRORS), FLOC_USER_SETTINGS, WordJCFFileName, OFF)
iniWriteIntegerEx(Section_HTML, hKey_DocumentPresentationSet, getJCfOption(optHTMLDocumentPresentationMode), FLOC_USER_SETTINGS, WordJCFFileName, OFF)
;must match document presentation mode for Braille support
iniWriteIntegerEx(section_braille, hKey_Brl_UseOSM, getJCfOption(OPT_BRL_USE_OSM), FLOC_USER_SETTINGS, WordJCFFileName, OFF)
iniWriteIntegerEx(section_options, hKey_nonbreakingSymbols, getJCfOption(OPT_INDICATE_NONBREAKING_SYMBOLS), FLOC_USER_SETTINGS, WordJCFFileName, OFF)
iniWriteIntegerEx(section_HTML, hKey_HeadingIndication, getJCfOption(optHeadingIndication), FLOC_USER_SETTINGS, WordJCFFileName, OFF)
iniWriteIntegerEx(section_RichEditAndOSMOptions, hKey_SelCtxWithMarkup, getJCfOption(OPT_Request_Markedup_Content), FLOC_USER_SETTINGS, WordJCFFileName, OFF)
iniWriteIntegerEx(section_options, hKey_IndicateNewLines, getJCfOption(OPT_INDICATE_NEWLINES), FLOC_USER_SETTINGS, WordJCFFileName, OFF)
iniFlushEx(FLOC_USER_SETTINGS, WordJCFFileName)
EndFunction

int function FlagSetSpokenBeforeText()
var
	int bMAGicOnly = (getRunningFSProducts() == product_MAGic)
if OutlookIsActive()
	if bMAGicOnly
		return Outlook_SelCtx_BeforeCaretMoveMask_MAGic
	else
		return Outlook_SelCtx_BeforeCaretMoveMask
	endIf
else
	if bMAGicOnly
		return Word_SelCtx_BeforeCaretMoveMask_MAGic
	else
		return Word_SelCtx_BeforeCaretMoveMask
	endIf
endIf
endFunction

int function ToggleSelectionBit(int iFlag)
var
	int iFlags = GetSelectionContextFlags(), ; from internals
	collection location
location = WordUser.app
if iFlags&IFlag
	iFlags = (iFlags & ~ iFlag)
else
	iFlags = (iFlags | iFlag)
endIf
SetSelectionContextFlags(iFlags, FlagSetSpokenBeforeText())
; store in collection for ini file write.
location[hKey_SelCtxFlags] = iFlags
if iFlags & iFlag
	return ON
else
	return OFF
endIf
endFunction

void function TurnSelectionBitOn(int iFlag)
var
	int iFlags = GetSelectionContextFlags(), ; from internals
	collection location
location = WordUser.app
iFlags = (iFlags | iFlag)
SetSelectionContextFlags(iFlags, FlagSetSpokenBeforeText())
location[hKey_SelCtxFlags] = iFlags
endFunction

void function TurnSelectionBitOff(int iFlag)
var
	int iFlags = GetSelectionContextFlags(), ; from internals
	collection location
location = WordUser.app
iFlags = (iFlags & ~ iFlag)
SetSelectionContextFlags(iFlags, FlagSetSpokenBeforeText())
location[hKey_SelCtxFlags] = iFlags
endFunction

int function getStateOfSelectionBit(int iFlag)
if GetSelectionContextFlags() & iFlag
	return ON
else
	return OFF
endIf
endFunction

int function ToggleCountBit(int iFlag)
var
	int iFlags = GetCountedSelectionContextItems() ; from internals
if iFlags&IFlag
	iFlags = (iFlags & ~ iFlag)
else
	iFlags = (iFlags | iFlag)
endIf
SetCountedSelectionContextItems(iFlags)
if iFlags & iFlag
	return ON
else
	return OFF
endIf
endFunction

void function TurnCountBitOn(int iFlag)
var
	int iFlags = GetCountedSelectionContextItems() ; from internals
iFlags = (iFlags | iFlag)
SetCountedSelectionContextItems(iFlags)
endFunction

void function TurnCountBitOff(int iFlag)
var
	int iFlags = GetCountedSelectionContextItems() ; from internals
iFlags = (iFlags & ~ iFlag)
SetCountedSelectionContextItems(iFlags)
endFunction

int function getStateOfCountBit(int iFlag)
if GetCountedSelectionContextItems() & iFlag
	return ON
else
	return OFF
endIf
endFunction

string function getSelectionBitInfo(string SettingID, int nBit)
return qsxmlMakeBoolean(settingID, qsxmlMakeBooleanState(getStateOfSelectionBit(nBit)))
endFunction

void function ManageSelectionBitInfo(string sXmlWriteRequest, int nBit, int nWriteDestination)
var
	int nState,
	collection location
parseXMLBooleanWriteRequest(sxmlWriteRequest, nState)
if nState
	TurnSelectionBitOn(nBit)
else
	TurnSelectionBitOff(nBit)
endIf
location = WordUser.app
var string section, string key
GetSectionAndKeyNamesForSelectionContextFlags(section, key)
writeSettingString(section, key, location[hKey_SelCtxFlags], FT_Current_JCF, nWriteDestination)
endFunction

void function CollectionUpdateBooleanItem(collection byRef items, string sKey)
;Keeps file-specific collections clean.
if CollectionItemExists(items, sKey)
	CollectionRemoveItem(items, sKey)
else
	items[sKey] = 1
endIf
endFunction

void function SynchronizeNonJCFOptionsWithSelectionContext()
if (WordUser.app.LineSpacingDetection)
	TurnSelectionBitOn (selCtxLineSpacingChange)
else
	TurnSelectionBitOff (selCtxLineSpacingChange)
endIf
endFunction

void function loadUserDefaults()
var
	collection WordFile,
	collection local,
	string item
WordUser = new collection
WordFile = SettingReadToCollection(getActiveConfiguration() + ".jcf", FT_CURRENT_JCF)
local = collectionCopy(WordFile.nonJCFOptions)
WordUser.app = local
var string key, collection tmp
tmp = WordUser.app
local.NonBreakingSymbols = getJCFOption (opt_indicate_nonbreaking_symbols)
SynchronizeNonJCFOptionsWithSelectionContext()
;WordUser.app.Scheme = readSettingString (SECTION_OPTIONS, "Scheme", "", FT_CURRENT_JCF)
;SwitchToScheme (WordUser.app.Scheme)
endFunction

void Function UpdateSettingsCollections()
UpdateDocumentPointer()
updateTablePointer()
endFunction

void function QuickSettingsPreProcess()
;ensure that table info is up to date before entering QuickSettings:
updateTableManually()
cwdUpdateTitleColumnsAndRows()
QuickSettingsPreProcess()
endFunction

void function SetWordSelectionBits()
var
	variant selCtxFlags,
	collection app = WordUser.app
; new method for retrieving selection context flags,
; some of which are now settable in Settings Center for Office365.
selCtxFlags = readSettingInteger(SECTION_RichEditAndEditControlOptions, hKey_SelectionContextFlags, getSelectionContextFlags(), FT_current_JCF, rsStandardLayering)
app.SelCtxFlags = selCtxFlags
setCountFlagsFromOptions(app)
SetSelectionContextFlags(app.SelCtxFlags, FlagSetSpokenBeforeText())
endFunction

void function loadNonJCFOptions()
var
	collection Master,
	collection app
unScheduleFunction(SetWordSelectionBitsTimer)
master = settingReadToCollection(getActiveConfiguration() + ".jcf", FT_CURRENT_JCF) ;will capture all entries in either local or shared if local not written.
if collectionItemsCount(master.NonJCFOptions)
	WordUser.app = master.NonJCFOptions
elif !wordUser.app
	app = new collection
	WordUser.app = app
endIf
if WordUser.app.MeasurementUnits
	SMMSetDesiredUnitsOfMeasure(WordUser.app.MeasurementUnits)
else
	SMMSetDesiredUnitsOfMeasure(convertWdUnitOfMeasureToSmmUnitOfMeasure())
endIf
app = WordUser.app
app.MeasurementUnits = convertWdUnitOfMeasureToSmmUnitOfMeasure()
app.headings = getJCFOption(optHeadingIndication)
GlobalDetectAutoCorrect = AutoCorrectDetection()
loadNonJCFOptions()
endFunction

void function setCountFlagsFromOptions(collection app)
; Set the count bits managed by non-JCF options.
; Bits not managed thus are left unchanged here.
If app.DetectRevisions > 0
	; in case someone has a legacy JCF file with flags set, 
	; revisions turned on in the classic way but not set in the new options:
	TurnSelectionBitOn(selCTXRevisions)	
endIf
endFunction

void function QuickSettingsPostProcess()
; many settings for detection in word will require that we first refresh the screen(document) before attempting to run events related to what's changed:
Refresh()
RunSelectionContextEvents()
If !IsVirtualPcCursor() 
&& GetJCFOption(OPT_QUICK_KEY_NAVIGATION_MODE)
	if inDocument()
		setQuickKeyNavigationState(1)
		if !OutlookIsActive()
			setFindItemToPage() ; for Word windows only.
		endIf
	endIf
elIf !GetJCFOption(OPT_QUICK_KEY_NAVIGATION_MODE) ; virtual cursor and other states don't matter:
	SetQuickKeyNavigationState(OFF)
endIf
QuickSettingsPostProcess()
endFunction

void function QuickSettingsLoadDocumentSettings()
if GetActiveDocumentName()
	UpdateDocumentPointer()
	if getDocumentTableIndex() > 0
		UpdateTablePointer()
		cwdUpdateTitleColumnsAndRows()
	endIf
endIf
QuickSettingsLoadDocumentSettings()
endFunction

void function InitializeSettings()
wdDefault = new collection;
WordUser = new collection;
wdDocument = new collection;
wdActiveTable = new collection;
;load default and user:
;wdDefault = iniReadToCollection(jsiFileName, FLOC_SHARED_PERSONALIZED_SETTINGS)
LoadNonJCFOptions()
endFunction

int function shouldReadBlankCells()
if !(getRunningFSProducts() & product_MAGic)
	return TRUE
else
	return wordUser.app.CellReadingBlank ; exclusive to MAGic-specific settings.
endIf
endFunction

void function UpdateSettingsPointers()
UpdateDocumentPointer()
UpdateTablePointer()
endFunction

void function WordSettingsInit()
includeOffice365Settings = TRUE ; inherit Office365 settings from WordClassic.qs
loadUserDefaults()
InitializeSettings()
if getRunningFSProducts() & product_MAGic
	;Arbitrarily ensure we never use virtual cursor when in read-only documents:
	setJCFOption(OPT_USE_VPC_INSTEAD_OF_ENHANCED_EDIT_FOR_READONLY_DOCS, OFF)
endIf
; schedule to make sure the file has loaded,
; especially this is true of document settings when using alt+tab to return to document:
ScheduleFunction("UpdateSettingsPointers", 4)
endFunction

void function autoStartEvent()
; Do not add code to this function.
;Instead, add to WordSettingsInit()
;as it will be called from the Word main AutoStartEvent.
EndFunction

void function AutoFinishEvent()
unScheduleFunction(SetWordSelectionBitsTimer)
SetWordSelectionBitsTimer = 0
endFunction

string function getActiveDocumentJSIFileName()
var
	string sName = GetActiveDocumentName()
if !stringIsBlank(sName)
	sName = formatString(jsiDocFilename, sName)
endIf
return sName
endFunction

string function getActiveTableJSISectionName()
var
	;int index = getTableIndex(), ; use index from document collections rather than internals, especially for tables just added to document.
	int index = getDocumentTableIndex(),
	string sName
if index
	sName = formatString(section_table, intToString(index))
endIf
return sName
endFunction

void function updateDocumentPointer()
var
	string sAppScheme,
	collection tmp
if stringIsBlank(GetActiveDocumentName())
	return
endIf
collectionRemoveAll(wdDocument)
wdDocument = new collection
if fileExists(FindJAWSPersonalizedSettingsFile(getActiveDocumentJSIFileName(), TRUE))
	wdDocument = SettingReadToCollection( getActiveDocumentJSIFileName(), FT_JSI)
endIf
if !collectionItemExists(wdDocument, section_doc)
	tmp = new collection
	wdDocument.doc = tmp
endIf
if WordUser.app.SchemeDocSpecific
&& !stringIsBlank(wdDocument.doc.Scheme)
	SwitchToScheme(wdDocument.doc.Scheme)
else
	sAppScheme = readSettingString(SECTION_OPTIONS, "Scheme", "", FT_CURRENT_JCF)
	switchToScheme(sAppScheme)
endIf
endFunction

void Function updateTablePointer()
var
	collection table, ; temp
	string sDocName = GetActiveDocumentName(),
	string sTableName = getActiveTableJSISectionName()
;appendToScriptCallStackLogEX("Table pointer")
table = new collection
if stringIsBlank(sDocName)
|| (!getDocumentTableIndex() && ! getTableIndex())
	;appendToScriptCallStackLogEX("Nil")
	;AppendToScriptCallstackLog()
	return
endIf
;AppendToScriptCallstackLog()
if collectionItemExists(wdDocument, sTableName)
	delay(2)
	table = wdDocument[sTableName]
	if collectionItemsCount(table)
		table.name = sTableName
		wdActiveTable = table
	endIf
else
	wdActiveTable = new collection
	wdDocument[sTableName] = wdActiveTable
endIf
;debug table collection
;var string Key
;forEach key in wdActiveTable
	;formattedSayString("%1 is %2", key, wdActiveTable[key])
;endForEach
endFunction

;start of individual options

;Selection Context Flags Options

int function IndentationIndication()
return getJCFOption(OPT_INDICATE_INDENTATION)
endFunction

String function IndentationIndicate(int iRetCurVal)
var
	int iSetting
iSetting = getJCFOption(OPT_INDICATE_INDENTATION)
if !iRetCurVal
	iSetting = !iSetting
	SetJcfOption(OPT_INDICATE_INDENTATION,iSetting)
EndIf
if iSetting
	return msgUO_Indicate
else
	return msgUO_Ignore
endIf
EndFunction

int function PositionDetection()
return getStateOfSelectionBit(selCtxPageSectionColumnBreaks)
endFunction

String function togglePositionDetection(int iRetCurVal)
Var
	int nBitState
if !iRetCurVal
	nBitState = ToggleSelectionBit(selCtxPageSectionColumnBreaks)
else
	nBitState = getStateOfSelectionBit(selCtxPageSectionColumnBreaks)
EndIf
if nBitState
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

string function getPositionDetectionInfo(string settingID)
var
	int nBit = selCtxPageSectionColumnBreaks
return getSelectionBitInfo(SettingID, nBit)
endFunction

void function setPositionDetectionInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
ManageSelectionBitInfo(sXmlWriteRequest, selCtxPageSectionColumnBreaks, nWriteDestination)
endFunction

int function BorderDetection()
return getStateOfSelectionBit(selCtxBorders)
endFunction

String function toggleBorderDetection(int iRetCurVal)
Var
	int nBitState
if !iRetCurVal
	nBitState = ToggleSelectionBit(selCtxBorders)
else
	nBitState = getStateOfSelectionBit(selCtxBorders)
endIf
if nBitState
	return cmsg_On
else
	return cmsg_Off
endIf
EndFunction

string function getBorderDetectionInfo(string settingID)
var
	int nBit = selCtxBorders
return getSelectionBitInfo(SettingID, nBit)
endFunction

void function setBorderDetectionInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
ManageSelectionBitInfo(sXmlWriteRequest, selCtxBorders, nWriteDestination)
endFunction

int function ShadingDetection()
return getStateOfSelectionBit(selCtxShading)
endFunction

String Function ToggleShadingDetection(int iRetCurVal)
Var
	int iFlagStatus
if !iRetCurVal
	iFlagStatus = ToggleSelectionBit(selCtxShading)
else
	iFlagStatus = getStateOfSelectionBit(selCtxShading)
endIf
if iFlagStatus
	return cmsg_On
else
	return cmsg_Off
endIf
EndFunction

string function getShadingDetectionInfo(string settingID)
return getSelectionBitInfo(SettingID, selCtxShading)
endFunction

void function setShadingDetectionInfo(string settingID, string sXmlWriteRequest, int nWriteDestination)
return ManageSelectionBitInfo (sXmlWriteRequest, selCtxShading, nWriteDestination)
endFunction

int function CountBefore()
return getStateOfSelectionBit(selCtxIndicateAfter)
endFunction

String function ToggleCountBefore(int iRetCurVal)
var
	int iFlagStatus
if !iRetCurVal
	iFlagStatus = ToggleSelectionBit(selCtxIndicateAfter)
else
	iFlagStatus = getStateOfSelectionBit(selCtxIndicateAfter)
endIf
if iFlagStatus
	return msgCountItemsBeforeSpeakingOff1_L
else
	return msgCountItemsBeforeSpeakingOn1_L
endIf
endFunction

string function getCountBeforeInfo(string settingID)
var
	int nSelectIndex = getStateOfSelectionBit(selCtxIndicateAfter),
	stringArray szListItems,
	int nSize = 2
szListItems = new stringArray[nSize]
szListItems[1] = msgCountItemsBeforeSpeakingOn1_L
szListItems[2] = msgCountItemsBeforeSpeakingOff1_L
return QsxmlMakeList(settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setCountBeforeInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	collection location,
	int iSelection
parseXMLListWriteRequest(sxmlWriteRequest, iSelection)
if iSelection
	TurnSelectionBitOn(selCtxIndicateAfter)
else
	TurnSelectionBitOff(selCtxIndicateAfter)
endIf
location = WordUser.app
var string section, string key
GetSectionAndKeyNamesForSelectionContextFlags(section, key)
writeSettingString(section, key, location[hKey_SelCtxFlags], FT_Current_JCF, nWriteDestination)
endFunction

int function ListNestingLevelAnnounce()
return getStateOfSelectionBit(SelCtxListItemData)
endFunction

String Function ToggleAnnounceListNestingLevel(int iRetCurVal)
Var
	int iFlagStatus
if !iRetCurVal
	iFlagStatus = ToggleSelectionBit(SelCtxListItemData)
else
	iFlagStatus = getStateOfSelectionBit(SelCtxListItemData)
endIf
if iFlagStatus
	return cmsg_on
else
	return cmsg_off ; default
endIf
EndFunction

string function getListNestingLevelAnnounceInfo(string settingID)
return getSelectionBitInfo(SettingID, SelCtxListItemData)
endFunction

void function setListNestingLevelAnnounceInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
return ManageSelectionBitInfo(sxmlWriteRequest, SelCtxListItemData, nWriteDestination)
endFunction

int function ExpressNavigationModeActive()
;just checks the markup jcf option, most useful to not save settings for documents if in fact we do not save settings.
return getJCFOption(OPT_Request_Markedup_Content)
endFunction

String Function ToggleSelCtxWithMarkup(int iRetCurVal)
var
	collection app,
	int bSelCtxWithMarkup = getJCFOption(OPT_Request_Markedup_Content)
app = WordUser.app
if !iRetCurVal
	bSelCtxWithMarkup = ! bSelCtxWithMarkup
	setJCFOption(OPT_Request_Markedup_Content, bSelCtxWithMarkup)
	if !bSelCtxWithMarkup ; ensure only certain bit flags are on.
		;if Braille is in use, ensure Braille is set always to use OSM.
		if GetJCFOption(OPT_BRL_USE_OSM) < BrlUseOSMAlways
			SetJCFOption(OPT_BRL_USE_OSM, BrlUseOSMAlways)
		endIf
		SetJcfOption(OPT_BRL_MOVE_ACTIVE_CURSOR, 1) ;turn it on when Express Navigation Mode is on.
		; for Word: only spelling, grammar, revisions, and table detection.
		; headings handled through .jcf option as well as style flag.
		;for Outlook 2007 and above: same except for no revisions.
		if OutlookIsActive()
			toggleSelectionBit(Outlook2007SelCtxWithMarkupFlags)
		else ; Word
			toggleSelectionBit(WordSelCtxWithMarkupFlags)
		endIf
		;spelling error flag:
		app.DetectSpelling = wdVerbosityLow
		;grammatical error flag:
		app.DetectGrammar = wdVerbosityLow
		; revisions flag and notes detection:
		if !OutlookIsActive()
			app.DetectRevisions = SpeakRevType+ SpeakRevCount
			SetJcfOption(OPT_EXPAND_ANNOTATIONS_INLINE, OFF) ; Notes detection
		endIf
		;headings flag, but not all styles
		SetJcfOption(optHeadingIndication, 2); with level
		;tables flag
		SetJcfOption(OptTableIndication, true)
		SetJcfOption(OPT_BRL_MOVE_ACTIVE_CURSOR, 1) ;turn it on when Express Navigation Mode is on.
	else ;turn Express Navigation Mode off.
		;if Braille is in use, ensure Braille is set always to use hybrid.
		if GetJCFOption(OPT_BRL_USE_OSM) == BrlUseOSMAlways
			SetJCFOption(OPT_BRL_USE_OSM, BrlUseHybrid)
		endIf
		if OutlookIsActive()
			toggleSelectionBit(Outlook2007InitialSelCtxFlags)
		else
			toggleSelectionBit(WordInitialSelCtxFlags)
		endIf
		;spelling error flag:
		app.DetectSpelling = off
		;grammatical error flag:
		app.DetectGrammar = off
		; revisions flag and notes detection:
		if !OutlookIsActive()
			app.DetectRevisions = SpeakRevType+SpeakRevCount
			SetJcfOption(OPT_EXPAND_ANNOTATIONS_INLINE, ON) ; Notes detection
		endIf
		SetJcfOption(OPT_BRL_MOVE_ACTIVE_CURSOR,0) ;turn it off when Express Navigation Mode is off.
	EndIf
endIf
if bSelCtxWithMarkup ; it is off.
	return cmsg_Off
else ; it is on.
	return cmsg_On
endIf
EndFunction

string function getExpressNavigationModeInfo(string settingID)
return qsxmlMakeBoolean(settingID, qsxmlMakeBooleanState(getJCFOption(OPT_Request_Markedup_Content)))
endFunction

void function setExpressNavigationModeInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	collection app,
	int nState
parseXMLBooleanWriteRequest(sxmlWriteRequest, nState)
app = WordUser.app
writeSettingInteger(section_RichEditAndOSMOptions, hKey_SelCtxWithMarkup, nState, FT_CURRENT_JCF, nWriteDestination)
if !nState ; ensure only certain bit flags are on.
	;if Braille is in use, ensure Braille is set always to use OSM.
	if GetJCFOption(OPT_BRL_USE_OSM) < BrlUseOSMAlways
		writeSettingInteger(section_braille, hKey_Brl_UseOSM, BrlUseOSMAlways, FT_CURRENT_JCF, nWriteDestination)
	endIf
	WriteSettingInteger(Section_Braille, hKey_Braille_BrailleMoveActiveCursor, 1, FT_CURRENT_JCF, nWriteDestination) ;turn it on when Express Navigation Mode is on.
	; for Word: only spelling, grammar, revisions, and table detection.
	; headings handled through .jcf option as well as style flag.
	;for Outlook 2007 and above: same except for no revisions.
	if OutlookIsActive()
		toggleSelectionBit(Outlook2007SelCtxWithMarkupFlags)
	else ; Word
		toggleSelectionBit(WordSelCtxWithMarkupFlags)
	endIf
	;spelling error flag:
	app.DetectSpelling = wdVerbosityLow
	;grammatical error flag:
	app.DetectGrammar = wdVerbosityLow
	; revisions flag and notes detection:
	if !OutlookIsActive()
		app.DetectRevisions = SpeakRevType+ SpeakRevCount
		WriteSettingInteger(section_RichEditAndOSMOptions, hKey_ExpandAnnotationsInline, OFF, FT_CURRENT_JCF, nWriteDestination) ; Notes detection
	endIf
	;headings flag, but not all styles
	WriteSettingInteger(section_HTML, hKey_HeadingIndication, 2, FT_CURRENT_JCF, nWriteDestination); with level
	;tables flag
	WriteSettingInteger(section_OSM, hKey_tableIndication, true, FT_CURRENT_JCF, nWriteDestination)
	WriteSettingInteger(Section_Braille, hKey_Braille_BrailleMoveActiveCursor, 1, FT_CURRENT_JCF, nWriteDestination) ;turn it on when Express Navigation Mode is on.
else ;turn Express Navigation Mode off.
	;if Braille is in use, ensure Braille is set always to use hybrid.
	if GetJCFOption(OPT_BRL_USE_OSM) == BrlUseOSMAlways
		writeSettingInteger(section_braille, hKey_Brl_UseOSM, BrlUseHybrid, FT_CURRENT_JCF, nWriteDestination)
	endIf
	if OutlookIsActive()
		toggleSelectionBit(Outlook2007InitialSelCtxFlags)
	else
		toggleSelectionBit(WordInitialSelCtxFlags)
	endIf
	;spelling error flag:
	app.DetectSpelling = off
	;grammatical error flag:
	app.DetectGrammar = off
	; revisions flag and notes detection:
	if !OutlookIsActive()
		app.DetectRevisions = SpeakRevType+SpeakRevCount
		writeSettingInteger(section_RichEditAndOSMOptions, hKey_ExpandAnnotationsInline, ON, FT_CURRENT_JCF, nWriteDestination) ; Notes detection
	endIf
	WriteSettingInteger(section_braille, hKey_Brl_UseOSM, 0, FT_CURRENT_JCF, nWriteDestination) ;turn it off when Express Navigation Mode is off.
EndIf
endFunction

;Hybrind JCF and Selection Flags Options

int Function NotesDetection()
var
	int AnnotationsSetting = getJcfOption(opt_expand_annotations_inline),
	int relevantCountableSelectionBits = GetCountedSelectionContextItems()&(SelCtxCountComments|selCtxCountFootnotes|selCtxCountEndnotes),
	int RelevantSelectionContextFlags = GetSelectionContextFlags()&SelCtxComments|selCtxFootnotes|selCtxEndnotes
if AnnotationsSetting == 0
	return 0
elIf AnnotationsSetting == 1
	if relevantCountableSelectionBits && RelevantSelectionContextFlags ; on + count
		return WDVerbosityHighest
	else ; on only
		return wdVerbosityLow
	endIf
elIf AnnotationsSetting == 2 ; on + text
	return wdVerbosityHigh
endIf
return getJcfOption(opt_expand_annotations_inline)
endFunction

String function toggleNotesDetection(int iRetCurVal)
var
	int iJCFSetting = getJcfOption(opt_expand_annotations_inline)
if !iRetCurVal
	if iJCFSetting == SpeakAnnotationCount
		iJCFSetting = wdVerbosityOff
		TurnSelectionBitOff(SelCtxComments|selCtxFootnotes|selCtxEndnotes)
		TurnCountBitOff(SelCtxCountComments|selCtxCountFootnotes|selCtxCountEndnotes)
	else
		iJCFSetting = iJCFSetting+1
		;flags must be on.
		TurnSelectionBitOn(SelCtxComments|selCtxFootnotes|selCtxEndnotes)
		TurnCountBitOn(SelCtxCountComments|selCtxCountFootnotes|selCtxCountEndnotes)
		;Manage counts:
		if iJCFSetting == wdVerbosityLow
		|| iJCFSetting == wdVerbosityHigh ; turn count off.
			TurnCountBitOff(SelCtxCountComments|selCtxCountFootnotes|selCtxCountEndnotes)
		elIf iJCFSetting == SpeakAnnotationCount ; set count flag.
			TurnCountBitOn(SelCtxCountComments|selCtxCountFootnotes|selCtxCountEndnotes)
		EndIf
	EndIf
	SetJcfOption(opt_expand_annotations_inline, iJCFSetting)
endIf
if iJCFSetting  == wdVerbosityOff
	return cmsg_off
elif iJCFSetting == wdVerbosityLow
	return cmsg_on
elif iJCFSetting == wdVerbosityHigh
	return msg_AnnotationOnWithText
elIf iJCFSetting  == SpeakAnnotationCount
	return msg_OnCount
endIf
EndFunction

string function getNotesDetectionInfo(string settingID)
var
	int nSelectIndex,
	stringArray szListItems,
	int nSize = 4
szListItems = new stringArray[nSize]
szListItems[1] = cmsg_off
szListItems[2] = cmsg_on
szListItems[3] = msg_AnnotationOnWithText
szListItems[4] = msg_OnCount
nSelectIndex = NotesDetection()
return QsxmlMakeList(settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setNotesDetectionInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	collection location,
	int iSelection,
	int ExpandAnnotations
parseXMLListWriteRequest(sxmlWriteRequest, iSelection)
location = WordUser.app
; Three settings managed here:
;Annotations jcf setting, countable selection bits, and selection context flags.
;They must be done in that order or selection context info will be off.
; manage the expand annotations setting:
if iSelection == wdVerbosityOff
	ExpandAnnotations = 0
elIf iSelection == wdVerbosityLow ; on
	ExpandAnnotations = 1
elIf iSelection == wdVerbosityHigh ; on + text
	ExpandAnnotations = 2
elIf iSelection == wdVerbosityHighest ; on + count
	ExpandAnnotations = 1
endIf
setJCFOption(OPT_EXPAND_ANNOTATIONS_INLINE, ExpandAnnotations)
WriteSettingInteger("RichEdit and Edit Control Options", "ExpandAnnotationsInline", ExpandAnnotations, FT_CURRENT_JCF, nWriteDestination)
; count bits must be managed before selection flags, or the selection flags order will be wrong.
if iSelection == wdVerbosityHighest
	TurnCountBitOn(SelCtxCountComments+selCtxCountFootnotes+selCtxCountEndnotes)
else
	TurnCountBitOff(SelCtxCountComments+selCtxCountFootnotes+selCtxCountEndnotes)
endIf
var string section, string key
section = SECTION_RichEditAndEditControlOptions
key = "CountableSelectionContextItems"
writeSettingInteger(section, key, GetCountedSelectionContextItems(), FT_CURRENT_JCF, nWriteDestination)
;manage only the selection context flags:
if iSelection
	TurnSelectionBitOn(SelCtxComments|selCtxFootnotes|selCtxEndnotes)
else
	TurnSelectionBitOff(SelCtxComments|selCtxFootnotes|selCtxEndnotes)
endIf
GetSectionAndKeyNamesForSelectionContextFlags(section, key)
writeSettingInteger(section, key, GetSelectionContextFlags(), FT_Current_JCF, nWriteDestination)
endFunction

;JCF Only options

;Tables detection, from the OSM section of the JCF, is not directly settable without setting the JCF option.
;Todo: ensure that events for in and out of tables do not break when Detection is off.
int function TableDetection()
return getJCFOption(optTableIndication)
endFunction

String function ToggleTableDetection(int iRetCurVal)
var
	int nSetting = getJCFOption(optTableIndication)
if !iRetCurVal
	nSetting = ! nSetting
	setJCFOption(optTableIndication, nSetting)
endIf
if nSetting
	return cmsg_On
else
	return cmsg_Off
endIf
EndFunction

int function BulletTypeIndication()
return getJCFOption(Opt_GENERALIZE_BULLETS)
endFunction

String function ToggleIndicateBulletType(int iRetCurVal)
var
	int IndicateBulletType = getJCFOption(Opt_GENERALIZE_BULLETS)
if !iRetCurVal
	IndicateBulletType = ! IndicateBulletType
	SetJCFOption(Opt_GENERALIZE_BULLETS,indicateBulletType)
EndIf
if IndicateBulletType
	; all bullets the same
	return cmsg_off
else
	;distinguish bullet types
	return cmsg_on
endIf
EndFunction

int function BrailleBulletTypeIndication()
return getJCFOption(Opt_BRL_GENERALIZE_BULLETS)
endFunction

String function ToggleIndicateBrailleBulletType(int iRetCurVal)
var int IndicateBrailleBulletType = getJCFOption(Opt_BRL_GENERALIZE_BULLETS)
if !iRetCurVal
	IndicateBrailleBulletType = ! IndicateBrailleBulletType
	SetJCFOption(Opt_BRL_GENERALIZE_BULLETS, IndicateBrailleBulletType)
EndIf
if IndicateBrailleBulletType
	; single cell indication is on.
	return cmsg_off
else
	; multi-cell indication is on.
	return cmsg_on
EndIf
EndFunction

string function getBrailleBulletTypeInfo(string settingID, int nReadSource)
;callbacks because 0 = ON and 1 = OFF in this case.
return qsxmlMakeBoolean(settingID, qsxmlMakeBooleanState (! getJCFOption(Opt_BRL_GENERALIZE_BULLETS)))
endFunction

void function setBrailleBulletTypeInfo(string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int nState = 0
parseXMLBooleanWriteRequest(sXmlWriteRequest, nState)
;Reverse state see the getBrailleBulletTypeInfo function above for this:
; GeneralizeBullets set to 0 = turn this stuff off:
nState = ! nState
writeSettingInteger(Section_Braille, hKey_GeneralizeBullets, nState, FT_CURRENT_JCF)
endFunction

int Function LanguageDetection()
return getJCFOption(OPT_LANGUAGE_DETECTION)
endFunction

String Function LanguageDetectChange(int iRetCurVal)
var int nSetting = getJCFOption(OPT_LANGUAGE_DETECTION)
If !iRetCurVal
	nSetting = ! nSetting
	SetJCFOption(OPT_LANGUAGE_DETECTION,nSetting)
EndIf
If nSetting
	Return msgUO_on
Else
	Return msgUO_off
EndIf
EndFunction

int function ShowBrlProofreadingMark()
return getJCFOption(OPT_UNDERLINE_PROOFREADING_ERRORS)
endFunction

String function ToggleShowBrlProofreadingMark(int iRetCurVal)
var
	int nSetting = getJCFOption(OPT_UNDERLINE_PROOFREADING_ERRORS)
if !iRetCurVal
	if nSetting == 3
		; turn it off.
		nSetting = 0
	else
		nSetting = nSetting+1
	endIf
	SetJCFOption(OPT_UNDERLINE_PROOFREADING_ERRORS, nSetting)
endIf
if nSetting == wdBrlMarkSpell
	return MsgBrlMarkSpelling
ElIf nSetting == wdBrlMarkGrammar
	return msgBrlMarkGrammar
ElIf nSetting == wdBrlMarkSpellingAndGrammar
	return msgBrlMarkSpellingAndGrammar
Else
	return msgBrlMarkSpellingAndGrammarOff
endIf
endFunction

int function WordDocumentPresentation()
return getJCFOption(optHTMLDocumentPresentationMode)
endFunction

string Function WordDocumentPresentationSet(int iRetCurVal)
;overwritten here in order to set global for Braille,
;and to set the tableLineSegment setting, used by SayLine.
var
	int bBrlUseOSM = getJcfOption(OPT_BRL_USE_OSM),
	int bDocumentPresentationSet = getJCFOption(optHTMLDocumentPresentationMode)
if !iRetCurVal
	bDocumentPresentationSet = ! bDocumentPresentationSet
	;gbBrlUseOSM can only be BrlUseHybrid, default, or BrlUseOSMAlways
	if bBrlUseOSM == BrlUseHybrid
		bBrlUseOSM = BrlUseOSMAlways
	else
		bBrlUseOSM = BrlUseHybrid
	endIf
	SetJcfOption(optHTMLDocumentPresentationMode, bDocumentPresentationSet)
	;table line segment setting must be on when document presentation is set to screen,
	;and off when it is set to simple layout:
	SetJCFOption(opt_table_line_segment,bDocumentPresentationSet)
	setJcfOption(OPT_BRL_USE_OSM, bBrlUseOsm)
EndIf
If bDocumentPresentationSet
	return cmsgDocumentPresentationModeOn_l
else
	return cmsgDocumentPresentationModeOff_l
endIf
EndFunction

string function getWordDocumentPresentationInfo(string settingID)
var
	int nSize = 2,
	int nSelectIndex = (getJCFOption(optHTMLDocumentPresentationMode) > 0),
		stringArray szListItems
szListItems = new stringArray[nSize]
szListItems[1] = cmsgDocumentPresentationModeOff_L
szListItems[2] = cmsgDocumentPresentationModeOn_L
return qsxmlMakeList(settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setWordDocumentPresentationInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	int bBrlUseOSM = getJcfOption(OPT_BRL_USE_OSM)
parseXMLListWriteRequest(sxmlWriteRequest, iSelection)
;gbBrlUseOSM can only be BrlUseHybrid, default, or BrlUseOSMAlways
if iSelection
	;if MAGic is running we have to write value 2 in order to get it right:
	iSelection = iSelection +(getRunningFSProducts() & product_MAGic && !(getRunningFSProducts() & product_JAWS))
endIf
writeSettingInteger("HTML", "DocumentPresentationMode", iSelection, FT_CURRENT_JCF, nWriteDestination)
;table line segment setting must be on when document presentation is set to screen,
;and off when it is set to simple layout:
WriteSettingInteger("OSM", "TableLineSegment",iSelection, FT_CURRENT_JCF, nWriteDestination)
WriteSettingInteger(SECTION_BRAILLE, "UseOSM", bBrlUseOsm, FT_CURRENT_JCF, nWriteDestination)
endFunction

Void Function AllowNonbreakingSymbolsDetection(int bSetToUserPreference)
;Used to enable user's detection preference in document area,
;and disable detection otherwise.
if bSetToUserPreference
	SetJCFOption(OPT_INDICATE_NONBREAKING_SYMBOLS, readSettingInteger(Section_Options, hKey_nonbreakingSymbols, 1, FT_CURRENT_JCF))
else
	SetJCFOption(OPT_INDICATE_NONBREAKING_SYMBOLS,0)
endIf
EndFunction

int function IndicateNonbreakingSymbols()
return getJCFOption(opt_indicate_nonbreaking_symbols)
endFunction

String Function IndicateNonbreakingSymbolsToggle(int iRetCurVal)
var
	int iIndicateNonbreakingsymbols = WordUser.app.NonBreakingSymbols,
	collection tmp
tmp = WordUser.app
if !iRetCurVal
	if iIndicateNonbreakingSymbols == IndicateNonbreakingsymbolsSayAll
		iIndicateNonbreakingSymbols = IndicateNonbreakingsymbolsOff
	Else
		iIndicateNonbreakingsymbols = iIndicateNonbreakingsymbols + 1
	EndIf
	SetJcfOption(opt_indicate_nonbreaking_symbols, iIndicateNonbreakingsymbols)
	tmp.NonBreakingSymbols = iIndicateNonbreakingsymbols
EndIf
if iIndicateNonbreakingSymbols == IndicateNonbreakingsymbolsSayAll
	return msgNonbreakingSymbolsSayAll
ElIf iIndicateNonbreakingSymbols == IndicateNonbreakingsymbolsSayLineOrHigher
	return msgNonbreakingsymbolsSayLineOrHigher
ElIf iIndicateNonbreakingSymbols == IndicateNonbreakingSymbolsSayWord
	return msgNonbreakingSymbolsSayWord
ElIf iIndicateNonbreakingSymbols == IndicateNonbreakingSymbolsSayChar
	return msgNonbreakingSymbolsSayChar
else
	return cmsg_off
endIf
EndFunction

int function HeadingsAnnounce()
return getJCFOption(optHeadingIndication)
endFunction

String function vCursorHeadingsAnnounce(int iRetCurVal)
var
	int iMSOfficeHeadingIndication = getJCFOption(optHeadingIndication)
if !iRetCurVal
	if iMSOfficeHeadingIndication == wdVerbosityHigh
		iMSOfficeHeadingIndication = wdVerbosityOff
	else
		iMSOfficeHeadingIndication = iMSOfficeHeadingIndication + 1
	endIf
	SetJCFOption(optHeadingIndication,iMSOfficeHeadingIndication)
endIf
If iMSOfficeHeadingIndication == wdVerbosityOff
	return msgUO_off
Elif iMSOfficeHeadingIndication == wdVerbosityLow
	return msgUO_on
else
	return cmsgHeadings2
endIf
EndFunction

int function GraphicsShowSetting()
return GetJCFOption(OPT_INCLUDE_GRAPHICS)
endFunction

string function GraphicsShow(int iRetCurVal)
;overwritten here to show correct help message for Word and Outlook 2007 messages.
;Also, this version writes to the .jcf file whereas the default version does not persist across JAWS sessions
;or when the application loses focus.
var
	int iMode = GetJCFOption(OPT_INCLUDE_GRAPHICS)
if !iRetCurVal
	If iMode == 2
		iMode = 0
	else
		iMode = iMode+1
	endIf
	SetJcfOption(OPT_INCLUDE_GRAPHICS, iMode)
endIf
return GraphicsShowTextOutput(iMode)
EndFunction

;Application JSI Options

int function StyleDetection()
return GetJCFOption(OPT_INCLUDE_STYLE_INFO)
endFunction

String function toggleStyleDetection(int iRetCurVal)
var
	int iStyleChanges = WordUser.app.StyleChanges
if !iRetCurVal
	if iStyleChanges == wdVerbosityHigh
		iStyleChanges=wdVerbosityOff
		TurnSelectionBitOff(selCtxStyle)
	else
		iStyleChanges = iStyleChanges + 1
		if iStyleChanges==wdVerbosityLow
			TurnSelectionBitOn(selCtxStyle)
		elIf iStyleChanges == wdVerbosityHigh
			if stringContains(getCurrentSchemeName(), scClassic ) == 0
				TurnSelectionBitOff(selCtxStyle) ; turn it on.
			else ; scheme is not classic type.
				TurnSelectionBitOn(selCtxStyle)
			EndIf
		EndIf
	EndIf
	;WordUser.app.StyleChanges = iStyleChanges; because the compiler won't allow direct assignments to a granddaughter.
	var collection tmp
	tmp = WordUser.app
	tmp.StyleChanges = iStyleChanges
endIf
if iStyleChanges == wdVerbosityHigh
	return msgSchemeStyleChanges
elIf iStyleChanges == wdVerbosityLow
	return msgSchemeAndStyleChanges
else
	return cmsg_Off
endIf
EndFunction

string function getStyleDetectionInfo(string settingID)
var
	int nSelectIndex = GetJCFOption(OPT_INCLUDE_STYLE_INFO),
	stringArray szListItems,
	int nSize = 3
szListItems = new stringArray[nSize]
szListItems[1] = cmsg_Off
szListItems[2] = msgSchemeAndStyleChanges
szListItems[3] = msgSchemeStyleChanges
return QsxmlMakeList(settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setStyleDetectionInfo(string settingID, string sXMLWriteRequest, int nWriteDestination)
var
	int iSelection
parseXMLListWriteRequest(sxmlWriteRequest, iSelection)
setJCFOption(OPT_INCLUDE_STYLE_INFO, iSelection)
writeSettingInteger(SECTION_RichEditAndEditControlOptions, "IncludeStyleInfo", iSelection, FT_CURRENT_JCF, nWriteDestination)
endFunction

string function getHeadingsDetectionInfo(string settingID, int nReadSource)
var
	int nSelectIndex,
	stringArray szListItems,
	int nSize = 3
szListItems = new stringArray[nSize]
nSelectIndex = getJcfOption(optHeadingIndication)
szListItems[1] = cmsgOff
szListItems[2] = cmsgOn
szListItems[3] = cmsgHeadings2
return QsxmlMakeList(settingID, nSelectIndex, szListItems, nSize, StyleDetection())
endFunction

void function setHeadingsDetectionInfo(string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int iSelection
parseXMLListWriteRequest(sxmlWriteRequest, iSelection)
setJCFOption(optHeadingIndication, iSelection)
writeSettingInteger(SECTION_HTML, hKey_HeadingIndication, iSelection, FT_CURRENT_JCF)
endFunction

void function setRevisionsManually(int nState)
var
	collection app = WordUser.app
if nState >= ON
	turnCountBitOff(selCtxCountRevisions)
	turnSelectionBitOn(selCtxRevisions)
	app.DetectRevisions = SpeakRevtype;Default
else
	turnCountBitOff(selCtxCountRevisions)
	turnSelectionBitOff(selCtxRevisions)
	app.DetectRevisions = SpeakRevNone
endIf
writeSettingInteger(SECTION_NonJCFOptions, "DetectRevisions", app.DetectRevisions, FT_CURRENT_JCF, wdUser)
writeSettingInteger(SECTION_RichEditAndEditControlOptions, hKey_SelectionContextFlags, GetSelectionContextFlags(), FT_CURRENT_JCF, wdUser)
endFunction

int function RevisionDetection()
return WordUser.app.DetectRevisions
endFunction

String function toggleRevisionDetection(int iRetCurVal)
var
	int nBitState,
	int iDetectRevision = WordUser.app.DetectRevisions
nBitState = getStateOfSelectionBit(selCtxRevisions)
If !iRetCurVal
	if iDetectRevision >= SpeakRevCount
		; reset the count flag
		iDetectRevision = iDetectRevision-SpeakRevCount
		turnCountBitOff(selCtxCountRevisions)
		if iDetectRevision >= SpeakRevTypeAuthorDate
			iDetectRevision = SpeakRevNone
			if nBitState ; turn off revision detection.
				turnSelectionBitOff(selCtxRevisions)
				nBitState = OFF
			EndIf
		else
			iDetectRevision = iDetectRevision+1
		endIf
	elif iDetectRevision > SpeakRevNone
		; the count flag is not set so set it
		iDetectRevision = iDetectRevision + SpeakRevCount
		turnCountBitOn(selCtxCountRevisions)
	else ; just set to the first setting
		iDetectRevision = SpeakRevType
		turnSelectionBitOn(selCtxRevisions)
	endIf
	;WordUser.app.DetectRevisions= iDetectRevision
	var collection tmp = WordUser.app
	tmp.DetectRevisions= iDetectRevision
endIf
if iDetectRevision == speakRevNone
	return cmsg_off
elif iDetectRevision == SpeakRevType
	return msgSpeakRevType_L
elif iDetectRevision == SpeakRevTypeAuthor
	return msgSpeakRevTypeAuthor_L
elif iDetectRevision == SpeakRevTypeAuthorDate
	return msgSpeakRevTypeAuthorDate_L
elif iDetectRevision == (SpeakRevType + SpeakRevCount)
	return msgSpeakRevTypeCount_L
elif iDetectRevision == (SpeakRevTypeAuthor + SpeakRevCount)
	return msgSpeakRevTypeAuthorCount_L
elif iDetectRevision == (SpeakRevTypeAuthorDate + SpeakRevCount)
	return msgSpeakRevTypeAuthorDateCount_L
endIf
EndFunction

string function getRevisionDetectionInfo(string settingID)
var
	int nSelectIndex = RevisionDetection()+getStateOfCountBit(selCtxCountRevisions),
	stringArray szListItems,
	int nSize = 3
szListItems = new StringArray[nSize]
szListItems[1] = cmsg_off
szListItems[2] = msgSpeakRevType_L
szListItems[3] = msgSpeakRevTypeCount_L
return QsxmlMakeList(settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setRevisionDetectionInfo(string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int selection,
	collection location
parseXMLListWriteRequest(sxmlWriteRequest, Selection)
location = WordUser.app
if selection == 2 ; on plus count
	turnCountBitOn(selCtxCountRevisions)
	turnSelectionBitOn(selCtxRevisions)
else
	turnCountBitOff(selCtxCountRevisions)
endIf
if selection == 1 ; on only
	turnSelectionBitOn(selCtxRevisions)
elif selection == 0
	turnSelectionBitOff(selCtxRevisions)
endIf
location.DetectRevisions= selection
writeSettingInteger(SECTION_NonJCFOptions, "DetectRevisions", selection, FT_CURRENT_JCF, nWriteDestination)
var string section, string key
GetSectionAndKeyNamesForSelectionContextFlags(section, key)
writeSettingString(section, key, location[hKey_SelCtxFlags], FT_Current_JCF, nWriteDestination)
writeSettingInteger(section, "CountableSelectionContextItems", GetCountedSelectionContextItems(), FT_Current_JCF, nWriteDestination)
endFunction

int function ExtraHelpIndication()
return WordUser.app.FormFieldHelp
endFunction

String Function ToggleExtraHelpIndication(int iRetCurVal)
Var
	int iFormFieldHelp = WordUser.app.FormFieldHelp
if !iRetCurVal
	if iFormfieldHelp == wdVerbosityHigh ; turn it off
		iFormfieldHelp = 0
		TurnSelectionBitOff(selCtxExtraHelpIndication)
	Else
		iFormfieldHelp = iFormfieldHelp+1
		turnSelectionBitOn(selCtxExtraHelpIndication)
	EndIf
	var collection tmp
	tmp = WordUser.app
	tmp.FormFieldHelp = iFormFieldHelp
endIf
if iFormfieldHelp == wdVerbosityHigh
	return msgF1HelpWithFormfield
ElIf iFormfieldHelp == wdVerbosityLow
	return cmsg_on ; default
else
	return cmsg_off
endIf
EndFunction

string function getExtraHelpIndicationInfo(string SettingID)
Var
	int nSize = 3,
	stringArray szListItems,
	int nSelectIndex = WordUser.app.FormFieldHelp
szListItems = new stringArray[nSize]
szListItems[1] = cmsg_off
szListItems[2] = cmsg_on
szListItems[3] = msgF1HelpWithFormfield
return QsxmlMakeList(settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setExtraHelpIndicationInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
Var
	int iSelection,
	collection location,
	int iFormFieldHelp = WordUser.app.FormFieldHelp
parseXMLListWriteRequest(sxmlWriteRequest, iSelection)
location = WordUser.app
if iSelection == 0
	TurnSelectionBitOff(selCtxExtraHelpIndication)
Else
	turnSelectionBitOn(selCtxExtraHelpIndication)
EndIf
var string section, string key
GetSectionAndKeyNamesForSelectionContextFlags(section, key)
WriteSettingString(section, key, location[hKey_SelCtxFlags], FT_CURRENT_JCF, nWriteDestination)
location.FormFieldHelp = iSelection
WriteSettingInteger(SECTION_NonJCFOptions, "FormFieldHelp", iSelection, FT_CURRENT_JCF, nWriteDestination)
return TRUE
endFunction

int function SpellingErrorDetection()
return WordUser.app.DetectSpelling
endFunction

String Function ToggleSpellingErrorDetection(int iRetCurVal)
Var
	int iDetectSpelling = WordUser.app.DetectSpelling
if !iRetCurVal
	if iDetectSpelling == wdVerbosityHigh
		iDetectSpelling = wdVerbosityOff
		turnSelectionBitOff(selCtxSpellingErrors)
		; check count:
		turnCountBitOff(selCtxCountSpellingErrors)
	else
		iDetectSpelling = iDetectSpelling + 1
		turnSelectionBitOn(selCtxSpellingErrors) ; turn it on.
		if iDetectSpelling == wdVerbosityLow
			turnCountBitOff(selCtxCountSpellingErrors)
		Elif	iDetectSpelling == wdVerbosityHigh ; set count flag.
			turnCountBitOn(selCtxCountSpellingErrors)
		EndIf
	EndIf
	;WordUser.app.DetectSpelling = iDetectSpelling
	var collection tmp
	tmp = WordUser.app
	tmp.DetectSpelling = iDetectSpelling
endIf
if iDetectSpelling == wdVerbosityLow
	return cmsg_on ; default
elif iDetectSpelling == wdVerbosityHigh
	return msg_onCount
Else
	return cmsg_off
endIf
EndFunction

string function getSpellingErrorDetectionInfo(string settingID)
Var
	int nSelectIndex = WordUser.app.DetectSpelling,
	int bDisabledSetting = (getJCFOption(OPT_INDICATE_MISTYPED_WORD) ; spelling buzzer is on
		|| ! GetNonJCFOption("DetectAutoCorrect")), ; or autoCorrect is off
	stringArray szListItems,
	int nSize = 3,
	collection location
szListItems = new stringArray[nSize]
szListItems[1] = cmsg_off
szListItems[2] = cmsg_on
szListItems[3] = msg_onCount
return QsxmlMakeList(settingID, nSelectIndex, szListItems, nSize, bDisabledSetting)
endFunction

void function setClassicSpellingErrorDetectionInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
;Selection and count flags are stored in hex for classic settings, dec for new ones.
Var
	int iSelection,
	collection location,
	int iDetectSpelling = WordUser.app.DetectSpelling
parseXMLListWriteRequest(sxmlWriteRequest, iSelection)
location = WordUser.app
if iSelection == wdVerbosityOff
	turnSelectionBitOff(selCtxSpellingErrors)
	; check count:
	turnCountBitOff(selCtxCountSpellingErrors)
else
	turnSelectionBitOn(selCtxSpellingErrors) ; turn it on.
	if iSelection == wdVerbosityLow
		turnCountBitOff(selCtxCountSpellingErrors)
	Elif iSelection == wdVerbosityHigh ; set count flag.
		turnCountBitOn(selCtxCountSpellingErrors)
	EndIf
EndIf
location[hKey_SelCtxFlags] = decToHex(getSelectionContextFlags())
var string section, string key
GetSectionAndKeyNamesForSelectionContextFlags(section, key)
WriteSettingString(section, key, location[hKey_SelCtxFlags], FT_CURRENT_JCF, nWriteDestination)
;WordUser.app.DetectSpelling = iDetectSpelling
iDetectSpelling = iSelection
location.DetectSpelling = iSelection
writeSettingInteger(SECTION_NonJCFOptions, hKey_DetectSpelling, iDetectSpelling, FT_CURRENT_JCF, nWriteDestination)
endFunction

void function setSpellingErrorDetectionInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
Var
	int iSelection,
	collection location,
	int iDetectSpelling = WordUser.app.DetectSpelling
parseXMLListWriteRequest(sxmlWriteRequest, iSelection)
location = WordUser.app
if iSelection == wdVerbosityOff
	turnSelectionBitOff(selCtxSpellingErrors)
	; check count:
	turnCountBitOff(selCtxCountSpellingErrors)
else
	turnSelectionBitOn(selCtxSpellingErrors) ; turn it on.
	if iSelection == wdVerbosityLow
		turnCountBitOff(selCtxCountSpellingErrors)
	Elif iSelection == wdVerbosityHigh ; set count flag.
		turnCountBitOn(selCtxCountSpellingErrors)
	EndIf
EndIf
location[hKey_SelCtxFlags] = getSelectionContextFlags()
var string section, string key
GetSectionAndKeyNamesForSelectionContextFlags(section, key)
WriteSettingInteger(section, key, location[hKey_SelCtxFlags], FT_CURRENT_JCF, nWriteDestination)
;WordUser.app.DetectSpelling = iDetectSpelling
iDetectSpelling = iSelection
location.DetectSpelling = iSelection
writeSettingInteger(SECTION_NonJCFOptions, hKey_DetectSpelling, iDetectSpelling, FT_CURRENT_JCF, nWriteDestination)
endFunction

int function GrammaticalErrorDetection()
return WordUser.app.DetectGrammar
endFunction

String Function ToggleGrammaticalErrorDetection(int iRetCurVal)
Var
	int iDetectGrammar = WordUser.app.DetectGrammar
if !iRetCurVal
	if iDetectGrammar == wdVerbosityHigh
		iDetectGrammar = wdVerbosityOff
		turnSelectionBitOff(selCtxGrammaticalErrors)
		; check count:
		turnCountBitOff(selCtxCountGrammaticalErrors)
	else
		iDetectGrammar = iDetectGrammar+1
		turnSelectionBitOn(selCtxGrammaticalErrors) ; turn it on.
		if iDetectGrammar == wdVerbosityLow
			turnCountBitOff(selCtxCountGrammaticalErrors)
		Elif	iDetectGrammar == wdVerbosityHigh ; set count flag.
			turnCountBitOn(selCtxCountGrammaticalErrors)
		EndIf
	EndIf
endIf
if iDetectGrammar == wdVerbosityLow
	return cmsg_on ; default
elif iDetectGrammar == wdVerbosityHigh
	return msg_onCount
Else
	return cmsg_off
endIf
EndFunction

string function getGrammaticalErrorDetectionInfo(string settingID)
Var
	collection location,
	int nSelectIndex = getStateOfCountBit(selCtxCountGrammaticalErrors) + getStateOfSelectionBit(selCtxGrammaticalErrors),
	int bDisabledSetting = TRUE,
	stringArray szListItems,
	int nSize = 3
szListItems = new stringArray[nSize]
szListItems[1] = cmsg_off
szListItems[2] = cmsg_on
szListItems[3] = msg_onCount
return QsxmlMakeList(settingID, nSelectIndex, szListItems, nSize, bDisabledSetting)
endFunction

void function setGrammaticalErrorDetectionInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
Var
	int iSelection,
	collection location,
	int iDetectGrammar = WordUser.app.DetectGrammar
parseXMLListWriteRequest(sxmlWriteRequest, iSelection)
location = WordUser.app
if iSelection == wdVerbosityOff
	turnSelectionBitOff(selCtxGrammaticalErrors)
	; check count:
	turnCountBitOff(selCtxCountGrammaticalErrors)
else
	turnSelectionBitOn(selCtxGrammaticalErrors) ; turn it on.
	if iSelection == wdVerbosityLow
		turnCountBitOff(selCtxCountGrammaticalErrors)
	Elif	iSelection == wdVerbosityHigh ; set count flag.
		turnCountBitOn(selCtxCountGrammaticalErrors)
	EndIf
EndIf
var string section, string key
GetSectionAndKeyNamesForSelectionContextFlags(section, key)
WriteSettingString(section, key, location[hKey_SelCtxFlags], FT_CURRENT_JCF, nWriteDestination)
location.DetectGrammar = iSelection
writeSettingInteger(SECTION_NonJCFOptions, "DetectGrammar", iSelection, FT_CURRENT_JCF, nWriteDestination)
endFunction

string function getSpellingBuzzerInfo(string settingID)
var
	int Disabled = TRUE,
	int state = readSettingInteger(SECTION_OPTIONS, "IndicateMistypedWord", 0, FT_CURRENT_JCF, rsStandardLayering)
return qsxmlMakeBoolean(settingID, qsxmlMakeBooleanState(state), Disabled)
endFunction

void function setSpellingBuzzerInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int state
parseXMLBooleanWriteRequest(sxmlWriteRequest, state)
writeSettingInteger(SECTION_OPTIONS, "IndicateMistypedWord", state, FT_CURRENT_JCF, wdUser)
endFunction

int function BookmarkDetection()
return WordUser.app.DetectBookmarks
endFunction

String Function ToggleBookmarkDetection(int iRetCurVal)
Var
	int iDetectBookmarks = WordUser.app.DetectBookmarks
if !iRetCurVal
	if iDetectBookmarks == wdVerbosityHigh
		iDetectBookmarks = wdVerbosityOff
		turnSelectionBitOff(selCtxBookmarks)
	else
		iDetectBookmarks = iDetectBookmarks + 1
		turnSelectionBitOn(selCtxBookmarks)
	EndIf
	;WordUser.app.DetectBookmarks = iDetectBookmarks
	var collection tmp
	tmp = WordUser.app
	tmp.DetectBookmarks = iDetectBookmarks
endIf
if iDetectBookmarks == wdVerbosityLow
	return cmsg_On
elIf iDetectBookmarks == wdVerbosityHigh
	return msg_AnnotationOnWithText
else
	return cmsg_Off
endIf
EndFunction

string function getBookmarkDetectionInfo(string settingID)
var
	int nSelectIndex = WordUser.app.DetectBookmarks,
	stringArray szListItems,
	int nSize = 3
szListItems = new stringArray[nSize]
szListItems[1] = cmsg_Off
szListItems[2] = cmsg_On
szListItems[3] = msg_AnnotationOnWithText
return QsxmlMakeList(settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setBookmarkDetectionInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
Var
	int iSelection,
	collection location,
	int iDetectBookmarks = WordUser.app.DetectBookmarks
parseXMLListWriteRequest(sxmlWriteRequest, iSelection)
location = WordUser.app
if iSelection == wdVerbosityOff
	turnSelectionBitOff(selCtxBookmarks)
else
	turnSelectionBitOn(selCtxBookmarks)
EndIf
var string section, string key
GetSectionAndKeyNamesForSelectionContextFlags(section, key)
writeSettingString(section, key, location[hKey_SelCtxFlags], FT_CURRENT_JCF, nWriteDestination)
;WordUser.app.DetectBookmarks = iDetectBookmarks
location.DetectBookmarks = iSelection
return WriteSettingInteger("NonJCFOptions", "DetectBookmarks", iSelection, FT_CURRENT_JCF, nWriteDestination)
endFunction

int function getDesiredUnitsOfMeasure()
return SMMGetDesiredUnitsOfMeasure()
endFunction

String Function ToggleSetDesiredUnitOfMeasure(int iRetCurVal)
Var
	collection tmp,
	int iDesiredUnit,
	string sUnitDesc
tmp = WordUser.app
;iDesiredUnit = tmp[hKey_MeasurementUnits]
iDesiredUnit = SMMGetDesiredUnitsOfMeasure()
if !iRetCurVal
	if iDesiredUnit==smmInches
		iDesiredUnit = smmPixels
	Else
		iDesiredUnit = iDesiredUnit+1
	endIf
	;let gbDesiredUnit=true ; Todo: find out what the purpose of this is
	tmp[hKey_MeasurementUnits] = iDesiredUnit
	SMMSetDesiredUnitsOfMeasure(iDesiredUnit)
endIf
if iDesiredUnit == smmPixels
	sUnitDesc = msgPixels
ElIf iDesiredUnit == smmSpaces
	sUnitDesc = msgSpaces
ElIf iDesiredUnit == smmPoints
	sUnitDesc = msgPoints1_L
elif iDesiredUnit == smmCm
	sUnitDesc = msgCentimeters1_L
elif iDesiredUnit == smmMM
	sUnitDesc = msgMillimeters1_L
elif iDesiredUnit == smmInches
	sUnitDesc = msgInches1_L
EndIf
if sUnitDesc == GetAppUnitOfMeasure()
	sUnitDesc = FormatString(msgDefaultUnitOfMeasure,GetAppUnitOfMeasure())
EndIf
return FormatString(msgSetToUnitOfMeasure,sUnitDesc)
EndFunction

string function getDesiredUnitsOfMeasureInfo(string settingID)
Var
	collection tmp,
	int iDesiredUnit,
	int nSelectIndex,
	stringArray szListItems,
	int nSize = 6,
	string sUnitDesc
szListItems = new stringArray[nSize]
tmp = WordUser.app
;iDesiredUnit = tmp[hKey_MeasurementUnits]
iDesiredUnit = SMMGetDesiredUnitsOfMeasure()
nSelectIndex = iDesiredUnit - 1 ; 0 = pixels in the list.
sUnitDesc = msgPixels
if sUnitDesc == GetAppUnitOfMeasure()
	sUnitDesc = FormatString(msgDefaultUnitOfMeasure,GetAppUnitOfMeasure())
EndIf
szListItems[smmPixels] = FormatString(msgSetToUnitOfMeasure,sUnitDesc)
sUnitDesc = msgSpaces
if sUnitDesc == GetAppUnitOfMeasure()
	sUnitDesc = FormatString(msgDefaultUnitOfMeasure,GetAppUnitOfMeasure())
EndIf
szListItems[smmSpaces] = FormatString(msgSetToUnitOfMeasure,sUnitDesc)
sUnitDesc = msgPoints1_L
if sUnitDesc == GetAppUnitOfMeasure()
	sUnitDesc = FormatString(msgDefaultUnitOfMeasure,GetAppUnitOfMeasure())
EndIf
szListItems[smmPoints] = FormatString(msgSetToUnitOfMeasure,sUnitDesc)
sUnitDesc = msgMillimeters1_L
if sUnitDesc == GetAppUnitOfMeasure()
	sUnitDesc = FormatString(msgDefaultUnitOfMeasure,GetAppUnitOfMeasure())
EndIf
szListItems[smmMM] = FormatString(msgSetToUnitOfMeasure,sUnitDesc)
sUnitDesc = msgCentimeters1_L
if sUnitDesc == GetAppUnitOfMeasure()
	sUnitDesc = FormatString(msgDefaultUnitOfMeasure,GetAppUnitOfMeasure())
EndIf
szListItems[smmCM] = FormatString(msgSetToUnitOfMeasure,sUnitDesc)
sUnitDesc = msgInches1_L
if sUnitDesc == GetAppUnitOfMeasure()
	sUnitDesc = FormatString(msgDefaultUnitOfMeasure,GetAppUnitOfMeasure())
EndIf
szListItems[smmInches] = FormatString(msgSetToUnitOfMeasure,sUnitDesc)
return QsxmlMakeList(settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setDesiredUnitsOfMeasureInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
Var
	collection tmp,
	int iSelection,
	int iDesiredUnit,
	string sUnitDesc
parseXMLListWriteRequest(sxmlWriteRequest, iSelection)
tmp = WordUser.app
;iDesiredUnit = tmp[hKey_MeasurementUnits]
;iDesiredUnit = SMMGetDesiredUnitsOfMeasure()
;iSelection starts at 0 but in reality, the options start at 1.
iDesiredUnit  = iSelection+1
;let gbDesiredUnit=true ; Todo: find out what the purpose of this is
tmp[hKey_MeasurementUnits] = iDesiredUnit
SMMSetDesiredUnitsOfMeasure(iDesiredUnit)
return writeSettingInteger(SECTION_NonJCFOptions, hKey_MeasurementUnits, iDesiredUnit, FT_CURRENT_JCF, nWriteDestination)
endFunction

void function SetNewLinesAndParagraphsIndication(int iState)
WriteSettingInteger(SECTION_Options, "IndicateNewLinesAndParagraphs", iState, FT_CURRENT_JCF)
EndFunction

int Function NewLinesAndParagraphsIndication()
return getJCFOption(OPT_INDICATE_NEWLINES)
endFunction

String Function ToggleNewLinesAndParagraphsIndication(int iRetCurVal)
var
	int indicateNewLines = getJCFOption(OPT_INDICATE_NEWLINES)
if !iRetCurVal
	if indicateNewLines == IndicateParagraphMarks ; for reading and during SayAll
		indicateNewLines = IndicateWhenTyping + IndicateWhenNavigating
	elIf indicateNewLines == IndicateWhenTyping+indicateWhenNavigating
		indicateNewLines = indicateNewLines + IndicateWhenReading
	elif indicateNewLines == IndicateWhenTyping+indicateWhenNavigating+IndicateWhenReading 
		indicateNewLines = indicateWhenTyping + indicateWhenReading
	elIf indicateNewLines == indicateWhenTyping + indicateWhenReading		
		indicateNewLines = indicateWhenNavigating + indicateWhenReading
	elif indicateNewLines == indicateWhenNavigating + indicateWhenReading
		indicateNewLines = wdVerbosityOff
	elIf indicateNewLines == IndicateWhenTyping
		indicateNewLines = IndicateWhenNavigating
	elIf indicateNewLines == IndicateWhenNavigating
		indicateNewLines = IndicateWhenReading
	elIf indicateNewLines ==IndicateWhenReading
		indicateNewLines =IndicateParagraphMarks ; for reading and during SayAll
	elIf indicateNewLines == off
		indicateNewLines = IndicateWhenTyping
	endIf
	setJCFOption(OPT_INDICATE_NEWLINES,indicateNewLines)
EndIf
if indicateNewLines == IndicateWhenTyping
	return msgIndicateWhenTyping
elIf indicateNewLines == IndicateWhenNavigating
	return msgIndicateWhenNavigating
elif indicateNewLines == IndicateWhenReading
	return msgIndicateWhenReading
elif indicateNewLines == IndicateParagraphMarks
	return msgIndicateDuringSayAll
elIf indicateNewLines == IndicateWhenTyping + indicateWhenNavigating
	return msgIndicateWhenTypingAndNavigating
elIf indicateNewLines == IndicateWhenTyping + indicateWhenReading
	return msgIndicateWhenTypingAndReading
elIf indicateNewLines == IndicateWhenTyping + indicateWhenNavigating + IndicateWhenReading
	return msgIndicateWhenTypingAndNavigatingAndReading
elIf indicateNewLines ==indicateWhenNavigating + IndicateWhenReading
	return msgIndicateWhenNavigatingAndReading
elIf indicateNewLines == IndicateParagraphMarks
	return msgIndicateDuringSayAll
Else
	return cmsg_off
endIf
EndFunction

string function getNewLinesAndParagraphsIndicationInfo(string settingID)
var
	int nSelectIndex,
	int indicateNewLines = getJCFOption(OPT_INDICATE_NEWLINES),
	stringArray szListItems,
	int nSize = 9
szListItems = new stringArray[nSize]
szListItems[1] = cmsg_off
szListItems[2] = msgIndicateWhenTyping
szListItems[3] = msgIndicateWhenNavigating
szListItems[4] = msgIndicateWhenReading
szListItems[5] = msgIndicateWhenTypingAndNavigating
szListItems[6] = msgIndicateWhenTypingAndReading
szListItems[7] = msgIndicateWhenTypingAndNavigatingAndReading
szListItems[8] = msgIndicateWhenNavigatingAndReading
szListItems[9] = msgIndicateDuringSayAll
If indicateNewLines == IndicateWhenTyping
	nSelectIndex = 1
elIf indicateNewLines == IndicateWhenNavigating
	nSelectIndex = 2
elif indicateNewLines == IndicateWhenReading
	nSelectIndex = 3
elIf indicateNewLines == IndicateWhenTyping + indicateWhenNavigating
	nSelectIndex = 4
elIf indicateNewLines == IndicateWhenTyping + indicateWhenReading
	nSelectIndex = 5
elIf indicateNewLines == IndicateWhenTyping + indicateWhenNavigating + IndicateWhenReading
	nSelectIndex = 6
elIf indicateNewLines ==indicateWhenNavigating + IndicateWhenReading
	nSelectIndex = 7
elIf indicateNewLines == IndicateParagraphMarks
	nSelectIndex = 8
Else
	nSelectIndex = 0
endIf
return QsxmlMakeList(settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setNewLinesAndParagraphsIndicationInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	int indicateNewLines
parseXMLListWriteRequest(sxmlWriteRequest, iSelection)
;if indicateNewLines == IndicateParagraphMarks ; for reading and during SayAll
if iSelection == 0
	indicateNewLines = OFF
elIf iSelection == 1
	indicateNewLines = IndicateWhenTyping
elIf iSelection == 2
	indicateNewLines = IndicateWhenNavigating
elIf iSelection == 3
	indicateNewLines = IndicateWhenReading
elIf iSelection == 4
	indicateNewLines = IndicateWhenTyping + indicateWhenNavigating
elIf iSelection == 5
	indicateNewLines = IndicateWhenTyping + indicateWhenReading
elIf iSelection == 6
	indicateNewLines = IndicateWhenTyping + indicateWhenNavigating + IndicateWhenReading
elIf iSelection == 7
	indicateNewLines = indicateWhenNavigating + IndicateWhenReading
elIf iSelection == 8
	indicateNewLines = IndicateParagraphMarks
endIf
return WriteSettingInteger(SECTION_Options, "IndicateNewLinesAndParagraphs", indicateNewLines, FT_CURRENT_JCF, nWriteDestination)
endFunction

int function TableDescription()
var
	collection location
location = WordUser.app
return location[hKey_tableDescription]
endFunction

String function ToggleTableDescription(int iRetCurVal)
var
	collection location
location = WordUser.app
if !iRetCurVal
	location[hKey_tableDescription] = ! location[hKey_tableDescription]
EndIf
if location[hKey_tableDescription]
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

int function SchemeIsDocSpecific()
return WordUser.app.SchemeDocSpecific
endFunction

String function ToggleScheme(int iRetCurVal)
var
	collection app,
	collection doc,
	string SchemeName
app = WordUser.app
doc = wdDocument.doc;
if !iRetCurVal
	app[hKey_SchemeDocSpecific] = ! app[hKey_SchemeDocSpecific]
	SchemeName = GetCurrentSchemeName()
	if app[hKey_SchemeDocSpecific] 
		app.Scheme = SchemeName
	else
		doc.Scheme = SchemeName
	endIf
endIf
if app[hKey_SchemeDocSpecific]
	return msgSchemeNameDoc
else
	return msgSchemeNameApp
endIf
EndFunction

string function getSchemeInfo(string settingID)
var
	int nSelectIndex,
	stringArray szListItems,
	int nSize = 2,
	collection app
szListItems = new stringArray[nSize]
szListItems[1] = msgSchemeNameApp
szListItems[2] = msgSchemeNameDoc
app = WordUser.app
nSelectIndex = app[hKey_SchemeDocSpecific]
return QsxmlMakeList(settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setSchemeInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	collection app,
	collection doc,
	string SchemeName
parseXMLListWriteRequest(sxmlWriteRequest, iSelection)
app = WordUser.app
doc = wdDocument.doc;
app[hKey_SchemeDocSpecific] = iSelection
writeSettingInteger("NonJCFOptions", hKey_SchemeDocSpecific, app[hKey_SchemeDocSpecific], FT_CURRENT_JCF, nWriteDestination)
SchemeName = GetCurrentSchemeName()
if iSelection == 0 ; app-specific scheme)
	app.Scheme = SchemeName
	writeSettingString(SECTION_OPTIONS, "Scheme", SchemeName, FT_CURRENT_JCF, nWriteDestination)
else
	doc.Scheme = SchemeName
	WriteSettingString("Doc", "Scheme", SchemeName, FT_JSI, nWriteDestination, getActiveDocumentJSIFileName())
endIf
endFunction

int function TabMeasurementIndicationSetting()
return WordUser.app.TabMeasurementIndication
endFunction

String function TabMeasurementIndication(int iRetCurVal)
var
	collection app
app = WordUser.app
If !iRetCurVal
	app.TabMeasurementIndication = ! app.TabMeasurementIndication
EndIf
If app.TabMeasurementIndication 
	Return msgUO_On
Else
	Return msgUO_Off
EndIf
EndFunction

int function LineSpacingDetection()
return WordUser.app.LineSpacingDetection
endFunction

String function ToggleLineSpacingDetection(int iRetCurVal)
var
	collection app
app = WordUser.app
if !iRetCurVal
	app.LineSpacingDetection = ! app.LineSpacingDetection
EndIf
SynchronizeNonJCFOptionsWithSelectionContext()
if app.LineSpacingDetection  then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

int function IncludeBlankParagraphsForParagraphNavigation()
return WordUser.app.IncludeBlankParagraphsForParagraphNavigation
endFunction

int function CellCoordinatesDetection()
return WordUser.app.AnnounceCellCoordinates
endFunction

String function toggleCellCoordinatesDetection(int iRetCurVal)
var
	collection app
app = WordUser.app
if !iRetCurVal
	app[hKey_announceCellCoordinates] = ! app[hKey_announceCellCoordinates]
endIf
if app[hKey_announceCellCoordinates]
	return cmsg_On
else
	return cmsg_Off
endIf
EndFunction

int function ObjectCountDetection()
return WordUser.app.DetectObjectCount
endFunction

String function ToggleObjectCountDetection(int iRetCurVal)
var
	collection app
app = WordUser.app
if !iRetCurVal
	app.DetectObjectCount = ! app.DetectObjectCount
EndIf
if app.DetectObjectCount
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

int function HeadersFootersDetection()
return WordUser.app.DetectHeadersFooters
endFunction

String function ToggleHeadersFootersDetection(int iRetCurVal)
var
	collection app
app = WordUser.app
if !iRetCurVal
	app.DetectHeadersFooters = !app.DetectHeadersFooters
EndIf
if app.DetectHeadersFooters
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

int function BrlTableNumberDisplay()
return WordUser.app.DisplayBRLTableNumber
endFunction

String function ToggleBrlTableNumberDisplay(int iRetCurVal)
var
	collection app
app = WordUser.app
if !iRetCurVal
	app[hKey_BrlTableNumberDisplay] = ! app[hKey_BrlTableNumberDisplay]
EndIf
if app[hKey_BrlTableNumberDisplay]
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

;Table Options:

int function OverrideDocNamedTitles()
;OVERRIDE_TITLES_OFF, OVERRIDE_TITLES_ALL, OVERRIDE_TITLES_FILE
if(wdDocument.doc.NamedTitles)
	return 2
else
return WordUser.app.NamedTitles
endIf
endFunction

String function ToggleOverrideDocNamedTitles(int iRetCurVal)
var
	int nSetting,
	collection app, collection doc;
doc = new collection;
app = WordUser.app
if !wdDocument
	wdDocument = new collection;
endIf
if !collectionItemExists(wdDocument, "doc")
	wdDocument.doc = doc
else
	doc = wdDocument.doc
endIf
if !collectionItemExists(wdDocument, getActiveTableJSISectionName())
	wdActiveTable = new Collection
	wdDocument[getActiveTableJSISectionName()] = wdActiveTable
else
	wdActiveTable = wdDocument[getActiveTableJSISectionName()]
endIf
if !iRetCurVal
	if app[hKey_NamedTitlesApp] == 1 && doc[hKey_NamedTitlesApp] == 0 ; on for all files
		app[hKey_NamedTitlesApp] = 0
		doc[hKey_NamedTitlesApp] = 2
	elIf doc[hKey_NamedTitlesApp] == 2; on for the current file
		doc[hKey_NamedTitlesApp] = 0
		app[hKey_NamedTitlesApp] = 0
	else
		doc[hKey_NamedTitlesApp] = 0
		app[hKey_NamedTitlesApp] = 1
	endIf
endIf
nSetting = app[hKey_NamedTitlesApp] + doc[hKey_NamedTitlesApp]
if nSetting == 2
	return msgNamedTitlesFile
elIf nSetting == 1
	return msgNamedTitlesApp
Else
	return cmsg_off
endIf
EndFunction

string function getOverrideDocNamedTitlesInfo(string settingID)
var
	int nSelectIndex,
	stringArray szListItems,
	int nSize = 3
szListItems = new stringArray[nSize]
;indeces for lists are 1 long for real values.
nSelectIndex = OverrideDocNamedTitles()
szListItems[1] = cmsg_off
szListItems[2] = msgNamedTitlesApp
szListItems[3] = msgNamedTitlesFile
return QsxmlMakeList(settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setOverrideDocNamedTitlesInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	int nSetting,
	collection app, collection doc;
parseXMLListWriteRequest(sxmlWriteRequest, iSelection)
doc = new collection;
app = WordUser.app
if !wdDocument
	wdDocument = new collection;
endIf
if !collectionItemExists(wdDocument, "doc")
	wdDocument.doc = doc
else
	doc = wdDocument.doc
endIf
if !collectionItemExists(wdDocument, getActiveTableJSISectionName())
	wdActiveTable = new Collection
	wdDocument[getActiveTableJSISectionName()] = wdActiveTable
else
	wdActiveTable = wdDocument[getActiveTableJSISectionName()]
endIf
if iSelection == 2
	app[hKey_NamedTitlesApp] = 0
	writeSettingInteger(SECTION_NonJCFOptions, hKey_NamedTitlesApp, 0, FT_CURRENT_JCF, nWriteDestination)
	doc[hKey_NamedTitlesApp] = 2
	writeSettingInteger("Doc", hKey_NamedTitlesApp, 2, FT_JSI, nWriteDestination, getActiveDocumentJSIFileName())
elIf iSelection == 1
	doc[hKey_NamedTitlesApp] = 0
	WriteSettingInteger("Doc", hKey_NamedTitlesApp, 0, FT_JSI, nWriteDestination, getActiveDocumentJSIFileName())
	app[hKey_NamedTitlesApp] = 1
	writeSettingInteger(SECTION_NonJCFOptions, hKey_NamedTitlesApp, 1, FT_CURRENT_JCF, nWriteDestination)
elIf iSelection == 0
	doc[hKey_NamedTitlesApp] = 0
	writeSettingInteger("Doc", hKey_NamedTitlesApp, 0, FT_JSI, nWriteDestination, getActiveDocumentJSIFileName())
	app[hKey_NamedTitlesApp] = 0
	writeSettingInteger(SECTION_NonJCFOptions, hKey_NamedTitlesApp, 0, FT_CURRENT_JCF, nWriteDestination)
endIf
return TRUE
endFunction

int function TableTitlesAnnounce()
if OverrideDocNamedTitles()
	return wdActiveTable[hKey_titleReading]
else
	return getNonJCFOption("TblHeaders")
endIf
endFunction

String function vCursorTableTitlesAnnounce(int iRetCurVal)
var
	int nOverride = OverrideDocNamedTitles(),
	collection location
If !GetJCFOption(optTableIndication)
	Return cMsgNotAvailable
EndIf
if nOverride > 0
	location = wdActiveTable
	if !iRetCurVal
		if location[hKey_titleReading] >= readBothTitles
			location[hKey_titleReading] = readNoTitles
		else
			location[hKey_titleReading] = location[hKey_titleReading] + 1
		endIf
	endIf
	if location[hKey_titleReading] == readNoTitles
		return cmsg_off
	elif location[hKey_titleReading] == readColumnTitles
		return msgReadColumnTitles1_L
	elif location[hKey_titleReading] == readRowTitles
		return msgReadRowTitles1_L
	elif location[hKey_titleReading] == readBothTitles
		return msgReadBothTitles1_L
	endIf
Else ; Using defined table bookmark titles.
 	; therefore, the setting cannot be changed by user.
	return msgTableTitlesBookmarkDefined
endIf
EndFunction

string function getTableTitlesAnnounceInfo(string settingID)
var
	int nOverride = OverrideDocNamedTitles(),
	int nSelectIndex,
	stringArray szListItems,
	int nSize = 4
szListItems = new stringArray[nSize]
if getDocumentTableIndex() > 0
	szListItems[1] = cmsg_off
	szListItems[2] = msgReadColumnTitles1_L
	szListItems[3] = msgReadRowTitles1_L
	szListItems[4] = msgReadBothTitles1_L
	nSelectIndex = wdActiveTable[hKey_titleReading]
else
	szListItems = new StringArray[1]
	szListItems[1] = cMSGNotInTable_l
endIf
return QsxmlMakeList(settingID, nSelectIndex, szListItems, nSize, ! nOverride)
endFunction

void function setTableTitlesAnnounceInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection
if !getDocumentTableIndex()
|| !OverrideDocNamedTitles()
	Return
endIf
parseXMLListWriteRequest(sxmlWriteRequest, iSelection)
if !getDocumentTableIndex()
|| !OverrideDocNamedTitles()
	Return
endIf
if iSelection > 0
	wdActiveTable[hKey_titleReading] = iSelection
	writeSettingInteger(getActiveTableJSISectionName(), hKey_titleReading, wdActiveTable[hKey_titleReading], FT_JSI, wdUser, getActiveDocumentJSIFileName())
else
	CollectionRemoveItem(wdActiveTable, hKey_titleReading)
	iniRemoveKeyEx(getActiveTableJSISectionName(), hKey_titleReading, FLOC_USER_PERSONALIZED_SETTINGS, getActiveDocumentJSIFileName())
endIf
ColumnTitlesRowDependee((iSelection&ReadColumnTitles)>0)
RowTitlesColumnDependee((iSelection&ReadRowTitles)>0)
endFunction

void function TitlesAnnounceDependee(int iSelection)
if !getDocumentTableIndex()
|| !OverrideDocNamedTitles()
	Return
endIf
if iSelection > 0
	wdActiveTable[hKey_titleReading] = iSelection
	return writeSettingInteger(getActiveTableJSISectionName(), hKey_titleReading, wdActiveTable[hKey_titleReading], FT_JSI, wdUser, getActiveDocumentJSIFileName())
else
	CollectionRemoveItem(wdActiveTable, hKey_titleReading)
	return iniRemoveKeyEx(getActiveTableJSISectionName(), hKey_titleReading, FLOC_USER_PERSONALIZED_SETTINGS, getActiveDocumentJSIFileName())
endIf
endFunction

int function RowTitlesColumn()
return wdActiveTable[hKey_titleColumn]
endFunction

String Function setRowTitlesColumn(int iRetCurVal)
var
	int nCol,
	int nOverride = OverrideDocNamedTitles(),
	collection location, collection activeTable
if nOverride > 0
	location = wdActiveTable
	activeTable = location; all titles are the same.
	if !iRetCurVal
		if IsDocumentTableActive()
		&& getTableNestingLevel() <=1
			GetDocumentTableCellCoordinates(nCol, 0)
			if nCol
				activeTable[hKey_titleColumn] = nCol
			endIf
			location[hKey_titleReading] = location[hKey_titleReading] | readRowTitles
		endIf
	endIf
	nCol = activeTable[hKey_titleColumn]
	if IsDocumentTableActive()
		if getTableNestingLevel() > 1
			return msgCantDefineForNestedTable1_L
		elif ! nCol
			return formatString(msgNotDefinedForTable1_L, intToString(getDocumentTableIndex()))
		else
			return formatString(msgSetRowTitlesColumn1_L, intToString(nCol), intToString(getDocumentTableIndex()))
		endIf
	else
		return msgSetRowTitlesColumn2_L
	endIf
else ; using defined table bookmark titles
	return msgDefinedTableBookmarkTitlesError
endIf
EndFunction

string function getRowTitlesColumnInfo(string settingID)
var
	int bAlreadyDefined,
	int nCol,
	int nOverride = OverrideDocNamedTitles(),
	collection location,
	int nSelectIndex,
	stringArray szListItems,
	int nSize = 2
szListItems = new stringArray[nSize]
if getDocumentTableIndex() > 0
	location = wdActiveTable
	nCol = location[hKey_titleColumn]
	if !nCol
		nCol = getActiveTableCellColumn()
	else
		bAlreadyDefined = TRUE
	endIf
	if getTableNestingLevel() > 1
		;return msgCantDefineForNestedTable1_L
		szListItems[1] = msgCantDefineForNestedTable1_L
	elif !bAlreadyDefined
		szListItems[1] = formatString(msgNotDefinedForTable1_L, intToString(getDocumentTableIndex()))
		szListItems[2] = formatString(msgSetRowTitlesColumn1_L, intToString(nCol), intToString(getDocumentTableIndex()))
		nSelectIndex = 0
	else
		szListItems[1] = formatString(msgNotDefinedForTable1_L, intToString(getDocumentTableIndex()))
		szListItems[2] = formatString(msgSetRowTitlesColumn1_L, intToString(nCol), intToString(getDocumentTableIndex()))
		nSelectIndex = 1
	endIf
else
	szListItems = new StringArray[1]
	szListItems[1] = cMSGNotInTable_l
endIf
return QsxmlMakeList(settingID, nSelectIndex, szListItems, nSize, ! nOverride)
endFunction

void function setRowTitlesColumnInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	int nCol,
	string sDocFileName = getActiveDocumentJSIFileName()
if !getDocumentTableIndex()
|| !OverrideDocNamedTitles()
	Return
endIf
parseXMLListWriteRequest(sxmlWriteRequest, iSelection)
nCol = getActiveTableCellColumn()
if iSelection 
	if nCol
		wdActiveTable[hKey_titleColumn] = nCol
		iniWriteIntegerEX(getActiveTableJSISectionName(), hKey_titleColumn, nCol, FLOC_USER_PERSONALIZED_SETTINGS, sDocFileName)
	endIf
else
	collectionRemoveItem(wdActiveTable, hKey_titleColumn)
	iniRemoveKeyEx(getActiveTableJSISectionName(), hKey_titleColumn, FLOC_USER_PERSONALIZED_SETTINGS, sDocFileName)
	wdActiveTable[hKey_titleReading] = wdActiveTable[hKey_titleReading] &~readRowTitles
	iniWriteIntegerEx(getActiveTableJSISectionName(), hKey_titleReading, wdActiveTable[hKey_titleReading], FLOC_USER_PERSONALIZED_SETTINGS, sDocFileName)
endIf
iniFlushEx(FLOC_USER_PERSONALIZED_SETTINGS, sDocFileName)
if iSelection
	TitlesAnnounceDependee(TableTitlesAnnounce()|ReadRowTitles)
endIf
endFunction

void function RowTitlesColumnDependee(int iSelection)
var
	int nCol,
	string sDocFileName = getActiveDocumentJSIFileName()
if !getDocumentTableIndex()
	Return
endIf
nCol = getActiveTableCellColumn()
if iSelection 
	if nCol
		wdActiveTable[hKey_titleColumn] = nCol
		iniWriteIntegerEX(getActiveTableJSISectionName(), hKey_titleColumn, nCol, FLOC_USER_PERSONALIZED_SETTINGS, sDocFileName)
	endIf
else
	collectionRemoveItem(wdActiveTable, hKey_titleColumn)
	iniRemoveKeyEx(getActiveTableJSISectionName(), hKey_titleColumn, FLOC_USER_PERSONALIZED_SETTINGS, sDocFileName)
	wdActiveTable[hKey_titleReading] = wdActiveTable[hKey_titleReading] &~readRowTitles
	iniWriteIntegerEx(getActiveTableJSISectionName(), hKey_titleReading, wdActiveTable[hKey_titleReading], FLOC_USER_PERSONALIZED_SETTINGS, sDocFileName)
endIf
iniFlushEx(FLOC_USER_PERSONALIZED_SETTINGS, sDocFileName)
endFunction

int function ColumnTitlesRow()
return wdActiveTable[hKey_titleRow]
endFunction

string Function setColumnTitlesRow(int iRetCurVal)
var
	int nRow,
	int nOverride = OverrideDocNamedTitles(),
	collection activeTable,
	collection location
if nOverride > 0
	location = wdActiveTable
	activeTable = wdActiveTable
	if !iRetCurVal
		if IsDocumentTableActive()
		&& getTableNestingLevel() <= 1
			GetDocumentTableCellCoordinates(0, nRow)
			location[hKey_titleReading] = location[hKey_titleReading] | readColumnTitles
			if nRow
				activeTable[hKey_titleRow] = nRow
			endIf
		endIf
	endIf
	nRow = activeTable[hKey_titleRow]
	if IsDocumentTableActive()
		if getTableNestingLevel() > 1
			return msgCantDefineForNestedTable1_L
		elif !nRow
			return formatString(msgNotDefinedForTable1_L, intToString(getDocumentTableIndex()))
		else
			return formatString(msgSetColTitlesRow1_L, intToString(nRow), intToString(getDocumentTableIndex()))
		endIf
	else
		return msgSetColTitlesRow2_L
	endIf
else ; using defined table bookmark titles
	return msgDefinedTableBookmarkTitlesError
endIf
EndFunction

string function getColumnTitlesRowInfo(string settingID)
var
	int bAlreadyDefined,
	int nRow,
	int nOverride = OverrideDocNamedTitles(),
	collection location,
	int nSelectIndex,
	stringArray szListItems,
	int nSize = 2
szListItems = new stringArray[nSize]
if getDocumentTableIndex() > 0
	location = wdActiveTable
	nRow = location[hKey_TitleRow]
	if !nRow
		nRow = getActiveTableCellRow()
	else
		bAlreadyDefined = TRUE
	endIf
	if getTableNestingLevel() > 1
		;return msgCantDefineForNestedTable1_L
		szListItems[1] = msgCantDefineForNestedTable1_L
	elif !bAlreadyDefined
		szListItems[1] = formatString(msgNotDefinedForTable1_L, intToString(getDocumentTableIndex()))
		szListItems[2] = formatString(msgSetColTitlesRow1_L, intToString(nRow), intToString(getDocumentTableIndex()))
		nSelectIndex = 0
	else
		szListItems[1] = formatString(msgNotDefinedForTable1_L, intToString(getDocumentTableIndex()))
		szListItems[2] = formatString(msgSetColTitlesRow1_L, intToString(nRow), intToString(getDocumentTableIndex()))
		nSelectIndex = 1
	endIf
else
	szListItems = new StringArray[1]
	szListItems[1] = cMSGNotInTable_l
endIf
return QsxmlMakeList(settingID, nSelectIndex, szListItems, nSize, !nOverride)
endFunction

void function setColumnTitlesRowInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	int nRow,
	int nOverride = OverrideDocNamedTitles(),
	string sDocSection= getActiveTableJSISectionName(),
	string sDocFileName = getActiveDocumentJSIFileName()
if !getDocumentTableIndex()
|| !OverrideDocNamedTitles()
	Return
endIf
parseXMLListWriteRequest(sxmlWriteRequest, iSelection)
nRow = getActiveTableCellRow()
if iSelection 
	if nRow
		wdActiveTable[hKey_TitleRow] = nRow
		iniWriteIntegerEx(getActiveTableJSISectionName(), hKey_titleRow, nRow, FLOC_USER_PERSONALIZED_SETTINGS, sDocFileName)
		iniFlushEx(FLOC_USER_PERSONALIZED_SETTINGS, sDocFileName)
	endIf
else
	collectionRemoveItem(wdActiveTable, hKey_TitleRow)
	iniRemoveKeyEx(getActiveTableJSISectionName(), hKey_titleRow, FLOC_USER_PERSONALIZED_SETTINGS, sDocFileName)
	wdActiveTable[hKey_titleReading] = wdActiveTable[hKey_titleReading] &~readColumnTitles
	iniWriteIntegerEx(getActiveTableJSISectionName(), hKey_titleReading, wdActiveTable[hKey_titleReading], FLOC_USER_PERSONALIZED_SETTINGS, sDocFileName)
	iniFlushEx(FLOC_USER_PERSONALIZED_SETTINGS, sDocFileName)
endIf
if iSelection
	TitlesAnnounceDependee(TableTitlesAnnounce()|ReadColumnTitles)
endIf
endFunction

void function ColumnTitlesRowDependee(int iSelection)
var
	int nRow,
	int nOverride = OverrideDocNamedTitles(),
	string sDocSection= getActiveTableJSISectionName(),
	string sDocFileName = getActiveDocumentJSIFileName()
if !getDocumentTableIndex()
|| !OverrideDocNamedTitles()
	Return
endIf
nRow = getActiveTableCellRow()
if iSelection & readColumnTitles
	if nRow
		wdActiveTable[hKey_TitleRow] = nRow
		writeSettingInteger(getActiveTableJSISectionName(), hKey_titleRow, nRow, FT_JSI, wdUser, sDocFileName)
	endIf
elif !iSelection
	collectionRemoveItem(wdActiveTable, hKey_TitleRow)
	iniRemoveKeyEx(getActiveTableJSISectionName(), hKey_titleRow, FLOC_USER_PERSONALIZED_SETTINGS, sDocFileName)
	iniFlushEx(FLOC_USER_PERSONALIZED_SETTINGS, sDocFileName)
endIf
endFunction

void function OnTablesInfoChange_Legacy(string settingID, string xmlWriteRequest)
var
	int iSelection,
	string sAltID,
	string sDependee
if !getDocumentTableIndex()
	return FALSE
endIf
;for Clear definitions, we want to read but not write:
if stringSegment(settingID, ".", -1) == "TitleDefinitionsClear"
	return
endIf
ParseXMLDependenceEvent(xmlWriteRequest, iSelection, sAltID)
sDependee = stringSegment(settingID, ".", -1)
sAltID = stringSegment(sAltID, ".", -1)
if sAltID == "DefinedBookmarkTableColumnAndRowTitlesOverride"
	iSelection = 0;
	if sDependee == "TableTitlesAnnounce"
		return TitlesAnnounceDependee(iSelection)
	elIf sDependee == "ColumnTitlesRowSet"
		return ColumnTitlesRowDependee(iSelection)
	elIf sDependee == "RowTitlesColumnSet"
		return RowTitlesColumnDependee(iSelection)
	endIf
endIf
if sDependee == "TableTitlesAnnounce"
	; Set Selection to the relevant column or row setting.
	if sAltID == "ColumnTitlesRowSet"
		iSelection = ReadColumnTitles
	elIf sAltID == "RowTitlesColumnSet"
		iSelection = ReadRowTitles
	endIf
	return TitlesAnnounceDependee(iSelection)
elIf sDependee == "ColumnTitlesRowSet"
	return ColumnTitlesRowDependee(iSelection)
elIf sDependee == "RowTitlesColumnSet"
	return RowTitlesColumnDependee(iSelection)
endIf
endFunction

void function OnTablesInfoChange(string settingID, string xmlWriteRequest)
;dummy stub in case someone has their own .qs file.
;Now managing callback dependencies from within the callback itself, saving some back-and-forth
; between the QuickSettings tool and the application and JAWS / MAGic
endFunction

string function clearTitleRowAndColumnDefinition(int iRetCurVal)
var
	string tableSection,
	string jsiName
if iRetCurVal
	return cscNull
endIf
collectionRemoveAll(wdActiveTable)
if IsDocumentTableActive() && getDocumentTableIndex()
	return msgClearDefinitions1_L
else
	return msgClearDefinitions2_L
endIf
EndFunction

string function getClearTitleRowAndColumnDefinitionInfo(string settingID)
var
	int nOverride = overrideDocNamedTitles(),
	int bDisabled = ! nOverride && ! IsDocumentTableActive(),
	int nState = ! collectionItemsCount(wdActiveTable)
return qsxmlMakeBoolean(settingID, qsxmlMakeBooleanState(nState), bDisabled)
endFunction

void function setClearTitleRowAndColumnDefinitionInfo(string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int nState
parseXMLBooleanWriteRequest(sxmlWriteRequest, nState)
if !getDocumentTableIndex()
	Return
endIf
collectionRemoveAll(wdActiveTable)
iniRemoveSectionEX(GetActiveTableJSISectionName(), FLOC_USER_PERSONALIZED_SETTINGS, GetActiveDocumentJSIFileName())
iniFlushEX(FLOC_USER_PERSONALIZED_SETTINGS, GetActiveDocumentJSIFileName())
endFunction

;End of individual options

string function QuickSettingDisabledEvent(string settingID)
var
	string setting = stringSegment(settingID, ".", -1)
if settingID == "BrailleOptions.TableOptions.TableShowTitles"
|| settingID == "BrailleOptions.TableOptions.TableShowCoordinates"
	return qsxmlMakeDisabledSetting(settingID, StringStartsWith(GetActiveConfiguration(),"outlook"))
EndIf
if setting == "AutomaticTableTitles"
|| setting == "HeaderAndContentOrder"
	return qsxmlMakeDisabledSetting(settingID, TRUE)
endIf
if setting == "UseVPCInsteadOfEnhancedEditModeForReadOnlyDocs"
	return qsxmlMakeDisabledSetting(settingID, !(getRunningFSProducts()& product_MAGic))
endIf
if setting == "TableTitlesAnnounce"
|| setting == "ColumnTitlesRowSet"
|| setting == "RowTitlesColumnSet"
|| setting == "TitleDefinitionsClear"
	;return qsxmlMakeDisabledSetting(settingID,(getDocumentTableIndex() > 0 && OverrideDocNamedTitles() > 0))
elIf setting == "IncludeDimensions"
	return qsxmlMakeDisabledSetting(settingID, TRUE)
elIf setting == "TableDetection" && OutlookIsActive()
	return qsxmlMakeDisabledSetting(settingID,(! IsVirtualPcCursor() ))
elIf setting == "UIAEditControls" 
; Since there's only one setting from WordSettings.General Options in Outlook,
; prevent empty node from showing up:
|| setting == "GeneralOptions"
	return qsxmlMakeDisabledSetting(settingID, isOffice365())
endIf
return QuickSettingDisabledEvent(settingID)
endFunction

string function AllowOffice365Settings(string settingID)
return qsxmlMakeDisabledSetting (settingID, includeOffice365Settings)
endFunction

String Function getDefaultOptionsLists()
;this list will also include the default Braille List.
var
	string sList,
	string sSegment,
	string sListItem,
	string sTemp,
	int index,
	int iCount
sList=cStrDefaultList()
if BrailleInUse()
	sList=sList+
		cStrBrailleList()+
		cstrBrailleMarkingList()+
		cStrDefaultHTMLList()+
		cStrTableBrailleList()
endIf
iCount=stringSegmentCount(sList,cscListSeparator )
index=2
while index<=iCount
	sSegment=stringSegment(sList,cscListSeparator ,index)
	sListItem=subString(sSegment,stringContains(sSegment,scColon)+1,stringLength(sSegment))
	sTemp=sTemp+cscListSeparator +sListItem
	index=index+1
endWhile
return sTemp
endFunction

int Function IsDefaultOption(handle hwnd)
var
	string sText
sText=tvGetFocusItemText(hwnd)
sText=stringLeft(sText,stringContains(sText,sc_DashWithSpaces)-1)
if !stringSegmentIndex(GetDefaultOptionsLists(),cscListSeparator ,sText,false)
	return false
endIf
return true
endFunction

string Function NodeHlp(string sNodeName)
If StringContains(sNodeName,Node_Formatting)
	return FormatString(msgUO_FormattingHlp)
ElIf StringContains(sNodeName,NODE_Tables)
	return FormatString(msgUO_TablesHlp)
ElIf StringContains(sNodeName,NODE_DocumentSettings)
	return FormatString(MSGUO_DocumentSettingsHlp)
ElIf StringContains(sNodeName,NODE_reading)
	return FormatString(MSGUO_WordReadingOptionsHlp)
else
	Return NodeHlp(sNodeName);Default
EndIf
EndFunction

String Function EditingOptionsHlp()
Return FormatString(msgUO_WordEditingOptionsHlp)
EndFunction

String Function GeneralHlp()
Return FormatString(msgUO_WordGeneralOptionsHlp)
EndFunction

String Function BrailleHlp()
Return FormatString(msgUO_WordBrailleOptionsHlp)
EndFunction

String Function FormattingHlp()
Return FormatString(msgUO_FormattingHlp)
EndFunction

String Function TablesHlp()
return FormatString(msgUO_TablesHlp)
EndFunction

String Function DocumentSettingsHlp()
return FormatString(msgUO_DocumentSettingsHlp)
EndFunction

int function AutoCorrectDetection()
return wordUser.app.DetectAutoCorrect
endFunction

string function getAutoCorrectDetectionInfo(string SettingID)
var int setting = wordUser.app.DetectAutoCorrect
return qsxmlMakeBoolean(settingID, qsxmlMakeBooleanState(Setting))
endFunction

void function setAutoCorrectDetectionInfo(string SettingID, string XmlWriteRequest, int WriteDestination)
var int setting
parseXMLBooleanWriteRequest(xmlWriteRequest, setting)
var collection location = wordUser.app
location.DetectAutoCorrect = setting
writeSettingInteger(section_NonJCFOptions, "DetectAutoCorrect", setting, Ft_current_jcf, WriteDestination)
endFunction

String Function ToggleShowBrlProofreadingMarkHlp(int iRetCurVal)
return FormatString(msgUO_ToggleShowBrlProofreadingMarkHlp,msgDefaultSettingIsOff)
EndFunction

String function ToggleSpellingErrorDetectionHlp(int iRetCurVal)
return formatString(msgUO_ToggleSpellingErrorDetectionHlp,msgDefaultSettingIsOff)
EndFunction

String Function ToggleGrammaticalErrorDetectionHlp(int iRetCurVal)
return formatString(msgUO_ToggleGrammaticalErrorDetectionHlp,msgDefaultSettingIsOff)
EndFunction

String Function ToggleSetDesiredUnitOfMeasureHlp(int iRetCurVal)
Return FormatString(msgUO_ToggleSetDesiredUnitOfMeasureHlp)
EndFunction

String Function ToggleShadingDetectionHlp(int iRetCurVal)
return formatString(msgUO_ToggleShadingDetectionHlp,msgDefaultSettingIsOff)
EndFunction

String Function ToggleExtraHelpIndicationHlp(int iRetCurVal)
return formatString(msgUO_ToggleExtraHelpIndicationHlp,msgDefaultSettingIsOn)
EndFunction

String Function ToggleBookmarkDetectionHlp(int iRetCurVal)
return formatString(msgUO_ToggleBookmarkDetectionHlp,msgDefaultSettingIsOff)
EndFunction

String Function ToggleStyleDetectionHlp(int iRetCurVal)
return formatString(msgUO_ToggleStyleDetectionHlp,msgDefaultSettingIsOff)
EndFunction

String Function ToggleRevisionDetectionHlp(int iRetCurVal)
return FormatString(msgUO_ToggleRevisionDetectionHlp)
EndFunction

String Function TogglePositionDetectionHlp(int iRetCurVal)
Return formatString(msgUO_TogglePositionDetectionHlp,msgDefaultSettingIsOn)
EndFunction

String Function ToggleIndicateBulletTypeHlp(int iRetCurVal)
return formatString(msgUO_ToggleIndicateBulletTypeHlp,msgDefaultSettingIsOn)
EndFunction

String Function ToggleIndicateBrailleBulletTypeHlp(int iRetCurVal)
Return formatString(msgUO_ToggleIndicateBrailleBulletTypeHlp,msgDefaultSettingIsOn)
EndFunction

String Function ToggleSchemeHlp(int iRetCurVal)
return FormatString(msgUO_ToggleSchemeHlp)
EndFunction

String Function ToggleBorderDetectionHlp(int iRetCurVal)
return formatString(msgUO_ToggleBorderDetectionHlp,msgDefaultSettingIsOff)
EndFunction

string function GraphicsShowHlp()
Return formatString(msgUO_WDOLGraphicsShowHlp,
	FormatString(msgShowOptionDefaultSetting,
			GraphicsShowTextOutput(GetIntOptionDefaultSetting(SECTION_OSM,hKey_IncludeGraphics))))
EndFunction

String Function ToggleNotesDetectionHlp(int iRetCurVal)
return formatString(msgUO_ToggleNotesDetectionHlp,msgDefaultSettingIsOn)
EndFunction

String Function WordDocumentPresentationSetHlp(int iRetCurVal)
return FormatString(msgUO_WordDocumentPresentationSetHlp)
EndFunction

String function SetRowTitlesColumnHlp(int iRetCurVal)
return FormatString(msgUO_SetRowTitlesColumnHlp)
EndFunction

String function SetColumnTitlesRowHlp(int iRetCurVal)
return FormatString(msgUO_SetColumnTitlesRowHlp)
EndFunction

String function ClearTitleRowAndColumnDefinitionHlp(int iRetCurVal)
return FormatString(msgUO_ClearTitleRowAndColumnDefinitionHlp)
EndFunction

String function ToggleOverrideDocNamedTitlesHlp(int iRetCurVal)
return formatString(msgUO_ToggleOverrideDocNamedTitlesHlp,msgDefaultSettingIsOff)
EndFunction

String Function ToggleCountBeforeHlp(int iRetCurVal)
return FormatString(MsgUO_ToggleCountBeforeHlp)
EndFunction

String Function NavigationQuickKeysSetHlp(int iRetCurVal)
Return formatString(msgUO_WordNavigationQuickKeysSetHlp,msgDefaultSettingIsOff)
EndFunction

string function GetWordNavigationQuickKeysInfo(string SettingID)
;var int setting = ReadSettingInteger(SECTION_OPTIONS, hKey_QuickKeyNavigationMode, 0, ft_Current_JCF, rsStandardLayering)
; ReadSettingInteger fails because it gets it from the file.
; user may have set it via the temporary setting with insert+z.
var int Setting = GetJCFOption(OPT_QUICK_KEY_NAVIGATION_MODE)
return qsxmlMakeBoolean(settingID, qsxmlMakeBooleanState(Setting))
endFunction

void function SetWordNavigationQuickKeysInfo(string SettingID, string XmlWriteRequest, int WriteDestination)
var int setting
parseXMLBooleanWriteRequest(xmlWriteRequest, setting)
writeSettingInteger(SECTION_OPTIONS, hKey_QuickKeyNavigationMode, Setting, ft_Current_JCF, WriteDestination)
endFunction

String function ToggleAnnounceListNestingLevelHlp(int iRetCurVal)
return formatString(msgUO_ToggleAnnounceListNestingLevelHlp,msgDefaultSettingIsOff)
EndFunction

String Function ToggleTableDetectionHlp(int iRetCurVal)
return formatString(msgUO_ToggleTableDetectionHlp,msgDefaultSettingIsOn)
EndFunction

String Function ToggleTableDescriptionHlp(int iRetCurVal)
return formatString(msgUO_ToggleTableDescriptionHlp,msgDefaultSettingIsOn)
EndFunction

String Function IndicateNonbreakingSymbolsToggleHlp(int iRetCurVal)
return FormatString(msgUO_IndicateNonbreakingSymbolsToggleHlp)
EndFunction

String function vCursorHeadingsAnnounceHlp(int iRetCurVal)
Return FormatString(msgUO_WordVCursorHeadingsAnnounceHlp)
EndFunction

String function TabMeasurementIndicationHlp(int iRetCurVal)
Return formatString(msgUO_TabMeasurementIndicationHlp,msgDefaultSettingIsOn)
EndFunction

String Function LanguageDetectChangeHlp(int iRetCurVal)
Return formatString(msgUO_WordLanguageDetectChangeHlp,msgDefaultSettingIsOn)
EndFunction

String Function TreeCoreGetDefaultBrailleOptions(optional int DiscardRootNode)
Var
	string sBranchLeaves,
	string sBranchName,
	string sRootName,
	String cStrBrailleList
if !DiscardRootNode
	sRootName = NODE_BRL_+NODE_PATH_DELIMITER
EndIf
;Default Option at top:
sBranchName = sRootName
	sBranchLeaves =
		UO_ToggleIndicateBrailleBulletType+_dlg_separator+
		UO_ToggleShowBrlProofreadingMark+_dlg_separator+
		UO_ActiveModeOption+_dlg_separator
ConvertListToNodeList(sBranchLeaves, sBranchName)
cStrBrailleList = cStrBrailleList+sBranchLeaves
sBranchLeaves=Null()
sBranchName=Null()
;Grade 2 Output Options:
sBranchName = sRootName+NODE_BRL_G2
sBranchLeaves =
		UO_GradeTwoModeOption+_dlg_separator+
		uo_Grade2Rules+_dlg_separator+
		UO_CurrentWordExpand+_dlg_separator+
		UO_G2CapsSuppress+_dlg_separator
ConvertListToNodeList(sBranchLeaves, sBranchName)
cStrBrailleList = cStrBrailleList+sBranchLeaves
sBranchLeaves=Null()
sBranchName=Null()
;Cursor Options:
sBranchName = sRootName+NODE_BRL_CURSOR
sBranchLeaves =
		UO_ActiveFollowsBraille+_dlg_separator+
		UO_BrailleFollowsActive+_dlg_separator
ConvertListToNodeList(sBranchLeaves, sBranchName)
cStrBrailleList = cStrBrailleList+sBranchLeaves
sBranchLeaves=Null()
sBranchName=Null()
;Panning Options:
sBranchName = sRootName+NODE_BRL_PANNING
sBranchLeaves =
		UO_PanBy+_dlg_separator+
		UO_WordWrap+_dlg_separator+
		UO_AutoPan+_dlg_separator
ConvertListToNodeList(sBranchLeaves, sBranchName)
cStrBrailleList = cStrBrailleList+sBranchLeaves
sBranchLeaves=Null()
sBranchName=Null()
;Level0 items, general:
sBranchName = sRootName
sBranchLeaves =
		UO_EightDotBraille+_dlg_separator+
		UO_BrailleMarking+_dlg_separator
ConvertListToNodeList(sBranchLeaves, sBranchName)
cStrBrailleList = cStrBrailleList+sBranchLeaves
sBranchLeaves=Null()
sBranchName=Null()
;Braille Marking Options:
sBranchName = sRootName+NODE_BRL_MARKING
sBranchLeaves = TreeCoreGetDefaultBrailleMarkingList()+_dlg_separator
ConvertListToNodeList(sBranchLeaves, sBranchName)
cStrBrailleList = cStrBrailleList+sBranchLeaves
sBranchLeaves=Null()
sBranchName=Null()
;Table Options for Braille(modified default):
sBranchName =sRootName+NODE_BRL_TABLE
sBranchLeaves =
		UO_BrailleZoom+_dlg_separator+
		UO_BrailleShowHeaders+_dlg_separator+
		UO_BrailleShowCoords+_dlg_separator+
		UO_ToggleBrlTableNumberDisplay+_dlg_separator
ConvertListToNodeList(sBranchLeaves, sBranchName)
cStrBrailleList = cStrBrailleList+sBranchLeaves
sBranchLeaves=Null()
sBranchName=Null()
;Final level 0 items, don't relate to any of the categories:
sBranchName = sRootName
sBranchLeaves =
		UO_FlashMessages+_dlg_separator+
		UO_BrailleKeysInterruptSpech+_dlg_separator+
		uo_BrailleStudyMode+_dlg_separator
ConvertListToNodeList(sBranchLeaves, sBranchName)
cStrBrailleList = cStrBrailleList+sBranchLeaves
sBranchLeaves=Null()
sBranchName=Null()
return cStrBrailleList
EndFunction

String Function ToggleLineSpacingDetectionHlp(int iRetCurVal)
return FormatString(msgUO_ToggleLineSpacingDetectionHlp)
EndFunction

String Function toggleCellCoordinatesDetectionHlp(int iRetCurVal)
return formatString(msgUO_toggleCellCoordinatesDetectionHlp,msgDefaultSettingIsOn)
EndFunction

String Function vCursorTableTitlesAnnounceHlp(int iRetCurVal)
If !GetJCFOption(optTableIndication)
	Return FormatString(msgvCursorTablesUnavailableHlp)
Else
	Return FormatString(msgUO_WordVCursorTableTitlesAnnounceHlp)
EndIf
EndFunction

String function IndentationIndicateHlp(int iRetCurVal)
Var
	int iDesiredUnit = IndentationIndication(),
	string sUnitDesc
if iDesiredUnit == smmPixels
	sUnitDesc=msgPixels
ElIf iDesiredUnit == smmSpaces
	sUnitDesc=msgSpaces
ElIf iDesiredUnit == smmPoints
	sUnitDesc=msgPoints1_L
elif iDesiredUnit == smmCm
	sUnitDesc=msgCentimeters1_L
elif iDesiredUnit == smmMM
	sUnitDesc=msgMillimeters1_L
elif iDesiredUnit == smmInches
	sUnitDesc=msgInches1_L
EndIf
if sUnitDesc==getAppUnitOfMeasure()
	sUnitDesc=FormatString(msgDefaultUnitOfMeasure,GetAppUnitOfMeasure())
EndIf
Return formatString(msgUO_WordIndentationIndicateHlp,sUnitDesc	)
EndFunction

int function UserBufferOverVirtualDocument()
return( ; add viewer condition e.g ! stringcontains(UserBufferGetText(), stuff)
UserBufferOverVirtualDocument() )
endFunction

String Function ToggleSelCtxWithMarkupHlp(int iRetCurVal)
return FormatString(msgUO_ToggleSelCtxWithMarkupHlp,msgDefaultSettingIsOff)
EndFunction

String Function ToggleNewLinesAndParagraphsIndicationHlp(int iRetCurVal)
return FormatString(msgUO_ToggleNewLinesAndParagraphsIndicationHlp)
endFunction

String Function ToggleObjectCountDetectionHlp(int iRetCurVal)
return formatString(msgUO_ToggleObjectCountDetectionHlp,msgDefaultSettingIsOn)
EndFunction

String Function ToggleBrlTableNumberDisplayHlp(int iRetCurVal)
return formatString(msgUO_ToggleBrlTableNumberDisplayHlp,msgDefaultSettingIsOn)
EndFunction

int function saveApplicationSettings()
var
	int bSettingsSaved,
	int bRemovedItems,
	collection user, ; for writing only those settings to file which aren't in Default.
	string section,
	string item
user = new collection
user.nonJCFOptions = CollectionCopy(WordUser.app)
if collectionItemsCount(user.nonJCFOptions)
	bSettingsSaved = iniWriteFromCollection(user, WordJCFFileName, FLOC_USER_SETTINGS)
	if bSettingsSaved
		;deliberately manage flushing to disk to ensure all settings changed in dialog make it.
		iniFlushEX(FLOC_USER_SETTINGS, WordJCFFileName)
	endIf
	return bSettingsSaved && bRemovedItems
else
	return TRUE;stuff got removed
endIf
endFunction

int function setCurrentDocumentMarkedPlace (int iPlace)
if !iPlace
	iPlace = GetCurCharPos()
endIf
iniWriteInteger(GetActiveDocumentName(), hKey_MarkedPlace, iPlace, MarkedPlaceDocJSIFileName)
endFunction

int Function GetCurrentDocumentMarkedPlace()
var
	int iMarkedPlace = 0,
	string sDocName,
	string sSections
If !FileExists(findJAWSPersonalizedSettingsFile(MarkedPlaceDocJSIFileName))
	;the user has not created a marked place in any document.
	return false
endIf
;a file exists containing at least one document with a marked place set.
sDocName = GetActiveDocumentName()
sSections = IniReadSectionNames(MarkedPlaceDocJSIFileName)
if !StringContains(sSections, sDocName)
	;the file does not contain a marked place for the current document.
	iMarkedPlace = 0
else
	iMarkedPlace = iniReadInteger(sDocName, hKey_MarkedPlace, iMarkedPlace, MarkedPlaceDocJSIFileName)
endIf
return iMarkedPlace
EndFunction

Script AdjustJAWSOptions()
var
	collection location
location = WordUser.app
If OutlookIsActive()
	performScript AdjustJAWSOptions()
	return
endIf
if InHJDialog()
	SayFormattedMessage(OT_error, cMSG337_L, cMSG337_S)
	return
endIf
var
	int bPriorUserBufferState,
	int bPriorTrapKeys,
	int bPriorQuickNavState,
	collection prevWordUser,
	collection prevWdDocument,
	collection PrevWdActiveTable,
	string strFile,
	string sDocJSI,
	string sNodeName,; the branch or group containing application-specific options
	string sList, ; the list of options in a particular branch or group.
	string swdList ;the master list that comprises all the items in the main application branch,
bPriorQuickNavState=getJCFOption(OPT_QUICK_KEY_NAVIGATION_MODE)
bPriorUserBufferState=UserBufferIsActive()
bPriorTrapKeys=UserBufferIsTrappingKeys()
prevWordUser = CollectionCopy(WordUser)
prevWdDocument = CollectionCopy(wdDocument)
prevWdActiveTable = CollectionCopy(wdActiveTable)
; Since Word can be in virtual state while screen-sensitive help is active, we need the below test.
;Now that we always want to do the app's options, even if ScreenSensitive or HotKeyHelp are on, use function that knows if Virtual cursor was active,
;before the viewer can be up.
;Override the function in this file if there are certain viewers you only want the Default options for.
;there is a function override above this script you can add to for a viewer that should not accept JAWS options for Word.
If UserBufferOverVirtualDocument()
;and/or anything else that will only run Default options:
&& !bPriorQuickNavState
	performScript AdjustJAWSOptions() ;default
else
	OptionsTreeCore(cscNull,false,cscNull)
EndIf
; always save JCF options,
; the iniWrite and associated FileFinder code will manage this.
saveJCFOptions()
if !bPriorUserBufferState
|| bPriorQuickNavState
	; determine which settings changed
	; app specific first
	if !CollectionCompare(WordUser, prevWordUser)
		strFile = FindJAWSPersonalizedSettingsFile(JSIFileName, TRUE)
		if fileExists(strFile)
			iniDeleteFile(strFile)
			iniFlushEX(FLOC_UNKNOWN, strFile)
		endIf
		if saveApplicationSettings()
			SayFormattedMessageWithVoice(vctx_message,ot_status,msgAppSettingsSaved1_L, cMsgSilent)
		else
			SayFormattedMessage(ot_error, msgAppSettingsNotSaved1_L)
		endIf
	EndIf
	; document specific
	; Test whether need to save other document-specific settings:
	if !collectionCompare(wdDocument, prevWdDocument)
		iniDeleteFile(getActiveDocumentJSIFileName())
		if iniWriteFromCollection( wdDocument, getActiveDocumentJSIFileName(), FLOC_USER_PERSONALIZED_SETTINGS)
			SayFormattedMessageWithVoice(vctx_message,ot_status,msgDocSettingsSaved1_L, cMsgSilent)
			;UpdateDocumentPointer()
		endIf
	EndIf
EndIf
; if Word was in a virtual state before the dialog was launched, return to that state.
if bPriorUserBufferState
	UserBufferActivate(bPriorTrapKeys)
endIf
;check quick key navigation state change:
if bPriorQuickNavState
	;check for whether it has changed.
	if getJcfOption(opt_quick_key_navigation_mode)==0
		SetJcfOption(opt_quick_key_navigation_mode,0)
		SetQuickKeyNavigationState(0)
	EndIf
	location.NonBreakingSymbols = getJCFOption(opt_indicate_nonbreaking_symbols)
EndIf
EndScript
