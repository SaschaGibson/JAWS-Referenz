# Function: GetWindowTitleForApplication

## Description

Used by SayWindowTitleForApplication to retrieve the title and subtitle
that will be spoken by the SayWindowTitle script.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: handle\
Description: The application window.\
Include: Required\

### Param 2:

Type: handle\
Description: The real window.\
Include: Required\

### Param 3:

Type: handle\
Description: The current window.\
Include: Required\

### Param 4:

Type: int\
Description: The type code of the current window.\
Include: Required\

### Param 5:

Type: string\
Description: ByRef The main title that is retrieved.\
Include: Required\

### Param 6:

Type: string\
Description: ByRef The subtitle, if any, that is retrieved.\
Include: Required\

### Param 7:

Type: int\
Description: ByRef True if the message to announce the title should
announce a page name for the subtitle, false otherwise.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 14.0 and later
