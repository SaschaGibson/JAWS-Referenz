; Build 3.71.05.001
;Script Header accompanying script source for main Lotus application
; Copyright 2010-2015 by Freedom Scientific, Inc.
;Modified by Joseph Stephen on 19/10/2000 to globalize for Unicode version
;Last modified by K.-H. Weirich on 24/02/2011 to add Lotus Notes 8 standard window class

const
;Key Code Constants
; Ratio constants
	; Do not modify, as this will directly impact the speaking of *many* edit prompts!!
	;Object Type Constants that are specific to Notes
; Object Child ID constants
; the next constants are for the borders around the attachment
;Control ID constants for the SpellChecker
;These do not use MSAA
	iD_Guess_List = 912,
	iD_Replace_Edit = 910,
	;General Control ID  constants
	iDGoToTree = 1230,
;Window Classes
	wcActionBar = "ActionBar",
	wcActionButton = "IRIS.bmpbutton",
   wcNotes8StdWindowClass = "SWT_Window0",
	wcWindowList = "NotesTabMgr",
	wcDocClass = "NotesRichText",
	wcDocClass2 = "NotesFieldHelp",
	wcProperties = "ibw:0",
	wcProperties2 = "ibw:1",
	wcCalClass = "IRIS.calctl",
	wcGoToTree = "IRIS.odlist",
	wcTreeParent = "NotesSubprog",
	wcWorkspaceList = "NtDsWnd",
	IE4Class = "Internet Explorer_Server"

