# Selection Events

A Selection event function provides information about any type of
selection activity. The information may be for a selection event within
an application such as Notepad or Microsoft Word, but also for a
selection event in more general operating system features like Windows
Explorer or the Start menu. A Selection event may even occur in a Web
browser where a portion of the content of a Web page is selected for
copying to the Clipboard. JAWS uses the information from a Selection
event function to determine what to speak and display. This includes
whether text is being selected or unselected, for example, and whether
that activity should be indicated or suppressed. In this case, to
display information refers to showing it in Braille.

Some examples of Selection event functions include:

- SelectionChangedEvent
- TextSelectedEvent

For a complete listing of Selection event functions, see the category
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

## Code Sample

In the below code sample, the TextSelectedEvent function is overwritten
for Notepad to say and spell the text that is currently selected when
focus is in the document window. If the user selects any text that is
more than a single character, TextSelectedEvent fires and announces the
selected text as well as spells it. Otherwise, the default
TextSelectedEvent function behaves normally.

It is assumed that the function is processed from the Notepad.jss script
source file and compiled in the Notepad.jsb script binary file.

To set up the example, simply type some text in the Notepad document
window and then begin selecting and unselecting it by different
selection units - by character, word, etc.

Note that there is no script associated with this sample in order for it
to work and provide information. This is because the function is an
event function. So it does not require that a script and key assignment
be bound to it in order to provide information or suppress it.

    Void Function TextSelectedEvent (String strText, Int bUnSelecting, Optional Int bContainsSpeechMarkup)
    TextSelectedEvent (strText, bUnSelecting, bContainsSpeechMarkup)

    If GetObjectSubtypeCode () == wt_multiline_edit ; Focus is in the document window.
        If ! bUnselecting
        && StringLength (strText) > 1 ; Selected text is more than one character.
            SayUsingVoice (vctx_message, strText, ot_spell)
        EndIf
    EndIf
    EndFunction

## Additional Resources

For more details on ScreenText events, see the topics under the Events
topic area of the General Scripting Concepts book called [Screen Text
Events](../Events/screen_Text_Events.html) and [Screen Text Event
Helpers.](../Events/Screen_Text_Event_Helpers.html)
