# Screen Text Functions

A Screen Text script or function provides or returns information about
screen text activities caused by user interaction or automatically
updated by an event. JAWS uses this information to determine whether to
speak and display screen text in Braille, for comparison purposes, and
so on.

Many scripts that ship with JAWS fall into the category of screen text
user interaction, such as:

- SayCharacter
- SayWord
- SayLine
- SpellWord
- SpellLine

However, the focus of the present discussion is on functions related to
screen text that you may call from your own scripts or that you may
overwrite from those in default.jss or from the built-in functions.

Some examples of Screen Text functions include:

- GetCharacter
- GetWord
- GetLine
- PhoneticSpellHook
- SpellWordHook

For a complete listing of Screen Text functions, see the topics in this
category book of the Reference Guide.

## Code Sample

In the below code sample, the script checks to see whether there is a
character on the current line. If no character is found, the screen
reader indicates an error message and the script ends. If a character is
found, JAWS displays in the virtual viewer what the current character,
current word, and current line are so that you may read the information
however you prefer.

To set up the example, simply type some text into the Notepad document
window. Then run the script repeatedly after moving the cursor to
different positions on the current line, or on a line with no text.

It is assumed that the script is being processed in the Notepad.jss
script source file and compiled in the Notepad.jsb script binary file.

    Script MyScreenTextTest ()
    Var
        String sChar, ;current character
        String sWord, ; current word
        String sLine, ; current line
        String sTextUnit, ; current unit - character, word, or line
        String sMsgText_l, ; long message saying the current type of unit and what it is.
        String sMsgText_s,  ; short message saying the current type of unit and what it is.
        String sMsgNoText ; error message if no text is found.

    ;Ensure that the document window has the focus and not a menu or dialog.
    If DialogActive ()
    || GetObjectSubtypeCode () != wt_multiline_edit
        Return
    EndIf
    Let smsgNoText = "There is no text on this line."

    Let sChar = GetCharacter ()
    ; Test for whether there is no character.
    ; If no character is found on the current line, there is no point in trying to find the current word or line.
    If sChar == cscNull
        SayMessage (ot_error,sMsgNoText)
        Return
    EndIf
    Let sWord = GetWord ()
    Let sLine = GetLine ()
    ; for sMsgText_l and sMsgText_s, %1 is the type of text unit, %2 is the text of that text unit.
    Let sMsgText_l = "The current %1 is %2"
    Let sMsgText_s = "current %1 - %2"

    ;Ensure there is no virtualized message already in the user buffer.
    ; If so, clear the user buffer.
    If UserBufferIsActive ()
        UserBufferDeactivate ()
    EndIf
    UserBufferClear ()

    ; Since a character is found:
    sTextUnit = "character"
    UserBufferAddFormattedMessage (sMsgText_l, sMsgText_s, sTextUnit, sChar + cscBufferNewLine)

    If sWord != cscNull ; A word is found.
        sTextUnit = "word"
        UserBufferAddFormattedMessage (sMsgText_l, sMsgText_s, sTextUnit, sWord + cscBufferNewLine)
    EndIf

    If sLine != cscNull ; A line is found.
        sTextUnit = "line"
        UserBufferAddFormattedMessage (sMsgText_l, sMsgText_s, sTextUnit, sLine + cscBufferNewLine)
    EndIf

    UserBufferAddText (cscBufferNewLine + cMsgBuffExit)
    UserBufferActivate ()
    JAWSTopOfFile ()
    PerformScript SayAll ()
    EndScript

## XML Funtions

An example of a function that works with XML is GetScreenXML. The "XML"
refers to how the information that JAWS can retrieve from the screen is
marked up. You can use this function if there is no other way to get
information about the text on the screen.

Code Sample

You might use this function to get the screen XML as follows:

    Var
        Int left,
        Int right,
        Int top,
        Int bottom

    GetWindowRect (GetFocus(), left, right, top, bottom)

    Var
        String sScreenXML = GetScreenXML (left, top, right, bottom)

Now check to see if the string sScreenXML contains information from the
screen that you can use enclosed in an XML tag structure. If it does,
change this into an object collection, using code such as:

    Var
        Object oMSXML = CreateObject("msxml2.DOMDocument.6.0")

    If !oMSXML
        SayString("Did not get oXML")
       Return
    EndIf
    oMSXML.async = false
    oMSXML.resolveExternals = false
    oMSXML.loadXML(sScreenXML)

Now that you have an object structure, you can use XML extraction
methods to get nodes of interest.

Some areas of the JAWS code that illustrate how to extract nodes and
node information are:

- HomeRowUIAObject.jss
- LiveResourceLookup.jss
- Skype.jss

Note: You must have an understanding of xPath and xQuery to work with
the nodes and extract information from the object tree. But you can try
to see if the application has UIA support because that might be a better
method to implement.

## Additional Resources

For more details on working with hooking functions such as the hook
functions listed above, see the Key Management summary in the General
Scripting Concepts book called [Hook
Functions.](../Key_Management/Hooks.html)

For more details on working with the virtual viewer, see the summary in
the General Scripting Concepts book called [Implementing a Virtual
Viewer Window.](../Virtual_Viewer_Functions.html)

For more information on Microsoft MSXML COM objects, see the Microsoft
Developer Network for [Building MSXML
Applications](https://docs.microsoft.com/en-us/previous-versions/windows/desktop/jj152146(v%3Dvs.85))
