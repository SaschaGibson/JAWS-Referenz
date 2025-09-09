# 12.3 User Defined Functions

In cases where built-in functions don\'t perform the task you need, you
can create your own functions. These types of functions are called
\"user-defined\" functions. Unlike built-in functions, any script
developer can modify the contents of a user-defined function.

You create user-defined functions within your script file using the same
methods you would when creating a script. However, the New Script dialog
changes its contents when you create your function. Instead of prompting
you for a keystroke to assign to the function, the New script dialog
prompts you for a return type and description. For more information on
the New Script dialog, see section [5.2 The New Script
Dialog](05-2_TheNewScriptDialog.htm).

## Basic User-Defined Functions

The simplest form of a user-defined function is one that does not
require any parameters to complete its task. These same functions also
do not return any values to the calling script or user-defined function.
This type of function is often referred to as a \"void\" function.

When you create this type of user-defined function, you need only use
the General Page of the New Script multi-page dialog. After you add the
name, synopsis, description and category for the function, you should
select the \"void\" return type from the Function Returns edit combo
box. This return type tells JAWS that the function does not return any
information to the calling script or function.

When you create a function that does not require any parameters or
return any values, the script Manager inserts the following beginning
line of the function into your script file:

Void Function MyFunction ()

The key word \"void\" preceding the key word \"Function\" indicates the
function does not return anything to the calling script or user-defined
function. The empty pair of parentheses following the function name
indicate the function does not require any information to perform its
task. An example of a function that does not require any parameters or
return a value follows:

void Function GeneralJAWSHotKeys ()\
If UserBufferIsActive () then\
UserBufferDeactivate ()\
EndIf\
SayFormattedMessage (OT_USER_BUFFER, cmsgHotKeyHelp1_L,
cmsgHotKeyHelp1_S)\
EndFunction

You can find this function in the Default.jss script source file. The
HotKeyHelp script calls this function to display a list of JAWS hot keys
in the virtual viewer. Since the function only displays information, it
does not require any data from the calling script to perform its task.
When the function finishes, it does not return anything to the calling
script.

## Functions with Parameters

When you create a user-defined function, your goal is to be able to call
this function from a variety of scripts and other user-defined
functions. In order for the function to determine what it should do, you
may need to pass some information to the function.

Just like the built-in functions discussed earlier in this chapter,
user-defined functions can accept parameters. A parameter is a piece of
information that is passed to a function to allow it to complete its
task. A parameter can be any one of the four data types: handle,
integer, object, or string. See [7.0 Using Variables and
Constants](07-0_UsingVariablesAndConstants.htm), for more information on
available variable types.

You use the New Script dialog to create parameters for your user-defined
functions. After you have added all the necessary function information
in the General page, press **CTRL+TAB** to move to the parameters page.
When you first enter this page, the focus is placed in the existing
Parameters list box. This list box displays all existing parameters for
the function. This list box is empty when you create your new function
but may be populated with information for an existing function.

To add parameters to a function, perform the following:

1.  Press **TAB** to move from the Existing Parameters list box to the
    New Parameter edit box.
2.  Give the parameter a meaningful name. Follow the same rules for
    naming parameters as you do for naming variables. You should use
    Hungarian notation to denote the type of parameter. You should also
    avoid using spaces or any punctuation marks other than an underline
    (\_) characters. For example, you could give a string parameter the
    name of sName as it stores a string value containing a name. See
    [7.0 Using Variables and
    Constants](07-0_UsingVariablesAndConstants.htm) for more
    information.
3.  Press **TAB** to move to the By Reference check box. Leave this
    check box cleared as this allows for a one-way data exchange between
    the calling script or user-defined function and your new function.
4.  Press **TAB** to move to the Parameter Description edit box. Type a
    meaningful description in this edit box as this is used by the
    Script Manager when you insert the function into a script.
5.  Press **TAB** to move to the available Types combo box. Select the
    appropriate type for the parameter. For example, the sName parameter
    discussed above would have a type of string.
6.  Press **TAB** to move to the Add Parameter button. Press
    **SPACEBAR** to activate this button. After you activate this
    button, the Script Manager returns the focus to the New Parameter
    edit box in preparation for the addition of another parameter.

After you have finished adding all necessary parameters, press **TAB**
until you reach the OK button. Press **SPACEBAR** to activate the button
and the Script Manager inserts the new function into your script file.
When you declare a parameter using the New Script dialog, the Script
Manager places the type and name of the parameter between the
parentheses following the function name. An example of a beginning line
of a function that uses a single string parameter follows:

Void Function MyFunction (string sParameter)

In the line above, the parameter, sParameter, and its type, string, are
placed between the parentheses. As you add statements to your function
to perform the given task, you refer to the parameter using the name
that appears between the parentheses. Using the example shown above, you
would refer to sParameter within the body of the function any time you
want to determine the value it contains just as you would if it were
declared as a local variable.

An example of a function from the default script file using a single
parameter follows:

Void Function InitializeGlobalVoiceSettings (int iParamToSet)\
If iParamToSet == V_RATE then\
let GlobalPcRate = GetVoiceRate (VCTX_PCCURSOR)\
let GlobalJawsRate = GetVoiceRate (VCTX_JAWSCURSOR)\
let GlobalKeyboardRate = GetVoiceRate (VCTX_KEYBOARD)\
let GlobalMessageRate = GetVoiceRate (VCTX_MESSAGE)\
ElIf iParamToSet == V_VOLUME then\
let GlobalPcVolume = GetVoiceVolume (VCTX_PCCURSOR)\
let GlobalJawsVolume = GetVoiceVolume (VCTX_JAWSCURSOR)\
let GlobalKeyboardVolume = GetVoiceVolume (VCTX_KEYBOARD)\
let GlobalMessageVolume = GetVoiceVolume (VCTX_MESSAGE)\
ElIf iParamToSet == V_PITCH then\
let GlobalPcPitch = GetVoicePitch (VCTX_PCCURSOR)\
let GlobalJawsPitch = GetVoicePitch (VCTX_JAWSCURSOR)\
let GlobalKeyboardPitch = GetVoicePitch (VCTX_KEYBOARD)\
let GlobalMessagePitch = GetVoicePitch (VCTX_MESSAGE)\
endIf\
EndFunction

In the function shown above, the iParamToSet parameter contains the
value used to determine the set of global variables to be initialized.
Since the speech characteristic can be different each time the function
is called, a parameter of type integer was used. The If statement
contained within the function determines which speech characteristic
should have its corresponding global variables initialized. Notice that
the parameter is referred to just as if it had been declared as a local
variable within the body of the function.

When you declare multiple parameters, the Script Manager places a comma
after each parameter declaration except for the last in the list.
Essentially, a list of parameters is identical to a list of local or
global declarations in that each declaration is followed by a comma
except for the last. The only difference is that you do not use the key
words \"Var\" or \"Globals\" to begin the parameter declarations.
Instead, a pair of parentheses surrounds the parameters in the beginning
line of the function. An example of a function beginning line containing
multiple parameters follows:

Void Function MyFunction (string sParameter1, string sParameter2, string
sParameter3)

In the example above, the Script Manager inserted a comma after the
first and second parameter declarations, but not the third. The
following function beginning lines are taken from the default script
file and use multiple parameters to perform their tasks:

Void Function DoCustomHighlightColors (string strForeground, string
strBackground, string sApp)

void Function KeyboardHelpHook (string ScriptName, string FrameName)

void Function ProcessSelectText(int nAttributes,string buffer)

 

  ---------------------------------------------------------- -- -----------------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](12-4_FunctionsThatReturnValues.htm){accesskey="x"}
  ---------------------------------------------------------- -- -----------------------------------------------------------
