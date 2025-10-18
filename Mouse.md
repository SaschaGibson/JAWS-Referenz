# Mouse Functions

A Mouse function provides or returns information about mouse activities,
such as whether a mouse click has caused an event to fire. JAWS uses
this information to determine whether to speak and display anything in
Braille, for comparison purposes, and so on.

Some examples of Mouse functions include:

- ClickAtPoint
- DragAndDropClearValues
- GetButtonLockedNotification

For a complete listing of Mouse functions, see the topics in this
category book of the Reference Guide.

## Code Sample

In the below code sample, the GetButtonLockedNotification function is
overwritten in the Notepad.jss script source file from the function in
default.jss. A nonsense message confirming that the mouse is locked when
the left or right button is down is returned along with the default
function string when the function is called.

To test the function, lock the mouse from within Notepad by pressing
**Insert+NumpadSlash** for the left mouse button and
**Insert+NumpadStar** for the right mouse button. Then run the script to
say the active cursor with the key assignment, **ALT+DELETE**. The extra
message is indicated if the mouse is locked, but not indicated if the
mouse is not locked.

Remember! Press the **Insert+Slash** or **Insert+Star** again to unlock
the mouse button.

    String Function GetButtonLockedNotification (Int messageLengthType)
    Var
        String sMsg

    If IsLeftButtonDown ()
    || IsRightButtonDown ()
        smsg = "The mouse is locked."
        Pause ()
        Return GetButtonLockedNotification (messageLengthType) + sMsg
    EndIf
    Return GetButtonLockedNotification (messageLengthType)
    EndFunction
