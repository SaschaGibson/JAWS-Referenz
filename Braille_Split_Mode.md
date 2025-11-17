# Braille Split Mode

In addition to the shipping scripted application Braille Split modes
that come with JAWS, you can customize Braille Split modes of your own.
To do this, you must perform several steps in order to add an
application custom split view to the SetBrailleView dialog. You will
need to override several functions in the script set for the application
for which you wish to create a custom view. Override the following
functions:

- GetScriptedAppViews
- GetScriptedAppViewIndex
- SwitchToScriptedAppView.

## First Function to Override for customizing Split Braille Views

The function, GetScriptedAppViews, should return a vertical bar
delimited list of the custom view names which you want to add.

### Code Sample for GetScriptedAppViews

It already shipts with JAWS but you can see how the process works from
how we handle it specifically for Outlook in outlook.JSS:\

    string function GetScriptedAppViews()
    ;Override this in an app's script set to return a delimited list of scripted views. e.g. "Message list + message preview|..."
    ; In this case there is just one view but change it from on to off. Note that the message pane must be visible or we can't provide the view.
    if GetReadingPaneWindow() ==0 then
        giBrlShowMessagePreview =false
        return cscNull ; can't provide scripted ap view if pane is not visible.
    endIf
    if giBrlShowMessagePreview then
        return FormatString(msgMessageHeadersPlusPreview, cmsgOn)
    else
        return FormatString(msgMessageHeadersPlusPreview, cmsgOff)
    endIf
    endFunction

The segments of the returned string will be included in the
SetBrailleView dialog after the builtin split views and prior to the
custom Structured Mode views if any.\
**Note:** Each segment of the delimited list has two parts, the text
prior to the colon appears as a list item in the list of views, and the
text after the colon is used as a description and included in the
readonly edit in the dialog when that list item gains focus. For
example, in Outlook, there is only one view. So there is no vertical bar
delimiter, but, the item's text and description from the jsm file is as
follows (without the quotes):\

    Message List + Preview Pane %1:Select this option to show or hide the text of the currently selected message while in the message list. The message pane must be visible. You can independently pan through the text of the message without losing your place in the message list.

For an application that implements multiple custom views, the function
would return a string of the form:\

    view1:desc1|view2:desc2|view3:desc3|viewN:descN

**Note:** The colon (:) separating the view name and desc for each view,
and the vertical bar (\|) separating each view name/desc pair.

## Second Function to Override for customizing Split Braille Views

The next function you must override is GetScriptedAppViewIndex. This
function must return a 1-based index of the active app custom split view
if any, or 0 if no custom split view is currently active.

### Code Sample for GetScriptedAppViewIndex

We will continue with the shipping example from Outlook.jss:\

    int function GetScriptedAppViewIndex()
    ; return a 1-based index of the active scripted view.
    ; If no active scripted view, return 0 so it is no longer highlighted.
    if giBrlShowMessagePreview then
        return 1
    else
        return 0
    endIf
    endFunction

This function returns 1 if the view is active, or 0 if not active. If
there was a 2nd custom view which was active instead of this one, you'd
return 2. You can only have one view active at a time.

In our example shown above, if view1 were active, the function would
return index 1, view2 index 2, viewN, index N etc., where N is the Nth
1-based index into the segmented string returned by GetScriptedAppViews.

## Third Function to Override for customizing Split Braille Views

Finally, you must override the function, SwitchToScriptedAppView. It is
responsible for managing the state of the view. When the user selects a
custom split view from the SetBrailleView dialog, the 1-based index of
the custom app split view (relative to the string returned by
GetScriptedAppViews) is passed to this function in order to make that
view active. If the caller passes 0, any scripted app view must be set
back to the default. You must return a non-zero value if a custom view
was made active. For example, for Outlook, this function would receive 1
to make the view active, or 0 to set it back to the default.

### Code Sample for SwitchToScriptedAppView

Here is the sample from the shipping Outlook.jss:\

    int function SwitchToScriptedAppView(int scriptedAppViewIndex)
    ; This function should be overridden in an app's script set to control a scripted Braille view.
    if scriptedAppViewIndex==1 then
        giBrlShowMessagePreview =!giBrlShowMessagePreview
    endIf
    ; Reset to default.
    if scriptedAppViewIndex==0 then
    ; On by default if pane is visible.
        giBrlShowMessagePreview = GetReadingPaneWindow() != 0
    endIf
    ShowOrHideBrlReadingPane()
    return 1
    endFunction

## Buffered Mode Views

A special function, BrailleGetTextForSplitMode, is called by the
internal code which is responsible for providing the text for the view.
This is true for both custom split views as well as Buffered Text.
However, for buffered text view, if the script returns an empty string,
internal logic will use internal code to obtain the text for the view.
How much text is retrieved by internal code is determined by the
SplitBufferUnit key in the \[Braille\] section. The values are 0 for a
paragraph, 1 for the entire document, 2 for selected text, and 3 for the
clipboard. Since all markup is retrieved in order to provide marking for
bold etc, and correct language support, a very large document may take
too long for its text to be retrieved. We have limited the maximum
amount of text retrieved in document mode to 64KB. That is plenty to
have to pan.

**Note:** The default is to retrieve a paragraph.

### Code Sample for BrailleGetTextForSplitMode

Here is the sample from the shipping Outlook.jss:\

    string function BrailleGetTextForSplitMode()
    if getWindowClass (GetFocus()) == "OutlookGrid"
        return GetReadingPaneText()
    else
        return CSCNull
    endIf
    endFunction

**Note:** In the Outlook scripts, buffered text mode is used to provide
the custom view - i.e., the Outlook script function
ShowOrHideBrlReadingPane calls
BrailleSplitMode(brlSplitBufferedDocument) to enable and
BrailleSplitMode(brlSplitOff) to disable the custom view. When the
custom view is made active, internal code calls
BrailleGetTextForSplitMode, and the Outlook override provides the text
by retrieving it from the reading preview pane.

Another split mode used explicitly for custom split modes is
brlSplitScriptDefined. The difference between brlSplitScriptDefined and
brlSplitBufferedDocument is that for brlSplitBufferedDocument, internal
code only calls BrailleGetTextForSplitMode either initially when you
enable the mode by calling BrailleSplitMode(brlSplitBufferedDocument),
or by calling BrailleRefreshSplitModeBuffer(). For
brlSplitScriptDefined, the internal code also calls
BrailleGetTextForSplitMode whenever JAWS refreshes the Braille, either
due to a focus change, focus point move, screen update, or forced
Braille refresh.

Use the buffered version if the text required for the split is either
inefficient to retrieve, or cannot be provided automatically. Use
brlSplitScriptDefined if retrieving the text is trivial in terms of
performance and in situations where the split data must be kept up to
date with an application's changing output.

## JAWS Cursor Mode

To extract text from a window captured by the JAWS offscreen model (OSM)
as it updates, rather than calling BrailleSplitMode
(brlSplitScriptDefined) or BrailleSplitMode (brlSplitBufferedDocument),
call BrailleSetSplitModeToWindow, passing in the window handle. This
function sets the split mode to brlSplitWindow and refreshes the view
whenever the text in the window updates. To turn off any split view,
call BrailleSplitMode(brlSplitOff).\
**Note:** All of the constants are defined in hjconst.jsh.

## Split Braille Functions List

For a complete listing of builtin script functions for use with Braille
Split Mode, see the topics in this category book of the Reference Guide.
