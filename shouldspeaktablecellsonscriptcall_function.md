# Function: ShouldSpeakTableCellsOnScriptCall

## Description

Used by function SpeakTableCells to determine if the function should
proceed or exit. If an event will speak the table cells, this function
should return false to prevent double speaking when the scripts call the
function.

## Returns

Type: int\
Description: True if SpeakTableCells should proceed in the event of a
script call, false otherwise.\

## Parameters

### Param 1:

Type: int\
Description: The table navigation direction which resulted in the call
to function SpeakTableCells. Because no event fire for a SayCell, this
function should return true if the table nav direction was
TABLE_NAV_NONE.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 18.0 and later
