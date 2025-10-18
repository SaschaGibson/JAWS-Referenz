# Application Info Events

An Application Info event function provides information about the
application, such as when it starts or closes. JAWS uses this
information to determine whether to speak and display application
information, initialize or nullify object pointers and variables, for
comparison purposes, etc. In this case, to display information refers to
showing it in Braille.

Some examples of Application Info event functions include:

- AutoStartEvent
- AutoFinishEvent

For a complete listing of application info event functions, see the
category book in the [Reference Guide.](../Reference_Guide.html)

Unlike other functions, AutoStartEvent and AutoFinishEvent should not
call down the stack. AutoStartEvent and AutoFinishEvent functions run
when script binary files are loaded and unloaded, which means that each
binary file will run its own version of these functions, if they exist,
and it is unnecessary for these events to call down the stack. In fact,
AutoStartEvent and AutoFinishEvent should not call down the stack
because doing so will cause the events to run when they should not, and
therefore introduce buggy behavior. Since normally, you should call down
the stack when overwriting events, avoid doing so in the case of these
two functions.
