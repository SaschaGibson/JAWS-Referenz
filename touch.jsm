;Copyright 1995-2015 Freedom Scientific, Inc.
; Freedom Scientific default script message file for touch and object navigation.

;for the touch keyboard:
const
	;The Windows 10 UIA name of the button used to manually activate the touch keyboard:
		wn_Touch_Keyboard = "Touch keyboard",
	;The Windows 8 UIA name of the button used to manually activate the touch keyboard:
		wn_Start_Touch_Keyboard = "Start Touch Keyboard",
	;The name of the Caps Lock key, without any "Left" or "Right" text:
	;(In English, only the right caps lock has the modifyer.
	;This is used to recognize the name of either caps lock key by checking if the name of the key contains the string.)
		KeyName_CapsLock = "Caps Lock"
messages
;msgTouchKeyboardOpened and msgTouchKeyboardClosed are spoken when the touch keyboard appears and disappears.
@msgTouchKeyboardOpened
Opened touch keyboard
@@
@msgTouchKeyboardClosed
Closed touch keyboard
@@
;msgAlternativeCharactersAvailableNotification is spoken when 
;a child panel expands to show alternative character keys related to the current main keyboard key.
@msgAlternativeCharactersAvailableNotification
Alternative characters available
@@
;for msgControlKeyWithOtherKey:
;When the virtual Control key is pressed, it changes the names of some keys.
;For those keys which Control is modifying but the name of the modified key doesn't change,
;The key will be announced using msgControlKeyWithOtherKey as the name of the key being typed.
;%1 is the key which the Control key is modifying.
@msgControlKeyWithOtherKey
Control+%1
@@
;msgVKbdShiftKeyTutorMessage is spoken as a tutor message for the shift keys during exploration:
@msgVKbdShiftKeyTutorMessage
Triple tap for Caps Lock
@@
;msgAlternativeCharactersAvailableTutorMessageForStandardTyping and msgAlternativeCharactersAvailableTutorMessageForTouchTyping 
;are used as tutor messages when the alternative characters panel appears.
@msgAlternativeCharactersAvailableTutorMessageForStandardTyping
Explore to any character then double tap or split tap on the character to type, or triple tap after exploring any of the alternative characters to close the panel.
@@
@msgAlternativeCharactersAvailableTutorMessageForTouchTyping
Explore to any character then lift or split single tap to type, or split double tap on any character in the panel to close.
@@
;msgCursorLocation messages are spoken to indicate the location of the cursor in a document when entering text reading gesture mode
@msgCursorLocationEmptyDocument
Empty document
@@
@msgCursorLocationStartOfDocument
Start of document
@@
@msgCursorLocationEndOfDocument
End of document
@@
;for msgCursorLocationCurrentCharacterAndCurrentWord
;%1 is the character at the cursor
;%2 is the word at the cursor
;This message is used when the current character and word are not the same text.
;Do not put punctuation at the end of the message, it will cause confusion.
@msgCursorLocationCurrentCharacterAndCurrentWord
Current character is %1
Current word is %2
@@
;for msgCursorLocationCurrentCharacterAndWord
;%1 is the character at the cursor
;This message is used when the current character and word are the same text, such as when on a space.
;Do not put punctuation at the end of the message, it will cause confusion.
@msgCursorLocationCurrentCharacterAndWord
Current character and word are %1
@@
;msgSelectionModeOn and msgSelectionModeOff are spoken when gestures are used to toggle selection mode
@msgSelectionModeOn
Selection on
@@
@msgSelectionModeOff
Selection off
@@
endMessages

const
	msgElipsis = "..."

;This block of messages contains the text to be spoken as feedback
;when the user has turned off touch navigation sounds.
Messages
@msgNotAvailableForTouchCursor_L
Not available for touch cursor
@@
@msgNotAvailableForTouchCursor_S
Not available
@@
;for next and prior, the long message is specific to the type of next item, but the short is used for them all and does not include the item.
@msgTouchNavFailedToMoveNextElement_L
No next touch element
@@
@msgTouchNavFailedToMoveNextElementOfType_L
No next touch element of type
@@
@msgTouchNavFailedToMoveNextSibling_L
No next sibling
@@
@msgTouchNavFailedToMoveNext_S
No next
@@
@msgTouchNavFailedToMovePriorElement_L
No prior touch element
@@
@msgTouchNavFailedToMovePriorElementOfType_L
No prior touch element of type
@@
@msgTouchNavFailedToMovePriorSibling_L
No prior sibling
@@
@msgTouchNavFailedToMovePrior_S
No prior
@@
@msgTouchNavFailedToMoveParent_L
No parent touch element
@@
@msgTouchNavFailedToMoveParent_S
No parent
@@
@msgTouchNavFailedToMoveChild_L
No child touch element
@@
@msgTouchNavFailedToMoveChild_S
No child
@@
EndMessages

;This block of messages is used for speaking the navigation type roter items,
;or for messages that mention the type of navigation,
;such as messages used to notify of quick navigation failure to find the specified type.
messages
@msgTouchTypeButtons
buttons
@@
@msgTouchTypeHeadings
headings
@@
@msgTouchTypeLinks
links
@@
@msgTouchTypeListItems
list items
@@
@msgTouchTypeRegions
regions
@@
@msgTouchTypeSeparators
separators
@@
@msgTouchTypeFormControls
form controls
@@
@msgTouchTypeRadioButtons
radio buttons
@@
@msgTouchTypeComboBoxes
combo boxes
@@
@msgTouchTypeDocuments
documents
@@
@msgTouchTypeEdits
edits
@@
@msgTouchTypeImages
images
@@
@msgTouchTypeLists
lists
@@
@msgTouchTypeMenus
menus
@@
@msgTouchTypeToolBars
tool bars
@@
@msgTouchTypePanes
panes
@@
@msgTouchTypeTabs
tabs
@@
@msgTouchTypeTexts
Texts
@@
@msgTouchTypeTables
tables
@@
@msgTouchTypeGroups
groups
@@
@msgTouchTypeTrees
trees
@@
@msgTouchTypeCheckboxes
checkboxes
@@
@msgTouchTypeStatusBars
status bars
@@
@msgTouchTypeLandmarks
landmarks
@@
;msgTouchRotorItemAdjustValue is contextually added to the rotor when the touch location is on a slider:
@msgTouchRotorItemAdjustValue
Adjust value
@@
EndMessages

;The messages in this section may be used to speak information about an item when navigating,
;or when outputting diagnostic information about the current element.
Messages
@msgPatternCollapsed
collapsed
@@
@msgPatternExpanded
expanded
@@
@MsgPatternPartiallyExpanded
partially expanded
@@
@msgPatternLeafNode
leaf node
@@
; for msgPatternGrid, %1 = number of columns, %2 = row count.
@msgPatternGrid
grid with %1 columns and %2 rows
@@
;for msgPatternGridItemSpanningDescription, and msgPatternGridItemDescription:
;%1 is the current row number,
;%2 is the current column number,
;%3 is the number of columns spanned,
;%4 is the number of rows spanned.
@msgPatternGridItemSpanningDescription
row %1 column %2, spanning %3 columns and %4 rows
@@
@msgPatternGridItemDescription
row %1 column %2
@@
@msgPatternNotChecked
not checked
@@
@msgPatternChecked
checked
@@
@msgPatternPartiallyChecked
partially checked
@@
@msgPatternSelected
selected
@@
@msgPatternReadOnly
read only
@@
@msgPatternPassword
password
@@
@msgPatternRequired
required
@@
@msgPatternInvalidEntry
invalid entry
@@
@msgPatternHorizontal
horizontal
@@
@msgPatternVertical
vertical
@@
@msgPatternDisabled
disabled
@@
endMessages

;Diagnostic properties and patterns messages
;All messages in this section are used by script UIASayElementProperties
;to output information about UIA object properties or patterns.
;Messages which consist of a property or pattern name or value are not translatable,
;but messages which describe the property or pattern are translatable and are located in this block.
Messages
;msgPropertyOutputBlock contains the entire screen showing information about an element's properties.
;%1 is a multiline message of all properties, each property on a separate line,
;followed by any pattern information retrieved from the UIA element.
;Depending on the element, there are a variable number of properties and patterns to be retrieved.
;If the element has patterns, msgAvailablePatternOutputBlock and msgPatternDataOutputBlock will appear in the %1 text of msgPropertyOutputBlock.
@msgPropertyOutputBlock
Properties

%1
@@
;msgAvailablePatternOutputBlock contains the block of information about an element's patterns.
;%1 is a potentially multiline message of all available patterns, each pattern on a separate line.
;Depending on the element, there are a variable number of patterns to be retrieved.
@msgAvailablePatternOutputBlock
Patterns

Available patterns:
%1
@@
;msgPatternDataOutputBlock appears only if there are available patterns,
;and if the patterns have data to be shown.
;pattern data will exist only if there are available patterns.
;Blocks of pattern data may be separated by a blank line,
;which is why there is a blank line preceding the replaceable parameter.
;%1 is a potentially multiline message of all pattern data, each data on a separate line.
@msgPatternDataOutputBlock
Pattern data:

%1
@@
;msgPosition messages are used in properties or patterns to describe position information.
@msgPositionTop
top
@@
@msgPositionLeft
left
@@
@msgPositionBottom
bottom
@@
@msgPositionRight
right
@@
@msgPositionFill
fill
@@
@msgPositionNone
none
@@
;msgWindowInteractionState messages are used to describe the property of the window interaction state:
@msgWindowInteractionStateRunning
running
@@
@msgWindowInteractionStateClosing
closing
@@
@msgWindowInteractionStateReadyForUserInteraction
ready for user interaction
@@
@msgWindowInteractionStateBlockedByModalWindow
blocked by modal window
@@
@msgWindowInteractionStateNotResponding
not responding
@@
;msgWindowVisualState messages are used to describe the property of the window visual state:
@msgWindowVisualStateNormal
normal
@@
@msgWindowVisualStateMaximized
maximized
@@
@msgWindowVisualStateMinimized
minimized
@@
;msgPropertyDataEmptyValue is output to properties when we wish to indicate that a property is empty.
@msgPropertyDataEmptyValue
[empty]
@@
;for msgPatternDataTablePatternHeaderData and msgPatternDataTableItemPatternHeaderData messages,
;The message msgPropertyDataEmptyValue will be appended if there is no data to show,
;or the message will be followed by an indented list of headers if there is data to show.
;spacing will be added if needed, so don't add it to the message.
@msgPatternDataTablePatternHeaderData_ForColumn
Table column headers:
@@
@msgPatternDataTablePatternHeaderData_ForRow
Table row headers:
@@
@msgPatternDataTableItemPatternHeaderData_ForColumn
Table item column headers:
@@
@msgPatternDataTableItemPatternHeaderData_ForRow
Table item row headers:
@@
;msgPatternDataSpreadsheetItemAnnotationObjects is followed by a list of information for each object
@msgPatternDataSpreadsheetItemAnnotationObjects
Spreadsheet annotation objects:
@@
;msgAnnotationType messages are used in message msgPatternDataAnnotationTypeID
@msgAnnotationTypeUnknown
unknown
@@
@msgAnnotationTypeSpellingError
spelling error
@@
@msgAnnotationTypeGrammarError
grammar error
@@
@msgAnnotationTypeComment
comment
@@
@msgAnnotationTypeFormulaError
formula error
@@
@msgAnnotationTypeTrackChanges
track changes
@@
@msgAnnotationTypeHeader
header
@@
@msgAnnotationTypeFooter
footer
@@
@msgAnnotationTypeHighlighted
highlighted
@@
;msgStyle messages are used in message msgPatternDataStyleID
@msgStyleBulletedList
bulleted list
@@
@msgStyleCustom
custom
@@
@msgStyleEmphasis
emphasis
@@
@msgStyleHeading1
heading1
@@
@msgStyleHeading2
heading2
@@
@msgStyleHeading3
heading3
@@
@msgStyleHeading4
heading4
@@
@msgStyleHeading5
heading5
@@
@msgStyleHeading6
heading6
@@
@msgStyleHeading7
heading7
@@
@msgStyleHeading8
heading8
@@
@msgStyleHeading9
heading9
@@
@msgStyleNormal
normal
@@
@msgStyleNumberedList
numbered list
@@
@msgStyleQuote
quote
@@
@msgStyleSubtitle
subtitle
@@
@msgStyleTitle
title
@@
;msgPatternDataSelectionItemPattern_ContainingObject is a descriptive list label used with msgElementNameTypeAndRuntimeID:
@msgPatternDataSelectionItemPattern_ContainingObject
Selection item containing object
@@
;msgPatternDataTextDocumentTextRange is a descriptive label followed by a block of UIA information output.
@msgPatternDataTextDocumentTextRange
Text document text range:
@@
;msgPropertyTextInRange is a descriptive label,
;%1 is the UIA text in the range, possibly truncated to avoid outputting a large text string.
@msgPropertyTextInRange
Text in range: %1
@@
;msgPropertyTextRangeBoundingRect is a descriptive label,
;%1 is the rectangle coordinates in mathematical format.
@msgPropertyTextRangeBoundingRect
Text range bounding rectangle: %1
@@
;msgPropertyTextRangeEnclosingObject is a list label used with msgElementNameTypeAndRuntimeID
@msgPropertyTextRangeEnclosingObject
Text range enclosing object
@@
;msgPropertyTextRangeChildren is a descriptive label followed by a list of information about the text range children
@msgPropertyTextRangeChildren
Text range children:
@@
;msgTextSelection messages are used to describe the type of text selection which an element supports:
@msgTextSelectionNone
none
@@
@msgTextSelectionSingle
single
@@
@msgTextSelectionMultiple
multiple
@@
;msgPatternDataTextControlHasKeyboardFocus is a descriptive label,
;%1 is one of msgPatternDataValueTrue or msgPatternDataValueFalse
@msgPatternDataTextControlHasKeyboardFocus
Text control has keyboard focus: %1
@@
;msgPatternDataTextVisibleRanges is a descriptive label followed by a block of information about the visible text ranges:
@msgPatternDataTextVisibleRanges
Text visible ranges:
@@
;msgPatternDataTextChildTextRange is a descriptive label followed by a block of UIA information output:
@msgPatternDataTextChildTextRange
Text child text range:
@@
;msgPatternData messages are used to describe UIA property values:
@msgPatternDataValueTrue
true
@@
@msgPatternDataValueFalse
false
@@
@msgPatternDataError
[Error]
@@
;msgPatternDataDragDropEffects is a descriptive label, and will be followed by a list of effects as returned by UIA
@msgPatternDataDragDropEffects
Drop effects:
@@
;msgPatternDataDragGrabbedItems is a descriptive label and will be followed by a list of grabbed items
@msgPatternDataDragGrabbedItems
Drag grabbed items:
@@
;msgPatternDataDropTargetEffects is a descriptive label and will be followed by a list of effects as returned by UIA
@msgPatternDataDropTargetEffects
Drop target effects:
@@
EndMessages

;Debugging output messages:
;These are messages used only for when debugging is turned on in UIA.
Messages
@msgDebug_UIADebuggingOn
UIA debugging on
@@
@msgDebug_UIADebuggingOff
UIA debugging off
@@
@msgDebug_DidNotGetObject
Did not get object
@@
@msgDebug_FailedToGetCondition
Failed to get condition
@@
@msgDebug_NoProcessCondition
No process condition
@@
@msgDebug_NoAndCondition
No and condition
@@
@msgDebug_FailedToGetTreeWalker
Failed to get tree walker
@@
@msgDebug_FailedToGetCurrentElement
Failed to get current element
@@
@msgDebug_NoTreeWalker
No tree walker
@@
@msgDebug_NoElement
No element
@@
@msgDebug_NoRectangle
No rectangle
@@
@msgDebug_NoClickablePoint
No clickable point
@@
@msgDebug_DidNotSetFocus
Did not set focus
@@
@msgDebug_CouldNotCreateTypeConditionFromInputData
Could not create type condition from input data
@@
@msgDebug_NoTypeCondition
No type condition
@@
@msgDebug_NoCondition
No condition
@@
@msgDebug_FailedToCreateEventsObject
Failed to create events object
@@
@msgDebug_UIAAtachedEvents
Attached UIA events
@@
@msgDebug_FailedToAttachUIAEvents
Failed to attach UIA events
@@
@msgDebug_UIADetachedEvents
Detached UIA events
@@
@msgDebug_FailedToDetachUIAEvents
Failed to detach UIA events
@@
@msgDebug_AddedFocusChangeHandler
Added focus change handler
@@
@msgDebug_FailedToAddFocusChangeHandler
Failed to add focus change handler
@@
@msgDebug_RemovedFocusChangeHandler
Removed focus change handler
@@
@msgDebug_FailedToRemoveFocusChangeHandler
Failed to remove focus change handler
@@
@msgDebug_AddedMenuOpenEventHandler
Added menu open event handler
@@
@msgDebug_FailedToAddMenuOpenEventHandler
Failed to add menu open event handler
@@
@msgDebug_RemovedMenuOpenEventHandler
Removed menu open event handler
@@
@msgDebug_FailedToRemoveMenuOpenEventHandler
Failed to remove menu open event handler
@@
@msgDebug_AddedPropertyChangeHandler
Added property change handler
@@
@msgDebug_FailedToAddPropertyChangeHandler
Failed to add property change handler
@@
@msgDebug_RemovedPropertyChangeHandler
Removed property change handler
@@
@msgDebug_FailedToRemovePropertyChangeHandler
Failed to remove property change handler
@@
@msgDebug_AddedAutomationEventHandler
Added automation event handler
@@
@msgDebug_FailedToAddAutomationEventHandler
Failed to add automation event handler
@@
@msgDebug_RemovedAutomationEventHandler
Removed automation event handler
@@
@msgDebug_FailedToRemoveAutomationEventHandler
Failed to remove automation event handler
@@
@msgDebug_UIAEvent_FocusChange
Focus change %1
@@
@msgDebug_UIAEvent_PropertyChange
Property change %1 %2 %3
@@
@msgDebug_UIAEvent_AutomationEvent
Automation event %1 %2
@@
EndMessages

Messages
;cmsgDisplayOrientation_ messages are used to notify the user of display orientation changes where only one display exists.
;The _L messages provide more orientation information, with the possible exception of the normal portrait.
@cmsgDisplayOrientation_landscape_S
landscape
@@
@cmsgDisplayOrientation_portrait_S
portrait
@@
@cmsgDisplayOrientation_landscape_HomeToLeft_L
landscape, with home button to the left
@@
@cmsgDisplayOrientation_landscape_HomeToRight_L
landscape, with home button to the right
@@
@cmsgDisplayOrientation_Portrait_Normal_L
Portrait
@@
@cmsgDisplayOrientation_Portrait_Flipped_L
Portrait, flipped
@@
;cmsgPrimaryDisplayOrientation and cmsgIndexedDisplayOrientation are used only if there is more than one display.
;For cmsgPrimaryDisplayOrientation:
;%1 is one of the cmsgDisplayOrientation messages.
;For cmsgIndexedDisplayOrientation:
;%1 is the index number of the display,
;%2 is one of the cmsgDisplayOrientation messages.
@cmsgPrimaryDisplayOrientation 
Primary display, %1
@@
@cmsgIndexedDisplayOrientation 
Display %1, %2
@@
;msgExploreRestrictionLevel messages are spoken when the restriction level of gestures changes.
@msgExploreRestrictionLevel_None
Explore restriction off
@@
@msgExploreRestrictionLevel_Window
Explore restricted to window
@@
@msgExploreRestrictionLevel_Control
Explore restricted to control
@@
;for msgTouchCursorCenterPoint:
;%1 is the x coordinate
;msgExploreRestrictionRectangleCoordinates is used to report the restriction rectangle if explore is restricted.
;%2 is the left coordinate
;%2 is the top coordinate
;%3 is the right coordinate
;%4 is the bottom coordinate
@msgExploreRestrictionRectangleCoordinates
Restricted to rectangle with upper left coordinate of %1,%2, and a bottom right coordinate of %3,%4.
@@
;%2 is the y coordinate
@msgTouchCursorCenterPoint
Touch cursor centered at %1,%2
@@
; msgErrorTooManyElementsToProcess messages are used when too many elements are found for the script to provide diagnostic information about an element and its subtree.
; %1 is the number of elements found.
; %2 is the maximum number of element allowed for processing.
@msgErrorTooManyElementsToProcess_L
Found %1 elements.
Only a maximum of %2 elements are allowed to be processed.
Plese try again with a smaller subtree.
@@
@msgErrorTooManyElementsToProcess_S
Found %1 elements.
Maximum allowed is %2.
@@
@msgCouldNotGetDiagnosticInformation
Could not get diagnostic information
@@
@msgTouchCursorNotActiveError_L
The touch cursor is not active
@@
@msgTouchCursorNotActiveError_S
Touch cursor not active
@@
EndMessages
