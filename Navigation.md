# Navigation Functions

A Navigation function provides or returns information about script
activities caused by user interaction or automatically updated by an
event. JAWS uses this information to determine whether to speak and
display information in Braille, for comparison purposes, and so on.

Many scripts that ship with JAWS fall into the category of Navigation,
such as the script for TopOfFile, for example. However, the focus of the
present discussion is on functions related to Navigation that you may
call from your own scripts or that you may overwrite from those in
default.jss or from the built-in functions.

Incidentally, functions for Braille navigation merit their own category
book in the Reference Guide. So functions in the Navigation category
book of the Reference Guide refer only to navigation that may affect
both speech and Braille or even perhaps mouse movements.

Some examples of Navigation functions include:

- JAWSTopOfFile
- JAWSBottomOfFile
- NextCharacter
- PriorCharacter

For a complete listing of Navigation functions, see the topics in this
category book of the Reference Guide.

## Code Sample

In the below code sample, the NextCharacter and PriorCharacter functions
are overwritten in the Notepad.jss script source file from the built-in
functions. The overwritten functions speak the character under the
cursor phonetically and perform their default actions.

To set up the example, simply type some text in the Notepad document
window, and then start moving by character around the text.

It is assumed that the functions are being processed in the Notepad.jss
script source file and compiled in the Notepad.jsb script binary file.

    Void Function SayPhoneticCharInDoc ()
    Var
        String sChar

    If GetObjectSubtypeCode () == wt_multiline_edit
        sChar = GetCharacter ()
        If sChar != cscSpace
            Say (sChar, ot_phonetic_char)
        EndIf
    EndIf
    EndFunction

    Void Function NextCharacter ()
    NextCharacter ()
    SayPhoneticCharInDoc ()
    EndFunction

    Void Function PriorCharacter ()
    PriorCharacter ()
    SayPhoneticCharInDoc ()
    EndFunction
