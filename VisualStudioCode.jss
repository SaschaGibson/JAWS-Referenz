; Copyright 2025 Freedom Scientific, Inc.

include "hjconst.jsh"
include "MSAAConst.jsh"
include "VisualStudioCode.jsm"
include "common.jsm"
use "Chrome.jsb"

const
	SpeakLineNumberDelay = 200;this should be 100 or greater
	
globals
	string gsCurrentLineNumber
	
script scriptFileName()
scriptAndAppNames(cmsgVisualStudioCodeAppName)
endScript

Void Function HandleUnknownAncestor (int level, int focusType, int pageIsChanging)
if level == 3
&& (GetObjectRole (level) == ROLE_SYSTEM_STATUSBAR)
	IndicateControlType (WT_STATUSBAR, GetObjectName (false, level))
	return
endIf
HandleUnknownAncestor (level, focusType, pageIsChanging)
EndFunction

int Function ShouldSayAncestorAtLevel(int level, int type, int parentType, int focusRole, int focusType)
if type >= WT_REGION && TYPE <= WT_GENERIC_REGION
	; There are often regions in the focus hierarchy but since VSCode
	; works best with the VPC disabled there's no point in announcing
	; them.
	RETURN FALSE
EndIf
return ShouldSayAncestorAtLevel(level, type, parentType, focusRole, focusType)
EndFunction

Int Function ShouldSpeakItemAtLevel (int level, int type, int parentType, int focusRole, int focusType)

; There are often regions in the focus hierarchy but since VSCode
; works best with the VPC disabled there's no point in announcing
; them.
if type >= WT_REGION && TYPE <= WT_GENERIC_REGION
RETURN FALSE
EndIf
return ShouldSpeakItemAtLevel (level, type, parentType, focusRole, focusType)
EndFunction

int function ShouldUseDoSayObjectFromLevel( handle focusWindow, handle prevWindow )
if DialogActive ()
&& !IsOnWebPage()
&& !UserBufferIsActive ()
	return false
endIf
return ShouldUseDoSayObjectFromLevel( focusWindow, prevWindow )
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName, int drawHighLight)
if !nLevel
&& GetObjectRole (nLevel) == ROLE_SYSTEM_STATUSBAR
	IndicateControlType (WT_STATUSBAR, GetObjectName (false, nLevel))
	return
endIf
SayObjectTypeAndText(nLevel, includeContainerName, drawHighLight)
EndFunction

string function GetBottomLineOfWindow()
var
	object XMLDomDoc = GetFSXMLDomDoc (),
	string sItemSpec = "//StatusBar//Div[starts-with(@id, 'status.editor.')]",;these are the items directorly related to the editor, read them first
	object oNodes = XMLDomDoc.selectNodes(sItemSpec),
	object oNode,
	string sText
ForEach oNode in oNodes
	if oNode.attributes.GetNamedItem("id").nodeValue == "status.editor.selection"
		;This is the line and column number
		;It is one of the most needed items on the status bar, add it to the beginning
		sText = StringConcatenate (oNode.attributes.GetNamedItem("fsPrompt").nodeValue, cmsgCommaSpaceSeparator, sText)
	else
		;add to the end
		sText = StringConcatenate (sText, oNode.attributes.GetNamedItem("fsPrompt").nodeValue, cmsgCommaSpaceSeparator)
	endIf
EndForEach
sItemSpec = "//StatusBar//Div[not(starts-with(@id, 'status.editor.'))]";these are the items not directly related to the editor, read them last
oNodes = XMLDomDoc.selectNodes(sItemSpec)
ForEach oNode in oNodes
	sText = StringConcatenate (sText, oNode.attributes.GetNamedItem("fsPrompt").nodeValue, cmsgCommaSpaceSeparator)
EndForEach
if !sText
	return GetBottomLineOfWindow()
endIf
return stringChopRight (sText, StringLength(cmsgCommaSpaceSeparator))
endFunction

object function GetFSXMLDomDoc()
var
	int iUseVPC = GetJCFOption (OPT_VIRTUAL_PC_CURSOR)
if IsVirtualPCCursor ()
|| iUseVPC != 3
	return GetFSXMLDomDoc()
endIf
var
	object XMLDomDoc
SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 0)
XMLDomDoc = GetFSXMLDomDoc()
SetJCFOption (OPT_VIRTUAL_PC_CURSOR, iUseVPC)
return XMLDomDoc
endFunction

string function GetLineNumber()
if gsCurrentLineNumber return gsCurrentLineNumber endIf
var
	object XMLDomDoc = GetFSXMLDomDoc (),
	string sItemSpec = "//StatusBar//Div[@id = 'status.editor.selection']",
	object oNode = XMLDomDoc.selectSingleNode(sItemSpec),
	string sText = oNode.attributes.GetNamedItem("fsPrompt").nodeValue,
	string sLine = StringSegment (sText, ",", 1)
gsCurrentLineNumber = StringSegment (sLine, cscSpace, -1)
return gsCurrentLineNumber
endFunction

int function GetDocumentProperties(string ByRef sTitle, string ByRef sPageName,
string ByRef sPageNumber, string ByRef sTotalPages, string ByRef sLineNumber,
string ByRef sCharacterPosition, string ByRef sColumnNumber, string ByRef sTotalColumns )
var int iResult = GetDocumentProperties(sTitle, sPageName, sPageNumber, sTotalPages, sLineNumber, sCharacterPosition, sColumnNumber, sTotalColumns )
if !sLineNumber
	sLineNumber = GetLineNumber()
EndIf
return iResult
EndFunction

Script ToggleSpeakLineNumbers()
var
	string path = StringConcatenate(GetJAWSSettingsDirectory (), cScDoubleBackSlash, GetActiveConfiguration (false), FileExt_JCF),
	int iSpeakLineNumbers = GetNonJCFOption("SpeakLineNumbers")
if IniWriteInteger (section_NonJCFOptions, "SpeakLineNumbers", !iSpeakLineNumbers, path)
	if iSpeakLineNumbers
		Say (cmsgOff, OT_STATUS)
	else
		Say (cmsgOn, OT_STATUS)
	endIf
endIf
EndScript

void function SpeakLineNumber()
Say (GetLineNumber(), OT_LINE)
endFunction

int function ShouldSpeakLineNumber()
return GetNonJCFOption("SpeakLineNumbers")
&& IsPCCursor ()
&& !IsVirtualPCCursor ()
&& !IsKeyWaiting ()
endFunction

int function ShouldShowLineNumberInStatusCells()
return BrailleInUse ()
&& GetNonJCFOption("ShowLineNumberInStatusCells")
&& !(GetDefaultJCFOption(OPT_BRL_SHOW_TIME_IN_STATUS_CELLS)&scTmOn)
&& IsPCCursor ()
&& !IsVirtualPCCursor ()
&& !IsKeyWaiting ()
endFunction

int function GetLineNumberDelay(int movementUnit)
if movementUnit == Unit_Page_Next
|| movementUnit == Unit_Page_Prior
	;There has already been a delay of 100 in SayPageFromCaretMovedEvent
	return (SpeakLineNumberDelay - 100)
elIf movementUnit == Unit_Line_First
|| movementUnit == Unit_Line_Last
	;There has already been a delay of 100 in SayFirstOrLastLineFromCaretMovedEvent
	return (SpeakLineNumberDelay - 100)
endIf
return SpeakLineNumberDelay
endFunction

void function SayLine(optional Int iDrawHighlights, int bSayingLineAfterMovement)
var int iDelay
if bSayingLineAfterMovement
&& ShouldSpeakLineNumber()
	gsCurrentLineNumber = cscNull
	iDelay = GetLineNumberDelay(bSayingLineAfterMovement)
	PauseFor(iDelay)
	SpeakLineNumber()
endIf
SayLine(iDrawHighlights, bSayingLineAfterMovement)
EndFunction

int function BrailleBuildStatus ()
var
	string sLineNumber
if ShouldShowLineNumberInStatusCells()
	sLineNumber = GetLineNumber()
	if !StringIsBlank(sLineNumber)
		BrailleSetStatusCells(StringRight(FormatString(msgBrailleStatusLineNumber,sLineNumber), BrailleGetStatusCellCount ()))
		return true
	endIf
endIf
Return BrailleBuildStatus ()
EndFunction

void function ScheduledBrailleRefresh()
gsCurrentLineNumber = cscNull
BrailleRefresh ()
endFunction

int function ShouldScheduleBrlLineNumberRefresh(int movementUnit, int source)
if !ShouldShowLineNumberInStatusCells() return false endIf
if ShouldSpeakLineNumber()
if source == InputSource_Braille return true endIf
	;The global will be cleared and updated via SayLine for the following movementUnit values, so no need for braille refresh
	if movementUnit == Unit_Line_Next
	|| movementUnit == Unit_Line_Prior
	|| movementUnit == Unit_Page_Next
	|| movementUnit == Unit_Page_Prior
	|| movementUnit == Unit_Line_Last
	|| movementUnit == Unit_Line_First
		return false
	endIf
endIf
return true
endFunction

void function CaretMovedEvent( int movementUnit, optional int source)
CaretMovedEvent( movementUnit, source)
if ShouldScheduleBrlLineNumberRefresh(movementUnit, source)
	ScheduleFunction ("ScheduledBrailleRefresh", 2, true)
endIf
endFunction
