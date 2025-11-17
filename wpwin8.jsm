; Build 3.7.36.001
; JAWS 3.7 Message File for Wordperfect 8
; Copyright 2010-2015 by Freedom Scientific, Inc.
; Build WP373633 by Joseph K Stephen Last Modified on July 31, 2000
; Special thanks for reference information from Marco Zehe OmniPc Germany.

const
; for Adjust JAWS Verbosity dialog
	jvPageAndColumnBreakDetection = "|togglePageAndColumnBreakDetection:Page/Column Break Detection",
	jvStyleDetection = "|ToggleStyleDetection:Style Change Detection",
	jvTables = "|ToggleTables:Table Detection",
	jvLanguageDetection = "|ToggleLanguageDetection:Language Detection",
	jvBorderDetection = "|toggleBorderDetection:Border Detection",
;keystrokes
ks1 = "downarrow",
ks2 = "tab",

;string compares
sc_1 = "Static",
sc_2 = "white",
sc_3 = "Blue",
sc_4 = "dialog",
sc_5 = ", "

Messages
@msgSilent1

@@
@msgAppSettingsSaved1_L
Application Settings saved
@@
@msgAppSettingsNotSaved1_L
Application Settings could not be saved
@@
@MsgCorelWordperfect1_L
Corel Wordperfect 8
@@
@msgNotInATable1_L
The cursor is not within a table.
@@
; when doc has newspaper style columns
; when doc has newspaper style columns
; for blank cells. 
; for blank cells. 
@msgPage1_L
page 
@@
@msgPageBreak1_L
Insert page break
@@
@msgJustifyCenter1_L
justify center
@@
@msgJustifyLeft1_L
justify left
@@
@msgJustifyRight1_L
justify right
@@
@msgJustifyFull1_L
justify full
@@
@msgCenterLine1_L
center
@@
@msgFlushRight1_L
flush right
@@
@msgIndent1_L
Indent
@@
@msgHangingIndent1_L
Hanging indent
@@
@msgDoubleIndent1_L
Double indent
@@
@msgDetectBreaksOff1_S
Off
@@
@msgDetectBreaksOn1_S
On
@@
@msgDetectBordersOff1_S
Off
@@
@msgDetectBordersOn1_S
On
@@
; Note other border styles are returned as strings so no need to store msgs_L for these.
; Note other border styles are returned as strings so no need to store msgs_S for these.
@msgBlockOff1_L
block mode off
@@
@msgBlockOff1_S
block off
@@
@msgBlockOn1_L
block mode on
@@
@msgBlockOn1_S
block on
@@
@msgRevealCodesOff1_L
reveal codes off
@@
@msgRevealCodesOff1_S
off
@@
@msgRevealCodesOn1_L
reveal codes on
@@
@msgRevealCodesOn1_S
on
@@
@msgCloseWP1_L
Alt f4
@@
@msgSpellchecker1_L
check spelling
@@
@msgThesaurus1_L
thesaurus
@@
@msgDraft1_L
draft
@@
@msgRulerNotVisible1_L
ruler not visible
@@
@msgRulerNotVisible1_S
not visible
@@
@msgRulerVisible1_L
ruler visible
@@
@msgRulerVisible1_S
visible
@@
@msgHideBars1_L
hide all toolbars
@@
@msgPriorWindowPane1_L
Prior window pane
@@
; next window pane is labled in Keyboard lables in JCF
@msgPriorDocument1_L
Prior document
@@
@msgNextDocument1_L
Next document
@@
@msgPriorWindow1_L
Prior window
@@
@msgNextWindow1_L
Next window
@@
@msgPlayMacro1_L
play macro
@@
@msgRecordMacro1_L
record macro
@@
@msgShow1_L
show codes
@@
@msgMerge1_L
merge
@@
@msgGrammatik1_L
Grammatik
@@
@msgSettings1_L
Settings
@@
@msgSort1_L
sort
@@
@msgEditGraphicBox1_L
edit graphic box
@@
@msgStyle1_L
style: 
@@
@msgDetectTablesOff1_S
Off
@@
@msgDetectTablesOn1_S
On
@@
@msgDetectStylesOff1_S
Off
@@
@msgDetectStylesOn1_S
On
@@
; font descriptions:
; used for reporting of Font
; used for reporting of Font
@msgBold1_L
bold
@@
@msgBoldOn1_L
bold on
@@
@msgBoldOff1_L
bold off
@@
@msgItalic1_L
italic
@@
@msgItalicOn1
italic on
@@
@msgItalicOff1
italic off
@@
@msgUnderline1_L
underline
@@
@msgUnderlineOn1
underline on
@@
@msgUnderlineOff1
underline off
@@
; Underline Styles:
;Hotkey and Screen Sensitive Help Messages
; for hotKeyHelp
; for WindowKeysHelp
; append table name
; append table name
; screen sensitive help
; x text columns
; Spellchecker Hotkeys:
;Find and Replace dialog:
; Font Properties dialog
;Font page
;Underline tab 
; Perfect Expert
; Create New page
; Work On tab
; File Open Dialog
; Save As Dialog
; Page Setup dialog

; Margins/Layout tab
; Error messages.
@WPErrorMsg1_L
Status Bar not found
@@
@WPErrorMsg2_L
you must be in the Spell Checker dialog to read misspelled word and suggestion.
@@
@WPErrorMsg3_L
Word in context:
@@
@WPErrorMsg4_L
highlighted word not found
@@
@WPErrorMsg5_L
document window not found
@@
;General messages
@WPMsg1_L
edit
@@
@WpMsg2_L
Replace 
@@
@WpMsg3_L
with 
@@
@WPMsg4_L
Change Font
@@
@WPMsg5_L
Change Point Size
@@
@WPMsg6_L
Change Style
@@
@WPMsg7_L
Current word is possibly misspelled: 
@@
@WPMsg8_L
first suggestion: 
@@
@WPMsg9_L
Incorrect grammar: 
@@
@WPMsg10_L
To choose from the list of suggestions, right click with the JAWS cursor now.
@@
@WPMsg11_L
The Prompt-As-You-Go has no suggestion for the word: 
@@
@WPMsg12_L
or the Proofreading tools are disabled.
@@
@WPMsg13_L
Quick thesaurus active 
@@
@WPMsg14_L
Current Word is: 
@@
@WPMsg15_L
Delete word
@@
@WPMsg16_L
Delete to end of line
@@
; WordPerfect Reveal Code descriptions:
; note left is 2013
; note left is 2013
@MSG1_L
There is currently an open %product% dialog box
@@
@msg2_L
 Only one %product% dialog box can be opened at a time
@@
@MSG3_L
In order to bring up the requested dialog box, you must close the current dialog by pressing Escape and then activate the desired dialog box
@@
@msgHotKeyHelp1_L
%product% hotkeys for Wordperfect are as follows:
to announce the column and line number of the cursor use  %KeyFor(SayCursorPosition).
To toggle automatic detection of Styles, tables, languages etc, use  %KeyFor(adjustJAWSOptions).
To open the font list on the toolbar use  %KeyFor(OpenFontwindow).
To open the font point size list on the toolbar use  %KeyFor(OpenPointSizeWindow).
To open the style list on the toolbar use  %KeyFor(OpenStyleWindow).
To get help from the Spel As You Go	 proofreading tool use  %KeyFor(SpellAsYouGo).
To hear table cell coordinates use  %KeyFor(sayWindowPromptAndText).
For a list of commonly used WordPerfect shortcut keys use  %KeyFor(WindowKeysHelp).
@@
@msgHotKeyHelp1_S
%product% hotkeys for Wordperfect are as follows:
to announce the column and line number of the cursor use  %KeyFor(SayCursorPosition).
To toggle automatic detection of Styles, tables, languages etc, use  %KeyFor(adjustJAWSOptions).
To open the font list on the toolbar use  %KeyFor(OpenFontwindow).
To open the font point size list on the toolbar use  %KeyFor(OpenPointSizeWindow).
To open the style list on the toolbar use  %KeyFor(OpenStyleWindow).
To get help from the Spel As You Go	 proofreading tool use  %KeyFor(SpellAsYouGo).
To hear table cell coordinates use  %KeyFor(sayWindowPromptAndText).
For a list of commonly used WordPerfect shortcut keys use  %KeyFor(WindowKeysHelp).
@@
@msgHotKeyHelp2_L
To read the misspelled word an the first suggestion use  %KeyFor(ReadMisspelledAndSuggestion).
To read the word in context use  %KeyFor(ReadWordInContext).
@@
@msgHotKeyHelp2_S
To read the misspelled word an the first suggestion use  %KeyFor(ReadMisspelledAndSuggestion).
To read the word in context use  %KeyFor(ReadWordInContext).
@@
@msgHotKeyHelp4_L
To read the context of the search phrase use  %KeyFor(readWordInContext).
@@
@msgHotKeyHelp4_S
To read the context of the search phrase use  %KeyFor(readWordInContext).
@@
@msgWindowKeysHelp1_L
Here are some commonly used hotkeys for WordPerfect:
To open a file use control + o,
to save a document use control + s,
to print a document use control + P,
to find and replace text in a document use control + F,
to go to a specific page or position in a document use control + G,
to insert a page brake use control + Enter,
to go to the Font dialog use F9,
to create a table use F12,
To activate the spellchecker use control + F1,
To activate the Thesaurus use Alt+F1,
@@
@msgWindowKeysHelp1_S
Here are some commonly used hotkeys for WordPerfect:
To open a file use control + o,
to save a document use control + s,
to print a document use control + P,
to find and replace text in a document use control + F,
to go to a specific page or position in a document use control + G,
to insert a page brake use control + Enter,
to go to the Font dialog use F9,
to create a table use F12,
To activate the spellchecker use control + F1,
To activate the Thesaurus use Alt+F1,
@@
@msgAutostartEvent1_L
Welcome to Wordperfect 8.0
Press insert+h for Wordperfect specific hot key help.
Press insert+w for a list of commonly used WordPerfect commands.
@@
@msgAutostartEvent1_S
Welcome to Wordperfect 8.0
Press insert+h for Wordperfect specific hot key help.
Press insert+w for a list of commonly used WordPerfect commands.
@@
@msgAutostartEvent2_L
To hear the %product% help topic for Word Perfect , press insert+f1 twice quickly
@@
@msgAutostartEvent2_S
%product% help topic for Word Perfect , insert+f1 twice quickly
@@
@msgScreenSensitiveHelp1_L
This is the WordPerfect main document 	window
@@
@msgScreenSensitiveHelp1_S
This is the WordPerfect main document 	window
@@
@msgScreenSensitiveHelp2_L
The document is read only. In order to edit it you must save it under a new name.
@@
@msgScreenSensitiveHelp2_S
The document is read only. In order to edit it you must save it under a new name.
@@
@msgScreenSensitiveHelp3_L
use the editing or reading functions
 or use the menus to manipulate the document
@@
@msgScreenSensitiveHelp3_S
use the editing or reading functions
 or use the menus to manipulate the document
@@
@msgScreenSensitiveHelp4_L
The cursor is in cell 
@@
@msgScreenSensitiveHelp4_S
The cursor is in cell 
@@
@msgScreenSensitiveHelp5_L
 of 
@@
@msgScreenSensitiveHelp5_S
 of 
@@
@msgScreenSensitiveHelp6_L
Block mode is active
@@
@msgScreenSensitiveHelp6_S
Block mode is active
@@
@msgScreenSensitiveHelp7_L
Reveal Codes is on.
@@
@msgScreenSensitiveHelp7_S
Reveal Codes is on.
@@
@msgScreenSensitiveHelp8_L
Typeover mode is active.
@@
@msgScreenSensitiveHelp8_S
Typeover mode is active.
@@
@msgScreenSensitiveHelp9_L
Insert mode is active.
@@
@msgScreenSensitiveHelp9_S
Insert mode is active.
@@
@msgScreenSensitiveHelp10_L
The document contains %1 text columns.  The cursor is currently in text column %2
@@
;for msgScreenSensitiveHelp1_L, %1 and %2 are both numeric values.


;UNUSED_VARIABLES

@msgDetectBreaksOff1_L
Detect page and column breaks off
@@
@msgDetectBreaksOn1_L
Detect page and column breaks on
@@
@msgDetectBordersOff1_L
detect borders off
@@
@msgDetectBordersOn1_L
detect borders on
@@
@msgDetectTablesOff1_L
detect tables off
@@
@msgDetectTablesOn1_L
detect tables on
@@
@msgDetectStylesOff1_L
detect styles off
@@
@msgDetectStylesOn1_L
detect styles on
@@
@msgDetectLanguagesOff1_L
detect languages off
@@
@msgDetectLanguagesOff1_S
Off
@@
@msgDetectLanguagesOn1_L
detect languages on
@@
@msgDetectLanguagesOn1_S
On
@@
@msgHotKeyHelp3_L
Replace button use Alt R,
Skip Once button use Alt O,
Skip All button use Alt A,
Add button use Alt d,
Auto Replace button use Alt u,
Undo button use Alt n,
Options button use Alt t,
Close button use Alt C,
Help button use Alt H.
Hotkeys are as follows: 
@@
@msgHotKeyHelp3_S
Replace button use Alt R,
Skip Once button use Alt O,
Skip All button use Alt A,
Add button use Alt d,
Auto Replace button use Alt u,
Undo button use Alt n,
Options button use Alt t,
Close button use Alt C,
Help button use Alt H.
Hotkeys are as follows: 
@@
@msgHotKeyHelp5_L
Close button use Alt C,
Hotkeys are as follows: 
Find Next button use Alt F,
Find Prev button use Alt P,
Replace button use Alt R,
Replace All button use Alt A,
@@
@msgHotKeyHelp5_S
Close button use Alt C,
Hotkeys are as follows: 
Find Next button use Alt F,
Find Prev button use Alt P,
Replace button use Alt R,
Replace All button use Alt A,
@@
@msgHotKeyHelp6_L
Hotkeys are as follows: 
@@
@msgHotKeyHelp6_S
Hotkeys are as follows: 
@@
@msgHotKeyHelp7_L
Bold button use Alt B,
Italic button use Alt I,
Underline button use Alt U,
Outline button use Alt l,
Shadow button use Alt w,
Small caps button use Alt m,
Redline button use Alt R,
Strikeout button use Alt k,
Hidden button use Alt n,
@@
@msgHotKeyHelp7_S
Bold button use Alt B,
Italic button use Alt I,
Underline button use Alt U,
Outline button use Alt l,
Shadow button use Alt w,
Small caps button use Alt m,
Redline button use Alt R,
Strikeout button use Alt k,
Hidden button use Alt n,
@@
@msgHotKeyHelp8_L
All button use Alt l,
Same as text button use Alt x,
@@
@msgHotKeyHelp8_S
All button use Alt l,
Same as text button use Alt x,
@@
@msgHotKeyHelp9_L
Help button use Alt H.
Ok button use Alt O,
Cancel button use Alt C,
Settings button use Alt e,
@@
@msgHotKeyHelp9_S
Help button use Alt H.
Ok button use Alt O,
Cancel button use Alt C,
Settings button use Alt e,
@@
@msgHotKeyHelp10_L
Hotkeys are as follows: 
@@
@msgHotKeyHelp10_S
Hotkeys are as follows: 
@@
@msgHotKeyHelp11_L
Close button use Alt C,
Help button use Alt H.
Create button use Alt r,
Copy to Favorites button use Alt F,
Options button use Alt p,
@@
@msgHotKeyHelp11_S
Close button use Alt C,
Help button use Alt H.
Create button use Alt r,
Copy to Favorites button use Alt F,
Options button use Alt p,
@@
@msgHotKeyHelp12_L
Close button use Alt C,
Help button use Alt H.
Options button use Alt p,
Preview Document checkbox use Alt v,
Open button use Alt O,
Open as Copy button use Alt n,
Browse button use Alt w,
@@
@msgHotKeyHelp12_S
Close button use Alt C,
Help button use Alt H.
Options button use Alt p,
Preview Document checkbox use Alt v,
Open button use Alt O,
Open as Copy button use Alt n,
Browse button use Alt w,
@@
@msgHotKeyHelp13_L
Hotkeys are as follows: 
File name: edit combo use Alt n,
File type: combo box use Alt y,
Last modified: edit combo use Alt m,
Find Now button use Alt d,
Advanced... button use Alt c,
New Search button use Alt w,
Look in: combo box use Alt L,
@@
@msgHotKeyHelp13_S
Hotkeys are as follows: 
File name: edit combo use Alt n,
File type: combo box use Alt y,
Last modified: edit combo use Alt m,
Find Now button use Alt d,
Advanced... button use Alt c,
New Search button use Alt w,
Look in: combo box use Alt L,
@@
@msgHotKeyHelp14_L
Close button use Alt C,
Hotkeys are as follows: 
File name: edit combo use Alt n,
File type: combo box use Alt y,
Last modified: edit combo use Alt m,
Find Now button use Alt d,
Advanced... button use Alt c,
New Search button use Alt w,
Password protect: checkbox use Alt P,
Embed fonts: checkbox use Alt E,
Save button use alt S,
Save in: combo box use Alt i
@@
@msgHotKeyHelp14_S
Close button use Alt C,
Hotkeys are as follows: 
File name: edit combo use Alt n,
File type: combo box use Alt y,
Last modified: edit combo use Alt m,
Find Now button use Alt d,
Advanced... button use Alt c,
New Search button use Alt w,
Password protect: checkbox use Alt P,
Embed fonts: checkbox use Alt E,
Save button use alt S,
Save in: combo box use Alt i
@@
@msgHotKeyHelp15_L
Hotkeys are as follows: 
@@
@msgHotKeyHelp15_S
Hotkeys are as follows: 
@@
@msgHotKeyHelp16_L
Setup button use Alt S,
Options/Print Summary button use Alt O,
@@
@msgHotKeyHelp16_S
Setup button use Alt S,
Options/Print Summary button use Alt O,
@@
@msgHotKeyHelp17_L
Help button use Alt H.
@@
@msgHotKeyHelp17_S
Help button use Alt H.
@@
@msgHotKeyHelp18_L
Hotkeys are as follows: 
@@
@msgHotKeyHelp18_S
Hotkeys are as follows: 
@@
@msgHotKeyHelp19_L
Page definition: list view use Alt a,
Portrait radio button use Alt P,
Landscape radio button use Alt L,
Following Pages Different from Current button use Alt w,
Options button use Alt O,
@@
@msgHotKeyHelp19_S
Page definition: list view use Alt a,
Portrait radio button use Alt P,
Landscape radio button use Alt L,
Following Pages Different from Current button use Alt w,
Options button use Alt O,
@@
@msgHotKeyHelp20_L
Left: edit use Alt L,
Right: edit use Alt R,
Top: edit use Alt T,
Bottom: edit use Alt B,
Equal button use Alt E,
Minimum button use Alt n,
Increase margin for binding: edit use Alt c,
Right button use Alt i,
Left button use Alt f,
Inside radio button use Alt s,
Outside radio button use Alt u,
Book (side to side) radio button use Alt k,
Tablet (top to bottom) button use Alt a,
Off button use Alt O,
@@
@msgHotKeyHelp20_S
Left: edit use Alt L,
Right: edit use Alt R,
Top: edit use Alt T,
Bottom: edit use Alt B,
Equal button use Alt E,
Minimum button use Alt n,
Increase margin for binding: edit use Alt c,
Right button use Alt i,
Left button use Alt f,
Inside radio button use Alt s,
Outside radio button use Alt u,
Book (side to side) radio button use Alt k,
Tablet (top to bottom) button use Alt a,
Off button use Alt O,
@@
@msgHotKeyHelp21_L
Help button use Alt H.
@@
@msgHotKeyHelp21_S
Help button use Alt H.
@@

;END_OF_UNUSED_VARIABLES

EndMessages
