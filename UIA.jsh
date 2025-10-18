const
	UIATrue = 0xffffffff,
	UIAError = 0xfffe,

; ----------------------------------------
; ControlTypeID
UIA_ButtonControlTypeId = 50000,
UIA_CalendarControlTypeId = 50001,
UIA_CheckBoxControlTypeId = 50002,
UIA_ComboBoxControlTypeId = 50003,
UIA_EditControlTypeId = 50004,
UIA_HyperlinkControlTypeId = 50005,
UIA_ImageControlTypeId = 50006,
UIA_ListItemControlTypeId = 50007,
UIA_ListControlTypeId = 50008,
UIA_MenuControlTypeId = 50009,
UIA_MenuBarControlTypeId = 50010,
UIA_MenuItemControlTypeId = 50011,
UIA_ProgressBarControlTypeId = 50012,
UIA_RadioButtonControlTypeId = 50013,
UIA_ScrollBarControlTypeId = 50014,
UIA_SliderControlTypeId = 50015,
UIA_SpinnerControlTypeId = 50016,
UIA_StatusBarControlTypeId = 50017,
UIA_TabControlTypeId = 50018,
UIA_TabItemControlTypeId = 50019,
UIA_TextControlTypeId = 50020,
UIA_ToolBarControlTypeId = 50021,
UIA_ToolTipControlTypeId = 50022,
UIA_TreeControlTypeId = 50023,
UIA_TreeItemControlTypeId = 50024,
UIA_CustomControlTypeId = 50025,
UIA_GroupControlTypeId = 50026,
UIA_ThumbControlTypeId = 50027,
UIA_DataGridControlTypeId = 50028,
UIA_DataItemControlTypeId = 50029,
UIA_DocumentControlTypeId = 50030,
UIA_SplitButtonControlTypeId = 50031,
UIA_WindowControlTypeId = 50032,
UIA_PaneControlTypeId = 50033,
UIA_HeaderControlTypeId = 50034,
UIA_HeaderItemControlTypeId = 50035,
UIA_TableControlTypeId = 50036,
UIA_TitleBarControlTypeId = 50037,
UIA_SeparatorControlTypeId = 50038,
UIA_SemanticZoomControlTypeId = 50039,
UIA_AppBarControlTypeId = 50040,

; ----------------------------------------
; UIA_PatternIds
UIA_InvokePatternId = 10000,
UIA_SelectionPatternId = 10001,
UIA_ValuePatternId = 10002,
UIA_RangeValuePatternId = 10003,
UIA_ScrollPatternId = 10004,
UIA_ExpandCollapsePatternId = 10005,
UIA_GridPatternId = 10006,
UIA_GridItemPatternId = 10007,
UIA_MultipleViewPatternId = 10008,
UIA_WindowPatternId = 10009,
UIA_SelectionItemPatternId = 10010,
UIA_DockPatternId = 10011,
UIA_TablePatternId = 10012,
UIA_TableItemPatternId = 10013,
UIA_TextPatternId = 10014,
UIA_TogglePatternId = 10015,
UIA_TransformPatternId = 10016,
UIA_ScrollItemPatternId = 10017,
UIA_LegacyIAccessiblePatternId = 10018,
UIA_ItemContainerPatternId = 10019,
UIA_VirtualizedItemPatternId = 10020,
UIA_SynchronizedInputPatternId = 10021,
UIA_ObjectModelPatternId = 10022,
UIA_AnnotationPatternId = 10023,
UIA_TextPattern2Id = 10024,
UIA_StylesPatternId = 10025,
UIA_SpreadsheetPatternId = 10026,
UIA_SpreadsheetItemPatternId = 10027,
UIA_TransformPattern2Id = 10028,
UIA_TextChildPatternId = 10029,
UIA_DragPatternId = 10030,
UIA_DropTargetPatternId = 10031,
UIA_TextEditPatternId = 10032,
UIA_CustomNavigationPatternId = 10033,
UIA_SelectionPattern2Id = 10034,

; ----------------------------------------
; PropertyID
UIA_RuntimeIdPropertyId = 30000,
UIA_BoundingRectanglePropertyId = 30001,
UIA_ProcessIdPropertyId = 30002,
UIA_ControlTypePropertyId = 30003,
UIA_LocalizedControlTypePropertyId = 30004,
UIA_NamePropertyId = 30005,
UIA_AcceleratorKeyPropertyId = 30006,
UIA_AccessKeyPropertyId = 30007,
UIA_HasKeyboardFocusPropertyId = 30008,
UIA_IsKeyboardFocusablePropertyId = 30009,
UIA_IsEnabledPropertyId = 30010,
UIA_AutomationIdPropertyId = 30011,
UIA_ClassNamePropertyId = 30012,
UIA_HelpTextPropertyId = 30013,
UIA_ClickablePointPropertyId = 30014,
UIA_CulturePropertyId = 30015,
UIA_IsControlElementPropertyId = 30016,
UIA_IsContentElementPropertyId = 30017,
UIA_LabeledByPropertyId = 30018,
UIA_IsPasswordPropertyId = 30019,
UIA_NativeWindowHandlePropertyId = 30020,
UIA_ItemTypePropertyId = 30021,
UIA_IsOffscreenPropertyId = 30022,
UIA_OrientationPropertyId = 30023,
UIA_FrameworkIdPropertyId = 30024,
UIA_IsRequiredForFormPropertyId = 30025,
UIA_ItemStatusPropertyId = 30026,
UIA_IsDockPatternAvailablePropertyId = 30027,
UIA_IsExpandCollapsePatternAvailablePropertyId = 30028,
UIA_IsGridItemPatternAvailablePropertyId = 30029,
UIA_IsGridPatternAvailablePropertyId = 30030,
UIA_IsInvokePatternAvailablePropertyId = 30031,
UIA_IsMultipleViewPatternAvailablePropertyId = 30032,
UIA_IsRangeValuePatternAvailablePropertyId = 30033,
UIA_IsScrollPatternAvailablePropertyId = 30034,
UIA_IsScrollItemPatternAvailablePropertyId = 30035,
UIA_IsSelectionItemPatternAvailablePropertyId = 30036,
UIA_IsSelectionPatternAvailablePropertyId = 30037,
UIA_IsTablePatternAvailablePropertyId = 30038,
UIA_IsTableItemPatternAvailablePropertyId = 30039,
UIA_IsTextPatternAvailablePropertyId = 30040,
UIA_IsTogglePatternAvailablePropertyId = 30041,
UIA_IsTransformPatternAvailablePropertyId = 30042,
UIA_IsValuePatternAvailablePropertyId = 30043,
UIA_IsWindowPatternAvailablePropertyId = 30044,
UIA_ValueValuePropertyId = 30045,
UIA_ValueIsReadOnlyPropertyId = 30046,
UIA_RangeValueValuePropertyId = 30047,
UIA_RangeValueIsReadOnlyPropertyId = 30048,
UIA_RangeValueMinimumPropertyId = 30049,
UIA_RangeValueMaximumPropertyId = 30050,
UIA_RangeValueLargeChangePropertyId = 30051,
UIA_RangeValueSmallChangePropertyId = 30052,
UIA_ScrollHorizontalScrollPercentPropertyId = 30053,
UIA_ScrollHorizontalViewSizePropertyId = 30054,
UIA_ScrollVerticalScrollPercentPropertyId = 30055,
UIA_ScrollVerticalViewSizePropertyId = 30056,
UIA_ScrollHorizontallyScrollablePropertyId = 30057,
UIA_ScrollVerticallyScrollablePropertyId = 30058,
UIA_SelectionSelectionPropertyId = 30059,
UIA_SelectionCanSelectMultiplePropertyId = 30060,
UIA_SelectionIsSelectionRequiredPropertyId = 30061,
UIA_GridRowCountPropertyId = 30062,
UIA_GridColumnCountPropertyId = 30063,
UIA_GridItemRowPropertyId = 30064,
UIA_GridItemColumnPropertyId = 30065,
UIA_GridItemRowSpanPropertyId = 30066,
UIA_GridItemColumnSpanPropertyId = 30067,
UIA_GridItemContainingGridPropertyId = 30068,
UIA_DockDockPositionPropertyId = 30069,
UIA_ExpandCollapseExpandCollapseStatePropertyId = 30070,
UIA_MultipleViewCurrentViewPropertyId = 30071,
UIA_MultipleViewSupportedViewsPropertyId = 30072,
UIA_WindowCanMaximizePropertyId = 30073,
UIA_WindowCanMinimizePropertyId = 30074,
UIA_WindowWindowVisualStatePropertyId = 30075,
UIA_WindowWindowInteractionStatePropertyId = 30076,
UIA_WindowIsModalPropertyId = 30077,
UIA_WindowIsTopmostPropertyId = 30078,
UIA_SelectionItemIsSelectedPropertyId = 30079,
UIA_SelectionItemSelectionContainerPropertyId = 30080,
UIA_TableRowHeadersPropertyId = 30081,
UIA_TableColumnHeadersPropertyId = 30082,
UIA_TableRowOrColumnMajorPropertyId = 30083,
UIA_TableItemRowHeaderItemsPropertyId = 30084,
UIA_TableItemColumnHeaderItemsPropertyId = 30085,
UIA_ToggleToggleStatePropertyId = 30086,
UIA_TransformCanMovePropertyId = 30087,
UIA_TransformCanResizePropertyId = 30088,
UIA_TransformCanRotatePropertyId = 30089,
UIA_IsLegacyIAccessiblePatternAvailablePropertyId = 30090,
UIA_LegacyIAccessibleChildIdPropertyId = 30091,
UIA_LegacyIAccessibleNamePropertyId = 30092,
UIA_LegacyIAccessibleValuePropertyId = 30093,
UIA_LegacyIAccessibleDescriptionPropertyId = 30094,
UIA_LegacyIAccessibleRolePropertyId = 30095,
UIA_LegacyIAccessibleStatePropertyId = 30096,
UIA_LegacyIAccessibleHelpPropertyId = 30097,
UIA_LegacyIAccessibleKeyboardShortcutPropertyId = 30098,
UIA_LegacyIAccessibleSelectionPropertyId = 30099,
UIA_LegacyIAccessibleDefaultActionPropertyId = 30100,
UIA_AriaRolePropertyId = 30101,
UIA_AriaPropertiesPropertyId = 30102,
UIA_IsDataValidForFormPropertyId = 30103,
UIA_ControllerForPropertyId = 30104,
UIA_DescribedByPropertyId = 30105,
UIA_FlowsToPropertyId = 30106,
UIA_ProviderDescriptionPropertyId = 30107,
UIA_IsItemContainerPatternAvailablePropertyId = 30108,
UIA_IsVirtualizedItemPatternAvailablePropertyId = 30109,
UIA_IsSynchronizedInputPatternAvailablePropertyId = 30110,
UIA_OptimizeForVisualContentPropertyId = 30111,
UIA_IsObjectModelPatternAvailablePropertyId = 30112,
UIA_AnnotationAnnotationTypeIdPropertyId = 30113,
UIA_AnnotationAnnotationTypeNamePropertyId = 30114,
UIA_AnnotationAuthorPropertyId = 30115,
UIA_AnnotationDateTimePropertyId = 30116,
UIA_AnnotationTargetPropertyId = 30117,
UIA_IsAnnotationPatternAvailablePropertyId = 30118,
UIA_IsTextPattern2AvailablePropertyId = 30119,
UIA_StylesStyleIdPropertyId = 30120,
UIA_StylesStyleNamePropertyId = 30121,
UIA_StylesFillColorPropertyId = 30122,
UIA_StylesFillPatternStylePropertyId = 30123,
UIA_StylesShapePropertyId = 30124,
UIA_StylesFillPatternColorPropertyId = 30125,
UIA_StylesExtendedPropertiesPropertyId = 30126,
UIA_IsStylesPatternAvailablePropertyId = 30127,
UIA_IsSpreadsheetPatternAvailablePropertyId = 30128,
UIA_SpreadsheetItemFormulaPropertyId = 30129,
UIA_SpreadsheetItemAnnotationObjectsPropertyId = 30130,
UIA_SpreadsheetItemAnnotationTypesPropertyId = 30131,
UIA_IsSpreadsheetItemPatternAvailablePropertyId = 30132,
UIA_Transform2CanZoomPropertyId = 30133,
UIA_IsTransformPattern2AvailablePropertyId = 30134,
UIA_LiveSettingPropertyId = 30135,
UIA_IsTextChildPatternAvailablePropertyId = 30136,
UIA_IsDragPatternAvailablePropertyId = 30137,
UIA_DragIsGrabbedPropertyId = 30138,
UIA_DragDropEffectPropertyId = 30139,
UIA_DragDropEffectsPropertyId = 30140,
UIA_IsDropTargetPatternAvailablePropertyId = 30141,
UIA_DropTargetDropTargetEffectPropertyId = 30142,
UIA_DropTargetDropTargetEffectsPropertyId = 30143,
UIA_DragGrabbedItemsPropertyId = 30144,
UIA_Transform2ZoomLevelPropertyId = 30145,
UIA_Transform2ZoomMinimumPropertyId = 30146,
UIA_Transform2ZoomMaximumPropertyId = 30147,
UIA_FlowsFromPropertyId = 30148,
UIA_IsTextEditPatternAvailablePropertyId	=	30149,
UIA_IsPeripheralPropertyId = 30150,
UIA_IsCustomNavigationPatternAvailablePropertyId = 30151,
UIA_PositionInSetPropertyId	= 30152,
UIA_SizeOfSetPropertyId = 30153,
UIA_LevelPropertyId = 30154,
UIA_AnnotationTypesPropertyId = 30155,
UIA_AnnotationObjectsPropertyId = 30156,
UIA_LandmarkTypePropertyId	=	30157,
UIA_LocalizedLandmarkTypePropertyId	=	30158,
UIA_FullDescriptionPropertyId	=	30159,
UIA_FillColorPropertyId = 30160,
UIA_OutlineColorPropertyId = 30161,
UIA_FillTypePropertyId = 30162,
UIA_VisualEffectsPropertyId = 30163,
UIA_OutlineThicknessPropertyId = 30164,
UIA_CenterPointPropertyId = 30165,
UIA_RotationPropertyId = 30166,
UIA_SizePropertyId = 30167,
UIA_IsSelectionPattern2AvailablePropertyId = 30168,
UIA_Selection2FirstSelectedItemPropertyId = 30169,
UIA_Selection2LastSelectedItemPropertyId = 30170,
UIA_Selection2CurrentSelectedItemPropertyId = 30171,
UIA_Selection2ItemCountPropertyId = 30172,
UIA_HeadingLevelPropertyId = 30173,
UIA_IsDialogPropertyId = 30174,


; ----------------------------------------
; AnnotationTypeID
UIA_AnnotationType_Unknown	=	60000,
UIA_AnnotationType_SpellingError	=	60001,
UIA_AnnotationType_GrammarError	=	60002,
UIA_AnnotationType_Comment	=	60003,
UIA_AnnotationType_FormulaError	=	60004,
UIA_AnnotationType_TrackChanges	=	60005,
UIA_AnnotationType_Header	=	60006,
UIA_AnnotationType_Footer	=	60007,
UIA_AnnotationType_Highlighted	=	60008,
UIA_AnnotationType_Endnote	=	60009,
UIA_AnnotationType_Footnote	=	60010,
UIA_AnnotationType_InsertionChange	=	60011,
UIA_AnnotationType_DeletionChange	=	60012,
UIA_AnnotationType_MoveChange	=	60013,
UIA_AnnotationType_FormatChange	=	60014,
UIA_AnnotationType_UnsyncedChange	=	60015,
UIA_AnnotationType_EditingLockedChange	=	60016,
UIA_AnnotationType_ExternalChange	=	60017,
UIA_AnnotationType_ConflictingChange	=	60018,
UIA_AnnotationType_Author	=	60019,
UIA_AnnotationType_AdvancedProofingIssue	=	60020,
UIA_AnnotationType_DataValidationError	=	60021,
UIA_AnnotationType_CircularReferenceError	=	60022,
UIA_AnnotationType_Mathematics = 60023,

; ----------------------------------------
; EventID
UIA_ToolTipOpenedEventId	=	20000,
UIA_ToolTipClosedEventId	=	20001,
UIA_StructureChangedEventId	=	20002,
UIA_MenuOpenedEventId	=	20003,
UIA_AutomationPropertyChangedEventId	=	20004,
UIA_AutomationFocusChangedEventId	=	20005,
UIA_AsyncContentLoadedEventId	=	20006,
UIA_MenuClosedEventId	=	20007,
UIA_LayoutInvalidatedEventId	=	20008,
UIA_Invoke_InvokedEventId	=	20009,
UIA_SelectionItem_ElementAddedToSelectionEventId	=	20010,
UIA_SelectionItem_ElementRemovedFromSelectionEventId	=	20011,
UIA_SelectionItem_ElementSelectedEventId	=	20012,
UIA_Selection_InvalidatedEventId	=	20013,
UIA_Text_TextSelectionChangedEventId	=	20014,
UIA_Text_TextChangedEventId	=	20015,
UIA_Window_WindowOpenedEventId	=	20016,
UIA_Window_WindowClosedEventId	=	20017,
UIA_MenuModeStartEventId	=	20018,
UIA_MenuModeEndEventId	=	20019,
UIA_InputReachedTargetEventId	=	20020,
UIA_InputReachedOtherElementEventId	=	20021,
UIA_InputDiscardedEventId	=	20022,
UIA_SystemAlertEventId = 20023,
UIA_LiveRegionChangedEventId = 20024,
UIA_HostedFragmentRootsInvalidatedEventId = 20025,
UIA_DragStartEventId	=	20026,
UIA_DragCancelEventId	=	20027,
UIA_Drag_CompleteEventId	=	20028,
UIA_DragEnterEventId	=	20029,
UIA_DragLeaveEventId	=	20030,
UIA_DroppedEventId	=	20031,
UIA_TextEdit_TextChangedEventId	=	20032,
UIA_TextEdit_ConversionTargetChangedEventId	=	20033,
UIA_ChangesEventId = 20034,
UIA_NotificationEventId = 20035,
UIA_ActiveTextPositionChangedEventId = 20036,

; ----------------------------------------
; OrientationTypeID
OrientationType_None = 0,
OrientationType_Horizontal	= 1,
OrientationType_Vertical	= 2,

; ----------------------------------------
; TreeScope
TreeScope_Element	= 1,
TreeScope_Children	= 2,
TreeScope_Descendants	= 4,
TreeScope_Parent	= 8,
TreeScope_Ancestors	= 16,
TreeScope_Subtree	= 7,

; ----------------------------------------
; misc
next = 1,
prior = 0,
UIA_ariaPropertiesDelimiter = ";",
UIA_ariaProperties_selected = "selected=true",

; ----------------------------------------
; ScrollAmountID
ScrollAmount_LargeDecrement	= 0,
ScrollAmount_SmallDecrement	= 1,
ScrollAmount_NoAmount	= 2,
ScrollAmount_LargeIncrement	= 3,
ScrollAmount_SmallIncrement	= 4,

; ----------------------------------------
; StructureChangeTypeID
StructureChangeType_ChildAdded	= 0,
StructureChangeType_ChildRemoved	= 1,
StructureChangeType_ChildrenInvalidated	= 2,
StructureChangeType_ChildrenBulkAdded	= 3,
StructureChangeType_ChildrenBulkRemoved	= 4,
StructureChangeType_ChildrenReordered	= 5,

; ----------------------------------------
; TextAttributeID
UIA_AnimationStyleAttributeId = 40000, ; int
UIA_BackgroundColorAttributeId = 40001, ; int
UIA_BulletStyleAttributeId = 40002, ; int
UIA_CapStyleAttributeId = 40003, ; int
UIA_CultureAttributeId = 40004, ; int
UIA_FontNameAttributeId = 40005, ; string
UIA_FontSizeAttributeId = 40006, ; not available
UIA_FontWeightAttributeId = 40007, ; int
UIA_ForegroundColorAttributeId = 40008, ; int
UIA_HorizontalTextAlignmentAttributeId = 40009, ; int
UIA_IndentationFirstLineAttributeId = 40010, ; not available
UIA_IndentationLeadingAttributeId = 40011, ; not available
UIA_IndentationTrailingAttributeId = 40012, ; not available
UIA_IsHiddenAttributeId = 40013, ; int
UIA_IsItalicAttributeId = 40014, ; int
UIA_IsReadOnlyAttributeId = 40015, ; int
UIA_IsSubscriptAttributeId = 40016, ; int
UIA_IsSuperscriptAttributeId = 40017, ; int
UIA_MarginBottomAttributeId = 40018, ; not available
UIA_MarginLeadingAttributeId = 40019, ; not available
UIA_MarginTopAttributeId = 40020, ; not available
UIA_MarginTrailingAttributeId = 40021, ; not available
UIA_OutlineStylesAttributeId = 40022, ; int
UIA_OverlineColorAttributeId = 40023, ; int
UIA_OverlineStyleAttributeId = 40024, ; int
UIA_StrikethroughColorAttributeId = 40025, ; int
UIA_StrikethroughStyleAttributeId = 40026, ; int
UIA_TabsAttributeId = 40027, ; not available
UIA_TextFlowDirectionsAttributeId = 40028, ; int
UIA_UnderlineColorAttributeId = 40029, ; int
UIA_UnderlineStyleAttributeId = 40030, ; int
UIA_AnnotationTypesAttributeId = 40031, ; not available
UIA_AnnotationObjectsAttributeId = 40032, ; not available
UIA_StyleNameAttributeId = 40033, ; string
UIA_StyleIdAttributeId = 40034, ; int
UIA_LinkAttributeId = 40035, ; not available
UIA_IsActiveAttributeId = 40036, ; int
UIA_SelectionActiveEndAttributeId = 40037, ; int
UIA_CaretPositionAttributeId = 40038, ; int
UIA_CaretBidiModeAttributeId = 40039, ; int
UIA_LineSpacingAttributeId = 40040, ; int
UIA_BeforeParagraphSpacingAttributeId = 40041, ; int
UIA_AfterParagraphSpacingAttributeId = 40042, ; int
UIA_SayAsInterpretAsAttributeId = 40043, ; int

; ----------------------------------------
;PropertyConditionFlags
PropertyConditionFlags_None = 0x00,
PropertyConditionFlags_IgnoreCase = 0x01,
PropertyConditionFlags_MatchSubstring = 0x02,

; ----------------------------------------
; TextUnit
	TextUnit_Character	= 0,
	TextUnit_Format	= 1,
	TextUnit_Word	= 2,
	TextUnit_Line	= 3,
	TextUnit_Paragraph	= 4,
	TextUnit_Page	= 5,
	TextUnit_Document	= 6,

; ----------------------------------------
; Endpoint
	TextPatternRangeEndpoint_Start	= 0,
	TextPatternRangeEndpoint_End	= 1,

; ----------------------------------------
; SupportedTextSelectionID
	SupportedTextSelection_None	= 0,
	SupportedTextSelection_Single	= 1,
	SupportedTextSelection_Multiple	= 2,

; ----------------------------------------
; DockPosition
	DockPosition_Top = 0,
	DockPosition_Left = 1,
	DockPosition_Bottom = 2,
	DockPosition_Right = 3,
	DockPosition_Fill = 4,
	DockPosition_None = 5,

; ----------------------------------------
; SynchronizedInputType
	SynchronizedInputType_KeyUp = 0,
	SynchronizedInputType_KeyDown = 1,
	SynchronizedInputType_LeftMouseUp = 2,
	SynchronizedInputType_LeftMouseDown = 3,
	SynchronizedInputType_RightMouseUp = 4,
	SynchronizedInputType_RightMouseDown = 5,

; ----------------------------------------
; RowOrColumnMajor
	RowOrColumnMajor_RowMajor = 0,
	RowOrColumnMajor_ColumnMajor = 1,
	RowOrColumnMajor_Indeterminate = 2,

; ----------------------------------------
; ZoomUnit
	ZoomUnit_NoAmount = 0,
	ZoomUnit_LargeDecrement = 1,
	ZoomUnit_SmallDecrement = 2,
	ZoomUnit_LargeIncrement = 3,
	ZoomUnit_SmallIncrement = 4,

; ----------------------------------------
; WindowVisualState
	WindowVisualState_Normal = 0,
	WindowVisualState_Maximized = 1,
	WindowVisualState_Minimized = 2,

; ----------------------------------------
; WindowInteractionState
	WindowInteractionState_Running = 0,
	WindowInteractionState_Closing = 1,
	WindowInteractionState_ReadyForUserInteraction = 2,
	WindowInteractionState_BlockedByModalWindow = 3,
	WindowInteractionState_NotResponding = 4,

; ----------------------------------------
; TextEditChangeType
	TextEditChangeType_None = 0,
  TextEditChangeType_AutoCorrect = 1,
  TextEditChangeType_Composition = 2,
  TextEditChangeType_CompositionFinalized = 3,

; ----------------------------------------
; ExpandCollapseState
	ExpandCollapseState_Collapsed = 0,
	ExpandCollapseState_Expanded = 1,
	ExpandCollapseState_PartiallyExpanded = 2,
	ExpandCollapseState_LeafNode = 3,

; ----------------------------------------
; StyleID
	StyleId_Custom= 70000,
	StyleId_Heading1 = 70001,
	StyleId_Heading2 = 70002,
	StyleId_Heading3 = 70003,
	StyleId_Heading4 = 70004,
	StyleId_Heading5 = 70005,
	StyleId_Heading6 = 70006,
	StyleId_Heading7 = 70007,
	StyleId_Heading8 = 70008,
	StyleId_Heading9 = 70009,
	StyleId_Title = 70010,
	StyleId_Subtitle = 70011,
	StyleId_Normal = 70012,
	StyleId_Emphasis = 70013,
	StyleId_Quote = 70014,
	StyleId_BulletedList = 70015,
	StyleId_NumberedList = 70016,

; ----------------------------------------
;LandmarkTypeID
	UIA_CustomLandmarkTypeId	=	80000,
	UIA_FormLandmarkTypeId	=	80001,
	UIA_MainLandmarkTypeId	=	80002,
	UIA_NavigationLandmarkTypeId	=	80003,
	UIA_SearchLandmarkTypeId	=	80004,
	
	; ----------------------------------------
; UIA_HeadingLevelIds
UIA_HeadingLevel_None = 80050,
UIA_HeadingLevel1 = 80051,
UIA_HeadingLevel2 = 80052,
UIA_HeadingLevel3 = 80053,
UIA_HeadingLevel4 = 80054,
UIA_HeadingLevel5 = 80055,
UIA_HeadingLevel6 = 80056,
UIA_HeadingLevel7 = 80057,
UIA_HeadingLevel8 = 80058,
UIA_HeadingLevel9 = 80059,

; ----------------------------------------
; ToggleState
	ToggleState_Off = 0,
	ToggleState_On = 1,
	ToggleState_Indeterminate = 2,

; ----------------------------------------
; LiveSetting
;Off	= 0, //defined in hjconst.jsh
	Polite	= 1,
	Assertive	= 2,

; ----------------------------------------
; LegacySelectionFlags
; SELFLAG_NONE = 0, // defined in MSAAConst.jsh
; SELFLAG_TAKEFOCUS = 1, // defined in MSAAConst.jsh
; SELFLAG_TAKESELECTION = 2, // defined in MSAAConst.jsh
; SELFLAG_EXTENDSELECTION = 4, // defined in MSAAConst.jsh
; SELFLAG_ADDSELECTION = 8, // defined in MSAAConst.jsh
; SELFLAG_REMOVESELECTION = 16 // defined in MSAAConst.jsh

; ----------------------------------------
; The text pattern range method GetText takes an int parameter specifying the max length of the text to retrieve.
; TextRange_NoMaxLength, when used as the parameter, specifies that no maximum length is required:
TextRange_NoMaxLength = 0xffffffff,

; ----------------------------------------
; CaretPosition
CaretPosition_Unknown = 0,
CaretPosition_EndOfLine = 1,
CaretPosition_BeginningOfLine = 2,

; ----------------------------------------
; ActiveEnd
ActiveEnd_None = 0,
ActiveEnd_Start = 1,
ActiveEnd_End = 2,

; ----------------------------------------
; For NotificationEvents
NotificationKind_ItemAdded	= 0,
NotificationKind_ItemRemoved	= 1,
NotificationKind_ActionCompleted	= 2,
NotificationKind_ActionAborted	= 3,
NotificationKind_Other	= 4,

; ----------------------------------------
NotificationProcessing_ImportantAll	= 0,
NotificationProcessing_ImportantMostRecent	= 1,
NotificationProcessing_All	= 2,
NotificationProcessing_MostRecent	= 3,
NotificationProcessing_CurrentThenMostRecent	= 4,

; ----------------------------------------
; AutomationElementMode
AutomationElementMode_None = 0,
AutomationElementMode_Full = 1,

; ----------------------------------------
; TreeTraversalOptions
;
; Option groups (flags):
; 1) Traversal order (preorder, postorder): says when nodes should be tested against search
;    conditions (on enter, on leave).
; 2) Visit order: defines in which order relatives are visited. Relatives include children
;    and siblings. Visit orders are relative to parents. From the child perspective First to
;    Last means 'visit the next sibling from the child' while Last to First means 'visit the
;    previous sibling from the child'.
;
; Default traversal options are:
; 1) Preorder,
; 2) Visit children from first to last.
;
TreeTraversalOptions_Default            = 0x0,
;
; Traversal order: Postorder 
TreeTraversalOptions_PostOrder          = 0x1,
;
; Visit order: Visit children from last to first.
TreeTraversalOptions_LastToFirstOrder   = 0x2,

; ----------------------------------------
; UIA_ChangeIds
UIA_SummaryChangeId = 90000,

; ----------------------------------------
; UIA_MetadataIds
UIA_SayAsInterpretAsMetadataId = 100000
