# Function: HandleCustomAppWindows

## Description

You can use this function instead of modifying the FocusChangedEvent
function when modifying scripts. The AppWindow is the top frame window,
and most of the time you won\'t need to modify it. Some wizard dialogs,
among other things, present themselves as problems here.

## Returns

Type: Int\
Description: Return true when your logic is successful, FALSE when you
want the default behavior of the FocusChangedEvent function at
appWindow.\

## Parameters

### Param 1:

Type: Handle\
Description: Enter the handle to the window which is the Application
Window.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
