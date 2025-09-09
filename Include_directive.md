# Keyword: Include

## Description

The Include keyword directs the compiler to include the content of
another file into a script source file during compilation. Mostly,
Include statements ensure that .jsh header or .jsm message files are
compiled along with the code of the script source file where you add the
statements. But you can add other types of code files as Include
statements as well.

An Include statement must be followed by a filename and its extension
enclosed in quotes.

## Syntax

\
Include \"filename\"\

## Remarks

Constants and global variables you declare specifically in a script
source file are accessible only to that file when it is compiled. But if
you declare them in header files, constants and global variables can be
accessible to multiple script source files by adding Include statements
to those files.

As with header files, employing Include statements to add message files
in multiple script source files offers a distinct advantage. Message
files usually contain localizable string constants. Such message
constants may be in the form of simple string constants, or they may be
formatted messages with optional replaceable parameters that take on
values when the scripts run.

Consequently, you can use message files to declare and store localizable
messages JAWS processes for speech or for string comparison. then a
localizer only needs to modify a .jsm message file. When you add an
Include statement in your script source file for that message file, any
localized messages simply work as expected at run-time because they have
been processed when the script binary file was compiled.

All constants and messages in a script source file must have unique
names. If the compiler finds a constant or message with a name that has
already been used, the compiler generates a compiler error message that
it has found a duplicate constant, and then exits without compiling. So
take care not to add duplicate constant definitions in header or message
files whose filenames you plan to add as Include statements in your
script source files.
