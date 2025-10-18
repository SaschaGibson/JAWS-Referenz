# Function: ProcessDocumentLoadAppAlerts

## Description

used by DocumentLoadedEvent to allow special app-specific processing. If
any app-specific alerts are shown in the virtual viewer, then the rest
of the default DocumentLoadedEvent action will be delayed until the
virtual viewer is dismissed.

## Returns

Type: int\
Description: True if alerts are being displayed in the virtual viewer,
false otherwise.\

## Parameters

No Parameters

## Version

This function is available in the following releases:

1.  JAWS 8.00 and later
