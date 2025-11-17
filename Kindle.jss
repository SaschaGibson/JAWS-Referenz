; Copyright 2017 by Freedom Scientific, Inc.
; Freedom Scientific script file for the Kindle PC app

include "hjConst.jsh"
include "hjGlobal.jsh"
include "UIA.jsh"
include "Common.jsm"
include "Kindle.jsm"
include "kindle.jsh"

import "UIA.jsd"

use "AceHelpers.jsb"

globals
int currentFirstPage, int currentLastPage, int announceRange, int suppressPageChangeAnnouncements,
	int previousFirstPage, int previousLastPage

int function InBookPageDocument()
if UserBufferIsActive() return false endIf
var int type
if !isPCCursor()
	SaveCursor()
	PCCursor()
	type = GetObjectSubtypeCode()
	RestoreCursor()
else
	type = GetObjectSubtypeCode()
endIf
if type return false endIf
var object element = CreateUIAFocusElement(true)
return element.controlType == UIA_DocumentControlTypeId
endFunction

Void Function SelectingText(int nMode)
if InBookPageDocument()
	;selection is not allowed in the book page view.
	;This function is fired twice for each selection event,
	;once before the selection attempt and once after it.
	;Inform the user that selection is not available on one of these calls.
	if nMode
		Say(msgErr_SelectionNotAvailable,ot_error)
	endIf
	return
endIf
SelectingText(nMode)
EndFunction

void function SayTopBottomUnit(int UnitMovement)
if IsPCCursor()
&& InBookPageDocument()
	delay (1)
	;Replace the long messages which state that these movement go to top or bottom of file
	;with messages stating that these movements move to top or bottom of page:
	if UnitMovement == UnitMove_Top
		SayMessage(ot_JAWS_message, msgTopOfPage_L, cmsg36_S)
	ElIf UnitMovement == UnitMove_Bottom
		SayMessage(ot_JAWS_message, msgBottomOfPage_L, cmsg37_S)
	EndIf
	SayLine()
	return
endIf
SayTopBottomUnit(UnitMovement)
EndFunction

void function SayPageUpDownUnit(int UnitMovement)
if IsPCCursor()
&& InBookPageDocument()
	SayCurrentScriptKeyLabel ()
	delay(2)
	SayLine ()
	return
endIf
SayPageUpDownUnit(UnitMovement)
EndFunction

Script NextDocumentWindowByPage ()
TypeKey (cksControlPageDown)
if !InBookPageDocument() return endIf
SayCurrentScriptKeyLabel ()
var int bShouldRestore
if !IsPCCursor()
	bShouldRestore = true
	SaveCursor()
	PCCursor()
endIf
delay(2)
SayLine ()
if bShouldRestore
	RestoreCursor()
endIf
EndScript

Script PreviousDocumentWindowByPage ()
TypeKey (cksControlPageUp)
if !InBookPageDocument() return endIf
SayCurrentScriptKeyLabel ()
var int bShouldRestore
if !IsPCCursor()
	bShouldRestore = true
	SaveCursor()
	PCCursor()
endIf
delay(2)
SayLine ()
if bShouldRestore
	RestoreCursor()
endIf
EndScript

script ScriptFileName()
ScriptAndAppNames(msgKindleAppName)
EndScript
void function ScreenSensitiveHelpForUnknownClasses()
if InBookPageDocument()
	EnsureNoUserBufferActive()
	SayFormattedMessage(OT_USER_BUFFER,FormatString(msgBookPageViewScreenSensitiveHelp,GetScriptKeyName("SayAll")))
	UserBufferAddText (cScBufferNewLine)
	UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
	return
endIf
ScreenSensitiveHelpForUnknownClasses()
EndFunction

void function ProcessMoveToLink(int MoveDirection, int linkType)
if !VirtualViewerFeatureAvailable(true,true) return EndIf
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
;Kindle does not yet support distinguishing visited from unvisited links.
;For now, we will allow attempting to move to unvisited links as a way to move to any links
;and will report that move to visited links is unsupported.
if linkType == VisitedLink
	SayQuicknavNotAvailableForType(QuicknavElementVisitedLink)
	return
elif linkType == UnvisitedLink
	if !MoveToUnvisitedLink(MoveDirection) then
		NotifyNavigationFailed(MoveDirection,cVMsgUnvisitedLinks1_L)
		return
	endIf
else ;linkType == AnyLink
	if !MoveToAnyLink(MoveDirection) then
		NotifyNavigationFailed(MoveDirection,cVMsgLinks1_L)
		return
	endIf
endIf
if !SayAllInProgress()
|| MoveDirection == s_Top
|| MoveDirection == s_Bottom then
	builtin::SayElement()
endIf
EndFunction

void function LinkBoundaryEvent(int entering)
if (entering) then
	SayMessage(OT_POSITION,msgEnteringLink)
Else
	SayMessage(OT_POSITION, msgLeavingLink)
EndIf
EndFunction

string function ConvertTypeToControlTypeStringPlural(int type)
if type == wt_Bitmap
	return CVMSGGraphic
endIf
return cscNull
EndFunction

string function ConvertTagToControlString( string tag )
	return ReturnTagTypeLiteral (Tag)
EndFunction

int function ConvertTagToControlType( string tag )
if  tag == cscGraphic 
	return WT_BITMAP
EndIf
return 0
EndFunction

int function IsQuickNavSupportedForType(int subtype)
if subtype == WT_BITMAP then
	return true
EndIf

return false
EndFunction

void function ProcessMoveToTag(int MoveDirection,
	string sTag, string sTagAttrib, string sElementtype,
	int bSayItemAsObject, int bCheckForContextHelp,
	optional int bMoveUseAttrib, optional int bAllowNesting)
var int controlType = ConvertTagToControlType( sTag )
if (!sTag || !controlType)
&& sTagAttrib
&& !IsQuickNavSupportedForAttribute(sTagAttrib)
	SayMessage(ot_error,
		FormatString(msgQuickNavNotAvailableInKindleForType_L,sElementtype),
		FormatString(msgQuickNavNotAvailableInKindleForType_S,sElementtype))
	return
endIf
if !IsQuickNavSupportedForType(controlType)
	var string controlString = ConvertTagToControlString( sTag )
	if (!controlString) controlString = sElementtype endIf
	SayMessage(ot_error,
		FormatString(msgQuickNavNotAvailableInKindleForType_L,controlString),
		FormatString(msgQuickNavNotAvailableInKindleForType_S,controlString))
	return
endIf
if controlType == 0 return EndIf
ProcessMoveToControlType( controlType, controlString, false, false, MoveDirection );
EndFunction

void function ProcessMoveToControlType(int iControlType, string sElementType,
	int bIsFormField, int bShouldSetFocus, int MoveDirection)
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
if !IsQuickNavSupportedForType(iControlType)
	var string sType = GetControlTypeName(iControlType)
	SayMessage(ot_error,
		FormatString(msgQuickNavNotAvailableInKindleForType_L,sType),
		FormatString(msgQuickNavNotAvailableInKindleForType_S,sType))
	return
endIf
if !MoveToControlType(MoveDirection, iControlType, bShouldSetFocus) then
	if !sElementType
		sElementType = ConvertTypeToControlTypeStringPlural(iControlType)
	endIf
	if IsSubtypeMappedToUIA(iControlType)
	&& !IsControlFoundOnPage(iControlType)
		NotifyNavigationFailed(0xffff,sElementType) ;NoItemForNavigation
	else
		NotifyNavigationFailed(MoveDirection,sElementType)
	endIf
	return
endIf
if ( SayAllInProgress() ) return EndIf
builtin::SayElement();
EndFunction

void function DoSayObjectTypeAndTextFromLevel( int level )
while (level > 0)
	SayObjectTypeAndText (level )
	level = level -1
EndWhile

SayObjectTypeAndText (0 )
EndFunction

Void function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
var
	int level

level  = GetFocusChangeDepth()
DoSayObjectTypeAndTextFromLevel(level)
EndFunction

Void Function PerformSelection ()
KindleDoSelection()
EndFunction

Script CopySelectedTextToClipboard ()
if (IsVirtualPCCursor ()
&& !UserBufferIsActive ()) then
	PerformSelection ()
	return
EndIf
 	
PerformScript CopySelectedTextToClipboard()
EndScript

Script CutToClipboard()
if (IsVirtualPCCursor ()
&& !UserBufferIsActive ()) then
	PerformSelection ()
	return
EndIf
 	
PerformScript CutToClipboard()
EndScript

Script VirtualContextMenu ()
PerformSelection ()
EndScript

object function FindKindleStatusTextObject()
	var handle mainWindow = GetAppMainWindow (GetCurrentWindow())
	if not mainWindow then return null() EndIf
	var object window = FSUIAGetElementFromHandle(mainWindow)
	if not window then return null() endif
	var object condition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_StatusBarControlTypeId)
	if not condition then return null() EndIf
	var object statusBar = window.findFirst(TreeScope_Subtree, condition)
	if not statusBar then return null() EndIf
	var object statusText = FSUIAGetFirstChildOfElement(statusBar)
	if not statusText then return null() EndIf
	return statusText
EndFunction

script SayBottomLineOfWindow()
	var object statusTextObject = FindKindleStatusTextObject()
	if statusTextObject && !stringIsBlank(statusTextObject.name) then
		SayMessage(OT_STATUS, statusTextObject.name)
	else
		PerformScript SayBottomLineOfWindow()
	endif
EndScript

script SaySentence()
	SayMessage(ot_error, msgKindleSentenceNavigationNotSupported)
EndScript

script SayNextSentence()
	SayMessage(ot_error, msgKindleSentenceNavigationNotSupported)
EndScript

script SayPriorSentence()
	SayMessage(ot_error, msgKindleSentenceNavigationNotSupported)
EndScript

void function AnnouncePageChangeIfNeeded()
	var string messageToSpeak
	if suppressPageChangeAnnouncements == 1 then
		return
	EndIf	
	if currentFirstPage == 0 || currentLastPage == 0 then
		return
	EndIf
	if SayAllInProgress () then
		return
	EndIf
	if previousFirstPage == currentFirstPage || previousLastPage == currentLastPage then
		return
	endif
	if not announceRange then
		messageToSpeak = FormatString(msgKindlePageChangeSinglePage, IntToString (currentFirstPage))
	else
		messageToSpeak = FormatString(msgKindlePageChangeMultiplePages, IntToString(currentFirstPage), IntToString(currentLastPage))
	endif
	SayMessage(OT_SCREEN_MESSAGE, messageToSpeak)
	BrailleMessage (messageToSpeak)
	previousFirstPage = currentFirstPage
	previousLastPage = currentLastPage
EndFunction

void function AcePageChangedEvent(collection attributes)
	if CollectionItemExists (attributes, HKey_FirstVisiblePageLabel) && CollectionItemExists (attributes, HKey_LastVisiblePageLabel) then
		currentFirstPage = StringToInt(attributes["kindle-first-visible-physical-page-label"])
		currentLastPage = StringToInt(attributes["kindle-last-visible-physical-page-label"])
		announceRange = 0;
		AnnouncePageChangeIfNeeded()
		return
	endif
	if CollectionItemExists (attributes, HKey_FirstVisiblePageNumber) && CollectionItemExists (attributes, HKey_LastVisiblePageNumber) then
		currentFirstPage = StringToInt(attributes["kindle-first-visible-physical-page-number"])
		currentLastPage = StringToInt(attributes["kindle-last-visible-physical-page-number"])
		announceRange = 1;
		AnnouncePageChangeIfNeeded()
		return
	endif
EndFunction

script SelectALink()
	SayMessage(ot_error, msgKindleSelectALinkNotSupported)
EndScript

void function MoveToNextUnvisitedLink()
	suppressPageChangeAnnouncements = 1
	MoveToNextUnvisitedLink()
	suppressPageChangeAnnouncements = 0
EndFunction

void function MoveToPriorUnvisitedLink()
	suppressPageChangeAnnouncements = 1
	MoveToPriorUnvisitedLink()
	suppressPageChangeAnnouncements = 0
EndFunction

;overwritten from Default because we do not support the ability to get a list of tables.
;This is also done in Edge, but we can't refactor this into a common base because Edge looks for controls on the page using UIA.
void function ProcessMoveToTable(int MoveDirection)
	var
	int bJAWSRequired,
	int bSayAllInProgress
	bJAWSRequired = !(MoveDirection == s_Next || MoveDirection == s_Prior)
	if !VirtualViewerFeatureAvailable(bJAWSRequired,true) then return EndIf
	if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
	if MoveToTable(MoveDirection) then
		if !SayAllInProgress() then
			PerformScript SayLine()
		endIf
		else
			NotifyNavigationFailed(MoveDirection,CVMSGTable)
	endIf
EndFunction

void function AnnotationBoundaryEvent(int annotated, int entering)
	if (entering) then
		if (annotated) then
			SayMessage(OT_POSITION, msgEnteringAnnotation)
		else
			SayMessage(OT_POSITION, msgEnteringHighlight)
		EndIf
	Else
		if (annotated) then
			SayMessage(OT_POSITION, msgLeavingAnnotation)
		else
			SayMessage(OT_POSITION, msgLeavingHighlight)
		EndIf
	EndIf
EndFunction

void function SayQuicknavNotAvailableForType(string quicknavType)
	SayMessage(ot_error,
	FormatString(msgQuickNavNotAvailableInKindleForType_L,quicknavType),	
	FormatString(msgQuickNavNotAvailableInKindleForType_S,quicknavType))
EndFunction

script MoveToNextDifferentElement()
	SayQuicknavNotAvailableForType(QuicknavElementDifferentElement)
EndScript

script MoveToPriorDifferentElement()
	SayQuicknavNotAvailableForType(QuicknavElementDifferentElement)
EndScript

script MoveToNextSameElement()
	SayQuicknavNotAvailableForType(QuicknavElementSameElement)
EndScript

script MoveToPriorSameElement()
	SayQuicknavNotAvailableForType(QuicknavElementSameElement)
EndScript

script MoveToMainRegion()
	SayQuicknavNotAvailableForType(QuicknavElementRegions)
EndScript

script MoveToNextRegion()
	SayQuicknavNotAvailableForType(QuicknavElementRegions)
EndScript

script MoveToPriorRegion()
	SayQuicknavNotAvailableForType(QuicknavElementRegions)
endScript

script MoveToNextArticle()
	SayQuicknavNotAvailableForType(QuicknavElementArticles)
EndScript

script MoveToPriorArticle()
	SayQuicknavNotAvailableForType(QuicknavElementArticles)
EndScript

script FocusToNextField()
	SayQuicknavNotAvailableForType(QuicknavElementFormElements)
EndScript

script FocusToPriorField()
	SayQuicknavNotAvailableForType(QuicknavElementFormElements)
EndScript

script MoveToNextList()
	SayQuicknavNotAvailableForType(QuicknavElementLists)
EndScript

script MoveToPriorList()
	SayQuicknavNotAvailableForType(QuicknavElementLists)
EndScript

script MoveToNextFrame()
	SayQuicknavNotAvailableForType(QuicknavElementFrames)
EndScript

script MoveToPriorFrame()
	SayQuicknavNotAvailableForType(QuicknavElementFrames)
EndScript

script StepToStartOfElement()
	SayQuicknavNotAvailableForType(QuicknavElementStartOfElement)
EndScript

script StepToEndOfElement()
	SayQuicknavNotAvailableForType(QuicknavElementEndOfElement)
EndScript

script MoveToNextPlaceMarker()
	SayQuicknavNotAvailableForType(QuicknavElementPlaceMarker)
EndScript

script MoveToPriorPlaceMarker()
	SayQuicknavNotAvailableForType(QuicknavElementPlaceMarker)
EndScript

script DefineATempPlaceMarker()
	SayQuicknavNotAvailableForType(QuicknavElementPlaceMarker)
EndScript

script SpeakPlaceMarkerN()
	SayQuicknavNotAvailableForType(QuicknavElementPlaceMarker)
EndScript

script MoveToPlaceMarkerN()
	SayQuicknavNotAvailableForType(QuicknavElementPlaceMarker)
EndScript

script SelectAPlaceMarker()
	SayQuicknavNotAvailableForType(QuicknavElementPlaceMarker)
EndScript

script SpeakPlacemarkers()
	SayQuicknavNotAvailableForType(QuicknavElementPlaceMarker)
EndScript

int function IsSubtypeMappedToUIA(int subtype)
	return false
	EndFunction
	