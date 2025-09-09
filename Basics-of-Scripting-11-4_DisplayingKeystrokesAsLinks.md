# 11.4 Displaying Keystrokes as Links

In addition to text, you can create keystroke links in the virtual
viewer. To create a keystroke link in the virtual viewer, you add the
KeyFor function within the body of any individual message stored in a
JAWS message file. The KeyFor function requires the name of a script as
its only parameter.

When JAWS displays the message containing the KeyFor function in the
virtual viewer, JAWS retrieves the keystroke for the script named passed
as a parameter to the function. The keystroke is displayed as a link
that you can activate by pressing **ENTER** on the line containing the
keystroke.

The keystroke is displayed in underlined, blue text on the same white
background as other text contained within the viewer. The syntax for
using the KeyFor function in a message follows:

%KeyFor(ScriptName)

The percent sign preceding the function name acts as a placeholder for
the keystroke within the message. The script name does not include the
parentheses and can be located in either the default or
application-specific script file. An example of a message that contains
the KeyFor function follows:

\@MSGVirtualViewer\
This text is being displayed in the virtual viewer.\
If you want to see a list of general JAWS hot keys, press %KeyFor
(HotKeyHelp).\
@@

JAWS displays the message in the virtual viewer as:

This text is being displayed in the virtual viewer.\
If you want to see a list of general JAWS hot keys, press JAWSKey+H.

JAWS displays the portion of the message, "This text is being displayed
in the virtual viewer," in black text on a white background. JAWS
displays the portion of the message, "If you want to see a list of
general JAWS hot keys, press JAWSKey+H," in blue text on a white
background. The text is displayed in blue text on a white background to
indicate visually the text is part of the keystroke link, **INSERT+H**.
JAWS also indicates verbally that this text is a link.

 

  ---------------------------------------------------------- -- --------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](11-5_ChapterExercises.htm){accesskey="x"}
  ---------------------------------------------------------- -- --------------------------------------------------
