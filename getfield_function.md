# Function: GetField

## Description

Obtains the information in the field where the active cursor is
pointing. A field is a section of information (usually text) that has a
common attribute. Examples are; bold, underlined, italics, or strikeout.
The use of the attribute must be contiguous. GetField is similar to
GetChunk, however, the GetField function uses logic to determine the
text that is to be obtained, while GetChunk simply obtains the text that
was stored in the Off Screen Model as a unit.

## Returns

Type: String\
Description: Provides a field of information.\

## Parameters

### Param 1:

Type: int\
Description: If true, and the cursor is at the offset just after the
last character of text in the field, jaws returns the preceding field.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
