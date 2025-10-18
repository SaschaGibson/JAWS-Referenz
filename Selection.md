# Selection Functions

A Selection script or function provides or returns information about
selection activities caused by user interaction or automatically updated
by an event. JAWS uses this information to determine whether to speak
and display selection information in Braille, for comparison purposes,
and so on.

Many scripts that ship with JAWS fall into the category of selection
user interaction, such as:

- SaySelectedText
- SelectAll
- ReadWordInContext

Numerous scripts are tied to default Windows key assignments for
selecting and unselecting text so that JAWS may indicate the activity
properly. These scripts include selecting by character, word, line, from
the top or to the bottom of a file, from the beginning or to the end of
the current line - even selecting a row or column in Excel, etc. The
unit being selected or unselected is referred to as a \"selection
unit\".

However, the focus of the present discussion is on functions related to
selection that you may call from your own scripts or that you may
overwrite from those in default.jss or from the built-in functions.

Some examples of Selection functions include:

- SelectingText
- GetSelectedText
- SelectFromStartOfLine
- SelectToEndOfLine

For a complete listing of Selection functions, see the topics in this
category book of the Reference Guide.

Note that there are many functions whose names appear to be the same or
similar to those of scripts for selecting by a particular selection
unit. This is by design. Remember that scripts are bound to a key
assignment while functions are not. Therefore, it is possible to call a
function that handles selection while not calling its related script.

## Code Sample

In the below code sample, the script checks to see whether there is any
selected text. If no text is selected, JAWS indicates an error message
and the script ends. If text is selected, JAWS speaks the selected text.
furthermore, JAWS spells the selected text but only if it is not more
than the current line. You probably would not want a whole document that
is selected to be spelled out.

To set up the example, simply type some text into the Notepad document
window. Then run the script without selecting any text, and then after
selecting some text. Try selecting smaller and larger chunks of text.

It is assumed that the script is being processed in the Notepad.jss
script source file and compiled in the Notepad.jsb script binary file.

    Script MySelectionTest ()
    Var
        String sSelectedText,
        String sMsgTooMuchText

    ;Test for whether focus is in a dialog or menu, not in the document window.
    If GetObjectSubtypeCode () != wt_multiLine_edit
        Return ; Do not process.
    EndIf
    sSelectedText = GetSelectedText ()
    If sSelectedText == cscNull
        SayMessage (ot_error, cmsgNothingSelected)
        Return
    EndIf
    sMsgTooMuchText = "There is more than one line of text selected."

    If StringCompare (sSelectedText, GetLine ()) <= 0 ;The selected text is no more than the current line.
        ; The first string in the message, cmsg39_l, includes the long message to be announced.
        ; The second string parameter is only the selected text itself since there is no short message equivalent for the long message
        ; in the shipping message file, common.jsm.
        SayFormattedMessage (ot_user_requested_information,
            FormatString (cmsg39_l, sSelectedText),
            sSelectedText)
        SayUsingVoice (vctx_message, sSelectedText, ot_spell)
    Else
        SayMessage (ot_error, sMsgTooMuchText)
    EndIf
    EndScript
