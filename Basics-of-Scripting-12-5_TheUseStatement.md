# 12.5 The Use Statement

In a previous chapter of this manual, you learned about the include
statement. You use this statement to \"include\" the contents of a JAWS
script header or message file within a JAWS script file. There is a
second statement you can add to your script file that allows you to use
another type of Script Manager file.

If you were to look at the default script file, you would find a number
of include statements for a variety of header and message files.
Following these include statements, you will find a series of \"use\"
statements. These \"use\" statements allow you to create a link between
the binary version of one script file with the binary of another. For
example, you will find the statement use \"Magic.jsb\" in the default
script file. This statement tells JAWS to create a link between the
compiled version of the default script file, Default.jsb, and the
Magic.jsb binary file.

This link then allows the script developers at Freedom Scientific to
call functions from the Magic.jsb file just as if the functions had been
created in the default script file or were part of the built-in
functions of JAWS.

The syntax of the use statement is identical to that of the include
statement. You begin by typing the word \"use\" followed by a space then
the name of the binary file you want to include. The name of the binary
file must include the extension of \".jsb\" and be surrounded in
quotation marks. Some examples of use statements taken from the default
script file follow:

use \"say.jsb\"\
use \"Braille.jsb\"\
Use \"Virtual.jsb\"

 

  ---------------------------------------------------------- -- --------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](12-6_ChapterExercises.htm){accesskey="x"}
  ---------------------------------------------------------- -- --------------------------------------------------
