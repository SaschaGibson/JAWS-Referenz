# Colors Functions

A Colors function provides or returns information about script
activities caused by user interaction or automatically updated by an
event. JAWS uses this information to determine whether to speak and
display information in Braille, for comparison purposes, and so on.

Some scripts that ship with JAWS fall into the category of Color, such
as the script for SayColor, for example. However, the focus of the
present discussion is on functions related to Colors that you may call
from your own scripts or that you may overwrite from those in
default.jss or from the built-in functions.

Some examples of Colors functions include:

- AddBrailleColors
- ColorToRGBString
- FindColors

For a complete listing of Colors functions, see the topics in this
category book of the Reference Guide.

## Code Sample

In the below code sample, the script determines the color at any point
within the document window of a Wordpad document. Although the SayColor
script can perform this with the default key assignment,
**JAWSKey+NumberRow5**, the code sample script speaks and flashes a
sentence about the foreground and background colors of the text at the
current cursor position.

Take care when working with the Wordpad.jss script source file because
it already contains scripts and functions by default that ship with
JAWS. Place your sample code at the very bottom of the file. And make
sure to remove this overwritten Wordpad.jss and its associated
overwritten Wordpad.jsb and Wordpad.jkm files from your user
Settings\\(language) folder when done testing. It is assumed that the
script is being processed in the Wordpad.jss script source file and
compiled in the Wordpad.jsb script binary file.

To set up the example, from the Wordpad document window, type several
lines of text. Then select some of the text, and using the font option
for color in the Home ribbon, change the foreground color of some of the
text to say, yellow, as in the code sample. Finally, position the PC
cursor anywhere within the text whose color has been changed, or the
text whose color has not been changed, and run the script.

WARNING! The code sample in the below script looks specifically for the
color yellow with the hex value of 0xffff00, reported as the RGB string,
\"255255000\". You can get the RGB string of the foreground and
background colors by pressing **Insert+NumberRow5** twice quickly on the
text in the Wordpad document. If the foreground color of that text is
not reported as having that exact RGB string, the yellow color will not
be found. This code sample is meant only to illustrate how to apply some
of the functions that work with colors. You may need to experiment a bit
for your own specific situation.

    Script MyColorTest ()
    Var
        Int iColor, ; the integer value of the color
        String sMsgColorInfo,

        String sMsgColorNotFound
    iColor = 0xFFFF00 ; Yellow in Hex from Colors.ini file.
    ; For sMsgColorInfo, %1 is the text color, %2 the background color.
    sMsgColorInfo = "This text is %1 on %2."
    ; For sMsgColorNotFound, %1 is the color we are trying to find.
    sMsgColorNotFound = "I can't find any more %1 text in this document."

    ; Find yellow text regardless of background color,
    ; searching from the current PC cursor position forward
    ; but only within the document window.
    If FindColors (iColor, IgnoreColor, s_next, TRUE)
        SayFormattedMessage (ot_User_requested_information,
            FormatString (sMsgColorInfo, GetColorName (GetColorText ()), GetColorName (GetColorBackground () )))
        RoutePCToJAWS () ; Bring the PC cursor to the text found.
        BrailleRefresh ()       PCCursor () ; reactivate thePC cursor at the location where the text is found.
        SayLine ()
    Else
        SayFormattedMessage (ot_Error,
            FormatString (sMsgColorNotFound, GetColorName (iColor)))
    EndIf
    EndScript
