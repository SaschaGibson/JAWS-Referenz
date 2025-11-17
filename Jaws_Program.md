# JAWS Program Functions

A JAWS Program function provides or returns information about script
activities caused by user interaction or automatically updated by an
event. JAWS uses this information to determine whether to speak and
display information in Braille, for comparison purposes, and so on.

Some scripts that ship with JAWS fall into the category of JAWS Program,
such as the script for ShutDownJAWS, for example. However, the focus of
the present discussion is on functions related to JAWS Program that you
may call from your own scripts or that you may overwrite from those in
default.jss or from the built-in functions.

Some examples of JAWS Program functions include:

- FindJAWSPersonalizedSettingsFile
- GetJAWSDirectory
- GetJAWSMode
- GetJAWSUserName

For a complete listing of JAWS Program functions, see the topics in this
category book of the Reference Guide.

## Code Sample

In the below code sample, the script determines the current JAWS user
name and serial number, along with the current JAWS mode, and speaks and
flashes the information in Braille. It only provides information,
however, if the JAWS mode is running in the system tray or as a full
JAWS window. If the JAWS mode cannot be determined, the script does not
test or provide an error, although it could if you prefer.

It is assumed that the script is being processed in the Notepad.jss
script source file and compiled in the Notepad.jsb script binary file.

    Messages
    @msgTray
    running in the system tray
    @@
    @msgFull
    running as a full JAWS window
    @@
    ; For msgMyInfo, %1 is the user name, %2, the serial number, and %3 the JAWS mode.
    @msgMyInfo
    My user name is %1, my serial number is %2, and my JAWS is %3.
    @@
    EndMessages

    Script MyJAWSInfo ()
    Var
        Int iNum,
        Int iMode,
        String sName

    iNum = GetJFWSerialNumber ()
    sName = GetJAWSUserName ()
    iMode = GetJAWSMode ()

    If iMode == JAWSMode_Tray
        SayFormattedMessage (ot_user_requested_information,
            FormatString (msgMyInfo, sName, IntToString (iNum), msgTray))
    ElIf iMode == JAWSMode_Full
        SayFormattedMessage (ot_user_requested_information,
            FormatString (msgMyInfo, sName, IntToString (iNum), msgFull))
    EndIf
    EndScript
