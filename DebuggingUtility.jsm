messages
@msgBufferCloseLink
Close
@@
; for msgShowLastUnknownFunctionName,
; %1 is the name of a function or script.
; if a script, it has been formatted by msgUnknownScript
@msgShowLastUnknownFunctionName
Last unknown function: %1
@@
; for msgUnknownScript
; %1 is the name of a script
@msgUnknownScript
script %1
@@
@msgNoUnknownFunction
No unknown functions since %product% was started.
@@
@msgLoggingMenu_Pause
Pause Logging
@@
@msgLoggingMenu_Resume
Resume Logging
@@
@msgLoggingMenu_Stop
Stop Logging
@@
@msgLoggingMenu_Reset
Reset Logging
@@
@msgLoggingMenu_Show
Show Log
@@
@msgShowUnknownFunctionCallStack_On
Show unknown function call stack is on
@@
@msgShowUnknownFunctionCallStack_Off
Show unknown function call stack is off
@@
@msgSuppressUnknownFunctionCallNotification_On
Unknown function call notification suppressed
@@
@msgSuppressUnknownFunctionCallNotification_Off
Unknown function call notification not suppressed
@@
@msgScriptCallstackLoggingMenuTitle
Script Callstack Logging
@@
@msgCallStackLogging_On
Callstack logging on
@@
@msgCallStackLogging_Stop
Callstack logging stop
@@
@msgCallStackLogging_Pause
Callstack logging Paused
@@
@msgCallStackLogging_Resume
Callstack logging resumed
@@
@msgCallStackLogging_Reset
Callstack logging reset
@@
@msgErr_CallStackLogEmpty
the script callstack log is empty
@@
@msgScriptCallStackLogTitle
Script Callstack Log

@@
;for msgScriptCallStackLogEntry
;%1 is the number for the log entry, 1, 2, 3, etc.
;%2 is the multiline entry for the current call stack
@msgScriptCallStackLogEntry
Log Entry %1:

%2
----------------------------------------
@@
@msgSayLoggingMenuTitle
Say Logging
@@
@msgSayLogging_On
Say logging on
@@
@msgSayLogging_Stop
Say logging stop
@@
@msgSayLogging_Pause
Say logging Paused
@@
@msgSayLogging_Resume
Say logging resumed
@@
@msgSayLogging_Reset
Say logging reset
@@
@msgErr_SayLogEmpty
the say log is empty
@@
@msgSwitchLogTitle
Switch Log

----------------------------------------
@@
;for msgSwitchLogEntry
;%1 is the script or configuration name switched from,
;%2 is the script or configuration name switched to.
;%3 is the most recent callstack entry retrieved by GetScriptCallStack
@msgSwitchLogEntry
Switch from %1
       to %2

%3
----------------------------------------
@@
@msgSwitchLoggingMenuTitle
Switch Logging
@@
@msgSwitchLogging_On
Switch logging on
@@
@msgSwitchLogging_Stop
Switch logging stop
@@
@msgSwitchLogging_Pause
Switch logging Paused
@@
@msgSwitchLogging_Resume
Switch logging resumed
@@
@msgErr_SwitchLogEmpty
the Switch log is empty
@@
;for msgHandleInfo,
;%1 is the decimal handle,
;%2 is the hexidecimal handle
@msgHandleInfo
%1 = {%2}
@@
@msgSayLogTitle
Say Log

----------------------------------------
@@
;for msgSayFunctionInfo
;%1 is the string of text sent to the Say function
;note that if speech markup is present, %1 will contain a second indented line with the speech markup
;%2 is the iOutputType
@msgSayFunctionInfo
Say: %1
Output Type: %2
@@
;for msgSayUsingVoiceFunctionInfo
;%1 is the string of text sent to the SayUsingVoice function
;note that if speech markup is present, %1 will contain a second indented line with the speech markup
;%2 is the iOutputType
;%3 is the voice the function will use to speak the message
@msgSayUsingVoiceFunctionInfo
SayUsingVoice: %1
Output Type: %2
Voice: %3
@@
;for msgSayLogEntry
;%1 is the name of the calling function, and optionally extra information about its parameters
;note that %1 may be multiline if it contains extra information about parameters
;%2 is the name of the application where the function was used
;%2 is the name of the active configuration in use
;%4 is the window handle of the current window
;%5 is the window class of the current window
;%6 is the subtype code of the current window
;%7 is the multiline callstack information
@msgSayLogEntry

%1
Application: %2
Active configuration: %3
Window handle: %4
Window class: %5
Window subtype code: %6

%7
----------------------------------------
@@
;for msgTestKeysOutput
;%1 is the name of the key received by KeyPressedEvent,
;%2 is the numeric hexidecimal value of the key received by KeyPressedEvent
@msgTestKeysOutput
%1 %2
@@
@msgTestKeysOn
Test keys on
@@
@msgTestKeysOff
Test keys off
@@
@msgTestKeysHelp
Press a key to see the name and hex value, press %KeyFor(HomeRowToggle) to exit key testing.
@@
EndMessages
