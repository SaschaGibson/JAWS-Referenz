# Function: SwitchToConfiguration

## Description

When this function is called, the currently loaded set of configuration
files is unloaded from memory and the specified set of configuration
files is loaded in its place.

## Returns

Type: Int\
Description: TRUE if the argument passed in is a valid string (not
\"\"). FALSE if an invalid string is passed into the function.\

## Parameters

### Param 1:

Type: String\
Description: The base name of the set of Configuration files to load.
Calling this function with \"MyConfigurations\" for example, would load
the Configuration, Keymap, Script, Dictionary, Graphics, Symbols, and
Frame files that have base name \"MyConfiguration.\"\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
