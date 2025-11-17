; Build 3.7.10.001
;Window Names

const

wn1 = "Check Spelling",
wn2 = "List View Tracking My Progress",
wn3 =  "Font",
wn4 = "Tabs",
wn5 = "#32771",
wn6 = "New",
wn7 = "Open",
wn8 = "Print",
wn9 = "Page Setup",
wn10 = "Find",
wn11 = "Replace",
wn12 = "Options",
wn13 = "Date and Time",
wn14 = "Paragraph",
wn15 = "Personal Information One",
wn16 = "Personal Information Two",
wn17 = "Full Name",
wn18 = "Tracking My Progress",
wn19 = "Tree View of Windows Controls",
;names of the pages in the view options multi page dialog
wn20 = "Options",
wn21 = "Display",
wn22 = "List View Tracking My Progress",
;page names in the multi page dialog  Tracking My Progress
sc1 = "General",
sc2 = "System",
sc3 = "Navigation/Editing",
sc4 = "Windows Miscellaneous",
sc5 = "JAWS Screen Review",
sc6 = "JAWS Help/Customization",
sc7 = "JAWS Miscellaneous",

;keystrokes
ks1 = "control+home"

Messages
@msgScriptKeyHelp1
HjPad
@@
@msg1_L
Suggestions:
@@
@msg2_L
No Suggestions
@@
@msg3_L
Not in SpellChecker
@@
@msgHotKeyHelp1_L
To mark an item as completed, press C.
To mark an item as not completed, press N.
@@
@msgHotKeyHelp1_S
Mark an item completed, press C.
mark an item not completed, press N.
@@
@msgDocType
Specifies the document format you want to use:
Word 6: Text can be opened and edited in Microsoft Word version 6.0 without conversion.
RTF (Rich Text Format): Text can include character formatting and tabs for use in a variety
of word processing applications.
Text Only: Text has no text formatting.
@@
@msgFileName
Provides a space for you to type the name of the file.
If you are searching for a file, you can use asterisks (*) as wildcards.
For example, you can type *.* to see a list of all files.
You can also type the full path of a file. For example, you can type c:\mydocs\letter.doc.
If you are saving a file, you cannot use a question mark (?) or an asterisk (*) as a file name.
If you use a question mark or asterisk and click Save, the dialog box will not close.
@@
@msg4_l
Fonts:
@@
@msg5_L
Size:
@@
;prompt for the combo box in the Tabs dialog
@msg6_L
Tab Stop Position
@@
@msgFilesOfType
Lists the types of files to display.
@@
@msgLookIn
Lists the available folders and files.
To see where the current folder is located in the hierarchy of folders on your computer,
click the arrow.
The box below lists the folders and files in the selected location.
To open any folder or file, click its name in the list.
To open the folder one level higher, click  on the toolbar.
@@
@msgName
Lists the printers that are attached to your computer.
@@
@msgProperties
Click this to set up options for the printer. The options available depend on the printer's 
features.
@@
@msgPrintToFile
Prints the document to a file instead of routing it directly to a printer.
@@
@msgPrintRangeRadioButtons
Specifies whether to print the entire document, specific pages, or the portion you selected.
@@
@NumberOfCopies
Provides a space for you to type the number of copies you want to print.
@@
@msgCollate
If you have selected more than one copy, specifies whether you want the copies to be collated.
@@
@msgPaperSize
Specifies the size of the paper or envelope you want to use.
@@
@msgPaperSource
Specifies where the paper you want to use is located in the printer.
Different printer models support different paper sources, such as the upper tray,
envelope feed, and manual feed.
@@
@msgOrientation
Specifies how the document is positioned on the printed page.
To see how the orientation will look on the sample page, click Portrait or Landscape.
@@
@msgMargins
Sets the printing area of the page. The printer will print only within these margins.
@@
@msgPrinterButton
Click to change printer options.
@@
@msgFindWhat
Provides a space for you to enter the text you want to find.
@@
@msgMatchWholeWordOnly
Finds only whole words instead of searching for your text inside longer words.
@@
@msgMatchCase
Finds only text that has the same pattern of uppercase and lowercase characters
as the text you specified in Find what.
@@
@msgFindNext
Searches for the next instance of the text you specified in Find what.
@@
@msgReplaceWith
Searches for the text in Find what and replaces it with this text. 
@@
@msgReplaceButton
Searches for the next instance of text that matches the text in Find what
and replaces it with the text in Replace with.
@@
@msgReplaceAllButton
Searches for every instance of the text that matches the text in Find what
and replaces it with the text in Replace with.
@@
@msgCancelButton
Closes the dialog box without saving any changes you have made.
@@
@msgInches
This entry selects inches.
@@
@msgCentimeters
This entry selects centimeters.
@@
@msgPoints
This entry selects points.
@@
@msgPicas
This entry selects pica.
@@
@msgAutomaticWordSelection
Instructs HJPad to highlight one word at a time as you drag the mouse over text.
To highlight one character at a time, leave this check box cleared.
@@
@msgOKButton
Closes the dialog box and saves any changes you have made.
@@
@msgHelpButton
Click this to display an overview of the dialog box.
@@
@msgNoWrap
Specifies that text does not wrap to the next line regardless of how the paragraph is formatted.
@@
@msgWrapToWindow
Specifies that text wraps to the next line when it reaches the sides of the window.
This setting does not affect how the text looks when printed.
@@
@msgWrapToRuler
Specifies that the text wraps to the next line when it reaches the margins of the page.
@@
@msgToolbarCheckBox
Press the SPACEBAR to toggle whether the toolbar is displayed in the HJPad window.
@@
@msgFormatBarCheckBox
Press the SPACEBAR to toggle whether the format bar is displayed in the HJPad window.
@@
@msgRulerCheckBox
Press the SPACEBAR to toggle whether the ruler is displayed in the HJPad window.
@@
@msgStatusBarCheckBox
Press the SPACEBAR to toggle whether the status bar is displayed at the bottom of the HJPad window.
@@
@msgAvailbleFormats
Select from a list of date and time formats to insert into your document.
@@
@msgFont
Lists the available fonts.
@@
@msgFontStyle
Lists the available styles for the specified font.
@@
@msgSize
Lists the available point sizes for the specified font.
@@
@msgEffects
Specifies whether the font should appear with strikeout marks or underlines, and specifies the available colors for the font.
@@
@msgColor
Lists the available colors for the specified font.
@@
@msgScript
Lists the available language scripts for the specified font.
@@
@msgIndentationLeft
Sets the position of your paragraph relative to the left margin.
@@
@msgIndentationRight
Sets the position of your paragraph relative to the right margin.
@@
@msgIndentationFirstLine
Specifies the position of the first line of the paragraph relative to the left margin.
@@
@msgAlignment
Sets the position of selected paragraphs relative to the indents to align text
relative to the left and right margins, remove and indentation formatting.
@@
@msgTabStopPosition
Lists the position of each tab stop in this paragraph.
To delete a tab stop, choose the one you want to delete, and then choose the Clear button.
@@
@msgSetButton
Saves the tab stop you typed in the Tab Stop Position box.
@@
@msgClearButton
Press ENTER on this button to clear all entries on this form.
@@
@msgClearFormButton
Press this button to clear all entries you have made in this form.
@@
@msgTitle
Select the appropriate title that depicts who you are.
@@
@msgFirstName
Type in your first name.
@@
@msgLastName
Type your last name here.
@@
@msgStreet
Type in your street address here. You can press return to enter more than one address line.
@@
@msgCity
Select your city from the list, or type in your city if it does not exist in the list.
@@
@msgState
Select your state from the list.
@@
@msgYearsOfComputerExperience
Enter the number of years of computing experience you have.
@@
@msgRankYourComputerKnowledge
Rank your computer knowledge between 0 and 5 with 0 being none and 5 being advanced.
@@
@msgWordProcessor
Check this box if you have previous experience using word processing software.
@@
@msgSpreadsheet
Check this box if you have previous experience using spreadsheet software.
@@
@msgAccounting
Check this box if you have previous experience using accounting software.
@@
@msgDatabase
Check this box if you have previous experience using database software.
@@
@msgGames
Check this box if you have previous experience using game software.
@@
@msgEmail
Check this box if you have previous experience using e-mail software.
@@
@msgFullNameButton
Press ENTER on this button to bring up a dialog allowing you to enter first, middle and last names in separate fields.
@@
@msgFullNameEdit
Type in your full name including first, middle and last name.
@@
@msgPostalCode
Enter your postal code here.
@@
@msgPhoneNumber
This edit box contains input masking.
Enter your phone number here including your area code
and your entry will change to the programmed format.
@@
@msgCity2
Select your city from the list, or type in your city if it does not exist in the list.
@@
@msgMiddleName
Type in your middle name or initial.
@@
@msgListViewSamples
This list contains many of the common keystroke commands used by Windows and by %product% for Windows.
Mark the items you have a good working knowledge of as completed by pressing C.
Mark the items you do not yet have a good working knowledge of as not completed by pressing N.
@@
@msgTreeView
Expand and contract the tree view to select an item.
When you select the physical or functional description, tab to the next window to read the description.
Press the key combination CTRL+HOME to move the cursor to the top of the text,
and then press the %product% Say All key combination INSERT+DOWN ARROW to hear the entire description.
To return to the tree view, press the key combination SHIFT+TAB. 
@@
@msgDescription
Displays physical or functional description for menu, drop-down menu, and dialog controls.
@@
;for the tools samples multipage dialog GENERAL
@msgGetHelp
Help is written in application specific files.
Pressing the function key F1 while in an application will bring up the Windows Help dialog
containing help specific to that application.
@@
@msgOpenTheStartMenu
The Start menu is a control of the Windows desktop,
which allows you to launch applications or open documents.
To open this menu, press one of the Windows Logo keys on the Windows keyboard
or the key combination CTRL+ESCAPE.
@@
@msgSwitchBetweenApplications
Windows allows you to run several applications at the same time.
Windows also allows you to switch back and forth between open applications.
To do this, hold down the ALT key and repeatedly press TAB until you hear the name of the
open application you wish to switch to. When you release the ALT key, you will switch to the selected application.
@@
@msgQuitTheActiveApplication
You can quit or exit the active application in one of two ways.
You can open the File menu and choose Exit, or you can use the key combination ALT+F4.
@@
@msgCloseAChildWindow
In some applications, a separate window is used which is not attached to the main application,
or parent window. This window is called the child window. The child window can be sized, moved
or closed within the main application without altering the state of the main application window.
To close a child window, press the key combination CTRL+F4.
@@
@msgOpenAControlMenu
The Control menu allows you to resize and move an application window.
Sometimes this menu is referred to as the system menu or application control menu.
To open a control menu, press the key combination ALT+SPACEBAR from within the application windows
you wish to resize. To move through the menu items you can press your up or down arrow keys.
@@
@msgMinimizeAllWindows
All open applications can be minimized with a key combination and the focus be placed on the desktop.
Once the focus has been placed on the desktop, %product% will announce the item on the desktop
that has focus and the total number of items on the desktop. To minimize all applications,
press the key combination Windows Logo Key+M.
@@
@msgOpenTheContextMenu
The Context menu displays a special menu for an object. You can open an object's context menu
when that object is selected. To open a context menu, press the context menu key on your keyboard
or press the key combination SHIFT+F10. These keystrokes are same as doing a right-mouse click.
@@
@msgMoveToTheMenuBar
Most applications contain a menu bar to aid you in carrying out commands available in the application.
To quickly move to the menu bar without opening any of the menus, press and release the ALT key.
@@
@msgChooseAMenuItem
You can navigate to the menu item you want by pressing your UP or DOWN ARROW key.
Once the menu item is highlighted or has focus, press your ENTER key to choose that menu item.
If the menu item with focus contains an ellipsis the ENTER key opens an associated dialog box.
Otherwise, the menu item you chose will be activated.
@@
@msgCancelOrCloseAMenu
When you have opened a menu on the menu bar, you can quickly close the menu and return
to where you were prior to opening the menu by pressing and releasing the ALT key.
@@
@msgCancelOrCloseASubmenu
Menus contained within other menus are called submenus. For every opened submenu,
you must press the ESCAPE key to close that submenu which will return you to the previous menu. 
@@
@msgOpenRecentlyUsedDocument
Your computer remembers the last fifteen recently used documents you have opened.
You can access your recently used documents by opening the Start menu and selecting
the Documents submenu. From the Document submenu, you can use your arrow keys to move through
the submenu and hear the names of your recently used documents. This first document in is the
first submenu operates by removing the oldest document from the submenu to maintain fifteen documents.
To open any of your recently used documents from the Documents submenu, simply press the ENTER key.
@@
@msgOpenThePropertiesDialog
The Properties dialog displays specific information describing the characteristics of a specific object
such as a folder or file. You open the Properties dialog by pressing the key combination, ALT+ENTER.
@@
@msgOpenTheFindDialog
The Find dialog allows you to conduct a search for folders or files on your computer.
You can set the search criteria it uses when it begins the search.
To open the Find dialog, press the key combination Windows Logo Key+F.
@@
@msgOpenTheRunDialog
To open a program, file or folder you can use the Run dialog and type the name of the file
you wish to open. To open the Run dialog, press the key combination Windows Logo Key+R.
@@
@msgMoveToTheFirstItemOnTheTaskBar
By pressing a key combination you can move to the first running application on your taskbar
and begin navigating to the application you want by using your arrow keys.
Once you have moved to the application, you can open the application by pressing your ENTER key.
To move to the first item on the taskbar, press the Windows Logo Key+TAB.
@@
@msgOpenWindowsExplorer
Windows Explorer is the built-in file management program used in Windows to manage your files and folders.
You can perform various file management tasks such as create or rename files and folders to organize
your work. To open Windows Explorer, press the key combination Windows Logo Key+E.
@@
@msgShutDownWindows
It is important that you always shut down Windows properly rather than simply shutting off the computer
from your power supply. The most common shut down procedure is to open the Start menu
and select shut down.
@@
;for the Tools Samples multipage dialog NAVIGATION/EDITING PAGE

@msgMoveToAnotherPage
You can move a page at a time and %product% will announce previous or next page.
The PC cursor will be placed on the beginning of the top line on that page and %product% will read
the entire contents of that line. Press the key combination CTRL+PAGE UP to move to the
previous page or CTRL+PAGE DOWN to move to the next page.
@@
@msgMoveToFirstItem
To move your cursor to the left margin or the first character on the line, press the HOME key.
@@
@msgMoveToLastItem
To move your cursor to the right margin or the last character on a line, press the END key.
@@
@msgMoveUpOrDownOneScreen
Press the PAGE UP key to move back a screen at a time or press the PAGE DOWN key to move forward
a screen at a time.
@@
@msgMoveOneCharacter
Press the RIGHT ARROW key to move one character to the right or press the LEFT ARROW key
to move one character to the left. 
@@
@msgMoveOneWord
Press the key combination CTRL+RIGHT ARROW to move forward a word at a time or CTRL+LEFT ARROW 
to move back a word at a time.
@@
@msgMoveOneParagraph
Press the key combination CTRL+UP ARROW to move back a paragraph at a time.
Press the key combination CTRL +DOWN ARROW to move forward a paragraph at a time.
@@
@msgMoveToBeginning
You can move quickly to the uppermost part of your document. Press the key combination CTRL+HOME.
@@
@msgMoveToEnd
You can move quickly to the end of a document by pressing a key combination.
%product% will announce that your new cursor position is at the bottom of the file.
Press the key combination CTRL+END.
@@
@msgSelectOneCharacter
Press the key combination SHIFT+RIGHT ARROW to select the next character or
SHIFT+LEFT ARROW to select the previous character. %product% will announce the selected character.
@@
@msgSelectOneWord
By pressing a key combination, the current word is selected from the cursor position.
If you are not on the first letter of the beginning of the word you want to select,
the selection is made from that point to the end of the word.
Press CTRL+SHIFT+RIGHT ARROW to select the next word.
Press CTRL+SHIFT+LEFT ARROW to select the previous word.
@@
@msgSelectToBeginningOfLine
You can select a line of text by pressing the key combination SHIFT+HOME.
Your selection will include the current location of the cursor and the entire contents
from that point to the beginning of the line.
@@
@msgSelectToEndOfLine
You can select a line of text by pressing the key combination SHIFT+END.
Your selection will include the current location of the cursor and the entire contents
from that point to the end of the line.
@@
@msgSelectOneScreen
You can select the previous screen or the next screen of text by pressing a key combination.
Once you have selected a screen, %product% begins reading the selected text and your cursor location
moves to the end of the text that has been selected. Press the key combination SHIFT+PAGE DOWN
to select one screen down or SHIFT+PAGE UP to select one screen up.
@@
@msgSelectToBeginning
From your cursor location, you can select text to the beginning of a document.
After the selection is made, %product% will automatically read selected text from the beginning
of the document for up to one screen and stop. This may not be all of your selection,
so to hear the selected text press the key combination to say selected text.
To select text to the beginning of your document, press the key combination CTRL+SHIFT+ HOME.
@@
@msgSelectToEnd
From your cursor location, you can select text to the end of the document.
After the selection is made, %product% will automatically read selected text from the last page
of the document for up to one screen and stop. This may not be all of your selection,
so to hear the selected text press the key combination to say selected text.
To select text to the end of your document, press the key combination CTRL+SHIFT+END.
@@
@msgCopyToClipboard
After you have selected text, files, or folders, you can copy those items and paste them
in an another location. Press the key combination CTRL+C to copy your selected items
to the Clipboard and erases whatever was previously stored on the Clipboard.
%product% will announce that selected text has been copied to the Clipboard.
@@
@msgCutToClipboard
After you have selected text, files, or folders, you can cut those items and delete them or paste
them in an another location. Press the key combination CTRL+X to cut selected items to the Clipboard
and erases whatever was previously stored on the Clipboard.
When you cut folders and files in Windows Explorer, %product% will announce every item that has been
selected. If you have selected text in a word processor to cut, the text will be removed instantly
from the document. %product% will announce that selected items have been cut to the Clipboard.
@@
@msgPasteFromClipboard
To retrieve cut or copied items from your Clipboard you must paste them to a location that will
accept them. For example, you cannot paste a sentence from your document on your Windows desktop
but you could paste a folder or a file on your desktop.
Press the key combination CTRL+V to paste selected items to your Clipboard.
After you press the key combination, %product% will announce that the contents have been pasted
from the Clipboard. Your cursor will be placed at the end of the pasted text.
When you paste files or folders from your Clipboard, %product% will announce that the contents
have been pasted from the Clipboard and reads every file or folder that has been pasted
because they are selected.
@@
@msgUndoLastAction
You can undo a recent action when you are working in Windows Explorer and some word processors.
Press the key combination CTRL+Z to undo your last action.
@@
@msgDeleteCurrentCharacter
You can delete a single character at a time without selecting it.
To delete one character to the right of the cursor location, simply press the DELETE key.
After you press the DELETE key, %product% will announce the next character to delete
not the character that was deleted.
@@
@msgDeletePriorCharacter
You can delete one character to the left of the cursor without selecting.
To delete the prior character, press the BACKSPACE key. After you press the BACKSPACE key,
%product% will announce the character that was deleted. Your cursor then moves one space to the left.
@@
;for the Tools samples multipage dialog WINDOWS MISC PAGE
@msgMoveThroughControls
To move from control to control within a dialog box you press the TAB key.
%product% will announce the name of the control and when appropriate the status of that control.
When you move through dialog boxes in this way you are not making changes, you are simply moving
the focus from control to control. If you tab through every control within the dialog box,
you will cycle around to the beginning control. To reverse your direction in a dialog,
press the SHIFT+TAB key.
@@
@msgMoveBetweenPages
Some dialogs contain more than one page of information. To move between the pages in a multi-page dialog
press the key combination CTRL+TAB. %product% will announce the name of the page tab for that page.
To reverse the direction when moving from page to page, press the key combination CTRL+SHIFT+TAB.
@@
@msgExitDialogBoxWithoutMakingChanges
Sometimes you need to exit a dialog without making any changes.
You can exit a dialog without making changes in one of two ways.
The first way is activate the Cancel button in that dialog by pressing the ENTER key.
The second way is to simply press the ESCAPE key. Once either of these methods is carried out,
the dialog will close.
@@
@msgApplyingChangesYouMake
Some dialogs require you to activate an Apply button to save changes you make in dialogs.
If the dialog you are working in requires you to make changes in this way,
an Apply button will be in your tab order. You must activate this button by tabbing to it
and pressing the ENTER key or pressing the ALT key and its assigned hot key.
@@
@msgDeleteFiles
Before you can delete folders or files in Windows Explorer you must select the items you want to delete.
After you have made your selection, press the DELETE key and these items will be sent to the
Recycle Bin. 
@@
@msgExpandAndCollapseTreeViewFolders
The items contained within the tree view can be expanded or collapsed.
If a tree view item is expanded, you can view the entire contents of that item as you move
within the tree view. If an item is collapsed, its contents are not visible in the tree view.
To expand an item in the tree view, press the RIGHT ARROW. To collapse an item in the tree view,
press the LEFT ARROW.
@@
@msgRenameAFileOrFolder
You can rename a file or a folder within the tree view or list view.
Once the item is selected, simply press the function key F2 and the tree view or list view item
will turn into an edit field and you can type the new name.
Press the ENTER key to save what you have typed.
@@
@msgFindAFileOrFolder
You can search for folders and files while in the Windows Explorer program using the Find dialog.
Generally, it is important to know at least two pieces of information about the item you are
searching for before conducting your search. First, you must specify the location your computer
begins looking for the item. The second piece of information that is important to have,
is an idea what the name of the item in question is called. To open the Find dialog within
Windows Explorer, press the function F3 key.
@@
@msgRefreshAWindow
Sometimes it is necessary to have the computer refresh the information currently displayed on your
computer screen. To refresh the computer screen, press the function F5 key.
@@
@msgSwitchBetweenWindows
In Windows Explorer, you can switch between the main controls, such as the tree view and list view
by pressing the TAB key. You can also press the function key F6.
@@
@msgGoUpOneLevel
In Windows Explorer, you can return to the previous level in the tree view or list view.
Press the BACKSPACE key to move up one level.
@@
;for Tools Samples Multipage dialog SCREEN REVIEW PAGE
@msgSayCharacter
With your cursor positioned on a character, you can press NUM PAD 5 to hear the current character.
@@
@msgSayWord
To hear the current word, press the key combination INSERT+NUM PAD 5.
@@
@msgSpellWord
You can spell the current word by pressing the key combination INSERT+NUM PAD 5 twice quickly.
After you press the key combination and you move your cursor to the right or left on the current line
each word on that line is spelled.
@@
@msgSayNextWord
Pressing the key combination INSERT+NUM PAD 6 %product% will say the next word.
Your cursor will move to the first letter of the next word and %product% will announce the word.
@@
@msgSayPriorWord
Pressing the key combination INSERT+NUM PAD 4 will say the prior word.
Your cursor will move to the first letter of the previous word and %product% will announce that word.
@@
@msgSayLine
Pressing the key combination INSERT+NUM PAD 8 will read the current line.
@@
@msgSayNextLine
Pressing the DOWN ARROW key will read the next line. When you press the DOWN ARROW key
your cursor moves to the next line and is positioned on that line relative to its location
from the previous line.
@@
@msgSayPriorLine
Pressing the UP ARROW key will read the prior line. When you press the UP ARROW key
your cursor moves to the prior line and is positioned on that line relative to its location
from the previous line. 
@@
@msgSayAll
From your present cursor location, %product% will perform the SayAll function by pressing INSERT+NUM PAD 2.
If you wish to hear the entire contents of your document, position your cursor at the uppermost left
part of your document and press the SayAll key combination. Your cursor tracks along as the text
is being spoken, so if you interrupt speech by pressing your CTRL key your cursor will be positioned
on approximately the last word spoken.
@@
@msgSayWindowTitle
To hear the title of the active application window, press the key combination INSERT+T.
This keystroke is very useful if you are unsure which application window has focus.
Information such as the name of the program or the name of the current document is read when %product%
reads the title. 
@@
@msgSayTopLineOfWindow
To hear the top line of the application window that has focus, press the key combination INSERT+END.
Information such as the application title and graphics appear on the top line of the window.
These graphics represent minimize, restore and the close window symbol.  
@@
@msgSayBottomLineOfWindow
To hear the bottom line of the application window that has focus, press the key combination
INSERT+PAGE DOWN. The bottom line of the window is sometimes referred to as the status bar.
Depending on the application, valuable information is displayed on the bottom line of the window.
For example, some word processors display the current page number, the total number of pages
in your document and your cursor position on the status bar.
@@
@msgSayToCursor
To read from the start of the line to the cursor, press INSERT+HOME. 
@@
@msgSayFromCursor
To read from the cursor to the end of a line, press INSERT+PAGE UP.
@@
@msgSayTaskbar
%product% no longer uses SayTaskBar, however INSERT+F10 displays a dialog with all running applications
in a list, and INSERT+F11 displays a dialog with all System Tray items in a list.
@@
@msgSaySystemTime
To hear the system time, press the key combination INSERT+F12.
This information is read from your system tray, which is part of your Taskbar.
@@
@msgSayColor
%product% will announce the color of an item. Pressing the key combination INSERT+5 will announce
the color of the selected item.
@@
@msgSayFont
%product% will announce the current font for a selected item.
Press the key combination INSERT+F to hear the current font.
@@
@msgSayActiveCursorAndCoordinates
%product% will announce the active cursor and pixel coordinates by pressing ALT+DELETE.
This keystroke is helpful when writing scripts and setting frames.
@@
;for Tools Samples multipage dialog HELP/CUSTOMIZATION PAGE
@msgScreenSensitiveHelp
You can use %product% Screen Sensitive Help any time you are unsure of your location,
need to know what keys to press, or want to get tips on what to do next.
When you press INSERT+F1 %product% identifies the current focus window in addition to providing
instructions on using the available options and maneuvering within the window.
@@
@msgKeyboardHelp
To activate the %product% Keyboard Help, press INSERT+1. This function identifies the keys and
key combinations when you press them. Press INSERT+1 to turn off Keyboard Help.
This function also provides you with information on the use of the keys.
Obtain a more extensive description of the %product% keys by holding down the first key or
keys in the combination and pressing the last key twice quickly.
If the %product% command contains only one key, press this key twice quickly.
For example, to get help on the SayAll command you would press INSERT+DOWN ARROW+DOWN ARROW.
@@
@msgJAWSHelpForApplications
To access %product% help for a specific application, press the key combination INSERT+F1 twice quickly
while in that application. A help topic will be displayed for that application which contains
special keystrokes or instructions for that application.
@@
@msgHotKeyHelp
To activate Hot Key Help, press INSERT+H. This function describes %product% keystrokes specific to the
active application. 
@@
@msgWindowKeysHelp
Press INSERT+W to get help on some commonly used Windows keystrokes.
@@
@msgSayHelpWindow
%product% will read the current help topic as soon as it is displayed.
If you wish to control how JAWS reads the help topics you must read the help topic with the JAWS cursor.
Pressing the key combination CTRL+INSERT+DOWN ARROW will read the entire current help screen
with the JAWS cursor. Once you begin reading the current screen with the JAWS cursor,
you can press the CTRL key to pause speech on approximately the last word spoken.
To resume speech, press one of the %product% reading commands.
@@
@msgRefreshScreen
Sometimes it is helpful to refresh your computer screen so that %product% will read new information
that has been displayed. Press the key combination INSERT+ESCAPE to refresh your screen.
@@
@msgScriptFileName
You can identify the current %product% script file name that is running by pressing the key combination
INSERT+Q. This keystroke is used to identify the current script name and the active application.
@@
@msgJAWSFind
You are able to search the visible screen with the JAWS cursor for text or graphics that cannot
be detected with the PC cursor. Pressing the key combination CTRL+INSERT+F will open the
%product% Find dialog. From this dialog, you can set a search criteria that defines what direction you
want the computer to begin looking and whether you want to look for only text or graphics. 
@@
@msgJAWSFindNext
Once you have entered a find within the %product% Find dialog, you can find the next occurrence
of the text or graphic by pressing INSERT+F3.
@@
@msgSayApplicationVersion
You are able to hear the version number of the application you are currently running.
This is helpful if you are running multiple versions of an application or if you are speaking
with a technical support technician and they ask you for the version number of your application.
Press the key combination CTRL+INSERT+V to hear the application version.
@@
@msgAdjustJAWSVerbosity
You can adjust several %product% verbosity levels.
By adjusting the verbosity levels, you can alter how much information %product% gives.
Pressing the key combination INSERT+V the Adjust %product% Verbosity dialog is displayed.
You can toggle the specific levels of verbosity between beginner, intermediate and advanced.
When you make adjustments in this dialog, you make adjustments for the current %product% session. 
@@
@msgPassKeyThrough
In some applications, %product% keystrokes may conflict with the application keystrokes.
In these cases, %product% takes precedence over the application keystroke.
It is still possible to perform the application keystroke, however you need to perform a pass through.
If you want an application to respond to a key instead of %product%, press INSERT+3 to activate
a pass through command. Then, press the key you want the application to use.
@@
@msgGraphicsLabeler
You may hear %product% announce an unlabelled graphic as "graphic XXX" where XXX is the number of the
graphic or symbol. It may be necessary to label the graphic or symbol if it enhances your use of
the application otherwise you may wish for %product% only to detect labeled graphics.
To label a graphic, position the JAWS cursor on that graphic or symbol and press the key combination
INSERT+G. This keystroke will bring up the %product% Graphics Labeler where you can assign the unlabeled
graphic a more meaningful label. Labels can be stored in the application file or the default file.
@@
@msgRunJAWSManager
You can launch any of the five %product% Managers from within an application by pressing
the key combination INSERT+F2. This key combination will open the Run %product% Manager dialog
where you can select the manager you wish to open. Also, from within this dialog you can select
the Graphics Labeler or Window Class Reassign options. Launching the Run %product% Manager from
within the application opens the specific application file for that manager.
@@
;for the Tools Samples multipage dialog JAWS MISC PAGE
@msgInterruptSpeech
You are able to temporarily silence %product% while it is speaking by pressing the CTRL key.
When this key is pressed speech will be silenced.
@@
@msgPCCursor
The PC cursor is directly linked to the operation of Windows applications.
For example, when you type information in an edit field, the PC cursor moves along with each key
you type. If you were asked to make a selection on a dialog screen, you would use the PC cursor
to locate and highlight the option to select. Press the PLUS key on the numeric keypad
to turn on your PC cursor.
@@
@msgJAWSCursor
The JAWS cursor moves freely around the active window. It is able to read information that the
PC cursor cannot. The JAWS cursor can read information at any time without disrupting the status
or operation of Windows or any application. Because moving the JAWS cursor actually moves the
mouse pointer, you can use a %product% mouse click command to select, drag, or choose screen objects.
To activate the JAWS cursor, press the MINUS on the numeric keypad.
@@
@msgRoutePCCursorToJAWS
You can route the PC cursor to the JAWS cursor location. Press INSERT+NUM PAD PLUS.
You should only perform the Route PC cursor to JAWS cursor when the application permits the
PC cursor to move to the JAWS cursor location.
@@
@msgRouteJAWSCursorToPC
You can route the JAWS cursor to the PC cursor location. Press the key combination INSERT+MINUS.
You should perform the Route JAWS cursor to PC when you wish the JAWS cursor to read information that the PC cursor cannot.
@@
@msgRestrictJAWSCursor
The JAWS cursor usually stays within the active window of an open application.
You can further restrict the JAWS cursor to movement within a child window by performing
a Restrict JAWS cursor function. Restricting the JAWS cursor does not affect the movement
of the PC cursor. Press the key combination INSERT+R to restrict the JAWS cursor to the current window.
Pressing INSERT+R again will toggle this mode.
@@
@msgSelectNextWord
You can select the next word by pressing the key combination INSERT+SHIFT+RIGHT ARROW.
%product% will announce the word that you have selected. 
@@
@msgSelectPriorWord
You can select the previous word by pressing the key combination INSERT+SHIFT+LEFT ARROW.
%product% will announce the word that you have selected. 
@@
@msgSaySelectedText
With a key combination, %product% will read the currently selected text, files or folders.
Press the key combination INSERT+SHIFT+DOWN ARROW and %product% will announce the selected items.
@@
@msgLeftMouseButton
You can use the JAWS cursor to perform a left mouse click on an item.
Clicking the left mouse button selects an item. Route your JAWS cursor to the item you wish to select
then press the NUM PAD SLASH for the left mouse button.
@@
@msgLeftMouseButtonLock
You can lock your left mouse button when you wish to choose an item.
The term double clicking always refers to the left mouse button.
To double-click, quickly press and release the left mouse button twice.
Press the key combination INSERT+NUM PAD SLASH. This keystroke is like a toggle.
Press it once to lock the left mouse button and when you complete your move or copy you can repeat
the keystroke to unlock the button.
@@
@msgRightMouseButton
Clicking the right mouse button displays a context menu. Route your JAWS cursor to your PC
and then perform a right mouse click. Press NUM PAD STAR.
@@
@msgDragAndDrop
The term dragging is actually a four-part process. It consists of clicking the left mouse button
on an item, then locking or holding down the left mouse button, using the arrow keys to move
the JAWS cursor to a new location, and then unlocking or releasing the left mouse button.
Press the key combination CTRL+INSERT+NUM PAD SLASH to drag and drop.
To drag the JAWS cursor outside the active window, press and hold down the ALT+SHIFT keys
while using the arrow keys to direct the cursor.
@@
@msgSayWindowPromptAndText
By pressing a key combination, %product% will announce the window type and text.
Press the key combination INSERT+TAB.
@@
@msgSayDefaultButtonOfDialogBox
One of the controls in a dialog box is assigned as the default control which is activated
when you press the ENTER key. Typically, this control is an OK or cancel button.
To hear the default button in the dialog box, press the key combination INSERT+E.
@@
@msgReadBoxInTabOrder
Once you open a dialog box, you can hear what controls are contained within that dialog in tab order
without actually moving to each control. By pressing a key combination, you can hear all the controls
in that dialog which will give you an idea of what type of information the computer is looking for
before you begin navigating in that dialog box. Press the key combination INSERT+B.
@@
@msgReadWordInContext
When performing a spell check or a find in a word processor, sometimes it is necessary for you to
hear the current word in context before you can perform a further action.
Pressing the key combination INSERT+C will read the current word in context.
When this keystroke is pressed, the JAWS cursor will read the actual line or sentence
where that word appears.
@@
@msgSayCurrentControlsHotKey
Dialog box controls are assigned a hot key for easy keyboard access.
Once you know a control's hot key, you can move to that control by pressing ALT+ (the hot key).
To hear a control's hot key, press SHIFT+NUM PAD 5.
@@
@msgFrameGetTopLeft
This is the first step in setting a frame. Route JAWS cursor to the location on the screen
where you wish to set the top left corner of a frame. If you are positioned on a character
the Frame Get Top Left function knows to set the frame at the top left of that character.
Press the key combination CTRL+SHIFT+LEFT BRACKET to set the top left corner of a frame.
@@
@msgFrameGetBottomRight
This is the second step in setting a frame. After you have set the top left corner of your frame,
move your JAWS cursor to the location you wish to set the bottom right corner of your frame.
Press the key combination CTRL+SHIFT+RIGHT BRACKET. Once the top, left, bottom and right side
of your frame is set %product% will launch the Frame Manager so that you can name your frame
and set other frame settings.
@@
@msgFrameSetToWindow
When you wish to set a frame for the current window you can press a key combination and %product% will
set the frame for the current window. Pressing the key combination
CTRL+SHIFT+LEFT BRACKET pressed twice quickly allows you to set a frame around the current window.
@@
@msgScreenSensitiveHelpHJPadToolbar
The buttons on this toolbar provide access to many HJPad commands. 
You can use the JAWS cursor to activate them, 
and most can also be accessed with keystrokes (such as CTRL+B for the Bold command). 
@@


;UNUSED_VARIABLES

@msgAppStart1_L
For screenSensitive Help, press %KeyFor(ScreenSensitiveHelp).
@@
@msgAppStart1_S
For screenSensitive Help, press %KeyFor(ScreenSensitiveHelp).
@@
@msgListView
Lists the folders and files in the selected location.
To look for a file or folder from within a program,
click the arrow in Look In to see the hierarchy of folders.
To save a file in a folder, click the arrow in Save In to see the hierarchy of folders.
To open the folder one level higher, click  on the toolbar.
@@

;END_OF_UNUSED_VARIABLES

EndMessages
