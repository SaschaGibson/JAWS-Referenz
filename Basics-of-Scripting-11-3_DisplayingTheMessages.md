# 11.3 Displaying the Messages

After you have created your messages and determined the virtual viewer
is not active, you are ready to display text in the virtual viewer. You
can use either of the following functions:

- SayMessage
- SayFormattedMessage

Each of these functions requires two parameters. The first parameter is
the output type that tells JAWS how to speak or display the message. You
use the output type constant, OT_USER_BUFFER, in either function to tell
JAWS to display your message within the virtual viewer.

The second parameter is the text of the message JAWS displays in the
virtual viewer. This parameter can be a quoted string of text, a string
variable containing the text or a message constant contained within a
JAWS message file. Examples of the use of both statements follow:

SayMessage (OT_USER_BUFFER, \"This text is being displayed in the
virtual viewer\")

SayFormattedMessage (OT_USER_BUFFER, \"This text is being displayed in
the virtual viewer.\")

 

  ---------------------------------------------------------- -- -------------------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](11-4_DisplayingKeystrokesAsLinks.htm){accesskey="x"}
  ---------------------------------------------------------- -- -------------------------------------------------------------
