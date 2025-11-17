# 5.4 Saving and Compiling Script Files

You have two options when it comes time to save your script file. You
can choose to compile and save the file with one keystroke. You can also
choose to save the file without compiling. Both save options are
described below.

## Saving and Compiling Script Files

After you have created a new script or function, you can choose the
Compile option from the File menu or press **CTRL+S** to save and
compile your script file. This action causes the script compiler to
examine each of the scripts and functions contained in the script file.
The compiler checks each statement in those scripts and functions making
sure the syntax is correct.

When the compiler finds an error, the compilation process is stopped and
the Compile Error message dialog is displayed. This dialog advises you
what type of error the compiler encountered with the Ok button being the
active control. To clear the dialog after you have reviewed the cause of
the error, press **SPACEBAR** to activate the Ok button or **ESCAPE** to
close the dialog.

After you have cleared the dialog, the insertion point is placed in the
line containing the error. At this point, you should review the line
making sure the statement is correct. You may also find the line
containing the insertion point does not contain the error. Many times a
previous statement with incorrect syntax can cause an error in a line
following it. In cases such as this, you will need to review both the
line containing the insertion point and any preceding lines.

Although the compiler checks the syntax of script statements, it does
not check spelling or logic. As you add function calls to the body of
the script, you must make sure the name of the function is spelled
correctly. Failure to spell the names of your functions correctly will
result in run-time errors. A run-time error occurs when you begin
testing your script and a problem occurs during the execution of the
script.

When you hear \"unknown function call to Function ABC\" where ABC
represents the name of a user-defined or built-in function, you can be
assured you have a run-time error. You should go back to your script
file and make sure all function names are spelled correctly.

## Saving Script Files Without Compiling

You may not want to compile your script file immediately. You may find
you need to save the file before you complete the script or function you
are currently writing. If you try to save the file using **CTRL+S**, the
script file is compiled and then saved. If your script is not complete,
then the compiler could encounter errors causing the file not to be
saved.

You can select the Save Without Compiling option from the File menu or
press **CTRL+W**. When you choose this option, the script file is not
compiled before it is saved. Instead, the file is saved much like you
would save a document in a word processor or text editor. You can then
come back to the file at a later date and continue working on the script
or function.

 

  ---------------------------------------------------------- -- ----------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](05-5_InsertingFunctions.htm){accesskey="x"}
  ---------------------------------------------------------- -- ----------------------------------------------------
