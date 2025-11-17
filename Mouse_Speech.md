# Mouse Speech Functions

A Mouse Speech function provides or returns information about mouse
activities. JAWS uses this information to determine whether to speak and
display anything in Braille, for comparison purposes, and so on.

Some examples of Mouse Speech functions include:

- ClearMouseSpeechRect
- FilterMouseSpeech
- GetMouseSpeechMode

For a complete listing of Mouse Speech functions, see the topics in this
category book of the Reference Guide.

## Code Sample

In the below code sample, the GetMouseSpeechMode function is called from
a script to determine whether the user has set MAGic to speak by word or
chunk when a mouse action takes place and mouse speech is enabled.

    Script MyMouseSpeechTest ()
    Var
        Int iMouseSpeechEnabled,
        Int iSpeechMode,
        String sMsgMouseSpeech,
        String sMsgNoMouseSpeech,
        String sWord,
        String sChunk,
        String sMode

    sWord = "word"
    sChunk = "chunk or line"

    iMouseSpeechEnabled = GetJcFOption (OPT_MOUSE_SPEECH_ENABLED)
    iSpeechMode = GetMouseSpeechMode () ; word or chunk
    sMsgMouseSpeech = "Mouse speech is enabled and is set to %1."
    sMsgNoMouseSpeech = "Mouse speech is disabled, but it is set to %1."
    ; Test for whether mouse speech is set to word or chunk.
    If iSpeechMode == IT_CHUNK_COLOR_NA
        sMode = sChunk
    Else
        sMode = sWord
    EndIf
    If iMouseSpeechEnabled
        SayFormattedMessage (ot_status, FormatString (sMsgMouseSpeech, sMode))
    Else
        SayFormattedMessage (ot_status, FormatString (sMsgNoMouseSpeech, sMode))
    EndIf
    EndScript
