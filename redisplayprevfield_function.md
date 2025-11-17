# Function: RedisplayPrevField

## Description

Scripts can override this function to redisplay a virtual buffer that
was active prior to the display of a help buffer. This function is
called if a user buffer is active and its associated window name
(returned by UserBufferWindowName) is null. It is called from
CloseButton after the current user buffer has been deactivated and
immediately before UpALevel exits. If it does not wish to redisplay a
field it should call the default version of RedisplayPrevField before
returning.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: String\
Description: The value of UserBufferPrevWindowName() prior to the call
to UserBufferDeactivate().\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 6.10 and later
