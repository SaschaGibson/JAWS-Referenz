# Function: PushBrailleMathString

## Description

This function is identical to PushBrailleString; however, the text is
flagged as Math text, instead of plain text. The effect of this is that
the braille translator will translate the string using special math
rules, instead of the regular ones.

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
