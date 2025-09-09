# 2.8 Keyboard Manager Options

You can use the Options menu to change the way information in the right
hand pane of the Keyboard Manager is displayed. You can sort the
information based on a different column, filter out different types of
keystrokes, turn off the confirmation messages, and assign the **TAB**,
**SHIFT+TAB**, **ENTER**, and **ESC** keys to scripts.

When you access any of the items found within the Options menu, the
Keyboard Manager displays the Options multi-page dialog. The active page
corresponds to the option you selected. Press **CTRL+TAB** to move among
the pages. The five pages contained within the dialog going from left to
right are:

- Key Filter
- Messages
- Sort
- Hot Key
- File Filter

## Key Filter Options

You can use the Key Filter page to determine what keystrokes are
displayed within the right hand pane of the Keyboard Manager. You can
choose to display all, active, or application keystrokes only. You can
also choose to display only those scripts that have keystrokes assigned,
or those that do not. This page contains two sets of radio buttons. You
can use the first set of radio buttons to filter keystroke information
based on the actual keystroke. You can use the second group of radio
buttons to filter out information based on the script to which the
keystroke is assigned. The following sections discuss these options.

### All Keystrokes

Use this option when you want to display all keystrokes from both the
application and default key map files. When you choose this option, the
contents of the key map file name column will contain either the name of
the application-specific or default key map file name. This option
allows you to see all keystrokes available within a given application.

### Active Keystrokes

Use this option when you want to display only active keystroke
assignments in both the application specific and the default key map
files. If a keystroke is assigned in both the application and default
key map files, only the application keystroke is active. JAWS always
acts on the first keystroke it finds and it looks in the application key
map file first.

This setting filters out duplicate keystrokes in the default key map
file. For example, when you have a keystroke such as **CTRL+G** defined
in both the application-specific and default key map files, the Keyboard
Manager displays only the keystroke assignment in the
application-specific file. For more information on application-specific
keystrokes versus default keystrokes, see [3.2 Processing
Keystrokes](03-2_ProcessingKeystrokes.htm).

### Application Keystrokes

Use this option when you want to display only keystrokes contained
within the selected key map file. This is the default key filter option.
For example, when you open the Keyboard Manager from within Microsoft
Word 2007, the Keyboard Manager opens the Microsoft Word 2007.jkm key
map file. This is the key map file for Word. The Keyboard Manager
displays only those keystrokes that are specific to Microsoft Word in
the right hand pane.

### All Scripts

Use this option when you want to display all scripts contained within
the selected key map file. This is the default setting. This option
lists all scripts regardless of whether they have a keystroke assigned
to them.

### Scripts Assigned to Keys

Use this option when you want to display only scripts that are assigned
to keystrokes. This option keeps any scripts with the word \"none\"
shown in the keystroke column from being displayed. For example, when
you are viewing the default key map file and you have not installed a
Braille display, choosing this option keeps the keystrokes used in
conjunction with a Braille display from being displayed. Scripts without
keystroke assignments are also not displayed.

## Messages Options

You can use the Messages page of the Options multipage dialog to turn
off the notification messages displayed each time you make a change to
the selected key map file. By default, the Keyboard Manager displays
these messages each time you add, change, or remove a keystroke from the
selected key map file. This page contains only a single checkbox. You
can clear this check box by pressing **SPACEBAR**.

## Sorting Options

You can use the Sort page of the multi-page Options dialog to determine
the column for which information is to be sorted. By default, the
Keyboard Manager displays all keystroke information sorted by the script
name.

This page contains a single group of radio buttons that you can use to
change the sort option. Use your arrow keys to select the column that
you would like to sort by.

## HotKey Options

You can use the HotKey page of the Options multipage dialog to assign
the **TAB**, **SHIFT+TAB**, **ESC**, and **ENTER** keys to scripts
contained within the selected key map file. Each hot key has a check
box, that when checked, allows you to assign the key to a script. Once
you have assigned one of these hot keys to a script, the keystroke no
longer performs its normal function. For example, when you check the
**TAB** check box in the hot key page of the Options multipage dialog
and assign it to a script, you can no longer use the **TAB** key to move
from control to control within a dialog box. You should only use these
keys as a last resort when all options for key assignments have been
exhausted.

To assign one of these hot keys to a script, you must first check the
appropriate check box for the desired key. Next, you can close the
dialog by either pressing **SPACEBAR** on the OK button or by pressing
**ENTER** on the check box for the desired key. After you have closed
the Keyboard Manager Options multi page dialog, select the script or
scripts for which the hot key will be assigned. Choose either the Add
Keystroke or Change Keystroke item from the Action menu. Press the hot
key when prompted by the dialog. After you confirm the modification to
the selected key map file, your keystroke becomes active.

## File Filter Options

You can use the File Filter page of the Options multipage dialog to
indicate which set of key map files JAWS should display in the Keyboard
Manager. This page contains a single group of radio buttons that you can
use to change the file filter option. Use your arrow keys to select the
type of key map files you want to display in the Keyboard Manager. You
can choose from active, user only or shared files. The following
sections discuss these options

### Active Files

Use this option to display all key map files currently in use. If both a
shared and user version of the same key map file exist, only the
user-specific file is displayed. This is the default file filter option.

### User Files

Use this option to display only those key map files that reside in the
user folder on your system. These keystrokes override those in the
shared key map files.

### Shared Files

Use this option to display only those key map files that reside in the
shared folder on your system.

 

  ---------------------------------------------------------- -- --------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](02-9_ChapterExercises.htm){accesskey="x"}
  ---------------------------------------------------------- -- --------------------------------------------------
