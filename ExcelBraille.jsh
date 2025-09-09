;Copyright 1995-2015 Freedom Scientific, Inc.
; JAWS 12.00.xx
; Braille header file for Microsoft Excel.


CONST
;custom Braille support
	XL_WT_CELL=1,
	XL_WT_CELL_EDIT=2,
	XL_WT_ROW_VIEW=3,
	XL_WT_COL_VIEW=4,
	XL_WT_CELL_SELECTION=5,
	XL_WT_AREA_SELECTION=6,
	xl_wt_TreeviewInCell=7,
	xl_wt_dropdownList=8,
	xl_wt_CommentEdit=9,
	xl_wt_ListItemWithExtraHelp=10,
	xl_wt_textbox =11,
	xl_wt_NoteEdit=12,
	xl_wt_Slicer=13,
	xl_wt_row_with_coltitles=14,
	xl_wt_prior_and_cur_row=15

globals
int gExcelBrlRefreshID
