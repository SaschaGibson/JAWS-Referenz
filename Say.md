# Say Functions

A Say function provides or returns information about user interaction
activities that cause JAWS to speak. JAWS uses this information to
determine what to speak, for comparison purposes, and so on.

Some examples of Say functions include:

- HomeEndMovement
- SayLineUnit
- SayPageUpDownUnit

For a complete listing of Say functions, see the topics in this category
book of the Reference Guide.

## Code Sample

In the below code sample, the SayLineUnit function is overwritten in the
Notepad.jss script source file from the function in default.jss. If the
user moves up or down by lines in the Notepad document window, a debug
test message is spoken.

It is assumed that the function is being processed in the Notepad.jss
script source file and compiled in the Notepad.jsb script binary file.

To set up the example, write several lines of text in a Notepad document
window. Then move up and down by lines. Notice that the function does
not fire at all if you move by something other than line.

    Void Function SayLineUnit (Int unitMovement, Optional  Int bMoved)
    Var
        String smsgDown,
        String smsgUp

    smsgDown = "I'm moving down."
    smsgUp = "I'm moving up."

    SayLineUnit(unitMovement, bMoved)
    If GetObjectSubtypeCode () == wt_multiline_edit
        If UnitMovement == UnitMove_Next
            SayMessage (ot_help, smsgDown)
        ElIf UnitMovement == UnitMove_Prior
            SayMessage (ot_help, smsgUp)
        EndIf
    EndIf
    EndFunction
