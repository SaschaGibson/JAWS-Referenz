# 5.3 Parts of a Script

When you use the New Script dialog to create a new script or function,
the Script Manager automatically places 3 pieces of information into the
current script file. These three parts make up your script or function.

## Beginning Line

Each new script or function you create has a beginning line that is
created when you enter the script or function information into the New
Script dialog. The contents of the beginning line vary depending on
whether you created a script or function. When you create a new script,
the following line begins the script definition:

Script ScriptName ()

On the other hand, when you create a function the following line is
added to your script file:

Void Function FunctionName (parameter list)

Remember that a function always has a return type. This return type can
be a handle, integer (Int), object, or string. The function can also
return nothing. In cases where the function returns nothing to the
calling script or function, the word void is shown as the return type.

If the function uses any parameters, they are shown between the
parentheses following the function name.

If you decide to change the name of your script or function in the
beginning line, it is best to change the name through the Script
Information dialog. When you make changes using the General page of the
Script Information dialog, the script or function name is changed
automatically for you in the associated documentation file. Likewise if
you forgot to add a parameter to your new function, you can use the
Parameters page of the Script Information dialog to add it. See [section
4.5](04-5_ViewingInformation.htm) for more information on displaying the
Script Information dialog.

## The Body

The body immediately follows the beginning line of the script or
function. When you create a new script or function, the body is the
three blank lines immediately following the script or function beginning
line. You add all the instructions your script needs to perform its
given task here. These instructions are also referred to as statements.
Each type of script statement has a specific job to perform, and each
follows certain formatting and usage rules known as syntax.

## Ending Line

Each new script or function you create also has an ending line. This
line ends the individual script or function. This is always the last
line of your script or function. When you create a new script, the
ending line looks like the following:

EndScript

On the other hand, the ending line of a user-defined function looks like
the following:

EndFunction

 

  ---------------------------------------------------------- -- ---------------------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](05-4_SavingAndCompilingScriptFiles.htm){accesskey="x"}
  ---------------------------------------------------------- -- ---------------------------------------------------------------
