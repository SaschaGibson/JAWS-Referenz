; Copyright 2023 by Freedom Scientific, Inc.
; JAWS script source for Face in View functions and scripts used by default.jss

include "hjConst.jsh"
include "MSAAConst.jsh"
include "common.jsm"
include "FaceInView.jsm"
import "UIA.jsd"

const
	; horizontal limits, in %%
	HorizontalLocAcceptablePercentageMin = 33, ; anything less is left
	HorizontalLocAcceptablePercentageMax = 67, ; anything more is right
	; horizontal description values
	HorizontalLocDescriptionLeft = 1,
	HorizontalLocDescriptionCenter = 2,
	HorizontalLocDescriptionRight = 3,
	; vertical limits, in %%
	VerticalLocAcceptablePercentageMin = 33, ; anything less is top
	VerticalLocAcceptablePercentageMax = 67, ; anything more is bottom
	; vertical description values
	VerticalLocDescriptionTop = 1,
	VerticalLocDescriptionMiddle = 2,
	VerticalLocDescriptionBottom = 3,
	; brightness limits, in %%
	BrightnessDescriptionPercentageVeryLow = 15, ; anything less is very low
	BrightnessDescriptionPercentageLow = 30, ; anything less is low except when very low
	BrightnessDescriptionPercentageHigh = 70, ; anything more is high except when very high
    BrightnessDescriptionPercentageVeryHigh = 85, ; anything more is very high
    ; brightness description values
    BrightnessDescriptionNoLight = 1,
	BrightnessDescriptionVeryLow = 2,
	BrightnessDescriptionLow = 3,
	BrightnessDescriptionNormal = 4,
	BrightnessDescriptionHigh = 5,
	BrightnessDescriptionVeryHigh = 6,
	; horizontal turn limits, in %%
	HorizontalTurnAcceptablePercentageMin = 25, ; anything less is left
	HorizontalTurnAcceptablePercentageMax = 75, ; anything more is right
	; horizontal Turn description values
	HorizontalTurnDescriptionLeft = 1,
	HorizontalTurnDescriptionCenter = 2,
	HorizontalTurnDescriptionRight = 3,
	; vertical turn limit
	VerticalTurnFlatnessFactor = 85, ; the "flatness" factor for the triangle formed by eyes and nose. if value is higher than this, face is considered turned up
	EyeEarLineTiltingPoint = 0, ; value by which eyes are lower than ears to consider face be turned down
	; vertical turn description values
	VerticalTurnDescriptionTop = 1,
	VerticalTurnDescriptionMiddle = 2,
	VerticalTurnDescriptionBottom = 3,
	MinMovedDistance = 5, ; face movement by smaller % is ignored
	MinBrightnessDistance = 5, ; brightness change by smaller % is ignored
	MinHorizontalTurnDistance = 10, ; face turn by smaller % is ignored
	MinVerticalTurnDistance = 10, ; face turn by smaller value is ignored
	MinEyeEarLineDifference = 10, ; line move by smaller value is ignored
	AnnouncementTimeLimit = 1000, ; don't announce more frequently than this, in milliseconds
	wcFaceInView = "FaceInView"
globals
	int g_confidenceThreshold,
	int g_cameraIndex,
	int g_firstAnnouncement,
	int g_lastNumberOfFaces,
	int g_lastFacePointX,
	int g_lastFacePointY,
	int g_lastHorizontalLocDescription,
	int g_lastVerticalLocDescription,
	int g_lastBrightness,
	int g_lastBrightnessDescription,
	int g_lastLeftEyeX, 
	int g_lastLeftEyeY, 
	int g_lastRightEyeX, 
	int g_lastRightEyeY, 
	int g_lastLeftEarX, 
	int g_lastLeftEarY, 
	int g_lastRightEarX, 
	int g_lastRightEarY, 
	int g_lastMouthX, 
	int g_lastMouthY, 
	int g_lastNoseX, 
	int g_lastNoseY,
	int g_lastHorizontalTurnValue,
	int g_lastHorizontalTurnDescription,
	int g_lastVerticalTurnValue,
	int g_lastEyeEarLine,
	int g_lastVerticalTurnDescription,
	int g_lastAnnouncementTime,
	string g_imageFileName,
	HANDLE g_faceInViewWindow,
	int g_lockMessage, 
	int g_unlockMessage, 
	int g_selectNextCameraMessage, 
	int g_selectPrevCameraMessage,
	int g_setConfidenceThresholdMessage

void Function InitFaceInViewGlobals()
g_selectNextCameraMessage = RegisterWindowMessage("SelectNextCameraFaceInView")
g_selectPrevCameraMessage = RegisterWindowMessage("SelectPrevCameraFaceInView")
g_lockMessage = RegisterWindowMessage("LockTempFileFaceInView")
g_unlockMessage = RegisterWindowMessage("UnlockTempFileFaceInView")
g_setConfidenceThresholdMessage = RegisterWindowMessage("SetConfidenceThresholdFaceInView")
g_confidenceThreshold = IniReadInteger (SECTION_NonJCFOptions, hKey_FaceInViewConfidenceThreshold, 75, file_default_jcf, rsNoTransient)
EnumerateChildWindows (FSUIAGetRootElement().nativeWindowHandle, "EnumIsFaceInViewWindow")
EndFunction

void Function UpdateLastImageFile (string tempFileName)
g_imageFileName = tempFileName
EndFunction

void Function UpdateFaceInViewData(int numberOfFaces, int facePointX, int facePointY, int brightness,
	int leftEyeX, int leftEyeY, int rightEyeX, int rightEyeY, 
	int leftEarX, int leftEarY, int rightEarX, int rightEarY, 
	int mouthX, int mouthY, int noseX, int noseY)
if GetTickCount() - g_lastAnnouncementTime < AnnouncementTimeLimit then return endif
	var int faceLocationIsTheSame, int horizontalLocDescription, int verticalLocDescription
	var int faceLocationShouldBeAnnounced = ShouldSayFaceDescription(numberOfFaces, facePointX, facePointY, faceLocationIsTheSame, horizontalLocDescription, verticalLocDescription)
	var int brightnessIsTheSame, int brightnessDescription
	var int brightnessShouldBeAnnounced = ShouldSayBrightnessDescription(brightness, brightnessIsTheSame, brightnessDescription)
	var int horizontalTurnIsTheSame, int horizontalTurnValue, int horizontalTurnDescription
	var int horizontalTurnShouldBeAnnounced = ShouldSayHorizontalTurnDescription(leftEyeX, leftEyeY, rightEyeX, rightEyeY, noseX, noseY, horizontalTurnIsTheSame, horizontalTurnValue, horizontalTurnDescription)
	var int verticalTurnIsTheSame, int verticalTurnValue, int eyeEarLine, int verticalTurnDescription
	var int verticalTurnShouldBeAnnounced = ShouldSayVerticalTurnDescription(leftEyeX, leftEyeY, rightEyeX, rightEyeY, noseX, noseY, leftEarX, leftEarY, rightEarX, rightEarY, verticalTurnIsTheSame, verticalTurnValue, eyeEarLine, verticalTurnDescription)
	var int turnIsTheSame = horizontalTurnIsTheSame && verticalTurnIsTheSame
	var int turnShouldBeAnnounced = horizontalTurnShouldBeAnnounced || verticalTurnShouldBeAnnounced
	if g_firstAnnouncement Then
		faceLocationShouldBeAnnounced = true
		brightnessShouldBeAnnounced = true
		turnShouldBeAnnounced = true
	EndIf
	if numberOfFaces != 1
		turnShouldBeAnnounced = false
	endIf
	if !faceLocationShouldBeAnnounced && !brightnessShouldBeAnnounced && !turnShouldBeAnnounced then return endif
	if faceLocationIsTheSame && brightnessIsTheSame && turnIsTheSame then return endif
	BeginFlashMessage()
	if faceLocationShouldBeAnnounced && !faceLocationIsTheSame then
		SayFaceDescription(numberOfFaces, horizontalLocDescription, verticalLocDescription)
	endIf
	if turnShouldBeAnnounced && !turnIsTheSame then
		SayTurnDescription(horizontalTurnDescription, verticalTurnDescription)
	endIf
	if brightnessShouldBeAnnounced && !brightnessIsTheSame then
		SayBrightnessDescription(brightnessDescription)
	endIf
	EndFlashMessage()
	UpdateFaceInViewGlobals(false, numberOfFaces, facePointX, facePointY, horizontalLocDescription, verticalLocDescription, brightness, brightnessDescription, 
		leftEyeX, leftEyeY, rightEyeX, rightEyeY, leftEarX, leftEarY, rightEarX, rightEarY, mouthX, mouthY, noseX, noseY, 
		horizontalTurnValue, horizontalTurnDescription, verticalTurnValue, eyeEarLine, verticalTurnDescription)
EndFunction

int function ShouldSayFaceDescription(int numberOfFaces, int facePointX, int facePointY, int byref faceLocationIsTheSame, int byref horizontalLocDescription, int byref verticalLocDescription)
	var int distanceSinceLastPoint = DistanceBetweenPoints(facePointX, facePointY, g_lastFacePointX, g_lastFacePointY)
	horizontalLocDescription = GetHorizontalLocDescription(facePointX)
	verticalLocDescription = GetVerticalLocDescription(facePointY)
	faceLocationIsTheSame = numberOfFaces == g_lastNumberOfFaces && horizontalLocDescription == g_lastHorizontalLocDescription && verticalLocDescription == g_lastVerticalLocDescription
	var int faceLocationIsGood = numberOfFaces == 1 && horizontalLocDescription == HorizontalLocDescriptionCenter && verticalLocDescription == VerticalLocDescriptionMiddle
	var int faceLocationShouldBeAnnounced = (!faceLocationIsTheSame || !faceLocationIsGood) && distanceSinceLastPoint >= MinMovedDistance
	return faceLocationShouldBeAnnounced
EndFunction

int function ShouldSayBrightnessDescription(int brightness, int byref brightnessIsTheSame, int byref brightnessDescription)
	var int distanceInBrightness = abs(brightness - g_lastBrightness)
	brightnessDescription = GetBrightnessDescription(brightness)
	brightnessIsTheSame = brightnessDescription == g_lastBrightnessDescription
	var int brightnessIsGood = brightnessDescription == BrightnessDescriptionNormal
	var int brightnessShouldBeAnnounced = (!brightnessIsTheSame || !brightnessIsGood) && distanceInBrightness >= MinBrightnessDistance
	return brightnessShouldBeAnnounced
endFunction

int function ShouldSayHorizontalTurnDescription(int leftEyeX, int leftEyeY, int rightEyeX, int rightEyeY, int noseX, int noseY, int byref horizontalTurnIsTheSame, int byref horizontalTurnValue, int byref horizontalTurnDescription)
	horizontalTurnValue = GetHorizontalTurnValue(leftEyeX, leftEyeY, rightEyeX, rightEyeY, noseX, noseY)
	var int distanceBetweenHorizontalTurns = abs(horizontalTurnValue - g_lastHorizontalTurnValue)
	horizontalTurnDescription = GetHorizontalTurnDescription(horizontalTurnValue)
	horizontalTurnIsTheSame = horizontalTurnDescription == g_lastHorizontalTurnDescription
	var int horizontalTurnIsGood = horizontalTurnDescription == HorizontalTurnDescriptionCenter
	var int horizontalTurnShouldBeAnnounced = (!horizontalTurnIsTheSame || !horizontalTurnIsGood) && distanceBetweenHorizontalTurns >= MinHorizontalTurnDistance
	return horizontalTurnShouldBeAnnounced
endFunction

int function ShouldSayVerticalTurnDescription(int leftEyeX, int leftEyeY, int rightEyeX, int rightEyeY, int noseX, int noseY, int leftEarX, int leftEarY, int rightEarX, int rightEarY, int byref verticalTurnIsTheSame, int byref verticalTurnValue, int eyeEarLine, int byref verticalTurnDescription)
	verticalTurnValue = GetVerticalTurnValue(leftEyeX, leftEyeY, rightEyeX, rightEyeY, noseX, noseY)
	var int distanceBetweenVerticalTurns = abs(verticalTurnValue - g_lastVerticalTurnValue)
	eyeEarLine = GetEyeEarLine(leftEyeY, rightEyeY, leftEarY, rightEarY)
	var int distanceBetweenEyeEarLines = abs(eyeEarLine - g_lastEyeEarLine)
	verticalTurnDescription = GetVerticalTurnDescription(verticalTurnValue, eyeEarLine)
	verticalTurnIsTheSame = verticalTurnDescription == g_lastVerticalTurnDescription
	var int verticalTurnIsGood = verticalTurnDescription == VerticalTurnDescriptionMiddle
	var int verticalTurnShouldBeAnnounced = (!verticalTurnIsTheSame || !verticalTurnIsGood) && (distanceBetweenVerticalTurns >= MinVerticalTurnDistance || distanceBetweenEyeEarLines >= MinEyeEarLineDifference)
	return verticalTurnShouldBeAnnounced
endFunction

void function SayFaceDescription(int numberOfFaces, int horizontalLocDescription, int verticalLocDescription, optional int invokedFromScript)
var int iOutputType = OT_NO_DISABLE
if invokedFromScript iOutputType = OT_USER_REQUESTED_INFORMATION endIf
if numberOfFaces == 0
	SayFormattedMessage (iOutputType, msgNoFacesDetected_L, msgNoFacesDetected_S)
	return
endIf
var int centered = horizontalLocDescription == HorizontalLocDescriptionCenter && verticalLocDescription == VerticalLocDescriptionMiddle
if centered then
	SayFormattedMessage (iOutputType, msgFaceIsCentered_L, msgFaceIsCentered_S)
	return;
endIf
var string horizontal
if horizontalLocDescription == HorizontalLocDescriptionLeft then
	horizontal = msgHorizontalLocDescriptionLeft
elif horizontalLocDescription == HorizontalLocDescriptionRight then
	horizontal = msgHorizontalLocDescriptionRight
endIf
var string vertical
var string adjust
if verticalLocDescription == VerticalLocDescriptionTop then
	vertical = msgVerticalAdjustDescriptionDown
	adjust = msgVerticalAdjustDescriptionBack
elif verticalLocDescription == VerticalLocDescriptionBottom then
	vertical = msgVerticalAdjustDescriptionUp
	adjust = msgVerticalAdjustDescriptionForward
endIf
if horizontal && vertical
SayFormattedMessage (iOutputType, msgFaceLocationCompound_L, msgFaceLocationCompound_S, vertical, horizontal)
elIf horizontal
SayFormattedMessage (iOutputType, msgFaceLocationHorizontal_L, msgFaceLocationHorizontal_S, horizontal)
elIf vertical
SayFormattedMessage (iOutputType, msgFaceLocationVertical_L, msgFaceLocationVertical_S, vertical, adjust)
endIf
endFunction

void function SayBrightnessDescription(int brightnessDescription, optional int invokedFromScript)
var int iOutputType = OT_NO_DISABLE
if invokedFromScript iOutputType = OT_USER_REQUESTED_INFORMATION endIf
if brightnessDescription == BrightnessDescriptionNoLight
	Say (msgBrightnessDescriptionNoLight, iOutputType)
elIf brightnessDescription == BrightnessDescriptionVeryLow
	SayFormattedMessage (iOutputType, msgBrightnessDescription_L, msgBrightnessDescription_S, msgBrightnessDescriptionVeryLow)
elif brightnessDescription == BrightnessDescriptionLow
	SayFormattedMessage (iOutputType, msgBrightnessDescription_L, msgBrightnessDescription_S, msgBrightnessDescriptionLow)
elif brightnessDescription == BrightnessDescriptionNormal
	SayFormattedMessage (iOutputType, msgBrightnessDescription_L, msgBrightnessDescription_S, msgBrightnessDescriptionNormal)
elif brightnessDescription == BrightnessDescriptionHigh
	SayFormattedMessage (iOutputType, msgBrightnessDescription_L, msgBrightnessDescription_S, msgBrightnessDescriptionHigh)
elif brightnessDescription == BrightnessDescriptionVeryHigh
	SayFormattedMessage (iOutputType, msgBrightnessDescription_L, msgBrightnessDescription_S, msgBrightnessDescriptionVeryHigh)
endIf
endFunction

void function SayTurnDescription(int horizontalTurnDescription, int verticalTurnDescription, optional int invokedFromScript)
var int iOutputType = OT_NO_DISABLE
if invokedFromScript iOutputType = OT_USER_REQUESTED_INFORMATION endIf
var int facePointsToCameraCenter = horizontalTurnDescription == HorizontalTurnDescriptionCenter && verticalTurnDescription == VerticalTurnDescriptionMiddle
if facePointsToCameraCenter then
	SayFormattedMessage (iOutputType, msgTurnDescriptionCenter_L, msgTurnDescriptionCenter_S)
	return;
endIf
var string horizontal
if horizontalTurnDescription == HorizontalTurnDescriptionLeft then
	horizontal = msgHorizontalTurnDescriptionLeft
elif horizontalTurnDescription == HorizontalTurnDescriptionRight then
	horizontal = msgHorizontalTurnDescriptionRight
endIf
var string vertical
if verticalTurnDescription == VerticalTurnDescriptionTop then
	vertical = msgTiltDescriptionDown
elif verticalTurnDescription == VerticalTurnDescriptionBottom then
	vertical = msgTiltDescriptionUp
endIf
if horizontal && vertical
SayFormattedMessage (iOutputType, msgFaceTurnCompound_L, msgFaceTurnCompound_S, horizontal, vertical)
elIf horizontal
SayFormattedMessage (iOutputType, msgFaceTurnHorizontal_L, msgFaceTurnHorizontal_S, horizontal)
elIf vertical
SayFormattedMessage (iOutputType, msgFaceTiltVertical_L, msgFaceTiltVertical_S, vertical)
endIf
endFunction

void function UpdateFaceInViewGlobals(int firstAnnouncement, int numberOfFaces, int facePointX, int facePointY, int HorizontalLocDescription, int VerticalLocDescription, int brightness, int brightnessDescription,
	int leftEyeX, int leftEyeY, int rightEyeX, int rightEyeY, int leftEarX, int leftEarY, int rightEarX, int rightEarY, int mouthX, int mouthY, int noseX, int noseY, 
	int horizontalTurnValue, int horizontalTurnDescription, int verticalTurnValue, int eyeEarLine, int verticalTurnDescription)
	g_firstAnnouncement = firstAnnouncement
	g_lastNumberOfFaces = numberOfFaces
	g_lastFacePointX = facePointX
	g_lastFacePointY = facePointY
	g_lastHorizontalLocDescription = horizontalLocDescription 
	g_lastVerticalLocDescription = verticalLocDescription
	g_lastBrightness = brightness
	g_lastBrightnessDescription = brightnessDescription
	g_lastLeftEyeX = leftEyeX
	g_lastLeftEyeY = leftEyeY
	g_lastRightEyeX = rightEyeX
	g_lastRightEyeY = rightEyeY
	g_lastLeftEarX = leftEarX
	g_lastLeftEarY = leftEarY
	g_lastRightEarX = rightEarX
	g_lastRightEarY = rightEarY
	g_lastMouthX = mouthX
	g_lastMouthY = mouthY
	g_lastNoseX = noseX
	g_lastNoseY = noseY
	g_lastHorizontalTurnValue = horizontalTurnValue
	g_lastHorizontalTurnDescription = horizontalTurnDescription
	g_lastVerticalTurnValue = verticalTurnValue
	g_lastEyeEarLine = eyeEarLine
	g_lastVerticalTurnDescription = verticalTurnDescription
	g_lastAnnouncementTime = GetTickCount()
EndFunction

void function ClearFaceInViewGlobals()
	UpdateFaceInViewGlobals(true, -1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)
EndFunction

int function GetHorizontalLocDescription(int facePointX)
	if facePointX == 0 return 0; 
	elif facePointX < HorizontalLocAcceptablePercentageMin return HorizontalLocDescriptionLeft 
	elif facePointX > HorizontalLocAcceptablePercentageMax return HorizontalLocDescriptionRight
	else return HorizontalLocDescriptionCenter
	endIf
EndFunction

int function GetVerticalLocDescription(int facePointY)
	if facePointY == 0 return 0; 
	elif facePointY < VerticalLocAcceptablePercentageMin return VerticalLocDescriptionTop
	elif facePointY > VerticalLocAcceptablePercentageMax return VerticalLocDescriptionBottom
	else return VerticalLocDescriptionMiddle
	endIf
EndFunction

int function GetBrightnessDescription(int brightness)
	if brightness == 0 return BrightnessDescriptionNoLight
	elif brightness < BrightnessDescriptionPercentageVeryLow return BrightnessDescriptionVeryLow
	elif brightness < BrightnessDescriptionPercentageLow return BrightnessDescriptionLow
	elif brightness > BrightnessDescriptionPercentageVeryHigh return BrightnessDescriptionVeryHigh
	elif brightness > BrightnessDescriptionPercentageHigh return BrightnessDescriptionHigh
	else return BrightnessDescriptionNormal
	endIf
EndFunction

int function Square(int x)
	return x*x
endFunction

int function GetHorizontalTurnValue(int leftEyeX, int leftEyeY, int rightEyeX, int rightEyeY, int noseX, int noseY)
	; find nose point projection to leftEye-rightEye line by drawing a perpendicular line from nose to eyes line
	var int s = ((noseX - leftEyeX) * (rightEyeX - leftEyeX) + (noseY - leftEyeY) * (rightEyeY - leftEyeY)) * 100 / (Square(rightEyeX - leftEyeX) + Square(rightEyeY - leftEyeY))
	var int projectionX = leftEyeX + s * (rightEyeX - leftEyeX) / 100
	var int projectionY = leftEyeY + s * (rightEyeY - leftEyeY) / 100
	if projectionX < leftEyeX then return -1 endif ; nose is to the left of left eye
	if projectionX > rightEyeX then return 101 endif ; nose is to the right of right eye
	var int distanceBetweenEyes = DistanceBetweenPoints(leftEyeX, leftEyeY, rightEyeX, rightEyeY)
	var int distanceBetweenProjectionToLeftEye = DistanceBetweenPoints(projectionX, projectionY, leftEyeX, leftEyeY)
	; the idea is if distance between nose projection point and eyes is small relative to the other than the face is turned in the direction of the smaller side
	var int horizontalTurnFactor = distanceBetweenProjectionToLeftEye * 100 / distanceBetweenEyes
	return horizontalTurnFactor
EndFunction

void function GetDistances(int x1, int y1, int x2, int y2, int x3, int y3, int byref distance12, int byref distance13, int byref distance23)
	distance12 = DistanceBetweenPoints(x1, y1, x2, y2)
	distance13 = DistanceBetweenPoints(x1, y1, x3, y3)
	distance23 = DistanceBetweenPoints(x2, y2, x3, y3)
EndFunction

int function GetVerticalTurnValue(int leftEyeX, int leftEyeY, int rightEyeX, int rightEyeY, int noseX, int noseY)
	; Code defining the triangle formed by the eyes and nose
	var int distanceBetweenEyes, int distanceBetweenLeftEyeAndNose, int distanceBetweenRightEyeAndNose
	GetDistances(leftEyeX, leftEyeY, rightEyeX, rightEyeY, noseX, noseY, distanceBetweenEyes, distanceBetweenLeftEyeAndNose, distanceBetweenRightEyeAndNose)
	; If distanceBetweenLeftEyeAndNose+distanceBetweenRightEyeAndNose approaches the value of distanceBetweenEyes then the triangle becomes flat, meaning that the face is tilted up.
    ; distanceBetweenEyes/(distanceBetweenLeftEyeAndNose+distanceBetweenRightEyeAndNose) will be between (0, 100). The higher the value the more "flat" the triangle
    var int verticalTurnFactor = distanceBetweenEyes * 100 / (distanceBetweenLeftEyeAndNose + distanceBetweenRightEyeAndNose)
    return verticalTurnFactor
EndFunction

int function GetEyeEarLine(int leftEyeY, int rightEyeY, int leftEarY, int rightEarY)
    ; If the average Y value of the eyes is below that of the ears than th face is tilted down.
    var int averageEyeY = (rightEyeY + leftEyeY) / 2;
    var int averageEarY = (rightEarY + leftEarY) / 2;
    var int eyeEarLine = averageEyeY - averageEarY
    return eyeEarLine
EndFunction

int function GetHorizontalTurnDescription(int horizontalTurnValue)
	if horizontalTurnValue < HorizontalTurnAcceptablePercentageMin return HorizontalTurnDescriptionLeft
	elif horizontalTurnValue > HorizontalTurnAcceptablePercentageMax return HorizontalTurnDescriptionRight
	else return HorizontalTurnDescriptionCenter
	EndIf
EndFunction

int function GetVerticalTurnDescription(int verticalTurnValue, int eyeEarLine)
if verticalTurnValue > VerticalTurnFlatnessFactor then return VerticalTurnDescriptionTop EndIf
if eyeEarLine > EyeEarLineTiltingPoint then return VerticalTurnDescriptionBottom EndIf
return VerticalTurnDescriptionMiddle
EndFunction

function SayDetailedFaceInViewDescription()
BeginFlashMessage()
if g_lastNumberOfFaces >= 2 Then
	SayMessage (OT_USER_REQUESTED_INFORMATION, msgMultipleFacesDetected_L, msgMultipleFacesDetected_S)
elif g_lastNumberOfFaces <= 0 Then
	SayFormattedMessage (OT_USER_REQUESTED_INFORMATION, msgNoFacesDetected_L, msgNoFacesDetected_S)
else
	SayFormattedMessage (OT_USER_REQUESTED_INFORMATION, msgDetailedFaceLocation_L, msgDetailedFaceLocation_S, IntToString(100-g_lastFacePointX), IntToString(g_lastFacePointY))
	SayFaceDescription(g_lastNumberOfFaces, g_lastHorizontalLocDescription, g_lastVerticalLocDescription, true)
	SayTurnDescription(g_lastHorizontalTurnDescription, g_lastVerticalTurnDescription, true)
endIf
SayBrightnessDescription(g_lastBrightnessDescription, true)
EndFlashMessage()
endFunction

int Function EnumIsFaceInViewWindow (handle hwnd)
if StringContains (GetWindowClass (hwnd), wcFaceInView)
	g_faceInViewWindow = hwnd
	return false
endIf
return true
EndFunction

; find face in view window and assign its handle into g_faceInViewWindow
Int Function IsFaceInViewActive()
return !EnumerateChildWindows (FSUIAGetRootElement().nativeWindowHandle, "EnumIsFaceInViewWindow")
EndFunction

Script SayFaceInViewDescription()
if !IsFaceInViewActive()
	SayFormattedMessage (OT_ERROR, msgFaceInViewNotActive_L, msgFaceInViewNotActive_S)
	return
endIf
var int role = GetObjectRole()
if role == ROLE_SYSTEM_PUSHBUTTON || 
role == ROLE_SYSTEM_LISTITEM Then
	TypeCurrentScriptKey()
	return
Endif
SayDetailedFaceInViewDescription()
EndScript

Script SayFaceInViewBrightness()
if !IsFaceInViewActive()
	SayFormattedMessage (OT_ERROR, msgFaceInViewNotActive_L, msgFaceInViewNotActive_S)
	return
endIf
SayBrightnessDescription(g_lastBrightnessDescription, true)
EndScript

Script OpenFaceInView()
ClearFaceInViewGlobals()
Say(msgOpeningFaceInView, OT_APP_START)
g_cameraIndex = IniReadInteger (SECTION_NonJCFOptions, hKey_FaceInViewCameraIndex, 0, file_default_jcf, rsNoTransient)
OpenFaceInView(g_cameraIndex)
InitFaceInViewGlobals()
EndScript

Script CloseFaceInView()
Say(msgClosingFaceInView, OT_NO_DISABLE)
CloseFaceInView()
ClearFaceInViewGlobals()
EndScript

Script ToggleFaceInView()
if IsFaceInViewActive()
	PerformScript CloseFaceInView()
else
	PerformScript OpenFaceInView()
endIf
EndScript

Script FaceInViewPictureSmart ()
if !IsFaceInViewActive()
	SayFormattedMessage (OT_ERROR, msgFaceInViewNotActive_L, msgFaceInViewNotActive_S)
	return
endIf
if !IsPictureSmartEnabled() then
	Return
endIf

var int recognitionResult = IsTelemetryEnabled(TRUE);
If recognitionResult == PSResult_DemoMode then
	sayMessage (OT_ERROR,  msg_picturesmart_demomode)
ElIf recognitionResult != PSResult_Success then
	; no message needed since the function prompts
	return
EndIf

PostMessage (g_faceInViewWindow, g_lockMessage ,0 ,0 )

recognitionResult = DescribeFile(g_imageFileName, PSServiceOptions_FaceInView, cscNULL)
If recognitionResult == PSResult_DemoMode then
	sayMessage (OT_ERROR,  msg_picturesmart_demomode)	
ElIf recognitionResult == PSResult_UnsupportedFileSelected then
	SayFormattedMessage (OT_ERROR,  msg_picturesmart_unsupportedformat)
ElIf recognitionResult != PSResult_Success then
	SayFormattedMessage (OT_ERROR,  msg_picturesmart_failedtostart)
EndIf

ScheduleFunction ("UnlockFile", 50, false)
EndScript

void Function UnlockFile()
PostMessage (g_faceInViewWindow, g_unlockMessage ,0 ,0 )
EndFunction

script FaceInViewLayerHelp()
UserBufferClearResultsViewer ()
UpdateResultsViewerTitle (cmsgFaceInViewLayerHelpScreenTitle)
UserBufferAddTextResultsViewer(cmsgFaceInViewLayerHelp)
EndScript

Script FaceInViewNextCamera ()
if !IsFaceInViewActive()
	SayFormattedMessage (OT_ERROR, msgFaceInViewNotActive_L, msgFaceInViewNotActive_S)
	return
endIf
PostMessage (g_faceInViewWindow, g_selectNextCameraMessage,0 ,0 )
EndScript

Script FaceInViewPreviousCamera ()
if !IsFaceInViewActive()
	SayFormattedMessage (OT_ERROR, msgFaceInViewNotActive_L, msgFaceInViewNotActive_S)
	return
endIf
PostMessage (g_faceInViewWindow, g_selectPrevCameraMessage,0 ,0 )
EndScript

Void Function UpdateCamera (string cameraName,int cameraIndex)
g_cameraIndex = cameraIndex
IniWriteInteger (SECTION_NonJCFOptions, hKey_FaceInViewCameraIndex, g_cameraIndex, file_default_jcf, true, wdUser)
SayCameraName(cameraName)
EndFunction

Void Function SayCameraName (string cameraName)
var string message = FormatString(msgUsingCamera, cameraName)
Say(message, OT_NO_DISABLE)
EndFunction

script FaceInViewCameraLayerHelp()
UserBufferClearResultsViewer ()
UpdateResultsViewerTitle (cmsgFaceInViewCameraLayerHelpScreen)
UserBufferAddTextResultsViewer(cmsgFaceInViewCameraLayerHelp)
EndScript


void function UpdateConfidenceThreshold ()
PostMessage (g_faceInViewWindow, g_setConfidenceThresholdMessage,0 ,g_confidenceThreshold )
EndFunction 

int function NextConfidenceThreshold()
if (g_confidenceThreshold == 70)
	return 75
EndIf
if (g_confidenceThreshold == 75)
	return 80
EndIf
return 70
EndFunction

Script FaceInViewChangeConfidenceThreshold ()
if !IsFaceInViewActive()
	SayFormattedMessage (OT_ERROR, msgFaceInViewNotActive_L, msgFaceInViewNotActive_S)
	return
endIf
g_confidenceThreshold = NextConfidenceThreshold()
var string message = FormatString(msgUpdatingConfidenceThreshold, g_confidenceThreshold)
Say(message, OT_NO_DISABLE)
UpdateConfidenceThreshold()
IniWriteInteger (SECTION_NonJCFOptions, hKey_FaceInViewConfidenceThreshold, g_confidenceThreshold, file_default_jcf, true, wdUser)
EndScript
