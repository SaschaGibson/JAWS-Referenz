# 3.3 Performing Functions

Unlike scripts, JAWS performs functions based on the name and location
of the function. Each time a function is called from within a script or
another function, JAWS searches the application-specific script file
first.

If the function is contained within the application-specific script
file, then JAWS performs the function and no further processing is done.
If JAWS does not find the function in the application-specific file,
then JAWS searches the default file.

If JAWS finds the function in the default file, then JAWS performs the
function and no further processing is done. When JAWS does not find the
function in the default file, then JAWS searches the list of built-in
functions. If JAWS finds the function, then JAWS performs the function
and no further processing is done.

When JAWS does not find the function, then you will hear JAWS speak
\"unknown function call to\" followed by the name of the function. JAWS
will then spell the name of the function. This message tells you that
the function JAWS tried to call may have a name that is misspelled, the
function was previously deleted or has not been written.

An example of how JAWS processes functions follows:

You create a custom version of the SayHighlightedText function in an
application-specific script file. You created this custom version of the
SayHighlightedText function because processing of highlighted text is
handled differently in the application. The SayHighlightedText function
also exists in the default script file. JAWS performs the
SayHighlightedText function found in the application-specific script
file rather than the SayHighlightedText function found in the default
script file.

 

  ---------------------------------------------------------- -- ----------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](03-4_ScriptsVsFunctions.htm){accesskey="x"}
  ---------------------------------------------------------- -- ----------------------------------------------------
