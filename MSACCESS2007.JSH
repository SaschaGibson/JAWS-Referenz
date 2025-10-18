;Copyright 1995-2015 Freedom Scientific, Inc. 
;JAWS 11.00.xx 
;Microsoft Access 2007 Script Header File


Globals
	int giInTable,
	int giPrevTable,
	int giFormView,
	int giPrevFormView,
	int giPane,
	int giPrevPane,
	Int GlobalFocusChanged,
	int giMSAccessHasRunBefore,
	int GlobalPrevControl,
	int giAccessVersion,
	object OAccess,
	int giInDesignGrid, ; used in detecting context of query design view
	int giInWizard, ; used for hardcoding controls and labels
	int giInSpellChecker, ; flag set when in Spellchecker dialog
	string GlobalWindowClass,
; next globals used to save inefficient recalculation of form control details
; required for Braille support
	string gsControlLabel, ; save recalculating for both speech and Braille
	string gsBrlCtlInfo, ; control's Braille type and state
	string gsOptionGroup, ; stores info in OptionGroup for use by Braille Display
	string gsPriorSubformName, ; report subform label when tabbing into a subform
	object goControl, ; used for Braille support
	object goPriorControl,
	int giOnMainForm, ; used when detecting transition from form to subform and vice versa
; label search determines method for finding a control's label on a form
; on: use parent property of label control
; off: only look at caption/controlTipText
	int giLabelSearch, ; when true, search for labels, when false, use control.name
; next globals used for detecting table/query design views and screens within these views
	int giTableDesignView, ; set in SayFocusedWindow97 when in table design view.
	int giLastRow, ; used to determine if in properties panel or not
	int giLastCol,
	int giCurrentRow,
	int giCurrentCol,
	int giQueryDesignView, ; set when in query design view
; next globals used for creating relationships and joins
	int giRelInit, ; used to initialise relationship creation process
	int giJoinInit,
	string gsSourceTableName,
	string gsSourceField,
	int giSourceCol,
	int giSourceRow,
; next globals used to suppress row/col title speaking
	int giSuppressColumnTitle, ; true if moving up and down in same col
	int giSuppressRowTitle, ; true if moving across in same row
	int giSayOpenListViewItem,
	int giSayStabilizedOpenListViewItem,
	Int giInitDlgFlag, ; used to determine whether initial opening dialog is active.
	Int giDomActiveFlag, ; used to determine whether DOM is loaded.
	int giInEditMode, ; flag for when F2 to edit a field has been pressed.
	int giSpokenBefore, ; flag to stop repeating text already spoken when focus has changed.
;MSAA dialogs:  dlgClassname: OForm, dlgClassChildName: OFormSub;
	string gstrMSAADLGName,
	string gstrPrevMSAADLGName,
	string gstrMSAADLGText,
	string gstrPrevMSAADLGText

const
;spellchecker control IDS:
	cId_NotInDictionaryEditBox=3502,
	cID_SuggestionsListName=3503,
	cID_SuggestionsList=3504,
;comma delimiter
	scComma=",",
;versions
	Access97=8,
	Access2K=9,
	AccessXP=10,
	Access03=11,

;keys:
	ksDotFillStartId=" . ", ; used to find the end of prompts in multipage property sheets using class oArgDlg where dot fill is used.
	kiF2=60, ; key that brings up edit mode for fields.
	kiCtrlPageDown=593,
	kiCtrlPageUp=585,
	kiPageUP=73,
	kiPageDown=81,
	kiSpaceBar=57, ; SpaceBar keycode for KeyPressedEvent
	ksBrailleRouting = "Braille Routing",; Braille routing buttons to refresh MSAA

; Control iDs
	ciScrollSymbol=115, ; ASCII value of scrollLeft and ScrollRight symbols on same line as record number in datasheet table or query views.
	cID_folderCombo97=17, ; Office 97
	cID_FolderCombo=25, ; SDM control id of folder to save in or look in Office 2000
	cID_HistoryButton = 28,
	cID_BackButton=30,
	cID_openButton=31, ; Word 2000 (used in screen sensitive help to tell user about context menu)
	cID_HistoryXPButton=34,
	cID_BackXPButton=36,
; Access 2000 toolbar control ids in Database Window
	cID_DatabaseObjectsToolbar=120,
	cID_groupsToolbar=121,
	cID_MisspelledWord=3501,
	cID_ChangeToEdit=3502,
	id_ShowTableListBx = 1983,

; Window class constants
	wc_CustomListbox = "REListBox20W",
	wc_Osui="osui", ; class containing record number within datasheet view.
	wc_Button="button",
	wc_ODCombo="ODCombo", ; was wc_Combo
	wc_ToolBarWindow32="ToolbarWindow32", ; was wc107 Access 2000 only
	wc_OSysRel="OSysRel", ; was wc110
	wc_ODb="ODb", ; was wc111
	wc_oStatBar= "ostatbar", ; was wc112
	wc_OFormChild="OFormChild", ; was wc114
	wc_OArgDlg= "OArgDlg", ; was wc115
	wcNUIDialog = "NUIDialog",
	wc_OKttbx="OKttbx", ; was wc116
	wc_OGrid= "OGrid", ; was wc117
	wcGridEdit = "OKttbx",
	wc_OForm= "OForm", ; was wc118
	wc_OFormSub="OFormSub", ; was wc118a
	wc_OFormPopup="OFormPopup", ; was wc118b
	wc_OFormPopupNC="OFormPopupNC",
	wc_OFormNoClose = "OFormNoClose",
	wc_OReport="OReport", ; was wc119
	wc_OTable="OTable", ; was wc120
	wc_OScript="OScript", ;was  wc121
	wc_OQry="OQry", ; was wc122
	wc_NetUIParent = "NetUINativeHWNDhost", ; For parent of navigation pane
	wcNetUIHwnd = "NetUIHwnd",
	wc_Pane = "NUIPane",
	
	PANE_UNKNOWN = 0,
	PANE_NAVIGATION = 1,
	PANE_STARTUP = 2,
	PANE_CLIENT = 3,
	PANE_BUTTONBAR = 4,
	PANE_MESSAGEBAR = 5, 
;window classes
	wc_oTabControl="OTabControl",
;function names
	fn_MSAATabNameToGlobal="MSAATabNameToGlobal",
	fn_MSAAStaticTextToGlobalForWizards="MSAAStaticTextToGlobalForWizards",
	fn_MSAADlgNameToGlobal="MSAADlgNameToGlobal",
	fn_MSAAStaticTextToGlobal="MSAAStaticTextToGlobal",
; design field types
		iDsgnFieldName=1,
		iDsgnDataType=2,
		iDsgnDescription=3