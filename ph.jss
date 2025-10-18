; Copyright 1995-2015 by Freedom Scientific, Inc.
; Prompt Helper for MSWord, Excel,  and IE
/*MSWord specific notes JKS 20 April 2007:
Custom labels are stored in a file named after the attached template of the document in either a general Custom Labels
section or in a document specific section.
This is done so that if a template is created from which many forms are derived, and custom labels are created for the
template, any document derived from that template will inherit the labels in the template label file's general section.
If the document is then saved as a document rather than a template, and further custom labels are added, these specific
labels will be stored in the document specific section of the label file.
This means that when labels are read for a document, both the general section and the doc specific section are read to
ensure we get general and doc specific labels.
Of course if the document is a template, only the general section is read.
*/

include "hjconst.jsh"
include "hjglobal.jsh"
include "common.jsm"
include "ph.jsm"
const
	scCustomLabelSection="CustomLabels",
	scMSWordDocClass="_WwG",
	scIEDocClass="Internet Explorer_Server",
	scAdobeClass="AVL_AVView",
	scMSExcelWorksheetClass="EXCEL7",
	sAppNameExcel="Microsoft Excel"

int function ShouldUseCustomLabler(handle hwnd)
var
	string sClass,
	string sParentClass,
	string sRealClass

if !hwnd then
	return FALSE
endIf
If !AreUtilitiesAllowed() then
	return FALSE
endIf
let sClass=getWindowClass(hwnd)
let sParentClass=GetWindowClass(GetParent(hwnd))
let sRealClass=GetWindowClass(GetRealWindow(hwnd))

if sClass==scMSWordDocClass 
|| sClass==scIEDocClass 
|| sClass==scAdobeClass 
|| sClass==cwcFireFoxBrowserClass 
|| sClass==cwcChromeBrowserClass
|| sClass==cwc_Chrome_WidgetWin_1
|| sClass==scMSExcelWorkSheetClass then
	return TRUE
;for combos and embedded controls within client area such as comboboxes and listboxes on the web
elif sParentClass==scMSWordDocClass 
|| sParentClass==scIEDocClass 
|| sParentClass==scAdobeClass 
|| sParentClass==cwcFireFoxBrowserClass then
	return TRUE
elif sRealClass==scMSWordDocClass 
|| sRealClass==scIEDocClass 
|| sRealClass==scAdobeClass 
|| sRealClass==cwcFireFoxBrowserClass then
	return TRUE
else
	return FALSE
endIf
endFunction

string function GetCustomLabel()
var
	string sFile,
	string sKey,
	string sSection,
	string sLabel
	
let sKey=GetCustomLabelKey()
let sFile=GetCustomLabelFileName()
let sSection=GetCustomLabelSectionName()
if sKey==cscNull then
	return cscNull
endIf
;first check doc specific section, if empty, check general section
let sLabel=iniReadString(sSection,sKey,cscNull,sFile)
if (sLabel!=cscNull) then
	return sLabel
endIf
return iniReadString(scCustomLabelSection,sKey,cscNull,sFile)
endFunction

void function dlgCustomLabel()
If !AreUtilitiesAllowed() then
	return
endIf
var string sFile = GetCustomLabelFileName()
var string sKey = GetCustomLabelKey()
if sKey==cscNull then
	SayMessage(OT_ERROR, cmsgCustomLabelError_L, cmsgCustomLabelError_S)
	return
endIf
if ShowEditLabelDialog() then
	GrantAppContainerAccess(FindJAWSPersonalizedSettingsFile(sFile, TRUE))
	pause()
	Refresh()
endIf
endFunction

void function DeleteCustomLabel()
var
	string sLabel,
	string sKey,
	string sFile,
	string sSection,
	int nResult
	
let sLabel=GetCustomLabel()
if sLabel==cscNull then
	SayMessage(OT_ERROR,cmsgDeleteLabelErrorMsg_L,cmsgDeleteLabelErrorMsg_S);
	return
endIf
let sFile=GetCustomLabelFileName()
let sKey=GetCustomLabelKey()
let sSection=GetCustomLabelSectionName()
if ExMessageBox (sLabel, scDeleteLabelTitle, MB_OKCANCEL)==IDOK then
	IniRemoveKey (sSection, sKey, sFile);doc specific
	IniRemoveKey (scCustomLabelSection, sKey, sFile);general
	iniFlush(sFile)
	GrantAppContainerAccess(FindJAWSPersonalizedSettingsFile(sFile, TRUE))
	Pause()
	refresh()
endIf
endFunction

void function DeleteAllCustomLabels()
var
	string sFile,
	string sSection,
	int nResult
let sFile=GetCustomLabelFileName()
let sSection=getCustomLabelSectionName()
if ExMessageBox (scDeleteAllLabelsMsg, scDeleteAllLabelsTitle, MB_OKCANCEL)==IDOK then
	IniRemoveSection (sSection, sFile)
	IniRemoveSection (scCustomLabelSection, sFile)
	iniFlush(sFile)
	GrantAppContainerAccess(FindJAWSPersonalizedSettingsFile(sFile, TRUE))
	Pause()
	refresh()
endIf
endFunction

int function HasCustomLabel()
return GetCustomLabel()!=cscNull
endFunction

Int Function ShouldShowCustomSummary(handle hwnd)
var
	string sClass,
	string sParentClass,
	string sRealClass

if !hwnd then
	return false
endIf
let sClass=getWindowClass(hwnd)
let sParentClass=GetWindowClass(GetParent(hwnd))
let sRealClass=GetWindowClass(GetRealWindow(hwnd))

if sClass==scMSExcelWorkSheetClass then
	return true
else
	return false
endIf
endFunction

Void Function CustomSummary(string sApp)
If sApp==sAppNameExcel then
	ViewCustomSummary()
EndIf
EndFunction

void function SetCustomLabel(string label, string file, string section, string key)
builtin::SetCustomLabel(label, file, section, key)
GrantAppContainerAccess(FindJAWSPersonalizedSettingsFile(file, TRUE))
Pause()
refresh()
endFunction
