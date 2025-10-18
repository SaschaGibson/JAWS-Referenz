# Function: DlgSelectControls

## Description

Displays a list box containing controls you may want to perform any one
of the following actions: right single click, left single click, left
double click, or Move To. You may change the dialog window title,
display any combinations of the buttons, and specify a default.

## Returns

Type: Int\
Description: An integer value indicating what type of mouse action is
required to activate the selected task tray icon, whether it be Left
Mouse Button, Right Mouse Button, or double click of the left mouse
button.\

## Parameters

### Param 1:

Type: String\
Description: The list of controls.\
Include: Required\

### Param 2:

Type: Int\
Description: The number of controls.\
Include: Required\
\* Returns data by reference\

### Param 3:

Type: String\
Description: The new window title.\
Include: Required\

### Param 4:

Type: Int\
Description: The mask that indicates the buttons desired. See the
available buttons in HjConst.jsh with the prefix bt\_.\
Include: Required\

### Param 5:

Type: Int\
Description: The default button as specified by the mask value.\
Include: Required\

### Param 6:

Type: Int\
Description: the index of the item which should have the focus when the
dialog is invoked. (JAWS 12.0 and above)\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
