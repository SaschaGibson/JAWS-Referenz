# Function: SetSynth

## Description

Causes JFW to switch to the specified synthesizer.

## Returns

Type: Int\
Description: TRUE if change was successful, FALSE otherwise.\

## Parameters

### Param 1:

Type: String\
Description: The short name of the synthesizer found in JFW.INI. This
name must be in quotes. For example, you can find the short name for
Eloquence by looking in JFW.INI for the entry \"Synth1Name=eloq.\" You
would then use the line SetSynth(\"eloq\") in your script or function.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
