# Function: GetVoiceParameters

## Description

Retrieves the parameters for the voice context you specify. These
include Volume, Rate, Pitch, Punctuation and person.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: String\
Description: The name of the voice context as defined in HjConst.jsh
with the prefix VTX\_.\
Include: Required\

### Param 2:

Type: Int\
Description: Type the variable to receive the voice volume setting.\
Include: Required\
\* Returns data by reference\

### Param 3:

Type: Int\
Description: Type the variable to receive the voice rate setting.\
Include: Required\
\* Returns data by reference\

### Param 4:

Type: Int\
Description: Type the variable to receive the voice pitch setting.\
Include: Required\
\* Returns data by reference\

### Param 5:

Type: Int\
Description: Type the variable to receive the voice punctuation
setting.\
Include: Required\
\* Returns data by reference\

### Param 6:

Type: String\
Description: Type the variable to receive the voice person setting.\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
