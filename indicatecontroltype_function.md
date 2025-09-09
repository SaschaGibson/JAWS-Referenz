# Function: IndicateControlType

## Description

Pass the correct control type you want to be spoken for the window or
control to speak. This will honor the speech markup.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Int\
Description: Enter the type of control to be spoken.\
Include: Required\

### Param 2:

Type: string\
Description: sControlName Enter the name of the control to be spoken, if
you have a custom name for this control. This would be true if the wrong
name is spoken, or perhaps none at all, and you are customizing this
control to speak. An example would be an edit that just says Edit
without the control\'s name.\
Include: Optional\

### Param 3:

Type: String\
Description: Enter the text or value of the control to be spoken, if it
doesn\'t happen already. Most edits, lists, etc. already do it, but if
you need to change this here\'s where.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 5.0 and later
