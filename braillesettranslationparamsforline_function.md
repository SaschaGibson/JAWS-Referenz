# Function: BrailleSetTranslationParamsForLine

## Description

This function allows the Braille mode and table to be specified for a
given line of the display and is primarily used for setting up Split
Translation mode. Note that setting translation parameters overrides
default Braille language detection. Note use
BrailleClearSplitTranslationParams to clear the translation parameters.

## Returns

Type: int\
Description: true or false\

## Parameters

### Param 1:

Type: int\
Description: the 1-based line index\
Include: Required\

### Param 2:

Type: int\
Description: modeID (e.g. Liblouis mode)\
Include: Required\

### Param 3:

Type: string\
Description: table (JBT or empty).\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 25.0 and later
