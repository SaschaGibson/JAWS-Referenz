# Function: ExMessageBox

## Description

This function displays a Windows Standard Message Box. It is very much
like the function MessageBox except it allows you to specify the Message
Box title and the type of message box (i.e. The buttons that are used
and the icon that is to be displayed). This function also returns a
value that indicates which button was pressed on the Message Box.

## Returns

Type: Int\
Description: Returns an integer value indicating which button was
pressed on the message box.\

## Parameters

### Param 1:

Type: String\
Description: The text of the message that you would like to be displayed
in the main body of the message box.\
Include: Required\

### Param 2:

Type: String\
Description: The text of the Message Box\'s title.\
Include: Required\

### Param 3:

Type: Int\
Description: One or more of the Message Box type specifiers that are
listed in HJConst.jsh, separated by a single vertical bar. An example of
such is: MB_YESNOCANCEL\|MB_DEFBUTTON1 making the Yes button the
default.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
