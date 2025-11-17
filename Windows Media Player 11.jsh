; JAWS header file for Windows Media Player 11
; Copyright 2009-2015 by Freedom Scientific Inc.

const
;for use with GetVersionInfoString:
	scProductName="ProductName", ; Do not translate.
;Window classes:
	wc_WMPAppHost = "WMPAppHost",
	wc_CWmpControlCntr = "CWmpControlCntr",
	wc_edit = "Edit",
; Control IDs:
	id_BasketListView = 0,
	id_LibraryTreeView = 7209,
	id_AutoPlaylistCriteriaListview = 203,
;the types of WMP lists on the main screen:
	WMPListType_Invalid = 0xffffffff,
	WMPListType_NowPlaying = 1,
	WMPListType_LibraryBasket = 2,
	WMPListType_LibraryTreeItemDragContent = 3,
	WMPListType_LibraryTreeItemNoDragContent = 4

Globals
	int GlobalContainerHierarchyLevel,
	string GlobalObjectContainerGroupName,
	string GlobalPrevObjectContainerGroupName,
	string GlobalObjectUserFriendlyGroupName
