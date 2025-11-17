# Constants

Unlike variables, constants do not change value. They are most useful
for hard-to-remember strings of characters or long numbers. Constants
should have mnemonic names since it is easier to remember a name than a
number or long string of characters.

The Freedom Scientific Scripting language has no restrictions as to how
many constant names you assign to a particular value. For example, in
the default JAWS constants file, HJConst.jsh, there are constants named
True and On - both of which hold the value 1. It is more intuitive to
understand a code statement that checks a condition for values of True
or On than a code statement that checks for the integer 1. Once you
declare the constants, JAWS recognizes all of the constant names with
the same value.

If the string of characters being stored in a constant includes Unicode
characters, ensure that the script files where the constants are
declared and utilized are formatted properly for UTF-8. For more
information on UTF-8, see [Formatting Script Files for
UTF-8./](../Formatting_Script_Files_for_UTF-8.html)

## Advantages of Using Constants

There are several advantages to using constants in scripts:

- It is easier to remember a constant name than its value. And it is
  more intuitive when the constant name is a readable word like "True"
  or "on".
- It is much easier to maintain code when constant names are used rather
  than hard-coded strings of characters or hard-coded integer values.
- Changing the value of a string of characters or an integer that is
  used throughout code is much easier to maintain if that value is
  stored in a constant. The change is made just in one place. In other
  words, simply changing the constant declaration affects the code
  wherever that constant is applied.
- The Freedom Scientific Scripting language does not support direct
  declaration of a negative integer constant, as in \"VBTrue = -1\".
  However, it does support using hexadecimal representation of any
  integer, including negative integers, as in \"VBTrue = 0xffffffff\".
  Note: This is because the Scripting language uses four bytes to store
  numbers, and if the highest bit is a 1, the numbers are signed so that
  they are negative.

## Declaring Constants

You may declare constants anywhere outside of a script or function, but
conventionally, they are declared at the beginning of a script source
(jss) file or in a header (jsh or jsm) file. Begin declaration of
constants either with the keyword, Const for simple constants, or with
the keyword pattern that generates a block of message constants. A
message block of constants begins with the keyword, Messages, and ends
with the keyword, EndMessages.

### Simple Constants

For simple constants, place each constant declaration on a separate line
followed by a comma, except for the last one. For example:

    Const
        True = 1,
        False = 0,
        On = 1,
        Off = 0,
        FS = "Freedom Scientific",
        FSZipCode = "33764" ; since this is used as a string, not for computing

### Formatted Message Constants

Although you may declare string constants such as for window names,
window classes, and so on, it is much more practical to declare message
constants as formatted strings. This ensures that when JAWS processes
message constants, they are indicated properly in speech, Braille, and
in the virtual viewer, if applicable. Furthermore, formatted message
constant declarations may include replaceable parameters so that varied
information may populate messages when JAWS processes them, depending on
conditions you determine through scripts and functions or through
events.

When declaring and using message constants, especially those you wish to
format with replaceable parameters in them, be sure to:

1.  Populate the message constant with text (it can be long and have
    multiple paragraphs), including spaces, tabs, and hard returns.
2.  If desired, create the text of the message constant with the \"%\"
    character followed by a number to indicate a replaceable parameter
    within the message. You may use multiple replaceable parameters in
    the same message.
3.  Use the FormatString function in order to populate the message with
    appropriate replacement strings for the replaceable parameters in
    the message constant. The FormatString function returns a string
    that is already formatted properly for you to pass to a function
    that outputs formatted strings .
4.  Utilize only functions that process formatted strings correctly, or
    enclose the string parameters in a call to the FormatString
    function. For example, if you pass the SayMessage function a
    formatted string, it cannot process any replaceable parameters; so
    the output may yield unexpected results. Instead, use one of the
    functions that processes formatted strings. These include:
    - SayFormattedMessage
    - SayFormattedMessageWithVoice
    - UserBufferAddFormattedMessage

For a complete list of formatting functions, see the String Functions
category page of the Reference Guide called [Strings
Functions](../Reference_Guide/Strings.html)\
and\
[Text Format Functions.](../Reference_Guide/Text_Format.html)

### Syntax of Formatted Messages

Use the following format for message constants:\
The keyword, "Messages"\
On a new line, the name of the constant beginning with the at (@)
symbol.\
As many lines as necessary for the content of the message, including
hard returns, to generate multiple paragraphs, even replaceable
parameters.\
On a new line, a double at (@@) symbol to end the constant declaration.\
On a new line, the keyword, "endMessages" to end the block of message
constants.

You may repeat the pattern for as many message constants as you wish of
\"@\" followed by message constant name, constant message itself, and a
double \"@\" symbol to complete each message constant within the block
beginning and ending with the keywords, Messages and EndMessages. It is
good practice to begin the names message constants with the letters
\"msg\" to distinguish them from other types of string constants. Also,
if the constant takes replaceable parameters, place a comment above each
message constant declaration explaining the purpose of the replaceable
parameter.

#### Code Sample

\

    Messages
    @msgFSHeadquarters
    11800 31st CT North
    St. Petersburg, FL
    @@
    @msgFSPhoneNumbers
    800-444-4443
    or
    727-803-8000
    @@
    ;for msgMyWorkplace, %1 is the name of the workplace.
    @msgMyWorkplace
    I work at %1.
    @@
    EndMessages

\

## Using a Header File to Store Constants

Unless the constants you are declaring apply only to the current script
source file, it is more practical to declare constants in a script
header file. Typically, a header file has an extension of .jsh or .jsm.
When you use a header file to declare constants, you must refer to that
header file with an "Include" statement in the script source file where
you want to use the constants. For examples, see the script source file
that ships with the JAWS Shared user\\settings\\(Language) folder. One
of the \"include\" statements for this file is \"hjconst.jsh\". Another
is \"common.jsm\". Since the constants declared in these header files
are in the default script source file, it means that you can use all of
them in any of the default scripts and user-defined functions.

If you add an \"Include\" statement for the HJConst.jsh file within an
application-specific script source file, for example, those constants
become available to that script source file.
