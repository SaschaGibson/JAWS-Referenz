# Menu Events

A Menu event function provides information about any type of menu
activity. The information may be for a menu in an application such as
Notepad or Microsoft Word, but also for context menus in more general
operating system features like Windows Explorer or the Start menu. JAWS
uses the information from a menu event function to determine what to
speak and display. This includes whether a menu is being activated,
which option is selected, or whether the menu is being deactivated. In
this case, to display information refers to showing it in Braille.

An example of a Menu event function is MenuModeEvent. For a complete
listing of Menu event functions, see the category book in the JAWS
[Reference Guide.](../Reference_Guide.html)

## Code Sample

In the below code sample, the MenuModeEvent function is overwritten for
Notepad to announce some information it does not indicate normally when
a menu is activated or deactivated. It is assumed that the function is
processed from the Notepad.jss script source file and compiled in the
Notepad.jsb script binary file.

Note that there is no script associated with this sample in order for it
to work and provide information. This is because the function is an
event function. So it does not require that a script and key assignment
be bound to it in order to provide information or suppress it.

    Messages
    @msgInactive
    I was a menu.
    @@
    @msgActive
    I am an active menu.
    @@
    @msgMenuBar
    I am a menu bar.
    @@
    EndMessages

    Void Function MenuModeEvent (handle WinHandle, int mode)
    MenuModeEvent (WinHandle, mode)
    If Mode == Menu_Inactive
        SayMessage (ot_status, msgInactive)
    ElIf Mode == Menu_Active
        SayMessage (ot_status,msgActive)
    ElIf Mode == Menubar_Active
        SayMessage (ot_status,msgMenubar)
    EndIf
    EndFunction
