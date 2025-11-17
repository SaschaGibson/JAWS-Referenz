include "HJConst.jsh"
include "HJGlobal.jsh"
include "common.jsm"
include "uo.jsh"

globals
	variantArray UOSayAllSchemesData

void function InitUOSayAllSchemesData()
var
	string SayAllSchemesKeyValue,
	string sFile,
	string sName,
	int i,
	collection scheme
let SayAllSchemesKeyValue = IniReadString(section_options,hKey_SayAllSchemes,
	IniReadString(section_options,hKey_SayAllSchemes,cscNull,file_default_jcf),
	GetActiveConfiguration()+cScPeriod+jcfFileExt)
let uoSayAllSchemeCount = StringSegmentCount(SayAllSchemesKeyValue, uopipe)
let UOSayAllSchemesData = new variantArray[uoSayAllSchemeCount]
For i = 1 to uoSayAllSchemeCount
	let scheme = new collection
	let sFile = StringSegment(SayAllSchemesKeyValue, uoPipe, i)
	let scheme.file = sFile
	let sName = IniReadString(section_information, hKey_title, sFile, sFile+cScPeriod+smfFileExt)
	let scheme.title = sName
	let UOSayAllSchemesData[i] = scheme
EndFor
EndFunction

int function GetSchemePositionInUOSayAllSchemesData(string sScheme)
var
	int i
for i = 1 to uoSayAllSchemeCount
	if StringCompare(UOSayAllSchemesData[i].file,sScheme) == 0 then
		return i
	EndIf
EndFor
return 0
EndFunction

string function GetSchemeFileNameInUOSayAllSchemesData(int index)
return UOSayAllSchemesData[index].file
EndFunction

string function LookupSchemeTitleInUOSayAllSchemesData(string sScheme)
var
	int i
for i = 1 to uoSayAllSchemeCount
	if StringCompare(UOSayAllSchemesData[i].file,sScheme) == 0 then
		return UOSayAllSchemesData[i].title
	EndIf
EndFor
return cscNull
EndFunction

string  function GetCurrentSayAllScheme()
if GDocumentSayAllScheme then
	;A scheme was specified in personalized settings
	return GDocumentSayAllScheme
else
	return IniReadString(section_options,hKey_SayAllScheme,
		IniReadString(section_options,hKey_SayAllScheme,cscNull,file_default_jcf),
		GetActiveConfiguration()+cScPeriod+jcfFileExt)
EndIf
EndFunction
