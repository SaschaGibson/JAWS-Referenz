# Keyword: Prototype

## Description

The Prototype keyword directs the compiler to refer to a specific
function definition from a script documentation (.jsd) file during
compilation.

A Prototype keyword must be followed by a function definition, including
its return type, and the parameters the function expects.

## Syntax

\
Prototype \"function type\" \"the keyword, Function\" \"function name\"
(\"parameter type\" \"parameter name\", \...)\

- Function type is the return type of the function being defined (e.g.,
  Int for an Integer function, String for a String function, etc.)
- The keyword, \"Function\", must follow the function return type.
- Function name is the name of the function being defined.
- The parameters for the function being defined must be enclosed in
  parentheses.
- Each parameter type and its name must be defined, with each one
  separated by commas except for the last one.)

## Code Sample

\
Prototype String Function SpeakNames (String sMyName, Int
iMyAccountNumber)\

## Remarks

Each Prototype statement must precede any call to that function in the
current script source file. The compiler loads the function definition
in the script source file specified by the Prototype statement, and
refers to that function definition during compilation when performing
type and parameter checking.

Unlike some programming languages, the Freedom Scientific Scripting
language requires that variable parameter types be defined as well as
their names when a function definition is defined with the Prototype
statement.

Linking a script binary file more than once may cause problems at
run-time. If you have a script set that requires a script binary file at
run-time, and if the compiler needs access to one or just to a few
function definitions in a script documentation file, employ the
Prototype statement to direct the compiler to access just the needed
function definition(s) instead of directing it to access the entire
script documentation definitions file through the Import statement.
