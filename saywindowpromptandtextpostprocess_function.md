# Function: SayWindowPromptAndTextPostProcess

## Description

Used by SayWindowPromptAndText to run the various functions after the
control\'s window prompt and text is spoken.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: handle\
Description: The handle of the window passed from
SayWindowPromptAndText.\
Include: Required\

### Param 2:

Type: int\
Description: The subtype code passed from SayWindowPromptAndText.\
Include: Required\

### Param 3:

Type: int\
Description: The training mode saved and passed from
SayWindowPromptAndText.\
Include: Required\

### Param 4:

Type: int\
Description: ProcessFlags The flag set denoting which optional processes
should run after the window prompt and text is spoken. See HJConst.jsh
for the list of flags.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 12.0 and later
