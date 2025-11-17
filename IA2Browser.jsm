;JAWS script message file for IA2Browser
;Copyright 2010-2015 by Freedom Scientific BLV Group, LLC

const
;specific URL
	skipProgressUpdatesForDomain = "doccenter.freedomscientific.com",
;Window Names
	wnFind = "Find:", ;Find toolbar appears above status bar
;object names:
	ObjN_search = "Search",
; Keystrokes
	ksOpenLinkInNewTab = "Control+Enter" ; keystroke to open a link in a new tab

Messages
@msg_MoveToSamePageLink_L
Moved to line %1
@@
@msg_MoveToSamePageLink_S
Line %1
@@
@msg_MoveToSamePageLinkFailed
No move Occurred.
@@
@msgMoveTabToBeginning_L
Move tab to beginning
@@
@msgMoveTabToBeginning_S
Beginning
@@
@msgMoveTabToEnd_L
Move tab to end
@@
@msgMoveTabToEnd_S
End
@@
@msgMoveTabLeft_L
Move tab left
@@
@msgMoveTabLeft_S
Left
@@
@msgMoveTabRight_L
Move tab right
@@
@msgMoveTabRight_S
Right
@@
;for the browser messages msgBrowserHotKeyHelp1 and msgForMoreProductHelp,
;%1 is the browser application name from its JSM file.
@msgBrowserHotKeyHelp1_L
To hear the %product% help topic for %1, press insert+f1 twice quickly.
@@
@msgBrowserHotKeyHelp1_S
%product% help topic for %1, insert+f1 twice quickly.
@@
@msgBrowserFormsModeHotKeyHelp_L
To move forward and backward through links and other controls, use Tab and Shift+Tab respectively.
To read the selected link or control, use %KeyFor(SayWindowPromptAndText).
To select a link from a list of all the links contained in the page, use %KeyFor(SelectALink).
To place the JAWS cursor in the address bar, use %KeyFor(AddressBar).
@@
@msgBrowserFormsModeHotKeyHelp_S
move forward and backward through links and controls, Tab and Shift+Tab respectively.
Read selected link or control, %KeyFor(SayWindowPromptAndText).
Select link from list of all links contained in page, %KeyFor(SelectALink).
Place JAWS cursor in address bar, %KeyFor(AddressBar).
@@
@MsgVirtualFind
Virtual Find
@@
@msgBrowserWindowKeysHelp1_L
To move forward to the next link or control, press Tab.
To move backwards to the previous Link or control, press Shift+Tab.
To activate a link, press Enter.
To move back to the previous page address you came from, press %KeyFor(GoBack).
To move forward, press %KeyFor(GoForward).
To move focus to the Address Bar, press Alt+D.
@@
@msgBrowserWindowKeysHelp1_S
Move to next link or control, Tab.
Move to previous Link or control, Shift+Tab.
Activate link, Enter.
Move back a page, %KeyFor(GoBack).
Move forward a page, %KeyFor(GoForward).
Move to Address Bar, Alt+D.
@@
@msg_column
Column %1
@@
@msg_row
Row %1
@@
@msgEnteringTable
%1 Table with %2 columns and %3 rows
@@
@msgEnteringTableWithSummary
%1 Table with %2 columns and %3 rows, Summary: %4
@@
@msgLeavingTable
Leaving table
@@
; for msgTableCoordinates_L/S, %1=column number, %2=row number
@msgTableCoordinates1_L
column %1 row %2
@@
@msgTableCoordinates1_S
col %1 row %2
@@
@msg_sort_changed
Sorted %1
@@


;UNUSED_VARIABLES

@msgBrowserVirtualHotKeyHelp1_S
List of Links, %KeyFor(SelectALink).
List of form fields, %KeyFor(SelectAFormField).
List of Frames, %KeyFor(SelectAFrame).
list of headings, %keyFor(SelectAHeading).
List of tool bar buttons, %KeyFor(ToolBar).
move to next or prior frame, %keyFor(MoveToNextFrame) and %keyFor(moveToPriorFrame).
move to next or prior heading, %keyFor(MoveToNextHeading) and %keyFor(moveToPriorHeading).
move to first or last heading, %keyFor(moveToFirstHeading) and %keyFor(moveToLastHeading).
move to next or prior heading at level, %KeyFor(MoveToNextHeadingLevelN) through 6 and %keyFor(moveToPriorHeadingLevelN) through 6 respectively.
move to first or last heading at level, %keyFor(MoveToFirstHeadingLevelN) through 6 and %keyFor(moveToLastHeadingLevelN) through 6 respectively.
move forward past links to text, %KeyFor(MoveToNextNonLinkText).
update screen view to location of Virtual Cursor, %KeyFor(RefreshScreen).
jump to first control on form, %KeyFor(FocusToFirstField).
jump to next control on form %KeyFor(FocusToNextField).
jump to previous control on form, %KeyFor(FocusToPriorField).
jump to last control on form, %KeyFor(FocusToLastField).
 Speak U R L, %KeyFor(AddressBar).
writes the current U R L to the virtual viewer, %KeyFor(AddressBar) twice quickly.
toggle Virtual Cursor mode, %KeyFor(VirtualPcCursorToggle).
When on a control, turn on forms mode  by pressing %KeyFor(Enter).
Restore Virtual Cursor, %KeyFor(PcCursor).
For specific help on this page, %KeyFor(ScreenSensitiveHelp).
list of Standard application keystrokes, %KeyFor(WindowKeysHelp).
@@
@msg_DocPropError
Unable to retrieve document properties.
@@
@msg_PageInfo
page %1, %2 of %3
@@
@msg_LineInfo
Line %1, Char %2
@@
@msg_ColumnInfo
Column %1 of %2
@@
@msg_section
Section %1
@@
@msg_OutOfSection
Out of section
@@
@MSG_ACTIVECURSORHELP
Press JAWSKey + delete for more information
@@
;END_OF_UNUSED_VARIABLES
EndMessages
