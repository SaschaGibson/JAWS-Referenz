# Scripts Functions

A Scripts function provides or returns information about script
activities caused by user interaction or automatically updated by an
event. JAWS uses this information to determine whether to speak and
display information in Braille, for comparison purposes, and so on.

Many scripts that ship with JAWS fall into the category of Scripts, such
as the script for QuickSettings, for example. However, the focus of the
present discussion is on functions related to scripts that you may call
from your own scripts or that you may overwrite from those in
default.jss or from the built-in functions.

Some examples of Scripts functions include:

- GetCurrentScriptKeyName
- GetScriptAssignedTo
- GetScriptFileName
- GetScriptKeyName
- IsSameScript

For a complete listing of Scripts functions, see the topics in this
category book of the Reference Guide.

## Code Sample

In the below code sample, the script checks to see whether the script
has been called twice quickly by its key assignment. If it has, then
JAWS speaks and flashes in Braille the scripts key name. Otherwise, JAWS
indicates an error message.

It is assumed that the script is being processed in the Notepad.jss
script source file and compiled in the Notepad.jsb script binary file.

    Script MyScriptsTest ()
    Var
        String sMsgError

    sMsgError = "You have not pressed the key twice quickly to get the key name of this script."
    If IsSameScript () >= 1
        SayMessage (ot_User_requested_information, GetScriptKeyName ("MyScriptsTest"))
    Else
        Delay (5)
        SayMessage (ot_error,sMsgError)
    EndIf
    EndScript
