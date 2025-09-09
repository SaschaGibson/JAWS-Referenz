; Copyright 1995-2015 Freedom Scientific, Inc.
; JAWS 11.0 Header file for Acrobat Reader

CONST
;file name of .jcf file
	file_adobe_acrobat_jcf="adobe acrobat.jcf",
;script names for unknown function call handling:
	sn_SayNextLine="saynextline",
	sn_SayPriorLine="saypriorline",

	wcAcrobatMDI = "Afx:", ;WindowClass for main window MDI
	wcAcrobatTree = "AVL_AVView",
	wNAcrobatFind = "AVTableContainerView", ;window name for find dialog parent
	ACC_STATE_REQUIRED=0x80000000, ;required acc state
;control iD
	iDPreferencesList=101,
	IDPreferencesMainListbox=0xfffffff7,  ;-9
	ID_AvailableUpdatesList=0xfffffff7,  ;-9
	ID_SelectedUpdatesList=0xfffffff5,  ;-11
;JCF keys:
	hKey_AddBlankLineForParagraphs = "AddBlankLineForParagraphs"

Globals
	int gbInFindDialog,
	int gbInAcrobatDialog,
	int AcrobatFirstTime,
	int nSuppressMenuActive,
int gbDocumentUpdatedFromPageChange,
int gISkipTutor,
int gITreeSpeakWholeObject;EHandleCustomWindows fires when tree items change, so monitor for level or whole item speak.