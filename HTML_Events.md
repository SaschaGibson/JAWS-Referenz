# HTML Events

An HTML event function provides information about user interactions or
events that occur in HTML applications. Based on the information the
event function provides or returns, JAWS determines what to speak and
display. In this case, to display information refers to showing it in
Braille.

Some examples of HTML event functions include:

- DocumentLoadedEvent
- DocumentUpdated
- FormsModeEvent

For a complete listing of HTML event functions, see the category book in
the [Reference Guide.](../Reference_Guide.html)

## Code Sample

In the below code sample, the DocumentLoadedEvent function that is
already overwritten in Chrome.jss from the function in the default.jss
script source file is changed slightly. After all the calls in the
function occur, a nonsense message saying, \"hello\", is added to
illustrate how DocumentLoadedEvent works when a new Web page is loaded.
It is assumed that the function is being compiled in the Chrome.jsb
script binary file in your root folder of the JAWS user
Settings\\(language) folder.

Note: To avoid unpredictable results, never change the files located in
any folder of the JAWS shared folders structure.

Note that there is no script associated with this sample in order for it
to work and provide information. This is because the function is an
event function. So it does not require that a script and key assignment
be bound to it in order to provide information or suppress it.

    Messages
    @msgHello
    Hello.
    @@
    EndMessages

    Void Function DocumentLoadedEvent ()
    SetUpStuffForNewPage ();Personalized Settings
    SpeakPersonalizeSettingsChange ()
    Let giReturnPositionFromFrameUpdate = 0
    Let gICheckByActiveItem = FALSE
    DocumentLoadedEvent ()
    SayMessage (ot_JAWS_message,msgHello)
    EndFunction
