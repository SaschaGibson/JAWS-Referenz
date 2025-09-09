; Build 3.7.10.001
Const
; Window classes
	ie4Class = "internet explorer_server",
	wc_toolbar = "ToolbarWindow32",
	wc_JAWS = "JFWUI2",
	wc_IndexKeyWordList = "hh_kwd_vlist",

	wn5 = "[",
	wn6 = "]",

; Control IDs
	;for the links list dialog
	ID_MoveToLink = 1095,
		iD_ActivateLink = 1100,

	tool_bar = 1006,
	Navigation_treeview = 100,
	tab_control = 1007,
; for the IE Toolbar dialog
	Hide = 1,
	Show = 1,
	Back = 2,
	Forward = 3,
	Options = 4,
	Web = 5,
	Contents = 1,
	Index = 2,
	Search = 3,
; solve IE5.5 problem not speaking out Topic and book on Treeview Items.
sc_IE_App = "browseui.dll",
;window classes
wc_treeview = "SysTreeView32",
wc_syspager = "SysPager"	,
DialogClass = "#32771",
systab_control = "SysTabControl32"

Globals
	int nSuppressEcho,
int HHCtrlFirstTime