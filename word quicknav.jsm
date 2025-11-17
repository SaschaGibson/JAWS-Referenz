; Copyright 1995-2015 Freedom Scientific, Inc.
;JAWS 12.0.xx
; JAWS script file to be used by Microsoft Word--Office 2000 and above.

Const
;key names
	ks_ShiftF10="Shift+F10",

;string compares:
	scWindows="Windows",
; sound filename
	snElementNotFound="HarpString.wav",
; types of quick keys
	Pages="pages",
	SpellingErrors="spelling errors",
	GrammaticalErrors="grammatical errors",
	Revisions="revisions",
	Graphics="graphics",
	Sections="sections",
	Bookmarks="bookmarks",
	Headings="headings",
	Tables="tables",
	Comments="comments",
	Footnotes="footnotes",
	Endnotes="endnotes",
	Fields="fields",
	ComboBoxes="ComboBox formfields",
	Checkboxes="Checkbox formfields",
	EditFormfields="Edit formfields",
	lists="lists",


;UNUSED_VARIABLES

	ksNextGrammaticalError="a",
	ksPriorGrammaticalError="Shift+a",
	ksNextHeading="h",
	ksPriorHeading="Shift+h",
	ksNextComment="n",
	ksPriorComment="Shift+n",
	ksNextFootnote="o",
	ksPriorFootnote="Shift+o",
	ksNextEndnote="d",
	ksPriorEndnote="Shift+d",
	ksNextBookmark="b",
	ksPriorBookMark="Shift+b",
	ksNextGraphic="g",
	ksPriorGraphic="Shift+g",
	ksNextField="f",
	ksPriorField="Shift+f"

;END_OF_UNUSED_VARIABLES

;for the following csScript_ constants, they are the script names as they appear in Word.JKM:
const
	scScript_moveToNextHeading = "moveToNextHeading",
	scScript_moveToPriorHeading = "moveToPriorHeading"


Messages
@msgQuickNavNotAvailable_L
The ability to toggle Quick Navigation on and off is only available in an open document, editable message,  or unprotected form.
@@
@msgNoDocTables_L
There are no tables in this document.
@@
@msgNoDocTables_S
No tables
@@
@msgNoDocFields_L
There are no fields in this document.
@@
@msgNoDocFields_s
No fields
@@
@msgNoDocBookmarks_L
There are no bookmarks in this document.
@@
@msgNoDocBookmarks_S
No bookmarks
@@
@msgNoDocEndnotes_L
There are no end notes in this document.
@@
@msgNoDocEndnotes_S
No end notes
@@
@msgNoDocFootnotes_L
There are no footnotes in this document.
@@
@msgNoDocFootnotes_S
No footnotes
@@
@msgNoDocComments_L
There are no comments in this document.
@@
@msgNoDocComments_S
No comments
@@
@msgNoDocGraphics_L
There are no graphics in this document.
@@
@msgNoDocGraphics_S
No graphics
@@
@msgNoDocPages_l
There is only one page in this document.
@@
@msgNoDocPages_s
only one page
@@
@msgMoveToPageError_L
Error moving to page
@@
@msgMoveToPageError_S
Error moving to page
@@
@msgNoDocSections_L
There is only one section in this document.
@@
@msgNoDocSections_S
only one section
@@
@msgNoGrammaticalErrors_l
There are no grammatical errors in this document.
@@
@msgNoGrammaticalErrors_s
No grammatical errors
@@
@msgNoSpellingErrors_l
There are no spelling errors in this document.
@@
@msgNoSpellingErrors_s
No spelling errors
@@
@msgNoDocRevisions_l
There are no revisions in this document.
@@
@msgNoDocRevisions_s
no revisions
@@
@MsgNoDocHeadings_l
There are no headings in this document.
@@
@msgNoDocHeadings_s
No headings
@@
@msgHTMLKey_l
This key is unavailable in Microsoft Word.
@@
@msgHTMLKey_s
unavailable in Microsoft Word
@@
@msgOutlookHTMLKey_l
This key is unavailable in Microsoft Outlook 2007 or above.
@@
@msgOutlookHTMLKey_s
unavailable in Microsoft Outlook 2007 or above
@@
@msgQuickKeyTrackChanges_l
You must turn on Track Changes to enable this feature. The Word shortcut key is  CONTROL+SHIFT+E.
@@
@msgQuickKeyTrackChanges_s
Turn on Track Changes. The shortcut is  CONTROL+SHIFT+E.
@@
@msgDeletedTextTemplate
<voice name=DeletedTextVoice>%1</voice>
@@
@msgInsertedTextTemplate
<voice name=InsertedTextVoice>%1</voice>
@@
@msgCheckSpellingDisabled
The option to check spelling as you type is disabled.
@@
@msgCheckGrammarDisabled
The option to check grammar as you type is disabled.
@@
@msgOutOfList
out of list
@@
;for msgRevDate_L/S, %1=revision date
@msgRevDate_L
on %1
@@
;for msgNoControlOfTypeFormFields_l and msgNoControlOfTypeFormFields_s,
;%1 is the type of control, such as checkbox, edit, etc.
@msgNoControlOfTypeFormFields_l
There are no %1 formfields in this document.
@@
@msgNoControlOfTypeFormFields_s
No %1 formfields
@@
@msgNoComboBoxes_l
There are no ComboBox formfields in this document.
@@
@msgNoComboBoxes_s
no ComboBox formfields
@@
@msgNoCheckBoxes_l
There are no Checkbox formfields in this document.
@@
@msgNoCheckBoxes_s
no Checkbox formfields
@@
@msgNoEditFormFields_l
There are no Edit formfields in this document.
@@
@msgNoEditFormfields_s
no Edit formfields
@@
@msgSMMInsertedText
Inserted Text
@@
@msgSMMDeletedText
Deleted Text
@@
; For msgCommentRef, %1 is the text, %2 the author of the comment.
@msgCommentRef
Comment reference: %1 by %2
@@
;for msgNoBookmarkname_l/s, %1 is the text the bookmark is on.
@msgNoBookmarkName_l
Bookmark at %1. This bookmark is not named.
@@
@msgNoBookmarkName_s
bookmark at %1; not named
@@

; In msgQuickNavScriptNameConversionTable:
; Localizers who have not made changes to QuickNav keys do not need to change this message. 
; And the ones who have changed them should take care not to localize script names.
; Each line represents a conversion of a Word quicknav script name to a default quicknav script name,
; and whether Outlook uses the Word quicknav script, the default quicknav script,
; or if neither is available when Word is the editor.
;
; For each line in the message:
; The left side of the first equal sign is the Word quick nav script name assigned to the key.
; 	If the left side of the first equal sign is blank,
; 	then there is no Word quick nav assignment for that key.
;
; The right side of the first equal sign is the default script name assigned to the key.
; If Word has an assignment in the quick nav section to a key
; 	for which default has no equivalent quick nav key assignment,
; 	the default script name is taken from the common section if there is an assignment for that key.
; In cases where a Word script name maps to more than one default script name,
; 	the possible default script names are all included and delimited by vertibal bar.
;
; The number after the second equal sign, if it exists,
; 	represents which script Outlook uses when Word is the editor.
;	1 means Outlook uses the Word quicknav script,
; 	2 means that Outlook uses the default quicknav script,
; 	and 0 means that neither script is used.
; The second equal sign and the Outlook entry is included only if
; 	Word and Default scripts both exist for a key.
;
; If there is no default assignment to a key where Word has a quick nav assignment,
; that entry is omitted from the table since there is no need to convert to a default script name.
; In cases where there is no Word script, there is also no Outlook entry.
;
; See the [Quick Navigation Keys] sections of Word.jkm, default.jkm, and the Outlook 2007 and 2010 JKM files.
; This conversion table is used by keyboard help for quick navigation keys in Outlook messages.
; It is important that no extra whitespace be added to this message,
; since it is parsed to create the collection data for the script name conversion.
@msgQuickNavScriptNameConversionTable
MoveToNextPage=VirtualSpacebar=1
MoveToPriorPage=JAWSBackspace=1
MoveToNextGrammaticalError=MoveToNextRadioButton=1
MoveToPriorGrammaticalError=MoveToPriorRadioButton=1
MoveToNextBookmark=MoveToNextButton=0
MoveToPriorBookmark=MoveToPriorButton=0
MoveToNextCombo=MoveToNextCombo=0
MoveToPriorCombo=MoveToPriorCombo=0
MoveToNextEndnote=MoveToNextDifferentElement=0
MoveToPriorEndnote=MoveToPriorDifferentElement=0
MoveToNextEdit=MoveToNextEdit=0
MoveToPriorEdit=MoveToPriorEdit=0
MoveToNextField=FocusToNextField=1
MoveToPriorField=FocusToPriorField=1
MoveToNextGraphic=MoveToNextGraphic=1
MoveToPriorGraphic=MoveToPriorGraphic=1
=MoveToNextListItem
=MoveToPriorListItem
=JumpToLine
=JumpReturnFromLine
=MoveToNextPlaceMarker
=MoveToPriorPlaceMarker
MoveToNextList=MoveToNextList=1
MoveToPriorList=MoveToPriorList=1
MoveToNextSpellingError=MoveToNextFrame=1
MoveToPriorSpellingError=MoveToPriorFrame=1
MoveToNextComment=MoveToNextNonLinkText=0
MoveToPriorComment=MoveToPriorNonLinkText=0
MoveToNextFootnote=MoveToNextObject=0
MoveToPriorFootnote=MoveToPriorObject=0
SayNextParagraph=SayNextParagraph=1
SayPriorParagraph=SayPriorParagraph=1
=MoveToMainRegion
=MoveToNextBlockQuote
=MoveToPriorBlockQuote
MoveToNextRevision=MoveToNextRegion=0
MoveToPriorRevision=MoveToPriorRegion=0
MoveToNextSection=MoveToNextSameElement=0
MoveToPriorSection=MoveToPriorSameElement=0
MoveToNextTable=MoveToNextTable=1
MoveToPriorTable=MoveToPriorTable=1
=MoveToNextUnvisitedLink
=MoveToPriorUnvisitedLink
=MoveToNextVisitedLink
=MoveToPriorVisitedLink
MoveToNextWordFromList=MoveToNextWordFromList=1
MoveToPriorWordFromList=MoveToPriorWordFromList=1
MoveToNextCheckbox=MoveToNextCheckbox=0
MoveToPriorCheckbox=MoveToPriorCheckbox=0
=MoveToNextSpan
=MoveToPriorSpan
=MoveToNextDivision
=MoveToPriorDivision
=MoveToNextOnMouseOverElement
=MoveToPriorOnMouseOverElement
=MoveToNextOnClickElement
=MoveToPriorOnClickElement
=MoveToNextMailToLink
=MoveToPriorMailToLink
=MoveToFlowTo
=MoveToFlowFrom
=MoveToNextSeparator
=MoveToPriorSeparator
StepToStartOfElement=StepToStartOfElement=1
StepToEndOfElement=StepToEndOfElement=1
moveToNextHeading=moveToNextHeading|MoveToNextHeadingLevelN|SpeakPlaceMarkerN=1
moveToPriorHeading=moveToPriorHeading|MoveToPriorHeadingLevelN|MoveToPlaceMarkerN=1
@@
; for msgKeyboardHelpSynopsisQuickNavNotAvailable and msgKeyboardHelpDescriptionQuickNavNotAvailable
; These are messages formerly in WordQuickNav.jsd,
; and are the keyboard help messages for various unavailable quick nav scripts.
@msgKeyboardHelpSynopsisQuickNavNotAvailable
This key is not available in Microsoft Word or Outlook messages where Word is the editor.
@@
@msgKeyboardHelpDescriptionQuickNavNotAvailable
This key is only available in virtual documents.
@@
; for hyperlinks in document:
@msgNoHyperlinks1_L
No hyperlinks in document
@@
@msgNoHyperlinks1_S
No hyperlinks
@@
@msgNoMoreHyperlinks_L
No more hyperlinks found
@@
@msgNoMoreHyperlinks_S
No more hyperlinks
@@
@msgNoPriorHyperlinks_L
No prior hyperlinks found
@@
@msgNoPriorHyperlinks_S
No prior hyperlinks
@@


;UNUSED_VARIABLES

@msgJumpToLineNotAvailable_L
Jump to line is only available on the Internet.
@@
@msgInsertedText
Inserted:
@@
@msgDeletedText
Deleted:
@@

;END_OF_UNUSED_VARIABLES

EndMessages
