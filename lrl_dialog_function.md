# Function: LRL_Dialog

## Description

LRL_Dialog Displays the Research It dialog.

## Returns

Type: int\
Description: TRUE if the dialog is okayed; otherwise FALSE.\

## Parameters

### Param 1:

Type: String\
Description: On okaying the dialog, strModuleName will be updated with
the selected Research It module.\
Include: Required\
\* Returns data by reference\

### Param 2:

Type: String\
Description: On okaying the dialog, strRuleSet will be updated with the
selected Research It rule set if one applies.\
Include: Required\
\* Returns data by reference\

### Param 3:

Type: String\
Description: strPhrase is an IN/OUT parameter. When the dialog is
displayed, the Word Or Phrase combo edit field is updated with the
contents of this field. When the dialog is okayed, the strPhrase is
updated with the contents of the combo edit.\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 11.0 and later
