# Function: HandleCustomWindows

## Description

You can use this function instead of modifying the FocusChangedEvent or
SayFocusedWinow function when modifying scripts. This will also prevent
you from having to worry about insert tab, because if you use this
function insert tab and the focus logic will now become seamlessly
consistent.

## Returns

Type: Int\
Description: Return true when your logic is successful, FALSE when you
want the default behavior of the FocusChangedEvent or SayFocusedWindow
functions or the SayWindowPromptAndText script.\

## Parameters

### Param 1:

Type: Handle\
Description: Enter the handle to the window which is the current window.
Note that in FocusChangedEvent, we pass FocusWindow. In the
SayWindowPromptAndText script, we use GetCurrentWindow, which respects
the active cursor.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
