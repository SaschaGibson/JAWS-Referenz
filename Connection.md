# Connections

A Connection function returns information about a Tandem Connection,
such as whether it is connected or disconnected. JAWS uses this
information in order to speak and display it in Braille, for comparison
purposes, and so on.

Some examples of Connection functions include:

- IsTandemInstalled
- TandemIsConnected

For a complete listing of Connection functions, see the topics in this
category book of the Reference Guide.

## Code Sample

In the below nonsense code sample, the script determines whether the
Tandem connection exists, and if not, lets you know.

    Script MyConnectionTest ()
    Var
        String smsgNoTandemConnection

    smsgNoTandemConnection = "You are not running a Tandem session."

    If ! TandemIsConnected ()
        SayMessage (ot_error, smsgNoTandemConnection)
    EndIf
    EndScript
