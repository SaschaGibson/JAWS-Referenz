;Copyright 1995-2015 Freedom Scientific, Inc.
;Freedom Scientific default script header file for touch and object navigation.

;display orientation constants:
const
	DMDO_DEFAULT = 0,
	DMDO_90 = 1,
	DMDO_180 = 2,
	DMDO_270 = 3

const
;UIA class names
	UIA_wc_TIPBand = "TIPBand", ;the touch keyboard button on the desktop screen
	UIA_wc_IPTip_Main_Window = "IPTip_Main_Window", ;the touch keyboard and handwriting panel main window
	UIA_wc_cRootKey = "cRootKey", ;touch keyboard keys
	UIA_wc_ModalityTile = "ModalityTile", ;mode switching keys
	UIA_wc_DummyChild = "DummyChild",  ;pane containing child pane of extra keys
;UIA automation IDs:
	UIA_AutomationID_InputFrameWindow = "InputFrameWindow", ;main window frame
	UIA_AutomationID_Keyboard_Optimized = "Keyboard_Optimized", ;the pane with the keyboard keys
	UIA_AutomationID_ModalityTileContainer = "ModalityTileContainer", ;pane with buttons for switching layout mode
	UIA_AutomationID_HideButtonText = "HideButtonText", ;text child of the Hide Keyboard button
	UIA_AutomationID_IsolatedButtonSmallIcon = "IsolatedButtonSmallIcon", ;Another text child of the Hide Keyboard button
	UIA_AutomationID_switchShift = "switchShift", ;left key
	UIA_AutomationID_switchRightShift = "switchRightShift", ;right shift key
	UIA_AutomationID_switchCtl = "switchCtl", ;touch keyboard Control key
	UIA_AutomationID_LeftArrow = "cb", ;touch keyboard left arrow button
	UIA_AutomationID_RightArrow = "cd", ;touch keyboard right arrow button
	UIA_AutomationID_Backspace = "e",
	UIA_AutomationID_ModalityHandwriting = "ModalityHandwriting" ;button to switch keyboard layout to handwriting mode

;for the touch nav rotor:
const
;These string constants are used  as collection member names, They should not be localized.
;Collection member names for fixed items in touch rotor:
	touchRotorMemberButtons = "Buttons",
	touchRotorMemberGroups = "Groups",
	touchRotorMemberHeadings = "Headings",
	touchRotorMemberLandmarks = "Landmarks",
	touchRotorMemberLinks = "Links",
	touchRotorMemberListItems = "ListItems",
	touchRotorMemberRegions = "Regions",
	touchRotorMemberSeparators = "Separators",
	touchRotorMemberFormControls = "FormControls",
;Collection member names for temporary items in touch rotor:
	touchRotorMemberAdjustValue = "AdjustValue"
globals
	int g_touchQuickNavIndex,
	collection g_TouchQuickNavElements,
	StringArray g_touchQuickNavHashKeys,
	StringArray g_touchQuickNavRotorItemNames

;The following message block contains non-translatable element property name and value messages:
Messages
@msgPropertyAcceleratorKey
acceleratorKey: %1
@@
@msgPropertyAccessKey
accessKey: %1
@@
@msgPropertyLabeledby
labeledBy:
	name: %1
	type: %2
	ariaRole: %3
	automationId: %4
	runtimeID: %5
@@
@msgPropertyAriaProperties
ariaProperties: %1
@@
@msgPropertyAriaRole
ariaRole: %1
@@
@msgPropertyLandmarkType
landmarkType: %1
@@
@msgPropertyLocalizedLandmarkType
LocalizedLandmarkType: %1
@@
@msgPropertyAutomationId
automationId: %1
@@
@msgPropertyBoundingRectangle
BoundingRectangle: left %1, top %2, right %3, bottom %4
@@
@msgPropertyRectPoints
[%1,%2]-[%3,%4]
@@
@msgPropertyClickablePoint
ClickablePoint: %1,%2
@@
@msgPropertyClassName
className: %1
@@
@msgPropertyControlType
controlType: %1
@@
@msgPropertyCulture
Culture: %1
@@
@msgPropertyFramework
FrameWorkID: %1
@@
@msgPropertyHasKeyboardFocus
hasKeyboardFocus
@@
@msgPropertyFullDescription
fullDescription: %1
@@
@msgPropertyHelpText
helpText: %1
@@
@msgPropertyIsContentElement
isContentElement
@@
@msgPropertyIsControlElement
isControlElement
@@
@msgPropertyIsPeripheral
isPeripheral
@@
@msgPropertyIsDataValidForForm
isDataValidForForm
@@
@msgPropertyIsEnabled
isEnabled
@@
@msgPropertyIsKeyboardFocusable
isKeyboardFocusable
@@
@msgPropertyIsOffscreen
isOffscreen
@@
@msgPropertyOptimizeForVisualContent
optimizeForVisualContent
@@
@msgPropertyIsPassword
isPassword
@@
@msgPropertyIsRequiredForForm
isRequiredForForm
@@
@msgPropertyItemStatus
itemStatus: %1
@@
@msgPropertyItemType
itemType: %1
@@
@msgPropertyLocalizedControlType
localizedControlType: %1
@@
@msgPropertyLiveSetting
liveSetting: %1
@@
@msgPropertyName
name: %1
@@
@msgPropertyNativeWindowHandle
nativeWindowHandle: %1
@@
@msgPropertyOrientation
orientation: %1
@@
@msgPropertyPositionInSet
PositionInSet: %1
@@
@msgPropertySizeOfSet
SizeOfSet: %1
@@
@msgPropertyLevel
Level: %1
@@
@msgPropertyProcessId
processId: %1
@@
@msgPropertyProviderDescription
providerDescription: %1
@@
@msgPropertyRuntimeID
RuntimeID: %1
@@
@msgPropertyFlowsFrom
FlowsFrom
    %1: %2
@@
@msgPropertyFlowsTo
FlowsTo
    %1: %2
@@
;For msgPropertyControllerFor and msgPropertyDescribedBy
;%1 contains information taken from the array of elements retrieved by these properties.
@msgPropertyControllerFor
ControllerFor:
	%1
@@
@msgPropertyDescribedBy
DescribedBy:
	%1
@@
;for msgDockPatternDataPosition
;%1 is one of the msgPosition messages
@msgDockPatternDataPosition
DockPosition: %1
@@
;msgPatternDataTableRowOrColumnMajor messages are for table properties
@msgPatternDataTableRowOrColumnMajor_RowMajor
rowMajor
@@
@msgPatternDataTableRowOrColumnMajor_ColumnMajor
columnMajor
@@
@msgPatternDataTableRowOrColumnMajor_Indeterminate
indeterminate
@@
;for msgPatternDataTablePatternRowOrColumnMajor
;%1 is one of the msgPatternDataTableRowOrColumnMajor messages
@msgPatternDataTablePatternRowOrColumnMajor
table.RowOrColumnMajor: %1
@@
@msgPatternDataWindowIsModal
window.isModal: %1
@@
@msgPatternDataWindowIsTopMost
Window.isTopMost: %1
@@
@msgPatternDataWindowInteractionState
window.interactionState: %1
@@
@msgPatternDataWindowVisualState
window.visualState: %1
@@
@msgPatternDataWindowCanMaximize
Window.canMaximize: %1
@@
@msgPatternDataWindowCanMinimize
Window.canMinimize: %1
@@
;for msgPatternDataMultipleViewSupportedViews
;%1 is an indented, multiline list of view names returned by UIA
@msgPatternDataMultipleViewSupportedViews
multipleView.supportedViews:
	%1
@@
@msgPatternDataMultipleViewCurrentView
multipleView.currentView: %1
@@
@msgPatternDataTransformCanMove
Transform.canMove: %1
@@
@msgPatternDataTransformCanResize
Transform.canResize: %1
@@
@msgPatternDataTransformCanRotate
Transform.canRotate: %1
@@
@msgPatternDataTransformZoomLevel
Transform.zoomLevel: %1
@@
@msgPatternDataTransformZoomMaximum
Transform.zoomMaximum: %1
@@
@msgPatternDataTransformZoomMinimum
Transform.zoomMinimum: %1
@@
@msgPatternDataDragIsGrabbed
Drag.isGrabbed: %1
@@
@msgPatternDataDragDropEffect
Drag.DropEffect: %1
@@
@msgPatternDataDropTargetEffect
DropTarget.effect: %1
@@
;msgArrayItem is used to list items from an array
;%1 is a number indexing the item
@msgArrayItem
Item %1
@@
@msgPatternDataSpreadsheetItemFormula
SpreadsheetItem.formula: %1
@@
;msgPatternDataAnnotationTarget is a list label used with msgElementNameTypeAndRuntimeID
@msgPatternDataAnnotationTarget
Annotation.target
@@
@msgPatternDataAnnotationAuthor
Annotation.author: %1
@@
@msgPatternDataAnnotationDateTime
Annotation.dateTime: %1
@@
@msgPatternDataAnnotationTypeID
Annotation.typeID: %1
@@
@msgPatternDataAnnotationtypeName
Annotation.typeName: %1
@@
@msgPatternDataStyleName
Style.styleName: %1
@@
@msgPatternDataStyleID
Style.styleID: %1
@@
@msgPatternDataStyleFillColor
Style.fillColor: %1
@@
@msgPatternDataStyleFillPatternColor
Style.fillPatternColor: %1
@@
@msgPatternDataStyleShape
Style.shape: %1
@@
@msgPatternDataStyleExtendedProperties
Style.extendedProperties: %1
@@
@msgAvailablePatternDock
dock
@@
@msgAvailablePatternExpandCollapse
expandCollapse
@@
@msgAvailablePatternGrid
grid
@@
@msgAvailablePatternGridItem
gridItem
@@
@msgAvailablePatternInvoke
invoke
@@
@msgAvailablePatternMultipleView
multipleView
@@
@msgAvailablePatternRangeValue
rangeValue
@@
@msgAvailablePatternScroll
scroll
@@
@msgAvailablePatternScrollItem
scrollItem
@@
@msgAvailablePatternSelection
selection
@@
@msgAvailablePatternSelectionItem
selectionItem
@@
@msgAvailablePatternTable
table
@@
@msgAvailablePatternTableItem
tableItem
@@
@msgAvailablePatternText
text
@@
@msgAvailablePatternText2
text2
@@
@msgAvailablePatternTextChild
textChild
@@
@msgAvailablePatternToggle
toggle
@@
@msgAvailablePatternTransform
transform
@@
@msgAvailablePatternTransform2
transform2
@@
@msgAvailablePatternValue
value
@@
@msgAvailablePatternWindow
window
@@
@msgAvailablePatternLegacyIAccessible
legacyIAccessible
@@
@msgAvailablePatternItemContainer
itemContainer
@@
@msgAvailablePatternVirtualizedItem
virtualizedItem
@@
@msgAvailablePatternSynchronizedInput
synchronizedInput
@@
@msgAvailablePatternObjectModel
objectModel
@@
@msgAvailablePatternAnnotation
annotation
@@
@msgAvailablePatternStyles
styles
@@
@msgAvailablePatternSpreadsheet
spreadsheet
@@
@msgAvailablePatternSpreadsheetItem
spreadsheetItem
@@
@msgAvailablePatternDrag
drag
@@
@msgAvailablePatternDropTarget
dropTarget
@@
;msgElementNameTypeAndRuntimeID is used in various places to output information identifying an element.
;%1 is the label for the information, which will be one of the messages in this block of messages.
;%2, %3 and %4 is information retrieved from UIA.
;Note: Because tabs may show up in the virtual viewer as a single space,
;be sure to preserve indentation as spaces, not tabs.
@msgElementNameTypeAndRuntimeID
%1:
    name = %2
    UIA type = %3
    runtimeID = %4
@@
;for pattern data, %1, where it exists, is UIA information retrieved from the element.
@msgPatternDataExpandCollapsePattern_ExpandCollapseState
expandCollapsePattern.ExpandCollapseState: %1
@@
@msgPatternDataGridPattern_ColumnCount
gridPattern.ColumnCount: %1
@@
@msgPatternDataGridPattern_RowCount
gridPattern.RowCount: %1
@@
@msgPatternDataGridItemPattern_Column
gridItemPattern.Column: %1
@@
@msgPatternDataGridItemPattern_Row
gridItemPattern.Row: %1
@@
@msgPatternDataGridItemPattern_columnSpan
gridItemPattern.ColumnSpan: %1
@@
@msgPatternDataGridItemPattern_rowSpan
gridItemPattern.RowSpan  %1
@@
@msgPatternDataInvokePattern
invokePattern
@@
@msgPatternDataLegacyIAccessiblePattern_childID
legacyIAccessiblePattern.childID: %1
@@
@msgPatternDataLegacyIAccessiblePattern_defaultAction
legacyIAccessiblePattern.defaultAction: %1
@@
@msgPatternDataLegacyIAccessiblePattern_description
legacyIAccessiblePattern.description: %1
@@
@msgPatternDataLegacyIAccessiblePattern_help
legacyIAccessiblePattern.help: %1
@@
@msgPatternDataLegacyIAccessiblePattern_keyboardShortcut
legacyIAccessiblePattern.keyboardShortcut: %1
@@
@msgPatternDataLegacyIAccessiblePattern_name
legacyIAccessiblePattern.name: %1
@@
@msgPatternDataLegacyIAccessiblePattern_role
legacyIAccessiblePattern.role: %1
@@
@msgPatternDataLegacyIAccessiblePattern_state
legacyIAccessiblePattern.state: %1 (0x%2)
@@
@msgPatternDataLegacyIAccessiblePattern_value
legacyIAccessiblePattern.value: %1
@@
@msgPatternDataRangeValuePattern_value
rangeValuePattern.value: %1
@@
@msgPatternDataRangeValuePattern_minimum
rangeValuePattern.minimum: %1
@@
@msgPatternDataRangeValuePattern_maximum
rangeValuePattern.maximum: %1
@@
@msgPatternDataRangeValuePattern_largeChange
rangeValuePattern.LargeChange: %1
@@
@msgPatternDataRangeValuePattern_smallChange
rangeValuePattern.SmallChange: %1
@@
@msgPatternDataRangeValuePattern_isReadOnly
RangeValuePattern.isReadOnly: %1
@@
@msgPatternDataScrollPattern_horizontallyScrollable
ScrollPattern.HorizontallyScrollable: %1
@@
@msgPatternDataScrollPattern_verticallyScrollable
ScrollPattern.VerticallyScrollable: %1
@@
@msgPatternDataScrollPattern_horizontalScrollPercent
ScrollPattern.HorizontalScrollPercent: %1%%
@@
@msgPatternDataScrollPattern_verticalScrollPercent
ScrollPattern.VerticalScrollPercent: %1%%
@@
@msgPatternDataScrollPattern_HorizontalViewSize
ScrollPattern.HorizontalViewSize: %1
@@
@msgPatternDataScrollPattern_verticalViewSize
ScrollPattern.VerticalViewSize: %1
@@
@msgPatternDataScrollItemPattern
ScrollItemPattern
@@
@msgPatternDataSelectionPattern_IsSelectionRequired
SelectionPattern.isSelectionRequired: %1
@@
@msgPatternDataSelectionPattern_CanSelectMultiple
SelectionPattern.canSelectMultiple: %1
@@
@msgPatternDataSelectionPattern_Count
SelectionPattern.getSelection().count: %1
@@
@msgPatternDataSelectionItemPattern_isSelected
SelectionItemPattern.isSelected: %1
@@
;for msgPatternDataTextSupportedTextSelection,
;%1 is one of the msgTextSelection messages
@msgPatternDataTextSupportedTextSelection
text.supportedTextSelection: %1
@@
;msgPatternDataTextEditActiveComposition is a list label to msgElementNameTypeAndRuntimeID
@msgPatternDataTextEditActiveComposition
TextEdit.activeComposition
@@
;msgPatternDataTextEditConversionTarget is followed by a block of text range information from UIA
@msgPatternDataTextEditConversionTarget
TextEdit.conversionTarget:
@@
;msgPatternDataTextChildPattern_Container is a list label used with msgElementNameTypeAndRuntimeID
@msgPatternDataTextChildPattern_Container
TextChildPattern.Container
@@
@msgPatternDataTogglePattern_toggleState
TogglePattern.toggleState: %1
@@
@msgPatternDataValuePattern_value
ValuePattern.value: %1
@@
@msgPatternDataValuePatern_isReadOnly
ValuePatern.isReadOnly: %1
@@
EndMessages
