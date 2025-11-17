# Keyword: Import

## Description

The Import keyword directs the compiler to refer to the script and/or
function definitions in a script documentation (.jsd) file during
compilation.

An Import keyword must be followed by a script definition filename and
extension enclosed in quotes.

## Syntax

\
Import \"filename\"

Filename is the name of a script documentation file containing script
and/or function definitions to be accessed by the compiler as the script
source file is being compiled.

## Remarks

The compiler loads the script and function definitions in the script
documentation file specified in the Import statement, and refers to
these definitions during compilation when performing type and parameter
checking.

Linking a script binary file more than once may cause problems at
run-time. If you have a script set that requires a script binary file at
run-time, and if the compiler needs access to the function definitions
in the script documentation file when compiling more than one script
source file, employ the Import statement to direct the compiler to
access the script documentation definitions instead of linking the
script binary file more than once with the Use statement.
