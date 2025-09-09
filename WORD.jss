; Copyright 1995-2024 Freedom Scientific, Inc.
; Script file for Microsoft Word versions 2016 and O365.

include "HJConst.jsh"
include "MSAAConst.jsh"
include "winstyles.jsh"
include "HJGlobal.jsh"
include "UIA.jsh"
include "hjHelp.jsh"
include "Common.jsm"
include "office.jsh"
include "msOffice.jsm"
include "Word.jsh"
include "word.jsm"

import "wordsettings.jsd"
import "say.jsd" ; for FormatOutputMessage, ensure Script Manager will compile.
import "UIA.jsd"
import "touch.jsd"

use "office.jsb"
use "WordQuickNav.jsb"
use "wordFunc.jsb"
use "WordSettings.jsb"
use "wordBrl.jsb"

;Shared globals:
globals
	int LastUIATextChangeTime,  ;shared with Office.jss -> WindowCreatedEvent.
	string globalAutocorrectSound  ;from Default for Autocorrect sound
;Objects:
globals
; for spellcheck with split buttons,
; store the default or first suggestion so enter key can quickly press it:
	object oSuggestionSplitButton

;Collections:
globals
collection c_WordFocus,
	; c_WordFocus caches things commonly tested for the focus window.
	; It cannot be used for tests applicable to document content,
	; since that can change without any focus change.
	;
	; Members are:
	; string WindowClass -- Result of getWindowClass for focus.
	; string RealWindowName -- Result of GetWindowName for real window of focus.
	; string RealWindowClass -- Result of GetWindowClass for real window of focus.
	; string HeaderForNewAddressListField -- Result of GetHeaderForNewAddressListField function call.
	; int ObjectSubType -- Result of getObjectSubtypeCode at level 0.
	; int WindowSubtype -- Result of GetWindowSubtypeCode of focus.
	; int windowCategory -- Result of getWindowCategory function call.
	; int IsWordDocumentActive -- Result of IsWordDocumentActiveTest function call.
	; int OutlookIsActive = Result of OutlookIsActiveTest function call.
	; int InMicrosoftEditorProofingPaneIssueChecker -- Result of InMicrosoftEditorProofingPaneIssueChecker function call.
	; int InProofingPaneSpellCheckWithSplitButtons -- Result of InProofingPaneSpellCheckWithSplitButtons function call.
	; int InProofingPaneSpellCheck -- Result of InProofingPaneSpellCheck function call.
	; int IsReadOnlyMessage -- Result of IsReadOnlyMessage function call.
	; int IsReadOnlyVirtualMessage -- Result of calculating IsVirtualPCCursor and IsReadOnlyMessage function calls.
	; int IsStatusBarToolBar -- Result of IsStatusBarToolBarTest function call.
	collection c_WordTester
	; For variables which are set or cleared under certain conditions and tested elsewhere when something happens.
	;
	; Members are:
	; int FocusChangedOnSelectATable
	; int WasOfficeSplashScreen
	; int WasTaskPaneDialog
	; int NextIsAccentedChar
	; int PrevFocusWasLevelZeroChangeListBoxItem
	; int PressEnterCausedNewListItem -- For reading list items as user presses enter to navigate.
	; int PressTabOrShiftTabCausedNewListItem ; same as enter but for tab and shift tab.
	; int SupportsMAGicOptions
	; int WindowStateToggledByScript
	; string globalTaskOrProofingPaneGroupName -- For speaking when the parent of focus is a group, and it changes.
	; int SelectionRectChangedEventID -- The schedule ID for RunSelectionContextEvents.
	; int ProcessMainDocumentWindowTimerID -- The schedule ID for ProcessMainDocumentWindowWrapper.
	; int AnnounceNoOpenDocumentTimerID -- The schedule ID for AnnounceNoOpenDocument.
	; handle c_WordTester.hWndPrevFocus --
	;		Because global focus and global prev focus variables are not reliably updated when focus change moves to a menu,
	;		relying on these globals to suppress double announcement of the document edit
	;		causes the focus change from the menus to the document not to speak sometimes.
	;		This is an added variable that is set in FocusChangedEventEx to allow for testing of the actual prev focus window.
	; int WordContextMenuActive


void function WordInit()
WordQuickNavInit()
WordFuncInit()
WordSettingsInit()
WordBrlInit()
EndFunction

void function AutoStartEvent()
InitNewWordCollections()
;Call init functions for dependent Word-specific modules:
WordInit()
; turn on options dialog support:
c_WordTester.SupportsMAGicOptions = TRUE
initializeSettings()
EndFunction

void function AutoFinishEvent()
c_WordTester.SupportsMAGicOptions = FALSE ; prevent unnecessary running of adjustMAGicOptions
ClearAllCollectionsAndTimers()
c_WordTester.TaskOrProofingPaneGroupName = cscNull
SetTypingEchoLanguage() ; reset in case it was changed for language detection
EndFunction

void function InitNewWordCollections()
if !c_WordFocus c_WordFocus = new collection endIf
if !c_WordTester c_WordTester = new collection endIf
EndFunction

void function ClearAllCollectionsAndTimers()
collectionRemoveAll(c_WordFocus)
CollectionRemoveAll(c_WordTester)
ClearProcessMainDocumentWindowTimer()
ClearAnnounceNoOpenDocumentTimer()
EndFunction

void function ClearProcessMainDocumentWindowTimer()
if c_WordTester.ProcessMainDocumentWindowTimerID
	unscheduleFunction(c_WordTester.ProcessMainDocumentWindowTimerID)
	c_WordTester.ProcessMainDocumentWindowTimerID = 0
endIf
EndFunction

void function ClearAnnounceNoOpenDocumentTimer()
if c_WordTester.AnnounceNoOpenDocumentTimerID
	unscheduleFunction(c_WordTester.AnnounceNoOpenDocumentTimerID)
	c_WordTester.AnnounceNoOpenDocumentTimerID = 0
endIf
EndFunction

void function NullSuggestionSplitButton()
oSuggestionSplitButton = null()
EndFunction

void function UpdateWordFocus(handle hWnd)
var	handle realWindow = GetRealWindow(hWnd)
c_WordFocus.WindowClass = getWindowClass(hWnd)
c_WordFocus.RealWindowName = GetWindowName(RealWindow)
c_WordFocus.RealWindowClass = GetWindowClass(RealWindow)
c_WordFocus.WindowSubtype = getWindowSubtypeCode(hWnd)
c_WordFocus.ObjectSubType = getObjectSubtypeCode()
c_WordFocus.windowCategory = getWindowCategory(hWnd)
c_WordFocus.IsWordDocumentActive = IsWordDocumentActiveTest()
c_WordFocus.OutlookIsActive = OutlookIsActiveTest()
c_WordFocus.IsStatusBarToolBar = IsStatusBarToolBarTest(hWnd)
;Must test the proofing pane in this order, since InProofingPaneSpellCheck depends on InProofingPaneSpellCheckWithSplitButtons:
c_WordFocus.InMicrosoftEditorProofingPaneIssueChecker = InMicrosoftEditorProofingPaneIssueChecker()
c_WordFocus.InProofingPaneSpellCheckWithSplitButtons = InProofingPaneSpellCheckWithSplitButtons()
c_WordFocus.InProofingPaneSpellCheck = InProofingPaneSpellCheck()
c_WordFocus.IsReadOnlyMessage = IsReadOnlyMessage()
if c_WordFocus.IsReadOnlyMessage
	c_WordFocus.IsReadOnlyVirtualMessage = IsVirtualPCCursor()
else
	c_WordFocus.IsReadOnlyVirtualMessage = false
endIf
if c_WordFocus.RealWindowName == wn_NewAddressList
&& c_WordFocus.WindowSubType == wt_edit
	c_WordFocus.HeaderForNewAddressListField = GetHeaderForNewAddressListField ()
else
	c_WordFocus.HeaderForNewAddressListField = cscNull
endIf
EndFunction

int function FindWindowCategoryType(handle hwnd)
if IsStandardUnknownWindowCategoryType(hwnd)
	giWndCategoryType = WCAT_UNKNOWN
	return giWndCategoryType
endIf
var
	string sRealName,
	string sClass
sClass = GetWindowclass(hWnd)
if stringCompare(sClass, cwc_Word_Document2) == 0
|| stringCompare(sClass, cwc_Word_Document) == 0
	if stringContains(GetWindowClass(GetParent(hWnd)), "bosa_sdm_")
		sRealName = getWindowName(getRealWindow(hWnd))
		if stringContains(sRealName, wn_spellingAndGrammar)
		|| stringContains(sRealName, wn_spelling)
			giWndCategoryType = WCAT_SPELL_CHECKER
			return giWndCategoryType
		else
			giWndCategoryType = wCat_Unknown
			return giWndCategoryType
		endIf
	endIf
	giWndCategoryType = WCAT_DOCUMENT
	RETURN giWndCategoryType
endIf
if c_WordFocus.WindowClass == cwc_NetUIHwnd
	return FindWindowCategoryType(hWnd)
endIf
sRealName = getWindowName(getRealWindow(hWnd))
if stringContains(sRealName, wn_spellingAndGrammar)
|| stringContains(sRealName, wn_spelling)
	giWndCategoryType = WCAT_SPELL_CHECKER
	return giWndCategoryType
endIf
if sClass == cwc_RichEdit20W
&& getWindowSubtypeCode(getParent(hWnd)) == WT_LISTVIEW
	;Mailing dialogs need to respond to activeItemChangedEvent:
	giWndCategoryType = WCAT_UNKNOWN
	return giWndCategoryType
endIf
return FindWindowCategoryType(hwnd)
endFunction

int function OnEditFieldWithSuggestion()
if c_WordFocus.WindowClass != cwc_NetUIHwnd
	return false
endIf
if !oSuggestionSplitButton
|| oSuggestionSplitButton.isOffScreen
|| !oSuggestionSplitButton.GetInvokePattern()
	;The suggestion split button is not available:
	return false
endIf
if getObjectTypeCode(TRUE) != WT_EDIT
	;Not on any kind of edit field--read-only, multiline or single-line:
	return false
endIf
return true
EndFunction

void function ReturnToDocumentFromEmbeddedSpreadsheet()
WordInit()
initializeSettings()
SayFocusedWindow()
endFunction

void Function Unknown (string TheName, int IsScript, optional int IsDueToRecursion)
if IsDueToRecursion
	;recursive calls may happen if a function is running,
	;and the Word event fires and calls the function that is already running.
	;Note, however, that any test of a function which fails to run will evaluate as false.
	return
endIf
TheName = StringLower (TheName)
; CaretMovedEvent throws when in comment pane and deleting first character.
if stringContains (TheName, "caretmovedevent") return endIf
Unknown (TheName, IsScript, IsDueToRecursion)
EndFunction

void function UIANotificationEvent(int notificationKind, int notificationProcessing, string displayString, string activityId, string appName)
if ActivityID == "AccSN2" || activityID == "AccSN3"
	; ControlDelete and ControlBackspace are sending fake notifications
	;which clutter when we're reading the actual words that got deleted.
	var string scriptName = GetScriptAssignedTo(GetCurrentScriptKeyName())
	if scriptName == "DeleteWord" || scriptName == "ControlBackspace"
		return
	endIf
endIf
return UIANotificationEvent(notificationKind, notificationProcessing, displayString, activityId, appName)
endFunction

void function UIATextEditTextChangedEvent(int changeType, string text)
if changeType!=TextEditChangeType_AutoCorrect
	return
endIf
LastUIATextChangeTime = getTickCount()
var string line = GetLine()
if line==cscNull || line==cscSpace
	sayMessage(OT_SCREEN_MESSAGE, text)
elif getJCFOption(OPT_INDICATE_MISTYPED_WORD)
&& !stringIsBlank(text)
	; autocorrection while typing.
	if GetCharacterValue(stringLeft(text, 1)) <= 8
		; keep ugly nonprintable character from showing up on Braille display.
		; sometimes, the leading character is one of the lower control characters like ^d.
		text = stringChopLeft(text, 1)
	endIf
	if stringLength(text) == 1
	&& IsAutoCorrectExceptionCharacter(getCharacterValue(text))
		; the standard quotes and apostrophes are being turned into Unicode left and right quotes and single quotes.
		return
	endIf
	if (c_WordTester.PressEnterCausedNewListItem
	|| c_WordTester.PressTabOrShiftTabCausedNewListItem)
	&& InList()
		if ! c_WordTester.PressTabOrShiftTabCausedNewListItem then
		; Speak text from here after user pressed enter in a numbered list.
		; however tab or shift tab would make it speak twice which we don't want.
			say(text, OT_LINE)
		endIf
		c_WordTester.PressEnterCausedNewListItem = FALSE
		c_WordTester.PressTabOrShiftTabCausedNewListItem = FALSE
		return
	endIf
	text = stringTrimLeadingBlanks(text)
	var string message = formatString(msgAutocorrect, text)
	PlaySound(GetSoundFileLocation(globalAutocorrectSound))
	sayMessage(OT_SCREEN_MESSAGE, message)
	; don't spell strings that are artificially supplied such as "bullet", "list item", etc:
	if stringContains(line, text)
		spellString(text)
	endIf
endIf
endFunction

string function getPositionInGroupFromUIAElement(object element)
if ! element return endIf
var
	int index,
	string size,
	string positionInfo
size = element.sizeOfSet
if !size return endIf
index = element.positionInSet
; account for out of bounds UIA where something's wrong:
if !index || index > size return endIf
positionInfo = formatString(cmsgPosInGroup1, index, size)
return positionInfo
endFunction

void Function ItemNotFoundEvent(int hwnd)
; event indicating that the requested item can't be found.
if WindowCategoryIsWordDocument()
	return
else
	beep()
endIf
EndFunction

void function SelectionRectChangedEvent(int newLeft, int newTop, int newRight, int newBottom, int oldLeft, int oldTop, int oldRight, int oldBottom, int navUnit)
if c_WordTester.SelectionRectChangedEventID
	UnscheduleFunction(c_WordTester.SelectionRectChangedEventID)
	c_WordTester.SelectionRectChangedEventID = 0;
endIf
SelectionRectChangedEvent(newLeft,  newTop, newRight, newBottom, oldLeft, oldTop, oldRight, oldBottom, navUnit)
endFunction

int function IsWordDocumentActiveTest()
if c_WordFocus.ObjectSubType == WT_DOCUMENT
|| GetObjectRole () == ROLE_SYSTEM_DOCUMENT
	return true
endIf
if !StringContainsCaseInsensitive (getWindowOwner(GetFocus()),WordAppDocumentArea)
	return false
endIf
var
	int iAncestorCount = GetAncestorCount (),
	int i
For i = 0 to iAncestorCount
	if GetObjectAutomationId (i) == "Body"
		return true
	elIf GetObjectSubTypeCode (SOURCE_CACHED_DATA, i) == WT_DOCUMENT
		return false
	endIf
EndFor
return false
endFunction

int function IsWordDocumentActive()
return c_WordFocus.IsWordDocumentActive == true
EndFunction

int function OutlookIsActive()
return c_WordFocus.OutlookIsActive == true
endFunction

int function WindowCategoryIsWordDocument()
return c_WordFocus.windowCategory == wCat_document
EndFunction

int function IsStatusBarToolBar()
return c_WordFocus.IsStatusBarToolBar == true
EndFunction

int function IsRibbonEditComboDroppedDown()
var	handle hWnd = GetFirstWindow(GetTopLevelWindow(GetFocus()))
return GetWindowClass(hwnd) == wc_NetUIToolWindow
	&& GetParent(hWnd) == GetAppMainWindow(GetFocus())
	&& (GetWindowStyleBits(hWnd) &(WS_POPUP | WS_VISIBLE) == WS_POPUP | WS_VISIBLE)
	&& GetWindowClass(GetFirstChild(hWnd)) == cwc_NetUIHwnd
EndFunction

int function InTaskPaneDialog()
return c_WordFocus.windowCategory == WCAT_TASK_PANE
EndFunction

int function InbosaSDMMso96Dialog()
return c_WordFocus.RealWindowClass == wc_bosa_sdm_Mso96
EndFunction

int Function IsNavPaneVisible(handle hwnd)
;for 2010 Find and Replace when it is invoked by user and remains open
;even after returning to document,
;or when user checks Navigation pane from the View ribbon.
return isWindowVisible(
	FindWindow(getAppMainWindow(hwnd),cwcMsoCmd,wn_2010WordNavigationPane))
EndFunction

int function IsTextReadingAppropriateForCurrentElement()
;For the touch cursor.
; Insure that document areas of versions of Word earlier than 2013 are detected:
var object element = TouchCursorObject()
return (element.controlType == UIA_PaneControlTypeID && element.className == wc_wwg)
	|| IsTextReadingAppropriateForCurrentElement()
EndFunction

int function InMicrosoftEditorProofingPaneIssueChecker()
;Note, this function only returns true when actively reviewing issues.
;It returns false if in the Microsoft Editor pane but only in the overview.
if InbosaSDMMso96Dialog() return false endIf
if GetObjectName(false, 3) != wn_Editor
&& GetObjectName(false, 4) != wn_Editor
	;Not in Microsoft Editor pane.
	return false
endIf
var object oPane = FSUIAGetParentOfElement (FSUIAGetFocusedElement ())
if oPane.controlType != UIA_PaneControlTypeID
	;Some controls are children of the pane element.
	;Others are grandchildren.
	;Get the parent and check again.
	oPane = FSUIAGetParentOfElement (oPane)
endIf
if oPane.controlType != UIA_PaneControlTypeID
	;Not in Microsoft Editor pane.
	return false
endIf
var object oCondition = FSUIACreateStringPropertyCondition (UIA_AutomationIDPropertyID, "DrillInPane_Title")
if oPane.findFirst(TreeScope_Children, oCondition)
	;In Microsoft Editor pane actively reviewing issues.
	return true
endIf
return false;May be in Microsoft Editor pane, but not reviewing issues
EndFunction

int function InProofingPaneSpellCheckWithSplitButtons()
if c_WordFocus.InMicrosoftEditorProofingPaneIssueChecker return TRUE endIf
if InbosaSDMMso96Dialog() return false endIf
if GetObjectName(false,2) != wn_Editor
	return false
endIf
var string name = GetObjectName(false,1)
if stringContains(name, wn_Proofing_Pane_Grammar)
|| stringContains(name, wn_Proofing_Pane_Spelling) then
	return true
endIf
var
	object oUIA = CreateObjectEx("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" ),
	object treewalker = CreateUIARawViewTreeWalker(TRUE),
	object oGroupTypeCondition = oUIA.createIntPropertyCondition(UIA_ControlTypePropertyId, UIA_GroupControlTypeId),
	object oGroupElements,
	object oGroup
if !treewalker
|| !oGroupTypeCondition
	return FALSE
endIf
treeWalker.currentElement = FSUIAGetFocusedElement()
while treewalker.currentElement.controlType != UIA_PaneControlTypeId
&& treewalker.currentElement.controlType != UIA_CustomControlTypeId
&& UIAGetParent (treewalker.currentElement)
	treewalker.gotoParent()
endWhile
oGroupElements = treewalker.currentElement.findAll(TreeScope_Descendants, oGroupTypeCondition)
if GetGroupWithSpellingOrGrammarName(oGroupElements)
	return true
endIF
return FALSE
endFunction

int function InProofingPaneSpellCheck()
if c_WordFocus.InProofingPaneSpellCheckWithSplitButtons return TRUE endIf
var string sName = GetObjectNameUnfiltered(1)
If StringIsBlank(sName)
|| sName == suggestionsListboxPrompt
	; may be in a list of suggestions...
	sName = GetObjectNameUnfiltered(2)
EndIf
If StringIsBlank(sName)	; may be in a list of languages...
	sName = GetObjectNameUnfiltered(5)
EndIf
; the name can contain a lot more text, so we need to use starts-with instead.
return StringStartsWith(sName, wn_Proofing_Pane_Spelling)
	|| StringStartsWith(sName, wn_Proofing_Pane_Grammar)
endFunction

int function ReadProofingPaneWithSplitButtons()
var
	object UIA,
	object element,
	object currentSentenceTextField,
	object spellingError,
	object treewalker,
	string tmp,
	string Message;
UIA = CreateObjectEx("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !UIA return FALSE endIf
element = GetUIAFocusElement(UIA)
treewalker = UIA.CreateTreeWalker(UIA.CreateRawViewCondition())
if !element || !treewalker return FALSE endIf
if element.controlType == UIA_SplitButtonControlTypeId
	oSuggestionSplitButton = element
endIf
treewalker.currentElement = element
var
	object oGroupTypeCondition = UIA.createIntPropertyCondition(UIA_ControlTypePropertyId, UIA_GroupControlTypeId),
	object oGroupElements
while (treewalker.currentElement.controlType != UIA_PaneControlTypeId
|| treewalker.currentElement.controlType != UIA_CustomControlTypeId)
&& UIAGetParent (treewalker.currentElement)
	treewalker.gotoParent()
endWhile
oGroupElements = treewalker.currentElement.findAll(TreeScope_Descendants, oGroupTypeCondition)
treewalker.currentElement = GetGroupWithSpellingOrGrammarName(oGroupElements)
; If the control group contains a read-only text field,
; it's the new method using split buttons
var
	object controlTypeCondition,
	object isValuePatternAvailable,
	object isReadOnly,
	object condition
controlTypeCondition = UIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_EditControlTypeId)
isValuePatternAvailable = UIA.CreateBoolPropertyCondition( UIA_IsValuePatternAvailablePropertyId, UIATrue)
isReadOnly = UIA.CreateBoolPropertyCondition( UIA_ValueIsReadOnlyPropertyId, UIATrue)
condition = UIA.CreateAndCondition(controlTypeCondition, isValuePatternAvailable)
condition = UIA.CreateAndCondition(condition, isReadOnly)
currentSentenceTextField = treewalker.currentElement.FindFirst(TREESCOPE_SUBTREE, condition)
if !currentSentenceTextField return FALSE endIf
; group name contains prompt, text and spelling of text.
; Not necessarily in that order.
spellingError = treewalker.currentElement
condition = UIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_SplitButtonControlTypeId)
while treeWalker.GoToNextSibling()
	if treewalker.currentElement.controlType != UIA_GroupControlTypeId
	&& treewalker.currentElement.controlType != UIA_ScrollBarControlTypeId
		return FALSE
	endIf
	; Split buttons are suggestions:
	if !oSuggestionSplitButton
		oSuggestionSplitButton = treewalker.currentElement.FindFirst(TREESCOPE_SUBTREE, condition)
	endIf
endWhile
treewalker.currentElement = element
Message = spellingError.name
; since we now keep track of active group name, speaking only when it changes:
c_WordTester.TaskOrProofingPaneGroupName = Message
sayMessage(OT_LINE, spellingError.name)
if oSuggestionSplitButton
	treewalker.currentElement = oSuggestionSplitButton
	treewalker.gotoParent
	tmp = treewalker.currentElement.name
	if !stringIsBlank(tmp)
		Message = Message+cscSpace+tmp
		sayMessage(OT_CONTROL_NAME, tmp)
	endIf
	treewalker.currentElement = oSuggestionSplitButton
	tmp = oSuggestionSplitButton.name
	if !stringIsBlank(tmp)
		if stringSegmentCount(tmp, ",")
			; separate out the first segment, as the name contains more than just the suggestion:
			tmp = stringSegment(tmp, ",", 1)
		endIf
		Message = Message + cscSpace + tmp
		sayMessage(OT_LINE, tmp)
		spellString(tmp)
	endIf
else
	; no split buttons available, no suggestion
	Message = message + cscSpace + msgNoSpellingSuggestions1_L
	sayMessage(OT_ERROR, msgNoSpellingSuggestions1_L)
endIf
BrailleMessage(Message)
return TRUE
endFunction

object Function GetGroupWithSpellingOrGrammarName (object oGroupArray)
var
	object oGroup

ForEach oGroup in oGroupArray
	if stringContains(oGroup.name, wn_Proofing_Pane_Grammar)
	|| stringContains(oGroup.name, wn_Proofing_Pane_Spelling) then
		return oGroup
	endIf
EndForEach
return Null()
EndFunction

int function IsWordContextMenuActive()
return c_WordTester.WordContextMenuActive == true
EndFunction

int function CheckForUnsupportedDocumentView()
var	string sViewName
if !IsNormalOrDraftView()
	sViewName = GetActiveDocumentViewName()
	SayFormattedMessage(ot_screen_message,
		FormatString(msgDocumentView_l,sViewName),
		FormatString(msgDocumentView_s,sViewName))
	If IsReadingViewActive()
		SayFormattedMessage(ot_smart_help,msgReadingLayout)
		if BrailleInUse()
			BrailleRefresh()
		EndIf
		return true
	EndIf
endIf
return false
EndFunction

void function SetNewLineIndicationMode()
var
	int iMode,
	int iNewMode,
	int bShow
iMode = NewLinesAndParagraphsIndication()
if GetActiveDocumentViewName() == msgWeb
	if iMode != wdVerbosityOff
		SetNewLinesAndParagraphsIndication(wdVerbosityOff)
	endIf
	return
EndIf
;Only manipulate the setting if it is possible that
;the user changed display options in Word:
if GlobalWasHjDialog
|| getAppMainWindow(GetFocus()) != globalPrevApp
	return
endIf
iNewMode = iMode
bShow = (isShowParagraphs() || isShowAll())
if bShow
	If iMode == wdVerbosityOff
		iNewMode=IndicateWhenReading
	endIf
else
	iNewMode = wdVerbosityOff
endIf
if iMode != iNewMode
	SetNewLinesAndParagraphsIndication(iNewMode)
endIf
EndFunction

string function GetWordCountDlgStaticText(handle focusWindow)
if c_WordFocus.RealWindowName != wn_WordCountDialog
|| !StringStartsWith(c_WordFocus.WindowClass, "bosa_sdm_")
|| GetJCFOption(OPT_USE_SDM_API) == 0
	return cscNull
endIf
var object element = FSUIAGetElementFromHandle(focusWindow)
if !element return cscNull endIf
var object textElements = element.findAll(TREESCOPE_SUBTREE,FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_TextControlTypeId))
if !textElements || !textElements.count return cscNull endIf
var int i, string text
for i=0 to textElements.count-1
	if !stringIsBlank(text) text=text+cscBufferNewLine endIf
	text=formatString(text+"%1", textElements(i).name) ; since can't concatenate data members direct into a string literal
endFor
return text
endFunction

int Function PreProcessKeyPressedEvent(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
var	int bStopProcessing = PreProcessKeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
if !bStopProcessing
	if QuickNavKeyTrapping()
		if QuickNavTrappedKeyProcessed(nKey,strKeyName,nIsScriptKey)
			return true
		EndIf
	EndIf
	if !UserBufferIsActive()
		; process accented characters:
		if nKey == kiAltCtrlQuestion
		|| nKey == kiAltCtrlExclaim
			SayAccentedCharacter()
			return true
		elif c_WordTester.NextIsAccentedChar
			c_WordTester.NextIsAccentedChar = false
			ScheduleFunction("SayAccentedCharacter", 1)
			return true
		else
			if nKey == kiCtrlApostrophe
			|| nKey == kiCtrlGrave
			|| nKey == kiCtrlTilde
			|| nKey == kiCtrlCaret
			|| nKey == kiCtrlColon
			|| nKey == kiCtrlAt
			|| nKey == kiCtrlAnd
			|| nKey == kiCtrlComma
			|| nKey == kiCtrlSlash
				c_WordTester.NextIsAccentedChar = true
				return true
			endIf
		endIf
	EndIf
EndIf
return bStopProcessing
EndFunction

int function NewTextEventShouldBeSilent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
If InRibbons()	; suppress non-focused controls announcement.
	Return TRUE
EndIf
var string class = GetWindowClass(hWnd)
if class == wc_bosa_sdm_Mso96
&& c_WordFocus.windowCategory== WCAT_SPELL_CHECKER
	return true
endIf
if hWnd == hFocus
	if class == wc_ReComboBox20W
		return false
	endIf
else
	if class == wc_OOCWindow
	&& GetParent(hWnd) == hFocus
		return true
	EndIf
EndIf
return NewTextEventShouldBeSilent(hFocus, hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
EndFunction

void Function ProcessSpeechOnNewTextEvent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
if hWnd == getFocus()
&& GetWindowClass(hwnd) == wc_ReComboBox20W
	Say(buffer,ot_line)
	return
EndIf
ProcessSpeechOnNewTextEvent(hFocus, hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
EndFunction

void function sayHighlightedText(handle hwnd, string buffer)
if WindowCategoryIsWordDocument()
	var int screenEcho = GetScreenEcho()
	if screenEcho > 0
	&& GetLastMouseMovementTime() >= GetLastKeyPressTime()
	&& !IsVirtualPCCursor()
		; This code block fixes bug 50538(Running both JAWS and MAGic together - click on a
		; word to select it is not saying the selected word in multiple apps).
		; This code block gets called when text is selected using the mouse and focus is in the
		; main document window in Microsoft Word.  Note there are three common scenarios for
		; selecting text with the mouse.  The first is to double click the left mouse button on
		; a word.  This causes the word that was double clicked to become selected.  In this
		; case the last mouse movement time will be greater than the last key press time.  The
		; second method of selecting text with the mouse is to position the caret at one end of
		; the region that you wish to select, hold down the shift key, and click the left mouse
		; button once at the other end of the region that you wish to select.  In this case the
		; last mouse movement time will often be the same as the last key press time(unless you
		; pause for a full millisecond after pressing the shift key before pressing the left
		; mouse button).  The third method of selecting text with the mouse is to click with the
		; left mouse button at one end of the region that you wish to select, hold down the
		; mouse button, drag the mouse to the other end of the region that you wish to select,
		; and then release the left mouse button.
		; This code block causes JAWS to speak correctly in the first and second scenarios. Note
		; that the second scenario in which the last mouse movement time may be the same as the
		; last key press time is why the >=(greater than or equal) operator is used in this if
		; statement instead of the >(greater than) operator.
		; Also note that there is currently no good method of ensuring that JAWS or MAGic speaks
		; correctly in the third scenario.
		say(buffer, ot_highlighted_screen_text, true)
		return
	endIf
	if screenEcho <= 1
	&& hwnd != getFocus()
		; Headings that redraw as you type into the document below them
		; are stopped from speaking here.
		return
	endIf
endIf
sayHighlightedText(hwnd, buffer)
endFunction

void function ConfigurationChangedEvent(string newConfiguration)
;Sometimes, when leaving Quicksettings, the scripts receive the FocusChangedEventEx before the QuickSettings scripts unload.
;When this occurs, quick navigation gets out of sync.
;So we run WordQuickNavInit here to compensate.
if newConfiguration == "word"
	WordQuickNavInit()
endIf
ConfigurationChangedEvent(newConfiguration)
EndFunction

int function IsContextMenu(int type)
if type == wt_contextMenu
	return true
elif type != wt_menu
	return false
endIf
;It's a menu, but is it a context menu:
return GetWindowSubtypecode(GetFocus()) == wt_contextMenu
	|| GetObjectSubtypecode(FALSE,1) == wt_contextMenu
EndFunction

int Function MenuProcessedOnFocusChangedEventEx(
	handle hwndFocus, handle hwndPrevFocus,
	int nType, optional int nChangeDepth)
if IsVirtualRibbonActive() return MenuProcessedOnFocusChangedEventEx(hwndFocus, hwndPrevFocus, nType,nChangeDepth) endIf
c_WordTester.WordContextMenuActive = IsContextMenu(nType)
if !nType
	;due to timing, when leaving a context menu in the document
	;the GetMenuMode function may return menu_active.
	;this causes the context menu to be announced as if it is appearing.
	;So, we test for the type here, and if it is 0 return false.
	GlobalMenuMode = GetMenuMode()
	return GlobalMenuMode != menu_inactive
endIf
return MenuProcessedOnFocusChangedEventEx(hwndFocus, hwndPrevFocus, nType,nChangeDepth)
EndFunction

int Function ContextMenuProcessed(handle hwnd)
var int bRetVal = contextMenuProcessed(hwnd)
c_WordTester.WordContextMenuActive = (bRetVal || IsContextMenu(GetObjectSubtypeCode()))
return bRetVal
EndFunction

void Function MenuModeEvent(handle WinHandle, int mode)
TrackEvent(event_menuMode)
MenuModeEvent(WinHandle, mode)
EstablishQuickNavState()
EndFunction

int function FocusRedirectedOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
;We have quite a lot of trouble with double firing of the focus change.
;It appears that in some SDM dialogs, the undesired focus change can be detected by the objID, childID, prevObjID and prevChildID all being 0.
if !nObject && !nChild && !nPrevObject && !nPrevChild
&& hwndFocus == hwndPrevFocus
&& StringStartsWith(c_WordFocus.RealWindowClass,"bosa_sdm_")
	return true
endIf
return FocusRedirectedOnFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction

int function FocusChangedEventShouldProcessAncestors(handle FocusWindow, optional handle prevFocusWindow)
if c_WordFocus.windowCategory == wCat_document
|| c_WordFocus.windowCategory == WCAT_SPELL_CHECKER
|| c_WordFocus.InProofingPaneSpellCheck
	return false
endIf
if c_WordFocus.ObjectSubType == WT_MULTILINE_EDIT
&& c_WordFocus.WindowClass == cwc_NetUIHwnd
&& getObjectSubtypeCode(FALSE, 2) == WT_DIALOG_PAGE
	return FALSE
endIf
; Readability Statistics is now a pane / transparent dialog even though it's still SDM,
; and the relevant controls are UIA text children of the dialog / window.
if getObjectName(FALSE, 1) == wn_ReadabilityStatistics return TRUE endIf
return FocusChangedEventShouldProcessAncestors(FocusWindow,prevFocusWindow)
EndFunction

void Function FocusChangedEventProcessAncestors(handle FocusWindow, handle PrevWindow)
;Keep edit combos on proofing pane from announcing themselves twice:
If c_WordFocus.InProofingPaneSpellCheck
&& c_WordFocus.ObjectSubType == WT_LISTBOXITEM
	sayObjectTypeAndText()
	Return
endIf
var	handle hDialog = getRealWindow(focusWindow)
If FocusWindow != PrevWindow
&& c_WordFocus.WindowClass == cwc_NetUIHwnd
&& GetWindowClass(hDialog) == wc_NUIDialog
&& GetWindowSubtypeCode(hDialog) == WT_DIALOG
	SayObjectTypeAndText()	; Reads control name and type.
	Return
EndIf
FocusChangedEventProcessAncestors(FocusWindow, PrevWindow)
endFunction

void function PreProcessFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
if nChangeDepth >= 0
	UpdateWordFocus(hwndFocus)
endIf
PreProcessFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction

void function FocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
; always kill suggestion split button because proofing pane code will reinitialize if appropriate.
oSuggestionSplitButton = null()
ClearProcessMainDocumentWindowTimer()
if FocusRedirectedOnFocusChangedEventEx(hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
	return
endIf
c_WordTester.hWndPrevFocus = hwndPrevFocus
c_WordTester.WasOfficeSplashScreen = WasOfficeSplashScreen() ;See comment in Office.jss FocusChangedEventEx
CancelFocusItemMonitors()
FocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EstablishQuickNavState()
endFunction

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
ManageUIAEvents()
if inHjDialog()
&& hwndFocus == hwndPrevFocus
&& c_WordFocus.WindowClass == "SearchBox"
&& inQuickSettingsDialog()
	;Dispel erroneous speech from items in QuickSettings Search Box:
	return; prevent over-chatter:
endIf
if nChangeDepth == 0
&& nType == wt_ListBoxItem
	;Some listbox items can focus to each item in the list using tab,
	;and their change depth is 0.
	;here we attempt to avoid repetative speaking of the list name for each item in the list:
	;Currently, we only know about the listbox items in the navigation pane:
	if IsSearchDocumentDialogType()
		if c_WordTester.PrevFocusWasLevelZeroChangeListBoxItem
			return ActiveItemChangedEvent(hwndFocus,nObject,nChild,
				hwndPrevFocus,nPrevObject,nPrevChild)
		else
			c_WordTester.PrevFocusWasLevelZeroChangeListBoxItem = true
			return ProcessEventOnFocusChangedEventEx(hwndFocus, nObject, nChild,
				hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth, sClass, nType)
		EndIf
	EndIf
elif c_WordTester.PrevFocusWasLevelZeroChangeListBoxItem
	c_WordTester.PrevFocusWasLevelZeroChangeListBoxItem = false
EndIf
ProcessEventOnFocusChangedEventEx(hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth, sClass, nType)
endFunction

void Function FocusChangedEvent(handle FocusWindow, handle PrevWindow)
if !c_WordFocus.InProofingPaneSpellCheckWithSplitButtons
	c_WordTester.TaskOrProofingPaneGroupName = cscNull
endIf
if c_WordFocus.WindowClass == "Excel7"
	SwitchToConfiguration("Excel")
	;Schedule call for ExcelFunc function:
	ScheduleFunction("InitializeObjectsForWordEmbeddedWorksheet", 3)
	return
endIf
; For document load from Office where Word doesn't automatically open to a document window:
if c_WordFocus.WindowClass == wc_wordMainDocumentWindow
	; exclude returning to document from embedded combo box in form fields:
	if getWindowClass(PrevWindow) != cWcMenuClass
	&& !IsFormField()
	&& prevWindow != focusWindow
 		WordInit()
		c_WordTester.SelectionRectChangedEventID = ScheduleFunction("RunSelectionContextEvents", 2)
	endIf
endIf
if ReturningFromResearchItDialog()
	return default::FocusChangedEvent(FocusWindow, PrevWindow)
endIf
if !c_WordTester.FocusChangedOnSelectATable
	TrackEvent(event_FocusChanged)
else
	;See script SelectATable for why this is used
	c_WordTester.FocusChangedOnSelectATable = false
endIf
GlobalRealWindowName = c_WordFocus.RealWindowName
;A blank password contains the same characters as a non-breaking space symbol,
;so make sure that nonbreaking symbol detection is off in passwords:
AllowNonbreakingSymbolsDetection(!(dialogActive() && c_WordFocus.ObjectSubType == wt_passwordEdit))
var
	int bSavedSDM,
	int savedUseSDMOption
if GlobalRealWindowName != globalPrevRealName
&& GlobalRealWindowName == wn_WordCountDialog
	; must turn on SDM dialog reading for this dialog, even though we read via UIA.
	; In english, this is alt+R,W.
	bSavedSDM = TRUE
	savedUseSDMOption = GetJCFOption(OPT_USE_SDM_API)
	SetJCFOption(OPT_USE_SDM_API,1)
endIf
FocusChangedEvent(FocusWindow, PrevWindow)
; if SDM option had been set to speak window properly, set it back:
if bSavedSDM
	SetJCFOption(OPT_USE_SDM_API,savedUseSDMOption)
endIf
EndFunction

int function HandleCustomAppWindows(handle AppWindow)
if !IsWindowVisible(AppWindow)
	; The app window is either invalid or hidden.
	; Either way, we don't want to  do anything special here because we're likely to hang
	return false
EndIf
if !IsUpdatingDocumentData()
	WDApp_DocumentChange()
EndIf
if HandleCustomSpellCheckRealWindows(AppWindow)
	;This behaves as app window change:
	return TRUE
endIf
;Dialogs may be real and app window both:
return HandleCustomAppWindows(AppWindow)
EndFunction

void function ProcessSayAppWindowOnFocusChange(handle AppWindow, handle FocusWindow)
if GlobalPrevApp == AppWindow
&& WindowCategoryIsWordDocument()
	if !IsUpdatingDocumentData()
		WDApp_DocumentChange()
	endIf
	return
endIf
ProcessSayAppWindowOnFocusChange(AppWindow, FocusWindow)
EndFunction

int function HandleCustomSpellCheckRealWindows(handle hReal)
;Actually processed as app window change but behaves like a real or dialog window
var
	handle focusWindow = getFocus(),
	string sRealName
if c_WordFocus.WindowClass == cwc_NetUIHwnd
	return FALSE
endIf
if c_WordFocus.windowCategory== WCAT_SPELL_CHECKER
&& c_WordFocus.WindowSubtype == WT_MULTILINE_EDIT
	sRealName = stringSegment(getWindowName(hReal), cScColon, 1)+cScColon
	indicateControlType(wt_dialog, sRealName)
	HandleCustomSpellCheckWindows(focusWindow)
	return TRUE
endIf
return False
endFunction

int function HandleCustomRealWindows(handle RealWindow)
var
	handle AppWindow = GetAppMainWindow(RealWindow),
	string RealWindowName = GetWindowName(RealWindow)
if StringContains(GetWindowName(AppWindow),RealWindowName)
	;Don't repeat the document name if it has already been spoken by the app focus change
	if !dialogActive()
		return true
	endIf
EndIf
return HandleCustomRealWindows(RealWindow)
EndFunction

void function ProcessSayRealWindowOnFocusChange(handle AppWindow, handle RealWindow, string RealWindowName, handle FocusWindow)
If GlobalPrevRealName == RealWindowName
&& GlobalPrevReal == RealWindow
&& GlobalCommandBarWindow == globalPrevCommandBarWindow
	;The real window did not change, so just return.
	return
EndIf
if c_WordFocus.windowCategory== WCAT_TASK_PANE
	c_WordTester.WasTaskPaneDialog = true
	if c_WordFocus.InMicrosoftEditorProofingPaneIssueChecker
		;In the Microsoft Editor pane, real window is same as the document real window.
		;Speaking will be handled through downstream functions of processsayfocuswindowonfocuschange.
		return
	endIf
	If c_WordFocus.InProofingPaneSpellCheck
		ReadSpellCheckInfoUIA(TRUE)
		return
	endIf
	return
endIf
if c_WordTester.WasTaskPaneDialog
	c_WordTester.WasTaskPaneDialog = false
	if WindowCategoryIsWordDocument()
		SayWindowTypeAndText(RealWindow)
		return
	EndIf
endIf
if RealWindowName == wn_WordCountDialog
&& GetJCFOption(OPT_USE_SDM_API) == 1
&& StringStartsWith(c_WordFocus.RealWindowClass, "bosa_sdm_")
	; only handle special case if we got the word count properly:
	var string wordCountText = GetWordCountDlgStaticText(focusWindow)
	if !stringIsBlank(wordCountText)
		indicateControlType(WT_DIALOG, realWindowName)
		sayMessage(OT_DIALOG_TEXT, wordCountText)
		return
	endIf
endIf
if InbosaSDMMso96Dialog()
&& c_WordFocus.InProofingPaneSpellCheck
	ReadSpellCheckInfo()
	return
endIf
ProcessSayRealWindowOnFocusChange(AppWindow, RealWindow, RealWindowName, FocusWindow)
endFunction

int function HandleCustomSpellCheckWindows(handle hwnd)
if c_WordFocus.windowCategory!= WCAT_SPELL_CHECKER
	return FALSE
endIf
var int iSubtype = c_WordFocus.ObjectSubType
if c_WordFocus.WindowClass == wc_bosa_sdm_Mso96
	if iSubtype == wt_edit
		;Occasionally, when an accellerator key is used while focus is in the edit field showing the word in context,
		;Focus change will fire and the class will be the bosa sdm window while the object is wt_edit.
		;This is a transitional focus change, and we want to ignore it.
		return true
	endIf
	if iSubtype == wt_button
		return false
	endIf
endIf
if iSubtype == wt_Document
|| iSubtype == wt_multiline_edit
	;The error will be shown in context in an element of type document.
	ReadSpellCheckInfo()
  return true
elIf iSubtype == wt_listboxItem
	IndicateControlType(wt_ListBox,GetObjectName(false,1), GetObjectName())
	spellString(GetObjectName())
	SayMessage(OT_POSITION, PositionInGroup())
	return TRUE
endIf
return FALSE
endFunction

int function handleCustomWindows(handle hwnd)
if HandleCustomSpellCheckWindows(hwnd)
	return TRUE
endIf
return handleCustomWindows(hwnd)
endFunction

void function ProcessSayFocusWindowOnFocusChange(string RealWindowName, handle FocusWindow)
if GlobalWasHJDialog
&& UserBufferIsActive()
	;SayLine or SayAll will be performed,
	;so don't say the user buffer as the focus item.
	return
endIf
if c_WordFocus.InProofingPaneSpellCheck
&& getRealWindow(GlobalFocusWindow) != GlobalPrevReal
	; Real window is speaking spell check info in dialog first load.
	return
endIf
ProcessSayFocusWindowOnFocusChange(RealWindowName, FocusWindow)
endFunction

void Function ProcessSayWindowPromptAndTextTutorialHelp(int iSubtype,handle hwnd,int bSpeak,int nTrainingMode)
if dialogActive () then
; open or Save As dialogs will read the toolbar describing location
	SayFolderLocationForDialog ()
endIf
SayTutorialHelp(iSubType,bSpeak)
SayTutorialHelpHotKey(hWnd,bSpeak)
IndicateComputerBraille(hwnd)
SpeakProgressBarInfo(bSpeak)
smmToggleTrainingMode(nTrainingMode)
EndFunction

Script SayWindowPromptAndText()
var
	int sayIt = TRUE,
	int ignoreFonts = TRUE,
	handle hWnd,
	handle hFocus,
	int iSubType,
	int iObjType,
	int nMode,
	string sWindowName,
	string sClass
c_WordTester.TaskOrProofingPaneGroupName = cscNull ; so SayObjectTypeAndText will read it properly.
DescribeTextAnnotationOrAttributes(sayIt, ignoreFonts)
if handleNoCurrentWindow()
	return
endIf
if MenusActive()
|| InHJDialog()
	performscript SayWindowPromptAndText()
	return
EndIf
hWnd = GetCurrentWindow()
hFocus=GetFocus()
iSubType = GetWindowSubTypeCode(hWnd)
If !iSubType
	iSubType = c_WordFocus.ObjectSubType
Else
	iObjType=c_WordFocus.ObjectSubType
EndIf
if inRibbons()
|| IsVirtualRibbonActive()
|| (!OutlookIsActive()
&& isStatusBarToolbar())
	if IsVirtualRibbonActive()
		sayVirtualRibbonItem()
	else
		if InMultilevelListPane()
		&& UsingShortNameOfMultiLevelListObject()
			IndicateControlType(wt_grid,GetWord2003MultiLevelListObjectNameOfFocusObject(),cscNull)
			Say(PositionInGroup(),ot_position)
			SayUsingVoice(vctx_message,GetObjectName(),ot_help)
		else
			self::SayObjectTypeAndText()
		endIf
	endIf
	ProcessSayWindowPromptAndTextTutorialHelp(iSubtype,hFocus,true,nMode)
	return
endIf
sClass = c_WordFocus.WindowClass
nMode = smmTrainingModeActive()
smmToggleTrainingMode(TRUE)
If sClass == wc_officeDropdown
&& !iSubtype
&& !iObjType
	iSubtype = wt_ComboBox
	Say(GetLine(),ot_line)
	ProcessSayWindowPromptAndTextTutorialHelp(iSubtype,hwnd,true,nMode)
	Return
ElIf StringContains(GetObjectName(),scBallon)
	self::GetCustomTutorMessage()
	self::SayFocusedWindow()
	ProcessSayWindowPromptAndTextTutorialHelp(iSubtype,hwnd,true,nMode)
	Return
EndIf
if InTaskPaneDialog()
	GetCustomTutorMessage()
	SayFocusedWindow()
	ProcessSayWindowPromptAndTextTutorialHelp(iSubtype,hwnd,true,nMode)
	return
EndIf
if (menusActive() || dialogActive())
&& !IsWordDocumentActive()
	;for new document dialog:
	; need to force following calls as standard calls to SayFocusedObject, etc. do not provide enough information.
	if StringContains(GetWindowName(GetRealWindow(hwnd)),wn_newDocumentDlg)
	&& c_WordFocus.ObjectSubType == wt_listboxItem
		SayWindowTypeAndText(GetParent(hwnd))
		SayMessage(ot_control_name,GetObjectName(SOURCE_CACHED_DATA,1))
		indicateControlType(wt_listboxItem,GetObjectName()) ; iObjType does not get correct info here.
	Else
		If InTaskPaneDialog()
			GetCustomTutorMessage()
			SayFocusedObject()
		Else
			self::sayFocusedWindow()
		EndIf
	endIf
	ProcessSayWindowPromptAndTextTutorialHelp(iSubtype,hwnd,true,nMode)
	return
endIf
if WindowCategoryIsWordDocument()
	if IsVirtualPcCursor()
		speakSmartNavLevelSetting()
	endIf
	If IsFormField()
		self::SayObjectTypeAndText()
		SayF1Help()
		if inTable()
			sayCellCoordinatesInfo()
		endIf
	elif inTable()
		sayCellPromptAndText()
	else ; not in a table so if on a field, announce it
		;may need further refactor.
		self::SayLine()
; the following uses globalInBorderedText, which is not set anywhere:
;		;only read text in a bordered region if the region is determined to be arbitrary rather
;		;than a paragraph or number of paragraphs or sections.
;		;for example if the author places a border around several words.
;		if globalInBorderedText
;			sayTextInBorderedRegion()
;		endIf
	endIf
	return
else
	If StringContains(getWindowName(GetRealWindow(hwnd)),wn_options)
		if c_WordFocus.ObjectSubType == wt_listBoxItem
			self::sayFocusedWindow()
			SayUsingVoice(vctx_message,msgOptionsDlgCategoriesTutorHelp,ot_line)
		else
			self::sayObjectTypeAndText()
		endIf
		ProcessSayWindowPromptAndTextTutorialHelp(iSubtype,hwnd,true,nMode)
		return
	endIf
endIf
performscript SayWindowPromptAndText()
EndScript

void function SayControlGroupNameForTaskAndProofingPane()
; could apply to other groups in task panes in future, but applies to spellCheck with split buttons at the moment.
if !c_WordFocus.InProofingPaneSpellCheckWithSplitButtons
	c_WordTester.TaskOrProofingPaneGroupName = cscNull
	return
endIf
var object element = FSUIAGetFocusedElement() ; get current button or control
if !element
	c_WordTester.TaskOrProofingPaneGroupName = cscNull
	return
endIf
var int isReadOnlyEditElement =(element.controlType == UIA_EditControlTypeId
		&& element.GetValuePattern().IsReadOnly)
element = CreateUIAParentOfElement(element)
if !element
|| element.ControlType != UIA_GroupControlTypeId
	c_WordTester.TaskOrProofingPaneGroupName = cscNull
	return
endIf
if isReadOnlyEditElement
|| c_WordFocus.ObjectSubType == WT_READONLYEDIT
	; read mistake and first suggestion split button
	ReadProofingPaneWithSplitButtons()
elIf element.name != c_WordTester.TaskOrProofingPaneGroupName
	sayMessage(OT_CONTROL_GROUP_NAME, element.name)
endIf
c_WordTester.TaskOrProofingPaneGroupName = element.name
endFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
if UserBufferIsActive()
	if c_WordFocus.InProofingPaneSpellCheck
		return ; so we don't get double repeated text from the first time the Reason Text viewer comes up.
	else
		SayObjectTypeAndText(nLevel,includeContainerName)
		Return
	endIf
endIf
var
	handle hWnd = getCurrentWindow(),
	int iType,
	string sValue,
	String sObjectHelp = GetObjectHelp()
if nLevel == 0
	SayControlGroupNameForTaskAndProofingPane()
	iType = GetObjectSubtypeCode(SOURCE_CACHED_DATA)
	if iType == WT_STATIC
	&& ReadMicrosoftEditorIssueCheckerInfo(true, false)
		return
	elIf iType == WT_SPLITBUTTON
	&& ReadMicrosoftEditorSuggestion()
		return
	elIf iType == WT_LISTBOXITEM
	&& c_WordFocus.InProofingPaneSpellCheck
		SayObjectTypeAndText(nLevel,includeContainerName)
		if GetObjectStateCode(TRUE) & STATE_SYSTEM_DEFAULT
			; avoid spelling the drop down item in the language combo box when it first opens to a list box:
			SpellString(GetObjectName(SOURCE_CACHED_DATA))
		endIf
		Return
	elIf iType == WT_LISTBOXITEM
	&& c_WordFocus.WindowClass == "bosa_sdm_msword"
		indicateControlType(WT_LISTBOX, getObjectName(0, 1), getObjectName())
		say(PositionInGroup(), OT_POSITION)
		return
	elIf getObjectTypeCode() == WT_EDIT
	&& c_WordFocus.InProofingPaneSpellCheckWithSplitButtons
		; current sentence edit field does not read whole sentence but only current line:
		var object pattern = FSUIAGetFocusedElement().GetValuePattern()
		if !stringIsBlank(pattern.value)
			return indicateControlType(WT_READONLYEDIT, getObjectName(SOURCE_CACHED_DATA), pattern.value)
		endIf
	endIf
	if iType == wt_grid
		if InMultilevelListPane()
			IndicateControlType(wt_grid,GetWord2003MultiLevelListObjectNameOfFocusObject(),cscNull)
			Say(PositionInGroup(),ot_position)
			;we notify the user of context help because
			;we have substituted the actual name with a user-friendly shorter version,
			;and the context help is the aqctual name of the object.
			NotifyIfContextHelp()
			return
		endIf
	EndIf
EndIf
if c_WordFocus.HeaderForNewAddressListField != cscNull
	IndicateControlType (iType, c_WordFocus.HeaderForNewAddressListField, GetObjectValue ())
	return
endIf
if GetObjectName(SOURCE_CACHED_DATA, 1) == wn_SearchResultsList
	Say(sObjectHelp, OT_LINE)
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
If nLevel == 0
	SpeakSuggestionsAvailable()
	; If the object is the button type and has a path in the help message we should announce it...
	; a good example is the recent files buttons in the open ribbon dialogue
	If iType == WT_BUTTON
	&& !StringIsBlank(sObjectHelp)
	&& GetObjectName(SOURCE_CACHED_DATA) != sObjectHelp
	&& GetWindowClass(hWnd) == cwc_NetUIHwnd
	&& isBackStageView(hWnd)
		Say(sObjectHelp, OT_SCREEN_MESSAGE)
	EndIf
EndIf
EndFunction

void function AnnounceNoOpenDocument()
c_WordTester.AnnounceNoOpenDocumentTimerID = 0
;make sure that focus is still on the empty client workspace,
;since focus can briefly land in an empty client workspace before firing again to land elsewhere,
;such as a newly opened document:
if c_WordFocus.windowCategory == WCAT_DOCUMENT_WORKSPACE
	BrailleRefresh()
	SayUsingVoice(vctx_message,msgNoOpenDocument,ot_help)
endIf
EndFunction

void Function SayFocusedWindow()
if c_WordFocus.windowCategory == wCat_document
	if GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0)!=WT_DOCUMENT
		sayobjectTypeAndText()
		return
	endIf
	; may need to re-initialize application pointer.
	if IsAppObjInvalid()
		InitializeAppObj()
	EndIf
	if (getRunningFSProducts() == PRODUCT_MAGic ||!BrailleInUse ())
	&& (!globalPrevFocus || stringContains(getWindowClass(globalPrevFocus), cwc_NetUIHwnd)) then ; returning from the ribbons
		RunSelectionContextEvents(); update all relevant data for tables.
		updateTableManually()
		cwdUpdateTitleColumnsAndRows()
	endIf
	globalDocumentName = GetActiveDocumentName()
	;Check that this is not a double firing of focus change for a window,
	;where the window was already announced.
	;Testing here with c_WordTester.hWndPrevFocus instead of GlobalPrevFocus
	;allows detection of focus change due to leaving menus:
	if c_WordTester.WasOfficeSplashScreen
	|| !(c_WordTester.hWndPrevFocus == GlobalFocusWindow
	&& globalPrevDocumentName == globalDocumentName)
		c_WordTester.ProcessMainDocumentWindowTimerID = scheduleFunction("ProcessMainDocumentWindowWrapper", 1)
	endIf
	globalPrevDocumentName = globalDocumentName
	return
elif c_WordFocus.windowCategory == WCAT_DOCUMENT_WORKSPACE
	globalDocumentName = cscNull
	globalPrevDocumentName = globalDocumentName
	c_WordTester.AnnounceNoOpenDocumentTimerID = ScheduleFunction("AnnounceNoOpenDocument",10)
	return
endIf
SetTypingEchoLanguage() ; reset in case it was changed for language detection
if dialogActive()
&& c_WordFocus.windowCategory != WCAT_SPELL_CHECKER
|| c_WordFocus.windowCategory == WCAT_TASK_PANE
	return SayFocusedWindow()
endIf
if menusActive()
	Return; handled separately.
endIf
SayFocusedWindow()
EndFunction

void Function ProcessMainDocumentWindow(handle hFocus)
if NotifyZoomManyPages()
	return
endIf
If OutlookIsActive()
	Return ProcessOutlookMessageWindow(hFocus)
EndIf
; Enhanced edit must be on in nav area of document.
if GetJcfOption(OPT_EDIT_USE_OSM)
	setJcfOption(OPT_EDIT_USE_OSM,0)
EndIf
;Document name may have been announced on app change,
;but if the app did not change but the document did,
;the new document name gets announced here instead:
if GlobalPrevApp == GetAppMainWindow(GetFocus())
&& globalPrevDocumentName != globalDocumentName
	Say(GlobalDocumentName,ot_dialog_name)
endIf
var int bIsFormfield = IsFormfield()
if !inTable()
&& !bIsFormfield
&& !IsActiveDocumentProtected()
&& !GlobalWasHJDialog
;Testing here with GlobalPrevFocus instead of c_WordTester.hWndPrevFocus
;allows this announcement to be skipped when leaving menus:
&& globalPrevFocus != GlobalFocusWindow
	if CheckForUnsupportedDocumentView()
		return
	EndIf
EndIf
DetectDocumentHeadersFooters()
if !bIsFormfield
	;	ProcessMeasurementUnitSetting()
	SetNewLineIndicationMode()
	IndicateControlType(wt_edit,cscSpace,cscSpace)
	return
EndIf
if bIsFormfield
&& !IsDocumentTableActive()
	self::sayObjectTypeAndText()
 	SayF1Help()
EndIf
EndFunction

void function ProcessMainDocumentWindowWrapper()
ProcessMainDocumentWindow(globalFocusWindow)
endFunction

void Function ProcessOutlookMessageWindow(Optional handle hWnd)
Var
	Int iQuickNavigationOption,
	String sFormat
If !hWnd
	hWnd = GetFocus()
EndIf
;ReadHeader(1)
If IsActiveWindowProtected()
	ReadOutlookMessage()
	if !sayAllInProgress()
	&& ShouldMessageTypeSpeak()
		Say(GetWindowName(hWnd), OT_CONTROL_NAME)
		sFormat = StringSegment(GetWindowName(GetAppMainWindow(hWnd)), "()", -2)
		If !StringIsBlank(sFormat)
			Say(sFormat, OT_SCREEN_MESSAGE)
		EndIf
	endIf
	If sayAllInProgress() && ShouldSetQuickNavModeTo2()
		iQuickNavigationOption = 2
	else
		iQuickNavigationOption = 1
	EndIf
Else
	IndicateControlType(WT_MULTILINE_EDIT)
	iQuickNavigationOption = 0
EndIf
SetJcfOption(OPT_QUICK_KEY_NAVIGATION_MODE, iQuickNavigationOption)
SetQuickKeyNavigationState(iQuickNavigationOption)
Return
EndFunction

void function ActiveItemChangedEvent(handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
var int ObjectSubtypeCode = GetObjectSubtypeCode()
if c_WordFocus.InProofingPaneSpellCheck
&& (ObjectSubtypeCode == WT_LISTBOXITEM || ObjectSubtypeCode == WT_COMBOBOX)
; avoid spelling the items in the language combo when it drops down to  list.
; This list contains items without a state code.
&& GetObjectStateCode(TRUE) & STATE_SYSTEM_DEFAULT
	SayObjectActiveItem()
	SpellString(GetObjectName(SOURCE_CACHED_DATA))
	return
endIf
ActiveItemChangedEvent(curHwnd,curObjectId,curChildId,prevHwnd,prevObjectId,prevChildId)
EndFunction

void function ObjStateChangedEvent(handle hObj,optional  int iObjType, int nChangedState, int nState, int nOldState)
var
	handle hFocus = GetFocus()
if hObj == hFocus
&& iObjType == wt_TabControl
&& nChangedState & ctrl_selected
	;just say the selected state, don't include the pressed state:
	indicateControlState(wt_tabControl,ctrl_selected)
	return
EndIf
if iObjType == wt_listBoxItem
&& !nState
	if !nOldState
		;this occasionally happens when pressing Enter on a style in the taskpane
		;and the object gets this event before focus returns to the document
		return
	elif nOldState == ctrl_selected
	&& c_WordFocus.WindowClass == cwc_NetUIHwnd
		;For Word 2007/2010,
		;the Options dialog uses a listbox instead of tab controls for the multiple pages.
		;When navigating this listbox,
		;the deselection of a listbox item may happen before the focus moves to the new item.
		;Do nothing for this state change.
		return
	EndIf
endIf
ObjStateChangedEvent(hObj,iObjType, nChangedState, nState, nOldState)
EndFunction

void function RunNavQuickKeysManager()
NavigationQuickKeysManager(1)
EndFunction

int Function InTextWindow()
If c_WordFocus.windowCategory== wCat_document
	return true
Else
	return inTextWindow() ;default
EndIf
EndFunction

int Function IsTextAnalysisValid()
;overwritten here so that the function returns true for Word document windows and Outlook message windows.
If c_WordFocus.windowCategory== wCat_document
&& !UserBufferIsActive()
&& !quickNavKeyTrapping()
	return true
endIf
return IsTextAnalysisValid()
EndFunction

int Function ShouldForceComputerBraille(handle hwndTrans)
;Overwritten here so that the user can type in contracted English Braille in the main document area.
if c_WordFocus.windowCategory== wCat_document
&& !UserBufferIsActive() then
	return false
EndIf
return ShouldForceComputerBraille(hwndTrans)
EndFunction

int function ContractedBrailleInputAllowedNow()
;Overridden here for when quick keys mode is enabled.
if QuickNavKeyTrapping()
&& !UserBufferIsActive() then
	return false
endIf
return ContractedBrailleInputAllowedNow()
endFunction

int function UsesUnderlyingDom()
if c_WordFocus.windowCategory== wCat_document
&& !globalMenuMode
&& !DialogActive()
&& QuickKeyNavigationModeActive()
	return true
EndIf
return UsesUnderlyingDom()
EndFunction

int function KeyHasJAWSModifier(string sKey)
var string s = StringLower(sKey)
return StringContains(s,"jawskey")
	|| StringContains(s,"insert")
	|| StringContains(s,"capslock")
EndFunction

int function IsDocumentAreaScriptException(optional int bValidInOutlook)
if InHJDialog()
	SayFormattedMessage(OT_ERROR, cmsg337_L, cmsg337_S)
	return true
EndIf
if c_WordFocus.windowCategory!= wCat_document
	if !KeyHasJAWSModifier(GetCurrentScriptKeyName())
		SayCurrentScriptKeyLabel()
		TypeCurrentScriptKey()
	else
		if bValidInOutlook
		&& OutlookIsActive()
			sayMessage(ot_error,msgNotInOutlookMessage_l,msgNotInOutlookMessage_s)
		else
			SayFormattedMessage(OT_error, msgNotInDocumentWindow1_L)
		EndIf
	endIf
	return true
EndIf
return false
EndFunction

int function SayCursorMovementException(int UnitMovement, optional int bMoved)
return isVirtualPCCursor()
	|| SayCursorMovementException(UnitMovement,bMoved)
EndFunction

void function SayPageUpDownUnit(int UnitMovement)
If SayCursorMovementException(unitMovement)
	SayPageUpDownUnit(unitMovement)
	return
endIf
if c_WordFocus.windowCategory== wCat_document
	return
EndIf
SayPageUpDownUnit(UnitMovement)
EndFunction

void function LineSpacingDescChangedEvent(string lineSpacingDescription)
; Outlook's old spell checker is now trying to report text inconsistencies, and it shouldn't be doing this.
if c_WordFocus.windowCategory== WCAT_SPELL_CHECKER return FALSE endIf
return LineSpacingDescChangedEvent(lineSpacingDescription)
endFunction

int function IsSearchDocumentDialogType()
if c_WordFocus.windowCategory != wCat_Task_Pane
	return false
EndIf
var
	string sObjNameAtLevel1,
	string sObjNameAtLevel2
sObjNameAtLevel1 = GetObjectName(SOURCE_CACHED_DATA,1)
sObjNameAtLevel2 = GetObjectName(SOURCE_CACHED_DATA,2)
if StringCompare(sObjNameAtLevel1,on_Find_And_Replace) == 0
|| StringCompare(sObjNameAtLevel2,on_Find_And_Replace) == 0
|| StringCompare(sObjNameAtLevel1,on_Navigation_Pane) == 0
|| StringCompare(sObjNameAtLevel2,on_Navigation_Pane) == 0
	return true
endIf
if GetObjectName(SOURCE_CACHED_DATA) == wn_SearchDocument
	return true
endIf
return false
EndFunction

int function ShouldNotifyIfContextHelp()
if UsingShortNameOfMultiLevelListObject()
	return true
endIf
return ShouldNotifyIfContextHelp()
endFunction

void function NotifyIfContextHelp()
if !ShouldNotifyIfContextHelp() return endIf
if UsingShortNameOfMultiLevelListObject()
	SayUsingVoice(vctx_message, cMsgContextHelp,OT_SMART_HELP)
	return
EndIf
NotifyIfContextHelp()
EndFunction

void function ProcessBoundaryStrike(handle hWnd, int edge)
If IsReadOnlyVirtualMessage()
	;Scoping to avoid calling the one in WordFunc:
	return default::ProcessBoundaryStrike(hWnd, Edge)
EndIf
If c_WordFocus.windowCategory == wCat_document
||(OutlookIsActive() && c_WordFocus.WindowClass == wc_wwg)
	giScheduledDocumentTopAndBottomEdgeAlert =
	ScheduleFunction("DocumentTopAndBottomEdgeAlert",3)
	return
endIf
if GetJCFOption(OPT_TOP_AND_BOTTOM_EDGE_ALERT)
	ProcessBoundaryStrike(hWnd,edge)
EndIf
EndFunction

void function DocumentTopAndBottomEdgeAlert()
giScheduledDocumentTopAndBottomEdgeAlert = 0
; If we're reading sentence or paragraph, must special case this:
var string LastScript = GetScriptAssignedTo(GetCurrentScriptKeyName())
if StringContains(LastScript, "Arrow") ; paragraph reading
	SayParagraph()
	return
ElIf StringContains(LastScript, "Listbox")
|| StringContains(LastScript, "Sentence") then ; sentence reading
	SaySentence()
	return
endIf
Beep()
if !BrailleIsInputSource()
; if edit callbacks is off, line navigation already reads this:
&& SupportsEditCallbacks()
	SayLine()
endIf
EndFunction

int function NotifyZoomManyPages()
if getCurrentZoomLevel() == ZOOM_MANY_PAGES
	sayFormattedMessage(OT_ERROR, msgZoomManyPages_l,msgZoomManyPages_s)
	return true
endIf
return false
EndFunction

Script ScriptFileName()
ScriptAndAppNames(msgWordForWindowsAppName)
endScript

void function SayUIARegSetting ()
var int val
val=getRegistryEntryDWORD(1, "Software\\Freedom Scientific\\FSDomSrv", "MSWordNoUIA")
if val
	SayMessage(OT_status, "DOM")
else
	SayMessage(OT_status, "UIA")
endIf
endFunction

Script TestSayUIARegSetting()
SayUIARegSetting()
endScript

void function SayActivePaneName()
if !IsWordDocumentActive()
	if c_WordFocus.RealWindowName == wn_applyStyles
		sayMessage(ot_dialog_name,wn_ApplyStyles)
	elif c_WordFocus.RealWindowName == wn_Styles
		sayMessage(ot_dialog_name,wn_Styles)
	endIf
	return
endIf
SayActivePane()
EndFunction

Script switchPanes()
EnsureNoUserBufferActive()
sayCurrentScriptKeyLabel()
TypeKey(ksSwitchPanes)
delay(2, TRUE)
SayActivePaneName()
EndScript

Script switchPanesReverse()
EnsureNoUserBufferActive()
sayCurrentScriptKeyLabel()
TypeKey(ksSwitchPanesReverse)
pause()
SayActivePaneName()
EndScript

Script SwitchDocumentView()
SayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
if WindowCategoryIsWordDocument()
	Pause()
	var string sViewName = GetActiveDocumentViewName()
	SayFormattedMessage(ot_status,
		FormatString(msgDocumentView_l,sViewName),
		FormatString(msgDocumentView_s,sViewName))
EndIf
EndScript

Script ReadWordInContext()
readWordInContext()
EndScript

void Function WindowMinMaxEvent(handle hWindow, int nMinMaxRest, int nShow)
if c_WordTester.WindowStateToggledByScript
	c_WordTester.WindowStateToggledByScript = false
	if nMinMaxRest==1
		Say(msgWindowStateToggleMaximize,ot_screen_message)
	ElIf nMinMaxRest==2
		Say(msgWindowStateToggleRestore,ot_screen_message)
	EndIf
EndIf
EndFunction

script ToggleWindowState()
c_WordTester.WindowStateToggledByScript = true
TypeKey(ksToggleWindowState) ; AltF10 in English
EndScript

Script AltF4()
ReleaseEditInterfaces()
;debug add back: wordFunc::AutoFinishEvent()
TypeCurrentScriptKey()
SayCurrentScriptKeyLabel()
EndScript

Script CloseDocumentWindow()
If StringContains(c_WordFocus.WindowClass,wc_wwf)
&& !DialogActive()
&& !StringContains(GetWindowClass(GetParent(GlobalFocusWindow)),cwc_Dlg32770)
	IndicateControlType(wt_MDIClient)
EndIf
PerformScript CloseDocumentWindow()
EndScript

int function ChooseHeadingLevelInSelectAHeadingDialog()
;This function should be called only in the scripts assigned to Alt+Number, for the exception of handling the heading list HJDialog.
If !InHJDialog()
|| c_WordFocus.RealWindowName != cWn16 ; Heading List
 return false
endIf
sayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
SayLine()
return true
EndFunction

Script Alt1()
If ChooseHeadingLevelInSelectAHeadingDialog() return endIf
EnsureNoUserBufferActive()
If c_WordFocus.windowCategory== WCAT_MESSAGE
	PerformScript ReadOutlookHeader(1)
	return
EndIf
sayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

script Alt2()
If ChooseHeadingLevelInSelectAHeadingDialog() return endIf
EnsureNoUserBufferActive()
If c_WordFocus.windowCategory== WCAT_MESSAGE
	PerformScript ReadOutlookHeader(2)
	return
EndIf
sayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

script Alt3()
If ChooseHeadingLevelInSelectAHeadingDialog() return endIf
EnsureNoUserBufferActive()
If c_WordFocus.windowCategory== WCAT_MESSAGE
	PerformScript ReadOutlookHeader(3)
	return
EndIf
sayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

script Alt4()
If ChooseHeadingLevelInSelectAHeadingDialog() return endIf
EnsureNoUserBufferActive()
If c_WordFocus.windowCategory== WCAT_MESSAGE
	PerformScript ReadOutlookHeader(4)
	return
EndIf
sayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

script Alt5()
If ChooseHeadingLevelInSelectAHeadingDialog() return endIf
EnsureNoUserBufferActive()
If c_WordFocus.windowCategory== WCAT_MESSAGE
	PerformScript ReadOutlookHeader(5)
	return
EndIf
sayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

script Alt6()
If ChooseHeadingLevelInSelectAHeadingDialog() return endIf
EnsureNoUserBufferActive()
If c_WordFocus.windowCategory== WCAT_MESSAGE
	PerformScript ReadOutlookHeader(6)
	return
EndIf
sayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

script Alt7()
If ChooseHeadingLevelInSelectAHeadingDialog() return endIf
EnsureNoUserBufferActive()
If c_WordFocus.windowCategory== WCAT_MESSAGE
	PerformScript ReadOutlookHeader(7)
	return
EndIf
sayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

script Alt8()
If ChooseHeadingLevelInSelectAHeadingDialog() return endIf
EnsureNoUserBufferActive()
If c_WordFocus.windowCategory== WCAT_MESSAGE
	PerformScript ReadOutlookHeader(8)
	return
EndIf
sayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

script Alt9()
If ChooseHeadingLevelInSelectAHeadingDialog() return endIf
EnsureNoUserBufferActive()
If c_WordFocus.windowCategory== WCAT_MESSAGE
	PerformScript ReadOutlookHeader(9)
	return
EndIf
sayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

script Alt0()
If ChooseHeadingLevelInSelectAHeadingDialog() return endIf
EnsureNoUserBufferActive()
If c_WordFocus.windowCategory== WCAT_MESSAGE
	PerformScript ReadOutlookHeader(10)
	return
EndIf
sayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

Script SayCurrentSchemeName()
var string sScheme = getCurrentSchemeName()
SayFormattedMessage(ot_user_requested_information,
	FormatString(msgSchemeName_l,sScheme),
	FormatString(msgSchemeName_s,sScheme))
EndScript

Script SelectAScheme()
var string sPrevScheme = GetCurrentSchemeName()
PerformScript SelectAScheme() ; default
;update global scheme name in appropriate .jsi file.
var string SchemeName = GetCurrentSchemeName()
if stringCompare(sPrevScheme, SchemeName) == 0
	Return
endIf
If !SchemeIsDocSpecific() ; scheme same throughout  app
	WriteSettingString(section_options, hKey_scheme, SchemeName, FT_CURRENT_JCF)
Else
	WriteSettingString("Doc", hKey_Scheme, SchemeName, FT_JSI, wdUser, getActiveDocumentJSIFileName())
EndIf
EndScript

void Function ListLists()
var
	string sList,
	int index,
	int nCurrentList
sList = GetListOfLists(LIST_ITEM_SEPARATOR)
if !sList
	SayFormattedMessage(ot_error, msgNoLists1_L)
	return
endIf
nCurrentList = GetListIndex()
index = DlgSelectItemInList(sList, msgSelectAListDialogName1_L, false,nCurrentList)
if index
	MoveToListByIndex(index)
endIf
endFunction

Script selectAList()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException(true) then
	return
EndIf
ListLists()
EndScript

void Function ListTables()
var
	string sList,
	int index,
	int nCurrentTable
sList = GetListOfTables(LIST_ITEM_SEPARATOR)
if !sList
	SayFormattedMessage(ot_error, msgNoTables1_L, msgNoTables1_l)
	return
endIf
nCurrentTable = GetTableIndex()
index = DlgSelectItemInList(sList, msgSelectATableDialogName1_L, false,nCurrentTable)
if index
	MoveToTableByIndex(index)
endIf
if index != nCurrentTable
	;The TableEnteredEvent will fire before the FocusChangedEvent,
	;so set a variable used by FocusChangedEvent to test if this has happened.
	;Normally, FocusChangedEvent happens before TableEnteredEvent,
	;and TableEnteredEvent tests for this and does not process all of the speech in the event.
	c_WordTester.FocusChangedOnSelectATable = true
EndIf
endFunction

Script selectATable()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException(true) then
	return
EndIf
ListTables()
EndScript

Script routeJAWSCursorToPc()
if GetSelectionContext() & SelCtxFields
&& !IsObjectNavigationActive()
	routeJAWSCursorToField()
else
	performScript routeJAWSCursorToPc()
endIf
EndScript

Script BrailleShowRevisionInfo()
var
	int nCell,
	string sRevisionText
;flash Braille message for revision information:
if c_WordFocus.windowCategory == wCat_document
&& isPCCursor()
	sRevisionText = GetSelectionContextRevisionText()
	if sRevisionText
		nCell = GetLastBrailleRoutingKey()
		if BrailleGetStatusCellCount()>0
		&& nCell==-1
			BrailleRoutingButton(nCell)
			BrailleMessage(sRevisionText
				+cscSpace+GetRevisionTypeString(GetSelectionContextRevisionType())
				+cscSpace+formatString(msgRevAuthor_s,GetSelectionContextRevisionAuthor())
				+cscSpace+GetSelectionContextRevisionDate())
		else
			BrailleRoutingButton(nCell)
			BrailleRefresh()
		endIf
		return
	endIf
endIf
performScript BrailleRouting()
EndScript

Script NextCell()
If WindowCategoryIsWordDocument()
&& !IsReadOnlyVirtualMessage()
	if TableErrorEncountered(UnitMove_Next)
		Return
	endIf
	if !NextCell()
		SayUsingVoice(VCTX_message, cMSGEndOfRow, OT_JAWS_message)
		return
	endIf
	SetDocumentTableNavType(TABLE_NAV_HORIZONTAL)
	return
endIf
PerformScript NextCell()
EndScript

Script PriorCell()
If WindowCategoryIsWordDocument()
&& !IsReadOnlyVirtualMessage()
	if TableErrorEncountered(UnitMove_Prior)
		Return
	endIf
	if !PriorCell()
		SayUsingVoice(VCTX_message, cMSGBeginningOfRow, OT_JAWS_message)
		return
	EndIf
	SetDocumentTableNavType(TABLE_NAV_HORIZONTAL)
	return
EndIf
PerformScript PriorCell()
EndScript

Script UpCell()
If c_WordFocus.windowCategory == wCat_document
&& !IsReadOnlyVirtualMessage()
	if TableErrorEncountered(UnitMove_Up)
		Return
	endIf
	if !UpCell()
		SayUsingVoice(VCTX_message, cMSGTopOfColumn, OT_JAWS_message)
		return
	EndIf
	SetDocumentTableNavType(TABLE_NAV_VERTICAL)
	return
EndIf
PerformScript UpCell()
EndScript

Script DownCell()
If c_WordFocus.windowCategory == wCat_document
&& !IsReadOnlyVirtualMessage()
	if TableErrorEncountered(UnitMove_Down)
		Return
	endIf
	if !DownCell()
		SayUsingVoice(VCTX_message, cMSGBottomOfColumn, OT_JAWS_message)
		return
	EndIf
	SetDocumentTableNavType(TABLE_NAV_VERTICAL)
	return
EndIf
PerformScript DownCell()
EndScript

Script FirstCellInTable()
If WindowCategoryIsWordDocument()
&& !IsReadOnlyVirtualMessage()
	if !InTable()
	&& GetCurrentScriptKeyName() == ks_Word_Browse_Objects
		;Alt+Control+Home is the Word keystroke to Browse Object.
		;Make sure that the const exactly matches the name received by KeyPressedEvent.
		TypeCurrentScriptKey()
		Return
	endIf
	if TableErrorEncountered(UnitMove_Start)
		return
	endIf
	SayUsingVoice(VCTX_message, cmsgBeginningOfTable, OT_JAWS_message)
	SetDocumentTableNavType(TABLE_NAV_TABLE_EXTENTS)
	FirstCell()
	return
EndIf
PerformScript FirstCellInTable()
EndScript

Script LastCellInTable()
If WindowCategoryIsWordDocument()
&& !IsReadOnlyVirtualMessage()
	if TableErrorEncountered(UnitMove_End)
		Return
	endIf
	SayUsingVoice(VCTX_message, cmsgEndOfTable, OT_JAWS_message)
	SetDocumentTableNavType(TABLE_NAV_TABLE_EXTENTS)
	LastCell()
	return
EndIf
PerformScript LastCellInTable()
EndScript

Script MoveToStartOfRow()
if !InTable()
&& GetCurrentScriptKeyName() == ks_Word_MoveToStartOfRow
	;Allowing Alt+Home to pass through means that
	;Calendar can navigate to start and end of week when not in tables
	SayCurrentScriptKeyLabel()
	TypeCurrentScriptKey()
	Return
endIf
If WindowCategoryIsWordDocument()
&& !IsReadOnlyVirtualMessage()
	if TableErrorEncountered(UnitMove_First)
		Return
	endIf
	SayUsingVoice(VCTX_message, cmsgStartOfRow, OT_JAWS_message)
	SetDocumentTableNavType(TABLE_NAV_ROW_EXTENTS)
	if !StartOfRow()
		SayUsingVoice(VCTX_message, cMsgStartOfRowFailed, OT_JAWS_message)
	EndIf
	return
EndIf
PerformScript MoveToStartOfRow()
EndScript

Script MoveToEndOfRow()
if !InTable()
&& GetCurrentScriptKeyName() == ks_Word_MoveToEndOfRow
	;Allowing Alt+Home to pass through means that
	;Calendar can navigate to start and end of week when not in tables
	SayCurrentScriptKeyLabel()
	TypeCurrentScriptKey()
	Return
endIf
If WindowCategoryIsWordDocument()
&& !IsReadOnlyVirtualMessage()
	if TableErrorEncountered(UnitMove_Last)
		Return
	endIf
	SayUsingVoice(VCTX_message, cmsgEndOfRow, OT_JAWS_message)
	SetDocumentTableNavType(TABLE_NAV_ROW_EXTENTS)
	if !EndOfRow()
		SayUsingVoice(VCTX_message, cMsgEndOfRowFailed, OT_JAWS_message)
	EndIf
	return
EndIf
PerformScript MoveToEndOfRow()
EndScript

Script MoveToTopOfColumn()
var string ScriptKeyName = GetCurrentScriptKeyName()
if (!InTable() || !GetFocus())
&& (ScriptKeyName == ks_Word_MoveToTopOfColumn || ScriptKeyName == ks_Word_MoveToTopOfColumn_Extended)
	;Allowing Alt+PageUp to pass through means that
	;Skype calls can be answered when not in tables
	SayCurrentScriptKeyLabel()
	TypeCurrentScriptKey()
	Return
endIf
If WindowCategoryIsWordDocument()
&& !IsReadOnlyVirtualMessage()
	if TableErrorEncountered(UnitMove_Top)
		return
	EndIf
	SayUsingVoice(VCTX_message, cmsgTopOfColumn, OT_JAWS_message)
	SetDocumentTableNavType(TABLE_NAV_COLUMN_EXTENTS)
	if !TopOfColumn()
		SayFormattedMessage(OT_error, cMsgTopOfColumnFailed, cMSGNotInTable_S) ; Could not move to Top of column
	EndIf
	return
EndIf
PerformScript MoveToTopOfColumn()
EndScript

Script MoveToBottomOfColumn()
var string ScriptKeyName = GetCurrentScriptKeyName()
if (!InTable() || !GetFocus())
&& (ScriptKeyName == ks_Word_MoveToBottomOfColumn || ScriptKeyName == ks_Word_MoveToBottomOfColumn_Extended)
	;Allowing Alt+PageDown to pass through means that
	;Skype calls can be terminated when not in tables
	SayCurrentScriptKeyLabel()
	TypeCurrentScriptKey()
	Return
endIf
If WindowCategoryIsWordDocument()
&& !IsReadOnlyVirtualMessage()
	if TableErrorEncountered(UnitMove_Bottom)
		return
	EndIf
	SayUsingVoice(VCTX_message, cmsgBottomOfColumn, OT_JAWS_message)
	SetDocumentTableNavType(TABLE_NAV_COLUMN_EXTENTS)
	if !BottomOfColumn()
		SayFormattedMessage(OT_error, cMsgBottomOfColumnFailed, cMSGNotInTable_s) ; Could not move to Bottom of column
	EndIf
	return
EndIf
PerformScript MoveToBottomOfColumn()
EndScript

Script SayCell()
if IsVirtualPcCursor()
	PerformScript SayCell()
	return
endIf
if !InTable()
	SayMessage(ot_error,cMSGNotInTable_L)
	return
endIf
if TestForEndOfCellOrRowMarker(true)
	return
EndIf
SayCellHeaders(OT_USER_REQUESTED_INFORMATION)
SayCell()
SayCellCoordinatesInfo()
EndScript

Script SayFirstCellInColumn()
EnsureNoUserBufferActive()
if WindowCategoryIsWordDocument()
	if InTable()
		var string sText = GetColumnText(cscNull,cscNull,msgBlankCell1_l,1,1)
		if !IsTableUniform()
		&& !sText
			sayMessage(ot_error,msgNonuniformTableFirstCellInColumnError)
		else
			Say(sText,ot_user_requested_information)
		EndIf
	Else
		sayMessage(ot_ERROR,cmsgNotInTable_l,cmsgNotInTable_s)
	EndIf
	return
EndIf
EndScript

Script SayFirstCellInRow()
EnsureNoUserBufferActive()
if WindowCategoryIsWordDocument()
	if InTable()
		Say(GetRowText(cscNull,cscNull,msgBlankCell1_l,1,1),ot_user_requested_information)
	Else
		sayMessage(ot_ERROR,cmsgNotInTable_l,cmsgNotInTable_s)
	EndIf
	return
EndIf
EndScript

void Function readTableRow()
say(GetRowText(),ot_line,true)
EndFunction

Script readCurrentRow()
EnsureNoUserBufferActive()
if !inTable()
	SayMessage(ot_error, cMSGNotInTable_L)
	return
endIf
readTableRow()
EndScript

script SayPriorRow()
if IsReadOnlyVirtualMessage()
	PerformScript SayPriorRow()
	Return
endIf
EnsureNoUserBufferActive()
if !InTable()
	SayMessage(ot_error, cMSGNotInTable_L)
	return
endIf
SetDocumentTableNavType(TABLE_NAV_SAY_ROW)
if !UpCell()
	SayFormattedMessage(ot_error,msgFirstRow)
	return
EndIf
EndScript

script SayNextRow()
if IsReadOnlyVirtualMessage()
	PerformScript SayNextRow()
	Return
endIf
EnsureNoUserBufferActive()
if !InTable()
	SayMessage(ot_error, cMSGNotInTable_L)
	return
endIf
SetDocumentTableNavType(TABLE_NAV_SAY_ROW)
if !DownCell()
	SayFormattedMessage(ot_error,msgLastRow)
	return
EndIf
EndScript

void Function readTableColumn()
say(GetColumnText(),ot_line,true)
EndFunction

Script ReadCurrentColumn()
EnsureNoUserBufferActive()
if !inTable()
	SayMessage(ot_error, cMSGNotInTable_L)
	return
endIf
if !IsTableUniform()
	sayMessage(ot_error,msgNonUniformTableColumnError_l,msgNonUniformTableColumnError_s)
	return
endIf
readTableColumn()
EndScript

script SayPriorColumn()
EnsureNoUserBufferActive()
if !InTable()
	SayMessage(ot_error, cMSGNotInTable_L)
	return
endIf
SetDocumentTableNavType(TABLE_NAV_SAY_COLUMN)
if !PriorCell()
	SayFormattedMessage(ot_error,msgFirstColumn)
	return
EndIf
if !IsTableUniform()
	sayMessage(ot_error,msgNonUniformTableColumnError_l,msgNonUniformTableColumnError_s)
	return
endIf
EndScript

script SayNextColumn()
EnsureNoUserBufferActive()
if !InTable()
	SayMessage(ot_error, cMSGNotInTable_L)
	return
endIf
SetDocumentTableNavType(TABLE_NAV_SAY_COLUMN)
if !NextCell()
	SayFormattedMessage(ot_error,msgLastColumn)
	return
EndIf
if !IsTableUniform()
	sayMessage(ot_error,msgNonUniformTableColumnError_l,msgNonUniformTableColumnError_s)
	return
EndIf
EndScript

Void Function sayColumnHeader()
SayColumnTitle()
EndFunction

Script sayColumnTitle()
EnsureNoUserBufferActive()
if InTable()
	sayColumnTitle()
else
	SayFormattedMessage(ot_error,cMSGNotInTable_L,cMSGNotInTable_S)
endIf
EndScript

Void Function sayRowHeader()
SayRowTitle()
EndFunction

Script sayRowTitle()
EnsureNoUserBufferActive()
if InTable()
	sayRowTitle()
else
	SayMessage(ot_error,cMSGNotInTable_L,cMSGNotInTable_S)
endIf
EndScript

string Function GetHeadingSoundFile(int iLevel)
Var
	string sHeadingKey,
	string sData1
sHeadingKey = IntToString(iLevel+WT_HTML_HEADING1-1)
smmGetBehavior(Section_smm_ControlType,sHeadingKey,sData1)
if StringContains(stringSegment(sData1,cScDoubleBackSlash ,-1),FileNameExt_Wav)
	return sData1
else
	return cscNull
EndIf
EndFunction

void Function SayCurrentHeading()
Var
	string sSoundFile,
	string sText,
	int iLevel
if !inTable()
&& !isFormField()
	sText = GetCurrentHeading()
	if sText
		iLevel = getCurrentHeadingLevel()
		sSoundFile = GetHeadingSoundFile(iLevel)
		if sSoundFile
			PlaySound(sSoundFile)
		else
			sText = FormatString(MsgHeadingLevel,IntToString(iLevel))+cscSpace+sText
		endIf
		sayMessage(ot_line, sText)
	endIf
endIf
EndFunction

void Function ReportHeadingsNotAvailable(optional int reason)
var
	string message_L,
	string message_S
If OutlookIsActive()
	message_L = msgNoOutlookMessageHeadings_l
	message_S = msgNoOutlookMessageHeadings_s
Else
	message_L = msgNoHeadings_l
	message_S = msgNoHeadings_s
EndIf
If (product_MAGic == GetRunningFSProducts())
	ExMessageBox(msgMagNoHeadings_L, SelectAHeadingDialogName, MB_OK)
	return
EndIf
SayMessage(OT_ERROR, message_L, message_S)
if shouldItemSpeak(OT_Error) == 1
	scheduleBrailleFlashMessageWithSpeechOutput(OT_ERROR, message_L, 8)
else
	scheduleBrailleFlashMessageWithSpeechOutput(OT_ERROR, message_S, 8)
endIf
EndFunction

int function SelectAHeadingDialog()
if !dlgListOfHeadings()
	ReportHeadingsNotAvailable(NotAvailableReason_NotFound)
EndIf
return true
EndFunction

Script ListHeadings()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException(true)
	return
EndIf
SelectAHeadingDialog()
EndScript

Script SayField()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
if IsActiveDocumentProtectedForm()
	performScript SayWindowPromptAndText()
elif GetSelectionContext() & SelCtxFields
	SayField()
endIf
EndScript

Script selectAField()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
ListFields()
EndScript

Script SelectNextOrPriorField()
SayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
;The SelectionChangedEvent will speak the new field,
;so the code which previously handled that functionality has been removed.
EndScript

Script listSpellingErrors()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
if !IsCheckSpellingAsYouTypeEnabled()
	SayFormattedMessage(ot_smart_help, msgCheckSpellingDisabled1) ; option to check spelling as you type is disabled
	return
EndIf
listSpellingErrors()
EndScript

Script listGrammaticalErrors()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
if !IsCheckGrammarAsYouTypeEnabled()
	SayFormattedMessage(ot_smart_help, msgCheckGrammarDisabled1)
	return
EndIf
listGrammaticalErrors()
EndScript

Script ListBookmarks()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
ListBookmarks()
EndScript

string function formatAnnotationOutput(string RefText, string text,string author, optional string dateTime)
var string result = RefText+cscBufferNewLine
result = result + text+cscBufferNewLine
if !stringIsBlank(author)
	result = result + formatString(msgAnnotationAuthor, author) + cscBufferNewLine
endIf
if !stringIsBlank(DateTime)
	result = result + formatString(msgAnnotationDateTime, DateTime) + cscBufferNewLine
endIf
return result
endFunction

void Function announceComment(int iOutputType)
var
	int index,
	int count = GetAnnotationCountAtCaret(),
	string output ,
	string MessageToFormat,
	String Text,
	string Author,
	string refText,
	string Desc,
	string DateTime
if !count && ! GetProofreadingElementInfo(peComment,Text,Author,refText,Desc,DateTime)
	ProcessMessage (msgNoComment1_L, cscNull, ot_error, cscNull, MB_OK|MB_ICONERROR)
	return
EndIf
count = count-1
for index=0 to count
	GetAnnotationAtCaret(index, refText, Author, Text, DateTime, Desc)
	;For the output for comments, we want the refText because it distinguishes between comments and replies wheras the  type does not.
	if NotesDetection() >= wdVerbosityHigh
		MessageToFormat = formatAnnotationOutput(refText, Text,Author,DateTime)
	else
		MessageToFormat = formatAnnotationOutput(refText, Text, Author)
	EndIf
	if ! stringIsBlank(MessageToFormat)
		output = output+cscBufferNewLine+MessageToFormat
	endIf
endFor
ProcessMessage(output, output, iOutputType, msgCommentMessageBoxTitle, MB_OK|MB_ICONASTERISK)
EndFunction

Script announceComment()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
if isSameScript()
	announceComment(ot_user_buffer)
	UserBufferAddText(cscBufferNewLine+FormatString(msgCommentDocumentText,GetSelectionCommentDocumentText(		)))
	UserBufferAddText(cscBufferNewLine+cmsgBuffExit)
else
	announceComment(ot_user_requested_information)
endIf
EndScript

script PostComment()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	Return
endIf
var
	String sText,
	string sAuthor,
	string sInitials,
	string sDesc,
	string sDate
if GetProofreadingElementInfo(peComment,sText,sAuthor,sInitials,sDesc,sDate)
	if NotesDetection() >= wdVerbosityHigh
		exMessageBox(FormatString(msgCommentWithDate_L,sText,sAuthor,sDate),
			msgCommentMessageBoxTitle, MB_OK|MB_ICONASTERISK)
	else
		exMessageBox(FormatString(msgComment1_L,sText,sAuthor),
			msgCommentMessageBoxTitle, MB_OK|MB_ICONASTERISK)
	EndIf
else
	exMessageBox(msgNoComment1_L, cscNull, MB_OK|MB_ICONERROR)
EndIf
endScript

Script listComments()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
listComments()
EndScript

void Function announceFootnoteOrEndNote(int iOutputType)
var
	String sText,
	string sAuthor,
	string sInitials,
	string sDesc,
	string sDate,
	string sMsg
if GetProofreadingElementInfo(peFootnote,sText,sAuthor,sInitials,sDesc,sDate)
	sMsg = formatString(msgFootnoteReference,sDesc,sText)
	ProcessMessage(sMsg,sMsg,iOutputType,msgFootnote,MB_OK|MB_ICONASTERISK)
Elif GetProofreadingElementInfo(peEndNote,sText,sAuthor,sInitials,sDesc,sDate)
	sMsg = formatString(msgEndNoteReference,sDesc,SText)
	ProcessMessage(sMsg,sMsg,iOutputType,msgEndnote,MB_OK|MB_ICONASTERISK)
Else
	ProcessMessage(msgNoFootnoteOrEndNote1_L,msgNoFootnoteOrEndNote1_L,ot_error,msgError,MB_OK|MB_ICONERROR)
EndIf
EndFunction

Script announceFootnoteOrEndNote()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
if isSameScript()
	announceFootnoteOrEndNote(ot_user_buffer)
	UserBufferAddText(cscBufferNewLine+cmsgBuffExit)
else
	announceFootnoteOrEndNote(ot_user_requested_information)
endIf
EndScript

Script ListFootnotes()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
ListFootnotes()
EndScript

Script ListEndnotes()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
ListEndnotes()
EndScript

int Function GetRevisionInfo(int iOutputType, string ByRef sRevInfo, string ByRef sRevText)
Var
	string sAuthor,
	String sInitials,
	string sDesc,
	string sDate
sRevInfo = cscNull
if !GetProofreadingElementInfo(peRevision,sRevText,sAuthor,sInitials,sDesc,sDate)
	return false
EndIf
if sRevText == cscSpace
	sRevText = cmsgSpace1
EndIf
if sDesc != cscNull
	sRevInfo=sDesc
else
	sRevInfo = GetRevisionTypeString(GetSelectionContextRevisionType())
endIf
sRevInfo = sRevInfo+cscSpace+FormatOutputMessage(iOutputType,false,
	msgRevAuthor_L, msgRevAuthor_s, sAuthor)
sRevInfo = sRevInfo+cscSpace+FormatOutputMessage(iOutputType,false,
	msgRevDate_L, msgRevDate_s, sDate)
return true
EndFunction

Script AnnounceRevision()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
var
	string sRevInfo,
	string sRevText,
	int bJAWSOnly =(getRunningFSProducts() == product_JAWS),
	int iOutputType
if !IsActiveDocumentTrackChangesEnabled()
	ProcessMessage(msgAnnounceRevisionError_l,msgAnnounceRevisionError_s, ot_error, msgError, MB_OK|MB_ICONERROR)
	return
EndIf
EnsureNoUserBufferActive()
if bJAWSOnly && isSameScript()
	iOutputType = ot_user_buffer
Else
	iOutputType = ot_user_requested_information
EndIf
if !GetRevisionInfo(iOutputType,sRevInfo,sRevText)
	ProcessMessage(msgNoRevision, null(), ot_error, msgError, MB_OK|MB_ICONERROR)
	return
EndIf
if iOutputType == ot_user_buffer
	SayFormattedMessage(iOutputType,
		sRevInfo+cscBufferNewLine+sRevText,
		sRevInfo+cscBufferNewLine+sRevText)
	UserBufferAddText(cscBufferNewLine+cmsgBuffExit)
else
	BeginFlashMessage()
	Say(sRevText,iOutputType,true)
	ProcessMessage(sRevInfo,sRevInfo, iOutputType, msgRevision, MB_OK|MB_ICONINFORMATION, vctx_message)
	EndFlashMessage()
endIf
EndScript

script postRevision()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
var
	string sRevInfo,
	string sRevText,
	int iOutputType
if !IsActiveDocumentTrackChangesEnabled()
	ProcessMessage(msgAnnounceRevisionError_l,msgAnnounceRevisionError_s, ot_error, msgError, MB_OK|MB_ICONERROR)
	return
EndIf
iOutputType = ot_user_buffer ; so MAGic always gets the text:
if !GetRevisionInfo(iOutputType,sRevInfo,sRevText)
	ProcessMessage(msgNoRevision, null(), ot_error, msgError, MB_OK|MB_ICONERROR)
	return
EndIf
ProcessMessage(sRevInfo+cscBufferNewLine+sRevText,sRevInfo+cscBufferNewLine+sRevText, ot_user_requested_information, msgRevision, MB_OK|MB_ICONINFORMATION, vctx_message)
endScript

Script listRevisions()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
if !IsActiveDocumentTrackChangesEnabled()
	SayFormattedMessage(ot_error,msgTrackChangesNotEnabled1)
	return
EndIf
listRevisions()
EndScript

Script RevisionDetectionToggle()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
var int iStatus = ShowRevisionsView()
if !iStatus
	if RevisionDetection() > 0
		setRevisionsManually(OFF)
		sayMessage(ot_status,msgRevisionDetectionOff_l,msgRevisionDetectionOff_s)
	else
		sayMessage(ot_error,msgRevisionDetectionAlreadyOff)
	endIf
else
	if !RevisionDetection() then ; return to default revision detection setting.
		setRevisionsManually(ON)
		sayMessage(ot_status,msgRevisionDetectionDefault_l,msgRevisionDetectionDefault_s)
	else ;Revision detection is already on.
		sayMessage(ot_error,formatString(msgRevisionDetectionAlreadyOn,toggleRevisionDetection(TRUE)))
	endIf
endIf
EndScript

script ToggleTrackChanges()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
SayCurrentScriptKeyLabel()
TypeKey(ksToggleTrackChanges)
Pause()
if IsActiveDocumentTrackChangesEnabled()
	SayMessage(ot_help, msgTrackChangesOn_l, msgTrackChangesOn_S)
else
	SayMessage(ot_help, msgTrackChangesOff_l, msgTrackChangesOff_S)
EndIf
Refresh() ; Force FSDomNodeMSWord.dll to be reloaded so that the track changes state change is detected without a focus change.
EndScript

Script listObjects()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
listObjects()
EndScript

void Function SayFontSize()
SayFormattedMessageWithVoice(vctx_message,ot_status,GetFontSizeString(),GetFontSizeString())
EndFunction

script GrowFont1Point()
if QuickNavKeyTrapping()
	return
EndIf
TypeKey(ksGrowFont1Point) ; ControlRightBracket in English
SayFontSize()
EndScript

script ShrinkFont1Point()
if QuickNavKeyTrapping()
	return
EndIf
TypeKey(ksShrinkFont1Point) ; ControlLeftBracket in English
SayFontSize()
EndScript

script GrowFont()
if QuickNavKeyTrapping()
	return
EndIf
TypeKey(ksGrowFont) ; ControlShiftPeriod in English
SayFontSize()
EndScript

script ShrinkFont()
if QuickNavKeyTrapping()
	return
EndIf
TypeKey(ksShrinkFont) ; ControlShiftComma in English
SayFontSize()
EndScript

Script sayFont()
sayFont()
EndScript

Script describeBorderOfTextUnit()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
describeBorderOfTextUnit()
EndScript

Script sayLineAndColumn()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
SayLineAndColumn()
EndScript

Script InsertComment()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
Var
	int index,
	string sAuthor,
	string sInitials
TypeKey(GetScriptKeyName("InsertComment"))
GetCommentInfo(index,sAuthor,sInitials)
if sAuthor!=cscNull
	SayUsingVoice(vctx_message,
		FormatString(msgInsertingComment,IntToString(index),sAuthor,sInitials),
		ot_help)
endIf
EndScript

Script toggleBetweenAllAndHeadingsOnly()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
if isOutlineViewActive()
	TypeKey(ksToggleBetweenAllAndHeadingsOnly) ; AltShiftA in English
	pause()
	var string sLevel = GetVisibleHeadingLevelString()
	if sLevel
		SayUsingVoice(vctx_message,
			FormatString(msgHeadingsOnly1_L,sLevel),
			ot_status)
	EndIf
Else
	; not in outline view.
	SayFormattedMessageWithVoice(vctx_message,ot_error,msgNotINOutlineView,msgNotInOutlineView)
endIf
EndScript

Script showHeading1()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
if isOutlineViewActive()
	TypeKey(ksShowHeading1) ; AltShift1 in English)
	pause()
	SayFormattedMessageWithVoice(vctx_message,ot_status,
		GetOutlineViewStatusMessage(ot_status))
Else
	SayFormattedMessageWithVoice(vctx_message,ot_error,
		msgNotINOutlineView,msgNotInOutlineView)
endIf
EndScript

Script showHeading2()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
if isOutlineViewActive()
	TypeKey(ksShowHeading2) ; AltShift2 in English)
	pause()
	SayFormattedMessageWithVoice(vctx_message,ot_status,
		GetOutlineViewStatusMessage(ot_status))
Else
	SayFormattedMessageWithVoice(vctx_message,ot_error,
		msgNotINOutlineView,msgNotInOutlineView)
endIf
EndScript

Script showHeading3()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException(true)
	return
EndIf
if isOutlineViewActive()
	TypeKey(ksShowHeading3) ; AltShift3 in English)
	pause()
	SayFormattedMessageWithVoice(vctx_message,ot_status,
		GetOutlineViewStatusMessage(ot_status))
Else
	SayFormattedMessageWithVoice(vctx_message,ot_error,
		msgNotINOutlineView,msgNotInOutlineView)
endIf
EndScript

Script showHeading4()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException(true)
	return
EndIf
if isOutlineViewActive()
	TypeKey(ksShowHeading4) ; AltShift4 in English)
	pause()
	SayFormattedMessageWithVoice(vctx_message,ot_status,
		GetOutlineViewStatusMessage(ot_status))
Else
	SayFormattedMessageWithVoice(vctx_message,ot_error,
		msgNotINOutlineView,msgNotInOutlineView)
endIf
EndScript

Script showHeading5()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
if isOutlineViewActive()
	TypeKey(ksShowHeading5) ; AltShift5 in English)
	pause()
	SayFormattedMessageWithVoice(vctx_message,ot_status,
		GetOutlineViewStatusMessage(ot_status))
Else
	SayFormattedMessageWithVoice(vctx_message,ot_error,
		msgNotINOutlineView,msgNotInOutlineView)
endIf
EndScript

Script showHeading6()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
if isOutlineViewActive()
	TypeKey(ksShowHeading6) ; AltShift6 in English)
	pause()
	SayFormattedMessageWithVoice(vctx_message,ot_status,
		GetOutlineViewStatusMessage(ot_status))
Else
	SayFormattedMessageWithVoice(vctx_message,ot_error,
		msgNotINOutlineView,msgNotInOutlineView)
endIf
EndScript

Script showHeading7()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
if isOutlineViewActive()
	TypeKey(ksShowHeading7) ; AltShift7 in English)
	pause()
	SayFormattedMessageWithVoice(vctx_message,ot_status,
		GetOutlineViewStatusMessage(ot_status))
Else
	SayFormattedMessageWithVoice(vctx_message,ot_error,
		msgNotINOutlineView,msgNotInOutlineView)
endIf
EndScript

Script showHeading8()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
if isOutlineViewActive()
	TypeKey(ksShowHeading8) ; AltShift8 in English)
	pause()
	SayFormattedMessageWithVoice(vctx_message,ot_status,
		GetOutlineViewStatusMessage(ot_status))
Else
	SayFormattedMessageWithVoice(vctx_message,ot_error,
		msgNotINOutlineView,msgNotInOutlineView)
endIf
EndScript

Script showHeading9()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
if isOutlineViewActive()
	TypeKey(ksShowHeading9) ; AltShift9 in English)
	pause()
	SayFormattedMessageWithVoice(vctx_message,ot_status,
		GetOutlineViewStatusMessage(ot_status))
Else
	SayFormattedMessageWithVoice(vctx_message,ot_error,
		msgNotINOutlineView,msgNotInOutlineView)
endIf
EndScript

Script selectNextHeadingOrListLevelStyle()
if !isPcCursor()
	performScript mouseRight()
	return
EndIf
if QuickNavKeyTrapping()
	return
EndIf
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
TypeKey(ksSelectNextHeadingOrListLevelStyle) ; AltShiftRightArrow in English
pause()
sayStyleAtCursor()
EndScript

Script selectPriorHeadingOrListLevelStyle()
if !isPcCursor()
	performScript mouseLeft()
	return
EndIf
if QuickNavKeyTrapping()
	return
EndIf
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
TypeKey(ksSelectPriorHeadingOrListLevelStyle) ; AltShiftLeftArrow in English
pause()
sayStyleAtCursor()
EndScript

Script MoveItemDown()
if !isPcCursor()
	performScript mouseDown()
	return
EndIf
if QuickNavKeyTrapping()
	return
EndIf
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
TypeKey(ksMoveHeadingDown) ; AltShiftDownArrow in English
pause()
sayFormattedMessageWithVoice(VCTX_message,ot_status,
	msgMoveItemDown_L, msgMoveItemDown_S)
EndScript

Script MoveItemUp()
if !isPcCursor()
	performScript mouseUp()
	return
EndIf
if QuickNavKeyTrapping()
	return
EndIf
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
TypeKey(ksMoveHeadingUp) ; AltShiftUpArrow in English
pause()
sayFormattedMessageWithVoice(VCTX_message,ot_status,
	msgMoveItemUp_L, msgMoveItemUp_S)
EndScript

void Function sayHorizontalPosition()
if WindowCategoryIsWordDocument()
&& isPcCursor()
	var string sCursorHorizPos = GetCursorColString(GetActiveCursor(),getDesiredUnitsOfMeasure())
	SayFormattedMessageWithVoice(vctx_message,ot_status,
		formatString(msgFromLeft1_L,sCursorHorizPos),
		formatString(msgFromLeft1_S,sCursorHorizPos))
endIf
EndFunction

script indent()
if QuickNavKeyTrapping()
	return
EndIf
TypeKey(ksIndent) ; CtrlM in English
if isPCCursor()
&& !UserBufferIsActive()
&& WindowCategoryIsWordDocument()
	SayFormattedMessageWithVoice(vctx_message,ot_status,msgIndent1_L,msgIndent1_S)
	delay(1)
	sayHorizontalPosition()
endIf
EndScript

Script outdent()
if !WindowCategoryIsWordDocument()
|| IsReadOnlyMessage()
	SayCurrentScriptKeyLabel()
	typeCurrentScriptKey()
	return
elif QuickNavKeyTrapping()
	return
EndIf
typeCurrentScriptKey()
if IsPCCursor()
&& !UserBufferIsActive()
&& WindowCategoryIsWordDocument()
	SayFormattedMessageWithVoice(vctx_message,ot_status,msgOutDent1_L,msgOutdent1_S)
	delay(1)
	sayHorizontalPosition()
endIf
EndScript

void Function sayHangingIndent()
if WindowCategoryIsWordDocument()
&& isPcCursor()
	var string sIndent = GetCursorPosString(GetActiveCursor(),smmGetDesiredUnitsOfMeasure())
	SayFormattedMessageWithVoice(vctx_message,ot_status,formatString(msgFromLeft1_L,sIndent), formatString(msgFromLeft1_S,sIndent))
endIf
EndFunction

Script hangingIndent()
if QuickNavKeyTrapping()
	return
EndIf
TypeKey(ksHangingIndent)
if isPCCursor()
&& !UserBufferIsActive()
&& WindowCategoryIsWordDocument()
	SayFormattedMessageWithVoice(vctx_message,ot_status,msgHangingIndent1_L,msgHangingIndent1_S)
	delay(1)
	sayHorizontalPosition()
endIf
EndScript

Script removeHangingIndent()
if QuickNavKeyTrapping()
	return
EndIf
TypeKey(ksRemoveHangingIndent)
if isPCCursor()
&& !UserBufferIsActive()
&& WindowCategoryIsWordDocument()
	SayFormattedMessageWithVoice(vctx_message,ot_status,msgRemoveHangingIndent1_L,msgRemoveHangingIndent1_S)
	delay(1)
	sayHorizontalPosition()
endIf
EndScript

int Function isFormatForFindAndReplaceDlg(string sFormatOff, string sFormatOn,string sMsgOff,string sMsgOn)
If DialogActive()
&& globalRealWindowName==wn_FindAndReplace
	Var string sObjName
	SaveCursor()
	InvisibleCursor()
	If FindString(GetCurrentWindow(),sc_Format,s_top,s_unrestricted)
		NextChunk()
		sObjName=GetObjectName()
		If stringContains(sObjName,sFormatOff)
			SayFormattedMessageWithVoice(vctx_message,ot_status,sMsgOff,cMsgSilent)
		elIf StringContains(sObjName,sFormatOn)
			SayFormattedMessageWithVoice(vctx_message,ot_status,sMsgOn,cMsgSilent)
		EndIf
		RestoreCursor()
		Return true
	EndIf
	SayFormattedMessageWithVoice(vctx_message,ot_status,msgNotFormatted,cMsgSilent)
	RestoreCursor()
	return true
EndIf
return false
EndFunction

int function IsNotificationPossible()
return IsWindows10()
	&& GetJCFOption(OPT_ENABLE_ACCESSIBLE_NOTIFICATION_EVENTS)
endFunction

Script BoldText()
if QuickNavKeyTrapping()
	return
EndIf
if IsDocumentAreaScriptException()
	return
EndIf
TypeKey(ksBold) ; Ctrl+b in English
if !getRunningFSProducts() & product_JAWS
	return sayCurrentScriptKeyLabel()
endIf
if IsNotificationPossible()
&& !OutlookIsActive()
	return
EndIf
pause()
If IsFormatForFindAndReplaceDlg(sc_NotBold,sc_bold,msgBoldOff1_l,msgBoldOn1_l)
	return
EndIf
if fontIsBold()
	SayFormattedMessageWithVoice(vctx_message,ot_status,msgBoldOn1_L,cmsgOn)
else
	SayFormattedMessageWithVoice(vctx_message,ot_status,msgBoldOff1_L,cmsgOff)
endIf
if !isSelectionModeActive()
&& IsExtendedSelectionModeWatchActive()
	SayFormattedMessageWithVoice(vctx_message,ot_status,msgSelectionModeOff1_L,msgSelectionModeOff1_L)
	StopExtendedSelectionModeWatch()
endIf
EndScript

Script ItalicText()
if QuickNavKeyTrapping()
	return
EndIf
if IsDocumentAreaScriptException()
	return
EndIf
TypeKey(ksItalic) ; Ctrl+i in English
if ! getRunningFSProducts() & product_JAWS
	return sayCurrentScriptKeyLabel()
endIf
if IsNotificationPossible()
&& !OutlookIsActive()
	return
EndIf
pause()
If IsFormatForFindAndReplaceDlg(sc_NotItalic,sc_italic,msgItalicOff1_l,msgItalicOn1_l)
	return
EndIf
if fontIsItalic()
	SayFormattedMessageWithVoice(vctx_message,ot_status,msgItalicOn1_L,cmsgOn)
else
	SayFormattedMessageWithVoice(vctx_message,ot_status,msgItalicOff1_L,cmsgOff)
endIf
if !isSelectionModeActive()
&& IsExtendedSelectionModeWatchActive()
	SayFormattedMessageWithVoice(vctx_message,ot_status,msgSelectionModeOff1_L,msgSelectionModeOff1_L)
	StopExtendedSelectionModeWatch()
endIf
EndScript

Script UnderlineText()
if QuickNavKeyTrapping()
	return
EndIf
if IsDocumentAreaScriptException()
	return
EndIf
TypeKey(ksUnderline) ; Ctrl+u in English
if ! getRunningFSProducts() & product_JAWS
	return sayCurrentScriptKeyLabel()
endIf
if IsNotificationPossible()
&& !OutlookIsActive()
	return
EndIf
pause()
If IsFormatForFindAndReplaceDlg(sc_NoUnderline,sc_underline,msgUnderlineOff1_l,msgUnderlineOn1_l)
	return
EndIf
if fontIsUnderlined()
	SayFormattedMessageWithVoice(vctx_message,ot_status,msgUnderlineOn1_L,cmsgOn)
else
	SayFormattedMessageWithVoice(vctx_message,ot_status,msgUnderlineOff1_L,cmsgOff)
endIf
if !isSelectionModeActive()
&& IsExtendedSelectionModeWatchActive()
	SayFormattedMessageWithVoice(vctx_message,ot_status,msgSelectionModeOff1_L,msgSelectionModeOff1_L)
	StopExtendedSelectionModeWatch()
endIf
EndScript

Script LeftJustify()
if QuickNavKeyTrapping()
	return
EndIf
if IsDocumentAreaScriptException()
	return
EndIf
TypeCurrentScriptKey() ; Ctrll in English
if ! getRunningFSProducts() & product_JAWS
	return sayCurrentScriptKeyLabel()
endIf
Pause()
BrailleRefresh()
SayParagraphAlignment(vctx_message,ot_status)
EndScript

Script  CenterText()
if QuickNavKeyTrapping()
	return
EndIf
if IsDocumentAreaScriptException()
	return
EndIf
TypeCurrentScriptKey() ; CtrlE in English.
if ! getRunningFSProducts() & product_JAWS
	return sayCurrentScriptKeyLabel()
endIf
Pause()
BrailleRefresh()
SayParagraphAlignment(vctx_message,ot_status)
EndScript

Script RightJustify()
if IsReadOnlyVirtualMessage()
	;This block should theoretically never be executed, since script ReplyOrRightJustify in Outlook should have pre-empted it.
	if ksRightJustify == ksReply
		TypeKey(ksReply) ; CtrlR in English
	EndIf
	return
elif QuickNavKeyTrapping()
|| UserBufferIsActive()
	return
EndIf
if IsDocumentAreaScriptException()
	return
EndIf
TypeCurrentScriptKey() ; CtrlR in English
if ! getRunningFSProducts() & product_JAWS
	return sayCurrentScriptKeyLabel()
endIf
Pause()
BrailleRefresh()
SayParagraphAlignment(vctx_message,ot_status)
EndScript

Script  JustifyText()
if QuickNavKeyTrapping()
	return
EndIf
if IsDocumentAreaScriptException()
	return
EndIf
TypeCurrentScriptKey() ; CtrlJ in English
if ! getRunningFSProducts() & product_JAWS
	return sayCurrentScriptKeyLabel()
endIf
Pause()
BrailleRefresh()
SayParagraphAlignment(vctx_message,ot_status)
EndScript

Script convertShapesToInline()
if QuickNavKeyTrapping()
	return
EndIf
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
convertShapesToInline()
EndScript

Script GoBack()
if c_WordFocus.windowCategory == wCat_document
&& HasNavigatedForwardInCurrentDocument()
	TrackLinkNavigation(MOVE_BACK)
	TypeKey(ksGoBack)
	SayFormattedMessageWithVoice(vctx_message,ot_help,msgReturnToTOC_l,msgReturnToTOC_s)
	if BrailleInUse()
		BrailleClearMessage()
	EndIf
	SayLine()
	return
EndIf
SayCurrentScriptKeyLabel()
TypeKey(ksGoBack)
EndScript

Script GoForward()
if c_WordFocus.windowCategory == wCat_document
&& HasNavigatedForwardInCurrentDocument()
&& IsHyperlinkField()
	;Enter must have been used at least once in a document
	;to navigate forward before the Alt+Right is allowed to move forward:
	TrackLinkNavigation(MOVE_FORWARD)
	TypeKey(ksGoForward)
	SayFormattedMessageWithVoice(vctx_message,ot_help,msgForwardFromTOC_l,msgForwardFromTOC_s)
	if BrailleInUse()
		BrailleClearMessage()
	EndIf
	SayLine()
	return
EndIf
SayCurrentScriptKeyLabel()
TypeKey(ksGoForward)
EndScript

void Function ReportLinksNotAvailable(optional int reason)
If product_MAGic == GetRunningFSProducts()
	ExMessageBox(cmsgMagNoLinks_L, SelectALinkDialogName, MB_OK)
	return
EndIf
sayFormattedMessage(ot_error, cmsgNoLinks + cscSpace + msgCheckForLinkFields)
scheduleBrailleFlashMessageWithSpeechOutput(ot_error, cmsgNoLinks + cscSpace + msgCheckForLinkFields, 8, True)
EndFunction

int function SelectALinkDialog()
If UserBufferIsActive()
	default::SelectALinkDialog() ; default behaviors in userBuffer.
	return true
endIf
if InHJDialog()
	SayFormattedMessage(OT_error, cMSG337_L, cMSG337_S)
	return true
endIf
If !(DialogActive() || GetMenuMode())
&& c_WordFocus.WindowClass == wc_WordMainDocumentWindow
	If !dlgListOfLinks()
		ReportLinksNotAvailable(NotAvailableReason_NotFound)
	EndIf
	return true
EndIf
return false
EndFunction

void function ReadSpellCheckInfo(optional int bAcknowledgeSuggestions)
var
	object oWindow,
	object oItem,
	string sItemPrompt,
	string sItemText,
	string sListName,
	string sListValue,
	int bSpellText,
	handle hFocus = getFocus(),
	handle hReal = getRealWindow(hFocus),
	string sBrlMSG,
	int savedUseSDMOption
;obtained using iAccessible methods:
oWindow = GetUIAObjectTree(hReal)
if !oWindow return endIf
oItem = oWindow.FindByRole(ROLE_SYSTEM_TEXT)
sItemPrompt = oItem.name
sItemText = oItem.Value
bSpellText = TRUE
sayMessage(OT_CONTROL_NAME, sItemPrompt)
sayMessage(OT_DIALOG_TEXT, sItemText)
if bSpellText
	spellString(sItemText)
endIf
sBrlMSG = sItemPrompt + cscSpace + sItemText
;now for the suggestions list:
;Neither UIA nor iAccessible interface reliably gets grammatical error suggestions,
;so we will use SDM to get the suggestion:
savedUseSDMOption = GetJCFOption(OPT_USE_SDM_API)
SetJCFOption(OPT_USE_SDM_API,1)
sListName = SDMGetControlName(hReal,cID_O365_SuggestionListPrompt )
sListValue = SDMGetControlActiveItem(hReal,cID_O365_SpellingSuggestionsList)
if !sListValue
	sListValue = SDMGetControlActiveItem(getRealWindow(GetFocus()),cID_O365_GrammarSuggestionsList)
endIf
SetJCFOption(OPT_USE_SDM_API,savedUseSDMOption)
if stringIsBlank(sListValue)
|| sListValue == noSelectedItem
	;SDM failed to get suggestions, try UIA
	var
		object oUIA = CreateObjectEx("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" ),
		object treewalker = CreateUIARawViewTreeWalker(TRUE),
		object oListTypeCondition = oUIA.createIntPropertyCondition(UIA_ControlTypePropertyId, UIA_ListControlTypeId),
		object oSuggestionList,
		object oValuePattern
	if !treewalker
	|| !oListTypeCondition
		return
	endIf
	treeWalker.currentElement = FSUIAGetFocusedElement()
	while treewalker.currentElement.controlType != UIA_WindowControlTypeId
	&& UIAGetParent (treewalker.currentElement)
		treewalker.gotoParent()
	endWhile
	oSuggestionList = treewalker.currentElement.findFirst(TreeScope_Descendants, oListTypeCondition)
	oValuePattern = oSuggestionList.getValuePattern()
	sListValue = oValuePattern.value
endIf
if stringIsBlank(sListValue)
	;UIA also failed to get suggestions
  if bAcknowledgeSuggestions
		SayMessage(ot_error,msgSuggestionsListNotAvailable_L,msgSuggestionsListNotAvailable_S)
	else
		SayMessage(ot_error,msgNoSpellingSuggestions1_L,msgNoSuggestions1_L)
	endIf
	sBrlMSG = sBrlMSG + msgNoSuggestions1_L
	BrailleMessage(sBrlMSG)
	return
endIf
if stringContains(sListValue, scNoSelectedItem)
	sListValue = msgNoSpellingSuggestions1_L
	bSpellText = OFF
endIf
indicateControlType(wt_ListBox, sListName, sListValue)
if bSpellText
	spellString(sListValue)
endIf
sBrlMSG = sBrlMSG + cscSpace + sListName + cscSpace + sListValue
BrailleMessage(sBrlMSG)
endFunction

void function ReadSpellCheckInfoUIA(optional int bAcknowledgeSuggestions)
; uses older AccessibleTreeBuilder to manage Word 2013 and versions of Word 2016 without suggestions as split buttons.
var
	int bGrammarError,
	int bContainsSuggestion,
	int bFocusInSuggestionList, ; for user tabs to suggestion list and press insert+f7
	object oFocus = GetUIAObjectFocusItem(),
	object oParent = oFocus.parent,
	object oSuggestionList = oParent.FindByRole(ROLE_SYSTEM_LIST),
	object oGrammarSuggestion,
	int bSpellText,
	string sText,
	string sPrompt,
	string sSuggestion,
	string sExtraGrammarInfo,
	string sBrlMSG,
	string sTmp
if ReadProofingPaneWithSplitButtons() return endIf
if oFocus.Role == ROLE_SYSTEM_LISTITEM
	oSuggestionList = oFocus.parent
	oParent = oSuggestionList.parent
	bFocusInSuggestionList = TRUE
endIf
if !bFocusInSuggestionList&& ! oSuggestionList.FindByState(STATE_SYSTEM_SELECTED)
	bGrammarError = TRUE
else
	if bFocusInSuggestionList
		sSuggestion = oFocus.name
	else
		sSuggestion = oSuggestionList.FindByState(STATE_SYSTEM_SELECTED).name
	endIf
endIf
oGrammarSuggestion = oSuggestionList.NextSibling
while oGrammarSuggestion && oGrammarSuggestion.role != ROLE_SYSTEM_STATICTEXT
	; for those cases where buttons appear before the grammar label
	oGrammarSuggestion = oGrammarSuggestion.NextSibling
endWhile
sTmp = oGrammarSuggestion.name
;Pick up the extra grammar text,
;e.g. explanation of grammar rules:
oGrammarSuggestion = oGrammarSuggestion.NextSibling
while oGrammarSuggestion && oGrammarSuggestion.role == ROLE_SYSTEM_STATICTEXT
	sTmp = oGrammarSuggestion.name
	if !stringIsBlank(sExtraGrammarInfo)
	&& !stringIsBlank(sTmp)
		sExtraGrammarInfo = sExtraGrammarInfo + cscSpace
	endIf
	sExtraGrammarInfo = sExtraGrammarInfo + sTmp
	oGrammarSuggestion = oGrammarSuggestion.NextSibling
endWhile
sPrompt = oParent.name
sText = oParent.FirstChild.Name
sBrlMSG = sBrlMSG + sPrompt
bContainsSuggestion = ! stringIsBlank(sSuggestion)
if bGrammarError
	if bContainsSuggestion
		sPrompt = msgSuggestion
		sayMessage(OT_CONTROL_NAME, sPrompt)
		sBrlMSG = sBrlMSG + cscSpace + sPrompt
	else
		sayMessage(OT_CONTROL_NAME, sSuggestion)
		sayMessage(OT_LINE, sText)
		spellString(sText)
		sBrlMSG = sBrlMSG + cscSpace + sText
	endIf
	if !bContainsSuggestion
		if bAcknowledgeSuggestions
			sayMessage(OT_ERROR, msgNoSpellingSuggestions1_L)
		endIf
		sBrlMSG = sBrlMSG + cscSpace + msgNoSpellingSuggestions1_L
	else
		sayMessage(OT_CONTROL_NAME, sSuggestion)
		sayMessage(OT_LINE, sText)
		spellString(sText)
		sBrlMSG = sBrlMSG + cscSpace + sText
	endIf
else
	sayMessage(OT_CONTROL_NAME, sPrompt)
	sBrlMSG = sPrompt
	sayMessage(OT_LINE, sText)
	spellString(sText)
	sBrlMSG = sBrlMSG + cscSpace + sText
	sPrompt = msgSuggestion
	if stringIsBlank(sSuggestion)
		if bAcknowledgeSuggestions
			sayMessage(OT_ERROR, msgNoSpellingSuggestions1_L)
		endIf
		sBrlMSG = sBrlMSG + cscSpace + msgNoSpellingSuggestions1_L
	else
		sayMessage(OT_CONTROL_NAME, sPrompt)
		sBrlMSG = sBrlMSG + cscSpace + sPrompt
		sayMessage(OT_LINE, sSuggestion)
		spellString(sSuggestion)
		sBrlMSG = sBrlMSG + cscSpace + sSuggestion
	endIf
endIf
if !stringIsBlank(sExtraGrammarInfo)
	if getRunningFSProducts() & PRODUCT_MAGic
		; do not virtualize, causes crashes:
		sayMessage(OT_HELP, sExtraGrammarInfo)
		sBrlMSG = sBrlMSG + cscSpace + sExtraGrammarInfo
	else
		sayMessage(OT_HELP, msgReasonTextAvailable)
		sBrlMSG = sBrlMSG + cscSpace + msgReasonTextAvailable
		UserBufferClear()
		UserBufferDeactivate()
		UserBufferAddText(sExtraGrammarInfo+cscBufferNewLine+cMsgBuffExit)
		UserBufferActivate()
		if UserBufferIsActive()
			JAWSTopOfFile()
			SayLine()
		endIf
	endIf
endIf
if !stringIsBlank(sBrlMSG)
	BrailleMessage(sBrlMSG)
endIf
endFunction

int Function ReadMicrosoftEditorSuggestion(optional object oElement)
if !c_WordFocus.InMicrosoftEditorProofingPaneIssueChecker return false endIf
var
	int iIndicateTypeAndPosition = false,
	int iIndicateSuggestion = true
if !oElement
	oElement = FSUIAGetFocusedElement ()
	iIndicateTypeAndPosition = true
	iIndicateSuggestion = false
endIf
if oElement.controlType != UIA_SplitButtonControlTypeId
|| !StringStartsWith (oElement.AutomationID, "SplitButton_", true)
	return false
endIf
var
	object oPane = FSUIAGetAncestorOfControlType (oElement, UIA_PaneControlTypeID),
	object oIssueTypeCondition = FSUIACreateStringPropertyCondition (UIA_AutomationIDPropertyID, "DrillInPane_Title"),
	string sIssueType = oPane.findFirst(TreeScope_Children, oIssueTypeCondition).name,
	string sText
if StringIsBlank (sIssueType) return false endIf
if iIndicateSuggestion
	Say(msgSuggestion, OT_LINE)
endIf
if sIssueType == wn_Proofing_Pane_Spelling
	var string sSuggestion = StringSegment (oElement.name, ",", 1)
	sText = StringSegmentRemove(oElement.name, ",", 1)
	sText = StringSegmentRemove(sText, ",", 1)
	Say (sSuggestion, OT_LINE)
	SpellString (sSuggestion)
else
	sText = oElement.name
endIf
if iIndicateTypeAndPosition
	IndicateControlType (WT_SPLITBUTTON, sText)
	Say(PositionInGroup (), OT_POSITION)
else
	Say(sText, OT_LINE)
endIf
return true
EndFunction

int function ReadMicrosoftEditorIssueCheckerInfo(optional int bAcknowledgeSuggestions, int includeContainerName)
if !c_WordFocus.InMicrosoftEditorProofingPaneIssueChecker return false endIf
var object oPane = FSUIAGetParentOfElement (FSUIAGetFocusedElement ())
if oPane.controlType != UIA_PaneControlTypeId
	;Some focusable elements in the issue checker are children of a pane.
	;Others are grandchildren.
	;Move up one more time and then check again.
	oPane = FSUIAGetParentOfElement (oPane)
endIf
if oPane.controlType != UIA_PaneControlTypeId
	;Not in O365 spell check
	return false
endIf
var
	object oGroupCondition = FSUIACreateIntPropertyCondition (UIA_ControlTypePropertyID, UIA_GroupControlTypeID),
	object oIssueTypeCondition = FSUIACreateStringPropertyCondition (UIA_AutomationIDPropertyID, "DrillInPane_Title"),
	object oGroup = oPane.findFirst(TreeScope_Children, oGroupCondition),
	object oElement = FSUIAGetFirstChildOfElement (oGroup),
	string sIssueType = oPane.findFirst(TreeScope_Children, oIssueTypeCondition).name
if StringIsBlank(sIssueType) return false endIf
if includeContainerName
	Say (oGroup.name, OT_LINE)
endIf
if sIssueType == wn_Proofing_Pane_Spelling
	var string sMisspelled = StringTrimLeadingBlanks (StringSegment (oElement.name, ",", 2))
	Say (sMisspelled, OT_LINE)
	SpellString (sMisspelled)
	oElement = FSUIAGetFirstChildOfElement (oElement)
	Say (oElement.name, OT_LINE);word in context
else
	;Grammatical error or other refinement
	Say (oElement.name, OT_LINE)
endIf
if bAcknowledgeSuggestions
	Delay (5, false)
	var object oSuggestionsCondition = FSUIACreateStringPropertyCondition (UIA_AutomationIDPropertyID, "SplitButton_", PropertyConditionFlags_MatchSubstring)
	oSuggestionSplitButton = oPane.findFirst(TreeScope_Descendants, oSuggestionsCondition)
	if GetObjectTypeCode() == WT_STATIC
		;Focus is on the text element containing the misspelled word.
		;Read the first suggestion, as enter has been scripted to invoke it.
		if !ReadMicrosoftEditorSuggestion(oSuggestionSplitButton)
			Say(msgNoSuggestions1_L, OT_ERROR)
		endIf
	else
		;Focus is not on the text element containing the misspelled word.
		;Just announce the number of suggestions.
		if oSuggestionSplitButton.sizeOfSet
			SayFormattedMessage (OT_LINE, msgSuggestions, msgSuggestions, oSuggestionSplitButton.sizeOfSet)
		else
			Say(msgNoSuggestions1_L, OT_ERROR)
		endIf
		endIf
endIf
return true
EndFunction

script ReadMistakeAndSuggestion()
if SelectALinkDialog()
	return
endIf
if ReadMicrosoftEditorIssueCheckerInfo(true, true)
	return
endIf
if c_WordFocus.windowCategory== WCAT_TASK_PANE
	if c_WordFocus.InProofingPaneSpellCheck
	|| c_WordFocus.OutlookIsActive
		ReadSpellCheckInfoUIA(TRUE)
		return
	endIf
	sayMessage(ot_error,msgTaskPaneLinkError_l,msgTaskpaneLinkError_s)
	return
elIf c_WordFocus.InProofingPaneSpellCheck
	ReadSpellCheckInfo(TRUE)
	return
EndIf
sayMessage(ot_error,msgNotInSpellChecker)
endScript

Script SelectALink()
; We want insert f7 to repeat the Spellcheck functionality in case the Reason text is being read.
if UserBufferIsActive() && !(getRunningFSProducts() & PRODUCT_MAGic)
	if c_WordFocus.InProofingPaneSpellCheck
		ReadProofingPaneWithSplitButtons()
		return
	endIf
endIf
performScript SelectALink()
endScript

Script sayLanguageInUse()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
sayLanguageInUse()
endScript

Script FocusToFirstFormField()
EnsureNoUserBufferActive()
if IsDocumentAreaScriptException()
	return
EndIf
focusToFirstFormField()
EndScript

Script ShowItemsInVirtualViewer()
EnsureNoUserBufferActive(false)
if IsDocumentAreaScriptException()
	return
EndIf
var
	string sList,
	string sItem,
	int iCount,
	int iType,
	int iChoice
sList = stringChopLeft(ListItemsToDisplay,1)
iChoice = DlgSelectItemInList(sList,msgListOfItemsToDisplayInVV, false)
sItem = stringSegment(sList,cscListSeparator ,iChoice)
if sItem == scComments
	iType = peComment
elIf sItem == scFootnotes
	iType = peFootnote
elIf sItem == scEndnotes
	iType = peEndnote
elIf sItem == scRevisions
	iType = peRevision
else
	return
endIf
SayFormattedMessage(ot_smart_help,formatString(msgListItemsPleaseWait,sItem))
;a table in the revisions may cause revised text to include list_item_separator,
;so temporarily use some other character as the revision delimiter and then clean up the list:
; This may help but will not hurt for values of iType other than peRevision.
sList = GetListOfProofreadingElements(iType,"\001")
sList = StringReplaceSubstrings(sList,list_item_separator,cscSpace)
sList = StringReplaceSubstrings(sList,"\001",list_item_separator)
;now it's cleaned up, list_item_separator is safe to use as the revision delimiter.
iCount = StringSegmentCount(sList,list_item_separator)
if iCount == 0
	SayMessage(ot_error,msgNoItemsToDisplay)
	return
elif iCount == 1
	sItem = stringSegment(stringChopLeft(
		ListItemsToDisplay_singular,1),cscListSeparator ,iChoice)
endIf
ShowListInVirtualViewer(iType,sItem,sList,iCount)
EndScript

Script ToggleWritingMode()
EnsureNoUserBufferActive()
toggleOverTypeMode()
EndScript

Script ToggleCase()
if QuickNavKeyTrapping()
	return
EndIf
var
 	string sSelectedText,
 	int iLength,
 	string sFirstSelectedWord,
 	string sLastSelectedWord
SayCurrentScriptKeyLabel()
TypeKey(ksToggleCase)
if WindowCategoryIsWordDocument()
&& isPcCursor()
	sSelectedText = stringStripAllBlanks(GetSelectedText())
	iLength = StringLength(sSelectedText)
	if iLength> 1
	&& iLength <= 255 then ;about one line of standard 12-point text.
		Say(sSelectedText,OT_SPELL)
	elIf iLength > 255
		sFirstSelectedWord = stringSegment(GetSelectedText(),cscSpace,1)
		sLastSelectedWord = stringSegment(GetSelectedText(),cscSpace,-2)
		SayMessage(ot_selected_item,msgChangedCaseFrom)
		Say(sFirstSelectedWord,ot_spell)
		SayMessage(ot_selected_item,msgChangedCaseTo)
		Say(sLastSelectedWord,ot_spell)
	else
		SpellWord()
	endIf
	if BrailleInUse()
		BrailleRefresh()
	EndIf
endIf
EndScript

script ToggleShowHideNonprintingCharacters()
TypeCurrentScriptKey()
SayCurrentScriptKeyLabel()
;With windows 8 and later,
;we do not get a NewTextEvent to let us know that something changed:
Delay(5)
Refresh()
EndScript

script JAWSDelete()
if QuickNavKeyTrapping()
	return
EndIf
PerformScript JAWSDelete()
EndScript

script Delete()
performScript JAWSDelete()
endScript

Script JAWSBackspace()
if QuickNavKeyTrapping()
	return
EndIf
PerformScript JAWSBackSpace()
EndScript

script Backspace()
performScript JAWSBackspace()
endScript

Script ControlBackSpace()
if QuickNavKeyTrapping()
	return
EndIf
var	string sText = getPriorWord()
if sText
	SayMessage(ot_line, sText)
else
	Say(cmsgBlank1,ot_screen_message)
EndIf
TypeCurrentScriptKey()
EndScript

Script DeleteWord()
if QuickNavKeyTrapping()
	return
EndIf
Var
	int iSelectionCtxFlags,
	int	iStyleCtxFlag
TypeKey(ksDeleteWord) ; CtrlDel in English
pause()
PCCursor()
iSelectionCtxFlags = GetSelectionContextFlags()
iStyleCtxFlag = iSelectionCtxFlags & selCtxStyle
if iStyleCtxFlag
	ToggleSelCtxFlag(iSelectionCtxFlags,selCtxStyle) ; turn it off temporarily.
EndIf
SayWord()
if iStyleCtxFlag
	ToggleSelCtxFlag(iSelectionCtxFlags,selCtxStyle) ; turn it back on.
EndIf
if!isSelectionModeActive()
&& IsExtendedSelectionModeWatchActive()
	SayFormattedMessageWithVoice(vctx_message,ot_status,msgSelectionModeOff1_L,cMsgSilent)
	StopExtendedSelectionModeWatch()
endIf
EndScript

script PasteFromClipboard()
if !(GetRunningFSProducts() & product_JAWS)
	SayCurrentScriptKeyLabel()
	return
endIf
if QuickNavKeyTrapping()
	return
EndIf
PerformScript PasteFromClipboard()
EndScript

int function ShouldUseLegacyCopyAndPasteFormat()
var
	int major,
	int update,
	int build
GetFixedProductVersion (GetAppFilePath (), major, 0, update, 0)
if major < 16
	return true
endIf
if major == 16
	if update < 17928
		return true
	elIf update == 17928
		build = StringToInt(StringSegment (GetVersionInfoString (GetAppFilePath (), cmsg283_L), ".", -1))
		if build < 20216
			return true
		endIf
	endIf
endIf
return false
endFunction

Script LegacyPasteFormat()
if ShouldUseLegacyCopyAndPasteFormat()
	PerformScript PasteFormat()
	return
endIf
SayCurrentScriptKeyLabel ()
TypeCurrentScriptKey ()
EndScript

Script LegacyCopyFormat()
if ShouldUseLegacyCopyAndPasteFormat()
	PerformScript CopyFormat()
	return
endIf
SayCurrentScriptKeyLabel ()
TypeCurrentScriptKey ()
EndScript

Script PasteFormat()
if IsDocumentAreaScriptException()
	return
EndIf
if QuickNavKeyTrapping()
	;read-only messages have quick nav key trapping enabled,
	;but we still want users to be able to move the messages via the keystroke.
	if OutlookIsActive()
		SayCurrentScriptKeyLabel()
		TypeCurrentScriptKey ()
	endIf
	return
EndIf
TypeCurrentScriptKey ()
If WindowCategoryIsWordDocument()
	Pause()
	SayFormattedMessageWithVoice(vctx_message,ot_help,msgPasteFormat_l,msgPasteFormat_s)
EndIf
EndScript

Script CopyFormat()
if !(GetRunningFSProducts() & product_JAWS)
	SayCurrentScriptKeyLabel()
	TypeCurrentScriptKey()
	return
endIf
if IsDocumentAreaScriptException()
	return
EndIf
if QuickNavKeyTrapping()
	return
EndIf
TypeCurrentScriptKey ()
If WindowCategoryIsWordDocument()
	pause()
	SayFormattedMessageWithVoice(vctx_message,ot_help,msgCopyFormat_l,msgCopyFormat_s)
EndIf
EndScript

Script CutToClipboard()
if !(GetRunningFSProducts() & product_JAWS)
	PerformScript CutToClipboard()
	return
endIf
if QuickNavKeyTrapping()
	return
EndIf
var
	string sTheClass,
	int iSubtype
sTheClass = c_WordFocus.WindowClass
iSubtype = GetWindowSubtypeCode(GlobalFocusWindow)
If (!GetSelectedText()
&& !(GetCharacterAttributes() & ATTRIB_HIGHLIGHT))
&& (iSubtype == wt_edit
|| iSubtype == wt_MultiLine_Edit
|| iSubtype == wt_ReadOnlyEdit
|| iSubtype == wt_PasswordEdit
|| iSubtype == wt_Upload_Edit
|| iSubtype == wt_EditCombo
|| iSubtype == wt_ListView
|| iSubtype == wt_ListViewItem
|| iSubtype == wt_TreeView
|| iSubtype == wt_TreeViewItem
|| iSubtype == wt_Static
|| sTheClass == wc_wordMainDocumentWindow)
	SayMessage(OT_ERROR, cmsgNothingSelected)
Else
	if !WillOverwriteClipboard()
		return
	EndIf
	ClipboardTextChanged = Clipboard_Cut
	TypeKey(cksCut)
EndIf
EndScript

script CopySelectedTextToClipboard()
if !(GetRunningFSProducts() & product_JAWS)
|| isVirtualPCCursor()
	PerformScript CopySelectedTextToClipboard()
	return
endIf
Var
	handle hwnd,
	int iSubType,
	string sTheClass
if IsSameScript()
	; Double-clicking Control+C will open the Office Clipboard in the task pane
	TypeKey(ksCopySelectedTextToClipboard)
	if IsTextSelected()
		SayMessage(ot_help, msgCopiedToOfficeClipboard_l,msgCopiedToOfficeClipboard_s)
	else
		SayMessage(ot_help,msgOfficeClipboard_l,msgOfficeClipboard_s)
	EndIf
	return
EndIf
hwnd=GetFocus()
iSubtype = GetWindowSubtypeCode(hwnd)
sTheClass = c_WordFocus.WindowClass
If (!GetSelectedText()
&& !(GetCharacterAttributes() & ATTRIB_HIGHLIGHT))
&& (iSubtype == wt_edit
|| iSubtype == wt_MultiLine_Edit
|| iSubtype == wt_ReadOnlyEdit
|| iSubtype == wt_PasswordEdit
|| iSubtype == wt_Upload_Edit
|| iSubtype == wt_EditCombo
|| iSubtype == wt_ListView
|| iSubtype == wt_ListViewItem
|| iSubtype == wt_TreeView
|| iSubtype == wt_TreeViewItem
|| iSubtype == wt_Static
|| sTheClass == wc_wordMainDocumentWindow)
	TypeKey(ksCopySelectedTextToClipboard)
	SayMessage(OT_ERROR, cmsgNothingSelected)
Else
	if !WillOverwriteClipboard()
		return
	EndIf
	ClipboardTextChanged = CLIPBOARD_COPIED
	CopySelectionToClipboard()
EndIf
EndScript

Script JAWSFind()
;Activates native Find and Replace dialog for Outlook when in the message window.
;otherwise, performs default JAWSFind function.
if OutlookIsActive()
&& !WindowCategoryIsWordDocument()
&& !isVirtualPCCursor()
&& !UserBufferIsActive()
	TypeKey(ksF4)
	return
EndIf
performScript JAWSFind()
EndScript

Script MAGicFind()
performScript JAWSFind()
endScript

Script GraphicsList()
SayMessage(ot_error,
	formatString(msgGraphicsListNotAvailable_l,GetCurrentScriptKeyName()),
	formatString(msgGraphicsListNotAvailable_s,	GetCurrentScriptKeyName()))
EndScript

Script TabKey()
c_WordTester.PressTabOrShiftTabCausedNewListItem = false
If c_WordFocus.windowCategory == wCat_document
	sayCurrentScriptKeyLabel()
	if OutlookIsActive()
	&& IsActiveWindowProtected()
		TabInReadOnlyMessage(MOVE_FORWARD)
		return
	endIf
	if QuickNavKeyTrapping()
		If IsDocumentTableActive()
		&& !AtLastCellInDocumentTable()
			TabKey()
		EndIf
		return
	EndIf
	TabKey()
	if isPcCursor()
		if InList()
			c_WordTester.PressTabOrShiftTabCausedNewListItem = TRUE
			Refresh(1)
			Pause()
			If BrailleInUse()
				BrailleRefresh()
			EndIf
			SayLine()
		EndIf
	endIf
	return
endIf
PerformScript Tab()
EndScript

Script shiftTabKey()
c_WordTester.PressTabOrShiftTabCausedNewListItem = false
If c_WordFocus.windowCategory == wCat_document
	sayCurrentScriptKeyLabel()
	if OutlookIsActive()
	&& IsActiveWindowProtected()
		TabInReadOnlyMessage(MOVE_BACK)
		return
	endIf
	if QuickNavKeyTrapping()
		If IsDocumentTableActive()
		&& !AtFirstCellInDocumentTable()
			ShiftTabKey()
		EndIf
		return
	EndIf
	shiftTabKey()
	if isPcCursor()
		if InList()
			c_WordTester.PressTabOrShiftTabCausedNewListItem = TRUE
			Refresh(1)
			Pause()
			If BrailleInUse()
				BrailleRefresh()
			EndIf
			SayLine()
		endIf
	endIf
	return
EndIf
PerformScript shiftTab()
EndScript

Script Enter()
SayCurrentScriptKeyLabel()
c_WordTester.PressEnterCausedNewListItem = false
var	int typeCode
If c_WordFocus.windowCategory == wCat_document
	if OutlookIsActive()
		if IsHyperlinkField()
			EnterKey()
			return
		EndIf
	EndIf
	if QuickNavKeyTrapping()
		; Enter key has a function in ZoomText and Fusion that was being trapped.
		if getRunningFSProducts() &(product_ZoomText | product_Fusion)
		&& OutlookIsActive()
			enterKey()
		endIf
		return
	EndIf
	typeCode = getObjectSubtypeCode()
	if isPcCursor()
	&& IsFormfield()
	&& (typeCode == WT_ComboBox || typeCode == WT_Menu)
		if typeCode == wt_comboBox
			clickFormField()
		else
			TypeKey(cksAltDownArrow) ;alt+DownArrow
		endIf
	elif IsHyperlinkField()
		TrackLinkNavigation(MOVE_FORWARD)
		EnterKey()
		sayLine()
	Else
		EnterKey()
		if InList()
			c_WordTester.PressEnterCausedNewListItem = TRUE
		endIf
	EndIf
	return
endIf
if c_WordFocus.InMicrosoftEditorProofingPaneIssueChecker
&& oSuggestionSplitButton && !oSuggestionSplitButton.isOffScreen
	FSUIAGetFirstChildOfElement (oSuggestionSplitButton).GetInvokePattern().Invoke()
	oSuggestionSplitButton = null()
	return
endIf
typeCode = getObjecttypeCode(TRUE)
if oSuggestionSplitButton && !oSuggestionSplitButton.isOffScreen ; reset every time focus changes
&& typecode == WT_EDIT ; can be read-only, multiline or single-line
&& c_WordFocus.WindowClass == cwc_NetUIHwnd
	var object pattern = oSuggestionSplitButton.GetInvokePattern()
	if pattern.Invoke()
		; must reread the spellcheck info but only if still in the read-only and not on a button:
		delay(1)
		oSuggestionSplitButton = null() ; ensure recaching of new element
		if getObjectTypeCode(TRUE) == typeCode then ; spellCheck still in progress.
			performScript readMistakeAndSuggestion()
		endIf
		return
	endIf
endIf
if IsSearchDocumentDialogType()
	if c_WordFocus.WindowClass == cwc_Richedit60W
		;for Word 2010,
		;Text becomes selected as you enter a search term,
		;and pressing Enter places focus on the Next Search Result button,
		;but the first enstance of the found item is not read automatically.
		;So, perform ReadWordInContext when Enter is pressed after the search term is entered.
		EnterKey()
		Delay(2,true)
		var int IgnoreNotFoundMessage = FALSE ;
		; but expose the correct message:
		var int UseSearchStringNotFoundMessageInstead = TRUE
		ReadWordInContext(IgnoreNotFoundMessage, UseSearchStringNotFoundMessageInstead)
	else
		;ProcessNewTextEvent reads the word in context,
		;so that the context is not read before the document is updated.
		EnterKey()
	endIf
	return
endIf
EnterKey()
EndScript

Script VirtualEnter()
if UserBufferIsActive()
|| isVirtualPCCursor()
	sayCurrentScriptKeyLabel()
	builtin::EnterKey()
EndIf
EndScript

Script ControlEnter()
PerformScript ControlEnter()
If WindowCategoryIsWordDocument()
&& !IsWordDocumentActive()
	SayLine()
EndIf
EndScript

Script NextDocumentWindow()
If WindowCategoryIsWordDocument()
&& InTable()
	TypeKey(cksControlTab)
	SayHorizontalPosition()
	return
EndIf
PerformScript NextDocumentWindow()
EndScript

Script PreviousDocumentWindow()
If WindowCategoryIsWordDocument()
&& InTable()
	TypeKey(cksControlShiftTab)
	SayHorizontalPosition()
	return
EndIf
PerformScript PreviousDocumentWindow()
EndScript

string function GetActiveCursorName()
;Overwritten here to handle the case for where the document is in Web view.
if StringContains(GetActiveCursorName(),CURSOR_FSDOM_EDIT)
	if IsPCCursor()
		return cmsgPCCursorActive
	endIf
endIf
return GetActiveCursorName()
EndFunction

Script PCCursor()
; must overwrite here so that JAWS does not announce virtual cursor is active when quick keys are turned on.
var	int bTurnOffFormsMode =
	IsFormsModeActive()
	&& !IsJAWSCursor()
	&& !IsInvisibleCursor()
	&& !IsTouchCursor()
if IsObjectNavigationActive()
	if IsSameScript()
		ExitTouchNavigation()
	else
		BeginFlashMessage()
		sayMessage(OT_Status,cmsgTouchCursor_L,cmsgTouchCursor_L)
		if ShouldItemSpeak(ot_tutor)
			;tutor messages are normally off for braile,
			;but we want to make sure this is shown in braille:
			Say(cmsgTouchCursorDeactivateTutorMessage,ot_status)
		endIf
		EndFlashMessage()
		return
	endIf
EndIf
ResetSynth()
PCCursor()
if QuickNavKeyTrapping()
&& WindowCategoryIsWordDocument()
&& !IsEmailMessage()
	SayFormattedMessage(ot_status, cmsg9_L, cmsg9_S) ; "PC Cursor"
	if BrailleInUse()
		RouteBrailleToPC()
		BrailleRefresh()
	endIf
	return
EndIf
If bTurnOffFormsMode
|| IsVirtualPCCursor()
	TurnOffFormsMode()
endIf
if BrailleInUse()
	RouteBrailleToPC()
	BrailleRefresh()
endIf
If IsVirtualPCCursor()
	SayFormattedMessage(ot_status, cMSG288_L, cMSG288_S) ; virtual pc cursor
else
	SayFormattedMessage(ot_status, cmsg9_L, cmsg9_S) ; "PC Cursor"
endIf
EndScript

Script SayActiveCursor()
if !isPCCursor()
|| IsVirtualPcCursor()
|| !WindowCategoryIsWordDocument()
|| IsObjectNavigationActive()
	PerformScript SayActiveCursor()
	return
EndIf
if GetActiveDocumentViewName() == msgWeb
	performScript SayActiveCursor()
	return
endIf
Var
	string sCursorPos,
	string sMsg_L,
	string sMsg_S
sCursorPos = GetCursorPosString(GetActiveCursor(),getDesiredUnitsOfMeasure())
if IsWordDocumentActive()
	sCursorPos = StringReplaceSubStrings(sCursorPos,sc_minus,cscSpace)
EndIf
sMsg_L = GetActiveCursorName()+cscBufferNewLine
	+sCursorPos+cscBufferNewLine
sMsg_S = sMsg_L
if !IsPCCursor()
	sMsg_L = sMsg_L+cmsg317_l
	sMsg_S = sMsg_S+cmsg317_s
endIf
if quickNavState()
&& QuickNavKeyTrapping()
	sMsg_L = sMsg_L+cscBufferNewLine+cmsgNavigationModeOn_l
	sMsg_S = sMsg_S+cscBufferNewLine+cmsgNavigationModeOn_l
EndIf
sayMessage(ot_user_requested_information,sMsg_L,sMsg_S)
EndScript

Script SayTopLineOfWindow()
if WindowCategoryIsWordDocument()
&& IsPCCursor()
	SaveCursor()
	InvisibleCursor()
	RouteInvisibleToPC()
	JAWSPageUp()
	Say(GetWindowName(GetRealWindow(GetCurrentWindow())),ot_user_requested_information)
	RestoreCursor()
	return
endIf
performScript SayTopLineOfWindow()
EndScript

Script ReadOutlookHeader(int iField)
If InHJDialog()
&& globalRealWindowName==cWn16 then ; Heading List
	SayCurrentScriptKeyLabel()
	TypeKey(GetCurrentScriptKeyName())
	return
EndIf
TypeKey(GetCurrentScriptKeyName())
EndScript

Script EMailHeader3Control()
TypeKey(ksEmailHeader3) ; Alt3 in English
EndScript

Script EMailHeader4Control()
TypeKey(ksEmailHeader4) ; Alt4 in English
EndScript

Script selectionByUnitMode()
if WindowCategoryIsWordDocument()
	ExtendedSelectionByUnitScriptRunEvent() ;this must run before the key is pressed
	TypeKey(ksSelectionByUnitMode) ; F8 in English
	pause()
	if IsExtendedSelectionModeWatchActive()
		saySelectedUnit()
		UpdateExtendedSelectionModeWatch()
		if !IsEntireDocumentSelected()
			sayWindow(getFocus(),read_highlighted)
		endIf
	else
		if isSelectionModeActive()
			SayFormattedMessageWithVoice(vctx_message,ot_status,msgSelectionModeOn1_L,cmsgSilent)
			InitExtendedSelectionModeWatch()
		EndIf
	endIf
else
	TypeKey(ksSelectionByUnitMode) ; F8 in English
	SayCurrentScriptKeyLabel()
endIf
EndScript

Script reduceSelectionUnit()
if WindowCategoryIsWordDocument()
	ExtendedSelectionByUnitScriptRunEvent() ;this must run before the key is pressed
	TypeKey(ksReduceSelectionUnit) ; ShiftF8 in english
	pause()
	if IsExtendedSelectionModeWatchActive()
		saySelectedUnit()
		UpdateExtendedSelectionModeWatch()
		say(getSelectedText(), OT_LINE)
	else
		if isSelectionModeActive()
			SayFormattedMessageWithVoice(vctx_message,ot_status,msgSelectionModeOn1_L,cmsgSilent)
			InitExtendedSelectionModeWatch()
		EndIf
	endIf
else
	TypeKey(ksSelectionByUnitMode) ; F8 in English
	SayCurrentScriptKeyLabel()
endIf
EndScript

Script selectionByMovementMode()
if WindowCategoryIsWordDocument()
&& !IsExtendedSelectionModeWatchActive()
	if isVirtualPcCursor() ; Outlook virtualized message:
		sayMessage(OT_ERROR, msgExtendedSelectionNotAvailableVirtualizedMessages)
		return
	endIf
	TypeKey(ksSelectionByMovementMode) ; CtrlShiftF8 in English
	pause()
	SayFormattedMessageWithVoice(vctx_message,ot_status,msgSelectionModeOn1_L,cmsgSilent)
	InitExtendedSelectionModeWatch()
	return
EndIf
TypeCurrentScriptKey()
SayCurrentScriptKeyLabel()
EndScript

; When unselecting text in Microsoft Word, JAWS will only speak the
; unselected text if the unselection was caused by a builtin unselection
; script function.  This is because when selected text is deleted, JAWS is
; informed of the deletion in the same way as of an unselection and
; there is no need to speak the text being deleted.
; Selection/unselection of all units other than paragraphs was already
; handled by internal functions, now paragraphs are as well.
; (There really is no need for SelectParagraph to be handled by an
; internal function since text selection in Word is spoken
; unconditionally, but the symetry of having both functions is compelling.)

Script SaySelectedText()
var
	Handle hFocus = GetFocus(),
	int bSpell,
	Int i = 20,
	String sStartSelected,
	String sEndSelected,
	string sSelectedText = GetSelectedText(),
	Int iSelectedTextLength = StringLength(sSelectedText)
If c_WordFocus.windowCategory(hFocus) == WCAT_DOCUMENT
	bSpell =(IsSameScript() && GetRunningFSProducts() != product_MAGic)
	If iSelectedTextLength >= 1000
	&& !bSpell
		While SubString(sSelectedText, i, 1) != cScSpace
			i = i + 1
		EndWhile
		sStartSelected = StringLeft(sSelectedText, i)
		i = 20
		While SubString(sSelectedText, iSelectedTextLength - i, 1) != cScSpace
			i = i + 1
		EndWhile
		sEndSelected = StringRight(sSelectedText, i)
		SayFormattedMessage(OT_USER_REQUESTED_INFORMATION, FormatString(msgSelectedHugeAmountOfText, IntToString(iSelectedTextLength), sStartSelected, sEndSelected))
		Return
	EndIf
EndIf
PerformScript SaySelectedText()
EndScript

int function ShouldSetQuickNavModeTo2()
if IsVirtualPCCursor() return false endIf
return IsPCCursor()
	&& !InHJDialog()
EndFunction

Script SayAll()
if ShouldSetQuickNavModeTo2()
	if !WindowCategoryIsWordDocument()
		if c_WordFocus.ObjectSubType == wt_multiLine_edit
		|| c_WordFocus.WindowSubtype == wt_multiline_edit
			performScript SayAll() ; default
		else
			SayLine()
		EndIf
		return
	EndIf
	if isMAGicRunning()
	&& getJCFOption(OPT_HIGHLIGHT_STYLE )>0 then
		if QuickNavKeyTrapping() then
			SaveCurrentQuickKeyNavigationMode()
			setJCFOption(opt_quick_key_navigation_Mode,2) ; on by default
			SetQuickKeyNavigationState(0)
		EndIf
		performScript SayAll() ; default
		return
	EndIf
	if IsActiveDocumentProtectedForm()
		sayMessage(ot_error,msgErrorSayAllProtectedForm_l,msgErrorSayAllProtectedForm_s)
		return
	EndIf
	setJCFOption(opt_quick_key_navigation_Mode,2) ; on by default
EndIf
if ShouldSetQuickNavModeTo2()
	SaveCurrentQuickKeyNavigationMode()
	setJCFOption(opt_quick_key_navigation_Mode,2) ; on by default
EndIf	; end of user buffer and HJDialog
performscript SayAll()
SetQuickKeyNavigationState(1)
EndScript

Script SayAllFromLocation()
if !WindowCategoryIsWordDocument()
	if c_WordFocus.ObjectSubType == wt_multiLine_edit
	|| c_WordFocus.WindowSubtype == wt_multiline_edit
		performScript SayAllFromLocation() ; default
	else
		SayLine(TRUE)
	EndIf
	return
EndIf
if isMAGicRunning()
&& getJCFOption(OPT_HIGHLIGHT_STYLE )>0 then
	if QuickNavKeyTrapping() then
		SaveCurrentQuickKeyNavigationMode()
		setJCFOption(opt_quick_key_navigation_Mode,2) ; on by default
		SetQuickKeyNavigationState(0)
	EndIf
	performScript SayAllFromLocation() ; default
	return
EndIf
if IsActiveDocumentProtectedForm()
	processMessage(msgErrorSayAllProtectedForm_l, msgErrorSayAllProtectedForm_s, ot_error, msgError, MB_OK|MB_ICONERROR)
	return
EndIf
SaveCurrentQuickKeyNavigationMode()
setJCFOption(opt_quick_key_navigation_Mode,2) ; on by default
performScript SayAllFromLocation()
SetQuickKeyNavigationState(1)
EndScript

Script MarkPlace()
if c_WordFocus.windowCategory != WCAT_DOCUMENT
|| !isPCCursor()
|| isVirtualPCCursor()
|| UserBufferIsActive()
|| OutlookIsActive()
	return
endIf
Var
	int bIsTextSelected,
	int iMarkedPlace,
	int iCurCharPos
bIsTextSelected = IsTextSelected()
if !bIsTextSelected
&& atStartOfDocument()
	ProcessMessage(msgMarkedPlaceBeginningOfDocumentError_L,msgMarkedPlaceBeginningOfDocumentError_S, OT_ERROR, msgError, MB_OK|MB_ICONERROR)
	return
endIf
if !InDocumentMainText()
	ProcessMessage(msgMarkedPlaceSaveStoryError_l, msgMarkedPlaceSaveStoryError_l, OT_ERROR, msgError, MB_OK|MB_ICONERROR)
	return
endIf
if !WasDocumentEverSaved()
	ProcessMessage(msgMarkedPlaceSaveDocError_l, msgMarkedPlaceSaveDocError_s, OT_ERROR, msgError, MB_OK|MB_ICONERROR)
	return
endIf
if IsActiveDocumentProtectedForm()
|| IsActiveDocumentProtected()
	ProcessMessage(msgProtectedDocOrFormMarkingPlaceError_l, msgProtectedDocOrFormMarkingPlaceError_s, OT_ERROR, msgError, MB_OK|MB_ICONERROR)
	return
endIf
if bIsTextSelected
	ProcessMessage(msgSelectedTextMarkingPlaceError_l, msgSelectedTextMarkingPlaceError_l, OT_ERROR, msgError, MB_OK|MB_ICONERROR)
	return
endIf
iMarkedPlace = GetCurrentDocumentMarkedPlace()
iCurCharPos = GetCurCharPos()
if iMarkedPlace == iCurCharPos
	ProcessMessage(msgPlaceAlreadyMarked, null(), OT_ERROR, msgError, MB_OK|MB_ICONERROR)
	return
endIf
setCurrentDocumentMarkedPlace(iCurCharPos)
processMessage(msgMarkingPlace, null(), ot_help, cscNull, MB_OK|MB_ICONINFORMATION)
EndScript

Script ReturnToMarkedPlace()
if c_WordFocus.windowCategory != WCAT_DOCUMENT
|| !isPCCursor()
|| isVirtualPCCursor()
|| UserBufferIsActive()
|| OutlookIsActive()
	return
endIf
var
	int iMarkedPlace
;if place is already marked, return to it.
;Otherwise, beep and say error message.
iMarkedPlace = GetCurrentDocumentMarkedPlace()
if iMarkedPlace
	if iMarkedPlace == GetCurCharPos()
		processMessage(msgAlreadyAtMarkedPlace_l, msgAlreadyAtMarkedPlace_s, OT_ERROR, msgError, MB_OK|MB_ICONERROR)
		return
	endIf
	if TotalDocumentCharCount() < iMarkedPlace
		processMessage(msgMarkedPlaceNotValidError_l, msgMarkedPlaceNotValidError_s, OT_ERROR, msgError, MB_OK|MB_ICONERROR)
		return
	endIf
	if ReturnToMarkedPlace(iMarkedPlace)
		sayUsingVoice(vctx_message,msgReturningToMarkedPlace,ot_help)
		scheduleBrailleFlashMessageWithSpeechOutput(OT_Help, msgReturningToMarkedPlace)
		if inTable()
			SayCell()
			return
		endIf
		SayWordAtMarkedPlace()
	endIf
else
	beep()
	SayMessage(OT_ERROR, msgMarkedPlaceError_l, msgMarkedPlaceError_s)
EndIf
EndScript

Script SelectTextBetweenMarkedPlaceAndCurrentPosition()
If IsVirtualPCCursor()
|| OutlookIsActive()
	;These should be handled by default:
	PerformScript SelectTextBetweenMarkedPlaceAndCurrentPosition()
	return
endIf
if c_WordFocus.windowCategory != WCAT_DOCUMENT
|| !isPCCursor()
|| UserBufferIsActive()
	return
endIf
;Now we are handling the Word document:
var	int iMarkedPlace = GetCurrentDocumentMarkedPlace()
if !iMarkedPlace
	sayMessage(ot_error,FormatString(msgMarkedPlaceSelectingTextError_l), FormatString(msgMarkedPlaceSelectingTextError_s))
	return
endIf
if SelectTextBetweenMarkedPlaceAndPos(iMarkedPlace, GetCurCharPos())
	SayMessage(ot_status,msgMarkedPlaceSelectingText)
endIf
EndScript

Script DefineATempPlaceMarker()
if IsVirtualPcCursor()
|| OutlookIsActive()
	performScript DefineATempPlaceMarker()
else
	PerformScript MarkPlace()
endIf
endScript

Script ShowMathViewer()
ShowMathViewerHelper(MathViewerRequestor_MSWord)
EndScript

script ShowMathEditor()
var string requestor = MathEditorRequestor_Default;
if (isOffice365())
	requestor = MathEditorRequestor_MSWord;
endIf
ShowMathEditorHelper(requestor);
EndScript

script DescribeTextAnnotationOrAttributes()
DescribeTextAnnotationOrAttributes(true)
endScript

int function IsAutoCorrectExceptionCharacter(int charValue)
return charValue == AutocorrectApostrophe
	|| charValue == AutocorrectLeftQuote
	|| charValue == AutocorrectRightQuote
endFunction

script sayCharacter()
if handleNoCurrentWindow()
	return
endIf
if !isPCCursor()
|| UserBufferIsActive()
	performScript sayCharacter()
	return
endIf
if WindowCategoryIsWordDocument()
	if IsFormField()
	&& c_WordFocus.ObjectSubType == wt_checkbox
		self::SayObjectTypeAndText()
		return
	EndIf
elif InMultilevelListPane()
	IndicateControlType(wt_grid,GetWord2003MultiLevelListObjectNameOfFocusObject(),cscNull)
	return
EndIf
performScript sayCharacter()
endScript

Script sayNextCharacter()
if !IsPcCursor()
|| IsVirtualPCCursor()
|| UserBufferIsActive()
|| InHJDialog()
|| (DialogActive() && OutlookIsActive())
	PerformScript SayNextCharacter()
	return
EndIf
if WindowCategoryIsWordDocument()
	if IsExtendedSelectionModeWatchActive()
		nSaySelectAfter = true
		SelectingText(TRUE)
		SelectNextCharacter()
		SelectingText(FALSE)
		nSaySelectAfter = false
		return
	EndIf
	SetDocumentCaretMovementType(Unit_Char_Next)
	nextCharacter()
	if IsLeftButtonDown()
	|| IsRightButtonDown()
		SelectingText(TRUE)
		pause()
		SelectingText(false)
		return
	endIf
	if !SupportsEditCallbacks()
	&& IsWordDocumentActive()
		; Not all MSWord instances will support edit callbacks.
		; When run as part of the Enterprise Express Editor, used by Lighthouse Houston, events are blocked by their addin.
		; In this case we must force legacy behaviour and speak here.
		CaretMovedEvent(Unit_CHAR_Next)
	endIf
	return
EndIf
var
	int iType,
	string sClass,
	string sObjName,
	handle hwnd
hwnd = GetFocus()
sClass = c_WordFocus.WindowClass
sObjName = GetObjectName()
iType = c_WordFocus.WindowSubtype
If !iType
	iType = c_WordFocus.ObjectSubType
EndIf
if InTaskPaneDialog()
&& (iType == wt_edit
|| iType == wt_EditCombo
|| sClass == cwc_RichEdit20W)
	NextCharacter()
	SayCharacter()
ElIf sObjName == scUnderlineStyle
&& sClass != wc_MsoCommandBar
	NextLine()
	SayMessage(ot_highlighted_screen_text,GetObjectName(SOURCE_CACHED_DATA))
ElIf sClass == wc_msoCommandBar
	NextCharacter()
ElIf iType == wt_tabControl
	NextCharacter()
;ensure that extended ASCII and Unicode characters are announced as they gain focus.
elIf globalRealWindowName == wn_symbol
&& c_WordFocus.ObjectSubType == wt_bitmap
	nextCharacter()
	sayCharacter()
else
	performScript sayNextCharacter() ; default
endIf
EndScript

Script sayPriorCharacter()
if !IsPcCursor()
|| IsVirtualPCCursor()
|| UserBufferIsActive()
|| InHJDialog()
|| (DialogActive() && OutlookIsActive())
	PerformScript SayPriorCharacter()
	return
EndIf
if WindowCategoryIsWordDocument()
	if IsExtendedSelectionModeWatchActive()
		nSaySelectAfter = true
		SelectingText(TRUE)
		SelectPriorCharacter()
		SelectingText(FALSE)
		nSaySelectAfter = false
		return
	EndIf
	SetDocumentCaretMovementType(Unit_Char_Prior)
	priorCharacter()
	if IsLeftButtonDown()
	|| IsRightButtonDown()
	  SelectingText(TRUE)
	  pause()
	  SelectingText(false)
	  return
	endIf
	if !SupportsEditCallbacks()
	&& IsWordDocumentActive()
		; Not all MSWord instances will support edit callbacks.
		; When run as part of the Enterprise Express Editor, used by Lighthouse Houston, events are blocked by their addin.
		; In this case we must force legacy behaviour and speak here.
		CaretMovedEvent(Unit_Char_Prior)
	endIf
	return
EndIf
var
	int iType,
	string sClass,
	string sObjName,
	handle hwnd
hwnd = GetFocus()
sClass = c_WordFocus.WindowClass
sObjName = GetObjectName()
iType = c_WordFocus.WindowSubtype
If !iType
	iType = c_WordFocus.ObjectSubType
EndIf
if InTaskPaneDialog()
&&(iType == wt_edit
|| iType == wt_EditCombo
|| sClass == cwc_RichEdit20W)
	PriorCharacter()
	SayCharacter()
ElIf sObjName == scUnderlineStyle
&& sClass != wc_MsoCommandBar
	PriorLine()
	SayMessage(ot_highlighted_screen_text,GetObjectName(SOURCE_CACHED_DATA))
ElIf sClass == wc_msoCommandBar
	PriorCharacter()
ElIf iType == wt_tabControl
	PriorCharacter()
;ensure that extended ASCII and Unicode characters are announced as they gain focus.
elIf globalRealWindowName == wn_symbol
&& c_WordFocus.ObjectSubType == wt_bitmap
	PriorCharacter()
	sayCharacter()
else
	performScript sayPriorCharacter() ;default
endIf
EndScript

void function SayWordUnit(int UnitMovement)
If SayCursorMovementException(unitMovement)
	SayWordUnit(UnitMovement)
	return
endIf
if InTaskPaneDialog()
&& GetObjectTypeCode() != wt_edit
	return
EndIf
if c_WordFocus.WindowClass == cwc_RichEdit20W
	;Using SayWord on this class will cause the dialog title and entire edit field to be spoken,
	;So we use GetWord instead:
	Say(GetWord(),ot_word,true)
	return
EndIf
SayWordUnit(UnitMovement)
EndFunction

script sayWord()
if handleNoCurrentWindow()
	return
endIf
If !IsPCCursor()
|| UserBufferIsActive()
	PerformScript sayWord()
	return
endIf
if WindowCategoryIsWordDocument()
	if IsFormField()
	&& c_WordFocus.ObjectSubType == wt_checkbox
		self::SayObjectTypeAndText()
		return
	endIf
elif InMultilevelListPane()
	IndicateControlType(wt_grid,GetWord2003MultiLevelListObjectNameOfFocusObject(),cscNull)
	return
endIf
PerformScript sayWord()
EndScript

Script sayNextWord()
var	string sClass = c_WordFocus.WindowClass
if getMenuMode() == 2
&& !userBufferIsActive()
&& (sClass == wc_wwg || sClass == wc_wwn)
	;escape from menus such as Smart Tag for paste:
	typeKey(cksEscape)
endIf
if UserBufferIsActive()
|| IsVirtualPCCursor()
|| InHJDialog()
|| !IsPcCursor()
|| sClass==wc_wwn
|| sClass == wc_wwo
	PerformScript SayNextWord()
	return
EndIf
if WindowCategoryIsWordDocument()
	if IsExtendedSelectionModeWatchActive()
		nSaySelectAfter = true
		SelectingText(TRUE)
		SelectNextWord()
		SelectingText(FALSE)
		nSaySelectAfter = false
		return
	EndIf
	SetDocumentCaretMovementType(Unit_Word_Next)
	nextWord()
	if IsLeftButtonDown()
	|| IsRightButtonDown()
	  SelectingText(TRUE)
	  pause()
	  SelectingText(false)
	  return
	endIf
	if !SupportsEditCallbacks()
		; Not all MSWord instances will support edit callbacks.
		; When run as part of the Enterprise Express Editor, used by Lighthouse Houston, events are blocked by their addin.
		; In this case we must force legacy behaviour and speak here.
		CaretMovedEvent(Unit_Word_Next)
	endIf
	return
EndIf
performScript sayNextWord()
EndScript

Script sayPriorWord()
var string sClass = c_WordFocus.WindowClass
if getMenuMode() == 2
&& !userBufferIsActive()
&& (sClass == wc_wwg || sClass == wc_wwn)
	;escape from menus such as Smart Tag for paste:
	typeKey(cksEscape)
endIf
if UserBufferIsActive()
|| IsVirtualPCCursor()
|| !IsPcCursor()
|| InHJDialog()
|| sClass==wc_wwn
|| sClass == wc_wwo
	PerformScript SayPriorWord()
	return
EndIf
if WindowCategoryIsWordDocument()
	if IsExtendedSelectionModeWatchActive()
		nSaySelectAfter = true
		SelectingText(TRUE)
		SelectPriorWord()
		SelectingText(FALSE)
		nSaySelectAfter = false
		return
	EndIf
	SetDocumentCaretMovementType(Unit_Word_Prior)
	priorWord()
	if IsLeftButtonDown()
	|| IsRightButtonDown()
	  SelectingText(TRUE)
	  pause()
	  SelectingText(false)
	  return
	endIf
	if !SupportsEditCallbacks()
		; Not all MSWord instances will support edit callbacks.
		; When run as part of the Enterprise Express Editor, used by Lighthouse Houston, events are blocked by their addin.
		; In this case we must force legacy behaviour and speak here.
		CaretMovedEvent(Unit_Word_Prior)
	endIf
	return
EndIf
performScript sayPriorWord()
EndScript

Script JAWSHome()
if InHJDialog()
	performScript JAWSHome() ; default
	return
endIf
if WindowCategoryIsWordDocument()
	SayCurrentScriptKeyLabel()
	if IsExtendedSelectionModeWatchActive()
		nSaySelectAfter 	= true
		SelectingText(TRUE)
		SelectFromStartOfLine()
		SelectingText(FALSE)
		nSaySelectAfter 	= false
		return
	endIf
	SetDocumentCaretMovementType(Unit_Line_Start)
	JAWSHome()
	if IsLeftButtonDown()
	|| IsRightButtonDown()
	  SelectingText(TRUE)
	  pause()
	  SelectingText(false)
	  return
	endIf
	if !SupportsEditCallbacks()
		; Not all MSWord instances will support edit callbacks.
		; When run as part of the Enterprise Express Editor, used by Lighthouse Houston, events are blocked by their addin.
		; In this case we must force legacy behaviour and speak here.
		CaretMovedEvent(Unit_Line_Start)
	endIf
	return
EndIf
performScript JAWSHome() ; default
EndScript

script Home()
performScript JAWSHome()
endScript

Script JAWSEnd()
if InHJDialog()
	performScript JAWSEnd() ; default
	return
endIf
if WindowCategoryIsWordDocument()
	SayCurrentScriptKeyLabel()
	if IsExtendedSelectionModeWatchActive()
		nSaySelectAfter = true
		SelectingText(TRUE)
		SelectToEndOfLine()
		SelectingText(FALSE)
		nSaySelectAfter = false
		return
	EndIf
	SetDocumentCaretMovementType(Unit_Line_End)
	JAWSEnd()
	if IsLeftButtonDown()
	|| IsRightButtonDown()
	  SelectingText(TRUE)
	  pause()
	  SelectingText(false)
	  return
	endIf
	if !SupportsEditCallbacks()
		; Not all MSWord instances will support edit callbacks.
		; When run as part of the Enterprise Express Editor, used by Lighthouse Houston, events are blocked by their addin.
		; In this case we must force legacy behaviour and speak here.
		CaretMovedEvent(Unit_Line_End)
	endIf
	return
EndIf
performScript JAWSEnd() ;default
EndScript

script end()
performScript JAWSEnd()
endScript

void function SayLineUnit(int UnitMovement, optional int bMoved)
if InEmptyCopilotEditWithSuggestions()
	return
EndIf

if c_WordFocus.ObjectSubType == WT_EDIT_SPINBOX
&& IsPCCursor()
&& RibbonsActive()
	;ValueChangedEvent speaks the change:
	return
endIf
SayLineUnit(UnitMovement,bMoved)
endFunction

script SayLine()
if handleNoCurrentWindow()
	return
endIf
var int inMenus = menusActive()
if !isPcCursor()
|| UserBufferIsActive()
|| inMenus
	performScript sayLine()
	return
endIf
if !isVirtualPCCursor()
&& WindowCategoryIsWordDocument()
	if isSameScript()
		SpellLine()
	Else
		SetDocumentReadingStartLocation()
		indicateInconsistenciesInRange(CheckLine)
		ResetSpeechMarkupAttributes()
		self::SayLine()
	EndIf
	Return
EndIf
if InMultilevelListPane()
	IndicateControlType(wt_grid,GetWord2003MultiLevelListObjectNameOfFocusObject(),cscNull)
	Say(PositionInGroup(),ot_position)
	return
endIf
if GetObjectName(SOURCE_CACHED_DATA, 1) == wn_SearchResultsList
	Say(GetObjectDescription (), OT_LINE)
endIf
var int iType = GetObjectSubTypeCode(SOURCE_CACHED_DATA)
if iType == WT_STATIC
&& ReadMicrosoftEditorIssueCheckerInfo(false, false)
	return
elIf iType == WT_SPLITBUTTON
&& ReadMicrosoftEditorSuggestion()
	return
endIf
PerformScript SayLine()
EndScript

Script sayNextLine()
if !IsPcCursor()
|| isVirtualPCCursor()
|| UserBufferIsActive()
|| InHJDialog()
	PerformScript SayNextLine()
	return
EndIf
if c_WordFocus.ObjectSubType == WT_EDIT_SPINBOX
	NextLine()
	return SayLineUnit(UnitMove_Next)
endIf
if WindowCategoryIsWordDocument()
	if IsExtendedSelectionModeWatchActive()
		nSaySelectAfter = true
		SelectingText(TRUE)
		SelectNextLine()
		SelectingText(FALSE)
		nSaySelectAfter = false
		return
	EndIf
	SetDocumentCaretMovementType(Unit_Line_Next)
	nextLine()
	if !SupportsEditCallbacks()
	&& IsWordDocumentActive()
		; Not all MSWord instances will support edit callbacks.
		; When run as part of the Enterprise Express Editor, used by Lighthouse Houston, events are blocked by their addin.
		; In this case we must force legacy behaviour and speak here in the WordClassic Scripts.
		; However, Office365 we need to use SayLine as CaretMovedEvent is intermittent.
		; CaretMovedEvent needs to be silent in this case to avoid doubling on line navigation.
		;CaretMovedEvent(Unit_Line_Next)
		;Must be scheduled in order to prevent speaking the wrong line.
		; The final parameter to scheduleFunction kills the timer on key press and on event.
		scheduleFunction("sayLine", 1, TRUE)
	endIf
	return
EndIf
;ensure that extended ASCII and Unicode characters are announced as they gain focus.
if globalRealWindowName == wn_symbol
&& c_WordFocus.ObjectSubType == wt_bitmap
	NextLine()
	sayCharacter()
	return
EndIf
performScript sayNextLine() ; default
EndScript

Script sayPriorLine()
if !IsPcCursor()
|| isVirtualPCCursor()
|| UserBufferIsActive()
|| InHJDialog()
	PerformScript SayPriorLine()
	return
EndIf
if c_WordFocus.ObjectSubType == WT_EDIT_SPINBOX
	PriorLine()
	return SayLineUnit(UnitMove_Prior)
endIf
if WindowCategoryIsWordDocument()
	if IsExtendedSelectionModeWatchActive()
		nSaySelectAfter = true
		SelectingText(TRUE)
		SelectPriorLine()
		SelectingText(FALSE)
		nSaySelectAfter = false
		return
	EndIf
	SetDocumentCaretMovementType(Unit_Line_Prior)
	PriorLine()
	if !SupportsEditCallbacks()
	&& IsWordDocumentActive()
		; Not all MSWord instances will support edit callbacks.
		; When run as part of the Enterprise Express Editor, used by Lighthouse Houston, events are blocked by their addin.
		; In this case we must force legacy behaviour and speak here in the WordClassic Scripts.
		; However, Office365 we need to use SayLine as CaretMovedEvent is intermittent.
		; CaretMovedEvent needs to be silent in this case to avoid doubling on line navigation.
		;CaretMovedEvent(Unit_Line_Next)
		;Must be scheduled in order to prevent speaking the wrong line.
		; The final parameter to scheduleFunction kills the timer on key press and on event.
		scheduleFunction("sayLine", 1, TRUE)
		;CaretMovedEvent(Unit_Line_Prior)
	endIf
	return
EndIf
;ensure that extended ASCII and Unicode characters are announced as they gain focus.
if globalRealWindowName == wn_symbol
&& c_WordFocus.ObjectSubType == wt_bitmap
	PriorLine()
	sayCharacter()
	return
endIf
performScript sayPriorLine() ; default
EndScript

int function getControlGroupsForSpellCheckerWithSplitButtons(object UIA, object treewalker,
	object byRef notInDictionaryGroup, object byRef suggestionsGroup, object byRef otherActionsGroup)
if !UIA || !treewalker return FALSE endIf
var int scope = TREESCOPE_DESCENDANTS
var object splitButtonCondition = UIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_SplitButtonControlTypeId)
var object buttonCondition = UIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_ButtonControlTypeId)
if !splitButtonCondition || !ButtonCondition return FALSE endIf
if !treewalker.gotoParent() || treewalker.currentElement.controlType != UIA_GroupControlTypeId return false endIf
; notInDictionaryGroup contains the current sentence read-only edit and the Read Current Sentence buttons:
while treewalker.currentElement.controlType == UIA_GroupControlTypeId
&& !stringContains(treewalker.currentElement.name, wn_Proofing_Pane_Grammar)
&& !stringContains(treewalker.currentElement.name, wn_Proofing_Pane_Spelling)
&& treeWalker.goToPriorSibling()
endWhile
if  treewalker.currentElement.controlType != UIA_GroupControlTypeId
|| (!stringContains(treewalker.currentElement.name, wn_Proofing_Pane_Grammar)
&& !stringContains(treewalker.currentElement.name, wn_Proofing_Pane_Spelling))
	return FALSE
endIf
notInDictionaryGroup = treewalker.currentElement.buildUpdatedCache()
; suggestionsGroup contains the split buttons where each suggestion is its own split button
if !treewalker.gotoNextSibling() return FALSE endIf
; where "No suggestions" are found:
var object tmp = treeWalker.currentElement.findAll(TREESCOPE_Children,UIA.CreateRawViewCondition())
if tmp.count == 1
&& tmp(0).ClassName == "NetUIGroupHeader"
	suggestionsGroup = treewalker.CurrentElement
endIf
while !suggestionsGroup
&& treewalker.currentElement.controlType == UIA_GroupControlTypeId
&& !treewalker.currentElement.findFirst(scope,splitButtonCondition)
&& treewalker.gotoNextSibling()
endWhile
if treewalker.currentElement.controlType != UIA_GroupControlTypeId return FALSE endIf
suggestionsGroup = treewalker.CurrentElement.buildUpdatedCache()
; other actions group is all buttons
if !treewalker.gotoNextSibling() return FALSE endIf
while treewalker.currentElement.controlType == UIA_GroupControlTypeId
&& !treewalker.currentElement.findFirst(scope,buttonCondition)
&& treewalker.gotoNextSibling()
endWhile
if treewalker.currentElement.controlType != UIA_GroupControlTypeId return FALSE endIf
otherActionsGroup = treewalker.CurrentElement.buildUpdatedCache()
return TRUE
endFunction

int function SpellProofingPaneSuggestionSplitButton()
if SayCursorMovementException(UnitMove_CURRENT) then return FALSE endIf
if !c_WordFocus.InProofingPaneSpellCheck return FALSE endIf
var object element = FSUIAGetFocusedElement() ; focus on the split button and not the pane:
if !element || element.controlType != UIA_SplitButtonControlTypeId return FALSE endIf
; Microsoft separates the suggestion from the reference information with a comma.
; This is the same as has been done for a while in ReadProofingPaneWithSplitButtons function.
var string suggestion = stringSegment(element.name, ",", 1); separate suggestion from reference info:
if !stringIsBlank(suggestion)
	spellString(suggestion)
	return TRUE
else
	return FALSE
endIf
endFunction

void function spellWord()
if SpellProofingPaneSuggestionSplitButton() return endIf
return spellWord()
endFunction

void function SpellLine()
if SpellProofingPaneSuggestionSplitButton() return endIf
return spellLine()
endFunction

Script OpenListBox()
if IsPcCursor()
	if inRibbons() then PerformScript OpenListBox() return endIf
	if GlobalMenuMode
	&& !IsVirtualRibbonActive()
		TypeKey(cksAltDownArrow)
		Pause()
		SayFormattedMessageWithVoice(vctx_message,ot_status,cmsg41_L,cmsgSilent) ;open list box
		SayFormattedMessage(ot_text,getObjectValue()) ; only say the contents of the edit combo without the prompt
		return
	ElIf WindowCategoryIsWordDocument()
		var int subtypeCode = c_WordFocus.ObjectSubType
		if IsFormField()
		&& (subtypeCode == wt_comboBox
		|| subtypeCode == wt_DateTime
		|| subtypeCode ==wt_Menu)
			; TypeKey being assigned to an alt combination seems to be problematic.
			; While typeKey("alt+downArrow") should rightfully work, it seems that MSWord
			; behaves differently when JAWS is running because even passKeyThrough doesn't
			; work. We will use the mouse instead.
			saveCursor()
			JAWSCursor()
			saveCursor()
			RouteJAWSToPc()
			LeftMouseButton()
			pause()
			restoreCursor() ; Restore the JAWS cursor
			restoreCursor() ; restore the original cursor.
		elIf subtypeCode == wt_comboBox
		|| subtypeCode == wt_DateTime
		|| subtypeCode ==wt_Menu
			; the case where the form field context flag is not on.
			TypeKey(cksAltDownArrow)
		else
			PerformScript OpenListBox ()
		EndIf
		return
	EndIf
endIf
If c_WordFocus.InProofingPaneSpellCheck
	TypeKey(cksAltDownArrow)
	Pause()
	SayFormattedMessageWithVoice(vctx_message,ot_status,cmsg41_L,cmsgSilent) ;open list box
	Return
EndIf
PerformScript OpenListBox()
EndScript

Script CloseListBox()
if IsPcCursor()
	if inRibbons() then PerformScript CloseListBox() return endIf
	if GlobalMenuMode
	&& !IsVirtualRibbonActive()
	 	TypeKey(cksAltUpArrow)
		SayFormattedMessageWithVoice(vctx_message,ot_status,cmsg42_L,cmsgSilent) ;close list box
		return
	ElIf WindowCategoryIsWordDocument()
		var int subtypeCode = c_WordFocus.ObjectSubType
		if IsFormField()
		&& (subtypeCode == wt_comboBox
		|| subtypeCode == wt_DateTime
		|| subtypeCode ==wt_Menu)
			TypeKey(cksAltUpArrow)
		elIf subtypeCode == wt_comboBox
		|| subtypeCode == wt_DateTime
		|| subtypeCode ==wt_Menu
			; the case where the form field context flag is not on.
			TypeKey(cksAltUpArrow)
		else
			PerformScript CloseListBox ()
		endIf
		return
	EndIf
endIf
PerformScript CloseListBox()
EndScript

script SayNextSentence()
if IsPCCursor()
&& !IsVirtualPCCursor()
	if (WindowCategoryIsWordDocument() && ActiveDocumentProtectionType() <= 0)
	|| IsEmailMessage()
		SetDocumentCaretMovementType(Unit_Sentence_Next)
		NextSentence()
		return
	EndIf
EndIf
PerformScript SayNextSentence()
EndScript

script SayPriorSentence()
if IsPCCursor()
&& !IsVirtualPCCursor()
	if (WindowCategoryIsWordDocument() && ActiveDocumentProtectionType() <= 0)
	|| IsEmailMessage()
		SetDocumentCaretMovementType(Unit_Sentence_Prior)
		PriorSentence()
		return
	EndIf
EndIf
PerformScript SayPriorSentence()
EndScript

Script SayNextParagraph()
if SayAllInProgress()
	SetSayAllRestart()
EndIf
if quickNavKeyTrapping()
	If !WindowCategoryIsWordDocument()
		return
	EndIf
endIf
if isPCCursor()
&& !IsVirtualPCCursor()
	if (WindowCategoryIsWordDocument() && ActiveDocumentProtectionType() <= 0)
	|| IsEmailMessage()
		if IsExtendedSelectionModeWatchActive()
			nSaySelectAfter = true
			SelectingText(TRUE)
			typeKey(cksControlDownArrow)
			SelectingText(FALSE)
			nSaySelectAfter = false
			return
		EndIf
		if IncludeBlankParagraphsForParagraphNavigation()
			;This navigation type is not recognized by CaretMovedEvent,
			;so add the extra parameter to SetDocumentCaretMovementType which will force the recognition of this movement:
		 	SetDocumentCaretMovementType(Unit_Paragraph_Next,Unit_Paragraph_Next)
			typeKey(cksControlDownArrow)
		else
		 	SetDocumentCaretMovementType(Unit_Paragraph_Next)
			NextParagraph()
		endIf
		return
	EndIf
endIf
performScript sayNextParagraph()
EndScript

Script SayPriorParagraph()
if SayAllInProgress()
	SetSayAllRestart()
EndIf
if quickNavKeyTrapping()
	If c_WordFocus.windowCategory!= wCat_document
		return
	EndIf
endIf
if isPCCursor()
&& !IsVirtualPCCursor()
	if (c_WordFocus.windowCategory == wCat_document&& ActiveDocumentProtectionType() <= 0)
	|| IsEmailMessage()
		if IsExtendedSelectionModeWatchActive()
			nSaySelectAfter = true
			SelectingText(TRUE)
			typeKey(cksControlUpArrow)
			SelectingText(FALSE)
			nSaySelectAfter = false
			return
		EndIf
		if IncludeBlankParagraphsForParagraphNavigation()
			;This navigation type is not recognized by CaretMovedEvent,
			;so add the extra parameter to SetDocumentCaretMovementType which will force the recognition of this movement:
			SetDocumentCaretMovementType(Unit_Paragraph_Prior,Unit_Paragraph_Prior)
			typeKey(cksControlUpArrow)
		else
			SetDocumentCaretMovementType(Unit_Paragraph_Prior)
			PriorParagraph()
		endIf
		return
	EndIf
EndIf
performScript sayPriorParagraph()
EndScript

Script NextItem()
if dialogActive()
	PerformScript NextDocumentWindowByPage()
	return
endIf
If !InDocument()
&& !DialogActive()
	IndicateControlType(wt_MDIClient,cscSpace,msgScrnSensitiveHelp1_s)
	return
EndIf
If isPCCursor()
&& WindowCategoryIsWordDocument()
	if QuickNavKeyTrapping()
		SetFindItemToPage()
	EndIf
	var string sMsg = FormatString(msgNextItem,GetFindItemTypeString())
	SayFormattedMessageWithVoice(vctx_message,ot_help,sMsg,cmsgSilent)
	if BrowserTargetIsPage()
		;The PageSectionColumnChangedEvent function will speak the line when the page actually changes.
		SetDocumentCaretMovementType(Unit_Page_Next)
		TypeKey(ksCtrlPageDown)
	else
		TypeKey(ksCtrlPageDown)
		delay(2,true)
		SayLine()
	endIf
	return
endIf
PerformScript NextDocumentWindow()
EndScript

Script PreviousItem()
if dialogActive()
	PerformScript PreviousDocumentWindowByPage()
	return
endIf
If !InDocument()
&& !DialogActive()
	IndicateControlType(wt_MDIClient,cscSpace,msgScrnSensitiveHelp1_s)
	return
EndIf
if IsPCCursor()
&& WindowCategoryIsWordDocument()
	if QuickNavKeyTrapping()
		SetFindItemToPage()
	EndIf
	var string smsg=FormatString(msgPrevItem,GetFindItemTypeString())
	SayFormattedMessageWithVoice(vctx_message,ot_help,sMsg,cMsgSilent)
	if BrowserTargetIsPage()
		;The PageSectionColumnChangedEvent function will speak the line when the page actually changes.
		SetDocumentCaretMovementType(Unit_Page_Prior)
		TypeKey(ksCtrlPageUp)
	else
		TypeKey(ksCtrlPageUp)
		delay(2,true)
		SayLine()
	endIf
	return
endIf
PerformScript PreviousDocumentWindow()
EndScript

Script TopOfFile()
if IsPCCursor()
&& !isVirtualPCCursor()
&& !InHJDialog()
&& WindowCategoryIsWordDocument()
&& !UserBufferIsActive()
	SetDocumentCaretMovementType(Unit_Line_First)
	JAWSTopOfFile()
	return
EndIf
PerformScript TopOfFile()
EndScript

Script BottomOfFile()
if IsPCCursor()
&& !isVirtualPCCursor()
&& !InHJDialog()
&& WindowCategoryIsWordDocument()
&& !UserBufferIsActive()
	SetDocumentCaretMovementType(Unit_Line_Last)
	JAWSBottomOfFile()
	return
EndIf
PerformScript BottomOfFile()
EndScript

void function SayWindowTitleForApplication(handle hAppWnd, handle hRealWnd, handle hCurWnd, int iTypeCode)
var
	string sMessageShort,
	string sMessageLong,
	string sAppTitle,
	string sPaneTitle,
	string sDocView,
	handle hWnd,
	string sClass
; Outlook already overrides this function where it needs to, then calls Word where it doesn't.
GetAppUIAWindowAndPaneTitles(sAppTitle,sPaneTitle)
if WindowCategoryIsWordDocument()
&& !OutlookIsActive()
	sDocView = GetActiveDocumentViewName()
	sMessageShort = FormatString(cMsg29_S, sAppTitle,
		FormatString(msgDocumentView_s,sDocView))
	sMessageLong = FormatString(cmsg29_L,sAppTitle,
		FormatString(msgDocumentView_l,sDocView))
elif (c_WordFocus.windowCategory!= WCAT_UNKNOWN && c_WordFocus.windowCategory!= WCAT_SPELL_CHECKER)
|| OnFileTabButton()
|| OnRibbonButton()
|| OnBackstageViewPane()
|| InNUIDialogWindow()
	if sPaneTitle
		sMessageShort = FormatString(cMsg29_S,sAppTitle,sPaneTitle)
		sMessageLong = FormatString(cmsg29_L,sAppTitle,sPaneTitle)
	endIf
endIf
if sMessageShort
|| sMessageLong
	SayFormattedMessage(ot_user_requested_information, sMessageLong, sMessageShort)
else
	SayWindowTitleForApplication(hAppWnd, hRealWnd, hCurWnd, iTypeCode)
endIf
EndFunction

Script UpALevel()
if !IsWordDocumentActive()
	;For handling active user buffer.
	;Call down the stack, but do not restrict the scope:
	performScript UpALevel()
	return
endIf
If UserBufferIsActive()
	performScript UpALevel()
	self::sayFocusedWindow()
	If QuickNavKeyTrapping()
	&& c_WordFocus.WindowClass == wc_WordMainDocumentWindow
		SetQuickKeyNavigationState(1)
	EndIf
	return
endIf
SayCurrentScriptKeyLabel()
; isDropdown is used for special menu types not recognised by menuModeEvent such as the Insert Table, Insert Excel worksheet and insert column menu buttons
var int isDropdown =(c_WordFocus.WindowClass ==wc_MSOCommandBar
		&& globalMenuMode==menubar_active)
EscapeKey()
if c_WordFocus.WindowClass == wc_WordMainDocumentWindow
	if !isSelectionModeActive()
	&& IsExtendedSelectionModeWatchActive()
		SayFormattedMessageWithVoice(vctx_message,ot_status,msgSelectionModeOff1_L,cmsgSilent)
		StopExtendedSelectionModeWatch()
	endIf
endIf
EndScript

Script WindowKeysHelp()
if UserBufferIsActive()
	UserBufferDeactivate()
EndIf
SayFormattedMessage(OT_USER_BUFFER, cmsgWindowKeysHelpOfficeQuickSearch+cscBufferNewLine+msgWinKeysHelp1_L,
	cmsgWindowKeysHelpOfficeQuickSearch+cscBufferNewLine+msgWinKeysHelp1_S)
UserBufferAddText(cscBufferNewLine+cmsgBuffExit)
EndScript

int Function WinwordHotKeyHelp()
if !getRunningFSProducts() & product_JAWS
	return
endIf
var	String strPage
if c_WordFocus.RealWindowName == wn_TemplatesAndAddIns
	SayFormattedMessage(OT_USER_BUFFER,msgWHotKeyHelp1_L,msgWHotKeyHelp1_S)
	return TRUE
elif c_WordFocus.RealWindowName == wn_PageSetup
	strPage = GetDialogPageName()
	if strPage == wn_Margins
		SayFormattedMessage(OT_USER_BUFFER,msgWHotKeyHelp2_L,msgWHotKeyHelp2_S)
	elif strPage == wn_PaperSize
		SayFormattedMessage(OT_USER_BUFFER,msgWHotKeyHelp3_L,msgWHotKeyHelp3_S)
	elif strPage == wn_PaperSource
		SayFormattedMessage(OT_USER_BUFFER,msgWHotKeyHelp4_L,msgWHotKeyHelp4_S)
	elif strPage == wn_Layout
		SayFormattedMessage(OT_USER_BUFFER,msgWHotKeyHelp5_L,msgWHotKeyHelp5_S)
	endIf
	return TRUE
elif c_WordFocus.RealWindowName == wn_InsertTable
	SayFormattedMessage(OT_USER_BUFFER,msgWHotKeyHelp6_L,msgWHotKeyHelp6_S)
	return TRUE
elif c_WordFocus.RealWindowName == wn_Formula
	SayFormattedMessage(OT_USER_BUFFER,msgWHotKeyHelp7_L,msgWHotKeyHelp7_S)
	return TRUE
elif c_WordFocus.RealWindowName == wn_Font
	strPage = GetDialogPageName()
	if strPage == wn_CharacterSpacing
		SayFormattedMessage(OT_USER_BUFFER,msgWHotKeyHelp8_L,msgWHotKeyHelp8_S)
	else
		SayFormattedMessage(OT_USER_BUFFER,msgWHotKeyHelp9_L,msgWHotKeyHelp9_S)
	endIf
	return TRUE
elif c_WordFocus.RealWindowName ==wn_Open
	SayFormattedMessage(OT_USER_BUFFER,msgWHotKeyHelp10_L,msgWHotKeyHelp10_S)
	; save as and open use same msgs_L here
	SayFormattedMessage(OT_USER_BUFFER,msgWHotKeyHelp11_L,msgWHotKeyHelp11_S)
	return true
elif c_WordFocus.RealWindowName ==wn_SaveAs
	SayFormattedMessage(OT_USER_BUFFER,msgWHotKeyHelp12_L,msgWHotKeyHelp12_S)
	SayFormattedMessage(OT_USER_BUFFER,msgWHotKeyHelp14_L,msgWHotKeyHelp14_S)
	SayFormattedMessage(OT_USER_BUFFER,msgWHotKeyHelp15_L,msgWHotKeyHelp15_S)
	return true
elif stringContains(c_WordFocus.RealWindowName,wn_SpellingAndGrammar)
|| stringContains(c_WordFocus.RealWindowName,wn_Spelling)
	SayFormattedMessage(OT_USER_BUFFER,msgWHotkeyHelp16_L,msgWHotkeyHelp16_S)
	return true
else
	return FALSE
endIf
EndFunction

Script HotKeyHelp()
if TouchNavigationHotKeys()
|| !getRunningFSProducts() & product_JAWS
	return
endIf
if MenusActive()
|| inHjDialog()
	performScript HotKeyHelp()
	return
endIf
var
	handle hwnd,
	string sOwner
if UserBufferIsActive()
	UserBufferDeactivate()
EndIf
hwnd = GetFocus()
If WindowCategoryIsWordDocument()
&& quickNavState()
&& !isVirtualPcCursor()
	if IsWordDocumentActive()
		SayFormattedMessage(ot_user_buffer,msgOutlookQuickKeys)
	else
		SayFormattedMessage(ot_user_buffer,msgQuickKeys)
	EndIf
	UserBufferAddText(cScBufferNewLine)
EndIf
if stringContains(c_WordFocus.RealWindowName,wn_SpellingAndGrammar)
|| stringContains(c_WordFocus.RealWindowName,wn_Spelling)
	SayFormattedMessage(OT_USER_BUFFER,msgJHotkeyHelp1_L,msgJHotkeyHelp1_S)
	UserBufferAddText(cScBufferNewLine)
	WinwordHotKeyHelp()
	UserBufferAddText(cscBufferNewLine+cmsgBuffexit)
	return
endIf
;For Outlook email messages:
;Want to display keys that relate to header fields.
sOwner = GetWindowOwner(hwnd)
if StringContains(StringSegment(sOwner,cscDoubleBackSlash, StringSegmentCount(sOwner,cscDoubleBackslash)),an_envelope)
	SayFormattedMessage(OT_USER_BUFFER, msgHotKeyHelpEmailMessageCompose)
	AddHotKeyLinks()
	Return
endIf
if OutlookIsActive()
	SayFormattedMessage(OT_USER_BUFFER,msgOutlookHotkeyHelp+cscBufferNewLine)
	AddAskFSCompanionHotKeyLink()
	UserBufferAddText(cscBufferNewLine+cMsgBuffExit)
	Return
EndIf
if isOutlineViewActive()
	SayFormattedMessage(OT_USER_BUFFER,msgJHotkeyHelpOutline+cscBufferNewLine)
endIf
SayFormattedMessage(OT_USER_BUFFER,msgJHotkeyHelp3_L+cScBufferNewLine)
AddAskFSCompanionHotKeyLink()
SayMessage(OT_USER_BUFFER, cscBufferNewLine+cmsgBuffexit)
EndScript

Script ScreenSensitiveHelp()
if !getRunningFSProducts() & product_JAWS
	return
endIf
if IsSameScript()
	AppFileTopic(topic_Microsoft_Word)
	return
endIf
If UserBufferIsActive()
	UserBufferDeactivate()
	SayFormattedMessage(OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
endIf
if UsingShortNameOfMultiLevelListObject()
	SayFormattedMessage(OT_USER_BUFFER,GetObjectName())
	return
endIf
if ScreenSensitiveHelpForOffice()
	return
endIf
var
	handle WinHandle,
	string TheClass,
	int CId
WinHandle = GetCurrentWindow()
TheClass = GetWindowClass(WinHandle)
if theClass == wc_wwf
	SayFormattedMessage(OT_USER_BUFFER, msgScrnSensitiveHelp1_L, msgScrnSensitiveHelp1_S)
	return
elif WindowCategoryIsWordDocument()
	if IsActiveCursorOnMathContent()
		sayMessage(OT_USER_BUFFER, msgMathContentScreenSensitiveHelp)
	else
		sayDocumentWindowHelp()
	endIf
	return
endIf
if theClass == wcF3Server
	; we are focused on an inline shape.
	UserBufferClear()
	UserBufferActivate()
	sayInlineShapeHelp() ; change to user buffer add of the get string
	JAWSTopOfFile()
	SayAll(FALSE)
	return
endIf
if StringContains(GetObjectName(), scBallon) ; help balloon
	SayFormattedMessage(ot_user_buffer, msgInformationBalloonScrnSensitiveHelp_l,msgInformationBalloonScrnSensitiveHelp_s)
	Return
ElIf IsExtendedSelectionModeWatchActive()
&& stringContains(c_WordFocus.RealWindowName, wn_FindAndReplace)
	if GetSelectedCharCount()
		SayFormattedMessage(OT_USER_BUFFER, FormatString(msgExtSelModeFindHelp1_L, GetSelectionInfo()))
	else ;nothing is selected
		SayFormattedMessage(OT_USER_BUFFER, msgExtSelModeFindHelp2_L)
	endIf
	return
endIf
if !inOptionsDialog(winHandle)
	if GlobalMenuMode == MENUBAR_ACTIVE
		SayFormattedMessage(OT_USER_BUFFER, msgScrnSensitiveHelp4_L, msgScrnSensitiveHelp4_S)
		return
	EndIf
EndIf
if GlobalMenuMode == MENU_ACTIVE
	self::ScreenSensitiveHelpForKnownClasses(wt_menu)
	return
endIf
PerformScript ScreenSensitiveHelp()
EndScript

string function GetCustomTutorMessage()
if !getRunningFSProducts() & product_JAWS
	return cscNull
endIf
Var
	handle hwnd,
	int iObjType,
	string sClass,
	int iWinType,
	string sObjName,
	int iState,
	string sValue
hwnd = GetFocus()
var int typeCode = getObjectTypeCode(TRUE) ; for edit fields
if OnEditFieldWithSuggestion()
	return msgSpellCheckSentenceTutor
endIf
if isResearchToolbar(hwnd)
	return self::GetCustomTutorMessage()
EndIf
iObjType = c_WordFocus.ObjectSubType
sClass = c_WordFocus.WindowClass
iWinType = c_WordFocus.WindowSubtype
If StringContains(GetObjectName(),scBallon)
	return msgInformationBalloonTutorHelp
elIf globalMenuMode
&& iObjType == wt_combobox
&& iWinType == wt_Edit
	return msgScreenSensitiveHelpEditCombo
Elif isStatusBarToolBar()
	sObjName=GetObjectName()
	if sObjName == wn_PageNumber
		GetObjectInfoByName(hWnd,sObjName,1,iObjType,iState,sValue)
		return sValue+cscSpace+self::GetCustomTutorMessage()
	elif sObjName == WN_WordCount
		GetObjectInfoByName(hWnd,sObjName,1,iObjType,iState,sValue)
		return sValue+cscSpace+self::GetCustomTutorMessage()
	endIf
	return self::GetCustomTutorMessage()
Else
	return self::GetCustomTutorMessage()
EndIf
EndFunction

string function GetBasicLayerHelpTextMSWord()
var
	string sHeading,
	string sMsg
sHeading = MarkupLayerHelpSectionTextAsHeading(msgBasicLayerHelpScreen_Heading_MSWord)
sMsg = ConvertTextToLinesWithHTMLLineBreak(msgBasicLayerHelpScreen_MSWord)
return sHeading+"<br/>"+sMsg+"<br/>"
EndFunction

string function GetBasicLayerHelpScreenText()
return GetBasicLayerHelpTextMSWord()
	+GetBasicLayerHelpTextGeneral()
	+GetBasicLayerHelpTextMessaging()
	+GetBasicLayerHelpTextSecondaryLayer()
EndFunction

int function DoAcceleratorsForSuggestionsGroup(object UIA, string keyName, object group)
if !group return FALSE endIf
if keyName != ksChange && keyName != ksChangeAll return FALSE endIf
var object tmp = group.findAll(TREESCOPE_Children,UIA.CreateRawViewCondition())
if tmp.count == 1
&& tmp(0).ClassName == "NetUIGroupHeader"
	sayMessage(OT_ERROR, msgNoSuggestions1_L)
	return
endIf
if keyName == ksChangeAll
	sayMessage(OT_ERROR, msgChangeAllError)
	return TRUE
endIf
if c_WordFocus.ObjectSubType == WT_SPLITBUTTON
	enterKey()
	return TRUE
endIf
var object condition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_SplitButtonControlTypeId)
if !condition return FALSE endIf
var object element = group.findFirst(TREESCOPE_SUBTREE, condition)
if !element return FALSE endIf
var object pattern = element.GetInvokePattern()
if !pattern return FALSE endIf
if !pattern.Invoke() return FALSE endIf
oSuggestionSplitButton = null()
if getObjectTypeCode() == WT_EDIT
	; User pressed one of these buttons in the Current Sentence read-only edit box.
	oSuggestionSplitButton = null()
endIf
return TRUE
endFunction

int function doAcceleratorsForOtherActionsGroup(string keyName, object group)
if !group return FALSE endIf
if keyName != ksAddToDictionary
&& keyName != ksIgnore
&& keyName != ksIgnoreAll
	return FALSE
endIf
var object condition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_ButtonControlTypeId)
if !condition return FALSE endIf
var object buttons = group.findAll(TREESCOPE_SUBTREE, condition)
if !buttons.count return FALSE endIf
var object element
if keyName == ksIgnore
	element = buttons(0)
elIf keyName == ksIgnoreAll
	element = buttons(1)
elIf keyName == ksAddToDictionary
	element = buttons(2)
endIf
if !element || !element.isEnabled  return FALSE endIf
var object pattern = element.GetInvokePattern()
if !pattern return FALSE endIf
if !pattern.Invoke()
	pattern = element.GetLegacyIAccessiblePattern()
	if pattern.defaultAction
		pattern.doDefaultAction()
	else
		return FALSE ; no action was taken on button, let default keystroke pass through.
	endIf
endIf
if getObjectTypeCode() == WT_EDIT
	; User pressed one of these buttons in the Current Sentence read-only edit box.
	oSuggestionSplitButton = null()
endIf
return TRUE
endFunction

int function doAcceleratorsForSpellCheckerWithSplitButtons(string keyName)
var object UIA = CreateObjectEx("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !UIA return false endIf
var object focusElement = UIA.GetFocusedElement().buildUpdatedCache()
if !focusElement return FALSE endIf
var object treewalker = UIA.RawViewWalker()
if !treewalker return FALSE endIf
treewalker.currentElement = focusElement
var
	object notInDictionaryGroup,
	object suggestionsGroup,
	object otherActionsGroup
if !getControlGroupsForSpellCheckerWithSplitButtons(UIA, treewalker,
		notInDictionaryGroup, suggestionsGroup, otherActionsGroup)
	return FALSE
endIf
if keyName == ksChange || keyName == ksChangeAll
	return DoAcceleratorsForSuggestionsGroup(UIA, keyName, suggestionsGroup)
elIf keyName == ksAddToDictionary || keyName == ksIgnore || keyName == ksIgnoreAll
	return doAcceleratorsForOtherActionsGroup(keyName, otherActionsGroup)
endIf
return FALSE
endFunction

script SpellCheckAccelerators()
var	string keyName = stringLower(getCurrentScriptKeyName())
;For all accelerators from within Spellcheck dialog such as Change, Ignore, Change All, Ignore All, etc.
SayCurrentScriptKeyLabel()
if c_WordFocus.InProofingPaneSpellCheckWithSplitButtons
	if doAcceleratorsForSpellCheckerWithSplitButtons(keyName)
		return
	endIf
endIf
typeCurrentScriptKey()
if  c_WordFocus.windowCategory == WCAT_TASK_PANE
&& c_WordFocus.ObjectSubType == WT_BUTTON
	if c_WordFocus.InProofingPaneSpellCheck
		;These accelerators don't work, so need to speak a message to that effect:
		sayMessage(OT_ERROR, msgProofingAcceleratorsNotAvailable)
	endIf
endIf
endScript

String Function GetHeaderForNewAddressListField ()
var
	object oElement,
	object oHeaderItemCondition,
	object oHeaderItem,
	object oHeaderItems,
	object oRealWindow,
	int iHeaderXCoordinate,
	int iHeaderYCoordinate,
	int x,
	int y
oRealWindow = FSUIAGetElementFromHandle (GetRealWindow (GetCurrentWindow ()))
oElement = FSUIAGetFocusedElement ()
oHeaderItemCondition = FSUIACreateIntPropertyCondition (UIA_ControlTypePropertyId, UIA_HeaderItemControlTypeId)
oHeaderItems = oRealWindow.findAll(TreeScope_Descendants, OHeaderItemCondition)
oHeaderItem = GetFirstObjectWithClickablePoint (oHeaderItems)
oElement.GetClickablePoint( intRef(x), intRef(y))
oHeaderItem.GetClickablePoint(intRef(iHeaderXCoordinate), intRef(iHeaderYCoordinate))
oHeaderItem = FSUIAGetElementFromPoint (x, iHeaderYCoordinate)
return oHeaderItem.name
EndFunction

Object Function GetFirstObjectWithClickablePoint (object oArray)
var
	object oElement,
	int x,
	int y
ForEach oElement in oArray
	oElement.GetClickablePoint(intRef(x), intRef(y))
	if x != 0
	&& y != 0
		return oElement
	endIf
EndForEach
return Null()
EndFunction

script SpeakPlaceMarkers()
if c_WordFocus.windowCategory == WCAT_DOCUMENT
&& isPCCursor()
	performScript ReturnToMarkedPlace()
	else
	performScript SpeakPlaceMarkers()
	endIf
endScript

int function ShouldIncludeView(string viewName)
if stringLeft(viewName,11) == cWordPerfectPrefixJBSBase then
	return false
endIf
if viewName == cWordClassicJBSBase then
	return false
endIf

return true
endFunction

script PictureSmartWithControl (optional int serviceOptions)
var int forceCursor = c_WordFocus.IsWordDocumentActive > 0
PictureSmartWithControlCommon (PSServiceOptions_Single | serviceOptions, forceCursor)
endScript

script PictureSmartWithControlMultiService (optional int serviceOptions)
var int forceCursor = c_WordFocus.IsWordDocumentActive > 0
PictureSmartWithControlCommon (PSServiceOptions_Multi | serviceOptions, forceCursor)
endScript

int function InEmptyCopilotEditWithSuggestions()
if GetObjectAutomationId(0) != AutomationID_COPILOT_PROMPT
	&& !StringIsBlank(GetObjectValue ())
	return false
EndIf
	
var object menu
menu = FSUIAGetFocusedElement().ControllerFor(0)
if !menu
	return false
endIf

return true
EndFunction

int function ShouldIgnoreSaySecondaryFocusSelectedItem()
if InEmptyCopilotEditWithSuggestions() then
	return false
EndIf

return ShouldIgnoreSaySecondaryFocusSelectedItem()
endFunction

Void Function SpeakSuggestionsAvailable()
if !InEmptyCopilotEditWithSuggestions()
	return
EndIf
	
var string text = GetSecondaryFocusSelectionText()
if !text then
	SayUsingVoice (VCTX_MESSAGE, msgSuggestionsAvailable, OT_line)
EndIf
EndFunction