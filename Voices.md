# Voices Functions

A Voices script or function provides or returns information about Voices
activities caused by user interaction or automatically updated by an
event. JAWS uses this information to determine whether or how to speak
with the currently loaded synthesizer, or perhaps whether to change to a
different available synthesizer. JAWS may also utilize information
returned by a Voices function for comparison purposes, etc.

Voices information may be about the context voice - the PC cursor voice,
the JAWS message voice, and so on. It may be about the speech rate,
pitch, synthesizer person, spell decrement or increment pitch, even the
language of the synthesizer in use.

Some scripts that ship with JAWS fall into the category of Voices, such
as the scripts for changing the voice rate permanently to a slower or
faster rate or the script for SelectAVoiceProfile, for example. However,
the focus of the present discussion is on functions related to Voices
that you may call from your own scripts or that you may overwrite from
those in default.jss or from the built-in functions.

Some examples of Voices functions include:

- ChangeVoiceSetting
- GetActiveSynthLanguage
- ResetVoiceSettings
- GetActiveProfileName
- GetActiveSynthInfo

For a complete listing of Voices functions, see the topics in this
category book of the Reference Guide.

## Code Sample

In the below code sample, the script provides information on demand
about the currently loaded voice profile. The information is displayed
in a Virtual Viewer window for you to read as you prefer. Try running
the script after selecting different voice profiles with different
installed voice synthesizers such as the default Eloquence synthesizer
or some of the Vocalizer synthesizers available for installation from
the Freedom Scientific website.

It is assumed that the script and its related function are being
processed in the Notepad.jss script source file and compiled in the
Notepad.jsb script binary file.

    Messages
    ; For sMsgVoiceInfo, the various replaceable parameters are obvious from their context in the message.
    @sMsgVoiceInfo
    For Synthesizer %1, the global voice is set to the person called %2.
    %2's voluume is %3%, rate is %4, pitch is %5, and punctuation level is %6.
    %2's language is %7 and the default voice profile for %2 is %8.
    But the %1 synthesizer can also read in the following installed languages:
    %9.
    @@
    EndMessages

    String Function GetPunctuationName (Int iPuncLevel)
    If iPuncLevel == 0
        Return cmsgPunctuationNone
    ElIf iPuncLevel == 1
        Return cmsg278_l ; Some
    ElIf iPuncLevel == 2
        Return cmsg279_l ; Most
    ElIf iPuncLevel == 3
        Return cmsg280_l ; All
    EndIf
    EndFunction

    Script MySynthInfoTest ()
    Var
        String sShortName,
        String sLongName,
        String sDriver,
        String sLanguage,
        Int iVolume,
        Int iRate,
        Int iPitch,
        Int iPuncLevel,
        String sPunctuation,
        String sPerson,
        String sLanguages,
        String sDefaultProfileName,
        String sText ; needed to format the string from all the replaceable parameters in sMsgVoiceInfo

    If ! GetActiveSynthInfo (sShortName, sLongName, sDriver)
        Return
    EndIf

    sLanguage = GetActiveSynthLanguage ()
    sDefaultProfileName = GetDefaultProfileName ()
    ; The following call obtains information by reference
    ; for the context voice passed to the function in the first parameter.
    GetVoiceParameters (vctx_global,iVolume, iRate, iPitch, iPuncLevel, sPerson)
    ; Convert punctuation integer into user-friendly name.
    sPunctuation = GetPunctuationName (iPuncLevel)
    ; Get list of installed languages.
    sLanguages = GetSynthLanguages (cscBufferNewLine) ; Parse the language list so each one is on a separate line.
    sText = FormatString (sMsgVoiceInfo,
        sLongName,
        sPerson,
        IntToString (iVolume),
        IntToString (iRate),
        IntToString (iPitch),
        sPunctuation,
        sLanguage,
        sDefaultProfileName,
        sLanguages)

    EnsureNoUserBufferActive ()
    UserBufferAddFormattedMessage (sText, sText)
    UserBufferAddText (cscBufferNewLine + cmsgBuffExit)
    UserBufferActivate ()
    JAWSTopOfFile ()
    SayAll ()
    EndScript

## Additional Resources

For more details on working with the virtual viewer, see the summary in
the General Scripting Concepts book called [Implementing a Virtual
Viewer Window.](../Virtual_Viewer_Functions.html)
