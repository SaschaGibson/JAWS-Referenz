; Copyright 2010-2024 Freedom Scientific, Inc.
; JAWS script header file  for Mozilla Thunderbird e-mail client

Globals
	; for speeding up message list movements.
	Object goListItem,
	StringArray gsHeaders,
	Int GlobalPrevObjectType,
	String gsSpeechFilter,
	String gsBrailleFilter,
	String gsBrailleSection,
	Collection gcOptions

Const
	WindowedReadOnlyMessageStart = 14,
	TabbedReadOnlyMessageStart = 2,
	FromEditableMessage = "7,2",
	SubjectEditableMessage = "7,5",
	SpellCheckerSuggestionsListTemplate = "8",

	; Dialogues IDs. They are the role strings separated by commas.
	SpellCheckerDialogueIDString = "41,41,43,41,42,43,41,33,43,43,43,43,41,43,43,41,46,43,13",
	AddressBookWindowIDStringStart = "11,11,11,22,22,41,35,35",
	AddressBookWindowIDStringEnd = "20,23,13",

	; Item functions names...
	HeadersAnnouncementFunctionName = "HeadersAnnouncementToggle",
	AutoReadMessageFunctionName = "AutoReadMessageToggle",

	; JSI file constants...
	SECTION_USER_OPTIONS = "User Options",
	HKEY_ANNOUNCE_HEADERS = "AnnounceHeaders",
	HKEY_AUTO_READ_MESSAGE = "AutoReadMessage",

	; untranslateable characters...
	SC_Dash = "-",
	SC_Comma = ",",
	SC_Equals = "=",

	; window classes...
	WC_Client = "MozillaWindowClass",
	WC_Dialogue = "MozillaDialogClass",
	WC_ReadOnlyMessageBody = "MozillaContentWindowClass",

	; Junk status filters.
	SC_StatusJunkMarker = "100",
	SC_StatusNoJunkMarker = "0",

	; value component name
	SC_ValueComponent = "value"

Messages
@MSG_WindowedAddressTemplate
%1,1,1,1
@@
@MSG_WindowedSubjectTemplate
%1,1
@@
@MSG_TabbedAddressTemplate
32,1,%1,1,1,1
@@
@MSG_TabbedSubjectTemplate
32,1,%1,1
@@
@MSG_TabbedNamePrefix
32,1,%1
@@
@MSG_AddressEditableMessageTemplate
7,3,%1,2,1
@@
@MSG_ColumnTemplate
%1|%2
@@
@MSG_VoiceNameTemplate
<VOICE NAME="%1">%2</VOICE>
@@
@MSG_ConcatenateStringsWithSpaceTemplate
%1 %2
@@
@MSG_ConcatenateStringsWithCommaTemplate
%1, %2
@@
@MSG_ConcatenateThreeStringsTemplate
%1%2%3
@@
@MSG_SelectFunctionToRunItemTemplate
%1:%2
@@
@MSG_SelectFunctionToRunItemsTemplate
%1|%2
@@
@MSG_JSIExtentionTemplate
%1.jsi
@@
@MSG_JBSExtentionTemplate
%1.jbs
@@
@MSG_BrailleSectionTemplate
SubtypeCode%1
@@
EndMessages
