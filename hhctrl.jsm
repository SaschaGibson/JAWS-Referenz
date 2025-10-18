const
; for the IE Toolbar dialog
	ToolbarDialogName = "Internet Explorer Help Toolbar",
	strToolbar1 = "Hide|Back|Forward|Options|Web",
	strToolbar2 = "Show|Back|Forward|Options|Web",
; for the legacy IE Toolbar dialog
	LegacyToolbarDialogName = "Windows 98 Help Toolbar",
	strLegacyToolbar1 = "Hide|Back|Forward|Options|Web",
	strLegacyToolbar2 = "Show|Back|Forward|Options|Web",
; for the Select Tab dialog
	SelectTabDialogName = "Select Tab",
;file names
msgFN1 = "Windows Help",
msgFN2 = "HHCTRL",

;Window Names
wnLinks_List = "Links List",

;keystrokes
ks1 = "tab",
ks2 = "shift+tab",
ks3 = "control+tab",
ks4 = "control+shift+tab",
ks5 = "alt+leftarrow",
ks6 = "alt+rightarrow",

;string compares
scSysTabControl32 = "SysTabControl32",
scWindowsHelpTitle = "Windows Help",
scPeriod = ".",
scProductVersion = "ProductVersion",
scHelpFileDate = "1998/09/11",
scHidden = "hidden",
scIndexTab = "Index",
scGlossaryTab = "Glossary",
scNULL = " ",
scVerticleBar = "|",
scSelectLink = "Select a Link",
scRightBracket = "]",
;object names in links list dialog
scSortLinks = "Sort Links",
scDisplayLinks = "Display",

;Window Class
wc_Checkable_Listbox="ISAVIEWCMPTCLASS",




;UNUSED_VARIABLES

scHideButton = "Hide",
scShowbutton = "Show",
scBackButton = "Back",
scForwardButton = "Forward",
scOptionsButton = "Options",
scWebbutton = "Web",
scContentsTab = "Contents",
scSearchTab = "Search"

;END_OF_UNUSED_VARIABLES

Messages
@msgScriptKeyHelp1
Microsoft Html Help
@@
@msgScriptKeyHelp2
Windows 98 Help
@@
@msgHotKeyHelp1_L
To select a different tab in the help window, use %KeyFor(SelectTab).
To click a button in the toolbar, use %KeyFor(Toolbar).
@@
@msgHotKeyHelp1_S
Select different tab in help window, %KeyFor(SelectTab).
Click button in toolbar, %KeyFor(Toolbar).
@@
@msgHotKeyHelp2_L
You may use the following hot keys when browsing a page:
To move forward or backward through links and other controls, use %KeyFor(MoveToNextLink) or %KeyFor(MoveToPriorLink).
To read the selected link or control, use %KeyFor(SaySelectedLink).
To select a link from a list of all the links contained in the page, use %KeyFor(SelectALink).
For a list of headings, press %keyFor(SelectAHeading).
To move to the next or prior heading, press %keyFor(MoveToNextHeading) or %keyFor(moveToPriorHeading).
@@
@msgHotKeyHelp2_S
Useful browsing hot keys:
Move forward and backward through links and controls, %KeyFor(MoveToNextLink)
and %KeyFor(MoveToPriorLink) respectively.
Read selected link or control, %KeyFor(SaySelectedLink).
Select link from list of links, %KeyFor(SelectALink).
list of headings, %keyFor(SelectAHeading).
move to next or prior heading, %keyFor(MoveToNextHeading) and %keyFor(moveToPriorHeading).
move to first or last heading, %keyFor(moveToFirstHeading) and %keyFor(moveToLastHeading).
move to next or prior heading at level, %KeyFor(MoveToNextHeadingLevelN) through 6 and %keyFor(moveToPriorHeadingLevelN) through 6 respectively.
move to first or last heading at level, %keyFor(MoveToFirstHeadingLevelN) through 6 and %keyFor(moveToLastHeadingLevelN) through 6 respectively.
@@
@msgHotKeyHelp3_L
To reformat the current page, use %KeyFor(ReformatDocument).
@@
@msgHotKeyHelp3_S
Reformat page, %KeyFor(ReformatDocument).
@@
@msgHotKeyHelp4_L
To go to the first form field on the page, use %KeyFor(FocusToFirstField).
@@
@msgHotKeyHelp4_S
Go to first form field on page, %KeyFor(FocusToFirstField).
@@
@msgHotKeyHelp5_L
To read the body of the page with the JAWS cursor, use %KeyFor(ReadCurrentScreen).
To scroll the page up and down and read with the JAWS cursor, use %KeyFor(ReadPriorScreen)
and %KeyFor(ReadNextScreen) respectively.
@@
@msgHotKeyHelp5_S
Read body of page with JAWS cursor, %KeyFor(ReadCurrentScreen).
Scroll page and read with JAWS cursor, %KeyFor(ReadPriorScreen)
and %KeyFor(ReadNextScreen) respectively.
@@
@msgHotKeyHelp6_L
to read columns with the JAWS cursor, use control combined with the arrow keys.
@@
@msgHotKeyHelp6_S
Read columns with JAWS cursor, control combined with the arrow keys.
@@
@msg3_L
No links found on page
@@
@msg3_S
No links found
@@
@msg4_L
Input field not found
@@
@msg4_S
not found
@@
@msg5_L
Tool bar not found
@@
;for msg6, %1 = a button name
;these button names are used in find strings and are stated at the beginning of this file
@msg6_L
%1 button not found
@@
@msg7_L
Tab control not found
@@
;for msg8, %1 = a tab name
@msg8_L
%1 Tab not found
@@
@msg9_L
Once you pick a topic and press ENTER on it, use the F6 key to move to and read the information window.
@@
@msg9_S
After selecting a topic and pressing enter, use the F6 key to read the help information.
@@
@msg10_L
Or if you have the older style of HTML help, use the control + tab to move to and read the information window.
@@
@msg10_S
Or if you have the older style of HTML help, use control + tab to read the help information .
@@
@msgSelectLink
Select a Link
@@
@msgScreenSensitiveHelp2_L
This is a list of all the links contained on the current page. Select a link using the arrow keys
or the first letter, and press enter to go to it.
@@
@msgScreenSensitiveHelp2_S
This is a list of all the links contained on the current page. Select a link using the arrow keys
or the first letter, and press enter to go to it.
@@
@msgScreenSensitiveHelp3_L
this is a list of the buttons in the Internet Explorer Help toolbar. Select a button using the
arrow keys or the first letter of the label, and press ENTER to select it.
@@
@msgScreenSensitiveHelp3_S
this is a list of the buttons in the Internet Explorer Help toolbar. Select a button using the
arrow keys or the first letter of the label, and press ENTER to select it.
@@
@msgScreenSensitiveHelp4_L
this is a list of the pages in the main help window.
Select the desired page using the arrow keys or
the first letter, and press ENTER to move to it.
@@
@msgScreenSensitiveHelp4_S
this is a list of the tabs in the main help window. Select the desired tab using the arrow keys or
the first letter, and press enter to click on it.
@@
@msgScreenSensitiveHelp5_L
This list contains the links found within the current help topic.
Use UP ARROW, DOWN ARROW, or the
link's first letter to move to a particular link.
Press ENTER to activate the selected link and
move to the new help topic.
For other options regarding this list, press TAB.
@@
@msgScreenSensitiveHelp6_L
Use UP or DOWN ARROW to select a definition in this list.
You may also type the first few letters of a term to jump directly to that entry if it has a definition.
Press TAB to view the definition of the selected term.
@@
@msgScreenSensitiveHelp7_L
Use standard navigation commands to read the definition for the selected entry.
To move back to the list of terms, press TAB.
@@
@msgMoveToLinkButton
Select this button to move to the selected link without activating it.
@@
@msgActivateLinkButton
Select this button to activate the selected link and switch to the new help topic.
@@
@msgCancelButton
Select this button to close the links list and return to the current help topic.
@@
@msgSortLinks
These choices change the order that links appear in the links list.
@@
@msgDisplayLinks
These choices determine which links from the current page are displayed in the list.
@@
;For msgPageName, %1 = the name of the active page, i.e. Contents or index
@msgPageName
%1 page
@@
;For msgPageTitle_L, %1 = The active help page
@msgPageTitle_L
Page is %1
@@
;For msgPageTitle_S, %1 = The active help page
@msgPageTitle_S
%1
@@
;For the glossary term list view name:
@msgTerm
Term
@@
;msgListBox is a control type for the glossary
@msgCheckableListBox
Checkable list box
@@
;Note about the following messages:
; 1 contains everything; headings, frames and links.
;2 contains headings and links only,
; or frames and links, but not all three.
;3 Contains one value, either headings or links only.
;We never speak 'no' for a 0-value
; for anything but links.
;
;Although these are similar to common's messages,
;and there is a more clever way to do this programmatically,
;We need to maintain the flexibility for those who translate the product.
@msgDocumentLoaded1_L
Page has %1, %2 and %3
@@
@msgDocumentLoaded1_S
%1, %2 and %3
@@
@msgDocumentLoaded2_L
Page has %1 and %2
@@
@msgDocumentLoaded2_S
%1 and %2
@@
@msgDocumentLoaded3_L
Page has %1
@@
@msgDocumentLoaded3_S
%1
@@
@msgBack1_L
Back
@@
@msgForward1_L
Forward
@@
@msg_CtrlName_IndexList
Index Keywords
@@


;UNUSED_VARIABLES

@msg1_L
Reformatting page
@@
@msg1_S
Reformatting page
@@
@msg2_L
Reformatting failed.  Document may not have finished loadingd
@@
@msg2_S
Reformatting failed
@@
@msgScreenSensitiveHelp1_L
This is the main Internet Explorer window, in which, you can read the current loaded page or
select a link to go to another site. Press insert plus h for a list of hot keys
@@
@msgScreenSensitiveHelp1_S
This is the main Internet Explorer window, in which, you can read the current loaded page, or
select a link to go to another site. Press insert plus h to get a list of hot keys
@@
@msgListBox
List view
@@

;END_OF_UNUSED_VARIABLES

EndMessages
