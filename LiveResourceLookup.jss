; Copyright 1995-2015 by Freedom Scientific, Inc.
;Live Resource Lookup dependency for Default.

include "hjConst.jsh"
include "hjGlobal.jsh"
include "common.jsm"

; message for string merging...
Messages
@MergeNodeContent
%1
%2
@@
@MSG_WrapHTML
<html>
<head>
<title>
%1
</title>
</head>
<body>
%2
</body>
</html>
@@
EndMessages

Int Function StringContainsHTML (string sString)
If StringContains (StringLower (sString), "<html>")
&& StringContains (StringLower (sString), "</html>")
&& StringContains (StringLower (sString), "<head>")
&& StringContains (StringLower (sString), "</head>")
&& StringContains (StringLower (sString), "<body>")
&& StringContains (StringLower (sString), "</body>")
	Return (TRUE)
EndIf
Return (FALSE)
EndFunction

String Function StringGetXMLNodeContents (string sXMLDoc, string sNodeName)
Var
	Object oMSXML = CreateObject ("msxml2.DOMDocument.6.0"),
	Object oResults,
	Object oNode,
	Object oAttributes,
	String sContents,
	String sRemove

If Not oMSXML
	; no msxml present...
	Return
EndIf
oMSXML.async = FALSE
oMSXML.resolveExternals = FALSE
var int xmlNSPosition = StringContains (sXMLDoc, "xmlns=\"")
if (xmlNSPosition > 2) Then
	sRemove = StringChopLeft (sXMLDoc, xmlNSPosition - 2)
	sRemove = StringLeft (sRemove, StringContains (sRemove, "\">"))
endIf
sXMLDoc = StringReplaceSubstrings (sXMLDoc, sRemove, cScNull)
sXMLDoc = StringReplaceSubstrings (sXMLDoc, " xmlns=\"\"", cScNull)
oMSXML.loadXML(sXMLDoc)
oResults = oMSXML.SelectNodes (sNodeName)
If Not oResults
	; no appropriate node found...
	Return
EndIf
ForEach oNode In oResults
		sContents = FormatString (MergeNodeContent, sContents, oNode.Text)
EndForEach
Return (sContents)
EndFunction

int Function IterateLookupModules (string byRef szModuleNames, string byRef szRuleSets, string byRef szPrimary)
var
	int continue,
	int count,
	String strLookupModule,
	String strRuleSet
;while (continue)
	;SayString(strLookupModule + "-" + strRuleSet)
	;let continue = LRL_GetNextLookupModule(strLookupModule, strRuleSet)
;EndWhile
;For indexing primary:
if !LRL_GetPrimaryLookupModule (strLookupModule, strRuleSet) then
	return 0
endif
if ! stringIsBlank (strRuleSet) then
	let szPrimary = strRuleSet
else
	let szPrimary = strLookupModule
endIf
;now iterate for list building.
let continue = LRL_GetFirstLookupModule(strLookupModule, strRuleSet)
while (continue)
	;SayString(strLookupModule + "-" + strRuleSet);debug
	let szModuleNames = (szModuleNames+strLookupModule)
	let szRuleSets = (szRuleSets+strRuleSet)
	let szModuleNames = (szModuleNames+LIST_ITEM_SEPARATOR)
	let szRuleSets = (szRuleSets+LIST_ITEM_SEPARATOR)
	;update count before continue goes out of range
	let continue = LRL_GetNextLookupModule(strLookupModule, strRuleSet)
	let count = count+1
EndWhile
return count;
EndFunction

string function ConvertLookupModuleDataToList (int nSize, string strModules, string strRuleSets, string strPrimary)
;sayString ("Size is: "+intToString(nSize))
;flip the rule set and module info, as most of our default ones use the FS Lookup,
;and users can more easily see the list:
var
	int idx,
	string strItem,
	string strListItems
let idx = 1
;Primary goes at top
if ! stringISBlank (strPrimary) then
	;use of explicit escape keeps the initial white space
	;so we get sort order.
	let strListItems = "\001"+strPrimary+cscSpace+cmsgPrimaryLookup
endIf
while (idx <= nSize)
	let strItem = stringSegment (strRuleSets, LIST_ITEM_SEPARATOR, idx)
	if stringCompare (strItem, strPrimary) != 0 then
		if ! stringIsBlank (strListItems) then
			let strListItems = (strListItems+LIST_ITEM_SEPARATOR)
		endIf
		let strListItems = strListItems + strItem
	endIf
	let idx = (idx+1)
endWhile
return strListItems
endFunction

string function StripTrailingPunctuationFrom (string strQuery)
if stringIsBlank (strQuery) return strQuery endIf
var int continue, string punctuation, string tmp, string result = StringTrimTrailingBlanks (strQuery)
punctuation = ",.!?<>;:[]{}()^&$#!/~'\"|\\";
; include a space so that running spaces with punctuation won't block queries:
punctuation = punctuation+cscSpace+cscBufferNewLine
tmp = stringRight (result, 1)
continue = stringContains (punctuation, tmp)
while (continue && ! StringIsBlank (result))
	result = stringChopRight (result, 1)
	tmp = stringRight (result, 1)
	continue = stringContains (punctuation, tmp)
endWhile
return result
endFunction

void function RunLookupModuleQuery (string Query,optional  string sRuleSet, string sModule, string strError)
var
	int invoke,
	int bLookForPrimary,
	int nResult,
	string sDefaultModule,
	string sDefaultRule,
	String strLookupModule,
	String strRuleSet,
	string strQuery = StripTrailingPunctuationFrom (query),
	string sResults,
	String sRemove,
	String sTitle
;let strQuery = (stringTrimLeadingBlanks (StringTrimTrailingBlanks (strQuery)))
;Let strQuery = (strQuery+"\nEOF")
;AppendToScriptCallStackLog ()
;not only do we need defaults, but the following function is going to cause Lookup Modules to initialize properly.
;Here we need the parameters, but if you did not, just pass nulls - for sake of initt.
if !LRL_GetPrimaryLookupModule (sDefaultModule, sDefaultRule) then ;in case a param is blank:
	return
endif
UserBufferClearResultsViewer ()
let bLookForPrimary = StringIsBlank (sModule) && StringIsBlank (sRuleSet)
if bLookForPrimary then
	Let strLookupModule = sDefaultModule;
	let strRuleSet = sDefaultRule
	;sayString (strLookupModule+" -> "+strRuleSet);debug
else
	if stringIsBlank (sModule) then
		let strLookupModule = csFSLookupModule
		;AppendToScriptCallStackLogEx ("Adding module: "+strLookupModule)
	else
		Let strLookupModule = sModule
		;AppendToScriptCallStackLogEx ("strLookup module is: "+strLookupModule)
	endIf
	if sRuleSet then
		let strRuleSet = sRuleSet
	endIf
endIf
;if (nResult == TRUE) then
;at least have a module - not all have rule sets:
if ! stringIsBlank (strLookupModule) then
	;AppendToScriptCallStackLogEx ("The Lookup Module is " + strLookupModule);debug
	;AppendToScriptCallStackLogEx ("The Rule set for " + strLookupModule + " is " + strRuleSet);debug
	if ! stringIsBlank (strRuleSet) then
		sTitle = FormatString (cmsgTitleTemplate, strRuleSet)
	else ; This is a lookup module with no rule sets, e.g. a stand-alone dll.
		sTitle = FormatString (cmsgTitleTemplate, strLookupModule)
	endIf
	UpdateResultsViewerTitle (sTitle)
	;AppendToScriptCallstackLogEX ("Module in use is: "+strLookupModule)
	;AppendToScriptCallstackLogEX ("Ruleset in use is: "+strRuleset)
	;AppendToScriptCallstackLogEX ("Query in use is: "+strQuery)
	let invoke = LRL_Invoke (strLookupModule, strRuleSet, strQuery, "", NO_OFFSET, sResults, "")
	;clean up string:
	;let sResults = (stringTrimLeadingBlanks (StringTrimTrailingBlanks (sResults)))
	;0 is no results, less than 0 is reason code:
	;AppendToScriptCallStackLog (); debug: tells file / function
	;appendToScriptCallStackLogEX ("Module is: "+strLookupModule)
	;appendToScriptCallStackLogEX ("Rule set is: "+strRuleSet)
	;AppendToScriptCallStackLogEX ("Query is: "+strQuery)
	;AppendToScriptCallStackLogEx ("invoke : "+intToString (invoke));debug
	;AppendToScriptCallStackLogEx ("Blank string: "+ intToString (StringIsBlank (sResults)));debug;debug
	let invoke = (getErrorCodeFromHResult (invoke))
	if invoke != RESEARCHIT_E_SUCCESS
	|| StringIsBlank (sResults)
	|| (StringContainsHTML (sResults)
	&& StringIsBlank (StringGetXMLNodeContents (sResults, "html/body")))
		If invoke == RESEARCHIT_E_REQUEST_TIMEOUT
			sResults = formatString (cmsgQueryTimedOut, strRuleSet, strQuery)+cscBufferNewLine
		else
			sResults = formatString (cmsgQueryError, strRuleSet, strQuery)+cscBufferNewLine
		endIf
	Else
		If Not StringContainsHTML (sResults)
			sResults = StringReplaceSubstrings (sResults, cScBufferNewLine, "<br>")
			;note that we use null for a title,
			;since we don't want the title bar text repeated in the output window:
			sResults = FormatString (MSG_WrapHTML, cscNull,sResults)
		endIf
	EndIf
	UserBufferAddTextResultsViewer (sResults)
	UserBufferAddTextResultsViewer (cMsgResultsViewerExit)
	Delay (1)
	if ShouldSayAllOnDocumentLoad()
		JAWSTopOfFile ()
		SayAll ()
	endIf
else
 	;AppendToScriptCallStackLog (); debug: tells file / function
 	;AppendToScriptCallStackLogEX("LRL_GetPrimaryLookupModule fail")
	if bLookForPrimary then
		sayMessage (OT_ERROR, cmsgPrimaryLookupNotFound)
	else
		sayMessage (OT_ERROR, cmsgLookupNotFound)
	endIf
endIf
endFunction

void Function RunLookupModuleQueryUsingListOfModules (string Query)
var
	int index,
	int nPrimary,
	int nListSize,
	string strQuery = StripTrailingPunctuationFrom (query),
	string stmp,
	string szPrimary,
	string szModuleNames,
	string szRuleSets,
	string strList,
	string sModule,
	string sRuleSet
let nListSize = IterateLookupModules (szModuleNames, szRuleSets, szPrimary)
let strList = ConvertLookupModuleDataToList (nListSize, szModuleNames, szRuleSets, szPrimary)
if stringRight (strList, 1) != LIST_ITEM_SEPARATOR then
	let strList = strList+LIST_ITEM_SEPARATOR
endIf
let index = dlgSelectItemInList (strList, cwn_QueriesList, TRUE)
delay (2)
if (index == 0) then
	Return
endIf
;now set index to index of rule set name
let sTmp = (stringSegment (strList, LIST_ITEM_SEPARATOR, index))
if StringContains (sTmp, cmsgPrimaryLookup) then
	Let sTmp = StringChopLeft (sTmp, 1)
	Let sTmp = StringChopRight (sTmp, stringLength (cmsgPrimaryLookup)+1)
endIf
let index = stringSegmentIndex (szRuleSets, LIST_ITEM_SEPARATOR, sTmp, TRUE)
let sModule = stringSegment (szModuleNames, LIST_ITEM_SEPARATOR, index)
let sRuleSet = stringSegment (szRuleSets, LIST_ITEM_SEPARATOR, index)
RunLookupModuleQuery (strQuery, sRuleSet, sModule, "")
endFunction

void Function RunLookupModuleQueryUsingLRL_Dialog (string strIn)
var
	int bRunQuery,
	string strModuleName,
	string strRuleSet,
	string strPhrase
;all params passed to LRL_Dialog are in.
let strPhrase = strIn
let bRunQuery = LRL_Dialog (strModuleName, strRuleSet, strPhrase)
delay (2)
if bRunQuery then
	RunLookupModuleQuery (strPhrase, strRuleSet, strModuleName, "")
endIf
endFunction

int function getErrorCodeFromHResult (int HRESULT)
var
	int invoke
if HRESULT!= 0 then
	let invoke = (2144731136+HRESULT)
endIf
return invoke
endFunction


void Function DebugLookupModuleQueryUsingListOfModules ()
var
	int index,
	int nListSize,
	int invoke,
	string stmp,
	string szModuleNames,
	string szRuleSets,
	string szPrimary,
	string strList,
	string sModule,
	string sRuleSet,
	string sError,
	string strQuery,
	string strInvokeReturn
let nListSize = IterateLookupModules (szModuleNames, szRuleSets, szPrimary)
let strList = ConvertLookupModuleDataToList (nListSize, szModuleNames, szRuleSets, szPrimary)
if stringRight (strList, 1) != LIST_ITEM_SEPARATOR then
	let strList = strList+LIST_ITEM_SEPARATOR
endIf
let index = dlgSelectItemInList (strList, cwn_Query_List_Debug_title, TRUE, 1)
delay (2)
if (index == 0) then
	Return
endIf
inputBox (cwn_Query_Input_Debug_Prompt, cwn_Query_Input_Debug__Title, strQuery)
delay (2)
let strQuery = StripTrailingPunctuationFrom (strQuery)
let strQuery = stringTrimLeadingBlanks (stringTrimTrailingBlanks (strQuery))
;now set index to index of rule set name
let sTmp = (stringSegment (strList, LIST_ITEM_SEPARATOR, index))
if StringContains (sTmp, cmsgPrimaryLookup) then
	Let sTmp = StringChopLeft (sTmp, 1)
	Let sTmp = StringChopRight (sTmp, stringLength (cmsgPrimaryLookup)+1)
endIf
let index = stringSegmentIndex (szRuleSets, LIST_ITEM_SEPARATOR, sTmp, TRUE)
let sModule = stringSegment (szModuleNames, LIST_ITEM_SEPARATOR, index)
let sRuleSet = stringSegment (szRuleSets, LIST_ITEM_SEPARATOR, index)
UserBufferClear ()
UserBufferAddText (sModule+" -> "+sRuleSet)
;Unlike typical user experience, we want Debug to catch all strings / errors that Invoke throws up.
let invoke = LRL_Invoke (sModule, sRuleSet, strQuery, "", NO_OFFSET, strInvokeReturn, "")
let invoke = getErrorCodeFromHResult (invoke)
;Success:
userBufferAddText (FormatString (cmsgResearchItDebugErrorNumber,
	intToString (invoke)))
if invoke == RESEARCHIT_E_SUCCESS then
	let sError = cmsgResearchItDebugSuccess
;Let the rest be handled via hResult / lookup:
elIf abs (invoke)  == RESEARCHIT_E_INSUFFICIENT_BUFFER then
	let sError = cmsgResearchItDebugInsufficientBuffer
elIf abs (invoke) == RESEARCHIT_E_RULESET_NOT_FOUND then
	let sError = cmsgResearchItDebugRulesetNotFound
elIf abs (invoke) == RESEARCHIT_E_REQUEST_FAILED then
	let sError = cmsgResearchItDebugRequestFailed
elIf abs (invoke) == RESEARCHIT_E_REQUEST_NO_RESULTS then
	let sError = cmsgResearchItDebugNoResults
elIf abs (invoke) == RESEARCHIT_E_REQUEST_TIMEOUT then
	let sError = cmsgResearchItDebugRequestTimeOut
;else ; XQuery error, string returned from module:
endIf
userBufferAddText (sError)
if ! StringIsBlank (strInvokeReturn)
&& (invoke == RESEARCHIT_E_SUCCESS || invoke == RESEARCHIT_E_REQUEST_FAILED) then
	UserBufferAddText(strInvokeReturn)
endIf
userBufferAddText (cMsgBuffExit, "ExitUserBuffer", cMsgBuffExit)
UserBufferActivate ()
JAWSTopOfFile()
if ! globalWasHjDialog  then
	SayLine ()
endIf
endFunction

void Function DebugLookupModuleQueryUsingLRL_Dialog ()
var
	int bRunQuery,
	int index,
	int nListSize,
	int invoke,
	string sDefaultModule,
	string sDefaultRule,
	string sModule,
	string sRuleSet,
	string sError,
	string strQuery,
	string strInvokeReturn
let bRunQuery = LRL_Dialog (sModule, sRuleSet, strQuery)
if ! bRunQuery then
	sayString ("No query found")
endIf
;must always do a Primary lookup in order for LRL_Invoke to work properly
if !LRL_GetPrimaryLookupModule (sDefaultModule, sDefaultRule) then ;in case a param is blank:
	return
endif
UserBufferClear ()
UserBufferAddText (sModule+" -> "+sRuleSet)
;Unlike typical user experience, we want Debug to catch all strings / errors that Invoke throws up.
let invoke = LRL_Invoke (sModule, sRuleSet, strQuery, "", NO_OFFSET, strInvokeReturn, "")
let invoke = getErrorCodeFromHResult (invoke)
;Success:
userBufferAddText (FormatString (cmsgResearchItDebugErrorNumber,
	intToString (invoke)))
if invoke == RESEARCHIT_E_SUCCESS then
	let sError = cmsgResearchItDebugSuccess
;Let the rest be handled via hResult / lookup:
elIf abs (invoke)  == RESEARCHIT_E_INSUFFICIENT_BUFFER then
	let sError = cmsgResearchItDebugInsufficientBuffer
elIf abs (invoke) == RESEARCHIT_E_RULESET_NOT_FOUND then
	let sError = cmsgResearchItDebugRulesetNotFound
elIf abs (invoke) == RESEARCHIT_E_REQUEST_FAILED then
	let sError = cmsgResearchItDebugRequestFailed
elIf abs (invoke) == RESEARCHIT_E_REQUEST_NO_RESULTS then
	let sError = cmsgResearchItDebugNoResults
elIf abs (invoke) == RESEARCHIT_E_REQUEST_TIMEOUT then
	let sError = cmsgResearchItDebugRequestTimeOut
;else ; XQuery error, string returned from module:
endIf
userBufferAddText (sError)
if ! StringIsBlank (strInvokeReturn)
&& (invoke == RESEARCHIT_E_SUCCESS || invoke == RESEARCHIT_E_REQUEST_FAILED) then
	UserBufferAddText(strInvokeReturn)
endIf
userBufferAddText (cMsgBuffExit, "ExitUserBuffer", cMsgBuffExit)
UserBufferActivate ()
JAWSTopOfFile()
if ! globalWasHjDialog  then
	SayLine ()
endIf
endFunction


