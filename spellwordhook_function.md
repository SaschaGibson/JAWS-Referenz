# Function: SpellWordHook

## Description

SayWord sets this hook when it is called twice quickly. The hook is in
effect until a script other than SayNextWord or SayPriorWord is called.
When SayNextWord or SayPriorWord is called, SpellWordHook runs its
special code and aborts the call, otherwise, it unhooks itself and
passes on the call.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: String\
Description: Name of the script that is being intercepted.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
