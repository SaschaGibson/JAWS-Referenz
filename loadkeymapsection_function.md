# Function: LoadKeymapSection

## Description

Loads a key map section from the key map file. The key map remains
loaded until it is unloaded by calling UnloadKeymapSection, or until the
configuration changes\--whichever happens first.

## Returns

Type: void\

## Parameters

### Param 1:

Type: string\
Description: The name of the key map section to load. The name must
match a section in the JKM file, excluding the trailing portion of the
section name that specifies the section as a key map. For example,
\"Custom\" specifies the key map section called \"\[Custom Keys\]\" in
the JKM file.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 15.0 and later
