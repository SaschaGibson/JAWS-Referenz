# Sounds Functions

A Sounds function processes or returns information about the Sounds
files that ship with JAWS, or your own Sounds files. JAWS uses this
information to determine what Sounds file to play, for comparison
purposes, and so on.

Some examples of Sounds functions include:

- Beep
- PlaySound

For a complete listing of Sounds functions, see the topics in this
category book of the Reference Guide.

## Code Sample

In the below code sample, the script plays a specific Sounds file on
demand from the files that ship with JAWS.

It is assumed that the script is being processed in the Notepad.jss
script source file and compiled in the Notepad.jsb script binary file.

    Script PlayMySound ()
    Var
        String sSoundFile

    sSoundFile = FindJAWSSoundFile ("HarpStringLong.wav")
    If FileExists (sSoundFile)
        PlaySound (sSoundFile)
    EndIf
    EndScript
