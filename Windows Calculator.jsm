;Copyright 2010-2016 Freedom Scientific, Inc.
;JAWS Script message file for Windows 7 and 8 Calculator

;Scripts for the Windows 7 and 8 calculator were renamed from "windows Calculator.*" to "Calc.*",
;Except for Windows Calculator.jsm.
;Windows Calculator.jsm remain as the message files for the renamed script files,
;to avoid the need for retranslation of the messages after renaming the script files.

const

;Calculator modes:
;Note that these mode must appear in the order specified,
;since they are used as an indexed list of the modes.
;The mode constants are listed in the jsh header.
	CalculatorModeList = "Standard|Scientific|Programmer|Statistics",
	CalculatorModeListSeparator = "|",

;divide by 0 error message:
	sc_CannotDivideByZero = "Cannot divide by zero",
;used as month day year parcer in Date Time Picker controls:
	scDateSeparator = "/",

;Bit display window, for apdding the lines so that the position indicators are spaced correctly:
	scBitPositions_63_47_32 = "63 47 32",
	scBitPositions_Padded_63_47_32 = "63                  47               32",
	scBitPositions_31_15_0 = "31 15 0",
	scBitPositions_Padded_31_15_0 = "31                  15                0",
	scBitPositions_15_0 = "15 0",
	scBitPositions_Padded_15_0 = "15                0",
	scBitPositions_0 = "0",
	scBitPositions_Padded_0 = "        0",

;object names:
	objn_Memory = "Memory",

;screen comparisons for text which may appear in the result display:
	scCannot = "Cannot",
	scError = "Error",
	scInvalid = "Invalid",
	scResult = "Result",
	scOperation = "Operation"

Messages
@msgWindowsCalculatorAppName
Windows Calculator
@@
;calculator view names
;for msgViewName
;%1 is one of the mode names found in CalculatorModeList
@msgViewName
%1 view
@@
;for msgCalculatorTitleAndMode
;%1 is the name displayed in the app title
;%2 is msgViewName
@msgCalculatorTitleAndMode
Title is %1
%2
@@
;for msgControlNotVisible
;%1 is the name of the control
@msgControlNotVisible
%1 control not visible
@@
;for msgControlUnavailable_L
;%1 is the name of the control.
@msgControlUnavailable_L
%1 control Unavailable
@@
@msgControlUnavailable_S
%1 unavailable
@@
@msgDisplayWindowNotFound_L
Display window not found
@@
@msgDisplayWindowNotFound_S
Not found
@@
;msgStatisticsListBoxStatusCountEquals
;%1 is the number which appears after the "Count =" text in Statistics mode
@msgStatisticsListBoxStatusCountEquals
Count = %1
@@
@msgFunctionListUnavailable
The function list is only available when the basic calculator controls are available.
@@
@msgFunctionsListName
Functions List
@@
;for msgFunctionStateOn and msgFunctionStateOff,
;%1 is the name of a toggleable function, such as Inverse
@msgFunctionStateOn
%1 on
@@
@msgFunctionStateOff
%1 off
@@
@msgMemoryWindowIsEmpty
Memory Window is empty
@@
@msgMemoryWindowHasValue
Memory Window Has value
@@
@msgNotFound
Not found
@@
;for msgParenNestingLevel
;%1 is the text shown for the nesting level, as in ( = 4
@msgParenNestingLevel
Parentheses level %1
@@
@msgNoParenNestingLevel
Parentheses level = 0
@@
@msgHistoryOn
History on
@@
@msgHistoryOff
History off
@@
@msgHistoryUnavailable
History unavailable
@@
@msgHistoryListBoxName
History
@@
@msgClearHistory
Clear history
@@
@msgResultStaticName
Result:
@@
@msgBitsDisplayName
Bits display
@@
;for msgActiveNumberModifier
;%1 is the name of a radio button that modifies the result display output
@msgActiveNumberModifier
Active number modifier is %1
@@
@msgCannotDetermineActiveNumberModifier
Cannot determine the active number modifier.
@@
@msgNoActiveNumberModifier
No active number modifier
@@
;for msgActiveNumberBase
;%1 is the name of one of the number base radio buttons.
@msgActiveNumberBase
Active number base is %1
@@
@MsgInverseCheckBoxNotAvailable
the inverse checkbox is only available in Scientific mode.
@@
@MsgActiveNumberBaseNotAvailable
the active number base is only available in Programmer mode.
@@
@MsgCannotDetermineActiveNumberBase
Cannot determine the active number base.
@@
@msgHotKeyHelp1_L
To read the calculator display, press  %KeyFor(ReportCalculatorDisplay).
To read the active number base, press  %KeyFor(SayNumberBase).
To read the state of the number base modifier control, press  %KeyFor(SayBaseModifier).
To hear the current calculator view, press  %KeyFor(ReportCalculatorView).
To hear the status of the memory indicator window, press  %KeyFor(ReportMemoryIndicator).
To hear the status of parentheses nesting, press  %KeyFor(ReportParenNestingLevel).
To switch calculator modes, choose it from the view menu.
@@


;UNUSED_VARIABLES

@msgCurrentlyInDisplay_L
Currently in Display
@@
@msgCurrentlyInDisplay_S
Displayed
@@

;END_OF_UNUSED_VARIABLES

EndMessages
