;Homerow mode utility Messages
;for both homerow mode windows and MSAA utilities

const
;tree level separator for building the tree path string:
	scTreePathLevelSeparator = ".",
;window names:
	wn_JAWSForWindowsMessageBox = "JAWS For Windows Message Box",
;for padding hex numbers:
	pad_ZeroZeroZero = "000",
	pad_ZeroZero = "00",
	pad_Zero = "0"

Messages
@msgHomeRowOff_L
Script utility mode Off
@@
@msgHomeRowOff_S
Off
@@
@msgHomeRowOn_L
Script utility mode On
@@
@msgHomeRowOn_S
On
@@
@msgHomeRowToCurrent_L
Route utility to current window
@@
@msgHomeRowToCurrent_S
Utility to current
@@
@msgVisibilityOn
SpeakWindowVisibility on
@@
@msgVisibilityOff
SpeakWindowVisibility off
@@
@msgVisible
Visible
@@
@msgNotVisible
Not visible
@@
@msgDisabled
Disabled
@@
@msgNotifyIfWinFormsClassOn
WindowsForms class notification on
@@
@msgNotifyIfWinFormsClassOff
WindowsForms class notification off
@@
@msgIsWinFormsWindow
WindowsForms class
@@
@msgNotFound
Not found
@@
@msgNextAttributeNotFound
next attribute not found
@@
@msgPriorAttributeNotFound
prior attribute not found
@@
@msgFirstAttributeNotFound
First Attribute not found
@@
@msgLastAttributeNotFound
Last Attribute not found
@@
@msgUnknown
Unknown
@@
@msgNotAvailable
Not available
@@
@msgNoObjectsInWindow_L
No objects in window
@@
@msgNoObjectsInWindow_S
No objects
@@
@msgNoCachedMSAAFocusInfo_L
No cached info available for focus object
@@
@msgNoCachedMSAAFocusInfo_S
No cached focus info
@@
@msgChildWindowNotFound
Child window not found
@@
@msgParentWindowNotFound
Parent window not found
@@
;The following group of messages are spoken as the type of output when F3 is used to cycle through the output types in the script utility mode:
@msgHandle
Handle
@@
@msgTypeAndText_L
Say Type and Text
@@
@msgTypeAndText_S
Type and Text
@@
@msgControlID_L
Control ID
@@
@msgControlID_S
Control
@@
@msgClass
Class
@@
@msgType
Type
@@
@msgSubtype_L
Subtype Code
@@
@msgSubtype_S
Subtype
@@
@msgStyleBits_L
Style bits
@@
@msgStyleBits_S
Bits
@@
@msgExStyleBits_L
Extended style bits
@@
@msgExStyleBits_S
Ex bits
@@
@msgOwner_L
Owner application
@@
@msgOwner_S
Owner
@@
@msgRealName
Real Name
@@
@msgWindowName_L
Window Name
@@
@msgWindowName_S
Name
@@
@msgHotKey
HotKey
@@
@msgHighlightedText
Highlighted Text
@@
@msgTextRestricted
Text Restricted
@@
@msgTextInclusive
Text Inclusive
@@
;The following group of messages are spoken as the output type when
;either F10 is used to cycle through the output types for MSAA data,
;or when the FSXMLDomDoc browser is active in the script utility mode and F3 is used to cycle through the output types (Alt+X activates this mode on web pages).
@msgName
Name
@@
@msgValue
Value
@@
@msgText
Text
@@
@msgState
State
@@
@msgStateCode
State Code
@@
@msgMSAAState
MSAA State
@@
@msgIA2State
IA2 State
@@
@msgDescription
Description
@@
@msgHelp
Help
@@
@msgTypeDescription
Type Description
@@
@msgPlaceHolder
PlaceHolder
@@
@msgObjectID
Object ID
@@
@msgChildID
Child ID
@@
@msgObjectRole
Role
@@
@msgObjectClassName
Class Name
@@
@msgObjectAutomationID
Automation ID
@@
@msgObjectItemType
Item Type
@@
@msgObjectItemStatus
Item Status
@@
@MSAAObjectIsEditable
Is Editable
@@
@msgObjectHasKeyboardFocus
Has Keyboard Focus
@@
@msgFocusInfo
Focus info
@@
@msgObjectNumberOfChildren
Number Of Children
@@
@msgTagInfo
Tag info
@@
@msgObjectAllInfo
All Info
@@
;msgEnteringXMLDomDocBrowser is spoken when the XMLDomDoc browse mode is activated.
@msgEnteringXMLDomDocBrowser
XMLDomDoc browser
@@
;msgErr_NoXMLDomDocBrowser is spoken when the XMLDomDoc browse mode fails to activate.
@msgErr_NoXMLDomDocBrowser
No XMLDomDoc browser
@@
;msgExitingXMLDomDocBrowser is spoken when the XMLDomDoc browse mode is deactivated.
@msgExitingXMLDomDocBrowser
Exiting XMLDomDoc browser
@@
;The following are messages spoken during navigation of the FSXMLDom when navigation is not possible in the attempted direction
@msgErr_NoXMLDomChildNode
No child node
@@
@msgErr_NoXMLDomParentNode
No parent node
@@
@msgErr_NoXMLDomNextSiblingNode
No next sibling node
@@
@msgErr_NoXMLDomPriorSiblingNode
No prior sibling node
@@
;The following group of messages are used in the all info output for a node in the FSXMLDomDoc browser
@msgNameValueFormat
%1 = %2
@@
@msgErr_NoTextDescendants
No text descendants
@@
@msgDescendantTextNodeListOutputTitle
Text Node Descendants
@@
@msgDescendantTextNodeListItemOutput
(%1):
%2

------------------------------------------------------------------------------
@@
;The dialog title of the list of objects:
@msgObjectListTitle
Object List
@@
@msgObjectListInfoByNameTitle
Object List Info By Name
@@
@msgCachedMSAAFocusInfo
Cached Focus Info
@@
@msgBold
Bold
@@
@msgItalic
Italic
@@
@msgUnderline
Underline
@@
@msgHighlight
Highlight
@@
@msgStrikeOut
StrikeOut
@@
@msgExitingTreeForCurrentApp_L
Exiting the window tree for the currently active application
@@
@msgExitingTreeForCurrentApp_S
Exiting window tree for active app
@@
@msgEnteringTreeForCurrentApp_L
Entering the window tree for the currently active application
@@
@msgEnteringTreeForCurrentApp_S
Entering window tree for active app
@@
@msgNoNextWindow
no next window
@@
@msgNoPriorWindow
no prior window
@@
@msgNoFirstWindow
no first window
@@
@msgNoLastWindow
no last window
@@
@msgOutputModeIs
output mode is
@@
@msgInvisibleToHomeRow_L
Route Invisible to utility
@@
@msgInvisibleToHomeRow_S
Invisible to utility
@@
@msgJAWSToHomeRow_L
Route JAWS to utility
@@
@msgJAWSToHomeRow_S
JAWS to utility
@@
;for msgMousePixelIs,
;%1= the global mouse pixel setting
@msgMousePixelSettingIs_L
Mouse Pixel setting is %1
@@
@msgMousePixelSettingIs_S
Mouse Pixel = %1
@@
@msgGlobalMousePixelIs_L
Global Mouse Pixel is %1
@@
@msgGlobalMousePixelIs_S
Global Mouse Pixel = %1
@@
@msgANSICharSetting_L
Speak Characters is set to %1
@@
@msgANSICharSetting_S
Character setting = %1
@@
@msgAllANSI_L
All characters
@@
@msgAllANSI_S
All
@@
@msgNoANSI_L
No characters
@@
@msgNoANSI_S
None
@@
@msgSomeANSI_L
Some Characters
@@
@msgSomeANSI_S
Some
@@
@msgMoreANSI_L
More Characters
@@
@msgMoreANSI_S
More
@@
@msgMostANSI_L
Most Characters
@@
@msgMostANSI_S
Most
@@
@msgUnableToChangeJCFOption
Was not able to change the j c f option
@@
@msgTreeCaptureTitle
Tree Capture
@@
@msgNodeCaptureTitle
Note Capture
@@
@msgTreeCaptureHeaderText
FocusWindow = %1
RealWindow = %2
AppMainWindow = %3
TopLevelWindow = %4
ForeGroundWindow = %5
@@
@msgTreeCapturePathString
Window #%1:
@@
@msgNodeWindowBasicInfo
Handle = %1
Class = %2
Type = %3
TypeCode = %4
SubtypeCode = %5
ControlID = %6
StyleBits = %7
Extended style bits = %8
@@
@msgNodeWindowNameInfo
WindowName = %1
HotKey = %2
@@
@msgNodeWindowHierarchyInfo
Parent = %1
FirstChild = %2
Prior = %3
Next = %4
WindowHierarchyX = %5
WindowHierarchyY = %6
@@
@msgNodeWindowRectInfo
WindowRect = (%1,%2)-(%3,%4)
@@
@msgNodeWindowAttribInfo
controlAttributes = %1
HasTitle = %2
WindowDisabled = %3
WindowObscured = %4
WindowVisible = %5
@@
@msgNodeWindowContentInfo
Highlighted text:
%1
----------------------------------------
All Text Restricted:
%2
----------------------------------------
All Text Inclusive:
%3
@@
@msgDashedLine
----------------------------------------
@@
@msgAsteriskLine
****************************************
@@
@msgBufferOverFlowDanger
Warning: Aborting operation due to danger of buffer overflow...
@@
;for msgHandleInfo,
;%1 is the decimal handle,
;%2 is the hexidecimal handle
@msgHandleInfo
%1 = {%2}
@@
@msgBufferCloseLink
Close
@@
;For msgInfoInViewer:
;%1 is the name of the desired information in the viewer
;%2 is the desired information
@msgInfoInViewer
%1

%2
@@
@msgObjectHierarchyInfoTitle
Object Hierarchy Info
@@
;msgLevelHierarchyInfo is used to display the output in the virtual viewer for script Get hierarchy info for object,
;Assigned to Control+Alt+F9 in the script utility mode.
;%1 is a number for the level.
;%2 is a block which is built from various properties and values for the object formatted using msgPropertyAndValue.
;%3 is the message msgObjectRect.
@msgLevelHierarchyInfo
Level %1
%2
Rect: %3
@@
;msgPropertyAndValue is inserted multiple times into msgLevelHierarchyInfo.
;%1 is one of the messages representing a property name such as msgName and msgValue.
;%2 is the value obtained for the property.
@msgPropertyAndValue
%1: %2
@@
;for msgObjectRect
;%1 is the left edge coordinate
;%2 is the top edge coordinate
;%3 is the right edge coordinate
;%4 is the bottom edge coordinate
@msgObjectRect
(%1,%2)-(%3,%4)
@@
@msgObjectByNameInfo
Name: %1
Value: %2
SubtypeCode: %3
State: %4
Description: %5
HotKey: %6
Container: %7
@@
@msgUseMSAAAlways
Always MSAA
@@
@msgUseMSAACached
Cached MSAA
@@
@msgSayCurrentMSAAMode
Current MSAA mode is %1
@@
;for msgHexIntegerFormat,
;%1 is the zero padding,
;%2 is the number
@msgHexIntegerFormat
0x%1%2
@@
@msgNoSDMControlsFound
No SDM controls found
@@
@msgSDMControlsTitle
SDM Controls
@@
;for msgSDMFocusControlText and msgSDMCurrentControlText,
;%1 is the control id number
@msgSDMFocusControlText
Focus SDM control id = %1
@@
@msgSDMCurrentControlText
Current SDM control id = %1
@@
;for msgSDMControlInfoText
;%1 is the control id
;%2 is the control subtype code
;%3 is the control name
;%4 is the control active item text
@msgSDMControlInfoText
id %1
TypeCode: %2
Name: %3
Active text:%4
@@
@msgNoMenuIsActive
No menu is active
@@
@msgMenuBarActive
Menu bar is active
@@
@msgMenuActive
Menu is active
@@
;UIA object info:
@msgErr_NoObjectFocusParentItem
No focus parent object
@@
@msgErr_NoObjectFocusItem
No focus object
@@
@msgUIAObjectFocusItemOutputTitle
UIA Object Focus Item
@@
@msgUIAObjectFocusAncestorsOutputTitle
UIA Object Focus Ancestors
@@
;for msgUIAObjectLevel
;%1 is a number indicating the level
@msgUIAObjectLevel
Level %1:
@@
;for msgUIAObjectItemOutput:
;replaceable parameters are the data retrieved from the accessible object
@msgUIAObjectItemOutput
Name: %1
Role: %2
ClassName: %3
AutomationId: %4
Value: %5
State: %6
Description: %7
@@
@msgErr_NoObjectTree
No object tree
@@
@msgErr_NoObjectTreeData
No data from object tree
@@
@msgErr_FailedToGetOutputData
Failed to get output data
@@
@msgUIATopObjectTreeOutputTitle
UIA Top Object Tree
@@
@msgUIAFocusParentObjectTreeOutputTitle
UIA Focus Parent Object Tree
@@
@msgUIAFocusObjectTreeOutputTitle
UIA Focus Object Tree
@@
@msgErr_NoXMLObject
No xml object
@@
@msgErr_NoItemsInXMLObject
No item nodes in xml object
@@
;for msgUIANodeInfo,
;%1 is the node name of the iAccessible object note
;%2 is the node value of the iAccessible object note
@msgUIANodeInfo
%1: "%2"
@@
;For msgUIAObjectNodeChildCount:
;%1 is a number, the number of child nodes to the current iAccessible object node
@msgUIAObjectNodeChildCount
Number of children = %1
@@
@msgErr_NoUIAObjectBrowser
No UIA object browser
@@
@msgEnteringUIAObjectBrowser
UIA object browser
@@
@msgExitingUIAObjectBrowser
Exiting UIA object browser
@@
@msgErr_NoUIAChildObject
No child object
@@
@msgErr_NoUIAParentObject
No parent object
@@
@msgErr_NoUIANextObject
No next object
@@
@msgErr_NoUIAPriorObject
No prior object
@@
;msgHomerowXMLParseError is the error message spoken when the XML fails to parse.
; Hopefully, you will not be able to make this error happen.
;%1 is the line number where the error occurred
;%2 is the character position on the line where the error occurred
;%3 is the text from the parser giving the error reason
@msgHomerowXMLParseError
Error on line %1 at position %2:
%3
@@
@msgWebDomainInfoErrorNoDomain
No domain available for association.
@@
@msgWebDomainInfoErrorDomainAlreadyAssociated
This domain is already associated with a set of scripts.
@@
; for msgWebDomainInfo, %1 is the domain or file name, whatever JAWS returns from getActiveConfiguration (TRUE) function call.
@msgWebDomainInfo
Active Web Domain: %1

The following information is for developers only. Do not try this if you do not know how to edit system files or cannot assume the associated risks with doing so. 

To associate this domain with a set of scripts, you will need to create or edit the configNames.inni file in your user folder with the following.

[Domains]
%1=MyConfiguration

where MyConfiguration is the name of your configuration.

After you have edited and saved the ConfigNames.ini file with just your entries in your user settings folder, you must restart JAWS for the settings to take effect.

Press ESC to close this message
@@
@msgCurrentHeader
# Current - Ancestor Count %1
@@
@msgPreviousHeader
# Previous - Ancestor Count %1
@@
@msgAncestorCountHeader
# Ancestor Count %1
@@

;UNUSED_VARIABLES

@msgObjectListCopyNotrAvailable
Copying object list is not available
@@
@msgGraphic
Graphic
@@
@msgHomeKey
Home
@@
@msgEndKey
End
@@

;END_OF_UNUSED_VARIABLES
EndMessages
