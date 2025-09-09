# Function: SelectionContextChangedEvent

## Description

This event function is triggered when any of the enabled selection
context data flags changes as one navigates in supported applications.
Where extra contextual information is required to report the change in
context, relevant flags and strings are filled in with data. For
example, navigating into a formfield, nData1 will be the type(see
WT_CONSTANTS), nData2 will be the state, sDesc1 the prompt, sDesc2 the
value, sDesc3 the positional information and sDesc4 the extra help
information if available. For comments, sDesc1 is the author\'s name,
sDesc2 the initials, sDesc3 the text of the actual comment. For
footnotes or endnotes, sDesc1 is the reference id and sDesc2 the text of
the note. For bookmarks and smart tags, sDesc1 is the name of the item.
For revisions, nData1 is the type of revision, sDesc1 the author, sDesc2
the initials and sDesc3 the text. For shapes or objects, nData1 is a
type specifier, nData2 a builtin shape type, sDesc1 the name of the
object, sDesc2 the text, and sDesc3 the dimentions. The units of measure
used for the dimentions are in the current desired units of measure as
defined by the smmSetDesiredUnitsOfMeasure function. For
selCtxPageSectionColumnBreaks, nData1=column number, nData2=number of
text columns sDesc1=page n, sDesc2=sectiony , sDesc3=z text columns
(text column count) sDesc4= column j (where j is the number of the text
column) For other contextual information such as spelling and grammar,
the relevant bit of the context flags will be set in the new and cleared
in the old to indicate moving into an error, or vice versa when exiting.
Table info should be gathered from the table specific events. See
hjconsnt.jsh for the selCtx constant bit values.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: int\
Description:\
Include: Required\

### Param 2:

Type: int\
Description:\
Include: Required\

### Param 3:

Type: int\
Description:\
Include: Required\

### Param 4:

Type: int\
Description:\
Include: Required\

### Param 5:

Type: string\
Description:\
Include: Required\

### Param 6:

Type: string\
Description:\
Include: Required\

### Param 7:

Type: string\
Description:\
Include: Required\

### Param 8:

Type: string\
Description:\
Include: Required\

### Param 9:

Type: string\
Description:\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 9.0 and later
