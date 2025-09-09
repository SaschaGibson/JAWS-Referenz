# Function: SayLine

## Description

This says a line of text where the active cursor is located. JAWS must
interpret whether text that has a similar vertical position is on the
same line. When the PC cursor is active, it only reads the information
that is within the active child window. When it is used with other
cursors, then it reads from one edge of the application window to the
other.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Int\
Description: Optional parameter added in JAWS 7.1. Used to indicate
whether or not the line should be highlighted as the text is being
spoken. The possible values are as follows: If the parameter is not
present or is equal to 0, do nothing; If the parameter is equal to 1,
highlight each word as it is being spoken; If the parameter is equal to
2, highlight the entire line. NOTES: (1) This functionality is not
currently supported in all applications. (2) The highlight rectangles
will only be drawn if MAGic is running.\
Include: Optional\

### Param 2:

Type: int\
Description: Set this parameter to TRUE to avoid speaking object
information such as the prompt of an object as part of this line. This
parameter is most often set to true when this function is called from
the SayNextLine and SayPriorLine scripts to avoid speaking the prompt
when arrowing over forms mode controls whose prompt is already spoken
from the prior line. This parameter is available starting with JAWS
version 10.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
