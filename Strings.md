# Strings Functions

A String function provides, processes, or returns information about a
string of characters. One common use for these functions is to
manipulate a string of characters in some way: chopping characters from
the beginning or the end of a string, comparing two strings, parsing a
string from a delimited list of strings, etc. JAWS uses this information
to determine what to speak and display in Braille, for comparison
purposes, and so on.

The Freedom Scientific Scripting language is rich with Strings functions
for you to utilize in conjunction with many of the Say functions, such
as SayFormattedMessage, for example. String functions may also be used
to read from or write to an INI-style file.

Some examples of String functions include:

- FindString
- FormatString
- IntToString
- StringToInt
- StringSegment
- StringCompare
- StringTrimCommon

For a complete listing of Strings functions, see the topics in this
category book of the Reference Guide.

## Code Sample

Often, string functions are used for comparing window classes, window
names, etc. For instance, you may obtain the window title with a command
to JAWS, **Insert+t**. But what if you just want the name of the
document without the application name. In the below code sample, the
script manipulates some string functions to obtain the title of an
existing Notepad document without speaking or flashing in Braille the
name of the application. There are numerous ways to accomplish this. The
code sample is just meant to show how you might utilize string functions
to obtain a simple piece of information.

It is assumed that the script is being processed in the Notepad.jss
script source file and compiled in the Notepad.jsb script binary file.

To set up the example, open Notepad into an existing document. then run
the script from the document window of Notepad.

    Script MyStringTest ()
    Var
        Handle hReal,
        String sRealName,
        Int iRealLength,
        String sTitle

    hReal = GetRealWindow (GetFocus ())
    sRealName = GetWindowName (hReal)
    iRealLength = StringLength (sRealName) ; the length of the entire real window name
    ; The next statement uses a combination of string functions:
    ; The StringContains function returns an integer representing the location where the real window name and the name of the application begin to match.
    ; For sample purposes only, the part of the string that represents the application name is hard-coded here.
    ; But hard-coding strings is typically not recommended because it is hard to maintain.
    ; In order to chop off the application name from the entire real window name, we must take the lenth of the window name and subtract the integer that StringContains returns from it.
    ; Then we can chop this number off from the real window name, and place the remaining string into the variable, sTitle.
    sTitle = StringChopRight (sRealName, (iRealLength - StringContains (sRealName, " - Notepad")))
    SayMessage (ot_JAWS_message, sTitle)
    EndScript
