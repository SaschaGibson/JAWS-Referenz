# Function: smmGetStartMarkupForFontSize

## Description

If a font size is mapped to a Speech Behavior, this function returns the
start markup for the font size. See the Font Size Behavior Table in
default.jcf. Note that the entries mark the upperbound for the font
size, so, if there are two consequtive entries, one for 10 points and
the next for 20, the first entry means 0 to 10 and the next means 11 to
20.

## Returns

Type: String\
Description: the Speech Markup which will be used to indicate the
beginning of text in this font size.\

## Parameters

### Param 1:

Type: Int\
Description: point size marking upper bound of sizes in this range.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 5.00 and later
