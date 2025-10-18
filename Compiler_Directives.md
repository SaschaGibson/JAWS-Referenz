# Compiler Directives

The Freedom Scientific Scripting language supports the use of several
compiler directives to facilitate how files are compiled and utilized at
run-time. Compiler directives employ specific keywords and are as
follows:

- Include
- Use
- Import
- Prototype
- ;#Pragma StringComparison
- ;#Pragma UsePoFile
- ScriptFileVersion and ScriptFile

## Include Statement

Adds the contents of a JAWS script header or message file to a script
source file when compiled. This also means that such a file can be
\"included\" in multiple source files.

For more information about variable, constant, and message header files
that may be added to a script source file through the Include statement,
see [Variables and Constants.](Variables_and_Constants.html)

For more details on the usage and syntax of the Include statement, see
[Include Directive.](Compiler_Directive/Include_directive.html)

## Use Statement

Creates a link between the binary version of one script source file with
the binary of another . the resulting linkage between the two binary
files allows JAWS to call functions from the binary file in the Use
statement as if those functions had been part of the original script
source file where the Use statement appears.

For example, the statement, Use \"UIA.jsb\", is in the JAWS default
script source file, default.jss. Along with several other Use
statements, this statement is located near the top of the file after all
the Include statements. The Use \"UIA.jsb\" statement tells JAWS to
create a link between the compiled JAWS default script binary file,
Default.jsb, and the UIA.jsb binary file. The resulting linkage between
these two binary files allows the JAWS default binary file to make
function calls from the UIA.jsb file as if those functions had been
created in the JAWS default script source file or were part of the JAWS
built-in functions.

For more details on the usage and syntax of the Use statement, see [Use
Directive.](Compiler_Directive/Use_directive.html)

## Import Statement

Directs the compiler to refer to the script and/or function definitions
in a script documentation file (.jsd) when compiled. Actually, both use
and import statements make the definitions in a .jsd documentation
available at compile time. The difference is that the Use statement
links the binary files while the Import statement does not link them. In
other words, the Import statement makes the actual script and function
definitions from a specified script documentation file available to the
compiler during compilation. But the binary files are not linked.
Therefore, function types and parameter definitions from that script
documentation file are processed when compiled.

Linking a script binary file more than once in multiple source files for
the same script set may cause problems at run-time. If you have a script
set that requires function definitions from a binary file at run-time
other than the file you are compiling, and if the compiler needs access
to the function definitions in the script documentation file associated
with that binary file so that it can compile, employ the Import
statement instead of the Use statement. In this way, you are directing
the compiler to access the script and function definitions in the script
documentation file instead of linking the binary file more than once.

For more details on the usage and syntax of the Import statement, see
[Import Directive.](Compiler_Directive/Import_directive.html)

## Prototype Statement

Used in lieu of the Import statement to add a particular function
definition from a script documentation (.jsd) file to a script source
(jss) file. When the function definitions from the entire file are not
needed, the Prototype statement omits the need for the entire script
documentation file to be imported.

The Prototype statement is added outside of any script or function, as
long as it precedes the location in the script source file where you
call the function.

For more details on the usage and syntax of the Prototype directive, see
[Prototype Directive.](Compiler_directive/Prototype_directive.html)

## ;#Pragma StringComparison Statement

Used to determine how string comparisons with the == and != operators
should be processed by the compiler. The ;#Pragma statement must be
followed either by the keywords, StringComparison full, or the keywords,
StringComparison partial. Place the statements outside of any script or
function code in a script source file.

Since JAWS 13, all string comparisons using the == and != operators
behave as if the ;#Pragma StringComparison functionality were set to
full. This is default behavior. But prior to JAWS 13, string comparisons
were processed such that the comparison ended when the shorter of the
two strings matched the longer of the two.

The scripter may direct the compiler as to how to process string
comparisons: ;#Pragma StringComparison set to full or set to partial. If
set to full, succeeding string comparisons using the == and != operators
ensure that the compiler processes string comparisons fully regardless
of which is shorter. If set to partial, the compiler processes string
comparisons using the older method used in versions of JAWS prior to
JAWS 13.

For more details on the usage and syntax of the \";#Pragma
StringComparison\" statement, see [;#Pragma StringComparison
Directive.](Compiler_Directive/Pragma_StringComparison_directive.html)

## ;#Pragma UsePoFile Statement

Used to determine whether a script source file should be processed by
the compiler to be backwards-compatible to versions of JAWS prior to 17.
This specially formatted comment statement must reside outside of any
script or function in the source .jss file. You only need to add the
statement at all when you are creating or editing a script source file
with JAWS 17 or later, and you need that script to work properly in a
version of JAWS older than JAWS 17.

For more details on the usage and syntax of the \";#Pragma UsePoFile\"
statement, see [;#Pragma UsePoFile
Directive.](Compiler_Directive/Pragma_UsePoFile_directive.html)

## ScriptFileVersion and ScriptFile

Used to version-lock the script source file to a specific version of the
product. For more details on the usage and syntax of the
\"ScriptFileVersion\" and \"ScriptFile\" statements, see
[ScriptFileVersion and ScriptFile
Directives.](Compiler_Directive/ScriptFileVersion_and_ScriptFile_directive.html)
