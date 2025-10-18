# Key Layers

A key layer makes it possible to expand the number of keys you may
assign to run scripts. It is a mechanism that lets you assign an initial
key to activate a group of mapped key assignments. The keys in the layer
do not take on the behavior for the layer until the user activates the
layer by pressing the initial key in the sequence.

In JAWS, you may choose whether to set assigned keys in the layer to
keep the layer active. So if you set keys in a layer not to keep the
layer active, it means that the entire key sequence must be used for
each key in the layer to perform the script assigned to the keys in the
layer. On the other hand, if you set keys in the layer to keep the layer
active, it means that the layer remains active after the first key in
the layer is used until one of two things occur:

- a key specifically set to deactivate the layer is pressed.
- a key not assigned to anything in the layer is pressed.

As long as a key layer is active, only the final key in the sequence
need be pressed in order to run the script assigned to it.

A key layer may consist of keys set to keep the layer active, keys not
set to keep the layer active, or a combination of both. And, a key layer
may contain keys set to activate an additional nested layer. If you set
a key in a nested layer not to keep the key layer active, all layers are
deactivated after the key is pressed. All layers are also deactivated if
a key is pressed that is not assigned in the nested layer.

You create key layers by using a special syntax in the JKM file when
assigning a key to a script, and you must use a text editor like Script
Manager to edit the JKM file manually.

## Syntax

\
\

    InitialKey&SecondaryKey=ScriptToRun
    InitialKey&SecondaryKey*=ScriptToRun
    InitialKey&SecondaryKey&TertiaryKey=ScriptToRun
    InitialKey&SecondaryKey&TertiaryKey*=ScriptToRun

\

- InitialKey is the key or key combination assignment to activate the
  key layer. It is the first key in the sequence to be pressed.
- SecondaryKey is the key or key combination assignment inside the
  layer. It is the second key in the sequence to be pressed.
- TertiaryKey is the key or key combination assignment inside a nested
  layer. It is the third key in the sequence to be pressed. The second
  key activated the nested layer inside the first layer.
- ScriptToRun is the name of the script assigned to the entire key
  sequence.

## Remarks

Use the ampersand to separate key assignments and create the layer. The
key mapping preceding the first ampersand is the initial key that
activates the layer. The key mapping following the ampersand is the key
inside the layer. Use a third or fourth ampersand to create a nested
layer. The nesting limit is four.

Use the asterisk to set the initial key to keep the layer active. If you
use the asterisk, it must be the final character in the key mapping.

The KeyMapChangedEvent function fires for each key pressed. You can use
this event to code key layer behavior, including playing a sound when a
layer is deactivated. For more details on working with events, see
[Events.](../Events.html)

## Code Sample

In the below code sample, we first show two key assignments for a
nonsense set of scripts that simply announce that they are layered key
sequences. In other words, you cannot activate either script other than
by the layered sequence. It is assumed that Notepad is the application
in use.

The Notepad file shows the following two key assignments:

    [Desktop Keys]
    Control+j&N&1*=MyLayerTest1
    Control+j&N&2*=MyLayerTest2

The below code shows an overwritten KeyMapChangedEvent function that
speaks the statement when the first key that starts the layer is
followed by the correct test layer key. Then the two nonsense scripts
show simply the code that speaks what keys have been pressed in the
sequences.

So to run this test code, you first have to press Ctrl+j. When you
follow this key by the letter n, KeyMapChangedEvent speaks the text that
it is waiting for a layer key to be pressed. As long as you press the
letter \"n\", you may then press either 1 or 2 to cause the scripts in
the layer to run. You may continue to press the numbers 1 and 2
repeatedly because the key assignments for this layer test have the
asterisk at the end of each assignment. If however you press any key
other than a 1 or a 2, the layer exits and you return to normal
functionality.

    Const
        ks_MyTestLayerKey = "Control",
        KeyLayer_myTest = "N"

    Messages
    @msgWaitingForLayerKey
    Please press a layer key.
    @@
    @msgLayerTestKey
    My layer key name is %1 followed by %2, and my current key name is %3.
    @@
    EndMessages

    Void Function KeymapChangedEvent (int iKeyCode, string sKeyName, int iKeyStatus)
    If iKeyStatus == KeySequencePending then
        If StringCompare (sKeyName,KeyLayer_myTest) == 0
            SayMessage(ot_help,msgWaitingForLayerKey)
        EndIf
    EndIf
    KeymapChangedEvent(iKeyCode, sKeyName, iKeyStatus)
    EndFunction

    Script MyLayerTest1 ()
    SayFormattedMessage (ot_JAWS_message,
        FormatString (msgLayerTestKey, ks_MyTestLayerKey,KeyLayer_MyTest,GetCurrentScriptKeyName()))
    EndScript

    Script MyLayerTest2 ()
    SayFormattedMessage (ot_JAWS_message,
        FormatString (msgLayerTestKey, ks_MyTestLayerKey,KeyLayer_MyTest,GetCurrentScriptKeyName()))
    EndScript
