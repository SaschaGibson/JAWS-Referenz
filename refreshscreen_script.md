This function is available in the following releases:

1.  [JAWS 4.51-18.0](#_JAWS4.51-18.0)
2.  [JAWS 19.0 and later](#_JAWS19.0andlater)

# []{#_JAWS4.51-18.0} Script: RefreshScreen

## Description

Refreshes the screen and updates the state of information of the Off
Screen Model.

## Returns

Type: Void\

## Parameters

No Parameters

## Version

This function is available in the following releases:

1.  JAWS 4.51-18.0

# []{#_JAWS19.0andlater} Script: RefreshScreen

## Description

Refreshes the screen and updates the state of information of the Off
Screen Model. At the same time, this command also checks the Sound
Device being used by JAWS or Fusion and checks to make sure it is not
currently muted or has the sound level set to 0%. If muted, it will be
unmuted. If set to 0%, it will be raised to 50%. Every time JAWS or
Fusion are restarted, this same check is conducted.

## Returns

Type: Void\

## Parameters

No Parameters

## Version

This function is available in the following releases:

1.  JAWS 19.0 and later
