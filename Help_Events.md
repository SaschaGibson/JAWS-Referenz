# Help Events

A Help event function provides extra help messages about user interface
activity. This may be especially helpful for newer users of JAWS
unfamiliar with keyboard commands. So Help messages may be about what
keys you may press when a control is activated, the name of the access
key of the control, and so on. JAWS uses this information to determine
whether to speak and display Help messages. In this case, to display
information refers to showing it in Braille.

An example of a Help event function is TutorMessageEvent. For a complete
listing of related Help functions, see the category book in the
[Reference Guide.](../Reference_Guide.html)

## Code Sample

In the below code sample, the TutorMessageEvent function is overwritten
for Notepad to indicate some information it does not indicate normally
when a dialog gains focus into an edit combo control like the FileName
edit control in the Open or Save-As dialog. It is assumed that the
function is being processed in a Notepad.jss script source file and
compiled in the Notepad.jsb script binary file. The
GetCustomTutorMessage helper function (which is not an event function)
is used to populate the message desired for this code sample.

To set up the example, ensure that you have tutor help enabled in JAWS.
The feature is on by default and is found in the Basics dialog of the
JAWS Options user interface. The feature has three modes:

- Announce Menu and Control Help
- Announce Custom Messages Only
- Turn off Menu and Control Help

In the sample code, both of the enabled options work. If you have the
feature set to Announce Custom Messages Only, when you encounter an edit
combo control in a dialog in Notepad, the custom message shown here
speaks. However, if you have the feature set to Announce Menus and
Control Tutor Help, the custom message shown here speaks, and then is
followed by the default tutor help message JAWS provides for an edit
combo control.

Note that there is no script associated with this sample in order for it
to work and provide information. This is because the function is an
event function. So it does not require that a script and key assignment
be bound to it in order to provide information or suppress it.

    Messages
    @msgHello
    I am a test message for TutorMessageEvent to demonstrate how it works.
    @@
    EndMessages

    String Function GetCustomTutorMessage ()
    If DialogActive ()
    && GetObjectSubtypeCode () == wt_editCombo
        Return msgHello
    Else
        Return default::GetCustomTutorMessage ()
    EndIf
    EndFunction

    Void Function TutorMessageEvent (Handle hWnd, Int nMenuMode)
    If DialogActive ()
    && !nMenuMode ; a menu is not active.
        If GetObjectSubtypeCode () == wt_editCombo
            SayMessage (ot_tutor,self::GetCustomTutorMessage ())
        EndIf
    EndIf
    TutorMessageEvent (hWnd, nMenuMode)
    EndFunction
