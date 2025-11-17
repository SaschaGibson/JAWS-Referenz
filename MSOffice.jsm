; Copyright 1995-2015 Freedom Scientific, Inc.
; JAWS 12.0.xx
; JAWS message file for Microsoft Office

Const
; string compares for app file names:
	sc_outlook2007 = "OUTLOOK", ; for Outlook 2007 and above
	sc_outllibr = "OUTLLIBR",
	sc_powerpoint="POWERPNT",
;application names
	an_msoutlook2003="Microsoft Outlook 2003",
	an_envelope="ENVELOPE",
	an_MSWord= "WINWORD",
	an_MicrosoftWord="Microsoft Word", ; for Word XP
	an_MicrosoftOfficeWord="Microsoft Office Word", ; for Word 2003

;duplicated from MSOffice2007.jsm:
	sc_BackstageView="Backstage view",

; for AdjustJAWSVerbosity:
	sSmartTagListTitle="Smart Tag List", ; title for DlgSelectItemInList
	sSmartTagNameDelimmiter="#", ;preceeds the name to display from the SmartTag object

;Object names
	on_navigation_pane = "Navigation", ;Word 2010 Find dialog
	on_Find_And_Replace = "Find and Replace", ;Find and replace dialog
	on_SmartTagActions="Smart Tag Actions",
	on_AutoActions="Undo Auto Actions",

;Keystroke constants
; keystrokes combined with native app-specific modifier keys such as Ctrl and Alt:
;Note to localizers: These should be checked in case they need to be localized.
	ksCurrentLine="JAWSKey+UpArrow",
	ksInFolder="Alt+I",
	ksAlt1 = "Alt+1",
	ksAlt2 = "Alt+2",
	ksCtrlDownArrow = "Control+DownArrow",
	ksCtrlUpArrow = "Control+UpArrow",
	ksCtrlLeftArrow = "Control+LeftArrow",
	ksCtrlRightArrow = "Control+RightArrow",
	ksAltPageUp = "Alt+PageUp",
	ksAltPageDown = "Alt+PageDown",
	ksCtrlHome = "Control+Home",
	ksCtrlEnd = "Control+End",
	ksCtrlPageUp = "Control+PageUp",
	ksCtrlPageDown = "Control+PageDown",
	ksAltEquals = "Alt+Equals",
	ksShiftSpace = "Shift+Space",
	ksCtrlSpace = "Control+Space",
	ksSpaceBar = "SpaceBar",
	ksEquals = "equals",
	ksShiftHome = "Shift+Home",
	ksShiftEnd = "Shift+End",
	ksShiftDownArrow = "Shift+DownArrow",
	ksShiftUpArrow = "Shift+UpArrow",
	ksShiftLeftArrow = "Shift+LeftArrow",
	ksShiftRightArrow = "Shift+RightArrow",
	ksShiftCtrlRightArrow = "Shift+Control+RightArrow",
	ksShiftCtrlLeftArrow = "Shift+Control+LeftArrow",
	ksShiftCtrlHome = "Shift+Control+Home",
	ksShiftCtrlEnd = "Shift+Control+End",
	ksShiftBackspace = "Shift+Backspace",
	ksBackspace = "Backspace",
	ksEnter = "Enter",
	ksEscape = "Escape",
	ksAltShiftLeftArrow = "Alt+Shift+LeftArrow",
	ksAltShiftRightArrow = "Alt+Shift+RightArrow",
; Keystrokes assigned to tasks
	ksReplaceDlg="Alt+P",
	ksFindDlg="Alt+D",
	ksSwitchPanes="F6",
	ksSwitchPanesReverse="Shift+F6",
	ksLeftJustify="Control+L",
	ksCenterText="Control+E",
	ksRightJustify="Control+R",
	ksDeleteWord="Control+delete",
	ksBold="Control+B",
	ksItalic="Control+I",
	ksUnderline="Control+U",
; Names to filter out of displayed Smart Tag list:
	scSmartTagFilterList="GivenName|Sn|Place|City|State|Country-Region|Street|PostalCode|Time",

; Window Names
	wn_SaveVersion="Save Version", ; the save version dialog off the File menu.
	wn_CheckNames="Check Names",
	wn_AskAQuestion="Ask a Question",
	;for wn_AskAQuestion_Name:
	;To get the name, you must use HomeRow when on the combo box and use the window name
	;steps: Menu bar | left arrow (twice) | Home Row (insert space) | f5 |
	; f3 until Window Name is announced | CTRL+F1 (copies name to clipboard) | insert space to turn off mode again.
	wn_AskAQuestion_Name = "Menu Bar",
	wn_Print = "Print",
	wn_diagramGallery="Diagram Gallery",
	wn_Goto="Go To",
	WN_TaskPane="Task Pane",
	WN_AutoCorrect="AutoCorrect",
	wn_Help="Help",
	wn_About="About Microsoft",
	wn_Find	= "Find",
	wn_AcceptOrReject = "Accept or Reject Changes",
	wn_TipOfTheDay = "tip of the day",
	wn_TemplatesAndAddIns = "Templates and Add-ins",
	wn_PageSetup = "Page Setup",
	wn_Margins = "Margins",
	wn_PaperSize = "Paper Size",
	wn_PaperSource = "Paper Source",
	wn_Layout = "Layout",
	Wn_InsertTable = "Insert Table",
	wn_Formula = "Formula",
	wn_Font = "Font",
	wn_CharacterSpacing = "Character Spacing",
	wn_SpellingAndGrammar = "Spelling and Grammar:",
	wn_SpellingGrammar="Spelling & Grammar",
	wn_Suggestions="Suggestions:",
	wn_Thesaurus="Thesaurus:",
	wn_Customize="Customize",
	wn_ReadabilityStatistics="Readability Statistics",
	wn_WordCount="Word Count",
	wn_Style="Style",
	wn_SaveAs="Save As",
	wn_Open="Open",
	wn_InsertFile="Insert File",
	WN_InsertPicture="Insert Picture",
	wn_SelectPicture="Select Picture",
	wn_LinkToFile="Link to File",
	wn_Browse="Browse",
	wn_Sort="Sort",
	wn_TrackChanges="Track Changes",
	wn_MailMergeHelper="Mail Merge Helper",
	wn_DataForm="Data Form",
	wn_BulletsAndNumbering="Bullets and Numbering",
	wn_BordersAndShading="Borders and Shading",
	wn_EnvelopesAndLabels="Envelopes and Labels",
	wn_PageNumberFormat="Page Number Format",
	wn_BookMark="Bookmark",
	wn_FindAndReplace = "Find and Replace",
	wn_Options="Options",
	wn_TableProperties="Table Properties",
	wn_tableOptions="Table Options",
	wn_CellOptions="Cell Options",
; for apply Styles dialog in word
	wn_ApplyStyles="apply Styles",
;for Styles dialog, not to be confused with ApplyStyles dialog:
	wn_Styles="Styles",
;Word 2007, for Status bar toolbar button names:
	wn_Zoom="Zoom",
	wn_PageNumber="Page Number",
; for New Document or New ... dialog off the ribbons or file menus:
	wn_NewDocumentDlg="New Document",
;Word 2010 | for new search Results dialog replacing find and Replace dialog:
	wn_SearchDocument="Search Document",
	wn_SearchResult="Search Result",
; string compares
	sc_selected=" selected",
	scDocumentRecovery="Document Recovery task pane",
	sc_bold="Bold",
	sc_italic="Italic",
	sc_underline="Underline",
	sc_AlignLeft = "align left",
	sc_Center = "center",
	sc_AlignRight = "align right",
	sc_Justify = "justify",



;UNUSED_VARIABLES

	sc_Outlook_AddrBk_mapir="mapir",
	sc_outlook_AddrBk_outex="outex",
	sc_msoe="msoe",
	an_mapir="Mapir",
	an_OutLLibr="OutllibR",
	an_outex="OUTEX.DLL",
	JVAutoCorrectDetection="|ToggleAutoCorrectDetection:AutoCorrect",
	jvSmartTagDetection="|ToggleSmartTagsDetection:Smart Tags", ; For Smart Tag dialog
	ON_ShowClipboardAutomatically="Show Office Clipboard Automatically",
	ON_CollectWithoutShowingClipboard="Collect Without Showing Office Clipboard",
	ON_ShowClipboardOnTaskbar="Show Office Clipboard Icon on Taskbar",
	ON_ShowClipboardStatusNearTaskbar="Show Status Near Taskbar When Copying",
	ON_SearchText="Search Text:",
	ON_StopAutoCapitalizing="Stop Auto-capitalizing",
	ON_StopAutomaticallyCorrecting="Stop Automatically Correcting",
	on_Book="Book",
	ksAlt3 = "Alt+3",
	ksAltShift1 = "Alt+Shift+1",
	ksAltShift2 = "Alt+Shift+2",
	ksAltShift3 = "Alt+Shift+3",
	ksAltShift4 = "Alt+Shift+4",
	ksAltShift5 = "Alt+Shift+5",
	ksAltShift6 = "Alt+Shift+6",
	ksAltShift7 = "Alt+Shift+7",
	ksCtrlS = "Control+S",
	ksCtrlSemiColon = "Control+;",
	ksCtrlShiftSemiColon = "Control+Shift+;",
	ksShiftCtrl8 = "Shift+Control+8",
	ksTab = "Tab",
	ksShiftTab = "Shift+Tab",
	ksAltShiftUpArrow = "Alt+Shift+UpArrow",
	ksAltShiftDownArrow = "Alt+Shift+DownArrow",
	ksEuro="E",
	ksCopyright="C",
	ksRegistered="R",
	ksTrademark="T",
	ksPeriod=".", ; for elipsis
	ksJustifyText="Control+J",
	wn_CustomizeKeyboard="Customize Keyboard",
	wn_commands="Commands",
	wn_DocumentRecovery="Document Recovery",
	WN_TemporaryContextMenu="Temporary context menu",
	WN_ClipboardOptions="Options",
	wn_Search="Search",
	wn_CrossReference="Cross-reference",
	wn_InsertField="Field",
	wn_ModifyStyle="Modify Style",
	wn_NewStyle="New Style",
	WN_InsertHyperLink="Insert Hyperlink",
	wn_FormatParagraph="Paragraph",
	wn_Merge="Select File to Merge Into Current Document",
	wn_NewDocumentDialog="New", ; the new document/template dialog from the Files menu
	scUnderlineChar="_",
	scTopic="topic"

;END_OF_UNUSED_VARIABLES

messages
;spoken as the name of the status bar toolbar in Word 2007/2010
@msgStatusBarToolbar
Status Bar Toolbar
@@
@msgTaskPane
Task Pane
@@
@msgTaskPaneHelp1_L
This is the task pane.
Use Tab and Shift Tab to move between items on the task pane.
Use F6 to switch between the task pane window and the document window.
@@
@msgTaskPaneHelp1_S
This is the task pane.
Use Tab and Shift Tab to move between items on the task pane.
Use F6 to switch between the task pane window and the document window.
@@
@msgCopiedToOfficeClipboard_l
Copied to Office Clipboard
Press F6 to move between the Office Clipboard and the document window
@@
@msgCopiedToOfficeClipboard_S
Copied to Office Clipboard
@@
@msgOfficeClipboard_l
Office Clipboard
Press F6 to move between the Office Clipboard and the document window
@@
@msgOfficeClipboard_s
Office Clipboard
@@
; for MsgCheckList, %1 is the check state, %2 is the item name
@MsgCheckList
%1 %2
@@
@msgSmartTag1_L
Has Smart Tag
@@
@msgSmartTag1_S
Smart Tag
@@
@msgNoSmartTags_L
There are no smart tags in this document
@@
@msgNoSmartTags_S
no smart tags
@@
@msgNoClickableSmartTags_L
There are no clickable smart tags in this document
@@
@msgNoClickableSmartTags_S
No clickable smart tags
@@
@msgNotOnSmartTag_L
You are not on a smart tag
@@
@msgNotOnSmartTag_S
Not a smart tag
@@
@msgSmartTagListHelp_L
Choose a smart tag from the list
and press ENTER to move to the location of the smart tag in the document.
Then, press ALT+CTRL+S
to activate the context menu for the smart tag.
@@
@msgSmartTagListHelp_S
Choose a smart tag from the list
and press ENTER to move to the location of the smart tag in the document.
Then, press ALT+CTRL+S
to activate the context menu for the smart tag.
@@
@msgSmartTagActionsTutorHelp1_L
To show the Smart Tag Actions menu press %KeyFor(SmartTagActionsMenu)
@@
@msgSmartTagActionsTutorHelp1_S
To show the Smart Tag Actions menu press %KeyFor(SmartTagActionsMenu)
@@
@msgOfficeScriptKeyHelp
List smart tags in this document  %KeyFor(ShowSmartTagList)
Show Smart Tag Actions menu  %KeyFor(SmartTagActionsMenu)
@@
@msgOffice11ScriptKeyHelp
For Office 2003:
If F1 is pressed for Help, press %KeyFor(SwitchPanes) to move between the Task Pane and the document window.
@@
@msgOffice12ScriptKeyHelp
For Office 2007 and later:
If F1 is pressed for Help, press Alt+Tab to move between the Help window and the document window. Close the Help window by pressing Alt+F4 to return focus to the document window.
@@
@msgOfficeXPOnly_L
This feature is only available in Office XP.
@@
@msgOfficeXPOnly_S
Only available in Office XP
@@
@msgPleaseWait1
please wait ...
@@
@msgReady1
ready
@@
;for msgSDMToggleButton_L/S, %1 is the name of the button,
;%2 will say "pressed" when the button is pressed, and nothing when the button is not pressed
@msgSDMToggleButton_L
%1 button %2
@@
@msgSDMToggleButton_S
%1 button %2
@@
@msgHeaderTemplate
<voice name=HeaderVoice>%1</voice>
@@
@msgOfficeAssistantNotVisible_L
Office Assistant not visible
@@
@msgOfficeAssistantNotVisible_S
not visible
@@
@msgOfficeAssistantClosed_L
Office Assistant closed
@@
@msgOfficeAssistantCannotClose_L
office assistant could not be closed
@@
@msgOfficeAssistantCannotClose_S
could not close
@@
@msgBoldOn1_L
Bold On
@@
@msgBoldOff1_L
Bold Off
@@
@msgItalicOn1_L
Italic On
@@
@msgItalicOff1_L
Italic Off
@@
@msgUnderlineOn1_L
Underline On
@@
@msgUnderlineOff1_L
Underline Off
@@
@msgDash
dash
@@
@msgTaskPaneTutorHelp
Use Up and Down arrows or Tab and Shift+Tab to move through this window.
@@
@msgGroupboxTutorHelp
Groups together related controls.
@@
@MsgTaskpaneLinkError_l
This is the task pane. To move from link to link, press Tab or Shift+Tab. To activate a link, press Enter.
@@
@msgTaskPaneLinkError_s
Tab or Shift+Tab to move through links. Press Enter to activate a link.
@@
@msgFindPage
Find page
@@
@msgReplacePage
Replace page
@@
@msgHotkeyHelpOpen_L
Hotkeys are as follows:
File Name use Alt n
Files of Type use Alt t
Look In use Alt i
Open use alt o
@@
@msgHotkeyHelpopen_S
File Name Alt n
Files of Type Alt t
Look In Alt i
Open alt o
@@
@msgHotkeyHelpFilesDlg_L
Back use Alt 1
Up One Level use Alt 2
Search The Web use Alt 3
Create A New Folder use Alt 5
Cancel use Escape
Tools use Alt L
@@
@msgHotkeyHelpFilesDlg_S
Back Alt 1
Up One Level Alt 2
Search The Web Alt 3
Create A New Folder Alt 5
Cancel Escape
Tools Alt L
@@
@msgHotkeyHelpSave_L
Hotkeys are as follows:
Save in use Alt i
Save use Alt s
File Name use Alt n
Save AS Type use Alt t
@@
@msgHotkeyHelpSave_S
Save in Alt i
Save Alt s
File Name Alt n
Save AS Type Alt t
@@
; text attributes
@msgHighlighted
highlighted
@@
@msgBolded
bolded
@@
@msgItalicized
italicized
@@
@msgUnderlined
underlined
@@
; following several messages are for paragraph alignment:
@msgAlignedLeft
Aligned left
@@
@msgCentered
Centered
@@
@msgAlignedRight
aligned right
@@
@msgJustified
justified
@@
@msgDistributed
distributed
@@
@msgJustifiedhigh
justified high
@@
@msgJustifiedmedium
justified medium
@@
@msgJustifiedLow
justified low
@@
@msgNotInSpellChecker
Not in Spellchecker.
@@
@MsgLookIn
Look in
@@
@msgSaveIn
Save in
@@
@msgNotInOutlookMessage_l
This feature is only available from within the body of an open message.
@@
@msgNotInOutlookMessage_s
Only available from within an open message.
@@
@msgNoOutlookMessageHeadings_l
There are no headings in this message.
@@
@msgNoOutlookMessageHeadings_s
NO headings in this message.
@@
@msgNonbreakingSymbolsSayAll
during SayAll
@@
@msgNonbreakingSymbolsSayLineOrHigher
by characters, words, lines, sentences, and paragraphs
@@
@msgNonbreakingSymbolsSayWord
by characters and words
@@
@msgNonbreakingsymbolsSayChar
by characters only
@@
@msgOfficeHigherThan2k_L
This feature is available in versions of Office higher than 2000.
@@
@msgOfficeHigherThan2K_s
available in Office higher than 2000
@@
;msgScreenSensitiveHelpReadOnlyEmailMessage is the
;first line of screen sensitive help for read-only email messages:
@msgScreenSensitiveHelpReadOnlyEmailMessage
This is a read-only email message.
@@
;msgScreenSensitiveHelpUseVPCForReadOnlyMessages_Off notifies the user when the option is off,
;and the name of the option should be the same as found in Outlook 2007.qsm,
; text for ReadingOptions.UseVPCInsteadOfEnhancedEditModeForReadOnlyDocs
@msgScreenSensitiveHelpUseVPCForReadOnlyMessages_Off
Use Virtual Cursor for ReadOnly Messages is off.
@@
@msgScreenSensitiveHelpUseVPCForReadOnlyMessages_On
The virtual cursor is being used to read incoming messages.
Use the commands to read the messages that you use to read web pages and other virtual documents.
@@
;the following message is for Outlook 2010:
@msgScreenSensitiveHelpOutlookReadOnlyMessage
Quick Navigation mode is on for this message because it is a read-only message.

If you wish to reply to this message, you may use the standard keystrokes to reply to a message, such as CONTROL+R or CONTROL+SHIFT+R.

@@
@msgScreenSensitiveHelpOutlookMessage
This is the text area of an open message that you can edit.

You can type text in this message or navigate using standard reading commands.
@@


;UNUSED_VARIABLES

@msgLeavingTaskPane
Leaving Task Pane
@@
; for msgTaskPaneSwitchTo, %1 is the highlighted header, %2 is the control with focus
@msgTaskPaneSwitchTo
%1 %2
@@
@msgTemporaryContextMenuHelp1_l
This is a temporary context menu.
Use the Enter key to toggle the status of checkable items.
Use Up and Down arrows to move between items.
Press Escape to exit the menu.
@@
@msgTemporaryContextMenuHelp1_S
This is a temporary context menu.
Use the Enter key to toggle the status of checkable items.
Use Up and Down arrows or Tab and Shift Tab to move between items.
Press Escape to exit the menu and save the option settings.
@@
; For msgCheckableContextMenuItem, %1 = name, %2 = state
@msgCheckableContextMenuItem
%1 %2
@@
; for msgTemporaryContextMenuItemNotSelected, %1 is the menu item
@msgTemporaryContextMenuItemNotSelected
Not selected
%1
@@
; for MsgCheckListSection, %1 is the section divider separating checkable options in the list
@msgCheckListSection
%1 Section:
@@
@msgShowSmartTagsActionsButtonError1_L
Cannot show Smart Tags Action Button.
The JAWS cursor is already at the PC cursor location.
Move the PC cursor to another character in this smart tag and try again.
@@
@msgShowSmartTagsActionsButtonError1_S
Cannot show Smart Tags Action Button
@@
@msgHelpDlgOkBtn
OK
@@

;END_OF_UNUSED_VARIABLES

@msgOptionsDlgCategoriesTutorHelp
To select an item in this Categories list, press the first letter of the item,
or use UP or DOWN ARROW to move through the list.
@@

;UNUSED_VARIABLES

@msgBrowserOptionHelp
WARNING: Some messages with complex tables or other formatting are difficult to read with %product% when opened using Outlook versions higher than 2003. This is because Microsoft Word is now used to render the HTML content, which may make it difficult for the screen reader to display the message. If you have a message, such as a newsletter or e-mail invoice, you can use your browser to read the message more like earlier versions of Outlook.

If the current message is hard to read, either because of complex graphics or nested tables, open the message in your browser instead, as follows:

Dismiss the current screen-sensitive help message by pressing ESC. Then press ALT then H then X then V, followed by ENTER. These are shortcuts to quickly navigate the ribbon to the View in Browser submenu item.

When you press ENTER, a Security Warning dialog appears regarding opening messages in the browser. Select OK. Note, you can press TAB to navigate to the Please Do Not Show this Dialog Again checkbox, and press SPACEBAR to select it. This will prevent the Security Warning dialog box from displaying in the future.
@@
@msgBrowserOptionVirtualRibbonsOnHelp
WARNING: Some messages with complex tables or other formatting are difficult to read with JAWS when opened using Outlook versions higher than 2003. This is because Microsoft Word is now used to render the HTML content, which may make it difficult for the screen reader to display the message. If you have a message, such as a newsletter or e-mail invoice, you can use your browser to read the message more like earlier versions of Outlook.

If the current message is hard to read, either because of complex graphics or nested tables, open the message in your browser instead, as follows:

Dismiss the current screen-sensitive help message by pressing ESC. Ppress ALT, then the letter m, then the letter A, then the letter O, then the letter V. This key sequence navigates the virtual ribbon so that the current message opens directly in your browser. When you press v, a Security Warning dialog appears regarding opening messages in the browser. Select OK. Note, you can press TAB to navigate to the Please Do Not Show this Dialog Again checkbox, and press SPACEBAR to select it. This will prevent the Security Warning dialog box from displaying in the future.
@@
@msg2010BrowserOptionHelp
WARNING: Some messages with complex tables or other formatting are difficult to read with JAWS when opened using Outlook versions higher than 2003. This is because Microsoft Word is now used to render the HTML content, which may make it difficult for the screen reader to display the message. If you have a message, such as a newsletter or e-mail invoice, you can use your browser to read the message more like earlier versions of Outlook.

If the current message is hard to read, either because of complex graphics or nested tables, open the message in your browser instead, as follows:

Dismiss the current screen-sensitive help message by pressing ESC. Then press ALT+H, then the letter A, then V. These are shortcuts to quickly navigate the ribbon to the View in Browser submenu item.

When you press the last letter - the V - a Security Warning dialog appears regarding opening messages in the browser. Select OK. Note, you can press TAB to navigate to the Please Do Not Show this Dialog Again checkbox, and press SPACEBAR to select it. This will prevent the Security Warning dialog box from displaying in the future.
@@
@msg2010BrowserOptionVirtualRibbonsOnHelp
WARNING: Some messages with complex tables or other formatting are difficult to read with JAWS when opened using Outlook versions higher than 2003. This is because Microsoft Word is now used to render the HTML content, which may make it difficult for the screen reader to display the message. If you have a message, such as a newsletter or e-mail invoice, you can use your browser to read the message more like earlier versions of Outlook.

If the current message is hard to read, either because of complex graphics or nested tables, open the message in your browser instead, as follows:

Dismiss the current screen-sensitive help message by pressing ESC. Ppress ALT, then the letter m twice, then the letter a, then the letter v.
This key sequence navigates the virtual ribbon so that the current message opens directly in your browser.

When you press the last letter - the V - a Security Warning dialog appears regarding opening messages in the browser. Select OK. Note, you can press TAB to navigate to the Please Do Not Show this Dialog Again checkbox, and press SPACEBAR to select it. This will prevent the Security Warning dialog box from displaying in the future.
@@

;END_OF_UNUSED_VARIABLES

EndMessages
