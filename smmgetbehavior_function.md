# Function: smmGetBehavior

## Description

This function allows the scripter to obtain a scheme behavior.

## Returns

Type: int\
Description: the behavior for the given table and key.\

## Parameters

### Param 1:

Type: string\
Description: the category of behaviors you wish too query. This is taken
from the section name in the SMF file (minus the \"Behavior table\"
suffix), for example, if you wish to query an Attribute behavior, the
value of this parameter should be set to \"Attribute\".\
Include: Required\

### Param 2:

Type: string\
Description: the key from the behavior table you wish to query.\
Include: Required\

### Param 3:

Type: string\
Description: the data for the behavior. This piece of data will
correspond to data1 through data4 for that given table and key, see the
smf files for more detail. for example, if the behavior is speak item
then the data will contain the optional text and voice alias used to
speak the item. If the behavior is to change language then the data will
contain the language alias etc.\
Include: Required\
\* Returns data by reference\

### Param 4:

Type: string\
Description: the second set of data for the behavior. For example, if
you are retrieving data for the behavior speak and play sound, the
behavior may contain both overriding text for the speak behavior and a
sound file for the sound behavior. When the bahavior is set to speak and
play sound sData will contain the overriding text stored in data1 and
sData2 will contain the sound file stored in data2.\
Include: Optional\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 5.10 and later
