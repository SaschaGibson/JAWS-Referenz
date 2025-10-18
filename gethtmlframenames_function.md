# Function: GetHTMLFrameNames

## Description

This function returns a delimited list of visible frames currently
rendered in the VPC buffer. Specify the delimiter for the list using the
optional string parameter. This is used to ensure that the list of
frames presented by the ins+f9 keystroke is consistent with what is in
the VPC bbuffer. Note that this function is not used if the VPC cursor
is not active.

## Returns

Type: String\
Description: the delimited list of frame names.\

## Parameters

### Param 1:

Type: String\
Description: The delimiter to use to separate the frame names.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
