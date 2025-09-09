# Function: PlaceMarkersEnumerate

## Description

this function enumerates the placemarkers in a virtual document calling
a user supplied callback function for each marker. the callback function
is passed the index of the marker, the marker\'s name and the text at
the marker. The text at the marker is optionally marked up if the second
parameter to this function is true. The enumeration continues until
either all markers have been visited or the callback returns false. Note
this is only available in JAWS 5.00.758 or higher.

## Returns

Type: int\
Description: true if the enumeration visited all markers, false if the
enumeration failed or the callback returned false for any marker.\

## Parameters

### Param 1:

Type: string\
Description: the name of the function to be called for each marker. The
function must be defined as func(int nIndex, string sMarkerName,
sMarkerText), where func maybe any legal function name.\
Include: Required\

### Param 2:

Type: int\
Description: must be set to true if the text at the marker is to be
passed with markup, false for no markup.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 5.00 and later
