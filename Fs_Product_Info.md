# FS Product Info Functions

An FS Product Info function returns information about the FS Product
currently running, such as its authorization code. JAWS uses this
information in order to speak and display it in Braille, for comparison
purposes, and so on.

Some examples of FS Product Info functions include:

- GetAuthCode
- GetJFWSerialNumber

For a complete listing of FS Product Info functions, see the topics in
this category book of the Reference Guide.

## Code Sample

In the below code sample, the script determines your serial number and
speaks and flashes it in a message.

It is assumed that the function is being processed in a Notepad.jss
script source file and compiled in it associated Notepad.jsb script
binary file.

    Script MySerialNumber ()
    Var
        Int iNum

    iNum = GetJFWSerialNumber ()
    SayInteger (iNum)
    BrailleMessage (IntToString (iNum))
    EndScript
