# Function: GetObjectNameUnfiltered

## Description

Unconditionally obtains the name of the object with focus or one of
it\'s ancestors. This is in contrast to GetObjectName which does not
return the names of objects of type wt_unknown. Any Objects with MSAA
role of Window get mapped to the JAWS type of wt_unknown, which means
that it\'s impossible to use GetObjectName to get the names of windows
in the focus hierarchy that don\'t have a more specific type because the
names are returned as empty strings. GetObjectNameUnfiltered does not
have the above limitation and provides this functionality without
breaking legacy behavior.

## Returns

Type: String\
Description: the name of the object in the focus hierarchy.\

## Parameters

### Param 1:

Type: int\
Description: Which object in the hierarchy should be spoken. 0, which is
the default, refers to the object with focus. 1 refers to the parent of
the focus object, 2 refers to the grandparent, etc.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 15.0 and later
