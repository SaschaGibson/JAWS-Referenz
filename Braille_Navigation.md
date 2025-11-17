# Braille Navigation Functions

A Braille Navigation function provides or returns information about
script activities caused by user interaction or automatically updated by
an event. JAWS uses this information to determine whether to display
information in Braille, for comparison purposes, and so on.

Many scripts that ship with JAWS fall into the category of Braille
Navigation, such as the script for BrailleAutoAdvance, for example.
However, the focus of the present discussion is on functions related to
Braille Navigation that you may call from your own scripts or that you
may overwrite from those in default.jss or from the built-in functions.

Incidentally, functions for navigation other than those specifically for
Braille merit their own category book and summary in the Reference
Guide. So functions in the Braille Navigation category book of the
Reference Guide refer only to navigation for Braille displays or for the
Braille Viewer.

Some examples of Braille Navigation functions include:

- BrailleAutoAdvanceMode
- BrailleNextLine
- BraillePriorLine
- BrailleRoutingButton

Take time to examine some of the functions in the Braille.jss script
source file that ships with JAWS to see how these functions work to
maximize the real estate of a Braille display while displaying as much
meaningful component information as possible.

For a complete listing of Braille Navigation functions, see the topics
in this category book of the Reference Guide.

## Code Sample

In the below code sample, the BrailleRouting script is overwritten in
the Notepad.jss script source file from the function in default.jss. The
overwritten script performs the default action; but if the routing key
is pressed twice quickly, JAWS flashes a message to indicate the number
of the routing button that was pressed.

It is assumed that the script is being processed in the Notepad.jss
script source file and compiled in the Notepad.jsb script binary file.

    Script BrailleRouting ()
    PerformScript BrailleRouting ()
    If IsSameScript () >= 1 ; The routing key was pressed twice quickly.
        BrailleMessage (IntToString (GetLastBrailleRoutingKey ()))
    EndIf
    EndScript
