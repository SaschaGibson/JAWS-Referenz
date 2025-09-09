# Object Model and MSAA Events

An Object Model and MSAA event function provides information about any
object activity in the Object Model and MSAA architecture (object
hierarchy) that the Freedom Scientific Scripting language supports.
Object events are not limited to dialogs and menus. These events may
include such activities as whether a dialog item change in a list or a
state change in a checkbox has occurred, whether a main document window
has gained focus, etc. JAWS uses the information from such an event
function to determine whether to speak and display it. In this case, to
display information refers to showing it in Braille.

Some examples of Object Model and MSAA event functions include:

- ActiveItemChangedEvent
- DescriptionChangedEvent
- NameChangedEvent
- ObjStateChangedEvent

For a complete listing of Object Model and MSAA event Functions, see the
category book in the [Reference Guide.](../Reference_Guide.html)

## Code Sample

In the below code sample, the ActiveItemChangedEvent function is
overwritten for Notepad to announce some information it does not
indicate normally when an item change occurs from user interaction in a
dialog control that causes this event to fire. It is assumed that the
function is processed from the Notepad.jss script source file and
compiled in the Notepad.jsb script binary file.

Note that there is no script associated with this sample in order for it
to work and provide information. This is because the function is an
event function. So it does not require that a script and key assignment
be bound to it in order to provide information or suppress it.

    Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
        handle prevHwnd, int prevObjectId, int prevChildId)

    Var
        String smsgCurrent
    smsgCurrent = "This confirms that the current item is %1."

    Say (FormatString(smsgCurrent,GetObjectName (curObjectId)),ot_line)
    ActiveItemChangedEvent (curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
    EndFunction

## Additional Resources

For more information on the types of Objects the Freedom Scientific
Scripting language supports, see the General Scripting Concepts topic
called [Objects.](../Objects.html)

For more details on working with Object Model and MSAA in general, refer
to the Microsoft Developer Network in the section called [Microsoft
Active Accessibility and UI Automation Compared
(Windows).](http://msdn.microsoft.com/en-us/library/windows/desktop/dd561918(v=vs.85).aspx#object_model_navigation)
