# Function: ToggleOutputType

## Description

This function cycles the spoken or Brailled output type message length
from 0 (don\'t speak/Braille, 1 use long messages or 2 use short
messages). You determine whether the cycling affects Speech or Braille
by using the second optional parameter. If this parameter is not
specified the function defaults to cycling the Speech message length.

## Returns

Type: int\
Description: the new value\

## Parameters

### Param 1:

Type: int\
Description: the Output Type to cycle.\
Include: Required\

### Param 2:

Type: int\
Description: 0 speech, 1 Braille\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 6.00 and later
