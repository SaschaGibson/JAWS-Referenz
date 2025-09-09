# Optical Character Recognition Functions

An Optical Character Recognition (OCR) function provides or returns
information about OCR activities specifically in JAWS. JAWS uses this
information to determine whether to speak and display anything in
Braille, for comparison purposes, and so on.

Some examples of OCR functions include:

- CancelOCR
- CanRecognize
- GetOCRLanguages

For a complete listing of OCR functions, see the topics in this category
book of the Reference Guide.

## Code Sample

In the below code sample, the CanRecognize function is called from a
script to confirm whether it is possible to recognize any text in a
given area of the Notepad application. To set up the example for
testing, simply run the script from within Notepad with the PC, JAWS, or
Invisible cursor located at various points within the Notepad
application, whether a menu or dialog is on screen or even if there is
no text in the main document window.

    Script MyOCRTest ()
    Var
        String sOCRStatus

    sOCRStatus = "Yes, I can recognize any text in this screen area."

    If CanRecognize () == OCR_Success
        SayMessage (ot_status, sOCRStatus)
    EndIf
    EndScript
