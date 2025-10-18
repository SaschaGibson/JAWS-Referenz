# Braille Output Functions

A Braille Output function provides or returns information about script
activities caused by user interaction or automatically updated by an
event. JAWS uses this information to determine whether to display
information in Braille, for comparison purposes, and so on.

Many scripts that ship with JAWS fall into the category of Braille
Output, such as the script for BrailleGrade2ExpandCurrentWord, for
example. However, the focus of the present discussion is on functions
related to Braille output that you may call from your own scripts or
that you may overwrite from those in default.jss or from the built-in
functions.

Some examples of Braille Output functions include:

- BrailleAddObjectName
- BrailleAddFocusLine
- BrailleAddString
- BrailleBuildStatus
- BrailleMessage

Take time to examine some of the functions in the Braille.jss script
source file that ships with JAWS to see how these functions work to
maximize the real estate of a Braille display while displaying as much
meaningful component information as possible.

For a complete listing of Braille Output functions, see the topics in
this category book of the Reference Guide.

## Code Sample

In the below code sample, the BrailleAddObjectType function is
overwritten to display extra information not normally displayed for a
button in a Notepad dialog. The function, along with many other similar
functions, is used by the BrailleCallbackObjectIdentify function to
output the structured Braille components that appear whenever JAWS
should display such information in Braille.

It is assumed that the function is being processed in the Notepad.jss
script source file and compiled in the Notepad.jsb script binary file.

To set up the example, simply activate a dialog in the Notepad
application and **TAB** through the various controls. Notice what
happens on theBraille display when a button control gains focus.

    Int Function BrailleAddObjectType ( Int nSubtype)
    If ! DialogActive () ; A dialog is not active.
    || GetMenuMode () < 0 ; A menu is not active.
        Return BrailleAddObjectType (nSubtype)
    EndIf
    If nSubtype == wt_button
        ; Add the nonsense "hello" highlighted text to the Braille display output
        ; of the control type.
        BrailleAddString ("hello", 0, 0, attrib_highlight)
    EndIf
    ; Ensure that the normal control type information is also displayed.
    Return BrailleAddObjectType (nSubtype)
    EndFunction

## Additional Resources

For more details on working with Structured Braille components, see the
summary in the General Scripting Concepts book called [Structured
Braille Functionality.](../Structured_Braille.html)
