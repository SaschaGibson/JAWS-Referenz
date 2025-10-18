; Copyright 2016 by Freedom Scientific, Inc.
;Freedom Scientific mouse speech script source header file

const
;enumeration of the mouse speech units which are chosen by the user:
	MouseSpeechUnit_Character = 0,
	MouseSpeechUnit_Word = 1,
	MouseSpeechUnit_Line = 2,
	MouseSpeechUnit_Paragraph = 3,
	
; keys for Settings
	hKey_CellReadingVerbosity="CellReadingVerbosity",
	
; Cell Reading Verbosity
	readCellContentsOnly=0,
	readCellContentsAndCoordinates=1
	