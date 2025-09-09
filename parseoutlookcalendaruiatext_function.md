# Function: ParseOutlookCalendarUIAText

## Description

The string is formatted with each field on its own line, and the name
and field separated by a colon. When parsing each field, segment 1 where
colon is the delimiter is the field, segments 2-end are the field
contents. Field 1 is Status, value is Success or Failure. This is meant
to be locale-agnostic in implementation, since each locale orders the
string differently. To that end, the second parameter to this function
provides the locale to use when creating the list of fields.

## Returns

Type: string\
Description: the fields in the calendar string as supplied by UIA
(GetObjectName (TRUE,0)) function call in Outlook Calendar.\

## Parameters

### Param 1:

Type: string\
Description: the text from UIA, e.g. getObjectName (TRUE,0) from
calendar view.\
Include: Required\

### Param 2:

Type: string\
Description: the language abbreviation for the regional language in use,
e.g. GetUserLocaleInfo (LOCALE_SABBREVLANGNAME) where Locale.jsh is
included in your source file.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 18.00 and later
