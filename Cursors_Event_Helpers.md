# Cursor Event Helpers

A Cursors event helper function is used to assist a cursor event. JAWS
uses this information to determine whether to speak and display
something, or to play a sound when a particular type of cursor event
occurs. In this case, to display information refers to showing it in
Braille.

When overriding default behavior, it is best to overwrite the most
specific function to the task. If a function has helper functions, and
if the task you want to handle is best handled by a helper function,
then overwrite the helper function. Doing so is the best way to ensure
robust script behavior, and make it less likely that any future changes
to default scripts will have a negative impact on your scripts.

An example of a Cursors event helper function is the
ProcessBoundaryStrike function. For a complete listing of Cursors event
functions, see the category book in the [Reference
Guide.](../Reference_Guide.html)

## Code Sample

In the below code sample, if you navigate to the top or bottom edge of
an edit window, JAWS informs you by playing a sound. By default, this
feature is disabled and is application-specific. So it appears in the
JAWS Quick Settings user interface.

To set up the example and have the TopEdgeEvent and BottomEdgeEvent
functions fire in Notepad, from within the Notepad.jss script source
file, enable the setting called \"Top and Bottom Edge Alert\" in Quick
Settings. The code sample simply overwrites the ProcessBoundaryStrike
function in Notepad so that the PC cursor position is spoken after
processing the default function.

Note that there is no script associated with this sample in order for it
to work and provide information. This is because the function is an
event function. So it does not require that a script and key assignment
be bound to it in order to provide information for the related event
function to utilize. It just requires that the setting to detect the
event is enabled in JAWS.

    Void Function ProcessBoundaryStrike(handle hWnd, int edge)
    ProcessBoundaryStrike(hWnd, edge)
    SayMessage (ot_JAWS_message,GetCursorPosString (Cursor_PC,smmInches))
    EndFunction
