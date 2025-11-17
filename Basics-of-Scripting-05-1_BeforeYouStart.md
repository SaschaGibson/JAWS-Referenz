# 5.1 Before You Start

Before you start writing scripts, there are a few things you should add
to your new script file. You can add comments at the beginning of the
file to document the script file. Comments make it easier to maintain
the scripts and user-defined functions contained in your script files.
You can also use include statements. An include statement tells JAWS to
take the contents of one file and add it to your script file. You
usually include script header and message files.

## Adding Comments

You can add comments anywhere within your script file. You begin a
comment with a semicolon (;). When JAWS encounters a semicolon, the
compiler ignores anything to the right on the line on which the
semicolon appears. You can use comments to give information about the
script file, describe complex script statements, and more. Some examples
of comments follow:

; script file for Notepad\
SayString (\"Hello world!\"); Speak a message\
; SayString (\"Hello world!\") tell the compiler to ignore this entire
line

When you use multiple lines for comments, you must place a semicolon at
the beginning of each line. Otherwise, you will encounter syntax errors
when you try to compile your script file.

When you begin with a blank file, it is a good idea to start the file
off with a comment section. You can use this comment section to document
any information about the application being scripted, version of JAWS,
and date you created the file. An example of a comment block follows:

; Script file for Notepad in Windows Vista\
; written for JAWS version 12.0.XXX\
; Written by the Freedom Scientific Training Department December 2010

## []{#include}The Include Statement

After you have created a comment block at the top of your new script
file, you can add one or more include statements. The Include statement
tells JAWS to include the entire contents of a file in the script file
at the time you compile the file. You can think of an include statement
as a way of putting a large amount of information into your script file
without having to actually type it.

By using the include statement, you can store all of your messages used
in your script files in one location. Then you can use the include
statement in each script file that will use those messages. If you ever
need to make a change to a message, you need only make the change in the
message file. Since it is included in each script file, you make the
change in only one place. After you have made the change, you can
compile each script file to include your changes.

You can also store all of your global variable and constant declarations
in a script header file. You can then use the include statement in
multiple script files and use the global variables and constants in each
of those files. When you need to make a change to a constant value, for
example, you need only make it one place. After you make the change, you
just compile each of the script files that use the particular script
header file. This makes changing a constant value much easier because
you need not make the change in several places.

You begin the include statement with the word \"include,\" without the
quotation marks. Following the word \"include\" is the file name to be
included. The file name must be enclosed in quotation marks. The file
name must also include the file extension. You can include both script
header and script message files. Each included file must be located in
your JAWS settings directory.

Examples of the include statement follow:

include \"hjconst.jsh\"; default constant file\
include \"hjglobal.jsh\"; default global file\
include \"common.jsm\"; message file

 

  ---------------------------------------------------------- -- ----------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](05-2_TheNewScriptDialog.htm){accesskey="x"}
  ---------------------------------------------------------- -- ----------------------------------------------------
