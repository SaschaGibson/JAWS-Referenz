# Function: SetTypingEchoLanguage

## Description

This function allows the user to change the language JAWS uses for
typing echo. If a valid language abbreviation is supplied, that language
will be used (if supported by the Synthesiser in use) otherwise the
global language will be used. Note this is only available in JAWS 5.0
International (v 5.00.709 or higher).

## Returns

Type: int\
Description: True if we were able to switch the typing echo language,
FALSE otherwise.\

## Parameters

### Param 1:

Type: string\
Description: any language code for which a language alias is defined for
the current synth or a language string understood by the current synth.
Note this function only supports aliases which map to an actual language
switch (rather than a voice switch).\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 5.00 and later
