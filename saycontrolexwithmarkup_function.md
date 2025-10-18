# Function: SayControlExWithMarkup

## Description

This function is designed to be used in the script language to speak a
control that requires custom processing (any control for which
SayWindowTypeAndText does not properly speak the name and type of the
control). This function is designed to honor the user\'s output mode
settings for each component of the control\'s description. This function
takes nine parameters, eight of which are string parameters. The first
parameter is the window handle of the control that is to be spoken. The
next eight parameters include one parameter for each component of a
control\'s description. Each string parameter has a corresponding Output
Mode. The eight string parameters are String strControlName = Either
OT_DIALOG_NAME, OT_DOCUMENT_NAME, or OT_CONTROL_NAME, depending on the
type of window that is to be spoken, String strControlType =
OT_CONTROL_TYPE, String strControlState = OT_ITEM_STATE, String
strContainerName = OT_CONTROL_GROUP_NAME, String strContainerType =
OT_CONTROL_TYPE, String strValue = OT_SELECTED_ITEM, String strPosition
= OT_POSITION, String strDialogText = OT_DIALOG_TEXT. This function
works by building a string based upon the five components of the control
description, adding each component only if the user has specified that
this item should speak in the current verbosity level. Then this
function calls Say with the constructed string as the first parameter,
OT_NO_DISABLE as the second parameter and specifies that the string
contains Speech Markup. If any portion of the control description is not
specified, JFW will obtain the default value for that component of the
control description and will add the default value of that component to
the control description string. Therefore, if SayWindowTypeAndText
speaks every part of a control correctly other than the Control Type,
you can call SayControlExWithMarkup and pass it the Window Handle and
the text you would like to be spoken and pass a null string (\"\") to
the function for the remainder of the parameters. SayControlExWithMarkup
will obtain the default values for the control type, control state,
container name, container type, control value, control positional
information, and the dialog text if the specified window is the top
level window of a dialog box using the same methods as
SayWindowTypeAndText and it will include these values in the control
description string that is spoken. Note that this version of the
function assumes that all parameters are using speech markup, ie they
contain correct xml markup including symbol replacement (eg \< with \<
etc. This allows a control\'s type or state or value to be marked up to
play sounds, change voice etc.

## Returns

Type: Int\
Description: Returns 1 if the function successfully assembled the
control description string and spoke the control description (i.e. the
length of the control description string was equal to 0). If for some
reason the function failed to assemble the control description string,
the function returns 0. One reason why this function would return 0 is
that the user has specified that all the output modes be turned off in
the current verbosity level.\

## Parameters

### Param 1:

Type: Handle\
Description: The window handle of the control.\
Include: Required\

### Param 2:

Type: String\
Description: The name of the control. This parameter is assigned an
Output Mode of either OT_DIALOG_NAME, OT_DOCUMENT_NAME, or
OT_CONTROL_NAME, depending on the type of window that is to be spoken.
If the window that is to be spoken has a window type of WT_DIALOG, this
parameter is assigned an Output Mode of OT_DIALOG_NAME. If the specified
window is the App Main Window or Real Window, it is assigned an Output
Mode of OT_DOCUMENT_NAME. Otherwise it is assigned an Output Mode of
OT_CONTROL_NAME.\
Include: Optional\

### Param 3:

Type: String\
Description: The control type. This parameter is assigned an Output Mode
of OT_CONTROL_TYPE.\
Include: Optional\

### Param 4:

Type: String\
Description: The control state. This parameter is assigned an Output
Mode of OT_ITEM_STATE.\
Include: Optional\

### Param 5:

Type: String\
Description: The name of the control container box. For example, if this
control is part of a group box, this paramater would be the name of the
group box. This parameter is assigned an Output Mode of
OT_CONTROL_GROUP_NAME.\
Include: Optional\

### Param 6:

Type: String\
Description: The control type of the control container. This parameter
is assigned an Output Mode of OT_CONTROL_TYPE. It is only spoken if the
user has specified that both OT_CONTROL_GROUP_NAME and OT_CONTROL_TYPE
are enabled.\
Include: Optional\

### Param 7:

Type: String\
Description: The current value of the control. For example, if the
specified control is a list box, the current value of the control is the
text of the selected item in the list box. This parameter is assigned an
output mode of OT_SELECTED_ITEM.\
Include: Optional\

### Param 8:

Type: String\
Description: Any relevant positional information for the control. For
example if the specified control is a list box, the relevant positional
information for the control is the index of the selected item in the
list box. This parameter is assigned an output mode of OT_POSITION.\
Include: Optional\

### Param 9:

Type: String\
Description: If the specified control is the top level window of a
dialog box, this parameter specifies the text that is to be spoken as
the static text of the dialog box. This parameter is assigned an output
mode of OT_DIALOG_TEXT.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 5.0 and later
