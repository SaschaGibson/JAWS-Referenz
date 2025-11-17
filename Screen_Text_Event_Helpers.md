# Screen Text Event Helpers

A Screen Text event helper function assists a Screen Text event that may
occur in any application or a feature of the Windows operating system.
Based on the information the ScreenText Event helper function provides
or returns, JAWS determines what to speak and display from the related
event. In this case, to display information refers to showing it in
Braille.

When overriding default behavior, it is best to overwrite the most
specific function to the task. If a function has helper functions, and
if the task you want to handle is best handled by a helper function,
then overwrite the helper function. Doing so is the best way to ensure
robust script behavior, and make it less likely that any future changes
to default scripts will have a negative impact on your scripts.

Some examples of Screen Text event helper functions include:

- MonitorNewTextEventAlerts
- NewTextEventShouldBeSilent

For a complete listing of Screen Text event helper functions, see the
category book in the [Reference Guide.](../Reference_Guide.html)

## Code Sample

In the below code sample, the NewTextEventShouldBeSilent function is
overwritten in the Notepad.jss script source file from the function in
default.jss to announce some debug statements the function does not
indicate normally when the related NewTextEvent function fires. Notice
that the function fires multiple times even though the debug statements
are conditional. This is one reason this function is critical to
ensuring that speaking text multiple times does not occur.

It is assumed that the function is being compiled in the Notepad.jsb
script binary file.

Note that there is no script associated with this sample in order for it
to work and provide information. This is because the function is an
event helper function. So it does not require that a script and key
assignment be bound to it in order to provide information for the
related event function to utilize the helper function.

    Int Function NewTextEventShouldBeSilent (Handle hFocus, Handle hwnd, String buffer, Int nAttributes,
        Int nTextColor, Int nBackgroundColor, Int nEcho, String sFrameName)
    Var
        Int iSubtype,
        String smsgFocus,
        String smsgHighlight

    iSubtype = GetObjectSubtypeCode ()
    smsgFocus = "The window with the focus is "
    smsgHighlight = "the window with the highlight is "
    If iSubtype == wt_editcombo
        ;The window with focus and the window with the highlighted text may not be the same.
        ; Use the debug statements here to check whether the window with focus and the window
        ;with the highlighted text are the same.
        say (smsgFocus + IntToString (hFocus), ot_line)
        say (smsgHighlight + IntToString (hwnd), ot_line)
        Return
    EndIf
    NewTextEventShouldBeSilent(hFocus, hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
    EndFunction
