# Clipboard Functions

A Clipboard function returns information about the clipboard, such as
whether it contains any data, and if so what that data contains. JAWS
uses this information in order to speak and display it in Braille, for
comparison purposes, and so on.

Some examples of Clipboard functions include:

- ClipboardHasData
- GetClipboardText
- GetTextFromClipboard - gets plain text only

For a complete listing of Clipboard functions, see the topics in this
category book of the Reference Guide.

## Code Sample

In the below code sample, the script determines whether the clipboard
has any data. Since data may be something like an entire file, group of
files, or even a picture, the conditional test must also check for
whether the data is textual. If it is, then a further test checks
whether there is an active Virtual Viewer window. If there is, it is
deactivated and the user buffer is cleared before any text is displayed
in the Virtual Viewer.

    Script MyClipboardTest ()
    Var
        String sText

    sText = GetClipboardText ()
    If ClipboardHasData ()
    && sText != cscNull
        If UserBufferIsActive ()
            UserBufferDeactivate ()
            UserBufferClear ()
        EndIf
        SayFormattedMessage (ot_User_buffer,sText)
        UserBufferAddText (CscBufferNewLine+cmsgBuffExit)
    Else
        SayMessage (ot_help,cmsgNoTextOnClipboard)
    EndIf
    EndScript

## Additional Resources

For more details on working with the Virtual Viewer, see [Implementing a
Virtual Viewer Window.](../Virtual_Viewer_functions.html)
