# 13.4 Customizing an Unknown Application

Many questions should be answered about a new application to determine
what customization is necessary. Before you write your first script, you
should determine how JAWS works with the application without any
customization.

## The Main Application Window

The first place you should start your analysis is the main application
window. Begin by activating the menu bar using the **ALT** key. Explore
the main application window to determine if any of the controls can be
accessed using **TAB** or **SHIFT+TAB**. Note any areas within the main
application window that contain static text. You will also need to
determine if any of the options in the menu or tool bars offer keyboard
access. The following checklist gives you some initial areas to assess
how well JAWS performs:

1.  Do menu bars speak automatically when activated?
2.  Do menu options speak automatically when the arrow keys are used to
    move from option to option?
3.  Can all controls on the main application window be accessed?
4.  Is there keyboard access to menu or toolbar items?
5.  Are there areas of the screen that contain static text that provides
    useful information during application execution?
6.  If there is static text within the main application window, can the
    user quickly locate the text?
7.  Are the tool bars and other important graphics labeled?
8.  What information should be shown on the Braille display for quick
    access?

The above list gives you suggestions for reviewing the main application
window of a new and unknown application. You may find that there are
other items to check that are not contained on the list.

While exploring the application with the JAWS or Invisible Cursors, you
may find graphical buttons that are not labeled. You can find out if the
button has tool tip text associated with it. In order to have JAWS read
tool tip text for a button when the JAWS Cursor is placed on it, you
will need to enable the reading of tool tip text in the verbosity
preferences found in Settings Center. By default, JAWS is configured not
to read tool tip text.

## Dialog Boxes

After reviewing the main application window, you should then check each
of the dialog boxes contained within the application. When the dialog
box first opens, does JAWS speak the name and active control
automatically? Note whether or not the **TAB** and **SHIFT+TAB**
keystrokes move the focus from control to control. You should also note
any areas within each dialog box that contain static text. You can use
the following check list to assess the amount of information spoken by
JAWS within dialog boxes:

1.  Does each text label speak?
2.  If it is a multi-page dialog box, do the page tabs read correctly?
3.  If it is a multi-page dialog box, do **CTRL+TAB** and
    **CTRL+SHIFT+TAB** cycle through the tabs?
4.  Does JAWS announce control types correctly?
5.  Can all controls be accessed while moving through the dialog box
    with **TAB** and **SHIFT+TAB**?
6.  Is each control its own window?
7.  Can static text contained within the dialog box be quickly located?

## Application Structure and Windows Identifiers

After you have made an initial assessment of the application, you will
need to look at information for each of the windows contained within.
You can use the Script Utility Mode to determine things such as
parent-child relationships, control ID values, window classes and more.
You should review the main application window and each subsequent dialog
box in much the same way as before. However, you will need to note
window identification information for each control or window. The
following checklist can help you review the application using the Script
Utility Mode:

1.  Are control ID's defined?
2.  If the control ID's have been assigned, are they dynamic or
    constant?
3.  Does each window have standard window classes?
4.  Are there other unique characteristics for each window?
5.  Review the parent-child relationships in the main application window
    and each dialog box.

## Beginning the Customization

After you have completed a thorough review of the application, you can
now begin to think about how best to customize JAWS to work with it. If
you found non-standard window classes, you should go back through the
application and reassign each non-standard window class to a class that
JAWS recognizes. Keep in mind that once you reassign a non-standard
class, that reassignment is used for each occurrence of the non-standard
window class throughout the application. Many times, reclassifying
non-standard window classes significantly improves the ability of JAWS
to read window information automatically using the default settings. It
is best to be certain that reclassifying windows has not caused unwanted
behavior in other parts of the application.

Before you create scripts to read areas of static text within any of the
application windows, try creating frames around the text first. Creating
frames around static text that is not contained within it's own window
keeps from having to write scripts to access the information. You can
then add frame events to monitor for changes within the boundaries of
the frame and speak new text automatically when it appears. You can also
attach a keystroke to the frame surrounding the text that will allow you
to quickly read the information. Keep in mind though that frames are
dependent on screen resolution and thus may not work correctly on all
computers.

### Customizing JAWS with Scripts

After you have tried frames and reclassifying non-standard window
classes, you may find that you still need to create scripts for the
application. Before you begin to look at the built-in functions used to
create your scripts, there are a few things you should do.

Begin by using pseudo-code to list the steps your script should take to
reach the desired outcome. Pseudo-code is nothing more than writing down
the steps in short phrases that your script will need to complete the
desired action. Write each step of the script down in a list. After you
have written down the initial steps the script will need to execute, try
to recreate those same steps with JAWS commands using the keyboard. You
should also review the notes you made previously when you used the
Script Utility Mode. You may be able to take advantage of the
relationships between parent and child windows to access information
within the application.

After you have either tried recreating the steps using the keyboard or
reviewed the program structure, note any additional steps you had to
take that are not listed in your pseudo-code. Now you can begin to look
at the built-in functions you will need to use to create the script and
achieve the desired outcome. You can follow this procedure for each
script you need to write to customize JAWS to work with the application.

 

  ---------------------------------------------------------- -- --------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](13-5_DebuggingScripts.htm){accesskey="x"}
  ---------------------------------------------------------- -- --------------------------------------------------
