; Copyright 2016-2025 by Freedom Scientific, Inc.
;Freedom Scientific mouse speech script source file

include "hjConst.jsh"
include "hjGlobal.jsh"
include "UIA.jsh"
include "magcodes.jsh"
include "Chrome.jsh"
include "FSIMouseSpeech.jsh"
include "common.jsm"
include "MSAAConst.jsh"
include "outlook.jsh"

import "touch.jsd"
import "UIA.jsd"


const
;LastMoveTickThreshold is the amount of time which must elapse between mouse movements before it is necessary to verify whether or not the user changed mouse speech options:
	LastMoveTickThreshold = 500,  ;milliseconds
;MouseRecentlyMovedThreshold is the maximum amount of time to consider when evaluating whether or not the mouse has recently moved:
	MouseRecentlyMovedThreshold = 1500,  ;milliseconds
;MouseSpeechUnit_First and MouseSpeechUnit_Last must be equal to the first and last values of the MouseSpeechUnit constants from FSIMouseSpeech.jsh:
	MouseSpeechUnit_First = 0,
	MouseSpeechUnit_Last = 3,
;enumeration of the methods by which mouse speech is obtained:
	MouseSpeechMethod_Undetermined = 0,
	MouseSpeechMethod_UIAElement = 1,
	MouseSpeechMethod_UIATextRange = 2,
	MouseSpeechMethod_OSMRect = 3,
	MouseSpeechMethod_MSAA = 4,
	MouseSpeechMethod_XMLDom = 5,
	ArcProcessName = "Operator.exe",
	OutlookExe = "outlook.exe",
	OutlookLibrDll = "outllibr.dll",
	OfficeWWLibDll = "wwlib.dll"
globals
	object oUIA_MouseSpeech,  ;The FSUIA object
	object oUIA_MouseSpeechTreeWalker,  ;used when UIA structure traversal is needed to support mouse speech
	collection c_MouseSpeech  ;collection for current mouse speech
 		; members are:
		; LastMoveTick -- The last tick indicating when the FilterMouseSpeech fired.
		;		Used to determine when to set and clear variables which must be assigned anew when the mouse moves,
		;		since the user may change the option settings which the variables reflect.
 		; Unit -- One of the MouseSpeechUnit constants, representing the unit chosen by the user.
 		; Method -- Set to one of the MouseSpeechMethod constants, used as the method for obtaining the mouse speech.
 		; Element -- The UIA element used by UIA methods to obtain the text to be spoken at the mouse speech location.
 		; PrevElement -- The previous element used for obtaining mouse speech.
 		; Range -- If the mouse speech was obtained from a UIA text range, the range pattern object.
 		; X -- The mouse X position used when obtaining the mouse speech text.
 		; Y -- The mouse Y position used when obtaining the mouse speech text.
		; Left -- left edge of rectangle when mouse speech uses a rectangle for OSM or text range.
		; Top -- Top edge of rectangle when mouse speech uses a rectangle for OSM or text range.
		; Right -- Right edge of rectangle when mouse speech uses a rectangle for OSM or text range.
		; Bottom -- Bottom edge of rectangle when mouse speech uses a rectangle for OSM or text range.
 		; NewElement -- Element at the mouse location used when testing the new mouse location.
 		; PrevX -- Previous mouse x position used when testing the new mouse location.
 		; PrevY -- Previous mouse y position used when testing the new mouse location.
 		; NewX -- New mouse x position used when testing the new mouse location.
 		; NewY -- New mouse y position used when testing the new mouse location.
 		; SpeechTickTime -- The tick count when the most recent mouse speech occurred.
		

void function InitMouseSpeech()
oUIA_MouseSpeech = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !oUIA_MouseSpeech return endIf
oUIA_MouseSpeechTreeWalker = oUIA_MouseSpeech.RawViewWalker
if !oUIA_MouseSpeechTreeWalker
	oUIA_MouseSpeech = Null()
endIf
c_mouseSpeech = new collection
MouseEchoControllingProduct = WhichProductControlsMouseEcho()
EndFunction

void function EnsureMouseSpeechUIAIsInitialized()
if !oUIA_MouseSpeech
	InitMouseSpeech()
endIf
EndFunction

int function WhichProductControlsMouseEcho()
	return MouseEchoControlledBy_JAWS
endFunction

int Function OutlookRecentContactsWindowOpen(handle hWnd, string windowClass, string appName)
if appName != OutlookExe
&& appName != OutlookLibrDll
&& appName != OfficeWWLibDll
	return false
endIf
if IsSecondaryFocusActive()
	return true
endIf
if windowClass == wc_NetUIHWND
	var handle hParent = GetParent(hWnd)
	var string parentClass = GetWindowClass(hWnd)
	if parentClass == wc_NetUIHWND 
	|| parentClass == wc_NetUIToolWindow
		return true
	endIf
endIf
return false
EndFunction

int function DetectMethodForObtainingMouseSpeech(int mouseX, int mouseY, optional object ByRef element, handle hWnd, string appName)
if !hWnd
	hWnd = GetWindowAtPoint(mouseX,mouseY)
endIf
if !appName
	appName = StringSegment(GetWindowOwner(hWnd),"\\", -1)
endIf
var
	string class = GetWindowClass(hWnd)

if class == cwc_ConsoleWindowClass
	return MouseSpeechMethod_OSMRect
endIf

if class == cwcChromeBrowserClass 
	|| class == wc_Chrome_WidgetWin_1
	|| StringStartsWith(class, cwc_MozillaPrefix) ; Mozilla class names are different for different hardware acceleration settings
	return MouseSpeechMethod_MSAA
endIf

If OutlookRecentContactsWindowOpen(hWnd, class, appName)
	; querying outlook recent contacts with UIA triggers their invocation
	return MouseSpeechMethod_MSAA
endIf

;Bug 130334 - third-party ARC application crashes with mouse speech feature enabled
if appName == ArcProcessName
	return MouseSpeechMethod_Undetermined
endIf

c_MouseSpeech.elementXML = GetElementXMLAtPoint (mouseX, mouseY)
if !StringIsBlank(c_MouseSpeech.elementXML)
	return MouseSpeechMethod_XMLDom
endIf

if !element element = GetMouseSpeechUIAElement(mouseX,mouseY) endIf
;spreadsheet Excel special casing:
if class == cwc_Excel7
	;Versions earlier than 2013 do not have the needed UIA support:
	if element.controlType == UIA_PaneControlTypeId
	&& element.classname == cwc_Excel7
		return MouseSpeechMethod_OSMRect
	elif element.controlType == UIA_DataItemControlTypeId
		;Use UIA for cells where each is shown as a separate element:
		return MouseSpeechMethod_UIAElement
	elif element.controlType == UIA_TabItemControlTypeId
		return MouseSpeechMethod_UIAElement
	else ;if we missed anything:
		return MouseSpeechMethod_OSMRect
	endIf
endIf
if element.GetTextPattern()
	return MouseSpeechMethod_UIATextRange
endIf
return MouseSpeechMethod_UIAElement
EndFunction

Function UpdateMouseSpeechMovementTracking ()
var int tick = GetTickCount()
if (tick - c_mouseSpeech.LastMoveTick) > LastMoveTickThreshold 
	;Obtained current settings for mouse speech options which the user may have changed and which are used while the mouse is moving:
	c_mouseSpeech.unit = GetJCFOption(OPT_MOUSE_ECHO_UNIT)
	c_MouseSpeech.tones = GetJCFOption(OPT_MouseEchoScreenLocationTones)
endIf
c_mouseSpeech.LastMoveTick = tick
c_mouseSpeech.prevX = c_mouseSpeech.newX
c_mouseSpeech.prevY = c_mouseSpeech.newY
c_mouseSpeech.prevMsaaRole = C_MouseSpeech.msaaElement.AccRole(0)
var int x, int y
GetCursorPos(CURSOR_JAWS,smmPixels,x,y)
c_mouseSpeech.newX = x
c_mouseSpeech.newY = y
EndFunction

void function ClearMouseSpeechRect()
c_MouseSpeech.left = 0
c_MouseSpeech.top = 0
c_MouseSpeech.right = 0
c_MouseSpeech.bottom = 0
EndFunction

void function UpdateMouseSpeechRect(int Left,int Top,int Right,int Bottom)
c_MouseSpeech.left=Left
c_MouseSpeech.top=Top
c_MouseSpeech.right=Right
c_MouseSpeech.bottom=Bottom
EndFunction

int function IsPointInRect(int x, int y, int left, int top, int right, int bottom)
return X >= Left
	&& X < Right
	&& Y >= Top
	&& Y < Bottom
EndFunction

Function IsSameRect (int Left1, int Top1, int Right1, int Bottom1, int Left2, int Top2, int Right2, int Bottom2)
	return Left1 == Left2 && Right1 == Right2 && Top1 == Top2 && Bottom1 == Bottom2
EndFunction

Function IsRectInRect(int innerLeft, int innerTop, int innerRight, int innerBottom, 
	int outerLeft, int outerTop, int outerRight, int outerBottom)
return 
	outerLeft && innerLeft >= outerLeft
	&& outerRight && innerRight <= outerRight
	&& outerTop && innerTop >= outerTop
	&& outerBottom && innerBottom <= outerBottom
EndFunction

object Function GetMouseSpeechXMLDomElement (int mouseX, int mouseY)
if StringIsBlank (c_MouseSpeech.elementXML)
	return Null()
endIf
var
	object XMLDomDoc = CreateXMLDomDoc(),
	object element
LoadAndParseXML(XMLDomDoc, c_MouseSpeech.elementXML)
element = XMLDomDoc.selectSingleNode("//*")
return element
endFunction

Function GetMouseSpeechMSAAElement (int mouseX, int mouseY)
var object msaaElement = GetObjectAtPoint(0, mouseX, mouseY)
if !msaaElement
	return null()
EndIf

var int role = msaaElement.accRole(0)
if role != ROLE_SYSTEM_STATICTEXT && role != ROLE_SYSTEM_TEXT
	return msaaElement
EndIf

var 
	object parent = msaaElement,
	int i 
for i = 1 to 3
	parent = parent.accParent
	var int parentRole = parent.accRole(0)
	if parent && parentRole == ROLE_SYSTEM_LINK
		; if a link is the parent to a static text we are more interested in the link
		return parent
	endIf
EndFor

return msaaElement
EndFunction

object function GetMouseSpeechUIAElement(optional int mouseX, int mouseY)
EnsureMouseSpeechUIAIsInitialized()
if !mouseX && !mouseY
	GetCursorPos(CURSOR_JAWS,smmPixels,mouseX,mouseY)
endIf
if !mouseX || !mouseY return Null() endIf
var object element = GetDesiredScreenElementFromPoint(mouseX,mouseY, oUIA_MouseSpeech, oUIA_MouseSpeechTreeWalker).BuildUpdatedCache()
var object ancestorElement = FindMouseSpeechAncestorElementWithDocumentRange(element,mouseX,mouseY)
if ancestorElement
	return ancestorElement
endIf
;For the ZoomText UI,
;the expandable menu buttons have a child element of the same rectangle size which are buttons with a check state.
;For these elements, we really want the parent element:
if element.className == "RibbonToggleButton"
	oUIA_MouseSpeechTreeWalker.currentElement = element
	oUIA_MouseSpeechTreeWalker.GotoParent()
	if oUIA_MouseSpeechTreeWalker.currentElement.className == "ZoomTextApplicationMenu"
	|| oUIA_MouseSpeechTreeWalker.currentElement.className == "ZoomTextMenuButton"
		return oUIA_MouseSpeechTreeWalker.currentElement
	endIf
endIf
return element
EndFunction

object function FindMouseSpeechAncestorElementWithDocumentRange(object element, int mouseX, int mouseY)
if !element
|| (!mouseX && !mouseY)
	return Null()
endIf
var int controlTypeId
var handle hWnd = GetWindowAtPoint(mouseX,mouseY)
var string sClass = GetWindowClass(hWnd)
if sClass == cwcIEServer
	controlTypeId = UIA_PaneControlTypeId
elif sClass == cwc_Wwg
	;Only search for an ancestor element if in Outlook, not in Word:
	if GetTopLevelWindow(hWnd) != cwc_Rctrl_RenWnd32 return Null() endIf
	controlTypeId = UIA_DocumentControlTypeId
else ;This is not a special case requiring an ancestor element with a document range:
	return Null()
endIf
oUIA_MouseSpeechTreeWalker.currentElement = element
while oUIA_MouseSpeechTreeWalker.gotoParent()
	if ElementHasTextDocumentRange(oUIA_MouseSpeechTreeWalker.currentElement,controlTypeId)
		return oUIA_MouseSpeechTreeWalker.currentElement
	endIf
endWhile
return Null()
EndFunction

int function MapMouseSpeechTextTypeToUnit()
if c_MouseSpeech.method == MouseSpeechMethod_UIATextRange
	;map the mouse speech unit to a UIA textUnit constant:
	if c_mouseSpeech.unit == MouseSpeechUnit_Line
		return textUnit_Line
	elif c_mouseSpeech.unit == MouseSpeechUnit_Word
		return textUnit_Word
	elif c_mouseSpeech.unit == MouseSpeechUnit_Character
		return textUnit_Character
	elif c_mouseSpeech.unit == MouseSpeechUnit_Paragraph
		return textUnit_Paragraph
	endIf
elif c_MouseSpeech.method == MouseSpeechMethod_OSMRect
	;map the mouse speech unit to a constant used by GetItemRect:
	if c_mouseSpeech.unit == MouseSpeechUnit_Word
		return it_word
	elif c_mouseSpeech.unit == MouseSpeechUnit_Character
		return it_char
	else
		return it_line
	endIf
else
	;the only other method is MouseSpeechMethod_UIAElement,
	;and it doesn't use any of the mouse speech units.
	return 0
endIf
EndFunction

object function GetTextRangeForMouseSpeech(object mouseSpeechElement, int mouseX, int mouseY)
if !mouseSpeechElement return CscNull endIf
var object textPattern = mouseSpeechElement.GetTextPattern()
if !textPattern return  CscNull endIf
var object range = textPattern.rangeFromPoint(mouseX,mouseY)
if !range return CscNull endIf
var int textUnit = MapMouseSpeechTextTypeToUnit()
range.ExpandToEnclosingUnit(textUnit)
return range
EndFunction

int function IsNewTextRangeForMouseSpeech()
var object newRange = GetTextRangeForMouseSpeech(C_MouseSpeech.newElement,C_MouseSpeech.newX,C_MouseSpeech.newY)
if !newRange return false endIf
var int left, int top, int right, int bottom
if !GetBoundingRectFromRectArray(newRange.GetBoundingRectangles(), left, top, right, bottom) return false endIf
;Note that although range is obtained, the mouse location may be outside of the range rectangle:
if !IsPointInRect(C_MouseSpeech.newX,C_MouseSpeech.newY,left,top,right,bottom) return false endIf
if !c_MouseSpeech.range
|| c_MouseSpeech.range.compare(newRange) == false
	;This is a new range of text:
	return true
elif !IsPointInRect(C_MouseSpeech.prevX,C_MouseSpeech.prevY,left,top,right,bottom)
	;mouse moved into the range rectangle from a location outside of the rectangle:
	return true
endIf
return false
EndFunction

int function IsNewTextMSAAElementForMouseSpeech()
var object newMsaaElement = GetObjectAtPoint(0, C_MouseSpeech.newX, C_MouseSpeech.newY)
if !newMsaaElement return false endIf
var int left, int top, int width, int height
newMsaaElement.accLocation(intRef(left), intRef(top), intRef(width), intRef(height), 0)
if !left && !top && !width && !height
	return false;
endIf
if c_mouseSpeech.prevMsaaRole == ROLE_SYSTEM_LINK && 
	IsRectInRect(left, top, left+width, top+height, c_MouseSpeech.left, c_MouseSpeech.top, c_MouseSpeech.right, c_MouseSpeech.bottom)
	; when outer element is a link, anything inside is considered spoken
	return false
elif IsSameRect(left, top, left+width, top+height, c_MouseSpeech.left, c_MouseSpeech.top, c_MouseSpeech.right, c_MouseSpeech.bottom)
	; when outer element is not a link we require exact match
	return false
endIf
return true
EndFunction

void function UpdateMouseSpeechTextData()
var
	int x, int y,
	object element
GetCursorPos(CURSOR_JAWS,smmPixels,x,y)
c_MouseSpeech.x = x
c_MouseSpeech.y = y
c_MouseSpeech.hWnd = GetWindowAtPoint(x, y)
c_MouseSpeech.appName = StringSegment(GetWindowOwner(c_MouseSpeech.hWnd),"\\", -1)
c_MouseSpeech.method = DetectMethodForObtainingMouseSpeech(x,y,element, c_MouseSpeech.hWnd, c_MouseSpeech.appName)
if c_MouseSpeech.method == MouseSpeechMethod_Undetermined ||
   c_MouseSpeech.method == MouseSpeechMethod_UIAElement ||
   c_MouseSpeech.method == MouseSpeechMethod_UIATextRange ||
   c_MouseSpeech.method == MouseSpeechMethod_OSMRect 
	if !element
		element = GetMouseSpeechUIAElement(x,y)
	endIf
	c_MouseSpeech.prevElement = c_MouseSpeech.element
	c_MouseSpeech.element = element
	c_MouseSpeech.msaaElement = Null()
endIf
c_MouseSpeech.range = Null()
if c_MouseSpeech.method == MouseSpeechMethod_UIATextRange
	c_MouseSpeech.range = GetTextRangeForMouseSpeech(element,x,y)
elif c_MouseSpeech.method == MouseSpeechMethod_MSAA
	c_MouseSpeech.element = Null()
	c_MouseSpeech.msaaElement = GetMouseSpeechMSAAElement(x,y)
elIf c_MouseSpeech.method == MouseSpeechMethod_XMLDom
	c_MouseSpeech.element = Null()
	c_MouseSpeech.XMLDomElement = GetMouseSpeechXMLDomElement(x,y)
endIf
;Do not update the rectangle here, that is done when the text to be spoken is retrieved.
;Do not update the new and prior coordinates for the mouse, that is done by UpdateMouseSpeechMovementTracking while the mouse is moving.
EndFunction

int function IsExemptFromMouseSpeech(int x, int y, object element)
;Mouse speech is suppressed where moving the mouse causes a focus change or active item change,
;so that mouse speech does not produce the effect of double speaking.
;See overwritten function in Explorer.jss for Windows 7 Start Menu exemptions.
var
	handle hWnd = GetWindowAtPoint(x,y),
	string class = GetWindowClass(hWnd)
if GetMenuMode()
&& class != cwc_Xaml_WindowedPopupClass
&& GetObjectSubtypeCode() != wt_ListBoxItem
	return true
endIf
if class == cwc_ComboLBox
	return true
endIf
if class == cWcListView
	var string parentClass = GetWindowClass(GetParent(hWnd))
	if parentClass == cwc_AutoSuggestDropdown
		return true
	endIf
endIf
return false
EndFunction

int function FilterMouseSpeech()
;This function is called internally to determine whether or not to fire MouseSpeechtimerEvent.
;Returning false means that the mouse has moved outside of the area of spoken text,
;and the MouseSpeechTimerEvent will then be allowed to fire.
;Returning true prevents the MouseSpeechtimerEvent from firing,
;since we assume that the mouse is still in the area of already spoken text.
;First get information for the new location:
UpdateMouseSpeechMovementTracking()
var
	int isMousePtOutsideOfLastSpokenRect = !IsPointInRect(C_MouseSpeech.newX, C_MouseSpeech.newY, c_MouseSpeech.left, c_MouseSpeech.top, c_MouseSpeech.right, c_MouseSpeech.bottom),
	int nextMethod,
	object newElement
if isMousePtOutsideOfLastSpokenRect
	; reset stored data so it can be spoken again as soon as mouse is back
	ClearMouseSpeechRect()
	C_MouseSpeech.element = Null()
	C_MouseSpeech.range = Null()
	C_MouseSpeech.msaaElement = Null()
Endif
nextMethod = DetectMethodForObtainingMouseSpeech(c_MouseSpeech.newX, c_MouseSpeech.newY, newElement)
if newElement
	C_MouseSpeech.newElement = newElement
elIf nextMethod != MouseSpeechMethod_MSAA
	C_MouseSpeech.newElement = GetMouseSpeechUIAElement(c_MouseSpeech.newX,c_MouseSpeech.newY)
endIf
if c_MouseSpeech.tones
	;ToDo: Play tone based on x y position
endIf
if nextMethod == MouseSpeechMethod_UIATextRange
	if IsNewTextRangeForMouseSpeech()
		return false
	endIf
	return true
endIf
if IsExemptFromMouseSpeech(C_MouseSpeech.newX,C_MouseSpeech.newY,C_MouseSpeech.newElement)
	;Do not allow mouse speech where moving the mouse causes focus change or active item change:
	return true
endIf
if nextMethod == MouseSpeechMethod_UIAElement
	if isMousePtOutsideOfLastSpokenRect
	|| (C_MouseSpeech.newElement
	&& !C_MouseSpeech.ancestorElement
	&& !oUIA_MouseSpeech.CompareElements(C_MouseSpeech.newElement,C_MouseSpeech.element))
		return false
	endIf
	return true
endIf
if nextMethod == MouseSpeechMethod_MSAA
	if IsNewTextMSAAElementForMouseSpeech()
		return false
	endIf
	return true
endIf
;The rest is for MouseSpeechMethod_OSMRect:
;if the bounding rectangle is empty then there is no need to filter:
if c_MouseSpeech.left == c_MouseSpeech.right 
	return FALSE
endIf
;if the mouse is not in the bounding rectangle then there is no need to filter.
if isMousePtOutsideOfLastSpokenRect
	return FALSE
endIf
;Filter because the mouse is in the bounding rectangle:
return TRUE
EndFunction

int function SayMouseSpeechTextAndUpdateRectUsingOSM()
var
	int speechUnit,
	int left,
	int top,
	int right,
	int bottom,
	string sText
speechUnit = MapMouseSpeechTextTypeToUnit()
if !GetItemRect(c_MouseSpeech.x, c_MouseSpeech.y, Left, Right, Top, Bottom, speechUnit)
|| !IsPointInRect(c_MouseSpeech.x,c_MouseSpeech.y,Left,Top,Right,Bottom)
	ClearMouseSpeechRect()
	return false
endIf
SaveCursor()
JAWSCursor()
if speechUnit == IT_WORD
	sText = GetWORD()
elif speechUnit == it_char
	sText = GetCharacter()
else
	sText = GetLine()
endIf
RestoreCursor()
if sText
	UpdateMouseSpeechRect(left,top,right,bottom)
	if GetJCFOption(OPT_MOUSE_MOVEMENT_STOPS_SPEECH) StopSpeech() endIf
	Say(sText,OT_MOUSE_SPEECH)
	return true
else
	ClearMouseSpeechRect()
	return false
endIf
return sText
EndFunction

int function SayMouseSpeechUIAControlTypeAndState(optional int shouldStopSpeech)
if !GetJCFOption(OPT_MouseEchoSpeaksControlTypeAndState) return false endIf
if c_MouseSpeech.method == MouseSpeechMethod_UIATextRange
	;When retrieving mouse speech via text range,
	;the mouse speech element may be an ancestor element of the one at the mouse location.
	;If so, do not speak the control type and state of the ancestor element.
	var int x, int y
	if !oUIA_MouseSpeech.CompareElements(c_MouseSpeech.element,oUIA_MouseSpeech.GetElementFromPoint(x,y)) return endIf
endIf
var
	string sText,
	int wasSpoken
var object element = c_MouseSpeech.element
if (element.ControlType == UIA_DATAItemControlTypeID 
|| element.ControlType == UIA_HeaderItemControlTypeId) ; table headers in embedded tables in spreadsheets
&& GetWindowClassAtMouseSpeechElementPosition() == cwc_Excel7 then
; for cells in Excel, don't say "item", but do read the cell contents.
	if shouldStopSpeech StopSpeech() endIf
		var string name = element.name
		name = StringReplaceSubstrings (name, "\"", "")
		if CellReadingVerbosity () == readCellContentsAndCoordinates
			say (getSpellString (name), OT_MOUSE_SPEECH) ; so that coordinates with more than one letter speak as individual letters, e.g. A A instead of aa
		endIf
		return
endIf
sText = C_MouseSpeech.element.LocalizedControlType
if sText
	if shouldStopSpeech StopSpeech() endIf
	Say(sText,OT_MOUSE_SPEECH_CONTROL_TYPE)
	wasSpoken = true
endIf
sText = GetUIAStateString(C_MouseSpeech.element)
if sText
	if (shouldStopSpeech && !wasSpoken) StopSpeech() endIf
	Say(sText,OT_MOUSE_SPEECH_ITEM_STATE)
	wasSpoken = true
endIf
return wasSpoken
EndFunction

string function GetMouseSpeechUIADescriptionText(string AlreadySpokenText, object pattern)
if !pattern.description
	if C_MouseSpeech.method == MouseSpeechMethod_UIAElement
		if !AlreadySpokenText
		|| (AlreadySpokenText && !StringContains(AlreadySpokenText, C_MouseSpeech.element.fullDescription))
			return C_MouseSpeech.element.fullDescription
		endIf
	endIf
	return cscNull
endIf
if C_MouseSpeech.element.controlType == UIA_TreeItemControlTypeId
	;Settings Center and Quick Settings have description text which has nothing to do with a description:
	var object parent = UIAGetParent( C_MouseSpeech.element)
	if parent.className == cwc_FeatureTree 
		return cscNull
	endIf
endIf
if !AlreadySpokenText
|| (AlreadySpokenText && !StringContains(AlreadySpokenText,pattern.description))
	return pattern.description
endIf
return cscNull
EndFunction

string function GetMouseSpeechUIAHelpText(string AlreadySpokenText, object pattern)
if !pattern.help return cscNull endIf
if !AlreadySpokenText
|| (AlreadySpokenText && !StringContains(AlreadySpokenText,pattern.help))
	return pattern.help
endIf
return cscNull
EndFunction

int function SayMouseSpeechHelpAndDescription(string AlreadySpokenText, optional int shouldStopSpeech)
if !ShouldSpeakDescription() return false endIf
var
	object pattern,
	string descrText,
	string helpText
if C_MouseSpeech.method == MouseSpeechMethod_MSAA
	pattern = C_MouseSpeech.msaaElement
else
	pattern = C_MouseSpeech.element.GetLegacyIAccessiblePattern()
endIf
descrText = GetMouseSpeechUIADescriptionText(AlreadySpokenText, pattern)
if descrText
	if shouldStopSpeech StopSpeech() endIf
	SayUsingVoice(vctx_message,descrText,ot_mouse_speech)
endIf
helpText = GetMouseSpeechUIAHelpText(AlreadySpokenText, pattern)
if helpText
&& helpText != descrText
	if (shouldStopSpeech && !descrText) StopSpeech() endIf
	SayUsingVoice(vctx_message,helpText,ot_mouse_speech)
endIf
return descrText || helpText
EndFunction

int function SayMouseSpeechTextAndUpdateRectUsingUIATextRange()
var
	int speechUnit,
	int left,
	int top,
	int right,
	int bottom,
	int shouldStopSpeech,
	string sText,
	int wasSpoken
sText = c_mouseSpeech.range.getText(TextRange_NoMaxLength)
if GetBoundingRectFromRectArray(c_mouseSpeech.range.GetBoundingRectangles(), left, top, right, bottom) 
	UpdateMouseSpeechRect(left,top,right,bottom)
else
	ClearMouseSpeechRect()
endIf
shouldStopSpeech = GetJCFOption(OPT_MOUSE_MOVEMENT_STOPS_SPEECH)
BeginFlashMessage()
if sText
	if shouldStopSpeech StopSpeech() endIf
	Say(sText,OT_MOUSE_SPEECH)
	wasSpoken = true
endIf
if oUIA_MouseSpeech.CompareElements(c_MouseSpeech.prevElement,c_MouseSpeech.element) != UIATrue
	shouldStopSpeech = (shouldStopSpeech && !wasSpoken)
	wasSpoken = SayMouseSpeechUIAControlTypeAndState(shouldStopSpeech)
endIf
EndFlashMessage()
return wasSpoken
EndFunction

string function GetWindowClassAtMouseSpeechElementPosition()
if !(c_MouseSpeech.x && c_MouseSpeech.y) return cscNull endIf
var handle hWnd = GetWindowAtPoint(c_MouseSpeech.x,c_MouseSpeech.y)
if !hWnd return cscNull EndIf
return GetWindowClass(hWnd)
EndFunction

string function GetMouseSpeechTextUsingUIAElement()
var
	string name,
	string value,
	int controlType,
	string UIAClass,
	string automationId,
	string wndClass,
	object o,
	string sText
if !C_MouseSpeech.element return cscNull EndIf
controlType = C_MouseSpeech.element.controlType
UIAClass = C_MouseSpeech.element.className
if controlType == UIA_PaneControlTypeId
&& UIAClass == cwc_Windows_UI_Core_CoreComponentInputSource
	o = UIAGetDeepestElementWithPointInElementRect(C_MouseSpeech.element, C_MouseSpeech.x, C_MouseSpeech.y)
	if o
		C_MouseSpeech.ancestorElement = C_MouseSpeech.element
		C_MouseSpeech.element = o
		controlType = C_MouseSpeech.element.controlType
		UIAClass = C_MouseSpeech.element.className
	endIf
else
	C_MouseSpeech.ancestorElement = Null()
endIf
name = StringRemoveZeroWidthSpaceChars (C_MouseSpeech.element.name)
value = StringRemoveZeroWidthSpaceChars (GetValueString(C_MouseSpeech.element))
if controlType == UIA_PaneControlTypeId
	;Non-visible pane names are not spoken for mouse speech:
	return cscNull
elif controlType == UIA_ListControlTypeId
&& !name
	if UIAClass == UIAClass_SysListView32
	|| UIAClass == UIAClass_UIItemsView
		o = UIAGetParent(C_MouseSpeech.element)
		if o.className == UIAClass_ShellDll_DefView
		|| o.className == UIAClass_DUIListView 
			;Desktop, Explorer and shell view windows
			return cscNull
		endIf
	endIf
elif controlType == UIA_ListControlTypeId
	if UIAClass == UIAClass_SysListView32
		o = UIAGetParent(C_MouseSpeech.element)
		if o.className == UIAClass_ShellDll_DefView
			;Desktop
			return cscNull
		endIf
	endif
elif controlType == UIA_TreeControlTypeId
	;This may be a tree with a name which is not visible:
	if UIAClass == UIAClass_SysTreeView32
		o = UIAGetParent(C_MouseSpeech.element)
		if o.className == UIAClass_ProperTreeHost
			;Explorer and shell view windows
			return cscNull
		endIf
	endIf
endIf
wndClass = GetWindowClassAtMouseSpeechElementPosition()
if controlType == UIA_HyperlinkControlTypeId
&& !name
	;Sometimes, the text is in a child element:
	o = UIAGetFirstChild(C_MouseSpeech.element)
	if o
	&& o.name
		return o.name
	endIf
elif controlType == UIA_DataItemControlTypeId
	;The text we want may be in the name or value, depending on the window class
	;note that the data item element has no native window handle to retrieve
	if wndClass == cwc_OutlookGrid
		;Outlook 2013 or later
		return name
	elif wndClass == cwc_SuperGrid
		;outlook 2010 and earlier
		return value
	elIf wndClass == cwc_Excel7 then
		if UIAClass == UIAClass_XLSpreadsheetCell
			return value ; the content first.
		elIf UIAClass == UIAClass_XLGridRowHeader
			return name
		elIf UIAClass == UIAClass_XLGridColumnHeader
			return name
		else
			return value
		endIf
	endIf
elif controlType == UIA_TabItemControlTypeId
	if wndClass == cwc_Excel7 then
		return name
	endif
elIf controlType == UIA_HeaderItemControlTypeId
&& wndClass == cwc_Excel7 then
; embedded tables inside Excel spreadsheets.
		return value
elif controlType == UIA_EditControlTypeId
	wndClass = GetWindowClassAtMouseSpeechElementPosition()
	if wndClass == cwcFireFox4BrowserClass
	|| wndClass == cwcFireFoxBrowserClass
		;In Firefox, the mouse may land on the edit element which is the child of the link.
		;Normally for edits, we announce the value,
		;but for the edit children of the link in Firefox we want the name,
		;since the value is the URL rather than the screen text.
		;So make sure this is actually an edit child of a link:
		var object parent = CreateUIAParentOfElement(C_MouseSpeech.element)
		if parent.controlType == UIA_HyperlinkControlTypeId
			return name
		endIf
	endIf
elif controlType == UIA_DocumentControlTypeId
	wndClass = GetWindowClassAtMouseSpeechElementPosition()
	if wndClass == cwcFireFox4BrowserClass
	|| wndClass == cwcFireFoxBrowserClass
		;In Firefox, we want to use the document name rather than the value,
		;since the value is the URL of the page:
		return name
	endIf
endIf
return StringRemoveZeroWidthSpaceChars (UIAGetElementText(C_MouseSpeech.element))
EndFunction

int function SayMouseSpeechTextUsingUIAElement()
ClearMouseSpeechRect()
var string sText = GetMouseSpeechTextUsingUIAElement()
if !sText return false endIf
UpdateMouseSpeechRect(C_MouseSpeech.element.BoundingRectangle.left,C_MouseSpeech.element.BoundingRectangle.top,C_MouseSpeech.element.BoundingRectangle.right,C_MouseSpeech.element.BoundingRectangle.bottom)
if GetJCFOption(OPT_MOUSE_MOVEMENT_STOPS_SPEECH) StopSpeech() endIf
BeginFlashMessage()
Say(sText,OT_MOUSE_SPEECH)
SayMouseSpeechUIAControlTypeAndState()
SayMouseSpeechHelpAndDescription(sText)
EndFlashMessage()
return true
EndFunction

string function GetMouseSpeechTextUsingXMLDomElement(int type)
if !C_MouseSpeech.XMLDomElement return cscNull EndIf
var string sName = GetXMLDomNodeText(C_MouseSpeech.XMLDomElement)
var string outputText = sName
if type == WT_WINDOW || type == WT_MDICLIENT || 
	type == WT_DOCUMENT || type == WT_GROUPBOX then
	; too generic for mouse speech
	outputText = cscNull
endIf
return outputText
endFunction

string function GetMouseSpeechTextUsingMSAAElement(int msaaRole)
if !C_MouseSpeech.msaaElement return cscNull EndIf
var string accName = C_MouseSpeech.msaaElement.accName(0)
var string accValue = C_MouseSpeech.msaaElement.accValue(0)
var string outputText = accName
if msaaRole == ROLE_SYSTEM_TEXT
	outputText =outputText + " " + accValue
endIf
if !outputText
	outputText = accValue
endIf
if msaaRole == ROLE_SYSTEM_COMBOBOX
	outputText = accValue
endIf
if msaaRole == ROLE_SYSTEM_WINDOW || msaaRole == ROLE_SYSTEM_CLIENT || 
	msaaRole == ROLE_SYSTEM_DOCUMENT || msaaRole == ROLE_SYSTEM_GROUPING then
	; too generic for mouse speech
	outputText = ""
endIf
return outputText
EndFunction

string function GetMouseSpeechMSAAObjectType(int msaaRole)
if !C_MouseSpeech.msaaElement return cscNull EndIf
var string typeName = getRoleText (msaaRole)
if msaaRole == ROLE_SYSTEM_STATICTEXT
|| msaaRole == 0
	; JAWS normally does not announce this type
	typeName = ""
endIf
return typeName
endFunction

int function SayMouseSpeechXMLDomControlTypeAndState(int type, optional int shouldStopSpeech)
if !GetJCFOption(OPT_MouseEchoSpeaksControlTypeAndState) return false endIf
var int wasSpoken = false
if type == WT_PARAGRAPH
	; JAWS normally doesn't announce this type
	return false
endif
var string typeName = GetControlTypeName(type)
if typeName
	if shouldStopSpeech StopSpeech() endIf
	Say(typeName,OT_MOUSE_SPEECH_CONTROL_TYPE)
	wasSpoken = true
endIf
var string objectState = GetStateInfoFromXMLDomNodeAttributes(C_MouseSpeech.XMLDomElement.attributes)
if objectState
	if (shouldStopSpeech && !wasSpoken) StopSpeech() endIf
	Say(objectState,OT_MOUSE_SPEECH_ITEM_STATE)
	wasSpoken = true
endIf
return wasSpoken
endFunction

int function SayMouseSpeechMSAAControlTypeAndState(int msaaRole, optional int shouldStopSpeech)
if !GetJCFOption(OPT_MouseEchoSpeaksControlTypeAndState) return false endIf
var int wasSpoken = 0
if msaaRole == ROLE_SYSTEM_TEXT then
	; JAWS normally doesn't announce this type
	return false
endif
var string typeName = GetMouseSpeechMSAAObjectType(msaaRole)
if typeName
	if shouldStopSpeech StopSpeech() endIf
	Say(typeName,OT_MOUSE_SPEECH_CONTROL_TYPE)
	wasSpoken = true
endIf
var string objectState = GetObjectState()
if objectState
	if (shouldStopSpeech && !wasSpoken) StopSpeech() endIf
	Say(objectState,OT_MOUSE_SPEECH_ITEM_STATE)
	wasSpoken = true
endIf
return wasSpoken
endFunction

int function SayMouseSpeechTextUsingXMLDomElement()
var int XMLDomType = C_MouseSpeech.XMLDomElement.attributes.GetNamedItem("fsType").nodeValue
var string text = GetMouseSpeechTextUsingXMLDomElement(XMLDomType)
if !text return false endIf
ClearMouseSpeechRect()
if GetJCFOption(OPT_MOUSE_MOVEMENT_STOPS_SPEECH) StopSpeech() endIf
BeginFlashMessage()
Say(text,OT_MOUSE_SPEECH)
SayMouseSpeechXMLDomControlTypeAndState(XMLDomType)
EndFlashMessage()
var int fsID, int left, int top, int right, int bottom
fsID = C_MouseSpeech.XMLDomElement.attributes.GetNamedItem("fsID").nodeValue
GetElementRect(fsID, left, top, right, bottom)
if left || top || right || bottom
	UpdateMouseSpeechRect(left,top,right,bottom)
endIf
return true
endFunction

int function SayMouseSpeechTextUsingMSAAElement()
var int msaaRole = C_MouseSpeech.msaaElement.AccRole(0)
var string text = GetMouseSpeechTextUsingMSAAElement(msaaRole)
if !text return false endIf
ClearMouseSpeechRect()
if GetJCFOption(OPT_MOUSE_MOVEMENT_STOPS_SPEECH) StopSpeech() endIf
BeginFlashMessage()
Say(text,OT_MOUSE_SPEECH)
SayMouseSpeechMSAAControlTypeAndState(msaaRole)
EndFlashMessage()
var int left, int top, int width, int height
C_MouseSpeech.msaaElement.accLocation(intRef(left), intRef(top), intRef(width), intRef(height), 0)
if left || top || width || height
	UpdateMouseSpeechRect(left,top,left+width,top+height)
endIf
return true
EndFunction

int function MouseSpeechTimerEvent()
var int wasSpoken
UpdateMouseSpeechTextData()
if c_mouseSpeech.method == MouseSpeechMethod_UIATextRange
	wasSpoken = SayMouseSpeechTextAndUpdateRectUsingUIATextRange()
elif c_mouseSpeech.method == MouseSpeechMethod_UIAElement
	wasSpoken = SayMouseSpeechTextUsingUIAElement()
elif c_mouseSpeech.method == MouseSpeechMethod_MSAA
	wasSpoken = SayMouseSpeechTextUsingMSAAElement()
elif c_mouseSpeech.method == MouseSpeechMethod_XMLDom
	wasSpoken = SayMouseSpeechTextUsingXMLDomElement()
else
	wasSpoken = SayMouseSpeechTextAndUpdateRectUsingOSM()
endIf
if wasSpoken
	c_MouseSpeech.SpeechTickTime = GetTickCount()
endIf
return wasSpoken
EndFunction

int function MouseEchoToggle()
SetDefaultJCFOption(OPT_MOUSE_SPEECH_ENABLED,!GetJCFOption(OPT_MOUSE_SPEECH_ENABLED))
return GetJCFOption(OPT_MOUSE_SPEECH_ENABLED)
EndFunction

int function SetMouseEcho()
var
	int enabled = GetJCFOption(OPT_MOUSE_SPEECH_ENABLED),
	int unit = GetJCFOption(OPT_MOUSE_ECHO_UNIT)
if !enabled
	SetDefaultJCFOption(OPT_MOUSE_SPEECH_ENABLED,On)
	unit = MouseSpeechUnit_First
	SetDefaultJCFOption(OPT_MOUSE_ECHO_UNIT,unit)
	return unit
endIf
if unit == MouseSpeechUnit_Last
	enabled = off
	SetDefaultJCFOption(OPT_MOUSE_SPEECH_ENABLED,Off)
	return MouseSpeechUnit_last+1
else
	unit = unit+1
	SetDefaultJCFOption(OPT_MOUSE_ECHO_UNIT,unit)
	return unit
endIf
EndFunction

int function SetMouseEchoToUnit(int unit)
if unit < MouseSpeechUnit_First || unit > MouseSpeechUnit_Last return false endIf
SetDefaultJCFOption(OPT_MOUSE_SPEECH_ENABLED,On)
SetDefaultJCFOption(OPT_MOUSE_ECHO_UNIT,unit)
return true
EndFunction

int function HasMouseEchoRecentlySpokenUsingUIA()
return GetDefaultJCFOption(OPT_MOUSE_SPEECH_ENABLED)
	&& C_MouseSpeech.element 
	&& GetTickCount()-c_MouseSpeech.SpeechTickTime  <= MouseRecentlyMovedThreshold
EndFunction

string function StringTrimSpokenMouseEchoTextFromToolTipText(string sText)
;make sure that mouse echo is on, and the mouse event occurred in a recent enough time period:
if !HasMouseEchoRecentlySpokenUsingUIA()
	;Either mouse echo is not enabled,
	;or mouse movement happened too long ago,
	;or mouse echo is not using UIA to detect items.
	;Do not trim:
	return sText
endIf
;Null the tooltip text if is duplicates the element name:
if C_MouseSpeech.element.name
&& sText == C_MouseSpeech.element.name
	return cscNull
endIf
var
	string sTrimmedText = sText,
	object pattern
;Only trim duplicated value text when at the beginning of the tooltip text,
;so that we avoid trimming text from within a tooltip sentence:
pattern = C_MouseSpeech.element.GetValuePattern()
if pattern.value
&& StringStartsWith(sTrimmedText,pattern.value)
	sTrimmedText = StringTrimLeadingBlanks(StringChopLeft(sTrimmedText,StringLength(pattern.value)))
endIf
;Don't trim any more if mouse echo isn't speaking help and description:
if !GetDefaultJCFOption(OPT_MouseEchoSpeaksHelpAndDescription)
	return sTrimmedText
endIf
;Trim text if it matches any help or description mouse echo text:
pattern = C_MouseSpeech.element.GetLegacyIAccessiblePattern()
if !pattern return sTrimmedText endIf
var string sDescr = pattern.description
var string sHelp = pattern.help
if !sDescr && !sHelp
	return sTrimmedText
endIf
if sDescr && StringContains(sTrimmedText,sDescr)
	sTrimmedText = StringDiff(sTrimmedText,sDescr)
endIf
if sHelp && StringContains(sTrimmedText,sHelp)
	sTrimmedText = StringDiff(sTrimmedText,sHelp)
endIf
;now that we've trimmed away any duplicated help or description text,
;see if what is left is the name:
if sTrimmedText
&& StringTrimTrailingBlanks(sTrimmedText) == C_MouseSpeech.element.name
	return cscNull
endIf
return sTrimmedText
EndFunction

object function GetMostRecentMouseSpeechUIAElement()
return c_MouseSpeech.element
EndFunction

void function GetMostRecentMouseSpeechCoordinates(int byRef x, int byRef y)
x = c_mouseSpeech.x
y = c_mouseSpeech.y
EndFunction

int function CellReadingVerbosity ()
return ReadSettingInteger (SECTION_NonJCFOptions, hKey_CellReadingVerbosity, readCellContentsAndCoordinates, FT_CURRENT_JCF, rsStandardLayering, "Excel")
endFunction

int function ShouldSpeakDescription()
if GetJCFOption(OPT_MouseEchoSpeaksHelpAndDescription)
	return true
endIf
return ReadSettingInteger (section_MouseEchoItemDescriptionAppExceptions, c_MouseSpeech.appName, false, FT_DEFAULT_JCF, rsNoTransient)
endFunction

Script ToggleMouseEchoItemDescriptionException()
var int toggle
if ReadSettingInteger (section_MouseEchoItemDescriptionAppExceptions, c_MouseSpeech.appName, false, FT_DEFAULT_JCF, rsNoTransient)
	toggle = off
else
	toggle = on
endIf
if WriteSettingInteger (section_MouseEchoItemDescriptionAppExceptions, c_MouseSpeech.appName, toggle, FT_DEFAULT_JCF)
	if toggle
		Say (cmsgMouseEchoItemDescriptionExceptionAdded, OT_STATUS)
	else
		Say (cmsgMouseEchoItemDescriptionExceptionRemoved, OT_STATUS)
	endIf
else
	Say (cmsgMouseEchoItemDescriptionExceptionError, OT_ERROR)
endIf
EndScript
