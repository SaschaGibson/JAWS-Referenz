# Text Format Functions

A Text Format script or function provides or returns information about
Text Format activities caused by user interaction or automatically
updated by an event. JAWS uses this information to determine whether to
speak and display Text Format information in Braille, for comparison
purposes, and so on.

Text Format information may be about the font name, point size, or
attributes of a character, about the attributes of a control, whether
the text is intended to be read right to left instead of left to right,
etc.

Some scripts that ship with JAWS fall into the category of Text Format,
such as the script for SayFont, for example. However, the focus of the
present discussion is on functions related to Text Format that you may
call from your own scripts or that you may overwrite from those in
default.jss or from the built-in functions.

Some examples of Text Format functions include:

- AttributesChanged
- IntToAttribName
- AttributeEnumerate
- GetCharacterAttributes
- IsRtlChar

For a complete listing of Text Format functions, see the topics in this
category book of the Reference Guide.

## Code Sample

In the below code sample, the script finds the first character in the
text that is bolded.

To set up the example, simply type some text into the Wordpad document
window. Using the Font options in the Home ribbon, change some text, not
at the very top of the file, to be in bold. Then move to the top of the
file and run the script. If bold text is found, the JAWS cursor moves to
it, and the PC cursor is routed to the position and reactivated. Then
the script confirms the font and speaks the current line where the bold
text begins.

Take care when working with the Wordpad.jss script source file because
it already contains scripts and functions by default that ship with
JAWS. Place your sample code at the very bottom of the file. And make
sure to remove this overwritten Wordpad.jss and its associated
overwritten Wordpad.jsb and Wordpad.jkm files from your user
Settings\\(language) folder when done testing. It is assumed that the
script is being processed in the Wordpad.jss script source file and
compiled in the Wordpad.jsb script binary file.

    Script MyAttributesTest ()
    Var
        Int attributes

    If GetWindowClass (GetFocus ()) == cwc_RichEdit50W
    && ! DialogActive () ; This is the Wordpad document window.
        If FindFirstAttribute (attrib_bold,TRUE) ; Restrict the search to the document window.
            RoutePCToJAWS ()
            PCCursor ()
            SayFont ()
            SayLine()
        EndIf
    EndIf
    EndScript
