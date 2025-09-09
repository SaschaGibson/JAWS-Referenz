# Cursor Functions

A Cursor function returns information about cursors, such as which
cursor is active, its type, and so on. The screen reader uses this
information to determine whether to track the cursor in speech and
Braille. (Tracking refers to speaking and displaying in Braille while
moving the cursor.)

Some examples of Cursor functions include:

- GetActiveCursor
- PCCursor
- JAWSCursor
- InvisibleCursor
- IsInvisibleCursor
- IsJAWSCursor
- IsVirtualPCCursor
- CaretVisible

JAWS utilizes the system cursors from Windows, but also has cursors of
its own. These include the JAWS cursor, Invisible cursor, and Virtual
cursor, and as of JAWS 2020, the UIA Scan cursors. The JAWS cursor
follows the mouse, which may not be where the PC cursor is currently
located. The Invisible cursor allows you to roam areas of the screen
where system cursors and mouse cursors cannot move to by normal keyboard
or mouse movements. The Virtual cursor is active when JAWS is displaying
a document or a message you have generated through scripts and functions
in a Virtual Viewer window. This includes viewing web sites using a
browser like Google Chrome, reading documents with Adobe Acrobat Reader,
and reading EMail messages with programs like Windows Mail or Microsoft
Outlook from Office 365.

Since the JAWS cursor is equivalent to the mouse cursor, moving the JAWS
cursor is equivalent to moving the mouse. Moving the JAWS cursor is
visible to the user, and is generally considered undesirable especially
for low vision users. Moving the JAWS cursor around may also cause
events such as screen tips or help balloons to appear. Note that this is
also the case for the UIA Scan cursors.

The invisible cursor, because it is invisible, can roam freely without
causing any side effect. So if cursor manipulation is needed, whenever
possible, it is preferable to use the invisible cursor. In most
situations, routing the PC cursor to the invisible cursor is equivalent
to performing a left Mouse click. If you need to move the PC cursor to
the invisible cursor location without performing a mouse click, you can
get the cursor coordinates of the invisible cursor and move the PC
cursor to that location but offset by a couple of pixel points.

Note: By default, the voice that JAWS uses for the JAWS cursor is
different from the voice it uses for the PC cursor. But the voice that
JAWS uses for the invisible cursor is the same as the voice it uses for
the PC cursor. If you are in doubt as to which cursor is active, you can
use the SayActiveCursor script, **Alt+Delete**, to announce the active
cursor.

If you call a function that activates a cursor other than the active
cursor, always remember to save the active cursor\'s location and
restore it after processing the task that required activating the other
cursor. Also, there are some not-so-obvious consequences of calling
certain functions that activate the JAWS cursor. Unless you deliberately
choose not to return to the PC cursor after processing the desired task
with such function calls, failing to return to the PC cursor can yield
unpredictable results.

Some functions that activate the JAWS cursor but which may not be
obvious include:

- FindWindow
- FindDescendantWindow
- FindColors
- MoveToWindow

For a complete listing of Cursor functions, see the topics in this
category book of the Reference Guide.

## Code Samples

The first script shows what happens when you forget to deactivate the
JAWS cursor after a function call that activates it. This script assumes
that you have a dialog active in Notepad. Type some text into the
Filename edit control. then execute the script. The button is found, and
its window type and text are spoken. But the JAWS cursor remains active.
So any activity you try to perform yields strange results.

    Script MyCursorTest ()
    Var
        Handle hwnd

    If DialogActive ()
        hwnd = FindWindowWithClassAndId (GetRealWindow (GetFocus ()), cwc_button, 1) ; 1 is the Control ID of the button.
        If hwnd ; The window handle exists.
            SayWindowTypeAndText (hwnd)
            MoveToWindow (hwnd) ; Move the mouse to the control.
            SayActiveCursor () ; The JAWS cursor should be active.
            Return
        EndIf
    EndIf
    EndScript

You can fix the problem in a couple of ways. If all you want to do is
speak the information about the button but not move to it, remove the
call to MoveToWindow. This keeps the PC cursor active because
FindWindowWithClassAndID does not activate a different cursor from the
active cursor. On the other hand, if you really do want to move to and
click the button control with this script, then you should route the PC
cursor to where the JAWS cursor is after you make the call to
MoveToWindow and that call succeeds. then routing the PC cursor to the
JAWS cursor clicks the mouse, which is already on the control. And
finally, re-activating the PC cursor ensures that the JAWS cursor is no
longer active.

    Script MyCursorTest ()
    Var
        Handle hwnd

    If DialogActive ()
        hwnd = FindWindowWithClassAndId (GetRealWindow (GetFocus ()), cwc_button, 1)
        If hwnd ; The window handle exists.
            SayWindowTypeAndText (hwnd)
            MoveToWindow (hwnd) ; Move the mouse to the control.
            RoutePCToJAWS () ; Click the mouse to open the file.
            PCCursor () ; Re-activate the PC cursor.
            SayLine () ; Speak the first line of the document.
            Return
        EndIf
    EndIf
    EndScript

## Additional Resources

[Implementing a Virtual Viewer Window](../Virtual_Viewer_Functions.html)
