;Copyright 1995-2015 Freedom Scientific, Inc.
; JAWS 12.0.xx

;contains support strings for 'Adjust JAWS Options' dialog for all versions of Microsoft Excel.
Const
; QuickSettings: Ampersand replacement for list callbacks, just the word 'and'.
	XmlAmpersandReplacement = " and ",
;Nodes:
;Main node for app:
	NODE_Formatting="Formatting",
	NODE_CellAppearance="Cell Appearance",
	NODE_TitleReading="Title Reading",
	NODE_MonitoringCells="Monitoring Cells",
	NODE_PropertiesOfCells="Properties of Cells",
	NODE_WorkbookSettings="Workbook Settings",
;	String constants for tree child items:
	UO_ToggleCellReadingVerbosity="ToggleCellReadingVerbosity:Cell Verbosity",
	UO_SelectionReadingVerbosity="toggleSelectionReadingVerbosity:Selection Verbosity",
	UO_ToggleNumberFormatVerbosity="ToggleNumberFormatVerbosity:Number Format and Style Changes Indication",
	UO_ToggleFormulas="ToggleFormulas:Formulas Detection",
	UO_ToggleComments="ToggleComments:Comments Detection",
	UO_toggleMergedCells="ToggleMergedCells:Merged cells Detection",
	UO_ToggleCellBorderVerbosity="toggleCellBorderVerbosity:Border changes Indication",
	UO_ToggleCellshadingChanges="ToggleCellShadingChanges:Shading changes indication",
	UO_ToggleFontChanges="ToggleFontChanges:Font, color, and attribute changes indication",
	UO_ToggleMultipleRegionSupport="ToggleMultipleRegionSupport:Regions Type Indication",
	UO_ToggleTitleReadingVerbosity="ToggleTitleReadingVerbosity:Title Reading Detection",
	UO_ToggleTitleRestriction="ToggleTitleSpeaksForCells:Titles read for",
	UO_SetColTitlesToRowRange="SetColTitlesToRowRange:Column Titles to Row Range Set",
	UO_SetRowTitlesToColumnRange="SetRowTitlesToColumnRange:Row Titles to Column Range Set",
	UO_SetTotalsColumnToCurrent="SetTotalsColumnToCurrent:Totals Column Set",
	UO_SetTotalColumnToCurrent="SetTotalColumnToCurrent:Totals Column Set",
	UO_SetTotalsRowToCurrent="SetTotalsRowToCurrent:Totals Row Set",
	UO_SetTotalRowToCurrent="SetTotalRowToCurrent:Totals Row Set",
	UO_SetNextAvailableMonitorCell="SetNextAvailableMonitorCell:Monitor Cells Definition",
	UO_ToggleMonitorCellTitles="ToggleMonitorCellTitles:Monitor Cell Titles Read",
	UO_ClearMonitorCells="ClearMonitorCells:Monitor Cells Clear",
	UO_ClearRegionDefinitions="ClearRegionDefinitions:Title & Total Definitions Clear",
	UO_ToggleBrlStructuredMode="ToggleBrlStructuredMode:Braille Mode",
	UO_ToggleDocSettingsAssoc="ToggleDocSettingsAssoc:Workbook Settings",
	UO_ToggleOverrideDocNamedTitles="ToggleOverrideDocNamedTitles:Define Name Column and Row Titles Override",
	UO_ToggleAnnounceTextVisible="ToggleAnnounceTextVisible:Cell Text Visibility Detection",
	UO_ToggleDetectFormatConditions="ToggleDetectFormatConditions:Format Conditions Detection",
	UO_ExcelCustomLabelsSet = "ExcelCustomLabelsSet:Custom Summary Labels",
	UO_ToggleObjectCountDetection="ToggleObjectCountDetection:Object Count Detection",
	UO_ToggleFormControlsDetection="ToggleFormControlsDetection:Form Controls Detection",
	UO_TogglePagebreaksDetection="TogglePagebreaksDetection:Pagebreaks Detection",
	UO_ToggleFilterDetection="ToggleFilterDetection:Filtered Columns and Rows Detection",
	UO_ToggleHyperlinkAddressAnnouncement="ToggleHyperlinkAddressAnnouncement:Hyperlink Address Announcement",
	UO_ToggleOrientationIndication="ToggleOrientationIndication:Orientation Indication",
	UO_ToggleTitleCellFontAndFormattingIndication="ToggleTitleCellFontAndFormattingIndication:Title Cell Font and Formatting Indication",

; script key name
	sn_CreatePrompt="CreatePrompt",



;UNUSED_VARIABLES

	node_excel="Excel Options",
	UO_ToggleSmartTagsIndication="ToggleSmartTagsIndication:Smart Tags Indication"

;END_OF_UNUSED_VARIABLES

Messages
@msgDefaultSettingIsOn
The default setting is On.
@@
@msgDefaultSettingIsOff
The default setting is Off.
@@
@msgUOFirstAndLastCellInSelection1_L
First and Last Cell
@@
@msgUOSelectedRange1_L
All Cells
@@
;Node callback help strings:
@msgUO_FormattingHlp
This group contains options that control which cell formatting changes are detected.
@@
@msgUO_CellAppearanceHlp
This group contains options that control whether cell appearance changes are detected.
@@
@msgUO_TitleReadingHlp
This group contains options that control row and column title reading detection.
@@
@msgUO_MonitoringCellsHlp
This group contains options that control which cells are monitored.
@@
@msgUO_PropertiesOfCellsHlp
This group contains options that control which cell properties are detected.
@@
@msgUO_WorkbookSettingsHlp
This group contains options that control workbook settings.
@@
@msgUO_ToggleNumberFormatVerbosityHlp
This option controls whether to detect changes in number format and/or  style as cells are navigated. %1
@@
@msgUO_ToggleFormulasHlp
This worksheet specific option controls whether to announce that a cell has a formula. %1
@@
@msgUO_ToggleCommentsHlp
This worksheet specific option controls whether to announce that a cell has a comment. %1
@@
@msgUO_toggleMergedCellsHlp
This option controls whether to announce that a group of cells is merged. %1
@@
@msgUO_ToggleCellBorderVerbosityHlp
This option controls whether to detect changes in borders as cells are navigated. %1
@@
@msgUO_ToggleCellshadingChangesHlp
This option controls whether to detect changes in shading as cells are navigated. %1
@@
@msgUO_ToggleFontChangesHlp
This option controls whether to detect changes in font name, size, attributes, and color as cells are navigated. %1
@@
@msgUO_ToggleMultipleRegionSupportHlp
This option controls whether to detect the current worksheet as having a single region or multiple regions for purposes of column and row title reading. The default is single region. This setting can only be changed manually if the Define Name Column and Row Titles Override option is turned on for all files or for the current file.
@@
@msgUO_ToggleTitleReadingVerbosityHlp
This worksheet specific option controls whether title reading is on for both columns and rows, on only for columns, on only for rows, or off altogether. %1 This setting can only be changed manually if the Define Name Column and Row Titles Override option is turned on for all files or for the current file.
@@
@msgUO_ToggleTitleSpeaksForCellsHlp
This worksheet specific option controls whether column and row titles should be read for any data cell or only when cells are to the right and below title cells . The default is to read titles only when cells are to the right and below title cells.
@@
@msgUO_SetColTitlesToRowRangeHlp
This worksheet specific option allows the user manually to define the currently selected cell or group of cells as a title row.

In order to use this feature, you first need to change the default setting for "Define Name Column and Row Titles Override". That feature is off by default. This means that %product% honors named titles for columns and rows already present in the worksheet itself, if such named titles exist. The named titles must be of a certain form for %product% to recognize them. For example, if a named range were "TitleRegion1.A1.G6.1, %product% would recognize the region bound by cells A1 through G6 as a region in Worksheet 1, and use rows in column A and columns in row 1 as title headers. To learn more about how to use Define Name Column and Row Titles, see the Help topic for the feature.To learn more about how to use Define Name Column and Row Titles, see the Help topic for the feature.

To set the current title row(s) manually, first move up to the Define Name Column and Row Titles option in the list. Then press SPACEBAR to toggle the override on. Choose either "On for all files" or "On for the current file".

Now move back down the list to define the current title row(s) and press SpaceBar. Press Enter to save the setting changes you have made.
@@
@msgUO_SetRowTitlesToColumnRangeHlp
This worksheet specific option allows the user manually to define the currently selected cell or group of cells as a title column.
In order to use this feature, you first need to change the default setting for "Define Name Column and Row Titles Override". That feature is off by default. This means that %product% honors named titles for columns and rows already present in the worksheet itself, if such named titles exist. The named titles must be of a certain form for %product% to recognize them. For example, if a named range were "TitleRegion1.A1.G6.1, %product% would recognize the region bound by cells A1 through G6 as a region in Worksheet 1, and use rows in column A and columns in row 1 as title headers. To learn more about how to use Define Name Column and Row Titles, see the Help topic for the feature.

To set the current title column(s) manually, first move up to the Define Name Column and Row Titles option in the list. Then press SPACEBAR to toggle the override on. Choose either "On for all files" or "On for the current file".

Now move back down the list to define the current title column(s) and press SpaceBar. Press Enter to save the setting changes you have made.
@@
@msgUO_SetTotalsColumnToCurrentHlp
This worksheet specific option allows the user to set the current column as the totals column for the current worksheet or region. The default is Auto, which means the column is assumed to be the last column with data.
@@
@msgUO_SetTotalColumnToCurrentHlp
This worksheet specific option allows the user to set the current column as the totals column for the current worksheet or region. The default is Auto, which means the column is assumed to be the last column with data.
@@
@msgUO_SetTotalsRowToCurrentHlp
This worksheet specific option allows the user to set the current row as the totals row for the current worksheet or region. The default is Auto, which means the totals row is assumed to be the last row with data.
@@
@msgUO_SetTotalRowToCurrentHlp
This worksheet specific option allows the user to set the current row as the totals row for the current worksheet or region. The default is Auto, which means the totals row is assumed to be the last row with data.
@@
@msgUO_SetNextAvailableMonitorCellHlp
This worksheet specific option allows the user to set the next cell that should be a monitor cell for the current worksheet. Up to 10 monitor cells can be set for any given worksheet, their numbers ranging from 0 through 9.
@@
@msgUO_ToggleMonitorCellTitlesHlp
This worksheet specific option controls whether to read column and row titles of a monitor cell when the user requests to read the content of that cell. %1
@@
@msgUO_ClearMonitorCellsHlp
This worksheet specific option allows the user to clear all monitor cell definitions for the current worksheet.
@@
@MsgUO_ClearRegionDefinitionsHlp
This option allows the user to clear all user-defined column and row title definitions as well as total column and total row definitions for the current worksheet. The feature only works if those definitions are not the ones predefined using the Define Names feature in Excel. In other words, Define Names Title Override must either be "on for all files" or "On for the current file" and there must be row and/or column designations defined in the options for setting row and column titles.
@@
@msgUO_ToggleDocSettingsAssocHlp
This option controls whether workbook settings are set for the settings file to be an exact match for the current filename, a best match for the current filename,or a new settings file altogether for the current filename. The default is exact match.
@@
@msgUO_ToggleOverrideDocNamedTitlesHlp
This option controls whether to override detection of any Define Name Column and Row Titles contained in the current worksheet or workbook. The default is off, which means that %product% detects Define Name column and row titles if they exist and are of the form %product% recognizes. However, if %product% detects that the user has assigned titles manually in a settings file, those user-assigned settings superseed the ones that are part of the Excel file itself.

For %product% to be able to detect such user-defined settings, you need to override Define Name Column and Row Titles. The options are:
On for all files - %product% overrides detection of any document named titles that may exist in any worksheet or workbook. None are read unless the user manually sets them and saves them in a settings file.

On only for the current file - %product% overrides any document named titles that may exist in the current worksheet or workbook, but does detect them in other workbooks.
@@
@msgUO_ToggleAnnounceTextVisibleHlp
This worksheet specific option controls whether to detect that cell text is cropped or overlapping other cells. %1
When a cell contains more than one line of text, %product% also reports that it is a multi-line cell.
@@
@msgUO_ToggleDetectFormatConditionsHlp
This option controls whether to detect that a cell is conditionally formatted. %1
@@
@msgUO_ToggleCellReadingVerbosityHlp
This option controls whether to announce both cell content and coordinates or only cell content as cells are navigated. The default setting is to announce both cell content and coordinates.
@@
@msgUO_SelectionReadingVerbosityHlp
This option controls whether to announce the content of all cells in a selected range or the content of only the first and last cells in the range. The default setting is to announce the content of all cells in a selected range. However, note that if the selected range is large, only the content of the first and last cells is read to prevent a long delay in processing.
@@
@msgUO_SelectionReadingVerbosityFirstAndLastHlp
This option controls whether to announce the content of all cells in a selected range or the content of only the first and last cells in the range. The default setting is to announce the content of the first and last cell in the selected range.
@@
@msgUO_ExcelReadingOptionsHlp
This group contains options specific to Microsoft Excel that control how %product% behaves when reading and navigating cells. It also contains options that control how %product% behaves when reading and navigating text.
@@
@msgUO_ExcelBrailleOptionsHlp
This group contains options specific to Microsoft Excel that control your Braille display while on a spreadsheet. It also contains groups of options that control your braille display in genreral.
These include options for panning, contracted braille output, braille marking, 8 dot braille, and more.
@@
@msgUO_ToggleBrlStructuredModeHlp
This option controls whether the Braille display shows the active cell, the current row, or the current column. The default setting is to show the active cell.
@@
@msgUO_ToggleSmartTagsIndicationHlp
This option controls whether to detect that Excel is marking smart tags. %1
@@
@msgUO_ExcelCustomLabelsSetHlp
This option controls whether or not %product% uses custom summary labels for custom summary views previously defined in Microsoft Excel.

When the Custom Summary Labels option is On, you can assign and manipulate custom summary labels for the current workbook by using the command normally used to create a custom label, %1.

When the Custom Summary Labels option is off, the feature is simply not available. If you attempt to create a custom summary label for a cell in the worksheet, or attempt to view a custom summary of previously defined custom summary labels, an error message is heard.

Turning the feature off only works temporarily. When the application regains focus from moving away and back or closing and restarting Excel, or even changing worksheets or workbooks, custom Summary Labels is available once again. The only purpose for turning it off temporarily is to demonstrate how useful it is to have it available.

%2
@@
@msgUO_ExcelLanguageDetectChangeHlp
This option controls whether %product% detects changes in language within workbooks which support language tags. %1

This detection only affects those synthesizers, such as Eloquence, that support multiple languages.
@@
@msgUO_ToggleObjectCountDetectionHlp
This option controls whether %product% detects and announces the number of embedded objects in the currently active worksheet. %1

when the option is on, as a worksheet opens, or if you add one from the Insert ribbon in Office 2007, or the Insert menu in prior versions of Office, %product% announces the number of objects in the worksheet. As you change worksheets within the same workbook, %product% announces the number of objects, if any, in the worksheet gaining focus.
@@
@msgUO_ToggleFormControlsDetectionHlp
This option controls whether %product% detects form controls as the currently open worksheet is navigated. %1

Form controls include listboxes, checkboxes, and other similar types of form controls.
@@
@msgUO_TogglePagebreaksDetectionHlp
This option controls whether %product% should detect pagebreaks as the current worksheet is navigated. %1

In general, the feature should remain off. but if you need to check where pagebreaks may occur when printing the document, it is useful to turn the setting on for that workbook. The setting is workbook-specific. This means that when it is on for one workbook, it may not be on for another one.

The types of pagebreaks that can be detected include horizontal, vertical, or manual pagebreaks. In addition to the ability to detect pagebreaks as the worksheet is navigated, you can bring up a pagebreak list of horizontal and vertical pagebreaks by pressing %KeyFor(ListCellsAtPageBreaks). This feature is available whether pagebreaks detection is on or not.

If a manual pagebreak is set for a colum or row, it means that the pagebreak applies to that entire colum or row. As you continue to navigate along the same column or row, %product% will not continue to inform you that this column or row has a manual pagebreak. But if you move off the column or row where it is located and then return to that column or row, then %product% once again alerts you that this column or row has a manual pagebreak.

If a manual pagebreak occurs on a particular column and row, %product% alerts you about the intersection, that is, that this manual pagebreak is both at the current column and current row.
@@
@msgUO_ToggleFilterDetectionHlp
This option controls whether to detect filtered columns and rows as the cells in the currently active worksheet are navigated. %1

When the option is on and filtering is enabled for the current worksheet, %product% tells you when you have selected a cell whose column or row is filtered. If you navigate within the same column or row, %product% does not repeat this information. But if you move to a new column and new row, such as from the GoTo dialog, %product% announces what columns or rows are filtered for the cell that has just gained focus.

Filtered columns and rows may not be filtered consecutively. You could have Columns c, E, and G filtered or you could have columns C through G filtered. The same is true for rows. %product% attempts to tell you whether the cell that has just gained focus is within a filtered row or column, or whether the rows or columns that are filtered are nonconsecutive. When the range of columns or rows is nonconsecutive, you can bring up Screen-sensitive Help to get a complete list of the filtered items.
@@
@msgUO_ToggleHyperlinkAddressAnnouncementHlp
This option controls whether to announce the cell address pointed to by a cell with a hyperlink if the address is a worksheet address. %1
If the hyperlink is not a worksheet address, such as a website or Email address, the standard message that the cell has a hyperlink is heard instead.
@@
@msgUO_ToggleOrientationIndicationHlp
This option controls whether to indicate the orientation of a cell as the user navigates around the current worksheet. The setting is worksheet-specific. If the number indicated is positive, rotation is upward or counterclockwise. If negative, the rotation is downward or clockwise. %1
@@
@msgUO_ToggleTitleCellFontAndFormattingIndicationHlp
This option controls whether %product% displays in the virtual viewer font and formatting information for the title cell associated with the currently active cell. %1

To see the font and formatting for a title cell after enabling the feature, press either %KeyFor(SayWindowPromptAndText) or %KeyFor(SayFont) twice quickly.

Note: This feature does not cause %product% to announce font and formatting changes for titles cells as cells are navigated. Rather, enabling this feature causes %product% to display font and formatting, whatever it may be, for the column title cell and/or row title cell (if any) that may be associated with the currently active cell. If the currently active cell has no column or row title cell associated with it, or if the currently active cell is itself a title cell, then %product% only displays the active cell's own font and formatting information.
@@
EndMessages