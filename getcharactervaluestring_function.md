# Function: GetCharacterValueString

## Description

This function maybe used with SayCharacter thrice to get an appropriate
string to speak describing the character. For example: Character u+627
or Character 255 plus 248 or Character 1075 etc. Flags maybe used to
specify if the value should be converted to hexedecimal or left as
decimal and whether or not to markup the character value portion of the
string.

## Returns

Type: string\
Description: if the character is successfully converted to a multibyte
sequence using the specified code page then the string will contain
either the hex or decimal values of the characters. If the markup flag
was specified, the actual values will be marked up using the toSpell
text option.\

## Parameters

### Param 1:

Type: string\
Description: if not supplied, the character at the active cursor is
assumed.\
Include: Optional\

### Param 2:

Type: int\
Description: see HJConst.jsh for supported flags (see CVF constants.\
Include: Optional\

### Param 3:

Type: int\
Description: if not specified, the active code page is assumed.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 6.10 and later
