# Function: SkimReadShouldSpeakText

## Description

This function is only used when skimreading is being controlled
externally by scripts as in MSWord.

## Returns

Type: int\
Description: true or false\

## Parameters

### Param 1:

Type: string\
Description: text of unit to be checked against the current skimreading
parameters. If skimreading is set to srmTextMatchesRegularExpression
then the regular expression will be applied to this text and the
function will return true if it should be spoken, false otherwise. If
the skimreading mode is set to anything other than
srmTextMatchesRegularExpression, the function will return TRUE unless a
skimread is not in progress.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 6.00 and later
