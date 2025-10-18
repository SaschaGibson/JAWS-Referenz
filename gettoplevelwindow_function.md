# Function: GetTopLevelWindow

## Description

Similar to GetAppMainWindow. These two functions differ however in that
GetAppMainWindow will always return the handle for the main window of
the application. In contrast, the GetTopLevel function can be used
within dialog boxes to return the handle of the main dialog window when
there may be several child windows which are also real windows. This can
be useful when the GetRealWindow function does not return the handle of
the main dialog. A real window refers to a window with a title.

## Returns

Type: Handle\
Description: The handle of the TopLevel window, as opposed to the
AppMainWindow.\

## Parameters

### Param 1:

Type: Handle\
Description: This function starts with the window that is identified by
a window handle. Type the name of a variable or choose a script function
that can provide the handle for the starting window.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
