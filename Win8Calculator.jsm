;Copyright 2015 Freedom Scientific, Inc.
; JAWS script message file for Win8Calculator, for Windows 10

const
;text in calculator results which preceeds the numeric output:
	WN_CalculatorResults = "Display is"

messages
;msgWin8CalculatorAppName is used for ScriptFileName (Insert+Q)
@msgWindowsCalculatorAppName
Windows Calculator
@@
;msgCalculatorTitleAndMode is spoken on Insert+T.
;%1 is the name displayed in the app title
;%2 is the current calculator mode name, taken from a UIA text element.
@msgCalculatorTitleAndMode
Title is %1
%2
@@
;msgClearDisplay is spoken when Delete is used to clear the display in Standard, Scientific or Programmer modes.
@msgClearDisplay
Clear display
@@
;msgClearInput is spoken when Delete is used to clear the input in any of the Converter modes.
@msgClearInput
Clear input
@@
;msgClearExpression is spoken when Escape is used to clear the expression being evaluated.
@msgClearExpression
Clear expression
@@
;msgNoCalculatorExpression_Error is used by the SayCalculatorExpression script to indicate no expression is present.
;An expression display shows the collected mathematical expression while calculations are being entered using Standard, Scientific or Programmer modes.
@msgNoCalculatorExpression_Error
No calculator expression
@@
;Adding Control to the shortcut keys for Sine, Cosine and Tangent performs the hyperbolic form of these functions.
;If the Hyperbolic Function button is not checked, 
;we cannot find the hyperbolic button to retrieve its name even though the shortcut key can be used to perform the action.
;Likewise, if the Hyperbolic Function is checked,
;we cannot find the names of the non-hyperbolic forms of the buttons.
;So, if we cannot find the corresponding button to get its name,
;we either add to the button name or remove from the button name msgHyperbolicFunctionNameSegment for speaking the button name.
@msgHyperbolicFunctionNameSegment 
Hyperbolic
@@
;msgHyperbolicFunctionNameFormat is used to announce the hyperbolic sine, cosine and tangent functions button names
;when the shortcut keys are used but the Hyperbolic Function button is not checked and therefore the function names cannot be retrieved.
;Arrange %1 and %2 as needed for localization.
;%1 is msgHyperbolicFunctionNameSegment , see its comment for how it is used.
;%2 is the name of the Sine, Cosine or Tangent button retrieved from the UI.
@msgHyperbolicFunctionNameFormat
%1 %2
@@
;msgCustomTutorialHelp_CalendarControl is the tutorial help mesage for the calendar controls.
;Choose Date Calculation from the mode menu to see calendar controls.
@msgCustomTutorialHelp_CalendarControl
Press Space or Enter to open the calendar popup, then use tab to move through the controls in the calendar.
@@
;msgCustomTutorialHelp_CalendarViewItemButton is for controls located in the calendar popup,
;it is the month or year button which can be used to navigate the calendar by month or year.
@msgCustomTutorialHelp_CalendarViewItemButton
Use arrow keys to change the value, press Space or Enter to change the calendar view.
@@
;msgCustomTutorialHelp_CalendarHeaderButton is for controls located in the calendar popup,
;it is for buttons which can be used to switch calendar view but cannot be used to change the current month or year value.
;These are the button showing the year and month when in a view which shows data grid days,
;or the button showing the year when in a view which allows the month button to navigate by month.
@msgCustomTutorialHelp_CalendarHeaderButton
Press Space or Enter to change the calendar view.
@@
;msgCustomTutorialHelp_CalendarViewDayItem is for controls located in the calendar popup,
;it is for the controls which show the day numbers.
@msgCustomTutorialHelp_CalendarViewDayItem
Use arrow keys to change the day, press Space or Enter to choose a day and close the calendar popup.
@@
EndMessages
