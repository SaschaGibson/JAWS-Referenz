# Braille Keyboard Functions

A Braille Keyboard function provides or returns information about script
activities caused by user interaction or automatically updated by an
event. JAWS uses this information to determine whether to display
information in Braille, for comparison purposes, and so on.

Many scripts that ship with JAWS fall into the category of Braille
Keyboard, such as the script for BrailleControlLeftMouseClick, for
example. However, the focus of the present discussion is on functions
related to Braille Keyboard that you may call from your own scripts or
that you may overwrite from those in default.jss or from the built-in
functions.

Incidentally, functions for Keyboard other than those specifically for
Braille merit their own category book and summary in the Reference
Guide. So functions in the Braille Keyboard category book of the
Reference Guide refer only to Braille displays.

Some examples of Braille Keyboard functions include:

- BrailleGetTypeKeysMode
- BrailleSetTypeKeysMode
- ContractedBrailleInputAllowedNow

Take time to examine some of the functions in the Braille.jss script
source file that ships with JAWS to see how these functions work to
maximize the real estate of a Braille display while displaying as much
meaningful component information as possible.

For a complete listing of Braille Keyboard functions, see the topics in
this category book of the Reference Guide.

## Code Sample

In the below code sample, the ContractedBrailleInputAllowedNow function
is overwritten in the Notepad.jss script source file from the function
in default.jss. The overwritten function turns off Contracted Braille
mode if it is enabled, in the Notepad document window.

It is assumed that the script is being processed in the Notepad.jss
script source file and compiled in the Notepad.jsb script binary file.

To set up the example, set the Braille display to allow input and output
from the Braille display. Then just start typing in the Notepad document
window using the Braille display. You are forced to type in Computer
Braille, not in contracted English or Unified English Braille.

    Int Function ContractedBrailleInputAllowedNow ()
    If GetObjectSubtypeCode () == wt_multiline_edit
        Return FALSE ; Allow only Computer Braille to be typed.
    EndIf
    Return ContractedBrailleInputAllowedNow ()
    EndFunction
