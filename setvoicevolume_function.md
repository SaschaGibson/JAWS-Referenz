This function is available in the following releases:

1.  [JAWS 4.51-21.0](#_JAWS4.51-21.0)
2.  [JAWS 22 and later](#_JAWS22andlater)

# []{#_JAWS4.51-21.0} Function: SetVoiceVolume

## Description

Sets the volume of the voice you specify to the amount passed to the
second parameter.

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
Description: The new value to which you wish to set the volume.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51-21.0

# []{#_JAWS22andlater} Function: SetVoiceVolume

## Description

Sets the volume of the voice you specify to the amount passed to the
second parameter.

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
Description: The new value to which you wish to set the volume.\
Include: Required\

### Param 3:

Type: int\
Description: Use true if the speech rate change should be permanent,
false if it should be temporary. Default value is false.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 22 and later
