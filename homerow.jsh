; Copyright 1995-2018 by Freedom Scientific, Inc.
; Script utility (homerow) mode utility header file
; For HomeRowWindows.jss, HomeRowMSAA.jss, HomeRowUIAObject.jss and  HomeRowXMLDom.jss

Const
;window output modes:
	UT_HANDLE = 1,
	UT_CONTROLID = 2,
	UT_CLASS = 3,
	UT_TYPE = 4,
	UT_SUBTYPE = 5,
	ut_StyleBits = 6,
	ut_ExStyleBits = 7,
	ut_Owner = 8,
	UT_REALNAME = 9,
	UT_WINDOWNAME = 10,
	UT_WINDOWTEXTRESTRICTED = 11,
	UT_WINDOWTEXTINCLUSIVE = 12,
	ut_HOTKEY = 13,
	UT_HIGHLIGHTEDTEXT = 14,
	UT_SAYTYPEANDTEXT = 15,

;Enumerated values for MSAA output modes:
	ut_ObjectName = 1,
	ut_ObjectType = 2,
	ut_ObjectSubType = 3,
	ut_ObjectRole = 4,
	ut_ObjectValue = 5,
	ut_ObjectState = 6,
	ut_ObjectStateCode = 7,
	ut_ObjectMSAAState = 8,
	ut_ObjectIA2State = 9,
	ut_ObjectDescription = 10,
	ut_ObjectHelp = 11,
	ut_ObjectTypeDescription = 12,
	ut_ObjectPlaceHolder = 13,
	ut_ObjectID = 14,
	ut_ObjectChildID = 15,
	ut_ObjectClassName = 16,
	ut_ObjectAutomationID = 17,
	ut_ObjectItemType = 18,
	ut_ObjectItemStatus = 19,
	ut_ObjectIsEditable = 20,
	ut_First_Object_Mode = 1,
	ut_Last_Object_Mode = 20,

;XMLDomDoc objects output modes:
	ut_XMLDomDocAllInfo = 0,
	ut_XMLDomDocName = 1,  ;Name
	ut_XMLDomDocValue = 2,  ;Value
	ut_XMLDomDocText = 3,  ;Text, TextContent, attrib.fsText, attrib.Label,
	ut_XMLDomDocType = 4,  ;attrib.fsType, attrib.Type attribs.role, attrib.xml_roles,
	ut_XMLDomDocTagInfo = 5,  ;TagName attrib.fsTag attrib.Tag 
	ut_XMLDomDocClass = 6,
	ut_XMLDomDocFocusInfo = 7,  ;fsFocusable fsFormField attrib.HasKeyboardFocus 
	ut_XMLDomDocNumberOfChildren = 8,

;UIA objects output modes:
	ut_UIAObjectAllInfo = 0,
	ut_UIAObjectName = 1,
	ut_UIAObjectRole = 2,
	ut_UIAObjectClassName = 3,
	ut_UIAObjectAutomationId = 4,
	ut_UIAObjectValue = 5,
	ut_UIAObjectState = 6,
	ut_UIAObjectDescription = 7,
	ut_UIAObjectHasKeyboardFocus = 8,
	ut_UIAObjectNumberOfChildren = 9,
;navigation directions:
	Sibling_Next = 1,
	Sibling_Prior = 2,
	Sibling_First = 3,
	Sibling_Last = 4

Globals
;for window browsing:
	int gbHomeRowActive,
	handle hHomeRowPos,
	int iHomeRowSpeakWindowVisibility,
	int iHomeRowNotifyIfWinFormsClass,
	int iHomeRowAppMainWindowAlert,

;for FSXMLDomDoc browsing:
	int gbXMLDomDocBrowserActive,
	int ut_XMLDomDocOutputMode,
	object HomeRowXMLDomDoc,
	object HomerowXMLDomDocumentElement,
	object HomerowXMLDomDocCurrent
