# Calling Scripts and Functions

The Freedom Scientific Scripting language supports many ways to call
scripts and functions. This summary includes general descriptions and
definitions of the more commonly used methods for calling scripts and
functions, as well as a few code samples illustrating how to call them.

## Script versus Function

Scripts and functions are standard blocks of code that govern JAWS
behavior. A script is a block of code that may be tied to a keystroke or
key combination the user must press in order for the script to execute.
A script includes numerous steps that JAWS should perform on demand if
the user presses the keystroke or key combination bound to the script.

On the other hand, a function is not performed based on the user
pressing a particular keystroke or key combination. Rather, it is called
by various means: by a script, by another function, or as a result of a
system event. A function can return information after completing the
steps within it. A script cannot return information, although both a
script and a function can shift control to a different block of code.
Additionally, a function may accept data from a calling script or
function via parameters, and it may return a value to a calling script
or function.

There are three types of functions:

- Event - performed by JAWS automatically when Windows events occur.
  Without event functions, JAWS cannot speak and/or display in Braille
  any system changes automatically. JAWS recognizes many system events
  that have corresponding functions in the Freedom Scientific scripts
  where behavior is defined for these events. You cannot create new
  event functions of these types yourself. But if an application exposes
  events through a COM object, you can write new script functions that
  attach to the object for events, and that run when the application
  events occur. Use the function, ComAttachEvents, to attach functions
  to exposed COM events, and use the function, ComDetachEvents, to
  detach them.

  Additionally, with caution, you may overwrite existing default event
  functions, and you may create application-specific versions of default
  event functions. For more details on working with event functions, see
  [Events.](Events.html)

- Built-in and Default Functions - an ever-growing list of built-in and
  default functions exposed to the Freedom Scientific Scripting
  language. These functions ship with JAWS and are used in the shipping
  code both in default and application-specific script files. With
  caution, you may use these functions to create and/or modify your own
  custom script sets. The built-in and default functions are the
  building blocks of your scripts and functions. For a complete listing
  of built-in and default functions, see all the category books and
  their summaries in the JAWS [Reference Guide.](Reference_Guide.html)

- User-Defined Functions - developed either by Freedom Scientific script
  developers or by an independent script developer. Typically, they are
  created for an application the shipping version of JAWS does not
  support, and/or to enhance an application that JAWS does support. As
  with built-in and default functions, you may modify and overwrite
  user-defined functions, and call them from a script or from another
  function.

## Hierarchy of Rules for Calling Scripts and Functions

JAWS performs functions based on their names and locations within the
hierarchy of the script files that ship with the product, as well as
script files located in your user settings\\(language) folder. The rules
for processing scripts and functions are as follows:

1.  Each time a function is called from within a script or another
    function, JAWS searches the application-specific script file first,
    assuming the application has focus. The application may have layered
    script files, and so the search starts at the top-most application
    script file and searches down through any script files linked
    through the Use statement. If the function is contained within the
    application-specific script file, then JAWS performs the function
    and stops processing.
2.  When JAWS does not find the function in the application-specific
    script file or files linked to it through the Use statement, then
    JAWS searches the default script file. If JAWS finds the function in
    the default script file, then JAWS performs the function and stops
    processing.
3.  When JAWS does not find the function in the default script file,
    then JAWS searches the list of built-in and default functions. If
    JAWS finds the function, then JAWS performs the function and stops
    processing.
4.  When JAWS does not find the function in the built-in and default
    functions, then JAWS announces, \"unknown function call to\",
    followed by the name of the function. JAWS then spells out the name
    of the unknown function. This error message warns you that the
    function JAWS tried to call may have a name that is misspelled, the
    function may have been deleted, or the function may not have been
    written.

For example, supposed you overwrite the SayLine script in your
application-specific script file because processing for how the current
line is spoken should be handled differently in your application from
the way that the default JAWS functionality processes this script. Of
course, the default version of the SayLine script still exists in the
default script file. As long as your application has the focus, JAWS
performs your overwritten SayLine script found in your
application-specific script file rather than the default SayLine script
found in the default script file.

## Types of Parameters

Although scripts may receive parameters, they are almost never coded to
do so. If you code a script to receive parameters, you may pass specific
values to its parameters by use of key map files.

Functions may take parameters, and in fact, typically do so. parameters
may be required or optional, and they may be passed by reference or not.

Parameters may be required or optional. If a parameter is optional, you
must precede its declaration in the parameter list by the keyword,
Optional. All subsequent parameters in the parameter list are also
optional. So you only need to utilize the keyword, Optional, once in the
parameter list. All parameters are required unless you use the keyword,
Optional, and all parameters preceding the keyword, Optional, are
required.

Whether a parameter is required or optional, it may be passed by
reference or not. If you specify a non-aggregate parameter in a
parameter list with the keyword, ByRef, the variable is passed by
reference. This means that the variable is updated by any changes it
receives when the function is called, and those changes are retained
when the function is exited.

By contrast to non-aggregate variables, collections and arrays are
automatically passed by reference. therefore, the keyword, ByRef, is not
required when you declare collections and arrays as parameters.

If a function receives a non-aggregate variable that you have not
specified as being ByRef, the variable receives a copy of the variable
rather than a pointer reference to it. Therefore, any changes to the
variable made in the function are discarded when the function exits.

### Examples of Parameter Lists for Functions

\

- Required - passed to the function when it is called. the syntax is
  parameter type followed by parameter name.\
  \

          String sMyName

  \

- Optional - passed to the function when it is called. The syntax is the
  keyword, Optional followed by parameter type followed by parameter
  name or names\

          Optional String sMyName
          or
          Optional String sFirstName, String sMyLastName, Int iAge

  \

- ByRef - passed by the function when it is called rather than to it.
  The syntax is parameter type followed by the keyword, ByRef followed
  by parameter name\
  \

          String ByRef sMyName

  \
  \
  Note: When a function is declared with by reference parameters, those
  parameters must be included in any calls to that function.\
  \

## Return Statements

A Return statement gives you great flexibility over how to call scripts
and functions. A Return statement is used to terminate execution of the
script or function in which it appears, and to shift control (and the
value of an expression if you provide one) to the calling script or
function. But since a script cannot return a value, never follow a
return statement in a script by a value.

For more details on working with Return statements, see the topic in the
Control Flow book at [Return
Statements.](Control_Flow/Return_Function.html)

## Postponing Processing within a Script or Function

When you need to give time for a system event to catch up to your script
or function, you may need to direct your script or function to wait
before it continues processing. It all depends on what event you need to
complete processing, how much control you need over the wait time, and
how you wish JAWS to behave after that event completes. Available
methods in the Scripting language include:

- Pause - waits for other tasks to complete.
- Delay - waits for focus and new text events to complete with a timed
  delay you control and optionally by suppression of checking on whether
  those events have completed.
- ScheduleFunction and UnscheduleFunction - ScheduleFunction Tells the
  script to schedule a function to run in a set amount of time, then
  continue processing the currently running function while waiting on
  the scheduled function to run. You may use UnscheduleFunction to
  cancel a scheduled function.
- QueueFunction - waits to perform a function passed to it after JAWS
  has stopped speaking. You may queue more than one function to be
  performed in order.
- ScheduleFunctionAfterWindowGainsFocus - allows you to call a function
  after a specified window gains focus. The last parameter lets you set
  a timeout period for how long to wait before unscheduling the call.
- SetFocusToWindowAndScheduleFunction - allows you to set focus to a
  particular window after a specified window gains focus. The last
  parameter lets you set a timeout period for how long to wait before
  unscheduling the call.

### Pause and Delay

Pause and Delay statements allow you to postpone execution of succeeding
statements in your scripts and functions. Pause gives you the least
control but may be all you need in order to accomplish your goal. Delay
gives you more control, and allows you to specify how long to postpone
processing, depending on whether focus and new text changes have
completed.

For more details on working with Pause and Delay statements, see [Pause
and Delay.](Calling_Scripts_and_Functions/Pause_and_Delay.html)

### Scheduling Functions

Scheduling functions give you the most control over postponing
processing of succeeding statements in your scripts and functions. As
with delay statements, these types of function calls let you control the
time to wait. But they also let you specify the process that must
complete in order for succeeding statements to continue processing in
your own scripts and functions. As mentioned above, there are several
types of scheduling functions.

For more details on working with scheduling functions, see [Scheduling
Functions.](Calling_Scripts_and_Functions/Scheduling_Functions.html)

### Enumerator Function Calls

Enumerator functions call a callback function, which in turn may process
the window optionally, and either stop or continue the enumeration
depending on what the callback function tests and returns. For more
details on working with enumerator functions, see [Enumerator
Functions.](Calling_Scripts_and_functions/Enumerator_Functions.html)

## Customizing Scripts and Functions from Default and Built-in Code

When you want to customize your own script files, or when you want to
personalize the script sets that ship with JAWS, there are numerous
methods you can use. You may create your own user-defined scripts and
functions in your own script sets that do not ship with JAWS. but you
may also customize existing code by modifying scripts and functions.

Choose your method for customizing your scripts and functions depending
on what you need to accomplish: Are you customizing for your own needs
in an application already supported by JAWS, or are you creating your
own script set for an application JAWS does not support? Are you
customizing an existing script or function for a specific application,
or do you mean to affect JAWS behavior across all applications? How you
code your customized scripts and functions may have very unpredictable
results, or it may be a very powerful enhancement. It all depends on
careful planning and cautious coding. We always recommend that you back
up any code that ships with JAWS before customizing any code directly.
Below are some methods for customizing scripts and functions.

### MyExtensions

Script binary file stacking does not allow for events in the JAWS script
source file (default.jss) to be overwritten in script binary files that
are used by the default script binary file (default.jsb). Therefore,
MyExtensions.jss and its resulting binary file, MyExtensions.jsb, are
intended for you to add custom scripts and functions to the Freedom
Scientific default scripts and functions, rather than for you to
overwrite default scripts and functions.

You may generate a user default.jsb in the JAWS root folder
settings\\(language) folder. This default.jsb, compiled from its own
default.jss script source file, utilizes the shared default.jsb that
ships with the Freedom Scientific JAWS. In other words, it is in the
user default.jss file that you should overwrite default scripts and
functions.

**CAUTION:** Make sure that default.jss in the user area calls the one
in the shared area by including a use statement for default.jsb. If this
Use statement is missing, you will experience catastrophic failure when
JAWS attempts to run any scripts that are in the shared default script
file but not in the user default script file. Be sure that your script
or function in the User default file calls the version in the shared
default file where you want to defer to the default behavior of the
script or function.

MyExtensions.jss and MyExtensions.jsb ship with JAWS. These files are
located in the JAWS root folder of the shared settings\\(language)
folder. Once you compile the MyExtensions.jss file, thus creating a
MyExtensions.jsb file, JAWS places these custom script source and binary
files in the user settings\\(language) folder.

Note: This assumes that you are using Script Manager to compile. If you
elect to use your own text editor, you must ensure that you compile to
the correct folder, or copy the files there manually.

MyExtensions.jss contains the following commented-out sections to help
you understand the types of code blocks such a file expects:

- The script source file begins with the typical Include statements that
  any script source file should have to ensure code integrity during
  compilation with the default JAWS scripts and functions. These are as
  follows:
  - Include \"hjConst.jsh\"
  - Include \"hjGlobal.jsh\"
  - Include \"common.jsm\"
  - Any other Include statements of header files specific to your own
    script set.
- In order not to have to re-install your own script sets after JAWS
  automatic updates, place any additional use statements for your custom
  script binary files below any other \"Include\" statements of header
  files specific to your script set.
- By default, JAWS 13 processed a literal full string match when the ==
  operator was used on strings. The ;#Pragma line can allow the ==
  operator to work as it did prior to JAWS 13, which was a partial
  comparison. If you need the == and != operators to work with partial
  comparisons only, add the appropriate statement below your use and
  Include statements. For more details on working with ;#Pragma
  StringComparison statements, see [;#Pragma StringComparison
  Directive.](Compiler_Directive/Pragma_StringComparison_directive.html)
- Next are two functions that are necessary and run every time your
  script set loads and unloads. Use AutoStartEvent to obtain or
  construct object pointers or other flags or globals you need to
  initialize when your script set loads. Use AutoFinishEvent to destruct
  or unload your objects, or nullify any other flags or globals.
- Add your own user-defined scripts and functions, and compile to create
  your own MyExtensions.jsb in your user settings\\(language) folder.

### Overwriting Default Scripts and Functions

The fundamental reason for overwriting a script or function JAWS already
provides is that you want that script or function to behave differently
from JAWS behavior for some special circumstance of your own. It may be
for something specific to a script set you are writing for an
application JAWS does not support. Or it may be for an application JAWS
does support but for which you want a different behavior from JAWS
default behavior.

A safe method for overwriting scripts and functions includes the use of
several key function calls that ensure the default scripts and functions
still work as expected. Some common function calls that you may use
include:

- PerformScript
- CallScriptByName
- CallFunctionByName

### Using Scope to Redirect Function Calls

A very safe method for ensuring that a function call to an overwritten
function is made only when you want it to be made employs the scope
capabilities of the Scripting language to redirect from where the
function should be processed. the syntax of scope is to use the name of
the script source file where the function code is located, followed by
two colons (::) and then by the name of the function as you would
normally call it. for example, to call FocusChangedEvent and make sure
that it is the one from the default script source file that is actually
called, you write:\

    Default::FocusChangedEvent (hwndFocus, hwndPrevFocus)

\
from within your own code in your script source file.

For more details on working with how to redirect function calls, see
[Redirecting Function Calls Using
Scope.](Calling_Scripts_and_Functions/Redirecting_functions.html)

## Code Samples

Below are some code samples for the various types of script and function
calls described in this summary.

### Function with Optional Parameters Code Sample

The below code sample declares the String parameter as a required
parameter but the Integer parameter as optional.

    Const
        sName1 = "Mary",
        sName2 = "John",
        iAccount1 = 12345,
        iAccount2 = 54321

    Void Function SpeakNames (String sMyName, Optional Int iAccountNumber)
    Var
        String smsgMyNameIs

    smsgMyNameIs = "My name is "
    SayMessage (Ot_JAWS_message,smsgMyNameIs+sMyName)
    If iAccountNumber then
        SayInteger (iAccountNumber)
    EndIf
    EndFunction

    Script MyNameTest ()
    SpeakNames (sName1) ;omits the optional parameter, just says "My name is Mary".
    SpeakNames (sName2, iAccount2) ; speak both required and optional parameters.
    EndScript

### Function with By Reference Parameters Code Sample

The below code sample provides the integer parameter by reference.

    Const
        sName1 = "Mary",
        sName2 = "John",
        iAccount1 = 12345,
        iAccount2 = 54321

    Void Function SpeakNames (String sMyName, Int ByRef iAccountNumber)
    Var
        String smsgMyNameIs

    smsgMyNameIs = "My name is "
    SayMessage (Ot_JAWS_message,smsgMyNameIs+sMyName)
    If sMyName == sName1 then
        iAccountNumber = iAccount1
    ElIf sMyName == sName2 then
        iAccountNumber = iAccount2
    Else
        iAccountNumber = 0
    EndIf
    EndFunction

    Script MyNameTest ()
    Var
        Int iNum
    ; Any non-aggrigate variable declared in the function parameter list as ByRef is received by the function as being by reference.
    ; This means that the function knows where the variable is stored in memory and can change it.
    ; The function has the ability to change the variable, whether or not it actually does so.
    ; Any non-aggrigate variable received by a function receives only a copy of the variable, and any changes made to the variable do not persist when the function is exited.

    SpeakNames (sName1, iNum)
    SayInteger (iNum)
    SpeakNames (sName2, iNum)
    SayInteger (iNum)
    SpeakNames (cscNull, iNum) .
    SayInteger (iNum)
    EndScript

### PerformScript Code Sample

The PerformScript keyword must be followed by a defined script name. For
example, if you write:\
SayLine (),\
you are calling the function. But if you write:\
PerformScript SayLine(),\
you are calling the script SayLine (), as if you had pressed the
keystroke bound to that script.

    Script SayLine ()
    If MyConditions then ;whatever your special conditions are in your user-defined MyConditions function...
        DoMyFunction ; do whatever it is you want, like spell the line instead of speaking it in your DoMyFunction call.
        Return
    EndIf
    PerformScript SayLine () ; Call the default SayLine script bound to the keystroke, Insert+UpArrow.
    EndScript

### CallScriptByName Code Sample

A function call to PerformScriptByName lets you call dynamically a
script whose name is passed as the first parameter. In other words, the
script name does not need to be known during compilation, and the script
name can be passed to the function as a variable. The function returns
Void (no value). It takes as its first parameter a string representing
the name of the script to be run. then optionally, it takes up to nine
variant script parameters.

The below nonsense sample for a supported browser for a Web site that
has multiple headings checks to see if the current line is blank. If it
is, then the script calls the MoveToNextHeading script to jump to the
next heading level 2 on the page.

    Script MySayLine ()
    If StringIsBlank (GetLine () ) then
        PerformScriptByName ("MoveToNextHeadingLevelN",2)
        Return
    EndIf
    PerformScript SayLine () ; current line is not blank.
    EndScript

### CallFunctionByName Code Sample

A function call to CallFunctionByName lets you call dynamically a
function whose name is passed as the first parameter. In other words,
the function name does not need to be known during compilation, and the
function name can be passed to the function as a variable. The function
returns Void (no value). It takes as its first parameter a string
representing the name of the function to be run. then optionally, it
takes up to nine variant parameters.

Note: Using CallFunctionByName bypasses checking parameter types that is
processed when a function is invoked normally. The Return type is the
same as that of the function being called.

The below code sample spells out the word at the cursor from within
Notepad. although simply calling SpellString will do the same thing,
this is simply to illustrate the syntax of how to use
CallFunctionByName.

    Script MyTest ()
    If ! StringIsBlank (GetLine ()) then
        CallFunctionByName ("SpellString",getWord())
        Return
    EndIf
    SayLine() ; The line is blank.
    EndScript
