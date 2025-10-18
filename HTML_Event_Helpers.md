# HTML Event Helpers

An HTML event helper function assists an HTML event that occurs in an
HTML application. Based on the information the HTML event helper
function provides or returns, JAWS determines what to speak and display
from the related event. In this case, to display information refers to
showing it in Braille.

When overriding default behavior, it is best to overwrite the most
specific function to the task. If a function has helper functions, and
if the task you want to handle is best handled by a helper function,
then overwrite the helper function. Doing so is the best way to ensure
robust script behavior, and make it less likely that any future changes
to default scripts will have a negative impact on your scripts.

Some examples of HTML Event helper functions include:

- DocumentLoadedAtFormField
- DoDefaultDocumentLoadActions
- ProcessDocumentLoadAppAlerts

For a complete listing of HTML Event helper functions, see the category
book in the [Reference Guide.](../Reference_Guide.html)

## Code Sample

In the below code sample, the DocumentLoadedAtFormField function is
overwritten in the Chrome.jss script source file from the function in
default.jss. Before the default function is called, a nonsense message
is added to speak and display in Braille under certain conditions to
illustrate how DocumentLoadedEvent uses this helper function when a new
Web page is loaded. It is assumed that the function is being compiled in
the Chrome.jsb script binary file in your root folder of the JAWS user
Settings\\(language) folder.

Note: To avoid unpredictable results, never change the files located in
any folder of the JAWS shared folder structure.

Note that there is no script associated with this sample in order for it
to work and provide information. This is because the function is an
event helper function. So it does not require that a script and key
assignment be bound to it in order to provide information for the
related event function to utilize the helper function.

    Int Function DocumentLoadedAtFormField ()
    Var
        Int iSubtype,
        String msgTestFormfield

    msgTestFormfield = "I am a formfield."

    Let iSubtype = GetObjectTypeCode()
    If iSubtype == WT_EDIT
    || iSubtype == wt_Multiline_Edit
    || iSubtype == wt_PassWordEdit
    || iSubtype == wt_EditCombo
    || iSubtype == wt_ComboBox
    || iSubtype == wt_ListBox
    || iSubtype == wt_MultiSelect_ListBox
    || iSubtype == wt_ExtendedSelect_ListBox then
        SayMessage (ot_JAWS_Message,msgTestFormfield)
    EndIf
    Return Default::DocumentLoadedAtFormfield()
    EndFunction
