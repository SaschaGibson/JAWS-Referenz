# Function: PlayJCFSoundFile

## Description

Finds the sound file at the specified section and key location, and if
found plays it. Searches first the application JCF file, then the
default JCF file for the section and key.

## Returns

Type: int\
Description: True if the sound file was found, false otherwise.\

## Parameters

### Param 1:

Type: string\
Description: The section name in the JCF file where the key for the
sound file is located.\
Include: Required\

### Param 2:

Type: string\
Description: The name of the key in the JCF file where the sound file is
located.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 13.00 and later
