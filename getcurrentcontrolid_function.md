# Function: GetCurrentControlID

## Description

Determines the control ID of the active child window in a dialog box.
Each list box, edit field, radio button, and so on, in a dialog has a
unique control ID number. Child windows that contain static text all
have the same control ID. This function performs the same task as
GetControlID but it does not require a window handle.

## Returns

Type: Int\
Description: Provides a numeric ID for the active dialog control, or
returns 0 when a dialog box is not active.\

## Parameters

No Parameters

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
