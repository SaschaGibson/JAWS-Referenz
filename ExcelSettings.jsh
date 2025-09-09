;Copyright 1995-2015 Freedom Scientific, Inc.
; JAWS 12.00.xx
; Microsoft Excel Settings.

CONST
;alpha strings to test if should write as integer or not.
	alphaStrings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
	POINTER_DEFAULT	0, ; default is move to available, if none available create
	POINTER_REPLACE	1, ; 0 will create one if none available. 
	POINTER_DELETE	2

messages
;Place your setting here in either of the following lists, 
; and findSetting will appropriate the corresponding collection to the user.
;For now, do not include settings with dependencies.
@AppSettings
CellReadingVerbosity
NamedTitles
SelectionReadingVerbosity
DetectCellNumberFormatChange
DetectCellBorderChange
MonitorCellTitles
BrailleMode
SettingsFileAssoc
DetectSmartTags
DetectObjectCount
DetectFilters
HyperlinkAddressAnnouncement
Comments
MergedCells
Formulas
@@

@BookSettings
CellTextVisibility
ShadingChanges
FormatConditionsDetection
DetectFormControls
DetectPagebreaks
OrientationIndication
TitleCellFontAndFormattingIndication
@@

@sheetSettings
MultipleRegionSupport
FontChanges
TitleSpeaksForCells
@@

@RegionSettings
TitleRestrictionVerbosity
@@
endMessages
