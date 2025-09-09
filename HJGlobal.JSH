;Copyright 1996-2022 by Freedom Scientific
;Header file of HJ global variables
;do not add your global variables to this file,
;you can create a new header file
;with your own global variables and unique name.

Globals
;string name for ConfigurationChangedEvent when to load settings not managed directly by Settings Center:
	string globalPrevConfiguration,
; Determines whether the FindHotKey function should fall back to using GetCharacter to obtained the
; "Inferred Access Key" if the GetHotKey function returns an empty string.
	int gbUseInferredAccessKeys,
;For Focus Loss timer:
	int gi_FOCUS_LOSS_TIMER,
	string gstrKeyboardLayout, ;for language change
	int gIVirtualDialogInsertB,
	string GDocumentSayAllScheme,
	int GITblHeaders,  ;for which headers are announced.
	int GITblHeaderContentOrder,  ;for whether header is announced before cell content or cell content before header.
	;deprecated: int GIPrevTblHeaders,	; for benefit of IE Custom Settings.
	int nSaySelectAfter,; Used to determine whether or not the Selected/Unselected state is to be spoken before or after the text.
	HANDLE GlobalPrevFocus, ; handle of previous focus window
	HANDLE GlobalPrevReal, ; handle of previous real window
	string GlobalPrevRealName, ; name of previous real window
	string GlobalPrevDialogIdentifier, ; The previous Dialog Identifier.
	int GlobalPrevDocumentIdentifier, ; The previous document Identifier.
	int GlobalPrevWebDialogIdentifier, ; The previous web dialog Identifier.
	HANDLE GlobalPrevApp, ;handle of previous application
	HANDLE GlobalFocusWindow, ; temp variable to pass a window handle
	int GlobalWasHjDialog,; Stored for use by Virtual Buffer and other uses by functions that monitor the change of focus, both real and virtual.
	int GlobalPrevFocusWasEmbeddedWebBrowserWindow,
	int giSuppressStartMenu,
	int GlobalMousePixel, ; pixel parameter for MouseLeft, MouseRight, MouseDown, and MouseUp
	string GlobalCursorType, ; Cursor type that is used to transfer CursorType to {control+shift+insert+c}
	int timesPressedDefault, ; for control+insert+f2
	int GlobalSDMControl,
	handle ghWndResultsViewer,
	int DefaultFirstTime,
	int UT_OutputMode,
	int UT_MSAAObjectOutputMode,
	int UT_UIAObjectOutputMode,
	int UT_FontMode,
	int GlobalMenuMode, ;to keep track of the menu mode.
	int GlobalPrevMenuMode,
	int GlobalPrevTutorMenuMode,; To monitor the menus in the tutorMessageEvent

;MENU_INACTIVE= 0,  MENUBAR_ACTIVE=1, MENU_ACTIVE=2
	int InJAWSFind, ;Set when script JAWSFind is being fired.
;Vars for last Tool Tip, string is text, hWnd is tool tip.
	handle ghwndToolTip,
	string gStrLastTipFromEvent,
	string strLastTooltip, ;Stores the last processed tooltip.  This value should be invalidated (cleared)
; when the mouse moves (in the MouseMoved event).
	int nSelectingText,
	int nLastSelectUnitTime,

;Frame globals
	int GlobalFrameTop, int GlobalFrameLeft, int GlobalFrameBottom, int GlobalFrameRight,
	int GlobalFrameParentTop, int GlobalFrameParentLeft, int GlobalFrameParentBottom, int GlobalFrameParentRight,

;for controlling how treeviews are spoken:
	int previousTreeviewLevel,
	int giSayTreeViewLevelPrevItemParent ,
	string gsTvPathToPrevSelection,
	string gsTVPrevPositionInGroup,

	int GlobalPixelsPerSpace,
	int BackForward,
	int GiIgnoreFormsModeSpeak,
; for speaking format and text
	int globalSayingCurrentItem, ; flag to indicate that the current Say operation is SayCurrentItem,
		;where CurrentItem is char, word or line.
	string g_strHighlightBeforeSelect,
; Used in the table navigation scripts to indicate whether the movement was in a vertical
; or horizontal direction if the table object is a Java Table.  This global variable is then
; passed as the parameter to the function DoTableCells in ActiveItemChangedEvent.
	int g_JavaTableNavDir,
	int g_JavaPrevNumOfCells,
	int g_JavaIgnoreNextActiveItemChange,
	HANDLE g_PrevAppMainObjectID,
	HANDLE g_PrevTopLevelObjectID,
	HANDLE g_PrevRealObjectID,
	HANDLE g_PrevFocusedObjectID,


;relating to DocumentLoadedEvent:
	int gbDefaultSayAllOnDocumentLoad,
	int giLastDocumentLoadTime,
	int giLastFormsModeState,
	int giRestoreFormsModeAfterVirtualizeCPS,
	int gbDocumentLoadAppAlertShowing,

; Global handles for Reminder Dialog...
	handle ghNull, ; For nulling out handle variables from WindowDestroyedEvent
	handle ghReminderDialog,
	handle ghReminderReturn,
	handle ghOutlookWindow,
	int GlobalMsnAnnounceSignIn, ; Used in MsnHelper, Msn Messenger, and Windows Messenger.
;for clipboard text changes
	int ClipboardTextChanged,

;for locked keyboard:
	int gbLockedKeyboard,
	int gbLockedSavedActiveFollowsBraille,
	int giScheduledSayLockedKeyboardHelp,
	int giScheduleNotifyLockedKeyboard,

;For BX remote access:
	int gbUsingRemotePACMate,
	int gbBXFunctionKey,
	int gbBXKeyIsAlpha,
	string gsBXSimulateKey,

;for use with SwitchConfiguration:
	int gbSwitchingConfiguration,

;For AppendToClipboard.  Flag is set when text is appended to the Windows clipboard:
	int gbAppendedToClipboard,

;for Alternate SayAll toggle:
	int gbSayAllTemporarilyToggledToSAPI,
	int gbSAPILoaded,
	;For Start Menu List name (group) in Windows Vista:
	string gstrListViewGroupName,

;for braille:
;For Braille cursor restriction,
;stores default value.
	int giDefaultBrlCursorRestriction,
	int GIBrailleActive,
	int gbBrailleStudyModeActive,

;determines whether forms mode should automatically close when closing combo box:
	int gbShouldExitFormsModeOnComboBoxClose,

;whether or not cell coordinates should be announced when navigating with table nav commands:
	int gbDefaultVCursorCellCoordinatesAnnouncement,

;determines if SelectEntireDocument is being used in a document where enhanced edit support is turned on:
	int gbSelectingEntireEnhancedEditSupportDocument,

;Tandem:
	int globalTandemMode,
	string GlobalTandemConnectSound,
	string GlobalTandemDisconnectSound,

string GlobalSharedDefaultJCFFile, ;The path and name of the default.jcf file in the shared settings directory
string GlobalUserDefaultJCFFile, ;The path and name of the default.jcf file in the user settings directory:

;for the Word List feature:
string GlobalCurrentWordFromList,

;for the ribbons:
int GlobalRibbonState,
int GlobalPrevRibbonState,

;Used by navigation scripts to tell ActiveItemChangedEvent whether header information should be spoken after the navigation occurs:
	int globalSpeakHeaderOnCellChange,

;for the key layers, to determine which is active:
	int GlobalActiveLayer,

;used to determine if ScreenMagnifiedEvent will announce the magnification level change:
	int gbAnnounceNewMagLevel,

;Used by MAGic to test if voice context menu has appeared and should be announced:
	int gbAnnounceVoiceProfilesContextMenu,

; flag for dialog page change tested in SayFocusedWindow
; and SayCharacterUnitt functions to prevent extra chatter when extra firing occurs.
	int giDialogPageChanged,

;used by SelectTextBetweenMarkedPlaceAndCurrentPosition and TextSelectedEvent:
	int gbSelectingTextBetweenMarkedPlaceAndCurrentPosition,

;keyboard help
;for determining when KeyboardHelp is on:
	int gbKeyboardHelp,
;data used for keyboard help:
	collection c_KeyboardHelpData,

;Because an empty document is shown if the speech history is empty,
;no DocumentLoadedEvent fires and thus nothing is announced in Results viewer.
;This global is used when showing an empty document in Results Viewer:
	int global_EmptyResultsViewerDocument,

;Touch navigation global object and treewalker:
	object g_UIA,
	object g_UIATreeWalker,
	int g_UIADebugging,
	int giSpeakSmartNavLevel,

; Whether speech should be interrupted when a dialog box is created.
	int gbInterruptSpeechWhenADialogBoxIsCreated,

; The Sound Mixer discovery dialog is shown once per session the first time a voice chat app is focused.
	int g_bShowSoundMixerDiscoveryDialog,
	; used to restore on autofinish in case the app being switched to does not have any custom Braille split modes. 
	int giInitialSplitModeValue
	
;MouseEchoControllingProduct is assigned one of the MouseEchoControlledBy values (see hjConst.jsh).
globals
	int MouseEchoControllingProduct

;For alerts:
globals
	int LastMSAAAlertTime

;for virtual cursor restriction on web pages:
globals
	int virtualCursorRestrictionType,  ; See virtualCursorRestrictionType constants in hjConst.jsh
	int prevVirtualCursorRestrictionType  ;for when virtualCursorRestrictionType must be saved because the reason for restriction changed from one type to another

;For snapping and window visual state functionality used with windows+arrow keys:
globals
	collection c_WinArrow

globals
	; For OCR support.
	Int GlobalOCRJobID,
	int gbRecognizingScreenAreaa,
	int GlobalOCRJobType,
; For Background OCR
handle hwndGlobalOCRBackgroundRecognition,
	int scheduleGlobalOCRBackgroundRecognitionID,
	int giBackgroundOCRJustStarted,
Int gOCRPrimaryLang,
	Int gOCRSecondaryLang,
	Int gUseMicrosoftOcr,
	int gMicrosoftOCRLang,
	string gBackgroundOCRSound,
	collection c_BackgroundOCRRect
		; c_BackgroundOCRRect caches things related to the rectangle being used for BackgroundOCR.
		; Members are:
		; int rectCached -- true if the rectangle is currently cached in the collection.
		; int shouldUpdateRect -- set to true when it is good to check for updates to the rectangle, such as resizing events.
		; int hasRectChanged -- set to true every time the rect is updated. Used to restrict the cursor when the rect changes.
		; int restrictedToCustomRect -- set to true when using a custom rectangle for the AllInOne script.
		; int left -- The left coordinate of the rectangle.
		; int right -- The right coordinate of the rectangle.
		; int top -- The top coordinate of the rectangle.
		; int bottom -- The bottom coordinate of the rectangle.

globals
	; For AI Labeler support
	int gAILabelerRequestInProgress,
	int gAILabelerScheduleRequestComplete,
	int gAILabelerShouldUseCustomLabels,
	string gAILabelerCustomLabelFile,
	string gAILabelerCustomLabelSection,
	string gAILabelerCustomLabelKey,
	string gAILabelerCustomLabel