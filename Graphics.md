# Graphics Functions

A Graphics function provides or returns information about script
activities caused by user interaction or automatically updated by an
event. JAWS uses this information to determine whether to speak and
display information in Braille, for comparison purposes, and so on.

Some scripts that ship with JAWS fall into the category of Graphics,
such as the script for AutoLabelGraphics, for example. However, the
focus of the present discussion is on functions related to Graphics that
you may call from your own scripts or that you may overwrite from those
in default.jss or from the built-in functions.

Some examples of Graphics functions include:

- FindGraphic
- GetGraphicID
- GraphicsEnumerate
- GraphicsLabeler

For a complete listing of Graphics functions, see the topics in this
category book of the Reference Guide.

## Code Sample

In the below code sample, created in the Windows OS.jss script source
file, the script determines where the next graphic is located on screen
and moves to that location, speaking it and placing the Braille cursor
at the location.

To set up the example, from the Desktop, use the JAWS Quick Settings
user interface to ensure that the setting for Graphics is set to All.
Then run the script from the Desktop at various places or starting from
the very top of the screen.

Take care when working with the Windows OS.jss script source file
because it already contains scripts and functions by default that ship
with JAWS. Place your sample code at the very bottom of the file. And
make sure to remove this overwritten Windows OS.jss and its associated
overwritten Windows OS.jsb and Windows OS.jkm files from your user
Settings\\(language) folder when done testing. It is assumed that the
script is being processed from the Windows OS.jss script source file and
compiled in its associated Windows OS.jsb script binary file.

    Script MyGraphicTest ()
    ; Search unrestricted.
    If MoveToGraphic (s_next,FALSE) ; Move succeeded.
        ;Since the graphic moved to activates the JAWS cursor:
        RoutePCToJAWS ()
        PCCursor ()
    EndIf
    EndScript

## Additional Resources

For more details on working with Graphics files, see the topic under
Settings and Configurations in the General Scripting Concepts book
called [Script File
Types.](../Settings_And_Configurations/ScriptFileTypes.html)

For more details on working with functions that enumerate information,
see the topic under Calling Scripts and Functions in the General
Scripting Concepts book called [Enumerator
Functions.](../Calling_Scripts_and_Functions/Enumerator_Functions.html)
