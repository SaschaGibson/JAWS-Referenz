# Windows Events

A Windows event function provides information about any type of changes
that occur with respect to the windows hierarchy. The information may be
for a windows event within an application such as Notepad or Microsoft
Word, but also for a windows text event in more general operating system
features like Windows Explorer or the Start menu. JAWS uses the
information from a Windows event function to determine what to speak and
display. For example, this includes whether focus has changed and
whether that focus change should be indicated or suppressed. In this
case, to display information refers to showing it in Braille.

The Freedom Scientific Scripting language supports many functions and
events related to the windows structure and hierarchy. But a discussion
of the windows architecture of the Windows operating system is outside
the scope of the Freedom Scientific Developer Network.

Some examples of WindowsEvent functions include:

- FocusChangedEventEx
- ForegroundWindowChangedEvent
- HelpBalloonEvent

For a complete listing of Windows event helper functions, see the
category book in the [Reference Guide.](../Reference_Guide.html)

## Code Sample

In the below code sample, the FocusChangedEventEx function is
overwritten for Notepad to announce a debug statement JAWS does not
indicate normally when focus changes.

Take time to examine this powerful function in default.jss. The
FocusChangedEventEx function is responsible for suppressing extraneous
information as well as for speaking it, depending on the type of
activity that causes a focus change to occur.

It is assumed that the function is processed from the Notepad.jss script
source file and compiled in the Notepad.jsb script binary file.

To set up the example, simply perform any activity in Notepad that
changes the focus, such as activating a menu or a dialog, tabbing
through the controls in a dialog, etc.

Note that there is no script associated with this sample in order for it
to work and provide information. This is because the function is an
event function. So it does not require that a script and key assignment
be bound to it in order to provide information or suppress it.

    Void Function FocusChangedEventEx (Handle hwndFocus, Int nObject, Int nChild,
        Handle hwndPrevFocus, Int nPrevObject, Int nPrevChild,
        Int nChangeDepth)

    Var
        String smsgDepth

    FocusChangedEventEx (hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
    sMsgDepth = "changed level is "
    If nChangeDepth != 0
        SayMessage (ot_help, sMsgDepth + IntToString (nChangeDepth))
    EndIf
    EndFunction

## Additional Resources

For a full discussion of the windows structure and how it is implemented
by Microsoft, refer to the Microsoft Developer Network topic called
[ChildWindow Class
(System.Windows.Controls).](http://msdn.microsoft.com/en-us/library/system.windows.controls.childwindow(v=vs.95).aspx)
