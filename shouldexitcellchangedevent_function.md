# Function: ShouldExitcellChangedEvent

## Description

Determines if the CellChangedEvent function should exit and not run
code. This is used in default to prevent the default CellChangedEvent
function from running when focus is moving into Microsoft Word, which
has its own CellChangedEvent function.

## Returns

Type: int\
Description: True if the CellChangedEvent function should exit and not
run code.\

## Parameters

No Parameters

## Version

This function is available in the following releases:

1.  JAWS 18.0 and later
