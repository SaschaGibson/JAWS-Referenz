# 8.1 JAWS Message Constants

In prior versions of JAWS, you had to create all of your messages as
constants. A constant is a mnemonic way of representing a group of
hard-to-remember values. Some examples of message constants follow:

Const\
msgSettingSaved_S = \"Setting Saved\"\
msgNoFollowPC_L = \"The Jaws cursor will not follow the PC Cursor\"\
msgNoFollowPC_S = \"Jaws will not follow PC\"\
msgFollowPC_L = \"The Jaws cursor will follow the PC Cursor\"

You can find the above examples in the default.jsm message file located
in your JAWS settings folder. Each message ends with either an \"S\" or
\"L\". Messages ending in \"S\" indicate the message is a short message.
By default, JAWS speaks short messages when you use intermediate or
advanced verbosity settings. The messages ending in \"L\" indicate long
messages. JAWS speaks these messages when you use beginner verbosity
setting.

If you needed to make changes in any of these message constants, you
would have to make sure the quotation marks are in place after the
modifications are complete. Failure to do so causes compilation errors
when you try to compile any script file that includes the default.jsm
message file.

Each time you wanted JAWS to speak multiple messages; you had to
concatenate the messages together to produce one message. If you
remember using hot key help in JAWS 3.7, the information spoken by JAWS
was lengthy. The keystrokes spoken by JAWS were a series of message
constants concatenated together to make the entire list of keystrokes.
An example of string concatenation follows:

\"This is the first part of my message.\" + \" I am using concatenation
to create a single message \" + \"out of 2 or 3 messages.\"

The result of concatenating the 3 strings of text follows:

\"This is the first part of my message. I am using concatenation to
create a single message out of 2 or 3 messages.\"

When you use string concatenation to create a single message, you also
have to remember to use proper spacing. Otherwise, the words of your
message may run together to create an unintelligible message.

 

  ---------------------------------------------------------- -- ------------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](08-2_TheJAWSMessageFormat.htm){accesskey="x"}
  ---------------------------------------------------------- -- ------------------------------------------------------
