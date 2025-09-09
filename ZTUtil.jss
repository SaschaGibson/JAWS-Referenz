; Copyright 2022 by Freedom Scientific, Inc.
; Freedom Scientific script file containing ZoomText functions used by JAWS scripts.
; see ZoomText script files for the ZoomText UI scripts.

Include "HJConst.jsh"
include "ZTUtil.jsh"

globals
	object _ZT_Reserved_Global_,
	object _ZT_Reserved_Magnification_,
	object _ZT_Reserved_TetheredViewSettings_


void function InitZTReservedGlobal()
_ZT_Reserved_Global_ = Null()
_ZT_Reserved_Magnification_ = Null()
_ZT_Reserved_TetheredViewSettings_ = Null()
_ZT_Reserved_Global_ = CreateObject("ZoomText.Application")
_ZT_Reserved_Magnification_ = _ZT_Reserved_Global_.Magnification
_ZT_Reserved_TetheredViewSettings_ = _ZT_Reserved_Magnification_.TetheredViewSettings
EndFunction

void function ZTInsureInitGlobals()
if !_ZT_Reserved_Global_
|| !_ZT_Reserved_Magnification_
|| !_ZT_Reserved_TetheredViewSettings_
	InitZTReservedGlobal()
endIf
EndFunction

Object Function ZTGetZOM ()
return CreateObject("ZoomText.Application")
EndFunction

object function ZTCreateRect(int iLeft, int iTop, int iRight, int iBottom)
if !_ZT_Reserved_Global_
|| iLeft == iRight
|| iTop == iBottom
	return Null()
endIf
var
	object oRect = _ZT_Reserved_Global_.CreateObject("Rectangle")
	oRect.Left = iLeft
	oRect.Top = iTop
	oRect.Right = iRight
	oRect.Bottom = iBottom
return oRect
EndFunction

Object Function ZTCreateRectFromWindow (handle hWnd)
if !_ZT_Reserved_Global_ return endIf
var
	int iLeft,
	int iTop,
	int iRight,
	int iBottom
if GetWindowRect (hWnd, iLeft, iRight, iTop, iBottom)	
	return ZTCreateRect(iLeft, iTop, iRight, iBottom)
endIf
return Null()
EndFunction

Object Function ZTCreateRectFromUIAElement (object oElement)
if !oElement return Null() endIf
var
	int iLeft,
	int iTop,
	int iRight,
	int iBottom,
	object oRect = oElement.BoundingRectangle
return ZTCreateRect(oRect.Left, oRect.Top, oRect.Right, oRect.Bottom)
EndFunction

Int Function ZTGetRectHeight (object oRect)
return abs (oRect.Bottom - oRect.Top)
EndFunction

Int Function ZTGetRectWidth (object oRect)
return abs (oRect.Right - oRect.Left)
EndFunction

object Function ZTGetTetheredViewScenario (string sScenarioName)
ZTInsureInitGlobals()
if !_ZT_Reserved_Global_ || !sScenarioName return Null() endIf
var
	object oTethered,
	object oStore = _ZT_Reserved_Global_.ObjectStore
oTethered = oStore.Get(sScenarioName)
if oTethered return oTethered endIf
oTethered = _ZT_Reserved_Global_.CreateObject("TetheredViewScenario")
if oTethered
	oTethered.RegisterWithUI(sScenarioName, TetheredWindow_Show)
	oTethered.AllowDestinationToOverlapSourceLocation = FALSE
	oTethered.OnShowRouteMouseToFocus = FALSE
	oTethered.AddPaddingToDestinationLocation = TRUE
	oStore.Add(sScenarioName, oTethered)
endIf
return oTethered
EndFunction

Void Function ZTSetTetheredViewFocusLocation (object ByRef oTethered, object oRect)
if !oTethered || !oRect return endIf
oTethered.FocusLocation = oRect
EndFunction

Void Function ZTSetTetheredViewSourceLocation (object ByRef oTethered, object oRect)
if !oTethered || !oRect return endIf
oTethered.SourceLocation = oRect
EndFunction

Void Function ZTSetTetheredViewDestinationLocation (object ByRef oTethered, optional object oRect)
if !oTethered return endIf
if oRect
	oTethered.DestinationLocation = oRect
else
	oTethered.DestinationLocation = ZTCalculateTetheredViewDestinationLocation(oTethered)
endIf
EndFunction

object function ZTCalculateTetheredViewDestinationLocation(object oTethered)
if !_ZT_Reserved_Global_ || !oTethered return endIf
var
	object oDestinationRect = _ZT_Reserved_Global_.CreateObject("Rectangle"),
	object oFocusRect = oTethered.FocusLocation,
	object oSourceRect = oTethered.SourceLocation
if !oFocusRect || !oSourceRect return Null() endIf
if oFocusRect.top < oSourceRect.top
	;if the focus control is above the tethered source
	;we need to display the tethered window directly below the focus control
	oDestinationRect.top = oFocusRect.bottom
	oDestinationRect.bottom = oFocusRect.bottom + ZTGetRectHeight (oSourceRect)
else
	;if the focus control is below the tethered source
	;we need to display the tethered window directly above the focus control
	oDestinationRect.bottom = oFocusRect.top
	oDestinationRect.top = oFocusRect.top - ZTGetRectHeight (oSourceRect)
endIf
if IsRTLLanguageProcessorLoaded ()
	oDestinationRect.right = oFocusRect.right
	oDestinationRect.left = oFocusRect.right - ZTGetRectWidth (oSourceRect)
else
	oDestinationRect.left = oFocusRect.left
	oDestinationRect.right = oFocusRect.left + ZTGetRectWidth (oSourceRect)
endIf
      return oDestinationRect;
endFunction

Void Function ZTTetheredViewUpdateLocations (object ByRef oTethered, object oFocusRect, optional object oSourceRect, optional object oDestinationRect)
if !oTethered.Enabled return endIf
ZTSetTetheredViewFocusLocation (oTethered, oFocusRect)
ZTSetTetheredViewSourceLocation (oTethered, oSourceRect)
ZTSetTetheredViewDestinationLocation (oTethered, oDestinationRect)
oTethered.UpdateLocations()
EndFunction

Void Function ZTTetheredViewWindowContainingSource (object ByRef oTethered, handle hWnd)
oTethered.WindowContainingSource = hWnd
EndFunction

Void Function ZTShowTetheredViewScenario (object ByRef oTethered)
if oTethered.Enabled
	oTethered.Show()
endIf
EndFunction

Void Function ZTHideTetheredViewScenario (object ByRef oTethered)
if oTethered
&& oTethered.Name == ZTCurrentTetheredViewScenario ()
	oTethered.Hide()
endIf
EndFunction

string Function ZTCurrentTetheredViewScenario ()
if !_ZT_Reserved_Global_ return endIf
return _ZT_Reserved_Global_.CreateObject("TetheredViewScenario").CurrentScenario
EndFunction

Int Function ZTIsTetheredViewEnabled ()
ZTInsureInitGlobals()
return _ZT_Reserved_TetheredViewSettings_.Enabled == ZTTrue
EndFunction
