# 4.4 Finding and Replacing Text

Like any text editor, you can find specific strings of text. You can
also search for and replace specific strings of text.

## Finding Specific Text

To find specific strings of text choose Find...from the Edit menu or
press **CTRL+F** to display the Find dialog. When the Script Manager
displays the Find dialog, the Find What edit box is active. Type the
desired text and press **TAB** to move to the Match Whole Word only
check box. By default, this check box is unchecked. Press **SPACEBAR**
to check this check box and search for text that matches the entire
search string of text.\
You can then press **TAB** to move to the Match Case check box. This
check box is unchecked by default. Press **SPACEBAR** to check this
check box and cause the search to be case sensitive. Press **TAB** to
move to the Direction set of radio buttons. By default, the Down radio
button is selected. Use your arrow keys to change this option.

After you have entered your text and chosen the desired search options,
press **ENTER** to activate the Find Next button. The Script Manager
moves the insertion point to the first occurrence of the text. If the
text is not found, then the Script Manager plays an appropriate Windows
error sound. This Windows sound indicates the string of text was not
found.

To find the next occurrence of text, select the Find Next option from
the Edit menu or press **F3**. The Find Next action moves the insertion
point to the next occurrence of text within the script file. You can
continue to press **F3** to move through the file until you reach the
end of the file. At that point, you will hear a Windows error sound
advising you that the search string was not found.

To find the prior string of text, choose the Prior Text option from the
Edit menu or press **SHIFT+F3**. The Prior Text action moves the
insertion point to the prior string of text within the script file. You
can continue to press **SHIFT+F3** to move to the prior string of text
until you hear a warning sound. This warning sound indicates you have
reached the top of the file and the search string was not found.

## Incremental Searches

You can use incremental searches to find a specific string of text. An
incremental search is very similar to selecting an option in a combo box
or list box. To initiate the incremental search choose Incremental
Search from the Edit menu or press **ALT+CTRL+I**.

After you have initiated the search, start the search by typing one
character at a time. As you type, the Script Manager matches the
characters you have just typed with the corresponding word within the
script file. For example, you want to search for the SayMessage
function. First, initiate the incremental search. Next, start typing
SayMessage until a match is found.

After the search has matched the first occurrence of the string of
characters you have typed, press **F3** to find the next occurrence of
text or **SHIFT+F3** to find the prior occurrence of text.

**Note:** To start editing after the incremental search finds the first
string of text, press any of the navigation keys to remove the
highlight. If you do not remove the highlight before you start editing,
the Script Manager interprets your keystrokes as additions to the
incremental search. You can also view the text you have typed in the
status line at the bottom of the screen.

## Replacing Text

Like most text editors and word processors, you can find a specific
string of text and replace it with another string of text. Choose the
Replace option from the Edit menu or press **CTRL+H** to display the
Replace dialog. When the Script Manager displays the Replace dialog, the
Find What edit box is active. Type the string of text you want to find
in this edit box. Press **TAB** to move to the Replace With edit box and
type the text you would like to use as a replacement. Press **TAB**
after you have entered the replacement text to move to the Match Whole
Word only check box. By default, this check box is unchecked. Press
**SPACEBAR** to check this check box and force the replace text action
to only replace text that matches the entire search string.

Press **TAB** to move to the Match Case check box. This check box is
unchecked by default. Press **SPACEBAR** to check this check box and
cause the replace text action to be case sensitive.\
A series of command buttons follows the Match Case check box. You can
find the next occurrence of text, replace the first occurrence of text,
or replace all occurrences of text. Press **TAB** to move to the
appropriate button. Press the **SPACEBAR** to activate the button and
carry out the replace text action.

After the Script Manager finishes the find and replace action, you may
hear a Windows system sound. This sound indicates the find and replace
action is complete. Press **ESCAPE** to close the Replace dialog and
return to the Script Manager.

 

  ---------------------------------------------------------- -- ----------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](04-5_ViewingInformation.htm){accesskey="x"}
  ---------------------------------------------------------- -- ----------------------------------------------------
