# 8.2 The JAWS Message Format

The JAWS message format was first introduced in JAWS 4.0. This new
message format replaced the need for concatenating message constants
together to produce a single message. The message format also makes
modifying your messages much easier. You do not have to worry about
surrounding the entire message text in quotation marks.

The JAWS message format consists of the following parts:

- Messages
- \@MsgName
- message body
- @@
- EndMessages

## Beginning the Block of Messages

You use the key word, Messages, to begin the entire block of messages.
You place this key word at the beginning of your message file. You only
use this key word once within the message file. This key word tells JAWS
that anything following the word is part of your messages block.

## Beginning an Individual Message

All of your individual messages immediately follow the Messages key
word. You start each individual message with the @ symbol followed by
the name of the message. When you name your messages, it is often
helpful to begin the name with \"Msg.\" When you start each message in
this way, you will know immediately where the message is stored when you
reference the message in your script file.

You can think of the message name as a constant. Once you have named an
individual message, you will most likely not modify the message content
during the execution of your scripts. When you reference your message
from within a script, you do not include the @ symbol. This symbol only
tells JAWS that the text immediately following the symbol is the actual
name of the message. For example, if you have messages defined in your
message file as \@Msg1 and \@Msg2, you would reference those messages
using the Say function as follows:

Say (Msg1, OT_MESSAGE)\
Say (Msg2, OT_MESSAGE)

In the above examples, only the actual message name is used as the
parameter for the Say function.

## The Body of the Message

The text to be spoken by JAWS immediately follows the \@MsgName
statement. This is the body of the individual message. The body of the
message can contain any text or punctuation. You can type anything
inside the body of the message that you would in a word processor or
text editor. You can press **ENTER** to create a new line and do not
have to use escape characters to represent certain symbols such as the
backslash. The following example shows the message name and the text
contained in the body of a message:

\@MsgName\
This text is part of the body of a message. Notice it is written just as
if you typed it into a text editor or word processor. When you press the
keystroke to activate the script that uses this message, JAWS speaks
this text.

## Message Placeholders

You can also use placeholders within the body of your message. These
placeholders essentially hold a place in your message for information
you want to add to the message during the execution of your script or
function. You can use up to nine placeholders within the body of the
message. To add a placeholder to your message, type the percent sign
followed by a number from 1 to 9.

You can find the following examples of the use of placeholders in the
common.jsm message file:

;for cMsgMenuItem_L/S, %1=app title, %2=current menu selection, this is
used in SayWindowTitle\
\@cMsgMenuItem_L\
title= %1 menu\
%2\
@@\
\@cMsgMenuItem_S\
%1\
menu\
%2\
@@

The message referenced by MsgMenuItem_L shown above is heard when you
press **INSERT+T** to read the title of an application and a menu is
open. The placeholders allow for changes in the menu name and the
selected item in the menu. This message is heard when you are using
beginner verbosity. The message referenced by MsgMenuItem_S is heard
when you are using intermediate or advanced verbosity.

## Ending the Message

After you have completed the body of the message, you need to end the
individual message. You type 2 @ symbols \"@@\" to tell JAWS that this
is the end of your individual message. You should type the @ symbols
together without spaces between them. The @@ symbols should go on their
own line following the individual message.

The following example shows a complete individual message:

\@MsgName\
This text is part of the body of a message. Notice it is written just as
if you typed it into a text editor or word processor. When you press the
keystroke to activate the script that uses this message, JAWS speaks
this text.\
@@

## Ending the Messages Block

After you have entered all of your messages into your message file, you
must end the messages block. The key word EndMessages tells JAWS this is
the end of all of your messages. You only type this key word once in
your message file. It must follow all individual messages. There is no
space separating the words of \"End\" and \"Messages.\" The following
example shows a complete messages block:

Messages\
\@MsgName\
This text is part of the body of a message. Notice it is written just as
if you typed it into a text editor or word processor. When you press the
keystroke to activate the script that uses this message, JAWS speaks
this text.\
@@\
EndMessages

## Adding Comments

You can add comments at the top of your message file or within the
messages block. Just as in your script file, you begin all comments with
a \";\" semi colon. When you add comments inside the messages block,
make sure you have not added the comments in the body of an individual
message. Even though you begin a comment line with a semi colon, JAWS
will think it is just part of the body of your message. Thus, the
comment will be treated just as if it is part of the message.

An example of comments within a script message file along with an
message block follows:

### Example 1: Full Message Block Example

; JAWS 12.0.512 Message file for Notepad in Windows Vista\
; created by the Freedom Scientific Training Department\
Messages\
; my first practice message\
\@MsgName\
This text is part of the body of a message. Notice it is written just as
if you typed it into a text editor or word processor. When you press the
keystroke to activate the script that uses this message, JAWS speaks
this text.\
@@\
EndMessages

In the above example, the comment within the message block is placed
before the start of the individual message.

 

  ---------------------------------------------------------- -- --------------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](08-3_FormattingYourMessages.htm){accesskey="x"}
  ---------------------------------------------------------- -- --------------------------------------------------------
