; Copyright 1995-2015 Freedom Scientific, Inc.
; JAWS 11.0.xx
;contains support strings for 'Adjust JAWS Options' dialog for all versions of Microsoft Powerpoint.

Const
;Nodes:
	NODE_OBJECTS="Objects",
	NODE_SLIDES="Slides",
;String constants for tree child items:
;for Object Options:
	uo_OverlapAlert="ToggleOverlapAlert:Overlap alert",
	uo_OverflowAlert="ToggleOverflowAlert:Text Placeholder Overflow alert",
	uo_DescribeObjects="ToggleDescribeObjects:Description",
;for Slide Options:
	uo_TableReadingMethod="ToggleTableReadingMethod:Table Reading Method",
	uo_SlideTransitions="ToggleSlideTransitions:Slide transition indication"

Messages
@msgDefaultSettingIsOn
The default setting is On.
@@
@msgDefaultSettingIsOff
The default setting is Off.
@@
; Option messages
;Node callback help strings:
@msgUO_ObjectsHlp
This group contains options that control how %product% detects Powerpoint objects.
@@
@msgUO_SlidesHlp
This group contains options that control how %product% detects Powerpoint slides.
@@
@msgUOTableReadingHlp
This option controls whether tables are indicated by row, columns, dimensions only, or not at all.

The default setting is table reading row by row.
@@
@msgUOAlertOverlapHlp
This option controls whether to alert that objects are overlapping. %1
@@
@msgUOOverflowAlertHlp
This option controls whether to alert that placeholder content is overflowing. %1
@@
@msgUODescribeObjectsHlp
This option controls whether to describe objects as focus changes from slide to slide. %1
@@
@msgUOSlideTransitionsHlp
This option controls whether to announce transition effects focus changes from slide to slide. %1
@@


;UNUSED_VARIABLES

@msgTableDimensionsOnly_l
Indicate table dimensions only
@@
@msgTableDimensionsOnly_s
dimensions
@@
@msgTableRowByRow_l
Indicate table row by row
@@
@msgTableRowByRow_s
row by row
@@
@msgTableColumnByColumn_l
Indicate table column by column
@@
@msgTableColumnByColunn_s
column by column
@@
@msgTablesIgnore_l
Ignore tables altogether
@@
@msgTablesIgnore_s
ignore
@@

;END_OF_UNUSED_VARIABLES

EndMessages