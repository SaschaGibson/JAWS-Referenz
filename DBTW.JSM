;message file for DBTW
; cln, Nov. 4, 2019
; Copyright Duxbury Systems, Inc.
; All rights reserved.

const
;string compares
	scBrailleDocument = "Braille Document",
	scPrintDocument = "Print Document",
	scDocument = "Document",
	scPage = "Page:",
	scLine = "Line:",
	scCol = "Column:",
	scUnicode = "U+",
	scCurrentStyle = "Current Style:",
	scRow = "Row ",
	scSlash = "/",
	scEllipsis = "...",
	scKeys = "Keys:",
	scKeys6 = "keys:6",
	scKeys1 = "keys:1",
	scErrorMessage0 = "Error message 0",
	scOK = "OK",
	scFileNew = "File: NEW...",
;Keystrokes:
;These are the same as their script names in DBTW.jkm
;Prefix ks is added so they're known as keystrokes.
	ksSpeakTransLine = "Alt+7",
	ksControlF8Press = "Control+F8",
	ksHighlighting = "Control+H",
;window names
	wnFileNew = "File: NEW...",
	wnFind = "Find...",
	wnReplace = "Replace...",
	wnSpellCheck = "Spell Check...",
	wnSuggestedReplacements = "Suggested replacements:",
	wnConfirmReplacement = "Confirm Replacement",
	wnOK = "OK",
	wnDBT = "DBT"
;end const

messages
@msgAppName
dbtw
@@
@msgAppStart
for JAWS hot keys in DBT press Insert+H
@@
@msgJHotKeyHelp_L
To hear the translated line press  %KeyFor(SpeakTransLine).
To hear the current style  press %KeyFor(SayStyleName).
To hear the current row and column numbers in a table  press %KeyFor(SayStyleName) twice.
To hear the current location press  %KeyFor(SayLocation).
To hear the current document name press  %KeyFor(SayDocName).
To toggle use of translated line on or off for up and down in braille press  %KeyFor(ReadLineInBrailleDocToggle).
To toggle announcing of style change and skipped lines on or off press %KeyFor(ReadStyleChangeToggle).
To toggle on or off braille character echo for braille keyboard entry press %KeyFor(EchoBrailleCharsToggle).
To read the current line of text showing in spell check or replace,
press %KeyFor(ReadWordInContext).
To toggle between JAWS cursor on translated line and PC cursor press  %KeyFor(TransLineCursorToggle) (Alt+Semicolon).
To hear the current line position press %KeyFor (SayLinePosition) (Alt+Comma).
To hear the number of characters to the end of the line press %KeyFor (SayLinePosition) (Alt+Comma) twice quickly.
To hear the number of characters on the line press %KeyFor (SayTotalAndLeftOffset) (Alt+Period).
To hear the number of left spaces press %KeyFor (SayTotalAndLeftOffset) (Alt+Period) twice quickly.
To hear the last word on the line press %KeyFor (SpeakLastWord) (Alt+Slash).
@@
@msgJHotkeyHelp_S
Speak the translated line: %KeyFor(SpeakTransLine).
Say the current style: %KeyFor(SayStyleName).
Say the table row and column numbers:  %KeyFor(SayStyleName) twice.
Say the current location: %KeyFor(SayLocation).
Hhear the document name: %KeyFor(SayDocName).
Ttoggle use of translated line on or off for up and down in braille: %KeyFor(ReadLineInBrailleDocToggle).
Ttoggle announcing of style change and skipped lines: %KeyFor(ReadStyleChangeToggle).
Toggle braille character echo for braille entry: %KeyFor(EchoBrailleCharsToggle).
Rread the current line of text shown in spell check or replace: %KeyFor(ReadWordInContext).
Toggle between JAWS cursor on translated line and PC cursor: %KeyFor(TransLineToggle).
Hear the current line position: %KeyFor (SayLinePosition) (Alt+Comma).
Hear the number of characters to the end of the line: %KeyFor (SayLinePosition) (Alt+Comma) twice quickly.
Hear the number of left spaces: %KeyFor (SayLeftOffsetAndTotal) (Alt+Period).
Hear the number of characters on the line: %KeyFor (SayLeftOffsetAndTotal) (Alt+Period) twice quickly.
Hear the last word on the line: %KeyFor (SpeakLastWord).
@@
@msgSpelled
spelled
@@
@msgPage
Page 
@@
@msgTableRow
R
@@
@msgTableCol
C
@@
@msgRow
Row 
@@
@msgCol
Column 
@@
@msgNewLine
new line
@@
@msgSpaceAtEndOfLine
 end of line
@@
@msgEndOfLine
at end of line
@@
@msgTurningOnTransLine
turning on translated line
@@
@msgTransLineNotFound
translated line not available
@@
@msgTransTableError
translation not available
@@
@msgJawsCursorOnTransLine
JAWS cursor at start of translated line
@@
@msgTransLineOn
translated line on
@@
@msgTransLineOff
translated line off
@@
@msgEndLine
end of translated line
@@
@msgStartLine
start of translated line
@@
@msgNotInDocument
not in document window
@@
@msgCode
code
@@
@msgStyle
style
@@
@msgBeginStyle
begin style
@@
@msgEndStyle
end style
@@
@msgReadBackTrans
use translated line for up and down in braille
@@
@msgReadBrailleLinesAsBrailleChars
read line as braille characters for up and down in braille
@@
@msgSilentBrailleLines
silent for up and down in braille
@@
@msgSpeakStyleChange
Announcements: Change of style on.
@@
@msgStyleChangeOff
Announcements: change of style off.
@@
@msgSpeakSkips
Skipped lines on.
@@
@msgSkipsOff
Skipped lines off.
@@
@msgEchoBrailleCharsOn
echo braille character entry
@@
@msgEchoBrailleCharsOff
do not echo braille character entry
@@
@msgNoLocation_l
location not available in coded view
press Alt+F3 to turn codes off
@@
@msgNoLocation_s
in coded view
@@
@msgCodesOn_l
coded view
@@
@msgCodesOn_s
coded
@@
@msgCodesOff_l
formatted view
@@
@msgCodesOff_s
formatted
@@
@msgHighlightingOn
highlighting on
@@
@msgHighlightingOff
highlighting off
@@
@msgPerkinsOn
6 key on
@@
@msgPerkinsOff
6 key off
@@
@msgFind
Find
@@
@msgReplace
Replace
@@
@msgShortcutPreferences
Shortcut Preferences
@@
@msgInsertForGrade0
Insert for grade 0
@@
@msgMdiClient
MDI client
@@
@msgLineSkip
line skip
@@
@msgPageId
P
@@
@msgLineId
 L
@@
@msgColId
 C
@@
@msgCatchingUp
catching up
@@
@msgLineLength
Line length 
@@
@msgTotalCharacters
 total characters.
@@
@msgLeftSpaces
 left spaces
@@
@msgLinePosition
position
@@
@msgToEndOfLine
  to end of line
@@

endMessages

