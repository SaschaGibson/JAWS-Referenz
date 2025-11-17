# 10.5 Chapter Exercises

The following exercises give you practice creating scripts that pass
keystrokes, access menu options that do not have shortcut keys and type
text into the active document window. These chapter exercises do not
walk you through the steps needed to create the script. Instead, the
goal of the script is shown first, the script documentation second and
the code of the script third. If you need to review the steps used to
create a script or add functions to the script, refer to chapters 1
through 9 for information on the steps needed to start the Script
Manager and the use of the New Script dialog.

## Exercise 10.1: Creating a Pass-Through Script

The objective of this exercise is to create a pass-through script that
takes an existing application keystroke and enhances its functionality.
Within Internet Explorer, you can press, **ALT+HOME**, to move
immediately to your home page. When you press this keystroke, Internet
Explorer does not indicate audibly that you are going back to your home
page.

Create this script within the script file for Internet Explorer,
Internet Explorer.jss. .

Your script should begin by passing the **ALT+HOME** keystroke through
to Internet Explorer. Before the script completes, JAWS should speak an
informational message advising you that you are now going back to your
home page.

After you have compiled the script, you can test the script by going to
a Web page other than your home page and pressing **ALT+HOME**. After
you hear JAWS speak the informational message, your home page should
begin loading into Internet Explorer. If you find that your home page is
loaded into Internet Explorer, then you can confirm the action was
successful.

### Script Documentation:

- Script Name: GoToHomePage
- Attach to Key: Checked
- Synopsis: Loads your home page.
- Description: Passes ALT+HOME to Internet Explorer to load your home
  page and announces it.
- Category: Keyboard
- Assign To: **ALT+HOME**

### GoToHomePage Script:

Script GoToHomePage ()\
TypeKey (\"ALT+HOME\")\
SayFormattedMessage (OT_STATUS, \"Go to home page.\", cMsgSilent)\
EndScript

**NOTE:** You can add the messages JAWS speaks to a JAWS header or
message file and then include that file within the script file for
Internet Explorer. See 8.0 Creating and Speaking Messages for more
information on creating JAWS message files and adding messages to the
file.

## Exercise 10.2: Typing Text with a Script

The objective of this exercise is to create a script that types your
e-mail signature in any active application window. You can use this
script in your e-mail application, any text editor, or a word processor.

You can use a series of TypeString functions to type the text of your
signature. Between each call to the TypeString function, be sure to
insert calls to the EnterKey function. After you have typed all the
necessary text for your signature, JAWS should speak a message informing
you the signature was added.

### Script Documentation:

- Script Name: TypeSignature
- Can be Attached to Key: Checked
- Synopsis: Types an e-mail signature in any application.
- Description: Types an e-mail signature in any application using the
  TypeString function.
- Category: Keyboard
- Assign To: **CTRL+SHIFT+W**

### TypeSignature Script:

Script TypeSignature ()\
TypeString (\"Training Department\")\
EnterKey ()\
TypeString (\"Freedom Scientific Inc.\")\
EnterKey ()\
TypeString (\"11800 31st CT. N\")\
EnterKey ()\
TypeString (\"St. Petersburg, FL 33716\")\
EnterKey ()\
TypeString (\"PH: (800) 444-4443\")\
EnterKey ()\
TypeString (\"FAX: (727) 471-7927\")\
EnterKey ()\
TypeString (\"training_info@FreedomScientific.com\")\
EnterKey ()\
SayFormattedMessage (OT_STATUS, \"Signature added\")\
EndScript

 

  ---------------------------------------------------------- -- -------------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](11-0_UsingTheVirtualViewer.htm){accesskey="x"}
  ---------------------------------------------------------- -- -------------------------------------------------------
