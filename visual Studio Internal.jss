;Copyright 2011-2015 Freedom Scientific, Inc.
include "Visual Studio 2010.jsh"
include "Visual Studio 2010.jsm"
const
	MaxObjectModelAttachAttempts = 10,
	IID_DebuggerEvents = "{46209330-0FBA-11D3-B880-00C04F79E479}",
	IID_BuildEvents="{1926364E-6B90-46CB-A44D-8A80FB11ACD9}",
	LIBID_Dte80 = "{80CC9F66-E7D8-4DDD-85B6-D9E6CD0E93E2}"
String	function GetVSVersionString()
	; This isn't the exact version, but rather the major version
	;	with .0 appended.
	return FormatString("%1.0",GetProgramVersion(GetAppFilePath()))
EndFunction
int function IsVS2012OrLater()
	return (GetProgramVersion(GetAppFilePath()) >= 11)
EndFunction
/*
	Visual Studio comes in several editions each of which has a
	unique ID.  Multiple versions of multiple editions can
	coexist on the same machine.  The ID and version are
	used in registry keys, and also to construct entries for the
	Running Object Table.  Each of the Visual Studio Express
	editions has an ID equal to it's executable name.  The
	commercial editions have an ID of VisualStudio and an
	executable name of devenv.
*/
String function GetVSEdition()
	var string name =GetAppFileName()
	; Remove the trailing .exe extension
	StringTrimCommon(name,".exe",2)
	if (name =="devenv") then
		return "VisualStudio"
	else
		return name
	EndIf
EndFunction
void function UnscheduleAttachToObjectModel()
	if (g_vsdteAttachTimer ) then
		UnScheduleFunction(g_vsdteAttachTimer)
		let g_vsdteAttachTimer = 0
	EndIf
EndFunction
void function RescheduleAttachToObjectModel()
	if (g_vsdteAtachAttempts >=
		MaxObjectModelAttachAttempts) then
		return
	EndIf
	let g_vsdteAtachAttempts = g_vsdteAtachAttempts+1
	let g_vsdteAttachTimer = ScheduleFunction("AttachToObjectModel",10)
EndFunction
function AttachToObjectModel()
	UnscheduleAttachToObjectModel()
	/*
	All instances register as !VSEdition.dte.MajorVersion.0:ProcessId, where
	VSEdition identifies which variant of VisualStudio is
	being run, either an express version or the commercial
	one.
	*/
	if (!g_vsdte) then
		var string RotName =
		FormatString("!%1.DTE.%2:%3",
		GetVSEdition(),GetVSVersionString(),GetWindowProcessId())
		let  g_vsdte = getobject(RotName)
	EndIf
	if (!g_vsdte)
		RescheduleAttachToObjectModel()
		return
	EndIf
	if (!g_vsDebuggerEvents) then
		let g_vsDebuggerEvents = g_vsdte.Events.DebuggerEvents
		if (!g_vsDebuggerEvents) then
			RescheduleAttachToObjectModel()
			return
		EndIf
		comAttachEvents(g_vsDebuggerEvents,"vs",IID_DebuggerEvents,LIBID_Dte80,8,0)
	EndIf
	if (!g_vsBuildEvents) then
		let g_vsBuildEvents = g_vsdte.Events.BuildEvents
		if (!g_vsBuildEvents) then
			RescheduleAttachToObjectModel()
			return
		EndIf
		comAttachEvents(g_vsBuildEvents,"vs",IID_BuildEvents,LIBID_Dte80,8,0)
	EndIf
	return
EndFunction
prototype String Function GetVisualStudioInstanceId(string pathToSomeFileInVSDirectory)

string Function GetHandleIncomingCallRegistrySubKey()
	if (GetProgramVersion(GetAppFilePath()) >= 15)
		; VS 2017 (AKA 15.0) and later allow side by side installations of
		; different SKUs with the same version.  Their registry
		; entries are disambiguated by the use of a unique instance ID
		; assigned to each SKU/version combination. The newly added
		; SetupConfiguration interfaces allow obtaining said
		; InstanceId. That's what the following call does.
		var string InstanceId =GetVisualStudioInstanceId(GetAppFilePath())
		if (!InstanceId)
			return ""
		EndIf
		return FormatString("SOFTWARE\\Microsoft\\%1\\%2_%3_config\\HandleInComingCall",GetVSEdition(),GetVSVersionString(),InstanceId)
	EndIf
	return FormatString("SOFTWARE\\Microsoft\\%1\\%2_config\\HandleInComingCall",GetVSEdition(),GetVSVersionString())
EndFunction

; The following allows use of this builtin function without listing it
;in builtin.jsd
prototype int function  EnsureVSWizardsAllowFSDom(string
registrySubkey,int ByRef entriesAdded)

function EnableJawsAccessToVSWizards()
	if (!IsVS2012OrLater())
		; In earlier versions, these registry entries appear under HKLM and
		;are put in place at JAWS install time.
		return
	EndIf
	var int KeysAdded
	if (EnsureVSWizardsAllowFSDom(GetHandleIncomingCallRegistrySubKey(),KeysAdded)) then
		if (KeysAdded > 0) then
			MessageBox(cmsgJawsHasMadeChanges)
		EndIf
	Else
		MessageBox(cmsgJawsCouldNotMakeChanges)
	EndIf
EndFunction

