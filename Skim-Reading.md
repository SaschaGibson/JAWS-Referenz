# Skim-Reading Functions

A Skim-Reading function provides or returns information about activities
caused by user interaction with the Skim-Reading user interface or
automatically updated by a Skim-Reading event. JAWS uses this
information to determine whether to speak and display information in
Braille, for comparison purposes, and so on.

Some scripts that ship with JAWS fall into the category of Skim-Reading,
such as the script for SkimReadDialog, for example. However, the focus
of the present discussion is on functions related to Skim-Reading
activities that you may call from your own scripts or that you may
overwrite from those in default.jss or from the built-in functions.

Some examples of Skim-Reading functions include:

- SkimReadMatchCallback
- SkimReadMoveToDocLine
- SkimReadMoveToDocOffset
- SkimRead

For a complete listing of Skim-Reading functions, see the topics in this
category book of the Reference Guide.

## Code Sample

In the below code sample, the script calls a Skim Read function to be
performed with specific conditions you set.

To set up the example, simply type a lot of text into a Notepad document
window, or bring up a text file that contains a lot of text. Make sure
that several places in the text refer specifically to JAWS or Vispero
because the script that calls the Skim-Read will be looking for either
of those words to be in some of the sentences.

It is assumed that the script is being processed in the Notepad.jss
script source file and compiled in the Notepad.jsb script binary file.

    Script MySkimReadTest ()
    Var
        String sExpression

    sExpression = "JAWS|Vispero"
    SkimRead (srmTextMatchingRegularExpression, TRUE, sExpression)
    EndScript
