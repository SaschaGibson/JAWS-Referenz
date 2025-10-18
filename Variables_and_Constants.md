# Variables and Constants

The Freedom Scientific Scripting language supports the use of variables
and constants.

## Variables

As in all programming languages, variables available in the Scripting
language are for storing values of differing types of data. Values
stored in variables can change simply by running a script or function,
or by conditions that occur as a result of running a script or function.

Variables may be local or global. You must declare global variables
outside of a script or function by preceding them with the keyword,
Globals. Then you must precede each variable name by its type.

Global variables persist for the life of the JAWS program session,
whereas local variables persist only for the life of the script or
function where you declare them.

Variable types may be either non-aggregate, meaning that only one value
of a specific type can be stored in the variable at a time, or they can
be types that may store a set of values such that the set of values is
of a specific type or of varied types. Non-aggregate variable types
include but are not limited to integers and strings; whereas, aggregate
types include collection and array types.

For more specific information on variables and their types, and how to
utilize them in the Freedom Scientific Scripting language, see the
following:

- [Non-Aggregate
  Variables](./Variables_and_Constants/Non-Aggregate_Variables.html)
- [Collection Type
  Variables](./Variables_and_Constants/Collection_Type.html)
- [Array Type Variables](./Variables_and_Constants/Array_Type.html)

### Examples of Local and Global Variables

- Use the let keyword in statements within scripts or functions. Note:
  As of JAWS 11.0, the let keyworkd is optional.\
  \
  Example of a local variable declaration and assignment:\
  \

      Function Test ()
      Var
          Int iControl

      Let iControl = 1500 ; assigns the value of 1500 to the local integer variable, iControl.
      ;or you could write the statement as:
      iControl = 1500 ; same meaning as the above example since "Let" is an optional keyword.
      ...
      EndFunction

  \
  \
  Example of a global variable declared outside a script or function:\
  \

      Globals
          Int ghWnd ; handle global variable
          String gsMyName ; a string variable to hold a person's name

  \

- Assign a value from the return value of a built-in function to a
  variable. Note: Ensure that the variable and the function are of the
  same type. Otherwise, the compiler will generate a syntax error when
  you try to compile your script file. For Example:\
  \

          hWnd = GetFocus () ; since the function returns a window handle.
          Let iControl = GetControlID (GetFocus ())

  \

## Constants

Unlike variables, constants do not change value. They are useful for
storing hard-to-remember strings of characters with an easy-to-remember
name. When declaring constants outside of a script or function, you must
precede them by the keyword, Const. However, if the constants you are
declaring are specifically message constants with mmulti-line strings of
characters or with other special characteristics, you may choose to use
the keywords, Messages and EndMessages for declaring them. See belo
examplesw.

The Freedom Scientific Scripting language has no restrictions on the
number of constants you can create, or on the number of constants that
have the same value. Sometimes you will find it useful to have more than
one constant name for the same value. For example, the constants named
"True" and "On" may both have the value of 1. Depending on the
circumstances, it may be more practical to use one or the other for
readability in your scripts and functions.

### Assigning Values to Constants

There are several syntax options for assigning values to constants:

Assign a value to a constant when you declare it. Once you do so, that
value may not change. In other words, you cannot assign a value to a
constant outside of its declaration. The \"let\" keyword is never used
when declaring a constant and assigning it a value. However, constants
may include replaceable parameters whose value may change. For specifics
on how to assign and utilize constants, see
[Constants.](./Variables_and_Constants/Constants.html)

Examples of constants declared outside a script or function:

    Const
        FSHQ="Freedom Scientific Headquarters",
        FSWH="Freedom Scientific Warehouse"
        sHelloMessage="Hello, world!"

    Messages
    @msgMyWorkplace ; the replaceable parameter, %1, is drawn from within a function call to the FormatString function.
    I work at %1.
    @@
    EndMessages

### Code Samples

    SayMessage(ot_line,sHelloMessage)
    SayFormattedMessage(ot_line,FormatString(MyWorkplace,FSHQ))

Or you could easily change the message upon some condition to the
following:

    SayMessage(ot_line,sHelloMessage)
    SayFormattedMessage(ot_line,FormatString(MyWorkplace,FSWH))

### Remarks:

Since the constant msgMyWorkplace includes a replaceable parameter, it
may be used in the FormatString function as the first parameter, with
the second parameter being some other constant (in this case, either
FSHQ or FSWH. Although you could hard-code a character string for that
second parameter, it will be easier to maintain the code if later on you
want to change your workplace say to the Freedom Scientific Engineering
Department.
