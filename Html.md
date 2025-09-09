# HTML Functions

An HTML function returns information related to an HTML event for HTML
applications. JAWS uses this information in order to speak and display
it in Braille when an HTML event occurs or when an HTML script is run
(that is, when the user presses a key assignment bound to a script).

Some examples of HTML functions include:

- HasVirtualEnhancedClipboard
- IsEmptyEditFormField

For a complete listing of HTML scripts and functions, see the topics in
this category book of the Reference Guide.

## Code Sample

The below code sample overwrites HasVirtualEnhancedClipboard in the
Notepad.jss script source file from the function in default.jss. The
function is set to return FALSE because there are no enhanced clipboard
features available in Notepad when the virtual viewer is active. Notepad
is not an HTML application. To show the overwritten function at work,
the ClipboardChangedEvent function is overwritten to include a test for
whether HasVirtualEnhancedClipboard is true or false. If false, when a
clipboard event occurs, a beep is heard.

    Int Function HasVirtualEnhancedClipboard ()
    Return FALSE
    EndFunction

    Void Function ClipboardChangedEvent ()
    If Not HasVirtualEnhancedClipboard ()
        Beep ()
    EndIf
    ClipboardChangedEvent ()
    EndFunction
