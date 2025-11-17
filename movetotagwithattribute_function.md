# Function: MoveToTagWithAttribute

## Description

This function Moves the cursor to the next, prior, first or last
instance of the specified element with the specified attribute. It is
primarily useful in HTML documents. For example, it maybe used to move
to instances of an element with an onclick or onmouseover handler.

## Returns

Type: Int\
Description: true or false.\

## Parameters

### Param 1:

Type: Int\
Description: one of S_TOP, S_BOTTOM, S_NEXT or S_PRIOR as defined in
hjconst.jsh\
Include: Required\

### Param 2:

Type: String\
Description: the HTML or other textual tag to locate (maybe empty).\
Include: Required\

### Param 3:

Type: string\
Description: the attribute which must be present in the element, eg
\"onclick\".\
Include: Required\

### Param 4:

Type: int\
Description: TRUE to find nested instances, FALSE to disallow nested
instances.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 8.00 and later
