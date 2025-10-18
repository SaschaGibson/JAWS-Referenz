# Function: SayField

## Description

This says the field of text where the active cursor is pointing. A field
of text is a section or block of text that has a common attribute such
as bold, underlined, italics, or strikeout. The use of the attribute
must be contiguous. The SayField function uses logic to determine the
text that is to be spoken, while the SayChunk function simply says what
JAWS considers to be a single block of text.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: int\
Description: If true, and the cursor is at the offset just after the
last character of text in the field, jaws speaks the preceding field.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
