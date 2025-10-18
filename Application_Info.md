# Application Info Functions

An Application Info function returns information about the application,
such as its name, path on your computer, version, etc. JAWS uses this
information in order to speak and display it in Braille, for comparison
purposes, and so on.

Some examples of Application Info functions include:

- GetAppFileName
- GetAppFilePath
- GetAppTitle
- GetProgramVersion

For a complete listing of Application Info functions, see the topics in
this category book of the Reference Guide.

## Code Sample

In the below code sample, the script speaks and displays in Braille the
name and version of the current application that has the focus. Note
that this script is normally handled by the script that ships with JAWS
called \"SayAppVersion\" and is bound to the key assignment,
**JAWSKey+CTRL+v**. Our simpler example does not handle all scenarios;
rather, this example just shows you how to use a couple of the
application Info functions.

    Script MyApplicationTest ()
    Var
        String sMyAppInfo,
        String sMyAppName,
        Int iMyAppVersion

    sMyAppInfo = "My application is called %1 and its version is %2."
    sMyAppName = GetAppFileName ()
    iMyAppVersion = GetProgramVersion (GetAppFilePath ())
    If sMyAppName != cscNull
    && iMyAppVersion != 0
        SayFormattedMessage (ot_User_Requested_information,
            FormatString (sMyAppInfo,sMyAppName,IntToString(iMyAppVersion)))
    Else
        SayMessage (ot_help,cmsgUnknown)
    EndIf
    EndScript
