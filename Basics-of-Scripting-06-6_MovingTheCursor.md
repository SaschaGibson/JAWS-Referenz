# 6.6 Moving the Cursor

After you have activated, saved, and moved the JAWS or invisible cursor
to the active application window, you can move the cursor.

Nearly all of the keyboard commands you use to move the various cursors
within JAWS have corresponding built-in functions. For example, pressing
**DOWN ARROW** to move the cursor to the next line has a comparable
built-in function of NextLine. Likewise, pressing **RIGHT ARROW** has a
comparable built-in function of NextCharacter.

**Note:** When you press **DOWN ARROW** to read the next line, behind
the scenes JAWS activates the SayNextLine script. The SayNextLine script
does more than just move the cursor down to the next line. The script
determines what type of window is active and then reads the information
accordingly.

## JAWSPageDown and JAWSPageUp

The JAWSPageDown and JAWSPageUp built-in functions perform special
versions of their respective keyboard commands. You can use these
functions when any of the cursors are active. However, the outcome of
the function is based on the active cursor.

When the PC cursor is active, each function performs the standard **PAGE
UP** and **PAGE DOWN** commands for the application. For example, when
you press **PAGE DOWN** from within a word processor, the PC cursor is
moved down a screen of information. Likewise, when you press **PAGE UP**
from within a word processor, the PC cursor is moved up one screen of
information.

### Example 1: Using the JAWSPageDown function with the PC cursor

PCCursor (); activate the PC cursor\
SaveCursor (); save the location of the PC cursor\
JAWSPageDown (); performs a page down command using the PC cursor

In the above example, the PC cursor is activated and then saved before
it is moved. Next, the JAWSPageDown function moves the PC cursor down
one screen of information.

When the JAWS or Invisible cursor is active, the JAWSPageDown function
moves the cursor to the bottom of the active window based on the cursor
restriction setting. Likewise, the JAWSPageUp function moves the JAWS or
Invisible cursor to the top of the active window based on the
restriction setting.

### Example 2: Using the JAWSPageDown function with the Invisible cursor

InvisibleCursor (); activate the Invisible cursor\
SaveCursor (); save the location of the Invisible cursor\
RouteInvisibleToPC (); move the Invisible cursor to the location of the
PC cursor\
JAWSPageDown (); move the Invisible cursor to the bottom of the screen

In the above example, the Invisible cursor is activated and then saved.
Next, the RouteInvisibleToPC function routes the Invisible cursor to the
location of the PC cursor in the active window. Finally, the
JAWSPageDown function moves the Invisible cursor to the bottom of the
active window.

**Note:** The JAWS restriction setting is set to application by default.
This setting keeps the JAWS and Invisible cursors within the boundaries
of the active application window. You can cycle through the various
restriction settings by pressing **INSERT+R**. See the JAWS help system
for more information on cursor restriction settings.

## JAWSEnd and JAWSHome

The JAWSEnd and JAWSHome built-in functions perform special versions of
their respective keyboard commands. Like the JAWSPageDown and JAWSPageUp
functions, you can use these functions when the PC, JAWS, or Invisible
cursor is active. However, the outcome of each function is based on the
active cursor.

When the PC cursor is active, each function performs the standard
**END** and **HOME** commands for the application. For example, when you
press **END** from within a word processor, the PC cursor is moved to
the end of the current line. Likewise, when you press **HOME** from
within a word processor, the PC cursor is moved to the beginning of the
current line.

### Example 3: Using the JAWSHome function with the PC cursor

PCCursor (); activate the PC cursor\
SaveCursor (); save the location of the cursor\
JAWSPageDown (); move the PC cursor down one screen\
JAWSHome (); move the PC cursor to the beginning of the line

In the above example, the PC cursor is activated, saved, and moved down
one screen. The JAWSHome function then moves the cursor to the beginning
of the line. When you execute this block of code, the PC cursor is
limited to the active window.

When either the JAWS or Invisible cursor is active, the JAWSEnd function
moves the cursor to the last text character or graphic on the line
within the active window. Likewise, the JAWSHome function moves the
cursor to the first text character or graphic on the current line within
the active window. The active window is based on the cursor restriction
setting.

### Example 4: Using the JAWSHome function with the Invisible cursor

InvisibleCursor (); activate the Invisible cursor\
SaveCursor (); save the location of the invisible cursor\
RouteInvisibleToPC (); move the Invisible cursor to the location of the
PC cursor\
JAWSPageDown (); move the Invisible cursor to the bottom of the screen\
JAWSHome (); move the Invisible cursor to the beginning of the current
line

In the above example, the Invisible cursor is activated, saved, moved to
the location of the PC cursor and moved to the bottom of the screen.
Next, the JAWSHome function moves the Invisible cursor to the beginning
of the current line. By moving the Invisible cursor to the beginning of
the current line, you now have a distinct starting point. You can then
use a number of other built-in movement functions to move the Invisible
cursor across the line to read a specific piece of information such as a
line number.

## Next and Prior Cursor Movement

You can also use built-in functions to move to the next or prior piece
of information. Many of these functions also have equivalent keyboard
commands like the JAWSEnd, JAWSHome, JAWSPageDown, and JAWSPageUp
functions.

You can use these functions with any of the three cursors. However, the
outcome of the function is determined by the active cursor. For example,
if you move the JAWS cursor to the title bar of the active application,
you can continually press **INSERT+RIGHT ARROW** to move across the
title bar a word or graphic at a time. When you continually press the
keystroke, the JAWS cursor does not stop at the end of the line. Rather,
it continues to move on to the next line until you reach the bottom of
the window.

On the other hand, you can only move the PC cursor within the document
edit area of a word processor when you continually press **INSERT+RIGHT
ARROW**. Once you reach the bottom of the document edit window, the PC
cursor can move no further.

**Note:** When you continually press **INSERT+RIGHT ARROW**, JAWS
activates the SayNextWord script. The script must determine how to read
the next word based on the active window. When you use any of the
built-in functions to move to the next item, the active cursor is only
moved to that item, but, does not speak it.

The following list of functions moves the active cursor based on the
name of the function. For example, the NextWord function moves the
active cursor to the next word. The NextSentence function moves the
active cursor to the next sentence and so on.

- NextCharacter ()
- NextLine ()
- NextParagraph ()
- NextSentence ()
- NextWord ()
- PriorCharacter ()
- PriorLine ()
- PriorParagraph ()
- PriorSentence ()
- PriorWord ()

### Example 5: Using the NextWord function

InvisibleCursor (); activate the invisible cursor\
SaveCursor (); save the location of the Invisible cursor\
RouteInvisibleToPC (); move the invisible cursor to the location of the
PC cursor\
JAWSPageDown (); move the Invisible cursor to the bottom of the screen\
JAWSHome (); move the Invisible cursor to the beginning of the current
line\
NextWord (); move the Invisible cursor to the next word or graphic

In the above example, the Invisible cursor is activated, saved, and then
routed to the location of the PC cursor. Next, the invisible cursor is
moved to the bottom of the screen and then to the beginning of the
current line. The NextWord function then moves the Invisible cursor to
the next word or graphic on that line.

 

  ---------------------------------------------------------- -- --------------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](06-7_SpeakingTheInformation.htm){accesskey="x"}
  ---------------------------------------------------------- -- --------------------------------------------------------
