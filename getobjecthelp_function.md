This function is available in the following releases:

1.  [JAWS 4.51-19.0](#_JAWS4.51-19.0)
2.  [JAWS 20.0 and later](#_JAWS20.0andlater)

# []{#_JAWS4.51-19.0} Function: GetObjectHelp

## Description

This function returns the AccDescription property of an MSAA object if
it has one.

## Returns

Type: String\
Description: AccDescription property of accessible object.\

## Parameters

No Parameters

## Version

This function is available in the following releases:

1.  JAWS 4.51-19.0

# []{#_JAWS20.0andlater} Function: GetObjectHelp

## Description

This function returns the AccDescription property of an MSAA object if
it has one.

## Returns

Type: String\
Description: AccDescription property of accessible object.\

## Parameters

### Param 1:

Type: Int\
Description: if TRUE, always obtains this information via MSAA, even in
those situations where other methods would otherwise be used instead.\
Include: Optional\

### Param 2:

Type: int\
Description: Which object in the hierarchy should be spoken. 0, which is
the default, refers to the object with focus. 1 refers to the parent of
the focus object, 2 refers to the grandparent, etc.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 20.0 and later
