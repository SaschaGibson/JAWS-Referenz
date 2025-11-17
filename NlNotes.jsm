; Build 3.71.05.001
;Message file accompanying scripts for main Lotus application
; Copyright 2010-2015 by Freedom Scientific, Inc.
;Last modified by Joseph Stephen on 19/10/2000 to globalize for Unicode version

const
wn1 = "Spell Check",
wn7 = "New Calendar Entry",
wn19 = "Calendar",
; string compares
sc1 = "ATCHMNT",
sc3 = "selected",
;keystrokes
	ks7 = "shift+numpadplus", ;expand all
	ks8 = "shift+numpadminus",  ;collapse all
;Action Bar Constants
	;For strListItem, %1=The name, %2=The keystroke
	strListItem ="%1 - Alt %2",
	strActionDlgName = "Action Bar Items",
; verbosity dlg extra items
	NotesVerbosityItems="|ToggleReadingStatusLine:Reading Status Line",
;EndConst




;UNUSED_VARIABLES

wn2 = "Welcome - Lotus Notes",
wn5 = "frameset",
wn9 = "Body of Message",
wn10 = "New Memo - Lotus Notes",
wn12 = "Subject of memo",
wn13 = "List of people to send a copy of the memo",
wn14 = "List of undisclosed people to send copies of memo",
wn15 = "List of primary people to send memo",
wn16 = "Body of message",
wn18 = "column header",
wn22 = "To:",
wn23 = "cc:",
wn24 = "bcc:",
wn25 = "Subject:",
wnSpace = " ",
;StrNull
strMsgNull = "",
sc2 = "%",
sc4 = "outline",
sc5 = "Unknown window type",
	;ks1-ks2 are in the SayPrior character script
	ks1 = "leftarrow",
	ks2 = "numpadminus",
;ks3-ks4 are in the SayNextCharacter script
	ks3 = "rightarrow",
	ks4 = "numpadplus",
	ks5 = "control+leftarrow",
	ks6 = "control+rightarrow",
	ks9 = "f6",  ;next frame
	ks10 = "delete",
	strWindowDlgName="List of windows",
	ksWindow="alt+w"

;END_OF_UNUSED_VARIABLES

                                           messages
@msgBarNotFound
Action bar not found
@@
@msgBarNotAvailable
Action bar not available from within a dialog
@@
@msgNoButtons
No buttons available on action bar
@@
@msgNewLine1_L


@@
@msgSSHelp8_L
This is a Read-only document
Use your navigation keys or SayAll to read this document
@@
@msgSSHelp8_S
Read-only document
Navigation keys or SayAll to read this document
@@
@msgSSHelp9_L
This is the Date Picker
It is a visual representation of the calendar
Press f6 to the Calendar View, where you can use %product% to look at appointments scheduled for a given day
@@
@msgSSHelp9_S
Date Picker
visual representation of calendar
Press f6 to the Calendar View
@@
@msgSSHelp10_L
This is the calendar line view
use the left and right arrows to cycle through the dates
Press down arrow to view the appointments for a given day
Press enter to view the details of a given appointment
@@
@msgSSHelp10_S
calendar line view
use left right arrows for the dates
Press down arrow for appointments
Enter for details of appointment
@@
@msgSSHelp11_L
Press control+alt+shift+m to make %product% more responsive while editing
@@
@msgHKHelp1_L
To hear the misSpelled word and suggestion, press %KeyFor(ReadMistakeAndSuggestion).
@@
@msgHKHelp1_S
For misSpelled word and suggestion, press %KeyFor(ReadMistakeAndSuggestion).
@@
@msgHKHelp2_L
To move to the next frame, press %KeyFor(NextFrame).
@@
@msgHKHelp2_S
For next frame, press %KeyFor(NextFrame).
@@
@msgHKHelp3_L
To place all the links on the current web page into a list, press %KeyFor(SelectALink).
@@
@msgHKHelp3_S
reformat current web page %KeyFor(ReformatDocument).
list Links %KeyFor(SelectALink).
@@
@msgHKHelp4_L
To open or close the active item in the tree, press %KeyFor(SayNextCharacter).
To expand all items in the tree, press %KeyFor(ExpandAll).
To collapse all items in the tree, press %KeyFor(CollapseAll).
@@
@msgHKHelp4_S
open or close active item in tree %KeyFor(SayNextCharacter)
expand all items in tree %KeyFor(ExpandAll)
collapse all items in tree %KeyFor(CollapseAll)
@@
@msgWKHelp1_L
To hear the available shortcut keys for Lotus Notes, press and hold down the alt key
Keep the alt key down and press the letter or number of your choice
If you do not choose a hot key, when you release the alt key you will hear Menu Bar.  Tap the alt key once again to leave the Menu Bar
@@
@msgWKHelp1_S
For shortcut keys, press and hold down alt key
Press alt key plus letter or number of choice
If you do not choose a hot key, tap the alt key once again to leave Menu Bar
@@
@msgWKHelp2_L
To close the Properties Box, press alt + enter
@@
@msgWKHelp2_S
To close, press alt + enter
@@
@msgWKHelp3_L
press the space bar to activate this picker
@@
@msgWKHelp3_S
space bar to activate this picker
@@
@msgWKHelp4_L
To turn Edit mode on, press control+e
To locate a link or other embedded object in the document, press the left and right arrows
To activate the selected link or object, press the space bar
To close the window, press escape
@@
@msgWKHelp4_S
For Edit mode, press control+e
For link or embedded object , use arrows
To activate selection, press space bar
To close, press escape
@@
@msgWKHelp5_L
To turn Edit mode off, press control+e
To activate the selected link or object, press the space bar
To close the window, press escape
To navigate between the controls, use tab and shift + tab
In some cases, the up and down arrows will also move from field to field
@@
@msgWKHelp5_S
For Edit mode off, press control+e
To activate selection, press space bar
To close, press escape
To navigate, use tab and shift + tab
Sometimes, up and down arrows will also move
@@
@msgWKHelp6_L
To navigate between the links and embedded controls, press tab and shift+tab
To activate the selected link or button, press enter
To go to a new web page, press control + l, type in the new address and press enter
To close the window, press escape
@@
@msgWKHelp6_S
To navigate, press tab and shift+tab
To activate selection, press enter
For new web page, press control + l, type in new address and press enter
To close, press escape
@@
@msg6_L
expand all
@@
@msg7_L
collapse all
@@
@msg9_L
Guess: ListBox
@@
@msg10_L
No suggestion is highlighted
@@
@msg11_L
No suggestions
@@
@msg12_L
Not in spellChecker
@@
@msg14_L
No links found in document
@@
; for the Attachment Graphic
@msg18_L
Has Attachment
@@
@cmsgVerbosityListReadingStatusLineOn_L
on
@@
@cmsgVerbosityListReadingStatusLineOff_L
off
@@
@NODE_LOTUS_NOTES
Lotus Notes
@@
@ToggleStatusLineHelpMessage
When on, %product% will read changes in the Lotus Notes status line automatically.
The default setting is on.
@@
@msgSmartNavigationNotAvailable
Smart web navigation is not available in this application
@@


;UNUSED_VARIABLES

@msgMSAAOff
MSAA temporarily disabled
@@
@msgMSAAOn
MSAA Temporarily enabled
@@
@msgAppStart1_L
For ScreenSensitiveHelp, press %keyFor(screenSensitiveHelp)
@@
@msgAppStart1_S
ScreenSensitiveHelp %keyFor(screenSensitiveHelp)
@@
@msgSpace1
space
@@
@msg1_L
subject:
@@
@msg2_L
bcc:
@@
@msg3_L
Cc:
@@
@msg4_L
to:
@@
@msg5_L
embedded
@@
;for msgSSHelp1_L/S, %1=treeview level
@msgSSHelp1_L
Tree view level %1
use up or down arrow to read through the items
use the right or left arrow keys to open or close an item
After making your selection
Press enter to activate or open it
@@
@msgSSHelp1_S
Tree view level %1
@@
@msgSSHelp2_L
This is a graphic frame
It may contain icons linking you to other parts of Notes
Press the left and right arrows to select the icon of your choice and press the space bar to activate
Press the f6 key to move to the next frame
@@
@msgSSHelp2_S
Graphic frame
May contain links to other parts of Notes
Make selection and press dpace bar to activate
F6 for next frame
@@
@msgSSHelp3_L
Press the tab key to move to the next control
This is a list box embedded in a properties box
Use the up and down arrows to make your selection
@@
@msgSSHelp3_S
Embedded list box
Use up down arrows
@@
@msgSSHelp4_L
This is a list box embedded in a document
Press enter to open it
Use the up and down arrows or the first letter of the item to make your selection
press enter to close
@@
@msgSSHelp4_S
Embedded List box
Enter to open
arrows or first letter to select
Enter to close
@@
@msgSSHelp5_L
This is the Notes Browser window
It may contain any number of links or controls
Press tab or shift+tab to navigate between the controls on the page
For a list of hot keys, press %KeyFor(HotKeyHelp).
For a list of Windows keystrokes, press %KeyFor(WindowKeysHelp).
@@
@msgSSHelp5_S
Notes Browser window
May contain links or controls
use tab to navigate
For hot keys, press %KeyFor(HotKeyHelp).
For Windows keystrokes, press %KeyFor(WindowKeysHelp).
@@
@msgSSHelp6_L
For a list of hot keys, press %KeyFor(HotKeyHelp).
For a list of Windows keystrokes, press %KeyFor(WindowKeysHelp).
This is a link displayed in the Notes Browser window
Press enter to activate it or
Press the tab or shift+tab key to move to another link or control
@@
@msgSSHelp6_S
For hot keys, press %KeyFor(HotKeyHelp).
For Windows keystrokes, press %KeyFor(WindowKeysHelp).
Link displayed in Notes Browser window
Press enter to activate or
@@
@msgSSHelp7_L
This is a Multi Select List Box
Use the up and down arrows to navigate between the items
As you arrow up and down, you will hear whether the highlighted item is selected or not
Press the space bar to toggle the state of the currently highlighted item
Press the tab key to move to the next control
@@
@msgSSHelp7_S
Multi Select List Box
@@
;for msg8_L, %1=level number
@msg8_L
level %1
@@
@msg13_L
Tree view
@@
@msg15_L
Web page not found
@@
@msg15_S
Not found
@@
@msg16_L
The browser window already has focus
@@
@msg16_S
Already has focus
@@
@msg17_L
Graphic frame
@@
@msg19_L
Next Frame
@@
@msg20_L
Calendar line view
@@
@msg21_L
picker
@@
@msg22_L
Password:
@@
@msg23_L
No Help Found for this control
@@
@msg24_L
Graphic
@@
;For msgNoteHasLinks_L, %1 = TheNumOfLinks
;For msgNoteHasLinks_L, %2= msgLinksPlural  if more or less than 1 link, or nothing if no link is present
@msgNoteHasLinks_L
Note has %1 link%2
@@
;For msgNoteHasLinks_S, %1 = TheNumOfLinks
;For msgNoteHasLinks_S, %2= msgLinksPlural  if more or less than 1 link, or nothing if no link is present
@msgNoteHasLinks_S
%1 link%2.
@@
@msgLinksPlural
s
@@
@msgNoWindowList
List of windows could not be found
@@
@msgNoWindowList2
Window List not available from within a dialog
@@
;For msgWindowItems, %1 = the number of the item, e.g. 1, 2, to be typed.
;%2 is the actual item.
;It translates to:
;1 is Welcome, 2 is My Database ...
@msgWindowItems
%1 is %2
@@
@msgQuickKeysUnavailable_L
Navigation Quick Keys Not Available
@@
@msgQuickKeysUnavailable_S
Not available
@@
@msg_TreatLikeMultiLineEditOn
Treat like multiline edit on
@@
@msg_TreatLikeMultiLineEditOff
Treat like multiline edit off
@@
@msg_KeyNotRequired
This key not required with Notes 6 and above
@@
@msg_NoHelpAvailable
No help available
@@


;END_OF_UNUSED_VARIABLES

endMessages