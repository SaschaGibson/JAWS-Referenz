# Optical Character Recognition Events

An Optical Character Recognition (OCR) event function provides
information about OCR activities, such as whether recognition is valid
or has completed. JAWS uses this information to determine whether to
speak and display OCR information in Braille, for comparison purposes,
etc.

Some examples of OCR event functions include:

- OCRCompletedEvent
- OCRDataInvalidatedEvent

For a complete listing of functions related to OCR events, see the
category book in the [Reference Guide.](../Reference_Guide.html)

## Code Sample

In the below code sample, the OCRCompletedEvent function is overwritten
in Notepad.jss from the function in default.jss. The overwritten
function simply adds an extra message when an OCR activity is completed
with a successful result. It is assumed that the function is being
processed in a Notepad.jss script source file and compiled in the
Notepad.jsb script binary file.

To set up the example, simply run an OCR script using the standard key
layer assignments for OCR for the current window in Notepad. The key
assignment is **JAWSKey+SPACE** followed by the letter \"o\", then by
the letter \"w\".

Note that there is no script associated with this sample in order for it
to work and provide information. This is because the function is an
event function. So it does not require that a script and key assignment
be bound to it in order to provide information or suppress it.

    Void Function OCRCompletedEvent (Int iJobID, Int iResult)
    Var
        String smsgOCRTest

    smsgOCRTest = "OCR completed successfully."

    OCRCompletedEvent (iJobID, iResult)
    If iResult
        SayMessage (ot_status, smsgOCRTest)
    EndIf
    EndFunction
