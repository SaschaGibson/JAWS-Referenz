# Braille Device Functions

A Braille Device function provides or returns information about the
currently connected and active Braille display. JAWS uses this
information to determine whether to display information in Braille, for
comparison purposes, and so on.

Some examples of Braille Device functions include:

- BrailleInUse
- BrailleGetCellCount
- BrailleGetStatusCellCount

Take time to examine some of the functions in the Braille.jss script
source file that ships with JAWS to see how these functions work to
maximize the real estate of a Braille display while displaying as much
meaningful component information as possible.

For a complete listing of Braille Device functions, see the topics in
this category book of the Reference Guide.

## Code Sample

In the below code sample, the script calls two functions to get the
number of regular cells and status cells (if any). If a Braille display
is attached and active, JAWS speaks and flashes the information in
Braille. Otherwise, JAWS speaks and flashes an error message.

It is assumed that the function is being processed in the Notepad.jss
script source file and compiled in the Notepad.jsb script binary file.

    Script MyBrailleCellsTest ()
    Var
        String sMsgMyCells,
        String sMsgNoDevice

    sMsgNoDevice = "I' can't find a Braille display."

    If ! BrailleInUse ()
        SayMessage (ot_error, sMsgNoDevice)
        Return
    EndIf

    ; For sMsgMyCells, %1 is the number of cells, and %2 the number of status cells, if any.
    sMsgMyCells = "I have %1 cells and %2 status cells."
    SayFormattedMessage (ot_user_requested_information,
        FormatString (sMsgMyCells, IntToString (BrailleGetCellCount ()), IntToString (BrailleGetStatusCellCount ())))
    EndScript
