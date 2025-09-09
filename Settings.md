# Settings Functions

A Settings function provides or returns information about script
activities caused by user interaction or automatically updated by an
event. JAWS uses this information to determine whether to speak and
display information in Braille, for comparison purposes, and so on.

Many scripts that ship with JAWS fall into the category of Settings,
such as the script for Dictionary Manager, for example. However, the
focus of the present discussion is on functions related to Settings that
you may call from your own scripts or that you may overwrite from those
in default.jss or from the built-in functions.

Incidentally, functions for Braille Settings merit their own summary in
the Reference Guide. So functions in the Settings summary of the
Reference Guide refer to all settings other than those specific to
Braille displays or the Braille Viewer.

Some examples of Settings functions include:

- GetActiveSynthGlobalSectionName
- GetSettingInformation

For a complete listing of Settings functions, see the topics in this
category book of the Reference Guide.

## Code Sample

In the below code sample, the script determines the pitch range for the
JAWS cursor context voice of the currently loaded synthesizer. JAWS
speaks the information in a message and flashes it in Braille. This
script could be extended to set or change the pitch of the voice with
other functions, for example, if you want to change voice settings on
the fly without utilizing the JAWS user interface.

It is assumed that the script is being processed in the Notepad.jss
script source file and compiled in the Notepad.jsb script binary file.

    Script MySettingsInfoTest ()
    Var
        Int MinSetting,
        Int MaxSetting,
        String sRange

    ;For sRange,
    ;%1 is the context voice, %2 is the minimum setting returned by reference from the function call,
    ;and %3 is the maximum setting returned by reference from the function call.
    sRange = "The minimum pitch of the %1 is %2, and the maximum pitch is %3."

    GetSettingInformation (V_PITCH, VCTX_JAWSCURSOR, MinSetting, MaxSetting)
    SayFormattedMessage (ot_user_requested_information,
        FormatString (sRange, vctx_JAWSCURSOR, MinSetting, MaxSetting))
    EndScript
