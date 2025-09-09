# Clipboard Events

A Clipboard event function provides information about the clipboard,
such as whether it has been changed or updated. JAWS uses this
information to determine whether to speak and display it, for comparison
purposes, etc. In this case, to display information refers to showing it
in Braille.

An example of a Clipboard Event function is ClipboardChangedEvent. For a
complete listing of functions related to the clipboard, see the category
book in the [Reference Guide.](../Reference_Guide.html)

## Code Sample

In the below code sample, the ClipboardChangedEvent function is
overwritten in order to determine whether the Clipboard contains new
text. Every time you copy, cut, overwrite, or append to the Clipboard,
the ClipboardChangedEvent function fires and lets you know that there is
new text in the clipboard. It is assumed that the function is being
processed in a Notepad.jss script source file and compiled in the
Notepad.jsb script binary file.

Note that there is no script associated with this sample in order for it
to work and provide information. This is because the function is an
event function. So it does not require that a script and key assignment
be bound to it in order to provide information or suppress it.

    Void Function ClipboardChangedEvent ()
    ;Speak whether I have text.
    If GetClipboardText () != cscNull
        SayMessage (ot_JAWS_message, "You have text in the clipboard.")
    EndIf
    ClipboardChangedEvent ()
    EndFunction
