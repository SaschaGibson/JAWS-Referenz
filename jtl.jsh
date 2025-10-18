; Globals for the task hopper, shared between default and jtl scrip files

globals
	int TaskCommand,
	string TaskName1,
	string TaskName2,
	string TaskName3,
	string TaskName4,
	string TaskName5,
	string TaskName6


String Function ExtractAppTitle ()
var
	string name,
	handle grip

Let grip = GetAppMainWindow (GetCurrentWindow())
if (grip) then
	Let name = GetWindowName (grip)
endif
return (name)
EndFunction

Script SwitchToTask1 ()
if (StringLength (TaskName1) > 0) then
	Let TaskCommand = 1
	StartJAWSTaskList()
else
	SayString ("No Application is assigned to this slot")
endif
EndScript

Script SwitchToTask2 ()
if (StringLength (TaskName2) > 0) then
	Let TaskCommand = 2
	StartJAWSTaskList()
else
	SayString ("No Application is assigned to this slot")
endif
EndScript


Script SwitchToTask3 ()
if (StringLength (TaskName3) > 0) then
	Let TaskCommand = 3
	StartJAWSTaskList()
else
	SayString ("No Application is assigned to this slot")
endif
EndScript

Script SwitchToTask4 ()
if (StringLength (TaskName4) > 0) then
	Let TaskCommand = 4
	StartJAWSTaskList()
else
	SayString ("No Application is assigned to this slot")
endif
EndScript

Script AppAssignTask1 ()
Let TaskName1 =  ExtractAppTitle ()
SayString (TaskName1 + " assigned to channel 1")
EndScript

Script AppAssignTask2 ()
Let TaskName2 =  ExtractAppTitle ()
SayString (TaskName2 + " assigned to channel 2")
EndScript

Script AppAssignTask3 ()
Let TaskName3 = ExtractAppTitle ()
SayString (TaskName3 + " assigned to channel 3")
EndScript

Script AppAssignTask4 ()
Let TaskName4 =  ExtractAppTitle ()
SayString (TaskName4 + " assigned to channel 4")
EndScript
