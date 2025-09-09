# Scripts Events

A Scripts event function provides information about certain types of
scripts activity. The information may be for a script event within an
application such as Notepad or Microsoft Word, but also for a script
event in more general operating system features like Windows Explorer or
the Start menu. JAWS uses the information from a Scripts event function
to determine what to speak and display. In this case, to display
information refers to showing it in Braille with respect to JAWS.

Some examples of Scripts event functions include:

- Unknown
- UserBufferActivatedEvent
- UserBufferDeactivatedEvent

For a complete listing of functions related to Scripts events, see the
category book in the [Reference Guide.](../Reference_Guide.html)

### Special Note:

The script process does not support recursion. A script or function may
call a version of itself lower down in the script binary file stack, but
not at the same level or at a higher level.

## Code Sample

In the below code sample, the Unknown function is overwritten from the
function in default.jss for Notepad to announce an Unknown function call
made by a nonsense script. It is assumed that the function is processed
from the Notepad.jss script source file and compiled in the Notepad.jsb
script binary file.

Note that a nonsense script calls the function that is not written
anywhere. theUnknown function Scripts event fires from the overwritten
Unknown function to provide information. This is because the function is
an event function. So it does not require that a script and key
assignment be bound to it in order to provide information or suppress
it.

    Messages
    @msgUnknownFunction
    This function is unknown. Check to see if you have misspelled its name or failed to write the function in your script source file where you are calling the function.
    @@
    EndMessages

    Void Function Unknown (String TheName, Int IsScript, Optional Int IsDueToRecursion)
    If StringContains (TheName, "CallMyFunction") != 0
        SayUsingVoice (VCTX_MESSAGE, TheName, OT_SPELL)
        SayMessage (ot_error, msgUnknownFunction)
        Return
    EndIf
    Unknown (TheName, IsScript, IsDueToRecursion)
    EndFunction

    Script MyScriptsEventTest ()
    ; Call a dummy function that is not declared or written anywhere in the screen reader's scripting code.
    CallMyFunction ()
    EndScript
