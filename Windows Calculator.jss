;Copyright 2015-2024 Freedom Scientific, Inc.
; JAWS script file for Windows 10 Calculator

include "hjConst.jsh"
include "locale.jsh"
include "UIA.jsh"
include "hjGlobal.jsh"
include "common.jsm"
;These scripts were renamed from "win8Calculator.*".
;Win8Calculator.jsm continues to be used as the message file here,
;to avoid the need for retranslation of the messages after renaming the script files.
include "Win8Calculator.jsm"

const
	oFSUIA_Win8Calculator_EventFunctionNamePrefix = "Win8Calculator"
globals
	object oFSUIA_Win8Calculator,
	object oWin8CalculatorTreewalker,
	collection c_CalcUIA
		; Stores various UIA frequently accessed information.
		; Note that not all members are available at all times.
		;
		; Members available at all times are:
		; AppElement -- The root element for the application.
		; FocusElement -- The current UIA focus element.
		; PrevFocusElement -- The prior UIA focus element tracked in this application.
		; modeHeaderElement -- The element where the current mode name is shown.
		;
		; Members available for Standard, Scientific and Programmer modes:
		; ResultsElement -- The element where calculator results appear.
		; ExpressionElement -- The element where the current expression appears.
		; NormalOutputElement -- The element which is a descendant of the results element, and is used to speak the calculator results field as it changes.
		;
		; Members available for the various Converter modes:
		; Value1Element -- The field for inputting the value to be converted.
		; Value2Element -- The field for outputting the converted value.
		; NormalOutputElement -- The grandchild of Value1, which contains the relevant text for the input.

;Used to control when and whether events should be announced based on which key was pressed or script was run:
const
	Scripts_OperatorsCauseNotification = "plus|minus|multiply|divide|PercentOrModulo",
	NotificationScheduledDelay = 15  ;tenths of a second
globals
	string DigitsList,
	collection c_Notification,
		; Used when we want to delay notification output when navigating in a converter conbo box.
		; We don't want the notification to announce before the current combo box item during navigation,
		; so we delay any announcement until there is a significant pause in navigation.
		;
		; Members are:
		; ScheduleID -- The id used when scheduling the function to speak the notification.
		; text -- The text received by the notification event and used by the delayed function.
	collection c_KeyEvent
		; Used for managing when and whether notifications should be announced based on which key press caused the notification.
		;
		; Members are:
		; LastKeyWasScript -- True if the most recently pressed key was a scripted key.
		; LastKeyName -- The name of the most recently pressed key.
		; IgnoreNotificationForDigits -- True if the key pressed was a digit or decimal separator, and notifications should be ignored.
		; ScheduleIDClearIgnoreNotification -- The id of the function which clears ignoring notifications.

;UIA listener for the calendars:
const
	oFSUIA_Win8Calculator_Calendar_EventFunctionNamePrefix = "Calendar"
globals
	object oFSUIA_Calendar_listener,
	int ScheduleID_StartListeningForCalendarChanges

const
;activityIDs for notifications:
	activityID_DisplayUpdated = "DisplayUpdated",
;AutomationID's and classes:
	AutomationID_ImmersiveBackground = "ImmersiveBackground",
	AutomationID_CalculatorResults = "CalculatorResults",
	AutomationID_Header = "Header",
	AutomationID_CalculatorExpression = "CalculatorExpression",
	AutomationID_NormalOutput = "normalOutput",
	AutomationID_NavButton = "NavButton",
	AutomationID_Divide = "divideButton",
	AutomationID_Multiply = "multiplyButton",
	AutomationID_Minus = "minusButton",
	AutomationID_Plus = "plusButton",
	AutomationID_Equals = "equalButton",
	AutomationID_LeftParen = "openParanthesisButton",
	AutomationID_RightParen = "closeParanthesisButton",
	AutomationID_Percent = "percentButton",
	AutomationID_Modulo = "modButton",
	AutomationID_ClearHistory = "ClearHistory",
	AutomationID_ClearAllMemory = "ClearMemoryButton",
	AutomationID_MemoryRecall = "MemRecall",
	AutomationID_MemoryAdd = "MemPlus",
	AutomationID_MemorySubtract = "MemMinus",
	AutomationID_MemoryStore = "memButton",
	AutomationID_Factorial = "factorialButton",
	AutomationID_Square = "xpower2Button",
	AutomationID_SquareRoot = "squareRootButton",
	AutomationID_Cube = "xpower3Button",
	AutomationID_EToTheExponent = "powerOfEButton",
	AutomationID_Pi = "piButton",
	AutomationID_Log = "logBase10Button",
	AutomationID_NaturalLog = "logBaseEButton",
	AutomationID_AntiLog = "powerOf10Button",
	AutomationID_Reciprocal = "invertButton",
	AutomationID_Sin = "sinButton",
	AutomationID_Cos = "cosButton",
	AutomationID_Tan = "tanButton",
	AutomationID_HyperbolicSin = "sinhButton",
	AutomationID_HyperbolicCos = "coshButton",
	AutomationID_HyperbolicTan = "tanhButton",
	AutomationID_ScientificNotation = "ftoeButton",
	Class_Button = "Button",
	Class_RadioButton = "RadioButton",
	Class_ToggleButton = "ToggleButton",
;For Date Calculation mode:
	AutomationID_DateDiffAllUnitsResultLabel = "DateDiffAllUnitsResultLabel",
	AutomationID_DateResultLabel = "DateResultLabel",
	AutomationID_DateDiff_FromDate = "DateDiff_FromDate",
	AutomationID_DateDiff_ToDate = "DateDiff_ToDate",
	AutomationID_AddSubtract_FromDate = "AddSubtract_FromDate",
	AutomationID_AddOption = "AddOption",
	AutomationID_SubtractOption = "SubtractOption",
	AutomationID_HeaderButton = "HeaderButton",
	AutomationID_CalendarView = "CalendarView",
	AutomationID_PreviousButton = "PreviousButton",
	AutomationID_NextButton = "NextButton",
	class_CalendarDatePicker = "CalendarDatePicker",
	Class_CalendarView = "CalendarView",
	Class_CalendarViewDayItem = "CalendarViewDayItem",
	Class_CalendarViewItem = "CalendarViewItem",
	Class_TextBlock = "TextBlock",
;for input fields in other modes:
	AutomationID_Value1 = "Value1",
	AutomationID_Value2 = "Value2",
;For combobox selection in various modes:
	AutomationID_ContentPresenter = "ContentPresenter",
; UIANotificationEvent nonlocalizable string parameter determines reason for notification:
	DisplayNotificationActivityID = "DisplayUpdated",
	Class_ComboBoxItem = "ComboBoxItem"

globals
	string TrigButtonAutomationIDList


void function AutoStartEvent()
InitWin8Calculator()
if !c_KeyEvent c_KeyEvent = new collection endIf
if !c_Notification c_Notification = new collection endIf
var string locale_DecimalSeparator = GetUserLocaleInfo(LOCALE_SDECIMAL)
DigitsList = "0123456789ABCDEF"+locale_DecimalSeparator
TrigButtonAutomationIDList = AutomationID_Sin+KeyLabelSeparator
		+AutomationID_Cos+KeyLabelSeparator
		+AutomationID_Tan+KeyLabelSeparator
		+AutomationID_HyperbolicSin+KeyLabelSeparator
		+AutomationID_HyperbolicCos+KeyLabelSeparator
		+AutomationID_HyperbolicTan
EndFunction

void function AutoFinishEvent()
oFSUIA_Win8Calculator = Null()
oWin8CalculatorTreewalker = Null()
oFSUIA_Calendar_Listener = Null()
CollectionRemoveAll(c_KeyEvent )
c_KeyEvent = Null()
ClearAnyScheduledNotifications()
CollectionRemoveAll(c_Notification)
c_Notification = Null()
CollectionRemoveAll(c_CalcUIA)
c_CalcUIA = Null()
EndFunction

void function UIANotificationEvent(int notificationKind, int notificationProcessing, string displayString, string activityId, string appname)
if ActivityID == DisplayNotificationActivityID then
; "Display is ..." notification from the calculator itself:
	return
endIf
UIANotificationEvent(notificationKind, notificationProcessing, displayString, activityId, appName)
endFunction

int function InitFSUIAObjectAndTreewalker()
oFSUIA_Win8Calculator = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !oFSUIA_Win8Calculator
|| !ComAttachEvents(oFSUIA_Win8Calculator,oFSUIA_Win8Calculator_EventFunctionNamePrefix)
	return false
endIf
var object focusElement = oFSUIA_Win8Calculator.GetFocusedElement()
var object processCondition = oFSUIA_Win8Calculator.CreateIntPropertyCondition(UIA_ProcessIdPropertyId,focusElement.ProcessID)
if !processCondition
	oFSUIA_Win8Calculator = Null()
	return false
endIf
oWin8CalculatorTreewalker = oFSUIA_Win8Calculator.CreateTreeWalker(processCondition)
if !oWin8CalculatorTreewalker
	oFSUIA_Win8Calculator = Null()
	return false
endIf
return true
EndFunction

void function FindNormalOutput(object element)
if !element return false endIf
c_CalcUIA.NormalOutputElement = Null()
;The normal output element is the grandchild of the focusable calculator element for input:
oWin8CalculatorTreewalker.currentElement = element
oWin8CalculatorTreewalker.gotoFirstChild()
oWin8CalculatorTreewalker.gotoFirstChild()
if oWin8CalculatorTreewalker.currentElement.automationID == AutomationID_NormalOutput 
	c_CalcUIA.NormalOutputElement = oWin8CalculatorTreewalker.currentElement
endIf
EndFunction

int function UpdateFocusElementCache()
var object focusElement = oFSUIA_Win8Calculator.GetFocusedElement().BuildUpdatedCache()
if (!focusElement)
	c_CalcUIA.focusElement = Null()
	return false
endIf
c_CalcUIA.focusElement = FocusElement
return true
EndFunction

int function UpdateAppElementCache()
if (!c_CalcUIA.focusElement) UpdateFocusElementCache() endIf
c_CalcUIA.appElement = Null()
if (!c_CalcUIA.focusElement) return false endIf
oWin8CalculatorTreewalker.currentElement = c_CalcUIA.focusElement
var object appElement = c_CalcUIA.focusElement
while (oWin8CalculatorTreewalker.gotoParent()) appElement = oWin8CalculatorTreewalker.currentElement endWhile
if (!appElement) return false endIf
c_CalcUIA.appElement = AppElement
return true
EndFunction

void function StartListeningForCalendarChanges()
ScheduleID_StartListeningForCalendarChanges = 0
oFSUIA_Calendar_Listener = Null()
oWin8CalculatorTreewalker.currentElement = c_CalcUIA.focusElement
while oWin8CalculatorTreewalker.currentElement.controlType != UIA_CalendarControlTypeID && oWin8CalculatorTreewalker.gotoParent() endWhile
oWin8CalculatorTreewalker.gotoFirstChild()
if oWin8CalculatorTreewalker.currentElement.automationID != AutomationID_HeaderButton return endIf
oFSUIA_Calendar_Listener = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !oFSUIA_Calendar_Listener
|| !ComAttachEvents(oFSUIA_Calendar_Listener,oFSUIA_Win8Calculator_Calendar_EventFunctionNamePrefix)
|| !oFSUIA_Calendar_Listener.AddPropertyChangedEventHandler(UIA_NamePropertyId, oWin8CalculatorTreewalker.currentElement, TreeScope_Element)
	oFSUIA_Calendar_Listener = Null()
	return
endIf
EndFunction

void function AcquireSpecialElementsForMode()
;The results, normal output and calculator expression  elements are present in the Standard, Scientific and Programmer modes:
c_CalcUIA.resultsElement = Null()
c_CalcUIA.resultsElement = GetCalculatorResultsElement()
if c_CalcUIA.resultsElement
	c_CalcUIA.ExpressionElement = Null()
	c_CalcUIA.ExpressionElement = GetCalculatorExpressionElement()
	FindNormalOutput(c_CalcUIA.resultsElement)
	return
endIf
;The Value1 and Value2 elements are present in the converter modes:
c_CalcUIA.value1Element = Null()
c_CalcUIA.value1Element = GetCalculatorValue1Element()
if c_CalcUIA.value1Element
	c_CalcUIA.value2Element = Null()
	c_CalcUIA.value2Element = GetCalculatorValue2Element()
	FindNormalOutput(c_CalcUIA.value1Element)
	return
endIf
EndFunction

void function InitWin8Calculator()
if (!InitFSUIAObjectAndTreewalker()) return endIf
if (!c_CalcUIA) c_CalcUIA = new collection endIf
if !UpdateFocusElementCache()
|| !UpdateAppElementCache()
	oFSUIA_Win8Calculator = Null()
	oWin8CalculatorTreewalker = Null()
	return
endIf
c_CalcUIA.PrevFocusElement = Null()
c_CalcUIA.modeHeaderElement = GetCalculatorModeHeaderElement()
AcquireSpecialElementsForMode()
if !oFSUIA_Win8Calculator.AddFocusChangedEventHandler()
|| !oFSUIA_Win8Calculator.AddPropertyChangedEventHandler(UIA_NamePropertyId, c_CalcUIA.appElement, TreeScope_Children)
|| !oFSUIA_Win8Calculator.AddPropertyChangedEventHandler(UIA_SelectionItemIsSelectedPropertyId, c_CalcUIA.appElement, TreeScope_descendants)
|| !oFSUIA_Win8Calculator.AddAutomationEventHandler(UIA_SelectionItem_ElementSelectedEventId, c_CalcUIA.appElement, TreeScope_Descendants)
|| !oFSUIA_Win8Calculator.AddAutomationEventHandler(UIA_LiveRegionChangedEventId, c_CalcUIA.appElement, Treescope_Children)
|| !oFSUIA_Win8Calculator.AddNotificationEventHandler(c_CalcUIA.appElement,TreeScope_Descendants)
	CollectionRemoveAll(c_CalcUIA)
	oFSUIA_Win8Calculator = Null()
	oWin8CalculatorTreewalker = Null()
	return
endIf
BrailleRefresh()
EndFunction

void function Win8CalculatorFocusChangedEvent (object element)
if ScheduleID_StartListeningForCalendarChanges
	UnscheduleFunction(ScheduleID_StartListeningForCalendarChanges)
	ScheduleID_StartListeningForCalendarChanges = 0
endIf
c_CalcUIA.PrevFocusElement = c_CalcUIA.focusElement
c_CalcUIA.focusElement = element
;When the app gains focus,
;this element is not up to date:
if c_CalcUIA.focusElement.AutomationID == AutomationID_ImmersiveBackground
;When a toast appears, this function fires with the focus as the toast element,
;even though the focus is actually still in the calculator:
|| c_CalcUIA.focusElement.AutomationID == UIAAutomationID_NormalToastView 
	c_CalcUIA.focusElement = oFSUIA_Win8Calculator.GetFocusedElement().BuildUpdatedCache()
endIf
;There are no UIA events which can be reliably used to detect the calendar popup window appearance and disappearance,
;so we check for the focus element to determine if the listener should be added or removed.
var int inCalendarPopup = FocusElementIsInCalendarPopupWindow()
if inCalendarPopup
	if !oFSUIA_Calendar_listener
		ScheduleID_StartListeningForCalendarChanges = ScheduleFunction("StartListeningForCalendarChanges",1)
	endIf
	if c_CalcUIA.focusElement.className == Class_CalendarViewDayItem
		;Cache header data for day of week:
		c_CalcUIA.prevHeader = c_CalcUIA.header
		c_CalcUIA.header = GetCurrentWeekDayCalendarItemHeader()
		;And determine if the current item is selected:
		c_CalcUIA.isSelected = c_CalcUIA.focusElement.GetSelectionItemPattern().isSelected
	else
		c_CalcUIA.prevHeader = cscNull
		c_CalcUIA.header = cscNull
		c_CalcUIA.isSelected = false
	endIf
else ;not in calendar popup
	if oFSUIA_Calendar_listener
		oFSUIA_Calendar_listener = Null()
		c_CalcUIA.prevHeader = cscNull
		c_CalcUIA.header = cscNull
		c_CalcUIA.isSelected = false
	endIf
endIf
EndFunction

void function CalendarPropertyChangedEvent(object element, int propertyID, variant newValue)
;This event listens for month and year changes while navigating the calendar grid in the date calculation mode.
if element.hasKeyboardFocus
|| !element.isEnabled
	;the year header button becomes disabled when the calendar grid shows years.
	return
endIf
Say(element.name,ot_JAWS_message)
EndFunction

void function SpeakScheduledNotification()
c_Notification.ScheduleID = 0
Say(c_Notification.text,ot_line)
EndFunction

void function ClearAnyScheduledNotifications()
if !c_Notification.ScheduleID return endIf
UnscheduleFunction(c_Notification.ScheduleID )
c_Notification.ScheduleID  = 0
c_Notification.text = cscNull
EndFunction

void function Win8CalculatorNotificationEvent(object element, int notificationKind,
	int notificationProcessing,string displayString,string activityID)
ClearAnyScheduledNotifications()
if notificationProcessing != NotificationProcessing_ImportantMostRecent
|| activityID != activityID_DisplayUpdated
	return
endIf
if GetObjectSubtypeCode() == wt_combobox
	;Wait to announce the notification,
	;we don't want to announce the notification before each combo box item navigated to:
	c_Notification.text = displayString
	c_Notification.ScheduleID = ScheduleFunction("SpeakScheduledNotification",NotificationScheduledDelay)
	return
endIf
if c_KeyEvent.ignoreNotificationForDigits
	;We don't want the notification to speak,
	;since it will speak the entire display rather than just the typed digits.
	;We announce only the typed digit or decimal separator in KeyPressedEvent.
	BrailleRefresh()
	return
elif c_KeyEvent.LastKeyWasScript 
	var string scriptName = StringLower(GetScriptAssignedTo(c_KeyEvent.lastKeyName))
	if StringSegmentIndex(Scripts_OperatorsCauseNotification, "|",scriptName)
		;Operators will be spoken by the scripts.
		;We don't want the notification spoken when they are used,
		;since this causes the entire display plus the operator to be spoken:
		BrailleRefresh()
		return
	endIf
endIf
Say(ChopStartOfResultsDisplayName(DisplayString),ot_line)
BrailleRefresh()
EndFunction

void function Win8CalculatorPropertyChangedEvent(object element, int propertyID, variant newValue)
if propertyID == UIA_NamePropertyId
	if element.AutomationID == AutomationID_Header
		;the calculator mode changed:
		Say(element.name,ot_dialog_name)
		AcquireSpecialElementsForMode()
	elif element.AutomationID == AutomationID_DateResultLabel
		;For Date Calculation:
		Say(element.name,ot_screen_message)
	endIf
elif propertyID == UIA_SelectionItemIsSelectedPropertyId
&& element.GetSelectionItemPattern().isSelected == UIATrue
	if element.automationID == AutomationID_AddOption
	|| element.automationID == AutomationID_SubtractOption
		;These buttons require a click to become selected,
		;The JAWS events do not detect this change, so we catch it here:
		Say(cmsg215_L,OT_ITEM_STATE)
		;BrailleRefresh is not sufficient to do all the updating, so:
		MSAARefresh()
	endIf
endIf
EndFunction

void function Win8CalculatorAutomationEvent(object element, int eventID)
if eventID == UIA_SelectionItem_ElementSelectedEventId
	;if element.automationID == AutomationID_ContentPresenter
	if element.controlType == UIA_ListItemControlTypeID
	&& element.className == Class_ComboBoxItem 
		;JAWS detects a value change, but does not obtain the value:
		MSAARefresh()
	endIf
elif eventID == UIA_LiveRegionChangedEventId
	if element.automationID == AutomationID_DateDiffAllUnitsResultLabel 
		Say(element.name,ot_user_requested_information)
	endIf
endIf
EndFunction

object function FindCalculatorObjectWithCondition(object condition)
if (!oFSUIA_Win8Calculator || !condition) return Null() endIf
if !c_CalcUIA.AppElement
	UpdateAppElementCache()
	if (!c_CalcUIA.AppElement) return Null() endIf
endIf
return c_CalcUIA.AppElement.FindFirst(treeScope_descendants,condition)
EndFunction

object  function GetCalculatorResultsElement()
return FindCalculatorObjectWithCondition(oFSUIA_Win8Calculator.CreateStringPropertyCondition(UIA_AutomationIDPropertyId,AutomationID_CalculatorResults))
EndFunction

object function GetCalculatorExpressionElement()
return FindCalculatorObjectWithCondition(oFSUIA_Win8Calculator.CreateStringPropertyCondition(UIA_AutomationIDPropertyId,AutomationID_CalculatorExpression))
EndFunction

object function GetCalculatorValue1Element()
return FindCalculatorObjectWithCondition(oFSUIA_Win8Calculator.CreateStringPropertyCondition(UIA_AutomationIDPropertyId,AutomationID_Value1))
EndFunction

object function GetCalculatorValue2Element()
return FindCalculatorObjectWithCondition(oFSUIA_Win8Calculator.CreateStringPropertyCondition(UIA_AutomationIDPropertyId,AutomationID_Value2))
EndFunction

object function GetCalculatorModeHeaderElement()
return FindCalculatorObjectWithCondition(oFSUIA_Win8Calculator.CreateStringPropertyCondition(UIA_AutomationIDPropertyId,AutomationID_Header))
EndFunction

string function ChopStartOfResultsDisplayName(string name)
if StringStartsWith(name,WN_CalculatorResults)
		return StringTrimLeadingBlanks(StringChopLeft(name,StringLength(WN_CalculatorResults)))
endIf
return name
EndFunction

int function onInputField()
if (UserBufferIsActive() || MenusActive()) return false endIf
var string id = GetObjectAutomationID()
return GetObjectSubtypeCode() == wt_Static
	&& (ID == AutomationID_CalculatorResults
		|| id == AutomationID_Value1)
EndFunction

int function OnDisplayField()
return (!UserBufferIsActive() && !MenusActive())
	&& GetObjectAutomationID() == AutomationID_CalculatorResults
EndFunction

int function OnCalculatorButton()
if (UserBufferIsActive() || MenusActive()) return false endIf
var string sProperty = GetObjectAutomationID()
if sProperty == AutomationID_NavButton
|| sProperty == AutomationID_HeaderButton
|| sProperty == AutomationID_PreviousButton
|| sProperty == AutomationID_NextButton
	return false
endIf
sProperty = GetObjectClassName()
return sProperty == Class_Button
	|| sProperty == Class_RadioButton
	|| sProperty == Class_ToggleButton
EndFunction

int function OnCalculatorToggleButton()
return (!UserBufferIsActive() && !MenusActive())
	&& GetObjectClassName() == Class_ToggleButton
EndFunction

int function OnCalendarControl()
return (!UserBufferIsActive() && !MenusActive())
	&& GetObjectClassName() == class_CalendarDatePicker
EndFunction

int function FocusElementIsInCalendarPopupWindow()
if (UserBufferIsActive() || MenusActive()) return false endIf
;UIA shows the element in the grid which has the keyboard focus is a button with a text child,
;but JAWS sees the focus as the text element which is the child of the button:
var string class = GetObjectClassName(1)
if class == Class_CalendarViewItem
|| class == Class_CalendarViewDayItem
	return true
endIf
var string ID = GetObjectAutomationID()
if ID != AutomationID_HeaderButton
&& ID != AutomationID_PreviousButton
&& ID != AutomationID_NextButton
	return false
endIf
return GetObjectAutomationID(1) == AutomationID_CalendarView
EndFunction

int function OnCalendarViewItemButton()
;UIA shows the element in the grid which has the keyboard focus is a button with a text child,
;but JAWS sees the focus as the text element which is the child of the button:
return (!UserBufferIsActive()  && !MenusActive())
	&& GetObjectClassName(1) == Class_CalendarViewItem
EndFunction

int function OnCalendarHeaderButton()
return (!UserBufferIsActive() && !MenusActive())
	&& GetObjectAutomationID() == AutomationID_HeaderButton
	&& GetObjectAutomationID(1) == AutomationID_CalendarView 
EndFunction

int function OnCalendarViewDayItem()
if (UserBufferIsActive() || MenusActive()) return false endIf
return GetObjectClassName(1) == Class_CalendarViewDayItem 
EndFunction

int function OnCalendarViewGridItem()
;Is this a day, month or year item in the calendar grid?
;UIA shows the element in the grid which has the keyboard focus is a button with a text child,
;but JAWS sees the focus as the text element which is the child of the button:
if (UserBufferIsActive() || MenusActive()) return false endIf
var string class = GetObjectClassName(1)
return class == Class_CalendarViewItem
	|| class == Class_CalendarViewDayItem
EndFunction

int function OnCalendarTableButtonOutsideOfGrid()
;The expanded calendar is implemented via a table,
;The first controls in the table are located outside of the table grid.
if (UserBufferIsActive() || MenusActive()) return false endIf
var string sProperty = GetObjectAutomationID()
if sProperty != AutomationID_HeaderButton
&& sProperty != AutomationID_PreviousButton
&& sProperty != AutomationID_NextButton
	return false
endIf
return GetObjectAutomationID(1) == AutomationID_CalendarView 
EndFunction

string function GetCurrentWeekDayCalendarItemHeader()
if !OnCalendarViewDayItem() return endIf
var object pattern = c_CalcUIA.focusElement.GetTableItemPattern()
if !pattern return cscNull endIf
var object o = pattern.GetColumnHeaderItems()
if !o || !o.count return cscNull endIf
return o(0).name
EndFunction

int function SayCalendarViewDayItem(optional int includeHeader)
if !OnCalendarViewDayItem() return false endIf
if c_CalcUIA.isSelected 
	Say(cmsg215_L,ot_item_state)
endIf
Say(c_CalcUIA.focusElement.name,ot_line)
if includeHeader
|| (c_CalcUIA.header && c_CalcUIA.header != c_CalcUIA.prevHeader)
|| GetScriptAssignedTo(GetCurrentScriptKeyName()) == "SayWindowPromptAndText"
	Say(c_CalcUIA.header,ot_line)
endIf
return true
EndFunction

int function SayCalendarControl()
if !OnCalendarControl() return false endIf
;The calendar buttons which appear when calculating the difference between two dates
;has the label as the object name, and the date as the object value.
;The calendar button which appears when adding or subtracting years/months/days from a date
;does not have the label as the object name.
var string ID = GetObjectAutomationID()
if id != AutomationID_AddSubtract_FromDate 
	Say(GetObjectName(),ot_control_name)
endIf
IndicateControlType(wt_button,GetObjectValue(),cmsgSilent)
return true
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var int nType
if nLevel == 2
	nType = GetObjectSubtypeCode(SOURCE_CACHED_DATA,2)
	if nType == wt_dialog_page
	&& OnCalendarViewItemButton()
	&& GetObjectSubtypeCode(SOURCE_CACHED_DATA,3) == wt_table
		;The table is not announced when a button inside the table but outside of the grid gains focus.
		;Instead, the table is announced when focus moves into the table grid.
		;By announcing the table only when the grid gains focus,
		;it makes the logic of how to use the calendar controls slightly more intuitive.
		SayObjectTypeAndText(3)
	endIf
elif nLevel == 1
	nType = GetObjectSubtypeCode(SOURCE_CACHED_DATA,1)
	if nType == wt_GroupBox
		if GetObjectName(false,nLevel) == GetObjectName()
			;The display field parent is a group with the same name as the focused field:
			return
		endIf
	elif nType == wt_table
	&& OnCalendarTableButtonOutsideOfGrid()
		;The expanded calendar is implemented via a table,
		;but the first buttons in the table are outside of the table's grid.
		;The buttons outside of the grid must be moved through via tab,
		;where once inside the table grid the arrow keys navigate the grid items.
		;The data we gather for the name and value of the table is confusing when announced outside of the grid,
		;so it is probably best to ignore the table at this point and announce it when the grid is entered.
		return
	elif nType == WT_TABLECELL
	&& OnCalendarViewDayItem()
		;When navigating the calendar day items we get a focus change depth of 1.
		;the text in the table cell at level 1 is duplicated by the text at level 0.
		;Avoid double speaking by skipping this level:
		return
	elif OnCalendarViewItemButton()
		;This block is reached when tab moves to the set of buttons representing months or years.
		;Each of these buttons have a grid item pattern.
		;These are the buttons for the month or for the year selection.
		;If this grid contains buttons for the month,
		;level 1 contains the unabreviated name of the month where level 0 contains abbreviated month names.
		;Level 1 also contains the buttons where level 0 contains text.
		;Skip this level for SayObjectTypeAndText,
		;but to get the button type announced along with the full month name,
		;announce the object using level 1 when at level 0.
		;Call SayObjectActiveItem when navigating through these buttons to get the item announced in its abbreviated form without announcing button for each one.
		return
	endIf
elif nLevel == 0
	if SayCalendarControl()
		return
	elif OnCalendarViewItemButton()
		;These are buttons in the grid for selecting month or year.
		;At level 1 are buttons, with the unabreviated month name for month buttons,
		;where level 0 is only text and contains abbreviated month names for month buttons.
		;Level 1 announcement was skipped to avoid excessive speech output,
		;and we announce the level 1 form of this object at level 0 to get the full name and type.
		SayObjectTypeAndText(1)
		return
	elif SayCalendarViewDayItem()
		return
	endIf
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
if nLevel > 0 return endIf
if OnCalculatorToggleButton()
&& !GetObjectState()
	;SayObjectTypeAndText detects the state if the button is checked,
	;but if it is not checked no state is detected and is therefore not announced.
	IndicateControlState(wt_checkbox,CTRL_UNCHECKED)
endIf
EndFunction

string function GetCustomTutorMessage()
if OnCalendarControl()
	return msgCustomTutorialHelp_CalendarControl
elif OnCalendarViewItemButton()
	return msgCustomTutorialHelp_CalendarViewItemButton
elif OnCalendarHeaderButton()
	return msgCustomTutorialHelp_CalendarHeaderButton
elif OnCalendarViewDayItem()
	return msgCustomTutorialHelp_CalendarViewDayItem
endIf
return GetCustomTutorMessage()
EndFunction

int function SayByTypeForScriptSayLine()
if OnCalendarControl()
|| OnCalendarViewItemButton()
	SayObjectTypeAndText()
	return true
endIf
return SayByTypeForScriptSayLine()
EndFunction

void function ObjStateChangedEvent(handle hObj, optional int iObjType, int nChangedState, int nState, int nOldState)
if hObj == GetFocus()
&& iObjType == wt_button
&& OnCalculatorToggleButton()
&& !nState
	IndicateControlState(iObjType,CTRL_UNCHECKED)
	return
endIf
ObjStateChangedEvent(hObj, iObjType, nChangedState, nState, nOldState)
EndFunction

int function BrailleCallbackObjectIdentify()
if IsTouchCursor() || UserBufferIsActive() return BrailleCallbackObjectIdentify() endIf
;Reduce the number of calls to functions OnCalendarViewDayItem and OnCalendarControl,
;to avoid unknown function calls occurrences due to call collisions:
var string class = GetObjectClassName()
if class == class_CalendarDatePicker
	return WT_CUSTOM_CONTROL_BASE+1
elif class == Class_TextBlock
&& GetObjectClassName(1) == Class_CalendarViewDayItem 
	return WT_CUSTOM_CONTROL_BASE+2
endIf
return BrailleCallbackObjectIdentify()
EndFunction

int function BrailleAddObjectName(int nSubtype)
if nSubtype == WT_CUSTOM_CONTROL_BASE+1
	BrailleAddString(GetObjectName(),0,0,0)
	return true
elif nSubtype == WT_CUSTOM_CONTROL_BASE+2
	BrailleAddString(GetObjectName(), GetCursorCol(), GetCursorRow(), (c_CalcUIA.isSelected)*attrib_highlight)
	return true
endIf
return BrailleAddObjectName(nSubtype)
EndFunction

int function BrailleAddObjectValue(int nSubtype)
var string value = GetObjectValue()
if nSubtype == WT_CUSTOM_CONTROL_BASE+1
	BrailleAddString(value, GetCursorCol(), GetCursorRow(), 0)
	return true
elif nSubtype == wt_static
	if GetObjectSubtypeCode() == wt_static
	&& !value
		BrailleAddString(GetObjectName(),0,0,0)
		return true
	endIf
elif nSubtype == wt_comboBox
	if value
		BrailleAddString(value,0,0,0)
		return true
	endIf
endIf
return BrailleAddObjectValue(nSubtype)
EndFunction

int function BrailleAddObjectDescription(int nSubtype)
if nSubtype == wt_button
	if OnCalculatorButton()
	&& c_CalcUIA.ResultsElement
		BrailleAddString(cscSpace+ChopStartOfResultsDisplayName(c_CalcUIA.ResultsElement.BuildUpdatedCache().name),0,0,0)
		return true
	endIf
endIf
return BrailleAddObjectDescription(nSubtype)
EndFunction

int function BrailleAddObjectState(int nSubtype)
if nSubtype== wt_button
&& OnCalculatorToggleButton()
&& !GetObjectState()
	BrailleAddString(BrailleGetStateString(CTRL_UNCHECKED),GetCursorCol(),GetCursorRow(),0)
	return true
endIf
return BrailleAddObjectState(nSubtype)
EndFunction

int function BrailleAddObjectType(int nSubtype)
if nSubtype == WT_CUSTOM_CONTROL_BASE+1
	BrailleAddString(BrailleGetSubtypeString(WT_CUSTOM_CONTROL_BASE+1),0,0,0)
	return true
endIf
return BrailleAddObjectType(nSubtype)
EndFunction

int function BrailleAddObjectHeader(int nSubtype)
BrailleAddString(c_CalcUIA.header, 0,0,0)
return true
EndFunction

int function FocusToCalculatorDisplayField()
if !c_CalcUIA.ResultsElement
&& !c_CalcUIA.Value2Element
	AcquireSpecialElementsForMode()
EndIf
if c_CalcUIA.ResultsElement
	c_CalcUIA.ResultsElement.SetFocus()
	return true
elif c_CalcUIA.Value2Element
	c_CalcUIA.Value2Element.SetFocus()
	return true
endIf
return false
EndFunction

string function GetCalculatorNonFocusableResultsText()
var
	object oResults,
	object condition,
	string sResults
;For Date Calculation mode:
condition = oFSUIA_Win8Calculator.CreateStringPropertyCondition(UIA_AutomationIDPropertyId,AutomationID_DateDiffAllUnitsResultLabel)
oResults = FindCalculatorObjectWithCondition(condition)
if !oResults return cscNull endIf
sResults = oResults.name
;Add contextual text information about the calendar dates to the results text:
condition = oFSUIA_Win8Calculator.CreateStringPropertyCondition(UIA_ClassNamePropertyId,class_CalendarDatePicker)
oResults = c_CalcUIA.AppElement.FindAll(treeScope_descendants,condition)
var int count = oResults.count
if count == 2
	var string fromDate = FormatString("%1 %2", 
			oResults(0).name,
			oResults(0).GetValuePattern().value)
	var string toDate = FormatString("%1 %2", 
			oResults(1).name,
			oResults(1).GetValuePattern().value)
	if fromDate && toDate
		sResults = FormatString("%1\n%2\n%3", fromDate, toDate, sResults)
	endIf
endIf
return sResults
EndFunction

int function ShowCalculatorNonFocusableResults()
var string sResults = GetCalculatorNonFocusableResultsText()
if !sResults return false endIf
EnsureNoUserBufferActive()
UserBufferAddText(sResults)
UserBufferAddText(cscBufferNewLine+cMsgBuffExit)
UserBufferActivate()
JAWSTopOfFile()
SayAll()
EndFunction

script FocusToCalculatorResultsField()
if OnDisplayField() return endIf
;The display field is focusable for the Standard, Programmer and Scientific modes of the calculator.
if FocusToCalculatorDisplayField() return endIf
;The results fields for other calculator modes are not focusable, so use the virtual viewer to display the information.
ShowCalculatorNonFocusableResults()
EndScript

script SayCalculatorExpression()
if !c_CalcUIA.ExpressionElement
	AcquireSpecialElementsForMode()
else ;Make sure that we get the updated expression:
	c_CalcUIA.ExpressionElement = Null()
	c_CalcUIA.ExpressionElement = GetCalculatorExpressionElement()
endIf
if !c_CalcUIA.ExpressionElement
|| c_CalcUIA.ExpressionElement.IsOffScreen
	Say(msgNoCalculatorExpression_Error,ot_error)
	return
endIf
Say(c_CalcUIA.ExpressionElement.name,ot_user_requested_information)
EndScript

script ScriptFileName()
ScriptAndAppNames(msgWindowsCalculatorAppName)
EndScript

Script UpALevel()
if !UserBufferIsActive()
	if !c_CalcUIA.expressionElement AcquireSpecialElementsForMode() EndIf
	if c_CalcUIA.ExpressionElement
	&& !c_CalcUIA.ExpressionElement.buildUpdatedCache().isOffScreen
		Say(msgClearExpression,ot_JAWS_message)
		TypeKey(cksEsc)
		return
	elif c_CalcUIA.resultsElement
		Say(msgClearDisplay,ot_JAWS_message)
		TypeKey(cksEsc)
		return
	endIf
endIf
PerformScript UpALevel()
EndScript

script JAWSDelete()
if !UserBufferIsActive()
	;Focus does not need to actually be on the input field to clear it:
	if !c_CalcUIA.ResultsElement
	&& !c_CalcUIA.value1Element
		AcquireSpecialElementsForMode()
	EndIf
	if c_CalcUIA.ResultsElement
		Say(msgClearDisplay,ot_JAWS_message)
		TypeKey(cksDelete)
		return
	elif c_CalcUIA.value1Element
		Say(msgClearInput,ot_JAWS_message)
		TypeKey(cksDelete)
		return
	endIf
endIf
PerformScript JAWSDelete()
EndScript

script JAWSBackspace()
if !UserBufferIsActive()
	;Focus does not need to actually be on the input field for backspace to delete digits:
	if !c_CalcUIA.ResultsElement
	&& !c_CalcUIA.value1Element
		AcquireSpecialElementsForMode()
	EndIf
	if c_CalcUIA.ResultsElement
	|| c_CalcUIA.value1Element
		TypeKey(cksBackspace)
		return
	endIf
endIf
if OnCalculatorButton()
	TypeKey(cksBackspace)
	return
endIf
PerformScript JAWSBackspace()
EndScript

void function FocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
;When using the keyboard to type a calculation into the display,
;focus is not actually changing, so don't announce the display field:
if nChangeDepth == 0
&& nObject == nPrevObject
&& onInputField()
	return
endIf
FocusChangedEventEx (hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
if nChangeDepth == 1
&& c_CalcUIA.PrevFocusElement.className == Class_CalendarViewItem
&& OnCalendarViewItemButton()
	;Level 1 contains the unabreviated name and type of the element,
	;where level 0 contains no type and may contain an abbreviated name.
	;Use SayObjectActiveItem to speak the level 0 when navigating through these items:
	return SayObjectActiveItem()
endIf
ProcessEventOnFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth, sClass, nType)
EndFunction

void Function FocusChangedEventProcessAncestors (handle FocusWindow, handle PrevWindow)
if focusWindow != PrevWindow
	; say the calculator mode:
	c_CalcUIA.modeHeaderElement = GetCalculatorModeHeaderElement()
	if c_CalcUIA.modeHeaderElement
		Say(c_CalcUIA.modeHeaderElement.BuildUpdatedCache().name,ot_line)
	endIf
endIf
FocusChangedEventProcessAncestors (FocusWindow, PrevWindow)
EndFunction

Script SayWindowTitle  ()
if IsSameScript ()
	SayWindowVisualState()
	return
endIf
if !InHJDialog()
&&  !UserBufferIsActive()
&& !MenusActive()
	if !c_CalcUIA.modeHeaderElement
		c_CalcUIA.modeHeaderElement = GetCalculatorModeHeaderElement()
	endIf
	If c_CalcUIA.modeHeaderElement
		Say(FormatString(msgCalculatorTitleAndMode,
			GetWindowName(GetAppMainWindow (GetCurrentWindow())),
			c_CalcUIA.modeHeaderElement.BuildUpdatedCache().name),
			ot_user_requested_information)
		return
	EndIf
EndIf
PerformScript SayWindowTitle ()
EndScript

void function ClearIgnoreDisplayUpdate()
c_KeyEvent.scheduleIDClearIgnoreNotification = 0
c_KeyEvent.ignoreNotificationForDigits = false
EndFunction

int function PreProcessKeyPressedEvent(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
if c_KeyEvent.scheduleIDClearIgnoreNotification
	UnscheduleFunction(c_KeyEvent.scheduleIDClearIgnoreNotification)
	c_KeyEvent.scheduleIDClearIgnoreNotification = 0
	c_KeyEvent.ignoreNotificationForDigits = false
endIf
c_KeyEvent.lastKeyWasScript = nIsScriptKey
c_KeyEvent.lastKeyName = strKeyName
if PreProcessKeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
	;Stop processing:
	return true
endIf
if !nIsScriptKey 
&& StringContains(DigitsList,strKeyName)
	c_KeyEvent.ignoreNotificationForDigits = true
	c_KeyEvent.scheduleIDClearIgnoreNotification = ScheduleFunction ("ClearIgnoreDisplayUpdate",10)
	Say(strKeyName,ot_char)
EndIf
return false
EndFunction

int function SayTrigButtonName(object button)
if !StringContains(TrigButtonAutomationIDList,button.automationID)
	return false
endIf
;Keystrokes for the hyperbolic sin, cos and tan can be used even when only the non-hyperbolic buttons are shown,
;and the reverse is also true.
;So we must make sure to say the name according to which function was used rather than which button is showing.
var string buttonName = StringLower(button.name)
var string hyperbolicSegment = StringLower(msgHyperbolicFunctionNameSegment)
if StringContains(buttonName,hyperbolicSegment)
	Say(StringDiff(buttonName,hyperbolicSegment),ot_screen_message)
else
	Say(FormatString(msgHyperbolicFunctionNameFormat,HyperbolicSegment,buttonName),ot_screen_message)
endIf
return true
EndFunction

void function SayCalculatorButtonName(string ID, optional string AltID)
var object condition = oFSUIA_Win8Calculator.CreateStringPropertyCondition(UIA_AutomationIDPropertyId,ID)
;Some buttons only appear if a toggle is checked or unchecked,
;such as the Sin, Cos and Tan buttons or their hyperbolic forms 
;when the Hyperbolic Functions button is or is not checked.
;For these types of buttons, and AltID should be specified 
;so that both forms of the buttons can be searched for.
;The percentage and moculo buttons share the same key,
;so they should also be specified as an id and alternative.
if AltID
	condition = oFSUIA_Win8Calculator.CreateOrCondition(condition,
		oFSUIA_Win8Calculator.CreateStringPropertyCondition(UIA_AutomationIDPropertyId,AltID))
EndIf
var object element = c_CalcUIA.appElement
var object button = element.findFirst(treeScope_descendants,condition)
if !button
|| !button.isEnabled
	return
endIf
if button.AutomationID == ID
	Say(button.name,ot_screen_message)
elif SayTrigButtonName(button)
	;do nothing here, it was spoken if test is true.
else
	Say(button.name,ot_screen_message)
endIf
var object pattern = button.GetTogglePattern()
if !pattern return endIf
if pattern.ToggleState == 1
	IndicateControlState(wt_button,ctrl_checked)
else
	IndicateControlState(wt_button,ctrl_unchecked)
endIf
EndFunction

script Divide()
SayCalculatorButtonName(AutomationID_Divide)
TypeCurrentScriptKey()
EndScript

script Minus()
SayCalculatorButtonName(AutomationID_Minus)
TypeCurrentScriptKey()
EndScript

script Plus()
SayCalculatorButtonName(AutomationID_Plus)
TypeCurrentScriptKey()
EndScript

script Multiply()
SayCalculatorButtonName(AutomationID_Multiply)
TypeCurrentScriptKey()
EndScript

script ClearHistory()
SayCalculatorButtonName(AutomationID_ClearHistory)
TypeCurrentScriptKey()
EndScript

script MemoryStore()
SayCalculatorButtonName(AutomationID_MemoryStore)
TypeCurrentScriptKey()
EndScript

Script MemoryRecall()
SayCalculatorButtonName(AutomationID_MemoryRecall)
TypeCurrentScriptKey()
EndScript

Script MemoryAdd()
SayCalculatorButtonName(AutomationID_MemoryAdd)
TypeCurrentScriptKey()
EndScript

script MemorySubtract()
SayCalculatorButtonName(AutomationID_MemorySubtract)
TypeCurrentScriptKey()
EndScript

Script ClearAllMemory()
SayCalculatorButtonName(AutomationID_ClearAllMemory)
TypeCurrentScriptKey()
EndScript

script PercentOrModulo()
SayCalculatorButtonName(AutomationID_Percent,AutomationID_Modulo)
TypeCurrentScriptKey()
EndScript

script LeftParen()
;This must be typed before speaking, so that the correct open parenthesis level is announced:
TypeCurrentScriptKey()
;now allow time for the nesting level to update before announcing it:
Delay(2)
SayCalculatorButtonName(AutomationID_LeftParen )
EndScript

script RightParen()
SayCalculatorButtonName(AutomationID_RightParen )
TypeCurrentScriptKey()
EndScript

script Factorial()
SayCalculatorButtonName(AutomationID_Factorial)
TypeCurrentScriptKey()
EndScript

script Square()
SayCalculatorButtonName(AutomationID_Square)
TypeCurrentScriptKey()
EndScript

script SquareRoot()
SayCalculatorButtonName(AutomationID_SquareRoot)
TypeCurrentScriptKey()
EndScript

script Cube()
SayCalculatorButtonName(AutomationID_Cube)
TypeCurrentScriptKey()
EndScript

script Reciprocal()
SayCalculatorButtonName(AutomationID_Reciprocal)
TypeCurrentScriptKey()
EndScript

script pi()
SayCalculatorButtonName(AutomationID_Pi)
TypeCurrentScriptKey()
EndScript

script Sin()
SayCalculatorButtonName(AutomationID_Sin,AutomationID_HyperbolicSin)
TypeCurrentScriptKey()
EndScript

script Cos()
SayCalculatorButtonName(AutomationID_Cos,AutomationID_HyperbolicCos)
TypeCurrentScriptKey()
EndScript

script Tan()
SayCalculatorButtonName(AutomationID_Tan,AutomationID_HyperbolicTan)
TypeCurrentScriptKey()
EndScript

script SinH()
SayCalculatorButtonName(AutomationID_HyperbolicSin,AutomationID_Sin)
TypeCurrentScriptKey()
EndScript

script CosH()
SayCalculatorButtonName(AutomationID_HyperbolicCos,AutomationID_Cos)
TypeCurrentScriptKey()
EndScript

script TanH()
SayCalculatorButtonName(AutomationID_HyperbolicTan,AutomationID_Tan)
TypeCurrentScriptKey()
EndScript

script EToTheExponent()
SayCalculatorButtonName(AutomationID_EToTheExponent)
TypeCurrentScriptKey()
EndScript

script NaturalLog()
SayCalculatorButtonName(AutomationID_NaturalLog)
TypeCurrentScriptKey()
EndScript

script Log()
SayCalculatorButtonName(AutomationID_Log)
TypeCurrentScriptKey()
EndScript

script AntiLog()
SayCalculatorButtonName(AutomationID_AntiLog)
TypeCurrentScriptKey()
EndScript

script ScientificNotation()
SayCalculatorButtonName(AutomationID_ScientificNotation)
TypeCurrentScriptKey()
EndScript

script Enter()
var string NameBeforeEnterIsPressed
if OnDisplayField()
	;If the results is the same as the operand showing in the display (ex: 4/2),
	;no notification occurs when Enter is pressed to display the calculated results.
	NameBeforeEnterIsPressed = GetObjectName()
endIf
SayCurrentScriptKeyLabel ()
enterKey()
BrailleRefresh()
Delay(5)
var string NameAfterEnterIsPressed = GetObjectName(SOURCE_CACHED_DATA)
if NameAfterEnterIsPressed == NameBeforeEnterIsPressed
	Say(ChopStartOfResultsDisplayName(NameAfterEnterIsPressed),ot_line)
endIf
EndScript
