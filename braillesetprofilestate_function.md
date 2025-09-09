# Function: BrailleSetProfileState

## Description

The profile's state can be set to one of brlComputerInContractedOut,
brlComputerInContractedOut or brlContractedInContractedOut.

## Returns

Type: int\
Description: true or false.\

## Parameters

### Param 1:

Type: int\
Description: state one of the following constants from hjconst.jsh:
brlComputerInContractedOut, brlComputerInContractedOut or
brlContractedInContractedOut\
Include: Required\

### Param 2:

Type: int\
Description: destination -1 (default) do not save, or one of wdUser,
wdSession or wdFocus.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 23.0 and later
