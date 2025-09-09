# SayAll Events

A SayAll event function provides information about SayAll activities
that JAWS may have performed automatically or from user interaction. For
example, a SayAll event may have started, stopped, or have been
interrupted. JAWS uses this information to determine what to speak and
display, whether to sstop speaking and move the Braille cursor to the
point where the SayAll has stopped, etc. In this case, to display
information refers to showing it in Braille.

SayAll event functions include:

- SayAllStarted
- SayAllStoppedEvent

For a complete listing of functions related to SayAll events, see these
category books in the reference guide:

- [Screen Text](../Reference_Guide/Screen_Text.html)
- [Voices.](../Reference_Guide/Voices.html)

## Code Sample

In the below code sample, the SayAllStoppedEvent function is overwritten
in the Notepad.jss script source file from the function in default.jss.
Whenever a SayAll is stopped in Notepad, JAWS indicates in speech and in
Braille a nonsense message that the SayAllStoppedEvent function fired.
It is assumed that the function is being processed in a Notepad.jss
script source file and compiled in the Notepad.jsb script binary file.

To set up the test, write several lines of text in a Notepad file. Then
initiate a SayAll with the **JAWSKey+DOWNARROW** key combination. Allow
SayAll to complete, or interrupt it by pressing **CONTROL** or some
other key. Either way, SayAllStoppedEvent should fire and indicate the
test message from the code in this sample, along with a beep.

Note that there is no script associated with this sample in order for it
to work and provide information. This is because the function is an
event function. So it does not require that a script and key assignment
be bound to it in order to provide information or suppress it.

    Void Function SayAllStoppedEvent ()
    Var
        String smsgSayAllStatus

    smsgSayAllStatus = "SayAll stopped."
    SayAllStoppedEvent ()
    Beep () ; Produce a system sound.
    SayMessage (ot_status, smsgSayAllStatus)
    EndFunction
