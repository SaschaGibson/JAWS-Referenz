# Function: ProcessSpeechOnNewTextEvent

## Description

This module is called by NewTextEvent and contains all the logic to
process speaking of text which is not spoken by the
MonitorNewTextEventAlerts function. For most compatible results,
overwrite this function rather than overwriting NewTextEvent to speak
text.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Handle\
Description: Focus window handle.\
Include: Required\

### Param 2:

Type: Handle\
Description: Handle of the window containing the text that was written.\
Include: Required\

### Param 3:

Type: String\
Description: String containing the text that was written.\
Include: Required\

### Param 4:

Type: Int\
Description: The attributes of the text that was written.\
Include: Required\

### Param 5:

Type: Int\
Description: The foreground color of the text that was written.\
Include: Required\

### Param 6:

Type: Int\
Description: The background color of the text that was written.\
Include: Required\

### Param 7:

Type: Int\
Description: The echo setting associated with this text.\
Include: Required\

### Param 8:

Type: String\
Description: The name of the frame containing the newly written text if
applicable.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 12.00 and later
