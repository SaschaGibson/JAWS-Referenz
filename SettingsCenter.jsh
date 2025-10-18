; Copyright 2009-2015 by Freedom Scientific, Inc.
		; Scripts for Settings center header file.

Const
;Window class for main tree:
	wc_Treeview_Main = "FeatureTree",
	; Control ID's
	SettingsTreeViewID = 102,
	SearchEditID = 101,
	ApplicationSelectionComboID = 10006,
	QuickHelpEditID = 10013,
	QuickHelpEditIDForResearchIt = 1713,
	OkButtonID = 1,
	CancelButtonID = 2,
	ApplyButtonID = 10002,
	VerbosityItemListID = 1259,
	DialogueContainerID = 27967524,

	SelectFormsModeAutoRadioID = 1048,
	SelectFormsModeManualRadioID = 1049,
	DefineBrailleColourMarkingID = 1082,
	SpeechVerbosityListbox = 1259,
	BrailleVerbosityListbox = 1243,
	CustomizePunctuationListViewID = 1363,

	; Messages used to correspond with settings center...
	WM_COMMAND = 0x0111,
	WM_KEYDOWN = 0x0100,
	WM_KEYUP = 0x0101,
	BM_CLICK = 0x00F5,
	BM_GETCHECK = 0x00F0,
	BM_SETCHECK = 0x00F1,
	UDM_GETRANGE = 1126,
	UDM_SETPOS = 1127,
	UDM_GETPOS = 1128,
	; Message names to register...
	MN_HighlightedControl = "HighlightControl",
	MN_ImageIndex = "FeatureTreeImageIndex",
	MN_ChangePage = "ChangePage",
	MN_ChangeToDefault = "ChangeToDefault",
	MN_ChangeToDomain = "ChangeToDomain",


	; Window classes...
	WC_SearchTreeList = "SearchTreeList",
	WC_DialogueContainer = "DialogContainer",
	WC_SearchBox = "SearchBox",

	; Script names...
	SN_ActivateSearchBox = "ActivateSearchBox",
	SN_SayLine = "SayLine",

	; System menu keystroke...
	KS_SystemMenu = "Alt+Space"

Globals
	Handle ghPressedFromTreeView,
	String gsBrlTreeViewControlName,
	string gsBrlTreeViewControlState,
	Int giBrlControlState

; messages and message templates that should never be translated...
Messages
@MSG_MessageVoiceTemplate
<VOICE NAME="MESSAGEVOICE">%1<FORCE></VOICE>
@@
@MSG_ConcatenateWords
%1 %2
@@
EndMessages
