;JAWS Message file for Acrobat Reader

CONST
;string compares
	scUpdate="Update",
; Window names...
;Fake window class, by name,
;Adobe names these windows accordingly, but
;These strings are probably not localizable,
;as they are not "uman-readable:
	wnAcrobatTree = "AVTreeNodeSimpleView",
	wnAcrobatButtons = "AVTabView",
	wnAcrobatAttachmentsButtons = "AVTableContainerView",
	wn_ReadingUntaggedDocument = "Reading Untagged Document",
	wnGoToPage = "Go To Page",
	wnPreferences="Preferences", ;Preferences dialog:
	wnAvailableUpdatesDialog="Available Updates",
	wnDescription="Description",
	wn_HowToContentsView = "AVHowToContentsView",
	wn_CalendarControl = "Calendar Control",
;for the app-specific branch of the Options tree:
	uoToggleBlankLineBetweenParagraphs = "ToggleBlankLineBetweenParagraphs:Blank Line Between Paragraphs",
;EndConst



;UNUSED_VARIABLES

	wnAvailableList="Available:",
	wnSelectedList="Selected"

;END_OF_UNUSED_VARIABLES

Messages
@msgAppNameReader
Adobe Reader
@@
@msgAppNamePro
Adobe Acrobat Professional
@@
;for msgScreenSensitiveHelp2, %1 = the current tree view level
@msgScreenSensitiveHelp2
Tree view level %1.
to read through the items, use the up or down arrow keys.
To open or close an item, use the right or left arrow keys.
@@
@msgHotKeyHelp1
%product% Hot Keys for Adobe Acrobat:
Select a link  %KeyFor(SelectALink)
Find text in this document  %KeyFor(VirtualFind)
Next page in document  %KeyFor(NextPage)
Previous page in document  %KeyFor(PreviousPage)
Enter a page number  %KeyFor(GoToPage)
@@
@msgListBoxCustomTutorHelp
To move through items press up or down arrow.
@@
@msgSecureDocument
The author set this document's security settings in a way that prevents access.
@@
@msgUnverified
Unverified
@@
@msgInvalid
Invalid
@@
@msgValid
Valid
@@
@msgButton
To activate press enter.
@@
;For msgColorText, %1 = the text color
@msgColorText
%1 text
@@
@msgBlankLineBetweenParagraphsHlp
This setting controls whether or not paragraphs are separated by a blank line.
@@
@msgNoDocumentOpen
No PDF document is open in this window.
@@
;msgPromptToOCRDocument is shown as dialog text in a YesNo message box when JAWS informs the user that the document is empty.
@msgPromptToOCRDocument
This document may be a scanned image which makes it difficult or impossible for JAWS or Fusion to read without first scanning the document with OCR.

Would you like JAWS to OCR the document now?
@@

;UNUSED_VARIABLES

@msgMSAAInfo
MSAA labels not present in form fields.
@@
;The following messages are the same as Document Has Links above, but Page is substituted.
@msgPageHasLinks_L
Page has %1 link%2
@@
@msgPageHasLinks_S
%1 link%2
@@
;The following null message is used for the %2 value as well, if no plural.
@msgScreenSensitiveHelp1
This is a pdf document which you can read with the Virtual Cursor.
To select a link, press %KeyFor(SelectALink).
To find text in this document, press %KeyFor(VirtualFind).
@@
@msgMSAAPromptOn
On
@@
@msgMSAAPromptOff
Off
@@
@msgMSAAPromptSpeak
MSAA for form fields is %1
@@
@msgPDFRadioButton
To check, press the space bar.
@@
@msgRequired
Required
@@
@msgReadOnly
Read Only
@@

;END_OF_UNUSED_VARIABLES

@msgPDFLocationError
JAWS could not determine the location of the PDF to OCR. This is most likely because you hit escape instead of choosing Continue when presented with the  Prepare document for screen reader dialog. Try  reopening the document and choosing Continue when the dialog is shown.
@@
EndMessages
