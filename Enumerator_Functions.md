# Enumerator Functions

The purpose of an enumerator function is to call a callback function,
which may process the window optionally, and either stop or continue the
enumeration, depending on what the callback function tests and returns.
There are several built-in enumerator functions that ship with JAWS.
Only a couple are shown below with brief descriptions. But we also
include a code sample to show how an enumeration function may be
implemented.

For a complete list of enumerator functions, see [Reference
Guide.](../Reference_Guide.html)

## Example 1: EnumerateChildWindows

\

### Description

This function calls a specified function for each child of the starting
window. You must define it as an integer function with a handle
parameter.

### Syntax

EnumerateChildWindows (hWnd, FunctionCallback)

- hWnd is the handle of the window from which to start enumeration.
- FunctionCallback is a string containing the name of the function to
  call for each child window.

\

### Returns

Returns an integer value of true if the enumeration completes.

Returns an integer value of false if the enumeration terminates when the
callback function returns false for a window.

## Example 2: EnumerateTypeAndTextStringsForWindow

\

### Description

This function obtains information about each control using MSAA. The
order in which items are enumerated is dictated by how they appear in
the MSAA hierarchy. The callback function takes the following
parameters: Int typeCode, Int stateCode, String name, String value,
String Description. If the callback function returns 0, the enumeration
stops. If it returns 1, the enumeration continues.

### Syntax

EnumerateTypeAndTextStringsForWindow (hWnd, CallbackName)

- hWnd is the handle of the window containing the controls to be
  enumerated.
- CallbackName is a string containing the name of the function to call
  for each control.

\

### Returns

Returns an integer value for the number of controls enumerated.

## Code Sample

The below nonsense code sample checks any dialog in Notepad for the Open
button. if the Open button is not found in the active dialog, the JAWS
indicates an error message. if the Open button is found, the JAWS
indicates that it found it.

Notice that the constants declared for the messages include a
replaceable parameter %1 symbol. This is for use with the FormatString
function in order to control part of the message depending on the item
you wish to place into the message.

Finally, notice the use of the gbNotFound flag. If the error message for
not finding the Open button were part of the callback function, then the
JAWS would indicate the error message repeatedly as the callback
function continues to search for the Open button. By using the flag, it
is the script that determines whether to indicate the error message.

    Const
        sOpenBtn= "Open", ;Open button in Open dialog
        sOpenDlg = "Open", ; real window name of Open dialog
        fn_LookForOpenButton = "LookForOpenButton", ; callback function name
        smsgFound = "I found the %1 button.",
        smsgNotFound = "I can't find the %1 button."

    Globals
        Int gbNotFound ; for the script to determine whether to speak the error message.

    Int Function LookForOpenButton (Int iType, Int nState, String sName, String sValue, String sDescription)
    ;This is the callback function for the EnumerateTypeAndTextForWindow test in the below script.
    If iType == wt_button
    && sName == sOpenBtn
        SayFormattedMessage (ot_JAWS_message, FormatString(smsgFound,sName))
        gbNotFound = FALSE
        Return FALSE ; Stop looking.
    Else
        gbNotFound = TRUE
        Return TRUE ; Keep looking.
    EndIf
    EndFunction

    Script MyTest ()
    Var
        Handle hReal
    hReal = GetRealWindow (GetFocus())
    If DialogActive ()
        EnumerateTypeAndTextStringsForWindow (hReal, fn_LookForOpenButton)
    EndIf
    If gbNotFound then
        gbNotFound = !gbNotFound ; Reverse the flag.
        SayFormattedMessage (ot_error, FormatString(smsgNotFound,sOpenBtn))
    EndIf
    EndScript
