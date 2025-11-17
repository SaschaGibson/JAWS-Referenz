; JAWS 5.0 Script file for Microsoft Visual Studio.NET 2002
; Copyright 2010-2015 by Freedom Scientific BLV Group, LLC
; Built by Brett Lewis (analytic Solutions www.analyticsolutions.biz)
; last modified on September 9, 2003.


Messages
;Help message for ShowHelp
@vsmsg1_H
Close all nonactive windows %KeyFor(CloseNonactiveWindows).
Make all currently open windows floating %KeyFor(MakeWindowsFloating).
Display a list of available code elements in the current module %KeyFor(MoveToCode).
Read current window title %KeyFor(SayWindowTitle).
List all currently visible windows %KeyFor(ListWindows).
Read selected control position %KeyFor(ReadControl).
Read selected control size %KeyFor(ReadControlSize).
Read status line text %KeyFor(SayBottomLineOfWindow).
Move to a selected component on a windows form %KeyFor(MoveToComponent).
Get quick info on currently selected code %Keyfor(QuickInfo).
@@
@vsmsg1_L
Closing all nonactive windows
@@
@vsmsg1_S
Close
@@
@vsmsg2_L
Making windows floating
@@
@vsmsg2_S
Make floating
@@
@vsmsgErrorLevelOff
off
@@
@vsmsgErrorLevelLow
Low Priority Errors
@@
@vsmsgErrorLevelMedium
Medium Priority Errors
@@
@vsmsgErrorLevelHigh
High Priority Errors
@@
@vsmsg3_L
Visual Studio .NET
@@
@vsmsg5
: <AnnounceActiveTab> is the currently active tab
@@
@vsmsg6_L
Not currently in a windows form
@@
@vsmsg6_S
Not a form
@@
@vsmsg9_L
Statement Completion
@@
@vsmsg9_S
Complete
@@
@vsmsg10
JFWControl is loaded
@@
@vsmsg11
JFWControl is not loaded
@@
@vsmsg12
Select Open Window
@@
@vsmsgStartupText
To use %product% with the VS .Net development environment, you need to install
the JFW Add-in. You can download it by going to
http://www.freedomscientific.com/fs_support/index.cfm and entering VS .net
in the search edit box.
@@
@vsmsgStartupTitle
%product% Component Error
@@
@vsmsgToggle
|ToggleErrorAnnounce:Announce errors
@@
@vsmsg13
Select Function to Move to
@@
@vsmsg14
Select the control to move to:
@@


;UNUSED_VARIABLES

@vsmsgOff
off
@@
@vsmsgIndent
Announce indentation
@@
@vsmsgColors
Announce colors
@@
@vsmsg4_L
Output window is empty
@@
@vsmsg4_S
Empty
@@
@vsmsg7_L
Select component
@@
@vsmsg7_S
Component
@@
@vsmsg8
Unable to move to list
@@

;END_OF_UNUSED_VARIABLES

EndMessages
