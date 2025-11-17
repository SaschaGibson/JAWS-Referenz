# Help Functions

A Help function provides or returns information about a specific dialog
control, ribbon control, a group of controls, or even a feature or
application. Examples include keyboard help, screen-sensitive help, JAWS
hotkey help and so on. JAWS uses this information in order to speak and
display it in Braille on demand when the user presses a specific
keystroke combination.

Very often, especially when the information is longer than one sentence,
information from a Help function is displayed in a Virtual Viewer
window. For more details on working with a Virtual Viewer window, see
the topic in the General Scripting Concepts book called [Implementing a
Virtual Viewer Window.](../Virtual_Viewer_Functions.html)

Some examples of Help functions include:

- ShowScreenSensitiveHelp
- ScreenSensitiveHelpForJAWSDialogs
- ScreenSensitiveHelpForKnownClasses
- ScreenSensitiveHelpForUnknownClasses
- GeneralJAWSHotKeys
- JAWSHotKeys

For a complete listing of Help functions, see the topics in this
category book of the Reference Guide.

## Code Sample

You may obtain screen-sensitive help from anywhere in an application or
the Windows Desktop by pressing **JAWSKey+F1**.

The below code sample checks for a dialog to be active. If so, and if
the object subtype code of the control with focus is an edit combo (type
41), the screen-sensitive help for this window class is displayed in the
Virtual Viewer window with the added test message as its first line.
Perform this code sample from the Open dialog in Notepad, for example.

    Messages
    @msgTestEditComboClass_l
    I am a test for the edit combo class.
    @@
    @msgTestEditComboClass_s
    test for edit combo
    @@
    EndMessages

    Void Function ShowScreenSensitiveHelp(string sHelpMsg_L,optional string sHelpMsg_S, int bOmitHotKeyLinks)
    If DialogActive ()
        If GetObjectSubtypeCode () == wt_editCombo
            let sHelpMsg_l = msgTestEditComboClass_l+cscBufferNewLine+cscBufferNewLine+cmsgScreenSensitiveHelp50_L
            let sHelpMsg_s = msgTestEditComboClass_l+cscBufferNewLine+cscBufferNewLine+cmsgScreenSensitiveHelp50_s

            ;Call the below function with the added message test at the beginning so that
            ;the user buffer is populated with the default message after the test message.
            ;Setting the last parameter to FALSE ensures that the JAWS hotkey links and default message to press Esc to close the Virtual Viewer are honored.
            ShowScreenSensitiveHelp(sHelpMsg_L,sHelpMsg_S, FALSE)
            Return
        EndIf
    EndIf
    ShowScreenSensitiveHelp(sHelpMsg_L,sHelpMsg_S, bOmitHotKeyLinks)
    EndFunction
