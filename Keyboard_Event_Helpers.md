# Keyboard Event Helpers

A Keyboard Event helper function assists a Keyboard Event. Based on the
information the Keyboard Event helper function provides or returns, JAWS
determines what to speak and display from the related event. In this
case, to display information refers to showing it in Braille.

When overriding default behavior, it is best to overwrite the most
specific function to the task. If a function has helper functions, and
if the task you want to handle is best handled by a helper function,
then overwrite the helper function. Doing so is the best way to ensure
robust script behavior, and make it less likely that any future changes
to default scripts will have a negative impact on your scripts.

Some examples of Keyboard Event helper functions include:

- PreProcessKeyPressedEvent
- ProcessHJDialogKeyPressed
- ProcessKeyPressed

For a complete listing of Keyboard event helper functions, see the
category book in the [Reference Guide.](../Reference_Guide.HTML)

## Code Sample

In the below code sample, the ProcessSpaceBarKeyPressed function is
overwritten in the Notepad.jss script source file from the function in
default.jss. Before the default function is called, a nonsense message
is added to speak and display in Braille under certain conditions to
illustrate how KeyPressedEvent uses this helper function.

Note that there is no script associated with this sample in order for it
to work and provide information. This is because the function is an
event helper function. So it does not require that a script and key
assignment be bound to it in order to provide information for the
related event function to utilize the helper function.

    Int Function ProcessSpaceBarKeyPressed (Int nKey, String strKeyName, Int nIsBrailleKey, Int nIsScriptKey)
    Var
        String msgSpaceBarKeyPressTest

    msgSpaceBarKeyPressTest = "I am a checkbox and the %1 key was just pressed."

    If DialogActive ()
    && GetObjectSubtypeCode () == wt_checkbox
        SayFormattedMessage (ot_help,FormatString(msgSpaceBarKeyPressTest,strKeyName))
    EndIf
    Return ProcessSpaceBarKeyPressed (nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
    EndFunction
