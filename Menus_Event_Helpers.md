# Menu Event Helpers

A Menu event helper assists a Menu Event that may occur in any
application or a feature of the Windows operating system. Based on the
information the Menu Event helper function provides or returns, JAWS
determines what to speak and display from the related event. In this
case, to display information refers to showing it in Braille.

When overriding default behavior, it is best to overwrite the most
specific function to the task. If a function has helper functions, and
if the task you want to handle is best handled by a helper function,
then overwrite the helper function. Doing so is the best way to ensure
robust script behavior, and make it less likely that any future changes
to default scripts will have a negative impact on your scripts.

Some examples of Menu Event helper functions include:

- ContextMenuProcessed
- MenuActiveProcessed
- MenuBarActiveProcessed

For a complete listing of Menu event helper functions, see the category
book in the JAWS [Reference Guide.](../Reference_Guide.html)

## Code Sample

In the below code sample, the MenuActiveProcessed function is
overwritten in the Notepad.jss script source file from the function in
default.jss to announce extra information the function does not speak
normally when MenuModeEvent fires. It is assumed that the function is
being compiled in the Notepad.jsb script binary file.

Note that there is no script associated with this sample in order for it
to work and provide information. This is because the function is an
event helper function. So it does not require that a script and key
assignment be bound to it in order to provide information for the
related event function to utilize the helper function.

    Int Function MenuActiveProcessed (Int mode, Handle hWnd)
    Var
        String sFirstOption

    sFirstOption = "New"
    If StringContains (GetObjectName (),sFirstOption)
        ;Speak the names of all the options in the menu.
        Say (GetWindowText (hWnd, FALSE), ot_line)
    EndIf
    Return MenuActiveProcessed (mode, hWnd)
    EndFunction
