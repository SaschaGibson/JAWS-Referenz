; Build 3.71.05.001
; JAWS 3.7 Message File for Wordperfect 9
; Copyright 2010-2015 by Freedom Scientific, Inc.
; Build WP3710544 by Joseph K Stephen Last Modified on September 26, 2000
; Special thanks for reference information from Marco Zehe OmniPc Germany.
; Last modified by Sean Murphy, on 5th oct 2001.
const
; for Adjust JAWS Verbosity dialog
	jvPageAndColumnBreakDetection = "|togglePageAndColumnBreakDetection:Page/Column Break Detection",
	jvStyleDetection = "|ToggleStyleDetection:Style Change Detection",
	jvTables = "|ToggleTables:Table Detection",
	jvLanguageDetection = "|ToggleLanguageDetection:Language Detection",
	jvBorderDetection = "|toggleBorderDetection:Border Detection",
;keystrokes
ks1 = "downarrow",
ks2 = "alt+downarrow",
sc_4 = "Static",
sc_5 = "white",
sc_6 = "Blue",
;The following constants are used to prevent the menu bars of the Open, Save and Find & replace dialogue from being announced
;when they recieve focus.
scMenubar="File Edit View Tools Favorites Help",
; for status line search
scWPPageNo="Pg",
scWPPos="Pos",
; colors:
colorRed="red",
colorWhite="white",
colorBlue="blue",
colorBlack="black",
; strings used in Window Name and string contains
wnWP1 = "Spell Checker",
wnWP4="Find and Replace", ; for the Find and Replace Dialog.
wnWP5="Font Properties",




;UNUSED_VARIABLES

sc_1 = "bold",
sc_2 = ",",
sc_3 = "_",
; symbols:
scrollDownSymbol="Scroll Down Symbol",
wnWP2 = "Grammatik",
wnWP3 = "Thesaurus",
wnWP6="Font", ; font page of Font Properties multipage dialog
wnWP7="Underline", ; Underline page of Font Properties multipage dialog.
wnWP8="PerfectExpert",
wnWP9="Create New",
wnWP10="Work On",
wnWP11="Open File", ; open file dialog
wnWP12="Save As", ; Save As dialog
wnWP13="Properties", ; File Properties multipage dialog
wnWP14="Summary", ; summary tab
wnWP15="Information", ; information tab
wnWP16="Page Setup",
wnWP17="Size",
wnWP18="Margins/Layout",
wnWP19="Paragraph Border/Fill",
wnWP20="QuickFinder Manager",
wnWP21 = "Dictionary", ;new for v10 and is a part of the spellcheck dialogue.
wnWP22 = "Go To"

;END_OF_UNUSED_VARIABLES

messages
@msgAppStart1_L
For %product% Hotkey Help with Corel Wordperfect use %keyFor(hotkeyHelp).
For a list of Wordperfect short cut keys use  %KeyFor(WindowKeysHelp).
To hear the %product% help topic for Corel Wordperfect press %keyFor(screenSensitiveHelp) twice quickly.
To import a registry key to ensure %product% operates correctly with WordPerfect 9, use %keyFor(ImportRegistrySettings).
For more information please consult the Help Topic.
@@
@msgAppStart1_S
hotkey help use %KeyFor(hotkeyHelp).
Wordperfect shortcut keys use  %KeyFor(WindowKeysHelp).
%product% help topic for Wordperfect %keyFor(screenSensitiveHelp) twice quickly.
import registry key %keyFor(ImportRegistrySettings) consult Help Topic for more info
@@
; Verbosity items
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
@msgDetectLanguagesOff1_S
Off
@@
@msgDetectLanguagesOn1_S
On
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
@msgToActivateTheButton1_L
To activate the selector button associated with this edit control press F4
@@
@msgToActivateTheButton1_S
Press f4 to activate selector button
@@
@msgToActivateTheCalendar1_L
To activate the calendar associated with this edit control use f4.
@@
@msgToActivateTheCalendar1_S
To activate the calendar use f4.
@@
@msgAppSettingsSaved1_L
Application Settings saved
@@
@msgAppSettingsNotSaved1_L
Application Settings could not be saved
@@
@MsgCorelWordperfect1_L
Corel WordPerfect 9
@@
@msgImportRegKeyTitle1_L
Import Registry Key
@@
@msgImportRegPrompt1_L
Warning!

This script will make a modification to your Windows Registry that will enable Screen Reader compatible Mode by default.

After this registry entry is imported, you will need to restart Corel WordPerfect 2000 in order for the changes to take effect.

Would you like to import the Windows Registry settings?
@@
@msgImportSuccessful1_L
Registry key imported. Please restart Wordperfect 9.
@@
@msgNotInATable1_L
The cursor is not within a table.
@@
;for msgPage1_L, %1=page number
@msgPage1_L
page %1
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
;for msgStyle1_L, %1=style name
@msgStyle1_L
style: %1
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
@msgVBEditor1_L
Visual Basic Editor
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
@msgBold1_L
bold
@@
@msgItalic1_L
italic
@@
;for msgUnderline1_L, %1=underline style description
@msgUnderline1_L
%1 underline
@@
@msgWinKeysHelp1_L
Here are some commonly used hotkeys for WordPerfect:
To open a file use control + o
to save a document use control + s
to print a document use control + P
to find and replace text in a document use control + F
to go to a specific page or position in a document use control + G
to insert a page brake use control + Enter
to go to the Font dialog use F9
to create a table use F12
To activate the spellchecker use control + F1
To activate the Thesaurus use Alt+F1
@@
@msgWinKeysHelp1_S
open a file control + o
save a document control + s
print a document control + P
find and replace text in a document control + F
go to a specific page or position in a document control + G
insert a page brake control + Enter
go to the Font dialog F9
create a table F12
activate the spellchecker control + F1
activate the Thesaurus Alt+F1
@@
; Hotkey Help messages
@msgHotkeyHelp1_L
%product% hotkeys for Wordperfect are as follows:
To import a registry key to ensure %product% operates correctly with WordPerfect 9use %keyFor(ImportRegistrySettings).
to announce the column and line number of the cursor use  %KeyFor(SayCursorPosition).
To toggle automatic detection of Styles, tables, languages, etc use  %KeyFor(adjustJAWSOptions).
To open the font list on the toolbar use  %KeyFor(OpenFontwindow).
To open the point size list on the toolbar use  %KeyFor(OpenPointSizeWindow).
To open the style list on the toolbar use  %KeyFor(OpenStyleWindow).
To get help from the Spel As You Go	 proofreading tool use  %KeyFor(SpellAsYouGo).
To hear table cell coordinates use  %KeyFor(sayWindowPromptAndText).
For a list of commonly used WordPerfect shortcut keys use  %KeyFor(WindowKeysHelp).
@@
@msgHotkeyHelp1_S
import registry key %keyFor(ImportRegistrySettings)  %KeyFor(importRegistrySettings)
announce column and line number of cursor  %KeyFor(SayCursorPosition)
toggle automatic detection of Styles, tables, languages, etc  %KeyFor(adjustJAWSOptions)
open the font list on the toolbar  %KeyFor(OpenFontwindow)
open the point size list on the toolbar  %KeyFor(OpenPointSizeWindow)
open the style list on the toolbar  %KeyFor(OpenStyleWindow)
get help from the Spel As You Go	 proofreading tool  %KeyFor(SpellAsYouGo)
hear table cell coordinates  %KeyFor(sayWindowPromptAndText)
For a list of commonly used WordPerfect shortcut keys  %KeyFor(WindowKeysHelp)
@@
@msgHotkeyHelp2_L
To read the misspelled word and the first suggestion use  %KeyFor(ReadMisspelledAndSuggestion).
To read the word in context use  %KeyFor(ReadWordInContext).
@@
@msgHotkeyHelp2_S
read misspelled word and first suggestion %KeyFor(ReadMisspelledAndSuggestion)
read word in context %KeyFor(ReadWordInContext)
@@
@msgHotkeyHelp3_L
To read the context of the search phrase use  %KeyFor(readWordInContext).
@@
@msgHotkeyHelp3_S
read context of search phrase %KeyFor(readWordInContext)
@@
;Screen Sensitive Help Messages
@WPHelpMsg1_L
This is the WordPerfect main document 	window
use the editing or reading functions or use the menus to manipulate the document
@@
@WPHelpMsg2_L
This is the WordPerfect main document 	window
The document is read only. In order to edit it you must save it under a new name.
@@
@WPHelpMsg3_L
Typeover mode is active.
@@
@WPHelpMsg4_L
Insert mode is active.
@@
@WPHelpMsg5_L
Reveal Codes is on.
@@
@WPHelpMsg6_L
Block mode is active
@@
;for WPHelpMsg7_L/S, %1=cell coordinates, %2=table name
@WPHelpMsg7_L
The cursor is in cell %1 of %2
@@
@WPHelpMsg7_S
cell %1 of %2
@@
;for WPHelpMsg8_L/S, %1=number of newspaper style text columns,
;%2=current text column number containing cursor
@WPHelpMsg8_L
The document contains %1 text columns.
The cursor is currently in text column %1.
@@
@WPHelpMsg8_S
%1 text columns
cursor is in column %1
@@
@WPHelpMsg9_L
This edit control has an associated button.
To activate it use f4.
@@
@WPHelpMsg9_S
This edit control has an associated button.
To activate it use f4.
@@
@WPHelpMsg10_L
This edit control has an associated calendar.
To activate it use f4.
@@
@WPHelpMsg10_S
This edit control has an associated calendar.
To activate it use f4.
@@
@WPHelpMsg11_L
this is a selection array. Use arrow keys to select an option.
@@
@WPHelpMsg11_S
This is a selection array. Use arrows to select an option.
@@
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
@WPMsgChangeCase1_L
chhange case
@@
@WPMsgSelectionArray1
selection array
@@
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
;for WPMsg7_L, %1=misspelled word
@WPMsg7_L
The word %1 is possibly misspelled.
@@
;for WPMsg8_L, %1=first suggestion
@WPMsg8_L
the first suggestion is %1.
@@
;for WPMsg9_L, %1=phrase containing incorrect grammar
@WPMsg9_L
The phrase %1 contains incorrect grammar.
@@
@WPMsg10_L
To choose from the list of suggestions, right click with the JAWS cursor now.
@@
;for WPMsg11_L, %1=word for which no suggestions are available
@WPMsg11_L
The Prompt-As-You-Go has no suggestion for the word: %1
or the Proofreading tools are disabled.
@@
;for WPMsg12_L, %1=thesaurus word
@WPMsg12_L
Quick thesaurus active
Current Word is %1
@@
@WPMsg13_L
Delete word
@@
@WPMsg14_L
Delete to end of line
@@
@msgVirtualError_l
%1 is not supported in the Virtual window.
@@


;UNUSED_VARIABLES

; Verbosity items
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
@msgDetectLanguagesOn1_L
detect languages on
@@
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
@msgDictionary1_L
Dictionary
@@
@msgHotkeyHelp4_L
Bold use Alt B
Italic use Alt I
Underline use Alt U
Outline use Alt l
Shadow use Alt w
Small caps use Alt m
Redline use Alt R
Strikeout use Alt k
Hidden use Alt n
Help use Alt H
Ok use Alt O
Cancel use Alt C
Settings use Alt e
@@
@msgHotkeyHelp4_S
Bold Alt B
Italic Alt I
Underline Alt U
Outline Alt l
Shadow Alt w
Small caps Alt m
Redline Alt R
Strikeout Alt k
Hidden Alt n
Help Alt H
Ok Alt O
Cancel Alt C
Settings Alt e
@@
@msgHotkeyHelp5_L
All use Alt l
Same as text use Alt x
Help use Alt H
Ok use Alt O
Cancel use Alt C
Settings use Alt e
@@
@msgHotkeyHelp5_S
All Alt l
Same as text Alt x
Help Alt H
Ok Alt O
Cancel Alt C
Settings Alt e
@@
@msgHotkeyHelp6_L
Close use Alt C
Help use Alt H.
Create use Alt r
Copy to Favorites use Alt F
Options use Alt p
@@
@msgHotkeyHelp6_S
Close Alt C
Help Alt H.
Create Alt r
Copy to Favorites Alt F
Options Alt p
@@
@msgHotkeyHelp7_L
Close use Alt C
Help use Alt H.
Options use Alt p
Preview Document use Alt v
Open use Alt O
Open as Copy use Alt n
Browse use Alt w
@@
@msgHotkeyHelp7_S
Close Alt C
Help Alt H.
Options Alt p
Preview Document Alt v
Open Alt O
Open as Copy Alt n
Browse Alt w
@@
@msgHotkeyHelp8_L
File name use Alt n
File type use Alt y
Last modified use Alt m
Find Now use Alt d
Advanced use Alt c
New Search use Alt w
Look in use Alt L
@@
@msgHotkeyHelp8_S
File name Alt n
File type Alt y
Last modified Alt m
Find Now Alt d
Advanced Alt c
New Search Alt w
Look in use Alt L
@@
@msgHotkeyHelp9_L
Close use Alt C
File name use Alt n
File type use Alt y
Last modified use Alt m
Find Now use Alt d
Advanced use Alt c
New Search use Alt w
Password protect use Alt P
Embed fonts use Alt E
Save use alt S
Save in use Alt i
@@
@msgHotkeyHelp9_S
Close Alt C
File name Alt n
File type Alt y
Last modified Alt m
Find Now Alt d
Advanced Alt c
New Search Alt w
Password protect Alt P
Embed fonts Alt E
Save alt S
Save in Alt i
@@
@msgHotkeyHelp10_L
Setup use Alt S
Options/Print Summary use Alt O
Help use Alt H
@@
@msgHotkeyHelp10_S
Setup Alt S,
Options/Print Summary Alt O,
Help Alt H
@@
@msgHotkeyHelp11_L
Page definition use Alt a
Portrait use Alt P
Landscape use Alt L
Following Pages Different from Current use Alt w
Options use Alt O
@@
@msgHotkeyHelp11_S
Page definition Alt a
Portrait Alt P
Landscape Alt L
Following Pages Different from Current Alt w
Options Alt O
@@
@msgHotkeyHelp12_L
Left use Alt L
Right use Alt R
Top use Alt T
Bottom use Alt B
Equal use Alt E
Minimum use Alt n
Increase margin for binding use Alt c
Right use Alt i
Left use Alt f
Inside use Alt s
Outside use Alt u
Book (side to side) use Alt k
Tablet (top to bottom) use Alt a
Off use Alt O
Help use Alt H
@@
@msgHotkeyHelp12_S
Left Alt L
Right Alt R
Top Alt T
Bottom Alt B
Equal Alt E
Minimum Alt n
Increase margin for binding Alt c
Right Alt i
Left Alt f
Inside Alt s
Outside Alt u
Book (side to side) Alt k
Tablet (top to bottom) Alt a
Off Alt O
Help Alt H
@@
@WpMsgLookupWord_L
Lookup Word:
@@
@WpMsgSearchWord_L
Search Word:
@@
@WpMsgDefinition_L
Definition:
@@
@WpMsgWordList_l
Word List:
@@
@WPMsgIncreaseTableColumn_l
Table Column Increased
@@
@WPMsgDecreaseTableColumn_L
Table Column decreased
@@
@WPMsgTo
to %1
@@
@msgVersionNotResponding
This version of Corel WordPerfect does not currently respond to %product% communications.
Some functionality such as accurate font and point size information will not be available.
Please visit the Freedom Scientific support pages to find out how you can resolve this problem.
@@

;END_OF_UNUSED_VARIABLES

endMessages
