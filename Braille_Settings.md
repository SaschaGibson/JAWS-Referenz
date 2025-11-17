# Braille Settings Functions

A Braille Settings function provides or returns information about script
activities caused by user interaction or automatically updated by an
event. JAWS uses this information to determine whether to display
information in Braille, for comparison purposes, and so on.

Many scripts that ship with JAWS fall into the category of Braille
Settings, such as the script for BrailleGrade2Translation, for example.
However, the focus of the present discussion is on functions related to
Braille settings that you may call from your own scripts or that you may
overwrite from those in default.jss or from the built-in functions.

Incidentally, functions for settings other than those specifically for
Braille merit their own category book and summary in the Reference
Guide. So functions in the Braille Settings category book of the
Reference Guide refer only to settings for Braille displays or for the
Braille Viewer.

Some examples of Braille Settings functions include:

- BrailleVerbosity
- ToggleOutputType

Take time to examine some of the functions in the Braille.jss script
source file that ships with JAWS to see how these functions work to
maximize the real estate of a Braille display while displaying as much
meaningful component information as possible.

For a complete listing of Braille Settings functions, see the topics in
this category book of the Reference Guide.

## Code Sample

In the below code sample, the script determines the current Braille
verbosity for the currently attached display. It flashes the information
in Braille but does not speak it.

It is assumed that the script is being processed in the Notepad.jss
script source file and compiled in the Notepad.jsb script binary file.

    Script TestMyBrailleVerbosityLevel ()
    ; Passing the function call a parameter of TRUE changes the Braille verbosity.
    ; Passing it a parameter of FALSE simply returns the current Braille verbosity level.
    ; Using BrailleMessage to provide the information ensures that it is flashed in Braille and not spoken.
    BrailleMessage (BrailleVerbosity (FALSE)) ;
    EndScript
