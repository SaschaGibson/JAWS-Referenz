# User Interaction Functions

A User Interaction function provides or returns information about
activities caused by user interaction with JAWS. JAWS uses this
information to determine whether to speak and display information in
Braille, for comparison purposes, and so on.

Many scripts that ship with JAWS fall into the category of User
Interaction, such as the script for SkimReadDialog, for example.
However, the focus of the present discussion is on functions related to
User Interaction that you may call from your own scripts or that you may
overwrite from those in default.jss or from the built-in functions.

Some examples of User Interaction functions include:

- ExMessageBox
- InputBox
- MessageBox
- dlgSelectFunctionToRun

For a complete listing of User Interaction functions, see the topics in
this category book of the Reference Guide.

## Code Sample

In the below code sample, the script displays a message box to which you
must respond by pressing **SPACE** or **Enter** on one of its buttons.

It is assumed that the script is being processed in the Notepad.jss
script source file and compiled in the Notepad.jsb script binary file.

    Messages
    @msgTitle
    Test Message Box
    @@
    @msgText
    I am a test message box. Press one of the buttons to accept or cancel the message.
    @@
    @msgYes
    You said "yes."
    @@
    @msgNo
    You said "No."
    @@
    @msgCancel
    You said "Cancel."
    @@
    EndMessages

    Script MyMessageTest ()
    Var
        Int iOption

    iOption = ExMessageBox (msgText, msgTitle, MB_YESNOCANCEL)
    If iOption ==   IDYes
        SayMessage (ot_status,msgYes)
    ElIf iOption == IDNo
        SayMessage (ot_status, msgNo)
    ElIf iOption == IDCancel
        SayMessage (ot_status, msgCancel)
    EndIf
    EndScript
