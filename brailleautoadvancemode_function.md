# Function: BrailleAutoAdvanceMode

## Description

When Auto Advance Mode is enabled, JAWS will automatically pan through
documents at the specified speed. Panning stops either at the bottom of
the document, focus changes, a routing button is pressed or this
function is called again with the iMode parameter set to FALSE. If a
Flash Message is displayed, Auto Advance is paused until the Flash
message is manually or automatically cleared. The user may still pan
left or right while the mode is active. the timer will be restarted so
that the user may reread the new information.

## Returns

Type: int\
Description: TRUE if the feature was successfully enabled or disabled.\

## Parameters

### Param 1:

Type: int\
Description: Set to TRUE to turn the mode on, FALSE to turn it off.\
Include: Required\

### Param 2:

Type: int\
Description: optional duration between pans, if not supplied, defaults
to the value of OPT_BRL_AUTOADVANCE_INTERVAL.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 6.00 and later
