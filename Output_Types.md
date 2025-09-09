# Output types

The Freedom Scientific Scripting language supports the use of many
output types in order to control what is spoken and displayed in Braille
at any given time. Output types are constants that represent numeric
values indicating how and under what circumstances to output any content
you specify in your scripts and functions.

When determining which output type to use in a function call that
requires an output type parameter, you need to consider the context of
the message, and also whether the message may be turned off from within
JAWS Settings Center. For example, the output type for error messages is
typically set to OT_ERROR, although this output type may be turned off
from within Settings Center.

## Definitions of Output Types

The output type constants are all listed in the default constant file,
HJConst.jsh. Their values range from screen messages to help messages
and smart help messages to tutor help messages, and more.

Note: The settings for the user verbosity of some output types are off
by default. For example, tool tips are off by default in JAWS. Generally
speaking, forcibly enabling an output type for one that the user could
otherwise normally turn off from within Settings Center is not
recommended because it disables the user\'s ability to control that
setting. Therefore, be judicious when applying the following logic and
do so only for very specific situations. We use the tool tip output type
as an example. Tool tip is one of the output types that you may control
from within Settings Center:

1.  Save the status of the setting for tool tips verbosity in a local
    variable.
2.  Test that status for whether it is on or off. If it is off, turn it
    on.
3.  Under the conditions of the event where you want to cause a message
    to be announced no matter how the user normally has tool tips set to
    output, call the function containing the tool tip output type
    parameter for that message to be announced just for the specific
    scenario you need announced.
4.  Restore the status of the tool tips verbosity to how it was set
    prior to turning it on to ensure that your message is processed
    correctly and gets announced. This is where you may use the value
    stored in that local variable as shown in Step 1 above.

Most of the names of the output type constants are self-explanatory. The
Below list contains brief descriptions where a definition may clarify
how to utilize the output type. Unless the description specifies
Braille, no Braille flash message is processed from an output type. The
following output type constants are available:

- OT_BUFFER
- OT_NO_DISABLE: Used to ensure that content is spoken regardless of
  what user verbosity settings and message lengths for output are in
  effect
- OT_HELP: Braille output is \"help\" followed by content
- OT_APP_START
- OT_JAWS_MESSAGE: Braille output is \"jm\" followed by content that is
  not on screen but meant to convey something from JAWS specifically
- OT_SCREEN_MESSAGE: Content is intended to convey screen message that
  is typically not a part of content at the cursor location but is
  visually on screen elsewhere, or is related to what is at the cursor
  location
- OT_CONTROL_NAME
- OT_CONTROL_TYPE
- OT_DIALOG_NAME
- OT_DIALOG_TEXT
- OT_DOCUMENT_NAME
- OT_SELECTED_ITEM
- OT_ITEM_STATE
- OT_POSITION
- OT_ERROR: Braille output is \"err\" followed by an error message
- OT_ITEM_NUMBER
- OT_TOOL_TIP
- OT_STATUS
- OT_CONTROL_GROUP_NAME
- OT_SMART_HELP: Braille output is \"shlp\" followed by content
- OT_SELECT
- OT_TUTOR
- OT_ACCESS_KEY
- OT_HELP_BALLOON: Braille output is \"hbln\" followed by content, for
  Windows XP
- OT_USER_REQUESTED_INFORMATION: Braille output is \"usr\" followed by
  content that user requests on demand
- OT_CONTROL_DESCRIPTION
- OT_DEBUG
- OT_TOASTS: Braille output is \"tst\" followed by auto-play
  notofications of thumb drives; available as of JAWS 17.0.1377 and
  later in Windows 8.1, and JAWS 18 in Windows 10

The following are duplicates:

- OT_HELP_BEGINNER
- OT_WINDOW_NAME
- OT_APP_NAME
- OT_MESSAGE
- OT_STATIC
- OT_SELECTED

Use this one only for internal testing:\
OT_STRING: Used only for debugging

- OT_GRAPHIC
- OT_CHAR: Uses speech markup appropriate to speaking by character. Uses
  pitch change for capitalization if voices are set to change pitch for
  capitalization.
- OT_WORD: Uses speech markup appropriate to speaking by word. Speaks a
  string of spaces as \"space\".
- OT_CHUNK: Speaks a specified chunk of information based on the
  particular parameters of the calling function utilizing the output
  type
- OT_LINE: Uses speech markup appropriate to speaking by line. Speaks a
  string of spaces as \"blank\".
- OT_SPELL
- OT_SAYALL
- OT_KEYBOARD
- OT_USER_BUFFER: Used to redirect SayMessage and SayFormattedMessage
  strings to the User Buffer
- OT_PHONETIC_CHAR: Speaks characters phonetically
- OT_BRAILLE_MESSAGE: Used only for debugging
- OT_HIGHLIGHTED_SCREEN_TEXT
- OT_NONHIGHLIGHTED_SCREEN_TEXT
- OT_MOUSE_SPEECH
- OT_MOUSE_SPEECH_CONTROL_TYPE
- OT_MOUSE_SPEECH_ITEM_STATE
- OT_ANNOUNCE_POSITION_AND_COUNT

The following are depricated output modes:

- OT_TEXT
- OT_WINDOW_INFORMATION
- OT_DIALOG_INFORMATION
- OT_APP_INFORMATION
- OT_FONT
- OT_CURSOR

## Code Samples of Output Type Usage

Following are several code samples to illustrate the power of output
types.

### Message Length Verbosity

This code sample makes use of the long and short message verbosity
capabilities of JAWS:

    Script TestOutputTypes ()
    ; This silly message speaks a message that is not on screen and displays it as a flash message in Braille as long as the Braille flash message and Braille message verbosity is set to the default values.
    ; Depending on whether the user verbosity is set to process long or short messages, either the long message or the short one is spoken and Brailled.
    ; By default, long messages are always processed.
    Var
        String msgMyLongMessage_l,
        String msgMyShortMessage_s
    Let msgMyLongMessage_l = "Hello, I am a long message."
    Let msgMyShortMessage_s = "Hello."
    SayMessage (OT_HELP, msgMyLongMessage_l,msgMyShortMessage_s)
    EndScript

### Setting the Output Type for Proper Processing

This code sample places the setting of the output type to spell text
phonetically into a local variable. It then tests for whether that
option is on or off; if off, it turns on the output type. It processes a
nonsense message using the \"spell\" output type. Then it restores the
setting for the output type to its former state if necessary. Finally,
it processes the message again, this time with the output type in its
normal state.

    Script TestChangingOutputTypeStatus ()
    Var
        String msgMyLongMessage_l,
        String msgMyShortMessage_s,
        Int iSpellPhonetic

    msgMyLongMessage_l = "Hello there."
    msgMyShortMessage_s = "Hello."
    iSpellPhonetic = GetJCFOption(OPT_spell_phonetic)
    If !iSpellPhonetic then
        SetJCFOption(OPT_spell_phonetic,on)
    EndIf
    ; Spell the message phonetically.
    SayMessage(ot_spell,msgMyLongMessage_l,msgMyShortMessage_s)
    If GetJCFOption(OPT_spell_phonetic) != iSpellPhonetic then
        SetJCFOption(OPT_spell_phonetic,iSpellPhonetic) ; restore to prior state
    EndIf
    ; Spell the message normally.
    SayMessage(ot_spell,msgMyLongMessage_l,msgMyShortMessage_s)
    EndScript

### Output Type for use in the Virtual Viewer

This code sample places the text of the message into the virtual viewer.
Press Esc to exit the virtual viewer if you run this sample in a script.

    SayMessage(ot_user_buffer,"Hello, world.")
