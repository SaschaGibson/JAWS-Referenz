# Function: GetCharacterAttributes

## Description

Retrieves the text attributes of the character at the current cursor
location. The returned value is a combination of the same bit fields
used in FindFirstAttribute, FindNextAttribute, etc. To test for the
presence of a particular attribute, use code of the form: if
(GetAttributes) & ATTRIB_UNDERLINE) then\....

## Returns

Type: Int\
Description: The attributes of the current character.\

## Parameters

No Parameters

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
