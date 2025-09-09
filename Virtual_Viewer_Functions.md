# Implementing a Virtual Viewer Window

JAWS offers a unique method for viewing certain types of documents and
for displaying certain types of information on the screen. A \"virtual
document\" is a simplified and logically displayed, navigable
representation of a complex document which itself may not be directly
navigable. JAWS automatically virtualizes the user\'s experience in the
supported browsers: Google Chrome, Edge Chromium, Firefox, and Internet
Explorer, and applications such as Adobe Acrobat Reader, and Microsoft
Outlook read-only messages. Braille tracks what JAWS announces as you
navigate through a virtualized message or document, Web page or HTML
help window. Since UIA support is ever more robust, there are situations
where you can have one browser window automatically virtualized and
another not. An example where not virtualizing a browser window works
best is the Google web-based EMail application. and, in some cases, JAWS
provides a mixture of virtualized and un-virtualized options within the
same browser application - for example, Google Docs.

## The Virtual Viewer Window

The Freedom Scientific Scripting language lets you create virtual viewer
windows using scripts and built-in functions. The virtual viewer is also
referred to as the user buffer. And numerous functions and constant
definitions refer to the \"user buffer\".

The virtual viewer window (user buffer) displays text and other elements
reformatted so you may peruse the content without affecting the current
application. For example, JAWS utilizes the virtual viewer to display on
demand hotkey help, general Windows help, screen-sensitive help, and
more. Once the virtual viewer window has the focus, you may examine its
content by using any standard reading commands and with SayAll.

Typically, you may dismiss a virtual viewer window by pressing
**ESCAPE** or **ALT+F4**. And if it contains links to non-virtualized
environments, you may dismiss a virtual viewer window by pressing
**ENTER** on those links.

When JAWS displays information in the virtual viewer, the virtual cursor
is active. As mentioned above, you can use normal navigation keystrokes
to read all the text in the virtual viewer window. But you may also
select any part of that text and copy it to the clipboard.

By default, when a script or function generates text to be displayed in
the user buffer, that text is displayed in the virtual viewer as black
on a white background, has a font size of 12 and a font type of Arial.
The text displayed in the virtual viewer is identical to text found in
any word processor or text editor. But you may control how the text is
displayed, and even whether it is visually displayed at all, depending
on what functions you use to place text into the virtual viewer, and
whether certain JAWS options are enabled.

At Times, you may prefer virtualized text to be invisible in order not
to distract from what is visually on screen. If the option to show
virtual viewer on screen is turned off, the virtual viewer does not
appear visually on screen; however, the virtual viewer does appear to
the speech and Braille user as if it were actually on the screen.
Examples of this occur in Microsoft Excel and in Microsoft PowerPoint
slide shows.

## The Results Viewer

Since JAWS 11.0, JAWS offers an application called the Results viewer,
which is an extension of the virtual viewer concept. But a Results
viewer window is actually a separate application that runs as part of
the extensive JAWS features. A virtual viewer window typically exists as
a direct user request for information specifically from the current
application. Screen-sensitive help is an example.

Some differences between the virtual viewer and the Results Viewer
application are that the virtual viewer window closes when it looses
focus. The Results Viewer application remains open until you close it,
which means that it may remain open when focus is switched away from it
to another application. You may use the mouse to click links in the
Results Viewer but not in the virtual viewer. And you can have only one
instance of a Results Viewer window at a time.

The Results Viewer is an application that you invoke to gather
information from the Internet or from specific applications. JAWS
populates a Results Viewer window with the content gathered for you to
navigate, copy and paste, etc. Information shown when you invoke the
Research-It feature is an example of a Results Viewer window, and it
typically displays HTML elements - e.g., links. Speech History is
another, but it has no HTML, just text.

So again, the Results Viewer can display HTML; whereas, the Virtual
Viewer cannot. Thus, the Results Viewer can display headings, links,
tables, etc. You must enter it as HTML, programmatically or statically.
JAWS does not include HTML functions. If you include HTML tags when
sending text to the Results Viewer, the Results Viewer application
interprets the whole string as HTML. In summary: you must be familiar
with HTML coding practices if you wish to generate complex content with
HTML elements to display in a Results Viewer window.

## Displaying Text in a Virtual Viewer or Results Viewer Window

For all virtual viewer code to work properly, your script source file
must contain at least the following three Include statements:\

    Include "hjconst.jsh"
    Include "hjglobal.jsh"
    Include "common.jsm"

### Checking the Virtual Viewer Status

Before you display text in the virtual viewer, ensure that the virtual
viewer is not already running through another script or function. If the
virtual viewer is already active, you should deactivate it. Deactivating
the virtual viewer before you display new information in it prevents the
text from running together. To do this, you should either:

- Place the function, EnsureNoUserBufferActive(), before any other
  function calls that activate and display text in the virtual viewer.
- Use built-in or default functions to test for whether the user buffer
  is already active and clear it if it is not.

Use the built-in function, UserBufferIsActive, to check the status of
the virtual viewer. The function returns an integer value of 1 when the
virtual viewer is active, and returns an integer value of 0 when the
viewer is not active. When the virtual viewer is active, you use the
built-in function, UserBufferDeactivate, to close the virtual viewer.
This function closes the virtual viewer just as if you had pressed
**ESCAPE** from the keyboard.

As with the call to EnsureNoUserBufferActive, always place both the
UserBufferIsActive and the UserBufferDeactivate functions within a
conditional statement before calling any function that activates the
virtual viewer. And again, unless you really want to append to already
existing text in the user buffer, make sure to clear the user buffer so
that the virtual viewer displays only the text you direct it to display.

### Code Samples

In below code samples, the first two are equivalent but the third one is
not. the first two clear the user buffer so that you may populate the
virtual viewer with new content. The third code sample lets you append
to existing content in the user buffer.

    ;Checks for whether the user buffer is active and if so, deactivates and clears its content.
    If UserBufferIsActive () Then
        UserBufferDeactivate () ; close the virtual viewer
        UserBufferClear ()
    EndIf

    ;By default, checks for and clears the user buffer if it is active. If the optional parameter passed to this function is set to TRUE, the buffer content is retained.
    EnsureNoUserBufferActive () ; Closes the virtual viewer and clears its buffer content if the viewer is already active.

    ; Allows for appending to the user buffer that already exists in the virtual viewer
    EnsureNoUserBufferActive (TRUE) ; Closes the virtual viewer but does not clear its buffer content.

## Checking the Active Cursor

Checking if the virtual cursor is active is different from determining
whether the user buffer is active. The Returns are the same in that:

- Returns an integer value of TRUE if the Virtual PC cursor is enabled,
  or if the user virtual buffer is active.
- Returns an integer value of FALSE if the virtual PC cursor is
  disabled, or if the virtual user buffer is not active.

\

    IsVirtualPCCursor () ; Checks to see if the Virtual PC cursor is being used to navigate within the window with focus.
    UserBufferIsActive () ; Determines if the User Virtual Buffer is currently active.

## Creating and Displaying the Messages

To display messages in the virtual viewer, you should store them as
constants in a message (.jsm) file. Use JAWS message formatting
conventions. You may format the text of messages to be displayed in the
virtual viewer with spaces, hard returns, tab stops, etc. JAWS retains
the format of your messages when processing them for displaying in the
virtual viewer.

For messages you plan to use to speak or flash in Braille, you may
create a long and a short version of the same message. But for messages
you plan to display in the virtual viewer, you must test for whether to
display a long or a short message because the virtual viewer functions
do not take both long and short message parameters in the same function
call. So although you can still create a long and a short version of the
same message, you must test for whether to display one or the other
before calling the function that places the text into the virtual
viewer.

You can also use placeholders in messages to be displayed in the virtual
viewer. Using placeholders allows for text to be added to the message at
the time JAWS processes the script.

After you have created your messages and determined that the virtual
viewer is not active, you are ready to display text in the virtual
viewer. You can use numerous functions for this purpose. But some of the
more common methods include calls to:

- SayMessage
- SayFormattedMessage
- UserBufferAddText
- UserBufferAddFormattedMessage

For the SayMessage and SayFormattedMessage functions, The first
parameter is the output type that directs JAWS how to speak or display
the message. Use the output type constant, OT_USER_BUFFER, in either
function to direct JAWS to display your message in the virtual viewer.

The second parameter for SayMessage and SayFormattedMessage is the text
of the message you wish JAWS to speak or display. Since the output type
parameter passed in the current scenarios is for displaying text in the
virtual viewer,this parameter can be a quoted string of text, a string
variable containing the text or a message constant contained within a
JAWS message (.jsm) file.

The functions that allow more parameters and thus give you more control
over the text and how it is displayed in the virtual viewer allow for
things like the type of font, its color, and so on. All these functions
are listed in the Reference guide in the section on Virtual Viewer
Functions.

### Code Sample 1: Simple Virtual Viewer Functions

The below code sample checks for whether the user verbosity level is
higher than beginner level. If it is, the short message is passed to the
user buffer. If not, the long message is passed. This is a very simple
example of how to test and control the length of the message passed to
the user buffer.

If you want very specific control over the length of the message passed
to the user buffer, you may need to overwrite built-in message functions
or functions that pass messages to the user buffer with your own
particular tests in order to determine whether a long or short message
should be passed to the user buffer for displaying in the virtual
viewer.

    If GetJcFOption (Opt_User_Mode) >= intermediate ; user verbosity is set to intermediate or advanced for the current application.
        SayMessage (ot_user_buffer, msgHello_s)
    Else
        SayMessage (ot_user_buffer, msgHello_l)
    EndIf

### Code Sample 2: Using SayMessage and SayFormattedMessage

The below code sample uses calls to both SayMessage and
SayFormattedMessage functions to display text in the user buffer,
passing it a message that is formatted with a string that may change
depending on conditions you determine.

If the key assigned to the script is pressed twice quickly, then several
messages are passed to the user buffer to be displayed in the virtual
viewr, including the very commonly displayed message, \"Press Esc to
close this message\". That message is found in the common.jsm message
file that ships with JAWS and so you need an include statement for
\"common.jsm\" in your script source file, as shown here.

Also, notice that the test message to be displayed in the virtual viewr
has an extra blank line in the message definition. Any information you
place into a message constant using the Messages \... EndMessages format
allows you to include formatting: spaces, tabs, hard returns, etc., as
mentioned above. Alternatively, you may add the constant,
cscBufferNewLine, to force a blank line in the virtual viewer.

Finally, the script is written in such a way that if you press the key
assigned to the script just once after the virtual viewer is already
displaying the test message, nothing happens.

    Messages
    @msgTestMessage
    Hi. I am a test message.

    @@
    @msgMyUserBufferTestMessage
    I am %1.
    @@
    @msgNotVirtual
    not %1
    @@
    EndMessages

    Script MyUserBufferTest ()
    If IsSameScript ()
        EnsureNoUserBufferActive ()
        SayMessage (ot_user_buffer, msgTestMessage)
        SayFormattedMessage (ot_user_buffer,
            FormatString (msgMyUserBufferTestMessage, cmsgVirtualViewer))
        SayMessage (ot_user_buffer, cmsgBuffexit)
        Return
    EndIf
    If Not UserBufferIsActive ()
        SayFormattedMessage (ot_JAWS_message,
            FormatString (msgNotVirtual, cmsgVirtualViewer))
    EndIf
    EndScript

### Code Sample 3: Using Functions that Control How Text is Displayed

The below code sample shows how you might take advantage of the
UserBufferAddText function to populate the virtual viewer window with
very specific control of the way the text is displayed. In the code
sample where the optional parameters are used, note that the parameters
passed to the function are from constants found in the common.jsm file
that ships with JAWS. Also, note that when optional parameters are
passed, all of them must be passed up to the point where you no longer
need to make a change from the default parameters.

You may mix calls to SayMessage, SayFormattedMessage, and
UserBufferAddText. But for purposes of clarity, the two sample scripts
below call the function, UserBufferAddText.

The first example shows very simple calls to the function but passes the
required string parameter in different ways.

    Messages
    @msgMyTest
    Hello, I am a test.
    @@
    @msgMyVirtualViewer
    I am a message in the virtual viewer.
    @@
    EndMessages

    String Function MyUserBufferText ()
    Return msgMyVirtualViewer
    EndFunction

    Script MyUserBufferTest ()
    ; Deactivate and clear the user buffer if the virtual viewer is already active.
    ; The user buffer is not active. So clear the buffer because there may be other virtual viewer buffer text from other processing not related to your current script that must be cleared.
    EnsureNoUserBufferActive ()
    ;The below three function calls populate the text to be displayed in the virtual viewer when the script is run.
    ; You may call SayMessage and SayFormattedMessage instead of UserBufferAddText; but notice the extra control you have by utilizing this function call.
    ; Pass a simple message constant as the first parameter, which is required. But pass nothing else as aalll other parameters are optional.
    UserBufferAddText (msgMyTest)
    ; Pass a function that returns a string as the first parameter, which is required. but pass nothing else as all other parameters are optional.
    UserBufferAddText (MyUserBufferText ())
    ; Pass some text as the first parameter, which is required.
    ; Then for the optional parameters, pass nothing for the next two parameters, the font name as Aerial, size as 12, no attributes, and foreground color of black and background color of white.
    ; This level of specificity dictates that JAWS should display the text of the first parameter in the virtual viewer with these conditions applied.
    UserBufferAddText (MyUserBufferText, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor (cColor_White))
    ; Pass the message constant from common.jsm for closing the virtual viewer.
    ; Pass a blank line.
    UserBufferAddText (cscBufferNewLine)
    UserBufferAddText (cmsgBuffExit)
    ; Now activate the user buffer to receive the user buffer text just populated.
    If ! UserBufferIsActive ()
        UserBufferActivate ()
    EndIf
    ; Ensure that the virtual cursor begins at the top of the virtual viewer window.
    JAWSTopOfFile ()
    ; Say the first line of text.
    SayLine ()
    EndScript

In the next example, we call UserBufferAddText again but passing it many
of the optional parameters with different information from the defaults
that the function expects. This shows how to control the way text is
displayed in the virtual viewer. We also call RedirectToUserBuffer as
the last function call so that a SayAll from the top of the virtual
viewer window begins when the script is run.

    Const
        iAccount1 = 12345,
        iAccount2 = 54321,
        sMary = "Mary",
        sJohn = "John"

    Messages
    @msgMyAccountTitle
    Account Numbers by First Name
    @@
    @msgMyAccount
    I am %1 and my account is %2.
    @@
    @msgUnknownAccount
    I don't have a name for %1 account.
    @@
    EndMessages

    String Function MyFunctionTest (Int iNum)
    If iNum == iAccount1
        Return FormatString (msgMyAccount, sMary, IntToString (iNum))
    ElIf iNum == iAccount2
        Return FormatString (msgMyAccount, sJohn, IntToString (iNum))
    Else
        Return FormatString (msgUnknownAccount, IntToString (iNum))
    EndIf
    EndFunction

    Script MyAccountUserBufferTest ()
    ;Deactivate and clear the user buffer if the virtual viewer is already active.

    ; The user buffer is not active. So clear the buffer because there may be other virtual viewer buffer text from other processing not related to your current script that must be cleared.
    EnsureNoUserBufferActive ()
    ; The below function calls populate the text to be displayed in the virtual viewer when the script is run.
    ; Pass the title to be displayed as the first line in the virtual viewer..
    UserBufferAddText (msgMyAccountTitle)
    ; Pass a function name for a function that returns a string, then nothing for the next two parameters, then the font type, size, and foreground and backgbround colors to be displayed in the virtual viewer.
    ; The function itself passes a hard return by default. but for readability in the virtual viewer, add an extra blank line to the first parameter of each call.
    UserBufferAddText (cscBufferNewLine + MyFunctionTest (iAccount1), cScNull, cScNull, cFont_Times, 14, attrib_bold, rgbStringToColor (cColor_BLUE), rgbStringToColor(cColor_White))
    UserBufferAddText (cscBufferNewLine + MyFunctionTest (iAccount2), cScNull, cScNull, cFont_Times, 14, attrib_bold, rgbStringToColor (cColor_BLUE), rgbStringToColor(cColor_White))
    UserBufferAddText (cscBufferNewLine + MyFunctionTest (0), cScNull, cScNull, cFont_Times, 12, attrib_bold, rgbStringToColor (cColor_BLUE), rgbStringToColor(cColor_White))
    ;Now activate the user buffer to receive the user buffer text just populated.
    UserBufferActivate ()
    ; Pass a blank line along with the message constant from common.jsm for closing the virtual viewer, and cause a SayAll to begin from the top when the script is run.
    RedirectToUserBuffer (cscBufferNewLine + cmsgBuffExit)
    EndScript

## Displaying Keystrokes as Links

In addition to text, you can create keystroke links in the virtual
viewer. To do this, you add the KeyFor function within the body of any
individual message stored in a JAWS message file. The KeyFor function
requires the name of a script as its only parameter.

When JAWS displays the message containing the KeyFor function in the
virtual viewer, JAWS retrieves the keystroke for the script named passed
as a parameter to the function. The keystroke is displayed as a link
that you can activate by pressing **ENTER** on the line containing the
keystroke. The keystroke is displayed in underlined, blue text on the
same white background as other text contained within the virtual viewer.

The syntax for using the KeyFor function in a message is:\
%KeyFor (ScriptName)\
\
The percent sign preceding the function name acts as a placeholder for
the keystroke within the message. The script name does not include the
parentheses and can be located in either the default or an
application-specific script source file.

### Code Sample: Creating a Link to be Displayed in the Virtual Viewr

The below code sample shows a very simple message and a link to JAWS
hotkey help as you would display it in the virtual viewer.

    Messages
    @msgHelpMessage
    Below is a link to common helpful JAWS commands.
    @@
    @msgKeyForFunctionTest
    To see a list of general JAWS hot keys, press %KeyFor (HotKeyHelp).
    @@
    EndMessages

    Script MyKeyForFunctionTest ()
    ;Deactivate and clear the user buffer if the virtual viewer is already active.
    EnsureNoUserBufferActive ()
    ;The user buffer is not active. So clear the buffer because there may be other virtual viewer buffer text from other processing not related to your current script that must be cleared.
    ;The below function calls populate the text to be displayed in the virtual viewer when the script is run.
    UserBufferAddText (msgHelpMessage + CscBufferNewLine)
    ; The below call passes the name of the message containing the link. It must be called by the FormatString function to be processed properly.
    ;The next parameter is a string representing the function name, including any parentheses and parameters to be called when the Enter key or mouse click occurs in the associated text.
    ; The third parameter is a string representing the name to be used in the list links dialog when it is invoked with the Virtual viewer active.
    ; The rest of the optional parameters are not necessary because the defaults already handle them.
    UserBufferAddText (FormatString(msgKeyForFunctionTest), cFuncHotKey, cMsgHotKeysFunc)
    ;Now activate the user buffer to receive the user buffer text just populated.
    UserBufferActivate ()
    RedirectToUserBuffer (cscBufferNewLine+cmsgBuffExit)
    EndScript

## Checking Whether the Virtual Viewer window is Displayed Visually

By default in most applications, text displayed in the virtual viewer is
visible on the screen. But there may be times when you wish to suppress
the text from showing visually because it interferes with the actual
visible data. An example of this is when you display a chart in Excel in
the virtual viewer. You would not want the virtual viewer version of the
chart to obscure the visual version of the chart.

You may turn off displaying of virtual viewer text in general through
the JAWS user interface in the Settings Center dialog. But you may also
handle this through your scripts and functions for special cases.

### Code Sample

The below code sample checks for whether the virtual viewer is set to be
displayed visually. if it is, we turn it off temporarily, show virtual
viewer text, and then turn it on again. If it is not set, perhaps the
user had disabled the feature. so we leave it as is.

    Script ShowVirtualViewerTest ()
    Var
        Int iVirtViewer,
        String sText

    iVirtViewer = GetJCFOption(OPT_VIRT_VIEWER)
    sText = "This text is not displayed on screen because the option to display text in the virtual viewer visually is off."

    If iVirtViewer == TRUE ; Virtual viewer is visible.
        SetJCFOption (OPT_VIRT_VIEWER, 0) ; Turn it off.
    EndIf
    UserBufferClear ()
    SayMessage (ot_user_buffer, sText)
    RedirectToUserBuffer (cscBufferNewLine + cmsgBuffExit)
    If iVirtViewer == TRUE ; Virtual viewer was on before displaying text in the virtual viewer.
        SetJCFOption (OPT_VIRT_VIEWER, iVirtViewer) ; Turn it back on.
    EndIf
    EndScript

## Giving a Title to the Virtual Viewer Window

By default, when JAWS displays text in a virtual viewer window for
something like screen-sensitive text, if the user requests the title of
the window, JAWS provides a generic message, \"Virtual Viewer\". That
message is spoken and flashed in Braille. But there may be times when
you want your virtual viewer text to be displayed with a special name
for the virtual viewer window in which it appears. For example, in
Microsoft Excel charts, if the user requests the title of the chart
being displayed in the virtual viewer, JAWS provides this information
specifically instead of indicating the generic message.

In order to make your scripts and functions behave properly for this
special case, you must do two things:

1.  Overwrite the default script called SayWindowTitle so that it knows
    under what special circumstance to indicate the window name of your
    special virtual viewer window.
2.  Use the special function, UserBufferActivateEx instead of the more
    general function, UserBufferActivate, to activate the user buffer in
    your script that displays the special virtual viewer window.

The UserBufferActivateEx function takes four required parameters. The
first parameter is a string containing the window name for your special
virtual viewer window. This parameter passes a window name to be used
internally by your overwritten SayWindowTitle script. It is not a window
name that appears at all in the text of your special virtual viewer
window. The second parameter is also a string, indicating the type of
window you are generating. You may leave this string blank by using the
constant, cscNull, which in effect is an empty string. The third and
fourth parameters are integer values representing the window type code
and control ID for your special virtual viewer window. You may use 0 for
each of these parameters.

### Code Sample

The below code sample overwrites the default script called
SayWindowTitle for the special case of your special virtual viewer
window. You may restrict the conditions even further than what is shown
here to ensure that only the window name for your special virtual viewer
window is processed. but this code sample simply test for whether the
window name of the virtual viewer is not empty.

    Script SayWindowTitle ()
    Var
        String sVirtWindowName

    sVirtWindowName = UserBufferWindowName ()
    If UserBufferIsActive ()
        If sVirtWindowName != cscNull
            SayMessage (ot_user_requested_information, sVirtWindowName)
            Return
        EndIf
    EndIf
    PerformScript SayWindowTitle ()
    EndScript

    Script WindowTitleVirtualViewerTest ()
    Var
        String sTitle,
        String sText

    sTitle = "My Virtual Viewer Window"
    sText = "I am a message in this special virtual viewer window that has a name."
    EnsureNoUserBufferActive ()
    UserBufferActivateEx (sTitle,cscNull,0,0)
    SayMessage (ot_user_buffer, sText)
    RedirectToUserBuffer (cscBufferNewLine+cmsgBuffExit)
    EndScript

## Results Viewer Functions

Starting with JAWS 11.0, the Results Viewer application has been
available for customization through your own scripts and functions. Its
functions behave in a very similar manner to the functions for
displaying text in the virtual viewer.

## Additional Resources

For more details on working with all types of functions for the Virtual
Viewer and Results Viewer, see the category books and summaries in the
JAWS Functions book of the [Reference Guide.](Reference_Guide.html)
