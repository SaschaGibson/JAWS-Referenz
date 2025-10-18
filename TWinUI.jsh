; JAWS script header file for Windows 8 Start screen

const

;window classes:
	wc_ImmersiveLauncher = "ImmersiveLauncher",
	wc_SearchPane = "SearchPane",
	wc_FileSearchAppWindowClass = "FileSearchAppWindowClass",
	wc_NativeHWNDHost = "NativeHWNDHost",

;accessible object classes:
	oc_GridTileElement = "GridTileElement",
	oc_AppSpaceElement = "AppSpaceElement",
	oc_RichText = "RichText",
	oc_GridGroup = "GridGroup",
	oc_GridContent = "GridContent",
	oc_GridListTileElement = "GridListTileElement",
	oc_SubGroupLabel = "SubGroupLabel",
	oc_SummaryGridTileElement = "SummaryGridTileElement",
	oc_UIExplorerBrowser = "UIExplorerBrowser",
	oc_TouchScrollBar = "TouchScrollBar",
	oc_CFileSystemElement  = "CFileSystemElement",
	oc_ChoiceTile = "ChoiceTile",

;accessible object automation IDs"
	oaid_TitleBarText = "TitleBarText",
	oaid_Title = "title",
	oaid_DisplayName = "DisplayName",
	oaid_SubTitle = "Sub-title",
	oaid_CurrentScopeText = "CurrentScopeText",
	oaid_GridListGroupHeader = "GridListGroupHeader",
	oaid_Group0 = "Group 0",
	oaid_Group1 = "Group 1",
	oaid_TouchEdit_Inner = "TouchEdit_Inner",
	oaid_ShutdownChoices = "ShutdownChoices",

;braille custom types:
	wt_custom_brl_StartScreenTile = 1,
	wt_custom_brl_AppListItem = 2,
	wt_custom_brl_StartScreenSearchEdit = 3,

;Collection info for focus item data:
;types of focusable items that use collections for data:
	CustomType_Unknown = 0,
	CustomType_StartScreenTile = 1,
	CustomType_StartScreenGroup = 2,
	CustomType_AppListItem = 3,
	CustomType_SummaryListItem = 4,
	CustomType_SearchEdit = 5,
	CustomType_SettingsSearchResults = 6,
	CustomType_FilesSearchResults = 7,
	CustomType_ShutdownChoicesMenu = 8,
	CustomType_ChoiceTile = 9,

;For sound files:
	hkey_NewGroupNavSound = "NewGroupNavSound",

;for moving tiles or groups:
	direction_TileOrGroupLeft = 1,
	direction_TileOrGroupRight = 2,
	direction_TileOrGroupUp = 3,
	direction_TileOrGroupDown = 4
