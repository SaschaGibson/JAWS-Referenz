# Function: SayUsingVoice

## Description

Speak a string of text using a specific synthisizer voice.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: String\
Description: Type in the constant representing the voice to be used.
These constants are defined in the file hjconst.jsh and are listed
below: VCTX_GLOBAL, VCTX_MESSAGE, VCTX_KEYBOARD, VCTX_SCREEN,
VCTX_PCCURSOR, VCTX_JAWSCURSOR\
Include: Required\

### Param 2:

Type: String\
Description: Type the text that is to be spoken, or specify a variable
name or script function that can provide the required text string. Text
strings that are typed must be enclosed within quotation marks.\
Include: Required\

### Param 3:

Type: Int\
Description: Type in one of the following constants that represent the
output mode to be used: OT_STRING, OT_LINE, OT_WORD, OT_CHAR, OT_FIELD,
OT_CHUNK, OT_SAYALL, OT_SPELL, OT_PHONEMIC, OT_APP_NAME, OT_DIALOG_NAME,
OT_CONTROL_NAME, OT_MDI_NAME, OT_WINDOW_NAME, OT_GRAPHIC, OT_HELP,
OT_STATUS, OT_SELECTED, OT_TEXT, OT_POSITION, OT_STATIC, OT_FONT,
OT_KEYBOARD, OT_CURSOR, OT_DEBUG.\
Include: Required\

### Param 4:

Type: Int\
Description: If true, indicates that the text contains speech markup.
The default is false.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
