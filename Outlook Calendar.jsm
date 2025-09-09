; Message header file for Outlook Calendar source file  11/02/07
; Copyright 2007-2015, Freedom Scientific, Inc.

Const
	; the constants left for correct functionality of the Outlook 2000
	scDoubleZero = "00",
	scDayCalendar = "Day Calendar",
	scWorkWeekCalendar = "Work Week Calendar",
	; End of prior versions support constants...
	; Time slot size in minutes...
	SC_TimeSlotLength = "30",
	; Slots start minutes...
	SC_HourAlignedTimeSlotStart = "00",
	SC_HalfAnHourAlignedTimeSlotStart = "30",
	SC_LastSlotEnd = "59",
	; Excluded from normal handling slots hours...
	SC_LastSlotInTheDay12Hour = "11",
	SC_LastSlotInTheDay24Hour = "23",
	; Formatting toolbar...

	; Outlook 2013 calendar support...
	SC_CalendarDayView = "Day View",
	SC_CalendarWorkWeekView = "Work Week View",
	SC_CalendarWeekView = "Week View",
	SC_CalendarMonthView = "Month View",
; for sc_2013AppointmentStartSeparator and sc_2013AppointmentEndSeparator, find the text to the right of the full date when tabbing between appointments,
; by copying the content of the Object Name: Script Utility Row | Control+f9 to copy it to clipboard.
;sc_2013AppointmentEndSeparator is the final word appointment of the above copied object name.
	sc_2013AppointmentStartSeparator = "from",
	sc_2013AppointmentEndSeparator = "Appointment",

;UNUSED_VARIABLES

	scWeekCalendar = "Week Calendar",
	scMonthCalendar = "Month Calendar",
	scLabelReminder="Reminder",
	scLabelSubject="Subject: ",
	scLabelAllDayEvent="All Day Event",
	scLabelEndDate="End Date: ",
	scLabelEndTime="End Time: ",
	scLabelLocation="Location: ",
	scLabelRecurring=" Recurring ",
	scLabelStartDate="Start Date: ",
	scLabelStartTime="Start Time",
	cbFormattingBar="Formatting",
	cbFormattingBarBoldButton="Bold",
	cbFormattingBarItalicButton="Italic",
	cbFormattingBarUnderlinedButton="Underlined"

;END_OF_UNUSED_VARIABLES

Messages
@msgErrorOpeningAppointment
Cannot open appointment.
@@
@msgSingleEvent
One All Day Event.
@@
@msgSingleTimedAppointment
One appointment.
@@
@msgMultipleEvents
%1 All Day Events.
@@
@msgMultipleTimedAppointments
%1 timed appointments
@@
@msgEventCount
 %1:
@@
@msgNotInCalendar
Not in Calendar.
@@
@msgAppointmentTitle
Appointment:
@@
@msgEventsAndAppointments
Data for %1:

All Day Events:

%2

Appointment:
%3
%4

Press Esc to close this message.
@@
@msgAppointmentStartsAt
%1 starts at: %2
@@
@msgAppointmentFinishesAt
%1 finishes at: %2
@@
@msgDateSummary
%1, %2, %3
@@
@msgDateSummaryNoDay
%1. %2
@@
@msgAppointmentInformation
%1 to %2 - %3
@@
@msgAppointmentInformationVirtual
Appointment

%1 to %2
%3

Press ESCAPE to close this message.
@@
@msgAllDayEventInformationVirtual
All day event

%1

Press ESCAPE to close this message.
@@
@msgTimeStamp
%1%2%3%4%5%6
@@
; Do not translate the next one message!
@msgFilterTemplate
([Start] >= '%1 0:01' AND [Start] <= '%2 23:59') OR ([Start] < '%1 0:01' AND [End] > '%2 23:59') OR ([End] >= '%1 0:01' AND [End] <= '%2 23:59')
@@
@msgWholeDaySelected_L
The whole day %1 is selected.
@@
@msgWholeDaySelected_S
%1 is selected.
@@
@msgLocationLabel
%1,
Location: %2

@@
@msgRecurringLabel
%1,
Recurring,

@@
@msgEventsListItem
%1, %2, %3
@@
@msgTimeAppointmentsListItem
%1
%2-%3: %4
@@
@msgRangeAppointmentsListItem
%1, %2 %3-%4: %5
@@
@msgCancelled_L
Appointment cancelled:
@@
@msgCancelled_S
Cancelled:
@@
@msgAppointmentDate_L
%1, %2
@@
@msgAppointmentTime_L
From %1 to %2 - %3
@@
@msgAppointmentTime_S
%1 - %2
%3
@@
@msgAllDayEvent_L
All day event - %1
@@
@msgAllDayEvent_S
All day event
%1
@@
@msgTypeDate_L
Type the date to move to
@@
@msgTypeDate_S
Type the date
@@
@msgNotInCalendarPane_L
You nust be in the calendar pane to use this keystroke.
@@
@msgNotInCalendarPane_S
Not in calendar pane.
@@
@msgNoNavigationPanePresent_L
No navigation pane is found. Please switch navigation pane on and then use the keystroke.
@@
@msgNoNavigationPanePresent_S
No navigation pane present.
@@
@msgNoDatePresent_L
No such date present on the screen.
@@
@msgNoDatePresent_S
No date
@@
@msgNoAppointmentsFound_L
No appointments found at the given date interval.
@@
@msgNoAppointmentsFound_S
No appointments found
@@


;UNUSED_VARIABLES

@msgButtonNotFound_L
That button was not found
@@
@msgButtonNotFound_S
Button not found
@@
@msgObjectNotFound
Object not found.
@@
@msgDataNotRetrieved
Could not retrieve data.
@@
@msgAllDayEvent
AllDayEvents
@@
@msgItemCount
Item %1:
@@
@msgNavigationpPaneWarning_L
Navigation pane is switched off. The correct functionality could not be guaranteed though some attempts to function will be performed. To gurantee correct functionality switch navigation pane on.
@@
@msgNavigationpPaneWarning_S
Navigation pane is switched off.
@@

;END_OF_UNUSED_VARIABLES

EndMessages
