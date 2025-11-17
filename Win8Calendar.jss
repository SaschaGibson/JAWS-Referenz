; JAWS script file for Windows 8 Calendar

include "HJConst.jsh"
include "MSAAConst.jsh"
include "Locale.jsh"
include "HJGlobal.jsh"
include "common.jsm"
include "Win8Calendar.jsm"

;for focus item data:
const
	CustomType_Unknown = 0,
	CustomType_CalendarEvent = 1,
	CustomType_CalendarDate = 2
globals
;c_FocusItemData is mostly used to store information for comparitive purposes:
	collection c_FocusItemData,
;c_ObjectData is used for information about the raw event or date data:
	collection c_ObjectData
;Because of the problems with copying string arrays members of collections,
;the speech components array is stored separately from any collection.
;A set of flags or indeces can be used to indicate which strings in the array will be spoken.
const
	MaxSpeechComponents = 32 ;do not exceed 32, so that bits can be mapped to speech components
globals
	StringArray A_SpeechComponents,
;c_DateTimeFields members denote the string segment index of the fields
;in the date and event strings obtained from the accessible object name.
;A member value of 0 means the field is not present,
;1 means it is the first field, 2 the secodn field, etc.
;These values can be used as bits or indeces for accessing the speech components array.
	collection c_DateTimeFields

const
;Character value of field delimiter character of fields in iAccessible object name:
	cVal_NamefieldDelimiter = 8206,
;max number of segments in delimited string for calendar date,
;when using cVal_NamefieldDelimiter as delimiter to object name:
	DateStringMaxSegments = 8


void function AutoStartEvent()
if !c_FocusItemData then
	let c_FocusItemData = new collection
EndIf
if !c_ObjectData then
	let c_ObjectData = new collection
EndIf
;Because of the problems with copying string arrays members of collections,
;the speech components array is stored separately from the focus item data:
if !A_SpeechComponents  then
	let A_SpeechComponents  = New StringArray[MaxSpeechComponents]
EndIf
InitDateTimeFieldsIndecies()
EndFunction

void function AutoFinishEvent()
CollectionRemoveAll(c_FocusItemData)
CollectionRemoveAll(c_ObjectData)
EndFunction

void function InitDateTimeFieldsIndecies()
var
	string sLongDate,
	string sLDate,
	int iSegmentCount
if !c_DateTimeFields then
	let c_DateTimeFields = new collection
endIf
let sLongDate = GetUserLocaleInfo(LOCALE_SLONGDATE)
let sLDate = GetUserLocaleInfo(LOCALE_ILDATE)
let iSegmentCount = StringSegmentCount(sLongDate,cscSpace)
let c_DateTimeFields.SpecialEvent = 1
if iSegmentCount == 4 then
	let c_DateTimeFields.EventStartWeekDay = 2
	let c_DateTimeFields.EventStartWeekDaySeparator = 3
	let c_DateTimeFields.EventEndWeekDay = 14
	let c_DateTimeFields.EventEndWeekDaySeparator = 15
	let c_DateTimeFields.AllDayEventEndWeekDay = 9
	let c_DateTimeFields.AllDayEventEndWeekDaySeparator = 10
else
	let c_DateTimeFields.EventStartWeekDay = 0
	let c_DateTimeFields.EventStartWeekDaySeparator = 0
	let c_DateTimeFields.EventEndWeekDay = 0
	let c_DateTimeFields.EventEndWeekDaySeparator = 0
	let c_DateTimeFields.AllDayEventEndWeekDay = 0
	let c_DateTimeFields.AllDayEventEndWeekDaySeparator = 0
EndIf
let c_DateTimeFields.DateWeekDay = c_DateTimeFields.EventStartWeekDay
let c_DateTimeFields.DateWeekDaySeparator = c_DateTimeFields.EventStartWeekDaySeparator
if sLDate == "0" then
	let c_DateTimeFields.EventStartMonth = 2+c_DateTimeFields.EventStartWeekDay
	let c_DateTimeFields.EventEndMonth = 12+(2*(c_DateTimeFields.EventStartWeekDay))
	let c_DateTimeFields.AllDayEventEndMonth = 7+(2*(c_DateTimeFields.EventStartWeekDay))
	let c_DateTimeFields.EventStartDay = 4+c_DateTimeFields.EventStartWeekDay
	let c_DateTimeFields.EventEndDay = 14+(2*(c_DateTimeFields.EventStartWeekDay))
	let c_DateTimeFields.AllDayEventEndDay = 9+(2*(c_DateTimeFields.EventStartWeekDay))
elif sLDate == "1" then
	let c_DateTimeFields.EventStartDay = 2+c_DateTimeFields.EventStartWeekDay
	let c_DateTimeFields.EventEndDay = 12+(2*(c_DateTimeFields.EventStartWeekDay))
	let c_DateTimeFields.AllDayEventEndDay = 7+(2*(c_DateTimeFields.EventStartWeekDay))
	let c_DateTimeFields.EventStartMonth = 4+c_DateTimeFields.EventStartWeekDay
	let c_DateTimeFields.EventEndMonth = 14+(2*(c_DateTimeFields.EventStartWeekDay))
	let c_DateTimeFields.AllDayEventEndMonth = 9+(2*(c_DateTimeFields.EventStartWeekDay))
EndIf
let c_DateTimeFields.DateMonth = c_DateTimeFields.EventStartMonth
let c_DateTimeFields.DateDay = c_DateTimeFields.EventStartDay
let c_DateTimeFields.EventStartMonthDaySeparator = 3+c_DateTimeFields.EventStartWeekDay
let c_DateTimeFields.EventEndMonthDaySeparator = 13+(2*(c_DateTimeFields.EventStartWeekDay))
let c_DateTimeFields.AllDayEventEndMonthDaySeparator = 8+(2*(c_DateTimeFields.EventStartWeekDay))
let c_DateTimeFields.DateMonthSeparator = c_DateTimeFields.EventStartMonthDaySeparator
let c_DateTimeFields.EventStartMonthDayYearSeparator = 5+c_DateTimeFields.EventStartWeekDay
let c_DateTimeFields.EventEndMonthDayYearSeparator = 15+(2*(c_DateTimeFields.EventStartWeekDay))
let c_DateTimeFields.AllDayEventEndMonthDayYearSeparator = 10+(2*(c_DateTimeFields.EventStartWeekDay))
let c_DateTimeFields.DateMonthDayYearSeparator = c_DateTimeFields.EventStartMonthDayYearSeparator
let c_DateTimeFields.EventStartYear = 6+c_DateTimeFields.EventStartWeekDay
let c_DateTimeFields.EventEndYear = 16+(2*(c_DateTimeFields.EventStartWeekDay))
let c_DateTimeFields.AllDayEventEndYear = 11+(2*(c_DateTimeFields.EventStartWeekDay))
let c_DateTimeFields.DateYear = c_DateTimeFields.EventStartYear
let c_DateTimeFields.EventStartHour = 1+c_DateTimeFields.EventStartYear
let c_DateTimeFields.EventEndHour = 1+c_DateTimeFields.EventEndYear
let c_DateTimeFields.EventStartMinute = 3+c_DateTimeFields.EventStartYear
let c_DateTimeFields.EventEndMinute = 3+c_DateTimeFields.EventEndYear
let c_DateTimeFields.EventStartHourMinuteSeparator = 2+c_DateTimeFields.EventStartYear
let c_DateTimeFields.EventEndHourMinuteSeparator = 2+c_DateTimeFields.EventEndYear
let c_DateTimeFields.EventStartAMPM = 5+c_DateTimeFields.EventStartYear
let c_DateTimeFields.EventEndAMPM = 5+c_DateTimeFields.EventEndYear
EndFunction

void function InitSpeechComponents()
var
	int i
for i = 1 to c_ObjectData.SegmentCount
	let A_SpeechComponents[i] = StringSegment(c_ObjectData.RawString,c_ObjectData.Delim,i)
EndFor
for i = c_ObjectData.SegmentCount+1 to MaxSpeechComponents
	let A_SpeechComponents[i] = cscNull
EndFor
EndFunction

int function IntToBit(int number)
if Number > 32 then
	return 0
EndIf
return 1<<(number-1)
EndFunction

string function BuildSpeechStringWithFields(int SpeechFieldFlags)
var
	int bit,
	string sMsg
for bit = 1 to MaxSpeechComponents
	if SpeechFieldFlags & 1<<(bit-1) then
		let sMsg = sMsg+A_SpeechComponents[bit]
	EndIf
EndFor
return sMsg
EndFunction

string function GetBrlEventDisplayFields()
var
	string sEvent,
	int iFlags
if c_FocusItemData.AllDayEvent == true then
	let iFlags = 1
EndIf
if CollectionItemExists(c_FocusItemData,"FromWeekDay") then
	let iFlags = iFlags
		| IntToBit(c_DateTimeFields.EventStartWeekDay)
		| IntToBit(c_DateTimeFields.EventStartWeekDaySeparator)
	if c_FocusItemData.FromWeekDay != c_FocusItemData.ToWeekDay
	|| c_FocusItemData.FromMonth != c_FocusItemData.ToMonth
	|| c_FocusItemData.FromDay != c_FocusItemData.ToDay
	|| c_FocusItemData.FromYear != c_FocusItemData.ToYear then
		if c_FocusItemData.AllDayEvent == true then
			let iFlags = iFlags
				| IntToBit(c_DateTimeFields.AllDayEventEndWeekDay)
				| IntToBit(c_DateTimeFields.AllDayEventEndWeekDaySeparator)
		else
			let iFlags = iFlags
				| IntToBit(c_DateTimeFields.EventEndWeekDay)
				| IntToBit(c_DateTimeFields.EventEndWeekDaySeparator)
		EndIf
	EndIf
EndIf
let iFlags = iFlags
	| IntToBit(c_DateTimeFields.EventStartMonth)
	| IntToBit(c_DateTimeFields.EventStartMonthDaySeparator)
	| IntToBit(c_DateTimeFields.EventStartDay)
	| IntToBit(c_DateTimeFields.EventStartMonthDayYearSeparator)
if c_FocusItemData.FromMonth != c_FocusItemData.ToMonth
|| c_FocusItemData.FromDay != c_FocusItemData.ToDay then
	if c_FocusItemData.AllDayEvent == true then
		let iFlags = iFlags
			| IntToBit(c_DateTimeFields.AllDayEventEndMonth)
			| IntToBit(c_DateTimeFields.AllDayEventEndMonthDaySeparator)
			| IntToBit(c_DateTimeFields.AllDayEventEndDay)
			| IntToBit(c_DateTimeFields.AllDayEventEndMonthDayYearSeparator)
	else
		let iFlags = iFlags
			| IntToBit(c_DateTimeFields.EventEndMonth)
			| IntToBit(c_DateTimeFields.EventEndMonthDaySeparator)
			| IntToBit(c_DateTimeFields.EventEndDay)
			| IntToBit(c_DateTimeFields.EventEndMonthDayYearSeparator)
	EndIf
EndIf
if c_FocusItemData.AllDayEvent == true then
	;the text of the event is in the same segment as the all day event end year,
	;so this field is included unconditionally:
	let iFlags = iFlags
		| IntToBit(c_DateTimeFields.AllDayEventEndYear)
elif c_FocusItemData.FromYear != c_FocusItemData.ToYear
	let iFlags = iFlags
		| IntToBit(c_DateTimeFields.EventEndYear)
EndIf
if c_FocusItemData.AllDayEvent != true then
	let iFlags = iFlags | IntToBit(c_DateTimeFields.EventStartHour)
	let iFlags = iFlags | IntToBit(c_DateTimeFields.EventStartHourMinuteSeparator)
	let iFlags = iFlags | IntToBit(c_DateTimeFields.EventStartMinute)
	if c_FocusItemData.FromHour != c_FocusItemData.ToHour
	|| c_FocusItemData.FromMinute != c_FocusItemData.ToMinute
	|| c_FocusItemData.FromAMPM != c_FocusItemData.ToAMPM
	|| c_FocusItemData.FromDay != c_FocusItemData.ToDay
	|| c_FocusItemData.FromMonth != c_FocusItemData.ToMonth
	|| c_FocusItemData.FromYear != c_FocusItemData.ToYear then
		let iFlags = iFlags | IntToBit(c_DateTimeFields.EventStartAMPM)
		let iFlags = iFlags | IntToBit(c_DateTimeFields.EventEndHour)
		let iFlags = iFlags | IntToBit(c_DateTimeFields.EventEndHourMinuteSeparator)
		let iFlags = iFlags | IntToBit(c_DateTimeFields.EventEndMinute)
	EndIf
	;the text of the event is in the same segment as the event end AMPM,
	;so this field is included unconditionally:
	let iFlags = iFlags | IntToBit(c_DateTimeFields.EventEndAMPM)
EndIf
let sEvent = BuildSpeechStringWithFields(iFlags)
return sEvent
EndFunction

int function GetUIAObjectItemType(optional object ByRef oItem)
var
	int iObjType,
	string sData,
	string sDelimChar
CollectionRemoveAll(c_ObjectData)
let iObjType = GetObjectSubtypeCode(true)
if !(iObjType  == wt_button || !iObjType)
|| IsVirtualPCCursor()
|| UserBufferIsActive()
|| GetMenuMode() then
	return CustomType_Unknown
EndIf
if !oItem then
	let oItem = GetUIAObjectFocusItem()
EndIf
if !oItem then
	return CustomType_Unknown
EndIf
let sData = oItem.name
if StringStartsWith(sData,cscAllDayEventSpecifier) then
	let sData = StringChopLeft(sData,StringLength(cscAllDayEventSpecifier))
endIf
let sDelimChar = StringLeft(sData,1)
if GetCharacterValue(sDelimChar) != cVal_NamefieldDelimiter then
	return CustomType_Unknown
endIf
;don't use sData for the c_ObjectData.RawString, since it may have been chopped:
let c_ObjectData.RawString = oItem.Name
let c_ObjectData.Delim = sDelimChar
let c_ObjectData.SegmentCount = StringSegmentCount(sData,sDelimChar)
;when delimited, a date will have fewer segments than an event:
if c_ObjectData.SegmentCount > DateStringMaxSegments then
	return CustomType_CalendarEvent
else
	return CustomType_CalendarDate
EndIf
EndFunction

void function UpdateFocusItemData()
var
	object oItem,
	int iType,
	collection c,
	int x,
	int y
let iType = GetUIAObjectItemType(oItem)
if iType == CustomType_Unknown then
	CollectionRemoveAll(c_FocusItemData)
	return
EndIf
if CollectionItemExists(c_FocusItemData,"CustomType") then
	let c = CollectionCopy(c_FocusItemData)
	CollectionRemoveAll(c_FocusItemData)
EndIf
let C_FocusItemData.CustomType = iType
let C_FocusItemData.PrevCustomType = c.CustomType
oItem.ClickablePoint(intRef(x),intRef(y))
let c_FocusItemData.ClickX = x
let c_FocusItemData.ClickY = y
;Note that we take advantage of the fact that nothing is assigned if copying a non-existent member of C
InitSpeechComponents()
if iType == CustomType_CalendarEvent then
	let c_FocusItemData.AllDayEvent =
		StringStartsWith(c_ObjectData.RawString,cscAllDayEventSpecifier)
	if c_DateTimeFields.EventStartWeekDay != 0 then
		let c_FocusItemData.FromWeekDay =
			StringSegment(c_ObjectData.RawString,
				c_ObjectData.Delim,c_DateTimeFields.EventStartWeekDay)
		let c_FocusItemData.PrevFromWeekDay = c.FromWeekDay
		if c_FocusItemData.AllDayEvent == true then
			let c_FocusItemData.ToWeekDay =
				StringSegment(c_ObjectData.RawString,
					c_ObjectData.Delim,c_DateTimeFields.AllDayEventEndWeekDay)
		else
			let c_FocusItemData.ToWeekDay =
				StringSegment(c_ObjectData.RawString,
					c_ObjectData.Delim,c_DateTimeFields.EventEndWeekDay)
		EndIf
		let c_FocusItemData.PrevToWeekDay = c.ToWeekDay
	EndIf
	let c_FocusItemData.FromMonth =
		StringSegment(c_ObjectData.RawString,
			c_ObjectData.Delim,c_DateTimeFields.EventStartMonth)
	let c_FocusItemData.PrevFromMonth = c.FromMonth
	if c_FocusItemData.AllDayEvent == true then
		let c_FocusItemData.ToMonth =
			StringSegment(c_ObjectData.RawString,
				c_ObjectData.Delim,c_DateTimeFields.AllDayEventEndMonth)
	else
		let c_FocusItemData.ToMonth =
			StringSegment(c_ObjectData.RawString,
				c_ObjectData.Delim,c_DateTimeFields.EventEndMonth)
	EndIf
	let c_FocusItemData.PrevToMonth = c.ToMonth
	let c_FocusItemData.FromDay =
		StringSegment(c_ObjectData.RawString,
			c_ObjectData.Delim,c_DateTimeFields.EventStartDay)
	let c_FocusItemData.PrevFromDay = c.FromDay
	if c_FocusItemData.AllDayEvent == true then
		let c_FocusItemData.ToDay =
			StringSegment(c_ObjectData.RawString,
				c_ObjectData.Delim,c_DateTimeFields.AllDayEventEndDay)
	else
		let c_FocusItemData.ToDay =
			StringSegment(c_ObjectData.RawString,
				c_ObjectData.Delim,c_DateTimeFields.EventEndDay)
	EndIf
	let c_FocusItemData.PrevToDay = c.ToDay
	let c_FocusItemData.FromYear =
		StringLeft(StringSegment(c_ObjectData.RawString,
			c_ObjectData.Delim,c_DateTimeFields.EventStartYear),4)
	let c_FocusItemData.PrevFromYear = c.FromYear
	if c_FocusItemData.AllDayEvent == true then
		let c_FocusItemData.ToYear =
			StringLeft(StringSegment(c_ObjectData.RawString,
				c_ObjectData.Delim,c_DateTimeFields.AllDayEventEndYear),4)
	else
		let c_FocusItemData.ToYear =
			StringLeft(StringSegment(c_ObjectData.RawString,
				c_ObjectData.Delim,c_DateTimeFields.EventEndYear),4)
	EndIf
	let c_FocusItemData.PrevToYear = c.ToYear
	if c_FocusItemData.AllDayEvent != true then
		let c_FocusItemData.FromHour =
			StringSegment(c_ObjectData.RawString,
				c_ObjectData.Delim,c_DateTimeFields.EventStartHour)
		let c_FocusItemData.PrevFromHour = c.FromHour
		let c_FocusItemData.ToHour =
			StringSegment(c_ObjectData.RawString,
				c_ObjectData.Delim,c_DateTimeFields.EventEndHour)
		let c_FocusItemData.PrevToHour = c.ToHour
		let c_FocusItemData.FromMinute =
			StringSegment(c_ObjectData.RawString,
				c_ObjectData.Delim,c_DateTimeFields.EventStartMinute)
		let c_FocusItemData.PrevFromMinute = c.FromMinute
		let c_FocusItemData.ToMinute =
			StringSegment(c_ObjectData.RawString,
				c_ObjectData.Delim,c_DateTimeFields.EventEndMinute)
		let c_FocusItemData.PrevToMinute = c.ToMinute
		let c_FocusItemData.FromAMPM =
			StringSegment(c_ObjectData.RawString,
				c_ObjectData.Delim,c_DateTimeFields.EventStartAMPM)
		let c_FocusItemData.FromAMPM = StringLeft(c_FocusItemData.FromAMPM,2)
		let c_FocusItemData.PrevFromAMPM = c.FromAMPM
		let c_FocusItemData.ToAMPM =
			StringSegment(c_ObjectData.RawString,
				c_ObjectData.Delim,c_DateTimeFields.EventEndAMPM)
		let c_FocusItemData.ToAMPM = StringLeft(c_FocusItemData.ToAMPM,2)
		let c_FocusItemData.PrevToAMPM = c.ToAMPM
	EndIf
	let c_FocusItemData.BrlString = GetBrlEventDisplayFields()
elif iType == CustomType_CalendarDate then
	if c_DateTimeFields.DateWeekDay != 0 then
		let c_FocusItemData.WeekDay =
			StringSegment(c_ObjectData.RawString,
				c_ObjectData.Delim,c_DateTimeFields.DateWeekDay)
		let c_FocusItemData.PrevWeekDay = c.WeekDay
	EndIf
	let c_FocusItemData.Month =
		StringSegment(c_ObjectData.RawString,
			c_ObjectData.Delim,c_DateTimeFields.DateMonth)
	let c_FocusItemData.PrevMonth = c.Month
	let c_FocusItemData.Day =
		StringSegment(c_ObjectData.RawString,
			c_ObjectData.Delim,c_DateTimeFields.DateDay)
	let c_FocusItemData.PrevDay = c.Day
	let c_FocusItemData.Year =
		StringSegment(c_ObjectData.RawString,
			c_ObjectData.Delim,c_DateTimeFields.DateYear)
	let c_FocusItemData.PrevYear = c.Year
	let c_FocusItemData.BrlString =
		StringReplaceSubstrings(c_ObjectData.RawString,c_ObjectData.Delim,cscNull)
EndIf
BrailleRefresh()
EndFunction

void function PreProcessFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
UpdateFocusItemData()
PreProcessFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction

int function MenuProcessedOnFocusChangedEventEx(
	handle hwndFocus, handle hwndPrevFocus,
	int nType, optional int nChangeDepth)
if GetMenuMode () == MENU_ACTIVE
&& (GetObjectSubtypeCode(true,2) == wt_contextMenu || GetObjectSubtypeCode(true,3) == wt_contextMenu)
	;This is a popup child of a context menu,
	;which should be treated like a dialog rather than a menu:
	return false
endIf
return MenuProcessedOnFocusChangedEventEx(hwndFocus, hwndPrevFocus, nType, nChangeDepth)
EndFunction

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
if (c_FocusItemData.CustomType == Customtype_CalendarDate
|| c_FocusItemData.CustomType == Customtype_CalendarEvent)
&& c_FocusItemData.CustomType == c_FocusItemData.PrevCustomType then
	return ActiveItemChangedEvent(hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild)
EndIf
ProcessEventOnFocusChangedEventEx(hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild,
	nChangeDepth, sClass, nType)
EndFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
if c_FocusItemData.CustomType == CustomType_CalendarDate then
	SayCalendarDateItem(true)
	return
elif c_FocusItemData.CustomType == CustomType_CalendarEvent then
	SayCalendarEventItem(true)
	return
endIf
ActiveItemChangedEvent (curHwnd, curObjectId, curChildId,
	prevHwnd, prevObjectId, prevChildId)
EndFunction

void function SayCalendarDateItem(optional int bOnNavigation)
var
	string sDate,
	int iFlags
if CollectionItemExists(c_FocusItemData,"WeekDay") then
	if !bOnNavigation
	|| c_FocusItemData.WeekDay != c_FocusItemData.PrevWeekDay then
		let iFlags = iFlags | IntToBit(c_DateTimeFields.DateWeekDay)
		if c_FocusItemData.Month != c_FocusItemData.PrevMonth then
			let iFlags = iFlags | IntToBit(c_DateTimeFields.DateWeekDaySeparator)
		EndIf
	EndIf
EndIf
if !bOnNavigation
|| c_FocusItemData.Month != c_FocusItemData.PrevMonth then
	let iFlags = iFlags
		| IntToBit(c_DateTimeFields.DateMonth)
		| IntToBit(c_DateTimeFields.DateMonthDaySeparator)
EndIf
let iFlags = iFlags | IntToBit(c_DateTimeFields.DateDay)
if !bOnNavigation
|| c_FocusItemData.Year != c_FocusItemData.PrevYear then
	let iFlags = iFlags
		| IntToBit(c_DateTimeFields.DateMonthDayYearSeparator)
		| IntToBit(c_DateTimeFields.DateYear)
EndIf
let sDate = BuildSpeechStringWithFields(iFlags)
if !bOnNavigation then
	IndicateControlType(wt_Button,sDate)
else
	Say(sDate,ot_line)
EndIf
EndFunction

void function SayCalendarEventItem(optional int bOnNavigation)
var
	string sEvent,
	int iFlags
if c_FocusItemData.AllDayEvent == true then
	let iFlags = 1
EndIf
if CollectionItemExists(c_FocusItemData,"FromWeekDay") then
	if !bOnNavigation
	|| c_FocusItemData.FromWeekDay != c_FocusItemData.PrevFromWeekDay
	|| c_FocusItemData.FromMonth != c_FocusItemData.PrevFromMonth
	|| c_FocusItemData.FromDay != c_FocusItemData.PrevFromDay
	|| c_FocusItemData.FromYear != c_FocusItemData.PrevFromYear
	|| c_FocusItemData.AllDayEvent == true then
		let iFlags = iFlags
			| IntToBit(c_DateTimeFields.EventStartWeekDay)
			| IntToBit(c_DateTimeFields.EventStartWeekDaySeparator)
	EndIf
	if c_FocusItemData.FromWeekDay != c_FocusItemData.ToWeekDay
	|| c_FocusItemData.FromMonth != c_FocusItemData.ToMonth
	|| c_FocusItemData.FromDay != c_FocusItemData.ToDay
	|| c_FocusItemData.FromYear != c_FocusItemData.ToYear then
		if c_FocusItemData.AllDayEvent == true then
			let iFlags = iFlags
				| IntToBit(c_DateTimeFields.AllDayEventEndWeekDay)
				| IntToBit(c_DateTimeFields.AllDayEventEndWeekDaySeparator)
		else
			let iFlags = iFlags
				| IntToBit(c_DateTimeFields.EventEndWeekDay)
				| IntToBit(c_DateTimeFields.EventEndWeekDaySeparator)
		EndIf
	EndIf
EndIf
if !bOnNavigation
|| c_FocusItemData.FromMonth != c_FocusItemData.PrevFromMonth
|| c_FocusItemData.FromDay != c_FocusItemData.PrevFromDay then
	let iFlags = iFlags
		| IntToBit(c_DateTimeFields.EventStartMonth)
		| IntToBit(c_DateTimeFields.EventStartMonthDaySeparator)
		| IntToBit(c_DateTimeFields.EventStartDay)
		| IntToBit(c_DateTimeFields.EventStartMonthDayYearSeparator)
EndIf
if c_FocusItemData.FromMonth != c_FocusItemData.ToMonth
|| c_FocusItemData.FromDay != c_FocusItemData.ToDay then
	if c_FocusItemData.AllDayEvent == true then
		let iFlags = iFlags
			| IntToBit(c_DateTimeFields.AllDayEventEndMonth)
			| IntToBit(c_DateTimeFields.AllDayEventEndMonthDaySeparator)
			| IntToBit(c_DateTimeFields.AllDayEventEndDay)
			| IntToBit(c_DateTimeFields.AllDayEventEndMonthDayYearSeparator)
	else
		let iFlags = iFlags
			| IntToBit(c_DateTimeFields.EventEndMonth)
			| IntToBit(c_DateTimeFields.EventEndMonthDaySeparator)
			| IntToBit(c_DateTimeFields.EventEndDay)
			| IntToBit(c_DateTimeFields.EventEndMonthDayYearSeparator)
	EndIf
EndIf
if !bOnNavigation
|| c_FocusItemData.FromYear != c_FocusItemData.PrevFromYear then
	let iFlags = iFlags
		| IntToBit(c_DateTimeFields.EventStartYear)
EndIf
if c_FocusItemData.AllDayEvent == true then
	;the text of the event is in the same segment as the all day event end year,
	;so this field is included unconditionally:
	let iFlags = iFlags
		| IntToBit(c_DateTimeFields.AllDayEventEndYear)
elif c_FocusItemData.FromYear != c_FocusItemData.ToYear
	let iFlags = iFlags
		| IntToBit(c_DateTimeFields.EventEndYear)
EndIf
if c_FocusItemData.AllDayEvent != true then
	let iFlags = iFlags | IntToBit(c_DateTimeFields.EventStartHour)
	let iFlags = iFlags | IntToBit(c_DateTimeFields.EventStartHourMinuteSeparator)
	let iFlags = iFlags | IntToBit(c_DateTimeFields.EventStartMinute)
	if c_FocusItemData.FromHour != c_FocusItemData.ToHour
	|| c_FocusItemData.FromMinute != c_FocusItemData.ToMinute
	|| c_FocusItemData.FromAMPM != c_FocusItemData.ToAMPM
	|| c_FocusItemData.FromDay != c_FocusItemData.ToDay
	|| c_FocusItemData.FromMonth != c_FocusItemData.ToMonth
	|| c_FocusItemData.FromYear != c_FocusItemData.ToYear then
		let iFlags = iFlags | IntToBit(c_DateTimeFields.EventStartAMPM)
		let iFlags = iFlags | IntToBit(c_DateTimeFields.EventEndHour)
		let iFlags = iFlags | IntToBit(c_DateTimeFields.EventEndHourMinuteSeparator)
		let iFlags = iFlags | IntToBit(c_DateTimeFields.EventEndMinute)
	EndIf
	;the text of the event is in the same segment as the event end AMPM,
	;so this field is included unconditionally:
	let iFlags = iFlags | IntToBit(c_DateTimeFields.EventEndAMPM)
EndIf
let sEvent = BuildSpeechStringWithFields(iFlags)
if !bOnNavigation then
	IndicateControlType(wt_Button,sEvent)
else
	Say(sEvent,ot_line)
EndIf
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
if nLevel == 0 then
	if c_FocusItemData.CustomType == CustomType_CalendarDate then
		SayCalendarDateItem()
		return
	elif c_FocusItemData.CustomType == CustomType_CalendarEvent then
		SayCalendarEventItem()
		return
	EndIf
EndIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

void function SayLine(optional Int iDrawHighlights, optional int bSayingLineAfterMovement)
if !UserBufferIsActive()
&& !GetMenuMode() then
	if C_FocusItemData.CustomType == CustomType_CalendarEvent then
		SayCalendarEventItem(false)
		return
	EndIf
EndIf
SayLine(iDrawHighlights,bSayingLineAfterMovement)
EndFunction

int function InCalendarEventDetails()
var
	int depth,
	int i
if c_FocusItemData.CustomType == CustomType_CalendarDate
|| c_FocusItemData.CustomType == CustomType_CalendarEvent then
	return false
EndIf
let depth = GetAncestorCount()
for i = 1 to depth
	if GetObjectName(true,i) == objn_Details then
		return true
	EndIf
EndFor
return false
EndFunction

int function BrailleCallbackObjectIdentify()
if IsTouchCursor() then
	return GetTouchNavElementBrlSubtype()
EndIf
;Compensate for failure to obtain MSAA object when on calendar date or event:
if c_FocusItemData.CustomType == Customtype_CalendarDate
|| c_FocusItemData.CustomType == Customtype_CalendarEvent then
	return wt_button
EndIf
return BrailleCallbackObjectIdentify()
EndFunction

int function BrailleAddObjectName(int nSubtype)
if IsTouchCursor() then
	return BrailleAddObjectName(nSubtype)
endIf
if nSubtype == wt_button then
	if c_FocusItemData.CustomType == CustomType_CalendarDate
	|| c_FocusItemData.CustomType == CustomType_CalendarEvent then
		BrailleAddString(c_FocusItemData.BrlString,
			c_FocusItemData.ClickX,c_FocusItemData.ClickY,0)
		return true
	EndIf
EndIf
return BrailleAddObjectName(nSubtype)
EndFunction

script BrailleRouting()
if !BrailleIsMessageBeingShown()
&& !gbBrailleStudyModeActive
&& BrailleIsStructuredLine()
&& !GetMenuMode()
&& !IsVirtualPCCursor()
&& IsPCCursor() then
	if c_FocusItemData.CustomType == CustomType_CalendarDate
	|| c_FocusItemData.CustomType == CustomType_CalendarEvent then
		EnterKey()
		return
	EndIf
EndIf
PerformScript BrailleRouting()
EndScript

int function NavSayUnitException()
if !IsLeftButtonDown()
&& !SupportsEditCallbacks()
&& !GetMenuMode()
&& !IsVirtualPCCursor()
&& !UserBufferIsActive()
&& IsPCCursor() then
	;Suppress the problem where when the app first starts,
	;MSAA doesn't obtain the object,
	;so the first arrow navigation speaks "blank".
	if c_FocusItemData.CustomType == CustomType_CalendarDate
	|| c_FocusItemData.CustomType == CustomType_CalendarEvent then
		return true
	EndIf
EndIf
return false
EndFunction

void function SayCharacterUnit(int unitMovement)
if NavSayUnitException() then
	return
EndIf
SayCharacterUnit(unitMovement)
EndFunction

void function SayLineUnit(int unitMovement, optional  int bMoved)
if NavSayUnitException() then
	return
EndIf
SayLineUnit(unitMovement,bMoved)
EndFunction

Script ScriptFileName ()
ScriptAndAppNames (msgWin8CalendarAppName)
endScript
