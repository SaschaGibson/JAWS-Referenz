# Keywords and Non-Required Keywords

The Freedom Scientific Scripting language supports the use of many
keywords. But not all are required. Below is a listing of required and
non-required keywords you may use in your scripts and functions.

## Required Keywords

The below list of required keywords are reserved for use by the
Scripting language and cannot be used as variable names, function names,
or script names. The list is broken out into areas of usage in level 3
headings and the keywords themselves in level 4 headings within the
level 3 headings. Links direct you to relevant summary pages or overview
pages for a more in-depth discussion of complex concepts.

- [Keywords for Functions and
  Scripts](#Keywords%20for%20Functions%20and%20Scripts){#li_Keywords for Functions and Scripts}
- [Keywords for Control
  Flow](#Keywords%20for%20Control%20Flow){#li_Keywords for Control Flow}
- [Keywords for Variables and
  Constants](#Keywords%20for%20Variables%20and%20Constants){#li_Keywords for Variables and Constants}
- [Keywords for Compiler
  Directives](#Keywords%20for%20Compiler%20Directives){#li_Keywords for Compiler Directives}

\
[]{#Keywords for Functions and Scripts}

### Keywords for Functions and Scripts

The keywords in this section are for function and script code blocks.
For more details on how to utilize Return statements, parameters, and
function types, see [Calling Scripts and
Functions.](./Calling_Scripts_and_Functions.html)

#### Function and EndFunction

Begins and terminates the definition of an individual function, whether
it is a built-in, default, or user-defined function. Each function must
begin and terminate with the keywords, Function and EndFunction.

When you use the Script Manager\'s \"New Script\" dialog to create a
user-defined function, the Script Manager automatically places the
keywords, Function and EndFunction into your file, separated by several
blank lines for you to fill with your source code. But if you check the
control in the dialog that refers to assigning a keystroke, the Script
Manager automatically changes the keywords placed into your file to
Script and EndScript. (See below.)

You may need to precede the Function keyword by the return type of the
function. The name of the function is followed by a parameter list,
whether those parameters are required or optional, and parameters that
must be passed to the function by reference. The parameter list is
enclosed in parentheses. For example a function might be called
something like:

    Void Function SpeakNames(String sMyName)

#### Script and EndScript

Begins and terminates the definition of an individual script, whether it
is a default script or a user-defined script. Each script must begin and
terminate with the keywords, Script and EndScript.

When you use the Script Manager\'s \"New Script\" dialog to create a
user-defined script, the Script Manager automatically places the
keywords, Script and EndScript, along with several blank lines into your
file for you to fill in your source code. But if you uncheck the control
in the dialog that refers to assigning a keystroke, the Script Manager
automatically changes the keywords placed into your file to Function and
EndFunction. (See above.)

The keyword, Script, must be followed by the name of the script and end
with opening and closing parentheses. If using the Script manager \"New
Script\" dialog, the Script manager automatically does this for you.
Scripts can take parameters in a very specific format and manner,
although most of the time they do not. For example, the following
statement is valid:

    Script MyTestScript ()

But the following statement is in an invalid format for declaring a
script or a function with parameters:

    Script MyTestScript ("hello")

#### Return

Terminates execution of the script or function in which it appears. When
used to return a particular value from within a function, add the
information to be returned immediately after the Return keyword in the
format the calling script or function expects. Doing so shifts control,
along with any value, to the calling script or function.

Since a script cannot return values, using the Return keyword within a
script terminates the script at the point the keyword is used.

For more details on how to utilize Return statements, see [Return
Statements.](.\Calling_Scripts_and_Functions\return_function.html)

#### Optional

Used to declare optional function parameters in a parameter list. All
parameters you declare after the keyword, Optional, are assumed to be
Optional parameters. For example, the following statement shows that the
first parameter of the function is required when calling the function
but the second is not:

    Function SpeakNames (String sMyName, Optional Int iMyAccountNumber)

#### ByRef

Used to declare that a parameter is to be passed by reference in a
function. The following example shows that the parameter is to be passed
by reference when the function is called rather than a copy being passed
to the function when the function is called:

    Function SpeakNames (String ByRef sMyName)

It is possible to list parameters such that some are passed by reference
and some are not, regardless of whether the parameters are required or
optional. The following example shows that a copy of the string is
passed to the function, but the account number is passed by reference
when the function is called: Function SpeakNames (String sMyName, Int
ByRef iAccountNumber)

[Back to list of Required Keywords for Functions and
Scripts](#li_Keywords%20for%20Functions%20and%20Scripts)\
[]{#Keywords for Control Flow}

### Keywords for Control Flow

For more details on working with conditional statement structures and
looping functions, see the following:

- [Control Flow](./Control_Flow.html)
- [Conditional statement
  Structures](./Control_Flow/Conditional_statement_Structures.html)
- [Looping Functions](./Control_Flow/Looping_functions.html)

#### If, ElIf, Else, and EndIf

Used to create one form of a conditional control-flow code statement
structure. The keywords, If and EndIf, are required to begin and
terminate the statement structure. But unless more than one condition is
being tested, ElIf, and Else are not necessary for an If-EndIf statement
structure to be processed. The keyword, Then, is optional. (See the
section on Non-Required Keywords below).

The ElIf keyword is an optional part of an If-EndIf statement structure.
It allows you to create a second conditional branch in an If-EndIf
statement structure. As with the If condition in the first branch, when
the ElIf condition evaluates to true, the screen reader performs any
statements following it.

The Else keyword is an optional part of an If-EndIf statement structure.
It allows you to create another conditional branch that is processed
only when any preceding conditions in theIf-EndIf statement structure
have evaluated to false.

A completely formulated If-EndIf statement structure looks like the
following sample:

    If (My condition1) then
        ; process Statements
    ElIf (My next condition) then
        ; process statements
    ; further ElIf conditions if needed...
        ;process statements for each ElIf condition
    Else
        ; process statement when all above conditions are false.
    EndIf

#### For, To, Descending, EndFor

The keyword, For, begins the For loop statement structure, and the
keyword, EndFor, terminates the block. The keyword, To, is required. But
the keyword, Descending, is required only to iterate in descending
order.

Following the keyword, For, in the For loop statement block, you must
have a statement that dictates how many times the loop should execute.
As long as the condition in the For part of the statement block
evaluates to TRUE, the loop continues processing any statements placed
within the loop. When the condition becomes FALSE, the loop terminates.
But the loop statement block must terminate with the keyword, EndFor, in
order to compile properly.

#### ForEach, In, EndForEach

The keyword, ForEach, begins the ForEach loop statement structure, and
the keyword, EndForEach terminates the statement block. The keyword, In,
specifies which structure to process.

Following the keyword, ForEach, you must have a statement that dictates
the structure whose items are to be processed. Any statements placed
within the loop are processed for every item in the structure named in
the ForEach part of the statement. The loop statement structure must
terminate with the EndForEach keyword in order to compile properly.

#### While-EndWhile

Begins and terminates the While loop statement structure. A While loop
must begin and terminate with the keywords, While and EndWhile.

The While keyword begins the While loop statement structure. It must be
followed by a conditional statement that is evaluated each time the loop
is repeated. As long as the condition in the While statement structure
evaluates to true, the loop continues processing any statements placed
within the loop. When the condition becomes false, the loop terminates.
But the loop statement structure must terminate with the EndWhile
keyword in order to compile properly.

\
[Back to list of Required Keywords for Control
Flow](#li_Keywords%20for%20Control%20Flow)
[]{#Keywords for Variables and Constants}

### Keywords for Variables and Constants

For more details on working with variables and constants, see the
following:

- [Variables and Constants](./Variables_and_Constants.html)
- [Constants.](./Variables_and_Constants/Constants.html)
- [Non-aggregate
  Variables.](./Variables_and_Constants/Non-aggregate_variables.html)
- [Collections](./Variables_and_Constants/Collection_Type.html)
- [Arrays](./Variables_and_constants/Array_type.html)

#### Const

Begins a declaration section of constant values. All constant
declarations follow on subsequent lines, each ending with a comma except
for the last one.

The Const keyword and its declarations must appear outside of any
individual script or function. Constant declarations are typically
located at the top of a script source file or within a screen reader
script header file.

#### Globals

Begins a declaration section of global variables. All global variable
declarations follow on subsequent lines, each ending with a comma except
for the last one.

The Globals keyword must appear outside of any individual script or
function. Global variable declarations are typically located at the top
of a script source file or within a screen reader script header file.

#### Var

Begins a declaration section of local variables. All local variable
declarations follow on subsequent lines, each ending with a comma except
for the last one.

The Var keyword must appear within an individual script or function
where local variables are declared. The first line of a script or
function usually contains the Var keyword, followed by at least one
local variable declaration since local variables must be declared before
they can be used.

#### Handle

Begins the definition of a handle variable type. The name of the
variable follows: for example, Handle hwnd.

#### Int

Begins the definition of an integer variable type. The name of the
variable follows: for example, Int iMyAccountNumber.

#### Object

Begins the definition of an object variable type. The name of the
variable follows: for example, Object oMyObject.

#### String

Begins the definition of a string variable type. The name of the
variable follows: for example, String sMyName.

#### Variant

Begins the definition of a variant variable type. The name of the
variable follows: for example, Variant vMyVariant.

#### Keywords for Aggregate Variable Types

The following keywords apply specifically to aggregate variable types.
They include:

- Collection
- New
- IntArray
- StringArray
- HandleArray
- ObjectArray
- VariantArray

\
[]{#Keywords for Compiler Directives}

### Keywords for Compiler Directives

The following are keywords for compiler directives. For more details on
their usage, see [Compiler Directives.](./Compiler_Directives.html)

- Include
- Use
- Import
- #Pragma StringComparison
- Prototype
- ScriptFile
- ScriptFileVersion

\
[Back to list of Required Keywords for Compiler
Directives](#li_Keywords%20for%20Compiler%20Directives)\

## Non-Required Keywords

The below list contains a few keywords that are no longer required but
often make readability easier.

### Then

Follows the condition being evaluated in either an If statement or and
ElIf statement. For example the following two statements are evaluated
in the same manner:

    If (MyCondition) then
    If (MyCondition)

### Not

Reverses the condition of a statement that evaluates conditions in an
If-EndIf statement structure. The keyword is placed between the keyword
that begins an evaluation statement and the condition being evaluated.

The Not keyword is often replaced by the exclamation (!) operator, which
is processed in the same manner when compiled. for example, the
following two statements are evaluated in the same manner:

    If Not (MyCondition)
    If !(MyCondition)

### Let

Begins the assignment of a variable to a value. The variable name
followed by a single equals (=) sign followed by the value completes the
statement. If the variable type is a string, the value must be enclosed
in quotation marks.

For example, the following two statements are evaluated in the same
manner:

    Let sMyWorkplace = "Freedom Scientific"
    sMyWorkplace = "Freedom Scientific"
    and
    let iMyAccountNumber = 12345
    iMyAccountNumber = 12345

### Void

Used to declare a function type as returning no value when returning to
a calling script or function. A function that is declared as being of a
type like Integer or String returns a value of that type to the calling
script or function. If a function is not declared to be of any specific
type, it is assumed to be of type Void.
