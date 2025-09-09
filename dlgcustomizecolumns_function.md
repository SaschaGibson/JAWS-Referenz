# Function: DlgCustomizeColumns

## Description

Displays a dialog that contains options for indicating how column
headers are spoken or brailled. This function requires the caller to
supply column header text delimited by a vertical bar character. This
function also requires the caller to supply a key in the form of a
string to store the custom information. The function also returns the
current or modified speech and braille custom column information.

## Returns

Type: Int\
Description: FALSE if the DlgCustomizeColumns is already open, TRUE
otherwise.\

## Parameters

### Param 1:

Type: String\
Description: Contains a list of vertical bar character delimited column
header text.\
Include: Required\

### Param 2:

Type: String\
Description: A key to identify specific custom column information.\
Include: Required\

### Param 3:

Type: String\
Description: A string used for the dialog title.\
Include: Optional\

### Param 4:

Type: String\
Description: The current or modified Speech Column information.\
Include: Optional\
\* Returns data by reference\

### Param 5:

Type: String\
Description: The current or modified Braille Column information.\
Include: Optional\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 11.0 and later
