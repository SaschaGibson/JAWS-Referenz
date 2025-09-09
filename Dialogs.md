# Dialogs Functions

A Dialog function provides or returns information about a specific
dialog, such as its list of controls that may be activated, which page
is gaining focus from a user action, etc. JAWS uses this information to
determine whether to speak and display it in Braille.

Some examples of Dialog functions include:

- DialogList
- DialogListHelper
- NextDocumentWindow
- PreviousDocumentWindow

For a complete listing of Dialog functions, see the topics in this
category book of the Reference Guide.

Note: SDM (Standard Dialog Manager) dialogs are handled somewhat
differently from most Microsoft Windows dialogs. They are discussed in
the Object Model and MSAA topic category book of the Reference Guide.
For more details on working with SDM dialogs beyond the scope of the
Freedom Scientific Developer Network, refer to the Microsoft Developer
Network at [Appendix B: Standard Dialog Manager Support
(Windows).](http://msdn.microsoft.com/en-us/library/windows/desktop/dd317997(v=vs.85).aspx)

## Code Sample

Note: The script that reads a dialog box in tab order performs a
different purpose from the below code sample that lists some of the
controls in the dialog and allows you to activate one of the controls in
the list. The script that handles reading a dialog box in tab order is
**JAWSKey+b**. But there is no default script for displaying a dialog
list of controls from which you may choose a control to activate.
Nevertheless, utilizing the DialogList function may be handy in certain
circumstances.

The below code sample checks for a dialog to be active. If so, then the
DialogList function is called in order to present the dialog controls in
a list from which you may select which control to activate. If you
perform this code sample from the Open dialog in Notepad, for example,
the dialog list only displays the controls that the DialogList function
finds. The function does not present the entire list of controls;
whereas, pressing the default key assignment for reading a dialog box in
tab order announces all the controls in the dialog.

    Script TestMyDialogList()
    If DialogActive ()
        DialogList ()
        Return
    Else
        SayMessage (ot_error, cmsg56_l,cmsg56_s); not in a dialog box/not in a dialog
    EndIf
    EndScript
