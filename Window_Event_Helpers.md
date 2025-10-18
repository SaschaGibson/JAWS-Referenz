# Windows Event Helpers

A Windows event helper function assists a Windows event that may occur
in any application or a feature of the Windows operating system. Based
on the information the Windows event helper function provides or
returns, JAWS determines what to speak and display from the related
event. In this case, to display information refers to showing it in
Braille.

When overriding default behavior, it is best to overwrite the most
specific function to the task. If a function has helper functions, and
if the task you want to handle is best handled by a helper function,
then overwrite the helper function. Doing so is the best way to ensure
robust script behavior, and make it less likely that any future changes
to default scripts will have a negative impact on your scripts.

Some examples of Windows event helper functions include:

- FocusChangedEvent
- ProcessSayAppWindowOnFocusChange
- HandleNoCurrentWindow

For a complete listing of Windows event helper functions, see the
category book in the [Reference Guide.](../Reference_Guide.html)

## Code Sample

In the below code sample, the ProcessSayFocusWindowOnFocusChange
function is overwritten in the Notepad.jss script source file from the
function in default.jss to announce a debug statement the function does
not indicate normally when the related FocusChangedEventEx function
fires. In this case, the object subtype code is announced whenever focus
changes in the Open or Save-As dialog.

It is assumed that the function is being compiled in the Notepad.jsb
script binary file.

Note that there is no script associated with this sample in order for it
to work and provide information. This is because the function is an
event helper function. So it does not require that a script and key
assignment be bound to it in order to provide information for the
related event function to utilize the helper function.

    Void Function ProcessSayFocusWindowOnFocusChange (String RealWindowName, Handle FocusWindow)
    ProcessSayFocusWindowOnFocusChange (RealWindowName, FocusWindow)
    If RealWindowName == "Open"
    || RealWindowName == "Save As"
        SayInteger (GetObjectSubtypeCode ())
    EndIf
    EndFunction
