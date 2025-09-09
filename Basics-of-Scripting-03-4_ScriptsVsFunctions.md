# 3.4 Scripts vs. Functions

To this point, we have been mainly discussing scripts. However, there is
a second block of code found in a script file. This second block of code
is called a function. Functions differ from key-bound scripts in that
they can return information after they finish executing. A function can
also accept data from the calling script or function. The data passed to
a function is called a parameter and the data returned to the calling
script or function is called a return.

There are three types of functions:

- Event
- Built-in
- User-Defined

## Event Functions

JAWS performs event functions automatically when windows events occur.
Without these event functions, JAWS does not speak system changes
automatically.

You cannot create new event functions. However, you can modify existing
event functions. You can also create application-specific versions of
the event functions found in the default script file.

Some of the event functions within JAWS include:

- AutoStartEvent
- BottomEdgeEvent
- FocusChangedEvent
- NewTextEvent

JAWS performs the AutoStartEvent function each time an application is
started or becomes active. JAWS performs the BottomEdgeEvent each time
the active cursor reaches the bottom edge of a window. JAWS performs the
FocusChangedEvent function when focus moves between applications,
dialogs, and dialog controls. JAWS performs the NewTextEvent function
each time any new text is written to the screen.

## Built-in Functions

There are over 1300 built-in functions that are available for use in
creating new or modifying existing JAWS scripts. You can think of the
built-in functions as the building blocks of your scripts and functions.
Some built-in functions include: SayLine, JawsCursor, NextWord, and
PriorWord. You cannot modify existing built-in functions.

Built-in functions are performed when they are called by another script
or function. These functions are performed by placing the name of the
function within the coded lines of another script or function. When the
script gets to the line that includes the name of the function, the
function is performed. This process is known as \"calling\" a function.

## User-defined Functions

You can find user-defined functions in script files. These functions are
developed by either Freedom Scientific script developers or by a script
developer outside of Freedom Scientific. These user-defined functions
have been created for some special purpose and can also be modified.
Like built-in functions, user-defined functions are called from a script
or another function.

 

  ---------------------------------------------------------- -- --------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](03-5_ChapterExercises.htm){accesskey="x"}
  ---------------------------------------------------------- -- --------------------------------------------------
