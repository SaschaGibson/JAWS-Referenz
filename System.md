# System Functions

A System function provides or returns information about activities
caused by user interaction or automatically updated by a system event.
JAWS uses this information to determine whether to speak and display
information in Braille, for comparison purposes, and so on.

Some scripts that ship with JAWS fall into the category of System, such
as the script for ListTaskTrayIcons, for example. However, the focus of
the present discussion is on functions related to System activities that
you may call from your own scripts or that you may overwrite from those
in default.jss or from the built-in functions.

Some examples of System functions include:

- ChangeSystemVolume
- GetBatteryChargeStatus
- GetDayOfWeek
- GetInputLanguage
- GetSystemLocaleInfo

For a complete listing of System functions, see the topics in this
category book of the Reference Guide.

## Code Sample

In the below code sample, the script obtains the system language and
country locale in use, and speaks and flashes the information on demand.

Make sure to add an Include statement for Locale.jsh at the top of the
script source file, along with your typical Include statements. The
Locale.jsh file contains the constant definitions needed for the script
to run properly.

It is assumed that the script is being processed in the Notepad.jss
script source file and compiled in the Notepad.jsb script binary file.

    Script MySystemLanguageTest ()
    Var
        Int iLocaleCType,
        String sLocale

    iLocaleCType = LOCALE_SENGLANGUAGE ;system language name in English
    sLocale = GetSystemLocaleInfo (iLocaleCType)
    iLocaleCType = LOCALE_SENGCOUNTRY ; country name in English
    If sLocale != cscNull
        sLocale = sLocale + cscSpace +GetSystemLocaleInfo (iLocaleCType) ; English language and country names.
    EndIf
    SayMessage (ot_user_requested_information, sLocale)
    EndScript

## Additional Resources

For more details on working with Include statements, see the topic under
Compiler Directives in the General Scripting Concepts book called
[Include Directive.](../Compiler_directive/Include_Directive.html)
