# Mouse Events

A Mouse event function provides information about any type of Mouse
activity. The information may be for a Mouse in an application such as
Notepad or Microsoft Word, Google Chrome, etc. But it might also be for
more general operating system features like Windows Explorer or the
Start menu. JAWS uses the information from a Mouse event function to
determine whether to speak and display whether a Mouse movement or
activity is occurring. In this case, to display information refers to
showing it in Braille.

Some examples of Mouse Event functions include:

- MouseButtonEvent
- MouseMovedEvent

For a complete listing of Mouse event functions, see the category book
in the [Reference Guide.](../Reference_Guide.html)

## Code Sample

In the below code sample, the MouseButtonEvent function is copied from
the one in default.jss into a Notepad.jss script source file for JAWS to
indicate some information it does not provide normally when you use a
Mouse wheel.

Unlike most event functions overwritten from default.jss, there is no
need to call MouseButtonEvent because the one in default.jss simply
provides you with instructions about how to utilize the function.
Basically, if you place any statements within the function in
default.jss and recompile, whatever you have added to this event
function is processed across the board in any application. By contrast,
if you copy the function from default.jss into an application\'s script
source file (e.g., Notepad.jss), whatever statements you include in the
function are only processed when Notepad is running and has the focus.

The \"event Id\" identifiers for each of the mouse activities that cause
MouseButtonEvent to fire are listed in the file called HJConst.jsh that
ships with JAWS.

Note that there is no script associated with this sample in order for it
to work and provide information. This is because the function is an
event function. So it does not require that a script and key assignment
be bound to it in order to provide information or suppress it.

    Messages
    @msgMouseWheel
    I am using the wheel on the mouse.
    @@
    @msgNoMouseWheel
    I am using my mouse but not its wheel.
    @@
    EndMessages

    Void Function MouseButtonEvent (Int eventID, Int x, Int y)
    If EventId == WM_MOUSEWHEEL
        SayMessage (ot_smart_help, msgMouseWheel)
    Else
        Pause () ; Avoid double-speaking the error message.
        SayMessage (ot_error, msgNoMouseWheel)
    EndIf
    EndFunction
