# Function: GetRichEditDocument

## Description

Gets a pointer to the ITextDocument interface of the document in the
specified window. This only works for windows of class RichEdit20A or
RichEdit20W. The ITextDocument Interface allows access to the object
model of RichEdit documents in a similar manner to the MSWord object
model. For more details, search Microsoft Developer Network for \"Text
Object Model.\"

## Returns

Type: Object\
Description: A pointer to the ITextDocument interface.\

## Parameters

### Param 1:

Type: Handle\
Description: The handle to the window of interest. It defaults to the
window with focus.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
