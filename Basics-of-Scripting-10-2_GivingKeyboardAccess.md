# 10.2 Giving Keyboard Access

When you encounter an application that does not use keyboard shortcuts,
there are several keystrokes needed to perform a specific menu item.
With a script you can accomplish the same thing with one keystroke. You
can also add a helpful message to the script that JAWS speaks after the
keystrokes have been processed.

Before you write this type of script, you must determine the keystrokes
required to move to the menu, select to the desired item and perform
that item. You should be certain that the keystrokes you pass in your
script match those steps exactly. For example, if you want to select a
menu item that begins with **S** and has no access key, you must make
certain there are no other menu options starting with **S**. If there
are multiple items in the File beginning with **S**, you must use
conditional statements to make sure you are selecting the correct menu
item.

## Moving to the Menu Bar

The first action your script should perform is to move to the menu bar.
You can move to the menu bar in one of two ways:

- Use the ActivateMenuBar function
- Use the TypeKey function

The ActivateMenuBar function moves to or closes the Menu bar for the
active application. When you use this function, it acts as if you
pressed **ALT** to move to the menu bar or to close open menus. This
function is useful in situations where you only want to move to the menu
bar or close menus that are already open.

You can use the TypeKey function to move to the menu bar as well. If you
only want to move to or close the menu bar, you should use the
ActivateMenuBar function. But if you want to move to and open a specific
menu, then the TypeKey function works best. The following examples
illustrate the use of both functions to move to the menu bar:

ActivateMenuBar ()\
TypeKey (\"Alt\")

## Checking the Menu Bar

After you move to the menu bar, you should make sure the move was
successful. You don't want to call the TypeKey function to pass a
keystroke to activate a menu item when your script did not move to the
menu bar successfully. To do so may produce unwanted results. You can
use the MenusActive function to determine the state of the menu bar. The
function returns a constant value of ACTIVE to indicate the move to the
menu bar was successful. When the menu bar is closed, the function
returns the constant value of inactive.

You can use this function in a conditional statement to determine if the
move to the menu bar was successful. The following code example moves to
the menu bar and verifies the move was successful:

### Example 1: Moving to the Menu Bar

ActivateMenuBar (); move to the menu bar\
If MenusActive () Then\
SayFormattedMessage (OT_STATUS, \"The move to the menu bar was
successful\")\
Else\
SayFormattedMessage (OT_ERROR, \"The move to the menu bar was not
successful\")\
EndIf

The following code example moves to the menu bar, opens the File menu,
makes sure the move to the menu was successful then passes **S** through
to the application to activate the Save option. You could use this
example in any application that does not make use of the **CTRL+S**
keystroke shortcut.

### Example 2: Opening and Selecting an Option in the File Menu

; constant definitions for keystrokes\
; these should be added to a JAWS script header file\
Const\
KSFileMenu=\"F\",\
KSSave=\"S\"\
; script to save the current file\
Script SaveFile ()\
ActivateMenuBar ()\
If MenusActive () Then; determine if menu is open\
TypeKey (KSFileMenu); open the File menu\
TypeKey (KSSave); select and initiate the Save action\
Else\
SayFormattedMessage (OT_ERROR, \"The File menu could not be opened.\")\
EndIf\
EndScript

In the above example, the ActivateMenuBar function moves to the menu.
The MenusActive function determines the state of the menu bar. If the
move to the menu was successful, then JAWS performs the two TypeKey
functions to open the File menu and perform the Save option. If the move
to the menu bar was not successful, then JAWS speaks an appropriate
error message.

 

  ---------------------------------------------------------- -- ----------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](10-3_DelayingYourScript.htm){accesskey="x"}
  ---------------------------------------------------------- -- ----------------------------------------------------
