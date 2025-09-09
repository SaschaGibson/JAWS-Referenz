# Function: DlgSelectScriptToRun

## Description

Displays a dialog that contains a set of scripts. Scripts can be
performed from this dialog.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: String\
Description: A \"\\007\" delimited set of script names. Aliases can also
be included in this list. Example: ScriptDialog
(VerbosityLevel:Verbosity\\007ScreenEcho). This would create a listbox
containing entries; Verbosity and ScreenEcho.\
Include: Required\

### Param 2:

Type: String\
Description: A string containing the name you want to appear as the
title for the script dialog. If this parameter is \"\", \"Perform
Script\" is used for the title.\
Include: Required\

### Param 3:

Type: Int\
Description: If TRUE, then the contents of the list will be sorted.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
