# Keyword: Return

## Description

A Return statement is used to terminate execution of the function or
script in which it appears.

Use a Return statement within a function to shift control (and the value
of an expression if you provide one) to the calling function or script.
To define return values, precede the name of the function by the return
type.

Since a script cannot return a value, never follow a return statement in
a script by a value.

## Syntax

\

### Returning a Function Value

\"function type\" Function \"function name\" (\"parameter list\")

\

- \"function type\" - returns one of the following types of values to
  the calling script or function:
  - Int - an integer value.
  - String - a string value.
  - Handle - a window handle.
  - Object - an object.
  - Variant - a variant value.
  - Void - no value.

  \
- Function - the keyword, Function, must follow the function type.
- \"function name\" - the name of the function.
- \"Parameter list\" - Parameters for the function must be enclosed in
  parentheses, each one declared and separated by commas, except for the
  last one. Each parameter declaration must include its type, the
  keyword, ByRef, if it is obtained by reference when the function is
  called, and its parameter name. Required parameters must always
  precede optional ones. All parameters declared after the keyword,
  Optional, are assumed to be optional. Parameters may be declared as
  being passed by reference whether they are required or optional.

\

### Returning a Value/Expression

Return \"value/expression\"

When the Return keyword is used to shift control to a calling script or
function with a value or expression (as from a conditional statement
structure, the value and/or expression must match the function type. The
only exception to this is where the function type is Void or Variant. An
example of such a code fragment would be something like the following:

    Return (GetWindowClass (hwnd) == cwc_RichEdit20
        && GetWindowName(hwnd) == wn_MyWindowName)
    Or
    Return ( ! StringIsBlank (gsMyDlgName)
        || ! StringIsBlank (gsMyDlgText) )

## Remarks

If a Return statement is not followed by a value, its value is assumed
to be Null.

A Return statement may return the result of evaluating the expression
following it. The expression may be a simple value, or it may include a
complex series of conditional tests or function calls. No matter how
simple or complex the expression, the expression is evaluated and its
result is returned to the calling function. The expression must evaluate
to the type expected by the return statement.

## Code Samples

The following examples illustrate how the Return statement may be used
to shift control from a calling script or function, and how a Return
statement may be used to shift control from within a conditional
statement structure. although these examples are rather simplistic in
nature, they show how the syntax is applied to a real block of code.

### Assigning the Output of a Function to a Variable

When a function returns a value to the calling script or user-defined
function, you may store that value in either a local or global variable.
You can then use that variable to make decisions on what the calling
script or user-defined function should do next.

    String Function GetMyWorkPlace ()
    Return "Freedom Scientific"
    EndFunction

    Script SayMyWorkplace ()
    Var
        String sText
    Let sText = GetMyWorkplace () ; store the return value of the called function in sText.
    If sText != cscNullThen ; the function returned a value other than null or nothing.
        SayMessage (ot_Message, sText)
    EndIf
    EndScript

### Using a Function as a Parameter For Another Function

You can use the return value of one function as the parameter for
another. Using the previous example, the return value from the
user-defined function, GetMyWorkplace, may be passed directly to the
SayMessage function without storing it in a local variable first. The
only disadvantage to this approach is that the function may not retrieve
any text, causing JAWS to say nothing when the SayMessage function is
called from the script.

    String Function GetMyWorkPlace (Int iAnswer)
    If iAnswer == TRUE then
        Return "Freedom Scientific"
    Else
        Return cscNull
    EndIf
    EndFunction

    Script SayMyWorkplace ()
    Var
        Int iYes

    ; JAWS will never speak when the below function call to GetMyWorkplace is used in the SayMessage function
    ; because no value is assigned to the parameter passed to the function.
    ; Use the return value from GetMyWorkplace as the message text for SayMessage.
    SayMessage (ot_message, GetMyWorkplace (iYes))
    EndScript

    Script SayMyWorkplace ()
    ; JAWS will always speak when the below function call to GetMyWorkplace is used in the SayMessage function ;
    ; because a value is assigned to the parameter passed to the function.
    ; Use the return value from the function, GetMyWorkplace, as the message text for SayMessage.
    SayMessage (ot_message, GetMyWorkplace (TRUE))
    EndScript

### Returning Conditionally

The below sample is a very basic example of returning conditionally. The
function is a string function because the values it returns are strings.
Although you could hard-code the strings within the function as quoted
strings, it is best practice to avoid hard-coding anywhere because you
may need to use the constants elsewhere.

    Const
        sUnchecked = "unchecked",
        sChecked = "checked",
        sPartially = "partially checked"

    String Function GetStatusString (Int iState)
    If iState == 0
        Return sUnchecked
    ElIf iState == 1
        Return sChecked
    ElIf iState == 2
        Return sPpartially
    EndIf
    Return cscNull ; "", that is, nothing.
    EndFunction

### Returning from a Script

The Return statement in the below nonsense script ensures that
processing stops when the script is performed from within an active
dialog. Otherwise, the confirming message that you are not in a dialog
is processed and spoken if the script is performed outside of an active
dialog.

    Script MyDialogTest ()
    Var
        String smsgNoDialog

    Let smsgNoDialog = "not in a dialog"
    If DialogActive () then ; built-in function that test for whether a dialog is active.
        Return ; do not continue processing at all; a dialog is active.
    EndIf
    ; Only process this if not in a dialog.
    SayMessage (ot_message,smsgNoDialog)
    EndScript
