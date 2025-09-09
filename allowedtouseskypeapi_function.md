# Function: AllowedToUseSkypeAPI

## Description

When a program like JAWS first tries to use the Skype API, Skype asks
the user to allow or deny that program access. Once access is allowed it
remains in place until a new build of the program is put in place, at
which time the access check is repeated.

## Returns

Type: int\
Description: 0=Access is allowed,1= access is waiting for user approval,
2=Client has explicitly denied access, 3=API unavailable most likely
because no user is logged in to Skype, 0x8001=Skype not running\

## Parameters

No Parameters

## Version

This function is available in the following releases:

1.  JAWS 11.0 and later
