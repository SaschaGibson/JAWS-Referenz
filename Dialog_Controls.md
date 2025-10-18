# Dialog Controls Functions

A Dialog Controls function returns information about a specific dialog
control, such as its name, state, attributes, hotkey, etc. JAWS uses
this information to determine whether to speak and display it in
Braille.

Some examples of Dialog Controls functions include:

- GetControlName
- GetControlAttributes
- GetCurrentItem
- GetHotkey

For a complete listing of Dialog Controls functions, see the topics in
this category book of the Reference Guide.

Note: SDM (Standard Dialog Manager) dialogs are handled somewhat
differently from most Microsoft Windows controls. They are discussed in
the Object Model and MSAA category book summaries of the Reference
Guide. They are now far less frequently used since most applications
have moved toward UIA controls instead.

## Code Sample

The below code sample checks for a dialog to be active. If so, then the
GetHotkey function is called. If a hotkey is found, JAWS speaks and
flashes it in Braille. If not, JAWS speaks and flashes an error message.

Note that the default key assignment for checking on a hotkey (access
key) is **Shift+Numpad5**. but you may assign it to any key desired for
the purpose of running the test script.

    Script TestHotkey ()
    Var
        String sHotkey

    If DialogActive ()
        sHotKey = GetHotkey ()
        If sHotkey != cscNull
            SayMessage (Ot_User_Requested_information, sHotkey)
            Return
        Else
            SayMessage (ot_error, cmsg124_L) ; no hotkey
        EndIf
    EndIf
    EndScript

## Additional Resources

For more details on working with SDM dialogs beyond the scope of the
Freedom Scientific Developer Network, refer to the Microsoft Developer
Network at [Appendix B: Standard Dialog Manager Support
(Windows).](http://msdn.microsoft.com/en-us/library/windows/desktop/dd317997(v=vs.85).aspx)
