# Function: PushBrailleString

## Description

This function will push the given text to the braille display to be
shown, setting the cursor at the given position. Strings can only be
pushed to the display if the active braille mode is the Push mode. While
in Push mode, only text sent by PushBraille methods will be shown on the
display. Push mode can be enabled by calling SetJCFOption(OPT_BRL_MODE,
BRL_MODE_PUSH). Make sure it is disabled appropriately, or else the user
will be stuck in a mode where their normal braille isn\'t displayed.

## Returns

Type: void\

## Parameters

### Param 1:

Type: string\
Description: Text the text to push to the braille display.\
Include: Required\

### Param 2:

Type: int\
Description: CursorPosition the position of the cursor in the text.\
Include: Required\

### Param 3:

Type: string\
Description: BreakableOffsets A string containing a comma delimited list
of offsets at which the string can be broken for panning (i.e.
\"2,5,6\").\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 17.0 and later
