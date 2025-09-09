# Function: MonitorFormsModeComboBox

## Description

Monitors for forms mode combo boxes which were opened and forms mode
turned on by use of Alt+DownArrow. If focus leaves the combo box without
the box being closed and forms mode exited with Alt+UpArrow, turns off
global variable used to watch for closing the box and exiting forms
mode.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: handle\
Description: hwndFocus from FocusChangedEventEx.\
Include: Required\

### Param 2:

Type: handle\
Description: hwndPrevFocus from FocusChangedEventEx.\
Include: Required\

### Param 3:

Type: Int\
Description: nChild from FocusChangedEventEx.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 10.0 and later
