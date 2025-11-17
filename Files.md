# Files Functions

A Files function provides or returns information about JAWS interaction
with files used for activities like reading to and writing from files
that contain user settings. JAWS uses this information to determine
whether to speak and display information in Braille, for comparison
purposes, and so on.

Some examples of Files functions include:

- FileExists
- IniReadInteger
- IniReadString
- IniWriteInteger
- IniWriteString
- GetFileDate
- IniFlush

For a complete listing of Files functions, see the topics in this
category book of the Reference Guide.

## Code Sample

In the below code sample, the script determines whether a certain file
exists in the user\'s Settings\\Language) folder. If it does, the script
calls some Files functions and uses one of the Strings function to parse
out the first section name in the file and the first key within that
section. Normally, such function calls are utilized for comparison
purposes rather than for speaking or displaying this type of information
in a script. In fact, most of the time, the purpose for obtaining such
information is so that it may be updated by related IniWrite function
calls.

It is assumed that the function is being called from and processed in a
Notepad.jss script source file and compiled in its associated
Notepad.jsb script binary file.

    Script MyFilesTest ()
    Var
        String sLocation,
        String sSection,
        String sKey,
        String sMessage

    ; For sMessage, %1 is the section name and %2 the first key in the section.
    sMessage = "The first section in the Notepad.jkm file is %1 and the first key in it is %2."

    Let sLocation = GetUserSettingsDirectory()+cscDoubleBackSlash+"Notepad.jkm"
    If FileExists (sLocation)
        sSection = StringSegment (IniReadSectionNames (sLocation), cscListSeparator, 1)
        sKey = StringSegment (IniReadSectionKeys (sSection, sLocation), cscListSeparator, 1)
    SayFormattedMessage (ot_user_requested_information,
            FormatString (sMessage, sSection, sKey))
    EndIf
    EndScript

## Additional Resources

For more details on working with the various types of settings files,
see the topic area in the General Scripting Concepts book called
[Settings and Configurations.](../Settings_and_Configurations.html)

For more specifics on working with script files, see the subtopic called
[Script File
Types.](../Settings_And_Configurations/ScriptFileTypes.html)
