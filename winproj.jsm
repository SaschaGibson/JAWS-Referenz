; Build 3.71.05.001
; Microsoft Project 2000 Script Message File
; JAWS for Windows 3.7
; Copyright 2010-2015 by Freedom Scientific, Inc.
; Build PJ3710519 by Joseph Kelton Stephen last modified 5 October 2000

const
; Adjust JAWS Verbosity Dialog extra items
	StrWinprojVerbosityItems="|toggleSelectionVerbosity:Selection Verbosity|toggleStatusInfo:Task and Resource Status Information|toggleOutlineLevelAnnouncement:Task Outline Level|toggleNoteIndicator:Notes Indicator|toggleDependencyCountAnnouncement:Task Dependency Count",
;Keystrokes
ks1 = "alt+downarrow",  ;To open list boxes
ks2 = "alt+uparrow",

; The following section is for determining which page of the
; Task Information dialog is active:
wn_TaskInformation="Task Information",  ;dialog name
csPredecessors="Predecessors:",  ;uniquely identifies the predecessors page
csResources="Resources:",  ; uniquely identifies the Resources page

; The following section is for determining which page of the non-
; Options dialog is active:
wn_Options="Options",  ; dialog name
scView="View",  ; the name of the View Tab in the Options dialog

;Font dialog:
wn_Font="Font",
;Text Style dialog:
wn_TextStyles="Text Styles",
;Gridlines dialog:
wn_Gridlines="Gridlines",
;Format Bar Dialog:
wn_FormatBar="Format Bar",
scShapeList="Shape:",
scColorList="Color:",
scPatternList="Pattern:",
scTypeList="Type:",

; these are used when determining which fields to read with alt+numbers row 1 through 0.
; views
viewGanttChart="gantt chart",
viewTaskUsage="task usage",
viewResourceSheet="resource sheet",
viewResourceUsage="resource usage",
viewTrackingGantt="tracking gantt",
; note that field ids and field names are listed together here for order's sake
; field ids
GanttChartFields="188743885,188743694,188743709,188743715,188743716,188743727,188743729",
gantChartFieldNames="indicators,task name,duration,start,finish,predecessors,resource names",
taskUsageFields="188743885,188743694,188743680,188743709,188743715,188743716",
taskUsageFieldNames="indicators,task name,work,duration,start,finish",
trackingGanttFields="188743885,188743694,188743709,188743715,188743716,188743727,188743729",
trackingGantFieldNames="indicators,task name,duration,start,finish,predecessors,resource names",
resourceSheetFields="205520982,205520897,205521196,205521195,205520898,205520899,205520900,205520902,205520903,205520914,205520915,205520901,205520906",
resourceSheetFieldNames="indicators,resource name,type,material label,initials,group,max units,standard rate,overtime rate,cost per use,accrue at,base calendar,code",
resourceUsageFields="205520982,205520897,205520909",
resourceUsageFieldNames="indicators,resource name,work",
;string comparisons
scDelim=",",
; scRemainingWork_L = "remaining work: ",
; Window Names
wn_saveAs="Save As",
wn_SaveWorkspaceAs="Save Workspace As",
wn_open="Open",
wn_LinkToFile="Link to File",
wn_InsertProject="Insert Project",
WN_spellchecker="Spelling",



;UNUSED_VARIABLES

scEdit="Edit",  ;Text to match between the tab name and the dialog static text below the tabs
scSchedule="Schedule",  ;Text to match between the tab name and the dialog static text below the tabs
scItemToChangeCombo="Item to Change:",
viewTaskSheet="task sheet",
taskSheetFields="188743885,188743694,188743709,188743715,188743716,188743727,188743729",
taskSheetFieldNames="indicators,task name,duration,start,finish,predecessors,resource names",
scHours_L = " hours"

;END_OF_UNUSED_VARIABLES

messages
@PJMsgMsProject1_L
Microsoft Project
@@
@PJMsgSelectedFields1_L
selected fields:
@@
@PJMsgSelectedFields1_S
selected fields:
@@
@PJMsgNoSelectedDay1_L
No selected day
@@
@PJMsgNoSelectedDay1_S
No selection
@@
;for PJMsgTask1_L, %1=task number
@PJMsgTask1_L
task %1
@@
;for PJMsgResource1_L, %1=resource number
@PJMsgResource1_L
resource %1
@@
;for PJMsgOutlineLevel1_L, %1=outline level number
@PJMsgOutlineLevel1_L
level %1
@@
@PJMsgCritical1_L
critical
@@
@PJMsgSummary1_L
summary
@@
@PJMsgMileStone1_L
mile stone
@@
;for PJMsgPredecessors1_L, %1=number of predecessors
@PJMsgPredecessors1_L
%1 predecessors
@@
;for PJMsgSuccessors1_L, %1=number of successors
@PJMsgSuccessors1_L
%1 successors
@@
@PJMsgOnePredecessor1_L
one predecessor
@@
@PJMsgOneSuccessor1_L
one successor
@@
@PJMsgNotDependent1_L
Task is not dependent on any other tasks
@@
;for PJMsgDependsOn1_L, %1=task name
@PJMsgDependsOn1_L
Task %1 depends on:
@@
;for PJMsgTaskDependencyDetails, %1=id, %2=name, %3=description of dependency
@PJMsgTaskDependencyDetails1
%1 %2 %3
@@
@PJMsgAnd1_L
 and
@@
@PJMsgMarked1_L
marked
@@
;for PJMsgPercentComplete1_L, %1=percentage complete
@PJMsgPercentComplete1_L
%1 percent complete
@@
@PJMsgNotDependedOn1_L
task is not depended upon by any other task
@@
;for PJMsgIsDependedUpon1_L, %1=task name
@PJMsgIsDependedUpon1_L
Task %1 is depended upon by:
@@
@PJMsgHasLinksTo1_L
has links to:
@@
@PJMsgLinkTypeFinishToFinish1_L
Finish To Finish
@@
@PJMsgLinkTypeFinishToStart1_L
Finish To Start
@@
@PJMsgLinkTypeStartToFinish1_L
Start To Finish
@@
@PJMsgLinkTypeStartToStart1_L
Start To Start
@@
@PJMsgAnnounceDependencyCountOff1_S
off
@@
@PJMsgAddToSelection1_L
add to selection
@@
@PJMsgExtendedSelectionOff1_L
extended selection off
@@
@PJMsgExtendedSelectionOff1_S
selection off
@@
@PJMsgExtendedSelectionOn1_L
extended selection on
@@
@PJMsgExtendedSelectionOn1_S
selection on
@@
@PJMsgAnnounceDependencyCountOn1_S
On
@@
@PJMsgAnnounceOutlineLevelOff1_S
Off
@@
@PJMsgAnnounceOutlineLevelOn1_S
On
@@
;for PJMsgResourcesAssignedTo1_L, %1=task name
@PJMsgResourcesAssignedTo1_L
Resources assigned to %1
@@
;for PJMsgIsAssignedTo1_L, %1=resource name
@PJMsgIsAssignedTo1_L
%1 is assigned to the following tasks:
@@
@PJMsgNone1_L
none
@@
@PJMsgNoResourceSelected1_L
no resource selected
@@
;for PJMsgIsAvailableAsFollows1_L, %1=resource name
@PJMsgIsAvailableAsFollows1_L
%1 is available as follows:
@@
;for PJMsgFromTo1_L, %1=start date/time, %2=finish date/time
@PJMsgFromTo1_L
from %1 to %2
@@
;for PJMsgNotesFor1_L, %1=task/resource name
@PJMsgNotesFor1_L
notes for %1:
@@
;for PJMsgNoNotesFor1_L, %1=task/resource name
@PJMsgNoNotesFor1_L
no notes for %1.
@@
@PJMsgHasNotes1_L
has notes
@@
@PJMsgIndicateNotesOff1_S
Off
@@
@PJMsgIndicateNotesOn1_S
On
@@
@PJMsgAnnounceStatusInfoOff1_S
Off
@@
@PJMsgAnnounceStatusInfoOn1_S
On
@@
@PJMsgResponsePending1_L
response pending
@@
;for PJMsgNodeAt1_L, %1=x-coordinate, %2=y-coordinate.
@PJMsgNodeAt1_L
Node at %1, %2.
@@
@PJMsgNotInSpellchecker1_L
Not in the Spellchecker.
@@
; Screen Sensitive Help
;for PJMsgHelp1_L/S, %1=view name, %2=field name, %3=table name, %4=group name,
;%5=filter name
@PJMsgHelp1_L
This is the %1 view.
This is the %2 field in the %3 table.
Enter a value or press F2 to edit the existing value.
To open the list of available values use Alt+Down arrow.
Use Tab to move to the next Control.
The current group is %4.
The current filter is %5.
@@
@PJMsgHelp1_S
%1 view.
%2 field in %3 table
Enter a value or press F2 to edit the existing value.
To open the list of available values use Alt+Down arrow.
Use Tab to move to the next Control.
group is %4
filter is %5
@@
;for PJMsgHelp2_L/S, %1=field name
@PJMsgHelp2_L
 This is an edit Combo box.
You can type in a value or select from the list of valid values for the %1 field by using the arrows to select an item.
@@
@PJMsgHelp2_S
 edit Combo box
type in a value or select from list of values for %1 field by using arrows
@@
;for PJMsgHelp3_L/S, %1=network diagram or relationship (ie view name)
@PJMsgHelp3_L
This is the %1 view.
Use the standard navigation and cut and paste keystrokes to navigate between and move nnodes in the diagram.
%product% will tell you which tasks depend on the selected task.
For more information about this task's dependencies use the Describe Dependencies keystroke %keyFor(speakTaskDependencies).
To speak task or resource assignments use %keyFor(readAssignments).
@@
@PJMsgHelp3_S
%1 view
Use standard navigation and cut and paste keystrokes to navigate between and move nnodes in diagram
task dependencies use %keyFor(speakTaskDependencies)
task or resource assignments use %keyFor(readAssignments)
@@
;for PJMsgHelp4_L/S, %1=view name
@PJMsgHelp4_L
This is the %1 view.
@@
@PJMsgHelp4_S
%1 view.
@@
@PJMsgHelp5_L
%product% does not support this view.
@@
@PJMsgHelp5_S
%product% does not support this view.
@@
@PJMsgHelp6_L
This is a calendar
Use the arrows to select a day
@@
@PJMsgHelp6_S
calendar
Use arrows to select day
@@
@PJMsgHelp7_L
Extended selection mode is on.
This means that arrowing automatically selects items.
@@
@PJMsgHelp7_S
Extended selection mode
@@
@msgHotkeyHelp1_L
To describe task dependencies use  %KeyFor(speakTaskDependencies).
@@
@msgHotkeyHelp1_S
task dependencies %KeyFor(speakTaskDependencies)
@@
@msgHotkeyHelp2_L
To read task or resource notes use  %KeyFor(readNotes).
To speak task or resource assignments use  %KeyFor(readAssignments).
@@
@msgHotkeyHelp2_S
task or resource notes %KeyFor(readNotes)
task or resource assignments %KeyFor(readAssignments)
@@
@msgHotkeyHelp3_L
To speak resource availability use  %KeyFor(sayResourceAvailability).
@@
@msgHotkeyHelp3_S
resource availability %KeyFor(sayResourceAvailability)
@@
@msgHotkeyHelp4_L
to read the first 10 cells in the current row without moving from the current cell
use Alt+1 through 0 on the numbers row.
@@
@msgHotkeyHelp4_S
first 10 cells in row Alt+1 through 0 on numbers row
@@
@msgWKeysHelp1_L
To open, create or print a project use Control O, N or P
To cut, copy, paste or undo use Control X, C, V or Z
To fill down use Control D
To fill right use Control R
To clear field contents use Control Del
To delete task use Del
To add the current item to the selection use Shift F8
To toggle Extended Selection Mode use F8
To promote or demote a task use Alt Shift Left or Right Arrow
To link tasks use Control F2
To go to the task information dialog use Shift+F2
To assign resources use Alt F10
To start the Spellchecker use f7
To find text use Control F
To replace text use Control H
To go to a task or date use Control G
To insert a hyperlink use Control K
To start MSProject Help use F1
To get Help on the focused item use Shift F1
To go to the Macros dialog use Alt F8
To start the Visual Basic editor use Alt F11
@@
@msgWKeysHelp1_S
open, create or print a project Control O, N or P
cut, copy, paste or undo Control X, C, V or Z
fill down Control D
fill right Control R
clear field contents Control Del
delete task Del
add the current item to the selection Shift F8
toggle Extended Selection Mode F8
promote or demote a task Alt Shift Left or Right Arrow
link tasks Control F2
go to the task information dialog Shift+F2
assign resources Alt F10
start the Spellchecker f7
find text Control F
replace text Control H
go to a task or date Control G
insert hyperlink Control K
MSProject Help F1
What's this Shift F1
go to the Macros dialog Alt F8
start the Visual Basic editor Alt F11
@@
;for PJMsgPriority1_L, %1=priority number
@PJMsgPriority1_L
priority %1
@@
@pjMsgPriorityDoNotLevel1_L
Do Not Level
@@
@pjMsgPriorityHighest1_L
Highest
@@
@pjMsgPriorityVeryHigh1_L
Very High
@@
@pjMsgPriorityHigher1_L
Higher
@@
@pjMsgPriorityHigh1_L
High
@@
@pjMsgPriorityMedium1_L
Medium
@@
@pjMsgPriorityLow1_L
Low
@@
@pjMsgPriorityLower1_L
Lower
@@
@pjMsgPriorityVeryLow1_L
Very Low
@@
@pjMsgPriorityLowest1_L
Lowest
@@
@PJMsgTopPane1_L
top pane
@@
@PJMsgBottomPane1_L
bottom pane
@@
@PJmsgAppSettingsSaved1_L
Application Settings saved
@@
@PJmsgAppSettingsNotSaved1_L
Application Settings could not be saved
@@
@PJMsgSelectionVerbosityNormal1_S
Full
@@
@PJMsgSelectionVerbosityTerse1_S
First and Last
@@
@PJMsgThrough1_L
through
@@
@PJMsgThrough1_S
through
@@
@PJMsgMonthBox1_L
This is a calendar control.
Use page up and down to select a month.
Use the JAWS cursor to click on components of this control.
@@
@PJMsgMonthBox1_S
calendar control
page up and down to select month
Use JAWS cursor to click on components of control
@@
@PJMsgMonthBoxView1_L
month box
@@
@PJMsgMonthBoxView1_S
month box
@@
; Braille symbols
@msgBrlTask
tsk%1
@@
@msgBrlResource
res%1
@@
@msgBrlTaskLevel
l%1
@@
@msgBrlMarked
x
@@
@msgBrlCritical
c
@@
@msgBrlPredecessors
%1<
@@
@msgBrlSuccessors
%1>
@@
@msgBrlMilestone
m
@@
@msgBrlSummary
s
@@
@msgBrlPercentComplete
%1%%
@@
@msgBrlResponsePending
r
@@
; for speaking non standard dialog page tabs,
; %1 is the name of the dialog page tab
@msgDlgTabCtrl_L
%1 tab
@@
@msgDlgTabCtrl_S
%1
@@


;UNUSED_VARIABLES

@msgAppStart1_L
To hear the %product% help topic for Microsoft Project press %keyFor(screenSensitiveHelp) twice quickly.
@@
@msgAppStart1_S
%product% help topic for MSProject %keyFor(screenSensitiveHelp) twice quickly.
@@
@PJMsgAnnounceDependencyCountOff1_L
do not announce task dependency count
@@
@PJMsgAnnounceDependencyCountOn1_L
announce task dependency count
@@
@PJMsgAnnounceOutlineLevelOff1_L
do not announce task outline level
@@
@PJMsgAnnounceOutlineLevelOn1_L
announce task outline level
@@
@PJMsgIndicateNotesOff1_L
do not indicate when a task or resource has notes
@@
@PJMsgIndicateNotesOn1_L
Indicate when a task or resource has notes
@@
@PJMsgAnnounceStatusInfoOff1_L
do not announce task or resource status information
@@
@PJMsgAnnounceStatusInfoOn1_L
announce task or resource status information
@@
@PJMsgSelectionVerbosityNormal1_L
Read full selection
@@
@PJMsgSelectionVerbosityTerse1_L
Read first and last fields in selection
@@
@msgBrlFieldNameValue
%1: %2
@@
@msgPleaseWaitMSProjData_L
Collecting MS Project data
Please wait
@@
@msgInitOProjAppFailed_L
Initialization of the MS Project application failed
@@
@msgInitOProjAppFailed_S
Initialization failed
@@

;END_OF_UNUSED_VARIABLES

endMessages
