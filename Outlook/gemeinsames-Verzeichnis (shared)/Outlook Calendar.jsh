; Header file for Outlook object models. 10/22/7
; Copyright 2007-2015, Freedom Scientific, Inc.

Globals
	collection currentCalendarInfo, collection prevCalendarInfo,
	string currentCalendarData,
	; currentCalendarInfo are dynamically generated from the parsed string.
	; Commonly used fields:
	;Status Success or Failure whether or not string was parsed.
	;CurrentView: calendar view (not working or necessary on appointments)
	;TotalNumberOfEvents:as integer
	;TotalNumberOfEventsAsString: localized string from Outlook.
	;Time: localized time info as string
	;Date: localized date info as string
	;Events only.
	;Subject:localized subject
	;Organizer:Appointment organizer
	;BusyEvents:as integer
	;BusyEventsAsString: localized string from Outlook.
;Other globals:
	int CurrentFolderType,
	int giItemType,
	int gbIsInAppointmentViewer,
	int gbOutlookObject,
	int gbExplorerObject,
	int gbOOMHelperObject,
	int gbCalendarItemsObject,
	int gbCurrentFolderObject,
	int gbFolderItemsObject,
	int gbRangeDataRetrieved,
	int gbRefreshObject,
	int giEventCount,
	int giAppointmentCount,
	int giTimeSlotInterval,
	int gbCalendarHasSpoken,
	string gsCurrentDateRange,
	string gsCurrentDate,
	string gsAllDayEvents,
	string gsTimedAppointments,
	string gsDateToProcess,
	string gsPreviousDateToProcess,
	String gsPrevBeginDate,
	String gsPrevBeginTime,
	String gsCalendarObjectValue,
	String gsDateEntered,
	Int giDateIsEntered,
	Handle ghCalendarPane


Const
; Calendar object class name constants Office365 2016 and later:
	CalendarDayViewClass = "DayViewWnd",
	CalendarWeekAndMonthViewClass = "WeekViewWnd",
; keys for currentCalendarInfo collection.
	key_Status = "Status",
	key_CurrentView = "CurrentView",
	Key_TotalNumberOfEvents = "TotalNumberOfEvents",
	key_TotalNumberOfEventsAsString = "TotalNumberOfEventsAsString",
	Key_Time = "Time",
	Key_Date = "Date",
	Key_Subject = "Subject",
	Key_Organizer = "Organizer",
	Key_BusyEvents = "BusyEvents",
	Key_BusyEventsAsString = "BusyEventsAsString",
	; End of keys for currentCalendarInfo collection.
	LCID_ENGLISH_CANADA = "1009",
	; Some constants left for correct Outlook 2000 functionality.
	ciCalGridId = 103,
	ciAppointmentEditBoxID = 1,
	; Control IDs
	ID_CalendarPane = 109,
	ID_CalendarDates = 1,
	ID_CalendarAppointments = 1,
	; View IDs
	msoDayView = 1094,
	msoWorkWeekView = 5556,
	msoWeekView = 1095,
	msoMonthView = 1096,
	; Window classes
	WC_CalendarDates = "AfxWndW",
	WC_CalendarPane = "AfxWndW",
	WC_Outlook2013CalendarPaneMonthView = "WeekViewWnd",
	WC_Outlook2013CalendarPaneNotMonthView = "DayViewWnd",
	WC_Appointments = "RichEdit20WPT",
	WC_DatePicker = "rctrl_renwnd32",
	; Window names that do not need any translation
	WN_DatePicker = "DatePicker",
	WN_EnglishMonthView = "Month View",
	WN_EnglishWeekView = "Week View",
	; Strings that need not to be translated...
	; For selecting correct date
	SC_Apostrophy = "'",
	SC_DateDelimeters = ".,'",
	SC_WeekDayPlaceHolder = "ddd",
	SC_MonthPlaceHolder = "MMM",
	SC_DatePlaceHolder1 = "d",
	SC_DatePlaceHolder2 = "dd",
	SC_YearPlaceHolder = "yyy",
	SC_ShortMonthPlaceHolder = "M",
	SC_ShortDatePlaceHolder = "d",
	SC_DigitChars = "0123456789",
	; Object ID's
	msoControlButton = 1,
	; returns from GetCalendarView function
	ciDayView=1,
	ciWorkWeekView=2,
	ciWeekView=3,
	ciMonthView=4,
	ciAppointmentEditField=5,
	ciRangeView=6,
	scSwitchEvent="SwitchEvent",
; Object property names--do not translate
	scItemSubject="Subject",
	scItemAllDayEvent="AllDayEvent",
	scItemEnd="End",
	scItemLocation="Location",
	scItemIsRecurring="IsRecurring",
	scItemStart="Start",
	; Function names for scheduling...
	FN_ClearDateFlag = "ClearDateFlag"