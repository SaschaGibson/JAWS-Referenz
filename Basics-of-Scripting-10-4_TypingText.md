# 10.4 Typing Text

You may encounter situations where you have to type the same block of
text repeatedly. For example, you may use a number of different
signatures in your email client. You might use one signature for
business correspondence, while using a second signature for personal
messages. Adding these signatures to their respective email messages may
become tedious. You can create a script that uses built-in functions to
type the information into the message for you with only one keystroke.

## Typing the Text

You can use the built-in function, TypeString, to type a string of text
into a document. You supply the function with the string of text to be
typed by the function as its only parameter. This string of text can be
surrounded by quotation marks, stored in a variable or declared as a
string constant. After JAWS places the text into the document, JAWS
places the insertion point at the end of the string of text. The
following code example illustrates the use of the TypeString function:

TypeString (\"This text is being typed into my document\")

The TypeString function types the following text into your document:

This text is being typed into my document

Since the TypeString function does not add a return character to end the
line just typed, the insertion point is placed to the right of the last
character typed by the function. In the above example, the insertion
point is to the right of the last "t" in the word "text."

## Adding Carriage Returns

When you call the TypeString function multiple times, the text typed is
not separated by spaces. When you want to add a carriage return between
two blocks of text, you must perform this action from within your
script.

The EnterKey built-in function passes the **ENTER** key through to the
active application. If you have positioned the Virtual PC cursor on a
link or button, then the EnterKey function activates it. If the Virtual
PC cursor is on another form control, then the EnterKey function
activates forms mode. You call the EnterKey function using the following
syntax:

EnterKey ()

The following example illustrates the use of the TypeString and EnterKey
functions:

TypeString (\"This is the first line of text.\")

EnterKey ()\
TypeString (\"This is the second line of text.\")

The above example produces the following text in the active application:

This is the first line of text.\
This is the second line of text.

Since the EnterKey function is called between the two TypeString
functions, the text did not run together and is separated by a carriage
return. The same example without the EnterKey function follows:

TypeString (\"This is the first line of text.\")\
TypeString (\"This is the second line of text.\")

This example produces the following text in the active application:

This is the first line of text.This is the second line of text.

Since the EnterKey function was not performed after the first TypeString
function, the text runs together as there is nothing separating the two
strings of text.

 

  ---------------------------------------------------------- -- --------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](10-5_ChapterExercises.htm){accesskey="x"}
  ---------------------------------------------------------- -- --------------------------------------------------
