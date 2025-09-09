# Function: UserBufferAddTextWithHTML

## Description

Add text with legal HTML links where the href attribute points to a
source to run via the default application. This is not a full HTML
document, you must continue to use the standard font / point size /
colors codes from Windows / JAWS rather than HTML, but provides a way to
run external links not done via runtime macros. The HTML a tag must be
done legally, e.g. [a name](something) to properly run. Bad HTML gets
ignored

## Returns

Type: Void\

## Parameters

### Param 1:

Type: String\
Description: The text to be added to the buffer. This text may
optionally contain HTML hyperlinks and need not be small chunks. While
the links are added in as link on their own lines, all remaining newline
characters and white space are as you have them.\
Include: Required\

### Param 2:

Type: int\
Description: TRUE to add a line break at the end of the text. This would
result in two if your text ends with one.\
Include: Optional\

### Param 3:

Type: String\
Description: the name of the font used for ins+f when located in this
text.\
Include: Optional\

### Param 4:

Type: Int\
Description: the point size of the font used for ins+f when located in
this text.\
Include: Optional\

### Param 5:

Type: Int\
Description: the attribute flags used for ins+f when located in this
text for.\
Include: Optional\

### Param 6:

Type: Int\
Description: the text colour.\
Include: Optional\

### Param 7:

Type: Int\
Description: the background color.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 11.00 and later
