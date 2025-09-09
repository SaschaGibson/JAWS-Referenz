; We do not want to add the FSLog related functions to builtin.jsd since they are primarily intended
; for internal use. However, we need to do something to tell the script compiler about the functions
; to avoid compiler errors. Therefore, we have decided to use prototype statements.

; The following prototype statements are for the logging related built-in script functions.
prototype void Function FSLog(string message, optional variant v1, variant v2, variant v3, variant v4, variant v5, variant v6, variant v7, variant v8, variant v9)
prototype void Function FSLogInformation(string message, optional variant v1, variant v2, variant v3, variant v4, variant v5, variant v6, variant v7, variant v8, variant v9)
prototype void Function FSLogError(string message, optional variant v1, variant v2, variant v3, variant v4, variant v5, variant v6, variant v7, variant v8, variant v9)
prototype void Function FSLogFatal(string message, optional variant v1, variant v2, variant v3, variant v4, variant v5, variant v6, variant v7, variant v8, variant v9)

prototype void Function IsFSLoggingEnabled(int level)

; The following prototype statements are for the script functions implemented in FSLog.jss.
prototype bool Function IsFSLogEnabled()
prototype bool Function IsFSLogInformationEnabled()
prototype bool Function IsFSLogWarningEnabled()
prototype bool Function IsFSLogErrorEnabled()
prototype bool Function IsFSLogFatalEnabled()
