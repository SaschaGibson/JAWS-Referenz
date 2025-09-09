# Cursor Events

A Cursor event function provides information about system cursors and
about the JAWS cursors. These differ in some cases since JAWS has some
special cursors of its own. And since JAWS 2020, this includes UIA Scan
cursors for modern Windows 10 applications and areas of Microsoft Office
365. A cursor event may provide information about whether a cursor is
changing shape, appearing or disappearing, etc. JAWS uses this
information to determine whether to track information with speech and in
Braille, for comparison purposes, etc.

Some examples of Cursor event functions include:

- TopEdgeEvent
- BottomEdgeEvent
- CursorShapeChangedEvent

For a complete listing of cursor event functions, see the category book
in the [Reference Guide.](../Reference_Guide.html)

## Code Sample

In the below code sample, if a cursor changes shape, JAWS informs you.
By default, this feature is disabled but you can toggle it on/off
through Settings Center.

To set up the example and have the event function fire in Notepad, from
within the Notepad.jss script source file, enable \"Notify When Mouse
Cursor Changes Shape\" through the Settings Center user interface. The
code sample simply overwrites the function in Notepad so that the active
cursor and position are spoken ahead of processing the default function
for announcing cursor shape changes.

Note that there is no script associated with this sample in order for it
to work and provide information. This is because the function is an
event function. So it does not require that a script and key assignment
be bound to it in order to provide information or suppress it. It just
requires that the setting to detect the event is enabled in JAWS.

    Void Function CursorShapeChangedEvent (string CursorType)
    PerformScript SayActiveCursor ()
    Delay (10)
    CursorShapeChangedEvent (CursorType)
    EndFunction
