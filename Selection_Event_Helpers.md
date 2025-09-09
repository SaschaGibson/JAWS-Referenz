# Selection Event Helpers

A Selection event helper function assists a Selection event that may
occur in any application or a feature of the Windows operating system.
Based on the information the Selection Event helper function provides or
returns, JAWS determines what to speak and display from the related
event In this case, to display information refers to showing it in
Braille.

When overriding default behavior, it is best to overwrite the most
specific function to the task. If a function has helper functions, and
if the task you want to handle is best handled by a helper function,
then overwrite the helper function. Doing so is the best way to ensure
robust script behavior, and make it less likely that any future changes
to default scripts will have a negative impact on your scripts.

Some examples of Selection event helper functions include:

- ProcessSelectText
- SayHighLightedText

For a complete listing of Selection event helper functions, see the
category book in the [Reference Guide.](../Reference_Guide.html)

## Code Sample

In the below code sample, the SayHighlightedText function is overwritten
in the Notepad.jss script source file from the function in default.jss.
The overwritten function spells the highlighted text in edit combo
controls when the related NewTextEvent function fires.

It is assumed that the function is being compiled in the Notepad.jsb
script binary file.

To set up the example, simply activate the Open or Save-As dialog in the
Notepad application and start typing text in the Filename edit combo
control.

Note that there is no script associated with this sample in order for it
to work and provide information. This is because the function is an
event helper function. So it does not require that a script and key
assignment be bound to it in order to provide information for the
related event function to utilize the helper function.

    Void Function SayHighLightedText (Handle hwnd, String buffer)
    SayHighLightedText (hwnd, buffer)
    If GetObjectSubtypeCode () == wt_editcombo
        SpellString (buffer)
    EndIf
    EndFunction
