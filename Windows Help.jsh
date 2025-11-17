; Build 6.00.153
Const
; Window classes
	ie4Class = "internet explorer_server",
	ie3 = 0,
	ie4 = 1,
	wc_Help2000="HH Parent",
	wc_HelpXP="MsoHelp10",

icWhiteBackground=16777215,
	wc_relistbox20w="REListBox20W",
	wc_toolbar = "ToolbarWindow32",
	wc_JAWS = "JFWUI2",
wc32771 = "#32771",
 wcSysTabControl32 = "SysTabControl32",

	wn5 = "[",
	wn6 = "]",

; Control IDs
	tool_bar = 1006,
	Navigation_treeview = 100,
	tab_control = 1007,
;For the tool bar dialog	
	Hide = 1,
	Show = 1,
	Back = 2,
	Forward = 3,
	Options = 4,
	Web = 5,
; for the Select Tab dialog
	Contents = 1,
	Index = 2,
	Search = 3,
;for the links list dialog
ID_MoveToLink = 1095,
	iD_ActivateLink = 1100,

;for the frames list
	SelectAFrameDialogName = "Select a Frame",
;window classes
wc_treeview = "SysTreeView32",
wc_syspager = "SysPager"


Globals
	int nSuppressEcho,
int IEVersion,
int Win98HlpFirstTime