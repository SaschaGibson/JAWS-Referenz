# Screen Text Events

A Screen Text event function provides information about any type of
screen text activity. The information may be for a screen text event
within an application such as Notepad or Microsoft Word, but also for a
screen text event in more general operating system features like Windows
Explorer or the Start menu. JAWS uses the information from a Screen Text
event function to determine what to speak and display. This includes
whether new text is occurring, for example, and whether that new text
should be indicated or suppressed. In this case, to display information
refers to showing it in Braille.

Some examples of Screen Text event functions include:

- CaretMovedEvent - only triggers under certain types of edit windows
- CellChangedEvent
- NewTextEvent

For a complete listing of Screen Text event functions, see the category
book in the [Reference Guide.](../Reference_Guide.html)

Note that the function called SelectionContextChangedEvent is a Screen
Text event, not a Selection event. This is because Selection events
involve the process of selecting text or graphics, files, or folders,
etc.; whereas, examining the context in which a selection has occurred
is a screen text activity. For example, in Microsoft Word, you may
select text in the main document window, of course. But you may also
select text in a comment, a footnote, and endnote, revised text, and so
on. Therefore, in that application, it is critical for JAWS to recognize
the context in which the selection event is occurring in order to
determine what exactly to speak and display in Braille relative to the
selection. So Selection events and ScreenText events are closely tied
together but are not the same events.

## Labelled Graphics Passed to NewTextEvent

For many years, the scripting language had no functionality to detect
whether a graphic changed in a window. Thus you could not script JAWS to
detect automatically a graphic change, or to make a frame speak a
graphic change indicating a change in the app.

Starting with the May 2017 release of JAWS 18, a JCF option became
available to JAWS for controlling if graphics are also included in the
NewTextEvent function. It is:\

    IncludeGraphicsInNewTextEvent=0

\
Previously only text was included. This meant that a script could not
detect changes in graphics in the OSM. By enabling this JCF option, you
can now monitor changes in graphics via NewTextEvent. You can label
graphics and then use NewTextEvent to monitor changes in the graphic.

Before this enhancement, for example, a graphic was used to indicate if
the EchoLink Ham software was in transmit or receive mode. There was no
other way of knowing other than via this graphic. Since graphics were
not passed to NewTextEvent, JAWS could not provide any feedback when the
application changed from tx to rx, etc.

Normally, graphics are not passed to NewTextEvent. Setting the
IncludeGraphicsInNewTextEvent option to 1 allows changes in graphics to
be passed to NewTextEvent, thus enableing scripts to detect changes in
visible graphics automatically. Examples include:

- Labelled graphics which indicate a change in status.
- Frames used to speak changes in graphics automatically.

## Code Sample

In the below code sample, the NewTextEvent function is overwritten for
Notepad to announce how many characters are in the buffer when focus is
in the document window. If the user types any text in the document
window, NewTextEvent fires and announces the nonsense message. If the
user performs some other activity that causes new text to appear (e.g.,
activating a menu or dialog), the nonsense message is not triggered. It
is only triggered conditionally when focus is in the document window and
text is typed or otherwise edited.

Take time to examine the function in default.jss. The NewTextEvent
function is often responsible for suppressing extraneous information as
well as for speaking it, depending on the type of information that
causes NewTextEvent to fire in the first place.

It is assumed that the function is processed from the Notepad.jss script
source file and compiled in the Notepad.jsb script binary file.

Note that there is no script associated with this sample in order for it
to work and provide information. This is because the function is an
event function. So it does not require that a script and key assignment
be bound to it in order to provide information or suppress it.

    Void Function NewTextEvent (Handle hwnd, String buffer, Int nAttributes,
        Int nTextColor, Int nBackgroundColor, Int nEcho, String sFrameName)
    Var
        String smsgBufferMessage

    smsgBufferMessage = "The buffer now has %1 characters."

    NewTextEvent (hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
    ;Say the number of characters in the buffer but only if in the document window.
    If GetObjectSubtypeCode () == wt_multiline_Edit
        SayFormattedMessage (ot_screen_message, FormatString (smsgBufferMessage,IntToString(StringLength(buffer))))
    EndIf
    EndFunction

## Additional Resources

For more details on Selection events, see the topics under the Events
topic area of the General Scripting Concepts book called [Selection
Events](../Events/Selection_Events.html) and [Selection Event
Helpers](../Events/Selection_Event_Helpers.html)
