; Copyright 2021 by Freedom Scientific, Inc.
; Internal Freedom Scientific logging

Include "HJConst.jsh"
Include "FSLog.jsh"

bool Function IsFSLogEnabled()
	return builtin::IsFSLoggingEnabled(TRACE_LEVEL_VERBOSE) 
EndFunction

bool Function IsFSLogInformationEnabled()
	return builtin::IsFSLoggingEnabled(TRACE_LEVEL_INFORMATION) 
EndFunction

bool Function IsFSLogWarningEnabled()
	return builtin::IsFSLoggingEnabled(TRACE_LEVEL_WARNING) 
EndFunction

bool Function IsFSLogErrorEnabled()
	return builtin::IsFSLoggingEnabled(TRACE_LEVEL_ERROR) 
EndFunction

bool Function IsFSLogFatalEnabled()
	return builtin::IsFSLoggingEnabled(TRACE_LEVEL_CRITICAL) 
EndFunction

bool Function FSLogExample()
	FSLog("verbose test message")
	FSLog("verbose test message with int param=%1", 42)
	FSLog("verbose test message with string param=%1", "hello")
	FSLog("verbose test message with 2 string params, param1=%1 param2=%2", "hello", "world")
	FSLog("verbose test message with 9 params 1=%1 2=%2 3=%3 4=%4 5=%5 6=%6 7=%7 9=%8 9=%9 ", -1, 2, -3, 4, "5", -6, 7, -8, "-9")
	FSLogInformation("info test message")
	FSLogWarning("warning test message")
	FSLogError("error test message")
	FSLogFatal("fatal test message")
EndFunction
