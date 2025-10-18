# Function: GetNativeOMFromMSAA

## Description

This function uses MSAA to get a pointer to the Application\'s native
object model directly. It should be used when other methods fail and
will only work for Office 2000 and above. It is particularly useful when
running under Windows XP in Excel where all other methods fail. This
function should be called when focused on the main work area, ie the
Excel7 class window in Excel, the \_wwg class window in MSWord etc.

## Returns

Type: Object\
Description: a poihnter to the Application Object.\

## Parameters

### Param 1:

Type: int\
Description: The object ID to use when requesting the native OM pointer.
In most cases this is OBJID_NATIVEOM and that\'s what is used if this
parameter isn\'t specified.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
