# Function: SetJTControllerMode

## Description

In Window mode, the Tandem Controller window has a system menu and can
be sized according to the user\'s preferences. In Full Screen mode,
Tandem Window consumes the entire screen. Pass one of the following
values to SetJTControllerMode. JTCONTROLLER_MODE_WINDOW sets the mode to
Window Mode. In this mode, system keys are passed through to the
controller system. JTCONTROLLER_MODE_FULL sets the mode to Full. In this
mode, only the Alt+Control+Break (ToggleTandemMode) keystroke is handled
by the controller. All other keystrokes are passed to the target.
JTCONTROLLER_MODE_SLEEP allows all keystrokes to be process by the
controller. JTCONTROLLER_MODE_TOGGLE toggles the Tandem Controller mode.

## Returns

Type: int\
Description: TRUE if the mode was successfully set. Returns FALSE
otherwise.\

## Parameters

### Param 1:

Type: int\
Description:\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 10.0 and later
