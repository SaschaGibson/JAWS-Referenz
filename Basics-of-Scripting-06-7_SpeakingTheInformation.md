# 6.7 Speaking the Information

As you learned in the previous section, the movement functions built
into JAWS only move the cursor, but do not speak any information. You
must use another built-in function to actually speak the information
found at the active cursor location.

In section 6.1 you used a number of keystrokes to move the JAWS cursor
to read the bottom line of the active window. You used **INSERT+UP
ARROW** to read the contents of the bottom line of the window as the
last step. If you were to look at the actual code of the SayLine script,
you would see the script uses a built-in function, SayLine, to read the
current line.

You can use built-in functions to read the current character, word,
line, and more. You can also use built-in functions to read information
from the cursor location to either the beginning of the line or the end
of the line. You can use the functions listed below to read a specific
piece of information. For example, the SayCharacter function speaks the
current character while the SayWord function speaks the current word.
The list of functions follows:

- SayCharacter ()
- SayChunk ()
- SayField ()
- SayLine ()
- SayParagraph ()
- SaySentence ()
- SayWord ()

The functions listed below all speak information beginning at the
location of the active cursor:

- SayFromCursor ()
- SayToCursor ()
- SayToBottom ()
- SayToPunctuation ()

**Note:** You can find more information for any of the functions listed
above by reviewing the documentation file for functions built into JAWS,
builtin.jsd. You can view this file in the Script Manager or in any text
editor. You can find this file in the JAWS shared settings folder.
Navigate to the JAWS program group in the Start menu and choose Explore
JAWS \> Explore Shared Settings. This opens a Windows Explorer screen
where you can find all of the original JAWS script files.

 

  ---------------------------------------------------------- -- --------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](06-8_ChapterExercises.htm){accesskey="x"}
  ---------------------------------------------------------- -- --------------------------------------------------
