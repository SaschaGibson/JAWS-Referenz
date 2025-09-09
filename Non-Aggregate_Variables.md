# Non-Aggregate Variables

The Freedom Scientific Scripting language offers several types of
variables you can define for your scripts and functions. The type of a
variable determines the set of values a variable may hold.

For example, non-aggregate variable types are for variables that may
hold only one value at a time; whereas, aggregate variable types are for
variables that may hold a set of values simultaneously. Aggregate
variable types include collections and arrays. Collections may hold
items of different types, but arrays are defined to hold items of a
specific type and only that type, (e.g., the StringArray or IntArray
type.)

For more information about aggregate variable types, see [Collection
Type/\>](../Variables_and_Constants/Collection_Type.html) and [Array
Type](../Variables_and_Constants/Array_Type.html).

## Remarks

Declare all variables with a name and a type before using them within a
script or function.

Give each variable a unique name to distinguish it from other functions
and names used in a particular script or in the script source file
itself.

Do not try to use duplicate variable names within the same scope because
doing so will cause errors at compile time. Also keep in mind that local
variables with the same names as global variables take precedence over
those global variables.

## Non-aggregate Variable Types

Non-aggregate variable types allow variables to store only one type of
information. They include:

- [Integer - stores numeric values](#Integer){#li_Integer}
- [String -- stores a string of characters](#String){#li_String}
- [Handle - stores a window handle value](#Handle){#li_Handle}
- [Object - stores an object](#Object){#li_Object}
- [Variant -- Stores data that is not assigned to a specific
  type](#Variant){#li_Variant}

\
[]{#Integer}

### Integer - stores numeric values

The numeric value stored in an integer must be a positive or negative
integer or 0. Floating point numbers are not allowed as values for
integer variables. JAWS initializes all integer variables to zero each
time a script or function is called where integer variables are
declared.

\
\
Syntax: Int VariableName\
Example:

        Int iCheckNumber
        Let iCheckNumber = 1000

\
[Back to list of Non-aggregate Variables](#li_Integer)\
[]{#String}

### String - Stores a string of characters

A string may contain letters, numbers, punctuation marks, and spaces. If
the string must contain Unicode characters, see [Formatting Script Files
for UTF-8](../Formatting_Script_Files_for_UTF-8.html) to understand how
to format your script files so that they honor that character set as
well as the standard ASCII character set. To assign a value to a string
variable, enclose the characters in quotation marks.

JAWS initializes all string variables to null (no value) when a script
or function is called where string variables are declared. Null values
may be represented as a pair of quotation marks with no spaces between
them, or by the cscNull constant found in the common.jsm default message
file.

\
\
Syntax: String VariableName\
Example:

        String sMyName ; declares the string
        Let sMyName = John Smith

\
[Back to list of Non-aggregate Variables](#li_String)\
[]{#Handle}

### Handle - stores a window handle value

The operating system dynamically and automatically assigns a window
handle to each window within any running application. A window handle is
a unique integer that changes each time an application is closed and
reopened. For example, when you launch Microsoft Word, the document edit
window may have a window handle value of 1000. But when you close Word
and then reopen it, the window handle will be another integer.

Since a handle is an integer, it can be used like any other integer
variable. But you can use handle integer variables only for identifying
window handles. In other words, you cannot store a handle value in an
integer variable.

JAWS initializes all handle integer variables to zero each time a script
or function is called where handle variables are declared.

\
\
Syntax: Handle VariableName\
Example:

        Handle hwnd
        Let hwnd=GetFocus()

\
[Back to list of Non-aggregate Variables](#li_Handle)\
[]{#Object}

### Object - stores an object

An object variable refers to the types of objects used within software
such as Microsoft Office applications.

JAWS initializes all object variables to null (no value) each time a
script is called where object variables are declared.

\
\
Syntax: Object VariableName\
Example:

        Object oMyAppPointer
        Let oMyApptPointer = getObjectFromEvent(hwnd, ObjID_Window, 0, childID)

\
[Back to list of Non-aggregate Variables](#li_Object)\
[]{#Variant}

### Variant -- Stores data that is not assigned to a specific type

A variant variable is used to store data whose type may vary when
assigned.

\
\
Syntax: Variant VariableName\
Example:

        Variant vCalendar ; may contain string for day, integer for day of month, etc.
        Let vCalendar = "Today"
        Let vCalendar = 31

\
[Back to list of Non-aggregate Variables](#li_Variant)

## Declaring Variables

The Freedom Scientific Scripting language allows you to declare both
local and global variables. You may use local variables only in the
script or function where you declare them, and you must declare them to
precede the code that utilizes them. Typically, you place local
variables at the top of a script or function where you plan to use them.
but this is a convention, not a requirement.

You may use global variables in two ways from within the current script
source (.jss) file: 1) from any script or function where you declare
them; or, 2) by referring to a header (.jsh) file that contains the
declared global variables you want to use. In this case, you must add an
\"Include\" statement with the name of the relevant header file.
Typically, you add the \"Include\" statement at the top of the script
source file. but this is a convention, not a requirement.

Unlike languages with block scoping, though, a variable declared
anywhere in a script or function is scoped to the script or function.
Therefore, duplicate definitions within the local scope are not allowed
in the Freedom Scientific Scripting language.

Since global variables may be accessed by any script set, if you want to
keep your global variables private to your script set, be sure to
declare them in the script source file instead of the header file, and
use names for the global variables that are not likely to be chosen by
someone else in their scripts.

### Declaring Local Variables

By convention, you may declare local variables within a script or
function immediately following the beginning line of the script or
function. But you may also place them elsewhere in a script or function
as long as your declarations precede the code that utilizes them. Begin
local variable declarations with the keyworkd \"Var\".

For better readability, consider declaring each variable on a separate
line followed by a comma, except for the last one. If necessary, add a
comment after declaring the variable explaining its intent.

#### Example:

    Var
        String sFirstName,
        String sLastName,
        Int iCheckNumber ; from my checkbook

### Declaring Global Variables

It is good practice to declare global variables within a script file
immediately following any include and Use statements. This makes them
easier to find later. but you may place them anywhere outside of a
script or function as long as your declarations precede the code that
utilizes them. Begin global variable declarations with the keyword
"Globals".

For better readability, consider declaring each global variable on a
separate line followed by a comma, except for the last one. If
necessary, add a comment after declaring the variable explaining its
intent.

Once you create global variables and assigned values to them, they
retain those values even after you close the application that uses them.
In other words, unless you reboot the system or unload and reload the
screen reader itself, if you reopen that same application, the screen
reader remembers the values for any global variables from that
application\'s script file. If you want to clear global variables, you
must unload the screen reader from memory and reload it, or you must
create some function that re-initializes them each time the application
is reopened.

#### Example:

    Globals
        String gsFirstName,
        String gsLastName,
        Handle ghDocWnd ; handle of document wwindow

### Using a Header File to Store Variables

As mentioned above, it may be more practical to declare global variables
in a script header file. Typically, a header file has an extension of
.jsh. When you want to access a header file to declare global variables,
you must refer to it with an "Include" statement in the script source
file where you want to use the global variables. For examples, see the
script source file included in your shared user\\settings\\(Language)
folder. One of the "include" statements for this file is "hjglobal.jsh".
Since the global variables declared in that header file are in the
default script source file, it means that you can use all of them in any
of the default scripts and user-defined functions. If you add an
"Include" statement for the HJGlobal.jsh file within an
application-specific script source file, those global variables become
available to that script source file.
