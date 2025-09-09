# Function: InputBox

## Description

This function displays a simple dialog box containing four controls. One
control is an edit box in which you can enter information. Another
control is a Static Text window containing the prompt of the edit box.
The other two controls are the OK and Cancel buttons. If you enter text
into the Edit box and press the OK button, the text you typed in the
Edit box is returned to the calling function by way of the third
variable of the function, which is a string variable that is passed by
reference to the calling function.

## Returns

Type: Int\
Description: Returns 1 if the OK button was pressed. Returns 0 if the
cancel button was pressed.\

## Parameters

### Param 1:

Type: String\
Description: The text of the message that you would like to be displayed
in the prompt of the Edit Box.\
Include: Required\

### Param 2:

Type: String\
Description: The text of the Dialog Box\'s title.\
Include: Required\

### Param 3:

Type: String\
Description: This parameter is passed to the calling funcction or script
by reference. If you type text in the Edit box and press the OK button,
this parameter returns the text that you typed to JFW. If you do not
enter text into the Edit box or you press the Cancel button, this
parameter contains a NULL string,\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
