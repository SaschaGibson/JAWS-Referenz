;Copyright (C) 2021 Vispero Inc.
;Author Joseph Stephen
;This script set contains all Multiline Braille support.
include "hjConst.jsh"
include "hjglobal.jsh"
include "common.jsm"
include "braille.jsh"
globals
int giBrlSplitCommandPromptHistory

int function ShouldIncludeView(string viewName)
;Override this in an App specific jss file to return false to exclude views which should not be included for the app.
; For example, in Excel, the app base is excel
; In that case we wish to ignore excelClassic.
; At a minimum, this checks to see if the JBS has a validation function 
if !BrailleRunJBSValidationFunction(viewName) then
	return false;
endIf

return true
endFunction

string function AddStructuredViewDescriptions(string list, string localizedList)
var
int index,
int count,
string newList,
string name,
string title,;this is the localized name from the JBS file
string filename,
string desc,
string defaultDesc

defaultDesc = IniReadString ("Information", "description", cscNull, "default.jbs")

count=StringSegmentCount (list, "|")

for index=1 to count
	title = StringSegment (localizedList, "|", index)
	name=StringSegment (list, "|", index)
	fileName=name+".jbs"
	desc=IniReadString ("Information", "description", cscNull, fileName)
	if desc==cscNull then
		desc=defaultDesc 
	endIf
	if desc !=cscNull then
	title=title+":"
	title=title+desc
	endIf
	
	newList=newList+title
	newList=newList+"|"
endFor

return newList
endFunction

string Function ReplaceViewNamesWithTitles(string sList, string sDelimiter)
var
	int iCount = StringSegmentCount (sList, sDelimiter),
	int i,
	string sFileName,
	string sTitle
For i = 1 to iCount
	sFileName = GetJAWSScriptLangDirectory() + cScDoubleBackSlash + StringSegment (sList, sDelimiter, i) + FileExt_JBS
	sTitle = IniReadString (Section_Information, hKey_Title, cscNull, sFileName, rsNoTransient)
	if !StringIsBlank (sTitle)
		sList = StringSegmentReplace(sList, sDelimiter, i, sTitle)
	endIf
EndFor
return sList
EndFunction

string function GetStructuredModeViewsForCurrentApp()
var
string app,
string search,
string list
app=GetActiveConfiguration (false)
; Search for names of the form basename followed by a dash followed by something, e.g. excel-Active View on 1, Monitor Cells on 2.jbs
search=app+"-*.JBS"
if stringLength(list) > 0 && stringRight(list, 1)!="|" then
	list = list + "|"
endIf
list=list+FileNameList (search,"|", "ShouldIncludeView")
return list
endFunction

int function IsCommandPrompt()
If GetWindowClass(GetFocus()) == cwc_ConsoleWindow then
	return true
endIf
if GetObjectClassName() == "TermControl" then
	return true
endIf
return false
endFunction

int function SwitchToScriptedAppView(int scriptedAppViewIndex)
; This function should be overridden in an app's script set to control a scripted Braille view.
; The first valid view should have index 1, the second 2, etc.
; if the index is 0, reset the scripted app view to its default.
; If the index is non-0, switch to that view.
; If you switched, return a non-zero value.
var int changed=scriptedAppViewIndex!=giBrlSplitCommandPromptHistory
giBrlSplitCommandPromptHistory=! giBrlSplitCommandPromptHistory
if (giBrlSplitCommandPromptHistory)
	BrailleSplitMode(brlSplitCommandPromptAndHistory)
else
	BrailleSplitMode(0)
	endIf
return changed
endFunction

int function GetScriptedAppViewIndex()
;Override this in an app's script set.
; return a 1-based index of the active scripted view.
; The first valid view should have index 1, the second 2, etc.
; Return 0 if no scripted app view currently enabled.
If !IsCommandPrompt() then
	return 0
endIf
if giBrlSplitCommandPromptHistory then
	return 1
else
	return 0
endIf
endFunction

string function GetScriptedAppViews()
;Override this in an app's script set to return a delimited list of scripted views. e.g. "Message list + message preview|..."
; The first valid view should have index 1, the second 2, etc.
If !IsCommandPrompt() then
	return cscNull
endIf
if giBrlSplitCommandPromptHistory then
	return FormatString(cmsgSplitCommandHistory, cmsgOn)
else
	return FormatString(cmsgSplitCommandHistory, cmsgOff)
endIf
endFunction

void function RevertToDefaultBrailleView()
BrailleSplitMode(0) ; Reset builtin view.
IniWriteString (GetBrailleDisplaySectionName(), "PreferredJBS", cscNull, GetActiveConfiguration (false)+".jcf", true, wdSession)
BrailleSwitchToJBSFile(GetActiveConfiguration (false)) ; revert to app's default JBS file.
switchToScriptedAppView(0) ; Ask any app scripted view to reset itself.
	SetJCFOption(OPT_BRL_CROPPED_MODE, 0)
	endFunction

void function AppendToList(string byref masterList, string list)
if list==cscNull then
	return
endIf

masterList=masterList+"|"
masterList=masterList+list
endFunction

void function UpdateMultilineViewInJCF()
var
int multilineView=brlMultilineViewNotSet,
int curSplitMode=BrailleGetSplitMode(),
string brailleDisplaySection=GetBrailleDisplaySectionName (),
int croppedMode=GetJCFOption(OPT_BRL_CROPPED_MODE)
; Note if split mode  is not one of the below, just leave multilineView set to brlMultilineViewNotSet and let internals handle.
if curSplitMode==brlSplitAnnotations then
multilineView=brlMultilineViewAnnotations
elif curSplitMode==brlSplitTextAndAttributes
multilineView=brlMultilineViewAttributes
elif curSplitMode==brlSplitBrailleAndSpeech
multilineView=brlMultilineViewSpeechHistory
elif curSplitMode==brlSplitTranslation
multilineView=brlMultilineViewSplitTranslation
endIf
WriteSettingInteger (brailleDisplaySection, hKey_BRAILLE_MultilineView, multilineView, FT_CURRENT_JCF, wdSession, GetActiveConfiguration (false)+".jcf")
WriteSettingInteger (brailleDisplaySection, hKey_BRAILLE_CROPPED_MODE, croppedMode, FT_CURRENT_JCF, wdSession, GetActiveConfiguration (false)+".jcf")
endFunction

;This function determines if Cropped Mode Vertical Alignment is relevant.
;If it is not, then neither is cropped mode.
int function IsVerticalAlignmentRelevant()
if BrailleGetLineCount() < 2 then 
	return false
endIf
if BrailleIsSimulatingTwoLines() then
	return false; not that useful when simulating on a single line display, except for testing.
endIf
return true
endFunction

void function SwapSplitData()
var
int splitDataLineIndex=getJCFOption(OPT_SPLIT_DATA_LINE_INDEX),
int max=2,
string msg,
string brailleDisplaySection=GetBrailleDisplaySectionName ()

if splitDataLineIndex ==max then
	splitDataLineIndex=1
else
	splitDataLineIndex=splitDataLineIndex+1
endIf
SetJCFOption(OPT_SPLIT_DATA_LINE_INDEX, splitDataLineIndex)
msg=formatString(cmsgSplitDataLine,splitDataLineIndex)
SayFormattedMessage(OT_JAWS_MESSAGE, msg)
; Write it out.
WriteSettingInteger (brailleDisplaySection, hKey_BRAILLE_SPLIT_DATA_LINE, splitDataLineIndex, FT_CURRENT_JCF, wdUSER, GetActiveConfiguration (false)+".jcf")
endFunction

void function AddComputerBrailleEntryToListIfNeeded(string byref modeListString)
if ProfileUsesLiblouisForComputerBraille() then
	return ; Already supported by Liblouis for this profile.
endIf
var string compBrlEntry=formatString("0|%1|%2|%3#", cmsgComputerBraille, BrailleGetProfileLangTLA(), cmsgComputerBraille)
modeListString =compBrlEntry+modeListString
endFunction

int function GetSplitTranslationLine2ListAndIndex(string byref list, string byref modeData)
var
int curProfileModeID,
int curLine2ModeID,
string modeListString,
string filteredModeList,
int loopIndex,
int count,
int indexToUse=1,
int filteredItemCount=0,
string modeInfo,
string key

; exclude this mode ID for this language since it will be on line 1.
curProfileModeID=BrailleGetProfileContractedModeID()
; Get the current line 2 mode ID for the current language.
key=hKey_Braille_Multitranslation+BrailleGetProfileLangTLA()
curLine2ModeID = readSettingInteger(GetBrailleDisplaySectionName(), key, 0, FT_CURRENT_JCF)
; Get the list of ModeIDS for this language excluding curProfileModeID, the modeID used for line 1.
;GetBrailleModesForLanguage delimits each info set with a #.
; Within each info set, various parameters are delimited with a |.
modeListString = GetBrailleModesForLanguage (BrailleGetProfileLangTLA())
; Add computer Braille if it does not exist.
AddComputerBrailleEntryToListIfNeeded(modeListString)

count = stringSegmentCount(modeListString, "#")
; Remove the curProfileModeID line1 code from this list.
for loopIndex=1 to count
	modeInfo=stringSegment(modeListString, "#", loopIndex)
	; The ID is the first delimited value
	if curProfileModeID != stringToInt(stringSegment(modeInfo, "|", 1)) then
		filteredModeList = filteredModeList + stringSegment(modeInfo, "|", 2)
		filteredModeList = filteredModeList + "|"
		filteredItemCount=filteredItemCount+1
		if curLine2ModeID==stringToInt(stringSegment(modeInfo, "|", 1))
			indexToUse=filteredItemCount
		endIf
	endIf 
endFor
list=filteredModeList
modeData = modeListString 
return indexToUse
endFunction

void function SetSplitModeOptions(int splitMode)
var
int index,
int count,
int selection,
string list,
string key

if splitMode==brlSplitBufferedDocument then
	var 
	int setting=GetJCFOption(OPT_SPLIT_BUFFER_UNIT),
	int autoRebuffer=GetJCFOption(OPT_AUTO_REBUFFER),
	string rebufferOption,
	string rebufferKey
	key = hKey_BRAILLE_SPLIT_BUFFER_UNIT
	rebufferKey=hKey_BRAILLE_SPLIT_AUTO_REBUFFER

	if autoRebuffer then
		rebufferOption=formatString(cscSplitBufferedOptionsRebuffer, cmsgOn);
		setting=1; force to document
	else
		rebufferOption=formatString(cscSplitBufferedOptionsRebuffer, cmsgOff);
	endIf
	if autoRebuffer  then
		index=1
	else
		index=setting+1;
	endIf
	selection=DlgSelectItemInList (rebufferOption+cscSplitBufferedOptionsDlgList, cscSplitBufferedOptionsDlgTitle, false, index)
	if selection == 0 then
		return
	endIf
	; Rebuffer is now the first option.
	if selection == 1
		autoRebuffer =!autoRebuffer
		setting=1 ; force to document otherwise rebuffering may end up buffering an empty paragraph.
	else
		autoRebuffer =0; incompatible with paragraph or other options.
		setting = selection -2; settings is 0-based.
	endIf
	setJCFOption(OPT_AUTO_REBUFFER, autoRebuffer)
	writeSettingInteger (GetBrailleDisplaySectionName(), rebufferKey, autoRebuffer, FT_CURRENT_JCF)
	
	setJCFOption(OPT_SPLIT_BUFFER_UNIT,setting)
	writeSettingInteger (GetBrailleDisplaySectionName(), key, setting, FT_CURRENT_JCF)
	return
endIf

if splitMode==brlSplitTranslation then
	var
	string modeData,
	string selectedModeName,
	int loopIndex,
	int loopCount,
	string line2ModeID

	index=GetSplitTranslationLine2ListAndIndex(list, modeData)
	selection = DlgSelectItemInList (list, cscSplitTranslationOptionsDlgTitle, false, index)
	if selection==0 then
		return
	endIf
	; now figure out which mode was selected and write it out
	selectedModeName=StringSegment (list, "|", selection)
	loopCount = stringSegmentCount(modeData, "#")

	for loopIndex=1 to loopCount
		var string modeInfo=stringSegment(modeData, "#", loopIndex)
		if (selectedModeName == stringSegment(modeInfo, "|", 2)) then
		; the ModeID is param1.
			line2ModeID = stringSegment(modeInfo, "|", 1)
			; write it out.
			key=hKey_Braille_Multitranslation+BrailleGetProfileLangTLA()
			writeSettingString(GetBrailleDisplaySectionName(), key, line2ModeID, FT_CURRENT_JCF)
			SetSplitTranslationParameters()

			return;
		endIf
	endFor

	return
endIf
; If we get here, an option was chosen which has no configurable parameters.
MessageBox (cmsgNoOptionsForSplitMode)
endFunction

;This list is made up of four kinds of views:
;1. Line Mode Views (wrapped/cropped)
;2. Builtin split views.
;3. scripted app views.
;4. structured mode views.
;The current view in effect should be highlighted when the list is invoked.
script SetBrailleView()
var 
; variables for overall compiled list of views
string viewList, ; Master list compiled from Line Mode Views, builtin split views, structured views and scripted app views.
string viewIndexString, ; the string at that index in the compiled list of views.
int viewIndex, ; value returned from dlgSelectItemInList on which we ultimately operate. 
int defaultViewIndex, ; The index of the view which should be highlighted in the compiled list.
; builtin Line Mode views, wrapped, cropped
string lineModeViews,
int activeLineModeView, ;relative to builtin views,
int lineModeViewCount,
; Builtin Split Mode views
string splitModeViews,
int activeSplitModeView, ;relative to splitModeViews
int splitModeViewCount,
; Structured Mode views.
string structuredModeViews,
string structuredModeViewTitles, ; These are the localized view names shown to the user in the dialog, keep them separate for ease of finding the index later.
string structuredModeViewsWithDescriptions, ; keep them separate for ease of finding the index later.
int activeStructuredModeView,
int structuredModeViewCount,
; scripted app specific views
string scriptedAppViews,
int activeScriptedAppView,
int scriptedAppViewCount,
int selectedButton,
int croppedMode,
int currentSplitMode=BrailleGetSplitMode(),
int isStructuredMode = BrailleIsStructuredLine (),
int base,
int upperLimit,
handle windowAtCursor = GetCurrentWindow()

;Note! if the option which is chosen matches a mode which is selectable in settings center, i.e. one which can be made permanent, it needs to be written back to the MultilineView key of the JCF.
; If it is a temporary mode, it should be written back as -1.
; first items are builtin Line Mode views.

croppedMode=false
if IsVerticalAlignmentRelevant() then
	lineModeViews =cscBrailleViewWrapped+cscBrailleViewCropped
	croppedMode=GetJCFOption(OPT_BRL_CROPPED_MODE)
else
	lineModeViews =cscBrailleViewNoSplit
endIf
lineModeViewCount = StringSegmentCount (lineModeViews, "|")
if croppedMode then
	activeLineModeView=2
else
	activeLineModeView=1
endIf

; builtin Split Mode views
splitModeViews = cscBrailleSplitModeListBuf + cscBrailleSplitModeListAnn + cscBrailleSplitModeListAtt + cscBrailleSplitModeListSpc + cscBrailleSplitModeListTrn + cscBrailleSplitModeListJCr + cscBrailleSplitModeListWin
splitModeViewCount = StringSegmentCount (splitModeViews, "|")
activeSplitModeView=currentSplitMode

; Scripted app views
scriptedAppViews=GetScriptedAppViews() ; app specific scripts return this  delimited list.
if scriptedAppViews!=cscNull then
	scriptedAppViewCount=StringSegmentCount(scriptedAppViews, "|")
	activeScriptedAppView =GetScriptedAppViewIndex() ; overridden in a app's script file
endIf

; Then come structured mode views.
; These are JBS files.
structuredModeViews=GetStructuredModeViewsForCurrentApp()
structuredModeViewCount=StringSegmentCount(structuredModeViews, "|")
if structuredModeViewCount==1 then
	structuredModeViewCount=0; don't show it, it is only necessary if there is more than one to switch between.
	structuredModeViews=cscNull
EndIf

if structuredModeViews!=cscNull then
	activeStructuredModeView = StringSegmentIndex (StringUpper(structuredModeViews), "|", stringUpper(BrailleGetJBSFileName()), true)
	;Get any titles from the JBS files.
	;These are the localized names that will be shown to the user in the dialog
	structuredModeViewTitles = ReplaceViewNamesWithTitles(structuredModeViews, JAWS_DLG_LIST_SEPARATOR)
	; Append the structured mode view descriptions to the view titles.
	; Keep these lists separate to make it easier to find the selected view later.
	structuredModeViewsWithDescriptions=AddStructuredViewDescriptions(structuredModeViews, structuredModeViewTitles)
endIf

; Build the master list
AppendToList(viewList, lineModeViews)
AppendToList(viewList, splitModeViews)
AppendToList(viewList, scriptedAppViews)
AppendToList(viewList, structuredModeViewsWithDescriptions)

; Determine the default selection index
; First see if a scripted app specific view is in effect
; Because these may make use of other builtin views they need to be checked first.
if activeScriptedAppView > 0 then
	defaultViewIndex =activeScriptedAppView+splitModeViewCount + lineModeViewCount
; See if a Braille split mode is in effect, if so , use its index.
; Note we only want to check the views within the exposed range as there are other views used internally
elif activeSplitModeView > 0  && activeSplitModeView <= splitModeViewCount
	defaultViewIndex = activeSplitModeView+lineModeViewCount
elif croppedMode then
	defaultViewIndex = 2
	; See if there is more than one structured mode view and if so, if we're in structured mode, get the active view's index.
elif activeStructuredModeView > 0 && isStructuredMode then
	defaultViewIndex = activeStructuredModeView + lineModeViewCount + splitModeViewCount + scriptedAppViewCount
else
	defaultViewIndex = 1
endIf
;Turn off any split mode so that the SetBrailleView dialog is not shown in split mode
BrailleSplitMode(0)
viewIndex = DlgSelectItemInListWithDescription (viewList, cscSelectBrailleViewDLGTitle, false, defaultViewIndex, cscSetBrlViewButtons, selectedButton)

; Check Cancel
if selectedButton==0 then
	BrailleSplitMode(currentSplitMode) ; restore it.
	return
endIf

if selectedButton==1 then
	RevertToDefaultBrailleView()
	UpdateMultilineViewInJCF()
	BrailleSplitModeChangedEvent()
	return
endIf
if selectedButton==2 then
	SwapSplitData()
	; deliberate fall through
endIf

; Assume OK
; act upon the selected view choice
giInitialSplitModeValue=-1; reset.
BrailleClearSplitTranslationParams()

base=1
upperLimit=lineModeViewCount 

if viewIndex >= base && viewIndex <=upperLimit then
	if selectedButton==3 then
		SetSplitModeOptions(-1)
	endIf

	SetJCFOption(OPT_BRL_CROPPED_MODE, viewIndex-1 )
	UpdateMultilineViewInJCF()
; if No Split is chosen, cancel any Scripted app view.
	if viewIndex==base then
		RevertToDefaultBrailleView()
	EndIf 

	BrailleSplitModeChangedEvent()
	return
	endIf
	
base=upperLimit
upperLimit=upperLimit+splitModeViewCount

if viewIndex <= upperLimit then
	if selectedButton==3 then
		SetSplitModeOptions(viewIndex-base)
	endIf
	if (viewIndex-base == brlSplitWindow) then
		BrailleSetSplitModeToWindow (windowAtCursor)
	elif viewIndex-base==brlSplitTranslation then
		BrailleSplitMode(brlSplitTranslation)
		SetSplitTranslationParameters()
	else
		BrailleSplitMode(viewIndex-base)
	endIf

	UpdateMultilineViewInJCF()
	BrailleSplitModeChangedEvent()
	return
endIf

base=upperLimit
upperLimit=upperLimit+scriptedAppViewCount

if viewIndex <= upperLimit then
	if selectedButton==3 then
		SetSplitModeOptions(-1)
	endIf

; ask the app's scripts to execute the view.
	SwitchToScriptedAppView(viewIndex-base)
	UpdateMultilineViewInJCF()
	BrailleSplitModeChangedEvent()
	return
	endIf
	
base=upperLimit
upperLimit=upperLimit+structuredModeViewCount
	if selectedButton==3 then
		SetSplitModeOptions(-1)
	endIf

; its a structured mode view.
var 
int structuredModeViewIndex,
string structuredModeView
structuredModeViewIndex= viewIndex-base
structuredModeView = StringSegment (structuredModeViews, "|", structuredModeViewIndex)
;Write this to the transient session. 
WriteSettingString (GetBrailleDisplaySectionName(), "PreferredJBS", structuredModeView, FT_CURRENT_JCF, wdSession, GetActiveConfiguration (false)+".jcf")
BrailleSwitchToJBSFile(structuredModeView)
BrailleSplitMode(0) ; Turn off any other mode.
UpdateMultilineViewInJCF()
BrailleSplitModeChangedEvent()
endScript

int function ShouldPanMoveByLineAtEnd()
var
int splitMode=BrailleGetSplitMode()
return splitMode==brlSplitBrailleAndSpeech || splitMode==brlSplitTranslation || splitMode==brlSplitJAWSCursorLine
endFunction

script BrailleSplitPanRight()
var int lineIndex=BrailleGetCurrentLineIndex()
BrailleSetCurrentLineIndex(GetJCFOption(OPT_SPLIT_DATA_LINE_INDEX))
BraillePanRight(ShouldPanMoveByLineAtEnd())
BrailleSetCurrentLineIndex(lineIndex)
endScript

script BrailleSplitPanLeft()
var int lineIndex=BrailleGetCurrentLineIndex()
BrailleSetCurrentLineIndex(GetJCFOption(OPT_SPLIT_DATA_LINE_INDEX))
BraillePanLeft(ShouldPanMoveByLineAtEnd())
BrailleSetCurrentLineIndex(lineIndex)
endScript

script BrailleSplitNextLine()
var int lineIndex=BrailleGetCurrentLineIndex()
BrailleSetCurrentLineIndex(GetJCFOption(OPT_SPLIT_DATA_LINE_INDEX))
BrailleNextLine()
BrailleSetCurrentLineIndex(lineIndex)
endScript

script BrailleSplitPriorLine()
var int lineIndex=BrailleGetCurrentLineIndex()
BrailleSetCurrentLineIndex(GetJCFOption(OPT_SPLIT_DATA_LINE_INDEX))
BraillePriorLine()
BrailleSetCurrentLineIndex(lineIndex)
endScript

string function BrailleGetTextForSplitMode()
; This function is called by internal code when Buffered Split Mode is enabled.
; If it returns a non-empty string, it will be used for the split data.
; If it returns an empty string, internal code will gather the document at the PCCursor.
; It should ideally be overridden in an aplication specific script file.
return ""
endFunction

int function BrailleGetTextCursorOffsetForSplitMode()
; This function should return the 0-based cursor offset in the text returned by the above function. 
; It allows the buffered text cursor position to be set at the time of buffering.
return 0
endFunction

void function BrailleSplitModeChangedEvent()
; override this in an app specific script set to save off the current value for that app so it can be restored when the app regains focus.
endFunction

int function AppAllowedToChangeSplitMode()
; if brlSplitBufferedDocument no  one but the user should change it.
return giInitialSplitModeValue!=brlSplitBufferedDocument
endFunction

void function SetSplitTranslationParameters()
; Maybe called from anywhere.
var
string key
BrailleSetTranslationParamsForLine(1, BrailleGetProfileContractedModeID(), cscNull)
key=hKey_Braille_Multitranslation+BrailleGetProfileLangTLA()
var int line2modeID=			ReadSettingInteger(GetBrailleDisplaySectionName(), key, 0, FT_CURRENT_JCF)
BrailleSetTranslationParamsForLine(2, line2modeID, cscNull)
endFunction

void function HandleMultilineTableZoomOptions(int entering)
if GIBrlTBLZoom!=ZOOM_TO_CUR_ROW_AND_COLTITLES && GIBrlTBLZoom!=ZOOM_TO_CUR_AND_PRIOR_ROW then
	return
endIf
if !IsVerticalAlignmentRelevant() then 
	return 
endIf
BrailleSetVerticalAlignment(entering, "|") ; default type is auto
	endFunction

void function brailleCrossedTableBoundaryEvent(int entering)
HandleMultilineTableZoomOptions(entering)
endFunction

void function BrailleCurRow(optional int iCol,int iRow)
var
	string sCurRowText,
	string sCoords,
	int iColCount=GetCurrentRowColumnCount()

if iCol > 1 then
	let sCurRowText= GetRowText(cmsgTableCellTextSeparator,cScNull,cMsgBrlBlankCell,1,iCol-1)
	if stringRight(sCurRowText,stringLength(cmsgTableCellTextSeparator )) != cmsgTableCellTextSeparator then
		sCurRowText = sCurRowText + cmsgTableCellTextSeparator
	endIf
	BrailleAddString(sCurRowText, 0,0,0)
endIf

If GIBrlShowCoords then
	let sCoords = FormatString(cmsgRowCoordinate,iRow)
	let sCoords= sCoords+FormatString(cmsgColumnCoordinate,iCol)
	brailleAddString(sCoords,0,0,0)
EndIf

BrailleAddFocusCell()

if iCol < iColCount
	let sCurRowText= cmsgTablePostFocusCellTextSeparator
		+GetRowText (cmsgTableCellTextSeparator,cScNull,cMsgBrlBlankCell,iCol+1,iColCount)
	BrailleAddString(sCurRowText,0,0,0)
EndIf
endFunction

void function BrailleRowWithColTitles(optional int iCol,int iRow)
var
	string colTitles,
	int iColCount=GetCurrentRowColumnCount()

SaveCursor()
BrailleCursor()
if iRow == 1 then
	BrailleCurrAndNextRow(iCol,iRow)
		return
endIf

let colTitles= GetRowColTitles(cmsgTableCellTextSeparator,cScNull,cMsgBrlBlankCell, 1, iColCount)
BrailleSetLineIndexForNextAddString(1)
BrailleAddString(colTitles, 0, 0, 0)
BrailleSetLineIndexForNextAddString(2)
BrailleCurRow(iCol,iRow)
RestoreCursor()
endFunction

void function BraillePriorAndCurRow(int iCol,int iRow)
if iRow == 1 then
	BrailleCurrAndNextRow(iCol,iRow)
		return
endIf

var
	string sPriorRowText,
	int iColCount=GetCurrentRowColumnCount()

SaveCursor()
BrailleCursor()
BrailleSetLineIndexForNextAddString(1)
let sPriorRowText = GetPriorRowText(cmsgTableCellTextSeparator,cScNull,cMsgBrlBlankCell, 1, iColCount)
BrailleAddString(sPriorRowText, 0, 0, 0)
BrailleSetLineIndexForNextAddString(2)
BrailleCurRow(iCol,iRow)
RestoreCursor()
endFunction

void function BrailleCurrAndNextRow(int iCol,int iRow)
var
	string sNextRowText,
	int iColCount=GetCurrentRowColumnCount()

SaveCursor()
BrailleCursor()
BrailleSetLineIndexForNextAddString(1)
BrailleCurRow(iCol,iRow)
BrailleSetLineIndexForNextAddString(2)
let sNextRowText= GetNextRowText(cmsgTableCellTextSeparator,cScNull,cMsgBrlBlankCell, 1, iColCount)
BrailleAddString(sNextRowText, 0, 0, 0)
RestoreCursor()
endFunction

script toggleBufferedTextMode()
if BrailleGetSplitMode()==brlSplitBufferedDocument then
	BrailleSplitMode(brlSplitOff)
else
	BrailleSplitMode(brlSplitBufferedDocument)
endIf
endScript

void function BrailleProfileLoadedEvent(string name)
if BrailleGetSplitMode()==brlSplitTranslation then
	SetSplitTranslationParameters()
endIf
endFunction

void function HandleSplitBrailleCommandPrompt(handle hwndFocus, handle hwndPrevFocus)
If IsCommandPrompt() then
	if giBrlSplitCommandPromptHistory then
		BrailleSplitMode(brlSplitCommandPromptAndHistory)
		endIf
elif BrailleGetSplitMode()==brlSplitCommandPromptAndHistory then
		BrailleSplitMode(brlSplitOff)
endIf
endFunction

void function ToggleSplitBufferedRefreshOnEnter()
var
int autoRebuffer=GetJCFOption(OPT_AUTO_REBUFFER),
string rebufferOptionL,
string rebufferOptionS
if BrailleGetSplitMode()!=brlSplitBufferedDocument then
	sayMessage(OT_JAWS_MESSAGE, cmsgBrailleSplitBufferError)
	return
endIf

autoRebuffer =!autoRebuffer
if autoRebuffer then
		rebufferOptionL =formatString(cmsgRebufferOnEnterToggle, cmsgOn);
		rebufferOptionS=cmsgOn
		else
		rebufferOptionL=formatString(cmsgRebufferOnEnterToggle, cmsgOff);
		rebufferOptionS=cmsgOff
	endIf
SayMessage(OT_JAWS_MESSAGE, rebufferOptionL, rebufferOptionS)
SetJCFOption(OPT_AUTO_REBUFFER, autoRebuffer)
endFunction