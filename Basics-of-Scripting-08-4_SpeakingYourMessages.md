# 8.4 Speaking Your Messages

After you have created your messages, you can use one of the built-in
speaking functions to speak the message. Your choices are:

- Say
- SayMessage
- SayFormattedMessage

You will find other functions that speak messages such as SayUsingVoice,
but the three listed above are the most widely used.

The Say built-in function does offer the flexibility of allowing for
user verbosity preferences about types of messages spoken by JAWS.
However, the function does not honor your message length verbosity
setting. In other words, the function does not allow for short and long
messages. For example, pressing **CTRL+C** to copy text to the clipboard
while using beginner verbosity causes JAWS to speak \"Copied selection
to clipboard.\" When you press the same keystroke to copy text using
intermediate verbosity, JAWS speaks \"copied.\"

The SayMessage and SayFormattedMessage built-in functions not only allow
for output type considerations, but also allow for short and long
messages. Of the 2 functions, the SayFormattedMessage function is the
newest and is more widely used by script developers at Freedom
Scientific. Therefore, you should always use the SayFormattedMessage
function when speaking messages in your scripts.

## Using the SayFormattedMessage Function

When you use the SayFormattedMessage function to speak messages in your
scripts, you must provide two parameters; output type and long message.
A third parameter, the short message, is an optional parameter along
with nine additional parameters for substituting place holder values.
You should always try to provide a short message when you are speaking
messages to account for both long and short message length settings.

The first parameter is an output type constant. This output type
constant represents a numeric value that indicates the message type.
JAWS uses this value to determine how and when to speak the message. You
can find a list of all output type constants in the default constant
file, HJConst.jsh. Output type values range from screen messages, help
messages, smart help messages, and more.

You should determine what type of output type to use based on the
context of your message. For example, when you create a help message
that is spoken from a script, you should choose the OT\_ HELP output
type constant. This constant value tells JAWS this is a help message and
it should be spoken accordingly. Not only should you consider the
context of the message, but you should also consider the possibility of
the message being turned off from within the Settings Center. You do not
want a critical error message turned off. You can use the output type
constant, OT_NO_DISABLE, to tell JAWS to always speak the message. When
you use this constant value, JAWS will speak the message regardless of
the verbosity setting in use.

You provide the long message in the second parameter of the
SayFormattedMessage function. JAWS speaks this message when you are
using the beginner verbosity setting. When you create this message in
your message file, you can append the text of \"\_L\" to indicate the
long message. For example, you could use the following message names to
indicate long messages:

MsgMyName_L\
MsgCopiedText_L

When you add the \"\_L\" to the end of your message name, you can easily
identify the message in your script file as being a long message.

You provide the short message as the third parameter of the
SayFormattedMessage function. JAWS speaks this message when you use the
intermediate or advanced verbosity setting. You can indicate the short
message in your message file in much the same way as the long message.
You can append \"\_S\" to the end of the message name. For example, the
short versions of the previous long message examples would be:

MsgMyName_S\
MsgCopiedText_S

When you add \"\_S\" to the end of your short messages, you can easily
identify them in your script files.

**Note:** The short message parameter is optional. If you only want to
speak one message regardless of the message length setting, do not
provide a message in this parameter. You can also use the message
constant value of cmsgSilent. You can find this message in the
common.jsm message file located in your JAWS shared settings folder.

The fourth through the twelfth parameters are optional and should be
used to substitute values for percent place holders you may have used in
your message. For example, the fourth parameter of SayFormattedMessage
should be the value that will replace %1 in your message. These values
can be quoted strings of text, constants, variables, or functions that
return string values. If you did not use percent place holders in your
message you should not use these parameters.

 

  ---------------------------------------------------------- -- --------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](08-5_ChapterExercises.htm){accesskey="x"}
  ---------------------------------------------------------- -- --------------------------------------------------
