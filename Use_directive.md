# Keyword: Use

## Description

The Use keyword directs the compiler to link code from one script binary
(.jsb) file to another during compilation of the script source file
where the statement is added. In other words, when the scripts run, all
the code in the binary file processed by the compiler is from both the
script source file and from the script binary file linked to that script
source file by the Use statement.

A Use keyword must be followed by a binary script file name and its
extension enclosed in quotes.

## Syntax

\
Use \"filename\"

Filename is the name of the script binary file loaded at run-time along
with the script binary file being generated during compilation of the
script source file where the Use statement is added.

## Remarks

The binary file specified in the Use statement need not exist at the
time the scripts are compiled, but it must exist at the time that the
scripts run. If the binary file does not exist at runtime, JAWS displays
an error message that the file could not be loaded.

The compiler loads the script and function definitions in the script
documentation file associated with the script binary file specified in
the Use statement, and refers to these definitions during compilation
when performing type and parameter checking.

Linking a script binary file more than once may cause problems at
run-time. If your script set requires a script binary file at runtime,
and if the compiler needs access to the function definitions in its
associated script documentation file when compiling multiple source
files, employ the Import statement to direct the compiler to access the
script documentation file instead of linking the script binary file more
than once with the use statement.

Since JAWS 14, the Use statement grants the ability to overwrite
selective scripts and/or functions in script files distributed with the
product\'s release. If the Use statement specifies a script binary file
by the same name as the binary file name of the current file, JAWS links
the script binary file from the shared settings folder. Doing so means
that a script binary file in the user settings folder may contain
selected scripts and functions that are actually overwritten versions of
the ones in the script binary file in the shared settings folder.

Since JAWS 18, JAWS offers the ability to migrate script sets from JAWS
17 and later with caution. If a script binary in the JAWS 17
User\\Settings\\(Language) folder links to the one in shared via the Use
statement, then it is considered to be a valid script set; it is
available for migrating forward. This is because, apart from the
functionality you may add/ or override in the script set, the rest of
the shared functionality is still active. Consequently, if a JAWS 18 or
later shared script binary has new functionality, it is active and valid
with the old user script binary because it links to it. If any new
functionality in JAWS 18 or later were not to link, that new
functionality would be lost by migrating the older script set, leading
to unpredictable behavior.
