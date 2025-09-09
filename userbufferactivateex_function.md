This function is available in the following releases:

1.  [JAWS 6.10-22.0](#_JAWS6.10-22.0)
2.  [JAWS 23.0 and later](#_JAWS23.0andlater)

# []{#_JAWS6.10-22.0} Function: UserBufferActivateEx

## Description

The User Virtual buffer may be used as a replacement focus for graphical
or other windows where the real focus is not meaningful. the User
Virtual Buffer maybe populated with text. Each piece of text may have an
associated function assigned to it so that when Enter or the Left Mouse
button is presssed in this text, the function will be called. This
function is like UserBufferActivate except that it accepts parameters to
allow a script to identify the user buffer. The passed values are stored
for return by UserBufferWindowName, UserBufferWindowType,
UserBufferWindowTypeCode, and UserBufferWindowControlID. When
UserBufferDeactivate is called these values are copied for return by
UserBufferPrevWindowName, etc.

## Returns

Type: Int\
Description: true if the buffer was activated, false if already active.\

## Parameters

### Param 1:

Type: String\
Description: The name that you want to assign the virtual buffer.\
Include: Required\

### Param 2:

Type: String\
Description: The window type that you want to assign the virtual buffer.
It has to be a string.\
Include: Required\

### Param 3:

Type: Int\
Description: The type code for the Virtual buffer as an Integer.\
Include: Required\

### Param 4:

Type: Int\
Description: The Control Id for the Virtual Buffer as an Integer.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 6.10-22.0

# []{#_JAWS23.0andlater} Function: UserBufferActivateEx

## Description

The User Virtual buffer may be used as a replacement focus for graphical
or other windows where the real focus is not meaningful. the User
Virtual Buffer maybe populated with text. Each piece of text may have an
associated function assigned to it so that when Enter or the Left Mouse
button is presssed in this text, the function will be called. This
function is like UserBufferActivate except that it accepts parameters to
allow a script to identify the user buffer. The passed values are stored
for return by UserBufferWindowName, UserBufferWindowType,
UserBufferWindowTypeCode, and UserBufferWindowControlID. When
UserBufferDeactivate is called these values are copied for return by
UserBufferPrevWindowName, etc.

## Returns

Type: Int\
Description: true if the buffer was activated, false if already active.\

## Parameters

### Param 1:

Type: String\
Description: The name that you want to assign the virtual buffer.\
Include: Required\

### Param 2:

Type: String\
Description: The window type that you want to assign the virtual buffer.
It has to be a string.\
Include: Required\

### Param 3:

Type: Int\
Description: The type code for the Virtual buffer as an Integer.\
Include: Required\

### Param 4:

Type: Int\
Description: The Control Id for the Virtual Buffer as an Integer.\
Include: Required\

### Param 5:

Type: Int\
Description: True if keys should not be trapped, false otherwise.
default is false.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 23.0 and later
