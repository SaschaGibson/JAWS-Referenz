# Speech Markup Functions

A Speech Markup function provides or returns information about Speech
Markup activities caused by user interaction. JAWS uses this information
to determine how and what to speak, for comparison purposes, and so on.

Some scripts that ship with JAWS fall into the category of Speech
Markup, such as the script for SelectAScheme, for example. However, the
focus of the present discussion is on functions related to Speech Markup
that you may call from your own scripts or that you may overwrite from
those in default.jss or from the built-in functions.

Some examples of Speech Markup functions include:

- GetCurrentSchemeName
- GetCurrentSayAllScheme
- IndicateControlState
- IndicateControlType.
- smmGetBehavior

For a complete listing of Speech Markup functions, see the topics in
this category book of the Reference Guide.

### Special Note:

Numerous Speech Markup functions involve obtaining or setting selection
context bit flags. When active, these bit flags help JAWS determine how
to interpret and process the text of certain types of items.

For example, if the bit flag for spelling error detection is enabled in
Microsoft Word, that information is passed to several built-in functions
to process the speech whenever you move in or out of a spelling error.

The behavior - the manner - in which JAWS processes and speaks certain
types of text also depends on behavior tables. These tables are located
in the .smf Speech Markup files that ship with JAWS. Examine these files
carefully to understand how Speech Markup is processed, and how you may
manipulate .smf files through your own scripts and function calls with
the reading and writing functions in the Freedom Scientific Scripting
Language.)

## Code Sample

In the below code sample, the IndicateControlType function is
overwritten in Notepad to speak information it normally does not speak
for a control in a dialog. To set up the example, from any dialog in
Notepad, press the default key assignment, **JAWSKey+b**, to read the
current dialog in tab order.

It is assumed that the function is being processed in the Notepad.jss
script source file and compiled in the Notepad.jsb script binary file.

    Void Function IndicateControlType (Int iSubtype, Optional String sControlName, Optional String sControlText)
    sControlName = sControlName + cscSpace + "subtype" + IntToString (iSubtype)
    IndicateControlType (iSubtype, sControlName, sControlText)
    EndFunction

## Additional Resources

For more details on working with the many types of files that ship with
JAWS, see the topic under Settings and Configurations in the General
Scripting Concepts book called [Script File
Types.](../Settings_and_Configurations/ScriptFileTypes.html)

For more information about reading from, and writing to, files through
the Scripting language, see the category book in the Reference Guide
called [Files.](../Reference_Guide/Files.html)
