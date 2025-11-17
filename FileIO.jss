;Copyright 1995-2015 Freedom Scientific, Inc.
; JAWS 13.00.xx
; CollectionsToFile and FileToCollection functions.
;Assumes your collections are formed in the following manner:
;Mother = file.
;Daughters = ini-style secrions
;grand-daughters = key,item pairs.
;Example: File.Options.Setting=value
;To use in your local source, use the use and import clauses:
;e.g. use "FileIO.jsb"
; import "FileIO.jsd" ; where FileIO is levels down in the scope chain, Import from topmost file where functions are used to avoid compile errors.
;Additionally, basic JAWS Script wrappers for MSXML functions that would otherwise be redundant in your script code,
;using the MSXML objects:

include "hjconst.jsh";
include "common.jsm" ; only strings used here are for item separation: use your own code for output to user.

string function strCast (variant v)
return v
endFunction


int function isAlpha (variant test)
var string alphaChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
return StringContainsChars (alphachars, test)
endFunction

int function collectionItemsCount (collection list)
var int i=0, string item
forEach item in list
	i = i+1
endForEach
return i
endFunction

collection function iniReadToCollection (string strFile, int iLocationCode)
;iLocation = FLOC_ constants
var
	int i=1, int j=1, int iMax, int iMax2,
	collection sectionList,
	collection section,
	string sSecNames,
	string sKeyNames, ; IniReadSectionKeysEx (section, iLocationCode, strFile)
	string sItemName,
	string sKeyName,
	variant keyValue ; could be int or string, read as string to verify but send to collection as is.
;sayString (strFile)
sSecNames = IniReadSectionNamesEx (iLocationCode, strFile)
iMax = stringSegmentCount (sSecNames, cscListSeparator)
;sayInteger (iMax)
if (!iMax); invalid ini file or no file:
	return null ()
endIf
sectionList = new collection;
for i=1 to iMax
	section = new collection;
	sItemName = stringSegment (sSecNames, cscListSeparator, i)
	;sayString (sItemName)
	;read the keys
	sKeyNames = IniReadSectionKeysEx (sItemName, iLocationCode, strFile)
	;sayString (sKeyNames)
	iMax2 = stringSegmentCount (sKeyNames, cscListSeparator)
	for j=1 to iMax2
		sKeyName = stringSegment (sKeyNames, cscListSeparator, j)
		;sayString (sKeyName)
		keyValue = IniReadStringEx (sItemName, sKeyName, null(), iLocationCode, strFile)
		;sayString(keyValue)
		if (! isAlpha (keyValue)
		&& keyValue != cscNull)
			keyValue = stringToInt (keyValue)
		endIf
		;sayInteger (keyValue)
		section[sKeyName] = keyValue
	endFor
	;add section to parent collection:
	sectionList[sItemName] = section
endFor
return sectionList
endFunction

collection function iniReadSectionToCollection (string SectionName, string strFile, int iLocationCode)
;iLocation = FLOC_ constants
var
	int i=1, int iMax,
	collection section,
	string sKeyNames, ; IniReadSectionKeysEx (section, iLocationCode, strFile)
	string sItemName,
	string sKeyName,
	variant keyValue ; could be int or string, read as string to verify but send to collection as is.
;sayString (strFile)
section = new collection;
;sayString (sItemName)
;read the keys
sKeyNames = IniReadSectionKeysEx (SectionName, iLocationCode, strFile)
if ! sKeyNames then
	return null ()
endIf
;sayString (sKeyNames)
iMax = stringSegmentCount (sKeyNames, cscListSeparator)
for i=1 to iMax
	sKeyName = stringSegment (sKeyNames, cscListSeparator, i)
	;sayString (sKeyName)
	keyValue = IniReadStringEx (SectionName, sKeyName, null(), iLocationCode, strFile)
	;sayString(keyValue)
	if (! isAlpha (keyValue)
	&& keyValue != cscNull)
		keyValue = stringToInt (keyValue)
	endIf
	;sayInteger (keyValue)
	section[sKeyName] = keyValue
endFor
return section
endFunction

collection function iniReadAndLayerSectionToCollection (collection byRef DefaultCollection,
	string SectionName, string strFile, int iLocationCode)
;iLocation = FLOC_ constants
if !DefaultCollection
	return iniReadSectionToCollection (SectionName, strFile, iLocationCode)
endIf
var
	int i=1, int iMax,
	string sKeyNames, ; IniReadSectionKeysEx (section, iLocationCode, strFile)
	string sItemName,
	string sKeyName,
	variant keyValue ; could be int or string, read as string to verify but send to collection as is.
;read the keys
sKeyNames = IniReadSectionKeysEx (SectionName, iLocationCode, strFile)
if ! sKeyNames then
	return DefaultCollection
endIf
;sayString (sKeyNames)
iMax = stringSegmentCount (sKeyNames, cscListSeparator)
for i=1 to iMax
	sKeyName = stringSegment (sKeyNames, cscListSeparator, i)
	;sayString (sKeyName)
	keyValue = IniReadStringEx (SectionName, sKeyName, null(), iLocationCode, strFile)
	;sayString(keyValue)
	if (! isAlpha (keyValue)
	&& keyValue != cscNull)
		keyValue = stringToInt (keyValue)
	endIf
	;sayInteger (keyValue)
	DefaultCollection[sKeyName] = keyValue
endFor
return DefaultCollection
endFunction
collection function settingReadToCollection (string strFile, int nFileType, int nReadSource)
;iLocation = FLOC_ constants
var
	int i=1, int j=1, int iMax, int iMax2,
	collection sectionList,
	collection section,
	string sSecNames,
	string sKeyNames, ; IniReadSectionKeysEx (section, iLocationCode, strFile)
	string sItemName,
	string sKeyName,
	variant keyValue ; could be int or string, read as string to verify but send to collection as is.
;sayString (strFile)
sSecNames = IniReadSectionNames (strFile)
iMax = stringSegmentCount (sSecNames, cscListSeparator)
;sayInteger (iMax)
if (!iMax); invalid ini file or no file:
	return null ()
endIf
sectionList = new collection;
for i=1 to iMax
	section = new collection;
	sItemName = stringSegment (sSecNames, cscListSeparator, i)
	;sayString (sItemName)
	;read the keys
	sKeyNames = IniReadSectionKeys (sItemName, strFile)
	;sayString (sKeyNames)
	iMax2 = stringSegmentCount (sKeyNames, cscListSeparator)
	for j=1 to iMax2
		sKeyName = stringSegment (sKeyNames, cscListSeparator, j)
		;sayString (sKeyName)
		keyValue = readSettingString (sItemName, sKeyName, null(), nFileType, nReadSource, strFile)
		;sayString(keyValue)
		if (! isAlpha (keyValue)
		&& keyValue != cscNull)
			keyValue = stringToInt (keyValue)
		endIf
		;sayInteger (keyValue)
		section[sKeyName] = keyValue
	endFor
	;add section to parent collection:
	sectionList[sItemName] = section
endFor
return sectionList
endFunction

collection function settingReadSectionToCollection (string SectionName, string strFile, int nFileType, int nReadSource)
;iLocation = FLOC_ constants
var
	int i=1, int iMax,
	collection section,
	string sKeyNames, ; IniReadSectionKeysEx (section, iLocationCode, strFile)
	string sItemName,
	string sKeyName,
	variant keyValue ; could be int or string, read as string to verify but send to collection as is.
;sayString (strFile)
section = new collection;
;sayString (sItemName)
;read the keys
sKeyNames = IniReadSectionKeys (SectionName, strFile)
;sayString (sKeyNames)
iMax = stringSegmentCount (sKeyNames, cscListSeparator)
for i=1 to iMax
	sKeyName = stringSegment (sKeyNames, cscListSeparator, i)
	;sayString (sKeyName)
	keyValue = readSettingString (SectionName, sKeyName, null(), nFileType, nReadSource, strFile)
	;sayString(keyValue)
	if (! isAlpha (keyValue)
	&& keyValue != cscNull)
		keyValue = stringToInt (keyValue)
	endIf
	;sayInteger (keyValue)
	section[sKeyName] = keyValue
endFor
return section
endFunction

int function iniWriteFromCollection (collection sectionList, string strFile, int iLocationCode)
var
	int bSettingSaved,
	int bTotalSettingsSaved,
	collection section,
	collection keys,
	string sSecName,
	string sectionData,
	string key,
	string value ; could be int or string, read as string to verify but send to collection as is.
section = new collection;
forEach sSecName in sectionList
	section = sectionList[sSecName]
	sectionData = "";
	forEach key in section
		value = section[key]
		sectionData = sectionData+LIST_ITEM_SEPARATOR+key+"="+value
	endForEach
	if (! stringIsBlank (sectionData) && ! stringIsBlank (sSecName))
		sectionData = sectionData +LIST_ITEM_SEPARATOR;Ensure to terminate with double bell.
		bSettingSaved = IniWriteSectionEX (sSecName, sectionData, iLocationCode, strFile, TRUE)
		bTotalSettingsSaved = bTotalSettingsSaved || bSettingSaved
		;iniFlushEX (iLocationCode, strFile)
		delay (2)
	endIf
endForEach
return bSettingSaved
endFunction

int function iniWriteSectionFromCollection (collection section, string sectionName, string strFile, int iLocationCode)
var
	int bSettingSaved,
	collection keys,
	string sectionData,
	string key,
	string value ; could be int or string, read as string to verify but send to collection as is.
sectionData = "";
forEach key in section
	value = section[key]
	sectionData = sectionData+LIST_ITEM_SEPARATOR+key+"="+value
endForEach
if (! stringIsBlank (sectionData) && ! stringIsBlank (sectionName))
	sectionData = sectionData +LIST_ITEM_SEPARATOR;Ensure to terminate with double bell.
	bSettingSaved = IniWriteSectionEX (sectionName, sectionData, iLocationCode, strFile, TRUE)
	iniFlushEX (iLocationCode, strFile)
endIf
return bSettingSaved
endFunction

int function settingWriteFromCollection (collection sectionList, string strFile, int nFileType, int nWriteDestination)
var
	int bSettingSaved,
	int bTotalSettingsSaved,
	collection section,
	collection keys,
	string sSecName,
	string sectionData,
	string key,
	string value ; could be int or string, read as string to verify but send to collection as is.
section = new collection;
forEach sSecName in sectionList
	section = sectionList[sSecName]
	sectionData = "";
	forEach key in section
		value = section[key]
		bSettingSaved = writeSettingString (sSecName, key, value, nFileType, nWriteDestination, strFile)
		bTotalSettingsSaved = bTotalSettingsSaved || bSettingSaved
	endForEach
endForEach
return bTotalSettingsSaved
endFunction

int function settingWriteSectionFromCollection (collection section, string sectionName, string strFile, int nFileType, int nWriteDestination)
var
	int bSettingSaved, int bTotalSettingsSaved,
	collection keys,
	string sectionData,
	string key,
	string value ; could be int or string, read as string to verify but send to collection as is.
section = new collection;
sectionData = "";
forEach key in section
	value = section[key]
	bSettingSaved = writeSettingString (sectionName, key, value, nFileType, nWriteDestination, strFile)
	bTotalSettingsSaved = bTotalSettingsSaved || bSettingSaved
endForEach
return bTotalSettingsSaved
endFunction

object function xmlGetXMLObjectFromXMLString (string sXMLString, optional int bPreserveWhiteSpace)
var object msxml = CreateObject("msxml2.DOMDocument.6.0")
if (!msxml)
	return null ()
EndIf
msxml.async = false;
msxml.resolveExternals = false;
msxml.preserveWhiteSpace = bPreserveWhiteSpace
msxml.loadXML (sXMLString)
return msxml
endFunction

