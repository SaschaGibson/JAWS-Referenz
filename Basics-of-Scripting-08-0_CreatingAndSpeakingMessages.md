# 8.0 Creating and Speaking Messages

In this chapter, you will learn how to create messages using the JAWS
message format. You will learn how to create your messages within a JAWS
script message, (.jsm) file. You will also learn how to use long and
short messages to honor your verbosity settings.

In the previous chapters, you created scripts using built-in speaking
functions that used hard-coded messages. A hard-coded message is a
string of text typed directly in a function as a parameter.

Each time you need to change the contents of the message, you must
search the entire file for the message. Once you have located the
message, you have to modify the message being careful not to forget the
quotation marks surrounding the message. You have to do this with each
message contained in your script file.

Rather than using hard-coded messages, you can store all of your
messages in a JAWS script message file (.jsm). This makes it easier to
find all of your messages as they are all in one place. If you ever need
to modify one or more of the messages, you need only to go to the
message file and make the change once. You can include your message in
any number of script files using the include statement.

When you make changes to any of the messages in your message file, you
must recompile each script file that includes the message file. You must
take this extra step so that JAWS sees the changes to your messages.

## Table of Contents

Chapter 8.0 Creating and Speaking Messages, contains the following
sections:

[8.1 JAWS Message Constants](08-1_JAWSMessageConstants.htm)

[8.2 The JAWS Message Format](08-2_TheJAWSMessageFormat.htm)

[8.3 Formatting Your Messages](08-3_FormattingYourMessages.htm)

[8.4 Speaking Your Messages](08-4_SpeakingYourMessages.htm)

[8.5 Chapter Exercises](08-5_ChapterExercises.htm)

 

  ---------------------------------------------------------- -- ------------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](08-1_JAWSMessageConstants.htm){accesskey="x"}
  ---------------------------------------------------------- -- ------------------------------------------------------
