# Function: SpeechOff

## Description

Causes the synthesizer to be muted. This is particularly useful when you
need to free the synthesizer so that a wave file can be played. You can
reverse this action with SpeechOn

## Returns

Type: Void\

## Parameters

### Param 1:

Type: int\
Description: True if speech is to be turned off and stay off until
specifically turned back on with the SpeechOn(True) method, false
otherwise. Setting this parameter to true will allow speech to remain
off even if an application switches voice profiles. Note that true will
cause SpeechOff to respond more slowly since the synthesizer is
unloaded, so if you are temporarily turning speech off then back on
again in a script process then do not set this parameter to True. This
optional parameter is available as of JAWS 11 update 1.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
