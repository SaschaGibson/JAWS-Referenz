# Function: EnumerateTypeAndTextStringsForWindow

## Description

Information about each control is obtained using MSAA. The order in
which items are enumerated is dictated by how they appear in the MSAA
hierarchy. The callback function takes the following parameters: int
typeCode, int stateCode,string name, string value,string Description. If
the callback function returns 0 the enumeration stops, if it returns 1
the enumeration continues.

## Returns

Type: int\
Description: Number of controls enumerated.\

## Parameters

### Param 1:

Type: handle\
Description: The window containing the controls to be enumerated.\
Include: Required\

### Param 2:

Type: String\
Description: Name of the function to be called for each control.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 10.0 and later
