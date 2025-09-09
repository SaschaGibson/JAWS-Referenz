# Menus Functions

A Menus function provides or returns information about Menu activities,
such as activating or deactivating a menu, the current menu mode, a
menu\'s name, etc. JAWS uses this information in order to speak and
display it in Braille, for comparison purposes, and so on.

Some examples of Menus functions include:

- GetMenuMode
- GetMenuName
- MenusActive

For a complete listing of Menus functions, see the topics in this
category book of the Reference Guide.

## Code Sample

In the below code sample, the script determines whether a menu is
active. If not, an error message is spoken and displayed in Braille. If
a menu is active, then various tests determine what JAWS should speak
when the script is run. For example, a context menu has no menu name,
nor does a menu bar. So for those cases, no menu name is indicated when
the script is run. Perform the script from the Notepad application, for
example, from different windows within the application: from the main
edit window, from an active context menu or from a menu like the Files
menu.

    Messages
    @msgNoMenuError
    not in a menu
    @@
    ;For msgMenuName, %1 is the name of the active menu.
    @msgMenuName
    %1 menu
    @@
    @msgMenuBar
    This is a menu bar, not a menu.
    @@
    @msgNoMenuName
    menu name not found
    @@
    EndMessages

    Script MyMenuTest ()
    Var
        Int nMenuMode,
        String sMenuName

    nMenuMode = GetMenuMode ()

    If nMenuMode == Menu_Inactive
        SayMessage (ot_error, msgNoMenuError)
        Return
    EndIf
    If MenusActive ()
        sMenuName = GetMenuName ()
        If nMenuMode != MenuBar_Active ; a menu is active but not on the menu bar.
        && sMenuName != cscNull ; A menu name is found.
            SayFormattedMessage (ot_help, FormatString (msgMenuName, sMenuName))
        ElIf nMenuMode == MenuBar_Active
            SayMessage (ot_help, msgMenuBar)
        ElIf sMenuName == cscNull
            SayMessage (ot_error, msgNoMenuName)
        EndIf
    EndIf
    EndScript
