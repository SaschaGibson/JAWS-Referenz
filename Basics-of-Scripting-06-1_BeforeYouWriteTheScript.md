# 6.1 Before You Write the Script

You may find a variety of reasons for moving a cursor around a given
window. Some applications contain buttons that are only accessible with
the mouse or JAWS cursor. These buttons usually cannot be reached by
pressing **TAB** or through the menu system. You may also encounter
applications that place blocks of text in areas of the screen that can
only be read using the JAWS or invisible cursors.

Before you create any script that moves a cursor to read information,
you should determine the outcome of the script. If you are trying to
activate a button within an application window, use cursor movement
keystrokes to move the JAWS or invisible cursors to the button. You
should keep track of each keystroke you press as you move the
appropriate cursor. Each cursor movement command you use has an
equivalent built-in function. For example, the built-in function,
NextLine, acts just like pressing the **DOWN ARROW** from your keyboard.
It moves the active cursor down one line.

Instead of using **INSERT+PAGE DOWN** to read the bottom line of the
screen, use cursor movement commands instead. You can use the JAWS
cursor to accomplish this task by following the steps below:

1.  Press **NUM PAD MINUS** to activate the JAWS cursor.
2.  Press **INSERT+NUM PAD MINUS** to route the JAWS cursor to the
    location of the PC cursor.
3.  Press **PAGE DOWN** to move the JAWS cursor to the bottom of the
    window.
4.  Press **INSERT+UP ARROW** to read the current line.

Now you know the steps needed to move the JAWS cursor to and read the
contents of the bottom line of the window.

You can take these steps and use built-in functions to accomplish the
same task.

You also need to think about which cursor you will use to read or access
the information. Are you going to need mouse commands? Or will you only
need to read the information? Use the JAWS cursor when you will need to
perform mouse commands such as left or right mouse clicking. Use the
invisible cursor when you need to read information but do not need to
perform mouse commands.

You also need to remember not to leave the wrong cursor active when your
script finishes. If you are using the invisible cursor to read
information on the screen, you don\'t want to leave that cursor active
when your script finishes. Instead, you want to make sure the cursor,
which was active before the script is executed, is again activated when
the script finishes.

 

  ---------------------------------------------------------- -- ------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](06-2_PCCursor.htm){accesskey="x"}
  ---------------------------------------------------------- -- ------------------------------------------
