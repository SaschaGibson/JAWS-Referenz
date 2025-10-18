# Function: smmSetBehavior

## Description

This function allows the scripter to change a scheme behavior on the
fly. the setting is only temporary similar to SetJCFOption however it is
very useful when you need to change the behavior of a scheme
programmatically.

## Returns

Type: int\
Description: true if the behavior was successfully changed, false
otherwise.\

## Parameters

### Param 1:

Type: string\
Description: the category of behaviors you wish too change. this is
taken from the section name in the SMF file (minus the \"Behavior
table\" suffix), for example, if you wish to change an Attribute
behavior, the value of this parameter should be set to \"Attribute\".\
Include: Required\

### Param 2:

Type: string\
Description: the key from the behavior table you wish to modify (or
add).\
Include: Required\

### Param 3:

Type: int\
Description: the new behavior, 0 ignore, 1 speak item, 2 play sound, 3
change voice, 4 change language, or 5 speak and play sound. (See
hjconst.jsh).\
Include: Required\

### Param 4:

Type: string\
Description: the new data for the behavior. For example, if you are
changing the behavior to change language and you wish to specify the new
language, use this parameter to provide the data for the behavior. Note
this data corresponds to data1 through data4 in the SMF file depending
on the behavior you set. If you do not provide the data, the behavior
will inherit the current data from the active scheme.\
Include: Optional\

### Param 5:

Type: string\
Description: a second set of new data for the behavior. For example, if
you are changing the behavior to speak and play sound, you may need to
supply overriding text for the speak behavior and will need to supply a
sound file for the sound behavior. When the bahavior is set to speak and
play sound sData will correspond to data1 and sData2 will correspond to
data2.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 5.10 and later
