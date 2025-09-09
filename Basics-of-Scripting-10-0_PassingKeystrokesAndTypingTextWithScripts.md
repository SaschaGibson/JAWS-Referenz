# 10.0 Passing Keystrokes and Typing Text with Scripts

People new to writing scripts with JAWS often find it hard to
differentiate between JAWS and Windows keystrokes. For example, the
script writers at Freedom Scientific have attached scripts to common
Windows keystrokes such as **CTRL+C** and **CTRL+V**, copy and paste.
When you press either keystroke, Windows still copies and pastes using
these keystrokes. However, something else also happens; when you press
**CTRL+C** JAWS speaks \"copied selection to clipboard.\" Likewise, when
you press **CTRL+V**, JAWS says, \"Pasted from clipboard.\" These
messages let you know the expected action has taken place.

The scripts associated with these keystrokes are examples of
\"pass-through\" scripts. It is called a pass-through script because
JAWS intercepts the keystroke before it reaches the application and
performs the associated script. The script adds some type of extra
functionality to the keystroke and then passes the keystroke through to
the application. In this case the added functionality is the message
JAWS speaks to notify you the action has been completed.

In this chapter, you will learn how to capture keystrokes, add extra
functionality to those keystrokes and pass them through to the active
application. You will learn how to access menu bars and give keyboard
access to commands in the menu system. You will also learn how to type
text using scripts.

## Table of Contents

Chapter 10.0 Passing Keystrokes and Typing Text with Scripts, contains
the following sections:

[10.1 Pass-Through Scripts](10-1_PassThroughScripts.htm)

[10.2 Giving Keyboard Access](10-2_GivingKeyboardAccess.htm)

[10.3 Delaying Your Script](10-3_DelayingYourScript.htm)

[10.4 Typing Text](10-4_TypingText.htm)

[10.5 Chapter Exercises](10-5_ChapterExercises.htm)

 

  ---------------------------------------------------------- -- ----------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](10-1_PassThroughScripts.htm){accesskey="x"}
  ---------------------------------------------------------- -- ----------------------------------------------------
