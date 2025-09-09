# Window Functions

A Window function returns information about a specific window within the
Windows hierarchy, such as the window\'s name, class, type, etc. JAWS
uses this information to determine whether to speak and display anything
about the window in Braille.

Some examples of Window functions include:

- GetFocus
- GetCurrentWindow
- GetFocusRect
- FindWindow
- FindTopLevelWindow
- FindDescendantWindow
- IsDescendedFromWindow
- FocusFollowsMouse

For a complete listing of Window functions, see the topics in this
category book of the Reference Guide.

Note: SDM (Standard Dialog Manager) dialogs are handled somewhat
differently from most Microsoft Window controls. They are discussed in
the Object Model and MSAA category summary topic page of the Reference
Guide. These legacy types of dialogs are seldom used anymore by
Microsoft Office applications.

## Code Sample

The below code sample checks for a dialog to be active. If so, then the
GetWindowClass function is called. If the class is known, JAWS speaks
and flashes it in Braille.

Since JAWS 11, the GetFocus function can provide optionally by reference
helpful MSAA information about the current object ID and child ID of the
current object. If this information is available, the screen reader also
speaks and flashes it in Braille.

If the information is not available, the screen reader speaks and
flashes an error message.

To set up the example, simply open any dialog in Notepad and run the
script from any control. It is assumed that the script is being
processed in the Notepad.jss script source file and compiled in the
Notepad.jsb script binary file.

    Script TestWindowClass ()
    Var
        String sClass,
        Int iObjID,
        Int iObjChildID,
        String msgClassNotFound

    msgClassNotFound = "I couldn't find the class."

    If DialogActive ()
        sClass = GetWindowClass (GetFocus (iObjID, iObjChildID))
        If sClass != cscNull
            SayMessage (Ot_User_Requested_information, sClass + cscSpace + IntToString (iObjID) + cscSpace + IntToString (iObjChildID))
            Return
        Else
            SayMessage (ot_error, msgClassNotFound) ; no class obtained
        EndIf
    EndIf
    EndScript

## Additional Resources

A full discussion about the Microsoft Windows architecture and
hierarchy, as well as SDM dialog controls is outside the scope of the
Freedom Scientific Developer Network. For details on working with these
topics, refer to the Microsoft Developer Network at:

[ChildWindow Class
(System.Windows.Controls)](http://msdn.microsoft.com/en-us/library/system.windows.controls.childwindow(v=vs.95).aspx)
and [Appendix B: Standard Dialog Manager Support
(Windows).](http://msdn.microsoft.com/en-us/library/windows/desktop/dd317997(v=vs.85).aspx)
